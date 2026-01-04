// ==UserScript==
// @name        The West - westernblumis Toolkit
// @namespace   westernblumi
// @include 	https://*.the-west.*/game.php*
// @author 		westernblumi
// @version     1.04.1 (spanish)
// @grant       none
// @description Some useful improvements for The West
// @downloadURL https://update.greasyfork.org/scripts/32025/The%20West%20-%20westernblumis%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/32025/The%20West%20-%20westernblumis%20Toolkit.meta.js
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
		},
        es: {
			language: 'Spanish',
			features: 'Funciones',
			FeatRemoveTownBlinkEvent: 'Elimina parpadeo del elemento del menú del foro',
			FeatNewStatistics: 'Agrega estadísticas de aventuras',
			FeatOpenTrader: 'Abre el vendedor ambulante, cuando hay nuevos artículos disponibles',
			FeatDailyItemHelper: 'Agrega un nuevo botón en el menú lateral para los artículos de búsquedas diarias',
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
			adventures: 'Adventuras',
			getData: 'Mostrar datos',
			updateMessage: 'Una nueva versión del script está disponible',
			ignore: 'Ignorar',
			dontIgnore: 'No ignorar más',
			reportOffense: 'Informar insulto',
			willBeIgnored: 'será ignorado',
			willNotBeIgnored: 'ya no será ignorado',
	    },
      }
    };
	
	WTK = {
		version: '1.04',
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
        },
		Images: {
			menudailyitems: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QCsRXhpZgAATU0AKgAAAAgACQEaAAUAAAABAAAAegEbAAUAAAABAAAAggEoAAMAAAABAAIAAAExAAIAAAARAAAAigMBAAUAAAABAAAAnAMDAAEAAAABAAAAAFEQAAEAAAABAQAAAFERAAQAAAABAAAOw1ESAAQAAAABAAAOwwAAAAAAAXbyAAAD6AABdvIAAAPocGFpbnQubmV0IDQuMC4xMwAAAAGGoAAAsY//2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAZADIDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+dbwZ8KfFXxw/aA+Lfif4n/Evxn4f+Fnw78SeNba+/wCEd1+/8CXFr4O8G6/e+HdKjs/DmiTada22r38VhZ32ovp6SXet+NtVc6hcXWr6xfTx+G+NvB+s6h4s1eHwn43+Nr6It/8AaPD+lT+PPiT4ik0SxnkubuDSn1OwW6a81C3t4nvpniMV1JG7Xv2WKDey+wa58btZbUfjP8P9J8NXEYufjX8SdW1HT9N0LUovEuqS6V441q2tbPxNBay6imnWtlrE13f38TWtnDb6vfwtcR3T2ljIn6bf8E3P2U/2df2jP2mP2fdQ+LN9pPgLwK51DxL4+8L/ABD06CDTfiJqXhhLSCFNB1LxDo9/po03xH4n8O2fh3x0YtS0waPa6ffxaHqsk2t7rf8ALsRiaOFwOUYSDpRxGKlQpQr0IUqNLBKdGlShQqNyfJBuSpRk7Qc9bc7pxl+k4HB4zHY7OMbJVHQy+jWrSw1epVrV8wtUqVamJw6hTiqk400601G81Tbcb041HD+dj4oH4ofCD4qeFpdUtvHz67aw+GPFOh6f8V4fFep2Oq6ZcNHqOjo2heN7C0/t/wALatZKXu4biyv9GvdKuGs4ZrmI3E91+2VrYXHj74s+IPBx0nStA0HQtVs4tG0XVI9HsE8FaNN4G8L+KdWs21aHT7WTxDZeG7XVL3Tptd1K9v7268MaZp0sgttOXTrU/Vv/AAXU/bb/AGYv2jfix4Q+FnwstNM8XfDn9mCw8fx6L8TPh34U+32eueJptE8Pwanofg7xLdXenaNd+EtKtNLttNv7/SNOfw9ayxaZf6Xr2t6efLj/ADp+KXxY1W3+OX7RHhPwj4fOnWXiXUvCukx/bdOn0jxguhxfDfwVqb6eILzUIVtbLWdN/sS2ea5srO7v9J01IJZVF3d2TrGwwWNzjLcHUjGjRy3LcXPF4+vD3cVUji8qlUo0qvNTpqnKc/fqfY56kIuU7tzRjj8NlGMx8FVrVczxlL6rl2HqVU8PS9ljo069WiozlKVJUuaELu3JGTiqbko95f8AizwNrPirX9D8P6XqF14WsTNc6A9/PJJJc6faRW1jJql1aSQMlnd6tNCL21tIfK+wWznTcSm0Nw/yd+198Stc+FA8AfYPhPALnxNaXOraJq/jrwvPrGiTWmn35spv+EYuL2xtLa+vJdfintLu0trm4bTbmxuY76CWS50+4tv0b/Y1+Dvwq+MXjv4TeEviN4hi+G9nq/xDsNA8ZeMxfm78O6xptvfwajrelWWuaab7SIvFmi6XcW9sls0xtZrK6gv7yazFhPBL+sf/AAWm+PP7Mvi3TfAP7DPwb8OaF408EfBjxJ4f8c+NPEvwz8IXXjHTfhtd+ENL8SWGneGPD+s2bW3huPxNZJc3kt1bW91qguiNWsr7UtN1q0vrKvJwcsreYZtm9Sjy5dlrnGjl3tXCeJq1KT9jOnSVV/7PX5XVi4pQcm6cbulWpL18Zl2Z0sFkeUQqqvmGcU4zr4905VKWGpxrQWIpuo4K2LoOr7DERneq3GnNKMa1CrP8nPh5qvg7XvAHgbXNf/Y08J3+u6z4P8M6rrV9pXje38O6Xe6tqOi2V5qN3pvh+3sYbfQrC5vJpprPR4IYodMt3jsoo0SBVBXvvwl8f/BLUPhV8Mr8eAviDKL34feDLsSXPg/xRPcSC58OabMHnm0vTbjTJpnD7pZdOnnsJHLPaTSW5jdivyivi8T7et/wkzh+9qe7bHLl9/4bLF292yWmnu6ef3dPA0/Z075xjJPkheXNVfM7U7yvya33v6eR+Pd7r/w48PfGP4laF8b7L4s+EP8AhHviL438Rar4S+z+Dm1jV9M8ReJbvXvDem6NPaavHJfXmt6FrGn3N94tn8V22mXOgw32sWepa1qcVhpeo/en7X3/AAVh8OftE+D/AIK/Cj4I/AD4Vfs5fCn4F3lzrXh3T7HxFbat8QE8ReJodc8QeO/DaeMdTub9LvwBqniDxJfa7aaPa6B4evBqAXTLuaawW4tLzzz4+f8AHv42/wCxQ8Ff+1682/Zv/wBR4f8A93Tf/S68r9AjntKlkdXHf2fBqtRjQxWHjXtTqwpTVOcYOpRqypwnPmqqMvbTjJrnqVXCMl4cchrVeIaOAWZVIzwdWeKwmJ9h71GTlyL93Tr0oymoKMVNOEUotQpwU5qXmni34i/AjV/Ddlongz4e6Be+MPH0eo6FceGfBF7p1n4isr3W7UWLw+CNI0zRNUSW71a6uni0xLe8voNOgGqQx6fOIobqT07WfHvg3SfjZ4ug+MFh8U/DFp40fwb8SNKuNX0n4Y67pXiXwrL8OfDGly6tHDrjatL4u1e71zQtXtvDNjFcaZD4d1yaz0rU7vwlFp8s+n/q/wCBP+SufDD/ALC3iP8A9RKOvif45/8AIRuv+xL8cf8Ap+kr4/J+JsLm2Mw+BeV1adOrhY1qlStmdXF1+fG1/bw9nOWGpqnHD/Uo07ckp1Yz5uenOPNL6HMMmxOHwuIzP+0KUalCbpU6GGy+lhsPy4ehCnU5oKrUk1iJ5jUrSipqFOUeSEfZy5I+z/Hj/gqV8PPin+y34N/ZO+C3wX+H3wn8L6FqHhjxb4n8deMtY0jUfiPqnjDQv7F8N6V4l8H3FrrKaL4D1Dxh4a8H6Pb+MNF0bRbmPT5rhv7B1T/SUntvjjSP2gPgXoek3fiLxN4U8LeJPiNqD2lpbWyeM9Pg0rULs3byS6/Y6BaWmr6ffeLJnICjTZdL1W+8R3WnrdW97BqNxpkHj3wD6n/sI6z/AOlOn1+s9p/x/wDw6/7HjwD/AOnbUK6+Kc/oYTGUMDicBVxNOGHdJPDY9Ze/YU/fdCXssHUk6M7NODnu+a7d75cP5biFl31vCYynQeYVJVpwrYV4xUsRUrVaH1mEqmJi/bRjGKi7KDheE4STXL8ieFfjdqnhHwv4b8KWkXxm0W18MaDo/h620fUrvQp9R0m30XTrfTYdMv5zBaGa9sI7ZbW6lNrbGSeKRzbwk+WpX6E+L/8AkbPFH/Yxa3/6crmivg3xJh6zdWWVxvVbqO9bDS1m1J+9LLm5at6u7e7u739Z5a6TdNVk1TfInyVY35PdTtHEpL4VokktkrI//9k=',
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
			var menuContainer = $('<div id="WTK-menu" class="menulink" onclick="WTK.GUI.openMenu();" title="' + WTK.name + '" />').css('background-image', 'url(' + WTK.Images.menu + ')').css('background-position', '0px 0px').mouseenter(function () {
				$(this).css('background-position', '-25px 0px');
			}).mouseleave(function () {
				$(this).css('background-position', '0px 0px');
			});
			$('#ui_menubar').append($('<div class="ui_menucontainer" />').append(menuContainer).append('<div class="menucontainer_bottom" />'));
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
			//WTK.GUI.window.addTab('Vergleich', 'Item_Inspector_Comparison_Tab', WTK.GUI.openComparisonTab);
        },
        getDefault: function (tab) {
			WTK.GUI.window.setResizeable(false).setSize(748, 471).clearContentPane().removeClass('nocloseall').setTitle(WTK.name);
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
					table.appendRow();
					table.appendRow($('<h2>'+WTKlang.adventures+'</h2>'));
					
					var button = new west.gui.Button(WTKlang.getData, WTK.NewStatistics.getDataAdventuresPlayed);
					table.appendRow().appendToCell(-1,'desc',WTKlang.adventuresPlayed).appendToCell(-1,'value',button.getMainDiv());
					button = new west.gui.Button(WTKlang.getData, WTK.NewStatistics.getDataAdventuresKnockouts);
					table.appendRow().appendToCell(-1,'desc',WTKlang.adventuresKnockouts).appendToCell(-1,'value',button.getMainDiv());
					button = new west.gui.Button(WTKlang.getData, WTK.NewStatistics.getDataAdventuresDodges);
					table.appendRow().appendToCell(-1,'desc',WTKlang.adventuresDodges).appendToCell(-1,'value',button.getMainDiv());
					button = new west.gui.Button(WTKlang.getData, WTK.NewStatistics.getDataAdventuresMiss);
					table.appendRow().appendToCell(-1,'desc',WTKlang.adventuresMiss).appendToCell(-1,'value',button.getMainDiv());
					
					that.window.$('div.achievement-statistic',AchievementWindow.DOM).empty();
					table.appendTo(that.window.$('div.achievement-statistic',AchievementWindow.DOM));
				},this);
				return this;
			};
        },
		
		getDataAdventuresPlayed: function () {
			Ajax.remoteCall('achievement','track',{achvid: 60004}, function(json)
			{
				if(!json.error){
					MessageSuccess(WTKlang.adventuresPlayed + ': ' + json.current).show();
				}
				Ajax.remoteCall('achievement','untrack',{}, function(json){});
			});
		},
		
		getDataAdventuresKnockouts: function () {
			Ajax.remoteCall('achievement','track',{achvid: 60030}, function(json)
			{
				if(!json.error){
					MessageSuccess(WTKlang.adventuresKnockouts + ': ' + json.current).show();
				}
				Ajax.remoteCall('achievement','untrack',{}, function(json){});
			});
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
			{minLevel: 73, maxLevel: 150, amount: 1, profession: 100, itemID: 1817000},
			{minLevel: 80, maxLevel: 150, amount: 1, profession: 100, itemID: 1819000},
			{minLevel: 120, maxLevel: 150, amount: 4, profession: 100, itemID: 2442000},
		],
		indianVillage: [
			{minLevel: 13, maxLevel: 40, amount: 1, profession: 100, itemID: 714000},
			{minLevel: 34, maxLevel: 60, amount: 1, profession: 100, itemID: 718000},
			{minLevel: 41, maxLevel: 70, amount: 1, profession: 100, itemID: 724000},
			{minLevel: 50, maxLevel: 80, amount: 1, profession: 100, itemID: 1812000},
			{minLevel: 56, maxLevel: 80, amount: 1, profession: 100, itemID: 1813000},
			{minLevel: 63, maxLevel: 100, amount: 1, profession: 100, itemID: 1708000},
			{minLevel: 71, maxLevel: 150, amount: 1, profession: 100, itemID: 780000},
			{minLevel: 90, maxLevel: 150, amount: 1, profession: 100, itemID: 1821000},
			{minLevel: 100, maxLevel: 150, amount: 1, profession: 100, itemID: 1826000},
			{minLevel: 120, maxLevel: 150, amount: 1, profession: 100, itemID: 2441000},
		],
		daily: {
			sunday: [
				{minLevel: 13, maxLevel: 47, amount: 1, profession: 100, itemID: 716000},
				{minLevel: 15, maxLevel: 43, amount: 1, profession: 100, itemID: 742000},
				{minLevel: 17, maxLevel: 51, amount: 1, profession: 100, itemID: 720000},
				{minLevel: 37, maxLevel: 80, amount: 1, profession: 100, itemID: 792000},
				{minLevel: 48, maxLevel: 80, amount: 1, profession: 100, itemID: 719000},
				{minLevel: 52, maxLevel: 69, amount: 1, profession: 100, itemID: 768000},
				{minLevel: 81, maxLevel: 150, amount: 1, profession: 100, itemID: 1708000},
				{minLevel: 81, maxLevel: 150, amount: 1, profession: 100, itemID: 751000},
				{minLevel: 120, maxLevel: 150, amount: 5, profession: 100, itemID: 2447000},
				{minLevel: 120, maxLevel: 150, amount: 1, profession: 100, itemID: 2430000},
			],
			monday: [
				{minLevel: 3, maxLevel: 46, amount: 1, profession: 100, itemID: 702000},
				{minLevel: 26, maxLevel: 40, amount: 1, profession: 100, itemID: 761000},
				{minLevel: 27, maxLevel: 36, amount: 1, profession: 100, itemID: 760000},
				{minLevel: 38, maxLevel: 64, amount: 1, profession: 100, itemID: 792000},
				{minLevel: 65, maxLevel: 150, amount: 1, profession: 100, itemID: 1814000},
				{minLevel: 71, maxLevel: 150, amount: 1, profession: 100, itemID: 780000},
				{minLevel: 120, maxLevel: 150, amount: 1, profession: 100, itemID: 2444000},
			],
			tuesday: [
				{minLevel: 11, maxLevel: 57, amount: 1, profession: 100, itemID: 766000},
				{minLevel: 45, maxLevel: 80, amount: 1, profession: 100, itemID: 778000},
				{minLevel: 81, maxLevel: 150, amount: 1, profession: 100, itemID: 1818000},
				{minLevel: 81, maxLevel: 150, amount: 1, profession: 100, itemID: 756000},
				{minLevel: 120, maxLevel: 150, amount: 5, profession: 100, itemID: 2456000},
				{minLevel: 120, maxLevel: 150, amount: 2, profession: 100, itemID: 2450000},
			],
			wednesday: [
				{minLevel: 4, maxLevel: 67, amount: 1, profession: 100, itemID: 700000},
				{minLevel: 15, maxLevel: 49, amount: 1, profession: 100, itemID: 791000},
				{minLevel: 18, maxLevel: 49, amount: 1, profession: 100, itemID: 767000},
				{minLevel: 48, maxLevel: 79, amount: 1, profession: 100, itemID: 1812000},
				{minLevel: 120, maxLevel: 150, amount: 1, profession: 100, itemID: 2434000},
				{minLevel: 120, maxLevel: 150, amount: 1, profession: 100, itemID: 2449000},
			],
			thursday: [
				{minLevel: 8, maxLevel: 56, amount: 1, profession: 100, itemID: 708000},
				{minLevel: 28, maxLevel: 58, amount: 1, profession: 100, itemID: 759000},
				{minLevel: 59, maxLevel: 74, amount: 1, profession: 100, itemID: 752000},
				{minLevel: 63, maxLevel: 87, amount: 1, profession: 100, itemID: 1708000},
				{minLevel: 75, maxLevel: 150, amount: 1, profession: 100, itemID: 730000},
				{minLevel: 120, maxLevel: 150, amount: 3, profession: 100, itemID: 2433000},
			], 
			friday: [
				{minLevel: 3, maxLevel: 61, amount: 1, profession: 100, itemID: 705000},
				{minLevel: 21, maxLevel: 42, amount: 1, profession: 100, itemID: 715000},
				{minLevel: 42, maxLevel: 75, amount: 1, profession: 100, itemID: 1811000},
				{minLevel: 62, maxLevel: 88, amount: 1, profession: 100, itemID: 794000},
				{minLevel: 89, maxLevel: 150, amount: 1, profession: 100, itemID: 1824000},
				{minLevel: 120, maxLevel: 150, amount: 1, profession: 100, itemID: 2451000},
				{minLevel: 129, maxLevel: 150, amount: 2, profession: 100, itemID: 2453000},
			],
			saturday: [
				{minLevel: 5, maxLevel: 41, amount: 1, profession: 100, itemID: 707000},
				{minLevel: 5, maxLevel: 51, amount: 1, profession: 100, itemID: 1807000},
				{minLevel: 35, maxLevel: 53, amount: 1, profession: 100, itemID: 737000},
				{minLevel: 42, maxLevel: 75, amount: 1, profession: 100, itemID: 725000},
				{minLevel: 52, maxLevel: 77, amount: 1, profession: 100, itemID: 768000},
				{minLevel: 76, maxLevel: 150, amount: 1, profession: 100, itemID: 1756000},
				{minLevel: 78, maxLevel: 150, amount: 1, profession: 100, itemID: 1819000},
				{minLevel: 79, maxLevel: 150, amount: 1, profession: 100, itemID: 764000},
				{minLevel: 81, maxLevel: 150, amount: 1, profession: 100, itemID: 794000},
				{minLevel: 120, maxLevel: 150, amount: 5, profession: 100, itemID: 2435000},
			],
		},
		others: [
			{minLevel: 0, maxLevel: 150, amount: 15, profession: 100, itemID: 2160000},
			{minLevel: 0, maxLevel: 150, amount: 15, profession: 100, itemID: 2161000},
			{minLevel: 0, maxLevel: 150, amount: 15, profession: 100, itemID: 2162000},
			{minLevel: 0, maxLevel: 150, amount: 15, profession: 100, itemID: 2163000},
			
			{minLevel: 20, maxLevel: 150, amount: 1, profession: 1, itemID: 1940000},
			{minLevel: 20, maxLevel: 150, amount: 1, profession: 1, itemID: 1871000},
			{minLevel: 20, maxLevel: 150, amount: 1, profession: 1, itemID: 1879000},
			
			{minLevel: 20, maxLevel: 150, amount: 1, profession: 2, itemID: 1939000},
			{minLevel: 20, maxLevel: 150, amount: 1, profession: 2, itemID: 1890000},
			{minLevel: 20, maxLevel: 150, amount: 1, profession: 2, itemID: 1898000},
			
			{minLevel: 20, maxLevel: 150, amount: 1, profession: 3, itemID: 1938000},
			{minLevel: 20, maxLevel: 150, amount: 1, profession: 3, itemID: 1910000},
			{minLevel: 20, maxLevel: 150, amount: 1, profession: 3, itemID: 1916000},
			
			{minLevel: 20, maxLevel: 150, amount: 1, profession: 4, itemID: 1937000},
			{minLevel: 20, maxLevel: 150, amount: 1, profession: 4, itemID: 1928000},
			{minLevel: 20, maxLevel: 150, amount: 1, profession: 4, itemID: 1934000},
		],
        init: function () {
			var menuContainer = $('<div id="WTK-menu-DailyItemHelper" class="menulink" onclick="WTK.DailyItemHelper.showDailyItems();" title="' + WTKlang.showDailyItems + '" />').css('background-image', 'url(' + WTK.Images.menudailyitems + ')').css('background-position', '0px 0px').mouseenter(function () {
				$(this).css('background-position', '-25px 0px');
			}).mouseleave(function () {
				$(this).css('background-position', '0px 0px');
			});
			$('#ui_menubar').append($('<div class="ui_menucontainer" />').append(menuContainer).append('<div class="menucontainer_bottom" />'));
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
				'height': '380px',
			});
			
			scrollPane.appendContent('<div style="float: left; padding: 10px 30px 5px 5px;"><b>'+WTKlang.saloon + ':</b><br>'+WTK.DailyItemHelper.getQuestsFromArray(WTK.DailyItemHelper.others)+'</div>');
			scrollPane.appendContent('<div style="float: left; padding: 10px 30px 5px 5px;"><b>'+WTKlang.indianVillage + ':</b><br>'+WTK.DailyItemHelper.getQuestsFromArray(WTK.DailyItemHelper.indianVillage)+'</div>');
			scrollPane.appendContent('<div style="float: left; padding: 10px 30px 5px 5px;"><b>'+WTKlang.ghostTown + ':</b><br>'+WTK.DailyItemHelper.getQuestsFromArray(WTK.DailyItemHelper.ghostTown)+'</div>');
			scrollPane.appendContent('<div style="clear:both"></div>');
			scrollPane.appendContent('<div style="float: left; padding: 10px 30px 5px 5px;"><b>'+WTKlang.monday + ':</b><br>'+WTK.DailyItemHelper.getQuestsFromArray(WTK.DailyItemHelper.daily.monday)+'</div>');
			scrollPane.appendContent('<div style="float: left; padding: 10px 30px 5px 5px;"><b>'+WTKlang.tuesday + ':</b><br>'+WTK.DailyItemHelper.getQuestsFromArray(WTK.DailyItemHelper.daily.tuesday)+'</div>');
			scrollPane.appendContent('<div style="float: left; padding: 10px 30px 5px 5px;"><b>'+WTKlang.wednesday + ':</b><br>'+WTK.DailyItemHelper.getQuestsFromArray(WTK.DailyItemHelper.daily.wednesday)+'</div>');
			scrollPane.appendContent('<div style="float: left; padding: 10px 30px 5px 5px;"><b>'+WTKlang.thursday + ':</b><br>'+WTK.DailyItemHelper.getQuestsFromArray(WTK.DailyItemHelper.daily.thursday)+'</div>');
			scrollPane.appendContent('<div style="clear:both"></div>');
			scrollPane.appendContent('<div style="float: left; padding: 10px 30px 5px 5px;"><b>'+WTKlang.friday + ':</b><br>'+WTK.DailyItemHelper.getQuestsFromArray(WTK.DailyItemHelper.daily.friday)+'</div>');
			scrollPane.appendContent('<div style="float: left; padding: 10px 30px 5px 5px;"><b>'+WTKlang.saturday + ':</b><br>'+WTK.DailyItemHelper.getQuestsFromArray(WTK.DailyItemHelper.daily.saturday)+'</div>');
			scrollPane.appendContent('<div style="float: left; padding: 10px 30px 5px 5px;"><b>'+WTKlang.sunday + ':</b><br>'+WTK.DailyItemHelper.getQuestsFromArray(WTK.DailyItemHelper.daily.sunday)+'</div>');
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