// ==UserScript==
// @name           nyaa.si - Batch Download
// @description    Allows batch download of all displayed results in one single click.
// @version        2023.03.16.23.02
// @author         MetalTxus
// @namespace      https://github.com/jesuscc1993

// @grant          GM_xmlhttpRequest

// @icon           https://avatars3.githubusercontent.com/u/28658394?s=44
// @match          https://nyaa.si/*
// @require        https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/30047/nyaasi%20-%20Batch%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/30047/nyaasi%20-%20Batch%20Download.meta.js
// ==/UserScript==

/* globals jQuery */

(() => {
  'use strict';

  const delayBetweenDownloads = 150;

  let downloadButton;
  let magnets;

  const appendBatchDownloadButton = () => {
    magnets = jQuery(magnetsSelector);

    const fileCount = magnets.length;
    if (fileCount) {
      downloadButton = jQuery(`
        <a title="Download all" href class="mt-batch-download">
          <i class="fa fa-fw fa-magnet"></i>
          <span class="mt-batch-download-label">Download all (${fileCount})</span>
          <i class="fa fa-fw fa-magnet"></i>
        </a>
      `);
      downloadButton.click((event) => {
        event.preventDefault();
        downloadAll();
      });
      setButtonText();

      jQuery('.torrent-list').append(downloadButton);

      downloadButton
        .wrap(`<td colspan="9" align="center">`)
        .wrap(`<tr style="background: none;">`);
    }
  };

  const setButtonText = () => {
    downloadButton
      .find(buttonLabelSelector)
      .text(`Download all (${magnets.length})`);
  };

  const downloadAll = () => {
    downloadNext(magnets.toArray());
  };

  const downloadNext = (anchors) => {
    const anchor = anchors.pop();
    const url = anchor.href.split('&dn=')[0];
    const magnetTab = window.open(url);
    setTimeout(() => magnetTab.close(), delayBetweenDownloads);

    if (anchors.length) {
      setTimeout(() => downloadNext(anchors), delayBetweenDownloads);
    }
  };

  const onMutation = () => {
    magnets = jQuery(magnetsSelector);

    setButtonText();
  };

  const initialize = () => {
    appendBatchDownloadButton();

    window.onload = () => {
      new MutationObserver(onMutation).observe(
        document.querySelector('tbody'),
        { childList: true }
      );
    };
  };

  const magnetsSelector = 'a[href*="magnet:"]';
  const buttonLabelSelector = '.mt-batch-download-label';

  initialize();
})();
