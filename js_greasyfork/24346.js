// ==UserScript==
// @name         SeedHelper for T411
// @version      2.0
// @namespace    https://www.t411.ai
// @description  Permet de trier les torrent pertients pour le ratio
// @author       M1st3rN0b0d7
// @match        https://www.t411.ai/torrents/search/*
// @match        https://www.t411.ai/top/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/24346/SeedHelper%20for%20T411.user.js
// @updateURL https://update.greasyfork.org/scripts/24346/SeedHelper%20for%20T411.meta.js
// ==/UserScript==

function seedHelper_main() {

    var tab = [];

    $("table tr").each(function() {

        var arrayOfThisRow = [];
        var tableData = $(this).find('td');

        if (tableData.length > 0) {

            tableData.each(function() {

                arrayOfThisRow.push($(this)[0]);
            });

            tab.push(arrayOfThisRow);

        }

    });

    for (var ligne = 0; ligne < tab.length - 2; ligne++) {

        if(tab[ligne][4].innerText == "1 minutes"){
            tab[ligne][4].innerText = "1 minute";
        }

        if(tab[ligne][4].innerText == "1 heures"){
            tab[ligne][4].innerText = "1 heure";
        }

        var time = tab[ligne][4].innerText;
        var unit = time.replace(/[0-9]/g, "").trim();

        function recommend(){

            var recommended = document.createElement("a");
            recommended.className = "recommended";
            recommended.innerText = "Recommandé";
            recommended.style.color = "white";
            recommended.style.backgroundColor = "green";
            recommended.style.padding = "3px";
            recommended.style.borderRadius = "3px";
            recommended.href = tab[ligne][1].getElementsByTagName("a")[0].href;
            recommended.setAttribute("target", "_blank");
            tab[ligne][1].getElementsByTagName("a")[1].parentNode.insertBefore(recommended, tab[ligne][1].getElementsByTagName("a")[1]);

        }

        if (parseInt(tab[ligne][8].innerText) > parseInt(tab[ligne][7].innerText)
            && parseInt(tab[ligne][7].innerText) > 0
            && (parseInt(tab[ligne][8].innerText) - parseInt(tab[ligne][7].innerText)) >= 2
            && typeof(tab[ligne][1].getElementsByClassName("pending")[0]) == "undefined") {

            if (unit == "heure" && parseInt(time) == 1) {

                tab[ligne][8].style.backgroundColor = "yellow";
                tab[ligne][4].style.color = "white";
                tab[ligne][4].style.backgroundColor = "green";
                recommend();

            }

            if ((unit == "minute" || unit == "minutes") && parseInt(time) <= 59) {

                tab[ligne][8].style.backgroundColor = "yellow";
                tab[ligne][4].style.color = "white";
                tab[ligne][4].style.backgroundColor = "green";
                recommend();

            }

        }

        if ((unit == "minute" || unit == "minutes") && parseInt(time) <= 20
            && parseInt(tab[ligne][7].innerText) > 0
            && typeof(tab[ligne][1].getElementsByClassName("pending")[0]) == "undefined") {

            tab[ligne][4].style.color = "white";
            tab[ligne][4].style.backgroundColor = "green";
            recommend();

        }

        if (parseInt(tab[ligne][7].innerText) == 0) {

            tab[ligne][7].setAttribute('style', 'color: white!important');
            tab[ligne][7].style.backgroundColor = "red";

        }

        if (tab[ligne][1].getElementsByClassName("pending")[0] !== undefined
            && tab[ligne][1].getElementsByClassName("pending")[0].innerText == "(P)") {

            tab[ligne][1].getElementsByTagName("a")[0].style.textDecoration = "line-through";
            tab[ligne][1].getElementsByTagName("a")[0].style.fontWeight = "normal";
            tab[ligne][1].getElementsByTagName("a")[0].href = "#";

        }

    }

}

function seedHelper_toolbar(){

    var up = parseFloat(document.getElementsByClassName("up")[0].innerText.replace(/[^0-9.]/g, ""));
    var up_unit = document.getElementsByClassName("up")[0].innerText.replace(/[^a-zA-Z]/g, "");
    if(up_unit == "TB") up = up * 1024;
    if(up_unit == "MB") up = up / 1024;
    var down = parseFloat(document.getElementsByClassName("down")[0].innerText.replace(/[^0-9.]/g, ""));
    var down_unit = document.getElementsByClassName("down")[0].innerText.replace(/[^a-zA-Z]/g, "");
    if(down_unit == "TB") down = down * 1024;
    if(down_unit == "MB") down = down / 1024;
    var gigasRestants = (up - down).toFixed(2) + " Go";
    var toolbar = document.getElementsByClassName("block")[2].getElementsByTagName("h2")[0].getElementsByTagName("span")[0];
    var seedHelperInfo = '| <b>[SeedHelper]</b> <a href="#" id="openAllLinks">Ouvrir tous les liens recommandés</a> | DL restant avant ratio à 1 : ' + gigasRestants;
    toolbar.innerHTML = toolbar.innerHTML + seedHelperInfo;

    document.getElementById("openAllLinks").onclick = function openAllLinks(){

        var links = document.getElementsByClassName("recommended");
        for (var i = 0; i < links.length; i++){
            window.open(links[i]);
        }

    }

}

seedHelper_main();

if(window.location.href.indexOf("search") > -1){

    seedHelper_toolbar();

}
