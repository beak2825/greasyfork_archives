// ==UserScript==
// @name        dig_game_keys
// @namespace    http://tampermonkey.net/
// @version      2025.03.05.1
// @description  dig game keys
// @author       jacky
// @license     MIT
// @include     http*://*dailyindiegame.com/superbundle_*
// @include     http*://*dailyindiegame.com/account_*
// @include     http://www.dailyindiegame.com/account_digstore.html
// @require     https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.4.0/jquery.min.js
// @connect     barter.vg
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       unsafeWindow
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/461497/dig_game_keys.user.js
// @updateURL https://update.greasyfork.org/scripts/461497/dig_game_keys.meta.js
// ==/UserScript==

GM_addStyle(".table{border:solid 1px;border-collapse:collapse !important;}");
GM_addStyle(".td{border:solid 1px;border-collapse:collapse;padding-left:5px;padding-right:5px;text-align:left;font-size:16px !important;}");
//GM_addStyle("div{font-family:simsun !important;}");

var m = /digstore/.exec(document.URL);
if (m){
    var a = $("a:not(.db)[href*='/app/'],[href*='/sub/'],[href*='-appid-']");
    a.each(function(){
        $(this).after('<form name="formsearch" method="post" target=_blank action="account_tradesXT.html"><input name="search" type="hidden" value="'+ $(this).text() +'"><input type="submit" name="button" value="SEARCH"></form>');
    });
}
else {
    /*
    m = /transactionhistory/.exec(document.URL);
    if (m){
        $('<div id="po"></div>').insertBefore('#TableKeys');
        var x = [];
        var y = [];
        $('#TableKeys tbody tr').each(function(){
            m = /\s+(\d+)\s*DIG\s*trade: (.*)/.exec($(this).text());
            if (m){
                if ($.inArray(m[2], x) < 0){
                    x.push(m[2]);
                    y[m[2]] = [];
                }
                y[m[2]].push(parseInt(m[1]));
            }
        });
        $.each(x, function(k,v){
            var p = 0;
            $.each(y[v], function(r,w){
                p += w;
            });
            $('#po').append(`<p>${v}&#9;${p}</p>`);
        });
    }
    */

    $('#form2 select').append('<option value="300">Games per page: 300</option>');
    $('<div><a class="DIG2-TitleOrange" id="bundle">BUNDLE</a></div>').insertBefore('#TableKeys');
    $('#bundle').after('<div><a class="DIG2-TitleOrange" id="single">SINGLE</a></div>');
    $('<div id="week"></div>').insertBefore('#TableKeys');
    $('<table class="table" id="keys"></table>').insertBefore('#TableKeys');

    var r = {};
    $('#TableKeys:first .DIG3_14_Gray').each(function(){
        var td = $(this).children('td');
        var num = $(td[0]).text();
        var bundle = $.trim($(td[1]).text());
        if (bundle==='Source')
            return;

        var b = '_';
        m = /DIG([A-Za-z ]+)Bundle (\d+)|([A-Z]+) ([A-Z]+) (\d+)/.exec(bundle);
        if (m) {
            var w = $.trim(m[1]);
            var i = m[5] ? m[5] : m[2];
            w = w ? w : 'weekly';
            b = (`site_${w}bundle_${i}`).toLowerCase();
            bundle = `<a target=_blank href="/${b}.html">${bundle}</a>`;
        }
        if (!r[b])
            r[b]=[];

        var name = $.trim($(td[2]).text()).toLowerCase();
        var key = $.trim($(td[4]).text());
        var id = '0';
        var act = '';
        //ar.push(key);
        if (key.search('Reveal key') > -1) {
            // http://www.dailyindiegame.com/DIG2-getkey.php?id=1149728
            // revealKey(2,1149727);
            var match = /\d+,(\d+)/.exec($(td[4]).html());
            if (match != null) {
                id = match[1];
                key = `<span id="${id}"><a href="javascript:void(0);" onclick="getKey('${id}');">GetKey ${id}</a></span>`;
            }
        } else if (key.search('-') > -1){
            match = /account_page_0_used_(\d+)/.exec($(td[6]).html());
            if (match != null) {
                id = match[1];
                act = `<a href="javascript:void(0);" onclick="markKey('${id}');">MarkKey</a>`;
            }
        }
        var c = r[b].length + 1;
        var k = `<tr class="${b}"><td class="td">${num}</td><td class="td">${c}</td><td class="td">${bundle}</td><td class="td">${name}</td><td class="td">${key}</td><td class="td" id="u${id}">${act}</td></tr>`;
        r[b].push(k);
    });
    var t = 0;
    $.each(r, function(i,v){
        var n = i;
        var w = v;
        $.each(w, function(j, k){
            $(`#keys`).append(k);
        });
        if (t++ %2 == 1)
            $(`.${n}`).css('background-color', '#4169E1');
        $('#single').after(`<div><a href="javascript:void(0);" onclick="getb('${n}');">${n}</a>&nbsp${w.length}</div>`);
    });

    $('#bundle').click(function () {
        $('#keys').empty();
        var ar = new Array();
        $($('#TableKeys').children() [0]).find('tr').each(function () {
            var t = $(this).find('td');
            var num = $(t[0]).text();
            var bundle = $(t[1]).text();
            if (bundle==='Source')
                return;
            var name = $(t[2]).text();
            var key = $.trim($(t[4]).text());
            var id = '0';
            var i = num % 6;
            ar.push(key);
            $('#keys').append(`<tr><td class="zd">${bundle}</td><td class="zd">${i}</td><td class="zd">${num}</td><td class="zd">${name}</td><td class="zd">${key}</td><td class="zd">【${name}】&nbsp<span id="${id}">${key}</span></td></tr>`);
            if (i==0){
                i = 6;
                $('#keys').append('<tr><td class="zd">' + Math.floor(num / 6) + '</td><td class="zd">-</td><td class="zd">-</td><td class="zd">-</td><td class="zd">-</td><td class="zd">********************{r}【ASF格式】{r}{r}!redeem&nbsp;' + ar.join(',') + '</td></tr>');
                ar = new Array();
            }

            if (key.search('Reveal key') > -1) {
                // http://www.dailyindiegame.com/DIG2-getkey.php?id=1149728
                // revealKey(2,1149727);
                var match = /\d+,(\d+)/.exec($(t[4]).html());
                if (match != null) {
                    id = match[1];
                    var url = 'http://www.dailyindiegame.com/DIG2-getkey.php?id=' + id;
                    $.ajax({
                        url: url
                    }).done(function (data) {
                        $('#' + id).empty();
                        $('#' + id).append(data);
                    });
                }
            }
        });
    });

    $('#single').click(function () {
        $('#keys').empty();
        var ar = new Array();
        $($('#TableKeys').children() [0]).find('tr').each(function () {
            var t = $(this).find('td');
            var num = $(t[0]).text();
            var bundle = $(t[1]).text();
            if (bundle==='Source')
                return;
            var name = $(t[2]).text();
            var key = $.trim($(t[4]).text());
            ar.push(key);
            $('#keys').append('<tr><td class="zd">' + key + '</td></tr>');
            if (key.search('Reveal key') > -1) {
                // http://www.dailyindiegame.com/DIG2-getkey.php?id=1149728
                // revealKey(2,1149727);
                var match = /\d+,(\d+)/.exec($(t[4]).html());
                if (match != null) {
                    var id = match[1];
                    var url = 'http://www.dailyindiegame.com/DIG2-getkey.php?id=' + id;
                    $.ajax({
                        url: url
                    }).done(function (data) {
                        $('#' + id).empty();
                        $('#' + id).append(data);
                    });
                }
            }
        });
        $('#keys').append('<tr><td><a download="serial.csv" id="download-link" href="data:text/csv;charset=utf-8,' + ar.join("%0A") + '" target="_blank">Download</a></td></tr>');
    });
}

