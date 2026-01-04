// ==UserScript==
// @name                全本小說網手機版
// @version             0.1.1
// @description         幫助在使用手機閱讀全本小說網時，能使用滑鼠手勢輕鬆地換頁
// @author              John
// @match               *://*.big5.quanben5.com/amp/n/*
// @grant               none
// @license             MIT License
// @namespace https://greasyfork.org/users/814278
// @downloadURL https://update.greasyfork.org/scripts/437795/%E5%85%A8%E6%9C%AC%E5%B0%8F%E8%AA%AA%E7%B6%B2%E6%89%8B%E6%A9%9F%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/437795/%E5%85%A8%E6%9C%AC%E5%B0%8F%E8%AA%AA%E7%B6%B2%E6%89%8B%E6%A9%9F%E7%89%88.meta.js
// ==/UserScript==

var lastX,lastY,lastSign,afterGestures,gesturesWords,gesturesContent,gestures,signs;
const defaultFun={
    prePage:"prePage()",
    nextPage:"nextPage()"
};

var filterList = [];

var replaceList = {};

function prePage(){
    var p = document.getElementById('page_last');
    window.location.href = p.querySelector('a').href;
}

function nextPage(){
    var p = document.getElementById('page_next');
    window.location.href = p.querySelector('a').href;
}

function initEventListener(start,move,end,tracer,clientX,clientY,startBool){
    var isMouse=start=="mousedown";
    function moveFun(e){
        tracer(eval(clientX),eval(clientY), isMouse);
        gesturesWords.innerHTML=signs;
        var gesturesWidth=signs.length*51+40;
        gesturesContent.style.width=gesturesWidth+"px";
        gesturesContent.style.marginLeft=-gesturesWidth/2+"px";
    };

    document.addEventListener(start, function(e) {
        if(!startBool || eval(startBool)){
            lastX=eval(clientX);
            lastY=eval(clientY);
            lastSign=signs="";
            document.addEventListener(move, moveFun, false);
        }
    }, false);

    function endFun(e) {
        document.removeEventListener(move, moveFun, false);
        setTimeout(function(){if(gesturesContent.parentNode)gesturesContent.parentNode.removeChild(gesturesContent);},500);
        if(signs){
            if(afterGestures)afterGestures();
            for(var g of gestures){
                var gSign=g.gesture;
                if(signs==gSign){
                    if(!isMouse) document.body.appendChild(gesturesContent);
                    var fun=defaultFun[g.fun];
                    if(fun===undefined || !fun){
                        eval(g.fun);
                    }else{
                        eval(fun);
                    }
                    e.stopPropagation();
                    e.preventDefault();
                    break;
                }
            }
            signs="";
        }
    };

    document.addEventListener(end, endFun, false);
    document.addEventListener("mouseup", endFun, false);
}

function fullToHalf(val) {
    var result = "";

    try{
        var value = val || "";
        if (value) {
            for (var i = 0; i <= value.length; i++) {
                if (value.charCodeAt(i) == 12288) {
                    result += " ";
                } else {
                    if (value.charCodeAt(i) > 65280 && value.charCodeAt(i) < 65375) {
                        result += String.fromCharCode(value.charCodeAt(i) - 65248);
                    } else {
                        result += String.fromCharCode(value.charCodeAt(i));
                    }
                }
            }
        }
    }catch(e){
        console.error(e);
    }

  return result;
}

function alterContent(){
    try{
        var obj = document.getElementById("bookContent");
        obj.style.cssText += 'word-break: break-all;';
        var val = fullToHalf(obj.innerText);

        for(const str of filterList){
            val = val.replace(new RegExp(str,"gi"),'');
        }

        setTimeout(function() {
            for (var key in replaceList) {
                val = val.replace(new RegExp(key, "gi"), replaceList[key]);
            }
            obj.innerText = val;
        },5);
    }catch(e){
        console.error(e);
    }
}




(function() {
    'use strict';
    const minLength=256;
    const tg=0.5;
    gestures=[
          {gesture:"→", fun:"prePage"},
          {gesture:"←", fun:"nextPage"},
         ];

    function tracer(curX,curY,showSign) {
        let distanceX=curX-lastX,distanceY=curY-lastY;
        let distance=(distanceX*distanceX)+(distanceY*distanceY);
        if (distance>minLength) {
            lastX=curX;
            lastY=curY;
            let direction="";
            let slope=Math.abs(distanceY/distanceX);
            if(slope>tg){
                if(distanceY>0) {
                    direction="↓";
                }else{
                    direction="↑";
                }
            }else if(slope<=1/tg) {
                if(distanceX>0) {
                    direction="→";
                }else{
                    direction="←";
                }
            }
            if(lastSign!=direction) {
                signs+=direction;
                lastSign=direction;
                if(showSign){
                    document.body.appendChild(gesturesContent);
                }
            }
        }
    }

    gesturesContent=document.createElement("div");
    gesturesContent.id="gesturesContent";
    gesturesContent.style.cssText="width:300px;height:70px;position:fixed;left:50%;top:50%;margin-top:-25px;margin-left:-150px;z-index:999999999;background-color:#000;border:1px solid;border-radius:10px;opacity:0.65;filter:alpha(opacity=65);box-shadow:5px 5px 20px 0px #000;";
    gesturesContent.innerHTML='<div id="gesturesWords" style="position:absolute;left:20px;top:5px;font:bold 50px \'黑体\';color:#ffffff"></div>';
    gesturesWords = gesturesContent.querySelector("#gesturesWords");

    initEventListener("touchstart","touchmove","touchend",tracer,"e.changedTouches[0].clientX","e.changedTouches[0].clientY");
    initEventListener("mousedown","mousemove","contextmenu",tracer,"e.clientX","e.clientY","e.which === 3");

    document.getElementById('content').style="font-size: 20px;padding-top: 0px;";
    document.querySelector('.wrapper').style="margin-top:0px;";
    document.querySelector('.title1').style="font-size:20px";
    document.querySelector('.topbar').style="display:none;";
    document.querySelector('.footer').style="display:none;";
    // alterContent();

})();