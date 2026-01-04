// ==UserScript==
// @name ExHentai Cookie Setter
// @namespace https://sleazyfork.org/zh-CN/scripts/452641
// @description Sets cookies for exhentai.org
// @version 1114522
// @match *://exhentai.org/*
// @match *://e-hentai.org/*
// @icon https://s2.loli.net/2024/08/04/dXbjCBA2UyDhpcS.jpg
// @grant none
// @license WTFPL
// @downloadURL https://update.greasyfork.org/scripts/452641/ExHentai%20Cookie%20Setter.user.js
// @updateURL https://update.greasyfork.org/scripts/452641/ExHentai%20Cookie%20Setter.meta.js
// ==/UserScript==

(function() {
    function setCookie(name, value, expirationDate, domain) {
        var expires = "";
        if (expirationDate) {
            expires = "; expires=" + expirationDate.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/; domain=" + domain;
    }

    function setCookiesOnce() {
        var now = new Date();

        // Define expiration dates
        var expirationIgneous = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 26);
        var expirationIpbMemberId = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate() + 20); // 2025
        var expirationIpbPassHash = new Date(now.getFullYear() + 1, now.getMonth() + 1, now.getDate() + 45); // 2025

        // Set cookies for .exhentai.org domain
        setCookie('igneous', 'hqetl0wr7nmn9n1ezx0', expirationIgneous, '.exhentai.org');
        setCookie('ipb_member_id', '6914514', expirationIpbMemberId, '.exhentai.org');
        setCookie('ipb_pass_hash', '3c5b0d72139de14c7661bb931008005b', expirationIpbPassHash, '.exhentai.org');
    }

    setCookiesOnce();
})();
