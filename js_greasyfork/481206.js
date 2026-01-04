// ==UserScript==
// @name               youtube skip ad
// @name:zh-CN         youtube跳过广告
// @name:zh-TW         youtube跳過廣告
// @name:ja            youtube広告をスキップする
// @description        if play ad then jump to ad video end
// @description:zh-TW  當播放廣告時直接將廣告跳到最後
// @description:zh-CN  当播放广告时直接将广告跳到最后
// @description:ja     広告の再生中に最後に直接ジャンプします
// @namespace          https://greasyfork.org/zh-TW/users/461233-jack850628
// @version            1.0.250119
// @author             jack850628
// @include            https://*.youtube.com/*
// @noframes
// @run-at             document-end
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/481206/youtube%20skip%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/481206/youtube%20skip%20ad.meta.js
// ==/UserScript==

(function() {
    function skypeVideo(player){
        if(!player.dataset.adWatcher){
            player.dataset.adWatcher = true;
            player.addEventListener('loadeddata', function(e){
                setTimeout(function(){
                    console.debug('影片來源更換了')
                    for(let playerDiv of [document.querySelector('#player'), document.querySelector('#full-bleed-container')]){
                        if(playerDiv?.querySelectorAll('.html5-video-player .ytp-ad-text, .html5-video-player .ad-simple-attributed-string')?.length > 0){
                            console.log('發現廣告！')
                            player.currentTime = player.duration;
                            setTimeout(function(){
                                playerDiv.querySelector('.html5-video-player .ytp-ad-skip-button-modern').click();
                            });
                        }
                    }
                }, 5);
            });
        }
    }
    function observerPlayerRoot(doc){
        let player = doc.querySelector('video');
        if(player){
            console.debug('找到播放器', player);
            skypeVideo(player);
        }
        let ycpObserver = new MutationObserver((mutationdeList, observer) => {
            mutationdeList.flatMap(i => [...i.addedNodes]).flat().forEach(doc => {
                if(doc.tagName){
                    let player = null;
                    if(doc.tagName == 'VIDEO'){
                        player = doc;
                    }else if(!["SCRIPT", "STYLE", "LINK", "MATE"].includes(doc.tagName)){
                        player = doc.querySelector('video');
                    }
                    if(player){
                        console.debug('找到播放器', player);
                        skypeVideo(player);
                    }
                }
            });
        });
        ycpObserver.observe(
            doc,
            {
                childList: true,
                subtree: true
            }
        );
    }
    let playerRoot = document.querySelector('#player');
    if(playerRoot){
        observerPlayerRoot(playerRoot);
    }else{
        let rootObserver = new MutationObserver((mutationdeList, observer) => {
            mutationdeList.flatMap(i => [...i.addedNodes]).flat().forEach(doc => {
                if (doc.tagName && !["SCRIPT", "STYLE", "LINK", "MATE"].includes(doc.tagName)){
                    let playerRoot = doc.querySelector('#player');
                    if(playerRoot){
                        observerPlayerRoot(playerRoot);
                        rootObserver.disconnect();
                    }
                }
            });
        });
        rootObserver.observe(
            document,
            {
                childList: true,
                subtree: true
            }
        );
    }
})();


