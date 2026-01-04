// ==UserScript==
// @name         pixiv收藏整理③图片详情
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        https://www.pixiv.net/member_illust.php?mode=medium&illust_id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32699/pixiv%E6%94%B6%E8%97%8F%E6%95%B4%E7%90%86%E2%91%A2%E5%9B%BE%E7%89%87%E8%AF%A6%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/32699/pixiv%E6%94%B6%E8%97%8F%E6%95%B4%E7%90%86%E2%91%A2%E5%9B%BE%E7%89%87%E8%AF%A6%E6%83%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //alert("Hello World");
    //document.write("Hello World");
    // Your code here...
    
    //自动向下滚动一屏
    for (var i = 0; i < 650; i = i + 1) {  //定义变量I表示纵坐标的值
        parent.scroll(1, i);
    }
    
    var div11 = document.getElementsByClassName('bookmark-container');
    if (div11.length!=0){
        var div12 = div11[0].childNodes;
        var url2 = div12[1].href;
        window.location.href = url2;
    }else{
        alert("发生了错误！\n由于作品的公开设置所限，您无法浏览该作品");
    }
})();