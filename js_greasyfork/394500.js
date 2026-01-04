// ==UserScript==
// @name         Free gamdom trivia script
// @namespace    *gamdom.com/*
// @version      3.1.7
// @description  Free gamdom trivia script for gamdom.com
// @match        *gamdom.com/*
// @downloadURL https://update.greasyfork.org/scripts/394500/Free%20gamdom%20trivia%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/394500/Free%20gamdom%20trivia%20script.meta.js
// ==/UserScript==

let muzsika = "https://www.mboxdrive.com/Rammstein%20-%20Du%20Hast%20(Official%20Video).mp3";
let under_me_en = true;
let under_time = 634;
let capital_of_en = true;
let capital_time = 2888;
let chat_assist = false;
let ch_now = 1;
var xCha = document.getElementsByClassName('chat_lang')[0];
let trivaa = true;

let last = ""; 
let eddb = 0;

let enyt = 0; 


(function() {
    let countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo, Democratic Republic of the","Congo, Republic of the","Costa Rica","Cote d'Ivoire","Croatia","Cuba","Cyprus","Czechia","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"];
    let capitals = ["Kabul","Tirana","Algiers","Andorra la Vella","Luanda","Saint John's","Buenos Aires","Yerevan","Canberra","Vienna","Baku","Nassau","Manama","Dhaka","Bridgetown","Minsk","Brussels","Belmopan","Porto-Novo","Thimphu","Sucre","Sarajevo","Gaborone","Brasilia","Bandar Seri Begawan","Sofia","Ouagadougou","Gitega","Praia","Phnom Penh","Yaounde","Ottawa","Bangui","N'Djamena","Santiago","Beijing","Bogota","Moroni","Kinshasa","Brazzaville","San Jose","Yamoussoukro","Zagreb","Havana","Nicosia","Prague","Copenhagen","Djibouti","Roseau","Santo Domingo","Quito","Cairo","San Salvador","Malabo","Asmara","Tallinn","Mbabane","Addis Ababa","Suva","Helsinki","Paris","Libreville","Banjul","Tbilisi","Berlin","Accra","Athens","Saint George","Guatemala City","Conakry","Bissau","Georgetown","Port-au-Prince","Tegucigalpa","Budapest","Reykjavik","New Delhi","Jakarta","Tehran","Baghdad","Dublin","Jerusalem","Rome","Kingston","Tokyo","Amman","Nur-Sultan","Nairobi","Tarawa","Pristina","Kuwait City","Bishkek","Vientiane","Riga","Beirut","Maseru","Monrovia","Tripoli","Vaduz","Vilnius","Luxembourg","Antananarivo","Lilongwe","Kuala Lumpur","Male","Bamako","Valletta","Majuro","Nouakchott","Port Louis","Mexico City","Palikir","Chisinau","Monaco","Ulaanbaatar","Podgorica","Rabat","Maputo","Naypyidaw","Windhoek","Yaren District","Kathmandu","Amsterdam","Wellington","Managua","Niamey","Abuja","Pyongyang","Skopje","Oslo","Muscat","Islamabad","Ngerulmud","Jerusalem","Panama City","Port Moresby","Asunción","Lima","Manila","Warsaw","Lisbon","Doha","Bucharest","Moscow","Kigali","Basseterre","Castries","Kingstown","Apia","San Marino","Sao Tome","Riyadh","Dakar","Belgrade","Victoria","Freetown","Singapore","Bratislava","Ljubljana","Honiara","Mogadishu","Pretoria","Seoul","Juba","Madrid","Sri Jayawardenepura Kotte","Khartoum","Paramaribo","Stockholm","Bern","Damascus","Taipei","Dushanbe","Dodoma","Bangkok","Dili","Lome","Nuku'alofa","Port of Spain","Tunis","Ankara","Ashgabat","Funafuti","Kampala","Kyiv","Abu Dhabi","London","Washington D.C.","Montevideo","Tashkent","Port Vila","Vatican City","Caracas","Hanoi","Sana'a","Lusaka","Harare"];
    let capi = 0;
    let nyeroN;
    betolt();
    
    function betolt(){
        var stylLyXCe = document.createElement('style');
        stylLyXCe.innerHTML =
        '@-webkit-keyframes rotation' + 
        '{ ' +
            'from {' +
            '-webkit-transform: rotate(0deg); }' +
            'to {' +
            '-webkit-transform: rotate(359deg);' + 
            ' } '+
        '}';
        var ref7fssg = document.querySelector('script');
        ref7fssg.parentNode.insertBefore(stylLyXCe,ref7fssg);
        var didii = document.createElement("DIV");
        //didii.innerHTML = "Várakozás... ";
        didii.style.backgroundColor = "red";
        didii.style.width = "100%";
        didii.style.border = "1px solid black";
        didii.style.borderRadius = "4px";
        didii.style.textAlign = "center";
        didii.style.height = "20px";
        didii.setAttribute("id", "aktiveid");
        didii.style.position = "fixed";
        didii.style.bottom= "0";
        document.body.appendChild(didii);
        var xImGaa = document.createElement("IMG");
        xImGaa.setAttribute("src", "http://www.myiconfinder.com/uploads/iconsets/1c18e6bfed1addc5bd0038ae72d766a9-loading.png");
        xImGaa.setAttribute("width", "15");
        xImGaa.setAttribute("height", "15");
        xImGaa.setAttribute("id", "imaaagee");
        xImGaa.setAttribute("style", "-webkit-animation: rotation 2s infinite linear;");
        document.getElementById('aktiveid').appendChild(xImGaa);
        var stringk = document.createElement("SPAN");
        stringk.setAttribute("id", "spanIDo");
        stringk.innerHTML = "Loading..";
        document.getElementById('aktiveid').appendChild(stringk);
        var setppup = document.createElement("SPAN");
        setppup.style.textAlign = "right";
        setppup.innerHTML = " - Options";
        setppup.setAttribute("id", "setemenu");
        setppup.setAttribute("onClick", "semenu()");
        setppup.style.color = "black";
        setppup.style.fontWeight = "bold";
        document.getElementById('aktiveid').appendChild(setppup);
        setTimeout(ellenor, 1500);
    }
    
    function ellenor(){
		console.log('you have won %d trivia so far!', enyt);
        let win = false;
        let chbox = document.getElementsByClassName("chat_cont");
        let szv = chbox[chbox.length-1].innerHTML;
        let clean = szv.toLowerCase().replace(/\s/g, '');
        let szesz = szv;
        let th = 0;
        if(szesz.length >= 30)
        {
            szesz = szesz.substring(0, 27); 
            szesz += "...";
        }
        document.getElementById('spanIDo').innerHTML = "Waiting for the trivia.. " + szesz;
		let mk = 0;
        console.log(clean);
        if(clean.includes("underme") && under_me_en == true)
        {
			clean.replace('underme', '');
			mk = 1;
		}
		
		if(clean.includes("alattam") && under_me_en == true)
		{
			clean.replace('alattam', '');
			mk = 1;
		}
			
		if(mk == 1)
		{
			if(clean.includes("2st") || clean.includes("2.")) {
                th = 2;
                clean.replace('2st', '');
                clean.replace('2.', '');
            } else if(clean.includes("3nd") || clean.includes("3.")) {
                th = 3;
                clean.replace('3nd', '');
				clean.replace('3.', '');
            } else if(clean.includes("4th") || clean.includes("4.")) {
                th = 4;
                clean.replace('4th', '');
				clean.replace('4.', '');
            } else if(clean.includes("5th") || clean.includes("5.")) {
                th = 5;
                clean.replace('5th', '');
				clean.replace('5.', '');
            } else if(clean.includes("6th") || clean.includes("6.")) {
                th = 6;
                clean.replace('6th', '');
				clean.replace('6.', '');
            } else if(clean.includes("7th") || clean.includes("7.")) {
                th = 7;
                clean.replace('7th', '');
				clean.replace('7.', '');
            } else if(clean.includes("8th") || clean.includes("8.")) {
                th = 8;
                clean.replace('8th', '');
				clean.replace('8.', '');
            } else if(clean.includes("9th") || clean.includes("9.")) {
                th = 9;
                clean.replace('9th', '');
				clean.replace('9.', '');
            }
			onfirm(clean);
            if(clean.includes("c") || clean.includes("k"))
            {
				clean.replace('c', '');
				clean.replace('k', '');
				
                if(parseInt(ncut(clean)[0]) <= 10 && parseInt(ncut(clean)[0]) > 0 || parseInt(ncut(clean)[0]) <= 10000 && parseInt(ncut(clean)[0]) > 100 )
                {
                    if(clean.includes("fae") == false && clean.includes("test") == false && clean.includes("anti") == false && clean.includes("bot") == false && clean.includes("then") == false && szv.length <= 16)
                    {
                        win = true;
                        chat_assist = false;

                        if(th == 0)
                        {
                            if(Math.floor(Math.random() * 100) >= 66)
                            {
                                let items = ["lol","ez","ty <3", "<3 :)", "thx", "wow"];
                                nyero(items[Math.floor(Math.random()*items.length)], under_time);
                            } else {
                                nyero(makeid(Math.floor(Math.random() * 4) + 1), under_time);
                            }
                        } else {
                            last = szv;
                            nyeroN = th;
                            ravag();
                        }
                    }
                }
            }
        } else if(clean.includes("capitalof") && capital_of_en == true){
            for(let i = 0; i < countries.length; i++){
                if(clean.includes(countries[i].toLowerCase().replace(/\s/g, '' )))
                {
                    if(clean.includes("c") || clean.includes("k"))
                    {
                        nyero(capitals[i], capital_time);
                        win = true;
                        chat_assist = false;
                    }
                }
            }
        }
        if(document.getElementsByClassName("chat_input").value == "STOPassist"){ 
            chat_assist = false;
            chbox.value = ""; 
        }
        if(win == true && trivaa == false){
            setTimeout(ellenor, 5000);
        } else if(win == false) {
            setTimeout(ellenor, 25);
            chatSiSt();
        }
    }
    
    function ravag(){
        
        let chbox = document.getElementsByClassName("chat_cont");
        let szv = chbox[chbox.length-1].innerHTML;
        if(last != szv){
            eddb += 1;
            last = szv;
            
        } 
        
        if((eddb) == nyeroN-1){
            if(Math.floor(Math.random() * 100) >= 50)
            {
                let items = ["lol","ez","ty <3", "<3 :)", "thx", "wow"];
                nyero(items[Math.floor(Math.random()*items.length)], 200);
            } else {
                nyero(makeid(Math.floor(Math.random() * 4) + 1), 200);
            }
        } else {
            setTimeout(ravag, 50);
        }
        
    }

    function nyero(kw, ama){

        if(trivaa == true)
        {
            var elem = document.querySelector('#imaaagee');
            elem.style.display = 'none';
            document.getElementById('aktiveid').innerHTML = "WON";
            console.log("you won so it stopped");
        } else {
            console.log("You have won, but a constant trivia is active so the hunt has not stopped");
        }
        document.getElementsByClassName('chat_input')[0].value = kw;
        setTimeout(justSend, ama);
        var audio = new Audio(muzsika);
        audio.play();
		enyt++;
        setTimeout(function(){audio.pause(); player.currentTime = 0; }, 10000);
    }
    
    function makeid(length) {
       var result           = '';
       var characters       = 'QAYWSXERTFFGqaywsxrfftg1243';
       var charactersLength = characters.length;
       for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }
    
    function justSend(){
        eventFire(document.getElementsByClassName('icon-sled chat_send')[0], 'click');
    }
    
    function ncut(text) {
    
        let nume = [];
        let szam = "";
        for(let i = 0; i < text.length; i++){
            if(hasNumber(text[i]))
            {
                    szam += ""+text[i];
    
            } else {
                if(szam != "")
                {
                    nume.push(szam);
                    szam = "";
                }
            }
        }
        return nume;
    }
    function hasNumber(myString) {
      return /\d/.test(myString);
    }
    })();


    function semenu(){
        alert('ok');
    }
	
    function semenu() {
        var setMethd = prompt("What setting would you change?\nMusic (1)\nUnderme [on/off] (2)\nUndeer me reaction time (3)\nCapital of [on/off] (4)\nCapital of reaction time (5)\nChat Assist (6)\nUnlimited trivia (7)", "Csak a számot!");
        if (setMethd != null) {
          if(setMethd == 1)
          {
              var muzsikK = prompt("Please enter a music URL.", "... .mp3");
              if (muzsikK != null) {
                  muzsika = muzsikK;
              } else {
                  alert("You have not entered a URL, the setting has not been changed!");
              }
          } 
          else if(setMethd == 2)
          {
              var untimeN = prompt("Do you enable trivia: under me?\nYes = 1, No = 2, ", "1");
              if (untimeN != null) {
                  if(untimeN == 1)
                  {
                      under_me_en = true;
                  } else if(untimeN == 2)
                  {
                      under_me_en = false;
                  } else {
                      alert("You have entered incorrect data!( "+untimeN+" )");
                  }
              } else {
                  alert("You have not entered a time, the setting has not been changed!");
              }
          }
          else if(setMethd == 3)
          {
              var untimeN = prompt("Enter your under me time (1 sec = 1000, half sec = 500 ...), ", "300");
              if (untimeN != null) {
                  under_time = untimeN;
              } else {
                  alert("You have not entered a time, the setting has not been changed!");
              }
          }
          else if(setMethd == 4)
          {
                var untimeN = prompt("Do you want to enable the Capital of Trivia?\nYes = 1, No = 2, ", "1");
              if (untimeN != null) {
                  if(untimeN == 1)
                  {
                      capital_of_en = true;
                  } else if(untimeN == 2)
                  {
                      capital_of_en = false;
                  } else {
                      alert("You have entered incorrect data( "+untimeN+" )");
                  }
              } else {
                  alert("The setting has not been changed!");
              }
          }
          else if(setMethd == 5)
          {
              var untimeN = prompt("Enter the Capital of Response Time (1 sec = 1000, Half Sec = 500), ", "1500");
              if (untimeN != null) {
                  capital_time = untimeN;
              } else {
                  alert("You have not entered a time, the setting has not been changed!");
              }
          } else if(setMethd == 6)
          {
            var untimeN = prompt("Want to turn on chat assistant? (1 = Yes, 2 = No)", "2");
            if (untimeN != null) {
                if(untimeN == 1)
                {
                    eventFire(xCha.getElementsByClassName('chan_img')[0], "click");
                    chat_assist = true;
                    chatSiSt();
                } else if(untimeN == 2) {
                    chat_assist = false;
                } else {
                    alert('Wrong data!');
                }
            } else {
                alert("The setting has not been changed!");
            }
          } else if(setMethd == 7){
            var untimeN = prompt("1 = Win only 1 trivia | 2 = Don't Stop", "1");
            if (untimeN != null) {
                if(untimeN == 1)
                {
                    trivaa = true;
                } else if(untimeN == 2) {
                    trivaa = false;
                } else {
                    alert('Wrong data!');
                }
            } else {
                alert("The setting has not been changed!");
            }
          }
        }
      }

      function chatSiSt(){
        if(chat_assist == true)
        {
            let chatek = xCha.getElementsByClassName('chan_img').length-1;
            if(chatek >= ch_now)
            {
                ch_now++;
                eventFire(xCha.getElementsByClassName('chan_img')[ch_now-1], "click");
            } else {
                ch_now = 1;
                eventFire(xCha.getElementsByClassName('chan_img')[0], "click");
            }
        }   
    }

    function eventFire(el, etype){
        if (el.fireEvent) {
          el.fireEvent('on' + etype);
        } else {
          var evObj = document.createEvent('Events');
          evObj.initEvent(etype, true, false);
          el.dispatchEvent(evObj);
        }
      }