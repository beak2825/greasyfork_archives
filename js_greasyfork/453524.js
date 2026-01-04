// ==UserScript==
// @name         视频自动点击
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  视频课程暂停会自动点击，自动播放下一个视频，仅限于指定网页，如源码中
// @author       dlutor
// @match      *://webvpn.dlut.edu.cn/http/77726476706e69737468656265737421f4ee5184693464456a468ca88d1b203b/*
// @match      *://dypx.dlut.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dlut.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453524/%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/453524/%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var btn, text, video_list;
    var player = document.getElementsByClassName('plyr__controls__item plyr__control')[0];
    //setInterval(function() {
    //    if (player.attributes['aria-label'].value == 'Play'){
    //        console.log('播放');
   //         player.click();
    //    }}, 1000);
    function Player(){
        document.onreadystatechange = function(){
            if(document.readyState == 'complete'){
                // 页面加载完毕
                if (player.attributes['aria-label'].value == 'Play'){
                    console.log('播放');
                    player.click();
                }
            }}
        };
    var observer = new MutationObserver(function (mutationsList) {
    btn = document.getElementsByClassName('public_submit');
    if (btn.length>0){
        text = document.getElementsByClassName('public_text')[0].children[1].textContent;
        if (btn[0].text == '继续'){
            btn[0].click();// || text == '您需要完整观看一遍课程视频，才能>获取本课学时，看到视频播放完毕提示框即为完成，然后视频可以拖动播放。'
        }
        if (text == '您需要完整观看一遍课程视频，才能>获取本课学时，看到视频播放完毕提示框即为完成，然后视频可以拖动播放。'){
            btn[0].click();
            Player();
            //player.click();
            //document.getElementsByClassName('plyr__controls__item plyr__control')[0].click();
        }
        if (text == '当前视频播放完毕！'){
            video_list = document.getElementsByClassName('video_lists')[0].getElementsByTagName('li');
            for (var i=0;i < video_list.length - 1; i++){
                if (video_list[i].className == 'video_red1'){
                    video_list[i+1].children[0].click();
                    Player();
                    //player.click();
                }
            }
        }
        //if (player.attributes['aria-label'].value == 'Play'){
        //    player.click();
       // }
    }
    });
    observer.observe(document.body,{attributes: true,
    subtree: true,
    characterData: true});
   // document.addEventListener('DOMNodeInserted', function(event) {
    //var target = event.target;
   // btn = document.getElementsByClassName('public_submit');
   // if (btn.length>0 && btn[0].text == '继续'){
   //     btn[0].click();
  //  }
  //  })
})();