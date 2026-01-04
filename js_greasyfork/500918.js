// ==UserScript==
// @name         Fanvue Image Download
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  directly download images from fanvue
// @author       x.scape
// @match        https://www.fanvue.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fanvue.com
// @grant        none
// @license      Apache License, 2.0
// @downloadURL https://update.greasyfork.org/scripts/500918/Fanvue%20Image%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/500918/Fanvue%20Image%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const ADDON_NAME = "tpmk_fanvue_img_dl";

    function createTailwindScript() {
        let script = document.createElement("script");
        script.setAttribute("src", "https://cdn.tailwindcss.com");
        return script;
    }
    document.querySelector("head").append(createTailwindScript());

    function elementVisible(elem) {
        const { top, left, bottom, right } = elem.getBoundingClientRect();
        const { innerHeight, innerWidth } = window;
        return ((top > 0 && top < innerHeight) || (bottom > 0 && bottom < innerHeight)) && ((left > 0 && left < innerWidth) || (right > 0 && right < innerWidth));
    }

    function getLoadedImages() {
        return Array.from(document.querySelectorAll("img.MuiBox-root"));
    }

    function reduceLoadedImages() {
        let imgList = getLoadedImages();
        let loaded = [];
        imgList.forEach((img) => {
            if (elementVisible(img) && !(img.classList.contains(".mui-14baudc")))
                loaded.push(img);
        });
        return loaded;
    }

    function downloadBtn() {
        let btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.setAttribute("class", "absolute top-4 left-4 backdrop-filter backdrop-blur-sm bg-opacity-10 text-white font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2");
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>';
        return btn;
    }

    async function download(url, profile) {
        const image = await fetch(url);
        const imageBlob = await image.blob();
        const imageURL = URL.createObjectURL(imageBlob);

        const link = document.createElement("a");
        link.href = imageURL;
        link.download = `${profile}_-_${Date.now()}`;
        link.target = "_blank";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function getImageSource(sourceSet) {
        return sourceSet.srcset.split("1x, ")[1].split(" 2x")[0];
    }

    document.addEventListener("scrollend", () => {
        let visibleImages = reduceLoadedImages();
        visibleImages.forEach((img) => {
            if (!img.parentElement.classList.contains("relative")) {
                let btn = downloadBtn();
                img.parentElement.classList.add("relative");
                img.parentElement.append(btn);
                btn.addEventListener("click", (event) => {
                    console.log(event.target.parentElement.closest("div.MuiBox-root"), event.target.parentElement.closest("li.slide"));
                    let parent = event.target.parentElement.closest("li.slide") != null ? event.target.parentElement.closest("li.slide") : event.target.parentElement.closest("div.MuiBox-root");
                    console.log(parent);
                    let img = parent.querySelector("img");
                    let src = getImageSource(img);
                    download(src, document.querySelector("#profileHeader > section > div.MuiBox-root.mui-1kpdnj > p").textContent);
                });
            }
        });
    });
})();