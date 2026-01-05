// ==UserScript==
// @name          ex.ua [interface]
// @namespace     https://greasyfork.org/ru/scripts/4694-ex-ua-interface
// @description	  без реклами, текст, фон
// @author        johny.zlo
// @include       http://ex.ua/*
// @include       https://ex.ua/*
// @include       http://*.ex.ua/*
// @include       https://*.ex.ua/*
// @run-at        document-start
// @grant         none
// @version       2.32.7
// @downloadURL https://update.greasyfork.org/scripts/4694/exua%20%5Binterface%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/4694/exua%20%5Binterface%5D.meta.js
// ==/UserScript==
(function () {
  var css = 'body {\nwidth: 100% !important;\nbackground: #fff\n;max-width: 1400px;\nmargin: auto;\n}\n\n\ntr{background-color: transparent;\n}\n\n*[style="margin-top: 24px;"] {\nmargin-top: 0 !important;\n}\n\na[onClick*="social"], div[id*="plusone"], #ad_block, a[href*="ad_click"], #announce, #ex_block_1, #ex_block_2, div[id*="adriver"] div[id*="ads"] {\ndisplay: none !important;\n}\n, #index_box {\ndisplay: none !important;\n}\n, #announce {\ndisplay: none !important;\n}\n\n.panel tr td {\nbackground: #fff;\n}\n\ndiv[style*="height: 28px;"] {\ndisplay: none !important;\n}\n\n.small_button {\nfont-size: large;\n}\n\n.button {\nfont-size: large;\n}\n\nselect.small {\nfont-size: medium;\npadding: 2px 5px;\n}\n\n.r_button a {\nbackground: #fff;\nfont-size: large;\nfont-weight:normal;}\n\ntable {\nmargin: 0 auto;\n}\n\n.copyright, table.include_0 td {\nbackground: #fff;\n}\n\nh1, h2 {\nfont-size: x-large;\nfont-weight:bold;\nfont-weight:normal;\n}\n\na[id*="play"] {\nbackground: #eee;\nfont-size: 15px;\npadding: 8px 20px;\n}\n\n#menu\n{position: static !important;\nborder-right: 1px solid #ccc;\nborder-bottom: 1px solid #ccc;\nborder-left: 1px solid #ccc;\n\nz-index: 1 !important;\ntop:0 !important;\n}\n\n#body_element\n{text-align: justify;\n}\n\n.r_button a\n{\nbackground: none repeat scroll 0% 0% #333;\nfont-size: large;\nfont-weight: bold; color: white;\n}\n.r_button a:hover\n{\ncolor: #333;\nbackground: none repeat scroll 0% 0% #white;\nbox-shadow: 0 0 10px rgba(0,0,0,0.5);\n}\n';
  if (typeof GM_addStyle != 'undefined') {
    GM_addStyle(css);
  } else if (typeof PRO_addStyle != 'undefined') {
    PRO_addStyle(css);
  } else if (typeof addStyle != 'undefined') {
    addStyle(css);
  } else {
    var heads = document.getElementsByTagName('head');
    if (heads.length > 0) {
      var node = document.createElement('style');
      node.type = 'text/css';
      node.appendChild(document.createTextNode(css));
      heads[0].appendChild(node);
    }
  }
}) ();
function load() {
  var playerList = player_list.split('},');
  for (var i = 0; i < 100; i++) {
    var name = 'play_' + i;
    var item = document.getElementById(name);
    if (item == undefined)
    return;
    var text = item.parentNode.parentNode.previousSibling.previousSibling.getElementsByTagName('a') [0].title
    var playerItem = JSON.parse(playerList[i] + '}');
    item.href = playerItem.url + '?' + text;
  }
}
var id;
location.href = 'javascript:void(window.player_ad = 0)'; // remove player ad | unsafeWindow location hack
// prevent loading ads scripts by DOMContentLoaded
var scripts = document.getElementsByTagName('script');
for (var J = scripts.length - 1; J >= 0; --J) {
  if (/(hit\.ua|adriver\.ru|mediacom\.com\.ua|adocean\.pl|ad_adriver\.html|vcdn\.biz)/i.test(scripts[J].src)) {
    console.log('Killed', scripts[J].src);
    scripts[J].parentNode.removeChild(scripts[J]);
  }
}
if (typeof GM_addStyle == 'undefined') {
  function GM_addStyle(css) {
    var head = document.getElementsByTagName('head') [0];
    if (head) {
      var style = document.createElement('style');
      style.type = 'text/css';
      style.appendChild(document.createTextNode(css));
      head.appendChild(style);
    }
  }
}
GM_addStyle('#search_box, #search_help, #search_line { left: auto; width: auto; height: auto; margin-bottom: auto; } #search_button { font-size: large; position: absolute; left: 410px; top: 0; } #search_hint { position: absolute; left: 0; top: 3.5em; z-index: 1000; } #search_text { float: left; font-size: large; border-radius: 0; } #search_link { display: none !important } #search_help { text-align: left; line-height: 0; padding: 1em 0 } #search_help br { display: none } #search_form { padding: .0em } #menu { top: 0; }'); // remove search ad
id = document.querySelector('td[valign="top"] > div[style^="height: 31px"]');
if (id) id.parentNode.removeChild(id); // remove ads bar
if (location.pathname == '/') {
  id = document.querySelector('table tr:nth-child(2) td[style^="padding: 0 16px"] > center > div');
  if (id && id.getAttribute('style') != 'margin-top: 24px;') id.parentNode.removeChild(id); // remove home page ad
}
id = document.getElementById('ex_block_1');
if (id) id.parentNode.removeChild(id); // remove list ad1
id = document.getElementById('ex_block_2');
if (id) id.parentNode.removeChild(id); // remove list ad2
if (document.readyState == 'complete')
load();
 else
window.addEventListener('load', load, false);