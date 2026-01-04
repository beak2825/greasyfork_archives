// ==UserScript==
// @name               youtube continue play fix
// @description        When "Video paused, do you want to continue watching?" Appears, ignore it and continue playing automatically (hiding dialog fixed)
// @namespace          https://greasyfork.org/en/users/1308740-esdeka
// @version            2025-04-28
// @author             esdeka
// @include            https://*.youtube.com/*
// @noframes
// @run-at             document-end
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/534296/youtube%20continue%20play%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/534296/youtube%20continue%20play%20fix.meta.js
// ==/UserScript==

(function() {
    function searchDialog(videoPlayer){
        if(videoPlayer.currentTime < videoPlayer.duration){//防止重複播放
            let ytConfirmDialog = document.querySelector('yt-confirm-dialog-renderer') || document.querySelector('ytmusic-confirm-dialog-renderer') || document.querySelector('dialog');
            if(
                ytConfirmDialog &&
                (
                    ytConfirmDialog.parentElement.style.display != 'none' ||
                    (
                        //document.hidden
                        ytConfirmDialog.parentElement.style.display = 'none'
                    )//當網頁不可見時，DOM元件不會即時渲染，所以對話方塊的display還會是none
                )
            ){
                console.debug('被暫停了，但是我要繼續播放');
                //ytConfirmDialog.querySelector('yt-button-renderer[dialog-confirm]').click();//當網頁不可見時，觸發click是不會繼續播放的，因為要等到網頁可見時觸發UI渲染後才會把對話方塊關掉，對話方塊關掉後才會出發video的play事件
                videoPlayer.play();
                console.debug('按下"是"');
            }else{
                console.debug('對話方塊找不到或是隱藏了', ytConfirmDialog && ytConfirmDialog.parentElement, document.hidden, videoPlayer.currentTime, videoPlayer.duration);
                if(videoPlayer.paused && videoPlayer.src){
                    setTimeout(() => searchDialog(videoPlayer), 1000);//再找一次
                }
            }
        }else{
            console.debug('播放完畢');
        }
    }
    let pausedFun = function({target: videoPlayer}){
        console.debug('暫停播放');
        setTimeout(() => searchDialog(videoPlayer), 500);//確保在暫停時對話方塊一定找得到
    }
    function setOnPauseEventListener(player){
        if(!player.dataset.pauseWatcher){
            player.dataset.pauseWatcher = true;
            player.addEventListener('pause', pausedFun);
        }
    }
    function observerPlayerRoot(doc){
        let player = doc.querySelector('video');
        if(player){
            console.debug('找到播放器', player);
            setOnPauseEventListener(player);
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
                        setOnPauseEventListener(player);
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
