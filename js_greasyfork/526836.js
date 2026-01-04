// ==UserScript==
// @name         higherlowergame "hack"
// @description  why did i make this...
// @icon         https://i.imgur.com/ORAaPzD.png
// @version      2

// @author       VillainsRule
// @namespace    https://villainsrule.xyz

// @match        *://*.higherorlowergame.com/*
// @match        *://*.higherlowergame.com/*

// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526836/higherlowergame%20%22hack%22.user.js
// @updateURL https://update.greasyfork.org/scripts/526836/higherlowergame%20%22hack%22.meta.js
// ==/UserScript==

const higherorlowergame_com = () => {
    Object._values = Object.values
    Object.values = function(obj) {
        if (Object.prototype.toString.call(obj) === "[object Module]") {
            let keys = Object.keys(obj);
            window.answers = obj[keys[0]];
            console.log('got answers', window.answers);
        }

        return Object._values(obj);
    }

    const observer = new MutationObserver(() => {
        console.log('observer called!');

        let headers = document.querySelectorAll('.playfield-pane__heading');
        if (!headers) return;

        let alpha = headers[0].innerText;
        let beta = headers[1].innerText;

        console.log('found two options', alpha, beta);

        let alphaTrack = answers.find((a) => a.title == alpha);
        let betaTrack = answers.find((a) => a.title == beta);

        console.log('found option tracks', alphaTrack, betaTrack);

        if (alphaTrack.playCount > betaTrack.playCount) window.correctIndex = 0;
        else window.correctIndex = 1;

        console.log('decided correctIndex', window.correctIndex);

        document.querySelectorAll('.playfield-pane__heading')[window.correctIndex].style.backgroundColor = 'green';
        document.querySelectorAll('.playfield-pane__heading')[+!window.correctIndex].style.backgroundColor = 'red';

        console.log('updated DOM');
    });

    window.addEventListener('load', () => observer.observe(document.body, {
        childList: true,
        subtree: true
    }));
}

const higherlowergame_com = () => window.addEventListener('load', () => {
    if (!document.querySelector('div')) return;

    const observer = new MutationObserver(() => {
        let game = document.querySelector('.game');
        if (!game) return;

        let reactProps = Object.keys(game).find(key => key.startsWith('__reactInternalInstance'));
        let gameData = game[reactProps]._currentElement.props.children[0].props.children;

        let left = gameData[0].props.term;
        let right = gameData[1].props.term;

        let isHigher = left.searchVolume < right.searchVolume;

        let higherButton = document.querySelector('.term-actions__button--higher');
        let lowerButton = document.querySelector('.term-actions__button--lower');

        if (higherButton) higherButton.style.borderColor = isHigher ? 'lime' : 'red';
        if (lowerButton) lowerButton.style.borderColor = !isHigher ? 'lime' : 'red';
    });

    observer.observe(document.querySelector('div'), {
        childList: true,
        subtree: true
    });
})

let url = new URL(location.href);

if (url.host.endsWith('higherorlowergame.com')) higherorlowergame_com();
if (url.host.endsWith('higherlowergame.com')) higherlowergame_com();