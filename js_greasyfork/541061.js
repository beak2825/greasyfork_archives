// ==UserScript==
// @name         Studydrive Flashcards Anki apkg downloader
// @namespace    http://tampermonkey.net/
// @version      2025-06-28
// @description  Download Studydrive Flashcards as Anki apkg files
// @author       You
// @match        https://www.studydrive.net/*/flashcards/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=studydrive.net
// @license      MIT
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_cookie
// @require      https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/sql-wasm.js#sha512=Yra4xuTWinXfBpG2ftgDX8MVmMiOev1FtqiYs51+kEna/5peD0kZqAL1syYCH61f9gxmAFidIJz42IKcRhWMkw==
// @require      https://raw.githubusercontent.com/gildas-lormeau/zip.js/refs/tags/v2.7.62/dist/zip.min.js#sha256=6bce9ec4fa70defbfd9358af62b0f70db3cd2f820a54ffa82f94e35422b78683
// @downloadURL https://update.greasyfork.org/scripts/541061/Studydrive%20Flashcards%20Anki%20apkg%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/541061/Studydrive%20Flashcards%20Anki%20apkg%20downloader.meta.js
// ==/UserScript==

/* global zip */
/* global initSqlJs */

/*
The awesome Anki apkg export code is taken from https://github.com/Steve2955/anki-apkg-export which is a fork of https://github.com/repeat-space/anki-apkg-export
I had to modify it at a few places to make it useable in a userscript.
*/

const USE_LARGE_IMAGE_VERSION = true;

async function sha1(str) {
	const enc = new TextEncoder();
	const hash = await crypto.subtle.digest('SHA-1', enc.encode(str));
	return Array.from(new Uint8Array(hash))
		.map(v => v.toString(16).padStart(2, '0'))
		.join('');
}

