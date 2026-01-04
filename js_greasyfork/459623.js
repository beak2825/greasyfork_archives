// ==UserScript==
// @name               Masiro: Auto Load More Notifications
// @name:zh-TW         真白萌：自動載入更多通知
// @name:zh-CN         真白萌：自动载入更多通知
// @description        Load more notifications automatically when scrolled to the bottom of the notifications list.
// @description:zh-TW  捲動到通知列表底部時自動載入更多通知。
// @description:zh-CN  卷动到通知列表底部时自动载入更多通知。
// @icon               https://icons.duckduckgo.com/ip3/masiro.me.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.2
// @license            MIT
// @match              https://masiro.me/admin
// @match              https://masiro.me/admin/*
// @exclude-match      https://masiro.me/admin/auth/*
// @run-at             document-end
// @grant              none
// @supportURL         https://greasyfork.org/scripts/487408/feedback
// @downloadURL https://update.greasyfork.org/scripts/487408/Masiro%3A%20Auto%20Load%20More%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/487408/Masiro%3A%20Auto%20Load%20More%20Notifications.meta.js
// ==/UserScript==

const observer = new MutationObserver((records) =>
{
    for (const record of records)
    {
        for (const node of record.addedNodes)
        {
            if (node.classList.contains("message-frame"))
            {
                const moreButton = node.querySelector(".message-footer");
                const messagesList = node.querySelector(".message-content");

                messagesList.addEventListener("scroll", handleScroll);
                handleScroll();

                function handleScroll()
                {
                    if ((messagesList.scrollTop + messagesList.clientHeight) >= (messagesList.scrollHeight - 20))
                    {
                        if (!moreButton || (moreButton.style.display === "none"))
                        {
                            messagesList.removeEventListener("scroll", handleScroll);
                        }
                        else
                        {
                            moreButton.click();
                        }
                    }
                }
            }
        }
    }
});

observer.observe(document.querySelector(".navbar-custom-menu .navbar-nav li:first-child > div"), { childList: true });
