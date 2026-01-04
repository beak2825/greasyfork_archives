// ==UserScript==
// @name         finder copilot
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      2024-1-3
// @description  finder copilot plugin for vsop platform
// @author       finder
// @match        https://vsop-online.bytedance.net/ticket/list/detail/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require    https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js
// @require    https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484305/finder%20copilot.user.js
// @updateURL https://update.greasyfork.org/scripts/484305/finder%20copilot.meta.js
// ==/UserScript==

(function() {
    'use strict';

     // const cssHref = 'https://lf3-static.bytednsdoc.com/obj/eden-cn/nneh7hbophrlpe/Finder/greasyFork/index3.css'
    //let cssScript = document.createElement('link');
    //cssScript.setAttribute('rel', 'stylesheet');
    //cssScript.setAttribute('type', 'text/css');
    //cssScript.href = cssHref;
    // document.documentElement.appendChild(cssScript);

    const jsSrc = 'https://dp-chat-assistant.gf.bytedance.net/script.js';
    let jsScript = document.createElement('script');
    jsScript.setAttribute('type', 'text/javascript');
    jsScript.src = jsSrc;

    document.documentElement.appendChild(jsScript);

})();