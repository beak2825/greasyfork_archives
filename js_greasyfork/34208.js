// ==UserScript==
// @name         大象关闭通知铃声
// @description 只静音不关闭通知，左下角有静音开/关按钮
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       cyh
// @match        https://x.sankuai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34208/%E5%A4%A7%E8%B1%A1%E5%85%B3%E9%97%AD%E9%80%9A%E7%9F%A5%E9%93%83%E5%A3%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/34208/%E5%A4%A7%E8%B1%A1%E5%85%B3%E9%97%AD%E9%80%9A%E7%9F%A5%E9%93%83%E5%A3%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setTimeout(function () {
        var message_remind = document.getElementById("message_remind");
        var bak_src = message_remind.src;
        var tmp=document.createElement("div");
        tmp.innerHTML='<a class="cust-app-item"><div class="app-icon" id="mymute"><i id="mymute_ico" class="dxicon icon-app icon-app-im dxicon-mute"></i></div></a>';
        document.getElementsByClassName("ctn-footer")[0].appendChild(tmp.firstChild);

        function _set_mute(value) {
            value = value - 0;
            localStorage._mute = value;
            if (value === 0) {
                document.getElementById("mymute_ico").style = "color:#909090";
                message_remind.src = bak_src;
            }
            else {
                document.getElementById("mymute_ico").style = "color: rgb(58, 161, 255);opacity: 1;";
                message_remind.src = "1";
            }
        }

        _set_mute(localStorage._mute || 0);
        document.getElementById("mymute").onclick = function () {
            _set_mute(1 - localStorage._mute);
        };
    }, 2000);
})();
