// ==UserScript==
// @name Nemokami filmai.in filmai (be prisijungimo)
// @description Žiūrėkite filmus be prisijungimo ir be jokių taškų svetainėje filmai.in
// @namespace erkexzcx
// @match https://filmai.in/*
// @match https://www.filmai.in/*
// @match http://filmai.in/*
// @match http://www.filmai.in/*
// @version 1.1
// @grant GM_xmlhttpRequest
// @connect filmai.in
// @downloadURL https://update.greasyfork.org/scripts/387023/Nemokami%20filmaiin%20filmai%20%28be%20prisijungimo%29.user.js
// @updateURL https://update.greasyfork.org/scripts/387023/Nemokami%20filmaiin%20filmai%20%28be%20prisijungimo%29.meta.js
// ==/UserScript==

var tmp = document.querySelector('div[data-id]');
if (tmp === null){ return; } // if not a movie page - exit

var filmId = tmp.getAttribute('data-id');
var csrfToken = /token:'(\w+)'/gmi.exec(document.documentElement.innerHTML)[1];

var form = new FormData();
form.append("do", "post_inline_actions");
form.append("pid", filmId);
form.append("action", "play");
form.append("object", "furl");
form.append("player", "html5");
form.append("token", csrfToken);
form.append("chDPts", "0");

var headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36",
    "Cookie": "PHPSESSID=bmt4r5onq6q4fo0t8vip13vr75; voxhttp=h1|XRUdZ|XRUKI",
    "Content-Type": "application/x-www-form-urlencoded"
}
GM_xmlhttpRequest ( {
    method: "POST",
    url: "http://filmai.in/index.php",
    mimeType: "multipart/form-data",
    data: form,
    onload: function (response) {
        var obj = JSON.parse(response.responseText);
        changeUi(obj.link);
    }
});

function changeUi(link){
    //alert(link);
    var buttonhtml = '<div id="userscriptButton" class="don_b02" style="background-color: blue; margin-top: 5px;">ŽIŪRĖTI/SIŲSTIS NEMOKAMAI <small><i>(script)</i></small></div>';
    document.querySelector('.movDesc .don_b01 > .don_b02').insertAdjacentHTML('afterend', buttonhtml);
    document.getElementById("userscriptButton").addEventListener("click", function(){
        var win = window.open(link, '_blank');
        win.focus();
    });
}