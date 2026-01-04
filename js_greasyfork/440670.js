// ==UserScript==
// @name         nhentai Auto Scroller
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Auto scroll doujinshi and manga on nhentai so you can jerk off all hands-free.
// @author       LoliEnjoyer
// @include      /^https:\/\/nhentai\.net\/g\/\d+\/\d+\/$/
// @downloadURL https://update.greasyfork.org/scripts/440670/nhentai%20Auto%20Scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/440670/nhentai%20Auto%20Scroller.meta.js
// ==/UserScript==

const ScrollHandler = {
    scrollIntervalID: null,
    turnPageIntervalID: null,

    startReader() {
        const scrollDelay = 5; // Increase this value to make scrolling slower. Default nhentai value: 5
        const scrollSpeed = 1;
        const scrollLimit = document.body.scrollHeight - window.innerHeight;

        if (this.scrollIntervalID === null) {
            this.scrollIntervalID = setInterval(() => {
                let scrollPos = window.scrollY;
                if (scrollPos < scrollLimit) {
                    window.scrollTo(0, scrollPos + scrollSpeed);
                } else {
                    clearInterval(this.scrollIntervalID);
                    this.scrollIntervalID = null;
                    this.turnPage(4500);
                }
            }, scrollDelay);
        }
    },

    stopReader() {
        clearInterval(this.scrollIntervalID);
        clearInterval(this.turnPageIntervalID);
        this.scrollIntervalID = null;
        this.turnPageIntervalID = null;
    },

    turnPage(timeout) {
        if (this.turnPageIntervalID === null) {
            this.turnPageIntervalID = setInterval(() => { unsafeWindow.reader.next_page() }, timeout);
        }
    }
};

let isAutoScroll = false;
let scrollTimeoutID = null;

const div = document.createElement('div');
const button = document.createElement('button');
const icon = document.createElement('i');
button.setAttribute('class', 'btn btn-primary');
icon.setAttribute('class', 'fa fa-lg fa-play');
div.setAttribute('style', 'z-index: 100; right: 0; margin: 10px;')
button.setAttribute('style', 'width: 46px; height: 46px;')

function buttonClickAction() {
    isAutoScroll = !isAutoScroll;
    icon.setAttribute('class', `fa fa-lg ${isAutoScroll ? 'fa-pause' : 'fa-play'}`);
    if (isAutoScroll) {
        ScrollHandler.startReader();
    } else {
        ScrollHandler.stopReader();
        clearTimeout(scrollTimeoutID);
        scrollTimeoutID = null;
    }
}

function buttonPosition() {
    window.scrollY >= 90
        ? Object.assign(div.style, { position: 'fixed', top: 0 })
        : Object.assign(div.style, { position: 'absolute', top: "90px" });
}

buttonPosition();
button.appendChild(icon);
div.appendChild(button);
document.body.appendChild(div);

button.addEventListener('click', buttonClickAction);
window.addEventListener('scroll', buttonPosition);

new MutationObserver(() => {
    if (isAutoScroll) {
        ScrollHandler.stopReader();
        clearTimeout(scrollTimeoutID);
        scrollTimeoutID = setTimeout(() => {
            ScrollHandler.startReader();
            scrollTimeoutID = null;
        }, 3000);
    }
}).observe(document.body, { childList: true, subtree: true });
