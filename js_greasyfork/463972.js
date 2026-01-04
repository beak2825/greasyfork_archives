// ==UserScript==
// @name         简书去广告
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  去除简书广告|预览大屏显示
// @author       CC
// @license MIT
// @connect      www.jianshu.com
// @include      https://www.jianshu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @note         2023-04-14 1.0.0 初版发布
// @downloadURL https://update.greasyfork.org/scripts/463972/%E7%AE%80%E4%B9%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/463972/%E7%AE%80%E4%B9%A6%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        console.log(`开始净化页面`)
        const st = new Date().getTime();
        // 删除广告
        let ads = document.getElementsByClassName('adad_container');
        for(let ad of Array.from(ads)){
            ad.remove()
        }

        // 2023-04-14发现新的游戏广告
        ads = document.querySelectorAll("body>div:not([id=__next])");
        for(let ad of Array.from(ads)){
            ad.remove()
        }

        //删除【点赞、打赏】
        const ss = document.getElementsByClassName('_3Pnjry');
        for(let ad of Array.from(ss)){
            ad.remove()
        }

        //增加宽度
        document.querySelector('div._21bLU4._3kbg6I').style.backgroundColor='#b3b3b3'
        document.getElementsByClassName('_3VRLsv')[0].style.width='100%';
        document.getElementsByClassName('_3VRLsv')[0].style.boxSizing='border-box';
        document.getElementsByClassName('_gp-ck')[0].style.width='calc(100% - 300px)';

        //删除右侧【热门故事】
        document.querySelector('aside._2OwGUo > div').remove();
        //删除下侧【热门故事】
        document.querySelectorAll('div._gp-ck > section.ouvJEz')[1].remove();
        //删除【赞赏支持】
        document.querySelector('div._13lIbp').remove();

        document.getElementsByClassName('_3Z3nHf')[0].style.width='260px';
        document.getElementsByClassName('_3Z3nHf')[0].style.position='fixed';

        const et = new Date().getTime();
        console.log(`净化页面完毕，耗时[${et-st}]ms`)
    }

})();