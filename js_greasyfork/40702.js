// ==UserScript==
// @name       高亮页面相关关键词显示
// @namespace  piaoyun.cc
// @version    0.2
// @description  高亮页面中的相关关键词显示
// @match      *://*/*
// @copyright  2018,piaoyun.cc
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/40702/%E9%AB%98%E4%BA%AE%E9%A1%B5%E9%9D%A2%E7%9B%B8%E5%85%B3%E5%85%B3%E9%94%AE%E8%AF%8D%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/40702/%E9%AB%98%E4%BA%AE%E9%A1%B5%E9%9D%A2%E7%9B%B8%E5%85%B3%E5%85%B3%E9%94%AE%E8%AF%8D%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function(){
    'use strict';
    $(function(){
       var links = $('a');
       links.each(function(){
           var link = $(this);
           if(link.attr('rel')==='puercn'){
               link.css('color','#0c9');
               link.css('border','1px dashed black');
               link.css('border-radius','2px');
           }
       });
    });
})();