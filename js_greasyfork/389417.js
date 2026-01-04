// ==UserScript==
// @name         Download From Private Server
// @version      0.2
// @description  Enables downloading of snippets from PRIVATEFRIEND's server
// @author       TumblrFeminist
// @match        https://53627462743524533674.to/*
// @grant        none
// @namespace https://greasyfork.org/users/340707
// @downloadURL https://update.greasyfork.org/scripts/389417/Download%20From%20Private%20Server.user.js
// @updateURL https://update.greasyfork.org/scripts/389417/Download%20From%20Private%20Server.meta.js
// ==/UserScript==

(function() {
    var audio = document.getElementsByTagName('audio')
    for (var i = 0; i < audio.length; i++) {
        audio[i].removeAttribute("controlslist");
    }
})();