unsafeWindow.getb =function(id){
    $('#week').empty();
    var k = id;
    $.ajax({
        url: `/${k}.html`
    }).done(function (data) {
        var d = $(data).find("a[href*='/app/']");
        if (d.length > 0) {
            d.each(function(){
                var h = $(this).attr('href');
                var t = $.trim($(this).parent().prop("firstChild").nodeValue).toLowerCase();
                $(`.${k} td:contains("${t}")`).each(function(){
                    if ($(this).text() == t)
                        $(this).replaceWith(`<td class="td"><a target=_blank href="${h}">${t}</a></td>`);
                });
            });
        } else {
            getb2(id);
        }
    });
}

unsafeWindow.getb2=function(id){
    var m = /\d+/.exec(id);
    if (m){
        var d = m[0];
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://barter.vg/search?q=dig+bundle+${d}`,
            onload: function (response) {
                var r = new RegExp(`a href="([^"]+)"><img[^<>]*>\\s*dig\\s*(weekly\\s*)?bundle\\s*${d}`, 'ig');
                var m = r.exec(response.responseText);
                if (m) {
                    getb3(id, m[1]);
                }
            }
        });
    }
}

unsafeWindow.getb3=function(id, url){
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: function (response) {
            var r = new RegExp(`>([^<>]+)</a>&nbsp;<a href="([^"]+)"`, 'ig');
            var t;
            $(`.${id}`).each(function(){
                var v = $(this).children('td')[2];
                t = $.trim($(v).text());
                $(v).replaceWith(`<td class="td"><a target=_blank href="${url}">${t}</a></td>`);
            });

            while (m = r.exec(response.responseText)) {
                t = $.trim(m[1]).toLowerCase();
                t = $(`<td>${t}</td>`).text();
                $(`.${id} td:contains("${t}")`).each(function(){
                    if ($(this).text() == t)
                        $(this).replaceWith(`<td class="td"><a target=_blank href="${m[2]}">${t}</a></td>`);
                });
            }
        }
    });
}

unsafeWindow.getKey =function(id){
    var k = id;
    $.ajax({
        url: `/DIG2-getkey.php?id=${k}`
    }).done(function (data) {
        $(`#${k}`).empty();
        $(`#${k}`).append(data);
        $(`#u${k}`).append(`<a href="javascript:void(0);" onclick="markKey('${id}');">MarkKey</a>`);
    });
}

unsafeWindow.markKey =function(id){
    var k = id;
    $.ajax({
        url: `/account_page_0_used_${k}.html`
    }).done(function (data) {
        $(`#u${k}`).empty();
        $(`#u${k}`).append('<s>Mark</s>');
    });
}