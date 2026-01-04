// ==UserScript==
// @name         SeeThroughTimes
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  Read that news :)
// @author       Jony
// @include      /^https://www.nytimes.com/(?!section).*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427462/SeeThroughTimes.user.js
// @updateURL https://update.greasyfork.org/scripts/427462/SeeThroughTimes.meta.js
// ==/UserScript==

// 0.10 Initial release
// 0.11 Added regex to stop code running on summary pages
// 0.12 Added regex for articles
// 0.13 Amended regex for any page that is not a section...
// 0.14 Furter fine tuning of regex

(function() {
    var completed = false;
    'use strict';
    function observeDOM(callback,disconnect){ // a function which observes the DOM and calls the callback function every time there's a new mutation
        var mutationObserver = new MutationObserver(function(mutations) { //https://davidwalsh.name/mutationobserver-api
            mutations.forEach(function(mutation) {
                if (typeof(mutation.target.className) != "string"){return}
                callback(mutation,mutationObserver);
            });
        });
        // Keep an eye on the DOM for changes
        mutationObserver.observe(document.body, { //https://blog.sessionstack.com/how-javascript-works-tracking-changes-in-the-dom-using-mutationobserver-86adc7446401
            attributes: true,
            //  characterData: true,
            childList: true,
            subtree: true,
            //  attributeOldValue: true,
            //  characterDataOldValue: true,
            //attributeFilter: ["class"] // We're really only interested in stuff that has a className
        });}

    function run () {
        // allows scrolling
        document.querySelectorAll('div')[2].setAttribute("class", "");

        // remove login/purchase popup
        var item = document.getElementById('gateway-content');
        item.parentNode.removeChild(item);

        // unfade the content
        var app = document.querySelector('#app');
        var fadedDiv = app.querySelectorAll('div')[app.querySelectorAll('div').length - 1];
        fadedDiv.parentNode.removeChild(fadedDiv);
    };
    function doDomStuff(mutation){ // runs every time there's any change to the DOM
        if (completed === false) {
            if (document.querySelector('body').classList.contains('completed')){
            } else {
                var textContent = mutation.target.textContent;
                if (textContent.includes('No commitment required, cancel anytime.') || textContent.includes('Keep reading with one of these options:') || textContent.includes('Subscribe Now')) {
                    run();
                    completed = true;
                    document.querySelector('body').classList.add('completed');
                    console.log('Completed.');
                } else {
                }
            }
        }

    }

    console.log('Running...');
    observeDOM(doDomStuff);
})();
