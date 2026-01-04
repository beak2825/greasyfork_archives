// ==UserScript==
// @name         Google "View Image"
// @namespace    Google
// @version      0.1
// @description  Brings back the view image button that google removed for some reason
// @author       Google
// @include      /https://www.google.(com|co.[a-z]{2}|com.[a-z]{2}|[a-z]{2})*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39075/Google%20%22View%20Image%22.user.js
// @updateURL https://update.greasyfork.org/scripts/39075/Google%20%22View%20Image%22.meta.js
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
            var table = container.getElementsByClassName('_FKw irc_but_r')[0];
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
            btnLink.target = "_blank";

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