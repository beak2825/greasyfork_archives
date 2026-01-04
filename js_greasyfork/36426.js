// ==UserScript==
// @name         NGA_parse_uid
// @version      1.2.1
// @author       Inazuma
// @match        https://nga.178.com/*
// @match        https://bbs.ngacn.cc/*
// @match        https://bbs.nga.cn/*
// @match        http://nga.178.com/*
// @match        http://bbs.nga.cn/*
// @match        http://bbs.ngacn.cc/*
// @namespace    https://greasyfork.org/users/163468
// @description  在未登录/实名NGA时解析uid为用户名
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/36426/NGA_parse_uid.user.js
// @updateURL https://update.greasyfork.org/scripts/36426/NGA_parse_uid.meta.js
// ==/UserScript==

const replaceUID = async () => {
    const pattern = 'nuke.php?func=ucp&uid=';
    const uidMap = JSON.parse(await GM_getValue('uidMap', '{}'));
    [...document.querySelectorAll(`a[href*="${pattern}"]`)].map((v, i) => {
        const uid = v.href.split(pattern)[1];
        if (!uidMap[uid]) {
            if (v.parentNode.className === 'quote') {
                uidMap[uid] = v.innerText.slice(1, -1);
            } else if (v.parentNode.className === 'c3' && !v.querySelector('span[class="b silver"]')) {
                uidMap[uid] = v.innerText;
            }
        } else {
            v.innerText = uidMap[uid];
        }
    });
    await GM_setValue('uidMap', JSON.stringify(uidMap));
}

(async () => {
    await replaceUID();

    if (unsafeWindow.commonui) {
        const f = unsafeWindow.commonui.progbar;
        unsafeWindow.commonui.progbar = async (...args) => {
            f(...args);
            await replaceUID();
        }
    }

    [...document.querySelectorAll('a[href="被禁止的链接"]')].map((v, i) => {
        let link;
        if (v.parentNode.className !== 'nobr') {
            link = v.previousElementSibling.firstChild.innerText.replace(/<[^>]+>/g, '');
            v.setAttribute('href', link);
            v.innerText = v.innerText.replace(/被禁止的链接/g, link);
        } else {
            link = v.parentNode.parentNode.firstChild.innerText.replace(/<[^>]+>/g, '');
            v.setAttribute('href', link);
        }
    });

})();