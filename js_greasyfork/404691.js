// ==UserScript==
// @name         Colorful Youtube
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Recoloring of YouTube
// @author       Bazsi15
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404691/Colorful%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/404691/Colorful%20Youtube.meta.js
// ==/UserScript==

(function() {
    var i=0,color='#ff0000',color1,body,style,panelWidth=150,leftPosition,hideCheck,colorChange,hexNum,hexVal,colors,rcolor,rainbow,awesomeCheck,o,ircolor,version="0.3.1",chapterCount,c;
    function hexConv(hexNum) {
        hexVal = hexNum.toString(16);
        return hexVal;
    }
    function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
    }
    if(getCookie("color")==null) {document.cookie="color="+color+"; max-age=18144000";} else {color=getCookie("color");}
    if(getCookie("color1")==null) {document.cookie="color1="+color1+"; max-age=18144000";} else {color1=getCookie("color1");}
    var colorPanel = document.createElement("div");
    var panelContent0 = document.createElement('input');
    var panelContent1 = document.createElement('input');
    var panelContent2 = document.createElement('br');
    var panelContent3 = document.createElement('a');
    var panelContent4 = document.createElement('h1');
    var panelContent5 = document.createElement('input');
    var panelContent6 = document.createElement('a');
    var panelContent7 = document.createElement('input');
    var panelContent8 = document.createElement('a');

    colorPanel.setAttribute('class','colorpanel');
    panelContent0.setAttribute('type','color');
    panelContent0.setAttribute('class','colorpicker');
    panelContent7.setAttribute('type','color');
    panelContent7.setAttribute('class','colorpicker');
    panelContent0.setAttribute('value',color);
    panelContent7.setAttribute('value',color1);
    panelContent1.setAttribute('type','checkbox');
    panelContent3.setAttribute('class','hidetext');
    panelContent4.setAttribute('class','cyttitle');
    panelContent5.setAttribute('type','checkbox');
    panelContent6.setAttribute('class','awesome');
    panelContent8.setAttribute('class','vtxt');
    panelContent3.innerHTML='Hide Panel: ';
    panelContent4.innerHTML='Colorful YT';
    panelContent6.innerHTML='Awesome Mode: ';
    panelContent8.innerHTML='v'+version;

    style = document.createElement('style');
    leftPosition=document.body.offsetWidth-panelWidth-50;
    style.innerHTML = '.colorpanel {background:#333333;box-shadow:5px 5px 5px #000;border:3px solid '+color+';border-radius:5px;width:'+panelWidth+'px;left:'+leftPosition+'px;top:10%;position:absolute;}.colorpicker {width:90%;} .hidetext {font-size:25px;color:#ddd} .awesome {font-size:25px;color:#ddd} .cyttitle {text-align:center;color:#ddd} .vtxt {font-size:8px;color:#7d7d7d;float:right;}';
    document.head.appendChild(style);
    if(getCookie("hidden")==1) {colorPanel.style.display='none';}
    hideCheck=setInterval(function () {if(panelContent1.checked) {colorPanel.style.display='none';clearInterval(hideCheck);document.cookie="hidden=1; max-age=18144000" }},100);
    awesomeCheck=setInterval(function () {if(panelContent5.checked) {awesome("start");clearInterval(colorChange)} else {awesome("stop");colorChange}},100);
    colorChange=setInterval(function () {

        color=panelContent0.value;
        color1=panelContent7.value;        
        document.cookie="color="+color+"; max-age=18144000"
        document.cookie="color1="+color1+"; max-age=18144000"
        chapterCount=document.getElementsByClassName('ytp-play-progress ytp-swatch-background-color').length;
        if(window.location.href.includes("https://www.youtube.com/watch?")) {
            for(c=0;c<=chapterCount-1;c++) {
                document.getElementsByClassName('ytp-play-progress ytp-swatch-background-color')[c].style.backgroundColor=color;
                document.getElementsByClassName("ytp-load-progress")[c].style.backgroundColor=color1;
            }
            document.getElementsByClassName('ytp-scrubber-button ytp-swatch-background-color')[0].style.backgroundColor=color;
        }
        document.getElementsByClassName('style-scope ytd-topbar-logo-renderer')[5].setAttribute('fill', color);
        document.getElementsByClassName('style-scope ytd-topbar-logo-renderer')[6].setAttribute('fill', color1);

    },100)
    i=0;
    o=6;
    function awesome(toggle) {
    colors = ["#ff0000","#ffa500","#ffff00","#008000","#0000ff","#4b0082","#ee82ee"];
        if(toggle=="start") {
            function rainbowRenderer() {
            rcolor=colors[i];
            ircolor=colors[o];
            o=o-1;
            i=i+1;
                if(window.location.href.includes("https://www.youtube.com/watch?")) {
                    for(c=0;c<=chapterCount-1;c++) {
                        document.getElementsByClassName('ytp-play-progress ytp-swatch-background-color')[0].style.backgroundColor=rcolor;
                        document.getElementsByClassName('ytp-scrubber-button ytp-swatch-background-color')[0].style.backgroundColor=rcolor;
                    }
                    document.getElementsByClassName('ytp-scrubber-button ytp-swatch-background-color')[0].style.backgroundColor=color;
                }
                document.getElementsByClassName('style-scope ytd-topbar-logo-renderer')[5].setAttribute('fill', rcolor);
                document.getElementsByClassName('style-scope ytd-topbar-logo-renderer')[6].setAttribute('fill', ircolor);
            if(i==colors.length) {i=0;}
            if(o==0) {o=colors.length;}
        }
            rainbow = setInterval(rainbowRenderer(),10);
      }
        if(toggle=="stop") {
            clearInterval(rainbow);
            if(window.location.href.includes("https://www.youtube.com/watch?")) {
                for(c=0;c<=chapterCount-1;c++) {
                        document.getElementsByClassName('ytp-play-progress ytp-swatch-background-color')[c].style.backgroundColor=color;
                        document.getElementsByClassName("ytp-load-progress")[c].style.backgroundColor=color1;
                    }
                    document.getElementsByClassName('ytp-scrubber-button ytp-swatch-background-color')[0].style.backgroundColor=color;
            }
            document.getElementsByClassName('style-scope ytd-topbar-logo-renderer')[5].setAttribute('fill', color);
            document.getElementsByClassName('style-scope ytd-topbar-logo-renderer')[6].setAttribute('fill', color1);
                           }
    }

    document.onkeyup = function(e) {
    if(e.ctrlKey && e.shiftKey && e.which == 81) {panelContent1.checked=false;colorPanel.style.display='initial';hideCheck=setInterval(function () {if(panelContent1.checked) {colorPanel.style.display='none';clearInterval(hideCheck)}},100);document.cookie="hidden=0; max-age=18144000";}
    }
    colorPanel.appendChild(panelContent4);
    colorPanel.appendChild(panelContent0);
    colorPanel.appendChild(panelContent7);
    colorPanel.appendChild(panelContent2);
    colorPanel.appendChild(panelContent6);
    colorPanel.appendChild(panelContent5);
    colorPanel.appendChild(panelContent2);
    colorPanel.appendChild(panelContent3);
    colorPanel.appendChild(panelContent1);
    colorPanel.appendChild(panelContent8);

    document.getElementsByTagName('body')[0].appendChild(colorPanel)
})();