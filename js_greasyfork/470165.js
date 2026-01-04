// ==UserScript==
// @name         anime365-ext-old
// @namespace    http://tampermonkey.net/
// @version      0.26
// @description  Extension for anime365 and smotret-anime websites
// @author       https://greasyfork.org/ru/users/1065796-kazaev
// @match        https://anime365.ru/catalog/*
// @match        https://anime-365.ru/catalog/*
// @match        https://smotret-anime.com/catalog/*
// @match        https://hentai365.ru/catalog/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anime365.ru
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/470165/anime365-ext-old.user.js
// @updateURL https://update.greasyfork.org/scripts/470165/anime365-ext-old.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function init() {
        let startPlayInterval = setInterval(startPlay, 500);

        let img = createCloseButton();
        document.querySelector(".full-background").after(img);

        document.addEventListener("keydown", function (event) {
            if (event.altKey && event.code === "KeyT") {
                console.log('Alt + T pressed!');
                event.preventDefault();

                toggleTheatreMode();
            }

            if (event.key === "Escape") {
                console.log('Esc pressed!');
                event.preventDefault();

                theatreClose();
            }
        });

        document.querySelector("#theatreClose").onclick = theatreClose;

        function startPlay() {
            console.log("play");
            let playButton = document.querySelector("iframe")?.contentDocument?.querySelector(".vjs-big-play-button");
            if (playButton) {
                playButton.click();
                clearInterval(startPlayInterval);
            }
        }

        function createCloseButton() {
            let img = document.createElement("img");
            img.id = "theatreClose";
            img.style.cssText = "z-index: 20; position: fixed; top: 0; right: 0; margin: 1rem; width: 2rem; display: none;";
            img.src = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xNiA4TDggMTZNMTIgMTJMMTYgMTZNOCA4TDEwIDEwTTIxIDEyQzIxIDE2Ljk3MDYgMTYuOTcwNiAyMSAxMiAyMUM3LjAyOTQ0IDIxIDMgMTYuOTcwNiAzIDEyQzMgNy4wMjk0NCA3LjAyOTQ0IDMgMTIgM0MxNi45NzA2IDMgMjEgNy4wMjk0NCAyMSAxMloiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4=";
            return img;
        }

        function toggleTheatreMode() {
            let videoContainer = document.querySelector(".m-translation-player > .card-image > .video-container");
            if (videoContainer.className.includes("theatre")) {
                theatreClose();
            } else {
                theatreOpen();
            }
        }

        function theatreClose() {
            console.log("closes");
            document.querySelector("#theatreClose").style.display = "none";
            let videoContainer = document.querySelector(".m-translation-player > .card-image > .video-container");
            videoContainer.className = 'video-container';
            document.querySelector("#" + window.theatre.id.replace("\.", "\\.")).remove();
        };

        function theatreOpen() {
            console.log("open");
            let videoContainer = document.querySelector(".m-translation-player > .card-image > .video-container");
            videoContainer.className = 'video-container theatre';
            window.theatre = GM_addStyle(`
                .m-translation-player > .card-image > .video-container {
                    position: fixed;
                    z-index: 10;
                    height: 100vh;
                    width: 100vw;
                    left: 0;
                    top: 0;
                    margin: 0;
                    padding: 0;
                }
                body {
                    overflow: hidden;
                }
            `);
            document.querySelector("#theatreClose").style.display = "";
        };
    }

    function onLoad(fn) {
        document.addEventListener('page:load', fn);
        document.addEventListener('turbolinks:load', fn);

        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    onLoad(init);

})();
