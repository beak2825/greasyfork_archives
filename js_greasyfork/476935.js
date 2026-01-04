// ==UserScript==
// @name         ben_hide_img
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  变大或者缩小图片
// @author       amu
// @icon          data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAYABsDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD758deJz4L8F65r4tvtp0yzlu/s/meX5mxS23dg4zjrg/SvMNQ/aUi8OyRwazpGnpdLeXEE62fiC1WNYYxgSRvd/ZvNZpMr5ajIUbycMgfsvjpn/hTPjfHJ/se6/8ARTV5X46/tbSLOOLUtVsvBphv7hVWfUr62sH8x1maKC4S7s/MKxsdu+MIWygdQrsPhsROrGS5HZdfvVv6/wCHPq+F8syzGYVTxtHnk5yXxSTsox2UXd2b7adXbR+1fD/x/o/xL8L2mu6LcJNa3CqWi82N5IGKhvLlEbMFcBlyucjPNdHXmnwL0dNJ0fW5o9Wl1xNSv/tyagYpxFNGYY4VaKSaed5FPkEgtITgjACFM+l12QblFNnxWd4fDYTMKtHCX9mnpe91dJ2d0no9NUtgoooqjxAooooA/9k=
// @match      http*://*.com/*
// @match      http*://*.cn/*
// @match      http*://*.net/*
// @license    MIT
// @exclude      http://www.time163.com/shizhong.html
// @exclude      https://doc*.*.com/*
// @exclude      http*://*mail.qq.com/*
// @exclude      http*://note.youdao.com/*
// @exclude      http://localhost/*
// @exclude      http*://*.auto-link.com.cn/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/476935/ben_hide_img.user.js
// @updateURL https://update.greasyfork.org/scripts/476935/ben_hide_img.meta.js
// ==/UserScript==

// */
var m$=jQuery.noConflict(true);
const TEXT_SMALL='变小';
const TEXT_LARGE='变大';
const times=0.3;

function small(inde,val){
    try{
        //console.log('aaaaa====',val);
        var wth=parseInt(val);
        if(wth<=61.8){
            return val;
        }
        return wth*times;
    }catch(e){
        console.error(e);
        console.log(this);
       alert('设置数字缩小异常');
        return val;
    }
}
function large(inde,val){
    try{
        var wth=parseInt(val);
        return wth*(1/times);
    }catch(e){
        console.error(e);
        console.log(this,val);
       alert('设置数字扩大小异常');
        return val;
    }
}
const global_attr='global_attr'
function smallImg(oneself){
    if(!oneself){
        return
    }
    var widthImg=oneself.width();
    var heightImg=oneself.height();
    if(widthImg>61.8 && heightImg >61.8){
        oneself.attr(global_attr,'t')
    }else{
        return
    }
    var calcWidth=small(0,widthImg);
    oneself.css('width',calcWidth);
    var calcHeight=small(0,heightImg);
    oneself.css('height',calcHeight);

}
function expandImg(oneself){
   // console.log('open',openself.attr(global_attr));
    if('t'!==oneself.attr(global_attr)){
        return
    }
    var widthImg=oneself.width();
    var heightImg=oneself.height();
    var calWidth=large(0,widthImg);
    var parentElementWidth=oneself.parent().width();
    if(calWidth>=parentElementWidth){
        return false;
    }
    oneself.css('width',calWidth);
    var calHeight=large(0,heightImg);
    oneself.css('height',calHeight);
}
const styleContent=`
.ben_Button{
    opacity: 0.4;
    position: fixed;
    z-index: 999999;
    background-color:#ccc;
    cursor: pointer;
    display:flex;
    align-items:center;
    font-size: 12px;
    transform: scale(0.7);
    transform-origin: 0 0;
    left: 75%;
    width: 30px;
    height:30px;border-radius:30px;
}
.pos1{
    bottom: 60px;
}
.pos2{
    bottom: 30px;
}
.pos3{
    top: 520px;
}`;
function processSmall(){
    m$('body').find('img:visible').each(function(indx,elem){
        var oneSelf= m$(this);
        smallImg(oneSelf);
    });
}
function processLarge(){
    m$('body').find('img:visible').each(function(indx,elem){
        var oneSelf= m$(this);
        expandImg(oneSelf);
    });
}
function checkMatchImg(){
    var matchImg=false;
    m$('body').find('img:visible').each(function(idx,elem){
        var widthImg=m$(elem).width();
        var heightImg=m$(elem).height();
        if(widthImg>61.8 && heightImg >61.8){
           matchImg=true;
           return false;
        }
    })
    return matchImg;
}
m$(function(){
    if(!checkMatchImg()){
        return;
    }
    var style=m$('<style type="text/css"></style>')
    style.text(styleContent)
    m$('head').append(style);
    var min=m$('<div class="ben_Button pos1">'+TEXT_SMALL+'</div>').on('click',processSmall);
    var max=m$('<div class="ben_Button pos2">'+TEXT_LARGE+'</div>').on('click',processLarge);
    m$('body').append(min).append(max);
    var window_path=window.location.host;
    if(window_path.indexOf('toutiao')!==-1){
        min.click();
    }
})
