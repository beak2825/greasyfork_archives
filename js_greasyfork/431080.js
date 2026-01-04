// ==UserScript==
// @name         Infinite Protocols
// @namespace    https://greasyfork.org/ru/scripts/431080-infinite-protocols
// @version      0.3
// @description  ololo
// @author       achepta
// @include     /^https{0,1}:\/\/((www|qrator)(\.heroeswm\.ru|\.lordswm\.com)|178\.248\.235\.15)\/(pl_warlog|pl_transfers|pl_cardlog|sklad_log|clan_log|gift_box_log|forum_messages|forum_thread).+/
// @grant       unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM_log
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/431080/Infinite%20Protocols.user.js
// @updateURL https://update.greasyfork.org/scripts/431080/Infinite%20Protocols.meta.js
// ==/UserScript==

(function (window, undefined) {
	let w;
	if (typeof unsafeWindow !== undefined) {
		w = unsafeWindow;
	} else {
		w = window;
	}
	if (w.self !== w.top) {
		return;
	}


	let pl_id = getCookie("pl_id");
	let currentPage = getCurrentPage()
	let currentId = getCurrentId()
	let pageProtocolSelector = getPageProtocolSelector()
	let isLoading = false;
	let isFinal = false;
	let prevPage = null;
	let pixelsFromBottomBeforeAdding = 400;

	window.addEventListener("scroll", checkIfNearBottom);

	setInterval(checkIfNearBottom, 100)

	function checkIfNearBottom(){
		if(isLoading || isFinal) {
			return
		}
		let curWindowTop = window.pageYOffset;

		let contentTotalHeight = document.documentElement.clientHeight;
		let availToWebPageScreenHeight = window.innerHeight

		if(contentTotalHeight - pixelsFromBottomBeforeAdding < curWindowTop + availToWebPageScreenHeight){
			isLoading = true;
			getContentFromNextPage();
		}
	}

	function getCurrentPage() {
		let pageFromUrl = new URLSearchParams(window.location.search).get("page")
		if (pageFromUrl === "last") {
			isFinal = true
		}
		return pageFromUrl ? parseInt(pageFromUrl) : 0
	}

	function getCurrentId() {
		let urlParams = new URLSearchParams(window.location.search)
		switch (location.pathname) {
			case "/pl_warlog.php": {
				return "id=" + urlParams.get("id")
			}
			case "/pl_transfers.php": {
				return "id=" + urlParams.get("id")
			}
			case "/pl_cardlog.php": {
				return "id=" + urlParams.get("id")
			}
			case "/sklad_log.php": {
				return "id=" + urlParams.get("id")
			}
			case "/clan_log.php": {
				return "id=" + urlParams.get("id")
			}
			case "/gift_box_log.php": {
				return ""
			}
			case "/forum_thread.php": {
				return "id=" + urlParams.get("id")
			}
			case "/forum_messages.php": {
				return "tid=" + urlParams.get("tid")
			}
		}
	}

	function getPageProtocolSelector() {
		switch (location.pathname) {
			case "/pl_warlog.php": {
				return ".global_a_hover:nth-child(2)"
			}
			case "/pl_transfers.php": {
				return `.global_a_hover:nth-child(${currentId.includes(pl_id) ? 3 : 2})`
			}
			case "/pl_cardlog.php": {
				return ".global_a_hover:nth-child(2)"
			}
			case "/sklad_log.php": {
				return "body > center > table"
			}
			case "/clan_log.php": {
				return "body > center > table"
			}
			case "/gift_box_log.php": {
				return "body > center > table"
			}
			case "/forum_thread.php": {
				return "body > center > table > tbody > tr > td > table"
			}
			case "/forum_messages.php": {
				return "body > center > table > tbody > tr > td > table"
			}
		}
	}

	function getContentFromNextPage() {
		doGet(location.origin + location.pathname + ["?" + currentId, "page=" + (currentPage+1)].join("&"), addNextPage)
	}

	function addNextPage(docc) {
		let newPage = docc.querySelector(pageProtocolSelector).outerHTML
		if (prevPage === newPage) {
			isFinal = true
			return
		}
		prevPage = newPage
		currentPage++
		isLoading = false
		document.querySelector(pageProtocolSelector).insertAdjacentHTML("beforeend", docc.querySelector(pageProtocolSelector).outerHTML)
	}

	function doGet(url, callback) {
		GM_xmlhttpRequest({
			method: "GET",
			url: url,
			overrideMimeType: "text/xml; charset=windows-1251",
			onload: function (res) {
				callback(new DOMParser().parseFromString(res.responseText, "text/html"))
			}
		});
	}
	function getCookie(name) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(';').shift();
	}
})(window);