// ==UserScript==
// @name         아프리카 채팅 이모티콘
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  최신, 구독 이모티콘 고정
// @author       You
// @include      https://play.afreecatv.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/486396/%EC%95%84%ED%94%84%EB%A6%AC%EC%B9%B4%20%EC%B1%84%ED%8C%85%20%EC%9D%B4%EB%AA%A8%ED%8B%B0%EC%BD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/486396/%EC%95%84%ED%94%84%EB%A6%AC%EC%B9%B4%20%EC%B1%84%ED%8C%85%20%EC%9D%B4%EB%AA%A8%ED%8B%B0%EC%BD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
   
    function startScript() {
    const t = {
        chattingArea: document.querySelector("#chatting_area"),
        chatArea: document.querySelector("#chat_area"),
        emoticonBox: document.querySelector("#emoticonBox"),
        recentEmoticonBox: document.querySelector("#emoticonBox .recent_emoticon_default"),
        subEmoticonBox: document.querySelector("#emoticonBox .subscription_emoticon"),
        actionBox: document.querySelector("#actionbox"),
        recentEmoticonOpenBtn: document.createElement("button"),
        subEmoticonOpenBtn: document.createElement("button"),
        recentEmoticonElList: null,
        subEmoticonElList: null,
        ezRecentEmoticonBox: null,
        ezSubEmoticonBox: null,
        isFirst: !0,
        chatAreaTop: 0,
        isClick: !1,
        async init(t = !1) {
            if ((window?.myEmoticonBox || (window.myEmoticonBox = this), t))
                return (
                    document.getElementById("emoticonArea").classList.contains("on")
                        ? (this.emoticonBox.querySelector("li[data-type='RECENT']")?.click(), await this.sleep(300))
                        : ((this.emoticonBox.style.display = "none"),
                          this.actionBox.querySelector("#btn_emo a")?.click(),
                          await this.sleep(200),
                          this.emoticonBox.querySelector("li[data-type='RECENT']")?.click(),
                          await this.sleep(200),
                          this.emoticonBox.querySelector(".tab_area2 li[data-type='DEFAULT']")?.click(),
                          (this.emoticonBox.style.display = "block"),
                          document.getElementById("emoticonArea").classList.remove("on")),
                    this.setEmoticonList(),
                    this.ezRecentEmoticonBox.querySelectorAll("a").forEach((t) => t.remove()),
                    this.recentEmoticonElList.forEach((t) => {
                        const e = t.cloneNode(!0);
                        e.addEventListener("click", (e) => {
                            t?.click();
                        }),
                            this.ezRecentEmoticonBox.appendChild(e);
                    }),
                    void this.setEmoticonBoxHeight()
                );
            if (this.isFirst) {
                await this.sleep(1e3),
                    this.setEmoticonOpenBtn(),
                    (this.emoticonBox.style.display = "none"),
                    this.actionBox.querySelector("#btn_emo a")?.click(),
                    await this.sleep(500),
                    this.emoticonBox.querySelector("li[data-type='SUBSCRIPTION']")?.click(),
                    await this.sleep(500),
                    this.emoticonBox.querySelector("li[data-type='RECENT']")?.click(),
                    await this.sleep(500),
                    this.emoticonBox.querySelector(".tab_area2 li[data-type='DEFAULT']")?.click(),
                    await this.sleep(500),
                    (this.emoticonBox.style.display = "block"),
                    document.getElementById("emoticonArea").classList.remove("on");
                const t = document.createElement("style");
                (t.innerHTML =
                    ".adballoon_icon{display:none !important;} .ez {color: #5f5f5f}.thema_dark .ez {#999;}.ez_box {box-sizing:border-box;border-top: 1px solid;background-color: #222;width: 100%;border-color: #e1e1e1;background-color: #fff;gap: 8px 5px;position: absolute;display: flex;padding: 8px 12px;opacity: 0;}.thema_dark .ez_box {border-top: 1px solid #333;background-color: #222;}.ez_box a{box-sizing: border-box;display: flex;justify-content: center;align-items: center;width: 30px;height: 30px;border: solid 1px transparent;overflow: hidden;}.ez_box a img{width: 26px;height: 26px;margin: 0 auto;border: none;}.ez_box a:hover{background: #ededed;border: solid 1px #d0d0d0;box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.2);}.thema_dark .ez_box a:hover{background: #333;border-color: #333;border-radius: 2px;}\n                "),
                    document.body.appendChild(t),
                    (this.isFirst = !1),
                    this.setEmoticonList(),
                    (this.ezRecentEmoticonBox = document.createElement("div")),
                    (this.ezSubEmoticonBox = document.createElement("div")),
                    this.ezRecentEmoticonBox.classList.add("ez_box"),
                    this.ezSubEmoticonBox.classList.add("ez_box");
            }
            this.recentEmoticonElList.forEach((t) => {
                const e = t.cloneNode(!0);
                e.addEventListener("click", (e) => {
                    if (!t) {
                        this.refresh();
                    }
                    t?.click();
                }),
                    this.ezRecentEmoticonBox.appendChild(e);
            }),
                this.subEmoticonElList.forEach((t) => {
                    const e = t.cloneNode(!0);
                    e.addEventListener("click", () => {
                        t?.click();
                    }),
                        this.ezSubEmoticonBox.appendChild(e);
                }),
                this.chattingArea.appendChild(this.ezRecentEmoticonBox),
                this.chattingArea.appendChild(this.ezSubEmoticonBox),
                await this.sleep(100),
                this.setEmoticonBoxHeight(),
                (this.chatAreaTop = +this.chatArea.style.top.replace("px", ""));
        },
        setEmoticonBoxHeight() {
            const t = this.ezRecentEmoticonBox,
                e = this.ezSubEmoticonBox,
                o = this.actionBox.offsetHeight;
            (t.style.bottom = o + "px"), (e.style.bottom = o + "px"), (t.style.flexWrap = "wrap"), (e.style.flexWrap = "wrap");
        },
        setEmoticonOpenBtn() {
            const t = document.createElement("li"),
                e = document.createElement("li"),
                o = this.recentEmoticonOpenBtn,
                i = this.subEmoticonOpenBtn;
            o.classList.add("ez"),
                i.classList.add("ez"),
                (o.innerText = "최근임티"),
                (i.innerText = "구독임티"),
                (o.style.fontFamily = "NGB"),
                (i.style.fontFamily = "NGB"),
                (o.style.marginTop = "2px"),
                (i.style.marginTop = "2px"),
                o.addEventListener("click", async () => {
                    this.isClick ||
                        ((this.isClick = !0),
                        this.showRecentEmoticon().then(() => {
                            this.isClick = !1;
                        }));
                }),
                i.addEventListener("click", () => {
                    this.showSubEmoticon();
                }),
                t.appendChild(o),
                e.appendChild(i),
                this.actionBox.querySelector("#ul2").appendChild(t),
                this.actionBox.querySelector("#ul2").appendChild(e);
        },
        setEmoticonList() {
            (this.recentEmoticonElList = this.recentEmoticonBox.querySelectorAll("span a")), (this.subEmoticonElList = this.nodeListSplice(this.subEmoticonBox.querySelectorAll(".box_divider:nth-child(1) span a"), 0, 15));
        },
        async refresh() {
            await this.init(!0);
        },
        async showRecentEmoticon() {
            const t = this.ezRecentEmoticonBox.offsetHeight + 10;
            if ("1" === this.ezRecentEmoticonBox.style.opacity) return (this.ezRecentEmoticonBox.style.zIndex = "0"), (this.ezRecentEmoticonBox.style.opacity = "0"), (this.chatArea.style.marginBottom = "0px"), void (await this.refresh());
            (this.ezRecentEmoticonBox.style.opacity = "1"),
                (this.ezRecentEmoticonBox.style.zIndex = "2"),
                (this.ezSubEmoticonBox.style.opacity = "0"),
                (this.ezSubEmoticonBox.style.zIndex = "0"),
                (this.chatArea.style.marginBottom = t + "px");
            const e = this.chatArea.scrollHeight;
            (this.chatArea.scrollTop = e + t), await this.refresh(), this.chattingArea.contains(this.ezSubEmoticonBox) || this.chattingArea.appendChild(this.ezRecentEmoticonBox);
        },
        showSubEmoticon() {
            const t = this.ezSubEmoticonBox.offsetHeight + 10;
            if ("1" === this.ezSubEmoticonBox.style.opacity) return (this.ezSubEmoticonBox.style.zIndex = "0"), (this.chatArea.style.marginBottom = "0px"), void (this.ezSubEmoticonBox.style.opacity = "0");
            (this.ezSubEmoticonBox.style.opacity = "1"),
                (this.ezSubEmoticonBox.style.zIndex = "2"),
                (this.ezRecentEmoticonBox.style.opacity = "0"),
                (this.ezRecentEmoticonBox.style.zIndex = "0"),
                (this.chatArea.style.marginBottom = t + "px");
            const e = this.chatArea.scrollHeight;
            this.chattingArea.contains(this.ezRecentEmoticonBox) || this.chattingArea.appendChild(this.ezSubEmoticonBox), (this.chatArea.scrollTop = e + t);
        },
        nodeListSplice(t, e, o) {
            const i = [];
            o > t.length && (o = t.length);
            for (let n = e; n < o; n++) i.push(t[n]);
            return i;
        },
        sleep: async (t) => new Promise((e) => setTimeout(e, t)),
    };
    t.init().catch(async (e) => {
        t.init();
    });
}
let i = 0;
const interval = setInterval(() => {
    10 === i && clearInterval(interval), document.querySelector("#chat_area") && ($("#write_area").unbind("cut copy paste"), startScript(), clearInterval(interval)), i++;
}, 1e3);


    
})();
﻿

