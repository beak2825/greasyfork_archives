// ==UserScript==
// @name        avatarko
// @namespace   curly_brace
// @include     http://vk.com/im*
// @version     1
// @grant       none
// @description change avatar
// @downloadURL https://update.greasyfork.org/scripts/11735/avatarko.user.js
// @updateURL https://update.greasyfork.org/scripts/11735/avatarko.meta.js
// ==/UserScript==
 
var cur_avatar = "http://cs629224.vk.me/v629224983/67d8/ZxFGAuaCQQA.jpg";
var avatar_url = "http://cs629510.vk.me/v629510983/c96c/T2sUOFfdC30.jpg";
var avatar_link = "http://vk.com/photo286479983_377635617";
 
setInterval(changeAvatar, 500);
 
function changeAvatar() {
  var link = document.getElementById("im_peer_holders").childNodes[0].childNodes[0].childNodes[0];
  var image = link.childNodes[0];
 
  if (image.src != cur_avatar) return;
 
  image.src = avatar_url;
  link.href = avatar_link;
}