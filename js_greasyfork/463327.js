// ==UserScript==
// @name         斗鱼全等级弹幕屏蔽
// @namespace    https://www.liebev.site
// @version      1.2
// @description  **项目已弃用**douyu斗鱼，高级弹幕屏蔽，突破30级等级屏蔽限制
// @author       LiebeV
// @license      MIT: Copyright (c) 2023 LiebeV
// @match        https://www.douyu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyu.com
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/463327/%E6%96%97%E9%B1%BC%E5%85%A8%E7%AD%89%E7%BA%A7%E5%BC%B9%E5%B9%95%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/463327/%E6%96%97%E9%B1%BC%E5%85%A8%E7%AD%89%E7%BA%A7%E5%BC%B9%E5%B9%95%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

"use strict";
// **********-------------------**********
// 由于网页弹幕逻辑，会至多产生200个新弹幕dom节点，致使此脚本算法效率低下。故停止更新，推荐用户停止使用此脚本，请关注后续更新新项目发布
// **********-------------------**********


// v1.2，添加了在飘屏区右键弹幕时快速添加id的功能
// 更新计划，添加在右侧弹幕区快速添加id的功能

// let userBannedIds = GM_getValue("bannedIds", []);
// let bannedIds = userBannedIds;
// let dmCache = [];

// //尝试获取弹幕区
// async function getRightList() {
//     // console.log('高级弹幕屏蔽初始化成功');
//     let ulList;
//     let count = 0;
//     while (!ulList && count < 20) {
//         ulList = document.getElementById("js-barrage-list");
//         console.log("尝试获取Right弹幕区...");
//         if (!ulList) {
//             console.log(`失败，等待1秒钟再尝试获取，剩余重试：${20 - count}`);
//             await new Promise((resolve) => setTimeout(resolve, 1000));
//             count++;
//         }
//     }
//     if (!ulList) {
//         console.log("无法获取Right弹幕区，请刷新网页");
//     } else {
//         console.log("已获Right取弹幕区，准备开启rightMO感知");
//         console.log(ulList);
//     }
//     return ulList;
// }

// // 右侧 mutation observer
// async function rightMO() {
//     const ulList = await getRightList();
//     //    console.log('Right感知准备完成');
//     const rightObserver = new MutationObserver(function (mutations) {
//         mutations.forEach(function (mutation) {
//             mutation.addedNodes.forEach(function (righNode) {
//                 if (righNode.nodeName === "LI") {
//                     // console.log('\x1b[32m%s\x1b[0m', 'Right弹幕区感知到新弹幕：');
//                     // console.log(righNode);
//                     rightCheck(righNode);
//                 }
//             });
//         });
//     });
//     const config = { childList: true };
//     rightObserver.observe(ulList, config);
//     console.log("Right感知挂载完成，等待新弹幕...");
// }

// // 检查id，获取发言内容，right2mid
// async function rightCheck(righNode) {
//     const userId = righNode.querySelector("span.Barrage-nickName[title]").getAttribute("title");
//     if (userBannedIds.includes(userId)) {
//         righNode.style.display = "none";
//         const danmu = righNode.querySelector("span.Barrage-content").textContent.trim();
//         // console.log("rightcheck:" + danmu);
//         if (dmCache.includes(danmu)) {
//             const xpath = `//div[contains(text(), "${danmu}")]`;
//             // const midDivElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
//             const snapshotResult = document.evaluate(
//                 xpath,
//                 document,
//                 null,
//                 XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
//                 null
//             );
//             for (let i = 0; i < snapshotResult.snapshotLength; i++) {
//                 const midDivElement = snapshotResult.snapshotItem(i);
//                 midDivElement.parentElement.style.display = "none";
//             }
//         }
//         console.log(`"${userId}" 的发言已被屏蔽!`);
//     }
// }

