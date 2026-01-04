// ==UserScript==
// @name         把csdn需要下载的资源屏蔽掉
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  解决了我们搜索文章的列表，以及点击查看博客以后下面会显示一些推荐的文章。这里把需要下载的隐藏掉了。这里先用。没什么问题我就把csdn的内容都写到一个脚本里面
// @author       duoluodexiaoxiaoyuan
// @match        https://blog.csdn.net/*
// @match        https://so.csdn.net/so/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444100/%E6%8A%8Acsdn%E9%9C%80%E8%A6%81%E4%B8%8B%E8%BD%BD%E7%9A%84%E8%B5%84%E6%BA%90%E5%B1%8F%E8%94%BD%E6%8E%89.user.js
// @updateURL https://update.greasyfork.org/scripts/444100/%E6%8A%8Acsdn%E9%9C%80%E8%A6%81%E4%B8%8B%E8%BD%BD%E7%9A%84%E8%B5%84%E6%BA%90%E5%B1%8F%E8%94%BD%E6%8E%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let csdnSearchUrl = /so\/search/i;

    setTimeout(()=>{
      if(window.location.href.match(csdnSearchUrl)){
          // 思路就是我拿到有下载图标的标签，然后我把标签的大盒子删掉，然后就是盒子的父亲的父亲最后定位找到的。设置3s以后执行，防止拿不到标签
          // 这里本来是用remove的但是用remove会导致集合数组的长度实时变化，所以这里用display为node来改变
        let allDownLoadUrlList = document.getElementsByClassName("icon-download");
        let allDownLoadUrlListLength = allDownLoadUrlList.length;
        console.log(allDownLoadUrlList)
        console.log(allDownLoadUrlList.length)
        for(let i=0;i < allDownLoadUrlListLength;i++){
            console.log(i)
            allDownLoadUrlList[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display="none";
        }
        setInterval(()=>{
            // 出现下拉的时候会有新的出现，所以这里用setInterval，其实这里用监控滚动实现比较好。后面可能优化。也可能懒就不动了
            let allDownLoadUrlList = document.getElementsByClassName("icon-download");
            let allDownLoadUrlListLength = allDownLoadUrlList.length;
            console.log(allDownLoadUrlList)
            console.log(allDownLoadUrlList.length)
            for(let i=0;i < allDownLoadUrlListLength;i++){
                console.log(i)
                allDownLoadUrlList[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.style.display="none";
            }
        },10*1000)
      }else{
          // 这个是文章下面出现下载的资源，敲好这个标签表示的就是下载的文章
          let allNeedDownLoadAboutArticleUndle = document.getElementsByClassName("type_download ");
          for(let i=0;i<allNeedDownLoadAboutArticleUndle.length;i++){
              allNeedDownLoadAboutArticleUndle[i].style.display="none"
          }
          // 今天发现文章里面也会提供下载的链接，补充一下，只能一点点补充没办法
          try {
              // 文章里面的下载链接
              let contentInnerDownHref = document.getElementsByClassName("recommend_down")[0];
              contentInnerDownHref.style.display="none";
          }
          catch(err) {
              console.log("文章里面没有下载资源的链接")
          }

      }



    },3000)

})();