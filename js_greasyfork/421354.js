// ==UserScript==
// @name         TORN: No Poker Chat
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  remove poker chat
// @author       monogamy [2563432]
// @match        https://www.torn.com/loader.php?sid=holdem*
// @downloadURL https://update.greasyfork.org/scripts/421354/TORN%3A%20No%20Poker%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/421354/TORN%3A%20No%20Poker%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // to log or not to log, that is the question
    const logging = false;

    // the root of all evil isn't money, it's chat
    const chatRoot = $( '#chatRoot' )[0];

    function delPokerChat() {
        let pokerRoot = $( chatRoot ).find('[title^="Poker "]')
        if (pokerRoot.length && pokerRoot[0].parentNode) {
            let pokerParents = pokerRoot.parents()
            if (logging) { console.log('poker', pokerRoot, pokerParents) }
            let pokerBox = pokerParents[1];
            let pokerParent = pokerParents[2];
            if ($( pokerBox ).next().length ) {
                // If I have a later sibling, make me the last of my parent's children
                $( pokerParent ).append($( pokerBox ));
                if (logging) { console.log("Hid Poker Chat Box: ", pokerParent, pokerBox) }
            }
            $( pokerBox ).css('visibility', 'hidden');
        }
    }

    const chatCallBack = function(mutationsList, observer) { delPokerChat() };

    const chatObserver = new MutationObserver(chatCallBack);
    const chatObserverConfig = { attributes: false, childList: true, subtree: true };
    chatObserver.observe( chatRoot, chatObserverConfig);

    delPokerChat();
})();