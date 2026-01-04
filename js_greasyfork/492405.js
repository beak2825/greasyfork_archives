// ==UserScript==
// @name           Content Filter
// @name:ja        コンテンツフィルター
// @namespace      https://greasyfork.org/en/users/1264733
// @version        2024-07-16
// @description    Hide not interested content
// @description:ja 興味のない内容を隠す
// @author         LE37
// @license        MIT
// @include        /^https:\/\/www\.alphapolis\.co\.jp\/(author|novel)\//
// @include        /^https:\/\/www\.bing\.com\/search/
// @include        /^https:\/\/www\.google\.com\/search/
// @include        /^https:\/\/greasyfork\.org\/[A-z-]+\/(discuss|scripts)/
// @include        /^https:\/\/(www\.|)ign\.com\//
// @include        /^https:\/\/kakuyomu\.jp\/(genr|pick|rank|rece|sear|user|works\/)/
// @include        /^https:\/\/forum\.palemoon\.org\/view(forum|topic)/
// @include        /^https:\/\/(mypage|ncode)\.syosetu\.com\/[A-z0-9]+\/?$/
// @include        /^https:\/\/yomou\.syosetu\.com\/(rank\/|search)/
// @include        /^https:\/\/novelcom\.syosetu\.com\/impression\//
// @include        /^https:\/\/syosetu\.org\/\?mode=r(ank|evi)/
// @include        /^https:\/\/syosetu\.org\/(novel|user)\/[0-9]+\//
// @include        /^https:\/\/forum\.vivaldi\.net\//
// @include        /^https:\/\/social\.vivaldi\.net\//
// @include        /^https:\/\/(www\.|)yandex\.com\/search/
// @exclude        https://www.alphapolis.co.jp/novel/ranking/annual
// @exclude        https://yomou.syosetu.com/rank/top/
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/492405/Content%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/492405/Content%20Filter.meta.js
// ==/UserScript==

