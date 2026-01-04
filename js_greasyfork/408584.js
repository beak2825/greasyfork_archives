// ==UserScript==
// @name         ACL Anthology: Download button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Download PDF with pretty naming
// @author       Tosho Hirasawa
// @match        https://www.aclweb.org/anthology/*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408584/ACL%20Anthology%3A%20Download%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/408584/ACL%20Anthology%3A%20Download%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var sanitize = (s) => { return s.replace(/(\r\n|\n|\r)/gm, "").trim() };

    var title = $('#title').text().trim();
    var authors = $('#main p.lead a').map(function(i, e) { return sanitize(e.text.split(' ').pop()) })
    if (authors.length > 3) {
        authors = authors[0] + ' et al.'
    }
    else if (authors.length == 3) {
        authors = authors[0] + ", " + authors[1] + ', and ' + authors[2]
    }
    else if (authors.length == 2) {
        authors = authors[0] + ' and ' + authors[1]
    }
    else {
        authors = authors[0]
    }
    var venue = sanitize($('.col dt:contains(Venue)').next().text()).replace(/\s/gm,"");
    var year = sanitize($('.col dt:contains(Year)').next().text());

    var filename = ['@' + authors, year, title, venue].join('_') + '.pdf'

    var pdf_btn = $('a.btn-primary[title*="Open PDF"]');
    var dl_btn = pdf_btn.clone().text("Download").attr('download', filename);
    pdf_btn.after(dl_btn)
})();