// ==UserScript==
// @name         [Torrentkitty] Torrent Kitty Content Size Get
// @namespace    https://boblee.cn
// @version      1.0
// @description  Get real size of the torrents with out page jumps.
// @author       Bob Lee
// @match        *://www.torrentkitty.tv/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407378/%5BTorrentkitty%5D%20Torrent%20Kitty%20Content%20Size%20Get.user.js
// @updateURL https://update.greasyfork.org/scripts/407378/%5BTorrentkitty%5D%20Torrent%20Kitty%20Content%20Size%20Get.meta.js
// ==/UserScript==

(window.οnlοad = function() {
    'use strict';

    window.getRealSize = function (rawSize) {
        var parsedSize = rawSize.split(' ')[0];
        var parsedFormat = rawSize.split(' ')[1];
        if (parsedSize.indexOf(',') != -1) {
            parsedSize = parsedSize.replace(',', '');
        }
        if (parsedFormat == "KB") {
            parsedSize *= 1024;
        } else if (parsedFormat == "MB") {
            parsedSize *= 1024 * 1024;
        } else if (parsedFormat == "GB") {
            parsedSize *= 1024 * 1024 * 1024;
        } else if (parsedFormat == "TB") {
            parsedSize *= 1024 * 1024 * 1024 * 1024;
        } else {
            return -1;
        }
        return parsedSize;
    }

    window.downThisTr = function (r0) {
        var table = $("table#archiveResult").children().children();
        $(r0).insertAfter($(table[table.length-1]));
    }

    window.switchover = function (r0, r1, r2) {
        // $(r1).fadeOut().fadeIn();
        $(r1).insertAfter($(r2));
        // $(r2).fadeOut().fadeIn();
        $(r2).insertAfter($(r0));

    }

    window.bubble = function () {
        var table = $("table#archiveResult").children().children();
        for (var i = 1; i < table.length; i++) {
            for (var j = 1; j < table.length - i; j++) {
                table = $("table#archiveResult").children().children();

                var res_j = getRealSize(table[j].cells[1].innerText);
                var res_j_1 = getRealSize(table[j+1].cells[1].innerText);
                if (res_j == -1) {
                    downThisTr(table[j]);
                    continue;
                }
                if (res_j_1 == -1) {
                    if (j+1 != table.length-1) {
                        downThisTr(table[j+1]);
                    }
                    continue;
                }
                if (res_j < res_j_1) {
                    table = $("table#archiveResult").children().children();
                    switchover(table[j-1], table[j], table[j+1]);
                }
            }
        }
    }

    window.topThisId = function (bob_tr_id) {
        var tr = document.getElementById(bob_tr_id);
        $(tr).fadeOut().fadeIn();
        $(tr).insertAfter($(tableHeader));
    }

    window.getSize = function (id, url) {
        $.ajax({
            url: "https://www.torrentkitty.tv" + url,
            type: "GET",
            beforeSend: function () {
                var target = document.getElementById('bob_td_' + id);
                target.innerText = "loading...";
            },
            success: function(res){
                var td_id = 'bob_td_' + id;
                var target = document.getElementById(td_id);
                var rawSize = ($(res).filter('div#main').children().filter('div.wrapper').children().filter('table.detailSummary').children().children().children()[7].innerText);
                var realSize = getRealSize(rawSize);
                if (realSize == -1) {
                    rawSize = -1;
                }
                if (target == null) {

                } else {
                    target.innerText = rawSize;
                }
                bubble();
            }
        })
    }

    window.getSizeAll = function () {
        for (var i = 1; i < table.length; i++) {
            window.getSize(i, urlList[i]);
        }
    }

    var maxSize = 0;
    var urlList = new Array();
    var table = $("table#archiveResult").children().children();
    var tableHeader = table[0];

    table[0].cells[1].innerHTML = '<th class="size"><a onclick=\'window.getSizeAll()\'>Get All Content Size</a></th>';
    for (var i = 1; i < table.length; i++) {
        table[i].id = 'bob_tr_' + i;
        var tmpUrl = table[i].cells[3].innerHTML.split('"')[1];
        urlList[i] = tmpUrl;
        table[i].cells[1].innerHTML = "<a id='bob_td_" + i + "' onclick='window.getSize(\"" + i + '", "' + tmpUrl + "\")'>Get</a>";
    }

    (window.οnlοad = function() { window.getSizeAll() })(); // After web page loaded
})();


