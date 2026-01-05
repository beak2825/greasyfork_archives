// ==UserScript==
// @name        Highlight Episode Number
// @namespace   https://greasyfork.org/users/726
// @description 在几个常用网站中高亮下载列表中的话数
// @include     http*://bt.byr.cn/torrents.php*
// @include     https://share.dmhy.org/*
// @include     http://share.popgo.org/*
// @include     http://bt.xfsub.com/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @version     20171100
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12070/Highlight%20Episode%20Number.user.js
// @updateURL https://update.greasyfork.org/scripts/12070/Highlight%20Episode%20Number.meta.js
// ==/UserScript==

(function ($) {

var $ = $.noConflict(true);

$('#outer table.torrents table.torrentname td:nth-child(1) a b').each(function() {
    console.log('Highlight BYR');
    var text = $(this);
    text.html(getep(text.text(), true));
    colorizetd(text);
});

$('#topic_list tr td.title>a').each(function() {
    console.log('Highlight DMHY');
    var text = $(this);
    text.html(getep(text.html()));
    colorizetd(text);
});

$('#index_maintable tr td:nth-child(4) a').each(function() {
    console.log('Highlight POPGO');
    var text = $(this).contents().filter(function() {
        return this.nodeType == 3;
    }).first();
    text.replaceWith(getep(text.text()));
    colorizetd($(this));
});

$('#data_list tr td:nth-child(2) a:nth-child(2)').each(function() {
    console.log('Highlight XFSUB');
    var text = $(this);
    text.html(getep(text.html()));
    colorizetd(text);
});

function colorizetd(text) {
    if (getbg(text)) {
        text.closest('td').css('background-color', getbg(text));
    }
}

function getbg(text) {
    //var cs = ['#D31D8C', '#EE88CD', '#4DC5D6', '#A5F2F3', '#BCDD11', '#F1FAC0'];
    //var cs = ['#bbe2ea', '#a2cdd3', '#bce0b3', '#e2eaa3', '#faea9e', '#f8c599', '#f3b3d0', '#dfb0d2'];
    //var cs = ['#4FC5C7', '#97EC71', '#DBF977', '#DE9DD6', '#FA6E86'];
    var cs = ["#DDC06A", "#8AD5E1", "#9FE091", "#D7B7DB", "#F1A48A", "#7BDEBC", "#D2E46A"];
    if (text.find('span.episode')) {
        var e = parseInt(text.find('span.episode').text());
        return cs[e % cs.length];
    }
    return null;
}

function getep(title, strict) {
    var candi = [];
    var left = '';
    var right = '';
    var Left = '';
    var Right = '';
    var start = -1;
    var isNumber = /\d/;
    var isBreaker = /[\[\]【】]/;
    var isDeli = /[\[\]【】 ]/;
    var isDeliL = /[\[【 ]/;
    var isDeliR = /[\]】 ]/;
    var isSpace = /\s/;
    var goodLeft = /[SE第]/;
    var goodRight = /[集话話]/;
    var badRight = /[月]/;
    var hasLeading0 = /^0/;
    var number = '';

    for (var i = 0; i < title.length; i++) {
        var c = title[i];
        if (isNumber.test(c)) {
            if (start < 0)
                start = i;
            number += c;
        } else {
            if (start >= 0) {
                for (var j = i; j < title.length; j++) {
                    var cc = title[j];
                    if (!right)
                        right = cc;
                    if (isBreaker.test(cc)) {
                        break;
                    } else {
                        if (!isSpace.test(cc)) {
                            Right = cc;
                            break;
                        }
                    }
                }
                var can = {
                    'number': number,
                    'start': start,
                    'length': i - start,
                    'left': left,
                    'Left': Left,
                    'right': right,
                    'Right': Right,
                };
                candi.push(can);
                start = -1;
                number = '';
                left = Left = '';
                right = Right = '';
            }
            left = c;
            if (isBreaker.test(c)) {
                Left = '';
            } else {
                if (!isSpace.test(c))
                    Left = c;
            }
        }
    }

    var best = {score: 0};
    candi.forEach(function (can) {
        var s = 0;
        if (badRight.test(can.Right)) {
            s -= 5000;
        }
        if (goodRight.test(can.Right)) {
            s += 5000;
        }
        if (hasLeading0.test(can.number)) {
            s += 200;
        }
        if (can.number == 5 && can.left == 'G')
            s -= 1000;
        if (can.number == 1080)
            s -= 1000;
        if (can.length < 3)
            s += 100;
        if (can.length > 1)
            s += 100;
        if (can.length > 3)
            s -= 5000;
        if (isDeli.test(can.left))
            s += 200;
        if (isDeli.test(can.right))
            s += 200;
        if (isDeli.test(can.left) && isDeli.test(can.right))
            s += 600;
        if (isDeliL.test(can.left) && isDeliR.test(can.right))
            s += 2000;
        else {
            if (strict && !goodLeft.test(can.left))
                s -= 10000;
        }
        if (isBreaker.test(can.left) && isBreaker.test(can.right))
            s += 1000;
        can.score = s + i;
        if (best.score < can.score)
            best = can;
    });
    //console.log(candi);
    if (best.score > 0) {
        var sa = title.substr(0, best.start);
        var sb = title.substr(best.start, best.length);
        var sc = title.substr(best.start + best.length);
        title = sa + '<span class="episode" style="color:red;font-weight:bold;">' + sb + '</span>' + sc;
    }
    return title;
}

})($);
