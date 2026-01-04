// ==UserScript==
// @name        AN date sort
// @description Date sort fix
// @namespace   http://audionews.org
// @include     http://audionews.org/tracker.php*
// @include     https://audionews.org/tracker.php*
// @run-at      document-start
// @version     1.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/38769/AN%20date%20sort.user.js
// @updateURL https://update.greasyfork.org/scripts/38769/AN%20date%20sort.meta.js
// ==/UserScript==

function ready(fn) {
  if (document.readyState && document.readyState !== 'loading'){
    fn();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', fn);
  } else if (document.attachEvent) {
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState !== 'loading')
        fn();
    });
  }
}

ready(function () {
  var trs = document.querySelectorAll('#tor-tbl tr');
  for(var i = 0; i < trs.length; i++) {
    var tr = trs[i];
    var td = tr.querySelectorAll('td')[13];
    if (!td)
      continue;

    var dateText = td.innerHTML;
    var date;

    if (dateText && (date = dateText.match(/(\d{1,2})-(\d{1,2})-(\d{4})/))) {
      dateText = date[3] + '-' + date[1] + '-' + date[2];
      td.innerHTML = dateText;
    }
  }
});
