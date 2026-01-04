// ==UserScript==
// @name        HB 查看是否限區
// @Namespace   http://tampermonkey.net/
// @description hb download info
// @include     http*://www.humblebundle.com/*?key=*
// @version     2017.04.10.01
// @run-at      document-end
// @require     http://cdn.bootcss.com/jquery/3.1.0/jquery.min.js
// @Grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @namespace https://greasyfork.org/users/154431
// @downloadURL https://update.greasyfork.org/scripts/33619/HB%20%E6%9F%A5%E7%9C%8B%E6%98%AF%E5%90%A6%E9%99%90%E5%8D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/33619/HB%20%E6%9F%A5%E7%9C%8B%E6%98%AF%E5%90%A6%E9%99%90%E5%8D%80.meta.js
// ==/UserScript==

GM_addStyle("table{border:solid 1px;border-collapse:collapse !important;}");
GM_addStyle("td{border:solid 1px;border-collapse:collapse;padding-left:5px;padding-right:5px;font-size:16px !important;}");

var r = /var data = ({"keys".*});/.exec(document.body.innerHTML);
if (r){
    $('#headertext').append('<table id="reg"></table>');
    $('#reg').append('<tr><td>App</td><td>machineName</td><td>exclusive</td><td>disallowed</td></tr>');
    var data = JSON.parse(r[1]);
    $.each(data.keys, function (i, item) {
        var exc = '<td>-</td>';
        if (item.exclusiveCountries.length){
            exc = '<td title="' + item.exclusiveCountries + '">List</td>';
        }
        var dis = '<td>-</td>';
        if (item.disallowedCountries.length){
            dis = '<td title="' + item.disallowedCountries + '">List</td>';
        }
        $('#reg').append('<tr><td>' + item.steamAppId + '</td><td>' + item.machineName + '</td>' + exc + dis+'</tr>');
    });
}