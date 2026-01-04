// ==UserScript==
// @name         JVC - Alternative Statistics
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Extract who and when anyone posted on current topic
// @author       Lúthien Sofea Elenassë
// @match        https://www.jeuxvideo.com/forums/1-*.htm
// @match        https://www.jeuxvideo.com/forums/42-*.htm
// @license		 MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478359/JVC%20-%20Alternative%20Statistics.user.js
// @updateURL https://update.greasyfork.org/scripts/478359/JVC%20-%20Alternative%20Statistics.meta.js
// ==/UserScript==

(async function() {
    'use strict';

	const baseSaveKey = "JVStats";
	const maxQueue = 40;
	const outOfQueue = 90;

	const regPageUrl = new RegExp("/forums/([0-9]+)-([0-9]+)-([0-9]+)-([0-9]+)-[^-]*-[^-]*-[^-]*-([^.]*).htm");
	const currentPageAnalysis = regPageUrl.exec(location.href);
	const constructUrlFor = page => {
		return [
			"https://api.jeuxvideo.com/forums/",
			currentPageAnalysis[1],	// mode
			"-",
			currentPageAnalysis[2],	// forum
			"-",
			currentPageAnalysis[3],	// topic
			"-",
			page,
			"-0-1-0-",
			currentPageAnalysis[5],	// topic title
			".htm",
		].join("");
	};
	const getLastPage = () => {
		const lastPageLink = document.querySelector(".pagi-fin-actif");
		if (lastPageLink) {
			return regPageUrl.exec(lastPageLink.href)[4];
		} else {
			return currentPageAnalysis[4];	// already on last page
		}
	};


	const addButton = (label, id, callback) => {
		const method = () => {
			if (confirm(label + " ?")) {
				callback();
			}
		};
		document.querySelectorAll(".bloc-pre-left .group-two").forEach(bloc => {
			const a = document.createElement("a");
			a.href = "#";
			const span = document.createElement("span");
			span.className = "btn btn-actu-new-list-forum";
			span.appendChild(document.createTextNode(label));
			a.appendChild(span);
			bloc.appendChild(a);
			a.addEventListener("click", method);
		});
	};
	const prepareRightColumn = () => {
		const column = document.getElementById("forum-right-col");
		if (column) {
			const card = document.createElement("div");
			card.className = "card card-jv-forum card-forum-margin";
			const cardHeader = document.createElement("div");
			cardHeader.className = "card-header";
			cardHeader.appendChild(document.createTextNode("Statistiques"));
			const cardBody = document.createElement("div");
			cardBody.className = "card-body";
			const bloc = document.createElement("div");
			bloc.className = "bloc-info-forum has-scrollbar rc" + baseSaveKey;
			cardBody.appendChild(bloc);
			card.appendChild(cardHeader);
			card.appendChild(cardBody);
			column.appendChild(card);
		}
	}
	const prepareProgression = (lastPage) => {
		document.querySelectorAll(".rc" + baseSaveKey).forEach(column => {
			const title = document.createElement("h4");
			title.className = "titre-info-fofo";
			title.appendChild(document.createTextNode("Liste des pages à charger"));
			const body = document.createElement("div");
			body.className = "bloc-modo-fofo";
			for (var i = 1; i < lastPage + 1; i++) {
				const pageMarker = document.createElement("div");
				pageMarker.className = "page-" + i;
				pageMarker.appendChild(document.createTextNode(i));
				body.appendChild(pageMarker);
			}
			column.appendChild(title);
			column.appendChild(body);
		});
	};
	const showProgression = (page, done) => {
		document.querySelectorAll(".page-" + page).forEach(marker => {
			if (done) {
				marker.parentNode.removeChild(marker);
			} else {
				marker.className += " progressing";
				marker.style.color = "red";
			}
		});
	};


	const queue = [];
	const removeFromQueue = element => {
		const index = queue.indexOf(element);
		if (index >= 0) {
			queue.splice(index, 1);
		}
	};
	const openNextPage = async (url, tryWeight) => {
		let waitUntilNextTry;
		let failWeight;
		if (tryWeight > 100) {
			throw new Error("Could not reach : " + url);
		} else if (queue.length < maxQueue) {
			queue.push(url);
			const response = await fetch(url);
			setTimeout(() => removeFromQueue(url), outOfQueue * 1000);
			if (response.ok) {
				const content = await response.text();
				const parser = new DOMParser();
				return parser.parseFromString(content, 'text/html');
			} else {
				waitUntilNextTry = 5000 + tryWeight * 100;
				failWeight = 10;
			}
		} else {
			waitUntilNextTry = 10000 + tryWeight * 1000;
			failWeight = 1;
		}
		return new Promise(resolve => {
			setTimeout(async () => {
				const result = await openNextPage(url, tryWeight + failWeight);
				resolve(result);
			}, waitUntilNextTry);
		});
	};


	const months = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
	const dateRegExp = new RegExp("([0-9]{1,2}) ([" + months.join("|") + "]+) ([0-9]{4}) à ([0-9]{2}):([0-9]{2}):([0-9]{2})");
	const readDate = text => {
		const result = dateRegExp.exec(text);
		if (result) {
			const date = new Date();
			date.setYear(parseInt(result[3], 10));
			date.setMonth(months.indexOf(result[2]));
			date.setDate(parseInt(result[1], 10));
			date.setHours(parseInt(result[4], 10));
			date.setMinutes(parseInt(result[5], 10));
			date.setSeconds(parseInt(result[6], 10));
			date.setMilliseconds(0);
			return date;
		}
		console.error(text);
		throw new Error("Could not read date : " + text);
	};


	const getMessageDescription = message => {
		const id = parseInt(message.getAttribute("id").split("_").pop(), 10);
		const pseudo = message.querySelector(".bloc-pseudo-msg").innerText.trim().toLowerCase();
		const dateAsText = message.querySelector(".date-post").innerText.trim().toLowerCase();
		const date = readDate(dateAsText);
		const stamp = date.getTime() / 1000;
		return {
			id: id,
			pseudo: pseudo,
			stamp: stamp,
		};
	};
	const readPage = doc => {
		const messageList = [];
		doc.querySelectorAll(".post").forEach(message => {
			const description = getMessageDescription(message);
			messageList.push(description);
		});
		return messageList;
	};


	const topicHistory = [];
	const pages = [];
	const distributePages = (messages, firstPage, lastPage) => {
		for (var i = 0; i < lastPage - firstPage + 1; i++) {
			if (!pages[firstPage + i]) {
				pages[firstPage + i] = messages.slice(20 * i, 20 * (i + 1));
				showProgression(firstPage + i, true);
			}
		}
	};
	const diviseHistory = (currentMessages, allMessages) => {
		const result = {
			before: [],
			has: [],
			lost: [],
			after: [],
		};
		const ids = [];
		currentMessages.forEach(message => {
			ids.push(message.id);
		});
		const last = currentMessages.length - 1;
		allMessages.forEach(message => {
			if (message.stamp < currentMessages[0].stamp) {
				result.before.push(message);
			} else if (message.stamp > currentMessages[last].stamp) {
				result.after.push(message);
			} else if (ids.indexOf(message.id) >= 0) {
				result.has.push(message);
			} else if (message.stamp === currentMessages[0].stamp) {
				result.before.push(message);
			} else if (message.stamp === currentMessages[last].stamp) {
				result.after.push(message);
			} else {
				result.lost.push(message);
			}
		});
		return result;
	};
	const addPageInHistory = (doc, pageNumber, historyBloc) => {
		const messageList = readPage(doc);
		pages[pageNumber] = messageList;
		showProgression(pageNumber, true);
		const cutHistory = diviseHistory(messageList, historyBloc.messages);
		if (historyBloc.to > pageNumber) {
			let testLengthAfter;
			const baseLength = 20 * (historyBloc.to - pageNumber);
			if (historyBloc.hasLastPage) {
				testLengthAfter = cutHistory.after.length > baseLength - 20 && cutHistory.after.length <= baseLength;
			} else {
				testLengthAfter = cutHistory.after.length === baseLength;
			}
			if (testLengthAfter) {
				distributePages(cutHistory.after, pageNumber + 1, historyBloc.to);
			} else {
				topicHistory.push({
					from: pageNumber + 1,
					to: historyBloc.to,
					messages: cutHistory.after,
					hasLastPage: historyBloc.hasLastPage,
					firstDescent: false,
				});
			}
		}
		if (historyBloc.from < pageNumber) {
			if (cutHistory.before.length === 20 * (pageNumber - historyBloc.from)) {
				distributePages(cutHistory.before, historyBloc.from, pageNumber - 1);
			} else {
				topicHistory.push({
					from: historyBloc.from,
					to: pageNumber - 1,
					messages: cutHistory.before,
					hasLastPage: false,
					firstDescent: historyBloc.firstDescent,
				});
			}
		}
	};
	const determineNextPage = (historyBloc, lastPage) => {
		if (historyBloc.nextPage) {
			return historyBloc.nextPage;
		} else if (historyBloc.messages.length === 0) {
			return historyBloc.from;
		} else if (historyBloc.firstDescent) {
			return Math.max(1, 2 * historyBloc.to - lastPage);
		} else {
			return Math.round((historyBloc.to - historyBloc.from) / 2) + historyBloc.from;
		}
	};


	const cleanSave  = raw => {
		return JSON.parse(raw);
	};
	const concatFullHistory = () => {
		const fullHistory = [];
		pages.forEach(page => {
			page.forEach(message => {
				fullHistory.push(message);
			});
		});
		return fullHistory;
	};
	const startHistory = async (currentPage, lastPage, allMessages) => {
		topicHistory.push({
			from: 1,
			to: lastPage,
			messages: allMessages,
			hasLastPage: true,
			firstDescent: true,
			nextPage: currentPage,
		});
		while (topicHistory.length > 0) {
			const nextHistoryBloc = topicHistory.pop();
			topicHistory.push(nextHistoryBloc);	// for partial saves we keep the bloc in the list as much as possible
			const nextPage = determineNextPage(nextHistoryBloc, lastPage);
			console.debug({
				history: topicHistory.concat([]),
				pages: pages.concat([]),
				page: nextPage,
			});
			showProgression(nextPage, false);
			const url = constructUrlFor(nextPage);
			const doc = await openNextPage(url, 0);
			topicHistory.pop();
			addPageInHistory(doc, nextPage, nextHistoryBloc);
		}
		console.debug({
			history: topicHistory,
			pages: pages,
		});
	};


	const concatPartialSaveHistory = () => {
		const tempPages = pages.concat([]);
		topicHistory.forEach(historyBloc => {
			tempPages[historyBloc.from] = historyBloc.messages;
		});
		const partialHistory = [];
		tempPages.forEach((page, i) => {
			if (Array.isArray(page)) {
				console.debug("page " + i);
				page.forEach(message => {
					partialHistory.push(message);
				});
			}
		});
		console.debug({
			partial: true,
			history: topicHistory.concat([]),
			pages: tempPages,
			save: partialHistory,
		});
		return partialHistory;
	};
	const addSavePartialProgression = saveKey => {
		const method = () => {
			const partialHistory = concatPartialSaveHistory();
			localStorage.setItem(saveKey, JSON.stringify(partialHistory));
		}
		document.querySelectorAll(".rc" + baseSaveKey).forEach(column => {
			const title = document.createElement("h4");
			title.className = "titre-info-fofo";
			title.appendChild(document.createTextNode("Sauvegarde partielle"));
			const body = document.createElement("div");
			body.className = "bloc-modo-fofo";
			const action = document.createElement("a");
			action.href = "#";
			action.appendChild(document.createTextNode("Sauvegarder"));
			action.addEventListener("click", method);
			body.appendChild(action);
			column.appendChild(title);
			column.appendChild(body);
		});
	};


	const rewriteAsText = (message, i) => {
		return [
			i + 1,
			message.id,
			message.pseudo,
			message.stamp,
			new Date(message.stamp * 1000).toLocaleString(),
		].join(" ");
	};
	const analyse = fullHistory => {
		document.querySelectorAll(".rc" + baseSaveKey).forEach(column => {
			while (column.firstChild) {
				column.removeChild(column.firstChild);
			}
			const title = document.createElement("h4");
			title.className = "titre-info-fofo";
			title.appendChild(document.createTextNode("Liste des posteurs"));
			const body = document.createElement("div");
			body.className = "bloc-modo-fofo";
			const output = document.createElement("textarea");
			output.style.width = "100%";
			output.style.fontSize = "75%";
			output.value = fullHistory.reduce((list, message, i) => {
				const text = rewriteAsText(message, i);
				list.push(text);
				return list;
			}, []).join("\n");
			body.appendChild(output);
			column.appendChild(title);
			column.appendChild(body);
		});
	};


	const start = async () => {
		if (currentPageAnalysis) {
			const saveKey = [
				baseSaveKey,
				currentPageAnalysis[2],
				currentPageAnalysis[3],
			].join("_");
			const save = localStorage.getItem(saveKey);
			if (save) {
				addButton("Remove stats", "removeStats", () => {
					localStorage.removeItem(saveKey);
				});
				prepareRightColumn();
				addSavePartialProgression(saveKey);
				const baseHistory = cleanSave(save);
				const lastPage = parseInt(getLastPage(), 10);
				prepareProgression(lastPage);
				await startHistory(parseInt(currentPageAnalysis[4], 10), lastPage, baseHistory);
				const fullHistory = concatFullHistory();
				localStorage.setItem(saveKey, JSON.stringify(fullHistory));
				analyse(fullHistory);
			} else {
				addButton("Create stats", "createStats", () => {
					localStorage.setItem(saveKey, "[]");
					location.reload();
				});
			}
		}
	};

	start();
})();
