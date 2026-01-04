// ==UserScript==
// @name         Simple Steam Workshop Downloader
// @namespace    https://github.com/Satrpx/
// @version      1.0
// @description  Downloads Steam Workshop items using steamworkshop.download
// @author       Satrpx
// @match        *://steamcommunity.com/workshop/filedetails/?id=*
// @match        *://steamcommunity.com/sharedfiles/filedetails/?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454731/Simple%20Steam%20Workshop%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/454731/Simple%20Steam%20Workshop%20Downloader.meta.js
// ==/UserScript==

const header=document.querySelector( '.workshopItemDetailsHeader' );
const a=document.createElement('a');
a.innerText='Download';
var ct=window.location.href.search('&');
if(ct==-1) a.href='http://steamworkshop.download/download/view/'+window.location.href.substr(window.location.href.search('id=')+3);
else a.href='http://steamworkshop.download/download/view/'+window.location.href.substring(window.location.href.search('id=')+3,ct);
a.target='_blank';
a.className='btn_green_white_innerfade btn_border_2px btn_medium';
a.style.padding='10px';
header.appendChild(a);