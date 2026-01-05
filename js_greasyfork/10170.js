// ==UserScript==
// @name        AQW Wiki Link Preview
// @description Adds image previews for links on the official AQW Wiki
// @namespace   Lamp
// @license     GNU GPLv3
// @include     *aqwwiki.wikidot.com/*
// @include     *wqa.wikidot.com/*
// @version     2.0.1
// @downloadURL https://update.greasyfork.org/scripts/10170/AQW%20Wiki%20Link%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/10170/AQW%20Wiki%20Link%20Preview.meta.js
// ==/UserScript==




let currentMousePos = { x: -1, y: -1 };
let hoverTimeout = null;
let lastHoveredElement = null;

document.addEventListener("mousemove", (event) => {
    currentMousePos.x = event.pageX;
    currentMousePos.y = event.pageY;
});

const excludedTerms = [
    "image-tags",
    "classes-skills",
    "AQWPassive",
    "quantserve",
    "statcounter",
    "avatar.php"
];

function isNotHidden(img) {
    let currentElement = img.parentElement;
    while (currentElement) {
        const inlineStyle = currentElement.getAttribute("style");
        if (inlineStyle && inlineStyle.includes("display:none")) {
            return false;
        }
        currentElement = currentElement.parentElement;
    }
    return true;
}

function isValidImageElement(img) {
    const src = img.getAttribute("src");

    if (!src || excludedTerms.some(term => src.includes(term))) {
        return false;
    }

    return true;
}

async function fetchAndParse(url) {
    const response = await fetch(url);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    return doc;
}

function extractImages(doc) {
    const images = [];
    const hasFemale = Array.from(doc.querySelectorAll("em")).some(em => em.textContent.trim() === "Female");

    if (hasFemale) {
        const maleContainers = doc.querySelectorAll("#wiki-tab-0-0");
        const femaleContainers = doc.querySelectorAll("#wiki-tab-0-1");

        let maleImage = null;
        let femaleImage = null;

        for (const maleContainer of maleContainers) {
            const img = maleContainer.querySelector("img");
            if (isValidImageElement(img)) {
                maleImage = img;
                break;
            }
        }

        for (const femaleContainer of femaleContainers) {
            const img = femaleContainer.querySelector("img");
            if (isValidImageElement(img)) {
                femaleImage = img;
                break;
            }
        }

        if (maleImage) {
            images.push(maleImage.getAttribute("src"));
        }
        if (femaleImage) {
            images.push(femaleImage.getAttribute("src"));
        }
    }

    if (images.length === 0) {
        const allImages = Array.from(doc.querySelectorAll("img"));
        for (const img of allImages) {
            if (isValidImageElement(img) && isNotHidden(img)) {
                images.push(img.getAttribute("src"));
                break;
            }
        }
    }

    return images;
}

function createPreviewElement(images) {
    const preview = document.createElement("div");
    preview.id = "preview";
    preview.style.position = "absolute";
    preview.style.zIndex = "9999";
    preview.style.backgroundColor = "transparent";
    preview.style.display = "flex";

    let maxHeight = "400px";
    if (images.length === 2) {
        maxHeight = "600px";
        preview.style.width = "auto";
    }

    images.forEach((src) => {
        const img = document.createElement("img");
        img.src = src;
        img.style.maxHeight = maxHeight;
        img.style.display = "block";
        preview.appendChild(img);
    });

    return preview;
}

function removeAllPreviews() {
    document.querySelectorAll("#preview").forEach(preview => preview.remove());
    if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
    }
    lastHoveredElement = null;
}

document.addEventListener("mouseenter", (event) => {
    if (event.target.matches("a.item, div.item > div > a, div.title > a, div.list-pages-item > p > a, div.collapsible-block-content > a, div.collapsible-block-content > p > a, div.yui-content > div > a, div.yui-content > div > p > a, div.list-pages-box > p > a, #page-content > ul > li > a, #page-content > ul > li > span > a, #page-content > ul > li > ul > li > a, div.yui-content > div > ul > li > ul > li > a, #page-content > a, #page-content > p > a, tr > td > a, .yui-content > div > ul > li > a")) {
        removeAllPreviews();

        const url = event.target.href;
        lastHoveredElement = event.target;

        hoverTimeout = setTimeout(async () => {
            if (lastHoveredElement !== event.target) return;

            const doc = await fetchAndParse(url);
            const images = extractImages(doc);
            const preview = createPreviewElement(images);

            document.body.appendChild(preview);
            preview.style.top = `${currentMousePos.y - 200}px`;
            preview.style.left = `${currentMousePos.x + 100}px`;

            const removePreview = () => removeAllPreviews();
            event.target.addEventListener("mouseleave", removePreview, { once: true });
            preview.addEventListener("mouseleave", removePreview, { once: true });
        }, 250);
    }
}, true);




