// ==UserScript==
// @name         修改小米论坛回复框
// @namespace    https://www.44886.com/
// @version      0.1
// @description  小米论坛原有的回复框是用iframe来显示，本脚本的功能是将它换成普通的评论框。
// @author       44886.com
// @match        http://bbs.xiaomi.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387230/%E4%BF%AE%E6%94%B9%E5%B0%8F%E7%B1%B3%E8%AE%BA%E5%9D%9B%E5%9B%9E%E5%A4%8D%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/387230/%E4%BF%AE%E6%94%B9%E5%B0%8F%E7%B1%B3%E8%AE%BA%E5%9D%9B%E5%9B%9E%E5%A4%8D%E6%A1%86.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $("#edui1_iframeholder").html("").attr("contenteditable", "true");
    $("#J_reply").before('<span class="btn J_reply_44886" id="J_reply_44886">使用44886回复</span>');
    $("#J_reply").remove();
    var adds=[
        '<A href="https://www.44886.com/forum-1.htm#中小学优秀作文免费下载" title="中小学优秀作文免费下载" style="text-decoration:underline;color:#fff;"><span style="color:rgb(255,255,255);">中小学优秀作</span></a>',
        '<a href="https://www.44886.com/forum-7.htm#老师必须要掌握的办公技巧教学视频" title="老师必须要掌握的办公技巧教学视频" style="text-decoration:underline;color:#fff;"><span style="color:rgb(255,255,255);">老师必须要掌握的办公技巧教学视频</span></a>',
        '<a href="https://www.44886.com/forum-2.htm#2019部编教材配套教案课件免费下载" title="2019部编教材配套教案课件免费下载" style="text-decoration:underline;color:#fff;"><span style="color:rgb(255,255,255);">2019部编教材配套教案课件免费下载</span></A>',
        '<A href="https://www.44886.com/#中小学语文教学资源免费下载" title="教学资源社区" style="text-decoration:underline;color:#fff;"><span style="color:rgb(255,255,255);">教学资源社区</span></a>',

    ];
    setTimeout(function () {
        $(".J_reply_44886").click(function () {
            var text = $("#edui1_iframeholder").html();
            text = "<p>" + text + '</p><p>'+adds[Math.floor((Math.random()*adds.length))]+'</p>';
            $.ajax({
                url: "http://bbs.xiaomi.cn/post/add",
                method: "POST",
                data: "tid=" + tid + "&fid=" + fid + "&message=" + text + "&token=",
                dataType:"json",
                success: function (res) {
                    if(res.header.code==400000){
                        location.reload();
                    }else{
                        alert(res.header.desc);
                    }
                },
                error: function () {
                    alert('回复出错！');
                }
            });
        });
    }, 100);

})();