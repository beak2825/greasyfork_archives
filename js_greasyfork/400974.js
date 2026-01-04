// ==UserScript==
// @name         Mark Reddit Comments Read/Unread (Original)
// @namespace    http://chaossnek.com/MRCRU/
// @version      1.0
// @description  For original reddit (not redesign). Allows you to see and mark which comments on reddit you have read or unread, similar to the inbox. New/Edited comments will always appear unread the first time you see them.
// @author       Vecht
// @match        https://www.reddit.com/r/*
// @require      http://code.jquery.com/jquery-3.5.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/forge/0.9.1/forge.min.js
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/400974/Mark%20Reddit%20Comments%20ReadUnread%20%28Original%29.user.js
// @updateURL https://update.greasyfork.org/scripts/400974/Mark%20Reddit%20Comments%20ReadUnread%20%28Original%29.meta.js
// ==/UserScript==


async function markCommentRead(container, tagline, buttons, commentKey){
    container.css("background", "");
    tagline.css("color", "");
    buttons.append('<li class="mark-unread"><a href="javascript:void(0)">mark unread</li>');
    buttons.find(".mark-unread").click(function(e){
        e.stopPropagation();
        markCommentUnread(container, tagline, buttons, commentKey);
    });
    GM.setValue(commentKey, 1);
}

async function markCommentUnread(container, tagline, buttons, commentKey){
    container.css("background", "#F7F7F7");
    tagline.css("color", "#F54200");
    buttons.find(".mark-unread").remove();
    $(container).click(function(e){
        e.stopPropagation();
        markCommentRead(container, tagline, buttons, commentKey);
        $(container).off("click");
    });
    GM.setValue(commentKey, 0);
}

async function setCommentRead(ele, commentKey){
    var container = $(ele).parent().parent();
    var tagline = $(container).find('.tagline');
    var buttons = $(container).find('.buttons');
    if (container.length == 0 || tagline.length == 0 || buttons.length == 0) return;

    buttons.append('<li class="mark-unread"><a href="javascript:void(0)">mark unread</li>');
    buttons.find(".mark-unread").click(function(e){
        e.stopPropagation();
        markCommentUnread(container, tagline, buttons, commentKey);
    });
}

async function setCommentUnread(ele, commentKey){
    var container = $(ele).parent().parent();
    var tagline = $(container).find('.tagline');
    var buttons = $(container).find('.buttons');
    if (container.length == 0 || tagline.length == 0 || buttons.length == 0) return;

    container.css("background", "#F7F7F7");
    tagline.css("color", "#F54200");
    $(container).click(function(e){
        e.stopPropagation();
        markCommentRead(container, tagline, buttons, commentKey);
        $(container).off("click");
    });
}

$(document).ready(async function(){
    var re = /\/[A-Za-z0-9_]*\/[A-Za-z0-9_]*\/[A-Za-z0-9_]*\/[A-Za-z0-9_]*\/[A-Za-z0-9_]*\//;
    var url_part = window.location.pathname.match(re)[0];
    $.each($('.usertext-body').slice(1), async function(i, ele){
        var md = forge.md.sha256.create();
        md.update($(ele).html());
        var hash = md.digest().toHex();
        var commentKey = url_part + ":" + hash;
        var storedValue = await GM.getValue(commentKey, undefined);
        if (storedValue == null){
            setCommentUnread(ele, commentKey);
            GM.setValue(commentKey, 1);
        }else{
            if (storedValue == 0){
                setCommentUnread(ele, commentKey);
            }else{
                setCommentRead(ele, commentKey);
            }
        }
    });
});