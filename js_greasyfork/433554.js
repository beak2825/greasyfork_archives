// ==UserScript==
// @name           PolishSource-Extra
// @version        0.9.0
// @author         Jerry1333 (based on script by Upgreydd)
// @namespace      https://greasyfork.org/users/4704
// @description    Rozbudowuje możliwości strony o kilka dodatków. Szczegóły w opisie.
// @match          http*://*polishsource.cz/browse.php*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require        https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@43fd0fe4de1166f343883511e53546e87840aeaf/gm_config.js
// @require        https://greasyfork.org/scripts/381016-timeago/code/TimeAgo.js
// @require        https://greasyfork.org/scripts/381017-timeago-locales-js/code/TimeAgoLocalesjs.js
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @grant          GM_notification
// @grant          GM_log
// @downloadURL https://update.greasyfork.org/scripts/433554/PolishSource-Extra.user.js
// @updateURL https://update.greasyfork.org/scripts/433554/PolishSource-Extra.meta.js
// ==/UserScript==

/* globals $, GM_config, timeago, spectrum */

(function() {
    'use strict';
    GM_config.init({
        'id': 'PS',
        'title': 'KONFIGURACJA ' + GM_info.script.name + ' ' + GM_info.script.version,
        'fields':
        {
            'rowColorOdd':
            {
                'label': 'Kolor wierszy pozycji nieparzystych',
                'type': 'text',
                'section': ['Podstawowe ustawienia'],
                'title': 'Kolor w formacie akceptowanym przez CSS (np. #001122, white, rgb(255,255,255) itp.)',
                'size': 10,
                'default': '#a7a7a7'
            },
            'rowColorOddPSIG':
            {
                'label': 'Kolor wierszy pozycji nieparzystych PSIG',
                'type': 'text',
                'title': 'Kolor w formacie akceptowanym przez CSS (np. #001122, white, rgb(255,255,255) itp.)',
                'size': 10,
                'default': '#99B98F'
            },
            'rowColorPSIG':
            {
                'label': 'Kolor wierszy pozycji PSIG',
                'type': 'text',
                'title': 'Kolor w formacie akceptowanym przez CSS (np. #001122, white, rgb(255,255,255) itp.)',
                'size': 10,
                'default': '#edd400'
            },
            'iconColorDownloadSSL':
            {
                'label': 'Kolor ikony pobierania SSL',
                'type': 'text',
                'title': 'Kolor w formacie akceptowanym przez CSS (np. #001122, white, rgb(255,255,255) itp.)',
                'size': 10,
                'default': '#4e9a06'
            },
            'iconColorDownloadSTD':
            {
                'label': 'Kolor ikony pobierania standarda',
                'type': 'text',
                'title': 'Kolor w formacie akceptowanym przez CSS (np. #001122, white, rgb(255,255,255) itp.)',
                'size': 10,
                'default': '#333333'
            },
            'iconColorWatchList':
            {
                'label': 'Kolor ikony dodania do obserwowanych',
                'type': 'text',
                'title': 'Kolor w formacie akceptowanym przez CSS (np. #001122, white, rgb(255,255,255) itp.)',
                'size': 20,
                'default': '#7741d0'
            },
            'iconColorCustomRSS':
            {
                'label': 'Kolor ikony dodania do CustomRSS',
                'type': 'text',
                'title': 'Kolor w formacie akceptowanym przez CSS (np. #001122, white, rgb(255,255,255) itp.)',
                'size': 20,
                'default': '#f57900'
            },
            'iconColorThanks':
            {
                'label': 'Kolor ikony podziękowania za pozycję',
                'type': 'text',
                'title': 'Kolor w formacie akceptowanym przez CSS (np. #001122, white, rgb(255,255,255) itp.)',
                'size': 10,
                'default': '#0055a4'
            },
            'iconSize':
            {
                'label': 'Rozmiar ikon',
                'type': 'text',
                'title': 'Rozmiar ikon dodawanych przez skrypt. Przyjmuje wartości atrybutu CSS font-size (np. 1.3em, 24px itp.)',
                'size': 5,
                'default': '20px'
            },
            'notification':
            {
                'label': 'Rodzaj powiadomień',
                'type': 'radio',
                'options': ['Win10', 'Alert', 'OFF'],
                'title': 'Zdecuduj czy używać zwykłej funkcji alert() czy może dużo ładniejszych powiadomień z systemu Windows 10 lub całkowicie wyłączyć to powiadomienie (dotyczy podziękowania za pozycję oraz dodania do listy zakładek)',
                'default': 'Alert'
            },
            'SSL':
            {
                'label': 'Ikona pobierania przez SSL',
                'type': 'radio',
                'section': ['Moduły'],
                'options': ['ON', 'OFF'],
                'default': 'OFF'
            },
            'STD':
            {
                'label': 'Ikona pobierania standardowa',
                'type': 'radio',
                'options': ['ON', 'OFF'],
                'default': 'OFF'
            },
            'WL':
            {
                'label': 'Ikona dodawania do obserwowanych',
                'type': 'radio',
                'options': ['ON', 'OFF'],
                'default': 'OFF'
            },
            'CustomRSS':
            {
                'label': 'Ikona dodawania do CustomRSS',
                'type': 'radio',
                'options': ['ON', 'OFF'],
                'default': 'OFF'
            },
            'THX':
            {
                'label': 'Ikona podziękowania za pozycję',
                'type': 'radio',
                'options': ['ON', 'OFF'],
                'default': 'OFF'
            },
            'FOCUS':
            {
                'label': 'Autofocus wyszukiwarki',
                'type': 'radio',
                'title': 'Czy po wejściu na stronę automatycznie ustawiać kursor w polu wyszukiwarki?',
                'options': ['ON', 'OFF'],
                'default': 'OFF'
            },
            'ROWCOLORPSIG':
            {
                'label': 'Kolorowanie wierszy pozycji PSIG',
                'type': 'radio',
                'title': 'Wiersze pozycji PSIG w innym kolorze',
                'options': ['ON', 'OFF'],
                'default': 'ON'
            },
            'ROWCOLOR':
            {
                'label': 'Kolorowanie wierszy pozycji',
                'type': 'radio',
                'title': 'Nieparzyste wiersze w innym kolorze niż parzyste',
                'options': ['ON', 'OFF'],
                'default': 'OFF'
            },
            'SEARCH':
            {
                'label': 'Modyfikacje wyszukiwarki',
                'type': 'radio',
                'options': ['ON', 'OFF'],
                'default': 'OFF'
            },
            'DATE_FORMAT':
            {
                'label': 'Zmiana formatu czasu dodania wstawki',
                'type': 'radio',
                'title': 'Zmienia format daty dodania torrenta z "2021-10-07 17:39:42" na "5 minut temu"',
                'options': ['ON','OFF'],
                'default': 'OFF'
            },
            'iconColorSeed':
            {
                'label': 'Kolor ikony "Torrenty potrzebujące seeda"',
                'type': 'text',
                'section': ['Modyfikacje wyszukiwarki'],
                'title': 'Kolor w formacie akceptowanym przez CSS (np. #001122, white, rgb(255,255,255) itp.)',
                'size': 10,
                'default': '#5d3b05'
            },
            'iconColorRefresh':
            {
                'label': 'Kolor ikony "Aktualizuj czas przeglądania"',
                'type': 'text',
                'title': 'Kolor w formacie akceptowanym przez CSS (np. #001122, white, rgb(255,255,255) itp.)',
                'size': 10,
                'default': '#800000'
            },
            'iconColorSearch':
            {
                'label': 'Kolor ikony "Wyszukaj"',
                'type': 'text',
                'title': 'Kolor w formacie akceptowanym przez CSS (np. #001122, white, rgb(255,255,255) itp.)',
                'size': 10,
                'default': 'white'
            },
            'catRetainsSearchText':
            {
                'label': 'Czy wyszukiwarka ma zachowywać szukaną frazę przy zmianie kategorii?',
                'type': 'checkbox',
                'title': 'Zdecuduj czy wyszukiwarka ma zachowywać frazę którą wpisałeś kiedy klikniesz na nazwę kategorii',
                'default': false
            }
        },
        'css' : '#PS .section_header_holder {display: inline-grid;min-width: 420px;padding-right: 50px;} #PS .section_header { margin: 5px 0!important;} #PS .radio_label { vertical-align: bottom; }',
        events: {
            save: function() {
                window.location.reload();
            }
        }
    });

    function openConfig() {
        GM_config.open();
    }

    function isON(name) {
        if (GM_config.get(name) === 'ON') {
            return true;
        } else {
            return false;
        }
    }

    function alertN(text) {
        switch(GM_config.get('notification')) {
            case 'Win10':
                GM_notification(text);
                break;
            case 'Alert':
                alert(text);
                break;
            default:
                break;
        }
    }

    function AddCustomRSS(id, name) {
        if (id === undefined) {
            alertN('Torrent id error');
            return false;
        }
        // 'custom_rss.php?id=' + id + '&do=add'
        var dataString = 'id=' + id + '&do=add';
        var text = 'Dodano do CustomRSS: ' + name;
        //$.get(dataString);
        $.ajax({
            type: "GET",
            url: "custom_rss.php",
            data: dataString,
            success: function(pageData) {
                alertN(text);
            }
        });
        return false;
    }

    function AddWatchlist(id, name) {
        if (id === undefined) {
            alertN('Torrent id error');
            return false;
        }
        // bookmark.php?torrent=452854&action=added&ret=1
        var dataString = 'torrent=' + id + '&action=added&ret=1';
        var text = 'Dodano do obserwowanych: ' + name;
        $.ajax({
            type: "GET",
            url: "bookmark.php",
            data: dataString,
            success: function(pageData) {
                alertN(text);
            }
        });
        return false;
    }

    function AddThanks(id, name) {
        if (id === undefined) {
            alertN('Torrent id error');
            return false;
        }
        var dataString = 'id=' + id + '&thx=1';
        var text = 'Podziękowano za torrent ' + name + '!';
        $.ajax({
            type: "GET",
            url: "details.php",
            data: dataString,
            success: function() {
                alertN(text);
            }
        });
        return false;
    }

    function timeDiff(previous) {
        return timeago.format(previous,'pl');
    }

    var fa = document.createElement("link");
    fa.rel = "stylesheet";
    fa.href = "//use.fontawesome.com/releases/v5.15.4/css/all.css";
    document.head.appendChild(fa);

    GM_registerMenuCommand('Konfiguracja', openConfig);

    var rowColorOdd = GM_config.get('rowColorOdd');
    var rowColorOddPSIG = GM_config.get('rowColorOddPSIG');
    var rowColorPSIG = GM_config.get('rowColorPSIG');
    var iconColorDownloadSSL = GM_config.get('iconColorDownloadSSL');
    var iconColorDownloadSTD = GM_config.get('iconColorDownloadSTD');
    var iconColorWatchList = GM_config.get('iconColorWatchList');
    var iconColorCustomRSS = GM_config.get('iconColorCustomRSS');
    var iconColorThanks = GM_config.get('iconColorThanks');
    var iconColorSeed = GM_config.get('iconColorSeed');
    var iconColorRefresh = GM_config.get('iconColorRefresh');
    var iconColorSearch = GM_config.get('iconColorSearch');
    var iconSize = GM_config.get('iconSize');
    var notification = GM_config.get('notification');
    var catRetainsSearchText = GM_config.get('catRetainsSearchText');

    if (isON('SEARCH')) {
        var searchForm = $('form').first();
        var searchBox = $('input[name=search]');
        var searchBtn = $('input.btn');

        searchForm.prepend(searchBox);
        searchBox.attr('style',"width:65%;min-width:300px;max-width:800px;background-color:white;color:black;border-radius:5px;border-color:black;font-size:1.8em;padding:5px;text-align:center;");
        searchBox.attr('placeholder','Wpisz szukaną frazę ...');
        searchBox.attr('id','searchBox');
        searchBox.addClass('clearable');
        searchBox.wrap('<div class="searchBoxContainer"></div>');
        var searchBoxContainer = $('div.searchBoxContainer');
        searchBoxContainer.append(searchBtn);
        searchBtn.remove();
        $('#updatebrowsetimelink').remove();
        $('a[href="tns.php"]').remove();

        searchBoxContainer.append('<span id="bSearch" title="Rozpocznij wyszukiwanie" class="fas fa-search" style="margin: 5px;cursor: pointer;color:' + iconColorSearch + ';font-size: ' + iconSize + ';"></span>');
        searchBtn = searchForm.find('#bSearch');
        searchBtn.on('click', function() { searchForm.submit(); });

        searchBoxContainer.prepend('<span id="bSeed" title="Torrenty potrzebujące seeda" class="fas fa-skull" style="margin: 5px;cursor: pointer;color:' + iconColorSeed + ';font-size: ' + iconSize + ';"></span>');
        searchForm.find('#bSeed').on('click', function() { window.location = 'tns.php'; });

        searchBoxContainer.prepend('<span id="bRefresh" title="Odśwież listę torrentów" class="fas fa-sync-alt" style="margin: 5px;cursor: pointer;color:' + iconColorRefresh + ';font-size: ' + iconSize + ';"></span>');
        searchForm.find('#bRefresh').on('click', function() { window.location = 'browse.php?action=updatebrowsetime'; });

        // Przycisk do czyszczenia tekstu wyszukiwarki
        $('head').append('<style type="text/css">.clearable{background:#fff url(data:image/gif;base64,R0lGODlhBwAHAIAAAP///5KSkiH5BAAAAAAALAAAAAAHAAcAAAIMTICmsGrIXnLxuDMLADs=) no-repeat right -10px center;border:1px solid #999;padding:3px 18px 3px 4px;border-radius:3px;transition:background .4s}.clearable.x{background-position:right 5px center}.clearable.onX{cursor:pointer}.clearable::-ms-clear{display:none;width:0;height:0}</style>');
        function tog(v){return v?'addClass':'removeClass';}
        $(document).on('input', '.clearable', function(){
            $(this)[tog(this.value)]('x');
        }).on('mousemove', '.x', function(e){
            $(this)[tog(this.offsetWidth-18 < e.clientX-this.getBoundingClientRect().left)]('onX');
        }).on('touchstart click', '.onX', function(ev){
            ev.preventDefault();
            $(this).removeClass('x onX').val('').change();
        });
        // Przycisk do zaznaczania wszystkich kategorii
        $('table#browsesearch > tbody > tr').prepend('<td class="bottom"><span id="check" chk=1 class="far fa-check-square" style="margin: 5px;cursor: pointer;color: white;font-size: ' + iconSize + ';"></span></td>');
        var checkall = $('table#browsesearch > tbody > tr').find('#check');
        checkall.on('click', function () {
            if ($(this).attr("chk") == 1) {
                $("input:checkbox[name^='c']").attr('checked','checked');
                $(this).attr('chk', 0);
                $(this).removeClass('fa-check-square');
                $(this).addClass('fa-square');
            } else {
                $("input:checkbox[name^='c']").removeAttr('checked');
                $(this).attr('chk', 1);
                $(this).removeClass('fa-square');
                $(this).addClass('fa-check-square');
            }
        });
        // zachowuj haslo wyszukiwania przy zmianie kategorii
        if(catRetainsSearchText) {
            $('a.catlink').each(function() {
                var searchTerm = $('#searchBox').attr('value');
                if(searchTerm !== '') {
                    var url = $(this).attr('href')+'&search='+searchTerm;
                    $(this).attr('href', url);
                }
            });
        }

        const urlParams = new URLSearchParams(window.location.search);
        const inclDeadParam = urlParams.get('incldead');
        if (!inclDeadParam) $("select[name='incldead']").val(0);

        $('a[href="pr3mi3ry.php"]').nextAll('br').remove(); // remove exes of <br>
    }

    if (!isON('FOCUS')) {
        $('#bSearch').focus();
    } else {
        $('input[name="search"]').focus();
    }

    var torrentTable = $('#restable');

    if (isON('ROWCOLORPSIG')) {
        $('tr#coltor').each(function() {
            $(this).css("background-color", rowColorPSIG);
        });
    } else {
        $('tr#coltor').each(function() {
            $(this).css("background-color", '');
            $(this).removeAttr('id');
        });
    }

    if (isON('ROWCOLOR')) {
        torrentTable.find('tbody>tr:nth-child(odd)').each(function() {
            if ($(this).attr('id') == "coltor") {
                $(this).css("background-color", rowColorOddPSIG);
            } else {
                $(this).css("background-color", rowColorOdd);
            }
        });
    }

    if (isON('DATE_FORMAT')) {
        if (window.location.pathname.replace('/', '') == 'browse.php') {
            torrentTable.find('tbody>tr').each(function() {
                var dateContainer = $(this).children('td:nth-child(4)');
                var date = dateContainer.children();

                if (date !== undefined && date.html() !== 'Dodano') {
                    var positionStringDate = date.html().replace('<br>', 'T');
                    var positionDate = new Date(positionStringDate);
                    var newDateString = '<span title="' + date.html().replace('<br>', ' ') + '">' + timeDiff(positionDate) + '</span>';
                    date.remove();
                    dateContainer.html(newDateString);
                }
            });
        }
    }

    function addslashes(str) {
        return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    }

    function getType(picUrl) {
        var type = null;
        switch(picUrl) {
            case '/pic/2disk.png': type='STD'; break;
            case '/pic/2downloadssl.png': type = 'SSL'; break;
            case '/pic/2crssico.png': type = 'RSS'; break;
            default: type = 'OFF';break;
        }
        return type;
    }

    torrentTable.find('tbody>tr:not(:first-child)>td:nth-child(6)').each(function() {
        var container = $(this);
        $(this).find('a').each(function() { //$('td > a[href$=".torrent"]').each(function() {
            var details = $(this);
            var picUrl = $(this).children().attr("src");

            if(isON('STD') && getType(picUrl) == 'STD') {
                container.append("&nbsp;<a href=" + details.attr('href') + " align=\"center\" class=\"index-std\" title=\"Szybko pobierz pozycję\"><span class=\"fas fa-download fa-fw\" style=\"color: " + iconColorDownloadSTD + ";font-size: " + iconSize + ";\" /></a>");
                $(this).hide();
            } else if (getType(picUrl) == 'STD') {
                $(this).hide();
            }

            if(isON('SSL') && getType(picUrl) == 'SSL') {
                container.append("&nbsp;<a href=" + details.attr('href') + " align=\"center\" class=\"index-ssl\" title=\"Szybko pobierz pozycję przez SSL\"><span class=\"fab fa-expeditedssl fa-fw\" style=\"color: " + iconColorDownloadSSL + ";font-size: " + iconSize + ";\" /></a>");
                $(this).hide();
            } else if (getType(picUrl) == 'SSL') {
                $(this).hide();
            }

            if(isON('CustomRSS') && getType(picUrl) == 'RSS') {
                var id = details.attr('onclick').replace('addid(', '').replace(');return false;','');
                var name = addslashes(details.parent().parent().children(':nth-child(2)').children('a').html().replace('<b>', '').replace('</b>', ''));
                container.append("&nbsp;<a class=\"customrss\" title=\"Dodaj do CustomRSS\" href=\"#\" data-id='"+id+"' data-name='"+name+"'><span class=\"fas fa-rss-square fa-fw\" style=\"color: " + iconColorCustomRSS + ";font-size: " + iconSize + ";\" /></a>");
                container.find('a.customrss').on('click',function() {
                    AddCustomRSS(id,name);
                });
                $(this).hide();
            } else if (getType(picUrl) == 'RSS') {
                $(this).hide();
            }

            if(isON('WL') && getType(picUrl) == 'RSS') {
                var observe = torrentTable.find('a[alt="Dodaj do obserwowanych"]');
                observe.html("&nbsp;<a class=\"watchlist\" title=\"Dodaj do obserwowanych\" href=\"#\" data-id='"+id+"' data-name='"+name+"'><span class=\"fas fa-eye fa-fw\" style=\"color: " + iconColorWatchList + ";font-size: " + iconSize/2 + ";\" /></a>");
                container.find('a.watchlist').on('click',function() {
                    AddWatchlist(id,name);
                });
            }

            if(isON('THX') && getType(picUrl) == 'RSS') {
                container.append("&nbsp;<a class=\"thanks\" title=\"Podziękuj za pozycję\" href=\"#\" data-id='"+id+"' data-name='"+name+"'><span class=\"fas fa-thumbs-up fa-fw\" style=\"color: " + iconColorThanks + ";font-size: " + iconSize + ";\" /></a>");
                container.find('a.thanks').on('click',function() {
                    AddThanks(id,name);
                });
            }

            // FIX 'Download in progress', 'Download done' background icon
            if(container.attr('style') == "background-image: url(pic/downdone.png); background-size: 100% 100%;") {
                container.attr('style', "background-image: url(pic/downdone.png); background-size: auto 100%; background-repeat: no-repeat; background-position: center;");
            }
            if(container.attr('style') == "background-image: url(pic/loading2.gif); background-size: 100% 100%;") {
                container.attr('style', "background-image: url(pic/loading2.gif); background-size: auto 100%; background-repeat: no-repeat; background-position: center;");
            }
        });
    });

/*
TODO:
    function FakeNewsRead() {
        $.ajax({
            type: 'GET',
            url: 'index.php',
            data: 'news=1',
            success: function(pageData) {
                window.location = 'browse.php';
            }
        });
        return false;
    }
    var $fakeNewsLink = $('a.altlink[href="index.php"]');
    $fakeNewsLink.parent().append('<br /><br /><a href="#" id="fakenews" style="font-size: 3em; color: blue;">Kliknij tutaj aby oznaczyć te wszystkie "ważne" ogłoszenia jako przeczytane.</a>');
    $fakeNewsLink.parent().find('a#fakenews').on('click',function() {
        FakeNewsRead();
    });
*/
})();