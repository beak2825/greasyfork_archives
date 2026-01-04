// ==UserScript==
// @name         Soccerline Board List
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  잘 모름
// @author       Me
// @match        https://soccerline.kr/board?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soccerline.kr
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441524/Soccerline%20Board%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/441524/Soccerline%20Board%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function(){


        const tbodyGroup = document.querySelectorAll("#boardListContainer > div > table > tbody > tr");

        tbodyGroup.forEach(x=>{

            x.childNodes[2].addEventListener("mouseover", function( event ) {
                event.target.style.cursor = "pointer";
                event.target.style.color = "blue";
            });

            x.childNodes[2].addEventListener("mouseout", function( event ) {
                event.target.style.color = "";
            });

            x.childNodes[2].addEventListener('dblclick' , function(e){

                const currentUrl = window.location.href;
                const boardNumber = currentUrl.split('categoryDepth01=')[1].charAt(0);

                location.href="/board?searchWindow=&searchType=2&categoryDepth01=" + boardNumber + "&page=0&searchText=" + this.innerText;
            });
        });
    }

})();