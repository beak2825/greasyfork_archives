// ==UserScript==
// @name         Weather Icons
// @namespace    blaseball
// @version      2.1.0
// @description  makes the weather names coloured and adds icons for easier distinction
// @author       Myno
// @match        https://www.blaseball.com/*
// @match        https://blaseball.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blaseball.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458750/Weather%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/458750/Weather%20Icons.meta.js
// ==/UserScript==

(function() {

    'use strict';
    //set your own colours in this object!
    const weatherdict = {
        "Horizon":"#ffeeff",
        "Solar Eclipse (Red)":"#ff3333",
        "Solar Eclipse (Silver)":"#ccccee",
        "Solar Eclipse (Blue)":"#6666ff",
        "Solar Eclipse (Gold)":"#ff9966"
    };
    //and set your own image urls here
    const weathericons = {
        "Horizon":"https://github.com/Mynotaurus/filestorag/blob/main/horizon.png?raw=true",
        "Solar Eclipse (Red)":"https://github.com/Mynotaurus/filestorag/blob/main/reclipse.png?raw=true",
        "Solar Eclipse (Silver)":"https://github.com/Mynotaurus/filestorag/blob/main/seclipse.png?raw=true",
        "Solar Eclipse (Blue)":"https://github.com/Mynotaurus/filestorag/blob/main/bleclipse.png?raw=true",
        "Solar Eclipse (Gold)":"https://github.com/Mynotaurus/filestorag/blob/main/geclipse.png?raw=true"
    };
    function injectWeather(){
        if (!!document.querySelector(".playtab__gamelist")||!!document.querySelector(".bet-widget")) {
            var weathermsgs = document.getElementsByClassName("playtab__weather");
            console.log("Weather Msgs Found: "+weathermsgs.length);
            for (let i = 0; i < weathermsgs.length; i++) {
                let strin = weathermsgs[i].textContent;
                if(strin.split(" ")[0].trim()=="Weather"){
                    strin = strin.split(" ").slice(1).join(" ").trim();
                }
                console.log(i+"'"+strin+"'")
                if (strin in weatherdict){
                    weathermsgs[i].style.color = weatherdict[strin];
                }
                if (strin in weathericons) {
                    if(!weathermsgs[i].querySelector('img')){
                       if (!!document.querySelector(".playtab__gamelist")){
                        weathermsgs[i].firstChild.insertAdjacentHTML( 'beforeend', `<img src="`+weathericons[strin]+`" style="width:1.5rem; height:1.5rem; margin-left: 0.5rem; display: inline;"></img>` );
                       }else{
                           weathermsgs[i].insertAdjacentHTML( 'beforeend', `<img src="`+weathericons[strin]+`" style="width:2rem; height:2rem; margin-left: 0.5rem; display: inline;"></img>` );
                       }
                     }
                }
            }
        }
    }
    window.setInterval(injectWeather,3000)
})();