// ==UserScript==
// @name     Twitch chat - align pseudos
// @version  0.2
// @grant    none
// @include http://*.twitch.tv/*
// @include https://*.twitch.tv/*
// @exclude http://api.twitch.tv/*
// @exclude https://api.twitch.tv/*
// @namespace http://tampermonkey.net/
// @description Align the text in the twitch chat
// @downloadURL https://update.greasyfork.org/scripts/382610/Twitch%20chat%20-%20align%20pseudos.user.js
// @updateURL https://update.greasyfork.org/scripts/382610/Twitch%20chat%20-%20align%20pseudos.meta.js
// ==/UserScript==

var sizeChat = 0;
var longestPseudo = 0;

const spacePx = 8;
const maxWidth = 80;

// True: align pseudo on left
// False: align pseudo on right
const alignLeft = false;

// True: remove icons (mods, sub, bits)
// False: keep icons
const removeIcons = true;

const config = { attributes: true, childList: true, subtree: true };

var init = function () {

    addGlobalStyle(".chat-line__message, message-block{ display:flex }");
    addGlobalStyle(".chat-line__username, .chat-line__dots, .message-block>*{ flex-shrink:0 }");
    addGlobalStyle(".chat-line__username {max-width:" + maxWidth + "px; white-space:nowrap; overflow:hidden}");

    // document.getElementById('root').addEventListener('DOMSubtreeModified', function (e) {
    //     if (e.target == document.querySelectorAll('[role="log"]')[0]) {
    //         console.log('Dom modified');
    //         let target = e.target;
    //         let msg = target.lastChild;

    //         if (![...msg.classList].includes('chat-line__message'))
    //             return;

    //         //remove the icons (mod, sub, bits, ...)
    //         if (msg.children[0].classList.length == 0)
    //             msg.children[0].remove();

    //         msg.children[1].classList.add("chat-line__dots");

    //         let elText = [...msg.children].splice(2);

    //         let span = document.createElement("span");
    //         span.classList.add("message-block");

    //         elText.forEach(el => {
    //             let clone = el.cloneNode(true);
    //             clone = span.appendChild(clone);

    //             el.style.display = 'none';
    //         });
    //         msg.appendChild(span);

    //         elText.forEach((el, i) => {
    //             el.addEventListener('DOMSubtreeModified', function (original) {
    //                 console.log('Dom modified (in msg)');
    //                 span.children[i].outerHTML = el.outerHTML;
    //                 span.children[i].style.display = '';
    //             });
    //         });

    //         if (alignLeft) {
    //             let pseudo = msg.children[0].clientWidth;
    //             let pixelToAdd = maxWidth - pseudo;

    //             msg.children[1].style.width = (pixelToAdd + spacePx) + 'px';
    //         } else {
    //             msg.children[0].style.width = maxWidth + 'px';
    //             msg.children[0].style.textAlign = 'right';
    //             msg.children[1].style.width = spacePx + 'px';
    //         }
    //     } else if (e.target == document.getElementsByClassName("chat-input")[0]) {
    //         sizeChat = document.getElementsByClassName("chat-input")[0].children[0].clientWidth;
    //     }
    // });



    var initObserver = new MutationObserver(wait);

    initObserver.observe(document.body, config);

    //var observer = new MutationObserver(waitForNewMsg);

    //observer.observe(document.querySelectorAll('[role="log"]')[0], config);

    // Later, you can stop observing
}

var addGlobalStyle = function (css) {

    var head, style;
    head = document.getElementsByTagName('head')[0];

    if (!head)
        return;

    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

var waitForNewMsg = function (mutationsList, obs) {
    for (let mutation of mutationsList) {
        if (mutation.type == 'childList') {

            if (!mutation.addedNodes[0].classList.contains('chat-line__message'))
                return;

            let msg = mutation.addedNodes[0];

            //remove the icons (mod, sub, bits, ...)
            if (removeIcons && msg.children[0].classList.length == 0)
                msg.children[0].remove();

            let elText = [...msg.children].splice(2);

            let span = document.createElement("span");
            span.classList.add("message-block");

            elText.forEach(el => {
                let clone = el.cloneNode(true);
                clone = span.appendChild(clone);

                el.style.display = 'none';
            });

            msg.appendChild(span);

            elText.forEach((el, i) => {
                //TODO: depracated function
                el.addEventListener('DOMSubtreeModified', function (original) {
                    console.log('Dom modified (in msg)');
                    span.children[i].outerHTML = el.outerHTML;
                    span.children[i].style.display = '';
                });
            });

            if (alignLeft) {
                let pseudo = msg.children[0].clientWidth;
                let pixelToAdd = maxWidth - pseudo;

                msg.children[1].style.width = (pixelToAdd + spacePx) + 'px';
            } else {
                msg.children[0].style.width = maxWidth + 'px';
                msg.children[0].style.textAlign = 'right';
                msg.children[1].style.width = spacePx + 'px';
            }

        }
        else if (mutation.type == 'attributes') {
        }
    }
};

var wait = function (mutationsList, obs) {
    for (var mutation of mutationsList) {
        if (mutation.target == document.querySelectorAll('[role="log"]')[0]) {

            var observer = new MutationObserver(waitForNewMsg);
            observer.observe(mutation.target, config);

            obs.disconnect();
        }
    }
}

init();