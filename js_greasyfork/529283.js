// ==UserScript==
// @name WorkshopEnhance
// @version 2025/07/06
// @author Canaan HS
// @description 一個簡單的工作坊網址替換腳本，為網址添加 searchtext=<標題>
// @description:zh-TW 一個簡單的工作坊網址替換腳本，為網址添加 searchtext=<標題>
// @description:zh-CN 一个简单的工作坊网址替换脚本，为网址添加 searchtext=<标题>
// @description:en A simple workshop URL replacement script that adds searchtext=<title> to the URL

// @license MPL-2.0
// @match *://steamcommunity.com/*
// @icon https://cdn-icons-png.flaticon.com/512/220/220608.png

// @noframes
// @grant none

// @run-at document-start
// @namespace https://greasyfork.org/users/989635
// @downloadURL https://update.greasyfork.org/scripts/529283/WorkshopEnhance.user.js
// @updateURL https://update.greasyfork.org/scripts/529283/WorkshopEnhance.meta.js
// ==/UserScript==

(async () => {

    const url = location.href;
    const app = /^https:\/\/steamcommunity\.com\/app\/\d+/;
    const workshop = /^https:\/\/steamcommunity\.com\/workshop\/browse\/\?appid=\d+/;
    const sharedfiles = /^https:\/\/steamcommunity\.com\/sharedfiles\/filedetails\/\?id=\d+/;

    if (app.test(url)) {
        WaitElem(".workshop_home_content", content => {
            content.querySelectorAll("a.workshop_item_link").forEach(a => {
                const title = a.querySelector(".workshop_item_title")?.textContent;
                title && ReUri(a, title);
            })
        })
    } else if (workshop.test(url)) {
        WaitElem(".workshopBrowseItems", items => {
            WaitLoad(items, 300, () => {
                items.querySelectorAll(".workshopItem").forEach(div => {
                    const title = div.querySelector(".workshopItemTitle")?.textContent;
                    title && div.querySelectorAll("a:not(.workshop_author_link)").forEach(a => ReUri(a, title));
                })
            })
        })

        WaitElem(".pagebtn", buttons => {
            if (buttons.length === 2) {
                let Jump = false;

                const TurnPage = (Url) => {
                    Jump = true;
                    location.assign(Url);
                };

                window.addEventListener("keydown", event => {
                    const key = event.key;
                    if (key === "ArrowLeft" && buttons[0].hasAttribute("href") && !Jump) {
                        TurnPage(buttons[0].href);
                    } else if (key === "ArrowRight" && buttons[1].hasAttribute("href") && !Jump) {
                        TurnPage(buttons[1].href);
                    }
                }, { capture: true });
            }
        }, true)
    } else if (sharedfiles.test(url)) {
        WaitElem(".workshopItemTitle", title => ReUri(url, title?.textContent ?? ""));
    }

    function Debounce(func, delay) {
        let timer = null;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(function () {
                func(...args);
            }, delay);
        }
    };

    function ReUri(uri, title) {
        const isElement = uri instanceof Element;
        const Uri = isElement ? uri.href : uri;

        const newUri = Uri.includes("&searchtext=")
            ? Uri.replace(/(&searchtext=)(.*)?/, `$1${title}`)
            : `${Uri}&searchtext=${title}`;

        isElement ? uri.href = newUri : history.replaceState(null, '', newUri);
    };

    function WaitLoad(container, debounce, run) {
        const observer = new MutationObserver(Debounce(() => { run() }, debounce));
        observer.observe(container, { subtree: true, childList: true, attributes: true, characterData: true });
    };

    function WaitElem(selector, found, all = false) {
        const observer = new MutationObserver(() => {
            const result = all ? document.querySelectorAll(selector) : document.querySelector(selector);
            if (all ? result.length > 0 : result) {
                observer.disconnect();
                found(result);
            }
        });
        observer.observe(document, { subtree: true, childList: true });
    };

})();