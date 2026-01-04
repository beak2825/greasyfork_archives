// ==UserScript==
// @name         Witches' Tea Party
// @namespace    http://junjo-ponpo.com/
// @version      0.9.0
// @description  屁理屈推理合戦スレ用ユーティリティ
// @author       ◆Rayi/SlwHY
// @include      *://jbbs.shitaraba.net/bbs/read.cgi/internet/3775/*
// @include      *://jbbs.shitaraba.net/internet/3775/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/402956/Witches%27%20Tea%20Party.user.js
// @updateURL https://update.greasyfork.org/scripts/402956/Witches%27%20Tea%20Party.meta.js
// ==/UserScript==
/* globals $ */

(function () {

"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
function isNotNullish(x) {
    return x != null;
}
function format(strings) {
    var keys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keys[_i - 1] = arguments[_i];
    }
    return (function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        var result = [strings[0]];
        keys.forEach(function (key, i) {
            var value = values[key];
            result.push(value, strings[i + 1]);
        });
        return result.join('');
    });
}
/* Optional Mapping 風処理 */
var Unit = /** @class */ (function () {
    function Unit(x) {
        this.$$ = x;
    }
    Unit.prototype.map = function (f) {
        return new Unit(f(this.$$));
    };
    Unit.prototype.forEach = function (f) {
        f(this.$$);
    };
    return Unit;
}());
function $$(x) {
    if (isNotNullish(x)) {
        return new Unit(x);
    }
    else {
        return null;
    }
}
/* 定数群 */
var RED_TRUTH_REGEX = /【(.*?)】/gs;
var BLUE_TRUTH_REGEX = /『(.*?)』/gs;
var RED_TRUTH_CLASS = 'red-truth';
var BLUE_TRUTH_CLASS = 'blue-truth';
var PRE_RED_TRUTH = '【';
var POST_RED_TRUTH = '】';
var PRE_BLUE_TRUTH = '『';
var POST_BLUE_TRUTH = '』';
var DST_FORMAT = format(__makeTemplateObject(["<span class=\"", "\"><span style=\"font-size: 0;\">", "</span>$1<span style=\"font-size: 0;\">", "</span></span>"], ["<span class=\"", "\"><span style=\"font-size: 0;\">", "</span>$1<span style=\"font-size: 0;\">", "</span></span>"]), 0, 1, 2);
var RED_TRUTH_DST = DST_FORMAT(RED_TRUTH_CLASS, PRE_RED_TRUTH, POST_RED_TRUTH);
var BLUE_TRUTH_DST = DST_FORMAT(BLUE_TRUTH_CLASS, PRE_BLUE_TRUTH, POST_BLUE_TRUTH);
var GAIBUITA_ITA = {
    urlRegex: /jbbs\.shitaraba\.net\/internet\/3775/,
    resSelecter: 'table.thread>tbody>tr>td.text>dd>span',
    hasRedTruthList: false,
    getResNo: function ($x) { return parseInt($x.parent('dd').prev('dt').children('span.name').children('a').eq(0).text()); },
    postTask: function ($x) { },
};
var GAIBUITA_THREAD = {
    urlRegex: /jbbs\.shitaraba\.net\/bbs\/read\.cgi\/internet\/3775\/\d+\/?.*/,
    resSelecter: '#thread-body>dd',
    hasRedTruthList: true,
    getResNo: function ($x) { return parseInt($x.prev('dt').children('a').eq(0).text()); },
    postTask: function ($x) {
        /* 置き換え時にレス先の内容をポップアップする処理が外れるので自前で付け直す */
        /* アンカー */
        $x.children('span.res').children('a').hover(function () {
            $(this).siblings('dl.rep-comment').show();
            return false;
        }, function () {
            $(this).siblings('dl.rep-comment').hide();
            return false;
        });
        /* ポップアップ */
        $x.children('span.res').children('dl.rep-comment').hover(function () {
            $(this).show();
            return false;
        }, function () {
            $(this).hide();
            return false;
        });
    },
};
var TARGET_SITES = [GAIBUITA_ITA, GAIBUITA_THREAD,];
var CSS_STRING = [
    ':root {',
    '    --red: #DE424C;',
    '    --blue: #219DDD;',
    '}',
    '',
    '.red-truth {',
    '    color: var(--red);',
    '}',
    '',
    '.blue-truth {',
    '    color: var(--blue);',
    '}',
].join('\n');
/* /定数群 */
function firstText($obj) {
    var elem = $($obj[0].outerHTML);
    elem.children().empty();
    return elem.text();
}
function getNowSite(document) {
    for (var _i = 0, TARGET_SITES_1 = TARGET_SITES; _i < TARGET_SITES_1.length; _i++) {
        var site = TARGET_SITES_1[_i];
        if (site.urlRegex.test(document.location.href)) {
            return site;
        }
    }
    return null;
}
function extractRedTruth($res, nowSite) {
    var _a;
    var redTruths = [];
    var resNum = (_a = nowSite === null || nowSite === void 0 ? void 0 : nowSite.getResNo($res)) !== null && _a !== void 0 ? _a : NaN;
    var resText = firstText($res);
    var result;
    while (true) {
        result = RED_TRUTH_REGEX.exec(resText);
        if (isNotNullish(result)) {
            redTruths.push([resNum, result[1]]);
        }
        else {
            return redTruths;
        }
    }
}
function colourTruths($res) {
    var element = $res[0];
    var src = element.innerHTML;
    var dst = src
        .replace(RED_TRUTH_REGEX, RED_TRUTH_DST)
        .replace(BLUE_TRUTH_REGEX, BLUE_TRUTH_DST);
    element.innerHTML = dst;
}
/* 実行内容 */
$(function () {
    var _a, _b;
    var nowSite = getNowSite(this);
    var $style = $('<style />').attr('type', 'text/css').html(CSS_STRING);
    $('head').eq(0).append($style);
    var redTruths = [];
    /* レス本文ごとに回す */
    var $reses = (_a = $$(nowSite)) === null || _a === void 0 ? void 0 : _a.map(function (x) { return $(x.resSelecter); }).$$;
    $reses === null || $reses === void 0 ? void 0 : $reses.each(function () {
        var $res = $(this);
        redTruths = redTruths.concat(extractRedTruth($res, nowSite));
        colourTruths($res);
    });
    /* 赤き真実のリスト,今後実装予定 */
    if (nowSite === null || nowSite === void 0 ? void 0 : nowSite.hasRedTruthList) {
        /* TODO: 正式な実装 */
        var resMin_1 = NaN;
        var resMax_1 = NaN;
        var isBetweenResRange = function (x) { return !(x[0] < resMin_1) && !(x[0] > resMax_1); };
        var enabledList = redTruths.filter(isBetweenResRange);
        enabledList.forEach(function (x) { return console.log(x); }); // 代替としてデバッグコンソールに表示しておく
    }
    /* サイトごとの後処理 */
    (_b = $$($reses)) === null || _b === void 0 ? void 0 : _b.forEach(function (x) { return nowSite === null || nowSite === void 0 ? void 0 : nowSite.postTask(x); }); // $$
});

})();
