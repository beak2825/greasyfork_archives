// ==UserScript==
// @name        v2exBetterReply
// @author      dbw9580
// @namespace   v2ex.com
// @description better reply experience for v2ex
// @include     /^https?:\/\/(\w+\.)?v2ex\.com\/t\//
// @version     2019-11-07
// @grant       GM_log
// @grant       GM_addStyle
// @run-at      document-end
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @supportURL  https://github.com/dbw9580/v2exBetterReply/
// @downloadURL https://update.greasyfork.org/scripts/22606/v2exBetterReply.user.js
// @updateURL https://update.greasyfork.org/scripts/22606/v2exBetterReply.meta.js
// ==/UserScript==

"use strict";
//===========================
// Configuration Section
//
// Set this to true to enable display of comments by blocked users.
// This now only takes effect on comments referenced on the same page,
// due to API restrictions, in multi-page threads, a comment referenced
// on a different page that should be blocked, will still be displayed.
// This may be fixed in future releases.
var SHOW_BLOCKED_REF = false;

// Set this to your preferred max width of the reference preview floating block.
var REF_PREVIEW_WIDTH = "600px";

// Reference marker: the default is "#", change to whatever you like.
var REF_MARKER = "#";

// End of Configuration Section
//===========================

GM_addStyle(".v2exBR-reply-no-target{background-color: #AAAAAA; color: black !important; cursor: pointer; font-weight:bold;}");
GM_addStyle(".v2exBR-cited-comment-view{box-shadow: 0 0 3px rgba(0,0,0,.1); position: absolute; display: none; max-width: "+REF_PREVIEW_WIDTH+";}");
GM_addStyle(".v2exBR-reply-citation{color: #778087; cursor: pointer;} .v2exBR-reply-citation:hover{color: #4d5256; text-decoration: underline;}");
GM_addStyle(".v2exBR-cited-comment-view .fr{display: none;}");

/* insert preview block */
$(document.body).append($("<div class=\"v2exBR-cited-comment-view cell box\" id=\"v2exBR_citation_div\"></div>"));

var API = {};
API.URL = {};
API.URL.topicReply = "https://www.v2ex.com/api/replies/show.json?topic_id=";
API.getTopicReplies = function (topicId) {
    var url = API.URL.topicReply + topicId.toString();
    var result;
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function (data) { result = data },
        error: function () { return },
        async: false,
        // important! to prevent browser caching results returned by api which is vollatile
        cache: false
    });

    return result;
};
API.getTopicReplyIdsInPostedOrder = function (repliesList) {
    var thisReply, i;
    var replyOrderIdMap = [];

    //assume that replies returned by API are already in the order of them being posted
    //simply walk through the array.
    for (i = 0; i < repliesList.length; i++){
        replyOrderIdMap.push(repliesList[i].id);
    }

    return replyOrderIdMap;
};

function markReplyTrueOrder(replyOrderIdMap, repliesDivList) {
    var lastReplyIndex = parseInt($(repliesDivList).find(".no").eq(0).text()) - 1;
    var thisReplyId;
    $(repliesDivList).each(function (index) {
        thisReplyId = this.id.match(/^r_(\d+)/)[1];
        while (thisReplyId != replyOrderIdMap[lastReplyIndex].toString()) {
            if(lastReplyIndex < replyOrderIdMap.length){
                lastReplyIndex++;
            }
            else{
                return true;
            }
        }
        $(this).attr("v2exBR-true-order", 1 + lastReplyIndex++);
    });
}

function adjustFloorNo(repliesDivList) {
    $(repliesDivList).each(function(){
       var thisReplyTrueOrder = $(this).attr("v2exBR-true-order");
        $(this).find(".no").text(thisReplyTrueOrder);
    });
}

function inflatePreviewBlock(reply, previewDiv) {
    var cc = $(commentCells).eq(0).clone();
    $(cc).find("img.avatar").attr("src", reply.member.avatar_normal.replace(/mini/, "normal")); // avatar urls returned by api contain only the mini version
    $(cc).find("strong>a.dark").attr("href", "/member/" + reply.member.username).text(reply.member.username);
    $(cc).find("span.fade.small").filter(function(i, e){return e.innerText.startsWith("♥")}).remove();
    $(cc).find(".ago").text(getRelativeTime(reply.last_modified));
    $(cc).find(".reply_content").html(reply.content_rendered);
    $(previewDiv).html($(cc).html());
    return $(previewDiv);
}

function getRelativeTime(absTime) {
    var now = parseInt(Date.now() / 1000);
    var then = parseInt(absTime);
    var days = Math.floor((now - then) / (3600 * 24));
    var hours = Math.floor((now - then) / 3600)  - days * 24;
    var mins = Math.floor((now - then) / 60) - days * 24 * 60 - hours * 60;

    if (days > 0) {
        return days + " 天前";
    }
    else if (hours > 0) {
        return hours + " 小时 " + mins + " 分钟前";
    }
    else if (mins > 0) {
        return  mins + " 分钟前";
    }
    else {
        return "几秒前";
    }
}

var numCurrentPage = Math.ceil(parseInt($(".no").eq(0).text()) / 100);
var threadUrl = window.location.href.match(/^.+\/t\/\d+/)[0];
var commentCells = $("div.cell, div.inner").filter(function(){
    return this.id.startsWith("r");
});
var topicId = window.location.href.match(/^.+\/t\/(\d+)/)[1];
var repliesList = API.getTopicReplies(topicId);
var replyOrderIdMap = API.getTopicReplyIdsInPostedOrder(repliesList);

