// ==UserScript==
// @name         dmhy block
// @namespace    https://github.com/tautcony
// @license      GPL version 3
// @encoding     utf-8
// @version      0.05
// @date         2017/12/30
// @modified     2018/04/04
// @description  把不想看到的资源从列表中抹去 动漫花园 (share.dmhy.org)
// @author       TautCony
// @match        *://share.dmhy.org/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/36871/dmhy%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/36871/dmhy%20block.meta.js
// ==/UserScript==
var UserBlockList = [
    { id: 693146, keywords: [/2的召[唤喚]/] },
    { id: 585619, keywords: ["浩天个人发布"] },
    { id: 690113, keywords: ["ACG调查小队"] },
    { id: 682194, keywords: ["1928530784"] },
    { id: 707206, keywords: ["wybb"] },
];
var UsernameKeywordBlacklist = [
    "我的狗死了",
    "tlove",
    "公公仔",
    "王伟熊",
];
var CommentContentKeywordBlacklist = [];
RegExp.prototype.toJSON = RegExp.prototype.toString;
var IndexOfTitle = 2;
var IndexOfUserID = 8;
var First = function (array) {
    return array[0];
};
var Last = function (array) {
    return array[array.length - 1];
};
var RemoveTorrentInBlockList = function () {
    var tableList = $("table#topic_list tbody tr");
    tableList.each(function (index, elem) {
        var tds = $(elem).find("td");
        var id = parseInt(Last($(tds[IndexOfUserID]).find("a").attr("href").split("/")), 10);
        var title = First($(tds[IndexOfTitle]).text().trim().split("\n")).trim();
        var url = $(tds[IndexOfTitle]).find("a").attr("href");
        var remove = false;
        for (var _i = 0, UserBlockList_1 = UserBlockList; _i < UserBlockList_1.length; _i++) {
            var user = UserBlockList_1[_i];
            if (id === user.id) {
                remove = true;
            }
            else {
                for (var _a = 0, _b = user.keywords || []; _a < _b.length; _a++) {
                    var keyword = _b[_a];
                    if (title.match(keyword) !== null) {
                        remove = true;
                        break;
                    }
                }
            }
            if (remove) {
                console.warn("Remove \"" + title + "\" because of it was published by or related to " + JSON.stringify(user));
                break;
            }
        }
        if (!remove) {
            for (var _c = 0, UsernameKeywordBlacklist_1 = UsernameKeywordBlacklist; _c < UsernameKeywordBlacklist_1.length; _c++) {
                var keyword = UsernameKeywordBlacklist_1[_c];
                if (title.match(keyword) !== null) {
                    console.warn("Remove \"" + title + "\" because of its title contains keyword=\"" + keyword + "\"");
                    remove = true;
                    break;
                }
            }
        }
        if (remove) {
            console.log("url: https://" + location.hostname + url);
            $(elem).remove();
            return;
        }
    });
};
var RemoveCommentInBlockList = function () {
    var container = document.querySelector("table#comment_recent");
    if (container === null) {
        return;
    }
    window.removeEventListener("scroll", RemoveCommentInBlockList);
    var comments = $("table#comment_recent tbody tr");
    comments.each(function (index, elem) {
        var username = $(elem).find("td.infotable span.username").text().trim();
        var comment = $(elem).find("td.comment_con span:last").text().trim();
        var remove = false;
        if (UsernameKeywordBlacklist.indexOf(username) >= 0) {
            console.warn("Remove following comment because it was sent by \"" + username + "\"");
            remove = true;
        }
        if (!remove) {
            for (var _i = 0, CommentContentKeywordBlacklist_1 = CommentContentKeywordBlacklist; _i < CommentContentKeywordBlacklist_1.length; _i++) {
                var keyword = CommentContentKeywordBlacklist_1[_i];
                if (comment.match(keyword) !== null) {
                    console.warn("Remove following comment because it contains keyword=\"" + keyword + "\"");
                    remove = true;
                    break;
                }
            }
        }
        if (remove) {
            console.log(comment);
            $(elem).remove();
        }
    });
};
if (location.href.indexOf("topics/view") > 0 || location.href.indexOf("comment/list") > 0) {
    window.addEventListener("scroll", RemoveCommentInBlockList);
}
else {
    RemoveTorrentInBlockList();
    $("th.{sorter:.'text'}.header").click(function () {
        setTimeout(RemoveTorrentInBlockList, 500);
    });
}
