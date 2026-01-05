// ==UserScript==
// @name         PukiWiki Plus!の検索でハイライト部分の一覧を作る
// @description  検索結果から表示した記事でキーワードがハイライトされるので、それの一覧を先頭につけます
// @namespace    http://github.com/unarist/
// @version      0.1
// @author       unarist
// @match        http://wikiwiki.jp/*/?*&word=*
// @match        http://*.swiki.jp/index.php?*&word=*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/sugar/1.4.1/sugar.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/mustache.js/0.8.1/mustache.min.js
// @downloadURL https://update.greasyfork.org/scripts/26972/PukiWiki%20Plus%21%E3%81%AE%E6%A4%9C%E7%B4%A2%E3%81%A7%E3%83%8F%E3%82%A4%E3%83%A9%E3%82%A4%E3%83%88%E9%83%A8%E5%88%86%E3%81%AE%E4%B8%80%E8%A6%A7%E3%82%92%E4%BD%9C%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/26972/PukiWiki%20Plus%21%E3%81%AE%E6%A4%9C%E7%B4%A2%E3%81%A7%E3%83%8F%E3%82%A4%E3%83%A9%E3%82%A4%E3%83%88%E9%83%A8%E5%88%86%E3%81%AE%E4%B8%80%E8%A6%A7%E3%82%92%E4%BD%9C%E3%82%8B.meta.js
// ==/UserScript==

/*
複数ワードで検索したときに、個別に出すんじゃなくてマージしたい。
/foo/bar (word1)
/foo/baz (word1, word2)
「全見出しの配列」「見出し(id?)→[ワード]」をマージするといいんだろうか。
*/

var $root = $('.word0:first').parent();

var words = $root.find('strong').toArray().map(function(elem) {
    return {
        className: elem.className.split(' ').find(/^word/),
        label: elem.innerText
    };
});

function getHeaders(elem) {
    var $topElem = $(elem).parentsUntil('#body').last();
    
    // ヘッダにヒットしたら弟要素に移動
    $topElem = $topElem.is(':header') ? $topElem.next() : $topElem;
    
    var headers = $topElem.prevAll(':header').toArray();
    return headers.reduce(function(list, elem) {
        return list.none(function(i){ return i.tagName <= elem.tagName })
            ? list.add(elem)
            : list;
    }, []);
}

function here(func) {
    return func.toString().match(/\/\*([^]*)\*\//)[1];
}

if(!words.isEmpty()) {
    var wordViews = words.map(function(word) {
        var hits = $('.' + word.className).toArray().from(1);
        var hitViews = hits.map(function(elem){
            var headers = getHeaders(elem);
            console.log(headers);
            if(!headers.isEmpty()) {
                return {
                    headerStr: headers.reduceRight(function(s,i){return s + '/' + i.innerText.compact()}, ''),
                    anchor: headers.first().id
                };
            } else {
                return {
                    headerStr: '/',
                    anchor: ''
                }
            };  
        });
        
        hitViews = hitViews.unique();

        return {
            word: word.label,
            hits: hitViews
        };
        Mustache.render(template, view);
    });

    var template = here(function(){/*
    <br/><a style="cursor: pointer" onclick="$('#searchList').toggle()">▼見出し一覧</a>
    <div id="searchList" style="display: none">
    {{#words}}
    {{word}}
    <ul>
    {{#hits}}<li><a href="#{{anchor}}">{{headerStr}}</a></li>{{/hits}}
    </ul>
    {{/words}}
    </div>
    */});

    var html = Mustache.render(template, {
        words: wordViews
    });

    $root.append(html);
}