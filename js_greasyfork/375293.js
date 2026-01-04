// ==UserScript==
// @name         学堂在线自动播放-高校版
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  学堂在线自动播放下一集（仅在华工验证通过，其他学校没试）
// @author       Colin1501
// @match        https://*.xuetangx.com/lms
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/375293/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE-%E9%AB%98%E6%A0%A1%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/375293/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE-%E9%AB%98%E6%A0%A1%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var playNext = function(){
        var localElement = $('.video-active');
        var sameVideoNameArray = localElement.parent().find('.section-video-name');
        // 判断同级小节下是否还有其他视频
        if(localElement.index() == (sameVideoNameArray.length-1)){ // 是本小节的最后一个视频
            var localChaperElement = $('.video-active').parents('.tree-section-item');
            var sameChaperNameArray = localChaperElement.parent().find('.tree-section-item');
            // 判断同级章下是否还有其他小节
            if(localChaperElement.index() == (sameChaperNameArray.length-2)){ // 是本章的最后一个小节
                var localSection = $('.video-active').parents('.tree-section-item').parent().find('.tree-section-item').parents('.tree-chapter-item');
                var sectionArray = $('.tree-chapter-item');
                // 判断是否是最后一章
                if(localSection.index() == sectionArray.length-1){ // 已经是最后一章了
                    alert("恭喜你刷完了视频");
                }else{ // 不是最后一章
                    $(sectionArray[localSection.index()+1]).find('.chapter-name').click();
                    let tmp1 = sectionArray[localSection.index()+1];
                    console.log(tmp1);
                    setTimeout(function(){
                        let tmp2 = $(tmp1).find('.tree-section-item')[0];
                        $(tmp2).find('.section-name')[0].click();
                        console.log(tmp2);
                        setTimeout(function(){
                            let tmp3 = $(tmp2).find('.section-video-name')[0];
                            console.log(tmp3);
                            setTimeout(function(){
                                let tmp4 = $(tmp3).find('span').not('.video-see')[0];
                                console.log(tmp4);
                                tmp4.click();
                            },5000);
                        },500);
                    },500);
                }
            }else{ // 不是本章的最后一个小节
                $(sameChaperNameArray[localChaperElement.index()+1]).find('.section-name').click();
                let tmp1 = sameChaperNameArray[localChaperElement.index()+1];
                console.log(tmp1);
                setTimeout(function(){
                    let tmp2 = $(tmp1).find('.section-video-name')[0];
                    console.log(tmp2);
                    setTimeout(function(){
                        let tmp3 = $(tmp2).find('span').not('.video-see')[0];
                        console.log(tmp3);
                        tmp3.click();
                    },5000);
                },500);
            }
        }else{ // 不是本小节的最后一个视频
            setTimeout(function(){
                $(sameVideoNameArray[localElement.index()+1]).find('span').not('.video-see')[0].click();
            },5000);
        }
    }
    $(document).ready(function(){
        var timer = setInterval(function(){
            var reg = /^[a-zA-z]+:\/\/[\w]*.xuetangx.com\/lms\#\/video\/[0-9]*\/[0-9]*/;
            if($('video').length && $('video')[0].readyState == 4){
                if($('video')[0].readyState == 4){
                    if($('video')[0].paused){
                        console.log("paused");
                        $('video')[0].play();
                    }
                    $('video')[0].onended = function(){
                        playNext();
                    }
                    $('video')[0].playbackRate = 1.0;
                    $('video')[0].currentTime = 0;
                    $('video')[0].volume = 0;
                    clearInterval(timer);
                }
            }
        },500);
    });
    // Your code here...
})();