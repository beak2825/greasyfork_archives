// ==UserScript==
// @name         GGn Get Album desc from VGMDB
// @namespace    https://orbitalzero.ovh/scripts
// @version      0.17
// @include      http://vgmdb.net/album/*
// @description  Helps users to easily get an OST's info from VGMDB and get it formatted with proper BBCode
// @author       NeutronNoir
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/22461/GGn%20Get%20Album%20desc%20from%20VGMDB.user.js
// @updateURL https://update.greasyfork.org/scripts/22461/GGn%20Get%20Album%20desc%20from%20VGMDB.meta.js
// ==/UserScript==

(function() {
    add_validate_button();
	GM_addStyle(button_css());
})();

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
        desc += "[/pre][/align]";
        var notes = $("div.smallfont[style='padding: 10px']").html().replace(/< *br *>/g, "\n") + "[/pre][/align]";
        if ($("div.smallfont[style='padding: 10px']").find(".label").text().startsWith("No notes available") === false) desc += "\n\n[align=left][pre]Notes\n" + notes;
        GM_setClipboard(desc, "text");
        alert("Description copied to clipboard");
	});
}

function button_css () {
	return "\
		#gen_desc {\
			position: fixed;\
			left: 0;\
			top: 0;\
			z-index: 999999;\
			cursor: pointer;\
            height: 5%;\
            background-color: lightblue;\
		}\
	";
}