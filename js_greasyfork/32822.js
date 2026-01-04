// ==UserScript==
// @name        FMU Shared Routine Calc
// @namespace   https://greasyfork.org/it/users/74311
// @description Ricalcolo della routine
// @iconURL     https://static.trophymanager.com/pics/icons/mini_field.png
// @include     *://ultra.trophymanager.com/tactics*
// @version     4
// @downloadURL https://update.greasyfork.org/scripts/32822/FMU%20Shared%20Routine%20Calc.user.js
// @updateURL https://update.greasyfork.org/scripts/32822/FMU%20Shared%20Routine%20Calc.meta.js
// ==/UserScript==

	var condividi_bonus_routine = 0.25;
	var routine_limit = 40.0;
	var indice_dif = [0, 6];   // Defensive positions are 0 to 5
	var indice_cc = [6, 16];  // Midfield positions are 6 to 15
	var indice_att = [16, 24]; // Offensive positions are 16 to 23

	var giocatori_in_campo = {};

    inizializza();

	$("#tactics_field").click(function()
	{
		AggiornaRoutine();
		MostraRoutine();
	});


    function inizializza()
    {
		if(players.length > 0)
        {
			AggiornaeMostra();
			AddListenerClick();
		}
        else
        {
			setTimeout(function() {inizializza();}, 100);
		}
	}


function AddListenerClick()
{
		$("#tactics_field").click(function() {
			AggiornaeMostra();
		});
	}

function AggiornaeMostra() {
		AggiornaRoutine();
        MostraRoutine();
	}

	function MostraRoutine()
	{
		$("div.field_player").each(function(index, el)
		{
			if ($(el).attr("position") === "gk")
			{
				var bandiera = $(el).find("ib").length;
				var larghezza = (bandiera ? "130px" : "60px");
				var allineamento = (bandiera ? "left" : "center");
				$(el).find("div.field_player_name").css(
				{
					"width": larghezza,
					"text-align": allineamento
				});
			}
			if ($(el).attr("player_set") === "false")
				$(el).find("div.field_player_routine").remove();
			else
			{
				var id_giocatore = $(el).attr("player_id");
				var no = giocatori_in_campo[id_giocatore]["no"];
				var routine = giocatori_in_campo[id_giocatore]["routine"];
				var routine_div = $(el).find("div.field_player_routine");
				if (routine_div.length)
					routine_div.text(routine);
				else
					$(this).append('<div class="field_player_routine">' + routine + '</div>');
			}
		});

		$("li.bench_player").each(function(index, el)
		{
			var id_giocatore = $(el).attr("player_id");
			var routine = players_by_id[id_giocatore]["routine"];
			var routine_div = $(el).find("div.bench_player_routine");
			if (routine_div.length)
				routine_div.text(routine);
			else
			{
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

	function AggiornaRoutine()
	{
		AggiornaRoutineZona(indice_dif);
		AggiornaRoutineZona(indice_cc);
		AggiornaRoutineZona(indice_att);
	}

	function AggiornaRoutineZona(indice_linea)
	{
		var players_array = [];
		for (var i = indice_linea[0]; i < indice_linea[1]; i++)
		{
			var id = formation_by_pos[i];

			if (id !== "0" && id !== null)
			{
				var player = players_by_id[id];
				var name = player["name"];
				var no = player["no"];
				var routine = parseFloat(player["routine"]);
				var p = {"id": id, "no": no, "routine": routine};
				players_array.push(p);
			}
		}

		players_array.sort(ConfrontaByRoutineAsc);
		var line_size = players_array.length;

		if (line_size > 1)
		{
		    var min = players_array[0]["routine"];

		    if (min < routine_limit)
			{
		        var min2 = players_array[1]["routine"];
		        var max = players_array[line_size - 1]["routine"];

    			var bonus_routine = max * condividi_bonus_routine;
    			var nuova_routine = min + bonus_routine;
    			nuova_routine = (nuova_routine < min2 ? nuova_routine : min2);
    			nuova_routine = (nuova_routine < routine_limit ? nuova_routine : routine_limit);
    			nuova_routine = parseFloat(nuova_routine.toFixed(1));

    			players_array[0]["routine"] = nuova_routine;
		    }

			for (var i = 0; i < players_array.length; i++)
			{
				var player = players_array[i];
				var id = player["id"];
				var no = player["no"];
				var routine = player["routine"];
				giocatori_in_campo[id] = {"no": no, "routine": routine};
			}
		}
	}

	function ConfrontaByRoutineAsc(a, b)
	{
		return (a.routine - b.routine);
	}

	function ConfrontaByRoutineDess(a, b)
	{
		return (b.routine - a.routine);
	}