function createTemplate({
	questionFormat = "{{Front}}",
	answerFormat = '{{FrontSide}}\n\n<hr id="answer">\n\n{{Back}}',
	css = ".card {\n font-family: arial;\n font-size: 20px;\n text-align: center;\n color: black;\nbackground-color: white;\n}\n",
} = {}) {
	const conf = {
		nextPos: 1,
		estTimes: true,
		activeDecks: [1],
		sortType: "noteFld",
		timeLim: 0,
		sortBackwards: false,
		addToCur: true,
		curDeck: 1,
		newBury: true,
		newSpread: 0,
		dueCounts: true,
		curModel: "1435645724216",
		collapseTime: 1200,
	};

	const models = {
		1388596687391: {
			veArs: [],
			name: "Basic-f15d2",
			tags: ["Tag"],
			did: 1435588830424,
			usn: -1,
			req: [[0, "all", [0]]],
			flds: [
				{
					name: "Front",
					media: [],
					sticky: false,
					rtl: false,
					ord: 0,
					font: "Arial",
					size: 20,
				},
				{
					name: "Back",
					media: [],
					sticky: false,
					rtl: false,
					ord: 1,
					font: "Arial",
					size: 20,
				},
			],
			sortf: 0,
			latexPre:
			"\\documentclass[12pt]{article}\n\\special{papersize=3in,5in}\n\\usepackage[utf8]{inputenc}\n\\usepackage{amssymb,amsmath}\n\\pagestyle{empty}\n\\setlength{\\parindent}{0in}\n\\begin{document}\n",
			tmpls: [
				{
					name: "Card 1",
					qfmt: questionFormat,
					did: null,
					bafmt: "",
					afmt: answerFormat,
					ord: 0,
					bqfmt: "",
				},
			],
			latexPost: "\\end{document}",
			type: 0,
			id: 1388596687391,
			css,
			mod: 1435645658,
		},
	};

	const decks = {
		1: {
			desc: "",
			name: "Default",
			extendRev: 50,
			usn: 0,
			collapsed: false,
			newToday: [0, 0],
			timeToday: [0, 0],
			dyn: 0,
			extendNew: 10,
			conf: 1,
			revToday: [0, 0],
			lrnToday: [0, 0],
			id: 1,
			mod: 1435645724,
		},
		1435588830424: {
			desc: "",
			name: "Template",
			extendRev: 50,
			usn: -1,
			collapsed: false,
			newToday: [545, 0],
			timeToday: [545, 0],
			dyn: 0,
			extendNew: 10,
			conf: 1,
			revToday: [545, 0],
			lrnToday: [545, 0],
			id: 1435588830424,
			mod: 1435588830,
		},
	};

	const dconf = {
		1: {
			name: "Default",
			replayq: true,
			lapse: {
				leechFails: 8,
				minInt: 1,
				delays: [10],
				leechAction: 0,
				mult: 0,
			},
			rev: {
				perDay: 100,
				fuzz: 0.05,
				ivlFct: 1,
				maxIvl: 36500,
				ease4: 1.3,
				bury: true,
				minSpace: 1,
			},
			timer: 0,
			maxTaken: 60,
			usn: 0,
			new: {
				perDay: 20,
				delays: [1, 10],
				separate: true,
				ints: [1, 4, 7],
				initialFactor: 2500,
				bury: true,
				order: 1,
			},
			mod: 0,
			id: 1,
			autoplay: true,
		},
	};

	return `
    PRAGMA foreign_keys=OFF;
    BEGIN TRANSACTION;
    CREATE TABLE col (
        id              integer primary key,
        crt             integer not null,
        mod             integer not null,
        scm             integer not null,
        ver             integer not null,
        dty             integer not null,
        usn             integer not null,
        ls              integer not null,
        conf            text not null,
        models          text not null,
        decks           text not null,
        dconf           text not null,
        tags            text not null
    );
    INSERT INTO "col" VALUES(
      1,
      1388548800,
      1435645724219,
      1435645724215,
      11,
      0,
      0,
      0,
      '${JSON.stringify(conf)}',
      '${JSON.stringify(models)}',
      '${JSON.stringify(decks)}',
      '${JSON.stringify(dconf)}',
      '{}'
    );
    CREATE TABLE notes (
        id              integer primary key,   /* 0 */
        guid            text not null,         /* 1 */
        mid             integer not null,      /* 2 */
        mod             integer not null,      /* 3 */
        usn             integer not null,      /* 4 */
        tags            text not null,         /* 5 */
        flds            text not null,         /* 6 */
        sfld            integer not null,      /* 7 */
        csum            integer not null,      /* 8 */
        flags           integer not null,      /* 9 */
        data            text not null          /* 10 */
    );
    CREATE TABLE cards (
        id              integer primary key,   /* 0 */
        nid             integer not null,      /* 1 */
        did             integer not null,      /* 2 */
        ord             integer not null,      /* 3 */
        mod             integer not null,      /* 4 */
        usn             integer not null,      /* 5 */
        type            integer not null,      /* 6 */
        queue           integer not null,      /* 7 */
        due             integer not null,      /* 8 */
        ivl             integer not null,      /* 9 */
        factor          integer not null,      /* 10 */
        reps            integer not null,      /* 11 */
        lapses          integer not null,      /* 12 */
        left            integer not null,      /* 13 */
        odue            integer not null,      /* 14 */
        odid            integer not null,      /* 15 */
        flags           integer not null,      /* 16 */
        data            text not null          /* 17 */
    );
    CREATE TABLE revlog (
        id              integer primary key,
        cid             integer not null,
        usn             integer not null,
        ease            integer not null,
        ivl             integer not null,
        lastIvl         integer not null,
        factor          integer not null,
        time            integer not null,
        type            integer not null
    );
    CREATE TABLE graves (
        usn             integer not null,
        oid             integer not null,
        type            integer not null
    );
    ANALYZE sqlite_master;
    INSERT INTO "sqlite_stat1" VALUES('col',NULL,'1');
    CREATE INDEX ix_notes_usn on notes (usn);
    CREATE INDEX ix_cards_usn on cards (usn);
    CREATE INDEX ix_revlog_usn on revlog (usn);
    CREATE INDEX ix_cards_nid on cards (nid);
    CREATE INDEX ix_cards_sched on cards (did, queue, due);
    CREATE INDEX ix_revlog_cid on revlog (cid);
    CREATE INDEX ix_notes_csum on notes (csum);
    COMMIT;
  `;
}

