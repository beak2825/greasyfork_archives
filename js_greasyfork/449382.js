// ==UserScript==
// @name           FTW
// @namespace      none
// @version        none
// @license      none
// @description    Vanis.io extension
// @author         Nagantt
// @compatible     chrome
// @compatible     opera
// @compatible     firefox
// @include        *://vanis.io/*
// @include        about:blank
// @run-at         document-start
// @grant          GM_xmlhttpRequest
// @connect        greept-fullyw-swip.glitch.me
// @downloadURL https://update.greasyfork.org/scripts/449382/FTW.user.js
// @updateURL https://update.greasyfork.org/scripts/449382/FTW.meta.js
// ==/UserScript==

if (location.host === 'vanis.io' && location.href !== 'https://vanis.io/ftw') {
    window.stop();
    location.href = 'https://vanis.io/ftw';
    return;
}


GM_xmlhttpRequest({
    method: "GET",
    url: 'https://greept-fullyw-swip.glitch.me/vanis.io',
    onload: (e)=> {
       // document.open();
        document.write(e.responseText);
      //  document.close();
    }
});
