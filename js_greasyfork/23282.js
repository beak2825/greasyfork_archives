// ==UserScript==
// @name         GGn VGMDB Uploady
// @namespace    https://orbitalzero.ovh/scripts
// @version      0.04
// @include      https://gazellegames.net/upload.php
// @description  Uploady for VGMDB
// @author       NeutronNoir
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @grant		 GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/23282/GGn%20VGMDB%20Uploady.user.js
// @updateURL https://update.greasyfork.org/scripts/23282/GGn%20VGMDB%20Uploady.meta.js
// ==/UserScript==

(function() {
    $("#categories").click(function () {
        if ($(this).find(":selected").text() == "OST") setTimeout(add_album_input, 250);
    });
})();

function add_album_input() {
    
    $("#title_tr").after($('<tr><td class="label">Catalog Number</td><td><input type="text" id="catalog_number" size="60"></input>'));
    $("#catalog_number").on("blur", function () {
        var input = this;
        var request = new GM_xmlhttpRequest({"method": "GET",								//Send the image URL to WhatIMG
                                           "url": "http://vgmdb.net/search?q=" + $(this).val(),
                                           "onload": function(response) {
                                               if (response.status != 200) $(input).val("Album not found");
                                               var env = $(response.responseText);
                                               var desc = "[align=center][size=3][u][b]Album Information\n" + env.find(".albumtitle").first().text() + "[/b][/u][/size][/align]\n\n";
                                               
                                               var aliases = [];
                                               env.find(".albumtitle:not(:first)[lang=\"en\"]").each( function() {
                                                   aliases.push($(this).text().trim());
                                               });
                                               $("#aliases").val(aliases.join(", "));
                                               
                                               var composers = [];
                                               env.find("#album_infobit_large>tbody>tr").each( function() {    //Generate the info on the album
                                                   $(this).find("[style*='display:none']").remove();
                                                   $(this).find("script").remove();
                                                   desc += "[*][b]" + $(this).find("td>span>b").text() + ":[/b]\t" + $(this).find("td").last().text().trim() + "\n";
                                                   switch($(this).find("td>span>b").text()) {
                                                       case "Composed by":
                                                           composers = $(this).find("td").last().text().trim().split(", ");
                                                           if (composers.length >= 2) $("#title").val(env.find(".albumtitle").first().text() + " by Various Artists");
                                                           else $("#title").val(env.find(".albumtitle").first().text() + " by " + composers[0]);
                                                           break;
                                                       case "Release Date":
                                                           $("#year").val($(this).find("td").last().text().trim().split(", ")[1]);
                                                           break;
                                                   }
                                               });
                                               
                                               $("#image").val(env.find("#coverart").css("background-image").replace(/url\("([^"]*)"\)/, "$1"));
                                               $("#tags").val("soundtrack, ost");
                                               
                                               desc += "\n[align=center][pre]Tracklist\n";
                                               env.find("#tracklist").find("[style*='display: none']").remove();
                                               var disc_count = (env.find("#tracklist").text().match(/Disc [0-9]+/g) || []).length;
                                               
                                               var max_title_length = 0;
                                               env.find("#tracklist").find("tr").each(function () {
                                                   var td = $(this).find("td").eq(1);
                                                   if ($(td).text().length > max_title_length) max_title_length = $(td).text().length;
                                               });
                                               max_title_length = Math.ceil(max_title_length/8);
                                               
                                               env.find("#tracklist>span>table>tbody").each( function (index) {    //Generate the track list
                                                   if (disc_count > 1) desc += "Disc " + (index+1) + "\n";
                                                   $(this).find("tr").each( function (index) {   //For each track
                                                       //The first index is a span containing the track number
                                                       var tds = $(this).find("td");
                                                       desc += tds.first().find("span").text() + "\t";
                                                       desc += tds.eq(1).text() + "\t".repeat(Math.ceil(max_title_length-tds.eq(1).text().length/8));
                                                       desc += tds.last().text() + "\n";
                                                   });
                                                   desc += "\n";
                                               });
                                               desc = desc.substring(0, desc.length - 2);
                                               desc += "[/pre][/align]";
                                               var notes = env.find("div.smallfont[style='padding: 10px']").html().replace(/< *br *>/g, "\n") + "[/pre][/align]";
                                               if (env.find("div.smallfont[style='padding: 10px']").find(".label").text().startsWith("No notes available") === false) desc += "\n\n[align=left][pre]Notes\n" + notes;
                                               $("#album_desc").val(desc);
                                           }
        });
    });
}

function add_validate_button() {
	$("body").prepend('<input type="button" id="gen_desc" value="Generate description"/>');
	$("#gen_desc").click( function() {
        var desc = "[align=center][size=3][u][b]Album Information\n" + $(".albumtitle").first().text() + "[/b][/u][/size][/align]\n\n";
        $("#album_infobit_large>tbody>tr").each( function() {    //Generate the info on the album
            $(this).find("[style*='display:none']").remove();
            $(this).find("script").remove();
            desc += "[*][b]" + $(this).find("td>span>b").text() + ":[/b]\t" + $(this).find("td").last().text().trim() + "\n";
        });
        desc += "\n[align=center][pre]Tracklist\n";
        $("#tracklist").find("[style*='display: none']").remove();
        var disc_count = ($("#tracklist").text().match(/Disc [0-9]+/g) || []).length;
        var max_title_length = 0;
        $("#tracklist").find("tr").each(function () {
            var td = $(this).find("td").eq(1);
            if ($(td).text().length > max_title_length) max_title_length = $(td).text().length;
        });
        max_title_length = Math.ceil(max_title_length/8);
        $("#tracklist>span>table>tbody").each( function (index) {    //Generate the track list
            if (disc_count > 1) desc += "Disc " + (index+1) + "\n";
            $(this).find("tr").each( function (index) {   //For each track
                //The first index is a span containing the track number
                var tds = $(this).find("td");
                desc += tds.first().find("span").text() + "\t";
                desc += tds.eq(1).text() + "\t".repeat(Math.ceil(max_title_length-tds.eq(1).text().length/8));
                desc += tds.last().text() + "\n";
            });
            desc += "\n";
        });
        desc = desc.substring(0, desc.length - 2);
        desc += "[/pre][/align]\n\n[align=left][pre]Notes\n";
        desc += $("div.smallfont[style='padding: 10px']").html().replace(/< *br *>/g, "\n") + "[/pre][/align]";
        GM_setClipboard(desc, "text");
        alert("Description copied to clipboard");
	});
}