// ==UserScript==
// @name         Panther Refresh
// @namespace    https://greasyfork.org/en/scripts/12086
// @version      0.52
// @description  Refresh/Filter
// @author       Daniel Nichols
// @match        http://brokerweb.pantherpremium.com/open.asp?tab=open
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12086/Panther%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/12086/Panther%20Refresh.meta.js
// ==/UserScript==
var ids = [];
var player = document.createElement('audio');
player.src = 'https://dl.dropbox.com/u/7079101/coin.mp3';
player.preload = 'auto';
if (getCookie('ids'))
    ids = JSON.parse(getCookie('ids'));

function refreshIframe()
{
    document.getElementById('ifrmTabData').contentWindow.location.reload();
    window.setTimeout(loaded, 5000);
}
function loaded()
{

    var iframe = document.getElementById('ifrmTabData');
    var innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    var table = innerDoc.getElementById("TabDataGrid_ctl00");
    if(!table){
        window.setTimeout(loaded, 1000);
        return;
    }
    for (var i = 0, row; row = table.rows[i]; i++) {
        var tmp = row.cells[2].innerText;
        if(ids.indexOf(tmp) == -1){
            ids.push(tmp);
            console.log(tmp);
            player.play()
        }
        
    }
    createCookie('ids', JSON.stringify(ids),1);
}
function load()
{
    var x = setTimeout('alert("x");',100000);//destroy all other timers
    for (var i = 0; i <= x; i++)
        clearTimeout(x);
    window.setInterval(refreshIframe, 20000);
    window.setTimeout(loaded, 2000);
}

var createCookie = function(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

window.setTimeout(load, 1000);