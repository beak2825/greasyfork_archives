/*
	* 1.1.0 - 2 de Julio 2017
		Se añade información de revisionados
		Se añaden estilos a las páginas de tours
		Corrección de 2017 en gráficas de años
		Se mueve a un nuevo servidor la página de soporte
		Se añaden comentarios a fichas de películas
		Se añade posibilidad de valorar actores en pelis vistas
		Se añade temporadas a series de TV
		Se añade posibilidad de votar episodios
		Se añaden listas favoritas de Letterboxd
		Otras Correcciones menores

    * 1.0.6.6 - 17 de Junio 2017
        Correcciones menores (cortometrajes, imdb, ancho búsquedas/topics)
        Corrección añadir listas favoritas de otro usuario en FA

	* 1.0.6.5 - 6 de Junio 2017
		Corrección en script al coger el usuario

	* 1.0.6.4 - 27 de Diciembre 2016
		Correcciones en extraer datos
		Añadir extraer datos de IMDB para más campos al editar fichas

	* 1.0.6.3 - 10 de Diciembre 2016
		Correcciones menores en extraer datos de IMDB

	* 1.0.6.2
		Arreglado coger el id de usuario tras el cambio de quitarlo del nick

	* 1.0.6.1 - 25 de Septiembre 2016
		Correcciones menores en extraer datos de IMDB

	* 1.0.6 - 18 de Septiembre 2016
		Añadidos votos en top FA

	* 1.0.5 - 1 de Julio 2016
		Añadidos votos en todas las películas
		Añadida información adicional en "Datos Personales"

	* 1.0.4 - 26 de Junio 2016
		Arreglado actualizar votos
		Arreglado mostrar notas en búsquedas tras el cambio de diseño
		Arreglado mostrar notas en topics
		Cambiado estilo de notas en listas propias
		Arreglado votos en listas de otros y cuadro resumen
		Añadido en estadísticas número de votos en año actual

	* 1.0.3.1 - 25 de Abril 2016
		Arreglado obtener duración de IMDB 

	* 1.0.3 - 24 de Abril 2016
		Añadida notas de usuario en grupos

	* 1.0.2 - 14 de Septiembre 2015
		Añadido botón de eliminar listas favoritas
		Arregladas listas favoritas

	* 1.0.1 - 14 de Septiembre 2015
		Añadido Kosovo a la lista de países
		Añadida media de votaciones en fichas de actores/directores
		Añadido botón para borrar los votos
		Añadida fichas para actores/directores sin datos
		Añadido botones para extraer actores y sinopsis de fichas ya creadas
		Añadido contador de caracteres en añadir/editar fichas de peliculas

	* 1.0.0 - 13 de Septiembre 2015
		Primera versión pública     
*/
// ==UserScript==
// @name       FA++
// @namespace  http://www.filmaffinity.com/
// @version    1.1.0
// @description  Añade distintas mejoras a la página 
// @match      http://www.filmaffinity.com/*
// @match      https://www.filmaffinity.com/*
// @match      http://www.imdb.com/list/*
// @match      https://letterboxd.com/*
// @require    https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require    https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @require    https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js
// @require    https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.22.1/js/jquery.tablesorter.min.js
// @require    https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.22.1/js/jquery.tablesorter.widgets.js
// @resource   rateYoCSS   https://cdnjs.cloudflare.com/ajax/libs/rateYo/2.3.2/jquery.rateyo.min.css
// @require	   https://cdnjs.cloudflare.com/ajax/libs/rateYo/2.3.2/jquery.rateyo.min.js
// @grant      GM_addStyle
// @grant      GM_xmlhttpRequest
// @grant      GM_setValue
// @grant      GM_getValue
// @grant      GM_deleteValue
// @grant      GM_getResourceText
// @copyright  2015+, benjani
// @downloadURL https://update.greasyfork.org/scripts/12421/FA%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/12421/FA%2B%2B.meta.js
// ==/UserScript==

var url = location.href;

$.expr[":"].contains = $.expr.createPseudo(function (arg) {
	return function (elem) {
		return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
	};
});

$(document).ready(function () {

	if (/imdb/.test(url))
		addIconFavListIMDB();
	else if (/letterboxd/.test(url)) {
		addIconFavListLXD();
	}
	else {
		if (idprop) {
			if ($('#show-msg a') !== undefined)
				$('#show-msg a').css('color', 'yellow');

			//$('#awardsmenu').append('<li class="sep">|</li><li><a href="/es/listsrank.php"> Ranking listas</a></li>');

			switch (true) {
				case /userratings/.test(url):
					addUserRatings();
					break;
				case /mydata\.php/.test(url):
					addMyData();
					addPanelConf();
					//addResumenFA();
					break;
				case /\/film\d{6}\.html/.test(url):
					addOtherLinks();
					addMovieData();
					var showOtherR = localStorage.getItem(idprop + "_showOtherR") !== null ? eval(localStorage.getItem(idprop + "_showOtherR")) : false;
					if (showOtherR)
						addOtherRatings();
					break;
				case /userlist\.php/.test(url):
					addOtherList();
					break;
				case /userlists\.php/.test(url):
					addIconFavListFA();
					break;
				case /mylist\.php/.test(url):
					changeMyList();
					break;
				case /mylists\.php/.test(url):
					changeMyLists();
					break;
				case /search\.php/.test(url):
					addSearch(url);
					break;
				case /movietopic/.test(url):
					addMTopic();
					break;
				case /myfriends2/.test(url):
					$('#select-group').on('change', function () {
						addChangeFriends();
					});
					addChangeFriends();
					break;
				case /tour\.php/.test(url):
					addStylesTour();
					break;
				case /listtopmovies\.php/.test(url):
					addVotesTLists();
					break;
				case /topgen\.php/.test(url):
					addTopGen();
					break;
				case /addmovie\.php/.test(url):
					addDataFromIMDB();
					break;
				case /editmovie\.php/.test(url):
					editDataFromIMDB();
					break;
				case /reviews/.test(url):
					changeStyleRw();
					break;
				case /group\.php\?group/.test(url):
					addGroupVotes();
					break;
				case /userrep\.php/.test(url):
					var changeOtherStats = localStorage.getItem(idprop + "_changeStats") !== null ? eval(localStorage.getItem(idprop + "_changeStats")) : false;
					if (changeOtherStats)
						changeStats();
					break;
				case /allfilms/.test(url):
					ponerVotosAllFilms();
					break;
				case /imthread/.test(url):
					changeInbox();
					break;
				default:
					break;
			}
		}
	}
});

if (/imdb/.test(url) === false) {

	//var idprop = $('#user-nick a').attr('href').split('=')[1];
	var idprop = $('.user-menu-wr > ul > li:first-child > a').attr('href').split("=")[1];

	var months = { 'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04', 'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08', 'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12' };

	var genCodes = {
		"Acción": "AC", "Animación": "AN", "Aventuras": "AV", "Bélico": "BE", "Ciencia ficción": "CF", "Cine negro": "CN", "Comedia": "CO", "Desconocido": "DE", "Documental": "DO", "Drama": "DR",
		"Fantástico": "FN", "Infantil": "IF", "Intriga": "IT", "Musical": "MU", "Romance": "RO", "Serie de TV": "TV", "Terror": "TE", "Thriller": "TH", "Western": "WE"
	};

	var anioCodes = {
		"1900 - 1929": "A1", "1930 - 1939": "A2", "1940 - 1949": "A3", "1950 - 1959": "A4", "1960 - 1969": "A5", "1970 - 1979": "A6", "1980 - 1989": "A7", "1990 - 1999": "A8", "2000": "2A", "2001": "2B", "2002": "2C",
		"2003": "2D", "2004": "2E", "2005": "2F", "2006": "2G", "2007": "2H", "2008": "2I", "2009": "2J", "2010": "2K", "2011": "2L", "2012": "2M", "2013": "2N", "2014": "2P", "2015": "2Q", "2016": "2R", "2017": "2S"
	};

	var countriesCodes = {
		"Afganistán": "AF", "Albania": "AL", "Alemania del Este (RDA)": "FD", "Alemania del Oeste (RFA)": "FF", "Alemania": "DE", "Andorra": "AD", "Angola": "AO", "Antigua y Barbuda": "AG", "Arabia Saudí": "SA",
		"Argelia": "DZ", "Argentina": "AR", "Armenia": "AM", "Australia": "AU", "Austria": "AT", "Azerbaijan": "AZ", "Bahamas": "BS", "Bahrein": "BH", "Bangladesh": "BD", "Barbados": "BB", "Bélgica": "BE", "Belize": "BZ",
		"Benín": "BJ", "Bielorusia": "BY", "Bolivia": "BO", "Bosnia y Herzegovina": "BA", "Botswana": "BW", "Brasil": "BR", "Brunei": "BN", "Bulgaria": "BG", "Burkina Faso": "BF", "Burundi": "BI", "Bután": "BT", "Cabo Verde": "CV",
		"Camboya": "KH", "Camerún": "CM", "Canadá": "CA", "Chad": "TD", "Checoslovaquia": "ZX", "Chile": "CL", "China": "CN", "Chipre": "CY", "Colombia": "CO", "Comores": "KM", "Congo": "CG", "Corea del Norte": "KP",
		"Corea del Sur": "KR", "Costa de Marfil": "CI", "Costa Rica": "CR", "Croacia": "HR", "Cuba": "CU", "Dinamarca": "DK", "Dominica": "DM", "Ecuador": "EC", "Egipto": "EG", "El Salvador": "SV", "Emiratos Árabes": "AE",
		"Eritrea": "ER", "Eslovaquia": "SK", "Eslovenia": "SI", "España": "ES", "Estados Unidos": "US", "Estonia": "EE", "Etiopía": "ET", "Fidji": "FJ", "Filipinas": "PH", "Finlandia": "FI", "Francia": "FR", "Gabón": "GA",
		"Gambia": "GM", "Georgia": "GE", "Ghana": "GH", "Granada": "GD", "Grecia": "GR", "Groenlandia": "GL", "Guatemala": "GT", "Guinea Bissau": "GW", "Guinea Ecuatorial": "GQ", "Guinea": "GN", "Guyana": "GY", "Haití": "HT",
		"Honduras": "HN", "Hong Kong": "HK", "Hungría": "HU", "India": "IN", "Indonesia": "ID", "Irak": "IQ", "Irán": "IR", "Irlanda": "IE", "Islandia": "IS", "Israel": "IL", "Italia": "IT", "Jamaica": "JM", "Japón": "JP", "Jordania": "JO",
		"Kazajstán": "KZ", "Kenia": "KE", "Kirguizstán": "KG", "Kuwait": "KW", "Laos": "LA", "Lesotho": "LS", "Letonia": "LE", "Líbano": "LB", "Liberia": "LR", "Libia": "LY", "Liechtenstein": "LI", "Lituania": "LT",
		"Luxemburgo": "LU", "Macedonia": "MK", "Madagascar": "MG", "Malasia": "MY", "Malawi": "MW", "Maldivas": "MV", "Mali": "ML", "Malta": "MT", "Marruecos": "MA", "Marshall (Islas)": "MH", "Mauricio (Isla)": "MU",
		"Mauritania": "MR", "México": "MX", "Micronesia": "FM", "Moldavia": "MD", "Mónaco": "MC", "Mongolia": "MN", "Montenegro": "ME", "Mozambique": "MZ", "Myanmar - Birmania": "MM", "Namibia": "NA",
		"Nepal": "NP", "Nicaragua": "NI", "Níger": "NE", "Nigeria": "NG", "Noruega": "NO", "Nueva Zelanda": "NZ", "Omán": "OM", "Países Bajos (Holanda)": "NL", "Palau": "PW", "Palestina": "PS", "Panamá": "PA", "Papuasia Nueva Guinea": "PG", "Paquistán": "PK", "Paraguay": "PY",
		"Perú": "PE", "Polonia": "PL", "Portugal": "PT", "Puerto Rico": "PR", "Qatar": "QA", "Reino Unido": "GB", "Rep. Centroafricana": "CF", "Rep. Dominicana": "DO", "República Checa": "CZ", "República del Congo": "CD",
		"Ruanda": "RW", "Rumanía": "RO", "Rusia": "RU", "Samoa": "WS", "San Marino": "SM", "Santo Tomé y Príncipe": "ST", "Senegal": "SN", "Serbia y Montenegro": "RR", "Serbia": "RS", "Seychelles": "SC", "Sierra Leona": "SL", "Singapur": "SG",
		"Siria": "SY", "Somalia": "SO", "Sri Lanka": "LK", "Sudán": "SD", "Suecia": "SE", "Suiza": "CH", "Sudáfrica": "ZA", "Surinam": "SR", "Swazilandia": "SZ", "Tailandia": "TH", "Taiwán": "TW", "Tajikistan": "TJ", "Tanzania": "TZ",
		"Togo": "TG", "Trinidad y Tobago": "TT", "Túnez": "TN", "Turkmenistán": "TM", "Turquía": "TR", "Ucrania": "UA", "Uganda": "UG", "Unión Soviética (URSS)": "ZY", "Uruguay": "UY",
		"Uzbekistan": "UZ", "Vanuatu": "VU", "Venezuela": "VE", "Vietnam": "VN", "Yemen": "YE", "Yugoslavia": "YU", "Zambia": "ZM", "Zimbabwe": "ZW"
	};

	var countriesCodesIMDB = {
		"Afghanistan": "AF", "Albania": "AL", "East Germany": "FD", "West Germany": "FF", "Germany": "DE", "Andorra": "AD", "Angola": "AO", "Antigua and Barbuda": "AG", "Saudi Arabia": "SA",
		"Algeria": "DZ", "Argentina": "AR", "Armenia": "AM", "Australia": "AU", "Austria": "AT", "Azerbaijan": "AZ", "Bahamas": "BS", "Bahrain": "BH", "Bangladesh": "BD", "Barbados": "BB", "Belgium": "BE", "Belize": "BZ",
		"Benin": "BJ", "Belarus": "BY", "Bolivia": "BO", "Bosnia and Herzegovina": "BA", "Botswana": "BW", "Brazil": "BR", "Brunei": "BN", "Bulgaria": "BG", "Burkina Faso": "BF", "Burundi": "BI", "Bhutan": "BT", "Cape Verde": "CV",
		"Cambodia": "KH", "Cameroon": "CM", "Canada": "CA", "Chad": "TD", "Czechoslovakia": "ZX", "Chile": "CL", "China": "CN", "Cyprus": "CY", "Colombia": "CO", "Comoros": "KM", "Congo": "CG", "North Korea": "KP",
		"South Korea": "KR", "Côte d'Ivoire": "CI", "Costa Rica": "CR", "Croatia": "HR", "Cuba": "CU", "Denmark": "DK", "Dominica": "DM", "Ecuador": "EC", "Egypt": "EG", "El Salvador": "SV", "United Arab Emirates": "AE",
		"Eritrea": "ER", "Slovakia": "SK", "Slovenia": "SI", "Spain": "ES", "USA": "US", "Estonia": "EE", "Ethiopia": "ET", "Fiji": "FJ", "Philippines": "PH", "Finland": "FI", "France": "FR", "Gabon": "GA",
		"Gambia": "GM", "Georgia": "GE", "Ghana": "GH", "Granada": "GD", "Greece": "GR", "Greenland": "GL", "Guatemala": "GT", "Guinea-Bissau": "GW", "Equatorial Guinea": "GQ", "Guinea": "GN", "Guyana": "GY", "Haiti": "HT",
		"Honduras": "HN", "Hong Kong": "HK", "Hungary": "HU", "India": "IN", "Indonesia": "ID", "Iraq": "IQ", "Iran": "IR", "Ireland": "IE", "Iceland": "IS", "Israel": "IL", "Italy": "IT", "Jamaica": "JM", "Japan": "JP", "Jordan": "JO",
		"Kazakhstan": "KZ", "Kenya": "KE", "Kyrgyzstan": "KG", "Kosovo": "KO", "Kuwait": "KW", "Laos": "LA", "Lesotho": "LS", "Latvia": "LE", "Lebanon": "LB", "Liberia": "LR", "Libya": "LY", "Liechtenstein": "LI", "Lithuania": "LT",
		"Luxembourg": "LU", "Republic of Macedonia": "MK", "Madagascar": "MG", "Malaysia": "MY", "Malawi": "MW", "Maldives": "MV", "Mali": "ML", "Malta": "MT", "Morocco": "MA", "Marshall Islands": "MH", "Mauritius": "MU",
		"Mauritania": "MR", "Mexico": "MX", "Federated States of Micronesia": "FM", "Moldova": "MD", "Monaco": "MC", "Mongolia": "MN", "Montenegro": "ME", "Mozambique": "MZ", "Myanmar": "MM", "Namibia": "NA",
		"Nepal": "NP", "Nicaragua": "NI", "Niger": "NE", "Nigeria": "NG", "Norway": "NO", "New Zealand": "NZ", "Oman": "OM", "Netherlands": "NL", "Palau": "PW", "Palestine": "PS", "Panama": "PA", "Papua New Guinea": "PG", "Pakistan": "PK", "Paraguay": "PY",
		"Peru": "PE", "Poland": "PL", "Portugal": "PT", "Puerto Rico": "PR", "Qatar": "QA", "UK": "GB", "United Kingdom": "GB", "Central African Republic": "CF", "Dominican Republic": "DO", "Czech Republic": "CZ", "Democratic Republic of the Congo": "CD",
		"Rwanda": "RW", "Romania": "RO", "Russia": "RU", "Samoa": "WS", "San Marino": "SM", "Sao Tome and Principe": "ST", "Senegal": "SN", "Serbia and Montenegro": "RR", "Serbia": "RS", "Seychelles": "SC", "Sierra Leone": "SL", "Singapore": "SG",
		"Syria": "SY", "Somalia": "SO", "Sri Lanka": "LK", "Sudan": "SD", "Sweden": "SE", "Switzerland": "CH", "South Africa": "ZA", "Suriname": "SR", "Swaziland": "SZ", "Thailand": "TH", "Taiwan": "TW", "Tajikistan": "TJ", "Tanzania": "TZ",
		"Togo": "TG", "Trinidad and Tobago": "TT", "Tunisia": "TN", "Turkmenistan": "TM", "Turkey": "TR", "Ukraine": "UA", "Uganda": "UG", "Soviet Union": "ZY", "Uruguay": "UY",
		"Uzbekistan": "UZ", "Vanuatu": "VU", "Venezuela": "VE", "Vietnam": "VN", "Yemen": "YE", "Yugoslavia": "YU", "Zambia": "ZM", "Zimbabwe": "ZW"
	};

	var extSites = {
		abandomoviez: { name: 'Abandomoviez', icon: 'https://www.abandomoviez.net/favicon.ico', search: 'http://www.abandomoviez.net/db/busca_titulo_o.php?busco2=%searchvo' },
		aullidos: { name: 'Aullidos', icon: 'https://www.aullidos.com/imagenes/scream-16.ico', search: 'http://www.aullidos.com/buscador.asp?txtBusqueda=%searchtr' },
		cineol: { name: 'CINeol', icon: 'http://www.cineol.net/favicon.ico', search: 'http://www.cineol.net/multisearch.php?fan=1&where=movies&search=%searchvo' },
		cinepatas: { name: 'Cinépatas', icon: 'http://www.cinepatas.com/favicon.ico', search: 'http://www.cinepatas.com/forum/searcher.php?search_keywords=%searchtr&easy_search=titles' },
		google: { name: 'Google', icon: 'https://www.google.es/favicon.ico', search: 'http://www.google.es/search?q=%searchvo' },
		imdb: { name: 'IMDb', icon: 'http://ia.media-imdb.com/images/G/01/imdb/images/favicon-2165806970._CB522736556_.ico', search: 'http://www.imdb.com/find?q=%searchvo' },
		labutaca: { name: 'La Butaca', icon: 'http://www.labutaca.net/favicon.ico', search: 'http://www.google.com/custom?q=%searchvo&sa=Buscar+en&sitesearch=www.labutaca.net&q=&domains=www.labutaca.net' },
		mrskin: { name: 'Mr. Skin', icon: 'https://www3.mrskincdn.com/mrskin_assets/favicon-dab123f818a03a6099a81b6add52e937.ico', search: 'http://www.mrskin.com/search/titles?term=%searchvo' },
		myanimelist: { name: 'MyAnimeList', icon: 'https://myanimelist.cdn-dena.com/images/faviconv5.ico', search: 'http://myanimelist.net/anime.php?q=%searchanm' },
		rotten: { name: 'Rotten Tomatoes', icon: 'https://www.rottentomatoes.com/favicon.ico', search: 'http://www.rottentomatoes.com/search/?search=%searchvo' },
		yahoo: { name: 'Yahoo! Movies', icon: 'https://www.yahoo.com/favicon.ico', search: 'http://movies.yahoo.com/mv/search?p=%searchvo&x=0&y=0&fr=ush-movies&toggle=1&cop=&ei=UTF-8' },
		avistaz: { name: 'AvistaZ', icon: 'https://avistaz.to/images/avistaz-favicon.png', search: 'https://avistaz.to/movies?search=%searchvo&imdb=&tmdb=&tvdb=', regreq: true },
		cinemageddon: { name: 'Cinemageddon', icon: 'https://cinemageddon.net/favicon.ico', search: 'http://cinemageddon.net/browse.php?search=%searchvo', regreq: true },
		cinemaz: { name: 'CinemaZ', icon: 'https://cinemaz.to/images/cinemaz-favicon.png', search: 'https://cinemaz.to/movies?search=%searchvo', regreq: true },
		clansa: { name: 'Clan-Sudamérica', icon: 'http://www.clan-sudamerica.net/invision/favicon.ico', search: 'http://www.clan-sudamerica.net/invision/index.php?act=Search', regreq: true },
		divxclasico: { name: 'DivX Clásico', icon: 'http://www.divxclasico.com/favicon.ico', search: 'http://www.divxclasico.com/foro/search.php?search_keywords=%searchvo&highlight=%searchvo' },
		hispashare: { name: 'HispaShare', icon: 'http://www.hispashare.com/favicon.ico', search: 'http://www.hispashare.com/?view=search&q=%searchtr', regreq: true },
		isohunt: { name: 'isoHunt', icon: 'https://isohunt.to/favicon.ico', search: 'http://isohunt.com/torrents/%searchvo?ihs1=2&iho1=d&iht=1' },
		karagarga: { name: 'Karagarga', icon: 'https://karagarga.in/favicon.ico', search: 'https://karagarga.in/browse.php?search=%searchvo&search_type=title', regreq: true },
		nordiken: { name: 'Nordiken', icon: 'http://nordiken.net/favicon.ico', search: 'http://nordiken.net/search.php', regreq: true },
		patio: { name: 'Patio de Butacas', icon: 'http://www.patiodebutacas.org/foro/favicon.ico', search: 'http://www.patiodebutacas.org/foro/search.php?query=%searchvo&exactname=0&starteronly=0&forumchoice[]=0&prefixchoice[]=&childforums=1&titleonly=0&showposts=0&searchdate=0&beforeafter=after&sortby=lastpost&sortorder=descending&replyless=0&replylimit=0&searchthreadid=0&saveprefs=1&quicksearch=0&searchtype=1&nocache=0&ajax=0&userid=0&', regreq: true },
		piratebay: { name: 'The Pirate Bay', icon: 'https://thepiratebay.cr/favicon.ico', search: 'http://thepiratebay.cr/search/%searchvo/0/99/200' },
		surrealmoviez: { name: 'Surreal Moviez', icon: 'https://surrealmoviez.info/includes/favicon/ms-icon-144x144.png', search: 'https://surrealmoviez.info/advanced_search.php?stitle=%searchvo', regreq: true },
		opensubtitles: { name: 'OpenSubtitles', icon: 'https://static.opensubtitles.org/favicon.ico', search: 'http://www.opensubtitles.com/es/search2/sublanguageid-spa/moviename-%searchvo' }, // comienza subs
		podnapisi: { name: 'Podnapisi', icon: 'https://www.podnapisi.net/static/favicon.ico', search: 'http://www.podnapisi.net/subtitles/search/?keywords=%searchvo' },
		subdivx: { name: 'SubDivX', icon: 'http://www.subdivx.com/favicon.ico', search: 'http://www.subdivx.com/index.php?buscar=%searchvo&accion=5&subtitulos=1&realiza_b=1' },
		subscene: { name: 'Subscene', icon: 'https://subscene.com/favicon.ico', search: 'http://subscene.com/subtitles/title?q=%searchvo' }
	};
}
// Función que nos permite eliminar los carácteres en blanco al principio y final de una cadena
String.prototype.trim = function () {
	return this.replace(/^\s+|\s+$/g, '');
};

