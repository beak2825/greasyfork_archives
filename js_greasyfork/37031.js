// ==UserScript==
// @name         HIT Database Backup
// @namespace    https://github.com/Kadauchi
// @version      1.0.2
// @description  Does things...
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @include      https://www.mturk.com/hitdb
// @downloadURL https://update.greasyfork.org/scripts/37031/HIT%20Database%20Backup.user.js
// @updateURL https://update.greasyfork.org/scripts/37031/HIT%20Database%20Backup.meta.js
// ==/UserScript==

document.body.innerHTML = `creating hit_database.json.... please wait`;

let hitdb;

const request = window.indexedDB.open(`HITDB`);

request.onsuccess = (event) => {
	hitdb = event.target.result;
	generateFile();
};
request.onupgradeneeded = (event) => {
	document.body.innerHTML = `no hit database found`;
};
request.onerror = (event) => {
	document.body.innerHTML = `error: something went wrong`;
};

async function generateFile() {
	const data = JSON.stringify({
		HIT: await getObjectStore(`HIT`),
		STATS: await getObjectStore(`STATS`),
		NOTES: await getObjectStore(`NOTES`)
	});

	document.body.innerHTML = `creating hit_database.json.... this may take awhile`;

	const exportFile = document.createElement(`a`);
        document.body.appendChild(exportFile);
	exportFile.href = window.URL.createObjectURL(new Blob([data], { type: `application/json` }));
	exportFile.download = `hit_database.json`;
	exportFile.click();

	document.body.innerHTML = `hit_database.json.... downloaded`;
}

function getObjectStore(name) {
	return new Promise((resolve) => {
		try {
			const transaction = hitdb.transaction([name], `readonly`);
			const objectStore = transaction.objectStore(name);

			let cursorCount = 0, cursorAccumulator = [];

			objectStore.openCursor().onsuccess = (event) => {
				document.body.innerHTML = `processing hit database.... ${name} ${++ cursorCount}`;

				const cursor = event.target.result;

				if (cursor) {
					cursorAccumulator.push(cursor.value);
					cursor.continue();
				}
				else {
					resolve(cursorAccumulator);
				}
			};
		}
		catch (error) {
			resolve();
		}
	});
}
