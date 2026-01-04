// ==UserScript==
// @name         Android 开发者镜像站重定向
// @name:en      Android Developer Chinese Version
// @namespace
// @version      1.0
// @description  Android 开发者谷歌官方网站自动跳转到无需穿墙的镜像站。
// @description:en Go to developer.android.google.cn when visit developer.android.com in China.
// @author       LEORChn
// @match        http*://developer.android.com/*
// @match        http*://link.zhihu.com/*
// @match        http*://www.jianshu.com/*
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/159546
// @downloadURL https://update.greasyfork.org/scripts/37313/Android%20%E5%BC%80%E5%8F%91%E8%80%85%E9%95%9C%E5%83%8F%E7%AB%99%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/37313/Android%20%E5%BC%80%E5%8F%91%E8%80%85%E9%95%9C%E5%83%8F%E7%AB%99%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==
var hf=location.href;
var reg=hf.split('=http');
var newwindow=false;
(function() {
    //alert('detect: '+hf);//知乎的鼠标事件捕捉不到，但是可以加载一点数据，就用读图模式。简书可以抓鼠标事件，就用光标模式
    if(location.host==='developer.android.com') {//源墙站 自跳转，但无法在未加载的情况下跳转。以抢读模式支持
        jump();
    }else if(reg.length==2){//知乎、 ，以抢读模式支持
        prepare();
    }
    if(location.host==='www.jianshu.com'){//简书 ，以光标模式支持
        window.addEventListener('mousedown', function(e){
            //alert(e);
            hf=e.target.toString();//此处的target并非String对象所以需要toString
            reg=hf.split('=http');//hf被重载，所以reg也要一起重载
            newwindow=true;
            if(hf.startsWith('http'))prepare();
        },true);
    }
})();

function prepare(){
    //alert(hf);
    hf= hf.replace(reg[0]+'=','');
    hf= decodeURIComponent(hf);
    //alert(hf);
    jump();
}

function jump(){
    hf=hf.replace('developer.android.com','developer.android.google.cn');
    //alert('-> '+hf);
    if(newwindow) window.open(hf);
    else location.replace(hf);
}