// // 获取飘屏弹幕区
// async function getMainList() {
//     let divList;
//     let count = 0;
//     // 尝试等待页面加载 20s
//     while (!divList && count < 20) {
//         divList = document.querySelector(".danmu-e7f029");
//         if (!divList) {
//             await new Promise((resolve) => setTimeout(resolve, 1000));
//             count++;
//         }
//     }
//     if (!divList) {
//         console.log("无法获取飘屏弹幕区，请刷新网页");
//     } else {
//         console.log("已获取飘屏弹幕区，准备开启midMO感知");
//         console.log(divList);
//     }
//     return divList;
// }

// // 飘屏mutation observer
// async function midMO() {
//     const middivList = await getMainList();
//     // console.log('mid感知准备完成');
//     const midObserver = new MutationObserver(function (mutations) {
//         mutations.forEach(function (mutation) {
//             mutation.addedNodes.forEach(function (midNode) {
//                 if (midNode.nodeName === "DIV") {
//                     // console.log('\x1b[32m%s\x1b[0m', '飘屏区感知到新弹幕：');
//                     // console.log(midNode);
//                     getMidText(midNode);
//                 }
//             });
//         });
//     });
//     const midConfig = { childList: true };
//     midObserver.observe(middivList, midConfig);
//     console.log("mid感知挂载完成，等待新弹幕...");
// }

// // 获取飘屏区弹幕内容，存入临时数组，等待比对
// async function getMidText(midNode) {
//     const midText = midNode.querySelector("div.text-edf4e7").textContent;
//     // console.log(midText);
//     dmCache.push(midText);
//     // console.log(dmCache);
//     if (dmCache.length > 10) {
//         dmCache.splice(0, dmCache.length);
//     }
// }

// //通过setValue像存储器添加id
// async function addId(userIdInput) {
//     // console.log('addId接收到传入');
//     if (!bannedIds.includes(userIdInput)) {
//         bannedIds.push(userIdInput);
//         console.log(`已添加屏蔽用户： ${userIdInput}`);
//         GM_setValue("bannedIds", bannedIds);
//     } else {
//         const index = bannedIds.indexOf(userIdInput);
//         if (index !== -1) {
//             bannedIds.splice(index, 1);
//             console.log(`已移除屏蔽用户： ${userIdInput}`);
//             GM_setValue("bannedIds", bannedIds);
//         }
//     }
// }

// async function showSettings() {
//     let message = "当前被您屏蔽的用户ID列表：\n";
//     const idList = GM_getValue("bannedIds", []);
//     for (let i = 0; i < idList.length; i++) {
//         message += `${i + 1}. ${idList[i]}\n`;
//     }
//     const userIdInput = prompt(`${message}\n请输入要屏蔽发言的用户id`);
//     if (userIdInput) {
//         console.log("接收到用户id");
//         addId(userIdInput);
//     }
// }

// GM_registerMenuCommand("添加屏蔽用户", showSettings);

// async function menu() {
//     await rightMO();
//     await midMO();
//     await subadd();

//     const container = document.querySelector(".ChatToolBar");
//     const mnq = document.createElement("div");
//     mnq.classList.add("liebevmnq");
//     Object.assign(mnq.style, {
//         display: "inline-block",
//         verticalAlign: "middle",
//         width: "18px",
//         height: "18px",
//         marginRight: "8px",
//     });

//     const inner = document.createElement("div");
//     inner.classList.add("liebevmnqInner");
//     Object.assign(inner.style, {
//         width: "100%",
//         height: "100%",
//     });

//     const btn = document.createElement("div");
//     btn.classList.add("liebevmnqBtn");
//     Object.assign(btn.style, {
//         position: "relative",
//         color: "rgb(255, 255, 255)",
//         background: "rgb(187, 187, 187)",
//         borderRadius: "4px",
//         cursor: "pointer",
//         textAlign: "center",
//         userSelect: "none",
//     });

//     const moniqi = document.createElement("span");
//     moniqi.innerText = "模";

//     container.appendChild(mnq);
//     mnq.appendChild(inner);
//     inner.appendChild(btn);
//     btn.appendChild(moniqi);

//     btn.addEventListener("click", showmenu);
// }

// async function showmenu() {
//     const btn = document.querySelector("div.liebevmnq");
//     const checker = document.querySelector("div.mnqHeader");

