// ==UserScript==
// @name         电影天堂清路猴
// @namespace    http://tampermonkey.net/
// @version      2018.11.10
// @description  电影天堂首页及电影下载页面清除广告，点击磁力链自动可以选择使用百度云盘下载!
// @author       yang
// @match        http://www.dytt8.net/*
// @match        https://www.dytt8.net/*
// @match        http://dytt8.net/*
// @match        https://dytt8.net/*
// @match        https://pan.baidu.com/disk/home*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369837/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E6%B8%85%E8%B7%AF%E7%8C%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/369837/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E6%B8%85%E8%B7%AF%E7%8C%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let domain_name = window.location.hostname;

    if(domain_name=='pan.baidu.com'){
        var url = new URL(window.location.href);
        var mag_href = url.searchParams.get("mag_href");

        if(!mag_href) return;

      window.onload = function(){
        document.querySelector('.tcuLAu .icon-download').parentElement.click();
        let timer = setInterval(()=>{
           if(document.getElementById('_disk_id_2')){
             document.getElementById('_disk_id_2').click();
             document.getElementById('share-offline-link').value=mag_href;
             clearInterval(timer);
           }
        },200);


      }

    return;
    }

    window.onload = function(){
        console.log('电影天堂扫地工开车了。。');
        //清除第一次点击电影名称时跳转的广告
        if(document.querySelector("body > a")){
            document.querySelector("body > a").outerHTML = "";
        }
        //清除广告iframe
        let ifs = document.getElementsByTagName('iframe');
        for(let i = 0;i<ifs.length;i++){
         ifs[i].style.display = 'none';
        }
        //清除子页面广告
        let temp_node = document.getElementById('showXLdiv');
        if(temp_node.nextElementSibling) temp_node.nextElementSibling.style.display='none';
        if(temp_node.nextElementSibling && temp_node.nextElementSibling.nextElementSibling){
           temp_node.nextElementSibling.nextElementSibling.style.display='none';
        }

        //磁力链处理
        if(document.querySelector('#Zoom a')){
         document.querySelector('#Zoom a').onclick = function(e){
           e.preventDefault();
           let mag_href = document.querySelector('#Zoom a').href;
           if(prompt('是否要使用百度网盘直接下载？',mag_href)){
               window.location.href = 'https://pan.baidu.com?mag_href='+mag_href;
           }
         }
        }
    };
    //右下角广告在页面加载完成后并不是第一时间出现,使用定时器轮询，在广告出现时
    //隐藏广告，清除定时器
    let timer1 = setInterval(()=>{
     let ad_right = document.getElementById('cs_DIV_cscpvrich5041B');
        if(!ad_right) return;
     if(ad_right.style.display == 'none'){
         clearInterval(timer1);
     }else{
      ad_right.style.display = 'none';
     }
    },500);
    //清除首页首次点击任何位置都会调转的广告
     let timer2 = setInterval(()=>{
     let index_cover = document.querySelector("body > a");
        if(!index_cover) return;
     if(index_cover.outerHTML == ''){
         clearInterval(timer2);
     }else{
      index_cover.outerHTML = '';
     }
    },500);



})();