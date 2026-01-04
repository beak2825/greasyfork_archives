// ==UserScript==
// @name        ipt-better
// @namespace   https://github.com/furwasalreadytaken
// @description Make IPTorrents less annoying, mainly by removing donation/lottery clutter
// @include     https://ipt-update.com/*
// @include     https://www.ipt-update.com/*
// @include     https://iptorrents.com/*
// @include     https://www.iptorrents.com/*
// @version     3
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/32980/ipt-better.user.js
// @updateURL https://update.greasyfork.org/scripts/32980/ipt-better.meta.js
// ==/UserScript==

// execute the script in the context of the page so we don't need to load jquery again
// nasty, but you know, javscript
// https://stackoverflow.com/questions/14901036
function execute(body) {
    var el = document.createElement("script");
    el.textContent = "(" + body + ")();";
    document.body.appendChild(el);
    return el;
}

execute(function() {
  // make the banner link to the torrents page, not donate
  $(".banner a:first").attr('href', 'https://' + window.location.host + '/t');

  // hide the donate button from the main menu
  $(".butRow a:last").remove();

  // hide the "double your upload" banner
  $('td a[href="/donate.php"]').remove();

  // hide the lottery points indictator thing
  // FIXME: is there not a huge banner ala double your upload when the lottery is active?
  $('.stats div:nth-child(2) a[href="/lottery.php"]').remove();

  // hide the IPT Browser button
  $('.topRow a:contains("IPT Browser")').remove();

  // hide the sketchy-ass non-tls mirrors stuff
  $('.topRow a:contains("Mirrors")').remove();
  $('td a[href="/p/4334880"]').remove(); // "UK members can't access IPT? Use Mirrors!" banner

  // fix their stupid inconsistent 1337 spelling
  // column, row, new text
  var table = [
    [5, 3, "Apps"],
    [5, 4, "Apps/Non-English"],
    [5, 5, "Audiobooks"],
    [5, 11, "Magazines/Newspapers"]
  ];
  for (var i = 0; i < table.length; i++) {
    // does javascript *really* not have a .format method?
    var t = table[i];
    $("td.bottom:nth-child("+t[0]+") label:nth-child("+t[1]+") span a").html(t[2]);
  }
});

