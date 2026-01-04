// ==UserScript==
// @name         哔哩哔哩-显示评论链接
// @namespace    ckylin-bilibili-show-comments-links
// @version      0.1
// @description  显示每一个评论的链接
// @author       CKylinMC
// @match        https://*.bilibili.com/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/406386/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9-%E6%98%BE%E7%A4%BA%E8%AF%84%E8%AE%BA%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/406386/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9-%E6%98%BE%E7%A4%BA%E8%AF%84%E8%AE%BA%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    if(window.jQuery){
        var $ = window.jQuery;
    }
    function CK_showLink(e){
        if(e==null)return;
        var commentContainer = $(e.target).parents(".reply-wrap");
        if(commentContainer.length<1) {console.error("Not a comment: ",commentContainer);return false};
        var commentid = commentContainer.attr('data-id');
        prompt("该评论地址：",location.origin + location.pathname+"#reply"+commentid);
    }
    function CK_addLink(e){
        if(e==null)return;
        var commentContainer = $(e.target).parents(".reply-wrap");
        if(commentContainer.length<1) {console.error("Not a comment: ",commentContainer);return false};
        var commentid = commentContainer.attr('data-id');
        console.log(commentid);
        var existedCheck = document.querySelector("#ckcommentlink"+commentid);
        if(existedCheck) return;
        //if(existedCheck) existedCheck.remove();
        var info = $(e.target).parents(".reply-wrap")[0].querySelector('div.info');
        var reply = info.querySelector('reply');
        var like = info.querySelector('.like');
        var newBtn = document.createElement('span');
        newBtn.id="ckcommentlink"+commentid;
        newBtn.className = "btn-hover btn-highlight";
        newBtn.innerHTML = "查看链接";
        newBtn.onclick = (e)=>{CK_showLink(e)};
        info.insertBefore(newBtn,reply);
    }

    function CK_hookComments(){
        console.log("StartHook");
        $('div.list-item.reply-wrap[ck-addlink!="true"]').mouseover((e)=>{CK_addLink(e)}).attr('ck-addlink','true');
    }
    function CK_tryHookComments(){
        console.log("TryHook");
        if(document.querySelector('.comment-list')){
            $('.comment-list').mouseenter((e)=>{
                CK_hookComments();
            });
            CK_hookComments();
            console.log("HookOK");
            clearInterval(ck_hookloop);
        }
    }
    var ck_hookloop;
    function CK_initHookComments(){
        ck_hookloop = setInterval(CK_tryHookComments,2000);//每两秒检查一次
    }
    //CK_startHookComments();
    setTimeout(CK_initHookComments,8000);//8秒，考虑网络慢的环境
})();