// ==UserScript==
// @name         含羞草研究所免费看
// @namespace    http://tampermonkey.net/
// @version      2.4.0
// @description  针对 含羞草研究所 的优化脚本，此脚本可以让用户观看VIP视频
// @description  中转页 https://www.Fi11.tv ; https://www.Fi11.live
// @description  一位网友推荐：https://5z4qc0.91hub.one:2096/index?ref=40951
// @author       You
// @match        https://www.hxcbb101.com/*
// @match        https://h5.hxcbb101.com/*
// @include        /^https://www.hxcbb\d+\.com.+$/
// @include        /^https://h5.hxcbb\d+\.com.+$/
// @include        /^http://www.hxcbb\d+\.com.+$/
// @include        /^http://h5.hxcbb\d+\.com.+$/
// @include        /^https://www.hxcpp\d+\.com.+$/
// @include        /^https://h5.hxcpp\d+\.com.+$/
// @include        /^http://www.hxcpp\d+\.com.+$/
// @include        /^https://h5.yashenggd.com.+
// @include        /^http://h5.hxcpp\d+\.com.+$/
// @include        /^https://www.fi11sm\d+\.com.+$/
// @include        /^https://h5.fi11sm\d+\.com.+$/
// @include        /^https://www.yashenggd.com.+$/$/
// @include        /^https://www.fi11av\d+\.com.+$/
// @include        /^https://h5.fi11av\d+\.com.+$/
// @include        /^https://www.fi11tv\d+\.com.+$/
// @include        /^https://h5.fi11tv\d+\.com.+$/
// @include        /^https://www.hxx-new-retail\d*\.com.+$/
// @include        /^https://h5.hxx-new-retail\d*\.com.+$/
// @include        /^https://www.jianguomuye\d*\.com.+$/
// @include        /^https://h5.jianguomuye\d*\.com.+$/
// @include        /^https://www.laccogh\d*\.com.+$/
// @include        /^https://h5.laccogh\d*\.com.+$/
// @include        /^https://www.pangrj\d*\.vip.+$/
// @include        /^https://h5.pangrj\d*\.vip.+$/
// @include        /^https://www.fi11sm\d*\.com.+$/
// @include        /^https://h5.fi11sm\d*\.com.+$/
// @include        /^https://www.fi11cc\d*\.com.+$/
// @include        /^https://h5.fi11cc\d*\.com.+$/
// @include        /^https://www.hada\d*\.com.+$/
// @include        /^https://h5.hada\d*\.com.+$/
// @include        /^https://www.tyeh\d*\.com.+$/
// @include        /^https://h5.tyeh\d*\.com.+$/
// @include        /^https://www.fi11aa\d*\.com.+$/
// @include        /^https://h5.fi11aa\d*\.com.+$/
// @match        https://www.sdx6q.com/*
// @match        https://h5.sdx6q.com/*
// @match        https://www.vgx4p.com/*
// @match        https://h5.vgx4p.com/*
// @match        https://fi11.com/*
// @match        https://fi11.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hxcbb101.com
// @grant        none
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/456275/%E5%90%AB%E7%BE%9E%E8%8D%89%E7%A0%94%E7%A9%B6%E6%89%80%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/456275/%E5%90%AB%E7%BE%9E%E8%8D%89%E7%A0%94%E7%A9%B6%E6%89%80%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
// ==/UserScript==

let Global = {
    deviceType: "pc",
    pageType: "live",
    isReloadVideo: false
}

function importLib() {
    importJS("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js")
    importJS("https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.1.5/hls.min.js")
    importJS("https://cdnjs.cloudflare.com/ajax/libs/dplayer/1.26.0/DPlayer.min.js")
}

function importJS(src) {
    let script = document.createElement('script');
    script.src = src;
    document.head.appendChild(script);
}

