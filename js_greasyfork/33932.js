// ==UserScript==
// @name         Exportador de Batallas a CSV
// @description  Exporta batallas de The West a hoja de cálculo formato csv
// @version      0.23
// @author       jarograv
// @match           https://*.the-west.net/game.php*
// @match           https://*.the-west.de/game.php*
// @match           https://*.the-west.pl/game.php*
// @match           https://*.the-west.nl/game.php*
// @match           https://*.the-west.se/game.php*
// @match           https://*.the-west.ro/game.php*
// @match           https://*.the-west.com.pt/game.php*
// @match           https://*.the-west.cz/game.php*
// @match           https://*.the-west.es/game.php*
// @match           https://*.the-west.ru/game.php*
// @match           https://*.the-west.com.br/game.php*
// @match           https://*.the-west.org/game.php*
// @match           https://*.the-west.hu/game.php*
// @match           https://*.the-west.gr/game.php*
// @match           https://*.the-west.dk/game.php*
// @match           https://*.the-west.sk/game.php*
// @match           https://*.the-west.fr/game.php*
// @match           https://*.the-west.it/game.php*
// @grant        	none
// @run-at          document-end
// @namespace https://greasyfork.org/users/2707
// @downloadURL https://update.greasyfork.org/scripts/33932/Exportador%20de%20Batallas%20a%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/33932/Exportador%20de%20Batallas%20a%20CSV.meta.js
// ==/UserScript==
var fortbattleImport = {
	versionControl: {
		version: 0.23,
		isOutdated: function() {
			return fortbattleImport.localData.storage.latestVersion > fortbattleImport.versionControl.version;
		},
		notifyOutdated: function() {
			if (fortbattleImport.versionControl.isOutdated()) {
                console.log("Exportador de Batallas está desactualizado");
				new west.gui.Dialog('Exportador de Batallas está desactualizado', 'Hay una nueva versión disponible. ¿Quiere installarla?', west.gui.Dialog.SYS_WARNING).addButton("¡Instalar!", function() {
					window.open('https://raw.githubusercontent.com/jarograv/Fortbattle-Export/master/Fortbattle-Export.user.js', '_blank');
				}).addButton("Close", function() {}).show();
			}
		}
	},
	localData:{
        storage: null,
        init: function() {
            $.get("https://raw.githubusercontent.com/jarograv/Fortbattle-Export/master/localData.json", function(data) {
                fortbattleImport.localData.storage = data;
                fortbattleImport.versionControl.notifyOutdated();
            }).fail(function() {
            });
        }
	},
	scriptWindow: {
		registerWestApi: function() {
			var content = "Exportador de Batallas, desarrollado por jarograv. Comentarios, informes de errores, e ideas pueden ser publicadas en el foro internacional.<br><br> <b>Modo de empleo:</b> <br>1. Introduzca la ID de la primera batalla que desea exportar.<br>2. Introduzca la ID de la segunda batalla que desea exportar. Como alternativa, deje este campo en blanco si desea exportar solo una batalla.<br>3.Clic en el botón \"Exportar\".<br>";
            var rangeStart = new west.gui.Textfield('rangeStart','text');
            var rangeEnd = new west.gui.Textfield('rangeEnd','text');
            var saveBtn = new west.gui.Button("Exportar", function () {
				fortbattleImport.runScript.runExport();
			});
			TheWestApi.register('Fortbattle-Export', 'Fortbattle-Export', '2.63', Game.version.toString(), 'jarograv', 'https://github.com/jarograv/Fortbattle-Export').setGui($('<div>' + content +
      '</div>').append('<br><div><b>ID primera batalla:</b>').append(rangeStart.getMainDiv()).append('</div><br><div><b>ID última batalla:</b></div>').append(rangeEnd.getMainDiv()).append('<br>').append(saveBtn.getMainDiv()).append('<br><i>Si no sabe como obtener las IDs de las batallas <a href="https://github.com/jarograv/Fortbattle-Export/blob/master/Battle%20ID%20Instructions.png?raw=true">clic aquí</a>.</i><br><i>Se recomienda no intentar exportar más de 25 batallas de una vez.</i>').append('<br>Versión actual: ').append(fortbattleImport.versionControl.version));
		}
	},
	runScript: {
        runExport: function() {
            $.getScript('https://rawgit.com/jarograv/Fortbattle-Export/master/importScript.js', function() {
            });
        }
	}
};

fortbattleImport.localData.init();
fortbattleImport.scriptWindow.registerWestApi();