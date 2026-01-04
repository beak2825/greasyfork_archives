// ==UserScript==
// @name         parse
// @namespace    parse
// @version      1602645931820
// @@updateURL   http://daboss.f3322.net:44444/monkey/parse
// @description  parse1
// @author       parse
// @include        http*:zq.win007.com/analysis/*
// @run-at       document-end
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.0/jquery.min.js
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/413164/parse.user.js
// @updateURL https://update.greasyfork.org/scripts/413164/parse.meta.js
// ==/UserScript==
(function () {
    let $title = $("head > title");
    $title.text($title.text().split("）")[1]);
    $("div[class=header]").css("display", "none");

    eleNone();
    showRanking();
    $("#webmain").width(1000);

    function eleNone() {
        $("#porlet_4").css("display", "none");
        $("#porlet_7").css("display", "none");
        $("#porlet_9").css("display", "none");
        $(".fx_title2").css("height", "20px").css("line-height", "20px");
        for (let i = 0; i < 10000; i++) {
            window.clearTimeout(i)
        }
    }

    function showRanking() {
        let vTrs = $("#v > table tr");
        handleTitle(vTrs, 2, 6, "：");
        let hTrs = $("#h > table tr");
        handleTitle(hTrs);
        let aTrs = $("#a > table tr");
        handleTitle(aTrs);
        let h2Trs = $("#h2 > table tr");
        handleTitle(h2Trs);
        let a2Trs = $("#a2 > table tr");
        handleTitle(a2Trs);
    }

    function handleTitle(obj, index, i2, splitStr) {
        index = !index ? 1 : index;
        i2 = !i2 ? 5 : i2;
        splitStr = !splitStr ? ":" : splitStr;
        let len = obj.length;
        if (len > 3) {
            for (let i = index; i < len - 1; i++) {
                let tr = obj.eq(i);
                if (i <= (index == 2 ? 7 : 6) && i != len - 1) {
                    let zSpan = tr.children("td:nth-of-type(3)").find("span[title]");
                    zSpan = zSpan.length > 0 ? zSpan : tr.children("td:nth-of-type(3)").find("font")
                    let zText = zSpan.text();
                    let zTile = zSpan.attr("title") ? zSpan.attr("title") : "";
                    let zRanking = zTile.split(splitStr)[1] ? zTile.split(splitStr)[1].trim() : "";
                    zSpan.text(zText + '[ ' + zRanking + ' ]');
                    let kSpan = tr.children("td:nth-of-type(" + i2 + ")").find("span[title]");
                    kSpan = kSpan.length > 0 ? kSpan : tr.children("td:nth-of-type(" + i2 + ")").find("font");
                    let kText = kSpan.text();
                    let kTitle = kSpan.attr("title") ? kSpan.attr("title") : "";
                    let kRanking = kTitle.split(splitStr)[1] ? kTitle.split(splitStr)[1].trim() : "";
                    kSpan.text(kText + '[ ' + kRanking + ' ]');
                } else tr.css("display", "none");
            }
        }
    }
})();