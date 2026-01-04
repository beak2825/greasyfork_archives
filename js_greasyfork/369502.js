// ==UserScript==
// @name         Artifact Advanced Filter
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Advanced filters for artifact list
// @author       Gabbot96
// @include      *://*.travian.*/build.php?*
// @grant GM_addStyle
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_addStyle
// @grant GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/369502/Artifact%20Advanced%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/369502/Artifact%20Advanced%20Filter.meta.js
// ==/UserScript==

function AAF () {
if(($('div.active div.content').hasClass('favorKey1') || $('div.active div.content').hasClass('favorKey2')) && $("div#build").hasClass("gid27") && !($("div#build div").hasClass("artefact"))){
    $("div#build.gid27").prepend ( `
    <div id="AAF_Buttons">
		<div style="margin: 0; width: 100%;">
	        <div style="width:50%; margin:0; float:left;">
	        	<p style="margin: 3px 0px;">
		            <button type="submit" id="show_all" class="green prepare" style ="margin-right:20px">
			        <div class="button-container addHoverClick">
				        <div class="button-background">
					        <div class="buttonStart">
						        <div class="buttonEnd">
							        <div class="buttonMiddle"></div>
						        </div>
					        </div>
				        </div>
				        <div class="button-content">Mostra tutti</div>
			        </div>
		            </button>
		        </p>
	    	</div>
	        <div style="width:50%; margin:0; float:left; padding-top: 3px;">
	        	<p style="margin: 3px 0px;">
                    <b> Ally: </b>
		            <select id="ally_list" style="margin-left:35px" onchange="">
		                 <option value=" ">    </option>
		            </select>
		        </p>
	        </div>
	        <div style="clear: both;" > </div>
	    </div>
	        <div style="width:50%; margin:0; float:left;">
		        <p style="margin: 3px 0px;">
		            <button type="submit" id="show_filter" class="green prepare">
			        <div class="button-container addHoverClick">
				        <div class="button-background">
					        <div class="buttonStart">
						        <div class="buttonEnd">
							        <div class="buttonMiddle"></div>
						        </div>
					        </div>
				        </div>
				        <div class="button-content">Filtra</div>
			        </div>
		            </button>
		            <b> Da </b><input type="text" id="min_dist" value="0" maxlength="3" max="400" min="0" style="width:25px">
		            <b> a </b><input type="text" id="max_dist" value="400" maxlength="3" max="400" min="0" style="width:25px">
		            <b> caselle</b>
	        	</p>
	    	</div>
	        <div style="width:50%; margin:0; float:left; padding-top: 1px;">
		        <p style="margin: 3px 0px;">
                    <b> Player: </b>
		            <select id="player_list" style="margin-left:20px" onchange="">
		                 <option value=" ">    </option>
		            </select>
		        </p>
	        </div>
	        <div style="clear: both;" > </div>
	    </div>
    </div>
` );

    function getAlly(){

        $("select#ally_list").text("");
        $("select#ally_list").append('<option value=" ">    </option>');

        var ally = $("td.al:visible");
        for (var i = 0; i < ally.length; i++) {
            ally[i] = ally[i].innerText;
        }

        var counts = {};
        jQuery.each(ally, function(key,value) {
            if (!counts.hasOwnProperty(value)) {
                counts[value] = 1;
            } else {
                counts[value]++;
            }
        });

        ally = jQuery.unique( ally );
        ally.sort(function(a, b) {
            var nameA = a.toUpperCase(); // ignore upper and lowercase
            var nameB = b.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            // names must be equal
            return 0;
        });

        for (var k = 0; k < ally.length; k++) {
            $("select#ally_list").append('<option value="'+ ally[k] + '">' + ally[k] + ' (' + counts[ally[k]] + ') </option>');
        }
    }

    function getPlayers(){

        $("select#player_list").text("");
        $("select#player_list").append('<option value=" ">    </option>');

        var player = $("td.pla:visible");
        for (var j = 0; j < player.length; j++) {
            player[j] = player[j].innerText;
        }

        var pcounts = {};
        jQuery.each(player, function(key,value) {
            if (!pcounts.hasOwnProperty(value)) {
                pcounts[value] = 1;
            } else {
                pcounts[value]++;
            }
        });

        player = jQuery.unique( player );
        player.sort(function(a, b) {
            var nameA = a.toUpperCase(); // ignore upper and lowercase
            var nameB = b.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
               return 1;
            }
            // names must be equal
            return 0;
        });

        for (var l = 0; l < player.length; l++) {
            $("select#player_list").append('<option value="'+ player[l] + '">' + player[l] + ' (' + pcounts[player[l]] + ') </option>');
        }
    }

    getAlly();
    getPlayers();

    $("#show_all").click (function(){
        $("td.dist").parent().show();
        getAlly();
        getPlayers();
    });

    $("#show_filter").click (function(){
        $("td.dist").each(function(){
            if($( this ).text() <= parseInt($("#min_dist").val()) || $( this ).text() >= parseInt($("#max_dist").val())){
                $( this ).parent().hide();
            }
        });
        getAlly();
        getPlayers();
    });
    $('#min_dist').keypress(function(e){
        if(e.which == 13){
            $("#show_filter").click();
        }
    });
    $('#max_dist').keypress(function(e){
        if(e.which == 13){
            $("#show_filter").click();
        }
    });

    $("select#ally_list").change(function(){
        $("td.al").parent().show();
        $("td.al").each(function(){
            if($( this ).text() != $("select#ally_list option:selected").val() && $("select#ally_list option:selected").val() != " "){
                $( this ).parent().hide();
            }
            else if($("select#ally_list option:selected").val() == " "){
                $("td.al").parent().show();
            }
        });
        getPlayers();
    });

    $("select#player_list").change(function(){
        $("td.pla").parent().show();
        $("td.pla").each(function(){
            if($( this ).text() != $("select#player_list option:selected").val() && $("select#player_list option:selected").val() != " "){
                $( this ).parent().hide();
            }
            else if($("select#player_list option:selected").val() == " "){
                $("td.pla").parent().show();
            }
        });
        getAlly();
    });


    //artifact sorting
    $("thead tr th").each(function(){
	    if( $( this ).text() == ""){
		    $( this ).append('<a class="toggle_arrow">▼</a>');
	    }
        getAlly();
        getPlayers();
    });

    $(".toggle_arrow").click(function(){
        $( this ).parent().parent().parent().parent().children("tbody").toggle();
        if($( this ).text() == "▲"){$( this ).text("▼")}
        else if($( this ).text() == "▼"){$( this ).text("▲")};
        getAlly();
        getPlayers();
    });
}
}

AAF();