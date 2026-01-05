// ==UserScript==
// @name Ilta-Saatana Iltalehdelle
// @description Saatana!
// @version 2.1.1
// @namespace http://iltasaatana.veetipaananen.fi/
//
// @include http://www.iltalehti.fi/*
// @include http://iltalehti.fi/*
// @grant none
//
// @require http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/488/Ilta-Saatana%20Iltalehdelle.user.js
// @updateURL https://update.greasyfork.org/scripts/488/Ilta-Saatana%20Iltalehdelle.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

/* Satanifies a text string. */
function satanify(text) {
  text = text.trim();

  var satan = ' saatana';
  var insertAt = text.length - 1;
  var punctuation = "!?\"'”.".split('');

  // Insert before punctuation
  while (punctuation.indexOf(text[insertAt]) > -1 && insertAt >= 0) {
    insertAt--;
  }

  // Give up if the text is all punctuation or empty
  if (text.length == 0 || insertAt < 0) {
    return '';
  }

  // Use the right case
  var caseTest = text[insertAt];
  if (caseTest == caseTest.toUpperCase() && isNaN(caseTest)) {
    satan = satan.toUpperCase();
  }

  var start = text.slice(0, insertAt + 1);
  var end = text.slice(insertAt + 1);
  return start + satan + end;
}

$(function() {
  $.fn.satanify = function(suffix) {
    var suffix = suffix || '';

    $(this).each(function() {
      $(this).contents().each(function() {
        if (this.nodeType == Node.TEXT_NODE && !this.hasChildNodes() && this.textContent.trim().length > 0) {
          this.textContent = satanify(this.textContent) + suffix;
          return false;
        }
      });
    });
  };
});

$(function() {
  // Body headings
  $('h1.juttuotsikko span.otsikko:last-of-type').each(function() {
    // Some of the center title spans on Iltalehti have manual <br /> elements
    // inside of them, which our satanify plugin isn't smart enough to handle
    // yet. Hack around it with this for now.
    var contents = $(this).contents();
    if (contents != null && contents.length > 0) {
      var last = contents.last()[0];
      last.textContent = satanify(last.textContent);
    }
  });
  $('li a[class^=bi3dArtId-]').satanify();

  // Left
  $('#container_vasen p a:not(.palstakuva)').satanify(' ');

  // Right
  $('#container_oikea [class$=link-list] p a:not(.palstakuva)').satanify(' ');
  $('#container_oikea .widget a .list-title').satanify();

  // Footer
  $('.footer_luetuimmat_container .list-title').satanify();

  // Individual page headings
  $('#container_keski h1.juttuotsikko:first').satanify();
});

