// ==UserScript==
// @name         河北高考填报志愿辅助工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  河北高考填报志愿辅助工具,免去一个个手工录入,支持从excel中复制粘贴数据.
// @author       You
// @match        https://zy.hebeea.edu.cn:8001/hebgkzy/zytb/tbzy/index*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447171/%E6%B2%B3%E5%8C%97%E9%AB%98%E8%80%83%E5%A1%AB%E6%8A%A5%E5%BF%97%E6%84%BF%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/447171/%E6%B2%B3%E5%8C%97%E9%AB%98%E8%80%83%E5%A1%AB%E6%8A%A5%E5%BF%97%E6%84%BF%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function go()
    {

        var textarea = document.getElementsByName("textarea")[0];
        var lines = textarea.value.split("\n");
        var str = "";
        var Begin=0;
        var T=1;
        for(var i = 0; i < lines.length; i++){
            var sublines = lines[i].split("\t");
            if(sublines.length == 2){
                var a=sublines[0];
                var b=sublines[1];

                var all =document.getElementsByClassName("yxdhInput");
                for(var k = Begin; k < all.length; k++){
                    if(  ! all[k].attributes["disabled"])
                    {
                        Begin=k+1;
                        setTimeout(function(a,k,T){
                            var xueyuan=document.getElementsByClassName("yxdhInput")[k];
                            xueyuan.value = a;
                            $(xueyuan).keyup();},T*500,a,k,T);
                        T++;

                        setTimeout(function(b,k,T){
                            var daihao =document.getElementsByClassName("zydhInput")[k];
                            daihao.value = b;
                            $(daihao).keyup();},T*500,b,k,T);
                        T++;

                        break;
                    }
                }
            }

        }
    }

    setTimeout( function (){

        //textarea.innerHTML = "这是一个textarea";

        var div = document.createElement("div");


        var span = document.createElement("span");
        span.style.width = "600px";
        span.innerText="把从excel中复制的 两列 '院校招生代码'和'专业代码'直接粘贴到下放窗口";
        span.style="background: #f96002;color: #fff;height:30px;width:800px;font-size:15px";

        var textarea = document.createElement("textarea");
        textarea.name = "textarea";
        textarea.rows = 10;
        textarea.style.width = "600px";



        div.append(span);
        div.append(textarea);
        div.style.marginLeft = "20px";
        var btn = document.createElement("button");
        btn.innerText = "点我填入";
        btn.id= "myButton";
        btn.onclick =go;
        btn.style="background: #f96002;color: #fff;height:60px;width:199px;font-size:20px";
        div.append(btn);


        var w = document.getElementsByClassName("common_table")[0]
        w.append(div);




    }
               , 1000 );


    //  w.setAttribute("style","height:120px");//地方有点小,按钮放不下,修改高度


    // Your code here...
})();