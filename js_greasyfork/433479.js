// ==UserScript==
// @name         VK comments blacklist
// @namespace    http://tampermonkey.net/
// @version      0.6.2
// @description  Hides comments from blacklisted users
// @author       Akaky Schmalhausen
// @match        https://vk.com/*
// @icon         https://www.google.com/s2/favicons?domain=vk.com
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/433479/VK%20comments%20blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/433479/VK%20comments%20blacklist.meta.js
// ==/UserScript==

(function(){
var interval = setInterval(function(){
    let vkIsDefined = typeof(vk) !== 'undefined';
    let bodyIsNode = typeof(document.body) == 'object' && document.body.nodeType;
    if(vkIsDefined && bodyIsNode){
        clearInterval(interval);
        start();
    }
},500);

function start() {
    'use strict';
    vk = vk || {};
    const classUfo = 'vkcbl-ufo';
    const classHidden = 'vkcbl-hidden';
    const classHasButton = 'vkcbl-has-button';
    const classButton = 'vkcbl-btn';
    const yourId = vk.id || '';

    var $ = $ || jQuery;
    var blacklist = window.localStorage.getItem('vkBlacklistIds') || '';
    try {
        blacklist = blacklist ? JSON.parse(blacklist) : {};
    } catch (error) {
        convertToJson();
    }


    const button = '<div class="reply_action fl_r '+classButton+'" role="button" onmouseover="showTitle(this, undefined, undefined, {noZIndex: true});" style="background:none"></div>';
    const comment = '<div class = "reply reply_dived clear reply_replieable _post '+classUfo+'"></div>';
    const ufo = '<div style="color:#aaa; margin: 7px 0 7px 44px">НЛО прилетело и оставило здесь эту запись</div>';
    const ufoDeep = '<div style="color:#aaa; margin: 7px 0 7px 44px">Ребята, не стоит вскрывать эту тему. Вы молодые, шутливые...</div>';

    var buttonToBL = $(button)
    .html('🚫')
    .attr("data-title","В ЧС")
    .on("click",function(e){
        let parent = $(e.target).parents('div[id^="post-"]').first();
        let userid = parent.data('answeringId');
        addToBlacklist(userid, false);
        e.stopPropagation();
    });

    var buttonFromBL = $(button)
    .html('🔼')
    .attr("data-title","Убрать из ЧС")
    .on("click", function(e){
        let userid = $(e.target).data('userid');
        forgive(userid);
        e.stopPropagation();
    });

    var buttonUnsee = $(button)
    .html('🤬')
    .attr("data-title","Я пожалел об этом")
    .on("click", function(e){
        let userid = $(e.target).data('userid');
        $("div[data-answering-id='"+userid+"']").removeClass(classHidden);
        addToBlacklist(userid, true)
        e.stopPropagation();
    });

    var buttonShow = $(button)
    .html('👀')
    .attr("data-title","Показать сообщение")
    .on("click", function(e){
        let userid = $(e.target).attr('data-userid');
        let ufo = $(e.target).parents('div.'+classUfo).first()
        let comment = ufo.prev();
        let actions = comment.find('div.post_actions');
        ufo.hide();
        comment.show();
        actions.find('div.'+classButton).remove();
        actions.append(buttonFromBL.clone(true).attr('data-userid',userid));
        if(!blacklist[userid].never){
            actions.append(buttonUnsee.clone(true).attr('data-userid',userid));
        }
        e.stopPropagation();
    });

    function saveToStorage()
    {
        window.localStorage.setItem('vkBlacklistIds', JSON.stringify(blacklist));
    }


    function addToBlacklist(userid, never)
    {
	    blacklist[userid] = {
            "id": userid,
            "blacklisted": true,
            "never": never
        };
	    saveToStorage();
        hideBlacklisted();
    }


	function removeFromBlacklist(userid)
	{
        if(blacklist[userid]){
            delete blacklist[userid];
        }
        saveToStorage();
	}


    function forgive(userid)
    {
		removeFromBlacklist(userid);
        let comment = $("div[data-answering-id='"+userid+"']");
        comment.removeClass(classHidden).show();
        comment.parent().find("div."+classUfo).remove();
        let actions = comment.find('div.post_actions');
        actions.removeClass(classHasButton);
        actions.find('div.'+classButton).remove();
        addButtons();
    }


    function hideBlacklisted()
    {
        for (const [userid, entry] of Object.entries(blacklist)) {
            $("div[data-answering-id='"+userid+"']:not(."+classHidden+")")
            .add($("#pv_box a[data-from-id='"+userid+"']").parents("div[id^='post']:not(."+classHidden+")"))
                .addClass(classHidden)
                .hide()
                .after(
                $(comment).append(
                    $(entry.never ? ufoDeep : ufo)
                    .append(buttonShow.clone(true).attr('data-userid',userid))
                )
            );
        }
    }


    function hideNotifications()
    {
        for (const [userid, entry] of Object.entries(blacklist)) {
            $('div.feedback_row_wrap:has(a[mention_id="id'+userid+'"])').hide();
        }
    }


    function addButtons()
    {
        $("div[data-answering-id='"+yourId+"']").find("div.post_actions").addClass(classHasButton);
        let posts = $("#feed_rows div.post_actions:not(."+classHasButton+")")
          .add("#page_wall_posts div.post_actions:not(."+classHasButton+")")
          .add("#wl_replies_wrap div.post_actions:not(."+classHasButton+")");
        posts.append(buttonToBL.clone(true)).addClass(classHasButton);
    }


    function convertToJson()
    {
        blacklist = blacklist.split(';');
        let converted = {};
        for(let i in blacklist){
            let id = blacklist[i];
            if(id){
                converted[id] = {
                    "id": id,
                    "blacklisted": true,
                    "never": false
                };
            }
        }
        blacklist = converted;
        saveToStorage();
    }


    hideBlacklisted();
    addButtons();

    var obsIds = ["page_body", "wrap3", "page_add_media", "wide_column", "content", "feed_rows", "feed_wall","layer_wrap","layer","wk_layer"];
    var observer = new MutationObserver(function(mrs){
        let newReplies = false;
        for (let mr=0; mr<mrs.length; mr++){
            let tid = mrs[mr].target.id
            if (obsIds.indexOf(tid) >=0 || tid.startsWith('replies')
               ){
                hideBlacklisted();
                addButtons();
                break;
            }
            //else console.log(tid);
        }
    });
    observer.observe(document.body, {childList: true, subtree: true});


    $('body').on('DOMNodeInserted', '#top_notify_wrap', function(e){
        hideNotifications();
    });

}
})();