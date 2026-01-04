// ==UserScript==
// @name         Youtube volume with mousewheel
// @version      1.0.1
// @description  Volume change with mousewheel
// @author       Bazsi15
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @namespace https://greasyfork.org/users/96833
// @downloadURL https://update.greasyfork.org/scripts/372058/Youtube%20volume%20with%20mousewheel.user.js
// @updateURL https://update.greasyfork.org/scripts/372058/Youtube%20volume%20with%20mousewheel.meta.js
// ==/UserScript==

(function() {    
    var y = window.scrollY,dir,volAmount=5,currVol,active,i=0,rgbcolor="255,255,0",shadowcolor="#000",fontsize=50;
    var player=document.getElementsByClassName("html5-video-container");   
    player[0].addEventListener("mouseover", noscroll, true);
    player[0].addEventListener("mouseout", scroll);
    function fixateScroll() {
        window.scrollTo( 0, y );
    }
    function noscroll() {
        active=1;
        window.addEventListener("scroll", fixateScroll);
        y = window.scrollY;
        if(i==0) {
        window.addEventListener('wheel', function(e) {
        if (e.deltaY < 0) {
            if(active!=0) {
            volControll(1);
            }
        }
        if (e.deltaY > 0) {
            if(active!=0) {
            volControll(0)
            }
        }
        });
        }
        i++;
    }
    function scroll() {
        active=0;
        window.removeEventListener("scroll", fixateScroll);        
    }
    var cont = document.getElementsByClassName("html5-video-container")[0];
    var para = document.createElement("h1");
    var paraatt = document.createAttribute("style");
    paraatt.value = "float:left;position:absolute;z-index:10000;margin-left:15px;margin-top:15px;text-shadow:0px 0px 0px "+shadowcolor+";";
    para.setAttributeNode(paraatt);
    cont.appendChild(para);
    function volControll(dir) {
        var video=document.getElementsByClassName("video-stream html5-main-video");
        currVol=video[0].volume;
        if(dir==1) {if(currVol+(volAmount/100)<1) {video[0].volume=currVol+(volAmount/100);} else {video[0].volume=1;} document.getElementsByClassName("ytp-volume-panel")[0].setAttribute("aria-valuenow", video[0].volume*100);document.getElementsByClassName("ytp-volume-slider-handle")[0].setAttribute("style", "left: "+video[0].volume*40+"px;");}
        if(dir==0) {if(currVol-(volAmount/100)>0) {video[0].volume=currVol-(volAmount/100);} else {video[0].volume=0;} document.getElementsByClassName("ytp-volume-panel")[0].setAttribute("aria-valuenow", video[0].volume*100);document.getElementsByClassName("ytp-volume-slider-handle")[0].setAttribute("style", "left: "+video[0].volume*40+"px;");}
        currVol=video[0].volume;
        if((currVol*100)<=50) {document.getElementsByClassName("ytp-svg-fill ytp-svg-volume-animation-speaker")[0].setAttribute("d", "M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 Z");}
        if((currVol*100)>=50) {document.getElementsByClassName("ytp-svg-fill ytp-svg-volume-animation-speaker")[0].setAttribute("d", "M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M19,14 L19,22 C20.48,21.32 21.5,19.77 21.5,18 C21.5,16.26 20.48,14.74 19,14 ZM19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 Z");}
        if((currVol*100)==0) {document.getElementsByClassName("ytp-svg-fill ytp-svg-volume-animation-speaker")[0].setAttribute("d", "m 21.48,17.98 c 0,-1.77 -1.02,-3.29 -2.5,-4.03 v 2.21 l 2.45,2.45 c .03,-0.2 .05,-0.41 .05,-0.63 z m 2.5,0 c 0,.94 -0.2,1.82 -0.54,2.64 l 1.51,1.51 c .66,-1.24 1.03,-2.65 1.03,-4.15 0,-4.28 -2.99,-7.86 -7,-8.76 v 2.05 c 2.89,.86 5,3.54 5,6.71 z M 9.25,8.98 l -1.27,1.26 4.72,4.73 H 7.98 v 6 H 11.98 l 5,5 v -6.73 l 4.25,4.25 c -0.67,.52 -1.42,.93 -2.25,1.18 v 2.06 c 1.38,-0.31 2.63,-0.95 3.69,-1.81 l 2.04,2.05 1.27,-1.27 -9,-9 -7.72,-7.72 z m 7.72,.99 -2.09,2.08 2.09,2.09 V 9.98 z");}
        paraatt.value = "font-size:"+fontsize+"px;color:rgba("+rgbcolor+",1);font-weight:200;float:left;position:absolute;z-index:10000;margin-left:15px;margin-top:15px;text-shadow:0px 5px 10px "+shadowcolor+";";
        para.innerHTML=Math.round(currVol*100,0);
        setTimeout(function(){paraatt.value = "color:rgba("+rgbcolor+",0);text-shadow:none;";},3000);
    }
})();