const getLastItem = (obj) => {
	const keys = Object.keys(obj);
	const lastKey = keys[keys.length - 1];

	const item = obj[lastKey];
	delete obj[lastKey];

	return item;
};

class Exporter {
	constructor(deckName, { template, sql }) {
		this.db = new sql.Database();
		this.media = [];
		this.separator = "\u001F";
		this.deckName = deckName;
		this.template = template;
	}

	async init() {
		this.db.run(this.template);
		const now = Date.now();
		this.topDeckId = await this._getDeckGuid(this.deckName);
		this.topModelId = this.topDeckId;

		const decks = this._getInitialRowValue("col", "decks");
		const deck = getLastItem(decks);
		deck.name = this.deckName;
		deck.id = this.topDeckId;
		decks[this.topDeckId + ""] = deck;
		this._update("update col set decks=:decks where id=1", {
			":decks": JSON.stringify(decks),
		});

		const models = this._getInitialRowValue("col", "models");
		const model = getLastItem(models);
		model.name = this.deckName;
		model.did = this.topDeckId;
		model.id = this.topModelId;
		models[`${this.topModelId}`] = model;
		this._update("update col set models=:models where id=1", {
			":models": JSON.stringify(models),
		});
	}

	/*
	// JSZip version (I couldn't get it work right)
	save(options) {
		const binaryArray = this.db.export(); // Assume Uint8Array
		const mediaObj = this.media.reduce((prev, curr, idx) => {
			prev[idx] = curr.filename;
			return prev;
		}, {});

		// Instead of Buffer.from(binaryArray) just use binaryArray
		const zip = new JSZip();
		zip.file("collection.anki2", binaryArray);
		zip.file("media", JSON.stringify(mediaObj));

		this.media.forEach((item, i) => zip.file(i, item.data));

		console.log(binaryArray);
		console.log("collection.anki size", typeof(binaryArray), binaryArray.length);

		return this.zip.generateAsync({ type: "blob", ...options });
	}
	*/

	async save(options) {
		// zip.js version (only the webworker version seems to work)
		const binaryArray = this.db.export(); // Assume Uint8Array
		const mediaObj = this.media.reduce((prev, curr, idx) => {
			prev[idx] = curr.filename;
			return prev;
		}, {});

		const zipFileWriter = new zip.BlobWriter();
		const zipWriter = new zip.ZipWriter(zipFileWriter);
		await zipWriter.add("collection.anki2", new zip.Uint8ArrayReader(binaryArray));
		await zipWriter.add("media", new zip.TextReader(JSON.stringify(mediaObj)));
		for (let [i, item] of this.media.entries()) {
			await zipWriter.add(i.toString(), new zip.BlobReader(item.data));
		}
		await zipWriter.close();
		const zipBlob = await zipFileWriter.getData();

		return zipBlob;
	}

	addMedia(filename, data) {
		this.media.push({ filename, data });
	}

