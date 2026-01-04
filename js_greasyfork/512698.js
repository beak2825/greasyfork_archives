// ==UserScript==
// @name         Dead Frontier Mini Window(MAP)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Dead Frontier-Adds a button to the Dead Frontier page that when clicked shows or hides a mini-window with multiple buttons opening images in an iframe
// @author       SHUNHK
// @match        *fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=0
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=21
// @match        *fairview.deadfrontier.com/onlinezombiemmo/
// @icon         https://i.imgur.com/MLMzEQh.jpeg
// @license      LGPL License
// @downloadURL https://update.greasyfork.org/scripts/512698/Dead%20Frontier%20Mini%20Window%28MAP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512698/Dead%20Frontier%20Mini%20Window%28MAP%29.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var button = document.createElement('button');
    button.innerHTML = 'Mini MAP';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '100px';
    button.style.zIndex = '1000';
    document.body.appendChild(button);


    var buttonFrame = document.createElement('div');
    buttonFrame.style.display = 'none';
    buttonFrame.style.position = 'fixed';
    buttonFrame.style.top = '50px';
    buttonFrame.style.right = '100px';
    buttonFrame.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    buttonFrame.style.border = '1px solid black';
    buttonFrame.style.padding = '10px';
    buttonFrame.style.zIndex = '1000';
    buttonFrame.style.borderRadius = '10px';
    buttonFrame.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    buttonFrame.style.backgroundImage = 'url("https://i.imgur.com/MLMzEQh.jpeg")'; //
    buttonFrame.style.backgroundSize = 'cover';
    document.body.appendChild(buttonFrame);


    var images = [
        { text: 'Doggs Stockade', url: 'https://i.imgur.com/izIHCFT.jpeg' },
        { text: 'Camp Valcrest', url: 'https://i.imgur.com/3XIAcf4.jpeg' },
        { text: 'Northeastern region', url: 'https://i.imgur.com/mJt2Ccu.jpeg' },
        { text: 'Nastyas Holdout', url: 'https://i.imgur.com/gPkKmNe.jpeg' },
        { text: 'Fort Pastor', url: 'https://i.imgur.com/B175RJX.jpeg' },
        { text: 'Secronom Bunker', url: 'https://i.imgur.com/ApJArfX.jpeg' },
        { text: 'Undisclosed', url: '' },
        { text: 'Precinct 13', url: 'https://i.imgur.com/T6MpTfd.jpeg' },
        { text: 'SEZ (Death Row)', url: 'https://i.imgur.com/atRtOJe.jpeg' },
        { text: 'Wasteland', url: '' }
    ];


    //
    function createImageButtons() {
        buttonFrame.innerHTML = ''; //
        var row;
        images.forEach(function(image, index) {
            if (index % 3 === 0) {
                row = document.createElement('div');
                row.style.display = 'flex';
                buttonFrame.appendChild(row);
            }
            var imageButton = document.createElement('button');
            imageButton.innerHTML = image.text;
            imageButton.style.flex = '1';
            imageButton.style.margin = '5px';
            imageButton.style.padding = '30px'; //
            imageButton.style.backgroundColor = ''; //
            imageButton.style.color = ''; //
            imageButton.style.border = ''; //
            imageButton.style.borderRadius = ''; //
            imageButton.style.cursor = 'pointer';
            imageButton.addEventListener('click', function() {
                var img = document.createElement('img');
                img.src = image.url;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                buttonFrame.innerHTML = ''; //
                buttonFrame.appendChild(img);
            });
            row.appendChild(imageButton);
        });
    }

    //
    button.addEventListener('click', function() {
        if (buttonFrame.style.display === 'none') {
            createImageButtons(); //
            buttonFrame.style.display = 'block';
        } else {
            buttonFrame.style.display = 'none';
        }
    });
})();
