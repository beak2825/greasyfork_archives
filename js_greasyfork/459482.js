// ==UserScript==
// @name         FFFF专用比对评分及下载是否
// @namespace    续命长者
// @version      0.1
// @description  Try to take over the world!
// @author       续命长者
// @match        *://*.javbus.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @grant        GM_listValues
// @grant  GM_setValue
// @grant  GM_getValue
// @grant  GM_log
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459482/FFFF%E4%B8%93%E7%94%A8%E6%AF%94%E5%AF%B9%E8%AF%84%E5%88%86%E5%8F%8A%E4%B8%8B%E8%BD%BD%E6%98%AF%E5%90%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/459482/FFFF%E4%B8%93%E7%94%A8%E6%AF%94%E5%AF%B9%E8%AF%84%E5%88%86%E5%8F%8A%E4%B8%8B%E8%BD%BD%E6%98%AF%E5%90%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
GM_setValue('夢乃あいか','A');
    GM_log(GM_getValue('夢乃あいか'));
    sessionStorage.setItem("ren", 2123);
    GM_log(GM_getValue('232'));
    //chrome.storage用户数据可以与 chrome 自动同步（通过 storage.sync）,只要用户登录了 chrome 账号，则能够全量同步浏览器
    //用户数据可以存储对象（localStorage 是将对象 string 到字符串中）
    localStorage.setItem(2312,323214);
        //定位赋值演员的名字，yanyuan对应的是最后一个P，包含所有演员以及内部元素
        //var yanyuan = document.getElementsByClassName("col-md-3 info").lastElementChild;
        var yanyuan = document.getElementsByClassName("col-md-3 info")[0];
        //yanyuan3对应的是番号所在的行，包含所有演员以及内部元素
        var yanyuan3= document.getElementsByClassName("col-md-3 info")[0].firstElementChild;
        var fanHao=document.createElement("a");
        var stArs=document.createElement("span");
        var dengji=document.createElement("p");
        var pinji=document.createElement("p");
        //获取存储内容里的值
        var bbb=GM_listValues();
        console.log(bbb);
        //定义yanyuan2为所有的class为.genre的元素
        var yanyuan2=document.querySelectorAll(".genre");
        //遍历元素的内容，打印元素的文本
        for (var i=yanyuan2.length-1;i >0 ;i--){
            console.log(yanyuan2[i].innerText);
        };
    //将第一行的元素遍历，取到番号，赋值给番号的文本；
     //yanyuan3里的最后一个元素的文本值
let fanhaofanhao="";
//遍历番号所在行子元素，用var定义一个fuzhifanhao
for (var x=0;x <yanyuan3.childNodes.length;x++){
            console.log(yanyuan3.childNodes[x].innerText);
    var fuzhiFanhao=yanyuan3.childNodes[2].innerText;
        };
//将star的值赋值为所有class为genre的所有span的子元素A，包含star的链接，获得的是一个集合
    let starsa="";
    let star = document.querySelectorAll('span.genre > a[href*="/star/"');
            console.log(star);
    if(star.length>0){
        for(let a of star ){
         if (GM_getValue(a.text)!==undefined){
            starsa+=(GM_getValue(a.text)+a.text+"");
         }else{
            //在此处添加对a.text的判断，对比数据库或者缓存的值，返回分类替换#内容
            starsa+=("#"+a.text+"");
        }}
    };
//改变fanhao的文本值以及链接内容
    fanHao.innerText="复制番号";
    fanHao.href="#";
    fanHao.id="fanhao";
    yanyuan3.append(fanHao);
    yanyuan3.append(dengji);
//添加点击事件，将番号行的取值复制到剪贴板;
 fanHao.onclick = function () {
        console.log(fuzhiFanhao);
        GM_setClipboard(fuzhiFanhao);
    };
//将遍历得到的演员列表文字，赋值给新添加的span标签
    stArs.innerHTML=starsa;
    stArs.id="nihao";
    yanyuan.appendChild(stArs);

    console.dir(yanyuan2);
/*     function javbus(){
        let avname = document.createElement('a');
        avname.innerText='点击复制tag文件名';
        avname.href="#";
        let video_info = document.querySelector('body > div.container > div.row.movie > div.col-md-3.info');
        video_info.append(avname);

        avname.onclick = function () {
            let result = javbusGetter();
            GM_setClipboard(result);
        };
    };
    function javbusGetter(){
        let result = '';
        //获取标题
        let title = document.querySelector('body > div.container > h3').innerText;
        console.log("title="+title);
        result+=title;

        //获取star
        let starAs = document.querySelectorAll('span.genre > a[href*="/star/"');
        console.log(starAs.length);
        if (starAs.length > 0) {
            result += " ";
            for(let a of starAs){
                console.log("star="+a.text);
                result+=("#"+a.text);
            }
        }

        //获取tag
        let tagAs = document.querySelectorAll('span.genre a[href*="/genre/"');
        console.log(tagAs.length);
        if(tagAs.length>0){
            result += " ";
            for(let a of tagAs){
                console.log("tag="+a.text);
                result+=("#"+a.text);
            }
        }
        return result;
    }; */
    //javbus();

})();