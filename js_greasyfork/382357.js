// ==UserScript==
// @name         coursera开启中英双字幕(coursera subtitle CN+EN)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  添加了coursera视频开启和关闭中英双字幕的功能
// @author       zhhsh
// @include      *://www.coursera.org/*
// @match        https://www.coursera.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382357/coursera%E5%BC%80%E5%90%AF%E4%B8%AD%E8%8B%B1%E5%8F%8C%E5%AD%97%E5%B9%95%28coursera%20subtitle%20CN%2BEN%29.user.js
// @updateURL https://update.greasyfork.org/scripts/382357/coursera%E5%BC%80%E5%90%AF%E4%B8%AD%E8%8B%B1%E5%8F%8C%E5%AD%97%E5%B9%95%28coursera%20subtitle%20CN%2BEN%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //if you want to change the subtitles of other languages or add more subtitles,change the language tag of subtitles in line 36:'["en", "zh-CN"]'
    /*
    核心代码如下：
    var myvideo = document.getElementsByTagName('video')[0];
    for (var i = 0; i < myvideo.textTracks.length; i++) {
        ["en", "zh-CN"].indexOf(myvideo.textTracks[i].language) > -1 ? myvideo.textTracks[i].mode = "showing" : myvideo.textTracks[i].mode = "hidden";
    }
    不使用脚本或脚本失效时，只需在控制台执行以上代码，就能开启双字幕，但是每次切换视频都要重新执行一遍
    核心代码是从别人的文章里看来的，来源：https://hieast.github.io/2017/11/21/coursera-enable-bilingual-subtitle/
    */

    //双字幕按钮
    var dualSubtitlesBtn = document.createElement("a");
    dualSubtitlesBtn.innerHTML='双字幕';
    dualSubtitlesBtn.classList.add('nav-link');
    dualSubtitlesBtn.classList.add('dim');
    dualSubtitlesBtn.classList.add('body-1-text');
    dualSubtitlesBtn.setAttribute('aria-label','双字幕');
    dualSubtitlesBtn.href='javascript:void(0);';
    dualSubtitlesBtn.addEventListener('click',function(){
        myvideo = document.getElementsByTagName('video')[0];//每次都刷新video对象，避免“视频已经播放下一个，video还是上一个视频”的情况
        for (var i = 0; i < myvideo.textTracks.length; i++) {//显示中英双字幕
            ["en", "zh-CN"].indexOf(myvideo.textTracks[i].language) > -1 ? myvideo.textTracks[i].mode = "showing" : myvideo.textTracks[i].mode = "hidden";
        }
    });

    //关闭字幕按钮，因为使用双字幕后，原来的‘关闭字幕’功能会有异常，所以添加新的‘关闭字幕按钮’
    var closeSubtitlesBtn = document.createElement("a");
    closeSubtitlesBtn.innerHTML='无字幕';
    closeSubtitlesBtn.classList.add('nav-link');
    closeSubtitlesBtn.classList.add('dim');
    closeSubtitlesBtn.classList.add('body-1-text');
    closeSubtitlesBtn.setAttribute('aria-label','无字幕');
    closeSubtitlesBtn.href='javascript:void(0);';
    closeSubtitlesBtn.addEventListener('click',function(){
        myvideo = document.getElementsByTagName('video')[0];//每次都刷新video对象，避免“视频已经播放下一个，video还是上一个视频”的情况
        for (var i = 0; i < myvideo.textTracks.length; i++) {//关闭所有字幕
            myvideo.textTracks[i].mode = "hidden";
        }
    });

    //分隔符
    var seperatorBar = document.createElement('div');
    seperatorBar.classList.add('divider');

    var mycon;
    var myvideo;

    var iterateTimes = 0;
    (function init(){
        mycon = document.getElementsByClassName('rc-PreviousAndNextItem')[0];
        myvideo = document.getElementsByTagName('video')[0];
        if(mycon&&myvideo){//等mycon和myvideo都存在的时候执行
            mycon.prepend(seperatorBar);
            mycon.prepend(dualSubtitlesBtn);
            mycon.prepend(seperatorBar.cloneNode());
            mycon.prepend(closeSubtitlesBtn);
        }else{
            if(++iterateTimes<10){//限制计时器的重复执行次数，避免那些本来就没有视频的coursera页面无限setTimeout...，也可以修改触发脚本的url的规则@include，不会
                setTimeout(init, 1000);
            }
        }
    })();

})();