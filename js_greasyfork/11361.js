// ==UserScript==
// @name        add_download_button
// @namespace   empornium.me
// @version     0.1
// @author      hwang
// @description Add second download button just above Thanks box
// @include     http://*empornium*/torrents.php?id*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11361/add_download_button.user.js
// @updateURL https://update.greasyfork.org/scripts/11361/add_download_button.meta.js
// ==/UserScript==

//Find and clone download button element
var link = Sizzle("#torrent_buttons")[0].cloneNode(true);

//Find <div> to insert into
var main = Sizzle("#content .main_column")[0];

//Find <div> to insert before
var target = Sizzle('.head:contains(Thanks)')[0];

//Create new <div> element and place button into it
var new_div = document.createElement('div');
new_div.innerHTML = link.innerHTML;

//Insert new <div> into page
main.insertBefore(new_div, target);