// ==UserScript==
// @name         获取某页面的所有链接.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取某页面的所有链接
// @author       Bi Zhen
// @match      http://www.kundeju.com/loupan*
// @run-at       document-start
// @grant        none
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/373367/%E8%8E%B7%E5%8F%96%E6%9F%90%E9%A1%B5%E9%9D%A2%E7%9A%84%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5js.user.js
// @updateURL https://update.greasyfork.org/scripts/373367/%E8%8E%B7%E5%8F%96%E6%9F%90%E9%A1%B5%E9%9D%A2%E7%9A%84%E6%89%80%E6%9C%89%E9%93%BE%E6%8E%A5js.meta.js
// ==/UserScript==


(function() {
    'use strict';
    //想要获取的模糊链接，比如：http://www.kundeju.com/loupan/20639，这样类似的；只需要，/loupan即可；这里可以查看页面元素获取;如果下面的不出来，可以尝试把3000=3秒调高一些
    setTimeout(function(){
         var likeLike = "loupan";
    var as = $("a[href*='"+likeLike+"']");
    var strs = "";
console.log(as)
    for(var i=0;i <as.size();i++){
        strs += as.eq(i).attr("href") +"<br>";

    }
       $("body").html(strs)
                         }, 3000);




    // Your code here...
})();