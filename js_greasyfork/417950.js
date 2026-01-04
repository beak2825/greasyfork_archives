// ==UserScript==
// @name         四川文理视频学习
// @namespace    https://greasyfork.org/zh-CN/users/707063-genexy
// @version      202012051758
// @description  四川文理学院视频课程自动学习，登陆平台后请刷新一次，等待自动开始！
// @author       流浪的蛊惑
// @match        *://*.wdjycj.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417950/%E5%9B%9B%E5%B7%9D%E6%96%87%E7%90%86%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/417950/%E5%9B%9B%E5%B7%9D%E6%96%87%E7%90%86%E8%A7%86%E9%A2%91%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==
var vlist=null,lessonid=null,token=null,tot=0,dqs=0;
function setvlist(data){//提交课程学习进度
    for(let i=0;i<data.length;i++){
        ++tot;
        $.ajax({
            method:"POST",
            url:"http://nbc.wdjycj.com/api/lesson/saveUserHour",
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
        url:"http://nbc.wdjycj.com/api/user/semesterstudyRate",
        dataType:"json",
        contentType:"application/json",
        data:"{\"token\":\""+token+"\",\"host\":\"www.wdjycj.com\"}",
        success:function(e){
            for(let i=0;i<e.data.length;i++){
                for(let j=0;j<e.data[i].lists.length;j++){
                    getvhour(e.data[i].lists[j].id);
                }
            }
        }
    });
}
function getvhour(kcid){
    $.ajax({
        method:"POST",
        url:"http://nbc.wdjycj.com/api/lesson/getLessonHour",
        dataType:"json",
        contentType:"application/json",
        data:"{\"id\":\""+kcid+"\",\"token\":\""+token+"\",\"host\":\"www.wdjycj.com\"}",
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