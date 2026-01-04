// ==UserScript==
// @name         课程助手-云创学习网
// @namespace    https://github.com/Twtcer
// @version      0.10.1
// @match        *://yk.myunedu.com/*
// @description  开关章节自动播放，解放双手
// @author       heihei
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/459015/%E8%AF%BE%E7%A8%8B%E5%8A%A9%E6%89%8B-%E4%BA%91%E5%88%9B%E5%AD%A6%E4%B9%A0%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/459015/%E8%AF%BE%E7%A8%8B%E5%8A%A9%E6%89%8B-%E4%BA%91%E5%88%9B%E5%AD%A6%E4%B9%A0%E7%BD%91.meta.js
// ==/UserScript==

(load)();

// window.onload = load();

function load(){
   //  'use strict';
    console.log('start...');
    $('.studyVideo .leftContent-top').click();
    $('.video-react-paused').click();
    $('.video-react-menu-button').click();

    var timer = setInterval(function() {
        var currentCourse = $('.studyVideo-leftContent .videoItem-sel').parent().parent().parent().parent();
        var currentChapter = $('.studyVideo-leftContent .videoItem-sel');
        console.log(`专题:${$(currentCourse).find('.videoChapter-titleContent-title').text()},当前任务:${$(currentChapter).text()}`);

        if($('.video-react-paused').length>0)
        {
            var nextChapter = $(currentChapter).next();
            // 下一节存在&不存在观看时间则下一节
            if(
                $(nextChapter).attr('class')==='videoItem' &&
                $(nextChapter).find('.videoItem-textContent-time').text().indexOf('观看时间')>0
            ){
                // 视频下一个
                $(nextChapter).click();
            }
            else{
                // 下一节是否存在
                if($(nextChapter).attr('class')==='videoChapter'){
                    // 下一章第一个
                    $(nextChapter).find('.videoItem').eq(0).click();
                }
                else {
                    console.log('本课程播放完毕');
                }

            }
        }
  }, 5000);
}