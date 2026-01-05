// ==UserScript==
// @name        Always Can Check Spelling
// @description Seek out and remove all checkspelling="false" attributes. This restores default behavior, i.e., does not turn on spellcheck for text inputs.
// @author      Jefferson "jscher2000" Scher
// @namespace   JeffersonScher
// @copyright   Copyright 2015 Jefferson Scher
// @license     BSD with restriction
// @include     *
// @version     0.5
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/11786/Always%20Can%20Check%20Spelling.user.js
// @updateURL https://update.greasyfork.org/scripts/11786/Always%20Can%20Check%20Spelling.meta.js
// ==/UserScript==

function clearNoSpell(){
  var nospell = document.querySelectorAll('[spellcheck="false"]');
  for (var i=0; i<nospell.length; i++){
   nospell[i].removeAttribute("spellcheck");
  }
}
// Run after document load
clearNoSpell();
// Add to monkey menu in case something changes in the page (can't reach into iframes)
GM_registerMenuCommand("Clear Spellcheck Blockers", clearNoSpell);

/*
Copyright (c) 2015 Jefferson Scher. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met and subject to the following restriction:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

RESTRICTION: USE WITH ANY @include or @match THAT COVERS FACEBOOK.COM IS PROHIBITED AND UNLICENSED.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/