// ==UserScript==
// @name         Verander Favicom van Smartschool naar de originele (voor Smartschool++ plugin)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Favicom verander naar OG 
// @author       Emree.el
// @match        https://*.smartschool.be/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507986/Verander%20Favicom%20van%20Smartschool%20naar%20de%20originele%20%28voor%20Smartschool%2B%2B%20plugin%29.user.js
// @updateURL https://update.greasyfork.org/scripts/507986/Verander%20Favicom%20van%20Smartschool%20naar%20de%20originele%20%28voor%20Smartschool%2B%2B%20plugin%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a new link element for the favicon
    let link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB/ElEQVR4AXWTA8ydSxBAz+zVz8fatq2gZlCEtY2gto0YtRG1cWrbtm1cY6dBsfmSnmTDzRmLzvnrJkJVvKgCP58AAiKePzwVnfaX4kUtackiESqEDeQimSSBxHuCNoyguPiJeQMr4QJ1STQcSKB8Y3w5f2FTSSIvb6P7ZpP14ToY4wjC4EZOFKgE3VbxX7kayJ3j8PAImvsfNr8wEk9BBBD+JFBs0/bkVK6HPbkb37pRSOwL4gtA9l9I7CtY4ykhwm+s4A/9gwDxbxFCn+L40womjfn60W2iK7COIIO5fg4i3wg068KXDx8IHN5F9vM7BFJREIMX0Wa56paggSC22zCk1zj0v0LEXr8kfuYgwT1ryL9zAUFBxBHUzFLHB6pgDLZqXbR9D6RVFyhVnsiDOzB3NPkXjoIxjqBMUHFxysEYtHR57NSlSNsuRPfsIGfCEEwy4emBi1VQC2JALHLpNpldO/C36UygeBk0E4JwFEQcgdODSJUqpP/6i9D9e5h4nMz/f5Fu3AK/CObWbcy7r5BWQAEQ9YkCgKJAZNEi6DeA1O1b2I8f8RUrRm6tOpgH96F/P3xnzoHPaWLipwpQEWy7tvh69cJUqw55eeiH99hTJ9GNmzFXr+JF3nqvQwG/D/76C0JBiEQhHAarIOBFHgS5oVANL55L/gOPvwO3F9zSBxgX5QAAAABJRU5ErkJggg==';
    
    // Append the link element to the head of the document
    document.head.appendChild(link);
})();
