// ==UserScript==
// @name               Ching Win Publishing: Blurs R-rated Covers
// @name:zh-TW         青文出版：模糊限制級封面
// @description        Blurs the covers of R-rated books on Ching Win Publishing.
// @description:zh-TW  模糊青文出版限制級書本的封面。
// @icon               https://icons.duckduckgo.com/ip3/www.ching-win.com.tw.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.2.0
// @license            MIT
// @match              https://www.ching-win.com.tw/
// @match              https://www.ching-win.com.tw/chingwin/
// @match              https://www.ching-win.com.tw/searchall-products/*
// @match              https://www.ching-win.com.tw/products/*
// @match              https://www.ching-win.com.tw/product-detail/*
// @grant              https://www.ching-win.com.tw/activities1/*
// @run-at             document-end
// @inject-into        content
// @grant              none
// @require            https://update.greasyfork.org/scripts/483122/1304475/style-shims.js
// @require            https://update.greasyfork.org/scripts/482311/1297431/queue.js
// @supportURL         https://greasyfork.org/scripts/487252/feedback
// @downloadURL https://update.greasyfork.org/scripts/487252/Ching%20Win%20Publishing%3A%20Blurs%20R-rated%20Covers.user.js
// @updateURL https://update.greasyfork.org/scripts/487252/Ching%20Win%20Publishing%3A%20Blurs%20R-rated%20Covers.meta.js
// ==/UserScript==

GM.addStyle(`
    .productBox.nsfw :is(img.newproducts-pic, img.sellhot-pic, .productImg:not(.HITS_BT), .productImg.HITS_BT > span),
    .showcase-006 .productBox.nsfw img,
    .sellList-item.nsfw img,
    :is(.other, .historybox, .recommend) .slideitem.nsfw img:is(.other-pic, .history-pic, .recommend-pic)
    {
        filter: blur(var(--nsfw-blur-radius, 7.5px));
        transition: filter var(--nsfw-transition-duration, 0.3s);
    }

    .productBox.nsfw:hover :is(img.newproducts-pic, img.sellhot-pic, .productImg:not(.HITS_BT), .productImg.HITS_BT > span), .productBox.nsfw:focus-within :is(img.newproducts-pic, img.sellhot-pic, .productImg:not(.HITS_BT), .productImg.HITS_BT > span),
    .showcase-006 .productBox.nsfw:hover img, .showcase-006 .productBox.nsfw:focus-within img,
    .sellList-item.nsfw:hover img, .sellList-item.nsfw:focus-within img,
    :is(.other, .historybox, .recommend) .slideitem.nsfw:hover img:is(.other-pic, .history-pic, .recommend-pic), :is(.other, .historybox, .recommend) .slideitem.nsfw:focus-within img:is(.other-pic, .history-pic, .recommend-pic)
    {
        filter: blur(0px);
    }
`);

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

            const elements = page.querySelectorAll(".line-inbox");
            return Array.prototype.some.call(elements, (element) => (element.innerText.trim() === "級別：18限"));
        }
    }
    catch (e)
    {
        console.error(e);
    }

    return false;
}

const queue = new Queue({ autostart: true, concurrency: 20 });
queue.addEventListener("error", (event) => console.error(event.detail.error));

const observer = new MutationObserver(blurBookCovers);
document.querySelectorAll("#Main_Content")
        .forEach((element) => observer.observe(element, { childList: true }));

blurBookCovers();

function blurBookCovers()
{
    const products = document.querySelectorAll(".productBox, .sellList-item, :is(.other, .historybox, .recommend) .slideitem");
    for (const product of products)
    {
        if (product.querySelector(".icon-18") !== null)
        {
            product.classList.add("nsfw");
        }
        else
        {
            queue.push(async () =>
            {
                if (await isNsfw(product.querySelector("a").href))
                {
                    product.classList.add("nsfw");
                }
            });
        }
    }
}
