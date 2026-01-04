// ==UserScript==
// @name         Online Acrobat - Adobe
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      4
// @description  Unlimited free usage (without login) of all the 25+ powerful PDF and e-signing tools on the Online Adobe Acrobat tools website.
// @author       hacker09
// @match        https://www.adobe.com/acrobat/online/*
// @match        https://services.adobe.com/*
// @connect      services.adobe.com
// @icon         https://www.adobe.com/acrobat/img/favicons/favicon.ico
// @run-at       document-end
// @grant        GM.cookie
// @downloadURL https://update.greasyfork.org/scripts/486097/Online%20Acrobat%20-%20Adobe.user.js
// @updateURL https://update.greasyfork.org/scripts/486097/Online%20Acrobat%20-%20Adobe.meta.js
// ==/UserScript==

GM.cookie.delete({ name: 'gds', url: 'https://services.adobe.com/' })