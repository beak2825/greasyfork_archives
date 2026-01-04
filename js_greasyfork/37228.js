// ==UserScript==
// @name         FBX系统格式化导出为xls
// @version      0.4
// @description  将FBX系统当前搜索所有结果（包含后几页）数据导出为xls
// @author       QHS
// @include      *fba.valsun.cn/index.php?mod=preAlertManager*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/155548
// @downloadURL https://update.greasyfork.org/scripts/37228/FBX%E7%B3%BB%E7%BB%9F%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%AF%BC%E5%87%BA%E4%B8%BAxls.user.js
// @updateURL https://update.greasyfork.org/scripts/37228/FBX%E7%B3%BB%E7%BB%9F%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%AF%BC%E5%87%BA%E4%B8%BAxls.meta.js
// ==/UserScript==

!function() {
    function e(t) {
        $.get(t, function(t) {
            var p = parseInt($(t).find("span.page").children("a").eq(0).text().match(/([^ ]+)\/([^\/]+)页 $/)[1]), m = parseInt($(t).find("span.page").children("a").eq(0).text().match(/([^ ]+)\/([^\/]+)页 $/)[2]), u = p / m;
            if ($(".white_d").css("left", 598 * u), $("p._page font._p1").html("正在抓取第 " + (p + 1) + " 页数据 (共 " + m + " 页)  -  " + i(u, 1)), 
            $(t).find(".w_ListTable tbody tr").each(function(e) {
                x++, o = $(this).children("td").eq(4).html().match(/^([^<])*/i)[0], a = $(this).children("td").eq(4).html().match(/([^>])*$/i)[0], 
                s = $(this).children("td").eq(4).children("span:first").text(), r = $(this).children("td").eq(2).html().match(/^([^<])*/i)[0], 
                l = $(this).children("td").eq(2).html().match(/([^>])*$/i)[0], d = $(this).children("td").eq(16).html(), 
                c = $(this).children("td").eq(17).html().match(/^([^<])*/i)[0], 2 == $(this).children("td:eq(4)").children("span").length && (g = $(this).children("td:eq(4)").children("span:eq(1)").text().replace(" ", "")[1]), 
                $("#_xls_o").append("<tr><td>" + x + "</td><td>" + r + "</td><td>" + l + "</td><td>" + o + "</td><td>" + s + "</td><td>" + a + "</td><td>" + d + "</td><td>" + c + "</td><td>" + g + "</td></tr>");
            }), h % f == 0 && (n("_xls_o"), $("#_xls_o").html(""), $("p._page font._p2").html("因文件大小限制将自动每" + f / 10 + "K条分段，已下载分段[" + h / f + "]")), 
            0 == $(t).find(".lastpage").length) $("p._page font._p1").html("抓取完成"), $("p._page").removeClass("_fetching"), 
            $("p._page").addClass("_fetched"), n("_xls_o"); else {
                e($(t).find(".lastpage").attr("href"));
            }
            h++;
        });
    }
    function t() {
        var e = window.navigator.userAgent;
        return e.indexOf("MSIE") >= 0 ? "ie" : e.indexOf("Firefox") >= 0 ? "Firefox" : e.indexOf("Chrome") >= 0 ? "Chrome" : e.indexOf("Opera") >= 0 ? "Opera" : e.indexOf("Safari") >= 0 ? "Safari" : void 0;
    }
    function n(e) {
        if ("ie" == t()) {
            var n = document.getElementById(e), i = new ActiveXObject("Excel.Application"), o = i.Workbooks.Add(), a = o.Worksheets(1), s = document.body.createTextRange();
            s.moveToElementText(n), s.select(), s.execCommand("Copy"), a.Paste(), i.Visible = !0;
            try {
                var r = i.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
            } catch (e) {
                print("Nested catch caught " + e);
            } finally {
                o.SaveAs(r), o.Close(savechanges = !1), i.Quit(), i = null, p = window.setInterval("Cleanup();", 1);
            }
        } else m(e);
    }
    function i(e, t) {
        return e = parseFloat(e), t = parseFloat(t), isNaN(e) || isNaN(t) ? "-" : t <= 0 ? "0%" : Math.round(e / t * 1e4) / 100 + "%";
    }
    GM_addStyle("p._fetched { background: #7AFF88; } p._fetching { background: linear-gradient(to right, #abffb4 45%, #e9ffeb 50%,#abffb4 55%); background-size: 2000px 200px; animation: _loading 1.5s linear .1s infinite normal; -moz-animation: _loading 1.5s linear .1s infinite normal; -webkit-animation: _loading 1.5s linear .1s infinite normal; -o-animation: _loading 1.5s linear .1s infinite normal; } @keyframes _loading { 0% { background-position-x: 1000px; } 50% { background-position-x: 1700px; } 100% { background-position-x: 1700px; } } @-webkit-keyframes _loading { 0% { background-position-x: 1000px; } 50% { background-position-x: 1700px; } 100% { background-position-x: 1700px; } } @-moz-keyframes _loading /* Firefox */ { 0% { background-position-x: 1000px; } 50% { background-position-x: 1700px; } 100% { background-position-x: 1700px; } } @-o-keyframes _loading /* Opera */ { 0% { background-position-x: 1000px; } 50% { background-position-x: 1700px; } 100% { background-position-x: 1700px; } } ._down_xls { cursor: pointer; } #_xls_o { display: none; } ._fetch { cursor: pointer; } ._fetch:hover { background: #b8f2ff; } p._hide:hover { background: #000; color: #fff } div._page { display: none; width: 600px; height: 300px; position: fixed; background: #fff; top: 50%; left: 50%; margin: -150px 0 0 -300px; border: 1px solid #000; z-index: 999999999; } p._page { transition: .4s; margin-bottom: 30px; height: 0px; padding: 100px; font-size: 20px; text-align: center; position: relative; overflow: hidden; } ._pall { position: relative; width: 100%; height: 100%; position: absolute; left: 0; right: 0; margin-top: -100px; padding-top: 100px; } font.white_d { transition: .4s; background: #fff; width: 100%; height: 100%; display: block; margin: 0; position: absolute; top: 0; left: -598px; } p._btn { transition: .4s; text-align: center; padding: 5px 10px; border: 1px solid #000; display: block; margin: 0px 70px; cursor: pointer; }"), 
    $("#caculatePreAlert").parent().after('<li><input type="button" value="导出所有数据" class="Sea_Green" id="xls" style="background:#f17979"></li>'), 
    $("body").prepend('<table id="_xls_o"><tr><th>number</th><th>site</th><th>account</th><th>sku</th><th>sellerSku</th><th>fnsku</th><th>status</th><th>seller</th><th>呆滞</th></tr></table><div class="_page"><p class="_page"><font class="white_d"></font><font class="_pall _fetch"><font class=_p1>点击此处开始抓取</font><br><font class=_p2></font></font></p><p class="_hide _btn">隐藏窗口</p></div>'), 
    $("#search_form").on("click", "#xls", function() {
        $("div._page").slideDown();
    }), $("body").on("click", "._fetch", function() {
        $("._fetch").removeClass("_fetch"), $("p._page").addClass("_fetching"), $("p._page font._p1").html("正在抓取" + $("span.page").children("a").eq(0).text().match(/ [^ ]* $/)[0]), 
        e(window.location.href);
    }), $("body").on("click", "._hide", function() {
        $("div._page").slideUp();
    });
    var o, a, s, r, l, d, c, p, h = 1, f = 50, x = 0, g = "", m = function() {
        var e = function(e) {
            return window.btoa(unescape(encodeURIComponent(e)));
        }, t = function(e, t) {
            return e.replace(/{(\w+)}/g, function(e, n) {
                return t[n];
            });
        };
        return function(n, i) {
            n.nodeType || (n = document.getElementById(n));
            var o = {
                worksheet: i || "FBX数据",
                table: n.innerHTML
            };
            window.location.href = "data:application/vnd.ms-excel;base64," + e(t('<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="Content-Type" charset=utf-8"><head>\x3c!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--\x3e</head><body><table>{table}</table></body></html>', o));
        };
    }();
    $("body").on("click", "p._down_xls", function() {
        n("_xls_o");
    });
}();