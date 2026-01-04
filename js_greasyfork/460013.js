// ==UserScript==
// @name         TJUPT Tweaks
// @name:zh-CN   北洋园优化
// @namespace    https://github.com/amorphobia/tampermonkey-scripts
// @version      0.5.6
// @description  Current tweaks: fold / hide the bannar, hide sticky torrents, botton to copy direct link on torrent list page, color blind mode, automatically say thanks
// @description:zh-CN  目前的优化：折叠／隐藏横幅，隐藏置顶种子，种子列表页面添加按钮点击可复制直链，色盲模式，自动说谢谢
// @author       amorphobia
// @match        *://tjupt.org/*
// @match        *://*.tjupt.org/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @noframes
// @homepageURL  https://github.com/amorphobia/tampermonkey-scripts
// @supportURL   https://github.com/amorphobia/tampermonkey-scripts/issues
// @icon         https://tjupt.org/assets/favicon/favicon.png
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/460013/TJUPT%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/460013/TJUPT%20Tweaks.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const github = "https://github.com/amorphobia/tampermonkey-scripts/";
    const num_emoji = ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];

    let menu_items = [
        {
            "id": "m_bannerAutoFold",
            "name": "自动折叠横幅",
            "display": "自动折叠横幅",
            "type": "switch",
            "value": true
        },
        {
            "id": "m_bannerHide",
            "name": "隐藏横幅",
            "display": "隐藏横幅（隐藏时折叠设置无效）",
            "type": "switch",
            "value": false
        },
        {
            "id": "m_hideSticky",
            "name": "隐藏置顶种子",
            "display": [
                "显示所有置顶",
                "隐藏一重置顶",
                "隐藏一、二重置顶",
                "隐藏所有置顶" ],
            "type": "gear",
            "value": 0
        },
        {
            "id": "m_torrentDirectLink",
            "name": "种子直链按钮",
            "display": "种子直链按钮（左键点击按钮复制直链）",
            "type": "switch",
            "value": true
        },
        {
            "id": "m_colorBlindMode",
            "name": "色盲模式",
            "display": "色盲模式",
            "type": "switch",
            "value": false
        },
        {
            "id": "m_autoSayThanks",
            "name": "自动说谢谢",
            "display": "自动说谢谢",
            "type": "switch",
            "value": false
        }
    ];
    let menu_registered = [];

    for (let i = 0; i < menu_items.length; i++) {
        if (GM_getValue(menu_items[i].id) == null) {
            GM_setValue(menu_items[i].id, menu_items[i].value);
        }
    }

    registerMenu();

    function registerMenu() {
        if (menu_registered.length > menu_items.length) {
            for (let i = 0; i < menu_registered.length; i++) {
                GM_unregisterMenuCommand(menu_registered[i]);
            }
        }

        for (let i = 0; i < menu_items.length; i++) {
            menu_items[i].value = GM_getValue(menu_items[i].id);
            const item = menu_items[i];
            const value = menu_items[i].value;

            if (item.type == "switch") {
                menu_registered[i] = GM_registerMenuCommand(`${value ? "✅" : "❌"}${item.display}`, function () {
                    toggleSwitch(item);
                });
            } else if (item.type == "gear") {
                menu_registered[i] = GM_registerMenuCommand(`${num_emoji[value]}${item.display[value]}`, function () {
                    shiftGear(item);
                });
            } else {
                menu_registered[i] = GM_registerMenuCommand(`${item.id}`, function () { console.log(`Unrecognized menu item: ${item.id}`) })
            }
        }

        menu_registered[menu_registered.length] = GM_registerMenuCommand("💬反馈与建议", function () {
            window.GM_openInTab(github, { active: true, insert: true, setParent: true });
        });
    }

    function toggleSwitch(item) {
        const status = item.value ? "关闭" : "开启";
        GM_setValue(item.id, !item.value);
        GM_notification({
            text: `已${status}「${item.name}」\n（点击刷新网页后生效）`,
            timeout: 3500,
            onclick: function () { location.reload(); }
        });
        registerMenu();
    }

    function shiftGear(item) {
        const new_value = (item.value + 1) % item.display.length;
        GM_setValue(item.id, new_value);
        GM_notification({
            text: `切换为「${item.display[new_value]}」\n（点击刷新网页后生效）`,
            timeout: 3500,
            onclick: function () { location.reload(); }
        })
        registerMenu();
    }

    function getValue(id) {
        for (const item of menu_items) {
            if (item.id == id) {
                return item.value;
            }
        }
    }

    function getPasskey() {
        const link = document.querySelector("[title=\"Latest Torrents\"]");
        const re = /passkey=([\d\w]+)/;
        const passkey = re.exec(link.href)[1];
        return passkey;
    }

    let css = "";
    if (getValue("m_bannerHide")) {
        css = `.logo_img img {\n`
            + `    display: none;\n`
            + `}\n`;
    } else if (getValue("m_bannerAutoFold")) {
        const logo_img = document.querySelector(".logo_img");
        const original_height = logo_img.clientHeight;

        css = `.logo_img {\n`
            + `    height: 10px;\n`
            + `    overflow: hidden;\n`
            + `    transition: height 0.5s;\n`
            + `}\n`
            + `\n`
            + `.logo_img:hover {\n`
            + `    height: ${original_height}px;\n`
            + `}\n`;
    }

    switch (getValue("m_hideSticky")) {
    case 3:
        css += `.triple_sticky_bg {\n`
             + `    display: none;\n`
             + `}\n`;
        // fallsthrough
    case 2:
        css += `.double_sticky_bg {\n`
             + `    display: none;\n`
             + `}\n`;
        // fallsthrough
    case 1:
        css += `.sticky_bg {\n`
             + `    display: none;\n`
             + `}\n`;
        // fallsthrough
    default:
    }

    if (getValue("m_torrentDirectLink")) {
        const passkey = getPasskey();
        const id_re = /id=([\d]+)/;

        let tds = document.querySelectorAll("table.torrentname > tbody > tr:nth-of-type(1) > td:nth-of-type(3)");

        for (let td of tds) {
            const dl = td.querySelector("a");
            const id = id_re.exec(dl.href)[1];
            const direct_link = `https://www.tjupt.org/download.php?id=${id}&passkey=${passkey}`;
            let img = document.createElement("img");
            img.setAttribute("src", "pic/trans.gif");
            img.setAttribute("class", "torrent_direct_link");
            img.setAttribute("alt", "DL");
            let a = document.createElement("a");
            a.setAttribute("title", "左键单击复制，链接中包含个人秘钥Passkey，切勿泄露！");
            a.setAttribute("onclick", "return false");
            a.setAttribute("id", "direct_link");
            a.setAttribute("href", direct_link);
            a.setAttribute("data-clipboard-text", direct_link);
            a.appendChild(img);
            td.prepend(a);
        }

        css += `img.torrent_direct_link {\n`
             + `    width: 16px;\n`
             + `    height: 16px;\n`
             + `    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAH5QTFRFR3BMyKN4cz0Td3d3sLCw6enp////qHg4oaGhcz0TlpaWkV8opnU2lmQrjVklqHg4m2kvo3I03ruJiFMhn24y4r+N2raG5cSP9+jQg04e1rKD68uUnYpv6ceS0q5/fkkaoaGhzqp8h4eHr6+v+Pj4ekQXdkAV+/v78fHxy6Z6f0p3WgAAAAp0Uk5TAP///////5aWlrne7esAAACHSURBVBjTbc5HEsIwEERRA5qxLeecc77/BTEN0oq/m1ddKhnG36xxtPRhBq2UxyFlG5gAt5zXk+hc59IFRM3yQksTAdKOf3UpICxYCEFEXIQAL2NCnHkAJ/4s7jh2AH6uFrkPSOrvgrhOAFWvFn0FGCYWhDemAbBd6h/XBtgfuh1gP3X2fb4BlrkIUt3i2kgAAAAASUVORK5CYII=');\n`
             + `    padding-bottom: 1px;\n`
             + `}\n`;

        location.assign("javascript:registerClipboardJS('#direct_link');void(0)");
    }

    if (getValue("m_colorBlindMode")) {
        let spans = document.querySelectorAll("table.main > tbody > tr > td:nth-of-type(2) > ul > li > span[style=\"color: green\"]");
        for (let span of spans) {
            span.setAttribute("style", "color: blue");
        }
    }

    if (getValue("m_autoSayThanks") && location.href.indexOf("tjupt.org/details") >= 0) {
        const wait2s = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 2000);
        });
        wait2s.then(() => {
            let say = document.querySelector("[id=\"saythanks\"]");
            if (say && !say.disabled) {
                say.click();
            }
        }, () => {
            console.log("Failed to say thanks");
        });
    }

    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        let style_node = document.createElement("style");
        style_node.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(style_node);
    }
})();
