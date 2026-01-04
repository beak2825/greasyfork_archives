// ==UserScript==
// @name        e-hentai to exhentai.org
// @include     /.*e-hentai\.org\/g\//
// @run-at      document-start
// @author      Vyre
// @description      Redirects from e-hentai to exhentai
// @grant       none
// @version 0.0.1.20181226024416
// @namespace https://greasyfork.org/users/235081
// @downloadURL https://update.greasyfork.org/scripts/375952/e-hentai%20to%20exhentaiorg.user.js
// @updateURL https://update.greasyfork.org/scripts/375952/e-hentai%20to%20exhentaiorg.meta.js
// ==/UserScript==

function ChangeUrl() {
    if(window.location.href.indexOf("e-hentai.org") > -1) {
        window.stop();
        var updateLink = 'exhentai.org';
        var currentLink = window.location.href;
        currentLink = currentLink.replace('e-hentai.org', updateLink);
        location.replace(currentLink);
}
}
ChangeUrl();