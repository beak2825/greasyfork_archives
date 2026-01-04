// ==UserScript==
// @name         Krunker.io - Hacker Finder
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Finds all hacker tagged users in a clan
// @author       Lemons
// @match        *://krunker.io/social.html?p=clan&q=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403294/Krunkerio%20-%20Hacker%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/403294/Krunkerio%20-%20Hacker%20Finder.meta.js
// ==/UserScript==

window.findHackers = function() {
    var clanList = document.getElementById('clanRoster');
    var children = [...clanList.firstChild.children];

    children.forEach(elem => {
        var child = elem.firstChild;
        if (!child.style.color) {
            child.parentElement.remove();
        }
    });
}

const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.className === 'scrollItem' && node.parentElement.id === 'clanInfo') {
                node.insertAdjacentHTML('beforeend', '<div id="profileLogin" class="button lgn buttonR" onclick="findHackers()" style="display: block; margin-bottom: 4px;">Find</div>');
            }
        });
    });
});

observer.observe(document.documentElement, {
    childList: true,
    subtree: true
});