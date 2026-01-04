// ==UserScript==
// @license      Peng
// @name         (21tb)时代光华课程自动播放
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  learning
 
// @author       Peng
// @match        *://*.21tb.com/*
// @downloadURL https://update.greasyfork.org/scripts/454278/%2821tb%29%E6%97%B6%E4%BB%A3%E5%85%89%E5%8D%8E%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/454278/%2821tb%29%E6%97%B6%E4%BB%A3%E5%85%89%E5%8D%8E%E8%AF%BE%E7%A8%8B%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
 
      (function() {
        'use strict';
        function next(){


          var Progress = document.querySelector('.study-rate-title .rate') //学习进度
          
          if (Progress != null && Progress.textContent.includes('100%') == true) {
            alert("本课程已学习完成!")
            window.close();

          } else {

            let all_item = document.querySelectorAll('.section-item .first-line') //总节数
            var all_tig_item = document.querySelectorAll('.finish-tig-item') //已完成和进行中
        
            if (all_item != null && all_item.length > 0) {
              console.log("共 " + all_item.length + " 节课")
              if (all_tig_item != null && all_tig_item.length > 0) {
                var index = all_tig_item.length
                var done = 0;
                for (let i = 0; i < index; i++) {
                  if (all_tig_item[i].textContent.includes('已完成')) {
                    done++
                  }
                }

                console.log("index:" + index + ", done:" + done)

                if (done == index){
                  for (let j = 0; j < all_item.length; j++) {
                    if (all_item[j].textContent.includes('已完成') == false) {
                      all_item[j].click()
                      console.log("下一节 播放完成！")
                      break;
                    }
                  }
                }
                
              }
            }
            
          }
 
 
        }
        setInterval(next,10000)
        
      })();