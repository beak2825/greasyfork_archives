// ==UserScript==
// @name           PTP Movie Infobox Popup Tweak
// @description   Tweaks popup delay.
// @namespace   https://passthepopcorn.me/user.php?id=121003
// @include         https://passthepopcorn.me/torrents.php*
// @include         https://passthepopcorn.me/artist.php?*
// @include         https://passthepopcorn.me/collages.php?*
// @include         https://passthepopcorn.me/user.php?id*
// @include         https://passthepopcorn.me/top10.php*
// @include         /^https://passthepopcorn.me/forums.php?.*action=viewthread.*threadid=35548\b.*$/
// @exclude        /^https://passthepopcorn.me/torrents.php?.*\bid=.*$/
// @icon             https://ptpimg.me/732co1.png
// @version         1.3
// @run-at          document-end
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/382555/PTP%20Movie%20Infobox%20Popup%20Tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/382555/PTP%20Movie%20Infobox%20Popup%20Tweak.meta.js
// ==/UserScript==

var defaultConfig = {
  'delay': 50,
  'enabled': true
};

if (localStorage.getItem('popupConfig') === null)
{
  localStorage.setItem('popupConfig', JSON.stringify(defaultConfig));
}

var popupConfig = JSON.parse(localStorage.getItem('popupConfig'));

// Settings form
if (location.pathname === '/forums.php')
{
  var mypostSelector = '#content1644411';
  var $form = $('<form></form>');
  var $input = $('<input/>').prop({
    type: 'number',
    min: '0',
    max: '10000',
    step: '50',
    value: popupConfig.delay,
    disabled: !popupConfig.enabled
  });
  var $button = $('<input/>').prop({
    type: 'submit',
    value: 'Save'
  });
  var $buttonReset = $('<input/>').prop({
    type: 'button',
    value: 'Reset'
  });
  var $checkbox = $('<input/>').prop({
    type: 'checkbox',
    checked: !popupConfig.enabled
  });
  // no need to reset already default settings
  if (JSON.stringify(popupConfig) === JSON.stringify(defaultConfig))
  {
    $buttonReset.prop('disabled', true);
  }
  $input.on('keydown change', function () {
    $button.prop({
      disabled: false,
      value: 'Save'
    });
    $buttonReset.prop('disabled', false);
  });
  $checkbox.on('click', function () {
    $input.prop({
      disabled: function (i, v) {
        return !v;
      }
    });
    $button.prop({
      disabled: false,
      value: 'Save'
    });
    $buttonReset.prop('disabled', false);
  });
  // reset settings
  $buttonReset.on('click', function (e) {
    $input.prop({
      value: defaultConfig.delay,
      disabled: !defaultConfig.enabled
    });
    $checkbox.prop({
      checked: !defaultConfig.enabled
    });
    $button.prop('disabled', true).prop('value', 'Saved!');
    $buttonReset.prop('disabled', true);
    $form.submit();
  });
  // save settings
  $form.append('<hr/>', $('<label/>').text('Popup delay (ms):').append($input), $button, $buttonReset, '<br/><br/>', $('<label/>').text(' Disable popup').prepend($checkbox), '<hr/>');
  $(mypostSelector).append($form);
  $form.on('submit', function (e) {
    popupConfig.delay = parseInt($input.val());
    popupConfig.enabled = !$checkbox.prop('checked');
    localStorage.setItem('popupConfig', JSON.stringify(popupConfig));
    $button.prop('disabled', true).prop('value', 'Saved!');
    return false; // don't submit form
  });
  return;
}

// Don't touch anything unless custom settings applied
if (JSON.stringify(popupConfig) === JSON.stringify(defaultConfig))
{
  return;
}

// Popup is disabled, unbind everything
if (popupConfig.enabled === false)
{
  var coverSelector = '.js-movie-tooltip-triggerer, ' +
  '.basic-movie-list__movie__cover, ' +
  '.cover-movie-list__movie__cover-link, ' +
  '.basic-movie-list__movie__title, ' +
  '.small-cover-movie-list__movie__link, ' +
  'cover-movie-list__movie__cover-link';
  $(coverSelector).unbind();
  return;
}

// Hook setTimeout if called from hoverIntent
nativeSetTimeout = setTimeout;
window.setTimeout = function patchedTimeout(func, delay)
{
  try 
  {
    if (patchedTimeout.caller.name === 'handleHover' && delay > 0) //arguments.callee.caller.name
    {
      delay = popupConfig.delay;
    }
  }
  catch (e) {
    //can't access caller when 'use strict' is used
  }
  return nativeSetTimeout(func, delay);
};
