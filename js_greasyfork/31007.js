// ==UserScript==
// @name         煎蛋工具条（jandan.net)
// @version      0.1
// @description  按照OO数自动排序(无聊图和妹子图),自动翻页，快捷关闭吐槽的按钮和快捷键，鼠标经过播放GIF等功能。
// @description  部分代码参考自 煎蛋助手 cloudwalkerfree@gmail.com
// @author       lemodd@qq.com
// @match        https://jandan.net/*
// @match        http://jandan.net/*
// @namespace    http://jandan.net/
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/31007/%E7%85%8E%E8%9B%8B%E5%B7%A5%E5%85%B7%E6%9D%A1%EF%BC%88jandannet%29.user.js
// @updateURL https://update.greasyfork.org/scripts/31007/%E7%85%8E%E8%9B%8B%E5%B7%A5%E5%85%B7%E6%9D%A1%EF%BC%88jandannet%29.meta.js
// ==/UserScript==

var url = window.location;


//工具条
var tool_bar = $('<div id="tool-bar" style="top:200px;left:0px;position:fixed;float:left;font-size:0.5em">煎蛋工具</br></div>');
var ul = $('<ol></ol>');
ul.append("<li><p style='float:left'><input id='chk1' type='checkbox'>OO排序</input></p></li>");
ul.append("<li><p style='float:left'><input id='chk2' type='checkbox'>自动翻页</input></p></li>");
ul.append("<li><p style='float:left'><input id='chk3' type='checkbox'>OOXX高亮</input></p></li>");
ul.append("<li><p style='float:left'><input id='chk4' type='checkbox'>隐藏OO小于</input></p><input id = 'cnt' size='1' type = 'text' value='100'></input>的帖子</li>");
ul.append("<li><p style='float:left'><input id='chk5' type='checkbox'>快捷关闭吐槽</input></p></li>");
ul.append("<li><p style='float:left'><input id='chk6' type='checkbox'>鼠标经过播放GIF</input></p></li>");


tool_bar.append(ul);

$('body').append(tool_bar);

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
            location.reload();
        });


    });

    for(var i =1;i<=6;i++){
        if(GM_getValue("chk"+i)=='t'){
            $("#chk"+i).attr("checked",true);
        }else{
            $("#chk"+i).attr("checked",false);
        }
    }

    $("#cnt").val(GM_getValue("cnt"));

    $("#cnt").on("input",function(){
        GM_setValue("cnt",$("#cnt").val());
        location.reload();
    });

})();

//快捷关闭吐槽
(function(){
    if($('#chk5').is(':checked')) {}else{return;}

    var ele = $('<span  id="close-tucao"  style="top:300px;left:950px;position:fixed;"><a href="javascript:;">关闭吐槽[S]</a></span>');

    var ch;//记录当前窗口位置
    var flag = true;
    $('body').append(ele);
    ele.hide();
    var tc_btn_id;
    //增加点击吐槽时的方法
    $(".tucao-btn").on("click",function(){
        tc_btn_id = $(this).attr("data-id");
        //记录当前窗口位置，在关闭吐槽时恢复
        if(flag){
            ch = parseInt($(document).scrollTop());
            flag = false;
        }else{
            flag=true;
        }
        ele.show();
    });

    //将mouseover与click两样的功能，鼠标移到吐槽上是等同于点击
    $(".tucao-btn").on("mouseover",function(){
        $(this).click();

    });

    //click和mouseover关闭吐槽
    $("#close-tucao").on("click mouseover",function(){
        $(".tucao-btn").each(function(){
            if($(this).attr("data-id")==tc_btn_id){
                $(this).click();
            }
        });
        ele.hide();
        window.scrollTo(0,ch);

    });


    //关闭吐槽的快捷键
    $(document).keydown(function(event){
        if((event.altKey && event.keyCode == 83)) {
            //在这里接收的是Alt+S事件,S的ASCII码为83。
            $(".tucao-btn").each(function(){
                if($(this).attr("data-id")==tc_btn_id){
                    $(this).click();
                }
            });
            ele.hide();
        }
    });

})();

//OO和XX高亮
(function(){
    if($('#chk3').is(':checked')) {}else{return;}

    $('.tucao-like-container').children().attr('style','color:red');
    $('.tucao-unlike-container').children().attr('style','color:blue');
    $('.tucao-btn').attr('style','color:green');
})();

//按照OO从高到低排序图片/评论
(function(){
    if($('#chk1').is(':checked')) {}else{return;}

    var sorting = new Array();
    var num = $('li[id*="comment"]').size();
    for(var i = 0; i< num; i++){
        sorting[i] = new Array();
        sorting[i][0] = $("div.jandan-vote ").find(".tucao-like-container span").eq(i).text();
        sorting[i][1] = $('li[id*="comment"]').eq(i).attr('id');
    }

    sorting.sort(function(a,b){
        return b[0] - a[0];
    });

    for(var i = 0; i< num; i++){
        $('.commentlist').append($('li[id='+sorting[i][1]+']'));
    }
})();

//隐藏oo小于100的

(function(){
    if($('#chk4').is(':checked')) {}else{return;}

    var th = $("#cnt").val();
    GM_log(th);
    //如果是首页则将标准降低一半
    if(url == "http://jandan.net/pic"){th=th/2;}
    var lis = $('li[id*="comment"]');
    lis.each(function(){
        var num = $(this).find("div.jandan-vote span span").eq(0).text();
        //GM_log(num);
        if(num<parseInt(th)){
            $(this).hide();
        }
    });
})();


//防止排序后图片不加载
(function(){
    window.scrollBy(0,10);
    window.scrollBy(0,-10);
})();

//窗口滚动到底时自动翻页
(function(){
    if($('#chk2').is(':checked')) {}else{return;}

    // 固定一个标签显示当前页面位置
    //$('body').append('<span id="lb2" style="top:130px;left:0px;position:fixed;"></span>');
   // $('body').append('<span id="lb"  style="top:100px;left:0px;position:fixed;"></span>');

    //窗口滚动到底时自动翻页
    $(document).scroll(function(){
        //当前高度
        var ch = parseInt($(document).scrollTop());
        $("#lb").text(ch);
        //总高度
        var h =$(document).height()- $(window).height() ;
        //alert(h);
        $("#lb2").text(h);

        //如果当前高度大于总高度，就自动翻页
        if (ch>=h-2){
            //翻页
            $('.previous-comment-page').get(0).click();

        }
    });

})();

//对于gif不必点击，鼠标经过即可播放
(function(){
    if($('#chk6').is(':checked')) {}else{return;}

    var gif_tag=$(".gif-mask");
    gif_tag.each(function(){
        $(this).on("mouseover",function(){
            $(this).click();
        });
    });
})();