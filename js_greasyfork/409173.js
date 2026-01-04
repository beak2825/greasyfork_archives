// ==UserScript==
// @name         DH3 oil fix
// @namespace    FileFace
// @version      0.8
// @description  lol9
// @author       shtos
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409173/DH3%20oil%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/409173/DH3%20oil%20fix.meta.js
// ==/UserScript==
/*jshint multistr: true */
/*jslint es5: true */

(function() {
    'use strict';

    var MAXOIL
    function createHTML(){
    var newHTML = `<table width="100%"><tbody><tr><td style="text-align:right;"><img src="images/oil_lighter.png" class="img-50"></td><td style="font-size:16pt;color:rgb(42,200,200);text-align:left;"><item-oil type="number"></item-oil>/<item-maxoil type="number">${formatNumber(var_maxOil)}</item-maxoil> <span style="
display: flex;
justify-content: center;
" class="span-oil-in-out-label" id="span-oil-in-out-label"> <br><span style="font-size: 18; color:green" id="oil-timer">--:--:--</span></span></td><td><span style="
display: flex;
flex-direction: column;
" class="span-oil-in-out-label" id="span-oil-in-out-label"> <span style="color:green">(+<item-oilin>${var_oilIn}</item-oilin>/s)</span><span style="color:red">(-<item-oilout>${var_oilOut}</item-oilout>/s)</span></span></td></tr></tbody></table>`;
    return newHTML
    }
    function checkOil() {
        MAXOIL = var_maxOil
        if (window.var_oil != MAXOIL && window.var_oilIn != window.var_oilOut){
            if (+window.var_oilIn > window.var_oilOut) {
                document.querySelector('#oil-timer').style.color = 'green';
                let oilGain = window.var_oilIn - window.var_oilOut;
                let timer = window.formatTime((MAXOIL - window.var_oil) / oilGain);
                document.querySelector('#oil-timer').textContent = timer;
            } else if (+window.var_oilIn < window.var_oilOut) {
                document.querySelector('#oil-timer').style.color = 'red';
                let oilLost = window.var_oilOut - window.var_oilIn;
                let timer = window.formatTime(window.var_oil / oilLost);
                document.querySelector('#oil-timer').textContent = timer;
            }
        }else{
            document.querySelector('#oil-timer').style.color = 'white';
            document.querySelector('#oil-timer').textContent = '--:--:--';
        }
    }
    const startThing = () => {
        if (window.var_username) {
            document.querySelectorAll('.not-table-top-main-skills-keyitem')[2].children[0].remove();
            document.querySelectorAll('.not-table-top-main-skills-keyitem')[2].innerHTML = createHTML()
            setInterval(checkOil, 1000);
        } else {
            setTimeout(startThing, 1000);
        }
    };
    startThing();

})();