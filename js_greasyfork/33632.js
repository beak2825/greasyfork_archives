// ==UserScript==
// @name         Disqus - No link/href redirection
// @namespace    http://xa.universe/
// @version      0.2.2
// @description  Remove link analysis and redirection in links in disqus comments.
// @author       XA
// @match        https://disqus.com/*/comments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33632/Disqus%20-%20No%20linkhref%20redirection.user.js
// @updateURL https://update.greasyfork.org/scripts/33632/Disqus%20-%20No%20linkhref%20redirection.meta.js
// ==/UserScript==

// Copyright (C) XA, IX 2017.
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
// * Neither the name of XA nor the names of its contributors
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

(function() {
  'use strict';
  const cRedirector = 'https://www.google.de/url?url=URL';
  const cMetaRefresh = 'data:text/html;charset=utf-8,%3Chtml%3E%3Chead%3E%3Cmeta%20http-equiv%3D%22refresh%22%20content%3D%221%3B%20url%3DURL%22%20%2F%3E%3C%2Fhead%3E%3Cbody%3E%3C%2Fbody%3E%3C%2Fhtml%3E';
                       // encodeURIComponent('<html><head><meta http-equiv="refresh" content="1; url=URL" /></head><body></body></html>')

  const DEBUG = 0;
  const USEREDIRECTOR = false;



  function l (...args) {
    if (!DEBUG) return;
    console.log(...args);
  }


  function processHrefAsync (ePosting) {
    return new Promise(
      (resolve, reject) => {
        l("++++++++ [processHrefAsync]:", ePosting);
        let eHrefs = ePosting.querySelectorAll(".post-message a[rel~=nofollow]");
        if (!eHrefs) reject();
        for (let eHref of eHrefs) {
          l("<<<<<<<<", eHref.href);

          let mat = eHref.href.match(/^https?:\/\/disq\.us\/url\?url=(.+)/);
          if (mat === null) continue;
          let url = mat[1];
          if (!url) continue;

          url = decodeURIComponent(url);
          mat = url.match(/^(.+):.+?$/); // crop suffix ":SoMeCoDe&cuid=1234"
          if (mat !== null) {
            url = mat[1];
          }
          if (!url) continue;

          if (USEREDIRECTOR) {
            url = USEREDIRECTOR.replace("URL", url);
          } else {
            url = decodeURIComponent(url);
          }
          l(">>>>>>>>", url);
          eHref.href = url;
          if (!eHref.rel) {
            eHref.rel = "noreferrer";
          } else {
            eHref.rel += " noreferrer";
          }
        }
        resolve();
      }
    );
  }


  function observeAddingPosts (eRoot) {
    let observer = new MutationObserver(
      (mutationObjs, observer) => {
        l(mutationObjs);
        for (let mobj of mutationObjs) {
          if (mobj.type != 'childList' || !mobj.addedNodes || mobj.addedNodes.length === 0) return;
          for (let elt of mobj.addedNodes) {
            if (elt.id.substr(0,5) === 'post-') {
              processHrefAsync(elt);
            }
          }
        }
      } // Observer callback
    );

    observer.observe(eRoot, {childList: true, subtree: true});
  } // observeAddingPosts


  let observer = observeAddingPosts(document.body);
  //document.addEventListener("unload", (ev) => { l("********** Obeserver UNLOADED."); observer.disconnect(); });


})();
