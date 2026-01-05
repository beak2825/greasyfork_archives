// ==UserScript==
// @name The West Fortbattle Tool
// @namespace The West Fortbattle Tool
// @author westernblumi (updated by Tom Robert)
// @description Fort battle tools for The West!
// @include https://*.the-west.*/game.php*
// @version 1.21
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/22880/The%20West%20Fortbattle%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/22880/The%20West%20Fortbattle%20Tool.meta.js
// ==/UserScript==
// translation:westernblumi(German & English),pepe100(Spanish),Ruslan Jackson(Italiano)
(function (fn) {
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn.toString() + ')();';
  document.body.appendChild(script);
  document.body.removeChild(script);
})(function () {
  TWFBT = {
    version: '1.21',
    name: 'TW Fortbattle Tool',
    website: '//greasyfork.org/scripts/22880',
    url: '//tomrobert.safe-ws.de/',
    langs: {
      en: {
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
        damageBonus: 'Damage',
        defense: 'Defense',
        newFormula: 'new formula',
        oldFormula: 'old formula',
        pa: 'Premium (soldier and worker fort battle bonus)',
        pitfall: 'Setting traps',
        resistance: 'Resistance',
        scriptName: 'The West Fortbattle Tool',
        showFurtherStatistics: 'Show more statistics',
        team: 'Team',
        player: 'Player',
        playerCount: 'Number of players',
        survivingPlayerCount: 'Surviving players',
        offlinePlayerCount: 'Offline players',
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
        criticalHits: 'Critical hits',
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
        timeOfDeath: 'Time of death',
        round: 'Round',
        kos: 'KO\'s',
        damage: 'Damage',
        lifepointsAtRoundEnd: 'Lifepoints at the end of the round',
        passedOutDuringFight: 'Enemys passed out during that round',
        rounds: 'Rounds',
        importBattle: 'Import battle',
        importSuccessfull: 'Import successfull',
        importError: 'Import not successfull, the text contains errors',
        exportBattle: 'Export battle',
        overview: 'Overview',
        exportWeapons: 'Export weapons',
        exportRanking: 'Export ranking',
        exportOrderOfMovement: 'Export order of movement',
        exportTimeOfDeath: 'Export time of death',
        statistic: 'Statistic',
        pasteExport: 'Paste the text you got at the battle export',
        exportRounds: 'Export rounds',
        export: 'Export',
        exportBattleDescription: 'Here you can export the battle and e.g. import it at a later time',
        exportSingleStatisticDescription: 'Here you can export various statastics for using it in Excel',
        playdeadcount: 'Active adventurer bonus (invisibility)',
      },
      de: {
        attack: 'Angriff',
        bonusByClothes: 'Bonus durch Kleidung',
        bonusBySets: 'Bonus durch Sets',
        bonusBySkill: 'Bonus durch Skillung',
        bonusDefault: 'Grundbonus',
        bonusTotal: 'Gesamt',
        calcBonus: 'Berechne Fortkampfbonus',
        calculator: 'Rechner',
        clear: 'Lösche Berechnungen',
        clothes: 'Kleidung',
        damageBonus: 'Schaden',
        defense: 'Verteidigung',
        newFormula: 'neue Formel',
        oldFormula: 'alte Formel',
        pa: 'Premium (Soldaten und Arbeiterbonus)',
        pitfall: 'Fallen stellen',
        resistance: 'Widerstand',
        scriptName: 'The West FK Tool',
        showFurtherStatistics: 'Zeige weitere Statistiken',
        team: 'Team',
        player: 'Spieler',
        playerCount: 'Spielerzahl',
        survivingPlayerCount: 'Überlebende Spieler',
        offlinePlayerCount: 'Offliner',
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
        timeOfDeath: 'Todeszeitpunkt',
        round: 'Runde',
        kos: 'KO\'s',
        damage: 'Schaden',
        lifepointsAtRoundEnd: 'Lebenspunkte am Ende der Runde',
        passedOutDuringFight: 'Ko geschossen in dieser Runde',
        rounds: 'Runden',
        importBattle: 'Kampf importieren',
        importSuccessfull: 'Das Importieren war erfolgreich',
        importError: 'Das Importieren war nicht möglich, da der Text fehlerhaft ist',
        exportBattle: 'Kampf exportieren',
        overview: 'Übersicht',
        exportWeapons: 'Waffen exportieren',
        exportRanking: 'Rangliste exportieren',
        exportOrderOfMovement: 'Zugreihenfolge exportieren',
        exportTimeOfDeath: 'Todeszeitpunkte exportieren',
        statistic: 'Statistik',
        pasteExport: 'Füge hier den Text ein, den du beim Exportieren erhalten hast',
        exportRounds: 'Runden exportieren',
        export: 'Export',
        exportBattleDescription: 'Hier kannst du den Kampf exportieren und z.B. für den FK Player verwenden oder ihn später wieder Importieren',
        exportSingleStatisticDescription: 'Hier kannst du verschiedenen Einzelstatistiken exportieren und in Excel verwenden',
        playdeadcount: 'Aktiver Abenteurer-Bonus (Ghost)',
      },
      es: {
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
        damageBonus: 'Daño',
        defense: 'Defensa',
        newFormula: 'fórmula nueva',
        oldFormula: 'fórmula antigua',
        pa: 'Premium (bonus Soldado/Trabajador)',
        pitfall: 'Poner trampas',
        resistance: 'Resistencia',
        scriptName: 'The West Fortbattle Tool',
        showFurtherStatistics: 'Mostrar más estadísticas',
        team: 'Equipo',
        player: 'Jugador',
        playerCount: 'Número de jugadores',
        survivingPlayerCount: 'Jugadores supervivientes',
        offlinePlayerCount: 'Jugadores Off',
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
        damageBuff: 'Buff de Daño',
        noBuff: 'Sin Buff de Daño',
        sectorBonus: 'Bonus de Sector',
        timeOfDeath: 'Hora de la muerte',
        round: 'Ronda',
        kos: 'Desmayos',
        damage: 'Daño',
        lifepointsAtRoundEnd: 'Puntos de vida al final de la ronda',
        passedOutDuringFight: 'Enemigos desmayados durante esa ronda',
        rounds: 'Rondas',
        importBattle: 'Importar batalla',
        importSuccessfull: 'Importación correcta',
        importError: 'Importación incorrecta, el texto contiene errores',
        exportBattle: 'Exportar batalla',
        overview: 'Resumen',
        exportWeapons: 'Exportar armas',
        exportRanking: 'Exportar clasificación',
        exportOrderOfMovement: 'Exportar orden de movimientos',
        exportTimeOfDeath: 'Exportar Hora de la muerte',
        statistic: 'Estadística',
        pasteExport: 'Paste the text you got at the battle export',
        exportRounds: 'Exportar rondas',
        export: 'Exportar',
        exportBattleDescription: 'Aquí puedes exportar la batalla para, por ejemplo, importarla más tarde',
        exportSingleStatisticDescription: 'Aquí puedes exportar varias estadísticas para usarlas en Excel',
        playdeadcount: 'Bono de aventurero activo (Invisibilidad)',
      },
      it: {
        language: 'Italiano',
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
        damageBonus: 'Danno',
        defense: 'Bonus difesa',
        newFormula: 'nuova formula',
        oldFormula: 'vecchia formula',
        pa: 'Premium (Bonus bataglia forte per il soldato e lavoratore)',
        pitfall: 'Trappole',
        resistance: 'Resistenza',
        scriptName: 'The West Tool per le Batagli Forti',
        showFurtherStatistics: 'Show more statistics',
        team: 'Team',
        player: 'Player',
        playerCount: 'Number of players',
        survivingPlayerCount: 'Surviving players',
        offlinePlayerCount: 'Offline players',
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
        timeOfDeath: 'Time of death',
        round: 'Round',
        kos: 'KO\'s',
        damage: 'Damage',
        lifepointsAtRoundEnd: 'Lifepoints at the end of the round',
        passedOutDuringFight: 'Enemys passed out during that round',
        rounds: 'Rounds',
        importBattle: 'Import battle',
        importSuccessfull: 'Import successfull',
        importError: 'Import not successfull, the text contains errors',
        exportBattle: 'Export battle',
        overview: 'Overview',
        exportWeapons: 'Export weapons',
        exportRanking: 'Export ranking',
        exportOrderOfMovement: 'Export order of movement',
        exportTimeOfDeath: 'Export time of death',
        statistic: 'Statistic',
        pasteExport: 'Paste the text you got at the battle export',
        exportRounds: 'Export rounds',
        export: 'Export',
        exportBattleDescription: 'Here you can export the battle and e.g. import it at a later time',
        exportSingleStatisticDescription: 'Here you can export various statastics for using it in Excel',
        playdeadcount: 'Active adventurer bonus (invisibility)',
      },
    },
    side: 'attack',
    formula: 'newFormula',
    Images: {
      settings: 'data:image/jpeg;base64,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',
      charClasses: 'data:image/png;base64,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',
    },
    updateLang: function () {
      var lgs = TWFBT.langs,
      lg = [localStorage.getItem('scriptsLang'), Game.locale.substr(0, 2)];
      TWFBT.lang = lgs[lg[0]] ? lg[0] : lgs[lg[1]] ? lg[1] : 'en';
      TWFBTlang = lgs[TWFBT.lang];
    },
  };
  TWFBT.updateLang();
  TWFBT.Skript = {
    init: function () {
      TWFBT.Statistics.init();
      TWFBT.PreBattleChars.init();
      var styling = $('<style>').text('.TWFBT_left { position: relative; left: 28px; top: 20px;} .TWFBT_textarea {left: 20px; top: 25px;} .TWFBT_button {left: 25px; top: 30px;}');
      $('head').append(styling);
      var menuContainer = $('<div class="menulink" onClick="TWFBT.GUI.openTWFBTWindow();" title="' + TWFBTlang.scriptName + '">').css('background-image', 'url(' + TWFBT.Images.settings + ')').css('background-position', '0px 0px').on("mouseenter", function () {
        $(this).css('background-position', '-25px 0px');
      }).on('mouseleave', function () {
        $(this).css('background-position', '0px 0px');
      });
      $('#ui_menubar').append($('<div id="TWFBT_menubutton" class="ui_menucontainer">').append(menuContainer).append('<div class="menucontainer_bottom">'));
    },
  };
  var charclasses = {
    '-1': 'greenhorn',
    '0': 'adventurer',
    '1': 'duelist',
    '2': 'worker',
    '3': 'soldier',
  };
  TWFBT.GUI = {
    openTWFBTWindow: function () {
      TWFBT.GUI.open();
      TWFBT.GUI.calcSkill();
    },
    open: function () {
      TWFBT.GUI.window = wman.open('TWFBT', TWFBTlang.scriptName, 'noreload nocloseall').setMiniTitle(TWFBT.name);
      TWFBT.GUI.window.dontCloseAll = true;
      TWFBT.GUI.window.addTab(TWFBTlang.calculator, 'TWFBTCalcSkill', TWFBT.GUI.calcSkill);
      TWFBT.GUI.window.addTab(TWFBTlang.importBattle, 'TWFBTBattleImporterTab', TWFBT.GUI.showBattleImporter);
    },
    getDefault: function (tab) {
      TWFBT.GUI.window.clearContentPane().activateTab(tab);
    },
    showBattleImporter: function () {
      TWFBT.GUI.getDefault('TWFBTBattleImporterTab');
      var input = new west.gui.Textarea().setId("TWFBTbattleImporterInput").setWidth(635).setHeight(260);
      var importButton = new west.gui.Button(TWFBTlang.importBattle, function () {
        try {
          TWFBT.Statistics.stats.result = JSON.parse(input.getContent());
          MessageSuccess(TWFBTlang.importSuccessfull).show();
          TWFBT.Statistics.openStatsGUIOpen();
        } catch (err) {
          MessageError(TWFBTlang.importError).show();
        }
      }).getMainDiv();
      $(importButton).addClass("TWFBT_button");
      $(TWFBT.GUI.window.getContentPane()).append($("<span class='TWFBT_left strong'>" + TWFBTlang.pasteExport + ":<br></span>"),
        input.getMainDiv().addClass('TWFBT_textarea'), importButton);
    },
    calcSkill: function () {
      TWFBT.GUI.getDefault('TWFBTCalcSkill');
      var featScroll = new west.gui.Scrollpane();
      $(featScroll.getMainDiv()).css({
        'margin-top': '10px'
      });
      var calcButton = new west.gui.Button(TWFBTlang.calcBonus, function () {
        TWFBT.Calculator.getLoader();
      });
      var clearButton = new west.gui.Button(TWFBTlang.clear, function () {
        clearTable();
      });
      if (TWFBT.pa === undefined)
        TWFBT.pa = Premium.hasBonus('character');
      if (TWFBT.characterClass === undefined)
        TWFBT.characterClass = Character.charClass;
      var paCheckbox = new west.gui.Checkbox().setLabel(TWFBTlang.pa).setCallback(function (t) {
        TWFBT.pa = t;
      }).setSelected(TWFBT.pa, 1);
      var charClassBox = new west.gui.Combobox();
      for (var p in charclasses) {
        p = charclasses[p];
        charClassBox.addItem(p, Game.InfoHandler.getLocalString4Charclass(p));
      }
      charClassBox.addListener(function (val) {
        TWFBT.characterClass = val;
      }).select(TWFBT.characterClass);
      var modeBox = new west.gui.Combobox()
        .addItem('attack', TWFBTlang.attack)
        .addItem('defense', TWFBTlang.defense)
        .addListener(function (val) {
        TWFBT.side = val;
      }).select(TWFBT.side);
      featScroll.appendContent([modeBox.getMainDiv(), '&emsp;',
          paCheckbox.getMainDiv(), '&emsp;',
          charClassBox.getMainDiv(), '<br>',
          calcButton.getMainDiv(),
          clearButton.getMainDiv(), '<table border="1" id="TWFBTCalculatorTable"></table>']);
      $(TWFBT.GUI.window.getContentPane()).append(featScroll.getMainDiv());
      var clearTable = function () {
        $('#TWFBTCalculatorTable').empty();
      };
    },
  };
  TWFBT.Calculator = {
    resetValues: function () {
      TWFBT.Calculator.values = {
        offense_defaultbonus: 1.15,
        defense_defaultbonus: 0,
        offense_fortbattlebonus: 0,
        defense_fortbattlebonus: 0,
        offense_setbonus: 0,
        defense_setbonus: 0,
        damageSector: 0,
        resistance: 0,
      };
    },
    getLoader: function () {
      if (!window.BattleCalc)
        $.getScript('//tw-calc.net/js/battle-calculator-core.js', function () {
          TWFBT.Calculator.calcSkills();
        }).fail(function () {
          alert('TWFBT error: ' + JSON.stringify(arguments))
        });
      else
        this.calcSkills();
    },
    calcSkills: function () {
      this.resetValues();
      if (!BattleCalc.getItemBonus_twfbt) {
        BattleCalc.getItemBonus_twfbt = BattleCalc.getItemBonus;
        BattleCalc.getItemBonus = function () {
          var b = BattleCalc.getItemBonus_twfbt.apply(this, arguments),
          tcv = TWFBT.Calculator.values;
          tcv.offense_fortbattlebonus += b.offense || 0;
          tcv.defense_fortbattlebonus += b.defense || 0;
          tcv.damageSector += b.damage || 0;
          tcv.resistance += b.resistance || 0;
          return b;
        };
        BattleCalc.getSetBonus_twfbt = BattleCalc.getSetBonus;
        BattleCalc.getSetBonus = function () {
          var c = BattleCalc.getSetBonus_twfbt.apply(this, arguments),
          tcw = TWFBT.Calculator.values;
          tcw.offense_setbonus += c.offense || 0;
          tcw.defense_setbonus += c.defense || 0;
          tcw.damageSector += c.damage || 0;
          tcw.resistance += c.resistance || 0;
          return c;
        };
      }
      this.input = {
        charClass: TWFBT.characterClass,
        premium: TWFBT.pa,
        level: Character.level,
        skills: {
          health: CharacterSkills.skills.health.getPointsWithBonus(),
          leadership: CharacterSkills.skills.leadership.getPointsWithBonus(),
          pitfall: CharacterSkills.skills.pitfall.getPointsWithBonus(),
          hide: CharacterSkills.skills.hide.getPointsWithBonus(),
          dodge: CharacterSkills.skills.dodge.getPointsWithBonus(),
          aim: CharacterSkills.skills.aim.getPointsWithBonus()
        },
        map_position: 0,
        bonus: {}
      };
      this.result = BattleCalc.coreCalc(this.input, 1);
      this.showData();
    },
    showData: function () {
      var CSkN = CharacterSkills.keyNames,
      trs = this.result[TWFBT.side],
      tv = this.values,
      side = TWFBT.side == 'attack' ? 'hide' : 'pitfall';
      content = $('<tr></tr>');
      content.append('<th colspan="9">' + TWFBTlang[TWFBT.side] + '</th>');
      $('#TWFBTCalculatorTable').append(content);
      content = $('<tr><th>' +
          CSkN.leadership + '</th><th>' +
          CSkN[side] + '</th><th>' +
          CSkN.aim + '</th><th>' +
          CSkN.dodge + '</th><th>' +
          TWFBTlang.bonusBySkill + '</th><th>' +
          TWFBTlang.bonusByClothes + '</th><th>' +
          TWFBTlang.bonusBySets + '</th><th>' +
          TWFBTlang.bonusDefault + '</th><th>' +
          TWFBTlang.bonusTotal + '</th></tr>');
      $('#TWFBTCalculatorTable').append(content);
      content = $('<tr></tr>');
      content.append('<td align="center">' + this.input.skills.leadership + '</td>' +
        '<td align="center">' + this.input.skills[side] + '</td>' +
        '<td align="center">' + this.input.skills.aim + '</td>' +
        '<td align="center">' + this.input.skills.dodge + '</td>' +
        '<td align="center">' + Math.round((trs.hit / tv.offense_defaultbonus - tv.offense_setbonus - tv.offense_fortbattlebonus) * 100) / 100 + '<br>' + Math.round((trs.dodge - /*tv.defense_defaultbonus*/ - tv.defense_setbonus - tv.defense_fortbattlebonus) * 100) / 100 + '</td>' +
        '<td align="center">' + tv.offense_fortbattlebonus + '<br>' + tv.defense_fortbattlebonus + '</td>' +
        '<td align="center">' + tv.offense_setbonus + '<br>' + tv.defense_setbonus + '</td>' +
        '<td align="center">' + 'x ' + tv.offense_defaultbonus + '<br>' + tv.defense_defaultbonus + '</td>' +
        '<td align="center">' + trs.hit + '<br>' + trs.dodge + '</td>');
      $('#TWFBTCalculatorTable').append(content);
      content = $('<tr></tr>');
      content.append('<th>' + TWFBTlang.damageBonus + '</th><td align="center" style="vertical-align:middle;" colspan="2">' + this.result.damage + '<br>(' + tv.damageSector + ' ' + TWFBTlang.sectorBonus + ')</td>' +
        '<th colspan="2">' + TWFBTlang.resistance + '</th><td align="center" style="vertical-align:middle;">' + trs.resistance + '<br>(' + tv.resistance + ' ' + TWFBTlang.clothes + ')</td>' +
        '<th colspan="2">' + CSkN.health + '</th><td align="center" style="vertical-align:middle;">' + this.result.health + '</td>');
      $('#TWFBTCalculatorTable').append(content);
      content = $('<tr></tr>');
      var item_string = '';
      for (var item in Wear.wear) {
        var item_obj = Wear.wear[item].obj;
        var popup = new ItemPopup(item_obj, {
          character: {
            level: Character.level
          }
        }).popup;
        item_string += '<a class="itemlink hasMousePopup" href="javascript:void(0)" title="' + popup.getXHTML().escapeHTML() + '">' + item_obj.name + '<img width="15" height="15" src="' + item_obj.image + '"> </a>';
      }
      content.append('<th>' + TWFBTlang.clothes + '</th><td align="left" colspan="8">' + item_string + '</td>');
      $('#TWFBTCalculatorTable').append(content);
    },
  };
  TWFBT.Statistics = {
    openStatsGUIOpen: function () {
      TWFBT.Statistics.openStatsGUI();
      TWFBT.Statistics.showOverviewTab();
    },
    openStatsGUI: function () {
      TWFBT.Statistics.window = wman.open('TWFBT_2', TWFBTlang.scriptName, 'noreload').setMiniTitle(TWFBT.name)
        .addTab(TWFBTlang.overview, 'TWFBTOverviewTab', TWFBT.Statistics.showOverviewTab)
        .addTab(TWFBTlang.team, 'TWFBTTesterTab1', TWFBT.Statistics.showTeamStatsTab)
        .addTab(TWFBTlang.player, 'TWFBTTesterTab2', TWFBT.Statistics.showPerPlayerStatsTab)
        .addTab(TWFBTlang.ranking, 'TWFBTTesterTab3', TWFBT.Statistics.showRankingTab)
        .addTab(TWFBTlang.order, 'TWFBTTesterTab4', TWFBT.Statistics.showOrderTab)
        .addTab(TWFBTlang.weapons, 'TWFBTTesterTab5', TWFBT.Statistics.showWeaponsTab)
        .addTab(TWFBTlang.timeOfDeath, 'TWFBTTesterTab6', TWFBT.Statistics.showTimeOfDeathTab)
        .addTab(TWFBTlang.rounds, 'TWFBTTesterTab7', TWFBT.Statistics.showRoundStatsTab);
    },
    getDefault: function (tab) {
      TWFBT.Statistics.window.clearContentPane().activateTab(tab);
    },
    showOverviewTab: function () {
      TWFBT.Statistics.getDefault('TWFBTOverviewTab');
      var showTeamStatsButton = new west.gui.Button(TWFBTlang.team, TWFBT.Statistics.showTeamStatsTab).getMainDiv(),
      showPerPlayerStatsButton = new west.gui.Button(TWFBTlang.player, TWFBT.Statistics.showPerPlayerStatsTab).getMainDiv(),
      showRankingButton = new west.gui.Button(TWFBTlang.ranking, TWFBT.Statistics.showRankingTab).getMainDiv(),
      showOrderButton = new west.gui.Button(TWFBTlang.order, TWFBT.Statistics.showOrderTab).getMainDiv(),
      showWeaponsButton = new west.gui.Button(TWFBTlang.weapons, TWFBT.Statistics.showWeaponsTab).getMainDiv(),
      showTimeOfDeathButton = new west.gui.Button(TWFBTlang.timeOfDeath, TWFBT.Statistics.showTimeOfDeathTab).getMainDiv(),
      showRoundStatsButton = new west.gui.Button(TWFBTlang.rounds, TWFBT.Statistics.showRoundStatsTab).getMainDiv(),
      input = new west.gui.Textarea().setId("TWFBTbattleExporterInput").setWidth(450).setHeight(200),
      exportAllButton = new west.gui.Button(TWFBTlang.exportBattle, function () {
        TWFBT.Statistics.exportFunction(input, JSON.stringify(TWFBT.Statistics.stats.result));
      }).getMainDiv(),
      exportRankingButton = new west.gui.Button(TWFBTlang.exportRanking, function () {
        TWFBT.Statistics.exportFunction(input, TWFBT.Statistics.exportRankingStatistics());
      }).getMainDiv(),
      exportOrderOfMovementButton = new west.gui.Button(TWFBTlang.exportOrderOfMovement, function () {
        TWFBT.Statistics.exportFunction(input, TWFBT.Statistics.exportOrderOfMovementStatistics());
      }).getMainDiv(),
      exportWeaponsButton = new west.gui.Button(TWFBTlang.exportWeapons, function () {
        TWFBT.Statistics.exportFunction(input, TWFBT.Statistics.exportWeaponStatistics());
      }).getMainDiv(),
      exportTimeOfDeathButton = new west.gui.Button(TWFBTlang.exportTimeOfDeath, function () {
        TWFBT.Statistics.exportFunction(input, TWFBT.Statistics.exportTimeOfDeathStatistics());
      }).getMainDiv(),
      exportRoundsButton = new west.gui.Button(TWFBTlang.exportRounds, function () {
        TWFBT.Statistics.exportFunction(input, TWFBT.Statistics.exportRoundStatistics());
      }).getMainDiv();
      $(TWFBT.Statistics.window.getContentPane()).append($("<span class='TWFBT_left strong'>" + TWFBTlang.statistic + ' ' + TWFBTlang.overview + ":<br></span>"), showTeamStatsButton, showPerPlayerStatsButton, showRankingButton, showOrderButton, '<br><br>', showWeaponsButton, showTimeOfDeathButton, showRoundStatsButton, '<br><br>', $("<span class='TWFBT_left strong'>" + TWFBTlang.export + ":<br></span>"), "<span class='TWFBT_left'>" + TWFBTlang.exportBattleDescription + ":<br></span>", exportAllButton, "<br><br><br><span class='TWFBT_left'>" + TWFBTlang.exportSingleStatisticDescription + ":<br></span>", exportRankingButton, exportOrderOfMovementButton, exportWeaponsButton, '<br><br>', exportTimeOfDeathButton, exportRoundsButton);
      $('.TWFBT_2 .tw2gui_button').addClass("TWFBT_button");
    },
    showTeamStatsTab: function () {
      var that = TWFBT.Statistics;
      that.getDefault('TWFBTTesterTab1');
      var featScroll = new west.gui.Scrollpane();
      $(featScroll.getMainDiv()).css({
        'margin-top': '5px'
      });
      featScroll.appendContent([that.getProgressBar(that.stats.result.attackerlist.length, that.stats.result.defenderlist.length, TWFBTlang.playerCount),
          that.getPBv(that.getOffliner()),
          that.getPBv(that.getSurvivingPlayer()),
          that.getPBv(that.getValueSums('totalcauseddamage')),
          that.getPBv(that.getTotalShots()),
          that.getPBv(that.getValueSums('crithits')),
          that.getPBv(that.getValueSums('playdeadcount')),
          that.getPBv(that.getValueSums('maxhp')),
          that.getPBv(that.getValueSums('starthp')),
          that.getPBv(that.getValueSums('finishedhp')),
          that.getProgressBarWithSingleStat(that.getHitPercentage('attacker')),
          that.getProgressBarWithSingleStat(that.getHitPercentage('defender')),
          that.getProgressBarWithSingleStat(that.getDodgePercentage('attacker')),
          that.getProgressBarWithSingleStat(that.getDodgePercentage('defender')),
          that.getPBv(that.getValueSums('hitcount')),
          that.getPBv(that.getValueSums('misscount')),
          that.getPBv(that.getValueSums('dodgecount')),
          that.getPBv(that.getValueSums('takenhits')),
          that.getPBv(that.getCharClasses(0)),
          that.getPBv(that.getCharClasses(1)),
          that.getPBv(that.getCharClasses(2)),
          that.getPBv(that.getCharClasses(3)),
          that.getPBv(that.getCharClasses(-1))]);
      var buffs = that.getBuffs();
      for (var buff in buffs[0])
        if (buffs[0].hasOwnProperty(buff))
          if (buff != '0-0')
            featScroll.appendContent(that.getProgressBar(buffs[0][buff], buffs[1][buff], TWFBTlang.damageBuff + ' +' + buff));
          else
            featScroll.appendContent(that.getProgressBar(buffs[0][buff], buffs[1][buff], TWFBTlang.noBuff));
      $(that.window.getContentPane()).append(featScroll.getMainDiv());
    },
    showPerPlayerStatsTab: function () {
      var that = TWFBT.Statistics;
      that.getDefault('TWFBTTesterTab2');
      var featScroll = new west.gui.Scrollpane();
      $(featScroll.getMainDiv()).css({
        'margin-top': '5px'
      });
      featScroll.appendContent([that.getPBv(that.getAverage('charlevel')),
          that.getPBv(that.getAverage('maxhp')),
          that.getPBv(that.getAverage('starthp')),
          that.getPBv(that.getAverage('finishedhp')),
          that.getPBv(that.getAverage('totalcauseddamage')),
          that.getPBv(that.getDamagerPerHit()),
          that.getPBv(that.getAverageWeaponDamage()),
          that.getPBv(that.getAverageLifetime()),
          that.getPBv(that.getAverageOnlineTime()),
          that.getPBv(that.getShotsPerPlayer()),
          that.getPBv(that.getAverage('takendamage')),
          that.getPBv(that.getAverage('hitcount')),
          that.getPBv(that.getAverage('dodgecount'))]);
      $(that.window.getContentPane()).append(featScroll.getMainDiv());
    },
    showRankingTab: function () {
      TWFBT.Statistics.showRanking('points_desc');
    },
    showRanking: function (sort) {
      var that = TWFBT.Statistics;
      that.getDefault('TWFBTTesterTab3');
      var currArray = that.getPlayerRanking();
      switch (sort) {
      case "takenhits":
        currArray.sort(that.sortByTakenHits);
        break;
      case "takenhits_desc":
        currArray.sort(that.sortByTakenHits).reverse();
        break;
      case "dodgecount":
        currArray.sort(that.sortByDodgeCount);
        break;
      case "dodgecount_desc":
        currArray.sort(that.sortByDodgeCount).reverse();
        break;
      case "totalcauseddamage":
        currArray.sort(that.sortByTotalCausedDamage);
        break;
      case "totalcauseddamage_desc":
        currArray.sort(that.sortByTotalCausedDamage).reverse();
        break;
      case "charclass":
        currArray.sort(that.sortByCharclass);
        break;
      case "charclass_desc":
        currArray.sort(that.sortByCharclass).reverse();
        break;
      case "side":
        currArray.sort(that.sortBySide);
        break;
      case "side_desc":
        currArray.sort(that.sortBySide).reverse();
        break;
      case "points":
        currArray.sort(that.sortByRankingValue);
        break;
      case "points_desc":
        currArray.sort(that.sortByRankingValue).reverse();
        break;
      case "name_desc":
        currArray.sort(that.sortByName).reverse();
        break;
        //case "name":
      default:
        sort = "name";
        currArray.sort(that.sortByName);
      }
      var thName = $('<a>' + TWFBTlang.playerName + '</a>').click(function () {
        that.showRanking(sort == 'name_desc' ? 'name' : 'name_desc');
        return false;
      });
      var thPoints = $('<a>' + TWFBTlang.points + '</a>').click(function () {
        that.showRanking(sort == 'points_desc' ? 'points' : 'points_desc');
        return false;
      });
      var thSide = $('<a>' + TWFBTlang.side + '</a>').click(function () {
        that.showRanking(sort == 'side_desc' ? 'side' : 'side_desc');
        return false;
      });
      var thCharclass = $('<a>' + TWFBTlang.charclass + '</a>').click(function () {
        that.showRanking(sort == 'charclass_desc' ? 'charclass' : 'charclass_desc');
        return false;
      });
      var thTotalCausedDamage = $(that.getReportIcon(TWFBTlang.totalcauseddamage, '0 -51px')).click(function () {
        that.showRanking(sort == 'totalcauseddamage_desc' ? 'totalcauseddamage' : 'totalcauseddamage_desc');
        return false;
      });
      var thTakenHits = $(that.getReportIcon(TWFBTlang.takenhits, '0 -102px')).click(function () {
        that.showRanking(sort == 'takenhits_desc' ? 'takenhits' : 'takenhits_desc');
        return false;
      });
      var thDodgeCount = $(that.getReportIcon(TWFBTlang.dodgecount, '0 -153px')).click(function () {
        that.showRanking(sort == 'dodgecount_desc' ? 'dodgecount' : 'dodgecount_desc');
        return false;
      });
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
      $.each(currArray, function (index, player_obj) {
        mytable.appendRow(null, 'TWFBTRankingRow_' + index)
        .appendToCell(-1, "TWFBT_ranking_name", '<a href="#" onClick="PlayerProfileWindow.open(' + player_obj.westid + ');">' + player_obj.name + '</a>')
        .appendToCell(-1, "TWFBT_ranking_points", player_obj.formulaValue)
        .appendToCell(-1, "TWFBT_ranking_side", '<div style="color: ' + (player_obj.side == 'attacker' ? 'red' : 'blue') + ';">' + TWFBTlang[player_obj.side] + '</div>')
        .appendToCell(-1, "TWFBT_ranking_charclass", '<img title="' + Game.InfoHandler.getLocalString4Charclass(charclasses[player_obj.charclass]) + '" src="images/class_choose/class_' + charclasses[player_obj.charclass] + '.png">')
        .appendToCell(-1, "TWFBT_ranking_totalcauseddamage", player_obj.totalcauseddamage)
        .appendToCell(-1, "TWFBT_ranking_takenhits", player_obj.takenhits)
        .appendToCell(-1, "TWFBT_ranking_dodgecount", player_obj.dodgecount);
      });
      var styling = $('<style>').text('.remove-link { width:20px; } .TWFBT_ranking_name { width:190px; padding-left: 5px;} .TWFBT_ranking_points { text-align:center; width:80px; } .TWFBT_ranking_side { text-align:center; width:120px; } .TWFBT_ranking_charclass { text-align:center; width:60px; } .TWFBT_ranking_totalcauseddamage { text-align:center; width:80px; } .TWFBT_ranking_dodgecount { text-align:center; width:70px; } .TWFBT_ranking_takenhits { text-align:center; width:60px; }');
      $('head').append(styling);
      $(that.window.getContentPane()).empty();
      $(that.window.getContentPane()).append(mytable.getMainDiv());
      $('#TWFBT_ranking_table').css({
        'margin-top': '5px'
      });
      $('#TWFBT_ranking_table > div.trows > div.tbody > div.tw2gui_scrollpane').css({
        'height': '290px'
      });
    },
    showOrderTab: function () {
      var that = TWFBT.Statistics;
      that.getDefault('TWFBTTesterTab4');
      var currArray = that.getOrderOfMovement();
      /*var thName = $('<a>'+TWFBTlang.playerName+'</a>').click(function(){ TWFBT.Statistics.showRanking(sort == 'name' ? 'name_desc' : 'name'); return false; });
      var thPoints = $('<a>'+TWFBTlang.points+'</a>').click(function(){ TWFBT.Statistics.showRanking(sort == 'points' ? 'points_desc' : 'points'); return false; });
      var thSide = $('<a>'+TWFBTlang.side+'</a>').click(function(){ TWFBT.Statistics.showRanking(sort == 'side' ? 'side_desc' : 'side'); return false; });
      var thCharclass = $('<a>'+TWFBTlang.charclass+'</a>').click(function(){ TWFBT.Statistics.showRanking(sort == 'charclass' ? 'charclass_desc' : 'charclass'); return false; });
      var thTotalCausedDamage = $(getReportIcon(TWFBTlang.totalcauseddamage, '0 -51px')).click(function(){ TWFBT.Statistics.showRanking(sort == 'totalcauseddamage' ? 'totalcauseddamage_desc' : 'totalcauseddamage'); return false; });
      var thTakenHits = $(getReportIcon(TWFBTlang.takenhits, '0 -102px')).click(function(){ TWFBT.Statistics.showRanking(sort == 'takenhits' ? 'takenhits_desc' : 'takenhits'); return false; });
      var thDodgeCount = $(getReportIcon(TWFBTlang.dodgecount, '0 -153px')).click(function(){ TWFBT.Statistics.showRanking(sort == 'dodgecount' ? 'dodgecount_desc' : 'dodgecount'); return false; });
       */
      var mytable = new west.gui.Table().setId('TWFBT_order_table')
        .addColumn("TWFBT_order_attackerRank")
        .addColumn("TWFBT_order_attackerName")
        .addColumn("TWFBT_order_defenderRank")
        .addColumn("TWFBT_order_defenderName")
        .appendToCell("head", "TWFBT_order_attackerRank", TWFBTlang.rank)
        .appendToCell("head", "TWFBT_order_attackerName", TWFBTlang.attacker)
        .appendToCell("head", "TWFBT_order_defenderRank", TWFBTlang.rank)
        .appendToCell("head", "TWFBT_order_defenderName", TWFBTlang.defender);
      $.each(currArray, function (index, player_obj) {
        mytable.appendRow(null, 'TWFBTOrderRow_' + index)
        .appendToCell(-1, "TWFBT_order_attackerRank", player_obj.attackerRank)
        .appendToCell(-1, "TWFBT_order_attackerName", '<a href="#" onClick="PlayerProfileWindow.open(' + player_obj.attackerId + ');">' + player_obj.attackerName + '</a>')
        .appendToCell(-1, "TWFBT_order_defenderRank", player_obj.defenderRank)
        .appendToCell(-1, "TWFBT_order_defenderName", '<a href="#" onClick="PlayerProfileWindow.open(' + player_obj.defenderId + ');">' + player_obj.defenderName + '</a>');
      });
      var styling = $('<style>').text('.remove-link { width:20px; } .TWFBT_order_attackerRank { width:50px; text-align: center;} .TWFBT_order_defenderRank { width:50px; text-align: center;} .TWFBT_order_attackerName { width:195px;} .TWFBT_order_defenderName{ width:195px;}');
      $('head').append(styling);
      $(that.window.getContentPane()).empty();
      $(that.window.getContentPane()).append(mytable.getMainDiv());
      $('#TWFBT_order_table').css({
        'margin-top': '5px',
        'width': '523px',
        'margin-Left': '87px',
      });
      $('#TWFBT_order_table > div.trows > div.tbody > div.tw2gui_scrollpane').css({
        'height': '290px'
      });
    },
    showWeaponsTab: function () {
      var that = TWFBT.Statistics;
      that.getDefault('TWFBTTesterTab5');
      var currArray = that.getWeapons();
      var mytable = new west.gui.Table().setId('TWFBT_weapons_table')
        .addColumn("TWFBT_weapons_attacker")
        .addColumn("TWFBT_weapons_defender")
        .addColumn("TWFBT_weapons_id")
        .appendToCell("head", "TWFBT_weapons_attacker", TWFBTlang.attacker)
        .appendToCell("head", "TWFBT_weapons_defender", TWFBTlang.defender)
        .appendToCell("head", "TWFBT_weapons_id", TWFBTlang.weapon);
      $.each(currArray, function (index, object) {
        var item = ItemManager.get(object.weaponId);
        var popup = new ItemPopup(item, {
          character: {
            level: 150
          }
        }).popup;
        mytable.appendRow(null, 'TWFBTWeaponsRow_' + index)
        .appendToCell(-1, "TWFBT_weapons_attacker", '<div style="color: red;font-weight: bold;">' + (object.attackerWeaponsAmount || '') + '</div>')
        .appendToCell(-1, "TWFBT_weapons_defender", '<div style="color: blue;font-weight: bold;">' + (object.defenderWeaponsAmount || '') + '</div>')
        .appendToCell(-1, "TWFBT_weapons_id", '<a class="itemlink hasMousePopup" href="javascript:void(0)" title="' + popup.getXHTML().escapeHTML() + '">' + item.name + ' <img width="26" height="26" src="' + item.image + '"></a> <img width="15" height="12" src="images/items/item_level.png"> ' + item.item_level);
      });
      var styling = $('<style>').text('.TWFBT_weapons_attacker { width:100px; text-align: center;} .TWFBT_weapons_defender { width:100px; text-align: center;} .TWFBT_weapons_id { width:400px;}');
      $('head').append(styling);
      $(that.window.getContentPane()).empty();
      $(that.window.getContentPane()).append(mytable.getMainDiv());
      $('#TWFBT_weapons_table').css({
        'margin-top': '5px',
      });
      $('#TWFBT_weapons_table > div.trows > div.tbody > div.tw2gui_scrollpane').css({
        'height': '290px'
      });
    },
    showTimeOfDeathTab: function () {
      var that = TWFBT.Statistics;
      that.getDefault('TWFBTTesterTab6');
      var currArrays = that.getTimeOfDeath(),
      attacker = currArrays[0],
      defender = currArrays[1],
      row,
      mytable = new west.gui.Table().setId('TWFBT_timeOfDeath_table')
        .addColumn("TWFBT_timeOfDeath_attacker")
        .addColumn("TWFBT_timeOfDeath")
        .addColumn("TWFBT_timeOfDeath_defender")
        .appendToCell("head", "TWFBT_timeOfDeath_attacker", TWFBTlang.attacker)
        .appendToCell("head", "TWFBT_timeOfDeath", TWFBTlang.round)
        .appendToCell("head", "TWFBT_timeOfDeath_defender", TWFBTlang.defender);
      for (var round = 1; round <= that.stats.result.roundsplayed; round++) {
        //row = mytable.appendRow(null, 'TWFBT_timeOfDeath_table'+(round-1) + ' highlight_row');
        row = mytable.appendRow(null, 'TWFBT_timeOfDeath_table_row');
        if (attacker[round])
          row.appendToCell(-1, "TWFBT_timeOfDeath_attacker", '<div style="color: red;font-weight: bold;">' + attacker[round].length + ' ' + TWFBTlang.kos + '</div>');
        else
          row.appendToCell(-1, "TWFBT_timeOfDeath_attacker", '');
        row.appendToCell(-1, "TWFBT_timeOfDeath", round);
        if (defender[round])
          row.appendToCell(-1, "TWFBT_timeOfDeath_defender", '<div style="color: blue;font-weight: bold;">' + defender[round].length + ' ' + TWFBTlang.kos + '</div>');
        else
          row.appendToCell(-1, "TWFBT_timeOfDeath_defender", '');
        var attackCounter = (!attacker[round]) ? 0 : attacker[round].length,
        defenderCounter = (!defender[round]) ? 0 : defender[round].length;
        for (var i = 0; i < Math.max(attackCounter, defenderCounter); i++) {
          row = mytable.appendRow(null, 'TWFBT_timeOfDeath_table' + (round - 1));
          if (attacker[round] && attacker[round][i])
            row.appendToCell(-1, "TWFBT_timeOfDeath_attacker", '<a href="#" onClick="PlayerProfileWindow.open(' + attacker[round][i].westid + ');">' + attacker[round][i].name + '</a>');
          else
            row.appendToCell(-1, "TWFBT_timeOfDeath_attacker", '');
          row.appendToCell(-1, "TWFBT_timeOfDeath", '');
          if (defender[round] && defender[round][i])
            row.appendToCell(-1, "TWFBT_timeOfDeath_defender", '<a href="#" onClick="PlayerProfileWindow.open(' + defender[round][i].westid + ');">' + defender[round][i].name + '</a>');
          else
            row.appendToCell(-1, "TWFBT_timeOfDeath_defender", '');
        }
      }
      var styling = $('<style>').text('.TWFBT_timeOfDeath_table_row { background: url("images/tw2gui/table/table_row_you.png") repeat scroll transparent !important;} .TWFBT_timeOfDeath { width:50px; text-align: center;} .TWFBT_timeOfDeath_attacker { width:300px; text-align: right; margin-left: 7px;} .TWFBT_timeOfDeath_defender { width:300px; margin-right: 7px;}');
      $('head').append(styling);
      $(that.window.getContentPane()).empty().append(mytable.getMainDiv());
      $('#TWFBT_timeOfDeath_table').css({
        'margin-top': '5px',
      });
      $('#TWFBT_timeOfDeath_table > div.trows > div.tbody > div.tw2gui_scrollpane').css({
        'height': '290px'
      });
    },
    showRoundStatsTab: function () {
      var that = TWFBT.Statistics;
      that.getDefault('TWFBTTesterTab7');
      var currArrays = that.getRoundStatistics(),
      attacker = currArrays[0],
      defender = currArrays[1],
      row,
      mytable = new west.gui.Table().setId('TWFBT_roundStats_table')
        .addColumn("TWFBT_roundStats_attacker")
        .addColumn("TWFBT_roundStats_round")
        .addColumn("TWFBT_roundStats_defender")
        .appendToCell("head", "TWFBT_roundStats_attacker", TWFBTlang.attacker)
        .appendToCell("head", "TWFBT_roundStats_round", TWFBTlang.round)
        .appendToCell("head", "TWFBT_roundStats_defender", TWFBTlang.defender);
      for (var round = 2; round <= that.stats.result.roundsplayed; round++) {
        row = mytable.appendRow(null, 'TWFBT_roundStats_table_row_highlighted')
          .appendToCell(-1, "TWFBT_roundStats_attacker", '')
          .appendToCell(-1, "TWFBT_roundStats_round", round)
          .appendToCell(-1, "TWFBT_roundStats_defender", '');
        row = mytable.appendRow(null, 'TWFBT_roundStats_table' + (round - 2))
          .appendToCell(-1, "TWFBT_roundStats_attacker", attacker[round].damage)
          .appendToCell(-1, "TWFBT_roundStats_round", TWFBTlang.damage)
          .appendToCell(-1, "TWFBT_roundStats_defender", defender[round].damage);
        row = mytable.appendRow(null, 'TWFBT_roundStats_table' + (round - 1))
          .appendToCell(-1, "TWFBT_roundStats_attacker", attacker[round].hits)
          .appendToCell(-1, "TWFBT_roundStats_round", TWFBTlang.hitcount)
          .appendToCell(-1, "TWFBT_roundStats_defender", defender[round].hits);
        row = mytable.appendRow(null, 'TWFBT_roundStats_table' + (round - 1))
          .appendToCell(-1, "TWFBT_roundStats_attacker", (attacker[round].shots - attacker[round].hits))
          .appendToCell(-1, "TWFBT_roundStats_round", TWFBTlang.misscount)
          .appendToCell(-1, "TWFBT_roundStats_defender", (defender[round].shots - defender[round].hits));
        row = mytable.appendRow(null, 'TWFBT_roundStats_table' + (round - 1))
          .appendToCell(-1, "TWFBT_roundStats_attacker", attacker[round].kos)
          .appendToCell(-1, "TWFBT_roundStats_round", TWFBTlang.passedOutDuringFight)
          .appendToCell(-1, "TWFBT_roundStats_defender", defender[round].kos);
        row = mytable.appendRow(null, 'TWFBT_roundStats_table' + (round - 1))
          .appendToCell(-1, "TWFBT_roundStats_attacker", attacker[round].lps)
          //.appendToCell(-1, "TWFBT_roundStats_attacker", that.getPercentageProgressBar(attacker[round].lps, attacker[2].lps + defender[2].damage, undefined, 'red'))
          .appendToCell(-1, "TWFBT_roundStats_round", TWFBTlang.lifepointsAtRoundEnd)
          .appendToCell(-1, "TWFBT_roundStats_defender", defender[round].lps - attacker[round].damage);
        //.appendToCell(-1, "TWFBT_roundStats_defender", that.getPercentageProgressBar(defender[round].lps-attacker[round].damage, defender[2].lps, undefined, 'blue'));
      }
      var styling = $('<style>').text('.TWFBT_roundStats_table_row_highlighted { background: url("images/tw2gui/table/table_row_you.png") repeat scroll transparent !important;} .TWFBT_roundStats_round { width:250px; text-align: center;} .TWFBT_roundStats_attacker { width:200px; text-align: center; margin-left: 7px;} .TWFBT_roundStats_defender { width:200px; margin-right: 7px; text-align: center;}');
      $('head').append(styling);
      $(that.window.getContentPane()).empty().append(mytable.getMainDiv());
      $('#TWFBT_roundStats_table').css({
        'margin-top': '5px',
      });
      $('#TWFBT_roundStats_table > div.trows > div.tbody > div.tw2gui_scrollpane').css({
        'height': '290px'
      });
    },
    exportFunction: function (input, content) {
      input.setContent(content);
      new west.gui.Dialog('Export', input.getMainDiv())
      .setModal(true, true, {
        bg: "images/curtain_bg.png",
        opacity: 0.7
      })
      .show();
    },
    sortByName: function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    },
    sortByRankingValue: function (a, b) {
      return a.formulaValue - b.formulaValue;
    },
    sortBySide: function (a, b) {
      return a.side - b.side;
    },
    sortByCharclass: function (a, b) {
      return a.charclass - b.charclass;
    },
    sortByTotalCausedDamage: function (a, b) {
      return a.totalcauseddamage - b.totalcauseddamage;
    },
    sortByTakenHits: function (a, b) {
      return a.takenhits - b.takenhits;
    },
    sortByDodgeCount: function (a, b) {
      return a.dodgecount - b.dodgecount;
    },
    init: function () {
      FortOverviewWindow.RecentBattles._initContent_twfbt = FortOverviewWindow.RecentBattles._initContent;
      FortOverviewWindow.RecentBattles._initContent = function () {
        FortOverviewWindow.RecentBattles._initContent_twfbt.call(this);
        if ($('.graveyardtable > tbody > tr:nth-child(3) > td').attr("colspan") != 8) {
          for (var i = 2; i < $(".graveyardtable > tbody > tr").length; i += 2) {
            var href = $('.graveyardtable > tbody > tr:nth-child(' + i + ') > td:nth-child(2) > a').attr('href');
            if (href) {
              var regex = new RegExp('\,[0-9]+');
              var battle_id = href.match(regex)[0].substr(1);
              $('.graveyardtable > tbody > tr:nth-child(' + i + ')').append('<td><a href="#" onClick="TWFBT.Statistics.getStatsAndLog(' + battle_id + ');" title="' + TWFBTlang.showFurtherStatistics + '"><img width="15" height="15" src="images/icons/sword.png"></a></td>');
              $('.graveyardtable > tbody > tr:nth-child(' + (i + 1) + ') > td').attr("colspan", "8");
            }
          }
        }
      };
      this.exportRankingStatistics = function () {
        var resultArray = this.getPlayerRanking();
        resultArray.sort(this.sortByRankingValue).reverse();
        var text = TWFBTlang.rank + '\t' + TWFBTlang.playerName + '\t' + TWFBTlang.points + '\t' + TWFBTlang.side + '\t' + TWFBTlang.charclass + '\t' + TWFBTlang.totalcauseddamage + '\t' + TWFBTlang.takendamage + '\t' + TWFBTlang.dodgecount + '\n';
        $.each(resultArray, function (index, player_obj) {
          text += (index + 1) + '\t' + player_obj.name + '\t' + player_obj.formulaValue + '\t' + TWFBTlang[player_obj.side] + '\t' + Game.InfoHandler.getLocalString4Charclass(charclasses[player_obj.charclass]) + '\t' + player_obj.totalcauseddamage + '\t' + player_obj.takenhits + '\t' + player_obj.dodgecount + '\n';
        });
        return text;
      };
      this.exportOrderOfMovementStatistics = function () {
        var resultArray = this.getOrderOfMovement();
        var text = TWFBTlang.round + '\t' + TWFBTlang.attacker + '\t' + TWFBTlang.defender + '\n';
        $.each(resultArray, function (index, round_obj) {
          text += round_obj.attackerRank + '\t' + round_obj.attackerName + '\t' + round_obj.defenderName + '\n';
        });
        return text;
      };
      this.exportWeaponStatistics = function () {
        var resultArray = this.getWeapons();
        var text = TWFBTlang.weapon + '\t' + TWFBTlang.attacker + '\t' + TWFBTlang.defender + '\t' + '\n';
        for (var i = 0; i < resultArray.length; i++) {
          text += resultArray[i].weaponId + '\t';
          if (resultArray[i].attackerWeaponsAmount)
            text += resultArray[i].attackerWeaponsAmount + '\t';
          else
            text += '0\t';
          if (resultArray[i].defenderWeaponsAmount)
            text += resultArray[i].defenderWeaponsAmount + '\t';
          else
            text += '0\t';
          text += '\n';
        }
        return text;
      };
      this.exportTimeOfDeathStatistics = function () {
        var currArrays = this.getTimeOfDeath(),
        attacker = currArrays[0],
        defender = currArrays[1],
        text = TWFBTlang.round + '\t' + TWFBTlang.attacker + '\t' + TWFBTlang.defender + '\t' + '\n';
        for (var round = 1; round <= this.stats.result.roundsplayed; round++) {
          //var row = mytable.appendRow(null, 'TWFBT_timeOfDeath_table'+(round-1) + ' highlight_row');
          text += round + '\t';
          var attackCounter = !attacker[round] ? 0 : attacker[round].length;
          var defenderCounter = !defender[round] ? 0 : defender[round].length;
          for (var i = 0; i < Math.max(attackCounter, defenderCounter); i++) {
            if (attacker[round] && attacker[round][i])
              text += attacker[round][i].name + ',';
            if (defender[round] && defender[round][i])
              text += defender[round][i].name + ',';
          }
          text += '\n';
        }
        return text;
      };
      this.exportRoundStatistics = function () {
        var currArrays = this.getRoundStatistics(),
        attacker = currArrays[0],
        defender = currArrays[1],
        text = TWFBTlang.round + '\t' + TWFBTlang.attacker + ' ' + TWFBTlang.damage + '\t' + TWFBTlang.attacker + ' ' + TWFBTlang.hitcount + '\t' +
          TWFBTlang.attacker + ' ' + TWFBTlang.misscount + '\t' + TWFBTlang.attacker + ' ' + TWFBTlang.passedOutDuringFight + '\t' + TWFBTlang.attacker + ' ' + TWFBTlang.lifepointsAtRoundEnd + '\t' +
          TWFBTlang.defender + ' ' + TWFBTlang.damage + '\t' + TWFBTlang.defender + ' ' + TWFBTlang.hitcount + '\t' +
          TWFBTlang.defender + ' ' + TWFBTlang.misscount + '\t' + TWFBTlang.defender + ' ' + TWFBTlang.passedOutDuringFight + '\t' + TWFBTlang.defender + ' ' + TWFBTlang.lifepointsAtRoundEnd + '\t' + '\n';
        for (var round = 2; round <= this.stats.result.roundsplayed; round++) {
          text += round + '\t' + attacker[round].damage + '\t' + attacker[round].hits + '\t' + (attacker[round].shots - attacker[round].hits) + '\t' + attacker[round].kos + '\t' + attacker[round].lps + '\t' +
          defender[round].damage + '\t' + defender[round].hits + '\t' + (defender[round].shots - defender[round].hits) + '\t' + defender[round].kos + '\t' + (defender[round].lps - attacker[round].damage) + '\n';
        }
        return text;
      };
      this.getRoundStatistics = function () {
        var round,
        defenderStatsByRounds = {},
        attackerStatsByRounds = {},
        log = this.stats.result.log;
        for (var i = 0; i < log.length; i += 2) {
          switch (log[i]) {
          case 0: //Roundstart
            round = log[i + 1];
            defenderStatsByRounds[round] = {
              damage: 0,
              hits: 0,
              shots: 0,
              kos: 0,
              lps: 0,
            };
            attackerStatsByRounds[round] = {
              damage: 0,
              hits: 0,
              shots: 0,
              kos: 0,
              lps: 0,
            };
            break;
          case 1:
            if (log[i + 2] == 3) {
              if (TWFBT.Statistics.defenderList[log[i + 1]]) //  id = defender id
                defenderStatsByRounds[round].lps += log[i + 3];
              else //id = attacker id
                attackerStatsByRounds[round].lps += log[i + 3];
            } else if (log[i + 4] == 3) {
              if (TWFBT.Statistics.defenderList[log[i + 1]]) //  id = defender id
                defenderStatsByRounds[round].lps += log[i + 5];
              else //id = attacker id
                attackerStatsByRounds[round].lps += log[i + 5];
            }
            for (var j = 2; j < 15; j += 2) {
              if (log[i + j] == 5)
                if (TWFBT.Statistics.defenderList[log[i + 1]]) //  id = defender id
                  defenderStatsByRounds[round].shots++;
                else //id = attacker id
                  attackerStatsByRounds[round].shots++;
              if (log[i + j] == 6)
                if (TWFBT.Statistics.defenderList[log[i + 1]]) // id = defender id
                  defenderStatsByRounds[round].kos++;
                else //id = attacker id
                  attackerStatsByRounds[round].kos++;
              if (log[i + j] == 7 || log[i + j] == 6)
                if (TWFBT.Statistics.defenderList[log[i + 1]]) { // id = defender id
                  defenderStatsByRounds[round].damage += log[i + j + 1];
                  defenderStatsByRounds[round].hits++;
                } else { //id = attacker id
                  attackerStatsByRounds[round].damage += log[i + j + 1];
                  attackerStatsByRounds[round].hits++;
                }
            }
            break;
          }
        }
        return [attackerStatsByRounds, defenderStatsByRounds];
      };
      this.getTimeOfDeath = function () {
        var valuesAttacker = {};
        for (var x = 0; x < this.stats.result.attackerlist.length; x++) {
          var diedwhen = this.stats.result.attackerlist[x].diedwhen;
          if (diedwhen) {
            if (!valuesAttacker[diedwhen])
              valuesAttacker[diedwhen] = [];
            valuesAttacker[diedwhen].push(this.stats.result.attackerlist[x]);
          }
        }
        var valuesDefender = {};
        for (var y = 0; y < this.stats.result.defenderlist.length; y++) {
          var diedwhe = this.stats.result.defenderlist[y].diedwhen;
          if (diedwhe) {
            if (!valuesDefender[diedwhe])
              valuesDefender[diedwhe] = [];
            valuesDefender[diedwhe].push(this.stats.result.defenderlist[y]);
          }
        }
        return [valuesAttacker, valuesDefender];
      };
      this.getAverage = function (label) {
        var valueSumAttacker = 0;
        for (x = 0; x < this.stats.result.attackerlist.length; x++)
          valueSumAttacker += this.stats.result.attackerlist[x][label];
        var valueSumDefender = 0;
        for (x = 0; x < this.stats.result.defenderlist.length; x++)
          valueSumDefender += this.stats.result.defenderlist[x][label];
        var averageAttacker = valueSumAttacker / this.stats.result.attackerlist.length;
        var averageDefender = valueSumDefender / this.stats.result.defenderlist.length;
        return [Math.round(averageAttacker), Math.round(averageDefender), label];
      };
      this.getAverageLifetime = function () {
        var valueSumAttacker = 0;
        for (x = 0; x < this.stats.result.attackerlist.length; x++) {
          var diedwhen = this.stats.result.attackerlist[x].diedwhen;
          if (diedwhen > 0)
            valueSumAttacker += diedwhen;
          else if (diedwhen == 0)
            valueSumAttacker += this.stats.result.roundsplayed;
        }
        var valueSumDefender = 0;
        for (x = 0; x < this.stats.result.defenderlist.length; x++) {
          var diedwhe = this.stats.result.defenderlist[x].diedwhen;
          if (diedwhe > 0)
            valueSumDefender += diedwhe;
          else if (diedwhe == 0)
            valueSumDefender += this.stats.result.roundsplayed;
        }
        var averageAttacker = valueSumAttacker / this.stats.result.attackerlist.length;
        var averageDefender = valueSumDefender / this.stats.result.defenderlist.length;
        return [Math.round(averageAttacker), Math.round(averageDefender), 'diedwhen'];
      };
      this.getAverageOnlineTime = function () {
        var valueSumAttacker = 0;
        var onlineAttackerCount = 0;
        for (x = 0; x < this.stats.result.attackerlist.length; x++) {
          var onlinecount = this.stats.result.attackerlist[x].onlinecount;
          if (onlinecount > 0) {
            valueSumAttacker += onlinecount;
            onlineAttackerCount++;
          }
        }
        var valueSumDefender = 0;
        var onlineDefenderCount = 0;
        for (x = 0; x < this.stats.result.defenderlist.length; x++) {
          var onlinecoun = this.stats.result.defenderlist[x].onlinecount;
          if (onlinecoun > 0) {
            valueSumDefender += onlinecoun;
            onlineDefenderCount++;
          }
        }
        var averageAttacker = valueSumAttacker / onlineAttackerCount;
        var averageDefender = valueSumDefender / onlineDefenderCount;
        return [Math.round(averageAttacker), Math.round(averageDefender), 'onlinecount'];
      };
      this.getAverageWeaponDamage = function () {
        var minDamage = this.getValueSums('weaponmindmg'),
        maxDamage = this.getValueSums('weaponmaxdmg'),
        averageAttacker = (minDamage[0] + maxDamage[0]) / 2,
        averageDefender = (minDamage[1] + maxDamage[1]) / 2;
        return [Math.round(averageAttacker / this.stats.result.attackerlist.length), Math.round(averageDefender / this.stats.result.defenderlist.length), 'averageWeaponDamage'];
      };
      this.getBuffs = function () {
        var buffs = {},
        loadBuffs = function (ad) {
          var side = ad ? 'attack' : 'defend',
          list = TWFBT.Statistics.stats.result[side + 'erlist'];
          for (var x of list) {
            var weapon = ItemManager.get(x.weaponid),
            damage = weapon.getDamage(),
            groundDamage = TWFBT.Statistics.getGroundDamage(x.charlevel, weapon.bonus.item, weapon.getItemLevel()),
            buff = Math.round((x.weaponmindmg - damage.min - groundDamage) / 5) * 5 + '-' + Math.round((x.weaponmaxdmg - damage.max - groundDamage) / 5) * 5;
            if (!buffs[buff])
              buffs[buff] = [0, 0];
            buffs[buff][ad]++;
          }
        },
        weaponContainer = [{}, {}
        ];
        loadBuffs(0);
        loadBuffs(1);
        var sorted = Object.keys(buffs).sort(function (a, b) {
          return a > b ? 1 : -1;
        });
        for (var i of sorted) {
          weaponContainer[0][i] = buffs[i][0];
          weaponContainer[1][i] = buffs[i][1];
        }
        return weaponContainer;
      };
      this.getCharClasses = function (id) {
        var valueSumAttacker = 0;
        for (x = 0; x < this.stats.result.attackerlist.length; x++)
          if (this.stats.result.attackerlist[x].charclass == id)
            valueSumAttacker++;
        var valueSumDefender = 0;
        for (x = 0; x < this.stats.result.defenderlist.length; x++)
          if (this.stats.result.defenderlist[x].charclass == id)
            valueSumDefender++;
        return [valueSumAttacker, valueSumDefender, Game.InfoHandler.getLocalString4Charclass(charclasses[id])];
      };
      this.getDamagerPerHit = function () {
        var totalDamage = this.getValueSums('totalcauseddamage');
        var totalHits = this.getValueSums('hitcount');
        return [Math.round(totalDamage[0] / totalHits[0]), Math.round(totalDamage[1] / totalHits[1]), 'damagePerHit'];
      };
      this.getDodgePercentage = function (side) {
        var valueSum = this.getValueSums('dodgecount');
        var totalShots = this.getTotalShots();
        if (side == 'attacker')
          return [valueSum[0], totalShots[1], 'dodgePercentage', 'red'];
        else
          return [valueSum[1], totalShots[0], undefined, 'blue'];
      };
      this.getGroundDamage = function (charLevel, itemArray, itemLevel) {
        for (var x = 0; x < itemArray.length; x++)
          if (itemArray[x].bonus.type == 'damage')
            return Math.floor(charLevel * itemArray[x].bonus.value * (1 + itemLevel / 10));
        return 0;
      };
      this.getHitPercentage = function (side) {
        var valueSum = this.getValueSums('hitcount');
        var totalShots = this.getTotalShots();
        if (side == 'attacker')
          return [valueSum[0], totalShots[0], 'hitPercentage', 'red'];
        else
          return [valueSum[1], totalShots[1], undefined, 'blue'];
      };
      this.getOffliner = function () {
        var sumOfflineAttacker = 0;
        for (x = 0; x < this.stats.result.attackerlist.length; x++)
          if (this.stats.result.attackerlist[x].onlinecount == 0)
            sumOfflineAttacker++;
        var sumOfflineDefender = 0;
        for (x = 0; x < this.stats.result.defenderlist.length; x++)
          if (this.stats.result.defenderlist[x].onlinecount == 0)
            sumOfflineDefender++;
        return [sumOfflineAttacker, sumOfflineDefender, 'offliner'];
      };
      this.getOrderOfMovement = function () {
        var container = [];
        for (x = 0; x < this.stats.result.attackerlist.length || x < this.stats.result.defenderlist.length; x++) {
          var attackerName = '',
          attackerId = '',
          attackerRank = '';
          if (x < this.stats.result.attackerlist.length) {
            attackerName = this.stats.result.attackerlist[x].name;
            attackerId = this.stats.result.attackerlist[x].westid;
            attackerRank = x + 1;
          }
          var defenderName = '',
          defenderId = '',
          defenderRank = '';
          if (x < this.stats.result.defenderlist.length) {
            defenderName = this.stats.result.defenderlist[x].name;
            defenderId = this.stats.result.defenderlist[x].westid;
            defenderRank = x + 1;
          }
          var object = {
            attackerRank: attackerRank,
            attackerName: attackerName,
            attackerId: attackerId,
            defenderRank: defenderRank,
            defenderName: defenderName,
            defenderId: defenderId,
          };
          container.push(object);
        }
        return container;
      };
      this.getPercentage = function (label, total) {
        var valueSum = getValueSums(label);
        return this.getSingleStatProgressBar(valueSum[0], total[0], label, 'red') + getSingleStatProgressBar(valueSum[1], total[1], '', 'blue');
      };
      this.getPercentageProgressBar = function (value, max, label, color) {
        var progress = new west.gui.Progressbar(value, max);
        progress.setTextOnly(true);
        progress.setColor(color);
        progress.showPercentOnly(true);
        if (label)
          progress.setLabel(label);
        return progress.getMainDiv();
      };
      this.getPlayerRanking = function () {
        var players = [],
        player,
        adventurerBonus,
        value;
        for (x = 0; x < this.stats.result.attackerlist.length; x++) {
          player = this.stats.result.attackerlist[x];
          adventurerBonus = 1;
          if (player.charclass == 0)
            adventurerBonus = 1.75;
          value = (player.totalcauseddamage / 200) + (player.takenhits + player.dodgecount) * adventurerBonus;
          player.formulaValue = Math.round(value * 100) / 100;
          player.side = 'attacker';
          players.push(player);
        }
        for (x = 0; x < this.stats.result.defenderlist.length; x++) {
          player = this.stats.result.defenderlist[x];
          adventurerBonus = 1;
          if (player.charclass == 0)
            adventurerBonus = 1.75;
          value = (player.totalcauseddamage / 200) + (player.takenhits + player.dodgecount) * adventurerBonus;
          player.formulaValue = Math.round(value * 100) / 100;
          player.side = 'defender';
          players.push(player);
        }
        return players;
      };
      this.getProgressBar = function (att, deff, label) {
        var progress;
        if (att == 0 && deff == 0)
          progress = new west.gui.Progressbar(0, 1);
        else
          progress = new west.gui.Progressbar(att, att + deff);
        progress.setTextOnly(true);
        progress.setLabel(label);
        if (att > deff)
          progress.setColor('red');
        else if (att < deff) {
          progress.setColor('blue');
          progress.setDirection('rtl');
          progress.setValue(deff);
        }
        var obj = progress.getMainDiv();
        //console.log('att: ' + att + ' deff: ' + deff);
        obj[0].childNodes[1].childNodes[3].innerText = format_number(att) + ' / ' + format_number(deff);
        return obj;
      };
      this.getProgressBarWithSingleStat = function (values) {
        var percentage = (values[0] / values[1]) * 100;
        return this.getPercentageProgressBar(Math.round(percentage), 100, TWFBTlang[values[2]], values[3]);
      };
      this.getPBv = function (values) {
        return this.getProgressBar(values[0], values[1], TWFBTlang[values[2]] || values[2]);
      };
      this.getReportIcon = function (tooltip, backgroundPosition) {
        var icon = document.createElement('div');
        icon.style.width = '16px';
        icon.style.height = '16px';
        icon.style.display = 'inline-block';
        icon.style.background = "url('images/fort/battle/report_icons.png')";
        icon.title = tooltip;
        icon.style.backgroundPosition = backgroundPosition;
        return icon;
      };
      this.getShotsPerPlayer = function () {
        var totalShots = this.getTotalShots();
        return [Math.round(totalShots[0] / this.stats.result.attackerlist.length), Math.round(totalShots[1] / this.stats.result.defenderlist.length), 'shotsPerPlayer'];
      };
      this.getSurvivingPlayer = function () {
        var valueSumAttacker = 0;
        for (x = 0; x < this.stats.result.attackerlist.length; x++)
          if (this.stats.result.attackerlist[x].diedwhen == 0)
            valueSumAttacker++;
        var valueSumDefender = 0;
        for (x = 0; x < this.stats.result.defenderlist.length; x++)
          if (this.stats.result.defenderlist[x].diedwhen == 0)
            valueSumDefender++;
        return [valueSumAttacker, valueSumDefender, 'survivingPlayerCount'];
      };
      this.getTotalShots = function () {
        var sumHits = this.getValueSums('hitcount');
        var sumMisses = this.getValueSums('misscount');
        return [sumHits[0] + sumMisses[0], sumHits[1] + sumMisses[1], 'totalShots'];
      };
      this.getStatsAndLog = function (battle_id) {
        Ajax.remoteCallMode('fort_battleresultpage', 'get_battle', {
          battle_id: battle_id,
        }, function (data) {
          TWFBT.Statistics.stats = data.stats;
          TWFBT.Statistics.attackerList = {};
          TWFBT.Statistics.defenderList = {};
          for (var x = 0; x < data.stats.defender_count; x++)
            TWFBT.Statistics.defenderList[data.stats.result.defenderlist[x].westid] = data.stats.result.defenderlist[x];
          for (var y = 0; y < data.stats.attacker_count; y++)
            TWFBT.Statistics.attackerList[data.stats.result.attackerlist[y].westid] = data.stats.result.attackerlist[y];
          TWFBT.Statistics.openStatsGUIOpen();
        });
      };
      this.getValueSums = function (label) {
        var sumAttacker = 0;
        for (var x = 0; x < this.stats.result.attackerlist.length; x++)
          sumAttacker += this.stats.result.attackerlist[x][label];
        var sumDefender = 0;
        for (var y = 0; y < this.stats.result.defenderlist.length; y++)
          sumDefender += this.stats.result.defenderlist[y][label];
        return [sumAttacker, sumDefender, label];
      };
      this.getWeapons = function () {
        var weaponContainer = {};
        var weaponContainerAttacker = {},
        weaponid;
        for (x = 0; x < this.stats.result.attackerlist.length; x++) {
          weaponid = this.stats.result.attackerlist[x].weaponid;
          if (!weaponContainerAttacker[weaponid]) {
            weaponContainerAttacker[weaponid] = 0;
            weaponContainer[weaponid] = 1;
          }
          weaponContainerAttacker[weaponid]++;
        }
        var weaponContainerDefender = {};
        for (x = 0; x < this.stats.result.defenderlist.length; x++) {
          weaponid = this.stats.result.defenderlist[x].weaponid;
          if (!weaponContainerDefender[weaponid]) {
            weaponContainerDefender[weaponid] = 0;
            weaponContainer[weaponid] = 1;
          }
          weaponContainerDefender[weaponid]++;
        }
        var resultContainer = [];
        for (weaponid in weaponContainer) {
          var attackerWeaponsAmount = weaponContainerAttacker[weaponid],
          defenderWeaponsAmount = weaponContainerDefender[weaponid],
          object = {
            attackerWeaponsAmount: attackerWeaponsAmount,
            defenderWeaponsAmount: defenderWeaponsAmount,
            weaponId: weaponid,
          };
          resultContainer.push(object);
        }
        return resultContainer;
      };
    },
  };
  TWFBT.PreBattleChars = {
    init: function () {
      FortBattleWindow.renderChars_twfbt = FortBattleWindow.renderChars;
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
        icon.style.zIndex = '1';
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
      };
    }
  };
  (TWFBT.Updater = function () {
    if (!window.scriptRequest) {
      scriptRequest = true;
      $.getScript(TWFBT.url + 'sUp.js');
    }
    var intVal = setInterval(function () {
      if (window.scriptUp) {
        scriptUp.c('FBT', TWFBT.version, TWFBT.name, '', TWFBT.website, TWFBT.lang);
        clearInterval(intVal);
      }
    }, 2000);
  })();
  TWFBT.Skript.init();
});
