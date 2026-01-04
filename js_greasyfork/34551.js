// ==UserScript==
// @name         搬瓦工屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       Reid
// @match        https://bandwagonhost.com/cart.php
// @match        https://bandwagonhost.com/cart.php*
// @match        https://bwh1.net/cart.php
// @match        https://bwh1.net/cart.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34551/%E6%90%AC%E7%93%A6%E5%B7%A5%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/34551/%E6%90%AC%E7%93%A6%E5%B7%A5%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
// @license MIT
(function() {
    'use strict';

    var b = document.getElementsByTagName("em");
    var blok = new Array();
    var k=0;
    var state=0;//0是隐藏 1是显示
    for (var i in b) {
        if (b[i].innerHTML == "(out of stock)") {
            b[i].parentNode.parentNode.parentNode.parentNode.parentNode.style.display = "none";
            blok = blok.concat(b[i].parentNode.parentNode.parentNode.parentNode.parentNode);
        }
    }
    var myMethods = {
        showMethod: function() {
            for ( k in blok) {
                blok[k].style.display = "block";
                blok[k].style.backgroundColor="#646464";
            }
            state=1;
        },
        hideMethod:function () {
            for ( k in blok) {
                blok[k].style.display = "none";
                blok[k].style.backgroundColor="#FFFFFF";
            }
            state=0;
        }
    };
    var fat = document.getElementById("order-web20cart").getElementsByTagName("div")[0];
    var butt = document.createElement("input");
    butt.setAttribute("type", "button");
    butt.setAttribute("value", "显示所有");
    butt.setAttribute("id", "mybutton");
    fat.appendChild(butt);
    document.getElementById("mybutton").addEventListener("click",function (e) {
        if(state===1){ e.target.value="显示所有";
                      myMethods.hideMethod();
                     }
        else if(state===0){
            e.target.value="已显示所有";
            myMethods.showMethod();
        }

    });
})();