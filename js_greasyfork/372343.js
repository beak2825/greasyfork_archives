// ==UserScript==
// @name        Emuparadise go to download page
// @namespace   emuparadise_go_to_download_page
// @description Clicks on the download-link on the game page which will take you to the actual download page
// @include     https://www.emuparadise.me/*
// @exclude     https://www.emuparadise.me/*-download
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/372343/Emuparadise%20go%20to%20download%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/372343/Emuparadise%20go%20to%20download%20page.meta.js
// ==/UserScript==

var valid_href = new RegExp('-download$');
var valid_text = new RegExp('^Download');
var page_links = document.getElementsByTagName('a');

for(x in page_links){
  var cur_link = page_links[x];
//  var link_class = cur_link.className;
//  var link_id = cur_link.id;
  var link_href = cur_link.href;
  var link_text = cur_link.text;

  if(valid_href.test(link_href) && valid_text.test(link_text)) {
//    cur_link.click();
    document.location = cur_link.href;
  } 
}
