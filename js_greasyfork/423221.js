// ==UserScript==
// @name         ChordDesigner sound fix http://www.chorderator.com/
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        http://www.chorderator.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423221/ChordDesigner%20sound%20fix%20http%3Awwwchorderatorcom.user.js
// @updateURL https://update.greasyfork.org/scripts/423221/ChordDesigner%20sound%20fix%20http%3Awwwchorderatorcom.meta.js
// ==/UserScript==

var audioPlayer;

(function() {
    'use strict';

    // Your code here...

    let fretBoard = document.querySelector('#id_scale');
    let control = document.querySelector('div.answer');
    audioPlayer = document.createElement("audio");
    console.log('ajout');
    console.log(audioPlayer);
    control.append(audioPlayer);
    console.log(control);
    audioPlayer.controls = true;
    fretBoard.setAttribute('onclick', fretBoard.getAttribute('onclick').concat("; modifieBouton()"));
})();

  window.modifieBouton = () => {

    let balise_son = document.querySelector('#id_listen');
    let url = balise_son.getAttribute('href').match(/\((.*)\)/)[1].replace(/\'/g, '');
    console.log(url);
    balise_son.setAttribute('target', '_blank');
    balise_son.setAttribute('href', url);
    audioPlayer.src = url;
}

