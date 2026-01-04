// ==UserScript==
// @name         OK_EVM铭文多打
// @namespace    http://tampermonkey.net/
// @version      2023-12-16
// @description  覆盖okx要打的数量，突破100限制!
// @author       @0xBitDog
// @match        https://www.okx.com/cn/web3/hot/inscription
// @icon         https://www.google.com/s2/favicons?sz=64&domain=okx.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482676/OK_EVM%E9%93%AD%E6%96%87%E5%A4%9A%E6%89%93.user.js
// @updateURL https://update.greasyfork.org/scripts/482676/OK_EVM%E9%93%AD%E6%96%87%E5%A4%9A%E6%89%93.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        var parentElement = document.querySelector(".index_timesContainer__UqIbe");
        var htmlString = "<div style='margin-top:10px'><p>覆盖次数</p><input type='text' id='repeat' class='okui-input-input' style='border:1.6px solid rgb(118,118,118)' value='1' /></div>";
        parentElement.insertAdjacentHTML("beforeend", htmlString);
        // 保存 输入值
        var btnStart = document.querySelector(".btn-fill-highlight");
        if (btnStart.textContent == "确认") {
            btnStart.onclick = () => {
                var iptRepeat = document.getElementById("repeat").value;
                var iptTimes = document.querySelectorAll(".okui-input-input")[2].value;
                if(iptRepeat > iptTimes) {
                    iptTimes = iptRepeat;
                }
                let times = document.querySelectorAll(".okui-input-input")[2];
                times.value = "";
                times.focus();
                document.execCommand('inserttext', false, iptTimes);
            };
        }
    }, 3000);
})();