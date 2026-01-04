// ==UserScript==
// @name         M-Team show movie by imdb
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在电影页面，只显示在设定的IMDB评分区间的条目
// @author       lemodd@qq.com
// @match        https://pt.m-team.cc/movie.php*
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://unpkg.com/jquery/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/420452/M-Team%20show%20movie%20by%20imdb.user.js
// @updateURL https://update.greasyfork.org/scripts/420452/M-Team%20show%20movie%20by%20imdb.meta.js
// ==/UserScript==

var url = window.location;

//工具条
var tool_bar = $('<div id="tool-bar" style="top:200px;left:0px;position:fixed;float:left;font-size:0.5em">IMDB显示区间</br></div>');
var ul = $('<div></div>');
ul.append("<p style='float:0'>最高分<input id = 'max' size='1' type = 'text' value='9'></input></p>");

ul.append("<p style='float:0'>最低分<input id = 'min' size='1' type = 'text' value='7'></input></p>");

var btn = $('<button type="submit" id="foo" onclick="dosomething()" >保存</button>');

tool_bar.append(ul);

tool_bar.append(btn);

$('body').append(tool_bar);


var f = $('<script>function dosomething(){location.reload();}</script>');

$('head').append(f);


(function(){

    //存储和读取用户选择
    var chk_tag = $("input[id^='chk']");
    $(chk_tag).each(function(){
        GM_log($(this).attr('id'));

        $(this).on("click",function(){
            if($(this).is(':checked')) {
                GM_setValue($(this).attr('id'), "t");
            }else{
                GM_setValue($(this).attr('id'), "f");
            }
            //location.reload();
            //alert("Hello World!");
        });


    });

    for(var i =1;i<=6;i++){
        if(GM_getValue("chk"+i)=='t'){
            $("#chk"+i).attr("checked",true);
        }else{
            $("#chk"+i).attr("checked",false);
        }
    }

    $("#max").val(GM_getValue("max"));

    $("#max").on("input",function(){
        GM_setValue("max",$("#max").val());
        //location.reload();
    });

    $("#min").val(GM_getValue("min"));

    $("#min").on("input",function(){
        GM_setValue("min",$("#min").val());
        //location.reload();
    });

})();


(function() {
    'use strict';
    //var imdb = $("table.torrents tbody tr");
    var items = $("table.torrentname");

    var mark_max = $("#max").val();
    var mark_min = $("#min").val();

    items.each(function(){
        var a_tag = $(this).find("td.embedded a").eq(3);
        var mark = a_tag.text();
        GM_log(mark);
        if(mark !=="" && mark<mark_min || mark> mark_max){
            //$(this).parent().parent().hide();

            $(this).parent().parent().hide();

        }else if(mark>=6 && mark<=6.9){
            $(this).attr("style","color:green");
            $(this).find("a").attr("style","color:green");
            a_tag.attr("style","color:green;font-size:2em");


        }else if(mark>=7 && mark<=7.9){
            $(this).attr("style","color:green");
            $(this).find("a").attr("style","color:green");
            a_tag.attr("style","color:green;font-size:2em");

        }else if(mark>=8 && mark <=8.9){
            $(this).attr("style","color:blue");
            $(this).find("a").attr("style","color:blue");
            a_tag.attr("style","color:blue;font-size:2em");

        }else if(mark>=9){
            $(this).attr("style","color:red");
            $(this).find("a").attr("style","color:red");
            a_tag.attr("style","color:red;font-size:2em");

        }
    });

})();