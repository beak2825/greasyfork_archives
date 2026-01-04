// ==UserScript==
// @name         Redeem all bonus points
// @namespace    https://greasyfork.org/en/users/718321-rabsscripts
// @version      1.10
// @description  [Torrenting.com] Semi-Automatically redeem as many points as possible at the time.
// @author       RabsScripts
// @match        https://torrenting.com/mybonus.php
// @update       https://greasyfork.org/scripts/418811-redeem-all-bonus-points/code/Redeem%20all%20bonus%20points.user.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/418811/Redeem%20all%20bonus%20points.user.js
// @updateURL https://update.greasyfork.org/scripts/418811/Redeem%20all%20bonus%20points.meta.js
// ==/UserScript==
/* globals $ */

/****************
 * Copyright (c) 2020 RabsScripts
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 **/

var totalredeems = 0;
(function() {
    'use strict';
    $("<button id='redeemall' style='position:absolute;left:50%;top:5%;'>Redeem All</button>").prependTo('#mainContentWrapper');
    let opt1 = $(document.getElementById("opt=1")).attr("name");
    let opt2 = $(document.getElementById("opt=2")).attr("name");
    let opt3 = $(document.getElementById("opt=3")).attr("name");
    $('#redeemall').click(function() {
        $('#redeemall').attr('disabled', 'disabled');
        console.debug('[Redeem All] Working..');
        let totalbp = parseInt($('#totalBP')[0].textContent);
        let redeem3 = Math.floor(totalbp / 250);
        totalbp = totalbp - (redeem3 * 250);
        let redeem2 = Math.floor(totalbp / 150);
        totalbp = totalbp - (redeem2 * 150);
        let redeem1 = Math.floor(totalbp / 75);
        totalbp = totalbp - (redeem1 * 75);
        if(totalbp < 0) {
            throw new Error("[Redeem All] Woah! We have negative bonus points after the calculation. That's not supposed to happen. Aborting.");
            return;
        } else {
            if (typeof opt3 !== 'undefined' && redeem3 > 0) {
                for (let i = 0; i < redeem3; i++) {
                    setTimeout(function () {redeem("opt=3", opt3);}, (1000 * i));
                }
            }
            if (typeof opt2 !== 'undefined' && redeem2 > 0) {
                for (let i = 0; i < redeem2; i++) {
                    setTimeout(function () {redeem("opt=2", opt2);}, (2000 * i));
                }
            }
            if (typeof opt1 !== 'undefined' && redeem1 > 0) {
                for (let i = 0; i < redeem1; i++) {
                    setTimeout(function () {redeem("opt=1", opt1)}, (3000 * i));
                }
            }
            var thisinterval = setInterval(function () {
                if((redeem3 + redeem2 + redeem1) <= totalredeems) {
                    alert("Redeemed "+ ((redeem3 * 250) + (redeem2 * 150) + (redeem1 * 75)) + " points." );
                    location.reload();
                    clearInterval(thisinterval);
                }
            }, 1000);



        }
    });
})();

function redeem (id,name) {
    $.ajax({
        async: false,
        type: "POST",
        url: "global_API.php",
        data: id+"&"+name,
        success: function(result){
            if(result.indexOf("<!--exc") == 0){
                console.debug("[Redeem All] Redeemed");
            }else{
                console.error("[Redeem All] " + result);
                alert(result);
            }
            totalredeems++;
        }
    });
}