// ==UserScript==
// @name          10086.click图片放大工具
// @description   让列表图片放大工具。
// @version       1.0.2
// @namespace     10086.click图片放大工具
// @icon          data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @author        会说话的鱼
// @include       *10086.click/index.php*
// @run-at        document-start
// @grant         none
// @rewritten_script_code javascript
// @license        GPLv3
// @downloadURL https://update.greasyfork.org/scripts/540700/10086click%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/540700/10086click%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
	'use strict';

    document.addEventListener('DOMContentLoaded', function() {
         try {
             // DOM 加载完成的代码
             console.log('DOM 加载完成！');

             var lock = true;
             let intervalId;
             var styles = {
                 'max-width': "unset",
             };
             for (var prop in styles) {
                 document.querySelector('.container').style[prop] = styles[prop];
             }

             document.querySelectorAll('.grid-item').forEach(function(element) {
                 element.classList.remove('col-12', 'col-sm-12', 'col-lg-12');
                 element.classList.add('col-3');
             });

             function init() {
                 if(document.querySelectorAll('.google-auto-placed').length) {
                     document.querySelectorAll('.google-auto-placed').forEach(function(element) {
                         element.style.display = 'none';
                     });

                     // 稍后移除监听器
                     console.log('稍后移除监听器');
                     // window.removeEventListener('scroll', handleScroll);
                     lock = false;

                     clearInterval(intervalId);
                 }
             }
             init();

             function handleScroll() {
                 console.log('页面正在滚动');
                 init();
             }

            // 添加监听器
            // if(lock) window.addEventListener('scroll', handleScroll);
            if(lock) intervalId = setInterval(handleScroll, 100);
         } catch (error) {
             console.log(error)
             alert('代码没有正常执行')
         }
    });
})();