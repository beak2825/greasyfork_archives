// ==UserScript==
// @name         B站枝网查重
// @namespace    https://github.com/JaHIY/asoulcnki-checker
// @homepage     https://greasyfork.org/en/scripts/446707
// @supportURL   https://greasyfork.org/en/scripts/446707/feedback
// @version      0.0.6
// @description  对B站评论区小作文进行一键枝网查重 / duplicate check on BiliBili comment area by using asoulcnki api
// @author       JaHIY
// @license      GPLv3
// @match        https://*.bilibili.com/*
// @grant        GM.xmlHttpRequest
// @connect      asoulcnki.asia
// @run-at       document-start
// @icon         https://www.bilibili.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/446707/B%E7%AB%99%E6%9E%9D%E7%BD%91%E6%9F%A5%E9%87%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/446707/B%E7%AB%99%E6%9E%9D%E7%BD%91%E6%9F%A5%E9%87%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_BASE_URL = 'https://api.asoulcnki.asia';
    const PercentFormat = new Intl.NumberFormat("zh-Hans-CN", {
        style: "percent",
        minimumFractionDigits: 2
    });

    function parseRule(rule) {
        const [selector, ...rest] = rule;
        const selectorStr = selector.join(', ');
        const kv_list = [];
        for (let r of rest) {
            if (Array.isArray(r[0])) {
                kv_list.push(parseRule(r));
            } else {
                const [propName, value, isImportant] = r;
                kv_list.push(`${propName}: ${value}${isImportant ? " !important" : ""};`);
            }
        }
        return `${selectorStr} { ${kv_list.join('')} }`;
    }

    function addStyleSheetRules(rules = []) {
        const styleEl = document.createElement("style");
        document.head.appendChild(styleEl);
        const styleSheet = styleEl.sheet;
        rules.map(parseRule).forEach((ruleStr) => {
            styleSheet.insertRule(ruleStr, styleSheet.cssRules.length);
        });
    }

    function addCheckBtn(parentNode, insertAfterNode, className) {
        const checkBtn = document.createElement("span");
        checkBtn.classList.add(className);
        checkBtn.textContent = "狠狠滴查";
        parentNode.insertBefore(checkBtn, insertAfterNode.nextSibling);
    }

    function makeRequest(url, init = {}) {
        return new Promise((resolve, reject) => {
            const xhr_details = {
                url,
                ...init,
                onload: (res) => {
                    if (res.status == 200) {
                        resolve(res);
                    } else {
                        reject(`${res.finalUrl}: ${res.status} ${res.statusText}`);
                    }
                },
                onerror: (err) => {
                    reject(err);
                },
            };
            return GM.xmlHttpRequest(xhr_details);
        });
    }

    async function asoulcnki_check(text = "") {
        const response = await makeRequest(`${API_BASE_URL}/main/v1/check`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({text}),
            responseType: "json",
        });
        return response.response;
    }

    function formatNodeText(node) {
        const childNodes = Array.from(node.childNodes);
        const result = [];
        while (childNodes.length > 0) {
            const childNode = childNodes.pop();
            const nodeName = childNode.nodeName;
            if (nodeName === 'IMG') {
                result.push(childNode.alt);
            } else if (nodeName === 'BR') {
                result.push('\n');
            } else if ((nodeName === 'A') &&
                !childNode.classList.contains('underline-word') &&
                !childNode.classList.contains('video-jump-link')) {
                result.push(childNode.href);
            } else if (nodeName === '#text') {
                result.push(childNode.textContent);
            } else {
                for (const n of childNode.childNodes) {
                    childNodes.push(n);
                }
            }
        }
        return result.reverse().join('');
    }

    function cleanReplyContent(replyContentNode) {
        if ((replyContentNode.firstChild.textContent === "回复 ") &&
            (replyContentNode.childNodes.length >= 3) &&
            replyContentNode.firstChild.nextSibling.classList?.contains("user-link")) {
            const dupNode = replyContentNode.cloneNode(true);
            dupNode.removeChild(dupNode.firstChild);
            dupNode.removeChild(dupNode.firstChild);
            dupNode.firstChild.textContent = dupNode.firstChild.textContent.replace(/^ :/, "");
            replyContentNode = dupNode;
        } else if (replyContentNode.firstChild.classList?.contains("sticky")) {
            const dupNode = replyContentNode.cloneNode(true);
            dupNode.removeChild(dupNode.firstChild);
            replyContentNode = dupNode;
        }
            return formatNodeText(replyContentNode);
    }

    function createCheckReportRateElement(rate = 0) {
        const rateInPercent = PercentFormat.format(rate);
        const el = document.createElement("span");
        el.classList.add("check-report-rate");

        const progressBarEl = document.createElement("span");
        progressBarEl.classList.add("check-report-rate-progress-bar");
        progressBarEl.style.width = rateInPercent;
        const lightness = Math.round((1 - rate) * 120);
        progressBarEl.style.backgroundImage = `linear-gradient(hsl(${lightness}, 100%, 90%), hsl(${lightness}, 90%, 70%))`;
        progressBarEl.style.maskImage = `linear-gradient(to right, rgb(0, 0, 0) ${PercentFormat.format(rate)}, transparent)`;
        el.appendChild(progressBarEl);

        const progressBarPlaceholderEl = document.createElement("span");
        progressBarPlaceholderEl.classList.add("check-report-rate-progress-bar-placeholder");
        progressBarPlaceholderEl.textContent = ".";
        progressBarEl.appendChild(progressBarPlaceholderEl);

        const progressBarTextEl = document.createElement("span");
        progressBarTextEl.classList.add("check-report-rate-progress-bar-text");
        progressBarTextEl.textContent = rateInPercent;
        el.appendChild(progressBarTextEl);

        return el;
    }

    function dateFormat(timestamp) {
        if (Number.isInteger(timestamp)) {
            return (new Date(timestamp).toLocaleDateString("zh-Hans-CN"));
        }
        return "?";
    }

    function createUserLink(userId, userName = userId) {
        const el = document.createElement("a");
        el.classList.add("check-report-user-link");
        el.target = "_blank";
        el.href = `https://space.bilibili.com/${userId}`;
        el.title = `${userName}的个人空间`;
        el.textContent = userName;

        return el;
    }

    function createCheckReportElement(checkResult = {}, replyUserId) {
        const el = document.createElement("div");
        el.classList.add("check-report");

        const checkReportTitleEl = document.createElement("div");
        checkReportTitleEl.classList.add("check-report-title");
        checkReportTitleEl.textContent = "枝网文本复制检测报告（简洁）";
        el.appendChild(checkReportTitleEl);

        const checkReportListEl = document.createElement("ul");
        checkReportListEl.classList.add("check-report-list");
        el.appendChild(checkReportListEl);

        const checkReportDateTimeEl = document.createElement("li");
        checkReportDateTimeEl.classList.add("check-report-datetime");
        checkReportDateTimeEl.textContent = `查重时间：${(new Date()).toLocaleString("zh-Hans-CN")}`;
        checkReportListEl.appendChild(checkReportDateTimeEl);

        const checkReportCollectionScopeEl = document.createElement("li");
        checkReportCollectionScopeEl.classList.add("check-report-collection-scope");
        checkReportCollectionScopeEl.textContent = "收录范围：B站动态、视频评论区（仅限A-Soul的六个官方账号）";
        checkReportListEl.appendChild(checkReportCollectionScopeEl);

        const checkReportCollectionTimeRangeEl = document.createElement("li");
        checkReportCollectionTimeRangeEl.classList.add("check-report-collection-time-range");
        const startTimeStr = dateFormat(checkResult.start_time * 1000);
        const endTimeStr = dateFormat(checkResult.end_time * 1000);
        checkReportCollectionTimeRangeEl.textContent = `时间范围：${startTimeStr}至${endTimeStr}`;
        checkReportListEl.appendChild(checkReportCollectionTimeRangeEl);

        const checkReportResultEl = document.createElement("li");
        checkReportResultEl.classList.add("check-report-result");
        if (Number.isNaN(checkResult.rate)) {
            checkReportResultEl.textContent = "暂无查重结果";
        } else {
            checkReportResultEl.textContent = "总文字复制比：";
            const checkReportRateEl = createCheckReportRateElement(checkResult.rate);
            checkReportResultEl.appendChild(checkReportRateEl);
        }
        checkReportListEl.appendChild(checkReportResultEl);

        const checkReportRelatedEl = document.createElement("div");
        checkReportRelatedEl.classList.add("check-report-related");

        const checkReportRelatedTitleEl = document.createElement("div");
        checkReportRelatedTitleEl.classList.add("check-report-related-title");
        checkReportRelatedEl.appendChild(checkReportRelatedTitleEl);

        if (checkResult.related.length === 0) {
            checkReportRelatedTitleEl.textContent = "一眼原创，再偷必究";
        } else {
            checkReportRelatedTitleEl.textContent = "相似小作文列表";

            const checkReportRelatedListEl = document.createElement("ol");
            checkReportRelatedListEl.classList.add("check-report-related-list");
            checkReportRelatedEl.appendChild(checkReportRelatedListEl);
            checkResult.related.forEach((item, index) => {
                const checkReportRelatedItemEl = document.createElement("li");

                checkReportRelatedItemEl.appendChild(document.createTextNode(`[${index + 1}] `));

                checkReportRelatedItemEl.classList.add("check-report-related-item");
                checkReportRelatedListEl.appendChild(checkReportRelatedItemEl);

                const relatedItemRateEl = createCheckReportRateElement(item.rate);
                checkReportRelatedItemEl.appendChild(relatedItemRateEl);

                checkReportRelatedItemEl.appendChild(document.createTextNode(` | 发布于：${dateFormat(item.reply.ctime * 1000)}`));

                checkReportRelatedItemEl.appendChild(document.createTextNode(` | 点赞：${item.reply.like_num}`));

                checkReportRelatedItemEl.appendChild(document.createTextNode(` | 被引：${item.reply.similar_count}`));

                checkReportRelatedItemEl.appendChild(document.createTextNode(" | 作者："));

                const userLink = createUserLink(item.reply.mid, item.reply.m_name);
                checkReportRelatedItemEl.appendChild(userLink);

                checkReportRelatedItemEl.appendChild(document.createTextNode(" | 传送门："));

                const quoteLink = document.createElement("a");
                const replyUrl = item.reply_url.trim();
                quoteLink.classList.add("check-report-quote-link");
                quoteLink.target = "_blank";
                quoteLink.href = replyUrl;
                quoteLink.title = item.reply.content;
                quoteLink.textContent = replyUrl;
                checkReportRelatedItemEl.appendChild(quoteLink);
            });
        }
        el.appendChild(checkReportRelatedEl);

        const checkReportStatementEl = document.createElement("div");
        checkReportStatementEl.classList.add("check-report-statement");
        checkReportStatementEl.textContent = "※ 查重结果仅作参考，请注意辨别是否为原创";
        el.appendChild(checkReportStatementEl);

        return el;
    }

    function createErrorMessageElement(errText = "") {
        const el = document.createElement("div");
        el.classList.add("error-message");
        el.textContent = `⚠️ ${errText}`;
        return el;
    }

    function createCopyToClipboardContainerElement() {
        const el = document.createElement("div");
        el.classList.add("copy-to-clipboard-container");

        const copyToClipboardBtnEl = document.createElement("button");
        copyToClipboardBtnEl.classList.add("copy-to-clipboard-btn");
        copyToClipboardBtnEl.textContent = "一键复制";
        el.appendChild(copyToClipboardBtnEl);

        const copyToClipboardMessageEl = document.createElement("span");
        copyToClipboardMessageEl.classList.add("copy-to-clipboard-message");
        copyToClipboardMessageEl.classList.add("visually-hidden");
        el.appendChild(copyToClipboardMessageEl);

        return el;
    }

    function createWarpElement(childNode) {
        const wrapEl = document.createElement("div");
        wrapEl.classList.add("wrap-container");

        const copyToClipboardContainerEl = createCopyToClipboardContainerElement();
        wrapEl.appendChild(copyToClipboardContainerEl);

        const closeBtnEl = document.createElement("button");
        closeBtnEl.classList.add("wrap-close-btn");
        wrapEl.appendChild(closeBtnEl);

        const innerEl = document.createElement("div");
        innerEl.classList.add("inner-container");
        innerEl.appendChild(childNode);
        wrapEl.appendChild(innerEl);

        return wrapEl;
    }

    function getCopyText(node) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.addRange(range);
        const copyText = selection.toString();
        selection.removeAllRanges();
        return copyText;
    }

    addStyleSheetRules([
        [
            [".visually-hidden"],
            ["display", "none"],
        ],
        [
            [".check-btn:hover", ".sub-check-btn:hover"],
            ["color", "#00a1d6"],
        ],
        [
            [".check-btn", ".sub-check-btn"],
            ["cursor", "pointer"],
            ["margin-left", "19px"],
        ],
        [
            [".wrap-container"],
            ["position", "relative"],
            ["margin", "12px 0 12px 0"],
            ["font-size", "16px"],
            ["line-height", "26px"],
        ],
        [
            [".wrap-container .wrap-close-btn::before"],
            ["content", "'\\2715'"],
            ["display", "block"],
        ],
        [
            [".wrap-container .wrap-close-btn"],
            ["cursor", "pointer"],
            ["display", "inline-block"],
            ["position", "absolute"],
            ["top", "6px"],
            ["right", "6px"],
            ["background", "transparent"],
            ["border", "0"],
            ["text-align", "center"],
        ],
        [
            [".wrap-container .wrap-close-btn:hover"],
            ["color", "#fd676f"]
        ],
        [
            [".copy-to-clipboard-container"],
            ["position", "relative"],
            ["text-align", "center"],
            ["font-size", "14px"],
        ],
        [
            [".copy-to-clipboard-container .copy-to-clipboard-btn"],
            ["cursor", "pointer"],
            ["display", "inline-block"],
            ["position", "absolute"],
            ["top", "6px"],
            ["right", "30px"],
            ["background", "transparent"],
            ["border", "0"],
        ],
        [
            [".copy-to-clipboard-container .copy-to-clipboard-btn:hover"],
            ["color", "#00a1d6"],
        ],
        [
            [".copy-to-clipboard-container .copy-to-clipboard-message"],
            ["position", "absolute"],
            ["top", "50px"],
            ["right", "30px"],
            ["padding", "2px 8px"],
            ["background", "#1b1b1b"],
            ["color", "#ffffff"],
            ["opacity", "0.8"],
            ["border-radius", "5px"],
            ["text-align", "center"],
            ["font-size", "14px"],
        ],
        [
            [".wrap-container .inner-container"],
            ["padding", "12px 36px 12px 12px"],
        ],
        [
            [".check-report .check-report-title"],
            ["font-weight", "bold", true],
        ],
        [
            [".check-report .check-report-rate"],
            ["display", "inline-block"],
            ["position", "relative"],
            ["top", "0"],
            ["width", "72px"],
            ["height", "22px"],
            ["border-radius", "2px"],
            ["border", "1px solid rgb(112, 112, 112)"],
            ["background-color", "rgb(252, 252, 252)"],
            ["background-image", "linear-gradient(rgb(252, 252, 252), rgb(214, 214, 214))"],
        ],
        [
            [".check-report .check-report-rate .check-report-rate-progress-bar"],
            ["display", "block"],
            ["border-radius", "1px"],
            ["background-color", "transparent"],
            ["height", "100%"],
        ],
        [
            [".check-report .check-report-rate .check-report-rate-progress-bar-placeholder"],
            ["visibility", "hidden"],
        ],
        [
            [".check-report .check-report-rate .check-report-rate-progress-bar-text"],
            ["display", "block"],
            ["position", "absolute"],
            ["text-align", "center"],
            ["top", "0"],
            ["width", "100%"],
            ["line-height", "22px"],
        ],
        [
            [".check-report .check-report-related"],
            ["margin-top", "24px"],
        ],
        [
            [".check-report .check-report-related .check-report-related-title"],
            ["font-weight", "bold"],
        ],
        [
            [".check-report .check-report-related .check-report-related-list"],
            ["padding", "0"],
        ],
        [
            [".check-report .check-report-statement"],
            ["font-weight", "bold", true],
            ["margin-top", "24px"],
        ],
    ]);

    const observer = new MutationObserver((mutationsList, observer) => {
        //console.log(mutationsList);
        mutationsList.filter((mutation) => {
            return (mutation.type === 'childList') &&
                (mutation.target.classList.contains("sub-reply-list") ||
                    mutation.target.classList.contains("reply-list") ||
                    mutation.target.classList.contains("comment-list") ||
                    mutation.target.classList.contains("reply-box")) &&
                (mutation.addedNodes.length > 0);
        }).flatMap((mutation) => {
            return Array.from(mutation.addedNodes);
        }).forEach((el) => {
            if (el.querySelectorAll) {
                const replyInfoList = el.querySelectorAll(".reply-info");
                replyInfoList.forEach((replyInfo) => {
                    const replyBtn = replyInfo.querySelector(".reply-btn");
                    addCheckBtn(replyInfo, replyBtn, "check-btn");
                });
                const subReplyInfoList = el.querySelectorAll(".sub-reply-info");
                subReplyInfoList.forEach((subReplyInfo) => {
                    const subReplyBtn = subReplyInfo.querySelector(".sub-reply-btn");
                    addCheckBtn(subReplyInfo, subReplyBtn, "sub-check-btn");
                });
                const infoList = el.querySelectorAll(".con > .info");
                infoList.forEach((replyInfo) => {
                    const replyBtn = replyInfo.querySelector(".reply");
                    addCheckBtn(replyInfo, replyBtn, "check-btn");
                });
                const subInfoList = el.querySelectorAll(".reply-item > .info");
                subInfoList.forEach((subReplyInfo) => {
                    const subReplyBtn = subReplyInfo.querySelector(".reply");
                    addCheckBtn(subReplyInfo, subReplyBtn, "sub-check-btn");
                });
            }
        });
    });

    observer.observe(document, {childList: true,attributes: false,subtree: true});

    document.addEventListener('click', async (ev) => {
        const el = ev.target;
        if (el.classList.contains("wrap-close-btn")) {
            el.parentNode.remove();
        }
        if (el.classList.contains("copy-to-clipboard-btn")) {
            const copyText = getCopyText(el.closest(".wrap-container").querySelector(".inner-container"));
            const copyToClipboardMessageEl = el.closest(".copy-to-clipboard-container").querySelector(".copy-to-clipboard-message");
            let copyMessage = null;
            try {
                await navigator.clipboard.writeText(copyText);
                copyMessage = "已复制";
            } catch (err) {
                copyMessage = "复制失败";
            } finally {
                copyToClipboardMessageEl.textContent = copyMessage;
                copyToClipboardMessageEl.classList.remove("visually-hidden");
                window.setTimeout(() => {
                    copyToClipboardMessageEl.classList.add("visually-hidden");
                }, 2000);
            }
        }
        if (el.classList.contains("check-btn") || el.classList.contains("sub-check-btn")) {
            let replyItemEl = null;
            let replyContentEl = null;
            let replyInfoEl = null;
            let userId = null;
            if (el.classList.contains("check-btn")) {
                if (el.closest(".root-reply")) {
                    replyItemEl = el.closest(".root-reply");
                    replyContentEl = replyItemEl.querySelector(".reply-content");
                    replyInfoEl = el.closest(".reply-info");
                    userId = el.closest(".content-warp").querySelector(".user-name").dataset.userId;
                } else {
                    replyItemEl = el.closest(".con");
                    replyContentEl = replyItemEl.querySelector(".text");
                    replyInfoEl = el.closest(".info");
                    userId = replyItemEl.querySelector(".con > .user > .name").dataset.usercardMid;
                }
            } else {
                if (el.closest(".sub-reply-item")) {
                    replyItemEl = el.closest(".sub-reply-item");
                    replyContentEl = replyItemEl.querySelector(".sub-reply-content");
                    replyInfoEl = el.closest(".sub-reply-info");
                    userId = replyItemEl.querySelector(".sub-user-name").dataset.userId;
                } else {
                    replyItemEl = el.closest(".reply-item");
                    replyContentEl = replyItemEl.querySelector(".text-con");
                    replyInfoEl = el.closest(".info");
                    userId = replyItemEl.querySelector(".user > .name").dataset.usercardMid;
                }
            }

            Array.from(replyItemEl.querySelectorAll(".wrap-container")).map((el) => {
                el.remove();
            });

            const replyContent = cleanReplyContent(replyContentEl);
            let resultEl = null;

            try {
                if (replyContent.length < 10) {
                    resultEl = createErrorMessageElement(`小作文字数太少了捏（要求不少于10个字）`);
                } else if (replyContent.length > 1000) {
                    resultEl = createErrorMessageElement(`小作文字数太多了捏（要求不多于1000个字）`);
                } else {
                    const res = await asoulcnki_check(replyContent);
                    //console.log(res);
                    if (res.code != 0) {
                        resultEl = createErrorMessageElement(`API返回错误：${res.code ?? ""} ${res.message ?? ""}`);
                    } else {
                        resultEl = createCheckReportElement(res.data ?? {}, userId);
                    }
                }
            } catch (err) {
                resultEl = createErrorMessageElement(`API请求错误：${err}`);
            } finally {
                const wrapEl = createWarpElement(resultEl);
                replyItemEl.insertBefore(wrapEl, replyInfoEl.nextSibling);
            }
        }
    }, {passive: true});
}());
