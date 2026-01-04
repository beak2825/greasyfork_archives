// ==UserScript==
// @name           TorrentLeech-Extra
// @version        1.0.1
// @author         Jerry1333 (based on script by Upgreydd)
// @namespace      https://greasyfork.org/users/4704
// @description    Rozbudowuje możliwości strony o kilka dodatków. Szczegóły w opisie.
// @license        Beerware
// @match          http*://*torrentleech.pl/browse.php*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require        https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@43fd0fe4de1166f343883511e53546e87840aeaf/gm_config.js
// @require        https://greasyfork.org/scripts/381016-timeago/code/TimeAgo.js
// @require        https://greasyfork.org/scripts/381017-timeago-locales-js/code/TimeAgoLocalesjs.js
// @icon           https://www.google.com/s2/favicons?sz=64&domain=torrentleech.pl
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @grant          GM_notification
// @downloadURL https://update.greasyfork.org/scripts/433925/TorrentLeech-Extra.user.js
// @updateURL https://update.greasyfork.org/scripts/433925/TorrentLeech-Extra.meta.js
// ==/UserScript==

/* globals $, GM_config, timeago */

(function() {
    'use strict';
    GM_config.init({
        'id': 'TL',
        'title': 'KONFIGURACJA ' + GM_info.script.name + ' ' + GM_info.script.version,
        'fields':
        {
            // TORRENT TABLE MODULES
            'M_DATE_FORMAT':
            {
                'label': 'Zmień format czasu w kolumnie "Dodano"',
                'type': 'radio',
                'section': ['Tabela torrentów'],
                'title': 'Zmienia format daty dodania torrenta z "2021-10-07 17:39:42" na "5 minut temu"',
                'options': ['ON','OFF'],
                'default': 'OFF'
            },
            'M_HTTP':
            {
                'label': 'Pokazuj ikonę pobierania (tracker HTTP)',
                'type': 'radio',
                'options': ['ON', 'OFF'],
                'default': 'ON'
            },
            'M_HTTPS':
            {
                'label': 'Pokazuj ikonę pobierania (tracker HTTPS)',
                'type': 'radio',
                'options': ['ON', 'OFF'],
                'default': 'ON'
            },
            'M_THX':
            {
                'label': 'Pokazuj ikonę podziękowania za pozycję',
                'type': 'radio',
                'options': ['ON', 'OFF'],
                'default': 'OFF'
            },
            'M_ODD_ROW_COLOR':
            {
                'label': 'Czy nieparzyste wiersze mają mieć inny kolor?',
                'type': 'radio',
                'title': 'Nieparzyste wiersze w innym kolorze niż parzyste. Kolor można określić w parametrach tabeli torrentów poniżej.',
                'options': ['ON', 'OFF'],
                'default': 'OFF'
            },
            'M_FREE_ROW_COLOR':
            {
                'label': 'Czy wiersze pozycji FREE mają być wyróżnione kolorem?',
                'type': 'radio',
                'title': 'Pozycje free zostaną wyróżnione kolorem.Kolor można określić w parametrach tabeli torrentów poniżej.',
                'options': ['ON', 'OFF'],
                'default': 'ON'
            },
            // SEARCH MODULES
            'M_SEARCH':
            {
                'label': 'Czy zmienić wyszukiwarkę na czytelniejszą?',
                'section': ['Wyszukiwarka'],
                'type': 'radio',
                'options': ['ON', 'OFF'],
                'default': 'OFF'
            },
            'M_SEARCH_FOCUS':
            {
                'label': 'Autofocus wyszukiwarki',
                'type': 'radio',
                'title': 'Czy po wejściu na stronę automatycznie ustawiać kursor w polu wyszukiwarki?',
                'options': ['ON', 'OFF'],
                'default': 'OFF'
            },
            'M_CHECK_ALL':
            {
                'label': 'Czy pokazać przycisk zaznaczania/odznaczania wszystich kategorii?',
                'type': 'radio',
                'options': ['ON', 'OFF'],
                'default': 'OFF'
            },
            // TORRENT TABLE SETTINGS
            'colorRowOdd':
            {
                'label': 'Kolor wierszy nieparzystych',
                'type': 'text',
                'section': ['Ustawienia tabeli torrentów'],
                'title': 'Kolor w formacie akceptowanym przez CSS (np. #001122, white, rgb(255,255,255) itp.)',
                'size': 10,
                'default': '#e3e3e3'
            },
            'colorRowFree':
            {
                'label': 'Kolor wierszy FREE',
                'type': 'text',
                'title': 'Kolor w formacie akceptowanym przez CSS (np. #001122, white, rgb(255,255,255) itp.)',
                'size': 10,
                'default': '#c5dcb9'
            },
            'colorRowOddFree':
            {
                'label': 'Kolor wierszy nieparzystych FREE',
                'type': 'text',
                'title': 'Kolor w formacie akceptowanym przez CSS (np. #001122, white, rgb(255,255,255) itp.)',
                'size': 10,
                'default': '#d2dfcc'
            },
            'colorIconDownloadHTTPS':
            {
                'label': 'Kolor ikony pobierania torrenta (tracker https)',
                'type': 'text',
                'title': 'Kolor w formacie akceptowanym przez CSS (np. #001122, white, rgb(255,255,255) itp.)',
                'size': 10,
                'default': '#4e9a06'
            },
            'sizeIconDownloadHTTPS':
            {
                'label': 'Rozmiar ikony pobierania torrenta (tracker https)',
                'type': 'text',
                'title': 'Rozmiar ikon dodawanych przez skrypt. Przyjmuje wartości atrybutu CSS font-size (np. 1.3em, 24px itp.)',
                'size': 5,
                'default': '20px'
            },
            'colorIconDownloadHTTP':
            {
                'label': 'Kolor ikony pobierania torrenta (tracker http)',
                'type': 'text',
                'title': 'Kolor w formacie akceptowanym przez CSS (np. #001122, white, rgb(255,255,255) itp.)',
                'size': 10,
                'default': '#333333'
            },
            'sizeIconDownloadHTTP':
            {
                'label': 'Rozmiar ikony pobierania torrenta (tracker http)',
                'type': 'text',
                'title': 'Rozmiar ikon dodawanych przez skrypt. Przyjmuje wartości atrybutu CSS font-size (np. 1.3em, 24px itp.)',
                'size': 5,
                'default': '20px'
            },
            'colorIconThanks':
            {
                'label': 'Kolor ikony podziękowania za pozycję',
                'type': 'text',
                'title': 'Kolor w formacie akceptowanym przez CSS (np. #001122, white, rgb(255,255,255) itp.)',
                'size': 10,
                'default': '#0055a4'
            },
            'sizeIconThanks':
            {
                'label': 'Rozmiar ikony podziękowania za pozycję',
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
            // SEARCH SETTINGS
            'colorIconSeed':
            {
                'label': 'Kolor ikony "Torrenty potrzebujące seeda"',
                'type': 'text',
                'section': ['Ustawienia wyszukiwarki'],
                'title': 'Kolor w formacie akceptowanym przez CSS (np. #001122, white, rgb(255,255,255) itp.)',
                'size': 10,
                'default': '#5d3b05'
            },
            'sizeIconSeed':
            {
                'label': 'Rozmiar ikony Torrenty potrzebujące seeda',
                'type': 'text',
                'title': 'Rozmiar ikon dodawanych przez skrypt. Przyjmuje wartości atrybutu CSS font-size (np. 1.3em, 24px itp.)',
                'size': 5,
                'default': '20px'
            },
            'colorIconRefresh':
            {
                'label': 'Kolor ikony "Aktualizuj czas przeglądania"',
                'type': 'text',
                'title': 'Kolor w formacie akceptowanym przez CSS (np. #001122, white, rgb(255,255,255) itp.)',
                'size': 10,
                'default': '#800000'
            },
            'sizeIconRefresh':
            {
                'label': 'Rozmiar ikony Aktualizuj czas przeglądania',
                'type': 'text',
                'title': 'Rozmiar ikon dodawanych przez skrypt. Przyjmuje wartości atrybutu CSS font-size (np. 1.3em, 24px itp.)',
                'size': 5,
                'default': '20px'
            },
            'colorIconSearch':
            {
                'label': 'Kolor ikony "Wyszukaj"',
                'type': 'text',
                'title': 'Kolor w formacie akceptowanym przez CSS (np. #001122, white, rgb(255,255,255) itp.)',
                'size': 10,
                'default': 'white'
            },
            'sizeIconSearch':
            {
                'label': 'Rozmiar ikony Wyszukaj',
                'type': 'text',
                'title': 'Rozmiar ikon dodawanych przez skrypt. Przyjmuje wartości atrybutu CSS font-size (np. 1.3em, 24px itp.)',
                'size': 5,
                'default': '20px'
            },
            'colorIconCheckAll':
            {
                'label': 'Kolor ikony "Wyszukaj"',
                'type': 'text',
                'title': 'Kolor w formacie akceptowanym przez CSS (np. #001122, white, rgb(255,255,255) itp.)',
                'size': 10,
                'default': 'white'
            },
            'sizeIconCheckAll':
            {
                'label': 'Rozmiar ikony Wyszukaj',
                'type': 'text',
                'title': 'Rozmiar ikon dodawanych przez skrypt. Przyjmuje wartości atrybutu CSS font-size (np. 1.3em, 24px itp.)',
                'size': 5,
                'default': '20px'
            },
            'catRetainsSearchText':
            {
                'label': 'Czy wyszukiwarka ma zachowywać szukaną frazę przy zmianie kategorii?',
                'type': 'checkbox',
                'title': 'Zdecuduj czy wyszukiwarka ma zachowywać frazę którą wpisałeś kiedy klikniesz na nazwę kategorii',
                'default': false
            }
        },
        'css' : '#TL .section_header_holder {display: inline-grid;min-width: 420px;padding-right: 50px;} #TL .section_header { margin: 5px 0!important;} #TL .radio_label { vertical-align: bottom; }',
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

    function isOdd(index) {
        if (index % 2 == 1) {
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

    function addThanks(id, name) {
        if (id === undefined) {
            alertN('Torrent id error');
            return false;
        }
        var dataString = 'torrentid=' + id;
        var text = 'Podziękowano za torrent ' + name + '!';
        $.ajax({
            type: "POST",
            url: "thanks.php",
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

    $('head').append('<style type="text/css">th.colhead:nth-child(n+1){border: solid 1px #000;}th.colhead{font-weight: bold;color: #fff;background-color: #222227;font-size:smaller;}.searchBoxContainer{margin-bottom: 6px;}</style>');

    GM_registerMenuCommand('Konfiguracja', openConfig);

    // TORRENT TABLE SETTINGS
    var colorRowOdd = GM_config.get('colorRowOdd');
    var colorRowFree = GM_config.get('colorRowFree');
    var colorRowOddFree = GM_config.get('colorRowOddFree');
    var colorIconDownloadHTTPS = GM_config.get('colorIconDownloadHTTPS');
    var sizeIconDownloadHTTPS = GM_config.get('sizeIconDownloadHTTPS');
    var colorIconDownloadHTTP = GM_config.get('colorIconDownloadHTTP');
    var sizeIconDownloadHTTP = GM_config.get('sizeIconDownloadHTTP');
    var colorIconThanks = GM_config.get('colorIconThanks');
    var sizeIconThanks = GM_config.get('sizeIconThanks');
    var notification = GM_config.get('notification');
    // SEARCH SETTINGS
    var colorIconSeed = GM_config.get('colorIconSeed');
    var sizeIconSeed = GM_config.get('sizeIconSeed');
    var colorIconRefresh = GM_config.get('colorIconRefresh');
    var sizeIconRefresh = GM_config.get('sizeIconRefresh');
    var colorIconSearch = GM_config.get('colorIconSearch');
    var sizeIconSearch = GM_config.get('sizeIconSearch');
    var colorIconCheckAll = GM_config.get('colorIconCheckAll');
    var sizeIconCheckAll = GM_config.get('sizeIconCheckAll');
    var catRetainsSearchText = GM_config.get('catRetainsSearchText');

    var torrentTable = $("body > table.mainouter > tbody > tr:nth-child(2) > td > table:nth-child(9)");
    var searchForm = $('form').first();
    var searchBox = $('input[name=search]');
    var searchBtn = $('input.btn');
    var searchFilter = $('body > table.mainouter > tbody > tr:nth-child(2) > td > form > table > tbody > tr');

    // BEGIN M_SEARCH
    if (isON('M_SEARCH')) {
        searchForm.prepend(searchBox);
        searchBox.attr('style',"width:65%;min-width:300px;max-width:800px;background-color:white;color:black;border-radius:5px;border-color:black;font-size:1.8em;padding:5px;text-align:center;");
        searchBox.attr('placeholder','Wpisz szukaną frazę ...');
        searchBox.attr('id','searchBox');
        searchBox.addClass('clearable');
        searchBox.wrap('<div class="searchBoxContainer"></div>');
        var searchBoxContainer = $('div.searchBoxContainer');
        searchBoxContainer.append(searchBtn);
        searchBtn.remove();

        searchBoxContainer.append('<span id="bSearch" title="Rozpocznij wyszukiwanie" class="fas fa-search" style="margin: 5px;cursor: pointer;color:' + colorIconSearch + ';font-size: ' + sizeIconSearch + ';"></span>');
        searchBtn = searchForm.find('#bSearch');
        searchBtn.on('click', function() { searchForm.submit(); });

        searchBoxContainer.prepend('<span id="bSeed" title="Torrenty potrzebujące seeda" class="fas fa-skull" style="margin: 5px;cursor: pointer;color:' + colorIconSeed + ';font-size: ' + sizeIconSeed + ';"></span>');
        searchForm.find('#bSeed').on('click', function() { window.location = 'browse.php?incldead=2&sort=8&type=desc'; });

        searchBoxContainer.prepend('<span id="bRefresh" title="Odśwież listę torrentów" class="fas fa-sync-alt" style="margin: 5px;cursor: pointer;color:' + colorIconRefresh + ';font-size: ' + sizeIconRefresh + ';"></span>');
        searchForm.find('#bRefresh').on('click', function() { location.reload(); });

        // CLEAN SEARCHBOX BUTTON
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
    }
    // END M_SEARCH

    // BEGIN M_CHECK_ALL
    if (isON('M_CHECK_ALL')) {
        searchFilter.prepend('<td class="checkAll"><span id="check" chk=1 class="far fa-check-square" style="margin: 5px;cursor: pointer;color: '+colorIconCheckAll+';font-size: ' + sizeIconCheckAll + ';"></span></td>');
        var checkall = searchFilter.find('#check');
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
    }
    // END M_CHECK_ALL

    // BEGIN M_CAT_RETAINS_SEARCH_TEXT
    if(catRetainsSearchText) {
        $('a.catlink').each(function() {
            var searchTerm = $('#searchBox').attr('value');
            if(searchTerm !== '') {
                var url = $(this).attr('href')+'&search='+searchTerm;
                $(this).attr('href', url);
            }
        });
    }
    // END M_CAT_RETAINS_SEARCH_TEXT

    // BEGIN M_SEARCH_FOCUS
    if (!isON('M_SEARCH_FOCUS')) {
        $('#bSearch').focus();
    } else {
        $('input[name="search"]').focus();
    }
    // END M_SEARCH_FOCUS

    var torrentTableHeader = torrentTable.find('tr:first').remove();
    torrentTableHeader.find('td:nth-child(7)').contents().wrapAll('<div>');
    torrentTableHeader.find('td').contents().unwrap('td').wrap('<th>');
    torrentTableHeader.find('th').each(function() { $(this).addClass('colhead'); });
    torrentTableHeader.find('th:nth-child(7) div').contents().unwrap();
    torrentTable.prepend($('<thead></thead>').append(torrentTableHeader));

    torrentTable.find('tbody>tr').each(function(index) {
        var torrentRow = $(this);
        torrentRow.attr('data-free', torrentRow.hasClass("darmowy"));

        torrentRow.find('a[href^="details.php"]:first').each(function() {
            var torrentDetails = $(this);
            torrentRow.attr('data-id', torrentDetails.attr('href').replace('details.php?id=','').replace('&hit=1',''));
            torrentRow.attr('data-name', torrentDetails.text());
        });

        // BEGIN M_FREE_ROW_COLOR
        if (isON('M_FREE_ROW_COLOR')) {
            if (torrentRow.attr('data-free')=="true") {
                $(this).css("background-color", colorRowFree);
            }
        } else {
            if (torrentRow.attr('data-free')=="true") {
                $(this).css("background-color", '');
                $(this).removeClass('darmowy');
                $(this).attr('data-free',false);
            }
        }
        // END M_FREE_ROW_COLOR

        // BEGIN M_ODD_ROW_COLOR
        if (isON('M_ODD_ROW_COLOR')) {
            if(isOdd(index)) {
                if ($(this).attr('data-free') == "true") {
                    $(this).css("background-color", colorRowOddFree);
                } else {
                    $(this).css("background-color", colorRowOdd);
                }
            }
        }
        // END M_ODD_ROW_COLOR

        // BEGIN M_DATE_FORMAT
        if (isON('M_DATE_FORMAT')) {
            var dateContainer = torrentRow.children('td:nth-child(4)');
            var date = dateContainer.children();
            if (date !== undefined) {
                var positionStringDate = date.html().replace('<br>', 'T');
                var positionDate = new Date(positionStringDate);
                var newDateString = '<span title="' + date.html().replace('<br>', ' ') + '">' + timeDiff(positionDate) + '</span>';
                date.remove();
                dateContainer.html(newDateString);
            }
        }
        // END M_DATE_FORMAT

        torrentRow.find('a[href^="download.php"]').each(function() {
            var torrentLink = $(this);
            var torrentLinkContainer = torrentLink.parent();
            torrentLinkContainer.find('br').remove();

            // BEGIN M_HTTP
            if(isON('M_HTTP')) {
                torrentLinkContainer.append("&nbsp;<a href=" + torrentLink.attr('href').replace('?ssl=1','') + " align=\"center\" class=\"index-std\" title=\"Szybko pobierz pozycję\"><span class=\"fas fa-download fa-fw\" style=\"color: " + colorIconDownloadHTTP + ";font-size: " + sizeIconDownloadHTTP + ";\" /></a>");
                $(this).remove();
            } else {
                $(this).remove();
            }
            // END M_HTTP

            // BEGIN M_HTTPS
            if(isON('M_HTTPS')) {
                torrentLinkContainer.append("&nbsp;<a href=" + torrentLink.attr('href') + " align=\"center\" class=\"index-ssl\" title=\"Szybko pobierz pozycję przez SSL\"><span class=\"fab fa-expeditedssl fa-fw\" style=\"color: " + colorIconDownloadHTTPS + ";font-size: " + sizeIconDownloadHTTPS + ";\" /></a>");
            }
            // END M_HTTPS

            // BEGIN M_THX
            if(isON('M_THX')) {
                torrentLinkContainer.append("&nbsp;<a class=\"thanks\" title=\"Podziękuj za pozycję\" href=\"#\" data-id='"+torrentRow.attr('data-id')+"' data-name='"+torrentRow.attr('data-name')+"'><span class=\"fas fa-thumbs-up fa-fw\" style=\"color: " + colorIconThanks + ";font-size: " + sizeIconThanks + ";\" /></a>");
                torrentLinkContainer.find('a.thanks').on('click',function() {
                    addThanks(torrentRow.attr('data-id'),torrentRow.attr('data-name'));
                });
            }
            // END M_THX

            // RE-ADD SNACHES LINK
            torrentLinkContainer.find('a[href^="viewsnatches.php"]').prepend('<br/>').appendTo(torrentLinkContainer);
        });
    });
})();