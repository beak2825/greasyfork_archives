// ==UserScript==
// @name                红杏视频破解会员
// @namespace           https://tampermonkey.net.cn/
// @version             2.0.0
// @license             MIT
// @include             /^https://www.hxbb\d+\.com.+$/
// @include             /^https://www.hxaa\d+\.com.+$/
// @include             /^https://www.hxcc\d+\.com.+$/
// @include             /^https://www.hxdd\d+\.com.+$/
// @require             https://cdn.bootcdn.net/ajax/libs/hls.js/1.4.0/hls.min.js
// @require             https://cdn.bootcdn.net/ajax/libs/dplayer/1.27.1/DPlayer.min.js
// @require             https://cdn.bootcdn.net/ajax/libs/crypto-js/4.1.1/crypto-js.js
// @description         针对红杏视频的优化脚本，此脚本可以让用户观看全站视频,免费无任何注入
// @author              Niko
// @downloadURL https://update.greasyfork.org/scripts/479319/%E7%BA%A2%E6%9D%8F%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3%E4%BC%9A%E5%91%98.user.js
// @updateURL https://update.greasyfork.org/scripts/479319/%E7%BA%A2%E6%9D%8F%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3%E4%BC%9A%E5%91%98.meta.js
// ==/UserScript==

let userInfo = getLocalStorage()

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
}


function getLocalStorage(){
    let storage = localStorage.getItem('move-client-user-info')
    return JSON.parse(storage)
}

function getLogin(){
    let prefixArray = ["158", "191", "132", "133", "135", "137", "138", "170", "187", "189"]
    let i = Math.floor(10 * Math.random());
    let prefix = prefixArray[i];
    for (let j=0; j<8; j++){
        prefix = prefix + Math.floor(Math.random() * 10)
    }
    let phone = prefix
    let pwd = '123456'
    if (isMobile()){
        location.href = location.origin + '/#/login/regist'

    }
    else{
        //旧版按钮
        //document.querySelector('#app > div > div.top_bar > div.container.top > div.top_right > div.top_right_photo > div.top_right_photo_1 > div.top_right_photo_1_1 > span:nth-child(2)').click()
        let d = document.querySelector('#app > div > div.top_bar > div.container.top > div.top_last_right > div.top_right_photo_dan')
        let ev = new Event("mouseover")
        d.dispatchEvent(ev)
        setTimeout(() => {
            document.querySelector('#app > div > div.top_bar > div.container.top > div.top_last_right > div.top_right_photo_dan > div > div > div > div.mask_2_1_1 > span:nth-child(2)').click()
        }, 1000)
    }
    let event = document.createEvent('HTMLEvents')
    event.initEvent("input", true, true)
    event.eventType = 'message'
    setTimeout(() => {
        let account = document.getElementsByClassName('van-field__control')[0]
        account.value = phone
        account.dispatchEvent(event)
        let password = document.getElementsByClassName('van-field__control')[1]
        password.value = pwd
        password.dispatchEvent(event)
        let ispwd = document.getElementsByClassName('van-field__control')[2]
        ispwd.value = pwd
        ispwd.dispatchEvent(event)
        document.getElementsByClassName('van-button')[0].click()
    }, 1000)
}

/* storage-用户的json格式数据 */
function getToken(storage){
    let token = storage.user.token
    if (token === ''){
            getLogin()
    }
    return token
}
function getId(){
    let videoInfo = document.location
    let url = videoInfo.href
    let videoInfoList = url.split('/')
    if (videoInfoList.find(element => element === 'playvideo')){
        return videoInfoList[6]
    }
    else{
        return false
    }
}

function aestoword(param){
    let e = param
    let t = Date.parse(new Date) / 1e3
                  , i = (t - 100).toString()
                  , r = (t + 100).toString()
                  , s = i.substr(0, 9) + "0"
                  , a = r.substr(0, 9) + "0"
                  , c = "00" + s + s + s
                  , u = "000000" + a;
                c = CryptoJS.enc.Utf8.parse(c),
                u = CryptoJS.enc.Utf8.parse(u);
                let p = JSON.stringify(e)
                  , h = CryptoJS.enc.Utf8.parse(p)
                  , d = CryptoJS.AES.encrypt(h, c, {
                    iv: u,
                    mode: CryptoJS.mode.CBC
                })
                  , f = d.toString()
                  , m = encodeURIComponent(f);
    return m
}

