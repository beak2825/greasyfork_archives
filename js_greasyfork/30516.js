// ==UserScript==
// @name       Ausbauanzeige
// @include  https://fussballcup.de/*
// @author mot33
// @version    0.1.4
// @description  Zeigt den aktuellen Ausbau des Stadions
// @copyright mot33, 2017
// @grant  GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/83290
// @downloadURL https://update.greasyfork.org/scripts/30516/Ausbauanzeige.user.js
// @updateURL https://update.greasyfork.org/scripts/30516/Ausbauanzeige.meta.js
// ==/UserScript==

window.setTimeout(function () { work(); }, 2700);
window.setInterval(function() { work(); }, 5000);



//################ Ausbau #################

// ############### CONFIGURATION ###############
var icon_path = "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Piktogramm_Baustelle.svg/370px-Piktogramm_Baustelle.svg.png";
var icon_config = "width='16px'";
// ######################################

function work() {
    if (!document.getElementById("count")) {
        document.getElementById("clubinfocard").getElementsByTagName("ul")[0].innerHTML += "<li id='count'><span class='label'>Ausbau:</span>wird geladen...</li>";
        document.getElementsByClassName("likebox")[0].style.marginBottom = "-40px";
    }

    GM_xmlhttpRequest({
        method: "GET",
        url: "http://fussballcup.de/index.php?w=301&area=user&module=stadium&action=index&_=squad",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        onload: function (responseDetails) {
            var inhalt = document.implementation.createHTMLDocument("");
            inhalt.documentElement.innerHTML = responseDetails.responseText;
            var countdown = inhalt.getElementsByClassName("countdown");
            if (countdown[0]) {
                document.getElementById("count").innerHTML = "<li id='count'><span class='label'>Ausbau:</span> " + countdown[0].getAttribute("x");
// restliche Tage errechnen
                var s = parseInt(countdown[0].getAttribute("x"), 10);
                var time = [];
                var str = (
                    [24, 60, 60].reduceRight(
                        function (rest, div) {
                            var r = rest % div;
                            time.unshift(r);
                            return Math.floor(rest / div);
                        },
                        s
                        //An die Zeit die Tage und dann die restlichen Stunden
                    ) + " Tag(e) " + time.map(function (n) { return n < 10 ? "0" + n : n.toString(10); }).join(":")
                );
                
                    document.getElementById("count").innerHTML = "<li id='count'><img " + icon_config + " src='" + icon_path + "' />" + "<span class='label'>Ausbau:</span> " + str + "</li>";
                
            } else {
                 document.getElementById("count").innerHTML  = "<li id='count'><img " + icon_config + " src='" + icon_path + "' />" + "<span class='label'>Ausbau:</span>&nbsp"+"<a href='#/index.php?w=301&area=user&module=stadium&action=index&squad=" + "'<span style='color: red;'>Abgeschlossen!</span>";
            }

        }
    });
}
