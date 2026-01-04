// ==UserScript==
// @name               SPP Store: Blurs R-rated Covers
// @name:zh-TW         尖端網路書店：模糊限制級封面
// @description        Blurs the covers of R-rated books at SPP Store.
// @description:zh-TW  模糊尖端網路書店限制級書本的封面。
// @icon               https://wsrv.nl/?url=https://www.spp.com.tw/Source/images/zh-cht/icons/192192.png
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.2.0
// @license            MIT
// @match              https://www.spp.com.tw/
// @match              https://www.spp.com.tw/productlist
// @match              https://www.spp.com.tw/productlist?*
// @match              https://www.spp.com.tw/product?*
// @run-at             document-end
// @grant              none
// @require            https://update.greasyfork.org/scripts/483122/1304475/style-shims.js
// @supportURL         https://greasyfork.org/scripts/483239/feedback
// @downloadURL https://update.greasyfork.org/scripts/483239/SPP%20Store%3A%20Blurs%20R-rated%20Covers.user.js
// @updateURL https://update.greasyfork.org/scripts/483239/SPP%20Store%3A%20Blurs%20R-rated%20Covers.meta.js
// ==/UserScript==

GM.addStyle(`
    :is(.item, .df_item, .df_item1).nsfw .df_mask
    {
        display: none !important;
    }

    :is(.item, .df_item, .df_item1).nsfw :is(.df_img, .bd_left > a > img)
    {
        filter: blur(var(--nsfw-blur-radius, 7.5px));
        transition: filter var(--nsfw-transition-duration, 0.3s);
    }

    :is(.item, .df_item, .df_item1).nsfw:hover :is(.df_img, .bd_left > a > img), :is(.item, .df_item, .df_item1).nsfw:focus-within :is(.df_img, .bd_left > a > img)
    {
        filter: blur(0px);
    }
`);

const products = document.querySelectorAll(".item, .df_item, .df_item1");
for (const product of products)
{
    if (product.querySelector(".df_r18") !== null)
    {
        product.classList.add("nsfw");
    }
}
