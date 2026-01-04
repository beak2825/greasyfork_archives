// ==UserScript==
// @name         四川学法考试-后续更新自动考试
// @namespace    http://tampermonkey.net/
// @version      2024-10-12
// @description  登录账号自动学习!
// @author       zy
// @match       http*://xxpt.scxfks.com/study/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnblogs.com
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512420/%E5%9B%9B%E5%B7%9D%E5%AD%A6%E6%B3%95%E8%80%83%E8%AF%95-%E5%90%8E%E7%BB%AD%E6%9B%B4%E6%96%B0%E8%87%AA%E5%8A%A8%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/512420/%E5%9B%9B%E5%B7%9D%E5%AD%A6%E6%B3%95%E8%80%83%E8%AF%95-%E5%90%8E%E7%BB%AD%E6%9B%B4%E6%96%B0%E8%87%AA%E5%8A%A8%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    let log = console.log;
    log("loading");
    let curIndex = 0;
    let done = false;
    function main() {
        log("main...");
        if(!done){
             study();
        }
    }
    //学法
    function study(){
         log("学习中")
         let pathName = window.location.pathname;
		 if(pathName.includes("index")){
			 log("首页");
			 let allFinish = true;
             let unFinishEle = null;
			 let cols = document.getElementsByClassName('card current');
             let navs = document.getElementsByClassName('film_focus_nav')[0].children;
			 for(let i =0;i<cols.length;i++){
                 log( cols[i].children[1].children[1].className)
                 if( cols[i].children[1].children[0].children[1].children[0].innerText !== '100%'){
                     unFinishEle = cols[i].children[1].children[1];
                     allFinish = false;
                     log(allFinish)
                     break;
                 }
			 }
             if(unFinishEle){
                 unFinishEle.click();
             }else{
                 if(curIndex<navs.length){
                     curIndex++;
                     navs[curIndex].click();
                     setTimeout(()=>{
                     study();
                     },100)
                 }

             }
		 }else if(pathName.includes("course")&&!pathName.includes("chapter")){
            log('学习课程');
              let unFinishEle = null;
             let allFinish = true;
              let cols = document.getElementsByTagName('table');
             for(let i = 2;i<cols.length-2;i++){
                let col = cols[i].getElementsByClassName('title')[0].children[1];
                if(col.innerText !== '获得0.5学分'){
                allFinish = false;
                unFinishEle = col;
                    break;
                }

             }
             if(unFinishEle){
              unFinishEle.click();
             }
         }else if(pathName.includes("chapter")){
                 let allFinish = false;
                 const obEle = document.getElementsByClassName('chapter-score')[0];
                 log(obEle.innerText);
               if(obEle.innerText !== '每日最多学习5分，您已到达今日上限'){
                 const nextChapter = document.getElementsByClassName("next_chapter")[0];
                 const observer = new MutationObserver((mutations) => {
                   if(nextChapter){
                       nextChapter.click();
                  }else{
                      window.location.href ='http://xxpt.scxfks.com/study/index';
                  }
                     observer.disconnect();
                  });
                const config = {
                      attributes: true,
                  };
             observer.observe(obEle,config);
             }else{
              done = true;
             }
                  }
    }
	  if (document.readyState === "complete") {
        // DOM 已经加载完成
        main();
    } else {
        // DOM 还未加载完成
        // document.addEventListener("DOMContentLoaded", main);
        window.addEventListener("load", main);
    }
	    document.addEventListener("keydown", function (event) {
	        log("keydown", event.code);
	        if (event.code === "KeyG") {
	            // exam();
	        } else if (event.code === "KeyT"){
	            let ms = 3000;
	        }
	    });
})();