// ==UserScript==
// @name TheWest-Menu
// @namespace TWM_M77
// @author Meuchelfix77 (updated by Tom Robert)
// @description Gives you the possibility to rearrange the menus of The West!
// @include https://*.the-west.*/game.php*
// @include https://*.the-west.*/index.php?page=logout
// @exclude https://classic.the-west.net*
// @version 4.170
// @history https://tomrobert.safe-ws.de/changelog-lang=en.htm
// @icon http://twm.pf-control.de/favicon.ico
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/15389/TheWest-Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/15389/TheWest-Menu.meta.js
// ==/UserScript==
// translation: Meuchelfix77/Tom Robert(German&English),pepe100/Fernando(Spanish),?(Hungarian),?(Dutch),Darius II/Vebuus(Polish),Jamza/Rado 1(Czech&Slovak),Kigka(Greek)
if (location.href.indexOf('index.php?page=logout') != -1) {
  location.href = '/';
} else if (location.href.indexOf('game.php') != -1) {
  (function (fn) {
    var script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.textContent = '(' + fn.toString() + ')();';
    (document.head || document.body || document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);
  })(function () {
    TWM = {
      //General information
      version: '4.170',
      name: 'TheWest-Menu',
      author: 'Meuchelfix77 (updated by Tom Robert)',
      website: '//greasyfork.org/scripts/15389',
      url: '//tomrobert.safe-ws.de/',
      //Language
      langs: {
        en: {
          language: 'English',
          settings: 'Settings',
          changeLog: 'Changelog',
          langB: 'Language',
          menu: 'Menu',
          fixed: 'fixed',
          absolute: 'absolute',
          menuPosHelp: {
            fixed: 'menu will rest at bottom of the screen (always visible).',
            absolute: 'menu will rest at bottom of the map (hidden on small screens).',
          },
          noSettings: 'You have no settings saved. Click on the gears on the right side to set up your menu.',
          save: 'Save',
          reset: 'Reset',
          saved: 'Settings have been saved.',
          addItem: 'Add item',
          moveItem: 'Hold down left mouse button while moving an element to the settings window.',
          removeItem: 'Drag item here to remove it',
          noTown: 'You are not member of a town!',
          entryList: 'EntryList',
          cancel: 'Cancel',
          import: 'Import',
          example: 'Example',
          export: 'Export',
          exportInfo: 'Copy the text to your clipboard and paste it where you want to use the data',
          couldNotSave: 'Settings have not been saved.',
          noFair: 'Sorry, but the travelling fair is not available. Wait for it to open the next time.',
          expand: 'Expanded menu',
          expandHelp: 'Expanded menu with one more column for menu entries. Also offers the possibility to hide the menu',
          menutop: 'Keep the menu bar always on top',
          general: 'General',
          entry: 'Entry',
          blinking: 'Blinking',
          mask: 'Mask',
          friday13: 'Friday the 13th',
          badLuck: 'Bad Luck!',
          badLuckText: 'Oh no, you lost all your money. It seems, you have no luck today.<br>Go to the bank and ask for help. Maybe they can tell you what happened to your money.',
          activate: 'Activate',
          deactivate: 'Deactivate',
          activateInfo: 'The script is deactivated. This could possible remove errors and the script is still searching for updates.<br>Click on the button to reactivate it.',
          deactivateInfo: 'This will deactivate the script, but will still search for updates',
          entries: {
            Abenteuer: 'Adventures',
            Adventskalender: 'Advent calendar',
            Arbeiten: 'Work',
            Aufgaben: 'Daily tasks',
            Auftraege: 'Tasks',
            //Bank: '',
            Berichte: 'Reports',
            Bestatter: 'Moritician',
            Betrueger: 'Frauds',
            Buechsenmacher: 'Gunsmith',
            Buendnis: 'Alliance',
            Charakter: 'Character',
            //Chat: '',
            Duelle: 'Duels',
            Einladungen: 'Town invitations',
            Einstellungen: 'Settings',
            Erfolge: 'Achievments',
            Fertigkeiten: 'Skills',
            Fortkaempfe: 'Fort Battles',
            Freunde: 'Friends',
            Gemischtwaren: 'General store',
            Haendler: 'Mobile Trader',
            Handwerk: 'Craft',
            //Hotel: '',
            Inventar: 'Inventory',
            Kirche: 'Church',
            Lichtspielhaus: 'Cinema',
            //Logout: '',
            Markt: 'Market',
            Multiplayer: 'Multiplayer Games',
            //Premium: '',
            PremiumKaufen: 'Buy nuggets',
            //QuakeNetWebchat: '',
            //Quests: '',
            QuestBarkeeper: 'Barkeeper Henry Walker',
            Questbuch: 'Quest book',
            QuestIndian: 'Waupee',
            QuestLady: 'Maya Roalstad',
            QuestSheriff: 'Sheriff John Fitzburn',
            Rangliste: 'Ranking',
            //Saloon: '',
            Schlafen: 'Sleep',
            Schneider: 'Tailor',
            //Sheriff: '',
            Stadt: 'Town',
            Stadtforum: 'Town forum',
            Stadthalle: 'Town hall',
            Statistiken: 'Statistics',
            Telegramme: 'Messages',
            TheWestCalc: 'TW-Calc',
            TheWestDataBase: 'TW-DB.info',
            TheWestForum: 'Forum The West',
            //TheWestWiki: '',
            TWTimes: 'Western Post',
            UPShop: 'Union Pacific Shop',
            Wanderzirkus: 'Travelling fair',
          }
        },
        de: {
          language: 'German (Deutsch)',
          settings: 'Einstellungen',
          changeLog: 'Changelog',
          langB: 'Sprache',
          menu: 'Menü',
          fixed: 'fixiert',
          absolute: 'absolut',
          menuPosHelp: {
            fixed: 'Menü bleibt am unteren Rand des Bildschirms (immer sichtbar).',
            absolute: 'Menü bleibt am unteren Rand der Karte (wird bei kleinen Bildschirmen verdeckt).',
          },
          noSettings: 'Du hast keine Einstellungen gespeichert. Klicke rechts auf die 2 Zahnräder, um das Menü zu verändern.',
          save: 'Speichern',
          reset: 'Zurücksetzen',
          saved: 'Einstellungen wurden gespeichert!',
          addItem: 'Eintrag hinzufügen',
          moveItem: 'Halte die linke Maustaste gedrückt, während du einen Eintrag ins Einstellungs-Fenster ziehst.',
          removeItem: 'Eintrag zum Löschen hierher ziehen',
          noTown: 'Du gehörst keiner Stadt an!',
          entryList: 'Einträge',
          cancel: 'Abbrechen',
          import: 'Importieren',
          example: 'Beispiel',
          export: 'Exportieren',
          exportInfo: 'Kopiere den Text in deine Zwischenablage und füge ihn dort ein, wo du ihn brauchst',
          couldNotSave: 'Einstellungen konnten nicht gespeichert werden.',
          noFair: 'Der Wanderzirkus ist momentan unterwegs. Warte bis er seine Pforten das nächste Mal öffnet.',
          expand: 'Erweitertes Menü',
          expandHelp: 'Breiteres Menü mit einem Menü-Eintrag mehr pro Reihe und der Möglichkeit das Menü zu minimieren',
          menutop: 'Halte die Menüleiste immer im Vordergrund',
          general: 'Allgemein',
          entry: 'Eintrag',
          blinking: 'Blinken aktivieren',
          mask: 'Maske',
          friday13: 'Freitag, der 13.',
          badLuck: 'So ein Pech!',
          badLuckText: 'Verflixt, du bemerkst, dass du dein gesamtes Geld verloren hast. Heute ist definitiv nicht dein Glückstag.<br>Schau mal bei der Bank deines Vertrauens vorbei, um dich nach Hilfe zu erkundigen.',
          activate: 'Aktivieren',
          deactivate: 'Deaktivieren',
          activateInfo: 'Das Skript ist deaktiviert. So entstehen keine Fehler und es wird weiterhin nach Updates gesucht.<br>Klicke auf die Schaltfläche, um das Skript wieder zu aktivieren.',
          deactivateInfo: 'Das Skript wird deaktiviert, sucht jedoch weiterhin nach Updates',
          entries: {
            Aufgaben: 'Tägliche Aufgaben',
            Auftraege: 'Aufträge',
            Buechsenmacher: 'Büchsenmacher',
            Buendnis: 'Bündnis',
            Betrueger: 'Betrüger',
            Einladungen: 'Stadteinladungen',
            Fortkaempfe: 'Fortkämpfe',
            Haendler: 'Fahrender Händler',
            Multiplayer: 'Multiplayer-Spiele',
            PremiumKaufen: 'Nuggets kaufen',
            QuestBarkeeper: 'Barkeeper Henry Walker',
            QuestIndian: 'Waupee',
            QuestLady: 'Maria Roalstad',
            QuestSheriff: 'Sheriff John Fitzburn',
            TheWestCalc: 'TW-Calc',
            TheWestDataBase: 'TW-DB.info',
            TheWestForum: 'The West - Forum',
            TheWestWiki: 'Wiki The-West',
            UPShop: 'Union Pacific Shop',
          }
        },
        es: {
          language: 'Spanish (español)',
          settings: 'Ajustes',
          changeLog: 'Cambios',
          langB: 'Idioma',
          menu: 'Menú',
          fixed: 'fijado',
          absolute: 'absoluto',
          menuPosHelp: {
            fixed: 'el menú se apoyará en la parte inferior de la pantalla (siempre visible).',
            absolute: 'el menú se apoyará en la parte inferior del mapa (escondido en pantallas pequeñas).',
          },
          noSettings: 'No hay guardados ajustes. Haga click en las ruedas del lado derecho para configurar su menú.',
          save: 'Guardar',
          reset: 'Reiniciar',
          saved: 'Los ajustes han sido guardados!',
          addItem: 'Añadir item',
          moveItem: 'Mantener pulsado el botón izquierdo del ratón mientras mueves un elemento a la ventana de ajustes.',
          removeItem: 'Arrastra el item aquí para removerlo',
          noTown: 'No eres miembro de una ciudad!',
          entryList: 'Lista de entradas',
          cancel: 'Cancelar',
          import: 'Importar',
          export: 'Exportar',
          exportInfo: 'Copia el texto en el portapapeles y pégalo donde quieras usar los datos',
          couldNotSave: 'Ajustes no han sido grabados.',
          noFair: 'Lo sentimos, pero la feria ambulante no está disponible. Espere a que se abra la próxima vez.',
          expand: 'Menú expandido',
          expandHelp: 'Menú expandido con una columna más para las entradas del menú. También ofrece la posibilidad de exconder el menú',
          general: 'General',
          mask: 'Máscara',
          friday13: 'Viernes 13',
          entries: {
            Abenteuer: 'Aventuras',
            Adventskalender: 'Calendario de adviento',
            Arbeiten: 'Trabajar',
            Aufgaben: 'Tareas diarias',
            Auftraege: 'Tareas',
            Bank: 'Banco',
            Berichte: 'Informes',
            Bestatter: 'Sepulturero',
            Buechsenmacher: 'Escopetero',
            Buendnis: 'Alianza',
            Charakter: 'Personaje',
            Duelle: 'Duelos',
            Einladungen: 'Invitaciones de ciudades',
            Einstellungen: 'Ajustes',
            Erfolge: 'Logros',
            Fertigkeiten: 'Habilidades',
            Fortkaempfe: 'Batallas de fuerte',
            Freunde: 'Amigos',
            Gemischtwaren: 'Almacén principal',
            Haendler: 'Vendedor ambulante',
            Handwerk: 'Artesano',
            Inventar: 'Inventario',
            Kirche: 'Iglesia',
            Lichtspielhaus: 'Auditorio',
            Logout: 'Desconectar',
            Markt: 'Mercado',
            Mulitplayer: 'Juegos Multijugador',
            PremiumKaufen: 'Comprar pepitas de oro',
            Quests: 'Búsquedas',
            QuestBarkeeper: 'Barman Henry Walker',
            Questbuch: 'Libro de búsqueda',
            QuestIndian: 'Waupee',
            QuestLady: 'María Roalstad',
            QuestSheriff: 'Sheriff John Fitzburn',
            Rangliste: 'Clasificación',
            Schlafen: 'Dormir',
            Schneider: 'Sastre',
            Stadt: 'Ciudad',
            Stadtforum: 'Foro',
            Stadthalle: 'Casa de asamblea',
            Statistiken: 'Estadísticas',
            Telegramme: 'Mensajes',
            TheWestCalc: 'TW-Calc',
            TheWestDataBase: 'TW-DB.info',
            TheWestForum: 'Foro The West',
            TheWestWiki: 'Wiki The-West',
            UPShop: 'Tienda de la Unión Pacifica',
            Wanderzirkus: 'Feria ambulante',
          }
        },
        hu: {
          language: 'Hungarian (Magyar)',
          settings: 'Beállítások',
          changeLog: 'Changelog',
          langB: 'Nyelv',
          menu: 'Menü',
          fixed: 'fixed',
          absolute: 'absolute',
          menuPosHelp: {
            fixed: 'A Menü a képernyõ aljához igazodik (mindig látható).',
            absolute: 'A Menü a térkép aljához igazodik (kis képernyõn nem látszik mindig).',
          },
          noSettings: 'Nincsenek mentett Beállítások. Kattints a fogaskerekekre a jobb oldalon a Beállításokhoz.',
          save: 'Mentés',
          reset: 'Alaphelyzet',
          saved: 'Beállítások mentve.',
          addItem: 'Elem hozzáadása',
          moveItem: 'A bal egérgombot lenyomva húzhatod be a gombokat a Beállítás ablakba.',
          removeItem: 'Húzd ide amelyik nem kell',
          noTown: 'Nincs városod!',
          mask: 'Maszk',
          friday13: 'Péntek 13',
          entries: {
            Abenteuer: 'Kalandox',
            Adventskalender: 'Adventi naptár',
            Arbeiten: 'Munkák',
            Aufgaben: 'Napi feladatok',
            Auftraege: 'Feladatok',
            Berichte: 'Jelentések',
            Bestatter: 'Temetkezési vállalkozó',
            Buechsenmacher: 'Fegyverkovács',
            Buendnis: 'Szövetség',
            Charakter: 'Karakter',
            Duelle: 'Párbajok',
            Einladungen: 'Városmeghívók',
            Einstellungen: 'Beállítások',
            Erfolge: 'Eredmények',
            Fertigkeiten: 'Képességek',
            Fortkaempfe: 'Erõd áttekintés',
            Freunde: 'Barátok',
            Gemischtwaren: 'Vegyesbolt',
            Haendler: 'Utazó kereskedõ',
            Handwerk: 'Mesterség',
            Inventar: 'Felszerelés',
            Kirche: 'Templom',
            Lichtspielhaus: 'Mozi',
            Logout: 'Kijelentkezés',
            Markt: 'Piac',
            Multiplayer: 'Többjátékos Játék',
            PremiumKaufen: 'Aranyrög vásárlása',
            Quests: 'Kalandok',
            QuestBarkeeper: 'Henry Walker',
            Questbuch: 'Kalandkönyv',
            QuestIndian: 'Waupee',
            QuestLady: 'Maria',
            QuestSheriff: 'John Fitzburn',
            Rangliste: 'Rangsor',
            Saloon: 'Kocsma',
            Schlafen: 'Alvás',
            Schneider: 'Szabó',
            Sheriff: 'Seriff',
            Stadt: 'Város',
            Stadtforum: 'Fórum',
            Stadthalle: 'Városháza',
            Statistiken: 'Statisztika',
            Telegramme: 'Üzenetek',
            TheWestCalc: 'TW-Calc',
            TheWestDataBase: 'TW-DB.info',
            TheWestForum: 'The West Fórum',
            TheWestWiki: 'Wiki The-West',
            UPShop: 'Union Pacific Bolt',
            Wanderzirkus: 'Utazó vásár',
          }
        },
        nl: {
          language: 'Dutch (Nederlands)',
          settings: 'Instellingen',
          changeLog: 'Changelog',
          langB: 'Taal',
          noSettings: 'U heeft geen bewaarde instellingen. Klik op de tandwielen aan de rechterkant om uw menu.',
          save: 'Besparen',
          reset: 'Reset',
          saved: 'Instellingen zijn opgeslagen.',
          addItem: 'Item toevoegen',
          moveItem: 'Houd de linkermuisknop ingedrukt terwijl u naar element om het instellingenvenster.',
          removeItem: 'Sleep hier item om het te verwijderen',
          noTown: 'U bent geen lid van een stad!',
          mask: 'Masker',
          friday13: 'Vrijdag de 13e',
          entries: {
            Abenteuer: 'Avontuur',
            Arbeiten: 'Werkzaamheden',
            Aufgaben: 'Acticiteiten',
            Auftraege: 'Taken',
            Berichte: 'Berichten',
            Bestatter: 'Doodgraver',
            Buechsenmacher: 'Geweermaker',
            Buendnis: 'Alliantie',
            Charakter: 'Karakter',
            Duelle: 'Duels',
            Einladungen: 'Stadsuitnodigingen',
            Einstellungen: 'Instellingen',
            Erfolge: 'Prestaties',
            Fertigkeiten: 'Vaardigheden',
            Fortkaempfe: 'Fortgevechten',
            Freunde: 'Vrienden',
            Gemischtwaren: 'Handelaar',
            Haendler: 'Rondreizende handelaar',
            Inventar: 'Inventaris',
            Kirche: 'Kerk',
            Lichtspielhaus: 'Cinema',
            Logout: 'Afmelden',
            Multiplayer: 'Multiplayer Games',
            PremiumKaufen: 'Nuggets kopen',
            Quests: 'Opdrachten',
            QuestBarkeeper: 'Barkeeper  Henry Walker',
            Questbuch: 'Opdrachtenboek',
            QuestIndian: 'Waupee',
            QuestLady: 'Maria Roalstad',
            QuestSheriff: 'Sheriff John Fitzburn',
            Rangliste: 'Ranglijst',
            Schlafen: 'Slapen',
            Schneider: 'Kleermaker',
            Stadt: 'Stad',
            Stadtforum: 'Stadforum',
            Stadthalle: 'Stadhuis',
            Statistiken: 'Statistieken',
            Telegramme: 'Mededelingen',
            TheWestCalc: 'TW-Calc',
            TheWestDataBase: 'TW-DB.info',
            TheWestForum: 'The West Forum',
            TheWestWiki: 'Wiki The-West',
            UPShop: 'Union Pacific winkel',
            Wanderzirkus: 'Kermis',
          }
        },
        pl: {
          language: 'Polish (polski)',
          settings: 'Ustawienia',
          changeLog: 'Lista zmian',
          langB: 'Język',
          noSettings: 'Nie masz zapisanych ustawień. Kliknij ikonkę z 2 zębatkami po prawej stronie twoje menu.',
          save: 'Zapisz',
          reset: 'Resetuj',
          saved: 'Ustawienia zostały zapisane.',
          addItem: 'Dodaj ikonkę',
          moveItem: 'Przytrzymaj klawisz myszki na przycisku i przesuń go na pasek menu.',
          removeItem: 'Przenieś tutaj aby usunąć go',
          noTown: 'Nie jesteś mieszkańcem żadnego miasta!',
          mask: 'Maska',
          entries: {
            Abenteuer: 'Przygody',
            Adventskalender: 'Kalendarz Adwentowy',
            Arbeiten: 'Prace',
            Aufgaben: 'Dzienne zadania',
            Auftraege: 'Zadania',
            Berichte: 'Raporty',
            Bestatter: 'Grabarz',
            Betrueger: 'Oszuści',
            Buechsenmacher: 'Rusznikarz',
            Buendnis: 'Sojusz',
            Charakter: 'Postać',
            Chat: 'Czat',
            Duelle: 'Pojedynki',
            Einladungen: 'Zaproszenia miejskie',
            Einstellungen: 'Ustawienia',
            Erfolge: 'Osiągniecia',
            Fertigkeiten: 'Umiejętności',
            Fortkaempfe: 'Przegląd Fortów',
            Freunde: 'Znajomi',
            Gemischtwaren: 'Wielobranżowy',
            Haendler: 'Wędrowny handlarz',
            Handwerk: 'Rzemiosło',
            Inventar: 'Ekwipunek',
            Kirche: 'Kościół',
            Lichtspielhaus: 'Nickelodeon',
            Logout: 'Wyloguj',
            Markt: 'Targ',
            Multiplayer: 'Rozgrywki Multiplayer',
            PremiumKaufen: 'Zakup bryłek',
            Quests: 'Zadania',
            QuestBarkeeper: 'Barman Henry Walker',
            Questbuch: 'Księga zlecerí',
            QuestIndian: 'Waupee',
            QuestLady: 'Maria Roalstad',
            QuestSheriff: 'Sheriff John Fitzburn',
            Rangliste: 'Ranking',
            Schlafen: 'Śpij',
            Schneider: 'Krawiec',
            Sheriff: 'Szeryf',
            Stadt: 'Miasto',
            Stadtforum: 'Forum',
            Stadthalle: 'Ratusz',
            Statistiken: 'Statystyki',
            Telegramme: 'Wiadomości',
            TheWestCalc: 'TW-Calc',
            TheWestDataBase: 'TW-DB.info',
            TheWestForum: 'Forum The West',
            TheWestWiki: 'Wiki The West',
            UPShop: 'Sklep Union Pacific',
            Wanderzirkus: 'Cyrk wędrowny',
          }
        },
        cs: {
          language: 'Czech (čeština)',
          settings: 'Nastavení',
          changeLog: 'Změny',
          langB: 'Jazyk',
          menu: 'Menu',
          fixed: 'velké',
          absolute: 'malé',
          menuPosHelp: {
            fixed: 'Menu bude umístněné v spodní části obrazovky (vždy viditelné).',
            absolute: 'Menu bude umístněné v spodní části mapy (neviditelné na malých obrazovkách).',
          },
          noSettings: 'Nemáš vytvořené menu. Klikni na ozubená kola na pravé straně pro vytvoření menu.',
          save: 'Uložit',
          reset: 'Reset',
          saved: 'Nastavení byla uložena.',
          addItem: 'Přidej položku',
          moveItem: 'Podržením levého tlačítka myši můžeš přesunout prvky do jednotlivých oken.',
          removeItem: 'Po přesunutí zde, bude položka odstraněna',
          noTown: 'Nejsi členem města!',
          entryList: 'EntryList',
          cancel: 'Zrušit',
          import: 'Import',
          example: 'Příklad',
          export: 'Export',
          exportInfo: 'Zkopírujte text do schránky a vložte ji tam, kde chcete data použít',
          couldNotSave: 'Nastavení nebylo uloženo.',
          noFair: 'Je nám líto, ale Kočovný cirkus není k dispozici. Počkej, až se příště otevře.',
          expand: 'Rozšířené menu',
          expandHelp: 'Rozšířené menu s dalším sloupcem pro položky menu. Nabízí také možnost skrýt menu',
          general: 'Všeobecné',
          entry: 'Vstup',
          blinking: 'Blikání',
          mask: 'Maska',
          friday13: 'Pátek 13teho',
          badLuck: 'Smůla!',
          badLuckText: 'Ach ne, ztratili jste všechny své peníze. Zdá se, že dnes už nemáš žádné štěstí.<br>Jdi do banky a požádej o pomoc. Možná ti mohou říct, co se stalo s tvími penězi.',
          activate: 'Aktivace',
          deactivate: 'Deaktivace',
          activateInfo: 'Skript je deaktivován. To by mohlo odstranit problémy a skript stále vyhledává aktualizace.<br>Klepnutím na tlačítko ho znovu aktivuješ.',
          deactivateInfo: 'Toto skript deaktivuje, ale bude stále hledat aktualizace',
          entries: {
            Abenteuer: 'Dobrodružství',
            Adventskalender: 'Adventní kalendář',
            Arbeiten: 'Práce',
            Aufgaben: 'Denní úkoly',
            Auftraege: 'Úkoly',
            Bank: 'Banka',
            Berichte: 'Oznámení',
            Bestatter: 'Funebrák',
            Betrueger: 'Podvodník',
            Buechsenmacher: 'Zbrojíř',
            Buendnis: 'Aliance',
            Charakter: 'Informace o charakteru',
            Duelle: 'Duely',
            Einladungen: 'Pozvánky do města',
            Einstellungen: 'Nastavení',
            Erfolge: 'Úspěchy',
            Fertigkeiten: 'Schopnosti',
            Fortkaempfe: 'Bitvy',
            Freunde: 'Přátelé',
            Gemischtwaren: 'Obchod',
            Haendler: 'Cestující obchodník',
            Handwerk: 'Řemeslo',
            Inventar: 'Inventář',
            Kirche: 'Kostel',
            Lichtspielhaus: 'Biograf',
            Logout: 'Odhlásit',
            Markt: 'Trh',
            Multiplayer: 'Multiplayerové Hry',
            Premium: 'Prémium',
            PremiumKaufen: 'Koupit Nuggety',
            Quests: 'Úkoly',
            QuestBarkeeper: 'Barman Henry Walker',
            Questbuch: 'Kniha úkolů',
            QuestIndian: 'Waupee',
            QuestLady: 'Márie Roalstad',
            QuestSheriff: 'Šerif John Fitzburn',
            Rangliste: 'Žebříček',
            Saloon: 'Salón',
            Schlafen: 'Spánek',
            Schneider: 'Krejčí',
            Sheriff: 'Šerif',
            Stadt: 'Město',
            Stadtforum: 'Městské fórum',
            Stadthalle: 'Radnice',
            Statistiken: 'Štatistiky',
            Telegramme: 'Zprávy',
            TheWestCalc: 'TW-Calc',
            TheWestDataBase: 'TW-DB.info',
            TheWestForum: 'Fórum The West',
            UPShop: 'Union Pacific Shop',
            Wanderzirkus: 'Kočovný cirkus',
          }
        },
        sk: {
          language: 'Slovak (slovenčina)',
          settings: 'Nastavenia',
          changeLog: 'Zmeny',
          langB: 'Jazyk',
          fixed: 'velké',
          absolute: 'malé',
          menuPosHelp: {
            fixed: 'Menu bude umiestnené v spodnej časti obrazovky (vždy viditeľné).',
            absolute: 'Menu bude umiestnené v spodnej časti mapy (na malých displejoch).',
          },
          noSettings: 'Nemáš vytvorené menu. Klikni na ozubené kolieska v pravom hornom rohu pre vytvorenie menu.',
          save: 'Uložiť',
          reset: 'Reset',
          saved: 'Nastavenia boli uložené.',
          addItem: 'Pridaj položku',
          moveItem: 'Drž ľavé tlačidlo myši a presuň prvky do jednotlivých okien.',
          removeItem: 'Pretiahni obrázok sem pre vymazanie',
          noTown: 'Nie si členom mesta!',
          entryList: 'EntryList',
          cancel: 'Zrušiť',
          import: 'Import',
          example: 'Príklad',
          export: 'Export',
          exportInfo: 'Skopíruj text do schránky a vlož ho tam, kde chceš data použit.',
          couldNotSave: 'Nastavení nebylo uloženo.',
          noFair: 'Je nám ľúto, ale Kočovný cirkus nie je k dispozícii. Počkaj než sa zase otvorí.',
          expand: 'Rozšírené menu',
          expandHelp: 'Rozšírené menu s ďalším stĺpcom pre položky menu. Ponúka taktiež možnosť skryť menu.',
          general: 'Všeobecné',
          entry: 'Vstup',
          blinking: 'Blikanie',
          mask: 'Maska',
          friday13: 'Piatok 13teho',
          badLuck: 'Smola!',
          badLuckText: 'Ach nie, stratil si všetky svoje peniaze. Zdá sa, že dnes už nemáš žiadne štastie.<br>Choď do banky a požiadaj o pomoc. Možno ti môžu povedať, čo sa stalo s tvojimi peniazmi.',
          activate: 'Aktivácia',
          deactivate: 'Deaktivácia',
          activateInfo: 'Skript je deaktivovaný. To by mohlo odstrániť problémy a skript stále vyhľadává aktualizácie.<br>Kliknutím na tlačítko ho znovu aktivuješ.',
          deactivateInfo: 'Toto skript deaktivuje, ale bude stále hľadať aktualizácie',
          entries: {
            Abenteuer: 'Dobrodružstvá',
            Adventskalender: 'Adventný kalendár',
            Arbeiten: 'Práca',
            Aufgaben: 'Denné zadania',
            Auftraege: 'Úlohy',
            Bank: 'Banka',
            Berichte: 'Oznámenia',
            Bestatter: 'Hrobár',
            Buechsenmacher: 'Zbrojár',
            Buendnis: 'Aliancia',
            Charakter: 'Postava',
            Duelle: 'Duely',
            Einladungen: 'Mestské pozvánky',
            Einstellungen: 'Nastavenie',
            Erfolge: 'Ocenenia',
            Fertigkeiten: 'Schopnosti',
            Fortkaempfe: 'Boje',
            Freunde: 'Priatelia',
            Gemischtwaren: 'Zmiešaný tovar',
            Haendler: 'Obchodník',
            Handwerk: 'Remeslo',
            Inventar: 'Inventár',
            Kirche: 'Kostol',
            Lichtspielhaus: 'Kino',
            Logout: 'Odhlásiť',
            Markt: 'Trh',
            Multiplayer: 'Multiplayerové hry',
            Premium: 'Prémium',
            PremiumKaufen: 'Kúpia nuggetov',
            Quests: 'Úlohy',
            QuestBarkeeper: 'Barman Henry Walker',
            Questbuch: 'Kniha úloh',
            QuestIndian: 'Waupee',
            QuestLady: 'Mária Roalstad',
            QuestSheriff: 'Šerif John Fitzburn',
            Rangliste: 'Rebríček',
            Saloon: 'Salón',
            Schlafen: 'Spánok',
            Schneider: 'Krajčír',
            Sheriff: 'Šerif',
            Stadt: 'Mesto',
            Stadtforum: 'Mestské fórum',
            Stadthalle: 'Radnica',
            Statistiken: 'Štatistika',
            Telegramme: 'Správy',
            TheWestCalc: 'TW-Calc',
            TheWestDataBase: 'TW-DB.info',
            TheWestForum: 'Fórum The West',
            TheWestWiki: 'Wiki The-West',
            UPShop: 'Obchod Union Pacific',
            Wanderzirkus: 'Kočovný cirkus',
          }
        },
        el: {
          language: 'Greek (ελληνικά)',
          settings: 'Ρυθμίσεις',
          changeLog: 'Changelog',
          langB: 'Γλώσσα',
          menu: 'Μενού',
          fixed: 'σταθερό',
          absolute: 'πλήρες',
          menuPosHelp: {
            fixed: 'το μενού θα βρίσκεται στο κάτω μέρος της οθόνης (πάντα ορατό).',
            absolute: 'το μενού θα βρίσκεται στο κάτω μέρος του χάρτη (κρυμμένο σε μικρές οθόνες).',
          },
          noSettings: 'Δεν έχετε αποθηκεύσει καμία ρύθμιση. Κάντε κλικ στα γρανάζια στη δεξιά πλευρά για να ρυθμίσετε το μενού σας.',
          save: 'Αποθήκευση',
          reset: 'Επαναφορά',
          saved: 'Οι ρυθμίσεις έχουν αποθηκευτεί.',
          addItem: 'Προσθέστε αντικείμενο',
          moveItem: 'Κρατήστε πατημένο το αριστερό πλήκτρο του ποντικιού ενώ μετακινείτε ένα στοιχείο στο παράθυρο ρυθμίσεων.',
          removeItem: 'Σύρετε το στοιχείο εδώ για να το αφαιρέσετε',
          noTown: 'Δεν είσαι μέλος μιας πόλης!',
          entryList: 'Λίστα εισαγωγής',
          cancel: 'Ακύρωση',
          import: 'Εισαγωγή',
          example: 'Παράδειγμα',
          export: 'Εξαγωγή ',
          exportInfo: 'Αντιγράψτε το κείμενο στο πρόχειρο σας και επικολλήστε το όπου θέλετε να χρησιμοποιήσετε τα δεδομένα',
          couldNotSave: 'Οι ρυθμίσεις δεν έχουν αποθηκευτεί.',
          noFair: 'Λυπούμαστε, αλλά η έκθεση ταξιδιού δεν είναι διαθέσιμη. Περιμένετε να ανοίξει την επόμενη φορά.',
          expand: 'Διευρυμένο μενού',
          expandHelp: 'Διευρυμένο μενού με μια ακόμη στήλη για καταχωρήσεις μενού. Επίσης προσφέρει τη δυνατότητα απόκρυψης του μενού',
          general: 'Γενικά',
          entry: 'Kαταχώριση',
          blinking: 'Αναβοσβήσιμο',
          mask: 'Mask',
          friday13: 'Παρασκευή και 13',
          badLuck: 'Κακή τύχη!',
          badLuckText: 'Ω, όχι, χάσατε όλα τα χρήματά σας. Φαίνεται ότι δεν έχετε τύχη σήμερα.<br>Πηγαίνετε στην τράπεζα και ζητήστε βοήθεια. Ίσως να μπορούν να σας πουν τι συνέβη με τα χρήματά σας.',
          activate: 'Ενεργοποίηση ',
          deactivate: 'Απενεργοποίηση',
          activateInfo: 'Tο script είναι απενεργοποιημένο. Αυτό θα μπορούσε να καταργήσει τα λάθη και το script να εξακολουθεί να ψάχνει για ενημερώσεις. <br> Κάντε κλικ στο κουμπί για να το επανενεργοποιήσετε.',
          deactivateInfo: 'Αυτό θα απενεργοποιήσει το script, αλλά εξακολουθεί να ψάχνει για ενημερώσεις',
          entries: {
            Abenteuer: 'Περιπέτειες',
            Adventskalender: 'Εορταστικό ημερολόγιο',
            Arbeiten: 'Δουλειά',
            Aufgaben: 'Καθημερινές εργασίες',
            Auftraege: 'Εργασίες',
            Bank: 'Τράπεζα',
            Berichte: 'Αναφορές',
            Bestatter: 'Νεκροθάφτης',
            Betrueger: 'Frauds',
            Buechsenmacher: 'Οπλοποιός',
            Buendnis: 'Συμμαχία',
            Charakter: 'Χαρακτήρας',
            Duelle: 'Μονομαχίες',
            Einladungen: 'Προσκλήσεις στην πόλη',
            Einstellungen: 'Ρυθμίσεις',
            Erfolge: 'Επιτεύγματα',
            Fertigkeiten: 'Ικανότητες',
            Fortkaempfe: 'Μάχες Οχυρών',
            Freunde: 'Φίλοι',
            Gemischtwaren: 'Μπακάλικο',
            Haendler: 'Έμπορος',
            Handwerk: 'Δεξιότητες',
            Hotel: 'Ξενοδοχείο',
            Inventar: 'Αποθήκη',
            Kirche: 'Εκκλησία',
            Lichtspielhaus: 'Σινεμά',
            Logout: 'Αποσύνδεση',
            Markt: 'Αγορά',
            Multiplayer: 'Multiplayer Παιχνίδια',
            PremiumKaufen: 'Αγόρασε nuggets',
            Quests: 'Αποστολές',
            QuestBarkeeper: 'Μπάρμαν Henry Walker',
            Questbuch: 'Βιβλίο Αποστολών',
            QuestIndian: 'Waupee',
            QuestLady: 'Maya Roalstad',
            QuestSheriff: 'Σερίφης John Fitzburn',
            Rangliste: 'Κατάταξη',
            Saloon: 'Σαλούν',
            Schlafen: 'Ύπνος',
            Schneider: 'Ράφτης',
            Sheriff: 'Σερίφης',
            Stadt: 'Πόλη',
            Stadtforum: 'Φόρουμ πόλης',
            Stadthalle: 'Δημαρχείο',
            Statistiken: 'Στατιστικά',
            Telegramme: 'Μηνύματα',
            TheWestCalc: 'TW-Calc',
            TheWestDataBase: 'TW-DB.info',
            TheWestForum: 'Φόρουμ The West',
            UPShop: 'Κατάστημα Union Pacific',
            Wanderzirkus: 'Λούνα Παρκ',
          }
        },
      },
      updateLang: function () {
        var lg = TWM.langs;
        TWM.lang = localStorage.getItem('scriptsLang') || Game.locale.substr(0, 2);
        TWM.enLang = $.extend({}, lg.en);
        for (var l in lg[TWM.lang])
          TWM.enLang[l] = lg[TWM.lang][l];
        Mlang = TWM.enLang;
      },
      //Initialize TWM
      init: function () {
        TWM.updateLang();
        TWM.Data = JSON.parse(localStorage.getItem('Menu_save')) || {};
        if (!TWM.Data.oldData) {
          TWM.Data.oldData = 'done';
          for (var k in localStorage) {
            if (typeof k === 'string' && k.indexOf('TWM_') === 0) {
              if (k.indexOf('TWM_BLINKING') == -1)
                TWM.Data[k.substring(4)] = localStorage[k];
              localStorage.removeItem(k);
            }
          }
          localStorage.setItem('Menu_save', JSON.stringify(TWM.Data));
        }
        //Initialize objects
        this.initStyleSheet();
        this.settings.init();
        this.entryList.init();
        this.menu.init();
        //friday the 13th
        var d = new Date();
        if (d.getDate() == 13 && d.getDay() == 5) {
          Inventory.showLastItems = function () {
            $('#overlay_inv').show();
            var lastIds = Bag.getInventoryIds();
            for (var i = 1; i < lastIds.length; ++i) {
              var itm = Bag.getItemByInvId(lastIds[i]);
              if (itm)
                Inventory.addItemDivToInv(itm);
            }
            var item = Bag.createBagItem({
              item_id: 399000,
              count: 1,
              inv_id: 0,
            });
            var ob = item.obj;
            ob.image = '';
            ob.name = Mlang.mask;
            ob.price = 666;
            ob.sell_price = 13;
            ob.description = Mlang.friday13;
            ob.type = 'head';
            ob.bonus.skills = {
              appearance: 60,
              tough: 60
            };
            ob.bonus.attributes = {
              charisma: 8,
              dexterity: 8,
              flexibility: 8,
              strength: 8
            };
            Inventory.addItemDivToInv(item);
            item.tooltip.popup.text = item.tooltip.popup.text.replace(Game.cdnURL + '/', TWM.images.mask);
            var items = $('.tw_item.item_inventory_img.dnd_draggable');
            var img = items.get(items.size() - 1);
            $(img).attr('src', TWM.images.mask).off('click').click(function () {
              var dialog = new west.gui.Dialog(Mlang.badLuck, '<div style="max-width:400px;"><img src="' + TWM.images.friday13 + '" style="float:left; margin:0 16px -16px 0;">' + Mlang.badLuckText + '</div>').addButton('ok', function () {
                dialog.hide();
              }).show();
              Character.setMoney(0);
              Character.setDeposit(0);
            });
          };
          window.setTimeout(function () {
            Character.setToRead('inventory', true);
          }, 1000);
        }
      },
      //get Settings
      get: function (key, val) {
        return (TWM.Data.hasOwnProperty(key) ? TWM.Data[key] : val);
      },
      //set Settings
      set: function (key, val) {
        TWM.Data[key] = val;
        localStorage.setItem('Menu_save', JSON.stringify(TWM.Data));
      },
      initStyleSheet: function () {
        var css = $('<style id="TWMstyles"></style>');
        $(document.head || document.body || document.documentElement).append(css);
      },
      addStyle: function (css) {
        var styles = $('#TWMstyles');
        styles.html(styles.html() + '\n' + css);
      },
      showMessage: function (message, icon) {
        new UserMessage(message, icon).show();
      },
      //encoded images: base64
      images: {
        settingsHeader: 'data:image/png;base64,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',
        btnBG: 'background:url(images/interface/dock_icons.png) 1px 0;',
        btnBG_hover: 'background-position: -51px 0;',
        btnBG_highlight: 'background:url(images/interface/dock_icons.png) -155px -104px;',
        btnBG_disabled: 'background-position:-253px 0 !important;',
        right_menu: 'data:image/png;base64,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',
        right_menu_hover: 'data:image/png;base64,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',
        addEntry: 'data:image/png;base64,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',
        bucket: 'images/items/yield/bucket.png',
        bucket_hover: 'images/items/yield/bucket_full.png',
        info: 'data:image/png;base64,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',
        mask: 'data:image/png;base64,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',
        friday13: 'data:image/png;base64,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',
        menu: {
          Abenteuer: 'images/window/shop/shop_categories_sprite.png" style="margin:-62px 0 0 -235px;',
          Adventskalender: 'images/items/yield/adventcal.png" style="width:48px;margin:3px;',
          Arbeiten: 'images/interface/dock_icons.png" style="margin:-52px 0 0 -260px;',
          Aufgaben: 'images/items/yield/itemlist.png" style="width:48px;margin:3px;',
          Auftraege: 'data:image/png;base64,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',
          Bank: 'images/buildings/bank3.png" style="width:42px;margin:12px 6px;',
          Berichte: 'images/items/yield/docreport.png" style="width:48px;margin:3px;',
          Bestatter: 'images/buildings/mortician1.png" style="width:42px;margin:11px 4px;',
          Betrueger: 'data:image/png;base64,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',
          Buechsenmacher: 'images/buildings/gunsmith3.png" style="width:42px;margin:8px 5px;',
          Buendnis: 'images/items/yield/flag_north.png" style="width:48px;margin:3px;',
          Chat: 'data:image/png;base64,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',
          Duelle: 'images/interface/dock_icons.png" style="margin:-52px;',
          Einladungen: 'images/items/yield/item_51647.png" style="width:46px;margin:2px 4px;',
          Erfolge: 'data:image/png;base64,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',
          Facebook: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuOWwzfk4AAANVSURBVGhD7ZnbS1RRFMZN6CHoL+hv6CWCmHRGK3qqhx5Sm/FGoVkRRlGIXQe70EPUQ9ocx0Yr0HS8hQRTgUoSoRFZ5kOimZccMzV1EC0dz6z2Go/n4iwjphr2jvPBD+Fzzzrfd/aZrczEAcB/BWmKDGmKDGmKDGmKDGmKDGkivIvKjJAmwruozAhpIryLyoyQJhIhpzPekuLdkJxasjGWbM1zr1cSGERlRkgTMYiVSbK7tljt0nWrQyq32V0VsSDRIbkTHFIGFlOSqKIyI6SJ6IU7o5QJ2BzSIvsZjAV4LVbqzfY0z2YliioqM0KaiF54h9gFyvECtvRSiCkOyZ+Y5rKwGOuW0yyLyoyQJqIXFsJHIHzXqIv+S0QptPugB9JPV8ORS41w1PkIci80QFaBF/YcvgdJGbq1IhQ6VFgHT9p6oOfTOAz5p2F4dBoGRqagd3ASrkqtsDOrTFvPcyHclRueNvg2PQeyHGKXiZRU3QG7su9qr+O1UHKmG4pKmmFyao6NX1vCFML3Rkv7R1iSZTZ+bQlT6MDJh9A7MMFGa/q+EITWjn64VfECrrH3DpJdUBveTfW1vBbCg2BkbIaN1vSycxBST1SFDwEsgRhOOITXQjnn62H0a4CN1lT/rNv4eFHwWigXC40bC9X63huPaAqzEGEiekVTaH9+JZSyE6uyqTOM73kPzM4tsNGaPvSPQ9Xjd+oaJPNMDSTpZ/FSKO9iIzsEArAYXAoTXIo8ruVQCILK75H5H4uQf7nJOIunQl8mZtmo39ck+w8CH03DLJEL9Q1OgONUtXGWyIVed4/AvmMPjLN4KbQ37z4U3nwKRcXNYcq8r2AqMM9Ga2p/OwxX7rSoa44XNUWeerwUWo35d2gFsxBhInqZhQjMQiuYhQgT0cssRMBdIfzgnA2P+qPgPyg0ZEu5vY3F+HuF8CsN/BYAPzjHOxYNOWfr/P6xGb8syypeX5d/R6abXK8wZLW7ShPsxZuUKKqozAhpIquFu4TfAuD2R0PuuQbL57GAJRQKqdT4uizJGfR6BHcGyzidznglhioqM0KayC+EWx8VbK4BdvWINQSkMCMFaSK8i8qMkCbCu6jMCGkivIvKjJCmyJCmyJCmyJCmyJCmyJCmuEDcT+aw6GsVl6wXAAAAAElFTkSuQmCC',
          Fertigkeiten: 'data:image/png;base64,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',
          Fortkaempfe: 'data:image/png;base64,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',
          Freunde: 'images/interface/dock_icons.png" style="margin:-52px 0 0 -156px;',
          Gemischtwaren: 'images/buildings/general3.png" style="width:42px;margin:8px 5px;',
          GreasyFork: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNvyMY98AAAueSURBVGhD3Zl7sJVzF8fVOV1Ip1SUowtyCblEKjGKQi6l+8UM0pWovJoTSkS5zLiECJMKoUSuQ2OQomjyNlOkeOVWqqGaIzRTp9Ne7/ez2s9599lnncrx13nXzHeevdfzPGuv9fut628fZGb/VwiZlRkhszIjZFZmhMzKjJBZmREyQUTiVwHpr5mUU79+/dqHH35485ycnK76PlF4PTc39+tatWptq1279m5di/R90yGHHLK0SpUq0/XsiHr16rVr1apVvp6tKURyy6VMXTMRMsEBUo7Q9MQTT+zdo0ePGX369Fmfn59fJB4C7Oyzz7bHHnvMxo8fbw888ICdc845NnToUKtZs6aNHTs21bp16x1du3b9Qu+MP+aYYzrrnUZCVWG/FOkMQiY4AGomDKpevfor7du333b77benpkyZYmeccYYbAzp37mwff/yxyWCbPXu23XDDDTZp0iTTbtmLL75o3bt3t9dee83OPffc4muuuWaTdm6W3usm5An7pEhnEDLBPogVbCf3mTt8+PDCiy66KHXhhRfarbfearfddpu1aNGilEEzZ840KWr33nuvjRw50u6//35/5o033nCD3nrrLevdu7dNnz6d51J67zthgtBEKJcinUHIBOVQNaGPsFQG7WaVly1bZn379rUzzzzTFA9Wt27dEoMw9Omnn3aD7r77bpNL2kMPPWRPPPGEv9etWzffoZ49e/pzvXr1so4dO2LUFmGa0EIIYyvSGYRMEBDGDKlateoaKViMkqeccoq9++679uGHH+I2pnslxoA6derYscce65+bNGlihx12mB199NH+3umnn25KCu6OXHmO3TvqqKOS97cLs4XQqEhnEDJBFuFmfRXMawsKCvZcccUVpmzmK3/qqafaBx984IYpyJ2nZyuEBg0aZL+/Q5gpNBVKUaQzCJkgi9oIS5QAip966in76aefTFnNdwTDOnTo4C5EPLRs2fIfGRUAo8YLtYUSinQGIRNkUDMpOEfX3YIdccQR9vbbb9vWrVs9mOEpnjzAV69e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',
          Haendler: 'data:image/png;base64,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',
          Handwerk: 'images/interface/dock_icons.png" style="margin:-52px 0 0;',
          Hotel: 'images/buildings/hotel3.png" style="width:49px;margin:7px 2px;',
          Inventar: 'images/interface/dock_icons.png" style="margin:-52px 0 0 -208px;',
          Kirche: 'images/buildings/church1.png" style="width:48px;margin:7px 3px;',
          Lichtspielhaus: 'images/items/yield/clapperboard_video_contest_2016.png" style="width:46px;margin:2px 3px;',
          Logout: 'data:image/png;base64,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',
          Markt: 'images/items/yield/stolen_goods.png" style="width:48px;margin:3px;',
          Multiplayer: 'images/interface/dock_icons.png" style="margin:-52px 0 0 -104px;',
          Premium: 'images/items/yield/365days_vip_bonus.png" style="width:48px;margin:3px;',
          PremiumKaufen: 'images/items/yield/nugget_bag.png" style="width:48px;margin:3px;',
          QuakeNetWebchat: 'data:image/png;base64,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',
          Quests: 'images/items/yield/book_plain.png" style="width:48px;margin:3px;',
          QuestBarkeeper: 'data:image/png;base64,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',
          Questbuch: 'images/items/yield/notebook.png" style="width:48px;margin:3px;',
          QuestIndian: 'data:image/png;base64,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',
          QuestLady: 'data:image/png;base64,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',
          QuestSheriff: 'data:image/png;base64,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',
          Rangliste: 'data:image/png;base64,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',
          Saloon: 'images/buildings/saloon1.png" style="width:42px;margin:10px 5px;',
          Schlafen: 'images/items/head/sleep_cap.png" style="width:48px;margin:3px;',
          Schneider: 'images/buildings/tailor3.png" style="width:42px;margin:8px 5px;',
          Sheriff: 'images/items/yield/mission_star.png" style="width:48px;margin:3px;',
          Stadt: 'images/interface/dock_icons.png" style="margin:-104px 0 0 -210px;',
          Stadtforum: 'images/items/yield/ink.png" style="width:48px;margin:3px;',
          Stadthalle: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNvyMY98AAAt1SURBVGhD3VhrcJTlFdbptNMpCLlv9r7f3rOb3SR7y2azu9ndXDf3kHsQTEKxhGtUEHACIhJStAqKzYDgBRgq0jIdKYO22oKtlmHEkVZGR2codfzRmfafY3/YAqfPeVkcGl/lZn9sz8yZ/fZkv93zfM85zzlv7iCi/yuXBrPZpcFsdmkwm10azGaXBrPZpcFsdmkwm10azGaXBrPZpcFsdnnwNu3ChRPff/bpqdSy0b4jTckw9bbXUlc6+toDSxfs2771wfGX9z+dev/dkyWZj9+ySXOXBm/RTp08VrJx3fKHB+c1fa5o8qg4bxbpiuaQosklmy6PnPq5VGrKI6+lkGLlCi3sqfts9djQRxP3je7ev+vxlW//7pe1R4/u/sGZM2e+m/nKbzRp7tLgTdi5cydmP/XYho6xkZ7fR3xO0hTcJdyizSOfQ03hUj1Ve3UAYKCkzwg3UKLCQNUeDYVdxeSzFZJXyaNSYw75HcXUUlNGQx2JTx9YMnB63crhR16Y/vHKN9844vvkw7c0mZ/80qS5S4PXMXzmztePHgiuv3/x9u7W1L8MqhxSgQ1j8Vxym1UU9hgoUmaipN9MLRErdcTscBt1xqxwvMZt1BG10rwaO3XF8feohZqrFEpW6CjsVguQDkMe2fW55ICXWwqouabi4tjCzs9+OJjev/WhsclfHXp2/sy82b8SEMGvsfMf/TG0e+fkqh8Nd3/gcyukLbxLuFWfTyGXTgBgb47YqLXaRvUhCzWGGRAAwHsSduqvdQCEnZrCDMJC7VEbtVVbEbPh2kotiLVVm3GNe0MmipXpqAog/fZCKlXyyWXMpbCziMYWdnwszV0avMZeP/YL8xNTD20bvbvz0ypfCRmKc0hbMJv0YMWpqCjkMVHKr1ACJVUDT5TrKerVA5QVCduoodKKBG3Ul3LQUEMJDdQ5AcpJ3cwOvBVgmirNVBdQxCsDbI1YKB02470CRi34rJXaATJZrqUql5pKDLk0/eTDe6W5S4MZO3n8UNvYSO+lYKmZfC4TOUzFZNEVUMCFpMsMlPLpAUBLca+Goh41SkZLbREjxXDtMRcAoJ7mJRzUBwC9KScN1pfQIAAN1TMoB/Um7QBqB3NcjhZRni1V/CD42oyStApW2yIK1fp0KMUiKjHmU6RUS2++dnhcmrs0eI2dOHqwoDbsogqbigJONUXQHwmfmSIuFaUqNNRRbaS7G6xwG/UmFOpPWagrZqKaMi2VW4vQ+Grx1LlfepIOGgAQZolfe5LMHMoQ7PF7ZqwT5chAG0MKNYOlFEQkUqohD4TDY86nyhI11YWstGfPpEqauzR4jeH9nRMr+s+3Vhmpzq+nZJkatBdTQ0BHCxhIvZVGAGb5oh5aMdBE99Z6aaDFT+1gqj6gF4AYWAxlWFNuFKXE5deDpHsB8ApjJYIxBtqXeWV2GIzfoYLk5+KBFglg7C3xUvrzqTduDRDb1PrF7wzWMv1WGk7baajOSn1JM400O2hhoxVuo2WtQbp39TJaP3EfTT66ltJeNWrfDFA6PNVigCokn10FudZRQ9AsREMIQtRO3SgrFopulF4vGGuB4sVQxgzCqs3J3If+cWuE9zVWfvHBB6fzpblLgzNs8+qRyYEUGhcM9dSYrpQYmBkFIGZJgALIlV1ReuT+RbRuXoJaw3oBvDdhQZObKARQLMVVqH9mKw2VY7FgGRfyDW+BGNRWoC+hbKxoTvQLg6kEy07cyw+GGZ/fHvsr5yXNXRqcYS/s3DzZD0bsurlk0cyliFtF8wGI2eqKmqgT3p+yErM4v9Yi/jaAXhrA+86YImS4Fg/Di3kSchZDQLRocgPK1giwZlF+rWCF3ychJBXWAirDNhFEvwQwbD1KATaOuyiIe4NOFa0Y7rg9QIde3B4fSClibeES4B8USSPhqAc/iHhlCUQCStQuRMJGg2D0SplahLeBJS47FpOADc2NxPgefh8tVVMcm0MNmCkDaD9YYdC8OTA7blM+GbBCBQAogJ5atajnbc5Lmrs0OMM++tNbsaE6G4DkA9BczIE8NDP3kRXloRasOU1F8EIx9Pz2IgiHSswNLlOhfHFFDEi+7sZ1cyXmllcLQEUAWEBhgHPjwXCJMRjBjAXfg3ucmDt6AGKBYIFZvKB9N+clzV0anGGffPyOZUlf9eWgo5DMSJ4B9KDh26M87DTivd1YSDY9EgMgBXscA3ShB/xYY1gculB6rFDcV8NNdrqnCSyiPPsg9VyyiTKNKKcwmp7FQFs4h8oxKvgeG6rCoJoj4sFSEz03/dg45yXNXRqU2Pho22UenjYwpEc9N4eNmOTYEnxabNHYHrACGVRzKYbyMalzyCEA4olnAPUmzCgpDXoL+13YAKbMQlhYYEZbHChVE1UjeVYxN3qGF1xmid+biudgBqGn3EbatXNycyYlee7S4Aw7e/bsrMXz2/7GT8iHcuJeqEE5pSuNYrj60FNceqxAvF2bsKSaNViNWJnA2Lw4i4ZFsNmNa4UBG/LFIsrlN5x2CCWMIHneAvg+HR4QM8bqWAowoVIj/fSJjZOZlIRJc5cGM3b48OHvHMFh7L5FHe+G3Vpsv3kYcjli0PFqw6tOHPOmxJAjmjuCBANuE55sEVXjPQMP4bqnRhFziz/LgJhBC85HLqUIM8kAlngzMF55IPgO/n7e3rkXWRi8Ns3lJ6fWbsmk9aVJc5cGYb85fiC8afXi010JL0rLiuZGD3ggqWhang9W/KhQJJSUWT0HLOGJOwspgCRYiVi5GCQ3OwNieWe57wEg7gc+9DkMBYLlQQhOU8ggwIRdGjA4RzAkhrFTT49Prv8KGDZp7rLgM9vWvtjX6L/UHHFgzeenB0BBDD0cDWp9CsWxmFaCMa51fpqGotmij8rMeeQHMD9UqxrJh+xYZLH2t1QZxCoUQvm14pqfvjp/tuixOsyezhh2Nj4LAQyXGJ+DuLzLHVqa2rRmKpP/V0yWuzT42+MvNWxdt/jg0vmNqO0rG3ALzjiNYKo+wKs+bw18ZDCKmhdlgUHozZxX2MuwSHpMueTFaxJ9xkLAst8Y1JEmfxZEZLZgOVGuwwFPET3JiyezK3rVqaNtj66RMnPVZLnLgxm7cOG9nL07NixZu7T3/aF0QOxeDC6NQxuXYQOApXyQXD4LleGojT2NZZfXfD5Wc2/Z0XM+sBSHwjnAIm/hfFhzGbkfc8UGwWCjGKw8ON0KHoxVTVsmVn0tM1dNmrs0KLE/nHgl/PiG5dOrRtov8alSnFuwj6UrLWLZTFbgyADGuBz5gMc7Gw9JLh+eUw4MRz4Ycl8EoF48MHlxTWPAMmth9BuXMM+vjQ8u+y81+zqT5i4NfoOdPfvrWfumJ4fWLRt8u78pdJnBcVkyKD51NobMYA4HMr9RMMezhfuCgbBKWjAk2ZkhPoawlHNJ8t85PjzU+Y/MT13XpLlLgzdo751+1b1z65pt44s6P2+LOsEaM2cRB7P6gInqfHwmMolFNIktOu7l/w+gJKGEvJ/xP0D4lUuQx0HAa7v085f33JP5+uuaNHdp8Cbt3Llz33tl/zNNE6sWvrqgrfpiY1CBDCsoJzOlwdgVUDyEDeLoEEe/iZkDhnjWeCAm8YDj0sHndoxkvvKGTJq7NHgb9uF7J0y7fjKxYXxR19/bYy5Rgk1wFg/usSReqzHPYui1JACySHQmPBd/9vyTN8zMVZPmLg1+C8ZbxisHpsNb1t17eLgr8UVj0CT+T5CsuCocOgDUU0eNm/Y+tXk0c9tNmTR3afBbtvPnT6n2TW8dX7Ok/y8d2DwYFHtb1PXvPTs23VSZXWvS3KXB/5Hhu+88eeylkqmJ5c+PDTX+c8fWB28ZDNvMvNmlwWx2aTCbXRrMZpcGs9mlwWx2aTCbXRrMZpcGs9mlwWx2aTCbXRrMXqc7/gNW7nmdWX7lWQAAAABJRU5ErkJggg==',
          Statistiken: 'data:image/png;base64,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',
          Telegramme: 'images/interface/dock_icons.png" style="margin:-104px 0 0 -257px;',
          TheWestCalc: 'data:image/png;base64,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',
          TheWestDataBase: 'data:image/png;base64,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',
          TheWestDevBlog: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuNvyMY98AAASqSURBVGhD3ZhdaFxVFIUbFdGCCiLaFEWrFWm0SSaZnxC1eVAEW6kIjT9PoiURpWnVKlRBKlbQp1pKq/ZBxCKoAcGCb0r0QbA++IsPUqSCtdaXtlCLYtJ2/NZ13+vNZE/mDLmDni5YnH3W3ufcvWbO3Lkzi+r1+llFV4yZrhgzXTFmumLMdMWY6Yox0xVjpivGTFeMma4YM/8NOoOugYGBlRZnGBwcnEQ/Ar+E4yYvCB03RKNraPwbWIfrTZaZxeT+NF1811ILQkcNjY6Onkujx3NNH8PEELwHvpTTxUlblqBcLo9UKpUbbRqMjhoSaPT9hsZdYvAo3I6JJczXE8/AExhba1sFoeOGaGpbrulpOAX17mwQFcNPlLOaPxjPKLb5DKaute1aolBDNHAJDeyDY0NDQxcyPoN2mlFGtsNuK50D5ah9RbWpGZH5R1YShEINcfHXc80knx20n0ulUtlKWoI1VXjI1k6zdrmlglCYIS5+HU2cViM5Hu7r67vGSoKhI8Z+R2yPCZODUJghcA4Xf5JG9JlISGMVy7UN3eXYTy/QcfYa0M2B+BFSXf9U+JjXEJsMs9fjTbgpva1Sd4OTz0gj61SXzoeHhy/SXOjt7b3caiZGRkbOMzkB+lvo+Xdcx3DQ0i7mNcTi7A7VhCep6eac3+fkMlIzpf2IkyPJC3BVcgFALv3c7TEpA7mVlsvv9YKlXQQZouHbaKKUJ7ln7QJ35AxNNNaJ6Qeb/CxD6CtYfwoeRb9MWgO60A9oTUpqd1rORZAhHQuTMqA/YBfIG1ptaRfkZxli7T7b47GkwAG5vVYzxXizyU1RtKGfmH/XwOyhk3xmiDWrbP3XzG9inGWK3G6N/f39fcTrqL86SbRAoYaIDzJ+myfamC3JDKk59P02v0Vk/gXcTPwEYzf8UWswqxvOZpH4ft04iMc1V22tVrsi2dxQqCEYdORY85TVv226DH0Gx4l3M74IE0OM76A9rxz8gfhuxk81J97DuFV1KYIM8crcTtyIOTcF4o1JpgEcm+u1HzWJIain7hMweRRiLkNvKOZaa4lfhokhcpM6korR9Mx3L3zVcqPE2xSnCDI0D3+npu3btmlPJxcBzGXoe6jnPT0LPod2gHGM8U3GvZY7qBcXTUdZ8w9huCEWz/vFipEVVtfWFyvc2NPTc740gQfZS9HWiOx1px5s2Xs5cUU51q+2XEn1qmH+IPouxnBD7UA/5thcH97s0YcLVi3dNjBUZv0W9nnUpAwY2kruc3L63N1qcoLCDOkVZfNTXCh/1H6tVqvLrCQYttdvts8Gk4NQmCGBJl7LGTpm4y86OlbSEuxRY81hW/uXzFkqCIUa4t24mIY+gGN8X1xAQ1tg9gOP5pZa6Ryw9kpqd1A3Y2ZSfmwlQSjUkAcazO6UxHpua/YTPD2uJ2H+J/g07/B/8xPcA0219SeJvsR5Jx+SEajvqrtsqyB01FCTv7FqsOXfWJha9b/8G4vG9f3ylZrm6Dxsst65xj8a37PUgtBxQ4YuHn96LM6Aic7/FXy20BVjpivGTFeMma4YM10xZrpizHTFmOmKMdMVY6YrxkxXjJmuGC/ri/4GT8VvQYqWPr0AAAAASUVORK5CYII=',
          TheWestForum: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAYAAADFeBvrAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC42/Ixj3wAABS1JREFUaEPd18+LVnUUx3H/hmobEQgGIYhJRWqCxGhmaoxDoQ0JhU5tJokIHQL7MYW5CAcscFEUYjAFFcRsAlsEgQS1sxYVtOs/aPltXt84w/VynueZ+zwzwW3xYWbO/fE97+/nnPO9s6WU8r9SGuyz0mCflQb7rDTYZ6XBPisN9llpsM9Kg31WGuyz0uBGaWV5qXxw+WK5cum1srjwUv3p7+tX3169nD8zqdLgJAqIVxYWysyzJ8vBJ46Vx/burJo6eKAcOfp4OXXqRJmff7ECur/9jkmUBsdRgDx35nTZ+cCD5d577i7337e1gsxMbV/T3l3banznju0VFtyFN85vGFga7ColBGTrth0V5MTM4XL94sly87NXy2/fnCu/fHn2Xy2fKT9++kL56r2nyuvP766w4IF53oa0391VabCLJHFkerrcdecd5fjhfeXXlTfLXz8sVf15490KRL9/PV+B6I/PZ6t+/uh4eX9+XwV7ZM+jdSO41V6ji9LgegVGImA+vDBbfvruk9rwnAEWMOFO6Na1pysMF4ljNsO7uDUJVBpcj8BocjAg/r51rTa5njAQvliaq2DNcguYb5dm6gYYDKdnD5WVS4fK91eO1d/37J+q7x23/NLgKGlgEwwMCDDKiysSfXnumdoTRjUwfQPm5tXp6ghg1wEoOUAccz2gTMNxBkUaHCWJan6LR68EEIEIMC64399+AjEQgCy/dWDNHUDci/Lb/fCu+nx77VFKg8OkvCwIKAZAEyb6hivcCLdIOQL5+Pz+NRCugAmBeufs0bWzq+shnAaHyS47R5rutGH0DpfCEVNQX/idYxLmThsmgPSYiees8o52DsOUBofJLnNHwmACIkAkKxk9FiBRYpz1t2tkUwaBeY8zyrvaOQxTGhwkA0AZOO1NrgBxxgAEK1FNDwZAs1dIokYzp8I9sXb56blxyi4NDhL7NatPmAAB1oQ5t7hYkzSpYopF00tY8lxy3b1NKMDuoRgOym5TgSwwN/PQGoxxrPljxx2OJEnlkgEBB6Sk/B7nESdvXH6y3g/I8/q1y5mUBgfJwrcBrcKYZpJUZrHjkrS7ekeSAUT+9nyzPOM58FwC1QRS6u1cBikNDlLTId9igCQoMQnqDQei68Z1ADV7w8i2Aa651zMS97znYqR77j8Bih4yXkFJzoKuaWBJSZZcs9tNoBgM5F7vAq+smkPEUNh0IB+NGhqUMgIk8ZhGkpOQXVYy0Q8BQ+BAuYc8731gTE9/iwPSi65t2lAgu6bsLNoGIvFwpelMwBBI9wDjkqTj+QDiOHeUZTuHYUqDwxSTTCKALN4EEpdoGyaAwIS4Gc9xh8OAlKN1HOBdv+fS4DCpZ40MSuISk0jscpSdeBum6Y6NAJ8BccdY79o/lAZHyZkRLkkSgDKM5CQl6UEwNqJOx1WAgCHv4w5X/Gtinfbao5QGR8muaWJQEoheCHfCuVFATZea7nDGBnV1h9LgeuSQNfEooEJZuTVhmkA2AEj0DjjueH97zfUoDa5XSkOt6ynJRJk5o9YLFFBxxo1baqE02EXGuEQ4ZVd91wEAFWBZuQWQsopPKjC+GNprdFEa7CpOgeJWfGw6GH2F+2ct5LAF7Br5juMuEH3TdURnSoPjyE5zyU4bFhIFJ8m2fIm7xzlDBsw4AyBTGpxEeiHK0K6TpONnyHX3ub/9jkmUBjdKvsF8dNr9ttr3bpTSYJ+VBvusNNhnpcE+Kw32WWmwz0qDfVYa7LPSYJ+VBvusNNhflS3/ANP3lk5NPjBgAAAAAElFTkSuQmCC',
          TheWestWiki: 'data:image/png;base64,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',
          TWTimes: 'images/items/yield/newspaper.png" style="width:48px;margin:3px;',
          UPShop: ' data:image/png;base64,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',
          Wanderzirkus: 'data:image/png;base64,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',
          WestForts: 'data:image/png;base64,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'
        }
      },
      questies: {
        allguys: [
          'barkeeper', 'indian', 'lady', 'sheriff', 'paper', 'mugridge', 'anna', 'nathan', 'william', 'kiki_01', 'mimi_01', 'lili_01', 'kiki_02', 'mimi_02', 'lili_02', 'mimi_03', 'lili_03',
        ],
        oldguys: [
          'barkeeper', 'indian', 'lady', 'sheriff', 'paper',
        ],
      },
      paperSolved: function (req) {
        var solvCnt = 0;
        for (var f = 0; f < req.length; f++)
          if (req[f].solved === true)
            solvCnt++;
        if (req.length == solvCnt)
          return true;
        else
          return false;
      },
      //Menu-Control
      menu: {
        bottom: [],
        standard: [
          'Inventar', 'Stadt', 'Freunde', 'Duelle', 'UPShop', 'Telegramme', 'Handwerk', 'Arbeiten', 'Multiplayer'
        ],
        minimized: false,
        //Initializing Menu
        init: function () {
          var leng = TWM.get('bottomMenu_length', -1);
          if (leng != -1) { //Menu settings found - load
            for (var b = 0; b < leng; b++) {
              var tmp = TWM.get('bottomMenu_' + b, '');
              if (tmp !== '')
                this.bottom.push(tmp);
            }
            TWM.Blinker.init();
            //just append menu if activated
            if (TWM.get('ACTIVE', 'true') == 'true')
              this.appendNewMenu();
          } else {
            //No menu settings found
            TWM.menu.bottom = this.standard;
            setTimeout(function () {
              TWM.showMessage(Mlang.noSettings, 'hint');
            }, 5000);
          }
          //add styles for bottom bar
          TWM.addStyle('#TWM_bottombar { position:absolute; bottom:0; min-height:68px; width:536px; z-index:15; left:50%; margin-left:-267px; overflow:hidden; }' +
            '#TWM_bottombar.expanded {width:590px;}' +
            '#TWM_bottombar.ontop { z-index:20; }' +
            '#TWM_bottombar_wrapper { position:relative; padding:10px 0 4px; text-align:center; }' +
            '.TWM_button {' + TWM.images.btnBG + 'width:52px; height:52px; overflow:hidden; display:inline-block; vertical-align:top;}' +
            '.TWM_button:hover {' + TWM.images.btnBG_hover + '}' +
            '.TWM_img {' + TWM.images.btnBG_highlight + 'height:52px; position:relative; top:0; opacity:0;}' +
            '.TWM_button img { position:relative; top:-52px; cursor:pointer; }' +
            '#TWM_toggleMenu {z-index:10; cursor:pointer; left:50%; margin-left:261px; background:url(images/tw2gui/arrow_updown.png) 0; width:52px; height:14px;}' +
            '.menuBorder {position:absolute; background:url(images/interface/dock.png);}' +
            '.menuMiddle {bottom:26% !important;}');
        },
        needReq: function (ey) {
          return (TWM.menu.contains(ey) && TWM.get('BLINKING_' + ey, true));
        },
        //Inject new menu entries
        appendNewMenu: function () {
          var bottomMenu = $('#TWM_bottombar');
          if (bottomMenu.length)
            bottomMenu.remove();
          var bottomExtender = $('#TWM_toggleMenu');
          if (bottomExtender.length)
            bottomExtender.remove();
          bottomMenu = $('<div id="TWM_bottombar"' + (TWM.get('EXPANDED_MENU', 'false') == 'true' ? ' class="expanded"' : '') + '><div class="menuBorder tw2gui_bg_tl"></div><div class="menuBorder tw2gui_bg_tr"></div><div class="menuBorder menuMiddle tw2gui_bg_bl"></div><div class="menuBorder menuMiddle tw2gui_bg_br"></div><div class="menuBorder tw2gui_bg_bl"></div><div class="menuBorder tw2gui_bg_br"></div></div>');
          if (TWM.get('MENU_ONTOP', true))
            bottomMenu.addClass('ontop');
          var bottomMenuHeight = 68 + parseInt((this.bottom.length - 1) / (TWM.get('EXPANDED_MENU', 'false') == 'true' ? 11 : 10)) * 50;
          var bottomMenuContainer = $('<div id="TWM_bottombar_wrapper"></div>');
          //insert menu entries
          for (var b = 0; b < this.bottom.length; b++) {
            var s = this.bottom[b] == 'Stadt' ? ' button city' : '';
            entry = $('<div class="TWM_button' + s + '"></div>');
            highlight = $('<div class="TWM_img TWM_highlight ' + this.bottom[b] + '"></div>');
            image = $('<img src="' + TWM.images.menu[this.bottom[b]] + '" onclick="' + TWM.entryList.details[this.bottom[b]] + '" title="' + (Mlang.entries[this.bottom[b]] || this.bottom[b]) + '">');
            entry.append(highlight, image);
            bottomMenuContainer.append(entry);
          }
          //fix display problems with other site elements
          var position = TWM.get('MENU_POSITION', 'absolute');
          bottomMenu.css('position', position);
          var wfh = function () {
            return bottomMenuHeight + (WestUi.FriendsBar.hidden !== false ? 10 : 90);
          };
          $('#ui_experience_bar').css('position', position).css('bottom', bottomMenuHeight - 4);
          $('#ui_windowdock').css('position', position).css('bottom', wfh() + 8);
          $('.friendsbar').css('position', position).css('bottom', bottomMenuHeight + 7);
          $('.friendsbar-toggle').css('position', position).css('bottom', wfh()).click(function () {
            $(this).css('bottom', wfh());
            $('#ui_windowdock').css('position', position).css('bottom', wfh() + 8);
          });
          $('#user-interface').append(bottomMenu.append(bottomMenuContainer));
          $('#ui_bottombar').css('display', 'none');
          //append toggle for menu
          if (TWM.get('EXPANDED_MENU', 'false') == 'true') {
            var toggleMenu = $('<div id="TWM_toggleMenu"></div>');
            toggleMenu.css({
              'position': position,
              'bottom': bottomMenuHeight - 2,
            });
            $('#user-interface').append(toggleMenu);
            toggleMenu.click(function () {
              if (TWM.menu.minimized)
                TWM.menu.maximize();
              else
                TWM.menu.minimize();
            });
          }
          //TWSweets compatibility
          if (TWM.menu.contains('Stadt')) {
            $('.TWM_button.button.city').append('<div class="city dock-image"/>');
            var val = setInterval(function () {
              var twnBtn = $('.button.city.background.hasMousePopup');
              if (twnBtn.length > 0 || TWM.menu.cityRv) {
                clearInterval(val);
                TWM.menu.cityRv = true;
                twnBtn.remove();
              }
            }, 500);
          }
          //remove travelling fair icon (left screen border)
          if (TWM.menu.contains('Wanderzirkus')) {
            setTimeout(function () {
              var notB = WestUi.NotiBar.main;
              for (var i = 0; i < notB.list.length; i++) {
                if ((notB.list[i].uid && notB.list[i].uid === 'fairwof') || (notB.list[i].uid && notB.list[i].uid === 'fairsite')) {
                  notB.removeEntry(notB.list[i]);
                  break;
                }
              }
            }, 5000);
          }
          //remove saloon icon
          if (TWM.menu.contains('Quests')) {
            var interval2 = setInterval(function () {
              var noti = WestUi.NotiBar.main;
              if (noti)
                for (var j = 0; j < noti.list.length; j++) {
                  if ($(noti.list[j].element).children().is('div.image.saloon')) {
                    noti.removeEntry(noti.list[j]);
                    window.clearInterval(interval2);
                    break;
                  }
                }
            }, 500);
          }
          ///////////////////////////
          //special entries
          //Advent
          var currentDate = new Date();
          if (this.needReq('Adventskalender'))
            if (currentDate.getMonth() == 11 && currentDate.getDate() < 24 && TWM.get('LAST_ADVENT_DAY', 0) != currentDate.getFullYear() + '.' + currentDate.getDate())
              Character.setToRead('advent', true);
          //Daylies
          if (this.needReq('Aufgaben'))
            Ajax.remoteCallMode('daily', 'get_data', {}, function (json) {
              var counter = 0;
              for (var el in json.status)
                if (json.status[el].finished >= json.status[el].required)
                  counter++;
              if (counter < 3)
                Character.setToRead('daylies', true);
            });
          //QuestEmployers
          Ajax.remoteCallMode('building_quest', '', {}, function (json) {
            var emps = json.questEmployer;
            for (var i = 0; i < emps.length; i++) {
              var quEm = emps[i].key;
              if (emps[i].finishable || emps[i].priority && quEm != 'paper') {
                if (TWM.questies.oldguys.indexOf(quEm) != -1)
                  Character.setToRead(quEm, true);
                else
                  Character.setToRead('quests', true);
              } else if (quEm == 'paper')
                Ajax.remoteCall('quest_employer', '', {
                  employer: 'paper',
                  x: null,
                  y: null
                }, function (json) {
                  var quest = json.employer.open;
                  for (var q = 0; q < quest.length; q++) {
                    if (TWM.paperSolved(quest[q].requirements) === true) {
                      Character.setToRead('paper', true);
                      break;
                    }
                  }
                });
            }
          });
          //Quest book
          if (this.needReq('Questbuch'))
            Ajax.remoteCallMode('building_quest', 'get_open_quests', {}, function (json) {
              for (var i = 0; i < json.quests.length; i++) {
                if (json.quests[i].finishable)
                  Character.setToRead('questbook', true);
              }
            });
          //Fortoverview
          Ajax.remoteCall('fort_overview', '', {
            offset: 0
          }, function (json) {
            if (json.js) {
              for (var el in json.js) {
                if (json.js[el].toString().indexOf(',true,') != -1) {
                  Character.setToRead('forts', true);
                  break;
                }
              }
            }
          });
          //Skill points
          if (this.needReq('Fertigkeiten'))
            Ajax.remoteCallMode('skill', 'overview', {}, function (json) {
              if (!json.error && (json.open_attrPoints !== 0 || json.open_skillPoints !== 0))
                Character.setToRead('skills', true);
            });
          //Trader
          if (this.needReq('Haendler'))
            var traderInterval = setInterval(function () {
              if (west.window.shop) {
                window.clearInterval(traderInterval);
                var wws = west.window.shop;
                wws.ashowCategory = wws.ashowCategory || wws.showCategory;
                wws.showCategory = function (cat) {
                  wws.ashowCategory.apply(this, arguments);
                  if (cat == 'trader') {
                    TWM.set('LAST_TRADER_TIME', Math.round(wws.model.getCategory('trader')._data.refresh_timeout * 1000));
                    Character.setToRead('trader', false);
                  }
                };
                var refreshT = TWM.get('LAST_TRADER_TIME', 0),
                now = new Date().getTime();
                if (now > refreshT)
                  Character.setToRead('trader', true);
                else {
                  var sec = refreshT - now;
                  setTimeout(function () {
                    Character.setToRead('trader', true);
                  }, sec);
                }
              }
            }, 500);
          //TWTimes
          if (this.needReq('TWTimes'))
            if (TWM.get('LAST_TWTIMES', '') != currentDate.getMonth() + '/' + currentDate.getFullYear())
              Character.setToRead('twtimes', true);
          //Travelling fair
          if (this.needReq('Wanderzirkus'))
            setTimeout(function () {
              if (west.wof.WofManager.wofs.fairsite || (west.wof.WofManager.wofs.fairwof && west.wof.WofManager.wofs.fairwof.notibar.free > 0))
                Character.setToRead('fairwof', true);
            }, 5000);
          //Cinema
          if (this.needReq('Lichtspielhaus'))
            Ajax.remoteCallMode('ranking', 'get_data', {
              page: 1,
              tab: 'cities',
            }, function (json) {
              Ajax.remoteCallMode('building_cinema', 'index', {
                town_id: json.ranking[0].town_id
              }, function (json) {
                if (json.videos_left > 0)
                  Character.setToRead('cinema', true);
              });
            });
          //Crafting
          if (this.needReq('Handwerk'))
            Ajax.remoteCallMode('crafting', '', {}, function (json) {
              if (json.profession_skill && json.profession_skill >= 600) {
                var cIDs = [20099, 51622, 51620, 52524, 20104, 51639, 51638, 52523, 20109, 51634, 51632, 52526, 20114, 51628, 51626, 52525];
                for (var c = 0; c < json.recipes_content.length; c++)
                  if (cIDs.indexOf(json.recipes_content[c].item_id / 1000) !== -1 && json.recipes_content[c].last_craft == null)
                    Character.setToRead('crafting', true);
              }
            });
        },
        contains: function (name) {
          return this.bottom.includes(name);
        },
        minimize: function () {
          var wfh = function () {
            return WestUi.FriendsBar.hidden !== false ? 10 : 90;
          };
          $('#TWM_bottombar').css('min-height', '0px');
          $('#TWM_bottombar').animate({
            height: 0
          }, 400, function () {
            $('#TWM_toggleMenu').css('background-position-y', 0);
          });
          $('#TWM_toggleMenu').animate({
            bottom: 0
          });
          $('#ui_experience_bar').animate({
            bottom: 0
          });
          $('#ui_windowdock').animate({
            bottom: wfh() + 8
          });
          $('.friendsbar').animate({
            bottom: '7px'
          });
          $('.friendsbar-toggle').animate({
            bottom: wfh()
          }).click(function () {
            $(this).css('bottom', wfh());
            $('#ui_windowdock').css('bottom', wfh() + 8);
          });
          TWM.menu.minimized = true;
        },
        maximize: function () {
          var bottomMenuHeight = 68 + parseInt((this.bottom.length - 1) / (TWM.get('EXPANDED_MENU', 'false') == 'true' ? 11 : 10)) * 50;
          var wfh = function () {
            return bottomMenuHeight + (WestUi.FriendsBar.hidden !== false ? 10 : 90);
          };
          $('#TWM_bottombar').css('min-height', '68px');
          $('#TWM_bottombar').animate({
            height: bottomMenuHeight + 'px'
          }, 400, function () {
            $('#TWM_toggleMenu').css('background-position-y', '-14px');
          });
          $('#TWM_toggleMenu').animate({
            bottom: (bottomMenuHeight - 1) + 'px'
          });
          $('#ui_experience_bar').animate({
            bottom: (bottomMenuHeight - 4) + 'px'
          });
          $('#ui_windowdock').animate({
            bottom: wfh() + 8
          });
          $('.friendsbar').animate({
            bottom: (bottomMenuHeight + 7) + 'px'
          });
          $('.friendsbar-toggle').animate({
            bottom: wfh()
          }).click(function () {
            $(this).css('bottom', wfh());
            $('#ui_windowdock').css('bottom', wfh() + 8);
          });
          TWM.menu.minimized = false;
        }
      },
      //Settings (link & window)
      settings: {
        gui: {
          window: {},
          comboboxes: {},
          checkboxes: {},
          textareas: {}
        },
        //Create button
        init: function () {
          var rightBar = $('.ui_menucontainer');
          var optionEl = $('<div id="TWMsettingsBtn" onclick="TWM.settings.open ();" title="TheWest-Menu: ' + Mlang.settings + '"></div>');
          if (rightBar && rightBar[1]) {
            rightBar = $(rightBar[1]);
            rightBar.css('max-height', (rightBar.children('div').length * 30 - 2) + 'px');
            rightBar.append(optionEl);
          } else if (rightBar && rightBar[0])
            $(rightBar[0]).append(optionEl);
          //menu settings
          TWM.addStyle('#TWMsettingsBtn {background:url(' + TWM.images.right_menu + '); width:32px; height:40px; cursor:pointer; margin:-8px -16px -10px -7px;}' +
            '#TWMsettingsBtn:hover {background:url(' + TWM.images.right_menu_hover + ');}' +
            '#bottomMenuContainer {position:absolute; bottom:0; min-height:68px; width:536px; z-index:0; margin-left:115px;}' +
            '#bottomMenuContainer .sortableContainer {position:relative; padding:10px 0 4px; text-align:center;}' +
            '#bottomMenuContainer.expanded {width:590px;}' +
            '.sortableContainer div, #addEntry {' + TWM.images.btnBG + 'cursor:move; display:inline-block; overflow:hidden; width:52px; height:52px; vertical-align:top;}' +
            '.sortableContainer div:hover, #addEntry:hover {' + TWM.images.btnBG_hover + '}' +
            '.sortableContainer .emptyEntry {' + TWM.images.btnBG_disabled + 'display:inline-block; width:52px; height:52px; vertical-align:top;}' +
            '#addEntry {position:absolute; bottom:100px; left:25px; cursor:pointer;}' +
            '#TWMbucket .emptyEntry {width:0; height:0;}' +
            '#TWMhelpBox {position:absolute; bottom:0; width:693px; border:1px solid #000; background:rgba(0,0,0,0.2); text-align:center;}' +
            '#TWMhelpBox img {margin:10px; vertical-align:center;}' +
            '.TWMimportWindow, .TWMexportWindow {width:512px !important; height:277px !important;}' +
            '#TWM_generalSettings, #TWM_menuSettings {display:inline-block; float:left; width:295px; box-shadow:inset 4px 4px 16px #000; border:1px solid #000; margin:16px; padding:10px; border-radius:16px;}' +
            '#TWM_settingsContent h2 {border-bottom:1px solid #000; margin:0 0 4px 0;}' +
            '#TWM_generalSettings hr, #TWM_menuSettings hr {margin:6px;}' +
            '#TWMsettingsOverlay {background:rgba(0,0,0,0.64); box-shadow:0 0 16px 4px #000; width:720px; height:250px; margin:-150px 0 0 -12px; padding-top:195px; text-align:center; color:#FFF; text-shadow:1px 1px #000; position:absolute;}');
        },
        //Open settings window
        open: function () {
          this.gui.window = wman.open('TWMsettings', 'TheWest-Menu', 'noreload').setMiniTitle('TheWest-Menu');
          this.gui.window.addTab('TheWest-Menu', 'TWMenu', this.openMenuSettings);
          this.gui.window.addTab(Mlang.settings, 'TWMscriptSettings', this.openScriptSettings);
          this.gui.window.addTab(Mlang.changeLog, 'TWMchangeLog', this.openChangeLog);
          this.gui.window.showLoader();
          this.openMenuSettings();
        },
        //Tab: menu settings
        openMenuSettings: function (cont) {
          TWM.settings.gui.window.activateTab('TWMenu');
          TWM.settings.gui.window.clearContentPane();
          //Header
          var header = $('<img src="' + TWM.images.settingsHeader + '">');
          //Buttons
          var deactivateBtn = new west.gui.Button(Mlang.deactivate, TWM.settings.deactivate);
          $(deactivateBtn.getMainDiv()).css({
            float: 'right',
            marginTop: '10px',
            width: '105px',
          }).attr('title', Mlang.deactivateInfo);
          var saveBtn = new west.gui.Button(Mlang.save, TWM.settings.saveMenu);
          $(saveBtn.getMainDiv()).css({
            float: 'right',
            marginTop: '10px',
            width: '105px',
          });
          var resetBtn = new west.gui.Button(Mlang.reset, TWM.settings.resetMenu);
          $(resetBtn.getMainDiv()).css({
            float: 'right',
            marginTop: '10px',
            marginRight: '5px',
            width: '105px',
          });
          var exportBtn = new west.gui.Button(Mlang.export, TWM.settings.openExportWindow);
          $(exportBtn.getMainDiv()).css({
            float: 'right',
            marginTop: '-32px',
            marginRight: '5px',
            width: '105px',
          });
          var importBtn = new west.gui.Button(Mlang.import, TWM.settings.openImportWindow);
          $(importBtn.getMainDiv()).css({
            float: 'right',
            marginTop: '-32px',
            marginRight: '0',
            width: '105px',
          });
          //bottom menu
          var bottomMenuContainer = $('<div id="bottomMenuContainer"' + (TWM.get('EXPANDED_MENU', 'false') == 'true' ? ' class="expanded"' : '') + '><div class="sortableContainer"></div></div>');
          bottomMenuContainer.children().first().sortable({
            placeholder: 'emptyEntry',
            revert: true,
            connectWith: '#TWMbucket',
            cursor: 'move',
            scroll: false,
            receive: function (event, ui) {
              ui.item.removeClass('TWMdisabled');
            }
          });
          var entr = arguments.length == 1 ? cont : TWM.menu.bottom;
          for (var i = 0; i < entr.length; i++)
            bottomMenuContainer.children().first().append($('<div class="' + entr[i] + '"><img src="' + TWM.images.menu[entr[i]] + '" title="' + (Mlang.entries[entr[i]] || entr[i]) + '"></div>'));
          //add entry
          var addEntry = $('<img id="addEntry" src="' + TWM.images.addEntry + '" title="' + Mlang.addItem + '">');
          addEntry.click(function () {
            TWM.entryList.open();
          });
          //bucket
          var bucketContainer = $('<div id="TWMbucket" class="sortableContainer" style="position:absolute; bottom:5px; left:15px;"></div>');
          var bucket = $('<img id="TWMbucketImg" src="' + TWM.images.bucket + '" title="' + Mlang.removeItem + '">');
          bucketContainer.append(bucket);
          bucketContainer.sortable({
            items: ':not(#TWMbucketImg)',
            over: function () {
              $('#TWMbucketImg').attr('src', TWM.images.bucket_hover);
            },
            receive: function (event, el) {
              $('#TWMbucketImg').attr('src', TWM.images.bucket);
              el.item.remove();
            }
          });
          //add content to window
          bottomMenuContainer.prepend($('<div class="menuBorder tw2gui_bg_tl"></div><div class="menuBorder tw2gui_bg_tr"></div><div class="menuBorder menuMiddle tw2gui_bg_bl"></div><div class="menuBorder menuMiddle tw2gui_bg_br"></div><div class="menuBorder tw2gui_bg_bl"></div><div class="menuBorder tw2gui_bg_br"></div>'));
          $(TWM.settings.gui.window.getContentPane()).append(header, resetBtn.getMainDiv(), saveBtn.getMainDiv(), deactivateBtn.getMainDiv(), $('<br>'), exportBtn.getMainDiv(), importBtn.getMainDiv(), bottomMenuContainer, addEntry, bucketContainer);
          TWM.settings.gui.window.hideLoader();
          //add special content, if menu is deactivated
          if (TWM.get('ACTIVE', 'true') != 'true') {
            var overlay = $('<div id="TWMsettingsOverlay">' + Mlang.activateInfo + '<br><br></div>');
            TWM.settings.gui.window.appendToContentPane(overlay);
            $('.TWMsettings > .tw2gui_window_content_pane').css('z-index', '4');
            var activateBtn = new west.gui.Button(Mlang.activate, TWM.settings.activate);
            overlay.append(activateBtn.getMainDiv());
          }
        },
        //Tab: script settings
        openScriptSettings: function () {
          //clear content pane
          TWM.settings.gui.window.activateTab('TWMscriptSettings').clearContentPane();
          var getLangs = function () {
            var content = '';
            for (var el in TWM.langss)
              content += '<b>' + el + '</b> → ' + TWM.langs[el] + '<br>';
            return content;
          },
          content = $('<div id="TWM_settingsContent" style="margin:0;"></div>'),
          generalSettings = $('<div id="TWM_generalSettings"><h2>' + Mlang.general + '</h2></div>'),
          menuSettings = $('<div id="TWM_menuSettings"><h2>' + Mlang.menu + '</h2></div>'),
          //header
          header = $('<img src="' + TWM.images.settingsHeader + '"><br>'),
          //language options
          langLabel = $('<div>' + Mlang.langB + ': </div>'),
          langBox = new west.gui.Combobox('TWMlangInput').appendTo(langLabel);
          TWM.settings.gui.comboboxes.langBox = langBox;
          //Save button
          var saveBtn = new west.gui.Button(Mlang.save, TWM.settings.saveSettings);
          $(saveBtn.getMainDiv()).css({
            float: 'right',
            marginTop: '-66px',
            marginRight: '6px'
          });
          //menu position
          var menuTxt = $('<div>' + Mlang.menu + ': </div>');
          var menuPos = new west.gui.Combobox('TWMmenuPosition').setWidth(100).addItem('fixed', Mlang.fixed).addItem('absolute', Mlang.absolute);
          TWM.settings.gui.comboboxes.menuPos = menuPos;
          //expanded menu
          var expandOption = new west.gui.Checkbox(Mlang.expand);
          expandOption.getMainDiv().css('margin-left', '16px');
          TWM.settings.gui.checkboxes.expandOption = expandOption;
          var onTop = new west.gui.Checkbox(Mlang.menutop);
          onTop.getMainDiv().css({
            'margin-left': '16px',
            'margin-top': '4px'
          });
          TWM.settings.gui.checkboxes.ontopOption = onTop;
          //blinking entries
          var entryTxt = $('<div>' + Mlang.entry + ': </div>');
          var entryDropdown = new west.gui.Combobox('TWMblinkingEntries').setWidth(100);
          for (var el in TWM.entryList.blinkingEntries)
            entryDropdown.addItem(el, Mlang.entries[el] || el);
          entryDropdown.addListener(TWM.settings.blinkSelect);
          var blinkingCheckbox = new west.gui.Checkbox(Mlang.blinking, '', function (state) {
            TWM.entryList.blinkingEntries[entryDropdown.getValue()].blink = state;
          });
          blinkingCheckbox.getMainDiv().css('margin-left', '16px');
          TWM.settings.gui.checkboxes.blinking = blinkingCheckbox;
          //insert all elements
          generalSettings.append(langLabel);
          menuTxt.append(menuPos.getMainDiv());
          menuSettings.append(menuTxt, '<hr>', expandOption.getMainDiv(), onTop.getMainDiv(), '<hr>');
          entryTxt.append(entryDropdown.getMainDiv()).append(blinkingCheckbox.getMainDiv());
          menuSettings.append(entryTxt);
          content.append(generalSettings).append(menuSettings);
          TWM.settings.gui.window.appendToContentPane(header).appendToContentPane(saveBtn.getMainDiv()).appendToContentPane(content);
          //help / info box
          var helpBox = $('<div id="TWMhelpBox"></div>');
          TWM.settings.gui.window.appendToContentPane(helpBox);
          $('#TWMmenuPosition').hover(function () {
            TWM.settings.infoBox(Mlang.menuPosHelp[TWM.settings.gui.comboboxes.menuPos.getValue()]);
          }, function () {
            TWM.settings.infoBox('');
          });
          expandOption.getMainDiv().hover(function () {
            TWM.settings.infoBox(Mlang.expandHelp);
          }, function () {
            TWM.settings.infoBox('');
          });
          //show settings
          for (var j in TWM.langs)
            langBox.addItem(j, TWM.langs[j].language);
          langBox.select(TWM.lang);
          menuPos.select(TWM.get('MENU_POSITION', 'absolute'));
          expandOption.setSelected(TWM.get('EXPANDED_MENU', 'false') == 'true');
          onTop.setSelected(TWM.get('MENU_ONTOP', true));
          blinkingCheckbox.setSelected(TWM.get('BLINKING_Adventskalender', true), true);
          for (var el in TWM.entryList.blinkingEntries)
            TWM.entryList.blinkingEntries[el].blink = TWM.get('BLINKING_' + el, true);
        },
        //Tab: changeLog
        openChangeLog: function () {
          TWM.settings.gui.window.activateTab('TWMchangeLog');
          TWM.settings.gui.window.clearContentPane();
          var ChangeLang = (TWM.lang == 'de') ? 'de' : 'en';
          var iframe = $('<iframe src="' + TWM.url + 'changelog-lang=' + ChangeLang + '.htm?' + scriptUp.TWM + '" style="width:100%; height:100%; border:0; margin-top:5px; ">');
          TWM.settings.gui.window.appendToContentPane(iframe);
        },
        //Save the menu entries
        saveMenu: function () {
          var items = $('#bottomMenuContainer > div > div');
          TWM.menu.bottom = [];
          items.each(function (i, el) {
            TWM.set('bottomMenu_' + i, el.className);
            TWM.menu.bottom.push(el.className);
          });
          TWM.set('bottomMenu_length', items.length);
          TWM.menu.appendNewMenu();
          TWM.showMessage(Mlang.saved, 'success');
        },
        saveSettings: function () {
          //save language
          localStorage.setItem('scriptsLang', TWM.settings.gui.comboboxes.langBox.getValue());
          TWM.updateLang();
          var menuPos = TWM.settings.gui.comboboxes.menuPos.getValue();
          TWM.set('MENU_POSITION', menuPos);
          var expanded = TWM.settings.gui.checkboxes.expandOption.isSelected();
          TWM.set('EXPANDED_MENU', (expanded ? 'true' : 'false'));
          var ontop = TWM.settings.gui.checkboxes.ontopOption.isSelected();
          TWM.set('MENU_ONTOP', ontop);
          for (var el in TWM.entryList.blinkingEntries) {
            TWM.set('BLINKING_' + el, TWM.entryList.blinkingEntries[el].blink);
            if (TWM.entryList.blinkingEntries[el].blink == false)
              $('.TWM_highlight.' + el).css('opacity', 0);
          }
          TWM.menu.appendNewMenu();
          TWM.showMessage(Mlang.saved, 'success');
        },
        //Reset menu entrys
        resetMenu: function () {
          TWM.settings.openMenuSettings(TWM.menu.standard);
        },
        //write sth. in the help / info box
        infoBox: function (text) {
          if (text == '')
            $('#TWMhelpBox').html('');
          else
            $('#TWMhelpBox').html('<table><tr><td><img src="' + TWM.images.info + '"></td><td style="vertical-align:middle; width:600px">' + text + '</td><td><img src="' + TWM.images.info + '"></td></tr></table>');
        },
        //settings for blinking menu entry
        blinkSelect: function (id) {
          TWM.settings.gui.checkboxes.blinking.setSelected(TWM.entryList.blinkingEntries[id].blink, true);
        },
        //export menu settings
        openExportWindow: function () {
          TWM.settings.gui.exportWindow = wman.open('TWMexportMenu', 'TheWest-Menu &rarr; ' + Mlang.export, 'TWMexportWindow noreload').setMiniTitle('TWM: ' + Mlang.export);
          var content = '[';
          for (var i = 0; i < TWM.menu.bottom.length; i++)
            content += (TWM.menu.bottom[i] + (i == TWM.menu.bottom.length - 1 ? ']' : ','));
          var textarea = new west.gui.Textarea().setWidth(440).setHeight(165).setReadonly();
          textarea.setContent(content);
          TWM.settings.gui.exportWindow.appendToContentPane(textarea.getMainDiv());
          TWM.showMessage(Mlang.exportInfo, 'hint');
        },
        //import menu settings
        openImportWindow: function () {
          TWM.settings.gui.importWindow = wman.open('TWMimportMenu', 'TheWest-Menu &rarr; ' + Mlang.import, 'TWMimportWindow nocloseall noreload').setMiniTitle('TWM: ' + Mlang.import);
          //textarea
          var textarea = new west.gui.Textarea().setWidth(440).setHeight(128);
          TWM.settings.gui.textareas.importTextarea = textarea;
          TWM.settings.gui.importWindow.appendToContentPane(textarea.getMainDiv());
          //save button
          var exampleBtn = new west.gui.Button(Mlang.example, function () {
            textarea.setContent('[Inventar,Stadt,Duelle,Telegramme,Handwerk,Markt,Multiplayer,Quests,Auftraege,Lichtspielhaus,TheWestDataBase,TheWestCalc,GreasyFork,TheWestForum,TheWestWiki]');
          });
          var saveBtn = new west.gui.Button(Mlang.save, function () {
            TWM.settings.importMenu(textarea.getContent());
          });
          $(saveBtn.getMainDiv()).css({
            float: 'right',
            marginRight: '7px'
          });
          TWM.settings.gui.importWindow.appendToContentPane(exampleBtn.getMainDiv(), saveBtn.getMainDiv());
        },
        //function to import a menu
        importMenu: function (content) {
          var startPos = content.indexOf('[');
          var endPos = content.indexOf(']');
          if (startPos == -1 || endPos == -1) {
            TWM.showMessage(Mlang.couldNotSave);
            return;
          }
          content = content.substr(startPos + 1, endPos - startPos - 1);
          var items = content.split(',');
          this.openMenuSettings(items);
        },
        deactivate: function () {
          TWM.set('ACTIVE', 'false');
          TWM.showMessage(Mlang.saved, 'success');
          TWM.settings.openMenuSettings();
        },
        activate: function () {
          TWM.set('ACTIVE', 'true');
          TWM.showMessage(Mlang.saved, 'success');
          TWM.menu.appendNewMenu();
          $('#TWMsettingsOverlay').remove();
        }
      },
      entryList: {
        details: {},
        gui: {
          window: {}
        },
        blinkingEntries: {
          'Adventskalender': {
            key: 'advent'
          },
          'Auftraege': {
            key: 'paper'
          },
          'Aufgaben': {
            key: 'daylies'
          },
          'Berichte': {
            key: 'reports'
          },
          'Fertigkeiten': {
            key: 'skills'
          },
          'Fortkaempfe': {
            key: 'forts'
          },
          'Haendler': {
            key: 'trader'
          },
          'Handwerk': {
            key: 'crafting'
          },
          'Inventar': {
            key: 'inventory'
          },
          'Lichtspielhaus': {
            key: 'cinema'
          },
          'Quests': {
            key: 'quests'
          },
          'QuestBarkeeper': {
            key: 'barkeeper'
          },
          'Questbuch': {
            key: 'questbook'
          },
          'QuestIndian': {
            key: 'indian'
          },
          'QuestLady': {
            key: 'lady'
          },
          'QuestSheriff': {
            key: 'sheriff'
          },
          'Stadtforum': {
            key: 'townforum'
          },
          'Telegramme': {
            key: 'messages'
          },
          'TWTimes': {
            key: 'twtimes'
          },
          'Wanderzirkus': {
            key: 'fairwof'
          },
        },
        init: function () {
          //Menu entries
          this.details = {
            Inventar: 'Wear.open();',
            Adventskalender: 'TWM.entryList.openAdventCalendar();',
            Haendler: 'TWM.entryList.openTraderWindow();',
            Stadt: 'if (Character.homeTown.town_id != 0){ TownWindow.toggleOpen(Character.homeTown.x, Character.homeTown.y);} else{ west.window.Blackboard.toggleOpen();}',
            Einladungen: 'west.window.Blackboard.toggleOpen(\'invite\');',
            Stadtforum: 'ForumWindow.open();',
            Bank: 'if (Character.homeTown.town_id != 0){ BankWindow.open(Character.homeTown.town_id);} else{ TWM.showMessage(\'' + Mlang.noTown + '\');}',
            Kirche: 'if (Character.homeTown.town_id != 0){ ChurchWindow.open(Character.homeTown.town_id);} else{ TWM.showMessage(\'' + Mlang.noTown + '\');}',
            Stadthalle: 'if (Character.homeTown.town_id != 0){ CityhallWindow.open(Character.homeTown.town_id);} else{ TWM.showMessage(\'' + Mlang.noTown + '\');}',
            Saloon: 'if (Character.homeTown.town_id != 0){ SaloonWindow.open(Character.homeTown.town_id);} else{ TWM.showMessage(\'' + Mlang.noTown + '\');}',
            Schneider: 'if(Character.homeTown.town_id != 0){ Trader.open(\'tailor\', Character.homeTown.town_id, Character.homeTown.x, Character.homeTown.y);} else{ TWM.showMessage(\'' + Mlang.noTown + '\');}',
            Buechsenmacher: 'if (Character.homeTown.town_id != 0){ Trader.open(\'gunsmith\', Character.homeTown.town_id, Character.homeTown.x, Character.homeTown.y);} else{ TWM.showMessage(\'' + Mlang.noTown + '\');}',
            Gemischtwaren: 'if(Character.homeTown.town_id != 0){ Trader.open(\'general\',Character.homeTown.town_id, Character.homeTown.x, Character.homeTown.y);} else{ TWM.showMessage(\'' + Mlang.noTown + '\');}',
            Markt: 'TWM.entryList.openMarketWindow();',
            Lichtspielhaus: 'if (Character.homeTown.town_id != 0){ CinemaWindow.open(Character.homeTown.town_id);} else{TWM.entryList.openCinema();}; Character.setToRead(\'cinema\', false);',
            Sheriff: 'if (Character.homeTown.town_id != 0){ SheriffWindow.open(Character.homeTown.town_id);}else { TWM.showMessage(\'' + Mlang.noTown + '\');}',
            Bestatter: 'if (Character.homeTown.town_id != 0){ MorticianWindow.open(Character.homeTown.town_id);} else{ TWM.showMessage(\'' + Mlang.noTown + '\');}',
            Hotel: 'if (Character.homeTown.town_id != 0){ HotelWindow.open(Character.homeTown.town_id);} else{ TWM.showMessage(\'' + Mlang.noTown + '\');}',
            Schlafen: 'if (Character.homeTown.town_id != 0){ TWM.entryList.sleepInHomeTown();} else{ TWM.showMessage(\'' + Mlang.noTown + '\');}',
            //Wegweiser: 'if(Character.home_town != null) AjaxWindow.show(\'fingerboard\',{town_id:Character.home_town.town_id},Character.home_town.town_id);',
            Freunde: 'FriendslistWindow.toggleOpen();',
            Duelle: 'DuelsWindow.toggleOpen();',
            UPShop: 'west.window.shop.toggleOpen().showCategory(\'hot\');',
            PremiumKaufen: 'PremiumBuyWindow.open();',
            Premium: 'west.window.shop.toggleOpen().showCategory(\'longtimer\');',
            Telegramme: 'MessagesWindow.toggleOpen();',
            Berichte: 'MessagesWindow.open(\'report\');',
            Handwerk: 'if (Character.professionId && window.TW_Calc && TW_Calc._initializer && TW_Calc._initializer.settings && TW_Calc._initializer.settings.get(\'MenuCraftButton\')) TW_Calc._initializer.craft.open(); else CharacterWindow.toggleOpen(\'crafting\'); Character.setToRead(\'crafting\', false);',
            Arbeiten: 'JobsWindow.toggleOpen();',
            Multiplayer: 'west.window.multiplayer.toggleOpen(); Character.setToRead(\'forts\', false);',
            Fortkaempfe: 'FortOverviewWindow.toggleOpen(\'currentbattles\', {}); Character.setToRead(\'forts\', false);',
            Abenteuer: 'MultiplayerWindow.open();',
            Buendnis: 'if (Character.homeTown.town_id != 0){ AllianceWindow.open(Character.homeTown.alliance_id);} else{ TWM.showMessage(\'' + Mlang.noTown + '\');}',
            //Profil: 'PlayerProfileWindow.open(Character.playerId);',
            //Charakter: 'CharacterWindow.open();',
            Fertigkeiten: 'SkillsWindow.open(); Character.setToRead(\'skills\', false);',
            Questbuch: 'QuestWindow.open(); Character.setToRead(\'questbook\', false); TWM.entryList.onlyFinishable();',
            Quests: 'QuestSaloonWindow.open(); Character.setToRead(\'quests\', false); Character.setToRead(\'paper\', false); Character.setToRead(\'barkeeper\', false); Character.setToRead(\'lady\', false); Character.setToRead(\'indian\', false); Character.setToRead(\'sheriff\', false); TWM.entryList.stopQuestBook(\'all\');',
            QuestSheriff: 'QuestEmployerWindow.showEmployer(\'sheriff\'); Character.setToRead(\'sheriff\', false); TWM.entryList.stopQuestBook(\'sheriff\');',
            QuestBarkeeper: 'QuestEmployerWindow.showEmployer(\'barkeeper\'); Character.setToRead(\'barkeeper\', false); TWM.entryList.stopQuestBook(\'barkeeper\');',
            QuestLady: 'QuestEmployerWindow.showEmployer(\'lady\'); Character.setToRead(\'lady\', false); TWM.entryList.stopQuestBook(\'lady\');',
            QuestIndian: 'QuestEmployerWindow.showEmployer(\'indian\'); Character.setToRead(\'indian\', false); TWM.entryList.stopQuestBook(\'indian\');',
            Auftraege: 'QuestEmployerWindow.showEmployer(\'paper\'); Character.setToRead(\'paper\', false); TWM.entryList.stopQuestBook(\'paper\');',
            Erfolge: 'AchievementWindow.open();',
            Statistiken: 'try{AchievementWindow.open(Character.playerId, \'statistic\');} catch(e){ AjaxWindow.show(\'achievement\');}',
            Rangliste: 'RankingWindow.open();',
            Aufgaben: 'DailyActivitiesWindow.open(); Character.setToRead(\'daylies\', false);',
            Wanderzirkus: 'TWM.entryList.openFairWindow();',
            Chat: '$(\'#ui_bottomleft\').fadeToggle(1000);',
            //Einstellungen: 'OptionsWindow.open();',
            Logout: 'location.href= \'game.php?window=logout&action=logout&h=' + Player.h + '\';',
            GreasyFork: 'window.open(\'//greasyfork.org/scripts?set=1287\', \'_blank\');',
            TheWestCalc: 'window.open(\'//tw-calc.net/?lang=' + (TWM.lang == 'en' ? 'eng' : TWM.lang == 'cs' ? 'cz' : TWM.lang) + '\', \'_blank\');',
            TheWestDataBase: 'window.open(\'//tw-db.info/index.php?strana=welcome&lang=' + (TWM.lang == 'en' ? 'eng' : TWM.lang == 'cs' ? 'cz' : TWM.lang) + '\', \'_blank\');',
            TheWestDevBlog: 'window.open(\'//devblog.the-west.net\', \'_blank\');',
            TheWestForum: 'window.open(\'' + Game.forumURL + '\', \'_blank\');',
            TheWestWiki: 'window.open(\'' + Game.helpURL + '\', \'_blank\');',
            WestForts: 'window.open(\'//westforts.com/' + location.host.split('.')[0] + '/home\', \'_blank\');',
            QuakeNetWebchat: 'window.open(\'//webchat.quakenet.org\', \'_blank\');',
            Facebook: TWM.lang == 'de' ? 'window.open(\'//www.facebook.com/TheWestGermany\', \'_blank\');' : 'window.open(\'//www.facebook.com/TheWestGame\', \'_blank\');',
          };
          if (['de', 'en', 'hu'].includes(TWM.lang))
            this.details.TWTimes = 'TWM.entryList.openTWTimes();';
          if (['pl'].includes(TWM.lang))
            this.details.Betrueger = 'TWM.entryList.openFrauds();';
          var length = 0;
          for (var el in this.details)
            length++;
          //Styles
          TWM.addStyle('.TWMentryListWindow { width:624px !important; height:' + (115 + Math.ceil(length / 11) * 60) + 'px !important; }' +
            '.TWMdisabled {' + TWM.images.btnBG_disabled + '}');
        },
        open: function () {
          //open new window
          this.gui.window = wman.open('TWMentryList', 'TheWest-Menu &rarr; ' + Mlang.entryList, 'TWMentryListWindow noreload').setMiniTitle('TWM: ' + Mlang.entryList);
          $('.TWMentryList.TWMentryListWindow').css('left', '10px').css('top', '25px');
          //available entrys
          var infoText = $('<div style="padding:10px; font-weight:bold;">' + Mlang.moveItem + '</div>');
          var entries = $('<div id="TWMentries" class="sortableContainer"></div>');
          entries.sortable({
            placeholder: 'emptyEntry',
            revert: true,
            connectWith: '#bottomMenuContainer .sortableContainer',
            cursor: 'move',
            scroll: false
          });
          for (var el in TWM.entryList.details)
            entries.append($('<div class="' + el + (TWM.menu.contains(el) ? ' TWMdisabled' : '') + '">' +
                '<img src="' + TWM.images.menu[el] + '" title="' + (Mlang.entries[el] || el) + '"></div>'));
          this.gui.window.appendToContentPane(infoText).appendToContentPane(entries);
        },
        openMarketWindow: function () {
          if (Character.homeTown.town_id) {
            Ajax.remoteCallMode('town', 'get_town', {
              x: Character.homeTown.x,
              y: Character.homeTown.y
            }, function (json) {
              if (json.error)
                return new UserMessage(json.msg).show();
              MarketWindow.open(Character.homeTown.town_id, json.allBuildings.market.stage);
            });
          } else {
            MarketWindow.open();
            TWM.showMessage(Mlang.noTown);
          }
        },
        sleepInHomeTown: function () {
          Ajax.remoteCallMode('town', 'get_town', {
            x: Character.homeTown.x,
            y: Character.homeTown.y
          }, function (json) {
            if (json.error)
              return new UserMessage(json.msg).show();
            var hotelRooms = new Array('cubby', 'bedroom', 'hotel_room', 'apartment', 'luxurious_apartment');
            var bestRoom = hotelRooms[json.allBuildings.hotel.stage - 1];
            TaskQueue.add(new TaskSleep(Character.homeTown.town_id, bestRoom));
          });
        },
        openAdventCalendar: function () {
          AdventCalendarWindow.open();
          Character.setToRead('advent', false);
          var currentDate = new Date();
          TWM.set('LAST_ADVENT_DAY', currentDate.getFullYear() + '.' + currentDate.getDate());
        },
        openTraderWindow: function () {
          west.window.shop.toggleOpen().showCategory('trader');
        },
        openTWTimes: function () {
          var urlN = 'http://www.twtimes.de/';
          if (TWM.lang == 'en')
            urlN = '//forum.the-west.net/index.php?forums/western-post.131/';
          else if (TWM.lang == 'hu')
            urlN = '//wiki.the-west.hu/wiki/The_West_Times';
          window.open(urlN, '_blank');
          Character.setToRead('twtimes', false);
          var currentDate = new Date();
          TWM.set('LAST_TWTIMES', currentDate.getMonth() + '/' + currentDate.getFullYear());
        },
        openFairWindow: function () {
          if (west.wof.WofManager.wofs.fairsite) {
            west.wof.FairSiteWindow.open();
            Character.setToRead('fairwof', false);
          } else if (west.wof.WofManager.wofs.fairwof) {
            west.wof.FairWindow.open();
            Character.setToRead('fairwof', false);
          } else {
            TWM.showMessage(Mlang.noFair);
          }
        },
        openCinema: function () {
          Ajax.remoteCallMode('ranking', 'get_data', {
            page: 1,
            tab: 'cities',
          }, function (json) {
            CinemaWindow.open(json.ranking[0].town_id);
          });
        },
        stopQuestBook: function (questE) {
          Ajax.remoteCallMode('building_quest', 'get_open_quests', {}, function (json) {
            var eCount = 0;
            var fCount = 0;
            for (var i = 0; i < json.quests.length; i++) {
              if (json.quests[i].finishable) {
                fCount += 1;
                var jqe = json.quests[i].employer;
                if (questE == 'all') {
                  if (TWM.questies.allguys.indexOf(jqe) != -1)
                    eCount += 1;
                } else if (jqe == questE) {
                  eCount += 1;
                }
              }
            }
            if (eCount == fCount)
              Character.setToRead('questbook', false);
          });
        },
        onlyFinishable: function () {
          var CountE = 0,
          saloonEmps = null,
          checkFinished = function (questy) {
            Ajax.remoteCall('quest_employer', '', {
              employer: questy,
              x: null,
              y: null
            }, function (json) {
              var qCount = 0,
              quest = json.employer.open;
              for (var i = 0; i < quest.length; i++) {
                if (quest[i].accepted === true || quest[i].finishable === true || questy == 'paper' && TWM.paperSolved(quest[i].requirements) === false)
                  qCount++;
              }
              if (qCount == quest.length) {
                if (TWM.questies.oldguys.indexOf(questy) != -1)
                  Character.setToRead(questy, false);
                else
                  CountE++;
              }
              if (CountE == saloonEmps - 5)
                Character.setToRead('quests', false);
            });
          };
          Ajax.remoteCallMode('building_quest', '', {}, function (json) {
            var emps = json.questEmployer;
            saloonEmps = emps.length;
            for (var e = 0; e < saloonEmps; e++) {
              var quEm = emps[e].key;
              if (!emps[e].priority) {
                if (TWM.questies.oldguys.indexOf(quEm) != -1)
                  Character.setToRead(quEm, false);
                else
                  CountE++;
              } else if (emps[e].finishable)
                checkFinished(quEm);
            }
            if (CountE == saloonEmps - 5)
              Character.setToRead('quests', false);
          });
        },
        openFrauds: function () {
          /*if (TWM.lang == 'de')
          window.open('http://cci-forum.forumprofi.de/', '_blank');
          else*/
          if (TWM.lang == 'pl')
            window.open('//dzikitw.wordpress.com/oszusci/', '_blank');
        },
      },
      Blinker: {
        init: function () {
          //delete old menu event handlers
          EventHandler.unlisten('player-toread-messages');
          EventHandler.unlisten('player-toread-reports');
          EventHandler.unlisten('player-toread-townforum');
          EventHandler.unlisten('player-toread-inventory');
          //create new event handler function for blinking
          var blinkBottom = function (type, toRead) {
            toRead = toRead || type;
            return function () {
              WestUi.Blinker.start(type, {
                'start': function () {
                  var link = {
                    Berichte: (TWM.menu.contains('Berichte') ? 'Berichte' : 'Telegramme'),
                    Fortkaempfe: (TWM.menu.contains('Fortkaempfe') ? 'Fortkaempfe' : 'Multiplayer'),
                    QuestBarkeeper: (TWM.menu.contains('QuestBarkeeper') ? 'QuestBarkeeper' : 'Quests'),
                    QuestIndian: (TWM.menu.contains('QuestIndian') ? 'QuestIndian' : 'Quests'),
                    QuestLady: (TWM.menu.contains('QuestLady') ? 'QuestLady' : 'Quests'),
                    QuestSheriff: (TWM.menu.contains('QuestSheriff') ? 'QuestSheriff' : 'Quests'),
                    Auftraege: (TWM.menu.contains('Auftraege') ? 'Auftraege' : 'Quests'),
                    Stadtforum: (TWM.menu.contains('Stadtforum') ? 'Stadtforum' : 'Stadt'),
                  };
                  if (TWM.get('BLINKING_' + (link[type] || type), true) === false)
                    return;
                  var el = $('.TWM_highlight.' + (link[type] || type));
                  if (Config.get('gui.animations')) {
                    el.animate({
                      'opacity': 1
                    }, {
                      'queue': false,
                      'duration': 600
                    });
                    if ('city' === type) {
                      $('#windows div.tow_forumhighlight').animate({
                        'opacity': 1
                      }, {
                        'queue': false,
                        'duration': 600
                      });
                      if (!el.length)
                        $('.TWM_highlight.Stadt').animate({
                          'opacity': 1
                        }, {
                          'queue': false,
                          'duration': 600
                        });
                    }
                  } else {
                    el.css('opacity', 1);
                    if ('city' === type) {
                      $('#windows div.tow_forumhighlight').css('opacity', 1);
                      if (!el.length)
                        $('.TWM_highlight.Stadt').css('opacity', 1);
                    }
                  }
                },
                'stop': function (force) {
                  var link = {
                    Berichte: (TWM.menu.contains('Berichte') ? 'Berichte' : 'Telegramme'),
                    Fortkaempfe: (TWM.menu.contains('Fortkaempfe') ? 'Fortkaempfe' : 'Multiplayer'),
                    QuestBarkeeper: (TWM.menu.contains('QuestBarkeeper') ? 'QuestBarkeeper' : 'Quests'),
                    QuestIndian: (TWM.menu.contains('QuestIndian') ? 'QuestIndian' : 'Quests'),
                    QuestLady: (TWM.menu.contains('QuestLady') ? 'QuestLady' : 'Quests'),
                    QuestSheriff: (TWM.menu.contains('QuestSheriff') ? 'QuestSheriff' : 'Quests'),
                    Auftraege: (TWM.menu.contains('Auftraege') ? 'Auftraege' : 'Quests'),
                    Stadtforum: (TWM.menu.contains('Stadtforum') ? 'Stadtforum' : 'Stadt'),
                  };
                  if (TWM.get('BLINKING_' + (link[type] || type), true) === false)
                    return;
                  var el = $('.TWM_highlight.' + (link[type] || type));
                  if (Config.get('gui.animations')) {
                    el.animate({
                      'opacity': 0
                    }, {
                      'queue': false,
                      'duration': 600
                    });
                    if ('city' === type) {
                      $('#windows div.tow_forumhighlight').animate({
                        'opacity': 0
                      }, {
                        'queue': false,
                        'duration': 600
                      });
                      if (!el.length)
                        $('.TWM_highlight.Stadt').animate({
                          'opacity': 0
                        }, {
                          'queue': false,
                          'duration': 600
                        });
                    }
                  } else if (force) {
                    el.css('opacity', 0);
                    if ('city' === type) {
                      $('#windows div.tow_forumhighlight').css('opacity', 0);
                      if (!el.length)
                        $('.TWM_highlight.Stadt').css('opacity', 0);
                    }
                  }
                },
                'check': function () {
                  return Character.read[toRead];
                }
              });
            };
          };
          //add new event handlers for blinking
          for (var el in TWM.entryList.blinkingEntries) {
            var key = TWM.entryList.blinkingEntries[el].key;
            EventHandler.listen('player-toread-' + key, blinkBottom(el, key));
          }
          //add new blinkers
          window.setTimeout(function () {
            WestUi.Blinker.animation = {};
            for (var el in Character.read)
              if (Character.read[el])
                EventHandler.signal('player-toread-' + el);
          }, 1000);
        }
      },
    };
    /*! $ UI - v1.11.4 - 2015-12-22
     * https://jqueryui.com
     * Includes: core.js, widget.js, mouse.js, sortable.js
     * Copyright $ Foundation and other contributors; Licensed MIT */
    (function (e) {
      'function' == typeof define && define.amd ? define(['jquery'], e) : e($)
    })(function (e) {
      function t(t, s) {
        var n,
        a,
        o,
        r = t.nodeName.toLowerCase();
        return 'area' === r ? (n = t.parentNode, a = n.name, t.href && a && 'map' === n.nodeName.toLowerCase() ? (o = e('img[usemap=\'#' + a + '\']')[0], !!o && i(o)) : !1) : (/^(input|select|textarea|button|object)$/.test(r) ? !t.disabled : 'a' === r ? t.href || s : s) && i(t)
      }
      function i(t) {
        return e.expr.filters.visible(t) && !e(t).parents().addBack().filter(function () {
          return 'hidden' === e.css(this, 'visibility')
        }).length
      }
      e.ui = e.ui || {},
      e.extend(e.ui, {
        version: '1.11.4',
        keyCode: {
          BACKSPACE: 8,
          COMMA: 188,
          DELETE: 46,
          DOWN: 40,
          END: 35,
          ENTER: 13,
          ESCAPE: 27,
          HOME: 36,
          LEFT: 37,
          PAGE_DOWN: 34,
          PAGE_UP: 33,
          PERIOD: 190,
          RIGHT: 39,
          SPACE: 32,
          TAB: 9,
          UP: 38
        }
      }),
      e.fn.extend({
        scrollParent: function (t) {
          var i = this.css('position'),
          s = 'absolute' === i,
          n = t ? /(auto|scroll|hidden)/ : /(auto|scroll)/,
          a = this.parents().filter(function () {
            var t = e(this);
            return s && 'static' === t.css('position') ? !1 : n.test(t.css('overflow') + t.css('overflow-y') + t.css('overflow-x'))
          }).eq(0);
          return 'fixed' !== i && a.length ? a : e(this[0].ownerDocument || document)
        },
        uniqueId: function () {
          var e = 0;
          return function () {
            return this.each(function () {
              this.id || (this.id = 'ui-id-' + ++e)
            })
          }
        }
        (),
        removeUniqueId: function () {
          return this.each(function () {
            /^ui-id-\d+$/.test(this.id) && e(this).removeAttr('id')
          })
        }
      }),
      e.extend(e.expr.pseudos, {
        data: e.expr.createPseudo ? e.expr.createPseudo(function (t) {
          return function (i) {
            return !!e.data(i, t)
          }
        }) : function (t, i, s) {
          return !!e.data(t, s[3])
        },
        focusable: function (i) {
          return t(i, !isNaN(e.attr(i, 'tabindex')))
        },
        tabbable: function (i) {
          var s = e.attr(i, 'tabindex'),
          n = isNaN(s);
          return (n || s >= 0) && t(i, !n)
        }
      }),
      e('<a>').outerWidth(1).jquery || e.each(['Width', 'Height'], function (t, i) {
        function s(t, i, s, a) {
          return e.each(n, function () {
            i -= parseFloat(e.css(t, 'padding' + this)) || 0,
            s && (i -= parseFloat(e.css(t, 'border' + this + 'Width')) || 0),
            a && (i -= parseFloat(e.css(t, 'margin' + this)) || 0)
          }),
          i
        }
        var n = 'Width' === i ? ['Left', 'Right'] : ['Top', 'Bottom'],
        a = i.toLowerCase(),
        o = {
          innerWidth: e.fn.innerWidth,
          innerHeight: e.fn.innerHeight,
          outerWidth: e.fn.outerWidth,
          outerHeight: e.fn.outerHeight
        };
        e.fn['inner' + i] = function (t) {
          return void 0 === t ? o['inner' + i].call(this) : this.each(function () {
            e(this).css(a, s(this, t) + 'px')
          })
        },
        e.fn['outer' + i] = function (t, n) {
          return 'number' != typeof t ? o['outer' + i].call(this, t) : this.each(function () {
            e(this).css(a, s(this, t, !0, n) + 'px')
          })
        }
      }),
      e.fn.addBack || (e.fn.addBack = function (e) {
        return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
      }),
      e('<a>').data('a-b', 'a').removeData('a-b').data('a-b') && (e.fn.removeData = function (t) {
        return function (i) {
          return arguments.length ? t.call(this, e.camelCase(i)) : t.call(this)
        }
      }
        (e.fn.removeData)),
      e.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),
      e.fn.extend({
        focus: function (t) {
          return function (i, s) {
            return 'number' == typeof i ? this.each(function () {
              var t = this;
              setTimeout(function () {
                e(t).focus(),
                s && s.call(t)
              }, i)
            }) : t.apply(this, arguments)
          }
        }
        (e.fn.focus),
        disableSelection: function () {
          var e = 'onselectstart' in document.createElement('div') ? 'selectstart' : 'mousedown';
          return function () {
            return this.on(e + '.ui-disableSelection', function (e) {
              e.preventDefault()
            })
          }
        }
        (),
        enableSelection: function () {
          return this.off('.ui-disableSelection')
        },
        zIndex: function (t) {
          if (void 0 !== t)
            return this.css('zIndex', t);
          if (this.length)
            for (var i, s, n = e(this[0]); n.length && n[0] !== document; ) {
              if (i = n.css('position'), ('absolute' === i || 'relative' === i || 'fixed' === i) && (s = parseInt(n.css('zIndex'), 10), !isNaN(s) && 0 !== s))
                return s;
              n = n.parent()
            }
          return 0
        }
      }),
      e.ui.plugin = {
        add: function (t, i, s) {
          var n,
          a = e.ui[t].prototype;
          for (n in s)
            a.plugins[n] = a.plugins[n] || [],
            a.plugins[n].push([i,
                s[n]])
        },
        call: function (e, t, i, s) {
          var n,
          a = e.plugins[t];
          if (a && (s || e.element[0].parentNode && 11 !== e.element[0].parentNode.nodeType))
            for (n = 0; a.length > n; n++)
              e.options[a[n][0]] && a[n][1].apply(e.element, i)
        }
      };
      var s = 0,
      n = Array.prototype.slice;
      e.cleanData = function (t) {
        return function (i) {
          var s,
          n,
          a;
          for (a = 0; null != (n = i[a]); a++)
            try {
              s = e._data(n, 'events'),
              s && s.remove && e(n).triggerHandler('remove')
            } catch (o) {}
          t(i)
        }
      }
      (e.cleanData),
      e.widget = function (t, i, s) {
        var n,
        a,
        o,
        r,
        h = {},
        l = t.split('.')[0];
        return t = t.split('.')[1],
        n = l + '-' + t,
        s || (s = i, i = e.Widget),
        e.expr.pseudos[n.toLowerCase()] = function (t) {
          return !!e.data(t, n)
        },
        e[l] = e[l] || {},
        a = e[l][t],
        o = e[l][t] = function (e, t) {
          return this._createWidget ? (arguments.length && this._createWidget(e, t), void 0) : new o(e, t)
        },
        e.extend(o, a, {
          version: s.version,
          _proto: e.extend({}, s),
          _childConstructors: []
        }),
        r = new i,
        r.options = e.widget.extend({}, r.options),
        e.each(s, function (t, s) {
          return e.isFunction(s) ? (h[t] = function () {
            var e = function () {
              return i.prototype[t].apply(this, arguments)
            },
            n = function (e) {
              return i.prototype[t].apply(this, e)
            };
            return function () {
              var t,
              i = this._super,
              a = this._superApply;
              return this._super = e,
              this._superApply = n,
              t = s.apply(this, arguments),
              this._super = i,
              this._superApply = a,
              t
            }
          }
            (), void 0) : (h[t] = s, void 0)
        }),
        o.prototype = e.widget.extend(r, {
          widgetEventPrefix: a ? r.widgetEventPrefix || t : t
        }, h, {
          constructor: o,
          namespace: l,
          widgetName: t,
          widgetFullName: n
        }),
        a ? (e.each(a._childConstructors, function (t, i) {
            var s = i.prototype;
            e.widget(s.namespace + '.' + s.widgetName, o, i._proto)
          }), delete a._childConstructors) : i._childConstructors.push(o),
        e.widget.bridge(t, o),
        o
      },
      e.widget.extend = function (t) {
        for (var i, s, a = n.call(arguments, 1), o = 0, r = a.length; r > o; o++)
          for (i in a[o])
            s = a[o][i],
            a[o].hasOwnProperty(i) && void 0 !== s && (t[i] = e.isPlainObject(s) ? e.isPlainObject(t[i]) ? e.widget.extend({}, t[i], s) : e.widget.extend({}, s) : s);
        return t
      },
      e.widget.bridge = function (t, i) {
        var s = i.prototype.widgetFullName || t;
        e.fn[t] = function (a) {
          var o = 'string' == typeof a,
          r = n.call(arguments, 1),
          h = this;
          return o ? this.each(function () {
            var i,
            n = e.data(this, s);
            return 'instance' === a ? (h = n, !1) : n ? e.isFunction(n[a]) && '_' !== a.charAt(0) ? (i = n[a].apply(n, r), i !== n && void 0 !== i ? (h = i && i.jquery ? h.pushStack(i.get()) : i, !1) : void 0) : e.error('no such method \'' + a + '\' for ' + t + ' widget instance') : e.error('cannot call methods on ' + t + ' prior to initialization; ' + 'attempted to call method \'' + a + '\'')
          }) : (r.length && (a = e.widget.extend.apply(null, [a].concat(r))), this.each(function () {
              var t = e.data(this, s);
              t ? (t.option(a || {}), t._init && t._init()) : e.data(this, s, new i(a, this))
            })),
          h
        }
      },
      e.Widget = function () {},
      e.Widget._childConstructors = [],
      e.Widget.prototype = {
        widgetName: 'widget',
        widgetEventPrefix: '',
        defaultElement: '<div>',
        options: {
          disabled: !1,
          create: null
        },
        _createWidget: function (t, i) {
          i = e(i || this.defaultElement || this)[0],
          this.element = e(i),
          this.uuid = s++,
          this.eventNamespace = '.' + this.widgetName + this.uuid,
          this.bindings = e(),
          this.hoverable = e(),
          this.focusable = e(),
          i !== this && (e.data(i, this.widgetFullName, this), this._on(!0, this.element, {
              remove: function (e) {
                e.target === i && this.destroy()
              }
            }), this.document = e(i.style ? i.ownerDocument : i.document || i), this.window = e(this.document[0].defaultView || this.document[0].parentWindow)),
          this.options = e.widget.extend({}, this.options, this._getCreateOptions(), t),
          this._create(),
          this._trigger('create', null, this._getCreateEventData()),
          this._init()
        },
        _getCreateOptions: e.noop,
        _getCreateEventData: e.noop,
        _create: e.noop,
        _init: e.noop,
        destroy: function () {
          this._destroy(),
          this.element.off(this.eventNamespace).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),
          this.widget().off(this.eventNamespace).removeAttr('aria-disabled').removeClass(this.widgetFullName + '-disabled ' + 'ui-state-disabled'),
          this.bindings.off(this.eventNamespace),
          this.hoverable.removeClass('ui-state-hover'),
          this.focusable.removeClass('ui-state-focus')
        },
        _destroy: e.noop,
        widget: function () {
          return this.element
        },
        option: function (t, i) {
          var s,
          n,
          a,
          o = t;
          if (0 === arguments.length)
            return e.widget.extend({}, this.options);
          if ('string' == typeof t)
            if (o = {}, s = t.split('.'), t = s.shift(), s.length) {
              for (n = o[t] = e.widget.extend({}, this.options[t]), a = 0; s.length - 1 > a; a++)
                n[s[a]] = n[s[a]] || {},
              n = n[s[a]];
              if (t = s.pop(), 1 === arguments.length)
                return void 0 === n[t] ? null : n[t];
              n[t] = i
            } else {
              if (1 === arguments.length)
                return void 0 === this.options[t] ? null : this.options[t];
              o[t] = i
            }
          return this._setOptions(o),
          this
        },
        _setOptions: function (e) {
          var t;
          for (t in e)
            this._setOption(t, e[t]);
          return this
        },
        _setOption: function (e, t) {
          return this.options[e] = t,
          'disabled' === e && (this.widget().toggleClass(this.widgetFullName + '-disabled', !!t), t && (this.hoverable.removeClass('ui-state-hover'), this.focusable.removeClass('ui-state-focus'))),
          this
        },
        enable: function () {
          return this._setOptions({
            disabled: !1
          })
        },
        disable: function () {
          return this._setOptions({
            disabled: !0
          })
        },
        _on: function (t, i, s) {
          var n,
          a = this;
          'boolean' != typeof t && (s = i, i = t, t = !1),
          s ? (i = n = e(i), this.bindings = this.bindings.add(i)) : (s = i, i = this.element, n = this.widget()),
          e.each(s, function (s, o) {
            function r() {
              return t || a.options.disabled !== !0 && !e(this).hasClass('ui-state-disabled') ? ('string' == typeof o ? a[o] : o).apply(a, arguments) : void 0
            }
            'string' != typeof o && (r.guid = o.guid = o.guid || r.guid || e.guid++);
            var h = s.match(/^([\w:-]*)\s*(.*)$/),
            l = h[1] + a.eventNamespace,
            u = h[2];
            u ? n.delegate(u, l, r) : i.on(l, r)
          })
        },
        _off: function (t, i) {
          i = (i || '').split(' ').join(this.eventNamespace + ' ') + this.eventNamespace,
          t.off(i).undelegate(i),
          this.bindings = e(this.bindings.not(t).get()),
          this.focusable = e(this.focusable.not(t).get()),
          this.hoverable = e(this.hoverable.not(t).get())
        },
        _delay: function (e, t) {
          function i() {
            return ('string' == typeof e ? s[e] : e).apply(s, arguments)
          }
          var s = this;
          return setTimeout(i, t || 0)
        },
        _hoverable: function (t) {
          this.hoverable = this.hoverable.add(t),
          this._on(t, {
            mouseenter: function (t) {
              e(t.currentTarget).addClass('ui-state-hover')
            },
            mouseleave: function (t) {
              e(t.currentTarget).removeClass('ui-state-hover')
            }
          })
        },
        _focusable: function (t) {
          this.focusable = this.focusable.add(t),
          this._on(t, {
            focusin: function (t) {
              e(t.currentTarget).addClass('ui-state-focus')
            },
            focusout: function (t) {
              e(t.currentTarget).removeClass('ui-state-focus')
            }
          })
        },
        _trigger: function (t, i, s) {
          var n,
          a,
          o = this.options[t];
          if (s = s || {}, i = e.Event(i), i.type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase(), i.target = this.element[0], a = i.originalEvent)
            for (n in a)
              n in i || (i[n] = a[n]);
          return this.element.trigger(i, s),
          !(e.isFunction(o) && o.apply(this.element[0], [i].concat(s)) === !1 || i.isDefaultPrevented())
        }
      },
      e.each({
        show: 'fadeIn',
        hide: 'fadeOut'
      }, function (t, i) {
        e.Widget.prototype['_' + t] = function (s, n, a) {
          'string' == typeof n && (n = {
              effect: n
            });
          var o,
          r = n ? n === !0 || 'number' == typeof n ? i : n.effect || i : t;
          n = n || {},
          'number' == typeof n && (n = {
              duration: n
            }),
          o = !e.isEmptyObject(n),
          n.complete = a,
          n.delay && s.delay(n.delay),
          o && e.effects && e.effects.effect[r] ? s[t](n) : r !== t && s[r] ? s[r](n.duration, n.easing, a) : s.queue(function (i) {
            e(this)[t](),
            a && a.call(s[0]),
            i()
          })
        }
      }),
      e.widget;
      var a = !1;
      e(document).on('mouseup', function () {
        a = !1
      }),
      e.widget('ui.mouse', {
        version: '1.11.4',
        options: {
          cancel: 'input,textarea,button,select,option',
          distance: 1,
          delay: 0
        },
        _mouseInit: function () {
          var t = this;
          this.element.on('mousedown.' + this.widgetName, function (e) {
            return t._mouseDown(e)
          }).on('click.' + this.widgetName, function (i) {
            return !0 === e.data(i.target, t.widgetName + '.preventClickEvent') ? (e.removeData(i.target, t.widgetName + '.preventClickEvent'), i.stopImmediatePropagation(), !1) : void 0
          }),
          this.started = !1
        },
        _mouseDestroy: function () {
          this.element.off('.' + this.widgetName),
          this._mouseMoveDelegate && this.document.off('mousemove.' + this.widgetName, this._mouseMoveDelegate).off('mouseup.' + this.widgetName, this._mouseUpDelegate)
        },
        _mouseDown: function (t) {
          if (!a) {
            this._mouseMoved = !1,
            this._mouseStarted && this._mouseUp(t),
            this._mouseDownEvent = t;
            var i = this,
            s = 1 === t.which,
            n = 'string' == typeof this.options.cancel && t.target.nodeName ? e(t.target).closest(this.options.cancel).length : !1;
            return s && !n && this._mouseCapture(t) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () {
                  i.mouseDelayMet = !0
                }, this.options.delay)), this._mouseDistanceMet(t) && this._mouseDelayMet(t) && (this._mouseStarted = this._mouseStart(t) !== !1, !this._mouseStarted) ? (t.preventDefault(), !0) : (!0 === e.data(t.target, this.widgetName + '.preventClickEvent') && e.removeData(t.target, this.widgetName + '.preventClickEvent'), this._mouseMoveDelegate = function (e) {
                return i._mouseMove(e)
              }, this._mouseUpDelegate = function (e) {
                return i._mouseUp(e)
              }, this.document.on('mousemove.' + this.widgetName, this._mouseMoveDelegate).on('mouseup.' + this.widgetName, this._mouseUpDelegate), t.preventDefault(), a = !0, !0)) : !0
          }
        },
        _mouseMove: function (t) {
          if (this._mouseMoved) {
            if (e.ui.ie && (!document.documentMode || 9 > document.documentMode) && !t.button)
              return this._mouseUp(t);
            if (!t.which)
              return this._mouseUp(t)
          }
          return (t.which || t.button) && (this._mouseMoved = !0),
          this._mouseStarted ? (this._mouseDrag(t), t.preventDefault()) : (this._mouseDistanceMet(t) && this._mouseDelayMet(t) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, t) !== !1, this._mouseStarted ? this._mouseDrag(t) : this._mouseUp(t)), !this._mouseStarted)
        },
        _mouseUp: function (t) {
          return this.document.off('mousemove.' + this.widgetName, this._mouseMoveDelegate).off('mouseup.' + this.widgetName, this._mouseUpDelegate),
          this._mouseStarted && (this._mouseStarted = !1, t.target === this._mouseDownEvent.target && e.data(t.target, this.widgetName + '.preventClickEvent', !0), this._mouseStop(t)),
          a = !1,
          !1
        },
        _mouseDistanceMet: function (e) {
          return Math.max(Math.abs(this._mouseDownEvent.pageX - e.pageX), Math.abs(this._mouseDownEvent.pageY - e.pageY)) >= this.options.distance
        },
        _mouseDelayMet: function () {
          return this.mouseDelayMet
        },
        _mouseStart: function () {},
        _mouseDrag: function () {},
        _mouseStop: function () {},
        _mouseCapture: function () {
          return !0
        }
      }),
      e.widget('ui.sortable', e.ui.mouse, {
        version: '1.11.4',
        widgetEventPrefix: 'sort',
        ready: !1,
        options: {
          appendTo: 'parent',
          axis: !1,
          connectWith: !1,
          containment: !1,
          cursor: 'auto',
          cursorAt: !1,
          dropOnEmpty: !0,
          forcePlaceholderSize: !1,
          forceHelperSize: !1,
          grid: !1,
          handle: !1,
          helper: 'original',
          items: '> *',
          opacity: !1,
          placeholder: !1,
          revert: !1,
          scroll: !0,
          scrollSensitivity: 20,
          scrollSpeed: 20,
          scope: 'default',
          tolerance: 'intersect',
          zIndex: 1000,
          activate: null,
          beforeStop: null,
          change: null,
          deactivate: null,
          out: null,
          over: null,
          receive: null,
          remove: null,
          sort: null,
          start: null,
          stop: null,
          update: null
        },
        _isOverAxis: function (e, t, i) {
          return e >= t && t + i > e
        },
        _isFloating: function (e) {
          return /left|right/.test(e.css('float')) || /inline|table-cell/.test(e.css('display'))
        },
        _create: function () {
          this.containerCache = {},
          this.element.addClass('ui-sortable'),
          this.refresh(),
          this.offset = this.element.offset(),
          this._mouseInit(),
          this._setHandleClassName(),
          this.ready = !0
        },
        _setOption: function (e, t) {
          this._super(e, t),
          'handle' === e && this._setHandleClassName()
        },
        _setHandleClassName: function () {
          this.element.find('.ui-sortable-handle').removeClass('ui-sortable-handle'),
          e.each(this.items, function () {
            (this.instance.options.handle ? this.item.find(this.instance.options.handle) : this.item).addClass('ui-sortable-handle')
          })
        },
        _destroy: function () {
          this.element.removeClass('ui-sortable ui-sortable-disabled').find('.ui-sortable-handle').removeClass('ui-sortable-handle'),
          this._mouseDestroy();
          for (var e = this.items.length - 1; e >= 0; e--)
            this.items[e].item.removeData(this.widgetName + '-item');
          return this
        },
        _mouseCapture: function (t, i) {
          var s = null,
          n = !1,
          a = this;
          return this.reverting ? !1 : this.options.disabled || 'static' === this.options.type ? !1 : (this._refreshItems(t), e(t.target).parents().each(function () {
              return e.data(this, a.widgetName + '-item') === a ? (s = e(this), !1) : void 0
            }), e.data(t.target, a.widgetName + '-item') === a && (s = e(t.target)), s ? !this.options.handle || i || (e(this.options.handle, s).find('*').addBack().each(function () {
                this === t.target && (n = !0)
              }), n) ? (this.currentItem = s, this._removeCurrentsFromItems(), !0) : !1 : !1)
        },
        _mouseStart: function (t, i, s) {
          var n,
          a,
          o = this.options;
          if (this.currentContainer = this, this.refreshPositions(), this.helper = this._createHelper(t), this._cacheHelperProportions(), this._cacheMargins(), this.scrollParent = this.helper.scrollParent(), this.offset = this.currentItem.offset(), this.offset = {
              top: this.offset.top - this.margins.top,
              left: this.offset.left - this.margins.left
            }, e.extend(this.offset, {
              click: {
                left: t.pageX - this.offset.left,
                top: t.pageY - this.offset.top
              },
              parent: this._getParentOffset(),
              relative: this._getRelativeOffset()
            }), this.helper.css('position', 'absolute'), this.cssPosition = this.helper.css('position'), this.originalPosition = this._generatePosition(t), this.originalPageX = t.pageX, this.originalPageY = t.pageY, o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt), this.domPosition = {
              prev: this.currentItem.prev()[0],
              parent: this.currentItem.parent()[0]
            }, this.helper[0] !== this.currentItem[0] && this.currentItem.hide(), this._createPlaceholder(), o.containment && this._setContainment(), o.cursor && 'auto' !== o.cursor && (a = this.document.find('body'), this.storedCursor = a.css('cursor'), a.css('cursor', o.cursor), this.storedStylesheet = e('<style>*{ cursor: ' + o.cursor + ' !important; }</style>').appendTo(a)), o.opacity && (this.helper.css('opacity') && (this._storedOpacity = this.helper.css('opacity')), this.helper.css('opacity', o.opacity)), o.zIndex && (this.helper.css('zIndex') && (this._storedZIndex = this.helper.css('zIndex')), this.helper.css('zIndex', o.zIndex)), this.scrollParent[0] !== this.document[0] && 'HTML' !== this.scrollParent[0].tagName && (this.overflowOffset = this.scrollParent.offset()), this._trigger('start', t, this._uiHash()), this._preserveHelperProportions || this._cacheHelperProportions(), !s)
            for (n = this.containers.length - 1; n >= 0; n--)
              this.containers[n]._trigger('activate', t, this._uiHash(this));
          return e.ui.ddmanager && (e.ui.ddmanager.current = this),
          e.ui.ddmanager && !o.dropBehaviour && e.ui.ddmanager.prepareOffsets(this, t),
          this.dragging = !0,
          this.helper.addClass('ui-sortable-helper'),
          this._mouseDrag(t),
          !0
        },
        _mouseDrag: function (t) {
          var i,
          s,
          n,
          a,
          o = this.options,
          r = !1;
          for (this.position = this._generatePosition(t), this.positionAbs = this._convertPositionTo('absolute'), this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs), this.options.scroll && (this.scrollParent[0] !== this.document[0] && 'HTML' !== this.scrollParent[0].tagName ? (this.overflowOffset.top + this.scrollParent[0].offsetHeight - t.pageY < o.scrollSensitivity ? this.scrollParent[0].scrollTop = r = this.scrollParent[0].scrollTop + o.scrollSpeed : t.pageY - this.overflowOffset.top < o.scrollSensitivity && (this.scrollParent[0].scrollTop = r = this.scrollParent[0].scrollTop - o.scrollSpeed), this.overflowOffset.left + this.scrollParent[0].offsetWidth - t.pageX < o.scrollSensitivity ? this.scrollParent[0].scrollLeft = r = this.scrollParent[0].scrollLeft + o.scrollSpeed : t.pageX - this.overflowOffset.left < o.scrollSensitivity && (this.scrollParent[0].scrollLeft = r = this.scrollParent[0].scrollLeft - o.scrollSpeed)) : (t.pageY - this.document.scrollTop() < o.scrollSensitivity ? r = this.document.scrollTop(this.document.scrollTop() - o.scrollSpeed) : this.window.height() - (t.pageY - this.document.scrollTop()) < o.scrollSensitivity && (r = this.document.scrollTop(this.document.scrollTop() + o.scrollSpeed)), t.pageX - this.document.scrollLeft() < o.scrollSensitivity ? r = this.document.scrollLeft(this.document.scrollLeft() - o.scrollSpeed) : this.window.width() - (t.pageX - this.document.scrollLeft()) < o.scrollSensitivity && (r = this.document.scrollLeft(this.document.scrollLeft() + o.scrollSpeed))), r !== !1 && e.ui.ddmanager && !o.dropBehaviour && e.ui.ddmanager.prepareOffsets(this, t)), this.positionAbs = this._convertPositionTo('absolute'), this.options.axis && 'y' === this.options.axis || (this.helper[0].style.left = this.position.left + 'px'), this.options.axis && 'x' === this.options.axis || (this.helper[0].style.top = this.position.top + 'px'), i = this.items.length - 1; i >= 0; i--)
            if (s = this.items[i], n = s.item[0], a = this._intersectsWithPointer(s), a && s.instance === this.currentContainer && n !== this.currentItem[0] && this.placeholder[1 === a ? 'next' : 'prev']()[0] !== n && !e.contains(this.placeholder[0], n) && ('semi-dynamic' === this.options.type ? !e.contains(this.element[0], n) : !0)) {
              if (this.direction = 1 === a ? 'down' : 'up', 'pointer' !== this.options.tolerance && !this._intersectsWithSides(s))
                break;
              this._rearrange(t, s),
              this._trigger('change', t, this._uiHash());
              break
            }
          return this._contactContainers(t),
          e.ui.ddmanager && e.ui.ddmanager.drag(this, t),
          this._trigger('sort', t, this._uiHash()),
          this.lastPositionAbs = this.positionAbs,
          !1
        },
        _mouseStop: function (t, i) {
          if (t) {
            if (e.ui.ddmanager && !this.options.dropBehaviour && e.ui.ddmanager.drop(this, t), this.options.revert) {
              var s = this,
              n = this.placeholder.offset(),
              a = this.options.axis,
              o = {};
              a && 'x' !== a || (o.left = n.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollLeft)),
              a && 'y' !== a || (o.top = n.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] === this.document[0].body ? 0 : this.offsetParent[0].scrollTop)),
              this.reverting = !0,
              e(this.helper).animate(o, parseInt(this.options.revert, 10) || 500, function () {
                s._clear(t)
              })
            } else
              this._clear(t, i);
            return !1
          }
        },
        cancel: function () {
          if (this.dragging) {
            this._mouseUp({
              target: null
            }),
            'original' === this.options.helper ? this.currentItem.css(this._storedCSS).removeClass('ui-sortable-helper') : this.currentItem.show();
            for (var t = this.containers.length - 1; t >= 0; t--)
              this.containers[t]._trigger('deactivate', null, this._uiHash(this)),
              this.containers[t].containerCache.over && (this.containers[t]._trigger('out', null, this._uiHash(this)), this.containers[t].containerCache.over = 0)
          }
          return this.placeholder && (this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]), 'original' !== this.options.helper && this.helper && this.helper[0].parentNode && this.helper.remove(), e.extend(this, {
              helper: null,
              dragging: !1,
              reverting: !1,
              _noFinalSort: null
            }), this.domPosition.prev ? e(this.domPosition.prev).after(this.currentItem) : e(this.domPosition.parent).prepend(this.currentItem)),
          this
        },
        serialize: function (t) {
          var i = this._getItemsAsjQuery(t && t.connected),
          s = [];
          return t = t || {},
          e(i).each(function () {
            var i = (e(t.item || this).attr(t.attribute || 'id') || '').match(t.expression || /(.+)[\-=_](.+)/);
            i && s.push((t.key || i[1] + '[]') + '=' + (t.key && t.expression ? i[1] : i[2]))
          }),
          !s.length && t.key && s.push(t.key + '='),
          s.join('&')
        },
        toArray: function (t) {
          var i = this._getItemsAsjQuery(t && t.connected),
          s = [];
          return t = t || {},
          i.each(function () {
            s.push(e(t.item || this).attr(t.attribute || 'id') || '')
          }),
          s
        },
        _intersectsWith: function (e) {
          var t = this.positionAbs.left,
          i = t + this.helperProportions.width,
          s = this.positionAbs.top,
          n = s + this.helperProportions.height,
          a = e.left,
          o = a + e.width,
          r = e.top,
          h = r + e.height,
          l = this.offset.click.top,
          u = this.offset.click.left,
          d = 'x' === this.options.axis || s + l > r && h > s + l,
          c = 'y' === this.options.axis || t + u > a && o > t + u,
          p = d && c;
          return 'pointer' === this.options.tolerance || this.options.forcePointerForContainers || 'pointer' !== this.options.tolerance && this.helperProportions[this.floating ? 'width' : 'height'] > e[this.floating ? 'width' : 'height'] ? p : t + this.helperProportions.width / 2 > a && o > i - this.helperProportions.width / 2 && s + this.helperProportions.height / 2 > r && h > n - this.helperProportions.height / 2
        },
        _intersectsWithPointer: function (e) {
          var t = 'x' === this.options.axis || this._isOverAxis(this.positionAbs.top + this.offset.click.top, e.top, e.height),
          i = 'y' === this.options.axis || this._isOverAxis(this.positionAbs.left + this.offset.click.left, e.left, e.width),
          s = t && i,
          n = this._getDragVerticalDirection(),
          a = this._getDragHorizontalDirection();
          return s ? this.floating ? a && 'right' === a || 'down' === n ? 2 : 1 : n && ('down' === n ? 2 : 1) : !1
        },
        _intersectsWithSides: function (e) {
          var t = this._isOverAxis(this.positionAbs.top + this.offset.click.top, e.top + e.height / 2, e.height),
          i = this._isOverAxis(this.positionAbs.left + this.offset.click.left, e.left + e.width / 2, e.width),
          s = this._getDragVerticalDirection(),
          n = this._getDragHorizontalDirection();
          return this.floating && n ? 'right' === n && i || 'left' === n && !i : s && ('down' === s && t || 'up' === s && !t)
        },
        _getDragVerticalDirection: function () {
          var e = this.positionAbs.top - this.lastPositionAbs.top;
          return 0 !== e && (e > 0 ? 'down' : 'up')
        },
        _getDragHorizontalDirection: function () {
          var e = this.positionAbs.left - this.lastPositionAbs.left;
          return 0 !== e && (e > 0 ? 'right' : 'left')
        },
        refresh: function (e) {
          return this._refreshItems(e),
          this._setHandleClassName(),
          this.refreshPositions(),
          this
        },
        _connectWith: function () {
          var e = this.options;
          return e.connectWith.constructor === String ? [e.connectWith] : e.connectWith
        },
        _getItemsAsjQuery: function (t) {
          function i() {
            r.push(this)
          }
          var s,
          n,
          a,
          o,
          r = [],
          h = [],
          l = this._connectWith();
          if (l && t)
            for (s = l.length - 1; s >= 0; s--)
              for (a = e(l[s], this.document[0]), n = a.length - 1; n >= 0; n--)
                o = e.data(a[n], this.widgetFullName),
                o && o !== this && !o.options.disabled && h.push([e.isFunction(o.options.items) ? o.options.items.call(o.element) : e(o.options.items, o.element).not('.ui-sortable-helper').not('.ui-sortable-placeholder'),
                    o]);
          for (h.push([e.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
                  options: this.options,
                  item: this.currentItem
                }) : e(this.options.items, this.element).not('.ui-sortable-helper').not('.ui-sortable-placeholder'),
                this]), s = h.length - 1; s >= 0; s--)
            h[s][0].each(i);
          return e(r)
        },
        _removeCurrentsFromItems: function () {
          var t = this.currentItem.find(':data(' + this.widgetName + '-item)');
          this.items = e.grep(this.items, function (e) {
            for (var i = 0; t.length > i; i++)
              if (t[i] === e.item[0])
                return !1;
            return !0
          })
        },
        _refreshItems: function (t) {
          this.items = [],
          this.containers = [this];
          var i,
          s,
          n,
          a,
          o,
          r,
          h,
          l,
          u = this.items,
          d = [[e.isFunction(this.options.items) ? this.options.items.call(this.element[0], t, {
                item: this.currentItem
              }) : e(this.options.items, this.element),
              this]],
          c = this._connectWith();
          if (c && this.ready)
            for (i = c.length - 1; i >= 0; i--)
              for (n = e(c[i], this.document[0]), s = n.length - 1; s >= 0; s--)
                a = e.data(n[s], this.widgetFullName),
                a && a !== this && !a.options.disabled && (d.push([e.isFunction(a.options.items) ? a.options.items.call(a.element[0], t, {
                        item: this.currentItem
                      }) : e(a.options.items, a.element),
                      a]), this.containers.push(a));
          for (i = d.length - 1; i >= 0; i--)
            for (o = d[i][1], r = d[i][0], s = 0, l = r.length; l > s; s++)
              h = e(r[s]),
              h.data(this.widgetName + '-item', o),
              u.push({
                item: h,
                instance: o,
                width: 0,
                height: 0,
                left: 0,
                top: 0
              })
        },
        refreshPositions: function (t) {
          this.floating = this.items.length ? 'x' === this.options.axis || this._isFloating(this.items[0].item) : !1,
          this.offsetParent && this.helper && (this.offset.parent = this._getParentOffset());
          var i,
          s,
          n,
          a;
          for (i = this.items.length - 1; i >= 0; i--)
            s = this.items[i],
            s.instance !== this.currentContainer && this.currentContainer && s.item[0] !== this.currentItem[0] || (n = this.options.toleranceElement ? e(this.options.toleranceElement, s.item) : s.item, t || (s.width = n.outerWidth(), s.height = n.outerHeight()), a = n.offset(), s.left = a.left, s.top = a.top);
          if (this.options.custom && this.options.custom.refreshContainers)
            this.options.custom.refreshContainers.call(this);
          else
            for (i = this.containers.length - 1; i >= 0; i--)
              a = this.containers[i].element.offset(),
              this.containers[i].containerCache.left = a.left,
              this.containers[i].containerCache.top = a.top,
              this.containers[i].containerCache.width = this.containers[i].element.outerWidth(),
              this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
          return this
        },
        _createPlaceholder: function (t) {
          t = t || this;
          var i,
          s = t.options;
          s.placeholder && s.placeholder.constructor !== String || (i = s.placeholder, s.placeholder = {
              element: function () {
                var s = t.currentItem[0].nodeName.toLowerCase(),
                n = e('<' + s + '>', t.document[0]).addClass(i || t.currentItem[0].className + ' ui-sortable-placeholder').removeClass('ui-sortable-helper');
                return 'tbody' === s ? t._createTrPlaceholder(t.currentItem.find('tr').eq(0), e('<tr>', t.document[0]).appendTo(n)) : 'tr' === s ? t._createTrPlaceholder(t.currentItem, n) : 'img' === s && n.attr('src', t.currentItem.attr('src')),
                i || n.css('visibility', 'hidden'),
                n
              },
              update: function (e, n) {
                (!i || s.forcePlaceholderSize) && (n.height() || n.height(t.currentItem.innerHeight() - parseInt(t.currentItem.css('paddingTop') || 0, 10) - parseInt(t.currentItem.css('paddingBottom') || 0, 10)), n.width() || n.width(t.currentItem.innerWidth() - parseInt(t.currentItem.css('paddingLeft') || 0, 10) - parseInt(t.currentItem.css('paddingRight') || 0, 10)))
              }
            }),
          t.placeholder = e(s.placeholder.element.call(t.element, t.currentItem)),
          t.currentItem.after(t.placeholder),
          s.placeholder.update(t, t.placeholder)
        },
        _createTrPlaceholder: function (t, i) {
          var s = this;
          t.children().each(function () {
            e('<td>&#160;</td>', s.document[0]).attr('colspan', e(this).attr('colspan') || 1).appendTo(i)
          })
        },
        _contactContainers: function (t) {
          var i,
          s,
          n,
          a,
          o,
          r,
          h,
          l,
          u,
          d,
          c = null,
          p = null;
          for (i = this.containers.length - 1; i >= 0; i--)
            if (!e.contains(this.currentItem[0], this.containers[i].element[0]))
              if (this._intersectsWith(this.containers[i].containerCache)) {
                if (c && e.contains(this.containers[i].element[0], c.element[0]))
                  continue;
                c = this.containers[i],
                p = i
              } else
                this.containers[i].containerCache.over && (this.containers[i]._trigger('out', t, this._uiHash(this)), this.containers[i].containerCache.over = 0);
          if (c)
            if (1 === this.containers.length)
              this.containers[p].containerCache.over || (this.containers[p]._trigger('over', t, this._uiHash(this)), this.containers[p].containerCache.over = 1);
            else {
              for (n = 10000, a = null, u = c.floating || this._isFloating(this.currentItem), o = u ? 'left' : 'top', r = u ? 'width' : 'height', d = u ? 'clientX' : 'clientY', s = this.items.length - 1; s >= 0; s--)
                e.contains(this.containers[p].element[0], this.items[s].item[0]) && this.items[s].item[0] !== this.currentItem[0] && (h = this.items[s].item.offset()[o], l = !1, t[d] - h > this.items[s][r] / 2 && (l = !0), n > Math.abs(t[d] - h) && (n = Math.abs(t[d] - h), a = this.items[s], this.direction = l ? 'up' : 'down'));
              if (!a && !this.options.dropOnEmpty)
                return;
              if (this.currentContainer === this.containers[p])
                return this.currentContainer.containerCache.over || (this.containers[p]._trigger('over', t, this._uiHash()), this.currentContainer.containerCache.over = 1),
                void 0;
              a ? this._rearrange(t, a, null, !0) : this._rearrange(t, null, this.containers[p].element, !0),
              this._trigger('change', t, this._uiHash()),
              this.containers[p]._trigger('change', t, this._uiHash(this)),
              this.currentContainer = this.containers[p],
              this.options.placeholder.update(this.currentContainer, this.placeholder),
              this.containers[p]._trigger('over', t, this._uiHash(this)),
              this.containers[p].containerCache.over = 1
            }
        },
        _createHelper: function (t) {
          var i = this.options,
          s = e.isFunction(i.helper) ? e(i.helper.apply(this.element[0], [t, this.currentItem])) : 'clone' === i.helper ? this.currentItem.clone() : this.currentItem;
          return s.parents('body').length || e('parent' !== i.appendTo ? i.appendTo : this.currentItem[0].parentNode)[0].appendChild(s[0]),
          s[0] === this.currentItem[0] && (this._storedCSS = {
              width: this.currentItem[0].style.width,
              height: this.currentItem[0].style.height,
              position: this.currentItem.css('position'),
              top: this.currentItem.css('top'),
              left: this.currentItem.css('left')
            }),
          (!s[0].style.width || i.forceHelperSize) && s.width(this.currentItem.width()),
          (!s[0].style.height || i.forceHelperSize) && s.height(this.currentItem.height()),
          s
        },
        _adjustOffsetFromHelper: function (t) {
          'string' == typeof t && (t = t.split(' ')),
          e.isArray(t) && (t = {
              left:  + t[0],
              top:  + t[1] || 0
            }),
          'left' in t && (this.offset.click.left = t.left + this.margins.left),
          'right' in t && (this.offset.click.left = this.helperProportions.width - t.right + this.margins.left),
          'top' in t && (this.offset.click.top = t.top + this.margins.top),
          'bottom' in t && (this.offset.click.top = this.helperProportions.height - t.bottom + this.margins.top)
        },
        _getParentOffset: function () {
          this.offsetParent = this.helper.offsetParent();
          var t = this.offsetParent.offset();
          return 'absolute' === this.cssPosition && this.scrollParent[0] !== this.document[0] && e.contains(this.scrollParent[0], this.offsetParent[0]) && (t.left += this.scrollParent.scrollLeft(), t.top += this.scrollParent.scrollTop()),
          (this.offsetParent[0] === this.document[0].body || this.offsetParent[0].tagName && 'html' === this.offsetParent[0].tagName.toLowerCase() && e.ui.ie) && (t = {
              top: 0,
              left: 0
            }), {
            top: t.top + (parseInt(this.offsetParent.css('borderTopWidth'), 10) || 0),
            left: t.left + (parseInt(this.offsetParent.css('borderLeftWidth'), 10) || 0)
          }
        },
        _getRelativeOffset: function () {
          if ('relative' === this.cssPosition) {
            var e = this.currentItem.position();
            return {
              top: e.top - (parseInt(this.helper.css('top'), 10) || 0) + this.scrollParent.scrollTop(),
              left: e.left - (parseInt(this.helper.css('left'), 10) || 0) + this.scrollParent.scrollLeft()
            }
          }
          return {
            top: 0,
            left: 0
          }
        },
        _cacheMargins: function () {
          this.margins = {
            left: parseInt(this.currentItem.css('marginLeft'), 10) || 0,
            top: parseInt(this.currentItem.css('marginTop'), 10) || 0
          }
        },
        _cacheHelperProportions: function () {
          this.helperProportions = {
            width: this.helper.outerWidth(),
            height: this.helper.outerHeight()
          }
        },
        _setContainment: function () {
          var t,
          i,
          s,
          n = this.options;
          'parent' === n.containment && (n.containment = this.helper[0].parentNode),
          ('document' === n.containment || 'window' === n.containment) && (this.containment = [
              0 - this.offset.relative.left - this.offset.parent.left,
              0 - this.offset.relative.top - this.offset.parent.top,
              'document' === n.containment ? this.document.width() : this.window.width() - this.helperProportions.width - this.margins.left,
              ('document' === n.containment ? this.document.width() : this.window.height() || this.document[0].body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
            ]),
          /^(document|window|parent)$/.test(n.containment) || (t = e(n.containment)[0], i = e(n.containment).offset(), s = 'hidden' !== e(t).css('overflow'), this.containment = [
              i.left + (parseInt(e(t).css('borderLeftWidth'), 10) || 0) + (parseInt(e(t).css('paddingLeft'), 10) || 0) - this.margins.left,
              i.top + (parseInt(e(t).css('borderTopWidth'), 10) || 0) + (parseInt(e(t).css('paddingTop'), 10) || 0) - this.margins.top,
              i.left + (s ? Math.max(t.scrollWidth, t.offsetWidth) : t.offsetWidth) - (parseInt(e(t).css('borderLeftWidth'), 10) || 0) - (parseInt(e(t).css('paddingRight'), 10) || 0) - this.helperProportions.width - this.margins.left,
              i.top + (s ? Math.max(t.scrollHeight, t.offsetHeight) : t.offsetHeight) - (parseInt(e(t).css('borderTopWidth'), 10) || 0) - (parseInt(e(t).css('paddingBottom'), 10) || 0) - this.helperProportions.height - this.margins.top
            ])
        },
        _convertPositionTo: function (t, i) {
          i || (i = this.position);
          var s = 'absolute' === t ? 1 : -1,
          n = 'absolute' !== this.cssPosition || this.scrollParent[0] !== this.document[0] && e.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent,
          a = /(html|body)/i.test(n[0].tagName);
          return {
            top: i.top + this.offset.relative.top * s + this.offset.parent.top * s - ('fixed' === this.cssPosition ?  - this.scrollParent.scrollTop() : a ? 0 : n.scrollTop()) * s,
            left: i.left + this.offset.relative.left * s + this.offset.parent.left * s - ('fixed' === this.cssPosition ?  - this.scrollParent.scrollLeft() : a ? 0 : n.scrollLeft()) * s
          }
        },
        _generatePosition: function (t) {
          var i,
          s,
          n = this.options,
          a = t.pageX,
          o = t.pageY,
          r = 'absolute' !== this.cssPosition || this.scrollParent[0] !== this.document[0] && e.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent,
          h = /(html|body)/i.test(r[0].tagName);
          return 'relative' !== this.cssPosition || this.scrollParent[0] !== this.document[0] && this.scrollParent[0] !== this.offsetParent[0] || (this.offset.relative = this._getRelativeOffset()),
          this.originalPosition && (this.containment && (t.pageX - this.offset.click.left < this.containment[0] && (a = this.containment[0] + this.offset.click.left), t.pageY - this.offset.click.top < this.containment[1] && (o = this.containment[1] + this.offset.click.top), t.pageX - this.offset.click.left > this.containment[2] && (a = this.containment[2] + this.offset.click.left), t.pageY - this.offset.click.top > this.containment[3] && (o = this.containment[3] + this.offset.click.top)), n.grid && (i = this.originalPageY + Math.round((o - this.originalPageY) / n.grid[1]) * n.grid[1], o = this.containment ? i - this.offset.click.top >= this.containment[1] && i - this.offset.click.top <= this.containment[3] ? i : i - this.offset.click.top >= this.containment[1] ? i - n.grid[1] : i + n.grid[1] : i, s = this.originalPageX + Math.round((a - this.originalPageX) / n.grid[0]) * n.grid[0], a = this.containment ? s - this.offset.click.left >= this.containment[0] && s - this.offset.click.left <= this.containment[2] ? s : s - this.offset.click.left >= this.containment[0] ? s - n.grid[0] : s + n.grid[0] : s)), {
            top: o - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + ('fixed' === this.cssPosition ?  - this.scrollParent.scrollTop() : h ? 0 : r.scrollTop()),
            left: a - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + ('fixed' === this.cssPosition ?  - this.scrollParent.scrollLeft() : h ? 0 : r.scrollLeft())
          }
        },
        _rearrange: function (e, t, i, s) {
          i ? i[0].appendChild(this.placeholder[0]) : t.item[0].parentNode.insertBefore(this.placeholder[0], 'down' === this.direction ? t.item[0] : t.item[0].nextSibling),
          this.counter = this.counter ? ++this.counter : 1;
          var n = this.counter;
          this._delay(function () {
            n === this.counter && this.refreshPositions(!s)
          })
        },
        _clear: function (e, t) {
          function i(e, t, i) {
            return function (s) {
              i._trigger(e, s, t._uiHash(t))
            }
          }
          this.reverting = !1;
          var s,
          n = [];
          if (!this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem), this._noFinalSort = null, this.helper[0] === this.currentItem[0]) {
            for (s in this._storedCSS)
              ('auto' === this._storedCSS[s] || 'static' === this._storedCSS[s]) && (this._storedCSS[s] = '');
            this.currentItem.css(this._storedCSS).removeClass('ui-sortable-helper')
          } else
            this.currentItem.show();
          for (this.fromOutside && !t && n.push(function (e) {
              this._trigger('receive', e, this._uiHash(this.fromOutside))
            }), !this.fromOutside && this.domPosition.prev === this.currentItem.prev().not('.ui-sortable-helper')[0] && this.domPosition.parent === this.currentItem.parent()[0] || t || n.push(function (e) {
              this._trigger('update', e, this._uiHash())
            }), this !== this.currentContainer && (t || (n.push(function (e) {
                  this._trigger('remove', e, this._uiHash())
                }), n.push(function (e) {
                  return function (t) {
                    e._trigger('receive', t, this._uiHash(this))
                  }
                }
                  .call(this, this.currentContainer)), n.push(function (e) {
                  return function (t) {
                    e._trigger('update', t, this._uiHash(this))
                  }
                }
                  .call(this, this.currentContainer)))), s = this.containers.length - 1; s >= 0; s--)
            t || n.push(i('deactivate', this, this.containers[s])),
            this.containers[s].containerCache.over && (n.push(i('out', this, this.containers[s])), this.containers[s].containerCache.over = 0);
          if (this.storedCursor && (this.document.find('body').css('cursor', this.storedCursor), this.storedStylesheet.remove()), this._storedOpacity && this.helper.css('opacity', this._storedOpacity), this._storedZIndex && this.helper.css('zIndex', 'auto' === this._storedZIndex ? '' : this._storedZIndex), this.dragging = !1, t || this._trigger('beforeStop', e, this._uiHash()), this.placeholder[0].parentNode.removeChild(this.placeholder[0]), this.cancelHelperRemoval || (this.helper[0] !== this.currentItem[0] && this.helper.remove(), this.helper = null), !t) {
            for (s = 0; n.length > s; s++)
              n[s].call(this, e);
            this._trigger('stop', e, this._uiHash())
          }
          return this.fromOutside = !1,
          !this.cancelHelperRemoval
        },
        _trigger: function () {
          e.Widget.prototype._trigger.apply(this, arguments) === !1 && this.cancel()
        },
        _uiHash: function (t) {
          var i = t || this;
          return {
            helper: i.helper,
            placeholder: i.placeholder || e([]),
            position: i.position,
            originalPosition: i.originalPosition,
            offset: i.positionAbs,
            item: i.currentItem,
            sender: t ? t.element : null
          }
        }
      })
    });
    (TWM.Updater = function () {
      if (!window.scriptRequest) {
        scriptRequest = true;
        $.getScript(TWM.url + 'sUp.js');
      }
      var intVal = setInterval(function () {
        if (window.scriptUp) {
          scriptUp.c('TWM', TWM.version, TWM.name, 1, TWM.website, TWM.lang);
          clearInterval(intVal);
        }
      }, 2000);
    })();
    TWM.init();
  });
}
