// ==UserScript==
// @name        KissAnime Default Server
// @namespace   KissAnimePlayer
// @description Sets KissAnime player to beta server.
// @include     *kissanime.ru*
// @icon        http://kissanime.ru/Content/images/favicon.ico
// @version     2.0
// @author      /u/HMS_Dreadnought
// @description Automatically sets the Beta server as default and also fixes the issue of the beta server player retrying when loading the video at the start.
  // @grant       none
// @downloadURL https://update.greasyfork.org/scripts/36926/KissAnime%20Default%20Server.user.js
// @updateURL https://update.greasyfork.org/scripts/36926/KissAnime%20Default%20Server.meta.js
 // ==/UserScript==

function ChangeUrl() {
    if(window.location.href.indexOf("&s=default") > -1) {
        window.stop();
        var updateLink = '&s=beta&pfail=1';
        var currentLink = window.location.href;
        currentLink = currentLink.replace('&s=default', updateLink);
        location.replace(currentLink);
    }
}

function AllUrlChange(){
    var updateLink = '&s=beta&pfail=1';
    var selectable = document.getElementById("selectEpisode").getElementsByTagName("option");
    var prev = document.getElementById("btnPrevious").parentElement;
    var next = document.getElementById("btnNext").parentElement;
    prev.href += updateLink;
    next.href += updateLink;
    for(var i =0; i < selectable.length; i++){
        selectable[i].value += updateLink;
    }
}

ChangeUrl();
AllUrlChange();