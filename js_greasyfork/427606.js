// ==UserScript==
// @name         DoubanMovieJSON
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  https://github.com/Rocket-Factory/DoubanMovieJSON
// @author       You
// @license      MIT
// @match        https://movie.douban.com/subject/*
// @icon         https://www.google.com/s2/favicons?domain=douban.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427606/DoubanMovieJSON.user.js
// @updateURL https://update.greasyfork.org/scripts/427606/DoubanMovieJSON.meta.js
// ==/UserScript==

(function() {
    'use strict';
    async function run(){
        let rating = document.getElementsByTagName('strong')[0].innerText;
        let text = '';
        if(rating==''){
            text = '无评分';
        } else {
            let mid = /subject\/(\d+)\//.exec(document.getElementsByName('mobile-agent')[0].content)[1].trim();
            let gt_res = await fetch(`https://douban.8610000.xyz/data/${mid}.json`)
            if(gt_res.status === 404){
                let res = await fetch(`https://douban.8610000.xyz/api/v1/queue/movie/${mid}`);
                text = res.status === 200 ? '已收录,待提交' : '已加入队列';
            }else{
                text = '已收录';
            }
        }
        let ele = `<div style="position:fixed;top: 322px;left: 10px;" class="DoubanJson"><div style="display: inline-block;height: auto;color: #ca6445;background: #fae9da; border-radius: 2px;float: right;line-height: 13px;padding: 7px 12px;">${text}</div>`
        document.getElementById('db-global-nav').insertAdjacentHTML('afterend',ele);
    }

    run();
})();