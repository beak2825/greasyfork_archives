// ==UserScript==
// @name         bingSearchFix
// @namespace    https://cn.bing.com/search
// @version      0.1.2
// @description  修复bing国内版搜索框异常
// @author       Conard
// @match        https://cn.bing.com/search*
// @icon         https://cn.bing.com/sa/simg/favicon-trans-bg-blue-mg.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459834/bingSearchFix.user.js
// @updateURL https://update.greasyfork.org/scripts/459834/bingSearchFix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const getSearch = () => document.querySelector("textarea#sb_form_q");
    const keydown = function(e) {
        if (e.repeat && e.keyCode != 8) return e.preventDefault();
        if (e.keyCode == 13 && !(e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)) {
            this.form.submit();
            e.preventDefault();
        }
    }
    let search = getSearch();
    setTimeout(() => {
        while (!search) search = getSearch();
        search.addEventListener("keydown", keydown);
    },0)
})();