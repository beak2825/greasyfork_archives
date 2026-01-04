// ==UserScript==
// @name         https://github.com/
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  github被微软收购之后。。。
// @author       https://github.com/1uokun
// @match        https://github.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372143/https%3Agithubcom.user.js
// @updateURL https://update.greasyfork.org/scripts/372143/https%3Agithubcom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.style.background = "url('https://media.githubusercontent.com/avatars/8279753?orig=1&token=AbWE7RzO8SQB7UTo35P2a2vE3_-unlpPks5bl0J0wA%3D%3D') no-repeat"
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundAttachment = 'fixed'
    document.body.style.backgroundPosition = 'center'
    dashboard.style.backgroundColor='#fff'
})();