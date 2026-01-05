// ==UserScript==
// @name        MacUpdate -> BrokenStones
// @description A script to add a link to a BrokenStones search link to MacUpdate
// @version     1.1.6
// @author      phracker <phracker@bk.ru>
// @namespace   https://github.com/phracker
//
// @include     http*://*macupdate.com/app/mac/*
// @downloadURL https://update.greasyfork.org/scripts/4975/MacUpdate%20-%3E%20BrokenStones.user.js
// @updateURL https://update.greasyfork.org/scripts/4975/MacUpdate%20-%3E%20BrokenStones.meta.js
// ==/UserScript==

var appname = document.getElementById('app_info_name').textContent.replace(/^\W*/,'').replace(/\W*$/,'');
var searchURL = "https://brokenstones.me/torrents.php?searchstr=" + encodeURIComponent(appname).replace(/%20/g,'+');
var div = document.createElement('div');
div.setAttribute('id','brokenstones');
div.setAttribute('style','width: 420px;');
div.setAttribute('class','yui3-u');
div.setAttribute('data-hasqtip','2');
div.innerHTML = "\
  <div id='app_info_desktop_container' class='yui3-u install'\
  data-hasqtip='3'><div id='app_info_desktop_container_inner'>\
  <a id='app_info_desktop_install_link' href='" + searchURL + "\
  ' target='_blank'><div id='app_info_desktop_icon' class='yui3-u'>\
  <img src='https://i.imgur.com/8upaurS.png' alt='Search BrokenStones'>\
  </div><div id='app_info_desktop_link' target='_self' \
  class='appinfo_toolbar-txt_link yui3-u'>Torrent Search</div></a>\
  <div class='clearfix'></div><div id='app_info_desktop_text' \
  class='yui3-u tk-myriad-pro-regular'>w/ <a id='app_info_desktop_anchor_link'\
  href='https://brokenstones.me'>BrokenStones</a></div></div></div>";
var bar = document.getElementById('app_info_download_bar_inner');
var divToReplace = document.getElementById('app_info_desktop');
var purchaseContainer = document.getElementById('app_info_purchase_container');
if( purchaseContainer !== null ) {
  purchaseContainer.remove();
}
if( divToReplace !== null ) {
  bar.insertBefore(div,divToReplace);
  divToReplace.remove();
} else {
  bar.appendChild(div);
}

// var appname = document.getElementById('app_info_name').textContent.replace(/^\W*/,'').replace(/\W*$/,'');
// var bs_btn = document.createElement('a');
// var bs_img = document.createElement('img');
// var bs_text = document.createTextNode("BrokenStones Search");
// //bs_img.src = 'https://i.imgur.com/j1WC4hP.png';
// bs_img.src = 'https://i.imgur.com/jyqxiFY.png';
// bs_btn.setAttribute('style',"cursor: pointer;font-family: myriad-pro,myriad,sans-serif;font-size: 14px;color: #00aaf1;padding: 7px 10px;border: 1px solid #cad0d7;border-radius: 4px;background: #eaf1f8; linear-gradient(to bottom,#fff 0,#eaf1f8 100%);");
// bs_btn.href = "http://brokenstones.me/torrents.php?searchstr=" + encodeURIComponent(appname);
// bs_btn.appendChild(bs_img);
// bs_btn.appendChild(bs_text);
// document.body.appendChild(bs_btn);