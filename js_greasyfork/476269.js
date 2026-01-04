// ==UserScript==
// @name         hj-ge yi di
// @namespace    haijiao-script
// @version      18.0
// @author       QQ2095553763QQ2174853569
// @description  安装后就不要卸载了！切记！QQ2106433033QQ2095553763QQ1664471349
// @license      MIT
// @icon         https://pomf2.lain.la/f/erejxtfo.ico
// @match        *://*.hj*.com/*
// @match        *://*/post/details*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4
// @require      https://cdn.jsdelivr.net/npm/dplayer@1.27.1
// @require      https://cdn.jsdelivr.net/npm/hls.js@1.3.5
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/476269/hj-ge%20yi%20di.user.js
// @updateURL https://update.greasyfork.org/scripts/476269/hj-ge%20yi%20di.meta.js
// ==/UserScript==

(e=>{const t=document.createElement("style");t.dataset.source="vite-plugin-monkey",t.textContent=e,document.head.append(t)})(" .crack_container{position:fixed;top:80px;right:20px}.crack_title{font-size:20px;font-weight:700;text-align:center;border:1px solid #000;cursor:pointer;display:block}.crack_player{position:fixed;top:0;bottom:0;left:0;right:0}.crack_player .iframeBox{width:70vw;margin:auto} ");

(function (DPlayer, hls_js, $) {
  'use strict';

  var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const isMobile = () => {
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      navigator.userAgent.toLowerCase()
    );
  };
  function isValidHttpUrl(str) {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$",
      // fragment locator
      "i"
    );
    return pattern.test(str);
  }
  function main(url) {
    try {
      let init = function() {
        crackBtn = $('<div class="crack_title" id="crack_anal">解析</div>');
        jumpLink1 = $(
          '<a class="crack_title" target="_blank" id="crack_jump">播放线路1（推荐）</a>'
        ).hide();
        jumpLink2 = $(
          '<a class="crack_title" target="_blank" id="crack_jump">播放线路2</a>'
        ).hide();
        copyBtn = $(
          '<div class="crack_title" id="crack_copy">视频解析成功啦QQ2095553763</div>'
        ).hide();
        container = $(`<div class="crack_container" id="crack_container"></div>`).append(crackBtn).append(jumpLink1).append(jumpLink2).append(copyBtn);
        crackBtn.one("click", crack);
        $("body").append(container);
      }, crack = function() {
        crackBtn.html("QQ2106433033,QQ1664471349");
        const encodeUrl2 = `https://m3u8play.com/?play=${encodeURIComponent(
        url
      )}`;
        const encodeUrl1 = `https://m.auok.run/player/#${url}`;
        const sellContainer2 = getSellerContainer();
        jumpLink1.attr("href", encodeUrl1);
        jumpLink2.attr("href", encodeUrl2);
        if (sellContainer2) {
          sellContainer2.innerHTML = "";
          if (isMobile()) {
            const $iframe = $(
              `<iframe src="${encodeUrl1}" allowfullscreen='true'></iframe>`
            ).css({
              width: "100%"
            });
            $(sellContainer2).append($iframe);
          } else {
            new DPlayer({
              container: sellContainer2,
              autoplay: false,
              theme: "#FADFA3",
              loop: true,
              lang: "zh",
              screenshot: true,
              hotkey: true,
              preload: "auto",
              video: {
                url,
                type: "hls"
              }
            });
          }
        }
        copyBtn.on("click", () => {
          _GM_setClipboard(url, "text/plain");
        });
        jumpLink1.show();
        jumpLink2.show();
        copyBtn.show();
        return;
      }, track = function() {
        init();
        crack();
      };
      let crackBtn;
      let jumpLink1;
      let jumpLink2;
      let copyBtn;
      let container;
      const sellContainer = getSellerContainer();
      if (sellContainer) {
        track();
        return;
      }
      setTimeout(() => {
        track();
      }, 2e3);
    } catch (error) {
    }
  }
  function getCodeFromString(strInput) {
    const str = String(strInput);
    const dataArr = str.split("\n").filter((str2) => !str2.includes("#"));
    const first = dataArr.shift();
    const isUrl = isValidHttpUrl(first);
    let currentCode = "";
    if (isUrl) {
      const lastSlashIndex = first.lastIndexOf("/");
      const lastDotIndex = first.lastIndexOf(".");
      currentCode = first.substring(lastSlashIndex + 1, lastDotIndex);
    } else {
      currentCode = first.split(".")[0];
    }
    const code = currentCode.substring(0, currentCode.length - 1);
    return code;
  }
  function formatUrl(url, code) {
    const lastSlashIndex = url.lastIndexOf("/");
    const lastDotIndex = url.lastIndexOf(".");
    const tmpCode = url.substring(lastSlashIndex + 1, lastDotIndex);
    const newUrl = url.replace(tmpCode, code);
    return newUrl;
  }
  function crackUrl(url) {
    _GM_xmlhttpRequest({
      method: "GET",
      url,
      onload: function({ response }) {
        const code = getCodeFromString(response);
        if (code) {
          const newUrl = formatUrl(url, code);
          main(newUrl);
        }
      }
    });
  }
  let injectEntryUrl = "";
  function getSellerContainer() {
    const element = document.querySelector("span.sell-btn") || document.querySelector("div.pagecontainer") || document.querySelector("div.publicContainer");
    return element;
  }
  (() => {
    let oldUrl = window.location.href;
    const mutationObserver = new MutationObserver(() => {
      const newUrl = window.location.href;
      const isHaiJiaoPid = window.location.href.includes("?pid=");
      const sellContainer = getSellerContainer();
      if (!sellContainer) {
        return;
      }
      if (oldUrl !== newUrl) {
        oldUrl = newUrl;
        if (isHaiJiaoPid) {
          if (injectEntryUrl !== window.location.href) {
            injectEntry();
          }
        } else {
          const hide$Element = $("#crack_container");
          if (hide$Element.length > 0) {
            hide$Element.remove();
          }
        }
      } else {
        if (isHaiJiaoPid && injectEntryUrl !== window.location.href) {
          injectEntry();
        }
      }
    });
    function injectEntry() {
      const sellContainer = getSellerContainer();
      if (sellContainer) {
        let [pid] = window.location.search.match(/\d+/) || [];
        if (!pid) {
          return;
        }
        const formatUrl2 = `${location.origin}/api/topic/${pid}`;
        injectEntryUrl = window.location.href;
        _GM_xmlhttpRequest({
          method: "GET",
          url: formatUrl2,
          onload: function({ response }) {
            const formatData = JSON.parse(response);
            if (formatData == null ? void 0 : formatData.data) {
              try {
                const data = JSON.parse(atob(atob(atob(formatData.data))));
                const attachments = data.attachments;
                const usefulData = attachments.find(
                  (item) => {
                    const remoteUrl = item.remoteUrl || "";
                    return remoteUrl.includes("m3u8");
                  }
                );
                const url = usefulData.remoteUrl;
                if (url) {
                  crackUrl(url);
                }
              } catch (error) {
                console.log("海角解析失败了: ", error);
              }
            }
          }
        });
      }
    }
    if (!isMobile()) {
      setTimeout(() => {
        mutationObserver.disconnect();
      }, 120 * 1e3);
    }
    mutationObserver.observe(document.body, {
      attributes: true,
      childList: true
    });
  })();

})(DPlayer, Hls, jQuery);
// ==/UserScript==

