// ==UserScript==
// @name         时间轴笔记(暂时只提供了字幕的展示DEMO)
// @namespace    https://lazy.icu/bili_timeaxis
// @version      0.0.1
// @description  给B站视屏增加时间轴笔记
// @author       码魂
// @match        https://www.bilibili.com/video/*/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @require      https://cdn.jsdelivr.net/npm/winbox@0.2.6
// @noframes
// @grant        none
// @license      APACHE
// @downloadURL https://update.greasyfork.org/scripts/468227/%E6%97%B6%E9%97%B4%E8%BD%B4%E7%AC%94%E8%AE%B0%28%E6%9A%82%E6%97%B6%E5%8F%AA%E6%8F%90%E4%BE%9B%E4%BA%86%E5%AD%97%E5%B9%95%E7%9A%84%E5%B1%95%E7%A4%BADEMO%29.user.js
// @updateURL https://update.greasyfork.org/scripts/468227/%E6%97%B6%E9%97%B4%E8%BD%B4%E7%AC%94%E8%AE%B0%28%E6%9A%82%E6%97%B6%E5%8F%AA%E6%8F%90%E4%BE%9B%E4%BA%86%E5%AD%97%E5%B9%95%E7%9A%84%E5%B1%95%E7%A4%BADEMO%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('加载时间轴笔记...')
    const bv = document.querySelector('video')
    const mainBox = new WinBox("时间轴笔记", {
        //mound: document.querySelector('.bui-long-list-list'),
        x: bv.getBoundingClientRect().right + 8,
        y: bv.getBoundingClientRect().top,
        width: document.body.offsetWidth - bv.getBoundingClientRect().right - 16,
        index: 99999,
        class: [ "modern", "no-max", "no-full", "no-resize"],
    });
    window.addEventListener('resize',(e)=>{
        console.log('window resize');
        mainBox.x = bv.getBoundingClientRect().right + 8;
        mainBox.width = document.body.offsetWidth - bv.getBoundingClientRect().right - 16;
        mainBox.resize();
        mainBox.move();
    })
    try{
        const subtitleUrl = window.__INITIAL_STATE__.videoData.subtitle.list[0].subtitle_url;
        console.log('字幕:',subtitleUrl)
        fetch(subtitleUrl.replace('http','https')).then(v=>v.json()).then(d=>{
            console.log(d)
            const subtitle = d.body.map((item, index) => {
                return {
                    from: item.from,
                    content: item.content,
                    index,
                }
            }).sort((a, b) => a.index - b.index)
            let html = `<div><p><span>时间</span>&nbsp;&nbsp;<span>字幕</span></p>`
            subtitle.forEach(t=>{
                html+=`<p id="subid_${t.index}"><span onclick="player.seek(${t.from})">${t.from}</span>&nbsp;&nbsp;<span>${t.content}</span></p>`
            })
            html+=`</div>`
            mainBox.body.innerHTML=html
            // 打开视屏时,如果以前看过不一定是从头开始播放
            let currentIndex = 0;
            for(;currentIndex<subtitle.length-1;currentIndex++){
                if(player.getCurrentTime()<subtitle[currentIndex+1].from){
                    break
                }
            }
            highlightItem(currentIndex)
            player.core().video.addEventListener('timeupdate',()=>{
                const cur_time = player.getCurrentTime()
                const total = subtitle.length
                if( currentIndex < (subtitle.length-1) && cur_time>subtitle[currentIndex+1].from){
                    currentIndex++
                    highlightItem(currentIndex)
                }
            })
            player.core().video.addEventListener('seeked',()=>{
                for(currentIndex=0;currentIndex<subtitle.length-1;currentIndex++){
                    if(player.getCurrentTime()<subtitle[currentIndex+1].from){
                        break
                    }
                }
                highlightItem(currentIndex)
            })

        })
    }catch(e){
        console.log('未发现字幕')
    }
function highlightItem(currentIndex){
    const currentNode = document.getElementById(`subid_${currentIndex}`);
    // 移除背景色
    document.querySelectorAll('.act').forEach(n=>{
        n.classList.remove('act')
        n.style.removeProperty('background')
    })
    // 添加背景色
    currentNode.style.background="red"
    currentNode.className = 'act'
    // 滚动
    mainBox.body.scrollTop=currentNode.offsetTop - mainBox.body.offsetHeight/2
}
})();