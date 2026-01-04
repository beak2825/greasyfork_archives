// ==UserScript==
// @name         steamcn_rank
// @namespace    http://tampermonkey.net/
// @version      2023.10.09.1
// @description  steamcn rank
// @author       jacky
// @license     MIT
// @match        https://keylol.com/steamcn_steam_connect-statistics.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keylol.com
// @run-at      document-end
// @require     http://cdn.bootcss.com/jquery/3.1.0/jquery.min.js
// @connect     woowoo.top
// @connect     steamdb.keylol.com
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @grant       unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/476141/steamcn_rank.user.js
// @updateURL https://update.greasyfork.org/scripts/476141/steamcn_rank.meta.js
// ==/UserScript==

GM_addStyle("table{border:solid 1px;border-collapse:collapse;font-size:16px !important;}");
GM_addStyle("tr,td{border:solid 1px;border-collapse:collapse;padding-left:5px;padding-right:5px !important;}");
GM_addStyle(".d{font-size:16px;color:white !important;}");

$('.steam_connect_statistics_header').after('<table id="a"></table>');
$('.steam_connect_statistics_table_playtime:eq(7)').find("tbody tr").each(function(i,v){
    var d = $(this).children('td');
    var h = $(d[1]);
    var id = 0;
    var m = /uid=([0-9]+)/.exec(h.html());
    if (m)
        id = m[1];
    var n = $(d[3]).text();
    $('#a').append(`<tr id="${id}"><td>${id}</td><td>${h.text()}</td><td>${n}</td></tr>`);
    h = $(d[2]);
    var nid = '';
    m = /(profiles|id)\/([^\/"]+)/.exec(h.html());
    if (m) {
        var s = '';
        switch(m[1]) {
            case "id":
                s = `https://woowoo.top/person.php?nick=${m[2]}`;
                break;

            case "profiles":
                s = `https://woowoo.top/person.php?id=${m[2]}`;
                break;
        }
        fetch(id, s);
    }
});

function fetch(id, s){
    GM_xmlhttpRequest({
        method: "GET",
        url: s,
        onload: function(response) {
            var r = JSON.parse(response.responseText);
            if (r) {
                $(`#${id}`).append(`<td>${r.id}</td><td>${r.name}</td><td>${r.nick}</td><td>${r.friends}</td><td>${r.level}</td><td>${r.games}</td>`);
                fetch2(id, r.id);
            }
        },
        onerror:  function(response) {
            console.log(response);
        },
        ontimeout:  function(response) {
            console.log(response);
        },
    });
}

function fetch2(id, s){
    GM_xmlhttpRequest({
        method: "GET",
        url: `https://steamdb.keylol.com/syncProxy.php?type=own&id=${s}`,
        onload: function(response) {
            var r = JSON.parse(response.responseText);
            if (r)
                $(`#${id}`).append(`<td>${r.response.game_count}</td>`);
        },
        onerror:  function(response) {
            console.log(response);
        },
        ontimeout:  function(response) {
            console.log(response);
        },
    });
}