// ==UserScript==
// @name The West Fortbattle Tool
// @namespace The West Fortbattle Tool
// @author westernblumi
// @description Fort battle tools for The West!
// @include https://*.the-west.*/game.php*
// @version	1.11
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/32218/The%20West%20Fortbattle%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/32218/The%20West%20Fortbattle%20Tool.meta.js
// ==/UserScript==
// translation: westernblumi(German & English), pepe100(Spanish), Ruslan Jackson(Italiano)
(function(fn) {
    var script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.textContent = '(' + fn.toString() + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
})

(function() {
    TWFBTstart = {
        version: '1.11',
        langs: {
            en: {
                language: 'English',
                aim: 'Aiming',
                adventurer: 'Adventurer',
                attack: 'Attack',
                bonusByClothes: 'Bonus by Clothes',
                bonusBySets: 'Bonus by Sets',
                bonusBySkill: 'Bonus by skill',
                bonusDefault: 'Defaultbonus',
                bonusTotal: 'Total',
                calcBonus: 'Calculate fort battle bonus',
                calculator: 'Calculator',
                clear: 'Clear Window',
                clothes: 'Clothes',
                damage: 'Damage bonus',
                defense: 'Defense',
                dodge: 'Dodging',
                duelist: 'Duelist',
                endurance: 'Stamina',
                hide: 'Hiding',
                leadership: 'Leadership',
                lifepoints: 'Lifepoints',
                newFormula: 'new formula',
                oldFormula: 'old formula',
                pa: 'Premium (soldier and worker fort battle bonus)',
                pitfall: 'Setting traps',
                resistance: 'Resistance',
                scriptName: 'The West Fortbattle Tool',
                soldier: 'Soldier',
                worker: 'Worker',
                name: 'Name',
                author: 'Author: </b>',
                version: 'Version: </b>',
                update: 'Update',
                updateAvailable: 'A new version of the script is available',
				showFurtherStatistics: 'Show more statistics',
                team: 'Team',
                player: 'Player',
                playerCount: 'Number of players',
                survivingPlayerCount: 'Surviving players',
                offlinePlayerCount: 'Offline players',
                adventurers: 'Adventurers',
                duelists: 'Duelists',
                greenhorns: 'Greenhorns',
                soldiers: 'Soldiers',
                workers: 'Workers',
                maxhp: 'Maximum healthpoints',
                starthp: 'Health at the start of the battle',
                finishedhp: 'Health at the end of the battle',
                totalcauseddamage: 'Total damage inflicted',
                hitcount: 'Hits',
                misscount: 'Misses',
                dodgecount: 'Dodges',
                takenhits: 'Hits taken',
                crithits: 'Critical Hits',
                diedwhen: 'Average lifetime',
                onlinecount: 'Average online rounds',
                takendamage: 'Taken damage',
                charlevel: 'Average level',
                criticalHits: 'Kritische Treffer',
				points: 'Points',
				ranking: 'Ranking',
				town: 'Town',
				attacker: 'Attacker',
				defender: 'Defender',
				charclass: 'Class',
				side: 'Side',
				playerName: 'Player name',
				offliner: 'Offline players',
				totalShots: 'Total shots',
				hitPercentage: 'Hits in %',
				dodgePercentage: 'Dodges in %',
				damagePerHit: 'Damage per hit',
				averageWeaponDamage: 'Average weapon damage',
				shotsPerPlayer: 'Shots',
				order: 'Order of movement',
				rank: 'Rank',
				weapons: 'Weapons',
				weapon: 'Weapon',
				damageBuff: 'Damage buff',
				noBuff: 'No damage buff',
				sectorBonus: 'Sector bonus',
            },
            de: {
                language: 'German (Deutsch)',
                aim: 'Zielen',
                adventurer: 'Abenteurer',
                attack: 'Angriff',
                bonusByClothes: 'Bonus durch Bekleidung',
                bonusBySets: 'Bonus durch Sets',
                bonusBySkill: 'Bonus durch Skillung',
                bonusDefault: 'Grundbonus',
                bonusTotal: 'Gesamt',
                calcBonus: 'Berechne Fortkampf Bonus',
                calculator: 'Rechner',
                clear: 'Lösche Berechnungen',
                clothes: 'Klamotten',
                damage: 'Schadensbonus',
                defense: 'Verteidigung',
                dodge: 'Ausweichen',
                duelist: 'Duellant',
                endurance: 'Ausdauer',
                hide: 'Verstecken',
                leadership: 'Leiten',
                lifepoints: 'Lebenspunkte',
                newFormula: 'neue Formel',
                oldFormula: 'alte Formel',
                pa: 'Premium (Soldaten und Arbeiterbonus)',
                pitfall: 'Fallen stellen',
                resistance: 'Widerstand',
                scriptName: 'The West FK Tool',
                soldier: 'Soldat',
                worker: 'Arbeiter',
                name: 'Name',
                author: 'Autor: </b>',
                version: 'Version: </b>',
                update: 'Update',
                updateAvailable: 'Für das Script ist eine neue Version erhältlich',
				showFurtherStatistics: 'Zeige weitere Statistiken',
                team: 'Team',
                player: 'Spieler',
                playerCount: 'Spielerzahl',
                survivingPlayerCount: 'Überlebende Spieler',
                offlinePlayerCount: 'Offliner',
                adventurers: 'Abenteurer',
                duelists: 'Duellanten',
                greenhorns: 'Grennhorns',
                soldiers: 'Soldaten',
                workers: 'Arbeiter',
                maxhp: 'Maximale Lebenspunkte',
                starthp: 'Lebenspunkte am Anfang',
                finishedhp: 'Lebenspunkte am Ende',
                totalcauseddamage: 'Schaden',
                hitcount: 'Treffer',
                misscount: 'Fehlschüsse',
                dodgecount: 'Ausweicher',
                takenhits: 'Eingesteckte Treffer',
                crithits: 'Kritische Treffer',
                diedwhen: 'Durchschnittliche Lebensdauer',
                onlinecount: 'Durchschnittliche Anzahl an Onlinerunden',
                takendamage: 'Eingesteckter Schaden',
                charlevel: 'Level',
                criticalHits: 'Kritische Treffer',
				points: 'Punktzahl',
				ranking: 'Rangliste',
				town: 'Stadt',
				attacker: 'Angreifer',
				defender: 'Verteidiger',
				charclass: 'Klasse',
				side: 'Seite',
				playerName: 'Spielername',
				offliner: 'Offliner',
				totalShots: 'Abgegebene Schüsse',
				hitPercentage: 'Treffer in %',
				dodgePercentage: 'Ausweicher in %',
				damagePerHit: 'Schaden pro Treffer',
				averageWeaponDamage: 'Durchschnittlicher Waffenschaden',
				shotsPerPlayer: 'Abgegebene Schüsse',
				order: 'Zugreihenfolge',
				rank: 'Rang',
				weapons: 'Waffen',
				weapon: 'Waffe',
				damageBuff: 'Schadensbuff',
				noBuff: 'Kein Schadensbuff',
				sectorBonus: 'Sektorbonus',
            },
            es: {
                language: 'Español',
				aim: 'Apuntar',
				adventurer: 'Adventurero',
				attack: 'Ataque',
				bonusByClothes: 'Bono por Ropas',
				bonusBySets: 'Bono por Conjuntos',
				bonusBySkill: 'Bono por Habilidad',
				bonusDefault: 'Bono por Defecto',
				bonusTotal: 'Total',
				calcBonus: 'Calcular Bono de Batalla',
				calculator: 'Calculadora',
				clear: 'Limpiar Ventana',
				clothes: 'Ropa',
				damage: 'Bono de Daño',
				defense: 'Defensa',
				dodge: 'Eludir',
				duelist: 'Duelista',
				endurance: 'Condición',
				hide: 'Esconder',
				leadership: 'Liderazgo',
				lifepoints: 'Puntos de Vida',
				newFormula: 'fórmula nueva',
				oldFormula: 'fórmula antigua',
				pa: 'Premium (bonus Soldado/Trabajador)',
				pitfall: 'Poner trampas',
				resistance: 'Resistencia',
				scriptName: 'The West Fortbattle Tool',
				soldier: 'Soldado',
				worker: 'Trabajador',
				name: 'Nombre',
				author: 'Autor: ',
				version: 'Versión: ',
				update: 'actualizar',
				updateAvailable: 'Una nueva versión del script está disponible',
				showFurtherStatistics: 'Mostrar más estadísticas',
				team: 'Equipo',
				player: 'Jugador',
				playerCount: 'Número de jugadores',
				survivingPlayerCount: 'Jugadores supervivientes',
				offlinePlayerCount: 'Jugadores Off',
				adventurers: 'Aventureros',
				duelists: 'Duelistas',
				greenhorns: 'Novatos',
				soldiers: 'Soldados',
				workers: 'Trabajadores',
				maxhp: 'Puntos de salud máximos',
				starthp: 'Vida al inicio de la batalla',
				finishedhp: 'Vida al final de la batalla',
				totalcauseddamage: 'Total daño causado',
				hitcount: 'Aciertos realizados',
				misscount: 'Fallos',
				dodgecount: 'Eludidos',
				takenhits: 'Aciertos recibidos',
				crithits: 'Críticos',
				diedwhen: 'Tiempo de vida promedio',
				onlinecount: 'Media de rondas On',
				takendamage: 'Daño recibido',
				charlevel: 'Nivel medio',
				criticalHits: 'Críticos',
				points: 'Puntos',
				ranking: 'Ranking',
				town: 'Ciudad',
				attacker: 'Atacante',
				defender: 'Defensor',
				charclass: 'Clase',
				side: 'Lado',
				playerName: 'Nombre jugador',
				offliner: 'Jugadores Off',
				totalShots: 'Total disparos',
				hitPercentage: '% Aciertos',
				dodgePercentage: '% Eludidos',
				damagePerHit: 'Daño por acierto',
				averageWeaponDamage: 'Daño medio arma',
				shotsPerPlayer: 'Disparos',
				order: 'Orden de movimientos',
				rank: 'Rango',
				weapons: 'Armas',
				weapon: 'Arma',
				damageBuff: 'Damage buff',
				noBuff: 'No damage buff',
				sectorBonus: 'Sector bonus',
            },
			it: {
				language: 'Italiano',
				aim: 'Mira',
				adventurer: 'Avventuriero',
				attack: 'Attaco',
				bonusByClothes: 'Bonus dei Vestiti',
				bonusBySets: 'Bonus dei Set Sets',
				bonusBySkill: 'Bonus delle skill',
				bonusDefault: 'Bonus di default',
				bonusTotal: 'Totale',
				calcBonus: 'Calcola il bonus batalgie forti',
				calculator: 'Calcolatrice',
				clear: 'Axxera Finestra',
				clothes: 'Vestiti',
				damage: 'Bonus danni',
				defense: 'Bonus difesa',
				dodge: 'Schivata',
				duelist: 'Duellante',
				endurance: 'Robustezza',
				hide: 'Nascosto',
				leadership: 'Commando',
				lifepoints: 'Punti vita',
				newFormula: 'nuova formula',
				oldFormula: 'vecchia formula',
				pa: 'Premium (Bonus bataglia forte per il soldato e lavoratore)',
				pitfall: 'Trappole',
				resistance: 'Resistenza',
				scriptName: 'The West Tool per le Batagli Forti',
				soldier: 'Soldato',
				worker: 'Lavoratore',
				name: 'Nome',
				author: 'Autore: ',
				version: 'Versione: ',
				update: 'Aggiorna',
				updateAvailable: 'Una nuova versione dello script è gia disponibile',
				showFurtherStatistics: 'Show more statistics',
                team: 'Team',
                player: 'Player',
                playerCount: 'Number of players',
                survivingPlayerCount: 'Surviving players',
                offlinePlayerCount: 'Offline players',
                adventurers: 'Adventurers',
                duelists: 'Duelists',
                greenhorns: 'Greenhorns',
                soldiers: 'Soldiers',
                workers: 'Workers',
                maxhp: 'Maximum healthpoints',
                starthp: 'Health at the start of the battle',
                finishedhp: 'Health at the end of the battle',
                totalcauseddamage: 'Total damage inflicted',
                hitcount: 'Hits',
                misscount: 'Misses',
                dodgecount: 'Dodges',
                takenhits: 'Hits taken',
                crithits: 'Critical Hits',
                diedwhen: 'Average lifetime',
                onlinecount: 'Average online rounds',
                takendamage: 'Taken damage',
                charlevel: 'Average level',
                criticalHits: 'Kritische Treffer',
				points: 'Points',
				ranking: 'Ranking',
				town: 'Town',
				attacker: 'Attacker',
				defender: 'Defender',
				charclass: 'Class',
				side: 'Side',
				playerName: 'Player name',
				offliner: 'Offline players',
				totalShots: 'Total shots',
				hitPercentage: 'Hits in %',
				dodgePercentage: 'Dodges in %',
				damagePerHit: 'Damage per hit',
				averageWeaponDamage: 'Average weapon damage',
				shotsPerPlayer: 'Shots',
				order: 'Order of movement',
				rank: 'Rank',
				weapons: 'Weapons',
				weapon: 'Weapon',
				damageBuff: 'Damage buff',
				noBuff: 'No damage buff',
				sectorBonus: 'Sector bonus',
			}, 
        }
    };
    TWFBT = {
        name: 'The West Fortbattle Tool',
        author: 'westernblumi',
        minGame: '2.4',
        maxGame: Game.version.toString(),
        website: 'https://greasyfork.org/de/scripts/22880-the-west-fortbattle-tool',
        updateUrl: 'https://raw.githack.com/westernblumi/thewest/master/skriptUpdater.js',
        side: 'attack',
        pa: false,
        characterClass: Character.charClass,
        formula: 'newFormula',
        Images: {
            settings: 'data:image/jpeg;base64,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',
			charClasses: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAABLCAYAAACvH90wAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAF1ElEQVRYR9VXa2zTVRQnlI5Hu3brY936WGn36CjQDRgbKGUPRtgGbGriFKISI69kiZUYFxUQnDyUoFXgg/Exo0MSF53CcFnY1ARjIgIj46sxEo2fjZ9I5oef53f//Zc+B6IJepJfbv/3nt8595x7z723s/5t6RVMCm4KkGj5zf4ZZbguVImD2x/DtaOH8PvA27jatw97m5uwuGgeDQ1ratky3B1txPVTJ/HHJ2fwS093Er9tfwIXW9eg3VKY00AvPereUok6SP6s0ofF88w0kBbC5P7NXWnKI21N2OAuxfBCL36sqUySe6wlJDMHSbn5/ZYtacS424W2QrNqaeBaXZ0i77C59CQmJUm8sakF64VEYrPZpLVWK36ILMWrrhL02KwkE0m5+XVkGX5au1xNkZ7osUlIR/1+HPO68L7XgyNlTjQXLcjyPPms3YnLwSAuBQO4HIlgsLpaeTzmKcFhtxuDAQ8OOBzYainOirmXWXzTU4pBrx+fVnhxSn4f95ThA78b7/jK8FJJCXqXRDBbm3LWhhmmAcb0QqkDcY8LR4R8pNyN/eL5oVX1CAQCJObfKNYCA7wmo1rPlUXz0Ti/EF6jWtsZibrc9d6+txIVxAVTgulEy2/2zyix+uoKvPbwZoxv3oDru5/MLMmYppYtse41DbjQ1YFxKYKzDbX4sL4WE+2t+DW9JLMMRFmSF5/ahrPLwtgjv9tljTsEbPeEQxhduzq1JNNCiLMkv1vbiJ3BcmzyuvH80jBeX7kMfU67Ko6dQX9qSTIHSZn6an0rJtZF0ektw4nGFXi02Ip1QnrGYccewYN2O4ZulSSTmJTpa21RnGu6D51SOe+JAZblRomx22rBQZ8PHcXFeFEKI1GSXIWkTNEiLdMDPdEjiWw5dcaez3OcsTAmxsYYSaBHGuI3k5Yv5iizyEFmlYoq2zJVzoQGZ8o2JcZ1pALBKTJGtnpfvnXWJaZqWqbG2Jgc1cp3wmNeoi53vbfvnRQIHhecENwQ/Cn4WfCx4LbT3itAi5zdp9uaMRipwbvtnehtbEDAXMCEfSQwUjFThowGAzpWrMC5++vV0owtrsJITRCjkRAGQgvhMxppYEBgUIyEdFnlanlkVQMWmUw44HLiG6nnS3LFXK2txVhNBUbEAA0WGebQQLdG02QgKjfEGfF0qLQEYbMZL4uB0SVV6vaYFAMXFlUpcs6SvPhAlxr8Uggk0gBn8IX0XalNGAhX5y5JehmXRPE2HKvy47hbmwENTCT6v10SRr/fQ3J6SY6FwxitDioPjHO0OoBjZZqBHc5ifF7uw1lJ2r6AO8tzfL3JjPOiMBGqUgaIcZnmK6VaCM0Wk1x2TnjmmEh+S6NpErUbjNhhL8Jpnx/nQwHlnVMdXVShpk4DPStXk0g8rVgp0h+auwAbrYXYJkZGKssxJsTzss5DQR8OShhmMSB6hzX1bIktmDMbjrkG+I3zsM5mwtYiGyoK5sMl/TL+nECu6Pyil6S+t/8HJUnJPElST5O8wkT0ZZ5hqeeYjPcn9LKkn6fjSX+pencRu2y25G/2J07PPk39lqhDnwqtTgeictDzDUbw/Umwn+O5zm113dADFd9IvDf5kGPLbxrkeK6SnGZsOll/6ergt3oNynjOkiSZMVKJHlPJ+lOS49SjvkbTJDltKume+Uy+E88qYRxkbH83ZnVL6tnWM1xnsSR/z5RtSt/drjOFO6ef01I7ShLDt9ed7jBdMvf1He3tey+ZJalP+bYniXpWMKtHl9eqG4RtIstE/veI22HDlnKvImWiMVgJt3ZLZj9cBUqhWd5fu/m/UramDn6zn4ZzbZI4p0YPVORvXjFXhMiW3+zneCKEtGWb0mOkJxL49txltyUNsZ/j1KO+RtNkmgM6mR5J5H9JtvzWyQT1NZomWZ7pkcQWKcXbef5HMauSZDZnyjZXQ3SJrA0TK5bHChXoIRM0bJH6pp6mni0cUFPTc8CW34n1/U88XGfN+gumzSS+dOrbNAAAAABJRU5ErkJggg==',
		},
        updateLang: function() {
            var lg = TWFBTstart.langs;
            TWFBT.lang = lg[Game.locale.substr(0, 2)] ? Game.locale.substr(0, 2) : 'en';
            TWFBTlang = lg[TWFBT.lang];
        },
    };
    TWFBT.updateLang();
    TWFBT.Skript = {
        init: function() {
			console.log('SUCCESSFULL LAUNCH OF The West Fortbattle Tool');
			
            TWFBT['Calculator'].init();
            TWFBT['Statistics'].init();
			TWFBT['PreBattleChars'].init();

            var menuContainer = $('<div id="TWFBT-menu" class="menulink" onClick="TWFBT.GUI.openTWFBTWindow();" title="' + TWFBTlang.scriptName + '" />').css('background-image', 'url(' + TWFBT.Images.settings + ')').css('background-position', '0px 0px').mouseenter(function() {
                $(this).css('background-position', '-25px 0px');
            }).mouseleave(function() {
                $(this).css('background-position', '0px 0px');
            });
            $('#ui_menubar').append($('<div class="ui_menucontainer" />').append(menuContainer).append('<div class="menucontainer_bottom" />'));
        },
    };
    TWFBT.GUI = {
        openTWFBTWindow: function() {
            TWFBT.GUI.open();
            TWFBT.GUI.calcSkill();
        },
        open: function() {
            TWFBT.GUI.window = wman.open('TWFBT', TWFBTlang.scriptName, 'noreload').setMiniTitle(TWFBTlang.scriptName).setMaxSize(1268, 838);
            TWFBT.GUI.window.addTab(TWFBTlang.calculator, 'TWFBTCalcSkill', TWFBT.GUI.calcSkill);
        },
        getDefault: function(tab) {
            TWFBT.GUI.window.setResizeable(false).setSize(748, 471).clearContentPane().removeClass('nocloseall').setTitle('TWFBTCalcSkill');
            TWFBT.GUI.window.dontCloseAll = false;
            $(TWFBT.GUI.window.getContentPane()).css('margin-top', '0px');
            var wnd = TWFBT.GUI.window.getMainDiv();
            $('.textart_title', wnd).css('display', '');
            TWFBT.GUI.window.activateTab(tab);
        },
        calcSkill: function() {

            TWFBT.GUI.getDefault('TWFBTCalcSkill');
            TWFBT.GUI.window.setTitle(TWFBTlang.scriptName);

            var featScroll = new west.gui.Scrollpane();

            $(featScroll.getMainDiv()).css({
                'margin-top': '10px'
            });

            var calcButton = new west.gui.Button(TWFBTlang.calcBonus, function() {
                TWFBT.Calculator.calcSkills();
            });
            var clearButton = new west.gui.Button(TWFBTlang.clear, function() {
                clearTable();
            });

            var paCheckbox = new west.gui.Checkbox().setLabel(TWFBTlang.pa).setSelected(Premium.hasBonus('character'));
            TWFBT.pa = Premium.hasBonus('character');
            paCheckbox.setCallback(function() {
                TWFBT.pa = paCheckbox.isSelected();
            }.bind(this));

            var charClassBox = new west.gui.Combobox();
            charClassBox.addItem('adventurer', TWFBTlang.adventurer);
            charClassBox.addItem('duelist', TWFBTlang.duelist);
            charClassBox.addItem('worker', TWFBTlang.worker);
            charClassBox.addItem('soldier', TWFBTlang.soldier);
            charClassBox.select(Character.charClass);
            TWFBT.characterClass = Character.charClass;
            charClassBox.addListener(function(val) {
                TWFBT.characterClass = val;
            });

            var modeBox = new west.gui.Combobox();
            modeBox.addItem('attack', TWFBTlang.attack);
            modeBox.addItem('defense', TWFBTlang.defense);
            modeBox.addListener(function(val) {
                TWFBT.side = val;
            });

            featScroll.appendContent(modeBox.getMainDiv());
            featScroll.appendContent(' ');
            featScroll.appendContent(paCheckbox.getMainDiv());
            featScroll.appendContent(' ');
            featScroll.appendContent(charClassBox.getMainDiv());
            featScroll.appendContent('<br>');
            featScroll.appendContent(calcButton.getMainDiv());
            featScroll.appendContent(clearButton.getMainDiv());
            featScroll.appendContent('<table border="1" id="TWFBTCalculatorTable"></table>');
            $(TWFBT.GUI.window.getContentPane()).append(featScroll.getMainDiv());

            var clearTable = function() {
                $('#TWFBTCalculatorTable').empty();
            }
        },
    };

    TWFBT.Calculator = {
        init: function() {

        },

        resetValues: function() {
            TWFBT.Calculator.values = {
                offense: 0,
                defense: 0,
                offense_skillwithbonus: 0,
                defense_skillwithbonus: 0,
                offense_defaultbonus: 25,
                defense_defaultbonus: 10,
                offense_fortbattlebonus: 0,
                defense_fortbattlebonus: 0,
                offense_setbonus: 0,
                defense_setbonus: 0,
                damage: '',
				damageSector: 0,
				damageMin: 0,
				damageMax: 0,
                resistance: 0,
                resistanceSkill: 0,
                lifepoints: 0,
            };
        },

        calcSkills: function() {
            this.resetValues();
            var side_skill = this.getSideSkill(TWFBT.side);
            var soldierBonus = this.getSoldierBonus(TWFBT.pa, TWFBT.characterClass);
            this.calcSkillWithBonus(side_skill, soldierBonus);
            this.calcClothBonus();
            TWFBT.Calculator.values.lifepoints = Character.maxHealth;
            TWFBT.Calculator.values.resistanceSkill = Math.round(300 * CharacterSkills.getSkill(side_skill).getPointsWithBonus() / Character.maxHealth);
            this.addBonusesTogether();
            var workerBonus = this.getWorkerBonus(TWFBT.pa, TWFBT.characterClass);
            TWFBT.Calculator.values.offense *= workerBonus;
            TWFBT.Calculator.values.defense *= workerBonus;
			
			
			var min = TWFBT.Calculator.values.damageMin + TWFBT.Calculator.values.damageSector + ((TWFBT.Calculator.values.damageMin + TWFBT.Calculator.values.damageSector) * CharacterSkills.getSkill('leadership').getPointsWithBonus() / Character.maxHealth);
			var max = TWFBT.Calculator.values.damageMax + TWFBT.Calculator.values.damageSector + ((TWFBT.Calculator.values.damageMax + TWFBT.Calculator.values.damageSector) * CharacterSkills.getSkill('leadership').getPointsWithBonus() / Character.maxHealth);
			
			TWFBT.Calculator.values.damage = Math.round(min).toString() + '-' + Math.round(max).toString();
			
            this.prettifyResults();

            window.setTimeout(function() {
                TWFBT.Calculator.showData(side_skill);
            }, 1000);

        },

        calcClothBonus: function() {
            var sets = {};
            for (item in Wear.wear) {
                if (Wear.wear.hasOwnProperty(item)) {
                    var item_obj = Wear.wear[item].obj;
                    TWFBT.Calculator.values.defense_fortbattlebonus += item_obj.bonus.fortbattle.defense;
                    TWFBT.Calculator.values.defense_fortbattlebonus += item_obj.bonus.fortbattlesector.defense;
                    TWFBT.Calculator.values.offense_fortbattlebonus += item_obj.bonus.fortbattle.offense;
                    TWFBT.Calculator.values.offense_fortbattlebonus += item_obj.bonus.fortbattlesector.offense;
                    //TWFBT.Calculator.values.damage += item_obj.bonus.fortbattlesector.damage;
					TWFBT.Calculator.values.damageSector += item_obj.bonus.fortbattlesector.damage;
					if(item_obj.type === 'left_arm') {
						TWFBT.Calculator.values.damageMax = item_obj.getDamage(Character).max;
						TWFBT.Calculator.values.damageMin = item_obj.getDamage(Character).min;
					}
					
                    TWFBT.Calculator.values.resistance += item_obj.bonus.fortbattle.resistance;

                    for (j = 0; j < item_obj.bonus.item.length; j++) {
                        switch (item_obj.bonus.item[j].name) {
                            case 'offense':
                                TWFBT.Calculator.values.offense_fortbattlebonus += item_obj.bonus.item[j].value;
                                break;
                            case 'defense':
                                TWFBT.Calculator.values.defense_fortbattlebonus += item_obj.bonus.item[j].value;
                                break;
                            case 'damage':
                                //TWFBT.Calculator.values.damage += item_obj.bonus.item[j].value;
								TWFBT.Calculator.values.damageSector += item_obj.bonus.fortbattlesector.damage;
                                break;
                        }
                    }
                    //Collect all set information
                    if (item_obj.set != null) {
                        if (sets[item_obj.set] == undefined) {
                            sets[item_obj.set] = 1;
                        } else {
                            sets[item_obj.set] += 1;
                        }
                    }
                }
            }

            //Calc set bonus
            for (var set in sets) {
                if (sets.hasOwnProperty(set)) {
                    var setbonusArray = [0, 0, 0, 0];
                    setbonusArray = this.getSetBonus(set, sets[set]);
                    TWFBT.Calculator.values.offense_setbonus += setbonusArray[0];
                    TWFBT.Calculator.values.defense_setbonus += setbonusArray[1];
                    //TWFBT.Calculator.values.damage += setbonusArray[2];
					TWFBT.Calculator.values.damageSector += setbonusArray[2];
                    TWFBT.Calculator.values.resistance += setbonusArray[3];
                }
            }
        },

        getSetBonus: function(set, quantity) {
            var bonusResultArray = {
                offense: 0,
                defense: 0,
                damage: 0,
                resistance: 0
            };
            var bonuses = west.storage.ItemSetManager._setList[set].getMergedStages(quantity);

            for (var i = 0; i < bonuses.length; i++) {
                if (bonuses[i].key == 'level') {
                    if (bonuses[i].bonus.name == 'damage') {
                        bonusResultArray['damage'] += bonuses[i].bonus.value * Character.level;
                    } else {
                        bonusResultArray[bonuses[i].name] += bonuses[i].bonus.value * Character.level;
                    }
                } else {
                    bonusResultArray[bonuses[i].name] += bonuses[i].value;
                }
            }
            return [bonusResultArray['offense'], bonusResultArray['defense'], bonusResultArray['damage'], bonusResultArray['resistance']];
        },

        getSideSkill: function(side) {
            if (side == 'attack') {
                return 'hide';
            } else {
                return 'pitfall';
            }
        },

        calcSkillWithBonus: function(side_skill, soldierBonus) {
            TWFBT.Calculator.values.defense_skillwithbonus = Math.pow(CharacterSkills.getSkill(side_skill).getPointsWithBonus(), 0.6) +
                Math.pow(CharacterSkills.getSkill('dodge').getPointsWithBonus(), 0.5) +
                Math.pow(CharacterSkills.getSkill('leadership').getPointsWithBonus() * soldierBonus, 0.5);
            TWFBT.Calculator.values.offense_skillwithbonus = Math.pow(CharacterSkills.getSkill(side_skill).getPointsWithBonus(), 0.6) +
                Math.pow(CharacterSkills.getSkill('aim').getPointsWithBonus(), 0.5) +
                Math.pow(CharacterSkills.getSkill('leadership').getPointsWithBonus() * soldierBonus, 0.5);
        },

        getSoldierBonus: function(pa, characterClass) {
            var soldierBonus = 1;
            if (pa && characterClass == 'soldier') {
                soldierBonus = 1.5;
            } else if (characterClass == 'soldier') {
                soldierBonus = 1.25;
            }
            return soldierBonus;
        },

        getWorkerBonus: function(pa, characterClass) {
            var workerBonus = 1;
            if (pa && characterClass == 'worker') {
                workerBonus = 1.4;
            } else if (characterClass == 'worker') {
                workerBonus = 1.2;
            }
            return workerBonus;
        },

        prettifyResults: function() {
            for (var value in TWFBT.Calculator.values) {
                if (TWFBT.Calculator.values.hasOwnProperty(value) && value != 'damage') {
                    TWFBT.Calculator.values[value] = Math.floor(TWFBT.Calculator.values[value] * 100) / 100;
                }
            }
        },

        addBonusesTogether: function() {
            TWFBT.Calculator.values.offense += TWFBT.Calculator.values.offense_defaultbonus;
            TWFBT.Calculator.values.defense += TWFBT.Calculator.values.defense_defaultbonus;
            TWFBT.Calculator.values.offense += TWFBT.Calculator.values.offense_fortbattlebonus;
            TWFBT.Calculator.values.defense += TWFBT.Calculator.values.defense_fortbattlebonus;
            TWFBT.Calculator.values.offense += TWFBT.Calculator.values.offense_skillwithbonus;
            TWFBT.Calculator.values.defense += TWFBT.Calculator.values.defense_skillwithbonus;
            TWFBT.Calculator.values.offense += TWFBT.Calculator.values.offense_setbonus;
            TWFBT.Calculator.values.defense += TWFBT.Calculator.values.defense_setbonus;
            TWFBT.Calculator.values.resistance += TWFBT.Calculator.values.resistanceSkill;
        },

        showData: function(side_skill) {

            var content = $('<tr></tr>');
            content.append('<th colspan="9">' + TWFBTlang[TWFBT.side] + '</th>');
            $('#TWFBTCalculatorTable').append(content);

            var content = $('<tr><th>' +
                TWFBTlang.leadership + '</th><th>' +
                TWFBTlang[side_skill] + '</th><th>' +
                TWFBTlang.aim + '</th><th>' +
                TWFBTlang.dodge + '</th><th>' +
                TWFBTlang.bonusBySkill + '</th><th>' +
                TWFBTlang.bonusByClothes + '</th><th>' +
                TWFBTlang.bonusBySets + '</th><th>' +
                TWFBTlang.bonusDefault + '</th><th>' +
                TWFBTlang.bonusTotal + '</th></tr>');
            $('#TWFBTCalculatorTable').append(content);

            content = $('<tr></tr>');
            content.append('<td align="center">' + CharacterSkills.getSkill('leadership').getPointsWithBonus() + '</td>');
            content.append('<td align="center">' + CharacterSkills.getSkill(side_skill).getPointsWithBonus() + '</td>');
            content.append('<td align="center">' + CharacterSkills.getSkill('aim').getPointsWithBonus() + '</td>');
            content.append('<td align="center">' + CharacterSkills.getSkill('dodge').getPointsWithBonus() + '</td>');
            content.append('<td align="center">' + TWFBT.Calculator.values.offense_skillwithbonus + '<br>' + TWFBT.Calculator.values.defense_skillwithbonus + '</td>');
            content.append('<td align="center">' + TWFBT.Calculator.values.offense_fortbattlebonus + '<br>' + TWFBT.Calculator.values.defense_fortbattlebonus + '</td>');
            content.append('<td align="center">' + TWFBT.Calculator.values.offense_setbonus + '<br>' + TWFBT.Calculator.values.defense_setbonus + '</td>');
            content.append('<td align="center">' + TWFBT.Calculator.values.offense_defaultbonus + '<br>' + TWFBT.Calculator.values.defense_defaultbonus + '</td>');
            content.append('<td align="center">' + TWFBT.Calculator.values.offense + '<br>' + TWFBT.Calculator.values.defense + '</td>');
            $('#TWFBTCalculatorTable').append(content);

            content = $('<tr></tr>');
            content.append('<th>' + TWFBTlang.damage + '</th><td align="center" style="vertical-align:middle;" colspan="2">' + TWFBT.Calculator.values.damage + '<br>(' + TWFBT.Calculator.values.damageSector + ' ' + TWFBTlang.sectorBonus + ')</td>' +
                '<th colspan="2">' + TWFBTlang.resistance + '</th><td align="center" style="vertical-align:middle;">' + TWFBT.Calculator.values.resistance + '</td>' +
                '<th colspan="2">' + TWFBTlang.lifepoints + '</th><td align="center" style="vertical-align:middle;">' + TWFBT.Calculator.values.lifepoints + '</td>');
            $('#TWFBTCalculatorTable').append(content);

            content = $('<tr></tr>');
            var item_string = '';
            for (item in Wear.wear) {
                if (Wear.wear.hasOwnProperty(item)) {
                    var item_obj = Wear.wear[item].obj;
                    var popup = new ItemPopup(item_obj, {
                        character: {
                            level: Character.level

                        }
                    }).popup;
                    item_string += '<a class="itemlink hasMousePopup" href="javascript:void(0)" title="' + popup.getXHTML().escapeHTML() + '">' + item_obj.name + '<img width="15" height="15" src="' + item_obj.image + '"> </a>';
                }
            }

            content.append('<th>' + TWFBTlang.clothes + '</th><td align="left" colspan="8">' + item_string + '</td>');
            $('#TWFBTCalculatorTable').append(content);
        },
    };

    TWFBT.Statistics = {
        openStatsGUIOpen: function() {
            TWFBT.Statistics.openStatsGUI();
            TWFBT.Statistics.showTeamStatsTab();
        },
        openStatsGUI: function() {
            TWFBT.Statistics.window = wman.open('TWFBT_2', TWFBTlang.scriptName, 'noreload').setMiniTitle(TWFBTlang.scriptName).setMaxSize(1268, 838);
            TWFBT.Statistics.window.addTab(TWFBTlang.team, 'TWFBTTesterTab1', TWFBT.Statistics.showTeamStatsTab);
            TWFBT.Statistics.window.addTab(TWFBTlang.player, 'TWFBTTesterTab2', TWFBT.Statistics.showPerPlayerStatsTab);
            TWFBT.Statistics.window.addTab(TWFBTlang.ranking, 'TWFBTTesterTab3', TWFBT.Statistics.showRankingTab);
			TWFBT.Statistics.window.addTab(TWFBTlang.order, 'TWFBTTesterTab4', TWFBT.Statistics.showOrderTab);
			TWFBT.Statistics.window.addTab(TWFBTlang.weapons, 'TWFBTTesterTab5', TWFBT.Statistics.showWeaponsTab);
        },
        getDefault: function(tab) {
            TWFBT.Statistics.window.setResizeable(false).setSize(748, 471).clearContentPane().removeClass('nocloseall').setTitle('TWFBTCalcSkill');
            TWFBT.Statistics.window.dontCloseAll = false;
            $(TWFBT.Statistics.window.getContentPane()).css('margin-top', '0px');
            var wnd = TWFBT.Statistics.window.getMainDiv();
            $('.textart_title', wnd).css('display', '');
            TWFBT.Statistics.window.activateTab(tab);
        },
        showTeamStatsTab: function() {
            TWFBT.Statistics.getDefault('TWFBTTesterTab1');
            TWFBT.Statistics.window.setTitle(TWFBTlang.scriptName);
            var featScroll = new west.gui.Scrollpane();
            $(featScroll.getMainDiv()).css({
                'margin-top': '5px'
            });
			
			featScroll.appendContent(TWFBT.Statistics.getProgressBar(TWFBT.Statistics.stats.attacker_count, TWFBT.Statistics.stats.defender_count, TWFBTlang.playerCount));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getOffliner()));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getSurvivingPlayer()));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getValueSums('totalcauseddamage')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getTotalShots()));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getValueSums('crithits')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getValueSums('maxhp')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getValueSums('starthp')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getValueSums('finishedhp')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithSingleStat(TWFBT.Statistics.getHitPercentage('attacker')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithSingleStat(TWFBT.Statistics.getHitPercentage('defender')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithSingleStat(TWFBT.Statistics.getDodgePercentage('attacker')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithSingleStat(TWFBT.Statistics.getDodgePercentage('defender')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getValueSums('hitcount')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getValueSums('misscount')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getValueSums('dodgecount')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getValueSums('takenhits')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getCharClasses('adventurers')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getCharClasses('duelists')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getCharClasses('soldiers')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getCharClasses('workers')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getCharClasses('greenhorns')));
			var buffs = TWFBT.Statistics.getBuffs();
			for(buff in buffs[0]){
				if(buffs[0].hasOwnProperty(buff)){
					if(buff != '0-0'){
						featScroll.appendContent(TWFBT.Statistics.getProgressBar(buffs[0][buff], buffs[1][buff], TWFBTlang.damageBuff+ ' +' + buff));
					} else {
						featScroll.appendContent(TWFBT.Statistics.getProgressBar(buffs[0][buff], buffs[1][buff], TWFBTlang.noBuff));
					}
				}
			}
            $(TWFBT.Statistics.window.getContentPane()).append(featScroll.getMainDiv());
        },
		showPerPlayerStatsTab: function() {
            TWFBT.Statistics.getDefault('TWFBTTesterTab2');
            TWFBT.Statistics.window.setTitle(TWFBTlang.scriptName);
            var featScroll = new west.gui.Scrollpane();

            $(featScroll.getMainDiv()).css({
                'margin-top': '5px'
            });
			
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getAverage('charlevel')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getAverage('maxhp')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getAverage('starthp')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getAverage('finishedhp')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getAverage('totalcauseddamage')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getDamagerPerHit()));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getAverageWeaponDamage()));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getAverageLifetime()));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getAverageOnlineTime()));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getShotsPerPlayer()));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getAverage('takendamage')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getAverage('hitcount')));
			featScroll.appendContent(TWFBT.Statistics.getProgressBarWithStats(TWFBT.Statistics.getAverage('dodgecount')));
			
            $(TWFBT.Statistics.window.getContentPane()).append(featScroll.getMainDiv());
        },
		showRankingTab: function() {
			TWFBT.Statistics.showRanking('points_desc');
        },
		showRanking: function(sort){
			TWFBT.Statistics.getDefault('TWFBTTesterTab3');
            TWFBT.Statistics.window.setTitle(TWFBTlang.scriptName);
			
			var currArray = TWFBT.Statistics.getPlayerRanking();
			
			switch(sort) {
				case "takenhits" 	:	currArray.sort(this.sortByTakenHits); break;
				case "takenhits_desc"	:	currArray.sort(this.sortByTakenHits).reverse(); break;
				case "dodgecount" 	:	currArray.sort(this.sortByDodgeCount); break;
				case "dodgecount_desc"	:	currArray.sort(this.sortByDodgeCount).reverse(); break;
				case "totalcauseddamage" 	:	currArray.sort(this.sortByTotalCausedDamage); break;
				case "totalcauseddamage_desc"	:	currArray.sort(this.sortByTotalCausedDamage).reverse(); break;
				case "charclass" 	:	currArray.sort(this.sortByCharclass); break;
				case "charclass_desc"	:	currArray.sort(this.sortByCharclass).reverse(); break;
				case "side" 	:	currArray.sort(this.sortBySide); break;
				case "side_desc"	:	currArray.sort(this.sortBySide).reverse(); break;
				case "points" 	:	currArray.sort(this.sortByRankingValue); break;
				case "points_desc"	:	currArray.sort(this.sortByRankingValue).reverse(); break;
				case "name_desc"	:	currArray.sort(this.sortByName).reverse(); break;
				case "name"	:
				default		:	sort = "name"; currArray.sort(this.sortByName);
			}
			
			var thName = $('<a>'+TWFBTlang.playerName+'</a>').click(function(){ TWFBT.Statistics.showRanking(sort == 'name_desc' ? 'name' : 'name_desc'); return false; });
			var thPoints = $('<a>'+TWFBTlang.points+'</a>').click(function(){ TWFBT.Statistics.showRanking(sort == 'points_desc' ? 'points' : 'points_desc'); return false; });
			var thSide = $('<a>'+TWFBTlang.side+'</a>').click(function(){ TWFBT.Statistics.showRanking(sort == 'side_desc' ? 'side' : 'side_desc'); return false; });
			var thCharclass = $('<a>'+TWFBTlang.charclass+'</a>').click(function(){ TWFBT.Statistics.showRanking(sort == 'charclass_desc' ? 'charclass' : 'charclass_desc'); return false; });
			var thTotalCausedDamage = $(TWFBT.Statistics.getReportIcon(TWFBTlang.totalcauseddamage, '0 -51px')).click(function(){ TWFBT.Statistics.showRanking(sort == 'totalcauseddamage_desc' ? 'totalcauseddamage' : 'totalcauseddamage_desc'); return false; });
			var thTakenHits = $(TWFBT.Statistics.getReportIcon(TWFBTlang.takenhits, '0 -102px')).click(function(){ TWFBT.Statistics.showRanking(sort == 'takenhits_desc' ? 'takenhits' : 'takenhits_desc'); return false; });
			var thDodgeCount = $(TWFBT.Statistics.getReportIcon(TWFBTlang.dodgecount, '0 -153px')).click(function(){ TWFBT.Statistics.showRanking(sort == 'dodgecount_desc' ? 'dodgecount' : 'dodgecount_desc'); return false; });
			
			var mytable = new west.gui.Table().setId('TWFBT_ranking_table')
			.addColumn("TWFBT_ranking_name")
			.addColumn("TWFBT_ranking_points")
			.addColumn("TWFBT_ranking_side")
			.addColumn("TWFBT_ranking_charclass")
			.addColumn("TWFBT_ranking_totalcauseddamage")
			.addColumn("TWFBT_ranking_takenhits")
			.addColumn("TWFBT_ranking_dodgecount")
			.appendToCell("head", "TWFBT_ranking_name", thName)
			.appendToCell("head", "TWFBT_ranking_points", thPoints)
			.appendToCell("head", "TWFBT_ranking_side", thSide)
			.appendToCell("head", "TWFBT_ranking_charclass", thCharclass)
			.appendToCell("head", "TWFBT_ranking_totalcauseddamage", thTotalCausedDamage)
			.appendToCell("head", "TWFBT_ranking_takenhits", thTakenHits)
			.appendToCell("head", "TWFBT_ranking_dodgecount", thDodgeCount);
			
			var charclasses = {
				'-1': 'greenhorn',
				'0': 'adventurer',
				'1': 'duelist',
				'2': 'worker',
				'3': 'soldier',
			};
			
			$.each(currArray, function(index, player_obj) {
				mytable.appendRow(null, 'TWFBTRankingRow_'+index)
					.appendToCell(-1, "TWFBT_ranking_name", '<a href="#" onClick="PlayerProfileWindow.open('+player_obj.westid+');">'+player_obj.name+'</a>')
					.appendToCell(-1, "TWFBT_ranking_points", player_obj.formulaValue)
					.appendToCell(-1, "TWFBT_ranking_side", '<div style="color: '+ (player_obj.side == 'attacker' ? 'red' : 'blue') +';">'+TWFBTlang[player_obj.side]+'</div>')
					.appendToCell(-1, "TWFBT_ranking_charclass", '<img title="' + Game.InfoHandler.getLocalString4Charclass(charclasses[player_obj.charclass]) + '" src="https://westdes.innogamescdn.com/images/class_choose/class_' + charclasses[player_obj.charclass] + '.png" />')
					.appendToCell(-1, "TWFBT_ranking_totalcauseddamage", player_obj.totalcauseddamage)
					.appendToCell(-1, "TWFBT_ranking_takenhits", player_obj.takenhits)
					.appendToCell(-1, "TWFBT_ranking_dodgecount", player_obj.dodgecount)
			});

			var styling = $('<style></style>').text('.remove-link { width:20px; } .TWFBT_ranking_name { width:190px; padding-left: 5px;} .TWFBT_ranking_points { text-align:center; width:80px; } .TWFBT_ranking_side { text-align:center; width:120px; } .TWFBT_ranking_charclass { text-align:center; width:60px; } .TWFBT_ranking_totalcauseddamage { text-align:center; width:80px; } .TWFBT_ranking_dodgecount { text-align:center; width:70px; } .TWFBT_ranking_takenhits { text-align:center; width:60px; }');
			$('head').append(styling);
			
			$(TWFBT.Statistics.window.getContentPane()).empty();
			$(TWFBT.Statistics.window.getContentPane()).append(mytable.getMainDiv());
			$('#TWFBT_ranking_table').css({'margin-top': '5px'});
			$('#TWFBT_ranking_table > div.trows > div.tbody > div.tw2gui_scrollpane').css({'height': '290px'});
		},
		showOrderTab: function() {
            TWFBT.Statistics.getDefault('TWFBTTesterTab4');
            TWFBT.Statistics.window.setTitle(TWFBTlang.scriptName);
			
			var currArray = TWFBT.Statistics.getOrderOfMovement();
			
			/*var thName = $('<a>'+TWFBTlang.playerName+'</a>').click(function(){ TWFBT.Statistics.showRanking(sort == 'name' ? 'name_desc' : 'name'); return false; });
			var thPoints = $('<a>'+TWFBTlang.points+'</a>').click(function(){ TWFBT.Statistics.showRanking(sort == 'points' ? 'points_desc' : 'points'); return false; });
			var thSide = $('<a>'+TWFBTlang.side+'</a>').click(function(){ TWFBT.Statistics.showRanking(sort == 'side' ? 'side_desc' : 'side'); return false; });
			var thCharclass = $('<a>'+TWFBTlang.charclass+'</a>').click(function(){ TWFBT.Statistics.showRanking(sort == 'charclass' ? 'charclass_desc' : 'charclass'); return false; });
			var thTotalCausedDamage = $(getReportIcon(TWFBTlang.totalcauseddamage, '0 -51px')).click(function(){ TWFBT.Statistics.showRanking(sort == 'totalcauseddamage' ? 'totalcauseddamage_desc' : 'totalcauseddamage'); return false; });
			var thTakenHits = $(getReportIcon(TWFBTlang.takenhits, '0 -102px')).click(function(){ TWFBT.Statistics.showRanking(sort == 'takenhits' ? 'takenhits_desc' : 'takenhits'); return false; });
			var thDodgeCount = $(getReportIcon(TWFBTlang.dodgecount, '0 -153px')).click(function(){ TWFBT.Statistics.showRanking(sort == 'dodgecount' ? 'dodgecount_desc' : 'dodgecount'); return false; });
			*/
			var mytable = new west.gui.Table().setId('TWFBT_order_table')
			.addColumn("TWFBT_order_rank1")
			.addColumn("TWFBT_order_name1")
			.addColumn("TWFBT_order_rank2")
			.addColumn("TWFBT_order_name2")
			.appendToCell("head", "TWFBT_order_rank1", TWFBTlang.rank)
			.appendToCell("head", "TWFBT_order_name1", TWFBTlang.attacker)
			.appendToCell("head", "TWFBT_order_rank2", TWFBTlang.rank)
			.appendToCell("head", "TWFBT_order_name2", TWFBTlang.defender)
			
			
			$.each(currArray, function(index, player_obj) {
				mytable.appendRow(null, 'TWFBTOrderRow_'+index)
					.appendToCell(-1, "TWFBT_order_rank1", player_obj.rank1)
					.appendToCell(-1, "TWFBT_order_name1", '<a href="#" onClick="PlayerProfileWindow.open('+player_obj.id1+');">'+player_obj.player1+'</a>')
					.appendToCell(-1, "TWFBT_order_rank2", player_obj.rank2)
					.appendToCell(-1, "TWFBT_order_name2", '<a href="#" onClick="PlayerProfileWindow.open('+player_obj.id2+');">'+player_obj.player2+'</a>')

			});

			var styling = $('<style></style>').text('.remove-link { width:20px; } .TWFBT_order_rank1 { width:50px; text-align: center;} .TWFBT_order_rank2 { width:50px; text-align: center;} .TWFBT_order_name1 { width:195px;} .TWFBT_order_name2{ width:195px;}');
			$('head').append(styling);
			
			$(TWFBT.Statistics.window.getContentPane()).empty();
			$(TWFBT.Statistics.window.getContentPane()).append(mytable.getMainDiv());
			$('#TWFBT_order_table').css({'margin-top': '5px', 'width': '523px', 'margin-Left': '87px',});
			$('#TWFBT_order_table > div.trows > div.tbody > div.tw2gui_scrollpane').css({'height': '290px'});
        },
		showWeaponsTab: function() {
            TWFBT.Statistics.getDefault('TWFBTTesterTab5');
            TWFBT.Statistics.window.setTitle(TWFBTlang.scriptName);
			
			var currArray = TWFBT.Statistics.getWeapons();
			
			var mytable = new west.gui.Table().setId('TWFBT_weapons_table')
			.addColumn("TWFBT_weapons_attacker")
			.addColumn("TWFBT_weapons_defener")
			.addColumn("TWFBT_weapons_id")
			.appendToCell("head", "TWFBT_weapons_attacker", TWFBTlang.attacker)
			.appendToCell("head", "TWFBT_weapons_defener", TWFBTlang.defender)
			.appendToCell("head", "TWFBT_weapons_id", TWFBTlang.weapon)
			
			
			$.each(currArray, function(index, object) {
				var item = ItemManager.get(object.weaponId);
				var popup = new ItemPopup(item,{
						character:{level: 150}
					}).popup
				
				mytable.appendRow(null, 'TWFBTWeaponsRow_'+index)
					.appendToCell(-1, "TWFBT_weapons_attacker", (object.attackerWeaponsAmount != undefined ? '<div style="color: red;font-weight: bold;">'+object.attackerWeaponsAmount+'</div>' : ''))
					.appendToCell(-1, "TWFBT_weapons_defener", (object.defenderWeaponsAmount != undefined ? '<div style="color: blue;font-weight: bold;">'+object.defenderWeaponsAmount+'</div>' : ''))
					.appendToCell(-1, "TWFBT_weapons_id", '<a class="itemlink hasMousePopup" href="javascript:void(0)" title="' + popup.getXHTML().escapeHTML() + '">' + item.name + ' <img width="26" height="26" src="' + item.image + '"></a> <img width="15" height="12" src="https://westdes.innogamescdn.com/images/items/item_level.png"> '+item.item_level)
			});

			var styling = $('<style></style>').text('.TWFBT_weapons_attacker { width:100px; text-align: center;} .TWFBT_weapons_defener { width:100px; text-align: center;} .TWFBT_weapons_id { width:400px;}');
			$('head').append(styling);
			
			$(TWFBT.Statistics.window.getContentPane()).empty();
			$(TWFBT.Statistics.window.getContentPane()).append(mytable.getMainDiv());
			$('#TWFBT_weapons_table').css({'margin-top': '5px',});
			$('#TWFBT_weapons_table > div.trows > div.tbody > div.tw2gui_scrollpane').css({'height': '290px'});
        },
		
		sortByName: function(a, b) { return a.name.toLowerCase().localeCompare(b.name.toLowerCase()); },
		sortByRankingValue: function(a, b) { return a.formulaValue - b.formulaValue; },
		sortBySide: function(a, b) { return a.side - b.side; },
		sortByCharclass: function(a, b) { return a.charclass - b.charclass; },
		sortByTotalCausedDamage: function(a, b) { return a.totalcauseddamage - b.totalcauseddamage; },
		sortByTakenHits: function(a, b) { return a.takenhits - b.takenhits; },
		sortByDodgeCount: function(a, b) { return a.dodgecount - b.dodgecount; },

		init: function() {
			FortOverviewWindow.RecentBattles._initContent_backup = FortOverviewWindow.RecentBattles._initContent;
			FortOverviewWindow.RecentBattles._initContent = function () {
				FortOverviewWindow.RecentBattles._initContent_backup.call(this);
				if($('.graveyardtable > tbody > tr:nth-child(3) > td').attr("colspan") != 8){
					for(var i=2; i< $(".graveyardtable > tbody > tr").length; i+=2){
						var href = $('.graveyardtable > tbody > tr:nth-child('+i+') > td:nth-child(2) > a').attr('href');
						if(href != undefined){
							var regex = new RegExp('\,[0-9]+');
							var battle_id = href.match(regex)[0].substr(1);
							$('.graveyardtable > tbody > tr:nth-child('+i+')').append('<td><a href="#" onClick="TWFBT.Statistics.getStatsAndLog('+battle_id+');" title="'+TWFBTlang.showFurtherStatistics+'"><img width="15" height="15" src="https://westdes.innogamescdn.com/images/icons/sword.png"></a></td>');
							$('.graveyardtable > tbody > tr:nth-child('+(i+1)+') > td').attr("colspan", "8");
						}
					}
				}
				
			};
			
			FortOverviewWindow.createContent_backup = FortOverviewWindow.createContent;
			FortOverviewWindow.createContent = function (tab, options) {
				FortOverviewWindow.createContent_backup.call(this, tab, options);
				
			};
			
			FortOverviewWindow.RecentBattles._init_backup = FortOverviewWindow.RecentBattles.init;
			FortOverviewWindow.RecentBattles.init = function () {
				FortOverviewWindow.RecentBattles._init_backup.call(this);
			};
			
            /*CemeteryWindow.backup_showStatUpdateTable = CemeteryWindow.showStatUpdateTable;
            CemeteryWindow.showStatUpdateTable = function(data) {
                CemeteryWindow.backup_showStatUpdateTable.call(this, data);
                TWFBT.Statistics.stats = data;
                $('div.footer').append(' - <a href="#" onClick="TWFBT.Statistics.openStatsGUIOpen();">'+TWFBTlang.showFurtherStatistics+'</a>');
            };*/
			
			TWFBT.Statistics.getAverage = function(label) {
				var valueSumAttacker = 0;
				for (x = 0; x < TWFBT.Statistics.stats.attacker_count; x++) {
					valueSumAttacker += TWFBT.Statistics.stats.result.attackerlist[x][label];
				}
				var valueSumDefender = 0;
				for (x = 0; x < TWFBT.Statistics.stats.defender_count; x++) {
					valueSumDefender += TWFBT.Statistics.stats.result.defenderlist[x][label];
				}
				var averageAttacker = valueSumAttacker / TWFBT.Statistics.stats.attacker_count;
				var averageDefender = valueSumDefender / TWFBT.Statistics.stats.defender_count;
				
				return [Math.round(averageAttacker), Math.round(averageDefender), label];
			};
			
			TWFBT.Statistics.getAverageLifetime = function(){
				var valueSumAttacker = 0;
				for (x = 0; x < TWFBT.Statistics.stats.attacker_count; x++) {
					var diedwhen = TWFBT.Statistics.stats.result.attackerlist[x].diedwhen;
					if(diedwhen > 0){
						valueSumAttacker += diedwhen;
					} else if(diedwhen == 0){
						 valueSumAttacker += TWFBT.Statistics.stats.result.roundsplayed;
					}
				}
				var valueSumDefender = 0;
				for (x = 0; x < TWFBT.Statistics.stats.defender_count; x++) {
					var diedwhen = TWFBT.Statistics.stats.result.defenderlist[x].diedwhen;
					if(diedwhen > 0){
						valueSumDefender += diedwhen;
					} else if(diedwhen == 0){
						 valueSumDefender += TWFBT.Statistics.stats.result.roundsplayed;
					}
				}
				var averageAttacker = valueSumAttacker / TWFBT.Statistics.stats.attacker_count;
				var averageDefender = valueSumDefender / TWFBT.Statistics.stats.defender_count;
				
				return [Math.round(averageAttacker), Math.round(averageDefender), 'diedwhen'];
			};
			
			TWFBT.Statistics.getAverageOnlineTime = function(){
				var valueSumAttacker = 0;
				var onlineAttackerCount = 0;
				for (x = 0; x < TWFBT.Statistics.stats.attacker_count; x++) {
					var onlinecount = TWFBT.Statistics.stats.result.attackerlist[x].onlinecount;
					if(onlinecount > 0){
						valueSumAttacker += onlinecount;
						onlineAttackerCount++;
					}
				}
				var valueSumDefender = 0;
				var onlineDefenderCount = 0;
				for (x = 0; x < TWFBT.Statistics.stats.defender_count; x++) {
					var onlinecount = TWFBT.Statistics.stats.result.defenderlist[x].onlinecount;
					if(onlinecount > 0){
						valueSumDefender += onlinecount;
						onlineDefenderCount++;
					}
				}
				var averageAttacker = valueSumAttacker / onlineAttackerCount;
				var averageDefender = valueSumDefender / onlineDefenderCount;
				
				return [Math.round(averageAttacker), Math.round(averageDefender), 'onlinecount'];
			};
			
			TWFBT.Statistics.getAveragePositionChanges = function(){
				
			};
			
			TWFBT.Statistics.getAverageWeaponDamage = function(){
				var minDamage = TWFBT.Statistics.getValueSums('weaponmindmg');
				var maxDamage = TWFBT.Statistics.getValueSums('weaponmaxdmg');
				var averageAttacker = (minDamage[0] + maxDamage[0]) / 2;
				var averageDefender = (minDamage[1] + maxDamage[1]) / 2;
				return [Math.round(averageAttacker/TWFBT.Statistics.stats.attacker_count), Math.round(averageDefender/TWFBT.Statistics.stats.defender_count), 'averageWeaponDamage'];
			};
			
			TWFBT.Statistics.getBuffs = function(){
				var weaponContainerAttacker = {'0-0': 0, '20-40': 0, '25-25': 0, '25-75': 0, '20-60': 0, '40-60': 0, '30-30': 0, '40-40': 0, '50-50': 0, '60-60': 0, '75-75': 0, '100-100': 0,};
				var weaponContainerDefender = {'0-0': 0, '20-40': 0, '25-25': 0, '25-75': 0, '20-60': 0, '40-60': 0, '30-30': 0, '40-40': 0, '50-50': 0, '60-60': 0, '75-75': 0, '100-100': 0,};
				for (x = 0; x < TWFBT.Statistics.stats.attacker_count; x++) {
					var attacker = TWFBT.Statistics.stats.result.attackerlist[x];
					var weapon = ItemManager.get(attacker.weaponid);
					if(weapon == undefined){
						console.log(attacker.name +' ' +attacker.weaponid);
					}
					var damage = weapon.getDamage();
					var groundDamage = TWFBT.Statistics.getGroundDamage(attacker.charlevel, weapon.bonus.item, weapon.getItemLevel());
					var damageMin = attacker.weaponmindmg-(damage.min+groundDamage);
					var damageMax = attacker.weaponmaxdmg-(damage.max+groundDamage);
					if(weaponContainerAttacker[damageMin + '-' + damageMax] == undefined){
						damageMin--;
						damageMax--;
					} 
					weaponContainerAttacker[damageMin + '-' + damageMax] += 1;
				}
				for (x = 0; x < TWFBT.Statistics.stats.defender_count; x++) {
					var defender = TWFBT.Statistics.stats.result.defenderlist[x];
					var weapon = ItemManager.get(defender.weaponid);
					var damage = weapon.getDamage();
					var groundDamage = TWFBT.Statistics.getGroundDamage(defender.charlevel, weapon.bonus.item, weapon.getItemLevel());
					var damageMin = defender.weaponmindmg-(damage.min+groundDamage);
					var damageMax = defender.weaponmaxdmg-(damage.max+groundDamage);
					if(weaponContainerDefender[damageMin + '-' + damageMax] == undefined){
						damageMin--;
						damageMax--;
					}
					weaponContainerDefender[damageMin + '-' + damageMax] += 1;
				}
				return [weaponContainerAttacker, weaponContainerDefender];
			};
			
			TWFBT.Statistics.getCharClasses = function(label) {
				var charclass = '';
				switch (label) {
					case 'adventurers':
						charclass = 0;
						break;
					case 'duelists':
						charclass = 1;
						break;
					case 'workers':
						charclass = 2;
						break;
					case 'soldiers':
						charclass = 3;
						break;
					case 'greenhorns':
						charclass = -1;
						break;
				}

				var valueSumAttacker = 0;
				for (x = 0; x < TWFBT.Statistics.stats.attacker_count; x++) {
					if (TWFBT.Statistics.stats.result.attackerlist[x].charclass == charclass) {
						valueSumAttacker++;
					}
				}
				var valueSumDefender = 0;
				for (x = 0; x < TWFBT.Statistics.stats.defender_count; x++) {
					if (TWFBT.Statistics.stats.result.defenderlist[x].charclass == charclass) {
						valueSumDefender++;
					}
				}
				return [valueSumAttacker, valueSumDefender, label];
			};
			
			TWFBT.Statistics.getDamagerPerHit = function(){
				var totalDamage = TWFBT.Statistics.getValueSums('totalcauseddamage');
				var totalHits = TWFBT.Statistics.getValueSums('hitcount');
				return [Math.round(totalDamage[0]/totalHits[0]),Math.round(totalDamage[1]/totalHits[1]), 'damagePerHit'];
			};
			
			TWFBT.Statistics.getDodgePercentage = function(side){
				var valueSum = TWFBT.Statistics.getValueSums('dodgecount');
				var totalShots = TWFBT.Statistics.getTotalShots();
				if(side == 'attacker'){
					return [valueSum[0],totalShots[1], 'dodgePercentage', 'red'];
				} else {
					return [valueSum[1],totalShots[0], undefined, 'blue'];
				}
			};
			
			TWFBT.Statistics.getGroundDamage = function(charLevel, itemArray, itemLevel){
				for (var x = 0; x < itemArray.length; x++) {
					if(itemArray[x].bonus.type == 'damage'){
						return Math.floor(charLevel * itemArray[x].bonus.value * (1 + itemLevel/10));
					}
				}
				return 0;
			};
			
			TWFBT.Statistics.getHitPercentage = function(side){
				var valueSum = TWFBT.Statistics.getValueSums('hitcount');
				var totalShots = TWFBT.Statistics.getTotalShots();
				if(side == 'attacker'){
					return [valueSum[0],totalShots[0], 'hitPercentage', 'red'];
				} else {
					return [valueSum[1],totalShots[1], undefined, 'blue'];
				}
			};
			
			TWFBT.Statistics.getOffliner = function(){
				var sumOfflineAttacker = 0;
				for (x = 0; x < TWFBT.Statistics.stats.attacker_count; x++) {
					if(TWFBT.Statistics.stats.result.attackerlist[x].onlinecount == 0){
						sumOfflineAttacker++;
					}
				}
				var sumOfflineDefender = 0;
				for (x = 0; x < TWFBT.Statistics.stats.defender_count; x++) {
					if(TWFBT.Statistics.stats.result.defenderlist[x].onlinecount == 0){
						sumOfflineDefender++;
					}
				}
				return [sumOfflineAttacker, sumOfflineDefender, 'offliner'];
			};
			
			TWFBT.Statistics.getOrderOfMovement = function(){
				var container = [];
				for (x = 0; x < TWFBT.Statistics.stats.attacker_count || x < TWFBT.Statistics.stats.defender_count; x++) {
					var player1 = '', id1 = '', rank1 = '';
					if(x < TWFBT.Statistics.stats.attacker_count){
						player1 = TWFBT.Statistics.stats.result.attackerlist[x].name;
						id1 = TWFBT.Statistics.stats.result.attackerlist[x].westid;
						rank1 = x+1;
					}
					var player2 = '', id2 = '', rank2 = '';
					if(x < TWFBT.Statistics.stats.defender_count){
						player2 = TWFBT.Statistics.stats.result.defenderlist[x].name;
						id2 = TWFBT.Statistics.stats.result.defenderlist[x].westid;
						rank2 = x+1;
					}
					var object = {'rank1': rank1, 'player1': player1, 'id1': id1, 'rank2': rank2, 'player2': player2, 'id2': id2,};
					container.push(object);
				}
				return container;
			};
			
			TWFBT.Statistics.getPercentage = function(label, total){
				var valueSum = getValueSums(label);
				return TWFBT.Statistics.getSingleStatProgressBar(valueSum[0],total[0], label, 'red') + getSingleStatProgressBar(valueSum[1],total[1], '', 'blue');
			};
			
			TWFBT.Statistics.getPercentageProgressBar = function(value, max, label, color) {
				var progress = new west.gui.Progressbar(value, max);
				progress.setTextOnly(true);
				progress.setColor(color);
				progress.showPercentOnly(true);
				if(label != undefined){
					progress.setLabel(label);
				}
				return progress.getMainDiv();
			};
			
			TWFBT.Statistics.getPlayerRanking = function() {
				var players = [];
				for (x = 0; x < TWFBT.Statistics.stats.attacker_count; x++) {
					var player = TWFBT.Statistics.stats.result.attackerlist[x];
					var adventurerBonus = 1;
					if(player.charclass == 0){
						adventurerBonus = 1.75;
					}
					var value = (player.totalcauseddamage / 200) + (player.takenhits + player.dodgecount) * adventurerBonus;
					player.formulaValue = Math.round(value * 100) / 100;
					player.side = 'attacker';
					players.push(player);
				}
				for (x = 0; x < TWFBT.Statistics.stats.defender_count; x++) {
					var player = TWFBT.Statistics.stats.result.defenderlist[x];
					var adventurerBonus = 1;
					if(player.charclass == 0){
						adventurerBonus = 1.75;
					}
					var value = (player.totalcauseddamage / 200) + (player.takenhits + player.dodgecount) * adventurerBonus;
					player.formulaValue = Math.round(value * 100 ) / 100;
					player.side = 'defender';
					players.push(player);
				}
				return players;
			};
			
			TWFBT.Statistics.getProgressBar = function(att, deff, label) {
				var progress;
				if(att == 0 && deff == 0){
					progress = new west.gui.Progressbar(0, 1);
					
				} else {
					progress = new west.gui.Progressbar(att, att + deff);
				}
				progress.setTextOnly(true);
				progress.setLabel(label);
				if(att > deff){
					progress.setColor('red');
				} else if(att < deff){
					progress.setColor('blue');
					progress.setDirection('rtl');
					progress.setValue(deff);
				}
				var obj = progress.getMainDiv();
				obj[0].childNodes[1].childNodes[3].innerText = format_number(att) +' / ' + format_number(deff);
				return obj;
			};
			
			TWFBT.Statistics.getProgressBarWithSingleStat = function(values) {
				var percentage = (values[0] / values[1]) * 100;
				return TWFBT.Statistics.getPercentageProgressBar(Math.round(percentage), 100, TWFBTlang[values[2]],values[3]);
			};
			
			TWFBT.Statistics.getProgressBarWithStats = function(values) {
				return TWFBT.Statistics.getProgressBar(values[0], values[1], TWFBTlang[values[2]]);
			};
			
			TWFBT.Statistics.getReportIcon = function(tooltip, backgroundPosition){
				var icon = document.createElement('div');	
				icon.style.width = '16px';
				icon.style.height = '16px';
				icon.style.display = 'inline-block';
				icon.style.background = "url('https://westzzs.innogamescdn.com/images/fort/battle/report_icons.png')";
				icon.title = tooltip;
				icon.style.backgroundPosition = backgroundPosition;
				return icon
			};
			
			TWFBT.Statistics.getShotsPerPlayer = function(){
				var totalShots = TWFBT.Statistics.getTotalShots();
				return [Math.round(totalShots[0]/TWFBT.Statistics.stats.attacker_count),Math.round(totalShots[1]/TWFBT.Statistics.stats.defender_count),'shotsPerPlayer'];
			};
			
			TWFBT.Statistics.getSurvivingPlayer = function() {
				var valueSumAttacker = 0;
				for (x = 0; x < TWFBT.Statistics.stats.attacker_count; x++) {
					if (TWFBT.Statistics.stats.result.attackerlist[x].diedwhen == 0) {
						valueSumAttacker++;
					}
				}
				var valueSumDefender = 0;
				for (x = 0; x < TWFBT.Statistics.stats.defender_count; x++) {
					if (TWFBT.Statistics.stats.result.defenderlist[x].diedwhen == 0) {
						valueSumDefender++;
					}
				}
				return [valueSumAttacker, valueSumDefender, 'survivingPlayerCount'];
			};
			
			TWFBT.Statistics.getTotalShots = function(){
				var sumHits = TWFBT.Statistics.getValueSums('hitcount');
				var sumMisses = TWFBT.Statistics.getValueSums('misscount');
				return [sumHits[0]+sumMisses[0],sumHits[1]+sumMisses[1], 'totalShots'];
			};
			
			TWFBT.Statistics.getStatsAndLog = function(battle_id){
				Ajax.remoteCallMode('fort_battleresultpage', 'get_battle', {
					battle_id : battle_id,
				}, function (data) {
					TWFBT.Statistics.stats = data.stats;
					TWFBT.Statistics.openStatsGUIOpen();
				});
			};
			
			TWFBT.Statistics.getValueSums = function(label){
				var sumAttacker = 0;
				for (x = 0; x < TWFBT.Statistics.stats.attacker_count; x++) {
					sumAttacker += TWFBT.Statistics.stats.result.attackerlist[x][label];
				}
				var sumDefender = 0;
				for (x = 0; x < TWFBT.Statistics.stats.defender_count; x++) {
					sumDefender += TWFBT.Statistics.stats.result.defenderlist[x][label];
				}
				return [sumAttacker, sumDefender, label];
			};
			
			TWFBT.Statistics.getWeapons = function(){
				var weaponContainer = {};
				var weaponContainerAttacker = {};
				for (x = 0; x < TWFBT.Statistics.stats.attacker_count; x++) {
					var weaponid = TWFBT.Statistics.stats.result.attackerlist[x].weaponid;
					if (weaponContainerAttacker[weaponid] == undefined) {
						weaponContainerAttacker[weaponid] = 1;
						weaponContainer[weaponid] = 1;
					} else {
						weaponContainerAttacker[weaponid] += 1;
					}
				}
				var weaponContainerDefender = {};
				for (x = 0; x < TWFBT.Statistics.stats.defender_count; x++) {
					var weaponid = TWFBT.Statistics.stats.result.defenderlist[x].weaponid;
					if (weaponContainerDefender[weaponid] == undefined) {
						weaponContainerDefender[weaponid] = 1;
						weaponContainer[weaponid] = 1;
					} else {
						weaponContainerDefender[weaponid] += 1;
					}
				}
				
				var resultContainer = [];
				for(weaponid in weaponContainer){
					if (weaponContainer.hasOwnProperty(weaponid)) {
						var attackerWeaponsAmount = weaponContainerAttacker[weaponid];
						var defenderWeaponsAmount = weaponContainerDefender[weaponid];
						var object = {'attackerWeaponsAmount': attackerWeaponsAmount, 'defenderWeaponsAmount': defenderWeaponsAmount, 'weaponId': weaponid,};
						resultContainer.push(object);
					}
				}
				return resultContainer;
			};
			
		},
    };
	
	TWFBT.PreBattleChars = {
		init: function() {
			FortBattleWindow.renderChars_backup = FortBattleWindow.renderChars;
			FortBattleWindow.renderChars = function (data) {
				if (data)
					if (!this.preBattle.setPlayerlist(data.playerlist, true))
						return;
				elsedata = this.preBattle.battleData.playerlist;
				$('.otherchar', this.battlegroundEl).remove();
				var playerlist = this.preBattle.battleData.playerlist;
				for (var i in playerlist) {
					if (!playerlist.hasOwnProperty(i))
						continue;
					var player = playerlist[i];
					if (player.player_id == Character.playerId || player.idx < 0)
						continue;
					var el = $('.cell-' + player.idx, this.battlegroundEl);
					if (!el.children().filter('.otherchar').length) {
						$(el).append(getCharDiv(player.class));
					}
				}
			};
			
			var getCharDiv = function (charClass) {
				var icon = document.createElement('div');	
				icon.style.opacity = 1;
				icon.style.filter = "alpha(opacity=100)";
				icon.style.width = '15px';
				icon.style.height = '15px';
				icon.style.position = 'absolute';
				icon.style.background = 'url(' + TWFBT.Images.charClasses + ')';
				icon.style.zIndex  = '1';
				
				switch (charClass) {
                    case 'adventurer':
                        icon.style.backgroundPosition = '0px -15px';
                        break;
                    case 'duelist':
                        icon.style.backgroundPosition = '0px -30px';
                        break;
                    case 'worker':
                        icon.style.backgroundPosition = '0px -45px';
                        break;
                    case 'soldier':
                        icon.style.backgroundPosition = '0px -60px';
                        break;
                    case 'greenhorn':
                        icon.style.backgroundPosition = '0px 0px';
                        break;
                }
				return icon;
			}
		}
	};

    TWFBT.Updater = function() {
        $.getScript(TWFBT.updateUrl, function() {
            if (scriptUpdate.TWFBT > TWFBTstart.version) {
                var updateMessage = new west.gui.Dialog(TWFBTlang.update + ': ' + TWFBT.name, '<span>' + TWFBTlang.updateAvailable + '<br><br><b>v' + scriptUpdate.TWFBT + ':</b><br>' + scriptUpdate.TWFBTNew + '</span>', west.gui.Dialog.SYS_WARNING).addButton(TWFBTlang.update, function() {
                    updateMessage.hide();
                    location.href = TWFBT.website + '/code.user.js';
                }).addButton('cancel').show();
            }
        });
    };
    setTimeout(TWFBT.Updater, 4000);

    TWFBT.Skript.init();
})