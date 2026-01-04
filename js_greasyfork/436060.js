// ==UserScript==
// @name         toloka убрать скачанные дубли
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  =)
// @author       You
// @match        https://toloka.to/tracker.php*
// @match        https://toloka.to/t1*
// @match        https://toloka.to/t2*
// @match        https://toloka.to/t3*
// @match        https://toloka.to/t4*
// @match        https://toloka.to/t5*
// @match        https://toloka.to/t6*
// @match        https://toloka.to/t7*
// @match        https://toloka.to/t8*
// @match        https://toloka.to/t9*
// @icon         https://www.google.com/s2/favicons?domain=toloka.to
// @require      https://code.jquery.com/jquery-3.1.1.slim.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436060/toloka%20%D1%83%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D1%81%D0%BA%D0%B0%D1%87%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%B4%D1%83%D0%B1%D0%BB%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/436060/toloka%20%D1%83%D0%B1%D1%80%D0%B0%D1%82%D1%8C%20%D1%81%D0%BA%D0%B0%D1%87%D0%B0%D0%BD%D0%BD%D1%8B%D0%B5%20%D0%B4%D1%83%D0%B1%D0%BB%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // просмотр одного торрента, поиск
    if( document.location.href.match('https:\/\/toloka\.to\/t([0-9]+)') ){
        var filmNameEn = $('a.maintitle').text().match(/\/(.*?)\)/)[1].trim().replace(' ','%20')+')';
        var linkSearch = '<a href="https://toloka.to/tracker.php?nm='+filmNameEn+'" target="_blank" style="float:right;font-size:26px;">Пошук&#10163;</a>';
        $('span.postbody>div:first').append(linkSearch);
    }

    // добавляем к каждому фильму ссылку для поиска аналогов
    $('table.forumline tr td.topictitle a').each(function(){
        var td = $(this).closest('td');
        var f = $(this).find('b').text();
        console.log(f);
        if( f.match(/\(([\d+\/\-\s\,*]{4,})\)/g) ){
            var match = f.match(/\(([\d+\/\-\s\,*]{4,})\)/g);
            var year = match[match.length - 1];
            td.append('<a href="https://toloka.to/tracker.php?nm='+f.split('/')[0]+'+'+year+'" target="_blank" style="float:right;">&#10163;</a>');
        }
    });

    var filmsLoaded = [];
    $('table.forumline tr td.topictitle a.seedmed').each(function(){
        var f = $(this).find('b').text();
        console.log(f);
        var match = f.match(/\(([\d+\/\-\s\,*]{4,})\)/g);
        var year = match[match.length - 1];
        //console.log( f, year );
        filmsLoaded.push({
            name: f.split(year)[0],
            nameUA: f.split('/')[0],
            year: year
        });
    });

    console.log(filmsLoaded);

    $('table.forumline tr td.topictitle a.genmed').each(function(){
        var tr = $(this).closest('tr');
        var f = $(this).find('b').text();
        filmsLoaded.forEach(function(el,i){
            if( f.indexOf(el.name) >= 0 ){
                tr.css({ opacity: .2 });
            }
        });
    });

    // style hover color
    $('head').append('<style>.prow1:hover td, .prow2:hover td {border-bottom:1px solid #999;}</style>');

})();