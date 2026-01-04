// ==UserScript==
// @name         Damai - Stage 2
// @namespace    http://tampermonkey.net/
// @version      0.2.5 - Bham Init
// @description  try to take over the world!
// @author       Mr.FireAwayH
// @match        https://seatsvc.damai.cn/tms/selectSeat*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387627/Damai%20-%20Stage%202.user.js
// @updateURL https://update.greasyfork.org/scripts/387627/Damai%20-%20Stage%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var clock = function(){
        var clockHTML = "<div id='timedate' style='right: 0px;top: 50%; font: small-caps bold 60px/150% \"Segoe UI\", Frutiger, \"Frutiger Linotype\", \"Dejavu Sans\", \"Helvetica Neue\", Arial, sans-serif;width: 500px;color:#fff;z-index: 99999999999;position: fixed;background: red;'><a id='h'>12</a> : <a id='m'>00</a>: <a id='s'>00</a>: <a id='mi'>000</a> </div>";
        var clockDiv = document.createElement("div");
        document.body.appendChild(clockDiv);
        clockDiv.outerHTML = clockHTML;

        Number.prototype.pad = function(n) {
            for (var r = this.toString(); r.length < n; r = 0 + r);
            return r;
        };

        var updateClock = function() {
            var now = new Date();
            var milli = now.getMilliseconds(),
                sec = now.getSeconds(),
                min = now.getMinutes(),
                hou = now.getHours(),
                mo = now.getMonth(),
                dy = now.getDate(),
                yr = now.getFullYear();
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var tags = ["h", "m", "s", "mi"],
                corr = [hou.pad(2), min.pad(2), sec.pad(2), milli];
            for (var i = 0; i < tags.length; i++)
                document.getElementById(tags[i]).firstChild.nodeValue = corr[i];
        }

        var initClock = function() {
            updateClock();
            window.setInterval(updateClock, 1);
        }

        initClock();

        var btn = document.querySelector("[data-spm='dbuy']");
        btn.style.height = "400px";
        btn.style.color = "white";
        btn.innerHTML = "<span>确认选座<br/>(选座完毕后可以按空格键快速下单)</span>";

        window.onkeypress = function(e){
            if(e.keyCode === 32){
                btn.click();
            }
        }
    }

    var setup = function(){
        document.body.removeChild(window.hint);
        clock();
    }

    var init = function(){
        var a = document.createElement("div");
        document.body.appendChild(a);
        a.outerHTML = "<div id='hint' style='position: absolute;width: 30%;background: red;top: 40%;text-align: center;left: 40%;color: white;font-size: 40px;'>抢票辅助工作中</div>";
        setTimeout(setup, 2000);
    }

    window.onload = init;
})();