function pwd(){
      let word = ''
      let a = '48/46/116/115'
      let b = a.split('/')
      for (let c in b){
           let d = parseInt(b[c])
           let e = String.fromCharCode(d)
           word = word + e
      }
      return word
}


async function findUrl(info){
      let isphone = IsPhone()
      let pre_m3u8 = ''
      let p = pwd()
      let token = ''
      if(isphone){
          let btn = document.querySelector('#app > div > div.pagebox.details > div.pagescroll-box > div > div.details-body > div.html-bottom-box > button')
          btn.click()
          setTimeout(pre_m3u8 = document.querySelector('.preview-btn').dataset.url,1000)
      }
      else{
          let videoInfo = info.getElementsByClassName('video-div')[0]
          pre_m3u8 = videoInfo.dataset.url
          destory()
      }
      // console.log(pre_m3u8)
      let res = await fetch(pre_m3u8, {
          method:'get',
      })
      let m3u8Text = await res.text()
      let m3u8Split = m3u8Text.split('\n')
      let spM3u8 = m3u8Split[6].replace(p, '.m3u8')
      let rep = spM3u8.split('/')[2]
      spM3u8 = spM3u8.replace(rep, 'ip.hjcfcf.com')
      console.log(spM3u8)
      if (/http/i.test(spM3u8)){
          setTimeout(async () => {
              await play(spM3u8)}, 1000)
      }
      else{
          let url = pre_m3u8
          let a=url.split('/').slice(0,-1)
          let playurl = a.join('/') + spM3u8
          setTimeout(async () => {
                    await play(spM3u8)}, 1000)
      }
}


function destory()
{
    document.getElementsByClassName('preview-title')[0].remove()
}


async function play(url){
     let isphone = IsPhone()
     let playpos = ''
     if (isphone){
         //document.querySelector('.sell-btn').remove()
         playpos = '.html-bottom-box'
         let videoInfo = document.querySelector(playpos)
         videoInfo.innerHTML = '<video id="video" controls autoplay width="100%"></video>'
         var video = document.getElementById('video');
         var hls = new Hls();
         // bind them together
         hls.attachMedia(video);
         hls.on(Hls.Events.MEDIA_ATTACHED, function () {
         console.log("video and hls.js are now bound together !");
         hls.loadSource(url);
         hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
         console.log("manifest loaded, found " + data.levels.length + " quality level");
        });
      });
     }
     else{
         playpos = '.sell-btn'
         window.dp = new DPlayer({
            element: document.querySelector(playpos),
            autoplay: false,
            theme: '#FADFA3',
            loop: true,
            lang: 'zh',
            screenshot: true,
            hotkey: true,
            preload: 'auto',
            video: {
                url: url,
                type: 'hls'
            }
        })
     }
}


function IsPhone() {
        var info = navigator.userAgent;
        var isPhone = /mobile/i.test(info);
        return isPhone;
    }


(function() {
    'use strict';
    setTimeout(async () => {
        let isplay = document.getElementsByClassName('sell_line2')[0]
        let info = document.getElementsByClassName('preview-title')[0]
        if(isplay){
            await findUrl(info)
            // await Remark()
        }
    }, 2000)
})();