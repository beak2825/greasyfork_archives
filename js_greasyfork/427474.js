// ==UserScript==
// @name         True Move Gigatex Fiber Router Captcha Password Login
// @namespace    http://lukasl.com/
// @version      0.1
// @description  Auto-fills password from Captcha on True Move Gigatex Fiber Routers (Thailand)
// @author       Lukas Labryszewski
// @match        http://192.168.1.1/admin/login_new.asp
// @icon         https://dsmapi.truecorp.co.th/cms/web/assets/Banner_Icon_V2.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427474/True%20Move%20Gigatex%20Fiber%20Router%20Captcha%20Password%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/427474/True%20Move%20Gigatex%20Fiber%20Router%20Captcha%20Password%20Login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var currentScript = new XMLSerializer().serializeToString(document);
    //console.log(currentScript);

    // Ex.  var passwordShown = "TED8O111";
    var regex = /var passwordShown = "(\w*)";/m;
    var matches = currentScript.match(regex);
    //console.log(matches);
    if(matches[1] !== undefined) {
        //console.log(matches[1]);
        document.getElementById("password").value = matches[1];
    }
})();