// ==UserScript==
// @name         Weather Icons
// @namespace    blaseball
// @version      2.0.2
// @description  makes the weather names coloured and adds icons for easier distinction
// @author       Myno & ZweiHawke
// @match        https://www.blaseball.com/*
// @match        https://blaseball.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blaseball.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458763/Weather%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/458763/Weather%20Icons.meta.js
// ==/UserScript==

(function() {

    'use strict';
    //set your own colours in this object!
    const weatherdict = {
        "Horizon":"#eeeeee",
        "Solar Eclipse (Red)":"#aa322b",
        "Solar Eclipse (Silver)":"#898989",
        "Solar Eclipse (Blue)":"#6666ff",
        "Solar Eclipse (Gold)":"#b3aa38"
    };
    const weathericons = {
        "Horizon":"https://i.imgur.com/KG5N2Wp.png?raw=true",
        "Solar Eclipse (Red)":"https://i.imgur.com/UNYgs6V.png?raw=true",
        "Solar Eclipse (Silver)":"https://i.imgur.com/ErdUv2C.png?raw=true",
        "Solar Eclipse (Blue)":"https://i.imgur.com/DVF1Pj9.png?raw=true",
        "Solar Eclipse (Gold)":"https://i.imgur.com/sVRtsGT.png?raw=true"
    };
    window.setInterval(() => {
        if (!!document.querySelector(".playtab__gamelist")||!!document.querySelector(".bet-widget")) {
            var weathermsgs = document.getElementsByClassName("playtab__weather");
            for (let i = 0; i < weathermsgs.length; i++) {
                let strin = weathermsgs[i].textContent;
                if(strin.split(" ")[0].trim()=="Weather"){
                    strin = strin.split(" ").slice(1).join(" ").trim();
                }
                if (strin in weatherdict){
                    weathermsgs[i].style.color = weatherdict[strin];
                }
                if (strin in weathericons) {
                    if(weathermsgs[i].querySelector('img')){
                       break;
                      }
                    if (!!document.querySelector(".playtab__gamelist")){
                        weathermsgs[i].firstChild.insertAdjacentHTML( 'beforeend', `<img src="`+weathericons[strin]+`" style="width:1.5rem; height:1.5rem; margin-left: 0.5rem; display: inline;"></img>` );
                    }else{
                        weathermsgs[i].insertAdjacentHTML( 'beforeend', `<img src="`+weathericons[strin]+`" style="width:1.5rem; height:1.5rem; margin-left: 0.5rem; display: inline;"></img>` );
                    }
                }
            }
        }
    }, 3000);
})();