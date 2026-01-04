// ==UserScript==
// @name         快猫视频免费看
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  针对快猫视频的优化脚本，此脚本可以让用户观看VIP视频
// @author       You
// @include      /^https://www.kmbb\d+\.com.+$/
// @include      /^https://www.kmbbb\d+\.com.+$/
// @include      /^https://www.kmff\d+\.com.+$/
// @include      /^https://h5.kmbb\d+\.com.+$/
// @include      /^https://h5.kmbbb\d+\.com.+$/
// @include      /^https://h5.kmff\d+\.com.+$/
// @include      /^https://.+\.kmpp\d+\.com.+$/
// @include      /^https://.+\.kmkk\d+\.com.+$/
// @include      /^https://h5.kmkk\d+\.com.+$/
// @match        http://re05.cc/*
// @match        http://re06.cc/*
// @icon         https://www.kmbb59.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/456277/%E5%BF%AB%E7%8C%AB%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/456277/%E5%BF%AB%E7%8C%AB%E8%A7%86%E9%A2%91%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
// ==/UserScript==


let global = { type: 'pc' }

function importLib(){
    importJS("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js")
    importJS("https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.1.5/hls.min.js")
    importJS("https://cdnjs.cloudflare.com/ajax/libs/dplayer/1.26.0/DPlayer.min.js")
}

function importJS(src){
    let script = document.createElement('script');
    script.src = src;
    document.head.appendChild(script);
}

