// ==UserScript==
// @name        时间显示
// @namespace   戈小戈
// @version      0.1.0
// @description  在页面上添加时间，便于了解时间(24小时制)，时间上停留显示日期
// @author       戈小戈
// @include      *.*/*
// @match        *://*
// @require      https://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398976/%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/398976/%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a;
    var x;
    var y;
    var gxg_html = "<div  id='ptime' style='font-size:30px;left:0;top:100px;cursor:pointer;z-index:99999999999999999999;display:block;position:fixed;text-align:center;overflow:visible'></div>";
				$("body").append(gxg_html);
    var mytime = setInterval(function () {
            getTime();
        },100);
        function getTime() {

            var d = new Date();
            var t = d.toLocaleTimeString('chinese',{hour12:false})+'.'+parseInt(Number(d.getMilliseconds('chinese',{hour12:false}))/100);
            document.getElementById("ptime").innerHTML = t;
        }

    $("body").mousemove(function(){
          x=event.pageX;
          y=event.pageY;
        });
    $("#ptime").mousedown(function(){
        a=0;
        var timer = setInterval(function(){
       if(a==0){
          document.getElementById("ptime").style.left=x+'px';
          document.getElementById("ptime").style.top=y+'px';
       }
    $("#ptime").mouseup(function(){
          a=1;
        });
   },0.1)
    });
    var timerr = setInterval(function(){
        var d = new Date();
        document.getElementById("ptime").title=d.toLocaleDateString();
    },1000)
    // Your code here...
})();