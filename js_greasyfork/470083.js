// ==UserScript==
// @name        The West - westernblumis Toolkit
// @namespace   westernblumi
// @include 	https://*.the-west.*/game.php*
// @author 		westernblumi
// @version     1.08
// @grant       none
// @description Some useful improvements for The West
// @downloadURL https://update.greasyfork.org/scripts/470083/The%20West%20-%20westernblumis%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/470083/The%20West%20-%20westernblumis%20Toolkit.meta.js
// ==/UserScript==
(function (fn) {
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn.toString() + ')();';
  document.body.appendChild(script);
  document.body.removeChild(script);
}) (function () {

	WTKstart = {
      langs: {
        en: {
			language: 'English',
			features: 'Features',
			FeatRemoveTownBlinkEvent: 'Removes flashing from the forum menu item',
			FeatNewStatistics: 'Adds adventure statistics ',
			FeatOpenTrader: 'Opens the mobil traider, when new items are available',
			FeatDailyItemHelper: 'Adds a new button in the side menu for daily quest items',
			FeatAdventureBlockPlayer: 'Enables ignoring other players in adventure',
			save: 'Save',
			saveMessage: 'Settings saved',
			settings: 'Settings',
			ghostTown: 'Ghost town',
			indianVillage: 'Indian village',
			monday: 'Monday',
			tuesday: 'Tuesday',
			wednesday: 'Wednesday',
			thursday: 'Thursday',
			friday: 'Friday',
			saturday: 'Saturday',
			sunday: 'Sunday',
			saloon: 'Saloon',
			shortName: 'WTK',
			dailyItems: 'Products for daily quests',
			showDailyItems: 'Show products for daily quests',
			adventuresPlayed: 'Adventures played',
			adventuresKnockouts: 'Enemys knocked out',
			adventuresMiss: 'Missed shots',
			adventuresDodges: 'Dodged shots',
			adventures: 'Adventures',
			getData: 'Show data',
			updateMessage: 'A new version of the script is available',
			ignore: 'Ignore',
			dontIgnore: 'Don\'t ignore anymore',
			reportOffense: 'Report offense',
			willBeIgnored: 'will be ignored',
			willNotBeIgnored: 'will not be ignored anymore',
			churchLevels: 'Levels',
			FeatChurchLevels: 'Shows how many additional church levels you can build in your town',
			deleteMarkedItems: 'Delete marked items',
			youHaveFound: 'You have found following item:',
			itemFinder: 'Item Finder',
			FeatWindowPin: 'Opens nearly all windows at a defined position',
			setPosition: 'Set position',
			progress: 'Progress',
			progressTooltip: 'The progress shows how far your town is with the building of the current building stage',
			FeatFormattedRankings: 'Formats ranking data and shows the different to better players',
			FeatShowFort: 'Links the report of a fortbattle declaration to a certain fort instead of the fortbattle overview window',
			FeatBuildingProgress: 'Show the construction progress in a building window',
			FeatImprovedBuildCityhall: 'Show only buildings that have not been fully built',
			searchItem: 'Search Item',
			search: 'Search',
			whatItemsWouldYouLikeToSearchFor: 'What items would you like to search for?',
			howManyOfThemWouldYouLikeToCollect: 'How many of these do you want to collect?',
			nameOfTheItem: 'Name of the item:',
			numberOfItems: 'Number of items:',
			searchResult: 'Search result',
			itemAmountMustBeHigherThan0: 'The number of items must be greater than 0!',
			nameCannotBeEmpty: 'The name must not be empty!',
			emptySearchResult: 'Sorry, your search does not return any results. Please check your input. Maybe the item is already on your list!',
			thereAreMoreItems: 'The search yielded more results.',
			restrictYourSearch: 'Narrow the search to get more precise results.',
			help: 'Help',
			back: 'Go back',
			itemFinderHelpContent: '<b>Add:</b><ol style="padding-inline-start: 40px;"><li>Click on <b>Search Item</b>. This will open the search dialog<br></li><li>Enter the name of the item you want to search for.<br>Please enter how many of them you want to search. Click on <b>Search</b></li><li>A dialog with the search results opens</li><li>Click on the item you want to add to your list</li></ol><br><b>Delete:</b><ol style="padding-inline-start: 40px;"><li>Click on an item. The item will then become transparent</li><li>Click on <b>Delete marked items</b> to delete the selected items</li></ol><br><b>Enable alarm:</b><ol style="padding-inline-start: 40px;"><li>Click on the lower area with the number of items you are looking for</li><li>The area gets a yellow frame, the alarm is activated<br>and you will be notified as soon as the item you are looking for is found</li><li>Click on the area again and the frame and the alarm will be removed again</li></ol>',
			FeatExtendedBBCodes: 'Show correct BB-codes for color, size and images also in profiles, telegrams and notes. This will work only for people who have the script installed. All other player will still see these "wrong" codes'
        },
		de: {
			language: 'German (Deutsch)',
			features: 'Features',
			FeatRemoveTownBlinkEvent: 'Entfernt das Blinken des Stadtforums im Menü',
			FeatNewStatistics: 'Fügt Abenteuer Statistiken hinzu',
			FeatOpenTrader: 'Öffnet den fahrenden Händler, wenn neue Items verfügbar sind',
			FeatDailyItemHelper: 'Fügt im Seitenmenü einen Button für tägliche Questprodukte hinzu',
			FeatAdventureBlockPlayer: 'Erlaubt das Ignorieren von anderen Spielern im Abenteuer',
			save: 'Speichern',
			saveMessage: 'Erfolgreich gespeichert',
			settings: 'Einstellungen',
			ghostTown: 'Geisterstadt',
			indianVillage: 'Indianerdorf',
			monday: 'Montag',
			tuesday: 'Dienstag',
			wednesday: 'Mittwoch',
			thursday: 'Donnerstag',
			friday: 'Freitag',
			saturday: 'Samstag',
			sunday: 'Sonntag',
			saloon: 'Saloon',
			shortName: 'WTK',
			dailyItems: 'Produkte für tägliche Quests',
			showDailyItems: 'Zeige Produkte für tägliche Quests',
			adventuresPlayed: 'Abenteuer absolviert',
			adventuresKnockouts: 'Im Abenteuer KO geschossen',
			adventuresMiss: 'Fehlschüsse',
			adventuresDodges: 'Ausweicher',
			adventures: 'Abenteuer',
			getData: 'Daten anzeigen',
			updateMessage: 'Eine neue Version des Skriptes ist jetzt verfügbar',
			ignore: 'Ignorieren',
			dontIgnore: 'Nicht mehr ignorieren',
			reportOffense: 'Verstoß melden',
			willBeIgnored: 'wird jetzt ignoriert',
			willNotBeIgnored: 'wird jetzt nicht mehr ignoriert',
			churchLevels: 'Stufen',
			FeatChurchLevels: 'Zeigt an, wie viele Kirchenstufen man noch bauen kann',
			deleteMarkedItems: 'Markierte Items löschen',
			youHaveFound: 'Du hast folgenden Gegenstand gefunden:',
			itemFinder: 'Item Finder',
			FeatWindowPin: 'Öffnet die Fenster immer an einer bestimmten Stelle',
			setPosition: 'Position setzen',
			progress: 'Fortschritt',
			progressTooltip: 'Der Fortschritt gibt an, wie weit die Stufe des Gebäudes schon ausgebaut ist.',
			FeatFormattedRankings: 'Formatiert die Daten in der Rangliste und zeigt als Tooltip die Differenz zum besser plazierten Spieler',
			FeatShowFort: 'Verlinke im Bericht einer Fortmapfankündigung das konkrete Fort anstatt nur die Fortkampf Übersicht',
			FeatBuildingProgress: 'Zeige im Ausbaufenster auch den Baufortschritt',
			FeatImprovedBuildCityhall: 'Zeige nur Gebäude die noch ausgebaut werden können',
			searchItem: 'Item suchen',
			search: 'Suchen',
			whatItemsWouldYouLikeToSearchFor: 'Nach welchen Gegenständen möchtest du suchen?',
			howManyOfThemWouldYouLikeToCollect: 'Wie viele davon möchtest du sammeln?',
			nameOfTheItem: 'Name des Gegenstandes:',
			numberOfItems: 'Anzahl der Gegenstände:',
			searchResult: 'Suchergebnis',
			itemAmountMustBeHigherThan0: 'Die Anzahl der Gegenstände muss größer als 0 sein!',
			nameCannotBeEmpty: 'Der Name darf nicht leer sein!',
			emptySearchResult: 'Deine Suche liefert leider keine Ergebnisse. Überprüfe bitte deine Eingabe. Vielleicht ist der Gegenstand auch schon auf deiner Liste!',
			thereAreMoreItems: 'Die Suche lieferte mehr Ergebnisse.',
			restrictYourSearch: 'Schränke die Suche ein, um genauere Ergebnisse zu erhalten.',
			help: 'Hilfe',
			back: 'Zurück',
			itemFinderHelpContent: '<b>Hinzufügen:</b><ol style="padding-inline-start: 40px;"><li>Klick auf <b>Item suchen</b>. Daraufhin öffnet sich der Such-Dialog</li><li>Gib den Namen des Items an, das du suchen möchtest.<br>Trage ein, wie viele davon du suchen möchtest. Klick auf <b>Suchen</b></li><li>Ein Dialog mit den Suchergebnissen öffnet sich</li><li>Klick auf das Item, das du deiner Liste hinzufügen möchtest</li></ol><br><b>Löschen:</b><ol style="padding-inline-start: 40px;"><li>Klick auf ein Item. Das Item wird daraufhin transparent</li><li>Klick auf <b>Markierte Items löschen</b>, um die markierten Elemente zu löschen</li></ol><br><b>Alarm einschalten:</b><ol style="padding-inline-start: 40px;"><li>Klick auf den unteren Bereich mit der Anzahl der gesuchten Items</li><li>Der Bereich erhält einen gelben Rahmen, der Alarm ist somit aktiviert<br>und du wirst benachrichtigt, sobald das gesuchte Item gefunden wurde</li><li>Klickst du nochmal auf den Bereich wird der Rahmen und der Alarm wieder entfernt</li></ol>',
			FeatExtendedBBCodes: 'Zeige BB-Codes für Farbe, Größe und Bilder auch in Profilen, Telegrammen und Notizen richtig an. Das ganze funktioniert nur für Spieler, die das Skript auch installiert haben. Alle anderen sehen weiterhin die "falschen" Codes'
		},
		pl: {
			language: 'Polish',
			features: 'Funkcje',
			FeatRemoveTownBlinkEvent: 'Usuń migające okna z menu',
			FeatNewStatistics: 'Dodaj Przygody do statystyk',
			FeatOpenTrader: ' Otwórz wędrownego handlarza, gdy są dostępne nowe przedmioty',
			FeatDailyItemHelper: 'Doda dodatkowy przycisk w menu, odpowiedzialny za dzienne zadania',
			FeatAdventureBlockPlayer: 'Enables ignoring other players in adventure',
			save: 'Zapisz',
			saveMessage: 'Zapisano',
			settings: 'Opcje',
			ghostTown: 'Miasto Widmo',
			indianVillage: 'Wioska Indiańska Waupee',
			monday: 'Poniedziałek',
			tuesday: 'Wtorek',
			wednesday: 'Środa',
			thursday: 'Czwartek',
			friday: 'Piątek',
			saturday: 'Sobota',
			sunday: 'Niedziela',
			saloon: 'Saloon',
			shortName: 'WTK',
			dailyItems: 'Produkty do dziennych zadań',
			showDailyItems: 'Pokaż produkty do dziennych zadań',
			adventuresPlayed: 'Rozegrane przygody',
			adventuresKnockouts: 'Omdleni przeciwnicy',
			adventuresMiss: 'Nietrafione strzały',
			adventuresDodges: 'Trafione strzały',
			adventures: 'Przygody',
			getData: 'Pokaż dane',
			updateMessage: 'Nowa wersja skryptu jest dostępna',
			ignore: 'Ignore',
			dontIgnore: 'Don\'t ignore anymore',
			reportOffense: 'Report offense',
			willBeIgnored: 'will be ignored',
			willNotBeIgnored: 'will not be ignored anymore',
			churchLevels: 'Levels',
			FeatChurchLevels: 'Shows how many additional church levels you can build in your town',
			deleteMarkedItems: 'Delete marked items',
			youHaveFound: 'You have found following item:',
			itemFinder: 'Item Finder',
			FeatWindowPin: 'Opens nearly all windows at a defined position',
			setPosition: 'Set position',
			progress: 'Progress',
			progressTooltip: 'The progress shows how far your town is with the building of the current building stage',
			FeatFormattedRankings: 'Formats ranking data and shows the different to better players',
			FeatShowFort: 'Links the report of a fortbattle declaration to a certain fort instead of the fortbattle overview window',
			FeatBuildingProgress: 'Show the construction progress in a building window',
			FeatImprovedBuildCityhall: 'Show only buildings that have not been fully built',
			searchItem: 'Search Item',
			search: 'Search',
			whatItemsWouldYouLikeToSearchFor: 'What items would you like to search for?',
			howManyOfThemWouldYouLikeToCollect: 'How many of these do you want to collect?',
			nameOfTheItem: 'Name of the item:',
			numberOfItems: 'Number of items:',
			searchResult: 'Search result',
			itemAmountMustBeHigherThan0: 'The number of items must be greater than 0!',
			nameCannotBeEmpty: 'The name must not be empty!',
			emptySearchResult: 'Sorry, your search does not return any results. Please check your input. Maybe the item is already on your list!',
			thereAreMoreItems: 'The search yielded more results.',
			restrictYourSearch: 'Narrow the search to get more precise results.',
			help: 'Help',
			back: 'Go back',
			itemFinderHelpContent: '<b>Add:</b><ol style="padding-inline-start: 40px;"><li>Click on <b>Search Item</b>. This will open the search dialog<br></li><li>Enter the name of the item you want to search for.<br>Please enter how many of them you want to search. Click on <b>Search</b></li><li>A dialog with the search results opens</li><li>Click on the item you want to add to your list</li></ol><br><b>Delete:</b><ol style="padding-inline-start: 40px;"><li>Click on an item. The item will then become transparent</li><li>Click on <b>Delete marked items</b> to delete the selected items</li></ol><br><b>Enable alarm:</b><ol style="padding-inline-start: 40px;"><li>Click on the lower area with the number of items you are looking for</li><li>The area gets a yellow frame, the alarm is activated<br>and you will be notified as soon as the item you are looking for is found</li><li>Click on the area again and the frame and the alarm will be removed again</li></ol>',
			FeatExtendedBBCodes: 'Show correct BB-codes for color, size and images also in profiles, telegrams and notes. This will work only for people who have the script installed. All other player will still see these "wrong" codes'
        },
		es: {
			language: 'Spanish',
			features: 'Funciones',
			FeatRemoveTownBlinkEvent: 'Elimina parpadeo del elemento del menú del foro',
			FeatNewStatistics: 'Agrega estadísticas de aventuras',
			FeatOpenTrader: 'Abre el vendedor ambulante, cuando hay nuevos artículos disponibles',
			FeatDailyItemHelper: 'Agrega un nuevo botón en el menú lateral para los artículos de búsqeudas diarias',
			FeatAdventureBlockPlayer: 'Permite ignorar a otros jugadores en la aventura',
			save: 'Guardar',
			saveMessage: 'Ajustes guardados',
			settings: 'Ajustes',
			ghostTown: 'Ciudad fantasma',
			indianVillage: 'Pueblo indio',
			monday: 'Lunes',
			tuesday: 'Martes',
			wednesday: 'Miércoles',
			thursday: 'Jueves',
			friday: 'Viernes',
			saturday: 'Sábado',
			sunday: 'Domingo',
			saloon: 'Salón',
			shortName: 'WTK',
			dailyItems: 'Productos para búsquedas diarias',
			showDailyItems: 'Mostrar productos para búsquedas diarias',
			adventuresPlayed: 'Aventuras jugadas',
			adventuresKnockouts: 'Enemigos desmayados',
			adventuresMiss: 'Tiros fallados',
			adventuresDodges: 'Tiros eludidos',
			adventures: 'Aventuras',
			getData: 'Mostrar datos',
			updateMessage: 'Una nueva versión del script está disponible',
			ignore: 'Ignorar',
			dontIgnore: 'No ignorar más',
			reportOffense: 'Informar insulto',
			willBeIgnored: 'será ignorado',
			willNotBeIgnored: 'ya no será ignorado',
			churchLevels: 'Niveles',
			FeatChurchLevels: 'Muestra cuántos niveles adicionales de la Iglesia puede construir en su ciudad',
			deleteMarkedItems: 'Borrar artículos marcados',
			youHaveFound: 'Has encontrado el siguiente artículo:',
			itemFinder: 'Buscador artículos',
			FeatWindowPin: 'Abrir casi todas las ventanas en una posición definida',
			setPosition: 'Fijar posición',
			progress: 'Progreso',
			progressTooltip: 'El progreso muestra en qué punto está la construcción de su ciudad con respecto al actual estado de la construcción',
			FeatFormattedRankings: 'Formatea los datos de clasificación y muestra las diferencias de los mejores jugadores ',
			FeatShowFort: 'Enlaza al informe de una declaración de batalla de un determinado fuerte en lugar de a la ventana resumen ',
			FeatBuildingProgress: 'Muestra el progreso de construcción en la ventana del edificio',
			FeatImprovedBuildCityhall: 'Muestra solo los edificios que no están completamente construidos',
			searchItem: 'Buscar artículo',
			search: 'Buscar',
			whatItemsWouldYouLikeToSearchFor: '¿Qué artículos te gustaría buscar?',
			howManyOfThemWouldYouLikeToCollect: '¿Cuántos de ellos quieres coleccionar?',
			nameOfTheItem: 'Nombre del artículo:',
			numberOfItems: 'Número de artículos:',
			searchResult: 'Resultado búsqueda',
			itemAmountMustBeHigherThan0: '¡El número de artículos debe ser mayor que 0!',
			nameCannotBeEmpty: '¡El nombre no debe estar vacío!',
			emptySearchResult: 'Lo siento, su búsqueda no devuelve ningún resultado. Verifique su entrada. ¡Quizás el artículo ya está en tu lista!',
			thereAreMoreItems: 'La búsqueda arrojó más resultados.',
			restrictYourSearch: 'Limite la búsqueda para obtener resultados más precisos.',
			help: 'Ayuda',
			back: 'Volver',
			itemFinderHelpContent: '<b>Añadir:</b><ol style="padding-inline-start: 40px;"><li>Haga clic en <b>Buscar Artículo</b>. Esto abrirá el cuadro de dialógo de búsqueda<br></li><li>Introduzca el nombre del artículo que desea buscar.<br>Introduzca cuántos de ellos desea buscar. Haga clic en <b>Buscar</b></li><li>Se abre un cuadro de diálogo con los resultados de la búsqueda</li><li>Haga clic en el artículo que desea agregar a su lista</li></ol><br><b>Borrar:</b><ol style="padding-inline-start: 40px;"><li>Haga clic en un artículo. El artículo se volverá transparente</li><li>Haga clic en <b>Borrar artículos marcados</b> para eliminar los artículos seleccionados</li></ol><br><b>Activar alarma:</b><ol style="padding-inline-start: 40px;"><li>Haga clic en el área inferior con el número de artículos que está buscando</li><li>El área recibe un marco amarillo, la alarma se activa<br>y se le notificará tan pronto como el artículo que esté buscando se encuentre</li><li>Haga clic nuevamente en el área, y el marco y la alarma serán eliminados otra vez</li></ol>',
			FeatExtendedBBCodes: 'Muestra los códigos BB correctos para el color, el tamaño y las imágenes también en perfiles, telegramas y notas. Esto funcionará solo para las personas que tienen el guión instalado. El resto de jugadores aún verán "incorrectos" codigos'
        },
      }
    };

	WTK = {
		version: '1.08',
		name: 'The West - westernblumis Toolkit',
        author: 'westernblumi',
		website: 'https://greasyfork.org/de/scripts/29596-the-west-westernblumis-toolkit',
		updateUrl: 'https://raw.githack.com/westernblumi/thewest/master/skriptUpdater.js',
        Data: {},
        loaded: [],
		Features: {
			RemoveTownBlinkEvent: false,
			NewStatistics: true,
			OpenTrader: false,
			DailyItemHelper: true,
			AdventureBlockPlayer: true,
			ChurchLevels: true,
			FormattedRankings: true,
			WindowPin: false,
			ShowFort: true,
			BuildingProgress: true,
			ImprovedBuildCityhall: true,
			ExtendedBBCodes: true,
        },
		Images: {
			menudailyitems: 'data:image/jpeg;base64,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',
			menu: 'data:image/jpeg;base64,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',
		},
		updateLang: function () {
			var languages = WTKstart.langs;
			WTK.lang = languages[Game.locale.substr(0, 2)] ? Game.locale.substr(0, 2)  : 'en';
			WTKlang = languages[WTK.lang];
        },
	};
	WTK.updateLang();
    WTK.Skript = {
        init: function () {
			var menuContainer = $('<div class="menulink" onclick="WTK.GUI.openMenu();" title="' + WTK.name + '" />').css('background-image', 'url(' + WTK.Images.menu + ')').css('background-position', '0px 0px').mouseenter(function () {
				$(this).css('background-position', '-25px 0px');
			}).mouseleave(function () {
				$(this).css('background-position', '0px 0px');
			});
			$('#ui_menubar').append($('<div id="WTK_menubutton" class="ui_menucontainer" />').append(menuContainer).append('<div class="menucontainer_bottom" />'));

			var styling = $('<style></style>').text(
				'.WTK_find_notifcation {position: absolute;width: 51px;color: #fff;min-width: 23px;line-height: 12px;font-size: 10px;bottom: 3px;left: 2px;text-align: center;background: rgba(127, 111, 85, 0.7);border-radius: 0 2px 0 2px;box-shadow: 0px -1px 2px #000000;font-weight: bold;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;padding: 0 2px;opacity: 1;}' +
				'.WTK_find_notifcation_highlight {border: 2px;border-color: yellow;border-style: solid;width: 48px;}' +
				'.WTK_item_border {border: transparent;border-style: solid;border-width: 2px;border-radius: 5px;}' +
				'.WTK_item_border_green {border: green;border-style: solid;border-width: 2px;border-radius: 5px;}'
			);
			$('head').append(styling);

			WTK.Skript.updateFeat();
        },
        updateFeat: function () {
			var saved = localStorage.getItem('WTKFeaturestest');
			WTK.Data = saved && saved.indexOf('{') === 0 && JSON.parse(saved) || {};
			for (var k in WTK.Features) {
				if (WTK.Skript.getFeature(k) && !WTK.loaded.includes(k)) {
				  try {
					WTK.loaded.push(k);
					WTK[k].init();
				  } catch (e) {}
				}
			}
			WTK.ExtendedItemFinder.init();
        },
        getFeature: function (name) {
          return (WTK.Data[name] !== undefined) ? WTK.Data[name] : WTK.Features[name];
        },
    };

	WTK.GUI = {
		openMenu: function () {
			WTK.GUI.open();
			WTK.GUI.openSettings();
        },
		window: {},
        checkbox: {},
		open: function () {
			WTK.GUI.window = wman.open('WTKMenuWindow', WTK.name, 'noreload').setMiniTitle(WTKlang.shortName).setMaxSize(1268, 838);
			WTK.GUI.window.addTab(WTKlang.settings, 'WTKSettingsTab', WTK.GUI.openSettings);
			WTK.GUI.window.addTab(WTKlang.dailyItems, 'WTKDailyItemsTab', WTK.DailyItemHelper.showDailyItems);
			WTK.GUI.window.addTab(WTKlang.itemFinder, 'WTKExtendedItemFinder', WTK.ExtendedItemFinder.showExtendedItemFinder);
        },
        getDefault: function (tab) {
			WTK.GUI.window.setResizeable(false).setSize(770, 490).clearContentPane().removeClass('nocloseall').setTitle(WTK.name);
			WTK.GUI.window.dontCloseAll = false;
			$(WTK.GUI.window.getContentPane()).css('margin-top', '10px');
			var wnd = WTK.GUI.window.getMainDiv();
			$('.textart_title', wnd).css('display', '');
			WTK.GUI.window.activateTab(tab);
        },
		openSettings: function () {
			WTK.GUI.getDefault('WTKSettingsTab');

			var featScroll = new west.gui.Scrollpane();

			featScroll.appendContent('<h2>' + WTKlang.features + '</h2>');
			for (var k in WTK.Features) {
				WTK.GUI.checkbox[k] = new west.gui.Checkbox().setLabel(WTKlang['Feat' + k]).setSelected(WTK.Skript.getFeature(k)).appendTo(featScroll.getContentPane());
				if(k == 'WindowPin'){
					var button = new west.gui.Button(WTKlang.setPosition, function () {
						WTK.WindowPin.getNewPinPosition();
					});
					featScroll.appendContent(button.getMainDiv());
				}
				featScroll.appendContent('<br><div style="height:5px;" />');
			}
			featScroll.appendContent('<br>');
			$(featScroll.getMainDiv()).css({
				'height': '310px',
				'margin-bottom': '10px',
			});
			var button = new west.gui.Button(WTKlang.save, function () {
				for (var k in WTK.GUI.checkbox) {
					WTK.Data[k] = WTK.GUI.checkbox[k].isSelected();
				}
				localStorage.setItem('WTKFeaturestest', JSON.stringify(WTK.Data));
				WTK.Skript.updateFeat();
				new UserMessage(WTKlang.saveMessage, 'success').show();
            });
			$(WTK.GUI.window.getContentPane()).append(featScroll.getMainDiv()).append(button.getMainDiv());
        },
	};

	WTK.RemoveTownBlinkEvent = {
        init: function () {
			setTimeout((function () {
				$('div.city > div.city').removeClass('dock-highlight');
            }), 1000);
			//The West Menu
			setTimeout((function () {
				$('#TWM_bottombar div.city > div.Stadt').removeClass('TWM_highlight');
            }), 1000);
        },
    };

	WTK.NewStatistics = {
        init: function () {
			AchievementStatistic.backup_init = AchievementStatistic.init;
			AchievementStatistic.init = function(){
				if(this.playerid == Character.playerId){
					var that=this;
					Ajax.remoteCall('achievement','get_statistic',{
						playerid:this.playerid
					},function(json){
						var table=new west.gui.Table().addColumn('desc').addColumn('value').appendToCell('head','desc').appendToCell('head','value');
						var i=0;
						$.each(json.stats,function(k,v){
							if(i!=0)
								table.appendRow();
							table.appendRow($('<h2>'+k+'</h2>'));
							$.each(v,function(kk,vv){
								table.appendRow().appendToCell(-1,'desc',kk).appendToCell(-1,'value',format_number(vv));
							});
							i++;
						});
						button = new west.gui.Button(WTKlang.getData, WTK.NewStatistics.getDataAdventuresDodges);
						table.appendRow().appendToCell(-1,'desc',WTKlang.adventuresDodges).appendToCell(-1,'value',button.getMainDiv());
						button = new west.gui.Button(WTKlang.getData, WTK.NewStatistics.getDataAdventuresMiss);
						table.appendRow().appendToCell(-1,'desc',WTKlang.adventuresMiss).appendToCell(-1,'value',button.getMainDiv());

						that.window.$('div.achievement-statistic',AchievementWindow.DOM).empty();
						table.appendTo(that.window.$('div.achievement-statistic',AchievementWindow.DOM));
					},this);
				} else {
					AchievementStatistic.backup_init.call(this);
				}
				return this;
			};
        },

		getDataAdventuresMiss: function () {
			Ajax.remoteCall('achievement','track',{achvid: 60031}, function(json)
			{
				if(!json.error){
					MessageSuccess(WTKlang.adventuresMiss + ': ' + json.current).show();
				}
				Ajax.remoteCall('achievement','untrack',{}, function(json){});
			});


		},

		getDataAdventuresDodges: function () {
			Ajax.remoteCall('achievement','track',{achvid: 60028}, function(json)
			{
				if(!json.error){
					MessageSuccess(WTKlang.adventuresDodges + ': ' + json.current).show();
				}
				Ajax.remoteCall('achievement','untrack',{}, function(json){});
			});


		},
    };

	WTK.OpenTrader = {
        init: function () {
			setTimeout((function () {
				setInterval(WTK.OpenTrader.checkTrader, 10000);
            }), 10000);

        },
		checkTrader: function(){
			if(WTK.OpenTrader.TraderTime == undefined){
				Ajax.remoteCallMode('shop_trader', 'index', {}, function (response) {
					WTK.OpenTrader.TraderTime = response.traderTime;
					if((WTK.OpenTrader.TraderTime -(new Date()).getTime() / 1000) > 86385) {
						west.window.shop.open('wear_window').showCategory('trader');
						Character.setToRead('trader', false);
					}
				});
			}
			if(Math.round((new Date()).getTime() / 1000) > WTK.OpenTrader.TraderTime){
				Ajax.remoteCallMode('shop_trader', 'index', {}, function (response) {
					WTK.OpenTrader.TraderTime = response.traderTime;
				});
				west.window.shop.open('wear_window').showCategory('trader');
				Character.setToRead('trader', false);
			}
		},
    };

	WTK.DailyItemHelper = {

		ghostTown: [
			{minLevel: 21, maxLevel: 50, amount: 1, profession: 100, itemID: 715000},
			{minLevel: 27, maxLevel: 60, amount: 1, profession: 100, itemID: 760000},
			{minLevel: 28, maxLevel: 60, amount: 1, profession: 100, itemID: 759000},
			{minLevel: 37, maxLevel: 70, amount: 1, profession: 100, itemID: 792000},
			{minLevel: 62, maxLevel: 100, amount: 1, profession: 100, itemID: 794000},
			{minLevel: 73, maxLevel: 250, amount: 1, profession: 100, itemID: 1817000},
			{minLevel: 80, maxLevel: 250, amount: 1, profession: 100, itemID: 1819000},
			{minLevel: 120, maxLevel: 250, amount: 4, profession: 100, itemID: 2442000},
		],
		indianVillage: [
			{minLevel: 13, maxLevel: 40, amount: 1, profession: 100, itemID: 714000},
			{minLevel: 34, maxLevel: 60, amount: 1, profession: 100, itemID: 718000},
			{minLevel: 41, maxLevel: 70, amount: 1, profession: 100, itemID: 724000},
			{minLevel: 50, maxLevel: 80, amount: 1, profession: 100, itemID: 1812000},
			{minLevel: 56, maxLevel: 80, amount: 1, profession: 100, itemID: 1813000},
			{minLevel: 63, maxLevel: 100, amount: 1, profession: 100, itemID: 1708000},
			{minLevel: 71, maxLevel: 250, amount: 1, profession: 100, itemID: 780000},
			{minLevel: 90, maxLevel: 250, amount: 1, profession: 100, itemID: 1821000},
			{minLevel: 100, maxLevel: 250, amount: 1, profession: 100, itemID: 1826000},
			{minLevel: 120, maxLevel: 250, amount: 1, profession: 100, itemID: 2441000},
		],
		daily: {
			sunday: [
				{minLevel: 13, maxLevel: 47, amount: 1, profession: 100, itemID: 716000},
				{minLevel: 15, maxLevel: 43, amount: 1, profession: 100, itemID: 742000},
				{minLevel: 17, maxLevel: 51, amount: 1, profession: 100, itemID: 720000},
				{minLevel: 37, maxLevel: 80, amount: 1, profession: 100, itemID: 792000},
				{minLevel: 48, maxLevel: 80, amount: 1, profession: 100, itemID: 719000},
				{minLevel: 52, maxLevel: 69, amount: 1, profession: 100, itemID: 768000},
				{minLevel: 81, maxLevel: 250, amount: 1, profession: 100, itemID: 1708000},
				{minLevel: 81, maxLevel: 250, amount: 1, profession: 100, itemID: 751000},
				{minLevel: 120, maxLevel: 250, amount: 5, profession: 100, itemID: 2447000},
				{minLevel: 120, maxLevel: 250, amount: 1, profession: 100, itemID: 2430000},
				{minLevel: 151, maxLevel: 199, amount: 1, profession: 100, itemID: 52937000},
				{minLevel: 151, maxLevel: 199, amount: 5, profession: 100, itemID: 52949000},
				{minLevel: 151, maxLevel: 199, amount: 1, profession: 100, itemID: 52933000},
				{minLevel: 151, maxLevel: 199, amount: 3, profession: 100, itemID: 52963000},
				{minLevel: 151, maxLevel: 199, amount: 1, profession: 100, itemID: 52932000},
				{minLevel: 200, maxLevel: 250, amount: 1, profession: 100, itemID: 52960000},
				{minLevel: 200, maxLevel: 250, amount: 2, profession: 100, itemID: 52970000},
			],
			monday: [
				{minLevel: 5, maxLevel: 46, amount: 1, profession: 100, itemID: 702000},
				{minLevel: 26, maxLevel: 40, amount: 1, profession: 100, itemID: 761000},
				{minLevel: 27, maxLevel: 36, amount: 1, profession: 100, itemID: 760000},
				{minLevel: 38, maxLevel: 64, amount: 1, profession: 100, itemID: 792000},
				{minLevel: 65, maxLevel: 250, amount: 1, profession: 100, itemID: 1814000},
				{minLevel: 71, maxLevel: 250, amount: 1, profession: 100, itemID: 780000},
				{minLevel: 120, maxLevel: 250, amount: 1, profession: 100, itemID: 2444000},
				{minLevel: 151, maxLevel: 199, amount: 2, profession: 100, itemID: 52936000},
				{minLevel: 151, maxLevel: 199, amount: 2, profession: 100, itemID: 52942000},
				{minLevel: 151, maxLevel: 199, amount: 4, profession: 100, itemID: 52965000},
				{minLevel: 151, maxLevel: 199, amount: 2, profession: 100, itemID: 52957000},
				{minLevel: 151, maxLevel: 199, amount: 1, profession: 100, itemID: 52967000},
				{minLevel: 200, maxLevel: 250, amount: 1, profession: 100, itemID: 52969000},
				{minLevel: 200, maxLevel: 250, amount: 2, profession: 100, itemID: 52972000},
			],
			tuesday: [
				{minLevel: 11, maxLevel: 57, amount: 1, profession: 100, itemID: 766000},
				{minLevel: 45, maxLevel: 80, amount: 1, profession: 100, itemID: 778000},
				{minLevel: 81, maxLevel: 250, amount: 1, profession: 100, itemID: 1818000},
				{minLevel: 81, maxLevel: 250, amount: 1, profession: 100, itemID: 756000},
				{minLevel: 120, maxLevel: 250, amount: 5, profession: 100, itemID: 2456000},
				{minLevel: 120, maxLevel: 250, amount: 2, profession: 100, itemID: 2450000},
				{minLevel: 151, maxLevel: 199, amount: 1, profession: 100, itemID: 52941000},
				{minLevel: 151, maxLevel: 199, amount: 2, profession: 100, itemID: 52947000},
				{minLevel: 151, maxLevel: 199, amount: 1, profession: 100, itemID: 52935000},
				{minLevel: 151, maxLevel: 199, amount: 1, profession: 100, itemID: 52944000},
				{minLevel: 200, maxLevel: 250, amount: 1, profession: 100, itemID: 52956000},
				{minLevel: 200, maxLevel: 250, amount: 6, profession: 100, itemID: 52962000},
			],
			wednesday: [
				{minLevel: 4, maxLevel: 67, amount: 1, profession: 100, itemID: 700000},
				{minLevel: 15, maxLevel: 49, amount: 1, profession: 100, itemID: 791000},
				{minLevel: 18, maxLevel: 49, amount: 1, profession: 100, itemID: 767000},
				{minLevel: 48, maxLevel: 79, amount: 1, profession: 100, itemID: 1812000},
				{minLevel: 120, maxLevel: 250, amount: 1, profession: 100, itemID: 2434000},
				{minLevel: 120, maxLevel: 250, amount: 1, profession: 100, itemID: 2449000},
				{minLevel: 151, maxLevel: 199, amount: 1, profession: 100, itemID: 52939000},
				{minLevel: 151, maxLevel: 199, amount: 3, profession: 100, itemID: 52950000},
				{minLevel: 151, maxLevel: 199, amount: 1, profession: 100, itemID: 52952000},
				{minLevel: 151, maxLevel: 199, amount: 4, profession: 100, itemID: 52968000},
				{minLevel: 200, maxLevel: 250, amount: 2, profession: 100, itemID: 52971000},
				{minLevel: 200, maxLevel: 250, amount: 7, profession: 100, itemID: 52975000},
			],
			thursday: [
				{minLevel: 8, maxLevel: 56, amount: 1, profession: 100, itemID: 708000},
				{minLevel: 28, maxLevel: 58, amount: 1, profession: 100, itemID: 759000},
				{minLevel: 59, maxLevel: 74, amount: 1, profession: 100, itemID: 752000},
				{minLevel: 63, maxLevel: 87, amount: 1, profession: 100, itemID: 1708000},
				{minLevel: 75, maxLevel: 250, amount: 1, profession: 100, itemID: 730000},
				{minLevel: 120, maxLevel: 250, amount: 3, profession: 100, itemID: 2433000},
				{minLevel: 151, maxLevel: 199, amount: 1, profession: 100, itemID: 52943000},
				{minLevel: 151, maxLevel: 199, amount: 5, profession: 100, itemID: 52953000},
				{minLevel: 151, maxLevel: 199, amount: 2, profession: 100, itemID: 52945000},
				{minLevel: 151, maxLevel: 199, amount: 3, profession: 100, itemID: 52954000},
				{minLevel: 200, maxLevel: 250, amount: 1, profession: 100, itemID: 52961000},
				{minLevel: 200, maxLevel: 250, amount: 3, profession: 100, itemID: 52966000},
			],
			friday: [
				{minLevel: 3, maxLevel: 61, amount: 1, profession: 100, itemID: 705000},
				{minLevel: 21, maxLevel: 42, amount: 1, profession: 100, itemID: 715000},
				{minLevel: 42, maxLevel: 75, amount: 1, profession: 100, itemID: 1811000},
				{minLevel: 62, maxLevel: 88, amount: 1, profession: 100, itemID: 794000},
				{minLevel: 89, maxLevel: 250, amount: 1, profession: 100, itemID: 1824000},
				{minLevel: 120, maxLevel: 250, amount: 1, profession: 100, itemID: 2451000},
				{minLevel: 120, maxLevel: 250, amount: 2, profession: 100, itemID: 2453000},
				{minLevel: 151, maxLevel: 199, amount: 2, profession: 100, itemID: 52940000},
				{minLevel: 151, maxLevel: 199, amount: 2, profession: 100, itemID: 52955000},
				{minLevel: 151, maxLevel: 199, amount: 1, profession: 100, itemID: 52938000},
				{minLevel: 151, maxLevel: 199, amount: 5, profession: 100, itemID: 52946000},
				{minLevel: 200, maxLevel: 250, amount: 10, profession: 100, itemID: 52959000},
				{minLevel: 200, maxLevel: 250, amount: 1, profession: 100, itemID: 52973000},
			],
			saturday: [
				{minLevel: 5, maxLevel: 41, amount: 1, profession: 100, itemID: 707000},
				{minLevel: 5, maxLevel: 51, amount: 1, profession: 100, itemID: 1807000},
				{minLevel: 35, maxLevel: 53, amount: 1, profession: 100, itemID: 737000},
				{minLevel: 42, maxLevel: 75, amount: 1, profession: 100, itemID: 725000},
				{minLevel: 52, maxLevel: 77, amount: 1, profession: 100, itemID: 768000},
				{minLevel: 76, maxLevel: 250, amount: 1, profession: 100, itemID: 1756000},
				{minLevel: 78, maxLevel: 250, amount: 1, profession: 100, itemID: 1819000},
				{minLevel: 79, maxLevel: 250, amount: 1, profession: 100, itemID: 764000},
				{minLevel: 81, maxLevel: 250, amount: 1, profession: 100, itemID: 794000},
				{minLevel: 120, maxLevel: 250, amount: 5, profession: 100, itemID: 2435000},
				{minLevel: 151, maxLevel: 199, amount: 1, profession: 100, itemID: 52934000},
				{minLevel: 151, maxLevel: 199, amount: 1, profession: 100, itemID: 52948000},
				{minLevel: 151, maxLevel: 199, amount: 5, profession: 100, itemID: 52951000},
				{minLevel: 151, maxLevel: 199, amount: 2, profession: 100, itemID: 52964000},
				{minLevel: 200, maxLevel: 250, amount: 10, profession: 100, itemID: 52958000},
				{minLevel: 200, maxLevel: 250, amount: 3, profession: 100, itemID: 52974000},
			],
		},
		others: [
			{minLevel: 0, maxLevel: 250, amount: 15, profession: 100, itemID: 2160000},
			{minLevel: 0, maxLevel: 250, amount: 15, profession: 100, itemID: 2161000},
			{minLevel: 0, maxLevel: 250, amount: 15, profession: 100, itemID: 2162000},
			{minLevel: 0, maxLevel: 250, amount: 15, profession: 100, itemID: 2163000},

			{minLevel: 20, maxLevel: 250, amount: 1, profession: 1, itemID: 1940000},
			{minLevel: 20, maxLevel: 250, amount: 1, profession: 1, itemID: 1871000},
			{minLevel: 20, maxLevel: 250, amount: 1, profession: 1, itemID: 1879000},

			{minLevel: 20, maxLevel: 250, amount: 1, profession: 2, itemID: 1939000},
			{minLevel: 20, maxLevel: 250, amount: 1, profession: 2, itemID: 1890000},
			{minLevel: 20, maxLevel: 250, amount: 1, profession: 2, itemID: 1898000},

			{minLevel: 20, maxLevel: 250, amount: 1, profession: 3, itemID: 1938000},
			{minLevel: 20, maxLevel: 250, amount: 1, profession: 3, itemID: 1910000},
			{minLevel: 20, maxLevel: 250, amount: 1, profession: 3, itemID: 1916000},

			{minLevel: 20, maxLevel: 250, amount: 1, profession: 4, itemID: 1937000},
			{minLevel: 20, maxLevel: 250, amount: 1, profession: 4, itemID: 1928000},
			{minLevel: 20, maxLevel: 250, amount: 1, profession: 4, itemID: 1934000},
		],
        init: function () {
			var menuContainer = $('<div class="menulink" onclick="WTK.DailyItemHelper.showDailyItems();" title="' + WTKlang.showDailyItems + '" />').css('background-image', 'url(' + WTK.Images.menudailyitems + ')').css('background-position', '0px 0px').mouseenter(function () {
				$(this).css('background-position', '-25px 0px');
			}).mouseleave(function () {
				$(this).css('background-position', '0px 0px');
			});
			$('#ui_menubar').append($('<div id="WTK_menubutton_DailyItemHelper" class="ui_menucontainer" />').append(menuContainer).append('<div class="menucontainer_bottom" />'));
        },

		getQuestsFromArray: function(questArray) {
			var text = '';
			for (var i = 0; i < questArray.length; i++) {
				var quest = questArray[i];
				if(quest.profession == 100 || quest.profession == Character.professionId) {
					if(quest.minLevel <= Character.level && Character.level <= quest.maxLevel ){
						var color = 'black';
						if(Bag.getItemCount(quest.itemID) < quest.amount){
							color = 'red';
						}
						text += '<span style="color: ' + color + '";>' + ItemManager.get(quest.itemID).name + ' ' +Bag.getItemCount(quest.itemID) + '/' + quest.amount + '</span><br>';
					}
				}
			}
			return text;
		},

		showDailyItems: function() {
			WTK.GUI.open();
			WTK.GUI.getDefault('WTKDailyItemsTab');

			var scrollPane = new west.gui.Scrollpane();
			$(scrollPane.getMainDiv()).css({
				'height': '360px',
			});

			scrollPane.appendContent('<div style="float: left; padding: 10px 50px 5px 50px;"><b>'+WTKlang.saloon + ':</b><br>'+WTK.DailyItemHelper.getQuestsFromArray(WTK.DailyItemHelper.others)+'</div>');
			scrollPane.appendContent('<div style="float: left; padding: 10px 50px 5px 50px;"><b>'+WTKlang.indianVillage + ':</b><br>'+WTK.DailyItemHelper.getQuestsFromArray(WTK.DailyItemHelper.indianVillage)+'</div>');
			scrollPane.appendContent('<div style="float: left; padding: 10px 50px 5px 50px;"><b>'+WTKlang.ghostTown + ':</b><br>'+WTK.DailyItemHelper.getQuestsFromArray(WTK.DailyItemHelper.ghostTown)+'</div>');
			scrollPane.appendContent('<div style="clear:both"></div>');
			scrollPane.appendContent('<div style="float: left; padding: 10px 3px 5px 3px;"><b>'+WTKlang.monday + ':</b><br>'+WTK.DailyItemHelper.getQuestsFromArray(WTK.DailyItemHelper.daily.monday)+'</div>');
			scrollPane.appendContent('<div style="float: left; padding: 10px 3px 5px 3px;"><b>'+WTKlang.tuesday + ':</b><br>'+WTK.DailyItemHelper.getQuestsFromArray(WTK.DailyItemHelper.daily.tuesday)+'</div>');
			scrollPane.appendContent('<div style="float: left; padding: 10px 3px 5px 3px;"><b>'+WTKlang.wednesday + ':</b><br>'+WTK.DailyItemHelper.getQuestsFromArray(WTK.DailyItemHelper.daily.wednesday)+'</div>');
			scrollPane.appendContent('<div style="float: left; padding: 10px 3px 5px 3px;"><b>'+WTKlang.thursday + ':</b><br>'+WTK.DailyItemHelper.getQuestsFromArray(WTK.DailyItemHelper.daily.thursday)+'</div>');
			scrollPane.appendContent('<div style="clear:both"></div>');
			scrollPane.appendContent('<div style="float: left; padding: 10px 3px 5px 3px;"><b>'+WTKlang.friday + ':</b><br>'+WTK.DailyItemHelper.getQuestsFromArray(WTK.DailyItemHelper.daily.friday)+'</div>');
			scrollPane.appendContent('<div style="float: left; padding: 10px 3px 5px 3px;"><b>'+WTKlang.saturday + ':</b><br>'+WTK.DailyItemHelper.getQuestsFromArray(WTK.DailyItemHelper.daily.saturday)+'</div>');
			scrollPane.appendContent('<div style="float: left; padding: 10px 3px 5px 3px;"><b>'+WTKlang.sunday + ':</b><br>'+WTK.DailyItemHelper.getQuestsFromArray(WTK.DailyItemHelper.daily.sunday)+'</div>');
			scrollPane.appendContent('<div style="clear:both"></div>');


			$(WTK.GUI.window.getContentPane()).append(scrollPane.getMainDiv());
		},
    };

	WTK.AdventureBlockPlayer = {
		blockedUsers: [],

		init: function () {
			Chat.Formatter.backup_formatMessage = Chat.Formatter.formatMessage;
			Chat.Formatter.formatMessage = function (msg, from, time, highlight, classNames) {
				classNames = classNames || '';
				var newDiv = $('<div></div>');
				newDiv.html(from);
				var short_name = $('.client_name', newDiv).text();
				if(WTK.AdventureBlockPlayer.blockedUsers.includes(short_name)){
					return;
				} else {
					return["<table cellpadding='0' cellspacing='0' class='" + classNames + "'>", "<tr>", "<td style='white-space: nowrap;' class='chat_info'>", "<span class='chat_time'>[" + Chat.Formatter.formatTime(time) + "]</span>", "<span class='chat_from'>" + from + "</span>", "&nbsp;", "</td>", "<td class='chat_text " + (highlight ? "chat_highlight" : "") + "'>", msg, "</td>", "</tr>", "</table>"].join("");
				}
			};

			ChatWindow.Client.backup_onClick = ChatWindow.Client.onClick;
			ChatWindow.Client.onClick = function (args, id) {

				var client = Chat.Resource.Manager.getClient(id), isOnline;
				if (!client || client.myself)return;
				isOnline = Chat.Resource.Client.STATUS_OFFLINE != client.statusId;
				if (client.mpi) {
					var onAction = function (id) {
						switch (id) {
							case 0:
								Suggestion.showPopup('mpi', client.pname, client.id);
								break;
							case 1:
								if (WTK.AdventureBlockPlayer.blockedUsers.includes(client.pname)) {

									WTK.AdventureBlockPlayer.blockedUsers = jQuery.grep(WTK.AdventureBlockPlayer.blockedUsers, function(value) {
										return value != client.pname;
									});
									MessageSuccess(client.pname + ' ' + WTKlang.willNotBeIgnored).show();
								}
								else {
									WTK.AdventureBlockPlayer.blockedUsers.push(client.pname);
									localStorage.setItem('WTKAdventureBlockedPlayers', JSON.stringify(WTK.AdventureBlockPlayer.blockedUsers));
									MessageSuccess(client.pname + ' ' + WTKlang.willBeIgnored).show();
								}
								break;
						}
					};
					var selectbox = new west.gui.Selectbox().setHeader(client.pname).addItem(0, WTKlang.reportOffense).addItem(1, WTK.AdventureBlockPlayer.blockedUsers.includes(client.pname) ? WTKlang.dontIgnore : WTKlang.ignore).addListener(onAction).show(args[0]);
				}
				else {
					ChatWindow.Client.backup_onClick.call(this, args, id);
				}

			};

			var savedBlockedUsers = JSON.parse(localStorage.getItem('WTKAdventureBlockedPlayers'));
			if(savedBlockedUsers != null){
				WTK.AdventureBlockPlayer.blockedUsers = savedBlockedUsers;
			}
		},


	};

	WTK.ChurchLevels = {
		init: function () {
			BuildWindow.updateLaborPoints_backup = BuildWindow.updateLaborPoints;
			BuildWindow.updateLaborPoints = function (points) {
				BuildWindow.updateLaborPoints_backup.call(this, points);
				if(this.building == 'church' && points > 0) {
					var stageCount = Math.floor(this.window.$("div.build_progress_nfo > span.text_bold").text()/15);
					this.window.$("div.build_progress_nfo").append(' (' + (stageCount >= 0 ? '+' : '') + stageCount + ' ' + WTKlang.churchLevels + ')');
				}
			}
		},
	};

	WTK.FormattedRankings = {
		init: function () {
			RankingWindow.Cities.updateTable_backup = RankingWindow.Cities.updateTable;
			RankingWindow.Cities.updateTable = function (be_data) {
				RankingWindow.Cities.updateTable_backup.call(this, be_data);
				var elementsLength = $('.town_points_sum:not(div.cell.cell_2)').length;
				for(var i = 0; i < elementsLength; i++){
					$('.town_points_sum:not(div.cell.cell_2)')[i].innerText = format_number($('.town_points_sum:not(div.cell.cell_2)')[i].innerText);
					if(i != 0){
						$('.town_points_sum:not(div.cell.cell_2)')[i].title = format_number(deformat_number($('.town_points_sum:not(div.cell.cell_2)')[i].innerText)-deformat_number($('.town_points_sum:not(div.cell.cell_2)')[i-1].innerText));
					}
					$('.town_points:not(div.cell.cell_3)')[i].innerText = format_number($('.town_points:not(div.cell.cell_3)')[i].innerText);
					if(i != 0){
						$('.town_points:not(div.cell.cell_3)')[i].title = format_number(deformat_number($('.town_points:not(div.cell.cell_3)')[i].innerText)-deformat_number($('.town_points:not(div.cell.cell_3)')[i-1].innerText));
					}
					$('.town_fort_points:not(div.cell.cell_4)')[i].innerText = format_number($('.town_fort_points:not(div.cell.cell_4)')[i].innerText);
					$('.town_member_points:not(div.cell.cell_5)')[i].innerText = format_number($('.town_member_points:not(div.cell.cell_5)')[i].innerText);
					$('.town_duel_points:not(div.cell.cell_6)')[i].innerText = format_number($('.town_duel_points:not(div.cell.cell_6)')[i].innerText);
				}
			};

			RankingWindow.Duels.updateTable_backup = RankingWindow.Duels.updateTable;
			RankingWindow.Duels.updateTable = function (be_data) {
				RankingWindow.Duels.updateTable_backup.call(this, be_data);
				var elementsLength = $('.duel_exp:not(div.cell.cell_2)').length;
				for(var i = 0; i < elementsLength; i++){
					$('.duel_exp:not(div.cell.cell_2)')[i].innerText = format_number($('.duel_exp:not(div.cell.cell_2)')[i].innerText);
					if(i != 0){
						$('.duel_exp:not(div.cell.cell_2)')[i].title = format_number(deformat_number($('.duel_exp:not(div.cell.cell_2)')[i].innerText)-deformat_number($('.duel_exp:not(div.cell.cell_2)')[i-1].innerText));
					}
					$('.duel_win:not(div.cell.cell_3)')[i].innerText = format_number($('.duel_win:not(div.cell.cell_3)')[i].innerText);
					$('.duel_loss:not(div.cell.cell_4)')[i].innerText = format_number($('.duel_loss:not(div.cell.cell_4)')[i].innerText);
					$('.duel_diff:not(div.cell.cell_5)')[i].innerText = format_number($('.duel_diff:not(div.cell.cell_5)')[i].innerText);
				}
			};

			RankingWindow.Experience.updateTable_backup = RankingWindow.Experience.updateTable;
			RankingWindow.Experience.updateTable = function (be_data) {
				RankingWindow.Experience.updateTable_backup.call(this, be_data);
				var elementsLength = $('.exp_exp:not(div.cell.cell_3)').length;
				for(var i = 0; i < elementsLength; i++){
					$('.exp_exp:not(div.cell.cell_3)')[i].innerText = format_number($('.exp_exp:not(div.cell.cell_3)')[i].innerText);
					if(i != 0){
						$('.exp_exp:not(div.cell.cell_3)')[i].title = format_number(deformat_number($('.exp_exp:not(div.cell.cell_3)')[i].innerText)-deformat_number($('.exp_exp:not(div.cell.cell_3)')[i-1].innerText));
					}
				}
			};

			RankingWindow.FortBattles.updateTable_backup = RankingWindow.FortBattles.updateTable;
			RankingWindow.FortBattles.updateTable = function (be_data) {
				RankingWindow.FortBattles.updateTable_backup.call(this, be_data);
				var elementsLength = $('.forts_score:not(div.cell.cell_2)').length;
				for(var i = 0; i < elementsLength; i++){
					$('.forts_score:not(div.cell.cell_2)')[i].innerText = format_number($('.forts_score:not(div.cell.cell_2)')[i].innerText);
					if(i != 0){
						$('.forts_score:not(div.cell.cell_2)')[i].title = format_number(deformat_number($('.forts_score:not(div.cell.cell_2)')[i].innerText)-deformat_number($('.forts_score:not(div.cell.cell_2)')[i-1].innerText));
					}
					$('.forts_damage_dealt:not(div.cell.cell_3)')[i].innerText = format_number($('.forts_damage_dealt:not(div.cell.cell_3)')[i].innerText);
					$('.forts_hits_taken:not(div.cell.cell_4)')[i].innerText = format_number($('.forts_hits_taken:not(div.cell.cell_4)')[i].innerText);
					$('.forts_dodges:not(div.cell.cell_5)')[i].innerText = format_number($('.forts_dodges:not(div.cell.cell_5)')[i].innerText);
				}
			};

			RankingWindow.Crafting.updateTable_backup = RankingWindow.Crafting.updateTable;
			RankingWindow.Crafting.updateTable = function (be_data) {
				RankingWindow.Crafting.updateTable_backup.call(this, be_data);
				var elementsLength = $('.craft_score:not(div.cell.cell_2)').length;
				for(var i = 0; i < elementsLength; i++){
					$('.craft_score:not(div.cell.cell_2)')[i].innerText = format_number($('.craft_score:not(div.cell.cell_2)')[i].innerText);
					$('.craft_items_created:not(div.cell.cell_3)')[i].innerText = format_number($('.craft_items_created:not(div.cell.cell_3)')[i].innerText);
				}
			};
		},
	};

	WTK.WindowPin = {
		newPos: {left: -1, top: -1,},
		saveMousPos: function (event) {
			WTK.WindowPin.newPos = {left:  event.clientX, top: event.clientY,};
			localStorage.setItem('WTKPinPosition', JSON.stringify(WTK.WindowPin.newPos));
			document.removeEventListener("click", WTK.WindowPin.saveMousPos);
			$('body').removeClass('WTK_overlay');
		},
		getNewPinPosition: function () {
			var styling = $('<style></style>').text('.WTK_overlay { background-image: none; opacity:0.2; background-color:#000; position:fixed; width:100%; height:100%; top:0px; left:0px; z-index:1000;}');
			$('head').append(styling);
			$('body').addClass('WTK_overlay');
			setTimeout((function () {
				document.addEventListener("click", WTK.WindowPin.saveMousPos);
            }), 100);

		},
		init: function () {
			var tempPos = JSON.parse(localStorage.getItem('WTKPinPosition'));
			if(tempPos != null && tempPos.left >= 0 && tempPos.top >= 0){
				WTK.WindowPin.newPos = tempPos;

				Inventory.dock = function (dockedWindow) {
					Inventory.window.center = function () {
						var max_window_size_difference = 100;
						var $inventory = $('#windows .inventory'),
						$docklet = $(dockedWindow.divMain),
						offset_left,
						offset_top,
						inventory_position = {},
						docklet_position = {};
						offset_left = ($(document).outerWidth() - $inventory.outerWidth() - $docklet.outerWidth()) >> 1;
						if (offset_left < 0) {
							inventory_position.left = $(document).outerWidth() - $inventory.outerWidth() + 7;
							docklet_position.left = 0;
						} else {
							inventory_position.left = WTK.WindowPin.newPos.left + $docklet.outerWidth() - 13;
							docklet_position.left = WTK.WindowPin.newPos.left;
						}
						inventory_position.top = ($(document).outerHeight() - $inventory.outerHeight()) >> 1;
						if ($docklet.outerHeight() < ($inventory.outerHeight() + max_window_size_difference)) {
							offset_top = Math.min(($(document).outerHeight() - $docklet.outerHeight()) >> 1, ($(document).outerHeight() - $inventory.outerHeight()) >> 1);
							inventory_position.top = docklet_position.top = WTK.WindowPin.newPos.top;
						} else {
							docklet_position.top = ($(document).outerHeight() - $docklet.outerHeight()) >> 1;
						}
						$docklet.css({
							left: docklet_position.left + 'px',
							top: docklet_position.top + 'px'
						});
						$inventory.css({
							left: inventory_position.left + 'px',
							top: inventory_position.top + 'px'
						});
					};
					if (Inventory.dockedWindow) {
						Inventory.undock();
					}
					Inventory.dockedWindow = dockedWindow;
					Inventory.window.addClass('docked_' + dockedWindow.id);
					Inventory.window.addClass('focused_' + dockedWindow.id);
					EventHandler.listen("window_closed_" + dockedWindow.id, Inventory.undock, Inventory);
					Inventory.window.center();
				};

				$.fn.center = function (x, y, relative) {
					var p = this.position();
					if (!relative)
						relative = $(window);
					if (x !== false) {
						var w = this.outerWidth();
						var sw = relative.outerWidth();
						this.first().css('left', (WTK.WindowPin.newPos.left-20) + "px");
					}
					if (y !== false) {
						var h = this.outerHeight();
						var sh = relative.outerHeight();
						this.first().css('top', (WTK.WindowPin.newPos.top-20) + "px");
					}
					return this;
				};
			}
		},
		setNewPos: function(){

		},
	};

	WTK.ShowFort = {
		init: function () {
			ReportWindow.init_content_backup = ReportWindow.init_content;
			ReportWindow.init_content = function (data){
				ReportWindow.init_content_backup.call(this, data);
				if(data.reportType == 'fortbattle' && data.reportInfo.subtype == 'declare'){
					WTK.ShowFort.getFortID(data.reportInfo.fortname, data.report_id);
				}

			}

		},

		getFortID: function (fortName, report_id) {
			Ajax.remoteCall('fort_overview', 'search_fort', {
				fortNames: fortName
			}, function (json) {
				if (!json.error) {
					if (json["0"]) {
						for (var fo in json) {
							if(json[fo].name == fortName){
								$('#rp_report-'+report_id+' .fort_muster a:first-child').replaceWith('<a href="javascript:void(FortWindow.open('+json[fo].fort_id+', '+json[fo].fort_x+', '+json[fo].fort_y+'));">'+json[fo].name+'</a>');
							}
						}
					}
				}
			});
		},
	};

	WTK.BuildingProgress = {
		init: function () {
			BuildWindow.initInfo_backup = BuildWindow.initInfo;
			BuildWindow.initInfo = function (data) {
				BuildWindow.initInfo_backup.call(this, data);
				var tmp = $('<div class="rp_row_jobdata row_build_' + 'hammer' + '" title="' + WTKlang.progress.escapeHTML() + ':&nbsp;' + WTKlang.progressTooltip + '">' + '<span class="rp_jobdata_label_icon"><img src="https://westde.innogamescdn.com/images/icons/' + 'hammer' + '.png" alt="" /></span>' + '<span class="rp_jobdata_label text_bold">' + WTKlang.progress + '</span>' + '<span class="rp_jobdata_text text_bold"></span>' + '</div>');
				$('span.rp_jobdata_text', tmp).append(new west.gui.Progressbar(data.build_point, data.build_point_limit).getMainDiv());
				$('.build-'+data.x+'-'+data.y+'-'+ data.build_key +' div.build_info').append(tmp);
			};
		},
	};

	WTK.ImprovedBuildCityhall = {
		init: function () {
			CityhallWindow.Build.fillContent_backup = CityhallWindow.Build.fillContent;
			CityhallWindow.Build.fillContent = function (data) {
				this.table.clearBody();
				for (var i = 0; i < data.length; i++) {
					var r = data[i];
					var buildtext;
					if (!this.main.ownTown){
						this.table.appendRow();
						buildtext = r.name;
						this.table.appendToCell(-1, "building_foreign", buildtext).appendToCell(-1, "stage", r.stage + " / " + (r.infinite ? "<img src='https://westde.innogamescdn.com/images/xp_inf_000.png' style='padding-bottom: 4px;'/>" : r.maxStage));
					} else if (r.stage == r.maxStage && !r.infinite) {

					} else {
						this.table.appendRow();
						buildtext = '<a href="#" onClick="javascript:void(BuildWindow.open(' + Character.homeTown.town_id + ', ' + Character.homeTown.x + ', ' + Character.homeTown.y + ', \'' + r.key + '\', false));">' + r.name + '</a></span>';
						this.table.appendToCell(-1, "building", buildtext).appendToCell(-1, "stage", r.stage + " / " + (r.infinite ? "<img src='https://westde.innogamescdn.com/images/xp_inf_000.png' style='padding-bottom: 4px;'/>" : r.maxStage)).appendToCell(-1, "progress", new west.gui.Progressbar(r.buildPoints, r.nextStagePoints).getMainDiv());
					}
				}
			};
		},
	};

	WTK.ExtendedItemFinder = {
		itemsToFind: [],
		searchResultDialog: null,
		searchDialog: null,

		init: function () {
			var savedItemsToFindOriginal = JSON.parse(localStorage.getItem('WTKItemFinderItems'));
			if(savedItemsToFindOriginal != null){
				for (var i = 0; i < savedItemsToFindOriginal.length; i++) {
					var item = {id: savedItemsToFindOriginal[i], targetAmount: 1, showNotification: true};
					WTK.ExtendedItemFinder.itemsToFind.push(item);
				}
				localStorage.removeItem('WTKItemFinderItems');
				localStorage.setItem('WTKExtendedItemFinderItems', JSON.stringify(WTK.ExtendedItemFinder.itemsToFind));
			} else {
				var savedItemsToFind = JSON.parse(localStorage.getItem('WTKExtendedItemFinderItems'));
				if(savedItemsToFind != null){
					WTK.ExtendedItemFinder.itemsToFind = savedItemsToFind;
				}
			}
			WTK.ExtendedItemFinder.initFindNotification();
		},

		showExtendedItemFinder: function() {
			WTK.GUI.open();
			WTK.GUI.getDefault('WTKExtendedItemFinder');
			var scrollPane = new west.gui.Scrollpane();

			var itemSearchButton = new west.gui.Button(WTKlang.searchItem, function() {
				WTK.ExtendedItemFinder.showSearchDialog();
            });

			var deleteButton = new west.gui.Button(WTKlang.deleteMarkedItems, function() {
				WTK.ExtendedItemFinder.deleteSelectedItems();
            }).addClass('inactive');

			var helpButton = new west.gui.Button(WTKlang.help, function() {
					WTK.ExtendedItemFinder.helpDialog = new west.gui.Dialog(WTKlang.help, $('<div>').append(WTKlang.itemFinderHelpContent)).addButton(WTKlang.back);
					WTK.ExtendedItemFinder.helpDialog.show();
            });
			
			scrollPane.appendContent(itemSearchButton.getMainDiv());
            scrollPane.appendContent(deleteButton.getMainDiv());
            scrollPane.appendContent(helpButton.getMainDiv());

			var itemsToFind = WTK.ExtendedItemFinder.itemsToFind;
			var targetAmount = 1;
			for (var i = 0; i < itemsToFind.length; i++) {
				var itemId = itemsToFind[i].id;
				var item = ItemManager.get(itemId);
				var popup = new ItemPopup(item,{}).popup;
				var div;
				var classToSet = '';
				if(itemsToFind[i].showNotification == true) {
					classToSet = 'WTK_find_notifcation_highlight'
				}
				if(Bag.getItemCount(itemId) >= itemsToFind[i].targetAmount){
					div = $('<div>').append('<div class="item item_inventory hasMousePopup WTK_item_border_green" title="' + popup.getXHTML().escapeHTML() + '"><img class="tw_item item_inventory_img dnd_draggable" src="' + item.image + '" alt='+itemId+'>'+'<div class="' + classToSet + ' WTK_find_notifcation">'+ Bag.getItemCount(itemId) + ' / ' + itemsToFind[i].targetAmount +'</div>'+'<span class="count-required"><p/></span></div>');
				} else {
					div = $('<div>').append('<div class="item item_inventory hasMousePopup WTK_item_border" title="' + popup.getXHTML().escapeHTML() + '"><img class="tw_item item_inventory_img dnd_draggable" src="' + item.image + '" alt='+itemId+'>'+'<div class="' + classToSet + ' WTK_find_notifcation">' + Bag.getItemCount(itemId) + ' / ' + itemsToFind[i].targetAmount +'</div>'+'<span class="count-required"><p/></span></div>');
				}
				div.children("div").children("div").off("click").click(function () {
					$(this).toggleClass("WTK_find_notifcation_highlight");
					WTK.ExtendedItemFinder.toogleNotification($(this).parent().find("img").attr("alt"));
				});
				div.find("img").off("click").click(function () {
					$(this).parent().parent().toggleClass("opacity05");
					if($('.active_tab_id_WTKExtendedItemFinder').find('.opacity05').length == 0){
						$('.WTKMenuWindow').find($('.tw2gui_button')).last().prev().addClass('inactive');
					} else {
						$('.WTKMenuWindow').find($('.tw2gui_button')).last().prev().removeClass('inactive');
					}
				});
				scrollPane.appendContent(div);
			}
			var placeHolder = '';
//			for (var i = 0; i <= (itemsToFind.length - itemsToFind.length  % 10) / 10; i++) {
//				placeHolder += '<div style="height: 64px;" ondrop="WTK.ExtendedItemFinder.dropItem(event)" ondragover="WTK.ExtendedItemFinder.allowDrop(event)"/>';
//			}
			placeHolder = '<div style="height: ' + 66 * Math.ceil(itemsToFind.length / 10) + 'px;" />'

			scrollPane.appendContent(placeHolder);
			$(WTK.GUI.window.getContentPane()).append(scrollPane.getMainDiv());
            $('.WTKMenuWindow').find($('.tw2gui_button')).first().css('margin-bottom', '5px')
		},
		
		

		deleteSelectedItems: function(){
			var selectedItems = $('.active_tab_id_WTKExtendedItemFinder').find('.opacity05');
			for (var i = 0; i < selectedItems.length; i++) {
				var id = selectedItems[i].childNodes[0].childNodes[0].alt;
				WTK.ExtendedItemFinder.itemsToFind = jQuery.grep(WTK.ExtendedItemFinder.itemsToFind, function(value) {
					return value.id != id;
				});
			}
			localStorage.setItem('WTKExtendedItemFinderItems', JSON.stringify(WTK.ExtendedItemFinder.itemsToFind));
			WTK.ExtendedItemFinder.showExtendedItemFinder();
		},

		toogleNotification: function(item_id){
			WTK.ExtendedItemFinder.itemsToFind
			for (var i = 0; i < WTK.ExtendedItemFinder.itemsToFind.length; i++) {
				var entry = WTK.ExtendedItemFinder.itemsToFind[i];
				if (entry.id == item_id) {
					entry.showNotification = ! entry.showNotification;
					WTK.ExtendedItemFinder.itemsToFind[i] = entry;
					localStorage.setItem('WTKExtendedItemFinderItems', JSON.stringify(WTK.ExtendedItemFinder.itemsToFind));
				}
			}
		},

		searchForItems: function(){
			var name = $('#WTKExtendedItemFinder_searchDialog_name').val();
			var amount = parseInt($('#WTKExtendedItemFinder_searchDialog_targetAmount').val());
			var searchResult = [];
			var searchMaximum = Math.floor(($( window ).height() - 230) / 16);
			for(var oldItemId = 1; oldItemId < 253801 && searchResult.length < searchMaximum; oldItemId++){
				var newItemId = oldItemId * 1000;
				if(ItemManager.get(newItemId) != undefined && ItemManager.get(newItemId).name.toLowerCase().indexOf(name.toLowerCase()) >= 0 && WTK.ExtendedItemFinder.isAlreadyOnTheList(newItemId) == false){
					searchResult.push(newItemId);
				}
			}
			if(searchResult.length > 0){
				var contentDiv = "";
				for (var i = 0; i < searchResult.length; i++) {
					var item_id = searchResult[i];
					var item = ItemManager.get(item_id);
					var popup = new ItemPopup(item,{}).popup;
					contentDiv += '<a class="hasMousePopup" title="' + popup.getXHTML().escapeHTML() + '" href="javascript:void(WTK.ExtendedItemFinder.addItemToItemsToSearch(' + item_id + ',' + amount + '))">' + item.name + '</a> ' + WTK.ExtendedItemFinder.getColoredString(Bag.getItemCount(item.item_id), amount) + '<br>';
				}
				if(searchResult.length == searchMaximum){
					contentDiv += '<br><b>' + WTKlang.thereAreMoreItems + '<br>' + WTKlang.restrictYourSearch + '</b>';
				}
				new west.gui.Dialog(WTKlang.searchResult, $(contentDiv)).addButton(WTKlang.back, function(){
					WTK.ExtendedItemFinder.showSearchDialog(name, amount);
				}).addButton('cancel').show();
			} else {
				MessageHint(WTKlang.emptySearchResult).show();
			}
		},

		inputIsValid: function(){
			var targetAmount = parseInt($('#WTKExtendedItemFinder_searchDialog_targetAmount').val());
			var name = $('#WTKExtendedItemFinder_searchDialog_name').val();
			if (name == undefined || name.length <= 0){
				MessageError(WTKlang.nameCannotBeEmpty).show();
				return false;
			} else if (targetAmount == undefined || Number.isNaN(targetAmount) || targetAmount <= 0) {
				MessageError(WTKlang.itemAmountMustBeHigherThan0).show();
				return false;
			}
			return true;
		},

		addItemToItemsToSearch: function(item_id, targetAmountValue) {
			if(WTK.ExtendedItemFinder.isAlreadyOnTheList(item_id) == false){
				var item = {id: item_id, targetAmount: targetAmountValue, showNotification: false};
				WTK.ExtendedItemFinder.itemsToFind.push(item);
				localStorage.setItem('WTKExtendedItemFinderItems', JSON.stringify(WTK.ExtendedItemFinder.itemsToFind));
				WTK.ExtendedItemFinder.showExtendedItemFinder();
			}
		},

		showSearchDialog: function(nameInputValue, targetAmoundInputValue) {
			var contentDiv = $('<div style="text-align: center;">');
			contentDiv.append(WTKlang.whatItemsWouldYouLikeToSearchFor + '<br><b>' + WTKlang.nameOfTheItem + '<b>');
			var nameInput = new west.gui.Textfield('WTKExtendedItemFinder_searchDialog_name').setSize(10).setClass4Input('input_layout');
			nameInput.setValue(nameInputValue)
			contentDiv.append(nameInput.getMainDiv());
			contentDiv.append('<br>' + WTKlang.howManyOfThemWouldYouLikeToCollect + '<br><b>' + WTKlang.numberOfItems + '<b>');
			var targetAmoundInput = new west.gui.Textfield('WTKExtendedItemFinder_searchDialog_targetAmount').onlyNumeric().setSize(10).setClass4Input('input_layout');
			targetAmoundInput.setValue(targetAmoundInputValue);
			contentDiv.append(targetAmoundInput.getMainDiv());
			WTK.ExtendedItemFinder.searchDialog = new west.gui.Dialog(WTKlang.searchItem, $(contentDiv)).addButton(WTKlang.search, function () {
				if(WTK.ExtendedItemFinder.inputIsValid()){
					WTK.ExtendedItemFinder.searchForItems();
				} else {
					WTK.ExtendedItemFinder.showSearchDialog($('#WTKExtendedItemFinder_searchDialog_name').val(), $('#WTKExtendedItemFinder_searchDialog_targetAmount').val());
				}
			}).addButton('cancel');
			WTK.ExtendedItemFinder.searchDialog.show();
			$('#WTKExtendedItemFinder_searchDialog_name').focus()
			$('#WTKExtendedItemFinder_searchDialog_targetAmount').val(1);
		},

		isAlreadyOnTheList: function(item_id) {
			for(var i = 0; i < WTK.ExtendedItemFinder.itemsToFind.length; i++){
				if(WTK.ExtendedItemFinder.itemsToFind[i].id == item_id){
					return true;
				}
			}
			return false;
		},

		getColoredString: function(currentAmount, targetAmount) {
			var color = targetAmount > currentAmount ? 'red' : 'green';
			return '<span class="text_' + color + ' bold">' + currentAmount + '/' + targetAmount + '</span>';
		},
		
		initFindNotification: function() {
			Bag.handleChanges_backup = Bag.handleChanges;
			Bag.handleChanges = function (changes, from) {
				var i = 0, l = changes.length, item;
				for (i; i < l; i++) {
					if (changes[i].count > 0 && WTK.ExtendedItemFinder.isAlreadyOnTheList(changes[i].item_id) && from != 'wear') {
						var item2 = ItemManager.get(changes[i].item_id);
						var popup = new ItemPopup(item2,{}).popup;
						new west.gui.Dialog(WTKlang.itemFinder, '<div class="item item_inventory hasMousePopup" title="' + popup.getXHTML().escapeHTML() + '"><img class="tw_item item_inventory_img dnd_draggable" src="' + item2.image + '"></div>' + WTKlang.youHaveFound + '<br><br><div style="text-align: center;"><b>' + item2.name +'</b></div><br>').addButton('ok').setModal(true, false, {
							bg : "https://westde.innogamescdn.com/images/curtain_bg.png", opacity : 0.7
						}).setHeight('40px').show();
					}
				}
				Bag.handleChanges_backup.call(this, changes, from);
			}
		},
		
		isItemOnNotificationList: function(item_id) {
			for(var i = 0; i < WTK.ExtendedItemFinder.itemsToFind.length; i++){
				if(WTK.ExtendedItemFinder.itemsToFind[i].id == item_id && WTK.ExtendedItemFinder.itemsToFind[i].showNotification == true){
					return true;
				}
			}
			return false;
		}
	};

	WTK.ExtendedBBCodes = {
		init: function () {
			Game.TextHandler.parse_backup = Game.TextHandler.parse;
			Game.TextHandler.parse = function (text) {
				var text = WTK.ExtendedBBCodes.replaceColor(text);
				text = WTK.ExtendedBBCodes.replaceSize(text);
				text = WTK.ExtendedBBCodes.replaceImage(text);
				return Game.TextHandler.parse_backup.call(this, text);
			}
		},
		
		replaceColor: function (text) {
			var resultArray = text.match(/\[color=[a-z]*\]/g);
			if (resultArray != null) {
				for (var i = 0; i <resultArray.length; i++) {
					var color = resultArray[i].replace('[color=','').replace(']','');
					text = text.replace(/\[color=[a-z]*\]/,'<span style="color:' + color + '">').replace(/\[\/color\]/,'</span>');
				}
			}
			return text;
		},
		
		replaceSize: function (text) {
			var resultArray = text.match(/\[size=[0-9]*\]/g);
			if (resultArray != null) {
				for (var i = 0; i <resultArray.length; i++) {
					var size = resultArray[i].replace('[size=','').replace(']','');
					text = text.replace(/\[size=[0-9]*\]/,'<span style="font-size:' + size + 'px">').replace(/\[\/size\]/,'</span>');
				}
			}
			return text;
		},
		
		replaceImage: function (text) {
			return text.replace(/\[img\]/g,'<img src="').replace(/\[\/img\]/g,'"/>');
		},
	};

	WTK.Updater = function () {
      $.getScript(WTK.updateUrl, function () {
        if (scriptUpdate.WTK > WTK.version) {
			var updateDialog = new west.gui.Dialog(WTK.name, '<span>' + WTKlang.updateMessage + '<br><br><b>Version: ' + scriptUpdate.WTK + '</b><br>' + scriptUpdate.WTKNew + '</span>', west.gui.Dialog.SYS_WARNING).addButton('Update', function () {
				updateDialog.hide();
				location.href = WTK.website + '/code.user.js';
			}).addButton('cancel').show();
        }
      });
    };
    setTimeout(WTK.Updater, 4000);

	WTK.Skript.init();
});
