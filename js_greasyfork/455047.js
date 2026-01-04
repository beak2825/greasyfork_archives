// ==UserScript==
// @name         NoSoloedComments
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Very crude way of hiding comments that contain the word "soloed" on Wowhead.com
// @author       ZyleneIT
// @license MIT
// @match        https://www.wowhead.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455047/NoSoloedComments.user.js
// @updateURL https://update.greasyfork.org/scripts/455047/NoSoloedComments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var _fn = function(e, t, a) {
        var s = $("<div></div>");
        var o = !this.alternateVersions && e.__minPatch && (e.__minPatch.substr(0, 1) != "-" && e.__minPatch > new Date(e.date) || e.__minPatch.substr(0, 1) == "-" && e.__minPatch != "-" + e.dataTree);
        e.locale = this.id == "english-comments" ? LOCALE_ENUS : Locale.getId();
        s.append('<table><tr><td class="vote-column">' + '<p class="upvote"><span class="fa fa-chevron-up"></span></p><div class="rating-container"></div><p class="downvote"><span class="fa fa-chevron-down"></span></p><p class="comment-sticky" title="' + WH.TERMS.stickycomment_tip + '">STICKY</p>' + '</td><td class="comment-content-column">' + '<div class="comment-header"><table><tr><td class="comment-author"></td><td class="comment-controls"></td><td class="comment-notification"></td></tr></table></div>' + '<div class="text comment-body" lang="' + Locale.getCode(e.locale) + '"></div>' + '<div class="comment-replies"></div>' + '<p class="comment-replies-control" style="display: none"></p>' + "</td></tr></table>");
        e.colorClass = "comment" + a % 2;
        s.addClass("comment").addClass(e.colorClass);
        if (e.rating < WH.Comments.LOW_RATING_THRESHOLD) {
            s.addClass("comment-very-low-rating")
        }
        if (e.deleted) {
            s.addClass("comment-deleted")
        }
        if (e.outofdate) {
            s.addClass("comment-outofdate")
        }
        e.container = s;
        e.voteCell = s.find(".vote-column");
        e.commentCell = s.find(".comment-content-column");
        e.repliesCell = s.find(".comment-replies");
        e.repliesControl = s.find(".comment-replies-control");
        e.headerCell = s.find(".comment-header");
        e.commentBody = s.find(".comment-body");
        e.commentAuthor = s.find(".comment-author");
        e.commentControls = s.find(".comment-controls");

        this.template.updateVoteCell.call(this, e);
        this.template.updateCommentCell.call(this, e);
        this.template.updateStickyStatus.call(this, e);
        this.template.updateReplies.call(this, e);
        if (e.deleted || e.rating < WH.Comments.LOW_RATING_THRESHOLD) {
            e.headerCell.bind("click", (function () {
                e.container.toggleClass("comment-expanded")
            }))
        }
        var r = $(t);
        r.addClass("comment-wrapper").html(s);
        if (e.imported) {
            var n = WH.ce("span", {
                className: "comment-author-source-imported",
                dataset: {
                    importedSite: e.user
                }
            });
            var i = WH.ce("span", {
                className: "comment-author-source-imported-title"
            }, WH.ct(e.user));
            n.innerHTML = WH.TERMS.fromSite_format.replace("%s", i.outerHTML);
            e.commentAuthor.prepend(n);
            t.classList.add("comment-wrapper-imported")
        }

        // Filtering comments that contains specific keywords
        if (["soloed"].some(function(v){return e.commentBody.text().toLowerCase().indexOf(v)>=0;})){o=1}

        if (o) {
            r.hide()
        } else {
            r.show()
        }
    }
    if(Listview){
        Listview.templates.comment.compute = _fn;
    }
})();