// ==UserScript==
// @name           Discuz!论坛一键回复
// @name:zh-CN     Discuz!One-Click Reply
// @author         Yulei, wycaca, seiun
// @namespace      Discuz论坛
// @description    Discuz论坛
// @description:zh-cn    Discuz论坛
// @version        2.0
// @create         2013-01-19
// @update         2025-03-10
// @include        http*/thread*
// @include        http*forum.php?mod=viewthread&tid=*
// @include        http*forum.php?mod=post&action=reply&fid=*
// @include        http*forum.php?mod=post&action=newthread&fid=*
// @include        http*://keylol.com/t*
// @copyright      2013+, Yulei
// @copyright      2025+, wycaca
// @copyright      2025+, seiun
// @grant          GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529401/Discuz%21%E8%AE%BA%E5%9D%9B%E4%B8%80%E9%94%AE%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/529401/Discuz%21%E8%AE%BA%E5%9D%9B%E4%B8%80%E9%94%AE%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function $(id) {
        return document.getElementById(id);
    }

    let w = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    if (w.discuz_uid > 0) {
        let bar = document.querySelector('.fpd') || document.querySelector('.bar');
        let postForm = $('postform'), fastPostForm = $('fastpostform');
        let pos = postForm || fastPostForm;

        function mess(PS) {
            PS.addEventListener('keydown', function (event) {
                if ((event.ctrlKey && event.keyCode === 13) || (event.altKey && event.keyCode === 83)) {
                    if (postForm) {
                        w.ctlent(event);
                    } else {
                        w.seditor_ctlent(event, 'fastpostvalidate($(\'fastpostform\'))');
                    }
                }
            });
        }

        // 添加快捷回复
        let quickReplyBox = document.createElement("SELECT");
        quickReplyBox.id = "mUA";
        quickReplyBox.title = "选择自动回复";
        let replyTexts = [
            "{:17_1010:}{:17_1010:}", // 设置默认自动回复内容
            "感谢分享，楼主辛苦了！"
        ];

        replyTexts.forEach((text, index) => {
            let option = document.createElement("option");
            option.value = index;
            option.textContent = text;
            quickReplyBox.appendChild(option);
        });

        let replyBtn = document.createElement("button");
        replyBtn.textContent = "自动回复";
        replyBtn.id = "mUA_btn";
        replyBtn.style.marginLeft = "5px";
        replyBtn.style.cursor = "pointer";
        replyBtn.style.padding = "5px 10px";
        replyBtn.style.border = "none";
        replyBtn.style.borderRadius = "3px";
        replyBtn.style.backgroundColor = "#41A2DE";
        replyBtn.style.color = "white";

        function addQuickReply() {
            let selectedText = quickReplyBox.options[quickReplyBox.selectedIndex].text;
            let fastPostMessage = $("fastpostmessage");
            let iframeEditor = $("e_iframe");
            let postMessageBox = $("postmessage");

            if (fastPostMessage) {
                fastPostMessage.value = selectedText;
            } else if (iframeEditor) {
                iframeEditor.contentDocument.body.innerHTML = selectedText;
            } else if (postMessageBox) {
                postMessageBox.value = selectedText;
            }
        }

        replyBtn.addEventListener("click", addQuickReply);

        if (bar) {
            bar.appendChild(quickReplyBox);
            bar.appendChild(replyBtn);
        }

        quickReplyBox.addEventListener("change", addQuickReply);

        function observeReplyPopup() {
            let observer = new MutationObserver(() => {
                let replyWin = document.getElementById("fwin_reply");
                if (replyWin) {
                    let postForm = $("postform");
                    let bar = replyWin.querySelector(".bar");
                    if (bar && !bar.contains(quickReplyBox)) {
                        bar.appendChild(quickReplyBox);
                        bar.appendChild(replyBtn);
                    }
                    if (postForm) {
                        mess(postForm.message);
                    }
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        }

        observeReplyPopup();
    }
})();