// ==UserScript==
// @name         change user
// @namespace    http://10.17.206.73:8080/
// @version      0.1
// @description  change user icon
// @author       gaozt
// @match        http://10.17.206.73:8080/
// @icon         https://www.google.com/s2/favicons?domain=206.73
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431339/change%20user.user.js
// @updateURL https://update.greasyfork.org/scripts/431339/change%20user.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var show = setTimeout(function() {
        var user = document.querySelector("#nav-menu > div.user > span > span > span");
        var p=document.createElement("img");
        user.innerText = '';
        p.setAttribute('src', 'https://gaozhengtao.cn/static/img/logo.4a195a9.jpg')
        user.appendChild(p)
        clearInterval(show);
    }, 100);
})();