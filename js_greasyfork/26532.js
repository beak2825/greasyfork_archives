// ==UserScript==
// @name         Dopekeys Steam Giveaway Viewer
// @namespace    http://steamcn.com/t238687-1-1
// @version      1.0.1
// @description  A script for dopekeys.com to complete tasks automatic.
// @author       Kaoyu
// @match        http://dopekeys.com/giveaway/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26532/Dopekeys%20Steam%20Giveaway%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/26532/Dopekeys%20Steam%20Giveaway%20Viewer.meta.js
// ==/UserScript==

var nonce = $(".pagevisit-link").attr("data-nonce");
var i = 0, errNum = 0, failNum = 0;
var pass=function(){
    var tid = $(this).data('id');
    var pid = $(this).data('event');
    if($(this).parents('.panel').find(".panel-heading a").hasClass('done')) return;
    var origin = $(this);
    if(nonce == null || pid == null) return;
    setTimeout(function() {
        $.ajax({
            url: "http://dopekeys.com/wp-admin/admin-ajax.php",
            type: 'POST',
            data: {
                action: 'savetask',
                tid : tid,
                pid : pid,
                nonce : nonce
            },
            error: function() {
                i--;
                errNum++;
                alert(errNum + "个提交失败,可能是服务器繁忙,或脚本失效");
            },
            success: function(respond) {
                i--;
                if(respond.MsgCode == '1' && respond.data.q_result){
                    origin.parents('.panel').find(".panel-heading a").addClass('done');
                    origin.addClass('disabled');
                } else {
                    failNum++;
                    alert(failNum + "个未通过验证,脚本可能失效,或请稍后再试");
                }
            },
        })
    }, 5000*i);
    i++;
};
if(nonce == null) {
    $.ajax({
        url: "http://dopekeys.com/giveaway/woodle-tree-2-or-a-detectives-novel/",
        success: function(html) {
            nonce = $(html).find(".pagevisit-link").attr("data-nonce");
            if(nonce == null) {
                alert("脚本可能失效,或请稍后再试");
            } else {
                $("[data-event]:not(.disabled)").each(pass);
                $("[data-event]:not(.disabled)").mouseover(pass);
            }
        }
    });
} else {
    $("[data-event]:not(.disabled)").each(pass);
    $("[data-event]:not(.disabled)").mouseover(pass);
}
