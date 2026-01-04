// ==UserScript==
// @name         Blur NSFW
// @namespace    http://github.com/yuzulabo
// @version      1.0.2
// @description  NSFWをぼかしていい感じに見れるやつ
// @author       nzws / ねじわさ
// @match        https://knzk.me/*
// @match        https://mastodon.cloud/*
// @match        https://friends.nico/*
// @match        https://mstdn.jp/*
// @license       MIT License
// @downloadURL https://update.greasyfork.org/scripts/373909/Blur%20NSFW.user.js
// @updateURL https://update.greasyfork.org/scripts/373909/Blur%20NSFW.meta.js
// ==/UserScript==

(function() {
    const mainElem = document.getElementById('mastodon');
    if (!mainElem) return;

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            let node = mutation.addedNodes;
            let i = 0;
            while (node[i]) {
                if (node[i].tagName) {
                    let image = node[i].querySelector('.media-gallery');
                    if (image) {
                        if (image.children[1].className === 'media-spoiler') {
                            image.children[1].click();
                            let p = 1;
                            while (image.children[p]) {
                                image.children[p].className += ' image_blur';
                                p++;
                            }
                        }
                    }
                }
                i++;
            }
        });
    });

    observer.observe(mainElem, { childList: true, subtree: true });

    const style = document.createElement("style");
    style.innerHTML = ".image_blur {filter: blur(4px)}";
    document.querySelector("head").appendChild(style);
})();