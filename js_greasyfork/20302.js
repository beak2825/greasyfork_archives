// ==UserScript==
// @name         What.CD Hide Transcode Format
// @namespace    http://www.what.cd
// @version      0.2
// @description  Selectively hide V2/V0/320 from better.php
// @author       SIGTERM86
// @include      http*://*what.cd/better.php?method=transcode*
// @include      http*://*what.cd/better.php?method=snatch*
// @include      http*://*what.cd/better.php?method=upload*
// @require      https://code.jquery.com/jquery-latest.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/20302/WhatCD%20Hide%20Transcode%20Format.user.js
// @updateURL https://update.greasyfork.org/scripts/20302/WhatCD%20Hide%20Transcode%20Format.meta.js
// ==/UserScript==

var colNames = [
    'Torrent',
    'V2',
    'V0',
    '320'
];

var colShown = [
    true,
    GM_getValue('V2', true),
    GM_getValue('V0', true),
    GM_getValue('320', true)
];

function createButton(format, col) {
    var btn = document.createElement('input');
    btn.type = 'button';
    btn.value = format;
    btn.onclick = function () {
        showCol(col, btn, !colShown[col]);
        hideEmptyRows();
    };
    document.getElementById('formats').appendChild(btn);
    return btn;
}

function showCol(col, btn, visible) {
    colShown[col] = visible;
    GM_setValue(colNames[col], visible);
    btn.style.color = visible ? "white" : "red";
    $('.torrent_table').find('tr td:nth-child('+(col+1)+')').toggle(colShown[col]);
}

function hideEmptyRows() {
    $.each($('.torrent_table tr:not(:first-child)'),function(i, row){
        var count = 0;
        $.each($(row).find('td'), function(j, col) {
            if ($(col).find('.important_text').length && colShown[j]) {
                count++;
            }
        });
        $(row).toggle(count!==0);
    });
}

(function() {
    'use strict';
    $('<h3>Formats</h3><div id="formats" class="box"></div>').insertAfter('div.box.pad, form[name=transcodes]');
    for (var i=1; i<colNames.length; i++) {
        var btn = createButton(colNames[i], i);
        showCol(i, btn, colShown[i]);
    }
    hideEmptyRows();
})();