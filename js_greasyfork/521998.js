// ==UserScript==
// @name         WASD tp for BETA
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  allows to tp in beta of brofist.io
// @author       CiNoP & ARCH
// @match        https://brofist.io/beta/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=brofist.io
// @license      GPL-3.0-only
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521998/WASD%20tp%20for%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/521998/WASD%20tp%20for%20BETA.meta.js
// ==/UserScript==
/* jshint esversion: 11 */

var c = Function.prototype.call;

Function.prototype.call = function(...a) {
    a[0]?.[0]?._name == 'Ref' && cinop(a[0][0]._components[0]?.mapManager)
    return c.apply(this, a)
};

function cinop(temp1) {
    document.body.onkeydown = (event) => {
    if (event.key.toLowerCase() == 'a') {
      temp1.characters[0].node.setPosition(temp1.characters[0].node.getPosition().x-300,
        temp1.characters[0].node.getPosition().y,0
      )
    }
    if (event.key.toLowerCase() == 'w') {
      temp1.characters[0].node.setPosition(temp1.characters[0].node.getPosition().x,
        temp1.characters[0].node.getPosition().y+300,0
      )
    }
    if (event.key.toLowerCase() == 'd') {
      temp1.characters[0].node.setPosition(temp1.characters[0].node.getPosition().x+300,
        temp1.characters[0].node.getPosition().y,0
      )
    }
    if (event.key.toLowerCase() == 's') {
      temp1.characters[0].node.setPosition(temp1.characters[0].node.getPosition().x,
        temp1.characters[0].node.getPosition().y-300,0
        )
    }
}
}