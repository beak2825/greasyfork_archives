// ==UserScript==
// @name            Google Search Spam Filter
// @name:ru         Фильтр спама в результатах поиска Google
// @description     removes blacklisted search results
// @description:ru  скрывает ненужные результаты в выдаче
// @namespace       https://www.google.com/search
// @include         /^https?://(www\.)?google\.\w+//
// @copyright       2018, StSav012
// @author          StSav012
// @grant           none
// @version         0.1.20210411.2
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/374496/Google%20Search%20Spam%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/374496/Google%20Search%20Spam%20Filter.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
/* jshint browser: true */

"use strict";

// blacklisted URLs
var spamURLs = ['http://qaru.site/', 'https://stackoverrun.com/', 'https://manjaro.ru/', 'https://qastack.ru/', 'https://coderoad.ru/',
                'https://overcoder.net/', 'https://overcoder.net:8443/', 'https://www.coder.work/', 'https://helpexe.ru', 'https://www.dvhu.com/',
                'http://doc.crossplatform.ru/', 'https://quares.ru/', 'https://www.cnpython.com/', 'http://hk.uwenku.com/', 'https://www.debugcn.com/',
                'https://tr.coredump.biz/', 'https://www.thinbug.com/', 'https://cloud6.net/'];

for (let u of spamURLs) {
  var junk = document.querySelectorAll('div a[href^="' + u + '"]:not([class])');
  for (let j of junk) {
    var p = j.parentNode;
    while (p.tagName == 'DIV' && !p.classList.contains('g')) {
      p = p.parentNode;
    }
    // console.log('found', p);
    p.parentNode.removeChild(p);
  }
}
