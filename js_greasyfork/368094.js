// ==UserScript==
// @name         ImgurAlbumLink
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a link to user albums on Imgur profile pages
// @author       CFG
// @match        https://imgur.com/user/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368094/ImgurAlbumLink.user.js
// @updateURL https://update.greasyfork.org/scripts/368094/ImgurAlbumLink.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let username = document.title.split(" ")[0];
    let menu = document.getElementsByClassName("panel menu").item(0);
    let node = document.createElement("div");
    node.className = "textbox button album";
    node.innerHTML = "<a href=\"https://"+username+".imgur.com\"><h2>Albums</h2></a>";

    menu.insertBefore(node, menu.children[2]);
})();