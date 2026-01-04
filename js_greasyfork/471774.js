// ==UserScript==
// @name               ESJ Zone: Blurs NSFW Covers
// @name:zh-TW         ESJ Zone：模糊 18+ 封面
// @name:zh-CN         ESJ Zone：模糊 18+ 封面
// @description        Blurs the covers of NSFW novels on ESJ Zone.
// @description:zh-TW  模糊 ESJ Zone 18+ 小說的封面。
// @description:zh-CN  模糊 ESJ Zone 18+ 小说的封面。
// @icon               https://icons.duckduckgo.com/ip3/www.esjzone.cc.ico
// @author             Jason Kwok
// @namespace          https://jasonhk.dev/
// @version            1.2.0
// @license            MIT
// @match              https://www.esjzone.cc/
// @match              https://www.esjzone.cc/update
// @match              https://www.esjzone.cc/update/
// @match              https://www.esjzone.cc/list
// @match              https://www.esjzone.cc/list/
// @match              https://www.esjzone.cc/list-*
// @match              https://www.esjzone.cc/tags/*
// @match              https://www.esjzone.cc/tags-*
// @match              https://www.esjzone.me/
// @match              https://www.esjzone.me/update
// @match              https://www.esjzone.me/update/
// @match              https://www.esjzone.me/list
// @match              https://www.esjzone.me/list/
// @match              https://www.esjzone.me/list-*
// @match              https://www.esjzone.me/tags/*
// @match              https://www.esjzone.me/tags-*
// @run-at             document-idle
// @grant              GM.addStyle
// @supportURL         https://greasyfork.org/scripts/471774/feedback
// @downloadURL https://update.greasyfork.org/scripts/471774/ESJ%20Zone%3A%20Blurs%20NSFW%20Covers.user.js
// @updateURL https://update.greasyfork.org/scripts/471774/ESJ%20Zone%3A%20Blurs%20NSFW%20Covers.meta.js
// ==/UserScript==

GM.addStyle(`
    .card.nsfw .product-badge
    {
        z-index: 1;
    }

    .card.nsfw .main-img > div
    {
        filter: blur(var(--nsfw-blur-radius, 7.5px));
        transition: filter var(--nsfw-transition-duration, 0.3s);
    }

    .card.nsfw:hover .main-img > div, .card.nsfw:focus-within .main-img > div
    {
        filter: blur(0px);
    }
`);

const badges = document.querySelectorAll(".card .product-badge");
for (const badge of badges)
{
    badge.parentElement.classList.add("nsfw");
}