String.prototype.rmaccents = function () {
	var charsac = { "á": "a", "é": "e", "è": "e", "í": "i", "ó": "o", "ú": "u" };
	return this.replace(/[áéèíóú]/g, function (c) {
		return charsac[c];
	});
};

String.prototype.findNode = function (context) {
	//Si no se pasa ningún argumento, context = document
	//var xpathResult = document.evaluate( xpathExpression, contextNode, namespaceResolver, resultType, result );
	// -xpathExpression: expresión que queremos buscar en el XML 
	// -contextNode: nodo padre del que dependerá la expresión (con document se puede acceder a todo)
	// -namespaceResolver: null para html
	// -resultType: constante que indica el tipo en que queremos recibir el resultado (FIRST... -> primer nodo del resultado
	// -result: sirve para reutilizar el objeto xpathresult, con null uno nuevo
	if (typeof context == "undefined") context = document;
	var nodo = document.evaluate(this, context, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (typeof nodo == "undefined" || nodo == null) {
		console.log("Nodo no encontrado: " + this);
		nodo = null;
	}
	return nodo;
};
String.prototype.findNodes = function (context) {
	if (typeof context == "undefined") context = document;
	return findNodes(context, this);
};
String.prototype.findNodesArray = function (context) {
	if (typeof context == "undefined") context = document;
	return findNodesArray(context, this);
};

function findNodes(context, xpath) {
	return document.evaluate(xpath, context, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
}
function findNodesArray(context, xpath) {
	var nodes = [];
	var node;
	var iterator = findNodes(context, xpath);
	while ((node = iterator.iterateNext()) != null) {
		nodes.push(node);
	}
	return nodes;
}

function color_voto(voto) {

	if (voto === "-")
		return "steelblue";
	else if (voto === "10")
		return "#008B00";
	else if (voto === "9" || voto === "8" || voto === "7")
		return "#5cb85c";
	else if (voto === "6" || voto === "5" || voto === "4")
		return "#f0ad4e";
	else
		return "#d9534f";
}

function doGet(url, cb) {
	GM_xmlhttpRequest({
		method: "GET",
		url: url,
		onload: function (xhr) {
			cb(xhr.responseText);
		}
	});
}

function addMiles(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + '.' + '$2');
	}
	return x1 + x2;
}

function doAddFlagsMyData() {

	var styleTemplate = 'padding-left: 21px; background: url("{URL}") no-repeat scroll center left', tdaux;
	var baseUrl = "http://www.filmaffinity.com/imgs/countries/";
	var countriesTable = $('.rbc').find('table');

	for (var i = 0; i < countriesTable.find('tr').length; ++i) {
		tdaux = countriesTable.find('tr:eq(' + i + ') td:eq(0)');
		tdaux.attr('style', styleTemplate.replace(/{URL}/g, baseUrl + countriesCodes[tdaux.html()] + ".jpg"));
	}
}

function doAddClasif() {

	var txt = "<div class=\"box\"><div class=\"h\" id='clasificaciones'>Clasificaciones</div><div class='b'>", i;
	txt += "<ul class=\"cols\">";
	txt += "<li><table id='clas_paises'><caption>Por países</caption>";
	txt += '<tr style="height: 35px;"><td colspan="4" style="text-align: center"><select id="sel_pais" name="sel_pais">';

	for (i in countriesCodes) {
		txt += '<option ';
		if (i === "España")
			txt += 'selected ';
		txt += 'value="' + countriesCodes[i] + '">' + i + '</option>';
	}

	txt += "</select></td></tr></table></li>";
	txt += "<li style='margin: 0 20px'><table id='clas_generos'><caption>Por géneros</caption>";
	txt += '<tr style="height: 35px;"><td colspan="4" style="text-align: center"><select id="sel_generos" name="sel_genero">';

	for (i in genCodes)
		txt += '<option value="' + genCodes[i] + '">' + i + '</option>';

	txt += "</select></td></tr></table></li>";
	txt += "<li><table id='clas_anios'><caption>Por años</caption>";
	txt += '<tr style="height: 35px;"><td colspan="4" style="text-align: center"><select id="sel_anios" name="sel_anio">';

	txt += '<option value="A1">18XX - 1929</option>';
	txt += '<option value="A2">1930 - 1939</option>';
	txt += '<option value="A3">1940 - 1949</option>';
	txt += '<option value="A4">1950 - 1959</option>';
	txt += '<option value="A5">1960 - 1969</option>';
	txt += '<option value="A6">1970 - 1979</option>';
	txt += '<option value="A7">1980 - 1989</option>';
	txt += '<option value="A8">1990 - 1999</option>';
	txt += '<option value="2A">2000</option>';
	txt += '<option value="2B">2001</option>';
	txt += '<option value="2C">2002</option>';
	txt += '<option value="2D">2003</option>';
	txt += '<option value="2E">2004</option>';
	txt += '<option value="2F">2005</option>';
	txt += '<option value="2G">2006</option>';
	txt += '<option value="2H">2007</option>';
	txt += '<option value="2I">2008</option>';
	txt += '<option value="2J">2009</option>';
	txt += '<option value="2K">2010</option>';
	txt += '<option value="2L">2011</option>';
	txt += '<option value="2M">2012</option>';
	txt += '<option value="2N">2013</option>';
	txt += '<option value="2P">2014</option>';
	txt += '<option value="2Q">2015</option>';
	txt += '<option value="2R">2016</option>';
	txt += '<option selected value="2S">2017</option>';

	txt += "</select></td></tr></table></li>";
	txt += "</ul>";
	txt += "</div></div>";

	$(".zdates").append(txt);
	addDataClas("ES", "paises");
	addDataClas("AC", "generos");
	addDataClas("2S", "anios");

	$("#sel_pais").change(function () {
		$("#clas_paises").find("tr:gt(0)").remove();
		addDataClas($(this).val(), "paises");
	});

	$("#sel_generos").change(function () {
		$("#clas_generos").find("tr:gt(0)").remove();
		addDataClas($(this).val(), "generos");
	});

	$("#sel_anios").change(function () {
		$("#clas_anios").find("tr:gt(0)").remove();
		addDataClas($(this).val(), "anios");
	});

	function addDataClas(codigo, cclas) {

		var urlc = "https://fasupport.000webhostapp.com/fa/", order, color, pos;

		if (cclas == "paises") {
			urlc += 'paises.php?cpais=';
			order = 6;
		}
		else if (cclas == "generos") {
			urlc += 'generos.php?cgenre=';
			order = 8;
		}
		else if (cclas == "anios") {
			urlc += 'anios.php?canio=';
			order = 1;
		}
		urlc += codigo;

		$.get(urlc, function (data) {

			var arr = eval(data.split('#')[0]);
			var txtfila = "";
			for (var i in arr) {

				pos = parseInt(i);
				if (pos === 0)
					color = "#CDAD00";
				else if (pos === 1)
					color = "#B7B7B7";
				else if (pos === 2)
					color = "#B87333";
				else if (idprop === arr[i].userid)
					color = "blue";
				else
					color = "black";

				var name = arr[i].nick;
				if (name.indexOf("h e r m a n") != -1)
					name = "hermanonegro";
				if (name.indexOf("dovicum") != -1)
					name = "Luis (Ludovicum)";
				if (name.indexOf("Markus David") != -1)
					name = "Markus David S.";

				txtfila += "<tr style='color: " + color + "'>";
				txtfila += '<td style="text-align:right; font-weight: bold;">' + (pos + 1) + '&nbsp;</td>';
				txtfila += '<td width="140px"><a href="http://www.filmaffinity.com/es/userratings.php?user_id=' + arr[i].userid + '&orderby=' + order + '"';
				txtfila += 'target="_blank" style="text-decoration: none; color: ' + color + '">' + name + '</a></td>';
				txtfila += '<td style="text-align: right; width: 35px; font-weight: bold">' + arr[i].votos + '</td>';
				txtfila += '<td style="text-align: right; width: 35px; font-weight: bold">' + arr[i].media.replace('.', ',') + '</td>';
				txtfila += "</tr>";
			}
			$('#clas_' + cclas).append(txtfila);
		});
	}
}

function addPanelConf() {
	GM_addStyle(".e_links {width: 28%; float: left; padding: 7px 5px; margin: 0 12px;}");
	GM_addStyle(".title-conf {font-family: Trebuchet MS, sans-serif; font-size: 17px; text-align: center; margin: 0 0 15px; font-weight: bold; color: rgb(154,186,144);}");
	var votos_act = 0, i;
	if (localStorage.getItem(idprop + "_" + 'votos') !== null) {
		votos_act = JSON.parse(localStorage.getItem(idprop + "_" + 'votos'));
		votos_act = Object.keys(votos_act).length - 1;
	}
	votos_act = parseInt($('li > a > strong').first().text()) - votos_act;

	var txt = "<div class=\"box\"><div class=\"h\" id='panelconfiguracion'>Panel de Configuración FA++";
	txt += "<a id='act_votos' title='Actualizar votos' style='cursor:pointer'>Actualizar votos (" + votos_act + " por actualizar)</a></div><div class='b' id='bpanconf' style='overflow:auto;'>";
	txt += "<p class='title-conf'>Links externos</p>";
	txt += "<fieldset class='e_links'><legend>Información</legend>";
	for (i in extSites) {
		var ischeck = "";
		if ((ischeck = localStorage.getItem(idprop + "_" + i)) !== null)
			ischeck = "checked";
		txt += "<label for='" + i + "'><img src='" + extSites[i].icon + "' style='width: 15px' /> <input type='checkbox' name='ext_link' id='" + i + "' " + ischeck + " /> " + extSites[i].name + "</label><br />";
		if (i === "yahoo")
			txt += "</fieldset><fieldset class='e_links'><legend>Descargas</legend>";
		else if (i === "surrealmoviez")
			txt += "</fieldset><fieldset class='e_links'><legend>Subtítulos</legend>";
	}

	txt += "</fieldset</div></div>";
	txt += "<div style='margin-top: 15px;' class='b'><p class='title-conf'>Configuración</p>";
	var showAllC = localStorage.getItem(idprop + "_showAllC"), showOtherR = localStorage.getItem(idprop + "_showOtherR"), showInfoAct = localStorage.getItem(idprop + "_showInfoAct"), changeStats = localStorage.getItem(idprop + "_changeStats");
	if (showAllC === "true") showAllC = "checked";
	else showAllC = '';

	if (showOtherR === "true") showOtherR = "checked";
	else showOtherR = '';

	if (showInfoAct === "true") showInfoAct = "checked";
	else showInfoAct = '';

	if (changeStats === "true") changeStats = "checked";
	else changeStats = '';

	txt += "<label style='display: block; text-align: center;' for='showInfoAct'><input type='checkbox' name='showInfoAct' id='showInfoAct' " + showInfoAct + " /> Mostrar fichas de actores/directores en búsquedas</label><br />";
	txt += "<label style='display: block; text-align: center;' for='showAllC'><input type='checkbox' name='showAllC' id='showAllC' " + showAllC + " /> Mostrar todos los países en estadísticas de otros</label><br />";
	txt += "<label style='display: block; text-align: center;' for='showOtherRatings'><input type='checkbox' name='showOtherR' id='showOtherR' " + showOtherR + " /> Mostrar notas de otras páginas en fichas de películas</label><br />";
	txt += "<label style='display: block; text-align: center;' for='showOtherRatings'><input type='checkbox' name='changeStats' id='changeStats' " + changeStats + " /> Cambiar gráficas en estadísticas de otro usuario</label><br />";
	txt += "<button type='button' id='removeVotes' >Eliminar votos almacenados</button><br />";
	txt += "<button type='button' id='removeFavLists' >Eliminar listas favoritas</button><br />";
	txt += "</div>";

	$('.box:nth-child(1)').after(txt);

	$('#removeVotes, #removeFavLists').css({
		'margin': '0 auto', 'display': 'block', 'padding': '7px 15px', 'color': 'steelblue', 'font-weight': 'bold', 'border': '1px solid orange', 'border-radius': '9px', 'background-color': '#EEE',
		'cursor': 'pointer', 'box-shadow': '0px 1px 3px orange'
	});

	$('#removeFavLists').click(function () {
		var remove = confirm("¿Confirmar borrado de listas favoritas (FA & IMDB)?");
		if (remove) {
			localStorage.removeItem(idprop + "_favsFA");
			GM_deleteValue("favsIMDB");
			alert('Listas borradas');
		}
	});

	$('#removeVotes').click(function () {
		var remove = confirm("¿Confirmas el borrado de votos?");
		if (remove) {
			localStorage.removeItem(idprop + "_votos");
			alert('Votos borrados');
		}
	});

	$("input[name='ext_link']").change(function () {
		if ($(this).prop('checked'))
			localStorage.setItem(idprop + "_" + $(this).attr('id'), $(this).prop('checked'));
	});

	$("input[name='showInfoAct']").change(function () {
		localStorage.setItem(idprop + "_showInfoAct", $(this).prop('checked'));
	});

	$("input[name='showAllC']").change(function () {
		localStorage.setItem(idprop + "_showAllC", $(this).prop('checked'));
	});

	$("input[name='showOtherR']").change(function () {
		localStorage.setItem(idprop + "_showOtherR", $(this).prop('checked'));
	});

	$("input[name='changeStats']").change(function () {
		localStorage.setItem(idprop + "_changeStats", $(this).prop('checked'));
	})

	if (votos_act === 0)
		$('#act_votos').text("Votos actualizados");

	$('#act_votos').on('click', function (e) {
		e.preventDefault();
		if (votos_act > 0)
			act_votos(1);
	});

	$('.box > .b').hide();
	$('.box > .h').css('cursor', 'pointer');
	$('fieldset > label, fieldset > label > input').css('cursor', 'pointer');

	$('.box > .h').on('click', function () {
		$(this).closest('.box').find('.b').toggle();
	});
}

function addResumenFA() {

	$.get("https://fasupport.000webhostapp.com/fa/resumenfa.php", function (data) {
		var txt = "";
		var obj = (eval(data.split('#')[0]))[0];
		txt += "<div class=\"box\" id=\"contResFA\"><div class=\"h\" id='panelconfiguracion'>Estadísticas FA (" + obj.fechaAct + ")</div>";
		txt += "<div class='b' id='bpanconf' style='overflow:auto;'>";
		txt += "<p style='text-align:center'><i class='fa fa-ratings-fa' style='padding-bottom:4px'></i> " + obj.totalPeliculas + " películas</p>";

		txt += "<div id='resFAVotos' style='float:left; width: 49%'>"
		txt += "<h4>Top 25 con más votos</h4>";
		txt += "<ul>";
		for (var i = 1; i <= obj.top25.length; i++) {
			var topAct = obj.top25[i - 1];
			txt += "<li>" + i + ") <a href='http://www.filmaffinity.com/es/film" + topAct.id + ".html'>" + topAct.title + "</a><span style='float:right'>" + topAct.votos + " votos</span></li>";
		}
		txt += "</ul>";
		txt += "<table>";
		txt += "<tr><th>Franja</th><th>Nº pelis</th></tr>";

		txt += "</table>";
		txt += "</div>"; //resFAVotos
		txt += "</div>"; // b
		txt += "</div>"; // box

		$('.box:nth-child(4)').after(txt);
		$('#contResFA > .b').hide();
		$('#contResFA > .h').css('cursor', 'pointer');
		$('fieldset > label, fieldset > label > input').css('cursor', 'pointer');

		$('#contResFA > .h').on('click', function () {
			$(this).closest('#contResFA').find('.b').toggle();
		});
	});
}

function act_votos(pagina) {

	var url_votos = "https://www.filmaffinity.com/es/userratings.php?user_id=" + idprop + "&p=" + pagina;
	var paginas = Math.ceil(parseInt($('li > a > strong').first().text()) / 30);

	$.get(url_votos, function (data) {
		var nodos = $('.user-ratings-wrapper', data), fecha, fdia, fmes, fanio, pelisdia, movieid, rating, manio, votos, fecha_act, ult_act, seguir = true;
		votos = localStorage.getItem(idprop + "_" + 'votos') === null ? {} : JSON.parse(localStorage.getItem(idprop + "_" + 'votos'));
		ult_act = votos.fecha_act;
		var votos_act = Object.keys(votos).length - 1 < 0 ? 0 : Object.keys(votos).length - 1;
		votos_act = parseInt($('li > a > strong').first().text()) - votos_act;
		$('#act_votos').html("Actualizando votos... " + votos_act + " restantes");

		for (var i = 0; i < nodos.length && seguir; i++) {
			fecha = $('.user-ratings-header', nodos[i]).text().split(': ')[1];
			fdia = fecha.split(' de ')[0];
			fmes = fecha.split(' de ')[1];
			fanio = fecha.split(' de ')[2];
			if (ult_act === fecha)
				seguir = false;

			if (i === 1 && pagina === 1)
				fecha_act = fecha;

			pelisdia = $('.fa-shadow', nodos[i]);

			for (var j = 0; j < pelisdia.length && seguir; j++) {
				movieid = $('.movie-card-0', pelisdia[j]).attr('data-movie-id');
				rating = $('.ur-mr-rat', pelisdia[j]).text();
				manio = $('.mc-title', pelisdia[j]).text().trim().slice(-5, -1);
				votos[movieid] = { "voto": rating, "fecha": fdia + "-" + months[fmes] + "-" + fanio, "anio": manio };
				if (i === nodos.length - 1 && j === pelisdia.length - 1 && pagina < paginas) {
					setTimeout(function () {
						act_votos(pagina + 1);
					}, 3000);
				}
			}
			if (i === nodos.length - 1 && pagina === paginas || !seguir) {
				$('#act_votos').text("Votos actualizados");
			}
		}
		if (pagina === 1)
			votos.fecha_act = fecha_act;
		localStorage.setItem(idprop + "_" + 'votos', JSON.stringify(votos));
	});
}

function doAddCountCountries() {

	$('.rbc').attr('id', 'id_t_paises');
	$('ul.stats').append("<li><i class='fa fa-flag'></i><a href='#id_t_paises'><strong>&nbsp;" + $('.rbc table tr').length + "</strong> Países</a></li>");
	$('.stats > li > i').css('padding-bottom', '4px');
}

