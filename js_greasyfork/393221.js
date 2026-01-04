// ==UserScript==
// @name            BlackNetAntiHack
// @author          Kirjah
// @include         https://cybertown.fr/*
// @include         https://www.cybertown.fr/*
// @grant           GM_xmlhttpRequest
// @grant           GM_addStyle
// @description     Partage vos informations MIDA au réseau BlackNet
// @version 1.2.1
// @namespace https://greasyfork.org/users/6386
// @downloadURL https://update.greasyfork.org/scripts/393221/BlackNetAntiHack.user.js
// @updateURL https://update.greasyfork.org/scripts/393221/BlackNetAntiHack.meta.js
// ==/UserScript==

GM_addStyle ( `
table, th, td {
  border: 1px solid black;
}
` );

// Bypass CORS
/*
(function() {
    var cors_api_host = 'corgs.bacon-network.net';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var slice = [].slice;
    var origin = window.location.protocol + '//' + window.location.host;
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        var args = slice.call(arguments);
        var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        return open.apply(this, args);
    };
})(); */

// On récupère l'action
function getAction() {
    var action = document.getElementById("action").textContent;
    return action
}

// On récupère le texte d'un élement (WIP)

function retrieveElementContent(element) {
  return document.getElementById(element).innerText;
}

$(document).ready ( function() {
window.setInterval(function() {



// On déclare les variables d'état du personnage

var pseudo = retrieveElementContent("pseudoig");
var sante = retrieveElementContent("santecontrol");
var forme = retrieveElementContent("formecontrol");
var faim = retrieveElementContent("alimfaim").replace(/\D/g,'');
var soif = retrieveElementContent("alimsoif").replace(/\D/g,'');
var stinfo = retrieveElementContent("inf");
var isatwork = (getAction().includes("travaillez") == 1) ? "true":"false";
var isasleep = getAction().includes("reposez");
var lastcheck = new Date();

//On forge le POST

var url = 'https://blacktools.bacon-network.net/post_state.php';
var params = {
  perso: pseudo ,
  isWorking: isatwork ,
  info: stinfo ,
  pv: sante ,
  pf: forme ,
  manger: faim ,
  boire: soif ,
  lastseen: lastcheck.toString().slice(0,25) ,
};

// Envoi des infos

var xhr = new XMLHttpRequest();
xhr.open('POST', url, true);
xhr.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
xhr.onreadystatechange = function() {
    if(xhr.readyState == 4 && xhr.status == 200) {
        console.log(xhr.responseText);
    }
}
xhr.send("data="+JSON.stringify(params));
},5000);
});

// On récupère les données

window.setInterval(function() {

var rmBlacktoolDiv = document.getElementById('blacktool');

    if ( $( "#blacktool").length ){
          rmBlacktoolDiv.parentNode.removeChild(rmBlacktoolDiv);
    };

    // On génère la div pour incorporer le tableau
var blacktoolDiv = document.createElement('div');
blacktoolDiv.setAttribute('id', 'blacktool');
blacktoolDiv.setAttribute('style', 'background-color:#7C7C7C;border:3px solid #7C7C7C;-shadow: 2px 2px 7px 1px #7C7C7C;position:absolute;bottom:10px;width: 25%;');
document.getElementById('maincontent').appendChild(blacktoolDiv);
    var el_up = document.getElementById("blacktool");

    var list = (function () {
    var json = null;
    $.ajax({
        'async': false,
        'global': false,
        'url': "https://blacktools.bacon-network.net/get_state.php",
        'dataType': "json",
        'success': function (data) {
            json = data;
        }
    });
    return json;
})();

    el_up.innetHTML = "blacktool"
    + "Beep boop.<br><br>"
    + JSON.stringify(list[0]) + "<br>"
    + JSON.stringify(list[1]) + "<br>"
    + JSON.stringify(list[2]) + "<br>"

		function constructTable(selector) {

			// Getting the all column names
			var cols = Headers(list, selector);

			// Traversing the JSON data
			for (var i = 0; i < list.length; i++) {
				var row = $('<tr/>');
				for (var colIndex = 0; colIndex < cols.length; colIndex++)
				{
					var val = list[i][cols[colIndex]];

					// If there is any key, which is matching
					// with the column name
					if (val == null) val = "";
						row.append($('<td/>').html(val));
				}

				// Adding each row to the table
				$(selector).append(row);
			}
		}

		function Headers(list, selector) {
			var columns = [];
			var header = $('<tr/>');

			for (var i = 0; i < list.length; i++) {
				var row = list[i];

				for (var k in row) {
					if ($.inArray(k, columns) == -1) {
						columns.push(k);

						// Creating the header
						header.append($('<th/>').html(k));
					}
				}
			}

			// Appending the header to the table
			$(selector).append(header);
				return columns;
        }
        constructTable('#blacktool');

},5000);