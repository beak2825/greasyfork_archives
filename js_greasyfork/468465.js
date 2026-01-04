
// ==UserScript==
// @name         nextPage
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  各种视频、动漫网站，增加下一话等功能
// @author       yeahMao
// @match        https://ac.qq.com/*
// @match        https://www.88mv.tv/*
// @match        https://www.colamanhua.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=88mv.tv
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468465/nextPage.user.js
// @updateURL https://update.greasyfork.org/scripts/468465/nextPage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function nextPage(strRe, incVal) {
        let re = RegExp(strRe);
        let ret = re.exec(location.href)
        if (ret) {
            let oldPage = parseInt(ret[1])
            let newPage = oldPage + incVal

            // 替换strRe中的()内容
            let strNew = strRe.replace(RegExp('\\(.*\\)'), newPage.toString())
            let href = location.href.replace(re, strNew)
            console.warn(strRe, strNew, href)
            // alert(`${oldPage}.html`)
            location.href = href
        }
    }

    function main(incVal) {
        let cfg = {
            // https://ac.qq.com/ComicView/index/id/530969/cid/2
            'ac.qq.com': 'cid/(\\d+)', // cid/(\d+)
            // ('https://www.88mv.tv/vod-play-id-82456-src-2-num-314.html')
            'www.88mv.tv': '(\\d+).html',
            'www.colamanhua.com': '(\\d+).html',
        }
        let strRe = cfg[location.host];
        if (strRe) {
            nextPage(strRe, incVal)
        }
    }

    function myEvent(e) {
        e = e || window.event; //标准化事件处理
        var s = e.type + " " + e.keyCode; //获取键盘事件类型和按下的值
        console.log(s, e);
        switch(e.keyCode){ // 获取当前按下键盘键的编码
            case 37 : //  方向左←
            // case 40 : //  方向下↓
            case 0x64 : //  小键盘 4
                main(-1)
                break;
            // case 38 : //  方向上↑
            case 39 : //  方向右→
            case 0x66 : //  小键盘 6
                main(1)
                break;
        }
        return false
    }
    // 监听键盘事件
    document.addEventListener('keydown', function(e) {
        myEvent(e)
    })

    // document.body.onkeyup = function (e) {
        // myEvent(e)
    // }
})();