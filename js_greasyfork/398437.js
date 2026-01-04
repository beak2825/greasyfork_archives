// ==UserScript==
// @name         Wegstatus 2 Slack
// @namespace    https://wegstatus.nl
// @version      2020.06.08.2
// @description  Sends closure request from Wegstatus to Slack.
// @author       Sjors "GigaaG" Luyckx
// @match        https://www.wegstatus.nl/roadworknl/*/

// @downloadURL https://update.greasyfork.org/scripts/398437/Wegstatus%202%20Slack.user.js
// @updateURL https://update.greasyfork.org/scripts/398437/Wegstatus%202%20Slack.meta.js
// ==/UserScript==

(function() {
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.data;
    }

    function sendSlack(rank, plaatsnaam, straatnaam, periode, permalink, wslink, username, bron, bronurl){

        var datastring = {"rank": rank , "plaats": plaatsnaam, "straat": straatnaam, "periode": periode, "pl": permalink, "ws": wslink, "username": username, "bron": bron, "bronurl": bronurl};

        $.ajax({
            url: 'https://checkfeed.waze.link/wegstatus2slack.php',
            type: "POST",
            data: datastring,
            crossDomain: true,
            success: function(response){
                console.log('Succes: ' + response);
            },
            error: function(response){
                console.log('Error: ' + JSON.stringify(response));
            }
        })
    }

    function getData(){

        var data = document.querySelector("body > div.container > div.panel.panel-primary > div").innerText.split(/\r?\n/);
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i];
            if (dataString.includes("Bron:")) {
                var bron = data[i].substr(6, data[i].length);
            } else if (dataString.includes("Periode(s):")) {
                var periode = data[i].substr(11, data[i].length);
            }
        }

        var rank
        if (bron.includes("Gemeente")) {
            rank = 3;
        } else if (bron.includes("Provincie")) {
            rank = 4;
        } else if (bron.includes("RWS")) {
            rank = 5;
        } else {
            rank = "?";
        };

        var locatie = getElementByXpath("/html/body/div[3]/h2/text()[1]");
        var straatnaam = locatie.includes(" - ");
        var plaatsnaam

        if (straatnaam) {
            plaatsnaam = locatie.substr(18, locatie.indexOf("- ") - 19);
            straatnaam = locatie.substr(locatie.indexOf("- ") + 1, locatie.length);
            straatnaam = straatnaam.trim();
        } else {
            plaatsnaam = locatie.substr(19, locatie.length);
            straatnaam = null;
        }

        if (plaatsnaam.includes("'")) {
            plaatsnaam = plaatsnaam.replace("'", "");
        }
        plaatsnaam = plaatsnaam.trim();

        periode = periode.substr(0, periode.length);
        if (periode.includes(",")){
            periode = periode.replace(/,/g, ",\r\nVan");
        }
        periode = "Van" + periode;

        periode.trim();

        var bronElement = document.querySelectorAll("body > div.container > div.panel.panel-primary > div > a").length;
        var bronURL;
        var bronText;

        if (bronElement > 3) {
            bronURL = document.querySelectorAll("body > div.container > div.panel.panel-primary > div > a")[3].href
            bronText = document.querySelectorAll("body > div.container > div.panel.panel-primary > div > a")[3].innerText;
        } else {
            bronURL = null
            bronText = null
        }

        console.log(bronURL);
        console.log(bronText);

        var permalink = document.querySelectorAll("body > div.container > div.panel.panel-primary > div > a")[0].href
        var wslink = window.location.href;

        var username = document.querySelector("#wsnavbar > ul.nav.navbar-nav.navbar-right > li.dropdown > a").innerText;
        username = username.substr(0, username.indexOf(" ")).toLowerCase();
        username = username.charAt(0).toUpperCase() + username.slice(1);

        sendSlack(rank, plaatsnaam, straatnaam, periode, permalink, wslink, username, bronText, bronURL)
    }

    var span = document.querySelector("body > div.container > h2 > a:nth-child(2)");
    var div = document.querySelector("body > div.container > h2").contains(span);

    if (div) {
        console.log("WS2Slack: User logged in.");

        var countButton = document.querySelector("body > div.container > h2").children.length

        if (countButton == 3){ // Create spacing
            document.querySelector("body > div.container > h2 > a:nth-child(3)").innerHTML += "&nbsp;"

            // Add button
            var itm = document.querySelector("body > div.container > h2").children[1];
            var cln = itm.cloneNode(true);
            document.querySelector("body > div.container > h2").appendChild(cln);
            document.querySelector("body > div.container > h2 > a:nth-child(4) > span > i").className = "fa fa-slack";
            var btn = document.querySelector("body > div.container > h2 > a:nth-child(4) > span");
            var btn1 = document.querySelector("body > div.container > h2 > a:nth-child(4)");

            // Look and feel
            btn.className = "label label-primary";
            btn1.removeAttribute("href")
            btn.style.cursor = "pointer";
            btn1.setAttribute("data-original-title", "Plaats op Slack");
            btn1.addEventListener ("click", getData, false);
        }
    } else {
        console.log("WS2Slack: User not logged in.");
    }

})();