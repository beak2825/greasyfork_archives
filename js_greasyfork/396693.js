// ==UserScript==
// @name         シネコン上映スケジュール
// @namespace    https://greasyfork.org/morca
// @version      0.13
// @description  シネコン上映スケジュール (イオンシネマ, ユナイテッド・シネマ/シネプレックス, T・ジョイ, TOHOシネマズ, MOVIX/松竹マルチプレックスシアターズ, コロナシネマワールド, 109シネマズ)
// @author       morca
// @match        https://cinema.aeoncinema.com/*
// @match        https://theater.aeoncinema.com/*
// @match        https://www.unitedcinemas.jp/*/daily.php*
// @match        https://tjoy.jp/*
// @match        https://hlo.tohotheater.jp/net/schedule/*
// @match        https://www.smt-cinema.com/site/*
// @match        http://www.korona.co.jp/Cinema/*
// @match        https://109cinemas.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396514/%E3%82%B7%E3%83%8D%E3%82%B3%E3%83%B3%E4%B8%8A%E6%98%A0%E3%82%B9%E3%82%B1%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/396514/%E3%82%B7%E3%83%8D%E3%82%B3%E3%83%B3%E4%B8%8A%E6%98%A0%E3%82%B9%E3%82%B1%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==
//trying:
//シネマサンシャイン
// @match        https://www.cinemasunshine.co.jp/theater/*

