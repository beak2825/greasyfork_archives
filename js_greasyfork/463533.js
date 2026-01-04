// ==UserScript==
// @name               ChatGPT Remove Profile Picture
// @namespace          fabulous.cupcake.jp.net
// @version            2023.04.08.1
// @author             FabulousCupcake
// @description        Remove profile picture in chatgpt site
// @license            MIT
// @icon               https://chat.openai.com/favicon.ico
// @match              https://chat.openai.com/chat*
// @run-at             document-idle
// @downloadURL https://update.greasyfork.org/scripts/463533/ChatGPT%20Remove%20Profile%20Picture.user.js
// @updateURL https://update.greasyfork.org/scripts/463533/ChatGPT%20Remove%20Profile%20Picture.meta.js
// ==/UserScript==

const removeImages = () => {
    const imgs = Array.from(document.querySelectorAll(`img[alt*="@"]`));
    imgs.forEach(img => img.remove())
}

const waitForElementToExist = (selector, action) => {
    const elm = document.querySelector(selector);

    if (elm !== null) return action(elm);
    setTimeout(waitForElementToExist.bind(null, selector, action), 1000);
};

const main = () => {
    waitForElementToExist(`img[alt*="@"]`, removeImages);
}

main();