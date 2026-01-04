// ==UserScript==
// @name        SteamWorkshop downloader
// @version     0.4
// @author      vaniOK20
// @match   	*://steamcommunity.com/workshop/filedetails/?id=*
// @match       *://steamcommunity.com/sharedfiles/filedetails/?id=*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @description none
// @grant       none
// @namespace https://greasyfork.org/users/1192314
// @downloadURL https://update.greasyfork.org/scripts/477068/SteamWorkshop%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/477068/SteamWorkshop%20downloader.meta.js
// ==/UserScript==
const header = document.querySelector('.game_area_purchase_game');

if (header) {
  while (header.firstChild) {
    header.firstChild.remove();
	}
}

//id
const url=window.location.href;
const url2 = url.slice(0, url.indexOf('&searchtext='));
const id = url2.replace(/\D/g, '');

//game id
const GameBut = document.querySelector('.breadcrumb_separator');
const GameButt = GameBut.nextElementSibling.getAttribute('href');
const idGame = GameButt.replace(/\D/g, '');

const b=document.createElement('div');
header.appendChild(b);
b.innerText = "Command SteamCmd:";

const characterCount = `workshop_download_item ${idGame} ${id}`.length;

const bb=document.createElement('div');
b.appendChild(bb);
bb.style="background-color: black; color: white;";
bb.style.width = `${characterCount+18}%`;
bb.innerText =`workshop_download_item ${idGame} ${id}`;


//button create
const a=document.createElement('a');
a.href="https://ggntw.com/steam/"+id;
a.innerText='Download';
a.style="margin-left: 500px;"
b.appendChild(a);