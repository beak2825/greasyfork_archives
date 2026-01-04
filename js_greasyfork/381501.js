// ==UserScript==
// @name         GangPackFilter
// @namespace    http://tampermonkey.net/
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @version      0.2
// @description  try to take over the world!
// @author       Inconnu
// @run-at       document-idle
// @match        https://xthor.to/gang.php
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/381501/GangPackFilter.user.js
// @updateURL https://update.greasyfork.org/scripts/381501/GangPackFilter.meta.js
// ==/UserScript==

(function() {
    var PASS_KEY = "";

    var LISTE_TORRENT_PACK = '#ancri > div > table.colhead.layer > tbody';

    initPage();

    function initPage()
    {
        $('#ancri > div > table.colhead.layer > tbody > tr:first').append("<td colspan='3' align='center'>Achat</td>");
        $('#ancri > div > table.colhead.layer > tbody > tr:not(:first)').each(function() {
            $(this).append("<td class='revenu'><i id='getLinkBuy' class='fa fa-money fa-2x'></i></td>");
            $(this).click (getLinkBuy);
        });
    };

    function getLinkBuy()
    {
        $(this).unbind();
        var elem = $(this);
        if(elem)
        {
            elem = elem[0].cells;
            if ( elem && elem.length>0)
            {
                var torrentName  = elem[0].textContent;
                var torrentPrice = elem[1].textContent;
                getLink(torrentName, elem);
            }

        }
        console.log(elem);
    };

    function getLink(name, elem)
    {
        name = encodeURIComponent(name);
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.xthor.to/?passkey="+PASS_KEY+"&search="+name,
            onload: function(response) {
                var response_json = JSON.parse(response.responseText);
                if (response_json.torrents.length==1)
                {
                    if (name.localeCompare(response_json.torrents[0].name)==0)
                    {
                        //$(elem[3]).html(response_json.torrents[0].id);
                        getPrice(elem, response_json.torrents[0].id);
                    }
                }
                else{
                    $(elem[3]).html('<font color="red">Erreur ('+response_json.torrents.length+' resultats)</font>');
                }
            }
        });
    };

    function getPrice(elem, torrentID){
        $.ajax({
            url: "https://xthor.to/details.php?id="+torrentID,
            context: document.body,
            async : false,
            success: function(result){
                var doc = document.createElement('div');
                doc.innerHTML = result; // This way you have a dom node you can easily manipulate or iterate through
                result = $($(doc).find("a[title='Racheter ce torrent']")).text().trim().slice(0,-1).replace(/ +/g, "");

                var actual_price = elem[1].textContent;
                if (actual_price.localeCompare(result)==0)
                {
                    $(elem[1]).html('<font color="green">'+ result +'</font>');
                    $(elem[3]).html('<td class="achat" id="'+torrentID+'"><i class="fa fa-shopping-cart fa-2x"></i></td>');
                    $(elem[3]).click (buy);
                }
                else
                {
                    $(elem[1]).html('<font color="red">'+ result +'</font>');
                }

            }
        });
    }

    function buy(){
        $(this).unbind();
        var elem = $(this).find(".achat");
        var torrentID = elem.attr('id');
        buy_torrent(torrentID);
        $(this).parent().remove();
    }

    function buy_torrent(torrentID){
        $.get("https://xthor.to/gang.php?tid="+torrentID);
    }

})();