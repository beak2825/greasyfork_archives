// ==UserScript==
// @name         🚀远景Lite - 高效浏览远景论坛，更加畅快的阅读体验!⚡
// @namespace    http://tampermonkey.net/
// @version      100.0.0.0
// @description  此版本以展示文字内容为主，针对大屏幕的显示效果优化，提供更好的阅读体验📖。新增发送EMOJI表情功能😀，查看表情也需要安装此脚本。仍然具备快捷发言与黑名单功能，欢迎体验。
// @author       lalaki
// @match        http*://i.pcbeta.com/*
// @match        http*://bbs.pcbeta.com/*
// @icon         https://lalaki.cn/p?i=pbi
// @homepage     https://lalaki.cn
// @run-at       document-start
// @require      https://fastly.jsdelivr.net/npm/moment@2.30.1/min/moment.min.js
// @require      https://fastly.jsdelivr.net/npm/moment@2.30.1/locale/zh-cn.js
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521367/%F0%9F%9A%80%E8%BF%9C%E6%99%AFLite%20-%20%E9%AB%98%E6%95%88%E6%B5%8F%E8%A7%88%E8%BF%9C%E6%99%AF%E8%AE%BA%E5%9D%9B%EF%BC%8C%E6%9B%B4%E5%8A%A0%E7%95%85%E5%BF%AB%E7%9A%84%E9%98%85%E8%AF%BB%E4%BD%93%E9%AA%8C%21%E2%9A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/521367/%F0%9F%9A%80%E8%BF%9C%E6%99%AFLite%20-%20%E9%AB%98%E6%95%88%E6%B5%8F%E8%A7%88%E8%BF%9C%E6%99%AF%E8%AE%BA%E5%9D%9B%EF%BC%8C%E6%9B%B4%E5%8A%A0%E7%95%85%E5%BF%AB%E7%9A%84%E9%98%85%E8%AF%BB%E4%BD%93%E9%AA%8C%21%E2%9A%A1.meta.js
// ==/UserScript==
(function () {
 "use strict";
 const search = location.search + "";
 const url = location.href + "";
 const host = location.hostname + "";
 if (
	url.indexOf("space-uid-") != -1 ||
	(host == "i.pcbeta.com" && parseInt(search.substring(1)) > 0)
 ) {
	return;
 }
 let isInvite = true;
 const decoder = new TextDecoder("utf-8");
 if (host == "i.pcbeta.com") {
	fetch("https://i.pcbeta.com/home.php?mod=spacecp&ac=invite")
	 .then((res) => res.arrayBuffer())
	 .then((data) => {
	 let resultText = decoder.decode(data);
	 if (resultText.indexOf("没有权限邀请好友") != -1) {
		isInvite = false;
	 }
	});
 }
 const indexArr = [];
 let addCss="";
 if (url.indexOf("i.pcbeta.com") == -1) {
	fetch("https://bbs.pcbeta.com", {
	 method: "GET",
	 credentials: "include",
	})
	 .then(async (res) => ({
	 status: res.status,
	 buffer: await res.arrayBuffer(),
	}))
	 .then(({ status, buffer }) => {
	 if (status == 200) {
		let decoder = new TextDecoder("utf-8");
		let html = decoder.decode(buffer);
		let dom = document.createElement("div");
		dom.innerHTML = html;
		dom.querySelectorAll("#ct .fl_g dt a").forEach((it) => {
		 indexArr.push({ name: it.innerHTML, value: it.href });
		});
	 }
	});
 }else{
 addCss="#scbar_hot{display:none}.ct3_a .mn{width:95%}";
 }
 const style = document.createElement("style");
 let customCss = "";
 if (url.indexOf("viewthread") != -1) {
	customCss = `.card_gender_0,.card_gender_1{background:#fff}.plc .pob.cl{display:flex}#f_pst .pls,#f_pst .avatar,.pgbtn,.pls.cl.favatar i{display:none}.avt img{width:32px;height:32px}.p_pop .imicn img{display:none}#p_btn{margin:0 0 0 -8px}.ad .pls{background:transparent !important;}.avatar_p + p font{color:#999 !important}#tath{padding:0 0 0 0}#tath.cl a{line-height:14px}#pt .z{margin:-3px 0 0 8px}#replynotice_menu.p_pop{transform:translateX(-100px)}textarea::placeholder{color:transparent}.pl .quote{background-color:#fafafa!important}#pl_top .pls.vm.ptm{text-indent:0;font-size:11px}.reason_slct.c #message{width:98%!important}.jubao-la{position:absolute;right:41px;margin:-28px auto}.pls .pi .authi{display:flex;justify-content:center}.pls .pi .authi a.xw1:hover{white-space:wrap;position:absolute;}.pls .pi .authi a.xw1{font-weight:600;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}#pgt .pg,#pgt .pgb{order:-2}.pgs.mtm.mbm.cl{position:fixed;bottom:0;right:11px;margin:0 auto;z-index:999;display:flex;justify-content:center}.pgs.mtm.mbm.cl span.pgb.y{order:-1}#newspecialtmp,#post_reply,#newspecial{display:none!important}#pgt{z-index:2;right:14px;margin:4px auto;width:auto;display:none;position:absolute}#f_pst{border:1px solid #dedede!important;z-index:9;position:absolute;margin:58px 0 0 -16px}#postlist .p_pop.blk.bui{margin:-80px 0 0 20px!important}.m.z img{height:137px;object-fit:cover;object-position:center}.avatar img{height:48px;background:unset!important;object-fit:cover;object-position:center !important;border-radius:4px}#f_pst .pb_pls{display:none}.rate dt strong,.cm .psth{background-color:#f0f0f0}p.ptm.pnpost{align-items:center;justify-content:flex-end;flex-direction:row-reverse;display:flex}#fastpostsubmit{margin:0 0 0 5px}td.plc .pi strong a{font-size:120%;position: absolute;right:38px;margin:-8px auto}.plc{padding:0 10px}
	.la-quick-00{margin:0 0 0 -8px}
	#f_pst #spanButtonPlaceholder{margin:0 0 0 3px}
	#f_pst .ptm.pnpost .y{display:none}
   `;
 }
 style.innerHTML = `
 ${addCss}
 .mgcl li{width:200px !important;}.scbar_btn_td,.scbar_type_td{transform:translateY(-1px);}.p_pop{border-radius:5px;}#nv_search #toptb{padding:0 5px 0 5px}#myspace_menu li{text-align:center}.ct2_a .mn{margin:0 40px 0 0!important}
.appl + .mn.pbw{margin-right:42px;}.appl + .mn.pbw .tbmu.bw0{margin:0 0 0 12px}#mn_home_4,#post_replytmp,#ft{display:none;position:absolute;left:-999px} .pls{background:transparent !important}#nv ul{display:flex;flex-direction:row-reverse}#pt + div h1.xs2 .y{max-width:unset !important}#threadlist .th table tbody th + td{text-indent:10px}.pg strong{font-family:monospace;border-radius:2px}#postlist .pls .hm .pb_color + .pipe{width:44px;color:transparent}#postlist .plc .ts #fj.y,#postlist .plc .ts #fj.y + .y{display:none!important}.pg .prev,.pg .nxt{display:none}.la-fbsz{line-height:19px!important;text-align:center;font-weight:600;font-size:14px;text-indent:6px!important;font-family:fangsong;transform:scaleX(1.5);color:#3e3e3e;background:unset}.la-cursor-pointer{cursor:pointer}.la-item0-add{border:none;text-align:center;font-size:13px;background:#fff}#fwin_content_rate .xg1{color:#ff3c3c!important}.reason_slct #reason{width:98%!important}.reason_slct .reasonselect{height:13rem;width:30rem!important}.la-rate-split{pointer-events:none;user-select:none}em-emoji-picker{height:50vh;min-height:300px;max-height:500px}.la-blue{color:blue!important}.la-green{color:#6dff02!important}.la-bg-active{background:#2ca10a}.la-error{color:#ffc107}#ct .tdats{width:800px!important}#chkall::before{padding:0 0 0 2px;content:"全选";position:absolute;background:#fff;margin:-2px 0 0 17px}#la_sign_log{position:absolute;width:auto;height:auto;color:#fff;text-align:center !important;left:-100px;background:#1985db;min-width:260px;height:auto;margin:7px auto;font-size:16px;padding:5px;border-radius:3px}.fa_rss,#atarget,#category_lk{display:none}.fa_rss + .pipe{display:none}.la-task-a{display:none}.la-task-a + .pipe{display:none}.sttl.mbn h2{display:none}.tl .sttl{padding:0 0 0 0}#postlist{margin:-48px auto}.tedt{border:1px solid #dedede}.tedt .bar{border-bottom:1px solid #dedede}button{border-radius:3px}.pls{border-right:1px solid #f3f3f3 !important}#mn_home{display:none}.la-img-tag1{display:none}.tip.aimg_tip{display:none!important}.la-ip-info{display:none}.la-ta-input{width:110%;resize:both;height:150px;transform:translateX(-52px)}.la-block-user{margin:0 0 0 18px;cursor:pointer}#tath{width:auto!important;white-space:wrap!important;flex-direction:column;display:flex}#diypage #frame1_center{width:auto!important}#threadlist{width:100%!important;padding:0 0 0 0!important}.pls .p_pop{text-align:left;border-radius:4px}.pls p img{display:none}.buddy.cl li{width:170px!important}#diypage #frame1_right{min-width:308px!important}#diypage{width:100%;display:flex;justify-content:center}.la-force-hidden{display:none!important;visibility:hidden!important}.la-p a:hover{white-space:normal}.la-custom-toolbar .la-p{background:#3e3e3e;width:100%;text-align:center;padding:7px 0 7px 0;border-top:1px solid #eee;font-size:18px;font-weight:300}.la-custom-toolbar{opacity:0.75;width:0;position:fixed;right:0;background:#333;top:50%;height:0;z-index:999;flex-direction:column;align-items:center;justify-content:center;color:#f4f4f4;font-size:15px;font-weight:300;user-select:none;display:none;border:1px solid #ececec!important}#black_list_la{cursor:pointer}.la-custom-toolbar-show{display:flex;width:90px;transition:width .1s ease}.la-quick{margin:0 0 0 5px;cursor:pointer;position:relative;user-select:none}.la-quick::before{content:"|";padding-right:5px;color:#ccc;position:relative;left:0}.la-p a{color:#fff!important;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.la-p:hover{background:#0084c8}.la-a-cursor{cursor:pointer}.fsml{display:none}#fj,#scrolltop,.ftbg{display:none}.pstatus{display:none!important}.ct2_a .mn{margin-right:-9px}.appl{max-width:115px}.bm .mtm .bm_c{padding:10px 0 0 0}#toptb .wp{width:100%}#toptb{padding:0 0 0 0}#toptb #um div{position:static!important;box-sizing:content-box;border-radius:3px 3px 4px 4px}#navs_menu,#myspace_menu{margin:13px auto}#scbar{width:100%;border-radius:3px;background:url(static/image/pcbeta/search_df__.png) bottom/100px;transform:translateY(-20px)}#quick_sch{display:none!important}.rate dd ul li{width:48px!important}.bm.bw0{width:98%}::-webkit-scrollbar{width:6px;height:6px}::-webkit-scrollbar-track{background:#f1f1f1;border-radius:10px}::-webkit-scrollbar-thumb{background:#1f74ce;border-radius:3px;border-left:1px solid #eee}::-webkit-scrollbar-thumb:hover{background:#555}.pb_ptr.pb_bdt2{float:left;margin:0 0 0 12px}.avatar_p img,.md_ctrl{display:none}.la-rate-li{cursor:pointer}.la-rate-li:hover{color:#266cb5}.pil.cl{display:none}.plc.plm{display:none}.pls{width:64px;text-align:center}.pls .pi{padding:12px 0 0 0!important}.pls p{padding:0 0 0 0!important;margin:0 0 0 0!important}.pls .avatar{margin:0 0 0 0!important}.pls .avatar img{width:48px!important;margin:0 0 0 0!important;padding:0 0 0 0!important}.t_fsz{min-height:auto!important}#p_btn p{float:left}#p_btn .showmenu{display:none}#tools{display:flex!important;justify-content:center}.pc_box{transform:scale(.85) translateX(-48px);margin:0 2px}.la-daoju{position:absolute;right:3%}.pls .hm .pipe{display:block;height:1px}#mn_portal{display:none}#diy_style + .wp + .wp.cl .sd.ptm{width:280px}.mgcl li{width:312px}.mgcl li p{width:200px}#typeid_fast_ctrl_menu{box-shadow:5px -2px 7px #3333333d;border:1px solid #dddddd}.la-none{display:none!important;position:fixed!important;left:-999px!important;top:-999px!important}.la-quick-item{position:absolute;background:#fff;padding:2px 7px 2px 7px;border:1px solid #d1d1d1;min-width:100px;border-radius:4px;box-shadow:0 4px 15px #0000001f;z-index:9999}.la-item0{font-size:16px;border-bottom:1px solid #f1f1f1;padding:5px 0 5px 0;cursor:pointer;white-space:nowrap}#ct .mn .bmw .bm_h .y{transform:translateY(-6px)}tbody#separatorline tr.ts th{position:absolute;background:transparent;top:6px;left:443px}tbody#separatorline tr.ts{display:block;position:static;height:0;line-height:0}.b1r #e_sml{display:none}.la-item0:hover{color:#ff5353}.la-emoji-dialog{position:fixed;top:0;left:-999px;z-index:99999}#ct .mw .tl .sttl{border-bottom:1px solid #f1f1f1}#scbar_hot{transform:translateY(-2px)}#fwin_dialog_cover{height:100%!important;position:fixed!important}#hd .wp .hdc.cl h2 a{width:160px!important;background-size:contain!important}#online h3 .xs1 + .xs1{display:none}
.la-li-center{text-align:center}
   ${customCss}
       `;
 const denyUsers = [];
 const loadDus = laGetValue("denyUsers", "NIL");
 if (loadDus != "NIL") {
	loadDus.split("\n").forEach((it) => {
	 let aUser = (it + "").trim();
	 if (aUser != "") {
		denyUsers.push(aUser);
	 }
	});
 }
 const endClass = "lala-done";
 const quick = document.createElement("span");
 quick.innerHTML = "常用语";
 quick.className = "la-quick";
 quick.className += " la-quick-00"
 let singleInterval = null;
 let initCss = false;
 let widthCss = document.createElement("link");
 widthCss.setAttribute("rel", "stylesheet");
 widthCss.setAttribute("href", "data/cache/style_6_widthauto.css");

 function enumParent(ele) {
	if (ele != null) {
	 let id = (ele.id + "").trim();
	 let className = (ele.className + "").trim();
	 let isTr = ele.nodeName == "TR";
	 if (
		id.startsWith("post_") ||
		id.startsWith("stickthread_") ||
		id.startsWith("normalthread_") ||
		ele.nodeName === "LI" ||
		className == "pstl xs1" ||
		className == "quote" ||
		isTr ||
		(className == "cl" && ele.hasAttribute("notice"))
	 ) {
		ele.className = "la-none";
		if (isTr) {
		 //patch
		 try {
			let ckParent = ele.parentNode.parentNode;
			let id = ("" + ckParent.id).trim();
			if (id.startsWith("pid")) {
			 ckParent.className = "la-none";
			}
		 } catch (e) {}
		}
	 } else {
		enumParent(ele.parentElement);
	 }
	}
 }
 function blockUser(ele) {
	let className = ele.className + "";
	if (className.indexOf(endClass) == -1) {
	 ele.className += ` ${endClass}`;
	 enumParent(ele);
	}
 }
 function backHome(ele) {
	if (denyUsers.indexOf(ele.innerText) != -1) {
	 document.body.style = "display:none";
	 document.title = "此用户被拉黑";
	 location.href = "https://i.pcbeta.com/home.php?mod=space&do=home&view=me";
	 clearInterval(singleInterval);
	}
 }
 function parseDate(ele, text) {
	let className = ele.className + "";
	if (className.indexOf(endClass) == -1) {
	 ele.className += ` ${endClass}`;
	 try {
		let text2 = text.trim();
		if (text2.indexOf("积分") != -1) {
		 return;
		}
		let tmp = "";
		if (text2.endsWith("上传")) {
		 text = text2.substring(0, text2.indexOf("上传"));
		 tmp = "上传";
		} else if (
		 text2.startsWith("发表于") &&
		 text2.indexOf("IP属地") != -1
		) {
		 text = text2.substring(4, 20);
		} else if (text2.startsWith("发表于")) {
		 text = text2.substring(4);
		}
		// eslint-disable-next-line
		let date = moment(text).fromNow();
		if (date.indexOf("Invalid") == -1) {
		 ele.textContent = date + tmp;
		}
	 } catch (e) {}
	}
 }
 function checkPos(ele) {
	const rect = ele.getBoundingClientRect();
	const viewportHeight = window.innerHeight;
	const distanceToTop = rect.top;
	const distanceToBottom = viewportHeight - rect.bottom;
	return distanceToTop < distanceToBottom;
 }
 function laSetValue(name, value) {
	GM_setValue(name, value);
 }
 function laGetValue(name) {
	return GM_getValue(name, "NIL");
 }
 function appendSml(dom) {
	var arr = [];
	let word = document.querySelector("#e_pasteword");
	document.querySelectorAll(".tedt .fpd .fclr").forEach((it) => arr.push(it));
	if (word != null) {
	 arr.push(word);
	}
	for (let sml of arr) {
	 let smlClass = sml.className + "";
	 if (smlClass.indexOf(endClass) == -1) {
		sml.className += ` ${endClass}`;
		const newQuick = quick.cloneNode(true);
		sml.after(newQuick);
		let lamoji = document.createElement("span");
		lamoji.innerHTML = "&#129392;";
		lamoji.className = "la-quick";
		const observer = new IntersectionObserver((entries) => {
		 entries.forEach((entry) => {
			if (!entry.isIntersecting && lamoji.offsetWidth == 0) {
			 let emojiDom = document.querySelector("#la_emoji_dialog");
			 if (emojiDom != null) {
				emojiDom.style.left = "-999px";
			 }
			}
		 });
		});
		observer.observe(lamoji);
		lamoji.onclick = () => {
		 let emojiDom = document.querySelector("#la_emoji_dialog");
		 if (emojiDom.style.left == "-999px") {
			let tRect = lamoji.getBoundingClientRect();
			emojiDom.style.left = tRect.left + "px";
			if (!checkPos(lamoji)) {
			 emojiDom.style.top =
				tRect.top - emojiDom.offsetHeight - 10 + "px";
			} else {
			 emojiDom.style.top = tRect.top + 30 + "px";
			}
		 } else {
			emojiDom.style.left = "-999px";
		 }
		};
		newQuick.after(lamoji);
		if ((newQuick.className + "").indexOf(endClass) == -1) {
		 newQuick.className += ` ${endClass}`;
		 // eslint-disable-next-line
		 newQuick.onclick = () => {
			let emojiDom = document.querySelector("#la_emoji_dialog");
			if (emojiDom != null) {
			 emojiDom.style.left = "-999px";
			}
			let quickContent =
					newQuick.parentNode.querySelector(".la-quick-item");
			if (quickContent != null) {
			 if (quickContent.hasAttribute("hidden")) {
				quickContent.removeAttribute("hidden");
			 } else {
				quickContent.setAttribute("hidden", "hidden");
			 }
			} else {
			 quickContent = document.createElement("div");
			 quickContent.className = "la-quick-item";
			 const qid = `id_${new Date().getTime()}`;
			 let msgs = laGetValue("fastMsgs");
			 if (msgs != "NIL") {
				msgs.split("\n").forEach((it) => {
				 if (it.trim() != "") {
					quickContent.innerHTML += `<div class="la-item0 la-text-item0">${it}</div>`;
				 }
				});
			 } else {
				msgs = "";
			 }
			 quickContent.innerHTML += `<div id="${qid}" class="la-item0 la-item0-add">新增常用语+</div>`;
			 newQuick.after(quickContent);
			 newQuick.parentNode
				.querySelectorAll(".la-text-item0")
				.forEach((it) => {
				it.onclick = () => {
				 quickContent.setAttribute("hidden", "hidden");
				 let editContent = document.querySelector(".area textarea");
				 let editNb = editContent.nextElementSibling;
				 if (
					editContent == null ||
					(editNb != null &&
					 editNb.nodeName.toLowerCase() == "iframe")
				 ) {
					try {
					 document
						.querySelector("iframe")
						.contentDocument.querySelector("body").innerHTML =
						it.innerHTML;
					} catch (e) {
					 // eslint-disable-next-line
					 showDialog("当前页面不支持常用语");
					}
				 }
				 if (editContent != null) {
					document.querySelector(".area textarea").value =
					 it.innerHTML;
				 }
				};
			 });
			 newQuick.parentNode.querySelector(`#${qid}`).onclick = () => {
				// eslint-disable-next-line
				showDialog(
				 `<textarea class="la-ta-input" id="t${qid}">${msgs}</textarea>`,
				 "confirm",
				 "新增常用语",
				 () => {
					let quickValue = (
					 document.querySelector(`#t${qid}`).value + ""
					).trim();
					if (quickValue != "") {
					 laSetValue("fastMsgs", quickValue);
					 quickContent.remove();
					}
				 }
				);
			 };
			}
			let iLeft = newQuick.offsetLeft - 50;
			if (checkPos(newQuick)) {
			 quickContent.style = `margin:5px 0 0 0;left:${iLeft}px`;
			} else {
			 let iBottom = quickContent.offsetHeight + 31;
			 quickContent.style = `margin:-${iBottom}px 0 0 0;left:${iLeft}px`;
			}
		 };
		}
	 }
	}
 }
 let me = null;
 let toptb = null;
 let ct = null;
 let append_parent = null;
 function getDom(dom, id) {
	if (dom == null) {
	 dom = document.querySelector(id);
	}
	return dom;
 }
 function PePaint(ele) {
	ele.childNodes.forEach((it) => {
	 if (
		it.nodeName === "IMG" &&
		(it.className + "").indexOf(endClass) == -1
	 ) {
		it.className += ` ${endClass} la-img-tag0`;
		if (
		 it.hasAttribute("src") &&
		 it.getAttribute("src").indexOf("image/smiley") != -1
		) {
		 it.className += " la-img-tag1";
		}
	 } else if (it.nodeName === "SPAN" && it.innerText.startsWith("IP属地")) {
		it.className = "la-ip-info";
	 } else if (it.nodeName === "FORM") {
		it.setAttribute("autocomplete", "on");
	 } else if (it.nodeName === "A") {
		it.removeAttribute("target");
		if (it.className == "fbld") {
		 let last = it.previousSibling;
		 if (last == null || (last.className + "").indexOf(" la-fbsz") == -1) {
			let newBold = it.cloneNode(true);
			newBold.className += " la-fbsz";
			newBold.innerHTML = "H";
			newBold.setAttribute("title", "标题文字");
			newBold.setAttribute(
			 "onclick",
			 "seditor_insertunit('fastpost', '[size=7]', '[/size]');doane(event);"
			);
			newBold.style = "background:unset";
			it.before(newBold);
		 }
		} else if (!isInvite && it.innerHTML == "邀请好友") {
		 it.parentNode.style.display = "none";
		 isInvite = true;
		} else if (
		 it.innerHTML == "举报" &&
		 (it.className + "").indexOf(endClass) == -1
		) {
		 it.className = `jubao-la ${endClass}`;
		} else if (
		 it.innerText==" 发消息" &&
		 (it.className + "").indexOf(endClass) == -1
		) {
		 it.className += ` ${endClass}`;
		 let bu = document.createElement("a");
		 bu.innerHTML = "拉黑Ta";
		 bu.className = "la-block-user";
		 it.after(bu);

		 bu.onclick = () => {
			if (bu.innerHTML == "已拉黑") {
			 return;
			}
			try {
			 let userName = (
				bu.parentNode.parentNode.querySelector("a").innerHTML + ""
			 ).trim();
			 if (userName == meName) {
				alert("禁止拉黑自己!");
				return;
			 }
			 // eslint-disable-next-line
			 showDialog(
				"小主请三思，确定要拉黑 <b>" + userName + "</b> 吗？",
				"confirm",
				"询问",
				() => {
				 denyUsers.push(userName);
				 var tmpUserTxt = "";
				 denyUsers.forEach((dui) => {
					tmpUserTxt += `${dui}\n`;
				 });
				 laSetValue("denyUsers", tmpUserTxt);
				 bu.innerHTML = "已拉黑";
				}
			 );
			} catch (e) {}
		 };
		}
		if (it.parentNode.className == "pg") {
		 if (it.hasAttribute("href")) {
			const pgurl = it.getAttribute("href");
			it.removeAttribute("href");
			it.style = "cursor:pointer";
			it.onclick = () => {
			 fetch(pgurl, {
				method: "GET",
				credentials: "include",
			 })
				.then(async (res) => ({
				status: res.status,
				buffer: await res.arrayBuffer(),
			 }))
				.then(({ status, buffer }) => {
				if (status == 200) {
				 let html = decoder.decode(buffer);
				 let dom = document.createElement("div");
				 dom.innerHTML = html;
				 let newCt = dom.querySelector("#ct");
				 if (newCt != null && ct != null) {
					newCt.querySelectorAll("img").forEach((cti) => {
					 if (
						(cti.src + "").indexOf("none") != -1 &&
						cti.hasAttribute("file")
					 ) {
						cti.src = cti.getAttribute("file");
					 }
					});
					ct.innerHTML = newCt.innerHTML;
					window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
				 }
				}
			 });
			};
		 }
		}
	 }
	 if (it.nodeType === Node.TEXT_NODE) {
		//emoji支持
		let text = it.textContent + "";
		if (text.trim().length == 0) {
		} else if (
		 text == "头像被屏蔽" &&
		 it.parentNode.className == "avatar"
		) {
		 let parent = it.parentNode;
		 while (parent != null) {
			if ((parent.id + "").startsWith("pid")) {
			 parent.remove();
			 parent = null;
			}
			parent = parent.parentNode;
		 }
		 parent.remove();
		} else if (text == "只看该作者") {
		 it.textContent = "只看Ta";
		} else if (text.trim() == "楼主:") {
		 it.textContent = "";
		} else if (
		 text.indexOf("&#") != -1 &&
		 (it.className + "").indexOf("emoji-done") == -1
		) {
		 it.className += " emoji-done";
		 const results = [];
		 text.match(/&#(\d+);/g).forEach((emj) => {
			let item = { key: emj, value: 0 };
			let value = item.key.replace("&#", "");
			item.value = value.replace(";", "");
			results.push(item);
		 });
		 results.forEach((emj) => {
			it.textContent = it.textContent.replace(
			 emj.key,
			 String.fromCodePoint(emj.value)
			);
		 });
		}
		if (text.indexOf("-") != -1 && text.indexOf(":") != -1) {
		 if (text.indexOf(" 发表于") == -1) {
			parseDate(it, text);
		 } else {
			if (text.indexOf("发表于") != -1) {
			 let tmpArr = text.split("发表于");
			 if (tmpArr.length == 2) {
				// eslint-disable-next-line
				let date1 = moment(tmpArr[1]).fromNow();
				if (date1.indexOf("Invalid") == -1) {
				 it.textContent = tmpArr[0] + " 发表于 " + date1;
				}
			 }
			}
			let uname = text.split(" ");
			if (uname.length > 0 && denyUsers.indexOf(uname[0]) != -1) {
			 blockUser(it);
			}
		 }
		} else if (denyUsers.indexOf(text) != -1) {
		 //黑名单
		 blockUser(it);
		}
	 } else if (it.nodeType === Node.ELEMENT_NODE) {
		PePaint(it);
	 }
	});
 }
 let js = document.createElement("script");
 js.setAttribute(
	"src",
	"https://fastly.jsdelivr.net/npm/emoji-mart@5.6.0/dist/browser.min.js"
 );
 js.setAttribute("async", "true");
 let initHot = false;
 let hot = null;
 let qmenu = null;
 let initQmenu = false;
 let meName = null;
 function main() {
	let rateSelect = null;
	rateSelect = getDom(rateSelect, "#reasonselect");
	if (rateSelect != null) {
	 if (rateSelect.className.indexOf(endClass) == -1) {
		rateSelect.className += ` ${endClass}`;
		let fastRateLi = rateSelect.children[0];
		let msgs = laGetValue("fastMsgs");
		if (msgs != "NIL") {
		 const rateValue = document.querySelector("#reason");
		 if (rateValue != null) {
			let lastLi = null;
			msgs.split("\n").forEach((it) => {
			 if (it.trim() != "") {
				let tmpLI = fastRateLi.cloneNode(true);
				tmpLI.innerHTML = it;
				tmpLI.className = "la-rate-li";
				if (lastLi == null) {
				 rateSelect.prepend(tmpLI);
				} else {
				 lastLi.after(tmpLI);
				}
				lastLi = tmpLI;
				tmpLI.onclick = () => {
				 rateValue.value = tmpLI.innerHTML;
				};
			 }
			});
			let splitLi = fastRateLi.cloneNode(true);
			splitLi.innerHTML = "--------";
			lastLi.after(splitLi);
			rateSelect.childNodes.forEach((rs) => {
			 if (rs.textContent.indexOf("-----") != -1) {
				rs.className = "la-rate-split";
			 }
			});
			let rateSub = document.querySelector("#sendreasonpm");
			if (rateSub != null) {
			 rateSub.checked = true;
			}
		 }
		}
	 }
	}
	if (!initHot) {
	 hot = getDom(hot, "#scbar_hot");
	 if (hot != null && indexArr.length > 0) {
		try {
		 indexArr.sort(() => Math.random() - 0.5);
		} catch (e) {}
		let tmpHtml = "";
		indexArr.forEach((it) => {
		 tmpHtml += `<a href="${it.value}" class=".xi2">${it.name}</a>`;
		});
		hot.innerHTML = tmpHtml;
		initHot = true;
	 }
	}
	if (!initCss) {
	 try {
		document.head.append(widthCss);
		document.body.prepend(style);
		document.body.append(js);
		initCss = true;
	 } catch (e) {}
	}
	if (me == null) {
	 me = getDom(me, "#um .vwmy a");
	 if (me == null) {
		me = getDom(me, "#um .usernav a");
	 }
	} else {
	 if (meName == null) {
		meName = me.innerHTML;
		me.setAttribute(
		 "href",
		 "https://i.pcbeta.com/home.php?mod=space&do=home&view=me"
		);
	 }
	}
	toptb = getDom(toptb, "#toptb");
	if (toptb != null) {
	 if (!initQmenu) {
		toptb.querySelectorAll("a").forEach((it) => {
		 if (it.textContent == "快捷导航") {
			it.textContent = "更多";
		 } else if (it.textContent == "任务" || it.textContent == "高级搜索") {
			it.className = "la-task-a";
		 } else if (it.textContent == "退出") {
			it.className = "la-task-a";
			it.id = "la_safe_exit";
		 }
		});
		if (qmenu == null) {
		 qmenu = getDom(qmenu, "#qmenua_menu ul");
		}
		if(qmenu == null){
		   qmenu = getDom(qmenu,"#qmenu_menu ul");
		}
		if (qmenu != null) {
		 let taskLi = document.createElement("li");
		 taskLi.className = "la-li-center";
		 let advLi = taskLi.cloneNode(true);
		 let exitLi = advLi.cloneNode(true);
		 let inviteLi = exitLi.cloneNode(true);
		 inviteLi.innerHTML = `<a href="https://i.pcbeta.com/home.php?mod=spacecp&ac=invite">邀请好友</a>`;
		 let blackList = advLi.cloneNode(true);
		 blackList.innerHTML = `<a id="black_list_la">黑名单管理</a>`;
		 blackList.onclick = () => {
			let users = "";
			const blackUsers = laGetValue("denyUsers", "NIL");
			if (blackUsers != "NIL") {
			 users = blackUsers;
			}
			// eslint-disable-next-line
			showDialog(
			 `<textarea class="la-ta-input" id="t_black_list">${users}</textarea>`,
			 "confirm",
			 "你屏蔽了这些用户",
			 () => {
				let denyValue = (
				 document.querySelector(`#t_black_list`).value + ""
				).trim();
				laSetValue("denyUsers", denyValue);
				try {
				 denyValue.split("\n").forEach((dui) => {
					denyUsers.push((dui + "").trim());
				 });
				} catch (e) {}
			 }
			);
		 };
		 exitLi.innerHTML = `<a class="la-cursor-pointer">退出</a>`;
		 advLi.innerHTML = `<a href="https://i.pcbeta.com/search.php?mod=forum&adv=yes">高级搜索</a>`;
		 taskLi.innerHTML = `<a href="https://i.pcbeta.com/home.php?mod=task">任务</a>`;
		 qmenu.after(exitLi);
		 qmenu.after(blackList);
		 qmenu.after(advLi);
		 qmenu.after(inviteLi);
		 if (qmenu.parentNode.innerHTML.indexOf("任务") == -1) {
			qmenu.after(taskLi);
		 }
		 exitLi.onclick = () => {
			// eslint-disable-next-line
			showDialog(`确定要退出登录么？`, "confirm", "提示", () => {
			 try {
				document.querySelector("#la_safe_exit").click();
			 } catch (e) {}
			});
		 };
		 initQmenu = true;
		} else {
		 qmenu = getDom(qmenu, "#myspace_menu li");
		}
	 }
	}
	ct = getDom(ct, "#ct");
	if (ct != null) {
	 appendSml(ct);
	 append_parent = getDom(append_parent, "#append_parent");
	 if (append_parent != null) {
		appendSml(append_parent);
	 }
	 PePaint(ct);
	}
 }
 singleInterval = setInterval(() => main(), 1);
 //onload
 window.onload = () => {
	if (host == "i.pcbeta.com" && document.title.indexOf("家园") != -1) {
	 let signShortcut = document.createElement("a");
	 signShortcut.innerHTML = "签到&领奖";
	 signShortcut.style = "cursor:pointer;position:relative;user-select:none";
	 signShortcut.onclick = (e3) => {
		let signDom = e3.target;
		if (signDom.children.length > 0) {
		 signDom.children[0].remove();
		 return;
		}
		let signLog = document.createElement("p");
		signLog.id = "la_sign_log";
		signLog.onclick = () => {
		 signDom.removeChild(signLog);
		};
		signDom.append(signLog);
		let decoder = new TextDecoder("utf-8");
		let taskUri = [
		 `https://${host}/home.php?mod=task&item=new`,
		 `https://${host}/home.php?mod=task&item=doing`,
		];
		async function checkSignTask() {
		 let arr = [];
		 for (let pUri of taskUri) {
			let resp = await fetch(pUri, {
			 method: "GET",
			 credentials: "include",
			});
			if (resp.ok) {
			 const buffer = await resp.arrayBuffer();
			 let thtml = decoder.decode(buffer);
			 let dom = document.createElement("div");
			 dom.innerHTML = thtml;
			 dom.querySelectorAll("a").forEach((tlink) => {
				let href = (tlink.getAttribute("href") + "").trim();
				if (href.indexOf("id=") != -1 && href.indexOf("task") != -1) {
				 let hrefIndex = href.lastIndexOf("#");
				 if (hrefIndex != -1) {
					href = href.substring(0, hrefIndex);
				 }
				 if (arr.indexOf(href) == -1) {
					arr.push(href);
				 }
				}
			 });
			}
		 }
		 return arr;
		}
		let signCount = 0;
		async function lalakiSignV2() {
		 let arr = await checkSignTask();
		 if (arr.length == 0) {
			if ((signLog.innerHTML + "").indexOf("ERROR") == -1) {
			 signLog.innerHTML =
				"<b class='la-green'>全部任务已完成，奖励均已领取。</b>";
			}
		 } else {
			for (let tUri of arr) {
			 let resp = await fetch(tUri, {
				method: "GET",
				credentials: "include",
			 });
			 if (resp.ok) {
				const _buffer = await resp.arrayBuffer();
				let _html = decoder.decode(_buffer);
				let _dom = document.createElement("div");
				_dom.innerHTML = _html;
				let _threadLinks = _dom.querySelectorAll("#ct a");
				for (let i = 0; i < _threadLinks.length; i++) {
				 let _href = ("" + _threadLinks[i].href).trim();
				 if (_href.indexOf("viewthread") != -1 && signCount > 0) {
					// eslint-disable-next-line
					showDialog(
					 "有签到任务~是否前往回复帖子？<br>(任务完成后记得回来领取奖励哦)",
					 "confirm",
					 "询问",
					 () => {
						let signTmpA = document.createElement("a");
						signTmpA.setAttribute("href", _href + "#fastpostmessage");
						signTmpA.setAttribute("target","_blank");
						signTmpA.setAttribute("hidden","hidden");
						signTmpA.className = endClass;
						let logold = document.querySelector("#la_sign_log");
						if(logold!=null){
						logold.click();}
						document.body.appendChild(signTmpA);
						signTmpA.click();
					 }
					);
					break;
				 }
				}
				if ((signLog.innerHTML + "").indexOf("ERROR") == -1) {
				 signLog.innerHTML = "成功执行了任务~<br>";
				}
			 } else {
				signLog.innerHTML =
				 "<b class='la-error'>ERROR: 请前往【任务】页面检查~</b>(也可以尝试重新点击签到按钮哦)<br>";
			 }
			}
			if (signCount == 0) {
			 lalakiSignV2();
			}
			signCount++;
		 }
		}
		lalakiSignV2();
	 };
	 me.parentNode.after(signShortcut);
	}
	window.onscroll = () => {
	 const emoji_picker = document.querySelector("#la_emoji_dialog");
	 if (emoji_picker != null) {
		emoji_picker.style.left = "-999px";
	 }
	};
	let innerScript = document.createElement("script");
	innerScript.innerHTML = `
           const emojiDialog = document.createElement("div");
           window.lamojiDialog = emojiDialog;
           function imgSelectOK(value){
              let emojiIco = value.native;
                   let editContent = document.querySelector(".area textarea");
                                   let editNb = editContent.nextElementSibling;
                                   if (
                                       editContent == null ||
                                       (editNb != null && editNb.nodeName.toLowerCase() == "iframe")
                                   ) {
                                       try {
                                           document
                                               .querySelector("iframe")
                                               .contentDocument.querySelector("body").innerHTML+=emojiIco;
                                       } catch (e) {
                                           // eslint-disable-next-line
                                           showDialog("emoji出现未知错误");
                                       }
                                   }
                                   if (editContent != null) {
                                       document.querySelector(".area textarea").value += emojiIco;
                                   }
           }
   fetch(
       "https://fastly.jsdelivr.net/gh/missive/emoji-mart@5.6.0/packages/emoji-mart-data/i18n/zh.json"
   )
       .then((res) => res.json())
       .then((i18n) => {
           fetch(
               "https://fastly.jsdelivr.net/npm/@emoji-mart/data@latest/sets/15/native.json"
           )
               .then((response) => response.json())
               .then((data) => {
                   const pickerOptions = {
                       data: data,
                       i18n: i18n,
                       searchPosition: "none",
                       noCountryFlags: true,
                 dynamicWidth:false,
                 perLine:13,
                 maxFrequentRows:6,
                 searchPosition:"none",
                 previewPosition:"top",
                       theme: "light",
                       categories: [
                           "frequent",
                           "people",
                           "activity",
                           // 'flags',
                           "foods",
                           "nature",
                           "objects",
                           "places",
                           "symbols",
                       ],
                       onEmojiSelect: imgSelectOK,
                   };
                   const picker = new EmojiMart.Picker(pickerOptions);
                   emojiDialog.id = "la_emoji_dialog";
                   emojiDialog.className = "la-emoji-dialog";
                   emojiDialog.appendChild(picker);
                   emojiDialog.style = "left:-999px";
                   document.body.appendChild(emojiDialog);
               });
       });
     `;
	document.body.append(innerScript);
	function setSelectOption(sid, sIndex) {
	 let pbf = document.querySelector(sid);
	 if (pbf != null) {
		pbf.value = sIndex;
		pbf.onchange();
	 }
	}
	if (search.endsWith("&op=exchange")) {
	 setSelectOption("#tocredits", 2);
	 setSelectOption("#fromcredits_0", 1);
	}
	if (location.href.indexOf("viewthread") != -1) {
	 //upload
	 let fastForm = document.querySelector("#fastpostform");
	 if(fastForm!=null){
		// 启用拖放
		fastForm.addEventListener('dragover', function(e) {
		 e.preventDefault();
		 e.stopPropagation();
		 fastForm.style.opacity="0.4";
		 return false;
		});
		fastForm.addEventListener("dragleave", function(e){
		 fastForm.style.opacity="1";
		});
		fastForm.addEventListener('drop', function(e) {
		 e.preventDefault();
		 e.stopPropagation();
		 fastForm.style.opacity="1";
		 const files = e.dataTransfer.files; // 获取拖拽的文件
		 // eslint-disable-next-line
		 fastUload();
		 const mmInterval = setInterval(()=>{
			let fileData = document.querySelector("#filedata");
			let formDiag = document.querySelector("#fwin_upload");
			if(formDiag!=null){
			 formDiag.style="display:none";
			}
			if (fileData != null) {
			 try{
				fileData.files = files;
				fileData.onchange();
				clearInterval(mmInterval);
			 }catch(e){}
			}
		 },10);
		 return false;
		});
	 }
	 const replyToolBar = document.createElement("div");
	 document.addEventListener("mousemove", (event) => {
		let mouseX = event.clientX;
		let mouseY = event.clientY;
		if (mouseY < 100) {
		 return;
		}
		let screenWidth = window.innerWidth;
		if (mouseX >= screenWidth - 40) {
		 replyToolBar.className = "la-custom-toolbar la-custom-toolbar-show";
		} else if (mouseX < screenWidth - 100) {
		 replyToolBar.className = "la-custom-toolbar";
		}
	 });
	 replyToolBar.className = "la-custom-toolbar";
	 replyToolBar.innerHTML = `<div id="la-only-author"></div>`;
	 document.body.append(replyToolBar);
	 function makeP() {
		let pa = document.createElement("div");
		pa.className = "la-p";
		return pa;
	 }
	 let mainItem = document.querySelector("#postlist table .pti");
	 if (mainItem != null) {
		mainItem.querySelectorAll("a").forEach((it) => {
		 let pa = makeP();
		 it.style.display = "block";
		 if(it.className.indexOf("pipe")==-1){
		 pa.append(it);
		 replyToolBar.append(pa);}
		});
		mainItem.querySelectorAll(".pipe").forEach((it) => {
		 it.style = "display:none";
		});
		["发新帖", "前往首页", "前往尾页", "回复本贴", "↑", "↓"].forEach(
		 (it) => {
			let pa = makeP();
			pa.innerHTML = `<a class="la-a-cursor">${it}</a>`;
			if (it == "↑") {
			 pa.id = "la_top_1";
			 replyToolBar.prepend(pa);
			} else {
			 replyToolBar.append(pa);
			}
			pa.onclick = () => {
			 switch (it) {
				case "前往首页":
				 var rp = document.querySelector("#thread_subject");
				 if (rp != null) {
					rp.click();
				 }
				 break;
				case "发新帖":
				 var postNew = document.querySelector("#newspecial");
				 if (postNew != null) {
					postNew.click();
				 }
				 break;
				case "前往尾页":
				 var lst = document.querySelector(".pg .nxt");
				 if (lst != null) {
					let last = lst.previousSibling;
					if (last != null) {
					 last.click();
					}
				 }
				 break;
				case "回复本贴":
				 var crt = document.querySelector("#post_reply");
				 if (crt != null) {
					crt.click();
				 }
				 break;
				case "↑":
				 window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
				 break;
				case "↓":
				 window.scrollTo({
					top: document.body.scrollHeight,
					left: 0,
					behavior: "smooth",
				 });
				 break;
			 }
			};
		 }
		);
	 }
	}
 };
})();