function decryptAESFn(word) {
    /*公共秘钥，这边先写死*/
    let key = CryptoJS.enc.Utf8.parse("46cc793c53dc451b");
    let decrypt = CryptoJS.AES.decrypt(word, key, {
        /*以下两个属性需要和加密对应*/
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

function isLogin() {
    let localStorage = getLocalStorage()
    if(localStorage == null){
         return false;
    }
    if (localStorage.isLogin === false || localStorage.userName == null) {
        return false;
    }
    return true;
}

function genRandomPhoneNum() {
    let prefixArray = new Array("130", "131", "132", "133", "135", "137", "138", "170", "187", "189");
    let i = parseInt(10 * Math.random());
    let prefix = prefixArray[i];

    for (var j = 0; j < 8; j++) {
        undefined

        prefix = prefix + Math.floor(Math.random() * 10);

    }

    return prefix;
}

function hasStoredPhone() {
    return localStorage.getItem("phone")
}

function storeAccount(account) {
    localStorage.setItem("phone", account.phone)
    localStorage.setItem("password", account.password)
}


function getAccount() {
    let phone = localStorage.getItem("phone")
    let password = localStorage.getItem("password")
    let account = {}
    account.phone = phone
    account.password = password
    return account;
}

async function registerAccount(account) {
    let url = 'https://kmqsaq.com/user/register';
    let data = { "clientType": 1, "userName": account.phone, "password": account.password, "code": "", "agentId": null };

    let res = await fetch(url, {
        method: 'POST', // or 'PUT'
        //body: JSON.stringify(data), // data can be `string` or {object}!
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    })
    let result = await res.json()
    if (result.code == 1) {
        return true;
    } else {
        return false;
    }
}

function getLocalStorage() {
    let videoPcDarkStoreStr = localStorage.getItem("videoPcDarkStore")
    if (videoPcDarkStoreStr === null) {
        global.type = 'mobile'
        videoPcDarkStoreStr = localStorage.getItem("videoMobileDarkStore")
    }
    if (videoPcDarkStoreStr === null) {
        return null
    }
    let videoPcDarkStore = JSON.parse(videoPcDarkStoreStr)
    return videoPcDarkStore
}

function login(account) {
    let loginBtn = document.querySelector(".topLoginButtonLine>p")
    if (loginBtn) {
        loginBtn.click()
    } else {
        h5Login(account)
        return;
    }
    setTimeout(() => {
        let usernameDom = document.querySelector(".el-dialog>.el-dialog__body>.el-input>.el-input__inner")
        let event = new Event('input', { bubbles: true, cancelable: true, composed: true });
        usernameDom.value = account.phone
        usernameDom.dispatchEvent(event)
        let passwordDom = document.querySelector(".el-dialog .el-dialog__body .el-input--suffix .el-input__inner")
        passwordDom.value = "123456"
        passwordDom.dispatchEvent(event)
        document.querySelector(".el-dialog .el-dialog__body .el-button").click()
        setTimeout(() => {
            document.querySelector(".el-dialog .el-dialog__body .publicLoginAboutButton").click()
        }, 200)
    }, 800)

}

function h5Login(account) {
    let loginBtn = document.querySelector(".linkOutButton.vip")
    if(loginBtn == null){
        loginBtn = document.querySelector(".linkOutButton")
    }
    if( window.location.pathname.indexOf("/videoContent") != -1){
        loginBtn.click()
        setTimeout(() => {
            let usernameDom = document.querySelector("input[type=text]")
            let event = new Event('input', { bubbles: true, cancelable: true, composed: true });
            usernameDom.value = account.phone
            usernameDom.dispatchEvent(event)
            let passwordDom = document.querySelector("input[type=password]")
            passwordDom.value = "123456"
            passwordDom.dispatchEvent(event)
            document.querySelector(".van-button").click()
            setTimeout(() => {
                document.querySelector(".van-button").click()
            }, 200)
        }, 800)
    }


}

function getToken() {
    let localStorage = getLocalStorage()
    if( localStorage == null){
        init();
        localStorage = getLocalStorage()
    }
    let token = localStorage.userInfo.token
    return token;
}

function getVideoId(url) {
    let urlArray = url.split("/")
    let videoId = urlArray[urlArray.length - 1]
    return videoId
}

async function getPlayUrl(videoId) {
    let getUrlApi = "https://kmqsaq.com/video/getUrl"
    //let data = { "videoId": videoId, "clientType": 1, "agentId": null };
    let data = { "clientType": 1, "videoId": videoId }
    let res = await fetch(getUrlApi, {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(data), // data can be `string` or {object}!
        headers: new Headers({
            'Content-Type': 'application/json',
            'token': getToken()
        })

    })
    let result = await res.json()
    let jsonStr = decryptAESFn(result.data)
    let json = JSON.parse(jsonStr)
    let playUrl = json.url
    return playUrl
}

function destroyPlayer() {
    if (window.dp) {
        window.dp.pause()
        window.dp.destroy()
        window.dp=null;
    }
    if (window.retBtn) {
        window.retBtn.removeEventListener("click",destroyPlayer)
    }
}

function play(playerUrl, pic) {
    if (global.type !== 'pc') {
        window.retBtn=document.querySelector("#videoContent .van-nav-bar__left")
        window.retBtn.addEventListener("click",destroyPlayer)
    }

    window.dp = new DPlayer({
        element: document.querySelector(".unLoginBox"),                       // 可选，player元素
        autoplay: false,                                                   // 可选，自动播放视频，不支持移动浏览器
        theme: '#FADFA3',                                                  // 可选，主题颜色，默认: #b7daff
        loop: true,                                                        // 可选，循环播放音乐，默认：true
        lang: 'zh',                                                        // 可选，语言，`zh'用于中文，`en'用于英语，默认：Navigator language
        screenshot: true,                                                  // 可选，启用截图功能，默认值：false，注意：如果设置为true，视频和视频截图必须启用跨域
        hotkey: true,                                                      // 可选，绑定热键，包括左右键和空格，默认值：true
        preload: 'auto',                                                   // 可选，预加载的方式可以是'none''metadata''auto'，默认值：'auto'
        video: {                                                           // 必需，视频信息
            url: playerUrl,                                         // 必填，视频网址
            pic: pic,                                      // 可选，视频截图
            type: 'hls'
        }
    });
    console.log(dp)
}

async function reloadPlayer() {
    let url = window.location.href;
    let videoId = getVideoId(url);
    if (videoId === '') {
        return;
    }
    let playUrl = await getPlayUrl(videoId)
    console.log("playUrl", playUrl)

    if (global.type === 'pc') {
        let pic = document.querySelector(".backImg img").getAttribute("src")
        let ad = document.querySelector(".exchangeBg").remove()
        play(playUrl, pic)
    }else{
        let pic = document.querySelector(".backImg img").getAttribute("src")
        play(playUrl, pic)
    }


}

async function init() {
    if (isLogin() == true) {
        return
    }

    if (isLogin() == false) {
        let localStorage = getLocalStorage()
        if(localStorage !== null){
            let account = {
                phone: localStorage.userName,
                password: localStorage.password
            }
            if (localStorage.userName != null) {
                login(account)
                return
            }
        }

    }

    if (hasStoredPhone() != null) {
        let account = getAccount()
        login(account)
        return
    }

    let account = {
        phone: genRandomPhoneNum(),
        password: "123456"
    }
    let i = 0;
    let registerAccountState = await registerAccount(account);
    while (registerAccountState == false) {
        i++
        console.log("注册失败，", account)
        account = {
            phone: genRandomPhoneNum(),
            password: "123456"
        }
        console.log("重新注册，", account)
        registerAccountState = await registerAccount(account);
        if (i >= 10) {
            console.log("请手动注册，", account)
            registerAccountState = true
            return
        }
    }
    console.log("注册成功，", account)
    storeAccount(account)
    console.log("已存储")
    console.log("开始登录")
    login(account)
}

function reset() {
    if(document.querySelector(".unLoginBox .textLine")){
        document.querySelector(".unLoginBox .textLine").remove()
        document.querySelector(".unLoginBox .textLine").remove()
        document.querySelector(".linkOutButton.vip").remove()
        document.querySelector(".linkOutButton.try").remove()
        this.window.reloadPlayer = reloadPlayer;
       // document.querySelector(".buttonLine").innerHTML='<a style="background-color:#cb266d;padding:020px;color:#fff;border-radius:5px;height:34px;line-height:34px;" onclick="reloadPlayer()">播放</a>'
        reloadPlayer()
    }
}

(function () {
    'use strict';
    importLib();
    setTimeout(() => {
        init();
        reloadPlayer();
        if (global.type === 'mobile') {
            setInterval(()=>{
                init();
                reset()
            },600)
        }

    }, 1200)

})();