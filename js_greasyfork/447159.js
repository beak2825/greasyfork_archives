// ==UserScript==
// @name          EBC Live
// @namespace     abner6718
// @description   移除遮罩，快速進入 東森 EBC YT 直播頻道
// @copyright     2022, abner6718 (https://greasyfork.org/en/users/929971-abner6718)
// @license       MIT
// @version       0.0.1
// @match         https://news.ebc.net.tw/live*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=net.tw
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/447159/EBC%20Live.user.js
// @updateURL https://update.greasyfork.org/scripts/447159/EBC%20Live.meta.js
// ==/UserScript==

GM_addStyle(`
#livePlayer-iframe-overlay {
    display: none;
}

.ytp-cued-thumbnail-overlay {
    display: none;
}
`)

function get_youtube_link(){
    let youtube_code = document.querySelector('.live-else-little-box').getAttribute('data-code');

    return `https://www.youtube.com/watch?v=${youtube_code}`;
}

GM_registerMenuCommand("前往 Youtube", () => {
    window.location.href = get_youtube_link();
});
