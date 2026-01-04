// ==UserScript==
// @name        emuparadise.me start download instantly
// @namespace   emuparadise_me_start_download
// @description Clicks the download button so that the download will start immediaetly when you land on a page
// @include     https://www.emuparadise.me/*-download
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/372342/emuparadiseme%20start%20download%20instantly.user.js
// @updateURL https://update.greasyfork.org/scripts/372342/emuparadiseme%20start%20download%20instantly.meta.js
// ==/UserScript==

// https://www.emuparadise.me/Nintendo_Gameboy_Advance_ROMs/
// Medal_of_Honor_-_Infiltrator_(U)(Venom)/44514-download

var valid_link = new RegExp('^download-link$');
var page_links = document.getElementsByTagName('a');

for(x in page_links){
  var cur_link = page_links[x];
  var link_class = cur_link.className;
  var link_id = cur_link.id;

  if(valid_link.test(link_id)){
    cur_link.click();
//    document.location = cur_link.href;
//    alert("got it! " + cur_link.href);
  } 
}
