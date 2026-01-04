// ==UserScript==
// @name         QR This SVG
// @namespace    https://gabrieljones.dev/
// @description  Generates and saves an SVG based QR code of the URL of the current page.
// @include      *
// @version      0.1
// @author       Gabriel Jones
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/432320/QR%20This%20SVG.user.js
// @updateURL https://update.greasyfork.org/scripts/432320/QR%20This%20SVG.meta.js
// ==/UserScript==

(function(){
    if (top.location !== this.location){
        return false;
    }
    GM_registerMenuCommand( 'QR This Page', () => {
        const uriEncoded = encodeURIComponent(location.href);
        GM_download("https://api.qrserver.com/v1/create-qr-code/?data=" + uriEncoded + "&format=svg&qzone=4", document.title+".svg");
    });
})();