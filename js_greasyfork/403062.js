// ==UserScript==
// @name         atcoder-submission-wo-ikki-ni-miiru
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  AtCoderの提出結果の一覧のページにソースコードを表示します。
// @author       pekempey
// @match        https://atcoder.jp/contests/*/submissions*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/403062/atcoder-submission-wo-ikki-ni-miiru.user.js
// @updateURL https://update.greasyfork.org/scripts/403062/atcoder-submission-wo-ikki-ni-miiru.meta.js
// ==/UserScript==

(function() {
    var prettify = $('<script>').attr({
        'src': "https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js"
    });
    $('body').append(prettify);
    var container = $('#main-container').append($('<div>').addClass('atcoder-submissions-container'));
    $('tbody tr').each(function() {
        var tr = $(this);
        var href = tr.find('td:nth-child(10) a').attr('href');
        $.get(href, function(data) {
            var html = $(data);
            var src = html.find('#submission-code');
            var table = $('<table>').addClass('table table-bordered table-striped small th-center').append($('<tbody>').append(tr.clone()));
            container.append(table);
            container.append(src);
            // src.css('max-height', 'none');
        });
    })
})();