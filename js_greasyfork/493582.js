// ==UserScript==
// @name         Hill_Man 自定义脚本
// @namespace    https://greasyfork.org/zh-CN/users/308690-hill-man
// @version      2024-04-27
// @description  工作自用脚本
// @author       You
// @match        https://s200n.chinaemail.cn/webmail7.5/*
// @icon         https://avatar.maxthon.com/v2/users/409449-avatar.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493582/Hill_Man%20%E8%87%AA%E5%AE%9A%E4%B9%89%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/493582/Hill_Man%20%E8%87%AA%E5%AE%9A%E4%B9%89%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 邮箱删除附件时清空邮件主题
    if(location.href.match("https://s200n.chinaemail.cn/webmail7.5/webmail.php\\?r=site")){

        const mutation = new MutationObserver(function(mutationRecoards, observer) {
            console.log("执行")
            window.a = mutationRecoards[0].addedNodes[0];
            window.b = [];
            console.log($(a).find(".uploadifyQueue")[0])
            if ($(a).find(".uploadifyQueue")[0]){
                b[a.id] = new MutationObserver(function(mutationRecoards, observer) {
                    console.log("附件加载完毕");
                    $(a).find(".uploadifyQueue li .removeAttach").each(function(){
                        $(this).after(`&nbsp;&nbsp;&nbsp;&nbsp;<a class="removeAttachAndZT" href="#">删除附件和邮件主题</a>`)
                    });
                    $(".removeAttachAndZT").click(function(){
                        $(this).parent().find(".removeAttach").click();
                        $(a).find("input[name=mail_subject]").val("");
                    })
                    b[a.id].disconnect();
                })
                b[a.id].observe($(a).find(".uploadifyQueue")[0], { attributes: true});
            }

        })
        mutation.observe($("#showArea")[0], { childList: true});
    }
})();