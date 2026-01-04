// ==UserScript==
// @name        KissAnime beta2 Server
// @namespace   KissAnimePlayer
// @description Sets KissAnime player to beta2 server.
// @include     *kissanime.ru*
// @run-at      document-start
// @icon        http://kissanime.ru/Content/images/favicon.ico
// @version     2.1
// @author      /u/HMS_Dreadnought
// @description Automatically sets the beta2 server as default and also fixes the issue of the beta server player retrying when loading the video at the start.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/382289/KissAnime%20beta2%20Server.user.js
// @updateURL https://update.greasyfork.org/scripts/382289/KissAnime%20beta2%20Server.meta.js
// ==/UserScript==

function ChangeUrl() {
    if(window.location.href.indexOf("&s=default") > -1) {
        window.stop();
        var updateLink = '&s=beta2';
        var currentLink = window.location.href;
        currentLink = currentLink.replace('&s=default', updateLink);
        location.replace(currentLink);
    }
}

ChangeUrl();