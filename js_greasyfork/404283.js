// ==UserScript==
// @name         Skyscrapercity ImagesOnDemand
// @namespace    http://skyscrapercity.com/
// @version      0.2
// @description  Loads image only on demand on skyscrapercity.com
// @author       mck
// @match        https://www.skyscrapercity.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/404283/Skyscrapercity%20ImagesOnDemand.user.js
// @updateURL https://update.greasyfork.org/scripts/404283/Skyscrapercity%20ImagesOnDemand.meta.js
// ==/UserScript==
'use strict';

let iodLoopInterval;

let iodReady = function() {
    let images = document.querySelectorAll('img.bbImage');

    [].forEach.call(images, function(image) {
        image.classList.remove('lazyload');
        image.classList.add('iod-image');
        image.src = '';

        let placeholder = document.createElement('a');
        placeholder.classList.add('iod-trigger');
        placeholder.style.cursor = 'pointer';
        placeholder.style.fontSize = '2em';
        placeholder.innerHTML = '<i aria-hidden="true" class="fa fa-image"></i>';
        image.parentNode.insertBefore(placeholder, image);
    });
}

let iodLoad = function() {
    document.addEventListener('DOMContentLoaded', (event) => {
        iodReady();
    });
}

let iodLoop = function() {
    if(document.head || document.body) {
        clearInterval(iodLoopInterval);

        let script = document.createElement('script');
        script.appendChild(document.createTextNode('let iodReady = '+iodReady+';('+iodLoad+')();'));
        (document.head).appendChild(script);

        return;
    }

    if(document.readyState === 'interactive' || document.readyState === 'complete') {
        clearInterval(iodLoopInterval);
        iodReady();

        return;
    }
}

document.addEventListener('click', function(e) {
    let el = e.target;

    while(el && !el.classList.contains('iod-trigger')) {
        el = el.parentNode;
    }

    if(!el) {
        return;
    }

    let image = el.parentNode.querySelector('img.bbImage.iod-image');
    image.setAttribute('src', image.getAttribute('data-src'));
    el.parentNode.removeChild(el);
});

iodLoopInterval = setInterval(function() { iodLoop(); }, 25)
iodLoop();