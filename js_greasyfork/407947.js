// ==UserScript==
// @name EmuParadise Download Workaround
// @author Eptun, extended by infval, with modifications by arflech
// @namespace greasyfork.org
// @icon https://www.emuparadise.me/favicon.ico
// @version 1.2.3
// @description Replaces the download button link with a working one
// @match https://www.emuparadise.me/*
// @grant none
// @run-at document-end
// @copyright 2020 Eptun, infval, and Arnold François Lecherche
// @downloadURL https://update.greasyfork.org/scripts/407947/EmuParadise%20Download%20Workaround.user.js
// @updateURL https://update.greasyfork.org/scripts/407947/EmuParadise%20Download%20Workaround.meta.js
// ==/UserScript==

// https://www.reddit.com/r/Piracy/comments/968sm6/a_script_for_easy_downloading_of_emuparadise_roms/
(function(d, w) {
  'use strict';

  // Others: 50.7.92.186
  var ipDownload = '50.7.189.186', urlFirstPart = 'http://' + ipDownload + '/happyxhJ1ACmlTrxJQpol71nBc/',
    platform = d.URL.split('/')[3], reMatch = /\d+\.\d+\.\d+\.\d+\/(.*)"/, reSpace = / /g, comix = {
        'Gaming Comics @ Emuparadise': 'may/Comics/',
        'Gaming Magazines @ Emuparadise': 'may/Mags/'
      };

  function dc(){
    var downs = d.querySelectorAll('p > a[title^=Download]'), i = downs.length, findex, lindex;
    while (i--) {
      findex = 9; // 'Download X'
      lindex = downs[i].title.lastIndexOf(' ISO');
      downs[i].href = urlFirstPart + 'Dreamcast/' + downs[i].title.slice(findex, lindex);
    }
  }

  function comic() {
    var webArchiveURL = 'https://web.archive.org/web/2016/', down = d.querySelectorAll('#content > p')[0], req = new XMLHttpRequest(),
      findex, lindex, urlLastPart, info, filename, cat;
    down.innerHTML = 'Getting Download URL...';
    req.open('GET', webArchiveURL + d.URL, false);
    try {
    req.send(null);
      if (req.status === 200) {
        lindex = req.responseText.indexOf('Size: ');
        findex = req.responseText.lastIndexOf('http://', lindex);
        urlLastPart = req.responseText.slice(findex, lindex).match(reMatch)[1].replace(reSpace, '%20'); // encodeURI() changes #, e.g. Sonic - The Comic Issue No. 001 Scan
        down.innerHTML = '<a href="' + urlFirstPart + urlLastPart + '">Download</a>';
      } else {
        info = d.querySelectorAll('#content > div[align=center]')[0];
        filename = encodeURIComponent(info.children[0].textContent.slice(0, -5)); // 'X Scan'
        cat = '<a href="' + urlFirstPart + (comix[info.children[1].textContent] || '') + filename; // URLs with # except The Adventures Of GamePro Issue
        down.innerHTML = 'Error when getting URL: ' + webArchiveURL + d.URL + '<div>Try ' + cat + '.rar' + '" title="Roshal Archive">rar</a> or '
          + cat + '.cbr' + '" title="Comic Book Archive, compressed with RAR">cbr</a>' + '</div>';
      }
    } catch(_) {
      down.innerHTML = 'Get the download URL manually:<br />Go to <a href="' + webArchiveURL + d.URL
        + '" rel="noopener noreferrer" target="_blank">an archived version</a> and copy the download URL.<br />Then paste it into the address bar and delete everything up to '
        + "and including the slash after the strange jumble of letters and numbers.<br />Finally, before what's left, paste <code>" + urlFirstPart + '</code> and press Enter.';
    }
  }

  function dl() {
    var id = d.URL.split('/')[5], downloadLink = d.getElementsByClassName('download-link')[0], div = d.createElement('div');
    div.innerHTML = '<a target="_blank" href="/roms/get-download.php?gid=' + id
      + '&amp;test=true" title="Download using the workaround script">Download using the workaround script</a>'
      + ' (Middle-click or Right-click → New tab/window)<br />'
      + 'You have to change a URL protocol to HTTP! Example: <strong>https</strong>://' + ipDownload
      + '/…/Mario.7z → <strong>http</strong>://' + ipDownload + '/…/Mario.7z';
    downloadLink.insertBefore(div, downloadLink.firstChild);
  }

  w.addEventListener('load', {
    'Sega_Dreamcast_ISOs': dc,
    'magazine-comic-guide-scans': comic // match https://www.emuparadise.me/magazine-comic-guide-scans/%NAME%/%ID%
  }[platform] || dl, false);
})(document, window);