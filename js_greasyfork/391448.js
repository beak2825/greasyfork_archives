// ==UserScript==
// @name IXL
// @namespace Violentmonkey Scripts
// @match https://www.ixl.com/awards/*
// @grant none
// @description It adds confetti to the ixl awards screen!
// @icon https://www.ixl.com/ixl-favicon.png
// @version 1.2
// @author Bryant Robinson
// @downloadURL https://update.greasyfork.org/scripts/391448/IXL.user.js
// @updateURL https://update.greasyfork.org/scripts/391448/IXL.meta.js
// ==/UserScript==
(function() {
    const options = {
        'text': "'" ,
        'size': 150,
        'weight': 800,
        'speed': 2500
    }

    for (let i = 0; i < 100; i++) {
        let element = document.createElement('div');
        element.className = 'floatingElements'
        element.style = `width: 100%; height: 100%; margin: auto; pointer-events: none; user-select: none; font-weight: ${options.weight}; font-size: ${options.size}px; position: absolute; z-index: 2147483647; transition: all ${options.speed/1000}s linear; transform-origin: center center; text-align: center;`;
        element.textContent = options.text;

        document.body.appendChild(element);
    }

    setInterval(() => {
        let elements = document.getElementsByClassName('floatingElements');
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.color = color();
            elements[i].style.opacity = Math.random() + .1;
            elements[i].style.transform = `rotate(${random(0,360)}deg) translate(${random(-1000,1000)}px, ${random(-500,500)}px) translate3d(${random(0,200)}px,${random(0,200)}px,${random(0,200)}px) rotateX(${random(0,360)}deg) rotateY(${random(0,360)}deg) rotateZ(${random(0,360)}deg)`;
        }
    }, options.speed);

    function random(min, max) { return Math.floor(Math.random() * (max - min) + min); }

    function color() { return ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'][Math.floor(Math.random() * 7)]; }
})();