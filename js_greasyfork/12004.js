// ==UserScript==
// @name         My Golf Club Scores
// @namespace    http://tikoflano.cl/
// @version      1.0
// @description  Just for the Chilean Golf Federation. Get the golf scores off all players of your club in a given period of time and rank them.
// @author       Alvaro Flaño
// @match        http://www.fedegolf.cl/sistema/publico/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/12004/My%20Golf%20Club%20Scores.user.js
// @updateURL https://update.greasyfork.org/scripts/12004/My%20Golf%20Club%20Scores.meta.js
// ==/UserScript==

var clickWait = 2000;
var continuar = false;
var script_running = false;

$(document).ready(function() {
    var start_mgcs = $('<div id="start_mgcs" style="color: #E0EAF4;position: relative;left: 50px;background-color: #A22525;padding: 10px;border-radius: 15px 15px 0px 0px;text-decoration: none; max-width: 50%; cursor:pointer;">My Golf Club Scores</div>');
	$("body", frames.leftFrame.document).append(start_mgcs);
    
    //Add the options panel
    var currentDate = new Date();
	var startMonth = currentDate.getMonth();
	var startYear = currentDate.getFullYear();
	if (startMonth == 0){
		startMonth = 12;
		startYear = startYear + 1;
	}
	
	var endMonth = startMonth + 1;
	var endYear = startYear;
	if(startMonth == 12){
		endMonth = 1;
		endYear = startYear + 1;
	}
    
    var mgcs_options = $("<div id='mgcs_options'>\
                         <div class='mgcs_option'>Fecha Inicio (inclusive)<br><input id='start_date' type='text' value='1-"+startMonth+"-"+startYear+"'/></div><br>\
                         <div class='mgcs_option'>Fecha Fin (exclusive)<br><input id='end_date' type='text' value='1-"+endMonth+"-"+endYear+"'/></div><br>\
                         <div class='mgcs_option'>Cancha <br><input id='golf_course' type='text' value='Club De Golf La Dehesa'/></div><br>\
                         <div class='mgcs_option'>Min tarjetas para participar <br><input id='min_scores' type='number' value='3'/></div><br>\
                         <div class='mgcs_option'>Mejores tarjetas a considerar<br><input id='max_scores' type='number' value='4'/></div><br>\
                         <div class='mgcs_option'>Decimales <br><input id='decimals' type='number' value='2'/></div><br>\
                         <div class='mgcs_option'>Separador de decimales<br><span id='decimal_separator'><input type='radio' name='decimal_separator' value=',' checked>,<input type='radio' name='decimal_separator' value='.'>.</span></div>\
                         <center><button>Comenzar</button></center><span id='download_icon'></span></div>");

    $("body", frames.leftFrame.document).append(mgcs_options);


    //Styling the options menu
    $("#mgcs_options", frames.leftFrame.document).css({
        "border" : "1px solid black",
        "margin" : "0px 35px 0px 15px",
        "padding" : "10px 0px 10px 5px",
        "display" : "none",
        "border" : "1px solid rgb(162, 37, 37)",
        "background-color" : "rgba(218, 158, 158, 0.73)"
    });
    $(".mgcs_option", frames.leftFrame.document).css("margin-top","-5px");
    $(".mgcs_option input", frames.leftFrame.document).css("margin-left","30px");
    
    $("#mgcs_options button", frames.leftFrame.document).css("margin-top","15px");
    
    //Click on show options
    $("#start_mgcs", frames.leftFrame.document).click(function(){
        $("#mgcs_options", frames.leftFrame.document).slideToggle("slow");
    });
    
    //Click on start program
    $("#mgcs_options button", frames.leftFrame.document).click(function(){
        if($(this).text() === "Comenzar"){
            $(this).text("Terminar");
            continuar = true;
            defer_gotoSection(program);
        }
        else{
            $(this).text("Comenzar");
            continuar = false;
        }    
    });
    
});

function defer_gotoSection(method) {
    if ($("#titulo", frames.mainFrame.document).text() == "Score de socios de mi club")
        method();
    else{
		window.mainFrame.location = $("#general", frames.leftFrame.document).find('a').filter(function(index) { return $(this).text() === "Score de socios de mi club"; }).attr("href");
        setTimeout(function() { defer_gotoSection(method) }, clickWait);
	}
}

