// ==UserScript==
// @name        granger dtf.ru
// @namespace   granger
// @match       https://dtf.ru/*
// @grant       none
// @version     1.0
// @author      -
// @description 08.06.2024, 19:33:19
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497387/granger%20dtfru.user.js
// @updateURL https://update.greasyfork.org/scripts/497387/granger%20dtfru.meta.js
// ==/UserScript==
let imgBase = 'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAFpQTFRFAAAAzD0Y2FAl8Y5hwC8P63tL3mU78Z596mw2vDASqygPlB8N6Gou7XIw9ZNCsysPrScQ+7iTrygP7HZGricP8ncp0D0a9otE2FEgryQPtycP/cGK/apo73IoLiDnpgAAAB50Uk5TAP///vz///+6rfz/zocJ2Af/it4qJtM5S1FOYoJUpHt7PAAAAHZJREFUeJzNkEkSgzAMBLUbGy9gm0C2/38zTnLhB0mXDqPWRTUA/8dypO287497hmpOY3puGSDnPU28rgkKsVNtcRq0xmysEbwQvb0bw6aGRBF6CTMSkhoZIs6IlwOg1yAycviYIL5/H7hWX2Sciq+35ScdnHkBj2kEfghHs9YAAAAASUVORK5CYII=';

let timeoutId = null; // Variable to store the timeout ID

function findFirstGranger() {
    // Найти все элементы с классом author__name
    let elements = document.querySelectorAll('.author__name');
    for (let i = 0; i < elements.length; i++) {
        // Проверить, содержит ли href 'granger'
        if (elements[i].getAttribute('href').includes('granger')) {
            let granger = elements[i].parentElement.parentElement.parentElement.parentElement;
            granger.style.position = 'relative';
            granger.style.overflow = 'hidden';

            checkAndStartAnimation(granger, imgBase,getLike(granger));
            replaceImage(granger);

        }
    }
    return;
}

function replaceImage(elem) {
    let firstDiv = elem.querySelector('.reaction-button');
    if (firstDiv) {
        let img = firstDiv.querySelector('img');
        if (img) {
            img.src = `data:image/png;base64,${imgBase}`;
        }
    }
}

function getLike(elem) {
    let firstDiv = elem.querySelector('.reaction-button');
    if (firstDiv) {
        let count = firstDiv.querySelector('span').innerText * 1;

    return count
    }
}

function checkAndStartAnimation(elem, imgBase,count) {
    let firstDiv = elem.querySelector('.reaction-button');
    if (firstDiv) {
        if (!firstDiv.dataset.eventAdded) { // Check if event listener is already added
            firstDiv.addEventListener('click', function() {
                addFallingImages(elem, imgBase, count); // Change '30' to the desired number of falling images
            });
            firstDiv.dataset.eventAdded = 'true'; // Mark event listener as added
        }
    }
}

function addFallingImages(container, imgBase, count) {
    for (let i = 0; i < count; i++) {
        let img = document.createElement('img');
        img.src = `data:image/png;base64,${imgBase}`;
        img.style.position = 'absolute';
        img.style.left = `${Math.random() * (container.offsetWidth - 30)}px`; // 30 is the width of the image
        img.style.top = `${randomInRange(-150,-300)}px`;
        img.style.transition = `top ${randomInRange(1, 3)}s linear`;
        img.classList.add('falling-image'); // Add a class to identify falling images
        img.style.transform = Math.random() < 0.5 ? 'scaleX(-1)' : 'none'; // Randomly invert the image

        container.appendChild(img);

        // Apply the bounce effect
        setTimeout(function() {
            img.style.top = `${container.offsetHeight - img.offsetHeight + 5}px`;
        }, 100); // Delay to trigger CSS transition

        // On transition end, apply the bounce effect
        img.addEventListener('transitionend', function() {
            img.style.transition = 'top 0.3s ease';
            img.style.top = `${container.offsetHeight - img.offsetHeight + 40}px`;
        });

        // Set timeout to clear images after 10 seconds
        timeoutId = setTimeout(function() {
            clearFallingImages(container);
        }, 5000);
    }
}

function clearFallingImages(container) {
    let images = container.querySelectorAll('.falling-image');
    images.forEach(img => {
        container.removeChild(img);
    });
}

let observer = new MutationObserver(function(mutations) {
    findFirstGranger();
});


let config = { childList: true, subtree: false };


observer.observe(document.body, config);


function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}
