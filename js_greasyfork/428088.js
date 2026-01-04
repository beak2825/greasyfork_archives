// ==UserScript==
// @namespace    http://tampermonkey.net/
// @name         Google検索に英語だけの検索結果を表示させるボタンを追加
// @description  Google検索にはツール機能を使うことで日本語のみの検索結果にはできるが、英語のみの検索結果を表示できないため作成した。
// @author       2001Y
// @include      https://www.google.com/search?*
// @version      1.0
// @downloadURL https://update.greasyfork.org/scripts/428088/Google%E6%A4%9C%E7%B4%A2%E3%81%AB%E8%8B%B1%E8%AA%9E%E3%81%A0%E3%81%91%E3%81%AE%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%95%E3%81%9B%E3%82%8B%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/428088/Google%E6%A4%9C%E7%B4%A2%E3%81%AB%E8%8B%B1%E8%AA%9E%E3%81%A0%E3%81%91%E3%81%AE%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%95%E3%81%9B%E3%82%8B%E3%83%9C%E3%82%BF%E3%83%B3%E3%82%92%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var html = '<div id="us_ctrlcenter"><div><a href="javascript:urlPara(&quot;lr&quot;,&quot;lang_en&quot;);">英語</a><a href="javascript:urlPara(&quot;lr&quot;,&quot;lang_ja&quot;);">日本語</a></div><div></div><a href="javascript:urlPara(&quot;tbs&quot;,&quot;qdr:w1&quot;);">1週間</a><a href="javascript:urlPara(&quot;tbs&quot;,&quot;qdr:m1&quot;);">1ヶ月</a><a href="javascript:urlPara(&quot;tbs&quot;,&quot;qdr:m6&quot;);">6ヶ月</a><a href="javascript:urlPara(&quot;tbs&quot;,&quot;qdr:y1&quot;);">1年間</a><a href="javascript:urlPara(&quot;tbs&quot;,&quot;qdr:y3&quot;);">3年間</a></div><style>#us_ctrlcenter {position: absolute;top: 150px;left: 24px;}#us_ctrlcenter a {color: #70757a;display: block;}#us_ctrlcenter div {margin-bottom:10px;}</style><script>function urlPara(e1,e2){    let url = new URL(window.location);    url.searchParams.set(e1, e2);    window.location.href = url;}</script>';

    var table = document.body;
    var range = document.createRange();
    range.selectNodeContents(table);
    var frag = range.createContextualFragment(html);
    table.appendChild(frag);
})();