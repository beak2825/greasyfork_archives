// ==UserScript==
// @name               Hide youtube google ad
// @name:zh-CN         隐藏youtube google广告zz
// @namespace          vince.youtube
// @version            2.0.1
// @description        hide youtube google ad,auto click "skip ad"
// @description:zh-CN  隐藏youtube显示的google广告,自动点击"skip ad"
// @author             vince ding
// @match              *://www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/39187/Hide%20youtube%20google%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/39187/Hide%20youtube%20google%20ad.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var closeAd=function (){
        var css = '.video-ads .ad-container .adDisplay,#player-ads{ display: none!important; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
    };
    var skipInt;
    var log=function(msg){
       // unsafeWindow.console.log (msg);
    };
    var skipAd=function(){
        //videoAdUiPreSkipText
        //videoAdUiSkipButton
        var skiptxt=document.querySelector(".videoAdUiPreSkipText");
        if(skiptxt){
            var skipText=skiptxt.innerText;
            log(skipText);
            var _textAry=skipText.split(" ");
            var sec=(_textAry.length>0?_textAry[_textAry.length-1]:1);
            log(sec);
            if((sec-1)>0){
                log("wait btn...");
                if(skipInt) {clearTimeout(skipInt);}
                skipInt=setTimeout(skipAd,500);
            }else{
                var skipbtn=document.querySelector(".videoAdUiSkipButton");
                if(skipbtn){
                    log("close ad");
                    skipbtn.click();
                }
                log("checking...");
                if(skipInt) {clearTimeout(skipInt);}
                skipInt=setTimeout(skipAd,500);
            }
        }else{
            log("checking skip text...");
            if(skipInt) {clearTimeout(skipInt);}
            skipInt=setTimeout(skipAd,500);
        }
    };

    closeAd();
    skipAd();

})();