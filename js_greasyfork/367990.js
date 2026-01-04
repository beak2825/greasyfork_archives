// ==UserScript==
// @name         ttmeiju
// @namespace    https://greasyfork.org/users/367986
// @version      0.1
// @description  try to copy download addresses!
// @author       OMG
// @match        http://www.ttmeiju.vip/meiju/*
// @require      https://unpkg.com/jquery/dist/jquery.min.js
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/367990/ttmeiju.user.js
// @updateURL https://update.greasyfork.org/scripts/367990/ttmeiju.meta.js
// ==/UserScript==

$(function() {
    'use strict';

    var seeds = null;

    var nameTd = $('.latesttable .Shead td:contains(名字)');
    nameTd.append('<input type="text" id="nameField" />');
    var downTd = nameTd.next();
    downTd.append('<span id="copyBt"><img src="/Application/Home/View/Public/static/images/bt.png" width="20px" /></span>');
    downTd.append('<span id="copyEd2k"><img src="/Application/Home/View/Public/static/images/ed2k.png" width="20px" /></span>');

    $('#nameField').on('input', function() {
        var filter = $(this).val();
        var seedList = $('#seedlist');
        seeds = seedList.find('tr:contains('+filter+')');
        seeds.show();
        seedList.find('tr:not(:contains('+filter+'))').hide();
    });

    function copyUrls(kw) {
        var urls = '';

        for (var i=0, len=seeds.length; i<len; i++) {
            var link = $(seeds[i]).find('[ectype="linklist"] [title^="'+kw+'"]');
            urls += link.attr("href") + "\n";
        }

        GM_setClipboard(urls);
    }

    $('#copyBt').click(function() {
        copyUrls("BT");
    });

    $('#copyEd2k').click(function() {
        copyUrls("ed2k");
    });
});