// ==UserScript==
// @name         kospantsu广告屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  针对kospantsu这个网制作的一系列广告、弹窗屏蔽及下载链相关网站的广告屏蔽和一点点黑夜模式样式
// @author       JarvanL
// @match        *://*.mirrorace.org/*
// @match        *://*.wooseotools.com/*
// @match        *://*.ouo.io/*
// @match        *://*.blogspot.com/*
// @match        *://mirrorace.org/*
// @match        *://wooseotools.com//*
// @match        *://ouo.io//*
// @match        *://blogspot.com//*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kospantsu.blogspot.com
// @license      MIT
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/470915/kospantsu%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/470915/kospantsu%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

function startScript() {
    const host = location.host
    const path = location.pathname
    // console.log('start', host, path)
    if(host === "kospantsu.blogspot.com") return blogspot(path)
    if(host === "mirrorace.org") return mirrorace(path)
    if(host === "wooseotools.com") return wooseotools(path)
    if(host === "ouo.io") return ouo(path)
}
startScript()

// kospantsu.blogspot.com
function blogspot(pathName) {
    let adsScript = document.getElementsByTagName('script')
        Array.from(adsScript).forEach(item => {
            item.remove()
        })
    window.open = function() {}

    if(pathName === "/") {
        if(document.getElementById('main-ads1')) document.getElementById('main-ads1').remove()
        if(document.getElementById('footer-ads')) document.getElementById('footer-ads').remove()
    }

    if(pathName === "/p/index.html") {
    GM_addStyle(".all-post li {background: none !important;} .all-post li:hover {background: #1680c6 !important;}")
    }

    if(/^\/\d{4}\/\d{2}\/[a-zA-z0-9-]+\.html$/.test(pathName)) {
        if(document.getElementById('top-ad-placeholder')) document.getElementById('top-ad-placeholder').remove()
        if(document.getElementById('bottom-ad-placeholder')) document.getElementById('bottom-ad-placeholder').remove()
        if(document.getElementById('new-bottom-ad-placeholder')) document.getElementById('new-bottom-ad-placeholder').remove()
        if(document.getElementById('HTML4')) document.getElementById('HTML4').remove()
        if(document.getElementById('HTML1')) document.getElementById('HTML1').remove()
        let centerAds = document.getElementsByTagName('center')
        for(let i = 0; i < centerAds.length; i++) {
            if(centerAds[i].firstElementChild.tagName === 'IFRAME') centerAds[i].remove()
        }
    }
}

// mirrorace.org
function mirrorace(pathName) {
    // console.log(pathName)
    let mirroraceAdd = document.getElementsByClassName("uk-margin")
    if(mirroraceAdd.length > 0) {
        mirroraceAdd[0].remove()
        mirroraceAdd[0].remove()
        mirroraceAdd[3].remove()
    }
}

// wooseotools.com
function wooseotools(pathName) {
    if(document.getElementById('masthead')) document.getElementById('masthead').remove()
    if(document.getElementById('content')) document.getElementById('content').remove()
    GM_addStyle(".hv-box { min-height: 30vh !important;} body {background: #2a2a2a !important; color: #fff !important;} .hitmag-wrapper {background: #2f2f2f !important;} .hv-alert {background: #222 !important;}")
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if(mutation.target.tagName === "DIV") {
                if(mutation.target.attributes[0].value === "position: fixed; width: 100vw; background: rgba(0, 0, 0, 0.5); top: 0; bottom: 0; left: 0; display: flex; z-index: 999999;") {
                    mutation.target.remove()
                }
            }
        });
    });
    observer.observe(document, { childList: true, subtree: true });
}

//ouo.io
function ouo(pathName) {
    GM_addStyle(".skip-container{background: #2a2a2a !important;} h4{color: #c5c5c5 !important;}")
    window.open = function() {}

    if(document.getElementsByClassName('about').length > 0) document.getElementsByClassName('about')[0].remove()
    if(document.getElementsByClassName('join-now').length > 0) document.getElementsByClassName('join-now')[0].remove()
    let textCenter
    if(document.getElementsByClassName('text-center').length > 0) {
        textCenter = document.getElementsByClassName('text-center')[0]
        let ads = textCenter.getElementsByTagName('div')
        if(ads.length > 0) ads[0].remove()
    }
    // 清除所有iframe
    let iframeElements
    if(document.getElementsByTagName('iframe').length > 0) {
        iframeElements = document.getElementsByTagName('iframe')
        Array.from(iframeElements).forEach(item => {
            item.remove()
        })
    }
    // 重构下body
    let body = document.getElementsByTagName('body')[0]
    let header = body.getElementsByTagName('header')[0]
    let section = body.getElementsByTagName('section')[0]
    let footer = body.getElementsByClassName('footer-copy')[0]
    body.innerHTML = ''
    body.appendChild(header)
    body.appendChild(section)
    body.appendChild(footer)
    window.stop()
    window.open = function() {}

    // 清除后加的元素
    let observer = new MutationObserver(function(mutations) {
        // 移除所有script
        let adsScript = document.getElementsByTagName('script')
        Array.from(adsScript).forEach(item => {
            item.remove()
        })
        mutations.forEach(function(mutation) {
            clearInterval(this.catchallmon)
            // 检测特定广告
            if(mutation.target.id === "outbrain_widget_0" || mutation.target.id === "rn_ad_native_nja2g") {
                // console.log("outbrain_widget_0", mutation.target)
                mutation.target.remove()
            }
            // 检测追加的script和iframe元素
            if(mutation.addedNodes.length > 0) {
                // console.log("addedNodes被检测", mutation.addedNodes.length, "个")
                for(let j = 0; j < mutation.addedNodes.length; j++) {
                    if(mutation.addedNodes[j].nodeName === "IFRAME" || mutation.addedNodes[j].nodeName === "SCRIPT") {
                        // console.log("发现", mutation.addedNodes[j].nodeName)
                        mutation.addedNodes[j].remove()
                    }
                }
            }
        });
    });
    observer.observe(document, { childList: true, subtree: true });
}
