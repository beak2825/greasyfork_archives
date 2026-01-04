// ==UserScript==
// @name        BiliNoLogin - 关闭登录提示
// @namespace   peasoft.github.io
// @match       https://www.bilibili.com/video/*
// @match       https://space.bilibili.com/*
// @grant       window.onurlchange
// @version     1.2
// @author      陆鎏澄
// @description 自动关闭B站网页端观看视频1分钟时的登录提示。
// @icon        https://www.bilibili.com/favicon.ico
// @license     CC BY-NC-SA
// @downloadURL https://update.greasyfork.org/scripts/471552/BiliNoLogin%20-%20%E5%85%B3%E9%97%AD%E7%99%BB%E5%BD%95%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/471552/BiliNoLogin%20-%20%E5%85%B3%E9%97%AD%E7%99%BB%E5%BD%95%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

function videoPage(){
    var iId = 0;
    var screenId = 'normal';

    function restart(){
        let player = document.getElementsByClassName('bpx-player-video-wrap')[0].firstElementChild;
        player.play();
        player.removeEventListener('pause', restart);
    }

    function closeLogin(){
        let btn = document.getElementsByClassName('bili-mini-close-icon')[0];
        if(btn){
            btn.click();
            if(screenId != 'normal'){
                let btns = document.getElementsByClassName('bpx-player-ctrl-web');
                if(btns){btns[0].click()}
            }
            if(screenId == 'full'){
                let btns2 = document.getElementsByClassName('bpx-player-ctrl-full');
                if(btns2){
                    let fullBtn = document.createElement('a');
                    fullBtn.style = "position: fixed; left: 0; top: 0; width: 100%; height: 100%; background-color: #000b; z-index: 1000000000; color: #fff; font-size: 500%; text-align: center;";
                    fullBtn.innerText = "点击屏幕恢复全屏";
                    fullBtn.onclick = function(){
                        btns2[0].click()
                        fullBtn.remove();
                    }
                    document.body.appendChild(fullBtn);
                }
            }
            clearInterval(iId);
        }
    }

    let mainId = undefined;

    function init(){
        if(mainId) return;
        mainId = setTimeout(function(){
            let player = document.getElementsByClassName('bpx-player-video-wrap')[0].firstElementChild;
            player.addEventListener('pause', restart);
            iId = setInterval(closeLogin, 10);
            screenId = document.getElementsByClassName('bpx-player-container')[0].dataset['screen'];
            mainId = undefined;
        }, 58000);
    }

    init();

    // 自定义 urlchange 事件（用来监听 URL 变化），针对非 Tampermonkey 油猴管理器，摘自 https://greasyfork.org/scripts/412245
    function addUrlChangeEvent() {
        history.pushState = ( f => function pushState(){
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('pushstate'));
            window.dispatchEvent(new Event('urlchange'));
            return ret;
        })(history.pushState);

        history.replaceState = ( f => function replaceState(){
            var ret = f.apply(this, arguments);
            window.dispatchEvent(new Event('replacestate'));
            window.dispatchEvent(new Event('urlchange'));
            return ret;
        })(history.replaceState);

        window.addEventListener('popstate',()=>{ // 点击浏览器的前进/后退按钮时触发 urlchange 事件
            window.dispatchEvent(new Event('urlchange'))
        });
    }
    if (window.onurlchange === undefined) addUrlChangeEvent();
    window.addEventListener('urlchange', init);
}

function spacePage(){
    var iId = 0;
    function closeLogin(){
        let btn = document.getElementsByClassName('bili-mini-close-icon')[0];
        if(btn){
            btn.click();
            clearInterval(iId);
        }
    }
    iId = setInterval(closeLogin, 500);
}

if(location.hostname == 'space.bilibili.com'){
    spacePage();
}
else {
    videoPage();
}
