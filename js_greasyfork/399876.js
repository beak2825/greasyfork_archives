// ==UserScript==
// @name         Remove Ineligible Jobs from Reed Results
// @namespace    https://github.com/chrisxue815
// @version      0.1.0
// @description  Add a button at the top of Reed search results. When clicked, it removes jobs for which you are not eligible to apply.
// @author       Chris Xue <chrisxue815@gmail.com>
// @match        http://www.reed.co.uk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399876/Remove%20Ineligible%20Jobs%20from%20Reed%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/399876/Remove%20Ineligible%20Jobs%20from%20Reed%20Results.meta.js
// ==/UserScript==

(function() {
  $('.searchTitle').append('<button id="cx-filter">Remove Ineligible</button><span id="cx-msg"></span>');

  $('#cx-filter').click(function() {
    $('#cx-msg').text('In Progress');

    var jobs = $('.jobs > li');

    if (jobs.length === 0) {
      return;
    }

    var promises = jobs.map(function(i) {
      var job = $(jobs[i]);
      var href = job.find('a.jobTitleTag')[0].href;

      return $.get(href).then(function(html) {
        if (i === 0) console.log(html);
        var applyBtn = $(html).find('#applyBtn');
        if (applyBtn.length === 0) {
          job.remove();
        }
      });
    });

    $.when(promises).then(function() {
      $('#cx-msg').text('Done');
    });
  });
})();