// ==UserScript==
// @name         91新窗口观看
// @namespace    http://tampermonkey.net/
// @version      0.6.4
// @description  91新窗口观看0.6.4
// @author       temp
// @match        http*://*.workarea2.live/*
// @match        http*://*.91porn.com/*
// @match        http*://*.91p*.com/*
// @match        http*://*.91p*.live/*
// @match        http*://*.91p51.live/*
// @match        http*://*.workgreat11.live/*
// @match        http*://*.91p46.com/*
// @match        http*://*.91p321.com/*
// @match        http*://*.9p47q.com/*
// @match        http*://*.workarea9.live/*
// @include      .*workarea.*
// @include      .*91p.*
// @icon         https://0117.workarea2.live/images/logo.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446363/91%E6%96%B0%E7%AA%97%E5%8F%A3%E8%A7%82%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/446363/91%E6%96%B0%E7%AA%97%E5%8F%A3%E8%A7%82%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    '91新窗口观看';
    var button1 = document.createElement('button');
    button1.id = "openOnNewWin1";
    button1.style.position="fixed";
    button1.style.left="0px";
    button1.style.top="220px";
    button1.style['z-index']="999999";
    button1.innerHTML="继续观看1";
    document.body.appendChild(button1);
    document.getElementById('openOnNewWin1').addEventListener('click',function(){
        window.open("http://91.9p9.xyz/ev.php?VID="+document.getElementById('VUID').innerText);
    })
})();
(function() {
    '91新窗口观看';
    var button2 = document.createElement('button');
    button2.id = "openOnNewWin2";
    button2.style.position="fixed";
    button2.style.left="0px";
    button2.style.top="250px";
    button2.style['z-index']="999999";
    button2.innerHTML="继续观看2";
    //var VID3=$("#favorite").children().eq(1).text();
    var VID2=$("#favorite #VID")[0].innerText
    document.body.appendChild(button2);
    document.getElementById('openOnNewWin2').addEventListener('click',function(){
        //window.open("https://www.hlsplayer.net/#type=m3u8&src=https://cdn77.91p49.com/m3u8/"+VID2+"/"+VID2+".m3u8");
        window.open("https://www.hlsplayer.org/play?url=cns.killcovid2021.com/m3u8/"+VID2+"/"+VID2+".m3u8");
    })
})();
(function() {
    '91新窗口观看';
    var button3 = document.createElement('button');
    button3.id = "openOnNewWin3";
    button3.style.position="fixed";
    button3.style.left="0px";
    button3.style.top="280px";
    button3.style['z-index']="999999";
    button3.innerHTML="继续观看3";
    //var VID3=$("#favorite").children().eq(1).text();
    var VID3=$("#favorite #VID")[0].innerText
    document.body.appendChild(button3);
    document.getElementById('openOnNewWin3').addEventListener('click',function(){
        //window.open("https://www.hlsplayer.net/#type=m3u8&src=https://la2.killcovid2021.com/m3u8/"+VID3+"/"+VID3+".m3u8");
        window.open("https://www.hlsplayer.org/play?url=https://la3.killcovid2021.com/m3u8/"+VID3+"/"+VID3+".m3u8");
    })
})();
(function() {
    '91新窗口观看';
    var button4 = document.createElement('button');
    button4.id = "openOnNewWin4";
    button4.style.position="fixed";
    button4.style.left="0px";
    button4.style.top="310px";
    button4.style['z-index']="999999";
    button4.innerHTML="继续观看4";
    //var VID4=$("#favorite").children().eq(1).text();
    var VID4=$("#favorite #VID")[0].innerText
    document.body.appendChild(button4);
    document.getElementById('openOnNewWin4').addEventListener('click',function(){
        //window.open("https://www.hlsplayer.net/#type=m3u8&src=https://cns.killcovid2021.com/m3u8/"+VID4+"/"+VID4+".m3u8");
        window.open("https://www.hlsplayer.org/play?url=https://cns.killcovid2021.com/m3u8/"+VID4+"/"+VID4+".m3u8");
    })
})();
(function() {
    '91新窗口观看';
    var button5 = document.createElement('button');
    button5.id = "openOnNewWin5";
    button5.style.position="fixed";
    button5.style.left="0px";
    button5.style.top="340px";
    button5.style['z-index']="999999";
    button5.innerHTML="继续观看5";
    //var VID4=$("#favorite").children().eq(1).text();
    var VID4=$("#favorite #VID")[0].innerText
    document.body.appendChild(button5);
    document.getElementById('openOnNewWin5').addEventListener('click',function(){
        window.open("https://fnew.91p49.com//mp43/"+VID4+".mp4");
    })
})();
(function() {
    '91新窗口观看';
    var button6 = document.createElement('button');
    button6.id = "openOnNewWin6";
    button6.style.position="fixed";
    button6.style.left="0px";
    button6.style.top="370px";
    button6.style['z-index']="999999";
    button6.innerHTML="继续观看6";
    //var VID4=$("#favorite").children().eq(1).text();
    var VID4=$("#favorite #VID")[0].innerText
    document.body.appendChild(button6);
    document.getElementById('openOnNewWin6').addEventListener('click',function(){
        window.open("https://www.hlsplayer.org/play?url=https://1729546148.rsc.cdn77.org/m3u8/"+VID4+"/"+VID4+".m3u8");
    })
})();