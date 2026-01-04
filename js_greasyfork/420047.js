// ==UserScript==
// @name         b站 临时关闭弹幕 bilibili 哔哩哔哩
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  临时关闭一次视频弹幕，不会影响其他视频。
// @author       You
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420047/b%E7%AB%99%20%E4%B8%B4%E6%97%B6%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95%20bilibili%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/420047/b%E7%AB%99%20%E4%B8%B4%E6%97%B6%E5%85%B3%E9%97%AD%E5%BC%B9%E5%B9%95%20bilibili%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9.meta.js
// ==/UserScript==

(function () {
    function observation(mutations,observer){
        inject()
    }
    const player = document.getElementById('bilibili-player')
    const observer = new MutationObserver(observation)
    observer.observe(player,{childList: true, subtree: true })

    function inject() {
        if(document.getElementById('danmaku-switch-once')){
            return
        }

        const container = document.getElementsByClassName("bilibili-player-video-danmaku-root")[0];
        if (container) {
            const button = document.createElement("div");
            button.innerText = "弹";
            button.id = 'danmaku-switch-once'
            button.classList.add('actived')
            button.style = 'color:#00a1d6;margin-right:5pt;border:1px solid #00a1d6;border-radius:50%;height:17px;width:17px;line-height:17px;text-align:center;cursor:pointer;'
            button.onclick = function(){
                if(this.className.indexOf('active') > -1){
                    this.classList.remove('actived')
                    this.style.borderColor = '#757575'
                    this.style.color = '#757575'
                    document.getElementsByClassName('bilibili-player-video-danmaku')[0].style.visibility = 'hidden'
                }else{
                    this.classList.add('actived')
                    this.style.borderColor = '#00a1d6'
                    this.style.color = '#00a1d6'
                    document.getElementsByClassName('bilibili-player-video-danmaku')[0].style.visibility = 'visible'
                }
            }
            container.insertBefore(button, container.children[0]);
        } else {
            requestAnimationFrame(inject);
        }
    }
})();
