// ==UserScript==
// @name        LibraryThing make Helpers Log easier to scan
// @namespace   https://greasyfork.org/en/users/11592-max-starkenburg
// @description Changes to how the log is output to make it easier to quickly scan
// @include     http*://*librarything.tld/log_helpers.php*
// @include     http*://*librarything.com/log_helpers.php*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/19883/LibraryThing%20make%20Helpers%20Log%20easier%20to%20scan.user.js
// @updateURL https://update.greasyfork.org/scripts/19883/LibraryThing%20make%20Helpers%20Log%20easier%20to%20scan.meta.js
// ==/UserScript==

// Set some variables
var underlines = document.getElementsByTagName("u");
var paras = document.getElementsByTagName("p");

// Add some styling
var style = document.createElement("style");
style.innerHTML = 'p u { color: #777; } \
                   p u i { color: #000; font-style: normal; } \
                   .gm-icon { color: #555; fill: #555; } \
                   ';
document.getElementsByTagName("head")[0].appendChild(style);

// Icons added in various places to aid recognition of log events

// The following block of icons are from the Open Iconic set at https://github.com/iconic/open-iconic (licensed under The MIT License)
/*
The MIT License (MIT)

Copyright (c) 2014 Waybury

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
var separationSVG = '<svg xmlns="http://www.w3.org/2000/svg" style="vertical-align: -1px;" class="gm-icon" width="10" height="10" viewBox="0 0 8 8">\
  <path d="M3 0v3h-2l3 3 3-3h-2v-3h-2zm-3 7v1h8v-1h-8z" transform="rotate(90,4,4)"/>\
</svg>';
var includeArrowSVG = '<svg xmlns="http://www.w3.org/2000/svg" style="vertical-align: -2px;" width="10" height="10" viewBox="0 0 8 8">\
  <path d="M5 0v2h-5v1h5v2l3-2.53-3-2.47z" transform="translate(0 1)" />\
</svg>';
var excludeArrowSVG = '<svg xmlns="http://www.w3.org/2000/svg" style="vertical-align: 2px;" width="8" height="8" viewBox="0 0 8 8">\
  <path d="M5 0v2h-5v1h5v2l3-2.53-3-2.47z" transform="translate(0 1) rotate(180,4,4)" />\
</svg>';
var xSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">\
  <path d="M1.41 0l-1.41 1.41.72.72 1.78 1.81-1.78 1.78-.72.69 1.41 1.44.72-.72 1.81-1.81 1.78 1.81.69.72 1.44-1.44-.72-.69-1.81-1.78 1.81-1.81.72-.72-1.44-1.41-.69.72-1.78 1.78-1.81-1.78-.72-.72z" />\
</svg>';
var linkSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">\
  <path d="M5.88.03c-.18.01-.36.03-.53.09-.27.1-.53.25-.75.47a.5.5 0 1 0 .69.69c.11-.11.24-.17.38-.22.35-.12.78-.07 1.06.22.39.39.39 1.04 0 1.44l-1.5 1.5c-.44.44-.8.48-1.06.47-.26-.01-.41-.13-.41-.13a.5.5 0 1 0-.5.88s.34.22.84.25c.5.03 1.2-.16 1.81-.78l1.5-1.5c.78-.78.78-2.04 0-2.81-.28-.28-.61-.45-.97-.53-.18-.04-.38-.04-.56-.03zm-2 2.31c-.5-.02-1.19.15-1.78.75l-1.5 1.5c-.78.78-.78 2.04 0 2.81.56.56 1.36.72 2.06.47.27-.1.53-.25.75-.47a.5.5 0 1 0-.69-.69c-.11.11-.24.17-.38.22-.35.12-.78.07-1.06-.22-.39-.39-.39-1.04 0-1.44l1.5-1.5c.4-.4.75-.45 1.03-.44.28.01.47.09.47.09a.5.5 0 1 0 .44-.88s-.34-.2-.84-.22z"/>\
</svg>';
var pencilSVG = '<svg class="gm-icon" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">\
  <path d="M6 0l-1 1 2 2 1-1-2-2zm-2 2l-4 4v2h2l4-4-2-2z" />\
</svg>';
var banSVG = '<svg class="gm-icon" xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8">\
  <path d="M4 0c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 1c.66 0 1.26.21 1.75.56l-4.19 4.19c-.35-.49-.56-1.09-.56-1.75 0-1.66 1.34-3 3-3zm2.44 1.25c.35.49.56 1.09.56 1.75 0 1.66-1.34 3-3 3-.66 0-1.26-.21-1.75-.56l4.19-4.19z" />\
</svg>';

// The following icon is licensed at https://github.com/somerandomdude/Iconic under Creative Commons' Attribution-ShareAlike 3.0 United States (CC BY-SA 3.0) - http://creativecommons.org/licenses/by-sa/3.0/us/
// Tag icon (slightly altered) originally by P.J. Onori / Iconic (http://somerandomdude.com/work/iconic/) 
var tagSVG = '<svg class="gm-icon" style="vertical-align: -2px;" xmlns="http://www.w3.org/2000/svg" width="12px" height="12px" viewBox="0 0 32 32" transform="rotate(90 6 6)">\
  <path d="m12 8.6c0 1.7-1.4 3.1-3.1 3.1s-3.1-1.4-3.1-3.1 1.4-3.1 3.1-3.1c1.1-0.3 3.1 1.1 3.1 2.8z"/>\
  <path d="m0 0v13l19 19v-13h13l-19-19h-13zm12 3.6l12 12h-8.2s0 5.1 0 8.2c-5-4-12-11-12-12v-8.2c1.8-0.2 7-0.2 8-0.2z"/>\
</svg>';


// Re-arrange the mark-up of most of the types of log events
for (var j=0; j<paras.length; j++) {
  var para = paras[j];
  var paraHTML = para.innerHTML;
  if (paraHTML.indexOf('> combined <') > -1) {
    // Work combinations (+)
    para.innerHTML = paraHTML
      .replace(/,? <u>([^<]*)<\/u>/g,'<br/><span class="gm-icon">+</span>&nbsp;<u><i>$1</i></u>')
      .replace(/\[\[\[by\]\]\]/g,'by')
  } else if (paraHTML.indexOf('Separated ') == 0) {
    // Work separations (-)
    para.innerHTML = para.innerHTML
      .replace('Separated <a',' ' + separationSVG + ' <a')
      .replace('> from <','> separated from <br/><span style="visibility: hidden;"> ' + separationSVG + ' </span> <')
  } else if (paraHTML.indexOf('> combined the authors <') > -1) {
    // Author combinations
    para.innerHTML = paraHTML
      .replace('> combined the authors <','> combined the authors <br/> ' + pencilSVG + ' <')
      .replace('> and <','> and <br/> ' + pencilSVG + ' <');
  } else if (paraHTML.indexOf(' added author ') > -1) {
    // "Other" author additions
    para.innerHTML = paraHTML
      .replace('primary, all editions','<b>primary, all editions</b>')
      .replace(' added author ',' added author ' + pencilSVG + ' ')
  } else if (para.textContent.indexOf(' removed author ') > -1) {
    // "Other" author removals
    para.innerHTML = paraHTML.replace(/removed author "([^<]*)" from/, 'removed author <strike>$1</strike> from');
  } else if (paraHTML.indexOf('> permanently prevented the combination of authors <') > -1) {
    // Author "nevering"
    para.style.color = "#888";
    para.innerHTML = paraHTML
      .replace(/<a /g,'<a style="color: #888 !important;" ')
      .replace('permanently prevented','permanently ' + banSVG + ' prevented')
      .replace('authors <','authors <strike><')
      .replace('> and <','></strike> and <strike><')
      .replace(/$/,'</strike>')
  } else if (paraHTML.indexOf('Proposal for tag') == 0) {
    // Tag combinations
    para.innerHTML = para.innerHTML
      .replace('Proposal for tag ','Proposal involving tags: ' + tagSVG + ' ')
      .replace('> to be combined into <','> ' + tagSVG + ' <')
  } else if (paraHTML.indexOf('Included ') == 0) {
    // Work relationships (included)
    para.innerHTML = para.innerHTML.replace(/ Included <a /, ' included <a ').replace(/> inside </, '> ' + includeArrowSVG + ' inside ' + includeArrowSVG + ' <');
  } else if (paraHTML.indexOf('Removed ') == 0) {
    // Work relationships (removed)
    para.innerHTML = paraHTML.replace('Removed <','Removed ' + xSVG + ' <').replace('> from inside <','> ' + excludeArrowSVG + ' from inside <');
  } else if (paraHTML.indexOf(' added the link ') > -1) {
    // Author links
    para.innerHTML = paraHTML.replace('> added the link <','> added the link ' + linkSVG + ' <').replace('>) to the author <','>) to the author ' + pencilSVG + ' <');
  }
}