// ==UserScript==
// @name        RuTracker.org - magnet links in search pages ("в google" only!)
// @namespace   RuTracker-Micdu70
// @version     2020.10.14
// @description Adds magnet links in RuTracker search pages ("в google" only!)
// @author      Micdu70
// @license     MIT
// @match       https://rutracker.org/forum/search_cse.php*
// @match       http://rutracker.org/forum/search_cse.php*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/382029/RuTrackerorg%20-%20magnet%20links%20in%20search%20pages%20%28%22%D0%B2%20google%22%20only%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/382029/RuTrackerorg%20-%20magnet%20links%20in%20search%20pages%20%28%22%D0%B2%20google%22%20only%21%29.meta.js
// ==/UserScript==

function checkResults(t){

    window.setTimeout(function(){

        var results = document.getElementsByClassName('gsc-results gsc-webResult')[0];

        if (results) {
            addMagnet();
            var xhrMagnetLinks = document.querySelectorAll('.xhrMagnetLink');
            addMouseoverListeners(xhrMagnetLinks);
            onOptionChange();
            onPageNumberChange();
        } else {
            t=t+1;
            if (t <= 60) { // try 60 times before give up (~30 sec)
                checkResults(t);
            }
        }

    }, 500);

}

function addMagnet(){

    var noResults = document.getElementsByClassName('gs-webResult gs-result gs-no-results-result')[0];

    if (noResults) {
        return false;
    }

    var result = document.getElementsByClassName('gs-webResult gs-result');

    for (let i=0; i < result.length-1; i++) {

        let title = result[i].getElementsByTagName('a')[0];
        let href = title.getAttribute('data-ctorig');

        if (href.substring(0, 5) == 'http:') {
            href = href.replace('http','https');
        }

        let ml = document.createElement('a');
        ml.setAttribute('class', 'xhrMagnetLink');
        ml.setAttribute('data-href', href);
        ml.setAttribute('href', '#DL-ML');
        ml.setAttribute('title', 'ML via XHR');
        ml.setAttribute('style', 'position: relative; top: 3px; margin-right: 6px;');

        let img = document.createElement("img");
        img.setAttribute('src', 'https://cdn2.iconfinder.com/data/icons/ledicons/magnet.png');

        ml.appendChild(img);

        title.parentNode.insertBefore(ml, title);

    }

}

function onOptionChange(){

    var optionClass = document.getElementsByClassName('gsc-option');
    var highlightedOption = 'gsc-option-menu-item gsc-option-menu-item-highlighted';

    for (let i=0; i < optionClass.length; i++) {

        if (optionClass[i].parentNode.className !== highlightedOption) {

            optionClass[i].addEventListener('click', function onOption(t){

                if (isNaN(t)) {
                    t=0;
                }

                window.setTimeout(function(){

                    var results = document.getElementsByClassName('gsc-results gsc-webResult')[0];
                    var magnetClass = document.getElementsByClassName('xhrMagnetLink')[0];

                    if (!magnetClass && results) {
                        optionClass[i].removeEventListener('click', onOption);
                        addMagnet();
                        var xhrMagnetLinks = document.querySelectorAll('.xhrMagnetLink');
                        addMouseoverListeners(xhrMagnetLinks);
                        onOptionChange();
                        onPageNumberChange();
                    } else {
                        t=t+1;
                        if (t <= 60) { // try 60 times before give up (~30 sec)
                            onOption(t);
                        }
                    }

                }, 500);

            }, false);

        }

    }

}

function onPageNumberChange(){

    var pageClass = document.getElementsByClassName('gsc-cursor-page');
    var currentPage = 'gsc-cursor-page gsc-cursor-current-page';

    for (let i=0; i < pageClass.length; i++) {

        if (pageClass[i].className !== currentPage) {

            pageClass[i].addEventListener('click', function onPageNumber(t){

                if (isNaN(t)) {
                    t=0;
                }

                window.setTimeout(function(){

                    var results = document.getElementsByClassName('gsc-results gsc-webResult')[0];
                    var magnetClass = document.getElementsByClassName('xhrMagnetLink')[0];

                    if (!magnetClass && results) {
                        addMagnet();
                        var xhrMagnetLinks = document.querySelectorAll('.xhrMagnetLink');
                        addMouseoverListeners(xhrMagnetLinks);
                        onPageNumberChange();
                    } else {
                        t=t+1;
                        if (t <= 60) { // try 60 times before give up (~30 sec)
                            onPageNumber(t);
                        }
                    }

                }, 500);

            }, false);

        }

    }

}

function addMouseoverListeners(links){

    for(let i=0; i < links.length; i++) {

        links[i].addEventListener('mouseover', function(event){

            event.preventDefault();
            let href = this.getAttribute('href');
            if (href === '#DL-ML') {
                let tLink = this.getAttribute('data-href');

                var xhr = new XMLHttpRequest();
                xhr.open('GET', tLink, false); // XMLHttpRequest.open(method, url, async)
                xhr.onload = function () {

                    let container = document.implementation.createHTMLDocument().documentElement;
                    container.innerHTML = xhr.responseText;

                    let retrievedLink1 = container.querySelector('.magnet-link');
                    let retrievedLink2 = container.querySelector('.magnet-link-1');

                    if (retrievedLink1) {
                        links[i].setAttribute('href', retrievedLink1.href);
                    }
                    else if (retrievedLink2) {
                        links[i].setAttribute('href', retrievedLink2.href);
                    } else {
                        let changeImg = links[i].getElementsByTagName("img")[0];
                        changeImg.setAttribute('src', 'https://cdn1.iconfinder.com/data/icons/silk2/cross.png');
                    }

                };
                xhr.send();

            }

        }, false);

    }

}

checkResults(0);