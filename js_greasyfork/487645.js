// ==UserScript==
// @name               ESJ Zone: Repair Non-clickable Chapters
// @name:zh-TW         ESJ Zone：修復無法點擊的章節
// @name:zh-CN         ESJ Zone：修复无法点击的章节
// @description        Repair chapter links that were not-clickable due to for example, author misconfigured or by-designed.
// @description:zh-TW  修復因作者設定錯誤或網頁設計問題等原因而無法點擊的章節連結。
// @description:zh-CN  修复因作者设定错误或网页设计问题等原因而无法点击的章节链接。
// @icon               https://icons.duckduckgo.com/ip3/www.esjzone.cc.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.1.0
// @license            MIT
// @match              https://www.esjzone.cc/
// @match              https://www.esjzone.cc/update
// @match              https://www.esjzone.cc/update/
// @match              https://www.esjzone.cc/list
// @match              https://www.esjzone.cc/list/
// @match              https://www.esjzone.cc/list-*
// @match              https://www.esjzone.cc/tags/*
// @match              https://www.esjzone.cc/tags-*
// @match              https://www.esjzone.cc/my/favorite
// @match              https://www.esjzone.cc/my/favorite/*
// @match              https://www.esjzone.me/
// @match              https://www.esjzone.me/update
// @match              https://www.esjzone.me/update/
// @match              https://www.esjzone.me/list
// @match              https://www.esjzone.me/list/
// @match              https://www.esjzone.me/list-*
// @match              https://www.esjzone.me/tags/*
// @match              https://www.esjzone.me/tags-*
// @match              https://www.esjzone.me/my/favorite
// @match              https://www.esjzone.me/my/favorite/*
// @match              https://www.esjzone.one/
// @match              https://www.esjzone.one/update
// @match              https://www.esjzone.one/update/
// @match              https://www.esjzone.one/list
// @match              https://www.esjzone.one/list/
// @match              https://www.esjzone.one/list-*
// @match              https://www.esjzone.one/tags/*
// @match              https://www.esjzone.one/tags-*
// @match              https://www.esjzone.one/my/favorite
// @match              https://www.esjzone.one/my/favorite/*
// @run-at             document-end
// @grant              none
// @require            https://update.greasyfork.org/scripts/482311/1296481/queue.js
// @supportURL         https://greasyfork.org/scripts/487645/feedback
// @downloadURL https://update.greasyfork.org/scripts/487645/ESJ%20Zone%3A%20Repair%20Non-clickable%20Chapters.user.js
// @updateURL https://update.greasyfork.org/scripts/487645/ESJ%20Zone%3A%20Repair%20Non-clickable%20Chapters.meta.js
// ==/UserScript==

let translateText;
if (GM.info.scriptHandler === "Greasemonkey")
{
    translateText = window.eval("getCookie(targetEncodingCookie)") ? window.eval("translateText") : ((text) => text);
}
else
{
    translateText = getCookie(targetEncodingCookie) ? window.translateText : ((text) => (text));
}

async function findChapterUrl(novelUrl, chapterName)
{
    const response = await fetch(novelUrl);
    if (response.status === 200)
    {
        const html = await response.text();
        const parser = new DOMParser();
        const page = parser.parseFromString(html, "text/html");

        return Array.from(page.querySelectorAll("#chapterList a"))
                    .reverse()
                    .find((chapter) => (translateText(chapter.innerText.trim()) === chapterName))?.href ?? null;
    }
}

let repaired = 0;

const queue = new Queue({ autostart: true, concurrency: 4 });
queue.addEventListener("error", (event) => console.error(event.detail.error));
queue.addEventListener("end", () => console.info(`Repaired ${repaired} URL(s).`));

const pathname = location.pathname;
if (pathname === "/my/favorite" || pathname.startsWith("/my/favorite/"))
{
    const novels = document.querySelectorAll(".product-item");
    for (const novel of novels)
    {
        const chapterWrapper = novel.querySelector(".book-ep div:nth-child(2)");
        const chapter = chapterWrapper.childNodes[0]?.splitText(5);
        if (chapter instanceof Text)
        {
            queue.push(async () =>
            {
                const url = await findChapterUrl(novel.querySelector(".product-title a").href, chapter.data);
                if (url)
                {
                    const link = document.createElement("a");
                    link.href = url;

                    link.append(chapter);
                    chapterWrapper.append(link);

                    repaired++;
                }
            });
        }
    }
}
else
{
    const novels = document.querySelectorAll(".card");
    for (const novel of novels)
    {
        const chapterWrapper = novel.querySelector(".card-ep");
        const chapter = chapterWrapper.childNodes[0];
        if (chapter instanceof Text)
        {
            queue.push(async () =>
            {
                const url = await findChapterUrl(novel.querySelector(".card-title a").href, chapter.data);
                if (url)
                {
                    const link = document.createElement("a");
                    link.href = url;

                    link.append(chapter);
                    chapterWrapper.append(link);

                    repaired++;
                }
            });
        }
    }
}
