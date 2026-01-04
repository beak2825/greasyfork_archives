// ==UserScript==
// @name           Novel Ranking Filter
// @name:ja        小説ランキングフィルター
// @namespace      https://greasyfork.org/en/users/1264733
// @version        2024-07-16
// @description    Alphapolis Hameln Kakuyomu Narou Ranking Page Filtering by AuthorID and Tag
// @description:ja アルファポリス・ハーメルン・カクヨム・なろう 作者IDとタグによるランキングページの小説フィルタリング
// @author         LE37
// @license        MIT
// @include        https://www.alphapolis.co.jp/novel/index*
// @include        https://www.alphapolis.co.jp/novel/ranking/*
// @include        https://kakuyomu.jp/genr*
// @include        https://kakuyomu.jp/pick*
// @include        https://kakuyomu.jp/rank*
// @include        https://kakuyomu.jp/sear*
// @include        https://kakuyomu.jp/rece*
// @include        https://syosetu.org/?mode=rank*
// @include        https://yomou.syosetu.com/rank/*
// @include        https://yomou.syosetu.com/search*
// @exclude        https://www.alphapolis.co.jp/novel/ranking/annual
// @exclude        https://yomou.syosetu.com/rank/top/
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/487919/Novel%20Ranking%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/487919/Novel%20Ranking%20Filter.meta.js
// ==/UserScript==

