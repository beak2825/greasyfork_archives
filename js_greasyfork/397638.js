// ==UserScript==
// @name         XAUUSD-2-AUTD
// @namespace    http://tampermonkey.net/
// @version      1.02
// @description  伦敦金 和 上海金的 换算，注意一定要搭配 uBlock ，否则广告会阻挡
// @author       You
// @match        https://www.fx110.com/
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/397638/XAUUSD-2-AUTD.user.js
// @updateURL https://update.greasyfork.org/scripts/397638/XAUUSD-2-AUTD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setInterval(convertFun, 1500);
})();

function convertFun() {
    var _xau = parseFloat($("a[data-code='XAUUSD'] > div[class='currency'] > p:eq(1)").text());
    var _chn = parseFloat($("a[data-code='USDCNH'] > div[class='currency'] > p:eq(1)").text());
    var _ozt = 31.1034768;
    var _autd = _xau / _ozt * _chn;

    var _new_div = "<div class='contact' style='text-align: center;font-size: 35px;font-weight: 400;'>上海金 "
        + _autd.toFixed(2) +
        "<span style='color: red;'>(换)</span> / ";
    var _new_url = "https://hq.sinajs.cn/?_=" + new Date().getTime() + "/&list=nf_AU0";
    console.log(_new_url);
    GM_xmlhttpRequest({
        url: _new_url,
        method: "GET",
        onload: function (dataStr) {
            //var hq_str_nf_AU0="黄金连续,092644,359.500,359.500,358.640,0.000,359.500,0.000,359.500,0.000,339.160,1488,0,170527.000,22428,沪,黄金,2020-03-24,1,,,,,,,,,359.443";
            try {
                var _data = dataStr.responseText.split("=")[1].split(",")[6]; // 当前均价

                _new_div += parseFloat(_data).toFixed(2) + "<span style='color: red;'>(主)</span>";
                var _showDiv = $("div[class='dealer_search']");
                _showDiv.children("div[class='contact']").remove();
                _showDiv.append(_new_div);
            }
            catch (err) {
                console.log(err);
            }
        }
    });
}