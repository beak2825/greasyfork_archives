// ==UserScript==
// @name         Copy Cat! >:3
// @namespace    http://tampermonkey.net/
// @version      2025-2-12
// @description  CHEAT at picasso!
// @author       CCGameing
// @match        https://*.straw.page/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=straw.page
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526711/Copy%20Cat%21%20%3E%3A3.user.js
// @updateURL https://update.greasyfork.org/scripts/526711/Copy%20Cat%21%20%3E%3A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const picasso = document.querySelector(".picasso")
    const canvas = picasso.childNodes[0]
    const trueCD = canvas.getBoundingClientRect()
    const cw = trueCD.width
    const ch = trueCD.height

    window.pen = canvas.getContext("2d")

    const messages = [
        "Send anonymously 🎨🤫",
        "Send anonymousely 🐁",
        "U so pro!! 😀😉",
        "Hy! no cheating! ❗😡",
        "Wats u draaawiiin? 🙃",
        "Swapdoodle core 🪽💌🪽",
        "Mew Mao! 😸",
        "I feel so sigma! B3",
        ":3c",
        "U is awesome!! nwn",
        "When did this change? :0",
        "*boop* :3"
    ]

    function getRandomMessage() {
        var index = Math.floor(Math.random() * messages.length)
        return messages[index]
    }

    const submitButton = document.querySelector(".sendPicasso > button")

    const extraTools = document.createElement("div")
    extraTools.appendChild(document.querySelector(".toolbox"))
    extraTools.classList.add("toolbox")
    extraTools.id = "uplaodBox"
    document.querySelector(".innerCanvas").appendChild(extraTools)

    const upload = document.createElement("input")
    upload.type = "file"
    extraTools.appendChild(upload)

    const opacity = document.createElement("input")
    opacity.type = "range"
    opacity.min = 0
    opacity.max = 1
    opacity.step = 0.05
    opacity.value = 0.5
    opacity.onchange = () => {
        canvas.style.opacity = opacity.value
    }
    extraTools.appendChild(opacity)

    const image = document.createElement("img")
    image.width = cw
    image.height = ch
    picasso.appendChild(image)

    canvas.style.position = "absolute"
    canvas.style.left = 0
    canvas.style.top = 0

    upload.addEventListener('change', (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                canvas.style.opacity = 0.5
                opacity.value = 0.5
                image.src = e.target.result;
            };

            reader.readAsDataURL(file);

            submitButton.innerHTML = getRandomMessage();
        });

})();