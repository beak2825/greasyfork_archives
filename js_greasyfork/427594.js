// ==UserScript==
// @name         Neopets autofill
// @author       EatWoolooAsMuttonTiny, Tombaugh Regio
// @version      1.4
// @namespace    https://greasyfork.org/users/780470
// @description  Auto selects multi-choice options for Wise King, Grumpy King, Symol Hole, Turmaculus, and Meteor. Forked from EatWoolooAsMuttonTiny's Grumpy Wise King autofill
// @include      *://www.neopets.com/medieval/wiseking.phtml
// @include      *://www.neopets.com/medieval/symolhole.phtml
// @include      *://www.neopets.com/medieval/grumpyking.phtml
// @include      *://www.neopets.com/medieval/turmaculus.phtml
// @include      *://www.neopets.com/moon/meteor.phtml*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427594/Neopets%20autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/427594/Neopets%20autofill.meta.js
// ==/UserScript==

function setElement() {
  switch(window.location.href.match(/\w+(?=\.phtml)/)[0]) {
    case 'turmaculus' : return 'select#wakeup option'
    case 'grumpyking': return '.form-container__2021 select option'
    case 'meteor': return 'form select option[value="1"]'
    case 'wiseking':
    case 'symolhole':
      return 'form select option'
    default:
      return ''
  }
}

document.querySelectorAll(setElement()).forEach((e, i, options) => options[ Math.floor(Math.random() * (options.length - 1)) + 1 ].selected = true)