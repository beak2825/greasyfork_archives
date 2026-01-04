// ==UserScript==
// @name               Kadokawa HK: Blurs R-rated Covers
// @name:zh-TW         香港角川：模糊限制級封面
// @description        Blurs the covers of R-rated books at Kadokawa HK.
// @description:zh-TW  模糊香港角川限制級書本的封面。
// @icon               https://icons.duckduckgo.com/ip3/www.kadokawa.com.hk.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.2.0
// @license            MIT
// @match              https://www.kadokawa.com.hk/
// @match              https://www.kadokawa.com.hk/products
// @match              https://www.kadokawa.com.hk/products?*
// @match              https://www.kadokawa.com.hk/categories/*
// @match              https://www.kadokawa.com.hk/products/*
// @run-at             document-end
// @grant              none
// @require            https://update.greasyfork.org/scripts/483122/1304475/style-shims.js
// @supportURL         https://greasyfork.org/scripts/487288/feedback
// @downloadURL https://update.greasyfork.org/scripts/487288/Kadokawa%20HK%3A%20Blurs%20R-rated%20Covers.user.js
// @updateURL https://update.greasyfork.org/scripts/487288/Kadokawa%20HK%3A%20Blurs%20R-rated%20Covers.meta.js
// ==/UserScript==

GM.addStyle(`
    .product-item.nsfw img
    {
        filter: blur(var(--nsfw-blur-radius, 7.5px));
        transition: filter var(--nsfw-transition-duration, 0.3s);
    }

    .product-item.nsfw:hover img, .product-item.nsfw:focus-within img
    {
        filter: blur(0px);
    }
`);

const products = document.querySelectorAll(".product-item");
for (const product of products)
{
    const label = product.querySelector(".product-customized-labels");
    if (label?.innerText === "限制級")
    {
        product.classList.add("nsfw");
    }
}
