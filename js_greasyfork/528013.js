// ==UserScript==
// @name         研招网移动端成绩单修改
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  研招网成绩单修改
// @author       wahahah
// @match        https://yz.chsi.com.cn/apply/cjcxa/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chsi.com.cn
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/528013/%E7%A0%94%E6%8B%9B%E7%BD%91%E7%A7%BB%E5%8A%A8%E7%AB%AF%E6%88%90%E7%BB%A9%E5%8D%95%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/528013/%E7%A0%94%E6%8B%9B%E7%BD%91%E7%A7%BB%E5%8A%A8%E7%AB%AF%E6%88%90%E7%BB%A9%E5%8D%95%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload = function () {
        var eles = document.querySelectorAll('.van-field__control');
        function remove() {
            for(let el in eles) {
                eles[el].removeAttribute('disabled');
            }
        }
        function add() {
            for(let el in eles) {
               eles[el].setAttribute("disabled", "disabled");
            }
        }
        GM_registerMenuCommand("🔷 remove", remove);
        GM_registerMenuCommand("🔷 add", add);
document.querySelector('.yzwb-notice-bar').innerText = `招生单位说明：其它事宜请登录研究生院网站：https://yjsy.nwnu.edu.cn/`;
    }

})();