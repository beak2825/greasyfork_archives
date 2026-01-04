// ==UserScript==
// @name         易班刷评论添加版
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  用于易班刷评论的
// @author       mfy
// @match        https://q.yiban.cn/app/index/appid/*
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394024/%E6%98%93%E7%8F%AD%E5%88%B7%E8%AF%84%E8%AE%BA%E6%B7%BB%E5%8A%A0%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/394024/%E6%98%93%E7%8F%AD%E5%88%B7%E8%AF%84%E8%AE%BA%E6%B7%BB%E5%8A%A0%E7%89%88.meta.js
// ==/UserScript==

$(function(){
    var yy = "经管加油，易班加油，大家元旦快乐啊！！！"                 // 这里是固定评论的内容，根据自己需要修改
    var arr = ["床前明月光","疑似地上霜","举头望明月","低头思故乡"]    // 这里是顺序和随机评论的内容，根据自己需要修改
    var num = 1             // 这里是控制固定评论、顺序评论和随机评论的，默认1是固定评论  ， 2是顺序评论，3或其他数字是随机评论。
    var p_time = 6000       //  控制评论速度的，6000=6秒。由于网页限制，这里设置不应低于6000



    var iLen = arr.length
    var i = 0
    function my(){
        $("textarea").val(yy)
        $(".comment-submit").attr('id','new_id')
        $("button#new_id").click()
        console.log($("textarea").val())
    }
    function order_con(){

        $("textarea").val(arr[i])
        i++;
        if (i == arr.length)
        {
            i = 0;
        }
        $(".comment-submit").attr('id','new_id')
        $("button#new_id").click()
    }


    // 随机评论
    function random_con(){
        var str_con = Math.floor((Math.random()*iLen));
        $("textarea").val(arr[str_con])
        console.log(arr[str_con])
        i++;
        if (i == arr.length)
        {
            i = 0;
        }
        $(".comment-submit").attr('id','new_id')
        $("button#new_id").click()
    }


    if (num == 1) {
        setInterval(my,p_time)
    }
    else if (num == 2){
        setInterval(order_con,p_time)
    }
    else{
        setInterval(random_con,p_time)
    }
})