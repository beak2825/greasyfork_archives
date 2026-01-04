// ==UserScript==
// @name         Drawaria Magic Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       YouTubeDrawaria
// @description  Adds a magic button to drawaria.online that triggers random events
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://drawaria.online/avatar/cache/86e33830-86ea-11ec-8553-bff27824cf71.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529454/Drawaria%20Magic%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/529454/Drawaria%20Magic%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the button
    const magicButton = document.createElement('button');
    magicButton.innerText = 'Press Me!';
    magicButton.style.position = 'fixed';
    magicButton.style.top = '50%';
    magicButton.style.left = '50%';
    magicButton.style.transform = 'translate(-50%, -50%)';
    magicButton.style.width = '200px';
    magicButton.style.height = '200px';
    magicButton.style.borderRadius = '50%';
    magicButton.style.backgroundColor = 'red';
    magicButton.style.color = 'white';
    magicButton.style.fontSize = '32px';
    magicButton.style.fontWeight = 'bold';
    magicButton.style.border = 'none';
    magicButton.style.cursor = 'pointer';
    magicButton.style.zIndex = '9999';

    document.body.appendChild(magicButton);

    // Wild random events array
    const randomEvents = [
        () => invertEverything(),
        () => spawnRandomAnimals(),
        () => glitchScreen(),
        () => gravityShift(),
        () => textExplosion(),
        () => mirrorMode(),
        () => suddenZoom(),
        () => chaosCircles(),
        () => soundAttack(),
        () => elementSwap()
    ];

    // Helper functions
    function getRandomColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16);
    }

    function invertEverything() {
        document.body.style.filter = 'invert(100%)';
        setTimeout(() => document.body.style.filter = '', 1500);
    }

    function spawnRandomAnimals() {
        const animals = ['🐱', '🐶', '🐘', '🦁', '🐧', '🦀', '🐙', '🦄'];
        for (let i = 0; i < 10; i++) {
            const animal = document.createElement('div');
            animal.innerText = animals[Math.floor(Math.random() * animals.length)];
            animal.style.position = 'fixed';
            animal.style.fontSize = Math.random() * 50 + 20 + 'px';
            animal.style.left = Math.random() * 100 + 'vw';
            animal.style.top = Math.random() * 100 + 'vh';
            animal.style.transform = `rotate(${Math.random() * 360}deg)`;
            document.body.appendChild(animal);
            setTimeout(() => animal.remove(), 2000);
        }
    }

    function glitchScreen() {
        const interval = setInterval(() => {
            document.body.style.transform = `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)`;
            document.body.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
        }, 50);
        setTimeout(() => {
            clearInterval(interval);
            document.body.style.transform = '';
            document.body.style.filter = '';
        }, 1000);
    }

    function gravityShift() {
        document.body.style.transition = 'transform 1s';
        document.body.style.transform = `rotate(${Math.random() * 360}deg)`;
        setTimeout(() => {
            document.body.style.transition = '';
            document.body.style.transform = '';
        }, 1000);
    }

    function textExplosion() {
        const words = ['BOOM', 'WOW', 'ZAP', 'POW', 'BAM'];
        for (let i = 0; i < 15; i++) {
            const text = document.createElement('div');
            text.innerText = words[Math.floor(Math.random() * words.length)];
            text.style.position = 'fixed';
            text.style.fontSize = Math.random() * 60 + 20 + 'px';
            text.style.color = getRandomColor();
            text.style.left = Math.random() * 100 + 'vw';
            text.style.top = Math.random() * 100 + 'vh';
            text.style.transform = `rotate(${Math.random() * 360}deg)`;
            document.body.appendChild(text);
            setTimeout(() => text.remove(), 1500);
        }
    }

    function mirrorMode() {
        document.body.style.transform = 'scaleX(-1)';
        setTimeout(() => document.body.style.transform = '', 2000);
    }

    function suddenZoom() {
        const scale = Math.random() * 2 + 0.5;
        document.body.style.transform = `scale(${scale})`;
        document.body.style.transition = 'transform 0.5s';
        setTimeout(() => {
            document.body.style.transform = '';
            document.body.style.transition = '';
        }, 1000);
    }

    function chaosCircles() {
        for (let i = 0; i < 20; i++) {
            const circle = document.createElement('div');
            const size = Math.random() * 100 + 20;
            circle.style.position = 'fixed';
            circle.style.width = size + 'px';
            circle.style.height = size + 'px';
            circle.style.borderRadius = '50%';
            circle.style.backgroundColor = getRandomColor();
            circle.style.left = Math.random() * 100 + 'vw';
            circle.style.top = Math.random() * 100 + 'vh';
            circle.style.opacity = Math.random();
            document.body.appendChild(circle);
            setTimeout(() => circle.remove(), 2000);
        }
    }

    function soundAttack() {
        const sounds = ['BOING!', 'WHEEE!', 'CRASH!', 'BZZZT!', 'POP!'];
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const sound = document.createElement('div');
                sound.innerText = sounds[Math.floor(Math.random() * sounds.length)];
                sound.style.position = 'fixed';
                sound.style.fontSize = '40px';
                sound.style.color = getRandomColor();
                sound.style.left = Math.random() * 100 + 'vw';
                sound.style.top = Math.random() * 100 + 'vh';
                document.body.appendChild(sound);
                setTimeout(() => sound.remove(), 500);
            }, i * 200);
        }
    }

    function elementSwap() {
        const elements = Array.from(document.body.children);
        if (elements.length > 2) {
            const el1 = elements[Math.floor(Math.random() * elements.length)];
            const el2 = elements[Math.floor(Math.random() * elements.length)];
            if (el1 !== el2 && el1 !== magicButton && el2 !== magicButton) {
                const tempStyle = el1.style.cssText;
                el1.style.cssText = el2.style.cssText;
                el2.style.cssText = tempStyle;
                setTimeout(() => {
                    el1.style.cssText = tempStyle;
                    el2.style.cssText = '';
                }, 1000);
            }
        }
    }

    // Button click handler
    magicButton.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * randomEvents.length);
        randomEvents[randomIndex]();
    });

})();