// ==UserScript==
// @name         FB SETOOLS
// @namespace    http://greasyfork.org/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.facebook.com/*
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/32994/FB%20SETOOLS.user.js
// @updateURL https://update.greasyfork.org/scripts/32994/FB%20SETOOLS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("it's ok");
    var div = document.createElement('div');
    var chat_go_up;
    var load_page;
    $(div).html("").css({
        width : '150px',
        position : 'fixed',
        top : '30px',
        left : '0px',
        border : '1px dotted silver',
        padding : '15px 5px 5px',
        background : 'rgba(255, 255, 255, 0.8)',
        textAlign : 'center'
    }).appendTo("body");
    $("<button></button>").html("聊天上滚").on("click",function(){
        function goup(){
            jQuery(".uiScrollableAreaWrap").scrollTop(0);
            console.log("goup");
        }
        chat_go_up=setInterval(goup,2000);
    }).appendTo(div);
    $("<button></button>").html("停止上滚").on("click",function(){
        clearInterval(chat_go_up);
    }).appendTo(div);

    $("<button></button>").html("自动加载页面").on("click",function(){
        load_page=setInterval(function(){
            $("body").scrollTop($("body")[0].scrollHeight);
        },1000);
    }).appendTo(div);

    $("<button></button>").html("停止加载").on("click",function(){
        clearInterval(load_page);
    }).appendTo(div);
    $("<button></button>").html("统计信息").on("click",function(){
        alert(getinfo());
    }).appendTo(div);
    $(div).append("</br>");
    $("<button></button>").html("清理多余项").on("click",function(){
        $("._1vc-").remove();
        $("._5nb8").css("width","fit-content");
        $(".UFIRow._4oep._2o9m").remove();
    }).appendTo(div);
    function getinfo(){
        var thename="姓名:"+$("#fb-timeline-cover-name").text()+"\n";
        var haoyou="好友:"+$("span._50f8._50f4").text()+"\n";
        var step_info=step_info();
        $("._5pcq").each(function(i,c){
            var href = $(c).attr("href");
            if (href.search("permalink.php")>0){
                var id = href.substr(href.search("&id=")+4,255);
            }
        });
        return thename+haoyou+step_info;
    }
    function stepinfo(){
        var link=location.href;
        if (link.search("permalink.php")>0){
            $.get(link+"&sk=about",function(data){
                console.log(data);
            });
        }
    }
})();