	async addCard(front, back, { tags } = {}) {
		const { topDeckId, topModelId, separator } = this;
		const now = Date.now();
		const note_guid = await this._getNoteGuid(topDeckId, front);
		const note_id = this._getNoteId(note_guid, now);

		let strTags = "";
		if (typeof tags === "string") {
			strTags = tags;
		} else if (Array.isArray(tags)) {
			strTags = this._tagsToStr(tags);
		}

		this._update(
			"insert or replace into notes values(:id,:guid,:mid,:mod,:usn,:tags,:flds,:sfld,:csum,:flags,:data)",
			{
				":id": note_id, // integer primary key,
				":guid": note_guid, // text not null,
				":mid": topModelId, // integer not null,
				":mod": this._getId("notes", "mod", now), // integer not null,
				":usn": -1, // integer not null,
				":tags": strTags, // text not null,
				":flds": front + separator + back, // text not null,
				":sfld": front, // integer not null,
				":csum": await this._checksum(front + separator + back), //integer not null,
				":flags": 0, // integer not null,
				":data": "", // text not null,
			}
		);

		return this._update(
			"insert or replace into cards values(:id,:nid,:did,:ord,:mod,:usn,:type,:queue,:due,:ivl,:factor,:reps,:lapses,:left,:odue,:odid,:flags,:data)",
			{
				":id": this._getCardId(note_id, now), // integer primary key,
				":nid": note_id, // integer not null,
				":did": topDeckId, // integer not null,
				":ord": 0, // integer not null,
				":mod": this._getId("cards", "mod", now), // integer not null,
				":usn": -1, // integer not null,
				":type": 0, // integer not null,
				":queue": 0, // integer not null,
				":due": 179, // integer not null,
				":ivl": 0, // integer not null,
				":factor": 0, // integer not null,
				":reps": 0, // integer not null,
				":lapses": 0, // integer not null,
				":left": 0, // integer not null,
				":odue": 0, // integer not null,
				":odid": 0, // integer not null,
				":flags": 0, // integer not null,
				":data": "", // text not null
			}
		);
	}

	_update(query, obj) {
		this.db.prepare(query).getAsObject(obj);
	}

	_getInitialRowValue(table, column = "id") {
		const query = `select ${column} from ${table}`;
		return this._getFirstVal(query);
	}

	async _checksum(str) {
		const hashBytes = await sha1(str);
		return parseInt(hashBytes.substr(0, 8), 16);
	}

	_getFirstVal(query) {
		return JSON.parse(this.db.exec(query)[0].values[0]);
	}

	_tagsToStr(tags = []) {
		return " " + tags.map((tag) => tag.replace(/ /g, "_")).join(" ") + " ";
	}

	_getId(table, col, ts) {
		const query = `SELECT ${col} from ${table} WHERE ${col} >= :ts ORDER BY ${col} DESC LIMIT 1`;
		const rowObj = this.db.prepare(query).getAsObject({ ":ts": ts });

		return rowObj[col] ? +rowObj[col] + 1 : ts;
	}

	async _getDeckGuid(deckName) {
		const hashBytes = await sha1(deckName);
		return parseInt(hashBytes.slice(0, 8), 16);
	}

	_getNoteId(guid, ts) {
		const query = `SELECT id from notes WHERE guid = :guid ORDER BY id DESC LIMIT 1`;
		const rowObj = this.db.prepare(query).getAsObject({ ":guid": guid });

		return rowObj.id || this._getId("notes", "id", ts);
	}

	async _getNoteGuid(topDeckId, front) {
		return await sha1(`${topDeckId}${front}`);
	}

	_getCardId(note_id, ts) {
		const query = `SELECT id from cards WHERE nid = :note_id ORDER BY id DESC LIMIT 1`;
		const rowObj = this.db.prepare(query).getAsObject({ ":note_id": note_id });

		return rowObj.id || this._getId("cards", "id", ts);
	}
}

async function createAnkiExporter(deckName, template) {
	const sql = await initSqlJs({
		locateFile: file => 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/sql-wasm.wasm'
	});
	const exporter = new Exporter(deckName, {
		template: createTemplate(template),
		sql,
	});
	await exporter.init();
	return exporter;
}


