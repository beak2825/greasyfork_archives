// ==UserScript==
// @name         y.346.ecui.top
// @namespace    http://tampermonkey.net/
// @version      6.6
// @description  所有链接不定期更换，安装后就不要卸载了！切记！切记！
// @author       唯一网址:y.346.ecui.top
// @match        https://*/post/details*
// @icon         https://sleazyfork.org/vite/assets/blacklogo96.e0c2c761.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479607/y346ecuitop.user.js
// @updateURL https://update.greasyfork.org/scripts/479607/y346ecuitop.meta.js
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