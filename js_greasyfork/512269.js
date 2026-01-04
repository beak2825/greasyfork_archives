// ==UserScript==
// @name         极简解析爱奇艺、腾讯视频VIP视频
// @description  极简解析爱奇艺、腾讯视频VIP视频，解析源可靠。
// @namespace    http://study365.free.nf
// @version      3
// @match      https://*.iqiyi.com/v_*
// @match      https://*.iqiyi.com/w_*
// @match      https://*.iqiyi.com/a_*
// @match      https://v.qq.com/x/cover/*
// @match      https://v.qq.com/x/page/*
// @match      https://v.qq.com/tv/*
// @match      https://m.v.qq.com/x/m/play*
// @match      https://m.v.qq.com/x/play*
// @grant      none
// @downloadURL https://update.greasyfork.org/scripts/512269/%E6%9E%81%E7%AE%80%E8%A7%A3%E6%9E%90%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91VIP%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/512269/%E6%9E%81%E7%AE%80%E8%A7%A3%E6%9E%90%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91VIP%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let list = [
        {"name": "M1907", "url": "https://im1907.top/?jx=", "type":"all"},
        {"name": "2s0", "url": "https://jx.2s0.cn/player/?url=", "type":"all"},
        {"name": "虾米", "url": "https://jx.xmflv.com/?url=", "type":"pc"},
        {"name": "playerjy", "url": "https://jx.playerjy.com/?url=", "type":"pc"},
        {"name": "ckplayer", "url": "https://www.ckplayer.vip/jiexi/?url=", "type":"pc"},
        {"name": "夜幕", "url": "https://www.yemu.xyz/?url=", "type":"pc"},
        {"name": "七哥", "url": "https://jx.nnxv.cn/tv.php?url=", "type":"all"},
    ];
    setTimeout(function () {
        let href = location.href;
        let params = {};
        let arr = location.search.substring(1).split('&');
        for (let str of arr) {
            let pair = str.split("=");
            params[pair[0]] = pair[1];
        }
        if (href.indexOf('/m.v.qq.com') > 0) {
            href = 'https://v.qq.com/x/cover/' + params.cid + '/' + params.vid + '.html';
        }
        let mobile= /Mobile|Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
        let html = "<div style='z-index:999999999999;position:fixed;top:0;background:rgba(255,255,255,0.5)'>";
        for (let ele of list) {
            if(ele.type=="all"|| (mobile && ele.type=="mobile")||(!mobile && ele.type=="pc")){
                html += `<a href="` + ele.url + href + `" target="_blank" rel='noopener noreferrer' style="margin:5px;color:red;line-height:24px;font-size:16px">` + ele.name + `</a>`
            }
        }
        html += "</div>";
        let div = document.createElement("div");
        div.innerHTML = html;
        document.body.appendChild(div);
    },2000);
})();