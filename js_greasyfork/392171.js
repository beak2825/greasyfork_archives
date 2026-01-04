// ==UserScript==
// @name         Morsecode.me typer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  This script lets you type on morsecode.me
// @author       idane
// @match        http://morsecode.me/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/392171/Morsecodeme%20typer.user.js
// @updateURL https://update.greasyfork.org/scripts/392171/Morsecodeme%20typer.meta.js
// ==/UserScript==

const morseCodes = {
    "0": "-----",
    "1": ".----",
    "2": "..---",
    "3": "...--",
    "4": "....-",
    "5": ".....",
    "6": "-....",
    "7": "--...",
    "8": "---..",
    "9": "----.",
    "a": ".-",
    "b": "-...",
    "c": "-.-.",
    "d": "-..",
    "e": ".",
    "f": "..-.",
    "g": "--.",
    "h": "....",
    "i": "..",
    "j": ".---",
    "k": "-.-",
    "l": ".-..",
    "m": "--",
    "n": "-.",
    "o": "---",
    "p": ".--.",
    "q": "--.-",
    "r": ".-.",
    "s": "...",
    "t": "-",
    "u": "..-",
    "v": "...-",
    "w": ".--",
    "x": "-..-",
    "y": "-.--",
    "z": "--..",
    ".": ".-.-.-",
    ",": "--..--",
    "?": "..--..",
    "!": "-.-.--",
    "-": "-....-",
    ":": "---...",
    "'": ".----.",
    "/": "-..-.",
    "@": ".--.-.",
    "(": "-.--.",
    ")": "-.--.-",
    "?": "..--.."
};

let writing = false;

const press = (duration) => {
    return new Promise((resolve) => {
        window.app.morsers.me.keyDown();
        setTimeout(() => resolve(window.app.morsers.me.keyUp()), duration);
    });
}

const shortTone = async () => await press(100);
const longTone = async () => await press(200);
const pause = async(delay) => new Promise(resolve => setTimeout(resolve, delay));
const writeLetter = async (letter) => {
    const code = morseCodes[letter.toLowerCase()];
    for(const tone of code) {
        if(tone === '-') {
            await longTone();
        } else {
            await shortTone();
        }
    }
}

const write = async function(text) {
    if(writing) return;
    writing = true;
    for(const letter of text) {
        if(letter === ' ') {
            await pause(600);
            continue;
        }

        if(letter === '\n') {
            await pause(2500);
            continue;
        }

        await writeLetter(letter);
        await pause(200);
    }
    writing = false;
}
$('#conversation').after("<textarea rows='5' cols='70' id='cheat-input' class='withbg' style='color: white; border: 0px; outline: none;' placeholder='Write something and press CTRL+Enter'></textarea>");
$("#key").remove();
$('body').on('keydown', (e) => e.stopPropagation());
$('body').on('keydown', '#cheat-input', async (e) => {
    const element = $("#cheat-input");
    if(e.which === 13 && e.ctrlKey === true && !writing) {
        const message = element.val();
        element.val('');
        const originalPlaceholder = element.attr('placeholder');
        element.attr('placeholder', 'Typing...');
        element.prop('disabled', true);
        await write(message);
        element.attr('placeholder', originalPlaceholder);
        element.prop('disabled', false);
        element.focus();
    }
});