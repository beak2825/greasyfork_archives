// ==UserScript==
// @name         jandan助手2
// @version      0.8
// @description  按照OO数自动排序(无聊图和妹子图),增加翻页快捷键,隐藏评论数量超过设定的用户的留言（不看吵架）
// @author       cloudwalkerfree@gmail.com
// @match        https://jandan.net/*
// @match        http://jandan.net/*
// @match        http://www.gaoloumi.com/
// @match        https://kindleren.com/
// @namespace    http://jandan.net/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30652/jandan%E5%8A%A9%E6%89%8B2.user.js
// @updateURL https://update.greasyfork.org/scripts/30652/jandan%E5%8A%A9%E6%89%8B2.meta.js
// ==/UserScript==

//0.8 增加关闭吐槽的按钮和快捷键
//有些吐槽太长了，看到一半不想看了，还必须一直往下翻或者回去关掉，不方便。
//这个功能可以随时关闭上一个打开的吐槽

//关闭长吐槽
(function(){
    var ele = $('<span  id="close-tucao"  style="top:360px;left:0px;position:fixed;"><a href="javascript:;">关闭吐槽[S]</a></span>');
    var ch;//记录当前窗口位置
    var flag = true;
    $('body').append(ele);
    ele.hide();
    var tc_btn_id;
    $(".tucao-btn").on("click",function(){
        tc_btn_id = $(this).attr("data-id");
        //记录当前窗口位置，在关闭吐槽时恢复
        if(flag){
            ch = parseInt($(document).scrollTop());
            flag = false;
        }else{
            flag=true;
        }
        //alert(ch);
        ele.show();
    });

    $("#close-tucao").on("click",function(){
        $(".tucao-btn").each(function(){
            if($(this).attr("data-id")==tc_btn_id){
                $(this).click();
            }
        });
        ele.hide();
        window.scrollTo(0,ch);

    });




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


//主页是否排序：false为不排序，true为排序
var isMainPaageRank = true;
//如果一个用户的留言超过设定次数，即隐藏其留言
var CommentsDeleteMaxLevel = 3;
var curserStyle = "style=\"cursor: pointer; display: inline;background-color: #DEDEDE; border-radius: 20px; bottom: 50%; color: #ffffff; display: block; float: left; font-size: 26px; margin-left: -10%; padding-bottom: 5px; position: fixed; text-align: center; width: 40px; z-index: 13;\"";

//OO和XX高亮
(function(){
    //alert(window.location.href);
    //$('.comment-like').attr('style','color:red');
    $('.comment-like').attr('style','color:green');
    $('.comment-unlike').attr('style','color:blue');
    //new
    $('.tucao-btn').attr('style','color:#ff0011');

})();

//按照OO从高到低排序图片/评论
(function(){
    var sorting = new Array();
    var num = $('li[id*="comment"]').size();
    //alert(num);
    for(var i = 0; i< num; i++){
        sorting[i] = new Array();
        sorting[i][0] = $('.jandan-vote').find('span:first').eq(i).text();
        sorting[i][1] = $('li[id*="comment"]').eq(i).attr('id');
    }

    sorting.sort(function(a,b){
        return b[0] - a[0];
    });


    //隐藏OO小于m的图片
    var m;
    var jd_url = window.location.href;
    if(jd_url.indexOf("ooxx")>0){
        m=100;
    }else{
        m=100;
    }

    for(var i = 0; i< num; i++){
        var mark =sorting[i][0] ;
        if(mark>m){
            $('.commentlist').append($('li[id='+sorting[i][1]+']'));
        }else{
            //隐藏00数小于指定值的图片
            $('li[id='+sorting[i][1]+']').hide();
        }
    }


    // 固定一个标签显示当前页面位置
    // $('body').append('<span id="lb2" style="top:130px;left:100px;position:fixed;"></span>');
    // $('body').append('<span id="lb" style="top:100px;left:100px;position:fixed;"></span>');

})();

/*在auto page down 脚本中实现，此处不在启用
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
       // $('.current-comment-page').eq(0).next().get(0).click();
        //翻页
        $('.previous-comment-page').get(0).click();
    }
});
*/


//按照zan从高到低排序文章
(function(){
    if(isMainPaageRank){
        var sorting = new Array();
        var num = $('.list-post').size();
        for(var i = 0; i< num; i++){
            sorting[i] = new Array();
            sorting[i][0] = $('.list-post').eq(i).find('.zan-icon').text().replace(/[^0-9]/g,'');
            sorting[i][1] = $('.list-post').eq(i).find('.thumbs_b').find('a').attr('href');
        }

        var sorting = sorting.sort(function(a,b){
            return b[0] - a[0];
        });

        for(var i = 0; i< num; i++){
            $('#content').append($('.list-post').filter(function(){if($(this).find('.thumbs_b').find('a').attr('href') == sorting[i][1]){return true;}}));
        }

        $('#content').append($('.wp-pagenavi'));
    }
}
)();


//防止排序后图片不加载
(function(){
    window.scrollBy(0,10);
    window.scrollBy(0,-10);
})();


