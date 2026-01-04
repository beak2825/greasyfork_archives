// ==UserScript==
// @name             TM Routine Line Sharing
// @namespace        https://greasyfork.org/it/users/150526-matteo-tomassetti
// @version          0.5.3.1
// @description      Display players routine in tactics page
// @author           Matteo Tomassetti (Polverigi FC)
// @copyright        © 2017 Matteo Tomassetti. All rights reserved.
// @iconURL          https://static.trophymanager.com/pics/icons/mini_field.png
// @supportURL       https://trophymanager.com/forum/it/general/385311/last
// @contributionURL  https://trophymanager.com/account/donate-pro/
// @include          https://trophymanager.com/*tactics/*
// @run-at           document-idle
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/32619/TM%20Routine%20Line%20Sharing.user.js
// @updateURL https://update.greasyfork.org/scripts/32619/TM%20Routine%20Line%20Sharing.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // ****************************
    // *** Constants definition ***
    // ****************************
    var share_bonus = 0.25;
    var routine_cap = 40.0;
    var def_line_idx = [0, 6];   // Defensive positions are 0 to 5
    var mid_line_idx = [6, 16];  // Midfield positions are 6 to 15
    var off_line_idx = [16, 24]; // Offensive positions are 16 to 23

    // ************************
    // *** Script main code ***
    // ************************
    var players_on_field = {};
	
	initialize();

    // ****************************
    // *** Functions definition ***
    // ****************************

	function initialize() {
		if(players.length > 0) {
			addRoutineToTacticsTable();
			updateAndDisplay();
			addClickListeners();
		} else {
			setTimeout(function() {initialize();}, 100);						
		}
	}
	
	/*
	* This function updates and displays routine values of all players
	*/
	function updateAndDisplay() {
		updatePlayersRoutine();
        displayPlayersRoutine();
		listPlayers();	
	}
	
    /*
	* This function displays routine value of each player in formation
	*/
    function displayPlayersRoutine() {
		// show routine of players on field
		$("div.field_player").each(function(index, el) {
			// fix gk flag issue
			if ($(el).attr("position") === "gk") {
				var hasFlag = $(el).find("ib").length;
				var width = (hasFlag ? "130px" : "60px");
				var text_align = (hasFlag ? "left" : "center");
				$(el).find("div.field_player_name").css({
					"width": width,
					"text-align": text_align    
				});            
			}
			if ($(el).attr("player_set") === "false") {
				$(el).find("div.field_player_routine").remove();  
			} else {           
				var id = $(el).attr("player_id");
				var no = players_on_field[id]["no"];
				var routine = players_on_field[id]["routine"]; 
				var rou_div = $(el).find("div.field_player_routine");
				if (rou_div.length) {
					// div already exists
					rou_div.text(routine);
				} else {
					// create new div to display routine value
					$(this).append('<div class="field_player_routine">' + routine + '</div>');   
				}        
			}       
		}); 
		// show routine of players on bench
		$("li.bench_player").each(function(index, el) {
			var id = $(el).attr("player_id");
			var routine = players_by_id[id]["routine"];
			var rou_div = $(el).find("div.bench_player_routine");
			if (rou_div.length) {
				// div already exists
				rou_div.text(routine);
			} else {
				// create new div to display routine value
				var rec_div = $(el).find("div.rec_stars").css("line-height", "14px");
				$("<div></div>")
					.addClass("bench_player_routine")
					.css({
					"font-size": "10px",
					"text-align": "center"    
				})
					.text(routine)
					.appendTo(rec_div);
			}       
		}); 
    }

    /*
	* This function updates the routine of all players on the field 
	* applying the routine bonus
	*/
    function updatePlayersRoutine() {
        updateLineRoutine(def_line_idx);
        updateLineRoutine(mid_line_idx);
        updateLineRoutine(off_line_idx);    
    }

    /*
	* This function applies the routine bonus to the player with least routine 
	* in the given line and saves the updated routine value  
	*/
    function updateLineRoutine(line_idx) {
        var players_ar = [];
        // for each position in the line
        for (var i = line_idx[0]; i < line_idx[1]; i++) {      
            var id = formation_by_pos[i];
            // check if there is a player in that position
            if (id !== "0" && id !== null) {
                // retrieve player info
                var player = players_by_id[id];
                var name = player["name"];
                var no = player["no"];
                var routine = parseFloat(player["routine"]);           
                // create new player object and add it to the array
                var p = {"id": id, "no": no, "routine": routine};
                players_ar.push(p);
            }   
        }    
        var line_size = players_ar.length; // players in the line
        // if line consist of two or more players: apply routine bonus
        if (line_size > 1) {
			// sort players array by routine in ascending order
        	players_ar.sort(compareByRoutineAsc);
			var min = players_ar[0]["routine"];
			if (min < routine_cap) {
				var max = players_ar[line_size - 1]["routine"];            
				var min2 = players_ar[1]["routine"];
				// calculate new routine value applying routine bonus
				var bonus = max * share_bonus;
				var new_routine = min + bonus;
				new_routine = (new_routine < min2 ? new_routine : min2);
				new_routine = (new_routine < routine_cap ? new_routine : routine_cap);
				new_routine = parseFloat(new_routine.toFixed(1));
				// update player routine
				players_ar[0]["routine"] = new_routine;
			}
        }
		// insert players into players_on_field object by id
		for (i = 0; i < players_ar.length; i++) {
			var player = players_ar[i];
			var id = player["id"];
			var no = player["no"];
			var routine = player["routine"];
			players_on_field[id] = {"no": no, "routine": routine};
		}
    }

    /*
	* Compare function to sort objects by their routine property in ascending order
	*/
    function compareByRoutineAsc(a, b) {
		var rou_a = parseFloat(a.routine);
		var rou_b = parseFloat(b.routine);
        return (rou_a - rou_b);
    }

    /*
	* Compare function to sort objects by their routine property in descending order
	*/
    function compareByRoutineDesc(a, b) {
        return (b.routine - a.routine);
    }
	
	/*
	* This function sorts players array by given key and order
	* and then updates tactics table
	*/
	var sortPlayers = function(key, direction) {
	    // key = no / pos / name / rec / rou
		// direction = asc, desc
		key = key || "pos";
		direction = direction || "asc";
		if (key === "rou") {
			var comp_fun = (direction === "asc" ? compareByRoutineAsc : compareByRoutineDesc);
			players.sort(comp_fun);	
		} else {
			players = mergeSort(players, key+"_sort", direction);
		}
		listPlayers();
	};
	
	/*
	* This function adds routine column to tactics table
	*/
	function addRoutineToTacticsTable() {
		var name_col = $("#tactics_list_headers").find(".name_col.list_column").width("170px");
		var rou_col = $("<div class=\"rou_col list_column\" tooltip=\"Ordina per Routine\"" + 
						"onclick=\"tactics_sort('pos')\"; style=\"width: 34px;\">" + 
						"<div class=\"padding\" style=\"background: none;\">Rou</div></div>");
		$(rou_col).insertAfter($(name_col));
	}
	
	function addClickListeners() {
		// Attach click event handler function to the tactics table headers:
		// when the user clicks on the field, players in the table are sorted
		$("#tactics_list_headers").find(".list_column").each(function(index, el) {
			var key = $(el).attr("class").split(" ")[0].split("_")[0];
			if (key !== "col") { // do not consider empty col
				$(el).attr("order", "desc");
				//$(el).prop("onclick", null);
				$(el).click(function() {
					var order = $(el).attr("order");
					var new_order = (order === "asc" ? "desc" : "asc");
					sortPlayers(key, order);
					$(el).attr("order", new_order);
				});
			}
		});

		// Attach click event handler function to the tactics field:
		// when the user clicks on the field, routine values are updated
		$("#tactics_field").click(function() {
			updateAndDisplay();    
		});				
	}
	
	/*
	* This function populates tactics table with players data
	*/
	function listPlayers() {
		var $list = $("#tactics_list_list");
		var $ul = $("<ul>").addClass("tactics_list");
		var gk_header = false;
		for(var i in players)
		{
			var p = players[i];
			if(p)
			{
				p["on_field"] = on_field[p["player_id"]] || on_subs[p["player_id"]];
				if(tactics_filter_show(p))
				{
					var str = "<div class=\"list_column no_col align_center\">"+p["no"]+"</div>" +
					"<div class=\"vert_split\"></div>" +
					"<div class=\"list_column pos_col align_center\">"+p["favorite_position_short"]+"</div>" +
					"<div class=\"vert_split\"></div>" +
					"<div class=\"list_column name_col\" style=\"width: 170px\"><div class=\"padding\">"+ 
						"<span class='player_name' player_link='"+p["player_id"]+"' player_id='"+p["player_id"]+"'>"+p["name"]+"</span>"+
						(p["show_flag"] ? " "+p["flag"] : "" )+(p["status_no_check"] === "" ? "" : " "+p["status_no_count"] )+"</div></div>" +
					"<div class=\"vert_split\"></div>" +
					"<div class=\"list_column rou_col align_center\" style=\"width: 34px\">"+p["routine"]+"</div>" +
					"<div class=\"vert_split\"></div>" +
					"<div class=\"list_column rec_col\"><div class=\"padding\">"+p["recommendation"]+"</div></div>" +
					"<div class=\"clear\"></div>";
					var $li = $("<li>")
						.html(str)
						.appendTo($ul)
						.attr("player_id",p["player_id"])
						.attr("player_link",p["player_id"])
						.attr("i",i)
						.addClass("draggable")
						.attr("player_no",p["no"]);
					$li.mouseover(function(){$(this).addClass("hover");})
						.mouseout(function(){$(this).removeClass("hover");});
					$li.find(".favposition").removeClass("short");
					if(on_field[p["player_id"]]) {
						$li.addClass("on_field");
						$li.attr("position",on_field[p["player_id"]]);
					}
					else if(on_subs[p["player_id"]]){
						$li.attr("position",on_subs[p["player_id"]]);
						$li.addClass("on_subs");
					}
					else if(show_field_players_in_list) $li.addClass("subtle_gray");

					// Player link on CTRL+CLICK
					$li.find(".player_name").click(function(e){
						if(e.ctrlKey)
						{
							window.open("/players/"+$(this).attr("player_id")+"/"+$(this).html().replace(" ","_").replace(". ","_")+"/");
						}
					});
					make_draggable($li);
					activate_player_links($li.find("[player_link]"));
				}
			}
		} // i in players
		$list.html($ul);
		$list.verticalScroll({
			"force_scroll": true,
			"style":"dark",
			"scroll_width":25
		});
	}

    
})();
