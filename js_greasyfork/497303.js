// ==UserScript==
// @name            fedia click and drag image resize
// @description     Allows click and drag image resize on fedia
// @author          ShaunaTheDead86
// @namespace       http://tampermonkey.net/
// @version         0.1
// @license MIT
// @match           https://kbin.social/*
// @match           https://fedia.io/*
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/497303/fedia%20click%20and%20drag%20image%20resize.user.js
// @updateURL https://update.greasyfork.org/scripts/497303/fedia%20click%20and%20drag%20image%20resize.meta.js
// ==/UserScript==

const target = document.querySelector("#content").children[0];
const observerConfig = { attributes: true, childList: true, subtree: true };
const observer = new MutationObserver(() => updatePosts());
observer.observe(target, observerConfig);
updatePosts(target);

function updatePosts() {
    try {
        document.querySelectorAll('div.preview a.embed-link img').forEach((image) => {
            image.attributes.draggable = true;

            image.ondrag = (event, image) => ondrag(event, image)
            image.ondragover = (event, image) => ondrag(event, image)
            image.ondragstart = (event, image) => ondrag(event, image)
            image.ondragentry = (event, image) => ondrag(event, image)

            image.ondrop = (event, image) => ondrop(event, image)
            image.ondragend = (event, image) => ondrop(event, image)
            image.ondragleave = (event, image) => ondrop(event, image)
        })
    } catch (err) {
        console.log("ERROR: function updatePosts: ", err);
    }
}

function ondrag(event, image) {
    event.preventDefault();
    console.log('ondrag')
    image.style.maxWidth = "100%"
    image.style.minWidth = "10%"
    const { x, y } = event;
    console.log({ x, y });
}

function ondrop(event, image) {
    event.preventDefault();
    console.log('ondrop')
    image.style.maxWidth = "100%"
    image.style.minWidth = "10%"
    const { x, y } = event;
    console.log({ x, y });
}