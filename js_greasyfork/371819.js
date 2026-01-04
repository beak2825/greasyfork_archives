// ==UserScript==
// @name         ac-score-table-ja
// @namespace    https://github.com/rsk0315/
// @version      0.1.2
// @description  AtCoder（beta.atcoder.jp）の日本語版で配点表を表示します．
// @author       rsk0315
// @license      MIT
// @include      /^https?://beta\.atcoder\.jp\/contests\/[^\/]+\/?(?:\?.*)?$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371819/ac-score-table-ja.user.js
// @updateURL https://update.greasyfork.org/scripts/371819/ac-score-table-ja.meta.js
// ==/UserScript==

function isJapanesePage() {
    // URL を見て判断できる保証が無いので右上の国旗を見て判断します．
    // ところで一般に国旗で言語を示す UI はアとされていますが

    // フラグ，bool 的な意味ではなく国旗です
    // この要素が確実に目的のものを指しているかがアレなのですが，まぁ大丈夫でしょう
    var flag = $($('.dropdown-toggle')[0]).children()[0].src;
    if (flag.match(/ja\.png$/)) return true;
    return false;
}

function hasScoreTable() {
    var haiten = $('h3:contains(配点)')[0];  // ガバガバ判定
    if (haiten !== undefined) return true;
    return false;
}

(function() {
/*     'use strict'; */

    // My code here...
    if (!(isJapanesePage() && !hasScoreTable())) return;

    // 英語用の配点表が無ければ帰ります．
    // ところでなぜ同じページ内にあるのに英語版だけしか見せないんでしょう
    var $pv = $('h3:contains(Point Values)');
    if ($pv.length == 0) return;

    // これにマッチする別のテーブルがあるとアなんですが，まぁアレです．
    // たぶん $pv の次とかにあるやつを指定するといいんですが，
    // 地の文に邪魔されたりしないかがわからないため，問題が起こるまでは
    // このままでいってみます．
    // テーブルがたくさんあっても配点が出てくればいいでしょ，みたいな気持ちで
    var $table = $('.row>.span4>table');
    if ($table.length == 0) return;

    // これは AGC 020 などの公式で出ているやつに合わせています．
    // 他のコンテストでは他の位置だったりするかもしれませんので，
    // 必要があればそのうち変えるかもしれません．
    var $toInsert = $('.lang-ja>h3:contains(過去問＆その他コンテスト)');
    if ($toInsert.length == 0) {
        // もし見つからなければ「その他」であろう最後の要素の直前に入れます．
        // この辺ガバガバなのでそのうち変えるかもしれません．
        $toInsert = $('.lang-ja>h3:last');
    }
    $toInsert.before('<h3>配点</h3>');
    $toInsert.before('<p>これはUserscriptによって追加された表です．</p>');
    $toInsert.before($table);
    // XSS に対してアなはずなんですが，AtCoder 社を信じるみたいなことをします

    // AtCoder Scores でコメント芸が人気だったのでコメントを多めに書いています．
})();