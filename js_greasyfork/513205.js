// ==UserScript==
// @name        远景小助手
// @namespace    http://tampermonkey.net/
// @version      26.0.0.0
// @description  远景论坛自定义小功能~ 优化你的访问体验，免受烦人的水帖子困扰。常用功能: 一键领取任务与奖励，快捷发言-自定义常用语，阅读回复免翻页，可选功能: 屏蔽指定用户的发言，隐藏等级 | 徽章 | 签名 | 默认黄色小老虎表情显示等。请优先使用篡改猴(Tampermonkey)加载此脚本（这是最后一版了，以后不再提供更新）。
// @supportURL   https://lalaki.cn/rp
// @homepage     https://lalaki.cn
// @author       lalaki
// @match        https://*.pcbeta.com/*
// @icon         https://lalaki.cn/p/?i=pbi
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://fastly.jsdelivr.net/npm/moment@2.30.1/min/moment.min.js
// @require      https://fastly.jsdelivr.net/npm/moment@2.30.1/locale/zh-cn.js
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513205/%E8%BF%9C%E6%99%AF%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/513205/%E8%BF%9C%E6%99%AF%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
	"use strict";
	if (document.head == null) {
		return;
	}
	const FINAL_VERSION = "26";
	const pluginName = "远景小助手";
	const style = document.createElement("style");
	const denyUsers = [];
	try {
		// eslint-disable-next-line
		moment.locale("zh-cn");
	} catch (e) {}
	style.innerHTML = `
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}
::-webkit-scrollbar-thumb {
    background: #1985db;
    border-radius: 3px;
    border-left:1px solid #eee;
}
::-webkit-scrollbar-thumb:hover {
    background: #555;
}
    .la-force-hidden{
        display:none !important;
        visibility:hidden !important;
    }
    .la-custom-toolbar .la-p{
        background:#018ed5;
        width:100%;
        text-align:center;
        padding:11px 0 11px 0;
        border-top:1px solid #eee;
    }
    .la-custom-toolbar{
        width:0px;
        display:none;
    }
    .la-custom-toolbar-show{
        display:flex;
        width: 100px;
        transition: width 0.1s ease;
    }
    .la-p a{
       color:#f3f3f3 !important;
    }
    .la-p:hover{
    background:#006ea6;
    }
    .la-a-cursor{
        cursor:pointer;
    }
    .la-blue{
        color:blue !important;
    }

    .la-green{
        color:#6dff02 !important;
    }

    .la-bg-active{
        background:#2ca10a;
    }

    .la-error{
        color:#ffc107;
    }
  `;
	document.body.prepend(style);
	const ui = document.createElement("div");
	ui.setAttribute("hidden", "hidden");
	ui.style =
		"user-select:none;color:inherit;background-color:transparent;font-size:150%;position:fixed;left:0;top:0;z-index:2147483646";
	document.body.append(ui);
	const shadow = ui.attachShadow({ mode: "open" });
	const cont = document.createElement("div");
	const h0 = "display:none";
	function tryBlockUsers() {
		document.querySelectorAll(".quote").forEach((q) => {
			let qu = ("" + q.innerText).trim();
			denyUsers.forEach((u) => {
				if (qu != "" && qu.startsWith(u)) {
					q.style = h0;
				}
			});
		});
		document.querySelectorAll("a").forEach((a) => {
			let parent = a;
			let patch = false;
			while (parent != null) {
				let username = ("" + a.innerHTML).trim();
				if (username == "" || denyUsers.indexOf(username) == -1) {
					break;
				}
				let pid = ("" + parent.id).trim();
				if (
					pid.startsWith("post_") ||
					pid.startsWith("stickthread_") ||
					pid.startsWith("normalthread_")
				) {
					parent.style = h0;
					break;
				}
				let pClass = ("" + parent.className).trim();
				let nd = parent.nodeName.toLowerCase();
				if (
					pClass == "pbw" ||
					pClass == "bw0_all" ||
					nd == "tr" ||
					nd == "li"
				) {
					//处理特殊情况
					parent.style = h0;
					break;
				}
				if (
					pClass == "nts" ||
					nd == "body" ||
					pClass == "p_pop" ||
					pClass == "y"
				) {
					//保护节点
					break;
				}
				let pc = 0;
				parent.querySelectorAll("a").forEach((pa) => {
					if (pa.href.indexOf(a.href) != -1) {
						pc++;
					}
				});
				if (pc > 1) {
					parent.style = h0;
					patch = true;
					break;
				}
				parent = parent.parentNode;
			}
			if (patch) {
				//修复回复帖子
				parent = a;
				while (parent != null) {
					let pid = ("" + parent.id).trim();
					if (
						pid.startsWith("post_") ||
						pid.startsWith("stickthread_") ||
						pid.startsWith("normalthread_")
					) {
						parent.style = h0;
						break;
					}
					parent = parent.parentNode;
				}
			}
		});
	}
	//UI界面布局
	cont.innerHTML = `
<style nonce>
    .la-new-ver{
        position:absolute;
        transform:translateY(-10px);
        right:10px;
        color:red;
        font-size:10px;
    }
    .la-bg {
        font-family: "Segoe UI", Arial, sans-serif;
        margin: 6px auto auto 6px;
        background: #fff;
        width: 290px;
        height: 374px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        position: absolute;
    }

    .la-close {
        position: absolute;
        padding: 6px 6px 6px 8px;
        right: 0;
        top: 0;
        border-top-right-radius: 10px;
        font-size: 22px;
        font-family: monospace;
        cursor: pointer;
        color: #333;
    }

    .la-close:hover {
        background: #ff5757;
        color: #fff;
    }

    .la-title-bar {
        position: absolute;
        display: flex;
        width: 100%;
        padding: 7px 0 5px 7px;
        flex-wrap: wrap;
        user-select: none;
    }

    .la-title {
        font-size: 15px;
        display: inline;
        padding: 0 0 0 7px;
        color: #333;
    }

    .la-hr {
        height: 1px;
        background: #efefef;
        width: 100%;
        position: relative;
        margin: 6px 0 0 0;
        transform: translateX(-7px);
    }

    .la-drag-border {
        width: 290px;
        height: 374px;
        border: 2px solid #000;
        position: fixed;
        z-index:99999;
    }

    .la-main {
        position: absolute;
        top: 40px;
        height: 326px;
        width: 282px;
        display: flex;
        align-items: center;
        margin: 0 0 0 3px;
        border-radius: 2px;
        color:#333;
    }

    .la-li:hover {
        background: #ececec;
    }

    .la-li {
        padding: 7px 0 7px 10px;
        border: 1px solid #ececec;
        border-radius: 3px;
        align-items: center;
        display: flex;
        margin: 4px auto;
    }

    .la-icon {
        transform: scaleX(1.88);
        position: absolute;
        display: inline-block;
        right: 20px;
        font-size: 14px;
        pointer-events:none;
    }

    ul {
        list-style-type: none;
        width: 100%;
        padding: 0 0 0 2px;
        margin: 0;
        height: 100%;
        overflow: auto;
        position: absolute;
        top: 0;
    }

    .switch {
        position: relative;
        display: inline-block;
        width: 39px;
        height: 23px;
    }

    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 15px;
        width: 15px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
    }

    input:checked+.slider {
        background-color: #2196F3;
    }

    input:focus+.slider {
        box-shadow: 0 0 1px #2196F3;
    }

    input:checked+.slider:before {
        -webkit-transform: translateX(15px);
        -ms-transform: translateX(15px);
        transform: translateX(15px);
    }

    .slider.round {
        border-radius: 34px;
    }

    .slider.round:before {
        border-radius: 50%;
    }

    .la-switch {
        position: absolute;
        right: 10px;
    }

    .la-li-item {
        text-indent: 10px;
        display: none;
    }

    #all_ava:hover{
        background:#fff !important;
    }

    #all_ava{
        flex-wrap:wrap;
        justify-content:space-around;
    }

    #all_ava img{
        margin:5px auto;
    }

    .la-ta{
        height: 106px;
        width: 249px;
    }

    .la-p0{
        padding:0 0 0 0
    }

    .la-blue{
        color:blue !important;
    }

    .la-green{
        color:#6dff02 !important;
    }

    .la-bg-active{
        background:#2ca10a;
    }

    .la-error{
        color:#ffc107;
    }

    #la_help{
        display:flex;text-indent:0px;padding:7px 0 7px 0px;justify-content:center;
    }
</style>
<div draggable="false" class="la-bg">
    <div class="la-title-bar"><img alt="close" draggable="false"
            src="https://lalaki.cn/p/?i=pbi">
        <div class="la-title">${pluginName} - 最终版</div>
        <div class="la-hr"></div>
    </div>
    <div class="la-close">×</div>
    <div class="la-drag-border" hidden="hidden"></div>
    <div class="la-main">
        <ul>
            <li>
                <div class="la-li" id="custom">个性化<div class="la-icon">∨</div>
                </div>
            </li>
            <li>
                <div class="la-li la-li-item la-li-item1">不显示用户资料
                    <div class="la-switch">
                        <label class="switch">
                            <input type="checkbox" id="uinfo">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </li>
            <li>
                <div class="la-li la-li-item la-li-item1">不显示用户等级
                    <div class="la-switch">
                        <label class="switch">
                            <input type="checkbox" id="lv">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </li>
            <li>
                <div class="la-li la-li-item la-li-item1">不显示用户徽章
                    <div class="la-switch">
                        <label class="switch">
                            <input type="checkbox" id="ava">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </li>
            <li>
                <div class="la-li la-li-item la-li-item1">不显示用户签名
                    <div class="la-switch">
                        <label class="switch">
                            <input type="checkbox" id="usign">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </li>
            <li>
                <div class="la-li la-li-item la-li-item1">不显示IP属地
                    <div class="la-switch">
                        <label class="switch">
                            <input type="checkbox" id="ip">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </li>
            <li>
                <div class="la-li la-li-item la-li-item1">不显示默认表情
                    <div class="la-switch">
                        <label class="switch">
                            <input type="checkbox" id="exp">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </li>
           <li>
                <div class="la-li la-li-item la-li-item1">内容铺满全屏
                    <div class="la-switch">
                        <label class="switch">
                            <input type="checkbox" id="afull">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </li>
            <li>
                <div class="la-li la-li-item la-li-item1">WordPress置顶按钮
                    <div class="la-switch">
                        <label class="switch">
                            <input type="checkbox" id="astui">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </li>
            <li>
                <div class="la-li la-li-item la-li-item1">隐藏底部的“版权所有”
                    <div class="la-switch">
                        <label class="switch">
                            <input type="checkbox" id="lacopy">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </li>
            <li>
                <div class="la-li la-li-item la-li-item1">在当前页打开链接
                    <div class="la-switch">
                        <label class="switch">
                            <input type="checkbox" id="nowindow">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </li>
            <li>
                <div class="la-li la-li-item la-li-item1">兼容性
                    <div class="la-switch">
                        <label class="switch">
                            <input type="checkbox" id="alegacy">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </li>
            <li>
                <div class="la-li la-li-item la-li-item1">为自己佩戴勋章
                    <div class="la-switch">
                        <label class="switch">
                            <input type="checkbox" id="aforme">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </li>
            <li hidden="hidden">
                <div class="la-li la-li-item la-li-item1" id="all_ava"></div>
            </li>
           <li>
                <div class="la-li" id="auto_pg">懒加载<div class="la-icon">∨</div>
                </div>
            </li>
            <li>
                <div class="la-li la-li-item la-li-item5">功能总开关
                    <div class="la-switch">
                        <label class="switch">
                            <input type="checkbox" id="auto_pages">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </li>
            <li id="auto_page_content">
                <div class="la-li la-li-item la-li-item5">启用此选项后，当帖子总回复小于10页时，将不会显示翻页按钮。<br>&nbsp;当页面滚动时，会自动加载后面的回复。
                </div>
            </li>
           <li>
                <div class="la-li" id="jy_mode">简约模式<div class="la-icon">∨</div>
                </div>
            </li>
            <li>
                <div class="la-li la-li-item la-li-item6">功能总开关
                    <div class="la-switch">
                        <label class="switch">
                            <input type="checkbox" id="jy_mode_01">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </li>
            <li id="jy_mode_content">
                <div class="la-li la-li-item la-li-item6">启用此选项后，用户头像显示更小，页面内容更加紧凑。<br>&nbsp;&nbsp;回帖时间格式化为“N天前”，更加直观。<br>&nbsp;&nbsp;开启此功能时，建议在个性化设置里面隐藏页面上一些无关紧要的东西，可以增强体验。
                </div>
            </li>
            <li>
                <div class="la-li" id="fast_msg">快捷发言<div class="la-icon">∨</div>
                </div>
            </li>
            <li>
                <div class="la-li la-li-item la-li-item2">功能总开关
                    <div class="la-switch">
                        <label class="switch">
                            <input type="checkbox" id="fast_msg_01">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </li>
            <li id="fast_msg_data" hidden="hidden">
                <div class="la-li la-li-item la-li-item2">
                  <textarea class="la-ta"></textarea>
                </div>
            </li>
            <li>
                <div class="la-li" id="block_users">黑名单<div class="la-icon">∨</div>
                </div>
            </li>
            <li>
                <div class="la-li la-li-item la-li-item3">功能总开关
                    <div class="la-switch">
                        <label class="switch">
                            <input type="checkbox" id="block_users_01">
                            <span class="slider round"></span>
                        </label>
                    </div>
                </div>
            </li>
             <li id="block_users_data" hidden="hidden">
                <div class="la-li la-li-item la-li-item3">
                  <textarea class="la-ta"></textarea>
                </div>
            </li>
             <li class="la-p0">
                <div class="la-li la-li-item" id="la_help">
               使用帮助
                </div>
            </li>
            <li id="update_tips" class="la-p0" hidden="hidden">
                <div class="la-li la-li-item la-li-item4">
               立即更新
                </div>
            </li>
        </ul>
    </div>
</div>
    `;
	shadow.append(cont);
	const titleBar = cont.querySelector(".la-title-bar");
	cont.querySelector(".la-close").onclick = () => {
		ui.setAttribute("hidden", "hidden");
	};
	let offsetX, offsetY;
	const dragBorder = cont.querySelector(".la-drag-border");
	titleBar.addEventListener("mousedown", (e) => {
		if (e.button != 0) {
			return;
		}
		dragBorder.removeAttribute("hidden");
		offsetX = e.clientX - cont.getBoundingClientRect().left;
		offsetY = e.clientY - cont.getBoundingClientRect().top;
		document.addEventListener("mousemove", laMouseMoveHandler);
		document.addEventListener("mouseup", laMouseUpHandler);
	});
	function laMouseMoveHandler(e) {
		dragBorder.style.left = `${e.clientX - offsetX}px`;
		dragBorder.style.top = `${e.clientY - offsetY}px`;
	}
	function laMouseUpHandler() {
		document.removeEventListener("mousemove", laMouseMoveHandler);
		document.removeEventListener("mouseup", laMouseUpHandler);
		let left = dragBorder.style.left;
		let top = dragBorder.style.top;
		if ((left + top + "").trim() != "") {
			ui.style.left = left;
			ui.style.top = top;
		}
		dragBorder.setAttribute("hidden", "hidden");
	}
	function openUrlWithoutNewWindow() {
		document
			.querySelectorAll("a")
			.forEach((it) => it.removeAttribute("target"));
	}
	function jianyue() {
		if (location.href.indexOf("viewthread") != -1) {
			document.querySelectorAll(".pstatus").forEach((it) => {
				it.style = h0;
			});
			let tj = document.querySelector("h3.pbm");
			if (tj != null) {
				tj.parentNode.style = h0;
			}
			document.querySelectorAll(".avatar a img").forEach((it) => {
				it.style.width = "100%";
				it.parentNode.parentNode.style =
					"width:80px;margin:auto auto auto auto";
			});
			document.querySelectorAll(".t_fsz").forEach((it) => {
				it.style.minHeight = "auto";
			});
			let plc = document.querySelector(".plc .modact");
			if (plc != null) {
				plc.style = h0;
			}
			let pls = document.querySelectorAll("#postlist tbody .pls");
			pls.forEach((it) => {
				it.style.width = "100px";
				let pi = it.querySelector(".pi");
				if (pi != null) {
					pi.style = "padding:0 0 0 0;text-align:center";
				}
				let hsign = it.querySelector(".xg1");
				if (hsign != null) {
					hsign.style = h0;
				}
			});
			let fj = document.querySelector("#postlist #fj");
			if (fj != null) {
				fj.style = h0;
			}
			let postList = document.querySelector("#postlist");
			if (postList != null) {
				postList.childNodes.forEach((p0) => {
					if (("" + p0.nodeName).trim() == "DIV") {
						let ckmePost = p0.querySelector(".pls .authi a");
						if (ckmePost != null) {
							if (ckmePost.innerText == me && me != "") {
								p0.querySelectorAll("a").forEach((pma) => {
									if (pma.innerText == "评分") {
										pma.style = h0;
									}
								});
								let pzan = p0.querySelector(".pc_box.pc_zan");
								if (pzan != null) {
									pzan.style = h0;
								}
								let pcai = p0.querySelector(".pc_box.pc_cai");
								if (pcai != null) {
									pcai.style = h0;
								}
							}
						}
						if ((p0.getAttribute("lala-done") + "").trim() != "0") {
							let emm = p0.querySelector(".authi em");
							if (emm != null) {
								let rawDate = emm.innerText.replace("发表于", "").trim();
								try {
									// eslint-disable-next-line
									emm.innerText = moment(rawDate).fromNow();
								} catch (e) {
									emm.innerText = rawDate;
								}
							}
							p0.querySelectorAll("a").forEach((pa) => {
								if (pa.innerText == "举报") {
									let uhref = p0.querySelector(".imicn");
									if (uhref != null) {
										pa.style = "margin: 0px 0px 0px 11px";
										uhref.append(pa);
									}
									p0.setAttribute("lala-done", "0");
								} else if (pa.innerText == "评分") {
									let leftBtns = p0.querySelector("#p_btn");
									if (leftBtns != null) {
										leftBtns.append(pa);
									}
									p0.setAttribute("lala-done", "0");
								} else if (pa.innerText == "只看该作者") {
									pa.style = h0;
									let spl = pa.previousSibling;
									if (spl != null) {
										spl.style = h0;
									}
									p0.setAttribute("lala-done", "0");
								}
							});
						}
					}
				});
			}
			return postList;
		}
	}
	//添加到顶部菜单
	const shortcut = document.createElement("a");
	shortcut.innerHTML = pluginName;
	shortcut.style = "cursor:pointer;user-select:none";
	shortcut.onclick = () => {
		if (ui.hasAttribute("hidden")) {
			ui.removeAttribute("hidden");
		} else {
			ui.setAttribute("hidden", "hidden");
		}
	};
	const toplinks = document.querySelectorAll("#toptb a");
	for (let i = 0; i < toplinks.length; i++) {
		let menuText = toplinks[i]?.innerHTML + "";
		if (["马甲", "快捷导航", "返回首页"].indexOf(menuText) != -1) {
			toplinks[i].before(shortcut);
			break;
		} else if (menuText == "登录") {
			let tmp = document.createElement("li");
			tmp.style = "width:auto";
			tmp.append(shortcut);
			toplinks[i].parentNode.before(tmp);
			tmp.parentNode.style = "width:auto";
			shortcut.style =
				"width:auto;padding:0 0 0 5px;cursor:pointer;user-select:none";
			break;
		}
	}
	if (location.host == "i.pcbeta.com") {
		let signShortcut = document.createElement("a");
		signShortcut.innerHTML = "一键领任务与奖励";
		signShortcut.style = "cursor:pointer;position: relative;user-select:none";
		signShortcut.onclick = (e3) => {
			let signDom = e3.target;
			if (signDom.children.length > 0) {
				signDom.children[0].remove();
				return;
			}
			let signLog = document.createElement("div");
			signLog.style =
				"position:absolute;width:auto;height:auto;color:#fff;left:0;";
			signLog.onclick = () => {
				signDom.removeChild(signLog);
			};
			signDom.append(signLog);
			let decoder = new TextDecoder("gbk");
			let taskUri = [
				"https://i.pcbeta.com/home.php?mod=task&item=new",
				"https://i.pcbeta.com/home.php?mod=task&item=doing",
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
							"<b class='la-green'>没有任务了~全都做完了。</b>";
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
											location.href = _href + "#fastpostmessage";
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
		shortcut.after(signShortcut);
	}
	const items = cont.querySelectorAll(".la-li-item1");
	const items2 = cont.querySelectorAll(".la-li-item2");
	const items3 = cont.querySelectorAll(".la-li-item3");
	const items5 = cont.querySelectorAll(".la-li-item5");
	const items6 = cont.querySelectorAll(".la-li-item6");
	const menus = cont.querySelectorAll(".la-li");
	menus.forEach((it) => {
		it.addEventListener("click", (e) => {
			const icon = e.target.querySelector(".la-icon");
			let tmpItems = null;
			switch (("" + e.target.id).trim()) {
				case "auto_pg":
					tmpItems = items5;
					break;
				case "custom":
					tmpItems = items;
					break;
				case "fast_msg":
					tmpItems = items2;
					break;
				case "block_users":
					tmpItems = items3;
					break;
				case "jy_mode":
					tmpItems = items6;
					break;
			}
			if (tmpItems != null) {
				for (let i = 0; i < tmpItems.length; i++) {
					let menuShown = ("" + tmpItems[i].style.display).trim();
					if (menuShown.indexOf("flex") != -1) {
						tmpItems[i].style = h0;
						icon.style = "transform:scaleX(1.88)";
					} else {
						tmpItems[i].style = "display:flex";
						icon.style = "transform:scaleX(1.88) rotate(180deg);";
					}
				}
			}
		});
	});
	//载入配置
	let isJyMode = GM_getValue("jym", "false") == true;
	let autoPgs = GM_getValue("aps", "false") == true;
	let hideDetails = GM_getValue("dts", "false") == true;
	let hideStar = GM_getValue("star", "false") == true;
	let hideAva = GM_getValue("ava", "false") == true;
	let hideSign = GM_getValue("hsg", "false") == true;
	let hideIp = GM_getValue("hip", "false") == true;
	let hideExp = GM_getValue("exp", "false") == true;
	let hideAvas = GM_getValue("avas", "false") == true;
	let showFull = GM_getValue("full", "false") == true;
	let showFastMsg = GM_getValue("fm", "false") == true;
	let showBlockUsers = GM_getValue("bu", "false") == true;
	let isLegacy = GM_getValue("lga", "false") == true;
	let isScrollTop = GM_getValue("stui", "false") == true;
	let isHideCopy = GM_getValue("lacopy", "false") == true;
	let isNotNewWindow = GM_getValue("unc", "false") == true;
	let legacy = cont.querySelector("#alegacy");
	legacy.checked = isLegacy;
	let fastMsgUI = cont.querySelector("#fast_msg_data");
	let blockui = cont.querySelector("#block_users_data");
	let fastMsgText = cont.querySelector("#fast_msg_data textarea");
	let blockUsersText = cont.querySelector("#block_users_data textarea");
	let meDom = document.querySelector(".vwmy a");
	let me = "";
	if (meDom != null) {
		me = (meDom.innerHTML + "").trim();
		meDom.href = "https://i.pcbeta.com";
		meDom.removeAttribute("target");
	} else {
		let meDom2 = document.querySelector("#um .y a");
		if (meDom2 != null) {
			me = (meDom2.innerHTML + "").trim();
			meDom2.href = "https://i.pcbeta.com";
			meDom2.removeAttribute("target");
		}
	}
	function addBlockBtns(pid, p) {
		if (("" + pid).startsWith("post_")) {
			let user = document.querySelector("#" + pid + " .authi a");
			let username = ("" + user.innerHTML).trim();
			if (username != "" && denyUsers.indexOf(username) != -1) {
				p.style = h0;
			}
			let parent = user.parentNode;
			let block = document.createElement("a");
			block.innerHTML = "拉黑Ta";
			block.style = "cursor:pointer;margin: 0px 0px 0px 16px";
			block.onclick = () => {
				if (block.innerHTML == "已拉黑") {
					return;
				}
				// eslint-disable-next-line
				showDialog(
					"小主请三思，确定要拉黑 <b>" + username + "</b> 吗？",
					"confirm",
					"询问",
					() => {
						blockUsersText.value = blockUsersText.value + "\n" + username;
						block.innerHTML = "已拉黑";
						blockUsersText.dispatchEvent(new Event("input", { bubbles: true }));
					}
				);
			};
			if (me != username) {
				let cph = parent.parentNode.parentNode.querySelector(".imicn");
				if (cph != null) {
					cph.append(block);
				}
			}
		}
	}
	let avas = [
		"https://i.pcbeta.com/static/image/common/medal_201209/zscj.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/yxbz.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/xcs.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/ycxf.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/rxhy.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/jdz.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/hdzz.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/cyxf.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/jydr.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/ryhy.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/yjsf.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/yxbs.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/nmxx.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/mhdr.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/kfdr.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/jsdr.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/jzt.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/byg.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/yxdr.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/xbs.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/xbs2.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/pcdr.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/tsgx.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/ss.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/rich.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/7.png",
		"https://i.pcbeta.com/static/image/common/medal_iety.png",
		"https://i.pcbeta.com/static/image/common/medal_surface1.png",
		"https://i.pcbeta.com/static/image/common/medal_movies.png",
		"https://i.pcbeta.com/static/image/common/medal_appx.png",
		"https://i.pcbeta.com/static/image/common/medal_zdx.png",
		"https://i.pcbeta.com/static/image/common/medal_book.png",
		"https://i.pcbeta.com/static/image/common/medal_8th.png",
		"https://i.pcbeta.com/static/image/common/medal_smdr.png",
		"https://i.pcbeta.com/static/image/common/medal_dianzan.png",
		"https://i.pcbeta.com/static/image/common/medal_windowsphone.png",
		"https://i.pcbeta.com/static/image/common/medal_worldcup.png",
		"https://i.pcbeta.com/static/image/common/medal_daxuesheng.png",
		"https://i.pcbeta.com/static/image/common/medal_9a.png",
		"https://i.pcbeta.com/static/image/common/Win_10_forerunner.png",
		"https://i.pcbeta.com/static/image/common/10.png",
		"https://i.pcbeta.com/static/image/common/medal_201209/medal_11th.png",
	];
	let allIMG = "";
	let sUrl = GM_getValue("imgurls", "NUL");
	avas.forEach((avai) => {
		let showBG = sUrl.indexOf(avai) != -1;
		allIMG += `<img class="custom_avas ${
			showBG ? "la-bg-active" : ""
		}" src="${avai}">`;
	});
	function hideStarFunc() {
		document.querySelectorAll(".avatar_p").forEach((a) => (a.style = h0));
		document.querySelectorAll("p").forEach((st) => {
			if (("" + st.id).startsWith("g_up")) {
				st.style = h0;
			}
		});
		document.querySelectorAll(".pls p img").forEach((it) => {
			if ((it.getAttribute("lala-done") + "").trim() != "0") {
				it.style = h0;
			}
		});
	}
	function hideAvaFunc() {
		document.querySelectorAll(".md_ctrl").forEach((a) => {
			if ((a.getAttribute("lala-done") + "").trim() != "0") {
				a.style = h0;
				a.setAttribute("lala-done", "0");
			}
		});
	}
	function hideSignFunc() {
		document.querySelectorAll(".sign")?.forEach((sg) => {
			sg.style = h0;
		});
	}
	function hideIpFunc() {
		document.querySelectorAll("span").forEach((aa) => {
			if ((aa.innerHTML + "").trim().startsWith("IP属地")) {
				aa.style = h0;
			}
		});
	}
	function hideExpFunc() {
		document.querySelectorAll("img").forEach((i) => {
			if (
				("" + i.src).startsWith("https://bbs.pcbeta.com/static/image/smiley")
			) {
				i.style = h0;
			}
		});
	}
	function hideUInfoFunc() {
		document.querySelectorAll(".pil.cl")?.forEach((dt) => {
			if ((dt.getAttribute("lala-done") + "").trim() != "0") {
				dt.style = h0;
				dt.setAttribute("lala-done", "0");
			}
		});
	}
	let avaUI = cont.querySelector("#all_ava");
	window.bava = null;
	avaUI.innerHTML = allIMG;
	cont.querySelectorAll(".la-li input").forEach((it) => {
		let cid = ("" + it.id).trim();
		if (hideDetails && cid == "uinfo") {
			it.checked = hideDetails;
			hideUInfoFunc();
		} else if (autoPgs && cid == "auto_pages") {
			it.checked = autoPgs;
		} else if (isJyMode && cid == "jy_mode_01") {
			it.checked = isJyMode;
			let jyDom = jianyue();
			unsafeWindow.lalajy = function () {
				jianyue();
			};
			if (jyDom != null) {
				let jyRply = jyDom.querySelector("#postlistreply");
				if (jyRply != null) {
					const observer = new MutationObserver((mutationsList) => {
						for (let mutation of mutationsList) {
							if (mutation.type == "childList") {
								try {
									unsafeWindow.lalajy();
									let rpch = jyDom.querySelector("#postlistreply .avatar");
									if (rpch != null) {
										let rpchcs = rpch.nextElementSibling;
										if (rpchcs != null) {
											rpchcs.style = h0;
										}
										rpch = rpch.parentNode;
										while (true) {
											let rpchs = rpch.nextElementSibling;
											if (rpchs != null) {
												rpch = rpchs;
												rpchs.style = h0;
											} else {
												break;
											}
										}
									}
								} catch (e) {}
							}
						}
					});
					observer.observe(jyRply, {
						childList: true,
					});
				}
			}
		} else if (hideStar && cid == "lv") {
			it.checked = hideStar;
			hideStarFunc();
		} else if (hideAva && cid == "ava") {
			it.checked = hideAva;
			hideAvaFunc();
		} else if (hideSign && cid == "usign") {
			it.checked = hideSign;
			hideSignFunc();
		} else if (hideIp && cid == "ip") {
			it.checked = hideIp;
			hideIpFunc();
		} else if (isNotNewWindow && cid == "nowindow") {
			it.checked = isNotNewWindow;
			openUrlWithoutNewWindow();
		} else if (isHideCopy && cid == "lacopy") {
			it.checked = isHideCopy;
			let copy1 = document.querySelector(".ftbg");
			if (copy1 != null) {
				copy1.style.display = "none";
			}
		} else if (isScrollTop && cid == "astui") {
			it.checked = isScrollTop;
		} else if (hideExp && cid == "exp") {
			it.checked = hideExp;
			hideExpFunc();
		} else if (hideAvas && cid == "aforme") {
			it.checked = hideAvas;
			window.bava = document.createElement("p");
			window.bava.className = "md_ctrl";
			window.bava.setAttribute("lala-done", "0");
			let myUrl = sUrl.split(";");
			myUrl.forEach((s0) => {
				let s0u = (s0 + "").trim();
				if (s0u != "") {
					let avico = document.createElement("img");
					avico.src = s0u;
					avico.setAttribute("lala-done", "0");
					window.bava.append(avico);
				}
			});
			avaUI.parentNode.style = "display:block";
			document.querySelectorAll(".pil.cl").forEach((ckme) => {
				let dom0 = ckme.parentNode.querySelector(".authi a");
				if (dom0 != null) {
					let ifMe = dom0.innerHTML.trim();
					if (ifMe == me && me != "") {
						ckme.after(window.bava.cloneNode(true));
					}
				}
			});
		} else if (showFull && cid == "afull") {
			it.checked = showFull;
			// eslint-disable-next-line
			widthauto(document.createElement("div"));
			try {
				// eslint-disable-next-line
				$("css_widthauto").disabled = true;
			} catch (e) {}
			let umPos = document.querySelector("#um div");
			if (umPos != null) {
				umPos.style = "right:0;position:absolute;top:-2px";
			}
			let hdTop = document.querySelector("#hd .wp");
			if (hdTop != null) {
				hdTop.style.marginTop = "40px";
			}
			let menu1 = document.querySelector(".appl .tbn");
			if (menu1 != null) {
				menu1.style.padding = "0 0 0 8px";
				menu1.parentNode.style =
					"transform:translateX(-7px);background-size:cover;margin:0px 0 0 20px;order:1";
			} else {
				let app1 = document.querySelector(".appl");
				if (app1 != null) {
					app1.style = "margin:0 0 0 0;background-size:cover;";
				}
			}
			let topbar1 = document.querySelector("#scbar");
			if (topbar1 != null) {
				topbar1.style =
					"width:auto;background:url(static/image/pcbeta/search_df__.png) bottom/100px";
			}
			let diyPage = document.querySelector("#diypage");
			let sdPtm = document.querySelector(".sd.ptm");
			let tlist = document.querySelector("#threadlist");
			if (tlist != null) {
				tlist.style = "padding:0 0 0 20px;width:100%;box-sizing:border-box";
			}
			let content2 = document.querySelector("#ct");
			let content1 = null;
			if (content2 != null) {
				content2.style =
					"padding:32px 0 0 0;margin:0 auto;justify-content:center;";
				if (
					document.querySelector("#pgt") == null &&
					document.querySelector("#postlist") == null
				) {
					content2.style.display = "flex";
				}
				content1 = content2.querySelector(".mn");
				if (content1 != null) {
					content1.style =
						"box-sizing:border-box;order:2;flex-grow:1;padding:0 0 0 0";
				}
			}
			if (sdPtm != null) {
				sdPtm.style.order = 4;
			}
			let pcd = document.querySelector("#pcd");
			if (pcd != null) {
				content2.style.flexDirection = "column";
				content2.style.alignItems = "center";
				pcd.parentNode.style.marginRight = 0;
				if (content1 != null) {
					content1.style.setProperty("width", "100%", "important");
				}
			}
			let psd = document.querySelector("#psd");
			if (psd != null) {
				psd.style.order = 5;
			}
			let userPtm = document.querySelector(".mn.ptm");
			if (userPtm != null) {
				userPtm.style.paddingLeft = "20px";
			}
			if (diyPage != null) {
				diyPage.style = "display:flex;justify-content:center";
				diyPage.parentNode.style = "justily-content:center;";
			}
			let homePage = document.querySelector("#wp");
			if (homePage != null && location.hostname == "www.pcbeta.com") {
				homePage.style =
					"display:flex;justify-content:center;flex-direction:column;";
			}
			if (location.href.indexOf("ac=usergroup") != -1) {
				let bm0 = document.querySelector(".bm.bw0");
				if (bm0 != null) {
					bm0.style.width = "800px";
				}
			}
		} else if (showFastMsg && cid == "fast_msg_01") {
			it.checked = showFastMsg;
			let fastMsgList = GM_getValue("fastMsgs", "UNSET");
			if (fastMsgList.trim() != "" && fastMsgList != "UNSET") {
				fastMsgText.value = fastMsgList;
				let faster = document.createElement("span");
				let append = document.querySelector("#append_parent");
				if (legacy.checked) {
					setInterval(() => {
						let r1 = document.querySelector("#fwin_content_reply .fpd");
						if (r1 == null) {
							r1 = document.querySelector(".bar");
						}
						if (r1 != null) {
							r1.append(faster);
						}
					}, 500);
				}
				if (append != null) {
					const observer = new MutationObserver((mutationsList) => {
						for (let mutation of mutationsList) {
							if (
								mutation.type == "childList" &&
								document.querySelector(".area textarea") != null
							) {
								setTimeout(() => {
									let r1 = document.querySelector("#fwin_content_reply .fpd");
									if (r1 == null) {
										r1 = document.querySelector(".bar");
									}
									if (r1 != null) {
										r1.append(faster);
									}
									let dragEvtDom = document.querySelector(
										"#fwin_content_upload"
									);
									if (
										dragEvtDom != null &&
										dragEvtDom.className.indexOf("la-copy") == -1
									) {
										dragEvtDom.classList.add("la-copy");
										let laTips = dragEvtDom.querySelector(".c span");
										if (laTips != null) {
											laTips.innerHTML += "<br>(支持鼠标拖放文件)";
										}
										dragEvtDom.addEventListener(
											"dragenter",
											function (e) {
												e.preventDefault();
												e.stopPropagation();
											},
											false
										);
										dragEvtDom.addEventListener(
											"dragleave",
											function (e) {
												dragEvtDom.style = "opacity:1";
												e.preventDefault();
												e.stopPropagation();
											},
											false
										);
										dragEvtDom.addEventListener("dragover", (event) => {
											dragEvtDom.style = "opacity:0.5";
											event.stopPropagation();
											event.preventDefault();
											event.dataTransfer.dropEffect = "copy";
										});
										dragEvtDom.addEventListener("drop", (event) => {
											event.stopPropagation();
											event.preventDefault();
											let fileData = dragEvtDom.querySelector("#filedata");
											if (fileData != null) {
												const files = event.dataTransfer.files;
												fileData.files = files;
												fileData.onchange();
											}
										});
									}
								}, 500);
							}
						}
					});
					observer.observe(append, {
						childList: true,
					});
				}
				faster.innerHTML = "&nbsp;&nbsp;常用语模板";
				faster.style =
					"position:absolute;cursor:pointer;user-select:none;z-index:200";
				faster.onclick = () => {
					let fasterUIGet = faster.parentNode.querySelector("ul");
					if (fasterUIGet != null) {
						if (fasterUIGet.style.display == "block") {
							fasterUIGet.style.display = "none";
						} else {
							fasterUIGet.style.display = "block";
						}
						return;
					}
					let fasterListUI = document.createElement("ul");
					fasterListUI.style =
						"left:" +
						faster.offsetLeft +
						"px;min-width:100px;border-radius:7px;z-index:99999;user-select:none;padding:4px;margin-top:26px;position:absolute;background:#fff;box-shadow:-5px 5px 10px rgba(0, 0, 0, 0.1),5px 5px 10px rgba(0, 0, 0, 0.1),0 5px 10px rgba(0, 0, 0, 0.1);";
					let fastMsgs1 = (fastMsgText.value + "").trim();
					if (fastMsgs1 != "") {
						fasterListUI.innerHTML =
							"<style nonce>.my-hover:hover{color:red;}</style>";
						fastMsgs1.split("\n").forEach((fm) => {
							let fasterListItem = document.createElement("li");
							fasterListItem.innerHTML = fm;
							fasterListItem.className = "my-hover";
							fasterListItem.style =
								"cursor:pointer;font-size:16px;border-bottom:1px solid #ececec;padding: 2px 7px 2px 7px;";
							fasterListItem.onclick = () => {
								let editContent = document.querySelector(".area textarea");
								let editNb = editContent.nextElementSibling;
								if (
									editContent == null ||
									(editNb != null && editNb.nodeName.toLowerCase() == "iframe")
								) {
									try {
										document
											.querySelector("iframe")
											.contentDocument.querySelector("body").innerHTML =
											fasterListItem.innerHTML;
									} catch (e) {
										// eslint-disable-next-line
										showDialog("当前页面不支持常用语");
									}
								}
								if (editContent != null) {
									document.querySelector(".area textarea").value =
										fasterListItem.innerHTML;
								}
								fasterListUI.style.display = "none";
							};
							fasterListUI.append(fasterListItem);
						});
						faster.after(fasterListUI);
					}
				};
			}
			fastMsgUI.removeAttribute("hidden");
			fastMsgUI.addEventListener("input", function (ev) {
				let value0 = ("" + ev.target.value).trim();
				GM_setValue("fastMsgs", value0);
			});
		} else if (showBlockUsers && cid == "block_users_01") {
			it.checked = showBlockUsers;
			let denyList = GM_getValue("denyUsers", "UNSET");
			if (denyList.trim() != "" && denyList != "UNSET") {
				blockUsersText.value = denyList;
				denyList
					.trim()
					.split("\n")
					.forEach((dus) => {
						let dusa = ("" + dus).trim();
						if (dusa != "") {
							denyUsers.push(dusa);
						}
					});
			}
			blockui.removeAttribute("hidden");
			blockUsersText.addEventListener("input", function (ev) {
				let value0 = ("" + ev.target.value).trim();
				GM_setValue("denyUsers", value0);
			});
			document.querySelector("#postlist")?.childNodes.forEach((p) => {
				//添加拉黑按钮
				addBlockBtns(p.id, p);
			});
			if (denyUsers.length > 0) {
				tryBlockUsers();
			}
		}
		it.addEventListener("change", (e) => {
			let isChecked = e.target.checked;
			switch (e.target.id) {
				case "auto_pages":
					GM_setValue("aps", isChecked);
					break;
				case "jy_mode_01":
					GM_setValue("jym", isChecked);
					break;
				case "uinfo":
					GM_setValue("dts", isChecked);
					break;
				case "lv":
					GM_setValue("star", isChecked);
					break;
				case "ava":
					GM_setValue("ava", isChecked);
					break;
				case "usign":
					GM_setValue("hsg", isChecked);
					break;
				case "ip":
					GM_setValue("hip", isChecked);
					break;
				case "exp":
					GM_setValue("exp", isChecked);
					break;
				case "nowindow":
					GM_setValue("unc", isChecked);
					break;
				case "aforme":
					GM_setValue("avas", isChecked);
					avaUI.parentNode.style = isChecked ? "display:block" : h0;
					break;
				case "alegacy":
					GM_setValue("lga", isChecked);
					break;
				case "lacopy":
					GM_setValue("lacopy", isChecked);
					break;
				case "astui":
					GM_setValue("stui", isChecked);
					if (!isChecked) {
						GM_setValue("sl", "NUL");
					}
					break;
				case "afull":
					GM_setValue("full", isChecked);
					// eslint-disable-next-line
					widthauto(document.createElement("div"));
					try {
						// eslint-disable-next-line
						$("css_widthauto").disabled = !isChecked;
					} catch (e) {}
					break;
				case "fast_msg_01":
					GM_setValue("fm", isChecked);
					if (!isChecked) {
						fastMsgUI.setAttribute("hidden", "hidden");
					} else {
						let fastMsgList = GM_getValue("fastMsgs", "UNSET");
						if (fastMsgList.trim() != "" && fastMsgList != "UNSET") {
							fastMsgText.value = fastMsgList;
						}
						fastMsgUI.removeAttribute("hidden");
					}
					break;
				case "block_users_01":
					GM_setValue("bu", isChecked);
					if (!isChecked) {
						blockui.setAttribute("hidden", "hidden");
					} else {
						let denyList = GM_getValue("denyUsers", "UNSET");
						if (denyList.trim() != "" && denyList != "UNSET") {
							blockUsersText.value = denyList;
						}
						blockui.removeAttribute("hidden");
					}
					break;
			}
		});
	});
	cont.querySelector("#la_help").onclick = () => {
		// eslint-disable-next-line
		showDialog(
			"配置修改/拉黑用户需要刷新页面才会生效噢<br><br>如果置顶按钮找不到了，重新启用一下就能找到了<br><br><p>问题反馈/功能建议: <a class='la-blue' target='_blank' href='https://lalaki.cn/rp?v=" +
				FINAL_VERSION +
				"'>请在这里提交</a></p>",
			"notice",
			"提示"
		);
	};
	if (isScrollTop) {
		let scrollTop = document.querySelector("#scrolltop");
		if (scrollTop != null) {
			function scrollBtnFix() {
				let rect = scrollTop.getBoundingClientRect();
				let st0 = rect.left + rect.width;
				let st1 = rect.top + rect.height;
				let mWidth = window.innerWidth;
				let mHeight = window.innerHeight;
				let sData = GM_getValue("sl", "UNSET");
				let hasData = false;
				let sDataSplit = [];
				if (sData.indexOf(";") != -1) {
					sDataSplit = sData.split(";");
					hasData = sDataSplit.length > 1;
				}
				if (st0 > mWidth) {
					scrollTop.style.left = mWidth - 1.5 * rect.width + "px";
				} else if (hasData) {
					let saveLeft = parseInt(sDataSplit[0]) + rect.width;
					if (saveLeft < mWidth) {
						scrollTop.style.left = saveLeft - rect.width + "px";
					}
				}
				if (st1 > mHeight) {
					scrollTop.style.top = mHeight - 1.5 * rect.height + "px";
				} else if (hasData) {
					let saveTop = parseInt(sDataSplit[1]) + rect.height;
					if (saveTop < mHeight) {
						scrollTop.style.top = saveTop - rect.height + "px";
					}
				}
			}
			window.addEventListener("scroll", scrollBtnFix);
			window.addEventListener("resize", scrollBtnFix);
			scrollTop.addEventListener("mousedown", (e) => {
				if (e.button === 0) {
					let rect0 = scrollTop.getBoundingClientRect();
					offsetX = e.clientX - rect0.left;
					offsetY = e.clientY - rect0.top;
					document.addEventListener("mousemove", mouseMoveHandler);
					document.addEventListener("mouseup", mouseUpHandler);
					e.preventDefault();
				}
			});
			scrollTop.style.backgroundImage =
				"url('https://ps.w.org/scroll-top/assets/icon-128x128.png')";
			scrollTop.style.backgroundSize = "contain";
			scrollTop.style.borderRadius = "7px";
			scrollTop.style.zIndex = 9999;
			function mouseMoveHandler(e) {
				let sLeft = `${e.clientX - offsetX}px`;
				let sTop = `${e.clientY - offsetY}px`;
				scrollTop.style.left = sLeft;
				scrollTop.style.top = sTop;
				scrollTop.style.cursor = "move";
				GM_setValue("sl", sLeft + ";" + sTop);
			}
			let sData = GM_getValue("sl", "UNSET");
			if (sData.indexOf(";") != -1) {
				let sDataSplit = sData.split(";");
				if (sDataSplit.length > 1) {
					scrollTop.style.left = sDataSplit[0];
					scrollTop.style.top = sDataSplit[1];
				}
			}
			function mouseUpHandler() {
				scrollTop.style.cursor = "pointer";
				document.removeEventListener("mousemove", mouseMoveHandler);
				document.removeEventListener("mouseup", mouseUpHandler);
			}
		}
	}
	cont.querySelectorAll(".custom_avas").forEach((ca) => {
		ca.onclick = (e0) => {
			let imgUri = e0.target.src;
			let url = GM_getValue("imgurls", "NUL");
			if (e0.target.className.indexOf("la-bg-active") == -1) {
				e0.target.className += " la-bg-active";
				if ((url + "").trim() == "" || url == "NUL") {
					GM_setValue("imgurls", imgUri);
				} else {
					GM_setValue("imgurls", url + ";" + imgUri);
				}
			} else {
				e0.target.classList.remove("la-bg-active");
				if ((url + "").trim() == "" || url == "NUL") {
					return;
				} else {
					let newUri = url.replaceAll(imgUri, "");
					GM_setValue("imgurls", newUri.replaceAll(";;", ";"));
				}
			}
		};
	});
	function createAddFrientDom(url) {
		let fastFriend = document.createElement("a");
		fastFriend.innerHTML = "加好友";
		fastFriend.style = "cursor:pointer;margin:0 0 0 16px";
		fastFriend.onclick = () => {
			let result = new URLSearchParams(url);
			let uid = result.get("touid");
			if (fastFriend.innerHTML != "等待通过") {
				fetch(
					"https://bbs.pcbeta.com/home.php?mod=spacecp&ac=friend&op=add&uid=" +
						uid,
					{
						method: "GET",
						credentials: "include",
					}
				)
					.then(async (res) => ({
						status: res.status,
						buffer: await res.arrayBuffer(),
					}))
					.then(({ status, buffer }) => {
						if (status == 200) {
							let decoder = new TextDecoder("gbk");
							let html = decoder.decode(buffer);
							if (html.indexOf("不存在") == -1) {
								let dom = document.createElement("div");
								dom.innerHTML = html;
								let addForm = dom.querySelector("#addform_" + uid);
								if (addForm != null) {
									let px = addForm.querySelector(".px");
									if (px != null) {
										px.value = "Hello";
									}
									if (addForm != null) {
										fetch(addForm.action, {
											method: "POST",
											body: new FormData(addForm),
										})
											.then(async (res) => ({
												status: res.status,
												buffer: await res.arrayBuffer(),
											}))
											.then(({ status, buffer }) => {
												if (status == 200) {
													fastFriend.innerHTML = "等待通过";
												} else {
													alert("添加失败");
												}
											});
									}
								} else {
									let msg = dom.querySelector("#messagetext p");
									if (msg != null) {
										alert(msg.innerHTML);
									}
								}
							}
						}
					});
			}
		};
		return fastFriend;
	}
	if (location.href.indexOf("viewthread") != -1) {
      document.querySelectorAll(".tip.aimg_tip").forEach((it)=>{it.className+=" la-force-hidden";});
		document.querySelectorAll(".imicn a").forEach((it) => {
			let atext = (it.innerHTML + "").trim();
			if (atext == "发消息") {
				it.after(createAddFrientDom(it.href));
			}
		});
		//回帖工具栏
		const replyToolBar = document.createElement("div");
		document.addEventListener("mousemove", (event) => {
			let mouseX = event.clientX;
         let mouseY = event.clientY;
			let screenWidth = window.innerWidth;
			if (mouseX >= screenWidth - 100) {
				replyToolBar.className = "la-custom-toolbar la-custom-toolbar-show";
			} else {
				replyToolBar.className = "la-custom-toolbar";
			}
		});
		replyToolBar.className = "la-custom-toolbar";
		replyToolBar.style =
			"position:fixed;right:0;background:#333;top:50%;height:0px;z-index:999;flex-direction:column;align-items:center;justify-content:center;color:#f4f4f4;font-size:15px;font-weight:300;user-select:none";
		replyToolBar.innerHTML = `
<div id="la-only-author"></div>
`;
		document.body.append(replyToolBar);
		function getLaP() {
			let pa = document.createElement("div");
			pa.className = "la-p";
			return pa;
		}
		let mainItem = document.querySelector("#postlist table .pti");
		if (mainItem != null) {
			mainItem.querySelectorAll("a").forEach((it) => {
				let pa = getLaP();
				it.style.display = "block";
				pa.append(it);
				replyToolBar.append(pa);
			});
			mainItem.querySelectorAll(".pipe").forEach((it) => {
				it.style = "display:none";
			});
			["前往首页", "前往尾页", "回复本贴", "↑", "↓"].forEach((it) => {
				let pa = getLaP();
				pa.innerHTML = `<a class="la-a-cursor">${it}</a>`;
				if (it == "↑") {
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
						case "前往尾页":
							var lst = document.querySelector(".pg .nxt");
							if (lst != null) {
								location.href = lst.previousSibling.href;
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
			});
		}
	}
	let fsDom = document.querySelector(".bm .mtm .bm_c");
	if (fsDom != null) {
		fsDom.style.marginTop = "20px";
		fsDom.style.display = "flex";
		let fsInput = fsDom.querySelector(".px.vm");
		if (fsInput != null) {
			fsInput.style.flexGrow = 1;
			fsInput.parentNode.style.display = "contents";
			fsInput.style.marginRight = "5px";
		}
	}
	if (autoPgs && location.href.indexOf("viewthread") != -1) {
		if (document.title.indexOf("打卡专用") != -1) {
			try {
				// eslint-disable-next-line
				let hour = parseInt(moment().format("HH"));
				if (hour != 3 && hour != 4 && hour != 5) {
					let rp = document.querySelector("#post_reply");
					if (rp != null) {
						rp.click();
					}
				} else {
					// eslint-disable-next-line
					let latime = moment().format("LT");
					// eslint-disable-next-line
					showDialog(
						`当前时间 ${latime}，还没签到时间噢！<br>晚点再来吧~`,
						null,
						pluginName
					);
				}
			} catch (e) {}
		} else {
			let pages = document.querySelectorAll("#pgt .pgt .pg a");
			if (pages.length != 0 && pages.length < 10) {
				let realPages = [];
				pages.forEach((pg) => {
					if ((pg.className + "").trim() == "") {
						realPages.push(pg.href);
					}
				});
				let index = 0;
				let getIndex = document.querySelector(".pgs .pg strong");
				if (getIndex != null) {
					let testIndex = (getIndex.innerHTML + "").trim();
					let testIndex1 = parseInt(testIndex);
					if (testIndex1 > 0) {
						index = testIndex1 - 1;
					}
				}
				if (index == 0) {
					document
						.querySelectorAll(".pgs .pg")
						.forEach((it) => (it.style = h0));
				}
				window.reading = true;
				window.addEventListener("scroll", async function () {
					const scrollTop =
						window.scrollY || document.documentElement.scrollTop;
					const windowHeight = window.innerHeight;
					const documentHeight = document.documentElement.scrollHeight;
					if (
						scrollTop + windowHeight >= documentHeight - 480 &&
						window.reading
					) {
						if (index == realPages.length) {
							return;
						}
						window.reading = false;
						let url = realPages[index];
						let twoReading = true;
						while (twoReading) {
							let resp = await fetch(url, {
								method: "GET",
								credentials: "include",
							});
							if (resp.ok) {
								twoReading = false;
								index++;
								setTimeout(() => {
									window.reading = true;
								}, 50);
								let decoder = new TextDecoder("gbk");
								const buffer = await resp.arrayBuffer();
								let html = decoder.decode(buffer);
								let dom = document.createElement("div");
								dom.innerHTML = html;
								let postList = dom.querySelector("#postlist");
								postList.querySelectorAll(".showmenu").forEach((it) => {
									if ((it.innerHTML + "").trim() == "使用道具") {
										it.style = h0;
									}
								});
								if (postList != null) {
									let addDom = [];
									postList.childNodes.forEach((ph) => {
										if (("" + ph.id).trim().startsWith("post_")) {
											let insertDom = null;
											let parentDom = document.querySelector("#postlistreply");
											if (parentDom != null) {
												insertDom = parentDom.previousSibling;
											}
											if (insertDom == null) {
												parentDom = document.querySelector("#postlist");
												if (parentDom != null) {
													parentDom.childNodes.forEach((ist) => {
														if ((ist.id + "").startsWith("post_")) {
															insertDom = ist;
														}
													});
												}
											}
											if (insertDom != null) {
												ph.querySelectorAll(".aimg").forEach((it) => {
													let imgSrc = it.getAttribute("file");
													if (it.src.indexOf("none")) {
														it.src = imgSrc;
													}
												});
												insertDom.after(ph);
												addDom.push(ph);
												addBlockBtns(ph.id, ph);
												ph.querySelectorAll(".imicn a").forEach((it) => {
													let atext = (it.innerHTML + "").trim();
													if (atext == "发消息") {
														it.after(createAddFrientDom(it.href));
													}
												});
											}
										}
									});
									if (hideDetails) {
										hideUInfoFunc();
									}
									if (hideStar) {
										hideStarFunc();
									}
									if (hideAva) {
										hideAvaFunc();
									}
									if (hideExp) {
										hideExpFunc();
									}
									if (hideSign) {
										hideSignFunc();
									}
									if (hideIp) {
										hideIpFunc();
									}
									if (hideAvas) {
										addDom.forEach((ph1) => {
											ph1.querySelectorAll(".pil.cl").forEach((ckme) => {
												let dom0 = ckme.parentNode.querySelector(".authi a");
												if (dom0 != null) {
													let ifMe = dom0.innerHTML.trim();
													if (ifMe == me && me != "") {
														ckme.after(window.bava.cloneNode(true));
													}
												}
											});
										});
									}
									if (denyUsers.length > 0) {
										tryBlockUsers();
									}
									if (isNotNewWindow) {
										openUrlWithoutNewWindow();
									}
									if (isJyMode) {
										jianyue();
									}
								}
							}
						}
					}
				});
			}
		}
	}
	if ((location.search + "").indexOf("mod=logging&action=login") != -1) {
		document.querySelectorAll("input").forEach((it) => {
			it.setAttribute("autocomplete", "on");
		});
		document.querySelectorAll("form").forEach((it) => {
			it.setAttribute("autocomplete", "on");
		});
	}
	function setSelectOption(sid, sIndex) {
		let pbf = document.querySelector(sid);
		if (pbf != null) {
			pbf.value = sIndex;
			pbf.onchange();
		}
	}
	if ((location.search + "").endsWith("&op=exchange")) {
		setSelectOption("#tocredits", 2);
		setSelectOption("#fromcredits_0", 1);
	}
	cont.querySelector("#update_tips").removeAttribute("hidden");
	let vers = cont.querySelector(".la-li-item4");
	vers.style =
		"display:flex;justify-content:center;text-indent:0px;padding:7px 0 7px 0;";
	vers.innerHTML = "版本号: v" + FINAL_VERSION;
	// let lastUpdate = GM_getValue("last_update", "0");
	// let currentTime = new Date().getTime();
	// if (currentTime - parseInt(lastUpdate) > 7200000) {
	// 	fetch("https://lalaki.cn/up/")
	// 		.then(async (res) => ({
	// 			status: res.status,
	// 			body: await res.text(),
	// 		}))
	// 		.then(({ status, body }) => {
	// 			if (status == 200) {
	// 				if (body != FINAL_VERSION) {
	// 					vers.innerHTML =
	// 						"检测到新版本，可<a href='https://lalaki.cn/pb' target='_blank'>前往更新</a><div class='la-new-ver'>New</div>";
	// 					shortcut.style.fontWeight = "bolder";
	// 					shortcut.innerHTML += "(1)";
	// 				} else {
	// 					GM_setValue("last_update", currentTime);
	// 				}
	// 			}
	// 		});
	// }
})();
