// ==UserScript==
// @name           Novel Ranking Comments Filter
// @name:ja        小説ランキング・コメント・フィルター
// @namespace      https://greasyfork.org/en/users/1264733
// @version        2024-07-16
// @description    Hide not interested content on ranking/comments page
// @description:ja ランキング／コメントページで興味のないコンテンツを隠す
// @author         LE37
// @license        MIT
// @include        /^https:\/\/www\.alphapolis\.co\.jp\/(author|novel)\//
// @include        /^https:\/\/kakuyomu\.jp\/(genr|pick|rank|rece|sear|user|works\/)/
// @include        /^https:\/\/(mypage|ncode)\.syosetu\.com\/[A-z0-9]+\/?$/
// @include        /^https:\/\/yomou\.syosetu\.com\/(rank\/|search)/
// @include        /^https:\/\/novelcom\.syosetu\.com\/impression\//
// @include        /^https:\/\/syosetu\.org\/\?mode=r(ank|evi)/
// @include        /^https:\/\/syosetu\.org\/(novel|user)\/[0-9]+\//
// @exclude        https://www.alphapolis.co.jp/novel/ranking/annual
// @exclude        https://yomou.syosetu.com/rank/top/
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/494137/Novel%20Ranking%20Comments%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/494137/Novel%20Ranking%20Comments%20Filter.meta.js
// ==/UserScript==

