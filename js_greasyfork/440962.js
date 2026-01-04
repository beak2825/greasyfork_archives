// ==UserScript==
// @name The West - Essentials
// @namespace https://the-west-scripts.github.io/The-West-Essentials/
// @author Tom Robert (Leotas/Falc0n.RG/neversleep1911/Rask Hund/Esperiano/Dun/Macabre2077)
// @description The West 3.0
// @include http*://*.the-west.*.*/game.php*
// @include https://*.the-west.*/index.php?page=logout
// @include https://www.the-west.*
// @include https://beta.the-west.net*
// @include http*://tw-db.info/*?strana=invent&x=*
// @exclude https://classic.the-west.net*
// @version 1.48.6
// @supportURL https://github.com/The-West-Scripts/The-West-Essentials/issues
// @icon https://the-west.net/favicon.ico
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/440962/The%20West%20-%20Essentials.user.js
// @updateURL https://update.greasyfork.org/scripts/440962/The%20West%20-%20Essentials.meta.js
// ==/UserScript==
// translation:Tom Robert(German&English),Darius II/Wojcieszy/TeeNOmore127/pantomas(Polish),pepe100/HALCON DE ORO(Spanish),ruud99/Tanais(Dutch),Creature/krcsirke(Hungarian),Timemod Herkumo(Greek),Elly Siranno/Raymond Reddington/jccwest/gamer(Portuguese),Billy-AR/tw81(Italian),Tom Robert/Falc0n.RG/Dun(French),Jamza/Surge(Czech&Slovak),Did97/Macabre2077(Russian),OguzhanCekic(Turkish)
// jshint -W100
(function (fn) {
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn.toString() + ')();';
  document.body.appendChild(script);
  document.body.removeChild(script);
})(function () {
  if (location.href.includes('index.php?page=logout')) {
    location.href = '/';
  } else {
    TWX = {
      version: '1.48.6',
      langs: {
        en: {
          language: 'English',
          ApiGui1: 'This script contains many features to simplify your everyday life in The West.<br>More Informations',
          ApiGui2: 'Open script page',
          Feat: {
            ColorTchat: '%0 Adds new features to the chat. Colored text, Emojis 🐧🎉 etc.',
            QuickItemsSearch: '%0 Search for buff categories and sets in your inventory',
            MarketBestBids: '%0 Colors the auctions based on the price %1 Green %2 Bid is lower than the purchase price %3 Black %4 Bid is equal to the purchase price %5 Blue %6 Bid is between 100% and 200% of the purchase price %7 Red %8 Bid is more than 200%">',
            BattleStars: '%0 Additional stats in the fort battle report',
            KickoMatic: '%0 Helpful to rank players before a fort battle',
            DuelMap: 'Add a duel map to the duel window',
            MarkDaily: 'Highlight daily login bonus on day 5 to not miss it',
            MarketMessage: 'Get a message when there are items or money to pick up on actual market',
            AchievHide: 'Hide completed achievements in achievements window',
            RecipeMarket: 'Improve the purchase of recipes on market',
            MoveJobs: 'Move the queued jobs a bit to the left',
            InstantQuest: 'Complete the quest instantly if all requirements are done',
            QuestWiki: 'Add a link in the quest window to show the quest on the wiki page',
            CityTravel: 'Show the travel time to the towns in the blackboard',
            BetterSheriff: 'Add a new tab in the sheriff window to see all possible bounties',
            ChatProfessions: 'Show the crafting profession of the players in the chat list',
            QuestBookSearch: 'Search for solved quests in the quest book',
            MarketRights: 'Show if market offers are public or only for alliance/town members',
            EquipManagerPlus: 'Improve the equipment manager in the inventory',
            ShortPopups: 'Make the item pop-ups shorter',
            HideNotis: 'Add a button to hide the job notifications on the left side',
            JobProducts: 'Show in the job pop-up how many products you already have in your inventory',
            MapDistance: ' Show the number of miles next to the travel time',
            TraderSell: 'Sell multiple items at once to the trader',
            TouchControl: 'Enable touch control on your mobile browser',
            FbRankingChar: 'Show the character class in the fortbattle world ranking',
            DuelXpCalc: 'Show the duel experience in player profiles',
            Logout: 'Add a logout button on the right side',
            Statusbar: 'Remove the taskbar',
            ChangeCity: 'Switch title and player name in the town hall',
            BlinkEvents: 'Stop the blinking of the event, County Fair buttons on the left side',
            FortTracker: 'Turn off fort battle reminder',
            FriendsPop: 'Hide "Friend online" pop-ups',
          },
          settings1: 'Open settings',
          settings2: 'Open settings and information window',
          ghosttown2: 'Open ghost town',
          ghosttown3: 'Open ghost town and center it on map',
          indiantown2: 'Open Indian village',
          indiantown3: 'Open Indian village and center it on map',
          openmarket: 'Open market',
          opentrader: 'Open mobile trader',
          forum: 'Open town forum',
          newsets: 'New sets are added to the script',
          chooseItems: 'Choose the items',
          remindHover: 'You get a notification when an item can be used again. Here you can choose these items.',
          remindReady: 'Ready to collect',
          skipHover: 'Skip the confirmation and result messages when you open some bags. Here you can choose these bags',
          skipDone: 'You get',
          info: 'Info',
          contact: 'Contact',
          chooseLang: 'Choose language',
          features: 'Features',
          name: 'Name',
          save: 'Save',
          saveMessage: 'Saved successfully',
          saveMessage2: 'Settings saved. Some changes need a refresh of the game window.',
          setbonus2: 'Informations about the set bonuses',
          bonussearch2: 'Find items by bonus',
          frame2: 'Helpful web pages',
          npclocator2: 'Find quest givers on the map',
          choose: 'Click on the hat to get started',
          items: 'items',
          parts: 'parts',
          showItems: 'Show the set items in your Bag',
          noItems: 'No items in your inventory found. Click again with CTRL to show it on TW-Calc.',
          ownSets: 'Only own sets',
          switchWeapon: 'Switch between firearm and melee weapon',
          selectBonus: 'Select bonuses',
          resetB: 'Reset',
          body: 'Clothing',
          right_arm: 'Weapons',
          animal: 'Horse & Yield',
          rest: 'Other',
          buff: 'Buffs',
          refresh: 'Refresh',
          noFriends: 'No Friends',
          reward: 'Reward',
          allprofessions: 'All Professions',
          market1: 'Items on market',
          market2: 'There are items/money on this market. What do you want to pick up?',
          all: 'All',
          onlyBids: 'Only bids',
          nothing: 'Nothing',
          worldwide: 'Worldwide',
          alliance: 'Alliance',
          town: 'Town',
          level: 'Level',
          duelLevel: 'Duelling level',
          exp: 'Exp',
          distance: 'Distance',
          startduel: 'Start Duel',
          centerMap: 'Center map',
          popup: 'The opponent\'s skill bonus',
          damage: 'Damage',
          duelmap: 'Duel map',
          duelradius: 'Duel radius',
          minutes: 'minutes',
          hour: '1 hour',
          hours: 'hours',
          searchOpp: 'Search for opponents',
          amount: 'Dead',
          not_dead_amount: 'Alive',
          duellevel: 'Lvl',
          pStatus: 'Status',
          sortBy: 'Sort by',
          tooLow: 'Too low duelling level of opponent',
          tooHigh: 'Too high duelling level of opponent',
          ownTown: 'Member of your town',
          attackable: 'Show only attackable players',
          youKO: 'You have duel protection',
          attDl: 'Attackable duelling levels',
          duelxp: 'Current duel experience',
          logout: 'Logout',
          accNfin: 'Accept & complete quest',
          onWiki: 'Show the quest on the wiki',
          longerName: 'Name must be longer than 2 characters',
          loading: 'Loading...',
          rename: 'Rename',
          newName: 'Choose a new set name',
          used: 'Used',
          renameWarning: 'When you rename a set, you will wear it and undress it again.<br>You may loose health points during the process!',
          sellItems: 'Sell items to the trader?',
          removeWorkNotis: 'Hide all job notifications',
          compInv: 'Click on "cancel" to just show only auctionable items\n or\nEnter other inventory URL to compare',
          loginAll1: 'Login all worlds',
          loginAll2: 'Load all your active worlds with one click',
          custom1: 'Custom',
          custom2: 'Your custom login list',
          edit: 'Edit',
          CT: {
            ColorWindowTitle: 'Color tchat setting',
            ColorWindowPreviewTxt: '*Click on the letters to change color',
            ColorWindowOkBtn: 'Apply',
            ColorWindowToDefaultBtn: 'Set to default',
            ColorWindowThisTchatBtn: 'Set to this',
            ColorWindowDefaultText: 'Select the tchat for reset to default: ',
            ColorWindowBold: 'Bold',
            ColorWindowCaps: 'Capitalized',
            ColorWindowFlip: 'Flip',
            ColorBtnTitle: '',
            ColorLoadListName: [
              'No color',
              'Enter a color code',
              'red',
              'brown',
              'purple',
              'blue',
              'green',
              'pink',
              'magenta',
              'violet gradient',
              'degraded dark blue',
              'green gradient',
              'degraded red',
              'blue gradient light',
              'degraded pink',
              'light green gradient',
              'degraded pink',
              'red gradient light'
            ],
            ColorLoadTitle: 'Click to load another color code<br>The current color code is: ',
            ColorSaveEmpty: '[empty]',
            CustomReady: 'Valid Code',
            CustomNotReady: 'Invalid Code',
          },
          QIS: {
            adventure: '*Adventures',
            work: '*Work',
            duel: '*Duels',
            energy: '*Energy',
            skill: '*Skill points',
            fk: '*Fort battles',
            speed: '*Speed',
            lp: '*Health points',
            luckNmoney: '*Luck & money',
            workmoti: '*Work motivation',
            duelmoti: '*Duel motivation',
            experience: '*Experience',
            special: '*Premium/special',
            events: '*Events',
            chests: '*Open & unpack',
            equipment: '-Equipment',
            products: '-Products',
            questitems: '-Quest items',
            craftitems: '-Craft items',
            recipes: '-Recipes',
            NAMED: 'NAMED',
            nothingFound: 'No items of this type found!',
          },
          NPC: {
            loading: 'Loading current quest givers',
            title: 'Quest giver locator',
            chooseNpc: 'Select employer',
            yourposition: 'Your position',
            questgiver: 'Quest giver',
            reload: 'Reload all quest givers',
          },
          BS: {
            hero: 'HERO',
            heroT: 'Number of shots (taken & dodged) per 1000 HPs',
            rate: 'Rate',
            hitsTaken: 'Hits taken',
            dodgedShots: 'Dodged shots',
            startHP: 'Start HP',
            survivor: 'SURVIVOR',
            survivorT: 'Survivor with the fewest HPs at the end of the fort battle',
            endHP: 'End HP',
            sniper: 'SNIPER',
            sniperT: 'Number of successful hits (percentage) in relation to all shots fired',
            rateP: 'Rate(%)',
            hitCount: 'Hit count',
            missedShots: 'Missed shots',
            matrix: 'MATRIX',
            matrixT: 'Number of doged shots (percentage) in relation to all shots (taken & dodged)',
            terminator: 'TERMINATOR',
            terminatorT: 'Number of KOs (percentage) in relation to the successful hits',
            KOs: 'KOs',
            ranking: 'Ranking',
            statsTitle: 'Fort battle statistics',
            designation: 'Designation',
            attack: 'Attack',
            defense: 'Defense',
            difference: 'Difference',
            statistics: 'Statistics',
            code: 'Code',
            goBack: 'Go back',
            starsTitle: 'The stars of the battle',
            title: 'Title',
            name: 'Name',
            details: 'Details',
            start: ' HP - Start: ',
            end: ' - End: ',
            damageTaken: ' - Damage taken: ',
            avgHP: ' - HP per fighter: ',
            total: 'Total ',
            average: 'Average ',
            HP: 'HP',
            damage: 'Damage',
            avgDamage: 'Average damage',
            avgDamageMax: 'Average max damage',
            avgWeaponDamage: 'Average weapon damage',
            avgWeaponDamageMax: 'Weapon damage max',
          },
          KoM: {
            success: 'Rank is given!',
            error: 'An error has occured',
            showPlayerOnMap: 'Show player on map',
            showTown: 'Show town overview',
            showAlly: 'Show alliance overview',
            showFort: 'Show fort overview',
            showBattle: 'Show battlefield',
            atFort: 'At the fort',
            nearFort: 'Nearby the fort',
            notFort: 'Not at the fort',
            evaluated: 'Number of evaluated players',
            started: 'The battle is taking place right now',
            remindAlly: 'Remind ally members, who haven\'t participated yet',
            where: 'Where',
            when: 'When',
            att: 'Attackers',
            def: 'Defenders',
            nodata: 'Couldn\'t load rank information for the fort',
            getData: 'Loading rank information',
            errorTimeout: 'The loading took too much time',
            ascaptain: 'Promote to captain',
            assergeant: 'Appoint as sergeant',
            asprivate: 'Appoint as private',
            asrecruit: 'Appoint as recruit',
            asreservist: 'Appoint as reservist',
            astraitor: 'Mark as traitor',
            youcant: 'You can\'t demote fighters of<br>the same or higher rank.',
            position: 'Position',
            pos_undefined: 'No starting position',
            notown: 'No town',
            noally: 'No alliance',
            damage: 'Damage',
            flag: 'Flag',
            inside: 'Inside the fort',
            sectors: {
              undef: 'No starting position',
              0: 'The upper-left sector',
              1: 'The lower-left sector',
              2: 'The central left sector',
              3: 'The lower central sector',
              4: 'The central right sector',
              5: 'The lower-right sector',
              6: 'The upper-right sector',
              7: 'Adventurer\'s tower',
              8: 'Dueller\'s tower',
              9: 'Soldier\'s tower',
              10: 'Worker\'s tower',
              11: 'Barracks',
              12: 'Resource stock',
              13: 'Headquarters',
              14: 'North wall',
              15: 'South wall',
              16: 'West wall',
              17: 'East wall',
              18: 'Gate',
              19: 'Flag',
            },
          },
        },
        de: {
          language: 'German (Deutsch)',
          ApiGui1: 'Das Script beinhaltet verschiedene Funktionen um den Alltag bei The West zu vereinfachen.<br>Weitere Informationen',
          ApiGui2: 'Skriptfenster öffnen',
          Feat: {
            ColorTchat: '%0 Neue Funktionen für den Chat. Farbiger Text, Emojis 🐧🎉 usw.',
            QuickItemsSearch: '%0 Suche nach Buff-Kategorien und Sets in deinem Inventar',
            MarketBestBids: '%0 Färbt die Auktionen dem Preis entsprechend %1 Grün %2 Gebot ist tiefer als der VK (Verkaufspreis) %3 Schwarz %4 Gebot entspricht dem VK %5 Blau %6 Gebot ist zwischen 100% and 200% des VK %7 Rot %8 Gebot ist höher als 200% des VK">',
            BattleStars: '%0 Zusätzliche Statistiken im Fortkampfbericht',
            KickoMatic: '%0 Vereinfacht die Musterung vor einem Fortkampf',
            DuelMap: 'Füge im Duellfenster einen Tab hinzu, der eine Duellkarte zeigt',
            MarkDaily: 'Markiere Täglicher Loginbonus am Tag 5 besonders, um ihn nicht zu übersehen',
            MarketMessage: 'Wenn du an einem Markt stehst, wo etwas abgeholt werden kann, erscheint eine Meldung',
            AchievHide: 'Verstecke alle abgeschlossenen Erfolge im Erfolgsfenster für eine bessere Übersicht',
            RecipeMarket: 'Verbessert den Kauf von Rezepten im Markt',
            MoveJobs: 'Verschiebe eingestellte Arbeiten ein wenig nach links',
            InstantQuest: 'Schliesse die Quest sofort ab, wenn die Voraussetzungen bereits erfüllt sind',
            QuestWiki: 'Füge im Questfenster einen Link hinzu, der die Quest im Wiki zeigt',
            CityTravel: 'Zeige die Reisezeit zu den Städten im Blackboard-Fenster',
            BetterSheriff: 'Erweitere den Sheriff um einen Tab, welcher alle Kopfgelder auflistet',
            ChatProfessions: 'Zeige den Handwerksberuf der Spieler in der Chatliste',
            QuestBookSearch: 'Suche im Questbuch nach abgeschlossenen Quests',
            MarketRights: 'Zeige ob Marktangebote öffenltich oder nur für Allianz-/Stadtmitglieder sind',
            EquipManagerPlus: 'Erweitere den Ausrüstungsmanager im Inventar',
            ShortPopups: 'Mache die Item-Popups kompakter',
            HideNotis: 'Blende Arbeits-Benachrichtigungen am linken Rand mit einem Klick aus',
            JobProducts: 'Zeige bei den Arbeiten, wie viele Produkte du bereits besitzt',
            MapDistance: 'Zeige die Entfernung in Meilen neben der Reisezeit',
            TraderSell: 'Ermöglicht dem Fahrenden Händler mehrere Gegenstände auf einmal zu verkaufen',
            TouchControl: 'Aktiviere Touchsteuerung im mobilen Browser',
            FbRankingChar: 'Zeige die Charakterklasse in der Fortkampf-Weltrangliste',
            DuelXpCalc: 'Zeige die Duellerfahrung in Spielerprofilen',
            Logout: 'Erstellt einen Logout-Button rechts in der Menüleiste',
            Statusbar: 'Entfernt die Fensterleiste mit den verschiedenen Tabs im unteren Teil',
            ChangeCity: 'Tausche Titel und Spielername in der Stadthalle',
            BlinkEvents: 'Das Blinken der Event-, Wanderzirkus-Buttons usw. am linken Rand entfernen',
            FortTracker: 'Fortkampftracker abschalten',
            FriendsPop: '"Freund online" Pop-ups deaktivieren',
          },
          settings1: 'Einstellungen öffnen',
          settings2: 'Öffnet das Informations- und Einstellungsfenster',
          ghosttown2: 'Öffne Geisterstadt',
          ghosttown3: 'Öffnet das Fenster der Geisterstadt und zentriert es auf der Map',
          indiantown2: 'Öffne Indianerdorf',
          indiantown3: 'Öffnet das Fenster des Indianerdorfes und zentriert es auf der Map',
          openmarket: 'Öffne Marktfenster',
          opentrader: 'Öffne den Fahrenden Händler',
          forum: 'Öffne Stadtforum',
          newsets: 'Dem Script wurden neue Sets hinzugefügt',
          chooseItems: 'Wähle die Gegenstände aus',
          remindHover: 'Wenn die Gegenstände bereit zum Einsammeln sind, bekommst du einen Hinweis. Hier kannst du diese Items auswählen.',
          remindReady: 'Bereit zum Einsammeln',
          skipHover: 'Überspringe die Bestätigungs- und Resultatsmeldung beim Öffnen bestimmter Taschen. Hier kannst du diese Taschen auswählen.',
          skipDone: 'Du bekommst',
          info: 'Info',
          contact: 'Kontakt',
          chooseLang: 'Sprache auswählen',
          features: 'Features',
          name: 'Name',
          save: 'Speichern',
          saveMessage: 'Speichern erfolgreich',
          saveMessage2: 'Einstellungen gespeichert. Manche Änderungen werden erst nach Neuladen des Spiels sichtbar.',
          setbonus2: 'Lass dir die Boni aller Sets anzeigen',
          bonussearch2: 'Finde Items mit bestimmten Boni',
          frame2: 'Hilfreiche Webseiten',
          npclocator2: 'Finde die Questgeber auf der Karte',
          choose: 'Klicke auf den Hut und wähle aus',
          items: 'Gegenstände',
          parts: 'Teile',
          showItems: 'Zeige die Setgegenstände in deinem Inventar',
          noItems: 'Keine Gegenstände im Inventar gefunden. Klicke erneut mit CTRL um sie auf TW-Calc anzuzeigen.',
          ownSets: 'Nur eigene Sets',
          switchWeapon: 'Wähle Schuss- oder Schlagwaffe',
          selectBonus: 'Boni auswählen',
          resetB: 'Zurücksetzen',
          body: 'Kleidung',
          right_arm: 'Waffen',
          animal: 'Pferd & Produkt',
          rest: 'Andere',
          buff: 'Buffs',
          refresh: 'Aktualisieren',
          noFriends: 'Keine Freunde',
          reward: 'Belohnung',
          allprofessions: 'Alle Berufe',
          market1: 'Gegenstände auf dem Markt',
          market2: 'Es sind noch Gegenstände/Geld auf diesem Markt. Was soll abgeholt werden?',
          all: 'Alles',
          onlyBids: 'Nur Gebote',
          nothing: 'Nichts',
          worldwide: 'Weltweit',
          alliance: 'Allianz',
          town: 'Stadt',
          level: 'Stufe',
          duelLevel: 'Duellstufe',
          exp: 'XP',
          distance: 'Distanz',
          startduel: 'Starte Duell',
          centerMap: 'Zentriere Map',
          popup: 'Fertigkeitenbonus des Gegners',
          damage: 'Schaden',
          duelmap: 'Duellkarte',
          duelradius: 'Duellradius',
          minutes: 'Minuten',
          hour: '1 Stunde',
          hours: 'Stunden',
          searchOpp: 'Duellgegner suchen',
          amount: 'Tot',
          not_dead_amount: 'Lebendig',
          duellevel: 'Lvl',
          pStatus: 'Status',
          sortBy: 'Sortiere nach',
          tooLow: 'Zu tiefe Duellstufe des Gegners',
          tooHigh: 'Zu hohe Duellstufe des Gegners',
          ownTown: 'Mitbürger deiner Stadt',
          attackable: 'Zeige nur duellierbare Spieler',
          youKO: 'Du hast Duellschutz',
          attDl: 'Angreifbare Duellstufen',
          duelxp: 'Aktuelle Duellerfahrung',
          logout: 'Logout',
          accNfin: 'Quest annehmen & abschließen',
          onWiki: 'Zeige die Quest im Wiki',
          longerName: 'Name muss länger als 2 Zeichen sein',
          loading: 'Lädt...',
          rename: 'Umbenennen',
          newName: 'Neuer Set-Name',
          used: 'Benutzt',
          renameWarning: 'Du ziehst das Set beim Umbenennen an und wieder aus.<br>Möglicherweise verlierst du deswegen Lebenspunkte!',
          sellItems: 'Items dem Händler verkaufen?',
          removeWorkNotis: 'Entferne die Arbeits-Benachrichtigungen',
          compInv: 'Klicke auf "Abbrechen, um nur auktionierbare Items anzuzeigen\n oder\nFüge andere Inventar-URL ein, um zu vergleichen',
          loginAll1: 'Alle einloggen',
          loginAll2: 'Lade all deine aktiven Welten mit einem Klick',
          custom1: 'Eigene',
          custom2: 'Deine eigene Login-Liste',
          edit: 'Bearbeiten',
          CT: {
            ColorWindowTitle: 'Color tchat Einstellung',
            ColorWindowPreviewTxt: '*Klicke auf diese Buchstaben um die aktuell im oberen Feld gewählte Farbe reinzumischen',
            ColorWindowOkBtn: 'Übernehmen',
            ColorWindowToDefaultBtn: 'Zurücksetzen',
            ColorWindowThisTchatBtn: 'Einstellung speichern',
            ColorWindowDefaultText: 'Chaträume auf Standard setzen:',
            ColorWindowBold: 'Fett',
            ColorWindowCaps: 'CAPS LOCK',
            ColorWindowFlip: 'Flip',
            ColorBtnTitle: '',
            ColorLoadListName: [
              'Keine Farbe',
              'Eigener Farbcode',
              'rot',
              'braun',
              'violett',
              'blau',
              'grün',
              'pink',
              'magenta',
              'violett wechselnd',
              'blau wechselnd',
              'grün wechselnd',
              'rot wechselnd',
              'hellblau wechselnd',
              'pink wechselnd',
              'hellgrün wechselnd',
              'pink wechselnd',
              'hellrot wechselnd'
            ],
            ColorLoadTitle: 'Klicke um weitere Farben auszuwählen<br>Aktueller Farbcode: ',
            ColorSaveEmpty: '[leer]',
            CustomReady: 'Code ok',
            CustomNotReady: 'Ungültig',
          },
          QIS: {
            adventure: '*Abenteuer',
            work: '*Arbeit (AP)',
            duel: '*Duell',
            energy: '*Erholung (EP)',
            skill: '*Fertigkeiten (FP)',
            fk: '*Fortkampf (FK)',
            speed: '*Geschwindigkeit',
            lp: '*Lebenspunkte (LP)',
            luckNmoney: '*Glück & Geld',
            workmoti: '*Arbeitsmotivation',
            duelmoti: '*Duellmotivation',
            experience: '*Erfahrung (XP)',
            special: '*Premium/Special',
            events: '*Events',
            chests: '*Öffnen & Auspacken',
            equipment: '-Ausrüstung',
            products: '-Arbeitsprodukte',
            questitems: '-Questprodukte',
            craftitems: '-Handwerk',
            recipes: '-Rezepte',
            NAMED: 'NAMED',
            nothingFound: 'Keine Gegenstände dieser Art gefunden!',
          },
          NPC: {
            loading: 'Aktuelle Questgeber werden geladen',
            title: 'Questgebersuche',
            chooseNpc: 'Wähle den Questgeber',
            yourposition: 'Eigene Position',
            questgiver: 'Questgeber',
            reload: 'Questgeber neu laden',
          },
          BS: {
            hero: 'HERO',
            heroT: 'Anzahl Schüsse (eingesteckt & ausgewichen) pro 1000 LPs',
            rate: 'Quote',
            hitsTaken: 'Eingesteckte Treffer',
            dodgedShots: 'Schüssen ausgewichen',
            startHP: 'Anfangs-LP',
            survivor: 'SURVIVOR',
            survivorT: 'Überlebender mit den wenigsten LPs am Ende des Fortkampfes',
            endHP: 'LPs am Ende',
            sniper: 'SNIPER',
            sniperT: 'Anzahl erfolgreicher Treffer (in Prozent) im Verhältnis zu allen abgegebenen Schüssen',
            rateP: 'Quote(%)',
            hitCount: 'Trefferanzahl',
            missedShots: 'Fehlschüsse',
            matrix: 'MATRIX',
            matrixT: 'Anzahl Ausweicher (in Prozent) im Verhältnis zu allen Schüssen (eingesteckt & ausgewichen)',
            terminator: 'TERMINATOR',
            terminatorT: 'Anzahl erzielter KOs (in Prozent) im Verhältnis zu den erfolgreichen Treffern',
            KOs: 'KOs',
            ranking: 'Rangliste',
            statsTitle: 'Fortkampfstatistik',
            designation: 'Bezeichnung',
            attack: 'Angriff',
            defense: 'Verteidigung',
            difference: 'Differenz',
            statistics: 'Statistik',
            code: 'Code',
            goBack: 'Zurück',
            starsTitle: 'Die Stars des Kampfes',
            title: 'Titel',
            name: 'Name',
            details: 'Details',
            start: ' LP - Start: ',
            end: ' - Ende: ',
            damageTaken: ' - Unterschied: ',
            avgHP: ' - LP pro Mann: ',
            total: 'Total ',
            average: 'Durchschn. ',
            HP: 'LP',
            damage: 'Schaden',
            avgDamage: 'Durchschn. Schaden',
            avgDamageMax: 'Max Schaden',
            avgWeaponDamage: 'Durchschn Waffenschaden',
            avgWeaponDamageMax: 'Max Schaden der Waffe',
          },
          KoM: {
            success: 'Musterung erfolgreich!',
            error: 'Ein Fehler ist aufgetreten',
            showPlayerOnMap: 'Spieler auf Karte zeigen',
            showTown: 'Stadtübersicht anzeigen',
            showAlly: 'Bündnisübersicht anzeigen',
            showFort: 'Fortübersicht anzeigen',
            showBattle: 'Schlachtfeld öffnen',
            atFort: 'Am Fort',
            nearFort: 'In der Nähe des Forts',
            notFort: 'Nicht am Fort',
            evaluated: 'Anzahl gemusterte Spieler',
            started: 'Die Schlacht ist in vollem Gange',
            remindAlly: 'Informiere Allianzmitglieder, die noch nicht angemeldet sind',
            where: 'Wo',
            when: 'Wann',
            att: 'Angreifer',
            def: 'Verteidiger',
            nodata: 'Rang-Informationen für das Fort konnten nicht geladen werden',
            getData: 'Rang-Informationen werden geladen',
            errorTimeout: 'Zeitüberschreitung',
            ascaptain: 'Zum Captain befördern',
            assergeant: 'Zum Sergeant ernennen',
            asprivate: 'Zum Private ernennen',
            asrecruit: 'Zum Rekruten ernennen',
            asreservist: 'Zum Reservisten ernennen',
            astraitor: 'Als Verräter markieren',
            youcant: 'Du kannst Kämpfer von gleichem oder<br>höherem Rang nicht degradieren.',
            position: 'Position',
            pos_undefined: 'Keine Startposition',
            notown: 'Stadtlos',
            noally: 'Ohne Bündnis',
            damage: 'Schaden',
            flag: 'Flagge',
            inside: 'Innerhalb des Forts',
            sectors: {
              undef: 'Keine Startposition',
              0: 'Sektor oben-links',
              1: 'Sektor unten-links',
              2: 'Sektor mitte-links',
              3: 'Sektor unten-mitte',
              4: 'Sektor mitte-rechts',
              5: 'Sektor unten-rechts',
              6: 'Sektor oben-rechts',
              7: 'Abenteurerturm',
              8: 'Duellantentrum',
              9: 'Soldatenturm',
              10: 'Arbeiterturm',
              11: 'Kaserne',
              12: 'Rohstofflager',
              13: 'Hauptgebäude',
              14: 'Nordwall',
              15: 'Südwall',
              16: 'Westwall',
              17: 'Ostwall',
              18: 'Tor',
              19: 'Flagge',
            },
          },
        },
        pl: {
          language: 'Polish (polski)',
          ApiGui1: 'Skrypt ten zawiera wiele funkcji, aby uprościć codzienne życie na Zachodzie.<br>Więcej informacji',
          ApiGui2: 'Otwórz w nowej karcie',
          Feat: {
            ColorTchat: '%0 Adds new features to the chat. Colored text, Emojis 🐧🎉 etc.',
            QuickItemsSearch: '%0 Search for buff categories and sets in your inventory',
            MarketBestBids: '%0 Colors the auctions based on the price %1 Green %2 Bid is lower than the purchase price %3 Black %4 Bid is equal to the purchase price %5 Blue %6 Bid is between 100% and 200% of the purchase price %7 Red %8 Bid is more than 200%">',
            BattleStars: '%0 Additional stats in the fort battle report',
            KickoMatic: '%0 Helpful to rank players before a fort battle',
            DuelMap: 'Dodaje dodatkową zakładkę pojedynków, w pojedynkach.',
            MarkDaily: 'Oznacza dodatkową ramką 5 dzień logowania.',
            MarketMessage: 'Jeżeli znajdujesz się w mieście gdzie coś jest do odebrania. Pojawia się komunikat.',
            AchievHide: 'Ukrywa zaliczone osiągnięcia.',
            RecipeMarket: 'Dodaje dodatkowe przyciski z receptami w karcie targ.',
            MoveJobs: 'Przenieś zadania w kolejce trochę na lewo',
            InstantQuest: 'Wykonaj zadanie natychmiast, gdyby wszystkie wymagania zostały wykonane',
            QuestWiki: 'Add a link in the quest window to show the quest on the wiki page',
            CityTravel: 'Show the travel time to the towns in the blackboard',
            BetterSheriff: 'Add a new tab in the sheriff window to see all possible bounties',
            ChatProfessions: 'Show the crafting profession of the players in the chat list',
            QuestBookSearch: 'Search for solved quests in the quest book',
            MarketRights: 'Show if market offers are public or only for alliance/town members',
            EquipManagerPlus: 'Improve the equipment manager in the inventory',
            ShortPopups: 'Make the item pop-ups shorter',
            HideNotis: 'Add a button to hide the job notifications on the left side',
            JobProducts: 'Show in the job pop-up how many products you already have in your inventory',
            MapDistance: ' Show the number of miles next to the travel time',
            TraderSell: 'Sell multiple items at once to the trader',
            TouchControl: 'Enable touch control for map and scrollbar on your mobile',
            FbRankingChar: 'Show the character class in the fortbattle world ranking',
            DuelXpCalc: 'Show the duel experience in player profiles',
            Logout: 'Dodanie przycisku po prawej stronie, wyloguj się.',
            Statusbar: 'Usuwa pasek z oknami w dolnej części gry.',
            ChangeCity: 'Zamienia tytuł gracza na początku, w karcie graczy w ratuszu.',
            BlinkEvents: 'Zatrzymaj pulsowanie przycisków (zdarzenie, pomoce, ostrzeżenia itp) po lewej stronie',
            FortTracker: 'Wyłącz przypomnienie o bitwie',
            FriendsPop: 'Ukryj "Przyjaciel on-line" pop-ups',
          },
          settings1: 'Otwórz ustawienia',
          settings2: 'Otwiera okno ustawień oraz informacji o skrypcie.',
          ghosttown2: 'Otwórz zadania w Mieście Widmo',
          ghosttown3: 'Otwiera okno z zadaniami w Mieście Widmo',
          indiantown2: 'Otwórz zadania w Wiosce Indiańskiej',
          indiantown3: 'Otwiera okno z zadaniami w Wiosce Indiańskiej.',
          openmarket: 'Otwórz targ',
          opentrader: 'Otwórz handlarza',
          forum: 'Otwórz forum',
          newsets: 'Nowe zestawy są dodawane do skryptu',
          chooseItems: 'Choose the items',
          remindHover: 'You get a notification when an item can be used again. Here you can choose these items.',
          remindReady: 'Ready to collect',
          skipHover: 'Skip the confirmation and result messages when you open some bags. Here you can choose these bags',
          skipDone: 'You get',
          info: 'Informacja',
          contact: 'Kontakt',
          chooseLang: 'Wybierz język',
          features: 'Ustawienia',
          name: 'Nazwa',
          save: 'Zapisz',
          saveMessage: 'Saved successfully',
          saveMessage2: 'Ustawienia zapisane. Niektóre zmiany potrzebują odświeżenia okna gry.',
          setbonus2: 'Informacje o ustawionych premie',
          bonussearch2: 'Find items by bonus',
          frame2: 'Pomocna stron internetowych',
          npclocator2: 'Find quest givers on the map',
          choose: 'Kliknij na kapelusz i wybierz',
          items: 'przedmioty',
          parts: 'parts',
          showItems: 'Show the set items in your Bag',
          noItems: 'No items in your inventory found. Click again with CTRL to show it on TW-Calc.',
          ownSets: 'Only own sets',
          switchWeapon: 'Switch between firearm and melee weapon',
          selectBonus: 'Select bonuses',
          resetB: 'Reset',
          body: 'Clothing',
          right_arm: 'Weapons',
          animal: 'Horse & Yield',
          rest: 'Other',
          buff: 'Buffs',
          refresh: 'Odświeżać',
          noFriends: 'Brak przyjaciół',
          reward: 'Nagroda',
          allprofessions: 'Wszystko',
          market1: 'Przedmioty na targu',
          market2: 'Na tym targu znajdują się przedmioty/kasa, odebrać?',
          all: 'Wszystko',
          onlyBids: 'Tylko oferty',
          nothing: 'Nic',
          worldwide: 'Worldwide',
          alliance: 'Alliance',
          town: 'Miasto',
          level: 'Poziom',
          duelLevel: 'Poziom pojedynków',
          exp: 'Exp',
          distance: 'Odległość',
          startduel: 'Akcja',
          centerMap: 'Wyśrodkowanie',
          popup: 'Bonusy umiejętności przeciwnika',
          damage: 'Obrażenia',
          duelmap: 'Mapa pojedynków',
          duelradius: 'Zasięg',
          minutes: 'Minut',
          hour: '1 Godzina',
          hours: 'Godzin',
          searchOpp: 'Szukaj przeciwników',
          amount: 'Dead',
          not_dead_amount: 'Alive',
          duellevel: 'Lvl',
          pStatus: 'Status',
          sortBy: 'Sort by',
          tooLow: 'Too low duelling level of opponent',
          tooHigh: 'Too high duelling level of opponent',
          ownTown: 'Member of your town',
          attackable: 'Show only attackable players',
          youKO: 'You have duel protection',
          attDl: 'Attackable duelling levels',
          duelxp: 'Current duel experience',
          logout: 'Logout',
          accNfin: 'Przyjmij & zakończ zadanie',
          onWiki: 'Show the quest on the wiki',
          longerName: 'Name must be longer than 2 characters',
          loading: 'Loading...',
          rename: 'Rename',
          newName: 'Choose a new set name',
          used: 'Used',
          renameWarning: 'When you rename a set, you will wear it and undress it again.<br>You may loose health points during the process!',
          sellItems: 'Sell items to the trader?',
          removeWorkNotis: 'Hide all job notifications',
          compInv: 'Click on "cancel" to just show only auctionable items\n or\nEnter other inventory URL to compare',
          loginAll1: 'Login all worlds',
          loginAll2: 'Załaduj wszystkie aktywne światów za pomocą jednego kliknięcia',
          custom1: 'Custom',
          custom2: 'Your custom login list',
          edit: 'Edit',
          CT: {
            ColorWindowTitle: 'Ustawienia Koloru Tchat',
            ColorWindowPreviewTxt: '*Kliknij na literę, aby zmienić kolor',
            ColorWindowOkBtn: 'Zastosuj',
            ColorWindowToDefaultBtn: 'Ustaw na domyślny',
            ColorWindowThisTchatBtn: 'Ustaw na ten',
            ColorWindowDefaultText: 'Wybierz tchat, który ma być domyślny: ',
            ColorWindowBold: 'Grubość',
            ColorWindowCaps: 'Wielkie litery',
            ColorWindowFlip: 'Flip',
            ColorBtnTitle: '',
            ColorLoadListName: [
              'Bez koloru',
              'Wprowadź kod koloru',
              'Czerwony',
              'Brązowy',
              'Fioletowy',
              'Niebieski',
              'Zielony',
              'Różowy',
              'Purpurowy',
              'Fioletowo gradientowy',
              'Zwietrzały ciemny niebieski',
              'Zielony gradient',
              'Zwietrzały czerwony',
              'Jasnoniebieski gradient',
              'Zwietrzały ciemny różowy',
              'Jasnozielony gradient',
              'Zwietrzały różowy',
              'Jasnoczerwony gradient'
            ],
            ColorLoadTitle: 'Kliknij tutaj, aby załadować inny kod koloru<br>Twój obecny kod koloru jest: ',
            ColorSaveEmpty: '[pusty]',
            CustomReady: 'Prawidłowy Kod',
            CustomNotReady: 'Zły Kod',
          },
          QIS: {
            adventure: '*Przygody',
            work: '*Prace',
            duel: '*Pojedynki',
            energy: '*Energia',
            skill: '*Umiejętności',
            fk: '*Bitwy fortowe',
            speed: '*Prędkość',
            lp: '*HP',
            luckNmoney: '*Luck & money',
            workmoti: '*Motywacja pracy',
            duelmoti: '*Motywacja pojedynków',
            experience: '*Experience',
            special: '*Premia/specjalny',
            events: '*Eventy',
            chests: '*Przedmioty - Skrzynie',
            equipment: '-Ekwipunek',
            products: '-Produkty',
            questitems: '-Przedmiot zlecenia',
            craftitems: '-Rzemiosło',
            recipes: '-Przepisy',
            NAMED: 'NAMED',
            nothingFound: 'Nie posiadasz żadnych przedmiotów tego typu!',
          },
          NPC: {
            loading: 'Loading current quest givers',
            title: 'Gdzie jest zleceniodawca?',
            chooseNpc: 'Wybierz zleceniodawcę',
            yourposition: 'Twoja pozycja',
            questgiver: 'Zleceniodawca',
            reload: 'Reload all quest givers',
          },
          BS: {
            hero: 'HERO',
            heroT: 'Liczba strzałów (przyjętych i unikniętych) na 1000HP',
            rate: 'Średnia',
            hitsTaken: 'Otrzymane ciosy',
            dodgedShots: 'Zadane ciosy',
            startHP: 'Start HP',
            survivor: 'SURVIVOR',
            survivorT: 'Osoba z największą ilością HP pod koniec bitwy',
            endHP: 'Końcowe HP',
            sniper: 'SNIPER',
            sniperT: 'Liczba celnych trafień (w procentach) w porównaniu do wszystkich',
            rateP: 'Średnia(%)',
            hitCount: 'Trafione strzały',
            missedShots: 'Chybione strzały',
            matrix: 'MATRIX',
            matrixT: 'Liczba uników (w procentach) w porównaniu do wszystkich otrzymanych strzałów',
            terminator: 'TERMINATOR',
            terminatorT: 'Liczba omdleń (w procentach) w porównaniu do trafionych strzałów',
            KOs: 'KOs',
            ranking: 'Ranking',
            statsTitle: 'Statystyki bitwy',
            designation: 'Nazwa',
            attack: 'Atak',
            defense: 'Obrona',
            difference: 'Różnica',
            statistics: 'Statystyki',
            code: 'Kod',
            goBack: 'Wróć',
            starsTitle: 'Gwiazdy podczas bitwy',
            title: 'Tytuł',
            name: 'Nick',
            details: 'Sczegóły',
            start: ' HP - Start: ',
            end: ' - Końcowe: ',
            damageTaken: ' - Obrażenia zadane: ',
            avgHP: ' - Średnie zadane obrażenia: ',
            total: 'Całkowity ',
            average: 'Średni ',
            HP: 'HP',
            damage: 'Obrażenia',
            avgDamage: 'Średnie obrażenia',
            avgDamageMax: 'Największe obrażenia',
            avgWeaponDamage: 'Średnia obrażeń broni',
            avgWeaponDamageMax: 'Największe obrażenia broni',
          },
          KoM: {
            success: 'Ranga została zmieniona!',
            error: 'Wystąpił błąd',
            showPlayerOnMap: 'Pokaż gracza na mapie',
            showTown: 'Pokaż podgląd profilu',
            showAlly: 'Pokaż podgląd sojuszu',
            showFort: 'Pokaż podgląd fortu',
            showBattle: 'Pokaż bitwy',
            atFort: 'W forcie',
            nearFort: 'W pobliżu fortu',
            notFort: 'Nie w forcie',
            evaluated: 'Ocena gracza',
            started: 'Bitwa właśnie się odbywa',
            remindAlly: 'Przypomnij członków sojuszu, którzy nie dotychczas ze',
            where: 'Gdzie',
            when: 'Gdy',
            att: 'Napastnicy',
            def: 'Obrońcy',
            nodata: 'Nie można załadować danych fortu',
            getData: 'Pobieranie danych o rangach',
            errorTimeout: 'Zbyt długie ładowanie danych',
            ascaptain: 'Awans na kapitana',
            assergeant: 'Mianowanie na sierżanta',
            asprivate: 'Mianowanie na szeregowca',
            asrecruit: 'Mianowanie na rekruta',
            asreservist: 'Mianowanie na rezerwistę',
            astraitor: 'Oznacz jako zdrajcę',
            youcant: 'Nie można zmienić ragi, posiadasz<br>niższą lub taką samą rangę.',
            position: 'Pozycja',
            pos_undefined: 'Źle ustawiony',
            notown: 'No town',
            noally: 'Bez sojuszu',
            damage: 'Obrażenia',
            flag: 'Flaga',
            inside: 'W forcie',
            sectors: {
              undef: 'Źle ustawiony',
              0: 'Lewy górny - 7',
              1: 'Lewy dolny - 6',
              2: 'Dolny lewy - 5',
              3: 'Dolny środkowy - 4',
              4: 'Dolny Prawy - 3',
              5: 'Prawy dolny - 2',
              6: 'Prawy górny - 1',
              7: 'Baszta poszukiwaczy',
              8: 'Baszta zawadiaków',
              9: 'Baszta żołnierzy',
              10: 'Baszta budowniczych',
              11: 'Koszary',
              12: 'Magazyn',
              13: 'Budynek główny',
              14: 'Górny mur',
              15: 'Dolny mur',
              16: 'Lewy mur',
              17: 'Prawy mur',
              18: 'Brama',
              19: 'Flaga',
            },
          },
        },
        es: {
          language: 'Spanish (español)',
          ApiGui1: 'El script incluye varias funciones que simplifican la vida cotidiana en The West.<br>Más información',
          ApiGui2: 'Abrir ventana del script',
          Feat: {
            ColorTchat: '%0 Adds new features to the chat. Colored text, Emojis 🐧🎉 etc.',
            QuickItemsSearch: '%0 Search for buff categories and sets in your inventory',
            MarketBestBids: '%0 Colors the auctions based on the price %1 Green %2 Bid is lower than the purchase price %3 Black %4 Bid is equal to the purchase price %5 Blue %6 Bid is between 100% and 200% of the purchase price %7 Red %8 Bid is more than 200%">',
            BattleStars: '%0 Additional stats in the fort battle report',
            KickoMatic: '%0 Helpful to rank players before a fort battle',
            DuelMap: 'Completar la ventana de duelos con una pestaña que muestra el mapa de duelos',
            MarkDaily: 'Marcar el Bonus-Conexión-5 Días especialmente para que no te lo pierdas',
            MarketMessage: 'Si llegas a un mercado donde tienes algo que puede ser recogido, aparece un mensaj',
            AchievHide: 'Ocultar logros completados en la ventana de logros para una mejor visión',
            RecipeMarket: 'Mejorar la compra de recetas en el mercado',
            MoveJobs: 'Mover los trabajos en cola un poco a la izquierda',
            InstantQuest: 'Completar la misión al instante si se cumplen todos los requisitos',
            QuestWiki: 'Agregar un enlace en la ventana de búsqueda para mostrar la búsqueda en la Wiki',
            CityTravel: 'Mostrar el tiempo de viaje a las ciudades en la pizarra',
            BetterSheriff: 'Añadir una nueva pestaña en la ventana del sheriff para ver todas las recompensas posibles',
            ChatProfessions: 'Mostrar el oficio de los jugadores en la lista del chat',
            QuestBookSearch: 'Buscar misiones terminadas en libro de misiones',
            MarketRights: 'Mostrar si las ofertas de mercado son públicas o solo para los miembros de la Alianza/Ciudad',
            EquipManagerPlus: 'Mejorar el administrador de equipos en el inventario',
            ShortPopups: 'Hacer los pop-ups de articulos más cortos',
            HideNotis: 'Agregar un botón para ocultar las notificaciones de trabajo en el lado izquierdo',
            JobProducts: 'Mostrar en la ventana emergente de trabajo cuántos productos tienes en tu inventario',
            MapDistance: 'Mostrar la cantidad de millas al lado del tiempo de viaje',
            TraderSell: 'Vender varios artículos a la vez al comerciante',
            TouchControl: 'Habilitar el control táctil para el mapa y la barra de desplazamiento en su dispositivo móvil',
            FbRankingChar: 'Show the character class in the fortbattle world ranking',
            DuelXpCalc: 'Show the duel experience in player profiles',
            Logout: 'Crea un botón de cierre de sesión a la derecha en la barra de menús',
            Statusbar: 'Oculta la barra inferior de las ventanas',
            ChangeCity: 'Cambiar título y nombre del jugador en el ayuntamiento',
            BlinkEvents: 'Detener el parpadeo de los botones de Evento y Feria de Condado en el lado izquierdo',
            FortTracker: 'Apagar el recordatorio de Batalla de fuerte',
            FriendsPop: 'Esconder ventana emergente de "Amigo conectado"',
          },
          settings1: 'Abrir preferencias',
          settings2: 'Abrir la ventana de información y ajustes',
          ghosttown2: 'Abrir Ciudad Fantasma',
          ghosttown3: 'Abrir la ventana de la Ciudad Fantasma y centrarla en el mapa',
          indiantown2: 'Abrir Pueblo Indio Waupee',
          indiantown3: 'Abrir la ventana del Pueblo Indio Waupee y centrarla en el mapa',
          openmarket: 'Abrir Mercado',
          opentrader: 'Abrir Comerciante Ambulante',
          forum: 'Abrir el foro de la ciudad',
          newsets: 'Nuevos conjuntos añadidos al script',
          chooseItems: 'Elegir los artículos',
          remindHover: 'Recibir una notificación cuando un artículo puede volverse a usar. Aquí puedes elegir estos artículos.',
          remindReady: 'Listo para recoger',
          skipHover: 'Omitir los mensajes de confirmación y resultado cuando abres algunas bolsas. Aquí puedes elegir estas bolsas',
          skipDone: 'Obtienes',
          info: 'Información',
          contact: 'Contacto',
          chooseLang: 'Elige idioma',
          features: 'Funciones',
          name: 'Nombre',
          save: 'Guardar',
          saveMessage: 'Grabado con éxito',
          saveMessage2: 'Ajustes guardados. Algunos cambios necesitan una actualización de la ventana de juego.',
          setbonus2: 'Información acerca de los bonus de conjunto',
          bonussearch2: 'Find items by bonus',
          frame2: 'Páginas web votos',
          npclocator2: 'Find quest givers on the map',
          choose: 'Haga clic en el sombrero y elegir',
          items: 'artículos',
          parts: 'partes',
          showItems: 'Mostrar los artículos del conjunto en tu bolsa',
          noItems: '¡No se han encontrado artículos de este conjunto!',
          ownSets: 'Solo conjuntos propios',
          switchWeapon: 'Cambiar entre arma de fuego y arma contundente',
          selectBonus: 'Seleccionas bonus',
          resetB: 'Reiniciar',
          body: 'Ropa',
          right_arm: 'Armas',
          animal: 'Montura y Producto',
          rest: 'Otros',
          refresh: 'Actualizar',
          noFriends: 'Sin Amigos',
          reward: 'Recompensa',
          allprofessions: 'Todos Oficios',
          market1: 'Productos en el Mercado',
          market2: 'Todavía hay productos/dinero en el Mercado. ¿Desea recogerlos?',
          all: 'Todos',
          onlyBids: 'Solo Ofertas',
          nothing: 'Ninguno',
          worldwide: 'Mundo',
          alliance: 'Alianza',
          town: 'Ciudad',
          level: 'Nivel',
          duelLevel: 'Nivel Duelo',
          exp: 'Exp',
          distance: 'Distancia',
          startduel: 'Iniciar Duelo',
          centerMap: 'Centrar Mapa',
          popup: 'El bonus de habilidad del oponente',
          damage: 'Daño',
          duelmap: 'Mapa Duelos',
          duelradius: 'Radio duelos',
          minutes: 'Minutos',
          hour: '1 Hora',
          hours: 'Horas',
          searchOpp: 'Buscar Duelo',
          amount: 'Muerto',
          not_dead_amount: 'Vivo',
          duellevel: 'Niv',
          pStatus: 'Estado',
          sortBy: 'Ordenar por',
          tooLow: 'Nivel de duelo del oponente demasiado bajo',
          tooHigh: 'Nivel de duelo del oponente demasiado alto',
          ownTown: 'Miembro de tu ciudad',
          attackable: 'Mostrar solo jugadores atacables',
          youKO: 'You have duel protection',
          attDl: 'Attackable duelling levels',
          duelxp: 'Current duel experience',
          logout: 'Cerrar sesión',
          accNfin: 'Aceptar & concluir búsqueda',
          onWiki: 'Mostrar la búsqueda en la Wiki',
          longerName: 'El nombre debe tener más de 2 caracteres',
          loading: 'Cargando...',
          rename: 'Renombrar',
          newName: 'Elige un nuevo nombre de conjunto',
          used: 'Usado',
          renameWarning: 'Cuando renombre un conjunto, se lo pondrá y se lo quitará de nuevo.<br>¡Puede perder puntos de vida durante el proceso!',
          sellItems: '¿Vender artículos al comerciante?',
          removeWorkNotis: 'Ocultar todas las notificaciones de trabajo',
          compInv: 'Haga clic en "cancelar" para mostrar solo los artículos subastables \n o \n Ingrese otra URL de inventario para comparar',
          loginAll1: 'Conectarse a todos los mundos',
          loginAll2: 'Cargar todos los mundos activos con un solo click',
          custom1: 'Personalizar',
          custom2: 'Tu lista de conexión personalizada',
          edit: 'Editar',
          CT: {
            ColorWindowTitle: 'Configurar Color tchat',
            ColorWindowPreviewTxt: '*Haga clic en la carta de un cambio de color',
            ColorWindowOkBtn: 'Aplicar',
            ColorWindowToDefaultBtn: 'Color por defecto',
            ColorWindowThisTchatBtn: 'Elegir este color',
            ColorWindowDefaultText: 'Seleccione la tchat para restablecer a los valores predeterminados',
            ColorWindowBold: 'En negrita',
            ColorWindowCaps: 'Capitalizado',
            ColorWindowFlip: 'Flip',
            ColorBtnTitle: '',
            ColorLoadListName: [
              'No hay color',
              'Introduzca un código de color',
              'rojo',
              'marrón',
              'morado',
              'azul',
              'verde',
              'rosa',
              'magenta',
              'gradiente violeta',
              'degradado rosa',
              'degradado azul marino',
              'gradient',
              'rojo degradado',
              'luz azul degradado',
              'gradiente de luz verde',
              'rosa degradado',
              'luz pendiente roja'
            ],
            ColorLoadTitle: 'Haga clic para cargar otro código de colores<br>El código de color actual es: ',
            ColorSaveEmpty: '[vacío]',
            CustomReady: 'Código válido',
            CustomNotReady: 'No válido',
          },
          QIS: {
            adventure: '*Buffs de Aventuras',
            work: '*Buffs de Trabajo',
            duel: '*Buffs de Duelo',
            energy: '*Buffs Energía',
            skill: '*Buffs de Habilidades',
            fk: '*Buffs de Batalla',
            speed: '*Buffs de Velocidad',
            lp: '*Buffs de Salud',
            luckNmoney: '*Suerte y Dinero',
            workmoti: '*Motivación trabajo ',
            duelmoti: '*Motivación duelo',
            experience: '*Experiencia',
            special: '*Premio/especial',
            events: '*Eventos',
            chests: '*Cajas y cofres',
            equipment: '-Equipo',
            products: '-Productos',
            questitems: '-Objetos de búsqueda',
            craftitems: '-Artesano',
            recipes: '-Recetas',
            NAMED: 'NAMED',
            nothingFound: 'No tienes de este tipo!',
          },
          NPC: {
            loading: 'Loading current quest givers',
            title: 'Dador de búsqueda',
            chooseNpc: 'Seleccionar empleador',
            yourposition: 'Tu posición',
            questgiver: 'Dador de búsqueda',
            reload: 'Reload all quest givers',
          },
          BS: {
            hero: 'HÉROE',
            heroT: 'Tasa de tiros absorbidos (recibidos + eludidos) sobre los PV inicial',
            rate: 'Tasa',
            hitsTaken: 'Nº Aciertos recibidos',
            dodgedShots: 'Nº Eludidos',
            startHP: 'Vida Inicial',
            survivor: 'SUPERVIVIENTE',
            survivorT: 'El que termina con menos puntos de vida final',
            endHP: 'Vida Final',
            sniper: 'FRANCOTIRADOR',
            sniperT: 'Porcentaje de aciertos realizados sobre el total de tiros realizados (aciertos + fallos)',
            rateP: 'Tasa(%)',
            hitCount: 'Nº Aciertos',
            missedShots: 'Nº Fallos',
            matrix: 'MATRIX',
            matrixT: 'Porcentaje de tiros eludidos sobre el total de tiros recibidos',
            terminator: 'TERMINATOR',
            terminatorT: 'Porcentaje de Kos conseguidos sobre aciertos realizados',
            KOs: 'Kos efectuados',
            ranking: 'Classement',
            statsTitle: 'Estadísticas de la Batalla',
            designation: 'Estadística',
            attack: 'Ataque',
            defense: 'Defensa',
            difference: 'Diferencia',
            statistics: 'Estadística',
            code: 'Formato Foro',
            goBack: 'Volver',
            starsTitle: 'Las Estrellas de la Batalla',
            title: 'Titre',
            name: 'Nombre',
            details: 'Detalles',
            start: ' PV - Inicial: ',
            end: ' - Final: ',
            damageTaken: ' - Daño recibido: ',
            avgHP: ' - PV por luchador: ',
            total: 'Total ',
            average: 'Promedio ',
            HP: 'PV',
            damage: 'daño',
            avgDamage: 'Daño medio',
            avgDamageMax: 'Daño max. medio',
            avgWeaponDamage: 'Daño por arma medio',
            avgWeaponDamageMax: 'Daño por arma max. medio',
          },
          KoM: {
            success: 'Rango asignado!',
            error: 'Un error ha ocurrido',
            showPlayerOnMap: 'Mostrar jugador en el mapa',
            showTown: 'Mostrar resumen de ciudad',
            showAlly: 'Mostrar resumen de alianza',
            showFort: 'Mostrar resumen del fuerte',
            showBattle: 'Mostrar campo de batalla',
            atFort: 'En el fuerte',
            nearFort: 'Cerca del fuerte',
            notFort: 'No en el fuerte',
            evaluated: 'Evaluar jugador',
            started: 'La batalla ya ha comenzado',
            remindAlly: 'Recuerde a los miembros de la alianza, que todavía no han participado',
            where: 'Dónde',
            when: 'Cuando',
            att: 'atacantes',
            def: 'defensores',
            nodata: 'No se puede cargar la información de rango para el fuerte',
            getData: 'Información del rango cargada',
            errorTimeout: 'La carga tomó demasiado tiempo',
            ascaptain: 'Promocionar a capitán',
            assergeant: 'Designado como sargento',
            asprivate: 'Designar como soldado raso',
            asrecruit: 'Designar como recluta',
            asreservist: 'Designar reservista',
            astraitor: 'Marcar como traidor',
            youcant: 'No se pueden disminuir los combatientes<br>con igual o superior rango.',
            position: 'Posición',
            pos_undefined: 'Sin posición de partida',
            notown: 'Sin ciudad',
            noally: 'Sin alianza',
            damage: 'Daño',
            flag: 'Bandera',
            inside: 'Dentro del fuerte',
            sectors: {
              undef: 'Sin posición de partida',
              0: 'El sector superior izquierdo',
              1: 'El sector central izquierdo',
              2: 'El sector inferior izquierdo',
              3: 'El sector central inferior',
              4: 'El sector inferior derecho',
              5: 'El sector central derecho',
              6: 'El sector superior derecho',
              7: 'Torre Aventureros',
              8: 'Torre Duelistas',
              9: 'Torre Soldados',
              10: 'Torre Trabajadores',
              11: 'Barracas',
              12: 'Almacén de recursos',
              13: 'Cuartel general',
              14: 'Muralla Norte',
              15: 'Muralla Sur',
              16: 'Muralla Oeste',
              17: 'Muralla Este',
              18: 'Puerta',
              19: 'Bandera',
            },
          },
        },
        nl: {
          language: 'Dutch (Nederlands)',
          ApiGui1: 'Dit script bevat veel mogelijkheden om het dagelijks leven in The West te vergemakkelijken.<br>Voor meer informatie',
          ApiGui2: 'Open script pagina',
          Feat: {
            ColorTchat: '%0 Adds new features to the chat. Colored text, Emojis 🐧🎉 etc.',
            QuickItemsSearch: '%0 Search for buff categories and sets in your inventory',
            MarketBestBids: '%0 Colors the auctions based on the price %1 Green %2 Bid is lower than the purchase price %3 Black %4 Bid is equal to the purchase price %5 Blue %6 Bid is between 100% and 200% of the purchase price %7 Red %8 Bid is more than 200%">',
            BattleStars: '%0 Additional stats in the fort battle report',
            KickoMatic: '%0 Helpful to rank players before a fort battle',
            DuelMap: 'Voeg een duelkaart toe aan de duel tab',
            MarkDaily: 'Markeer de dagelijkse inlogbonus op de 5e dag zodat je hem niet mist',
            MarketMessage: 'Krijg een bericht wanneer er voorwerpen of geld beschikbaar zijn om op te halen',
            AchievHide: 'Verberg voltooide prestaties in prestatiescherm',
            RecipeMarket: 'Verbeter overzicht voor recepten kopen.',
            MoveJobs: 'Verschuif de werkzaamheden in de wachtrij een stukje naar links',
            InstantQuest: 'Voltooi de quest direct als aan alle vereisten is gedaan',
            QuestWiki: 'Add a link in the quest window to show the quest on the wiki page',
            CityTravel: 'Show the travel time to the towns in the blackboard',
            BetterSheriff: 'Add a new tab in the sheriff window to see all possible bounties',
            ChatProfessions: 'Show the crafting profession of the players in the chat list',
            QuestBookSearch: 'Search for solved quests in the quest book',
            MarketRights: 'Show if market offers are public or only for alliance/town members',
            EquipManagerPlus: 'Improve the equipment manager in the inventory',
            ShortPopups: 'Make the item pop-ups shorter',
            HideNotis: 'Add a button to hide the job notifications on the left side',
            JobProducts: 'Show in the job pop-up how many products you already have in your inventory',
            MapDistance: ' Show the number of miles next to the travel time',
            TraderSell: 'Sell multiple items at once to the trader',
            TouchControl: 'Enable touch control for map and scrollbar on your mobile',
            FbRankingChar: 'Show the character class in the fortbattle world ranking',
            DuelXpCalc: 'Show the duel experience in player profiles',
            Logout: 'Voeg een afmeldknop toe aan de rechterzijde van het scherm',
            Statusbar: 'Verwijder het dagelijkse taken icoon',
            ChangeCity: 'Verwissel de titel en de spelersnaam in het  stadhuis',
            BlinkEvents: 'Stop het knipperen van event of circus knop aan linkerkant',
            FortTracker: 'Schakel de fortgevecht herinnering uit',
            FriendsPop: 'Verberg “uw vriend logt in” pop-ups',
          },
          settings1: 'Instellingen openen',
          settings2: 'Instellingen en informatiescherm openen',
          ghosttown2: 'Open Spookstad',
          ghosttown3: 'Open Spookstad en centreer het op de kaart',
          indiantown2: 'Open Waupees indianendorp',
          indiantown3: 'Open Waupees indianendorp en centreer het op de kaart',
          openmarket: 'Open markt',
          opentrader: 'Open mobile trader',
          forum: 'Open stadsforum',
          newsets: 'Nieuwe sets worden toegevoegd aan het script',
          chooseItems: 'Choose the items',
          remindHover: 'You get a notification when an item can be used again. Here you can choose these items.',
          remindReady: 'Ready to collect',
          skipHover: 'Skip the confirmation and result messages when you open some bags. Here you can choose these bags',
          skipDone: 'You get',
          info: 'Informatie',
          contact: 'Contact',
          chooseLang: 'Kies een taal',
          features: 'Features',
          name: 'Naam',
          save: 'Opslaan',
          saveMessage: 'Sparen succes',
          saveMessage2: 'Instellingen toegevoegd. Sommige veranderingen hebben behoefte aan een refresh van het spel venster.',
          setbonus2: 'Informatie over de set bonusen',
          bonussearch2: 'Find items by bonus',
          frame2: 'Nuttige websites',
          npclocator2: 'Find quest givers on the map',
          choose: 'Klik op de hoed en kies',
          items: 'Voorwerpen',
          parts: 'parts',
          showItems: 'Show the set items in your Bag',
          noItems: 'No items in your inventory found. Click again with CTRL to show it on TW-Calc.',
          ownSets: 'Only own sets',
          switchWeapon: 'Switch between firearm and melee weapon',
          selectBonus: 'Select bonuses',
          resetB: 'Reset',
          body: 'Clothing',
          right_arm: 'Weapons',
          animal: 'Horse & Yield',
          rest: 'Other',
          buff: 'Buffs',
          refresh: 'Verversen',
          noFriends: 'Geen vrienden',
          reward: 'Beloning',
          allprofessions: 'Alle Beroepen',
          market1: 'Voorwerpen op de markt',
          market2: 'Er zijn voorpen/geld op de markt. Wat wil je eraf halen?',
          all: 'Alles',
          onlyBids: 'Alleen biedingen',
          nothing: 'Niets',
          worldwide: 'Worldwide',
          alliance: 'Alliance',
          town: 'Stad',
          level: 'Level',
          duelLevel: 'Duel level',
          exp: 'Ervaring',
          distance: 'Afstand',
          startduel: 'Duelleren',
          centerMap: 'Centreer kaart',
          popup: 'Vaardigheden-Bonus van de tegenstander',
          damage: 'Schade',
          duelmap: 'Duelkaart',
          duelradius: 'Duel radius',
          minutes: 'minuten',
          hour: '1 uur',
          hours: 'uren',
          searchOpp: 'Zoek naar tegenstanders',
          amount: 'Dead',
          not_dead_amount: 'Alive',
          duellevel: 'Lvl',
          pStatus: 'Status',
          sortBy: 'Sort by',
          tooLow: 'Too low duelling level of opponent',
          tooHigh: 'Too high duelling level of opponent',
          ownTown: 'Member of your town',
          attackable: 'Show only attackable players',
          youKO: 'You have duel protection',
          attDl: 'Attackable duelling levels',
          duelxp: 'Current duel experience',
          logout: 'Afmelden',
          accNfin: 'Opdracht aannemen & afsluiten',
          onWiki: 'Show the quest on the wiki',
          longerName: 'Name must be longer than 2 characters',
          loading: 'Loading...',
          rename: 'Rename',
          newName: 'Choose a new set name',
          used: 'Used',
          renameWarning: 'When you rename a set, you will wear it and undress it again.<br>You may loose health points during the process!',
          sellItems: 'Sell items to the trader?',
          removeWorkNotis: 'Hide all job notifications',
          compInv: 'Click on "cancel" to just show only auctionable items\n or\nEnter other inventory URL to compare',
          loginAll1: 'Login all worlds',
          loginAll2: 'Laad al uw actieve werelden met één klik',
          custom1: 'Custom',
          custom2: 'Your custom login list',
          edit: 'Edit',
          CT: {
            ColorWindowTitle: 'Color tchat setting',
            ColorWindowPreviewTxt: '*Click on the letters to change color',
            ColorWindowOkBtn: 'Apply',
            ColorWindowToDefaultBtn: 'Set to default',
            ColorWindowThisTchatBtn: 'Set to this',
            ColorWindowDefaultText: 'Select the tchat for reset to default: ',
            ColorWindowBold: 'Bold',
            ColorWindowCaps: 'Capitalized',
            ColorWindowFlip: 'Flip',
            ColorBtnTitle: '',
            ColorLoadListName: [
              'No color',
              'Enter a color code',
              'red',
              'brown',
              'purple',
              'blue',
              'green',
              'pink',
              'magenta',
              'violet gradient',
              'degraded dark blue',
              'green gradient',
              'degraded red',
              'blue gradient light',
              'degraded pink',
              'light green gradient',
              'degraded pink',
              'red gradient light'
            ],
            ColorLoadTitle: 'Click to load another color code<br>The current color code is: ',
            ColorSaveEmpty: '[empty]',
            CustomReady: 'Valid Code',
            CustomNotReady: 'Invalid Code',
          },
          QIS: {
            adventure: '*Avontuur',
            work: '*Werkzaamheid',
            duel: '*Duels',
            energy: '*Actiepunten',
            skill: '*Vaardigheden',
            fk: '*Fort gevechten',
            speed: '*Snelheid',
            lp: '*Levenspunten',
            luckNmoney: '*Luck & money',
            workmoti: '*Arbeidsmotivatie',
            duelmoti: '*Duel motivatie',
            experience: '*Experience',
            special: '*Premium/speciaal',
            events: '*Events',
            chests: '*Openen',
            equipment: '-Uitrusting',
            products: '-Producten',
            questitems: '-Opdracht gerelateerde voowerpen',
            craftitems: '-Handwerk',
            recipes: '-Recepten',
            NAMED: 'NAMED',
            nothingFound: 'Er kon geen voorwerp van dit type worden!',
          },
          NPC: {
            loading: 'Loading current quest givers',
            title: 'Quest giver locator',
            chooseNpc: 'Select employer',
            yourposition: 'Your position',
            questgiver: 'Quest giver',
            reload: 'Reload all quest givers',
          },
          BS: {
            hero: 'HERO',
            heroT: 'Number of shots (taken & dodged) per 1000 HPs',
            rate: 'Rate',
            hitsTaken: 'Hits taken',
            dodgedShots: 'Dodged shots',
            startHP: 'Start HP',
            survivor: 'SURVIVOR',
            survivorT: 'Survivor with the fewest HPs at the end of the fort battle',
            endHP: 'End HP',
            sniper: 'SNIPER',
            sniperT: 'Number of successful hits (percentage) in relation to all shots fired',
            rateP: 'Rate(%)',
            hitCount: 'Hit count',
            missedShots: 'Missed shots',
            matrix: 'MATRIX',
            matrixT: 'Number of doged shots (percentage) in relation to all shots (taken & dodged)',
            terminator: 'TERMINATOR',
            terminatorT: 'Number of KOs (percentage) in relation to the successful hits',
            KOs: 'KOs',
            ranking: 'Ranking',
            statsTitle: 'Fort battle statistics',
            designation: 'Designation',
            attack: 'Attack',
            defense: 'Defense',
            difference: 'Difference',
            statistics: 'Statistics',
            code: 'Code',
            goBack: 'Go back',
            starsTitle: 'The stars of the battle',
            title: 'Title',
            name: 'Name',
            details: 'Details',
            start: ' HP - Start: ',
            end: ' - End: ',
            damageTaken: ' - Damage taken: ',
            avgHP: ' - HP per fighter: ',
            total: 'Total ',
            average: 'Average ',
            HP: 'HP',
            damage: 'Damage',
            avgDamage: 'Average damage',
            avgDamageMax: 'Average max damage',
            avgWeaponDamage: 'Average weapon damage',
            avgWeaponDamageMax: 'Weapon damage max',
          },
          KoM: {
            success: 'Rang wordt gegeven!',
            error: 'Er is een fout opgetreden',
            showPlayerOnMap: 'Laat speler zien op de map',
            showTown: 'Stadsoverzicht tonen',
            showAlly: 'Alliantie overzicht tonen',
            showFort: 'Fort overzicht tonen',
            showBattle: 'Show slagveld',
            atFort: 'Bij het fort',
            nearFort: 'Dichtbij het fort',
            notFort: 'Niet bij het fort',
            evaluated: 'Evalueer speler',
            started: 'Het gevecht is volop bezig',
            remindAlly: 'Herinner alliantieleden, die nog niet hebben deelgenomen',
            where: 'Waarin',
            when: 'Wanneer',
            att: 'Aanvallers',
            def: 'Verdedigers',
            nodata: 'Informatie over rangen is niet gegeven voor het fort!',
            getData: 'Ranginformatie aan het laden',
            errorTimeout: 'Het downloaden duurde te lang',
            ascaptain: 'Tot kapitein bevorderen',
            assergeant: 'Benoemen tot sergeant',
            asprivate: 'Tot soldaat benoemen',
            asrecruit: 'Tot rekruut benoemen',
            asreservist: 'Tot reservist benoemen',
            astraitor: 'Als verrader markeren',
            youcant: 'Je kan geen spelers met dezelfde<br>of een hogere rang rekruteren.',
            position: 'Positie',
            pos_undefined: 'Geen startpositie',
            notown: 'No town',
            noally: 'Geen alliantie',
            damage: 'Schade',
            flag: 'Vlag',
            inside: 'Binnen het fort',
            sectors: {
              undef: 'Geen startpositie',
              0: 'De sector links boven',
              1: 'De centraal linker sector',
              2: 'De sector linksonder',
              3: 'De sector midden onder',
              4: 'De sector rechtsonder',
              5: 'De centraal rechter sector',
              6: 'De sector rechtsboven',
              7: 'Avonturierstoren',
              8: 'Duellantentoren',
              9: 'Soldatentoren',
              10: 'Arbeiderstoren',
              11: 'Kazerne',
              12: 'Opslagplaats',
              13: 'Hoofdgebouw',
              14: 'Bovenmuur',
              15: 'Ondermuur',
              16: 'Linkermuur',
              17: 'Rechtermuur',
              18: 'Poort',
              19: 'Vlag',
            },
          },
        },
        hu: {
          language: 'Hungarian (Magyar)',
          ApiGui1: 'Ez a szkript több olyan funkciót tartalmaz ami megkönnyíti a mindennapjaidat a vadnyugaton.<br>Több információ',
          ApiGui2: 'Szkript oldalának megnyitása',
          Feat: {
            ColorTchat: '%0 Adds new features to the chat. Colored text, Emojis 🐧🎉 etc.',
            QuickItemsSearch: '%0 Search for buff categories and sets in your inventory',
            MarketBestBids: '%0 Colors the auctions based on the price %1 Green %2 Bid is lower than the purchase price %3 Black %4 Bid is equal to the purchase price %5 Blue %6 Bid is between 100% and 200% of the purchase price %7 Red %8 Bid is more than 200%">',
            BattleStars: '%0 Additional stats in the fort battle report',
            KickoMatic: '%0 Helpful to rank players before a fort battle',
            DuelMap: 'Párbajtérkép a párbaj ablakban',
            MarkDaily: 'Az 5. napi belépés bónusz bekeretezése, hogy nehogy kihagyd',
            MarketMessage: 'Felugró ablak amikor tárgyak vagy pénz felvétele lehetséges az aktuális piacnál',
            AchievHide: 'Befejezett események elrejtése az esemény ablakban',
            RecipeMarket: 'Receptvásárlás megkönnyítése, rendezése a piacon',
            MoveJobs: 'Mozgassa el a munka várólistát kissé balra hogy elférjenek az ikonok',
            InstantQuest: 'Befejezni a küldetést, azonnal, ha minden feltétel kész',
            QuestWiki: 'Link hozzáadása a kalandablakban, amin elérhető a kaland wikioldala',
            CityTravel: 'Távolság a várostól mutatása a hirdetőtáblán',
            BetterSheriff: 'Új lap hozzáadása a Seriff ablakban, láthatóvá téve az összes körözöttet',
            ChatProfessions: 'Mesterségek mutatása a játékosoknál a chat partnerlistánál',
            QuestBookSearch: 'Keresés a befejezett kalandoknál a kalandkönyvben',
            MarketRights: 'Piaci ajánlatoknál mutatása, hogy bárki számára elérhető vagy csak szövetség/város tagok számára',
            EquipManagerPlus: 'Felszerelés kezelő ablak fejlesztése',
            ShortPopups: 'Tárgy felugró menüjének rövidítése',
            HideNotis: 'Bal oldalon lévő munkaértesítéseket eltüntető gomb hozzáadása',
            JobProducts: 'Munkáknál felugró menüben mutassa, mennyi terméked van már a felszerelésedben, ami az adott munkánál található',
            MapDistance: ' Show the number of miles next to the travel time',
            TraderSell: 'Sell multiple items at once to the trader',
            TouchControl: 'Enable touch control for map and scrollbar on your mobile',
            FbRankingChar: 'Show the character class in the fortbattle world ranking',
            DuelXpCalc: 'Show the duel experience in player profiles',
            Logout: 'Kilépés gomb a jobb oldalra',
            Statusbar: 'Tálca eltüntetése',
            ChangeCity: 'Cím és játékosnév felcserélése a városházánál',
            BlinkEvents: 'Események, eladás és piaci vásár gomb villogás kikapcsolása',
            FortTracker: 'Kapcsolja ki az erődharc emlékeztetőt',
            FriendsPop: 'Rejtse el a "barátod bejelentkezett" felugró ablakokat',
          },
          settings1: 'Beállítások megnyitása',
          settings2: 'Beállítások és információk',
          ghosttown2: 'Szellemváros megnyitása',
          ghosttown3: 'Szellemváros megnyitása és ráközelítés térképen',
          indiantown2: 'Indián falu megnyitása',
          indiantown3: 'Indián falu megnyitása és ráközelítés térképen',
          openmarket: 'Piac megnyitása',
          opentrader: 'Utazó kereskedő megnyitása',
          forum: 'Városfórum megnyitása',
          newsets: 'Új szett(ek) lettek hozzáadva a szkripthez',
          chooseItems: 'Válasz tárgyat',
          remindHover: 'Értesítést kapsz, amint egy tárgy ismét használható. Itt tudod kiválasztani melyik tárgyakról szeretnél értesítést kapni.',
          remindReady: 'Begyűjtésre készen áll',
          skipHover: 'Táskák nyitásánál megerősítő és jutalom üzenet figyelem kívül hagyása. Itt tudod kiválasztani melyik táska nyitásról ne kapj üzenetet.',
          skipDone: 'Ezt kapod',
          info: 'Információk',
          contact: 'Elérhetőségek',
          chooseLang: 'Válasszon nyelvet',
          features: 'Funkciók',
          name: 'Név',
          save: 'Mentés',
          saveMessage: 'Sikeres mentés',
          saveMessage2: 'Beállítások elmentve. Néhány változás életbe lépéséhez frissítse a játék ablakát.',
          setbonus2: 'Információk a szettbónuszokról',
          bonussearch2: 'Find items by bonus',
          frame2: 'Hasznos weboldalak',
          npclocator2: 'Find quest givers on the map',
          choose: 'Kattints a kalapra a kezdéshez, választáshoz',
          items: 'tárgyak',
          parts: 'darabok',
          showItems: 'Mutassa a szett tárgyakat a felszerelésedben',
          noItems: 'Nem található tárgy(ak) a felszerelésedben',
          ownSets: 'Csak a megszerzett szettek',
          switchWeapon: 'Váltás lőfegyver és ütőfegyver közt',
          selectBonus: 'Válasz bónuszt',
          resetB: 'Visszaállítás',
          body: 'Ruházat',
          right_arm: 'Párbajfegyver',
          animal: 'Állat',
          rest: 'Egyéb',
          buff: 'Buffs',
          refresh: 'Újratöltés',
          noFriends: 'Nincsenek barátok',
          reward: 'Díjak',
          allprofessions: 'Minden szakma',
          market1: 'Áruk a piacon',
          market2: 'Vannak Áruk/Pénz ezen a piacon. Mit szeretnél átvenni? ',
          all: 'Mindent',
          onlyBids: 'Árukat',
          nothing: 'Semmit',
          worldwide: 'Világ',
          alliance: 'Szövetség',
          town: 'Város',
          level: 'Szint',
          duelLevel: 'Párbajszint',
          exp: 'Tp',
          distance: 'Távolság',
          startduel: 'Párbaj kezdése',
          centerMap: 'Térkép közepére',
          popup: 'Az ellenfél bónusza',
          damage: 'Sebzés',
          duelmap: 'Párbajtérkép',
          duelradius: 'Párbaj sugár',
          minutes: 'perc',
          hour: '1 óra',
          hours: 'óra',
          searchOpp: 'Ellenfél keresése',
          amount: 'Halva',
          not_dead_amount: 'Élve',
          duellevel: 'Szint',
          pStatus: 'Státusz',
          sortBy: 'Rendezés',
          tooLow: 'Túl alacsony a párbajszintje az ellenfélnek',
          tooHigh: 'Túl magas a párbajszintje az ellenfélnek',
          ownTown: 'Városod tagja',
          attackable: 'Csak a kihívható ellenfeleket mutassa',
          youKO: 'You have duel protection',
          attDl: 'Attackable duelling levels',
          duelxp: 'Current duel experience',
          logout: 'Kijelentkezés',
          accNfin: 'Kaland elfogadása & lezárása',
          onWiki: 'Kaland mutatása a wikin',
          longerName: 'Névnek két karakternél hosszabbnak kell lennie',
          loading: 'Töltés...',
          rename: 'Átnevezés',
          newName: 'Válasz új nevet a szettnek',
          used: 'Használt',
          renameWarning: 'When you rename a set, you will wear it and undress it again.<br>You may loose health points during the process!',
          sellItems: 'Sell items to the trader?',
          removeWorkNotis: 'Összes munkaértesítés elrejtése',
          compInv: 'Kattints a "mégse" gombra hogy csak az árverezhető tárgyakat mutassa\n vagy\nHozzáadd egy másik táska URL címét összehasonlításként',
          loginAll1: 'Összes világba bejelentkezés',
          loginAll2: 'Betölti az összes aktív világok egyetlen kattintással',
          custom1: 'Egyedi',
          custom2: 'Egyedi bejelentkezési listád',
          edit: 'Szerkesztés',
          CT: {
            ColorWindowTitle: 'Color tchat setting',
            ColorWindowPreviewTxt: '*Click on the letters to change color',
            ColorWindowOkBtn: 'Apply',
            ColorWindowToDefaultBtn: 'Set to default',
            ColorWindowThisTchatBtn: 'Set to this',
            ColorWindowDefaultText: 'Select the tchat for reset to default: ',
            ColorWindowBold: 'Bold',
            ColorWindowCaps: 'Capitalized',
            ColorWindowFlip: 'Flip',
            ColorBtnTitle: '',
            ColorLoadListName: [
              'No color',
              'Enter a color code',
              'red',
              'brown',
              'purple',
              'blue',
              'green',
              'pink',
              'magenta',
              'violet gradient',
              'degraded dark blue',
              'green gradient',
              'degraded red',
              'blue gradient light',
              'degraded pink',
              'light green gradient',
              'degraded pink',
              'red gradient light'
            ],
            ColorLoadTitle: 'Click to load another color code<br>The current color code is: ',
            ColorSaveEmpty: '[empty]',
            CustomReady: 'Valid Code',
            CustomNotReady: 'Invalid Code',
          },
          QIS: {
            adventure: '*Adventures',
            work: '*Work',
            duel: '*Duels',
            energy: '*Energy',
            skill: '*Skill points',
            fk: '*Fort battles',
            speed: '*Speed',
            lp: '*Health points',
            luckNmoney: '*Luck & money',
            workmoti: '*Work motivation',
            duelmoti: '*Duel motivation',
            experience: '*Experience',
            special: '*Premium/special',
            events: '*Events',
            chests: '*Open & unpack',
            equipment: '-Equipment',
            products: '-Products',
            questitems: '-Quest items',
            craftitems: '-Craft items',
            recipes: '-Recipes',
            NAMED: 'NAMED',
            nothingFound: 'No items of this type found!',
          },
          NPC: {
            loading: 'Loading current quest givers',
            title: 'Quest giver locator',
            chooseNpc: 'Select employer',
            yourposition: 'Your position',
            questgiver: 'Quest giver',
            reload: 'Reload all quest givers',
          },
          BS: {
            hero: 'HERO',
            heroT: 'Number of shots (taken & dodged) per 1000 HPs',
            rate: 'Rate',
            hitsTaken: 'Hits taken',
            dodgedShots: 'Dodged shots',
            startHP: 'Start HP',
            survivor: 'SURVIVOR',
            survivorT: 'Survivor with the fewest HPs at the end of the fort battle',
            endHP: 'End HP',
            sniper: 'SNIPER',
            sniperT: 'Number of successful hits (percentage) in relation to all shots fired',
            rateP: 'Rate(%)',
            hitCount: 'Hit count',
            missedShots: 'Missed shots',
            matrix: 'MATRIX',
            matrixT: 'Number of doged shots (percentage) in relation to all shots (taken & dodged)',
            terminator: 'TERMINATOR',
            terminatorT: 'Number of KOs (percentage) in relation to the successful hits',
            KOs: 'KOs',
            ranking: 'Ranking',
            statsTitle: 'Fort battle statistics',
            designation: 'Designation',
            attack: 'Attack',
            defense: 'Defense',
            difference: 'Difference',
            statistics: 'Statistics',
            code: 'Code',
            goBack: 'Go back',
            starsTitle: 'The stars of the battle',
            title: 'Title',
            name: 'Name',
            details: 'Details',
            start: ' HP - Start: ',
            end: ' - End: ',
            damageTaken: ' - Damage taken: ',
            avgHP: ' - HP per fighter: ',
            total: 'Total ',
            average: 'Average ',
            HP: 'HP',
            damage: 'Damage',
            avgDamage: 'Average damage',
            avgDamageMax: 'Average max damage',
            avgWeaponDamage: 'Average weapon damage',
            avgWeaponDamageMax: 'Weapon damage max',
          },
          KoM: {
            success: 'Rank is given!',
            error: 'An error has occured',
            showPlayerOnMap: 'Show player on map',
            showTown: 'Show town overview',
            showAlly: 'Show alliance overview',
            showFort: 'Show fort overview',
            showBattle: 'Show battlefield',
            atFort: 'At the fort',
            nearFort: 'Nearby the fort',
            notFort: 'Not at the fort',
            evaluated: 'Number of evaluated players',
            started: 'The battle is taking place right now',
            remindAlly: 'Remind ally members, who haven\'t participated yet',
            where: 'Where',
            when: 'When',
            att: 'Attackers',
            def: 'Defenders',
            nodata: 'Couldn\'t load rank information for the fort',
            getData: 'Loading rank information',
            errorTimeout: 'The loading took too much time',
            ascaptain: 'Promote to captain',
            assergeant: 'Appoint as sergeant',
            asprivate: 'Appoint as private',
            asrecruit: 'Appoint as recruit',
            asreservist: 'Appoint as reservist',
            astraitor: 'Mark as traitor',
            youcant: 'You can\'t demote fighters of<br>the same or higher rank.',
            position: 'Position',
            pos_undefined: 'No starting position',
            notown: 'No town',
            noally: 'No alliance',
            damage: 'Damage',
            flag: 'Flag',
            inside: 'Inside the fort',
            sectors: {
              undef: 'No starting position',
              0: 'The upper-left sector',
              1: 'The lower-left sector',
              2: 'The central left sector',
              3: 'The lower central sector',
              4: 'The central right sector',
              5: 'The lower-right sector',
              6: 'The upper-right sector',
              7: 'Adventurer\'s tower',
              8: 'Dueller\'s tower',
              9: 'Soldier\'s tower',
              10: 'Worker\'s tower',
              11: 'Barracks',
              12: 'Resource stock',
              13: 'Headquarters',
              14: 'North wall',
              15: 'South wall',
              16: 'West wall',
              17: 'East wall',
              18: 'Gate',
              19: 'Flag',
            },
          },
        },
        el: {
          language: 'Greek (ελληνικά)',
          ApiGui1: 'Αυτό το script περιέχει πολλά χαρακτηριστικά για να απλοποιήσετε την ζωή σας στο The West.<br>Περισσότερες πληροφορίες',
          ApiGui2: 'Ρυθμίσεις του script',
          Feat: {
            ColorTchat: '%0 Adds new features to the chat. Colored text, Emojis 🐧🎉 etc.',
            QuickItemsSearch: '%0 Search for buff categories and sets in your inventory',
            MarketBestBids: '%0 Colors the auctions based on the price %1 Green %2 Bid is lower than the purchase price %3 Black %4 Bid is equal to the purchase price %5 Blue %6 Bid is between 100% and 200% of the purchase price %7 Red %8 Bid is more than 200%">',
            BattleStars: '%0 Additional stats in the fort battle report',
            KickoMatic: '%0 Helpful to rank players before a fort battle',
            DuelMap: 'Προσθήκη καρτέλας Duelmap στην καρτέλα μονομαχιών',
            MarkDaily: 'Επισημάνετε το καθημερινό μπόνους σύνδεσης την 5η ημέρα για να μην το χάσετε',
            MarketMessage: 'Εμφάνιση μηνύματος όταν υπάρχουν αντικείμενα ή χρήματα στην αγορά της πόλης που μόλις ταξιδέψατε',
            AchievHide: 'Απόκρυψη ολοκληρωμένων επιτευγμάτων στο παράθυρο επιτευγμάτων',
            RecipeMarket: 'Βελτιώστε την αγορά συνταγών στην αγορά',
            MoveJobs: 'Μετακινήστε την καρτέλα των τρέχουσων εργασιών λίγο προς τα αριστερά',
            InstantQuest: 'Ολοκληρώστε μια αποστολή αμέσως αν πληρούνται όλες οι απαιτήσεις',
            QuestWiki: 'Προσθήκη ενός κουμπιού στις αποστολές για την εμφάνισή τους στην σελίδα "Βοήθειας"',
            CityTravel: 'Εμφάνιση του χρόνου ταξιδιού στις πόλεις του μαυροπίνακα',
            BetterSheriff: 'Προσθήκη μιας νέας καρτέλας στο παράθυρο του "Σερίφη" για να δείτε όλες τις πιθανές επικυρήξεις',
            ChatProfessions: 'Προσθήκη του εικονιδίου επαγγέλματος των παικτών στη λίστα συνομιλίας (τσατ)',
            QuestBookSearch: 'Αναζήτηση για επιλυμένες αποστολές στο βιβλίο αποστολών',
            MarketRights: 'Προσθήκη εικονιδίου για το εάν οι προσφορές της αγοράς είναι δημόσιες ή μόνο για μέλη της συμμαχίας / πόλης',
            EquipManagerPlus: 'Βελτιώστε τον υπεύθυνο εξοπλισμού στα αποθέματα',
            ShortPopups: 'Εμφάνιση μικρότερης περιγραφής αντικειμένων στα αποθέματα',
            HideNotis: 'Προσθήκη ενός κουμπιού για την απόκρυψη των ειδοποιήσεων εργασίας στην αριστερή πλευρά',
            JobProducts: 'Εμφανίστε στο αναδυόμενο παράθυρο εργασίας πόσα προϊόντα έχετε ήδη στα αποθέματά σας',
            MapDistance: 'Εμφάνιση της απόστασης του ταξιδιού σας σε Μίλια',
            TraderSell: 'Πώληση πολλαπλών αντικειμένων στον Έμπορο',
            TouchControl: 'Enable touch control for map and scrollbar on your mobile',
            FbRankingChar: 'Show the character class in the fortbattle world ranking',
            DuelXpCalc: 'Show the duel experience in player profiles',
            Logout: 'Προσθέστε ένα κουμπί αποσύνδεσης στη δεξιά πλευρά',
            Statusbar: 'Αφαιρέστε τη γραμμή εργασιών',
            ChangeCity: 'Βάλτε τον τίτλο πριν από το όνομα του παίκτη στην καρτέλα του Δημαρχείου',
            BlinkEvents: 'Σταματήστε την αναλαμπή των Εκδηλώσεων και του Λούνα Παρκ στην αριστερή πλευρά',
            FortTracker: 'Απενεργοποιήστε την υπενθύμιση μάχης οχυρού',
            FriendsPop: 'Απόκρυψη αναδυόμενων παραθύρων "Συνδεδεμένοι φίλοι"',
          },
          settings1: 'Ρυθμίσεις',
          settings2: 'Ανοίξτε τις ρυθμίσεις και το παράθυρο πληροφοριών',
          ghosttown2: 'Άνοιγμα της Πόλης Φάντασμα',
          ghosttown3: 'Άνοιγμα και κεντράρισμα του χάρτη στην Πόλη Φάντασμα',
          indiantown2: 'Άνοιγμα του Ινδιάνικου χωριού',
          indiantown3: 'Άνοιγμα και κεντράρισμα του χάρτη στο Ινδιάνικο χωριό',
          openmarket: 'Άνοιγμα της Αγοράς',
          opentrader: 'Άνοιξε τον Πλανόδιο Πωλητή',
          forum: 'Άνοιγμα του Φόρουμ Πόλης',
          newsets: 'Νέα Σετ προσθέθηκαν στο script',
          chooseItems: 'Επιλέξτε τα αντικείμενα',
          remindHover: 'Λαμβάνετε μια ειδοποίηση όταν ένα αντικείμενο μπορεί να χρησιμοποιηθεί ξανά. Εδώ μπορείτε να επιλέξετε αυτά τα αντικείμενα.',
          remindReady: 'Έτοιμο για συλλογή',
          skipHover: 'Απενεργοποιήστε τα μηνύματα επιβεβαίωσης και τα αποτελέσματα όταν ανοίγετε κάποιες τσάντες. Εδώ μπορείτε να επιλέξετε αυτές τις τσάντες',
          skipDone: 'Παίρνετε',
          info: 'Πληροφορίες',
          contact: 'Επικοινωνία',
          chooseLang: 'Επιλογή γλώσσας',
          features: 'Χαρακτηριστικά',
          name: ' Όνομα παίκτη',
          save: 'Αποθήκευση',
          saveMessage: 'Αποθηκεύτηκε με επιτυχία',
          saveMessage2: 'Οι ρυθμίσεις αποθηκεύτηκαν. Ορισμένες αλλαγές χρειάζονται μια ανανέωση του παραθύρου του παιχνιδιού.',
          setbonus2: 'Πληροφορίες σχετικά με τα μπόνους των Σετ',
          bonussearch2: 'Find items by bonus',
          frame2: 'Χρήσιμες ιστοσελίδες',
          npclocator2: 'Find quest givers on the map',
          choose: 'Κάντε κλικ στο καπέλο για να ξεκινήσετε',
          items: 'Αντικείμενα',
          parts: 'Τεμάχια',
          showItems: 'Εμφάνιση των αντικειμένων που υπάρχουν στα αποθέματά σας',
          noItems: 'Δεν βρέθηκαν αντικείμενα στα αποθέματά σας!',
          ownSets: 'Δικά σου Σετ',
          switchWeapon: 'Εναλλαγή μεταξύ πυροβόλου όπλου και ξίφους όπλου',
          selectBonus: 'Επιλέξτε Μπόνους',
          resetB: 'Επαναφορά',
          body: 'Ένδυση',
          right_arm: 'Όπλο μονομαχίας',
          animal: 'Άλογο & σέλα',
          rest: 'Άλλο',
          buff: 'Buffs',
          refresh: 'Ανανέωση',
          noFriends: 'Δεν υπάρχουν φίλοι',
          reward: 'Ανταμοιβή',
          allprofessions: 'Όλα τα επαγγέλματα',
          market1: 'Αντικείμενα στην Αγορά',
          market2: 'Υπάρχουν αντικείμενα / χρήματα σε αυτήν την αγορά. Τι θέλετε να σηκώσετε;',
          all: 'Όλα',
          onlyBids: 'Μόνο προσφορές',
          nothing: 'Τίποτα',
          worldwide: 'Οποιονδήποτε',
          alliance: 'Συμμαχία',
          town: 'Πόλη',
          level: 'Επίπεδο',
          duelLevel: 'Επίπεδο μονομαχίας ',
          exp: 'Εμπειρία ',
          distance: 'Απόσταση ',
          startduel: 'Μονομαχήστε ',
          centerMap: 'Κεντράρισμα στον χάρτη',
          popup: 'Το μπόνους δεξιοτήτων των αντιπάλων',
          damage: 'Ζημιά',
          duelmap: 'Χάρτης μονομαχιών',
          duelradius: 'Ακτίνα μονομαχιών',
          minutes: 'λεπτά',
          hour: '1 ώρα',
          hours: 'ώρες',
          searchOpp: 'Αναζήτηση για αντιπάλους',
          amount: 'Νεκρός/ή',
          not_dead_amount: 'Ζωντανός/ή',
          duellevel: 'Επίπεδο',
          pStatus: 'Κατάσταση',
          sortBy: 'Ταξινόμηση κατά',
          tooLow: 'Χαμηλό επίπεδο μονομαχίας του αντιπάλου',
          tooHigh: 'Υψηλό επίπεδο μονομαχίας του αντιπάλου',
          ownTown: 'Μέλος της πόλης σου',
          attackable: 'Εμφάνιση μόνο παίκτες που μπορείτε να μονομαχήσετε',
          youKO: 'You have duel protection',
          attDl: 'Attackable duelling levels',
          duelxp: 'Current duel experience',
          logout: 'Αποσύνδεση',
          accNfin: 'Αποδοχή & Ολοκλήρωση αποστολής',
          onWiki: 'Εμφάνισε την αποστολή στο Wiki',
          longerName: 'Το όνομα πρέπει να είναι μεγαλύτερο από 2 χαρακτήρες',
          loading: 'Φόρτωση...',
          rename: 'Μετονομασία',
          newName: 'Επιλέξτε ένα νέο όνομα Σετ',
          used: 'Χρησιμοποιείται',
          renameWarning: 'Όταν μετονομάζετε ένα Σετ, θα το φορέσετε και θα το ξαναβγάλετε.<br>Μπορεί να χάσετε κάποιους πόντους υγείας κατά τη διάρκεια της διαδικασίας!',
          sellItems: 'Πώληση αντικειμένων στον Έμπορο;',
          removeWorkNotis: 'Απόκρυψη όλων των ειδοποιήσεων εργασιών',
          compInv: 'Κάντε κλικ στην επιλογή "ακύρωση" για να προβάλλετε μόνο αντικείμενα που μπορούν να πουληθούν με πλειστηριασμό\n ή\nΠροσθέστε άλλη διεύθυνση URL αποθέματος για σύγκριση',
          loginAll1: 'Είσοδος σε όλους',
          loginAll2: 'Φορτώστε όλους τους ενεργούς κόσμους σας με ένα κλικ',
          custom1: 'Προσαρμοσμένο',
          custom2: 'Η προσαρμοσμένη λίστα σας σύνδεσης',
          edit: 'Επεξεργασία',
          CT: {
            ColorWindowTitle: 'Ρυθμίσεις',
            ColorWindowPreviewTxt: '*Κάντε κλικ στα γράμματα για να αλλάξετε χρώμα',
            ColorWindowOkBtn: 'Εφαρμογή',
            ColorWindowToDefaultBtn: 'Προεπιλογή',
            ColorWindowThisTchatBtn: 'Ορίστε σε αυτό',
            ColorWindowDefaultText: 'Select the tchat for reset to default: ',
            ColorWindowBold: 'Έντονα',
            ColorWindowCaps: 'Κεφαλαία',
            ColorWindowFlip: 'Ανάποδα',
            ColorBtnTitle: '',
            ColorLoadListName: [
              'Χωρίς χρώμα',
              'Καταχωρίστε έναν κωδικό χρώματος',
              'Κόκκινο',
              'Καφέ',
              'Μωβ',
              'Μπλε',
              'Πράσινο',
              'Ροζ',
              'Σκούρο μωβ',
              'Βιολετί',
              'Ξεθωριασμένο σκούρο μπλε',
              'Ανοιχτό πράσινο',
              'Υποβαθμισμένο κόκκινο',
              'Γαλάζιο',
              'Ξεθωριασμένο σκούρο ροζ',
              'Λαχανί',
              'Ξεθωριασμένο ροζ',
              'Φωτεινό κόκκινο'
            ],
            ColorLoadTitle: 'Κάντε κλικ για να τοποθετήσετε έναν άλλο κωδικό χρώματος<br>Ο τρέχων κωδικός χρώματος είναι: ',
            ColorSaveEmpty: '[Άδειο]',
            CustomReady: 'Έγκυρος κωδικός',
            CustomNotReady: 'Μη έγκυρος κωδικός',
          },
          QIS: {
            adventure: '*Περιπέτειες',
            work: '*Εργασίες',
            duel: '*Μονομαχίες',
            energy: '*Ενέργεια',
            skill: '*Πόντοι ικανοτήτων',
            fk: '*Μάχες οχυρών',
            speed: '*Ταχύτητα',
            lp: '*Πόντοι υγείας',
            luckNmoney: '*Τύχη & Χρήματα',
            workmoti: '*Κίνητρο δουλειάς',
            duelmoti: '*Κίνητρο μονομαχίας',
            experience: '*Εμπειρία',
            special: '*Premium/special',
            events: '*Εκδηλώσεις',
            chests: '*Θήκες & Κάτι για να ανοίξεις',
            equipment: '-Εξοπλισμός',
            products: '-Προϊόντα',
            questitems: '-Αντικείμενα αποστολών',
            craftitems: '-Αντικείμενα επαγγελμάτων',
            recipes: '-Συνταγές',
            NAMED: 'NAMED',
            nothingFound: 'Δεν βρέθηκαν αντικείμενα αυτού του τύπου!',
          },
          NPC: {
            loading: 'Φόρτωση των τρέχοντων δοτών αποστολής',
            title: 'Τοποθεσία δότη αποστολής',
            chooseNpc: 'Επιλέξτε εργοδότη',
            yourposition: 'Η θέση σου',
            questgiver: 'Δότης αποστολής',
            reload: 'Ανανέωση όλων των δοτών αποστολής',
          },
          BS: {
            hero: 'HERO',
            heroT: 'Αριθμός βολών (ληφθείσες & αποφεύχθηκαν) ανά 1000 Ζωή',
            rate: 'Ποσοστό',
            hitsTaken: 'Λαμβανόμενα χτυπήματα',
            dodgedShots: 'Αποφυγή βολών',
            startHP: 'Αρχική ζωή',
            survivor: 'SURVIVOR',
            survivorT: 'Επιζών με την λιγότερη ζωή στο τέλος της μάχης του οχυρού',
            endHP: 'Ζωή στο τέλος της μάχης',
            sniper: 'SNIPER',
            sniperT: 'Αριθμός επιτυχημένων βολών (ποσοστό) σε σχέση με όλες τις βολές',
            rateP: 'Ποσοστό(%)',
            hitCount: 'Αριθμός χτυπημάτων',
            missedShots: 'Άστοχες βολές',
            matrix: 'MATRIX',
            matrixT: 'Αριθμός βολών (ποσοστό) σε σχέση με όλες τις βολές (ληφθείσες & αποφεύχθηκαν)',
            terminator: 'TERMINATOR',
            terminatorT: 'Αριθμός K.O. (ποσοστό) σε σχέση με τις επιτυχημένες βολές',
            KOs: 'K.O.',
            ranking: 'Κατάταξη',
            statsTitle: 'Στατιστικά μάχης οχυρού',
            designation: 'Περιγραφή',
            attack: 'Επίθεση',
            defense: 'Άμυνα',
            difference: 'Διαφορά',
            statistics: 'Στατιστικές',
            code: 'Κώδικας',
            goBack: 'Πίσω',
            starsTitle: 'Τα αστέρια της μάχης',
            title: 'Τίτλος',
            name: 'Όνομα παίκτη',
            details: 'Λεπτομέρειες',
            start: ' Ζωή - Αρχή: ',
            end: ' - Τέλος: ',
            damageTaken: ' - Λαμβάνουσα ζημιά: ',
            avgHP: ' - Ζωή ανά Παίκτη: ',
            total: 'Σύνολο ',
            average: 'Μέσος όρος ',
            HP: 'Ζωή',
            damage: 'Ζημιά',
            avgDamage: 'Μέση ζημιά',
            avgDamageMax: 'Μέση μέγιστη ζημία',
            avgWeaponDamage: 'Μέση ζημιά από όπλα',
            avgWeaponDamageMax: 'Μέγιστη ζημιά όπλου',
          },
          KoM: {
            success: 'Ο βαθμός άλλαξε με επιτυχία!',
            error: 'Παρουσιάστηκε σφάλμα',
            showPlayerOnMap: 'Κεντράρισμα παίχτη στον χάρτη',
            showTown: 'Επισκόπηση Πόλης',
            showAlly: 'Επισκόπηση Συμμαχίας',
            showFort: 'Επισκόπηση Οχυρού',
            showBattle: 'Επισκόπηση Μάχης Οχυρού',
            atFort: 'Βρίσκεται στο Οχυρό',
            nearFort: 'Βρίσκεται κοντά στο Οχυρό',
            notFort: 'Βρίσκεται μακριά από το Οχυρό',
            evaluated: 'Αριθμός αξιολογούμενων παικτών',
            started: 'Η μάχη μόλις ξεκίνησε',
            remindAlly: 'Στείλτε μύνημα στα μέλη της συμμαχίας,<br>που δεν έχουν ακόμη συμμετάσχει στην μάχη.',
            where: 'Πάμε στο Οχυρό',
            when: 'Ημέρα Μάχης',
            att: 'Επιτιθέμενοι',
            def: 'Αμυνόμενοι',
            nodata: 'Δεν ήταν δυνατή η φόρτωση των πληροφοριών κατάταξης βαθμίδας για το οχυρό',
            getData: 'Φόρτωση πληροφοριών κατάταξης βαθμίδας',
            errorTimeout: 'Η φόρτωση χρειάστηκε πολύ χρόνο',
            ascaptain: 'Προβιβασμός σε Καπετάνιο',
            assergeant: 'Ορισμός ως Λοχίας',
            asprivate: 'Διορισμός ως Στρατιώτης',
            asrecruit: 'Ορισμός ως Αστρατολόγητος',
            asreservist: 'Ορισμός ως Έφεδρος',
            astraitor: 'Σήμανση ως Προδότης',
            youcant: 'Δεν μπορείτε να υποβιβάσετε παίχτες<br>της ίδιας ή υψηλότερης βαθμίδας',
            position: 'Θέση στο οχυρό',
            pos_undefined: 'Χωρίς θέση ακόμη',
            notown: 'Χωρίς πόλη',
            noally: 'Χωρίς συμμαχία',
            damage: 'Ζημιά',
            flag: 'Σημαία',
            inside: 'Μέσα στο Οχυρό',
            sectors: {
              undef: '❝Χωρίς θέση ακόμη❞',
              0: '❝Αριστερός (πάνω) μεγάλος τομέας❞',
              1: '❝Αριστερός (κάτω) μεγάλος τομέας❞',
              2: '❝Κεντρικός (αριστερά) μεγάλος τομέας❞',
              3: '❝Κεντρικός (μεσαίος) μεγάλος τομέας❞',
              4: '❝Κεντρικός (δεξιά) μεγάλος τομέας❞',
              5: '❝Δεξιός (κάτω) μεγάλος τομέας❞',
              6: '❝Δεξιός (πάνω) μεγάλος τομέας❞',
              7: '❝Πύργος Τυχοδιοκτών❞',
              8: '❝Πύργος Μονομάχων❞',
              9: '❝Πύργος Στρατιωτών❞',
              10: '❝Πύργος Εργατών❞',
              11: '❝Κάτω δεξιά Σπιτάκι❞',
              12: '❝Πάνω δεξιά Σπιτάκι❞',
              13: '❝Αριστερά Σπιτάκι❞',
              14: '❝Πάνω τοίχος❞',
              15: '❝Κάτω τοίχος❞',
              16: '❝Αριστερό τοίχος❞',
              17: '❝Δεξιό τοίχος❞',
              18: '❝Πύλες❞',
              19: '❝Σημαία❞',
            },
          },
        },
        pt: {
          language: 'Portuguese (português)',
          ApiGui1: 'Esse script foi feito para facilitar sua vida no Velho Oeste',
          ApiGui2: 'Abrir página do Script',
          Feat: {
            ColorTchat: '%0 Adds new features to the chat. Colored text, Emojis 🐧🎉 etc.',
            QuickItemsSearch: '%0 Search for buff categories and sets in your inventory',
            MarketBestBids: '%0 Colors the auctions based on the price %1 Green %2 Bid is lower than the purchase price %3 Black %4 Bid is equal to the purchase price %5 Blue %6 Bid is between 100% and 200% of the purchase price %7 Red %8 Bid is more than 200%">',
            BattleStars: '%0 Additional stats in the fort battle report',
            KickoMatic: '%0 Helpful to rank players before a fort battle',
            DuelMap: 'Adicionar mapa de duelos na janela duelos.',
            MarkDaily: 'Destacar bônus de login diário.',
            MarketMessage: 'Receber notificação de itens comprados ou vendidos no mercado atual.',
            AchievHide: 'Ocultar conquistas realizadas na janela de conquistas.',
            RecipeMarket: 'Melhorar a compra de receitas no mercado.',
            MoveJobs: 'Mover os trabalhos enfileirados a esquerda.',
            InstantQuest: 'Completar aventura instantâneamente quando tiver os requisitos.',
            QuestWiki: 'Adicionar link para abrir a aventura no wiki.',
            CityTravel: 'MOstrar o tempo de distância nas cidades do quadro.',
            BetterSheriff: 'Adicionar aba no Xerife para ver todas as recompensas possíveis.',
            ChatProfessions: 'MOstrar a profissão dos jogadores na lista do chat.',
            QuestBookSearch: 'Pesquisar por aventuras resolvidas no livro de aventuras',
            MarketRights: 'Diferenciar itens no mercado entre cidade, aliança, e público.',
            EquipManagerPlus: 'Mostre o gerenciamento de equipamento no inventário.',
            ShortPopups: 'Tornar janelas pop-up mais curtas.',
            HideNotis: 'Adicionar botão para ocultar as notificações do trabalho ao lado esquerdo.',
            JobProducts: 'Mostrar na janela de trabalho quantos produtos você já tem no inventário.',
            MapDistance: ' Mostrar o número de milhas ao lado do tempo de viagem.',
            TraderSell: 'Vender vários itens de uma só vez ao comerciante.',
            TouchControl: 'Enable touch control for map and scrollbar on your mobile',
            FbRankingChar: 'Show the character class in the fortbattle world ranking',
            DuelXpCalc: 'Show the duel experience in player profiles',
            Logout: 'Adicionar botão de sair no fim dos scripts',
            Statusbar: 'Remover a barra de tarefas',
            ChangeCity: 'Mude o título e nome do jogador na cidade.',
            BlinkEvents: 'Não piscar botões de evento ao lado esquerdo.',
            FortTracker: 'Ocultar botão da batalha de forte.',
            FriendsPop: 'Ocultar janela de amigos online.',
          },
          settings1: 'Configurações',
          settings2: 'Configurações e Janela de Informações',
          ghosttown2: 'Abrir Cidade Fantasma',
          ghosttown3: 'Abrir Cidade Fantasma e Centralizar no Mapa',
          indiantown2: 'Abrir Vila Ingígena',
          indiantown3: 'Abrir Vila Indígena e Centralizar no Mapa',
          openmarket: 'Mercado',
          opentrader: 'Abrir Mercador Ambulante',
          forum: 'Fórum da Cidade',
          newsets: 'Novos Sets Adicionados ao Script',
          chooseItems: 'Escolha os Itens',
          remindHover: 'Receber notificação quando um item puder ser usado novamente.',
          remindReady: 'Pronto para recolher.',
          skipHover: 'Pular janelas de confirmação ao abrir algumas caixas e itens.',
          skipDone: 'Você ganhou:',
          info: 'Informação',
          contact: 'Contato',
          chooseLang: 'Escolhe idioma',
          features: 'Características',
          name: 'Nome',
          save: 'Salvar',
          saveMessage: 'Salvo com sucesso!',
          saveMessage2: 'Configurações salvas. Algumas mudanças só apareceram quando atualizar a janela.',
          setbonus2: 'Informações sobre o bônus do set',
          bonussearch2: 'Find items by bonus',
          frame2: 'Páginas da Web Úteis',
          npclocator2: 'Find quest givers on the map',
          choose: 'Clique no Chapéu para começar.',
          items: 'Itens',
          parts: 'Partes',
          showItems: 'Mostrar os itens definidos no seu saco.',
          noItems: 'Nenhum item no seu inventário foi encontrado. Clique novamente com a tecla CTRL para mostrar no TW-Calc.',
          ownSets: 'Apenas possui conjuntos.',
          switchWeapon: 'Alternar entre arma de fogo e arma de vigor.',
          selectBonus: 'Selecionar bônus',
          resetB: 'Resetar',
          body: 'Roupas',
          right_arm: 'Armas',
          animal: 'Cavalo & Sela',
          rest: 'Outros',
          buff: 'Buffs',
          refresh: 'Atualizar',
          noFriends: 'Sem Amigos',
          reward: 'Recompensa',
          allprofessions: 'Todas as Profissões',
          market1: 'Itens no Mercado',
          market2: 'Há itens e dinheiro no mercado, o que você quer recolher?',
          all: 'Os dois',
          onlyBids: 'Apenas Lance',
          nothing: 'Nada',
          worldwide: 'No mundo todo',
          alliance: 'Aliança',
          town: 'Cidade',
          level: 'Nível',
          duelLevel: 'Nivel de Duelo',
          exp: 'Experiência',
          distance: 'Distância',
          startduel: 'Desafiar num Duelo',
          centerMap: 'Centralizar Mapa',
          popup: 'Bônus de Habilidade do Oponente',
          damage: 'Danificar',
          duelmap: 'Mapa de Duelo',
          duelradius: 'Raio de Duelo',
          minutes: 'Minutos',
          hour: '1 hora',
          hours: 'horas',
          searchOpp: 'Pesquisar Oponentes',
          amount: 'Morto',
          not_dead_amount: 'Vivo',
          duellevel: 'Nível',
          pStatus: 'Status',
          sortBy: 'Ordenar por:',
          tooLow: 'Nível de duelo muito baixo.',
          tooHigh: 'Nível de duelo muito alto',
          ownTown: 'Membro da sua Cidade',
          attackable: 'Mostrar apenas jogadores atacáveis',
          youKO: 'You have duel protection',
          attDl: 'Attackable duelling levels',
          duelxp: 'Current duel experience',
          logout: 'Sair',
          accNfin: 'Aceitar e completar quest.',
          onWiki: 'Abrir quest na janela wi-ki',
          longerName: 'O nome deve ter mais de 2 caracteres.',
          loading: 'Carregando...',
          rename: 'Renomear',
          newName: 'Escolha um novo nome de conjunto',
          used: 'Usado',
          renameWarning: 'Quando você renomeia um conjunto, você vai usá-lo e despir-lo novamente.<br>Você pode perder pontos de saúde durante o processo!',
          sellItems: 'Vender itens para o comerciante?',
          removeWorkNotis: 'Ocultar todas as notificações de Jobs',
          compInv: 'Clique em "cancelar" para mostrar apenas itens leiloáveis\n ou\nIntroduza outro URL de inventário para comparar',
          loginAll1: 'Login em todos os mundos',
          loginAll2: 'Carregue todos os seus mundos ativos em um clique',
          custom1: 'Personalizado',
          custom2: 'Sua lista de login persnalizada',
          edit: 'Editar',
          CT: {
            ColorWindowTitle: 'Set Color tchat',
            ColorWindowPreviewTxt: '*Clique na letra de uma mudança de cor',
            ColorWindowOkBtn: 'Aplicar',
            ColorWindowToDefaultBtn: 'Definido como padrão',
            ColorWindowThisTchatBtn: 'Definido para este',
            ColorWindowDefaultText: 'Selecione o tchat para repor as predefinições: ',
            ColorWindowBold: 'Em negrito',
            ColorWindowCaps: 'Capitalizados',
            ColorWindowFlip: 'Flip',
            ColorBtnTitle: '',
            ColorLoadListName: [
              'Incolor',
              'Insira um código de cor',
              'vermelho',
              'marrom',
              'roxo',
              'azul',
              'verde',
              'cor de rosa',
              'magenta',
              'gradiente violeta',
              'gradiente azul escuro',
              'gradiente verde',
              'gradiente vermelho',
              'gradiente de luz azul',
              'Pink Gradient',
              'gradiente luz verde',
              'rosa Gradiente',
              'gradiente claro vermelho'
            ],
            ColorLoadTitle: 'Clique para carregar outro código de cor<br>O código de cores atual é: ',
            ColorSaveEmpty: '[vazio]',
            CustomReady: 'Código válido',
            CustomNotReady: 'Inválido',
          },
          QIS: {
            adventure: '*Aventuras',
            work: '*Buffs Trabalho',
            duel: '*Buffs Duelo',
            energy: '*Buffs Energia',
            skill: '*Buffs Habilidade',
            fk: '*Buffs Batalha',
            speed: '*Buffs Velocidade',
            lp: '*Buffs Saúde',
            luckNmoney: '*Sorte & Dinheiro',
            workmoti: '*Motivação trabalho',
            duelmoti: '*Motivação duelo',
            experience: '*Experiência',
            special: '*Prêmio/especial',
            events: '*Eventos',
            chests: '*Abrir e desempacotar',
            equipment: '-Equipamento',
            products: '-Produtos',
            questitems: '-Items de aventura',
            craftitems: '-Ofício',
            recipes: '-Receitas',
            NAMED: 'NAMED',
            nothingFound: 'Nenhum item deste tipo encontrado!',
          },
          NPC: {
            loading: 'Atualizar empregadores atuais',
            title: 'Localizador de empregadores',
            chooseNpc: 'Selecionar empregador',
            yourposition: 'Minha posição',
            questgiver: 'Empregador',
            reload: 'Atualizar todos os empregadores',
          },
          BS: {
            hero: 'HERO',
            heroT: 'Number of shots (taken & dodged) per 1000 HPs',
            rate: 'Rate',
            hitsTaken: 'Hits taken',
            dodgedShots: 'Dodged shots',
            startHP: 'Start HP',
            survivor: 'SURVIVOR',
            survivorT: 'Survivor with the fewest HPs at the end of the fort battle',
            endHP: 'End HP',
            sniper: 'SNIPER',
            sniperT: 'Number of successful hits (percentage) in relation to all shots fired',
            rateP: 'Rate(%)',
            hitCount: 'Hit count',
            missedShots: 'Missed shots',
            matrix: 'MATRIX',
            matrixT: 'Number of doged shots (percentage) in relation to all shots (taken & dodged)',
            terminator: 'TERMINATOR',
            terminatorT: 'Number of KOs (percentage) in relation to the successful hits',
            KOs: 'KOs',
            ranking: 'Ranking',
            statsTitle: 'Fort battle statistics',
            designation: 'Designation',
            attack: 'Attack',
            defense: 'Defense',
            difference: 'Difference',
            statistics: 'Statistics',
            code: 'Code',
            goBack: 'Go back',
            starsTitle: 'The stars of the battle',
            title: 'Title',
            name: 'Name',
            details: 'Details',
            start: ' HP - Start: ',
            end: ' - End: ',
            damageTaken: ' - Damage taken: ',
            avgHP: ' - HP per fighter: ',
            total: 'Total ',
            average: 'Average ',
            HP: 'HP',
            damage: 'Damage',
            avgDamage: 'Average damage',
            avgDamageMax: 'Average max damage',
            avgWeaponDamage: 'Average weapon damage',
            avgWeaponDamageMax: 'Weapon damage max',
          },
          KoM: {
            success: 'Classificação é dada!',
            error: 'Ocorreu um erro',
            showPlayerOnMap: 'Mostra jogador no mapa',
            showTown: 'Mostrar visualização da cidade',
            showAlly: 'Mostra alliança',
            showFort: 'Mostrar vista geral do forte',
            showBattle: 'Mostrar campo de batalha',
            atFort: 'No forte',
            nearFort: 'Perto do forte',
            notFort: 'Não está no forte',
            evaluated: 'Avaliar jogador',
            started: 'A batalha está a decorrer agora',
            remindAlly: 'Relembre os membros da aliança, que ainda não participaram',
            where: 'Onde',
            when: 'Quando',
            att: 'Atacantes',
            def: 'Defensores',
            nodata: 'Não é possível carregar as informações para a classificar o forte',
            getData: 'A carregar informações de classificação',
            errorTimeout: 'O carregamento demorou demasiado tempo',
            ascaptain: 'Promover a capitão',
            assergeant: 'Nomear como sargento',
            asprivate: 'Nomear para soldado raso',
            asrecruit: 'Nomear para recruta',
            asreservist: 'Nomear como reservista',
            astraitor: 'Marcar como traidor',
            youcant: 'Não é possível dar patente a jogadores<br>com patente igual ou superior.',
            position: 'Posição',
            pos_undefined: 'Nenhuma posição',
            notown: 'No town',
            noally: 'Nome da Aliança',
            damage: 'Dano',
            flag: 'Bandiera',
            inside: 'Dentro da forte',
            sectors: {
              undef: 'Não há posição de partida',
              0: 'sector superior esquerdo',
              1: 'sector centro esquerda',
              2: 'sector inferior esquerdo',
              3: 'sector inferior central',
              4: 'sector inferior direito',
              5: 'sector centro direita',
              6: 'sector superior direito',
              7: 'torre dos Aventureiros',
              8: 'torre dos Pistoleiros ',
              9: 'torre dos soldados',
              10: 'torre dos Trabalhadores',
              11: 'Quartel ',
              12: 'Armazém',
              13: 'Quartel Geral ',
              14: 'Muro norte',
              15: 'Muro sul',
              16: 'Muro esquerdo',
              17: 'Muro direito',
              18: 'Portão',
              19: 'Bandeira',
            },
          },
        },
        it: {
          language: 'Italian (italiano)',
          ApiGui1: 'Questo script raccoglie molte funzionalità utili a semplificarti la vita in The West.<br>Ulteriori informazioni',
          ApiGui2: 'Apri la pagina dello script',
          Feat: {
            ColorTchat: '%0 Adds new features to the chat. Colored text, Emojis 🐧🎉 etc.',
            QuickItemsSearch: '%0 Search for buff categories and sets in your inventory',
            MarketBestBids: '%0 Colors the auctions based on the price %1 Green %2 Bid is lower than the purchase price %3 Black %4 Bid is equal to the purchase price %5 Blue %6 Bid is between 100% and 200% of the purchase price %7 Red %8 Bid is more than 200%">',
            BattleStars: '%0 Additional stats in the fort battle report',
            KickoMatic: '%0 Helpful to rank players before a fort battle',
            DuelMap: 'Aggiungi la scheda Mappa duelli nella finestra Duelli',
            MarkDaily: 'Evidenzia il bonus login del 5° giorno per non dimenticarlo',
            MarketMessage: 'Ricevi una notifica quando ci sono oggetti o soldi da ritirare al mercato della città dove ti trovi in quel momento',
            AchievHide: 'Nascondi i Successi completati nella rispettiva finestra di gioco',
            RecipeMarket: 'Migliora l\'organizzazione delle ricette al mercato',
            MoveJobs: 'Sposta la coda dei lavori leggermente più a sinistra',
            InstantQuest: 'Se tutti i requisiti sono soddisfatti, permetti di concludere le missioni istantaneamente',
            QuestWiki: 'Aggiungi un link alla wiki italiana (ove disponibile) nelle finestre delle missioni',
            CityTravel: 'Mostra la distanza verso le città nella lavagna',
            BetterSheriff: 'Aggiungi una nuova scheda nella finestra dello sceriffo per vedere tutte le possibili taglie',
            ChatProfessions: 'Mostra la professione a fianco del nome dei giocatori nella lista della chat',
            QuestBookSearch: 'Aggiungi una casella di ricerca nella scheda "Completate" del libro missioni',
            MarketRights: 'Mostra se le offerte del mercato sono pubbliche oppure per alleati\concittadini',
            EquipManagerPlus: 'Migliora la finestra "Gestione equipaggiamento" nell\'inventario',
            ShortPopups: 'Rendi i tooltip degli oggetti più corti',
            HideNotis: 'Aggiungi un pulsante per nascondere le notifiche dei lavori nella relativa barra',
            JobProducts: 'Nel tooltip dei prodotti mostra quanti se ne possiede in inventario',
            MapDistance: 'Mostra la distanza in miglia accanto al tempo di viaggio',
            TraderSell: 'Consenti di vendere oggetti in quantità multipla ai negozi\mercante ambulante',
            TouchControl: 'Abilità il controllo touch nel browser mobile',
            FbRankingChar: 'Show the character class in the fortbattle world ranking',
            DuelXpCalc: 'Show the duel experience in player profiles',
            Logout: 'Aggiungi sul lato destro dello schermo un pulsante disconnetti',
            Statusbar: 'Nascondi la barra degli incarichi',
            ChangeCity: 'Nel municipio, inverti il titolo e il nome del giocatore',
            BlinkEvents: 'Termina il lampeggiamento delle icone degli eventi e della fiera nella barra delle notifiche',
            FortTracker: 'Disattiva l\'icona di notifica della battaglia al forte',
            FriendsPop: 'Nascondi i pop-up "Amico online"',
          },
          settings1: 'Apri le impostazioni',
          settings2: 'Apri le impostazioni e la finestra di informazioni',
          ghosttown2: 'Apri la Città Fantasma',
          ghosttown3: 'Apri la Città Fantasma e centra la mappa',
          indiantown2: 'Apri il Villaggio Indiano',
          indiantown3: 'Apri il Villaggio Indiano e centra la mappa',
          openmarket: 'Apri il mercato',
          opentrader: 'Abrir Mercante',
          forum: 'Apri il forum città',
          newsets: 'Nuovi set sono stati aggiunti allo script',
          chooseItems: 'Scegli gli oggetti',
          remindHover: 'Ricevi una notifica quando un oggetto può essere di nuovo utilizzato. Scegli qui gli oggetti di interesse.',
          remindReady: 'Pronto per essere collezionato',
          skipHover: 'Salta i messaggi di conferma e risultato quando apri alcuni oggetti. Scegli qui gli oggetti di interesse',
          skipDone: 'Ottieni',
          info: 'Informazioni',
          contact: 'Contatti',
          chooseLang: 'Scegli lingua',
          features: 'Caratteristiche',
          name: 'Nome',
          save: 'Salva',
          saveMessage: 'Salvato con successo',
          saveMessage2: 'Impostazioni salvate. Aggiorna la pagina per renderle effettive.',
          setbonus2: 'Informazioni sui bonus set',
          bonussearch2: 'Find items by bonus',
          frame2: 'Pagine internet di aiuto',
          npclocator2: 'Find quest givers on the map',
          choose: 'Clicca sul cappello per iniziare',
          items: 'oggetti',
          parts: 'parti',
          showItems: 'Mostra i set oggetti nel tuo inventario',
          noItems: 'Nessun oggetto trovato nel tuo inventario. Cliccaci nuovamente tenendo premuto CTRL per mostrarlo su TW-Calc.',
          ownSets: 'Solo propri set',
          switchWeapon: 'Inverti armi da fuoco e da contusione',
          selectBonus: 'Scegli i bonus',
          resetB: 'Reset',
          body: 'Abiti',
          right_arm: 'Armi',
          animal: 'Cavallo e oggetto',
          rest: 'Altro',
          buff: 'Buffs',
          refresh: 'Aggiorna',
          noFriends: 'Nessun amico',
          reward: 'Ricompensa',
          allprofessions: 'Tutte le professioni',
          market1: 'Oggetti al mercato',
          market2: 'Ci sono oggetti/soldi da ritirare in questo mercato. Vuoi farlo?',
          all: 'Tutto',
          onlyBids: 'Solo aste',
          nothing: 'Niente',
          worldwide: 'Mondiale',
          alliance: 'Alleanza',
          town: 'Città',
          level: 'Livello',
          duelLevel: 'Livello duello',
          exp: 'Esperienza',
          distance: 'Distanza',
          startduel: 'Inizia duello',
          centerMap: 'Centra mappa',
          popup: 'Abilità bonus dell\'avversario',
          damage: 'Danno',
          duelmap: 'Mappa duelli',
          duelradius: 'Raggio duelli',
          minutes: 'minuti',
          hour: '1 ora',
          hours: 'ore',
          searchOpp: 'Cerca avversari',
          amount: 'Morto',
          not_dead_amount: 'Vivo',
          duellevel: 'Liv',
          pStatus: 'Stato',
          sortBy: 'Ordina per',
          tooLow: 'Livello duello avversario troppo basso',
          tooHigh: 'Livello duello avversario troppo alto',
          ownTown: 'Membro della tua città',
          attackable: 'Mostra solo i giocatori duellabili',
          youKO: 'You have duel protection',
          attDl: 'Attackable duelling levels',
          duelxp: 'Current duel experience',
          logout: 'Disconneti',
          accNfin: 'Accetta e completa missione',
          onWiki: 'Mostra la missione nella Wiki',
          longerName: 'Il nome deve essere più lungo di 2 caratteri',
          loading: 'Caricamento...',
          rename: 'Rinomina',
          newName: 'Scegli un nuovo nome set',
          used: 'Usato',
          renameWarning: 'Quando rinomini un set lo indosserai e svestirai di nuovo.<br>In questo processo potresti perdere dei punti vita!',
          sellItems: 'Vuoi vendere questi oggetti?',
          removeWorkNotis: 'Nascondi tutte le notifiche dei lavori',
          compInv: 'Clicca su "cancella" per mostrare solo gli oggetti vendibili all\'asta\n oppure\nInserisci altro URL di inventari per confrontare',
          loginAll1: 'Fai login in tutti i mondi',
          loginAll2: 'Carica tutti i mondi in cui sei attivo con un clic',
          custom1: 'Personalizza',
          custom2: 'La tua lista login personalizzata',
          edit: 'Modifica',
          CT: {
            ColorWindowTitle: 'Color tchat setting',
            ColorWindowPreviewTxt: '*Click on the letters to change color',
            ColorWindowOkBtn: 'Apply',
            ColorWindowToDefaultBtn: 'Set to default',
            ColorWindowThisTchatBtn: 'Set to this',
            ColorWindowDefaultText: 'Select the tchat for reset to default: ',
            ColorWindowBold: 'Bold',
            ColorWindowCaps: 'Capitalized',
            ColorWindowFlip: 'Flip',
            ColorBtnTitle: '',
            ColorLoadListName: [
              'No color',
              'Enter a color code',
              'red',
              'brown',
              'purple',
              'blue',
              'green',
              'pink',
              'magenta',
              'violet gradient',
              'degraded dark blue',
              'green gradient',
              'degraded red',
              'blue gradient light',
              'degraded pink',
              'light green gradient',
              'degraded pink',
              'red gradient light'
            ],
            ColorLoadTitle: 'Click to load another color code<br>The current color code is: ',
            ColorSaveEmpty: '[empty]',
            CustomReady: 'Valid Code',
            CustomNotReady: 'Invalid Code',
          },
          QIS: {
            adventure: '*Avventure',
            work: '*Bonus Lavoro',
            duel: '*Bonus Duello',
            energy: '*Bonus Energia',
            skill: '*Bonus Abilità',
            fk: '*Bonus Forte',
            speed: '*Bonus Velocità',
            lp: '*Bonus Punti Vita',
            luckNmoney: '*Luck & money',
            workmoti: '*Motivazione lavoro',
            duelmoti: '*Motivazione duello',
            experience: '*Experience',
            special: '*Premio/speciale',
            events: '*Eventi',
            chests: '*Aprire e decomprimere',
            equipment: '-Attrezzatura',
            products: '-Prodotti',
            questitems: '-Oggetti missione',
            craftitems: '-Produci',
            recipes: '-Ricette',
            NAMED: 'NAMED',
            nothingFound: 'Non è stato trovato nulla!',
          },
          NPC: {
            loading: 'Caricando gli attuali mandanti',
            title: 'Posizione dei mandanti missione',
            chooseNpc: 'Scegli mandante',
            yourposition: 'La tua posizione',
            questgiver: 'Mandante',
            reload: 'Ricarica tutti i mandanti missione',
          },
          BS: {
            hero: 'HERO',
            heroT: 'Number of shots (taken & dodged) per 1000 HPs',
            rate: 'Rate',
            hitsTaken: 'Hits taken',
            dodgedShots: 'Dodged shots',
            startHP: 'Start HP',
            survivor: 'SURVIVOR',
            survivorT: 'Survivor with the fewest HPs at the end of the fort battle',
            endHP: 'End HP',
            sniper: 'SNIPER',
            sniperT: 'Number of successful hits (percentage) in relation to all shots fired',
            rateP: 'Rate(%)',
            hitCount: 'Hit count',
            missedShots: 'Missed shots',
            matrix: 'MATRIX',
            matrixT: 'Number of doged shots (percentage) in relation to all shots (taken & dodged)',
            terminator: 'TERMINATOR',
            terminatorT: 'Number of KOs (percentage) in relation to the successful hits',
            KOs: 'KOs',
            ranking: 'Ranking',
            statsTitle: 'Fort battle statistics',
            designation: 'Designation',
            attack: 'Attack',
            defense: 'Defense',
            difference: 'Difference',
            statistics: 'Statistics',
            code: 'Code',
            goBack: 'Go back',
            starsTitle: 'The stars of the battle',
            title: 'Title',
            name: 'Name',
            details: 'Details',
            start: ' HP - Start: ',
            end: ' - End: ',
            damageTaken: ' - Damage taken: ',
            avgHP: ' - HP per fighter: ',
            total: 'Total ',
            average: 'Average ',
            HP: 'HP',
            damage: 'Damage',
            avgDamage: 'Average damage',
            avgDamageMax: 'Average max damage',
            avgWeaponDamage: 'Average weapon damage',
            avgWeaponDamageMax: 'Weapon damage max',
          },
          KoM: {
            success: 'Il rango è stato dato!',
            error: 'Si e\' verificato un errore',
            showPlayerOnMap: 'Centra nella mappa',
            showTown: 'Mostra riepilogo città',
            showAlly: 'Mostra alleanza',
            showFort: 'Mostra panoramica forte',
            showBattle: 'Spettacolo campo di battaglia',
            atFort: 'Al forte',
            nearFort: 'Vicino al forte',
            notFort: 'Non al forte',
            evaluated: 'Valuta giocatore',
            started: 'La battaglia è in pieno svolgimento',
            remindAlly: 'Ricordare i membri dell alleanza, che non hanno ancora partecipato',
            where: 'Dove',
            when: 'Quando',
            att: 'Attaccanti',
            def: 'Difensori',
            nodata: 'Impossibile caricare le informazioni di rango per la fortezza',
            getData: 'Caricamento Informazioni rango',
            errorTimeout: 'Il caricamento ha richiesto troppo tempo',
            ascaptain: 'Promuovi a capitano',
            assergeant: 'Nomina sergente',
            asprivate: 'Nomina soldato semplice',
            asrecruit: 'Nomina recluta',
            asreservist: 'Nomina riservista',
            astraitor: 'Contrassegna come traditore',
            youcant: 'Non è possibile il reclutamento di giocatori<br>con rango uguale o superiore.',
            position: 'Posizione',
            pos_undefined: 'Nessuna posizione di partenza',
            notown: 'No town',
            noally: 'Nessuna alleanza',
            damage: 'Danno',
            flag: 'Bandiera',
            inside: 'All\'interno del forte',
            sectors: {
              undef: 'Nessuna posizione di partenza',
              0: ' -O1- Il settore superiore sinistro',
              1: ' -O2- Il settore centrale sinistro',
              2: ' -S1- Il settore in basso a sinistra',
              3: ' -S2- Il settore centrale',
              4: ' -S3- Il settore in basso a destra',
              5: ' -E2- Il settore centrale destro',
              6: ' -E1- Il settore superiore destro',
              7: 'Torre avventuriero',
              8: 'Torre duellante',
              9: 'Torre soldato',
              10: 'Torre lavoratore',
              11: 'Caserma',
              12: 'Magazzino',
              13: 'Quartier generale',
              14: 'Muro nord',
              15: 'Muro sud',
              16: 'Muro ovest',
              17: 'Muro est',
              18: 'Cancello',
              19: 'Bandiera',
            },
          },
        },
        fr: {
          language: 'French (français)',
          ApiGui1: 'This script contains many features to simplify your everyday life in The West.<br>More Informations',
          ApiGui2: 'Open script page',
          Feat: {
            ColorTchat: '%0 Adds new features to the chat. Colored text, Emojis 🐧🎉 etc.',
            QuickItemsSearch: '%0 Search for buff categories and sets in your inventory',
            MarketBestBids: '%0 Colors the auctions based on the price %1 Green %2 Bid is lower than the purchase price %3 Black %4 Bid is equal to the purchase price %5 Blue %6 Bid is between 100% and 200% of the purchase price %7 Red %8 Bid is more than 200%">',
            BattleStars: '%0 Additional stats in the fort battle report',
            KickoMatic: '%0 Helpful to rank players before a fort battle',
            DuelMap: 'Add a duel map to the duel window',
            MarkDaily: 'Highlight daily login bonus on day 5 to not miss it',
            MarketMessage: 'Get a message when there are items or money to pick up on actual market',
            AchievHide: 'Hide completed achievements in achievements window',
            RecipeMarket: 'Improve the purchase of recipes on market',
            MoveJobs: 'Move the queued jobs a bit to the left',
            InstantQuest: 'Complete the quest instantly if all requirements are done',
            QuestWiki: 'Add a link in the quest window to show the quest on the wiki page',
            CityTravel: 'Show the travel time to the towns in the blackboard',
            BetterSheriff: 'Add a new tab in the sheriff window to see all possible bounties',
            ChatProfessions: 'Show the crafting profession of the players in the chat list',
            QuestBookSearch: 'Search for solved quests in the quest book',
            MarketRights: 'Show if market offers are public or only for alliance/town members',
            EquipManagerPlus: 'Improve the equipment manager in the inventory',
            ShortPopups: 'Make the item pop-ups shorter',
            HideNotis: 'Add a button to hide the job notifications on the left side',
            JobProducts: 'Show in the job pop-up how many products you already have in your inventory',
            MapDistance: ' Show the number of miles next to the travel time',
            TraderSell: 'Sell multiple items at once to the trader',
            TouchControl: 'Enable touch control on your mobile browser',
            FbRankingChar: 'Show the character class in the fortbattle world ranking',
            DuelXpCalc: 'Show the duel experience in player profiles',
            Logout: 'Add a logout button on the right side',
            Statusbar: 'Remove the taskbar',
            ChangeCity: 'Switch title and player name in the town hall',
            BlinkEvents: 'Stop the blinking of the event, County Fair buttons on the left side',
            FortTracker: 'Turn off fort battle reminder',
            FriendsPop: 'Hide "Friend online" pop-ups',
          },
          settings1: 'Open settings',
          settings2: 'Open settings and information window',
          ghosttown2: 'Aller à la ville abandonné',
          ghosttown3: 'Open ghost town and center it on map',
          indiantown2: 'Aller au village de Waupee',
          indiantown3: 'Open Indian village and center it on map',
          openmarket: 'Ouvrir le marché',
          opentrader: 'Ouvrir le marchand ambulant',
          forum: 'Ouvrir le forum',
          newsets: 'New sets are added to the script',
          chooseItems: 'Choose the items',
          remindHover: 'You get a notification when an item can be used again. Here you can choose these items.',
          remindReady: 'Ready to collect',
          skipHover: 'Skip the confirmation and result messages when you open some bags. Here you can choose these bags',
          skipDone: 'You get',
          info: 'Info',
          contact: 'Contact',
          chooseLang: 'Choisissez la langue',
          features: 'Features',
          name: 'Name',
          save: 'Sauvegarder',
          saveMessage: 'Enregistrer avec succès',
          saveMessage2: 'Settings saved. Some changes need a refresh of the game window.',
          setbonus2: 'Informations about the set bonuses',
          bonussearch2: 'Find items by bonus',
          frame2: 'Helpful web pages',
          npclocator2: 'Find quest givers on the map',
          choose: 'Click on the hat to get started',
          items: 'items',
          parts: 'parts',
          showItems: 'Show the set items in your Bag',
          noItems: 'No items in your inventory found. Click again with CTRL to show it on TW-Calc.',
          ownSets: 'Only own sets',
          switchWeapon: 'Switch between firearm and melee weapon',
          selectBonus: 'Select bonuses',
          resetB: 'Reset',
          body: 'Clothing',
          right_arm: 'Weapons',
          animal: 'Horse & Yield',
          rest: 'Other',
          buff: 'Buffs',
          refresh: 'Refresh',
          noFriends: 'No Friends',
          reward: 'Reward',
          allprofessions: 'All Professions',
          market1: 'Items on market',
          market2: 'There are items/money on this market. What do you want to pick up?',
          all: 'All',
          onlyBids: 'Only bids',
          nothing: 'Nothing',
          worldwide: 'Worldwide',
          alliance: 'Alliance',
          town: 'Town',
          level: 'Level',
          duelLevel: 'Duelling level',
          exp: 'Exp',
          distance: 'Distance',
          startduel: 'Start Duel',
          centerMap: 'Center map',
          popup: 'The opponent\'s skill bonus',
          damage: 'Damage',
          duelmap: 'Duel map',
          duelradius: 'Duel radius',
          minutes: 'minutes',
          hour: '1 hour',
          hours: 'hours',
          searchOpp: 'Search for opponents',
          amount: 'Dead',
          not_dead_amount: 'Alive',
          duellevel: 'Lvl',
          pStatus: 'Status',
          sortBy: 'Sort by',
          tooLow: 'Too low duelling level of opponent',
          tooHigh: 'Too high duelling level of opponent',
          ownTown: 'Member of your town',
          attackable: 'Show only attackable players',
          youKO: 'You have duel protection',
          attDl: 'Attackable duelling levels',
          duelxp: 'Current duel experience',
          logout: 'Logout',
          accNfin: 'Accept & complete quest',
          onWiki: 'Show the quest on the wiki',
          longerName: 'Name must be longer than 2 characters',
          loading: 'Loading...',
          rename: 'Rename',
          newName: 'Choose a new set name',
          used: 'Used',
          renameWarning: 'When you rename a set, you will wear it and undress it again.<br>You may loose health points during the process!',
          sellItems: 'Sell items to the trader?',
          removeWorkNotis: 'Hide all job notifications',
          compInv: 'Click on "cancel" to just show only auctionable items\n or\nEnter other inventory URL to compare',
          loginAll1: 'Login all worlds',
          loginAll2: 'Load all your active worlds with one click',
          custom1: 'Custom',
          custom2: 'Your custom login list',
          edit: 'Edit',
          CT: {
            ColorWindowTitle: 'Configurer Color tchat',
            ColorWindowPreviewTxt: '*Clickez sur la lettre à changer de couleur',
            ColorWindowOkBtn: 'Appliquer',
            ColorWindowToDefaultBtn: 'Par défaut',
            ColorWindowThisTchatBtn: 'Pour se tchat',
            ColorWindowDefaultText: 'Sélectionnez les tchat à Remettre par défaut:',
            ColorWindowBold: 'En gras',
            ColorWindowCaps: 'En majuscule',
            ColorWindowFlip: 'Flip',
            ColorBtnTitle: '',
            ColorLoadListName: [
              'Sans couleur',
              'Entrer des couleurs',
              'rouge',
              'marron',
              'violet',
              'bleu',
              'vert',
              'rose',
              'magenta',
              'dégradé violet',
              'dégradé bleu foncé',
              'dégradé vert',
              'dégradé rouge',
              'dégradé bleu clair',
              'dégradé rose',
              'dégradé vert clair',
              'dégradé rose clair',
              'dégradé rouge clair'
            ],
            ColorLoadTitle: 'Clickez pour charger un autre code couleur<br>Le code couleur actuel est: ',
            ColorSaveEmpty: '[vide]',
            CustomReady: 'Code valide',
            CustomNotReady: 'Non valide',
          },
          QIS: {
            adventure: '*Aventures',
            work: '*Travail',
            duel: '*Duels',
            energy: '*Bonus de repos',
            skill: '*Aptitudes',
            fk: '*Fort bataille',
            speed: '*Vitesse',
            lp: '*Points de vie bonus',
            luckNmoney: '*Luck & money',
            workmoti: '*Motivation travail',
            duelmoti: '*Motivation duel',
            experience: '*Experience',
            special: '*Prime/spéciale',
            events: '*Événements',
            chests: '*Ouvrir et déballer',
            equipment: '-Équipement',
            products: '-Produits',
            questitems: '-Objets de quête',
            craftitems: '-Artisanat',
            recipes: '-Recettes',
            NAMED: 'NAMED',
            nothingFound: 'Pas d\'objets de cette sorte trouvé!',
          },
          NPC: {
            loading: 'Loading current quest givers',
            title: 'Quest giver locator',
            chooseNpc: 'Select employer',
            yourposition: 'Your position',
            questgiver: 'Quest giver',
            reload: 'Reload all quest givers',
          },
          BS: {
            hero: 'HÉROS',
            heroT: 'Taux du nombre de tirs ciblés (évités + reçus) par rapport aux PV de départ',
            rate: 'Taux',
            hitsTaken: 'Coups réçus',
            dodgedShots: 'Tirs esquivés',
            startHP: 'PV Début',
            survivor: 'SURVIVANT',
            survivorT: 'Celui qui finit avec le moins de pv',
            endHP: 'PV Fin',
            sniper: 'TIREUR D\'ÉLITE',
            sniperT: 'Pourcentage de tirs réussis par rapport aux total de tirs effectués',
            rateP: 'Taux(%)',
            hitCount: 'Coups réussis',
            missedShots: 'Tirs ratés',
            matrix: 'MATRIX',
            matrixT: 'Pourcentage de tirs évités par rapport aux total de tirs ciblés',
            terminator: 'TERMINATOR',
            terminatorT: 'Pourcentage du nombre de ko par rapport aux total des tirs touchés',
            KOs: 'Ko effectués',
            ranking: 'Classement',
            statsTitle: 'Statistiques de la bataille',
            designation: 'Désignation',
            attack: 'Attaque',
            defense: 'Défense',
            difference: 'Différence',
            statistics: 'Statistique',
            code: 'Code',
            goBack: 'Retour',
            starsTitle: 'Les Stars de la bataille',
            title: 'Titre',
            name: 'Nom',
            details: 'Détails',
            start: ' PV - Début: ',
            end: ' - Fin: ',
            damageTaken: ' - Dégâts reçus: ',
            avgHP: ' - Moy PV: ',
            total: 'Total ',
            average: 'Moyenne ',
            HP: 'PV',
            damage: 'Dégats',
            avgDamage: 'Dommages moyen',
            avgDamageMax: 'Dommages max moyen',
            avgWeaponDamage: 'Dommages arme moyen',
            avgWeaponDamageMax: 'Dommages arme max',
          },
          KoM: {
            success: 'Rank is given!',
            error: 'An error has occured',
            showPlayerOnMap: 'Show player on map',
            showTown: 'Show town overview',
            showAlly: 'Show alliance overview',
            showFort: 'Show fort overview',
            showBattle: 'Show battlefield',
            atFort: 'At the fort',
            nearFort: 'Nearby the fort',
            notFort: 'Not at the fort',
            evaluated: 'Number of evaluated players',
            started: 'The battle is taking place right now',
            remindAlly: 'Remind ally members, who haven\'t participated yet',
            where: 'Where',
            when: 'When',
            att: 'Attackers',
            def: 'Defenders',
            nodata: 'Couldn\'t load rank information for the fort',
            getData: 'Loading rank information',
            errorTimeout: 'The loading took too much time',
            ascaptain: 'Promote to captain',
            assergeant: 'Appoint as sergeant',
            asprivate: 'Appoint as private',
            asrecruit: 'Appoint as recruit',
            asreservist: 'Appoint as reservist',
            astraitor: 'Mark as traitor',
            youcant: 'You can\'t demote fighters of<br>the same or higher rank.',
            position: 'Position',
            pos_undefined: 'No starting position',
            notown: 'No town',
            noally: 'No alliance',
            damage: 'Damage',
            flag: 'Flag',
            inside: 'Inside the fort',
            sectors: {
              undef: 'No starting position',
              0: 'The upper-left sector',
              1: 'The lower-left sector',
              2: 'The central left sector',
              3: 'The lower central sector',
              4: 'The central right sector',
              5: 'The lower-right sector',
              6: 'The upper-right sector',
              7: 'Adventurer\'s tower',
              8: 'Dueller\'s tower',
              9: 'Soldier\'s tower',
              10: 'Worker\'s tower',
              11: 'Barracks',
              12: 'Resource stock',
              13: 'Headquarters',
              14: 'North wall',
              15: 'South wall',
              16: 'West wall',
              17: 'East wall',
              18: 'Gate',
              19: 'Flag',
            },
          },
        },
        cs: {
          language: 'Czech (čeština)',
          ApiGui1: 'Tento skript obsahuje mnoho funkcí pro zjednodušení vašeho každodenního života na The West. <br> Další informace',
          ApiGui2: 'Otevřít stránku skriptu',
          Feat: {
            ColorTchat: '%0 Přidá do chatu nové funkce. Barevný text, Emotikony 🐧🎉 a další.',
            QuickItemsSearch: '%0 Vyhledá doplňováky v inventáři',
            MarketBestBids: '%0 Vybarví aukce na základě ceny %1 Zelená %2 Nabídka je nižší než kupní cena %3 Černá %4 Nabídka se rovná kupní ceně %5 Modrá %6 Nabídka je medzi 100% a 200% kupní ceny %7 Červená %8 Nabídka je vyšší než 200%">',
            BattleStars: '%0 Ďalší statistiky v oznámení z bitvy o pevnost',
            KickoMatic: '%0 Užitečné pro rekrut hráčů v bitvě o pevnost',
            DuelMap: 'Přidá duelovou mapu do okna duelů',
            MarkDaily: 'Zvýraznit denní bonus za přihlásení, v pátý den, abyste ho nevynechali',
            MarketMessage: 'Zobrazit zprávu, když jsou věci nebo peníze, které lze vyzvednout na trhu ve měste, kde jse právě nácházíte',
            AchievHide: 'Skrýt dokončené úspěchy v okně úspěchů',
            RecipeMarket: 'Zlepšit nákup receptů na trhu',
            MoveJobs: 'Přesunout úlohy (práce) ve frontě o kousek doleva',
            InstantQuest: 'Pokud jsou splněny všechny požadavky, okamžitě dokončit úkol',
            QuestWiki: 'Přidat odkaz do okna úkolů pro zobrazení úkolu wiki',
            CityTravel: 'Na tabuli zobrazit čas cesty do měst',
            BetterSheriff: 'Přidat do okna šerifa novou kartu pro zobrazení všech dostupních zatykačů',
            ChatProfessions: 'Zobrazit řemeslo hráčů v seznamu chatu',
            QuestBookSearch: 'Přidat vyhledávaní v knize úkolů',
            MarketRights: 'Zobrazit zda jsou tržní nabídky veřejné nebo pouze pro členy aliance / města',
            EquipManagerPlus: 'Vylepšit "Sklad pro vybavení" v inventáři',
            ShortPopups: 'Kratší pop-upy předmětů',
            HideNotis: 'Přidat tlačítko pro skrytí oznámení z prací na levé straně',
            JobProducts: 'Zobrazit v pop-upe práce kolik produktů z dané práce vlastníte',
            MapDistance: 'Zobrazit počet mil vedle času cesty',
            TraderSell: 'Prodat obchodníkovi více položek najednou',
            TouchControl: 'V mobilním prohlížeči povolit dotykové ovládání',
            FbRankingChar: 'Zobrazit třídu postavy v žebříčku bitev o pevnost',
            DuelXpCalc: 'Zobrazit duelové zkušenosti v profile hráče',
            Logout: 'Přidat tlačítko pro odhlášení na pravé straně',
            Statusbar: 'Odstranit taskbar',
            ChangeCity: 'Přehodit titul a jméno hráče v okně radnice',
            BlinkEvents: 'Zastavit blikání tlačítka cirkusu na levé straně',
            FortTracker: 'Vypnout připomínáni bitvy o pevnost',
            FriendsPop: 'Nezobrazovat "Přítel online" pop-up',
          },
          settings1: 'Otevřít nastavení',
          settings2: 'Otevřít nastavení a okno s informacemi',
          ghosttown2: 'Město Duchů',
          ghosttown3: 'Otevřít Město Duchů a zobrazit ho na mapě',
          indiantown2: 'Indiánská rezervace',
          indiantown3: 'Otevřít indiánskou rezervaci a zobrazit ji na mapě',
          openmarket: 'Otevřít trh',
          opentrader: 'Otevřít podomního obchodníka',
          forum: 'Otevřít fórum',
          newsets: 'Nově přidané sety',
          chooseItems: 'Vyberte itemy',
          remindHover: 'Obdržíte upozornění, když lze itemy znovu použít. Zde si můžete vybrat tyto itemy.',
          remindReady: 'Připravené na použití',
          skipHover: 'Při otevírání tašky přeskočit potvrzovací a výsledné zprávy. Zde si můžete vybrat tyto tašky.',
          skipDone: 'Dostali jste',
          info: 'Info',
          contact: 'Kontakt',
          chooseLang: 'Vyberte jazyk',
          features: 'Funkce',
          name: 'Jméno',
          save: 'Uložit',
          saveMessage: 'Úspěšně uloženo',
          saveMessage2: 'Nastavení uloženo. Některé změny vyžadují reload hry.',
          setbonus2: 'Informace o bonusech',
          bonussearch2: 'Vyhledat itemy podle bonusu',
          frame2: 'Užitečné stránky',
          npclocator2: 'Najít zadavate úkolů na mapě',
          choose: 'Začněte kliknutím na klobouk',
          items: 'předměty',
          parts: 'části',
          showItems: 'Zobrazit předměty ze setu v inventáři',
          noItems: 'Ve vašem inventáři nebyly nalezeny žádné předměty. Klikněte znovu s CTRL pro zobrazení na TW-Calc.',
          ownSets: 'Jenom vlastněné sety',
          switchWeapon: 'Přepínání mezi střelnou zbraní a zbraní na blízko',
          selectBonus: 'Vybrat bonusy',
          resetB: 'Reset',
          body: 'Oblečení',
          right_arm: 'Zbraně',
          animal: 'Kůň & Produkt',
          rest: 'Ostatní',
          buff: 'Doplňováky',
          refresh: 'Obnovit',
          noFriends: 'Žádní přátelé',
          reward: 'Odměna',
          allprofessions: 'Všechny řemeslá',
          market1: 'Předměty na trhu',
          market2: 'Na tomto trhu jsou předměty / peníze. Co chcete vyzvednout?',
          all: 'Všechno',
          onlyBids: 'Jenom nabídky',
          nothing: 'Nic',
          worldwide: 'Světové',
          alliance: 'Aliance',
          town: 'Město',
          level: 'Level',
          duelLevel: 'Duelový level',
          exp: 'Xp',
          distance: 'Vzálenost',
          startduel: 'Začít Duel',
          centerMap: 'Centrovat pozici',
          popup: 'Bonusy soupeře',
          damage: 'Poškození',
          duelmap: 'Duelová mapa',
          duelradius: 'Okruh duelu',
          minutes: 'minuty',
          hour: '1 hodina',
          hours: 'hodiny',
          searchOpp: 'Hledat soupeře',
          amount: 'Mrtvý',
          not_dead_amount: 'Živý',
          duellevel: 'Lvl',
          pStatus: 'Status',
          sortBy: 'Seřadit podle',
          tooLow: 'Příliš nízká duelová úroveň soupeře',
          tooHigh: 'Příliš vysoká duelová úroveň soupeře',
          ownTown: 'Člen tvého města',
          attackable: 'Pouze dostupní soupeři',
          youKO: 'You have duel protection',
          attDl: 'Attackable duelling levels',
          duelxp: 'Aktuální duelové zkušenosti',
          logout: 'Odhlásit',
          accNfin: 'Přijmout a dokončit úkol',
          onWiki: 'Zobrazit úkol na wiki',
          longerName: 'Název musí být delší než 2 znaky',
          loading: 'Načítám...',
          rename: 'Přejmenovat',
          newName: 'Nové jméno setu',
          used: 'Použito',
          renameWarning: 'Když přejmenujete sadu, budete ji muset svléknout a obléci znovu. <br> Během procesu můžete ztratit body zdraví!',
          sellItems: 'Prodat předměty obchodníkovi?',
          removeWorkNotis: 'Skrýt všechna oznámení z prací',
          compInv: 'Kliknutím na tlačítko "zrušit" zobrazíte pouze dražitelné předměty\n nebo\nZadejte jinou adresu URL inventáře, který chcete porovnat',
          loginAll1: 'Přihlásit se do všech světů',
          loginAll2: 'Načíst všechny aktivní světy jedním kliknutím',
          custom1: 'Vlastní',
          custom2: 'Váš vlastní přihlašovací seznam',
          edit: 'Upravit',
          CT: {
            ColorWindowTitle: 'Color tchat nastavení',
            ColorWindowPreviewTxt: '*Kliknutím na písmena změníte barvu',
            ColorWindowOkBtn: 'Aplikovat',
            ColorWindowToDefaultBtn: 'Nastavit jako výchozí',
            ColorWindowThisTchatBtn: 'Nastavit tohle',
            ColorWindowDefaultText: 'Vyberte tchat pro reset na výchozí nastavení: ',
            ColorWindowBold: 'Tučné',
            ColorWindowCaps: 'Velká písmena',
            ColorWindowFlip: 'Překlopené',
            ColorBtnTitle: '',
            ColorLoadListName: [
              'Žádná barva',
              'Zadajte kód barvy',
              'červená',
              'hnědá',
              'fialová',
              'modrá',
              'zelená',
              'růžová',
              'purpurová',
              'fialový přechod',
              'degradovaná tmavě modrá',
              'zelený přechod',
              'degradovaná červená',
              'světle modrý přechod',
              'degradovaná růžová',
              'světle zelený přechod',
              'degradovaná růžová',
              'světle červený přechod'
            ],
            ColorLoadTitle: 'Klepnutím načtete jiný barevný kód<br>Aktuální barevný kód je: ',
            ColorSaveEmpty: '[prázdný]',
            CustomReady: 'Platný kód',
            CustomNotReady: 'Neplatný kód',
          },
          QIS: {
            adventure: '*Dobrodružství',
            work: '*Pracovní body',
            duel: '*Duely',
            energy: '*Energie',
            skill: '*Body schopností',
            fk: '*Bitvy',
            speed: '*Rychlost',
            lp: '*Body zdraví',
            luckNmoney: '*Štěstí & zárobek',
            workmoti: '*Pracovní motivace',
            duelmoti: '*Duelové motivace',
            experience: '*Zkušenosti',
            special: '*Prémium/špeciální',
            events: '*Eventy',
            chests: '*Něco k otevření',
            equipment: '-Vybavení',
            products: '-Produkty',
            questitems: '-Předměty k úkolu',
            craftitems: '-Předměty z remesel',
            recipes: '-Recepty',
            NAMED: 'NAMED',
            nothingFound: 'Nebyly nalezeny žádné položky tohoto typu!',
          },
          NPC: {
            loading: 'Načítání aktuálních zadávatelů',
            title: 'Vyhledávač zadávatelů',
            chooseNpc: 'vybrat zadavatele',
            yourposition: 'Vaše pozice',
            questgiver: 'Zadavatel ůkolů',
            reload: 'Znovu načíst všechny zadavatele',
          },
          BS: {
            hero: 'HRDINA',
            heroT: 'Počet zásahů (obdržené & vyhnuté) na každých 1000 HP',
            rate: 'Podíl',
            hitsTaken: 'Obdržené zásahy',
            dodgedShots: 'Vyhnuto zásahům',
            startHP: 'Zdraví na začátku',
            survivor: 'PŘEŽIVŠÍ',
            survivorT: 'Přežívší s nejnižším HP na konci bitvy',
            endHP: 'Zdraví na konci',
            sniper: 'SNIPER',
            sniperT: 'Počet úspěšných zásahů (v procentách) v porovnání ke všem výstřelům',
            rateP: 'Podíl(%)',
            hitCount: 'Úspěšné zásahy',
            missedShots: 'Neúspěšné zásahy',
            matrix: 'MATRIX',
            matrixT: 'Počet vyhnutých zásahů (v procentách) v porovnání ku všem zásahům (obdrženým & vyhnutým)',
            terminator: 'TERMINATOR',
            terminatorT: 'Počet KO (v procentách) v porovnaní ke všem úspěšným zásahům',
            KOs: 'KO',
            ranking: 'Žebríček',
            statsTitle: 'Bitevní štatistiky',
            designation: 'Designace',
            attack: 'Útok',
            defense: 'Obrana',
            difference: 'Rozdíl',
            statistics: 'Štatistiky',
            code: 'Kód',
            goBack: 'Zpět',
            starsTitle: 'Hvězdy téhle bitvy',
            title: 'Název',
            name: 'Jméno',
            details: 'Detaily',
            start: ' HP - Začátek: ',
            end: ' - Konec: ',
            damageTaken: ' - Obdržené poškození: ',
            avgHP: ' - HP na jednoho útočníka: ',
            total: 'Celkově ',
            average: 'Průměr ',
            HP: 'HP',
            damage: 'Poškození',
            avgDamage: 'Průměrné poškození',
            avgDamageMax: 'Průměrné max poškození',
            avgWeaponDamage: 'Průměrné poškození zbraně',
            avgWeaponDamageMax: 'Max poškození zbraně',
          },
          KoM: {
            success: 'Již má rekrut!',
            error: 'Došlo k chybě',
            showPlayerOnMap: 'Zobrazit polohu hráče',
            showTown: 'Zobrazit přehled města',
            showAlly: 'Zobrazit přehled aliance',
            showFort: 'Zobrazit přehled pevnosti',
            showBattle: 'Zobrazit bojiště',
            atFort: 'V pevnosti',
            nearFort: 'V blízkosti pevnosti',
            notFort: 'Mimo pevnosti',
            evaluated: 'Počet rekrutovaných hráčů',
            started: 'Bitva právě probíhá',
            remindAlly: 'Připomenout spojencům, kteří se ještě nepřidali',
            where: 'Kde',
            when: 'Kdy',
            att: 'Útočníci',
            def: 'Obránci',
            nodata: 'Nelze načíst informace pro tuto pevnost',
            getData: 'Načítaní informací o rekrutu',
            errorTimeout: 'Načítání trvalo příliš dlouho',
            ascaptain: 'Povýšit na kapitána',
            assergeant: 'Jmenovat za seržanta',
            asprivate: 'Jmenovat za vojína',
            asrecruit: 'Jmenovat za rekruta',
            asreservist: 'Označit za záložníka',
            astraitor: 'Označit za zrádce',
            youcant: 'Nemůžete degradovat bojovníky<br>stejné nebo vyšší hodnoti.',
            position: 'Počáteční pozice',
            pos_undefined: 'Žádná počáteční pozice',
            notown: 'Bez města',
            noally: 'Bez aliance',
            damage: 'Poškození',
            flag: 'Vlajka',
            inside: 'V pevnosti',
            sectors: {
              undef: 'Bez počáteční pozice',
              0: 'Levý horní sektor',
              1: 'Levý dolní sektor',
              2: 'Střední levý sektor',
              3: 'Střední dolní sektor',
              4: 'Střední pravý sektor',
              5: 'Pravý dolní sektor',
              6: 'Pravý horní sektor',
              7: 'Věž dobrodruhů',
              8: 'Věž duelantů',
              9: 'Věž vojáků',
              10: 'Věž dělníků',
              11: 'Kasárny',
              12: 'Sklad',
              13: 'Hlavní budova',
              14: 'Severní hradba',
              15: 'Jižní hradba',
              16: 'Západní hradba',
              17: 'Východní hradba',
              18: 'Brána',
              19: 'Vlajka',
            },
          },
        },
        sk: {
          language: 'Slovak (slovenčina)',
          ApiGui1: 'Tento skript obsahuje mnoho funkcií pre zjednodušenie vášho každodenného života na The West. <br> Ďalšie informácie',
          ApiGui2: 'Otvoriť stránku skriptu',
          Feat: {
            ColorTchat: '%0 Pridá do chatu nové funkcie. Farebný text, Emotikony 🐧🎉 a ďalšie.',
            QuickItemsSearch: '%0 Vyhľadá doplňováky v inventári',
            MarketBestBids: '%0 Zafarbí aukcie na základe ceny %1 Zelená %2 Ponuka je nižšia než nákupná cena %3 Čierna %4 Pobuka je rovná nákupnej cene %5 Modrá %6 Ponuka je medzi 100% a 200% nákupnej ceny %7 Červená %8 Ponuka je väčšia o viac ako 200%">',
            BattleStars: '%0 Ďalšie štatistiky v oznámení z boja o pevnosť',
            KickoMatic: '%0 Užitočné pre rekrut hráčov v boji o pevnosť',
            DuelMap: 'Pridá duelovú mapu do okna duelov',
            MarkDaily: 'Zvýrazniť denný bonus za prihlásenie, v piaty deň, aby ste ho nevynechali',
            MarketMessage: 'Zobraziť správu, keď sú na trhu veci alebo peniaze, ktoré môžete vyzdvihnúť na trhu v meste, kde sa práve nachádzate',
            AchievHide: 'Schovať dokončené úspechy v okne úspechov',
            RecipeMarket: 'Vylepšiť nákup receptov na trhu',
            MoveJobs: 'Presunúť úlohy (práce) v poradí o kúsok doľava',
            InstantQuest: 'Ak sú splnené všetky požiadavky, okamžite dokončiť úlohu',
            QuestWiki: 'Pridať odkaz do okna úloh pre zobrazenie úlohy na wiki',
            CityTravel: 'Na tabuli zobraziť čas cesty do miest',
            BetterSheriff: 'Pridať do okna šerifa novú kartu pre zobrazenie všetkých dostupných zatykačov',
            ChatProfessions: 'Zobraziť remeslo hráčov v zozname chatu',
            QuestBookSearch: 'Pridať vyhľadávanie v knihe úloh',
            MarketRights: 'Zobraziť či sú ponuky na trhu verejné alebo iba pre členov aliancie / mesta',
            EquipManagerPlus: 'Vylepšiť "Sklad pre vybavenie" v inventári',
            ShortPopups: 'Kratšie pop-upy predmetov',
            HideNotis: 'Pridať tlačítko pre skrytie oznámenia z prác na ľavej strane',
            JobProducts: 'Zobraziť v pop-upe prác koľko produktov z danej práce vlastníte',
            MapDistance: 'Zobraziť počet míl vedľa času cesty',
            TraderSell: 'Predať obchodníkovi viac položiek naraz',
            TouchControl: 'V mobilnom prehliadači povoliť dotykové ovládanie',
            FbRankingChar: 'Zobraziť triedu postavy v rebríčku bojov o pevnosť',
            DuelXpCalc: 'Zobraziť duelové skúsenosti v profile hráča',
            Logout: 'Pridať tlačítko pre odhlásenie na pravej strane',
            Statusbar: 'Odstrániť taskbar',
            ChangeCity: 'Prehodiť titul a meno hráča v okne radnice',
            BlinkEvents: 'Zastaviť blikanie tlačítka cirkusu na ľavej strane',
            FortTracker: 'Vypnúť pripomínanie boja o pevnosť',
            FriendsPop: 'Nezobrazovať "Priateľ online" pop-up',
          },
          settings1: 'Otvoriť nastavenie',
          settings2: 'Otvoriť nastavenie a okno s informáciami',
          ghosttown2: 'Mesto Duchov',
          ghosttown3: 'Otvoriť Mesto Duchov a centrovať ho na mape',
          indiantown2: 'Waupeeho indiánska dedina',
          indiantown3: 'Otvoriť Waupeeho indiánsku dedinu a centrovať ju na mape',
          openmarket: 'Otvoriť Trh',
          opentrader: 'Otvoriť Obchodníka',
          forum: 'Otvoriť fórum',
          newsets: 'Novo pridané sety',
          chooseItems: 'Vyberte itemy',
          remindHover: 'Dostanete upozornenie, keď je možné item znovu použiť. Tu si môžete vybrať tieto itemy.',
          remindReady: 'Pripravené na použitie',
          skipHover: 'Pri otváraní tašky preskočiť potvrdzovacie a výsledné správy. Tu si môžete vybrať tieto tašky.',
          skipDone: 'Dostanete',
          info: 'Info',
          contact: 'Kontakt',
          chooseLang: 'Vyberte jazyk',
          features: 'Funkcie',
          name: 'Meno',
          save: 'Uložiť',
          saveMessage: 'Úspešne uložené',
          saveMessage2: 'Nastavenie uložené. Niektoré zmeny vyžadajú reload hry.',
          setbonus2: 'Informácie o bonusoch',
          bonussearch2: 'Hľadať predmety podľa bonusu',
          frame2: 'Užitočné stránky',
          npclocator2: 'Nájsť zadávateľov úloh na mape',
          choose: 'Začnete kliknutím na klobúk',
          items: 'predmety',
          parts: 'časti',
          showItems: 'Zobraziť predmety zo setu v inventári',
          noItems: 'Vo vašom inventári neboli nájdené žiadne predmety. Kliknite znovu s CTRL pre zobrazenie na TW-Calc.',
          ownSets: 'Len vlastnené sety',
          switchWeapon: 'Prepínanie medzi strelnou zbraňou a zbraňou na blízko',
          selectBonus: 'Vybrat bonusy',
          resetB: 'Reset',
          body: 'Oblečení',
          right_arm: 'Zbrane',
          animal: 'Kôň & Produkt',
          rest: 'Ostatné',
          buff: 'Doplňováky',
          refresh: 'Obnoviť',
          noFriends: 'Žiadny priatelia',
          reward: 'Odmena',
          allprofessions: 'Všetky remeslá',
          market1: 'Predmety na trhu',
          market2: 'Na tomtu trhu sú predmety / peniaze. Čo chcete vyzdvihnúť?',
          all: 'Všetko',
          onlyBids: 'Len ponuky',
          nothing: 'Nič',
          worldwide: 'Svetové',
          alliance: 'Aliancia',
          town: 'Mesto',
          level: 'Level',
          duelLevel: 'Duelový level',
          exp: 'Xp',
          distance: 'Vzdialenosť',
          startduel: 'Začať Duel',
          centerMap: 'Centrovať pozíciu',
          popup: 'Bonusy súpera',
          damage: 'Poškodenie',
          duelmap: 'Duelová mapa',
          duelradius: 'Okruh duelu',
          minutes: 'minúty',
          hour: '1 hodina',
          hours: 'hodiny',
          searchOpp: 'Hľadať súpera',
          amount: 'Mrtvý',
          not_dead_amount: 'Živý',
          duellevel: 'Lvl',
          pStatus: 'Status',
          sortBy: 'Zoradiť podľa',
          tooLow: 'Príliž nízka duelová úroveň súpera',
          tooHigh: 'Príliž vysoká duelová úroveň súpera',
          ownTown: 'Člen mesta',
          attackable: 'Len dostupní súperi',
          youKO: 'You have duel protection',
          attDl: 'Attackable duelling levels',
          duelxp: 'Aktuálne duelové skúsenosti',
          logout: 'Odhlásiť',
          accNfin: 'Prijať a dokončiť úlohu',
          onWiki: 'Zobraziť úlohu na wiki',
          longerName: 'Názov musí byť dlhší ako 2 znaky',
          loading: 'Načítam...',
          rename: 'Premenovať',
          newName: 'Nové meno setu',
          used: 'Použité',
          renameWarning: 'Keď premenujete set, budete ho musieť vyzliecť a znovu obliecť. <br> Počas procesu môžete stratiť body zdravia!',
          sellItems: 'Predať predmety obchodníkovi?',
          removeWorkNotis: 'Schovať všetky oznámenia z prác',
          compInv: 'Kliknutím na tlačítko "zrušiť" zobrazíte len dražiteľné predmety\n alebo\Zadajte inú adresu URL inventára, ktorý chcete porovnať',
          loginAll1: 'Prihlásiť sa do všetkých svetov',
          loginAll2: 'Načítať všetky svety jedným klikom',
          custom1: 'Vlastné',
          custom2: 'Váš vlastný prihlasovací zoznam',
          edit: 'Upraviť',
          CT: {
            ColorWindowTitle: 'Color tchat nastavenie',
            ColorWindowPreviewTxt: '*Kliknutím na písmená zmeníte farbu',
            ColorWindowOkBtn: 'Aplikovať',
            ColorWindowToDefaultBtn: 'Nastaviť ako predvolené',
            ColorWindowThisTchatBtn: 'Nastaviť toto',
            ColorWindowDefaultText: 'Vyberte tchat pre reset na predvolené nastavenie: ',
            ColorWindowBold: 'Tučné',
            ColorWindowCaps: 'Veľké písmená',
            ColorWindowFlip: 'Preklopené',
            ColorBtnTitle: '',
            ColorLoadListName: [
              'Žiadna farba',
              'Zadajte kód farby',
              'červená',
              'hnedá',
              'fialová',
              'modrá',
              'zelená',
              'ružová',
              'purpurová',
              'fialový prechod',
              'degradovaná tmavomodrá',
              'zelený prechod',
              'degradovaná červená',
              'svetlo modrý prechod',
              'degradovaná ružová',
              'svetlo zelený prechod',
              'degradovaná ružová',
              'svetlo červený prechod'
            ],
            ColorLoadTitle: 'Kliknutím načítate iný kód farby<br>Aktuálny kód farby je: ',
            ColorSaveEmpty: '[prázdny]',
            CustomReady: 'Platný kód',
            CustomNotReady: 'Neplatný kód',
          },
          QIS: {
            adventure: '*Dobrodružstvá',
            work: '*Práce',
            duel: '*Duely',
            energy: '*Energia',
            skill: '*Schopnosti',
            fk: '*Boje',
            speed: '*Rýchlosť',
            lp: '*Zdravie',
            luckNmoney: '*Šťastie & zárobok',
            workmoti: '*Pracovnej motivácia',
            duelmoti: '*Duelovej motivácia',
            experience: '*Skúsenosti',
            special: '*Prémium/špeciálne',
            events: '*Eventy',
            chests: '*Tašky a truhly',
            equipment: '-Výbava',
            products: '-Produkty',
            questitems: '-Predmety na úlohy',
            craftitems: '-Predmety z remesiel',
            recipes: '-Recepty',
            NAMED: 'NAMED',
            nothingFound: 'Neboli nájdené žiadne položky tohto typu!',
          },
          NPC: {
            loading: 'Načítanie aktuálnych zadávateľov',
            title: 'Vyhľadávač zadávateľov',
            chooseNpc: 'Vybrať zadávateľa',
            yourposition: 'Vaša pozícia',
            questgiver: 'Zadávateľ úloh',
            reload: 'Znovu načítať všetkých zadávateľov',
          },
          BS: {
            hero: 'HRDINA',
            heroT: 'Počet zásahov (obdržané a vyhnuté) na každých 1000 HP',
            rate: 'Podiel',
            hitsTaken: 'Obdržané zásahy',
            dodgedShots: 'Vyhnuté zásahy',
            startHP: 'Zdravie na začiatku',
            survivor: 'PREŽIVŠÍ',
            survivorT: 'Preživší s najnižším hp na konci boja',
            endHP: 'Zdravie na konci',
            sniper: 'SNIPER',
            sniperT: 'Počet úspešných zásahov (v percentách) v porovnaní ku všetkým výstrelom',
            rateP: 'Podiel(%)',
            hitCount: 'Úspešné zásahy',
            missedShots: 'Neúspešné zásahy',
            matrix: 'MATRIX',
            matrixT: 'Počet vyhnutých zásahov (v percentách) v porovnaní ku všetkým zásahom (obrdžaným & vyhnutým)',
            terminator: 'TERMINATOR',
            terminatorT: 'Počet KO (v percentách) v porovnaní ku všetkým úspešným hitom',
            KOs: 'KO',
            ranking: 'Rebríček',
            statsTitle: 'Štatistiky tohto boja',
            designation: 'Designácia',
            attack: 'Útok',
            defense: 'Obrana',
            difference: 'Rozdiel',
            statistics: 'Štatistiky',
            code: 'Kód',
            goBack: 'Naspäť',
            starsTitle: 'Hviezdy tohto boja',
            title: 'Názov',
            name: 'Meno',
            details: 'Detaily',
            start: ' HP - Začiatok: ',
            end: ' - Konec: ',
            damageTaken: ' - Obdržané poškodenie: ',
            avgHP: ' - HP na jedného útočníka: ',
            total: 'Celkové ',
            average: 'Priemer ',
            HP: 'HP',
            damage: 'Poškodenie',
            avgDamage: 'Priemerné poškodenie',
            avgDamageMax: 'Priemerné max poškodenie',
            avgWeaponDamage: 'Priemerné poškodenie zbrane',
            avgWeaponDamageMax: 'Max poškodenie zbrane',
          },
          KoM: {
            success: 'Hodnosti boli udelené!',
            error: 'Vyskytol sa problém',
            showPlayerOnMap: 'Ukázať hráča na mape',
            showTown: 'Zobraziť náhľad mesta',
            showAlly: 'Zobraziť náhľad aliancie',
            showFort: 'Zobraziť náhľad pevnosti',
            showBattle: 'Zobraziť bojisko',
            atFort: 'V pevnosti',
            nearFort: 'V blízkosti pevnosti',
            notFort: 'Mimo pevnosti',
            evaluated: 'Posúdenie hráča',
            started: 'Boj je v plnom prúde',
            remindAlly: 'Pripomenúť spojencom, ktorí sa ešte nepridali',
            where: 'Kde',
            when: 'Kedy',
            att: 'Útočníci',
            def: 'Obrancovia',
            nodata: 'Informácie pre pevnosť sa nedali načítať',
            getData: 'Načítavanie informácií',
            errorTimeout: 'Načítavanie trvalo príliš dlho',
            ascaptain: 'Povýšiť na kapitána',
            assergeant: 'Vymenovať za seržanta',
            asprivate: 'Vymenovať za slobodníka',
            asrecruit: 'Označiť za nováčika',
            asreservist: 'Označiť za záložníka',
            astraitor: 'Označiť ako zradcu',
            youcant: 'Nemôžete degradovať bojovníkov s rovnakou<br>alebo vyššou hodnosťou.',
            position: 'Počiatočná pozícia',
            pos_undefined: 'Žiadna počiatočná pozícia',
            notown: 'Bez mesta',
            noally: 'Bez aliancie',
            damage: 'Poškodenie',
            flag: 'Vlajka',
            inside: 'V pevnosti',
            sectors: {
              undef: 'Bez počiatočnej pozície',
              0: 'Horný ľavý sektor',
              1: 'Spodný ľavý sektor',
              2: 'Stredný ľavý sektor',
              3: 'Stredný spodný sektor',
              4: 'Spodný pravý sektor',
              5: 'Dolný pravý sektor',
              6: 'Horný pravý sektor',
              7: 'Veža dobrodruhov',
              8: 'Veža duelantov',
              9: 'Veža vojakov',
              10: 'Veža pracovníkov',
              11: 'Kasárne',
              12: 'Sklad',
              13: 'Hlavná budova',
              14: 'Severná hradba',
              15: 'Južná hradba',
              16: 'Západná hradba',
              17: 'Východná hradba',
              18: 'Brána',
              19: 'Vlajka',
            },
          },
        },
        ru: {
          language: 'Russian (русский)',
          ApiGui1: 'This script contains many features to simplify your everyday life in The West.<br>More Informations',
          ApiGui2: 'Open script page',
          Feat: {
            ColorTchat: '%0 Adds new features to the chat. Colored text, Emojis 🐧🎉 etc.',
            QuickItemsSearch: '%0 Search for buff categories and sets in your inventory',
            MarketBestBids: '%0 Colors the auctions based on the price %1 Green %2 Bid is lower than the purchase price %3 Black %4 Bid is equal to the purchase price %5 Blue %6 Bid is between 100% and 200% of the purchase price %7 Red %8 Bid is more than 200%">',
            BattleStars: '%0 Additional stats in the fort battle report',
            KickoMatic: '%0 Helpful to rank players before a fort battle',
            DuelMap: 'Add a duel map to the duel window',
            MarkDaily: 'Highlight daily login bonus on day 5 to not miss it',
            MarketMessage: 'Get a message when there are items or money to pick up on actual market',
            AchievHide: 'Hide completed achievements in achievements window',
            RecipeMarket: 'Improve the purchase of recipes on market',
            MoveJobs: 'Move the queued jobs a bit to the left',
            InstantQuest: 'Complete the quest instantly if all requirements are done',
            QuestWiki: 'Add a link in the quest window to show the quest on the wiki page',
            CityTravel: 'Show the travel time to the towns in the blackboard',
            BetterSheriff: 'Add a new tab in the sheriff window to see all possible bounties',
            ChatProfessions: 'Show the crafting profession of the players in the chat list',
            QuestBookSearch: 'Search for solved quests in the quest book',
            MarketRights: 'Show if market offers are public or only for alliance/town members',
            EquipManagerPlus: 'Improve the equipment manager in the inventory',
            ShortPopups: 'Make the item pop-ups shorter',
            HideNotis: 'Add a button to hide the job notifications on the left side',
            JobProducts: 'Show in the job pop-up how many products you already have in your inventory',
            MapDistance: ' Show the number of miles next to the travel time',
            TraderSell: 'Sell multiple items at once to the trader',
            TouchControl: 'Enable touch control on your mobile browser',
            FbRankingChar: 'Show the character class in the fortbattle world ranking',
            DuelXpCalc: 'Show the duel experience in player profiles',
            Logout: 'Add a logout button on the right side',
            Statusbar: 'Remove the taskbar',
            ChangeCity: 'Switch title and player name in the town hall',
            BlinkEvents: 'Stop the blinking of the event, County Fair buttons on the left side',
            FortTracker: 'Turn off fort battle reminder',
            FriendsPop: 'Hide "Friend online" pop-ups',
          },
          settings1: 'Open settings',
          settings2: 'Open settings and information window',
          ghosttown2: 'Город Призрак',
          ghosttown3: 'Open ghost town and center it on map',
          indiantown2: 'Деревня Вупи',
          indiantown3: 'Open Indian village and center it on map',
          openmarket: 'Рынок',
          opentrader: 'Коммивояжёр',
          forum: 'Сплетни',
          newsets: 'New sets are added to the script',
          chooseItems: 'Choose the items',
          remindHover: 'You get a notification when an item can be used again. Here you can choose these items.',
          remindReady: 'Ready to collect',
          skipHover: 'Skip the confirmation and result messages when you open some bags. Here you can choose these bags',
          skipDone: 'You get',
          info: 'Info',
          contact: 'Контакты',
          chooseLang: 'Сменить язык',
          features: 'Features',
          name: 'Name',
          save: 'Экономить',
          saveMessage: 'Сохранить успешно',
          saveMessage2: 'Settings saved. Some changes need a refresh of the game window.',
          setbonus2: 'Informations about the set bonuses',
          bonussearch2: 'Find items by bonus',
          frame2: 'Helpful web pages',
          npclocator2: 'Find quest givers on the map',
          choose: 'Click on the hat to get started',
          items: 'items',
          parts: 'parts',
          showItems: 'Show the set items in your Bag',
          noItems: 'No items in your inventory found. Click again with CTRL to show it on TW-Calc.',
          ownSets: 'Only own sets',
          switchWeapon: 'Switch between firearm and melee weapon',
          selectBonus: 'Select bonuses',
          resetB: 'Reset',
          body: 'Clothing',
          right_arm: 'Weapons',
          animal: 'Horse & Yield',
          rest: 'Other',
          buff: 'Buffs',
          refresh: 'Refresh',
          noFriends: 'No Friends',
          reward: 'Reward',
          allprofessions: 'All Professions',
          market1: 'Items on market',
          market2: 'There are items/money on this market. What do you want to pick up?',
          all: 'All',
          onlyBids: 'Only bids',
          nothing: 'Nothing',
          worldwide: 'Worldwide',
          alliance: 'Alliance',
          town: 'Town',
          level: 'Level',
          duelLevel: 'Duelling level',
          exp: 'Exp',
          distance: 'Distance',
          startduel: 'Start Duel',
          centerMap: 'Center map',
          popup: 'The opponent\'s skill bonus',
          damage: 'Damage',
          duelmap: 'Duel map',
          duelradius: 'Duel radius',
          minutes: 'minutes',
          hour: '1 hour',
          hours: 'hours',
          searchOpp: 'Search for opponents',
          amount: 'Dead',
          not_dead_amount: 'Alive',
          duellevel: 'Lvl',
          pStatus: 'Status',
          sortBy: 'Sort by',
          tooLow: 'Too low duelling level of opponent',
          tooHigh: 'Too high duelling level of opponent',
          ownTown: 'Member of your town',
          attackable: 'Show only attackable players',
          youKO: 'You have duel protection',
          attDl: 'Attackable duelling levels',
          duelxp: 'Current duel experience',
          logout: 'Logout',
          accNfin: 'Accept & complete quest',
          onWiki: 'Show the quest on the wiki',
          longerName: 'Name must be longer than 2 characters',
          loading: 'Loading...',
          rename: 'Rename',
          newName: 'Choose a new set name',
          used: 'Used',
          renameWarning: 'When you rename a set, you will wear it and undress it again.<br>You may loose health points during the process!',
          sellItems: 'Sell items to the trader?',
          removeWorkNotis: 'Hide all job notifications',
          compInv: 'Click on "cancel" to just show only auctionable items\n or\nEnter other inventory URL to compare',
          loginAll1: 'Login all worlds',
          loginAll2: 'Load all your active worlds with one click',
          custom1: 'Custom',
          custom2: 'Your custom login list',
          edit: 'Edit',
          CT: {
            ColorWindowTitle: 'Color tchat setting',
            ColorWindowPreviewTxt: '*Click on the letters to change color',
            ColorWindowOkBtn: 'Apply',
            ColorWindowToDefaultBtn: 'Set to default',
            ColorWindowThisTchatBtn: 'Set to this',
            ColorWindowDefaultText: 'Select the tchat for reset to default: ',
            ColorWindowBold: 'Bold',
            ColorWindowCaps: 'Capitalized',
            ColorWindowFlip: 'Flip',
            ColorBtnTitle: '',
            ColorLoadListName: [
              'No color',
              'Enter a color code',
              'red',
              'brown',
              'purple',
              'blue',
              'green',
              'pink',
              'magenta',
              'violet gradient',
              'degraded dark blue',
              'green gradient',
              'degraded red',
              'blue gradient light',
              'degraded pink',
              'light green gradient',
              'degraded pink',
              'red gradient light'
            ],
            ColorLoadTitle: 'Click to load another color code<br>The current color code is: ',
            ColorSaveEmpty: '[empty]',
            CustomReady: 'Valid Code',
            CustomNotReady: 'Invalid Code',
          },
          QIS: {
            adventure: '*Adventures',
            work: '*Work',
            duel: '*Duels',
            energy: '*Energy',
            skill: '*Skill points',
            fk: '*Fort battles',
            speed: '*Speed',
            lp: '*Health points',
            luckNmoney: '*Luck & money',
            workmoti: '*Work motivation',
            duelmoti: '*Duel motivation',
            experience: '*Experience',
            special: '*Premium/special',
            events: '*Events',
            chests: '*Open & unpack',
            equipment: '-Equipment',
            products: '-Products',
            questitems: '-Quest items',
            craftitems: '-Craft items',
            recipes: '-Recipes',
            NAMED: 'NAMED',
            nothingFound: 'No items of this type found!',
          },
          NPC: {
            loading: 'Loading current quest givers',
            title: 'Расположение работодателя',
            chooseNpc: 'Выбор работодателя',
            yourposition: 'Твоё местоположение',
            questgiver: 'Квестодатель',
            reload: 'Reload all quest givers',
          },
          BS: {
            hero: 'HERO',
            heroT: 'Number of shots (taken & dodged) per 1000 HPs',
            rate: 'Rate',
            hitsTaken: 'Hits taken',
            dodgedShots: 'Dodged shots',
            startHP: 'Start HP',
            survivor: 'SURVIVOR',
            survivorT: 'Survivor with the fewest HPs at the end of the fort battle',
            endHP: 'End HP',
            sniper: 'SNIPER',
            sniperT: 'Number of successful hits (percentage) in relation to all shots fired',
            rateP: 'Rate(%)',
            hitCount: 'Hit count',
            missedShots: 'Missed shots',
            matrix: 'MATRIX',
            matrixT: 'Number of doged shots (percentage) in relation to all shots (taken & dodged)',
            terminator: 'TERMINATOR',
            terminatorT: 'Number of KOs (percentage) in relation to the successful hits',
            KOs: 'KOs',
            ranking: 'Ranking',
            statsTitle: 'Fort battle statistics',
            designation: 'Designation',
            attack: 'Attack',
            defense: 'Defense',
            difference: 'Difference',
            statistics: 'Statistics',
            code: 'Code',
            goBack: 'Go back',
            starsTitle: 'The stars of the battle',
            title: 'Title',
            name: 'Name',
            details: 'Details',
            start: ' HP - Start: ',
            end: ' - End: ',
            damageTaken: ' - Damage taken: ',
            avgHP: ' - HP per fighter: ',
            total: 'Total ',
            average: 'Average ',
            HP: 'HP',
            damage: 'Damage',
            avgDamage: 'Average damage',
            avgDamageMax: 'Average max damage',
            avgWeaponDamage: 'Average weapon damage',
            avgWeaponDamageMax: 'Weapon damage max',
          },
          KoM: {
            success: 'Лычка дана!',
            error: 'Произошла ошибка',
            showPlayerOnMap: 'Показать игрока на карте',
            showTown: 'Посмотреть город',
            showAlly: 'Открыть окно альянс',
            showFort: 'Show fort overview',
            showBattle: 'Show battlefield',
            atFort: 'At the fort',
            nearFort: 'Nearby the fort',
            notFort: 'Not at the fort',
            evaluated: 'Already evaluated',
            started: 'The battle is taking place right now',
            remindAlly: 'Remind ally members, which haven\'t participated yet',
            where: 'Where',
            when: 'When',
            att: 'Attackers',
            def: 'Defenders',
            nodata: 'Информация о званиях не загружена для данного форта!',
            getData: 'Пытаемся загрузить данные о званиях',
            errorTimeout: 'Загрузка происходит слишком долго',
            ascaptain: 'Произвести в капитаны',
            assergeant: 'Назначить сержантом',
            asprivate: 'Назначить рядовым',
            asrecruit: 'Взять в рекруты',
            asreservist: 'Записать в резерв',
            astraitor: 'Обвинить в предательстве',
            youcant: 'Ты не можешь понизить старшего<br>или равного по званию.',
            position: 'Позиция',
            pos_undefined: 'не установлена',
            notown: 'Нет города',
            noally: 'Без альянса',
            damage: 'Урон',
            flag: 'Флаг',
            inside: 'Внутри форта',
            sectors: {
              undef: 'Не назначена',
              0: 'Левый верхний сектор',
              1: 'Левый нижний сектор',
              2: 'Левый южный сектор',
              3: 'Центральный южный сектор',
              4: 'Правый южный сектор',
              5: 'Правый нижний сектор',
              6: 'Правый верхний сектор',
              7: 'Башня авантов',
              8: 'Башня дуэлянтов',
              9: 'Башня солдат',
              10: 'Башня трудяг',
              11: 'Казарма',
              12: 'Склад',
              13: 'Штаб',
              14: 'Северная стена',
              15: 'Южная стена',
              16: 'Западная стена',
              17: 'Восточная стена',
              18: 'Ворота',
              19: 'Флаг',
            },
          },
        },
        tr: {
          language: 'Turkish (Türkçe)',
          ApiGui1: 'This script contains many features to simplify your everyday life in The West.<br>More Informations',
          ApiGui2: 'Open script page',
          Feat: {
            ColorTchat: '%0 Adds new features to the chat. Colored text, Emojis 🐧🎉 etc.',
            QuickItemsSearch: '%0 Search for buff categories and sets in your inventory',
            MarketBestBids: '%0 Colors the auctions based on the price %1 Green %2 Bid is lower than the purchase price %3 Black %4 Bid is equal to the purchase price %5 Blue %6 Bid is between 100% and 200% of the purchase price %7 Red %8 Bid is more than 200%">',
            BattleStars: '%0 Additional stats in the fort battle report',
            KickoMatic: '%0 Helpful to rank players before a fort battle',
            DuelMap: 'Add a duel map to the duel window',
            MarkDaily: 'Highlight daily login bonus on day 5 to not miss it',
            MarketMessage: 'Get a message when there are items or money to pick up on actual market',
            AchievHide: 'Hide completed achievements in achievements window',
            RecipeMarket: 'Improve the purchase of recipes on market',
            MoveJobs: 'Move the queued jobs a bit to the left',
            InstantQuest: 'Complete the quest instantly if all requirements are done',
            QuestWiki: 'Add a link in the quest window to show the quest on the wiki page',
            CityTravel: 'Show the travel time to the towns in the blackboard',
            BetterSheriff: 'Add a new tab in the sheriff window to see all possible bounties',
            ChatProfessions: 'Show the crafting profession of the players in the chat list',
            QuestBookSearch: 'Search for solved quests in the quest book',
            MarketRights: 'Show if market offers are public or only for alliance/town members',
            EquipManagerPlus: 'Improve the equipment manager in the inventory',
            ShortPopups: 'Make the item pop-ups shorter',
            HideNotis: 'Add a button to hide the job notifications on the left side',
            JobProducts: 'Show in the job pop-up how many products you already have in your inventory',
            MapDistance: ' Show the number of miles next to the travel time',
            TraderSell: 'Sell multiple items at once to the trader',
            TouchControl: 'Enable touch control on your mobile browser',
            FbRankingChar: 'Show the character class in the fortbattle world ranking',
            DuelXpCalc: 'Show the duel experience in player profiles',
            Logout: 'Add a logout button on the right side',
            Statusbar: 'Remove the taskbar',
            ChangeCity: 'Switch title and player name in the town hall',
            BlinkEvents: 'Stop the blinking of the event, County Fair buttons on the left side',
            FortTracker: 'Turn off fort battle reminder',
            FriendsPop: 'Hide "Friend online" pop-ups',
          },
          settings1: 'Open settings',
          settings2: 'Open settings and information window',
          ghosttown2: 'Hayalet Kasaba',
          ghosttown3: 'Open ghost town and center it on map',
          indiantown2: 'Waupee\'nin Kızılderili Köyüne Git',
          indiantown3: 'Open Indian village and center it on map',
          openmarket: 'Pazarı Aç',
          opentrader: 'Gezici Tüccarı Aç',
          forum: 'Forumu Aç',
          newsets: 'New sets are added to the script',
          chooseItems: 'Choose the items',
          remindHover: 'You get a notification when an item can be used again. Here you can choose these items.',
          remindReady: 'Ready to collect',
          skipHover: 'Skip the confirmation and result messages when you open some bags. Here you can choose these bags',
          skipDone: 'You get',
          info: 'Info',
          contact: 'Iletişim',
          chooseLang: 'Dili değiştir',
          features: 'Features',
          name: 'Name',
          save: 'Kurtarmak',
          saveMessage: 'Başarıyla kaydet',
          saveMessage2: 'Settings saved. Some changes need a refresh of the game window.',
          setbonus2: 'Informations about the set bonuses',
          bonussearch2: 'Find items by bonus',
          frame2: 'Helpful web pages',
          npclocator2: 'Find quest givers on the map',
          choose: 'Click on the hat to get started',
          items: 'items',
          parts: 'parts',
          showItems: 'Show the set items in your Bag',
          noItems: 'No items in your inventory found. Click again with CTRL to show it on TW-Calc.',
          ownSets: 'Only own sets',
          switchWeapon: 'Switch between firearm and melee weapon',
          selectBonus: 'Select bonuses',
          resetB: 'Reset',
          body: 'Clothing',
          right_arm: 'Weapons',
          animal: 'Horse & Yield',
          rest: 'Other',
          buff: 'Buffs',
          refresh: 'Refresh',
          noFriends: 'No Friends',
          reward: 'Reward',
          allprofessions: 'All Professions',
          market1: 'Items on market',
          market2: 'There are items/money on this market. What do you want to pick up?',
          all: 'All',
          onlyBids: 'Only bids',
          nothing: 'Nothing',
          worldwide: 'Worldwide',
          alliance: 'Alliance',
          town: 'Town',
          level: 'Level',
          duelLevel: 'Duelling level',
          exp: 'Exp',
          distance: 'Distance',
          startduel: 'Start Duel',
          centerMap: 'Center map',
          popup: 'The opponent\'s skill bonus',
          damage: 'Damage',
          duelmap: 'Duel map',
          duelradius: 'Duel radius',
          minutes: 'minutes',
          hour: '1 hour',
          hours: 'hours',
          searchOpp: 'Search for opponents',
          amount: 'Dead',
          not_dead_amount: 'Alive',
          duellevel: 'Lvl',
          pStatus: 'Status',
          sortBy: 'Sort by',
          tooLow: 'Too low duelling level of opponent',
          tooHigh: 'Too high duelling level of opponent',
          ownTown: 'Member of your town',
          attackable: 'Show only attackable players',
          youKO: 'You have duel protection',
          attDl: 'Attackable duelling levels',
          duelxp: 'Current duel experience',
          logout: 'Logout',
          accNfin: 'Accept & complete quest',
          onWiki: 'Show the quest on the wiki',
          longerName: 'Name must be longer than 2 characters',
          loading: 'Loading...',
          rename: 'Rename',
          newName: 'Choose a new set name',
          used: 'Used',
          renameWarning: 'When you rename a set, you will wear it and undress it again.<br>You may loose health points during the process!',
          sellItems: 'Sell items to the trader?',
          removeWorkNotis: 'Hide all job notifications',
          compInv: 'Click on "cancel" to just show only auctionable items\n or\nEnter other inventory URL to compare',
          loginAll1: 'Login all worlds',
          loginAll2: 'Load all your active worlds with one click',
          custom1: 'Custom',
          custom2: 'Your custom login list',
          edit: 'Edit',
          CT: {
            ColorWindowTitle: 'Color tchat setting',
            ColorWindowPreviewTxt: '*Click on the letters to change color',
            ColorWindowOkBtn: 'Apply',
            ColorWindowToDefaultBtn: 'Set to default',
            ColorWindowThisTchatBtn: 'Set to this',
            ColorWindowDefaultText: 'Select the tchat for reset to default: ',
            ColorWindowBold: 'Bold',
            ColorWindowCaps: 'Capitalized',
            ColorWindowFlip: 'Flip',
            ColorBtnTitle: '',
            ColorLoadListName: [
              'No color',
              'Enter a color code',
              'red',
              'brown',
              'purple',
              'blue',
              'green',
              'pink',
              'magenta',
              'violet gradient',
              'degraded dark blue',
              'green gradient',
              'degraded red',
              'blue gradient light',
              'degraded pink',
              'light green gradient',
              'degraded pink',
              'red gradient light'
            ],
            ColorLoadTitle: 'Click to load another color code<br>The current color code is: ',
            ColorSaveEmpty: '[empty]',
            CustomReady: 'Valid Code',
            CustomNotReady: 'Invalid Code',
          },
          QIS: {
            adventure: '*Adventures',
            work: '*Work',
            duel: '*Duels',
            energy: '*Energy',
            skill: '*Skill points',
            fk: '*Fort battles',
            speed: '*Speed',
            lp: '*Health points',
            luckNmoney: '*Luck & money',
            workmoti: '*Work motivation',
            duelmoti: '*Duel motivation',
            experience: '*Experience',
            special: '*Premium/special',
            events: '*Events',
            chests: '*Open & unpack',
            equipment: '-Equipment',
            products: '-Products',
            questitems: '-Quest items',
            craftitems: '-Craft items',
            recipes: '-Recipes',
            NAMED: 'NAMED',
            nothingFound: 'No items of this type found!',
          },
          NPC: {
            loading: 'Geçerli görev vericiler Yükleniyor',
            title: 'Görev verici haritası',
            chooseNpc: 'İşverenin seçimi',
            yourposition: 'Bulunduğunuz yer',
            questgiver: 'Görevin bulunduğu yer',
            reload: 'Tüm görev vericileri güncelle',
          },
          BS: {
            hero: 'HERO',
            heroT: 'Number of shots (taken & dodged) per 1000 HPs',
            rate: 'Rate',
            hitsTaken: 'Hits taken',
            dodgedShots: 'Dodged shots',
            startHP: 'Start HP',
            survivor: 'SURVIVOR',
            survivorT: 'Survivor with the fewest HPs at the end of the fort battle',
            endHP: 'End HP',
            sniper: 'SNIPER',
            sniperT: 'Number of successful hits (percentage) in relation to all shots fired',
            rateP: 'Rate(%)',
            hitCount: 'Hit count',
            missedShots: 'Missed shots',
            matrix: 'MATRIX',
            matrixT: 'Number of doged shots (percentage) in relation to all shots (taken & dodged)',
            terminator: 'TERMINATOR',
            terminatorT: 'Number of KOs (percentage) in relation to the successful hits',
            KOs: 'KOs',
            ranking: 'Ranking',
            statsTitle: 'Fort battle statistics',
            designation: 'Designation',
            attack: 'Attack',
            defense: 'Defense',
            difference: 'Difference',
            statistics: 'Statistics',
            code: 'Code',
            goBack: 'Go back',
            starsTitle: 'The stars of the battle',
            title: 'Title',
            name: 'Name',
            details: 'Details',
            start: ' HP - Start: ',
            end: ' - End: ',
            damageTaken: ' - Damage taken: ',
            avgHP: ' - HP per fighter: ',
            total: 'Total ',
            average: 'Average ',
            HP: 'HP',
            damage: 'Damage',
            avgDamage: 'Average damage',
            avgDamageMax: 'Average max damage',
            avgWeaponDamage: 'Average weapon damage',
            avgWeaponDamageMax: 'Weapon damage max',
          },
          KoM: {
            success: 'Rank is given!',
            error: 'An error has occured',
            showPlayerOnMap: 'Show player on map',
            showTown: 'Show town overview',
            showAlly: 'Show alliance overview',
            showFort: 'Show fort overview',
            showBattle: 'Show battlefield',
            atFort: 'At the fort',
            nearFort: 'Nearby the fort',
            notFort: 'Not at the fort',
            evaluated: 'Number of evaluated players',
            started: 'The battle is taking place right now',
            remindAlly: 'Remind ally members, who haven\'t participated yet',
            where: 'Where',
            when: 'When',
            att: 'Attackers',
            def: 'Defenders',
            nodata: 'Couldn\'t load rank information for the fort',
            getData: 'Loading rank information',
            errorTimeout: 'The loading took too much time',
            ascaptain: 'Promote to captain',
            assergeant: 'Appoint as sergeant',
            asprivate: 'Appoint as private',
            asrecruit: 'Appoint as recruit',
            asreservist: 'Appoint as reservist',
            astraitor: 'Mark as traitor',
            youcant: 'You can\'t demote fighters of<br>the same or higher rank.',
            position: 'Position',
            pos_undefined: 'No starting position',
            notown: 'No town',
            noally: 'No alliance',
            damage: 'Damage',
            flag: 'Flag',
            inside: 'Inside the fort',
            sectors: {
              undef: 'No starting position',
              0: 'The upper-left sector',
              1: 'The lower-left sector',
              2: 'The central left sector',
              3: 'The lower central sector',
              4: 'The central right sector',
              5: 'The lower-right sector',
              6: 'The upper-right sector',
              7: 'Adventurer\'s tower',
              8: 'Dueller\'s tower',
              9: 'Soldier\'s tower',
              10: 'Worker\'s tower',
              11: 'Barracks',
              12: 'Resource stock',
              13: 'Headquarters',
              14: 'North wall',
              15: 'South wall',
              16: 'West wall',
              17: 'East wall',
              18: 'Gate',
              19: 'Flag',
            },
          },
        },
      },
      url: '//tomrobert.safe-ws.de/',
      website: 'https://the-west-scripts.github.io/The-West-Essentials/',
      Images: function (img, file) {
        return this.url + img + (file ? '.jpg' : '.png');
      },
    };
    if (location.href.includes('game.php')) {
      var addTWX = {
        name: 'TW Essentials',
        author: 'Tom Robert',
        minGame: '2.0',
        maxGame: Game.version.toString(),
        SPEC: [
          'speed', 'luck', 'dollar', 'experience', 'regen', 'drop',
        ],
        list: null,
        currSetBonus: 0,
        currBonusSearch: '',
        lvlToggle: 0,
        setAbc: false,
        onlyOwnSets: false,
        chooseBonus: {
          subWeapon: 'hand'
        },
        Data: {},
        loaded: [],
        Features: {
          ColorTchat: true,
          QuickItemsSearch: true,
          MarketBestBids: true,
          BattleStars: true,
          //Collections: true,
          KickoMatic: false,
          DuelMap: true,
          MarkDaily: true,
          MarketMessage: true,
          AchievHide: true,
          RecipeMarket: true,
          MoveJobs: true,
          InstantQuest: true,
          QuestWiki: true,
          CityTravel: true,
          BetterSheriff: true,
          ChatProfessions: true,
          QuestBookSearch: true,
          MarketRights: true,
          EquipManagerPlus: true,
          ShortPopups: true,
          HideNotis: true,
          JobProducts: true,
          MapDistance: true,
          TraderSell: true,
          TouchControl: true,
          FbRankingChar: true,
          DuelXpCalc: true,
          Statusbar: false,
          ChangeCity: false,
          Logout: false,
          BlinkEvents: false,
          FortTracker: false,
          FriendsPop: false,
        },
        CT: {},
        QIS: {},
        MBB: {},
        BS: {},
        KoM: {},
        cdown: {
          2482: [1],
          2484: [1],
          2485: [1],
          2557: [1, 0],
          2558: [1, 0],
          2665: [1, 4],
          2666: [1, 4],
          2698: [1, 1],
          50691: [1, 3],
          51482: [1, 2],
          51483: [1, 2],
          53042: [1, 3],
          53912: [1, 1],
        },
        cdownTimer: {},
        cdownSetTime: function (y, res, sec) {
          TWX.cdownTimer[y] = setTimeout(function () {
            var imgs = $('<span></span>');
            for (var z = 0; z < res.length; z++) {
              var itemDiv = new tw2widget.JobItem(res[z].obj).getMainDiv();
              imgs.append(itemDiv);
            }
            var cdownMsg = new west.gui.Dialog(TWXlang.remindReady, imgs, 'ok').addButton('ok', function () {
              Wear.open();
              Inventory.showSearchResult(res);
              cdownMsg.hide();
              TWX.cdownTimer[y] = 0;
            }).addButton('cancel').show();
          }, sec);
        },
        skipOpen: {
          1975: 1,
          2200: 1,
          2561: 0.5,
          2562: 0.5,
          2675: 0.5,
        },
        addStyle: function (css) {
          var style = document.createElement('style');
          style.type = 'text/css';
          style.innerHTML = css;
          document.body.appendChild(style);
        },
        replaceGaps: function (txt, arr) {
          return txt.replace(/%(\d)/g, function (f, p) {
            return arr[p] || p;
          });
        },
        updateLang: function () {
          let lgs = TWX.langs,
          lg = [localStorage.getItem('scriptsLang'), Game.locale.substr(0, 2)];
          TWX.lang = lgs[lg[0]] ? lg[0] : lgs[lg[1]] ? lg[1] : 'en';
          TWXlang = lgs[TWX.lang];
        },
      };
      Object.assign(TWX, addTWX);
      TWX.updateLang();
      TWX.Skript = {
        fmfb: function () {
          var fms = [['de', 'deutsches Forum'], ['net', 'English forum'], ['pl', 'forum polski'], ['es', 'foro español'], ['ru.com', 'Русский форум'], ['fr', 'forum français'], ['it', 'forum italiano'], ['net', 'beta forum', 'beta.']],
          add = '<h1>' + TWXlang.contact + '</h1><ul style="margin-left:15px;line-height:18px;"><li>Send a message to <a target=\'_blank\' href="//www.the-west.de/?ref=west_invite_linkrl&player_id=647936&world_id=13&hash=7dda">Tom Robert on German world Arizona</a></li><li>Message me on one of these The West Forum:<br>';
          for (var l of fms)
            add += '/ <a target=\'_blank\' href="//forum.' + (l[2] || '') + 'the-west.' + l[0] + '/index.php?conversations/add&to=Tom Robert">' + l[1] + '</a> ' + (l[0] == 'es' ? '<br>' : '');
          return add + '/<br>I will get an e-mail when you sent me the message <img src="images/chat/emoticons/smile.png"></li></ul>';
        },
        init: function () {
          TheWestApi.register('TWX', TWX.name, TWX.minGame, TWX.maxGame, TWX.author, TWX.website).setGui('<h1>' + TWXlang.info + '</h1><i>Language: </i>' + TWXlang.language + '<br><br>' + TWXlang.ApiGui1 + ': <a href="javascript:TWX.GUI.open(\'openFeatures\');TWX.GUI.makeList();">' + TWXlang.ApiGui2 + '</a><br><br><i>' + TWX.name + ' v' + TWX.version + '</i><br><br>' + this.fmfb());
          var menuContainer = $('<div class="menulink" onclick="TWX.GUI.openSelectbox();" title="' + TWX.name + '">').css('background-image', 'url(' + TWX.Images('LT_settings') + ')').css('background-position', '0px 0px').on('mouseenter', function () {
            $(this).css('background-position', '-25px 0px');
          }).on('mouseleave', function () {
            $(this).css('background-position', '0px 0px');
          });
          $('#ui_menubar').append($('<div id="TWX_menu" class="ui_menucontainer">').append(menuContainer).append('<div class="menucontainer_bottom">'));
          TWX.Skript.updateFeat();
          TWX.SkipOpen();
        },
        updateFeat: function () {
          var saved = localStorage.getItem('TWLT');
          TWX.Data = saved && saved.indexOf('{') === 0 && JSON.parse(saved) || {};
          for (var k in TWX.Features) {
            if (TWX.Skript.getFeature(k) && !TWX.loaded.includes(k)) {
              try {
                TWX.loaded.push(k);
                TWX[k].init();
              } catch (e) {}
            }
          }
          TWX.CollectReminder();
        },
        getFeature: function (name) {
          return (TWX.Data[name] !== undefined) ? TWX.Data[name] : TWX.Features[name];
        },
      };
      Map.getLastQueuePosition = function () {
        var posx = Character.position.x;
        var posy = Character.position.y;
        if (TaskQueue.queue.length >= 1) {
          var data = TaskQueue.queue[TaskQueue.queue.length - 1].wayData;
          if (data.x) {
            posx = data.x;
            posy = data.y;
          }
        }
        return {
          x: posx,
          y: posy
        };
      };
      var EvName = Object.keys(Game.sesData)[0],
      sesEvs = ['Hearts', 'Easter', 'Independence', 'Octoberfest', 'DayOfDead'],
      set1 = west.storage.ItemSetManager._setList,
      perL = () => set1.instance_set_1.bonus[2][0].desc.match(/\(.*?\)/)[0],
      replUml = function (str) {
        return str.toUpperCase().replace(/"/g, '').replace(/[À-Ä]/g, 'A').replace(/[È-Ë]/g, 'E').replace(/[Ì-Ï]/g, 'I').replace(/[Ò-Ö]/g, 'O').replace(/[Ù-Ü]/g, 'U').replace(/Ś/g, 'S');
      },
      dLvlRange = function (dl) {
        return {
          min: Math.ceil(dl / 1.4 + 0.01),
          max: Math.min(450, Math.floor(dl * 1.4 - 0.01))
        };
      },
      emptyBoni = '{"attributes":[],"skills":[],"fortbattle":{"offense":0,"defense":0,"resistance":0},"fortbattlesector":{"defense":0,"offense":0,"damage":0},"item":[]}',
      forbid = {
        sets: ['set_xmas2015_clothing'],
        max: 968,
        //unlock: [],
        IDs: ['138', '860', '1337', '41999', '50106', '50260'],
        maxID: 94265,
        //unlockID: 94245,
        //date: new Date('2023-03-28'),
      };
      if (Game.environment == 'alpha') {
        forbid.sets = [];
        forbid.IDs = ['50106'];
      }
      if (EvName)
        var sendGift = Game.sesData[EvName].friendsbar;
      TWX.GUI = {
        openSelectbox: function () {
          TWX.GUI.makeList();
          var selectbox = new west.gui.Selectbox();
          $(selectbox.getMainDiv()).append('<div class="TWXselbox">');
          selectbox.setHeader(TWX.name);
          selectbox.setWidth(300);
          selectbox.addItem(0, TWXlang.settings1, TWXlang.settings2);
          selectbox.addItem(1, 'SetBonus', TWXlang.setbonus2);
          selectbox.addItem(2, 'BonusSearch', TWXlang.bonussearch2);
          selectbox.addItem(3, 'WebCenter', TWXlang.frame2);
          selectbox.addItem(4, 'NPC locator', TWXlang.npclocator2);
          //selectbox.addItem(5, 'Collections', '');
          selectbox.addItem(6, '<span src="images/quest/employer/ghosttown.png" style="display:inline-block;width:19px;height:19px;background:url(images/quest/employer/ghosttown.png) 0/19px;margin:-5px 0;"></span> ' + TWXlang.ghosttown2, TWXlang.ghosttown3);
          selectbox.addItem(7, '↪ ' + Map.calcWayTime(Map.getLastQueuePosition(), {
              x: 1728,
              y: 2081
            }).formatDuration());
          selectbox.addItem(8, '<span src="images/quest/employer/ghosttown.png" style="display:inline-block;width:19px;height:19px;background:url(images/quest/employer/indianvillage.png) 0/19px;margin:-5px 0;"></span> ' + TWXlang.indiantown2, TWXlang.indiantown3);
          selectbox.addItem(9, '↪ ' + Map.calcWayTime(Map.getLastQueuePosition(), {
              x: 28002,
              y: 16658
            }).formatDuration());
          selectbox.addItem(10, TWXlang.opentrader, TWXlang.opentrader);
          selectbox.addItem(11, TWXlang.openmarket, TWXlang.openmarket);
          selectbox.addItem(12, TWXlang.forum, TWXlang.forum);
          if (EvName) {
            selectbox.addItem(13, '<div style="text-overflow:ellipsis; white-space:nowrap; overflow:hidden;"><b>' + sendGift.label + '</b></div>', sendGift.label);
          }
          selectbox.addListener(function (e) {
            switch (e) {
            case 0:
              TWX.GUI.open('openFeatures');
              break;
            case 1:
              TWX.GUI.open('openBonusWindow', 0, 'SetBonus');
              break;
            case 2:
              TWX.GUI.open('openBonusWindow', 0, 'BonusSearch');
              break;
            case 3:
              TWX.GUI.open('openWebCenter');
              break;
            case 4:
              TWX.GUI.open('openNpcLocator');
              break;
            case 5:
              //TWX.GUI.open('openCollections');
              break;
            case 6:
              Map.center(1728, 2081);
              QuestEmployerWindow.showEmployer('ghosttown', '1728', '2081');
              break;
            case 7:
              QuestEmployerWindow.startWalk({
                key: 'ghosttown',
                x: 1728,
                y: 2081
              });
              break;
            case 8:
              Map.center(28002, 16658);
              QuestEmployerWindow.showEmployer('indianvillage', '28002', '16658');
              break;
            case 9:
              QuestEmployerWindow.startWalk({
                key: 'indianvillage',
                x: 28002,
                y: 16658
              });
              break;
            case 10:
              west.window.shop.open().showCategory('trader');
              break;
            case 11:
              MarketWindow.open(Character.homeTown.town_id);
              break;
            case 12:
              ForumWindow.open();
              break;
            case 13:
              TWX.GUI.open('openSender');
              break;
            }
          });
          var pos = $('div#TWX_menu').offset();
          pos = {
            clientX: pos.left,
            clientY: pos.top
          };
          selectbox.show(pos);
        },
        window: {},
        checkbox: {},
        open: function (tab, data, id) {
          TWX.GUI.window = wman.open('TWX', TWX.name, 'noreload').setMiniTitle(TWX.name).setMaxSize(1268, 838).addTab(TWXlang.features, 'TWXFeatures', TWX.GUI.openFeatures).addTab('Bonus/Sets', 'TWXBonusWindow', TWX.GUI.openBonusWindow).addTab('WebCenter', 'TWXWebCenter', TWX.GUI.openWebCenter).addTab('NPC locator', 'TWXLocator', TWX.GUI.openNpcLocator);
          if (EvName)
            TWX.GUI.window.addTab('Event', 'TWXSender', TWX.GUI.openSender);
          TWX.GUI[tab](data, id);
          $('.tw2gui_window_inset', TWX.GUI.window.getMainDiv()).css('background-image', 'url(' + TWX.Images('LT_backGr', 1) + ')');
        },
        getDefault: function (tab, bT, size, nClose, res) {
          bT = bT ? ['none', '-30px'] : ['', '0px'];
          res = res ? true : false;
          var TGw = TWX.GUI.window,
          wnd = TGw.getMainDiv();
          TGw.setResizeable(res).clearContentPane().activateTab(tab);
          if (!Array.isArray(size) && !['TWXWebCenter'].includes(tab))
            size = [748, 471];
          if (Array.isArray(size))
            TGw.setSize(size[0], size[1]);
          if (nClose)
            TGw.addClass('nocloseall').dontCloseAll = true;
          else
            TGw.removeClass('nocloseall').dontCloseAll = false;
          $('.textart_title', wnd).css('display', bT[0]);
          $(TGw.getContentPane()).css('margin-top', bT[1]);
        },
        openFeatures: function () {
          TWX.GUI.getDefault('TWXFeatures');
          TWX.GUI.window.setTitle(TWX.name + ' v' + TWX.version);
          var featScroll = new west.gui.Scrollpane().appendContent('<h2>' + TWXlang.chooseLang + '</h2>'),
          langBox = new west.gui.Combobox().appendTo(featScroll.getContentPane()),
          closeTxt = west.player.PremiumPurchase.prototype._l10n.buttons.close;
          for (var j in TWX.langs)
            langBox.addItem(j, TWX.langs[j].language);
          langBox.select(TWX.lang);
          TWX.cdTemp = TWX.Data.cooldown ? $.extend({}, TWX.Data.cooldown) : {};
          $('<span title="' + TWXlang.remindHover + '" style="background-image: url(images/items/yield/low_heart_container.png);cursor:pointer;position:absolute;height:73px;width:73px;right:0px;top:0px;">').appendTo(featScroll.getContentPane()).click(function () {
            var cont = $('<span>');
            for (var x in TWX.cdown) {
              var igc = ItemManager.getByBaseId(x);
              if (igc) {
                var productDiv = new tw2widget.JobItem(igc).getMainDiv();
                $(productDiv).css('opacity', TWX.cdTemp[x] || TWX.cdown[x][0]).attr('onclick', 'TWX.cdTemp[' + x + ']=$(this).css("opacity")==1?0.5:1;$(this).css("opacity",TWX.cdTemp[' + x + ']);');
                cont.append(productDiv);
              }
            }
            new west.gui.Dialog(TWXlang.chooseItems, cont).addButton(closeTxt).show();
          });
          TWX.skipTemp = TWX.Data.skipOpen ? $.extend({}, TWX.Data.skipOpen) : $.extend({}, TWX.skipOpen);
          var openSkipList = function () {
            var cont2 = $('<span></span>');
            for (var x in TWX.skipTemp) {
              var productDiv2 = new tw2widget.JobItem(ItemManager.getByBaseId(x)).getMainDiv(),
              productDel = new west.gui.Icon('abort ' + x).getMainDiv().click(function (e) {
                e.stopPropagation();
                e.target.parentElement.remove();
                delete TWX.skipTemp[e.target.classList[2]];
              });
              $(productDel).css({
                'display': 'inline-block',
                'position': 'absolute',
                'right': '0px'
              });
              $(productDiv2).css('opacity', TWX.skipTemp[x]).attr('onclick', 'TWX.skipTemp[' + x + ']=$(this).css("opacity")==1?0.5:1;$(this).css("opacity",TWX.skipTemp[' + x + ']);').append(productDel);
              cont2.append(productDiv2);
            }
            var itemPrew = $('<div id="TWX_add_chest_prew" style="height:73px;width:73px;border:1px solid;border-radius:10px;float:left"><br>');
            var textFP = new west.gui.Textfield('add_skipOpen_chest').maxlength(6).setPlaceholder('item_base_id').addKeyUpListener(function (e) {
              $('#TWX_add_chest_prew').empty();
              iconP.disable();
              var val = e.target.value;
              if (!isNaN(val) && val < forbid.maxID) {
                var item = ItemManager.getByBaseId(val);
                if (item) {
                  $('#TWX_add_chest_prew').append(new tw2widget.JobItem(item).getMainDiv());
                  if (item.action.endsWith(",'yield');") && !TWX.skipTemp[val])
                    iconP.enable();
                }
              }
            }),
            iconP = new west.gui.Iconbutton(new west.gui.Icon('plus'), function () {
              TWX.skipTemp[textFP.getValue()] = 1;
              skipList.hide();
              openSkipList();
            }).disable(),
            iconA = new west.gui.Icon('abort').getMainDiv().click(function () {
              textFP.setValue('');
              $('#TWX_add_chest_prew').empty();
              iconP.disable();
            });
            cont2.append(itemPrew, textFP.getMainDiv(), iconP.getMainDiv(), iconA);
            var skipList = new west.gui.Dialog(TWXlang.chooseItems, cont2).setBlockGame(false).setDraggable(true).addButton(closeTxt).show();
          };
          $('<span title="' + TWXlang.skipHover + '" style="background-image:url(images/items/yield/productchest_1.png);cursor:pointer;position:absolute;height:73px;width:73px;right:0px;top:73px;">').appendTo(featScroll.getContentPane()).click(openSkipList);
          featScroll.appendContent('<br><br><h2>' + TWXlang.features + '</h2>');
          var textGap = {
            ColorTchat: ['Color tchat:'],
            QuickItemsSearch: ['Quick items search:'],
            MarketBestBids: ['Market best bids:', '<img src="images/admin/admin_help.png" title="<span style=\'color:green;\'>', '</span>–', '<br>', '–', '<br><span style=\'color:blue;\'>', '</span>–', '<br><span style=\'color:red;\'>', '</span>–'],
            BattleStars: ['Battle Stars:'],
            KickoMatic: ['Kick-o-Matic:'],
          };
          for (var k in TWX.Features) {
            var label = textGap[k] ? TWX.replaceGaps(TWXlang.Feat[k], textGap[k]) : TWXlang.Feat[k];
            TWX.GUI.checkbox[k] = new west.gui.Checkbox().setLabel(label).setSelected(TWX.Skript.getFeature(k)).appendTo(featScroll.getContentPane());
            featScroll.appendContent('<br><div style="height:5px;">');
          }
          featScroll.appendContent('<br>');
          $(featScroll.getMainDiv()).css({
            'height': '330px',
            'margin-top': '10px'
          });
          var button = new west.gui.Button(TWXlang.save, function () {
            localStorage.setItem('scriptsLang', langBox.getValue());
            TWX.updateLang();
            for (var k in TWX.GUI.checkbox)
              TWX.Data[k] = TWX.GUI.checkbox[k].isSelected();
            TWX.Data.cooldown = TWX.cdTemp;
            TWX.Data.skipOpen = TWX.skipTemp;
            localStorage.setItem('TWLT', JSON.stringify(TWX.Data));
            TWX.Skript.updateFeat();
            new UserMessage(TWXlang.saveMessage2, 'success').show();
          });
          $(TWX.GUI.window.getContentPane()).append(featScroll.getMainDiv()).append(button.getMainDiv());
        },
        makeList: function () {
          if (!TWX.list) {
            //$.getScript(TWX.website + 'files/newSets.js', function () {
            TWX.list = west.storage.ItemSetManager._setArray.slice(0);
            TWX.setListAll = {};
            TWX.setListOwn = {};
            TWX.itemListAll = {};
            TWX.itemListOwn = {};
            var slot = {
              2: ['animal', 'yield'],
              3: ['right_arm', 'left_arm'],
              6: ['body', 'pants', 'neck', 'head', 'foot', 'belt']
            };
            var i = TWX.list.length;
            while (i--) {
              var si = TWX.list[i];
              if (!forbid.sets.includes(si.key) && si.items[0] && !ItemManager.getByBaseId(si.items[0]).short.includes('friendset_') && !si.key.includes('friendship_set_'))
                TWX.setListAll[si.key] = si;
              else
                TWX.list.splice(i, 1);
            }
            TWX.setLength = Object.keys(TWX.setListAll).length;
            for (var j in TWX.setListAll) {
              var sa = TWX.setListAll[j];
              //sa.items.sort((a, b) => a - b);
              var sil = sa.items.length;
              sa.slots = slot[sil] && slot[sil].includes(ItemManager.getByBaseId(sa.items[1]).type) ? slot[sil][0] : 'rest';
              var items = sa.getAvailableItems();
              if (items.length) {
                var bon = {},
                oneType = [],
                c = 1;
                for (var o = 0; o < items.length; o++) {
                  var igt = ItemManager.get(items[o]);
                  items[o] = igt.item_base_id;
                  if (oneType.includes(igt.type)) {
                    --c;
                    continue;
                  }
                  if (sa.bonus[o + c])
                    bon[o + c] = sa.bonus[o + c];
                  oneType.push(igt.type);
                }
                TWX.setListOwn[j] = {
                  items: items.reverse(),
                  bonus: bon,
                  name: sa.name,
                  slots: sa.slots,
                };
              }
            }
            TWX.list.sort(function (a, b) {
              var a1 = replUml(a.name),
              b1 = replUml(b.name);
              return (a1 == b1) ? 0 : (a1 > b1) ? 1 : -1;
            });
            var collect = set1.collector_set.bonus[9], //pray
            pilg = set1.set_pilgrim_male.bonus[2], //build
            hero = set1.independance_event_set7.bonus[2], //drop
            delChar = function (typ, nam, brk) {
              var descr = nam ? west.item.BonusExtractor.prototype.getDesc({
                type: typ,
                name: nam,
                isSector: brk,
                value: ''
              }) : typ.desc;
              if (brk == -1)
                descr = descr.replace(/\(.+?\)/, '');
              return descr.replace(/[0-9]|\+|\.|\%/g, '').trim();
            };
            TWX.searchObj = {
              offense: [delChar(collect[5], 0, -1), 'fort/battle/button_attack'],
              offensetrue: [delChar('fortbattle', 'offense', 1), 'fort/battle/help01'], //collection/item_51474
              defense: [delChar(hero[13], 0, -1), 'fort/battle/button_defend'],
              defensetrue: [delChar('fortbattle', 'defense', 1), 'fort/battle/help02'],
              resistance: [delChar('fortbattle', 'resistance'), 'fort/battle/resistance'],
              damagetrue: [delChar('fortbattle', 'damage', 1), 'items/collection/item_52801'],
              dmgfb: [delChar('fortbattle', 'damage', -1) + ' ' + Inventory.categoryDesc.left_arm, 'items/left_arm/item_53232'],
              dmgduel: [delChar('fortbattle', 'damage', -1) + ' ' + Inventory.categoryDesc.right_arm, 'items/right_arm/item_53228'],
              experience: [delChar(hero[10]), 'items/yield/xp_boost', '<br>'],
              dollar: [delChar(hero[11]), 'items/yield/dollar_boost'],
              luck: [delChar(collect[2]), 'items/yield/luck_boost'],
              drop: [delChar(hero[9]), 'items/yield/product_boost'],
              joball: [delChar(collect[0]), 'window/job/jobstar_small_gold'],
              speed: [delChar(collect[1]), 'jobs/walk'],
              regen: [delChar(collect[3]), 'jobs/sleep'],
              pray: [delChar(collect[4]), 'jobs/pray'],
              job1000: [delChar(pilg[4]), 'jobs/build'],
            };
            for (var ca = 0; ca < CharacterSkills.allSkillKeys.length; ca++) {
              if (ca % 5 === 0) {
                var attr = CharacterSkills.allAttrKeys[ca / 5];
                TWX.searchObj[attr] = [CharacterSkills.keyNames[attr], 'window/skills/circle_' + attr, ca % 10 === 0 ? '<br>' : ''];
              }
              var skill = CharacterSkills.allSkillKeys[ca];
              TWX.searchObj[skill] = [CharacterSkills.keyNames[skill], 'window/skills/skillicon_' + skill];
            }
            var getAvg = function (bvl) {
              bvl = bvl.match(/(\d+\.?\d*)-?(\d*)/);
              return bvl[2] ? (bvl[1] * 1 + bvl[2] * 1) / 2 : bvl[1];
            },
            addItems = function (obj, state) {
              var ob = obj.bonus,
              boni = {
                1: []
              },
              slot = 'item';
              if (JSON.stringify(ob) != emptyBoni) {
                boni[1] = ob.item.slice();
                for (var cat in ob) {
                  var obc = ob[cat];
                  if (cat == 'item')
                    continue;
                  for (var type in obc) {
                    var ct = obc[type];
                    if (ct > 0) {
                      boni[1].push({
                        name: type,
                        value: ct,
                        isSector: cat == 'fortbattlesector'
                      });
                    }
                  }
                }
              } else if (obj.usebonus) {
                slot = 'buff';
                for (var oub of obj.usebonus) {
                  if (!oub)
                    continue;
                  var desc = TWX.QIS.buffDesc(oub),
                  useb = TWX.QIS.useboni[desc];
                  if (TWX.searchObj[useb])
                    boni[1].push({
                      name: useb,
                      value: getAvg(oub),
                      key: oub.includes(perL())
                    });
                }
              }
              if (obj.damage) {
                boni[1].push({
                  name: obj.type == 'left_arm' ? 'dmgfb' : 'dmgduel',
                  value: getAvg(Object.values(obj.damage).join('-'))
                });
              }
              if (boni[1].length)
                TWX['itemList' + state][obj.item_base_id] = {
                  bonus: boni,
                  name: obj.name,
                  slots: slot,
                  itmLvl: obj.item_level,
                };
            };
            var allItems = ItemManager.getAll();
            for (var k in allItems)
              if (k > 9 && k < forbid.maxID && !forbid.IDs.includes(k) && !(allItems[k].set && !TWX.setListAll[allItems[k].set]))
                addItems(allItems[k], 'All');
            for (var l in Bag.items_by_id)
              addItems(Bag.items_by_id[l].obj, 'Own');
            for (var m in Wear.wear)
              addItems(Wear.wear[m].obj, 'Own');
            /*if (!TWX.Data.fDate || Date.parse(forbid.date) > TWX.Data.fDate) {
            var setNames = '',
            nSets = forbid.unlock;
            for (var h of nSets)
            setNames += TWX.GUI.getSetOrItem(h, set1[h]) + '<br>';
            new west.gui.Dialog(TWX.name, '<span><b>' + forbid.date.toDateString() + '</b><br>' + TWXlang.newsets + ':<br><br>' + setNames + '</span>', west.gui.Dialog.SYS_OK).setBlockGame(false).setDraggable(true).addButton('ok').show();
            TWX.Data.fDate = Date.parse(forbid.date);
            localStorage.setItem('TWLT', JSON.stringify(TWX.Data));
            }*/
            //});
          }
        },
        itemsInInv: function (id) {
          var upgrade = isNaN(id) ? TWX.currList[id].items : [id],
          items = [];
          for (var g of upgrade) {
            for (var h = 0; h <= 5; h++) {
              items.push(g * 1000 + h);
            }
          }
          var invItems = Bag.getItemsByItemIds(items);
          if (invItems.length > 0 || Wear.item_ids.includes(items[0])) {
            Wear.open();
            Inventory.showCustomItems(invItems);
          } else
            new UserMessage(TWXlang.noItems, 'hint').show();
        },
        getSetOrItem: function (id, obj, nolink) {
          if (!obj)
            return id;
          var isItem = !isNaN(id),
          nNew = /*window.forbid && (isItem && id >= forbid.unlockID || !isItem && forbid.unlock.includes(id)) ? '<img src="' + TWX.Images('new') + '">' :*/ '',
          nLvl = obj.itmLvl ? '<img src="images/items/item_level.png"><span style="font-size: 11px;color:#ffffff;text-shadow:black -1px 0 1px,black 0 1px 1px,black 1px 0 1px,black 0 -1px 1px;">' + obj.itmLvl + '</span>' : '',
          options = {
            show_alreadyown: true
          };
          if (TWX.lvlToggle)
            options.character = {
              level: TWX.lvlToggle
            };
          var nPopup = 'data-setkey="' + id + '"',
          click = 'onclick="TWX.GUI.itemsInInv(\'' + id + '\')"',
          img = '';
          if (isItem) {
            var itemId = id + '00' + obj.itmLvl,
            item = ItemManager.get(itemId);
            nPopup = 'data-itemid="' + itemId + '" title="' + (new ItemPopup(item, options).getXHTML().escapeHTML()) + '"';
            img = '<img src="' + item.image + '" width="25">';
          } else if ($('.TWXabcSets').length)
            nPopup += 'title="' + TWXlang.showItems + '" style="color:#FFE7B1;"';
          else
            click = 'onclick="TWX.GUI.open(\'openBonusWindow\',\'' + id + '\',\'SetBonus\')"';
          if (nolink)
            click = '';
          return '<b><span class="linklike" ' + nPopup + click + '>' + nNew + img + nLvl + obj.name + '</span></b>';
        },
        newState: '',
        html: {},
        openBonusWindow: function (st, tab) {
          var size = 0,
          btns = ['SetBonus', 'BonusSearch'],
          newSet = false;
          tab = TWX.currTab = btns.includes(tab) && tab || TWX.currTab || btns[0];
          if (tab == btns[1])
            size = [1060, 471];
          TWX.GUI.getDefault('TWXBonusWindow', 0, size);
          TWX.GUI.window.setTitle(tab);
          if (typeof st === 'string') {
            newSet = true;
            TWX['curr' + tab] = st;
          }
          var scrollpane = new west.gui.Scrollpane('TWXBonusScroll');
          $(scrollpane.getMainDiv()).css({
            'margin-left': '105px',
            'margin-top': '10px',
            'width': '593px'
          });
          var types = {},
          lvlUp = function (level, value, ned) {
            var mupl = (value < 1 || ned) ? 10000 : 1,
            ret = !level ? 0 : Math.round(Math.max(1, value * level * 0.1 * mupl)) / mupl;
            return value + ret;
          },
          charLvl = Character.level,
          getBonImg = function (n, w) {
            var son = TWX.searchObj[n] || JobList.getJobById(n.slice(3));
            return '<img src="images/' + (son[1] || 'jobs/' + son.shortname) + '.png" width="' + w + '" title="' + (son[0] || son.name) + '">';
          },
          cdmg = '',
          wpntyp = {
            dmgfb: 'right_arm',
            dmgduel: 'left_arm'
          },
          compare = function (sets, id, list) {
            cdmg = list == 'items' && cdmg;
            for (var i in sets) {
              var si = sets[i];
              if (cdmg) {
                var itm = ItemManager.getByBaseId(i);
                if (itm.type == wpntyp[cdmg] || itm.sub_type == id.subWeapon)
                  continue;
              }
              for (var k in si.bonus)
                for (var ID of si.bonus[k]) {
                  var ib = ID.bonus || ID,
                  NAM = (ib.name || ib.type) + (ib.job || ib.isSector || '');
                  if (id[NAM]) {
                    var spnm = TWX.SPEC.includes(NAM),
                    plbn = ID.key && !TWX.lvlToggle;
                    if (!types[i]) {
                      types[i] = {
                        desc: (spnm ? '% ' : ' ') + (plbn ? perL() : ''),
                        value: {},
                        values: {},
                        compVal: {
                          sum: 0
                        },
                        slots: si.slots,
                        name: si.name,
                        itmLvl: si.itmLvl,
                        items: si.items,
                      };
                    }
                    var tiv = types[i].value;
                    if (!tiv[NAM])
                      tiv[NAM] = 0;
                    tiv[NAM] += ib.value;
                    var NUM = tiv[NAM] * (spnm && types[i].slots != 'buff' ? 100 : 1),
                    lvl = TWX.lvlToggle || Character.level,
                    ned = wpntyp[NAM] && tiv.damage && !TWX.lvlToggle;
                    var VAL = NUM;
                    if (ID.key)
                      VAL = Math.ceil(lvl * VAL);
                    else if (ned)
                      NUM /= lvl;
                    VAL = lvlUp(si.itmLvl, VAL);
                    NUM = TWX.lvlToggle ? VAL : lvlUp(si.itmLvl, NUM, (plbn || ned));

                    if (!types[i].values[k])
                      types[i].values[k] = $.extend({
                        sum: 0
                      }, types[i].values[k - 1]);
                    types[i].values[k][NAM] = NUM * id[NAM];
                    types[i].compVal[NAM] = VAL * id[NAM];
                    types[i].parts = k;
                  }
                }
              if (types[i]) {
                for (var cv in types[i].compVal) {
                  types[i].compVal.sum += types[i].compVal[cv];
                  for (var nv in types[i].values)
                    types[i].values[nv].sum += types[i].values[nv][cv] || 0;
                }
                if (si.items) {
                  for (var is of si.items)
                    if (ItemManager.getByBaseId(is).sub_type != id.subWeapon)
                      types[i].compVal.sum += types[is] ? types[is].compVal.sum : 0;
                }
              }
            }
          },
          reloadLvl = 0,
          showbonus = {
            'SetBonus': function (id) {
              TWX.currSetBonus = id;
              scrollpane.contentPane.empty();
              types = {};
              var sets = TWX.currList[id];
              if (!sets)
                return;
              TWX.GUI.window.setTitle(TWX.GUI.getSetOrItem(id, sets));
              var spCont = '<span style="width:60%;position:absolute;">';
              for (var k in sets.bonus) {
                spCont += '<b>' + k + ' ' + TWXlang.items + ':</b><br>';
                for (var ID of sets.bonus[k]) {
                  var ib = ID.bonus || ID;
                  var NAM = (ib.name || ib.type) + (ib.job || ib.isSector || '');
                  if (!types[NAM]) {
                    var DESC = ID.desc && (TWX.lvlToggle && ID.key && ID.desc.replace(/[0-9]|\+|\.|\([^)]+\)$/g, '') || ID.desc.replace(/[0-9]|\+|\./g, '')) || CharacterSkills.keyNames[NAM];
                    types[NAM] = {
                      key: (ID.key || 0),
                      desc: DESC,
                      value: 0
                    };
                  }
                  types[NAM].value += ib.value;
                }
                for (var m in types) {
                  var n = types[m];
                  var NUM = n.value * (TWX.SPEC.includes(m) ? 100 : 1);
                  var VAL = TWX.lvlToggle && n.key ? Math.ceil(NUM * TWX.lvlToggle) : Math.round(NUM * 1000) / 1000;
                  spCont += getBonImg(m, 23) + ' + ' + VAL + ' ' + n.desc + '<br>';
                }
              }
              spCont += '</span><span style="width:40%;left:60%;position:absolute;">';
              for (var o of TWX.currList[id].items)
                spCont += TWX.GUI.getSetOrItem(o, TWX['itemList' + TWX.currState][o]) + '<br>';
              scrollpane.appendContent(spCont);
              setTimeout(function () {
                var cont = $('div.TWXBonusScroll div.tw2gui_scrollpane_clipper_contentpane > span');
                cont.parent().height(cont.height() + 10);
              }, 100);
            },
            'BonusSearch': function (idString) {
              var id = JSON.parse(idString);
              if (Object.keys(id).length > 2 && !TWX.lvlToggle) {
                TWX.currBonusSearch = idString;
                return lvlBox.select(charLvl);
              }
              scrollpane.contentPane.empty();
              types = {};
              var title = '';
              for (var oi in TWX.searchObj)
                if (id[oi])
                  title += getBonImg(oi, 35) + ' ';
              TWX.GUI.window.setTitle(title);
              var ns = '' + TWX.lvlToggle + TWX.onlyOwnSets;
              if (idString != TWX.currBonusSearch || ns != TWX.GUI.newState || reloadLvl) {
                TWX.currBonusSearch = idString;
                TWX.GUI.newState = ns;
                reloadLvl = 0;
                cdmg = (id.dmgfb ? 'dmgfb' : id.dmgduel ? 'dmgduel' : '');
                if (cdmg)
                  id.damage = id[cdmg];
                compare(TWX['itemList' + TWX.currState], id, 'items');
                compare(TWX.currList, id, 'sets');
                var types2 = Object.keys(types).sort(function (a, b) {
                  return types[b].compVal.sum / types[b].parts - types[a].compVal.sum / types[a].parts;
                }),
                ic = 0;
                TWX.GUI.html = {
                  body: '',
                  right_arm: '',
                  animal: '',
                  rest: '',
                  item: '',
                  buff: '',
                };
                for (var type of types2) {
                  var n = types[type];
                  if (n.slots == 'item' && ic++ > 200)
                    continue;
                  var setval = 0;
                  TWX.GUI.html[n.slots] += '<br>' + TWX.GUI.getSetOrItem(type, n) + '<br>';
                  for (var o in n.values) {
                    if (o == 'sum')
                      continue;
                    var pre = (['item', 'buff'].includes(n.slots) ? '' : o + ' ' + TWXlang.parts + ':');
                    TWX.GUI.html[n.slots] += pre + ' +' + (Math.round(n.values[o].sum * 1000) / 1000) + n.desc + '<br>';
                    setval = n.values[o].sum;
                  }
                  if (n.items) {
                    var ibs = 0;
                    for (var ib of n.items)
                      if (ItemManager.getByBaseId(ib).sub_type != id.subWeapon)
                        ibs += types[ib] ? types[ib].values[1].sum : 0;
                    var pi = ibs + setval;
                    if (`${pi}`.length > 15)
                      pi = Math.round(pi * 100) / 100;
                    TWX.GUI.html[n.slots] += `& ${TWXlang.items}: ${pi}<br>`;
                  }
                }
              }
              scrollpane.appendContent('<span class="TWXBonusS body" style="width:16%;position:absolute;"><h4>' + TWXlang.body + '</h4></span><span class="TWXBonusS right_arm" style="width:16%;left:17%;position:absolute;"><h4>' + TWXlang.right_arm + '</h4></span><span class="TWXBonusS animal" style="width:16%;left:34%;position:absolute;"><h4>' + TWXlang.animal + '</h4></span><span class="TWXBonusS rest" style="width:16%;left:51%;position:absolute;"><h4>' + TWXlang.rest + '</h4></span><span class="TWXBonusS item" style="width:16%;left:68%;position:absolute;"><h4>' + TWXlang.items + '</h4></span><span class="TWXBonusS buff" style="width:16%;right:0;position:absolute;"><h4>' + TWXlang.buff + '</h4></span>');
              for (var hs in TWX.GUI.html)
                $('.TWXBonusS.' + hs).append(TWX.GUI.html[hs]);
              setTimeout(function () {
                var maxHeight = 0;
                for (var h of $('div.TWXBonusScroll span.TWXBonusS'))
                  if (h.clientHeight > maxHeight)
                    maxHeight = h.clientHeight;
                $('div.TWXBonusScroll div.tw2gui_scrollpane_clipper_contentpane').height(maxHeight + 10);
              }, 200);
            },
          },
          loadResult = function () {
            if (TWX.setLength <= forbid.max || TWX.onlyOwnSets || newSet) {
              if (TWX['curr' + tab])
                showbonus[tab](TWX['curr' + tab]);
              newSet = false;
            }
          },
          selbox,
          loadSelbox = function () {
            TWX.currState = TWX.onlyOwnSets ? 'Own' : 'All';
            TWX.currList = TWX['setList' + TWX.currState];
            selbox = new west.gui.Selectbox().setWidth(250);
            TWX.GUI.window.setTitle(tab);
            scrollpane.contentPane.empty();
            if (TWX.setLength <= forbid.max || TWX.onlyOwnSets) {
              if (tab == 'SetBonus') {
                selbox.addListener(showbonus.SetBonus);
                var sbaI = function (j) {
                  var sj = TWX.currList[j];
                  selbox.addItem(j, '<img src=' + (/*forbid.unlock.includes(j) ? TWX.Images('new') :*/ ItemManager.getByBaseId(sj.items[0]).image) + ' height="20" width="20"><div style="padding-right:20px;text-overflow:ellipsis; white-space:nowrap;overflow:hidden;">' + sj.name + '</div>', sj.name);
                };
                if (TWX.setAbc) {
                  for (var h of TWX.list)
                    if (TWX.currList[h.key])
                      sbaI(h.key);
                } else
                  for (var i in TWX.currList)
                    sbaI(i);
              }
              scrollpane.appendContent('<h1>' + TWXlang.choose + '!</h1>');
            } else
              scrollpane.appendContent('<p style="color: #a31919;">ERROR: There are new sets added to the game.<br>Please contact me so I can add the sets to the script:</p>' + TWX.Skript.fmfb());
          },
          img = {
            SetBonus: 'dayofthedead_2014_hat3',
            BonusSearch: 'st_patrick_head',
            shot: 'goldensable',
            hand: 'golden_gun',
          },
          buttonLogic = function (ev, d, b) {
            var butObj = b || ev.data.obj,
            id = butObj.id,
            val = 1;
            if ($(ev.currentTarget).hasClass('butPlus') || d > 0) {
              if (butObj.current_value + 1 > butObj.max_value)
                return false;
            } else {
              if (butObj.current_value - 1 < butObj.min_value)
                return false;
              val = -1;
            }
            butObj.current_value += val;
            if (CharacterSkills.skills[id]) {
              var attr = CharacterSkills.skills[id].attr_key;
              if (!TWX.chooseBonus[attr])
                TWX.chooseBonus[attr] = 0;
              TWX.chooseBonus[attr] += val;
              $('.chooseBonus #' + attr + ' span.displayValue').text(TWX.chooseBonus[attr]);
              if (TWX.chooseBonus[attr] === 0)
                delete TWX.chooseBonus[attr];
            } else if (id.startsWith('dmg')) {
              var othDmg = 'dmgfb' == id ? 'dmgduel' : 'dmgfb';
              $('.chooseBonus #' + othDmg + ' span.displayValue').text(0);
              delete TWX.chooseBonus[othDmg];
            }
            if (butObj.current_value === 0)
              delete TWX.chooseBonus[id];
            else
              TWX.chooseBonus[id] = butObj.current_value;
            $('.chooseBonus #' + id + ' span.displayValue').text(butObj.current_value);
            return true;
          },
          cont,
          getCB = function (id) {
            if (TWX.searchObj[id][2])
              cont.append(TWX.searchObj[id][2]);
            var div = $('<div class="chooseBonus" style="display:inline-block;">' + getBonImg(id, 45)).appendTo(cont);
            new west.gui.Plusminusfield(id, TWX.chooseBonus[id] || 0, -100, 100, 0, buttonLogic, buttonLogic, buttonLogic).setWidth(45).appendTo(div);
          },
          bonSrcTable,
          chooseWindow = function () {
            bonSrcTable && bonSrcTable.hide();
            cont = $('<span>').append('<div style="width:92px;display:inline-block;vertical-align:top;background-color:#A47F5B;border-radius:5px;">' +
                '<img id="switchWeapon" style="cursor:pointer;" src="//wiki.the-west.de/images/1/1a/Switch_weapons_icon.png" title="' + TWXlang.switchWeapon + '" width="45">' +
                '<img id="subWeapon" src="images/items/right_arm/' + img[TWX.chooseBonus.subWeapon] + '.png" width="45"></div>');
            for (var so in TWX.searchObj)
              getCB(so);
            bonSrcTable = new west.gui.Dialog(TWXlang.selectBonus, cont).setId('TWX_BonSrc').setBlockGame(false).setDraggable(true).addButton('ok', function () {
              if (Object.keys(TWX.chooseBonus).length > 1)
                showbonus.BonusSearch(JSON.stringify(TWX.chooseBonus));
              else {
                TWX.currBonusSearch = '';
                loadSelbox();
              }
            }).addButton(TWXlang.resetB, function () {
              TWX.chooseBonus = {
                subWeapon: 'hand'
              };
              chooseWindow();
            }).addButton('cancel').show();
            $('#switchWeapon').click(function () {
              TWX.chooseBonus.subWeapon = TWX.chooseBonus.subWeapon == 'shot' ? 'hand' : 'shot';
              $("#subWeapon").attr('src', 'images/items/right_arm/' + img[TWX.chooseBonus.subWeapon] + '.png');
            });
            $('div.chooseBonus .tw2gui_plusminus').width('auto');
            $('div.chooseBonus').css('margin-left', '2px');
          };
          var btn = tab == btns[0] ? 1 : 0,
          switchTab = new west.gui.Button('⮎ ' + btns[btn], function (e) {
            if (tab != e.data)
              TWX.GUI.openBonusWindow(0, e.data);
          }, '', btns[btn]);
          switchTab = switchTab.getMainDiv();
          $(switchTab).css({
            'margin-top': '-32px',
            'position': 'absolute',
          });
          setbutton = $('<div title="' + TWXlang.choose + '" style="background-image:url(images/items/head/' + img[tab] + '.png);cursor:pointer;height:73px;width:73px;margin:9px;">');
          setbutton.click(function () {
            if (tab == 'SetBonus') {
              var pos = $(setbutton).offset();
              selbox.setPosition(pos.left + 35, pos.top + 50);
              selbox.show();
            } else if (tab == 'BonusSearch' && (TWX.setLength <= forbid.max || TWX.onlyOwnSets))
              chooseWindow();
          });
          var content = $('<div>');
          content.css({
            'width': '95px',
            'position': 'absolute',
          });
          $(TWX.GUI.window.getContentPane()).append(switchTab, content, scrollpane.getMainDiv());
          var maxLvl = 250,
          setsSort = tab == 'SetBonus' ? new west.gui.Checkbox('ABC', 'TWXabcSets', function (state) {
            TWX.setAbc = state;
            loadSelbox();
          }).setSelected(TWX.setAbc, 1).getMainDiv() : '',
          lvlBox = new west.gui.Combobox().setWidth(60).addItem(0, '0').addItem(charLvl, '' + charLvl);
          if (charLvl != maxLvl)
            lvlBox.addItem(maxLvl, '' + maxLvl);
          lvlBox.select(TWX.lvlToggle).addListener(function (lvl) {
            TWX.lvlToggle = lvl;
            loadResult();
          });
          content.append(setbutton, setsSort, '<br><br><b>' + TWXlang.level + ':</b>', lvlBox.getMainDiv());
          new west.gui.Checkbox(TWXlang.ownSets, null, function (state) {
            TWX.onlyOwnSets = state;
            loadSelbox();
            loadResult();
          }).setSelected(TWX.onlyOwnSets).appendTo(content);
          if (tab == 'BonusSearch')
            $('div.tw2gui_window.TWX.active_tab_id_TWXBonusWindow div.tw2gui_scrollpane.TWXBonusScroll').width(915);
        },
        openWebCenter: function (iframe, size) {
          TWX.GUI.getDefault('TWXWebCenter', 1, size, 1, 1);
          var contPan = $(TWX.GUI.window.getContentPane()),
          buttons = {
            'QuakeNet Webchat': '//webchat.quakenet.org',
            'Wiki The-West': Game.helpURL,
            'TW-DB.info': '//tw-db.info'
          };
          for (var b in buttons)
            new west.gui.Button(b, function (e) {
              TWX.GUI.openWebCenter(e.data);
            }, '', buttons[b]).appendTo(contPan);
          if (typeof iframe === 'string')
            contPan.append($('<iframe src="' + iframe + '" style="width:100%; height:94%; border:0; margin-bottom:1px; ">'));
        },
        NPC: {
          loading: false,
          styles: null,
          inner: '',
          Images: {
            reload: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABGdBTUEAALGOfPtRkwAAACBjSFJNAACHDwAAjA8AAP1SAACBQAAAfXkAAOmLAAA85QAAGcxzPIV3AAAKOWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAEjHnZZ3VFTXFofPvXd6oc0wAlKG3rvAANJ7k15FYZgZYCgDDjM0sSGiAhFFRJoiSFDEgNFQJFZEsRAUVLAHJAgoMRhFVCxvRtaLrqy89/Ly++Osb+2z97n77L3PWhcAkqcvl5cGSwGQyhPwgzyc6RGRUXTsAIABHmCAKQBMVka6X7B7CBDJy82FniFyAl8EAfB6WLwCcNPQM4BOB/+fpFnpfIHomAARm7M5GSwRF4g4JUuQLrbPipgalyxmGCVmvihBEcuJOWGRDT77LLKjmNmpPLaIxTmns1PZYu4V8bZMIUfEiK+ICzO5nCwR3xKxRoowlSviN+LYVA4zAwAUSWwXcFiJIjYRMYkfEuQi4uUA4EgJX3HcVyzgZAvEl3JJS8/hcxMSBXQdli7d1NqaQffkZKVwBALDACYrmcln013SUtOZvBwAFu/8WTLi2tJFRbY0tba0NDQzMv2qUP91829K3NtFehn4uWcQrf+L7a/80hoAYMyJarPziy2uCoDOLQDI3fti0zgAgKSobx3Xv7oPTTwviQJBuo2xcVZWlhGXwzISF/QP/U+Hv6GvvmckPu6P8tBdOfFMYYqALq4bKy0lTcinZ6QzWRy64Z+H+B8H/nUeBkGceA6fwxNFhImmjMtLELWbx+YKuGk8Opf3n5r4D8P+pMW5FonS+BFQY4yA1HUqQH7tBygKESDR+8Vd/6NvvvgwIH554SqTi3P/7zf9Z8Gl4iWDm/A5ziUohM4S8jMX98TPEqABAUgCKpAHykAd6ABDYAasgC1wBG7AG/iDEBAJVgMWSASpgA+yQB7YBApBMdgJ9oBqUAcaQTNoBcdBJzgFzoNL4Bq4AW6D+2AUTIBnYBa8BgsQBGEhMkSB5CEVSBPSh8wgBmQPuUG+UBAUCcVCCRAPEkJ50GaoGCqDqqF6qBn6HjoJnYeuQIPQXWgMmoZ+h97BCEyCqbASrAUbwwzYCfaBQ+BVcAK8Bs6FC+AdcCXcAB+FO+Dz8DX4NjwKP4PnEIAQERqiihgiDMQF8UeikHiEj6xHipAKpAFpRbqRPuQmMorMIG9RGBQFRUcZomxRnqhQFAu1BrUeVYKqRh1GdaB6UTdRY6hZ1Ec0Ga2I1kfboL3QEegEdBa6EF2BbkK3oy+ib6Mn0K8xGAwNo42xwnhiIjFJmLWYEsw+TBvmHGYQM46Zw2Kx8lh9rB3WH8vECrCF2CrsUexZ7BB2AvsGR8Sp4Mxw7rgoHA+Xj6vAHcGdwQ3hJnELeCm8Jt4G749n43PwpfhGfDf+On4Cv0CQJmgT7AghhCTCJkIloZVwkfCA8JJIJKoRrYmBRC5xI7GSeIx4mThGfEuSIemRXEjRJCFpB+kQ6RzpLuklmUzWIjuSo8gC8g5yM/kC+RH5jQRFwkjCS4ItsUGiRqJDYkjiuSReUlPSSXK1ZK5kheQJyeuSM1J4KS0pFymm1HqpGqmTUiNSc9IUaVNpf+lU6RLpI9JXpKdksDJaMm4ybJkCmYMyF2TGKQhFneJCYVE2UxopFykTVAxVm+pFTaIWU7+jDlBnZWVkl8mGyWbL1sielh2lITQtmhcthVZKO04bpr1borTEaQlnyfYlrUuGlszLLZVzlOPIFcm1yd2WeydPl3eTT5bfJd8p/1ABpaCnEKiQpbBf4aLCzFLqUtulrKVFS48vvacIK+opBimuVTyo2K84p6Ss5KGUrlSldEFpRpmm7KicpFyufEZ5WoWiYq/CVSlXOavylC5Ld6Kn0CvpvfRZVUVVT1Whar3qgOqCmrZaqFq+WpvaQ3WCOkM9Xr1cvUd9VkNFw08jT6NF454mXpOhmai5V7NPc15LWytca6tWp9aUtpy2l3audov2Ax2yjoPOGp0GnVu6GF2GbrLuPt0berCehV6iXo3edX1Y31Kfq79Pf9AAbWBtwDNoMBgxJBk6GWYathiOGdGMfI3yjTqNnhtrGEcZ7zLuM/5oYmGSYtJoct9UxtTbNN+02/R3Mz0zllmN2S1zsrm7+QbzLvMXy/SXcZbtX3bHgmLhZ7HVosfig6WVJd+y1XLaSsMq1qrWaoRBZQQwShiXrdHWztYbrE9Zv7WxtBHYHLf5zdbQNtn2iO3Ucu3lnOWNy8ft1OyYdvV2o/Z0+1j7A/ajDqoOTIcGh8eO6o5sxybHSSddpySno07PnU2c+c7tzvMuNi7rXM65Iq4erkWuA24ybqFu1W6P3NXcE9xb3Gc9LDzWepzzRHv6eO7yHPFS8mJ5NXvNelt5r/Pu9SH5BPtU+zz21fPl+3b7wX7efrv9HqzQXMFb0ekP/L38d/s/DNAOWBPwYyAmMCCwJvBJkGlQXlBfMCU4JvhI8OsQ55DSkPuhOqHC0J4wybDosOaw+XDX8LLw0QjjiHUR1yIVIrmRXVHYqLCopqi5lW4r96yciLaILoweXqW9KnvVldUKq1NWn46RjGHGnIhFx4bHHol9z/RnNjDn4rziauNmWS6svaxnbEd2OXuaY8cp40zG28WXxU8l2CXsTphOdEisSJzhunCruS+SPJPqkuaT/ZMPJX9KCU9pS8Wlxqae5Mnwknm9acpp2WmD6frphemja2zW7Fkzy/fhN2VAGasyugRU0c9Uv1BHuEU4lmmfWZP5Jiss60S2dDYvuz9HL2d7zmSue+63a1FrWWt78lTzNuWNrXNaV78eWh+3vmeD+oaCDRMbPTYe3kTYlLzpp3yT/LL8V5vDN3cXKBVsLBjf4rGlpVCikF84stV2a9021DbutoHt5turtn8sYhddLTYprih+X8IqufqN6TeV33zaEb9joNSydP9OzE7ezuFdDrsOl0mX5ZaN7/bb3VFOLy8qf7UnZs+VimUVdXsJe4V7Ryt9K7uqNKp2Vr2vTqy+XeNc01arWLu9dn4fe9/Qfsf9rXVKdcV17w5wD9yp96jvaNBqqDiIOZh58EljWGPft4xvm5sUmoqbPhziHRo9HHS4t9mqufmI4pHSFrhF2DJ9NProje9cv+tqNWytb6O1FR8Dx4THnn4f+/3wcZ/jPScYJ1p/0Pyhtp3SXtQBdeR0zHYmdo52RXYNnvQ+2dNt293+o9GPh06pnqo5LXu69AzhTMGZT2dzz86dSz83cz7h/HhPTM/9CxEXbvUG9g5c9Ll4+ZL7pQt9Tn1nL9tdPnXF5srJq4yrndcsr3X0W/S3/2TxU/uA5UDHdavrXTesb3QPLh88M+QwdP6m681Lt7xuXbu94vbgcOjwnZHokdE77DtTd1PuvriXeW/h/sYH6AdFD6UeVjxSfNTws+7PbaOWo6fHXMf6Hwc/vj/OGn/2S8Yv7ycKnpCfVEyqTDZPmU2dmnafvvF05dOJZ+nPFmYKf5X+tfa5zvMffnP8rX82YnbiBf/Fp99LXsq/PPRq2aueuYC5R69TXy/MF72Rf3P4LeNt37vwd5MLWe+x7ys/6H7o/ujz8cGn1E+f/gUDmPP8usTo0wAAAAlwSFlzAAALEgAACxIB0t1+/AAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xMkMEa+wAAAKaSURBVEhLjVW/i1NBEF5/NKKiCBaCIOTtxvMKKzuRE0UFr71wZ17CqdgfcqViGv+Bg1x1INgKFqKnHKJBk7cbf5DCUk08Kxs7QQvF+H37Nsnuy0twYMjLzDffzszO7opJUnogdsWJmo+1rJe1fB1r9RHfXXw38bt2JYkuzTXmdjv4f0hf7ADJctnIXmxUf5pikV65HVVd5GQpvS8cAOGTPJJpWtbq0fXW8f2OJpSUVHWGYKM+IaO7WOg+Knhp/xv1yyfM6DtyODontny5mQH+WTTqhEOkAhyyazj/Tw+bKjiIcWghkMnVLAgE9xb00T0OYiVuy4upT36PX80cQdzGWBy4LJg7C5KvAQCk1umJnRIjP9hgLW86s2ACQaxR23ZaqkZd9h1cpLJ1ci+DSo3ZfSBb4Xesizc83OPS87SfrAot+OL5+nFbzQt81AOjI6Ig4CGy/xub6Cyy/ObjUPIzBxNxIlcCn1brLCXxjRUdSYKXWoVTI7v84WOG2lZniF1syci3k5MZfx4Z5e9aTewkmH0c2SfqLWLtVCF2aMcJZbndEdAjNmp1ZM9XYG4Ty5iAGMmSIGgFy7LEunjat+dqUjxPLNsX+mSLPV4PjNgIgilYdCvw+YrLaHAYQBRsHv7XMfS4wXwjRmdwMBb07CGAXgT+FNO81pGHU0zOuOFWzD0guB82GGQFWS0lxXMIvoMNrVWMvDDYBwpigwNCruF1ipLHjzTIs0faF/qIGY9zR9oKx2X8EmLJ2wCuVt/MFJkltfxWFeyByJaf4p8GlxAle22OK8cpGKmsdpYbxw46ulBIzlVzgqZrW25OJB2KbQueJjw7uSSeosc929Ns+dOEO8sHExWsQZtoQxckfEUSO/sYU16lDp4RIf4Bo1TrJPOKTCMAAAAASUVORK5CYII=',
          },
          load: function () {
            if (!this.loading) {
              this.loading = true;
              new UserMessage(TWXlang.NPC.loading, 'hint').show();
              Ajax.get('map', 'get_minimap', {}, function (json) {
                if (json.error)
                  return new UserMessage(json.msg).show();
                var locs = [
                ];
                var ql = json.quest_locations;
                for (var loc in ql)
                  if (ql.hasOwnProperty(loc))
                    locs.push([parseInt(ql[loc][0][0] / Map.tileSize),
                        parseInt(ql[loc][0][1] / Map.tileSize)]);
                Ajax.get('map', 'get_complete_data', {
                  tiles: JSON.stringify(locs)
                }).done(function (res) {
                  var ne = TWX.GUI.NPC.employers = {};
                  var rq = res.quests;
                  for (var g = 0; g < locs.length; g++) {
                    var em = rq[locs[g][0]][locs[g][1]][0][1];
                    for (var h = 0; h < em.employer.length; h++)
                      if (!ne[em.employer[h].name])
                        ne[em.employer[h].name] = em.x + ';' + em.y;
                      else
                        ne[em.employer[h].name] += '|' + em.x + ';' + em.y;
                  }
                  var ne2 = Object.keys(ne).sort(function (a, b) {
                    a = a.toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ł/g, 'l').replace(/ś/g, 's');
                    b = b.toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ł/g, 'l').replace(/ś/g, 's');
                    return (a > b) ? 1 : -1;
                  });
                  for (var j = 0; j < ne2.length; j++)
                    TWX.GUI.NPC.inner += '<option value="' + ne[ne2[j]] + '">' + ne2[j] + '</option>';
                  TWX.GUI.NPC.open();
                  TWX.GUI.NPC.loading = false;
                });
              });
              if (!this.styles) {
                TWX.addStyle('#njk_minimap span.adv_pointer, #njk_minimap #char_pointer {position:absolute;height:16px;width:16px;cursor:pointer;}\n' +
                  '#njk_minimap span.npcHelper {display:block;text-indent:20px;line-height:16px;}\n' +
                  '.tw2gui_win2.active_tab_id_TWXLocator .tw2gui_window_inset {background-image:url(images/crafting/background.jpg)!important;}');
                this.styles = 1;
              }
            }
          },
          open: function () {
            TWX.GUI.getDefault('TWXLocator');
            var wnd = TWX.GUI.window;
            wnd.setTitle(TWXlang.NPC.title);
            var mm_mapdiv = $('<div id="njk_minimap_map" style="position:relative;height:220px;background:no-repeat url(images/map/minimap/worldmap_500.jpg);">'),
            CharX = Character.position.x,
            CharY = Character.position.y,
            x = 685 * CharX / 182 / 256 - 6,
            y = 302 * CharY / 80 / 256 - 6;
            x *= 0.727;
            y *= 0.727;
            this.charPoint = '<span title="' + TWXlang.NPC.yourposition + '" id="char_pointer" onClick="Map.center(' + CharX + ',' + CharY + ')" style="left:' + x + 'px;top:' + y + 'px;background-image:url(images/map/minimap/icons/miniicon_pos.png);">';
            mm_mapdiv.append(this.charPoint);
            wnd.appendToContentPane($('<div id="njk_minimap" style="margin:20px 93px;width:500px">').append(mm_mapdiv));
            this.drawSelect();
          },
          drawSelect: function () {
            var selectDiv = document.createElement('div');
            selectDiv.style.cssText = 'font-size:11px;';
            selectDiv.style.height = '40px';
            selectDiv.style.textAlign = 'right';
            selectDiv.innerHTML = '<img src="' + this.Images.reload + '" onclick="TWX.GUI.NPC.load()" style="margin:-6px 4px 0;cursor:pointer;" title="' + TWXlang.NPC.reload + '"><select style="background-color:#e8dab3;font-size:14px;width:200px;cursor:pointer" onchange="TWX.GUI.NPC.questPoint(this);" size="1">' +
              '<option selected disabled>-' + TWXlang.NPC.chooseNpc + '</option>' + this.inner +
              '</select><div style="float:left;text-align:left;color:black;"><span class="npcHelper" style="background:no-repeat url(images/map/minimap/icons/miniicon_pos.png);">' + TWXlang.NPC.yourposition + '</span><span class="npcHelper" style="background:no-repeat url(images/map/minimap/icons/miniicon_quests.png);">' + TWXlang.NPC.questgiver + '</span></div>';
            var mm2 = document.getElementById('njk_minimap');
            mm2.insertBefore(selectDiv, mm2.firstChild);
          },
          questPoint: function (place) {
            var dp = $('#njk_minimap_map'),
            positions = place.value,
            arrPos = positions.split('|');
            dp.find('.adv_pointer').remove();
            for (var i = 0; i < arrPos.length; i++) {
              var xy = arrPos[i].split(';'),
              x = 685 * xy[0] / 182 / 256 - 6,
              y = 302 * xy[1] / 80 / 256 - 6;
              x = x * 0.727;
              y = y * 0.727;
              dp.append('<span class="adv_pointer" onClick="Map.center(' + xy[0] + ',' + xy[1] + ')" id="mapPos' + i + '" px="' + xy[0] + '" py="' + xy[1] + '" style="left:' + x + 'px; top:' + y + 'px;background-image:url(images/map/minimap/icons/miniicon_quests.png);">');
            }
          },
        },
        openNpcLocator: function () {
          if (!TWX.GUI.NPC.employers)
            TWX.GUI.NPC.load();
          else if (TWX.GUI.NPC.loading === false)
            TWX.GUI.NPC.open();
        },
        openSender: function () {
          TWX.GUI.getDefault('TWXSender');
          var EvImg = EvName == 'Octoberfest' ? 'window/events/octoberfest/pretzels_icon' : 'interface/friendsbar/events/' + EvName;
          TWX.GUI.window.setTitle(sendGift.label + '    <img src="images/' + EvImg + '.png">');
          if (!isDefined(WestUi.FriendsBar.friendsBarUi))
            WestUi.FriendsBar.toggle();
          setTimeout((function () {
              var e = [],
              t = Chat.Friendslist.getFriends(),
              WFfe = WestUi.FriendsBar.friendsBarUi.friendsBar.eventActivations,
              i,
              s,
              u,
              a;
              for (s = 0; s < t.length; s++) {
                i = typeof WFfe[t[s].playerId] != 'undefined' && WFfe[t[s].playerId][EvName] != 'undefined' ? WFfe[t[s].playerId][EvName] : 0;
                e.push({
                  n: t[s].pname,
                  i: t[s].playerId,
                  t: i
                });
              }
              e.sort(Sort.create('asc', function (e) {
                  return e.t;
                }));
              i = $('<table align="center" border="1" cellpadding="2px" border="1">');
              for (s = 0; s < e.length; s++) {
                u = e[s].t + parseInt(sendGift.cooldown, 10) - new ServerDate().getTime() / 1000;
                if (u > 0) {
                  a = $('<td>(' + u.formatDurationBuffWay() + ')</td>');
                } else {
                  a = $('<td><a href="#">' + sendGift.label + '</a></td>').click(e[s].i, function (e) {
                    $(this).parent().remove();
                    Ajax.remoteCall('friendsbar', 'event', {
                      player_id: e.handleObj.data,
                      event: EvName
                    }, function (t) {
                      if (t.error)
                        return MessageError(t.msg).show();
                      MessageSuccess(t.msg).show();
                      var n = e.handleObj.data;
                      WFfe[n] = WFfe[n] || {};
                      WFfe[n][EvName] = t.activationTime;
                    });
                  });
                }
                i.append($('<tr>)').append($('<td>' + e[s].n + '</td>'), a));
              }
              var scrollpane = new west.gui.Scrollpane();
              $(scrollpane.getMainDiv()).css({
                'margin-top': '10px',
                'width': '340px',
                'position': 'absolute',
              });
              scrollpane.appendContent(i);
              if (t.length === 0)
                scrollpane.appendContent('<h2 style="text-align:center;color:#a31919;margin-top:50px;">' + TWXlang.noFriends + '</h2>');
              var scrollP = new west.gui.Scrollpane();
              $(scrollP.getMainDiv()).css({
                'margin-top': '10px',
                'margin-left': '345px',
                'width': '353px', //698-345
              });
              if (EvName == 'Hearts' || EvName == 'DayOfDead') {
                var name = '',
                weMmd = west.events.Manager.model._data.events;
                if (EvName == 'Hearts')
                  name = weMmd.valentine.model._data.name;
                else
                  name = weMmd.DayOfDead.model._l10n.ui.mouseover + ' ' + new Date().getFullYear();
                scrollP.appendContent('<h3>' + name + '</h3>');
                //west.events.Manager.getRunningEvents()
                var rew = Game.sesData[EvName].rewards;
                for (var r in rew) {
                  var div = $('<div>');
                  div.append('<img src="images/' + EvImg + '.png">  <b>' + r + '</b><br>' + rew[r].desc + '<br>');
                  var id = rew[r].id;
                  if (isNaN(id))
                    div.append('<i>' + TWXlang.reward + ': ' + id + '</i><br><br>');
                  else {
                    var invItem = new tw2widget.JobItem(ItemManager.get(id));
                    div.append(invItem.getMainDiv()).append('<br><br><br><br><br>');
                  }
                  scrollP.appendContent(div);
                }
              }
              $(TWX.GUI.window.getContentPane()).append(scrollpane.getMainDiv(), scrollP.getMainDiv());
            }), 500);
        },
      };
      TWX.RecipeMarket = {
        init: function () {
          var inject = function (category, data) {
            $('#TWXRecipeMarket').remove();
            if (category == 'recipe') {
              var gLS4P = Game.InfoHandler.getLocalString4ProfessionId,
              prof = ['cook', 'quack', 'smith', 'sattle'],
              buttons_recipe = '<div id="TWXRecipeMarket"><a href="javascript:TWX.RecipeMarket.filterRecipe(0);"><img title="' + TWXlang.allprofessions + '" src="' + TWX.Images('LT_recipes') + '" ></a>';
              for (var b = 1; b < 5; b++)
                buttons_recipe += '<a href="javascript:TWX.RecipeMarket.filterRecipe(' + b + ');"><img title="' + gLS4P(b) + '" style="width:30px;" src="images/items/recipe/recipe_' + prof[b - 1] + '.png"></a>';
              $('.searchbox').before($(buttons_recipe + '</div>'));
              $('.searchbox').css('margin-bottom', '0');
              data.sort(function (a, b) {
                return ItemManager.get(a).min_level - ItemManager.get(b).min_level;
              });
              TWX.RecipeMarket.Recipe = data;
            } else
              $('.searchbox').css('margin-bottom', '18px');
            return data;
          };
          MarketWindow.Buy.updateCategory_twx = MarketWindow.Buy.updateCategory_twx || MarketWindow.Buy.updateCategory;
          MarketWindow.Buy.updateCategory = function (category, data) {
            data = inject(category, data);
            MarketWindow.Buy.updateCategory_twx.call(this, category, data);
          };
          MarketWindow.getClearName_twx = MarketWindow.getClearName;
          MarketWindow.getClearName = function (obj) {
            var name = obj.name;
            if (obj.type == 'recipe')
              name = ItemManager.get(obj.craftitem).name;
            return name;
          };
        },
        filterRecipe: function (pid) {
          var data = $('#mpb_recipe_content p');
          data.show();
          if (pid === 0)
            return;
          for (var i = 0; i < TWX.RecipeMarket.Recipe.length; i++)
            if (pid != ItemManager.get(TWX.RecipeMarket.Recipe[i]).profession_id)
              $(data[i]).hide();
        }
      };
      TWX.AchievHide = {
        init: function () {
          var setVal10 = setInterval(function () {
            if (!window.Character)
              return;
            clearInterval(setVal10);
            var pCp = '.playerachievement-' + Character.playerId,
            hideAchv = function () {
              $(pCp + ' .achievement > div:first-child:not(.achievement_unachieved)').parent().hide();
            },
            folder,
            ready = function () {
              return $(pCp + ' .tw2gui_window_pane .loader')[0].style.display == 'none';
            },
            checkFolder = function (e) {
              var cTc = e.currentTarget.parentElement.classList[0],
              cTft = e.currentTarget.textContent;
              if (cTc + cTft == folder || ['overall', 'heroics'].includes(cTc))
                folder = 1;
              else {
                folder = cTc + cTft;
                var wait2 = setInterval(function () {
                  if (ready()) {
                    clearInterval(wait2);
                    hideAchv();
                  }
                }, 100);
              }
            },
            AW = AchievementWindow;
            AW.showTab_twx = AW.showTab_twx || AW.showTab;
            AW.showTab = function (id) {
              AW.showTab_twx.apply(this, arguments);
              if (id == 'explorer')
                var wait1 = setInterval(function () {
                  if (ready()) {
                    clearInterval(wait1);
                    var atb = $(pCp + ' .achievement-menu li > .tw2gui_button');
                    atb.click(checkFolder);
                    folder = 'general' + atb[1].textContent;
                    hideAchv();
                  }
                }, 100);
            };
          }, 2000);
        }
      };
      TWX.MarketMessage = {
        Towns: {},
        init: function () {
          Ajax.get('map', 'get_minimap', {}, function (json) {
            if (json.error)
              return new UserMessage(json.msg).show();
            TWX.MarketMessage.Towns = json.towns;
            EventHandler.listen('position_change', function () {
              TWX.MarketMessage.check();
            });
            var setVal2 = setInterval(function () {
              if (Character.position.x) {
                clearInterval(setVal2);
                TWX.MarketMessage.check();
              }
            }, 1000);
          });
        },
        check: function () {
          var town_id,
          offers,
          bids,
          fetch = function (action) {
            Ajax.remoteCall('building_market', action, {}, function (resp) {
              if (resp.error)
                return new UserMessage(resp.msg).show();
              Character.setDeposit(resp.deposit);
              Character.setMoney(resp.cash);
              return new MessageSuccess(resp.msg).show();
            });
          };
          var fetchAll = function (what) {
            if (what == 1)
              fetch('fetch_town_offers');
            fetch('fetch_town_bids');
            EventHandler.signal('inventory_changed');
          };
          var showDialog = function () {
            new west.gui.Dialog(TWXlang.market1, TWXlang.market2, west.gui.Dialog.SYS_QUESTION).addButton(TWXlang.all, function () {
              fetchAll(1);
            }).addButton(TWXlang.onlyBids, function () {
              fetchAll(0);
            }).addButton(TWXlang.nothing).show();
          };
          var checkItems = function () {
            for (var g = 0; g < bids.length; g++) {
              var bgs = bids[g];
              if (bgs.market_town_id == town_id && (bgs.auction_ends_in < 0 || bgs.current_bid == bgs.max_price)) {
                showDialog();
                return;
              }
            }
            for (var f = 0; f < offers.length; f++) {
              var ofs = offers[f];
              if (ofs.market_town_id == town_id && (ofs.auction_ends_in < 0 || ofs.max_price && ofs.current_bid == ofs.max_price)) {
                showDialog();
                return;
              }
            }
          };
          var get_offers = function () {
            Ajax.remoteCall('building_market', 'fetch_offers', {
              page: 0
            }, function (json) {
              offers = json.msg.search_result;
              checkItems();
            });
          };
          var get_bids = function () {
            Ajax.remoteCall('building_market', 'fetch_bids', {}, function (json) {
              bids = json.msg.search_result;
              get_offers();
            });
          };
          var towns = TWX.MarketMessage.Towns;
          for (var k in towns)
            if (towns[k].x == Character.position.x && towns[k].y == Character.position.y) {
              town_id = towns[k].town_id;
              var wait = Character.health < 6 ? Character.playerId.toString().substr(-4) : 1;
              setTimeout(function () {
                get_bids();
              }, wait);
            }
        }
      };
      TWX.MarkDaily = {
        init: function () {
          var addBorder = function () {
            var rows = $('.reward-row');
            var row = $(rows[4]);
            if (row.hasClass('today'))
              row.css('border', '20px solid red');
          };
          var wpLp = west.player.LoginBonus.prototype;
          wpLp.show_twx = wpLp.show;
          wpLp.show = function () {
            var tmp = wpLp.show_twx.call(this);
            if (tmp !== undefined)
              return tmp;
            addBorder();
          };
        }
      };
      TWX.DuelMap = {
        init: function () {
          var generateNpcPopup = function (data) {
            var weapon = ItemManager.get(data.weaponId),
            damage = weapon.getDamage(data),
            npcData = data.bonus;
            return '<table class="dln_npcskill_popup"><tr><td colspan="5" class="text_bold">' + TWXlang.popup + '<br>&nbsp;</td></tr><tr><td><img src="images/window/duels/npcskill_shot.jpg"></td><td><img src="images/window/duels/npcskill_punch.jpg"></td><td><img src="images/window/duels/npcskill_aim.jpg"></td><td><img src="images/window/duels/npcskill_appearance.jpg"></td><td></td></tr><tr><td class="text_bold">' + (npcData.shot || 0) + '</td><td class="text_bold">' + (npcData.punch || 0) + '</td>' + '<td class="text_bold">' + (npcData.aim || 0) + '</td><td class="text_bold">' + (npcData.appearance || 0) + '</td><td></td></tr>' + '<tr><td><img src="images/window/duels/npcskill_tactic.jpg"></td><td><img src="images/window/duels/npcskill_reflex.jpg"></td><td><img src="images/window/duels/npcskill_dodge.jpg"></td><td><img src="images/window/duels/npcskill_tough.jpg"></td><td><img src="images/window/duels/npcskill_health.jpg"></td></tr><tr><td class="text_bold">' + (npcData.tactic || 0) + '</td><td class="text_bold">' + (npcData.reflex || 0) + '</td><td class="text_bold">' + (npcData.dodge || 0) + '</td><td class="text_bold">' + (npcData.tough || 0) + '</td><td class="text_bold">' + (npcData.health || 0) + '</td></tr><tr><td colspan="2" class="text_bold"><img src="' + weapon.image + '"></td><td colspan="3" class="text_bold"><br>' + weapon.name + '<br>(' + TWXlang.damage + ': ' + damage.min + ' - ' + damage.max + ')</td></tr></table>';
          };
          Ajax.remoteCallMode('character', 'get_info', {}, function (resp) {
            Character.setDuelLevel(resp.duelLevel);
          });
          var progB = new west.gui.Progressbar(0, 100);
          progB.setTextOnly(true);
          $(progB.getMainDiv()).css('width', '772px');
          var fillPage = function () {
            $('#TWXDuelMapTable').empty();
            $('#TWXDuelMapPlayers').empty();
            $('#TWXDuelMapTable').append('<tr><th>' + TWXlang.name + '</th><th>' + TWXlang.town + '</th><th>' + TWXlang.level + '</th><th>' + TWXlang.duelLevel + '</th><th>' + TWXlang.exp + '</th><th>' + TWXlang.distance + '</th><th>' + TWXlang.startduel + '</th><th>' + TWXlang.centerMap + '</th></tr>');
            for (var k in TWX.DuelMap.Player) {
              var data = TWX.DuelMap.Player[k];
              var content = $('<tr></tr>');
              content.append('<td><a href="javascript:void(PlayerProfileWindow.open(' + data.player_id + '));" title="' + (Character.charClass == 'duelist' ? generateNpcPopup(data).escapeHTML() : '') + '">' + data.player_name + '</a></td>',
                '<td><a href="javascript:void(TownWindow.open(' + data.town_x + ',' + data.town_y + '));">' + data.town_name + '</a></td>',
                '<td>' + data.level + '</td>',
                '<td>' + data.duellevel + '</td>',
                '<td>' + Math.round((7 * data.duellevel - 5 * Character.duelLevel + 5) * Character.duelMotivation) + '</td>',
                '<td>' + window.Map.calcWayTime(Map.getLastQueuePosition(), {
                  x: data.character_x,
                  y: data.character_y
                }).formatDuration() + '</td>',
                '<td><a href="#" onclick="SaloonWindow.startDuel(' + data.player_id + ', ' + data.alliance_id + ', false, DuelsWindow);">' + TWXlang.startduel + '</a></td>',
                '<td><a href="#" onclick="Map.center(' + data.character_x + ', ' + data.character_y + ');">' + TWXlang.centerMap + '</a></td>');
              $('#TWXDuelMapTable').append(content);
              content = $('<div style="position:absolute;border:1px solid black;background:#FF0000;width:4px;height:4px;left:' + (data.character_x / 46592 * 770 - 2) + 'px;top:' + (data.character_y / 20480 * 338 - 2) + 'px;">');
              eval('content.click(function () { SaloonWindow.startDuel(' + data.player_id + ', ' + data.alliance_id + ', false, DuelsWindow); });');
              content.addMousePopup('<b>' + data.player_name + '</b> ' + window.Map.calcWayTime(Map.getLastQueuePosition(), {
                  x: data.character_x,
                  y: data.character_y
                }).formatDuration());
              $('#TWXDuelMapPlayers').append(content);
            }
            $('<div style="position:absolute;border:1px solid black;background:#00CCFF;width:4px;height:4px;left:' + (Character.position.x / 46592 * 770 - 2) + 'px;top:' + (Character.position.y / 20480 * 338 - 2) + 'px;">').addMousePopup('Deine Position').appendTo('#TWXDuelMapPlayers');
          };
          var getPlayer = function (i, distance) {
            if (i == -1) {
              progB.setValue(0);
              TWX.DuelMap.Player = {};
              i++;
            }
            Ajax.remoteCall('duel', 'search_op', {
              next: true,
              order_by: 'ASC',
              sort: 'range',
              page: i,
              distance: distance * 60
            }, function (json) {
              var l = json.oplist.pclist.length;
              for (var j = 0; j < l; j++) {
                var plyr = json.oplist.pclist[j].player_name;
                if (!TWX.DuelMap.Player[plyr]) {
                  TWX.DuelMap.Player[plyr] = json.oplist.pclist[j];
                  progB.increase(1);
                }
              }
              if (json.oplist.next && i < 40) {
                getPlayer(++i, distance);
                return;
              }
              TWX.DuelMap.progBVal = progB.getValue();
              fillPage();
            });
          };
          TWX.addStyle('.tw2gui_win2.active_tab_id_TWXDuelMap .tw2gui_window_inset {background-image:url(' + TWX.Images('LT_backGr', 1) + ');}');
          var showTab = function (win, id) {
            var wnd = DuelsWindow.window;
            wnd.setSize(815, 655).addClass('nocloseall noreload');
            wnd.dontCloseAll = true;
            wnd.activateTab(id).$('div.tw2gui_window_content_pane > *').each(function (i, e) {
              if ($(e).hasClass('duels-' + id)) {
                $(e).children().fadeIn();
                $(e).show();
              } else {
                $(e).children().fadeOut();
                $(e).hide();
              }
            });
            wnd.setTitle(TWXlang.duelmap);
            if (Object.keys(TWX.DuelMap.Player).length === 0) {
              TWX.DuelMap.progBVal = 0;
              getPlayer(-1, 15);
            } else
              progB.setValue(TWX.DuelMap.progBVal);
          };
          var initDuelMap = function () {
            DuelsWindow.window.addTab(TWXlang.duelmap, 'TWXDuelMap', showTab);
            TWX.DuelMap.Player = {};
            var area = $('<div class="duels-TWXDuelMap" style="display:none;">').appendTo(DuelsWindow.window.getContentPane()),
            content = $('<div style="height:350px;top:10px;position:relative">'),
            left = 0,
            top = 0;
            for (var i = 1; i <= 15; i++) {
              var img = $('<img style="position:absolute;border:1px solid #000;width:110px;height:169px;left:' + left + 'px;top:' + top + 'px;" src="images/map/minimap/county_' + i + '.jpg">');
              left += 110;
              if (i === 7) {
                left = 0;
                top = 169;
              }
              if (i === 4 || i === 11) {
                img.css('height', '114px');
              }
              if (i === 11) {
                img.css('top', top + 55 + 'px');
              }
              if (i === 15) {
                img.css({
                  height: '110px',
                  left: '330px',
                  top: '114px'
                });
              }
              content.append(img);
            }
            content.append('<div id="TWXDuelMapPlayers">');
            content.appendTo(area);
            area.append(progB.getMainDiv());
            var scrollpane = new west.gui.Scrollpane().appendTo(area);
            $(scrollpane.getMainDiv()).css('height', '185px');
            scrollpane.appendContent(TWXlang.duelradius + '    ');
            var combobox = new west.gui.Combobox().setWidth(120).addItem('15', '15 ' + TWXlang.minutes).addItem('30', '30 ' + TWXlang.minutes).addItem('60', TWXlang.hour).addItem('120', '2 ' + TWXlang.hours).addItem('240', '4 ' + TWXlang.hours).addItem('360', '6 ' + TWXlang.hours).select('15').appendTo(scrollpane.getContentPane());
            new west.gui.Button(TWXlang.searchOpp).appendTo(scrollpane.getContentPane()).click(function () {
              getPlayer(-1, combobox.getValue());
            });
            scrollpane.appendContent('<table border="1" id="TWXDuelMapTable"></table>');
          };
          DuelsWindow.open_twx = DuelsWindow.open;
          DuelsWindow.open = function () {
            var tmp = DuelsWindow.open_twx.call(this);
            if (tmp)
              return tmp;
            initDuelMap();
          };
          DuelsWindow.showTab_twx = DuelsWindow.showTab;
          DuelsWindow.showTab = function (id) {
            var tmp = DuelsWindow.showTab_twx.call(this, id);
            if (tmp)
              return tmp;
            DuelsWindow.window.removeClass('noreload').setSize(748, 472);
          };
        }
      };
      TWX.MoveJobs = {
        init: function () {
          var st = $('.menulink.lscript')[0].title;
          $('div#ui_bottomright').css('right', '35px');
          $('div.ui_menucontainer').css('margin-bottom', '7px');
          $('div#ui_scripts').remove();
          EscapeWindow.open_twx = EscapeWindow.open_twx || EscapeWindow.open;
          EscapeWindow.open = function () {
            EscapeWindow.open_twx.apply(this, arguments);
            wman.getById('escape').setSize(240, 326);
            $('div.tw2gui_win2.escape div.content div.tw2gui_button')[3].after(new west.gui.Button(st, function () {
                TheWestApi.open();
                wman.getById('escape').destroy();
              }).setMinWidth(175).getMainDiv());
          };
        }
      };
      TWX.InstantQuest = {
        init: function () {
          var setVal1 = setInterval(function () {
            if (QuestEmployerView.showQuest) {
              clearInterval(setVal1);
              QuestEmployerView.showQuest_twx = QuestEmployerView.showQuest;
              QuestEmployerView.showQuest = function (e) {
                QuestEmployerView.showQuest_twx(e);
                if (e.accepted === false && !e.questRewardsOptions) {
                  var req = e.requirements,
                  solvCnt = 0;
                  for (var f = 0; f < req.length; f++)
                    if (req[f].solved === true)
                      solvCnt += 1;
                  if (req.length == solvCnt)
                    $('div.quest_button_area_' + e.id + '').empty().append(new west.gui.Button(TWXlang.accNfin, function () {
                        QuestWindow.acceptQuest(e.id);
                        var stop = 0,
                        siVal = setInterval(function () {
                          if (QuestLog.quests[e.id]) {
                            clearInterval(siVal);
                            QuestWindow.finishQuest(e.id);
                          } else if (++stop == 20)
                            clearInterval(siVal);
                        }, 200);
                      }).getMainDiv());
                }
              };
            }
          }, 2000);
        }
      };
      TWX.QuestWiki = {
        init: function () {
          $.getScript(TWX.website + 'files/repGroups.js', function () {
            QuestLog.solvedGroups = {};
            Ajax.remoteCallMode('building_quest', 'get_solved_groups', {}, function (json) {
              for (var sg in json.solved)
                QuestLog.solvedGroups[sg] = json.solved[sg].title;
              QuestLog.addSolvedQuestGroup_twx = QuestLog.addSolvedQuestGroup;
              QuestLog.addSolvedQuestGroup = function (groupId, questGroup) {
                QuestLog.addSolvedQuestGroup_twx.apply(this, arguments);
                QuestLog.solvedGroups[groupId] = questGroup.title;
              };
              var lang = Game.locale.substr(0, 2),
              repText = {
                de: ' (Wiederholbare Feiertagsquestreihe)',
                hu: ' (Ismételhető)',
                it: ' (Ripetibile)',
                pt: ' repetível',
                ru: ' - Снова праздник',
              };
              Quest.render_twx = Quest.render;
              Quest.render = function () {
                Quest.render_twx.apply(this, arguments);
                var wiki = '//wiki.the' + Game.masterURL.match(/the(.*)/)[1] + '/wiki/',
                gid = TWX.repGroups[this.id],
                qGroup = QuestLog.solvedGroups[gid] || lang == 'de' && isNaN(gid) && gid,
                groupName = [69, 34, 243].includes(this.group) && qGroup ? qGroup + (repText[lang] || '') : 62 == this.group && qGroup ? qGroup + ' (Wiederholbare Quests)' : this.groupTitle,
                questName = encodeURIComponent((lang == 'pl' ? 'Zadania: ' : '') + groupName + '#' + (lang == 'de' ? this.id : this.soloTitle));
                this.el.find('.quest_description_container .strong').append('<a class="questWiki" style="float:right;" title="' + TWXlang.onWiki + '" href="' + wiki + questName + '" target="_blank"><img src="' + TWX.Images('wiki') + '"></a>');
              };
            });
          });
        }
      };
      TWX.CityTravel = {
        init: function () {
          var setVal3 = setInterval(function () {
            if (west.window.Blackboard.cities.show) {
              clearInterval(setVal3);
              var wwBc = west.window.Blackboard.cities;
              wwBc.show_twx = wwBc.show;
              wwBc.show = function () {
                for (var c = 0; c < this.cities_.length; c++)
                  this.cities_[c].member += '<br>' +
                  Map.calcWayTime(Map.getLastQueuePosition(), {
                    x: this.cities_[c].x,
                    y: this.cities_[c].y
                  }).formatDuration();
                wwBc.show_twx.apply(this, arguments);
                $('.cities .city.inlineblock .popup-title').css('margin-top', '-10px');
              };
            }
          }, 2000);
        }
      };
      TWX.BetterSheriff = {
        onlyAttackable: false,
        loadedIDs: {},
        init: function () {
          var that = this,
          columns = [
            'name" style="width:100px;',
            'distance" style="width:70px;',
            'amount" style="width:70px;',
            'not_dead_amount" style="width:70px;',
            'duellevel" style="width:50px;',
            'pStatus" style="width:192px;'
          ], //max 552px
          wanted = [
            'Gesucht', 'Wanted', 'Poszukiwany', 'Gezocht', 'Efterlyst', 'Căutat', 'Procurado', 'Hledán', 'Buscado', 'В розыске', 'Aranıyor', 'Körözött', 'Καταζητείται', 'Eftersøgt', 'Odmena za ulovenie', 'Recherché', 'Ricercato',
          ],
          sortByObj,
          myPos,
          lvl,
          players,
          counter,
          maxCount,
          updateTable = function (data) {
            that.table.clearBody();
            var tmpCells = {};
            for (var i = 0; i < data.length; i++) {
              var rd = data[i];
              if (that.onlyAttackable && !rd.pStatus.includes('.startDuel'))
                continue;
              tmpCells[columns[0]] = '<a title="' + SheriffWindow.createWantedTooltip(rd).escapeHTML() + '" href="javascript:void(PlayerProfileWindow.open(' + rd.player_id + '));"> ' + rd.name + '</a>';
              tmpCells[columns[1]] = rd.distance.formatDuration();
              tmpCells[columns[2]] = format_number(rd.amount);
              tmpCells[columns[3]] = format_number(rd.not_dead_amount);
              tmpCells[columns[4]] = rd.duellevel;
              tmpCells[columns[5]] = '<span title=\'' + rd.pStatus + '\'>' + rd.pStatus + '</span>';
              that.table.buildRow('" style="padding-left:5px;', tmpCells);
            }
          },
          startSortDispatcher = function (ev) {
            var sortBy = ev && (ev.target.tagName == 'SPAN' && ev.target.parentElement.classList[2] || ev.target.classList[2]) || 'distance';
            if (sortByObj == sortBy)
              players.reverse();
            else {
              sortByObj = sortBy;
              switch (sortBy) {
              case 'name':
              case 'pStatus':
                players.sort(function (a, b) {
                  return replUml(a[sortBy]).replace(/\(.*?\)/, '') > replUml(b[sortBy]).replace(/\(.*?\)/, '') ? 1 : -1;
                });
                break;
              case 'distance':
                players.sort(function (a, b) {
                  return a[sortBy] - b[sortBy];
                });
                break;
              default:
                players.sort(function (a, b) {
                  return b[sortBy] - a[sortBy];
                });
                break;
              }
            }
            updateTable(players);
          },
          setStatus = function (player, string, dontSave) {
            if (player) {
              player.pStatus = string;
              players.push(player);
              if (!dontSave)
                that.loadedIDs[player.player_id] = string;
            }
            counter++;
            that.progB.increase(1);
            if (counter == maxCount) {
              startSortDispatcher();
              $('div.sheriff-TWXSheriff .fancytable .row_head').css('cursor', 'pointer').click(startSortDispatcher);
              $('div.sheriff-TWXSheriff', SheriffWindow.DOM).append(that.checkB.getMainDiv());
            }
          },
          windowOpened = function () {
            return $('.tw2gui_window.sheriff').length;
          },
          loadPlayer = function (arr) {
            if (!windowOpened())
              return;
            if (that.loadedIDs[arr.player_id])
              setStatus(arr, that.loadedIDs[arr.player_id], 1);
            else
              Ajax.remoteCallMode('profile', 'init', {
                playerId: arr.player_id
              }, function (resp) {
                if (resp.error)
                  return new UserMessage(resp.message).show();
                if (!wanted.includes(resp.status))
                  setStatus(arr, resp.status);
                else if (resp.town) {
                  if (resp.town.town_id == Character.homeTown.town_id)
                    setStatus(arr, TWXlang.ownTown);
                  else
                    Ajax.remoteCallMode('building_saloon', 'get_data', {
                      town_id: resp.town.town_id
                    }, function (data) {
                      if (data.error)
                        return new UserMessage(data.msg).show();
                      for (var l = 0; l < data.players.length; l++)
                        that.loadedIDs[data.players[l].player_id] = SaloonWindow.playerStat(data.players[l]);
                      setStatus(arr, that.loadedIDs[arr.player_id], 1);
                    });
                } else if (!Character.isDuelProtected())
                  Ajax.remoteCall('task', 'add', {
                    'tasks': {
                      '0': {
                        'player_id': arr.player_id,
                        'taskType': 'duel'
                      }
                    }
                  }, function (data) {
                    if (data.tasks[0].error)
                      setStatus(arr, data.tasks[0].msg);
                    else {
                      setStatus(arr, SaloonWindow.playerStat({
                          player_id: arr.player_id,
                          holiday_duel: true,
                        }));
                      Ajax.remoteCall('task', 'cancel', {
                        'tasks': {
                          '0': {
                            'queueId': data.tasks[0].task.queue_id,
                            'type': 'duel'
                          }
                        }
                      });
                    }
                  });
                else
                  setStatus(arr, TWXlang.youKO);
              });
          },
          initData = function (pg) {
            if (!windowOpened())
              return;
            Ajax.remoteCall('building_sheriff', 'load_page', {
              page: pg,
            }, function (json) {
              if (json.error) {
                new UserMessage(json.msg).show();
                return null;
              }
              if (pg === 0) {
                maxCount = json.count * 10;
                that.progB.setMaxValue(maxCount);
              }
              for (var j = 0; j < 10; j++) {
                if (json.result[j]) {
                  var res = json.result[j];
                  res.distance = Map.calcWayTime(myPos, {
                    x: res.x,
                    y: res.y
                  });
                  res.not_dead_amount = res.not_dead_amount || 0;
                  if (lvl.min > res.duellevel)
                    setStatus(res, TWXlang.tooLow, 1);
                  else if (lvl.max < res.duellevel)
                    setStatus(res, TWXlang.tooHigh, 1);
                  else
                    loadPlayer(res);
                } else {
                  setStatus();
                }
              }
              if (pg < json.count - 1)
                initData(++pg);
            });
          },
          tabclick = function (win, id) {
            if (!SheriffWindow.window)
              return;
            SheriffWindow.window.activateTab(id).addClass('nocloseall noreload').setTitle('BetterSheriff').$('div.tw2gui_window_content_pane > *', SheriffWindow.DOM).each(function (i, e) {
              if ($(e).hasClass('sheriff-' + id)) {
                $(e).children().fadeIn();
                $(e).show();
              } else {
                $(e).children().fadeOut();
                $(e).hide();
              }
            });
            if (TWX.loadedSheriff)
              return;
            TWX.loadedSheriff = true;
            SheriffWindow.window.dontCloseAll = true;
            myPos = Map.getLastQueuePosition();
            lvl = dLvlRange(Character.duelLevel);
            players = [];
            counter = 0;
            sortByObj = '';
            initData(0);
          },
          initBetterSheriff = function () {
            TWX.loadedSheriff = false;
            SheriffWindow.window.addTab('BetterSheriff', 'TWXSheriff', tabclick).appendToContentPane($('<div class="sheriff-TWXSheriff" style="display:none;width:590px;position:relative;left:50px;">'));
            that.table = new west.gui.Table().removeFooter();
            for (var k = 0; k < columns.length; k++)
              that.table.addColumn(columns[k]).appendToThCell('head', columns[k], TWXlang.sortBy + ' ' + TWXlang[columns[k].split('"')[0]], TWXlang[columns[k].split('"')[0]]);
            that.progB = new west.gui.Progressbar(0, null);
            $(that.progB.getMainDiv()).css('width', '587px');
            that.checkB = new west.gui.Checkbox().setLabel('<img src="images/window/dailyactivity/tasks_icon.png">').setTooltip(TWXlang.attackable).setCallback(function (state) {
              that.onlyAttackable = state;
              updateTable(players);
            }).setSelected(that.onlyAttackable, 1);
            $(that.checkB.getMainDiv()).css({
              'position': 'absolute',
              'top': '35px',
              'right': '-65px'
            });
            $('div.sheriff-TWXSheriff', SheriffWindow.DOM).empty().append(that.table.getMainDiv()).append(that.progB.getMainDiv());
            $('div.sheriff-TWXSheriff .fancytable .tw2gui_scrollpane').css('height', '293px');
            Ajax.remoteCallMode('building_saloon', 'get_data', {
              town_id: Character.homeTown.town_id
            }, function (data) {
              if (data.error)
                return new UserMessage(data.msg).show();
              SaloonWindow.self = data.self;
            });
          };
          SheriffWindow.open_twx = SheriffWindow.open;
          SheriffWindow.open = function (townId, tabId, wanted) {
            SheriffWindow.open_twx.call(this, townId, tabId, wanted);
            if (townId === Character.homeTown.town_id) {
              initBetterSheriff();
            }
          };
        }
      };
      TWX.ChatProfessions = {
        init: function () {
          Chat.Formatter.formatContactClient_twx = Chat.Formatter.formatContactClient;
          Chat.Formatter.formatContactClient = function (client, room) {
            var cClient = Chat.Formatter.formatContactClient_twx.call(this, client, room);
            if (client.professionId > -1)
              $(cClient[0].lastChild).prepend($(Chat.Formatter.getProfessionImage(client.professionId)).css('background-color', '#D5C6A2')[0]);
            return cClient;
          };
        }
      };
      TWX.QuestBookSearch = {
        init: function () {
          QuestWindowView.clearSearch = function () {
            $('.window-quest_solved .employer_description .questlog_entrie').show();
            $('.window-quest_solved .solved_container .tw2gui_scrollpane_clipper_contentpane').empty();
          };
          QuestWindowView.searchQuest = function (txt) {
            if (txt) {
              txt = txt.toLowerCase();
              var questGroup = new QuestGroup('searchResult', {});
              for (var q in QuestLog.solved_group) {
                var Qq = QuestLog.solved_group[q];
                if (Qq.title.toLowerCase().includes(txt))
                  $('#solved_questgroup_' + q).show();
                else
                  $('#solved_questgroup_' + q).hide();
                for (var r in Qq.quests)
                  if (Qq.quests.hasOwnProperty(r)) {
                    var Qr = Qq.quests[r],
                    idMatch = r == txt;
                    if (Qr.toLowerCase().includes(txt) || idMatch)
                      questGroup.el.append($('<div>').prop({
                          id: 'solved_questgroup_quest_' + r,
                          className: 'questlog_entrie finish'
                        }).append($('<a>').attr({
                            href: '#',
                            className: 'shorten',
                            onclick: s('QuestGroupWindow.open(%1, %2);', q, r)
                          }).text((idMatch ? '#ID ' : '') + Qr)));
                  }
              }
              QuestWindowView.showSolvedGroup(questGroup);
            } else
              QuestWindowView.clearSearch();
          };
          QuestWindowView.renderGroupSolved_twx = QuestWindowView.renderGroupSolved;
          QuestWindowView.renderGroupSolved = function () {
            QuestWindowView.renderGroupSolved_twx.apply(this, arguments);
            var textF = new west.gui.Textfield('questbook_search').addListener(QuestWindowView.searchQuest),
            iconB = new west.gui.Iconbutton(new west.gui.Icon('search'), function () {
              QuestWindowView.searchQuest(textF.getValue());
            }),
            icon = new west.gui.Icon('abort').getMainDiv().click(function () {
              textF.setValue('');
              QuestWindowView.clearSearch();
            });
            $('.window-quest_solved .employer_description .quest_splitter').after($('<div id=QuestBookSearch>').append(textF.getMainDiv(), iconB.getMainDiv(), icon));
          };
        }
      };
      TWX.MarketRights = {
        init: function () {
          MarketWindow.sellRights = [{
              i: 'town_new',
              t: TWXlang.town
            }, {
              i: 'friends',
              t: TWXlang.alliance
            }, {
              i: 'welt',
              t: TWXlang.worldwide
            }
          ];
          var getRights = function (page) {
            Ajax.remoteCall('building_market', 'search', {
              page: page,
              sort: 'distance',
              visibility: 0
            }, function (json) {
              for (var i = 0; i < json.msg.search_result.length; i++) {
                var jsr = json.msg.search_result[i];
                if (jsr.seller_name == Character.name)
                  $('.marketSellsData_' + jsr.market_offer_id + ' .mps_pickup').prepend('<img src="images/icons/' + MarketWindow.sellRights[jsr.sell_rights].i + '.png" title="' + MarketWindow.sellRights[jsr.sell_rights].t + '">');
              }
              if (page == 1 && json.msg.next)
                getRights(2);
            });
          };
          MarketWindow.Sell.updateTable_twx = MarketWindow.Sell.updateTable_twx || MarketWindow.Sell.updateTable;
          MarketWindow.Sell.updateTable = function () {
            MarketWindow.Sell.updateTable_twx.apply(this, arguments);
            if (Character.homeTown.town_id)
              getRights(1);
          };
          MarketWindow.Buy.updateTable_twx = MarketWindow.Buy.updateTable;
          MarketWindow.Buy.updateTable = function (data) {
            MarketWindow.Buy.updateTable_twx.call(this, data);
            if (Character.homeTown.town_id)
              for (var i = 0; i < data.length; i++)
                $('#mpb_vendor_' + data[i].market_offer_id).before('<img src="images/icons/' + MarketWindow.sellRights[data[i].sell_rights].i + '.png" title="' + MarketWindow.sellRights[data[i].sell_rights].t + '">');
          };
        }
      };
      TWX.EquipManagerPlus = {
        init: function () {
          var current = {},
          change = {},
          diff = [],
          load = 0,
          changeSlot = function (slot) {
            var ds = diff[slot - 1],
            cds = current[ds];
            if (slot == 0) {
              $('#equip_manager_list').html(EquipManager.buildEquipList());
              new UserMessage(TWXlang.saveMessage, 'success').show();
              load = 0;
            } else if (cds)
              Ajax.remoteCall('inventory', 'carry', {
                item_id: cds.obj.item_id,
                last_inv_id: Bag.getLastInvId()
              }, function () {
                changeSlot(--slot);
              });
            else
              Ajax.remoteCall('inventory', 'uncarry', {
                last_inv_id: Bag.getLastInvId(),
                type: ds
              }, function () {
                changeSlot(--slot);
              });
          },
          process = function (equipId, nr, name) {
            Ajax.remoteCall('inventory', 'delete_equip', {
              id: equipId
            }, function () {
              EquipManager.list.splice(nr, 1);
              Ajax.remoteCall('inventory', 'save_equip', {
                name: name
              }, function (data) {
                if (data.error)
                  new UserMessage(data.msg).show();
                else
                  EquipManager.list.unshift(data.data);
                changeSlot(diff.length);
              });
            });
          },
          rename = function (equipId, nr, name) {
            if (name.length < 3 || name == EquipManager.list[nr].name)
              return new UserMessage(TWXlang.longerName).show();
            new UserMessage(TWXlang.loading, 'hint').show();
            if (load)
              return;
            load = 1;
            current = $.extend({}, Wear.wear);
            change = EquipManager.list[nr];
            var diff = Wear.slots.slice(),
            i = diff.length;
            while (i--) {
              var di = diff[i];
              if (change[di] == (current[di] && current[di].obj.item_id))
                diff.splice(i, 1);
            }
            if (diff.length)
              Ajax.remoteCall('inventory', 'switch_equip', {
                id: equipId,
                last_inv_id: Bag.getLastInvId()
              }, function () {
                process(equipId, nr, name);
              });
            else
              process(equipId, nr, name);
          };
          EquipManager.renameEquip = function (equipId, nr) {
            var cont = $('<span>');
            var textF = new west.gui.Textfield('equip_rename').maxlength(25).setValue(EquipManager.list[nr].name).getMainDiv();
            cont.append(TWXlang.newName + ': ', textF, '<p style="margin-top:10px;color:red;">' + TWXlang.renameWarning + '</p>');
            new west.gui.Dialog(TWXlang.rename + ': ' + EquipManager.list[nr].name, cont).addButton('ok', function () {
              rename(equipId, nr, $('#equip_rename').val());
            }).addButton('cancel').show();
          };
          EquipManager.showPopup_twx = EquipManager.showPopup;
          EquipManager.showPopup = function () {
            EquipManager.showPopup_twx.apply(this, arguments);
            setTimeout(function () {
              $('#max_equip_count').append(' | ' + TWXlang.used + ': <span id="equip_used">' + EquipManager.list.length);
            }, 100);
          };
          EquipManager.buildEquipList_twx = EquipManager.buildEquipList;
          EquipManager.buildEquipList = function () {
            if ($('#equip_used').length > 0)
              $('#equip_used')[0].innerHTML = EquipManager.list.length;
            EquipManager.list.sort(function (a, b) {
              var a1 = a.name.toUpperCase(),
              b1 = b.name.toUpperCase();
              return (a1 == b1) ? 0 : (a1 > b1) ? 1 : -1;
            });
            var html = EquipManager.buildEquipList_twx().replace(/60%/g, '40%').replace(/20%/g, '15%');
            for (var i = 0; EquipManager.list.length > i; i++) {
              var id = EquipManager.list[i].equip_manager_id;
              html = html.replace('deleteEquip(' + id + ')', 'renameEquip(' + id + ',' + i + ');\'>' + TWXlang.rename + '&emsp;</a></td><td width=\'15%\'><a href=\'javascript:EquipManager.deleteEquip(' + id + ')');
            }
            return html;
          };
        }
      };
      TWX.ShortPopups = {
        init: function () {
          ItemPopup.getXHTML_twx = ItemPopup.getXHTML_twx || ItemPopup.getXHTML;
          ItemPopup.getXHTML = function () {
            var end = '';
            var html = ItemPopup.getXHTML_twx.call(this).replace(/<br><span class="inventory_popup_requirement_text(.*?)>$/, function (str) {
              end = str;
              return '';
            }).replace('<div class="invPopup_body">', '').replace('inventory_popup"', 'invPopup_body $& style="max-width:385px;"><table><td').replace(/bonus_attr tw_green"/g, '$& style="white-space:nowrap;"').replace('<br><br><div class="item_set_bonus">', end + '</td><td style="padding-left:5px;">');
            if (!html.includes(end))
              html += end;
            return html;
          };
        }
      };
      TWX.HideNotis = {
        init: function () {
          var setVal5 = setInterval(function () {
            var WNw = WestUi.NotiBar.work;
            if (WNw) {
              clearInterval(setVal5);
              WNw.setMaxSize(999);
              $('<div class="tw2gui_window_buttons_close" style="position:absolute;left:40px;z-index:2;" title="' + TWXlang.removeWorkNotis + '">').prependTo(WNw.element).click(function () {
                var l = WNw.list.length;
                while (l--)
                  if (WNw.list[l].tooltip.includes('job/danger.png'))
                    WNw.removeEntry(WNw.list[l]);
              });
            }
          }, 1000);
        }
      };
      TWX.JobProducts = {
        init: function () {
          Map.PopupHandler.getJobPopup_twx = Map.PopupHandler.getJobPopup_twx || Map.PopupHandler.getJobPopup;
          Map.PopupHandler.getJobPopup = function (d) {
            var html = Map.PopupHandler.getJobPopup_twx.apply(this, arguments);
            for (var i in d.yields) {
              var m = ItemManager.get(i);
              html = html.replace('<img src="' + Game.cdnURL + '/images/items/yield/' + m.short + '.', '<div class="item"><span class="count" style="display:block;top:29px;left:0px">' + Bag.getItemCount(i) + '</span></div>$&');
            }
            return html;
          };
        }
      };
      TWX.MapDistance = {
        init: function () {
          TWX.addStyle('div.job_way {left:61px;width:170px;}\n .mpb_distance, .wih_distance, .mpo_distance, .mpw_distance, .mps_distance {width:45px;}\n div.tw2gui_window.marketplace div.fancytable .row > div {text-overflow:unset;}');
          Map.calcWayTime_twx = Map.calcWayTime_twx || Map.calcWayTime;
          Map.calcWayTime = function () {
            var time = Map.calcWayTime_twx.apply(this, arguments);
            this.newDist = time / Game.travelSpeed / Character.speed;
            return time;
          };
          Number.prototype.formatDuration_twx = Number.prototype.formatDuration_twx || Number.prototype.formatDuration;
          Number.prototype.formatDuration = function () {
            var dist = '';
            if (Map.newDist)
              dist = ' <small>' + (Math.floor(Map.newDist) / 1000).toFixed(3) + 'mi</small>';
            Map.newDist = 0;
            return Number.prototype.formatDuration_twx.apply(this, arguments) + dist;
          };
          String.prototype.replaceAll = function () {
            return this.replace(/\D/g, '');
          };
        }
      };
      TWX.TraderSell = {
        init: function () {
          var setVal8 = setInterval(function () {
            var wws = west.window.shop;
            if (wws) {
              clearInterval(setVal8);
              TWX.addStyle('.focused_new_item_shop .sellIt, .focused_marketplace .auctIt {filter: grayscale(90%)}\n .focused_tailor .not_sellable::after, .focused_gunsmith .not_sellable::after, .focused_general .not_sellable::after, .focused_marketplace .not_auctionable::after {content:"";position:absolute;width:28px;height:28px;right:0;background:url(images/window/shop/shop_icons_sprite.png)no-repeat -167px 0;} .focused_tailor .not_sellable, .focused_gunsmith .not_sellable, .focused_general .not_sellable, .focused_marketplace .not_auctionable {opacity:0.5}');
              var mt = -1,
              itemsToSell = [null, null],
              attr = ['sellable', 'auctionable'],
              className = ['sellIt', 'auctIt'],
              sellItem = function (item) {
                if (!item.obj[attr[mt]])
                  return this;
                var inv_id = item.inv_id;
                if (!itemsToSell[mt][inv_id]) {
                  itemsToSell[mt][inv_id] = item.count;
                  item.divMain[0].classList.add(className[mt]);
                } else {
                  delete itemsToSell[mt][inv_id];
                  item.divMain[0].classList.remove(className[mt]);
                }
              },
              setClickH = function () {
                Inventory.setClickHandler({
                  callback: mt ? MarketWindow.onInventoryClick : wws.handleInventoryClick,
                  context: mt ? MarketWindow : wws,
                  window: mt ? MarketWindow.window : wws.getWindow()
                });
              },
              exitSell = function (destroy) {
                if (mt)
                  MarketWindow.onInventoryClick = MarketWindow.onInventoryClick_twx || MarketWindow.onInventoryClick;
                else
                  wws.handleInventoryClick = wws.handleInventoryClick_twx || wws.handleInventoryClick;
                $.each(itemsToSell[mt], function (invId) {
                  var bgbi = Bag.getItemIdByInvId(invId);
                  if (!bgbi)
                    return delete itemsToSell[mt][invId];
                  Bag.getItemByItemId(bgbi).divMain[0].classList.remove(className[mt]);
                });
                itemsToSell[mt] = null;
                if (destroy)
                  return;
                setClickH();
                $(sellButton[mt]).css('filter', 'grayscale(90%)');
              },
              repItems = [
                3, 17, 201, 202, 208, 235, 302, 303, 325, 329, 334, 342, 355, 405, 420, 432, 503, 506, 507, 525, 603, 802, 10003, 10005, 10012, 10015, 10075, 10149, 11003, 11014, 41171
              ],
              initSell = function () {
                if (!itemsToSell[mt]) {
                  if (mt) {
                    MarketWindow.onInventoryClick_twx = MarketWindow.onInventoryClick_twx || MarketWindow.onInventoryClick;
                    MarketWindow.onInventoryClick = function (item) {
                      if (this.window.currentActiveTabId != 'sell')
                        return false;
                      sellItem(item);
                      return true;
                    };
                  } else {
                    wws.handleInventoryClick_twx = wws.handleInventoryClick_twx || wws.handleInventoryClick;
                    wws.handleInventoryClick = function (item) {
                      sellItem(item);
                      return true;
                    };
                  }
                  setClickH();
                  $(sellButton[mt]).css('filter', 'grayscale(0%)');
                  itemsToSell[mt] = {};
                } else {
                  if (Object.keys(itemsToSell[mt]).length) {
                    var cont = '<div>',
                    money = 0;
                    $.each(itemsToSell[mt], function (invId, count) {
                      var bgbi = Bag.getItemIdByInvId(invId);
                      if (!bgbi)
                        return delete itemsToSell[mt][invId];
                      var bgo = Bag.getItemByItemId(bgbi).obj,
                      bi = bgo.item_base_id;
                      cont += count + 'x ' + TWX.GUI.getSetOrItem(bi, bgo, true) + (repItems.includes(bi) ? ' (repeatable quest!)' : '') + '<br>';
                      money += bgo.sell_price * count;
                    });
                    cont += '<br><span class="invPopup_sellicon"> $' + money + '</span></div>';
                    new west.gui.Dialog(TWXlang.sellItems, cont).setDraggable(true).addButton('yes', function () {
                      $.each(itemsToSell[mt], function (inv_id, amount) {
                        if (mt) {
                          var item = Bag.getItemByInvId(inv_id).obj;
                          var params = MarketWindow.Offer.getOfferObject(item.item_id, 0, (item.sell_price || Math.round(item.price / 2)) * amount, amount, 1, 0, 3, '');
                          Ajax.remoteCall('building_market', 'putup', params, function (resp) {
                            if (resp.error)
                              return new UserMessage(resp.msg).show();
                            Character.setMoney(resp.msg.money);
                            Character.setDeposit(resp.msg.deposit);
                            new UserMessage(s('Die Ware wird zum Kauf angeboten, die Gebühr beträgt $ %1', resp.msg.costs), 'success').show();
                          }, MarketWindow);
                        } else
                          wws.requestSell({
                            inv_id: inv_id,
                            count: amount
                          });
                      });
                      itemsToSell[mt] = {};
                      if (mt) {
                        EventHandler.signal('inventory_changed');
                        MarketWindow.Sell.initData();
                      }
                      exitSell();
                    }).addButton('cancel').show();
                  } else
                    exitSell();
                }
              },
              sellButton = [null, null],
              icon = ['dollar', 'box'],
              addMtButton = function (winmt) {
                mt = winmt;
                if (!$('.TWX_' + attr[mt] + '_button').length) {
                  sellButton[mt] = new west.gui.Iconbutton(new west.gui.Icon(icon[mt]), initSell).addClass('TWX_' + attr[mt] + '_button').getMainDiv();
                  $(sellButton[mt]).css({
                    'position': 'absolute',
                    'left': 0,
                    'z-index': 1,
                    'filter': 'grayscale(90%)'
                  });
                  Inventory.DOM.children('.actions').prepend(sellButton[mt]);
                }
              };
              wws.openSellInventory_twx = wws.openSellInventory_twx || wws.openSellInventory;
              wws.openSellInventory = function () {
                exitSell(true);
                wws.openSellInventory_twx.apply(this, arguments);
                addMtButton(0);
              };
              /*MarketWindow.open_twx = MarketWindow.open_twx || MarketWindow.open;
              MarketWindow.open = function () {
              exitSell(true);
              MarketWindow.open_twx.apply(this, arguments);
              addMtButton(1);
              };*/
              Inventory.setClickHandler_twx = Inventory.setClickHandler_twx || Inventory.setClickHandler;
              Inventory.setClickHandler = function (h) {
                if (sellButton[mt])
                  $(sellButton[mt]).hide();
                var win = h && h.window.id,
                winmt = ['new_item_shop', 'marketplace'].indexOf(win);
                if (winmt > -1) {
                  mt = winmt;
                  h.callback = mt ? MarketWindow.onInventoryClick : wws.handleInventoryClick;
                  if (sellButton[mt])
                    $(sellButton[mt]).show();
                }
                Inventory.setClickHandler_twx.apply(this, arguments);
              };
              Inventory.undock_twx = Inventory.undock_twx || Inventory.undock;
              Inventory.undock = function () {
                if (itemsToSell[mt])
                  exitSell(true);
                if (sellButton[mt])
                  sellButton[mt].remove();
                return Inventory.undock_twx.apply(this, arguments);
              };
              var tIp = tw2widget.InventoryItem.prototype;
              tIp.initDisplay_twx = tIp.initDisplay_twx || tIp.initDisplay;
              tIp.initDisplay = function () {
                this.initDisplay_twx.apply(this, arguments);
                if (!this.obj.auctionable)
                  this.addClass('not_auctionable');
              };
              west.window.shop.trackBuyItem = function () {};
            }
          }, 1000);
        }
      };
      TWX.TouchControl = {
        init: function () {
          var fingers = 0,
          wgSbp = west.gui.Scrollbar.prototype;
          wgSbp.init_twx = wgSbp.init_twx || wgSbp.init;
          wgSbp.init = function () {
            this.init_twx.apply(this, arguments);
            var start,
            that = this;
            $(this.divMain).on('touchstart', function (e) {
              start = e.originalEvent.touches[0].clientY;
            }).on('touchmove', function (e) {
              e.stopPropagation();
              e.preventDefault();
              var move = e.originalEvent.changedTouches[0].clientY;
              that.move(move - start);
              start = move;
            });
          };
          var wgSpp = west.gui.Scrollpane.prototype;
          wgSpp.init_twx = wgSpp.init_twx || wgSpp.init;
          wgSpp.init = function () {
            this.init_twx.apply(this, arguments);
            var start,
            coP = this.contentPane,
            clP = this.clipPane,
            vB = this.verticalBar,
            ratio;
            $(this.divMain).on('touchstart', function (e) {
              fingers++;
              start = e.originalEvent.touches[0].clientY;
              ratio = (vB._divPullArea.height() - vB._divPulley.height()) / (clP.height() - coP.height());
            }).on('touchmove', function (e) {
              if (fingers != 1)
                return;
              e.preventDefault();
              var move = e.originalEvent.changedTouches[0].clientY,
              topPos = move - start;
              vB.move(ratio * topPos);
              start = move;
            }).on('touchend', function (e) {
              fingers = 0;
            });
          };
          var start,
          currZoom = 1;
          $('#ui_minimap').on('touchstart', function (e) {
            fingers++;
            start = e.originalEvent.touches[0].clientY;
          }).on('touchmove', function (e) {
            if (fingers != 1)
              return;
            e.preventDefault();
            var move = e.originalEvent.changedTouches[0].clientY,
            cZmb = currZoom + (move - start) / 100;
            if (cZmb >= 0.65 && cZmb <= 5)
              document.getElementById('map').style.zoom = cZmb;
          }).on('touchend', function (e) {
            fingers = 0;
            currZoom = $('#map').css('zoom') * 1;
            Map.resize();
          });
          Map.getCurrentMid_twx = Map.getCurrentMid_twx || Map.getCurrentMid;
          Map.getCurrentMid = function () {
            var xy = this.getCurrentMid_twx.apply(this, arguments);
            return {
              x: xy.x / currZoom,
              y: xy.y / currZoom
            };
          };
          Map.resize_twx = Map.resize_twx || Map.resize;
          Map.resize = function () {
            if (!Map.initialized)
              return;
            this.resize_twx.apply(this, arguments);
            this.width /= currZoom;
            this.height /= currZoom;
          };
          /*var start2;
          $('#map').on('touchstart', function (e) {
          fingers++;
          var eoEt = e.originalEvent.touches[0];
          start2 = [eoEt.clientX, eoEt.clientY];
          }).on('touchmove', function (e) {
          if (fingers != 1)
          return;
          e.preventDefault();
          var eoEcT = e.originalEvent.changedTouches[0],
          move = [eoEcT.clientX, eoEcT.clientY];
          Map.Drag.scrollby((start2[0] - move[0]) / currZoom, (start2[1] - move[1]) / currZoom);
          start2 = move;
          }).on('touchend', function (e) {
          fingers = 0;
          });*/
          var wgWp = west.gui.Window.prototype;
          wgWp.init_twx = wgWp.init_twx || wgWp.init;
          wgWp.init = function () {
            this.init_twx.apply(this, arguments);
            var start,
            that = this,
            tdM = that.divMain,
            currPos;
            $('div.tw2gui_inner_window_title', tdM).on('touchstart', function (e) {
              fingers++;
              var eoEt = e.originalEvent.touches[0];
              start = [eoEt.clientX, eoEt.clientY];
              that.bringToTop();
            }).on('touchmove', function (e) {
              if (fingers != 1)
                return;
              e.preventDefault();
              currPos = [tdM.offsetLeft, tdM.offsetTop];
              var eoEcT = e.originalEvent.changedTouches[0],
              move = [eoEcT.clientX, eoEcT.clientY],
              res = [currPos[0] + move[0] - start[0], currPos[1] + move[1] - start[1]];
              if (res[0] > -1) {
                tdM.style.left = res[0] + 'px';
                currPos[0] = res[0];
              }
              if (res[1] > -1) {
                tdM.style.top = res[1] + 'px';
                currPos[1] = res[1];
              }
              start = move;
            }).on('touchend', function (e) {
              fingers = 0;
            });
          };
          TWX.addStyle('img {-webkit-touch-callout:none;}');
          var timer,
          timer2,
          wph = west.popup.handler;
          $(document).on('touchstart', function (e) {
            timer = setTimeout(function () {
              wph.handleMouseMove.call(wph, e);
            }, 500);
            timer2 = setTimeout(function () {
              e.ctrlKey = 1;
              TWX.CalcTwdb.show(e);
            }, 2000);
          }).on('touchend', function (e) {
            clearTimeout(timer);
            clearTimeout(timer2);
          });
        }
      };
      TWX.ColorTchat = {
        init: function () {
          TWX.CT.DATA = new function () {
            this.Setting = {
              saves: {
                'save 1': '999',
                'save 2': '999',
                'save 3': '999',
                'save 4': '999',
                'save 5': '999'
              },
              Default: {
                Format: '%c',
                colorTag: '999'
              },
            };
            this.Load = function () {
              this.Setting = JSON.parse(localStorage.getItem('CT_save')) || this.Setting;
            };
            this.Load();
            this.Save = function () {
              localStorage.setItem('CT_save', JSON.stringify(this.Setting));
            };
          };
          TWX.CT.Tools = new function () {
            this.colorTagInv = function (e) {
              if (e === null || e === undefined)
                return '';
              if (e.length == 3)
                return '';
              var t = '';
              for (var n = 1; n < e.length / 3 - 1; n++) {
                t = e.substring(n * 3, n * 3 + 3) + t;
              }
              return t;
            };
            this.Degrader = function (e) {
              var t;
              if (e.length == 3)
                t = '#' + this.colorrgb(e);
              else {
                t = 'linear-gradient(to right, ';
                for (var n = 0; n < e.length / 3; n++) {
                  t += '#' + this.colorrgb(e.substring(n * 3, n * 3 + 3));
                  if (n !== e.length / 3 - 1)
                    t += ',';
                }
                t += ')';
              }
              return t;
            };
            this.colorrgb = function (e) {
              result = '';
              TransCode = {
                0: '0',
                1: '1',
                2: '3',
                3: '5',
                4: '6',
                5: '8',
                6: 'a',
                7: 'b',
                8: 'd',
                9: 'f'
              };
              for (var t = 0; t < e.length; t++) {
                result += TransCode[e.substring(t, t + 1)];
              }
              return result;
            };
            this.GuiSelectbox = west.gui.Selectbox;
            this.Guicheckbox = west.gui.Checkbox;
            this.Guitextfield = west.gui.Textfield;
            this.Guibutton = west.gui.Button;
            this.Guidialog = west.gui.Dialog;
          };
          TWX.CT.Chat = new function () {
            this.init = function () {
              if (!$('div.chat_room').length)
                return;
              clearInterval(TWX.CT.initInterval);
              this.Draw();
              TWX.CT.initInterval = setInterval(function () {
                TWX.CT.Chat.OnChanelChange();
              }, 500);
            };
            this.Draw = function () {
              if (isDefined(this.btncolor))
                return;
              var e;
              $('#colorTxtStyle').append('div.btnColor{cursor: pointer;position: absolute;right: 0px; width: 25px;height: 25px;}\n');
              $('#colorTxtStyle').append('div.btnColorBG{background-image: url(data:image/png;base64,' + border + ');background-position: 0px 3px;background-repeat: no-repeat;}\n.btnColorBG:hover{background-position: -25px 3px;}\n');
              $('#colorTxtStyle').append('div.btnColorImg{width: 11px; height: 11px; margin: 8px 0px 0px 5px; position: absolute; border-radius: 5px; background-image: url(data:image/png;base64,' + color + ');}\n');
              $('#colorTxtStyle').append('div.btnColorSmiley{border-top-right-radius: 10px;border-top-left-radius: 10px;border: 1px solid #646464;box-shadow: 0px 0px 1px 1px black;background-image: url(images/interface/wood_texture_dark.jpg);width: 425px;bottom: 18px;left: -400px;height: 208px;\t margin: 0px 0px 6px 0px; position: absolute;}\n');
              $('#colorTxtStyle').append('div.btnColorOneSmiley{display: inline-block; cursor: pointer; width: 17px; height: 13px; padding: 1px; text-align: center; vertical-align: middle;}\n');
              this.btncolor = $('<div class="btnColor btnColorBG">').append($('<div class="btnColorImg btnColorImgTag">').click(function () {
                    TWX.CT.Window.show();
                  })).append(e = $('<div class="btnColorSmiley">').hide()).on('mouseleave', function () {
                  $('div.btnColorSmiley:last-child', this).hide();
                }).on('mouseenter', function () {
                  $('div.btnColorSmiley:last-child', this).show();
                });
              for (var t in sm) {
                if (sm[t] !== '') {
                  e.append($('<div class="btnColorOneSmiley">').data('Tag', t).click(this.addSmToTxt).append(sm[t]));
                }
              }
            };
            this.addSmToTxt = function (e) {
              var inp = $(e.target).parentsUntil($('div.chat_main')).find('input');
              var n = $(e.currentTarget).data('Tag');
              var r = inp[0].selectionStart;
              var i = inp[0].selectionEnd;
              var s = inp.val();
              if (n == '[player][/player]') {
                s = s.substring(0, r) + '[player]' + s.substring(r, i) + '[/player]' + s.substring(i);
              } else if (n == '[item=]') {
                s = s.substring(0, r) + '[item=' + s.substring(r, i) + ']' + s.substring(i);
              } else {
                s = s.substring(0, r) + ' ' + n + s.substring(r);
              }
              inp.val(s);
            };
            this.appliquer_couleur = function (e, t) {
              if (e === '')
                return '';
              if (t == '999' && !TWX.CT.DATA.Setting.Default.Format.startsWith('/111* '))
                return e;
              if (e.toLowerCase().indexOf('[player]') === 0 && e.toLowerCase().indexOf('[/player]') !== -1)
                return e.substring(0, e.toLowerCase().indexOf('[/player]') + 10) + ' ' + this.appliquer_couleur(e.substring(e.toLowerCase().indexOf('[/player]') + 10), t);
              if (e.toLowerCase().indexOf('[report=') === 0 && e.toLowerCase().indexOf('[/report]') !== -1)
                return e.substring(0, e.toLowerCase().indexOf('[/report]') + 10) + ' ' + this.appliquer_couleur(e.substring(e.toLowerCase().indexOf('[/report]') + 10), t);
              if (e.toLowerCase().indexOf('http') === 0)
                if (e.indexOf(' ') !== -1)
                  return e.substring(0, e.indexOf(' ') + 1) + ' ' + this.appliquer_couleur(e.substring(e.indexOf(' ') + 1), t);
                else
                  return e;
              if (e.toLowerCase().indexOf('[item=') === 0 && e.indexOf(']') !== -1)
                return e.substring(0, e.indexOf(']') + 1) + ' ' + this.appliquer_couleur(e.substring(e.indexOf(']') + 1), t);
              if (e.toLowerCase().indexOf('[marker') === 0 && e.indexOf(']') !== -1)
                return e.substring(0, e.indexOf(']') + 1) + ' ' + this.appliquer_couleur(e.substring(e.indexOf(']') + 1), t);
              for (var n in sm) {
                if (e.indexOf(n) === 0)
                  return e.substring(0, n.length) + ' ' + this.appliquer_couleur(e.substring(n.length), t);
              }
              if (t.length == 3)
                return '/' + t + e;
              if (e.charAt(0) == ' ')
                return e.charAt(0) + this.appliquer_couleur(e.substring(1), t.substring(3) + t.substring(0, 3));
              return '/' + t.substring(0, 3) + e.charAt(0) + ' ' + this.appliquer_couleur(e.substring(1), t.substring(3) + t.substring(0, 3));
            };
            this.fCharAt = function (str, idx) {
              str += '';
              var ret = '',
              end = str.length,
              surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
              while ((surrogatePairs.exec(str)) != null) {
                var li = surrogatePairs.lastIndex;
                if (li - 2 < idx)
                  idx++;
                else
                  break;
              }
              if (idx >= end || idx < 0)
                return '';
              ret += str.charAt(idx);
              if (/[\uD800-\uDBFF]/.test(ret) && /[\uDC00-\uDFFF]/.test(str.charAt(idx + 1)))
                ret += str.charAt(idx + 1);
              return ret;
            };
            this.flipString = function (e) {
              if (e.length === 0)
                return '';
              var eO = this.fCharAt(e, 0);
              for (var p in fl)
                if (p == eO)
                  return this.flipString(e.substring(eO.length)) + fl[p];
                else if (fl[p] == eO)
                  return this.flipString(e.substring(eO.length)) + p;
              return this.flipString(e.substring(eO.length)) + eO;
            };
            this.OnPressKeyEnter = function (e) {
              var obj = $.extend({}, $(e.target).data('ColorTchat')),
              n = $(e.target).val(),
              r;
              if (n.charAt(0) == '/') {
                if (n.substring(0, 6) == '/tell ') {
                  if (n.indexOf(':') !== -1) {
                    r = n.substring(6, n.indexOf(':') + 1);
                    n = n.substring(n.indexOf(':') + 1);
                  }
                } else {
                  var i = [
                    '/topic',
                    '/clear',
                    '/logout',
                    '/ignorelist',
                    '/ignore',
                    '/unignore',
                    '/rights',
                    '/color',
                    '/me',
                    '/help',
                    '/?',
                    '/join',
                    '/items',
                    '/items.s',
                    '/items.add',
                  ];
                  for (var s = 0; s < i.length; s++) {
                    if (n.substring(0, i[s].length) == i[s]) {
                      return;
                    }
                  }
                }
              }
              if (/\/flip /.test(n.substring(0, 6))) {
                obj.Format = '%f';
                n = n.substring(6);
              }
              if (/\/[0-9]{3}/.test(n.substring(0, 5))) {
                obj.Format = '%n';
              }
              if (typeof r != 'undefined')
                obj.Format = '/tell %t:' + obj.Format;
              var cT = function () {
                var te = '',
                co = obj.colorTag;
                if (!co || co.length % 3 !== 0)
                  return '999';
                if (co.length !== 3) {
                  for (var n = 1; n < co.length / 3 - 1; n++)
                    te = co.substring(n * 3, n * 3 + 3) + te;
                  return co + te;
                } else
                  return co;
              }
              (),
              code = /%[C-n]/.exec(obj.Format)[0],
              newN;
              switch (code) {
              case '%c':
                newN = this.appliquer_couleur(n, cT);
                break;
              case '%C':
                newN = this.appliquer_couleur(n, cT).toUpperCase();
                break;
              case '%f':
                var u = this.flipString(n);
                newN = this.appliquer_couleur(u, cT);
                break;
              case '%F':
                var f = this.flipString(n.toUpperCase());
                newN = this.appliquer_couleur(f, cT);
                break;
              default: //%n
                newN = n;
                break;
              }
              $(e.target).val(obj.Format.replace(code, newN));
            };
            this.OnChanelChange = function () {
              if (!$('div.chat_room').length)
                return;
              clearInterval(TWX.CT.initInterval);
              $('div.chat_room').find('.chat_input').each(function (e) {
                if (!$(this).children().is('.btnColor')) {
                  $(this).append(TWX.CT.Chat.btncolor.clone(true));
                  $(this).find('input.message').on('keypress', function (e) {
                    if (e.keyCode == 13) {
                      TWX.CT.Chat.OnPressKeyEnter(e);
                      document.focusing = undefined;
                    }
                  }).data('ColorTchat', TWX.CT.DATA.Setting.Default);
                  TWX.CT.Chat.Change = true;
                }
              });
              this.ChangeColor();
              TWX.CT.initInterval = setInterval(function () {
                TWX.CT.Chat.OnChanelChange();
              }, 500);
            };
            this.ChangeColor = function () {
              if (this.Change === false)
                return;
              this.Change = false;
              var e = TWX.CT.DATA.Setting.Default.colorTag;
              if (pos[e])
                $('#colorTxtStyleTmp').text('div.btnColorImgTag{background-position: ' + pos[e] + '; z-index: 6}\n');
              else
                $('#colorTxtStyleTmp').text('div.btnColorImgTag{background: ' + TWX.CT.Tools.Degrader(e) + '}\n');
              $('div.chat_room').each(function (e) {
                $(this).find('input.message').data('ColorTchat', TWX.CT.DATA.Setting.Default);
              });
            };
            var fl = {
              a: 'ɐ',
              A: 'Ɐ',
              b: 'q',
              B: '𐐒',
              c: 'ɔ',
              C: 'Ɔ',
              d: 'p',
              D: 'ᗡ',
              e: 'ǝ',
              E: 'Ǝ',
              f: 'ɟ',
              F: 'Ⅎ',
              g: 'ƃ',
              G: '⅁',
              h: 'ɥ',
              i: 'ᴉ',
              j: 'ɾ',
              J: 'ſ',
              k: 'ʞ',
              K: 'ʞ',
              l: 'ן',
              L: '⅂',
              m: 'ɯ',
              M: 'W',
              n: 'u',
              N: 'N',
              P: 'Ԁ',
              Q: 'Ὁ',
              r: 'ɹ',
              R: 'ᴚ',
              t: 'ʇ',
              T: '⊥',
              U: '∩',
              v: 'ʌ',
              V: 'Ʌ',
              w: 'ʍ',
              y: 'ʎ',
              Y: '⅄',
              1: 'ɩ',
              2: 'ζ',
              3: 'Ɛ',
              4: 'ᔭ',
              5: 'ﻛ',
              6: '9',
              7: 'ㄥ',
              '.': '˙',
              '[': ']',
              '(': ')',
              '{': '}',
              '?': '¿',
              '!': '¡',
              '\'': ',',
              '<': '>',
              '_': '‾',
              ';': '؛',
              '&': '⅋',
              '"': '„',
              '‿': '⁀',
              '⁅': '⁆',
              '∴': '∵',
            },
            sm = {
              ':-)': '',
              ':)': '<img src ="images/chat/emoticons/smile.png">',
              ':-D': '',
              ':D': '<img src ="images/chat/emoticons/grin.png">',
              ':-(': '',
              ':(': '<img src ="images/chat/emoticons/frown.png">',
              ';-)': '',
              ';)': '<img src ="images/chat/emoticons/smirk.png">',
              ':-p': '',
              ':p': '',
              ':-P': '',
              ':P': '<img src ="images/chat/emoticons/tongue.png">',
              '-.-': '<img src ="images/chat/emoticons/nc.png">',
              '^_^': '',
              '^^': '<img src ="images/chat/emoticons/happy.png">',
              'O.o': '',
              'o.O': '',
              'O_o': '',
              'o_O': '<img src ="images/chat/emoticons/oo.png">',
              ':-/': '',
              ':/': '<img src="images/chat/emoticons/sore.png">',
              '=:)': '<img src="images/chat/emoticons/invader.png">',
              '>:(': '<img src="images/chat/emoticons/angry.png">',
              'T_T': '',
              'T.T': '',
              ':\'(': '<img src="images/chat/emoticons/cry.png">',
              ':-o': '',
              ':o': '',
              ':-O': '',
              ':O': '<img src="images/chat/emoticons/ohmy.png">',
              ':-x': '',
              ':x': '',
              ':-X': '',
              ':X': '<img src="images/chat/emoticons/muted.png">',
              ':-|': '',
              ':|': '<img src="images/chat/emoticons/silent.png">',
              '>_<': '',
              '>.<': '<img src="images/chat/emoticons/palm.png">',
              'X_X': '',
              'x_x': '',
              'X.X': '',
              'x.x': '<img src="images/chat/emoticons/xx.png">',
              'el pollo diablo!': '<img src ="images/chat/emoticons/elpollodiablo.png">',
              '!el pollo diablo': '<img src ="images/chat/emoticons/elpollodiablo_mirror.png">',
              'el pollo diablo?!': '<img src ="images/chat/emoticons/elpollodiablo_front.png">',
              'addme!': '<img src="images/chat/emoticons/sheep_rainbow.gif">',
              'addme': '<img src="images/chat/emoticons/sheep.gif">',
              '[player][/player]': '<div style="background-image: url(images/tw2gui/tw2gui_bbcodes.png); background-position:-88px 20px; width: 21px; height: 20px">',
              '[item=]': '<img src="images/forum/icon/cowboy_boots.png" style="background: url(images/tw2gui/tw2gui_bbcodes.png); background-position:-22px 20px; width: 21px; height: 20px">',
            },
            em = [
              '😄', '😃', '😀', '😊', '😉', '😍', '😘', '😚', '😗', '😙', '😜', '😝', '😛', '😳', '😁', '😔', '😌', '😒', '😞', '😣', '😢', '😂', '😭', '😪', '😥', '😰', '😅', '😓', '😩', '😫', '😨', '😱', '😠', '😡', '😤', '😖', '😆', '😋', '😷', '😎', '😴', '😵', '😲', '😟', '😦', '😧', '😈', '😮', '😬', '😐', '😕', '😯', '😶', '😇', '😏', '😑', '🙈', '🙉', '🙊', '💀', '👽', '💩', '🔥', '🌟', '💫', '💦', '💧', '💤', '💨', '👍', '👎', '👌', '👊', '✌️', '👋', '👉', '👈', '🙌', '🙏', '👏', '💪', '🎩', '👑', '👒', '💼', '👜', '👓', '🌂', '💛', '💙', '💜', '💚', '❤️', '💔', '💗', '💓', '💕', '💘', '💌', '💋', '💍', '💎', '💬', '💭', '🐶', '🐺', '🐱', '🐭', '🐹', '🐰', '🐸', '🐯', '🐨', '🐻', '🐷', '🐮', '🐗', '🐵', '🐒', '🐴', '🐑', '🐘', '🐼', '🐧', '🐦', '🐤', '🐔', '🐍', '🐢', '🐛', '🐝', '🐜', '🐞', '🐌', '🐙', '🐚', '🐠', '🐟', '🐬', '🐳', '🐋', '🐄', '🐏', '🐀', '🐃', '🐅', '🐇', '🐉', '🐎', '🐐', '🐓', '🐕', '🐖', '🐁', '🐂', '🐡', '🐊', '🐫', '🐪', '🐆', '🐈', '🐩', '☀️', '⛅️', '☁️', '⚡️', '☔️', '❄️', '⛄️', '🌁', '🌈', '🌊', '🎓', '🎃', '🎅', '🎄', '🎁', '🎉', '🎊', '🎈', '📱', '📞', '⏰', '🔒', '🚿', '🚽', '🚬', '💣', '🔫', '🔪', '💰', '✂️', '🎤', '🎧', '🎶', '🎻', '🎺', '🎷', '🎸', '🎮', '🏈', '🏀', '⚽️', '⚾️', '🎾', '🎳', '⛳️', '🏁', '🏆', '🎿', '🏂', '🏊', '🏄', '☕️', '🍸', '🍹', '🍷', '🍴', '🍕', '🍔', '🍟', '🍳', '🍩', '🍦', '🍨', '🍪', '🍫', '🍬', '🍭', '🍎', '🍇', '🍓', '🍌', '🍍', '🍅',
            ];
            for (var j of em)
              sm[j] = j;
            if (EvName == 'Easter')
              sm['easter!'] = '<div style="background-image: url(images/window/events/easter/easter_sprite.png); background-position:-20px 0px; width: 17px; height: 20px">';
            else if (EvName)
              sm[EvName.toLowerCase() + '!'] = '<img src="images/icons/' + EvName + '.png">';
            var color = 'iVBORw0KGgoAAAANSUhEUgAAAGAAAAAMCAYAAACdrrgZAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHpsAACAjgAA+FQAAIITAAB2OwAA9IEAADvkAAAbd5lS/4AAAAbDSURBVHja7JhLaBzZFYa/c6tf1a12Sy3Zssex/GLG8VtOsDMTDCFMCJ10IK9NZhGyCEMgRHgQCLLLLgjvBrwNIZBVCMoL4gweyGJs8DgeO57YHnvkka2XLcmtV6vV1V2tqpNFXbValmyPFtnlwEWl29/96697zj0qtfz0q7v1zpTH8FMPVeVQV5rjr7hozFA9m6Z2MgVA4oZH8kqVBCGqyoh7jD31YVJhDcUQAqohNUkykTjIfu8TUKicvCxsId7fs5ctRTy2JfzqL7cmf0t1S/yXt/C0BxTM7cdVbk5UWPYDqo2QGxMVbpc8KqdTVL+WIcg5BDkH7+tt1M5mEAURZfjBfa48Noz7aUQENGSiluTqlMP4xCjGwCbevw9cBGbtuGjnnhdb54WLCLN2vJQXuGhg1sCs/A/8CFyUSHtTfXP/aS3aQARVEBFuz3ssv54GWUunAPXTLkLITNUhmJxmmhjlaoMgXAFgZr5C2c1SH52g5DkYsy4D54EhhAKGPA55hAIwZD97NiwvBRyTxzF5jDyfF86jDFGnwDJ5KuSpUUA35wXOKwwtQ2Ee8vOQr0IhhCF5gR8DBQfyDuQNL/av6FCNaqHCQr7CYr6GV1DCdfoGiEpVFRFBW8tWlSg1gtokeOrwn3o7fwpW+PHYI+rBCo7j4MQcJObw1sgwQ40Gt+vbaBhnVakIDEQCQAmYAapWFAYss5FfrsHjhWgs1Z7PKwNUgTlg2urP23voel6gGMDAokXHgHF7vQQEMCCb+BFg0fJjQLlpf6MfJRiossg8T5hhjGlGmWcKjyWUsMmbfR0JAiAUIVAlBF7NJUlf9xAjYAREMUZI3qoxNie8MzrOaQ3Z2Z7js4rgh+AHykjVwQVOo7wzOsHEXPMEnWtu/hTwwI4pOyeWWYtziEDFh0cl+Hg8GqMlWPZXT+a5lnI+h293r2R1p+x1GWhYpkW/bvPzGHgEPAQm7VydjX7ESg0DV4EP7fVSs4rXeIFzPjXKzFJikilGmGaEEhOUmcOnjlg+drzbJes4PCjVEISDnUkO5l34YBkagnfGRQH3mof7UZV7NZc3vSegytN4gtlFj0rmNVBlvvwp0/E4VKu8uVzm17VuzkaeehFbjTPAZy19LQekAaW35YF7MRJV/ORCtPmr0ZmFbAoCXc+vADW7S6WWT9KADyTX9AV6faBiG/lkC74N6AAy0NvSC3odW/0PgX/ZTTfATqAdCFnv36eOxxJLzPKUcQQDCBlyNMiTxO0FiMWN4btdOzncmQMR7pkF7kqZIDAMX/kWdz74HiAcc/7Midhf2Lvd8N5Cjp6FOe5Xlzi8u52PHi2CKid62ql7sLS4yN+PHGd/pr6+K+ozPwHRdb9uaNSfO/QFa+TzLX0ZI3asbv7W7Km1sn5V7BSdnDJ5xN7kDToRTfJ7/QY39G3QEASur/yMkDZOJn/HP3fu4MlimSfbt/NGj8tv3/8EgLcLx3nid/CrkTE+PbiXo+VbLET3uYZSJA10ReWCANub1R8xa3GNUItkU7C7fW12d3tU/aFu5GMUSdkSXo02qx9br69wLQHFLNDZgueBLJCwTKt+CMUcsL8lEfvs7UI2+k+QLKbJkqWzuSJLnhRZ4iSafOyLmiNE7ZtQJHYk6OK2/gBMGJWo/YN8d+XbnJLfkNoV44/xA3ylpxtCj0w2ByiBxOnIGoaO7uX18jDOqjUYbCZgl3Ut0TlXt5mAwZYHGES1SCYB+7qitgOQTUImsfp+O9hSXoMkKJJtaTtAMyFxEGWwpdIHk1DssLfO2cmMbT9JNvpRm7BXgW5rf5tdo8/wCoMJUsU2OlGEDO2A4NJGlg4SpFDLm+ax0E3f2zdMBqGSrZX44YE0X8g0+HjWwRUfVxr8e8awK+Hxo9eybFtZIAiaCbgM9KH4pIEdtvqjzfeBPsts5DMpeKU9GpnU83lDH2l8Oqz+DlvSLj6GPm3hFS470JcFvxvYY0d3dAJ8h/X8qh8FfxvQY3mbb1838WNw+tLk/Dy76GYvO+ihg52kyfqCNPnYsClzLOxoHisB7juzHOWv3Ax/smZZhEOx9wAhRClNT9LoOsz1Gx/yi+98CQQu/O0GR7rPkJx7jBhjX16bcQG4hNKPcoa1Y/sucHeT1Fte+wn05bxyAeESKfqhRV835xUuGLiUgX6xvMI1hXf1BX5C6A95uf9IXy6lcPvBbfLP6svPz+7RYyvtHAii5jkSK3MnvkidODcbb3Fv5ZugyiHzD46aP5CK1RDblh56bVSWq5zoiv4R+7gUoy3jsj9ZJgxBVSifuPL/ryJe8FXEfwcAU73isuGF8swAAAAASUVORK5CYII=',
            border = 'iVBORw0KGgoAAAANSUhEUgAAADIAAAAZCAYAAABzVH1EAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHpsAACAjgAA+FQAAIITAAB2OwAA9IEAADvkAAAbd5lS/4AAAAnFSURBVHjazJhLb5xHdoafU1XfrdmkSJOWLGs8tjQzgDTKxAGCBEjCyYIDZBtAy8CL8e/QWkj+RgBvo613TJBoEiABJlZGE3EiS45lXakmu8m+fZeqc7JotkRZciazywG6PzTQXU+dt+qct6rlr3/+UwN4PJgC8IPvbVIWOQ/3B9TzyNmNihiFg+MZ6oTNfsHhqCGaIhiD4XNCscl6LwNgPD3gb//+6w+AAzObA/zNp3/+VsZ/Px6QVHl3vSJG5cnhjF4eONPPeXo4Q1jEYPjstzLC+pkzACyfGJgaF7beoYstk0nNdN7iRShyx389fESMHWWxQVIhAXfuPeAPfnSJ9V5GTArwU+CfgEenx37JOIkPL5ylbRtm9YzhuKFfBYos8O93HtDrl0ixijMD4Is3GX8M/OuSEX59/8l8NOuq4eEjEPDSp8gDuTNmUdEYaZtI7AxMF4lipPQE1YRzFWeAL+894Ic/usTvXfoI/vGby8AXywn/+v6T4WjWbXy2+ysAcu/wziFiGIthFWMxZ8EwzAzBEBH05Dt3vvkVn+z8ZMn4EPjPJSNc2FrhAnDz/te8u1Ywjg0hRloVSu8whNWQQaEQFBQEwUTIi0CZFUid+GrUcvX76y/HBdzyw5IBkAdHHgRQSnGId4Qgi+S8Q8wQJ5g4uqi0XUcTlS4a81ZPM/xpRrh9775sbpxjsSGNnIgzoyo9PnNk3uEEgneIMxRwBiZG5pV+1mBlRZ2t8HgwZTB8BixEXEJu37vvtjbewwmUAj/cKlkpPL3SUxUFeeYpMyP3INFIImQO6nnL4TTwzUQZjjtGkng0mHLwFkbY2jjnBofPWXU5H2ysMZ11eJ/wCAG7JcpNRHYT3CXJFWAnYdcQt21mjFLH+LDhAOinxNbGOeDJa7WwtfGefzF8xkoRuPLBBn/x8Vmy3GEGInLLOW46s11RvRtTulLP251m1lwzddv96Hm36TTriRMRXgyfcXb97BuMYAgh32T17DG0Y1bLgmgOgc/AbjhhzzCSAsrthN3G+Byx65r4ZDV3nDvXJw3nWH6GC1v9xeoar4OyTcowoApQBaOXecz4TMVuJNW9pAlNSkrxtmG3LfjPi2TXWfWfZGXmtszTPj4mz9d5f72vTkBPMZxg2epK4HB/xDQaYAS45bEbHtlTBU2Q1IgGqJASezHajaaxW8djYzgxxm1BL895NJgiiAB8+rOryw5anul5iiqw0gvUbcOknt6a1vMb00m9Nzmec3RUcziaMTyqOZ621E23F01voHari8ZwPGXamFbB6ePRDMG514QCEWeJMi/RoiRpxGE3gb1lJ7GXBW6ogHgQk72kdnPe2ra1xmh8xPn31hAqwAQgqp60dA0JoWuNw8MJz3uOMvc3nZM9OVFW1YiLVSdFiGp0Ke3Vrd6c1nE7RVgJ3kVMc8A5Q1VOJWKGCUicYpNAUyge2fWytBXBWLRHOWmPIot+EWC3q0CbhjL0UAt4AxxKgmQ4Fg/FouItdHjq5LBWd70I4sA5wYuQe4HgIAckkIBVk931pMzapPFwhuBIYuoC4qO9tiJgQlUF+quJWS0gdtdUEHeSzcvEF0mIBy+Ceu7GqVF3SkeHqQPMZGE3nNgEZmg0nJwobSgq/u7CtxY+IQgOW7zcwk0Eo1W92ybVrjWnJupNW0k4UmZq3cvt5RA4miUOp/BovyWIILgrJ9sck8WqCCDO8H4hmnNG5rmSV45eryQnZ5YSJiJiIk5EkppbCjGdJeeDiyuZ4SziLF0JYgSB3EEWjCwIWXB45xEX8C4QJFzxEpw5kCgc1SksmomJOyVxWIAS+1PH+rsOwxAnO4LcRljkI7ZYCeSlzCLgnNtZO7NCIRGr+ie6QsIMw7wXXaiFcw5cJmFlpWJ1rSLAjkdui4Bb1h3CchNgoAhO3E4SRRUkRBc8ToyoTnVZgrx0RhN6ldCTnGSGOK7h9bK4xYQ9QhDBy0nFqKKdXk6q1zKBOrZMJqMTjzoVr1ZVFcF3jiLz9BdmeK1X+cu9ylNVnqrMqMqMPM/wIYD3JJPLdbJrszoymScdNxEzFDEkYaaWXiYymnWIc1hsGNNSlY4isF3m7nqeyeW8EEK+sHNVpWsT8zpdnrZ6fd7adtvUxEkEiwtdTvX2uk0GMJq1zptSp4ZpA+tneqyvrWz3+9X1lV55uSwLihDIs0CeeYrgyYO7XGZyvfK2nUxAcUYGIs4JrtUkdooVnuwPMIN53VLFjC55IglvfILZR6Z6M6ntxqh3m06vNNF2OuUazm/3e47Bi5rzG2vEwwMeNwPi+quW+He/+I0BPN0/cGpoTHA0PHb3HmSs9XPyXD5xwkdmdtPMdhW7K8IVL+z44K95H7bLMmOtnZNUSU3N88GIGMV923RDPZ1Q9Pq0DdTB8/TpFBeNLDfUsZ2SbatBUkFNSTjEEk5hPplzrJ7x0YBx07G+2eP56FuWDpwwXDJjdaNHspr9g5ZJm2g72VZj23tHljnKXKhKT3CJwieq3NN6aE0Zt8q6wmB0cgQ/bYhFr1+vhrqkKBgft8yTkJpI39zCyR14bwQFEyETBRzzZMy9MG4bNK+IGlkNNW+Lotc/Wg31meN5ZP/FmD/6wSVmbcf8oGZWzxjXEcMIYoSTrhgI+CKQYkszc3Qe5m1kLX87I1y9eN4Gw2cMps+pO4+2CQmOqRSoGW0byXEQPFIITgSJxrzrKBplZsa0mbC1vkKvX7G18R7cHr4GuXrxvA6GzzAd8uio49/uPSe1LXleoEBRCE48rRrjtiN1iZAZpSWOjyPDWUurSpugt1Kx9c6bjDCadVUoNvnLP1lcJXVxAGM2mzA4OsbJKiv9Ak01asqLoxmbqxWFg6g1dx4e00yUq9+rWBR294Zao1m3EYpN/mrn1XVVBCbzYw6OJuTlFmUWsNhQNy2Tecs7Gz1EO+qtji+fHDOfKH/4443vZIQ/+8mHfHjxfQC+/urJsoWfvC8q6vH+IZr6zOqOjy+9T55n9Ff6qBnwS56PjNlkTq9f8ezF4WtnAYC3MRZxHnB0KfF8f0jUHlGVrbWSqirpVRXjaUMe7vxWRvj8H37B9+9f5MLW4mJU5h7vHON5ixNBDY7nLRpn+FDx5aOnxGT0QmQ4D0urYBxLXjw+Xhraa5eebzOqfPG7Sd3hRYhqHM8bTFucy/iPLx9RZoLGyDSGlzP+3xhiZojIReBnwKfAv7zpbN8ZJfBj4Je8OpVF4DfArpk9fOWNchH40xPGF78Do1r+wXCKkYBvgH9eMpaJ9IBzwMfAgzevRd8ZHrgAPDwFUWAMvDCz2alElozfB776HRnxW4koMDnNELP/63j/v+N/BgBXi5F3d3nGEQAAAABJRU5ErkJggg==',
            pos = {
              999: '0px 0px',
              308318328338348: '-24px -0px',
              106117128139: '-36px -0px',
              120130140150: '-48px -0px',
              400500600700800: '-60px -0px',
              199299399499599699: '-72px -0px',
              505606607709809: '-84px -0px'
            };
          };
          TWX.CT.Window = new function () {
            var saveB = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAIAAAAv2XlzAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAH6SURBVHjaVM89a1RRFIXhtffZ9zOYTBKJYaKOiumiqdKKgmBhqUL+hI2VIFjYCZaChb9ABAtJIQbFIoJoQNSMEKLkC+IEZhLnzuTM3DP3nm2hhLjq9RYPRceOn5qeDUWcyw0jjUNjDBsTiEnikADbd13rbF7sbKwetLZkdPLs5Ru34cvv9ZXauNy6OlOrnZ6aOmmC+FN9KxQzd+HMs8Wv71caG6ufl54/EvW+28nyfr/V2hvh4KCb9W2XfP5rN3vwZCGJ5en9+Z7tZu3faZKaIBIiEKlhiqMgikMjwswKAJAgEBEAhskwoCVUBQBUiSGBRGEYCweGhPnE2PD8tdk4DCrDQ1nH2l6/KEsQBABB1StIfu5kr5c3zzcHE9udykhl5txEIPxicfnd8mpeStFzBAgBWcfud2xBYUH8diV7862tWldVKBQgIE3jsdGKVw9AitLvtTvMdGVuulYdJyLVvwQAIBAzrW3ufllrDJxT9VKW5X67e/3SxYd3bjKKvu2B6DCAahSFecn3Hi+8fLWuqjIoCmt7IsxMe812s9li5sO/934oTSar1TQJDqxVVfFenXO+LAGEYZikydFAVeM4BtHADVzuVFWIWFkUVBYuTZMwjvD/xLBqCZCyAZHkWUMa9Q9L7m573Xs9Kv7nJmLmj/XtQeuHd70/AwDj7v01yw6ZhAAAAABJRU5ErkJggg==',
            setB = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTM0A1t6AAACoUlEQVQ4T42Uy2sTURTGk1Zbq+ILUdyKG5uZSerQkPbeyYAYCZhlggurFUJN5xGUgiBushdBsQguFMGFC7EqLiyiCwWh0IL/QH3tFJcu1CKlft+duTqJieTA4Z7cOfeX755zZlLaarXaYBx2i9OMW63WQDI2ZDBniOCrKcMHo66/nfvKXNfdgkUlMo4Ppsrl8rCGYx2ybXtzZsIbN47W91vCuwLQhimDDQuekeFl5rUpKBQKIxpAMHwTY8IIN4QfmtL/Dv+WhKnY8S/qfGVJGA8nYXTDCU+YIvhhykbVFCHWBEwGz+1jtZ3MV0Y1vZTRGY8V64eh7BGgP+GPTeG/UjARvCkcr+5hjjKCkjXrBssVZ8YB+wJl96BmwZL+EtY1NOWZJb0VpLBkaX1WWS9lCib8j1knzANyC824b4jwIbr7EvFrQ/rXkJauVqsjXHnmv8rQiPem9GzsDVYqla2A3oayu1C8AOgTvY/0CMYNehz/C3P8IoC7jzinDtju3F7Aliw5exqTONABS2uOInfCTOF9yIjwBlT8QrzOeqEJKxFMWToJ45TEcReY9FbNyWAe11vnaKBmi+jmsiUaZ5CiAEkY66cbq14hvgGMc7Ixqq4JZX9hwSKV5SIYrSes7cqEYhyuA3S1TZkMlk1nZjrO6wnjlGCJVLLDrju9C4ffWSK4iQ6ucTQi2CxhtJ6w5FtGY7eGALgEwLw1ee4krngHvpp1GmfjnL5gek9d2RK+BPATavbWEmF9ojS1L37WF4yzrPdVMUulqW3o7sFD5eYwD6kHfcKSbxktnZUNAWUv8vnmjhjWt7IOmHrOL+9T1AxfDu+82o4BXOkEaBgByWtqGKdE76cwtBfgn61ic4y/4yTC9GwlYwXmH/ypWdRYPEulfgMLajrH8hIjewAAAABJRU5ErkJggg==',
            cList = [
              '999', 'custom', '700', '321', '409', '007', '031', '704', '608', '308318328338348', '106117128139', '120130140150', '400500600700800', '199299399499599699', '505606607709809', '696595494393292', '959949839829819', '900911922933944'
            ];
            this.showOn = function () {
              var e,
              i,
              format = TWX.CT.DATA.Setting.Default.Format;
              $((this.w = wman.open('CT', 'ColorTchat').setTitle(TWXlang.CT.ColorWindowTitle).setMiniTitle(TWX.CT.name).setSize(350, 400)).getContentPane()).css('text-align', 'center').append(i = $('<input type=hidden class="color" id="colorinput" value="66ff00">'));
              (this.ColorPicker = new jscolor.color(i[0], {
                  pickerOnfocus: false
                })).showPicker();
              this.tab1 = $('<div style="display:inline-block;width:290px;height:275px;position:relative;padding:4px12px4px4px;text-align:left">').appendTo(this.w.getContentPane()).append($(jscolor.picker.boxB).css({
                    position: 'relative',
                    display: 'inline-block',
                    'background-color': ''
                  })).append($('<div id="colorPanelDIV" style="display:inline-block;width:auto;height:123px;position:relative;margin-left:7px;border:' + this.ColorPicker.pickerBorder + 'px solid;border-color:' + this.ColorPicker.pickerBorderColor + '">').append($('<div id="colorWSetbtn" style="width:20px;height:20px;background-image:url(' + setB + ');margin:10px;cursor:pointer;">').click(function (e) {
                      TWX.CT.Window.SetPreviewColor(0);
                    })).append($('<div id="colorWLoadbtn" style="width:20px;height:20px;margin:10px;cursor:pointer;">').click(function (e) {
                      TWX.CT.Window.selectLoad.show(e);
                    })).append($('<div id="colorWSavebtnBg" style="width:20px;height:20px;background-image:url(' + saveB + ');background-size:100%100%;margin:10px;cursor:pointer;">').click(function (e) {
                      TWX.CT.Window.selectSave.show(e);
                    }))).append(e = $('<div id="PreviewDIV" class="chatwindow_background" style="display:inline-block;width:287px;height:60px;position:relative;zIndex:5;margin-top:5px;border:' + this.ColorPicker.pickerInset + 'px solid;border-color:' + this.ColorPicker.pickerInsetColor + ';color:white;background:#1D1C1C;opacity:' + $('.tw2gui_window_inset', '.chat').css('opacity') + '">')).append($('<div style="display:inline-block;position:relative;padding:4px;width:45%">').append((this.Bold = new TWX.CT.Tools.Guicheckbox(TWXlang.CT.ColorWindowBold).setSelected(/\*.*\*/.test(format))).getMainDiv().click(function () {
                      TWX.CT.Window.updateFormat();
                      TWX.CT.Window.updatePreview();
                    }))).append($('<div style="display:inline-block;position:relative;padding:4px;width:auto">').append((this.Caps = new TWX.CT.Tools.Guicheckbox(TWXlang.CT.ColorWindowCaps).setSelected(/%C|%F/.test(format))).getMainDiv().click(function () {
                      TWX.CT.Window.updateFormat();
                      TWX.CT.Window.updatePreview();
                    }))).append($('<div style="display:inline-block;position:relative;padding:4px;width:45%">').append((this.Flip = new TWX.CT.Tools.Guicheckbox(TWXlang.CT.ColorWindowFlip).setSelected(/%f|%F/.test(format))).getMainDiv().click(function () {
                      TWX.CT.Window.updateFormat();
                      TWX.CT.Window.updatePreview();
                    }))).append((this.inputFormat = new TWX.CT.Tools.Guitextfield('bdfFormat').setValue(format).setSize(14).setReadonly(true)).getMainDiv());
              $((this.selectLoad = (new TWX.CT.Tools.GuiSelectbox('topleft-left')).setPosition(42, 10).addListener(function (e) {
                    TWX.CT.Window.LoadColor(e);
                    setTimeout(function () {
                      TWX.CT.Window.selectLoad.hide();
                    }, 0);
                  }).setWidth(200).setHeight(300)).elContent).css({
                'overflow-y': 'auto'
              });
              this.selectSave = (new TWX.CT.Tools.GuiSelectbox('topleft-left')).setPosition(42).addListener(function (e) {
                TWX.CT.Window.SaveColor(e);
                setTimeout(function () {
                  TWX.CT.Window.selectSave.hide();
                }, 0);
              }).setWidth(200);
              for (var s = 0; s < cList.length; s++)
                this.selectLoad.addItem(cList[s], $('<div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">').append($('<span style="display:inline-block;width:19px;height:19px;">').css('background', TWX.CT.Tools.Degrader(cList[s]))).append(TWXlang.CT.ColorLoadListName[s]), TWXlang.CT.ColorLoadListName[s]);
              for (s in TWX.CT.DATA.Setting.saves)
                this.selectLoad.addItem(s, $('<div>').append($('<span style="display:inline-block;width:19px;height:19px;">').css('background', TWX.CT.Tools.Degrader(TWX.CT.DATA.Setting.saves[s]))).append(s + (TWX.CT.DATA.Setting.saves[s] == cList[0] ? ' ' + TWXlang.CT.ColorSaveEmpty : '')));
              for (s in TWX.CT.DATA.Setting.saves)
                this.selectSave.addItem(s, $('<div>').append($('<span style="display:inline-block;width:19px;height:19px;">').css('background', TWX.CT.Tools.Degrader(TWX.CT.DATA.Setting.saves[s]))).append(s + (TWX.CT.DATA.Setting.saves[s] == cList[0] ? ' ' + TWXlang.CT.ColorSaveEmpty : '')));
              for (s = 1; s < TWXlang.CT.ColorWindowPreviewTxt.length; s++)
                $('<div id="idColorPreview_' + s + '"style="display:inline-block;cursor:pointer" onclick="javascript:TWX.CT.Window.SetPreviewColor(\'' + s + '\');">').appendTo(e);
              this.customTF = (new TWX.CT.Tools.Guitextfield).setSize(30);
              this.test = function () {
                TWX.CT.Window.customTest.html(TWXlang.CT.CustomNotReady).css('color', 'red');
                v = TWX.CT.Window.customTF.getValue();
                if (v.length % 3 == 0 && /[0-9]+/.exec(v) == v) {
                  TWX.CT.Window.customTest.html(TWXlang.CT.CustomReady).css('color', 'green');
                  TWX.CT.Window.customPrev.css('background', TWX.CT.Tools.Degrader(v));
                }
              };
              this.customTF.getField()[0].addEventListener('keyup', this.test);
              this.customPrev = $('<div style="float:left;margin-top:5px;width:19px;height:19px;">');
              this.customTest = $('<div style="height:12px;width:120px;">');
              this.customTF.divMain.append(this.customPrev, this.customTest);
              this.DefaultButton = (new TWX.CT.Tools.Guibutton(TWXlang.CT.ColorWindowToDefaultBtn, function () {
                  TWX.CT.Window.DefaultClick();
                })).appendTo(this.w.getContentPane());
              this.OkButton = (new TWX.CT.Tools.Guibutton(TWXlang.CT.ColorWindowThisTchatBtn, function () {
                  TWX.CT.Window.OkClick();
                })).appendTo(this.w.getContentPane());
              this.LoadColor(TWX.CT.DATA.Setting.Default.colorTag);
            };
            this.show = function () {
              if (window.jscolor)
                return TWX.CT.Window.showOn();
              $.getScript(TWX.website + 'files/jscolor.js', function () {
                TWX.CT.Window.showOn();
              });
            };
            this.OkClick = function () {
              TWX.CT.DATA.Setting.Default = {
                Format: $('#bdfFormat').val(),
                colorTag: this.ColorTag
              };
              TWX.CT.DATA.Save();
              TWX.CT.Chat.Change = true;
              TWX.CT.Chat.ChangeColor();
              new UserMessage(TWXlang.saveMessage, 'success').show();
            };
            this.DefaultClick = function () {
              TWX.CT.DATA.Setting.Default = {
                Format: '%c',
                colorTag: cList[0]
              };
              TWX.CT.DATA.Save();
              TWX.CT.Chat.Change = true;
              TWX.CT.Chat.ChangeColor();
              this.show();
            };
            this.SetPreviewColor = function (e) {
              if (e == 0) {
                this.ColorTag = this.colorwest(this.ColorPicker.toString());
              } else {
                e--;
                if (e > this.ColorTag.length / 3) {
                  this.ColorTag += this.colorwest(this.ColorPicker.toString());
                } else {
                  this.ColorTag = this.ColorTag.substring(0, e * 3) + this.colorwest(this.ColorPicker.toString()) + this.ColorTag.substring(e * 3 + 3);
                }
              }
              this.updatePreview();
            };
            this.updateFormat = function () {
              var e = this.Flip.isSelected() ? '%f' : '%c';
              if (this.Caps.isSelected())
                e = e.toUpperCase();
              if (this.Bold.isSelected())
                e = '/111* ' + e + ' /111*';
              $('#bdfFormat').val(e);
            };
            this.updatePreview = function () {
              var flip = this.Flip.isSelected();
              var e = flip ? '%f' : '%c';
              if (this.Bold.isSelected())
                e = e.bold();
              if (this.Caps.isSelected())
                e = e.toUpperCase();
              var n = this.ColorTag + TWX.CT.Tools.colorTagInv(this.ColorTag);
              var leng = TWXlang.CT.ColorWindowPreviewTxt.length;
              for (var r = 1; r < leng; r++) {
                var i = document.getElementById('idColorPreview_' + r);
                i.style.color = '#' + TWX.CT.Tools.colorrgb(n.substring(0, 3));
                var g = flip ? leng - r : r;
                var s = TWXlang.CT.ColorWindowPreviewTxt.charAt(g);
                if (s == ' ')
                  i.innerHTML = '&nbsp';
                else
                  i.innerHTML = e.replace('%c', s).replace('%C', s.toUpperCase()).replace('%f', TWX.CT.Chat.flipString(s)).replace('%F', TWX.CT.Chat.flipString(s.toUpperCase()));
                n = n.substring(3) + n.substring(0, 3);
              }
              $('#colorWLoadbtn').css('background', TWX.CT.Tools.Degrader(this.ColorTag));
              $('#colorWLoadbtn').attr('title', TWXlang.CT.ColorLoadTitle + this.ColorTag);
            };
            this.SaveColor = function (e) {
              TWX.CT.DATA.Setting.saves[e] = this.ColorTag;
              for (var i in this.selectLoad.items) {
                if (this.selectLoad.items[i].value == e) {
                  $(this.selectLoad.items[i].node[0].firstChild).css('background', TWX.CT.Tools.Degrader(TWX.CT.DATA.Setting.saves[e]));
                  this.selectLoad.items[i].node[0].lastChild.textContent = e + (TWX.CT.DATA.Setting.saves[e] == cList[0] ? ' ' + TWXlang.CT.ColorSaveEmpty : '');
                }
                if (typeof this.selectSave.items[i] != 'undefined')
                  if (this.selectSave.items[i].value == e) {
                    $(this.selectSave.items[i].node[0].firstChild).css('background', TWX.CT.Tools.Degrader(TWX.CT.DATA.Setting.saves[e]));
                    this.selectSave.items[i].node[0].lastChild.textContent = e + (TWX.CT.DATA.Setting.saves[e] == cList[0] ? ' ' + TWXlang.CT.ColorSaveEmpty : '');
                  }
              }
              this.updateFormat();
              TWX.CT.DATA.Save();
            };
            this.LoadColor = function (e) {
              if (/save/.test(e)) {
                e = TWX.CT.DATA.Setting.saves[e];
              }
              if (e == 'custom') {
                this.customTF.setValue(this.ColorTag);
                this.test();
                (new TWX.CT.Tools.Guidialog(TWXlang.CT.ColorLoadListName[1], this.customTF.getMainDiv(), 'question')).addButton(TWXlang.CT.ColorWindowOkBtn, function () {
                  var e = TWX.CT.Window.customTF.getValue();
                  if (e.length % 3 == 0 && /[0-9]+/.exec(e) == e)
                    TWX.CT.Window.LoadColor(e);
                }).addButton('cancel').show();
                return;
              }
              this.ColorPicker.fromString('#' + TWX.CT.Tools.colorrgb(e.substring(0, 3)));
              this.ColorTag = e;
              this.updateFormat();
              this.updatePreview();
            };
            this.colorwest = function (e) {
              Wr = (parseInt(e.substring(0, 2), 16) / 255 * 9).toFixed();
              Wg = (parseInt(e.substring(2, 4), 16) / 255 * 9).toFixed();
              Wb = (parseInt(e.substring(4), 16) / 255 * 9).toFixed();
              return Wr + Wg + Wb;
            };
          };
          $('head').append($('<style id=\'colorTxtStyle\'>'));
          $('head').append($('<style id=\'colorTxtStyleTmp\'>'));
          $('#colorTxtStyle').append('div.tw2gui_window.chat div.chat_room div.chat_input div.cbg {right: 65px}\n');
          $('#colorTxtStyle').append('div.tw2gui_window.chat div.chat_room div.chat_input a.speak {right: 25px}\n');
          TWX.CT.initInterval = setInterval(function () {
            TWX.CT.Chat.init();
          }, 500);
        }
      };
      TWX.QuickItemsSearch = {
        init: function () {
          var skillsL = [];
          TWX.QIS = {
            buffDesc: function (umt) {
              return umt.replace(/\+|\d/g, '').replace(/:.+/, ':').trim().toLowerCase();
            },
            useboni: {},
            sets: [{
                name: 'adventure',
                img: 44053,
                bons: ['offense', 'defense']
              }, {
                name: 'work',
                img: 1879,
                bons: ['joball', 'drop', 'premiumAu', '-premiumSp']
              }, {
                name: 'duel',
                img: 842,
                bons: ['dmgduel', 'lpduelS', 'aim', 'dodge', 'punch', 'shot', 'reflex', 'tough', 'appearance'],
                itemsk: [2695, 51871, 53454]
              }, {
                name: 'energy',
                img: 1890,
                bons: ['energy', 'regen', 'premiumEP', '-premiumSp'],
                itemsk: [2483, 2486]
              }, {
                name: 'skill',
                img: 1977,
                bons: skillsL,
                itemsk: [1977, 1978, 1979]
              }, {
                name: 'fk',
                img: 758,
                bons: ['offense', 'defense', 'dmgfb', 'health', 'hide', 'pitfall', 'leadership', '-joball', '-workmoti', 'premiumCh', '-premiumAu']
              }, {
                name: 'speed',
                img: 605,
                bons: ['speed', 'shortway', 'premiumSp', '-premiumEP']
              }, {
                name: 'lp',
                img: 2117,
                bons: ['lp', 'health', 'regen'],
                itemsk: [2483, 2486]
              }, {
                name: 'luckNmoney',
                img: 2290,
                bons: ['luck', 'money', 'dollar', 'premiumIn', 'premiumSf', '-premiumSp']
              }, {
                name: 'duelmoti',
                img: 1939,
                bons: ['duelmoti']
              }, {
                name: 'workmoti',
                img: 1891,
                bons: ['workmoti']
              }, {
                name: 'experience',
                img: 2467,
                bons: ['experience', 'exp', 'levelUp']
              }, {
                name: 'special',
                img: 2482,
                bons: ['premiumCh', 'premiumEP', 'premiumAu', 'premiumIn', 'premiumSp', 'premiumSf', 'regen', 'avatar', 'levelUp'],
                itemsk: [2483, 2484, 2485]
              }, {
                name: 'events',
                img: 2564,
                bons: ['events'],
                itemsk: [55, 12700, 50090]
              }, {
                name: 'chests',
                img: 17002,
                bons: ['bag', 'box', 'collection', 'bonds', 'avatar', 'exp', 'levelUp', 'money', 'events'],
                itemsk: [2482, 2484, 2485]
              }, {
                name: 'equipment',
                img: 2188
              }, {
                name: 'products',
                img: 702,
                itemsk: [1828, 1829, 1830, 1975, 2000, 2003, 2006, 2009]
              }, {
                name: 'questitems',
                img: 17026,
                itemsk: [774, 2001, 2004, 2007, 2010, 51578, 51584, 51590, 51596]
              }, {
                name: 'craftitems',
                img: 1899,
                itemsk: [2000, 2003, 2006, 2009]
              }, {
                name: 'recipes',
                img: 20115
              }, {
                name: 'NAMED',
                img: 842
              }
            ],
            MenuButton: function (image, title, onclick) {
              var that = this;
              this.onClick = onclick;
              var clicked = function (e) {
                if (that.onClick) {
                  that.onClick(that, e);
                }
              },
              mouseIn = function () {
                that.obj.css('background-position', '-25px 0px');
              },
              mouseOut = function () {
                that.obj.css('background-position', '0px 0px');
              };
              this.obj = $('<div class="menulink" title="' + title + '">').css('background-image', 'url(' + image + ')');
              this.obj.on('mouseenter', mouseIn).on('mouseleave', mouseOut);
              this.obj.click(clicked);
              $('#TWX_menu').append(this.obj);
            },
            popup: function (button, e) {
              if (!TWX.QIS.popupMenu) {
                TWX.QIS.popupMenu = new west.gui.Selectbox().setWidth(250);
                TWX.QIS.popupMenu.addListener(TWX.QIS.findSet);
                var qs = TWX.QIS.sets,
                i = qs.length;
                while (i--) {
                  var si = qs[i];
                  si.name2 = TWXlang.QIS[si.name] || si.name;
                }
                qs.sort(function (a, b) {
                  var a1 = replUml(a.name2),
                  b1 = replUml(b.name2);
                  return (a1 == b1) ? 0 : (a1 > b1) ? 1 : -1;
                });
                for (var j = 0; j < qs.length; j++) {
                  var NAME = qs[j].name2;
                  TWX.QIS.popupMenu.addItem(j, '<img src="' + ItemManager.getByBaseId(qs[j].img).image + '" height="20" width="20"><div style="padding-right:20px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;">' + NAME + '</div>', NAME);
                }
              }
              TWX.QIS.popupMenu.show(e);
            },
            findSet: function (id) {
              var invItems = [],
              kItems = [],
              seti = TWX.QIS.sets[id];
              if (seti.name == 'NAMED') {
                for (var biu in Bag.items_by_id) {
                  biu = Bag.items_by_id[biu];
                  if (biu.obj.named)
                    invItems.push(biu);
                }
              } else if (seti.name == 'recipes')
                invItems = Bag.getItemsByItemIds(Bag.items_by_type.recipe);
              else {
                for (var biy of Bag.items_by_type.yield) {
                  biy = Bag.getItemByItemId(biy);
                  var obj = biy.obj,
                  condition = 0;
                  if (obj.usebonus) {
                    if (seti.bons) {
                      for (var oub of obj.usebonus) {
                        var desc = TWX.QIS.buffDesc(oub);
                        if (!desc)
                          continue;
                        var qud = TWX.QIS.useboni[desc];
                        if (seti.name == 'special' && !qud && !desc.includes(TWX.QIS.useboni.joball))
                          condition = 1;
                        else if (seti.bons.includes('-' + qud)) {
                          condition = 0;
                          break;
                        } else if (seti.bons.includes(qud) || seti.name == 'work' && desc.includes(TWX.QIS.useboni.joball))
                          condition = 1;
                        if (['bag', 'collection'].includes(qud))
                          break;
                      }
                    } else if (seti.name == 'questitems')
                      condition = 1;
                  }
                  if (seti.name == 'products' && !obj.usebonus || seti.name == 'questitems' && !condition)
                    condition = obj.spec_type == 'mapdrop';
                  if (seti.name == 'equipment' || seti.name == 'questitems' && !condition)
                    condition = (obj.set || JSON.stringify(obj.bonus) != emptyBoni);
                  if (seti.name == 'craftitems' || seti.name == 'questitems' && !condition)
                    condition = obj.spec_type == 'crafting';
                  if (seti.name == 'questitems') {
                    if (!condition)
                      invItems.push(biy);
                  } else if (condition)
                    invItems.push(biy);
                }
              }
              if (seti.itemsk) {
                for (var ig of seti.itemsk)
                  kItems.push(ig * 1000);
                invItems = invItems.concat(Bag.getItemsByItemIds(kItems));
              }
              if (invItems.length > 0) {
                if (!wman.getById(Inventory.uid))
                  Inventory.open();
                Wear.open();
                if (seti.name == 'products')
                  invItems.sort((a, b) => a.count - b.count);
                else if (seti.name == 'recipes') {
                  invItems.sort((a, b) => a.obj.min_level - b.obj.min_level);
                  invItems.sort((a, b) => a.obj.profession == b.obj.profession ? 0 : a.obj.profession > b.obj.profession ? 1 : -1);
                } else if (seti.itemsk)
                  invItems.sort((a, b) => a.obj.item_id - b.obj.item_id);
                Inventory.showSearchResult(invItems);
              } else
                new UserMessage(TWXlang.QIS.nothingFound, 'hint').show();
            },
          };
          var descsL = {
            ammobelt: [2741, {
                'dmgfb': 0,
                'defense': 1,
                'offense': 2
              }
            ],
            smokedfish: [53503, {
                'joball': 1,
                'dollar': 2 /*'luck': 0*/
              }
            ],
            beanstew: [53504, {
                'luck': 0,
                'drop': 1,
                'speed': 2
              }
            ],
            leaderbag: [52502, {
                'shortway': 3 /*'defense': 0,'offense': 1*/
              }
            ],
            stagecoach: [51582, {
                'regen': 0 /*'drop': 1*/
              }
            ],
            beansoup: [50113, {
                'lp': 0,
                'energy': 1,
                'duelmoti': 2,
                'workmoti': 3,
                'experience': 4,
                'duration': 5
              }
            ],
            wisdompotion: [2196, {
                'exp': 0
              }
            ],
            levelUp: [53842, {
                'levelUp': 0
              }
            ],
            tax: [2201, {
                'money': 0
              }
            ],
            dollar: [2559, {
                'money': 0
              }
            ],
            steak: [53508, {
                'dmgduel': 0
              }
            ],
            testament: [50136, {
                'dmgduel': 1, //(per level)
                'lpduelS': 2,
                'uses': 3 /*'duelmoti':0*/
              }
            ],
            longtimer: [53598, {
                'premiumCh': 0,
                'premiumEP': 2,
                'premiumAu': 4,
                'premiumIn': 6,
                'premiumSp': 8
              }
            ],
            insurance: [2472, {
                'premiumSf': 0,
              }
            ],
            commonbag: [1975, {
                'bag': 0
              }
            ],
            energybox: [50301, {
                'box': 0
              }
            ],
            liquor: [1868, {
                'collection': 0
              }
            ],
            bonds: [2136, {
                'bonds': 0
              }
            ],
            hearts: [2561, {
                'events': 0
              }
            ],
            eggs: [2590, {
                'events': 0
              }
            ],
            fireworks: [2619, {
                'events': 0
              }
            ],
            pretzel: [371, {
                'events': 0
              }
            ],
            cempasuchil: [2675, {
                'events': 0
              }
            ],
            avatar: [50086, {
                'avatar': 0
              }
            ],
          },
          getBuff = function (itm, num) {
            return TWX.QIS.buffDesc(ItemManager.getByBaseId(itm).usebonus[num]);
          },
          misSpecs = {
            mapdrop: [1975],
            crafting: [52027, 52028, 52029, 52030, 52497, 52500, 52501, 52502, 52503, 52504, 52505, 52506, 52518, 52868, 52869, 52870, 52871, 53938, 53939, 53940, 53941],
            none: [738],
            jobdrop: [2000, 2009],
            named: [10, 14, 18, 237, 314, 322, 530, 541, 551, 810, 42035, 42039, 42040, 42044, 42052, 42056, 42060, 42068, 42076, 42085, 42089, 42093, 42101, 42109, 42117, 42125, 42133, 42141, 42149, 53235, 41047, 41056, 41059, 41070, 41079, 41080, 41089, 41104, 41105, 41113, 41128, 41137, 41146, 41155, 41164, 41173, 53178, 40076, 40079, 40080, 40090, 40091, 40099, 40107, 40111, 40115, 40123, 40127, 40135, 40143, 40151, 40159, 40167, 40175, 40183, 53204, 10227, 10235, 10243, 10251, 10259, 53213, 11215, 11223, 11231, 11239, 11247, 11255, 11263, 11271, 53187, 43011, 43015, 43023, 43027, 43031, 43039, 43047, 43055, 43063, 43071, 43075, 43083, 43087, 43095, 43103, 43111, 43119, 43127, 43135, 43143, 53222, 909, 913, 917, 921, 925, 45001, 45005, 45009, 45013, 45017, 53226, 53230, 195, 199, 44003, 44007, 44011, 44015, 44019, 53234]
          };
          var intvQIS = setInterval(function () {
            if (ItemManager.get(0)) {
              clearInterval(intvQIS);
              for (var deL in descsL) {
                deL = descsL[deL];
                for (var boDe in deL[1]) {
                  var boDev = deL[1][boDe];
                  TWX.QIS.useboni[getBuff(deL[0], boDev)] = boDe;
                }
              }
              TWX.QIS.useboni.joball = getBuff(descsL.smokedfish[0], 1);
              for (var kn in CharacterSkills.keyNames) {
                TWX.QIS.useboni[CharacterSkills.keyNames[kn].toLowerCase()] = kn;
                skillsL.push(kn);
              }
              for (var msp in misSpecs)
                for (var imsp of misSpecs[msp]) {
                  if (msp == 'named')
                    for (var h = 0; h <= 5; h++)
                      ItemManager.get(imsp * 1000 + h).named = true;
                  else
                    ItemManager.get(imsp * 1000).spec_type = msp;
                }
            }
          }, 500);
          new TWX.QIS.MenuButton('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAZCAYAAABzVH1EAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QoTBiYArTu6FwAADftJREFUWMMl1tmz3mdBwPHv8zy/fXm3s+ecLE3aLG0a0sWQ2jKlRaotSFspm7JUOoIMoxfi6IXjyI0jN3ojDDoOiozgKFzIoBSxA21ppaG1LU1CkyY5Jyc9+3nPu/7e9/2tz+MF/8N3PvMVf/7Jd5jNjTat2Tu49PY1zHBE7Efk3piwivFrKZNS0IiaDLOMbr+HX5UMbE0TC0pDPWyw0xuxut2hnadgKaajGtUkY6Hhc+pEi82NlOn5BVbe3iAfj6g1WiSJJmpqLB906tGIA8ZjTdLro52UshBoryIqLJwgZK/dZ7s3ZG9cIF1JpFwsUzFTcxF/8cQd5thtd/AnX/o6m5VGlIAlKbVBGRtjbLRIsUxFhcRIg6MVuZC4JiBXPSQKoyu0kfiWR1FO2FeDP/3jp9h59XmUF3Dw5nt4/RcX2MkSjICqzHFFDAxIUwvb9am8hDKTWEZQWhlu1kR7FVQJwki0llRU2LaNEjkNN+bOk7ex8uqLqCMLtS/+4H9eZrmb4UUOYeDjC0kQGBpugOdMaNZdahhCz2I6dgktie0J/KDEd2zqUYAQFZawURIsDKPUUOY5jz14kpcvrPK9Z88xkjnKtzCuwDEaR1lkIseyNTXHIa9GxErSqnkYAZ4E6Wp8LwQDRTZBCg+MTZ5VpGnJ7nbCe371MBIE7dGAylF4BkJZYBmNU4FQGcpIhNHowMVyAkxlQCosNI4l8E2JzEZUhSY0HsiKWhNqLZtXLl7g0thBNVsk0md+qk7W7VFsj8iSlEk2phhmKK3Yau9ha49eb8jb631GewU7/Q79vTH5sKC3vctkXNKIHSQJJxo2TTvjyuY6V7ImljN/hMu9qyxNhQzHfea8GBMrkuEA2xGkRU7dCUiSCUrlYLlYjg1jg6DC2DYUJYdmY5Q0GBHj5wJNxXpbsLm5zqFDh3julRXSSY4bBmSjMcNhRZ63QTmE4xThSDoDg+/HoGFmtkWWZqTjEd2kj3F8lJJcX1vHtm0uTyqklsy26txYvoI1teRhWxrbzpgNQzoTTTUcUWs0GQwGuEHEBBs8SV6VuK7AkprpxXmMKVhZvUHoR2hhs9FuM11rMRVltIcps7OzeHsbdCcZnhagBbZUaMtldraO0QJMRX+Q4DgOtThkd2cX18DapW2EkQT1mIYfMkxHZFlGM46wLAdZGexcManeYjY+gjW4eJlpx2Y+CijKMfPhPK4STMqc/TMxWZpitKAWzTHJU8oqQ5QWppgQ1z3cmw4h8hzplHiySSAllRzSasAoLXngnad45uUrSCtj0tlEG0nsB3RurFGWBWWZE4VNkn6H2cZJWlHMJBmyuDgPlaG1sER7ZwvfCUiTCdlwgoo0kZchexkTE3B0/51YgSmIlUKVOc2gREYuZaFJB30ix4ayy77Dd9Hr9jhx8jRL+5dYW7lK9/qb5EUfY9eYCxRJmWHVQ2ZkhrJn2O2M0F6DnWyDRjMkSRXhQkit1sDxXHRZ0eu0aUwtYguboDnF+uoyp+6+h+mZfeysXWHjxjL5cAfyEfOLB9lMV2nONxmnJbbIqTU8KG12t7aR8dwchSyIQw/hxsg0Ya7pc+LgEi4ZtWaLrLfL0ZsP8vDD7+f880/z+Ec+jtagcLGlS6U0eqKRxgZHMh4WNFoN5uIBna3D9EwToSd4VUIkUqrhDna2x0zNwxMa24bJ1hUWZ6c4ecdZfv6//83Zh56gzDLyQZfAViSdbeLQxybDFTmRBVbLA9tQoLGqoIWxbYRMCdw66XjC6tXzRNNNfD9ACEGR9lm+9CrbW9cI6j5lMaaoUgLPRecdHGeWYNqhm45xvSnqQcowTRkNUrqjn9NaPIAdVsTzR0iLjBRFOxkTuyUtP6Y/nDAaCyJGfOebXyN0XbK8Iik1yjioSuMAeZ7iuR6ZNqRFDSlsdNaGPEdWOiWyFaFjY3CIp2NaczVCJ8BgoWyFHVo4ro0uBY9/6g95+ttfZVR0cAIDBhp1TaPmU+UV9bikFtr0Ol06vQEHDt1Of3ePfCwQSRunGBGTUlMFShu6uz30eISrC0SWIdOE93309/nhN/6WWE/wTIZlIBmMMHnBZDDEKsYInTFOurS3t3GEQt17vPHFV99sU1MWylOUuqQqBdpYjNMJRkiKQnPy7gf5yO99gfmlQxw8epqiKLi+eh2DoTU9TW84wPVDZmemyMocx6/j+SGnbznFTmfCC68s03IlpVYkmWZra8BwUJDlkExKhknBrfe8h0ef+iNas0ss3vIOVq6vs725w14nQUuXXmfEJKvYafdAObi+YengYY7fegtWM4wZjDN2xoKy02Xf4hyVMRTFiEZzlrvvu5/3PPIE2sDe1gZvnX+dpcOH+dCTX+Dh33qKZ773bVYvX6A7+iXL19f71KNfvtlOdwNHdjnWcNBSsbtXUe0OKYXGcx1CN0ZbLr/ywAO897EPIqVid2uDS6+9wfzBg3zs83/GaDDg+ae/y9rKdcZhn16nTVFp9joVtajB5iCjMymwxp0hRSWxLQ8TuKxvDzh95zu5/+EPcPy22xkOevzXt/+d18+/xs6NZXSZU2/EzC4scfrMu3j3Ix+i9tuf4covzvPSc8+wevkiw/Uu7f4my9sdHlw9yvrGMsZUZE6A7/uUacZ9D/06x+64k6MnT9Jr73Lu+Z9w7oUXaG9tkhUZQlfcftcZDt5ylPsf/TB+GPDGy+d47aWX2FhdpdPpsN41XLh6mamFGcST9x4w3zy3xpljC5w5825+47EPMj07x9sry3z9K19mc2sNoSEZJFiORFmSqspBC6JajDGS47ef4olP/i4Li/vZ293hG1/+G1575Rw7yYSHb7+V0B/wDz9Z5/4z+zl1+j7e+8hjtKZnePv6NX789H9wffkK7b094shDGIHj+pRVSTIaY9uKwPO55fgpPvDhTzK3b4mtjXW+952vc/Hcz7h0rcOvPXgb6tH33f7FH//fKo8/8pt84jOfY293h7//67/iP//1n/EjDykMji2YX5rHthWeY9GoRcSNBp5rE0U23d1dnnv6u2xurHP3Pffy+MefRCjFCz99kfe/7xgLJ2/mB89d4oMPP87vPPV5Ntc2+dbffZVv/dPXcK0QXSpmG3VsBJblY0sPo11mp+epByGy0vS6Pc49+ywr11Y4e9/9PPL4R8lHAy5evMDZu+7CCsIG026N+ZlpLAWtZsyTn/0cSIOUivEwYXphHlMZ8jwHNLbtIZVCCKjyFNuLkBKKosBSAozhwOIcC0HMgTmXt9cmzDQcjh/fhyUrDhyY4xOf/TSf+uynUcoiyyY0GlMUeY6UEm0qLNtFCIGuKoo8I4hqGGOoqhLXFkgBtxy9mUhJFuaaWKsXVzm8z+P8z76P6K0xsWr4oUUIDLWNKAYopw7KEApNv1REnqTEJStSKHImwqXpC2wnpKoyWnWfl376LMlgwOvLuww3JhzeP8ObL/6Y4fYORkOt0cQA2hgG/QGW62OqEtfzSDJNHLhoXWF0hWVZFNg4SmBZCiUlvu9y7eUfkltDLiy/hhXUbDbaA1JpuHHt+7SrkNmWR5UkdEpFy9UkKbhRiFdO6FYWdatA2w18XyLTEQPjMNfw6XQS6rWAxWlFXrm0pmJ6/YKbDh3ma8/8CDkwyDfWsLyAyHNIiwqlFIKSqszR0iL2XKQjybKKqiiotMZ1XGxXURQaYUAbTRxHHJyNmGtMMWz3sY7MN3AKw0yzydKhKdyNMTNzNUQrJBpWTLUcylJQGUXoaBqJpl53sKwYKEh6gsC4zM1PsTA/w2TUZzjcY3bhZk6eOMW01Wc6NtwUKo7cFmLLiNJk+I5LVmRIqQABxgEqhBRICWUlsJRPWVa4jk1VGSqtf5m0kdhOhdeAs7ceI4ok1nrmEdQjpoKYoB7S6t2gqQT9wjAV2sS2g2uV9EcJoRXjRaAoCZwJvcGEZuhSZBPUuI9lKTrdPlvtPqPJDqN0wqGlKVa6NlagiMKIQTejORVSFiVaFyglEMbguA4IxXCYIKXEdVzGyRCjBI5js7m1i3J8pNBEoc/Vt66zOd3EzQYsLTaxfvTiZa7sdFgbjJhrxaTdPmEtYjROcR2b4SBhaqpFb5DQiMfs7G4TRDGWkKAkCkGv3ycIA3zPQ4qK/TP7eHPlKlprDDsos8mV9pjshRWGgwTLslBKghSURcEkzXGUhefZOGGIrAzjfILQBikUveFbOI5Llmv80KVKMx46eYLO1hbnt9vsjA3Wo+86RL+7y/peCjqj2bLRpDRigRAlketRypTplkLrIQsLMVIYqAq0MhgtWAhCMBXaTJiZmsNYPpO0ZPGAz01Ls9x/4jS5eY3n37xB7EegK0pdkGclldYoaeH7DsnQMN7dxXUs8rzEIBFCYIzE1yVlaRjnI6SUxNMzvHL1DY7ddDOOZxD/9gf3mF1T50v/8kPaY5vDUwFDnVPzPIpBgfZhMhGEVolUkGcGjUQrBzvP0AL8WkBSTNBVRnugqRWaQ4dDHnjobpKLr3L2zAm0d4qv/OM3uZEZ6o6H6w/wdIjOM2yvSZHusZkZFmOP4ajARHWivAQnZ9DW2FMxjbrNymqbum24vJdx6uwiT56aY319FfGXHztjalJyeXubzaRkcX6OzjBjszsiGY0gH9GcmcYXmhoQ2eC4ilrgEjQVngOj1OC35hi3O7QHQ7TZ4733HcGperx+vUmRWNQtuN4ruLG7xb59i4xyw/pOh35Rkg06tDwfuxnRSgRzdYuRmrAQ+lihotZQCMAA0lqi117F3ulz0701qmiK1Rtr/D8jNuvkHjCe6wAAAABJRU5ErkJggg==', 'Quick items search', TWX.QIS.popup);
        },
      };
      TWX.MarketBestBids = {
        init: function () {
          TWX.MBB = {
            items: {},
          };
          var setVal9 = setInterval(function () {
            if (ItemManager.get(0)) {
              clearInterval(setVal9);
              var allItems = ItemManager.getAll();
              for (var i in allItems) {
                var item = allItems[i];
                if (!item.auctionable)
                  continue;
                var name = item.name;
                if (item.type == 'recipe') {
                  var n = name.split(':');
                  if (n.length == 2)
                    name = n[1];
                }
                TWX.MBB.items[name] = item.price;
              }
            }
          }, 1000);
          MarketWindow.open_twx = MarketWindow.open_twx || MarketWindow.open;
          MarketWindow.open = function () {
            MarketWindow.open_twx.apply(this, arguments);
            var mwl = new MutationObserver(mts => {
              mts.every(e => {
                var el = $(e.target);
                if (el.hasClass('tw2gui_scrollpane_clipper_contentpane')) {
                  el.children().each((ix, row) => {
                    var child = row.children,
                    name = child[1],
                    nameT = name.firstChild.getAttribute('title'),
                    qty = child[2].textContent,
                    purchase = child[3],
                    bid = child[4];
                    if ($('#mpb_recipe.accordion_opened').length) {
                      var n = nameT.split(':');
                      if (n.length == 2)
                        nameT = n[1];
                    }
                    var price_o = TWX.MBB.items[nameT];
                    if (purchase.textContent) {
                      var p = purchase.textContent.replace(/\$|\.|\,/g, ''),
                      price_p = p / qty;
                      if (price_p < price_o) {
                        purchase.style.color = 'green';
                        if (!bid.textContent)
                          name.style.color = 'green';
                      }
                      if ((price_p > price_o) && (price_p <= price_o * 2)) {
                        purchase.style.color = 'blue';
                        if (!bid.textContent)
                          name.style.color = 'blue';
                      }
                      if (price_p > price_o * 2) {
                        purchase.style.color = 'red';
                        if (!bid.textContent)
                          name.style.color = 'red';
                      }
                    }
                    if (bid.textContent) {
                      var b = bid.textContent.replace(/\$|\.|\,/g, ''),
                      price_b = b / qty;
                      if (price_b < price_o) {
                        bid.style.color = 'green';
                        name.style.color = 'green';
                      }
                      if ((price_b > price_o) && (price_b <= price_o * 2)) {
                        bid.style.color = 'blue';
                        name.style.color = 'blue';
                      }
                      if (price_b > price_o * 2) {
                        name.style.color = 'red';
                        bid.style.color = 'red';
                      }
                    }
                  });
                  return;
                }
              });
            });
            mwl.observe(document.querySelector('.marketplace .tw2gui_window_content_pane'), {
              subtree: true,
              childList: true,
            });
          };
        },
      };
      TWX.BattleStars = {
        init: function () {
          TWX.BS = {
            stars: [],
            attaquants: {},
            defenseurs: {},
            withMod: function (calc, val) {
              return function (row) {
                var wdth = Math.round((74) / (calc.header.length));
                $.each(calc.header, function (ind) {
                  $('.battle_cls' + ind, row).css('width', wdth + '%');
                });
                row.attr('title', val.townname + ' - ' + val.weaponname + ' (' + val.weaponmindmg + '-' + val.weaponmaxdmg + ')');
                return row;
              };
            },
            modifStarsRow: function (val) {
              return function (row) {
                $('.stat_til', row).attr('title', TWX.BS.getFormule(val.type).help).css({
                  'width': '90px',
                  'text-align': 'left'
                });
                $('.battle_nam', row).attr('title', val.obj.townname + ' - ' + val.obj.weaponname + ' (' + val.obj.weaponmindmg + '-' + val.obj.weaponmaxdmg + ')');
                $('.stat_dtl', row).attr('title', cellules.stat_dtl).css({
                  'width': '346px',
                  'text-align': 'left'
                });
                return row;
              };
            },
            initFormule: function () {
              try {
                this.formules = [];
                this.formules.push(new calcul('heros', TWXlang.BS.hero, TWXlang.BS.heroT, '(((val.takenhits + val.dodgecount) * 1000) / (val.starthp))', [TWXlang.BS.rate, TWXlang.BS.hitsTaken, TWXlang.BS.dodgedShots, TWXlang.BS.startHP], ['heros', 'takenhits', 'dodgecount', 'starthp'], 'val.starthp > 0', '0', '>', 0, false, false, true));
                /*this.formules.push(new calcul('roger', 'Roger Rabbit', 'val.takenhits + val.dodgecount', ['Tirs', 'Tirs reçus', 'Tir évité'], ['roger', 'takenhits', 'dodgecount'], ' val.takenhits + val.dodgecount > 0', '0', '>', 0, false, false, true));*/
                this.formules.push(new calcul('survivant', TWXlang.BS.survivor, TWXlang.BS.survivorT, 'val.finishedhp', [TWXlang.BS.endHP], ['finishedhp'], 'val.finishedhp > 0', '0', '<', 1, true, false, false));
                this.formules.push(new calcul('sniper', TWXlang.BS.sniper, TWXlang.BS.sniperT, '(val.hitcount / (val.hitcount + val.misscount))*100', [TWXlang.BS.rateP, TWXlang.BS.hitCount, TWXlang.BS.missedShots], ['sniper', 'hitcount', 'misscount'], '(val.hitcount + val.misscount) > 0', '0', '>', 0, false, false, true));
                this.formules.push(new calcul('matrix', TWXlang.BS.matrix, TWXlang.BS.matrixT, 'parseFloat((( val.dodgecount / (val.takenhits + val.dodgecount))*100))', [TWXlang.BS.rateP, TWXlang.BS.dodgedShots, TWXlang.BS.hitsTaken], ['matrix', 'dodgecount', 'takenhits'], '(val.takenhits + val.dodgecount) > 0 && val.dodgecount > 0', '0', '>', 0, false, false, true));
                this.formules.push(new calcul('headshot', TWXlang.BS.terminator, TWXlang.BS.terminatorT, '(val.ko_shots.length / val.hitcount)*100', [TWXlang.BS.rateP, TWXlang.BS.KOs, TWXlang.BS.hitCount], ['headshot', 'ko_shots.length', 'hitcount'], 'val.hitcount > 0', '0', '>', 0, false, false, true));
              } catch (e) {
                console.log(e);
              }
            },
            getFormule: function (type) {
              for (var s = 0; s < this.formules.length; s++) {
                calc = this.formules[s];
                if (type == calc.type)
                  return calc;
              }
              throw ('No formula for ' + type);
            },
            getAll: function (type) {
              $('#route', CemeteryWindow.DOM).text('details');
              var calc = this.getFormule(type);
              $('.info', CemeteryWindow.DOM).text('');
              $('.info', CemeteryWindow.DOM).append('<span>' + TWXlang.BS.ranking + ' ' + calc.libelle + '</span><span style="font-size:12px;"><br><i>' + calc.help + '</i></span>');
              this.stars = calc.sortArray(CemeteryWindow.currentStats);
              calc.getHeader();
              var shunt = 0;
              $.each(this.stars, function (ind, stat) {
                if (calc.shouldBePos && stat[type] <= 0)
                  shunt++;
                stat.ind = (ind + 1) - shunt;
                calc.getLigne(stat);
              });
            },
            getStatByPerso: function (name) {
              for (var s = 0; s < this.stars.length; s++) {
                val = this.stars[s];
                if (name == val.name)
                  return val;
              }
            },
            getLigne: function (stat, index) {
              if (!isDefined(stat))
                return '';
              var type = stat.type,
              nom = stat.name,
              val = stat.obj,
              calc = this.getFormule(type),
              css = 'tw_blue';
              if (val.battle_type == 'attacker')
                css = 'tw_red';
              cellules = {};
              cellules.stat_til = '<span onclick="javascript:TWX.BS.getAll(\'' + type + '\')" style="cursor:pointer;">' + calc.libelle + '</span>';
              cellules.battle_nam = nom;
              cellules.stat_dtl = calc.getShortLigne(val);
              this.table.buildRow('battlestat ' + css, cellules, this.modifStarsRow(stat));
            },
            openWindow: function () {
              var statWindow = wman.open('window_Stats', TWXlang.BS.statsTitle).setSize(700, 400);
              $('.window_Stats').css('left', '10px').css('top', '25px');
              var table_window = new west.gui.Table();
              table_window.appendTo($('<div class="window_inside"></div>').appendTo(statWindow.getContentPane())).addColumns(['cell_stat',
                  'cell_att',
                  'cell_def',
                  'cell_dif']).appendToCell('head', 'cell_stat', TWXlang.BS.designation).appendToCell('head', 'cell_att', TWXlang.BS.attack).appendToCell('head', 'cell_def', TWXlang.BS.defense).appendToCell('head', 'cell_dif', TWXlang.BS.difference).appendRow();
              var verif = '<form><textarea style=\'height:250px;width:650px;\'>[code]' + TWXlang.BS.statistics + '\t\t\t' + TWXlang.BS.attack + '\t\t' + TWXlang.BS.defense + '\t\t' + TWXlang.BS.difference + '\n--------------------------------------------------------------------------\n';
              $.each(this.results, function (ind, val) {
                try {
                  var cssStr = '',
                  dif = 0,
                  att = parseFloat(val.attack),
                  def = parseFloat(val.defend);
                  if (att > val.defend) {
                    cssStr = '#8A0000';
                    dif = (att - def).toFixed(2);
                  } else {
                    cssStr = '#00008A';
                    dif = (def - att).toFixed(2);
                  }
                  verif += val.titre + att + '\t\t' + def + '\t\t' + dif + '\n';
                  table_window.appendToCell( - 1, 'cell_stat', val.titre.trim()).appendToCell( - 1, 'cell_att', '<div>' + att + '</div>').appendToCell( - 1, 'cell_def', '<div>' + def + '</div>').appendToCell( - 1, 'cell_dif', '<div style="color:' + cssStr + ';">' + dif + '</div>').appendRow();
                } catch (e) {
                  console.log(val, e);
                }
              });
              verif += '[/code]</textarea></form>';
              var affButton = new west.gui.Button(TWXlang.BS.code, function () {
                var cur = $('.window_inside').html();
                if (cur.indexOf('[code]') > -1)
                  TWX.BS.openWindow();
                else {
                  $('.window_inside').html(verif);
                  affButton.setCaption(TWXlang.BS.goBack);
                }
              });
              $('<div class="window_footer"></div>').appendTo(statWindow.getContentPane()).append(affButton.getMainDiv());
            },
            createStarsTable: function () {
              $('.info', CemeteryWindow.DOM).text(TWXlang.BS.starsTitle);
              this.table = new west.gui.Table(false).setId('battle_stat').createEmptyMessage('BattleStars').addColumn('stat_til').addColumn('battle_nam').addColumn('stat_dtl').appendToThCell('head', 'stat_til', TWXlang.BS.title, TWXlang.BS.title).appendToThCell('head', 'battle_nam', TWXlang.BS.name, TWXlang.BS.name).appendToThCell('head', 'stat_dtl', TWXlang.BS.details, TWXlang.BS.details);
              this.table.getCell('head', 'stat_til').css({
                'width': '90px',
                'text-align': 'left'
              });
              this.table.getCell('head', 'stat_dtl').css({
                'width': '346px',
                'text-align': 'left'
              });
              $('#route', CemeteryWindow.DOM).remove();
              $('.cemetery-content', CemeteryWindow.DOM).append('<div id="route" style="display:none">global</div>').append(this.table.getMainDiv());
              $('.footer', CemeteryWindow.DOM).empty();
              var bo = this.original;
              var titleAtt = TWXlang.BS.attack + TWXlang.BS.start +
                bo.startAttPV +
                TWXlang.BS.end +
                bo.finishedAttPV +
                TWXlang.BS.damageTaken +
                (bo.startAttPV - bo.finishedAttPV) + TWXlang.BS.avgHP + bo.moyatt.toFixed(2);
              var titleDef = TWXlang.BS.defense + TWXlang.BS.start +
                bo.startDefPV +
                TWXlang.BS.end +
                bo.finishedDefPV +
                TWXlang.BS.damageTaken +
                (bo.startDefPV - bo.finishedDefPV) + TWXlang.BS.avgHP + bo.moydef.toFixed(2);
              $('.footer', CemeteryWindow.DOM).append('<span title="' + titleAtt + '" class="tw_red text_bold">' + titleAtt + '</span>');
              $('.footer', CemeteryWindow.DOM).append('<br><span title="' + titleDef + '" class="tw_blue text_bold">' + titleDef + '</span>');
              $('.footer', CemeteryWindow.DOM).addClass('zone');
              $('.cemetery-content', CemeteryWindow.DOM).addClass('zone');
            },
            calculStars: function () {
              this.results = [];
              this.attaquants = {};
              this.defenseurs = {};
              var attaquer = {},
              defenseurs = {},
              bo = this.original = {
                countAtt: 0,
                countDef: 0,
                startDefPV: 0,
                finishedDefPV: 0,
                startAttPV: 0,
                finishedAttPV: 0,
                degAtt: 0,
                degDef: 0,
                moyatt: 0,
                moydef: 0,
                att: {
                  dodgecount: 0,
                  hitcount: 0,
                  maxdamage: 0,
                  avg_damage: 0,
                  misscount: 0,
                  takenhits: 0,
                  weaponmaxdmg: 0,
                  weaponmindmg: 0,
                },
                def: {
                  dodgecount: 0,
                  hitcount: 0,
                  maxdamage: 0,
                  avg_damage: 0,
                  misscount: 0,
                  takenhits: 0,
                  weaponmaxdmg: 0,
                  weaponmindmg: 0,
                },
              };
              $.each(CemeteryWindow.currentStats, function (ind, val) {
                if (val.battle_type == 'attacker') {
                  bo.startAttPV += val.starthp;
                  bo.finishedAttPV += val.finishedhp;
                  bo.degAtt += val.totalcauseddamage;
                  bo.att.dodgecount += val.dodgecount;
                  bo.att.hitcount += val.hitcount;
                  bo.att.avg_damage += val.avg_damage;
                  bo.att.maxdamage += val.maxdamage;
                  bo.att.misscount += val.misscount;
                  bo.att.takenhits += val.takenhits;
                  bo.att.weaponmaxdmg += val.weaponmaxdmg;
                  bo.att.weaponmindmg += val.weaponmindmg;
                  bo.countAtt++;
                } else {
                  bo.startDefPV += val.starthp;
                  bo.finishedDefPV += val.finishedhp;
                  bo.degDef += val.totalcauseddamage;
                  bo.countDef++;
                  bo.def.dodgecount += val.dodgecount;
                  bo.def.hitcount += val.hitcount;
                  bo.def.avg_damage += val.avg_damage;
                  bo.def.maxdamage += val.maxdamage;
                  bo.def.misscount += val.misscount;
                  bo.def.takenhits += val.takenhits;
                  bo.def.weaponmaxdmg += val.weaponmaxdmg;
                  bo.def.weaponmindmg += val.weaponmindmg;
                }
                $.each(TWX.BS.formules, function (indStac, calc) {
                  val[calc.type] = calc.getTaux(val);
                  if (!calc.shouldBePos || (calc.shouldBePos && val[calc.type] > 0)) {
                    if (val.battle_type == 'attacker') {
                      if (!isDefined(attaquer[calc.type]))
                        attaquer[calc.type] = calc.limite;
                      if (eval(val[calc.type] + calc.compare + attaquer[calc.type])) {
                        attaquer[calc.type] = val[calc.type];
                        TWX.BS.attaquants[calc.type] = {
                          'type': calc.type,
                          'name': val.name,
                          'obj': val
                        };
                      }
                    } else {
                      if (!isDefined(defenseurs[calc.type]))
                        defenseurs[calc.type] = calc.limite;
                      if (eval(val[calc.type] + calc.compare + defenseurs[calc.type])) {
                        defenseurs[calc.type] = val[calc.type];
                        TWX.BS.defenseurs[calc.type] = {
                          'type': calc.type,
                          'name': val.name,
                          'obj': val
                        };
                      }
                    }
                  }
                });
              });
              bo.moyatt = bo.startAttPV / bo.countAtt;
              bo.moydef = bo.startDefPV / bo.countDef;
              bo.degAtt = bo.degAtt / bo.countAtt;
              bo.degDef = bo.degDef / bo.countDef;
              this.results.push({
                titre: TWXlang.BS.total + TWXlang.BS.startHP + '\t\t\t',
                attack: bo.startAttPV,
                defend: bo.startDefPV
              });
              this.results.push({
                titre: TWXlang.BS.total + TWXlang.BS.endHP + '\t\t\t',
                attack: bo.finishedAttPV,
                defend: bo.finishedDefPV
              });
              this.results.push({
                titre: TWXlang.BS.HP + ' ' + TWXlang.BS.difference + '\t\t\t',
                attack: (bo.startAttPV - bo.finishedAttPV),
                defend: (bo.startDefPV - bo.finishedDefPV)
              });
              this.results.push({
                titre: TWXlang.BS.average + TWXlang.BS.HP + '\t\t\t',
                attack: bo.moyatt.toFixed(2),
                defend: bo.moydef.toFixed(2)
              });
              this.results.push({
                titre: TWXlang.BS.average + TWXlang.BS.damage + '\t\t\t',
                attack: bo.degAtt.toFixed(2),
                defend: bo.degDef.toFixed(2)
              });
              this.results.push({
                titre: TWXlang.BS.average + TWXlang.BS.dodgedShots + '\t\t\t',
                attack: (bo.att.dodgecount / bo.countAtt).toFixed(2),
                defend: (bo.def.dodgecount / bo.countDef).toFixed(2)
              });
              this.results.push({
                titre: TWXlang.BS.average + TWXlang.BS.hitCount + '\t\t\t',
                attack: (bo.att.hitcount / bo.countAtt).toFixed(2),
                defend: (bo.def.hitcount / bo.countDef).toFixed(2)
              });
              this.results.push({
                titre: TWXlang.BS.average + TWXlang.BS.missedShots + '\t\t\t',
                attack: (bo.att.misscount / bo.countAtt).toFixed(2),
                defend: (bo.def.misscount / bo.countDef).toFixed(2)
              });
              this.results.push({
                titre: TWXlang.BS.average + TWXlang.BS.hitsTaken + '\t\t\t',
                attack: (bo.att.takenhits / bo.countAtt).toFixed(2),
                defend: (bo.def.takenhits / bo.countDef).toFixed(2)
              });
              this.results.push({
                titre: TWXlang.BS.avgDamage + '\t\t\t',
                attack: (bo.att.avg_damage / bo.countAtt).toFixed(2),
                defend: (bo.def.avg_damage / bo.countDef).toFixed(2)
              });
              this.results.push({
                titre: TWXlang.BS.avgDamageMax + '\t\t\t',
                attack: (bo.att.maxdamage / bo.countAtt).toFixed(2),
                defend: (bo.def.maxdamage / bo.countDef).toFixed(2)
              });
              this.results.push({
                titre: TWXlang.BS.avgWeaponDamage + '\t\t\t',
                attack: ((bo.att.weaponmaxdmg + bo.att.weaponmindmg) / 2 / bo.countAtt).toFixed(2),
                defend: ((bo.def.weaponmaxdmg + bo.def.weaponmindmg) / 2 / bo.countDef).toFixed(2)
              });
              this.results.push({
                titre: TWXlang.BS.avgWeaponDamageMax + '\t\t\t',
                attack: (bo.att.weaponmaxdmg / bo.countAtt).toFixed(2),
                defend: (bo.def.weaponmaxdmg / bo.countDef).toFixed(2)
              });
            },
            inject: function () {
              this.initFormule();
              CemeteryWindow.showStatInitData_twx = CemeteryWindow.showStatInitData;
              CemeteryWindow.showStatInitData = function () {
                CemeteryWindow.showStatInitData_twx.apply(this, arguments);
                $('#BSButton').remove();
                $(this.window.getMainDiv()).find('div.tw2gui_window_content_pane').append('<span title="Battle Stars" onclick="TWX.BS.vasy()" id="BSButton"><img style="position:absolute;top:15px;right:11px;cursor:pointer;" src="images/icons/achv_points.png">');
              };
            },
            vasy: function () {
              var route = $('#route', CemeteryWindow.DOM);
              if (route.length === 0 || (route.text() != 'global')) {
                if (route.length === 0) {
                  this.original = {
                    saveTitle: $('.info', CemeteryWindow.DOM).text(),
                    saveFoot: $('.footer', CemeteryWindow.DOM).html(),
                  };
                  $('#battle_stat', CemeteryWindow.DOM).attr('id', 'battle_statOri');
                  $('#battle_statOri', CemeteryWindow.DOM).css('display', 'none');
                  this.calculStars();
                  this.openWindow();
                } else {
                  if (route.text() == 'original') {
                    $('#battle_stat', CemeteryWindow.DOM).attr('id', 'battle_statOri');
                    $('#battle_statOri', CemeteryWindow.DOM).css('display', 'none');
                    this.openWindow();
                  } else {
                    $('#battle_stat', CemeteryWindow.DOM).attr('id', 'battle_statDetail');
                    $('#battle_statDetail', CemeteryWindow.DOM).remove();
                  }
                }
                this.createStarsTable();
                $.each(this.defenseurs, function (ind, star) {
                  TWX.BS.getLigne(star, ind);
                });
                $.each(this.attaquants, function (ind, star) {
                  TWX.BS.getLigne(star, ind);
                });
              } else {
                route.text('original');
                $('.info', CemeteryWindow.DOM).text(this.original.saveTitle);
                $('.footer', CemeteryWindow.DOM).html(this.original.saveFoot);
                $('#battle_stat', CemeteryWindow.DOM).attr('id', 'battle_statStats');
                $('#battle_statStats', CemeteryWindow.DOM).remove();
                $('#battle_statOri', CemeteryWindow.DOM).attr('id', 'battle_stat');
                $('#battle_stat', CemeteryWindow.DOM).css('display', 'block');
              }
            },
          };
          function calcul(pType, pLibelle, pTexte, pForm, pHead, pVariables, pConstr, pTError, pCompare, pSort, pPos, pNull, pFloat) {
            this.globalHeader = ['#', TWXlang.BS.name];
            this.help = pTexte;
            this.type = pType;
            this.formule = pForm;
            this.header = pHead;
            this.libelle = pLibelle;
            this.variables = pVariables;
            this.sort = pSort;
            this.compare = pCompare;
            this.shouldBePos = pPos;
            this.shouldBeNull = pNull;
            this.contrainte = pConstr;
            this.isFloating = pFloat;
            this.testError = pTError;
            if (this.compare == '>')
              this.limite = '0';
            else
              this.limite = '9999999999';
          }
          calcul.prototype.init = function () {
            this.type = '';
            this.help = '';
            this.formule = '';
            this.header = '';
            this.libelle = '';
            this.variables = {};
            this.sort = 1;
            this.shouldBePos = false;
            this.shouldBeNull = true;
            this.contrainte = '';
          };
          calcul.prototype.getLigne = function (val) {
            var cellules = {};
            var css = 'tw_blue';
            if (val.battle_type == 'attacker')
              css = 'tw_red';
            if ((!this.shouldBePos) || (this.shouldBePos && val[this.type] > 0)) {
              cellules.battle_num = val.ind;
              cellules.battle_nam = val.name;
              $.each(this.variables, function (ind, td) {
                var det;
                if (td.indexOf('.') > 0) {
                  arTd = td.split('.');
                  var cible = val;
                  $.each(arTd, function (ind, value) {
                    cible = cible[value];
                  });
                  det = cible;
                } else
                  det = val[td];
                cellules['battle_cls' + ind] = det;
              });
              TWX.BS.tableClassement.buildRow('battlestat ' + css, cellules, TWX.BS.withMod(this, val));
            }
          };
          calcul.prototype.getShortLigne = function (val) {
            try {
              var header = this.header,
              lig = '';
              $.each(this.variables, function (ind, td) {
                var det;
                if (td.indexOf('.') > 0) {
                  arTd = td.split('.');
                  var cible = val;
                  $.each(arTd, function (ind, value) {
                    cible = cible[value];
                  });
                  det = cible; //val[arTd[0]][arTd[1]]
                } else {
                  det = val[td];
                }
                lig += header[ind] + ': ' + det + '|';
              });
              return lig;
            } catch (execption) {
              console.log(execption);
              return '';
            }
          };
          calcul.prototype.getHeader = function () {
            var header = this.globalHeader.concat(this.header),
            wdth = Math.round(74 / this.header.length);
            $('#battle_stat', CemeteryWindow.DOM).attr('id', 'battle_statStar');
            $('#battle_statStar', CemeteryWindow.DOM).remove();
            $('#battle_stat', CemeteryWindow.DOM).text('details');
            TWX.BS.tableClassement = new west.gui.Table(false).setId('battle_stat').createEmptyMessage('Battle Stars').addColumn('battle_num').addColumn('battle_nam').appendToThCell('head', 'battle_num', header[0], header[0]).appendToThCell('head', 'battle_nam', header[1], header[1]);
            $.each(this.header, function (ind, th) {
              TWX.BS.tableClassement.addColumn('battle_cls' + ind).appendToThCell('head', 'battle_cls' + ind, th, th);
              TWX.BS.tableClassement.getCell('head', 'battle_cls' + ind).css('width', wdth + '%');
            });
            $('div.cemetery-content', CemeteryWindow.DOM).append(TWX.BS.tableClassement.getMainDiv());
          };
          calcul.prototype.sortArray = function (arr) {
            var type = this.type;
            var sortable = this.sort;
            arr.sort(function (a, b) {
              var x = a[type];
              var y = b[type];
              if (sortable)
                return x - y;
              return y - x;
            });
            return arr;
          };
          calcul.prototype.getTaux = function (val) {
            if (eval(this.contrainte))
              taux = eval(this.formule);
            else
              taux = eval(this.testError);
            if (this.isFloating)
              taux = parseFloat(taux.toFixed(2));
            return taux; //.toFixed(2);
          };
          TWX.addStyle('.window_Stats .window_inside { width:630px;height:380 position:absolute;left:5px;top:2px;-webkit-user-select:text!important;-khtml-user-select:text!important;-moz-user-select:text!important; -ms-user-select:text!important;user-select:text!important;height:270px; }' +
            '.window_Stats .window_footer { text-align:right;} ' +
            '.window_Stats .cell_stat { width:200px;font-weight:800;text-shadow:1px 0 0 white; } ' +
            '.window_Stats .cell_att, .window_Stats .cell_def, .window_Stats .cell_dif { width:120px;text-align:center; } ' +
            '.window_Stats .tbody .cell_stat { padding-left:6px;text-align:left;width:200px;font-weight:800;text-shadow:1px 0 0 white; } .window_Stats .tbody .row { left:0px; }' +
            '.window_Stats .tbody .cell_att { text-align:center;color:#8A0000;width:120px;font-weight:800;text-shadow:1px 0 0 white; }' +
            '.window_Stats .tbody .cell_def { text-align:center;color:#00008A;width:120px;font-weight:800;text-shadow:1px 0 0 white; }' +
            '.window_Stats .tbody .cell_dif { text-align:center;width:120px;font-weight:800;text-shadow:1px 0 0 white; }' +
            '.zone {-webkit-user-select:text!important;-khtml-user-select:text!important;-moz-user-select:text!important;-ms-user-select:text!important;user-select:text!important;height:270px; }');
          setTimeout(TWX.BS.inject.bind(TWX.BS), 5e3);
        },
      };
      TWX.Collections = {
        init: function () {
          TWX.Col = {};
        },
      };
      TWX.KickoMatic = {
        init: function () {
          TWX.KoM = {
            loading: false,
            inProgress: {},
            fortsCapacity: null,
            weapons: [],
            //coords[0-6]:attack,coords[7-19]:defense[small,medium,big]
            coords: [[0, 1, 2, 34, 35, 36, 68, 69, 70, 102, 103, 104, 136, 137, 138, 170, 171, 172, 204, 205, 206, 238, 239, 240, 272, 273, 274, 306, 307, 308, 340, 341, 342], [374, 375, 376, 408, 409, 410, 442, 443, 444, 476, 477, 478, 510, 511, 512, 544, 545, 546, 578, 579, 580, 612, 613, 614, 646, 647, 648, 680, 681, 682], [714, 715, 716, 717, 718, 719, 720, 721, 722, 723, 724, 748, 749, 750, 751, 752, 753, 754, 755, 756, 757, 758, 782, 783, 784, 785, 786, 787, 788, 789, 790, 791, 792], [725, 726, 727, 728, 729, 730, 731, 732, 733, 734, 735, 759, 760, 761, 762, 763, 764, 765, 766, 767, 768, 769, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803], [736, 737, 738, 739, 740, 741, 742, 743, 744, 745, 746, 747, 770, 771, 772, 773, 774, 775, 776, 777, 778, 779, 780, 781, 804, 805, 806, 807, 808, 809, 810, 811, 812, 813, 814, 815], [405, 406, 407, 439, 440, 441, 473, 474, 475, 507, 508, 509, 541, 542, 543, 575, 576, 577, 609, 610, 611, 643, 644, 645, 677, 678, 679, 711, 712, 713], [31, 32, 33, 65, 66, 67, 99, 100, 101, 133, 134, 135, 167, 168, 169, 201, 202, 203, 235, 236, 237, 269, 270, 271, 303, 304, 305, 337, 338, 339, 371, 372, 373], [[178, 179, 180, 212, 213, 214, 246, 247, 248], [143, 144, 145, 177, 178, 179, 211, 212, 213], [108, 109, 110, 142, 143, 144, 176, 177, 178]], [[193, 194, 195, 227, 228, 229, 261, 262, 263], [160, 161, 162, 194, 195, 196, 228, 229, 230], [127, 128, 129, 161, 162, 163, 195, 196, 197]], [[450, 451, 452, 484, 485, 486, 518, 519, 520], [483, 484, 485, 517, 518, 519, 551, 552, 553], [516, 517, 518, 550, 551, 552, 584, 585, 586]], [[465, 466, 467, 499, 500, 501, 533, 534, 535], [500, 501, 502, 534, 535, 536, 568, 569, 570], [535, 536, 537, 569, 570, 571, 603, 604, 605]], [[291, 292, 293, 325, 326, 327], [326, 327, 328, 360, 361, 362], [395, 396, 429, 430, 463, 464]], [[318, 319, 352, 353, 386, 387], [250, 251, 284, 285, 318, 319], [258, 259, 292, 293, 326, 327]], [[393, 394, 395, 427, 428, 429], [385, 386, 387, 419, 420, 421], [384, 385, 386, 418, 419, 420]], [[215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226], [180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193], [145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160]], [[487, 488, 489, 490, 491, 494, 495, 496, 497, 498], [520, 521, 522, 523, 524, 525, 528, 529, 530, 531, 532, 533], [553, 554, 555, 556, 557, 558, 559, 562, 563, 564, 565, 566, 567, 568]], [[281, 315, 349, 383, 417], [246, 280, 314, 348, 382, 416, 450], [211, 245, 279, 313, 347, 381, 415, 449, 483]], [[296, 330, 364, 398, 432], [263, 297, 331, 365, 399, 433, 467], [230, 264, 298, 332, 366, 400, 434, 468, 502]], [[492, 493], [526, 527], [560, 561]], [[287, 288, 289, 290, 321, 322, 323, 324, 355, 356, 357, 358, 389, 390, 391, 392], [287, 288, 289, 290, 321, 322, 323, 324, 355, 356, 357, 358, 389, 390, 391, 392], [287, 288, 289, 290, 321, 322, 323, 324, 355, 356, 357, 358, 389, 390, 391, 392]]],
            highlightedFortCells: {},
            currFortId: null,
            currPlayerPos: null,
            fort: {},
            fortSizeLoading: {},
            playersPosition: {},
            playerRank: {},
            playersData: {},
            allies: {},
            playersDataLoading: {},
            highlightFortCell: function () {
              var battle = $('#fort_battle_' + this.currFortId + '_battleground');
              if (this.currPlayerPos == -1 || !battle.length)
                return;
              var pos = $('.cell-' + this.currPlayerPos).position();
              $('.battleground_marker', battle).css(pos);
              TWX.KoM.highlightedFortCells[this.currFortId] = 1;
            },
            unhighlightFortCell: function (fortId) {
              $('.battleground_marker', $('#fort_battle_' + fortId + '_battleground')).css({
                top: '',
                left: ''
              });
              delete TWX.KoM.highlightedFortCells[fortId];
            },
            hidePopup: function () {
              TWX.KoM.mb.hide();
              for (var fortId in TWX.KoM.highlightedFortCells) {
                TWX.KoM.unhighlightFortCell(fortId);
              }
            },
            showPosition: function () {
              FortBattleWindow.open(this.currFortId);
              var setVal6 = setInterval(function () {
                if ($('#fort_battle_' + TWX.KoM.currFortId + '_battleground').length) {
                  clearInterval(setVal6);
                  TWX.KoM.highlightFortCell();
                }
              }, 100);
            },
            getAlliance: function (player_Id) {
              if (TWX.KoM.allies[player_Id])
                return;
              Ajax.remoteCallMode('profile', 'init', {
                playerId: player_Id
              }, function (resp) {
                if (resp.town && resp.town.alliance_id)
                  TWX.KoM.allies[resp.playerid] = [
                    resp.town.alliance_id,
                    resp.town.alliance_name
                  ];
                else
                  TWX.KoM.allies[resp.playerid] = [
                    null,
                    TWXlang.KoM.noally
                  ];
              });
            },
            pushChatSystemMessage: function (str) {
              Chat.pushSystemMessage(str);
            },
            updatePrivilege: function (fortId, westId, rank) {
              var list = {};
              list[westId] = rank;
              var data = {
                fort_id: fortId,
                privileges: list
              };
              Ajax.remoteCall('fort_battlepage', 'updatePrivileges', data, function (response) {
                if (response.hasOwnProperty('playerlist') && response.playerlist.length > 0) {
                  new UserMessage(TWXlang.KoM.success, {
                    type: 'success'
                  }).show();
                }
                TWX.KoM.setPlayerRank(fortId, westId, rank);
                TWX.KoM.hidePopup();
              });
            },
            makeRankRow: function (rank, westId, fortId) {
              var rankList = {
                '-2': 'traitor',
                '-1': 'reservist',
                '0': 'recruit',
                '1': 'private',
                '2': 'sergeant',
                '3': 'captain',
                '4': 'general'
              };
              function rankLink(image, fortId, westId, rank) {
                return $('<a>').attr('onclick', 'TWX.KoM.updatePrivilege(' + fortId + ', ' + westId + ', ' + rank + ');').append(image, TWXlang.KoM['as' + rankList[rank]]);
              }
              function rankImage(rrank) {
                return $('<img>').attr('src', 'images/chat/servicegrade_' + rrank + '.png').attr('title', '<strong>' + Chat.rankTitles[rrank] + '</strong>');
              }
              return rankLink(rankImage(rankList[rank]), fortId, westId, rank);
            },
            makeRankUpdateHtml: function (myRank, playerRank, westId, fortId) {
              var span = $('<span>');
              var div = $('<div>');
              function appendError(text) {
                var d = $('<div>').css({
                  //'width': '200px',
                  'padding': '4px',
                  'text-align': 'center'
                }).html(text);
                span.append(d);
              }
              if (myRank > 2)
                if (playerRank < myRank) {
                  var fromRank = myRank == 4 ? 3 : 2;
                  for (var rank = fromRank; rank >= -2; rank--) {
                    if (rank == playerRank)
                      continue;
                    var row = TWX.KoM.makeRankRow(rank, westId, fortId);
                    div.append(row, $('<br>'));
                  }
                } else
                  appendError('<br>' + TWXlang.KoM.youcant);
              span.append(div);
              return span;
            },
            getPlayerFortPosition: function (fortId, westId) {
              return TWX.KoM.playersPosition.hasOwnProperty(fortId) && TWX.KoM.playersPosition[fortId].hasOwnProperty(westId) ? TWX.KoM.playersPosition[fortId][westId] : -1;
            },
            getPlayerClass: function (playerClass) {
              return playerClass + '.png" title="' + Game.InfoHandler.getLocalString4Charclass(playerClass);
            },
            setPlayerFortPosition: function (fortId, westId, pos) {
              if (!TWX.KoM.playersPosition.hasOwnProperty(fortId))
                TWX.KoM.playersPosition[fortId] = {};
              TWX.KoM.playersPosition[fortId][westId] = pos;
            },
            makeSmallTitle: function (playerName, westId, playerX, playerY) {
              var span = $('<span>').attr('onclick', 'PlayerProfileWindow.open(' + westId + ')').html(playerName).css('cursor', 'pointer');
              var st = $('<a>').attr('onclick', 'Map.center(' + playerX + ', ' + playerY + ')').attr('title', TWXlang.KoM.showPlayerOnMap).css({
                width: '15px',
                height: '15px',
                display: 'inline-block',
                background: 'url(images/tw2gui/window/window2_title_divider.jpg) no-repeat'
              });
              span.append('&nbsp;', st);
              return span;
            },
            getPlayerRank: function (fortId, westId) {
              if (TWX.KoM.playerRank[fortId] && TWX.KoM.playerRank[fortId].hasOwnProperty(westId))
                return TWX.KoM.playerRank[fortId][westId];
              return null;
            },
            getFortRanks: function (fortId) {
              return TWX.KoM.playerRank.hasOwnProperty(fortId) ? TWX.KoM.playerRank[fortId] : null;
            },
            setPlayerRank: function (fortId, westId, rank) {
              if (!TWX.KoM.playerRank.hasOwnProperty(fortId))
                TWX.KoM.playerRank[fortId] = {};
              TWX.KoM.playerRank[fortId][westId] = rank;
            },
            smallPopUp: function (e) {
              try {
                if (TWX.KoM.loading)
                  return;
                TWX.KoM.loading = true;
                var x = e.clientX || 500,
                y = e.clientY || 500,
                westId = TWX.KoM.westId,
                rooms = Chat.Resource.Manager.getRooms();
                for (var r in rooms) {
                  var room = Chat.Resource.Manager.getRoom(r);
                  if (!(room instanceof Chat.Resource.RoomFortBattle) || room.id != TWX.KoM.fortRoom)
                    continue;
                  var fortId = room.fortId;
                  if (TWX.KoM.started(fortId /*, true, westId*/))
                    continue;
                  var playerRank = TWX.KoM.getPlayerRank(fortId, westId),
                  myId = Chat.MyId.match(/[0-9]+/),
                  myRank = TWX.KoM.getPlayerRank(fortId, myId),
                  playerInfo = TWX.KoM.playersData[westId],
                  playerName = playerInfo.name,
                  playerXY = playerInfo.coords,
                  title = TWX.KoM.makeSmallTitle(playerName, westId, playerXY.x, playerXY.y);
                  TWX.KoM.mb = new west.gui.Dialog(title.outerHTML()).addButton('cancel').setId('KickoMaticPopUp').setModal(true, true).setText(TWX.KoM.makeRankUpdateHtml(myRank, playerRank, westId, fortId)).setX(x).setY(y - 50).show();
                  break;
                }
                TWX.KoM.loading = false;
              } catch (err) {
                TWX.KoM.loading = false;
                new UserMessage('<span>' + err + '</spawn>', 'error').show();
                console.log(err);
              }
            },
            makePopupHtml: function (fortId, distanceImage, playerPositionName, rankHtml, weaponName, weaponMinDamage, weaponMaxDamage, currentHp, maxHp, townName, townId, playerClass) {
              var capacityDiv = TWX.KoM.makeCapacityDiv(fortId);
              var fillPx = Math.floor(currentHp / maxHp * 194);
              return '<div class="txcenter"><div style="background:url(' + TWX.url + 'healthbar.png) right top;width:210px;height:14px;display:inline-block;padding:2px;margin:0;font-size:8pt; text-align:left;"><div style="background: url(&quot;images/character_bars/filler.png&quot;) repeat scroll 0% 0% transparent; width:' +
              fillPx + 'px; height: 14px; padding: 0pt; margin: 0pt; position: absolute;" id="recruit_healthbar"></div><div id="recruit_health" style="position:absolute;color:white;width:194px;text-align:center">' + currentHp + '/' + maxHp + '</div></div><br><div>' +
              weaponName + ' (' + weaponMinDamage + '-' + weaponMaxDamage + ' ' + TWXlang.KoM.damage + ')</div><span style="font-size:16px;text-align:center;"><div style="display:inline-block;"><img src="images/class_choose/class_' + playerClass +
              '"><a style="display:inline;padding:0;" class="profile_link_town_overview" title="' + TWXlang.KoM.showTown + '" href="javascript:TownWindow.open(' + townId + ')"> ' + townName +
              '</a>' + /*<br><a style="display:inline;padding:0;" class="open_alliance" title="' + TWXlang.KoM.showAlly + '" href="javascript:parent.AllianceWindow.open(' + ally[0] + ')"> ' + ally[1] +
              '</a>*/
              '</span><br><img src="images/fort/battle/divider.png"></div><br>' + distanceImage.outerHTML() + '&nbsp;<a title="' + TWXlang.KoM.showFort + '" href="javascript:FortWindow.open(' + fortId + ')">' + TWX.KoM.fort[fortId].name +
              '</a><p>' + capacityDiv + '</p><p><a title="' + TWXlang.KoM.showBattle + '" href="javascript:TWX.KoM.showPosition()">' +
              TWXlang.KoM.position + ': ' + playerPositionName + '</a></p><img src="images/fort/battle/divider.png"><br>' +
              rankHtml.outerHTML() + '</div>';
            },
            getPosName: function () {
              if (this.currPlayerPos == -1)
                return TWXlang.KoM.sectors.undef;
              var kfi = TWX.KoM.fort[this.currFortId];
              if (kfi.defense) {
                for (var i = 7; i <= 19; i++)
                  if (TWX.KoM.coords[i][kfi.type].includes(this.currPlayerPos))
                    return TWXlang.KoM.sectors[i];
              } else
                for (var j = 0; j <= 6; j++)
                  if (TWX.KoM.coords[j].includes(this.currPlayerPos))
                    return TWXlang.KoM.sectors[j];
              return TWXlang.KoM.inside;
            },
            makeDistanceImage: function (fortX, fortY, playerX, playerY) {
              var diffX = fortX - playerX,
              diffY = fortY - playerY,
              image = $('<img>');
              if (!diffX && !diffY)
                image.attr('src', 'images/town/cityhall/green.png').attr('title', TWXlang.KoM.atFort);
              else if (Math.abs(diffX) <= 500 && Math.abs(diffY) <= 500)
                image.attr('src', 'images/town/cityhall/yellow.png').attr('title', TWXlang.KoM.nearFort);
              else
                image.attr('src', 'images/town/cityhall/red.png').attr('title', TWXlang.KoM.notFort);
              return image;
            },
            popUp: function (e) {
              try {
                if (TWX.KoM.loading)
                  return;
                TWX.KoM.loading = true;
                var x = e.clientX || 500,
                y = e.clientY || 500,
                westId = TWX.KoM.westId,
                rooms = Chat.Resource.Manager.getRooms();
                for (var r in rooms) {
                  var room = Chat.Resource.Manager.getRoom(r);
                  if (!(room instanceof Chat.Resource.RoomFortBattle) || room.id != TWX.KoM.fortRoom) {
                    continue;
                  }
                  var fortId = TWX.KoM.currFortId = room.fortId;
                  if (TWX.KoM.started(fortId /*, true, westId*/))
                    continue;
                  TWX.KoM.currPlayerPos = TWX.KoM.getPlayerFortPosition(fortId, westId);
                  var fortCoords = TWX.KoM.fort[fortId],
                  playerRank = TWX.KoM.getPlayerRank(fortId, westId),
                  myId = Chat.MyId.match(/[0-9]+/),
                  myRank = TWX.KoM.getPlayerRank(fortId, myId),
                  playerInfo = TWX.KoM.playersData[westId],
                  playerName = playerInfo.name,
                  //playerLevel = playerInfo.level,
                  playerXY = playerInfo.coords,
                  playerClass = TWX.KoM.getPlayerClass(playerInfo.class),
                  currentHp = playerInfo.currhealth,
                  maxHp = playerInfo.maxhealth;
                  //var alliance = TWX.KoM.allies[westId];
                  TWX.KoM.highlightFortCell();
                  var positionName = TWX.KoM.getPosName(),
                  weaponMinDamage = playerInfo.weapon_damage.min,
                  weaponMaxDamage = playerInfo.weapon_damage.max,
                  weaponName = playerInfo.weapon,
                  //weaponImage = TWX.KoM.getWeaponImage(weaponName),
                  townId = playerInfo.town_id,
                  town = playerInfo.townname || TWXlang.KoM.notown;
                  /*townRights;
                  switch (playerInfo.town_rights) {
                  case 1:
                  townRights = 'norights';
                  break;
                  case 2:
                  townRights = 'councillor';
                  break;
                  case 3:
                  townRights = 'founder';
                  break;
                  default:
                  townRights = 'norights';
                  break;
                  }*/
                  var distanceImage = TWX.KoM.makeDistanceImage(fortCoords.x, fortCoords.y, playerXY.x, playerXY.y),
                  rankHtml = TWX.KoM.makeRankUpdateHtml(myRank, playerRank, westId, fortId),
                  text = TWX.KoM.makePopupHtml(fortId, distanceImage, positionName, rankHtml, weaponName, weaponMinDamage, weaponMaxDamage, currentHp, maxHp, town, townId, playerClass),
                  title = TWX.KoM.makeSmallTitle(playerName, westId, playerXY.x, playerXY.y);
                  TWX.KoM.mb = new west.gui.Dialog(title.outerHTML(), text).addButton('cancel').setId('KickoMaticPopUp').setModal(true, true).setX(x).setY(y - 50).show();
                  $('#KickoMaticPopUp').css('min-width', '0');
                  $('#KickoMaticPopUp .messagedialog_content').css('padding-bottom', '5px');
                  break;
                }
                TWX.KoM.loading = false;
              } catch (err) {
                console.log(err.stack);
                TWX.KoM.loading = false;
                new UserMessage('<span>' + err + '</spawn>', 'error').show();
              }
            },
            getWeapons: function () {
              if (TWX.KoM.weapons.length > 0)
                return;
              var itemId = 100,
              result = {};
              while (result) {
                result = ItemManager.getByBaseId(itemId++);
                TWX.KoM.weapons.push(result);
              }
            },
            getWeaponImage: function (weaponName) {
              TWX.KoM.getWeapons();
              for (var itemId in TWX.KoM.weapons) {
                var w = TWX.KoM.weapons[itemId];
                if (weaponName == w.name) {
                  return w.image;
                }
              }
            },
            getFortSize: function (room, xy) {
              var di = xy.split('-');
              Ajax.remoteCallMode('fort', 'display', {
                x: di[0],
                y: di[1]
              }, function (data) {
                var fD = TWX.KoM.fort[data.data.fortid] = data.data;
                fD.defense = room.battleData.defense;
                fD.capacity = TWX.KoM.fortsCapacity[fD.type][(fD.defense ? 1 : 0)];
                fD.startTime = new Date(new Date().getTime() + fD.battle.fortBattleStart * 1000).toDateTimeStringNice();
                TWX.KoM.fortSizeLoading[xy] = false;
              });
            },
            obtainFortSize: function (room) {
              var x = room.battleData.x,
              y = room.battleData.y,
              xy = x + '-' + y;
              if (!x || !y)
                return console.log('x or y is undefined');
              if (TWX.KoM.fortSizeLoading[xy] === true)
                return;
              TWX.KoM.fortSizeLoading[xy] = true;
              if (!TWX.KoM.fortsCapacity)
                Ajax.remoteCallMode('serverinfo', 'get_worldsettings', {}, function (result) {
                  var reg = result.worldsettings.replace(/\s|\n/g, '').match(/:(\d+)\/(\d+).+?:(\d+)\/(\d+).+?:(\d+)\/(\d+)/);
                  if (!reg)
                    return console.log('fortsCapacity is undefined');
                  TWX.KoM.fortsCapacity = [[reg[1], reg[2]], [reg[3], reg[4]], [reg[5], reg[6]]];
                  TWX.KoM.getFortSize(room, xy);
                });
              else
                TWX.KoM.getFortSize(room, xy);
            },
            getFortCoordinates: function (fortId) {
              return TWX.KoM.fortCoordinates[fortId] || null;
            },
            obtainPlayersData: function (fortId) {
              if (TWX.KoM.playersDataLoading[fortId] === true)
                return;
              TWX.KoM.playersDataLoading[fortId] = true;
              Ajax.remoteCall('fort_battlepage&fort_id=' + fortId, '', {}, function (data) {
                if (data.inProgress === false) {
                  var playerList = data.playerlist;
                  for (var i in playerList) {
                    if (playerList.hasOwnProperty(i)) {
                      var id = playerList[i].player_id;
                      //TWX.KoM.getAlliance(id);
                      TWX.KoM.setPlayerRank(fortId, id, playerList[i].privilege);
                      TWX.KoM.setPlayerFortPosition(fortId, id, playerList[i].idx);
                      TWX.KoM.playersData[id] = playerList[i];
                    }
                  }
                } else
                  TWX.KoM.inProgress[fortId] = true;
                TWX.KoM.playersDataLoading[fortId] = false;
              });
            },
            started: function (fi, a, id) {
              if (TWX.KoM.inProgress[fi]) {
                new UserMessage(TWXlang.KoM.started, 'error').show();
                return true;
              } else if ($.isEmptyObject(TWX.KoM.playersData) || a && !TWX.KoM.allies[id]) {
                new UserMessage(TWXlang.KoM.getData + '...', 'hint').show();
                return true;
              }
            },
            openMessage: function (fortId) {
              if (TWX.KoM.started(fortId))
                return;
              Ajax.remoteCall('messages', 'insert_alliance_members', {
                type: 'members'
              }, function (json) {
                if (json[0] === false)
                  new UserMessage(json[1], 'error').show();
                else {
                  TWX.KoM.allyMembers = json[1].split(';');
                  var done = 0;
                  for (var a in TWX.KoM.playersData) {
                    TWX.KoM.allyMembers[TWX.KoM.allyMembers.indexOf(TWX.KoM.playersData[a].name)] = null;
                    done++;
                    if (Object.keys(TWX.KoM.playersData).length == done) {
                      MessagesWindow.open('telegram', {
                        insert_to: TWX.KoM.allyMembers.toString().replace(/[,]+/g, ';')
                      });
                      var Kff = TWX.KoM.fort[fortId];
                      var defAtt = Kff.defense ? TWXlang.KoM.def : TWXlang.KoM.att;
                      setTimeout(function () {
                        MessagesWindow.Telegram.subjectInput.setValue(Kff.name + ' ' + Kff.startTime);
                        MessagesWindow.Telegram.masstelegramInput.setSelected(true);
                        MessagesWindow.Telegram.telegramInput.setContent('[b]' + TWXlang.KoM.where + ':[/b] [fort]' + Kff.name + '[/fort]\n[b]' + TWXlang.KoM.when + ':[/b] ' + Kff.startTime + '\n[b]' + Kff.typename + ':[/b] ' + Kff.capacity + ' ' + defAtt);
                      }, 1000);
                    }
                  }
                }
              });
            },
            interval: function () {
              TWX.KoM.bindClickFunctions();
              try {
                var rooms = Chat.Resource.Manager.getRooms();
                for (var r in rooms) {
                  var room = Chat.Resource.Manager.getRoom(r);
                  if (!room.hasOwnProperty('room') || room.room != 'fortbattle')
                    continue;
                  var fortId = room.fortId;
                  if (!TWX.KoM.fort.hasOwnProperty(fortId))
                    TWX.KoM.obtainFortSize(room);
                  if ($('.battleMessage' + fortId).length === 0)
                    $('#tab_title_' + r + ' .chat_icons').css('background-image', 'url(' + TWX.url + 'cicons.png)').append('<div class="battleMessage' + fortId + '">').attr('title', TWXlang.KoM.remindAlly).click(function () {
                      TWX.KoM.openMessage(fortId);
                    });
                }
              } catch (e) {
                console.log(e.stack);
              }
            },
            dataInterval: function () {
              var rooms = Chat.Resource.Manager.getRooms();
              for (var r in rooms) {
                var room = Chat.Resource.Manager.getRoom(r);
                if (!room.hasOwnProperty('room') || room.room != 'fortbattle')
                  continue;
                var fortId = room.fortId;
                TWX.KoM.obtainPlayersData(fortId);
              }
            },
            bindClickFunctions: function () {
              var fContacts = function (e) {
                TWX.KoM.westId = $(this).parent().attr('class').match(/[0-9]+/);
                var lastElement = $(this);
                for (var i = 0; i < 10; i++)
                  lastElement = lastElement.parent();
                var room = lastElement.attr('class').match(/(room_fortbattle_(att|def)_[0-9]+)/);
                TWX.KoM.fortRoom = room[1];
                if (e.ctrlKey)
                  TWX.KoM.smallPopUp(e);
                else
                  TWX.KoM.popUp(e);
              };
              var fMessages = function (e) {
                TWX.KoM.westId = $(this).parent().attr('class').match(/[0-9]+/);
                var lastElement = $(this);
                for (var i = 0; i < 12; i++)
                  lastElement = lastElement.parent();
                var room = lastElement.attr('class').match(/(room_fortbattle_(att|def)_[0-9]+)/);
                TWX.KoM.fortRoom = room[1];
                if (e.ctrlKey)
                  TWX.KoM.smallPopUp(e);
                else
                  TWX.KoM.popUp(e);
              };
              var ranks = ['general', 'captain', 'sergeant', 'private', 'recruit', 'reservist', 'traitor'];
              $.each(ranks, function (k, v) {
                $('.chat_contacts .chat_servicegrade_' + v).off('click').on('click', fContacts);
                $('.chat_messages .chat_servicegrade_' + v).off('click').on('click', fMessages);
              });
            },
            makeCapacityDiv: function (fortId) {
              var ranks = [1, 2, 3],
              fortCapacity = TWX.KoM.fort[fortId].capacity,
              count = TWX.KoM.countPlayersWithRanks(fortId, ranks),
              color = count < fortCapacity ? 'green' : count == fortCapacity ? 'yellow' : 'red';
              return '<span><span style="color:' + color + ';" id="fortCapacity' + fortId + '" title="' + TWXlang.KoM.evaluated + '">' + count + '/' + fortCapacity + '</span><p></p></span>';
            },
            countPlayersWithRanks: function (fortId, ranks) {
              var result = 0,
              fortRanks = TWX.KoM.getFortRanks(fortId);
              for (var westId in fortRanks)
                if (ranks.includes(fortRanks[westId]))
                  result++;
              return result;
            },
            thatWouldntHappendIfZetWasStillWorkingOnTheWest: function () {
              Chat.Resource.RoomFactory = function (data) {
                var room = null;
                if (data instanceof Chat.Resource.Client) {
                  room = new Chat.Resource.RoomClient(data);
                } else {
                  switch (data.room) {
                  case 'town':
                    room = new Chat.Resource.RoomTown(data.townid, data.x, data.y);
                    break;
                  case 'general':
                    room = new Chat.Resource.RoomGeneral(data.general_id);
                    break;
                  case 'maneuver':
                    room = new Chat.Resource.RoomManeuver(data.fortid, data.xy);
                    break;
                  case 'fortbattle':
                    room = new Chat.Resource.RoomFortBattle(data.fortid);
                    break;
                  default:
                    room = new Chat.Resource.Room();
                    break;
                  }
                }
                room.init();
                return room;
              };
            },
          };
          ChatWindow.Client.onClickOrigin = ChatWindow.Client.onClick;
          ChatWindow.Client.onClick = function (args, id) {
            if (args[0].target.className.indexOf('chat_servicegrade') !== 0) {
              ChatWindow.Client.onClickOrigin(args, id);
            }
          };
          $.fn.outerHTML = function () {
            return $('<div>').append(this.eq(0).clone()).html();
          };
          setInterval(TWX.KoM.interval, 1e3);
          TWX.KoM.dataInterval();
          setInterval(TWX.KoM.dataInterval, 1e4);
          TWX.KoM.thatWouldntHappendIfZetWasStillWorkingOnTheWest();
        },
      };
      TWX.FbRankingChar = {
        init: function () {
          if (!TWX.Data.playerChars)
            TWX.Data.playerChars = {};
          var loading,
          cell,
          data,
          cellH,
          pId,
          charClass = [null, 'greenhorn', 'duelist', 'adventurer', 'worker', 'soldier'],
          addCharClass = function () {
            var charC = charClass[TWX.Data.playerChars[pId]];
            $(cellH).prepend('<img src="images/class_choose/class_' + charC + '.png" title="' + Game.InfoHandler.getLocalString4Charclass(charC) + '"> ');
            if (++cell < data.length)
              nextCell();
            else
              loading = 0;
          },
          getCharClass = function () {
            Ajax.remoteCallMode('ranking', 'get_data', {
              tab: 'experience',
              entries_per_page: 9999
            }, function (json) {
              for (var jr of json.ranking)
                TWX.Data.playerChars[jr.player_id] = charClass.indexOf(jr.class);
              localStorage.setItem('TWLT', JSON.stringify(TWX.Data));
              addCharClass();
            });
          },
          nextCell = function () {
            cellH = RankingWindow.FortBattles.Table.getCell(cell, 'forts_playername')[0];
            pId = cellH.innerHTML.match(/open\((\d+)/)[1];
            if (!TWX.Data.playerChars[pId])
              getCharClass();
            else
              addCharClass();
          };
          RankingWindow.FortBattles.updateTable_twx = RankingWindow.FortBattles.updateTable_twx || RankingWindow.FortBattles.updateTable;
          RankingWindow.FortBattles.updateTable = function (be_data) {
            RankingWindow.FortBattles.updateTable_twx.call(this, be_data);
            if (!loading) {
              loading = 1;
              data = be_data.ranking;
              cell = 0;
              nextCell();
            }
          };
        }
      };
      TWX.DuelXpCalc = {
        init: function () {
          PlayerProfileMain.setProfileInfo_twx = PlayerProfileMain.setProfileInfo_twx || PlayerProfileMain.setProfileInfo;
          PlayerProfileMain.setProfileInfo = function () {
            PlayerProfileMain.setProfileInfo_twx.apply(this, arguments);
            var clvl = this.resp.level,
            dlvl = this.resp.duelLevel,
            target = $('.playerprofile-' + this.playerid + ' .profileinfo-duellevel .profileinfo-value'),
            range = dLvlRange(dlvl),
            getXp = function (lvl) {
              return Math.ceil(Math.pow(lvl * 10, 1 / 0.6));
            },
            getLvl = function (xp, perc) {
              return clvl + Math.floor(Math.pow(xp * (perc || 1), 0.6) / 10);
            },
            minXp = getXp(dlvl - clvl),
            maxXp = dlvl == '450' ? '<b>∞</b>' : getXp(dlvl + 1 - clvl),
            minLvl = getLvl(minXp, 0.9),
            maxLvl = dlvl == '450' ? '450' : getLvl(maxXp, 0.9);
            target.append(' <div class="tw2gui-iconset tw2gui-icon-question-priority-4" title="<span>' + TWXlang.attDl + ': ' + range.min + ' - ' + range.max + '<br><br>' + TWXlang.duelxp + ': ' + minXp + ' - ' + maxXp + '<br> -10% ⇒ ' + TWXlang.duelLevel + ' ' + minLvl + (maxLvl > minLvl ? ' - ' + maxLvl : '') + '</span>" style="display:inline-block;vertical-align:top;cursor:pointer;"></div>');
          };
        }
      };
      TWX.Logout = {
        init: function () {
          var menu = $('<div class="menulink" onclick="TWX.Logout.logout();" title="' + TWXlang.logout + '">').css('background-image', 'url(' + TWX.Images('logout') + ')').css('background-position', '0px 0px').on('mouseenter', function () {
            $(this).css('background-position', '-25px 0px');
          }).on('mouseleave', function () {
            $(this).css('background-position', '0px 0px');
          });
          $('#TWX_menu').append(menu);
        },
        logout: function () {
          location.href = 'game.php?window=logout&action=logout&h=' + Player.h;
        },
      };
      TWX.ChangeCity = {
        init: function () {
          var swap = function (that) {
            var rows = $('.' + that.window.id + ' .row .cell.cell_2.name,.' + that.window.id + ' .row .cell.cell_2.name_foreign');
            rows.empty();
            for (var i = 0; i <= that.data.length; i++) {
              var player = that.data[i];
              $(rows[i]).append('<span>&nbsp;' + (player.title !== undefined ? player.title : '') + '</span><a href="#" onClick="PlayerProfileWindow.open(' + player.player_id + ')">' + player.name + '</a>');
            }
          };
          CityhallWindow.Residents.fillContent_twx = CityhallWindow.Residents.fillContent;
          CityhallWindow.Residents.fillContent = function () {
            var tmp = CityhallWindow.Residents.fillContent_twx.call(this);
            if (tmp !== undefined)
              return tmp;
            swap(this);
          };
        }
      };
      TWX.Statusbar = {
        init: function () {
          $('div#ui_windowbar').hide();
          $('div#ui_windowbar_state').hide();
        }
      };
      TWX.BlinkEvents = {
        init: function () {
          var setVal7 = setInterval(function () {
            if ($('.border.highlight').length) {
              clearInterval(setVal7);
              $('.border.highlight').remove();
              TWX.addStyle('.border.highlight {display:none;}');
            }
          }, 3000);
        }
      };
      TWX.FortTracker = {
        init: function () {
          TWX.addStyle('.fort_battle_notification {display:none!important;}');
        }
      };
      TWX.FriendsPop = {
        init: function () {
          west.notification.ToastOnlineNotification.prototype.show = function () {};
        }
      };
      TWX.CalcTwdb = {
        show: function (e) {
          if (!e.ctrlKey && !e.altKey)
            return;
          var t = $(e.target).data();
          var tdi = t.itemId || t.itemid || t.setkey;
          if (!tdi)
            return;
          var add;
          if (e.altKey) {
            add = isNaN(tdi) ? 'supravy&set=' : 'item&id=';
            TWX.GUI.open('openWebCenter', '//tw-db.info/?strana=' + add + tdi, [1000, 630]);
            TWX.GUI.makeList();
          } else {
            add = isNaN(tdi) ? 'sets/' : 'item/';
            window.open('//tw-calc.net/' + add + tdi);
          }
        },
        init: function () {
          $(document).click(function (e) {
            TWX.CalcTwdb.show(e);
          });
          Inventory.clickHandler = function (item_id, e) {
            var item = Bag.getItemByItemId(item_id);
            if (e.shiftKey || e.ctrlKey || e.altKey)
              return;
            if (this.click && this.click.callback.apply(this.click.context, [item]))
              return;
            if (item.obj.action) {
              $.globalEval(item.obj.action);
              return;
            }
            if (wman.getById(Wear.uid)) {
              Wear.carry(item);
              return;
            }
            return;
          };
        }
        (),
      };
      TWX.CollectReminder = function () {
        var setVal4 = setInterval(function () {
          if (window.Bag && Bag.loaded) {
            clearInterval(setVal4);
            var nulls = [];
            for (var y in TWX.cdown) {
              var tcy = TWX.cdown[y],
              cdwn = TWX.Data.cooldown && TWX.Data.cooldown[y] || tcy[0],
              item = Bag.getItemsByBaseItemId(y)[0];
              if (cdwn == 1 && item && (tcy.length == 1 || sesEvs[tcy[1]] == EvName)) {
                var coold = BuffList.cooldowns[item.obj.item_id] && BuffList.cooldowns[item.obj.item_id].time || item.cooldown * 1000;
                var sec = coold - new ServerDate().getTime();
                if (!(sec > 0))
                  nulls.push(item);
                else if (!TWX.cdownTimer[y])
                  TWX.cdownSetTime(y, [item], sec);
              } else if (cdwn == 0.5 && TWX.cdownTimer[y]) {
                clearTimeout(TWX.cdownTimer[y]);
                TWX.cdownTimer[y] = 0;
              }
            }
            if (nulls.length)
              TWX.cdownSetTime(0, nulls, 0);
          }
        }, 2000);
      };
      TWX.SkipOpen = function () {
        ItemUse.use_twx = ItemUse.use;
        ItemUse.use = function (itemId) {
          var baseId = itemId / 1000,
          skips = TWX.Data.skipOpen && TWX.Data.skipOpen[baseId] || TWX.skipOpen[baseId];
          if (skips == 1)
            Ajax.remoteCall('itemuse', 'use_item', {
              item_id: itemId,
              lastInvId: Bag.getLastInvId()
            }, function (res) {
              if (res.error)
                return new UserMessage(res.msg).show();
              var widget = $('<div>');
              for (var m of res.msg.effects) {
                switch (m.type) {
                case 'experience':
                  widget.append(new tw2widget.reward.ExpReward(Math.ceil(m.experience)).toString());
                  break;
                case 'lottery':
                case 'content':
                  var cont = {};
                  m.items.each(function (mi) {
                    cont[mi.item_id] = mi.count;
                    widget.append(new tw2widget.Item(ItemManager.get(mi.item_id)).setCount(mi.count).getMainDiv());
                  });
                  $.get('//tw-calc.net/service/chest-export', {
                    chest: itemId,
                    count: 1,
                    content: cont,
                    version: Game.version
                  }, function () {}, 'jsonp');
                  if (ItemUse.twdb)
                    ItemUse.twdb(itemId, res);
                  break;
                case 'ses':
                  widget.append(' <img src="images/icons/' + m.event + '.png" title="' + m.name.escapeHTML() + '"> ' + m.amount);
                  break;
                default:
                  widget.append(JSON.stringify(m));
                  break;
                }
                var mess = $('<div>' + TWXlang.skipDone + ':<br></div>').append(widget);
                new UserMessage(mess, 'success').show();
                Bag.updateChanges(res.msg.changes);
                EventHandler.signal('item_used', [itemId]);
              }
            });
          else
            ItemUse.use_twx.apply(this, arguments);
        };
      };
      (TWX.Updater = function () {
        if (!window.scriptRequest) {
          scriptRequest = true;
          $.getScript(TWX.url + 'sUp.js');
        }
        var intVal = setInterval(function () {
          if (window.scriptUp) {
            scriptUp.c('TWX', TWX.version, TWX.name, TWX.lang);
            clearInterval(intVal);
          }
        }, 2000);
      })();
      TWX.Skript.init();
    } else if (location.href.includes('?strana=invent&x=')) {
      let lg = TWX.langs,
      lang = /lang=([a-z]+)/.exec(document.cookie),
      TWXlang = lang && lg.hasOwnProperty(lang[1]) ? lg[lang[1]] : lg.en,
      done = false,
      i = document.getElementsByClassName('bag_empty'),
      wrld = document.getElementById('char_server').textContent,
      saveCounts = {},
      sameWorld = false,
      hide = function (it) {
        saveCounts = {};
        var sameItem = false;
        for (var j of i) {
          var m = j.children[1].innerHTML.match(/,\d,\d,\d,(\d),\d/),
          auct = m ? m[1] == 1 : true,
          id = j.id.slice(1),
          level = id.slice(-1) > 0;
          if (it)
            sameItem = sameWorld ? it[id] : !it[id];
          if (!auct || level || sameItem)
            j.style.display = 'none';
          else if (it && it[id]) {
            var count = j.firstChild.firstChild;
            if (count.textContent > it[id]) {
              saveCounts[j.id] = count.textContent;
              count.textContent = it[id];
            }
          }
        }
        $('.inputV2')[0].style.display = 'none';
      };
      TWX.compInv = function () {
        if (done) {
          done = false;
          for (var h of i) {
            h.style.display = 'inline-block';
            if (saveCounts[h.id])
              h.firstChild.firstChild.textContent = saveCounts[h.id];
          }
          $('.inputV2')[0].style.display = 'inline-block';
        } else {
          done = true;
          var url = prompt(TWXlang.compInv + ': ');
          if (url && url.includes('?strana=invent&x='))
            $.ajax({
              url: url
            }).done(function (data) {
              var regex = /<div id='i(\d+)' class='bag_empty'><span class="pocetx"><span class="pocet_cislox">(\d+)<\/span>/g,
              t,
              items = {},
              world = /id="char_server">(.*?)</.exec(data);
              if (!world) {
                alert('invalid inventory');
                done = false;
              }
              sameWorld = wrld == world[1];
              while (t = regex.exec(data)) {
                var u = sameWorld ? t[1].slice(0, -3) + '000' : t[1];
                items[u] = t[2];
              }
              hide(items);
            }).fail(function () {
              alert(arguments[1] + arguments[2]);
              done = false;
            });
          else {
            sameWorld = false;
            hide();
          }
        }
      };
      $('.inputV2').after('<img src="//westzz.innogamescdn.com/images/items/yield/pick.png" width="25" style="position:absolute;right:2px;cursor:pointer;border:2px solid #90601c;border-radius:5px;background:#e0ddd9;	box-shadow:0 0 4px inset;}" onclick="TWX.compInv();">');
    } else {
      if (location.hash.includes('loginWorld'))
        setTimeout(function () {
          $('#loginButton').click();
          var val = setInterval(function () {
            var u = Worlds.playerWorlds;
            if (Object.keys(u).length !== 0) {
              clearInterval(val);
              Auth.login(u[parseFloat(location.hash.replace(/\D/g, ''))]);
            }
          }, 500);
        }, 1000);
      else {
        var setVal = setInterval(function () {
          if (window.Worlds && Worlds.show) {
            clearInterval(setVal);
            let lg = TWX.langs,
            TWXlang = lg.hasOwnProperty(location.href.substr(21, 2)) ? lg[location.href.substr(21, 2)] : lg.en;
            Worlds.show = (function () {
              Worlds.show_twx = Worlds.show;
              return function () {
                Worlds.show_twx.apply(this, arguments);
                var first = true;
                var plyWrl = Worlds.playerWorlds,
                state = (JSON.parse(localStorage.getItem('TWLTcustom1')) || {}),
                t1 = [],
                t2 = [];
                for (var a in plyWrl) {
                  if (plyWrl[a][1] !== null) {
                    t1.push(a);
                    if (!state[a])
                      state[a] = false;
                    else if (state[a] === true)
                      t2.push(a);
                  }
                }
                var loginNow = function (t) {
                  for (var x = 0; x < t.length; x++) {
                    if (first)
                      Auth.login(plyWrl[t[x]]);
                    else
                      window.open(location.origin + '#loginWorld' + t[x], '_blank');
                    first = false;
                  }
                };
                $('#worldsWrapper').append('<div id="loginMore">');
                $('#loginMore').append('<a id="loginAll" title="' + TWXlang.loginAll2 + '" href="#">' + TWXlang.loginAll1 + '</a>').append('<a id="custom" title="' + TWXlang.custom2 + '" href="#">' + TWXlang.custom1 + '</a>').append('<img id="cust1" title="' + TWXlang.edit + '" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAAFOSURBVDhPY6A6KKnL4j60a2Xf1jWz/6PjQ5unbIUqww3WLpr0Hx0/vXXq/9e39/5fPL4VzAdZAlVOGFw6s9t49sQGsAF/f30GGwLiQ6UJA5Dio7tW/X/z6AIYgwxaNKPr7/1rh6ShSnADkJ/banPB/r9z+QDYIBAfRE9oKf7f2Vz8BKoUE+ydEfj/5Orm/88vb/1fVxwHdjZI88p5zc0gevemRWBxqHJUANP86+Wu/9f3TPu/Y1Yh2NbCskQWkPyiOTmiIM0gw8AakAFI88FFVWCbQYasn5iBVeG0SWWeUCYCLKl1B9sG0gwyZFl73P+99d79UGn8AKQZZBtIM8iQ2XXh2J2IDYA0g2x7cGwZ2JDJpf7E2zwnwwxsG0gzyJCuXC/iNYMAsubGFDvSNIMAyEaQFxoiDf93Vgb3QIWJBwtb3NJANoNoqBAJgIEBAEbiFXTTZGcSAAAAAElFTkSuQmCC">');
                $('#selectWorldText').css('margin-bottom', '20px');
                $('#loginAll').css({
                  'background-image': 'url(' + TWX.Images('LT_login') + ')',
                  'height': '45px',
                  'width': '180px',
                  'line-height': '40px',
                  'font-weight': 'bold',
                  'font-size': '12px',
                  'margin-left': '10px',
                  'top': '35px',
                  'z-index': '1',
                  'position': 'absolute',
                  'cursor': 'pointer',
                }).on('mouseenter', function () {
                  $(this).css('background-position', '0px -45px');
                }).on('mouseleave', function () {
                  $(this).css('background-position', '0px 0px');
                }).click(function () {
                  loginNow(t1);
                });
                $('#custom').css({
                  'background-image': 'url(' + TWX.Images('LT_loginC') + ')',
                  'background-repeat': 'no-repeat',
                  'height': '36px',
                  'width': '144px',
                  'text-align': 'left',
                  'padding-left': '15px',
                  'line-height': '32px',
                  'font-weight': 'bold',
                  'font-size': '11px',
                  'margin-left': '45px',
                  'top': '70px',
                  'z-index': '1',
                  'position': 'absolute',
                  'cursor': 'pointer',
                }).on('mouseenter', function () {
                  $(this).css('background-position', '0px -36px');
                }).on('mouseleave', function () {
                  $(this).css('background-position', '0px 0px');
                }).click(function () {
                  loginNow(t2);
                });
                $('#cust1').css({
                  'margin-left': '160px',
                  'top': '78px',
                  'z-index': '2',
                  'position': 'absolute',
                  'cursor': 'pointer',
                }).click(function () {
                  var checkB = {},
                  checkD = {};
                  $('#loginMore').hide();
                  $('#allWorlds').empty();
                  $('#allWorlds').css('text-align', 'left');
                  for (var k = 0; k < t1.length; k++) {
                    checkB[t1[k]] = new west.gui.Checkbox().setLabel(Worlds.data[t1[k]].name).setSelected(state[t1[k]]).appendTo($('#allWorlds'));
                    $('#allWorlds').append('<br><div style="height:5px;">');
                  }
                  var butB = new west.gui.Button(TWXlang.save, function () {
                    for (var l in checkB) {
                      checkD[l] = checkB[l].isSelected();
                      localStorage.setItem('TWLTcustom1', JSON.stringify(checkD));
                    }
                    new UserMessage(TWXlang.saveMessage, 'success').show();
                  });
                  butB.appendTo($('#allWorlds'));
                });
              };
            })();
          }
        }, 100);
      }
    }
  }
});