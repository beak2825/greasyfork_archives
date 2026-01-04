// ==UserScript==
// @name         b站快捷键
// @namespace    http://tampermonkey.net/
// @version      0.1.9
// @description  个人自用，bilibili三连快捷键。
// @author       You
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441630/b%E7%AB%99%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/441630/b%E7%AB%99%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /** 实现点赞，投币以及一键三连的功能。
    *shift-a 点赞，长按shift-a 一键三连。
    *shift-s弹出投币界面，左右方向键选择投币数量，回车确定
    *shift-c弹出收藏界面。
    *收藏，选择哪个文件夹收藏还是用鼠标确认比较好。
    *shift-q,全屏
    */
   document.body.addEventListener('keydown', function (e) {
       if (e.shiftKey) {
            e.preventDefault();
           let video=document.querySelector('.bpx-player-video-area')??document.querySelector('.bilibili-player-area');
           //console.log(video)
           if(video==null) return;
                if (e.code == 'KeyA') {
                    let btn_like = document.querySelector('.van-icon-videodetails_like')??document.querySelector('.video-like-icon')??document.querySelector('.like');
                    console.log(btn_like)
                    const fireEvent = (name, args) => {
                        const customEvent = new CustomEvent(name, args);
                        btn_like.dispatchEvent(customEvent);
                    }
                    let likeClick = true;
                    setTimeout(() => (likeClick = false), 200);
                    fireEvent('mousedown', e);
                    document.body.addEventListener('keyup', function (e) {
                        e.preventDefault();
                        fireEvent('mouseup', e);
                        if (likeClick) {
                            fireEvent('click', e);
                        }
                    }, { once: true });
                               console.log(btn_like)
                }
                if (e.code == 'KeyS') {
                    let btn_throw = document.querySelector('.van-icon-videodetails_throw')??document.querySelector('.video-coin')??document.querySelector('.coin');
                    let coin = document.querySelector('.bili-dialog-bomb');
                    //console.log(btn_throw)
                    if (!coin) {
                        btn_throw && btn_throw.click();
                    } else {
                        coin.querySelector('.close').click();
                    }
                }
                if(e.code=='KeyC'){
                    let btn_collect=document.querySelector('.van-icon-videodetails_collec')??document.querySelector('.video-fav')??document.querySelector('.collect');
                    let collect=document.querySelector('.bili-dialog-bomb');
                    if(!collect){
                        btn_collect&&btn_collect.click();
                    }else{
                        collect.querySelector('.close').click();
                    }
                }
                if(e.code==='KeyQ'){
                         let btn_fullscreen=video.parentNode.querySelector('.bpx-player-ctrl-full');
                         console.log(btn_fullscreen)
                         btn_fullscreen&&btn_fullscreen.click();
                }
            }
       if (e.code == 'ArrowLeft' || e.code == "ArrowRight") {
               e.preventDefault();
                let dialog_coin = document.querySelector('.bili-dialog-bomb');
                if (dialog_coin) {
                    event.stopImmediatePropagation();
                    let choose_coin = e.code == 'ArrowLeft' ? dialog_coin.querySelector(' .left-con') : dialog_coin.querySelector('.right-con');
                    choose_coin.click();

                } else {
                    console.log('如果不是误触请先,shift-s,打开投币界面');
                }
            }
       if (e.code == 'Enter') {
                 e.preventDefault();
                let dialog = document.querySelector('.bili-dialog-bomb');
                if (dialog) {
                    let biBtn = dialog.querySelector('.bi-btn');
                    biBtn.click();
                }

            }
       })
})();