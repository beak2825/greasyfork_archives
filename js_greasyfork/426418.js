// ==UserScript==
// @name         Path of Exile Trade always fuzzy search (tilde)
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.3
// @description  always use fuzzy search, waits for active input bar and puts ~ (tilde) at the front
// @author       Alistair1231
// @match        https://www.pathofexile.com/trade*
// @icon         https://www.google.com/s2/favicons?domain=pathofexile.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/426418/Path%20of%20Exile%20Trade%20always%20fuzzy%20search%20%28tilde%29.user.js
// @updateURL https://update.greasyfork.org/scripts/426418/Path%20of%20Exile%20Trade%20always%20fuzzy%20search%20%28tilde%29.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // Select the target node
    var searchboxObserver = new MutationObserver(mutations => {
        mutations.filter(node => node.target.classList && node.target.classList.contains('multiselect--active')).forEach(activeNodes => {
            activeNodes = activeNodes.target;
            // find all input fields in the active nodes
            var inputField = activeNodes.querySelector('.multiselect__input');
            if(inputField.value.startsWith('~')) return;
            inputField.value = '~' + inputField.value;
            // select contents of input field, except the ~
            inputField.setSelectionRange(1, inputField.value.length);
        });
    });
    searchboxObserver.observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });


})();
