// ==UserScript==
// @name        AO Next/Prev Epp
// author       Wiktor Radecki
// @namespace   AnimeOdcinki
// @include     http://anime-odcinki.pl/*
// @version     4
// @grant       none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @description Add to anime-odcinki.pl's players buttons: Prev & Next
// @downloadURL https://update.greasyfork.org/scripts/10279/AO%20NextPrev%20Epp.user.js
// @updateURL https://update.greasyfork.org/scripts/10279/AO%20NextPrev%20Epp.meta.js
// ==/UserScript==
$(document).ready(function () {
  var linki = $('#edit-jump').children();
  var isNext = false;
  var isPrev = true;
  for (var i = 0; i < linki.length; i++)
  {
    var e = linki[i];
    if (typeof (e.attributes['selected']) != 'undefined') {
      isNext = true;
      isPrev = false;
      continue;
    }
    if (isPrev === true && e.value !== '')
    var next = e;
    if (isNext === true) {
      var prev = e;
      break;
    }
  }
  $div = $('#video-player-control');
  if (typeof (prev) !== 'undefined')
  {
    var plink = prev.value.split('::') [1];
    jQuery('<a/>', {
      id: 'video-player-mode',
      linkid: '1000',
      title: 'Poprzedni odcinek',
      rel: 'external',
      text: '<<',
      class: 'prev-next',
      href: plink
    }).prependTo($div);
  }
  if (typeof (next) !== 'undefined')
  {
    var nlink = next.value.split('::') [1];
    jQuery('<a/>', {
      id: 'video-player-mode',
      linkid: '1001',
      title: 'Nastepny odcinek',
      rel: 'external',
      text: '>>',
      class: 'prev-next',
      href: nlink
    }).appendTo($div);
  }
});
