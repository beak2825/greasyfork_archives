// ==UserScript==
// @name        Jump to coments in Webtoons.com
// @namespace   https://github.com/DDGammulle/
// @description Jumps to the comment section when the button is clicked
// @author      Damith D. Gammulle, OpenAI's GPT-3
// @license     MIT
// @include     https://www.webtoons.com/*/viewer?*
// @version     1.0
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/485232/Jump%20to%20coments%20in%20Webtoonscom.user.js
// @updateURL https://update.greasyfork.org/scripts/485232/Jump%20to%20coments%20in%20Webtoonscom.meta.js
// ==/UserScript==

// Add a floating button
GM_addStyle(`
    #jumpButton {
        position: fixed;
        top: 20px;
        left: 50%;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #4CAF50;
        color: white;
        text-align: center;
        line-height: 60px;
        font-size: 24px;
        cursor: pointer;
        z-index: 100;
    }
`);

window.addEventListener('load', function() {
    // Create the floating button
    var button = document.createElement('div');
    button.id = 'jumpButton';
    button.innerHTML = 'Jump';
    document.body.appendChild(button);

    // Add the click event listener
    button.addEventListener('click', function() {
        var section = document.getElementById('cbox_module');
        section.scrollIntoView({behavior: 'smooth'});
    }, false);
}, false);