// ==UserScript==
// @name         Export DRA controls
// @namespace    https://ingthemis.service-now.com/
// @version      1.0
// @description  Export DRA controls.
// @author       angelo.ndira@gmail.com
// @match        http://localhost:8080/dra_controls.html
// @grant        none
// @require      http://code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/421774/Export%20DRA%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/421774/Export%20DRA%20controls.meta.js
// ==/UserScript==

// console.print: console.log without filename/line number
console.print = function (...args) {
    queueMicrotask (console.log.bind (console, ...args));
}

function sanitize(obj) {
    if (typeof obj === 'undefined') {
        obj = 'N/A';
    }
    var str = String(obj);
    str = str.replace(/(\r\n|\n|\r)/gm, "");
    str = str.replace(/(â€¦)/gm, "");
    return str;
}

function readColumnAnchorData(columnNode) {
    var record = "";
    columnNode.find('span > a').each(function () {
        var anchorNode = $(this);
        record = "anchor.|" + sanitize(anchorNode.text()) + ".|" + record;
    });
    return record;
}

function readColumnSpanData(columnNode) {
    var record = "";
    columnNode.find('span > span').each(function () {
        var spanNode = $(this);

        record = "full-text-descripption.|" + sanitize(spanNode.text()) + ".|title.|" + sanitize(spanNode.attr("title")) + ".|original-title.|" + sanitize(spanNode.attr("data-original-title"))+".|.";

    });
    return record;
}

function readRows(rowNode) {
    'use strict';
    var record = "";
    var amount_set = false;
    rowNode.find('td').each(function () {
        var columnNode = $(this);
        record = record + readColumnAnchorData(columnNode);
        record = record + readColumnSpanData(columnNode);
    });
    console.print(record);
}

function start() {
    'use strict';
    console.clear();

    $(document).find('body > table > tbody > tr').each(function () {
        var rowNode = $(this);
        readRows(rowNode);
    });
    //setTimeout(start, 10000);
}

(function () {
    'use strict';
    console.log("document loaded(). Export controls will start in 3 seconds");
    setTimeout(start, 3000);
})();