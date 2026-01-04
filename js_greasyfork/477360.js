// ==UserScript==
// @name         LZTMobileInfinityScroll
// @namespace    MeloniuM/LZT
// @version      0.1
// @description  Включаем бесконечное листание ленты
// @author       MeloniuM
// @license      MIT
// @match        https://zelenka.guru/*
// @match        https://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477360/LZTMobileInfinityScroll.user.js
// @updateURL https://update.greasyfork.org/scripts/477360/LZTMobileInfinityScroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!$('#content.forum_list, #content.forum_view').length) return;

    function setNextPage(href) {
        var nextPageSelector = $('link[rel="next"]');

        if (!nextPageSelector.length) {
            $('<link />').attr('rel', 'next').attr('href', href).appendTo(document.head);
        } else {
            nextPageSelector.attr('href', href);
        }

    }


    //не нашёл как включить скролл, пришлось заменить исходную функцию, чтобы вырезать проверку
    $('.DiscussionList').data('XenForo.LiveForumPages').initInfinityScroll = function() {
        var t = "";
        this.destroyInfinityScroll();
            this.viewMoreButton = ".ForumViewMoreButton";
        var n = {
            path: function() {
                var t = $('link[rel="next"]').attr('href');
                if (t) {
                    "/" !== t[0] && "h" !== t[0] && (t = "/" + t);
                    var n = t.indexOf("?") > 0 ? "&" : "?"
                    , a = t + n + "next_page_loading=1&_xfResponseType=json&_xfToken=" + XenForo._csrfToken;
                    return $(".stickyThreads").is(":visible") || (a += "&_threadFilter=1"),
                        a
                }
            },
            fetchOptions: {
                headers: {
                    "x-requested-with": "XMLHttpRequest"
                }
            },
            responseBody: "json",
            append: !1,
            history: !1,
            scrollThreshold: 800
        };
        let a = $(".PageNav");
        let r = $(".NoResultsFound").hasClass("hidden");
        this.$discussionList.infiniteScroll(n),
            this.$discussionList.on("load.infiniteScroll", (function(n, a) {
            if (!XenForo.hasResponseError(a)) {
                if (!a.templateHtml){
                    $(".AllResultsShowing").removeClass("hidden");
                    this.$discussionList.data("infiniteScroll");
                    this.$discussionList.infiniteScroll("destroy");
                    return $(this.viewMoreButton).hide();
                }
                this.replacePageNav(a.pageNav),
                    a.nextPageHref && t !== a.templateHtml ? (setNextPage(a.nextPageHref), t = a.templateHtml) : ($('link[rel="next"]').remove(), this.destroyInfinityScroll()),
                    this.allResultsShowing(a.nextPageHref),
                    this.insertContent(a)
            }
        }).bind(this))
    }
    $('.DiscussionList').data('XenForo.LiveForumPages').initInfinityScroll();
})();