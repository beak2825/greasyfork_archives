// ==UserScript==
// @name         R34 Date Fixer (DD-MM-YY)
// @version      1.0
// @description  Changes all dates on Rule34.xxx to a DD-MM-YY format
// @match        *://rule34.xxx/*
// @author       Lemons22
// @copyright    2016+, Lemons22
// @namespace    https://greasyfork.org/en/users/46477
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414670/R34%20Date%20Fixer%20%28DD-MM-YY%29.user.js
// @updateURL https://update.greasyfork.org/scripts/414670/R34%20Date%20Fixer%20%28DD-MM-YY%29.meta.js
// ==/UserScript==

/////////////////////////////////////////////////////////////////////////
// Original script by James Wood : https://greasyfork.org/en/users/516 //
/////////////////////////////////////////////////////////////////////////

(function commentsPostDate(){
  var el = document.getElementById('comment-list');
  if (el != null) {
    el.innerHTML = el.innerHTML.replace(/\b([A-Z])\w{2}\s\d{1,2},\s\d\d\d\d/g, function commentsPostDate(a) {
      var mdy = a.split(' ');
      var day = mdy[1].replace(',','');
      return day + ' ' + mdy[0] + ' ' + mdy[2];
  });
  }
})();

(function commentsCommentDate(){
  var el = document.getElementById('comment-list');
  if (el != null) {
    el.innerHTML = el.innerHTML.replace(/\b\d\d\d\d-\d\d-\d\d\b/g, function commentsCommentDate(b) {
      var mdy = b.split('-');
      return mdy[2] + '-' + mdy[1] + '-' + mdy[0];
  });
  }
})();

(function forumDate(){
  var el = document.getElementById('forum');
  if (el != null) {
    el.innerHTML = el.innerHTML.replace(/\b\d\d\/\d\d\/\d\d\b/g, function forumDate(c) {
      var mdy = c.split('/');
      return mdy[1] + '/' + mdy[0] + '/' + mdy[2];
  });
  }
})();

(function postStatsDate(){
  var el = document.getElementById('stats');
  el.innerHTML = el.innerHTML.replace(/\b\d\d\d\d-\d\d-\d\d\b/g, function postStatsDate(d) {
    var mdy = d.split('-');
    return mdy[2] + '-' + mdy[1] + '-' + mdy[0];
  });
})();



(function postCommentsDate(){
  var el = document.getElementsByTagName("b");
  for(var i in el){
    el[i].innerHTML = el[i].innerHTML.replace(/\b\d\d\d\d-\d\d-\d\d\b/g, function postCommentsDate(e) {
      var mdy = e.split('-');
      return mdy[2] + '-' + mdy[1] + '-' + mdy[0];
    });
  }
})();
