// ==UserScript==
// @name         SoundCloud Cover Downloader
// @name:zh-CN   SoundCloud封面下载器
// @namespace    http://tampermonkey.net/
// @version      2024-10-09
// @description  Use Alt+C to download cover image from soundcloud
// @description:zh-CN  使用Alt+C下载SoundCloud的封面图片
// @author       Nolca
// @license      MIT
// @match        https://soundcloud.com/*
// @icon         https://soundcloud.com/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/511844/SoundCloud%20Cover%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/511844/SoundCloud%20Cover%20Downloader.meta.js
// ==/UserScript==
const DEBUG = true;
const cli = { x: 0, y: 0 };
const l = {
    leaveBlankToCopy: {
        "zh-CN": "留空以复制封面URL",
        "en-US": "Leave Filename blank to copy cover URL"
    },
    fileName: {
        "zh-CN": "文件名",
        "en-US": "Filename"
    },
    useAltC: {
        "zh-CN": "Alt+C下载当前封面；\n打开播放列表后，下载鼠标指向的封面",
        "en-US": "Alt+C to download current cover;\nOpen playlist and download the cover under mouse cursor"
    },
    alwaysRename: {
        "zh-CN": "总是重命名",
        "en-US": "Always Rename"
    },
    alwaysRenameTip: {
        "zh-CN": "每次按下Alt+C时，都会弹窗询问文件名",
        "en-US": "Every time you press Alt+C, a prompt will ask for filename"
    }
};
let LANG = GM_getValue('userLang') || navigator.language || navigator.userLanguage;
 
 
let menu_tip = GM_registerMenuCommand(
    l.useAltC[LANG],
    function () {
        GM_unregisterMenuCommand(menu_tip);
    },
    {
        id: 'menu_tip',
        autoClose: false,
        title: l.useAltC[LANG]
    }
);
 
function menu_directDownload_click() {
    GM_setValue('alwaysRename', !GM_getValue('alwaysRename'));
    // GM_unregisterMenuCommand(menu_directDownload);
    menu_directDownload = menu_directDownload_regist();
};
function menu_directDownload_regist() {
    return GM_registerMenuCommand(
        `${l.alwaysRename[LANG]}: ${GM_getValue('alwaysRename') ? '✅' : '❌'}`,
        menu_directDownload_click,
        {
            id: 'menu_directDownload',
            accessKey: 'r',
            autoClose: false,
            title: l.alwaysRenameTip[LANG]
        }
    );
};
if (GM_getValue('alwaysRename') === undefined) GM_setValue('alwaysRename', true);
var menu_directDownload = menu_directDownload_regist();
 
 
document.removeEventListener('keydown', event_keydown);
document.removeEventListener('mousemove', event_mousemove);
 
async function download_xhr2_blob(url, filenameDefault = "cover_soundcloud") {
    let filename = filenameDefault;
    if (GM_getValue('alwaysRename') === true) {
        filename = prompt(`${l.leaveBlankToCopy[LANG]}:\n${url}\n\n${l.fileName[LANG]}:`, filenameDefault);
        if (filename === "") {
            // Copy URL to clipboard
            navigator.clipboard.writeText(url.replace(/-t500x500/, '-original'));
            return;
        } else if (filename === null) return;
    }
 
    const res = await fetch(url);
    const blob = await res.blob();
 
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
 
    URL.revokeObjectURL(a.href);
    a.remove();
}
 
function get_coverUrl_from(span, regex = /-t50x50/) {
    if (span) {
        const coverUrl = span.style.backgroundImage.match(/url\("(.+)"\)/)[1];
        // 将-t50x50替换为-t500x500
        return coverUrl.replace(regex, '-t500x500');
    } else {
        console.error("span not found");
    }
}
 
function get_wrapper_coverSpan() {
    const elem = document.elementFromPoint(cli.x, cli.y);
    const parentWrapper = elem.closest('div.queue__itemWrapper');
    const coverPic = parentWrapper.querySelector("div > div.queueItemView__artwork > div.image.queueItemView__artworkImage > span");
    return {
        wrapper: parentWrapper,
        span: coverPic
    };
}
 
function event_downloader_cover() {
    let author, title, coverUrl;
    const elem_playlist = document.querySelector("#app > div.playControls.g-z-index-control-bar.m-visible.m-queueVisible > section > div > div.playControls__queue > div > div.queue__scrollable.g-scrollable.g-scrollable-v > div.queue__scrollableInner.g-scrollable-inner > div > div > div");
    if (elem_playlist) {
        // alert("playList opened");
        const { wrapper, span } = get_wrapper_coverSpan();
        coverUrl = get_coverUrl_from(span);
 
        const details = wrapper.querySelector("div > div.queueItemView__details");
        author = details.querySelector("div.queueItemView__meta > a.queueItemView__username").innerHTML;
        title = details.querySelector("div.queueItemView__title > a").innerHTML;
 
 
    } else {
        // alert("playList closed");
        const span = document.querySelector("#app > div.playControls.g-z-index-control-bar.m-visible > section > div > div.playControls__elements > div.playControls__soundBadge > div > a > div > span");
        coverUrl = get_coverUrl_from(span);
 
        const select = document.querySelector("#app > div.playControls.g-z-index-control-bar.m-visible > section > div > div.playControls__elements > div.playControls__soundBadge > div > div.playbackSoundBadge__titleContextContainer.sc-mr-3x");
        author = select.querySelector("a").innerHTML;
        title = select.querySelector("div > a > span:nth-child(2)").innerHTML;
    }
    const filename = `@${author} - ${title}☁️`;
    console.log("event_downloader_cover: coverUrl=", coverUrl);
    download_xhr2_blob(coverUrl, filename).then().catch(console.error);
}
 
function is_alt(lowerCase, event) {
    return event.altKey && event.key === lowerCase || event.altKey && event.key === lowerCase.toUpperCase();
}
function is_alt_shift(lowerCase, event) {
    return event.altKey && event.shiftKey && event.key === lowerCase || event.altKey && event.shiftKey && event.key === lowerCase.toUpperCase();
}
function event_keydown(event) {
    if (is_alt('c', event)) {
        event_downloader_cover();
    } else if (is_alt('s', event)) {
        event_downloader_song();
    }
}
function event_mousemove(event) {
    cli.x = event.clientX;
    cli.y = event.clientY;
    // console.log(cli);
}
 
document.addEventListener('keydown', event_keydown);
document.addEventListener('mousemove', event_mousemove);