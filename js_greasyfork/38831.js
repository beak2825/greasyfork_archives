// ==UserScript==
// @name         View image button for google images
// @namespace    https://github.com/ehrenjn/
// @version      1.2
// @description  Brings back the view image button that google removed for some reason
// @author       Ehren Julien-Neitzert
// @include      /https://www\.?google\..+?/search/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38831/View%20image%20button%20for%20google%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/38831/View%20image%20button%20for%20google%20images.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (isGoogleImgs()) {
        makeObserver();
    }


    //adds view image buttons to all immersive containers (usually 3 of them)
    function addButtons() {
        var containers = document.getElementsByClassName('immersive-container');

        for (let c = 0; c < containers.length; c++) { //put a button in each immersive container
            var container = containers[c];
            var table = container.getElementsByClassName('irc_but_r')[0];
            var row = table.getElementsByTagName('tr')[0];

            var oldLinks = table.getElementsByClassName('viewImg');
            for (let l = 0; l < oldLinks.length; l++) { //get rid of the old view image button
                oldLinks[l].remove();
            }

            var newBtn = document.createElement('td');
            newBtn.setAttribute('class', 'viewImg');
            var btnLink = document.createElement('a');
            btnLink.href = container.getElementsByClassName('irc_mi')[0].src;
            newBtn.appendChild(btnLink);
            var text = document.createElement('span');
            text.innerText = "View image";
            btnLink.appendChild(text);

            row.childNodes[0].after(newBtn);
        }
    }


    //creates a mutation observer that adds view image buttons every time an image is clicked
    function makeObserver() {
        var observer = new MutationObserver(function(mutation){
            observer.disconnect();
            addButtons();
            reconnect(this);
        });
        reconnect(observer);

        function reconnect(observer) {
            var config = {
            'childList': true,
            'subtree': true
            };
            observer.observe(document, config);
        }
    }

    //checks if we're on google images
    function isGoogleImgs() {
        return document.getElementsByClassName('rg_ic').length !== 0;
    }
})();