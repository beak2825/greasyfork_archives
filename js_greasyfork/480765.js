// ==UserScript==
// @name         哔哩哔哩视频列表增强
// @version      250625.1
// @description  修改视频合集长度_直播界面_评论区间隔
// @author       未完待笑(UnfiniSmile)
// @copyright    2025, UnfiniSmile (https://github.com/UnfiniSmile)
// @match        https://*.bilibili.com/*
// @grant        GM_addStyle
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/480765/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E5%88%97%E8%A1%A8%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/480765/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E5%88%97%E8%A1%A8%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function videoComment(observer) {

        function tryObserve(root) {
            if (root) {
                observer.observe(root, {
                    childList: true,
                    subtree: true,
                })
            }
        }

        const comments = document.getElementsByTagName("bili-comments");
        for (const comment of comments) {
            const feed = comment?.shadowRoot?.children?.contents?.children?.feed;

            tryObserve(comment?.shadowRoot);

            if (!feed) {
                return;
            }
            for (const commentStack of feed.children) {
                const mainComment = commentStack.shadowRoot.children.comment;
                const replies = commentStack.shadowRoot.children?.replies;
                const roots = [];

                tryObserve(commentStack.shadowRoot);

                if (mainComment) {
                    roots.push(mainComment.shadowRoot);
                }

                if (replies) {
                    tryObserve(replies.children[0].shadowRoot);
                    for (const reply of replies.children[0].shadowRoot.querySelectorAll("bili-comment-reply-renderer")) {
                        roots.push(reply.shadowRoot)
                    }
                }
                for (const root of roots) {
                    tryObserve(root);
                }
            }
        }

    function queryShadowRoots(element, selectors) {
        let current = element;
        for (const selector of selectors) {
            if (!current) return null;
            current = current.shadowRoot ? current.shadowRoot.querySelector(selector) : current.querySelector(selector);
        }
        return current;
    }

    function commentStyles(root = document) {
        const biliCommentsList = root.querySelectorAll("bili-comments");
        if (!biliCommentsList.length) return;

        for (const biliComments of biliCommentsList) {
            const threadRenderers = biliComments.shadowRoot?.querySelectorAll("bili-comment-thread-renderer");
            if (!threadRenderers?.length) continue;

            for (const thread of threadRenderers) {
                const commentRenderers = thread.shadowRoot?.querySelectorAll("bili-comment-renderer");
                if (commentRenderers?.length) {
                    for (const renderer of commentRenderers) {
                        const bodyDiv = queryShadowRoots(renderer, ["#body"]);
                        if (bodyDiv && bodyDiv.style.paddingTop !== "0px") {
                            bodyDiv.style.paddingTop = "0px";

                            const headerDiv = bodyDiv.querySelector("#header");
                            if (headerDiv && headerDiv.style.marginBottom !== "-10px") {
                                headerDiv.style.marginBottom = "-10px";
                            }

                            const avatarLink = bodyDiv.querySelector("#user-avatar");
                            if (avatarLink && avatarLink.style.top !== "8px") {
                                avatarLink.style.top = "8px";
                            }
                        }
                        const ornamentDiv = bodyDiv.querySelector("#ornament");
                        if (ornamentDiv && ornamentDiv.style.top !== "-12px") {
                            ornamentDiv.style.top = "-12px";
                        }
                        const actionButton = renderer.shadowRoot?.querySelector("bili-comment-action-buttons-renderer");
                        if (actionButton?.shadowRoot && !actionButton.shadowRoot.querySelector("#custom-action-style")) {
                            const style = document.createElement("style");
                            style.id = "custom-action-style";
                            style.textContent = `:host { margin-top: -6px !important; }`;
                            actionButton.shadowRoot.appendChild(style);
                        }
                    }
                }

                const divElement = thread.shadowRoot?.querySelector("div#div");
                if (divElement && divElement.style.paddingBottom !== "0px") {
                    divElement.style.paddingBottom = "0px";
                }

                const repliesRenderer = thread.shadowRoot?.querySelector("bili-comment-replies-renderer");
                if (repliesRenderer?.shadowRoot) {
                    const replyRenderers = repliesRenderer.shadowRoot.querySelectorAll("bili-comment-reply-renderer");
                    replyRenderers.forEach(reply => {
                        const replyBody = reply.shadowRoot?.querySelector("#body");
                        if (replyBody && replyBody.style.padding !== "0px 0px 0px 34px") {
                            replyBody.style.padding = "0px 0px 0px 34px";
                        }
                        const actionButton = reply.shadowRoot?.querySelector("bili-comment-action-buttons-renderer");
                        if (actionButton?.shadowRoot && !actionButton.shadowRoot.querySelector("#custom-action-style")) {
                            const style = document.createElement("style");
                            style.id = "custom-action-style";
                            style.textContent = `:host { margin-top: -6px !important; }`;
                            actionButton.shadowRoot.appendChild(style);
                        }
                    });
                }
            }
        }
    }

commentStyles();
}
function start (){
    const commentObserver = new MutationObserver((mutations, observer) => {
    videoComment(commentObserver);
});
    commentObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });
}

start();

    function applyStyles() {
        GM_addStyle('.video-sections-content-list {max-height: 450px !important; height: 450px !important; }');//24-7-14解决点击下一个视频失效的问题
        GM_addStyle('.video-pod .video-pod__body {max-height: 450px !important;}');//25-1-20fix video list invalid
        //修改bilibili直播界面
        GM_addStyle('.live-room-app .app-content .app-body {width: auto !important;max-width: 1620px!important;}');//24-7-9
        GM_addStyle('.live-room-app .app-content .app-body .player-and-aside-area {margin-bottom: 90px;}');//24-7-9
        GM_addStyle('.header-info-ctnr .rows-ctnr .lower-row .live-area .area-link {max-width: 144px !important;}');//分区文字显示24-9-5
        //修改视频列表宽度，以及解除视频列表字符长度限制
        GM_addStyle('.video-episode-card__info-title {width: auto !important;}');//24-4-11
        GM_addStyle('.first-line-left .first-line-title {max-width: 210px !important;}');//列表标题宽度max24-6-1
        //专栏评论大小
        GM_addStyle(`
            .opus-detail {width: 1080px;}
            .right-sidebar-wrap {margin-left: 1100px;}`);//25-06-24删除无用参数
    }//GM_addStyle('');
    window.addEventListener('load', function() {
        applyStyles();
    });
})();
