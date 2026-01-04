// ==UserScript==
// @name         PTP Archive Better Tables
// @namespace    PTP
// @description  Sort, search, export archive tables.
// @version      3
// @license      MIT
// @match        https://*.passthepopcorn.me/archive.php*
// @require      https://cdn.datatables.net/2.1.5/js/dataTables.min.js#sha256=6679e1b3bba8dc324b825ac63569181812c412a4d8c0ca8aa572144c05c429d5
// @require      https://cdn.datatables.net/buttons/3.1.2/js/dataTables.buttons.min.js#sha256=b29e3b1d6d3b7e21bb0bf2cf55418c12f78295198b8c8b1c32901693de9c0eeb
// @require      https://cdn.datatables.net/buttons/3.1.2/js/buttons.html5.min.js#sha256=d767592074523cdf61d4b5fccae85eca7f923c3cabe8558276b37348945de5c7
// @require      https://cdn.datatables.net/fixedheader/4.0.1/js/dataTables.fixedHeader.min.js#sha256=44e6ce853ea3fc5dcb2a049c1b39fd683d6795bee4cd692bf267ba47c6fca2b6
// @require      https://cdn.datatables.net/plug-ins/2.1.5/sorting/file-size.min.js#sha256=6dad62fc6a3d378a55a768bc254693c0546254e7ceca6a9a0e7015081b3f3b1c
// @require      https://cdn.datatables.net/plug-ins/2.1.5/sorting/natural-time-delta.min.js#sha256=2e3af3bd7f848dcd587e7082c182b23ce0c14a68d9cc087ff68a1b233561cb14
// @resource     dtBaseCss         https://cdn.datatables.net/2.1.5/css/dataTables.dataTables.min.css#sha256=10587c5eacd75926baec92990840987da4a8fb66b91c8c43ac955e7b174f21b0
// @resource     dtButtonsCss      https://cdn.datatables.net/buttons/3.1.2/css/buttons.dataTables.min.css#sha256=72c6eb333a8a434bbd1618af76eaaeaf228ac0aa662a5cd7f4499c573146bd02
// @resource     dtFixedHeaderCss  https://cdn.datatables.net/fixedheader/4.0.1/css/fixedHeader.dataTables.min.css#sha256=7c845e9f48ba4ff27ffbc9f486a541461a327cf8b0cd661047920de886333473
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/498976/PTP%20Archive%20Better%20Tables.user.js
// @updateURL https://update.greasyfork.org/scripts/498976/PTP%20Archive%20Better%20Tables.meta.js
// ==/UserScript==

GM_addStyle(GM_getResourceText('dtBaseCss'));
GM_addStyle(GM_getResourceText('dtButtonsCss'));
GM_addStyle(GM_getResourceText('dtFixedHeaderCss'));

let columns, defs, tableSelector;

if (document.location.search.startsWith('?action=container')) {
    // Torrent list within a container.

    columns = [
        { name: 'torrent-name' },
        { name: 'torrent-status' },
        { name: 'size' },
        { name: 'remaining' },
        { name: 'downloaded' },
        { name: 'uploaded' },
        { name: 'seeders' },
        { name: 'leechers' },
    ];

    defs = [
        {
            targets: ['size:name', 'remaining:name', 'downloaded:name', 'uploaded:name'],
            type: 'file-size',
        },
    ];

    tableSelector = 'table:first';
} else {
    // Container list.

    columns = [
        { name: 'container-name' },
        { name: 'size' },
        { name: 'max-size' },
        { name: 'last-fetch' },
        { name: 'assigned' },
        { name: 'downloaded' },
        { name: 'stalled' },
        { name: 'leeching' },
        { name: 'snatched' },
        { name: 'seeding' },
        { name: 'abandoned' },
    ];

    defs = [
        {
            targets: ['size:name', 'max-size:name'],
            type: 'file-size',
        },
        {
            target: 'last-fetch:name',
            type: 'natural-time-delta',
        },
    ];

    tableSelector = 'table:nth-of-type(2)';
}

$(tableSelector).addClass('compact');

let table = new DataTable(tableSelector, {
    layout: {
        topStart: {
            buttons: ['copy', 'csv'],
        },
    },
    paging: false,
    fixedHeader: true,
    columns: columns,
    columnDefs: defs,
});
