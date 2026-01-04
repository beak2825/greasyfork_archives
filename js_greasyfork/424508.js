// ==UserScript==
// @name        https-nowhere
// @namespace   jobbautista.neocities.org
// @description Replaces links that has https to http
// @description:tl Palitan lahat ng mga kawing na may https sa http
// @author Job Bautista
// @include     *
// @exclude     
// @version     1.1
// @grant       none
// @license     EFL-2.0
// @supportURL  mailto:jobbautista9@aol.com
// @downloadURL https://update.greasyfork.org/scripts/424508/https-nowhere.user.js
// @updateURL https://update.greasyfork.org/scripts/424508/https-nowhere.meta.js
// ==/UserScript==
/*

  Eiffel Forum License, version 2

   1. Permission is hereby granted to use, copy, modify and/or
      distribute this package, provided that:
          * copyright notices are retained unchanged,
          * any distribution of this package, whether modified or not,
      includes this license text.
   2. Permission is hereby also granted to distribute binary programs
      which depend on this package. If the binary program depends on a
      modified version of this package, you are encouraged to publicly
      release the modified version of this package.

***********************

THIS PACKAGE IS PROVIDED "AS IS" AND WITHOUT WARRANTY. ANY EXPRESS OR
IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE AUTHORS BE LIABLE TO ANY PARTY FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES ARISING IN ANY WAY OUT OF THE USE OF THIS PACKAGE.

***********************

*/
var links = document.getElementsByTagName("a");
var step;
for (step = 0; step < links.length; step++) {
 if (links[step].protocol === "https:" && links[step].host !== location.host){
  links[step].protocol = "http:";
 }
}