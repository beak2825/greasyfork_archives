// ==UserScript==
// @name         Delete "Try new TweetDeck Preview" button.
// @namespace    https://twitter.com/rin_jugatla
// @version      0.1
// @description  Delete "Try new TweetDeck Preview" button from old Tweetdeck.
// @author       rin_jugatla
// @match        https://tweetdeck.twitter.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470409/Delete%20%22Try%20new%20TweetDeck%20Preview%22%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/470409/Delete%20%22Try%20new%20TweetDeck%20Preview%22%20button.meta.js
// ==/UserScript==

let timer = null;
(function() {
    timer = setTimeout(deleteChangeVersionButton, 1000);
})();

function deleteChangeVersionButton(){
    const element = document.querySelector('div.js-gryphon-beta-btn.gryphon-beta-btn-container > button');
    if(element == null ){return;}

    element.remove();
    clearTimeout(timer);
}