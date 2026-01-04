// ==UserScript==
// @name         Rutracker Steam Filler for native Linux Games
// @namespace    https://rutracker.org
// @version      0.2.1
// @description  Steam form filler for Rutracker for native Linux Games
// @include      *
// @author       ZeDoCaixao
// @match        https://rutracker.org/forum/posting.php?f=1992&mode=new_rel
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/33860/Rutracker%20Steam%20Filler%20for%20native%20Linux%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/33860/Rutracker%20Steam%20Filler%20for%20native%20Linux%20Games.meta.js
// ==/UserScript==

function html2bb(str) {
    if(typeof str === "undefined") return "";
    str = str.replace(/< *br *\/*>/g, "\n");
    str = str.replace(/< *u *>/g, "[u]");
    str = str.replace(/< *\/ *u *>/g, "[/u]");
    str = str.replace(/< *\/ *li *>/g, "");
    str = str.replace(/< *li *>/g, "[*]");
    str = str.replace(/< *\/ *ul *>/g, "\n[/list]\n");
    str = str.replace(/< *ul *class=\\*\"bb_ul\\*\" *>/g, "\n[list]\n");
    str = str.replace(/< *h2 *class=\"bb_tag\" *>/g, "\n[b][u]");
    str = str.replace(/< *\/ *h2 *>/g, "[/u][/b]");
    str = str.replace(/< *strong *>/g, "[b]");
    str = str.replace(/< *\/ *strong *>/g, "[/b]");
    str = str.replace(/< *i *>/g, "[i]");
    str = str.replace(/< *\/ *i *>/g, "[/i]");
    str = str.replace(/\&quot;/g, "\"");
    str = str.replace(/< *img *src="([^"]*)" *>/g, "[img]$1[/img]");
    str = str.replace(/< *b *>/g, "[b]");
    str = str.replace(/< *\/ *b *>/g, "[/b]");
    str = str.replace(/< *a [^>]*>/g, "");
    str = str.replace(/< *\/ *a *>/g, "");
    str = str.replace(/< *p *>/g, "\n");
    str = str.replace(/< *\/ *p *>/g, "\n");
    //Yeah, all these damn stars. Because people put spaces where they shouldn't.
    while (true) {
        if (str.indexOf("\n\n\n") + 1) {
            str = str.replace("\n\n\n", "\n\n");
        } else {
            break;
        }
    }
    while (true) {
        if (str.indexOf("  ") + 1) {
            str = str.replace("  ", " ");
        } else {
            break;
        }
    }
    str = str.replace(/\n\[\*\]/g, "\n  [*]");
    str = str.replace(/\n \[\*\]/g, "\n  [*]");
    return $.trim(str);
}

(function() {
    'use strict';
    var shots = "z";

    $("#rel-form").before("<tr><td class='label'>Steam ID</td><td><input id='steamid' /></td></tr>");
    if (window.location.hostname == "lostpic.net") { 
        window.onload = function() { 
            $(".s2").click();
            $("#links").val(GM_getValue("shots", ""));
            $("#promo_btn").click();
            $("#submit").click();
            $(".s3").click();
        };
        
    } else if (window.location.hostname != "rutracker.org") { 
        return;
    }
    
    document.getElementById("steamid").addEventListener("blur", function() {
        shots = "aaa";
        var request = new GM_xmlhttpRequest({method: "GET",								// call the Steam API to get info on the game
            url: "http://store.steampowered.com/api/appdetails?l=russian&appids=" + $("#steamid").val(),
            responseType: "json",
            onload: function(response) {

                var gameInfo = response.response[document.getElementById("steamid").value].data;
                $("td:contains('Лицензия')").next().children(":first").val("проприетарная");
                $("#tabletka_new").val("вылечено");
                $("td:contains('Название')").next().children(":first").val(gameInfo.name);
                $("td:contains('Описание')").next().children(":first").val(html2bb(gameInfo.detailed_description));
                var date = gameInfo.release_date.date.split(", ").pop().split(" ");
                $("td:contains('Год выпуска')").next().children(":first").val(date[date.length-1]);
                $("td:contains('Системные требования')").next().children(":first").val(
                    html2bb(html2bb(gameInfo.linux_requirements.minimum) + "\n\n" + html2bb(gameInfo.linux_requirements.recommended))
                );
                $("td:contains('Разработчик')").next().children(":first").val(html2bb(gameInfo.developers.join(", ")));
                $("td:contains('Издатель')").next().children(":first").val(html2bb(gameInfo.publishers.join(", ")));

                var genreFixes = [
                  ["ролевые игры", "ролевая игра"],
                  ["приключенческие игры", "приключение"],
                  ["стратегии", "стратегия"],
                  ["казуальные игры", "казуальная"],
                  ["экшены", "экшен"],
                  ["платформеры", "платформер"],
                  ["Многопользовательские игры", "многопользовательская"],
                  ["Спортивные игры", "спорт"]
                ];
                var genres = [];
                gameInfo.genres.forEach(function (genre) {
                    var tag = genre.description.toLowerCase();
                    genreFixes.forEach(function (item) {
                        if (tag === item[0]) {
                            tag = item[1];
                            return;
                        }
                    })
                    genres.push(tag);
                });
                $("#genre").val(genres.join(", "));

                var screens = [];
                gameInfo.screenshots.forEach( function(screen, index) {
                    screens.push(screen.path_full.split("?")[0]);
                });
                GM_setValue("shots", screens.join("\n"));
                window.open("http://lostpic.net/", '_blank');

            }
        });
    });
})();