VITE_APP_AES_KEY = 'B77A9FF7F323B5404902102257503C2F'
VITE_APP_AES_IV = 'B77A9FF7F323B5404902102257503C2F'
VITE_APP_AES_PASSWORD_KEY = "0123456789123456"
VITE_APP_AES_PASSWORD_IV = "0123456789123456"
defaultPassword = "123456"
//baseURL = "https://api.qianyuewenhua.xyz"
//baseURL = "https://api.hydzswyxgs.com"
baseURL ="https://ap859.hanbige.com"
registerParam = {
    user_login: "",
    user_pass: "",
    source: "pc",
    channel: "P",
    //visitorId: null == (d = t.visitorInfo) ? void 0 : d.visitorId
    visitorId: 10000000 + Math.floor(Math.random() * 10000000)
}

function randomPhoneNumber() {
    let prefixArray = new Array("130", "131", "132", "133", "135", "137", "138", "170", "187", "189");
    let i = parseInt(10 * Math.random());
    let prefix = prefixArray[i];

    for (var j = 0; j < 8; j++) {
        prefix = prefix + Math.floor(Math.random() * 10);
    }

    return prefix;
}

function genRegisterData() {
    registerParam.user_login = randomPhoneNumber()
    encryptParam = {
        key: VITE_APP_AES_PASSWORD_KEY,
        iv: VITE_APP_AES_PASSWORD_IV
    }
    registerParam.user_pass = encrypt(defaultPassword, encryptParam)
    return registerParam;
}


