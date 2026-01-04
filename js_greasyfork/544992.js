// ==UserScript==
// @name         Scribd Auto Downloader by 3xploiton3
// @namespace    https://greasyfork.org/id/scripts/544992-scribd-auto-downloader-by-3xploiton3
// @version      1.6
// @description  Automate download via vDownloader & iLIDE (Scribd doc/documents/presentation)
// @author       3xploiton3
// @match        https://*.scribd.com/document/*
// @match        https://*.scribd.com/doc/*
// @match        https://*.scribd.com/presentation/*
// @match        https://scribd.vdownloaders.com/*
// @match        https://ilide.info/doc-viewer-v2*
// @icon         https://scribd.vdownloaders.com/favicon.ico
// @license      MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544992/Scribd%20Auto%20Downloader%20by%203xploiton3.user.js
// @updateURL https://update.greasyfork.org/scripts/544992/Scribd%20Auto%20Downloader%20by%203xploiton3.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function onMutation(root, cb) {
    if (typeof MutationObserver === 'undefined') {
      var i = setInterval(cb, 500);
      setTimeout(function(){ clearInterval(i); }, 30000);
      return { disconnect: function() { clearInterval(i); } };
    }
    var mo = new MutationObserver(function(){ cb(); });
    mo.observe(root || document.body, { childList: true, subtree: true });
    return mo;
  }

  var host = location.hostname;
  var path = location.pathname;

  // 1) Scribd pages: add button
  if (host.indexOf('scribd.com') > -1 &&
      (path.indexOf('/document/') > -1 || path.indexOf('/doc/') > -1 || path.indexOf('/presentation/') > -1)) {

    var currentURL = window.location.href;
    var vDownloadURL = 'https://scribd.vdownloaders.com/?doc=' + encodeURIComponent(currentURL);

    var button = document.createElement('button');
    button.appendChild(document.createTextNode('⬇ Download via vDownloader'));
    button.style.position = 'fixed';
    button.style.top = '80px';
    button.style.right = '20px';
    button.style.zIndex = '2147483647';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#1a73e8';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '4px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    button.onclick = function () { location.href = vDownloadURL; };
    document.body.appendChild(button);
  }

  // 2) vDownloader landing: auto-paste + submit
  if (host === 'scribd.vdownloaders.com' && path === '/') {
    var params = new URLSearchParams(window.location.search);
    var docURL = params.get('doc');
    if (!docURL) return;

    (function fillAndClick(){
      var input = document.querySelector('form input[name="url"], form #url');
      var submitBtn = document.querySelector('form button[type="submit"], form input[type="submit"]');
      if (input && submitBtn) {
        input.value = docURL;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        setTimeout(function(){ submitBtn.click(); }, 400);
      } else {
        setTimeout(fillAndClick, 400);
      }
    })();
  }

  // 3) vDownloader result: auto-click download
  if (host === 'scribd.vdownloaders.com' && path.substr(0, 5) === '/vdoc') {
    var mo1 = onMutation(document.body, function(){
      var downloadBtn = document.querySelector('a.btn[href*="pdf"], a[href*="download"]');
      if (downloadBtn) {
        // pastikan buka di tab yang sama, bukan new tab
        var link = downloadBtn.getAttribute('href');
        if (link) {
          window.location.href = link; // langsung redirect ke iLIDE
        } else {
          downloadBtn.removeAttribute('target'); // buang target _blank
          downloadBtn.setAttribute('target', '_self');
          downloadBtn.click();
        }
        if (mo1 && mo1.disconnect) mo1.disconnect();
      }
    });
  }


  // 4) iLIDE doc-viewer: auto-click main button, then modal's download
  if (host === 'ilide.info' && path.indexOf('/doc-viewer-v2') === 0) {
    var clickedMain = false;

    var mo2 = onMutation(document.body, function(){
      // Step A: click the big orange button
      var mainBtn = document.getElementById('btnDownload');
      if (mainBtn && !clickedMain) {
        mainBtn.click();
        clickedMain = true;
      }

      // Step B: when modal appears, click the download control inside it
      var modal = document.getElementById('downloadModalCenter');
      if (modal && (modal.className.indexOf('show') > -1 || modal.style.display === 'block')) {
        // Try common selectors inside Bootstrap modal
        var inner =
          modal.querySelector('a[href*="download"]') ||
          modal.querySelector('a[href*="pdf"]') ||
          modal.querySelector('button[id*="download"]') ||
          modal.querySelector('button[name*="download"]') ||
          modal.querySelector('button[type="submit"]');

        if (inner) {
          inner.click();
          if (mo2 && mo2.disconnect) mo2.disconnect();
        }
      }
    });
  }
})();