// ==UserScript==
// @name         Accelerate load Tealium tags
// @version      1.0.1
// @author       Saturn Wang
// @icon         https://www.kyndryl.com/etc.clientlibs/kyndrylprogram/clientlibs/clientlib-webresources/resources/icon-192x192.png
// @match        *://*.kyndryl.com/*
// @match        *://publish-p35268-e137163.adobeaemcloud.com/*
// @description  Skip kyndryl.com check YouTube Iframe API Ready and load Tealium tags
// @namespace    wxyu scripts
// @license      MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/453200/Accelerate%20load%20Tealium%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/453200/Accelerate%20load%20Tealium%20tags.meta.js
// ==/UserScript==

(function () {
    const host = location.hostname;
    let env = 'prod';

    if (host.includes('www-pre')) {
        env = 'qa';
    }

    if (host.includes('www-poc') || host.includes('publish-p35268-e137163')) {
        env = 'dev';
    }

    (function(a,b,c,d){
        a='https://tags.tiqcdn.com/utag/kyndryl/main/'+ env +'/utag.js';
        b=document;c='script';d=b.createElement(c);d.src=a;d.type='text/java'+c;d.async= true;
        a=b.getElementsByTagName(c)[3];a.parentNode.insertBefore(d,a);
    })();
})();
