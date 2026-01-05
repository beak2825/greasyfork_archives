// ==UserScript==
// @name        RTP Play Downloader
// @author      guicale <gui@cabritacale.eu>
// @namespace   rtpplaydl
// @description Userscript to download media from RTP Play
// @include     http://*rtp.pt/play/p*
// @version     2
// @grant       none
// @copyright   2016, Guilherme Calé
// @license     GPL 3, https://www.gnu.org/licenses/
// @downloadURL https://update.greasyfork.org/scripts/25607/RTP%20Play%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/25607/RTP%20Play%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var flashvars = document.getElementById('obj_player_prog').getAttribute('flashvars');
    var regex = new RegExp("file=(mp3|mp4):(.*?)&");
    var file = flashvars.match(regex);
    var link = 'http://cdn-ondemand.rtp.pt' + file[2];
    var div = document.getElementsByClassName('col-sm-4 col-xs-12 padding-left-0')[0];
    var a = document.createElement('a');
    a.setAttribute('href',link);
    a.appendChild(document.createTextNode('Download'));
    div.appendChild(a);
})();