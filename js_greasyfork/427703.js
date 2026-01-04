// ==UserScript==
// @name         Bili_HD_Link
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  B站视频外链，高清播放
// @author       月离
// @match        *://*/*
// @grant          GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/427703/Bili_HD_Link.user.js
// @updateURL https://update.greasyfork.org/scripts/427703/Bili_HD_Link.meta.js
// ==/UserScript==

window.onload=(function() {
    'use strict';
// 更改ref
delete window.document.referrer;
Object.defineProperty(document, "referrer", {get : function(){ return "https://www.bilibili.com/"; }});


// 遍历视频
let videos = document.getElementsByTagName("iframe");

for(let i=0;i<videos.length;i++){
    let v = videos[i];

    // 如果使用高清链接,直接跳过
    if(v.src.indexOf("html5") + 1){
        continue;
    }

    let paramsString = v.src.split("?")[1];
    var searchParams = new URLSearchParams(paramsString);

    let bvid = searchParams.has("bvid")?searchParams.get("bvid"):0;
    let page = searchParams.has("page")?searchParams.get("page"):1;

    // 如果iframe 没有BV号,直接跳过
    if (!bvid){
      continue;
    }
    v.src = `https://www.bilibili.com/blackboard/html5player.html?bvid=${bvid}&p=${page}&high_quality=1`;
}

// 修改样式(待定)
// GM_addStyle('.video_src{display:none !important}')
// GM_addStyle('.video_real{display:block!important;height:660px}')
});
