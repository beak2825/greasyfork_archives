// ==UserScript==
// @name           ASI in Squad Overview
// @version 	     1.0.0
// @description	   Show ASI on Club Squad page
// @namespace      http://trophymanager.com
// @include        http://trophymanager.com/club/*/squad/*
// @include        https://trophymanager.com/club/*/squad/*
// @include        http://trophymanager.com/club/%20/squad/ 
// @author    	  Joao Manuel Ferreira Fernandes
// @github		  http://github.com/etnepres/trophymanager.git	
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/29627/ASI%20in%20Squad%20Overview.user.js
// @updateURL https://update.greasyfork.org/scripts/29627/ASI%20in%20Squad%20Overview.meta.js
// ==/UserScript==

//Functions needed

function collect() {
    var ret = {};
    var len = arguments.length;
    for (var i=0; i<len; i++) {
        for (var p in arguments[i]) {
            if (arguments[i].hasOwnProperty(p)) {
                ret[p] = arguments[i][p];
            }
        }
    }
    return ret;
}

//Real Code

var new_player_array = [];
var team_b_id = "";

$.ajaxSetup({async: false});

$.post("/ajax/players_get_select.ajax.php",{"type":"change","club_id":SUBPAGE},function(data){

    data = JSON.parse(data);
    new_player_array = data.post;

});

$("#player_table tr:eq(0)").append('<b><td>ASI</td></b>');
$("#player_table tr > .text_fade > div").not(".text_fade_overlay").find("a[player_link]").each(function(){

    player_link = $(this).attr("player_link");

    if(new_player_array[player_link] == null && team_b_id === ""){

        console.log("finding team b id");

        $.post("http://trophymanager.com/ajax/players_get_info.ajax.php",{"player_id":player_link, "type":"history","show_non_pro_graphs":false},function(data){

            data = JSON.parse(data);
            team_b_id = data.table.nat[0].klub_id;

        });

        $.post("/ajax/players_get_select.ajax.php",{"type":"change","club_id":team_b_id},function(data){

            data = JSON.parse(data);
            new_player_array = collect(new_player_array, data.post);

        });

    }

    current_player_info = new_player_array[player_link];

    //console.log(current_player_info["asi"]);

    parent_select = $(this).parent().parent().parent();

    parent_select.append('<td>'+current_player_info.asi+'</td>');

});

$.ajaxSetup({async: true});
