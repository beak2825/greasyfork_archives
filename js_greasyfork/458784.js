// ==UserScript==
// @name         Steam Workshop Downloader
// @namespace    https://petar.cc/
// @version      0.1
// @description  Downloads steam workshop items from steamworkshop.download and steam-workshop-downloader.com
// @author       Petar
// @match        *://steamcommunity.com/workshop/filedetails/?id=*
// @match        *://steamcommunity.com/sharedfiles/filedetails/?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458784/Steam%20Workshop%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/458784/Steam%20Workshop%20Downloader.meta.js
// ==/UserScript==
var ct=window.location.href.search('&');
var link = ""
if (ct==-1) link='http://steamworkshop.download/download/view/'+window.location.href.substr(window.location.href.search('id=')+3);
else link='http://steamworkshop.download/download/view/'+window.location.href.substring(window.location.href.search('id=')+3,ct);
addButton(link, "Download")
addButton("https://steam-workshop-downloader.com/?link=" + encodeURI( window.location.href ) + '#downloader', "Alternative")

function addButton(url, text) {
    var DownloadBox = document.querySelector(".game_area_purchase_game")
    var DownloadBtnParent = document.createElement("div")
    var DownloadBtn = document.createElement("a")
    DownloadBtn.className= 'btn_green_white_innerfade btn_border_2px btn_medium'
    DownloadBtn.id = 'SubscribeItemBtn'
    var DownloadBtnText = document.createElement("span")
    DownloadBtnText.className = 'subscribeText'
    DownloadBtnText.innerText = text
    var DownloadBtnIcon = document.createElement("div")
    DownloadBtnIcon.className = 'subscribeIcon'
    DownloadBtn.href = url;
    DownloadBtn.target = '_blank';
    DownloadBtn.appendChild(DownloadBtnIcon)
    DownloadBtn.appendChild(DownloadBtnText)
    DownloadBtnParent.appendChild(DownloadBtn)
    DownloadBox.appendChild(DownloadBtnParent)
}