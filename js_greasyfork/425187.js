// ==UserScript==
// @name         Bili自动获取图片
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Bili自动获取图片，右击图片区域，控制台将输出图片链接
// @author       dawnylw
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @require      https://static.hdslb.com/js/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/425187/Bili%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/425187/Bili%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
function main(){
    //console.clear();

    $('*[style|="background"]').off("contextmenu");
    $('*[style|="background"]').contextmenu(function(e) {
        let url = backgroundimage($(this).css('background-image'));
        if(url!='none')
            //console.log('*[style|="background"]:'+url);
            console.log(url);
        return true;
    });

    $('img').off("contextmenu");
    $('img').contextmenu(function(e) {
        let url = imgsrc($(this).attr('src'));
        //console.log('img:'+url);
        console.log(url);
        return true;
    });

    $('img:not([src*="jinkela"])').siblings().off("contextmenu");
    $('img:not([src*="jinkela"])').siblings().contextmenu(function(e) {
        //console.log(e);
        let that = $(this).siblings('img');
        let url = imgsrc($(that).attr('src'));
        //console.log('img:not([src*="jinkela"]).siblings().siblings("img"):'+url);
        console.log(url);
        return true;
    });

    $('div.lazy-img').siblings().off("contextmenu");
    $('div.lazy-img').siblings().contextmenu(function(e) {
        let that = $(this).siblings('div.lazy-img').find('img');
        let url = imgsrc($(that).attr('src'));
        //console.log('div.lazy-img.siblings().siblings("div.lazy-img").find("img"):'+url);
        console.log(url);
        return true;
    });
}

function backgroundimage(url){
    let tmpPos = url.indexOf('@');
    let firstPos = url.indexOf('"')+1;
    if(tmpPos!=-1)
        return url.substring(firstPos,tmpPos);
    return url.substring(firstPos,url.length);
}

function imgsrc(url){
    let tmpPos = url.indexOf('@');
    let header = 'https:';
    if(url.indexOf('/')!=0)
        header = '';
    if(tmpPos!=-1)
        return header + url.substring(0,tmpPos);
    return header + url;
}

var timerid;
var lasttime;
var timeout = 400;
$(document).ready(function(){

    function observer_callback(){
        let curtime = new Date();
        /*

        let resttime;

        if(!lasttimems || curtime-lasttimems > timeout)
            resttime = timeout;
        else
            resttime = timeout-(curtime-lasttimems);

        timerid = setTimeout(function(){
            main();
        }, resttime);
        */
        if(!lasttime){
            if(timerid){
                clearTimeout(timerid);
                timerid = null;
            }
            timerid = setTimeout(function(){
                observer_callback();
            }, timeout);
            lasttime = curtime;
            return;
        }

        let interval = curtime - lasttime;

        if(interval < timeout){
            if(timerid)
                clearTimeout(timerid);

            timerid = setTimeout(function(){
                observer_callback();
            }, timeout-interval);
            return;
        }else
            main();

        lasttime = curtime;
    }

    let observer = new MutationObserver(observer_callback);
    observer.observe(document.body,{'childList': true, 'subtree': true });
});