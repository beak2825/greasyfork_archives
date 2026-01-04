// ==UserScript==
// @name         取得留言網址
// @description  單純取得留言網址
// @namespace    GetShortCommentUrl - cat412
// @version      0.1
// @author       cat412
// @match        https://forum.gamer.com.tw/C*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/379268/%E5%8F%96%E5%BE%97%E7%95%99%E8%A8%80%E7%B6%B2%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/379268/%E5%8F%96%E5%BE%97%E7%95%99%E8%A8%80%E7%B6%B2%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    NewCommentUrl();

    $("[id*=showoldCommend]").on("click", function(){ OnShowComment(); });
})();

// 打開折疊留言時用
function OnShowComment()
{
    console.log("On Click");
    $(".comment-url").remove();
    setTimeout(function(){ NewCommentUrl(); }, 500);
}

// 生出留言網址
function NewCommentUrl()
{
    console.log("New Comment Url...")
    var comment = $("[id*=Commendcontent]");

    comment.each(function(){
        var node = $(this);
        var addUrlPlace = node.children().children("button");

        // 取得留言 Id
        var idString = node.attr("id");
        var idNumber = idString.substring("Commendcontent_".length, idString.length);

        // 取得文章 Id
        var parentNode = node.parent();
        var parentId = parentNode.attr("id").substring("Commendlist_".length, parentNode.attr("id").length);

        // 取得哈啦板 Id
        var tmp1 = location.search.substring(location.search.indexOf("bsn=") + 4, location.search.length);
        var boradNumber = tmp1.substring(0, tmp1.indexOf("&"));

        var url = location.origin + "/Co.php?bsn=" + boradNumber + "&sn=" + parentId + "#comment" + idNumber;

        addUrlPlace.parent().prepend('<div class="comment-url" style="font-size:8px; float:right;"><a href="' + url + '" target="_blank" style="color:#0089ac;">留言網址</a></div>');
    });
}