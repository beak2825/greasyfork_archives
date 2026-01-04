// ==UserScript==
// @name         Fxp Useful Scripts
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  Spam those douchebags
// @author       MrTarnegol
// @match        https://www.fxp.co.il/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414641/Fxp%20Useful%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/414641/Fxp%20Useful%20Scripts.meta.js
// ==/UserScript==

(function() {
    const styles = `
.tarnegol-buttons-container {
    box-shadow: 0 0 13px 5px rgba(0, 0, 0, 0.5);
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
}
.tarnegol-buttons-btn {
    background-color: #4e4e4e;
    font-family: system-ui;
    color: white;
    padding: 15px 40px;
    font-size: 18px;
    width: 100%;
}
.tarnegol-buttons-btn-parent {
    background-color: #4e4e4e;
    width: 100%;
}
`

    const styleSheet = document.createElement("style")
    styleSheet.type = "text/css"
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
})();

'use strict';

const MIN_SIZE = window.MIN_SIZE = 3;
const MAX_SIZE = window.MAX_SIZE = 5;

function componentToHex(c) {
    const hex = c.toString(16);
    return `0${hex}`.slice(-2);
}

function rgbToHex(value) {
    const rHex = componentToHex(value.r);
    const gHex = componentToHex(value.g);
    const bHex = componentToHex(value.b);
    return `${rHex}${gHex}${bHex}`;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return { r, g, b };
}

function mulRGB(v, s) {
    const r = Math.floor(v.r * s);
    const g = Math.floor(v.g * s);
    const b = Math.floor(v.b * s);
    return { r, g, b };
}

function addRGB(a, b) {
    return { r: a.r + b.r, g: a.g + b.g, b: a.b + b.b };
}

function mixRGB(a, b, v) {
    const aMul = mulRGB(a, v);
    const bMul = mulRGB(b, 1 - v);
    return addRGB(aMul, bMul);
}

function gradient(a, b, times = 5) {
    const colours = [];
    const delta = 1 / (times - 1);
    for (let i = 0; i < times; i++) {
        colours.push(mixRGB(a, b, delta * i));
    }
    return colours;
}

const getText = window.getText = () => {
    const selector = '.cke_editor iframe'
    const element = $(selector)[0];
    if (element !== undefined) {
        const doc = element.contentWindow.document;
        return doc.getElementsByClassName("forum")[0].innerText;
    }
    return '';
}

const setText = window.setText = (text) => {
    const selector = '.cke_editor iframe'
    const element = $(selector)[0];
    if (element !== undefined) {
        var doc = element.contentWindow.document;
        doc.getElementsByClassName("forum")[0].innerText = text;
        return true;
    }
    return false;
}

const randomSize = window.randomSize  = () => {
    const SIZES = MAX_SIZE - MIN_SIZE + 1;
    return Math.floor(Math.random() * SIZES) + MIN_SIZE;
}

const isBlank = (letter) => {
    return letter == ' ' || letter == ' ';
}

const letterWithSize = window.letterWithSize = (letter, size = randomSize()) => {
    return !isBlank(letter) ? `[SIZE=${size}]${letter}[/SIZE]` : ' ';
}

const scribbleText = window.scribbleText = (text) => {
    let isText = true;
    return text.split('').reduce((a, b) => {
        if (b == ']') { isText = true; return a + b; };
        if (b == '[') { isText = false; return a + b; };
        return isText ? a + letterWithSize(b) : a + b;
    }, '');
}

const doScribble = window.scribble = () => {
    console.log('MrTarnegol scribbling begin!');

    const text = getText();
    const scribbled = scribbleText(text);
    setText(scribbled);

    CKEDITOR.tools.callFunction(5, this);
}

const addColourTag = window.addColourTag = (text, colour) => {
    return !isBlank(text) ? `[COLOR=#${colour}]${text}[/COLOR]` : ' ';
}

const addColourTagRGB = window.addColourTagRGB = (text, colour) => {
    return addColourTag(text, rgbToHex(colour));
}

const gradientColours = {
    start: hexToRgb(localStorage.getItem('tarnegol.gradient.start')),
    end: hexToRgb(localStorage.getItem('tarnegol.gradient.end')),
}
const gradientText = window.gradientText = (text) => {
    const colours = gradient(gradientColours.start, gradientColours.end, getText().length);
    let isText = true;
    return text.split('').reduce((a, b, i) => {
        if (b == ']') { isText = true; return a + b; };
        if (b == '[') { isText = false; return a + b; };
        const colour = colours[i % colours.length];
        return isText ? a + addColourTagRGB(b, colour) : a + b;
    }, '');
}

const doGradient = window.gradient = () => {
    console.log('MrTarnegol gradient begin!');

    const text = getText();
    const gradiented = gradientText(text);
    setText(gradiented);

    CKEDITOR.tools.callFunction(5, this);
}

const createButtonsDiv = () => {
    const div = document.createElement('div');
    div.className = 'tarnegol-buttons-container';
    return div;
}

const button = (innerText, onclick) => {
    const button = document.createElement('button');
    button.className = 'tarnegol-buttons-btn';
    button.innerText = innerText;
    button.onclick = onclick;
    return button;
}

const colourInput = (value) => {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = value;
    return input;
}

const scribbleButton = () => {
    const div = document.createElement('div');
    div.className = 'tarnegol-buttons-btn-parent';
    div.appendChild(button('ערבל טקסט', doScribble));
    return div;
}

const gradientButton = () => {
    const div = document.createElement('div');
    div.className = 'tarnegol-buttons-btn-parent';
    div.appendChild(button('קשת בענן', doGradient));
    const start = colourInput(localStorage.getItem('tarnegol.gradient.start'));
    const end = colourInput(localStorage.getItem('tarnegol.gradient.end'));
    div.appendChild(start);
    div.appendChild(end);
    start.addEventListener('input', e => {
        gradientColours.start = hexToRgb(start.value);
        localStorage.setItem('tarnegol.gradient.start', start.value);
    })
    end.addEventListener('input', e => {
        gradientColours.end = hexToRgb(end.value);
        localStorage.setItem('tarnegol.gradient.end', end.value);
    })
    return div;
}

const start = () => {
    if (window.top == window.self) {
        const div = createButtonsDiv();
        document.body.appendChild(div);
        const scribble = scribbleButton();
        div.appendChild(scribble);
        const gradient = gradientButton();
        div.appendChild(gradient);
    }
}

start();

