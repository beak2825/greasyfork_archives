// ==UserScript==
// @name               Readmoo: Blurs R-rated Covers
// @name:zh-TW         讀墨電子書：模糊限制級封面
// @description        Blurs the covers of R-rated books on Readmoo.
// @description:zh-TW  模糊讀墨電子書限制級書本的封面。
// @icon               https://wsrv.nl/?url=https://cdn.readmoo.com/images/manifest/icon_152x152.png
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.0.0
// @license            MIT
// @match              https://readmoo.com/
// @match              https://readmoo.com/*
// @run-at             document-end
// @grant              none
// @require            https://update.greasyfork.org/scripts/483122/1304475/style-shims.js
// @require            https://update.greasyfork.org/scripts/482311/1297431/queue.js
// @supportURL         https://greasyfork.org/scripts/494594/feedback
// @downloadURL https://update.greasyfork.org/scripts/494594/Readmoo%3A%20Blurs%20R-rated%20Covers.user.js
// @updateURL https://update.greasyfork.org/scripts/494594/Readmoo%3A%20Blurs%20R-rated%20Covers.meta.js
// ==/UserScript==

GM.addStyle(`
    .listItem-box.nsfw .book-cover img
    {
        filter: blur(var(--nsfw-blur-radius, 7.5px));
        transition: filter var(--nsfw-transition-duration, 0.3s);
    }

    .listItem-box.nsfw:hover .book-cover img, .listItem-box.nsfw:focus-within .book-cover img
    {
        filter: blur(0px);
        transform: none;
    }
`);

const queue = new Queue({ autostart: true, concurrency: 10 });
queue.addEventListener("error", (event) => console.error(event.detail.error));

const products = document.querySelectorAll(".listItem-box:not(.full-list)");
for (const product of products)
{
    const cover = product.querySelector(".book-cover img");
    if ((cover?.src ?? cover?.dataset.lazyOriginal) !== "https://cdn.readmoo.com/images/r18.png")
    {
        queue.push(async () =>
        {
            if (await isNsfw(product.querySelector(".product-link").href))
            {
                product.classList.add("nsfw");
            }
        });
    }
}

async function isNsfw(url)
{
    try
    {
        const response = await fetch(url, { credentials: "omit" });
        if (response.status === 200)
        {
            const html = await response.text();
            const parser = new DOMParser();
            const page = parser.parseFromString(html, "text/html");

            return (page.getElementById("18x_page") !== null);
        }
    }
    catch (e)
    {
        console.error(e);
    }

    return false;
}
