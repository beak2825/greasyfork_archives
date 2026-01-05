// ==UserScript==
// @name           SomeImage tweaks
// @namespace      surrealmoviez.info
// @description    Adds fully formatted output containers and some other tweaks
// @include        https://someimage.com/
// @include        /^https://someimage\.com/[A-Za-z0-9]+$/
// @include        https://someimage.com/done/*
// @require        https://code.jquery.com/jquery-2.1.4.min.js
// @version        0.0.2
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/16337/SomeImage%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/16337/SomeImage%20tweaks.meta.js
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
  // Upload result pages
  if ($('#belowviewm').length + $('.gallerybox').length > 0) {
    var links = [];
    var thumbs = [];

    // Multi and single upload pages have different structure
    var isMultiupPage = $('.gallerybox').length === 1;

    // Extract the direct links
    if (isMultiupPage) {
      $('.gallerybox > a > img').each(function() {
        var thumbLink = $(this).attr('src');
        var imageExtension = $(this).attr('title').split('.').pop();
        var imageID = thumbLink.replace('https://t1.someimage.com/', '')
          .split('.').shift();
        links.push('https://i1.someimage.com/' + imageID + '.' + imageExtension);
        thumbs.push(thumbLink);
      });
    } else {
      links.push($('#viewimage').attr('src'));
      thumbs.push($($('#belowviewm .viewlinkbox:eq(0)').val())
        .find('img').attr('src'));
    }

    // Create the new display
    var formattedTable = '<table id="formatted-links">' +
      '<tr>' +
      '<td><span>Full size plain</span><br>' +
      '<textarea>' +
      links.join('\n') +
      '</textarea></td>' +
      '<td><span>Full size HTML</span><br>' +
      '<textarea>' +
      '<center>' +
      createPatternedArray('<img src="{%1}">', links).join('\n\n') +
      '</center>' +
      '</textarea></td>' +
      '<td><span>Full size BBCode</span><br>' +
      '<textarea>' +
      '[center]' +
      createPatternedArray('[img]{%1}[/img]', links).join('\n\n') +
      '[/center]' +
      '</textarea></td>' +
      '</tr>' +
      '<tr>' +
      '<td><span>Thumbs plain</span><br>' +
      '<textarea>' +
      thumbs.join('\n') +
      '</textarea></td>' +
      '<td><span>Linked thumbs HTML</span><br>' +
      '<textarea>' +
      '<center>' +
      createPatternedArray('<a href="{%1}" target="someimage-full-size">' +
        '<img src="{%2}"></a>', links, thumbs).join('\n\n') +
      '</center>' +
      '</textarea></td>' +
      '<td><span>Linked thumbs BBCode</span><br>' +
      '<textarea>' +
      '[center]' +
      createPatternedArray('[url={%1}][img]{%2}[/img][/url]', links, thumbs)
        .join('\n\n') +
      '[/center]' +
      '</textarea></td>' +
      '</tr>' +
      '</table>';

    // Modify the page
    if (isMultiupPage) {
      $('.linksbox table').before(formattedTable).hide();
    } else {
      $('#viewbox2').before('<div class="midbox largebox linksbox contentbox">' +
        formattedTable + '</div>');
    }
    $('#formatted-links').css({
      width: '100%',
      cellspacing: '15'
    });
    $('#formatted-links td').css('width', '33%');
    $('#formatted-links textarea').click(function() {
      $(this).select();
    });
  }

  // Index page
  if ($('#selectbox').length === 1) {
    // Set defaults to enable 1-click upload
    $('#contenttype').val('0');
    $('#thumbsize').val('w250');
    // Without gallery the script won't work
    $('#galleryoption').val('1').prop('disabled', true);
  }
});
