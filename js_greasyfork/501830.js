// ==UserScript==

// @name         多音字
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  研思科技脚本
// @author       ErikPan
// @match        https://label.vegas.100tal.com/other-mark/conversation-rewrite/*
// @match        https://label.vegas.100tal.com/annotation-detail/inspect-conversation-rewrite/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501830/%E5%A4%9A%E9%9F%B3%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/501830/%E5%A4%9A%E9%9F%B3%E5%AD%97.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function search(){
      setTimeout(()=>{
          let textElement = document.getElementsByClassName("answer-origin-content-value")[0]
          let text = textElement.innerText
          // Define the function to replace phoneme tags with colored text

          // Replace the text content
          textElement.innerHTML = text

          if(window.location.href.split("/")[3]=="annotation-detail"){
              const textElement2 = document.getElementsByClassName("conversation-rewrite-content")[0]
              if (textElement2) {

                  let text = textElement2.innerText
                  textElement2.innerHTML = text
              }
          }
          // 获取所有的 phoneme 元素
          const colors = ['#FFEB3B', '#FFCDD2', '#C8E6C9', '#BBDEFB', '#D1C4E9', '#FFE0B2', '#FFAB91', '#E6EE9C', '#B2DFDB', '#F8BBD0']; // 10个背景颜色
          let phonemeElements = document.getElementsByTagName("phoneme");

          // 遍历每个 phoneme 元素
          for (let i = 0; i < phonemeElements.length; i++) {
              let element = phonemeElements[i];

              // 设置颜色为黄色


              // 设置 innerText 为 innerHTML
              element.innerText = element.outerHTML

              // Define the function to replace phoneme tags with colored text
              const phonemeRegex = /alphabet="[^"]+" ph="([^"]+)"/g;
              let match;
              if ((match = phonemeRegex.exec(element.innerText)) !== null) {
                let match_list=match[1].split(" ")
                function hightlight(pinyin){

                  // 检查匹配并在匹配时添加新的 div
                  match_list.forEach((item, index) => {
                      const regExp = new RegExp(item, 'g');
                      let color = colors[index% 10]; // 选择颜色
                      pinyin=pinyin.replaceAll(regExp,`<span style="background: ${color};">${item}</span>`)
                  })
                  return pinyin
                }

                      element.innerHTML = element.innerHTML.replace(/ph="([^"]+)"/g,
                          (match,pinyin)=>{
                            return `ph="${hightlight(pinyin)}"`
                          })
          }
        }
      },1500)

  }
  search()



  setTimeout(()=>{
      const skipBtn = document.getElementsByClassName("skip-btn")[0];
      const submitBtn = document.getElementsByClassName("submit-btn")[0];
      const prevControlBtn = document.getElementsByClassName("prev-control-btn")[0];
      const nextControlBtn = document.getElementsByClassName("next-control-btn")[0];

      if (skipBtn) {
          skipBtn.addEventListener("click", search, false);
      }

      if (submitBtn) {
          submitBtn.addEventListener("click", search, false);
      }

      if (prevControlBtn) {
          prevControlBtn.addEventListener("click", search, false);
      }

      if (nextControlBtn) {
          nextControlBtn.addEventListener("click", search, false);
      }

  },2000
            )
})();
