// ==UserScript==
// @name     Vakantieveilingen bieder
// @version  1
// @grant    none
// @run-at      document-idle
// @include      https://www.vakantieveilingen.be/*
// @description:nl      Automatische bieder voor vakantieveilingen. Kan ook de geschiedenis van prijzen bijhouden
// @description         Automatische bieder voor vakantieveilingen. Kan ook de geschiedenis van prijzen bijhouden
// @namespace https://greasyfork.org/users/204141
// @downloadURL https://update.greasyfork.org/scripts/371047/Vakantieveilingen%20bieder.user.js
// @updateURL https://update.greasyfork.org/scripts/371047/Vakantieveilingen%20bieder.meta.js
// ==/UserScript==

//if(document.location == "https://www.vakantieveilingen.be/clear"){
//  localStorage.setItem('history',JSON.stringify({}))
//}

const bidMap = {
  "https://www.vakantieveilingen.be/eten-en-drinken/dineren/3-gangen_menu.html": 10,
  "https://www.vakantieveilingen.be/dagje-uit/musea/3d-world_oostende.html" : 5,
  "https://www.vakantieveilingen.be/dagje-uit/watersport/aqualibi_waterpark.html": 5,
  "https://www.vakantieveilingen.be/producten/elektronica/bluetooth-koptelefoon_dutch-originals.html" : 5,
  "https://www.vakantieveilingen.be/producten/koken-en-tafelen/magnani_italy-messenset-met-schaar.html": 5,
  "https://www.vakantieveilingen.be/producten/elektronica/nedis_in-ear.html":3,
  "https://www.vakantieveilingen.be/dagje-uit/pretparken/themapark_bellewaerde.html":10,
  "https://www.vakantieveilingen.be/dagje-uit/pretparken/walibi_belgium.html":15,
  "https://www.vakantieveilingen.be/dagje-uit/pretparken/bobbejaanland_pretpark.html":10,
  "https://www.vakantieveilingen.be/producten/elektronica/philips-_speaker-izzy-wit.html":5,
  "https://www.vakantieveilingen.be/producten/horloges/horloge_thomas-earnshaw-bauer-01.html":20,
  "https://www.vakantieveilingen.be/producten/horloges/executive_nicky.html":20,
  "https://www.vakantieveilingen.be/producten/wonen/luchtbed_ingebouwde-pomp.html":10,
  "https://www.vakantieveilingen.be/producten/elektronica/denver_noisecancelling.html":10,
  "https://www.vakantieveilingen.be/producten/elektronica/denver_hoofdtelefoon.html":5,
  "https://www.vakantieveilingen.be/producten/koken-en-tafelen/leren_schort-zwart.html":10,
  "https://www.vakantieveilingen.be/producten/elektronica/google_chromecast-2.html":5,
  "https://www.vakantieveilingen.be/producten/elektronica/waterproof-bluetooth-speaker_gecko-sound-rectangle.html":5,
  "https://www.vakantieveilingen.be/producten/elektronica/philips_actiofit.html":20,
  "https://www.vakantieveilingen.be/dagje-uit/indoor/escape-bus_antwerpen.html":10,
  "https://www.vakantieveilingen.be/eten-en-drinken/thuisbezorgen/barbecue_thuisbezorgd.html":10,
  "https://www.vakantieveilingen.be/pretpark-en-zoo/onze-pretparken/plopsa_funcard.html": 20,
  "https://www.vakantieveilingen.be/producten/klussen/premium_gereedschapskoffer-.html": 30,
  "https://www.vakantieveilingen.be/producten/elektronica/geluid_soundbar.html": 5,
  "https://www.vakantieveilingen.be/producten/koken-en-tafelen/berlinger-haus_messenset-standaard.html" : 5,
  "https://www.vakantieveilingen.be/producten/koken-en-tafelen/berlinger-haus_messenset-bh2399.html" : 5,
  "https://www.vakantieveilingen.be/producten/koken-en-tafelen/keukenrobot_zwart.html" : 5,
  "https://www.vakantieveilingen.be/producten/klussen/gereedschapskoffer_179-delig.html":20
}

if(document.location == "https://www.vakantieveilingen.be/start"){
  Object.keys(bidMap).forEach((k) => {window.open(k)})
}

