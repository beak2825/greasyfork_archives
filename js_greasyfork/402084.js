// ==UserScript==
// @name         Don't Hunt
// @namespace    https://greasyfork.org/en/scripts/402084-don-t-hunt
// @version      1.0
// @description  Disables the hunting screen to prevent you from using your energy while in SA.
// @author       cryosis7 [926640]
// @match        https://www.torn.com/index.php?page=hunting
// @downloadURL https://update.greasyfork.org/scripts/402084/Don%27t%20Hunt.user.js
// @updateURL https://update.greasyfork.org/scripts/402084/Don%27t%20Hunt.meta.js
// ==/UserScript==

'use strict'

let blocker = elementCreator('div', { 'class': 'm-top10' });
blocker.appendChild(elementCreator('div', { 'class': 'title-black top-round', 'aria-level': '5' }, 'STOP'));
let body = (elementCreator('div', { 'class': 'bottom-round cont-gray p10' }))
body.appendChild(elementCreator('p', null, "You are <span style='color: red; font-weight:bold'>NOT</span> allowed to use your energy to hunt!"));
body.appendChild(document.createElement('br'));
blocker.appendChild(body)

document.querySelector('.hunt').replaceWith(blocker);

/**
 * Creates an HTML element according to the given parameters
 * 
 * @param {String} type The HTML type to create ('div')
 * @param {Object} attributes Attributes to set {'class': 'wrapper'}
 * @param {String} text 'Inner text/html to set'
 */
function elementCreator(type = 'div', attributes, text) {
    let el = document.createElement(type);
    for (let attribute in attributes)
        el.setAttribute(attribute, attributes[attribute])
    if (text) el.innerHTML = text;
    return el
}