// ==UserScript==
// @name         奥鹏视频自动答题
// @namespace    http://tampermonkey.net/
// @description  安徽奥鹏暑假视频学习, 视频中会不间断跳出题目, 此插件可自动选择答题项并提交(默认选C项, 不保证答题正确), 不需要再手动答题
// @author       SkuraZZ
// @version      2024.7.23.5
// @match        https://learn.ourteacher.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ourteacher.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501568/%E5%A5%A5%E9%B9%8F%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/501568/%E5%A5%A5%E9%B9%8F%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Function to check and set the loop attribute on the video
    function checkAndSetVideoLoop(iframe) {
      try {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        // 可能变更处 video id
        const video = iframeDocument.getElementById('ckplayer_video');
        if (video) {
          video.loop = true;
        }
      } catch (e) {
        console.warn('Unable to access iframe content:', e);
      }
    }
    
    // Function to handle iframe load event
    function onIframeLoad() {
      // 可能变更处 iframe.name
      const rightFrame = document.querySelector('iframe[name="rightFrame"]');
      if (rightFrame) {
        checkAndSetVideoLoop(rightFrame);
      }
    }
    
    // Add event listener for initial load
    // 可能变更处 iframe.name
    const rightFrameInitial = document.querySelector('iframe[name="rightFrame"]');
    if (rightFrameInitial) {
      rightFrameInitial.addEventListener('load', onIframeLoad);
    }
    
    // Add a MutationObserver to listen for changes in the iframe's src attribute
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
          onIframeLoad();
        }
      });
    });
    
    if (rightFrameInitial) {
      observer.observe(rightFrameInitial, { attributes: true });
    }


    (function checkAndClickElementsInIframe() {
      setInterval(() => {
        const iframes = document.getElementsByTagName('iframe');
        for (let i = 0; i < iframes.length; i++) {
          try {
            const iframeDocument = iframes[i].contentDocument || iframes[i].contentWindow.document;
            // 可能变更处 选项按钮id
            const radioButtonC = iframeDocument.getElementById('radiobuttonC');
            if (radioButtonC) {
              radioButtonC.click();
              // 可能变更处 提交按钮id
              const submitButton = iframeDocument.getElementById('submit');
              if (submitButton) {
                submitButton.click();
                  console.log("已答题", Date())
              }
            }
          } catch (e) {
            console.warn('Unable to access iframe content:', e);
          }
        }
      }, 20000); // Every 20s
    })();
    console.log("奥鹏test")
    // Your code here...
})();