let maxBid = 0;

if(bidMap[document.location]){
  maxBid = bidMap[document.location];
}else{
  console.log("Ignoring this page")
  return;
}
console.log("Bidding Started With max bid: "+maxBid);

const me = "Ingmar Dasseville";

function hasWon(){
    return Boolean(localStorage.getItem(document.location))
}
function win(){
    localStorage.setItem(document.location,true)
}


function currentBidding() {
    const query = ".placeFastBidControl > label";
    const label = document.querySelector(query);
    return Number(label.innerHTML) - 1;
}


let _getRemainingTime = function(){

    let remainingSeconds = document.querySelector('.timer-countdown-label');
    if(remainingSeconds){

        return `00:00:${remainingSeconds.innerText}`;
    }

    let times = document.querySelectorAll('#biddingBlock .jsDisplayedTimeValue .time-value');
    if(times && times.length){

        let hh = times[0].innerText;
        let mm = times[1].innerText;
        let ss = times[2].innerText;

        return `${hh}:${mm}:${ss}`;
    }

    return undefined;
};

let getRemainingSeconds = function(){
    return _timeToSeconds(_getRemainingTime());
};

let singleStat = function(url, val) {
   let amounts = val.map((a) => {return a.amount})
   let count = amounts.length;
   let max = Math.max(...amounts);
   let min = Math.min(...amounts);
   let average = amounts.reduce((previous, current) => current += previous);
   average /= count;
	 console.log(url)
   console.log(" Sold: " + count + ", Max: "+ max + ", Min: "+ min + " Avg: "+average)
}

let stats = function() {
  const histo = JSON.parse(localStorage.getItem('history')) || {};
  Object.keys(histo).forEach((k) => {singleStat(k,histo[k])})
}

stats()

let highestBidder = function() {
    return {
        time: _timeToSeconds(document.getElementById('timeOfHighestBid').innerText),
        name: document.getElementById('highestBidder').innerText,
        amount: parseInt(document.getElementById('jsMainLotCurrentBid').innerText)
    }
};

let _timeToSeconds = function(hms){
    if(!hms){
        return undefined;
    }

    let a = hms.split(':'); // split it at the colons

    let hh = parseInt(a[0]);
    let mm = parseInt(a[1]);
    let ss = parseInt(a[2]);

    return (hh * 60 * 60 + mm * 60 + ss);
};

function placeBid(){
    const curBid = currentBidding();
    if(curBid < maxBid){
        const willBid = curBid + 1;
        doBid(willBid)
    }else{
      console.log("Not bidding")
    }
}

function doBid(amount){
    if(highestBidder().name === me){
        console.log("\tStill the top bid")
    }
    document.getElementById("jsActiveBidInput").value = amount;
    document.getElementById("jsActiveBidButton").click();
    console.log("Bid: " + amount + "EUR")
}

function checkFinished(){
    const a = document.querySelector('.resultsBlockTitle')
    return Boolean(a)
}

function updateHistory(winner){
    const histo = JSON.parse(localStorage.getItem('history')) || {};
    if(histo[document.location] === undefined){
        histo[document.location] = []
    }
    histo[document.location].push(winner);
    localStorage.setItem('history',JSON.stringify(histo))
}

function finishUp(){
  console.log("Veiling afgelopen")
  console.log(document.querySelector('.resultsBlockTitle').innerText)
  const high = highestBidder();
  console.log(high);
  if(high.name === me){
    console.log("Congratz, gewonnen!")
    win()
  }else{
    console.log("En je hebt ze verloren")
  }
  updateHistory(high);
  console.log("History updated, reloading in 20 seconds")
  setTimeout(function() {location.reload(); console.log("reloaded");}, 20*1000)
}


let loop = function() {
    if(hasWon()){
        return
    }
    if(checkFinished()){
      	finishUp()
      	return
    }
    const sec = getRemainingSeconds();
    if(sec && sec < 2){
        placeBid()
    }
  	if(sec && sec < 5){
      setTimeout(loop, 50)
    }else{
    	setTimeout(loop, 1000)
    }
};

loop();
console.log(JSON.parse(localStorage.getItem('history')));

function reloadPage() {
  location.reload();
}

setTimeout(reloadPage, 5*60*1000);