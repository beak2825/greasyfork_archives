// ==UserScript==
// @name         云图书馆检索默认激活文本框
// @namespace    www.ytsg.com
// @version      0.2
// @description  方便云图书馆检索已编目图书
// @author       赵巍
// @match        http://www.ytsg.com/searchbook?type=*&fromSearch=*&libCode=AAAKT&typeId=*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425078/%E4%BA%91%E5%9B%BE%E4%B9%A6%E9%A6%86%E6%A3%80%E7%B4%A2%E9%BB%98%E8%AE%A4%E6%BF%80%E6%B4%BB%E6%96%87%E6%9C%AC%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/425078/%E4%BA%91%E5%9B%BE%E4%B9%A6%E9%A6%86%E6%A3%80%E7%B4%A2%E9%BB%98%E8%AE%A4%E6%BF%80%E6%B4%BB%E6%96%87%E6%9C%AC%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
     $("#app > section > div.contentBg > div > div > div:nth-child(2) > div:nth-child(2) > div > input[type=text]").focus();//焦点切换到分类号上
    $(document.body).append("<script>$(document).keyup(function(event){if(event.keyCode ==13){$('button').trigger('click');}});</script>")
    // Your code here...
})();