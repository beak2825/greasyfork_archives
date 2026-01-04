// ==UserScript==
// @license MIT
// @name         含羞草研究所免费看
// @namespace    http://tampermonkey.net/
// @version      0.3.6
// @description  针对 含羞草研究所 的优化脚本，此脚本可以让用户观看VIP视频
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
// @include        /^http://h5.hxcpp\d+\.com.+$/
// @include        /^https://www.fi11sm\d+\.com.+$/
// @include        /^https://h5.fi11sm\d+\.com.+$/
// @include        /^https://www.yashenggd.com.+$/
// @include        /^https://h5.yashenggd.com.+$/
// @include        /^https://www.fi11av\d+\.com.+$/
// @include        /^https:///h5.fi11av\d+\.com.+$/
// @include        /^https://www.fi11tv\d+\.com.+$/
// @include        /^https:///h5.fi11tv\d+\.com.+$/
// @include        /^https://www.hxx-new-retail\d*\.com.+$/
// @include        /^https:///h5.hxx-new-retail\d*\.com.+$/
// @include        /^https://www.jianguomuye\d*\.com.+$/
// @include        /^https:///h5.jianguomuye\d*\.com.+$/
// @match        https://fi11.com/*
// @match        https://fi11.cn/*
// @match        https://www.elabor.vip/*
// @match        https://www.chanmao.online/*
// @match        https://www.jlhd.top/*
// @match        https://www.jdyy.vip/*
// @match        https://www.guilong.vip/*


// @icon         https://www.google.com/s2/favicons?sz=64&domain=hxcbb101.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455187/%E5%90%AB%E7%BE%9E%E8%8D%89%E7%A0%94%E7%A9%B6%E6%89%80%E5%85%8D%E8%B4%B9%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/455187/%E5%90%AB%E7%BE%9E%E8%8D%89%E7%A0%94%E7%A9%B6%E6%89%80%E5%85%8D%E8%B4%B9%E7%9C%8B.meta.js
// ==/UserScript==

let Global = {
    deviceType: "pc",
    pageType: "live",
    isReloadVideo: false
}

function importLib() {
    importJS("https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js")
    importJS("https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.1.5/hls.min.js")
    importJS("https://cdnjs.cloudflare.com/ajax/libs/flv.js/1.6.2/flv.min.js")
    importJS("https://cdnjs.cloudflare.com/ajax/libs/dplayer/1.26.0/DPlayer.min.js")
}
function importJS(src) {
    let script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
}

