
// ==UserScript==
// @name Steam Game Search Links
// @namespace http://tampermonkey.net/
// @version 1.1
// @description Добавляет ссылки для поиска по трекерам в Steam
// @author LeMaxime & MrYogurt
// @match https://store.steampowered.com/*
// @grant GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483234/Steam%20Game%20Search%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/483234/Steam%20Game%20Search%20Links.meta.js
// ==/UserScript==

(function () {
	"use strict";
 
	const buttonsContainer = document.createElement("div");
	buttonsContainer.style.display = "flex";
	buttonsContainer.style.alignItems = "center";
	buttonsContainer.style.flexWrap = "wrap";
	buttonsContainer.style.width = "100%";
	buttonsContainer.style.minHeight = "36px";
	buttonsContainer.style.padding = "8px 0px 8px 0px";
 
	const gameNameElement = document.getElementById("appHubAppName");
 
	if (gameNameElement) gameNameElement.appendChild(buttonsContainer);
 
	function createButton(searchLink, buttonText, tooltipText, iconPath) {
		const linkButton = document.createElement("a");
		linkButton.href = searchLink;
		linkButton.setAttribute("target", "_blank");
 
		const img = new Image();
		img.src = iconPath;
		img.alt = buttonText;
		img.style.width = "64px";
		img.style.height = "36px";
		img.style.objectFit = "contain";
		img.style.backgroundColor = "#171d25";
		img.style.borderRadius = "4px";
		img.style.padding = "8px";
 
		linkButton.appendChild(img);
		linkButton.title = tooltipText;
		linkButton.style.marginRight = "10px";
		buttonsContainer.appendChild(linkButton);
	}


const formattedGameName = document.getElementById("appHubAppName").textContent.trim().toLowerCase().replace(/'/g, '').replace(/_/g, ' ');

  const new1SiteSearchLink = `https://rutracker.org/forum/tracker.php?nm=${formattedGameName}`;
  createButton(new1SiteSearchLink, "Rutracker", "Поиск по Rutracker.org", "https://static.rutracker.cc/logo/logo-3.svg");
  
  const new2SiteSearchLink = `https://rutor.info/search/0/0/100/0/${formattedGameName}`;
  createButton(new2SiteSearchLink, "Rutor", "Поиск по Rutor.info", "https://rutor.org/template/rutor/assets/img/rutor.png");

  const new11SiteSearchLink = `https://rustorka.com/forum/tracker.php?nm=${formattedGameName}`;
  createButton(new1SiteSearchLink, "Rustorka", "Поиск по Rustorka.com", "https://rustorka.com/forum/images/logo/deus%202.png");

  const new12SiteSearchLink = `https://tapochek.net/forum/tracker.php?nm=${formattedGameName}`;
  createButton(new1SiteSearchLink, "Tapochek", "Поиск по Tapochek.net", "https://tapochek.net/images/logo/logo_new_year.png");
  
  const new3SiteSearchLink = `https://cs.rin.ru/forum/search.php?keywords=${formattedGameName}&terms=any&author=&sc=1&sf=titleonly&sk=t&sd=d&sr=topics&st=0&ch=300&t=0&submit=%D0%9F%D0%BE%D0%B8%D1%81%D0%BA`;
  createButton(new3SiteSearchLink, "CS.RIN.RU", "Поиск по cs.rin.ru", "https://torrentfreak.com/images/cs-rin-ru-e1586936958961.png");
  
  const new4SiteSearchLink = `https://online-fix.me/index.php?do=search&subaction=search&story=${formattedGameName}`;
  createButton(new4SiteSearchLink, "Online Fix", "Поиск по Online Fix", "https://i.imgur.com/WAXRAUw.png");

  const new5siteSearchLink = `https://www.skidrowreloaded.com/?s=${formattedGameName}&x=0&y=0`;
  createButton(new5siteSearchLink, "Skidrow", "Поиск на Skidrow", "https://i.imgur.com/sfzB2DE.png");

  const new6siteSearchLink = `https://fitgirl-repacks.site/?s=${formattedGameName}`;
  createButton(new6siteSearchLink, "FitGirl", "Поиск по FitGirl", "https://i.imgur.com/GOFbweI.png");

  const new7SiteSearchLink = `https://steamrip.com/?s=${formattedGameName}`;
  createButton(new7SiteSearchLink, "SteamRIP", "Поиск по SteamRIP", "https://i.imgur.com/tmvOT86.png");

  const new8SiteSearchLink = `https://dodi-repacks.site/?s=${formattedGameName}`;
  createButton(new8SiteSearchLink, "Dodi", "Поиск по Dodi", "https://i.imgur.com/g71t1Ge.png");

  const new9SiteSearchLink = `https://gload.to/?s=${formattedGameName}`;
  createButton(new9SiteSearchLink, "Gload", "Поиск по Gload", "https://gload.to/logo.png");

  const new10SiteSearchLink = `https://crackstatus.net/tracker.php?nm=${formattedGameName}`;
  createButton(new10SiteSearchLink, "Crackstatus", "Поиск по Crackstatus", 
  "https://crackstatus.net/styles/templates/default/images/Hot_icons/rel/PNL2.png");  
})();