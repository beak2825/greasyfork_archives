// ==UserScript==
// @name         豆瓣小组中帖子新窗口打开
// @version      0.1.0
// @description  不再为打开一个帖子看完回退烦恼了
// @author       codepoet764@gmail.com
// @include      *douban.com*
// @grant        none
// @namespace https://greasyfork.org/users/129395
// @downloadURL https://update.greasyfork.org/scripts/30309/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E4%B8%AD%E5%B8%96%E5%AD%90%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/30309/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%E4%B8%AD%E5%B8%96%E5%AD%90%E6%96%B0%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    $('.title a').click(function(){
        var url =$(this).attr('href');
         window.open(url);
      
        return false;
 });
})();