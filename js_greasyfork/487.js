// ==UserScript==
// @name Ilta-Saatana Ilta-Sanomille
// @description Saatana!
// @version 2.1.2
// @namespace http://iltasaatana.veetipaananen.fi/
//
// @include http://www.iltasanomat.fi/*
// @include http://iltasanomat.fi/*
// @grant none
//
// @require http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/487/Ilta-Saatana%20Ilta-Sanomille.user.js
// @updateURL https://update.greasyfork.org/scripts/487/Ilta-Saatana%20Ilta-Sanomille.meta.js
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
  /**
   * A method for satanifying Ilta-Sanomat headings that are manually split across
   * multiple lines.
   */
  $.fn.satanifyFitted = function() {
    $(this).each(function() {
      // Find the last row of the title. For whatever reason, some titles include
      // trailing span blocks with no contents, so filter them out.
      var last = $('span', this).filter(function() {
        return $(this).text().trim().length > 0;
      }).last();
      var original = $(last).text().trim();
      var satanified = satanify(original);

      // Split into the part before the saatana and the one after to account for
      // punctuation, capitalization, etc.
      var first = 0;
      while (original[first] == satanified[first] && first < satanified.length) {
        first++;
      }
      var one = satanified.slice(0, first);
      var two = satanified.slice(first);

      // Update and append new header.
      $(last).text(one);
      $(this).append($(last).clone().text(two));
    });
  };

  // Main body titles
  $('[id^=fitted-heading-]').satanifyFitted();
  $('a h2, a h3, h2 a, h3 a').satanify();
  $('#main ul.link-list a').satanify();

  // Surveys
  $('[class^=quick-survey] h3, a.survey-button').satanify();

  // Breaking news
  $('[id^=breakingNewsItem] a').satanify();

  // Sidebar links
  $('.is-list:not(.istv) h2').satanify();
  $('.is-list.most-read div.content p').satanify(' ');
  $('.is-list:not(.most-read):not(.lifestyle) div.content').satanify(' ');
  $('.is-list li.list-item span:not(.index)').satanify(' ');

  // Individual news page titles
  $('article.single-article h1:first').satanify();
});