async function getLiveUrl(token, videoId){
    var myHeaders = new Headers();
    myHeaders.append("auth", token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "liveuid": parseInt(videoId)
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    let res = await fetch("https://www.hxc-api.com/live/getLiveInfo", requestOptions);
    res = res.text();
    return res;
}

async function getPreUrl(token, videoId) {
    var myHeaders = new Headers();
    myHeaders.append("auth", token);
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "videoId": parseInt(videoId)
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    let res = await fetch("https://www.hxc-api.com/videos/getPreUrl", requestOptions);
    res = res.text();
    return res;
}

function getVideoId() {
    let url = window.location.href;
    let urlSplited = url.split("/");
    let videoId = urlSplited[urlSplited.length - 1];
    return videoId;
}

function getStorage(deviceType) {
    let key = null;
    if (deviceType === 'pc') {
        key = "newPCVideoWithLiveStore"
    } else {
        key = "liveDarkH5Store"
    }
    let storage = localStorage.getItem(key)
    let json = JSON.parse(storage);
    return json;
}

function getToken(storage) {
    let res = storage;
    let token = res.userToken;
    return token;
}
function closeDplayer() {
    if (window.dp) {
        window.dp.pause()
        window.dp.destroy()
        window.dp = null;
    }
    if (window.retBtn) {
        window.retBtn.removeEventListener("click", closeDplayer)
    }
    if (window.items) {
        if (window.items.length > 0) {
            window.items.forEach(item => {
                item.removeEventListener("click", closeDplayer)
            })
        } else {
            window.items.removeEventListener("click", initMobile)
        }
    }
    if (window.items2) {
        window.items2.forEach(item => {
            item.removeEventListener("click", initMobile)
        })
    }
    if (window.items3) {
        window.items3.forEach(item => {
            item.removeEventListener("click", initMobile)
        })
    }
    setTimeout(() => {
        window.items = document.querySelector(".videoListBox")
        if (window.items) {
            window.items.addEventListener("click", initMobile)
        }

    }, 300)

}


function h5play(playerUrl, pic) {
    // document.querySelector(".videoContentContainer").style = "width: 1200px; height: 550px;"
    window.items = document.querySelector(".videoListBox")
    window.items.addEventListener("click", initMobile)

    window.retBtn = document.querySelector(".van-icon.van-icon-arrow-left")
    if (window.retBtn) {
        window.retBtn.addEventListener("click", initMobile, true)
    }
    if (window.dp != null) {
        dp.switchVideo(
            {
                url: playerUrl,
                pic: pic,
                type: 'hls'
            }
        );
    } else {
        let videoContentContainer = document.querySelector(".VideoAuthAdminBg")
        if (videoContentContainer) {
            window.dp = new DPlayer({
                element: document.querySelector(".VideoAuthAdminBg"),                       // 可选，player元素
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
        }

    }

    Global.isReloadVideo = false;
}


function play(playerUrl, pic,element,playType) {

    if (window.dp != null) {
        dp.switchVideo(
            {
                url: playerUrl,
                pic: pic,
                type: playType
            }
        );
    } else {
        window.dp = new DPlayer({
            element: element,                       // 可选，player元素
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

            }
        });
    }
    Global.isReloadVideo = false;
}

async function loadAndPlay(playerUrl, pic, playType,pageType) {
    let intervalNum = setInterval(() => {
        if (typeof DPlayer !== 'undefined') {
            clearInterval(intervalNum);
            if (Global.deviceType === 'mobile') {
                h5play(playerUrl, pic);
            } else {
                let element = null;
                if(pageType === 'live'){
                    element = document.querySelector(".publicVideoContentBigBox");
                    element.style = "height: 550px;"
                }else{
                    element = document.querySelector(".split");
                    element.style = "width: 1200px; height: 550px;"
                }

                play(playerUrl, pic, element,playType);
            }
        }
    }, 300);
}

function isLogin(deviceType) {
    let storage = getStorage(deviceType)
    if (storage) {
        let isLogin = storage.isLogin
        return isLogin;
    }
    return false;
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

function getAccount(deviceType) {
    let account = {};
    let storage = getStorage(deviceType)
    if (storage != null && storage.userName != null && storage.password != null) {
        account.userName = storage.userName;
        account.password = storage.password;
        return account;
    }
    return null;
}

function genAccount() {
    let account = {};
    let phone = randomPhoneNumber();
    account.userName = phone;
    account.password = "123456";
    return account;
}


function registerLogin(account) {
    document.querySelectorAll(".topLoginButtonLine > p")[1].click();
    setTimeout(() => {
        let event = new Event('input', { bubbles: true, cancelable: true, composed: true });
        let accountDom = document.querySelectorAll(".el-form input")[0]
        accountDom.value = account.userName;
        accountDom.dispatchEvent(event)
        let passwordDom = document.querySelectorAll(".el-form input")[1]
        passwordDom.value = account.password;
        passwordDom.dispatchEvent(event)
        let confirmPasswordDom = document.querySelectorAll(".el-form input")[2]
        confirmPasswordDom.value = account.password;
        confirmPasswordDom.dispatchEvent(event)
        document.querySelectorAll(".el-form button")[0].click()
    }, 600);

}

function h5Login(account) {
    // document.querySelector(".van-button").click()
    let event = new Event('input', { bubbles: true, cancelable: true, composed: true });
    let usernameDom = document.querySelector(".publicLoginContentBox input[placeholder='请输入您的手机号或邮箱号']")
    usernameDom.value = account.username
    usernameDom.dispatchEvent(event)
    let passwordDom = document.querySelector(".publicLoginContentBox input[type='password']")
    passwordDom.value = passwordDom.password
    passwordDom.dispatchEvent(event)
    document.querySelector(".publicLoginContentBox button").click()
}


function h5Register(account) {
    setTimeout(()=>{
        // document.querySelector(".loginAboutTextLine").click()
        let event = new Event('input', { bubbles: true, cancelable: true, composed: true });
        let usernameDom = document.querySelector(".publicRegisterContentBox input[placeholder='请输入您的手机号或邮箱号']")
        usernameDom.value = account.username
        usernameDom.dispatchEvent(event)
        let passwordDom = document.querySelector(".publicRegisterContentBox input[type='password']")
        passwordDom.value = account.password
        passwordDom.dispatchEvent(event)
        let confirmPasswordDom = document.querySelector(".publicRegisterContentBox input[placeholder='请在此输入您的密码以确保两次输入一致']")
        confirmPasswordDom.value = account.password
        confirmPasswordDom.dispatchEvent(event)
        setTimeout(()=>{
           document.querySelector(".regButtonLine button").click()
        },600)
    },600)
}

function judgeLocation() {
    let urlpath = window.location.pathname
    if (urlpath === "/") {
        return "home"
    } else if (urlpath.indexOf("/login") > -1) {
        return "login"
    } else if (urlpath.indexOf("/register") > -1) {
        return "register"
    } if (urlpath.indexOf("/videoContent") > -1) {
        return "videoContent"
    } if (urlpath.indexOf("/live") > -1) {
        return "live"
    } else {
        return "other"
    }
}

function login(account) {
    document.querySelectorAll(".topLoginButtonLine > p")[0].click();
    setTimeout(() => {
        let event = new Event('input', { bubbles: true, cancelable: true, composed: true });
        let accountDom = document.querySelector("input[placeholder='请输入手机号/电子邮箱']")
        accountDom.value = account.userName;
        accountDom.dispatchEvent(event);
        let passwordDom = document.querySelector("input[type='password'")
        passwordDom.value = account.password;
        passwordDom.dispatchEvent(event);
        document.querySelectorAll(".el-form button")[0].click()
    }, 600)

}


function storageAccount(account) {
    localStorage.setItem("account", JSON.stringify(account))
}

// function getAccount() {
//     let str = localStorage.getItem("account")
//     let account = JSON.parse(str)
//     return account
// }

function getLocalStorage() {
    let str = localStorage.getItem("liveDarkH5Store")
    if (str) {
        return JSON.parse(str)
    }
    return null;
}

function h5isLogin() {
    let liveDarkH5Store = getLocalStorage()
    if (liveDarkH5Store == null) {
        return false
    }
    return liveDarkH5Store.isLogin
}
async function initMobile() {
    closeDplayer()
    // if (h5isLogin()) {
    //     let urlpath = window.location.pathname
    //     if (urlpath === "/") {
    //         window.items = document.querySelectorAll(".videoListStyle")
    //         window.items.forEach(item => {
    //             item.addEventListener("click", initMobile)
    //         })
    //     } else if (urlpath.indexOf("/videoContent") > -1) {
    //         let localStorage = getLocalStorage()
    //         let token = localStorage.userToken
    //         let dom = document.querySelector(".publicAuthBox")
    //         Global.isReloadVideo = true
    //         reloadVideo(token, Global.deviceType);
    //     }
    //     return
    // }
    setTimeout(async () => {
        let res = judgeLocation();
        if (res === "home") {
            // closeDplayer()
            setTimeout(() => {
                window.items = document.querySelectorAll(".videoListBox")
                window.items.forEach(item => {
                    item.addEventListener("click", initMobile)
                })
                window.items2 = document.querySelectorAll(".van-tab")
                window.items2.forEach(item => {
                    item.addEventListener("click", initMobile)
                })
                window.items3 = document.querySelectorAll(".van-tabbar-item")
                window.items3.forEach(item => {
                    item.addEventListener("click", initMobile)
                })
            }, 100)
        } else if (res === 'login') {
            let account = getAccount()
            if (account) {
                h5Login(account)
            } else {
                let account = {
                    username: randomPhoneNumber(),
                    password: "123456"
                }
                document.querySelector(".loginAboutTextLine").click()
                let res = await h5Register(account)
                if (res.code === 0) {
                    storageAccount(account)
                    h5Login(account)
                }
                alert("请手动注册")
                return
            }
            // closeDplayer()
        } else if (res === 'register') {
            let account = {
                username: randomPhoneNumber(),
                password: "1123456"
            }
            h5Register(account)
            // closeDplayer()
        } else if (res === 'videoContent') {
            if (!h5isLogin()) {
                document.querySelector(".publicAuthBox button").click()
                setTimeout(() => {
                    initMobile()
                }, 300)
                return
            }
            reloadVideo("mobile");
        } if (res === 'live') {
            if (!h5isLogin()) {
                document.querySelector(".publicAuthBox button").click()
                setTimeout(() => {
                    initMobile()
                }, 300)
                return
            }
            reloadVideo("mobile",res);
        }else {
            closeDplayer()
        }
    }, 600)

}


async function reloadVideo(deviceType,pageType) {
    let storage = getStorage(deviceType)
    let token = getToken(storage)
    let videoId = getVideoId()
    let preUrl = '';
    let playType = 'hls'
    if(pageType == 'live'){
        preUrl = await getLiveUrl(token, videoId);
        preUrl = JSON.parse(preUrl)
        if (preUrl.code === 0) {
            let liveUrl = preUrl.data.pull
            let pic = preUrl.data.thumb
            if (deviceType === 'pc') {
                //pic = document.querySelector(".backImg img").getAttribute("src")
            } else {
                let picdom = document.querySelector(".VideoAuthAdminBg img")
                if (picdom) {
                    pic = picdom.getAttribute("src")
                }
            }
            playType = 'flv'
            loadAndPlay(liveUrl, pic, playType,pageType )
        }
    }else{
        preUrl = await getPreUrl(token, videoId)
        preUrl = JSON.parse(preUrl)
        if (preUrl.code === 0) {
            let m3u8Url = preUrl.data.url
            let splited = m3u8Url.split("?")
            let m3u8UrlParams = splited[1]
            let urlSearchParams = new URLSearchParams(m3u8UrlParams)
            urlSearchParams.delete("start")
            urlSearchParams.delete("end")
            let newM3U8Url = splited[0] + "?" + urlSearchParams.toString()
            let pic;
            if (deviceType === 'pc') {
                pic = document.querySelector(".backImg img").getAttribute("src")
            } else {
                let picdom = document.querySelector(".VideoAuthAdminBg img")
                if (picdom) {
                    pic = picdom.getAttribute("src")
                }

            }
            loadAndPlay(newM3U8Url, pic)
        }
    }

}

async function initPC() {
    let deviceType = 'pc'
    if (!isLogin(deviceType)) {
        let account = getAccount(deviceType);
        if (account !== null) {
            login(account);
        } else {
            account = genAccount(deviceType)
            registerLogin(account);
        }
    }
    let pageType = judgeLocation();
    reloadVideo(deviceType,pageType);
}

function init() {
    let localStorage = getLocalStorage();
    if (localStorage == null) {
        initPC()
        return
    }
    Global.deviceType = 'mobile'
    if (!Global.isReloadVideo) {
        initMobile()
    }
    // setInterval(() => {

    // }, 600)
}

(function () {
    'use strict';
    importLib();
    setTimeout(() => {
        init();
    }, 1200)
    console.log("插件已启动")
})();