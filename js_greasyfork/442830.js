// ==UserScript==
// @name         embyLaunchPotplayer
// @name:en      embyLaunchPotplayer
// @name:zh      embyLaunchPotplayer
// @name:zh-CN   embyLaunchPotplayer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  繁化備份自用
// @description:zh-cn emby调用外部播放器
// @license      MIT
// @author       @bpking
// @include       *emby*
// @include       *:8*
// @downloadURL https://update.greasyfork.org/scripts/442830/embyLaunchPotplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/442830/embyLaunchPotplayer.meta.js
// ==/UserScript==


let api_key = '';

const reg = /\/[a-z]{2,}\/\S*?id=/;


let timer = setInterval(function () {
  let potplayer = document.querySelectorAll("div[is='emby-scroller']:not(.hide) #embyPot")[0];
  if (!potplayer) {
    let mainDetailButtons = document.querySelectorAll("div[is='emby-scroller']:not(.hide) .mainDetailButtons")[0];
    if (mainDetailButtons) {
      let buttonhtml = `<div class ="flex">
                  <button id="embyPot" type="button" class="detailButton  emby-button" title="Potplayer"> <div class="detailButton-content"> <i class="md-icon detailButton-icon"></i>  <div class="detailButton-text">PotPlayer</div> </div> </button>
                  <button id="embyPotAdd" type="button" class="detailButton  emby-button" title="稍後播放"> <div class="detailButton-content"> <i class="md-icon detailButton-icon"></i>  <div class="detailButton-text">稍後播放</div> </div> </button>
                  <button id="embyVlc" type="button" class="detailButton  emby-button" title="VLC"> <div class="detailButton-content"> <i class="md-icon detailButton-icon"></i>  <div class="detailButton-text">VLC</div> </div> </button>
                  <button id="embyIINA" type="button" class="detailButton  emby-button" title="IINA"> <div class="detailButton-content"> <i class="md-icon detailButton-icon"></i>  <div class="detailButton-text">IINA</div> </div> </button>
                  <button id="embyNPlayer" type="button" class="detailButton  emby-button" title="NPlayer"> <div class="detailButton-content"> <i class="md-icon detailButton-icon"></i>  <div class="detailButton-text">NPlayer</div> </div> </button>
                  <button id="embyMX" type="button" class="detailButton  emby-button" title="MXPlayer"> <div class="detailButton-content"> <i class="md-icon detailButton-icon"></i>  <div class="detailButton-text">MXPlayer</div> </div> </button>
                  <button id="embyCopyUrl" type="button" class="detailButton  emby-button" title="複製連結"> <div class="detailButton-content"> <i class="md-icon detailButton-icon"></i>  <div class="detailButton-text">複製連結</div> </div> </button>
                      </div>`
      mainDetailButtons.insertAdjacentHTML('afterend', buttonhtml)
      document.querySelector("div[is='emby-scroller']:not(.hide) #embyPot").onclick = embyPot;
      document.querySelector("div[is='emby-scroller']:not(.hide) #embyPotAdd").onclick = embyPotAdd;
      document.querySelector("div[is='emby-scroller']:not(.hide) #embyIINA").onclick = embyIINA;
      document.querySelector("div[is='emby-scroller']:not(.hide) #embyNPlayer").onclick = embyNPlayer;
      document.querySelector("div[is='emby-scroller']:not(.hide) #embyMX").onclick = embyMX;
      document.querySelector("div[is='emby-scroller']:not(.hide) #embyCopyUrl").onclick = embyCopyUrl;
      document.querySelector("div[is='emby-scroller']:not(.hide) #embyVlc").onclick = embyVlc;
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
    alert("獲取影片訊息失敗，請檢查emby網路  " + response.status + " " + response.statusText);
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
  return Array(streamUrl, subUrl,intent);
}

function getIntent(mediaSource){
    const title = mediaSource.Path.split('/').pop();
    let position = 0;
    if (getSeek()) {
      const times = getSeek().split(':').map(Number);
      if(times.length == 3){
        position = (times[0]*3600 + times[1]*60 + times[2])*1000;
      }else if (times.length == 2) {
        position = (times[0]*60 + times[1])*1000;
      }
    }
    let externalSubs = mediaSource.MediaStreams.filter(m => m.IsExternal ==true);
    const subs = ''; //要求是android.net.uri[] ?
    let subs_name = '';
    let subs_filename = '';
    const subs_enable = '';
    if (externalSubs) {
        subs_name = externalSubs.map(s => s.DisplayTitle);
        subs_filename = externalSubs.map(s => s.Path.split('/').pop());
    }
    return {
       title : title,
       position : position,
       subs : subs,
       subs_name : subs_name,
       subs_filename : subs_filename,
       subs_enable : subs_enable
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
    this.innerText = '複製成功';
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


