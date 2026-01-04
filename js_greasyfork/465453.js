// ==UserScript==
// @name         My Website Menu
// @description  menu that appears on every website with quick link to your favorite site i entered basic but you can add more (poki,google doc,chatgpt and classroom
// @include *
// @author       Julien Filion
// @license      JF TECH
// @version 1.0
// @namespace https://greasyfork.org/users/1072491
// @downloadURL https://update.greasyfork.org/scripts/465453/My%20Website%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/465453/My%20Website%20Menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the menu container
    var menuContainer = document.createElement('div');
    menuContainer.setAttribute('style', 'position: fixed; bottom: 10px; right: 10px; z-index: 9999;');

    // Create the menu items
    var pokiLink = document.createElement('a');
    pokiLink.setAttribute('href', 'https://poki.com');
    pokiLink.setAttribute('target', '_blank');
    pokiLink.innerText = 'Poki';

    var googleDocsLink = document.createElement('a');
    googleDocsLink.setAttribute('href', 'https://docs.google.com');
    googleDocsLink.setAttribute('target', '_blank');
    googleDocsLink.innerText = 'Google Docs';

    var openAIChatLink = document.createElement('a');
    openAIChatLink.setAttribute('href', 'https://chat.openai.com/');
    openAIChatLink.setAttribute('target', '_blank');
    openAIChatLink.innerText = 'OpenAI Chat';

    var classroomLink = document.createElement('a');
    classroomLink.setAttribute('href', 'https://classroom.google.com');
    classroomLink.setAttribute('target', '_blank');
    classroomLink.innerText = 'Google Classroom';

    // Create the text node with the author name
    var authorText = document.createTextNode('by Julien Filion');

    // Add the menu items and author text to the menu container
    menuContainer.appendChild(pokiLink);
    menuContainer.appendChild(document.createElement('br'));
    menuContainer.appendChild(googleDocsLink);
    menuContainer.appendChild(document.createElement('br'));
    menuContainer.appendChild(openAIChatLink);
    menuContainer.appendChild(document.createElement('br'));
    menuContainer.appendChild(classroomLink);
    menuContainer.appendChild(document.createElement('br'));
    menuContainer.appendChild(authorText);

    // Add the menu container to the page
    document.body.appendChild(menuContainer);
})();
