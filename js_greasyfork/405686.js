// ==UserScript==
// @name         vip 解  析 z y f
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  vip 解 析 z y f
// @author       hahahaha
// @include http*://www.iqiyi.com/*
// @include http*://*.youku.com/*
// @include http*://v.qq.com/*
// @include http*://*.mgtv.com/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/405686/vip%20%E8%A7%A3%20%20%E6%9E%90%20z%20y%20f.user.js
// @updateURL https://update.greasyfork.org/scripts/405686/vip%20%E8%A7%A3%20%20%E6%9E%90%20z%20y%20f.meta.js
// ==/UserScript==

function run(){
    var realLink=location.href;
    //alert("我是一个警告框！");
    var block;
    if(location.host==='www.iqiyi.com'){
		block=document.querySelector("#flashOutter");
            //document.querySelector('.header-link');
	}
    if(location.host==='v.youku.com'){
		block=document.querySelector("#app > div > div.play-top-container > div.l-container");
        //document.querySelector('.thesis-wrap');
    }
    if(location.host==='v.qq.com'){
		block=document.querySelector('.player_title');
	}
    if(location.host==='www.mgtv.com'){
		block=document.querySelector("#__layout > div > div:nth-child(2) > div > div > div.g-container-play > div");
	}

    var url_list=[
        ["https://api.sigujx.com/?url=&url=","goto 思古\n"],
        ["https://jx.lache.me/cc/?url=&url=","gotou 拉车\n"],
        ["https://jiexi.380k.com/?url=","goto 黑云\n"]
    ];

    var i=0;
    for (; i < url_list.length; i++) {
        var mamaLink1=document.createElement('a');
        mamaLink1.href=url_list[i][0]+realLink;
        mamaLink1.innerText=url_list[i][1]
        block.appendChild(mamaLink1);
    }
}



setTimeout(function() { run(); }, 2000);



