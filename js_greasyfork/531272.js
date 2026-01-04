// ==UserScript==
// @name         Sending the Page URL to an Iframe (Testing)
// @namespace    Sending the Page URL to an Iframe
// @version      1.0.0
// @description  Sending the Page URL to an Iframe
// @author       AN
// @match        https://msjc.instructure.com/courses/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/531272/Sending%20the%20Page%20URL%20to%20an%20Iframe%20%28Testing%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531272/Sending%20the%20Page%20URL%20to%20an%20Iframe%20%28Testing%29.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const iframe = document.getElementById('MyIframe');
  iframe.contentWindow.postMessage({ message: location.href }, '*');

})();
