// ==UserScript==
// @name         pkgs.org btw
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Set cookies for pkgs.org to ensure Arch Linux is selected
// @author       Aidan Gibson
// @match        https://pkgs.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499902/pkgsorg%20btw.user.js
// @updateURL https://update.greasyfork.org/scripts/499902/pkgsorg%20btw.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cookies = [
        {name: 'distro_id', value: '101', path: '/', domain: '.pkgs.org', secure: true},
        {name: 'settings_distro_ids_excluded', value: '51:61:60:13:12:11:19:141:138:140:243:242:150:253:252:206:205:204:88:235:234:80:271:223:40:107:108:213:212:211:225:224:281:152:151:97:96:92:22:262:261:187:121:120:179:209:30:197:194:192:196:160:70:115:94', path: '/', domain: '.pkgs.org', secure: true},
        {name: 'settings_expand_search_results', value: 'true', path: '/', domain: '.pkgs.org', secure: true},
        {name: 'settings_repo_arches', value: 'intel', path: '/', domain: '.pkgs.org', secure: true},
        {name: 'settings_repo_types', value: 'official:thirdparty', path: '/', domain: '.pkgs.org', secure: true}
    ];

    function setCookies() {
        cookies.forEach(cookie => {
            document.cookie = `${cookie.name}=${cookie.value}; path=${cookie.path}; domain=${cookie.domain}; secure=${cookie.secure}; SameSite=Lax`;
        });
    }

    setCookies();
})();