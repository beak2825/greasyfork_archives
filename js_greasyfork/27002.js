// ==UserScript==
// @name         Скрипт для удобства чтения комментариев на сайте oper.ru.
// @namespace    http://tampermonkey.net/
// @version      0.2.0.6
// @description  Фильтрует комментарии по имени комментатора. Под новостью добавляет список участников. При клике по нику, срабатывает фильтр.
// @author       rty65tt
// @match        *://oper.ru/*read.php*
// @include      *://*oper.ru/*/view.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27002/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%83%D0%B4%D0%BE%D0%B1%D1%81%D1%82%D0%B2%D0%B0%20%D1%87%D1%82%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B5%D0%B2%20%D0%BD%D0%B0%20%D1%81%D0%B0%D0%B9%D1%82%D0%B5%20operru.user.js
// @updateURL https://update.greasyfork.org/scripts/27002/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%83%D0%B4%D0%BE%D0%B1%D1%81%D1%82%D0%B2%D0%B0%20%D1%87%D1%82%D0%B5%D0%BD%D0%B8%D1%8F%20%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B5%D0%B2%20%D0%BD%D0%B0%20%D1%81%D0%B0%D0%B9%D1%82%D0%B5%20operru.meta.js
// ==/UserScript==

// Может где-то не сработать. Самый посещаемый сайт рунета, верстка ад! Это по нашему.
// Для сохранения глаз, рекомендую темно-серую тему https://userstyles.org/styles/138045/oper-ru-bw-dark-grey-990px 


(function() {
    'use strict';

    // Your code here...
    var l = document.location.href;
    var p = $('#middle>table:first>tbody>tr>td:first>font>b').find('a');
    var ip = $('a[name="comments"]');
    $(ip).before('<div class="usfscrpt" style="text-align:center; color:#555;background-color:#171717;padding:5px;border:1px solid #212121;"></div><br>');
    $('.usfscrpt').text('script : [LOAD]');

    var avtory = ['Sha-Yulin', 'Zhukoff', 'egoryakovlev', 'Баир Иринчеев', 'Игорь Леонардович Викентьев', 'Goblin', 'Ravid', 'Рогов'];

    var page = '';
    var arr = [];

    for(var i = 1; i < p.last().text(); i++) {
        page = page + '<a name="page-' + i + '"></a>';
        arr[i-1] = i;
    }

    $('table.comment:last').after(page);

    var deferreds = [];

    $.each(arr, function( a,i ) {
        deferreds.push(
            $.get( l, { page: i}, function( data ) {
                var d = $(data).find("table.comment, table.comment + *").prev();
                var lp = "page-" + i;
                $('a[name=' + lp +']').after(d);
                $("a[href='" + l + "&page=" + i +"#comments']").attr('href', "#" + lp).attr('class', 'usrscriptpage');
            })
        );
    });

    $.when.apply($, deferreds).done(function(){
        $('.comment').find("a").attr('href', function( i,vl ) {
            return vl.replace(/(.*)\&page=\d+(#\d+)$/, '$1$2');
        }).attr('class', 'showcom');
        var usrs = {};
        $('.comment>tbody>tr>td>a>font>b').each(function() {
            var n = $(this).text();
            var color = $(this).parent().attr('color');
            $(this).closest('.comment').attr('name', n);
            if (usrs[n]) {
                usrs[n].c = usrs[n].c + 1;
            } else {
                usrs[n] = {};
                usrs[n].c = 1;
                usrs[n].s = color;
            }

        });
        var asd = '';
        var mtu = '';
        for(var u in usrs) {
            var d = '<a href="#1" name="' + u + '" class="ufilter" style="color:' + usrs[u].s + ' !important;">' + u + '[' + usrs[u].c + ']' + '</a>, ';
            
            if (avtory.indexOf(u) !== -1) {
                mtu = mtu + d;
            } else { asd = asd + d;}
        }
        $('.usfscrpt').html(mtu + '<hr>' + asd + ' <hr><a href="#comments" class="ufilteroff" style="color:#f33 !important;">[Выкл.фильтр]</a><br>');
        $('.ufilter').click(function() {
            $('.comment').hide();
            $('.comment[name="'+ $(this).attr('name') +'"]').show();
        });
        $('.ufilteroff').click(function() {
            $('.comment').show();
        });
        $('.showcom').click(function() {
            var t = $(this).text().replace(/#(\d+)$/, '$1');
            $('a[name="' + t + '"]').next().show(400);
        });
        $('.usrscriptpage').click(function() {
            $('.comment').show();
        });
    });
})();






