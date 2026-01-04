// ==UserScript==
// @name         flying apples
// @namespace    http://tampermonkey.net/
// @version      2025-01-19
// @description  flying apples from catliife
// @author       https://m.vk.com/modsforcatlife?from=groups
// @match        https://worldcats.ru/play/
// @match        https://worldcats.ru/play/?v=b
// @match        https://catlifeonline.com/play/
// @match        https://catlifeonline.com/play/?v=b
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catlifeonline.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545335/flying%20apples.user.js
// @updateURL https://update.greasyfork.org/scripts/545335/flying%20apples.meta.js
// ==/UserScript==

// Создаём плавающие объекты
for (let i = 0; i < 15; i++) {
    const element = document.createElement("img");
    element.src = "https://worldcats.ru/play/v340/entity/apple/apple.png";
    element.alt = "Leaf";
    element.style.position = "fixed";
    element.style.width = `${Math.random() * 20 + 10}px`;
    element.style.height = "auto";
    element.style.left = `${Math.random() * 100}vw`;
    element.style.top = `${Math.random() * 100}vh`;
    element.style.animation = `float ${Math.random() * 10 + 5}s infinite ease-in-out`;
    document.body.appendChild(element);
}

// CSS (можно добавить через <style>)
const style = document.createElement("style");
style.textContent = `
@keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-50px) rotate(10deg); }
}
`;
document.head.appendChild(style);