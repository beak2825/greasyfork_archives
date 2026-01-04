// ==UserScript==
// @name         PP体育聊天室屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  用户名右键屏蔽
// @author       You
// @match        http://sports.pptv.com/sportslive?sectionid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377674/PP%E4%BD%93%E8%82%B2%E8%81%8A%E5%A4%A9%E5%AE%A4%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/377674/PP%E4%BD%93%E8%82%B2%E8%81%8A%E5%A4%A9%E5%AE%A4%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
var list = new Array();
var name="";
(function() {
    'use strict';
    var interval = window.setInterval(pb, "1000");

    function pb() {
        if (document.readyState == "complete") {
            $(".tab-container:eq(1)").click()
            $(".sus-items").hide();
            //加入右键菜单样式
            $('body').append('<style type="text/css">ul { list-style-type:none; } #div1 { position:absolute; display:none; z-index:99; } #div1 ul { position:absolute; float:left; border:1px solid #979797;background:#f1f1f1; padding:2px; box-shadow:2px 2px 2px rgba(0, 0, 0, .6); width:230px; overflow:hidden; } #div1 ul li { float:left; clear:both; height:24px; cursor:pointer; line-height:24px; white-space:nowrap; padding:0 30px; width:100%; display:inline-block; } #div1 ul li:hover { background:#E6EDF6; border:1px solid #B4D2F6; }</style>');
            //加入右键菜单
            $('body').append('<div id="div1"><ul><li id="add">屏蔽</li></ul></div>');
            $(".chat.tab-go .mCSB_container").css("cursor","pointer")
            $(".chat.tab-go .mCSB_container").on("contextmenu",".chat-infolist.bx",function(ev) {
                var oEvent = ev || event;
                var oDiv = document.getElementById('div1');
                oDiv.style.display = 'block';

                var xy=getMousePos(ev)
                oDiv.style.left = (xy["x"]) + 'px';
                oDiv.style.top = (xy["y"]) + 'px';

                name=$(this).find(".name").text();
                $("#add").text("屏蔽:"+name.replace(": ",""));
                return false;
            });
            $("#add").on("click",function(){
                if(name !=""){
                    list.push(name);
                    console.log("添加了"+name)
                }
            })
            document.onclick=function ()
            {
                var oDiv=document.getElementById('div1');
                oDiv.style.display='none';
            };
            //信息出现
            $(".chat.tab-go .mCSB_container").bind('DOMNodeInserted', function(e) {
                //显示的屏蔽了谁
                var tepName=$(etarget).find(".name").text();
                for(var i=0;i<list.length;i++){
                    if(list[i]==tepName){
                        $(etarget).remove();
                        console.log("屏蔽了"+tepName)
                    }
                }
                // console.log(e.target) //显示信息调试用
            });

            clearInterval(interval);
        }
    }
})();


function do_render(etarget){

}

function getMousePos(event) {

    var e = event || window.event;

    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;

    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;

    var x = e.pageX || e.clientX + scrollX;

    var y = e.pageY || e.clientY + scrollY;

    //alert('x: ' + x + '\ny: ' + y);

    return {
        'x': x,
        'y': y
    };

}