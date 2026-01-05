// ==UserScript==
// @name learn.co banner killer
// @description Kills annoying lower banner element
// @namespace learn_co
// @include http://learn.co/*
// @include https://learn.co/*
// @include http://*.learn.co/*
// @include https://*.learn.co/*
// @version 1
// @run-at  document-body
// @grant   none
// @downloadURL https://update.greasyfork.org/scripts/27835/learnco%20banner%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/27835/learnco%20banner%20killer.meta.js
// ==/UserScript==

/* To learn.co students:
the @include defines the url in which the script will operate.
Don't forget to include it (remember asterisks define anything that will come after it,
so if learn.co/lessons/etc is after learn.co the script will still run on that url and beyond.
*/

/*
we pass the className parameter to define our class in the html div.
typically itll be div id or div class, it depends but it doesnt matter,
but make sure you inspect the elements you want to remove in the console,
because if its a div class you will need to use the 
``` removeElementsByClass ``` method, otherwise its byID. 

in this example, the banner we want to remove at the bottom has a classname
which is "site-banner site-banner--bottom util--show-medium-up" - so thats
what we want to remove.
*/
(function removeElementsByClass(className) {
    'use strict';
    className = 'site-banner site-banner--bottom util--show-medium-up';

    // we want to grab the element, so we pass className to our elementToRemove
    // then we enter our loop
    // however, we need to remove the parent first in order
    // to remove the child
    // i'm not 100% on the reason why, i dont think it was always like this but
    // i think something changed from the documentation i read, but basically
    // make sure you always remove the parent, too.
    // then we basically remove the child (the element we defined)

    // very basic, functional js script!
    // i encourage everyone learning js to get familiar with the
    // getElements methods, they are very useful,
    // and to check out the further documentation on MDN
    var elementToRemove = document.getElementsByClassName(className);
    while(true){
        elementToRemove[0].parentNode.removeChild(elementToRemove[0]);
    }
})();