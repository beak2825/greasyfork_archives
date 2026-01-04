// ==UserScript==
// @name         JukeHost songs links extractor
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Extract JukeHost songs links in one click
// @author       LynX
// @match        https://jukehost.co.uk/library
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jukehost.co.uk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476345/JukeHost%20songs%20links%20extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/476345/JukeHost%20songs%20links%20extractor.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function ExtractFunc() {
        let elems = document.querySelectorAll('#track-list > li');

        let SongLinks = []
        elems.forEach(ele => SongLinks.push('https://audio.jukehost.co.uk/' + ele.getAttribute('data-track-id')))
        navigator.clipboard.writeText(SongLinks .join('\n'));
    };


    let myDiv = document.getElementsByTagName("BODY")[0];
    // creating button element
    let button = document.createElement('BUTTON');
    button.setAttribute("id", "ExtractBtn");
    // creating text to be
    //displayed on button
    let text = document.createTextNode("Extract links");
    // appending text to button
    button.appendChild(text);
    // appending button to div
    myDiv.appendChild(button);;


    const btn = document.getElementById('ExtractBtn');
    btn.addEventListener("click", ExtractFunc);
    btn.style.position = 'absolute';

    btn.style.top = '30px';
    btn.style.left = '30px';


})();