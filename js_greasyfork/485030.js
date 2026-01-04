// ==UserScript==
// @name        get current time alert
// @description no puede estar en blanco
// @match     *://*/*
// @grant       none
// @version 0.0.1.20240117043006
// @namespace https://greasyfork.org/users/864616
// @downloadURL https://update.greasyfork.org/scripts/485030/get%20current%20time%20alert.user.js
// @updateURL https://update.greasyfork.org/scripts/485030/get%20current%20time%20alert.meta.js
// ==/UserScript==

    var scriptCode = [];

    scriptCode.push(' function initSa(){              ');
    scriptCode.push(' var now = new Date;             ');
    scriptCode.push(' var currenttime = now.getTime();');
    scriptCode.push(' alert("The time is: " + now );  ');
    scriptCode.push('                   }             ');

    var script = document.createElement('script');
    script.innerHTML = scriptCode.join('\n');
    scriptCode.length = 0;

    document.getElementsByTagName('head')[0].appendChild(script);