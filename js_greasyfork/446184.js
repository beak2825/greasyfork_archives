// ==UserScript==
// @name         Get NEO UcStorage
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  copy&paste ucStorage info automatically
// @author       HYT
// @match        http://localhost:*
// @match        http://www.ilabpower.develop
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446184/Get%20NEO%20UcStorage.user.js
// @updateURL https://update.greasyfork.org/scripts/446184/Get%20NEO%20UcStorage.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href;
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }
    function setCookie(cname, cvalue) {
        document.cookie = cname + "=" + cvalue + "; ";
    }
    function reload() {
        if (GM_getValue('needReload', false) == true) {
            window.location.reload();
            GM_setValue('needReload', false)
        }
    }
    if (url == 'http://www.ilabpower.develop/#/info') {
        GM_setValue('ucStorage', getCookie('ucStorage'));
        GM_setValue('needReload', true);
    } else if (url.indexOf('http://localhost:') == 0) {
        setCookie('ucStorage', GM_getValue('ucStorage', ''));
        reload();
    }
})();