// ==UserScript==
// @name               批量打開鏈結
// @name:en            Open Multiple URLs
// @name:zh-CN         批量打开链结
// @name:zh-TW         批量打開鏈結
// @description        批量打開文字鏈結、批量選取鏈結後打開。
// @description:en     Open Multiple Text URLs,Open Multiple Element URLs.
// @description:zh-CN  批量打开文本链结、批量选取链结后打开。
// @description:zh-TW  批量打開文字鏈結、批量選取鏈結後打開。
// @version            2024.10.3
// @author             tony0809
// @match              *://*/*
// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAACVklEQVR42u2XwUsUURzHf+6GgUTloUNaaUZRJNQpJIsNfb/vLCorEqNgdslO5aGLRBvrQJeMTi7kyd1E9tCp/pDwVhGYmISEVxHWzd1GcJ8/BnZWxzdz3M/v9nvzPt83zPwGhho0OIT+a3ii0nihUolTFDUMfIUrVeRs8hxFhRPDO/zXain+gzsUCU08D9e3tq0HUZx+Qc5cwmc4nMUP6Wxxb3T6NeumdB1IhOqJSt9JHnhaVv72tZMZ1uMavX/EEpmBGV+9wBm9XlFtZMJABzbg8oroa9+vZR0xSWYMteCW3SyT3GUNJ86SB7zWAbMUHmuUd+Dy78FWEvi5DshGoMeulo2QwHnde0XhwJjoS8krpFE3UKx2rftR6csYl3vq5LVqF6t2nMxhG6LnCR+9a40GmlqewMxAx/H1+BBMn9u/eGOo5Wi9uoRVmeJPiRNB9HnZcPsoffK0R79kxwPo8VE2rCRP1tELeAhX16ITC6JflA3r/V21773WC9zN5f1+XvSHwVnvF9NPj0c1QzfMBUwF09sB9ObYcf5Vq8c4l3XsLsYoDOqeFhVxXXpXuRRWL6i0Pn+OBB6B1st8GiMPmJ+RMNiKdbi8I/ow8Gw1QKXJgzqjUnyZNNZ5zmDKbiYT1FN9B8vURH7IN4fnyYS+dq7oiEw9vV7/RmZwQeZg2l+v6w2ZkbyATUhEXf2CEyNTuBfbInIORNwdXi+oBCSCv2MODn/Bv2j0MtG8BdevOCf6cOAuNn3070UfHlzkAlc88p8qRVGj2niS32IOL1WPE2v89Daoyx7M5xLNLagfwwAAAABJRU5ErkJggg==
// @grant              GM_openInTab
// @grant              GM_registerMenuCommand
// @grant              unsafeWindow
// @license            MIT
// @namespace          https://greasyfork.org/users/20361
// @downloadURL https://update.greasyfork.org/scripts/509325/%E6%89%B9%E9%87%8F%E6%89%93%E9%96%8B%E9%8F%88%E7%B5%90.user.js
// @updateURL https://update.greasyfork.org/scripts/509325/%E6%89%B9%E9%87%8F%E6%89%93%E9%96%8B%E9%8F%88%E7%B5%90.meta.js
// ==/UserScript==

/***

一個用處不大的腳本，主要是我的另一個腳本圖片全載，需要手動確認網站存活時會用到。

注意一次性打開太多鏈結會造成瀏覽器嚴重卡頓，慎用！！！，在有需要的時候再開啟這個腳本。

說明

模式一：批量打開文字鏈結

創建一個文字輸入區，一行一個網址或域名，批量打開。

模式二：選取鏈結後打開

步驟1.透過腳本管理器選單或按快捷鍵Ctrl + Alt + U或雙擊頁面的空白處來注入事件。

步驟2.鼠標懸停要打開的鏈結進行標記和預讀，標記會對鏈結添加橙色的邊框，再次懸停會取消標記。

Q：如何中途取消？
A：按Esc鍵或點擊頁面的空白處。

步驟3.頁面的空白處按滑鼠右鍵或快捷鍵Ctrl + Alt + O，打開被標記的所有鏈結。

再次使用重複步驟1

***/

