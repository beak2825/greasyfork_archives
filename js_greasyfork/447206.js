// ==UserScript==
// @name          TVBS Live
// @namespace     abner6718
// @description   移除遮罩，快速進入 TVBS YT 直播頻道
// @copyright     2022, abner6718 (https://greasyfork.org/en/users/929971-abner6718)
// @license       MIT
// @version       0.0.1
// @match         https://news.tvbs.com.tw/live/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=tvbs.com.tw
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/447206/TVBS%20Live.user.js
// @updateURL https://update.greasyfork.org/scripts/447206/TVBS%20Live.meta.js
// ==/UserScript==

GM_addStyle(`
.plyr--stopped.plyr__poster-enabled .plyr__poster {
    display: none;
}
`)

function get_youtube_link(){
    let iframe_src = document.querySelector('.vdo iframe').getAttribute('src');
    let youtube_code = iframe_src.replace(/(?:http[s]:\/\/)?(?:www\.)?(?:youtube\.com)\/(?:embed\/)?(.+)\?(.+)/g, '$1');

    return `https://www.youtube.com/watch?v=${youtube_code}`;
}

GM_registerMenuCommand("前往 Youtube", () => {
    window.location.href = get_youtube_link();
});