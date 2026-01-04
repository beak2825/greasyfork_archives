// ==UserScript==
// @name         Jellyfin with Potplayer
// @namespace    https://greasyfork.org/zh-CN/scripts/487579-jellyfin-with-potplayer
// @version      1.2
// @license      MIT
// @description  play video with Potplayer
// @author       jasmineamberr 原作者:Tccoin https://github.com/tccoin/Jellyfin-Potplayer
// @match        http://192.168.2.21:8096/web/index.html
// @grant               GM_registerMenuCommand
// @grant               GM_setValue
// @grant               GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/487579/Jellyfin%20with%20Potplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/487579/Jellyfin%20with%20Potplayer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let api_key = "f3ed4fdbc14042b4b8a2a87291726b2f"
    async function getMovie(jellyfin_url, userid, itemid) {
        let id
        let r = await fetch(`${jellyfin_url}/Users/${userid}/Items?ParentId=${itemid}`, {
            headers: {
                "X-Emby-Authorization": `MediaBrowser Client="tampermonkey", Token="${api_key}"`
            }
        })
        let data = await r.json()
        id = data.Items[0].Id
        if (["Episode", "Movie"].includes(data.Items[0].Type)) {
            return id
        } else {
            return getMovie(jellyfin_url, userid, id)
        }
    }
    let openPotplayer = async (itemid) => {
        let id;
        let jellyfin_url = ApiClient._serverAddress // eslint-disable-line
        let userid = (await ApiClient.getCurrentUser()).Id; // eslint-disable-line
        let r = await ApiClient.getItem(userid, itemid) // eslint-disable-line
        if (["Episode", "Movie", "Video"].includes(r.Type)) {
            id = itemid
        } else if ("Person" == r.Type) {
            return
        } else {
            id = await getMovie(jellyfin_url, userid, itemid)
        }
        let url = `${jellyfin_url}/Items/${id}/Download?api_key=${api_key}`
        // console.log(url)
        window.open('potplayer://' + url)
    }

    let bindEvent = async () => {
        let buttons = [];
        let retry = 6 + 1;
        while (buttons.length == 0 && retry > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            buttons = document.querySelectorAll('[data-mode=play],[data-mode=resume],[data-action=resume]');
            retry -= 1;
        }
        for (let button of buttons) {
            let nextElementSibling = button.nextElementSibling;
            let parentElement = button.parentElement;
            let outerHTML = button.outerHTML;
            button.parentElement.removeChild(button);
            let newButton = document.createElement('button');
            if (nextElementSibling) {
                parentElement.insertBefore(newButton, nextElementSibling);
            } else {
                parentElement.append(newButton);
            }
            newButton.outerHTML = outerHTML;
        }
        buttons = document.querySelectorAll('[data-mode=play],[data-mode=resume]');
        for (let button of buttons) {
            button.removeAttribute('data-mode');
            button.addEventListener('click', e => {
                e.stopPropagation();
                e.preventDefault();
                let itemid = /id=(.*?)&serverId/.exec(window.location.hash)[1];
                openPotplayer(itemid);
            });
        }
        buttons = document.querySelectorAll('[data-action=resume]');
        for (let button of buttons) {
            button.removeAttribute('data-action');
            button.addEventListener('click', e => {
                e.stopPropagation();
                e.preventDefault();
                let item = e.target;
                let itemid;
                while (item != document && !item.hasAttribute('data-id')) {
                    item = item.parentNode
                }
                if (item != document) {
                    itemid = item.getAttribute('data-id');
                } else {
                    let option = document.querySelector("#itemDetailPage:not(.hide) [class~='selectSourceContainer'] [is='emby-select'] option:checked")
                    if (option) {
                        itemid = option.value
                    } else {
                        item = e.target
                        while (!item.querySelector("button[is='emby-playstatebutton']")) {
                            item = item.parentNode
                        }
                        itemid = item.querySelector("button[is='emby-playstatebutton']").getAttribute('data-id');
                    }
                }
                openPotplayer(itemid);
            });
        }
    };

    let lazyload = async () => {
        let items = document.querySelectorAll('[data-src].lazy');
        let y = document.scrollingElement.scrollTop;
        let intersectinglist = [];
        for (let item of items) {
            let windowHeight = document.body.offsetHeight;
            let itemTop = item.getBoundingClientRect().top;
            let itemHeight = item.offsetHeight;
            if (itemTop + itemHeight >= 0 && itemTop <= windowHeight) {
                intersectinglist.push(item);
            }
        }
        for (let item of intersectinglist) {
            item.style.setProperty('background-image', `url("${item.getAttribute('data-src')}")`);
            item.classList.remove('lazy');
            item.classList.remove('lazy-hidden');
            item.removeAttribute('data-src');
        };
    };

    let key = "启用PotPlayer"
    let enabled = GM_getValue(key)
    GM_registerMenuCommand(`${enabled?"已开启":"已关闭"}`, () => {
        GM_setValue(key, !enabled)
        location.reload()
    })
    if (enabled) {
        const observer = new MutationObserver((mutations, observer) => {
            bindEvent();
            lazyload()
        });
        observer.observe(document, {
            subtree: true,
            childList: true
        });
    }
})();