// ==UserScript==
// @name         Emby调用弹弹play
// @namespace    https://www.dandanplay.com/
// @version      1.1
// @description  Emby调用弹弹play播放器，串流或播放本地视频
// @license      MIT
// @author       @kaedei
// @match        http*://*/web/index.html
// @downloadURL https://update.greasyfork.org/scripts/443916/Emby%E8%B0%83%E7%94%A8%E5%BC%B9%E5%BC%B9play.user.js
// @updateURL https://update.greasyfork.org/scripts/443916/Emby%E8%B0%83%E7%94%A8%E5%BC%B9%E5%BC%B9play.meta.js
// ==/UserScript==


let api_key = '';

const reg = /\/[a-z]{2,}\/\S*?id=/;


let timer = setInterval(function () {
    let potplayer = document.querySelectorAll("div[is='emby-scroller']:not(.hide) #embyDandanplay")[0];
    if (!potplayer) {
        let mainDetailButtons = document.querySelectorAll("div[is='emby-scroller']:not(.hide) .mainDetailButtons")[0];
        if (mainDetailButtons) {
            let buttonhtml = `
        <div class ="detailButtons mainDetailButtons flex align-items-flex-start flex-wrap-wrap focuscontainer-x focusable">
            <button id="embyDandanplay" type="button" class="btnResume raised detailButton emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="弹弹play - 串流播放"> <div class="detailButton-content"> <i class="md-icon button-icon"></i>  <span>弹弹play串流播放</span> </div> </button>
            <button id="embyDandanplayLocal" type="button" class="btnResume raised detailButton emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="弹弹play - 本地播放"> <div class="detailButton-content"> <i class="md-icon button-icon"></i>  <span>弹弹play本地播放</span> </div> </button>
            <button id="embyCopyUrl" type="button" class="btnResume raised detailButton emby-button emby-button-backdropfilter raised-backdropfilter detailButton-primary" title="复制链接"> <div class="detailButton-content"> <i class="md-icon button-icon">link</i>  <span>复制链接</span> </div> </button>
        </div>`
            mainDetailButtons.insertAdjacentHTML('afterend', buttonhtml)
            document.querySelector("div[is='emby-scroller']:not(.hide) #embyDandanplay").onclick = embyDandanplay;
            document.querySelector("div[is='emby-scroller']:not(.hide) #embyDandanplayLocal").onclick = embyDandanplayLocal;
            document.querySelector("div[is='emby-scroller']:not(.hide) #embyCopyUrl").onclick = embyCopyUrl;
            api_key = ApiClient.accessToken();
        }
    }
}, 1000)

async function getItemInfo() {
    let itemInfoUrl = window.location.href.replace(reg, "/emby/Items/").split('&')[0] + "/PlaybackInfo?api_key=" + api_key;
    console.log("itemInfo: " + itemInfoUrl);
    let response = await fetch(itemInfoUrl);
    if (response.ok) {
        return await response.json();
    } else {
        alert("获取视频信息失败，请在媒体信息页面（页面中显示了文件路径、大小、格式、编码等信息）中点击此按钮。或是检查Emby网络。\r\n错误：" + response.status + " " + response.statusText);
        throw new Error(response.statusText);
    }
}

function getSeek() {
    let resumeButton = document.querySelector("div[is='emby-scroller']:not(.hide) div.resumeButtonText");
    let seek = null;
    if (resumeButton) {
        const re = /[\d+:]+\d+/;
        if (re.exec(resumeButton.innerText)) {
            seek = re.exec(resumeButton.innerText)[0];
        }
    }
    return seek;
}

function getSubUrl(mediaSource) {
    const selectSubtitles = document.querySelector("div[is='emby-scroller']:not(.hide) select.selectSubtitles");
    let subTitleUrl = '';
    if (selectSubtitles && selectSubtitles.value > 0) {
        if (mediaSource.MediaStreams[selectSubtitles.value].IsExternal) {
            let subtitleCodec = mediaSource.MediaStreams[selectSubtitles.value].Codec;
            const domain = window.location.href.replace(reg, "/emby/videos/").split('&')[0];
            subTitleUrl = `${domain}/${mediaSource.Id}/Subtitles/${selectSubtitles.value}/Stream.${subtitleCodec}?api_key=${api_key}`;
            console.log(subTitleUrl);
        }
    }
    return subTitleUrl;
}


async function getEmbyMediaUrl() {
    const mediaSourceId = document.querySelector("div[is='emby-scroller']:not(.hide) select.selectSource").value;
    //let selectAudio = document.querySelector("div[is='emby-scroller']:not(.hide) select.selectAudio");
    const itemInfo = await getItemInfo();
    const mediaSource = itemInfo.MediaSources.find(m => m.Id == mediaSourceId);
    let PlaySessionId = itemInfo.PlaySessionId;
    let subUrl = await getSubUrl(mediaSource);
    //let streamUrl = ApiClient._serverAddress +'/emby'+ mediaSource.DirectStreamUrl;
    const domain = window.location.href.replace(reg, "/emby/videos/").split('&')[0];
    let streamUrl = `${domain}/stream.${mediaSource.Container}?api_key=${api_key}&Static=true&MediaSourceId=${mediaSourceId}&PlaySessionId=${PlaySessionId}`;
    const intent = getIntent(mediaSource);
    console.log(streamUrl, subUrl, intent);
    return Array(streamUrl, subUrl, intent);
}

