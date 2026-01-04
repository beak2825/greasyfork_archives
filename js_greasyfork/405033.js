// ==UserScript==
// @name         github release 加速下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  github release speedup downloader 给release添加 一个按钮 使用cf代理加速下载
// @author       https://github.com/holoto
// @match        *://github.com/*/*/releases
// @match        *://github.com/*/*/releases/tag/*
// @run-at       document-end
// @grant        unsafeWindow

// @downloadURL https://update.greasyfork.org/scripts/405033/github%20release%20%E5%8A%A0%E9%80%9F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/405033/github%20release%20%E5%8A%A0%E9%80%9F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // console.log("test1");
    //base in gh-proxy  https://github.com/hunshcn/gh-proxy

    //urld 是核心加速服务url

    var urld = "https://githubspeedupdownloader.holoto.workers.dev/";


    //cfworker  免费个人用户10w次请求 如果本项目提供的免费的加速服务 额度用尽
    // 请自行 参照https://github.com/hunshcn/gh-proxy 搭建 加速服务 把 urld 替换为 你自己的加速服务
    // 这里收集了一些加速服务url
    //   如果不能加速 额度用尽 urld 可以改成这个 https://gh.api.99988866.xyz



    var buttondownstyle = "color: red";
    var buttondowntitle = "CF加速下载    ";
    var filelist = Array.from(document.getElementsByClassName('Box Box--condensed mt-3'));
// var v1;
                    // console.log(filelist);
                    //   console.log(document.getElementsByClassName('Box Box--condensed mt-3'));
// var filelist1;

    filelist.forEach(v => {
                          // console.log(v);
                    // console.log(v);

      // v1 =v.getElementsByClassName('Box-row')
      let filelist1=Array.from(v.getElementsByClassName('Box-row'));
          console.log(filelist1)

      filelist1.forEach(vv => { 
                            console.log(vv.getElementsByTagName('a'));

       let divdown = document.createElement("div");

        let buttondown = document.createElement("a");
        buttondown.style = buttondownstyle;
   
        buttondown.innerText=buttondowntitle+vv.getElementsByTagName('a')[0].innerText;
        
        buttondown.href=urld+vv.getElementsByTagName('a')[0].href;

        divdown.style = "margin:10px;";
        divdown.append(buttondown);
        vv.after(divdown);
              console.log(vv);

      })
      
       
    }
                       
                       );




})();
