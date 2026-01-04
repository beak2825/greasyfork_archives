// ==UserScript==
// @name         iDope magnet & torrent buttons
// @namespace    https://www.dieterholvoet.com
// @version      1.0
// @description  Add separate torrent & magnet download buttons to idope.se
// @author       Dieter Holvoet
// @match        https://idope.se/torrent/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401344/iDope%20magnet%20%20torrent%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/401344/iDope%20magnet%20%20torrent%20buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Variables
    var styles = "display: block; color: white; background: url(https://idope.se/static/search/pc/img/infodownloadbackground.png); width: 110px; float: left; height: 26px; line-height: 26px; text-align: center; font-size: 12px;";
    
    var btn_magnet = document.getElementById("downloaddiv"),
        btn_magnet_new = document.createElement("a"),
        btn_torrent = document.createElement("a"),
        btn_share = document.getElementsByClassName("share")[0],
        magnet_url = document.getElementById("mangetinfo").getAttribute("href"),
        container = btn_magnet.parentNode;
    
    // Create magnet button
    btn_magnet_new.innerText = "MAGNET";
    btn_magnet_new.setAttribute("style", styles);
    btn_magnet_new.setAttribute("href", magnet_url);
    btn_magnet_new.style.margin = "14px 0 0 0";
    
    // Create torrent button
    btn_torrent.innerText = "TORRENT";
    btn_torrent.setAttribute("style", styles);
    btn_torrent.setAttribute("href", "http://itorrents.org/torrent/"+magnet_url.split(":").slice(-1)[0]+".torrent");
    btn_torrent.style.margin = "14px 0 0 8px";
    
    // Remove and insert buttons
    container.insertBefore(btn_magnet_new, btn_share);
    container.insertBefore(btn_torrent, btn_share);
    
    container.removeChild(btn_magnet);
    document.getElementById("magnet").style.visibility = "hidden";
})();