// ==UserScript==
// @name         pixiv收藏整理④添加标签并保存
// @namespace    http://your.homepage/
// @version      0.1
// @description  enter something useful
// @author       You
// @match        https://www.pixiv.net/bookmark_add.php?type=illust&illust_id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32700/pixiv%E6%94%B6%E8%97%8F%E6%95%B4%E7%90%86%E2%91%A3%E6%B7%BB%E5%8A%A0%E6%A0%87%E7%AD%BE%E5%B9%B6%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/32700/pixiv%E6%94%B6%E8%97%8F%E6%95%B4%E7%90%86%E2%91%A3%E6%B7%BB%E5%8A%A0%E6%A0%87%E7%AD%BE%E5%B9%B6%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //alert("Hello World");
    //document.write("Hello World");
    // Your code here...
    
    //1、获取图片所有的标签，并连接成字符串
    var div21 = document.getElementsByClassName('recommend-tag');
    var div22 = div21[0].childNodes[1].childNodes;
    var tag_set = [];
    for (var i = 0; i < div22.length; i++) {
        var string_tag = div22[i].innerText;
        
        var first = string_tag.indexOf("*");
        var second = string_tag.indexOf("users");
        if (second == -1) {
            if (first == 0) {
                string_tag = string_tag.substring(1);
            }
            tag_set += string_tag + " ";
        } else {
        }
    }
    tag_set = tag_set.substring(0, tag_set.length - 1);
    
    //2、将字符串填入input中，并保存
    var div31=document.getElementById('input_tag');
    div31.value=tag_set;
    var button_submit=document.getElementsByClassName('_button-large')[0];
    button_submit.click();
    
})();