// ==UserScript==
// @name         GGn New Uploady2
// @namespace    https://gazellegames.net/
// @version      2
// @description  Steam Uploady2 for GGn
// @match        https://gazellegames.net/upload.php*
// @match        https://gazellegames.net/torrents.php?action=editgroup*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523299/GGn%20New%20Uploady2.user.js
// @updateURL https://update.greasyfork.org/scripts/523299/GGn%20New%20Uploady2.meta.js
// ==/UserScript==

function html2bb(str) {
    if (!str) return "";
    console.log("Original HTML:", str); // Debugging: log the original HTML

    str = str.replace(/< *br *\/*>/g, "\n\n"); // Handle <br> tags
    str = str.replace(/< *b *>/g, "[b]");
    str = str.replace(/< *\/ *b *>/g, "[/b]");
    str = str.replace(/< *u *>/g, "[u]");
    str = str.replace(/< *\/ *u *>/g, "[/u]");
    str = str.replace(/< *i *>/g, "[i]");
    str = str.replace(/< *\/ *i *>/g, "[/i]");
    str = str.replace(/< *strong *>/g, "[b]");
    str = str.replace(/< *\/ *strong *>/g, "[/b]");
    str = str.replace(/< *em *>/g, "[i]");
    str = str.replace(/< *\/ *em *>/g, "[/i]");
    str = str.replace(/< *li *>/g, "[*]"); // Prepend [*] to the beginning of list items
    str = str.replace(/< *\/ *li *>/g, ""); // Remove closing </li> tags
    str = str.replace(/< *ul *class=\\*\"bb_ul\\*\" *>/g, "");
    str = str.replace(/< *\/ *ul *>/g, "");
    str = str.replace(/< *h2 *class=\"bb_tag\" *>/g, "\n[align=center][u][b]");
    str = str.replace(/< *h[12] *>/g, "\n[align=center][u][b]");
    str = str.replace(/< *\/ *h[12] *>/g, "[/b][/u][/align]\n");
    str = str.replace(/\&quot;/g, "\"");
    str = str.replace(/\&amp;/g, "&");
    str = str.replace(/< *img *src="([^"]*)".*>/g, "\n[img]$1[/img]\n"); // Handle <img> tags
    str = str.replace(/< *a [^>]*>/g, "");
    str = str.replace(/< *\/ *a *>/g, "");
    str = str.replace(/< *p[^>]*>/g, ""); // Remove <p> tags with attributes
    str = str.replace(/< *\/ *p *>/g, "");
    str = str.replace(/< *div[^>]*>/g, "\n\n"); // Handle <div> tags with attributes
    str = str.replace(/< *\/ *div *>/g, "");
    str = str.replace(/< *span[^>]*>/g, ""); // Handle <span> tags with attributes
    str = str.replace(/< *\/ *span *>/g, "");
    str = str.replace(/< *blockquote[^>]*>/g, "[quote]"); // Handle <blockquote> tags
    str = str.replace(/< *\/ *blockquote *>/g, "[/quote]");
    // Add a newline before [align=center][u][b] tags
    str = str.replace(/(\[align=center\]\[u\]\[b\])/g, "\n$1");
    // Remove any remaining HTML tags
    str = str.replace(/<[^>]*>/g, "");
    // Handle special characters and whitespace
    str = str.replace(//g, "\"");
    str = str.replace(//g, "\"");
    str = str.replace(/  +/g, " ");
    str = str.replace(/\n +/g, "\n");
    str = str.replace(/\n\n\n+/gm, "\n\n");
    str = str.replace(/\n\n\n+/gm, "\n\n");
    str = str.replace(/\[\/b\]\[\/u\]\[\/align\]\n\n/g, "[/b][/u][/align]\n");
    str = str.replace(/\n\n\[\*\]/g, "\n[*]");
    // Remove [*] from empty lines
    str = str.replace(/\[\*\]\s*\n/g, "");
    // Ensure [*] is at the start of each list item without a space
    str = str.replace(/\n\[\*\] /g, "\n[*]");
    str = str.replace(/\[\*\] /g, "[*]");

    console.log("Converted BBCode:", str); // Debugging: log the converted BBCode
    return str;
}

function fix_emptylines(str) {
    var lst = str.split("\n");
    var result = "";
    var empty = 1;
    lst.forEach(function(s) {
        if (s) {
            empty = 0;
            result = result + s + "\n";
        } else if (empty < 1) {
            empty = empty + 1;
            result = result + "\n";
        }
    });
    return result;
}

function pretty_sr(str) {
    if (!str) return "";
    str = str.replace(/™/g, "");
    str = str.replace(/®/g, "");
    str = str.replace(/:\[\/b\] /g, "[/b]: ");
    str = str.replace(/:\n/g, "\n");
    str = str.replace(/:\[\/b\]\n/g, "[/b]\n");
    str = str.replace(/\n\n\[b\]/g, "\n[b]");
    str = str.replace(/64 ?bit/, "64-bit");
    str = str.replace(/nvidia/i, "Nvidia");
    str = str.replace(/([0-9]) ?ghz\b/ig, "$1 GHz");
    str = str.replace(/([0-9]) ?gb\b/ig, "$1 GB");
    str = str.replace("[b]OS *[/b]", "[b]OS[/b]");
    return str;
}

function fill_form(response) {
    //We store the data in gameInfo, since it's much easier to access this way
    var gameInfo = response.response[$("#steamid").val()].data;
    var about = gameInfo.about_the_game;
    if (about === '') { about = gameInfo.detailed_description; }
    about = "[align=center][b][u]About the game[/u][/b][/align]\n" + html2bb(about).trim();
    var year = gameInfo.release_date.date.split(", ").pop();
    var addScreens = true;
    var screens = document.getElementsByName("screens[]");
    var add_screen = $("#image_block a[href='#']").first();     //This is a shortcut to add a screenshot field.
    gameInfo.screenshots.forEach(function(screen, index) {
        //The site doesn't accept more than 20 screenshots
        if (index >= 20) return;
        if (index >= 4) add_screen.click();
        screens[index].value = screen.path_full.split("?")[0];
    });
    var platform = "Windows"
    var cover_field = "input[name='image']";
    var desc_field = "textarea[name='body']";

    if (window.location.href.includes("action=editgroup")) {
        $("input[name='year']").val(year);
        $("input[name='name']").val(gameInfo.name);  //Get the name of the game
        if ($("#trailer~a").attr("href").includes("Linux")) {
            platform = "Linux";
        } else if ($("#trailer~a").attr("href").includes("Mac")) {
            platform = "Mac";
        }
    } else {
        $("#title").val(gameInfo.name);  //Get the name of the game
        $("#gameswebsiteuri").val(gameInfo.website);  //Get the name of the game
        $("#year").val(year);
        var genres = [];
        if (gameInfo.hasOwnProperty('genres')) {
          gameInfo.genres.forEach(function (genre) {
              var tag = genre.description.toLowerCase().replace(/ /g, ".");
              genres.push(tag);
          });
        }
        $("#tags").val(genres.join(", "));
        cover_field = "#image";
        desc_field = "#album_desc";
        platform = $("#platform").val();
    }
    var recfield = gameInfo.pc_requirements;
    switch (platform) {
        case "Windows":
            recfield = gameInfo.pc_requirements;
            break;
        case "Linux":
            recfield = gameInfo.linux_requirements;
            break;
        case "Mac":
            recfield = gameInfo.mac_requirements;
            break;
    }
    var sr = '';
    if (typeof(recfield.minimum) !== "undefined") {
      sr += html2bb(recfield.minimum);
    }
    if (typeof(recfield.recommended) !== "undefined") {
      sr += "\n" + html2bb(recfield.recommended);
    }
    sr = "\n\n[quote][align=center][b][u]System Requirements[/u][/b][/align]\n\n" +
             pretty_sr(sr) +
             "[/quote]";

    $(desc_field).val(about);
    $(desc_field).val($(desc_field).val() + sr);
    $(cover_field).val(gameInfo.header_image.split("?")[0]);       //Get the image URL
    var big_cover = "https://steamcdn-a.akamaihd.net/steam/apps/" + $("#steamid").val() + "/library_600x900_2x.jpg";
    var request_image = GM.xmlHttpRequest({
            method: "GET",                  //We call the Steam API to get info on the game
            url: big_cover,
            responseType: "json",
            onload: function(response) {
                if(response.status == 200){
                    $(cover_field).val(big_cover);
                }
            }
    });
    $(desc_field).val(fix_emptylines($(desc_field).val()));
    if (gameInfo.metacritic) {
        $("#meta").val(gameInfo.metacritic.score);
        $("#metauri").val(gameInfo.metacritic.url.split("?")[0] + "/critic-reviews");
    }
    if (gameInfo.hasOwnProperty('movies')) {
      var trailer = gameInfo.movies[0].webm.max.split("?")[0].replace("http:", "https:");
      $("#trailer").val(trailer);
    }
}

(function() {
    'use strict';
    if (window.location.href.includes("action=editgroup")) {
        $("td.center").parent().after("<tr><td class='label'>Steam ID</td><td><input id='steamid' /></td></tr>");
    }
    else {
        $("#steamid").after(
            '<a href="javascript:;" id="fill_win">Win</a> <a href="javascript:;" id="fill_lin">Lin</a> <a href="javascript:;" id="fill_mac">Mac</a>');
        $('#fill_win').click(function () { $("#platform").val("Windows"); });
        $('#fill_lin').click(function () { $("#platform").val("Linux"); });
        $('#fill_mac').click(function () { $("#platform").val("Mac"); });
    }
    $("#steamid").blur(function() { //After the "appid" input loses focus
        var request = GM.xmlHttpRequest({
            method: "GET",                  //We call the Steam API to get info on the game
            url: "http://store.steampowered.com/api/appdetails?l=en&appids=" + $("#steamid").val(),
            responseType: "json",
            onload: fill_form
        });
    });
})();