// ==UserScript==
// @name Cats Fix The Internet
// @namespace    Violentmonkey Scripts
// @version      1.0.0
// @description  Cats are a missing part of the internet. This scripts fixes that.
// @author       RooCraft
// @match         *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540123/Cats%20Fix%20The%20Internet.user.js
// @updateURL https://update.greasyfork.org/scripts/540123/Cats%20Fix%20The%20Internet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const catGifs = [
        'https://media1.tenor.com/m/N0DcP2j9YdgAAAAC/cute-cat.gif',
        'https://media1.tenor.com/m/C8uJIqREzLAAAAAd/cat-cats.gif',
        'https://media1.tenor.com/m/H5_fzbzwYR8AAAAd/meev-meevin.gif',
        'https://media1.tenor.com/m/Pb6AjJ1qgiQAAAAC/kitty-cat.gif',
        'https://media1.tenor.com/m/EkfaefdaRqgAAAAd/luna-cat.gif',
        'https://media1.tenor.com/m/gRcOi64o3oAAAAAC/crunchycat-luna.gif',
        'https://media1.tenor.com/m/8QsOaiMKvWQAAAAd/cat-crunch.gif',
        'https://media1.tenor.com/m/eOIn1K3X1loAAAAd/plink-cat-luna-cat.gif',
        'https://media1.tenor.com/m/lhuFqfMRxvEAAAAd/luna-crunchycat.gif',
        'https://media1.tenor.com/m/CGrseHO972YAAAAd/black-cat-walking.gif',
        'https://media1.tenor.com/m/kJCIr1ybDaEAAAAd/kitty-dance-kitty.gif',
        'https://media1.tenor.com/m/zlKoX5HPPu8AAAAd/cat-annoyed.gif', 
        'https://media1.tenor.com/m/a4oMmpcZT_AAAAAd/2.gif',
        'https://media1.tenor.com/m/k-5VPe7282oAAAAd/orange-cat-orange-cat-jump.gif',
        'https://media1.tenor.com/m/K931btqo8IwAAAAC/lkmw.gif',
        'https://media1.tenor.com/m/MFPcrGgiu4IAAAAd/cat-cat-meme.gif', 
        'https://media1.tenor.com/m/DwyR1uAA9mQAAAAC/cat-cat-meme.gif',
        'https://media1.tenor.com/m/UuS_R0c0evkAAAAC/donut-cat.gif', 
        'https://media1.tenor.com/m/ePMjzvyRfrIAAAAd/mango-eotl.gif',
        'https://media1.tenor.com/m/ZfOVO1vWgr0AAAAd/little-cat-walking.gif', 
        'https://media1.tenor.com/m/g54q8Olrm5YAAAAd/kitten-walking.gif',
        'https://media1.tenor.com/m/WxOe9wSubAYAAAAd/running-the-pet-collective.gif', 
        'https://media1.tenor.com/m/FU8WGJqvhQgAAAAd/cat.gif',
        'https://media1.tenor.com/m/VKm-f7kz27gAAAAC/figgy-stairs.gif', 
        'https://media1.tenor.com/m/anFDxPzJV3gAAAAd/cat-running.gif',
        'https://media1.tenor.com/m/k3Qm9gnU1XEAAAAC/cat-run-cat-leave.gif', 
        'https://media1.tenor.com/m/yck5YPMh3FAAAAAC/cat-cat-walk.gif',
        'https://media1.tenor.com/m/mXtZf5PeCzgAAAAd/bebo-the-cat-cat-running-away.gif', 
        'https://media1.tenor.com/m/VGWpu8FH82AAAAAC/happy-cat-yippee-cat.gif',
        'https://media1.tenor.com/m/9Nr32cJWZ8oAAAAC/catto.gif'

    ];

    const preloadPromise = [];

    catGifs.forEach(url => {
        const img = new Image();
        img.src = url;
        preloadPromise.push(new Promise((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('Failed to load image', url));
        }));
    });

    const startButtonContainer = document.createElement('div');
    Object.assign(startButtonContainer.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        width: '120px',
        height: '40px',
        zIndex: '9999',
        display: 'block',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
    });
    const startButton = document.createElement('button');
    startButton.textContent = 'Meow Mode';
    startButton.disabled = true;
    Object.assign(startButton.style, {
        display: 'block',
        width: '100%',
        height: '100%',
        padding: '5px 10px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transition: 'background-color 0.3s ease'
    });
    startButton.onmouseover = function() {this.style.backgroundColor = '#45a049';};
    startButton.onmouseout = function() {this.style.backgroundColor = '#4CAF50';};

    startButtonContainer.appendChild(startButton);
    document.body.appendChild(startButtonContainer);

    startButton.style.opacity = '0.6';
    startButton.style.cursor = 'not-allowed';

    function spawnGif() {
        const scale = Math.floor(Math.random() * (300 - 200 + 1) + 200);
        const randomGif = Math.floor(Math.random() * catGifs.length);
        const randomGifUrl = catGifs[randomGif];
        const gifContainer = document.createElement('div');
        Object.assign(gifContainer.style, {
            position: 'fixed',
            width: `${scale}px`,
            height: `${scale}px`,
            zIndex: '9999',
            display: 'block',
        });
        const catGif = document.createElement('img');
        catGif.src = randomGifUrl;
        Object.assign(catGif.style, {
            display: 'block',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
        });
        gifContainer.appendChild(catGif);

        const windowWidth = screen.availWidth;
        const windowHeight = screen.availHeight;

        const x = Math.random() * (windowWidth - scale);
        const y = Math.random() * (windowHeight - scale);

        gifContainer.style.left = `${x}px`;
        gifContainer.style.top = `${y}px`;
        gifContainer.style.transform = 'none';

        document.body.appendChild(gifContainer);
    }

    Promise.all(preloadPromise).then(() => {
        startButton.disabled = false;
        startButton.style.opacity = '1';
        startButton.style.cursor = 'pointer';

        startButton.addEventListener('click', () => {
            startButtonContainer.style.opacity = '0';
            startButtonContainer.style.transform = 'scale(0)';
            setTimeout(spawnGif, 1000);
            setInterval(spawnGif, 5000);
            startButtonContainer.addEventListener('transitionend', function handler() {
                startButtonContainer.removeEventListener('transitionend', handler);
                if (startButtonContainer.parentNode) {
                    startButtonContainer.parentNode.removeChild(startButtonContainer);

            }}); 
        });



    })
    .catch(error => {
        startButton.disabled = false;
        startButton.style.opacity = '1';
        startButton.style.cursor = 'pointer';

        startButton.addEventListener('click', () => {
            startButtonContainer.style.opacity = '0';
            startButtonContainer.style.transform = 'scale(0)';
            setTimeout(spawnGif, 1000);
            setInterval(spawnGif, 5000);
            startButtonContainer.addEventListener('transitionend', function handler() {
                startButtonContainer.removeEventListener('transitionend', handler);
                if (startButtonContainer.parentNode) {
                    startButtonContainer.parentNode.removeChild(startButtonContainer);

        }}); 
    })});
})();