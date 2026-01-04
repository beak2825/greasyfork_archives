// ==UserScript==
// @name         FrdicReciteLex
// @namespace    https://stanleytsau.me
// @version      0.1
// @description  Adding support for syllable segmentation and relevant images to help memorize French words on Frdic Recite
// @author       Stanley Cao
// @homepage     https://github.com/dodaydream/frdic-recite-helper
// @supportURL   https://github.com/dodaydream/frdic-recite-helper/issues
// @match        https://www.frdic.com/areas/recite/fr/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475843/FrdicReciteLex.user.js
// @updateURL https://update.greasyfork.org/scripts/475843/FrdicReciteLex.meta.js
// ==/UserScript==

const fadeInKeyframes = [
    { opacity: 0 },
    { opacity: 0 },
    { opacity: 0 },
    { opacity: 1 }
];

(function() {
    'use strict';

    const WORD = '.explain-title'

    let currentWord = ''
    let currentWordElem = null

    // periodically check existence of button
    setInterval(async () => {

        let elem = document.querySelectorAll(WORD);

        if (elem.length == 0) return

        currentWordElem = elem[0]

        if (currentWord == currentWordElem.innerText) return

        currentWord = currentWordElem.innerText

        currentWordElem.animate(fadeInKeyframes, {
            duration: 6000, // Animation duration in milliseconds
            fill: 'forwards' // Keeps the final state of the animation
        });

        const container = document.createElement('div')
        currentWordElem.parentNode.insertBefore(container, currentWordElem.nextSibling)

        const newElem = document.createElement('div')
        newElem.style.paddingBottom = '1rem'
        newElem.innerText = '--'
        container.appendChild(newElem)

        newElem.animate(fadeInKeyframes, {
            duration: 6000, // Animation duration in milliseconds
            fill: 'forwards' // Keeps the final state of the animation
        });


        const response = await fetch("http://localhost:3000/search?q=" + currentWord)

        const data = await response.text();

        const parsed = data.split('\n').map((d) => d.split('\t'));

        const ques = document.querySelectorAll('.card-question');

        if (ques.length != 0) {
            ques[0].innerText = parsed[0][27]
        }

        newElem.innerText = parsed[0][27]

        const pos = parsed[0][3]

        if (pos == 'NOM' || pos == 'VER') {
            const imgResponse = await fetch("http://localhost:3000/images?q=" + currentWord + '&i=true')

            const images = await imgResponse.json();

            const previewContainer = document.createElement('div')
            previewContainer.style.display = 'flex';
            previewContainer.style.alignItems = 'center';
            previewContainer.style.overflow = 'auto';
            previewContainer.style.paddingBottom = '1rem'

            images.forEach((preview) => {
                const image = new Image();
                image.src = preview.preview.url;
                image.style.width = '33%'
                image.style.maxHeight = '180px'
                image.alt = preview.origin.title;
                image.title = preview.origin.title;
                previewContainer.appendChild(image);
            });

            container.appendChild(previewContainer)
        }

        const etymology = await fetch("http://localhost:3000/etymology?q=" + currentWord).then(response => response.json())

        const div = document.createElement('div')
        div.style.display = 'flex';

        if (etymology.pi) {
            const pi = document.createElement('img')
            pi.src = etymology.pi
            pi.style.maxWidth = '50%'

            div.appendChild(pi)
        }

        if (etymology.details) {
            const table = document.createElement('table')
            table.style.marginLeft = '1rem'

            const tbody = document.createElement('tbody')

            etymology.details.forEach((detail) => {
                const tr = document.createElement('tr')

                const first = document.createElement('td')
                first.innerText = detail.entry
                const second = document.createElement('td')
                second.innerText = detail.def

                tr.appendChild(first)
                tr.appendChild(second)

                tbody.appendChild(tr)
            })

            table.appendChild(tbody)

            div.appendChild(table)
        }

        container.appendChild(div)
    }, 200)
})();