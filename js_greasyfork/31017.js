// ==UserScript==
// @name         Github To The Top Button
// @name:zh-CN   Github返回页顶按钮
// @namespace    https://github.com/
// @version      0.1
// @description  Add a to-the-top button into the github's pages.
// @description:zh-CN  给github的每个页面添加一个返回页顶的按钮。
// @author       ETY001
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31017/Github%20To%20The%20Top%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/31017/Github%20To%20The%20Top%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var topbtn = document.createElement("div");
    topbtn.innerHTML = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg t="1498751358770" class="icon" style="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2557" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="200"><defs><style type="text/css"></style></defs><path d="M21.490332 682.20038c0-15.021112 5.711312-30.036084 17.169752-41.500183l430.195516-430.17746c22.882087-22.915919 60.038871-22.915919 82.956775 0l430.238496 430.17746c22.916881 22.922059 22.916881 60.036351 0 82.95841-22.882087 22.915919-60.038871 22.915919-82.955752 0L510.351385 334.975191 121.65677 723.659631c-22.923021 22.915919-60.038871 22.915919-82.961892 0C27.20062 712.236464 21.490332 697.215352 21.490332 682.20038L21.490332 682.20038zM21.490332 682.20038" p-id="2558"></path></svg>';
    topbtn.style = 'position: fixed; bottom: 50px; right: 10%; background-color: #ddd; padding: 10px; border-radius: 15px; cursor: pointer;';
    topbtn.firstElementChild.style = 'width: 40px; height:40px;';
    document.getElementsByTagName('body')[0].appendChild(topbtn);
    window.onscroll = function(){
        var top = document.documentElement.scrollTop || document.body.scrollTop;
        if( top >= 300 ) {
            topbtn.style.bottom=50+'px';
        } else {
            topbtn.style.bottom=-1000+'px';
        }
    };
    var intervalTimer = null;
    topbtn.onclick = function(){
        intervalTimer=setInterval(function(){
            var top = document.documentElement.scrollTop || document.body.scrollTop;
            top-=1000;
            if (top>0) {
                window.scrollTo(0,top);
            } else {
                window.scrollTo(0,0);
                clearInterval(intervalTimer);
            }
        } , 1);
    };
})();