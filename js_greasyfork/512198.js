// ==UserScript==
// @name         Gooboo我要成为SL高手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一键开启读档页面方便SL
// @author       You
// @match        *://*/gooboo/
// @match        *://gooboo.g8hh.com.cn/
// @match        https://gooboo.g8hh.com.cn/1.4.2/
// @match        *://gooboo.tkfm.online/
// @icon         https://tendsty.github.io/gooboo/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512198/Gooboo%E6%88%91%E8%A6%81%E6%88%90%E4%B8%BASL%E9%AB%98%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/512198/Gooboo%E6%88%91%E8%A6%81%E6%88%90%E4%B8%BASL%E9%AB%98%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';


    let huntBtn = document.createElement("button");
    huntBtn.innerHTML = '<i class="v-icon mx-2 mdi mdi-folder-upload"></i>';
    huntBtn.classList = 'mx-2 v-btn v-btn--is-elevated v-btn--icon v-size--default';
    huntBtn.addEventListener("click", function () {
        if (document.getElementsByClassName("v-list-item__title")[2]){
            document.getElementById('gooboo-savefile-input').value=''
            document.getElementsByClassName("v-list-item__title")[2].click()
        } else {
            alert('每次刷新页面加载完成后请将鼠标移至右上角保存图标上方悬浮，下拉菜单展开后再次点击本按钮即可正常使用\n读档后无需再次展开，功能可正常使用时本提示语不显示')
        }
    });
    const spacer = document.querySelector('.spacer');
    const parent = spacer.parentNode;
    parent.insertBefore(huntBtn, spacer);
})();