(()=>{
	'use strict';
	// GM key, Fire time, Observe node, Nodelist, userLink, userid, tag, alt;
	let gMk, cFt, eOn, eNo, eUl, sId, sTg, eAt;
	// Author page,
	let cAp = false;
	// Select mode
	let cSv = false;
	// Show blocklists
	let cSb = false;
	// Current list
	let tlo;
	// Mobile
	const rMb = navigator.userAgent.includes("Mobile");
	// Delay
	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	// Current url
	const uRi = location.href;
	// Site info
	const SITE_INFO = [
		// Alphapolis
		[/^https:\/\/www\.alphapolis\.co\.jp\/.*\/comment/, 'gMk = "APS"; eNo = "div.comment"; eUl = "span.name>a"; sId = /detail\\/(\\d+)$/;'],
		[/^https:\/\/www\.alphapolis\.co\.jp\/novel\/(index|ranki)/, 'gMk = "APS"; eNo = "div.section"; eUl = "div.author>a"; sId = /detail\\/(\\d+)$/; sTg = "li.tag a";'],
		[/^https:\/\/www\.alphapolis\.co\.jp\/(author|novel\/[0-9]+\/[0-9]+$)/, 'gMk = "APS"; cAp = true; eUl = uRi.includes("author") ? "div.name>h1" : "div.author a"; sId = /detail\\/(\\d+)$/;'],
		// Hameln
		[/^https:\/\/syosetu\.org\/\?mode=rank/, 'gMk = "HML"; eNo = rMb ? "div.search_box" : "div.section3"; eUl = null; sId = /：(.*)/; sTg = rMb ? \'span[id^="tag_"]\' : \'div.all_keyword:nth-child(9) a\'; eAt = rMb ? "p:nth-child(2)" : "div.blo_title_sak";'],
		[/^https:\/\/syosetu\.org\/\?mode=revi/, 'gMk = "HML"; eNo = rMb ? "div.search_box" : "div.section3"; eUl = null; sId = /([^\\s]+)/; eAt = rMb ? "h4" : "h3";'],
		[/^https:\/\/syosetu\.org\/novel\/[0-9]+\/$/, 'gMk = "HML"; cAp = 1; eNo = rMb ? "div.search_box" : "div.section3"; eUl = null; sId = /([^／]+)/; eAt = \'span[itemprop="author"]\';'],
		[/^https:\/\/syosetu\.org\/user\/[0-9]+\/$/, 'gMk = "HML"; cAp = 1; eNo = rMb ? "div.search_box" : "div.section3"; eUl = null; sId = /([^／]+)/; eAt = rMb ? \'h3>a\' : \'h3\';'],
		// kakuyomu
		[/^https:\/\/kakuyomu\.jp\/(picku|ranki|recent_w)/, 'gMk = "KYU"; eNo = "div.widget-work"; eUl = "a.widget-workCard-authorLabel"; sId = /users\\/(.*)$/; sTg = "a[itemprop=\'keywords\']";'],
		[/^https:\/\/kakuyomu\.jp\/search/, 'gMk = "KYU"; cFt = 1; eNo = rMb ? \'div[class*="Spacer_margin-ml-m__"]\' : \'div[class*="NewBox_borderSize-bb"]\'; eUl = rMb ? \'span[class*="workLabelAuthor__"] a\' : "div.partialGiftWidgetActivityName>a"; sId = /users\\/(.*)$/; sTg = "a[href^=\'/tags/\']";'],
		[/^https:\/\/kakuyomu\.jp\/recent_r/, 'gMk = "KYU"; cFt = 1; eNo = "div.recentReviews-item"; eUl = "a.widget-workCard-authorLabel"; sId = /users\\/(.*)$/; sTg = "a[href^=\'/tags/\']";'],
		[/^https:\/\/kakuyomu\.jp\/.*\/comme/, 'gMk = "KYU"; cFt = 1; eNo = rMb ? \'div[class^="NewBox_box__"]>ul>li\' : \'ul:nth-child(1) li\'; eUl = \'div.partialGiftWidgetActivityName>a\'; sId = /users\\/(.*)$/;'],
		[/^https:\/\/kakuyomu\.jp\/.*\/episo/, 'gMk = "KYU"; cFt = 2; eOn = "#episodeFooter-cheerComments-panel-mainContents"; eNo = "ul.widget-cheerCommentList li"; eUl = "h5.widget-cheerComment-author a"; sId = /users\\/(.*)$/;'],
		[/^https:\/\/kakuyomu\.jp\/(users\/|works\/[0-9]+$)/, 'gMk = "KYU"; cFt = 1; cAp = true; eUl = uRi.includes("users") ? \'div[class^="HeaderText"]>a\' : \'div.partialGiftWidgetActivityName>a\'; sId = /users\\/(.*)$/;'],
		// Narou
		[/^https:\/\/novelcom\.syosetu\.com\/impre/, 'gMk = "NUC"; eNo = rMb ? "div.impression" : "div.waku"; eUl = "div.comment_authorbox>div>a"; sId = /\\/(\\d+)/; eAt = "div.comment_authorbox>div";'],
		[/^https:\/\/(mypage|ncode)\.syosetu\.com\/[A-z0-9]+\/?$/, 'gMk = "NRK"; cAp = true; eUl = uRi.includes("ncode") ? \'div.novel_writername>a\' : \'div.p-userheader__username\'; sId = /\\/(\\d+)/;'],
		[/^https:\/\/yomou\.syosetu\.com\/rank\//, 'gMk = "NRK"; eNo = "div.p-ranklist-item"; eUl = "div.p-ranklist-item__author a"; sId = /\\/(\\d+)/; sTg = "div.p-ranklist-item__keyword a";'],
		[/^https:\/\/yomou\.syosetu\.com\/search/, 'gMk = "NRK"; eNo = rMb ? "div.smpnovel_list" : "div.searchkekka_box"; eUl = rMb ? null : "a:nth-child(2)"; sId = rMb ? /：(.*)/ : /\\/(\\d+)/; sTg = "a[href*=\'?word\']"; eAt = "p.author";'],
	];
	// Load site info
	function LSI() {
		for (let i = 0; i < SITE_INFO.length; i++) {
			if (SITE_INFO[i][0].test(uRi)) {
				eval(SITE_INFO[i][1]);
			}
		}
	}
	LSI();
	//console.log( {gMk, cFt, cAp, eOn, eNo, eUl, sId, sTg, eAt} );
	// GM menu
	GM_registerMenuCommand("View", SVM);
	GM_registerMenuCommand("List", CBM);
	// Read List
	URD();
	function URD() {
		const trc = GM_getValue(gMk);
		tlo = trc ? trc : { BAL:[], BTL:[] };
	}
	// Save List
	function USV() {
		if (gMk && JSON.stringify(tlo) !== JSON.stringify(GM_getValue(gMk))) {
			GM_setValue(gMk, tlo);
		}
	}

	// Script Fire Time
	switch (cFt) {
		case 1:
			// Delay
			sleep(1500).then(() => FMD());
			break;
		case 2:
			// Mutation observer
			MOC();
			break;
		default:
			// Normal
			FMD();
	}
	function MOC() {
		const obs = new MutationObserver(() => {
			obs.disconnect();
			FMD();
		});
		obs.observe(document.querySelector(eOn), { childList: true, subtree: true, });
	}

	// Filtering mode
	function FMD() {
		if (cAp) {
			// Filtering single target
			FST();
		} else {
			// Filtering multiple targets
			FMT();
		}
		if (!document.getElementById("nrcf_fcb")) {
			CFB();
		}
	}
	// Filtering single target
	function FST() {
		let rBk = false;
		const eLk = eUl ? document.querySelector(eUl) : document.querySelector(eAt);
		let uId;
		// Narou author page fix
		if (gMk === "NRK") {
			uId = eLk.href ? eLk.href.match(sId)[1] : uRi.match(sId)[1];
		} else {
			uId = eUl ? eLk.href.match(sId)[1] : eLk.textContent.match(sId)[1];
		}
		rBk = CHK(eLk, "a", tlo.BAL, uId);
		eLk.style.color = rBk ? "fuchsia" : "dodgerblue";
	}
	// Filtering multiple targets
	function FMT() {
		const no = document.querySelectorAll(eNo);
		for (let i = 0; i < no.length; i++) {
			let rBk = false;
			let uId;
			// Filtering content contain single id(link) or text
			let eLk = eUl ? no[i].querySelector(eUl) : no[i].querySelector(eAt);

			if ( eLk !== null
			|| gMk === "NUC"
			|| (gMk === "NRK" && rMb) ) {
				if (!eLk) {
					switch (gMk) {
						// Narou search mobile no author link
						case "NRK": {
							const tca = document.createElement("p");
							tca.classList.add("author");
							tca.style.color = "#fe7643";
							const head = no[i].querySelector("div.accordion_head");
							// AD
							if (!head) {
								//console.log("===A D===");
								//rBk = true;
								continue;
							}
							tca.textContent = head.textContent.split("\n")[3];
							no[i].querySelector("a.read_button").after(tca);
							eLk = tca;
							uId = eLk.textContent.match(sId)[1];
							break;
						}
						// Narou nologin user fix
						default:
							eLk = no[i].querySelector(eAt);
							uId = eLk.textContent.split("\n")[2];
					}
				} else {
					uId = eUl ? eLk.href.match(sId)[1] : eLk.textContent.match(sId)[1];
				}
				//console.log(uId);
				rBk = CHK(eLk, "a", tlo.BAL, uId);
			}
			if (sTg && !rBk) {
				// Filtering content contain multiple tags(text)
				// Tag node
				let tno;
				// Hameln mobile origin tag, custom tag
				let tot, tct;
				if (gMk === "HML" && rMb) {
					tot = no[i].querySelector(".trigger p:nth-child(4)");
					tct = no[i].querySelector(sTg);
					if (!tct) {
						tno = tot.textContent.slice(3).match(/[^\s]+/g);
						tot.innerHTML = "";
					} else {
						tno = no[i].querySelectorAll(sTg);
					}
				} else {
					tno = no[i].querySelectorAll(sTg);
				}
				for (let j = 0; j < tno.length; j++) {
					let tag;
					if (tot && !tct) {
						tag = tno[j];
						tot.innerHTML += '<span id="tag_' + j + '">' + tag + '</span>';
					} else {
						tag = tno[j].textContent;
					}
					//console.log(tag);
					rBk = tot && !tct ? CHK(no[i].querySelector("span#tag_"+j), "t", tlo.BTL, tag) : CHK(tno[j], "t", tlo.BTL, tag);
					if (rBk) break;
				}
			}
			// Blocked show type
			no[i].style.display = !cSv && rBk ? "none" : "";
			no[i].style.opacity = cSv && rBk ? "0.5" : "1";
		}
	}
	// Check keyword
	function CHK(ele, n, l, s) {
		const result = l.some((v) => s === v);
		if (!ele.classList.contains("c_h_k")) {
			ele.classList.add("c_h_k");
			ele.setAttribute("data-lkw", n + s);
		}
		if (cSv) {
			ele.style.border = result ? "thin solid fuchsia" : "thin solid dodgerblue";
		} else {
			ele.style.border = "none";
		}
		return result;
	}

	// Select mode
	function SVM() {
		const cbtn = document.getElementById("nrcf_fcb");
		if (!cSv) {
			cSv = true;
			cbtn.textContent = "📙";
			document.addEventListener("click", ECH);
			URD();
		} else {
			cSv = false;
			cbtn.textContent = "📘";
			document.removeEventListener("click", ECH);
			// Auto save list
			USV();
		}
		FMD();
	}
	// Handler
	function ECH(e) {
		e.preventDefault();
		const tEle = e.target.classList.contains("c_h_k") ? e.target
					: e.target.parentElement.classList.contains("c_h_k") ? e.target.parentElement
					: null;
		//console.log(tEle);
		if (tEle) {
			const tda = tEle.getAttribute("data-lkw");
			const tlst = tda.slice(0, 1) === "a" ? tlo.BAL : tlo.BTL;
			const tid = tda.slice(1);
			const li = tlst.findIndex((v) => v === tid);
			if (li !== -1) {
				tlst.splice(li,1);
			} else {
				tlst.push(tid);
			}
			FMD();
		}
	}

	// Custom Blocklists Menu
	function CBM() {
		if (!document.getElementById("nrcf_blm")) {
			const cbl = document.body.appendChild(document.createElement("div"));
			const pos = !rMb ? " width: 50%; left: 25%;" : " width: 98%; left: 1%;";
			cbl.id = "nrcf_blm";
			cbl.style = "position: fixed;" + pos + " overflow-y: scroll; overflow-wrap: break-word; height: 52%; top:10%; z-index: 9999; background-color: #f1f3f5; display: none;";
		}
		const blm = document.getElementById("nrcf_blm");
		if (!cSb) {
			cSb = true;
			UBM();
			blm.style.display = "";
			blm.addEventListener("click", DBL);
		} else {
			cSb = false;
			blm.style.display = "none";
			blm.removeEventListener("click", DBL);
			blm.innerHTML = "";
		}
	}
	// Delete Block List
	function DBL(e) {
		const eT = e.target;
		let key, clst;
		if (eT.className === "nrcf_sav" || eT.className === "nrcf_sor" || eT.className === "nrcf_del") {
			key = eT.parentElement.textContent.slice(0, 3);
			// Patch for invalid save data
			if (key === "und") {
				key = "undefined";
			}
			clst = document.getElementById("blm_" + key).textContent;
		}
		if (eT.id === "nrcf_iop") {
			let copt = document.getElementById("nrcf_inp").innerText;
			if ( copt.startsWith("{") ) {
				copt = copt.slice(1, -1).split("\n");
				for (let i=1; i<copt.length-1; i++) {
					let ttt = i === (copt.length-2) ? copt[i] : copt[i].slice(0, -1);
					GM_setValue(ttt.slice(1, 4), JSON.parse(ttt.slice(7)));
					if (ttt.slice(1, 4) === gMk) {
						URD();
						FMD();
					}
				}
				UBM();
				document.getElementById("nrcf_inp").innerText = "Import completed";
			} else {
				document.getElementById("nrcf_inp").innerText = "Invalid input";
			}
		} else if (eT.id === "nrcf_sop") {
			const ctim = new Date().toISOString().split('T')[0];
			let copt = "{\n";
			const keys = GM_listValues();
			keys.forEach(k => {
				copt += '"' + k + '": ' + JSON.stringify(GM_getValue(k)) + ',\n';
			});
			SAT("nrcf_bak_" + ctim, copt.slice(0, -2) + "\n}");
			alert("File downloads completed");
		} else if (eT.className === "nrcf_sav") {
			GM_setValue(key, JSON.parse(clst));
			UBM();
			if (key === gMk) {
				URD();
				FMD();
			}
		} else if (eT.className === "nrcf_sav") {
			GM_setValue(key, JSON.parse(clst));
			UBM();
			if (key === gMk) {
				URD();
				FMD();
			}
		} else if (eT.className === "nrcf_sor") {
			const cal = JSON.parse(clst).BAL.sort();
			const ctl = JSON.parse(clst).BTL.sort();
			const clo = { BAL:cal, BTL:ctl };
			GM_setValue(key, clo);
			UBM();
			if (key === gMk) {
				URD();
			}
		} else if (eT.className === "nrcf_del") {
			GM_deleteValue(key);
			UBM();
			if (key === gMk) {
				URD();
				FMD();
			}
		}
	}
	// Update Blocklists Menu
	function UBM() {
		const blm = document.getElementById("nrcf_blm");
		const ost = "margin-left: 1em; cursor: pointer;";
		blm.innerHTML = `<h2>Blocklists:</h2>
			<p id="nrcf_inp" style="${ost} background-color: cyan;" contenteditable>Paste options here</p>
			<p id="nrcf_iop" style="${ost}">📤 Import options from above</p>
			<p id="nrcf_sop" style="${ost}">💾 Save options to local txt</p>`;
		const btt = ' type="button" style="margin-left: 1em; cursor: pointer; color: ';
		const keys = GM_listValues();
		keys.forEach(k => {
			blm.innerHTML += '<p style="margin-left: 1em; color: fuchsia;">' + k + ': ' + 
								'<span class="nrcf_sav"' + btt + 'green;">♻ Save</span>' + 
								'<span class="nrcf_sor"' + btt + 'blue;">🔀 Sort</span>' + 
								'<span class="nrcf_del"' + btt + 'red;">📛 Delete</span>' + 
							'</p>' + 
							'<span id="blm_' + k + '" style="margin-left: 1em;" contenteditable>' + JSON.stringify(GM_getValue(k)) + '</span>';
		});
	}

	// Create Float Button
	function CFB() {
		BCR("nrcf_fcb", "📘", "right: 2em;", "bottom: 2em;", "#55acee");
		BCR("nrcf_lst", "📚", "right: 4em;", "bottom: 2em;", "#eeac55");
		document.addEventListener("click",BLM);
	}
	function BLM(e){
		switch(e.target.id){
			case "nrcf_fcb":
				SVM();
				break;
			case "nrcf_lst":
				CBM();
				break;
		}
	}
	// Button creater
	function BCR(id, text, posx, posy, color) {
		const cbtn = document.body.appendChild(document.createElement("button"));
		cbtn.id = id;
		cbtn.textContent = text;
		cbtn.style = "position: fixed;width: 44px;height: 44px;z-index: 9999;font-size: 200%;opacity: 50%;cursor: pointer;border: none;padding: unset;color: " + color + ";" + posx + posy;
		cbtn.type = "button";
	}
	// Save as txt
	function SAT(title, text) {
		//console.log(text);
		const link = document.createElement("a");
		link.href = "data:text/plain;charset=utf-8," + encodeURIComponent(text);
		link.download = title + ".txt";
		link.style.display = "none";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
})();