// ==UserScript==
// @name         Anti-Zalgo (Fork)
// @namespace    https://greasyfork.org/en/users/2205
// @version      1.1
// @description  Strip certain ranges of text that can be used to create Zalgo text from web pages
// @license      The Unlicense
// @author       NRGLG (original) Rudokhvist(fork)
// @run-at       document-end
// @include      http://*/*
// @include      https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400659/Anti-Zalgo%20%28Fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/400659/Anti-Zalgo%20%28Fork%29.meta.js
// ==/UserScript==
/*
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>
*/

(function()
{
 function textNodesUnder(el){
  var n, a=[], walk=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null,false);
  while(n=walk.nextNode()) a.push(n);
  return a;
 }
  // more specific filters
  // following the Unicode categorization
  // this list is incomplete at the moment
  var blockedRanges = [
      ////////////////////////////////////////////////
      // European Scripts
      [0xFB1E, 0xFB1E], // Alphabetic Presentation Forms

      [0x0483, 0x0489], // Cyrillic

      [0x2DE0, 0x2DFF], // Cyrillic Extended-A

      [0xA66F, 0xA672], // Cyrillic Extended-B
      [0xA674, 0xA67D], // Cyrillic Extended-B
      [0xA69E, 0xA69F], // Cyrillic Extended-B

      [0x10376, 0x1037A], // Old Permic

      [0x101FD, 0x101FD], // Phaistos Disc

      ////////////////////////////////////////////////
      // Combining Marks
      [0x0300, 0x036F], // Combining Diacritical Marks
      [0x1AB0, 0x1ABE], // Combining Diacritical Marks Extended
      [0x1DC0, 0x1DFF], // Combining Diacritical Marks Supplement
      [0x20D0, 0x20F0], // Combining Diacritical Marks for Symbols
      [0xFE20, 0xFE2F], // Combining Half Marks

      ////////////////////////////////////////////////
      // African Scripts
      [0xA6F0, 0xA6F1], // Bamum

      [0x16AF0, 0x16AF4], // Bassa Vah

      [0x2CEF, 0x2CF1], // Coptic

      [0x102E0, 0x102E0], // Coptic Epact Numbers

      [0x1E8D0, 0x1E8D6], // Mende Kikakui

      [0x07EB, 0x07F3], // N'Ko

      [0x2D7F, 0x2D7F], // Tifinagh

      ////////////////////////////////////////////////
      // Middle Eastern Scripts
      [0x0610, 0x061A], // Arabic
      [0x064B, 0x065F], // Arabic
      [0x0670, 0x0670], // Arabic +
      [0x0674, 0x0674], // Arabic +
      [0x06D6, 0x06DC], // Arabic
      [0x06DF, 0x06E4], // Arabic
      [0x06E7, 0x06E8], // Arabic
      [0x06EA, 0x06ED], // Arabic

      [0x08E4, 0x08FF], // Arabic Extended-A

      [0x0591, 0x05BD], // Hebrew
      [0x05BF, 0x05BF], // Hebrew
      [0x05C1, 0x05C2], // Hebrew
      [0x05C4, 0x05C5], // Hebrew
      [0x05C7, 0x05C7], // Hebrew

      [0x0859, 0x085B], // Mandaic

      [0x0816, 0x0819], // Samaritan
      [0x081B, 0x0823], // Samaritan
      [0x0825, 0x0827], // Samaritan
      [0x0829, 0x082D], // Samaritan

      [0x0711, 0x0711], // Syriac
      [0x0730, 0x074A], // Syriac

      ////////////////////////////////////////////////
      // Central Asian Scripts
      [0x10AE5, 0x10AE6], // Manichaean

      [0x18A9, 0x18A9], // Mongolian

      [0x0F00, 0x0FDA], // Tibetan (I'm going to block this whole language)

      ////////////////////////////////////////////////
      // South Asian Scripts
      [0x1171D, 0x1172B], // Ahom

      [0x0980, 0x0983], // Bengali
      [0x09BC, 0x09BC], // Bengali
      [0x09BE, 0x09C4], // Bengali
      [0x09C7, 0x09C8], // Bengali
      [0x09CB, 0x09CE], // Bengali
      [0x09D7, 0x09D7], // Bengali
      [0x09E2, 0x09E3], // Bengali

      [0x11000, 0x11002], // Brahmi
      [0x11038, 0x11046], // Brahmi

      [0x11100, 0x11102], // Chakma
      [0x11127, 0x11134], // Chakma

      [0x0900, 0x0903], // Devanagari
      [0x093A, 0x094F], // Devanagari
      [0x0951, 0x0957], // Devanagari
      [0x0962, 0x0963], // Devanagari

      [0xA8E0, 0xA8F0], // Devanagari Extended

      [0x11300, 0x11303], // Grantha
      [0x1133C, 0x1133C], // Grantha
      [0x1133E, 0x1134D], // Grantha
      [0x11357, 0x11357], // Grantha
      [0x11362, 0x11374], // Grantha

      [0x0A81, 0x0A83], // Gujarati
      [0x0ABC, 0x0ABC], // Gujarati
      [0x0ABE, 0x0ACD], // Gujarati
      [0x0AE2, 0x0AE3], // Gujarati

      [0x0A01, 0x0A03], // Gurmukhi
      [0x0A3C, 0x0A51], // Gurmukhi
      [0x0A70, 0x0A71], // Gurmukhi
      [0x0A75, 0x0A75], // Gurmukhi

      [0x11080, 0x11082], // Kaithi
      [0x110B0, 0x110BA], // Kaithi

      [0x0C81, 0x0C83], // Kannada
      [0x0CBC, 0x0CBC], // Kannada
      [0x0CBE, 0x0CD6], // Kannada
      [0x0CE2, 0x0CE3], // Kannada

        // assorted
      [0x1920, 0x193B], // Limbu

      [0x0D01, 0x0D03], // Malayalam
      [0x0D3E, 0x0D57], // Malayalam
      [0x0D62, 0x0D63], // Malayalam

      [0x0D82, 0x0D83], // Sinhala
      [0x0DCA, 0x0DDF], // Sinhala
      [0x0DF2, 0x0DF3], // Sinhala

      [0x0C00, 0x0C03], // Telugu
      [0x0C3E, 0x0C56], // Telugu
      [0x0C62, 0x0C63], // Telugu

      [0x1CD0, 0x1CD2], // Vedic Extensions
      [0x1CD4, 0x1CE8], // Vedic Extensions
      [0x1CED, 0x1CED], // Vedic Extensions
      [0x1CF2, 0x1CF4], // Vedic Extensions
      [0x1CF8, 0x1CF9], // Vedic Extensions

      ////////////////////////////////////////////////
      // Southeast Asian Scripts

      [0x0E31, 0x0E31], // Thai
      [0x0E34, 0x0E3A], // Thai
      [0x0E47, 0x0E4F] // Thai

      ////////////////////////////////////////////////
      // Indonesia & Oceania Scripts

      ////////////////////////////////////////////////
      // East Asian Scripts

      ////////////////////////////////////////////////
      // American Scripts

      ////////////////////////////////////////////////
      // Other

  ];

  function clearZalgo(value,index)
  {
      var text = value.textContent;
      var finalText = '';
      var dirty = false;

      for (var i = 0; i < text.length; i++)
      {
          var charCode = text.charCodeAt(i);

          // If in ASCII and ASCII extended limit, don't bother
          // this will drastically decrease processing time
          if (charCode >= 256)
          {
              var filterIndex = (blockedRanges.length / 2) | 0;
              var size = (blockedRanges.length / 4) | 0;
              var lastSize = size;

              while (true)
              {
                  if (blockedRanges[filterIndex][1] < charCode)
                  {
                      filterIndex = (filterIndex + size) | 0;
                      size = Math.ceil(size / 2) | 0;
                  }
                  else if (blockedRanges[filterIndex][0] > charCode)
                  {
                      filterIndex = (filterIndex - size) | 0;
                      size = Math.ceil(size / 2) | 0;
                  }
                  else
                  {
                      break;
                  }

                  if (lastSize == size) break;
                  lastSize = size;
              }

              var filterA = blockedRanges[Math.max(filterIndex - 1, 0)];
              var filterB = blockedRanges[filterIndex];

              if ((charCode >= filterB[0] && charCode <= filterB[1]) ||
                  (charCode >= filterA[0] && charCode <= filterA[1]))
              {
                  charCode = 0;
                  if (!dirty)
                  {
                      dirty = true;
                      finalText = text.substr(0, i);
                  }
              }
          }

          if (dirty && charCode > 0){
              finalText += text.charAt(i);
          }
      }

      if (dirty){
          value.textContent = finalText;
      }
  }

  // even out the arrays with this since nulls wouldn't show up anyways
  if ((blockedRanges.length % 2) == 1){
      blockedRanges.unshift([0, 0]);
  }

  blockedRanges.sort(function(a, b)
  {
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      return 0;
  });
 //clear static text
 let allTextNodes = textNodesUnder(document.body);
 let notEmptyTextNodes = Array.prototype.filter.call(allTextNodes, function (elem) {return elem.textContent.trim() !== ''; });
 notEmptyTextNodes.forEach(clearZalgo);
 //clear dynamic text
 let mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
           let allTextNodes = textNodesUnder(mutation.target)
           let notEmptyTextNodes = Array.prototype.filter.call(allTextNodes, function (elem) {return elem.textContent.trim() !== ''; });
           notEmptyTextNodes.forEach(clearZalgo);
      });
  });
  mutationObserver.observe(document.documentElement, {
      childList: true,
      characterData: true,
      subtree: true
  });
})();
