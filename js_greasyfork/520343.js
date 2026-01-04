// ==UserScript==
// @name         Drawaria online Sprunki Mod
// @namespace    http://tampermonkey.net/
// @version      2024-12-10
// @description  Play with sprunki in drawaria!
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520343/Drawaria%20online%20Sprunki%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/520343/Drawaria%20online%20Sprunki%20Mod.meta.js
// ==/UserScript==

(function() {
'use strict';


// URLs for the GIFs and sound
const characters = {
    'Simon': 'https://media.tenor.com/PC9Ok1UuCC0AAAAj/yellow-simon.gif',
    'Raddy': 'https://i.redd.it/sprunki-gifs-v0-diqq9hwgx61e1.gif?width=250&auto=webp&s=3792ec0ed996c1f97de4be3eb58021c6ea6821d0',
    'Garnlod': 'https://i.redd.it/4b5t1mvgx61e1.gif',
    'Wenda': 'https://static.wikia.nocookie.net/incredibox-sprunki/images/b/bd/WendaSing.gif'
};
const soundUrl = 'https://static.wikia.nocookie.net/incredibox-sprunki/images/4/4b/Yellowsinging.wav';

// Create the Sprunki character
const sprunki = document.createElement('img');
sprunki.src = characters['Simon'];
sprunki.style.position = 'absolute';
sprunki.style.left = '50px';
sprunki.style.top = '50px';
sprunki.style.width = '150px';
sprunki.style.height = '200px';
document.body.appendChild(sprunki);

// Create the audio element
const audio = new Audio(soundUrl);
audio.loop = true;

// Random phrases for the text bubbles
const phrases = [
    'Hello!',
    'How are you?',
    'Let\'s play!',
    'Draw something!',
    'I am Sprunki!'
];

// Create the text bubble
const textBubble = document.createElement('div');
textBubble.style.position = 'absolute';
textBubble.style.left = '160px';
textBubble.style.top = '30px';
textBubble.style.backgroundColor = 'white';
textBubble.style.border = '2px solid black';
textBubble.style.padding = '10px';
textBubble.style.borderRadius = '10px';
textBubble.style.display = 'none';
document.body.appendChild(textBubble);

// Function to show a random phrase
function showRandomPhrase() {
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    textBubble.textContent = randomPhrase;
    textBubble.style.display = 'block';
    setTimeout(() => {
        textBubble.style.display = 'none';
    }, 3000);
}

// Show a random phrase every 5 seconds
setInterval(showRandomPhrase, 5000);

// Make Sprunki draggable
let isDragging = false;
let offsetX, offsetY;

sprunki.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - sprunki.getBoundingClientRect().left;
    offsetY = e.clientY - sprunki.getBoundingClientRect().top;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        sprunki.style.left = `${e.clientX - offsetX}px`;
        sprunki.style.top = `${e.clientY - offsetY}px`;
        textBubble.style.left = `${e.clientX - offsetX + 110}px`;
        textBubble.style.top = `${e.clientY - offsetY - 20}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Flip Sprunki horizontally on click
sprunki.addEventListener('click', () => {
    const currentTransform = sprunki.style.transform;
    if (currentTransform === 'scaleX(-1)') {
        sprunki.style.transform = 'scaleX(1)';
    } else {
        sprunki.style.transform = 'scaleX(-1)';
    }
});

// Play/pause sound on double click
sprunki.addEventListener('dblclick', () => {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

// Context menu for changing character
sprunki.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    const menu = document.createElement('div');
    menu.style.position = 'absolute';
    menu.style.left = `${e.clientX}px`;
    menu.style.top = `${e.clientY}px`;
    menu.style.backgroundColor = 'white';
    menu.style.border = '1px solid black';
    menu.style.padding = '10px';
    menu.style.zIndex = '1000';

    Object.keys(characters).forEach(character => {
        const button = document.createElement('button');
        button.textContent = character;
        button.style.display = 'block';
        button.style.margin = '5px 0';
        button.addEventListener('click', () => {
            sprunki.src = characters[character];
            menu.remove();
        });
        menu.appendChild(button);
    });

    document.body.appendChild(menu);

    document.addEventListener('click', () => {
        menu.remove();
    }, { once: true });
});
})();