// ==UserScript==
// @name         Rule34.xxx: Date Fixer (MM-DD-YY)
// @version      1.2.1
// @description  Changes all dates on Rule34.xxx to a MM-DD-YY format
// @match        *://rule34.xxx/*
// @author       Lemons22
// @copyright    2016+, Lemons22
// @namespace    https://greasyfork.org/en/users/46477
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20110/Rule34xxx%3A%20Date%20Fixer%20%28MM-DD-YY%29.user.js
// @updateURL https://update.greasyfork.org/scripts/20110/Rule34xxx%3A%20Date%20Fixer%20%28MM-DD-YY%29.meta.js
// ==/UserScript==

/////////////////////////////////////////////////////////////////////////
// Original script by James Wood : https://greasyfork.org/en/users/516 //
/////////////////////////////////////////////////////////////////////////

(function commentsCommentDate(){
  var el = document.getElementById('comment-list');
  if (el != null) {
    el.innerHTML = el.innerHTML.replace(/\b\d\d\d\d-\d\d-\d\d\b/g, function commentsCommentDate(b) {
      var mdy = b.split('-');
      return mdy[1] + '-' + mdy[2] + '-' + mdy[0];
  });
  }
})();

(function postStatsDate(){
  var el = document.getElementById('stats');
  el.innerHTML = el.innerHTML.replace(/\b\d\d\d\d-\d\d-\d\d\b/g, function postStatsDate(d) {
    var mdy = d.split('-');
    return mdy[1] + '-' + mdy[2] + '-' + mdy[0];
  });
})();

(function postCommentsDate(){
  for (let el of [...document.querySelectorAll('div[id^=c]')]
    .filter(el => /^c(\d+)$/.test(el.id)))
  {
    el.innerHTML = el.innerHTML.replace(/\b\d\d\d\d-\d\d-\d\d\b/g, function postCommentsDate(e) {
      var mdy = e.split('-');
      return mdy[1] + '-' + mdy[2] + '-' + mdy[0];
    });
  };
})();