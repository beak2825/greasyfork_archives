// ==UserScript==
// @name         奥鹏网络课程视频自动播放程序
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  奥鹏网络课程视频自动播放程序 自动播放
// @author       You
// @match        http://learn.open.com.cn/StudentCenter/CourseWare/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397001/%E5%A5%A5%E9%B9%8F%E7%BD%91%E7%BB%9C%E8%AF%BE%E7%A8%8B%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E7%A8%8B%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/397001/%E5%A5%A5%E9%B9%8F%E7%BD%91%E7%BB%9C%E8%AF%BE%E7%A8%8B%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E7%A8%8B%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var check = setInterval(main, 250);

    function main() {
        if (window.require == null || window.jQuery == null) { return; };
        clearInterval(check);
        // 这里执行比较快，需要延迟执行
        setTimeout(listtree, 5000);

    }
    function listtree(){
      var halftree = $("li.resource").children("i.half_play");
      if(halftree.length!=0){
          $(halftree[0]).siblings("a").click();
          $("div #outter").click();
         return false;
      }else{
        var ultree = $("li.resource").children("i.not_play");
        var a = $(ultree[0]).siblings("a");
        $(ultree[0]).siblings("a").click();
       $("div #outter").click();
      }
      colse();
    }
    var loop;
    function colse(){
       loop=setInterval(function(){
            //视频时长
           var time=$('.duration').text();
           if(time !==undefined && time !=''){
            console.log("get time"+time)
            time = time.split(':')
            console.log(time)
            clearInterval(loop);
            console.log(time[0]*60*1000+60*1000)
            setTimeout(function(){
              listtree();
            }, time[0]*60*1000+60*1000);
           }
            console.log()
        }, 3000);

    }
})();