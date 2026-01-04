// ==UserScript==
// @name VK-2ImageWallpaper
// @description 2 Image Wallpaper
// @author CharaDemon
// @version 1.0
// @noframes
// @include *://vk.com/*
// @icon https://vk.com/doc209007806_612533447
// @namespace greasyfork.org/users/807662
// @downloadURL https://update.greasyfork.org/scripts/431234/VK-2ImageWallpaper.user.js
// @updateURL https://update.greasyfork.org/scripts/431234/VK-2ImageWallpaper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.top != window.self)
        return;

    document.body.addEventListener("DOMNodeInserted",refresh); //Событие добавление элемента в дерево. Один из немногих способов вообще понять, что мы попали на другую страницу внутри вк.

    function refresh()
    {
        var profile = document.querySelector("#profile"); //Ищем профиль (так как если профиля нет, то и блока с картинками тоже).
        var updated;
        if (profile === null) //Если профиля на странице нет, то выходим.
            return;

        updated = profile.getAttribute("slides");
        if (updated !== null)  //Если уже поправили картинки, то выходим.
            return;


        var slideModule = document.querySelector(".page_photos_module");
        if (slideModule === null) //Есть вероятность, что не вся страница прогрузилась, поэтому чтобы не спамить в консоль ошибками - выходим.
            return;
        slideModule.setAttribute("style","padding: 0;"); //Убираем отступы, попутно делая поле для картинок больше.

        var slides = document.querySelectorAll(".page_square_photo");
        if (slides.length != 2) //Если прогрузились не все картинки, то выходим. Поправим их чуть позже.
            return;
        for (var slide of slides)
        {
            var style = slide.getAttribute("style"); //Не теряем ссылку на картинку.
            slide.setAttribute("style",style+"; background-size: contain; margin-left: -27px; width: 150px;");//Тут уже праим сами картинки, чтобы они отображались полностью, крупнее, и без пропусков.
        }

        profile.setAttribute("slides","updated"); //Записываем, что картинки поправлены (чтобы не переправлять их множество раз).
    }
})();