(function() {
    'use strict';
    const sites = {
        "aeon": {
            title: "div.movielist",
            titleId: n => $(n).find("[titleid]").attr("titleid"),
            titleText: n => $(n).find("div.title > p.main > a:eq(0)"),
            titleSelected: n => $(n).find("div.timetbl").css("display") != "none",
            shows: (n, reg) => {
                $(n).find("div.timetbl > div > div.time").each((i, e) => {
                    var screen = $(e).parent().find("div.screen > a").text();
                    var start = $(e).text().trim().replace(/^(\d+)：(\d+)～(\d+)：(\d+)$/, "$1:$2");
                    var end = $(e).text().trim().replace(/^(\d+)：(\d+)～(\d+)：(\d+)$/, "$3:$4");
                    reg(start, end, screen);
                });
            },
            showTitle: (n, show) => {
                $(n).find("div.timetbl, div.anno_movie").each(function(i, e) {
                    e.style.display = show ? "" : "none";
                });
                //n.style.marginTop = show ? "15px" : "0";
                //n.style.paddingBottom = show ? "15px" : "1px";
            },
            main: () => {
                $(site.title).find("div.title > p.main > a:eq(0)").each(function(i, e) {
                    correctTitle(e);
                });
                $("td.monthly_movie_title > dl > dd > p > a[href$='/index.html']").each(function(i, e) {
                    correctTitle(e);
                });
                $(site.title).each(function(i, e) {
                    var id = $(e).find("a[name]:eq(1)").attr("name") + "," + $(e).find("a[name]:eq(0)").attr("name");//"id,edition"
                    $(e).find("div.title").attr("titleid", id).click(function(ev) {
                        if (ev.target.tagName != "P" && ev.target.tagName != "DIV") return;
                        toggleTitle(this.getAttribute("titleid"));
                        showTitles();
                    });
                });
                showTitles();
            }
        },
        "aeon2": {
            title: "div.p-schedule__information",
            titleId: n => $(n).attr("titleid"),
            titleText: n => $(n).find("a.p-schedule__titleJp > h2"),
            titleSelected: n => $(n).find("div.p-schedule__list").css("display") != "none",
            shows: (n, reg) => {
                $(n).find("div.p-schedule__time").each((i, e) => {
                    var screen = $(e).parent().find("div.p-schedule__screen").text();
                    var start = $(e).text().trim().replace(/^(\d+):(\d+)~(\d+):(\d+)$/, "$1:$2");
                    var end = $(e).text().trim().replace(/^(\d+):(\d+)~(\d+):(\d+)$/, "$3:$4");
                    reg(start, end, screen);
                });
            },
            showTitle: (n, show) => {
                $(n).find("div.p-schedule__list, div.p-schedule__headerTimes, div.p-schedule__overview").each(function(i, e) {
                    e.style.display = show ? "" : "none";
                });
                let found = false;
                $(n).parent().parent().find("div.p-schedule__information").each((i, e) => {
                    found ||= $(e).find("div.p-schedule__list").css("display") != "none";
                });
                $(n).parent().parent().find("a.p-schedule__poster > img").css("display", found ? "" : "none");
            },
            main: () => {
                //https://stackoverflow.com/questions/18638900/javascript-crc32/18639999#18639999
                var makeCRCTable = function(){
                    var c;
                    var crcTable = [];
                    for(var n =0; n < 256; n++){
                        c = n;
                        for(var k =0; k < 8; k++){
                            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
                        }
                        crcTable[n] = c;
                    }
                    return crcTable;
                }
                var crc32 = function(str) {
                    var crcTable = window.crcTable || (window.crcTable = makeCRCTable());
                    var crc = 0 ^ (-1);
                    for (var i = 0; i < str.length; i++ ) {
                        crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
                    }
                    return (crc ^ (-1)) >>> 0;
                };
                function onLoad() {
                    $(site.title).each(function(i, e) {
                        if ($(e).attr("titleid")) return;
                        let title = $(e).find("a.p-schedule__titleJp > h2");
                        let id = $(title).parent().attr("target", "_blank").attr("href").replace(/.*\/(\d+)\/.*/, "$1");
                        $(e).parent().parent().find("a.p-schedule__poster").attr("target", "_blank");
                        let hash = crc32($(title).text()) & 0xffff;
                        id = id + "," + hash;
                        $(e).attr("titleid", id).find("div.p-schedule__header").click(function(ev) {
                            if (ev.target.tagName != "SPAN" && ev.target.tagName != "DIV") return;
                            toggleTitle(this.parentNode.getAttribute("titleid"));
                            showTitles();
                        });
                        correctTitle(title);
                    });
//                    $("td.monthly_movie_title > dl > dd > p > a[href$='/index.html']").each(function(i, e) {
//                        correctTitle(e);
//                    });
                    showTitles();
                }
                watchAutoPager("div.schedule-section", () => {
                    console.log('update');
                    onLoad();
                });
                $("div.gtm-cookie-consent").attr("style", "display: none;");
                console.log('onLoad');
                //onLoad();
            }
        },
        "united": {
            title: "div#dailySchedule > ul#dailyList > li",
            titleId: n => $(n).find("[titleid]").attr("titleid"),
            titleText: n => $(n).find("span.movieTitle > a[href]:eq(0)"),
            titleSelected: n => $(n).find("ul.tl").css("display") != "none",
            shows: (n, reg) => {
                $(n).find("ul.tl > li").each((i, e) => {
                    var screen = $(e).find("p.screenNumber > a > img[alt]").attr("alt");
                    $(e).find("ol > li").each((i, e2) => {
                        var start = $(e2).find("div > ol > li.startTime").text();
                        var end = $(e2).find("div > ol > li.endTime").text().slice(1);
                        reg(start, end, screen);
                    });
                });
            },
            showTitle: (n, show) => {
                $(n).find("p.campaitnInfo, p.startInfo, ul.tl, p.endInfo").each(function(i, e) {
                    e.style.display = show ? "" : "none";
                });
                //n.style.marginBottom = show ? "8px" : "0";
            },
            main: () => {
                $(site.title).each(function(i, e) {
                    var id = $(e).find("span.movieTitle > a[href]:eq(0)").attr("target", "_blank").attr("href").replace(/^film\.php\?film=(\d+).*$/, "$1");
                    $(e).find("h3, div.dailyMvtkShowtime").attr("titleid", id).click(function(ev) {
                        if (ev.target.tagName != "H3" && ev.target.tagName != "SPAN" && ev.target.tagName != "DIV") return;
                        toggleTitle(this.getAttribute("titleid"));
                        showTitles();
                    });
                });
                showTitles();
            }
        },
        "tjoy": {
            title: ".film-content[id]",
            titleId: n => {
                var id = $(n).find("a[onclick]").attr("onclick");
                if (!id) id = $(n).find("a[_onclick]").attr("_onclick");
                id = id.replace(/.*\/(\w+)'.*/, "$1");
                if (id.length < 8) id = (id + "00000000").slice(0, 8);
                return id;
            },
            titleText: n => $(n).parent().parent().find(".js-title-film"),
            titleSelected: n => $(n).parent().prev().hasClass("active"),
            showTitle2: (n, show) => {
                if (show) {
                    $(n).parent().addClass('active2');
                    $(n).parent().prev().find('.film-title').removeAttr('style');
                    $(n).parent().prev().find('.film-img').removeAttr('style');
                    $(n).parent().prev().find('.film-img > img').attr('style', 'display: block');
                } else {
                    $(n).parent().removeClass('active2');
                    $(n).parent().prev().find('.film-title').attr('style', 'max-height: fit-content');
                    $(n).parent().prev().find('.film-img').attr('style', 'max-height: 0px');
                    $(n).parent().prev().find('.film-img > img').attr('style', 'display: none');
                }
            },
            showTitle: (n, show) => {
                /* for init */
                if (show) {
                    $(n).parent().prev().addClass('active');
                    $(n).parent().attr('style', 'display: block');
                } else {
                    $(n).parent().prev().removeClass('active');
                    $(n).parent().removeAttr('style');
                }
                site.showTitle2(n, show);
            },
            shows: (n, reg) => {
                $(n).find(".theater-item").each((i, e) => {
                    var screen = $(e).find(".theater-name.mb-1 > a").text();
                    var start = $(e).find(".schedule-time").text().trim().replace(/^(\d+:\d+) ～ (\d+:\d+)$/, "$1");
                    var end = $(e).find(".schedule-time").text().trim().replace(/^(\d+:\d+) ～ (\d+:\d+)$/, "$2");
                    reg(start, end, screen);
                });
            },
            main: () => {
                {
                    let curr = $('.tab-pane.active .calendar-active').attr('data-date');
                    let last = getCookie("lastDate", curr);
                    let e = $(`.tab-pane.active .calendar-item[data-date="${last}"][class!="calendar-active"]`);
                    if (e.length > 0) {
                        e.trigger('click');
                    }
                    $('.calendar-slider').click(function() {
                        setCookie("lastDate", $('.tab-pane.active .calendar-active').attr('data-date'));
                    });
                }
                function onLoad() {
                    $(site.title).find("a.btn-film-content").each(function(i, e) {
                        let onclick = $(e).attr("onclick");
                        if (onclick) $(e).attr("target", "_blank").attr("href", onclick.replace(/^.*'(.*)'$/, "$1")).attr("_onclick", onclick).attr("onclick", null);
                    });
                    $('.js-card-click').click(function() {
                        let n = $(this).next().find(site.title)[0];
                        toggleTitle(site.titleId(n));
                        site.showTitle2(n, !$(n).parent().hasClass("active2"));
                    });
                    $("div.film-title-content > div > h5").parent().find("span").attr("style", "user-select: all; cursor: text;").click(function(ev) {return false;});
                    showTitles();
                }
                watchAutoPager(".box-film-wapper", () => {
                    onLoad();
                });
                onLoad();
            }
        },
        "toho": {
            title: ".schedule.main .js-toggle-button",
            titleId: n => $(n).parent().attr("id").replace(/.*-(.+)/, "$1"),
            titleText: n => $(n).find(".schedule-body-title"),
            titleSelected: n => $(n).hasClass("is-open"),
            shows: (n, reg) => {
                $(n).next().find(".schedule-screen").each((i, e) => {
                    var screen = $(e).find(".schedule-screen-title").text();
                    $(e).find(".schedule-item").each((i, e2) => {
                        var start = $(e2).find(".time > .start").text();
                        var end = $(e2).find(".time > .end").text();
                        reg(start, end, screen);
                    });
                });
            },
            showTitle: (n, show) => {
                var togglePanel = $('#' + $(n).data('href'));
                if (show) {
                    $(n).addClass('is-open');
                    togglePanel.show();
                } else {
                    $(n).removeClass('is-open');
                    togglePanel.hide();
                }
            },
            main: () => {
                watchAutoPager(".schedule.main", () => {
                    $("h5.schedule-body-title").each(function(i, e) {
                        correctTitle(e);
                    });
                    $('.js-toggle-button').click(function() {
                        toggleTitle(site.titleId(this));
                    });
                    showTitles();
                });
            }
        },
        "smt": {
            title: ".movieTitle",
            titleId: n => $(n).parent().parent().attr("class"),//31177 T0024527 -> mo-cinemaid
            titleText: n => $(n).find("h2"),
            titleSelected: n => $(n).hasClass("active"),
            shows: (n, reg) => {
                $(n).next().find(".block").each((i, e) => {
                    var screen = $(e).find("h3 > a").text();
                    var start = $(e).find(".time").text().trim().replace(/^(\d+:\d+)～\s*(\d+:\d+)$/, "$1");
                    var end = $(e).find(".time").text().trim().replace(/^(\d+:\d+)～\s*(\d+:\d+)$/, "$2");
                    reg(start, end, screen);
                });
            },
            showTitle: (n, show) => {
                if (show) {
                    $(n).addClass('active');
                    $(n).next().show();
                } else {
                    $(n).removeClass('active');
                    $(n).next().hide();
                }
            },
            main: () => {
                function onLoad() {
                    $(site.title).on('click', function() {
                        toggleTitle(site.titleId(this));
                    });
                    showTitles();
                }
                watchAutoPager("#schedule .dailyTab .dailyWrap", () => {
                    onLoad();
                });
                onLoad();
            }
        },
        "corona": {
            title: ".wrapFilm > .name",
            titleId: n => {
                var e = $(n).contents(":nth(0)")[0];//Seqは上映形式を含まない
                if (e.nodeType == Node.TEXT_NODE) return e;
                if (e.nodeType == Node.ELEMENT_NODE) return $(e).text();
                return null;
            },
            titleText: n => $(n).find("a[href*='/CinemaDetail.asp?Seq=']"),
            titleSelected: n => $(n).next().css("display") != "none",
            shows: (n, reg) => {
                $(n).next().find("tr").each((i, e) => {
                    var screen = $(e).find("th > div").text();
                    var start = $(e).find(".time").text().replace(/^(\d+:\d+)～(\d+:\d+)$/, "$1");
                    var end = $(e).find(".time").text().replace(/^(\d+:\d+)～(\d+:\d+)$/, "$2");
                    reg(start, end, screen);
                });
            },
            showTitle: (n, show) => {
                $(n).next()[0].style.display = show ? "" : "none";
                //$(n).parent()[0].style.marginBottom = show ? "40px" : "0";
                //$(n).parent()[0].style.marginTop = show ? "50px" : "0";
            },
            main: () => {
                watchAutoPager("#wrapSearch", () => {
                    $(site.title).each(function(i, e) {
                        $(e).find("a[href*='/CinemaDetail.asp?Seq=']").each(function(i, e2) {
                            e2.style.display = "inline";
                            //correctTitle(e2);//TODO 更新するとshowできない
                        });
                        $(e).click(function(ev) {
                            if (ev.target.tagName != "H4" && ev.target.tagName != "SPAN") return;
                            toggleTitle(site.titleId(this));
                            showTitles();
                        });
                    });
                    showTitles();
                });
            }
        },
        "_109": {
            title: "article > header",
            titleId: n => $(n).parent().attr("class"),
            titleText: n => $(n).find("a > h2"),
            titleSelected: n => $(n).parent().children("ul").css("display") != "none",
            shows: (n, reg) => {
                $(n).parent().find(".timetable").each((i, e) => {
                    var screen = $(e).find(".theatre > a").text();
                    $(e).find("li[class!='thatre']").each((i, e2) => {
                        var start = $(e2).find(".start").text();
                        var end = $(e2).find(".end").text();
                        reg(start, end, screen);
                    });
                });
            },
            showTitle: (n, show) => {
                $(n).parent().children("p, ul").each((i, e) => {
                    e.style.display = show ? "" : "none";
                });
                //$(n).parent()[0].style.marginBottom = show ? "30px" : "1px";
            },
            main: () => {
                $(site.title).each(function(i, e) {
                    $(e).click(function(ev) {
                        if (ev.target.tagName != "HEADER" && ev.target.tagName != "DIV") return;
                        toggleTitle(site.titleId(this));
                        showTitles();
                    });
                });
                showTitles();
            }
        },
        "sunshine": {
            title: ".schedule-sort-film > .mb-3 > .p-3",
            titleId: n => $(n).find(".mb-2 > strong").text(),
            showTitle: (n, show) => {
                $(n).next()[0].style.display = show ? "" : "none";
            },
            main: () => {
                watchAutoPager(".schedule-sort-film", () => {//.swiper-wrapper
                    console.log("fired");
                    $(site.title).each(function(i, e) {
                        $(e).click(function(ev) {
                            console.log(ev.target.tagName);
                            //if (ev.target.tagName != "HEADER" && ev.target.tagName != "DIV") return;
                            console.log(site.titleId(this));
                            toggleTitle(site.titleId(this));
                            showTitles();
                        });
                    });
                    showTitles();
                });
            }
        }
    };
    const aeon = /^https:\/\/cinema\.aeoncinema\.com\//.test(location.href) === true;
    const aeon2 = /^https:\/\/theater\.aeoncinema\.com\//.test(location.href) === true;
    const united = /^https:\/\/www\.unitedcinemas\.jp\//.test(location.href) === true;
    const tjoy = /^https:\/\/tjoy\.jp\//.test(location.href) === true;
    const toho = /^https:\/\/hlo\.tohotheater\.jp\/net\/schedule\//.test(location.href) === true;
    const smt = /^https:\/\/www\.smt-cinema\.com\/site\//.test(location.href) === true;
    const corona = /^http:\/\/www\.korona\.co\.jp\/Cinema\//.test(location.href) === true;
    const _109 = /^https:\/\/109cinemas\.net\//.test(location.href) === true;
    const sunshine = /^https:\/\/www\.cinemasunshine\.co\.jp\/theater\//.test(location.href) === true;
    const site = sites[
        aeon ? "aeon" :
        aeon2 ? "aeon2" :
        united ? "united" :
        tjoy ? "tjoy" :
        toho ? "toho" :
        smt ? "smt" :
        corona ? "corona" :
        _109 ? "_109" :
        sunshine ? "sunshine" :
        null
    ];
    //https://www.yoheim.net/blog.php?q=20191101
    var kanaMap = {
        'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
        'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
        'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
        'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
        'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
        'ｳﾞ': 'ヴ', 'ﾜﾞ': 'ヷ', 'ｦﾞ': 'ヺ',
        'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
        'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
        'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
        'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
        'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
        'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
        'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
        'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
        'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
        'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
        'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
        'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
        '｡': '。', '､': '、', 'ｰ': 'ー', '｢': '「', '｣': '」', '･': '・'
    };
    var reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
    function correctTitle(n) {
        var org = $(n).html();
        var title = org.replace(reg, m => kanaMap[m]).replace(/ﾞ/g, '゛').replace(/ﾟ/g, '゜');
        title = title.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
        title = title.replace(/　/g, " ");
        if (title != org) {
            //console.log(org);
            //console.log(title);
            $(n).html(title);
        }
    }
    function getCookie(name, dfl) {
        name += "=";
        var found = document.cookie.split("; ").find(c => c.indexOf(name) === 0);
        if (found) return decodeURIComponent(found.substr(name.length));
        return dfl;
    }
    function setCookie(name, value) {
        //TODO max-age
        document.cookie = name + "=" + encodeURIComponent(value) + "; path=/; max-age=5184000";
    }
    function toggleTitle(id) {
        id = "\t" + id + "\t";
        var ids = getCookie("hiddenTitles", "\t");
        var index = ids.indexOf(id);
        if (index >= 0) {
            ids = ids.substr(0, index) + "\t" + ids.substr(index + id.length);
        } else {
            ids = ids + id.substr(1);
        }
        setCookie("hiddenTitles", ids);
        var ids2 = getCookie("hiddenTitles", "\t");
        if (ids2.length < ids.length) {
            do {
                index = ids.substr(1).indexOf("\t");
                if (index < 0) return;
                ids = ids.substr(1 + index);
            } while (ids2.length < ids.length);
            setCookie("hiddenTitles", ids);
        }
    }
    function showTitles() {
        var ids = getCookie("hiddenTitles", "");
        $(site.title).each(function(i, n) {
            var id = site.titleId(n);
            if (id) {
                site.showTitle(n, ids.indexOf("\t" + id + "\t") < 0);
            } else {
                console.log("titleId is not found", n);
            }
        });
        if ($(site.title).length) {
            $("button#js-show-popup").show();
        } else {
            $("button#js-show-popup").hide();
        }
    }
    function watchAutoPager(holder, load) {
        $(holder).each((i, e) => {
            var countDefer = 0;
            var timerDefer;
            let observer = new MutationObserver(ml => ml.filter(m => m.type === 'childList').forEach(m => m.addedNodes.forEach(() => {
                countDefer = 0;
                if (!timerDefer) timerDefer = setInterval(() => {
                    if (countDefer < 2) {
                        countDefer++;
                        return;
                    }
                    clearInterval(timerDefer);
                    timerDefer = null;
                    if (load) load();
                }, 100);
            })));
            observer.observe(e, {childList: true, subtree: true});
        });
    }
    function time(f, ...args) {
        let start = performance.now();
        let r = f(...args);
        console.log(f.name + ": " + parseInt(performance.now() - start) + "us");
        return r;
    }
    function setupHashigo() {
        //https://tech-dig.jp/js-modal/
        $("body").append(`
<div class="popup" id="js-popup" style="
position: fixed;
left: 0;
top: 0;
width: 100%;
height: 100%;
z-index: 9999;
opacity: 0;
visibility: hidden;
transition: .6s;
">
<div class="popup-inner" style="
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%,-50%);
width: 80%;
max-width: 600px;
padding: 50px;
background-color: #fff;
z-index: 2;
height: 80%;
overflow-y: scroll;
">
<div id="hashigo-text" style="text-align: left;"></div>
</div>
<div class="black-background" id="js-black-bg" style="
position: absolute;
left: 0;
top: 0;
width: 100%;
height: 100%;
background-color: rgba(0,0,0,.8);
z-index: 1;
cursor: pointer;
"></div>
</div>
<div style="
position: fixed;
bottom: 0%;
right: 0%;
z-index: 3;
text-align: center;
background-color: #fff;
padding: 2px;
border: solid 1px #333;
">
はしご計算<br />
開始<select id="h1"></select><select id="m1"></select><br />
終了<select id="h2"></select><select id="m2"></select><br />
<select id="ivl"></select>
<button id="js-show-popup">計算</button>
</div>
`);
        var start_limit = -1;
        var end_limit = -1;
        var trailer = 0;
        var conf = getCookie("hashigoConfig", "").split(",");
        if (conf.length == 3) {
            start_limit = Number(conf[0]);
            end_limit = Number(conf[1]);
            trailer = Number(conf[2]);
        }
        $("#h1, #h2").append(`<option value="-1">未定</option>`);
        for (let i = 8; i < 24 + 8; i++) $("#h1, #h2").append(`<option value="${i}">${i}時</option>`);
        for (let i = 0; i < 60; i += 5) $("#m1, #m2").append(`<option value="${i}">${i}分</option>`);
        for (let i = 10; i > 0; i -= 5) $("#ivl").append(`<option value="${i}">重複${i}分</option>`);
        for (let i = 0; i >= -20; i -= 5) $("#ivl").append(`<option value="${i}">休憩${-i}分</option>`);
        if (start_limit == -1) $("#h1, #m1")[0].selectedIndex = 0; else {
            for (let i = 0; i < $("#h1")[0].options.length; i++) if ($("#h1")[0].options[i].value == Math.floor(start_limit / 60)) {$("#h1")[0].selectedIndex = i; break;}
            for (let i = 0; i < $("#m1")[0].options.length; i++) if ($("#m1")[0].options[i].value == start_limit % 60) {$("#m1")[0].selectedIndex = i; break;}
        }
        if (end_limit == -1) $("#h2, #m2")[0].selectedIndex = 0; else {
            for (let i = 0; i < $("#h2")[0].options.length; i++) if ($("#h2")[0].options[i].value == Math.floor(end_limit / 60)) {$("#h2")[0].selectedIndex = i; break;}
            for (let i = 0; i < $("#m2")[0].options.length; i++) if ($("#m2")[0].options[i].value == end_limit % 60) {$("#m2")[0].selectedIndex = i; break;}
        }
        for (let i = 0; i < $("#ivl")[0].options.length; i++) if ($("#ivl")[0].options[i].value == trailer) {$("#ivl")[0].selectedIndex = i; break;}
        function popupImage() {
            var popup = document.getElementById('js-popup');
            if (!popup) return;
            var lock = false;
            $('#js-black-bg, #js-show-popup').click(function() {
                if (lock) return;
                lock = true;
                popup.classList.toggle('is-show');
                function sleep(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }
                if ($(popup).hasClass("is-show")) {
                    popup.style.opacity = "1";
                    popup.style.visibility = "visible";
                    (async function() {
                        await sleep(1000);
                        time(hashigo);
                        lock = false;
                    })();
                } else {
                    popup.style.opacity = "0";
                    popup.style.visibility = "hidden";
                    (async function() {
                        await sleep(1000);
                        $("#hashigo-text").empty();
                        lock = false;
                    })();
                }
            });
            if ($(site.title).length == 0) $("button#js-show-popup").hide();
            //TODO _109: position: fixed not work in iframe
        }
        popupImage();
        function hashigo() {
            function log(arg) {
                //console.log(arg);
                $("#hashigo-text").append(`<p>${arg}</p>`);
            }
            var h1 = Number($("#h1")[0].options[$("#h1")[0].selectedIndex].value);
            var m1 = Number($("#m1")[0].options[$("#m1")[0].selectedIndex].value);
            if (h1 == -1) start_limit = -1; else start_limit = h1 * 60 + m1;
            var h2 = Number($("#h2")[0].options[$("#h2")[0].selectedIndex].value);
            var m2 = Number($("#m2")[0].options[$("#m2")[0].selectedIndex].value);
            if (h2 == -1) end_limit = -1; else end_limit = h2 * 60 + m2;
            trailer = Number($("#ivl")[0].options[$("#ivl")[0].selectedIndex].value);
            setCookie("hashigoConfig", `${start_limit},${end_limit},${trailer}`);
            var titles = [];
            var min = 2 * 24 * 60, max = 0;
            var start_hit = false, end_hit = false;
            var k_max = null;
            $(site.title).each(function(i, e) {
                if (!site.titleSelected(e)) return;
                var title = site.titleText(e).text().trim();
                site.shows(e, function(start, end, screen) {
                    if (!start || !end) return;
                    start = Number(start.replace(/^(\d+):(\d+)$/, "$1")) * 60 + Number(start.replace(/^(\d+):(\d+)$/, "$2"));
                    end = Number(end.replace(/^(\d+):(\d+)$/, "$1")) * 60 + Number(end.replace(/^(\d+):(\d+)$/, "$2"));
                    if (end < start) end += 24 * 60;
                    if (end <= 8 * 60) {start += 24 * 60; end += 24 * 60;}
                    if (start_limit !== -1 && start < start_limit) {start_hit = true; return;}
                    if (end_limit !== -1 && end_limit < end) {end_hit = true; return;}
                    if (titles.length == 0 || titles[titles.length - 1].title != title) titles.push({title: title, mins: end - start, shows: []});
                    titles[titles.length - 1].shows.push({start: start, end: end, screen: screen});
                    if (start < min) min = start;
                    if (max < end) max = end;
                });
            });
            function combination(a, k) {
                var arrs = [];
                if (a.length < k) {
                } else if (k == 1) {
                    arrs = a.map((_, i) => [a[i]]);
                } else {
                    for (var i = 0; i < a.length - k + 1; i = (i + 1) | 0) {
                        var sub = combination(a.slice(i + 1), k - 1);
                        for (var j = 0; j < sub.length; j = (j + 1) | 0) arrs.push([a[i]].concat(sub[j]));
                    }
                }
                return arrs;
            }
            function hhmm(m) {
                var hh = " " + Math.floor(m / 60);
                hh = hh.slice(hh.length - 2);
                var mm = "0" + (m % 60);
                mm = mm.slice(mm.length - 2);
                return hh + ":" + mm;
            }
            log("はしご計算結果");
            if (start_limit !== -1 && start_hit) log("※" + hhmm(start_limit) + "以降に上映開始する作品を対象にします");
            if (end_limit !== -1 && end_hit) log("※" + hhmm(end_limit) + "以前に上映終了する作品を対象にします");
            if (trailer > 0) {
                log("※上映時間の重なりを" + trailer + "分まで許容します");
            } else if (trailer < 0) {
                log("※上映時間の間隔を" + (-trailer) + "分以上確保します");
            }
            log("※休憩時間が短いものから表示します");
            //TODO 日付
            log(titles.length + "作品を選択");
            if (titles.length < 2) return;
            var results2 = [];
            var pairs = {};
            for (var k = 2; k <= titles.length; k = (k + 1) | 0) {
                var seq = [...Array(titles.length)].map((_, i) => i);
                if (seq.map(t => titles[t].mins).sort((a, b) => a - b).slice(0, k).reduce((a, v) => a + v, 0) - trailer * (k - 1) > max - min) break;
                if (k_max && k > k_max) {
                    log(k + "作品の組合せは都合により計算しません");
                    continue;
                }
                var results = [];
                combination(seq, k).forEach(title_index => {
                    var mins = title_index.reduce((a, v) => a + titles[v].mins, 0);
                    if (mins - trailer * (k - 1) > max - min) return;
                    if (k > 2 && combination(title_index, k - 1).some(pair => !pairs[pair])) return;
                    var lt = title_index[0];
                    var rt = title_index.slice(1);
                    var rsss;
                    if (rt.length == 1) {
                        rsss = [...Array(titles[rt[0]].shows.length)].map((_, i) => [i])
                    } else {
                        rsss = pairs[rt];
                        if (!rsss) return;
                    }
                    var result = [];
                    var found = [];
                    rsss.forEach(rss => {
                        for (var ls = 0; ls < titles[lt].shows.length; ls = (ls + 1) | 0) {
                            if (!rss.some((rs, i) => {
                                if (titles[lt].shows[ls].start + trailer <
                                    titles[rt[i]].shows[rs].end &&
                                    titles[rt[i]].shows[rs].start + trailer <
                                    titles[lt].shows[ls].end) return true;
                            })) {
                                found.push([ls].concat(rss));
                                //sort by start
                                result.push(title_index.map((t, i) => [t, (i == 0) ? ls : rss[i - 1]]).sort((a, b) => titles[a[0]].shows[a[1]].start - titles[b[0]].shows[b[1]].start));
                                result[result.length - 1].push(result[result.length - 1].reduce((acc, v, i, self) => (i <= 0) ? 0 : acc + titles[self[i][0]].shows[self[i][1]].start - titles[self[i - 1][0]].shows[self[i - 1][1]].end, 0));
                            }
                        }
                    });
                    if (result.length > 0) {
                        pairs[title_index] = found;
                        //sort by gap
                        results.push(result.sort((a, b) => a[a.length - 1] - b[b.length - 1]));
                    }
                });
                //sort by gap
                results.sort((a, b) => a[0][a[0].length - 1] - b[0][b[0].length - 1]);
                if (results.length == 0) continue;
                results2.push(results);
            }
            results2.reverse().forEach(results => {
                log("■" + titles.length + "作品中" + (results[0][0].length - 1) + "作品を鑑賞する");
                results.forEach(result => {
                    log("◆作品の組合せ");
                    result.forEach(index => {
                        log("◇鑑賞 ※休憩" + index[index.length - 1] + "分");
                        index.slice(0, index.length - 1).forEach((show, i, self) => {
                            log(((i > 0) ? "(" + (titles[show[0]].shows[show[1]].start - titles[self[i - 1][0]].shows[self[i - 1][1]].end) + "分) " : "") + hhmm(titles[show[0]].shows[show[1]].start) + "-" + hhmm(titles[show[0]].shows[show[1]].end) + " " + titles[show[0]].shows[show[1]].screen + " " + titles[show[0]].title);
                        });
                    });
                });
            });
        }
    }
    site.main();
    if (site.shows) setupHashigo();
})();