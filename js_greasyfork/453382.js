// ==UserScript==
// @name        BC: do free downloads
// @namespace   userscript1
// @match       https://*.bandcamp.com/*
// @match       https://*.bandcamp.com/*
// @match       https://bandcamp.com/download
// @grant       none
// @version     0.2.8
// @author      -
// @license     GPLv3
// @description adds a link that triggers buy for $0; set format to FLAC and click download. multiple purchases get a "download all" link (wait for them to process before using).  Set your email at the top of the script if you want it autofilled.
// @downloadURL https://update.greasyfork.org/scripts/453382/BC%3A%20do%20free%20downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/453382/BC%3A%20do%20free%20downloads.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const emailaddress = '';  // put your email here

  function $(s) {
    return document.querySelector(s);
  }

  // release page -------------------------------------
  function startFreeDownload() {
    $('button.buy-link.download-link').click();

    setTimeout(function() {
      var elm = $('#userPrice');
      elm.value='0';
      var event = new UIEvent("change", {
        "view": window,
        "bubbles": true,
        "cancelable": true
        });
      elm.dispatchEvent(event);
      }, 300);

    setTimeout(function() {
     $('.download-panel-free-download-link').click();
    }, 1000);

    setTimeout(function() {
      if ($('#downloadButtons_download').style.display != 'none') {
        console.log('email not required, clicking OK');
        $('#downloadButtons_download button.download-panel-checkout-button').click();
      } else {
        console.log('email required');
        $('#fan_email_postalcode').value = '1';
        $('#fan_email_address').focus();
        if (emailaddress) {
          $('#fan_email_address').value = emailaddress;
          $('#downloadButtons_download button.download-panel-checkout-button').click();
        }
      }
    }, 1500);
  }

  var elm = $('#trackInfoInner');
  if (elm && (elm.textContent.toLowerCase().includes('name your price') || elm.textContent.includes('Free Download') ) ) {
    $('li.buyItem.digital').insertAdjacentHTML(
      'beforeEnd',
      '<h4><a id="StartFreeDownload">Start free download &gt;&gt;</a></h4>'
     );
    $('#StartFreeDownload').addEventListener('click', startFreeDownload);

    $('#name-section .trackTitle').insertAdjacentHTML('afterBegin', '<a id="StartFreeDownload2">[DL]</a>');
    $('#StartFreeDownload2').addEventListener('click', startFreeDownload);
  }
  // end release page -------------------------------------


  // download page -------------------------------------
  const selDownload = 'a[href*="bcbits.com/download/"]';

  function downloadWhenReady() {
    var links = document.querySelectorAll(selDownload);
    if (links[0] && links[0].style.display != 'none' && links[0].textContent.includes('Download') ) {
      if (links.length == 1) {
        console.log('clicking download');
        links[0].click();
      } else {
        $('div.download-extras').insertAdjacentHTML('beforeBegin',
              `<div style="text-align: right;">
                  [<a id="DownloadThemAll">Download them all</a>]
              </div>`);
        $('#DownloadThemAll').addEventListener('click', downloadThemAll);
      }
    } else {
      console.log('waiting for download');
      setTimeout(downloadWhenReady, 1000);
    }
  }

  function downloadThemAll() {
    var links = document.querySelectorAll(selDownload);
    for (let link of links) {
      var frame = document.createElement('iframe');
      frame.src = link.href;
      document.body.appendChild(frame);
    }
  }

  elm = $('#format-type');
  if (elm && elm.value != 'flac') {
    let changeEvent = new Event('change');
    elm.value = 'flac';
    elm.dispatchEvent(changeEvent);
  }

  if (elm) {
   setTimeout(downloadWhenReady, 2000);
  }
  // end download page -------------------------------------


})();