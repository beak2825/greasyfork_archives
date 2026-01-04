// ==UserScript==
// @name         成都师范学院自学考试学习
// @namespace    https://greasyfork.org/zh-CN/users/707063-genexy
// @version      202112011645
// @description  成都师范学院自学考试视频课程自动学习，登陆平台后请刷新一次，等待自动开始！
// @author       流浪的蛊惑
// @match        *://*.iwdjy.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436389/%E6%88%90%E9%83%BD%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E8%87%AA%E5%AD%A6%E8%80%83%E8%AF%95%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/436389/%E6%88%90%E9%83%BD%E5%B8%88%E8%8C%83%E5%AD%A6%E9%99%A2%E8%87%AA%E5%AD%A6%E8%80%83%E8%AF%95%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==
var vlist=null,lessonid=null,token=null,tot=0,dqs=0;
function setvlist(data){//提交课程学习进度
    for(let i=0;i<data.length;i++){
        ++tot;
        $.ajax({
            method:"POST",
            url:"http://nbv.iwdjy.com/api/lesson/saveUserHour",
            dataType:"json",
            contentType:"application/json",
            data:"{\"hour_id\":\""+data[i].id+"\",\"play_time\":\""+data[i].play_time+"\",\"token\":\""+token+"\",\"host\":\"www.wdjycj.com\"}",
            success:function(e){
                let n=document.getElementsByTagName("h2")[0];
                n.innerText="已学："+(++dqs)+"  加载："+tot ;
            }
        });
    }
}
function getvlist(){//获取所有课程信息
    $.ajax({
        method:"POST",
        url:"http://nbv.iwdjy.com/api/user/studyRate",
        dataType:"json",
        contentType:"application/json",
        data:"{\"token\":\""+token+"\",\"host\":\"chengdushifan.iwdjy.com\"}",
        success:function(e){
            for(let i=0;i<e.data.length;i++){
                getvhour(e.data[i].id);
            }
        }
    });
}
function getvhour(kcid){
    $.ajax({
        method:"POST",
        url:"http://nbv.iwdjy.com/api/lesson/getLessonHour",
        dataType:"json",
        contentType:"application/json",
        data:"{\"id\":\""+kcid+"\",\"token\":\""+token+"\",\"host\":\"chengdushifan.iwdjy.com\"}",
        success:function(e){
            setvlist(e.data.data);
        }
    });
}
(function() {
    'use strict';
    var href=location.href;
    switch(window.location.pathname){
        case "/user-index":
            setInterval(function(){
                if(token==null){
                    let usi=JSON.parse(localStorage.getItem("userInfo"));
                    token=usi.token;//获取访问令牌
                    getvlist();
                }
            },1000);
            break;
    }
})();