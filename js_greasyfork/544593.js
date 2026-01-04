// ==UserScript==
// @name        codepoints.net add sample character examples
// @namespace   Violentmonkey Scripts
// @match       https://codepoints.net/*
// @grant       none
// @version     1.0.0
// @author      myf
// @description Seeing "embedded" page font examples is neat, but sometimes it is useful to see how your own system handles glyphs on its own. This script adds samples for each displayed instance.
// @license     CC0
// @downloadURL https://update.greasyfork.org/scripts/544593/codepointsnet%20add%20sample%20character%20examples.user.js
// @updateURL https://update.greasyfork.org/scripts/544593/codepointsnet%20add%20sample%20character%20examples.meta.js
// ==/UserScript==

/*
 * https://greasyfork.org/en/scripts/544593
*/

const fonts = [
  'Segoe UI Emoji',
  'Segoe UI Symbol',
  'Twemoji Mozilla',
  'Helvetica, Arial, sans-serif',
  'Verdana, system-ui, sans-serif',
  'Georgia, Times New Roman, serif'
];
function addChars() {
  const charEls = document.querySelectorAll('[data-cp]:not(:has(samp))');
  for ( const charEl of charEls ) {
    const dataCp = charEl.getAttribute('data-cp');
    const char = String.fromCodePoint(
      dataCp.indexOf('U+') == 0
      ? parseInt( dataCp.slice(2), 16 )
      : parseInt( dataCp )
    );
    const samp = document.createElement('samp');
    for ( const font of fonts ) {
      const span = document.createElement('span');
      span.style.fontFamily = font;
      span.textContent = char;
      if(font.indexOf('Emoji')>1) {
        span.textContent += '\uFE0F';
      }
      if(font.indexOf('Symbol')>1) {
        span.textContent += '\uFE0E';
      }
      span.title = font;
      samp.append(span);
    }
    charEl.tagName == 'MAIN'
    ? charEl.insertAdjacentElement('afterbegin',samp)
    : charEl.append(samp);
  }
}

addChars()

setInterval(addChars,500);