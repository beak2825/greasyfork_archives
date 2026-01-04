// ==UserScript==
// @name        Deezer PiP - deezer.com
// @namespace   https://github.com/Thibb1
// @match       https://www.deezer.com/*
// @grant       none
// @version     1.0.1
// @author      Thibb1
// @description Adds PiP features to Deezer
// @license     GPL
// @downloadURL https://update.greasyfork.org/scripts/468576/Deezer%20PiP%20-%20deezercom.user.js
// @updateURL https://update.greasyfork.org/scripts/468576/Deezer%20PiP%20-%20deezercom.meta.js
// ==/UserScript==

let timer;
function debounce(func) {
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, 1000);
    };
}
const CLICK_TIMEOUT = 200;
const NEXT = '.player-controls [data-testid="StepForwardIcon"]';
const PREVIOUS = '.player-controls [data-testid="StepBackwardIcon"]';
const PAUSE = '.player-controls [data-testid="PauseIcon"]'
const PLAY = '.player-controls [data-testid="PlayIcon"]'
const QUEUELIST = '.player-full.player-lyrics-full';
const QUEUE = '.player-options > ul > li:nth-child(2) > button';
const FAVORITES = ".sidebar-nav-list > li:nth-child(5) > a";
const SHUFFLE = '[data-testid="user-shuffle-button"]';
const MIX = '[data-testid="NoteWaveIcon"]';
const REMOVE_FAV = '.player-bottom [data-testid="HeartFillIcon"]'
const ADD_FAV = '.player-bottom [data-testid="HeartIcon"]'

const STYLE_TEXT = `
    body {
        background: #212121;
        color: #fff;
        font-weight: 700;
    }
    button {
        flex: 1;
        height: 45px;
        font-size: 16px;
        box-shadow: 0px 0px 20px -20px;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.2s ease-in-out 0ms;
        user-select: none;
    }
    button:hove {
        box-shadow: 0px 0px 20px -18px;
    }
    button:active {
        transform: scale(0.95);
    }
    .shuffle {
        background: #ca2a36;
        color: #fff;
    }
    .main > div {
        flex: 1;
    }
    .main {
        flex-direction: column;
        width: 90%;
    }
    body, p, div {
        display: flex;
        gap: 8px;
        justify-content: center;
    }
`;


function getTitle() {
    return [...document.querySelectorAll('.track-link')].map((e) => e.textContent).join(' - ');
}

function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}

async function onClick() {
    const pipWindow = await documentPictureInPicture.requestWindow({ width: 284, height: 284 });
    const main = pipWindow.document.createElement('div');
    const audioController = document.createElement("div");
    const nextSong = createButton('Next', () => {
        document.querySelector(NEXT).parentElement.click();
    });
    const previousSong = createButton('Previous', () => {
        document.querySelector(PREVIOUS).parentElement.click();
    });
    const playPause = createButton('', () => {
        const play = document.querySelector(PLAY);
        const pause = document.querySelector(PAUSE);
        if (play) {
            play.parentElement.click();
            playPause.textContent = 'Pause';
        } else {
            pause.parentElement.click();
            playPause.textContent = 'Play';
        }
    });
    const playMix = createButton('Launch Track mix', () => {
        const queueOpened = document.querySelector(QUEUELIST);
        if (!queueOpened) {
            document.querySelector(QUEUE).click();
        }
        setTimeout(() => {
            document.querySelector(`${QUEUELIST} [aria-selected=true] [aria-haspopup]`).click();
            document.querySelector(MIX).closest('button').click();
            if (!queueOpened) {
                document.querySelector(QUEUE).click();
            }
        }, CLICK_TIMEOUT);
    });
    const shuffle = createButton('Shuffle my music', () => {
        document.querySelector(FAVORITES).click();
        setTimeout(() => {
            document.querySelector(SHUFFLE).click();
        }, CLICK_TIMEOUT);
    });
    const toggleFav = createButton('', () => {
        const fav = document.querySelector(ADD_FAV);
        if (fav) {
            fav.parentElement.click();
            toggleFav.textContent = 'Remove from favorites';
        } else {
            document.querySelector(REMOVE_FAV).parentElement.click();
            toggleFav.textContent = 'Add to favorites';
        }
    });
    const songTitle = pipWindow.document.createElement('p');
    const style = pipWindow.document.createElement('style');
    main.classList.add('main');
    shuffle.classList.add('shuffle');
    const getText = () => {
        songTitle.textContent = getTitle();
        playPause.textContent = document.querySelector(PLAY) ? 'Play' : 'Pause';
        toggleFav.textContent = document.querySelector(REMOVE_FAV) ? 'Remove from favorites' : 'Add to favorites';
    }
    getText();
    audioController.appendChild(previousSong);
    audioController.appendChild(playPause);
    audioController.appendChild(nextSong);
    main.appendChild(audioController);
    main.appendChild(toggleFav);
    main.appendChild(playMix);
    main.appendChild(shuffle);
    main.appendChild(songTitle);
    pipWindow.document.body.appendChild(main);
    style.innerHTML = STYLE_TEXT;
    pipWindow.document.head.appendChild(style);
    const observer = new MutationObserver(() => getText());
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

const observer = new MutationObserver((mutations) => {
    debounce(() => {
        observer.disconnect();
        const pipButton = document.createElement('button');
        pipButton.textContent = 'PiP';
        pipButton.addEventListener('click', onClick);
        pipButton.classList.add('svg-icon-group-btn');
        document.querySelector('.player-options > ul > li:nth-child(1) > ul').appendChild(pipButton);
    })();
});

window.onload = () => {
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
};