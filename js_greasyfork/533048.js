// ==UserScript==
// @name         Youtube/Holodex schedule remake for All Vtubers
// @name:ja      Youtube/Holodex, ホロライブ配信スケジュール リメイク
// @namespace    http://tampermonkey.net/
// @version      3.9.7
// @description  You can check recent schedules of Holodex VTubers directly on YouTube
// @description:ja Holodexに掲載されているVTuberたちの配信スケジュールをYouTubeで確認できます
// @author       rewrite by Johann
// @icon         https://www.google.com/s2/favicons?sz=64&domain=holodex.net
// @match        https://www.youtube.com/*
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-end
// @noframes
// @require      https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.1.6/purify.min.js
// @downloadURL https://update.greasyfork.org/scripts/533048/YoutubeHolodex%20schedule%20remake%20for%20All%20Vtubers.user.js
// @updateURL https://update.greasyfork.org/scripts/533048/YoutubeHolodex%20schedule%20remake%20for%20All%20Vtubers.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const VERSION = "3.9.7", APPNAME = "DHLSOY";
    const REFRESH_INTERVAL = 3 * 60 * 1000; // 3 mins
    const ERROR_TIMEOUT = 3000; // 3 secs
    const MAX_STREAM_LENGTH = 12 * 60 * 60 * 1000; // 12 hours
    const log = 0;

    // 想追加的社團 - 請自行去 holodex 查詢正確的團體名稱...
    const Orgs = [
        'VSpo',
        'Varium',
        'Specialite',
        // 自行追加
    ]; //.reverse();

    // 視需求決定兩大社團去留
    let hololive = true;
    let nijisanji = false;

    /* 單頻道請求分多次發送搜索，回應時間會較長，想避免呼喚 holodex toolbar 時影片生成等待時間過長則建議此列填 3 */
    const customRequest = 2; // 自動請求頻道時：只有數個填 1，頻道多個則建議填 2。手動提交以獲取資料時填 3
    const customButton = 0;

    // 依照需求填寫自己想要搜索的頻道 ID
    const myChannels = [
        "UC6oDys1BGgBsIC3WhG1BovQ", // Shizuka Rin
        "UCivwPlOp0ojnMPZj5pNOPPA", // Sophia Valentine
        "UCeLzT-7b2PBcunJplmWtoDg", // Patra Channel
        "UC3xQCiEPSkco54WhuiDcngw", // YOSHIKA⁂Ch.
        "UCfipDDn7wY-C-SoUChgxCQQ", // 葉山舞鈴
        "UCUP8TmlO7NNra88AMqGU_vQ", // 小清水 透
        // 自行追加
    ];

    const storage = {
        schedule: {
            get options() { return catchParseError(() => JSON.parse(localStorage.ht_s_options), null); },
            set options(value) { localStorage.ht_s_options = JSON.stringify(value); },
        },
        archive: {
            get options() { return catchParseError(() => JSON.parse(localStorage.ht_a_options), null); },
            set options(value) { localStorage.ht_a_options = JSON.stringify(value); },
        },
        favorite: {
            get useFilter() { return catchParseError(() => JSON.parse(localStorage.ht_f_useFilter), false); },
            set useFilter(value) { localStorage.ht_f_useFilter = JSON.stringify(value); },
            get channels() {
                var fav = catchParseError(() => JSON.parse(localStorage.ht_f_channels), null);
                return Array.isArray(fav) ? fav : [];
            },
            set channels(value) { localStorage.ht_f_channels = JSON.stringify(value); },
        },
        alarm: {
            get status() { return catchParseError(() => JSON.parse(localStorage.ht_alarm_status), "on"); },
            set status(value) { localStorage.ht_alarm_status = JSON.stringify(value); },
            get vids() { return catchParseError(() => JSON.parse(localStorage.ht_alarm_vids), []); },
            set vids(value) { localStorage.ht_alarm_vids = JSON.stringify(value); },
        }
    }

    const holodex = new Holodex(),
          quickBar = new QuickBar(),
          customView = new CustomViewer();
    var customFilters, favorites = [], myPolicy;


    GM_registerMenuCommand("View Scheduled Streams", () => {
        const vids = storage.alarm.vids;
        const box = Object.assign(document.createElement("div"), {
            style: `
            position:fixed;top:20px;right:20px;z-index:9999;
            background:#111;color:#0f0;border:1px solid #555;
            padding:10px;font-family:monospace;
            overflow:auto;box-shadow:0 2px 10px rgba(0,0,0,0.2);
        `,
            innerHTML: `
            <b>Scheduled Streams</b>
            ${vids.length ? `<ul style="padding-left: 1em; margin: 1em 0;">${vids.map(v => `<li>${v}</li>`).join("")}</ul>` : "no data found!"}
            <button id="clear">Clear All</button>
            <button id="close">Close</button>
        `
        });

        box.querySelector("#clear").onclick = () => {
            storage.alarm.vids = [];
            box.remove();
        };

        box.querySelector("#close").onclick = () => box.remove();
        document.body.appendChild(box);
    });


    GM_registerMenuCommand("Generate & Print Channel Info", () => {
        holodex.getChannels().then(grouped => {
            const outputLines = [];

            for (const org in grouped) {
                const displayOrg = org.split(" ")[0];
                const key = org.split(" ")[0].toLowerCase();
                const ids = grouped[org].map(ch => `    "${ch.id}", // ${ch.name.split(/[\【\(\)（）\[]/)[0]}`); //${ch.inactive ? " (活動休止)" : ""}
                const block = `filters.${key} = new GenFilter("${displayOrg}", [\n${ids.join("\n")}\n]);`;
                outputLines.push(block);
            }

            let outputBox = document.querySelector("#channel-id-output");
            if (!outputBox) {
                outputBox = document.createElement("textarea");
                outputBox.id = "channel-id-output";
                outputBox.readOnly = true;
                outputBox.style.cssText =
                    "position: fixed; bottom: 10px; right: 10px; width: 500px; height: 400px; z-index: 9999;" +
                    "background: #111; color: #0f0; border: 1px solid #555; padding: 10px; font-family: monospace; white-space: pre; overflow: auto;";
                document.body.appendChild(outputBox);

                // 當點擊輸出框外部畫面時移除
                document.addEventListener("click", function handler(e) {
                    if (!outputBox.contains(e.target)) {
                        outputBox.remove();
                        // 移除這個事件監聽器，避免重複處理
                        document.removeEventListener("click", handler);
                    }
                });
            }
            outputBox.value = "如需要讓各別團體的 Vtubers 顯現於初始畫面的 filters.all 列表，\n則請依需求將其貼在 initilizeFilters() 函式之中，filters.outside 之前。\n\n" + outputLines.join("\n\n");
        });
    });

    //   unsafeWindow.holodex = holodex;
    initilize();
    return;

    function initilize() {
        if (!window.DOMPurify || !window.trustedTypes || !window.trustedTypes.createPolicy) {
            setTimeout(initilize, 100);
            return;
        }

        if (document.enabledHololiveSchedule) return;
        document.enabledHololiveSchedule = true;

        myPolicy = window.trustedTypes.createPolicy('DHLSOY', {
            createHTML: (to_escape) => window.DOMPurify.sanitize(to_escape, {
                RETURN_TRUSTED_TYPE: false,
                CUSTOM_ELEMENT_HANDLING: {
                    tagNameCheck: (tagName) => true,
                    attributeNameCheck: (attr) => true,
                    allowCustomizedBuiltInElements: true,
                },
                ADD_ATTR: ["on"],
            }),
            createScriptURL: u => u
        });

        try {
            customFilters = initilizeFilters();
            quickBar.render();
            customView.render();

            holoDrawer();
            setupEventListeners();
            new ResizeObserver(widthChange).observe(document.body);

        } catch(ex) {
            console.log(ex);
        }
    }

    //新增直播抽屜物件
    function holoDrawer() {
        const observer = new MutationObserver(() => {
            const container = document.querySelector('#above-the-fold h1');
            if (container) {
                const button = document.createElement('a');
                button.innerHTML = '直播抽屜';
                button.id = 'holo-drawer';
                button.className = 'style-scope';
                button.style.cssText = 'border: 1px solid var(--yt-spec-outline); cursor: pointer; padding: 6px; position: absolute; right: 0;';
                container.insertAdjacentElement('beforebegin', button);
                button.addEventListener('click', () => toggler("visibility"));
                holodex.get
                // 停止監聽，因為目標元素已經找到
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    //監控視窗物件寬度變量
    function widthChange() {
        let newwidth = document.body.offsetWidth/2 - document.querySelector('#hololive-schedule .tools').offsetWidth/2;
        document.getElementById('hololive-schedule-style').sheet.cssRules[0].style.setProperty('--window-width', newwidth+'px');
    }

    //Rewrite to seamless transition
    function SeamlessTrans() {
        document.querySelectorAll('.hololive-stream:not([target="_blank"])').forEach(function(el) {
            el.addEventListener("click", function(e) {

                if (e.target.closest('.photo')) return;

                e.preventDefault();

                window.scrollTo({ top: 0, behavior: "instant" });

                let videoId;

                if (el.href.includes("watch?v=")) {
                    videoId = new URL(el.href).searchParams.get("v");
                } else {
                    videoId = el.href.split("/").pop();
                }

                // 發送搜尋請求
                function searchVideo(videoId) {
                    let cleanId = videoId.startsWith('-') ? videoId.slice(1) : videoId;
                    let searchQuery = "site:youtube.com " + cleanId; // 透過 videoId 直接搜尋影片
                    let searchUrl = `https://www.youtube.com/results?pbj=1&search_query=${encodeURIComponent(searchQuery)}`;

                    let xmlHttp = new XMLHttpRequest();
                    xmlHttp.onreadystatechange = function () {
                        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                            processSearchResults(xmlHttp.responseText, videoId);
                        }
                    };

                    console.log(unsafeWindow.yt.config_);
                    xmlHttp.open("GET", searchUrl, true);
                    // 使用已存儲的 ytconfig 設置請求頭 GM issue try using unsafewindow
                    xmlHttp.setRequestHeader("x-youtube-client-name", unsafeWindow.yt.config_.INNERTUBE_CONTEXT_CLIENT_NAME);
                    xmlHttp.setRequestHeader("x-youtube-client-version", unsafeWindow.yt.config_.INNERTUBE_CONTEXT_CLIENT_VERSION);
                    xmlHttp.setRequestHeader("x-youtube-client-utc-offset", new Date().getTimezoneOffset() * -1);
                    xmlHttp.setRequestHeader("x-youtube-identity-token", unsafeWindow.yt.config_.ID_TOKEN);

                    xmlHttp.send();
                }

                // 處理搜尋結果
                function processSearchResults(responseText, videoId) {
                    try {
                        console.log("===== 處理搜尋結果開始 =====");
                        //console.log("原始搜尋回應：", responseText);

                        let data = JSON.parse(responseText);
                        console.log("解析後的 JSON 物件：", data);

                        let foundVideoData = null;
                        let isReminderSet = null;
                        searchJson(data, (key, value) => {
                            if (key === "videoRenderer") {
                                //console.log("找到 videoRenderer：", value);
                                if (value.videoId === videoId) {
                                    foundVideoData = value;
                                    isReminderSet = value.upcomingEventData?.isReminderSet;
                                    return true;
                                }
                            }
                            return false;
                        });
                        if (foundVideoData) {
                            console.log("找到符合的影片資料：", foundVideoData);
                            appendHiddenLinkToRelated(foundVideoData, isReminderSet, videoId);
                        } else {
                            console.warn("找不到符合的影片資料，進行替代處理...");
                            const confirm = window.confirm("直播串流銜接失敗，是否要改採跳轉方式移動？");
                            if (confirm) {
                                window.location.href = el.href;
                            }
                        }

                    } catch (error) {
                        console.error("❌ 搜尋處理失敗:", error);
                    }
                }

                // 遞迴搜尋 JSON 結構（保持不變）
                function searchJson(json, func) {
                    for (let key in json) {
                        if (func(key, json[key])) return true;
                        if (json[key] !== null && typeof json[key] === "object") {
                            if (searchJson(json[key], func)) return true;
                        }
                    }
                    return false;
                }

                // 創建 Polymer 元素（與原腳本相同）
                function videoQueuePolymer(videoData, type) {
                    let node = document.createElement(type);
                    node.classList.add("style-scope", "ytd-watch-next-secondary-results-renderer", "script-generated");
                    // node.setAttribute("hidden", "true");
                    node.data = videoData;
                    return node;
                }

                // 修改後的添加隱藏連結至 #related 並模擬點擊
                function appendHiddenLinkToRelated(videoData, reminder, vid) {
                    // 找到 related 區塊
                    let watchRelated = document.querySelector('#related ytd-watch-next-secondary-results-renderer #items ytd-item-section-renderer #contents')
                    || document.querySelector('#related ytd-watch-next-secondary-results-renderer #items');
                    if (!watchRelated) {
                        console.warn("⚠️ 未找到 #related 區塊，無法添加隱藏連結");
                        return false;
                    }

                    // 移除腳本生成的影片卡，避免干擾
                    watchRelated.querySelectorAll("ytd-compact-video-renderer.script-generated").forEach(el => {
                        el.remove();
                    });

                    // 不移除現存的影片卡，將新影片卡插入到第一個位置
                    unsafeWindow.Polymer.dom(watchRelated).insertBefore(
                        videoQueuePolymer(videoData, "ytd-compact-video-renderer"),
                        watchRelated.firstChild
                    );

                    // 加入延遲，讓 Polymer 升級渲染完成後，再模擬點擊影片卡內的連結
                    setTimeout(() => {
                        let createdCard = watchRelated.querySelector("ytd-compact-video-renderer.script-generated");
                        let createdLink = createdCard.querySelector("a");
                        let notifyBt = createdCard.querySelector("button.yt-spec-button-shape-next");
                        let alarm = document.getElementById("notify").getAttribute("alarm");
                        let card = document.querySelector(`a.hololive-stream[href*="${vid}"]`);

                        if (notifyBt && alarm === "on") {
                            if (!reminder) {
                                console.log("🔔 直播尚未開始，點擊接受推播通知...");
                                notifyBt.click();

                                if (card) card.setAttribute("notify", "true");
                                const alarmVids = storage.alarm.vids;
                                if (!alarmVids.includes(vid)) {
                                    alarmVids.push(vid);
                                    storage.alarm.vids = alarmVids;
                                }
                            }
                            else {
                                console.log("🔔 已停止接收推播通知...");
                                notifyBt.click();

                                if (card) card.removeAttribute("notify");
                                const alarmVids = storage.alarm.vids.filter(v => v !== vid);
                                storage.alarm.vids = alarmVids;
                            }
                        } else if (createdLink) {
                            console.log("🛰️ 模擬點擊隱藏連結:", createdLink.href);
                            createdLink.click();
                        } else {
                            console.warn("⚠️ 未找到隱藏連結，無法觸發 SPA 跳轉");
                        }
                    }, 200);

                    return true;
                }

                // 執行影片與內容切換
                searchVideo(videoId);
            });
        });
    }

    //Quickbar Items Addon
    function toggler(action, target) {
        const elements = {
            visibility: document.getElementById('hololive-schedule'),
            addPlaylist: document.querySelector('path[d*="v15.06l-5.42"]')?.closest('button'),
            theaterMode: document.querySelector('.ytp-size-button'),
            backtoTop: document.querySelector('.twfyt-back-to-top-element')
        };

        const element = elements[action] ?? target;

        if (!element) {
            console.warn(`⚠️ 找不到指定的元素: ${action}`);
            if (action === "backtoTop") {
                window.scrollTo({ top: 0, behavior: "instant" });
            }
            return;
        }

        switch (action) {
            case "setAlarm":
                const current = element.getAttribute("alarm") === "on" ? "off" : "on";
                element.setAttribute("alarm", current);
                storage.alarm.status = current;
                break;
            case "refertoDex":
                const refererId = new URL(location.href).searchParams.get("v");
                if (!refererId) return;
                element.href += 'watch/' + refererId;
                break;
            case "visibility":
                element.style.display = (element.style.display !== "none") ? "none" : "";
                break;
            case "addPlaylist":
                setTimeout(() => element.click(), 300);
                break;
            case "theaterMode":
                element.click();
                break;
            case "backtoTop":
                element.click();
                break;
            default:
                console.warn(`⚠️ 未知的操作: ${action}`);
        }
    }

    function setupEventListeners() {
        try {
            // 綁定各個元素的點擊事件，並傳遞對應的 action
            document.getElementById('notify')?.addEventListener('click', ev => toggler("setAlarm", ev.currentTarget));
            document.getElementById('powered')?.addEventListener('click', ev => toggler("refertoDex", ev.currentTarget));
            document.getElementById('addplaylist')?.addEventListener('click', () => toggler("addPlaylist"));
            document.getElementById('theater')?.addEventListener('click', () => toggler("theaterMode"));
            document.getElementById('hide')?.addEventListener('click', () => toggler("visibility"));
            document.getElementById('backtotop')?.addEventListener('click', () => toggler("backtoTop"));
        } catch (ex) {
            console.error("❌ 設置事件監聽器失敗:", ex);
        }
    }

    function catchParseError(func, defaultValue) {
        try {
            return func();
        } catch {
            return defaultValue;
        }
    }

    function toggleFavorite(channel, enable) {
        if (!channel) return false;

        if (enable) {
            if (favorites.indexOf(channel) < 0) {
                favorites.push(channel);
            }
        } else {
            favorites = favorites.filter(f => f != channel);
        }
        storage.favorite.channels = favorites;
    }

    function QuickBar() {
        const self = this;
        const localize = {
            ja: {
                archive: "終了した放送を見る",
                powered: "Holodex",
            },
            en: {
                archive: "View archives",
                powered: "Holodex",
            }
        }
        const t = localize[window.navigator.language] || localize.en;
        this.categoryFilter;
        this.useFavoriteFilter = false;
        this.whitelistFilters = [];

        this.$preview = null;
        this.$previewThumbnail = null;
        this.$previewTitle = null;

        // ui
        this.render = async function () {
            self.categoryFilter = customFilters.all;
            self.whitelistFilters = [self.filterByCategory, self.filterByFavorite];
            self.useFavoriteFilter = storage.favorite.useFilter;

            this.$style = document.createElement("style");
            this.$style.id = "hololive-schedule-style";
            this.$style.innerText = `
#hololive-schedule {
    --color: #212121;
    --background-color: #ffffff;
    --hover-background-color: #ececec;
    --icon-hover-background-color: #d9d9d9;
    --icon-fill: #212121;
    --window-width: 0;
    --background-youtube: #ff0000;
    --background-twitch: #a970ff;
    --background-agqr: #e50065;
    --background-abema: #000000;
    --background-x: #000000;
    --background-mo: gray;
    --border-youtube: var(--background-youtube);
    --border-twitch: var(--background-twitch);
    --border-x: var(--background-x);
}

[dark] #hololive-schedule {
    --color: #ffffff;
    --background-color: #212121;
    --hover-background-color: #404040;
    --icon-hover-background-color: #4c4c4c;
    --icon-fill: #ffffff;
}

#hololive-schedule {
    position: fixed;
    bottom: 0;
    left: 0;
    min-width: 100%;
    min-height: 97px;
    opacity: 0;
    scrollbar-width: none;
    box-sizing: border-box;
    background-color: var(--background-color);
    z-index: 2031; /* drwaer is 2030 */
    transition: opacity .1s linear, height .3s linear;
    pointer-events: none;
}
#hololive-schedule:hover {
    opacity: 1;
    scrollbar-width: none;
}
#hololive-schedule.visible {
    pointer-events: unset;
}
#hololive-schedule #schedule {
    position: relative;
    bottom: 0;
    left: 0;
    min-width: 100%;
    padding: 8px;
    white-space: nowrap;
    scrollbar-width: none;
    box-sizing: border-box;
    overflow-y: hidden;
    overflow-x: scroll;
    background-color: var(--background-color);
    transition: left .2s ease, max-height .5s linear;
}
#hololive-schedule:hover #schedule  {
    scrollbar-width: none;
}
#hololive-schedule #schedule::-webkit-scrollbar {
    display: none;
}
#hololive-schedule #schedule:empty:after {
    display: block;
    content: "Loading ...";
    vertical-align: middle;
}
#hololive-schedule .hololive-stream {
    display: inline-block;
    position: relative;
    border: solid 3px;
    border-radius: 3px;
    font-size: 10px;
    margin: 0 0 0 8px;
}
#hololive-schedule .hololive-stream.hidden {
    display: none;
}
#hololive-schedule .hololive-stream .thumbnail {
    vertical-align: middle;
    width: 128px;
    height: 72px;
    border-radius: 2px;
    background-size: cover;
    background-repeat: 1;
    background-position: center center;
    opacity: 1;
    transition: opacity 0.1s ease;
}
#hololive-schedule .hololive-stream .thumbnail {
}
#hololive-schedule .hololive-stream .title-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    color: #202020;
    background: #fffa;
    z-index: 1;
}
#hololive-schedule .hololive-stream:hover .title {
    /*animation: textAnimation 4s linear infinite;*/
}
#hololive-schedule .hololive-stream .date {
    position: absolute;
    padding: 1px 3px;
    color: #202020;
    background: #fffd;
    font-weight: bold;
    z-index: 1;
}
#hololive-schedule .hololive-stream .photo {
    position: absolute;
    right: -8px;
    top: -8px;
    width: 32px;
    height: 32px;
    border: solid 2px #fff;
    border-radius: 18px;
    z-index: 1;
    background-color: var(--background-color);
    background-size: cover;
    transition: opacity 0.1s ease;
    overflow: hidden;
}
#hololive-schedule {
    a:link, a:visited, a:hover, a:active { color: white; }
}
#hololive-schedule .hololive-stream .photo:after {
    content: "★";
    background: #8888;
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    font-size: 24px;
    text-align: center;
    opacity: 0;
    line-height: 32px;
}
#hololive-schedule .hololive-stream.favorite .photo:after {
    background: #ff08;
}
#hololive-schedule .hololive-stream:hover .photo:after {
    opacity: 1;
}
#hololive-schedule .hololive-stream[stream-status="live"],
#hololive-schedule .hololive-stream[stream-status="live"] .photo {
    border-color: crimson;
}
#hololive-schedule .hololive-stream[stream-status="upcoming"],
#hololive-schedule .hololive-stream[stream-status="upcoming"] .photo {
    border-color: gray;
    filter: brightness(80%) grayscale(0.6);
}
#hololive-schedule .hololive-stream[stream-status="ended"],
#hololive-schedule .hololive-stream[stream-status="ended"] .photo {
    border-color: gray;
}
#hololive-schedule .hololive-stream[platform="twitch"],
#hololive-schedule .hololive-stream[platform="twitch"] .photo {
    border-color: var(--border-twitch);
}
#hololive-schedule .hololive-stream[platform="x"],
#hololive-schedule .hololive-stream[platform="x"] .photo {
    border-color: var(--border-x);
}
#hololive-schedule .hololive-stream.favorite,
#hololive-schedule .hololive-stream.favorite .photo {
    border-color: yellow;
}
/*membersonly*/
#hololive-schedule .hololive-stream[topic="membersonly"] {
    filter: opacity(0.1);
}

/* Singing Topic */
.hololive-stream[topic="singing"] {
  position: relative;
  z-index: 0;
  border: 3px solid transparent !important;
}
.hololive-stream[topic="singing"]::before {
  content: "";
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet, red);
  background-size: 400% 400%;
  z-index: -1;
  animation: animated-border 3s linear infinite;
}
@keyframes animated-border {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* marked stream */
#hololive-schedule .hololive-stream[notify]::after {
    content: "Reminder Set!";
    position: absolute;
    top: 20px;
    left: 0;
    padding: 0 4px;
    color: crimson;
    background: #fffd;
    font-family: fantasy;
}

#hololive-schedule .tools {
    display: block;
    position: absolute;
    height: fit-content;
    top: 0;
    transform: translateY(-100%);
    background-color: var(--background-color);
    color: var(--icon-fill);
    vertical-align: middle;

    transition: opacity .2s linear, width .1s linear;
}
#hololive-schedule .tools {
    left: var(--window-width);
    padding-left: 8px;
    border-radius: 5px 5px 0 0;
}
#hololive-schedule .tools a {
    display: inline-grid;
    padding: 6px 8px;
    cursor: pointer;
    vertical-align: middle;
    fill: var(--icon-fill);
    text-decoration: none;
    text-align: center;
    transition: background .1s linear, padding .1s linear;
}
#hololive-schedule .tools a:last-child {
    border-radius: 0 5px 0 0;
}
#holo-drawer:hover {
    background: var(--yt-spec-10-percent-layer);
}
#hololive-schedule .tools a:hover {
    background: var(--hover-background-color);
}
#hololive-schedule .tools a[clicked] {
    background: var(--hover-background-color);
}
#hololive-schedule .tools #notify[alarm=off] svg {
    fill: none;
}
#hololive-schedule .tools a svg {
    display: inlnie-block;
    height: 14px;
    width: 18px;
}
#hololive-schedule .tools a svg .shape {
    fill: var(--icon-fill);
    transition: fill .1s linear;
}
#hololive-schedule .tools a.favorite[on] {
    color: yellow;
}
#hololive-schedule #contents .contents.hidden {
    display: none;
    width: 0;
}
#hololive-schedule #preview {
    position: fixed;
    bottom: 130px;
    left: 0;
    right: 0;
    text-align: center;
    z-index: 2031;
    pointer-events: none;
    transition: opacity 0.1s ease;
}
#hololive-schedule #preview.hidden {
    opacity: 0;
}
#hololive-schedule #thumbnail-preview {
    display: block;
    position: relative;
    margin: 0 auto;
    width: 512px;
    height: 288px;
    background-size: 100%;
    background-position: center;
    border-radius: 4px;
    z-index: 2031;
    pointer-events: none;
    box-shadow: #000 0px 0px 12px;
    border: solid 5px;
}
#thumbnail-preview[platform]::before {
    display: block;
    position: absolute;
    content: attr(platform);
    white-space: pre;
    color: #fff;
    font-weight: bold;
    padding: 3px 5px;
    border-radius: 1px;
    left: 5px;
    top: 5px;
    z-idnex: 1111111;
    text-align: left;
    text-transform: capitalize;
}
/* live_viewers*/
#thumbnail-preview[livecount]::after {
    display: block;
    position: absolute;
    content: attr(livecount) " 人";
    color: #fff;
    font-weight: bold;
    font-family: auto;
    padding: 3px 5px;
    border-radius: 1px;
    right: 5px;
    top: 5px;
    z-index: 1111111;
    text-transform: capitalize;
    background: rgba(0, 150, 255, 0.9);
}
#thumbnail-preview[platform="youtube"]::before {
    background: var(--background-youtube);
}
#thumbnail-preview[platform="twitch"]::before {
    background: var(--background-twitch);
}
#thumbnail-preview[platform="x"]::before {
    background: var(--background-x);
}
#thumbnail-preview[platform="abema"]::before {
    background: var(--background-abema);
}
#thumbnail-preview[platform="agqr"]::before {
    background: var(--background-agqr);
}
#thumbnail-preview[topic="membersonly"]::before {
    background: var(--background-mo);
    font-weight: 600;
}
#hololive-schedule #thumbnail-preview iframe {
    width: 512px;
    height: 288px;
}
#hololive-schedule #title-preview {
    display: inline-block;
    font-size: 20px;
    padding: 6px 12px;
    border-radius: 4px;
    color: #303030;
    background: #efefef;
    white-space: nowrap;
    margin-top: 8px;
}
#hololive-schedule #thumbnail-preview[stream-status="live"] {
    border-color: crimson;
}
#hololive-schedule #thumbnail-preview[stream-status="upcoming"] {
    border-color: deepskyblue;
}
#hololive-schedule #thumbnail-preview[stream-status="ended"] {
    border-color: gray;
}
#hololive-schedule #thumbnail-preview[platform="twitch"] {
    border-color: var(--border-twitch);
}
#hololive-schedule #thumbnail-preview[platform="x"] {
    border-color: var(--border-x);
}
#hololive-schedule #thumbnail-preview[topic="membersonly"] {
    filter: opacity:(0.5) !important;
    border-color: gray;
}
`;
            document.body.appendChild(this.$style);

            const filters = ["jp", "en", "id", "devis"];

            this.$container = document.createElement("div");
            this.$container.id = "hololive-schedule";
            this.$container.classList.add("visible");
            this.$container.innerHTML = myPolicy.createHTML(`
<div class="tools">
    <a class="filter favorite" ${self.useFavoriteFilter ? "on" : ""}><span>★</span></a>
    <a class="filter" filter="my_ch" ${customRequest === 3 ? 'data-filter="my_ch"' : ''}><span>❤</span></a>
    <a class="filter" filter="all"><span>All</span></a>
    ${nijisanji ? '<a class="filter" filter="nijisanji" title="Nijisanji"><span>NIJ</span></a>' : ''}
    ${filters.map(filter =>
             !hololive ? '' : `<a class="filter" filter="${filter}"><span>${filter.slice(0, 3).toUpperCase()}</span></a>`
    ).join('')}
        ${Orgs.map(filter =>`<a class="filter" filter="${filter.toLowerCase()}" title="${filter}"><span>${filter.slice(0, 3).toUpperCase()}</span></a>`
    ).join('')}
    ${!nijisanji ? '<a class="filter" filter="nijisanji" data-filter="nijisanji" title="Nijisanji"><span>NIJ</span></a>' : ''}
    <a class="filter" filter="outside" title="Collab with outside"><span>CO.</span></a>
    <a id="notify" title="鈴鐺常亮：點擊尚未開始的直播卡片屆時將會推送通知">
        <svg xmlns="http://www.w3.org/2000/svg" stroke="currentColor" width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 2a6 6 0 0 1 6 6v5l1.29 2.58a1 1 0 0 1-.9 1.42H5.61a1 1 0 0 1-.9-1.42L6 13V8a6 6 0 0 1 6-6zm0 20a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2z"/>
        </svg>
    </a>
    <a id="archive" title="${t.archive}">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="28px" height="28px" viewBox="0 0 512 512">
            <path class="shape" d="M464,56v40h-40V56H88v40H48V56H0v400h48v-40h40v40h336v-40h40v40h48V56H464z M88,354.672H48v-64h40V354.672z
		 M88,221.328H48v-64h40V221.328z M308.094,266.047l-101.734,60.734c-0.75,0.438-1.656,0.469-2.406,0.031
		c-0.734-0.422-1.203-1.219-1.203-2.094V264v-60.719c0-0.859,0.469-1.656,1.203-2.094c0.75-0.406,1.656-0.391,2.406,0.031
		l101.734,60.75c0.719,0.406,1.156,1.203,1.156,2.031C309.25,264.844,308.813,265.625,308.094,266.047z M464,354.672h-40v-64h40
		V354.672z M464,221.328h-40v-64h40V221.328z"></path>
        </svg>
    </a>
    <a id="powered" href="https://holodex.net/" target="_blank"><img src="https://holodex.net/img/icons/android-chrome-192x192.png" style="height: 18px; width: 18px"></a>
    ${customButton ?
    '<a id="addplaylist" title="Add to playlist">' +
        '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="height: 18px;">' +
            '<g class="style-scope yt-icon"><path d="M22,13h-4v4h-2v-4h-4v-2h4V7h2v4h4V13z M14,7H2v1h12V7z M2,12h8v-1H2V12z M2,16h8v-1H2V16z"></path></g>' +
        '</svg>' +
    '</a>' +
    '<a id="theater" title="Toggle theater mode">' +
        '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="height: 16px;">' +
            '<g class="style-scope yt-icon"><path d="M10,8l6,4l-6,4V8L10,8z M21,3v18H3V3H21z M20,4H4v16h16V4z"></path></g>' +
        '</svg>' +
    '</a>' +
    '<a id="backtotop" title="Back to top">' +
        '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="height: 16px;">' +
            '<g class="style-scope yt-icon"><path d="M12 8L16 12H8L12 8zM4 19h16V5H4v14z"></path></g>' +
        '</svg>' +
    '</a>' : ''}
    <a id="hide" style="width: 35px; border: 2px #17a2b8; font-weight: 600; font-style: italic; border-style: outset;" title="Hide toolbar">Hide</a>

</div>
<div id="schedule" style="left: 0px;">
</div>
<div id="preview" class="hidden">
    <div id="thumbnail-preview"></div>
    <div id="title-preview"></div>
</div>
`);
            document.body.appendChild(this.$container);


            this.$tools = this.$container.querySelector(".tools");
            this.$schedule = this.$container.querySelector("#schedule");
            this.$preview = this.$container.querySelector("#preview");
            this.$previewTitle = this.$preview.querySelector("#title-preview");
            this.$previewThumbnail = this.$preview.querySelector("#thumbnail-preview");
            this.$allCh = this.$container.querySelector('.filter[filter="all"]');

            // events

            this.$tools.querySelector("#notify").setAttribute("alarm", storage.alarm.status);

            window.addEventListener("wheel", this.updateVisibility);
            this.$container.addEventListener("wheel", this.onScrollContainer, true);

            this.$container.addEventListener("mouseenter", async (ev) => {
                // console.log("mouseenter", ev.target.classList.toString());
                this.updateVisibility();

                if (await this.updateSchedule()) {
                    this.drawSchedule();
                    this.updateAlarmStatus();
                }
            }, false);

            this.$tools.addEventListener("mouseenter", (ev) => {
                self.$preview.classList.add("hidden");
            }, false);
            this.$container.addEventListener("mouseleave", (ev) => {
                this.$preview.classList.add("hidden");
            }, false);

            //this.$tools.addEventListener("mouseenter", self.$preview.classList.add("hidden"), false);
            //this.$container.addEventListener("mouseleave", self.$preview.classList.add("hidden"), false);
            //this.$container.addEventListener("mouseleave", this.close, false);
            this.$container.addEventListener("mouseleave", () => this.close(), false);

            this.updateVisibility();

            this.$container.addEventListener("click", ev => {
                var photo = ev.target.closest(".photo");
                if (!photo) return;

                ev.preventDefault();

                var stream = photo.closest(".hololive-stream");
                var channel = stream.data?.channel?.id;
                if (!channel) return;

                var isFavorite = !stream.classList.contains("favorite");
                toggleFavorite(channel, isFavorite);

                self.$container.querySelectorAll(".hololive-stream").forEach(s => {
                    if (s.data.channel.id == channel) {
                        s.classList.toggle("favorite", isFavorite);
                    }
                });

                self.filter(); //遇到跳回上一個篩選器的衝突，故暫時取消以避免
            });

            // Nijisanji 和 MyChannels 分別採用手動請求
            let hasFetched = Object.fromEntries(["nijisanji", "my_ch"].map(k => [k, false]));
            let fetchedIdsByKey = { nijisanji: [], my_ch: [] };

            this.$container.querySelectorAll('a.filter[data-filter]')?.forEach($a => {
                $a.addEventListener('click', async function () {
                    const key = $a.getAttribute("filter");

                    // 如果已經 fetch 且資料還存在，就不重 fetch
                    const stillExists = fetchedIdsByKey[key]?.length &&
                          fetchedIdsByKey[key].every(id => self.schedule?.some(s => s.id === id));

                    if (hasFetched[key] && stillExists) {
                        self.drawSchedule();
                        return;
                    }

                    let streams = [];

                    if (key === "nijisanji") {
                        streams = await holodex.getLiveForOrg("Nijisanji");
                    }

                    if (key === "my_ch") {
                        streams = await holodex.getLiveForOrg("All Vtubers")
                            .then(list => list.filter(stream => myChannels.includes(stream.channel.id)));
                    }

                    // 記錄本次 fetch 的 stream IDs
                    fetchedIdsByKey[key] = streams.map(s => s.id);
                    hasFetched[key] = true;

                    const existing = self.schedule || [];
                    const existingIds = new Set(existing.map(s => s.id));
                    const combined = [...existing, ...streams.filter(s => !existingIds.has(s.id))];

                    self.schedule = combined;
                    self.drawSchedule();

                    setTimeout(() => { // 等待 DOM 插入完成後再觸發
                        $a.click(); // 觸發原本 filter 機制
                    }, 0);
                });
            });

            this.$container.querySelectorAll(".filter").forEach($f => {
                $f.addEventListener("click", (ev) => {

                    this.$container.querySelectorAll(".filter:not(.favorite)").forEach((fl) => fl.removeAttribute("clicked"));
                    ev.target.closest(".filter:not(.favorite)").setAttribute("clicked", "");

                    const key = $f.getAttribute("filter");
                    const cf = customFilters[key] || new Filter(key, s => {
                        const org = s?.channel?.org;
                        return org && org.toLowerCase() === key.toLowerCase();
                    });
                    if (cf && key) {
                        self.categoryFilter = cf;
                        self.filter();
                        self.resetScheduleScrollPosition?.();
                    } else {
                        self.$container.querySelectorAll(".hololive-stream").forEach(s => {
                            if (s.data && s.data.channel && s.data.channel.org.toLowerCase() === key) {
                                s.classList.remove("hidden");
                            } else {
                                s.classList.add("hidden");
                            }
                        });
                    }
                });
            });

            var fav = this.$container.querySelector(".filter.favorite");
            fav.addEventListener("click", () => {
                self.useFavoriteFilter = fav.toggleAttribute("on");
                self.filter();
                storage.favorite.useFilter = self.useFavoriteFilter;
                self.resetScheduleScrollPosition();
            });

            this.$container.querySelector("#archive").addEventListener("click", this.onOpenCustomView);
        }

        this.drawSchedule = function () {
            // console.log(this.schedule);
            var streams = this.schedule;
            var displayedChannels = new Set(); // 用來存儲已顯示過的頻道 ID

            this.$schedule.innerText = "";
            this.$schedule.style.left = "0px";

            //console.log(streams);
            //console.table(streams.map(stream => ({
            //    channel: JSON.stringify(stream.channel.name), // 轉換成字串
            //    org: stream.channel.org,
            //    type: stream.type,
            //    status: stream.status
            //})));

            streams
            // .filter(data => !(data.status == "upcoming" && new Date().getTime() - new Date(data.available_at).getTime() > 0)) // fix to status bug in holodex
                .filter(data => !(data.status == "live" && new Date().getTime() - new Date(data.available_at).getTime() > MAX_STREAM_LENGTH)) // older
            // 排序：先顯示 status 為 live 的，再依照開始時間排序（也可以根據需求修改排序邏輯）
                .sort((a, b) => {
                if (a.status === "live" && b.status !== "live") {
                    return -1; // a 放前面
                } else if (a.status !== "live" && b.status === "live") {
                    return 1;  // b 放前面
                } else {
                    // 如果狀態相同，可以依照 available_at 或 start time 來排序（例如較早的排在前）
                    return new Date(a.available_at) - new Date(b.available_at);
                }
            })
                .forEach(streamData => {
                // 檢查頻道是否已顯示過
                if (displayedChannels.has(streamData.channel.id)) {
                    return; // 如果該頻道已經顯示過，則跳過
                }
                // 標記頻道已經顯示過
                displayedChannels.add(streamData.channel.id);

                var stream = this.createStream(streamData);
                this.$schedule.appendChild(stream);
            });

            this.filter();
            SeamlessTrans();
        }

        // 枠をつくる
        this.createStream = function (data) {
            // console.log(details);
            var $stream = document.createElement("a");
            $stream.data = data;
            $stream.classList.add("hololive-stream");
            $stream.setAttribute("stream-status", data.status);
            $stream.setAttribute("org", data.channel.org);
            $stream.setAttribute("topic", data.topic_id);

            var start = new Date(data.start_actual || data.start_scheduled);
            var href, platform = "youtube";

            if (data.type == "placeholder") {
                // twitch
                if (data.link && data.link.indexOf("https://twitch.tv/") == 0) {
                    data.thumbnail = data.thumbnail.replace("1920x1080", "426x240");
                    platform = "twitch";
                }
                // twitter
                if (data.thumbnail && data.thumbnail.indexOf("https://pbs.twimg.com/") == 0) {
                    data.thumbnail = data.thumbnail.replace("name=large", "name=small");
                    platform = "x";
                }
                // agqr
                if (data.link && data.link.indexOf("agqr") >= 0) {
                    platform = "radio";
                }
                // abema
                if (data.link && data.link.indexOf("//abema.tv/") > 0) {
                    platform = "abema";
                }

                data.platform = platform;
                href = data.link;
                $stream.target = "_blank";
            } else if (data.type == "stream") {
                data.thumbnail = `https://i.ytimg.com/vi/${data.id}/mqdefault.jpg?${start.getTime()}`;
                href = "/watch/" + data.id;
                // メン限
                if (data.topic_id && data.topic_id.indexOf("membersonly") > -1) {
                    platform = "メン限";
                }
            }

            var time = this.toLiveDate(data.start_actual, data.start_scheduled, data.ended, data.published_at);
            var icon = data.channel.photo.replace("=s800", "=s144");
            data.platform = platform;

            $stream.setAttribute("platform", data.platform);
            $stream.href = href;
            $stream.classList.toggle("favorite", favorites.indexOf(data.channel?.id) >= 0);
            $stream.innerHTML = myPolicy.createHTML(`
<div class="date">${time}</div>
<div class="thumbnail" style="background-image: url('${data.thumbnail}'), url('${data.channel.photo}')"></div>
<div class="title-wrapper"><div class="title">${data.title}</div></div>
<div class="photo" style="background-image: url('${icon}');" />
+`);
            $stream.addEventListener("mouseenter", this.previewStream, false);

            return $stream;
        }

        this.initilizeTwitchAPI = function () {
            var script = document.createElement("script");
            script.src = myPolicy.createScriptURL("https://player.twitch.tv/js/embed/v1.js");
            return new Promise((resolve) => {
                script.addEventListener("load", () => setTimeout(resolve, 50));
                document.querySelector("head").appendChild(script);
            });
        }

        this.initilizeYoutubeAPI = function () {
            var script = document.createElement("script");
            script.src = myPolicy.createScriptURL("https://www.youtube.com/player_api");
            return new Promise((resolve) => {
                script.addEventListener("load", () => setTimeout(resolve, 50));
                document.querySelector("head").appendChild(script);
            });
        }

        this.previewTwitch = function (channel) {
            var player = new Twitch.Player("thumbnail-preview", {
                channel: channel,
                parent: ["www.youtube.com"],
                layout: "video",
                controls: false
            });
            player.addEventListener(Twitch.Player.READY, () => {
                setTimeout(() => {
                    player.setMuted(false);
                }, 200);
            });
            return player;
        }

        this.previewYoutube = function (videoId) {
            var player = new YT.Player("thumbnail-preview-placeholder", {
                videoId: videoId,
                playerVars: {
                    autoplay: 1,
                    enablejsapi: 1,
                    origin: "www.youtube.com",
                    controls: 0, // 0: ユーザー設定の音量が維持されない
                    fs: 0,
                    modestbranding: 0,
                },
                events: {
                    "onReady": function (event) {
                        event.target.setVolume(20); // 設定音量為 25%（範圍 0 ~ 100）
                    }
                }
            });
            return player;
        }

        this.previewStream = async function (ev) {
            self.$previewThumbnail.innerText = "";
            var data = ev.target.data;
            if (data) {
                self.$previewTitle.innerText = data.title;

                // 如果標題沒有頻道名稱，則另行添加
                if ((data.channel.name.match(/([\u4E00-\u9FFF]+|[\u3040-\u309F]+|[\u30A0-\u30FF]+|[A-Za-z]+)/g) || []) // 匹配 channel.name 中的詞（漢字、平假名、片假名、英文字）
                    .filter(word => data.title.includes(word))
                    .join('').length < 4) { // 抓取單字符合數小於一定程度
                    self.$previewTitle.append(`【${data.channel.name}】`);
                }
                self.$previewThumbnail.style.backgroundImage = `url('${data.thumbnail}'), url('${data.channel.photo}')`;
                self.$previewThumbnail.setAttribute("stream-status", data.status);
                self.$previewThumbnail.setAttribute("channel", data.channel.name);
                self.$previewThumbnail.setAttribute("platform", data.platform);
                self.$previewThumbnail.setAttribute("topic", data.topic_id);
                self.$previewThumbnail.setAttribute("livecount", data.live_viewers);

                if (data.live_viewers == "0" || !/\d/.test(data.live_viewers)) {
                    self.$previewThumbnail.removeAttribute("livecount");
                }

                var mainVideo = document.querySelector("video");
                if (data.topic_id == "membersonly") {
                    // do noting
                }
                // youtube
                else if (data.type == "stream" && data.status == "live") {
                    /* 決定是否在首頁載入預覽的播放器框架 */
                   // if (mainVideo && mainVideo.played && mainVideo.played.length > 0) {
                        if (typeof YT == "undefined") {
                            await self.initilizeYoutubeAPI();
                        }
                        self.$previewThumbnail.innerHTML = myPolicy.createHTML(`<div id="thumbnail-preview-placeholder"></div>`);
                        self.previewYoutube(data.id);
                   // }
                }
                // twitch
                else if (data.status == "live" && data.link && data.link.indexOf("https://twitch.tv/") == 0) {
                    var channel = data.link.split("/").slice(-1)[0];
                    if (typeof Twitch == "undefined") {
                        await self.initilizeTwitchAPI();
                    }
                    self.previewTwitch(channel);
                }
            }

            self.$preview.classList.toggle("hidden", !data);
        }

        // 標記推送通知頻道與清除
        this.updateAlarmStatus = function () {
            const existingVids = new Set();
            this.$schedule.querySelectorAll(".hololive-stream").forEach(s => {
                const href = s.getAttribute('href') || '';
                const match = href.match(/\/watch\/([a-zA-Z0-9_-]{11})/);
                const vid = match?.[1];
                if (!vid) return;

                existingVids.add(vid);

                const vids = storage.alarm.vids;
                const index = vids.indexOf(vid);

                if (index !== -1) {
                    const status = s.getAttribute("stream-status");
                    if (status === "live") {
                        s.removeAttribute("notify");
                        vids.splice(index, 1);
                        storage.alarm.vids = vids;
                    } else {
                        s.setAttribute("notify", "true");
                    }
                }
            });

            // 冗餘數據清除機制
            const updatedVids = storage.alarm.vids.filter(v => existingVids.has(v));
            if (updatedVids.length !== storage.alarm.vids.length) {
                console.log(`移除已過期的直播串流數據:`, storage.alarm.vids.filter(v => !existingVids.has(v)));
                storage.alarm.vids = updatedVids;
            }
        }

        // フルスクリーンのときは表示しない theater mods only
        this.updateVisibility = function () {
            var isFullscreen = document.querySelector("ytd-watch-flexy[fullscreen]");
            var isTheater = document.querySelector("ytd-watch-flexy[theater]");
            var html = document.querySelector("html");
            var app = document.querySelector("ytd-app");
            var isScrolled = ((app && app.scrollTop) || html.scrollTop || html.scrollY || window.scrollY || window.scrollTop || document.body.scrollY || document.body.scrollTop) > 50;
            // self.$container.classList.toggle("visible", (!isFullscreen && !isTheater) || isScrolled);
            // self.$container.classList.toggle("visible", (!isFullscreen) || (isFullscreen && isScrolled));
            self.$container.classList.toggle("visible", isScrolled);
        }

        this.filter = function () {
            this.$container.querySelectorAll(".hololive-stream").forEach(e => {
                var isDisplay = true;
                for (var i = 0; i < self.whitelistFilters.length; i++) {
                    isDisplay &= self.whitelistFilters[i](e.data);
                }
                e.classList.toggle("hidden", !isDisplay);
            });
        }

        this.resetScheduleScrollPosition = function () {
            this.$schedule.style.left = 0;
        }

        this.filterByCategory = function(data) {
            if (!self.categoryFilter) return false;
            return self.categoryFilter.match(data);
        }

        this.filterByFavorite = function (data) {
            if (!self.useFavoriteFilter) return true;
            return customFilters.favorite.match(data);
        }

        // data
        this.isRefresing = false;
        this.schedule = [];
        this.lastUpdated = 0;

        this.updateSchedule = async function (force) {
            // console.log(`refreshList(${force})`);

            try {
                if (this.isRefreshing) return false;
                this.isRefreshing = true;

                // 十分に新しい、HoloDexから更新の必要はない
                if (!force && Date.now() - this.lastUpdated < REFRESH_INTERVAL) {
                    return false;
                }

                var response = await holodex.getLive().catch(ex => {
                    console.log("cache", ex);
                });

                if (!response) return false;

                if (Array.isArray(response)) {
                    this.lastUpdated = Date.now();
                    this.schedule = response;

                    return response;
                }

                return false;
            } catch (ex) {
                console.log(ex);
            } finally {
                this.setTimeoutToRefresh();
            }
        }

        this.setTimeoutToRefresh = function () {
            setTimeout(() => {
                this.isRefreshing = false;
            }, ERROR_TIMEOUT);
        }

        // utils
        this.toLiveDate = function(schedule, start, end, publish) {
            // console.log(schedule, start, end, publish);

            if (end) {
                const diff = new Date(end).getTime() - new Date(start).getTime();
                const dm = Math.floor(diff / 1000 / 60 % 60);
                const dh = Math.floor(diff / 1000 / 60 / 60);

                var span = "";
                if (dh > 0) {
                    span += dh + "h ";
                }
                span += dm + "m";

                return span;
            }

            start = new Date(start || schedule || publish);
            const h = ("0" + start.getHours()).slice(-2);
            const m = ("0" + start.getMinutes()).slice(-2);
            const now = new Date();
            const nh = now.getHours() % 12 || 12;
            const nm = now.getMinutes();

            const diff = Math.floor((now - start) / (1000 * 60 * 60)); // 直接計算小時差

            if (start.getDate() != new Date().getDate()) {
                return `${start.getDate()+'日'}-${h}:${m}(${diff}h)`;
            } else {
                return `${h}:${m}(${diff}h)`;
            }
        }

        // handler

        this.onScrollContainer = function (ev) {
            // console.log(ev);

            ev.preventDefault();
            ev.stopPropagation();
            ev.stopImmediatePropagation();

            // console.log("on wheel", ev, document.querySelector("#hololive-schedule").clientWidth, document.documentElement.clientWidth, container.style.left);

            const lp = parseFloat(self.$schedule.style.left) || 0,
                  dw = document.documentElement.clientWidth,
                  cw = self.$schedule.clientWidth;

            // console.log (contents, lp, dw, cw);

            if (ev.deltaY > 0) {
                self.$schedule.style.left = Math.max(lp - dw / 5, - cw + dw) + "px";
            } else if (ev.deltaY < 0) {
                self.$schedule.style.left = Math.min(lp + dw / 5, 0) + "px";
            } else {
                self.$schedule.style.left = - cw + dw;
            }

            return false;
        }

        this.onOpenCustomView = function (ev) {
            customView.open();
        }

        this.close = function() {
            self.$preview.classList.add("hidden");
            self.$previewThumbnail.innerText = ""; // stop iframe preview
        }
    }

    function CustomViewer() {
        const localize = {
            ja: {
                next: "NEXT",
                filter: {
                    favorite: "お気に入り",
                    lives: "配信中を含める",
                    all: "ALL",
                    jp: "ホロライブ",
                    en: "ホロライブ EN",
                    id: "ホロライブ ID",
                    devis: "DEV_IS",
                    stars: "ホロスターズ",
                    stars_en: "ホロスターズ EN",
                    outside: "外部コラボ",
                    video: "動画",
                    singing: "歌枠",
                    talk: "雑談",
                    recommend: "注目",
                    pvp: "対戦ゲーム",
                    rpg: "RPG",
                    coop: "ローカル対戦/協力",
                    horror: "ホラー",
                    membersonly: "メンバー限定",
                },
                topic: {
                    membersonly: "メン限",
                    totsu: "凸待ち",
                    talk: "雑談",
                    original_song: "オリジナルソング",
                    music_cover: "歌ってみた",
                    dancing: "踊ってみた",
                    drawing: "お絵かき",
                    morning: "朝活",
                    singing: "歌枠",
                    celebration: "記念枠",
                    marshmallow: "マシュマロ",
                    shorts: "ショート動画",
                    superchat_reading: "スパチャ読み",
                    anniversary: "周年記念",
                    endurance: "耐久",
                    announce: "お知らせ",
                    watchalong: "同時視聴",
                    clubhouse51: "アソビ大全51",
                    outfit_reveal: "新衣装",
                    debut_stream: "初配信",
                    camera_stream: "カメラ配信",
                }
            },
            en: {
                next: "NEXT",
                filter: {
                    favorite: "Favorite",
                    lives: "Include lives",
                    all: "ALL",
                    jp: "Hololive JP",
                    en: "Hololive EN",
                    id: "Hololive ID",
                    devis: "DEV_IS",
                    stars: "Holostars",
                    stars_en: "Holostars EN",
                    outside: "Collabo with outside",
                    video: "Video",
                    singing: "Singing",
                    talk: "Talk",
                    recommend: "Recommend",
                    pvp: "PvP",
                    rpg: "RPG",
                    coop: "Co-op",
                    horror: "Horror",
                    membersonly: "Members Only"
                },
                topic: {}
            },
        };

        const t = localize[window.navigator.language] || localize.en;
        var self = this;

        // ui

        this.render = function () {
            this.config = Object.assign({
                lives: false,
                favorite: false,
            }, storage.archive.options);

            this.$style = document.createElement("style");
            this.$style.id = "hololive-custom-style";
            this.$style.innerText = `
#hololive-custom-viewer {
    --custom-viewer-background: #fff;

    --custom-viewer-items-background: #fff;
    --custom-viewer-items-caption-color: #212121;
    --custom-viewer-items-caption-hover-text-shadow: #464ea7a8;

    --custom-viewer-items-info-color: #202020;
    --custom-viewer-items-info-background: #fffd;

    --custom-viewer-filter-color: #202020;
    --custom-viewer-filter-hover-background: #bfbfbf;
    --custom-viewer-filter-enabled-fill: gold;

    --custom-viewer-slim-filter-background: #cfcfcf;
    --custom-viewer-slim-filter-hover-background: #bfbfbf;

    --custom-viewer-filter-recommend-color: #000;
    --custom-viewer-filter-recommend-background: gold;

    --custom-viewer-next-color: #202020;
    --custom-viewer-next-background: #cfcfcf;
    --custom-viewer-next-hover-background: #bfbfbf;
}
[dark] #hololive-custom-viewer {
    --custom-viewer-background: #000;

    --custom-viewer-items-background: #000;
    --custom-viewer-items-caption-color: #ececec;
    --custom-viewer-items-caption-hover-text-shadow: #fff;

    --custom-viewer-items-info-color: #fff;
    --custom-viewer-items-info-background: #202020dd;

    --custom-viewer-filter-color: #ececec;
    --custom-viewer-filter-hover-background: #404040;
    --custom-viewer-filter-enabled-fill: gold;

    --custom-viewer-slim-filter-background: #202020;
    --custom-viewer-slim-filter-hover-background: #404040;

    --custom-viewer-filter-recommend-color: #000;
    --custom-viewer-filter-recommend-background: gold;

    --custom-viewer-next-color: #ececec;
    --custom-viewer-next-background: #202020;
    --custom-viewer-next-hover-background: #404040;
}
#hololive-custom-viewer {
    display: flex;
    position: fixed;
    justify-content: center;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    background: var(--custom-viewer-items-background);
    z-index: 3000;
    padding: 30px;
    transitioin: opacity 0.1s linear;
}
#hololive-custom-viewer.hidden {
    opacity: 0;
    display: none;
}
#hololive-custom-viewer #sub {
    width: 200px;
    overflow-y: scroll;
    scrollbar-width: none;
    box-sizing: border-box;
}
#hololive-custom-viewer #main {
    overflow-y: scroll;
    scrollbar-width: none;
    margin: 10px 0;
    padding: 20px;
    width: calc(min(100%,1280px));
    text-align: left;
    box-sizing: border-box;
}
#hololive-custom-viewer #sub::-webkit-scrollbar,
#hololive-custom-viewer #sub::-webkit-scrollbar-thumb,
#hololive-custom-viewer #main::-webkit-scrollbar,
#hololive-custom-viewer #main::-webkit-scrollbar-thumb {
    display: none;
}
#hololive-custom-viewer .hololive-stream {
    display: inline-block;
    position: relative;
    font-size: 10px;
    border-radius: 5px;
    margin: 0 0 16px 8px;
    width: 192px;
    vertical-align: top;
    text-decoration: none;
    color: #acacac;
    overflow: hidden;
}
#hololive-custom-viewer .hololive-stream.hidden {
    display: none;
}
#hololive-custom-viewer .hololive-stream .thumbnail {
    position: relative;
    vertical-align: middle;
    width: 192px;
    height: 108px;
    box-sizing: border-box;
    border-radius: 3px;
    background-size: 100%;
    background-repeat: 1;
    background-position: center center;
    transition: background-size 0.15s ease-in-out;
}
#hololive-custom-viewer .hololive-stream:hover .thumbnail {
    background-size: 108%;
}
#hololive-custom-viewer .hololive-stream .title-wrapper {
    color: var(--custom-viewer-items-caption-color);
    margin: 0.5rem;
    font-size: 1.5rem;
    line-height: 1.75rem;
    height: 5.25rem;
    word-break: break-all;
    overflow: hidden;
    transition: text-shadow 0.15s ease-in-out;
}
#hololive-custom-viewer .hololive-stream:hover .title-wrapper {
    text-shadow: 0px 0px 2px var(--custom-viewer-items-caption-hover-text-shadow);
}

#hololive-custom-viewer .hololive-stream .date,
#hololive-custom-viewer .hololive-stream .start,
#hololive-custom-viewer .hololive-stream .topic {
    position: absolute;
    padding: 1px 5px;
    left: 3px;
    border-radius: 2px;
    color: var(--custom-viewer-items-info-color);
    background: var(--custom-viewer-items-info-background);
    z-index: 1;
    letter-spacing: .025em;
    white-space: nowrap;
    overflow: hidden;
    transition: opacity 0.1s linear;
}

#hololive-custom-viewer .hololive-stream:hover .date,
#hololive-custom-viewer .hololive-stream:hover .start,
#hololive-custom-viewer .hololive-stream:hover .topic {
    opacity: 0;
}
#hololive-custom-viewer .hololive-stream .date {
    top: 2px;
    font-size: 10px;
}
#hololive-custom-viewer .hololive-stream[stream-status=live] .date {
    background: #f00c;
}
#hololive-custom-viewer .hololive-stream .start {
   bottom: 2px;
   left: unset;
   right: 3px;
}
#hololive-custom-viewer .hololive-stream .topic {
    font-size: 12px;
    bottom: 2px;
    text-transform: capitalize;
}
#hololive-custom-viewer .hololive-stream .title {
    display: inline;
}
#hololive-custom-viewer .hololive-stream .name {
    display: inline;
    vertical-align: middle;
    margin-left: 6px;
    font-size: 9px;
    opacity: 0.7;
}
#hololive-custom-viewer .hololive-stream .photo {
    position: absolute;
    right: -12px;
    top: -12px;
    width: 48px;
    height: 48px;
    border-radius: 24px;
    background-size: cover;
    transition: transform 0.15s ease-in-out, opacity 0.15s ease-in-out;
}
#hololive-custom-viewer .hololive-stream:hover .photo {
    transform: scale(0) translate(10px, -10px);
    opacity: 0;
}
#hololive-custom-viewer .hololive-stream .site {
    position: absolute;
    right: 3px;
    bottom: 3px;
    width: 24px;
    height: 24px;
    background-size: 100%;
    transition: opacity 0.1s ease-in-out;
}
#hololive-custom-viewer .hololive-stream .site.twitch {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAETSURBVHgB7ZU7DoJAEIb/JV7MBq/hCVROIJ7AqI2t0d5WsTF2dhzBI1hbsLIYwyPADgzrFvI1PJbk+5lZBoEaNq6cR4APA0wDIdTRgQV5lgGI8skZnbAe5a8ditwkjk15LoANeS5AW7nqabGvdfcrA9iiD9AHsB5gACZVI5o6uv+rBbct7AW4H4Dw+DmPp+7ipwGU/L5P5V4g/O8aexM2kkusvEsqVxitQOHNd7F8VnyGXIHiny37mWVFZSTyQIzL1tgV0MljQrwwq1pkBaDIoxeG3lU80XUAgvyhk/MC6OSOXs4KoJWfxIPysACRlSslV1YGpwIhV65oOwlDygYzEqBuqLShUQuSWd6hvBFLV/owwBuAI3t8NBey8QAAAABJRU5ErkJggg==');
}
#hololive-custom-viewer .hololive-stream .site.x {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJkSURBVHgB7VZBbtpQEH3zIW0WVYuXVaH4Bs0NSk4AOUFhEarskhMknIDsqkKlcIT0BNAT1D1B3ZJK3dmVuirwp/MhVmzAxiagKBJv9+ePZ97M/JkxsMMODwzChlD84FWQp3MxeCDHAhiumB+MJrr1+8Ryw3p/9+H4DctfIPCq49Xlw8Kv99YlMuB19885gy/i7llziwGfFFWJyR02XzSCuwiBUse7BlFVaz5LS8KQVkRXaXRJsqImfDjKSZBNyzEyFWFKVJ4KFbWLElUao6KbSk8i9TXgTPaorxTskPwOxa7/9baGt4zg8oQbNyfWYJlRU0/KUx9ZwNwYNq1ecFRzl18QpW0bB0Ks//KjV1uwlbuLJA3GxEdh5wb5yGEPl3qMd2xecYQHKnlFlVLX95kxYCFKGg5IlU2a0uLpCM68LEJA+sJ/Dm6Jy3aMjQIRakRUm+UuvfOp/X34iQSejeFo0Hdx4optG5uFH/R+GHNvANcm3VtwLs+Lvy2TRwhIOnrYHhysIuDKcCDwGbYAjglOzQt+HssElF6dvoNNOZeuCSbfSgIGMjILMo4/ExZf7TqghNLmlwm1gpSC2tmaLAZMvWGz0Iu7XpqBm2NrQNN5cD+Y5ZOTdZyok3RZMusZOJUN+QZrQFb0oQkG6xIIYHe8A03Unx/Ryd6jS2ctAsbxmFRVynGKlM5na5ePVkUe0p+h9MmraS2zXqYgmSWjOPtElHbLTVB3Q79gqQlMScxqXpeav0UWiGMmXKSNOpZAAPvKs/U/1MRoxRxl+5WD+psUy2D5IdmRVoWjnqDnLlkyO+zwaPAf1zXwZL751PUAAAAASUVORK5CYII=');
}
#hololive-custom-viewer .hololive-stream:hover .site {
    opacity: 0;
}
#hololive-custom-viewer .button {
    display: block;
    font-size: 14px;
    width: 100%;
    padding: 8px 16px;
    cursor: pointer;
    maring: 0;
    color: var(--custom-viewer-filter-color);
    background: var(--custom-viewer-background);
    border-radius: 3px;
    box-sizing: border-box;
    transition: background 0.1s linear, padding 0.1s ease-in-out;
}
#hololive-custom-viewer .button svg {
    fill: var(--custom-viewer-filter-color);
    vertical-align: middle;
}
#hololive-custom-viewer .button.enabled svg {
    fill: var(--custom-viewer-filter-enabled-fill);
}
#hololive-custom-viewer .button span {
    padding-left: 8px;
}
#hololive-custom-viewer .button:hover {
    background: var(--custom-viewer-filter-hover-background);
    padding-left: 24px;
}
#hololive-custom-viewer .button.filter[filter=recommend],
    #hololive-custom-viewer .button.reload {
        color: var(--custom-viewer-filter-recommend-color);
        background: var(--custom-viewer-filter-recommend-background);
    }
#hololive-custom-viewer .button.reload svg {
    fill: var(--custom-viewer-filter-recommend-color);
}
#hololive-custom-viewer .button.filter[filter=recommend]:hover,
    #hololive-custom-viewer .button.reload:hover {
        background: var(--custom-viewer-filter-recommend-background);
    }
#hololive-custom-viewer .button.filter[count]::after {
    display: inline-block;
    content: attr(count);
    font-weight: bold;
    margin-left: 12px;
}
#hololive-custom-viewer .button.filter[count][clicked] {
   background: var(--custom-viewer-filter-hover-background);
   color: #fff;
}
#hololive-custom-viewer .button.hidden {
    display: none;
}
#hololive-custom-viewer .child {
    padding-left: 8px;
}
#hololive-custom-viewer #next {
    display: block;
    font-size: 16px;
    color: #efefef;
    text-align: center;
    margin-top: 20px;
    padding: 16px;
    cursor: pointer;
    color: var(--custom-viewer-next-color);
    background: var(--custom-viewer-next-background);
    padding: 16px;
    border-radius: 3px;
    transition: background 0.1s linear;
}
#hololive-custom-viewer #next.hidden {
    opacity: 0;
}
#hololive-custom-viewer #next:hover {
    background: var(--custom-viewer-next-hover-background);
}
/* slim style */
@media screen and (max-width: 1600px) {
    #hololive-custom-viewer {
        flex-direction: column;
        justify-content: start;
    }
    #hololive-custom-viewer #sub {
        width: calc(min(100%,1280px));
        overflow-y: unset;
        margin: 0 auto;
    }
    #hololive-custom-viewer #main {
        max-width: calc(min(100%,1280px));
        text-align: center;
        margin: 10px auto;
    }
    #hololive-custom-viewer .child {
        padding-left: 0;
        display: inline;
    }
    #hololive-custom-viewer .button {
        display: inline-block;
        padding: 6px 16px;
        width: unset;
        margin: 0 6px 6px 0;
        line-height: 1.5;
        border-radius: 20px;
        background: var(--custom-viewer-slim-filter-background);
    }
    #hololive-custom-viewer .button:hover {
        background: var(--custom-viewer-slim-filter-hover-background);
        padding-left: 16px;
    }
}

`;
            document.body.appendChild(this.$style);

            this.$container = document.createElement("div");
            this.$container.id = "hololive-custom-viewer";
            this.$container.classList.add("hidden");
            this.$container.innerHTML = myPolicy.createHTML(`
                <div id="sub">
                    <!--
                    <a class="button filter no-count ${this.config.favorite ? "enabled" : ""}" filter="favorite">
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="14px" height="14px" viewBox="0 0 512 512">
                            <path class="shape" d="M473.984,74.248c-50.688-50.703-132.875-50.703-183.563,0c-17.563,17.547-29.031,38.891-34.438,61.391
c-5.375-22.5-16.844-43.844-34.406-61.391c-50.688-50.703-132.875-50.703-183.563,0c-50.688,50.688-50.688,132.875,0,183.547
l217.969,217.984l218-217.984C524.672,207.123,524.672,124.936,473.984,74.248z" ></path>
</svg>
<span>${t.filter.favorite}</span>
</a>
    -->
<a class="button filter no-count ${this.config.lives ? "enabled" : ""}" filter="lives">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="14px" height="14px" viewBox="0 0 512 512">
        <g><polygon points="352.188,0 131.781,290.125 224.172,290.125 148.313,512 380.219,223.438 284.328,223.438"></polygon></g>
            </svg>
<span>${t.filter.lives}</span>
</a>
<a class="button filter" filter="all">${t.filter.all}</a>
<a class="button filter" filter="recommend">${t.filter.recommend}</a>
<a class="button filter" filter="mych">My Channels</a>
<a class="button filter" filter="jp">${t.filter.jp}</a>
<a class="button filter" filter="en">${t.filter.en}</a>
<a class="button filter" filter="id">${t.filter.id}</a>
<a class="button filter" filter="devis">${t.filter.devis}</a>
<a class="button filter hidden" filter="stars">${t.filter.stars}</a>
<a class="button filter hidden" filter="stars_en">${t.filter.stars_en}</a>
${Orgs.map(filter =>`<a class="button filter" filter="${filter.split(" ")[0].toLowerCase()}">${t.filter[filter.toLowerCase()] || filter}</a>`
).join('')}
<a class="button filter" filter="outside">${t.filter.outside}</a>
<a class="button filter" filter="talk">${t.filter.talk}</a>
<a class="button filter" filter="singing">${t.filter.singing}</a>
<a class="button filter" filter="rpg">${t.filter.rpg}</a>
<a class="button filter" filter="horror">${t.filter.horror}</a>
<a class="button filter" filter="pvp">${t.filter.pvp}</a>
<a class="button filter" filter="coop">${t.filter.coop}</a>
<a class="button filter" filter="video">${t.filter.video}</a>
<a class="button filter" filter="membersonly">${t.filter.membersonly}</a>
<a class="button reload hidden">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" height="14px" width="14px" viewBox="0 0 512 512">
        <g>
        <path d="M446.025,92.206c-40.762-42.394-97.487-69.642-160.383-72.182c-15.791-0.638-29.114,11.648-29.752,27.433
c-0.638,15.791,11.648,29.114,27.426,29.76c47.715,1.943,90.45,22.481,121.479,54.681c30.987,32.235,49.956,75.765,49.971,124.011
c-0.015,49.481-19.977,94.011-52.383,126.474c-32.462,32.413-76.999,52.368-126.472,52.382
c-49.474-0.015-94.025-19.97-126.474-52.382c-32.405-32.463-52.368-76.992-52.382-126.474c0-3.483,0.106-6.938,0.302-10.364
l34.091,16.827c3.702,1.824,8.002,1.852,11.35,0.086c3.362-1.788,5.349-5.137,5.264-8.896l-3.362-149.834
c-0.114-4.285-2.88-8.357-7.094-10.464c-4.242-2.071-9.166-1.809-12.613,0.738L4.008,182.45c-3.05,2.221-4.498,5.831-3.86,9.577
c0.61,3.759,3.249,7.143,6.966,8.974l35.722,17.629c-1.937,12.166-3.018,24.602-3.018,37.279
c-0.014,65.102,26.475,124.31,69.153,166.944C151.607,465.525,210.8,492.013,275.91,492
c65.095,0.014,124.302-26.475,166.937-69.146c42.678-42.635,69.167-101.842,69.154-166.944
C512.014,192.446,486.844,134.565,446.025,92.206z"></path>
</g>
</a>
</div>
<div id="main">
    <div id="contents"></div>
<a id="next">${t.next}</a>
</a>
</div>
`);
            document.body.appendChild(this.$container);

            this.$sub = this.$container.querySelector("#sub");
            this.$contents = this.$container.querySelector("#contents");
            this.$next = this.$container.querySelector("#next");
            this.$reload = this.$container.querySelector(".reload");

            // Emulate loading animation
            this.$loading = document.createElement("h1");
            this.$loading.style.cssText =
                "font-size: 32px; font-family: monospace; font-style: italic; color: var(--custom-viewer-items-info-color);" +
                "padding: 8px; text-align: center; cursor: default; user-select: none;";

            this.$contents.appendChild(this.$loading);

            let count = 0;

            const loading = setInterval(() => {
                if (!this.$contents.contains(this.$loading)) {
                    clearInterval(loading);
                    return;
                }
                count = (count + 1) % 4;
                this.$loading.textContent = 'Now Loading' + '.'.repeat(count);
            }, 500);

            // events

            this.$container.addEventListener("click", ev => {
                //if (ev.target == this.$container || !ev.path.find(e => e.tagName == "A")) {
                if (ev.target == this.$container || !ev.target.tagName == "A") {
                    this.close();
                    return;
                }
            });

            this.$sub.querySelectorAll(".filter:not(.no-count)").forEach($filter => {
                const key = $filter.getAttribute("filter");
                const filter = customFilters[key] || new Filter(key, s => {
                    const org = s?.channel?.org;
                    return org && org.toLowerCase() === key.toLowerCase();
                });

                $filter.filter = filter;

                $filter.addEventListener("click", (ev) => {
                    // 追加點擊項目高亮辨識
                    this.$sub.querySelectorAll(".filter:not(.no-count)").forEach(item => {
                        item.removeAttribute('clicked');
                    });

                    ev.target.setAttribute('clicked');
                    this.filterByCategory(filter);
                });
            });

            /*
            this.$sub.querySelector("[filter=favorite]").addEventListener("click", async ev => {
                var enabled = this.config.favorite = !this.config.favorite;
                storage.archive.options = this.config;

                ev.target.classList.toggle("enabled", enabled);
                var streams = await this.updateStreams({}, true);
                if (streams) {
                    this.drawStreams(streams);
                }
            });*/

            this.$livesFilter = this.$container.querySelector("#sub [filter=lives]");
            this.$livesFilter.addEventListener("click", async ev =>{
                var enabled = this.config.lives = !this.config.lives;
                storage.archive.options = this.config;

                this.$livesFilter.classList.toggle("enabled", enabled);
                var streams = await this.updateStreams({}, true);
                if (streams) {
                    this.drawStreams(streams);
                }
            });

            this.$next.addEventListener("click", async ev => {
                try{
                    this.$next.classList.add("hidden");
                    await this.continue();
                } finally {
                    this.$next.classList.remove("hidden");
                }
            });

            this.$reload.addEventListener("click", async ev => {
                try {
                    var streams = await this.updateStreams({}, true);
                    if (streams) {
                        this.drawStreams(streams);
                    }
                } finally {
                    this.$reload.classList.add("hidden");
                }
            });
        }

        this.createStream = function (data) {
             // console.log(data);

            try {
                var $stream = document.createElement("a");
                $stream.data = data;
                $stream.classList.add("hololive-stream");
                $stream.setAttribute("stream-status", data.status);

                var site = "";
                // サムネサイズダウン、Youtube以外のサムネURL取得
                var thumbnail = data.thumbnail, href;
                if (data.type == "placeholder") {
                    // twitch
                    if (data.link.indexOf("https://twitch.tv/") == 0) {
                        thumbnail = thumbnail.replace("1920x1080", "426x240");
                        site = "twitch";
                    }
                    // twitter
                    if (thumbnail.indexOf("https://pbs.twimg.com/") == 0) {
                        thumbnail = thumbnail.replace("name=large", "name=small");
                        site = "x";
                    }

                    href = data.link;
                    $stream.target = "_blank";
                } else if (data.type == "stream") {
                    thumbnail = `https://i.ytimg.com/vi/${data.id}/mqdefault.jpg?${new Date(data.published_at).getTime()}`;
                    href = "/watch/" + data.id;
                }
                data.thumbnail = thumbnail;

                // トピック
                var topic = "";
                var title = data.title;
                if (data.topic_id) {
                    topic = t.topic[data.topic_id.toLowerCase()] || data.topic_id.replace(/_/g, " ");
                } else {
                    var m = data.title.match(/^【([^】]*?)】/) || data.title.match(/^≪([^≫]*?)≫/) || data.title.match(/(#.*?)\s/);
                    if (m) {
                        topic = m[1].trim();
                    }
                }
                title = title.replace(/【[^】]*?】/g, "");
                title = title.replace(/≪[^≫]*?≫/g, "");
                title = title.replace(/(※.*?|※?\s?)(ネタバレ(あり)?|spoiler alert)/gi, "");
                title = title.trim();

                var name = data.channel.name;

                var date = new Date(data.available_at);
                var startTime = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;

                // 配信時間
                var hours, mins, secs, duration = data.duration;
                //  var time = this.toLiveDate(data.start_actual, data.start_scheduled, data.ended, data.published_at);
                if (data.status == "live") {
                    duration = Math.floor((new Date().getTime() - new Date(data.available_at).getTime()) / 1000);
                }

                hours = Math.floor(duration / 60 / 60);
                mins = ("00" + Math.floor(duration / 60 % 60)).slice(-2);
                secs = ("00" + Math.floor(duration % 60)).slice(-2);

                var icon = data.channel.photo.replace("=s800", "=s144");
                $stream.href = href;
                $stream.innerHTML = myPolicy.createHTML(`
<div class="thumbnail" style="background-image: url('${data.thumbnail}'), url('${data.channel.photo}');">
    <div class="date">${hours}:${mins}:${secs}</div>
    <div class="start">${startTime}</div>
    <div class="topic">${topic}</div>
    <div class="site" class="${site}"></div>
</div>
<div class="title-wrapper"><div class="title">${title}</div><div class="name">${name}</div></div>
<div class="photo" style="background-image: url('${icon}');" />
`);
                $stream.addEventListener("mouseenter", this.previewStream, false);
            } catch(ex) {
                console.log(ex);
            }
            return $stream;
        }

        this.updateLiveDate = function () {
            if (!this.$contents) return;

            this.$contents.querySelectorAll(".hololive-stream[stream-status=live]").forEach(e => {
                var duration = Math.floor((new Date().getTime() - new Date(e.data.available_at).getTime()) / 1000);
                var hours = Math.floor(duration / 60 / 60);
                var mins = ("00" + Math.floor(duration / 60 % 60)).slice(-2);
                var secs = ("00" + Math.floor(duration % 60)).slice(-2);
                e.querySelector(".date").innerText = `${hours}:${mins}:${secs}`;
            });
        }

        this.drawStreams = function (newStreams, isAppend) {
            this.archive = isAppend ? this.archive.concat(newStreams) : newStreams;

            if (!isAppend) {
                this.$contents.innerText = "";
            }
            newStreams
            // .filter(data => !(data.status == "upcoming" && new Date().getTime() - new Date(data.available_at).getTime() > 0)) // fix to status bug in holodex
                .forEach(data => self.$contents.appendChild(self.createStream(data)));

            this.$loading.remove(); // 移除 loading content...
            this.countCategory();
            this.filterByCategory();

            if (!isAppend) {
                this.$reload.classList.add("hidden");
                this.shouldReloadTimer = clearTimeout(this.shouldReloadTimer);
                this.shouldReloadTimer = setTimeout(() => this.$reload.classList.remove("hidden"), 180 * 1000);
            }
        }

        this.open = async function () {
            this.config = Object.assign({
                lives: false,
                favorite: false,
            }, storage.archive.options);

            this.$container.classList.remove("hidden");
            this.$reload.classList.add("hidden");
            this.updateLiveDateTimer = setInterval(() => this.updateLiveDate(), 1000);

            var streams = await this.updateStreams({}, false).catch(ev => console.log(ev));
            if (streams) {
                this.drawStreams(streams, false);
            }
        }

        this.filterByCategory = function (newFilter) {
            if (newFilter) {
                this.filter = newFilter;
            }

            this.$contents.querySelectorAll(".hololive-stream").forEach($s => {
                $s.classList.toggle("hidden", !$s.hasAttribute(`category-${this.filter.name}`));
            });
        }

        this.countCategory = function () {
            // フィルタ結果を属性にキャッシュ
            var $streams = this.$contents.querySelectorAll(".hololive-stream:not(.counted)");
            $streams.forEach($s => {
                const org = $s.data.channel.org;
                for (var key in customFilters) {
                    var filter = customFilters[key];
                    if (filter.match($s.data)) {
                        //console.log(filter.name, $s.data.channel.org);
                        $s.setAttribute(`category-${filter.name}`, true);
                    }
                    if (Orgs.includes(org)) {
                        $s.removeAttribute('category-outside');
                        $s.setAttribute(`category-${org.split(" ")[0]}`, true);
                    }
                }
                $s.classList.add("counted");
            });

            this.$sub.querySelectorAll(".filter:not(.no-count)").forEach($f => {
                var filterName = $f.getAttribute("filter");
                $f.setAttribute("count", this.$contents.querySelectorAll(`[category-${filterName}=true]`).length);
            });
        }

        this.continue = async function () {
            var newStreams = await this.updateStreams({
                offset: this.archive.length,
            }, true);

            if (newStreams) {
                this.drawStreams(newStreams, true);
            }
        }

        this.close = function () {
            this.$container.classList.add("hidden");
            this.updateLiveDateTimer = clearInterval(this.updateLiveDateTimer);
            this.shouldReloadTimer = clearTimeout(this.shouldReloadTimer);
        }

        //

        this.updateStreams = async function (options, isForce = false) {
            try {
                if (this.isRefreshing) return false;
                this.isRefreshing = true;

                // 十分に新しい、HoloDexから更新の必要はない
                if (!isForce && Date.now() - this.lastUpdated < REFRESH_INTERVAL) {
                    return false;
                }

                if (this.config.lives) {
                    options.status = "past,missing,live,placeholder";
                }

                var response = await holodex.getVideos(options, this.config.favorite).catch(ex => {
                    console.log("cache", ex);
                });

                if (response && Array.isArray(response)) {
                    this.lastUpdated = Date.now();

                    return response;
                }

                // console.log(response);

                return false;
            } catch (ex) {
                console.log(ex);

                return false;
            } finally {
                this.isRefreshing = false;
            }
        }

        // utils

    }

    function GenFilter(name, channels) {
        this.name = name;
        this.channels = channels || [];
        this.match = stream => this.channels.indexOf(stream.channel.id) >= 0;
    }

    function CategoryFilter(name, category, freewords) {
        this.name = name;
        this.category = Array.isArray(category) ? category : [ category ];
        this.category = this.category.map(c => c.toLowerCase());
        this.freewords = Array.isArray(freewords) ? freewords : [ freewords ];

        this.match = (stream => {
            if (this.category && this.category.indexOf(String(stream.topic_id).toLowerCase()) >= 0) {
                return true;
            }
            if (this.freewords && this.freewords.find(w => stream.title.match(w))) {
                return true;
            }
            return false;
        });
    }

    function Filter(name, func) {
        this.name = name;
        this.func = func;
        this.match = stream => func(stream);
    }

    function initilizeFilters() {
        var filters = {};

        favorites = storage.favorite.channels;

        //filters.all = new Filter("all", () => true);
        filters.all = new Filter("all", (stream) => {
            // 確保 `filters.stars_all.channels` 中的頻道及其他選定的頻道不會出現在 `filters.all` 中
            return filters.stars_all.channels.indexOf(stream.channel.id) === -1 && filters.outside.match(stream) === false;
        });

        filters.favorite = new Filter("favorite", (data) => {
            if (!favorites) return true;
            return favorites.indexOf(data.channel.id) >= 0;
        });

        filters.jp = new GenFilter("jp", [
            // hololive official
            "UCJFZiqLMntJufDCHc6bQixg",
            // jp0
            "UC0TXe_LYZ4scaW2XMyi5_kw",
            "UC5CwaMl1eIgY8h02uZw7u8A",
            "UCDqI2jOz0weumE8s7paEk6g",
            "UC-hM6YJuNYVAmUWxeIr9FeA",
            "UCp6993wxpyDPHUpavwDFqgg",
            // jp1
            "UC1CfXB_kRs3C-zaeTG3oGyg",
            "UCD8HOxPs4Xvsm8H0ZxXGiBw",
            "UCdn5BQ06XqgXoAxIhbqw5Rg",
            "UCFTLzh12_nrtzqBPsTCqenA",
            "UCHj_mh57PVMXhAUDphUQDFA",
            "UCLbtM3JZfRTg8v2KGag-RMw",
            "UCQ0UDLQCjY0rmuxCDE38FGg",
            // jp2
            "UC1opHUrw8rvnsadT-iGp7Cg",
            "UC1suqwovbL1kzsoaZgFZLKg",
            "UC7fk0CB07ly8oSl0aqKkqFg",
            "UCp3tgHXw_HI0QMk1K8qh3gQ",
            "UCvzGlP9oQwU--Y0r9id_jnA",
            "UCXTpFs_3PqI41qX2d9tL2Rw",
            // gamers
            "UCdn5BQ06XqgXoAxIhbqw5Rg",
            "UChAnqc_AY5_I3Px5dig3X1Q",
            "UCp-5t9SrOQwXMU7iIjQfARg",
            "UCvaTdHTWBGv3MKj3KVqJVCw",
            // jp3
            "UC1DCedRgGHBdm81E1llLhOQ",
            "UCCzUftO8KOVkV4wQG1vkUvg",
            "UCdyqAaZDKHXg4Ahi7VENThQ",
            "UCvInZx9h3jC2JzsIzoOebWg",
            // jp4
            "UC1uv2Oq6kNxgATlCiez59hw",
            "UCa9Y57gfeY0Zro_noHRVrnw",
            "UCqm3BQLlJfvkTsX_hvm0UmA",
            "UCZlDXzGoo7d44bwdNObFacg",
            // jp5
            "UCAWSyEs_Io8MtpY3m-zqILA",
            "UCFKOVgVbGmX65RxO3EtH3iw",
            "UCK9V2B22uJYu3N7eR_BT9QA",
            "UCUKD-uaobj9jiqB-VXt71mA",
            // holox
            "UC6eWCld0KwmyHFbAqK3V-Rw",
            "UCENwRMx5Yh42zWpzURebzTw",
            "UCIBY1ollUsauvVi4hW4cumw",
            "UCs9_O1tRPMQTHQ-N_L6FU2g",
            "UC_vMYWcDjmfdpH6r4TTn1MQ",
            // regloss
            "UCtyWhCj3AqKh2dXctLkDtng",
            "UCWQtYtq9EOB4-I5P-3fh8lA",
            "UCMGfV7TVTmHhEErVJg1oHBQ",
            "UCdXAk5MpyLD8594lm_OvtGQ",
            "UC1iA6_NT4mtAcIII6ygrvCw",
            // flow glow
            "UCuI_opAVX6qbxZY-a-AxFuQ",
            "UCKMWFR6lAstLa7Vbf5dH7ig",
            "UCGzTVXqMQHa4AgJVJIVvtDQ",
            "UCjk2nKmHzgH5Xy-C5qYRd5A",
            "UC9LSiN9hXI55svYEBrrK-tw",
        ]);

        filters.en = new GenFilter("en", [
            // en offical
            "UCotXwY6s8pWmuWd_snKYjhg",
            //enmyth
            "UCHsx4Hqa-1ORjQTh9TYDhww",
            "UCL_qhgtOy0dy1Agp8vkySQg",
            "UCMwGHR0BTZuLsmjY_NT5Pwg",
            "UCoSrY_IQQVpmIRZ9Xf-y93g",
            "UCyl1z3jo3XHR1riLFKG5UAg",
            // enhope
            "UC8rcEBzJSleTkf_-agPM20g",
            // encouncil
            "UC3n5uGu18FoCy23ggWWp8tA",
            "UCgmPnx-EEeOrZSg5Tiw7ZRQ",
            "UCmbs8T6MWqUHP1tIQvSgKrg",
            "UCO_aKKYxn4tvrqPjcTzZ6EQ",
            "UCsUj0dszADCGbF3gNrQEuSQ",
            // en advant
            "UC9p_lqQ0FEDz327Vgf5JwqA",
            "UC_sFNM0z0MWm9A6WlKPuMMg",
            "UCt9H_RpQzhxzlyBxFqrdHqA",
            "UCgnfPPb9JI3e9A4cXHnWbyg",
            // en justice
            "UCl69AEx4MdqMZH7Jtsm7Tig",
            "UCvN5h1ShZtc7nly3pezRayg",
            "UCDHABijvPBnJm7F-KlNME3w",
            "UCW5uhrG1eCBYditmhL0Ykjw",
            // en shorts
            "UCNoxM_Kxoa-_gOtoyjbux7Q",
        ]);

        filters.id = new GenFilter("id", [
            // id1
            "UCAoy6rzhSf4ydcYjJw3WoVg",
            "UCfrWoRGlawPQDQxxeIDRP0Q",
            "UCOyYb1c43VlX9rc_lT6NKQw",
            "UCP0BspO_AMEe3aQqqpo89Dg",
            // id2
            "UC727SQYUvx5pDDGQpTICNWg",
            "UChgTyjG-pdNvxxhdsXfHQ5Q",
            "UCYz_5n-uDuChHtLo7My1HnQ",
            // id3
            "UCjLEmnpCNeisMxy134KPwWw",
            "UCTvHWSfBZgtxE4sILOaurIQ",
            "UCZLZ8Jjx_RN2CXloOmgTHVg"
        ]);

        filters.devis = new GenFilter("devis", [
            // official
            "UC10wVt6hoQiwySRhz7RdOUA", // "@hololiveDEV_IS"
            // regloss
            "UCMGfV7TVTmHhEErVJg1oHBQ", // "@HiodoshiAo",
            "UCWQtYtq9EOB4-I5P-3fh8lA", // "@OtonoseKanade",
            "UCtyWhCj3AqKh2dXctLkDtng", // "@IchijouRirika",
            "UCdXAk5MpyLD8594lm_OvtGQ", // "@JuufuuteiRaden",
            "UC1iA6_NT4mtAcIII6ygrvCw", // "@TodorokiHajime",
            // glowflow
            "UC9LSiN9hXI55svYEBrrK-tw", // @IsakiRiona
            "UCGzTVXqMQHa4AgJVJIVvtDQ", // @KikiraraVivi
            "UCjk2nKmHzgH5Xy-C5qYRd5A", // @MizumiyaSu
            "UCKMWFR6lAstLa7Vbf5dH7ig", // @RindoChihaya
            "UCuI_opAVX6qbxZY-a-AxFuQ", // @KoganeiNiko
        ]);

        filters.stars = new GenFilter("stars", [
            // official stars
            "UCWsfcksUUpoEvhia0_ut0bA",
            // stars1
            "UC6t3-_N8A6ME1JShZHHqOMw",
            "UC9mf_ZVpouoILRY9NUIaK-w",
            "UCKeAhJvy8zgXWbh9duVjIaQ",
            "UCZgOv3YDEs-ZnZWDYVwJdmA",
            // stars2
            "UCANDOlYTJT7N5jlRC3zfzVA",
            "UCGNI4MENvnsymYjKiZwv9eg",
            "UCNVEsYbiZjH5QLmGeSgTSzg",
            // stars3
            "UChSvpZYRPh0FvG4SJGSga3g",
            "UCwL7dgTxKo8Y4RFIKWaf8gA",
            // stars4
            "UCc88OV45ICgHbn3ZqLLb52w",
            "UCdfMHxjcCc2HSd9qFvfJgjg",
            "UCgRqGV1gBf2Esxh0Tz1vxzw",
            "UCkT1u65YS49ca_LsFwcTakw",
        ]);

        filters.stars_en = new GenFilter("stars_en", [
            // stars en official
            "UCJxZpzx4wHzEYD-eCiZPikg",
            // tempus
            "UCyxtGMdWlURZ30WSnEjDOQw",
            "UC2hx0xVkMoHGWijwr_lA01w",
            // tempus 2
            "UCHP4f7G2dWD4qib7BMatGAw",
            "UC060r4zABV18vcahAWR1n7w",
            "UC7gxU6NXjKF1LrgOddPzgTw",
            "UCMqGG8BRAiI1lJfKOpETM_w",
            // armis
            "UCajbFh6e_R8QZdHAMbbi4rQ",
            "UCJv02SHZgav7Mv3V0kBOR8Q",
            "UCLk1hcmxg8rJ3Nm1_GvxTRA",
            "UCTVSOgYuSWmNAt-lnJPkEEw",
        ]);

        filters.varium = new GenFilter("Varium", [
            "UC_1Gq60351AILDqzA7R9wFw", // Ahiru Ch. 綿宮あひる
            "UC2f11iZvrPBtA_S1LE2soeA", // Lime Ch. 紫電ライム
            "UCAhrgF4MkqEXkBhHIqeY0Rg", // Chiyu Ch. 忍野ちゆ
            "UCAT7Vnk5vwlsg805s4_ZZTw", // Louise Ch.  ルイズ・プリエール
            "UCaUmYqh9c14DakxiQOf6OnQ", // Luna Ch. ルナ・ゴールドレイン
            "UCAytwphRHoPcvLr_qRvn3Zw", // Varium‐ぶいありうむ
            "UCDOiw6Z_yVE65XtgtcjJj5w", // Nonochi Ch. 兎ノ花ののち
            "UCdQ9LnNR6DTj52nrpRggexg", // Serenade Ch. セレナーデ・オックスブラッド
            "UCJPsMdQ00F468XuK3KyzxVA", // Miruka Ch. 夜羽月みるか
            "UCLS28fzx6TqoccWmjzrG2YA", // Nina Ch. 飴望にぃな
            "UCoqSuOp1CpewXVdlA5SLvKg", // Sui Ch. 涼月すい
            "UCPqswBEjZm3FdvOzPyDw9wg", // Remu Ch. 綺音れむ
            "UCTzY8TqG9Y1LNcKC1ywTsig", // Eru Ch. 七瀬える
            "UCu0IEm_0Vrw444Ng2EEogwg", // Awawa Ch. 白星あわわ
            "UCulpRaJyJGOZc6ieSO5qt0A", // Oto Ch. 透乃 おと
            "UCxOTQ01cBN86_QX3jbNnW7g", // Ume Ch. 狛犬うめ
            "UCyVypf7vg9KqoDiXkDIvetg", // Molf Ch. 海汐もるふ
            "UCZruZCE1YtqXYKufY6_owag", // Avi Ch. 月宵あび
        ]);

        filters.my_ch = new GenFilter("mych", myChannels);

        filters.stars_all = new GenFilter("stars_all", [].concat(filters.stars.channels, filters.stars_en.channels));

        filters.outside = new Filter("outside", (() => {
            var extChannels = Orgs.flatMap(org => filters[org.toLowerCase()]?.channels ?? []);
            var allChannels = [].concat(filters.jp.channels, filters.en.channels, filters.id.channels, filters.devis.channels, filters.stars.channels, filters.stars_en.channels, filters.my_ch.channels, extChannels);
            return s => allChannels.indexOf(s.channel.id) == -1;
        })());

        filters.singing = new CategoryFilter("singing", ["singing"]);

        filters.talk = new CategoryFilter("talk", [
            "asmr","camera_stream","chatbot","cooking_stream","drawing","drawing_personality_test","duolingo","eat","english_lesson","english_only",
            "japanese_lesson","japanese_only","mashmallow","morning","review","talk","totus","trpg","unboxing","vlog","vrchat","watchalong"
        ]);

        filters.recommend = new CategoryFilter("recommend", [
            "announce", "celebration", "3d_stream", "debut_stream", "birthday", "anniversary", "totsu", "outfit_reveal", "teaser"]);

        filters.membersonly = new CategoryFilter("membersonly", "membersonly", ["メン限", "メンバー限定"]);

        filters.rpg = new CategoryFilter("rpg", [
            "13_sentinels:_aegis_rim","ace_attorney","armored_core","assassings_creed","bioshock","bloodborne","black_myth:wukong","cyberpunk_2077",
            "dark_souls","dead_space","death_stranding","demon's_soul","detroit:_become_human","devil_may_cry","dragon_ball_z_:_kakarot","dragon's_dogma","dragon_quest","dying_light",
            "earthbound","elden_ring","elder_scrolls",
            "fate/samurai_remnant","fallout","final_fantasy","final_fantasy_online","fire_emblem","fire_emblem",
            "ghostwire: tokyo","gta","gta5",
            "hogwarts_legacy","judgment","live_a_live",
            "mafia","metal_gear","metal_gear","nier","no_man's_sky",
            "omori","one_piece_odyssey","persona","persona","pokemon","read_dead","romancing_saga","sekiro","starfield",
            "tales_of","undertale","undertale","yakuza","yokai_watch","witcher3","zelda",
        ]);

        filters.pvp = new CategoryFilter("pvp", [
            "apex","call_of_duty","counter-strike",
            "darker_and_darker","dbd","deltarune","dota","fallguys","fortnite","guilty_gear",
            "hearthstone","league_of_legends","mariokart","mahjong",
            "overwatch","pupg","rainbow_six",
            "slither.io","smash","soulcalibur","splatoon","street_fighter","tarkov","tarkov","teamfight_tactics","tetris",
            "valorant","yu-gi-oh!"
        ]);

        filters.coop = new CategoryFilter("coop", [
            "7_days_to_die","a_way_out","among_us","animal_crossing","ark","buckshot_roulette","back4blood","bokura","content_warning","core_keeper","craftopia",
            "devour","fifa","gartic_phone","ghost_exorism_inc.","gta",
            "hacktag","heave_ho","hide_and_shriek","human_fall_flat","it_takes_two","keep_talking_nobody_explode",
            "l4d2","lethal_company","liar's_bar","mario_party","minecraft","monhan","monopoly",
            "operation_tango","overcooked","party_animals","phasmophobia","pico_park","plateup","project_winter","pummel_party","raft","rust",
            "school_labyrinth","super_bunny_man","terraria","the_forest","ultimate_chicken_horse","uno","unrailed","unravel_two",
            "valheim","vrchat","words_on_stream","we_were_here"
        ]);

        filters.horror = new CategoryFilter("horror", [
            "ao_oni","convenience_store","devour","don't_scream",
            "fatal_frame","friday_night_funkin'","ghost_room",
            "ib","imi_ga_wakaru_to_kowai_manga","inunaki_tunnel","jumpscare_scare_jump","kinki_spiritual_affairs_bureau","kusodeka_bayashi",
            "little_nightmares","luigi's_mansion","night_deliverry","night_security", "naribikimura",
            "outlast","poppy_playtime","parasocial","phasmophobia","residentevil","poppy_playtime",
            "school_labyrinth","silent_hill","shadow_corridor","shinkansen_0","soma",
            "the_bathhouse","the_closing_shift","the_karaoke","the_working_dead","tsugunohi","visage","yomawari",
        ]);
        filters.hololive = new CategoryFilter("hololive", [
            "holocure","hololiveerror","hololive_treasure_mountain","holoparade","holo_x_break","idle_showdown","miko_in_maguma","wowowow_korone_box",
        ], ["Miko In Maguma","WOWOWOW KORONE"]);

        filters.video = new Filter("video", (() => {
            var category = ["shorts", "music_covor", "original_song", "dancing", "animation"];
            return stream => {
                if (category.indexOf(String(stream.topic_id).toLowerCase()) >= 0) {
                    return true;
                }
                if (stream.start_actual && stream.start_scheduled && stream.available_at &&
                    stream.available_at == stream.start_actual == stream.start_scheduled) {
                    return true;
                }
                if (0 < stream.duration && stream.duration < 60 * 6) {
                    return true;
                }
                return false;
            }
        })());

        return filters;
    }

    // Using Holodex/HoloAPI V2 (2.0)
    // @see https://docs.holodex.net/#section/LICENSE
    function Holodex() {
        this.APIKEY = atob('NjYxZjdmOGYtZTM1My00ZDMzLTk2ZjgtMTg3ZTU3NGQ2MmQw');
        this.UA = `${APPNAME}/${VERSION}`;

        // 將 options 物件轉換為 URL 查詢字串
        this.createXHRData = function (options) {
            var data = "";
            for (var key in options) {
                var value = options[key];
                if (Array.isArray(value)) {
                    value += value.join(",");
                }
                data += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
            }
            return data;
        };

        // 封裝 GM.xmlHttpRequest 並回傳 Promise
        this.XHR = function (api, data) {
            // console.log(api, data);
            return new Promise((resolve, reject) => {
                var options = {
                    method: "GET",
                    url: api,
                    headers: {
                        "X-APIKEY": this.APIKEY,
                        "user-agent": this.UA,
                    },
                    onload: (context) => {
                        try {
                            resolve(JSON.parse(context.responseText));
                        } catch (ex) {
                            reject(context);
                        }
                    },
                    onerror: reject,
                    onabort: reject,
                    ontimeout: reject,
                };

                if (data) {
                    options.method = "POST";
                    options.data = data.replace("&20", "+");
                    options.headers.application = "x-www-form-urlencoded";
                }

                GM.xmlHttpRequest(options);
            });
        };

        // 取得直播資料，分別以社團進行發送請求，再將結果合併
        this.getLiveForOrg = function(org, options = {}, isUser = false) {
            options = Object.assign({
                type: "placeholder,stream",
                org: org,
                lang: window.navigator.language == "ja" ? "ja" : "en",
            }, options);

            isUser = false;
            var baseURL = `https://holodex.net/api/v2/${isUser ? "users/" : ""}live?`;
            var finalURL = baseURL + this.createXHRData(options);
            console.log("Request URL for", org, ":", finalURL);
            return this.XHR(finalURL);
        };

        this.getLiveForChannels = function(channelIds, options = {}) {
            options = Object.assign({
                type: "placeholder,stream",
                lang: window.navigator.language == "ja" ? "ja" : "en",
            }, options);

            const baseURL = `https://holodex.net/api/v2/live?`;
            const requests = channelIds.map(id => {
                const finalURL = baseURL + this.createXHRData({ ...options, channel_id: id });
                console.log("Request for channel", id, ":", finalURL);
                return this.XHR(finalURL);
            });

            return Promise.all(requests).then(results => results.flat());
        };

        this.getLive = function(options = {}, isUser = false, ) {
            // 針對每個全局 Orgs 裡的 org 發出請求
            const orgRequests = Orgs.map(org => {
                return this.getLiveForOrg(org, options, isUser);
            });

            const requests = [...orgRequests];

            if (hololive) {
                const holoRequest = this.getLiveForOrg("Hololive", options, isUser)
                .then(list => list.filter(stream => !stream.channel.suborg?.includes("HOLOSTARS")));
                requests.push(holoRequest);
            }

            if (nijisanji) {
                const nijiRequest = this.getLiveForOrg("Nijisanji", options, isUser);
                requests.push(nijiRequest);
            }

            switch (customRequest) {
                case 1:
                    const channelRequest = this.getLiveForChannels(myChannels, options);
                    requests.push(channelRequest);
                    break;
                case 2:
                    const allRequests = this.getLiveForOrg("All Vtubers", options, isUser)
                    .then(list => list.filter(stream => myChannels.includes(stream.channel.id)));
                    requests.push(allRequests);
                    break;
                default:
                    console.log("Custom channel request canceled!");
                    break;
            }

            return Promise.all(requests).then(results => results.flat())
        };

        //this.getLive = function(options = {}, isUser = false) {
        //    return Promise.all([
                //this.getLiveForOrg("Hololive", options, isUser).then(list =>
                //    list.filter(stream => !stream.channel.suborg.includes("HOLOSTARS")) //從伺服器端拒絕請求holostars，避免與之相關的collab.配對出現
                //    ),
                //this.getLiveForOrg("VSpo", options, isUser),
                //this.getLiveForOrg("All Vtubers", options, isUser),
                //this.getLiveForChannels(myChannels, options)
        //    ]).then(results => {
                // 假設每個 API 會回傳陣列，利用 flat() 合併結果
        //        return results.flat();
        //    });
       // };

        // 取得主題資料
        this.getTopics = function () {
            return this.XHR(`https://holodex.net/api/v2/topics`);
        };

        // 取得最愛資料
        this.getFavorite = function (isUser = true) {
            return this.XHR(`https://holodex.net/api/v2/users/${isUser ? "users/" : ""}favorites`);
        };

        // 取得影片資料，分別以社團發送請求，最後再進行合併
        this.getVidsForOrg = function(org, options = {}, channel_id = null, isUser = false) {
            options = Object.assign({
                // past, missing, live, placeholder
                status: "past,missing",
                // stream, clip
                type: "stream",
                paginated: false,
                to: new Date().toISOString(),
                org: org,
                // asc,desc
                // order: "desc",
                limit: 10,
                offset: 0,
                // clips,refers,sources,simulcasts,mentions,description,live_info,channel_stats,songs
                // includes: "live_info,refers",
                lang: window.navigator.language === "ja" ? "ja" : "en",
            }, options);

            isUser = false;

            const baseURL = `https://holodex.net/api/v2/${isUser ? "users/" : ""}videos?`;

            if (Array.isArray(channel_id)) {
                const requests = channel_id.map(id => {
                    const finalURL = baseURL + this.createXHRData({ ...options, channel_id: id });
                    //console.log("Request for channel", id, ":", finalURL);
                    return this.XHR(finalURL).then(res => res.items);
                });

                return Promise.all(requests).then(results => results.flat());
            }

            const finalURL = baseURL + this.createXHRData(options);
            //console.log(`[GET] 發送請求給 org: ${org} → URL: ${finalURL}`);

            return this.XHR(finalURL)
                .then(res => {
                // 嘗試取 res.items（new）
                return res.items;
            })
        };

        // 取得影片資料
        this.getVideos = function(options = {}, isUser = false) {
            const orgRequests = Orgs.map(org => this.getVidsForOrg(org, options, isUser));

            const requests = [...orgRequests];

            const myRequests = this.getVidsForOrg("All Vtubers", {...options, limit: 3 }, myChannels, isUser);
            requests.push(myRequests);

            if (hololive) {
                const hololiveLimit = 20; // 因為在後端過濾了 HOLOSTARS，額外補足請求數
                const holoRequest = this.getVidsForOrg("Hololive", { ...options, limit: hololiveLimit * 2 }, isUser)
                    .then(list => list.filter(stream => !stream.channel.suborg?.includes("HOLOSTARS")).slice(0, hololiveLimit));
                requests.push(holoRequest);
            }

            return Promise.all(requests).then(results => results.flat());
        };

        // 取得頻道資料
        this.getChannelsForOrg = function (org, options = {}) {
            options = Object.assign({
                org: org,
                limit: 50,
                offset: 0,
            }, options);

            const baseURL = `https://holodex.net/api/v2/channels?`;
            const finalURL = baseURL + this.createXHRData(options);

            console.log("Request URL for", org, "channels:", finalURL);
            return this.XHR(finalURL);
        };

        this.getChannels = function (options = {}) {
            const filters = {
                inactive: true,
                group: ["name=blabla"] // 這裡可以選擇是否過濾掉某個組合的頻道成員
            };
            const requests = Orgs.map(org => {
                return this.getChannelsForOrg(org, options).then(channels => ({
                    org: org,
                    channels: channels.filter(channel => {
                        return (
                            (filters.inactive ? !channel.inactive : true) &&
                            (!filters.group || !filters.group.includes(channel.group))
                        );
                    })
                }));
            });

            return Promise.all(requests).then(results => {
                const grouped = {};
                results.forEach(({ org, channels }) => {
                    grouped[org] = channels;
                });
                return grouped;
            });
        };

        this.getChannels().then(console.log);

        if(log) {
            this.getChannels().then(groupedChannels => {
                for (const org in groupedChannels) {
                    console.log(`=== ${org} ===`);
                    const simplified = groupedChannels[org].map(ch => ({
                        name: ch.name,
                        //id: ch.id,
                        org: ch.org,
                        gp: ch.group,
                        sub: ch.subscriber_count
                    }));
                    console.table(simplified);
                }
            });
        }
    }
})();