// ==UserScript==
// @name         特点字符标红
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  特点字符标红，测试
// @author       TCH
// @match        *://*.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475411/%E7%89%B9%E7%82%B9%E5%AD%97%E7%AC%A6%E6%A0%87%E7%BA%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/475411/%E7%89%B9%E7%82%B9%E5%AD%97%E7%AC%A6%E6%A0%87%E7%BA%A2.meta.js
// ==/UserScript==
 
(function()
{


      function find(searchVal, bgColor) {
            var oDiv = document.getElementsByTagName("body")[0];
            var sText = oDiv.innerHTML;
searchVal=" "+searchVal; 
            var sKey = "<span name='addSpan' style='color:red;'>" + searchVal + "</span>";
            var num = -1;
            var rStr = new RegExp(searchVal, "g");
            var rHtml = new RegExp("\<.*?\>", "ig");//匹配html元素
            var aHtml = sText.match(rHtml); //存放html元素的数组
            sText = sText.replace(rHtml, '{~}');  //替换html标签
            sText = sText.replace(rStr, sKey); //替换key
            sText = sText.replace(/{~}/g, function () {  //恢复html标签
                  num++;
                  return aHtml[num];
            });
            oDiv.innerHTML = sText;
      }
find('economist')
      find('字符')
 
})();