// ==UserScript==
// @name         jogar v2
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  ...
// @author       ...
// @match        https://play.pegaxy.io/racing/finish*
// @match        https://play.pegaxy.io/racing/pick-pega*
// @match        https://play.pegaxy.io/racing/*
// @icon         https://www.google.com/s2/favicons?domain=pegaxy.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443387/jogar%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/443387/jogar%20v2.meta.js
// ==/UserScript==


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const $ = (elem) => {

  if (document.querySelector('iframe')){
    return document.querySelector(elem); // return document.querySelector('iframe').contentWindow.document.body.querySelector(elem);
  } else {
	  return document.querySelector(elem);
  }
};

const $a = (elem) => {
  if (document.querySelector('iframe')){
    return document.querySelectorAll(elem); // return document.querySelector('iframe').contentWindow.document.body.querySelectorAll(elem);
  } else {
	  return document.querySelectorAll(elem);
  }
};

const $remove = (elem) => {
  try{$(elem).style.display = "none";} catch(e){}
};

(async function() {
    var comingSoon = 0;
    var joinMatch = 0;

    while(true){

      if (window.location.href.startsWith("https://play.pegaxy.io/racing/live")) {
        await restart();
      }

      await sleep(1000);

      try{$("div.bx-content.match-found").style.background =  'none';} catch(e){}
      $remove("div.race-track");
      $remove("div.thumb-cover");
      $remove("div.item-cover-img");
      $remove(".alert-icon-img");

      connect();

      if (isMatchingfreeze()) {
        await restart("Matchingfreeze - reloading")
        continue;
      }

      if (isComingSoon()) {
        comingSoon ++;
      } else {
        comingSoon = 0;
      }

      if (comingSoon > 10) {
        await restart("ComingSoon - reloading")
        continue;
      }


      if (isJoinMatch()) {
        joinMatch ++;
      } else {
        joinMatch = 0;
      }

      if (joinMatch > 30) {
        await restart("JoinMatch - reloading")
        continue;
      }

      if(!$(".viewAlert")){

        var botaoNextMatch = $(".button-game.pinks");
        if(botaoNextMatch && (botaoNextMatch.innerText == "NEXT MATCH" || botaoNextMatch.innerText == "Find another match")){
          console.log("Vai clicar no next match");
          botaoNextMatch.click();
          await sleep(1000);
        }

        var pegaIndex = getMaxEnergy();

        if (pegaIndex === undefined) {
          await sleep(2000);
          continue
        }

        if(pegaIndex >=0 ){

          console.log("Vai clicar no pega");
          var pegaxy = $a(".item-pega")[pegaIndex];
          pegaxy.click();
          await sleep(1000);
          console.log("Clicou no pega");
        }
        else {
          await restart("Recarregando após energia zerada - reloading")
          continue
        }

        var botaoStart = $(".viewButton");

        if(botaoStart && botaoStart.innerText == "START"){
          botaoStart.click();
          console.log("Clicou no START");
        } else {
          console.log("Não achou START");
        }
      }
      else {

        console.log("Tem alerta");
        var botao = $(".button-game.pinks");
        if(botao){
          botao.click();
        }

        botao = $(".button-game.primary");
        if(botao && botao.innerText == "I understand"){
            botao.click();
        }
      }

    }

    function getMaxEnergy() {

      if (!$(".pick-pega > .list-pick div")){
        return undefined;
      }

      let maxEnergy = -1;
      let pegaMaxEnergy = -1;

      for (var i = 0; i <= 3; i++) {
        const pegaObject = $(".pick-pega > .list-pick > div.item-pega:nth-of-type(" + (i + 1) + ") div div div:nth-of-type(3) div:nth-of-type(2) div div:nth-of-type(2) div span");
        if (pegaObject){
          const actualEnergy = pegaObject.textContent.split("/25")[0]
          if (actualEnergy > 0 && actualEnergy > maxEnergy){
            maxEnergy = actualEnergy;
            pegaMaxEnergy = i
          }
        }
      }

      return pegaMaxEnergy;

    }

    async function connect() {
      const connect = $("li.nav-item.link-connect.active > span");

      if (!!(connect && connect.textContent == "Connect")){
        console.log("conectando na metamask");
        connect.click();
        await sleep(500);
        $("div.login-btn > div:nth-of-type(2)").click();
        await sleep(2000);
        console.log("fim da conexao");
      }
    }

    function isMatchingfreeze() {
      return  !!($("div.thumb-matching span:nth-of-type(2)") && $("div.thumb-matching span:nth-of-type(2)").textContent > 120)
    }

    function isComingSoon() {
      return  !!($("div.commingsoon-title") && $("div.commingsoon-title").textContent == "Loading...")
    }

    function isJoinMatch() {
      return  !!($(".title-header") && $(".title-header").textContent == "Joining match")
    }


async function restart(description) {

    console.log("Restart: " + description)
    window.location.href = "https://play.pegaxy.io/racing/pick-pega";

    $(".navbar-assest .assest-inner:nth-of-type(3)").click()
    
    await sleep(200);
    
    $("div.navdrop-inner div.sidebar.open div.sidebar-inner div.sidebar-header button span").textContent
    
    sub_account = ""
    energy_pega_1 = ""
    energy_pega_2 = ""
    energy_pega_3 = ""
    httpGetAsync("http://localhost:5000/pega_race_started?" +
    "actual_sub_account=" + sub_account +
    "&energy_pega_1=" + energy_pega_1 +
    "&energy_pega_2=" + energy_pega_2 +
    "&energy_pega_3=" + energy_pega_3
    , ()=>{})
}

function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

})();