function doAddReto15() {

	GM_addStyle(".cscb {color: #337ab7; font-size: 12px; cursor: pointer; line-height: 30px;}");

	var retos = ["Una de más de 3 horas", "Una clásica romántica", "Una que sea un remake", "Una del 2017", "Una con un número en el título", "Una con críticas malas", "Una trilogía", "Una dirigida por una mujer",
		"Una ambientada en el futuro", "Una ambientada en el instituto", "Una con un color en el título", "Una ambientada en un país sudamericano", "Un musical", "Una basada en una novela gráfica",
		"Una de un director del que no hayas visto antes", "Una ganadora del Oscar a mejor película", "Una basada en hechos reales", "Una que le encante a tu madre", "Una que te dé miedo", "Una muda",
		"Una basada en una serie de TV", "Una road movie", "Una con personajes mitológicos", "Una sobre el mundo del cine", "Una con desnudo completo (ambos sexos)",
		// Columna derecha               
		"Una de menos de 80 minutos", "Una con antónimos en su título", "Una ambientada en un lugar que quieres visitar", "Una que se desarrolla en tu ciudad/región", "Una de un director menor de 30 años",
		"Una con personajes no humanos", "Una de tu año nacimiento", "Una con triángulo amoroso", "Una con una sola palabra en el título", "Una compuesta de historias cortas", "Una ambientada en un país asiático",
		"Un documental", "Una ópera prima de un director conocido", "Una de un actor/actriz que te encante y no hayas visto", "Una recomendado por un amig@", "Una de tu infancia que viste en el cine",
		"Una navideña", "Una que un personaje tenga tu nombre", "Una que se desarrolle en un solo escenario", "Una con poster horrible", "Una que empezaste y nunca acabaste", "Una africana",
		"Una del actor/actriz que más odies", "Una sobre LGBT", "Una con la naturaleza como fondo"];

	var txt = "<div class=\"box\" style='overflow: auto'><div class=\"h\" id='reto_tt' style='margin-bottom: 10px'>Reto cinéfilo</div>";

	txt += "<div class='b'><div style='width:50%; float: left;'>";

	for (var i in retos) {
		if (parseInt(i) === (retos.length / 2))
			txt += "</div><div style='width: 50%; float: right'>";
		txt += "<label class='cscb'><input type=\"checkbox\" name='reto15' id='cb" + (parseInt(i) + 1) + "' > " + retos[i] + "</label><br />";
	}

	txt += "</div></div></div>";
	$(".zdates").append(txt);

	$('.cscb > input').css('visibility', 'hidden');

	$("input[name='reto15']").each(function () {
		$(this).prop('checked', localStorage.getItem(idprop + "_" + $(this).attr('id')));

		if ($(this).prop('checked'))
			$(this).parent().css('text-decoration', 'line-through');
	});

	var marked = $("input:checkbox:checked").length;
	$('#reto_tt').text("Reto cinéfilo 2017 (" + marked + " / 50)");

	$("input[name='reto15']").change(function () {
		localStorage.setItem(idprop + "_" + $(this).attr('id'), $(this).prop('checked'));

		if ($(this).prop('checked'))
			$(this).parent().css('text-decoration', 'line-through');
		else {
			$(this).parent().css('text-decoration', 'none');
			localStorage.removeItem(idprop + "_" + $(this).attr('id'));
		}

		marked = $("input[name='reto15']:checkbox:checked").length;
		$('#reto_tt').text("Reto cinéfilo 2017 (" + marked + " / 50)");
	});
}

function addMyData() {
	$('.rbg').css('width', '29%');
	$('.rbc').css('width', '32%');

	doAddSeenInYear();
	doAddCountCountries();
	doAddFlagsMyData();
	if (idprop === "878650" || idprop === "568017")
		doAddReto15();
	doAddClasif();
}

function doAddSeenInYear() {
	var votos = JSON.parse(localStorage.getItem(idprop + "_" + 'votos'));
	var yearAct = new Date().getFullYear();
	var sumVotesYear = 0;
	for (var v in votos)
		if (votos[v].fecha != undefined && votos[v].fecha.split('-')[2] == yearAct)
			sumVotesYear++;
	$('ul.stats li:first-child').after("<li><i class='fa fa-calendar'></i><a href='http://www.filmaffinity.com/es/userratings.php?user_id=" + idprop + "&orderby=1'><strong>&nbsp;" + sumVotesYear + "</strong> Votadas en " + yearAct + "</a></li>");
}

function doAddFechaVoto(movieid) {
	var votos = JSON.parse(localStorage.getItem(idprop + "_" + 'votos'));
	if (votos !== null && votos.hasOwnProperty(movieid))
		$('.rate-wrapper').append("<div class='rt-wr-sd'>Votada el:</div><div style='color: white; padding: 5px 0; background-color: steelblue; font-size: 15px; font-weight: bold; letter-spacing: 1px;'>" + votos[movieid].fecha + "</div>");
}

/**
 * 
 * @param {id de la película} movieid 
 */
function doAddRevoted(movieid) {
	GM_addStyle('#box-rev {background: #F0F0F0; text-align: center; margin: 10px; padding: 5px 0px; border: 1px solid #CDDCEB;}');
	GM_addStyle("#btn-rev {border: 1px solid #4682B4; background: white; color: #326E9C; padding: 5px 10px; cursor: pointer; border-radius: 4px; margin: 5px 0;}");
	GM_addStyle('p.revDate {background: rgba(70,130,180,0.5); margin: 3px 0; padding: 5px; color: white; font-weight: bold; font-size: 14px; letter-spacing: 1px;}');
	GM_addStyle('p.revDate span {color: white; display: inline-block; margin-left: 10px; transform: translateY(-1px); cursor: pointer}');
	let txt = '<div id="box-rev">';

	let revised = localStorage.getItem(idprop + "_revised") === null ? {} : JSON.parse(localStorage.getItem(idprop + "_revised"));
	let newDate = new Date();
	let newRevDate = newDate.getDate() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getFullYear();

	if (!revised[movieid] || revised[movieid][revised[movieid].length - 1] != newRevDate)
		txt += '<button id="btn-rev">Añadir revisionado</button>';

	if (revised[movieid] && revised[movieid].length !== 0) {
		txt += '<strong>Revisionados</strong>';
		revised[movieid].forEach(revDate => txt += '<p class="revDate">' + revDate + '<span class="fa fa-remove" title="Eliminar revisionado"></span></p>');
	}
	txt += '</div>';
	$('.add-movie-list-cont').before(txt);

	$('#btn-rev').on('click', function () {

		$(this).fadeOut('fast');

		if (revised[movieid] && revised[movieid].length > 0)
			revised[movieid].push(newRevDate);
		else {
			revised[movieid] = [newRevDate];
			$('#box-rev').append('<strong>Revisionados</strong>');
		}

		localStorage.setItem(idprop + "_revised", JSON.stringify(revised));
		$('#box-rev').append('<p class="revDate">' + newRevDate + '<span class="fa fa-remove" title="Eliminar revisionado"></span></p>');

		$('p.revDate span').on('click', function () {
			revised[movieid].splice(revised[movieid].indexOf($(this).parent().text()));
			localStorage.setItem(idprop + "_revised", JSON.stringify(revised));
			$($(this).parent().remove());
		});
	});

	$('p.revDate span').on('click', function () {
		revised[movieid].splice(revised[movieid].indexOf($(this).parent().text()));
		localStorage.setItem(idprop + "_revised", JSON.stringify(revised));
		$($(this).parent().remove());
	});
}

function doAddExLinks() {
	var txt = "<span>Info: ";
	var title_orig = $('dt:contains("tulo original")').next().clone().children().remove().end().text().trim().split(' (')[0];
	var title = $('#main-title > span').text().rmaccents();

	for (var i in extSites) {
		if (JSON.parse(localStorage.getItem(idprop + "_" + i))) {
			if (i === "google")
				txt += '<a href="' + extSites[i].search.replace(/%searchvo/, title_orig.replace(/&/ig, '')).replace(/%searchtr/, title) + '" target="_blank" ><img src="' + extSites[i].icon + '" width=16 height=16 alt="' + extSites[i].name + '" title=" ' + extSites[i].name + ' "></a> ';
			else
				txt += '<a href="' + extSites[i].search.replace(/%searchvo/, title_orig).replace(/%searchtr/, title) + '" target="_blank" ><img src="' + extSites[i].icon + '" width=16 height=16 alt="' + extSites[i].name + '" title=" ' + extSites[i].name + ' "></a> ';
		}
		if (i === "yahoo")
			txt += "</span><span>Descargas: ";
		else if (i === "surrealmoviez")
			txt += "</span><span>Subs: ";
	}

	$('#main-title > span').append("<div id='ext_links' style='margin-top: -4px; display: inline-block'>" + txt + "</span></div>");
	$('#ext_links > span').css({ 'font-size': '11px', 'font-family': 'Arial', 'font-weight': 'bold', 'padding-left': '1em' });
}

function addMovieData() {

	$('#movie-main-image-container img').css('box-shadow', '1px 1px 15px black');
	doAddExLinks();
	let movieid = $('.rate-movie-box').attr('data-movie-id');
	addComments(movieid);
	if ($('.rate-movie-box').attr('data-user-rating') != -1) {
		doAddFechaVoto(movieid);
		doAddRevoted(movieid);
		rateActors(movieid);
	}

	if ($('span[itemprop="genre"]:contains("Serie de TV")').length > 0) {
		doAddSeasonInfo(movieid);
	}
}

