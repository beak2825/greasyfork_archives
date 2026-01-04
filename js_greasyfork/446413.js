// ==UserScript==
// @name         highlight if 50 deps
// @namespace    http://tishka.xyz/sdt
// @version      0.1
// @description  highlights some
// @author       Tishka
// @match        https://marketing-jet.lux-casino.co/*
// @match        https://marketing-sol.lux-casino.co/*
// @match        https://marketing-rox.lux-casino.co/*
// @match	     https://marketing.lux-casino.co/*
// @match		 https://marketing-fresh.lux-casino.co/*
// @match		 https://marketing-izzi.lux-casino.co/*
// @match		 https://marketing-legzo.lux-casino.co/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lux-casino.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446413/highlight%20if%2050%20deps.user.js
// @updateURL https://update.greasyfork.org/scripts/446413/highlight%20if%2050%20deps.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    if(window.location.href.match(/payments\?/)){
        while(true){
            if(!document.querySelector(".scope.only_success").querySelector(".count")){
                await sleep(50);
                continue;
            }
            else
            {
                let numOfSuccess = Number(document.querySelector(".scope.only_success").querySelector(".count").innerText.match(/\d+/)[0]);
                if(numOfSuccess < 50){
                document.getElementById("page_title").innerHTML += ` <span style="color:red">[МЕНЕЕ 50 УСПЕШНЫХ]</a>`
                   // document.querySelector(".scope.only_success").querySelector(".table_tools_button").style.backgroundColor = "#eda4b8";
                    //document.querySelector(".scope.only_success").querySelector(".table_tools_button").style.backgroundImage = "none";
                }
                break;
            }
        }
    }
    // Your code here...
})();