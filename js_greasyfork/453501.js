// ==UserScript==
// @name         SoundCloud: Additional "Add to playlist" button
// @description  Adds an "Add to Playlist" button for easier and quicker access.
// @version      1.1
// @author       iammordaty
// @namespace    https://github.com/iammordaty
// @match        https://soundcloud.com/*
// @license      MIT
// @grant        none
// @icon         https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14bdb.ico
// @downloadURL https://update.greasyfork.org/scripts/453501/SoundCloud%3A%20Additional%20%22Add%20to%20playlist%22%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/453501/SoundCloud%3A%20Additional%20%22Add%20to%20playlist%22%20button.meta.js
// ==/UserScript==

const ELEMENTS = '.soundList__item, .soundBadgeList__item, .listenEngagement__footer, .trackList__item, .historicalPlays__item';

const BUTTON_CLASS_NAMES = [
    'sc-button',
    'sc-button-icon',
    'sc-button-medium',
    'sc-button-responsive',
    'sc-button-secondary',
    'sc-button-small',
];

const getButtonClassList = refNodeClassList =>
    [...BUTTON_CLASS_NAMES.filter(value => refNodeClassList.includes(value)),
        'sc-button-add-to-playlist',
        'sc-button-addtoset'
    ];

const createButton = (container, refNode) => {
    const button = document.createElement('button');
    button.setAttribute('role', 'button');

    const classList = getButtonClassList([...refNode.classList]);
    button.classList.add(...classList);
    button.setAttribute('title', 'Add this track to Playlist');

    const innerDiv = document.createElement('div');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M3.25 7V4.75H1v-1.5h2.25V1h1.5v2.25H7v1.5H4.75V7h-1.5zM9 4.75h6v-1.5H9v1.5zM15 9.875H1v-1.5h14v1.5zM1 15h14v-1.5H1V15z');
    path.setAttribute('fill', 'currentColor');

    svg.appendChild(path);
    innerDiv.appendChild(svg);
    button.appendChild(innerDiv);

    button.addEventListener('click', () => {
        container.querySelector('button[aria-label="more" i]').click();
        document.querySelector('button[title="add to playlist" i]').click();
    }, false);

    return button;
};

const insertAfter = (button, refButton) => refButton.parentNode.insertBefore(button, refButton);

const pending = new Set();
let scheduled = false;

const scheduleProcess = () => {
    if (scheduled) {
        return;
    }

    scheduled = true;

    requestAnimationFrame(() => {
        scheduled = false;

        pending.forEach(container => processContainer(container));
        pending.clear();
    });
};

const processContainer = container => {
    if (!(container instanceof HTMLElement)) {
        return;
    }

    const refButton = container.querySelector('.sc-button-more');

    if (!refButton) {
        return;
    }

    if (container.querySelector('.sc-button-add-to-playlist')) {
        return;
    }

    const button = createButton(container, refButton);

    insertAfter(button, refButton);
};

const scanPage = () => {
    document.querySelectorAll(ELEMENTS).forEach(el => pending.add(el));

    scheduleProcess();
};

const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
            if (!(node instanceof HTMLElement)) {
                continue;
            }

            if (node.matches(ELEMENTS)) {
                pending.add(node);
            }

            node.querySelectorAll?.(ELEMENTS).forEach(el => {
                pending.add(el);
            });
        }
    }

    scheduleProcess();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

document.addEventListener('DOMContentLoaded', scanPage, false);
window.addEventListener('load', scanPage, false);