function getIntent(mediaSource) {
    const title = mediaSource.Path.split('/').pop();
    let position = 0;
    if (getSeek()) {
        const times = getSeek().split(':').map(Number);
        if (times.length == 3) {
            position = (times[0] * 3600 + times[1] * 60 + times[2]) * 1000;
        } else if (times.length == 2) {
            position = (times[0] * 60 + times[1]) * 1000;
        }
    }
    let externalSubs = mediaSource.MediaStreams.filter(m => m.IsExternal == true);
    const subs = ''; //要求是android.net.uri[] ?
    let subs_name = '';
    let subs_filename = '';
    const subs_enable = '';
    if (externalSubs) {
        subs_name = externalSubs.map(s => s.DisplayTitle);
        subs_filename = externalSubs.map(s => s.Path.split('/').pop());
    }
    return {
        title: title,
        position: position,
        subs: subs,
        subs_name: subs_name,
        subs_filename: subs_filename,
        subs_enable: subs_enable
    };
}

async function embyPot() {
    let mediaUrl = await getEmbyMediaUrl();
    let poturl = `potplayer://${encodeURI(mediaUrl[0])} /sub=${encodeURI(mediaUrl[1])} /current /seek=${getSeek()}`;
    console.log(poturl);
    window.open(poturl, "_blank");
}
//稍后播放，添加至potPlayer播放列表
async function embyPotAdd() {
    let mediaUrl = await getEmbyMediaUrl();
    let poturl = `potplayer://${encodeURI(mediaUrl[0])} /sub=${encodeURI(mediaUrl[1])} /current /add /seek=${getSeek()}`;
    console.log(poturl);
    window.open(poturl, "_blank");
}
async function embyVlc() {
    let mediaUrl = await getEmbyMediaUrl();
    let vlcUrl = `vlc://${encodeURI(mediaUrl[0])}`;
    if (getOS() == 'ios') {
        vlcUrl = `vlc-x-callback://x-callback-url/stream?url=${encodeURI(mediaUrl[0])}&sub=${encodeURI(mediaUrl[1])}`;
    }
    console.log(vlcUrl);
    window.open(vlcUrl, "_blank");
}
async function embyIINA() {
    let mediaUrl = await getEmbyMediaUrl();
    let iinaUrl = `iina://weblink?url=${escape(mediaUrl[0])}&new_window=1`;
    console.log(`iinaUrl= ${iinaUrl}`);
    window.open(iinaUrl, "_blank");
}
async function embyMX() {
    let mediaUrl = await getEmbyMediaUrl();
    const intent = mediaUrl[2];
    //mxPlayer free
    let mxUrl = `intent:${encodeURI(mediaUrl[0])}#Intent;package=com.mxtech.videoplayer.ad;S.title=${intent.title};i.position=${intent.position};end`;
    //mxPlayer Pro
    //let mxUrl = `intent:${encodeURI(mediaUrl[0])}#Intent;package=com.mxtech.videoplayer.pro;S.title=${intent.title};i.position=${intent.position};end`;
    console.log(mxUrl);
    window.open(mxUrl, "_blank");
}
async function embyNPlayer() {
    let mediaUrl = await getEmbyMediaUrl();
    let nUrl = `nplayer-${encodeURI(mediaUrl[0])}`;
    console.log(nUrl);
    window.open(nUrl, "_blank");
}
async function embyCopyUrl() {
    let mediaUrl = await getEmbyMediaUrl();
    let textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.style.position = 'absolute';
    textarea.style.clip = 'rect(0 0 0 0)';
    textarea.value = mediaUrl[0];
    textarea.select();
    if (document.execCommand('copy', true)) {
        console.log(`copyUrl = ${mediaUrl[0]}`);
        this.innerText = '复制成功';
    }
    //need https
    // if (navigator.clipboard) {
    //     console.log('test');
    //     navigator.clipboard.writeText(mediaUrl[0]).then(() => {
    //          console.log(`copyUrl = ${mediaUrl[0]}`);
    //          this.innerText = '复制成功';
    //     })
    // }
}
function getOS() {
    const u = navigator.userAgent
    if (!!u.match(/compatible/i) || u.match(/Windows/i)) {
        return 'windows'
    } else if (!!u.match(/Macintosh/i) || u.match(/MacIntel/i)) {
        return 'macOS'
    } else if (!!u.match(/iphone/i) || u.match(/Ipad/i)) {
        return 'ios'
    } else if (u.match(/android/i)) {
        return 'android'
    } else if (u.match(/Ubuntu/i)) {
        return 'Ubuntu'
    } else {
        return 'other'
    }
}

async function embyDandanplay() {
    let mediaUrl = await getEmbyMediaUrl();
    let streamUrl = mediaUrl[0];
    let subUrl = mediaUrl[1];
    var urlPart = streamUrl;
    let fullPath = document.querySelector(".mediaSources .mediaSource .sectionTitle").firstChild.innerText;
    if (fullPath) {
        urlPart += `|filePath=${fullPath}`;
    }
    let ddplayUrl = `ddplay:${encodeURIComponent(urlPart)}`;
    location.href = ddplayUrl;
}

async function embyDandanplayLocal() {
    let fullPath = document.querySelector(".mediaSources .mediaSource .sectionTitle").firstChild.innerText;
    let regex = new RegExp('^[a-zA-Z]:');
    if (regex.test(fullPath)) {
        let ddplayUrl = `ddplay:${encodeURIComponent(fullPath)}`;
        location.href = ddplayUrl;
    } else {
        alert("文件路径不是本地路径，请用串流播放:\r\n" + fullPath);
    }
}
