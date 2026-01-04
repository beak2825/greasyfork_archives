// ==UserScript==
// @name         巴友IP紀錄
// @description  醒目IP、相似IP提示
// @namespace    https://smilin.net
// @author       smilin
// @version      0.05
// @license MIT
// @homepage     https://home.gamer.com.tw/homeindex.php?owner=a33073307
// @match        https://forum.gamer.com.tw/C.php*
// @match        https://forum.gamer.com.tw/Co.php*
// @icon         https://forum.gamer.com.tw/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483109/%E5%B7%B4%E5%8F%8BIP%E7%B4%80%E9%8C%84.user.js
// @updateURL https://update.greasyfork.org/scripts/483109/%E5%B7%B4%E5%8F%8BIP%E7%B4%80%E9%8C%84.meta.js
// ==/UserScript==

(function () {
	if (typeof indexedDB === "undefined") return;
	if (!document.querySelector(".c-post__header")) return;

	//#region indexedDB
	const dbName = "smilinIpRecordDB";
	const storeName = "smilinIpRecordStore";
	const dbVersion = 1;

	function openDB() {
		return new Promise((resolve, reject) => {
			const openRequest = indexedDB.open(dbName, dbVersion);
			openRequest.onerror = function (event) {
				reject("Error opening DB");
			};
			openRequest.onsuccess = function (event) {
				resolve(event.target.result);
			};
			openRequest.onupgradeneeded = function (event) {
				const db = event.target.result;
				if (!db.objectStoreNames.contains(storeName)) {
					db.createObjectStore(storeName, { keyPath: "id" });
				}
			};
		});
	}

	async function setItem(key, value) {
		const db = await openDB();
		const transaction = db.transaction(storeName, "readwrite");
		const store = transaction.objectStore(storeName);
		return new Promise((resolve, reject) => {
			const request = store.put({ id: key, value: value });
			request.onsuccess = function () {
				resolve();
			};
			request.onerror = function (event) {
				reject("Error storing data");
			};
		});
	}

	async function getItem(key) {
		const db = await openDB();
		const transaction = db.transaction(storeName, "readonly");
		const store = transaction.objectStore(storeName);
		return new Promise((resolve, reject) => {
			const request = store.get(key);
			request.onsuccess = function (event) {
				resolve(event.target.result ? event.target.result.value : null);
			};
			request.onerror = function (event) {
				reject("Error fetching data");
			};
		});
	}
	//#endregion

	const localStorageName = "record-ip";

	//#region dom 生成
	const ipList = (localStor, userid, ip) => {
		// 創建 table 元素
		const tableContainer = document.createElement("div");
		const table1 = document.createElement("table");
		const table2 = document.createElement("table");
		createTableContainerStyle(tableContainer);
		createTableStyle(table1);
		createTableStyle(table2);
		tableContainer.appendChild(table1);
		tableContainer.appendChild(table2);

		// 創建 tbody 元素
		const tbody = document.createElement("tbody");
		table1.appendChild(tbody);

		// 創建標題行
		const headerRow = document.createElement("tr");
		toggleDataRows(headerRow);
		const headerNameCell = createTableCell("IP");
		const headerDayCell = createTableCell("發文時間");
		createThStyle(headerNameCell);
		createThStyle(headerDayCell);
		headerRow.appendChild(headerNameCell);
		headerRow.appendChild(headerDayCell);
		tbody.appendChild(headerRow);

		// 根據 localStor.data 創建表格的每一行
		localStor[userid].data.forEach((element) => {
			const row = document.createElement("tr");
			createTrStyle(row);
			const ipCell = createTableCell(element.ip);
			const dayCell = createTableCell(element.time);
			row.appendChild(ipCell);
			row.appendChild(dayCell);
			tbody.appendChild(row);
		});

		// 相似ip
		const ipTbody = document.createElement("tbody");
		table2.appendChild(ipTbody);

		const ipHeaderRow = document.createElement("tr");
		toggleDataRows(ipHeaderRow);
		const ipHeaderNameCell = createTableCell("使用者名稱");
		const ipHeaderIpCell = createTableCell("相似IP");
		const ipHeaderTimeCell = createTableCell("發文時間");
		createThStyle(ipHeaderNameCell);
		createThStyle(ipHeaderIpCell);
		createThStyle(ipHeaderTimeCell);
		ipHeaderRow.appendChild(ipHeaderNameCell);
		ipHeaderRow.appendChild(ipHeaderIpCell);
		ipHeaderRow.appendChild(ipHeaderTimeCell);
		ipTbody.appendChild(ipHeaderRow);

		localStor[userid].data.forEach((element) => {
			localStor[element.ip].data.forEach((element) => {
				if (element.userid === userid) return;
				const row = document.createElement("tr");
				createTrStyle(row);

				const nameA = document.createElement("a");
				nameA.href = `https://home.gamer.com.tw/profile/index.php?&owner=${element.userid}`;
				nameA.textContent = element.username;
				const nameCell = document.createElement("td");
				nameCell.style.padding = "8px";
				nameCell.appendChild(nameA);

				const ipCell = createTableCell(element.ip);
				const dayCell = createTableCell(element.time);
				row.appendChild(nameCell);
				row.appendChild(ipCell);
				row.appendChild(dayCell);
				ipTbody.appendChild(row);
			});
		});

		return tableContainer;
	};

	function createTableCell(text) {
		const td = document.createElement("td");
		td.textContent = text;
		createTdStyle(td);
		return td;
	}

	//#region table css

	function createTableContainerStyle(tableContainer) {
		tableContainer.className = "ip-list";
		tableContainer.style.display = "none";
		tableContainer.style.maxHeight = "300px";
		tableContainer.style.overflowY = "auto";
		tableContainer.style.backgroundColor = "#ccc";
		tableContainer.style.padding = "10px";
		tableContainer.style.borderRadius = "10px";
		tableContainer.style.margin = "5px 0px 5px 0px";
		tableContainer.style.color = "#464646";
		tableContainer.style.flexDirection = "column";
	}

	function createTableStyle(table) {
		table.style.width = "100%";
		table.style.borderCollapse = "collapse";
	}

	function createThStyle(th) {
		th.style.backgroundColor = "#118A9B";
		th.style.color = "#fff";
	}

	function createTdStyle(td) {
		td.style.padding = "12px";
		td.style.borderBottom = "1px solid #ddd";
		td.style.textAlign = "left";
	}

	function createTrStyle(tr) {
		tr.addEventListener("mouseover", function () {
			tr.style.backgroundColor = "#f5f5f5";
		});

		tr.addEventListener("mouseout", function () {
			tr.style.backgroundColor = "";
		});
	}

	//#endregion

	//#region table js

	// 折疊 td 行
	function toggleDataRows(e) {
		e.onclick = function () {
			const table = e.closest("table");
			const allTr = table.querySelectorAll("tr");
			allTr.forEach(function (tr) {
				if (tr === e) return;
				tr.style.display =
					tr.style.display === "none" || tr.style.display === ""
						? "table-row"
						: "none";
			});
		};
	}

	//#endregion

	const clickButton = (localStor, userid, ip) => {
		const button = document.createElement("button");
		button.type = "button";
		button.className = "usertitle";
		button.setAttribute("isshow", "false");
		button.style.borderWidth = "0px";
		button.style.padding = "2.5px 6px";
		button.style.margin = "0px 5px";
		// 未讀高亮
		if (!localStor[userid].isRead || !localStor[ip].isRead) {
			notReadStyle(button);
		}
		button.onclick = function () {
			showMessage(this);
			// 已讀關閉高亮
			userDataIsReal(localStor, userid, ip);
			isReadStyle(button);
		};
		button.textContent = ip;
		return button;
	};

	const mainDiv = (localStor, userid, ip) => {
		const listed = ipList(localStor, userid, ip);
		const buttoned = clickButton(localStor, userid, ip);
		const div = document.createElement("div");
		div.className = "ip-list-main-div";
		div.style.position = "relative";
		div.style.display = "inline";

		div.appendChild(buttoned);
		div.appendChild(listed);

		return div;
	};

	//#endregion

	//#region 一些 DOM 模組化的效果
	// type 0 = 發文 1 = 留言
	function notReadStyle(element) {
		element.style.borderWidth = "1px";
		element.style.borderColor = "#e66465 #9198e5 #9198e5 #e66465";
	}

	function isReadStyle(element) {
		element.style.borderWidth = "0px";
	}
	//#endregion

	//#region 資料 API
	function initDataStruct(userid, username, ip, time) {
		return {
			isRead: true, // 已讀
			noteName: "", // 備用欄位
			lastUpdated: new Date().toISOString().split("T")[0], // 最後更新時間 備用
			data: [
				{
					ip: ip, // IP
					time: time, // IP 紀錄時間
					userid: userid, // 使用者id
					username: username, // 使用者名稱
				},
			],
		};
	}

	async function initUser(userid, username, ip, time, localStor) {
		const dataStruct = initDataStruct(userid, username, ip, time);
		localStor = {
			...localStor,
			[userid]: dataStruct,
		};
		await setItem(localStorageName, localStor);
		return localStor;
	}

	async function initIp(userid, username, ip, time, localStor) {
		const dataStruct = initDataStruct(userid, username, ip, time);
		localStor = {
			...localStor,
			[ip]: dataStruct,
		};
		await setItem(localStorageName, localStor);
		return localStor;
	}

	async function addUsername(userid, username, ip, time, localStor) {
		localStor[userid].lastUpdated = new Date().toISOString().split("T")[0];
		// localStor[userid].isRead = true;
		localStor[userid].data.push({
			ip: ip, // IP
			time: time, // IP 紀錄時間
			userid: userid, // 使用者id
			username: username, // 使用者名稱
		});
		await setItem(localStorageName, localStor);
		return localStor;
	}

	async function addIp(userid, username, ip, time, localStor) {
		localStor[ip].lastUpdated = new Date().toISOString().split("T")[0];
		localStor[ip].isRead = false;
		localStor[ip].data.push({
			ip: ip, // IP
			time: time, // IP 紀錄時間
			userid: userid, // 使用者id
			username: username, // 使用者名稱
		});
		await setItem(localStorageName, localStor);
		return localStor;
	}

	async function checkLocalStor(userid, username, ip, time, localStor) {
		let isUserUse = false;
		let isIpUse = false;
		localStor[userid].data.forEach((element) => {
			if (element.ip === ip) isUserUse = true;
		});
		localStor[ip].data.forEach((element) => {
			if (element.userid === userid) isIpUse = true;
		});
		if (!isUserUse)
			localStor = await addUsername(userid, username, ip, time, localStor);
		if (!isIpUse)
			localStor = await addIp(userid, username, ip, time, localStor);
		return localStor;
	}

	function userDataIsReal(localStor, userid, ip) {
		localStor[userid].isRead = true;
		localStor[ip].isRead = true;
		setItem(localStorageName, localStor);
		return localStor;
	}

	async function searchLocalStor(userid, username, ip, time) {
		let isOld = true;
		let localStor = await getItem(localStorageName);
		if (!localStor) {
			isOld = false;
			localStor = await initUser(userid, username, ip, time, localStor);
			localStor = await initIp(userid, username, ip, time, localStor);
		}
		if (localStor[userid] === undefined) {
			localStor = await initUser(userid, username, ip, time, localStor);
		}
		if (localStor[ip] === undefined) {
			localStor = await initIp(userid, username, ip, time, localStor);
		}
		if (isOld)
			localStor = await checkLocalStor(userid, username, ip, time, localStor);

		return localStor;
	}

	//#endregion

	//#region dom 渲染
	async function render() {
		const postDom = document.querySelectorAll(".c-post__header");
		await renderPostHeader(postDom);
	}

	async function renderPostHeader(dom) {
		for (let d of dom) {
			// 0.05 投票防呆
			const isFloor = d.querySelector(".c-post__header__author");
			if (!isFloor) continue;
			const userid = d.querySelector(".userid").textContent.trim();
			const username = d.querySelector(".username").textContent.trim();
			const ip = d.querySelector(".edittime").getAttribute("data-hideip");
			const time = d.querySelector(".edittime").getAttribute("data-mtime");
			const localStor = await searchLocalStor(userid, username, ip, time);
			d.querySelector(".c-post__header__author").appendChild(
				mainDiv(localStor, userid, ip)
			);
		}
	}
	//#endregion

	// ip click
	const showMessage = function showMessage(element) {
		const nextElement = element.nextElementSibling;
		if (element.getAttribute("isshow") === "true") {
			nextElement.style.display = "none";
			element.setAttribute("isshow", "false");
		} else {
			nextElement.style.display = "flex";
			element.setAttribute("isshow", "true");
		}
	};

	render();
})();
