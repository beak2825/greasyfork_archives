// ==UserScript==
// @name         下载淘宝天猫商详视频
// @namespace    https://greasyfork.org/zh-CN/users/177458-bd777
// @version      0.1
// @description  在页面上给个下载的按钮
// @author       windeng
// @match        https://detail.tmall.com/item.htm*
// @match        https://item.taobao.com/item.htm*
// @icon         https://img.alicdn.com/favicon.ico
// @require      https://greasyfork.org/scripts/433877-%E4%B8%AA%E4%BA%BA%E5%B8%B8%E7%94%A8%E7%9A%84%E4%B8%80%E4%BA%9B%E7%AE%80%E5%8D%95%E5%87%BD%E6%95%B0-%E5%8B%BF%E5%AE%89%E8%A3%85/code/%E4%B8%AA%E4%BA%BA%E5%B8%B8%E7%94%A8%E7%9A%84%E4%B8%80%E4%BA%9B%E7%AE%80%E5%8D%95%E5%87%BD%E6%95%B0%EF%BC%8C%E5%8B%BF%E5%AE%89%E8%A3%85.js?version=978987
// @grant        GM_xmlhttpRequest
// @connect      taobao.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438866/%E4%B8%8B%E8%BD%BD%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E5%95%86%E8%AF%A6%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/438866/%E4%B8%8B%E8%BD%BD%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E5%95%86%E8%AF%A6%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

function downloadFile (url, fileName) { //跨域文件路径、下载到本地的文件名
    var x = new XMLHttpRequest()
    x.open("GET", url, true)
    x.responseType = 'blob'
    x.onload = function (e) {
        var url = window.URL.createObjectURL(x.response)
        var a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
    }
    x.send()
}

async function handleTmall () {
    await WaitUntil(() => {
        return !!document.querySelector('video > source')
    })

    const src = document.querySelector('video > source').getAttribute('src')
    const title = document.querySelector('div.tb-detail-hd > h1').innerText
    let elem = document.createElement('a')
    elem.setAttribute('href', '#')
    // elem.setAttribute('download', `${title}.mp4`)
    // elem.setAttribute('target', '_blank')
    elem.setAttribute('style', 'font-size: 1.2em; margin-bottom: 5px; display: inline-block;')
    elem.innerText = '下载视频'
    elem.onclick = () => {
        downloadFile(src, `${title}.mp4`)
    }

    const detailElem = document.querySelector('div.tb-detail-hd > h1')
    detailElem.parentNode.insertBefore(elem, detailElem)
}

async function getVideoQueryUrl () {
    return new Promise((resolve, reject) => {
        let observer = new MutationObserver(function(mutations) {
            // console.log(mutations)
            for (let m of mutations) {
                /*
            for (let node of m.addedNodes) {
                if (node.tagName.toLowerCase() === 'script') console.log('add script node', node)
            }
            */
                for (let node of m.removedNodes) {
                    if (node.tagName && node.tagName.toLowerCase() === 'script' && node.src.search('video.queryforh5') !== -1) {
                        resolve(node.src)
                    }
                }
            }
        })

        observer.observe(document, {
            childList: true,
            subtree: true
        })
    })
}

async function getVideoInfo (url) {
    let opt = {}
    Object.assign(opt, {
        url,
        timeout: 2000,
        method: 'GET'
    })
    return new Promise((resolve, reject) => {
        opt.onerror = opt.ontimeout = reject
        opt.onload = resolve

        GM_xmlhttpRequest(opt)
    }).then(res => {
        let str = res.responseText.trim().substr('mtopjsonp1('.length)
        str = str.trim()
        str = str.substr(0, str.length - 1)
        return JSON.parse(str)
    })
}

async function handleTaobao () {
    const videoQueryUrl = await getVideoQueryUrl()
    console.log('videoQueryUrl', videoQueryUrl)
    const resp = await getVideoInfo(videoQueryUrl)
    console.log('videoResp', resp)

    const src = resp.data.mp4Resources[0].video_url
    const title = document.querySelector('h3.tb-main-title').innerText
    let elem = document.createElement('a')
    elem.setAttribute('href', '#')
    // elem.setAttribute('download', `${title}.mp4`)
    // elem.setAttribute('target', '_blank')
    elem.setAttribute('style', 'font-size: 1.2em; margin-bottom: 5px; display: inline-block;')
    elem.innerText = '下载视频'
    elem.onclick = () => {
        downloadFile(src, `${title}.mp4`)
    }

    const detailElem = document.querySelector('h3.tb-main-title')
    detailElem.parentNode.insertBefore(elem, detailElem)
}

(function() {
    'use strict';

    // Your code here...
    if (window.location.href.search('detail.tmall.com') !== -1) {
        handleTmall()
    } else if (window.location.href.search('item.taobao.com') !== -1) {
        handleTaobao()
    }
})();