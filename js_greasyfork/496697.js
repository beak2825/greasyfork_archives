// ==UserScript==
// @name        Pega Academy: Embiggen video (JS)
// @author      sammich
// @version     1.0.0
// @namespace   embiggen.pega.sammichco
// @license MIT
// @description This is your new file, start writing code
// @match       https://academy.pega.com/*
// @downloadURL https://update.greasyfork.org/scripts/496697/Pega%20Academy%3A%20Embiggen%20video%20%28JS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496697/Pega%20Academy%3A%20Embiggen%20video%20%28JS%29.meta.js
// ==/UserScript==

// find all the videos

const styl = `
video-js.embiggen-video {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1000000;
}

.o-bolt-grid__cell:has(> div > video-js) {
    width: 100% !important;
}

.embiggen-button {
    margin-top: 0.5em;
    float: right;
}

.unembiggen-button {
    position: fixed;
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    border-radius: 30px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000001;
    border: none;
    color: white;
}
`;

const stylEl = document.createElement('style');
stylEl.textContent = styl;
document.body.appendChild(stylEl);

const vidsEls = [...document.querySelectorAll('video-js')];

// add a button to each of them that just applies a class to make a lightbox out of it
vidsEls.forEach(el => {
    const embiggenButton = document.createElement('button');
    embiggenButton.classList.add('embiggen-button')
    embiggenButton.textContent = 'Embiggen';
    embiggenButton.onclick = embiggen;
    
    el.parentNode.parentNode.appendChild(embiggenButton);
});

window.embiggener = {
    embiggen,
    unembiggen
};

document.addEventListener("keydown", ({key}) => {
    if (key !== "Escape") return;
    
    unembiggen();
})

function embiggen() {
    const vid = this.parentNode.querySelector('video-js');
    vid.classList.add('embiggen-video');
    
    const umembiggenButton = document.createElement('button');
    umembiggenButton.classList.add('unembiggen-button')
    umembiggenButton.textContent = 'x';
    umembiggenButton.onclick = unembiggen;

    document.body.appendChild(umembiggenButton);
}

function unembiggen() {
    const vid = document.body.querySelector('.embiggen-video');
    
    if (!vid) return;
    
    vid.classList.remove('embiggen-video');
    
    const unembtn = document.body.querySelector('.unembiggen-button');
    unembtn.parentNode.removeChild(unembtn);
}