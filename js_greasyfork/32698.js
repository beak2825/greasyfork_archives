// ==UserScript==
// @name         pixiv收藏整理②未分类列表
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        https://www.pixiv.net/bookmark.php?untagged=*
// @match        https://www.pixiv.net/bookmark.php?untagged=1&rest=show&p=*
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js  
// @downloadURL https://update.greasyfork.org/scripts/32698/pixiv%E6%94%B6%E8%97%8F%E6%95%B4%E7%90%86%E2%91%A1%E6%9C%AA%E5%88%86%E7%B1%BB%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/32698/pixiv%E6%94%B6%E8%97%8F%E6%95%B4%E7%90%86%E2%91%A1%E6%9C%AA%E5%88%86%E7%B1%BB%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //alert("Hello World");
    //document.write("Hello World");
    // Your code here...
    
    var div01 = document.getElementsByClassName('display_editable_works');
    var div02 = div01[0].childNodes;
    var div03 = div02[0].childNodes;
    if (div03.length>0){
        for(var i=2;i<div03.length;i++){
            var image0 = div03[i];
            var href1 = image0.getElementsByTagName("a")[1];
            if (href1!=null){
                var url1 = href1.href;
                window.location.href = url1;
                break;
            }else{
                //alert("找不到图片地址！可能是因为已删除！");
            }
        }
    }else{
        alert("全部处理完毕！");
    }
})();