(()=>{
	'use strict';
	// GM Key
	let gMk;
	// Script firetime
	let cFt = 0;
	// MutationObserver targetNode, IntersectionObserver target
	let eOn, eIo;
	// Author/Novel page
	let cAp = false;
	// Shadowroot content
	let cSr = false;
	// Shadowhost, Shadowroot
	let eSh , eSr;
	// Target nodelist, UserLink, UserID, Tag, Alter
	let eNo, eUl, sId, sTg, eAt;

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
	switch (true) {
		// Alphapolis
		case /^https:\/\/www\.alphapolis\.co\.jp\/.*\/comment/.test(uRi):
			gMk = "APS";
			eNo = "div.comment";
			eUl = "span.name>a";
			sId = /detail\/(\d+)$/;
			break;
		case /^https:\/\/www\.alphapolis\.co\.jp\/novel\/(index|ranki)/.test(uRi):
			gMk = "APS";
			eNo = "div.section";
			eUl = "div.author>a";
			sId = /detail\/(\d+)$/;
			sTg = "li.tag a";
			break;
		case /^https:\/\/www\.alphapolis\.co\.jp\/(author|novel\/[0-9]+\/[0-9]+$)/.test(uRi):
			gMk = "APS";
			cAp = true;
			eUl = uRi.includes("author") ? "div.name>h1" : "div.author a";
			sId = /detail\/(\d+)$/;
			break;
		// BingSearch
		case /^https:\/\/www\.bing\.com\/search\?/.test(uRi):
			gMk = "BNG";
			eNo = "li.b_algo";
			eUl = null;
			eAt = "cite";
			sId = /((?<=https?:\/\/)[^\/]+)/;
			break;
		// GoogleSearch
		case /^https:\/\/www\.google\.com\/search\?/.test(uRi):
			gMk = "GGS";
			eNo = "div#rso>div";
			eUl = "a[jsname]";
			sId = /((?<=https?:\/\/)[^\/]+)/;
			break;
		// Greasyfork
		case /^https:\/\/greasyfork\.org\/[A-z-]+\/script/.test(uRi):
			gMk = "GFK";
			eNo = "li[data-script-id]";
			eUl = null;
			sId = /(.*)/;
			sTg = "dd.script-list-author a";
			eAt = "a.script-link";
			break;
		case /^https:\/\/greasyfork\.org\/[A-z-]+\/discus/.test(uRi):
			gMk = "GFK";
			eNo = "div.discussion-list-container";
			eUl = null;
			sId = /(.*)/;
			sTg = "a.user-link";
			eAt = "a.script-link";
			break;
		// Hameln
		case /^https:\/\/syosetu\.org\/\?mode=rank/.test(uRi):
			gMk = "HML";
			eNo = rMb ? "div.search_box" : "div.section3";
			eUl = null;
			sId = /：(.*)/;
			sTg = rMb ? 'span[id^="tag_"]' : 'div.all_keyword:nth-child(9) a';
			eAt = rMb ? "p:nth-child(2)" : "div.blo_title_sak";
			break;
		case /^https:\/\/syosetu\.org\/\?mode=revi/.test(uRi):
			gMk = "HML";
			eNo = rMb ? "div.search_box" : "div.section3";
			eUl = null;
			sId = /([^\s]+)/;
			eAt = rMb ? "h4" : "h3";
			break;
		case /^https:\/\/syosetu\.org\/novel\/[0-9]+\/$/.test(uRi):
			gMk = "HML";
			cAp = true;
			eNo = rMb ? "div.search_box" : "div.section3";
			eUl = null;
			sId = /([^／]+)/;
			eAt = 'span[itemprop="author"]';
			break;
		case /^https:\/\/syosetu\.org\/user\/[0-9]+\/$/.test(uRi):
			gMk = "HML";
			cAp = true;
			eNo = rMb ? "div.search_box" : "div.section3";
			eUl = null;
			sId = /([^／]+)/;
			eAt = rMb ? 'h3>a' : 'h3';
			break;
		// IGN
		case /^https:\/\/(www\.|)ign\.com\//.test(uRi):
			gMk = "IGN";
			cFt = 2;
			eOn = "body";
			cSr = true;
			eNo = "li";
			eUl = null;
			sId = /(.*)/;
			eAt = 'span[data-spot-im-class="message-username"]';
			break;
		// Kakuyomu
		case /^https:\/\/kakuyomu\.jp\/(genr|picku|ranki|recent_w)/.test(uRi):
			gMk = "KYU";
			eNo = "div.widget-work";
			eUl = "a.widget-workCard-authorLabel";
			sId = /users\/(.*)$/;
			sTg = "a[itemprop='keywords']";
			break;
		case /^https:\/\/kakuyomu\.jp\/search/.test(uRi):
			gMk = "KYU";
			cFt = 1;
			eNo = rMb ? 'div[class*="Spacer_margin-ml-m__"]' : 'div[class*="NewBox_borderSize-bb"]';
			eUl = rMb ? 'span[class*="workLabelAuthor__"] a' : "div.partialGiftWidgetActivityName>a";
			sId = /users\/(.*)$/;
			sTg = 'a[href^="/tags/"]';
			break;
		case /^https:\/\/kakuyomu\.jp\/recent_r/.test(uRi):
			gMk = "KYU";
			cFt = 1;
			eNo = "div.recentReviews-item";
			eUl = "a.widget-workCard-authorLabel";
			sId = /users\/(.*)$/;
			sTg = 'a[href^="/tags/"]';
			break;
		case /^https:\/\/kakuyomu\.jp\/.*\/comme/.test(uRi):
			gMk = "KYU";
			cFt = 1;
			eNo = rMb ? 'div[class^="NewBox_box__"]>ul>li' : 'ul:nth-child(1) li';
			eUl = 'div.partialGiftWidgetActivityName>a';
			sId = /users\/(.*)$/;
			break;
		case /^https:\/\/kakuyomu\.jp\/.*\/episo/.test(uRi):
			gMk = "KYU";
			cFt = 2;
			eOn = "#episodeFooter-cheerComments-panel-mainContents";
			eNo = "ul.widget-cheerCommentList li";
			eUl = "h5.widget-cheerComment-author a";
			sId = /users\/(.*)$/;
			break;
		case /^https:\/\/kakuyomu\.jp\/(users\/|works\/[0-9]+$)/.test(uRi):
			gMk = "KYU";
			cFt = 1;
			cAp = true;
			eUl = uRi.includes("users") ? 'div[class^="HeaderText"]>a' : 'div.partialGiftWidgetActivityName>a';
			sId = /users\/(.*)$/;
			break;
		// Narou
		case /^https:\/\/novelcom\.syosetu\.com\/impre/.test(uRi):
			gMk = "NUC";
			eNo = rMb ? "div.impression" : "div.waku";
			eUl = "div.comment_authorbox>div>a";
			sId = /\/(\d+)/;
			eAt = "div.comment_authorbox>div";
			break;
		case /^https:\/\/(mypage|ncode)\.syosetu\.com\/[A-z0-9]+\/?$/.test(uRi):
			gMk = "NRK";
			cAp = true;
			eUl = uRi.includes("ncode") ? 'div.novel_writername>a' : 'div.p-userheader__username';
			sId = /\/(\d+)/;
			break;
		case /^https:\/\/yomou\.syosetu\.com\/rank\//.test(uRi):
			gMk = "NRK";
			eNo = "div.p-ranklist-item";
			eUl = "div.p-ranklist-item__author a";
			sId = /\/(\d+)/;
			sTg = "div.p-ranklist-item__keyword a";
			break;
		case /^https:\/\/yomou\.syosetu\.com\/search/.test(uRi): 
			gMk = "NRK";
			eNo = rMb ? "div.smpnovel_list" : "div.searchkekka_box";
			eUl = rMb ? null : "a:nth-child(2)";
			sId = rMb ? /：(.*)/ : /\/(\d+)/;
			sTg = 'a[href*="?word"]';
			eAt = "p.author";
			break;
		// PalemoonForum
		case /^https:\/\/forum\.palemoon\.org\/viewtopic/.test(uRi):
			gMk = "PMF";
			eNo = "#page-body div.post";
			eUl = 'a[class^="username"]';
			sId = /u=(\d+)/;
			break;
		case /^https:\/\/forum\.palemoon\.org\/viewforum/.test(uRi):
			gMk = "PMF";
			eNo = "ul.topiclist>li";
			eUl = "div.topic-poster>a";
			sId = /u=(\d+)/;
			break;
		// VivaldiForm
		case /^https:\/\/forum\.vivaldi\.net\//.test(uRi):
			gMk = "VVF";
			cFt = 2;
			sId = /user\/(.*)/;
			break;
		// VivaldiSocial
		case /^https:\/\/social\.vivaldi\.net\//.test(uRi):
			gMk = "VVS";
			cFt = 2;
			eOn = "body";
			eIo = ".load-more";
			eNo = "div.item-list>article";
			eUl = null;
			sId = /(.*)/;
			eAt = "strong.display-name__html";
			break;
		// Yandex
		case /^https:\/\/(www\.|)yandex\.com\//.test(uRi):
			gMk = "YDX";
			eNo = rMb ? "div.serp-item" : "#search-result>li";
			eUl = rMb ? null : "div.Path>a.Link";
			sId = rMb ? /(.*)/ : /((?<=https?:\/\/)[^\/]+)/;
			eAt = "span.Path-Item>b";
			break;
	}
	//console.log( {gMk, cFt, eOn, eIo, cAp, cSr, eNo, eUl, sId, sTg, eAt} );

	// GM Menu
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
			// MutationObserver
			MOC();
			break;
		case 3:
			// IntersectionObserver
			IOC();
			break;
		case 0:
		default:
			// Normal
			FMD();
	}
	// MutationObserver
	function MOC() {
		switch (gMk) {
			case "KYU": {
				// Comments in Episode
				// Button load comments
				const bLc = document.querySelector('#episodeFooter-action-cheerCommentsButton');
				bLc.addEventListener("click", (e) => {
					waitForElement(eNo, 2000).then(() => { FMD(); });
				});
				break;
			}
			case "IGN":
			case "VVF": {
				let pUi = "";
				const observer = new MutationObserver(mutations => {
					if (location.href !== pUi) {
						pUi = location.href;
						if (location.pathname.startsWith("/articles")) {
							sleep(1000).then(() => IGN());
						} else if (location.pathname.startsWith("/topic")) {
							eNo = "ul.posts>li";
							eUl = "small.d-flex a";
							FMD();
						} else if (location.pathname.startsWith("/category")) {
							eNo = "ul.topic-list li";
							eUl = "small.hidden-xs>a";
							FMD();
						}
					}
				});
				observer.observe(document, { childList: true, subtree: true });
				break;
			}
			default:
				waitForElement(eNo, 3000).then(() => {
					FMD();
					// Vivaldi Social
					if (gMk === "VVS") sleep(3000).then(() => IOC());
				});
		}
	}
	function IGN() {
		eSh = eSr = undefined;
		waitForElement(eNo, 5000).then(() => {
			FMD();
			if (eSr) {
				// Button load more messages
				const bLm = eSr.querySelector('.spcv_load-more-messages');
				if (bLm) {
					bLm.addEventListener("click", (e) => {
						sleep(2000).then(() => FMD());
					});
				}
			}
		}).catch((error) => {
			//console.log(error);
			FMD();
		});
	}
	// Wait for an element to be loaded
	function waitForElement(selector, timeout) {
		return new Promise((resolve, reject) => {
			var timer = false;
			// Spot im shadownode
			if (cSr) {
				if (eSr && eSr.querySelectorAll(selector).length) return resolve();
			} else {
				if (document.querySelectorAll(selector).length) return resolve();
			}
			const obs = new MutationObserver(mutations => {
				// Spot im shadownode
				if (cSr) {
					eSh = document.querySelector('div[data-spotim-module]').firstElementChild;
					if (eSh) {
						eSr = eSh.shadowRoot;
						if (eSr && eSr.querySelectorAll(selector).length) {
							obs.disconnect();
							if (timer !== false) clearTimeout(timer);
							return resolve();
						}
					}
				} else {
					if (document.querySelectorAll(selector).length) {
						obs.disconnect();
						if (timer !== false) clearTimeout(timer);
						return resolve();
					}
				}
			});
			// Spot im shadownode
			const obn = eSr ? eSr.querySelectorAll('.spcv_conversation')[0] : document.querySelector(eOn);
			obs.observe(obn, { childList: true, subtree: true });
			if (timeout) {
				timer = setTimeout(() => {
					obs.disconnect();
					reject();
				}, timeout);
			}
		});
	}
	// IntersectionObserver
	function IOC() {
		const ioc = new IntersectionObserver((entries) => {
			if (entries[0].intersectionRatio <= 0) return;
			ioc.disconnect();
			// Vivaldi Social
			if (gMk === "VVS") sleep(2000).then(() => MOC());
		});
		ioc.observe(document.querySelector(eIo));
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
		if (!document.getElementById("ccf_fcb")) {
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
		const no = eSr ? eSr.querySelectorAll(eNo) : document.querySelectorAll(eNo);
		for (let i = 0; i < no.length; i++) {
			let rBk = false;
			let uId;
			// Filtering content contain single id(link) or text
			let eLk = eUl ? no[i].querySelector(eUl) : no[i].querySelector(eAt);
			if ( eLk !== null
			|| gMk === "NUC"
			|| gMk === "VVS"
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
						// Vivaldi Social element out of view fix
						case "VVS":
							eLk = no[i].querySelector("span");
							uId = eLk.textContent.match(sId)[1].replace(/\s/g,'');
							break;
						// Narou nologin user fix
						default:
							eLk = no[i].querySelector(eAt);
							uId = eLk.textContent.split("\n")[2];
					}
				} else {
					uId = eUl ? eLk.href.match(sId)[1] : eLk.textContent.match(sId)[1];
					switch (gMk) {
						case "BNG":
						case "GGS":
						case "YDX": {
							// Lewis Nakao
							// https://stackoverflow.com/a/53197812
							const splitArr = uId.split('.'), arrLen = splitArr.length;
							if (arrLen == 2) {
								uId = splitArr[0];
							} else if (arrLen > 2) {
								uId = splitArr[arrLen - 2];
								//check to see if it's using a Country Code Top Level Domain (ccTLD) (i.e. ".me.uk")
								if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
									uId = splitArr[arrLen - 3];
								}
							}
							break;
						}
						case "VVS": {
							// Vivaldi Social id fix for foreground & background
							let emj = "";
							const ino = no[i].querySelectorAll(eAt + " img");
							if (ino) {
								for (let k = 0; k < ino.length; k++) {
									emj += ino[k].alt;
								}
							}
							uId = eLk.textContent.match(sId)[1] + emj;
							uId = uId.replace(/\s/g,'');
							break;
						}
					}
				}
				//console.log(uId);
				// Vivaldi Social choose the unchanged class as target
				rBk = gMk === "VVS" ? CHK(no[i].querySelector("div.status__wrapper"), "a", tlo.BAL, uId) : CHK(eLk, "a", tlo.BAL, uId);
			}
			const eNes = no[i].nextElementSibling;
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
						// Greasyfork fix
						tag = gMk === "GFK" ? tno[j].href.match(/s\/(\d+)/)[1] : tno[j].textContent;
					}
					//console.log(tag);
					rBk = tot && !tct ? CHK(no[i].querySelector("span#tag_"+j), "t", tlo.BTL, tag) : CHK(tno[j], "t", tlo.BTL, tag);
					if (rBk) break;
				}
			}
			// Blocked Show Type
			if (!cSv) {
				no[i].style.display = rBk ? "none" : "";
				no[i].style.opacity = "1";
			} else {
				no[i].style.display = "";
				no[i].style.opacity = rBk ? "0.5" : "1";
			}
		}
	}
	// CheckKeyword
	function CHK(ele, n, l, s) {
		const result = gMk === "GFK" && n === "a" ? l.some((v) => s.toLowerCase().includes(v.toLowerCase())) : l.some((v) => s.toLowerCase() === v.toLowerCase());
		if (!ele.getAttribute("data-lkw")) {
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
		const cbtn = document.getElementById("ccf_fcb");
		if (!cSv) {
			cSv = true;
			cbtn.textContent = "📙";
			document.addEventListener("click", PAC);
			URD();
		} else {
			cSv = false;
			cbtn.textContent = "📘";
			document.removeEventListener("click", PAC);
			// Auto save list
			USV();
		}
		FMD();
	}
	// PreventAnchorChange
	function PAC(e) {
		e.preventDefault();
		let tele = cSr ? e.composedPath()[0] : e.target;
		// Vivaldi Forum & Social fix
		if (gMk === "VVF" || gMk === "VVS") {
			e.stopPropagation();
			// StopPropagation fix
			if (tele.closest("#ccf_fcb")) SVM();
			// Vivaldi Social: "div.status__wrapper" is too difficult to select on mobile
			if (gMk === "VVS" && tele.closest("div.status__info")) tele = tele.parentElement.parentElement;
		}
		const ctel = tele.getAttribute("data-lkw") ? tele
					: tele.parentElement.getAttribute("data-lkw") ? tele.parentElement
					: null;
		//console.log(ctel.getAttribute("data-lkw"));
		if (ctel) {
			const tda = ctel.getAttribute("data-lkw");
			const tlst = tda.slice(0, 1) === "a" ? tlo.BAL : tlo.BTL;
			let tid = tda.slice(1);
			if (gMk === "GFK" && tda.slice(0, 1) === "a") {
				const t = prompt("Enter or use the first 5 letters as keyword", tid);
				tid = t !== null ? t : tid.slice(0, 5);
				//console.log(tid);
			}
			const li = tlst.findIndex((v) => v.toLowerCase() === tid.toLowerCase());
			if (li !== -1) {
				tlst.splice(li,1);
			} else {
				tlst.push(tid);
			}
			FMD();
		} else {
			//console.log("#ccf_fcb or wrong target: " + ctel);
		}
		// IGN Popup temp fix
		if (gMk === "IGN") {
			sleep(500).then(() => {
				const bsh = document.body.lastChild.shadowRoot;
				if (bsh) {
					const bsr = bsh.querySelector('button[title="Close the modal"]');
					if (bsr) bsr.click();
				}
			});
		}
		return false;
	}

	// Custom Blocklists Menu
	function CBM() {
		if (!document.getElementById("ccf_blm")) {
			const cbl = document.body.appendChild(document.createElement("div"));
			const pos = !rMb ? " width: 50%; left: 25%;" : " width: 98%; left: 1%;";
			cbl.id = "ccf_blm";
			cbl.style = "position: fixed;" + pos + " overflow-y: scroll; overflow-wrap: break-word; height: 52%; top:10%; z-index: 9999; background-color: #f1f3f5; display: none;";
		}
		const blm = document.getElementById("ccf_blm");
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
		if (eT.className === "ccf_sav" || eT.className === "ccf_sor" || eT.className === "ccf_del") {
			key = eT.parentElement.textContent.slice(0, 3);
			// Patch for invalid save data
			if (key === "und") {
				key = "undefined";
			}
			clst = document.getElementById("blm_" + key).textContent;
		}
		if (eT.id === "ccf_iop") {
			let copt = document.getElementById("ccf_inp").innerText;
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
				document.getElementById("ccf_inp").innerText = "Import completed";
			} else {
				document.getElementById("ccf_inp").innerText = "Invalid input";
			}
		} else if (eT.id === "ccf_sop") {
			const ctim = new Date().toISOString().split('T')[0];
			let copt = "{\n";
			const keys = GM_listValues();
			keys.forEach(k => {
				copt += '"' + k + '": ' + JSON.stringify(GM_getValue(k)) + ',\n';
			});
			SAT("ccf_bak_" + ctim, copt.slice(0, -2) + "\n}");
			alert("File downloads completed");
		} else if (eT.className === "ccf_sav") {
			GM_setValue(key, JSON.parse(clst));
			UBM();
			if (key === gMk) {
				URD();
				FMD();
			}
		} else if (eT.className === "ccf_sor") {
			const cal = JSON.parse(clst).BAL.sort();
			const ctl = JSON.parse(clst).BTL.sort();
			const clo = { BAL:cal, BTL:ctl };
			GM_setValue(key, clo);
			UBM();
			if (key === gMk) {
				URD();
			}
		} else if (eT.className === "ccf_del") {
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
		const blm = document.getElementById("ccf_blm");
		const ost = "margin-left: 1em; cursor: pointer;";
		blm.innerHTML = `<h2>Blocklists:</h2>
			<p id="ccf_inp" style="${ost} background-color: cyan;" contenteditable>Paste options here</p>
			<p id="ccf_iop" style="${ost}">📤 Import options from above</p>
			<p id="ccf_sop" style="${ost}">💾 Save options to local txt</p>`;
		const btt = ' type="button" style="margin-left: 1em; cursor: pointer; color: ';
		const keys = GM_listValues();
		keys.forEach(k => {
			const ltt = (k === gMk) ? '" style="margin-left: 1em; background-color: cyan;" contenteditable>' : '" style="margin-left: 1em;" contenteditable>';
			blm.innerHTML += '<p style="margin-left: 1em; color: fuchsia;">' + k + ': ' + 
								'<span class="ccf_sav"' + btt + 'green;">♻ Save</span>' + 
								'<span class="ccf_sor"' + btt + 'blue;">🔀 Sort</span>' + 
								'<span class="ccf_del"' + btt + 'red;">📛 Delete</span>' + 
							'</p>' + 
							'<span id="blm_' + k + ltt + JSON.stringify(GM_getValue(k)) + '</span>';
		});
	}

	// Create Float Button
	function CFB() {
		BCR("ccf_fcb", "📘", "right: 2em;", "bottom: 2em;", "#55acee");
		BCR("ccf_lst", "📚", "right: 4em;", "bottom: 2em;", "#eeac55");
		document.addEventListener("click",BLM);
	}
	function BLM(e){
		switch(e.target.id){
			case "ccf_fcb":
				SVM();
				break;
			case "ccf_lst":
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