function addOtherRatings() {

	var title_orig = $('dt:contains("tulo original")').next().text().trim().split(' aka')[0];
	var animeTitle, isSerie = false;
	var anio = $('dd[itemprop="datePublished"]').text();
	var isAnime = $('dd:contains("Animation")').length > 0 && $('#country-img > img').attr('title') === "Japón";
	var isSerie = $('dd:contains("Serie de TV")').length > 0;

	var coincidencias = title_orig.match(/\(/g);
	var numcars = coincidencias ? coincidencias.length : 0;
	if (isSerie) {
		if (numcars == 1)
			animeTitle = title_orig;
		else
			animeTitle = title_orig.split('(')[1].split(')')[0];
	} else {
		if (numcars >= 1)
			animeTitle = title_orig.split('(')[1].split(')')[0];
		else
			animeTitle = title_orig;
	}

	if (isAnime)
		var urlmal = "https://www.google.es/search?q=" + animeTitle.split(' ').join('+') + "+" + anio + "+anime+score+users+site:myanimelist.net";
	var urlimdb = "https://www.google.es/search?q=" + title_orig.replace('#', ' ') + "+" + anio + "+site:www.imdb.com";
	var urlimdb2 = "https://www.google.es/search?q=" + title_orig.replace('#', ' ') + "+" + anio + "+IMDb+users+have+given+a+weighted+average+vote+site:www.imdb.com";
	var urlrtn = "https://www.google.es/search?q=" + title_orig.replace('#', ' ') + '+"User+Ratings:"+"Average+Rating:"+site:www.rottentomatoes.com';

	var nodop = '//div[@class="share-links-movie"]'.findNode();

	//Creamos un nuevo cuadro para las notas
	var newdiv = document.createElement('div');
	newdiv.style.backgroundColor = "#F0F0F0";
	newdiv.style.border = "1px solid #CDDCEB";
	newdiv.style.textAlign = "center";
	newdiv.style.margin = "10px";
	newdiv.style.display = "block";

	var tmp = "";
	tmp += '<div style="text-align:center;">';
	tmp += '<div style="padding:10px 0 4px; color:#4682B4; font-size:13px"><strong>OTRAS PÁGINAS</strong></div>';

	if (!isAnime) {
		//IMDB
		tmp += '<div style="margin: 5px 15px; padding:4px 0; color:#A58500; background-color:#ffffff; font-size:18px;font-weight: bold;border:1px solid #A58500;">IMDB';
		tmp += '<div>';
		tmp += '<div id="cnimdb" style="padding:6px;font-size:22px;color:#136CB2;font-weight: bold;">-,-</div>';
		tmp += '<div id="vtimdb" style="font-size:12px;color:#A58500;padding:1px 0px;"></div></div></div>';
		//RottenTomatoes
		tmp += '<div style="margin: 12px 15px; padding:4px 0; color:#627D11; background-color:#ffffff; font-size:18px;font-weight: bold;border:1px solid #627D11;">Rotten Tomatoes';
		tmp += '<div>';
		tmp += '<div id="notartn" style="padding:6px; color:#CF4400; font-size:22px;font-weight: bold;">-,-</div>';
		tmp += '<div id="vrtn" style="font-size:12px;color:#627D11;padding:1px 0px;">--</div></div></div>';
	}
	else {
		//MyAnimeList
		tmp += '<div style="margin: 5px 15px 10px; padding:4px 0; color:#2e51a2; background-color:#ffffff; font-size:16px;font-weight: bold;border:1px solid #2e51a2;">MyAnimeList';
		tmp += '<div>';
		tmp += '<div id="notamal" style="padding:6px; color:#000000; font-size:22px;font-weight: bold;">-,-</div>';
		tmp += '<div id="vmal" style="font-size:12px;color:#2e51a2;padding:1px 0px;">--</div></div></div>';
	}
	tmp += '</div>';
	newdiv.innerHTML = tmp;
	nodop.parentNode.insertBefore(newdiv, nodop);
	//$('.share-links-movie').parent().append(newdiv);

	if (!isAnime) {
		doGet(urlimdb, function (response) {
			if ($('.slp', response).length > 0) {
				var txtimdb = $('.slp', response).text();
				var score = txtimdb.split(': ')[1].split('/')[0];
				var users = txtimdb.split('- ')[1].split(' ')[0];
				$('#cnimdb').text(score);
				$('#vtimdb').text(users + " votos");
			} else {
				doGet(urlimdb2, function (response3) {
					var txtimdb = $('.st', response3).text();
					if (txtimdb !== undefined && txtimdb.indexOf('average vote of ') != -1) {
						var score = txtimdb.split('average vote of ')[1].split(' ')[0];
						var users = txtimdb.split(' IMDb ')[0].split(' ... ')[1];
						$('#cnimdb').text(score.toString().replace('.', ','));
						$('#vtimdb').text(addMiles(users) + " votos");
					}
				});
			}
		});
		if (!isSerie) {
			doGet(urlrtn, function (response2) {
				var txtrtn = $('.st', response2).text();
				if (txtrtn) {
					var score = txtrtn.split('Rating: ')[1].split('. ')[0].split(' ')[0];
					var users = txtrtn.split('Ratings: ')[1].split('.')[0].replace(/,/g, '.');
					$('#notartn').text(score);
					$('#vrtn').text(users + " votos");
				}
			});
		}
	}
	else {
		doGet(urlmal, function (response) {
			var textmal = $('span.st > em:contains("Score")', response).parent().text();
			var score = textmal.split('Score: ')[1].split(' ')[0];
			var vusers = textmal.split('scored by ')[1].split(' ')[0];
			$('#notamal').text((+score).toFixed(2).replace('.', ','));
			$('#vmal').text(addMiles(vusers) + " votos");
		});
	}
	$('.movie-disclaimer').css('padding', '0px 20px');
}

function doAddVotesList() {

	$('.movie-wrapper').attr('style', 'width: 615px !Important');
	var peliculas = $('.movie-wrapper').parent();
	var votos = JSON.parse(localStorage.getItem(idprop + "_" + 'votos'));
	for (var i = 0; i < peliculas.length; i++) {
		var movieid = $(peliculas[i]).attr('data-movie-id');
		var voto = votos[movieid] !== undefined ? votos[movieid].voto : "-";
		$(peliculas[i]).append("<div class='rat-movie' style='background-color: " + color_voto(voto) + "'>" + voto + "</div>");
	}
	$('.rat-movie').css('margin', '1px 0 0 5px');
}

// Función que añade un cuadro con la afinidad de la lista entre los usuarios y fa
function doAddAfinityLists() {
	var username = $('#user-nick > a').text().trim();
	var notasfa = $('.avgrat-box');
	var notaspl = $('.rat-movie');

	//Variables para los cálculos
	var snotasul = 0, snotasfa = 0, pvistasul = 0, mediauser, afinidad = 0.00, n1 = 0, n2 = 0, dif = 0, votosFa = 0;
	var snotasv = 0, pvistasv = 0, pvistasc = 0, afinidad2 = 0.00, afinidad3 = 0.00, mediauser2, n3 = 0, difu = 0, dif3 = 0, coinc3 = 0, visto1, visto2;
	var peliculas = parseInt($('.movie-count').text().split(': ')[1]);

	var userlist = $('.main-info .nick a').text();
	var tituloaux = $('.user-title-sec').text().split(':'), titulo = "";

	if (tituloaux.length > 2)
		for (i = 1; i < tituloaux.length; i++)
			titulo += tituloaux[i];
	else
		titulo = tituloaux[1];

	var anchotabla = titulo.length;
	var i = 0, j = 0;

	while (i < notaspl.length) {
		visto1 = false;
		visto2 = false;
		n2 = undefined;
		//Primero para el autor de la lista
		if ($(notaspl[i]).text() !== "-") {
			visto1 = true;
			n1 = +($(notaspl[i]).text());
			snotasul += n1;
			pvistasul++;
			if ($(notasfa[j]).text() != '-') {
				n2 = +($(notasfa[j]).text().replace(',', '.'));
				if (n2 > n1)
					dif += 90 - (n2 * 10 - n1 * 10) * 1.5;
				else
					dif += 90 - (n1 * 10 - n2 * 10) * 1.5;
			} // if(tiene nota fa) 
		} // if(notaspl[i] !== "-")
		i++;

		//Luego para el visitante de la lista
		if ($(notaspl[i]).text() !== "-") {
			visto2 = true;
			n3 = +($(notaspl[i]).text());
			snotasv += n3;
			pvistasv++;
			if ($(notasfa[j]).text() != '-') {
				n2 = n2 || +($(notasfa[j]).text().replace(',', '.'));
				if (n2 > n3)
					difu += 90 - (n2 * 10 - n3 * 10) * 1.5;
				else
					difu += 90 - (n3 * 10 - n2 * 10) * 1.5;
			} // if 
		} // if

		i++;
		j++;

		//Si los dos la han votado
		if (visto1 && visto2) {
			pvistasc++;
			if (n1 > n3)
				dif3 += 90 - (n1 * 10 - n3 * 10) * 1.5;
			else if (n3 > n1)
				dif3 += 90 - (n3 * 10 - n1 * 10) * 1.5;
			else {
				dif3 += 100;
				coinc3++;
			}
		}
	} // while(i < notaspl.length)

	for (j = 0; j < notasfa.length; j++) {
		if ($(notasfa[j]).text() != '-') {
			votosFa++;
			var auxnotasfa = +($(notasfa[j]).text().replace(',', '.'));
			snotasfa += auxnotasfa;
		}
	}

	if (pvistasul === 0)
		mediauser = "-,--";
	else {
		mediauser = snotasul / pvistasul;
		mediauser = mediauser.toFixed(2);
		mediauser = mediauser.replace('.', ',');
	}
	if (pvistasv === 0)
		mediauser2 = "-,--";
	else {
		mediauser2 = snotasv / pvistasv;
		mediauser2 = mediauser2.toFixed(2);
		mediauser2 = mediauser2.replace('.', ',');
	}
	var mediafa = snotasfa / votosFa;
	mediafa = mediafa.toFixed(2);
	mediafa = mediafa.replace('.', ',');

	if (pvistasul === 0)
		afinidad = "-,--";
	else {
		afinidad = dif / pvistasul;
		afinidad = (afinidad.toFixed(2)).replace('.', ',');
	}

	if (pvistasv === 0)
		afinidad2 = "-,--";
	else {
		afinidad2 = difu / pvistasv;
		afinidad2 = (afinidad2.toFixed(2)).replace('.', ',');
	}

	if (pvistasc === 0)
		afinidad3 = "-,--";
	else {
		afinidad3 = dif3 / pvistasc;
		afinidad3 = (afinidad3.toFixed(2)).replace('.', ',');
	}

	var long1 = username.length + userlist.length;
	var long2 = (long1 * 10) + 15;

	if (anchotabla < 35)
		anchotabla = 35;

	anchotabla = anchotabla * 7 > long2 + 50 ? anchotabla * 7 : long2 + 50;

	//GM_addStyle(".progress {width: " + (750 - $('#f_picture').width()) + "px; height: 22px; overflow: hidden; -webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,.1); border-radius: 4px; box-shadow: inset 0 1px 2px rgba(0,0,0,.1); background-color: #f5f5f5;}");

	var txt = "<div style='text-align:center'>";
	txt += '<table align="center" bgcolor="#dcdcdc" width="' + anchotabla + '">';
	txt += '<tr><th height="30" colspan = "2" align="center" bgcolor="#5FACF3"><font color="#ffffff">' + titulo + '</font></th></tr>';
	txt += '<tr><td height="18" bgcolor="#4169E1" colspan="2" align="center"><font color="#FFD700"><b>Media</b></font></td></tr>';
	txt += '<tr><td width="*" align="center"><b>' + username + '</b></td><td align="right">' + mediauser2 + '</td></tr>';
	txt += '<tr><td width="*" align="center"><b>' + userlist + '</b></td><td align="right">' + mediauser + '</td></tr>';
	txt += '<tr><td width="*" align="center"><b>FA</b></td><td align="right">' + mediafa + '</td></tr>';
	txt += '<tr><td height="18" bgcolor="#4169E1" colspan="2" align="center"><font color="#FFD700"><b>Afinidades</b></font></td></tr>';
	txt += '<tr><td width="*" align="center"><b>' + username + '</b> <-> <b>FA</b></td><td align="right">' + afinidad2 + ' %</td></tr>';
	txt += '<tr><td width="*" align="center"><b>' + userlist + '</b> <-> <b>FA</b></td><td width="70" align="right">' + afinidad + ' %</td></tr>';
	txt += '<tr><td width="' + long2 + '" align="center"><b>' + username + '</b> <-> <b>' + userlist + '</b></td><td align="right">' + afinidad3 + ' %</td></tr>';
	txt += '<tr><td height="18" bgcolor="#4169E1" colspan="2" align="center"><font color="#FFD700"><b>Coincidencias</b></font></td></tr>';
	txt += '<tr><td width="*" align="center"><b>' + username + '</b> <-> <b>' + userlist + '</b></td><td align="right">' + coinc3 + '/' + pvistasc + '</td></tr>';
	txt += '</table></div>';
	$('#mt-content-cell').append(txt);
} // function

function addOtherList() {
	doAddVotesList();
	doAddAfinityLists();
}

function ponerVotosAllFilms() {
	var movieid, color, voto;
	var votos = JSON.parse(localStorage.getItem(idprop + "_" + 'votos'));
	var vistas = 0;
	var movies = $('.movie-card-1');
	for (var i = 0; i < movies.length; i++) {
		movieid = $(movies[i]).attr('data-movie-id');
		voto = votos[movieid] !== undefined ? votos[movieid].voto : "-";
		if (voto !== "-")
			vistas++;
		$(movies[i]).find(".mr-rating").prepend("<div data-rating='" + voto + "' class='avgrat-box own_vote' style='background-color: " + color_voto(voto) + "; border-color: " + color_voto(voto) + "' >" + voto + "</div>");
	}
}

function ponerVotosSearch() {
	$('.adver-search-wrapper').remove();
	$('.right-adver-wrapper').css({ 'margin-right': '0', 'padding-right': '13px' });
	$('.main-search-wrapper').css({ 'margin-right': '0', 'width': '100%' });
	$('.mc-poster + .mc-info-container').css({ 'width': '80%' });
	$('.item-search').css('padding-right', '20px');
	$('head').append('<style>.fa-shadow-nb:before{width:auto !important;right:20px;}</style>');
	var movieid, color, voto;
	var votos = JSON.parse(localStorage.getItem(idprop + "_" + 'votos'));
	var vistas = 0;
	var movies = $('.movie-card-1');
	for (var i = 0; i < movies.length; i++) {
		movieid = $(movies[i]).attr('data-movie-id');
		voto = votos[movieid] !== undefined ? votos[movieid].voto : "-";
		if (voto !== "-")
			vistas++;
		$(movies[i]).find(".mr-rating").prepend("<div data-rating='" + voto + "' class='avgrat-box own_vote' style='background-color: " + color_voto(voto) + "; border-color: " + color_voto(voto) + "' >" + voto + "</div>");
	}
	return vistas;
}

function last_details(txtm, txtp) {
	var ancho_disponible = 739 - $('#f_picture').width();
	$('#f_search').width(ancho_disponible);
	$('.progress').width(ancho_disponible - 289);
	$('#best_films').html("<i class='fa fa-thumbs-up' style='color: #1A5A04; margin-right: 7px; font-size: 20px; padding-bottom: 4px; max-width: " + ancho_disponible + "px;'></i> " + txtm);
	$('#worst_films').html("<i class='fa fa-thumbs-down' style='color: #9C1111; font-size: 20px; margin-right: 7px; padding-bottom: 4px; max-width: " + ancho_disponible + "px;'></i> " + txtp);
}

function fill_details(vistas, npelis, hasImage) {
	var series = $('a:contains("Serie de TV")');
	var seriesm = $('.mtitle a:contains("Serie de TV")');
	$('#snpelis').text(parseInt($('#snpelis').text()) - series.length + seriesm.length);
	$('#snseries').text(series.length - seriesm.length);
	var porc_v = Math.round((vistas * 100) / npelis);
	//GM_addStyle(".progress {width: " + (750 - $('#f_picture').width()) + "px; height: 22px; overflow: hidden; -webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,.1); border-radius: 4px; box-shadow: inset 0 1px 2px rgba(0,0,0,.1); background-color: #f5f5f5;}");
	GM_addStyle(".progress {width: 250px; margin-bottom: -6px; margin-left: 6px; height: 22px; display: inline-block; overflow: hidden; -webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,.1); border-radius: 4px; box-shadow: inset 0 1px 2px rgba(0,0,0,.1); background-color: #f5f5f5;}");
	GM_addStyle(".progress-bar {width: " + porc_v + "%; background-color: " + color_voto(Math.round(porc_v / 10) + "") + "; font-size: 12px; line-height: 22px; color: white; text-align: center; -webkit-box-shadow: inset 0 -1px 0 rgba(0,0,0,.15); box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);}");
	$('#info-filmo').append('<div style="display:inline; margin-left: 25px; color: gold"><i class="fa fa-check-circle" style="padding-bottom: 4px; color: white"></i> Votado: <div class="progress" title="' + vistas + "/" + npelis + '"><div class="progress-bar">' + porc_v + " %" + '</div></div></div>');
	var notas = $('.own_vote');
	var pelis = $('.mc-title');
	var nota, mejores = [], peores = [], mejornota = 1, peornota = 10, sumanotas = 0, media;
	for (var i = 0; i < notas.length; i++) {
		nota = $(notas[i]).attr('data-rating');
		if (nota !== "-") {
			nota = +nota;
			sumanotas += nota;
			if (nota > mejornota) {
				mejornota = nota;
				mejores.length = 0;
				mejores.push(i);
			} else if (nota === mejornota)
				mejores.push(i);

			if (nota < peornota) {
				peornota = nota;
				peores.length = 0;
				peores.push(i);
			} else if (nota === peornota)
				peores.push(i);
		}
	}

	var txtm = "";
	var txtp = "";
	if (mejores.length > 0) {
		for (var j = 0; j < mejores.length; j++)
			txtm += $(pelis[mejores[j]]).find('a').text().trim() + ", ";

		txtm = txtm.substr(0, txtm.length - 2);
		for (j = 0; j < peores.length; j++)
			txtp += $(pelis[peores[j]]).find('a').text().trim() + ", ";

		txtp = txtp.substr(0, txtp.length - 2);
	}

	if (vistas > 0)
		media = (sumanotas / vistas).toFixed(2);
	else
		media = "-";
	$('#avg_rating').text(media);
	if (media !== "-") {
		if (media < 4) $('#avg_rating').css({ 'font-weight': 'bold', 'color': '#9C1111' });
		else if (media < 7) $('#avg_rating').css({ 'font-weight': 'bold', 'color': 'yellow' });
		else $('#avg_rating').css({ 'font-weight': 'bold', 'color': '#1A5A04' });
	}
	if (hasImage) {
		if ($('#f_picture').prop('complete')) last_details(txtm, txtp);
		else {
			$('#f_picture').on('load', function () { last_details(txtm, txtp); });
		}
	}
	else {
		$('.progress').width(450);
		$('#best_films').html("<i class='fa fa-thumbs-up' style='color: #1A5A04; margin-right: 7px; font-size: 20px; padding-bottom: 4px;'></i> " + txtm);
		$('#worst_films').html("<i class='fa fa-thumbs-down' style='color: #9C1111; font-size: 20px; margin-right: 7px; padding-bottom: 4px;'></i> " + txtp);
	}
}

function doAddVotesSearch(url) {

	var showInfoAct = localStorage.getItem(idprop + "_showInfoAct") !== null ? eval(localStorage.getItem(idprop + "_showInfoAct")) : false;

	if (url.indexOf("&sn&") > 0 && url.indexOf("search") > 0 && showInfoAct && busqueda !== "Animation" && busqueda !== "Documentary") {
		var txt = "<div style='box-shadow: inset -2px 2px 2px#06061D, inset 2px -2px 2px #06061D, 2px 2px 10px steelblue, -2px -2px 10px steelblue; overflow: auto; padding: 10px; margin: 10px; background-color: steelblue; color: white'>";
		var busqueda = $('#top-search-input').val();
		var urlg = "https://www.bing.com/search?q=" + busqueda.replace(' ', '+');
		var npelis = $('.sub-header-search').text().trim().split(' ')[0];
		$('.sub-header-search').remove();
		$('#main-title').remove();

		doGet(urlg, function (data) {
			data = data.replace('<img', '<omg');
			if ($('.rms_iac', data).length > 0) {
				txt += "<img id='f_picture' style='float: left; height: 200px; max-width: 210px; box-shadow: 0px 0px 18px white' src='";
				txt += "https://www.bing.com/" + $('.cico .rms_iac', data).attr('data-src').split('&')[0] + "'>";
				txt += "<div id='f_search' style='margin-left: 20px;float: left;'><h2 style=' margin: -5px 0 0; color: wheat; font-size: 30px; font-family: Garamond;'>";
				txt += "<i class='fa fa-star' style='padding-bottom: 6px; font-size: 13px; color: wheat; margin-right: 10px'></i>";
				txt += busqueda + "<i class='fa fa-star' style='padding-bottom: 6px; font-size: 13px; color: wheat; margin-left: 10px'></i></h2>";
				txt += "<p style='margin-top: 8px'>" + $('span.b_lower:contains("Nacimiento:")', data).parent().text();
				if ($('span.b_lower:contains("Defunc")', data) !== undefined)
					txt += "<br/>" + $('span.b_lower:contains("Defunc")', data).parent().text().replace('Defunción', 'Fallecimiento');
				txt += "</p>";
				txt += "<div id='info-filmo'><p style='display: inline'><i class='fa fa-film' style='padding-bottom: 4px; color: white;'></i>&nbsp;&nbsp;<span id='snpelis' style='font-weight: bold; color: gold'>" + npelis + "</span> películas</p>";
				txt += "<p style='display:inline; margin-left: 25px'><i class='fa fa-desktop' style='padding-bottom: 2px; color: white;'></i>&nbsp;&nbsp;<span id='snseries' style='font-weight: bold; color: gold'>0</span> series</p></div>";
				// Mejores & peores películas
				txt += "<p id='best_films' style='margin: 12px 0 0'></p>";
				txt += "<p id='worst_films' style='margin: 3px 0 0'></p>";
				// Media de votaciones & Otros enlaces    
				txt += "<div id='avg_ratings_container' style='margin-top: 9px; float: left'><i class='fa fa-bar-chart' style='color: #FFE401; font-size: 16px; padding-bottom: 4px; margin-right: 7px;'></i> Media de votaciones: ";
				txt += "<span id='avg_rating'></span></div>";
				txt += "<div id='other_links' style='margin-top: 9px; float: right'>Más información: ";
				var l_wiki = $('.b_footnote > a:contains("Wikipedia")', data).attr('href');
				if (l_wiki !== undefined)
					txt += "<a href='" + l_wiki + "' target='_blank'><img src='https://es.wikipedia.org/static/favicon/wikipedia.ico' height='20px' class='oth-links'></a>&nbsp;";
				var l_imdb = $('.b_footnote > a:contains("IMDb")', data).attr('href');
				if (l_imdb !== undefined)
					txt += "<a href='" + l_imdb + "' target='_blank'><img src='http://www.imdb.com/favicon.ico' height='20px' class='oth-links'></a>";
				txt += "</div>";
				txt += "</div>";
				txt += "</div>";
				$('#mt-content-cell').prepend(txt);
				$('.oth-links').css('margin-bottom', '-6px');
				// Carga de películas de páginas siguientes
				if (npelis > 50) {
					doGet(url + "&from=50", function (data) {
						data.replace('<img', '<omg');
						var pelis2 = $('.se-it', data);
						for (var i = 0; i < pelis2.length; i++)
							$('.buttons-wrapper').before(pelis2[i]);
						if (npelis > 100) {
							doGet(url + "&from=100", function (data2) {
								data2.replace('<img', '<omg');
								var pelis3 = $('.se-it', data2);
								for (var j = 0; j < pelis3.length; j++)
									$('.buttons-wrapper').before(pelis3[j]);
								if (npelis > 150) {
									doGet(url + "&from=150", function (data3) {
										data3.replace('<img', '<omg');
										var pelis4 = $('.se-it', data3);
										for (var k = 0; k < pelis4.length; k++)
											$('.buttons-wrapper').before(pelis4[k]);
										if (npelis > 200) {
											doGet(url + "&from=200", function (data4) {
												data4.replace('<img', '<omg');
												var pelis5 = $('.se-it', data4);
												for (var m = 0; m < pelis5.length; m++)
													$('.buttons-wrapper').before(pelis5[m]);
												$('.buttons-wrapper').remove();
												var vistas = ponerVotosSearch(url);
												fill_details(vistas, npelis, true);
											});
										}
										else {
											$('.buttons-wrapper').remove();
											var vistas = ponerVotosSearch(url);
											fill_details(vistas, npelis, true);
										}
									});
								}
								else {
									$('.buttons-wrapper').remove();
									var vistas = ponerVotosSearch(url);
									fill_details(vistas, npelis, true);
								}
							});
						}
						else {
							$('.buttons-wrapper').remove();
							var vistas = ponerVotosSearch(url);
							fill_details(vistas, npelis, true);
						}
					});
				}
				else {
					var vistas = ponerVotosSearch(url);
					fill_details(vistas, npelis, true);
				}
			}
			else {
				txt += "<div id='f_search' style='margin-left: 20px;float: left;'><h2 style=' margin: -5px 0 0; color: wheat; font-size: 30px; font-family: Garamond;'>";
				txt += "<i class='fa fa-star' style='padding-bottom: 6px; font-size: 13px; color: wheat; margin-right: 10px'></i>";
				txt += busqueda + "<i class='fa fa-star' style='padding-bottom: 6px; font-size: 13px; color: wheat; margin-left: 10px'></i></h2>";
				txt += "<div id='info-filmo' style='margin-top: 5px'><p style='display: inline'><i class='fa fa-film' style='padding-bottom: 4px; color: white;'></i>&nbsp;&nbsp;<span id='snpelis' style='font-weight: bold; color: gold'>" + npelis + "</span> películas</p>";
				txt += "<p style='display:inline; margin-left: 25px'><i class='fa fa-desktop' style='padding-bottom: 2px; color: white;'></i>&nbsp;&nbsp;<span id='snseries' style='font-weight: bold; color: gold'>0</span> series</p></div>";
				// Mejores & peores películas
				txt += "<p id='best_films' style='margin: 12px 0 0'></p>";
				txt += "<p id='worst_films' style='margin: 3px 0 0'></p>";
				// Media de votaciones & Otros enlaces    
				txt += "<div id='avg_ratings_container' style='margin-top: 9px; float: left'><i class='fa fa-bar-chart' style='color: #FFE401; font-size: 16px; padding-bottom: 4px; margin-right: 7px;'></i> Media de votaciones: ";
				txt += "<span id='avg_rating'></span></div>";
				txt += "</div></div>";
				$('#mt-content-cell').prepend(txt);
				if (npelis > 50) {
					doGet(url + "&from=50", function (data) {
						data.replace('<img', '<omg');
						var pelis2 = $('.item-search', data);
						for (var i = 0; i < pelis2.length; i++)
							$('.buttons-wrapper').before(pelis2[i]);
						$('.buttons-wrapper').remove();
						var vistas = ponerVotosSearch(url);
						fill_details(vistas, npelis, true);
					});
				}
				else {
					var vistas = ponerVotosSearch(url);
					fill_details(vistas, npelis, false);
				}
			}
		});
	}
	else
		ponerVotosSearch(url);
}

function addUserRatings() {

	if (window.location.search.indexOf(idprop) >= 0)
		return;

	var movieid, nota, color1, color2, voto;
	var votos = JSON.parse(localStorage.getItem(idprop + "_" + 'votos'));
	var movies = $('.user-ratings-movie-rating');
	var moviesid = $('.movie-card-0');
	var puser = $('.user-nick-wrapper h2').text();
	var ruser = $('#user-nick a').text();

	for (var i = 0; i < movies.length; i++) {

		nota = $(movies[i]).find('.ur-mr-rat').text();
		movieid = $(moviesid[i]).attr('data-movie-id');
		voto = votos[movieid] !== undefined ? votos[movieid].voto : "-";

		var txt = "<div style=\"color:#666666; font-size:16px; padding: 4px 0px;\">Votos</div>";
		txt += "<div style=\"float:left; width:40px; height:40px; line-height:40px; margin: 5px 10px 10px 10px; color:white; font-weight:bold; font-size:150%; background-color: " + color_voto(nota) + ";\" title=\"Voto de " + puser + "\">" + nota + "</div>";
		txt += "<div style=\"float:right; width:40px; height:40px; line-height:40px; margin: 5px 10px 10px 10px; color:white; font-weight:bold; font-size:150%; background-color: " + color_voto(voto) + ";\"  title=\"Voto de " + ruser + "\">" + voto + "</div>";
		$(movies[i]).find('*').remove();
		$(movies[i]).append(txt);

	}

}

function addMTopic() {

	$('.ntabs li:last-child a').text("Ver todas (" + $('.ntabs li:last-child a').text().split(" ")[0] + ")");
	$('.card').width("91%");
	var votos = JSON.parse(localStorage.getItem(idprop + "_" + 'votos'));
	var fichas = $('.record');
	if ($('.ntabs li:last-child.active').length == 1) {
		for (var i = 0; i < fichas.length; i++) {
			var movieId = $(fichas[i]).find('.movie-card').data('movie-id');
			var voto = votos[movieId] !== undefined ? votos[movieId].voto : "-";
			$(fichas[i]).find('.mc-title').after("<div class=\"mr-rating\">\
			<div class=\"avgrat-box\" style='padding: 0 10px; width: auto; background-color: " + color_voto(voto) + "; border-color: " + color_voto(voto) + "'>" + voto + "</div>\
            </div>");
		}
	} else {
		for (var i = 0; i < fichas.length; i++) {
			var movieId = $(fichas[i]).find('.movie-card').data('movie-id');
			var voto = votos[movieId] !== undefined ? votos[movieId].voto : "-";
			var movieAvg = $(fichas[i]).find('.avg-w').text();
			var numVotos = $(fichas[i]).find('.votes2').text();
			$(fichas[i]).find('.mc-title').after("<div class=\"mr-rating\">\
			<div class=\"avgrat-box\" style='padding: 0 10px; width: auto; background-color: " + color_voto(voto) + "; border-color: " + color_voto(voto) + "'>" + voto + "</div>\
            <div class=\"avgrat-box\" style='padding: 0 10px; width: auto'>" + movieAvg + "</div>\
            <div class=\"ratcount-box\">" + numVotos + "<i class=\"fa fa fa-simple-user-o-fa\"></i></div>\
        </div>");
		}
	}

	$('.rating').remove();
}

function ppuntom(entrada) {
	var num = entrada.replace(/\./g, "");
	if (!isNaN(num)) {
		num = num.toString().split("").reverse().join("").replace(/(?=\d*\.?)(\d{3})/g, "$1.");
		num = num.split("").reverse().join("").replace(/^[\.]/, "");
		entrada = num;
	} else
		entrada = input.value.replace(/[^\d\.]*/g, "");

	return entrada;
}

var tmPageSize = 30;
var tmFrom = 0;

function addVotesTopGen() {
	var nfichas = $('.data').length;

	if (nfichas === tmFrom)
		setTimeout(addVotesTopGen, 700);
	else {
		var votos = JSON.parse(localStorage.getItem(idprop + "_" + 'votos'));
		$('.data').css({ 'margin-top': '5px' });
		$('.rat-count').css({ 'margin': '12px auto', 'width': '80%', 'padding-bottom': '10px', 'border-bottom': '1px solid steelblue' });
		for (var i = tmFrom; i < nfichas; i++) {
			var nodo = $('#top-movies > li:nth-child(' + (i + 1) + ')');
			var movieId = $(nodo).find('.movie-card-0').data('movie-id');
			var voto = votos[movieId] !== undefined ? votos[movieId].voto : "-";
			var nNotas = $(nodo).find('.data')
				.append("<div class='avg-rating' style='margin-top: 20px; border-radius: 50%; background-color: " + color_voto(voto) + "; border-color: " + color_voto(voto) + "'>" + voto + "</div>");
		}
		tmFrom = nfichas;
	}
}

function addTopGen() {

	addVotesTopGen();
	$('#load-more-bt').addClass('my-load-more');

	$('.my-load-more').click(function () {
		addVotesTopGen();
	});
}

function addChangeFriends() {

	var ratings = $('.user-rat a');
	if (ratings.length === 0)
		setTimeout(addChangeFriends, 250);
	else {
		$('#user-friends-container').css('padding-top', '1px');
		$('.user-friend-link').css({ 'padding-top': '2px', 'width': '390px' });
		$('.user-rat').css('padding-top', '4px');
		$('.user-rat a').css({ 'margin-left': '17px', 'width': '73px' });
		$('.user-rev a').css({ 'margin-left': '15px', 'width': '58px' });
		$('.user-list a').css({ 'margin-left': '10px', 'width': '55px' });
		$('.display-groups2').next().css('margin-top', '7px');
		$('strong:contains("Listas")').css('margin-right', '13px');
		$('strong:contains("Críticas")').css('margin-right', '25px');
		$('strong:contains("Votaciones")').css('margin-right', '25px');
		var userids = $('.user-friend-name a');
		var criticas = $('.user-rev a');
		var lists = $('.user-list a');
		var avgs = $('.user-avg a');
		var friends = localStorage.getItem(idprop + "_friends") === null ? {} : JSON.parse(localStorage.getItem(idprop + "_friends"));
		var rat_1, rat_2, cr_1, cr_2, lt_1, lt_2, userid, dif_r, dif_c, dif_lt;

		for (var i = 0; i < ratings.length; i++) {
			userid = userids[i].href.split('=')[1];
			rat_2 = ratings[i].textContent;
			cr_2 = criticas[i].textContent;
			lt_2 = lists[i].textContent;
			dif_r = 0;
			dif_c = 0;
			dif_lt = 0;

			if (friends !== null && friends.hasOwnProperty(userid)) {
				rat_1 = friends[userid].votos;
				cr_1 = friends[userid].criticas;
				lt_1 = friends[userid].listas;
				dif_r = parseInt(rat_2) - parseInt(rat_1);
				dif_c = parseInt(cr_2) - parseInt(cr_1);
				dif_lt = parseInt(lt_2) - parseInt(lt_1);
			}

			friends[userid] = { "votos": rat_2, "criticas": cr_2, "listas": lt_2 };
			localStorage.setItem(idprop + "_friends", JSON.stringify(friends));

			// Votos
			if (dif_r > 0) {
				$(ratings[i]).css('background-color', "lightgreen");
				$(ratings[i]).text(ppuntom(rat_2) + " (+" + dif_r + ")");
			}
			else if (dif_r < 0) {
				$(ratings[i]).css('background-color', "#FF6666");
				$(ratings[i]).text(ppuntom(rat_2) + " (-" + dif_r + ")");
			}
			else
				$(ratings[i]).text(ppuntom(rat_2));

			// Críticas
			if (dif_c > 0) {
				$(criticas[i]).css('background-color', "lightgreen");
				$(criticas[i]).text(ppuntom(cr_2) + " (+" + dif_c + ")");
			}
			else if (dif_c < 0) {
				$(criticas[i]).css('background-color', "#FF6666");
				$(criticas[i]).text(ppuntom(cr_2) + " (-" + dif_c + ")");
			}
			else
				$(criticas[i]).text(ppuntom(cr_2));

			// Listas
			if (dif_lt > 0) {
				$(lists[i]).css('background-color', "lightgreen");
				$(lists[i]).text(ppuntom(lt_2) + " (+" + dif_lt + ")");
			}
			else if (dif_lt < 0) {
				$(lists[i]).css('background-color', "#FF6666");
				$(lists[i]).text(ppuntom(lt_2) + " (" + dif_lt + ")");
			}
			else
				$(lists[i]).text(ppuntom(lt_2));

			// Medias
			$(avgs[i]).attr('href', 'http://www.filmaffinity.com/es/userrep.php?user_id=' + userid);
		}


		$('.user-rat a, .user-rev a, .user-list a, .user-avg a').attr('target', '_blank');
	}
}

function addSearch(url) {

	doAddVotesSearch(url);
}

function addStylesTour() {

	let ratings = $('.rating');

	// Añadir barra de progreso
	let totalMovies = $('.small-list .fa-shadow').length;
	let porc_v = Math.round((ratings.length * 100) / totalMovies);
	GM_addStyle(".progress {width: 98%; height: 22px; overflow: hidden; -webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,.1); margin-left: 1%; border-radius: 4px; box-shadow: inset 0 1px 2px rgba(0,0,0,.1); background-color: #f5f5f5;}");
	GM_addStyle(".progress-bar {width: " + porc_v + "%; background-color: " + color_voto(Math.round(porc_v / 10) + "") + "; font-size: 12px; line-height: 22px; color: white; text-align: center; -webkit-box-shadow: inset 0 -1px 0 rgba(0,0,0,.15); box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);}");
	$('.tour-expla').after('<div class="progress" title="Vistas: ' + ratings.length + "/" + totalMovies + '"><div class="progress-bar">' + porc_v + " %" + '</div></div>');

	// Cambio de colores a las notas
	ratings.get().forEach(rating => {
		$(rating).css('background', color_voto($(rating).text()));
	});
}

function addVotesTLists() {

	// Preparar el aspecto
	$('#advertising').remove();
	$('#left-column').width('97%');
	$('.list-hd-count').css('margin-right', '90px');
	$('.list-count').css('margin-right', '35px');
	GM_addStyle(".own_votes_tlist {float: right; margin: -5px 5px 0 0; color: white; font-weight: bold; width: 45px; text-align: center; font-size: 20px; height: 105px; line-height: 105px}");

	var votos = JSON.parse(localStorage.getItem(idprop + "_" + 'votos')), voto, movieid, vistas = 0, porc_v;
	var films = $('.movie-card');
	var nodos = $('.list-count');

	for (var i = 0; i < films.length; i++) {
		movieid = $(films[i]).attr('data-movie-id');
		voto = votos[movieid] !== undefined ? votos[movieid].voto : "-";
		$(nodos[i]).before('<div class="own_votes_tlist" style="background-color:' + color_voto(voto) + '">' + voto + '</div>');
		if (voto !== "-")
			vistas++;
	}

	porc_v = Math.round((vistas * 100) / films.length);

	GM_addStyle(".progress {float: right; width: 250px; height: 22px; overflow: hidden; -webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,.1); margin: 2px 20px 0 0; border-radius: 4px; box-shadow: inset 0 1px 2px rgba(0,0,0,.1); background-color: #f5f5f5;}");
	GM_addStyle(".progress-bar {width: " + porc_v + "%; background-color: " + color_voto(Math.round(porc_v / 10) + "") + "; font-size: 12px; line-height: 22px; color: white; text-align: center; -webkit-box-shadow: inset 0 -1px 0 rgba(0,0,0,.15); box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);}");

	$('#main-title').text($('#main-title').text().split("Ranking lista ")[1]);
	$('#main-title').append('<div class="progress" title="Vistas: ' + vistas + "/" + films.length + '"><div class="progress-bar">' + porc_v + " %" + '</div></div>');

	$('#hide-poster').on('click', function () {
		var v_height = parseInt($('.mc-info-container').css('min-height')) + 10;
		$('.own_votes_tlist').css({ 'height': v_height + 'px', 'line-height': v_height + 'px' });
	});
}

function editDataFromIMDB() {

	// Botones para extraer
	// Director
	$('input[name="director"]').parent().append("<div style='float: right'><button type='button' id='extractDirector'>Extraer director</button></div>");

	// Guión
	$('input[name="script_en"]').parent().append("<div style='float: right'><button type='button' id='extractScript'>Extraer guionistas</button></div>");

	// Año
	$('input[name="year"]').parent().append("<div style='float: right'><button type='button' id='extractYear'>Extraer año</button></div>");

	// Música
	$('input[name="music_en"]').parent().append("<div style='float: right'><button type='button' id='extractMusic'>Extraer música</button></div>");

	// Reparto
	$('textarea[name="cast"]').parent().append("<div style='float: right'><button type='button' id='extractCast'>Extraer actores</button>\
    		Nº actores: <input type='number' min=10 max=100 step=1 id='numReparto' value='15'>\
    		<p>Nº caracteres: <span id='carsCast'>" + $('textarea[name="cast"]').text().length + "</span></p></div>");

	// Sinopsis (en)
	$('textarea[name="synopsis_en"]').parent().append("<div style='float: right'><button type='button' id='extractSynopsis'>Extraer sinopsis</button><p>Nº caracteres: <span id='carsSynEn'>" + $('textarea[name="synopsis_en"]').text().length + "</span></p></div>");

	// Nº caracteres (sinopsis ES)
	$('textarea[name="synopsis_es"]').parent().append("<div style='float: right; margin-right: 58px'><p>Nº caracteres: <span id='carsSynEs'>" + $('textarea[name="synopsis_es"]').text().length + "</span></p></div>");

	// Duración
	$('input[name="runtime"]').parent().append("<div style='float: right'><button type='button' id='extractRuntime'>Extraer duración</button></div>");

	// Fotografía
	$('input[name="photo"]').parent().append("<div style='float: right'><button type='button' id='extractPhoto'>Extraer fotografía</button></div>");

	// Productora
	$('input[name="producer_en"]').parent().append("<div style='float: right'><button type='button' id='extractProducers'>Extraer productoras</button></div>");

	// CSS de los botones
	$('#extractRuntime, #extractCast, #extractSynopsis, #extractMusic, #extractPhoto, #extractProducers, #extractYear, #extractScript, #extractDirector').css({ 'display': 'block', 'margin-right': '45px', 'padding': '10px 15px', 'background-color': 'white', 'border': '1px solid steelblue', 'color': 'steelblue', 'border-radius': '7px', 'cursor': 'pointer' });
	$('#extractRuntime, #extractMusic, #extractYear, #extractScript, #extractDirector, #extractPhoto, #extractProducers').css({ 'padding': '2px 15px' });
	$('#numReparto').css({ 'margin-top': '10px', 'width': '45px' });

	// Funcionalidad de los botones
	// Director
	$('#extractDirector').click(function () {
		doGet('http://www.imdb.com/title/tt' + $('input[name="imdb_code"]').attr('value') + '/fullcredits', function (response) {
			response = response.replace("<img", "<omg"); // Para que no se ponga a cargar las peliculas
			var emptydiv = document.createElement('div');
			emptydiv.innerHTML = response;
			var nododri = "//a[contains(@href,'ttfc_fc_dr')]".findNodesArray(emptydiv);
			var directores = "";
			if (nododri.length > 0) {
				for (i = 0; i < nododri.length; i++) {
					directores += nododri[i].textContent.substring(1, nododri[i].textContent.length - 1);
					if (i != nododri.length - 1)
						directores += ", ";
				}
			}
			$('input[name="director"]').val(directores);
		});
	});

	// Guión
	$('#extractScript').click(function () {
		doGet('http://www.imdb.com/title/tt' + $('input[name="imdb_code"]').attr('value') + '/fullcredits', function (response) {
			response = response.replace("<img", "<omg"); // Para que no se ponga a cargar las peliculas
			var emptydiv = document.createElement('div');
			emptydiv.innerHTML = response;
			var nodoguii = "//a[contains(@href,'fc_wr')]".findNodesArray(emptydiv);
			var aux1 = "", aux2 = "";

			if (nodoguii.length > 0) {
				var guionistas = [];
				for (i = 0; i < nodoguii.length; i++) {
					var auxg = nodoguii[i].textContent.substring(1, nodoguii[i].textContent.length).trim();
					if (guionistas.indexOf(auxg) === -1) {
						guionistas.push(auxg);
						if (nodoguii[i].parentNode.parentNode.textContent.indexOf("novel") > 0)
							aux2 += auxg + ", ";
						else
							aux1 += auxg + ", ";
					}
				}
				var sc_en = aux1.substring(0, aux1.length - 2);
				var sc_es = aux1.substring(0, aux1.length - 2);
				if (aux2 != "") {
					sc_en += " (Novel: " + aux2.substring(0, aux2.length - 2) + ")";
					sc_es += " (Novela: " + aux2.substring(0, aux2.length - 2) + ")";
				}
				$('input[name="script_en"]').val(sc_en);
				$('input[name="script_en"]').val(sc_es);
			}
		});
	});

	// Año
	$('#extractYear').click(function () {
		doGet('http://www.imdb.com/title/tt' + $('input[name="imdb_code"]').attr('value'), function (response) {
			var anio = $(response).filter('title').text();
			anio = anio.split('(')[1].split(')')[0].split('–')[0];
			if (anio.indexOf("eries") > 0)
				anio = anio.split("es ")[1];
			if (anio.indexOf("ideo") > 0)
				anio = anio.split("ideo ")[1];
			if (anio.indexOf("V Movie") > 0)
				anio = anio.split("ovie ")[1];
			$('input[name=year]').val(anio);
		});
	});

	// Música
	$('#extractMusic').click(function () {
		doGet('http://www.imdb.com/title/tt' + $('input[name="imdb_code"]').attr('value') + '/fullcredits', function (response) {
			response = response.replace("<img", "<omg"); // Para que no se ponga a cargar las peliculas
			var emptydiv = document.createElement('div');
			emptydiv.innerHTML = response;
			var nodomusi = "//h4[contains(text(),'Music by')]".findNode(emptydiv);
			var music = "";
			if (nodomusi != undefined) {
				nodomusi = nodomusi.nextSibling.nextSibling.childNodes[3];
				for (var i = 1; i < nodomusi.childNodes.length; i += 2) {
					music += nodomusi.childNodes[i].childNodes[1].childNodes[1].textContent.substring(1, nodomusi.childNodes[i].childNodes[1].childNodes[1].textContent.length - 1);
					if (i < nodomusi.childNodes.length - 2)
						music += ", ";
				}
			}
			$('input[name=music_en], input[name=music_es]').val(music);
		});
	});

	// Duración
	$('#extractRuntime').click(function () {
		doGet('http://www.imdb.com/title/tt' + $('input[name="imdb_code"]').attr('value'), function (response) {
			$('input[name=runtime]').val($(".txt-block time[itemprop='duration']", response).text().trim().split(" min")[0]);
		});
	});

	// Fotografía
	$('#extractPhoto').click(function () {
		doGet('http://www.imdb.com/title/tt' + $('input[name="imdb_code"]').attr('value') + '/fullcredits', function (data) {
			data = data.replace("<img", "<omg"); // Para que no se ponga a cargar las peliculas
			let photo = '';
			if ($('h4:contains("Cinematography")', data).next().find('tr').length === 1)
				photo = $('h4:contains("Cinematography")', data).next().find('tr').text().trim().split('\n')[0];
			else { // Hay más de 1 línea (ejemplo: http://www.imdb.com/title/tt0093733/fullcredits)
				let rows = $('h4:contains("Cinematography")', data).next().find('tr');
				for (let i = 0; i < rows.length; i++) {
					photo += $(rows[i]).text().trim().split('\n')[0];
					if (i + 1 < rows.length)
						photo += ', ';
				}
			}
			$('input[name=photo]').val(photo);
		});
	});

	// Productoras
	$('#extractProducers').click(function () {
		doGet('http://www.imdb.com/title/tt' + $('input[name="imdb_code"]').attr('value'), function (data) {
			let producers = $('span a[href *="/company"]', data).toArray().map(a => a.text).join(' / ');
			$('input[name=producer_en]').val(producers);
			$('input[name=producer_es]').val(producers);
		});
	});

	// Reparto
	$('#extractCast').click(function () {
		var numReparto = +($('#numReparto').val());
		$('textarea[name="cast"]').text("");
		var url = "http://www.imdb.com/title/tt" + $('input[name="imdb_code"]').attr('value') + "/fullcredits";
		doGet(url, function (data) {
			var reparto = "", nodorepi = $('td[itemprop="actor"]', data);

			if (nodorepi.length > 0) {
				for (i = 0; i < nodorepi.length && i <= numReparto; i++) {
					reparto += $(nodorepi[i]).text().trim();
					if (i !== nodorepi.length - 1 && i !== numReparto)
						reparto += ", ";
				}
			}
			$('textarea[name="cast"]').text(reparto);
			$('#carsCast').text($('textarea[name="cast"]').val().length);
		});
	});

	// Sinopsis
	$('#extractSynopsis').click(function () {
		$('textarea[name="synopsis_en"]').text("");
		var url = "http://www.imdb.com/title/tt" + $('input[name="imdb_code"]').attr('value');
		doGet(url, function (data) {
			var nodosyni = $('div[itemprop="description"] p', data).text();
			if (nodosyni !== undefined) {
				$('textarea[name="synopsis_en"]').text(nodosyni.substring(1, nodosyni.length - 1).split("Written b")[0].trim());
				$('#carsSynEn').text($('textarea[name="synopsis_en"]').val().length);
			}
		});
	});

	$('textarea[name="cast"]').keyup(function () {
		$('#carsCast').text($(this).val().length);
	});

	$('textarea[name="synopsis_en"]').keyup(function () {
		$('#carsSynEn').text($(this).val().length);
	});

	$('textarea[name="synopsis_es"]').keyup(function () {
		$('#carsSynEs').text($(this).val().length);
	});
}

function addDataFromIMDB() {

	function rellenarDesdeIMDB() {

		var nodoi = "//input[@name='imdb_code']".findNode();
		var codigoIMDB = nodoi.value;
		var nodop = "//input[@name='otitle']".findNode();
		if (codigoIMDB.length == 7 && nodop.value == "") {

			// Metemos directores, reparto, fotografia y musica 
			url = "http://www.imdb.com/title/tt" + codigoIMDB + "/fullcredits";
			doGet(url, function (response) {
				response = response.replace("<img", "<omg"); // Para que no se ponga a cargar las peliculas
				var emptydiv = document.createElement('div');
				emptydiv.innerHTML = response;

				var nododr = "//input[@name='director']".findNode();
				var nododri = "//a[contains(@href,'ttfc_fc_dr')]".findNodesArray(emptydiv);
				var directores = "";
				if (nododri.length > 0) {
					for (i = 0; i < nododri.length; i++) {
						directores += nododri[i].textContent.substring(1, nododri[i].textContent.length - 1);
						if (i != nododri.length - 1)
							directores += ", ";
					}
				}
				nododr.value = directores;

				var nodogui1 = "//input[@name='script_en']".findNode();
				var nodogui2 = "//input[@name='script_es']".findNode();
				var nodoguii = "//a[contains(@href,'fc_wr')]".findNodesArray(emptydiv);
				var aux1 = "", aux2 = "";

				if (nodoguii.length > 0) {
					var guionistas = [];
					for (i = 0; i < nodoguii.length; i++) {
						var auxg = nodoguii[i].textContent.substring(1, nodoguii[i].textContent.length).trim();
						if (guionistas.indexOf(auxg) === -1) {
							guionistas.push(auxg);
							if (nodoguii[i].parentNode.parentNode.textContent.indexOf("novel") > 0)
								aux2 += auxg + ", ";
							else
								aux1 += auxg + ", ";
						}
					}
					nodogui1.value = aux1.substring(0, aux1.length - 2);
					nodogui2.value = aux1.substring(0, aux1.length - 2);
					if (aux2 != "") {
						nodogui1.value += " (Novel: " + aux2.substring(0, aux2.length - 2) + ")";
						nodogui2.value += " (Novela: " + aux2.substring(0, aux2.length - 2) + ")";
					}
				}

				var nodorep = "//textarea[@name='cast']".findNode();
				var nodorepi = "//td[@itemprop='actor']".findNodesArray(emptydiv);
				var reparto = "";
				if (nodorepi.length > 0) {
					for (i = 0; i < nodorepi.length && i < 16; i++) {
						reparto += nodorepi[i].childNodes[1].childNodes[1].textContent;
						if (i != nodorepi.length - 1 && i != 15)
							reparto += ", ";
					}
				}
				nodorep.value = reparto;

				var nodofot = "//input[@name='photo']".findNode();
				var nodofoti = "//h4[contains(text(),'Cinematography by')]".findNode(emptydiv);
				var fotog = "";
				if (nodofoti != undefined) {
					nodofoti = nodofoti.nextSibling.nextSibling.childNodes[3];
					for (var i = 1; i < nodofoti.childNodes.length; i += 2) {
						fotog += nodofoti.childNodes[i].childNodes[1].childNodes[1].textContent.substring(1, nodofoti.childNodes[i].childNodes[1].childNodes[1].textContent.length - 1);
						if (i < nodofoti.childNodes.length - 2)
							fotog += ", ";
					}
				}

				nodofot.value = fotog;

				var nodomus1 = "//input[@name='music_en']".findNode();
				var nodomus2 = "//input[@name='music_es']".findNode();
				var nodomusi = "//h4[contains(text(),'Music by')]".findNode(emptydiv);
				var music = "";
				if (nodomusi != undefined) {
					nodomusi = nodomusi.nextSibling.nextSibling.childNodes[3];
					for (var i = 1; i < nodomusi.childNodes.length; i += 2) {
						music += nodomusi.childNodes[i].childNodes[1].childNodes[1].textContent.substring(1, nodomusi.childNodes[i].childNodes[1].childNodes[1].textContent.length - 1);
						if (i < nodomusi.childNodes.length - 2)
							music += ", ";
					}
				}
				nodomus1.value = music;
				nodomus2.value = music;
			});

			// Metemos el resto (titulos, guion, año, duracion, sinopsis ingles, productora
			url = "http://www.imdb.com/title/tt" + codigoIMDB;
			doGet(url, function (response) {
				response = response.replace("<img", "<omg"); // Para que no se ponga a cargar las peliculas
				var emptydiv = document.createElement('div');
				emptydiv.innerHTML = response;

				var generos = "//a[contains(@href,'_stry_gnr')]".findNodesArray(emptydiv);

				//var paisi = "//a[contains(@href,'countries')]".findNode(emptydiv);   
				var paisi = "//a[contains(@href,'country_of_origin')]".findNode(emptydiv);
				var pais = "//select[@name='country']".findNode();
				pais.value = countriesCodesIMDB[paisi.textContent];

				var nodote = "//input[@name='title_es']".findNode();
				var nodotei = "//title".findNode(emptydiv);
				nodote.value = nodotei.textContent.split(" (")[0];

				var nodoto = "//input[@name='otitle']".findNode();
				var nodotoi = "//div[@class='originalTitle']".findNode(emptydiv);
				if (nodotoi != undefined)
					nodoto.value = nodotoi.textContent.split(" (original")[0];
				else
					nodoto.value = nodote.value;

				var nododur = $('input[name="runtime"]');
				var nododuri = $('div.subtext time', emptydiv).attr('datetime');
				//var nododuri = "//div[@class='subtext']/time[@itemprop='duration']".findNode(emptydiv);	                
				//var nododuri2 = "//div[@class='txt-block']/time[@itemprop='duration']".findNode(emptydiv);
				var nododuri2 = $('div.txt-block > time[itemprop="duration"]', emptydiv).text();

				if (nododuri != undefined) {
					duracion = nododuri.substring(2, nododuri.length - 1);
					$(nododur).val(duracion);
				} else if (nododuri2 != undefined) {
					duracion = nododuri2.trim().split(" min")[0];
					$(nododur).val(duracion);
				}

				//Añadir generos                    
				if ("//td[contains(text(),'Series cast summary')]".findNode(emptydiv) != undefined) {
					addGenre('TV_SE');
					nodote.value = nodote.value + " (Serie de TV)";
					nodoto.value = nodoto.value + " (TV Series)";
				}
				var nodofot = "//input[@name='photo']".findNode();
				var isAnim = false;
				var isCom = false, isTer = false, isRom = false, isDr = false;

				for (var ix in generos) {
					if (generos[ix].textContent.trim() == "Animation") {
						nodofot.value = "Animation";
						var nodorep = "//textarea[@name='cast']".findNode();
						nodorep.value = "Animation";
						addGenre('AN');
						isAnim = true;
					}
					else if (generos[ix].textContent.trim() == "Documentary") {
						var nodorep = "//textarea[@name='cast']".findNode();
						nodorep.value = "Documentary, " + nodorep.value;
						addGenre('DO');
					}
					else if (generos[ix].textContent.trim() == "Action")
						addGenre('AC');
					else if (generos[ix].textContent.trim() == "Adventure")
						addGenre('AV');
					else if (generos[ix].textContent.trim() == "War")
						addGenre('BE');
					else if (generos[ix].textContent.trim() == "Drama") {
						addGenre('DR');
						isDr = true;
					}
					else if (generos[ix].textContent.trim() == "Comedy") {
						addGenre('CO');
						isCom = true;
					}
					else if (generos[ix].textContent.trim() == "Fantasy")
						addGenre('FAN');
					else if (generos[ix].textContent.trim() == "Family" && nodote.value.indexOf('Serie de TV') < 0)
						addTopic('685184');
					else if (generos[ix].textContent.trim() == "Film-Noir")
						addGenre('F-N');
					else if (generos[ix].textContent.trim() == "Mystery")
						addGenre('INT');
					else if (generos[ix].textContent.trim() == "Musical")
						addGenre('MU');
					else if (generos[ix].textContent.trim() == "Romance") {
						addGenre('RO');
						isRom = true;
					}
					else if (generos[ix].textContent.trim() == "Horror") {
						addGenre('TE');
						isTer = true;
					}
					else if (generos[ix].textContent.trim() == "Thriller")
						addGenre('TH');
					else if (generos[ix].textContent.trim() == "Western")
						addGenre('WE');
					else if (generos[ix].textContent.trim() == "Sci-Fi")
						addGenre('C-F');
					else if (generos[ix].textContent.trim() == "Crime")
						addTopic('524594');
				}
				if (isCom && isTer)
					addTopic('689483');

				if (isCom && isRom)
					addTopic('848078');

				if (isCom && isDr)
					addTopic('899776');

				if (isDr && isRom)
					addTopic('424086');

				var color = "//h4[contains(text(),'Color:')]".findNode(emptydiv);
				if (color != undefined) {
					color = color.nextSibling.nextSibling;
					if (color.textContent.indexOf("lack and White") > 0)
						nodofot.value = nodofot.value + " (B&W)";
				}

				var mudo = "//h4[contains(text(),'Sound Mix:')]".findNode(emptydiv);
				if (mudo != undefined) {
					mudo = mudo.nextSibling.nextSibling;
					if (mudo.textContent.indexOf("ilent") > 0) {
						addTopic('728806');
						var nodomus1 = "//input[@name='music_en']".findNode();
						nodomus1.value = "Silent film";
						var nodomus2 = "//input[@name='music_es']".findNode();
						nodomus2.value = "Película muda";
					}
				}
				if (duracion != undefined && duracion != "") {
					if (duracion <= 20) {
						nodoto.value += " (S)";
						nodote.value += " (C)";
						if (isAnim)
							addTopic('251997');
						else
							addTopic('280405');
					}
					if (duracion < 60 && duracion > 20)
						addTopic('180914');
				}
				var nodoteng = "//input[@name='title_en']".findNode();
				var nodotengi = "//h4[contains(text(),'Also Known As')]".findNode(emptydiv);
				if (nodotengi != undefined) {
					if (paisi.textContent == "Japan") {
						nodoteng.value = nodotengi.nextSibling.textContent.substring(1, nodotengi.nextSibling.textContent.length - 6);
						nodote.value = nodoteng.value;
					}
				}
				else
					nodoteng.value = nodoto.value;

				if (paisi.textContent == "UK" || paisi.textContent == "USA" || paisi.textContent == "Canada" || paisi.textContent == "Australia" || paisi.textContent == "Ireland" || paisi.textContent == "New Zealand")
					nodoteng.value = nodoto.value;

				var nodoanio = "//input[@name='year']".findNode();
				var nodoanioi = "//title".findNode(emptydiv).textContent;
				var anio = nodoanioi.split('(')[1].split(')')[0].split('–')[0];
				if (anio.indexOf("eries") > 0)
					anio = anio.split("es ")[1];
				if (anio.indexOf("ideo") > 0)
					anio = anio.split("ideo ")[1];
				if (anio.indexOf("V Movie") > 0) {
					anio = anio.split("ovie ")[1];
					addTopic('574004');
					nodoto.value += " (TV)";
					nodoteng.value += " (TV)";
					nodote.value += " (TV)";
				}

				nodoanio.value = anio; //nodoanioi.substring(nodoanioi.length-12,nodoanioi.length-8);          
				if (nodoanio.value < 1915)
					addTopic('898346');

				var nodosyn = "//textarea[@name='synopsis_en']".findNode();
				var nodosyni = "//div[@itemprop='description']/p".findNode(emptydiv);
				if (nodosyni != undefined)
					nodosyn.value = nodosyni.textContent.substring(1, nodosyni.textContent.length - 1).split("Written b")[0];

				var nodosyne = "//textarea[@name='synopsis_es']".findNode();
				nodosyne.value = "(FILMAFFINITY)";

				var nodoprd1 = "//input[@name='producer_en']".findNode();
				var nodoprd2 = "//input[@name='producer_es']".findNode();
				var nodosprdi = "//a[contains(@href,'/company/')]".findNodesArray(emptydiv);
				var productores = "";
				if (nodosprdi.length > 0) {
					for (i = 0; i < nodosprdi.length; i++) {
						productores += nodosprdi[i].childNodes[0].textContent;
						if (i != nodosprdi.length - 1)
							productores += " / ";
					}
				}
				nodoprd1.value = productores;
				nodoprd2.value = productores;

			});

			url = "http://www.imdb.com/title/tt" + codigoIMDB + "/keywords";
			doGet(url, function (response) {
				response = response.replace("<img", "<omg"); // Para que no se ponga a cargar las peliculas
				var emptydiv = document.createElement('div');
				emptydiv.innerHTML = response;

				var keywords = "//a[contains(@href,'ttkw_kw')]".findNodesArray(emptydiv);
				var pais = "//select[@name='country']".findNode();
				for (var ix in keywords) {
					if (keywords[ix].textContent == "3d")
						addTopic('461156');
					else if (keywords[ix].textContent == "sexual abuse")
						addTopic('836459');
					else if (keywords[ix].textContent == "bullying")
						addTopic('791958');
					else if (keywords[ix].textContent == "africa")
						addTopic('644424');
					else if (keywords[ix].textContent == "adult animation")
						addTopic('470842');
					else if (keywords[ix].textContent == "ancient greece")
						addTopic('195438');
					else if (keywords[ix].textContent == "ancient rome")
						addTopic('414531');
					else if (keywords[ix].textContent == "ancient egypt")
						addTopic('246278');
					else if (keywords[ix].textContent == "1900s")
						addTopic('195379');
					else if (keywords[ix].textContent == "1910s")
						addTopic('168876');
					else if (keywords[ix].textContent == "1920s")
						addTopic('986798');
					else if (keywords[ix].textContent == "1930s")
						addTopic('751350');
					else if (keywords[ix].textContent == "1940s")
						addTopic('503186');
					else if (keywords[ix].textContent == "1950s")
						addTopic('306617');
					else if (keywords[ix].textContent == "1960s")
						addTopic('322214');
					else if (keywords[ix].textContent == "1970s")
						addTopic('499166');
					else if (keywords[ix].textContent == "1980s")
						addTopic('432971');
					else if (keywords[ix].textContent == "1990s")
						addTopic('853858');
					else if (keywords[ix].textContent == "spider")
						addTopic('969387');
					else if (keywords[ix].textContent == "martial arts")
						addTopic('458310');
					else if (keywords[ix].textContent == "serial killer")
						addTopic('299106');
					else if (keywords[ix].textContent == "space travel")
						addTopic('624971');
					else if (keywords[ix].textContent == "blaxploitation")
						addTopic('369866');
					else if (keywords[ix].textContent == "boxing")
						addTopic('667395');
					else if (keywords[ix].textContent == "witchcraft")
						addTopic('946896');
					else if (keywords[ix].textContent == "haunted house")
						addTopic('477313');
					else if (keywords[ix].textContent == "film within a film")
						addTopic('742444');
					else if (keywords[ix].textContent == "experimental film")
						addTopic('416484');
					else if (keywords[ix].textContent == "independent film" && pais.value == "US")
						addTopic('485586');
					else if (keywords[ix].textContent == "clay animation")
						addTopic('896486');
					else if (keywords[ix].textContent == "absurd humor")
						addTopic('586472');
					else if (keywords[ix].textContent == "based on comic")
						addTopic('725819');
					else if (keywords[ix].textContent == "cyberpunk")
						addTopic('874320');
					else if (keywords[ix].textContent == "dc comics")
						addTopic('549998');
					else if (keywords[ix].textContent == "dinosaur")
						addTopic('470603');
					else if (keywords[ix].textContent == "dystopia")
						addTopic('212308');
					else if (keywords[ix].textContent == "doctor who")
						addTopic('108082');
					else if (keywords[ix].textContent == "erotica")
						addTopic('848307');
					else if (keywords[ix].textContent == "japanese horror film")
						addTopic('878987');
					else if (keywords[ix].textContent == "alien")
						addTopic('191870');
					else if (keywords[ix].textContent == "mockumentary")
						addTopic('548806');
					else if (keywords[ix].textContent == "post apocalypse")
						addTopic('369658');
					else if (keywords[ix].textContent == "giallo")
						addTopic('150356');
					else if (keywords[ix].textContent == "gore")
						addTopic('696548');
					else if (keywords[ix].textContent == "karate")
						addTopic('490078');
					else if (keywords[ix].textContent == "based on manga")
						addTopic('912178');
					else if (keywords[ix].textContent == "pirate")
						addTopic('654286');
					else if (keywords[ix].textContent == "sequel")
						addTopic('638971');
					else if (keywords[ix].textContent == "vampire")
						addTopic('344682');
					else if (keywords[ix].textContent == "revenge")
						addTopic('326213');
					else if (keywords[ix].textContent == "zombie")
						addTopic('173777');
					else if (keywords[ix].textContent == "swashbuckler")
						addTopic('337935');
					else if (keywords[ix].textContent == "19th century")
						addTopic('661842');
					else if (keywords[ix].textContent == "18th century")
						addTopic('874801');
					else if (keywords[ix].textContent == "17th century")
						addTopic('524985');
					else if (keywords[ix].textContent == "16th century")
						addTopic('496697');
					else if (keywords[ix].textContent == "15th century")
						addTopic('899071');
					else if (keywords[ix].textContent == "14th century")
						addTopic('945094');
					else if (keywords[ix].textContent == "13th century")
						addTopic('803576');
					else if (keywords[ix].textContent == "12th century")
						addTopic('642658');
					else if (keywords[ix].textContent == "11th century")
						addTopic('641061');
					else if (keywords[ix].textContent == "10th century")
						addTopic('664187');


				}
			});
		}
	}

	$('textarea[name="cast"]').parent().append("<div style='float: right; margin-right: 58px; color: steelblue'><p>Nº caracteres: <span id='carsCast'>" + $('textarea[name="cast"]').text().length + "</span></p></div>");
	$('textarea[name="synopsis_en"]').parent().append("<div style='float: right; margin-right: 58px; color: steelblue'><p>Nº caracteres: <span id='carsSynEn'>" + $('textarea[name="synopsis_en"]').text().length + "</span></p></div>");
	$("textarea[name='synopsis_es']").parent().contents().filter(function () { return this.nodeType == 3; }).remove();
	$('textarea[name="synopsis_es"]').parent().append("<div style='float: right; text-align: center; margin-right: 22px; color: steelblue'><p>Nº caracteres: <span id='carsSynEs'>" + $('textarea[name="synopsis_es"]').text().length + "</span></p><p style='color: black;'>Terminar con (FILMAFFINITY)</p></div>");

	$('input[name="otitle"]').on('focus', function () {
		rellenarDesdeIMDB();
	});

	$('textarea[name="cast"]').keyup(function () {
		$('#carsCast').text($(this).val().length);
	});

	$('textarea[name="synopsis_en"]').keyup(function () {
		$('#carsSynEn').text($(this).val().length);
	});

	$('textarea[name="synopsis_es"]').keyup(function () {
		$('#carsSynEs').text($(this).val().length);
	});
}

function changeStyleRw() {

	var nodos = $('.review-text1'), nodos2 = $('.rate-review');
	var notas = $('.user-reviews-movie-rating'), nota;
	for (var i = 0; i < nodos.length; i++) {
		$(nodos[i]).css({ 'padding': '10px 15px', 'margin': '10px 0px', 'color': '#201C1C', 'background-color': "rgb(227, 229, 240)", 'box-shadow': "5px 5px 5px #888888" });
		$(nodos2[i]).css({ 'margin-top': "-10px", 'padding-bottom': "10px" });
		$(notas[i]).css('background-color', color_voto($(notas[i]).text().trim()));
	}
}

function changeMyList() {
	var movies = $('.movies_list li');
	for (var i = 0; i < movies.length; i++) {
		var voto = $(movies[i]).find('.rat-movie').text();
		$(movies[i]).find('.mr-rating').prepend("<div class=\"avgrat-box\" style='background-color: " + color_voto(voto) + "; border-color: " + color_voto(voto) + "'>" + voto + "</div>").end().find('.movie-wrapper').width("600px");

	}
	$('.rat-movie').remove();
}

function changeMyLists() {

	var favoritas = localStorage.getItem(idprop + "_" + 'favsFA') === null ? {} : JSON.parse(localStorage.getItem(idprop + "_" + 'favsFA'));
	var favoritasIMDB = {}, favsimdb2 = GM_getValue("favsIMDB", "empty");
	var favoritasLXD = {}, favslxd2 = GM_getValue("favsLXD", "empty");

	if (favsimdb2 !== "empty")
		favoritasIMDB = JSON.parse(favsimdb2);

	if (favslxd2 !== "empty")
		favoritasLXD = JSON.parse(favslxd2);

	$('#mt-content-cell').prepend("<section id='tabs'><ul><li><a href='#tabs-1'>Mis listas (" + $('#my-lists-count span').text() + ")</a></li>\
		<li><a href='#tabs-2'>Mis listas favoritas de FA (" + Object.keys(favoritas).length + ")</a></li>\
		<li><a href='#tabs-3'>Mis listas favoritas de IMDB (" + Object.keys(favoritasIMDB).length + ")</a></li>\
		<li><a href='#tabs-4'>Mis listas favoritas de LXD (" + Object.keys(favoritasLXD).length + ")</a></li>\
		</ul><div id='tabs-1'></div><div id='tabs-2'></div><div id='tabs-3'></div><div id='tabs-4'></div></section>");

	var paginas = $('.pager-list');
	if (paginas.length === 2)
		$(paginas[0]).appendTo('#tabs-1');

	$('#main-wrapper-list').appendTo('#tabs-1');
	if (paginas.length === 2)
		$(paginas[1]).appendTo('#tabs-1');

	$('#tabs-1').css('padding', '10px');
	$('#main-title').remove();
	$('#my-lists-count').remove();
	$('#tabs li a').css('outline', 'none');
	$("#tabs").tabs();
	changeStyleExtMyLists();
	GM_addStyle(".favlist {box-shadow: 0 1px 5px #AAAAAA; padding: 10px; margin: 5px 0 10px; width: 98%}");
	var txt2 = "", txt3 = "";

	// Favoritas de FA
	if (Object.keys(favoritas).length !== 0) {
		txt2 = "<ul style='list-style: none; padding: 10px'>";
		var favoritasUserTitle = [];
		for (var lista in favoritas)
			favoritasUserTitle.push({ 'usuario': favoritas[lista].uname, 'iduser': favoritas[lista].iduser, 'titulo': favoritas[lista].titulo, 'peliculas': favoritas[lista].peliculas, 'idlist': favoritas[lista].idlist });

		favoritasUserTitle.sort(function (a, b) {
			return a.usuario === b.usuario ? a.titulo > b.titulo : a.usuario > b.usuario;
		});

		for (var i in favoritasUserTitle) {
			txt2 += "<li class='favlist'><div class='tit-list'><a href='http://www.filmaffinity.com/es/userlist.php?user_id=" + favoritasUserTitle[i].iduser + "&list_id=" + favoritasUserTitle[i].idlist + "' target='_blank'><span style='color: #515ED4; font-weight: bold;'>" + favoritasUserTitle[i].usuario + "</span>: " + favoritasUserTitle[i].titulo + "</a></div><i class='fa fa-trash mtrash'></i><div class='pelis-list'>" + favoritasUserTitle[i].peliculas + "</div></li>";
		}
		txt2 += "</ul>";

		$('#tabs-2').html(txt2);
		$('#tabs-2').css('padding', '5px');
		$('.favlist').mouseenter(function () {
			$(this).css('background', '#EAF5F7');
		}).mouseleave(function () {
			$(this).css('background', 'white');
		});

		$('.tit-list, .pelis-list').css('display', 'inline');
		$('.pelis-list').css('float', 'right');
		$('.mtrash').css({ 'float': 'right', 'padding': '0 10px 0 15px', 'cursor': 'pointer' });
		$('.mtrash').click(function () {
			var direc = $(this).prev().find('a').attr('href');
			var userl = direc.split('=')[1].split('&')[0];
			delete favoritas[userl + "-" + direc.split('=')[2]];
			localStorage.setItem(idprop + "_" + 'favsFA', JSON.stringify(favoritas));
			$(this).parent().hide("slide", { direction: "left" }, 700);
			$('#tabs li:nth-child(2) > a').text("Mis listas favoritas de FA (" + Object.keys(favoritas).length + ")");
		});
	}
	else {
		$('#tabs-2').html("<p>Aún no tienes ninguna lista favorita!</p>");
	}

	// Favoritas de IMDB
	if (Object.keys(favoritasIMDB).length !== 0) {
		txt3 = "<ul style='list-style: none; padding: 10px'>";
		var favoritasTitleIMDB = [];
		for (var lista in favoritasIMDB)
			favoritasTitleIMDB.push({ 'usuario': favoritasIMDB[lista].uname, 'iduser': favoritasIMDB[lista].iduser, 'titulo': favoritasIMDB[lista].titulo, 'peliculas': favoritasIMDB[lista].peliculas, 'idlist': favoritasIMDB[lista].idlist });

		favoritasTitleIMDB.sort(function (a, b) {
			return a.titulo > b.titulo;
		});
		for (var i in favoritasTitleIMDB)
			txt3 += "<li class='favlist'><div class='tit-list'><a href='http://www.imdb.com/list/ls" + favoritasTitleIMDB[i].idlist + "' target='_blank'>" + favoritasTitleIMDB[i].titulo + "</a></div><i class='fa fa-trash mtrash'></i><div class='pelis-list'>" + favoritasTitleIMDB[i].peliculas + "</div></li>";

		txt3 += "</ul>";

		$('#tabs-3').html(txt3);
		$('#tabs-3').css('padding', '5px');
		$('.favlist').mouseenter(function () {
			$(this).css('background', '#EAF5F7');
		}).mouseleave(function () {
			$(this).css('background', 'white');
		});

		$('.tit-list, .pelis-list').css('display', 'inline');
		$('.pelis-list').css('float', 'right');
		$('.mtrash').css({ 'float': 'right', 'padding': '0 10px 0 15px', 'cursor': 'pointer' });
		$('.mtrash').click(function () {
			var keys = Object.keys(favoritasIMDB), clave;
			var direc = $(this).prev().find('a').attr('href');
			var userlist = direc.split('/ls')[1];
			for (var i = 0; i < keys.length; i++) {
				if (keys[i].indexOf(userlist) > -1) {
					clave = keys[i];
					break;
				}
			}

			delete favoritasIMDB[clave];
			GM_setValue('favsIMDB', JSON.stringify(favoritasIMDB));
			$(this).parent().hide("slide", { direction: "left" }, 700);
			$('#tabs li:nth-child(3) > a').text("Mis listas favoritas de IMDB (" + Object.keys(favoritasIMDB).length + ")");
		});
	}
	else {
		$('#tabs-3').html("<p>Aún no tienes ninguna lista favorita!</p>");
	}

	// Favoritas de LXD
	if (Object.keys(favoritasLXD).length !== 0) {
		txt4 = "<ul style='list-style: none; padding: 10px'>";
		var favoritasTitleLXD = [];
		for (var lista in favoritasLXD)
			favoritasTitleLXD.push({ 'usuario': favoritasLXD[lista].uname, 'iduser': favoritasLXD[lista].iduser, 'titulo': favoritasLXD[lista].titulo, 'peliculas': favoritasLXD[lista].peliculas, 'idlist': favoritasLXD[lista].idlist });

		favoritasTitleLXD.sort(function (a, b) {
			return a.titulo > b.titulo;
		});
		for (var i in favoritasTitleLXD)
			txt4 += "<li class='favlist'><div class='tit-list'><a href='https://letterboxd.com/" + favoritasTitleLXD[i].iduser + "/list/" + favoritasTitleLXD[i].idlist + "' target='_blank'><span style='color: #515ED4; font-weight: bold;'>" + favoritasTitleLXD[i].usuario + "</span>: " +  favoritasTitleLXD[i].titulo + "</a></div><i class='fa fa-trash mtrash'></i><div class='pelis-list'>" + favoritasTitleLXD[i].peliculas + "</div></li>";

		txt4 += "</ul>";

		$('#tabs-4').html(txt4);
		$('#tabs-4').css('padding', '5px');
		$('.favlist').mouseenter(function () {
			$(this).css('background', '#EAF5F7');
		}).mouseleave(function () {
			$(this).css('background', 'white');
		});

		$('.tit-list, .pelis-list').css('display', 'inline');
		$('.pelis-list').css('float', 'right');
		$('.mtrash').css({ 'float': 'right', 'padding': '0 10px 0 15px', 'cursor': 'pointer' });
		$('.mtrash').click(function () {
			var keys = Object.keys(favoritasLXD), clave;
			var direc = $(this).prev().find('a').attr('href');
			var userlist = direc.split('/ls')[1];
			for (var i = 0; i < keys.length; i++) {
				if (keys[i].indexOf(userlist) > -1) {
					clave = keys[i];
					break;
				}
			}

			delete favoritasLXD[clave];
			GM_setValue('favsLXD', JSON.stringify(favoritasLXD));
			$(this).parent().hide("slide", { direction: "left" }, 700);
			$('#tabs li:nth-child(4) > a').text("Mis listas favoritas de LXD (" + Object.keys(favoritasLXD).length + ")");
		});
	}
	else {
		$('#tabs-4').html("<p>Aún no tienes ninguna lista favorita!</p>");
	}
}

function changeStyleExtMyLists() {

	var listas = $('.list-wrapper').length;
	if (listas === 0)
		setTimeout(changeStyleExtMyLists, 250);
	else {
		$('.user-lists').css('padding-left', '10px');
		$('.list-name-wrapper').width(480);
	}
}

function addIconFavListFA() {

	var favoritas = localStorage.getItem(idprop + "_" + 'favsFA') === null ? {} : JSON.parse(localStorage.getItem(idprop + "_" + 'favsFA'));
	$('.user-lists > li .list-name-wrapper a').prepend("<i style='cursor: pointer' class='fa fa-heart'></i>").end()
		.find('i').css({ 'font-size': '12px', 'display': 'inline-block', 'margin-right': '5px', 'transform': 'translate(0, -2px)' });

	$('.user-lists > li .list-wrapper').hover(function () { $(this).css('background', 'lightblue') },
		function () { $(this).css('background', 'none repeat scroll 0 0 #FFFFFF') });

	var favs = $('.fa-heart'), lists = $('.list-name-wrapper > a'), listCounts = $('.list-count');
	var userlistid = lists[0].href.split('=')[1].split('&')[0];
	var clave;

	for (var i = 0; i < lists.length; i++) {
		clave = userlistid + "-" + lists[i].href.split('=')[2];
		$(favs[i]).attr('id', clave);
		if (favoritas[clave] !== undefined) {
			$(favs[i]).css('color', 'red');
			var elements = $(listCounts[i]).text().trim().split(' ')[0];
			if (favoritas[clave].peliculas !== elements) {
				favoritas[clave].peliculas = elements;
				localStorage.setItem(idprop + "_" + 'favsFA', JSON.stringify(favoritas));
			}
		}
	}

	$(".fa-heart").click(function (event) {
		event.preventDefault();
		var clave = $(this).attr('id');
		if (favoritas[clave] !== undefined) {
			delete favoritas[clave];
			localStorage.setItem(idprop + "_" + 'favsFA', JSON.stringify(favoritas));
			$(this).css('color', '#666666');
		}
		else {
			var username = $('.nick a').text();
			var title = $(this).parent().text();
			var elements = $(this).parent().parent().next().text().trim().split(' ')[0];
			favoritas[clave] = { iduser: userlistid, idlist: clave.split('-')[1], uname: username, titulo: title, peliculas: elements };
			$(this).css('color', 'red');
			localStorage.setItem(idprop + "_" + 'favsFA', JSON.stringify(favoritas));
		}
	});
}

function addIconFavListIMDB() {

	GM_addStyle("#addFav {margin-right: 10px; font-weight: bold; cursor: pointer; font-size: 21px; color: #CCC;}");
	var favoritasIMDB = GM_getValue('favsIMDB') ? JSON.parse(GM_getValue('favsIMDB')) : {};
	var titulo = $('h1.header').text();
	var username = $('.byline a').text();
	var userid = $('.byline a').attr('href').split('/')[2].split('ur')[1];
	var elementos = $('.desc').attr('data-size');
	if (elementos === undefined)
		elementos = $('.count span').text().split('/')[1];
	var idlist = url.split('/')[4].split('ls')[1].split('/')[0].split('?')[0];
	var clave = userid + "-" + idlist;

	if (favoritasIMDB[clave] !== undefined) {
		$('h1.header').prepend("<span id='addFav' title='Eliminar de favoritas'>-</span>");
		favoritasIMDB[clave].peliculas = elementos;
		GM_setValue('favsIMDB', JSON.stringify(favoritasIMDB));
	}
	else
		$('h1.header').prepend("<span id='addFav' title='Añadir a favoritas'>+</span>");

	$('#addFav').click(function () {
		if (favoritasIMDB[clave] !== undefined) {
			delete favoritasIMDB[clave];
			GM_setValue('favsIMDB', JSON.stringify(favoritasIMDB));
			$(this).text("+");
		}
		else {
			favoritasIMDB[clave] = { iduser: userid, idlist: idlist, uname: username, titulo: titulo, peliculas: elementos };
			GM_setValue('favsIMDB', JSON.stringify(favoritasIMDB));
			$(this).text("-");
		}
	});
}

function addIconFavListLXD() {
	if (url.indexOf('\/list\/') !== -1) {
		GM_addStyle("#addFav {margin-right: 10px; font-weight: bold; cursor: pointer; font-size: 21px; color: #CCC;}");
		var favoritasLXD = GM_getValue('favsLXD') ? JSON.parse(GM_getValue('favsLXD')) : {};
		let titulo = $('h1[itemprop="title"]').text().trim();
		let username = $('a[itemprop="sameAs"]').text().trim();
		let userid = $('section.promopanel a:first-of-type').text();
		let elementos = $('meta[name="description"]').attr("content").split(" ")[3];
		var idlist = location.href.split('\/')[5];
		let clave = userid + "-" + idlist;

		if (favoritasLXD[clave] !== undefined) {
			$('h1[itemprop="title"]').prepend("<span id='addFav' title='Eliminar de favoritas'>-</span>");
			favoritasLXD[clave].peliculas = elementos;
			GM_setValue('favsLXD', JSON.stringify(favoritasLXD));
		}
		else
			$('h1[itemprop="title"]').prepend("<span id='addFav' title='Añadir a favoritas'>+</span>");

		$('#addFav').click(function () {
			if (favoritasLXD[clave] !== undefined) {
				delete favoritasLXD[clave];
				GM_setValue('favsLXD', JSON.stringify(favoritasLXD));
				$(this).text("+");
			}
			else {
				favoritasLXD[clave] = { iduser: userid, idlist: idlist, uname: username, titulo: titulo, peliculas: elementos };
				GM_setValue('favsLXD', JSON.stringify(favoritasLXD));
				$(this).text("-");
			}
		});
	}
}

function addOtherLinks() {

	function linkYear() {

		var nodoanio = "//dt[text()='Año']/following-sibling::*".findNode();
		if (nodoanio != null) {
			var anio = nodoanio.lastChild.textContent.trim();
			nodoanio.removeChild(nodoanio.lastChild);
			var newa = document.createElement('a');
			newa.textContent = anio;
			newa.href = "http://www.filmaffinity.com/es/advsearch.php?stext=&stype[]=title&genre=&country=&fromyear=" + anio + "&toyear=" + anio;
			newa.target = "";
			newa.style.color = "inherit";
			newa.style.textDecoration = "none";
			nodoanio.appendChild(newa);
		}
	}

	function linkGuion() {

		var nguion = "//dt[text()='Guion']/following-sibling::*".findNode();

		if (nguion != null) {
			var linea = nguion.textContent;
			if (linea != "") {
				nguion.removeChild(nguion.lastChild);
				var aux = linea.split('(');
				var gnistas = aux[0].split(',');

				var txt = "";
				var nombre = "";
				for (ix in gnistas) {
					nombre = gnistas[ix].split(' ');
					txt += '<a href="http://www.filmaffinity.com/es/advsearch.php?stext=' + gnistas[ix] + '&stype[]=script&genre=&country=&fromyear=&toyear=" ';
					txt += 'target="" style="text-decoration: none; color:inherit">' + gnistas[ix] + '</a>';
					if (ix != gnistas.length - 1)
						txt += ', ';
				}

				if (aux.length > 1) {
					txt += '(';
					txt += aux[1];
				}
				nguion.innerHTML = txt;
			}
		}
	}

	function linkMusica() {

		var nmusic = "//dt[text()='Música']/following-sibling::*".findNode();
		if (nmusic != null) {
			var linea = nmusic.textContent;
			if (linea != "") {
				nmusic.removeChild(nmusic.lastChild);
				var aux = linea.split('(');
				var musicos = aux[0].split(',');
				var txt = "";
				for (ix in musicos) {
					txt += '<a href="http://www.filmaffinity.com/es/advsearch.php?stext=' + musicos[ix] + '&stype[]=music&genre=&country=&fromyear=&toyear=" ';
					txt += 'target="" style="text-decoration: none; color:inherit">' + musicos[ix] + '</a>';
					if (ix != musicos.length - 1)
						txt += ', ';
				}

				if (aux.length > 1) {
					txt += '(';
					txt += aux[1];
				}
				nmusic.innerHTML = txt;
			}
		}
	}

	function linkFoto() {

		var nfoto = "//dt[text()='Fotografía']/following-sibling::*".findNode();
		if (nfoto != null) {
			var linea = nfoto.textContent;
			if (linea != "") {
				nfoto.removeChild(nfoto.lastChild);
				var aux = linea.split('(');
				var fotogs = aux[0].split(',');
				var txt = "";
				for (ix in fotogs) {
					txt += '<a href="http://www.filmaffinity.com/es/advsearch.php?stext=' + fotogs[ix] + '&stype[]=photo&genre=&country=&fromyear=&toyear=" ';
					txt += 'target="" style="text-decoration: none; color:inherit">' + fotogs[ix] + '</a>';
					if (ix != fotogs.length - 1)
						txt += ', ';
				}
				if (aux.length > 1) {
					txt += '(';
					txt += aux[1];
				}
				nfoto.innerHTML = txt;
			}
		}
	}

	linkYear();
	linkGuion();
	linkMusica();
	linkFoto();
}

function addComments(movieid) {

	var comentarios = localStorage.getItem(idprop + "_" + 'comments') ? JSON.parse(localStorage.getItem(idprop + "_" + 'comments')) : {};
	GM_addStyle("#txtComment {width: 95%; height: 100px; resize: none; margin: 0 auto; display: block; border: 1px solid steelblue; box-shadow: 1px 1px 10px lightblue; display: none}");
	GM_addStyle("#addNewComment {color: #326E9C; cursor: pointer}");
	GM_addStyle("#saveComment {display: none; width: 163px; margin: 15px auto 0; text-align: center; padding: 7px; color: steelblue; border-radius: 9px; cursor: pointer; box-shadow: 1px 1px 10px steelblue;}");
	GM_addStyle("#saveComment span {font-size: 16px; transform: translateY(-3px); color: steelblue; margin-right: 5px;}");
	GM_addStyle("#editComment, #removeComment {display: inline-block; margin-top: 15px; color: #8C4529; cursor: pointer}");

	$('#left-column dl.movie-info:first-child').append('<dt>Comentario</dt>');
	$('#left-column dl.movie-info:first-child').append('<dd><textarea id="txtComment" placeholder="Escribe aquí tu comentario personal"></textarea>\
			<div id="saveComment"><span class="fa fa-check"></span> Guardar comentario</div></dd>');
	if (!comentarios.hasOwnProperty(movieid)) {
		GM_addStyle("#addNewComment {color: #326E9C; cursor: pointer}");
		$('#left-column dl.movie-info:first-child').append('<dd>Aún no tienes un comentario personal. <span id="addNewComment">Pulsa aquí para añadir uno.</span></dd>');

		$('#addNewComment').on('click', function () {
			$(this).parent().fadeOut("slow", function () {
				$('#txtComment').fadeIn('slow');
				$('#saveComment').fadeIn('slow');
			});
		});
	}
	else {
		$('#left-column dl.movie-info:first-child').append('<dd><div>' + comentarios[movieid] + '</div>\
			<div id="editComment">Editar comentario</div> - \
			<div id="removeComment">Eliminar comentario</div></dd>');
	}

	$('#editComment').on('click', function () {
		$(this).parent().fadeOut('slow', function () {
			$('#txtComment').val(comentarios[movieid]);
			$('#txtComment').fadeIn('slow');
			$('#saveComment').fadeIn('slow');
		});
	});

	$('#removeComment').on('click', function () {
		delete comentarios[movieid];
		localStorage.setItem(idprop + "_" + 'comments', JSON.stringify(comentarios));
		location.reload();
	});

	$('#saveComment').on('click', function () {
		comentarios[movieid] = $('#txtComment').val();
		localStorage.setItem(idprop + "_" + 'comments', JSON.stringify(comentarios));
		location.reload();
	});
}

function rateActors(movieid) {
	GM_addStyle('#box-rac {background: #F0F0F0; text-align: center; margin: 10px; padding: 5px 0px; border: 1px solid #CDDCEB;}');
	GM_addStyle("#rateActors, #saveRateActors {width: 115px; margin: 0 auto; text-align: center; padding: 7px; color: white; border-radius: 9px; cursor: pointer; background: #fff; border: 1px solid steelblue; color: steelblue}");
	GM_addStyle("#rateActors span.fa {font-size: 15px; transform: translateY(-3px); margin: 0 5px;color: steelblue}");
	GM_addStyle("#rateActors span:last-child {display: inline-block; margin-top: 5px; color: steelblue}");
	GM_addStyle("span[itemprop='actor'] .fa-thumbs-up {display: inline-block; margin-right: 5px; color: green; cursor: pointer}");
	GM_addStyle("span[itemprop='actor'] .fa-thumbs-down {display: inline-block; margin-left: 5px; color: red; cursor: pointer}");

	let rateActors = localStorage.getItem(idprop + "_" + 'rateActors') ? JSON.parse(localStorage.getItem(idprop + "_" + 'rateActors')) : {};
	// cambiamos colores según votos si hay información de la película
	if (rateActors[movieid]) {
		let actors = $('span[itemprop="actor"]');
		actors.get().forEach(actor => {
			let actorName = $(actor).text().trim().replace(/,/g, '');
			let voto = rateActors[movieid][actorName] || 0;
			if (voto === 1)
				$(actor).find('a span').css({ 'color': 'green', 'text-decoration': 'underline' });
			else if (voto === -1)
				$(actor).find('a span').css({ 'color': 'red', 'text-decoration': 'underline' });
		});
	}

	$('#box-rev').before('<div id="box-rac"><div id="rateActors"><span class="fa fa-thumbs-down"></span><span class="fa fa-thumbs-up"></span><span>Valorar actores</span></div></div>');

	$('#rateActors').on('click', function () {
		rateActors[movieid] = rateActors[movieid] || {};
		let actors = $('span[itemprop="actor"]');
		actors.get().forEach((actor, i) => {
			actor.removeChild(actor.childNodes[2]);
			let actorName = $(actor).text().trim();
			let voto = rateActors[movieid][actorName] || 0;
			if (voto === 1)
				$(actor).append('<span class="fa fa-thumbs-down"></span>');
			else if (voto === -1)
				$(actor).prepend('<span class="fa fa-thumbs-up"></span>');
			else {
				$(actor).prepend('<span class="fa fa-thumbs-up"></span>');
				$(actor).append('<span class="fa fa-thumbs-down"></span>');
			}

			$(actor).css({ 'display': 'inline-block', 'width': '49%' });
			$(actor).find('a span').css({ 'text-decoration': 'none' });
			if (i % 2 === 1)
				$(actor).css({ 'text-align': 'right' });
		});

		let element = document.getElementById('rateActors');
		element.outerHTML = "<div id='saveRateActors'>Ver cambios</div>";

		$('dd .fa-thumbs-up').on('click', function () {
			let actor = $(this).parent().text().trim();
			if (rateActors[movieid] && rateActors[movieid][actor] && rateActors[movieid][actor] < 1) {
				rateActors[movieid][actor]++;
			} else if (rateActors[movieid]) {
				rateActors[movieid][actor] = 1;
			} else {
				rateActors[movieid] = {};
				rateActors[movieid][actor] = 1;
			}

			if (rateActors[movieid][actor] === 1) {
				$(this).css('display', 'none');
				$(this).parent().find('a span').css({ 'color': 'green' });
			}
			else
				$(this).parent().find('a span').css({ 'color': '#326E9C' });

			$(this).parent().find('.fa-thumbs-down').css('display', 'inline-block');

			localStorage.setItem(idprop + "_" + 'rateActors', JSON.stringify(rateActors));
		});

		$('dd .fa-thumbs-down').on('click', function () {
			let actor = $(this).parent().text().trim();
			if (rateActors[movieid] && rateActors[movieid][actor] && rateActors[movieid][actor] > -1) {
				rateActors[movieid][actor]--;
			} else if (rateActors[movieid]) {
				rateActors[movieid][actor] = -1;
			} else {
				rateActors[movieid] = {};
				rateActors[movieid][actor] = -1;
			}

			if (rateActors[movieid][actor] === -1) {
				$(this).css('display', 'none');
				$(this).parent().find('a span').css({ 'color': 'red' });
			}
			else
				$(this).parent().find('a span').css({ 'color': '#326E9C' });

			$(this).parent().find('.fa-thumbs-up').css('display', 'inline-block');

			localStorage.setItem(idprop + "_" + 'rateActors', JSON.stringify(rateActors));
		});

		$('#saveRateActors').on('click', function () {
			location.reload();
		})
	});
}

function doAddSeasonInfo(movieid) {

	$('#left-column dl.movie-info:first-child').append('<dt>Temporadas</dt>');

	let txt = "";
	$.get("https://fasupport.000webhostapp.com/fa/series.php?id=" + movieid, function (data) {

		// Hay contenido en BD
		if (data.length > 0) {
			// Cargamos estilos
			var rateYoStyle = GM_getResourceText("rateYoCSS");
			GM_addStyle(rateYoStyle);
			GM_addStyle(".contRateYo {text-align:center}");
			GM_addStyle(".ovSeason {float: right}");
			GM_addStyle(".contRateYo > div {display: inline-block}");
			GM_addStyle(".ui-accordion-content > p {margin-top: 0; margin-bottom: 20px}");
			GM_addStyle(".contRateYo .container-rat {width: 32px; background: steelblue; color: #fff; font-weight: bold; padding: 1px 3px; margin-left: 10px; vertical-align: top;}");
			GM_addStyle(".removeRatingEpisode {display: inline-block; margin-left: 10px; font-size: 18px; color: red; vertical-align: top; margin-top: 2px; cursor: pointer}");

			let serieData = JSON.parse(data);
			let votosSeries = localStorage.getItem(idprop + "_votosSeries") ? JSON.parse(localStorage.getItem(idprop + "_votosSeries")) : {};

			for (let season in serieData) {
				// Cabecera
				let votosSeason = votosSeries[movieid] && votosSeries[movieid][season] ? Object.keys(votosSeries[movieid][season]).length : 0;
				let avgSeason;

				if (votosSeason > 0) {
					let sumaVotos = 0;
					for (let ch in votosSeries[movieid][season])
						sumaVotos += votosSeries[movieid][season][ch];
					avgSeason = (sumaVotos / votosSeason).toFixed(1);
				} else {
					avgSeason = 0;
				}

				let totalEpisodesSeason = Object.keys(serieData[season]).length;
				txt += "<h3>Temporada " + season + "<span class='ovSeason'>(" + votosSeason + "/" + totalEpisodesSeason + ")";
				if (avgSeason !== 0)
					txt += " - " + avgSeason;
				txt += "</span></h3><div class='accordion'>";

				// Contenido
				if (votosSeason === 0) {
					for (let chapter in serieData[season]) {
						txt += "<h3>" + chapter + ". " + serieData[season][chapter].title + "<span class='pull-right'>" + serieData[season][chapter].fechaEmision + "</span></h3>\
						<div><p>" + serieData[season][chapter].plot + "</p>\
						<div class='contRateYo'><div class='rateYo' data-season='" + season + "' data-episode='" + chapter + "'></div><div class='container-rat'>-</div><span class='fa fa-remove removeRatingEpisode' title='Eliminar voto'></span></div></div>";
					}
				} else { // Hay votado algún episodio
					for (let chapter in serieData[season]) {
						txt += "<h3>";
						if (votosSeries[movieid][season][chapter])
							txt += "<strong>" + chapter + ". " + serieData[season][chapter].title + "<span class='pull-right'>" + serieData[season][chapter].fechaEmision + "</span></strong></h3>";
						else
							txt += chapter + ". " + serieData[season][chapter].title + "<span class='pull-right'>" + serieData[season][chapter].fechaEmision + "</span></h3>";
						txt += "<div><p>" + serieData[season][chapter].plot + "</p>\
								<div class='contRateYo'><div class='rateYo' data-season='" + season + "' data-episode='" + chapter + "'></div>\
								<div class='container-rat'>-</div><span class='fa fa-remove removeRatingEpisode' title='Eliminar voto'></span></div></div>";
					}
				}
				txt += "</div>";
			}

			// Creamos el nodo con el contenido y le damos la funcionalidad de acordeón h3 + div > p
			$('#left-column dl.movie-info:first-child').append('<dd><div class="accordion">' + txt + '</div></dd>');
			$(".accordion").accordion({ collapsible: true, active: false, heightStyle: 'content' });

			$(".rateYo").rateYo({
				starWidth: "20px",
				numStars: 10,
				maxValue: 10,
				ratedFill: "steelblue",
				onSet: function (rating, element) {
					votosSeries[movieid] = votosSeries[movieid] || {};
					votosSeries[movieid][element.node.dataset.season] = votosSeries[movieid][element.node.dataset.season] || {};
					if (votosSeries[movieid][element.node.dataset.season][element.node.dataset.episode] !== rating && rating != 0) {
						votosSeries[movieid][element.node.dataset.season][element.node.dataset.episode] = rating;
						localStorage.setItem(idprop + "_votosSeries", JSON.stringify(votosSeries));
					}
				}
			});

			$(".rateYo").rateYo().on("rateyo.change", function (e, data) {
				$(this).next().text(data.rating);
			});

			$(".rateYo").rateYo().on("rateyo.set", function (e, data) {
				$(this).next().text(data.rating);
			});

			for (let seasonU in votosSeries[movieid]) {
				for (let episodeU in votosSeries[movieid][seasonU])
					$('*[data-season="' + seasonU + '"][data-episode="' + episodeU + '"]').rateYo("option", "rating", votosSeries[movieid][seasonU][episodeU]);
			}

			$('.removeRatingEpisode').on('click', function () {
				var nodo = $(this).parent().find('.rateYo');
				delete votosSeries[movieid][$(nodo).data('season')][$(nodo).data('episode')];
				localStorage.setItem(idprop + "_votosSeries", JSON.stringify(votosSeries));
				$('*[data-season="' + $(nodo).data('season') + '"][data-episode="' + $(nodo).data('episode') + '"]').rateYo("option", "rating", 0);
				$(this).parent().find('.container-rat').text('-');
			});
		}
	});
}

function extractStats(containers, i) {
	var aux, arr_st = [];
	aux = $(containers[i]).find('text');
	if (i === 1)
		for (i = 0; i < aux.length; i++)
			arr_st.push($(aux[i]).text().split('%')[0]);
	else
		for (i = 0; i < aux.length; i++)
			arr_st.push($(aux[i]).text());
	return arr_st;
}

function addGroupVotes() {
	var votos = localStorage.getItem(idprop + "_votos");
	if (votos !== null) {
		var votos2 = JSON.parse(votos);
		var nodos = $('.avg-rating');
		var numPelis = $('.movie-card-0');
		var nick = $('#user-nick > a').text();
		for (var i = 0; i < nodos.length; i++) {
			var idfilm = $(numPelis[i]).attr("data-movie-id");
			var voto = votos2[idfilm] !== undefined ? votos2[idfilm].voto : "-";
			$(nodos[i]).attr('title', 'Media FA').parent().append("<br/><div class='avg-rating' style='background-color:" + color_voto(voto) + "' title='" + nick + "'>" + (votos2[idfilm] ? votos2[idfilm].voto : "--") + "</div>");
		}
	}
}

function changeStats() {

	var user1 = $('#user-nick a').text();
	var user2 = $('.nick a').text();

	$('.user-title-sec').html("<span style='color: steelblue'>" + user1 + "</span> vs. <span style='color: #7BC225'>" + user2 + "</span>");
	$('.user-title-sec').css({ 'font-weight': 'bold', 'text-align': 'center', 'margin': '5px 5px -10px' });
	var i, votos_val = [], porc_val = [], votos_gen = [], porc_gen = [], votos_pais = [], votos_anios = [], media_gen = [], media_pais = [], media_anios = [], obj_generos = {}, obj_paises = {}, obj_anios = {};
	var containers = $('svg');

	porc_val = extractStats(containers, 1);
	votos_val = extractStats(containers, 2);
	votos_gen = extractStats(containers, 3);
	media_gen = extractStats(containers, 4);
	votos_pais = extractStats(containers, 5);
	media_pais = extractStats(containers, 6);
	votos_anios = extractStats(containers, 7);
	media_anios = extractStats(containers, 8);

	var total_votos = votos_val.slice(1).reduce(function (a, b) { return +a + +b; });
	var nodoscab = $('.header-chart');

	// Por géneros
	var generos = $(nodoscab[0]).parent().children('div');
	for (i = 1; i < generos.length; i++) {
		obj_generos[generos[i].textContent] = { votos: votos_gen[i], media: media_gen[i] };
		porc_gen.push(((votos_gen[i] * 100) / total_votos).toFixed(2));
	}

	var paises = $(nodoscab[1]).parent().children('div');
	for (i = 1; i < paises.length; i++)
		obj_paises[paises[i].textContent] = { votos: votos_pais[i], media: media_pais[i] };

	var anios = $(nodoscab[2]).parent().children('div');
	for (i = 1; i < anios.length; i++)
		obj_anios[anios[i].textContent] = { votos: votos_anios[i], media: media_anios[i] };

	var url_ms = "http://www.filmaffinity.com/es/userrep.php?user_id=" + idprop;

	doGet(url_ms, function (response) {
		var i2, votos_val2 = [], porc_val2 = [], votos_gen2 = [], porc_gen2 = [], votos_pais2 = [], votos_anios2 = [], media_gen2 = [], media_pais2 = [], media_anios2 = [], obj_generos2 = {}, obj_paises2 = {}, obj_anios2 = {};
		var containers2 = $('svg', response);

		porc_val2 = extractStats(containers2, 1);
		votos_val2 = extractStats(containers2, 2);
		votos_gen2 = extractStats(containers2, 3);
		media_gen2 = extractStats(containers2, 4);
		votos_pais2 = extractStats(containers2, 5);
		media_pais2 = extractStats(containers2, 6);
		votos_anios2 = extractStats(containers2, 7);
		media_anios2 = extractStats(containers2, 8);

		var total_votos2 = votos_val2.slice(1).reduce(function (a, b) { return parseInt(a) + parseInt(b); });
		var nodoscab2 = $('.header-chart', response);

		// Por géneros
		var generos2 = $(nodoscab2[0]).parent().children('div');
		for (i = 1; i < generos2.length; i++)
			obj_generos2[generos2[i].textContent] = { votos: votos_gen2[i], media: media_gen2[i] };

		votos_gen2.length = 0;
		media_gen2.length = 0;
		for (i = 1; i < generos.length; i++) {
			votos_gen2.push(obj_generos2[generos[i].textContent].votos);
			media_gen2.push(obj_generos2[generos[i].textContent].media);
			porc_gen2.push(((obj_generos2[generos[i].textContent].votos * 100) / total_votos2).toFixed(2));
		}
		var paises2 = $(nodoscab2[1]).parent().children('div');
		for (i = 1; i < paises2.length; i++)
			obj_paises2[paises2[i].textContent] = { votos: votos_pais2[i], media: media_pais2[i] };

		var anios2 = $(nodoscab[2]).parent().children('div');
		for (i = 1; i < anios2.length; i++)
			obj_anios2[anios2[i].textContent] = { votos: votos_anios2[i], media: media_anios2[i] };

		$('.charts-wrapper').append("<div class='tit-clas-votos'>Por valoración</div>");
		$('.charts-wrapper').append("<div class='tit-subclas-votos'>Número de votos</div>");
		$('.charts-wrapper').append('<canvas id="vot-valor" width="700" height="350"></canvas>');
		var valData = {
			labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			datasets: [
				{ label: user1, fillColor: 'steelblue', data: votos_val2.slice(1) },
				{ label: user2, fillColor: '#7BC225', data: votos_val.slice(1) }
			]
		};

		var maxval1 = votos_val.slice(1).reduce(function (a, b) { if (+a > +b) return a; else return b; });
		var maxval2 = votos_val2.slice(1).reduce(function (a, b) { if (+a > +b) return a; else return b; });
		var maxval = +maxval1 > +maxval2 ? maxval1 : maxval2;
		var context = document.getElementById('vot-valor').getContext('2d');
		var valorChart = new Chart(context).Bar(valData, { scaleLabel: "<%= ' ' + value%>", animation: false, scaleOverride: true, scaleSteps: 10, scaleStepWidth: Math.ceil(maxval / 10) });

		$('.charts-wrapper').append("<div class='tit-subclas-votos'>Porcentaje de votos</div>");
		$('.charts-wrapper').append('<canvas id="porc-vot-valor" width="700" height="350"></canvas>');
		var porcValData = {
			labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
			datasets: [
				{ label: user1, fillColor: 'steelblue', data: porc_val2.slice(1) },
				{ label: user2, fillColor: '#7BC225', data: porc_val.slice(1) }
			]
		};
		maxval1 = porc_val.slice(1).reduce(function (a, b) { if (+a > +b) return a; else return b; });
		maxval2 = porc_val2.slice(1).reduce(function (a, b) { if (+a > +b) return a; else return b; });
		maxval = +maxval1 > +maxval2 ? maxval1 : maxval2;
		context = document.getElementById('porc-vot-valor').getContext('2d');
		var porcValorChart = new Chart(context).Bar(porcValData, { multiTooltipTemplate: "<%= value + ' %' %>", animation: false, scaleLabel: "<%= ' ' + value + '%'%>", scaleOverride: true, scaleSteps: 10, scaleStepWidth: (maxval / 10).toFixed(2) });

		$('.charts-wrapper').append("<div class='tit-clas-votos'>Por géneros</div>");
		$('.charts-wrapper').append("<div class='tit-subclas-votos'>Número de votos</div>");
		$('.charts-wrapper').append('<canvas id="vot-generos" width="700" height="350"></canvas>');
		var genData = {
			labels: Object.keys(obj_generos),
			datasets: [
				{ label: user1, fillColor: 'steelblue', data: votos_gen2 },
				{ label: user2, fillColor: '#7BC225', data: votos_gen.slice(1) }
			]
		};

		var maxgen1 = votos_gen.slice(1).reduce(function (a, b) { if (+a > +b) return a; else return b; });
		var maxgen2 = votos_gen2.reduce(function (a, b) { if (+a > +b) return a; else return b; });
		var maxgen = +maxgen1 > +maxgen2 ? maxgen1 : maxgen2;
		context = document.getElementById('vot-generos').getContext('2d');
		var generosChart = new Chart(context).Bar(genData, { scaleLabel: "<%= ' ' + value%>", animation: false, scaleOverride: true, scaleSteps: 10, scaleStepWidth: Math.ceil(maxgen / 10) });

		$('.charts-wrapper').append("<div class='tit-subclas-votos'>Porcentaje de votos</div>");
		$('.charts-wrapper').append('<canvas id="porc-vot-genero" width="700" height="350"></canvas>');
		var porcGenData = {
			labels: Object.keys(obj_generos),
			datasets: [
				{ label: user1, fillColor: 'steelblue', data: porc_gen2 },
				{ label: user2, fillColor: '#7BC225', data: porc_gen }
			]
		};
		maxval1 = porc_gen.reduce(function (a, b) { if (+a > +b) return a; else return b; });
		maxval2 = porc_gen2.reduce(function (a, b) { if (+a > +b) return a; else return b; });
		maxval = +maxval1 > +maxval2 ? maxval1 : maxval2;
		context = document.getElementById('porc-vot-genero').getContext('2d');
		var porcGenChart = new Chart(context).Bar(porcGenData, { multiTooltipTemplate: "<%= value + ' %' %>", animation: false, scaleLabel: "<%= ' ' + value + '%'%>", scaleOverride: true, scaleSteps: 10, scaleStepWidth: (maxval / 10).toFixed(2) });

		$('.charts-wrapper').append("<div class='tit-subclas-votos'>Media de votaciones</div>");
		$('.charts-wrapper').append('<canvas id="med-generos" width="700" height="350"></canvas>');
		var medgenData = {
			labels: Object.keys(obj_generos),
			datasets: [
				{ label: user1, fillColor: 'steelblue', data: media_gen2 },
				{ label: user2, fillColor: '#7BC225', data: media_gen.slice(1) }
			]
		};

		context = document.getElementById('med-generos').getContext('2d');
		var medgenerosChart = new Chart(context).Bar(medgenData, { scaleLabel: "<%= ' ' + value%>", animation: false, scaleOverride: true, scaleSteps: 10, scaleStepWidth: 1 });

		// Paises
		$('.charts-wrapper').append("<div class='tit-clas-votos'>Por países</div>");
		var txtpaises = "";
		txtpaises += "<table id='tb-paises' class='tablesorter'>";
		txtpaises += "<thead><tr><th>País</th><th>Votos " + user1 + "</th><th>Votos " + user2 + "</th><th>Media " + user1 + "</th><th>Media " + user2 + "</th></tr></thead><tbody>";
		var vot1, vot2, med1, med2;
		var showAllC = localStorage.getItem(idprop + "_showAllC") !== null ? eval(localStorage.getItem(idprop + "_showAllC")) : false;

		for (i in countriesCodes) {
			if (obj_paises2[i] !== undefined) {
				vot1 = obj_paises2[i].votos;
				med1 = obj_paises2[i].media;
			} else {
				vot1 = 0;
				med1 = 0.0;
			}

			if (obj_paises[i] !== undefined) {
				vot2 = obj_paises[i].votos;
				med2 = obj_paises[i].media;
			} else {
				vot2 = 0;
				med2 = 0.0;
			}

			if (vot1 + vot2 > 0 || (vot1 + vot2 === 0 && showAllC)) {
				txtpaises += "<tr><td style='text-align: left; padding-left: 25px; background: url(\"http://www.filmaffinity.com/imgs/countries/" + countriesCodes[i] + ".jpg\") no-repeat scroll center left;'>" + i + "</td>";
				txtpaises += "<td>" + vot1 + "</td><td>" + vot2 + "</td><td>" + med1 + "</td><td>" + med2 + "</td></tr>";
			}
		}
		txtpaises += "</tbody></table>";
		$('.charts-wrapper').append(txtpaises);
		$('#tb-paises').css({ 'margin': '0 auto', 'border-collapse': 'collapse' });
		$('#tb-paises th').css({ 'color': 'white', 'background': 'steelblue', 'padding': '8px 15px', 'cursor': 'pointer' });
		$('#tb-paises th').mouseenter(function () { $(this).css('color', 'gold'); }).mouseleave(function () { $(this).css('color', 'white'); });
		$("#tb-paises").tablesorter({ sortList: [[1, 1]], widgets: ["zebra", "columns"] });
		$('#tb-paises tr:nth-child(n+1) td:nth-child(n+2)').css('padding', '6px 0');
		$('#tb-paises tr:nth-child(n+1) td:nth-child(1)').css({ 'font-weight': 'bold', 'border-right': '1px solid #CCC', 'padding-right': '12px' });
		$('#tb-paises tr:nth-child(n+1) td:nth-child(3)').css('border-right', '1px solid #CCC');

		// Años
		$('.charts-wrapper').append("<div class='tit-clas-votos'>Por años</div>");
		$('.charts-wrapper').append("<div class='tit-subclas-votos'>Número de votos (Cine actual)</div>");
		$('.charts-wrapper').append('<canvas id="vot-anios" width="700" height="350"></canvas>');
		var aniosData = {
			labels: Object.keys(obj_anios).slice(0, 18),
			datasets: [
				{ label: user1, fillColor: "rgba(0,0,255,0.05)", strokeColor: 'steelblue', pointColor: 'steelblue', pointStrokeColor: "white", pointHighlightFill: "white", pointHighlightStroke: "steelblue", data: votos_anios2.slice(1, 19).reverse() },
				{ label: user2, fillColor: "rgba(0,255,0,0.05)", strokeColor: '#7BC225', pointColor: "#7BC225", pointStrokeColor: "white", pointHighlightFill: "white", pointHighlightStroke: "green", data: votos_anios.slice(1, 19).reverse() }
			]
		};

		var maxanios1 = votos_anios.slice(1, 19).reduce(function (a, b) { if (+a > +b) return a; else return b; });
		var maxanios2 = votos_anios2.slice(1, 19).reduce(function (a, b) { if (+a > +b) return a; else return b; });
		var maxanios = +maxanios1 > +maxanios2 ? maxanios1 : maxanios2;
		context = document.getElementById('vot-anios').getContext('2d');
		var aniosChart = new Chart(context).Line(aniosData, { scaleLabel: "<%= ' ' + value%>", animation: false, scaleOverride: true, scaleSteps: 10, scaleStepWidth: Math.ceil(maxanios / 10) });

		$('.charts-wrapper').append("<div class='tit-subclas-votos'>Media de votaciones (Cine actual)</div>");
		$('.charts-wrapper').append('<canvas id="med-anios" width="700" height="350"></canvas>');
		var medAniosData = {
			labels: Object.keys(obj_anios).slice(0, 18),
			datasets: [
				{ label: user1, fillColor: "rgba(0,0,255,0.05)", strokeColor: 'steelblue', pointColor: 'steelblue', pointStrokeColor: "white", pointHighlightFill: "white", pointHighlightStroke: "steelblue", data: media_anios2.slice(1, 19).reverse() },
				{ label: user2, fillColor: "rgba(0,255,0,0.05)", strokeColor: '#7BC225', pointColor: "#7BC225", pointStrokeColor: "white", pointHighlightFill: "white", pointHighlightStroke: "green", data: media_anios.slice(1, 19).reverse() }
			]
		};

		context = document.getElementById('med-anios').getContext('2d');
		var medAniosChart = new Chart(context).Line(medAniosData, { scaleLabel: "<%= ' ' + value%>", animation: false, scaleOverride: true, scaleSteps: 10, scaleStepWidth: 1 });

		$('.charts-wrapper').append("<div class='tit-subclas-votos'>Número de votos (Cine clásico y moderno)</div>");
		$('.charts-wrapper').append('<canvas id="vot-anios2" width="700" height="350"></canvas>');
		var aniosData2 = {
			labels: Object.keys(obj_anios).slice(18).reverse(),
			datasets: [
				{ label: user1, fillColor: "rgba(0,0,255,0.05)", strokeColor: 'steelblue', pointColor: 'steelblue', pointStrokeColor: "white", pointHighlightFill: "white", pointHighlightStroke: "steelblue", data: votos_anios2.slice(19).reverse() },
				{ label: user2, fillColor: "rgba(0,255,0,0.05)", strokeColor: '#7BC225', pointColor: "#7BC225", pointStrokeColor: "white", pointHighlightFill: "white", pointHighlightStroke: "green", data: votos_anios.slice(19).reverse() }
			]
		};

		maxanios1 = votos_anios.slice(18).reduce(function (a, b) { if (+a > +b) return a; else return b; });
		maxanios2 = votos_anios2.slice(18).reduce(function (a, b) { if (+a > +b) return a; else return b; });
		maxanios = +maxanios1 > +maxanios2 ? maxanios1 : maxanios2;
		context = document.getElementById('vot-anios2').getContext('2d');
		var aniosChart2 = new Chart(context).Line(aniosData2, { scaleLabel: "<%= ' ' + value%>", animation: false, scaleOverride: true, scaleSteps: 10, scaleStepWidth: Math.ceil(maxanios / 10) });

		$('.charts-wrapper').append("<div class='tit-subclas-votos'>Media de votaciones (Cine clásico y moderno)</div>");
		$('.charts-wrapper').append('<canvas id="med-anios2" width="700" height="350"></canvas>');
		var medAniosData2 = {
			labels: Object.keys(obj_anios).slice(18).reverse(),
			datasets: [
				{ label: user1, fillColor: "rgba(0,0,255,0.05)", strokeColor: 'steelblue', pointColor: 'steelblue', pointStrokeColor: "white", pointHighlightFill: "white", pointHighlightStroke: "steelblue", data: media_anios2.slice(19).reverse() },
				{ label: user2, fillColor: "rgba(0,255,0,0.05)", strokeColor: '#7BC225', pointColor: "#7BC225", pointStrokeColor: "white", pointHighlightFill: "white", pointHighlightStroke: "green", data: media_anios.slice(19).reverse() }
			]
		};

		context = document.getElementById('med-anios2').getContext('2d');
		var medAniosChart2 = new Chart(context).Line(medAniosData2, { scaleLabel: "<%= ' ' + value%>", animation: false, scaleOverride: true, scaleSteps: 10, scaleStepWidth: 1 });

		$('.tit-clas-votos').css({ 'text-align': 'center', 'font-weight': 'bold', 'margin': '20px 0', 'font-size': '22px', 'color': 'steelblue', 'background': 'linear-gradient(to right, steelblue 0%, white 31%, white 67%, steelblue 100%)' });
		$('.tit-subclas-votos').css({ 'text-align': 'center', 'margin': '20px 0', 'font-size': '19px', 'color': '#AAA', 'font-family': 'Verdana' });
		$('.charts-wrapper').css('background', 'white');
		$('.chart-title, .fa-shadow, .userrep-explan').remove();
	});
}

function changeInbox() {

	var msgs = $('.msgcell');

	$('#mt-content-cell > h1').html("Mensajes con <a href='" + $('.imthrecp a').attr('href') + "'>" + $('.imthrecp a strong').html() + "</a> <span style='font-size:14px'> (" + msgs.length + ")</span>");
	$('#mt-content-cell > h1').css({ 'text-align': 'center', 'background-color': 'steelblue', 'padding': '20px', 'color': 'white', 'margin': '0 0 15px' });
	$('#mt-content-cell > h1 a').css('color', 'gold');
	$('#mt-content-cell > h1').next().remove();
	$('#mt-content-cell > h1').next().remove();
	$('.imthrecp').remove();
	$('.imthnav').css({ 'width': 'auto', 'float': 'right', 'padding': '5px 10px 5px 5px' });
	for (var i = 0; i < msgs.length; i++) {
		$(msgs[i]).html($(msgs[i]).html().replace(/sm(\d{3})/g, "<img src=\"http://www.buho21.com/img/software/smiles/sm$1.gif\">"));
	}

	// Quitar el espacio tabulado que hay por defecto al escribir un mensaje
	$('textarea[name="msg"]').val('');

}    