// ==UserScript==
// @name         李文周的博客 添加上一章和下一章切换的功能
// @namespace    maozhi
// @version      1.1
// @description  none
// @author       maozhi
// @match        *://www.liwenzhou.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437746/%E6%9D%8E%E6%96%87%E5%91%A8%E7%9A%84%E5%8D%9A%E5%AE%A2%20%E6%B7%BB%E5%8A%A0%E4%B8%8A%E4%B8%80%E7%AB%A0%E5%92%8C%E4%B8%8B%E4%B8%80%E7%AB%A0%E5%88%87%E6%8D%A2%E7%9A%84%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/437746/%E6%9D%8E%E6%96%87%E5%91%A8%E7%9A%84%E5%8D%9A%E5%AE%A2%20%E6%B7%BB%E5%8A%A0%E4%B8%8A%E4%B8%80%E7%AB%A0%E5%92%8C%E4%B8%8B%E4%B8%80%E7%AB%A0%E5%88%87%E6%8D%A2%E7%9A%84%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
     $("#body").append($("<div id='mz' style='display: none;'></div>"))

    $.ajax({url:"https://www.liwenzhou.com/posts/Go/golang-menu/",success:function(result){
        var element= $(result).children().get(1)
        $("#mz").append(element)
        var pp = $('.post > .post-content').get(1).children;
        var i = selection(pp)
        var last =  pp[i-1].children[0].href
        var next =  pp[i+1].children[0].href
        $(body).append($('<div style="width: 100%;height: 50px;background-color: ivory;position: fixed;top: 0;display: flex;z-index: 1;align-items: center;justify-content: space-between;"><a href="'+last+'" id="last">上一章</a><a href="'+next+'" id="next">下一章</a></div>'))

    }});
    // Your code here...

})();
function selection(pp){
    for(var i = 0;i < pp.length;i++){
        if(pp[i].children.length == 0){
            
        }else{
             //console.log(pp[i].children.length)
           if(pp[i].children.length == 1 && pp[i].children[0].href == window.location.href){
               //console.log(i)
               return i;
           }
            if(pp[i].children.length == 2 && pp[i].children[0].href == window.location.href){
               //console.log(i)
               return i;
           }
        }
    }
}