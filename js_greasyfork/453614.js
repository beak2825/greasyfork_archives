// ==UserScript==
// @name         AO3 Formatting Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.4.2
// @license      MIT
// @description  Keyboard shortcuts for HTML tags
// @author       Grumblesaur
// @match        https://archiveofourown.org/works/*
// @match        https://archiveofourown.org/comments/*
// @match        https://archiveofourown.org/chapters/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453614/AO3%20Formatting%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/453614/AO3%20Formatting%20Shortcuts.meta.js
// ==/UserScript==
 
/*
 * Introduces shortcuts to type HTML elements into Archive of our Own
 * (AO3) text boxes. The shortcuts are:
 *   - Ctrl b: <b></b> – bold text
 *   - Ctrl d: <details></details> – a hideable element
 *   - Ctrl e: <em></em> – semantic emphatic italics
 *   - Ctrl i: <i></i> – italics
 *   - Ctrl k: <cite></cite> – semantic title italics
 *   - Ctrl l: <li></li> – list item
 *   - Ctrl m: <mark></mark> – highlighting
 *   - Ctrl o: <ol></ol> – ordered list
 *   - Ctrl p: <p></p> – paragraph
 *   - Ctrl q: <q></q> – inline quote
 *   - Ctrl s: <s></s> – strikethrough
 *   - Ctrl u: <u></u> – underline
 *
 *   - Ctrl Shift b: <blockquote></blockquote> – block quote
 *   - Ctrl Shift c: <code></code> – monospace/code
 *   - Ctrl Shift i: <img src="" alt="(image description here)" /> – image
 *   - Ctrl Shift m: <summary></summary> – heading for a <details> element
 *   - Ctrl Shift n: <br/> – forced line break
 *   - Ctrl Shift s: <strong></strong> – semantic emphatic bold
 *   - Ctrl Shift u: <ul></ul> – unordered list
 */
 
function getTagMap() {
  return {
    'shifted': {
      'b' : ['<blockquote>', '</blockquote>'],
      'c' : ['<code>', '</code>'],
      'i' : ['<img src="', '" alt="(image description here)" />'],
      'm' : ['<summary>', '</summary>'],
      'n' : ['', '<br/>'],
      's' : ['<strong>', '</strong>'],
      'u' : ['<ul>', '</ul>']
    },
    'normal': {
      'b' : ['<b>', '</b>'],
      'd' : ['<details>', '</details>'],
      'e' : ['<em>', '</em>'],
      'i' : ['<i>', '</i>'],
      'k' : ['<cite>', '</cite>'],
      'l' : ['<li>', '</li>'],
      'm' : ['<mark>', '</mark>'],
      'o' : ['<ol>', '</ol>'],
      'p' : ['<p>', '</p>'],
      'q' : ['<quote>', '</quote>'],
      's' : ['<s>', '</s>'],
      'u' : ['<u>', '</u>']
    }
  }
}
 
 
function localError(msg) {
  console.log("(AO3 Formatting Shortcuts): " + msg);
}
 
(function() {
  'use strict';
  // Insert a pair of HTML tags into the active text area, and rewind the
  // cursor to sit between them.
  function typeInTextarea(opening, closing, el = document.activeElement) {
    const [start, end] = [el.selectionStart, el.selectionEnd];
    let selected = el.value.substring(start, end);
    el.setRangeText(opening + selected + closing, start, end, 'end');
    el.selectionStart -= closing.length;
    el.selectionEnd -= closing.length;
  }
 
  const tagMap = getTagMap();
 
  function formatting(event) {
    /* Separated shift key from capitalization to enable the use
     * of shortcuts when users have capslock on. */
    let shiftState = event.shiftKey ? 'shifted' : 'normal';
    let keyPress = event.key.toLowerCase();
    if (event.ctrlKey && Object.keys(tagMap[shiftState]).includes(keyPress)) {
      event.preventDefault();
      const tags = tagMap[shiftState][keyPress];
      if (tags.includes(null) || tags.includes(undefined)) {
        /* This shouldn't happen. */
        localError("Problem with command key: " + keyPress);
        return;
      }
      typeInTextarea(tags[0], tags[1]);
    }
  }
 
  document.addEventListener('keydown', formatting, false);
})();