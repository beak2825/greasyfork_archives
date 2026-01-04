// ==UserScript==
// @name               Better Links UX for ESJ Zone
// @name:zh-TW         ESJ Zone：更好的連結體驗
// @description        Improve the UX of ESJ Zone by tweaking the hyperlinks in the pages.
// @description:zh-TW  透過調整 ESJ Zone 的超連結來改善使用體驗。
// @icon               https://icons.duckduckgo.com/ip3/www.esjzone.cc.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.3.0
// @license            MIT
// @match              https://www.esjzone.cc/detail/*
// @match              https://www.esjzone.cc/forum/*
// @match              https://www.esjzone.me/detail/*
// @match              https://www.esjzone.me/forum/*
// @match              https://www.esjzone.one/detail/*
// @match              https://www.esjzone.one/forum/*
// @run-at             document-end
// @grant              none
// @supportURL         https://greasyfork.org/scripts/449315/feedback
// @downloadURL https://update.greasyfork.org/scripts/449315/Better%20Links%20UX%20for%20ESJ%20Zone.user.js
// @updateURL https://update.greasyfork.org/scripts/449315/Better%20Links%20UX%20for%20ESJ%20Zone.meta.js
// ==/UserScript==

const pathname = location.pathname;

if (pathname.startsWith("/detail/"))
{
    const chapters = document.querySelectorAll("#chapterList a");
    for (const chapter of chapters)
    {
        chapter.target = "_self";
    }
}
else if (pathname.startsWith("/forum/") && !pathname.endsWith(".html"))
{
    const observer = new MutationObserver((records) =>
    {
        for (const record of records)
        {
            for (const node of record.addedNodes)
            {
                const link = node.querySelector("a");
                if (link) { link.target = "_self"; }
            }
        }
    });

    observer.observe(document.querySelector(".forum-list > tbody"), { childList: true });
}
