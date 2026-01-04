// ==UserScript==
// @name         百度贴吧回复快速删除
// @namespace    http://xxcc.fun/
// @version      0.1.1
// @description  快速删除[我的i贴吧->我回复的]中的回复，我回复的在-> http://tieba.baidu.com/i/i/my_reply
// @author       chenwuai
// @license      MIT
// @match        http://tieba.baidu.com/i/i/my_reply
// @match        http://tieba.baidu.com/i/i/my_reply?*
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435890/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%9B%9E%E5%A4%8D%E5%BF%AB%E9%80%9F%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/435890/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%9B%9E%E5%A4%8D%E5%BF%AB%E9%80%9F%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var xhr = new XMLHttpRequest();
    var tbs = null
    var enableDeleteDom = true


    function getTBS(){
        $.ajax({
            url:"http://tieba.baidu.com/dc/common/tbs",
            xhrFields: {
                withCredentials: true
            },
            dataType:'json',
            crossDomain: true,
            success:function (data){
                tbs = data.tbs
            }
        })
    }

    function deleteReply(el,tid,pid,tbs){
        $.ajax({
            type:'POST',
            url:"http://tieba.baidu.com/f/commit/post/delete",
            data:{tbs:tbs,tid:tid,pid:pid},
            xhrFields: {
                withCredentials: true
            },
            dataType:'json',
            crossDomain: true,
            success:function (res){
                if(res.err_code == 0){
                    var pa = el.parentElement.parentElement.parentElement
                    $(pa).remove()
                }else if(res.err_code == 220034){
                    $(el).text('达到今日删除上限，请明天再试！！！')
                }else{
                    $(el).text('删除失败,点击重试！')
                }
            },
            error:function(e){
               $(el).text('删除失败,点击重试！')
            }
        })
    }

    function toDeleteReply(el){
        $(el).text('删除中...')
        var tid = el.getAttribute('tid')
        var pid = el.getAttribute('pid')
        getTBS()
        deleteReply(el,tid,pid,tbs)
    }

    function getParams(url){
        let tid = url.match(/\/p\/([0-9]+)/)
        tid = tid && tid[1] || null
        let pid = url.match(/pid=([0-9]+)/)
        pid = pid && pid[1] || null
        let cid = url.match(/cid=([0-9]+)/)
        cid = cid && cid[1] || null

        if (cid && cid != 0) { // 如果 cid != 0, 这个回复是楼中楼, 否则是一整楼的回复
            pid = cid
        }
        return { tid, pid }
    }

    getTBS();

    var replys = document.querySelectorAll('.for_reply_context')
    replys.forEach((reply,index)=>{
        var href = reply.getAttribute('href');
        var replyInfo = getParams(href)
        var br = reply.parentElement.parentElement.getElementsByTagName('h4')[0]
        var str = '<span class="xxcc_quick-delete-reply"'
        str+=' tid="'+replyInfo.tid+'" pid="'+ replyInfo.pid+'"'
        str+=' style="cursor:pointer;margin-left:20px;font-size:12px;color:#dd4f4f;" >快速删除</span>'
        var de = $(str)[0]
        br.append(de)
    })

    $('.xxcc_quick-delete-reply').click(function(){
        toDeleteReply(this)
    })
})();