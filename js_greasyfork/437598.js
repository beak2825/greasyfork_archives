// ==UserScript==
// @name        [ARCHIWUM]Notatkowator 2020
// @description Szybki podgląd notek
// @version     2.5
// @author      piokom123, look997
// @include     https://www.wykop.pl/*
// @homepageURL https://www.wykop.pl/ludzie/addons/look997/
// @namespace	  https://www.wykop.pl/ludzie/addons/look997/
// @grant       GM_xmlhttpRequest
// @require     https://greasyfork.org/scripts/437595-wykopobserve/code/WykopObserve.js?version=1002287
// @run-at      document-end
// @resource    metadata https://greasyfork.org/scripts/437598-notatkowator-2020/code/Notatkowator%202020.user.js
// @icon        https://www.google.com/s2/favicons?domain=wykop.pl
// @icon64      https://www.google.com/s2/favicons?domain=wykop.pl
// @downloadURL https://update.greasyfork.org/scripts/437598/%5BARCHIWUM%5DNotatkowator%202020.user.js
// @updateURL https://update.greasyfork.org/scripts/437598/%5BARCHIWUM%5DNotatkowator%202020.meta.js
// ==/UserScript==
/// <reference path="./wykopObserve.js" />

(async function () {
"use strict";

// const VSCodeLMDate = "2022/07/12 18:51:50";
// const diffTime = Math.abs(Date.now() - new Date(VSCodeLMDate).getTime())/1000;
// console.log(VSCodeLMDate, `${Math.floor(diffTime)} secs ago`);


//#region HEAD

/**
	* Parses user notes list HTML and returns as object
	* @param {Document} document
	*/
function parseNotes (document) {
	/**
	 * @type {{ nick: string; val: string; }[]}
	 */
	const userNotes = [];
	
	// const too = document.querySelectorAll('#notesList li p');
	// console.log("to",document);
	document.querySelectorAll('#notesList li p').forEach((item,index)=>{
		// console.log("item",item)
		const abEl = /** @type {HTMLElement} */ ( item.querySelector('a b') );
		// console.log("abEl",abEl);
		//if (!(abEl instanceof HTMLElement)) { return false; }
		if (abEl.textContent) {
			userNotes.push({
				nick: abEl.textContent,
				val: parseNote(item.innerHTML)
			});
		}
	});
	return userNotes;
}

/**
	* Parses HTML of one note
	* @param {string} content
	*/
function parseNote (content) {
	const match = content.split('</b></a>')[1].trim();
	const parsedNote = activateLinks( match.indexOf('|') === -1 ? match : match.split('|')[0].trim() );
	
	return parsedNote;
}

/**
	* @param {string} content
	*/
function activateLinks (content) {
	if (content.indexOf('http://') !== -1 || content.indexOf('https://') !== -1) {
		content = content.replace(/(https?:\/\/([^\s]+))/g, '<a href="$1" target="_blank">$1</a>');
	}
	
	return content;
}

/**
	 * @param {string} url
	 */
function fetchText (url) {
	return new Promise((resolve,reject)=>{
		// @ts-ignore
		$.ajax(url).done(function(data) {
			resolve(data);
		});
	});
}

// /**
// 	 * @param {any} url
// 	 */
// function fetchTextBugged (url) {
// 	return new Promise((resolve,reject)=>{
// 		// @ts-ignore
// 		GM_xmlhttpRequest({
// 			method:"GET",
// 			url,
// 			//responseType: "json",
// 			onload: function(response) {
// 				console.log("response",response);
// 				resolve(response.responseText);
// 			},
// 			onerror: function(error) {
// 				reject(error);
// 			}
// 		});
// 	});
// }

const saveStorage = (/** @type {string} */ storageName, /** @type {any} */ ob)=>{
	localStorage.setItem(storageName, JSON.stringify(ob));
};

//#endregion

//#region BODY

const storageName = "userNotes";

const userNotesOb = JSON.parse( localStorage.getItem(storageName) || '{}' );
let userNotes = (typeof userNotesOb === 'object') ?
	(
		Object.entries(userNotesOb).map((/** @type {[ string, string ]} */[nick,val])=>({nick,val}))
	): (
		JSON.parse( localStorage.getItem(storageName) || '[]' )
	);
	
const {refresh} = await wykopObserve(
	[
		filterGroups.mikroblogLinkWpisGlownaTagMojCommentOrSubComment,
		filterGroups.ludziePageCommentOrSubComment
	],
	function ({liEl, contentEl}, {place, isFirstTime, nick, authorSex}) {
		
		const authorEl = liEl.querySelector(".author");
		
		//console.log(nick, userNotes[nick], userNotes)
		
		const user = userNotes.find((/** @type {{ nick: string; val: string }} */ u)=>u.nick===nick);
		if (typeof user === 'undefined') { return false; }
		const content = `| ${user.val}`;
		const noteEl = liEl.querySelector(".note2020");
		if (noteEl) {
			noteEl.remove();
			const spanEl = document.createElement("span");
			spanEl.innerHTML = `<span class="note2020 notesFor_${nick}" style="padding-right: 55px; white-space: normal !important;">${content}</span>`;
			authorEl.append(spanEl.firstElementChild);
		} else {
			const spanEl = document.createElement("span");
			spanEl.innerHTML = `<span class="note2020 notesFor_${nick}" style="padding-right: 55px; white-space: normal !important;">${content}</span>`;
			authorEl.append(spanEl.firstElementChild);
		}
		
}, {once:true});

userNotes = parseNotes( (new DOMParser()).parseFromString(
	await fetchText('https://www.wykop.pl/moj/notatki-o-uzytkownikach/'),
	"text/html"
));
saveStorage(storageName, userNotes);
refresh();

//#endregion

})();
