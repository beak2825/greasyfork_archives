// ==UserScript==
// @name         Yuba Fix Desuwa
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  在Yuba Fix的基础上增加功能：在直播间发弹幕时(含+1)句尾添加desuwa/ですわ。
// @match        *://yuba.douyu.com/discussion/6352970*
// @match        *://yuba.douyu.com/discussion/5496243*
// @match        *://yuba.douyu.com/editor?gid=6352970*
// @match        *://yubam.douyu.com/group/6352970*
// @match        *://yubam.douyu.com/group/5496243*
// @match        *://yubam.douyu.com/post/*
// @match        *://www.douyu.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536420/Yuba%20Fix%20Desuwa.user.js
// @updateURL https://update.greasyfork.org/scripts/536420/Yuba%20Fix%20Desuwa.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // ==/鱼吧==
    let IS_YUBA = !location.host.includes('www.douyu.com');
    const settingKey = 'SPAM_FILTER';
    let SPAM_FILTER = GM_getValue(settingKey, false);

    function updateMenu() {
        GM_registerMenuCommand(`过滤“时光列车”帖子【当前：${SPAM_FILTER ? '启用' : '禁用'}】`, () => {
            SPAM_FILTER = !SPAM_FILTER;
            GM_setValue(settingKey, SPAM_FILTER);
            alert(`过滤已${SPAM_FILTER ? '启用' : '禁用'}`);
            location.reload(); // 刷新
        });
    }

    function titlechange() {
        document.title = '玩机器丶Machine的鱼吧-斗鱼社区,直播爱好者的聚集地';
    }

    function loadStyle(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        document.head.appendChild(style);
    }

    // ==/直播间==
    // 弹幕句尾+desuwa功能，并添加相关按钮
    // 部分代码及思路来自DouyuEx

    function init_fullScreenSendor() {
        renderfullScreenSendor();
        renderfullScreenkeySendor();
    }

    function init_BarragePanel_Tip() {
        document.domain = "douyu.com";
        let intID = setInterval(() => {
            let dom1 = document.getElementsByClassName("BackpackButton")[0];
            let dom2 = document.getElementsByClassName("Barrage-main")[0];
            if (!dom1 || !dom2) {
                return;
            }
            setTimeout(() => {
                setBarragePanelTipCallBack();
            }, 1500)
            clearInterval(intID);
        }, 1000);
    }

    function setBarragePanelTipCallBack() {
        let a = new DomHook("#comment-dzjy-container", false, (m) => {
            if (m.length <= 0) {
                return;
            }
            if (m[0].addedNodes.length <= 0) {
                return;
            }
            let dom = m[0].addedNodes[0];
            console.log('BarragePanelDom:' + dom);
            renderBarragePanelTip(dom);
            setBarragePanelTipFunc();
        })
    }

    function renderBarragePanelTip(dom) {
        let a = document.createElement("div");
        a.style.display = "inline-block";
        document.getElementsByClassName("btnscontainer-4e2ed0")[0].insertBefore(a, dom.childNodes[0]);
        document.getElementsByClassName("ChatSend-txt")[0].maxLength = 100;

        a = document.createElement("p");
        a.className = "sugun-e3fbf6";
        a.innerText = "|";
        dom.appendChild(a);

        a = document.createElement("div");
        a.className = "labelfisrt-407af4";
        a.id = "barrage-panel-tip__+2";
        a.innerText = "+1desuwa";
        dom.appendChild(a);

        a = document.createElement("p");
        a.className = "sugun-e3fbf6";
        a.innerText = "|";
        dom.appendChild(a);

        a = document.createElement("div");
        a.className = "labelfisrt-407af4";
        a.id = "barrage-panel-tip__+3";
        a.innerText = "+1ですわ";
        dom.appendChild(a);
    }

    function setBarragePanelTipFunc() {
        document.getElementById("barrage-panel-tip__+2").onclick = () => {
            const dom = document.getElementById("comment-higher-container");
            const danmakulength = document.getElementsByClassName("ChatSend-txt")[0].maxLength;
            if (dom.innerText.endsWith("desuwa")) {
                sendBarrage(dom.innerText);
            } else if (dom.innerText.endsWith("ですわ")) {
                sendBarrage(dom.innerText.replace('ですわ', 'desuwa'));
            } else {
                sendBarrage(dom.innerText.slice(0, (danmakulength - 6)) + 'desuwa');
            }
        };
        document.getElementById("barrage-panel-tip__+3").onclick = () => {
            const dom = document.getElementById("comment-higher-container");
            const danmakulength = document.getElementsByClassName("ChatSend-txt")[0].maxLength;
            if (dom.innerText.endsWith("ですわ")) {
                sendBarrage(dom.innerText);
            } else if (dom.innerText.endsWith("desuwa")) {
                sendBarrage(dom.innerText.replace('desuwa', 'ですわ'));
            } else {
                sendBarrage(dom.innerText.slice(0, (danmakulength - 6)) + 'ですわ');
            }
        };
    }

    async function renderfullScreenSendor() {
        let interval = setInterval(() => {
        if (document.getElementsByClassName("fullScreenSendor-e3061e").length > 0) {

            let dom = document.getElementsByClassName("fullScreenSendor-e3061e")[0];
            let danmakulength = document.getElementsByClassName("ChatSend-txt")[0].maxLength;
            let a = document.createElement("div");
            a.style.display = "inline-block";

            a = document.createElement("p");
            a.className = "sugun-e3fbf6";
            a.innerText = "|";
            dom.appendChild(a);

            a = document.createElement("button");
            a.className = "sendDanmu-592760";
            a.id = "fullScreenSendor__dsw1";
            a.innerText = "+desuwa";
            dom.appendChild(a);
            document.getElementById("fullScreenSendor__dsw1").onclick = () => {
                const dom = document.getElementsByClassName("inputView-2a65aa")[0];
                if (dom.value.trim().length > 0) {
                    if (dom.value.endsWith("desuwa")) {
                        sendBarrageFullScrBot(dom.value);
                    } else if (dom.value.endsWith("ですわ")) {
                        sendBarrageFullScrMid(dom.value.replace('ですわ', 'desuwa'));
                    } else {
                        sendBarrageFullScrBot(dom.value.slice(0, (danmakulength - 6)) + 'desuwa');
                    }
                }
            };

            a = document.createElement("p");
            a.className = "sugun-e3fbf6";
            a.innerText = "|";
            dom.appendChild(a);

            a = document.createElement("button");
            a.className = "sendDanmu-592760";
            a.id = "fullScreenSendor__dsw2";
            a.innerText = "+ですわ";
            dom.appendChild(a);
            document.getElementById("fullScreenSendor__dsw2").onclick = () => {
                const dom = document.getElementsByClassName("inputView-2a65aa")[0];
                if (dom.value.trim().length > 0) {
                    if (dom.value.endsWith("ですわ")) {
                        sendBarrageFullScrBot(dom.value);
                    } else if (dom.value.endsWith("desuwa")) {
                        sendBarrageFullScrBot(dom.value.replace('desuwa', 'ですわ'));
                    } else {
                        sendBarrageFullScrBot(dom.value.slice(0, (danmakulength - 6)) + 'ですわ');
                    }
                }
            };

            clearInterval(interval);
        }
    }, 500);
    }

    function renderfullScreenkeySendor() {
        document.addEventListener('keyup', function(e) {
            if (e.key === 'Enter' && (!document.getElementById("fullScreenSendor__dsw3"))) {
                let dom = document.getElementsByClassName("quickChatBarView-2d0bb1")[0];
                let danmakulength = document.getElementsByClassName("ChatSend-txt")[0].maxLength;
                let a = document.createElement("div");
                a.style.display = "inline-block";

                a = document.createElement("div");
                a.className = "sendDanmu-741305";
                a.id = "fullScreenSendor__dsw3";
                a.innerText = "+desuwa";
                dom.appendChild(a);
                document.getElementById("fullScreenSendor__dsw3").onclick = () => {
                    let dom = document.getElementsByClassName("inputView-1f53d9")[0];
                    if (dom.value.trim().length > 0) {
                        if (dom.value.endsWith("desuwa")) {
                            sendBarrageFullScrMid(dom.value);
                        } else if (dom.value.endsWith("ですわ")) {
                            sendBarrageFullScrMid(dom.value.replace('ですわ', 'desuwa'));
                        } else {
                            sendBarrageFullScrMid(dom.value.slice(0, (danmakulength - 6)) + 'desuwa');
                        }
                    }
                };

                a = document.createElement("div");
                a.className = "sendDanmu-741305";
                a.id = "fullScreenSendor__dsw4";
                a.innerText = "+ですわ";
                dom.appendChild(a);
                document.getElementById("fullScreenSendor__dsw4").onclick = () => {
                    let dom = document.getElementsByClassName("inputView-1f53d9")[0];
                    if (dom.value.trim().length > 0) {
                        if (dom.value.endsWith("ですわ")) {
                            sendBarrageFullScrMid(dom.value);
                        } else if (dom.value.endsWith("desuwa")) {
                            sendBarrageFullScrMid(dom.value.replace('desuwa', 'ですわ'));
                        } else {
                            sendBarrageFullScrMid(dom.value.slice(0, (danmakulength - 6)) + 'ですわ');
                        }
                    }
                };
            }
        });
        document.addEventListener("keydown", function(event) {
            if (event.ctrlKey && event.key === "Enter") {
                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();

                let dom1 = document.getElementsByClassName("inputView-1f53d9")[0];
                let dom2 = document.getElementsByClassName("ChatSend-txt")[0];
                let danmakulength = document.getElementsByClassName("ChatSend-txt")[0].maxLength;

                // 全屏模式下，按下【回车】弹出弹幕输入框，输入弹幕后，按下【Ctrl + 回车】发送带desuwa弹幕
                if (dom1) {
                    if (dom1.value.endsWith("desuwa")) {
                        sendBarrageFullScrMid(dom1.value);
                    } else if (dom1.value.endsWith("ですわ")) {
                        sendBarrageFullScrMid(dom1.value.replace('ですわ', 'desuwa'));
                    } else {
                        sendBarrageFullScrMid(dom1.value.slice(0, (danmakulength - 6)) + 'desuwa');
                    }
                    return;
                }
                // 非全屏模式下，输入弹幕后，按下【Ctrl + 回车】发送带desuwa弹幕
                if (dom2.value.trim().length > 0) {
                    if (dom2.value.endsWith("desuwa")) {
                        sendBarrage(dom2.value);
                    } else if (dom2.value.endsWith("ですわ")) {
                        sendBarrage(dom2.value.replace('ですわ', 'desuwa'));
                    } else {
                        sendBarrage(dom2.value.slice(0, (danmakulength - 6)) + 'desuwa');
                    }
                    return;
                }
            }
        }, true);
    }

    function sendBarrage(text) {
        // 发送弹幕
        document.getElementsByClassName("ChatSend-txt")[0].value = text;
        document.getElementsByClassName("ChatSend-button")[0].click();
    }

    function sendBarrageFullScrMid(text) {
        // 全屏发送弹幕（中部）
        document.getElementsByClassName("inputView-1f53d9")[0].value = text;
        sendBarrage(text);
        document.getElementsByClassName("sendDanmu-741305")[0].click();// 仅用于清理文本框
    }

    function sendBarrageFullScrBot(text) {
        // 全屏发送弹幕（底部）
        document.getElementsByClassName("inputView-2a65aa")[0].value = text;
        sendBarrage(text);
        document.getElementsByClassName("sendDanmu-592760")[0].click();
    }

    class DomHook {
        constructor(selector, isSubtree, callback) {
            this.selector = selector;
            this.isSubtree = isSubtree;
            let targetNode = document.querySelector(this.selector);
            if (targetNode == null) {
                return;
            }
            let observer = new MutationObserver(function(mutations) {
                callback(mutations);
            });
            this.observer = observer;
            this.observer.observe(targetNode, { attributes: true, childList: true, subtree: this.isSubtree });
        }
        closeHook() {
            if (this.observer) {
                this.observer.disconnect();
            }
        }
    }

    if (IS_YUBA) {

        updateMenu();

        const css = `
            .banner__AyafQ { background-color: #FFFFFF !important; object-fit: contain; }
            .groupname__BUzOM { color: #515151 !important; text-shadow: 0 0 0px #ffffff !important; }
            .groupdesc__b8-53 { color: #515151 !important; text-shadow: 0 0 0px #ffffff !important; }
            .OpenApp_wrapper__NNm2Z { display: none !important; }
        `;

        const OLD_GROUP_ID = '6352970';
        const FAKE_GROUP_ID = '5496243';

        const FAKE_API_URL = `https://${location.host}/wbapi/web/group/head?group_id=${FAKE_GROUP_ID}`;
        const FAKE_FEED_API_URL = `https://${location.host}/wgapi/yubanc/api/feed/groupTabFeedList?group_id=${FAKE_GROUP_ID}`;
        const FAKE_API_URL_XHR = `https://${location.host}/wbapi/web/group/head?group_id=${OLD_GROUP_ID}`;
        const PUBLISH_API_URL = `https://${location.host}/wgapi/yubanc/api/feed/publish`;

        const FAKE_RESPONSE = {
            data: {
                group_id: 6352970,
                group_name: "玩机器丶Machine",
                avatar: "https://apic.douyucdn.cn/upload/avatar_v3/201905/badbf01f7ab943358bf78bcd9245305f_big.jpg",
                describe: "玩机器丶Machine的个人鱼吧",
                post_num: 66570000000,
                fans_num: 66570000000,
                anchor_id: 5448527,
                unread: 0,
                is_follow: 1,
                group_level: 18,
                group_exp: 4294967295,
                level_status: 0,
                level_medal: "https://img.douyucdn.cn/data/yuba/admin/2018/10/16/201810161200503920739346639.png?i=2326458f9353bc988e1a27c68175065282",
                level_medal_new: "https://img.douyucdn.cn/data/yuba/weibo/2018/09/20/201809201550332396694137448.png",
                next_level_exp: 300000,
                banner: "https://c-yuba.douyucdn.cn/yubavod/b/peApOkzz5mdl/7ced121e3251a680dfdf402305fd349c.jpg",
                group_title: "鱼吧天尊",
                is_signed: 6657,
                fid: 525,
                f_name: "PC游戏",
                f_describe: "斗鱼PC游戏版块",
                f_avatar: "https://apic.douyucdn.cn/upload/avatar_v3/201905/badbf01f7ab943358bf78bcd9245305f_big.jpg",
                manager_type: 0,
                group_type: 2,
                group_new_type: 2,
                has_starwall: 0,
                rank: 1,
                has_user_rank: 1,
                has_user_rank_reward: 1,
                safe_anchor_id: "W67QgJNpzd0O",
                has_game_comment: 0,
                has_information: 0,
                digest_tags: [],
                cate2_info: { c_template: 0 },
                news_sw: 0,
                hot_sort: false,
                hor_cover: "",
                game_id: 0
            },
            message: "",
            status_code: 200
        };

        const editorRegex = new RegExp(`^/editor(?:[/?#]|$)`);
        const redirectRegexList = [
            [/^\/discussion\/5496243\/posts(?:[/?#]|$)/, `/discussion/${OLD_GROUP_ID}/posts`],
            [/^\/discussion\/5496243\/highlight(?:[/?#]|$)/, `/discussion/${OLD_GROUP_ID}/highlight`],
            [/^\/group\/5496243(?:[/?#]|$)/, `/group/${OLD_GROUP_ID}`],
        ];

        if (editorRegex.test(window.location.pathname + window.location.search)) {
        const query = window.location.search || '';
        const hash = window.location.hash || '';
        window.location.href = `/editor?gid=${FAKE_GROUP_ID}`;
        }
        for (const [regex, target] of redirectRegexList) {
            if (regex.test(location.pathname + location.search)) {
                location.href = target + (location.search || '') + (location.hash || '');
            }
        }

        const originalFetch = unsafeWindow.fetch;
        unsafeWindow.fetch = async function (...args) {
            let [input, init = {}] = args;

            if (typeof input === 'string') {
                input = input.replace(`=${OLD_GROUP_ID}`, `=${FAKE_GROUP_ID}`);
                if (input.includes(FAKE_API_URL)) {
                    return new Response(JSON.stringify(FAKE_RESPONSE), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                if (SPAM_FILTER && input.includes(FAKE_FEED_API_URL)) {
                    const response = await originalFetch(input, init);
                    const json = await response.clone().json();
                    if (json?.data?.feed_list) {
                        json.data.feed_list = json.data.feed_list.filter(item => !item.text?.includes('tm2024'));
                    }
                    return new Response(JSON.stringify(json), {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
                    });
                }

                if (input.includes(PUBLISH_API_URL) &&
                    init.method?.toUpperCase() === 'POST' &&
                    init.headers?.['Content-Type']?.includes('application/x-www-form-urlencoded') &&
                    typeof init.body === 'string') {
                    init.body = init.body.replace(`group_id=${OLD_GROUP_ID}`, `group_id=${FAKE_GROUP_ID}`);
                }

                titlechange();
            }

            return originalFetch.call(this, input, init);
        };

        const originalXHROpen = unsafeWindow.XMLHttpRequest.prototype.open;
        const originalXHRSend = unsafeWindow.XMLHttpRequest.prototype.send;

        unsafeWindow.XMLHttpRequest.prototype.open = function (method, url) {
            this._method = method;
            this._originalUrl = url;
            const fullUrl = 'https://' + location.host + url;
            this._isTarget = fullUrl.includes(FAKE_API_URL_XHR);
            const newUrl = url.replace(`=${OLD_GROUP_ID}`, `=${FAKE_GROUP_ID}`);
            return originalXHROpen.call(this, method, newUrl);
        };

        unsafeWindow.XMLHttpRequest.prototype.send = async function (body) {
            if (this._isTarget) {
                this.addEventListener('readystatechange', () => {
                    if (this.readyState === 4) {
                        Object.defineProperty(this, 'responseText', {
                            get: () => JSON.stringify(FAKE_RESPONSE)
                        });
                        Object.defineProperty(this, 'response', {
                            get: () => JSON.stringify(FAKE_RESPONSE)
                        });
                    }
                });

                if (this._method.toUpperCase() === 'POST' && typeof body === 'string') {
                    body = body.replace(`group_id=${OLD_GROUP_ID}`, `group_id=${FAKE_GROUP_ID}`);
                }

                await new Promise(resolve => setTimeout(resolve, 0));
            }
            return originalXHRSend.call(this, body);
        };

        loadStyle(css);
    } else {
        window.addEventListener('load', () => {
            init_BarragePanel_Tip();
            init_fullScreenSendor();
        });
    }
})();