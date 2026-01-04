// ==UserScript==
// @name         jd comments
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  show jd comments
// @author       Hsu
// @match        *://item.jd.com/*
// @match        *://item.yiyaojd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386487/jd%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/386487/jd%20comments.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var my_productId=3560752;

    seajs.use('MOD_ROOT/common/core',function(a){
        console.info(a,a.sku);
        my_productId=a.sku;
        my_nextPage();
    });

    var my_page=0;
    function my_nextPage(){
        $.ajax({
            async:false,
            url: "https://sclub.jd.com/comment/productPageComments.action",
            type: "GET",
            dataType: 'jsonp',
            jsonp: 'callback',
            data: {
                productId:my_productId,
                score:0,
                sortType:6,//5 推荐排序、6 时间排序
                page:my_page,
                pageSize:10,
                isShadowSku:0,
                fold:1
            },
            timeout: 5000,
            beforeSend: function(){

            },
            success: function (json) {
                console.info(json);
                $(json.comments).each(function(index,data){
                    $('#comments').append("<blockquote class=\"site-text layui-elem-quote\">"+
                                          "<span class=\"layui-badge layui-bg-blue\">"+data.nickname+"@"+data.creationTime+"&emsp;有用："+data.usefulVoteCount+"&emsp;评论：<a target=\"_blank\" href=\"https://club.jd.com/repay/"+productId+"_"+data.guid+"_1.html\">"+data.replyCount+"</a></span>"+
                                          "<p>"+data.content+"</p>"+
                                          "</blockquote>");
                    if(data.images){
                        $(data.images).each(function(index,img){
                            $('#comments').append("<img src=\"http:"+img.imgUrl+"\">");
                        });
                    }
                });
                $('#comments').append("<p class=\"layui-word-aux\" style=\"text-align:center;\">----------【"+my_page+"】----------</p>");
            },
            complete: function(XMLHttpRequest, textStatus){

            },
            error: function(xhr){
                alert("请求出错(请检查相关度网络状况.)");
            }
        });
        my_page++;
    }
})();