// ==UserScript==
// @name 			Manganelo Helper
// @namespace 		GF-Fear3d
// @version 		1.12
// @description 	Removes space between pages for user-specified series at Manganelo/Mangakakalot/Manganato, and enables arrow key navigation between chapters.
// @author 			Fear3d
// @match 			https://manganelo.com/*
// @match			https://mangakakalot.com/*
// @match           https://readmanganato.com/*
// @match           https://manganato.com/*
// @match           https://chapmanganato.com/*
// @match           https://chapmanganato.to/*
// @require 		https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant			GM_registerMenuCommand
// @grant			GM_setValue
// @grant			GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/412420/Manganelo%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/412420/Manganelo%20Helper.meta.js
// ==/UserScript==

// ****Attention**** This script is not compatible with Greasemonkey 4.0+. Please use Tampermonkey or Violentmonkey instead.

(function() {
 	'use strict';

 	var nextUrl = "";
 	var prevUrl = "";
 	var currentTitle = "";
 	var uiInitialized = false;
 	var atChapter = false;
 	var atManga = false;
 	var atMangakakalot = false;
 	var atManganato = false;
 	var atManganelo = false;
 	var configOpen = false;
 	var curInList = false;

 	// ************************************************************************************************************************************
 	// ************ As of version 0.2 you should not add your new titles here.                             ********************************
 	// ************ You should now add/remove titles through the configuration menu.                       ********************************
 	// ************ Visit https://greasyfork.org/en/scripts/412420-manganelo-helper if you don't know how. ********************************
 	// ************ If you add them via the menu, your titles will be saved even when I update the script. ********************************
 	// ************************************************************************************************************************************
 	// Default list of titles that we want to have no image margines
 	var titleListDefault = [
 		"A Returner's Magic Should Be Special",
 		"God Of Martial Arts",
 		"I Am The Sorcerer King",
 		"I, Who Blocked The Demon King's Ultimate Attack, Ended Up As The Little Hero's Nanny!",
 		"Solo Leveling",
 		"Spirit Sword Sovereign",
 		"Tang Yin Zai Yi Jie",
 		"The Ghostly Doctor",
 		"The God Of High School",
 		"The Top Clan Leader In History",
 		"Tower Of God",
 		"Tomb Raider King"
 	];

 	var titleList;

 	// Configuration UI elements
 	var configWindow = document.createElement("div");
 	var lblTitleList = document.createElement("label");
 	var taTitleList = document.createElement("textarea");
 	var btnAddTitle = document.createElement("button");
 	var btnSave = document.createElement("button");
 	var btnCancel = document.createElement("button");
 	var btnRemoveTitle = document.createElement("button");
 	var divButtons = document.createElement("div");

 	function escapeRegExp(string) {
		return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	}

 	function btnAddTitleClick()
 	{
 		let curTAVal = taTitleList.value.trim();

 		if (atChapter)
 			taTitleList.value = curTAVal + "\r\n" + currentTitle;
 		else if (atMangakakalot && atManga)
 			taTitleList.value = curTAVal + "\r\n" + $(".breadcrumb > p:nth-child(1) > span:nth-child(3) > a:nth-child(1) > span:nth-child(1)", window.top.document).text().trim();
 		else if (atManga)
 			taTitleList.value = curTAVal + "\r\n" + $(".panel-breadcrumb > a:nth-child(3)", window.top.document).text().trim();
 	}

 	function btnSaveClick()
 	{
 		titleList = [...new Set(taTitleList.value.trim().split(/\r?\n/).sort())];
 		GM_setValue("titleList", JSON.stringify(titleList));
 		configWindow.style.display = "none";
 		configOpen = false;

 		if (atChapter)
 			removeMargins();
 	}

 	function btnCancelClick()
 	{
 		configWindow.style.display = "none";
 		configOpen = false;
 	}

 	function btnRemoveTitleClick()
 	{
 		let curTAVal = taTitleList.value.trim();

 		if (atMangakakalot && atManga)
 			currentTitle = $(".breadcrumb > p:nth-child(1) > span:nth-child(3) > a:nth-child(1) > span:nth-child(1)", window.top.document).text().trim();
 		else if (atManga)
 			currentTitle = $(".panel-breadcrumb > a:nth-child(3)", window.top.document).text().trim();

 		var titleReg = new RegExp(escapeRegExp(currentTitle) + "\\r?\\n?", "gi");

 		taTitleList.value = curTAVal.replace(titleReg, "");
 	}

 	// Initializes configuration UI elements
 	function initConfigUI()
 	{
		lblTitleList.innerHTML = "Titles to remove gaps from: ";
		lblTitleList.setAttribute("for", "taTitleList");
		configWindow.appendChild(lblTitleList);
		configWindow.appendChild(document.createElement("br"));

		taTitleList.value = titleList.join("\r\n");
		taTitleList.setAttribute("id", "taTitleList");
		taTitleList.setAttribute("rows", "30");
		taTitleList.setAttribute("cols", "80");
		taTitleList.style.whiteSpace = "pre";
		taTitleList.style.width = "670px";
		configWindow.appendChild(taTitleList);

		btnRemoveTitle.innerHTML = "Remove Current Title";
		btnRemoveTitle.style.margin = "5px";
		btnRemoveTitle.style.marginLeft = "10px";
		btnRemoveTitle.style.marginBottom = "10px";
		btnRemoveTitle.style.fontSize = "18px";
		btnRemoveTitle.style.cssFloat = "left";
		btnRemoveTitle.onclick = function() { btnRemoveTitleClick() };
		divButtons.appendChild(btnRemoveTitle);

		btnAddTitle.innerHTML = "Add Current Title";
		btnAddTitle.style.margin = "5px";
		btnAddTitle.style.marginBottom = "10px";
		btnAddTitle.style.fontSize = "18px";
		btnAddTitle.onclick = function() { btnAddTitleClick() };
		if (atChapter || atManga)
			btnAddTitle.disabled = false;
		else
			btnAddTitle.disabled = true;
		divButtons.appendChild(btnAddTitle);

		btnCancel.innerHTML = "Cancel";
		btnCancel.style.margin = "5px";
		btnCancel.style.marginRight = "10px";
		btnCancel.style.marginBottom = "10px";
		btnCancel.style.fontSize = "18px";
		btnCancel.style.cssFloat = "right";
		btnCancel.onclick = function() { btnCancelClick() };
		divButtons.appendChild(btnCancel);

		btnSave.innerHTML = "Save";
		btnSave.style.margin = "5px";
		btnSave.style.marginBottom = "10px";
		btnSave.style.fontSize = "18px";
		btnSave.style.cssFloat = "right";
		btnSave.onclick = function() { btnSaveClick() };
		divButtons.appendChild(btnSave);

		divButtons.style.textAlign = "center";
		configWindow.appendChild(divButtons);

		configWindow.style.position = "fixed";
		configWindow.style.top = "50%";
		configWindow.style.left = "50%";
		configWindow.style.textAlign = "center";
		configWindow.style.width = "700px";
		configWindow.style.transform = "translate(-50%, -50%)";
		configWindow.style.backgroundColor = "darkviolet";
		configWindow.style.color = "whitesmoke";
		window.top.document.body.appendChild(configWindow);

		uiInitialized = true;
	}

 	 // Displays configuration UI
 	function openConfig()
 	{
 		configOpen = true;

 		if (!uiInitialized) {
 			initConfigUI();
 		}
 		else {
 			taTitleList.value = titleList.join("\r\n");
 			configWindow.style.display = "block";
 		}
 	}

 	// Remove margins between images on specified titles
 	function removeMargins() 
 	{
 		let titleMatch = false;

 		for (let i = 0; i < titleList.length; i++) 
 		{
 			if (titleList[i].trim().toLowerCase() == currentTitle.toLowerCase())
 			{
 				titleMatch = true;
 				curInList = true;
 				break;
 			}
 		}

 		if (!titleMatch && !curInList)
 			return;

 		if (atMangakakalot && titleMatch) {
 			$("#vungdoc img", window.top.document).css("margin", "0 auto 0");
 			$("#vungdoc > div", window.top.document).hide();
 		}
 		else if (titleMatch) {
 			$(".container-chapter-reader img", window.top.document).css("margin", "0 auto 0");
 			$(".container-chapter-reader > div", window.top.document).hide();
 		}
 		else if (atMangakakalot) { // It was originally in the list, but is now removed.
 			$("#vungdoc img", window.top.document).css("margin", "0 auto 5px");
 			curInList = false;
 		}
 		else { // It was originally in the list, but is now removed.
 			$(".container-chapter-reader img", window.top.document).css("margin", "5px auto 0");
 			curInList = false;
 		}
 	}

 	// Find URLs for Next and Prev and sets the current title of the manga
 	function findUrls()
 	{
 		var nextPage, prevPage, curTitleLink;

 		// Find title page link
 		if (atMangakakalot) {
 			curTitleLink = $("div.breadcrumb:nth-child(2) > p:nth-child(1) > span:nth-child(3) > a:nth-child(1)", window.top.document);
 			currentTitle = curTitleLink.attr("title").trim();
 		}
 		else {
 			curTitleLink = $("div.container:nth-child(1) > div.panel-breadcrumb:nth-child(2) > a:nth-child(3)", window.top.document);
 			currentTitle = curTitleLink.text().trim();
 		}

 		// Find next chapter link
 		if (atMangakakalot && $("a.back", window.top.document).length) {
 			nextPage = $("a.back:first", window.top.document);  // This is not an error. Mangakakalot has their 'next/back' buttons named backwards
 		}
 		else if ($("a.navi-change-chapter-btn-next.a-h", window.top.document).length) {
 			nextPage = $("a.navi-change-chapter-btn-next.a-h:first", window.top.document);
 		}
 		else
 			nextPage = curTitleLink; // We're at the last chapter, so set the next page to the title page

 		// Find previous chapter link
 		if (atMangakakalot && $("a.next", window.top.document).length) {
 			prevPage = $("a.next:first", window.top.document);
 		}
 		else if ($("a.navi-change-chapter-btn-prev.a-h", window.top.document).length) {
 			prevPage = $("a.navi-change-chapter-btn-prev.a-h:first", window.top.document);
 		} 
 		else {
 			prevPage = curTitleLink; // We're at the first chapter, so set the prev page to the title page
 		}

    	nextUrl = nextPage.attr("href");
    	prevUrl = prevPage.attr("href");
 	}

 	// Checks if this is the first run, and displays a message if so
 	function checkFirstRun()
 	{
 		var firstRun = GM_getValue("firstRun", true);

 		if (firstRun)
 		{
 			GM_setValue("firstRun", false);
 			alert("Manganelo Helper 1.10\n\n" +
 				'Hello! Manganelo seems to be in the process of changing to "Manganato", which has changed\n' +
 				"the format of their URLs. I believe that I have accounted for it with this update, but they\n" +
 				"don't seem to be doing all of their URLs in a consistent manner now, so it's possible that I\n" +
 				"have missed something. If you notice any situations where this script isn't working, please\n" +
 				"let me know at my greasyfork page at:\n\n" +
 				"https://greasyfork.org/en/scripts/412420-manganelo-helper");
 		}
 	}

 	// Loads title list from storage if it exists, otherwise it uses the default
 	function loadTitleList()
 	{
 		var jTitleList = GM_getValue("titleList");

 		if (!jTitleList)
 			titleList = titleListDefault;
 		else
 			titleList = JSON.parse(jTitleList);
 	}

 	// Handle arrow key events
 	function attachArrowKeyEvent()
 	{
 		document.onkeydown = function(evt) {
			switch (evt.keyCode) {
				case 37: // Left Arrow
					if (!configOpen)
						window.top.location = prevUrl;
					break;
				case 39: // Right Arrow
					if (!configOpen)
						window.top.location = nextUrl;
					break;
				case 65: // a
 					if (!configOpen)
						window.top.location = prevUrl;
 					break;
 				case 68: // d
 					if (!configOpen)
						window.top.location = nextUrl;
 					break;
 				case 87: // w
 					if (!configOpen)
 						window.top.scrollBy({top: -50, behavior: 'auto'});
 					break;
 				case 83: // s
 					if (!configOpen)
 						window.top.scrollBy({top: 50, behavior: 'auto'});
 					break;
			}
		};
 	}

 	$(document).ready(function() 
 	{
 		atMangakakalot = /https:\/\/mangakakalot\.com\S*/.test(window.top.location.href);
 		atManganelo = /https:\/\/manganelo\.com\S*/.test(window.top.location.href);
 		atManganato = /https:\/\/(?:read|chap)?manganato\.(?:com|to)\S*/.test(window.top.location.href);

 		if (atMangakakalot || atManganelo) {
	 		atChapter = /https:\/\/(?:manganelo\.com|mangakakalot\.com)\/chapter\/[\w\.\-~%]+\/[\w\.\-~%]+/.test(window.top.location.href);
	 		atManga = /https:\/\/(?:manganelo\.com|mangakakalot\.com)\/(?:manga\/[\w\.\-~%]+|read-[\w\.\-~%]+)/.test(window.top.location.href);
 		}
 		else {     // atManganato
 			atChapter = /https:\/\/(?:read|chap)?manganato.(?:com|to)\/manga-[\w\.\-~%]+\/chapter-[\d\.\-]+/.test(window.top.location.href);
	 		atManga = /https:\/\/(?:read|chap)?manganato.(?:com|to)\/manga-[\w\.\-~%]+$/.test(window.top.location.href);
 		}

 		if (atChapter)
 			findUrls();

 		loadTitleList();

 		if (atChapter) {
 			removeMargins();
 			attachArrowKeyEvent();
 		}

 		GM_registerMenuCommand("Configure Titles", function () { openConfig() }, "t");
 		checkFirstRun();
	});

})();