function encrypt(ciphertext, { key: key, iv: iv } = {}) {
    var a = CryptoJS.enc.Utf8.parse(ciphertext)
        , i = CryptoJS.AES.encrypt(a, CryptoJS.enc.Utf8.parse(key || VITE_APP_AES_KEY), {
            iv: CryptoJS.enc.Utf8.parse(iv || VITE_APP_AES_IV),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return CryptoJS.enc.Base64.stringify(i.ciphertext)
}

function getVideoId() {
    let url = window.location.href;
    //集合类视频
    url = url.split('?')[0];
    if (url.endsWith("0")) {
        let urlSplited = url.split("play/video")
        urlSplited = urlSplited[1].split("/")
        let videoId = urlSplited[1]
        return parseInt(videoId);
    }
    let urlSplited = url.split("/");
    let videoId = urlSplited[urlSplited.length - 1];
    console.log('The videoId is',videoId);
    return parseInt(videoId);
}

// https://api.hydzswyxgs.com/videos/v2/getUrl
// https://ap859.hanbige.com/videos/v2/getUrl
async function getVideoUrl(token, videoId) {
    window.videoId = videoId
    let vipPath = "/videos/getPreUrl"
    let path = "/videos/v2/getUrl"
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json;charset=UTF-8;");
    myHeaders.append("Auth", token);
    let videoUrlParam = {
        videoId: videoId
    }
    videoUrlParam = JSON.stringify(videoUrlParam)
    let now = new Date()
    let data = {
        endata: encrypt(videoUrlParam || {}),
        ents: encrypt(parseInt(now.getTime() / 1e3) + 60 * now.getTimezoneOffset())
    }

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(data),
        //    redirect: 'follow'
    };

    let res = await fetch(baseURL + vipPath, requestOptions);
    let json = await res.json()
    m3u8Url = json.data.url
    if(m3u8Url == ""){
        return null;
    }
    try {
        let splited = m3u8Url.split("?")
        let m3u8UrlParams = splited[1]
        let urlSearchParams = new URLSearchParams(m3u8UrlParams)
        urlSearchParams.delete("start")
        urlSearchParams.delete("end")
        let newM3U8Url = splited[0] + "?" + urlSearchParams.toString()
        return newM3U8Url
    } catch (error) {
        return null
    }
}

function setCopyBtn(elementClass,newM3U8Url){
    document.querySelector(elementClass).innerHTML='<button id="copyM3U8" style="color: red;">复制地址</button>'
    document.querySelector("#copyM3U8").addEventListener("click", async (e) => {
        await navigator.clipboard.writeText(newM3U8Url);
        alert("复制成功")
  });
}

function play(playerUrl, pic, container, playType) {
    //container.style.zIndex = 1
    //container.style.position="relative";
    var videoObject = {
        container: '#v_prism', //容器的ID或className
        // live: true,//指定为直播
        // seek: 'cookie',//指定跳转到cookie记录的时间，使用该属性必需配置属性cookie
        // cookie: 'abcdefg',//cookie名称,请在同一域中保持唯一
        plug: 'hls.js',//使用hls.js插件播放m3u8
        video: playerUrl//视频地址
    }
    if( window.ck){
         window.ck.remove();
    }
    window.ck = new ckplayer(videoObject);
    window.ck.play()
}

function mobilePlay(playerUrl, pic, container, playType) {
    container.style.zIndex = 99999
    window.dp = new DPlayer({
        container: container,                       // 可选，player元素
        autoplay: false,                                                   // 可选，自动播放视频，不支持移动浏览器
        theme: '#FADFA3',                                                  // 可选，主题颜色，默认: #b7daff
        loop: true,                                                        // 可选，循环播放音乐，默认：true
        lang: 'zh',                                                        // 可选，语言，`zh'用于中文，`en'用于英语，默认：Navigator language
        screenshot: true,                                                  // 可选，启用截图功能，默认值：false，注意：如果设置为true，视频和视频截图必须启用跨域
        hotkey: true,                                                      // 可选，绑定热键，包括左右键和空格，默认值：true
        preload: 'auto',                                                   // 可选，预加载的方式可以是'none''metadata''auto'，默认值：'auto'
        video: {                                                           // 必需，视频信息
            url: playerUrl,                                         // 必填，视频网址
            pic: pic,                                   // 可选，视频截图
            thumbnails: pic
        }
    });
}

async function pc() {
    if (window.location.pathname.endsWith("home")) {
        return
    }
    let videoId = getVideoId()
    let videoUrl = await getVideoUrl(null, videoId)
    if (videoUrl == null) {
        return
    }
    setCopyBtn(".video-icon",videoUrl)
    pic = document.querySelector(".el-image.overflow-hidden > img")
    if (pic) {
        pic = pic.getAttribute("src")
    }
    container = document.querySelector("#v_prism")
    container.style.position="relative"
    container.style.zIndex=9999
    playType = 'live'
    elem = document.querySelector(".vip-mask")
    if (elem) {
        elem.remove()
    }
    elem = document.querySelector(".el-image.overflow-hidden")
    if (elem) {
        elem.remove()
    }
    elem = document.querySelector(".relative.bg-overlay>.overflow-hidden ")
    if (elem) {
        elem.remove()
    }
    elem = document.querySelector(".vip-mask")
    if (elem) {
        elem.remove()
    }
    elem = document.querySelector(".el-image.absolute ")
    if (elem) {
        elem.remove()
    }
    elem = document.querySelector(".absolute.bg-overlay")
    if (elem) {
        elem.remove()
    }

    play(videoUrl, pic, container, playType)
}


async function mobile() {
    if (!window.location.pathname.endsWith("0")) {
        return
    }
    let videoUrl = await getVideoUrl(null, getVideoId())
    if (videoUrl == null) {
        return
    }
    setCopyBtn(".tendency-row",videoUrl)
    pic = document.querySelector(".pub-video-poster")
    if (pic) {
        pic = pic.getAttribute("src")
    }
    //container = document.querySelector(".van-sticky")
    container = document.querySelector("#video1")
    playType = 'live'
    //document.querySelector(".try-detail-video").remove()
    mobilePlay(videoUrl, pic, container, playType)
}

async function main() {
    setTimeout(async () => {
        if(window.navigator.appVersion.includes("Windows")){
            window.addEventListener("click", () => {
                setTimeout(() => {
                    let videoId = getVideoId()
                    if (window.videoId == videoId) {
                        return
                    }
                    pc()
                }, 200)
            }, true)
            pc()
        } else {
            importLib()
            window.addEventListener("click", () => {
                setTimeout(() => {
                    if (!window.location.pathname.endsWith("0")) {
                        return
                    }
                    let videoId = getVideoId()
                    if (window.videoId == videoId) {
                        return
                    }
                    mobile()
                }, 200)

            }, true)
            mobile()
        }
    }, 1800)
}


main()