// ==UserScript==
// @name        Pixiv link
// @namespace   nani
// @description None
// @include     https://chan.sankakucomplex.com/post/show/*
// @include     https://gelbooru.com/index.php?page=post&s=view&id=*
// @include     http://gelbooru.com/index.php?page=post&s=view&id=*
// @run-at      document-end
// @version     0.1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29033/Pixiv%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/29033/Pixiv%20link.meta.js
// ==/UserScript==
var origlink = document.body.querySelector('[href*="i.pximg.net"]').getAttribute("href");
var changedlink = origlink.replace(/.+(?:i\.pximg\.net)\/img-original\/img\/(?:\d+\/)+(.+)_p(?:\d+)\.(?:.+)/, "$1"); 
var div = document.getElementById('stats');
var creatediv = document.createElement("div");
creatediv.innerHTML = "Source correction: <a href=http://www.pixiv.net/member_illust.php?mode=medium&illust_id=" + changedlink + ">Pixiv</a>";
div.appendChild(creatediv);