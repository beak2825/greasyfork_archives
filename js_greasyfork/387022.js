// ==UserScript==
// @name            Skip a Listing of the Dates
// @name:ja         日付選択ページを飛ばす
// @namespace       https://greasyfork.org/users/19523
// @description     on a list page of the urls on Internet Archive
// @description:ja  インターネットアーカイブでURLのワイルドカード検索で出た一覧から選択すると直接そのページへアクセスできる
// @include         http://web.archive.org/web/*/*
// @include         https://web.archive.org/web/*/*
// @version         0.1.3
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/387022/Skip%20a%20Listing%20of%20the%20Dates.user.js
// @updateURL https://update.greasyfork.org/scripts/387022/Skip%20a%20Listing%20of%20the%20Dates.meta.js
// ==/UserScript==


  if (location.href.slice(-1) !== '*') {
    return;
  }

  var phrases = location.pathname.split('/');
  if (phrases[2].indexOf('*') < 0) {
    return;
  }

  var observer = new MutationObserver(function (mutations) {
    var aElements = document.querySelectorAll('#resultsUrl_wrapper td.url > a');
    for (var i = 0, a; a = aElements[i]; i++) {
      var names = a.pathname.split('/');
      names[2] = '99999999999999';
      a.pathname = names.join('/');
    }
  });

  observer.observe(document.getElementById('resultsUrl').getElementsByTagName('tbody')[0], { childList: true });
