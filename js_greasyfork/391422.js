// ==UserScript==
// @name        S1屏蔽GIF头像
// @namespace   https://github.com/ipcjs
// @version     0.1.0
// @description 有些GIF头像实在是太晃眼了（
// @author       ipcjs
// @include     *://bbs.saraba1st.com/2b/*
// @grant       GM_addStyle
// @grant       unsafeWindow
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://update.greasyfork.org/scripts/391422/S1%E5%B1%8F%E8%94%BDGIF%E5%A4%B4%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/391422/S1%E5%B1%8F%E8%94%BDGIF%E5%A4%B4%E5%83%8F.meta.js
// ==/UserScript==

/**
 * 要让GIF图静止, 貌似挺麻烦, 当前使用简单的白名单方案😅
 * 该名单收录头像为GIF图的用户uid, 欢迎PR👌
 * */
const uids = [
    '511411',
]
uids.forEach(uid=>{
    /** @type {HTMLElement[]} */
    const $avatarList = document.querySelectorAll(`a[href="space-uid-${uid}.html"] > img`)
    Array.from($avatarList).forEach($avatar=>{
        $avatar.src = 'https://avatar.saraba1st.com/images/noavatar_middle.gif'
    })
})