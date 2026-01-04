// ==UserScript==
// @name       Fanansehen AT
// @include  http://fussballcup.at/*
// @version    0.1.3
// @description  Zeigt das Fanansehen auf der Fussballcup-Startseite an.
// @copyright  Klaid, 2013 - edited by mot33, 2018
// @grant       GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/83290
// @downloadURL https://update.greasyfork.org/scripts/40013/Fanansehen%20AT.user.js
// @updateURL https://update.greasyfork.org/scripts/40013/Fanansehen%20AT.meta.js
// ==/UserScript==
window.setTimeout(function() { change(); }, 2500);
window.setInterval(function() { change(); }, 5000);
function change()
{
    	if(!document.getElementById("ansehen"))
        {
    		document.getElementById("clubinfocard").innerHTML += "<div id='ansehen'></div>";
		}
    
        GM_xmlhttpRequest({
        method: "GET",
        url: "http://fussballcup.at/index.php?w=301&area=user&module=publicrelations&action=index#/index.php?w=301&area=user&module=publicrelations&action=index&_=*",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
         onload: function(responseDetails){
            var inhalt = responseDetails.responseText;
            var position = inhalt.indexOf('Fanansehen');
            var ansehen_site = inhalt.substr(position, 50);
            ansehen = ansehen_site.match(/[0-9]{1,10}/);
            if(ansehen >= 90 && ansehen < 98)
            {
             	ansehen = "<font color='yellow'>"+ String(ansehen) +"&#37;</font>";   
            }
            else if(ansehen < 90)
            {
                ansehen = "<font color='red'>"+ String(ansehen) +"&#37;</font>"; 
            }
            else
            {
                ansehen = String(ansehen) +"&#37;";
            }
            document.getElementById("ansehen").innerHTML = "<b style='font-size: 13px; margin-left: 6px'>Fanansehen: "+ String(ansehen) +"</b>";
        }	
      });
}