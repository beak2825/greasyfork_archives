// ==UserScript==
// @name         Dropbox Direct Links
// @namespace    https://github.com/phracker
// @version      1.2.1
// @description  Displays direct link to shared file for embedding purposes
//
// @grant        GM_setClipboard
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_info
//
// @require      https://code.jquery.com/jquery-2.2.2.min.js
// @require      https://cdn.jsdelivr.net/clipboard.js/1.5.9/clipboard.min.js
//
// @include      http*://*dropbox.com/s/*/*
// @include      http*://*dropbox.com/sh/*/*
// @downloadURL https://update.greasyfork.org/scripts/3920/Dropbox%20Direct%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/3920/Dropbox%20Direct%20Links.meta.js
// ==/UserScript==

// direct url
var durl = document.URL.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace(/\?.*/, '').replace(/\#.*/, '');
console.log("durl: "+durl);
if (durl.indexOf('marketing.dropbox.com') > 0){
  return;
}
// Create direct link and copy button
var div = document.createElement('div');
div.setAttribute('align', 'center');
div.setAttribute('style', 'font-size: 12px; vertical-align: middle;');
var a = document.createElement('a');
a.href = durl;
a.setAttribute('style', 'text-decoration: none;');
a.textContent = durl;
var b = document.createElement('button');
b.setAttribute('id', 'durl');
b.setAttribute('data-clipboard-text', durl);
b.setAttribute('title', 'Copy Direct URL');
b.setAttribute('style', 'font-size: 10px; padding: 0px 6px; margin-left: 1em; font-weight: 800;');
b.setAttribute('class', 'freshbutton-lightblue');
b.appendChild(document.createTextNode('Copy'));
$(div).append(document.createTextNode('Direct: '));
$(div).append(a);
$(div).append(b);
console.log("Div: "+div.outerHTML);
// Append to page
$('.filename').append(div);

/*
//Create menu button
var mb = document.createElement('button');
mb.setAttribute('id', 'mdurl');
mb.setAttribute('data-clipboard-text', durl);
// mb.setAttribute('data-clipboard-target', )
mb.setAttribute('title', 'Copy Direct URL');
mb.setAttribute('style', 'display: inline-block; vertical-align: middle; zoom: 1; margin-left: 8px;');
mb.setAttribute('class', 'freshbutton-blue');
mb.appendChild(document.createTextNode('Copy Direct URL'));
// Add to menu
$('.buttons').append(mb);
//var extrasButton = $('#non-owner-menu-button')[0];
//$(buttons).append(mb);
*/

var cb = new Clipboard('#durl',{
  text: function(){ return durl; },
});
// var cb2 = new Clipboard('#mdurl',{
//   text: function(){ return durl; },
// });