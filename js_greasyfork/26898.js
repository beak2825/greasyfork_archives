// ==UserScript==
// @name VK-Gif
// @description Gif на аватар VK
// @author Last8Exile
// @license MIT
// @version 1.35
// @noframes
// @match *://vk.com/*
// @namespace https://greasyfork.org/users/61164
// @downloadURL https://update.greasyfork.org/scripts/26898/VK-Gif.user.js
// @updateURL https://update.greasyfork.org/scripts/26898/VK-Gif.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.top != window.self)
        return;

    document.body.addEventListener("DOMNodeInserted",refresh);
    refresh();

    function refresh()
    {
        var profile = document.querySelector(".Profile");
        var updated;
        if (profile === null)
            return;

        updated = profile.getAttribute("avatar");
        if (updated !== null)
            return;

        var statusBar = document.querySelector(".ProfileInfo__status");
        if (statusBar === null)
            return;
        var statusText = statusBar.innerText;
        var posDocument = statusText.lastIndexOf("<!>");
        var posInternet = statusText.lastIndexOf("<?>");

        var avatar = document.querySelector(".vkuiImageBase__img");
        if (avatar === null)
            return;

        if (posDocument >= 0)
        {
            var link = statusText.slice(posDocument+3);

            var request = new XMLHttpRequest();

            var page = document.createElement("div");

            var qr = new XMLHttpRequest();
            qr.open('get',link);
            qr.send();
            qr.onreadystatechange=function()
            {
                if (this.responseText === "")
                    return;
                updated = profile.getAttribute("avatar");
                if (updated !== null)
                    return;

                page.innerHTML=this.responseText;
                var image = page.querySelector("img");
                var imageSrc = image.src;
                var questPos = imageSrc.lastIndexOf("?");
                var gifLink = imageSrc.slice(0,questPos);

                GetMeta(gifLink,function(w,h) {avatar.height = CalcHeight(w,h,avatar.width);});
                avatar.src = gifLink;
                statusBar.innerText = statusText.slice(0,posDocument); //Удалите эту строчку чтобы скрипт оставлял ссылку на картинку в статусе.
                profile.setAttribute("avatar","updated");
            };
        }
        else if (posInternet >= 0)
        {
            var gifLink = statusText.slice(posInternet+3);
            GetMeta(gifLink,function(w,h) {avatar.height = CalcHeight(w,h,avatar.width);});
            avatar.src = gifLink;
            statusBar.innerText = statusText.slice(0,posInternet); //Удалите эту строчку чтобы скрипт оставлял ссылку на картинку в статусе.
            profile.setAttribute("avatar","updated");
        }
        else
        {
            profile.setAttribute("avatar","updated");
            return;
        }
    }
    function CalcHeight(nWidth, nHeight, defWidth)
    {
        var coef = 1.0*nWidth/defWidth;
        return nHeight/coef;
    }
    function GetMeta(url, callback)
    {
        var img = new Image();
        img.src = url;
        img.onload = function() { callback(this.width, this.height); };
    }
})();