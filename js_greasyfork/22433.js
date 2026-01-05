// ==UserScript==
// @name VK-Center
// @description Картинки в ленте по центру
// @author Last8Exile
// @license MIT
// @version 1.1
// @noframes
// @include *://vk.com/*
// @namespace https://greasyfork.org/users/61164
// @downloadURL https://update.greasyfork.org/scripts/22433/VK-Center.user.js
// @updateURL https://update.greasyfork.org/scripts/22433/VK-Center.meta.js
// ==/UserScript==


(function()
{
    'use stict';
    if (window.top != window.self)
        return;

    var isUpdated;
    refresh();
    document.body.addEventListener("DOMNodeInserted",check);
    setInterval(check,10000);

    function check()
    {
        if (isUpdated)
        {
            refresh();
            isUpdated = false;
            setTimeout(refresh,1000);
        }
    }

    function refresh()
    {
        var style;
        var imageBoxes = document.querySelectorAll("div.page_post_sized_thumbs");
        for (var item of imageBoxes)
        {
            style = item.getAttribute("style");
            if (!style.includes("margin"))
                item.setAttribute("style",style+" margin: auto;");
        }

        var stickers = document.querySelectorAll("div.im_sticker_row");
        for (var sticker of stickers)
        {
            style = sticker.getAttribute("style");
            if (style === null)
                sticker.setAttribute("style","text-align: center");
        }
        isUpdated = true;
    }
})();