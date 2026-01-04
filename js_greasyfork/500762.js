// ==UserScript==
// @name         AttachHowOldtoUserinPosts
// @namespace    https://jirehlov.com
// @version      2.2
// @description  Show how old a user is in posts
// @author       Jirehlov
// @match        https://bgm.tv/*
// @match        https://chii.in/*
// @match        https://bangumi.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500762/AttachHowOldtoUserinPosts.user.js
// @updateURL https://update.greasyfork.org/scripts/500762/AttachHowOldtoUserinPosts.meta.js
// ==/UserScript==
(function () {
	const delay = 4000;
	const ageColors = [
		{
			threshold: 2,
			color: "#FFC966"
		},
		{
			threshold: 5,
			color: "#FFA500"
		},
		{
			threshold: 10,
			color: "#F09199"
		},
		{
			threshold: Infinity,
			color: "#FF0000"
		}
	];
	const DB_NAME = "UserAgesDB";
	const STORE_NAME = "userAges";
	function openDB() {
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(DB_NAME, 1);
			request.onupgradeneeded = event => {
				const db = event.target.result;
				if (!db.objectStoreNames.contains(STORE_NAME)) {
					db.createObjectStore(STORE_NAME);
				}
			};
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}
	function getAll() {
		return openDB().then(db => {
			return new Promise((resolve, reject) => {
				const transaction = db.transaction(STORE_NAME, "readonly");
				const store = transaction.objectStore(STORE_NAME);
				const request = store.getAllKeys();
				request.onsuccess = () => resolve(request.result);
				request.onerror = () => reject(request.error);
			});
		});
	}
	function getAllKeys() {
		return openDB().then(db => {
			return new Promise((resolve, reject) => {
				const transaction = db.transaction(STORE_NAME, "readonly");
				const store = transaction.objectStore(STORE_NAME);
				const request = store.getAllKeys();
				request.onsuccess = () => resolve(request.result.map(key => parseInt(key, 10)).sort((a, b) => a - b));
				request.onerror = () => reject(request.error);
			});
		});
	}
	function getItem(key) {
		return openDB().then(db => {
			return new Promise((resolve, reject) => {
				const transaction = db.transaction(STORE_NAME, "readonly");
				const store = transaction.objectStore(STORE_NAME);
				const request = store.get(key.toString());
				request.onsuccess = () => resolve(request.result || null);
				request.onerror = () => reject(request.error);
			});
		});
	}
	function setItem(key, value) {
		return openDB().then(db => {
			return new Promise((resolve, reject) => {
				const transaction = db.transaction(STORE_NAME, "readwrite");
				const store = transaction.objectStore(STORE_NAME);
				store.put(value, key.toString());
				transaction.oncomplete = () => resolve();
				transaction.onerror = () => reject(transaction.error);
			});
		});
	}
	function setItems(entries) {
		return openDB().then(db => {
			return new Promise((resolve, reject) => {
				const transaction = db.transaction(STORE_NAME, "readwrite");
				const store = transaction.objectStore(STORE_NAME);
				for (const [key, value] of Object.entries(entries)) {
					store.put(value, key.toString());
				}
				transaction.oncomplete = () => resolve();
				transaction.onerror = () => reject(transaction.error);
			});
		});
	}
	function calculateAge(birthDate) {
		const [year, month, day] = birthDate.split("-").map(num => num.padStart(2, "0"));
		const d = new Date(`${ year }-${ month }-${ day }T00:00:00+08:00`);
		const now = new Date();
		let age = now.getUTCFullYear() - d.getUTCFullYear();
		if (now.getUTCMonth() < d.getUTCMonth() || now.getUTCMonth() === d.getUTCMonth() && now.getUTCDate() <= d.getUTCDate()) {
			age--;
		}
		return age;
	}
	function fetchAndStoreUserAge(userLink, delayTime) {
		setTimeout(() => {
			fetch(userLink, { credentials: "omit" }).then(response => response.text()).then(data => {
				const parser = new DOMParser();
				const doc = parser.parseFromString(data, "text/html");
				let registrationDateElement = doc.querySelector("ul.network_service li:first-child span.tip");
				let registrationDate = registrationDateElement ? registrationDateElement.textContent.replace(/加入/g, "").trim() : null;
				if (registrationDate) {
					const userId = userLink.split("/").pop();
					if (userId) {
						setItem(userId, registrationDate).then(() => displayUserAge(userId, registrationDate));
					}
				}
			}).catch(console.error);
		}, delayTime);
	}
	function displayUserAge(userId, registrationDate) {
		const userAnchor = $("strong a.l[href$='/user/" + userId + "']");
		if (userAnchor.length > 0 && userAnchor.next(".age-badge").length === 0) {
			const userAge = calculateAge(registrationDate);
			if (!isNaN(userAge)) {
				const badgeColor = ageColors.find(color => userAge <= color.threshold).color;
				const badge = $(`
				<span class="age-badge" style="
					background-color: ${ badgeColor };
					font-size: 11px;
					padding: 2px 5px;
					color: #FFF;
					border-radius: 100px;
					line-height: 150%;
					display: inline-block;
					position: relative;
					cursor: pointer;
				">${ userAge }年
					<span class="tooltip" style="
						visibility: hidden;
						background-color: rgba(0, 0, 0, 0.75);
						color: #fff;
						text-align: center;
						padding: 5px 8px;
						border-radius: 5px;
						position: absolute;
						bottom: 150%;
						left: 50%;
						transform: translateX(-50%);
						white-space: nowrap;
						font-size: 12px;
						opacity: 0;
						transition: opacity 0.3s;
						z-index: 1000;
					">${ registrationDate }</span>
				</span>
			`);
				badge.hover(function () {
					$(this).find(".tooltip").css({
						visibility: "visible",
						opacity: "1"
					});
				}, function () {
					$(this).find(".tooltip").css({
						visibility: "hidden",
						opacity: "0"
					});
				});
				userAnchor.after(badge);
			}
		}
	}
	function importUserAges() {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "application/json";
		input.onchange = function (event) {
			const file = event.target.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = function (e) {
					try {
						const userAges = JSON.parse(e.target.result);
						setItems(userAges).then(() => alert("导入成功")).catch(error => alert("导入失败: " + error));
					} catch (error) {
						alert("无效的JSON文件: " + error);
					}
				};
				reader.readAsText(file);
			}
		};
		input.click();
	}
	function exportUserAges() {
		getAll().then(keys => {
			openDB().then(db => {
				const transaction = db.transaction(STORE_NAME, "readonly");
				const store = transaction.objectStore(STORE_NAME);
				const allData = {};
				let completed = 0;
				keys.forEach(key => {
					const request = store.get(key.toString());
					request.onsuccess = () => {
						allData[key] = request.result;
						completed++;
						if (completed === keys.length) {
							const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
							const filename = `userAges_${ timestamp }_${ keys.length }entries.json`;
							const blob = new Blob([JSON.stringify(allData, null, 2)], { type: "application/json" });
							const url = URL.createObjectURL(blob);
							const a = document.createElement("a");
							a.href = url;
							a.download = filename;
							a.click();
							URL.revokeObjectURL(url);
						}
					};
				});
			});
		});
	}
	function clearUserAges() {
		localStorage.removeItem("lastFetchedUserAges");
		openDB().then(db => {
			const transaction = db.transaction(STORE_NAME, "readwrite");
			const store = transaction.objectStore(STORE_NAME);
			store.clear();
			alert("所有用户生日数据已清除");
		});
	}
	const badgeUserPanel = document.querySelector("ul#badgeUserPanel");
	if (badgeUserPanel) {
		const importButton = document.createElement("a");
		importButton.href = "#";
		importButton.textContent = "导入用户生日数据";
		importButton.onclick = event => {
			event.preventDefault();
			importUserAges();
		};
		const exportButton = document.createElement("a");
		exportButton.href = "#";
		exportButton.textContent = "导出用户生日数据";
		exportButton.onclick = event => {
			event.preventDefault();
			exportUserAges();
		};
		const clearButton = document.createElement("a");
		clearButton.href = "#";
		clearButton.textContent = "清除用户生日数据";
		clearButton.onclick = event => {
			event.preventDefault();
			clearUserAges();
		};
		const listItem = document.createElement("li");
		listItem.appendChild(importButton);
		badgeUserPanel.appendChild(listItem);
		const exportListItem = document.createElement("li");
		exportListItem.appendChild(exportButton);
		badgeUserPanel.appendChild(exportListItem);
		const clearListItem = document.createElement("li");
		clearListItem.appendChild(clearButton);
		badgeUserPanel.appendChild(clearListItem);
	}
	const userLinks = [];
	$("strong a.l:not(.avatar)").each(function () {
		const userLink = $(this).attr("href");
		const userId = userLink.split("/").pop();
		const styleAttr = $(this).closest("div.inner").prev("a.avatar").find("span.avatarNeue").attr("style");
		const avatarMatch = styleAttr ? styleAttr.match(/\/(\d+)\.jpg/) : null;
		let realUserId = avatarMatch ? avatarMatch[1] : userId;
		userLinks.push({
			userLink,
			userId,
			realUserId
		});
	});
	function processUsersInWorker(userLinks) {
		return new Promise((resolve, reject) => {
			const worker = new Worker(URL.createObjectURL(new Blob([`
			let db;

const openDB = async (DB_NAME, STORE_NAME) => {
	if (!db) {
		db = await new Promise((resolve, reject) => {
			const request = indexedDB.open(DB_NAME, 1);
			request.onupgradeneeded = event => {
				const db = event.target.result;
				if (!db.objectStoreNames.contains(STORE_NAME)) {
					db.createObjectStore(STORE_NAME);
				}
			};
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}
	return db;
};

const getAllKeys = async (STORE_NAME) => {
	const transaction = db.transaction(STORE_NAME, "readonly");
	const store = transaction.objectStore(STORE_NAME);
	const request = store.getAllKeys();
	const keys = await new Promise((resolve, reject) => {
		request.onsuccess = () => resolve(request.result.map(key => parseInt(key, 10)).sort((a, b) => a - b));
		request.onerror = () => reject(request.error);
	});
	return keys;
};

const getItem = async (STORE_NAME, key) => {
	const transaction = db.transaction(STORE_NAME, "readonly");
	const store = transaction.objectStore(STORE_NAME);
	const request = store.get(key.toString());
	const item = await new Promise((resolve, reject) => {
		request.onsuccess = () => resolve(request.result || null);
		request.onerror = () => reject(request.error);
	});
	return item;
};

const findClosestMatchingDates = async (STORE_NAME, userId) => {
	const sortedUserIds = await getAllKeys(STORE_NAME);
	let lower = -1, upper = -1;
	for (let i = 0; i < sortedUserIds.length; i++) {
		if (sortedUserIds[i] < userId) {
			lower = sortedUserIds[i];
		}
		if (sortedUserIds[i] > userId) {
			upper = sortedUserIds[i];
			break;
		}
	}
	if (lower !== -1 && upper !== -1) {
		const [lowerDate, upperDate] = await Promise.all([
			getItem(STORE_NAME, lower),
			getItem(STORE_NAME, upper)
		]);
		return lowerDate === upperDate ? lowerDate : null;
	}
	return null;
};

self.onmessage = async function(event) {
	const { userLinks, DB_NAME, STORE_NAME } = event.data;
	await openDB(DB_NAME, STORE_NAME);
	const results = await Promise.all(userLinks.map(async ({ userLink, userId, realUserId }) => {
		let storedDate = await getItem(STORE_NAME, userId);
		let dateFromFindClosest = false;

		if (!storedDate) {
			const idToCheck = !isNaN(userId) ? userId : !isNaN(realUserId) ? realUserId : null;
			if (idToCheck !== null) {
				storedDate = await findClosestMatchingDates(STORE_NAME, idToCheck);
				if (storedDate) {
					dateFromFindClosest = true;
				}
			}
		}

		return { userId, storedDate, dateFromFindClosest };
	}));

	self.postMessage({ results });
};
		`], { type: "application/javascript" })));
			worker.onmessage = function (event) {
				resolve(event.data.results);
			};
			worker.onerror = function (error) {
				reject(error);
			};
			worker.postMessage({
				userLinks,
				DB_NAME,
				STORE_NAME
			});
		});
	}
	(async () => {
		try {
			const startTime = Date.now();
			const results = await processUsersInWorker(userLinks);
			const usersToFetch = [];
			const totalUsers = userLinks.length;
			let processedUsers = 0;
			let lastLoggedProgress = 0;
			results.forEach(({userId, storedDate, dateFromFindClosest}) => {
				if (storedDate) {
					if (dateFromFindClosest) {
						setItem(userId, storedDate);
					}
					displayUserAge(userId, storedDate);
				} else {
					usersToFetch.push(userLinks.find(link => link.userId === userId).userLink);
				}
				processedUsers++;
				const progress = (processedUsers / totalUsers * 100).toFixed(0);
				if (Date.now() - startTime > 10000 && progress - lastLoggedProgress >= 10) {
					console.log(`Progress: ${ progress }%`);
					lastLoggedProgress = progress;
				}
			});
			const uniqueUsersToFetch = [...new Set(usersToFetch)];
			if (uniqueUsersToFetch.length > 0) {
				console.log("Users to fetch:", uniqueUsersToFetch);
			}
			uniqueUsersToFetch.forEach((userLink, index) => {
				fetchAndStoreUserAge(userLink, index * delay);
			});
		} catch (error) {
			console.error("Error processing users in worker:", error);
		}
	})();
	const jsonURL = "https://jirehlov.com/userages.json";
	function fetchUserAgesOnline() {
		const lastFetchTime = parseInt(localStorage.getItem("lastFetchedUserAges"), 10);
		const now = Date.now();
		if (!lastFetchTime || now - lastFetchTime > 7 * 24 * 60 * 60 * 1000) {
			fetch(jsonURL).then(response => response.json()).then(data => setItems(data)).then(() => localStorage.setItem("lastFetchedUserAges", now.toString())).catch(error => console.error("Failed to fetch and save user ages:", error));
		}
	}
	fetchUserAgesOnline();
}());