// ==UserScript==
// @name         CC98 Tools - blablabla
// @version      1.0.1
// @description  Small tools for CC98.
// @icon         https://www.cc98.org/static/98icon.ico

// @author       ml98
// @namespace    https://www.cc98.org/user/name/ml98
// @license      MIT

// @match        https://www.cc98.org/*
// @match        https://www-cc98-org-s.webvpn.zju.edu.cn:8001/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/444312/CC98%20Tools%20-%20blablabla.user.js
// @updateURL https://update.greasyfork.org/scripts/444312/CC98%20Tools%20-%20blablabla.meta.js
// ==/UserScript==

/* eslint-env jquery */

main();

function main() {
    /* 隐藏用户名、头像 */
    hideUserName();
    /* 翻页快捷键 Ctrl+</> */
    addPageUpDownHotkey();
    /* 新帖显示回复数 */
    addTopicReplyCount();
    /* 新标签页打开帖子 */
    openTopicInNewTab();
    /* 修复WebVPN站外链接 */
    escapeFromWebVPN();
    /* 解决文件下载问题 */
    fixMixContent();
    /* 隐藏所有图片 */
    hideAllImages();
    /* 点击楼层数折叠楼层 */
    foldFloor();
    /* 自动提醒签到 */
    autoSignin();
}

function hideUserName() {
    const genRanHex = (size) =>
        [...Array(size)]
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join("")
            .toUpperCase();
    const userName = "匿名" + genRanHex(6);
    const userImgSrc = "/static/images/心灵头像.gif";
    GM_addStyle(`
        .topBarUserName {
            visibility: hidden;
        }
        .topBarUserName:after {
            visibility: visible;
            position: absolute;
            content: "${userName}";
        }
        .topBarUserImg img {
            content: url(${userImgSrc});
            /* opacity: 0; */
        }
    `);
}

function addPageUpDownHotkey() {
    $(document).on("keydown", function (e) {
        if (document.URL.includes("https://www.cc98.org/topic/")) {
            const p = document.querySelector(".page-link.active");
            if (e.ctrlKey) {
                switch (e.key) {
                    case "ArrowLeft":
                        p.parentNode.previousSibling?.children[0].click();
                        break;
                    case "ArrowRight":
                        p.parentNode.nextSibling?.children[0].click();
                        break;
                }
            }
        }
    });
}

function React(dom) {
    const key = Object.keys(dom).find((key) =>
        key.startsWith("__reactInternalInstance$")
    );
    const instance = dom[key];
    return (
        instance?._debugOwner?.stateNode ||
        instance?.return?.stateNode ||
        instance?._currentElement?._owner?._instance ||
        null
    );
}

function addTopicReplyCount() {
    setInterval(() => {
        if (
            document.URL.includes("https://www.cc98.org/newTopics") ||
            document.URL.includes("https://www.cc98.org/search") ||
            document.URL.includes("https://www.cc98.org/focus")
        ) {
            $(".focus-topic-info").each(function () {
                let replyCount = React(this.parentNode.parentNode).props
                    .replyCount;
                let hit = $(this).find(".fa-eye").parent()[0];
                let reply = $(this).find(".fa-reply").parent()[0];
                if (reply && hit.nextSibling == reply) {
                    if (reply.childNodes[1].textContent !== ` ${replyCount}`) {
                        reply.childNodes[1].textContent = ` ${replyCount}`;
                    }
                } else {
                    reply && reply.remove();
                    $(hit).after(
                        `<div><i class="fa fa-reply"></i> ${replyCount}</div>`
                    );
                }
            });
        }
    }, 1000);
}

function openTopicInNewTab() {
    $(document).on(
        "click",
        ".board-postItem-title a, .user-post-content a",
        function (e) {
            if (e.target.href.includes("https://www.cc98.org/topic/")) {
                e.preventDefault();
                unsafeWindow.open(e.target.href);
            }
        }
    );
}

/* global revertUrl */
function escapeFromWebVPN() {
    $(document).on("click", "a", function (e) {
        if (
            typeof revertUrl !== "undefined" &&
            this.href &&
            !new URL(this.href).host.includes("cc98.org")
        ) {
            e.preventDefault();
            open(revertUrl(this.href));
            return false;
        }
    });
}

function fixMixContent() {
    $(document).on("click", "a.download-file", function (e) {
        if (new URL(this.href).host === "file.cc98.org") {
            e.preventDefault();
            unsafeWindow.open(this.href.replace("http:", ""));
            return false;
        }
    });
}

function waitForElement(
    selector,
    callback,
    once = false,
    startNode = document
) {
    const uid = '_' + Math.random().toString().slice(2);
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1) {
                    if (node.matches(selector)) {
                        callback(node);
                        if (once) {
                            observer.disconnect();
                            return;
                        }
                    } else {
                        const child = node.querySelector(
                            selector + `:not([${uid}])`
                        );
                        if (child) {
                            child.setAttribute(uid, "");
                            callback(child);
                            if (once) {
                                observer.disconnect();
                                return;
                            }
                        }
                    }
                }
            }
        }
    });
    observer.observe(startNode, {
        childList: true,
        subtree: true,
    });
}

function hideAllImages() {
    function hide() {
        $(`.reply-content img,.lazyload-placeholder`)
            .parent()
            .each((_, e) => React(e)?.toggleIsShowed?.(false));
    }
    waitForElement("#essayProp", function () {
        const button1 = $(`#essayProp > div.followTopic[style="width: 6rem;"]`);
        const button2 = $(
            `<div class="followTopic" style="width: 6rem;">隐藏所有图片</div>`
        );
        button1.after(button2);
        button2.on("click", hide);
    });
}

function foldFloor() {
    GM_addStyle(`
        .substance.fold {
            max-height: 400px;
            overflow-y: auto;
            position: relative;
        }
        .substance.fold > .markdown-container {
            overflow-y: auto;
        }
        .reply-floor {
            cursor: pointer;
        }
    `);
    $(document.body).on("click", ".reply-floor", function () {
        $(this).parents(".reply").find(".substance").toggleClass("fold");
    });
}

function autoSignin() {
    const today = new Date().getDate();
    if (GM_getValue("signin_date") !== today) {
        GM_setValue("signin_date", today);
        unsafeWindow.open("/signin");
        unsafeWindow.open("http://www.nexushd.org/signin.php");
        // unsafeWindow.open("https://glados.rocks/console/checkin");
    }
    /*
    if (document.URL.includes("https://www.cc98.org/signin")) {
        let id = setInterval(() => {
            $('.sign-in #post-topic-button').click().length
            && clearInterval(id);
        }, 5000);
    }
    */
}
