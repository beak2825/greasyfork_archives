// ==UserScript==
// @name       Search developer.opentext.com with Google
// @namespace  mailto:fprantl@opentext.com
// @version    0.2
// @description  Replaces the built-in search at developer.opentext.com
//               by the Google Custom Search searching that domain only.
//               The URL points to my CSE but it can be modified.
//               The built-in AppWorks search remains available.
// @match      *://developer.opentext.com/*
// @copyright  (c) 2014 OpenText GmbH
// @downloadURL https://update.greasyfork.org/scripts/2643/Search%20developeropentextcom%20with%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/2643/Search%20developeropentextcom%20with%20Google.meta.js
// ==/UserScript==

if (typeof $ !== undefined) {
  $(function () {
    var originalForm = $('form[action="/awd/search"]'),
        parent = originalForm.parent();
    if (originalForm) {
      console.log('Replacing the AppWorks search with the Google custom search...');
      originalForm.hide();
      var gcse = $('<gcse:search>').insertAfter(originalForm),
          switcher = $('<button>')
            .text('OTEX')
            .addClass('btn switch-gcse')
            .click(function () {
              $('div#___gcse_0').toggle();
              originalForm.toggle();
              switcher.toggleClass('switch-gcse-otex')
                .text(originalForm.is(':visible') ? 'GOOG' : 'OTEX');
            }).insertBefore(originalForm);
      (function() {
        var cx = '006791522399351765273:14trghalcz4';
        var gcse = document.createElement('script');
        gcse.type = 'text/javascript';
        gcse.async = true;
        gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
            '//www.google.com/cse/cse.js?cx=' + cx;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(gcse, s);
      })();
      $('style').html(
        'div#___gcse_0 {\n' +
        '  display: inline-block;\n' +
        '  width: 25em !important;\n' +
        '  float: right !important;\n' +
        '}\n' +
        'div.gsc-control-cse {\n' +
        '  padding: 0 !important;\n' +
        '}\n' +
        'button.switch-gcse {\n' +
        '  float: right;\n' +
        '  margin-left: 0.5ex;\n' +
        '  margin-top: 2px !important;\n' +
        '  font-size: 75%;\n' +
        '  height: 27px;\n' +
        '}\n' +
        'button.switch-gcse.switch-gcse-otex {\n' +
        '  margin-top: 5px !important;\n' +
        '  height: 29px;\n' +
        '}\n'
      ).appendTo('head');
    }
  });
}