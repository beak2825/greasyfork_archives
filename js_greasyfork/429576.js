// ==UserScript==
// @name         AO3 Collection Exchange Assignment Notes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Free text notes next to each assignment
// @author       exuvia
// @match        https://archiveofourown.org/collections/*/assignments?unfulfilled=true*
// @match        https://archiveofourown.org/collections/*/assignments?fulfilled=true*
// @match        https://archiveofourown.org/collections/*/assignments?pinch_hit=true*
// @match        https://archiveofourown.org/collections/*/assignments*
// @icon         http://archiveofourown.org/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429576/AO3%20Collection%20Exchange%20Assignment%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/429576/AO3%20Collection%20Exchange%20Assignment%20Notes.meta.js
// ==/UserScript==

(function() {

	/*
This assumes all gifter-recip pairs are unique. So "A for B" would never appear more than once, and "A for B" could be used to uniquely identify an assignment.
	*/

	const settings = {//change these: true for on, false for off
		notes : true, //notes are saved in localStorage, which goes away on incognito sessions
		doubleAssignFlag : true, //not implemented
		hideOption : true //not implemented
	};

	window.saveName = "AO3CollectionAssignmentNotes" + window.location.href.match(/collections\/(.+)\/assignments/)[1];

	window.saveData = {};

	window.exportSave = () => { //To export save, enter exportSave() into console
		window.localStorage[window.saveName];
	}

	window.importSave = (save) => {//To import save, enter importSave(save export) into console
		window.localStorage[window.saveName] = save;
		location.reload(true)
	}


	if (window.localStorage[window.saveName] !== undefined) window.saveData = JSON.parse(window.localStorage[window.saveName]);


	const exportNotes = () => JSON.parse(window.localStorage[window.saveName]);

	const createTextbox = (id, writer, recip) => { //creates note box to write in
		let textbox = document.createElement("INPUT");
		textbox.setAttribute("type", "text");
		textbox.style.width = "50%";
		textbox.style.float = "right";
		textbox.oninput = () => {
			window.saveData[id] = {
				writer : writer,
				recip : recip,
				notes : textbox.value
			}
		//	console.log("Updated!")
			window.localStorage[window.saveName] = JSON.stringify(window.saveData);
		}
		if (window.saveData[id] !== undefined) textbox.value = window.saveData[id].notes;
		return textbox;
	}

	if (settings.notes === true){

		if (window.location.href.includes("unfulfilled=true")){//Assignments: Open
			Array.from(document.getElementsByClassName("creator")).forEach(details => {
			  let writer = details.childNodes[2].nodeValue.trim();
			  let recip = details.getElementsByClassName("recipient")[0].innerText.replace("for ","").trim();
			  let id = writer + recip;
			  details.appendChild(createTextbox(id,writer,recip));
			})
		}

		else if (window.location.href.includes("fulfilled=true")){//Assignments: Complete
			Array.from(document.getElementsByClassName("index group")).forEach(item => {
			  let writer = item.children[0].childNodes[0].nodeValue.trim();
			  let recip = item.querySelectorAll("[href*='assignments']")[0].innerText.trim();
			  let id = writer + recip;
			  item.children[0].appendChild(createTextbox(id,writer,recip));
			})
		}

		else if (window.location.href.includes("pinch_hit=true")){//Assignments: Pinch Hits
			Array.from(document.getElementsByClassName("creator")).forEach(details => {
			  let writer = details.childNodes[2].nodeValue.trim();
			  let recip = details.getElementsByClassName("recipient")[0].innerText.replace("for ","").trim();
			  let id = writer + recip;
			  details.appendChild(createTextbox(id,writer,recip));
			})
		}

		else{//Assignments: Defaulted
			Array.from(document.getElementsByClassName("assignment")).forEach(item => {
			  let recip = item.children[0].innerText.trim()
			  let writer = item.nextElementSibling.children[0].innerText.replace("Undefault ","").trim()
			  let id = writer + recip;
			  item.nextElementSibling.appendChild(createTextbox(id,writer,recip));
			})
		}


	}


})();