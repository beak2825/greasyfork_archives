// ==UserScript==
// @name         BlueMediaSite Bypass
// @version      1.1
// @description  Bypasses the 6-second wait time on BlueMediaSite-generated links.
// @author       b4k
// @match        https://bluemediafile.site/url-generator.php?url=*
// @license MIT
// @grant        none
// @run-at document-end
// @namespace https://greasyfork.org/users/1049191
// @downloadURL https://update.greasyfork.org/scripts/462742/BlueMediaSite%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/462742/BlueMediaSite%20Bypass.meta.js
// ==/UserScript==

(function() {
    let reg = /(?<=Goroi_n_Create_Button\(\")(.*)(?=\")/gm;
    let goURL = reg.exec(document.body.innerHTML)[0];
    let final = "";
    for (let i = goURL.length / 2 - 5; i >= 0; i -= 2) {
        final += goURL[i];
    }
    for (let i = goURL.length / 2 + 4; i < goURL.length; i += 2) {
        final += goURL[i];
    }
    window.location.replace("https://bluemediafile.site/get-url.php?url="+final);
})();