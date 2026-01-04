// ==UserScript==
// @name         MyAnimeList(MAL) - Thumbnail Switch
// @namespace    https://greasyfork.org/users/16080
// @version      1.0.4
// @description  When on an anime/manga/character page, you will automatically cycle through other available pictures.
// @author       Cpt_mathix
// @match        https://myanimelist.net/anime/*
// @match        https://myanimelist.net/manga/*
// @match        https://myanimelist.net/character/*
// @match        https://myanimelist.net/anime.php?*
// @match        https://myanimelist.net/manga.php?*
// @match        https://myanimelist.net/character.php?*
// @exclude      /^https?:\/\/myanimelist\.net\/(anime|manga|character)\/[^0-9]+/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376271/MyAnimeList%28MAL%29%20-%20Thumbnail%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/376271/MyAnimeList%28MAL%29%20-%20Thumbnail%20Switch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // find image in html + get anime/manga/character id
    let anchor = document.getElementById("addtolist") || document.getElementById("profileRows");
    let canvas = anchor.parentElement.firstElementChild.firstElementChild;
    let image = canvas.firstElementChild;
    let id = canvas.href.match(/\/\d+\//g)[0].replace(/\//g, "");

    // get type (anime/manga/character)
    let type;
    if (/https:\/\/myanimelist.net\/anime\/.*/.test(canvas.href)) {
        type = "anime";
    } else if (/https:\/\/myanimelist.net\/manga\/.*/.test(canvas.href)) {
        type = "manga";
    } else if (/https:\/\/myanimelist.net\/character\/.*/.test(canvas.href)) {
        type = "characters";
    }

    // remove default click behavior
    canvas.href = "javascript:;";

    // change some styling for image cycling
    canvas.style.position = "relative";
    canvas.style.height = "350px";
    canvas.style.display = "block";
    image.style.transition = "opacity 1s ease-in-out";

    let curr = 0;
    let images = null;

    // fetch all images for given type and id
    fetch('https://api.jikan.moe/v4/' + type + '/' + id + '/pictures').then(function(response) {
        return response.json();
    }).then(function(json) {
        images = json.data;

        // shuffle images in random order
        for (let i = images.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [images[i], images[j]] = [images[j], images[i]];
        }

        // make sure that the first random image is not the default image
        if (images[0].small === image.src) {
            images.push(images.shift());
        }

        cycle();

        // cycle through images each 3000ms (3s)
        setInterval(cycle, 3000);
    });

    // cycle when clicking
    canvas.addEventListener("click", function(event) {
        event.preventDefault();

        if (images) {
            cycle();
        }
    });

    function cycle() {
        if (++curr === images.length) {
            curr = 0;
        }

        let new_image = document.createElement("img");
        new_image.classList.add("ac");
        new_image.setAttribute("style", "width: 100%; max-height: 350px; position: absolute; opacity: 1; transition: opacity 1s ease-in-out;");
        new_image.onload = function() {
            canvas.insertBefore(new_image, canvas.firstChild);
            canvas.children[0].style.opacity = 100;
            canvas.children[1].style.opacity = 0;

            setTimeout(function() {
                canvas.children[0].style.position = "";
                canvas.children[1].remove()
            }, 1000);
        }

        let next_image_src = images[curr].jpg.image_url;
        new_image.src = next_image_src;
    }
})();