// ==UserScript==
// @name         Acfun视频时间戳跳转
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.acfun.cn/v/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420048/Acfun%E8%A7%86%E9%A2%91%E6%97%B6%E9%97%B4%E6%88%B3%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/420048/Acfun%E8%A7%86%E9%A2%91%E6%97%B6%E9%97%B4%E6%88%B3%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function strToTime(str, hStr, mStr, sStr){
        let time = 0
        let hIndex = str.indexOf(hStr)
        let mIndex = str.indexOf(mStr)
        let sIndex = str.indexOf(sStr)
        let nextIndex = 0
        if (hIndex !== -1) {
            time += parseInt(str.substring(nextIndex, hIndex)) * 3600
            nextIndex = hIndex + 1
        }
        if (mIndex !== -1){
            time += parseInt(str.substring(nextIndex, mIndex)) * 60
            nextIndex = mIndex + 1
        }
        if (sIndex !== -1) {
            time += parseInt(str.substring(nextIndex, sIndex))
        }
        return time
    }
    let urlVal = location.href.split('?')[1]
    if (!urlVal || urlVal.length === 0) return
    urlVal = decodeURI(urlVal)
    let querys = urlVal.split('&')
    if (querys.length > 0) {
        let params = {}
        for(let item of querys) {
            let detail = item.split('=')
            params[detail[0]] = detail[1]
        }
        console.log(params)
        if (params.time) {
            let time
            let timeStr = params.time
            console.log(timeStr)
            if (timeStr.indexOf('时') !== -1 || timeStr.indexOf('分') !== -1 || timeStr.indexOf('秒') !== -1) {
                time = strToTime(timeStr, '时', '分','秒')
            }
            else if (timeStr.indexOf('h') !== -1 || timeStr.indexOf('m')!== -1 || timeStr.indexOf('s') !== -1) {
                time = strToTime(timeStr, 'h','m','s')
            }
            else if (timeStr.indexOf('H') !== -1 || timeStr.indexOf('M')!== -1 || timeStr.indexOf('S') !== -1) {
                time = strToTime(timeStr, 'H','M','S')
            }
            else if (timeStr.indexOf(':') !== -1) {
                let timeArr = html.split(':')
                if (timeArr.length === 2) {
                    time = parseInt(html.split(':')[0])*60 + parseInt(html.split(':')[1])
                } else {
                    time = parseInt(html.split(':')[0])*3600 + parseInt(html.split(':')[1])*60 + parseInt(html.split(':')[2])
                }
            } else {
                time = parseInt(timeStr)
            }
            console.log(time)
            if(!isNaN(time)) {
                let interval = setInterval(()=>{
                    let video = document.querySelector('video')
                    if (video) {
                        clearInterval(interval)
                        video.onloadeddata = ()=> {
                            video.currentTime = time
                        }
                    }
                }, 100)
                }
        }

    }
})();