(() => {
    'use strict';

    const _unsafeWindow = unsafeWindow ?? window;
    const hasTouchEvents = (() => ("ontouchstart" in _unsafeWindow) || (_unsafeWindow.navigator.maxTouchPoints > 0) || (_unsafeWindow.navigator.msMaxTouchPoints > 0))();

    const language = _unsafeWindow.navigator.language;

    let scriptLanguage;
    switch (language) {
        case "zh-TW":
        case "zh-HK":
        case "zh-Hant-TW":
        case "zh-Hant-HK":
            scriptLanguage = "TW";
            break;
        case "zh":
        case "zh-CN":
        case "zh-Hans-CN":
            scriptLanguage = "CH";
            break;
        default:
            scriptLanguage = "EN";
    }

    let i18n;
    switch (scriptLanguage) {
        case "TW":
            i18n = {
                omu: "批量打開鏈結",
                ou: "批量打開",
                close: "關閉",
                otu: "批量打開文字鏈結",
                oeu: "選取鏈結後打開(Ctrl + Alt + U)"
            };
            break;
        case "CN":
            i18n = {
                omu: "批量打开链结",
                ou: "批量打开",
                close: "关闭",
                otu: "批量打开文本链结",
                oeu: "选取链结后打开(Ctrl + Alt + U)"
            };
            break;
        default:
            i18n = {
                omu: "Open Multiple URLs",
                ou: "Open URLs",
                close: "Close",
                otu: "Open Multiple Text URLs",
                oeu: "Open Multiple Element URLs(Ctrl + Alt + U)"
            };
    }

    const createFixedElement = () => {

        const mainHtml = '<div id="Batch_open_links" style="display: initial !important;position: fixed !important;z-index: 9999999 !important;"></div>';
        document.body.insertAdjacentHTML("beforeend", mainHtml);

        const mainElement = document.querySelector("#Batch_open_links");
        const shadow = mainElement.attachShadow({
            mode: "open"
        });

        const div = document.createElement("div");

        Object.assign(div.style, {
            left: "0",
            right: "0",
            top: "0",
            bottom: "0",
            width: "100vw",
            height: "100vh",
            margin: "auto",
            padding: "25px 10px 10px 10px",
            position: "fixed",
            opacity: "1",
            zIndex: "9999999",
            backgroundColor: "#eee",
            color: "#222",
            fontSize: "14px",
            overflow: "scroll",
            textAlign: "left"
        });

        const html = `
            <h3 style="font-size: 22px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${i18n.omu}</h3>
            <textarea id="links_textarea" style="display: block; margin: 10px 0 10px 0; white-space:pre; overflow:scroll; resize: revert; text-transform: initial;"></textarea>
            <button id="open" style="margin-right: 20px;">${i18n.ou}</button>
            <button id="close">${i18n.close}</button>
        `;
        div.innerHTML = html;
        shadow.appendChild(div);

        const reSize_cb = () => {
            shadow.querySelector("#links_textarea").style.width = hasTouchEvents ? (_unsafeWindow.innerWidth - 26) + "px" : (_unsafeWindow.innerWidth - 40) + "px";
            shadow.querySelector("#links_textarea").style.height = hasTouchEvents ? (_unsafeWindow.innerHeight - 140) + "px" : (_unsafeWindow.innerHeight - 200) + "px";
        };
        reSize_cb();

        _unsafeWindow.addEventListener("resize", reSize_cb);

        shadow.querySelector("#close").addEventListener("click", () => {
            mainElement.remove();
            _unsafeWindow.removeEventListener("resize", reSize_cb);
        });

        shadow.querySelector("#open").addEventListener("click", () => {
            const value = shadow.querySelector("#links_textarea").value;

            let links = value.split("\n").filter(e => e).map(url => {
                if (/^https?:\/\//.test(url)) {
                    return url;
                } else {
                    return "https://" + url;
                }
            });
            links = [...new Set(links)];

            for (const link of links) {
                let ok = true;
                try {
                    new URL(link);
                } catch (error) {
                    ok = false;
                    console.error(link, error);
                }
                if (ok) GM_openInTab(link);
            }

            shadow.querySelector("#links_textarea").value = "";
        });
    };

    GM_registerMenuCommand(i18n.otu, () => createFixedElement());

    if (hasTouchEvents) return;

    const preloadLink = (url) => {
        if ([...document.getElementsByTagName("link")].some(link => link.href == url)) return;
        const preloadElement = document.createElement("link");
        preloadElement.rel = "prefetch";
        preloadElement.as = "document";
        preloadElement.href = url;
        document.head.appendChild(preloadElement);
    };

    const openElementLinks = () => {

        const contextmenuEvent = (event) => event.preventDefault();
        document.addEventListener("contextmenu", contextmenuEvent);

        const clickEvent = () => open_cb(0);
        document.addEventListener("click", clickEvent);

        const kEvent = (event) => {
            if (event.code === "Escape" || event.key === "Escape") {
                return open_cb(0);
            }
            if (event.ctrlKey && event.altKey && (event.code === "KeyO" || event.key === "o" || event.key === "O")) {
                open_cb();
            }
        };
        document.addEventListener("keydown", kEvent);

        const aElements = [...document.getElementsByTagName("a")];

        const aEvent = (event) => {
            if (event.target.getAttribute("select") == "true") {
                event.target.removeAttribute("select");
                event.target.removeAttribute("style");
            } else {
                event.target.setAttribute("select", "true");
                Object.assign(event.target.style, {
                    paddingLeft: "4px",
                    paddingRight: "4px",
                    borderWidth: "2px",
                    borderStyle: "solid",
                    borderColor: "#ff9933"
                });
                preloadLink(event.target.href);
            }
        };

        const open_cb = (open = 1) => {
            const links = [...document.querySelectorAll("a[select=true]")];
            if (links.length > 0) {
                const urls = [];
                links.forEach(a => {
                    try {
                        if (open === 1 && !urls.includes(a.href)) {
                            urls.push(a.href);
                            new URL(a.href);
                            GM_openInTab(a.href);
                        }
                    } catch (error) {
                        console.error(a.href, error);
                    }
                    a.removeAttribute("select");
                    a.removeAttribute("style");
                });
            }
            aElements.forEach(a => a.removeEventListener("mouseenter", aEvent));
            document.removeEventListener("keydown", kEvent);
            document.removeEventListener("click", clickEvent);
            setTimeout(() => {
                document.removeEventListener("contextmenu", contextmenuEvent);
            }, 1000);
        };

        aElements.forEach(a => a.addEventListener("mouseenter", aEvent));

        document.addEventListener("mousedown", (event) => {
            if (event.button == 2) {
                open_cb();
            }
        });
    };

    const kEvent = (event) => {
        if (event.ctrlKey && event.altKey && (event.code === "KeyU" || event.key === "u" || event.key === "U")) {
            openElementLinks();
        }
    };

    document.addEventListener("keydown", kEvent);
    document.addEventListener("dblclick", () => openElementLinks());

    GM_registerMenuCommand(i18n.oeu, () => openElementLinks());

})();