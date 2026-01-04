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
// @downloadURL https://update.greasyfork.org/scripts/489905/fedia%20click%20and%20drag%20image%20resize.user.js
// @updateURL https://update.greasyfork.org/scripts/489905/fedia%20click%20and%20drag%20image%20resize.meta.js
// ==/UserScript==

const target = document.querySelector("#content").children[0];
const observerConfig = { attributes: true, childList: true, subtree: true };
const observer = new MutationObserver(() => updatePosts());
observer.observe(target, observerConfig);
updatePosts(target);

function updatePosts() {
    try {
        const images = document.querySelectorAll('div.preview a.embed-link img')
        images.forEach((image) => {
            if (!image.ondragstart) {
                image.addEventListener("dragstart", (event) => {
                    event.preventDefault();
                });
            }

            if (!image.onmousedown) {
                image.addEventListener("mousedown", (event) => {
                    handleResize(event, image, "start");
                });
            }

            if (!image.onmouseup) {
                document.body.addEventListener("mouseup", (event) => {
                    handleResize(event, image, "end");
                });
            }

            if (!image.onmousemove) {
                image.addEventListener("mousemove", (event) => {
                    handleResize(event, image, "move");
                });
            }
        })
    } catch (err) {
        console.log("ERROR: function updatePosts: ", err);
    }
}

function handleResize(event, image, type) {
    console.log("[handleResize]: ", "event: ", event, "image: ", image, "type: ", type)
}