// ==UserScript==
// @name         Анимированные аватарки
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ye
// @author       Artem_Tankov
// @match        https://forum.blackrussia.online/*
// @icon         https://masterpiecer-images.s3.yandex.net/a7a8505187f411eeb3fc5696910b1137:upscaled
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/503806/%D0%90%D0%BD%D0%B8%D0%BC%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/503806/%D0%90%D0%BD%D0%B8%D0%BC%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%B0%D0%B2%D0%B0%D1%82%D0%B0%D1%80%D0%BA%D0%B8.meta.js
// ==/UserScript==

(function() {
    var locked = 0
    function animatedAvatars() {
    locked += 1
    const image = document.querySelectorAll("img")
    console.log("скрипт работает")
    var new_image = image[0];
    for (var i = 1; i < image.length; i++) {
        if (image[i].className.includes("avatar")){

            new_image = image[i]

            if (new_image.width == 192) {
                new_image.src = new_image.src.replace("/l/", "/o/")
            }
            else if (new_image.width == 48 || new_image.width == 24) {
                new_image.src = new_image.src.replace("/s/", "/o/")
            }
                if (new_image.width > new_image.height) {
                    new_image.style.width = "auto"
                    new_image.style.maxWidth = "none"
                    new_image.style.overflow = "visible"
                    new_image.style.height = "100%"
                }
                else if (new_image.width == new_image.height) {
                    new_image.style.maxWidth = "none"
                    new_image.style.overflow = "visible"
                    new_image.style.width = "100%"
                    new_image.style.height = "auto"
                }
                else {
                    new_image.style.width = "100%"
                    new_image.style.height = "auto"
                    new_image.style.maxWidth = "none"
                    new_image.style.overflow = "visible"
            }
        }
    }
}

animatedAvatars()
setTimeout(animatedAvatars, 150)
})();