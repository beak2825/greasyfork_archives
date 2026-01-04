// ==UserScript==
// @name        优化sim主页 or 洛巴虫主页
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  屏蔽sim主页改版后的控件&更换自定义壁纸&自动切换成百度搜索引擎，拒绝烦人的搜狗引擎&代码加了注释，有需要而且会改的可以试试
// @author        咩咩怪！
// @match      *://sim.plopco.com/*
// @match      *://www.51simer.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443615/%E4%BC%98%E5%8C%96sim%E4%B8%BB%E9%A1%B5%20or%20%E6%B4%9B%E5%B7%B4%E8%99%AB%E4%B8%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/443615/%E4%BC%98%E5%8C%96sim%E4%B8%BB%E9%A1%B5%20or%20%E6%B4%9B%E5%B7%B4%E8%99%AB%E4%B8%BB%E9%A1%B5.meta.js
// ==/UserScript==

    //let url_1="https://s1.ax1x.com/2022/04/26/LbEVSg.jpg"//如果要更换自定义壁纸，在这行语句的引号里面粘贴图片的网页链接，然后保存即可（记得去掉最前面的“//”）
    //let url="background-image: url('"+url_1+"');"//如果要更换自定义壁纸，去掉这行语句最前面的“//”
    var engine
    var ctime1=setInterval(abc,10);//隐藏网页导航的计时器
    var ctime2=setInterval(bcd,10);//切换背景页面计时器
    var ctime3= setInterval(change_engine,10);//切换成百度引擎的计时器
    setTimeout(function(){var mmm = document.getElementsByClassName("sim-search-engine-mode-icon sim-search-engine-mode-icon-single").item(0);mmm.click()},500);//切换成单引擎的计时器，如果没效果就把时间延长点，原理是找到相应的控件然后触发其点击事件
    setTimeout(function (){clearInterval(ctime1);clearInterval(ctime2);clearInterval(ctime3);},5000);//关闭所有计时器


function abc(){//隐藏商标和网页导航函数源码，原理依然是找到相应的元素然后将其隐藏
    let aaa=document.getElementsByClassName("sim-site-box")[0]
    let ccc=document.getElementsByClassName("copyright")[0]
    ccc.style="display:none";
    if (aaa.style.display!="display:none" || ccc.style!="display:none"){
        aaa.style="display:none";
        ccc.style="display:none";
    }

}
function bcd(){//更换网页背景函数源码，原理是获得对应的元素，然后替换其style内的url，所以想要用自己的图片要先上传图床
    let bbb=document.getElementsByClassName("sim-bg-view")[0]
    try{
    if (bbb.style!=url){
    bbb.style=url
    }}catch{}
}
function change_engine(){//切换引擎函数源码，原理是获取sim-circle-menu-item-wrapper的htmlc0llection，再通过索引获得其第一个元素，再触发它的点击事件
    try{var url_name=document.getElementsByClassName("sim-search-engine-icon-area").item(0).parentNode.action//通过获取父节点的方式获取正在使用的浏览器引擎值
    if (url_name!="https://www.baidu.com/s"){
    try {var engine= document.getElementsByClassName("sim-circle-menu-item-wrapper").item(0);
         engine.click();
    }catch{}}
    }catch{}
}