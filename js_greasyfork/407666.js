// ==UserScript==
// @name         Mykirito Char_Filter
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Filter the damn character you don't want to see
// @author       ChaosOp
// @match        https://mykirito.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/407666/Mykirito%20Char_Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/407666/Mykirito%20Char_Filter.meta.js
// ==/UserScript==

let filt_character = ["詩乃","GGO桐人","桐人"];
let filt_option = "保留";
//選項有 保留, 去除 兩種

let reincarnation_path = "";
let filt_reverse = {"保留":0, "去除":1}[filt_option];
let filt_done = 0;

(async function() {
    'use strict';

    setInterval(function(){

        if( reincarnation_path != window.location.pathname){

            reincarnation_path = window.location.pathname;

            if( window.location.pathname.match(/reincarnation/) && !filt_done){

                let char_colle = document.querySelectorAll('.hhnKZs').forEach( char => {
                    let char_name = char.querySelector('.dRdZbR').innerText;
                    if(filt_character.includes(char_name)==filt_reverse) char.style.display = "none";
                });

                filt_done = 1;
                console.log("篩選完畢");

            }

        }


        if( !window.location.pathname.match(/reincarnation/)) {
            reincarnation_path = "";
            filt_done = 0;
        }

    },1000);

})();