(()=>{
	'use strict';
	// GM key, Nodelist, userLink, userid, tag, alt;
	let gMk, eNo, eUl, sId, sTg, eAt;
	// View mode 
	let cSv = false;
	// Show/hide Blocklist
	let cSb = false;
	// Current list
	let O;
	// Client type
	const rMb = navigator.userAgent.includes("Mobile");
	// Delay
	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	const path = location.pathname;
	switch (location.host) {
		case "www.alphapolis.co.jp":
			gMk = "A";
			eNo = "div.section";
			eUl = "div.author>a";
			sId = /detail\/(\d+)$/;
			sTg = "li.tag a";
			break;
		case "syosetu.org":
			gMk = "H";
			eNo = rMb ? "div.search_box" : "div.section3";
			eUl = null;
			sId = /：(.*)/;
			sTg = rMb ? 'span[id^="tag_"]' : 'div.all_keyword:nth-child(9) a';
			eAt = rMb ? "p:nth-child(2)" : "div.blo_title_sak";
			break;
		case "kakuyomu.jp":
			gMk = "K";
			sId = /users\/(.*)$/;
			if (path.startsWith("/search")) {
				eNo = rMb ? 'div[class*="Spacer_margin-ml-m__"]' : 'div[class*="NewBox_borderSize-bb"]';
				eUl = rMb ? 'span[class*="workLabelAuthor__"] a' : "div.partialGiftWidgetActivityName>a";
				sTg = 'a[href^="/tags/"]';
			} else if (path.startsWith("/recent_r")) {
				eNo = "div.recentReviews-item";
				eUl = "a.widget-workCard-authorLabel";
				sTg = 'a[href^="/tags/"]';
			} else {
				eNo = "div.widget-work";
				eUl = "a.widget-workCard-authorLabel";
				sTg = "a[itemprop='keywords']";
			}
			break;
		case "yomou.syosetu.com":
			gMk = "N";
			if (path.startsWith("/search")) {
				eNo = rMb ? "div.smpnovel_list" : "div.searchkekka_box";
				eUl = rMb ? null : "a:nth-child(2)";
				sId = rMb ? /：(.*)/ : /\/(\d+)/;
				sTg = 'a[href*="?word"]';
				eAt = "p.author";
			} else {
				eNo = "div.p-ranklist-item";
				eUl = "div.p-ranklist-item__author a";
				sId = /\/(\d+)/;
				sTg = "div.p-ranklist-item__keyword a";
			}
			break;
	}
	//console.log( {gMk, eNo, eUl, sId, sTg, eAt} );
	// GM menu
	GM_registerMenuCommand("View", SVM);
	GM_registerMenuCommand("List", CBM);
	// Read list
	function URD() {
		const G = GM_getValue(gMk);
		O = G ? G : { AL:[], TL:[] };
	}
	// Save List
	function USV() {
		if (gMk && JSON.stringify(O) !== JSON.stringify(GM_getValue(gMk))) {
			GM_setValue(gMk, O);
		}
	}
	// Run
	URD();
	// Script fire time
	if (gMk === "K" && path.startsWith("/search")) {
		sleep(1500).then(() => FMD());
	} else {
		FMD();
	}
	CFB();
	// Filtering multiple targets
	function FMD() {
		const no = document.querySelectorAll(eNo);
		for (let i = 0; i < no.length; i++) {
			let rBk = false;
			let uId;
			// Filtering content contain single id(link) or text
			let eLk = eUl ? no[i].querySelector(eUl) : no[i].querySelector(eAt);
			if ( eLk !== null
			|| (gMk === "N" && rMb) ) {
				if (!eLk) {
					// Narou search mobile no author link
					if (gMk === "N") {
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
					}
				} else {
					uId = eUl ? eLk.href.match(sId)[1] : eLk.textContent.match(sId)[1];
				}
				//console.log(uId);
				rBk = CHK(eLk, "a", O.AL, uId);
			}
			if (sTg && !rBk) {
				// Filtering content contain multiple tags(text)
				// Tag node
				let tno;
				// Hameln mobile origin tag, custom tag
				let tot, tct;
				if (gMk === "H" && rMb) {
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
					rBk = tot && !tct ? CHK(no[i].querySelector("span#tag_"+j), "t", O.TL, tag) : CHK(tno[j], "t", O.TL, tag);
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
		const r = l.some((v) => s === v);
		if (!ele.classList.contains("c_h_k")) {
			ele.classList.add("c_h_k");
			ele.setAttribute("data-lkw", n + s);
		}
		if (cSv) {
			ele.style.border = r ? "thin solid fuchsia" : "thin solid dodgerblue";
		} else {
			ele.style.border = "none";
		}
		return r;
	}

	// Select mode
	function SVM() {
		const btn = document.getElementById("nrf_fcb");
		if (!cSv) {
			cSv = true;
			btn.textContent = "📙";
			document.addEventListener("click", ECH);
			URD();
		} else {
			cSv = false;
			btn.textContent = "📘";
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
			const tlst = tda.slice(0, 1) === "a" ? O.AL : O.TL;
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
		if (!document.getElementById("nrf_blm")) {
			const cbl = document.body.appendChild(document.createElement("div"));
			const pos = !rMb ? " width: 50%; left: 25%;" : " width: 98%; left: 1%;";
			cbl.id = "nrf_blm";
			cbl.style = "position: fixed;" + pos + " overflow-y: scroll; overflow-wrap: break-word; height: 52%; top:10%; z-index: 9999; background-color: #f1f3f5; display: none;";
		}
		const blm = document.getElementById("nrf_blm");
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
		if (eT.className === "nrf_sav" || eT.className === "nrf_sor" || eT.className === "nrf_del") {
			key = eT.parentElement.textContent.slice(0, 1);
			// Patch for invalid save data
			if (key === "u") {
				key = "undefined";
			}
			clst = document.getElementById("blm_" + key).textContent;
		}
		if (eT.id === "nrf_iop") {
			let copt = document.getElementById("nrf_inp").innerText;
			if ( copt.startsWith("{") ) {
				copt = copt.slice(1, -1).split("\n");
				for (let i=1; i<copt.length-1; i++) {
					let ttt = i === (copt.length-2) ? copt[i] : copt[i].slice(0, -1);
					GM_setValue(ttt.slice(1, 2), JSON.parse(ttt.slice(5)));
					if (ttt.slice(1, 2) === gMk) {
						URD();
						FMD();
					}
				}
				UBM();
				document.getElementById("nrf_inp").innerText = "Import completed";
			} else {
				document.getElementById("nrf_inp").innerText = "Invalid input";
			}
		} else if (eT.id === "nrf_sop") {
			const ctim = new Date().toISOString().split('T')[0];
			let copt = "{\n";
			const keys = GM_listValues();
			keys.forEach(k => {
				copt += '"' + k + '": ' + JSON.stringify(GM_getValue(k)) + ',\n';
			});
			SAT("nrf_bak_" + ctim, copt.slice(0, -2) + "\n}");
			alert("File downloads completed");
		} else if (eT.className === "nrf_sav") {
			GM_setValue(key, JSON.parse(clst));
			UBM();
			if (key === gMk) {
				URD();
				FMD();
			}
		} else if (eT.className === "nrf_sor") {
			const cal = JSON.parse(clst).AL.sort();
			const ctl = JSON.parse(clst).TL.sort();
			const clo = { AL:cal, TL:ctl };
			GM_setValue(key, clo);
			UBM();
			if (key === gMk) {
				URD();
			}
		} else if (eT.className === "nrf_del") {
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
		const blm = document.getElementById("nrf_blm");
		const ost = "margin-left: 1em; cursor: pointer;";
		blm.innerHTML = `<h2>Blocklists:</h2>
			<p id="nrf_inp" style="${ost} background-color: cyan;" contenteditable>Paste options here</p>
			<p id="nrf_iop" style="${ost}">📤 Import options from above</p>
			<p id="nrf_sop" style="${ost}">💾 Save options to local txt</p>`;
		const btt = ' type="button" style="margin-left: 1em; cursor: pointer; color: ';
		const keys = GM_listValues();
		keys.forEach(k => {
			blm.innerHTML += '<p style="margin-left: 1em; color: fuchsia;">' + k + ': ' + 
								'<span class="nrf_sav"' + btt + 'green;">♻ Save</span>' + 
								'<span class="nrf_sor"' + btt + 'blue;">🔀 Sort</span>' + 
								'<span class="nrf_del"' + btt + 'red;">📛 Delete</span>' + 
							'</p>' + 
							'<span id="blm_' + k + '" style="margin-left: 1em;" contenteditable>' + JSON.stringify(GM_getValue(k)) + '</span>';
		});
	}

	// Create Float Button
	function CFB() {
		BCR("nrf_fcb", "📘", "right: 2em;", "bottom: 2em;", "#55acee");
		BCR("nrf_lst", "📚", "right: 4em;", "bottom: 2em;", "#eeac55");
		document.addEventListener("click",BLM);
	}
	function BLM(e){
		switch(e.target.id){
			case "nrf_fcb":
				SVM();
				break;
			case "nrf_lst":
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