// ==UserScript==
// @name         blocked catbox soundpost fix
// @namespace    fuwamocobaubau
// @description  Replaces files.catbox.moe links with files.pixstash.moe on soundposts. Site files.pixstash.moe is a simple passthrough to bypass ISP blocks.
// @author       fuwamocobaubau
// @license MIT
// @version      0.3
// @match        *://boards.4chan.org/*
// @match        *://boards.4channel.org/*
// @match        *://desuarchive.org/*
// @match        *://arch.b4k.co/*
// @match        *://archived.moe/*
// @match        *://warosu.org/*
// @match        *://archive.nyafuu.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473364/blocked%20catbox%20soundpost%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/473364/blocked%20catbox%20soundpost%20fix.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.isChanX = document.documentElement && document.documentElement.classList.contains('fourchan-x');
  window.isSiteAddedToWhiteList = false;

  // look for any catbox soundposts and replace the sound url with a pixstash link
  function rewriteCatbox(target) {
    let posts = target.classList.contains('post')
      ? [ target ]
      : target.querySelectorAll('.post');

    let filename = null;
    let filenameLocations = {
      '.fileText .file-info .fnfull': 'textContent',
      '.fileText .file-info > a': 'textContent',
      '.fileText > a': 'title',
      '.fileText': 'textContent'
    }


    posts.forEach(post => {
      Object.keys(filenameLocations).some(function (selector) {
        const node = post.querySelector(selector);

        node && (filename = node[filenameLocations[selector]]);
        if (filename && filename.includes('files.catbox.moe')) {
          node[filenameLocations[selector]] = filename.replace('files.catbox.moe', 'files.pixstash.moe')
        }
      });

    });
  }

  async function doInit() {
    // does the link rewriting on initial page load
    rewriteCatbox(document.body);

    // sets up an observer so that new posts added via auto updating also have their link rewriten
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function (node) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              rewriteCatbox(node);

              if (node.className == 'fcsp-image-link' && window.isSiteAddedToWhiteList == false) {
                // Update the site filter/whitelist settings to allow loading soundposts from pixstash.moe urls
                document.dispatchEvent(new CustomEvent('PlayerEvent', {
                  detail: {
                    action: 'settings.load',
                    arguments: [
                      {"allow": ["pixstash.moe", "4cdn.org", "catbox.moe", "dmca.gripe", "lewd.se", "pomf.cat", "zz.ht", "zz.fo"] },
                      { "applyDefault": false }
                    ]
                  }
                }))

                window.isSiteAddedToWhiteList = true;
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  document.addEventListener('4chanXInitFinished', doInit);

  // The timeout makes sure 4chan X will have added it's classes and be identified.
  setTimeout(function () {
    // If it's already known 4chan X is installed this can be skipped.
    if (!isChanX) {
      if (document.readyState !== 'loading') {
        doInit();
      } else {
        document.addEventListener('DOMContentLoaded', doInit);
      }
    }
  }, 0);
})(); 