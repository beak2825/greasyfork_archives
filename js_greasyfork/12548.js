// ==UserScript==
// @name        LFG Account Page Cleanup
// @namespace   http://scripts.chris.charabaruk.com/leagueforgamers.com/account
// @author      coldacid
// @version     1.1
// @description Makes the skills section of the account page actually usable on non-huge monitors.
// @include     http://leagueforgamers.com/account
// @include     https://leagueforgamers.com/account
// @include     http://*.leagueforgamers.com/account
// @include     https://*.leagueforgamers.com/account
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12548/LFG%20Account%20Page%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/12548/LFG%20Account%20Page%20Cleanup.meta.js
// ==/UserScript==

function GM_main ($) {
  $('form div.profile-card:not(.bio-card)').first()
    .css('max-width', '62.5rem')
    .parent()
      .addClass('large-8')
      .removeClass('large-4');

  $('div.skill.row > div.category')
    .addClass('small-3')
    .removeClass('small-7');
  $('div.skill.row > div.confidence')
    .addClass('small-2')
    .removeClass('small-5');
  $('div.skill.row > div:last-child')
    .addClass('small-7')
    .removeClass('small-12');

  $('form div.small-4.right > input[type=submit]')
    .css('margin-right', '0.9375rem');
}

if (typeof jQuery === 'function') {
  console.log(`Using local jQuery, version ${jQuery.fn.jquery}`);
  GM_main(jQuery);
} else {
  console.log('Loading jQuery from Google CDN');
  add_jQuery(GM_main, '1.12.1');
}

function add_jQuery(callbackFn, jqVersion) {
  jqVersion      = jqVersion || "1.11.1";
  var D          = document,
      targ       = D.getElementsByTagName('head')[0] || D.body || D.documentElement,
      scriptNode = D.createElement('script');
  
  scriptNode.src = `//ajax.googleapis.com/ajax/libs/jquery/${jqVersion}/jquery.min.js`;
  scriptNode.addEventListener('load', function () {
    var scriptNode         = D.createElement('script');
    scriptNode.textContent =
      'var gm_jQuery = jquery.noConflict(true);\n'
      + '(' + callbackFn.toString() + ')(gm_jQuery);';
    targ.appendChild(scriptNode);
  }, false);
  targ.appendChild(scriptNode);
}
