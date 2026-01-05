// ==UserScript==
// @name        Clean Links
// @namespace   https://arantius.com/misc/greasemonkey/
// @description Clean up links. Remove targets, embedded redirects, and window.open() style links.
// @include     http*
// @exclude     https://archive.org/web/*
// @exclude     https://www.google.com/search*
// @version     8
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/27474/Clean%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/27474/Clean%20Links.meta.js
// ==/UserScript==
//
// Updates:
//
// - 2012-12-06: Don't break Google log in links.
// - 2012-07-04: Remove stray "j=0" that was unused.
// - 2012-04-11: Unwrap even more javascript links.
// - 2012-04-09: Unwrap more javascript window opening links.
// - 2012-04-06: Exclude google search (don't obscure image source pages).
// - 2012-03-18: Don't clean Google Docs Viewer links.
// - 2012-03-14: Don't clean magnet links.
// - 2011-10-23: Clean window.open() links. Remove status saver. Rename.
// - 2010-09-11: Catch security manager viloations in top-frame-detection.
// - 2009-10-13: Monitor for altered hrefs, and re-clean them.
// - 2008-01-19: Deal with an inner link that is not slash terminated.
// - 2006-09-18: Allow google "Custom" search links through.
// - 2006-06-23: Properly handle clicks straight to https:// and cache cases
//               for Yahoo! and InternetArchive, minor other improvements.
//
// Copyright (c) 2011, Anthony Lieuallen
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// * Redistributions of source code must retain the above copyright notice,
//   this list of conditions and the following disclaimer.
// * Redistributions in binary form must reproduce the above copyright notice,
//   this list of conditions and the following disclaimer in the documentation
//   and/or other materials provided with the distribution.
// * Neither the name of Anthony Lieuallen nor the names of its contributors
//   may be used to endorse or promote products derived from this software
//   without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.
//

var inFrames=false;
try { inFrames = (top!=self); } catch (e) { }
var antiloop=0;
var myHost=document.location.host+''; // "assign by value"
var myDomain=myHost.replace(/.*\.(.*......)/, '$1');

var myDomainRegex=new RegExp('^[a-z]+://[^/]*'+myDomain+'(/|$)');
var cacheRegex=/\/search(\?q=cache|\/cache\?)/;
var intArchRegex=/^http:\/\/web.archive.org\/web\//;

function straightClick(el) {
  // make sure we don't do some crazy infinite loop
  if (antiloop++>20) return false;

  if (el.href.indexOf('magnet:') === 0) return false;

  // special case window-opening javascript
  var match = el.href.match(
      /^javascript:[a-z0-9._]+\(([\'\"])(http.+?)\1/i);
  if (!match) {
    match = el.href.match(
        /^javascript:((?:window\.)?open|MM_openBrWindow)\([\'\"]([^\'\"]+)/);
  }
  if (!match) {
    match = el.href.match(
        /^javascript:location.href\s*=\s*([\'\"])([^\'\"]+)/);
  }
  if (match) {
    el.href = match[2];
  }

  // don't mess with javascript links
  if ('javascript:'==el.href.substr(0, 11)) return false;
  // special case to allow links to google/yahoo cache through
  if (cacheRegex.test(el.href)) return false;
  // let links to internet archive through
  if (intArchRegex.test(el.href)) return false;
  // let google docs viewer through
  if (el.href.indexOf('https://docs.google.com/viewer') == 0) return false;
  // let google log-in links through.
  if (-1 != el.href.indexOf('www.google.com/accounts/ServiceLogin')) return false;

  var href=el.href+''; // "assign by value"

  // trim the start of this href
  href=href.replace(/^https?:\/\//, '');
  href=href.replace(/^www\./, '');

  // try to find an embedded link
  var m=href.match(/(www\.|https?:|https?%3A)[^&]+/i);
  if (!m) {
    // we didn't find one!
    return false;
  }

  // pick out and use the embedded link
  href=unescape(m[0]);

  // if it's to my own domain, don't mess with it
  if (myDomainRegex.test(href)) return false;

  // make sure we have a protocol
  if (!href.match(/[a-z]+:\/\//)) href='http://'+href;

  // stuff it in the element, and let caller know I did
  el.href=href;
  return true;
}


// find all links as a snapshot
var els=document.links;
// iterate over all elements
for (var i=0, el; el=els[i]; i++) {
  //////////////////////////blank target
  if (null!=el.getAttribute('target') && !inFrames) {
    el.removeAttribute('target');
  }

  //////////////////////////rewrite avoider
  el.removeAttribute('onmousedown');

  //////////////////////////straight click
  antiloop=0;
  do { ;; } while (straightClick(el))
}

var suspend=false;
document.body.addEventListener('DOMAttrModified', function(event) {
  var el=event.target;
  if (!el || 'A'!=el.tagName) return;
  if ('href'!=event.attrName) return;

  if (suspend) return;
  suspend=true;

  //////////////////////////straight click
  antiloop=0;
  do { ;; } while (straightClick(el))

  suspend=false;
}, false);