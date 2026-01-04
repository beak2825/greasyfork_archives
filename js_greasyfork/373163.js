// ==UserScript==
// @name         NeumoocBBQ
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Let's BBQ your Neumooc.
// @author       Nekotora
// @match        http://www.neumooc.com/course/play/*
// @run-at       document-end
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/373163/NeumoocBBQ.user.js
// @updateURL https://update.greasyfork.org/scripts/373163/NeumoocBBQ.meta.js
// ==/UserScript==

logger('info','Init: Neumooc injected.');

var _self = unsafeWindow,
$ = _self.$ || top.$;

var outlineId = $("input#outlineId").val();


$(function(){
    // 尝试获取播放器，等待几秒钟，如果没有播放器跳转到下节课继续
    // 获取到播放器，激活防暂停
    var tryInitTime = 0;
    var initInterval = setInterval(function(){
        if(isPlayerReady()){
            clearInterval(initInterval);
            logger('info','Init: Success find video player.');
            disableBlurPause();
            autoNext();
        }else{
            tryInitTime++;
            logger('info','Init: Waiting video player.');
            if($(".fp-ui")) $(".fp-ui").click();
            if(tryInitTime>=6){
                clearInterval(initInterval);
                logger('warn','Init: Can not find player, next outline.');
                nextOutline();
            }
        }
    },1000)
})


// Logger
function logger(type, msg){
    //msg = "[NeumoocBBQ] "+msg+"\n" + (new Date).toString();
    msg = "[NeumoocBBQ] "+msg;
    switch(type){
        case 'warn':
            console.warn(msg);
            break;
        case 'log':
            console.log(msg);
            break;
        case 'info':
            console.info(msg);
            break;
    }
}

// 跳转到下节课
function nextOutline(){
    var outlineId = $("input#outlineId").val();
    var currentOutline = $('ul li.outl_'+outlineId).children('a');// 当前课程按钮

    // 是否为本章最后一节
    var isLastOutlineInGroup = $('ul li.outl_'+outlineId).parent('ul').children('li').last().get(0) == $('ul li.outl_'+outlineId).get(0);
    var nextOutline;
    if(isLastOutlineInGroup){
        //下一章
        nextOutline = $('ul li.outl_'+outlineId).parent('ul').parent('li').next('li').children('ul').children('li').first().children('a');
    }else{
        //下一节
        nextOutline = $('ul li.outl_'+outlineId).next('li').children('a');
    }
    var nextOutlineUrl = nextOutline.attr('href');
    nextOutlineUrl ? window.location.href = nextOutlineUrl : logger('warn','Can not find next Outline.');
}

function autoNext(){
    logger('info','AutoNext: AutoNext service started.');
    var nextInterval = setInterval(function(){
        if(isFinished()){
            clearInterval(nextInterval);
            logger('info','AutoNext: Finished, will go next Outline in 5sec.');
            setTimeout(function(){nextOutline()},5000)
        }else{
            logger('info','AutoNext: Waiting video finish.');
        }
    },1000)
}

// 防止鼠标移动自动暂停
function disableBlurPause(){
    logger('info','disableBlurPause: disableBlurPause service started.');
    var disableBlurPauseTimer = setInterval(function(){
        try{
            _self.flowPlayerObj.play();
        }catch(e){
            clearInterval(disableBlurPauseTimer);
            logger('warn','Can not find player.');
        }
    },500)
}

// 尝试获取视频播放器
function isPlayerReady(){
    if(_self.flowPlayerObj){
        return _self.flowPlayerObj
    }else{
        return false;
    }
}

// 跟进播放进度
function isFinished(){
    return _self.flowPlayerObj.finished
}