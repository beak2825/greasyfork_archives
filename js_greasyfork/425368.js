// ==UserScript==
// @name         hdb_show_discount_color
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  help auto-feed support hdb-discount
// @author       tomorrow505
// @match        https://greasyfork.org/zh-CN/script_versions/new
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// ==/UserScript==

var css = [
    ".tablesorter-default .header,",
    ".tablesorter-default .tablesorter-header {",
    "    padding: 4px 20px 4px 4px;",
    "    cursor: pointer;",
    "    background-image: url(data:image/gif;base64,R0lGODlhFQAJAIAAAP///////yH5BAEAAAEALAAAAAAVAAkAAAIXjI+AywnaYnhUMoqt3gZXPmVg94yJVQAAOw==);",
    "    background-position: center right;",
    "    background-repeat: no-repeat;",
    "}",
    ".tablesorter-default thead .headerSortUp,",
    ".tablesorter-default thead .tablesorter-headerSortUp,",
    ".tablesorter-default thead .tablesorter-headerAsc {",
    "    background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAAP///////yH5BAEAAAEALAAAAAAVAAQAAAINjI8Bya2wnINUMopZAQA7);",
    "    border-bottom: #888 1px solid;",
    "}",
    ".tablesorter-default thead .headerSortDown,",
    ".tablesorter-default thead .tablesorter-headerSortDown,",
    ".tablesorter-default thead .tablesorter-headerDesc {",
    "    background-image: url(data:image/gif;base64,R0lGODlhFQAEAIAAAP///////yH5BAEAAAEALAAAAAAVAAQAAAINjB+gC+jP2ptn0WskLQA7);",
    "    border-bottom: #888 1px solid;",
    "}",
    ".tablesorter-default thead .sorter-false {",
    "    background-image: none;",
    "    cursor: default;",
    "    padding: 4px;",
    "}",
    ".disc-100, .disc-50, .disc-25, .disc-neu {",
    "    font-weight: bold;",
    "}",
    ".disc-100 {",
    "    color: #009;",
    "}",
    ".disc-50 {",
    "    color: darkgreen;",
    "}",
    ".disc-25 {",
    "    color: darkred;    ",
    "}",
    ".disc-neu {",
    "    color: #666;       ",
    "}"
].join("\n");


if (typeof GM_addStyle != 'undefined') {
    GM_addStyle(css);
} else if (typeof PRO_addStyle != 'undefined') {
    PRO_addStyle(css);
} else if (typeof addStyle != 'undefined') {
    addStyle(css);
} else {
     var node = document.createElement('style');
     node.type = 'text/css';
     node.appendChild(document.createTextNode(css));
     var heads = document.getElementsByTagName('head');
    if (heads.length > 0) {
        heads[0].appendChild(node);
    } else {
        document.documentElement.appendChild(node);
    }
}


this.$ = this.jQuery = jQuery.noConflict(true);

$('#torrent-list > thead > tr > th:eq(1)').after('<th class="center">FL</th>');

$('#torrent-list > tbody > tr > td:nth-child(3)').each(function(){
    var discount = $(this).find('a').attr('title').split(' ')[0];
    switch(discount) {
        case '100%':
            $(this).after('<td class="disc-100 center">100%</td>');
            if (extra_settings.hdb_show_discount_color.enable) {
                $(this).parent().css('background','linear-gradient(rgba(0,0,153,0.2), rgba(188,202,214,0.5), rgba(0,0,153,0.2))');
            }
            break;
        case '50%':
            $(this).after('<td class="disc-50 center">50%</td>');
            if (extra_settings.hdb_show_discount_color.enable) {
                $(this).parent().css('background','linear-gradient(rgba(0,153,0,0.2), rgba(188,202,214,0.5), rgba(0,153,0,0.2))');
            }
            break;
        case '25%':
            $(this).after('<td class="disc-25 center">25%</td>');
            if (extra_settings.hdb_show_discount_color.enable) {
                $(this).parent().css('background','linear-gradient(rgba(153,0,0,0.2), rgba(188,202,214,0.5), rgba(153,0,0,0.2))');
            }
            break;
        case 'Neutral':
            $(this).after('<td class="disc-neu center">NEU</td>');
            if (extra_settings.hdb_show_discount_color.enable) {
                $(this).parent().css('background','linear-gradient(rgba(102,102,102,0.4), rgba(188,202,214,0.5), rgba(102,102,102,0.4))');
            }
            break;
        case 'All':
            $(this).after('<td class="center">—</td>');
            break;
    }
});

$.tablesorter.addParser({
    id: 'duration',
    is: function() {
        return false;
    },
    format: function(s, table) {
        var i, time,
            c = table.config,
            t = '',
            duration = '',
            len = c.durationLength || 3,
            str = new Array(len + 1).join('0'),
            labels = (c.durationLabels || '(?:months|month),(?:days|day),(?:hours|hour)').split(/\s*,\s*/),
            llen = labels.length;
        // build regex
        if (!c.durationRegex) {
            for (i = 0; i < llen; i++) {
                t += '(?:(\\d+)\\s*' + labels[i] + '\\s*)?';
            }
            c.durationRegex = new RegExp(t, 'i');
        }
        // remove commas from value
        time = ( c.usNumberFormat ? s.replace(/,/g, '') : s.replace( /(\d)(?:\.|\s*)(\d)/g, '$1$2') ).match(c.durationRegex);
        for (i = 1; i < llen + 1; i++) {
            duration += ( str + ( time[i] || 0 ) ).slice(-len);
        }
        return duration;
    },
    type: 'text'
});

$.tablesorter.addParser({
    id: 'size',
    is: function() {
        return false;
    },
    format: function(s, table) {
        var i, time,
            c = table.config,
            t = '',
            size = '',
            len = c.sizeLength || 5,
            str = new Array(len + 1).join('0'),
            labels = (c.sizeLabels || '(?:TiB),(?:GiB),(?:MiB)').split(/\s*,\s*/),
            llen = labels.length;
        // build regex
        if (!c.sizeRegex) {
            for (i = 0; i < llen; i++) {
                t += '(?:(\\d+)\\s*' + labels[i] + '\\s*)?';
            }
            c.sizeRegex = new RegExp(t, 'i');
        }
        // remove dots from value
        time = ( c.usNumberFormat ? s.replace(/\./g, '') : s.replace( /(\d)(?:\.|\s*)(\d)/g, '$1$2') ).match(c.sizeRegex);
        for (i = 1; i < llen + 1; i++) {
            size += ( str + ( time[i] || 0 ) ).slice(-len);
        }
        return size;
    },
    type: 'text'
});

$("#torrent-list").tablesorter({
    headers: {
        0: { parser: false },
        1: { sorter: 'text' },
        2: { sorter: 'digit', string: 'min', sortInitialOrder: 'desc' },
        3: { sorter: 'digit', sortInitialOrder: 'desc' },
        4: { sorter: 'duration'},
        5: { sorter: 'size', sortInitialOrder: 'desc' },
        6: { sorter: 'digit', sortInitialOrder: 'desc' },
        7: { sorter: 'digit', sortInitialOrder: 'desc' },
        8: { sorter: 'digit', sortInitialOrder: 'desc' }
    },
});