// ==UserScript==
// @name         kinozal.tv magnet links
// @namespace    none
// @version      0.2
// @description  add magnet links near to torrent links for kinozal.tv pages
// @author       vike
// @include      /^https?:\/\/kinozal.(tv|guru|me)\/details.php\?id=\d+$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14085/kinozaltv%20magnet%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/14085/kinozaltv%20magnet%20links.meta.js
// ==/UserScript==

$(function(){
    var imgURL = 'http://upload.wikimedia.org/wikipedia/commons/7/72/TPB_Magnet_Icon.gif';
    $("td[class='nw']").after('<td style="width: 20px"> <a id="magnetLink" title="Скачать раздачу используя magnet ссылку" href="#"> <img src="' + imgURL + '"/> </a> </td>');

    $("#magnetLink").click(function(){
        var result = new RegExp('id=(\\d+)').exec(window.location.href);
        var id = result[1];
        $.get('/get_srv_details.php?id=' + id + '&action=2', function(s){
            var result = new RegExp('Инфо хеш: (.\{40\})').exec(s);
            var hash = result[1];
            document.location = 'magnet:?xt=urn:btih:' + hash;
        });
    });
});
