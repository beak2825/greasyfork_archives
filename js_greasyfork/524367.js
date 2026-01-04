// ==UserScript==
// @name         Spookify
// @namespace    ccn0
// @version      U1S1.03
// @description  Replaces one random link with a screamer
// @author       CCN0
// @license      GPL3
// @match        *://*/*
// @icon         https://ccn0.github.io/img/spooky/smilegirl32icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524367/Spookify.user.js
// @updateURL https://update.greasyfork.org/scripts/524367/Spookify.meta.js
// ==/UserScript==

(function() {
    const spookyList = [
        ["https://media1.tenor.com/m/So59sDcNM4wAAAAC/fnaf-chica.gif","https://ccn0.github.io/img/audio/plus/fnaf4jumpscare.mp3"],
        ["https://media1.tenor.com/m/ZO1_WS7f-4YAAAAC/fnaf-freddy.gif","https://ccn0.github.io/img/audio/plus/fnaf1jumpscare.mp3"],
        ["https://media.tenor.com/aHR1ThFfmE4AAAAi/fnaf.gif","https://ccn0.github.io/img/audio/plus/fnaf2jumpscare.mp3"],
        ["https://media.tenor.com/E_HSK33-xokAAAAi/fnaf-bunny.gif","https://ccn0.github.io/img/audio/plus/fnaf3jumpscare.mp3"],
        ["https://ccn0.github.io/img/spooky/smilegirl.png","https://ccn0.github.io/img/audio/plus/funandlaughing.mp3"],
        ["https://ccn0.github.io/img/spooky/spookyhillman.gif","https://ccn0.github.io/img/audio/plus/cardrivinghills.mp3"],
        ["https://ccn0.github.io/img/spooky/niceman24kbfile.png","https://ccn0.github.io/img/audio/plus/southparkbestofcousinelvin.mp3"],
    ];
    const chosenScare = spookyList[Math.floor(spookyList.length * Math.random())];

    const spookySound = new Audio();
    spookySound.src = chosenScare[1];
    spookySound.preload = 'auto';
    const spookyPhoto = chosenScare[0];

    const spookElem = document.createElement('img');
    spookElem.style.display = 'none';
    spookElem.src = spookyPhoto;
    spookElem.style.width = '100%';
    spookElem.style.height = '100vh';
    spookElem.style.position = 'fixed';
    spookElem.style.top = '0';
    spookElem.style.left = '0';
    document.body.appendChild(spookElem);

    const links = document.querySelectorAll('a');
    if (links.length === 0) return;
    const chosenLink = Math.floor(links.length * Math.random());
    const originalDestination = links[chosenLink].href;

    function scare() {
        return new Promise((resolve) => {
            spookySound.volume = 1;
            spookySound.play();
            spookElem.style.display = 'block';
            spookySound.addEventListener('ended', () => {
                spookElem.style.display = 'none';
                resolve();
            });
        });
    };

    function finale() {
        spookElem.style.display = 'none';
        location.href = originalDestination;
    };

    console.log(links[chosenLink].textContent);
    links[chosenLink].classList.add('spooky');
    links[chosenLink].setAttribute('title',links[chosenLink].href);
    links[chosenLink].removeAttribute('href');
    links[chosenLink].addEventListener('mousedown',(e)=>{
        console.log(e.button)
        switch (e.button) {
            case 0:
                scare().then(finale);
                break;
            case 1:
                e.preventDefault();
                scare();
                window.open(originalDestination, "_blank");
                break;

            default:
                break;
        }
    });

    const css = `
    @keyframes rapidColorChange {
    0% { opacity: 1; }
    10% { opacity: 0; }
    14% { opacity: 1; }
    19% { opacity: 0; }
    28% { opacity: 1; }
    36% { opacity: 0; }
    43% { opacity: 1; }
    52% { opacity: 0; }
    57% { opacity: 1; }
    62% { opacity: 0; }
    64% { opacity: 1; }
    69% { opacity: 0; }
    78% { opacity: 1; }
    81% { opacity: 0; }
    89% { opacity: 1; }
    94% { opacity: 0; }
    97% { opacity: 1; }
    99% { opacity: 0; }
    }
    .spooky {
        animation: rapidColorChange 10s infinite;
        cursor: grab;
        &:active {
            cursor: grabbing;
        }
    }
    `;

    const style = document.createElement('style');
    style.innerHTML = css;

    document.head.appendChild(style);
})();
