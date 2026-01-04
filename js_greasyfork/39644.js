// ==UserScript==
// @name         MyFigureCollection: doujinshi links
// @namespace    https://myfigurecollection.net/profile/darkfader
// @version      0.4
// @description  Add clipboard, Suruga-ya, Toranoana, ExHentai, DoujinshiDB links.
// @author       Rafael Vuijk
// //@require      http://code.jquery.com/jquery-latest.js
// //@require      https://rawgit.com/polygonplanet/encoding.js/master/encoding.min.js
// @match        http*://myfigurecollection.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39644/MyFigureCollection%3A%20doujinshi%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/39644/MyFigureCollection%3A%20doujinshi%20links.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

$(document).ready(function() {
    'use strict';

    $('div.item-picture').each(function() {
        var img = $(this).find('a > img')[0];
        var a = document.createElement('a');
        a.setAttribute('href', 'http://www.doujinshi.org/IMGSERV/socket.php?img=&COLOR=4&URL=' + img.src.replace('https','http').replace(/\?.*/, ''));
        a.setAttribute('target', "_blank");
        a.innerText = " (ddb)";
        a.style = "color: #4f535b";
        $(this).append(a);
    });

    $('div.form > div.form-field').each(function() {
        var T = null;

        var ex = null;
        var surugaya = null;
        var mandarake = "https://order.mandarake.co.jp/order/listPage/serchKeyWord?keyword=";
        var toranoana = null;

        switch ($(this).find('div.form-label').text()) {
            case "Title":
                T = "objects";
                ex = "";
                surugaya = "http://www.suruga-ya.jp/search?search_word=";
                toranoana = "nam";
                break;
            case "Origin":
                T = "parody";
                ex = 'parody:';
                break;
            case "Characters":
                T = "character";
                toranoana = "mch";
                break;
            case "Company":
                T = "circle";
                ex = 'group:';
                surugaya = "http://www.suruga-ya.jp/search?category=&search_word=&restrict[]=brand=";
                toranoana = "mak";
                break;
            case "Artist":
                T = "author";
                ex = 'artist:';
                surugaya = "http://www.suruga-ya.jp/search?category=&search_word=&restrict[]=person=";
                toranoana = "act";
                break;
            case "Event":
                T = "convention";
                break;
        }

        if (T != null) {

            // doujinshi
            $(this).find('a').each(function() {

                var sw = null;
                if (true) {// already switched to Japanese
                    sw = $(this).contents().map(function() { if(this.nodeType == 3) return this.nodeValue; }).get().join('');
                    if (sw === ' ') {
                        sw = $(this).find('span').contents().map(function() { if(this.nodeType == 3) return this.nodeValue; }).get().join('');
                    }
                } else {
                    sw = $(this).attr('switch');
                    if (typeof(sw) === 'undefined') {
                        sw = $(this).find('span').attr('switch');
                    }
                }

                // copy to clipboard
                {
                    var ta = document.createElement('textarea');
                    ta.value = sw;
                    ta.style = "position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;";
                    $(this).append(ta);

                    var a = document.createElement('a');
                    a.setAttribute('href', "javascript:void(0);");
                    a.innerText = " 📋";
                    a.title = "clipboard";
                    a.style = "color: #080";
                    a.addEventListener('click', function(event) {
                        ta.select();
                        document.execCommand('copy');
                        return false;
                    });
                    $(this).append(a);
                }

                // surugaya
                if (surugaya !== null) {
                    var a = document.createElement('a');
                    a.setAttribute('href', surugaya + encodeURIComponent(sw));
                    a.setAttribute('target', "_blank");
                    a.innerText = " 駿河屋";
                    a.title = "Suruga-ya";
                    a.style = "color: #00f";
                    $(this).append(a);
                }

                // Mandarake
                if (mandarake !== null) {
                    var a = document.createElement('a');
                    a.setAttribute('href', mandarake + encodeURIComponent(sw));
                    a.setAttribute('target', "_blank");
                    a.innerText = " ま";
                    a.title = "Mandarake";
                    a.style = "color: #f00";
                    $(this).append(a);
                }

                // toranoana
                if (toranoana !== null) {
                    var f = document.createElement('form');
                    f.style = "display: inline";
                    f.action = "http://www.toranoana.jp/cgi-bin/R2/d_search.cgi";
                    f.method = 'post';
                    f.target = '_blank';
                    f.setAttribute('accept-charset', 'shift-jis');

                    var inp = function(name, value) {
                        var i = document.createElement('input');
                        i.type = 'hidden';
                        i.name = name;
                        i.value = value;
                        return i;
                    };

                    $(f).append(inp(toranoana, sw));
                    $(f).append(inp('stk', '1'));
                    $(f).append(inp('img', '1'));
                    $(f).append(inp('item_kind', '0401'));

                    var a = document.createElement('a');
                    a.setAttribute('href', 'javascript:;');
                    a.setAttribute('target', "_blank");
                    $(a).on('click', function (event) { $(this).closest("form").submit(); });
                    a.innerText = " と";
                    a.title = "Toranoana";
                    a.style = "color: #fc0";
                    $(f).append(a);

                    $(this).append(f);
                }

                // Ex-Hentai
                if (ex !== null) {
                    var a = document.createElement('a');
                    a.setAttribute('href', "https://exhentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_apply=Apply+Filter&f_search=" + ex + encodeURIComponent('"' + sw + '"'));
                    a.setAttribute('target', "_blank");
                    a.innerText = " ⑱";
                    a.title = "ExHentai";
                    a.style = "color: #4f535b";
                    $(this).append(a);
                }

                // doujinshi DB
                {
                    var a = document.createElement('a');
                    a.setAttribute('href', "http://www.doujinshi.org/search/simple/?T=" + T + "&sn=" + encodeURIComponent(sw));
                    a.setAttribute('target', "_blank");
                    a.innerText = " 📖";
                    a.title = "Doujinshi DB";
                    a.style = "color: #5b8ef4";
                    $(this).append(a);
                }
            });
        }
    });
});
