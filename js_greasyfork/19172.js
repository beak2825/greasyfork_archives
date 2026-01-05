// ==UserScript==
// @name         CS.RIN.RU - Contributor Posts View
// @version      0.5
// @description  Basic post-whitelist functionality: Only view "contributor" posts from pre-defined users (contributors) in a topic and hide posts from other people (leechers). You can change the users, that you consider contributors, by modifying the contributors array.
// @author       Royalgamer06
// @match        http://cs.rin.ru/forum/viewtopic.php?*t=*
// @grant        none
// @namespace    https://greasyfork.org/users/13642
// @downloadURL https://update.greasyfork.org/scripts/19172/CSRINRU%20-%20Contributor%20Posts%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/19172/CSRINRU%20-%20Contributor%20Posts%20View.meta.js
// ==/UserScript==

function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

function addButton() {
    function showContributorPosts() {

        //The contributors array (case insensitive)
        var contributors = ["Anomaly",
                            ".Rar",
                            "b00t",
                            "best_matrix07",
                            "bongsmoke1989",
                            "BzinhoGames",
                            "Christsnatcher",
                            "cyber_flame",
                            "demde",
                            "DMN32",
                            "FitGirlLV",
                            "haoose",
                            "hegyak",
                            "I am AWESOME",
                            "Igor007",
                            "jAck_h!De",
                            "john2s",
                            "kevinyang225",
                            "kortal",
                            "Lordw007",
                            "LukeStorm",
                            "machine4578",
                            "Mr.Deviance",
                            "NoWayMan",
                            "pakrat",
                            "prudislav",
                            "RessourectoR",
                            "RezMar",
                            "Royalgamer06",
                            "Sam2k8",
                            "SCS Bot",
                            "scaramonga",
                            "sosilent",
                            "Steam006",
                            "steamCooker",
                            "Steve Jobs",
                            "stranno",
                            "syahmixp",
                            "prudislav",
                            "quiksilver",
                            "Testtestom",
                            "Timo654",
                            "toto621",
                            "TwelveCharzzz",
                            "UberPsyX",
                            "Whatever.",
                            "xps2",
                            "Voksi_Bulgarian",
                            "Zybex128"];

        var curr_posts = jQ(".postauthor");
        for (var i = 0; i < curr_posts.length; i++) {
            if (jQ.inArray(curr_posts[i].innerHTML.toUpperCase(), contributors.map(function(x){ return x.toUpperCase(); })) == -1) {
                jQ(curr_posts[i].parentNode.parentNode.parentNode.parentNode).remove();
            }
        }

        //if (document.querySelectorAll("#pageheader > p.gensmall > b > a").length !== 0) {
        //var pages = document.querySelectorAll("#pageheader > p.gensmall > b > a");
        //var lastpage = pages[pages.length-2].innerHTML;

        var currpage = jQ("#pagecontent > table:nth-child(1) > tbody > tr > td.nav > strong:first").text();
        var lastpage = jQ("#pagecontent > table:nth-child(1) > tbody > tr > td.nav > strong:last").text();
        
        if (lastpage > currpage) {
            jQ("#pagecontent table").last().remove();
            jQ("#pagecontent table").last().remove();

            loadPage(currpage, lastpage);

            function loadPage(p, end) {
                jQ.get(location.href + "&start=" + parseInt(p)*15, function(data) {
                    var posts = jQ(data).find(".postauthor");
                    for (var i = 0; i < posts.length; i++) {
                        if (jQ.inArray(posts[i].innerHTML.toUpperCase(), contributors.map(function(x){ return x.toUpperCase(); })) > -1) {
                            jQ("#pagecontent").append(posts[i].parentNode.parentNode.parentNode.parentNode);
                        }
                    }
                    var n = parseInt(p) + 1;
                    if (n < end) {
                        loadPage(n, end);
                    }
                });
            }
        }
    }
    var button = document.createElement("a");
    button.setAttribute("title", "Contributor posts view");
    button.innerHTML = "Contributor posts view";
    button.addEventListener("click", showContributorPosts, false);

    jQ("#pagecontent > table:nth-child(2) > tbody > tr > td > table > tbody > tr > td:nth-child(1)").append(" | ").append(button);
}
addJQuery(addButton);