async function shutVideo(token){
    const t = token;
    let n = parseInt(Date.now())
    , i = (n - 100).toString()
    , r = (n + 100).toString()
    , s = (i + i + i).toString().substring(0, 32)
    , l = "000" + r;
    s = CryptoJS.enc.Utf8.parse(s),
    l = CryptoJS.enc.Utf8.parse(l);
    let parms = {'id':location.href.split('=')[1]}
    let u = JSON.stringify(parms);
    let p = CryptoJS.enc.Utf8.parse(u)
    , d = CryptoJS.AES.encrypt(p, s, {
        iv: l,
        mode: CryptoJS.mode.CBC
    })
    , h = d.toString()
    , f = encodeURIComponent(h)
    , m = CryptoJS.MD5("data_param=" + encodeURIComponent(f) + "&t=" + n).toString().toUpperCase()
    let params={'data_param': f,'t': n,'sign': m}
    console.log(params)
    let videoM3u8 = 'https://llzn.meijiesheng.xyz/WebApp/WebVideo/VideoContentsInfo'
    let res = await fetch(`${videoM3u8}?data_param=${f}&t=${n}&sign=${m}`, {
            method:'get',
            headers: new Headers({
                'Content-Type': 'application/json',
                'token': token
            }),
        })
    let response = await res.json()
    //https://zms.jkyw.xyz//DSP1209QML/10000kb/hls/index.m3u8
    let sn = await response.data.video_contents_info.sn
    let playurl =await 'https://zms.jkyw.xyz/'+sn+'/10000kb/hls/index.m3u8'
    h5player(playurl)
}



async function play(token){
    let videoM3u8 = 'https://llzn.meijiesheng.xyz/WebApp/WebVideo/CheckSeeVideoAccess'
    console.log(getId())
    if (getId()){
        let videoId = {'id': getId()}
        let data_param = aestoword(videoId)
        let t = Date.parse(new Date) / 1e3
        let res = await fetch(`${videoM3u8}?data_param=${data_param}&t=${t}`, {
            method:'get',
            headers: new Headers({
                'Content-Type': 'application/json',
                'token': token
            }),
        })
        let response = await res.json()
        let url = response.data.url
        console.log(url)
        let splitList = url.split("&time=2")
        let re = splitList[0].split("/")[2]
        let playUrl = splitList[0].replace(re + '/shikanshipin', 'zms.jkyw.xyz')
        console.log(playUrl)
        if (isMobile()) {
            await h5player(playUrl)
        } else {
            await pcplayer(playUrl)
        }
    }
}


async function pcplayer(playUrl){
    document.querySelector(".el-carousel__container").remove()
    window.dp = new DPlayer({
            element: document.querySelector(".play_video_zhec"),
            autoplay: true,
            theme: '#FADFA3',
            loop: true,
            lang: 'zh',
            screenshot: true,
            hotkey: true,
            preload: 'auto',
            video: {
                url: playUrl,
                type: 'hls'
            }
        });
}

async function h5player(playUrl){
      document.querySelector(".play_video_1").innerHTML='<video id="video" class="video-js vjs-default-skin" controls preload="auto" style="width: 100%; z-index: 15; height: 8.56rem;"></video>'
      let a1 = document.querySelector(".play_video_2")
      let a2 = document.querySelector(".play_video_zhec_2")
      if (a1||a2){
          a1.remove()
          a2.remove()
      }
      var video = document.getElementById('video')
      if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(playUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED,function() {
          video.play();
        });
      }
      else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = playUrl;
        video.addEventListener('canplay',function() {
          video.play();
        });
      }

}



(function() {
        setTimeout(async () =>{
                let el = document.getElementsByClassName('play_video_zhec')[0]
                let token = getToken(userInfo);
                console.log(token)
                if (isMobile()){
                   setInterval(function () {
                       if(!document.querySelector("button#pojie")){
                           var mydiv = document.createElement('div')
                           mydiv.innerHTML = `<button id="pojie">点此破解</button>后`
                           document.querySelector('div.van-nav-bar__title').after(mydiv)
                       }
                       else{
                           if (/shotVideo/i.test(location.href)){
                               document.querySelector("button#pojie").onclick = function(){
                                   shutVideo(token)
                               }
                           }
                           else{
                               document.querySelector("button#pojie").onclick = function(){
                                   play(token)
                               }
                           }
                       }
                   }, 1000)
                }
                if (el){
                    play(token)
                }
       }, 2000)
})();