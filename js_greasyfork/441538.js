// ==UserScript==
// @name         知乎视频隐藏
// @version      0.0.1
// @namespace    jucheng
// @description  自动隐藏知乎视频，摸鱼神器
// @author       jc
// @match        *://*.zhihu.com/*
// @run-at       document-end
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441538/%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/441538/%E7%9F%A5%E4%B9%8E%E8%A7%86%E9%A2%91%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

let g_index = 0
setInterval(()=>{
    let list = document.getElementsByClassName('ZVideoItem-video');
    let currentVideo = list[g_index];
    if(currentVideo){
        currentVideo.style.display='none';
        let btn = document.createElement('a');
        btn.innerText = '展示视频';
        btn.style.color='blue'
        btn.style.cursor='pointer'
        btn.statue=0
        btn.onclick=()=>{
            if(btn.statue === 0){
                btn.innerText = '隐藏视频';
                currentVideo.style.display='block'
                btn.statue = 1
            }else{
                btn.innerText = '展示视频';
                currentVideo.style.display='none'
                btn.statue = 0
            }
        }
        currentVideo.parentNode.appendChild(btn)
        g_index++
    }
},1000)