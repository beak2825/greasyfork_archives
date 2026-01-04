// ==UserScript==
// @name         Lingvist
// @namespace    http://tampermonkey.net/
// @version      2024-01-29
// @description  lingvist tab space swapper
// @author       You
// @match        https://learn.lingvist.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lingvist.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485948/Lingvist.user.js
// @updateURL https://update.greasyfork.org/scripts/485948/Lingvist.meta.js
// ==/UserScript==

(function() {
    'use strict';

function hideSentence() {
    let sentence = document.querySelector('div.card-context.target>section.context-container>div.context');
    // hide by CSS visibility
    sentence.style.visibility = "hidden";
    let speakerButton = document.querySelector('div.actions>div.icon-button:has(svg[data-name="speaker"])');

    // observe speaker button.
    // if class of button has changed and
    // if button don't have 'active' class, show sentence
    function showSentence(mutations, observer) {
        if (speakerButton.classList.contains('active')) {
            return;
        }
        // setTimeout before show sentence
        setTimeout(() => {
            sentence.style.visibility = "visible";
        }, 500);
        // stop observer
        observer.disconnect();
        console.log("speaker button observation stopped");
    }

    let observer = new MutationObserver(showSentence);
    const config = {
        // 子ノードの変化を監視する
        // textContentはtextノードとして入っている
        childList: false,
        subTree: false,
        attributes: true,
    };
    observer.observe(speakerButton, config);
    console.log("speaker button observation started");
}


function clickSpeakerButton() {
    // query div.icon-button:has(svg[data-name='speaker'])
    let speakerButton = document.querySelector('div.actions>div.icon-button:has(svg[data-name="speaker"])');
    // click event
    speakerButton.dispatchEvent(new Event('click'));
    hideSentence();
}

function cancelEvent(e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
}

function swapSpaceAndTab() {
    document.body.addEventListener('keydown', function (e) {
        // Tab key pressed
        if (e.keyCode == 9) {
            cancelEvent(e);
            // alert('Tab key pressed');
            // execCommandはtextboxに対してのみ有効
            // execCommandはbodyに対して入力できないので、
            // 直接speaker buttonをclickする
            clickSpeakerButton();
        }
        // Space key pressed
        else if (e.keyCode == 32) {
            cancelEvent(e);
            // alert('Space key pressed');
            // textboxをfocusしている場合のみ、execCommandが有効
            document.execCommand('insertText', false, ' ');
        }
    });
}

function main() {
    console.log("Hello World! from Tampermonkey");
    /* document.addEventListener('DOMContentLoaded', () => {
        swapSpaceAndTab();
    }); */
    // TampermonkeyだとDOMContentLoadedの後に実行されるので、フックできない。
    swapSpaceAndTab();
    // window.onloadの場合
    // window.addEventListener('load', () => {
    //     intervalQueryNumberDiv();
    // });
}

main();
})();