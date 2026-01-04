// ==UserScript==
// @name     Librus średnia
// @version  final
// @description Oblicza średnią ważoną w Librus Synergia
// @grant    none
// @include https://synergia.librus.pl/przegladaj_oceny/uczen*
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @namespace https://greasyfork.org/users/167804
// @downloadURL https://update.greasyfork.org/scripts/37711/Librus%20%C5%9Brednia.user.js
// @updateURL https://update.greasyfork.org/scripts/37711/Librus%20%C5%9Brednia.meta.js
// ==/UserScript==
$(document).ready(function() {
	$("#mobile-banner").remove();
	$("#top-banner").attr("src", "https://i.imgur.com/Yq86JF7.png");

	var tabelka = $(".decorated.stretch").eq(1).children().eq(1);

	przelicz(tabelka.html());

	// symulacja
	var c_nr = 0;
	$('.sym').click(function() {

		var target_index = $(this).attr('index');

		// to - do

		return false;
	});

}); // on load

function validate_tr(tr) {
	if (tr.attr("name") == "przedmioty_all")
		return false;

	if (tr.attr("class") != "line0" && tr.attr("class") != "line1")
		return false;

	return true;
}

function przelicz(tabelka) {
	var pytajniki = $(".tooltip.helper-icon");
	var c_nr = 0;

	$(tabelka).each(function(tr_index) { // foreach <tr>
		var tr = $(this);

		var srednia_pierwszy = 0;
		var srednia_drugi = 0;
		var pierwszy_policzony = false;
		var drugi_policzony = false;
		var gora = 0;
		var dol = 0;

		if (!validate_tr(tr))
			return true;

		c_nr = c_nr + 1; // numer przedmiotu w tabeli od góry

		$(tr).children('td').each(function(td_index) { // foreach <td>
			var td = $(this);
			var td_html = $(this).html().toLowerCase().trim();

			// ---------------------------- oceny I semestr
			if (td_index == 2 && td_html != "brak ocen") {
				var gora = 0;
				var dol = 0;
				
				$(td).children('span').each(function(d_index) { // foreach <span>

					var span = $(this);
					var span_html = span.html().toLowerCase();
					var occur = span_html.indexOf("licz do średniej: tak");

					if (occur >= 0) {
						var children_count = span.children().length;
						var link = span.children().eq(children_count - 1); // fix na oceny poprawione

						var waga = parseInt(span_html.split("waga").pop().split('<')[0].replace(/\D/g, ''));
						var ocenka = parseFloat(cast_to_real_mark(link.text().trim()));

						gora = gora + (ocenka * waga);
						dol = dol + waga;
					}
				}); // foreach <span>

				srednia_pierwszy = round(gora / dol);
				pierwszy_policzony = true;
			}

			// ---------------------------- oceny II semestr
			if (td_index == 6 && td_html != "brak ocen") {
				 var gora_drugi = 0;
				 var dol_drugi = 0;
				$(td).children('span').each(function(d_index) { // foreach <span>

					var span = $(this);
					var span_html = span.html().toLowerCase();
					var occur = span_html.indexOf("licz do średniej: tak");

					if (occur >= 0) {
						var children_count = span.children().length;
						var link = span.children().eq(children_count - 1); // fix na oceny poprawione

						var waga = parseInt(span_html.split("waga").pop().split('<')[0].replace(/\D/g, ''));
						var ocenka = parseFloat(cast_to_real_mark(link.text().trim()));

						gora_drugi = gora_drugi + (ocenka * waga);
						dol_drugi = dol_drugi + waga;
					}
				}); // foreach <span>

				srednia_drugi = round(gora_drugi / dol_drugi);
				drugi_policzony = true;
			}

			// wypisz wynik
			if (pierwszy_policzony && !isNaN(srednia_pierwszy))
				replace_pytajnik(pytajniki.eq(c_nr * 3 - 2), srednia_pierwszy, c_nr);

			if (drugi_policzony && !isNaN(srednia_drugi))
				replace_pytajnik(pytajniki.eq(c_nr * 3 - 1), srednia_drugi, c_nr);

			if (pierwszy_policzony && drugi_policzony && !isNaN(srednia_pierwszy) && !isNaN(srednia_drugi)) {
				var srednia_koniec = round((srednia_pierwszy + srednia_drugi) / 2);
				replace_pytajnik(pytajniki.eq(c_nr * 3), srednia_koniec, c_nr);
			}

		}); // foreach <td>
	}); // foreach <tr> 
}

function round(num) {
	return (Math.floor(num * 100) / 100);
}

function cast_to_real_mark(ocena) {
	switch (ocena) {
		case '2-':
			return 1.75;
		case '3-':
			return 2.75;
		case '4-':
			return 3.75;
		case '5-':
			return 4.75;
		case '6-':
			return 5.75;
		case '1+':
			return 1.5;
		case '2+':
			return 2.5;
		case '3+':
			return 3.5;
		case '4+':
			return 4.5;
		case '5+':
			return 5.5;
		case '6+':
			return 6.5;
		default:
			return ocena;
	}
}

// t - obiekt dom (pytajnik), ocena - do podmiany, index - pozycja w tabeli do ew. symulacji
function replace_pytajnik(t, ocena, index) {
	var sym = "<a href='#' class='sym' index='" + index + "'><sup>[s]</sup></a>";
	sym = ""; // to - do  
	t.replaceWith(ocena + sym);
}

function hide_anti_tamper() {
	if ($(".modal-box").length)
		$(".modal-box").remove();
}
$('body').bind("DOMSubtreeModified", hide_anti_tamper);