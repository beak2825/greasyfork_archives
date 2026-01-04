// ==UserScript==
// @name        Stop game info labels from overlapping games on itch.io
// @namespace   Itsnotlupus Industries
// @match       https://*.itch.io/*
// @grant       none
// @version     1.0
// @author      itsnotlupus
// @license     MIT
// @description put the game info labels above the game rather than fixed to the right side, which can overlap with narrow widths
// @downloadURL https://update.greasyfork.org/scripts/466689/Stop%20game%20info%20labels%20from%20overlapping%20games%20on%20itchio.user.js
// @updateURL https://update.greasyfork.org/scripts/466689/Stop%20game%20info%20labels%20from%20overlapping%20games%20on%20itchio.meta.js
// ==/UserScript==
const crel = (name, attrs, ...children) => ((e = Object.assign(document.createElement(name), attrs)) => (e.append(...children), e.__init?.(), e))();


document.head.append(crel('style',{
  type: 'text/css',
  textContent: `
    #user_tools { position: initial; display: block }
    #user_tools > li { display: inline }
  `
}))