function program(){
    script_running = true;
    $(".downloadlink", frames['leftFrame'].document).remove();
    
    //Variables
	var minScores = $("#min_scores", frames.leftFrame.document).val();
	var maxScores = $("#max_scores", frames.leftFrame.document).val();
	var miClub = $("#golf_course", frames.leftFrame.document).val();
	var decimalRound = $("#decimals", frames.leftFrame.document).val();
	var decimalSeparator = $("#decimal_separator input[type='radio']:checked", frames.leftFrame.document).val();
    var startDate = $("#start_date", frames.leftFrame.document).val().split("-");
    var endDate = $("#end_date", frames.leftFrame.document).val().split("-");
       
    if(startDate[0] < 10)
        startDate[0] = '0'+startDate[0];
    if(startDate[1] < 10)
        startDate[1] = '0'+startDate[1];
    if(endDate[0] < 10)
        endDate[0] = '0'+endDate[0];
    if(endDate[1] < 10)
        endDate[1] = '0'+endDate[1];
    
    var dateStart = new Date(startDate[2],startDate[1],startDate[0]);
	var dateEnd = new Date(endDate[2],endDate[1],endDate[0]);
    
    var nombre = "";
	var players = [];
	var curPlayer = 0;
	var textFile = null;
	var results = [];

	//Para corregir los nombres
	function toTitleCase(str){
		str = str.replace(/ +(?= )/g,'');
		str = str.trim();
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}

	//Para ordenar los scores
	function sortNumber(a,b){
		return a - b;
	}
	
	//Para ordenar los resultados
	function sortResults(a,b){
		var split_a = a.split(";");
		var split_b = b.split(";");
		
		var cat_a = split_a[0];
		var cat_b = split_b[0];
		var avg_a = split_a[2];
		var avg_b = split_b[2];
		
		if(cat_a == cat_b){
			if(avg_a != avg_b)
				return avg_a - avg_b;
			
			var scores_a = split_a[3];
			var scores_b = split_b[3];
			
			var scores_a_split = scores_a.split("/");
			var scores_b_split = scores_b.split("/");
			
			if(scores_a_split.length != scores_b_split.length)
				return scores_b_split.length - scores_a_split.length;
			
			for(i = 0; i < scores_a_split.length; i++){
				if(scores_a_split[i] != scores_b_split[i])
					return scores_a_split[i] - scores_b_split[i];
			}
			return 0;
		}
		else{
			var valor_cat_a,valor_cat_b;
			
			switch(cat_a) {
				case "A":
					valor_cat_a = 1;break;
				case "B":
					valor_cat_a = 2;break;
				case "R":
					valor_cat_a = 3;break;
			}
			
			switch(cat_b) {
				case "A":
					valor_cat_b = 1;break;
				case "B":
					valor_cat_b = 2;break;
				case "R":
					valor_cat_b = 3;break;
			}
			
			return valor_cat_a - valor_cat_b;
		}
	}

	//Para redondear los promedios
	function round(value, exp) {
		if (typeof exp === 'undefined' || +exp === 0)
			return Math.round(value);

		value = +value;
		exp  = +exp;

		if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
			return NaN;

		  // Shift
		  value = value.toString().split('e');
		  value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp)));

		  // Shift back
		  value = value.toString().split('e');
		  return +(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp));
	}
	
	//Agregar el ranking
	function addRanking(res){
		var return_result = [];
		var curr_ranking = 1;
		var aux = 0;
		
		for(i = 0; i < res.length; i++){
			if(i > 0 && res[i].split(";")[2] == res[i-1].split(";")[2] && res[i].split(";")[3] == res[i-1].split(";")[3])
				aux++;
			else
				aux=0;
				
			//Aprovecho de dejar los decimales con "," en vez de "." en caso de solicitarlo
			return_result.push((curr_ranking-aux)+";"+res[i].replace(/\./g, decimalSeparator));

			if((i+1) < res.length && res[i].split(";")[0] != res[i+1].split(";")[0])
				curr_ranking = 1;
			else{
				curr_ranking++; 
			}
		}
		
		return return_result;
	}
	
	//Crea al archivo al terminar de recorrer a los jugadores
	function createFile() {
        var link = $('<a download="scores_('+startDate[2]+''+startDate[1]+''+startDate[0]+'-'+endDate[2]+''+endDate[1]+''+endDate[0]+').txt" id="downloadlink" class="downloadlink"><img src="http://www.silicon-power.com/support/ebook/images/iconmonstr-download-8-icon.png"/></a>');
		$("#download_icon", frames.leftFrame.document).append(link);
        
        $("#download_icon img", frames.leftFrame.document).css({
            "margin-top" : "-30px",
            "margin-right" : "5px",
            "width" : "40px",
            "height" : "40px",
            "float" : "right"
        });
               
		var final_text = "Se consideran únicamente las vueltas jugadas en "+miClub+" entre "+startDate[0]+"/"+startDate[1]+"/"+startDate[2]+" y "+endDate[0]+"/"+endDate[1]+"/"+endDate[2]+"\n";
		final_text += "Se consideran jugador@s con un mínimo de "+minScores+" tarjetas ingresadas en el sistema.\n";
		final_text += "Se consideran las mejores "+maxScores+" tarjetas como máximo.\n";
		final_text += "El promedio se redondea con "+decimalRound+" decimales.\n";
		final_text += "En caso de empate se considera quien tenga más tarjetas (con un máximo de "+maxScores+"). Si sigue el empate se considera la mejor tarjeta, sino la siguiente, asi sucesivamente. Si no hay diferencia se mantiene el empate.\n\n";
		final_text += "RANKING;CATEGORIA;NOMBRE COMPLETO;PROMEDIO;SCORES\n";
		final_text += results.join("\n");
		var file_link = makeTextFile(final_text);
		link.attr("href",file_link);
	  }
	  
	function makeTextFile(text) {
		var data = new Blob([text], {type: 'text/plain'});

		// If we are replacing a previously generated file we need to
		// manually revoke the object URL to avoid memory leaks.
		if (textFile !== null)
			window.URL.revokeObjectURL(textFile);

		textFile = window.URL.createObjectURL(data);

		return textFile;
	};

	//Seleccionar el siguiente jugador
	function nextPlayer(){
		player = players[curPlayer];
		
		var select_option = $("#clubesdeUsuario option[value='"+player+"']", frames['mainFrame'].document);
		
		nombre = toTitleCase(select_option.text());
		select_option.prop('selected', true)
		$("#Boton", frames['mainFrame'].document).click();
	};

	//Eliminar eventos antiguos
	$("frame[name=mainFrame]").off("load");

	//Mostrar los scores de un jugador
	$("frame[name=mainFrame]").on("load", function () {
        if(!script_running)
            return;
		console.log(nombre);
		var player_scores = [];
		var color = '';
		$("form[name=permisos] table:first tbody tr", frames['mainFrame'].document).each(function(){
			var full_date = $(this).find("td:eq(3)").text().trim().toString();
			if(full_date != ""){
				var split_date = full_date.split("-");
				var year = parseInt(split_date[0]);
				var month = parseInt(split_date[1]);
				var day = parseInt(split_date[2]);
				
				var fechaJuego = new Date(year,month,day);
				
				if(fechaJuego >= dateStart && fechaJuego < dateEnd){
					var club = $(this).find("td:eq(1)").text().trim().toString();
					color = $(this).find("td:eq(7)").css("background-color");
					if(color == "rgb(0, 0, 255)")
						color = "A";
					else if(color == "rgb(255, 0, 0)")
						color = "R";
					else if(color == "rgb(255, 255, 255)")
						color = "B";
						
					if(club == miClub || miClub == ""){
						var score = parseInt($(this).find("td:eq(8)").text().trim().toString());
						if(score >= 55){
							player_scores.push(score);
							console.log(score);
						}
					}
				}
			}
		});
			
		//Agregar los resultados solo si tiene alguna vuelta en el periodo
		if(player_scores.length >= minScores){
			player_scores.sort(sortNumber);
			player_scores = player_scores.slice(0,maxScores);
			
			var sum_scores = 0;
			for( var i = 0; i < player_scores.length; i++ )
				sum_scores += player_scores[i];
			var avg_score = round(sum_scores/player_scores.length,decimalRound);
			
			var result = color+";"+nombre+";"+avg_score+";"+player_scores.join("/");
			result = result.replace(/,+$/, "");
			results.push(result);
		}
		
		curPlayer++;
		//Continuar si aun no se ha terminado
		if(curPlayer < players.length && continuar)
			nextPlayer();
		else{
			//Ordenar el arreglo results y agregar el ranking
            results.sort(sortResults);
			results = addRanking(results);
            createFile();
            script_running = false;
            continuar = false;
            $("#mgcs_options button", frames.leftFrame.document).text("Comenzar");
		}
	});

	//Poblar el arreglo
	$("#clubesdeUsuario option", frames['mainFrame'].document).each(function(){
		var id = $(this).val();
		if (id != 0)
			players.push(id);
	});

	//Comenzar con el primero
	nextPlayer();
}