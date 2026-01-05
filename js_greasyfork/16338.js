// ==UserScript==
// @name           imgbox tweaker
// @namespace      surrealmoviez.info
// @description    Adds custom formatted links and other minor tweaks.
// @include        https://imgbox.com/
// @include        https://imgbox.com/upload/edit/*
// @include        https://imgbox.com/gallery/edit/*
// @require        https://code.jquery.com/jquery-2.1.4.min.js
// @version        0.0.2
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/16338/imgbox%20tweaker.user.js
// @updateURL https://update.greasyfork.org/scripts/16338/imgbox%20tweaker.meta.js
// ==/UserScript==

'use strict';
this.$ = this.jQuery = jQuery.noConflict(true);

/**
 * Sets array elements into placeholders of a pattern.
 * @param {string} Base pattern. Placeholders as {%i} for the i-th replacement
 *        array.
 * @param {...string[]} Replacement sources for the pattern. The first array
 *        will set the returned array length.
 * @return {string[]} Replaced pattern elements.
 */
function createPatternedArray() {
  var pattern = arguments[0];
  var modArray = [];
  for (var i = 0; i < arguments[1].length; i++) {
    modArray[i] = pattern;
  }
  for (var j = 1; j < arguments.length; j++) {
    for (var k = 0; k < modArray.length; k++) {
      var replacement = arguments[j][k] || '';
      modArray[k] = modArray[k].split('{%' + j + '}').join(replacement);
    }
  }
  return modArray;
}

$(document).ready(function() {
  // Index page
  if ($('#upload-form').length === 1) {
    // Set defaults to enable 1-click upload
    $('#dropdown-content-type').val('2');
    $('#thumbnail-option').val('250r');
    $('#comments-option').val('0');
    $('#gallery-option').val('3');
  }

  // Upload result
  if ($('#codes-full').length === 1) {
    // Display all available outputs
    $('#codes-full').show().css('visibility', 'visible')
      .insertBefore('#codes-thumb');
    $('#codes-thumb').show().css('visibility', 'visible');

    // Extract direct links to full images and thumbs
    var links = $('#code-link-full').text().trim().split('\n');
    var thumbs = [];
    $($('#code-html-thumb').text()).find('img').each(function() {
      thumbs.push($(this).attr('src'));
    });

    // Modify the existing outputs and titles, display all options
    $('#codes-full > .span4:eq(0) span').text('Full size plain');
    $('#code-html-full')
      .text('<center>' +
        createPatternedArray('<img src="{%1}">', links).join('\n\n') +
        '</center>')
      .prev('div').children('span').text('Full size HTML');
    $('#code-bb-full')
      .text('[center]' +
        createPatternedArray('[img]{%1}[/img]', links).join('\n\n') +
        '[/center]')
      .prev('div').children('span').text('Full size BBCode');
    $('#code-link-thumb')
      .text(thumbs.join('\n'))
      .prev('div').children('span').text('Thumbs plain');
    $('#code-html-thumb')
      .text('<center>' +
        createPatternedArray('<a href="{%1}" target="imgbox-full-size">' +
          '<img src="{%2}"></a>', links, thumbs).join('\n\n') +
        '</center>')
      .prev('div').children('span').text('Linked thumbs HTML');
    $('#code-bb-thumb')
      .text('[center]' +
        createPatternedArray('[url={%1}][img]{%2}[/img][/url]', links, thumbs)
          .join('\n\n') +
        '[/center]')
      .prev('div').children('span').text('Linked thumbs BBCode');
  }
});
