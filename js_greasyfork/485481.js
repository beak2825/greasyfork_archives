// ==UserScript==
// @name         【百川】手写内容标注（新）———增加快捷键
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  按Alt键一键提交，按F2键一键举报，光标自动聚焦到录入框内，摆脱鼠标键盘来回切换，提高录入效率！
// @author       zkool
// @match        https://www.baichuanweb.com/bmis/biaozhu221103mark?taskid=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/485481/%E3%80%90%E7%99%BE%E5%B7%9D%E3%80%91%E6%89%8B%E5%86%99%E5%86%85%E5%AE%B9%E6%A0%87%E6%B3%A8%EF%BC%88%E6%96%B0%EF%BC%89%E2%80%94%E2%80%94%E2%80%94%E5%A2%9E%E5%8A%A0%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/485481/%E3%80%90%E7%99%BE%E5%B7%9D%E3%80%91%E6%89%8B%E5%86%99%E5%86%85%E5%AE%B9%E6%A0%87%E6%B3%A8%EF%BC%88%E6%96%B0%EF%BC%89%E2%80%94%E2%80%94%E2%80%94%E5%A2%9E%E5%8A%A0%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* globals jQuery, $, waitForKeyElements */

    document.addEventListener('keydown', function(event) {
    if (event.altKey) {
        console.log("Alt 键被按下");
        $('span').filter(function() {
         if($(this).text().trim() === '提 交'){
           console.log('找到提交按钮了');
           //找到内容判断是不是T和F结尾再提交
           var v = $(".ql-editor").children("p").text();
           if(v.length>1 && (v.indexOf('T')==v.length-1 || v.indexOf('F')==v.length-1)){
              $(this).parent().click();
           }
         }
        });
    }

    if (event.which === 113) { // event.which表示按下的键值，113为F2的键值
          console.log("按下了键盘上的左箭头");
           $('span').filter(function() {
             if($(this).text().trim() === '举报'){
               console.log('找到举报按钮了');
               $(this).parent().click();

               setTimeout(function() {
                $('span').filter(function() {
                   if($(this).text().trim() === '废弃'){
                     console.log('找到废弃按钮了');
                     $(this).parent().click();

                     $('span').filter(function() {
                         if($(this).text().trim() === '确认'){
                           console.log('找到确认按钮了');
                           $(this).parent().click();
                         }
                      });
                   }
                });
               }, 500);


             }
          });
      }


  });

  setTimeout(function() {
       $('.ql-editor p').filter(function() {
         if($(this).text().trim() === 'blank'){
           console.log('找到blank了');
           $(this).parent().focus();
           $(this).text('T');
         }
     });
  }, 500);

})();