(function() {
	'use strict';

	async function fetchCardsData() {
		const flashcardsSetId = parseInt(window.location.pathname.split("/")[4]);

		const authToken = "Bearer " + (await GM.cookie.list({"name": "sd_at"}))[0].value;

		let lastPage = 1;
		const cards = [];

		for(let i=0; i<lastPage; i++) {
			const resp = await fetch(`https://www.studydrive.net/flashcards/sets/${flashcardsSetId}/cards?page=${i}&order_by=`, {
				"headers": {
					"Accept": "application/json,text/plain,*/*",
					"Authorization": authToken,
					"X-Requested-With": "XMLHttpRequest",
				},
				"method": "GET",
			});

			const data = await resp.json();
			lastPage = data.cards.last_page;
			cards.push(...data.cards.data);

			if(data.success != true) {
				console.error("Failed to fetch cards data");
				return;
			}
		}

		if(cards.length == 0) {
			console.error("No cards found. Something went wrong");
			return;
		}

		return cards;
	}

	async function addCardToAPKG(apkg, card) {
		let frontHTML = "";
		let backHTML = "";

		for(let image of card.images) {
			const imageUrl = USE_LARGE_IMAGE_VERSION ? image.large_file_path : image.file_path;
			const imageFilename = image.filename;
			const resp = await fetch(imageUrl);

			apkg.addMedia(image.filename, await resp.blob());
			if(image.card_side == "term") {
				frontHTML += `<img src="${imageFilename}"/>`;
			} else if(image.card_side == "definition") {
				backHTML += `<img src="${imageFilename}"/>`;
			} else {
				console.error("Unkown card_side:", image.card_side);
			}
		}

		frontHTML += card.term; // or term_plain
		backHTML += card.definition; // or definition_plain

		await apkg.addCard(frontHTML, backHTML);
	}

	async function createAPKG(deckTitle, cards) {
		const apkg = await createAnkiExporter(deckTitle);
		for(let card of cards) {
			await addCardToAPKG(apkg, card);
		}

		return await apkg.save();
	}

	async function downloadAPKG(apkgZip, filename) {
		const blobUrl = URL.createObjectURL(apkgZip);
		GM_download({
			url: blobUrl,
			name: filename || "flashcards.apkg",
			onerror: (download) => {
				if(download.error == "not_whitelisted") {
					alert("You need to whitelist the apkg extension in the tampermonkey settings");
				} else {
					console.error("Error occured while downloading buffer", download);
				}
			}
		});

	}

	async function downloadFlashcards() {
		const deckTitle = document.querySelector("h1").textContent || "studydrive_deck";
		const apkgFilename = deckTitle.replace(/[\/\\:*?"<>|]+/g, '_') + ".apkg";
		const cards = await fetchCardsData();
		const apkgZip = await createAPKG(deckTitle, cards);
		await downloadAPKG(apkgZip, apkgFilename);
	}

	// Simple function to change the tag of a node and remove unwanted attributes from it
	function changeNodeTag(node, newTag, ignoreAttributes = []) {
		const newNode = document.createElement(newTag);
		newNode.innerHTML = node.innerHTML;

		// Copy attributes from the old node to the new node, ignoring specified attributes
		Array.from(node.attributes).forEach(attr => {
			if (!ignoreAttributes.includes(attr.name)) {
				newNode.setAttribute(attr.name, attr.value);
			}
		});

		return newNode;
	}

	async function addDownloadButton() {
		/* We need to get a specfic button already on the page, so we can copy the style, and put our new Button beside it
		Because the page builds dynamically, we try multiple times to find the button. Also everything is encapsulated in
		a promise because it is nice. */
		const setupButtonRoutine = (async () => {
			const timeoutMs = 5000;
			return new Promise((resolve, reject) => {
				const startTime = Date.now();
				const setupButtonInterval = setInterval(() => {
					const learnButton = document.querySelector('a[href*="/flashcards/study/"][class*="btn-cta"]');

					// Make sure the learn button is defined and the children are also loaded in
					if (learnButton && learnButton.querySelector(".label div")) {
						clearInterval(setupButtonInterval);
						resolve(learnButton);
					} else if (Date.now() - startTime > timeoutMs) {
						clearInterval(setupButtonInterval);
						reject(new Error('Learn button not found within the specified timeout.'));
					}
				}, 500);
			})
		});

		// Clone the button, change the tag (we don't want a link) style it a bit, add the event handler and put it on the page
		const learnButton = await setupButtonRoutine();
		const downloadButton = changeNodeTag(learnButton.cloneNode(true), "div", ["href"]);
		console.log(downloadButton);
		downloadButton.querySelector(".label div").innerHTML = "Download";
		downloadButton.style.margin = "1em";
		downloadButton.addEventListener("click", downloadFlashcards);
		learnButton.parentNode.appendChild(downloadButton);
	}

	GM_registerMenuCommand("Test APKG", downloadFlashcards);
	addDownloadButton();
})();