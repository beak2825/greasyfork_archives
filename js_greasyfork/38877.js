// ==UserScript==
// @name         Wer ist Meister?
// @namespace    http://tampermonkey.net/
// @include      http://fussballcup.de/*
// @version      0.2.3
// @description  try to take over the world!
// @author       Sempervivum 2017
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://unpkg.com/sweetalert2@7.0.6/dist/sweetalert2.all.js
// @require https://greasyfork.org/scripts/39979-speichern/code/Speichern.js?version=261520
// @downloadURL https://update.greasyfork.org/scripts/38877/Wer%20ist%20Meister.user.js
// @updateURL https://update.greasyfork.org/scripts/38877/Wer%20ist%20Meister.meta.js
// ==/UserScript==

debugger;

(function() {
    var minspieltage = 33;
    var format = "tabelle";
    var thelist, thetable, thehtml;
    var listbtn = $("<button>Wer ist Meister</button>");
    listbtn.addClass("mylistbtn");
    var savebtn = $("<button>Speichern</button>");
    savebtn.addClass("mysavebtn");
    GM_addStyle(".mylistbtn {position:fixed; right:0; top:0;z-index:100;");
    GM_addStyle(".mysavebtn {position:fixed; left:0; top:0;z-index:9999;");
    GM_addStyle("h2#swal2-title {display: none;}");
    GM_addStyle(".aniopen {animation: expand 1000ms cubic-bezier(0.185, 0.455, 0.395, 1.375);}");
    GM_addStyle(".aniclose {animation: expand 1000ms cubic-bezier(0.185, 0.455, 0.395, 1.375) reverse forwards;}");
    GM_addStyle("@keyframes expand {0% {transform: scale(0)} 100% {transform: scale(1)}");
    GM_addStyle("#swal2-content td.name-column a {color: black;}");
    GM_addStyle("#swal2-content td.name-column div {display:inline;}");
    GM_addStyle("#swal2-content td {font-size:14px}");
    $(window).on("click", function(event) {
        if (event.target.id == "savebtn2") {
            var data, fileName, strMimeType;
            if (format == "liste") {
                fileName = "liste.txt";
                strMimeType = 'text/plain';
                data = thelist.replace(/\t/g, "").replace(/\n/g, "").replace(/<br>/g, "\n");
            } else {
                fileName = "tabelle.html";
                strMimeType = 'text/html';
                data = thetable;
            }
            download(data, fileName, strMimeType);
        }
    });
    listbtn.on("click", function() {
        var leagueoptions = $("select[name='leagues[1]'] option");
        console.log(leagueoptions);
        leagueoptions.eq(3).trigger("click");
        var leagueselect0 = document.querySelector("select[name='leagues[0]'");
        leagueselect0.selectedIndex = 7;
        //$("li.league-search-button span a span").trigger("change");
        $(leagueselect0).trigger("change");
        $(leagueselect0).next("div.button").eq(0).find("span").text(leagueselect0.options[leagueselect0.selectedIndex].value);
        var leagueselect1 = document.querySelector("select[name='leagues[1]'");
        var nropt = leagueselect1.options.length;
        var idx = 0;
        var optval = "";
        thelist = "";
        var thead = $("#statistics-league-table thead");
        thetable = "<table><tbody>";
        var timer = setInterval(function() {
            if(idx > 0) {
                var tr = $("#statistics-league-table tbody tr:first-child");
                var spieltage = tr.find("td").eq(3).text();
                console.log("spieltage", spieltage);
                if (spieltage >= minspieltage) {
                    var club = $("#statistics-league-table tbody tr:first-child td:nth-child(3)").text();
                    console.log(optval, club);
                    thelist += optval + " - " + club + "<br>";
                    var newrow = "<tr>" + tr.html() + "</tr>";
                    thetable += newrow.replace(/<div class="icon.*><\/div>/, "&nbsp" + optval + "&nbsp");
                }
            }
            if (idx >= nropt) {
                clearTimeout(timer);
                console.log(thelist);
                thetable += "</tbody></table>";
                if (format == "liste") thehtml = thelist;
                else thehtml = thetable;
                thehtml += '<button id="savebtn2">Speichern</button>';
                swal({
                    html: thehtml,
                    type: "info",
                    animation: false,
                    showCloseButton: true,
                    showConfirmButton: false,
                    customClass: 'aniopen',
                    onOpen: function(modal) {
                        var el = document.getElementsByClassName('swal2-close')[0],
                            elClone = el.cloneNode(true);
                        el.parentNode.replaceChild(elClone, el);
                        elClone.addEventListener('click', function() {
                            modal.classList.remove('aniopen');
                            setTimeout(function() {
                                modal.classList.add('aniclose');
                                modal.addEventListener("animationend", function() {
                                    swal.close();
                                });
                            }, 50);
                        });
                    }
                });
            } else {
                var leagueselect1 = document.querySelector("select[name='leagues[1]'");
                console.log(leagueselect1, idx, nropt);
                leagueselect1.selectedIndex = idx;
                $(leagueselect1).next("div").eq(0).find("span").text(leagueselect1.options[leagueselect1.selectedIndex].value);
                optval = leagueselect1.options[leagueselect1.selectedIndex].value;
                $("li.league-search-button span a span").trigger("click");
            }
            idx++;
        }, 1000);
    });
    $("body").append(listbtn);
    //$("body").append(savebtn);
})();