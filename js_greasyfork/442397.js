// ==UserScript==
// @name         超星学习通破解视频暂停播放
// @namespace    https://greasyfork.org/zh-CN/scripts/442397-%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%A0%B4%E8%A7%A3%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C%E6%92%AD%E6%94%BE
// @version      1.0.1
// @description  学习通, 超星,破解视频倍速自动暂停
// @author       umrcheng
// @match        https://mooc1.chaoxing.com/mycourse/*
// @icon         https://public-1256790247.cos.ap-nanjing.myqcloud.com/zuzhi.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442397/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%A0%B4%E8%A7%A3%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/442397/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%A0%B4%E8%A7%A3%E8%A7%86%E9%A2%91%E6%9A%82%E5%81%9C%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
      // user           umrcheng
      // email          2641283266@qq.com
      // bilibili       https://space.bilibili.com/94884732?spm_id_from=333.1007.0.0

      'use strict';

      var num = 0; // 计数
      var time; // 定时器
      var speed = 10000; // 1000 = 1s 每多少毫秒检测一次视频是否已阻止暂停


      console.log('===========================等待页面加载完成=============================');

      time = setInterval(() => {
            // 开始
            run();
            console.log('已阻止学习通暂停视频' + num + '次');
      }, speed)


      function run(){

            var iframe = document.getElementsByTagName('iframe')['0'].contentWindow.document.getElementsByTagName('iframe');

            // 保存视频对象
            window.videos = [];
            window.vid_arr = [];

            // 遍历视频对象
            traverse(iframe);

            // 阻止
            for(var i = 0; i < window.videos.length; i ++){
                  prevent_suspended(window.videos[i]);
            }

            return true;
      };

      // 遍历视频对象
      function traverse(iframe){
            var video; //视频对象

            for(var i = 0; i < iframe.length; i ++){
                  try{
                        video = iframe[i].contentWindow.document.getElementsByTagName('video').video_html5_api;
                        if(Object.prototype.toString.call(video) != '[object HTMLVideoElement]'){
                              video = iframe[i].contentWindow.document.getElementsByTagName('video');
                        }
                        if(window.videos.length < iframe.length){
                              if(Object.prototype.toString.call(video) != '[object HTMLCollection]' && Object.prototype.toString.call(video) == '[object HTMLVideoElement]'){
                                    window.videos.push(video);
                              }
                        }
                  }catch (e){
                        console.log("警告, 发生特殊情况, 但此不影响运行", e, "有需要请联系作者");
                        continue;
                  }
            }
            return true
      }

      // 阻止暂停视频
      function prevent_suspended(v){
            v.pause = () => {
                  num ++;
            }
            v.volume = 0;

            return true;
      }
})();