//     if (checker) {
//         checker.remove();
//     } else {
//         const commandmenu = document.createElement("div");
//         commandmenu.classList.add("mnqHeader");
//         Object.assign(commandmenu.style, {
//             position: "absolute",
//             left: "-8px",
//             right: "-8px",
//             bottom: "32px",
//             boxShadow: "0 -3px 6px rgba(0,0,0,.1)",
//             border: "1px solid #e5e5e5",
//             borderTopRightRadius: "8px",
//             borderTopLeftRadius: "8px",
//             animation: "slideUp .3s cubic-bezier(.22,.58,.12,.98) forwards",
//             backgroundColor: "#fff",
//         });

//         const head = document.createElement("div");
//         head.classList.add("Header-head");
//         Object.assign(head.style, {
//             height: "45px",
//             lineHeight: "45px",
//             color: "#333",
//             fontSize: "16px",
//             padding: "0 38px 0 16px",
//             backgroundColor: "#f4f4f4",
//             position: "relative",
//             borderTopLeftRadius: "8px",
//             borderTopRightRadius: "8px",
//             userSelect: "none",
//         });
//         head.innerText = "LiebeV房管模拟器";

//         const panel = document.createElement("div");
//         panel.classList.add("mnqPanel");
//         Object.assign(panel.style, {
//             padding: "0 0 0 16px",
//             height: "206px",
//             boxSizing: "border-box",
//             overflowY: 'scroll'
//         });
//         const idList = GM_getValue("bannedIds", []);
//         panel.innerText = `当前被您屏蔽的用户ID列表：\n${idList
//             .map((id, i) => `${i + 1}. ${id}`)
//             .join("\n")}`;

//         const input = document.createElement("div");
//         input.classList.add("mnqinput");
//         Object.assign(input.style, {
//             position: "relative",
//             margin: "0 16px",
//             borderTop: "1px solid #e8e8e8",
//             height: "46px",
//             background: "#fff",
//             lineHeight: "46px",
//         });

//         const textInput = document.createElement("input");
//         textInput.type = "text";
//         textInput.placeholder = "请输入您要屏蔽/移除的用户ID";
//         Object.assign(textInput.style, {
//             width: "80%",
//             height: "100%",
//             border: "none",
//             outline: "none",
//             paddingLeft: "10px",
//             fontSize: "16px",
//         });
//         textInput.addEventListener("keydown", function (event) {
//             if (event.key === "Enter") {
//                 addId(event.target.value);
//                 event.target.value = "";
//             }
//         });

//         btn.appendChild(commandmenu);
//         commandmenu.appendChild(head);
//         commandmenu.appendChild(panel);
//         commandmenu.appendChild(input);
//         input.appendChild(textInput);
//     }
// }

// async function subadd() {
//     document.addEventListener("mouseup", function (event) {
//         if (event.button === 2) {
//             setTimeout(() => {
//                 const sub = document.querySelector(".danmudiv-32f498");
//                 // console.log(sub);
//                 const subbtn = document.createElement("div");
//                 subbtn.classList.add("subaddbtn");
//                 subbtn.innerText = "模--添加id";
//                 Object.assign(subbtn.style, {
//                     margin: "2px 40px",
//                     cursor: "crosshair",
//                     position: "relative",
//                     color: "rgb(255, 255, 255)",
//                     background: "rgb(187, 187, 187)",
//                     borderRadius: "20px",
//                     textAlign: "center",
//                 });
//                 sub.appendChild(subbtn);
//                 let Id = document.querySelector(".danmuAuthor-3d7b4a").innerText;
//                 subbtn.addEventListener("click", function() {
//                     addId(Id);
//                     subbtn.style.backgroundColor = "green";
//                     subbtn.style.border = "2px solid green";
//                     setTimeout(() => {
//                         subbtn.style.backgroundColor = "rgb(187, 187, 187)";
//                         subbtn.style.border = "none";
//                     }, 500);
//                 });
//             }, 100);
//         }
//     });
// }

// (function () {
//     menu();
// })();
