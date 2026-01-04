// ==UserScript==
// @name         neutrinoapi
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  IP aggregated bloclists
// @author       SRI
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAJ1BMVEUAAAAJcqUJcqUJcqUJcqUJcqUJcqUJcqUJcqUJcqUJcqUJcqX///+1kTJKAAAAC3RSTlMAbad/i8PU3jg10Z66FNsAAAABYktHRAyBs1FjAAAAB3RJTUUH4gsNFC4joK2KFwAAADdJREFUCNdjEFJSUlJmcFJk0N69e/dWhuxNDNrbO1dDGNsYomnH2DWjGsIA2ruJQUiFwQjoEkUAm5Mwapl/HWIAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMTEtMTRUMDM6NDY6MzUtMDc6MDC1HNn+AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTExLTE0VDAzOjQ2OjM1LTA3OjAwxEFhQgAAAABJRU5ErkJggg==
// @connect      neutrinoapi.com
// @match        https://www.neutrinoapi.com/ant/
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/374357/neutrinoapi.user.js
// @updateURL https://update.greasyfork.org/scripts/374357/neutrinoapi.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var user_id = 'rich_piscine';
    var api_key = 'RIRiydPBOL6ewrjdF0Q6e63XwJhMVXD1qJL2ck0Q7DMYMfmA';

    document.head.innerHTML = '';
    document.body.innerHTML = '';
    document.body.style.backgroundColor = "darkgray";
    document.head.innerHTML = '<meta name="viewport" content="width=device-width, initial-scale=1">';
    document.head.innerHTML = '<link rel="stylesheet" href="https://unpkg.com/purecss@1.0.0/build/pure-min.css" integrity="sha384-nn4HPE8lTHyVtfCBi5yW9d20FjT8BJwUXyWZT9InLYax14RDjBj46LmSztkmNP9w" crossorigin="anonymous">';

    if (api_key === "") {
        alert("Vous n'avez pas renseigné d'API key");
        window.location.href = "https://www.neutrinoapi.com/signup/";
    } else {
        var ip = prompt("neutrinoapi", "196.52.43.0");
    }

    function blocklist() {
        var api_blocklist = "https://neutrinoapi.com/ip-blocklist";
        var params = 'ip='+ip+'&user-id='+user_id+'&api-key='+api_key;
        GM.xmlHttpRequest({
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: params,
            url: api_blocklist,
            onload: function(response) {
                var res = JSON.parse(response.responseText);
                var display = '<table class="pure-table pure-table-horizontal" style="margin: 30px 0px 0px 40%;">'
                display += '<thead><tr><td>ip'+'</td><td>'+res['ip']+'</td></tr></thead>'
                display += '<tbody style="background-color: white;"><tr><td>is-listed'+'</td><td>'+res['is-listed']+'</td></tr>'
                display += '<tr><td>list-count'+'</td><td>'+res['list-count']+'</td></tr>'
                display += '<tr><td>blocklists'+'</td><td>'+res['blocklists']+'</td></tr>'
                display += '<tr><td>is-proxy'+'</td><td>'+res['is-proxy']+'</td></tr>'
                display += '<tr><td>is-tor'+'</td><td>'+res['is-tor']+'</td></tr>'
                display += '<tr><td>is-vpn'+'</td><td>'+res['is-vpn']+'</td></tr>'
                display += '<tr><td>is-malware'+'</td><td>'+res['is-malware']+'</td></tr>'
                display += '<tr><td>is-spyware'+'</td><td>'+res['is-spyware']+'</td></tr>'
                display += '<tr><td>is-dshield'+'</td><td id="dshield">'+res['is-dshield']+'</td></tr>'
                display += '<tr><td>is-hijacked'+'</td><td>'+res['is-hijacked']+'</td></tr>'
                display += '<tr><td>is-spider'+'</td><td>'+res['is-spider']+'</td></tr>'
                display += '<tr><td>is-bot'+'</td><td>'+res['is-bot']+'</td></tr>'
                display += '<tr><td>is-spam-bot'+'</td><td>'+res['is-spam-bot']+'</td></tr>'
                display += '<tr><td>is-exploit-bot'+'</td><td>'+res['is-exploit-bot']+'</td></tr>'
                display += '<tr><td>abuseipdb'+'</td><td>'+'<a href="https://www.abuseipdb.com/check/'+res['ip']+'" target="_blank">Check</a>'+'</td></tr>'
                display += '<tr><td>ipinfo.io'+'</td><td>'+'<a href="https://ipinfo.io/'+res['ip']+'" target="_blank">Check</a>'+'</td></tr>'
                display += '</tbody></table> '
                document.body.innerHTML = display;
                document.title = res['ip'];
                $('td').each(function(){
                    var find_true = $(this).text();
                    if (find_true.indexOf("true") >= 0) {
                        $(this).css("background-color","#ff5050e6");
                    } else if (find_true.indexOf("false") >= 0) {
                        $(this).css("background-color","#07b007");
                    }
                });
                $('tr').each(function(){
                    $(this).children('td').eq(1).css("text-align","center");
                });
                $("thead").css("font-weight","bold");
                if( $('#dshield').text() == 'true' ) {
                    $('#dshield').html('<a target="_blank" href="https://www.dshield.org/ipinfo.html?ip='+ip+'">Lien</a>');
                }
            }
        });
    }
    blocklist();
})();