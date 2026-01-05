// ==UserScript==
// @name         super Wolacz alpha
// @namespace    http://www.wykop.pl/
// @version      0.1.7
// @description  enter something kurwa very useful
// @author       MirkoStats
// @match        http://www.wykop.pl/wpis/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11826/super%20Wolacz%20alpha.user.js
// @updateURL https://update.greasyfork.org/scripts/11826/super%20Wolacz%20alpha.meta.js
// ==/UserScript==

Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};




$(document).ready(main);

var limit = 20; //limit wołania

function main($) {

	$('.grid-right').prepend('<div class="r-block wolacz"> <h4>Lewator <a id="wolacz-rozwin" href=""><i class="fa fa-chevron-down"></i></a> </h4> <ul id="ukryte-ustawienia" <="" ul="" style="display: block;"> <li> <input type="text" name="lista_nickow" id="lista_nickow"> <br><br><button class="submit " tabindex="2" id="add_nicks">Dodaj</button> <button class="submit " tabindex="2" id="delete_nicks">Usuń</button> <button class="submit " tabindex="2" id="delete_all_nicks">Reset</button>  <button class="submit " tabindex="2" id="wolaj_nicki">Wolaj!</button> </li></ul></div>');
    $('#ukryte-ustawienia').find('button').css("padding-left","13px").css("padding-right","13px");
    
	$('#add_nicks').on('click', function(e) {
		e.preventDefault();
		var nicks = $('#lista_nickow').val();
		nicks = nicks.replace(/\s/g, "");

		parseNicks(nicks, addNicks);

	});

	$('#delete_nicks').on('click', function(e) {
		e.preventDefault();
		var nicks = $('#lista_nickow').val();
		nicks = nicks.replace(/\s/g, "");

		parseNicks(nicks, removeNicks);

	});

	$('#delete_all_nicks').on('click', function(e) {
		e.preventDefault();
		$('#lista_nickow').val("");

		if (confirm("Usunąc wszystkie nicki?") === true) {
			localStorage.setItem("wolacz", "[]");
			console.log("usunięto wszystkie nicki");
		}

		alert("ok");

	});


	$('#wolaj_nicki').on('click', function(e) {
		e.preventDefault();

		var nicks = JSON.parse(localStorage.getItem("wolacz")) || [];

		var michauRogal = [];
		var d = 0;

		var incr = function() {
			i += chunk;
		};


		if (nicks.length > 0) {
			if (confirm("Zawołac " + nicks.length + " osób?") === true) {

				var i=0;
				j = nicks.length;
				var temparray;

				(function dD(i) {

					if (i < j) {
						temparray = nicks.slice(i,i+limit);
						console.log(temparray);

						setTimeout(function(){
					    	wolaj20osob(temparray);
					    	i+=limit;
					    	dD(i);
					    },2000);
					} else {
						setTimeout(function(){
							alert("Gotowe.");
						},700);
					}
				})(0);
			}
		}
	});

}

function parseNicks(nicks, callback) {

	var array = nicks.split(',');
	console.log("Ilośc nicków: " + array.length);

	callback(array);

}


function addNicks(array) {

	var oldNicks = JSON.parse(localStorage.getItem("wolacz")) || [];

	array.forEach(function(element, index, array) {
		if (oldNicks.indexOf(element) == -1 && element !== "") {
			oldNicks.push(element);
		}
	});

	console.log("Liczba wszystkich nicków: " + oldNicks.length);
	localStorage.setItem("wolacz", JSON.stringify(oldNicks));
	$('#lista_nickow').val("");
	alert("Liczba nicków razem: " + oldNicks.length + "");

}

function removeNicks(array) {

	var oldNicks = JSON.parse(localStorage.getItem("wolacz")) || [];

	array.forEach(function(element, index, array) {
		console.log(element);
		var id = oldNicks.indexOf(element);
		console.log(id);

		if (id > -1) {
			oldNicks.remove(id);
			console.log("usunięto " + element);
		}
	});

	console.log("Pozostałe: " + oldNicks);
	localStorage.setItem("wolacz", JSON.stringify(oldNicks));

	$('#lista_nickow').val("");
	alert("ok, Liczba nicków razem: " + oldNicks.length + "");

}


function wolaj20osob(array) {
	var arr = [];
	array.forEach(function(el) {
		if (el.slice(0,1) !== '@') {
			return arr.push("@" + el);
		}
		return arr.push(el);
	})
	var a = arr.toString();

	a = a.replace(/,/g, " ");

	$('#commentForm > div > fieldset.arrow_box > textarea').val("Wołam: \n! " + a);

	setTimeout(function(){

		$('#commentForm > div > fieldset.row.buttons.dnone button.submit').trigger('click', function() {
			console.log('ok');
		});
	},200);
}
