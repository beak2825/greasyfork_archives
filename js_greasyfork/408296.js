// ==UserScript==
// @name         coursera中英双字幕+调节字幕大小
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  使coursera视频可以开启中英双字幕并调整字幕大小
// @author       wzj423
// @include      *://www.coursera.org/*
// @match        https://www.coursera.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408296/coursera%E4%B8%AD%E8%8B%B1%E5%8F%8C%E5%AD%97%E5%B9%95%2B%E8%B0%83%E8%8A%82%E5%AD%97%E5%B9%95%E5%A4%A7%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/408296/coursera%E4%B8%AD%E8%8B%B1%E5%8F%8C%E5%AD%97%E5%B9%95%2B%E8%B0%83%E8%8A%82%E5%AD%97%E5%B9%95%E5%A4%A7%E5%B0%8F.meta.js
// ==/UserScript==


(function() {
    'use strict';

    //if you want to change the subtitles of other languages or add more subtitles,change the language tag of subtitles in line 41:'["en", "zh-CN"]'
    /*
    核心代码如下：
    var myvideo = document.getElementsByTagName('video')[0];
    for (var i = 0; i < myvideo.textTracks.length; i++) {
        ["en", "zh-CN"].indexOf(myvideo.textTracks[i].language) > -1 ? myvideo.textTracks[i].mode = "showing" : myvideo.textTracks[i].mode = "hidden";
    }
    不使用脚本或脚本失效时，只需在控制台执行以上代码，就能开启双字幕，但是每次切换视频都要重新执行一遍
    来源：https://hieast.github.io/2017/11/21/coursera-enable-bilingual-subtitle/

    主要来自@zhhsh的脚本 https://greasyfork.org/zh-CN/scripts/382357
    修好了不能显示(被页面自动刷新掉)的bug
    增加了字幕增大/缩小的功能(每次10%)
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

    var currentSubtitleSize=100;//当前字母大小(百分比)

    //增大字幕按钮
    var expandSubtitleSizeBtn = document.createElement("a");
    expandSubtitleSizeBtn.innerHTML='大字幕';
    expandSubtitleSizeBtn.classList.add('nav-link');
    expandSubtitleSizeBtn.classList.add('dim');
    expandSubtitleSizeBtn.classList.add('body-1-text');
    expandSubtitleSizeBtn.setAttribute('aria-label','大字幕');
    expandSubtitleSizeBtn.setAttribute("name","expandSubtitleSizeBtn");//加上名字,用做后期判断
    expandSubtitleSizeBtn.href='javascript:void(0);';
    expandSubtitleSizeBtn.addEventListener('click',function(){
        currentSubtitleSize=currentSubtitleSize+10;
        var css = 'video::-webkit-media-text-track-display {font-size: '+currentSubtitleSize+'%;}',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
    });
    //缩小字幕按钮
    var reduceSubtitleSizeBtn = document.createElement("a");
    reduceSubtitleSizeBtn.innerHTML='小字幕';
    reduceSubtitleSizeBtn.classList.add('nav-link');
    reduceSubtitleSizeBtn.classList.add('dim');
    reduceSubtitleSizeBtn.classList.add('body-1-text');
    reduceSubtitleSizeBtn.setAttribute('aria-label','小字幕');
    reduceSubtitleSizeBtn.href='javascript:void(0);';
    reduceSubtitleSizeBtn.addEventListener('click',function(){
        currentSubtitleSize=currentSubtitleSize-10;
        if(currentSubtitleSize<=0) currentSubtitleSize=10;
        var css = 'video::-webkit-media-text-track-display {font-size: '+currentSubtitleSize+'%;}',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
    });
    //分隔符
    var seperatorBar = document.createElement('div');
    seperatorBar.classList.add('divider');

    var mycon;
    var testBtn;
    var myvideo;

    var iterateTimes = 0;
    var isNotVideoPage = false;
    function init(){
        //alert("Begin initing!");
        ++iterateTimes;
        mycon = document.getElementsByClassName('rc-PreviousAndNextItem')[0];
        myvideo = document.getElementsByTagName('video')[0];


        testBtn = document.getElementsByName('expandSubtitleSizeBtn')[0];
        if(testBtn) {
            return;//如果已经有增大字幕按钮说明已经成功了,跳出函数;如果标记的按钮添加了但是没了就说明页面自动刷新掉了或者本来就没有,要再来一次;
        }


        if(mycon&&myvideo){//等mycon和myvideo都存在的时候执行
            //console.log("To Init!");
            mycon.prepend(seperatorBar);
            mycon.prepend(dualSubtitlesBtn);
            mycon.prepend(seperatorBar.cloneNode());
            mycon.prepend(closeSubtitlesBtn);
            mycon.prepend(seperatorBar);
            mycon.prepend(expandSubtitleSizeBtn);
            mycon.prepend(seperatorBar);
            mycon.prepend(reduceSubtitleSizeBtn);

            //console.log("Test!");
            setTimeout(init,1000);//递归检查
        }else{
            if(iterateTimes<10){//限制计时器的重复执行次数，避免那些本来就没有视频的coursera页面无限setTimeout...，也可以修改触发脚本的url的规则@include，不会
                setTimeout(init, 1000);
            }else {
                isNotVideoPage=true;
                //console.log("adjustBtn");
                adjustBtn();
            }
        }
    };
    init();
    //修改上一个/下一个按钮,使得从文字到视频在不刷新的情况下也可以自动加载出双字幕和调节大小的按钮
    function reset() {
        iterateTimes=0;
    }
    function adjustBtn(){
        var totalBtnCnt=document.getElementsByClassName("rc-PreviousAndNextItem")[0].childElementCount;
        var previousBtn=document.getElementsByClassName("rc-PreviousAndNextItem")[0].children[totalBtnCnt-3];
        console.log(totalBtnCnt);
        previousBtn.addEventListener('click',function(){
            reset();
            init();
        });
        var nextBtn=document.getElementsByClassName("rc-PreviousAndNextItem")[0].children[totalBtnCnt-1];
        nextBtn.addEventListener('click',function(){
            reset();
            init();
        });
    }
})();