var startId = parseInt(commentCells.eq(0).get(0).id.substring(2));
var endId = parseInt(commentCells.eq(-1).get(0).id.substring(2));
var startNo = replyOrderIdMap.indexOf(startId);
var endNo = replyOrderIdMap.indexOf(endId);
var hiddenReplyIds = [];
for (var i = startNo + 1; i < endNo; i++){
    var thisReplyId = replyOrderIdMap[i];
        if ($("#r_" + thisReplyId).length == 0) {
        hiddenReplyIds.push(thisReplyId);
    }
}

/* parse reference */
commentCells.find("div.reply_content")
    .each(function(index){
        var content = $(this).html();
        var replacementSpan = "<span class=\"v2exBR-reply-citation\" v2exBR-commentCellId=\"null\" v2exBR-citedPage=\"0\">";
        content = content.replace(/(?:#|&gt;&gt;)\d+/g, replacementSpan + "$&" + "</span>");
        $(this).html(content);
    });

markReplyTrueOrder(replyOrderIdMap, commentCells);
bindCitationElements(replyOrderIdMap);
adjustFloorNo(commentCells);

/* register floor number functions */
$(".no").hover(function(){
    $(this).addClass("v2exBR-reply-no-target");
}, function(){
    $(this).removeClass("v2exBR-reply-no-target");
}).click(function(e){
    var username = $(this).parent().next().next().children("a").text();
    var commentNo = $(this).text();
    makeCitedReply(username, commentNo);
    //to prevent the vanilla feature provided by v2ex.js to scroll up to the reply
    e.stopImmediatePropagation();
});


$(".v2exBR-reply-citation").hover(function(){
    var self = this;
    var commentCellId = $(self).attr("v2exBR-commentCellId");
    var numCitedPage = parseInt($(self).attr("v2exBR-citedPage"));
    var replyNo = parseInt($(self).attr("v2exBR-order"));

    if (commentCellId === "null") return;
    if (commentCellId === "blocked") {
        $("#v2exBR_citation_div").html("引用的回复被隐藏或来自已屏蔽的用户。")
            .css({
                top:$(self).offset().top,
                left:$(self).offset().left + $(self).width()
            })
            .fadeIn(100);

        return;
    }

    var divPosTopOffset = window.getComputedStyle(self).getPropertyValue("font-size").match(/(\d+)px/)[1];

    inflatePreviewBlock(repliesList[replyNo - 1], $("#v2exBR_citation_div"))
        .css({
            top:$(self).offset().top,
            left:$(self).offset().left + $(self).width()
        })
        .fadeIn(100);
}, function(){
    $("#v2exBR_citation_div").fadeOut(100);
});


$(".v2exBR-reply-citation").click(function(){
    var commentCellId = $(this).attr("v2exBR-commentCellId");
    var numCitedPage = parseInt($(this).attr("v2exBR-citedPage"));
    if (commentCellId === "null" || commentCellId === "blocked") return;

    if(numCitedPage == numCurrentPage){
        $("html, body").animate({
            scrollTop: $("#r_" + commentCellId).offset().top
        }, 500);
    }
    else{
        window.location.href = threadUrl + "?p=" + numCitedPage + "&v2exBR_commentCellId=" + commentCellId;
    }

});

(function(){
    var commentCellId = window.location.href.match(/v2exBR_commentCellId=(\d+)/);
    if (commentCellId != null){
        commentCellId = commentCellId[1];
        $("html, body").animate({
            scrollTop: $("#r_" + commentCellId).offset().top
        }, 500);
    }
})();

function bindCitationElements(replyOrderIdMap){
    $("span.v2exBR-reply-citation").each(function(){
        var replyNo = parseInt($(this).text().match(/(?:>>|#)(\d+)/)[1]);
        var citedCommentCellId = "";
        var numCitedPage = Math.ceil(replyNo / 100);

        citedCommentCellId = replyOrderIdMap[replyNo - 1];
        if (hiddenReplyIds.indexOf(citedCommentCellId) < 0) {
            registerCitation(this, citedCommentCellId, numCitedPage, replyNo);
        }
        else if (SHOW_BLOCKED_REF) {
            registerCitation(this, citedCommentCellId, numCitedPage, replyNo);
        }
        else {
            registerCitation(this, "blocked", numCitedPage, replyNo);
        }

    });
}


function getCommentCellIdFromReplyNo(documentRoot, replyNo){
    var thisReplyNo = documentRoot.find(".no").filter(function () {
        return parseInt($(this).text()) == replyNo;
    });
    if (thisReplyNo.length > 0) {
        return thisReplyNo.parents("div.cell").get(0).id;
    }
    else {
        return "null";
    }
}

function registerCitation(elem, id, numPage, order){
    $(elem).attr("v2exBR-commentCellId", id);
    $(elem).attr("v2exBR-citedPage", numPage);
    $(elem).attr("v2exBR-order", order);
}

function makeCitedReply(username, commentNo){
    var replyContent = $("#reply_content");
    var oldContent = replyContent.val();

    var userTag = "@" + username + " ";
    var commentTag = REF_MARKER + commentNo + " \n";

    var newContent = commentTag + userTag;
    if(oldContent.length > 0){
        if (oldContent != commentTag + userTag) {
            newContent = oldContent + "\n" + commentTag + userTag;
        }
    } else {
        newContent = commentTag + userTag;
    }

    replyContent.focus();
    replyContent.val(newContent);
    moveEnd($("#reply_content"));
}

//copied from v2ex.js in case this script gets executed before v2ex.js
//is loaded
var moveEnd = function (obj) {
    obj.focus();
    obj = obj.get(0);
    var len = obj.value.length;
    if (document.selection) {
        var sel = obj.createTextRange();
        sel.moveStart('character', len);
        sel.collapse();
        sel.select();
    } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
        obj.selectionStart = obj.selectionEnd = len;
    }
}


