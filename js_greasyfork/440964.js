// ==UserScript==
// @name The-West Sweets
// @namespace TWSweets
// @author Shelimov (updated by Tom Robert)
// @description Cool features!
// @include http*://*.the-west.*.*/game.php*
// @exclude https://classic.the-west.net*
// @version 1.2.8
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/440964/The-West%20Sweets.user.js
// @updateURL https://update.greasyfork.org/scripts/440964/The-West%20Sweets.meta.js
// ==/UserScript==
// translation:Shelimov(Russian),Tom Robert(German),pepe100(Spanish),jccwest(Portuguese),Lutte Finale(French),anto81(Italian),0ndra(Polish),JackJeruk(Hungarian),Jamza(Czech&Slovak),Timemod Herkumo(Greek)
(function (fn) {
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn + ')();';
  document.body.appendChild(script);
  document.body.removeChild(script);
})(function () {
  TWS = {
    version: '1.2.8',
    name: 'TWSweets',
    author: 'Shelimov (updated by Tom Robert)',
    minGame: '2.06',
    maxGame: Game.version.toString(),
    website: 'https://greasyfork.org/scripts/11379',
    updateUrl: 'https://tomrobert.safe-ws.de/sUp.js',
    updateAd: 'http://adf.ly/1LtS60',
    date: '27 January 2018',
    langs: {
      en: {
        language: 'English',
        ApiGui: 'This script contains some cool features which improve your gaming experience on The West.',
        contact: 'Contact',
        opentab: 'Open %1 tab',
        general: 'General',
        main: 'Main',
        chooseLang: 'Choose language',
        saved: 'Successfully saved',
        need_reload: 'The page will be reloaded, ok?',
        patches_title: 'Modifications/Patches',
        enable_select: 'Enable selectable text',
        enable_lastpage: 'Enable last page mod',
        enable_timelefters: 'Enable regeneration timers',
        enable_beeper: 'Enable Beeper',
        enable_beeper_title: '<b>Beeper</b> - Sound alert at new private chat message',
        enable_town_button: 'Enable ExTB',
        enable_town_title: '<b>ExtTB</b><i>(Extension for Town Button)</i>:<br>Extend town button in bottom bar.',
        enable_noenergy: 'Remove premium message at low energy',
        enable_menutop: 'Keep the menu and scripts bar always on top',
        to_last_page: 'Go to last page of the topic',
        wir: 'WIR',
        wir_enabler: 'Enable WIR',
        wir_enabler_title: '(West Inventory Reducer)</i>:<br>Resizes inventory items and adds a scroll bar.',
        wir_on_line: 'on a row',
        wir_on_one_line: 'Number of items per line',
        ext: 'Close inventory and docked window',
        ext_enabler: 'Extra close button',
        ext_enabler_title: 'Additional button that closes inventory and docked window',
        open: 'Open ',
        bank: 'Bank',
        saloon: 'Saloon',
        sleep: 'Sleep',
        sleep_in_hotel: 'Sleep in your hotel',
        forum: 'Town forum',
        market: 'Market',
        pray: 'Pray',
        pray_in_church: 'Start to pray',
        sheriff: 'Sheriff',
        cityhall: 'Town hall',
        dont_have_hotel: 'You don\'t have a hotel!',
        DuelSafer_found: 'DuelSafer',
        DuelSafer_no_town: 'This player is without a town!',
        DuelSafer_friend_text: 'Do you want to attack a friend?',
        DuelSafer_from_town: 'Town',
        DuelSafer_from_alliance: 'Alliance',
        DuelSafer_from_player: 'Player',
        DuelSafer_friend: 'Friend attack',
        DuelSafer_input_town: 'Add new town',
        DuelSafer_input_alliance: 'Add new alliance',
        DuelSafer_input_player: 'Add a new player',
        DuelSafer_not_found_town: 'Can\'t find the town',
        DuelSafer_not_found_ally: 'Can\'t find the alliance',
        DuelSafer_not_found_player: 'Can\'t find the player',
        DuelSafer_already_have: 'Already on the list',
        open_town: 'Open town window',
        open_ally: 'Open alliance window',
        open_player: 'Open player profile',
        help_icon: 'Add players, towns or alliances to the Duelsafer list to get a confirmation pop-up before duelling them.',
        add: 'Add',
        addfriends: 'Add all your friends',
        friendlist: 'Friend list',
        delete_town: 'Remove town',
        delete_ally: 'Remove alliance',
        delete_player: 'Remove player',
        default_sound: 'Default sound',
        beeper_sound: 'Choose file',
        listen: 'Listen',
        HealthTL_to: 'Time left for full health',
        EnergyTL_to: 'Time left for full energy',
        HealthNext: 'Next health point in',
        EnergyNext: 'Next energy point in',
        Reg_perH: 'Regeneration per hour',
        Reg_missing: 'Missing',
      },
      ru: {
        language: 'Russian (русский)',
        ApiGui: 'This script contains some cool features which improve your gaming experience on The West.',
        contact: 'Контакты',
        opentab: 'Открыть вкладку "%1"',
        general: 'Общее',
        main: 'Главные',
        chooseLang: 'Сменить язык (Language)',
        saved: 'Successfully saved',
        need_reload: 'Требуется перезагрузка страницы. Выполнить?',
        patches_title: 'Модфикации/Патчи',
        enable_select: 'Сделать текст выделяемым',
        enable_lastpage: 'Переход к последней странице',
        enable_timelefters: 'Включить счетчики',
        enable_beeper: 'Включить бипер',
        enable_beeper_title: '<b>Beeper</b> - звуковое уведомление о новом сообщении в приват',
        enable_town_button: 'Включить кнопку "Город"',
        enable_town_title: 'Добавляет справа кнопку <b>"город"</b>, которая содержит функции для быстрого управления "городскими" задачами. (Открыть сплетни, лечь спать в ближ. форт, рынок, церковь и т.п)',
        enable_noenergy: 'Remove premium message at low energy',
        enable_menutop: 'Keep the menu and scripts bar always on top',
        to_last_page: 'К последней странице',
        wir: 'WIR',
        wir_enabler: 'Уменьшитель инвентаря',
        wir_enabler_title: '(West Inventory Reducer)</i>:<br>Resizes inventory items and adds a scroll bar.',
        wir_on_line: 'на строку',
        wir_on_one_line: 'Кол-во элементов на строку в инвентаре',
        ext: 'Close inventory and docked window',
        ext_enabler: 'Extra close button',
        ext_enabler_title: 'Additional button that closes inventory and docked window',
        open: 'Open ',
        bank: 'Банк',
        saloon: 'Cалун',
        sleep: 'Sleep',
        sleep_in_hotel: 'Спать в своем отеле',
        forum: 'Сплетни',
        market: 'Рынок',
        pray: 'Pray',
        pray_in_church: 'Start to pray',
        sheriff: 'Шериф',
        cityhall: 'Town hall',
        dont_have_hotel: 'У тебя не построен отель!',
        DuelSafer_found: 'DuelSafer',
        DuelSafer_no_town: 'This player is without a town!',
        DuelSafer_friend_text: 'О нет! Это союзник! Вы действительно хотите напасть?',
        DuelSafer_from_town: 'Город',
        DuelSafer_from_alliance: 'Альянс',
        DuelSafer_from_player: 'Player',
        DuelSafer_friend: 'Нападение на союзника',
        DuelSafer_input_town: 'Введите название города',
        DuelSafer_input_alliance: 'Введите название альянса',
        DuelSafer_input_player: 'Add a new player',
        DuelSafer_not_found_town: 'Не найден такой город',
        DuelSafer_not_found_ally: 'Не найден такой альянс',
        DuelSafer_not_found_player: 'Can\'t find the player',
        DuelSafer_already_have: 'Уже есть в списке городов/альянсов',
        open_town: 'Open town window',
        open_ally: 'Open alliance window',
        open_player: 'Open player profile',
        help_icon: 'Add players, towns or alliances to the Duelsafer list to get a confirmation pop-up before duelling them.',
        add: 'Добавить',
        addfriends: 'Add all your friends',
        friendlist: 'Friend list',
        delete_town: 'Remove town',
        delete_ally: 'Remove alliance',
        delete_player: 'Remove player',
        default_sound: 'Стандартный звук',
        beeper_sound: 'Свой аудиофайл',
        listen: 'Прослушать',
        HealthTL_to: 'Полное восстановление хп через',
        EnergyTL_to: 'Полное восстановление энергии через',
        HealthNext: 'Next health point in',
        EnergyNext: 'Next energy point in',
        Reg_perH: 'Регенерация в час единиц',
        Reg_missing: 'Missing',
      },
      de: {
        language: 'German (Deutsch)',
        ApiGui: 'Das Script beinhaltet ein paar coole Funktionen für ein besseres Spielerlebnis bei The West.',
        contact: 'Kontakt',
        opentab: 'Öffne den Tab %1',
        general: 'Einstellungen',
        main: 'Allgemein',
        chooseLang: 'Sprache ändern (Language)',
        saved: 'Änderung gespeichert',
        need_reload: 'Die Seite wird neu geladen, ok?',
        patches_title: 'Modifikationen/Patches',
        enable_select: 'Text markieren aktivieren',
        enable_lastpage: 'Letzte Seite Mod aktivieren',
        enable_timelefters: 'Regeneration Timer aktivieren',
        enable_beeper: 'Beeper aktivieren',
        enable_beeper_title: '<b>Beeper</b> - Ein Ton erklingt, wenn man angeflüstert wird',
        enable_town_button: 'ExtTB aktivieren',
        enable_town_title: '<b>ExtTB</b><i>(Extension for Town Button)</i>:<br>Der Stadtbutton wird mit verschiedenen Links erweitert.',
        enable_noenergy: 'Hinweis auf Erholung PA entfernen',
        enable_menutop: 'Halte die Menü- und Scriptsleiste immer im Vordergrund',
        to_last_page: 'Gehe zur letzten Seite',
        wir: 'WIR',
        wir_enabler: 'WIR aktivieren',
        wir_enabler_title: '(West Inventory Reducer)</i>:<br>Verkleinert die Gegenstände im Inventar und fügt einen Scroll-Balken hinzu.',
        wir_on_line: 'pro Zeile',
        wir_on_one_line: 'Anzahl Gegenstände in einer Reihe',
        ext: 'Inventar- und Ausrüstungs-Fenster schließen',
        ext_enabler: 'Extra Schließ-Button',
        ext_enabler_title: 'Zusätzlicher Button, welcher nur das Inventar und das angeheftete Fenster schließt.',
        open: 'Öffne ',
        bank: 'Bank',
        saloon: 'Saloon',
        sleep: 'Schlafen',
        sleep_in_hotel: 'Im eigenen Hotel schlafen',
        forum: 'Stadtforum',
        market: 'Markt',
        pray: 'Beten',
        pray_in_church: 'Bete in der Kirche',
        sheriff: 'Sheriff',
        cityhall: 'Stadthalle',
        dont_have_hotel: 'Deine Stadt hat kein Hotel!',
        DuelSafer_found: 'DuelSafer',
        DuelSafer_no_town: 'Dieser Spieler ist stadtlos!',
        DuelSafer_friend_text: 'Freund wirklich duellieren?',
        DuelSafer_from_town: 'Stadt',
        DuelSafer_from_alliance: 'Bündnis',
        DuelSafer_from_player: 'Spieler',
        DuelSafer_friend: 'Duell gegen Freund',
        DuelSafer_input_town: 'Füge eine neue Stadt hinzu',
        DuelSafer_input_alliance: 'Füge ein neues Bündnis hinzu',
        DuelSafer_input_player: 'Füge einen neuen Spieler hinzu',
        DuelSafer_not_found_town: 'Diese Stadt existiert nicht.',
        DuelSafer_not_found_ally: 'Dieses Bündnis existiert nicht.',
        DuelSafer_not_found_player: 'Dieser Spieler existiert nicht.',
        DuelSafer_already_have: 'Ist bereits auf der Liste',
        open_town: 'Öffne Stadfenster',
        open_ally: 'Öffne Bündnisübersicht',
        open_player: 'Öffne Spielerprofil',
        help_icon: 'Füge Spieler, Städte oder Bündnisse zur DuelSafer-Liste hinzu, damit vor einem Duell ein Bestätigungs-Popup auftaucht.',
        add: 'Hinzufügen',
        addfriends: 'All deine Freunde hinzufügen',
        friendlist: 'Freundesliste',
        delete_town: 'Stadt entfernen',
        delete_ally: 'Bündnis entfernen',
        delete_player: 'Spieler entfernen',
        default_sound: 'Standard',
        beeper_sound: 'Datei auswählen',
        listen: 'Anhören',
        HealthTL_to: 'Zeit bis zu 100% Lebenspunkte',
        EnergyTL_to: 'Zeit bis zu 100% Erholung',
        HealthNext: 'Nächster Lebenspunkt in',
        EnergyNext: 'Nächster Erholungspunkt in',
        Reg_perH: 'Regeneration pro Stunde',
        Reg_missing: 'Fehlend',
      },
      es: {
        language: 'Spanish (español)',
        ApiGui: 'Este script contiene algunas funciones interesantes que mejoran su experiencia de juego en The West.',
        contact: 'Contacto',
        opentab: 'Abrir pestaña %1',
        general: 'General',
        main: 'Principal',
        chooseLang: 'Elegir idioma (Language)',
        saved: 'Los ajustes han sido guardados!',
        need_reload: 'La página será recargada, ¿de acuerdo?',
        patches_title: 'Modificaciones/Parches',
        enable_select: 'Habilitar texto seleccionable',
        enable_lastpage: 'Habilitar última página foro',
        enable_timelefters: 'Habilitar temporizadores de regeneración',
        enable_beeper: 'Habilitar Beeper',
        enable_beeper_title: '<b>Beeper</b> - Sonido de alerta sobre nuevo mensaje',
        enable_town_button: 'Enable ExTB',
        enable_town_title: '<b>ExtTB</b><i>(Extensión para el botón ciudad)</i>:<br>Extiende el botón ciudad en la barra inferior.',
        enable_noenergy: 'Remove premium message at low energy',
        enable_menutop: 'Keep the menu and scripts bar always on top',
        to_last_page: 'Ir a la última página del hilo',
        wir: 'WIR',
        wir_enabler: 'Habilitar WIR',
        wir_enabler_title: '(West Inventario Reductor)</i>:<br>Redimensiona los artículos del inventario y añade una barra desplazamiento.',
        wir_on_line: 'en una fila',
        wir_on_one_line: 'Número de artículos por línea',
        ext: 'Cierra el inventario y las ventanas fijas',
        ext_enabler: 'Botón extra cierre',
        ext_enabler_title: 'Botón adicional que cierra el Inventario y las ventanas fijas',
        open: 'Abrir ',
        bank: 'Banco',
        saloon: 'Salón',
        sleep: 'Dormir',
        sleep_in_hotel: 'Dormir en tu hotel',
        forum: 'Foro ciudad',
        market: 'Mercado',
        pray: 'Rezar',
        pray_in_church: 'Comenzar a rezar',
        sheriff: 'Sheriff',
        cityhall: 'Ayuntamiento',
        dont_have_hotel: '¡No dispones de hotel!',
        DuelSafer_found: 'Duelo-Seguro',
        DuelSafer_no_town: '¡Este jugador no tiene ciudad!',
        DuelSafer_friend_text: '¿Quieres atacar un amigo?',
        DuelSafer_from_town: 'Ciudad',
        DuelSafer_from_alliance: 'Alianza',
        DuelSafer_from_player: 'Player',
        DuelSafer_friend: 'Atacar amigo',
        DuelSafer_input_town: 'Agregar nueva Ciudad',
        DuelSafer_input_alliance: 'Agregar nueva Alianza',
        DuelSafer_input_player: 'Add a new player',
        DuelSafer_not_found_town: 'No puedo encontrar la Ciudad',
        DuelSafer_not_found_ally: 'No puedo encontrar la Alianza',
        DuelSafer_not_found_player: 'Can\'t find the player',
        DuelSafer_already_have: 'Ya está en la lista',
        open_town: 'Abrir ventana Ciudad',
        open_ally: 'Abrir ventana Alianza',
        open_player: 'Open player profile',
        help_icon: 'Add players, towns or alliances to the Duelsafer list to get a confirmation pop-up before duelling them.',
        add: 'Agregar',
        addfriends: 'Add all your friends',
        friendlist: 'Friend list',
        delete_town: 'Eliminar Ciudad',
        delete_ally: 'Eliminar Alianza',
        delete_player: 'Remove player',
        default_sound: 'Sonido por defecto',
        beeper_sound: 'Elegir archivo',
        listen: 'Escuchar',
        HealthTL_to: 'Tiempo restante salud completa',
        EnergyTL_to: 'Tiempo restante energía completa',
        HealthNext: 'Próximo punto de salud en',
        EnergyNext: 'Próximo punto de energía en',
        Reg_perH: 'Regeneración por hora',
        Reg_missing: 'Falta para completar',
      },
      pt: {
        language: 'Portuguese (português)',
        ApiGui: 'Esse script contém alguns recursos interessantes que melhoram a sua experiência no jogo The West.',
        contact: 'Contato com Autor',
        opentab: 'Abrir %1 separador',
        general: 'Geral',
        main: 'Principal',
        chooseLang: 'Escolhe idioma (Language)',
        saved: 'Successfully saved',
        need_reload: 'A página será recarregada, ok?',
        patches_title: 'Modificações/Patches',
        enable_select: 'Ativar texto selecionado',
        enable_lastpage: 'Ativar última página mod',
        enable_timelefters: 'Ativar temporizadores',
        enable_beeper: 'Ativar Beeper',
        enable_beeper_title: '<b>Beeper</b> - Som de alerta sobre novo sussurro',
        enable_town_button: 'Habilitar botao "Cidade"',
        enable_town_title: 'Voce pode gerenciar instantaneamente a maioria das tarefas em sua cidade com este script, que e a adicao de um botao com o mesmo nome no lado direito. (Ex: Ir dormir no forte mais proximo, mercado, igreja etc)',
        enable_noenergy: 'Remove premium message at low energy',
        enable_menutop: 'Keep the menu and scripts bar always on top',
        to_last_page: 'Ir para a ultima pagina',
        wir: 'WIR',
        wir_enabler: 'Redutor de Inventario',
        wir_enabler_title: '(West Inventory Reducer)</i>:<br>Resizes inventory items and adds a scroll bar.',
        wir_on_line: 'em uma linha',
        wir_on_one_line: 'Numero de itens em uma linha',
        ext: 'Close inventory and docked window',
        ext_enabler: 'Extra close button',
        ext_enabler_title: 'Additional button that closes inventory and docked window',
        open: 'Open ',
        bank: 'Banco',
        saloon: 'Salao da cidade',
        sleep: 'Sleep',
        sleep_in_hotel: 'Dormir no hotel',
        forum: 'Forum',
        market: 'Mercado',
        pray: 'Pray',
        pray_in_church: 'Start to pray',
        sheriff: 'Xerife',
        cityhall: 'Town hall',
        dont_have_hotel: 'Voce nao tem um hotel!',
        DuelSafer_found: 'DuelSafer',
        DuelSafer_no_town: 'This player is without a town!',
        DuelSafer_friend_text: 'Esse jogador e uma alianca. Ataca-lo mesmo assim?',
        DuelSafer_from_town: 'Cidade',
        DuelSafer_from_alliance: 'Alianca',
        DuelSafer_from_player: 'Player',
        DuelSafer_friend: 'Aliado atacando',
        DuelSafer_input_town: 'Insira o nome de uma cidade',
        DuelSafer_input_alliance: 'Insira o nome de uma alianca',
        DuelSafer_input_player: 'Add a new player',
        DuelSafer_not_found_town: 'Cidade nao encontrada',
        DuelSafer_not_found_ally: 'Alianca nao encontrada',
        DuelSafer_not_found_player: 'Can\'t find the player',
        DuelSafer_already_have: 'Ja existe na lista das cidades/aliancas',
        open_town: 'Open town window',
        open_ally: 'Open alliance window',
        open_player: 'Open player profile',
        help_icon: 'Add players, towns or alliances to the Duelsafer list to get a confirmation pop-up before duelling them.',
        add: 'Adicionar',
        addfriends: 'Add all your friends',
        friendlist: 'Friend list',
        delete_town: 'Remove town',
        delete_ally: 'Remove alliance',
        delete_player: 'Remove player',
        default_sound: 'Som padrão',
        beeper_sound: 'Escolher arquivo',
        listen: 'Ouvir',
        HealthTL_to: 'Tempo restante para saúde total',
        EnergyTL_to: 'Tempo restante para a energia total',
        HealthNext: 'Next health point in',
        EnergyNext: 'Next energy point in',
        Reg_perH: 'Regeneração por hora',
        Reg_missing: 'Missing',
      },
      fr: {
        language: 'French (français)',
        ApiGui: 'Ce script contient des fonctionnalités géniales qui améliorent votre expérience de The West.',
        contact: 'Contact',
        opentab: 'Ouvrez l\'onglet %1',
        general: 'Parametres',
        main: 'Options',
        chooseLang: 'Changer la langue (Language)',
        saved: 'Successfully saved',
        need_reload: 'La page doit etre rafraichie, proceder?',
        patches_title: 'Modifications/Patches',
        enable_select: 'Activer texte selectionnable',
        enable_lastpage: 'Activer dernière page mod',
        enable_timelefters: 'Activer régénération compteur',
        enable_beeper: 'Activer TW Beeper',
        enable_beeper_title: '<b>Beeper</b> - Alerte sonore pour les chuchos',
        enable_town_button: 'Active le bouton "Ville"',
        enable_town_title: 'Permet de prevoir/activer des taches automatiques (dormir a l\'hotel, au fort, ouvrir le sheriff...',
        enable_noenergy: 'Remove premium message at low energy',
        enable_menutop: 'Keep the menu and scripts bar always on top',
        to_last_page: 'Derniere page',
        wir: 'WIR',
        wir_enabler: 'Reducteur d\'inventaire',
        wir_enabler_title: '(West Inventory Reducer)</i>:<br>Resizes inventory items and adds a scroll bar.',
        wir_on_line: 'sur une ligne',
        wir_on_one_line: 'Nombre d\'item sur une ligne',
        ext: 'Close inventory and docked window',
        ext_enabler: 'Extra close button',
        ext_enabler_title: 'Additional button that closes inventory and docked window',
        open: 'Open ',
        bank: 'Banque',
        saloon: 'Propre saloon',
        sleep: 'Sleep',
        sleep_in_hotel: 'Sleep in your hotel',
        forum: 'Forum',
        market: 'Marche',
        pray: 'Pray',
        pray_in_church: 'Start to pray',
        sheriff: 'Sheriff',
        cityhall: 'Town hall',
        dont_have_hotel: 'Tu n\'as pas d\'hotel!',
        DuelSafer_found: 'Duels Securises',
        DuelSafer_no_town: 'This player is without a town!',
        DuelSafer_friend_text: 'Ce joueur est allie, l\'attaquer quand meme?',
        DuelSafer_from_town: 'Ville',
        DuelSafer_from_alliance: 'Alliance',
        DuelSafer_from_player: 'Player',
        DuelSafer_friend: 'Attaque Alliee',
        DuelSafer_input_town: 'Entrer nom de la ville',
        DuelSafer_input_alliance: 'Entrer nom de l\'alliance',
        DuelSafer_input_player: 'Add a new player',
        DuelSafer_not_found_town: 'Ville non trouvee',
        DuelSafer_not_found_ally: 'Alliance non trouvee',
        DuelSafer_not_found_player: 'Can\'t find the player',
        DuelSafer_already_have: 'Deja present dans les listes Alliances/Villes',
        open_town: 'Open town window',
        open_ally: 'Open alliance window',
        open_player: 'Open player profile',
        help_icon: 'Add players, towns or alliances to the Duelsafer list to get a confirmation pop-up before duelling them.',
        add: 'Ajouter',
        addfriends: 'Add all your friends',
        friendlist: 'Friend list',
        delete_town: 'Remove town',
        delete_ally: 'Remove alliance',
        delete_player: 'Remove player',
        default_sound: 'Defaut',
        beeper_sound: 'Son personnalisé',
        listen: 'Ecouter',
        HealthTL_to: 'Temps à pleine PV',
        EnergyTL_to: 'Temps à pleine énergie',
        HealthNext: 'Next health point in',
        EnergyNext: 'Next energy point in',
        Reg_perH: 'Régénération par heure',
        Reg_missing: 'Missing',
      },
      it: {
        language: 'Italian (italiano)',
        ApiGui: 'Questo script contiene alcune funzioni interessanti che migliorano l\'esperienza di gioco su The West.',
        contact: 'Contatto',
        opentab: 'Aprire la scheda %1',
        general: 'Generale',
        main: 'Impostazioni principali',
        chooseLang: 'Cambia lingua (Language)',
        saved: 'Successfully saved',
        need_reload: 'La pagina ha bisogno di essere ricaricata. Procedere?',
        patches_title: 'Modifiche/Patch',
        enable_select: 'Abilita testo selezionabile',
        enable_lastpage: 'Abilita ultima pagina mod',
        enable_timelefters: 'Attivare timer rigenerazione',
        enable_beeper: 'Abilita segnale acustico',
        enable_beeper_title: 'Segnale acustico – Suono di avviso se si ottiene un messaggio privato',
        enable_town_button: 'Attiva pulsante  "Citta"',
        enable_town_title: 'Con questo script si puo immediatamente gestire la maggior parte dei compiti della tua citta, grazie all\'aggiunta del pulsante citta sul lato destro. (Es.: voci aperte, andare a dormire al piu vicino forte, mercato, chiesa ecc.)',
        enable_noenergy: 'Remove premium message at low energy',
        enable_menutop: 'Keep the menu and scripts bar always on top',
        to_last_page: 'Vai all\'ultima pagina',
        wir: 'WIR',
        wir_enabler: 'Riduttore di inventario.',
        wir_enabler_title: '(West Inventory Reducer)</i>:<br>Resizes inventory items and adds a scroll bar.',
        wir_on_line: 'su una linea',
        wir_on_one_line: 'Numero di articoli su una linea',
        ext: 'Close inventory and docked window',
        ext_enabler: 'Extra close button',
        ext_enabler_title: 'Additional button that closes inventory and docked window',
        open: 'Open ',
        bank: 'Banca',
        saloon: 'Proprio saloon',
        sleep: 'Sleep',
        sleep_in_hotel: 'Sleep in your hotel',
        forum: 'Forum',
        market: 'Mercato',
        pray: 'Pray',
        pray_in_church: 'Start to pray',
        sheriff: 'Sceriffo',
        cityhall: 'Town hall',
        dont_have_hotel: 'Non si dispone di un albergo!',
        DuelSafer_found: 'Duello sicuro',
        DuelSafer_no_town: 'This player is without a town!',
        DuelSafer_friend_text: 'Questo giocatore e un alleato. Attaccare lui in ogni caso?',
        DuelSafer_from_town: 'Citta',
        DuelSafer_from_alliance: 'Alleanza',
        DuelSafer_from_player: 'Player',
        DuelSafer_friend: 'Alleato attaccato',
        DuelSafer_input_town: 'Inserisci il nome della citta',
        DuelSafer_input_alliance: 'Inserisci il nome del alleanza',
        DuelSafer_input_player: 'Add a new player',
        DuelSafer_not_found_town: 'Citta non trovata',
        DuelSafer_not_found_ally: 'Alleanza non trovata',
        DuelSafer_not_found_player: 'Can\'t find the player',
        DuelSafer_already_have: 'E ‘gia presente nella lista citta / alleanze',
        open_town: 'Open town window',
        open_ally: 'Open alliance window',
        open_player: 'Open player profile',
        help_icon: 'Add players, towns or alliances to the Duelsafer list to get a confirmation pop-up before duelling them.',
        add: 'Aggiungere',
        addfriends: 'Add all your friends',
        friendlist: 'Friend list',
        delete_town: 'Remove town',
        delete_ally: 'Remove alliance',
        delete_player: 'Remove player',
        default_sound: 'Predefinito',
        beeper_sound: 'File audio',
        listen: 'Ascoltare',
        HealthTL_to: 'Recupero totale della vita in',
        EnergyTL_to: 'Recupero totale della riposo in',
        HealthNext: 'Next health point in',
        EnergyNext: 'Next energy point in',
        Reg_perH: 'Rigenerazione per ora',
        Reg_missing: 'Missing',
      },
      pl: {
        language: 'Polish (polski)',
        ApiGui: 'Skrypt ten zawiera kilka ciekawych funkcji, które poprawiają swoją rozgrywkę na zachodzie.',
        contact: 'Kontakt',
        opentab: 'Otwórz zakładkę %1',
        general: 'Ogólne',
        main: 'Ustawienia główne',
        chooseLang: 'Zmień język (Language)',
        saved: 'Ustawienia zostały zapisane.',
        need_reload: 'Strona musi zostać ponownie załadowana. Kontynuować?',
        patches_title: 'Modyfikacje/Poprawki',
        enable_select: 'Możliwość zaznacznia teksty',
        enable_lastpage: 'Włącz ostatnia strona mod',
        enable_timelefters: 'Włącz licznik regeneracji',
        enable_beeper: 'Włączenie dźwieku',
        enable_beeper_title: '<b>Brzęczek</b> - Dźwięk jeżeli gracz otrzyma wiadomość szeptem',
        enable_town_button: 'Włącz przycisk "Miasto"',
        enable_town_title: 'Za pomocą tego przycisku, otrzymujemy dostęp do wiekszości budynków w mieście.<br>Po prawej stronie zostanie dodany przycisk.<br>(Np.: Forum, spanie w koszarach, targ, kościól e t.c.)',
        enable_noenergy: 'Remove premium message at low energy',
        enable_menutop: 'Keep the menu and scripts bar always on top',
        to_last_page: 'Idź do ostatniej strony',
        wir: 'WIR',
        wir_enabler: 'Redukcja ekwipunku',
        wir_enabler_title: '(West Inventory Reducer)</i>:<br>Resizes inventory items and adds a scroll bar.',
        wir_on_line: 'pozycji w linii',
        wir_on_one_line: 'Ilość przedmiotów w jednej linii',
        ext: 'Close inventory and docked window',
        ext_enabler: 'Extra close button',
        ext_enabler_title: 'Additional button that closes inventory and docked window',
        open: 'Open ',
        bank: 'Bank',
        saloon: 'Własny saloon',
        sleep: 'Sleep',
        sleep_in_hotel: 'Sleep in your hotel',
        forum: 'Forum',
        market: 'Targ',
        pray: 'Pray',
        pray_in_church: 'Start to pray',
        sheriff: 'Szeryf',
        cityhall: 'Town hall',
        dont_have_hotel: 'Nie posiadasz hotelu!',
        DuelSafer_found: 'Bezpieczne pojedynki',
        DuelSafer_no_town: 'This player is without a town!',
        DuelSafer_friend_text: 'Ten przeciwnik jest sojusznikiem. Chcesz go zaatakować?',
        DuelSafer_from_town: 'Miasto',
        DuelSafer_from_alliance: 'Sojusz',
        DuelSafer_from_player: 'Player',
        DuelSafer_friend: 'Atak na sojusznika',
        DuelSafer_input_town: 'Wprowadź nazwę miasta',
        DuelSafer_input_alliance: 'Wprowadź nazwę sojuszu',
        DuelSafer_input_player: 'Add a new player',
        DuelSafer_not_found_town: 'Nie znaleziono miast',
        DuelSafer_not_found_ally: 'Nie znaleziono sjuszu',
        DuelSafer_not_found_player: 'Can\'t find the player',
        DuelSafer_already_have: 'Te miasto/sojusz jest już dopisane do listy',
        open_town: 'Open town window',
        open_ally: 'Open alliance window',
        open_player: 'Open player profile',
        help_icon: 'Add players, towns or alliances to the Duelsafer list to get a confirmation pop-up before duelling them.',
        add: 'Dodaj',
        addfriends: 'Add all your friends',
        friendlist: 'Friend list',
        delete_town: 'Remove town',
        delete_ally: 'Remove alliance',
        delete_player: 'Remove player',
        default_sound: 'Domyślny',
        beeper_sound: 'Rodzaj dźwięku',
        listen: 'Słuchaj',
        HealthTL_to: 'Czas do uzyskania pełnego punkty życia',
        EnergyTL_to: 'Czas pozostały do pełnego energia',
        HealthNext: 'Next health point in',
        EnergyNext: 'Next energy point in',
        Reg_perH: 'Regeneracja na godzinę',
        Reg_missing: 'Missing',
      },
      hu: {
        language: 'Hungarian (Magyar)',
        ApiGui: 'Ez a szkript tartalmaz néhány nagyszerű tulajdonsága, amely javítja a játékélményt, a nyugati.',
        contact: 'Érintkezés',
        opentab: 'Nyissa meg a %1 fülre',
        general: 'Általános',
        main: 'Keretprogram beállítások',
        chooseLang: 'Megváltoztathatja a nyelvet (Language)',
        saved: 'Beállítások mentve.',
        need_reload: 'A változtatáshoz újra kell tölteni az oldalt! Mehet most?',
        patches_title: 'Kényelmi funkciók beállításai',
        enable_select: 'Szöveg kijelölés/másolás engedélyezése',
        enable_lastpage: 'Engedélyezze utolsó oldal mod',
        enable_timelefters: 'Engedélyezze a regenerációs időzítő',
        enable_beeper: 'Figyelmeztető hangjelzés engedélyezése',
        enable_beeper_title: 'Bekapcsolásával fgyelmeztető hangjelzést kapsz, ha neved <i>elhangzik</i> a fő chat-ablakban vagy privát üzeneted ( <i>suttogás</i> ) érkezik, továbbá egy hangerőszabályzó / némító gomb is megjelenik a képernyőn a Chat közelében.<br><br><b>ICQ</b>: az eredetileg izraeli fejlesztésű csevegőprogramból kinyert hang. ( az ICQ 2010 óta a <i>Mail.ru</i> tulajdona ),<br><b>QIP</b>: a <i>Quiet Internet Pager</i> nevű, főleg orosz nyelvterületen ismert és használt csevegőprogramból ( készítette: Ilgam Zyulkorneev ) kinyert hang,<br><b>VK</b>: a <i>VKontakt</i> elnevezésű, főleg orosz nyelvterületen és izraelben ismert és kedvelt facebook-klónból kinyert hang.',
        enable_town_button: '"Városom" gomb mutatása',
        enable_town_title: 'Engedélyezésével egy új gomb jelenik meg a jobb oldali Menüsoron, mellyel gyorsan hozzáférhetsz városod épületeihez, egy kattintással a legközelebbi Szövetséges Erődbe mehetsz aludni, stb.',
        enable_noenergy: 'Remove premium message at low energy',
        enable_menutop: 'Keep the menu and scripts bar always on top',
        to_last_page: 'Ugrás az utolsó oldalra',
        wir: 'WIR',
        wir_enabler: 'Enable WIR',
        wir_enabler_title: '(West Inventory Reducer)</i>: Ezzel a funkcióval beállíthatod, hogy hány elem jelenjen meg soronként a Felszerelések ablakban.<br><br><b>TIPP:</b> A funkció bekapcsolásával nem csak a soronkénti darabszámot állíthatod be, hanem kényelmesebb gördítősávra cserélheted a Felszerelések ablak alján látható számozott, oldal-lapozó funkciót is.',
        wir_on_line: 'darab soronként',
        wir_on_one_line: 'Megjelenített darabszám',
        ext: 'Close inventory and docked window',
        ext_enabler: 'Extra close button',
        ext_enabler_title: 'Additional button that closes inventory and docked window',
        open: 'Open ',
        bank: 'Bank',
        saloon: 'Saját Kocsma',
        sleep: 'Sleep',
        sleep_in_hotel: 'Sleep in your hotel',
        forum: 'Fórum',
        market: 'Piac',
        pray: 'Pray',
        pray_in_church: 'Start to pray',
        sheriff: 'Sheriff',
        cityhall: 'Town hall',
        dont_have_hotel: 'Nincs Hoteled!',
        DuelSafer_found: 'Párbaj-segéd',
        DuelSafer_no_town: 'This player is without a town!',
        DuelSafer_friend_text: 'Ez a Játékos a Szövetségesed! Mindenképpen megtámadod?',
        DuelSafer_from_town: 'Város',
        DuelSafer_from_alliance: 'Szövetség',
        DuelSafer_from_player: 'Player',
        DuelSafer_friend: 'Szövetséges megtámadása',
        DuelSafer_input_town: 'Írd be a Város nevét',
        DuelSafer_input_alliance: 'Írd be a Szövetség nevét',
        DuelSafer_input_player: 'Add a new player',
        DuelSafer_not_found_town: 'Ez a Város nem található',
        DuelSafer_not_found_ally: 'Ez a Szövetség nem található',
        DuelSafer_not_found_player: 'Can\'t find the player',
        DuelSafer_already_have: 'Ez a Város/Szövetség már szerepel a listán',
        open_town: 'Open town window',
        open_ally: 'Open alliance window',
        open_player: 'Open player profile',
        help_icon: 'Add players, towns or alliances to the Duelsafer list to get a confirmation pop-up before duelling them.',
        add: 'Hozzáadás',
        addfriends: 'Add all your friends',
        friendlist: 'Friend list',
        delete_town: 'Remove town',
        delete_ally: 'Remove alliance',
        delete_player: 'Remove player',
        default_sound: 'Alapbeállítás',
        beeper_sound: 'Figyelmeztető hang',
        listen: 'Lejátszás',
        HealthTL_to: 'Ennyi idő kell még mire felépülsz',
        EnergyTL_to: 'Hátralévő idő az összes energia',
        HealthNext: 'Next health point in',
        EnergyNext: 'Next energy point in',
        Reg_perH: 'Regeneráció óránként',
        Reg_missing: 'Missing',
      },
      cs: {
        language: 'Czech (čeština)',
        ApiGui: 'Tento script obsahuje pár skvělých funkcí, které zlepší tvůj herní zážitek na The West.',
        contact: 'Kontakt',
        opentab: 'Otevři %1',
        general: 'Všeobecní',
        main: 'Hlavní',
        chooseLang: 'Vyber jazyk (Language)',
        saved: 'Nastavení byla uložena.',
        need_reload: 'Stránka bude znovu načtena, ok?',
        patches_title: 'Modifikace/Patche',
        enable_select: 'Povolit volitelný text',
        enable_lastpage: 'Povolit režim poslední stránky',
        enable_timelefters: 'Povolit ukazovatele času regenerace',
        enable_beeper: 'Povolit Beeper',
        enable_beeper_title: '<b>Beeper</b> - Zvukové upozornení na novou privátní zprávu v chatu (šepot)',
        enable_town_button: 'Povolit ExTB',
        enable_town_title: '<b>ExtTB</b><i>(Rozšíření pro Tlačidlo města)</i>:<br>Rozšířené tlačítko města ve spodní liště.',
        enable_noenergy: 'Zakázat prémiovú zprávu při nízké energii',
        enable_menutop: 'Keep the menu and scripts bar always on top',
        to_last_page: 'Přejít na poslední stránku tématu',
        wir: 'WIR',
        wir_enabler: 'Povolit WIR',
        wir_enabler_title: '(West Inventory Reducer)</i>:<br>Změní velikost položek inventáře a přidá posouvání.',
        wir_on_line: 'v jedné řadě',
        wir_on_one_line: 'Počet itemů v jedné řadě',
        ext: 'Zavři inventář a ukotvené okno',
        ext_enabler: 'Extra tlačidlo na zavíraní',
        ext_enabler_title: 'Další tlačidlo, které zavírá inventář a ukotvěné okná',
        open: 'Otevři ',
        bank: 'Banka',
        saloon: 'Saloon',
        sleep: 'Spánek',
        sleep_in_hotel: 'Spánek ve svím hotelu',
        forum: 'Městské fórum',
        market: 'Trh',
        pray: 'Modlení',
        pray_in_church: 'Začni se modlit',
        sheriff: 'Šerif',
        cityhall: 'Radnica',
        dont_have_hotel: 'Nemáš hotel!',
        DuelSafer_found: 'DuelSafer',
        DuelSafer_no_town: 'Tenhle hráč je bez města!',
        DuelSafer_friend_text: 'Opravdu chceš zaútočit na svého přítele?',
        DuelSafer_from_town: 'Města',
        DuelSafer_from_alliance: 'Aliance',
        DuelSafer_from_player: 'Hráč',
        DuelSafer_friend: 'Útok na přítele',
        DuelSafer_input_town: 'Přidat nové město',
        DuelSafer_input_alliance: 'Přidat novou alianci',
        DuelSafer_input_player: 'Přidat nového hráče',
        DuelSafer_not_found_town: 'Nemůžu najít tohle město',
        DuelSafer_not_found_ally: 'Nemůžu najít tuhle alianci',
        DuelSafer_not_found_player: 'Nemůžu najít tohohle hráče',
        DuelSafer_already_have: 'Již v seznamu',
        open_town: 'Otevři okno města',
        open_ally: 'Otevři okno aliance',
        open_player: 'Otevři profil hráče',
        help_icon: 'Přidej hráče, města nebo aliance do Duelsafer seznamu, aby si před soubojem dostal potvrdzovací pop-up okno.',
        add: 'Přidat',
        addfriends: 'Add all your friends',
        friendlist: 'Friend list',
        delete_town: 'Odstranit město',
        delete_ally: 'Odstranit alianci',
        delete_player: 'Odstranit hráče',
        default_sound: 'Základní zvuk',
        beeper_sound: 'Vyber soubor',
        listen: 'Poslechnout si',
        HealthTL_to: 'Čas do úplného doplnení zdraví',
        EnergyTL_to: 'Čas do úplného doplnení energie',
        HealthNext: 'Další bod zdraví za',
        EnergyNext: 'Ďalší bod energie za',
        Reg_perH: 'Regenerace za hodinu',
        Reg_missing: 'Chybí',
      },
      sk: {
        language: 'Slovak (slovenčina)',
        ApiGui: 'Tento script obsahuje pár skvelých funkcií, ktoré ti spríjemnia hranie The West.',
        contact: 'Koktakt',
        opentab: 'Otvor %1',
        general: 'Všeobecné',
        main: 'Hlavné',
        chooseLang: 'Vyber jazyk (Language)',
        saved: 'Nastavenia boli uložené.',
        need_reload: 'Stránka bude znovu načítaná, ok?',
        patches_title: 'Modifikácie/Patche',
        enable_select: 'Povoliť voliteľný text',
        enable_lastpage: 'Povoliť režim poslednej stránky',
        enable_timelefters: 'Povoliť ukazovatele času regenerácie',
        enable_beeper: 'Povoliť Beeper',
        enable_beeper_title: '<b>Beeper</b> - Zvukové upozornenie na novú privátnu správu (šepot)',
        enable_town_button: 'Povoliť ExTB',
        enable_town_title: '<b>ExtTB</b><i>(Rozšírenie pre Tlačidlo mesta)</i>:<br>Rozšírené tlačidlo mesta v spodnej lište.',
        enable_noenergy: 'Zakázať prémiovú správu pri nízkej energii',
        enable_menutop: 'Keep the menu and scripts bar always on top',
        to_last_page: 'Prejsť na poslednú stránku témy',
        wir: 'WIR',
        wir_enabler: 'Povoliť WIR',
        wir_enabler_title: '(West Inventory Reducer)</i>:<br>Upraví veľkosť položiek v inventári a pridá posúvanie.',
        wir_on_line: 'v jednej rade',
        wir_on_one_line: 'Počet itemov v jednej rade',
        ext: 'Zatvor inventor a ukotvené okno',
        ext_enabler: 'Extra tlačidlo na zatváranie',
        ext_enabler_title: 'Ďalšie tlačidlo, ktoré zatvára inventár a ukotvené okná',
        open: 'Otvor ',
        bank: 'Banka',
        saloon: 'Saloon',
        sleep: 'Spánok',
        sleep_in_hotel: 'Spánok vo svojom hotely',
        forum: 'Mestské fórum',
        market: 'Trh',
        pray: 'Modlenie',
        pray_in_church: 'Začni sa modliť',
        sheriff: 'Šerif',
        cityhall: 'Radnica',
        dont_have_hotel: 'Nemáš hotel!',
        DuelSafer_found: 'DuelSafer',
        DuelSafer_no_town: 'Tento hráč je bez mesta!',
        DuelSafer_friend_text: 'Naozaj chceš zaútočiť na svojho priateľa?',
        DuelSafer_from_town: 'Mesto',
        DuelSafer_from_alliance: 'Aliancia',
        DuelSafer_from_player: 'Hráč',
        DuelSafer_friend: 'Útok na priateľa',
        DuelSafer_input_town: 'Pridať nové mesto',
        DuelSafer_input_alliance: 'Pridať novú alianciu',
        DuelSafer_input_player: 'Pridať nového hráča',
        DuelSafer_not_found_town: 'Nemôžem nájsť toto mesto',
        DuelSafer_not_found_ally: 'Nemôžem nájsť túto alianciu',
        DuelSafer_not_found_player: 'Nemôžem nájsť tohto hráča',
        DuelSafer_already_have: 'Už je v zozname',
        open_town: 'Otvor okno mesta',
        open_ally: 'Otvor okno aliancie',
        open_player: 'Otvor profil hráča',
        help_icon: 'Pridaj hráčov, mestá alebo aliancie do Duelsafer zoznamu, aby si pred súbojom dostal pozvrdzovacie pop-up okno.',
        add: 'Pridať',
        addfriends: 'Add all your friends',
        friendlist: 'Friend list',
        delete_town: 'Odstrániť mesto',
        delete_ally: 'Odstrániť alianciu',
        delete_player: 'Odstrániť hráča',
        default_sound: 'Základný zvuk',
        beeper_sound: 'vyber súbor',
        listen: 'Vypočuť si',
        HealthTL_to: 'Čas do úplného doplnenia zdravia',
        EnergyTL_to: 'Čas do úplného doplnenia energie',
        HealthNext: 'Ďalší bod zdravia za',
        EnergyNext: 'Ďalší bod energie za',
        Reg_perH: 'Regenerácia za hodinu',
        Reg_missing: 'Chýba',
      },
      el: {
        language: 'Greek (ελληνικά)',
        ApiGui: 'Αυτό το script περιέχει μερικά χρήσιμα χαρακτηριστικά γνωρίσματα<br>που βελτιώνουν την εμπειρία του παιχνιδιού σας στο The West.',
        contact: 'Επικοινωνία',
        opentab: 'Ανοίξτε την καρτέλα: %1',
        general: 'Ρυθμίσεις',
        main: 'Αρχικές επιλογές',
        chooseLang: 'Επιλογή Γλώσσας',
        saved: 'Αποθηκεύτηκε με επιτυχία',
        need_reload: 'Η σελίδα θα φορτωθεί εκ νέου, εντάξει;',
        patches_title: 'Τροποποιήσεις / Επεκτάσεις',
        enable_select: 'Ενεργοποίηση: Μαρκάρισμα κειμένου',
        enable_lastpage: 'Enable last page mod',
        enable_timelefters: 'Ενεργοποίηση: Χρόνων Αναγέννησης',
        enable_beeper: 'Ενεργοποίηση: Beeper',
        enable_beeper_title: '<b> Beeper </b> -<u><i> Ειδοποίηση ήχου σε νέο ιδιωτικό μήνυμα συνομιλίας</i></u><br><br>Με την ενεργοποίηση, κάθε φορά που λαμβάνετε ένα νέο ιδιωτικό μήνυμα<br><b>(Ψίθυρος)</b> θα λαμβάνετε ένα ειδικό ηχητικό σήμα. Μπορείτε να επιλέξετε<br>τον ήχο που σας αρέσει στην λίστα που σας έχουμε ετοιμάσει παρακάτω<br>ή να προσθέσε τον δικό σας μοναδικό ήχο.',
        enable_town_button: 'Ενεργοποίηση: ΕγΚΠ',
        enable_town_title: '<b>ΕγΚΠ</b><i> - <u>Επέκταση για Κουμπί Πόλης</u></i>:<br><br>Αυτό το χαρακτηριστικό σας εμφανίζει μια λίστα<br>από διάφορες χρήσιμες λειτουργείες, στο κουμπί<br>"Πόλη" της γραμμής μενού, τις οποίες θα μπορείτε<br>να χρησιμοποιήσετε με το πάτημα ενός κουμπιού.',
        enable_noenergy: 'Κατάργηση μηνύματος premium με χαμηλή ενέργεια',
        enable_menutop: 'Κρατήστε τη γραμμή scripts και τη γραμμή μενού πάντα στην κορυφή',
        to_last_page: 'Πηγαίνετε στην τελευταία σελίδα του θέματος',
        wir: 'WIR ',
        wir_enabler: 'Ενεργοποίηση: WIR',
        wir_enabler_title: '- <u>(West Inventory Reducer)</u></i><br><br>Αυτό το χαρακτηριστικό σας επιτρέπει να ορίσετε τον αριθμό<br>των στοιχείων ανά γραμμή στο παράθυρο "Αποθέματα".<br><br><b>ΣΥΜΒΟΥΛΗ:</b> Ενεργοποιώντας αυτή τη λειτουργία, μπορείτε<br>όχι μόνο να ορίσετε τον αριθμό στοιχείων ανά γραμμή<br>αλλά και να μεταβείτε σε μια πιο βολική γραμμή κύλισης,<br>αντί να έχετε την μπάρα με τις σελίδες στο κάτω μέρος<br>του παραθύρου των Αποθεμάτων σας.',
        wir_on_line: 'σε μια σειρά',
        wir_on_one_line: 'Αριθμός στοιχείων ανά γραμμή',
        ext: 'Κλείσιμο μόνο των παραθύρων αποθεμάτων σας',
        ext_enabler: 'Επιπλέον κουμπί κλεισίματος',
        ext_enabler_title: 'Πρόσθετο κουμπί που κλείνει μόνο τα παράθυρα αποθεμάτων σας',
        open: 'Ανοίξτε: ',
        bank: 'Τράπεζα',
        saloon: 'Σαλούν',
        sleep: 'Ύπνος',
        sleep_in_hotel: 'Ύπνος σε δωμάτιο ξενοδοχείου',
        forum: 'Φόρουμ Πόλης',
        market: 'Αγορά',
        pray: 'Προσευχή',
        pray_in_church: 'Ξεκινήστε να προσεύχεστε',
        sheriff: 'Σερίφης',
        cityhall: 'Δημαρχείο Πόλης',
        dont_have_hotel: 'Δεν έχετε ξενοδοχείο',
        DuelSafer_found: 'DuelSafer',
        DuelSafer_no_town: 'Αυτός ο παίκτης είναι εκτός πόλης',
        DuelSafer_friend_text: 'Θέλετε να μονομαχήσετε τον φίλο σας;',
        DuelSafer_from_town: 'Πόλη',
        DuelSafer_from_alliance: 'Συμμαχία',
        DuelSafer_from_player: 'Παίκτης',
        DuelSafer_friend: 'Επίθεση σε φίλο',
        DuelSafer_input_town: 'Προσθέστε Πόλη',
        DuelSafer_input_alliance: 'Προσθέστε Συμμαχία',
        DuelSafer_input_player: 'Προσθέστε Παίκτη',
        DuelSafer_not_found_town: 'Η πόλη δεν βρέθηκε',
        DuelSafer_not_found_ally: 'Η συμμαχία δεν βρέθηκε',
        DuelSafer_not_found_player: 'Ο παίκτης δεν βρέθηκε',
        DuelSafer_already_have: 'Ήδη στην λίστα',
        open_town: 'Ανοίξτε την Πόλη σε νέο παράθυρο',
        open_ally: 'Ανοίξτε την Συμμαχία σε νέο παράθυρο',
        open_player: 'Ανοίξτε το προφίλ του παίχτη',
        help_icon: 'Προσθέστε παίκτες, πόλεις ή συμμαχίες στην λίστα της Ασφαλούς Μονομαχίας,<br>για να εμφανιστεί ένα μήνυμα επιβεβαίωσης όταν τύχει να τους μονομαχήσετε.',
        add: 'Προσθήκη',
        addfriends: 'Προσθήκη όλων των φίλων σας',
        friendlist: 'Λίστα Φίλων',
        delete_town: 'Αφαιρέστε την Πόλη',
        delete_ally: 'Αφαιρέστε την Συμμαχία',
        delete_player: 'Αφαιρέστε τον Παίκτη',
        default_sound: 'Προεπιλεγμένος ήχος',
        beeper_sound: 'Επιλέξτε αρχείο',
        listen: 'Ακούστε',
        HealthTL_to: 'Χρόνος για την πλήρη υγεία',
        EnergyTL_to: 'Χρόνος για την πλήρη ενέργεια',
        HealthNext: 'Επόμενος πόντος υγείας σε',
        EnergyNext: 'Επόμενος πόντος ενέργειας σε',
        Reg_perH: 'Αναγέννηση ανά ώρα',
        Reg_missing: 'Σας λείπει συνολικά το',
      },

    },
    updateLang: function () {
      var lg = TWS.langs;
      TWS.lang = lg[localStorage.getItem('scriptsLang')] ? localStorage.getItem('scriptsLang') : lg[Game.locale.substr(0, 2)] ? Game.locale.substr(0, 2) : 'en';
      TWSlang = lg[TWS.lang];
    },
    Images: {
      controlMenu: 'data:image/png;base64,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',
    },
    Settings: function () {
      function i() {
        var r = {
          beeperSound: 1,
          enableBeeper: true,
          enableNoEnergy: true,
          enableSelectableText: true,
          enableTownButton: true,
          enableMenuTop: true,
          enableTimelefters: true,
          enableWir: true,
          enableWirExt: false,
          safeFriends: false,
          language: Game.locale.substr(0, 2),
          wirSize: 5
        };
        t = $.extend(r, t);
        localStorage.setItem(n, JSON.stringify(t));
      }
      function s(e, r) {
        if (t[e])
          return;
        t[e] = r;
        localStorage.setItem(n, JSON.stringify(t));
      }
      function o(e) {
        return t[e] === undefined ? null : t[e];
      }
      function u(e, r) {
        if (t[e] === undefined)
          return false;
        t[e] = r;
        localStorage.setItem(n, JSON.stringify(t));
        new UserMessage(TWSlang.saved, 'success').show();
        return true;
      }
      var t,
      n = 'tws_settings',
      r = function () {
        t = JSON.parse(localStorage.getItem(n)) || {};
        i();
      }
      ();
      return {
        get: o,
        set: u,
        reg: s
      };
    }
    (),
  };
  TWS.updateLang();
  var fmfb = function (l) {
    return 'https://forum.the-west.' + l + '/index.php?conversations/add&to=Tom Robert';
  };
  TheWestApi.register('TWS', TWS.name, TWS.minGame, TWS.maxGame, TWS.author, TWS.website).setGui('<br><i>Language: </i>' + TWSlang.language + '<br><br>' + TWSlang.ApiGui + '<br><br><i>' + TWS.name + ' v' + TWS.version +
    '</i><br><br><br><b>' + TWSlang.contact + ':</b><ul style="margin-left:15px;"><li>Send a message to <a target=\'_blanck\' href="http://om.the-west.de/west/de/player/?ref=west_invite_linkrl&player_id=647936&world_id=13&hash=7dda">Tom Robert on German world Arizona</a></li>' +
    '<li>Contact me on <a target=\'_blanck\' href="https://greasyfork.org/forum/messages/add/Tom Robert">Greasy Fork</a></li>' +
    '<li>Message me on one of these The West Forum:<br>/ <a target=\'_blanck\' href="' + fmfb('de') + '">deutsches Forum</a> / ' +
    '<a target=\'_blanck\' href="' + fmfb('net') + '">English forum</a> / <a target=\'_blanck\' href="' + fmfb('pl') + '">forum polski</a> / ' +
    '<a target=\'_blanck\' href="' + fmfb('es') + '">foro español</a> /<br>/ <a target=\'_blanck\' href="' + fmfb('ru') + '">Русский форум</a> / ' +
    '<a target=\'_blanck\' href="' + fmfb('fr') + '">forum français</a> / <a target=\'_blanck\' href="' + fmfb('it') + '">forum italiano</a> / ' +
    '<a target=\'_blanck\' href="https://forum.beta.the-west.net/index.php?conversations/add&to=Tom Robert">beta forum</a> /<br>I will get an e-mail when you sent me the message <img src="../images/chat/emoticons/smile.png"></li></ul>');
  TWS.GUIControl = new function () {
    function o() {
      r.getContentPane().innerHTML = '';
      r.fireEvent(TWE('WINDOW_DESTROY'), window);
      $(r.divMain).remove();
      i = false;
      s = null;
    }
    function u(n) {
      if (!t[n])
        n = 'general';
      if (n == s && i) {
        return;
      }
      if (s)
        t[s].onLeave(r);
      s = n;
      $.each(t, function (e, t) {
        var i = t.content;
        if (e == n) {
          r.setSize.apply(r, t.size);
          r.setTitle(t.name);
          t.onOpen(r);
          i.fadeIn('fast');
          return;
        }
        i.hide();
      });
      r.activateTab(n);
    }
    function a() {
      r = wman.open('tws', 'TWSweets', 'noreload').setMiniTitle('TWS');
      r.destroy = o;
      i = true;
      $.each(t, function (e, t) {
        r.addTab(t.name + t.version, e, function () {
          u(e);
        });
        r.appendToContentPane(t.content);
      });
      for (var s = 0, b = n.length; s < b; s++) {
        var f = n[s];
        if (f[2])
          $(f[2], t[f[0]].content).append(f[1]);
        else
          t[f[0]].content.append(f[1]);
      }
    }
    var t = {},
    n = [],
    r,
    s,
    i = false;
    this.open = function (t) {
      var n = $('.tws');
      if (n.length) {
        if (n.is(':hidden'))
          wman.reopen('tws');
        u(t);
        return;
      }
      a();
      u(t);
    };
    this.addTab = function (n) {
      var r = n.tid || n.name.toLowerCase().replace(/ /g, ''),
      i = t[r] = {};
      i.content = $('<div></div>').append(n.content);
      i.onOpen = $.isFunction(n.onOpen) ? n.onOpen : function () {};
      i.onLeave = $.isFunction(n.onLeave) ? n.onLeave : function () {};
      i.size = n.size || [748, 471];
      i.name = n.name || n.tid;
      i.version = n.version && ' v' + n.version || '';
      if (n.menu_shortcut !== false)
        this.Rightside.regTab(i.name, r);
    };
    this.addTo = function (r, i, s) {
      if (arguments.length < 2 || !t[r])
        return;
      n.push([r,
          typeof i == 'string' ? $(i) : i,
          s]);
    };
  }
  ();
  TWS.GUIControl.Rightside = new function () {
    function r() {
      t.append(n);
      i();
      o();
    }
    function i() {
      selectBox.show();
      $selectBox.css({
        right: 37,
        top: 3
      });
      $but.append($selectBox);
      $selectBox.hide();
    }
    function o() {
      $el.on('mouseover', function () {
        $but.css('background-position', '-25px 0');
        $selectBox.show();
      });
      $el.on('mouseleave', function () {
        $but.css('background-position', '0 0');
        $selectBox.hide();
      });
    }
    var t = $('#ui_menubar'),
    n = $('<div class="ui_menucontainer"><div id="tws_menu_icon"></div><div class="menucontainer_bottom"></div></div>'),
    $but = $('#tws_menu_icon', n),
    $el = $but.parent(),
    selectBox = new west.gui.Selectbox().addListener(function (e) {
        TWS.GUIControl.open(e);
      }),
    $selectBox = selectBox.getMainDiv();
    r();
    this.regTab = function (e, t) {
      selectBox.addItem(t, e, s(TWSlang.opentab, e));
      i();
    };
    this.addIcon = function (n, r) {
      if (n === undefined || r === undefined)
        return;
      var i = $('<div id="tws_' + n + '"></div>').click(r),
      s = $('<div class="ui_menucontainer"><div class="menucontainer_bottom"></div></div>');
      t.append(s.append(i));
    };
  }
  ();
  TWS.GUIControl.Style = new function () {
    var e = document.getElementsByTagName('head')[0],
    t = document.createElement('style'),
    n = '#tws_menu_icon { width: 25px; height: 25px; background: url(\'' + TWS.Images.controlMenu + '\'); background-position: 0 0;  }\n' + '#tws_menu_icon .tw2gui_selectbox .arrow { width: 12px; height: 22px; background-position: -12px 0px; background-image: url(../images/tw2gui/selectbox_arrows.png); right: -10px; left: auto; top: auto; }\n';
    t.innerHTML = n;
    e.appendChild(t);
    this.append = function (r) {
      n += '\n' + r.replace(/  /g, '');
      e.removeChild(t);
      t = document.createElement('style');
      t.innerHTML = n;
      e.appendChild(t);
    };
  }
  ();
  TWS.Module = function () {
    function t(e, u, n, i) {
      if (arguments.length < 2)
        return;
      if (u)
        for (var s in u)
          this[s] = u[s];
      if (this.init)
        this.init();
      if (arguments[2] || e.type) {
        n = n || {};
        r.call(this, e, n);
      }
      if (e.version)
        this.version = e.version;
      if (i) {
        TWS.GUIControl.Style.append(i);
      }
      var o = arguments;
      this._getConstructorArgs = function (e) {
        return o[e];
      };
    }
    function n(e, u, r, i) {
      return new t(e, u, r, i);
    }
    function r(t, v) {
      function i() {
        if (v.init) {
          var e = v.init(this);
          if (typeof e == 'object')
            v.DOM = e;
        }
      }
      switch (t.type) {
      case n.TAB:
        v.DOM = $('<div id="tws_' + (t.tid ? t.tid : t.name.toLowerCase().replace(/ /g, '')) + '"></div>');
        i.call(this);
        t.content = v.DOM;
        TWS.GUIControl.addTab(t);
        break;
      case n.MOD:
        i.call(this);
        TWS.GUIControl.General.createBlock(t.name, v.DOM, t.version);
        break;
      case n.PATCH:
        i.call(this);
        TWS.GUIControl.General.appendToPatches(v.DOM);
        break;
      }
    }
    t.prototype = {
      getGUI: function () {
        if (this._getConstructorArgs(2))
          return this._getConstructorArgs(2);
      },
      getCSS: function () {
        if (this._getConstructorArgs(3))
          return this._getConstructorArgs(3);
      },
      open: function (e) {
        var t = this._getConstructorArgs(0);
        if (t.type == TWS.Module.TAB)
          TWS.GUIControl.open(t.tid ? t.tid : t.name.toLowerCase().replace(/ /g, ''));
        if (this.parseOpenData)
          this.parseOpenData(e);
      }
    };
    t.prototype.constructor = t;
    n.TAB = 'tab';
    n.PATCH = 'patch';
    n.MOD = 'modification';
    return n;
  }
  ();
  var mod = TWS.Module;
  TWS.GUIControl.General = mod({
      name: TWSlang.general,
      version: TWS.version,
      type: mod.TAB,
      tid: 'general'
    }, {
      append: function (e) {
        this.getGUI().scrollpane.appendContent(e);
      },
      createBlock: function (t, n, r) {
        r = r && ' v' + r || '';
        if (arguments.length < 2)
          return;
        var i = $('<div class="tws_block"><b>' + t + r + '</b><hr></div>').append(n);
        this.append(i);
      },
      appendToPatches: function (e) {
        this.getGUI().modifications.append(e);
      }
    }, {
      main_block: $('<div class="tws_block"><b>' + TWSlang.main + '</b><hr></div>'),
      modifications: $('<div class="tws_block"><b>' + TWSlang.patches_title + '</b><hr></div>'),
      scrollpane: null,
      init: function () {
        this.scrollpane = new west.gui.Scrollpane(null, true);
        this.main_block.append('<p>' + TWSlang.chooseLang + ':</p>').append(this.getLangBar());
        this.scrollpane.appendContent(this.main_block).appendContent(this.modifications);
        return $(this.scrollpane.getMainDiv()).attr('id', 'tws_general');
      },
      getLangBar: function () {
        var langBox = new west.gui.Combobox('tws_changelang');
        $.each(TWS.langs, function (a, b) {
          langBox.addItem(a, b.language);
        });
        langBox.select(TWS.lang).addListener(function (e) {
          localStorage.setItem('scriptsLang', e);
          TWS.updateLang();
          if (confirm(TWSlang.need_reload))
            location.reload(true);
        });
        return langBox.getMainDiv();
      }
    }, '#tws_general { width: 100%; height: 355px; margin-top: 10px;}\n' + '#tws_general .tw2gui_scrollpane_clipper_contentpane { height: 340px; }\n' + '#tws_general .tws_block { width: 45%; float: left; }\n' + '#tws_general .tw2gui_checkbox { float: left; clear: left; margin-bottom: 5px; }\n' + '#tws_general .tws_block:nth-child(even) { float: right; }\n' + '#tws_copyright { position:absolute; bottom: 0px; right:5px; font-size:10px; }\n' + '.tws_block { margin: 5px; border: 1px solid #000000; -moz-border-radius: 10px; -webkit-border-radius: 10px; -khtml-border-radius: 10px; -o-border-radius: 10px; border-radius: 10px; background: rgba(175, 146, 94, 0.5); padding: 10px; }\n' + '.tws_block hr { color: #000; background-color: #000; border: 0px none; height: 1px; box-shadow: 0px 1px 1px rgba(255, 255, 255, 0.6); margin: 5px 0px 5px 0px; }\n' + '.tws_help_icon { background: url(https://www.the-west.ru/images/tw2gui/iconset.png); width: 16px; height: 16px; position: absolute; background-position: -67px -64px; cursor: help; }\n' + '#tws_all .tw2gui_checkbox { float: left; clear: left; margin-top: 5px; }');
  TWS.Patches = {
    SText: mod({
      name: 'Selectable text',
      version: 1.1,
      type: mod.PATCH
    }, {
      style: null,
      init: function () {
        this.style = $('<style>#forum, #ui_chat, div#ui_topbar > div, #ui_character_container, .tw2gui_window {\n' + '-webkit-user-select: text !important;\n' + '-khtml-user-select: text !important;\n' + '-moz-user-select: text !important;\n' + '-ms-user-select: text !important;\n' + 'user-select: text !important;\n' + '}</style>');
        if (TWS.Settings.get('enableSelectableText'))
          this.on();
      },
      selectableForum: function () {
        $('iframe[src=\'forum.php\']').load(function () {
          content = $(this).contents();
          content.find('head').append(TWS.Patches.SText.style);
        });
      },
      DOMNodeInserted: new MutationObserver(function (e) {
        e.forEach(function (mut) {
          for (var m = 0; m < mut.addedNodes.length; m++)
            if (mut.addedNodes[m].tagName == 'IFRAME')
              TWS.Patches.SText.selectableForum();
        });
      }),
      on: function () {
        $('head').append(this.style);
        this.DOMNodeInserted.observe(document.getElementById('windows'), {
          childList: true,
          subtree: true
        });
      },
      off: function () {
        this.style.remove();
        this.DOMNodeInserted.disconnect();
      }
    }, {
      init: function () {
        return (new west.gui.Checkbox(TWSlang.enable_select, '', function (e) {
            TWS.Settings.set('enableSelectableText', e);
            if (e)
              TWS.Patches.SText.on();
            else
              TWS.Patches.SText.off();
          })).setSelected(TWS.Settings.get('enableSelectableText'), true).getMainDiv();
      }
    }),
    noEnergy: mod({
      name: 'No Energy Premium',
      version: 1,
      type: mod.PATCH
    }, {
      init: function () {
        if (TWS.Settings.get('enableNoEnergy'))
          this.on();
      },
      on: function () {
        Premium.buyable.backupEnergy = Premium.buyable.backupEnergy || Premium.buyable.energy;
        Premium.buyable.energy = false;
      },
      off: function () {
        Premium.buyable.energy = Premium.buyable.backupEnergy;
      }
    }, {
      init: function () {
        return (new west.gui.Checkbox(TWSlang.enable_noenergy, '', function (e) {
            TWS.Settings.set('enableNoEnergy', e);
            if (e)
              TWS.Patches.noEnergy.on();
            else
              TWS.Patches.noEnergy.off();
          })).setSelected(TWS.Settings.get('enableNoEnergy'), true).getMainDiv();
      }
    }),
  };
  TWS.Beeper = mod({
      name: 'Chat Beeper',
      version: 1.3,
      type: mod.MOD
    }, {
      init: function () {
        this.updateSound();
        if (TWS.Settings.get('enableBeeper'))
          this.on();
      },
      on: function () {
        EventHandler.listen('chat_tell_received', this.play, this);
        AudioController.tws_play = AudioController.tws_play || AudioController.play;
        AudioController.play = function (sN) {
          if (sN == 'newmsg')
            return;
          AudioController.tws_play.apply(this, arguments);
        };
      },
      off: function () {
        EventHandler.unlistenByContext('chat_tell_received', this);
        AudioController.play = AudioController.tws_play;
      },
      sounds: {
        1: 'bum',
        2: 'chime',
        3: 'coin',
        4: 'coin2',
        5: 'icq',
        6: 'qip',
        7: 'tinkle',
        8: 'trumpet',
        9: 'vk',
      },
      updateSound: function () {
        var gS = TWS.Settings.get('beeperSound');
        if (this.sounds[gS])
          this.currSound = 'https://tomrobert.safe-ws.de/' + this.sounds[gS] + '.mp3';
        else if (gS)
          this.currSound = gS;
        else
          this.currSound = 'sounds/newmsg.mp3';
      },
      play: function () {
        new Audio(this.currSound).play();
      },
    }, {
      init: function (t) {
        var div = $('<div></div>'),
        beCo = (new west.gui.Combobox('tws_beeper_changesound')).addItem(0, TWSlang.default_sound).addItem(1, 'Bum').addItem(2, 'Chime').addItem(3, 'Coin').addItem(4, 'Coin 2').addItem(5, 'ICQ').addItem(6, 'QIP').addItem(7, 'Tinkle').addItem(8, 'Trumpet').addItem(9, 'VK').addItem(10, TWSlang.beeper_sound + '...').select(typeof TWS.Settings.get('beeperSound') == 'string' ? 10 : TWS.Settings.get('beeperSound')).addListener(function (v) {
          if (v == 10) {
            var inp = prompt(TWSlang.beeper_sound + ':', 'https://             .mp3');
            if (!inp) {
              beCo.select(TWS.Settings.get('beeperSound'));
              return;
            }
            v = inp;
          }
          TWS.Settings.set('beeperSound', v);
          t.updateSound();
        }),
        beBo = (new west.gui.Checkbox(TWSlang.enable_beeper, '', function (e) {
            TWS.Settings.set('enableBeeper', e);
            if (e)
              t.on();
            else
              t.off();
          })).setSelected(TWS.Settings.get('enableBeeper'), true).setId('tws_beeper_enabled').setTitle(TWSlang.enable_beeper_title).getMainDiv(),
        beBu = (new west.gui.Button(TWSlang.listen, function () {
            if (TWS.Settings.get('enableBeeper'))
              t.play();
          })).getMainDiv();
        div.append(beBo, beCo.getMainDiv(), $(beBu).css('float', 'right'));
        return div;
      }
    }, '#tws_beeper { width: 36px; height: 145px; position: fixed; left: 50%; z-index: 15; bottom: 15px; margin-left: -320px; }' + '#tws_beeper_changesound { float: left; clear: left; }');
  TWS.Timelefters = mod({
      type: mod.PATCH,
      version: 2.1
    }, {
      $charContainer: $('#ui_character_container'),
      $tlContainer: $('<div id="tws_tlContainer"></div>'),
      init: function () {
        var pop1 = new MousePopup(),
        pop2 = new MousePopup(),
        el1 = $('<p id="tws_tlHp"></p>').addMousePopup(pop1),
        el2 = $('<p id="tws_tlEnergy"></p>').addMousePopup(pop2);
        this.$tlContainer.append(el1).append(el2);
        (new this.TimeLefter('maxHealth', 'healthRegen', 'health', 'healthDate', function (time, perH, next, pc) {
            pop1.setXHTML(s(TWSlang.HealthTL_to + ': <b>%1</b><br>' + TWSlang.Reg_perH + ': <b>%2</b><br>' + TWSlang.HealthNext + ': <b>%3</b><br>' + TWSlang.Reg_missing + ': <b>%4%</b>', time, perH, next, pc));
            el1.html(time);
          })).startTicker();
        (new this.TimeLefter('maxEnergy', 'energyRegen', 'energy', 'energyDate', function (time, perH, next, pc) {
            pop2.setXHTML(s(TWSlang.EnergyTL_to + ': <b>%1</b><br>' + TWSlang.Reg_perH + ': <b>%2</b><br>' + TWSlang.EnergyNext + ': <b>%3</b><br>' + TWSlang.Reg_missing + ': <b>%4%</b>', time, perH, next, pc));
            el2.html(time);
          })).startTicker();
        if (TWS.Settings.get('enableTimelefters'))
          this.on();
      },
      on: function () {
        this.$charContainer.append(this.$tlContainer);
      },
      off: function () {
        this.$tlContainer.remove();
      },
      TimeLefter: function (max, regen, current, date, r) {
        function reT() {
          perH = charM * charR;
          one = 3600 / perH;
          toGo = charM - charC;
          sec = toGo * one;
          rest = one - Game.getServerTime() + charD;
          pc = Math.round(100 / charM * toGo);
        }
        function startT() {
          checkT();
          subT();
          r(dur(sec), perH, dur(rest), pc);
        }
        function checkT() {
          if (charM == Character[max] && charR == Character[regen] && charC == Character[current] && charD == Character[date])
            return;
          charM = Character[max];
          charR = Character[regen];
          charC = Character[current];
          charD = Character[date];
          reT();
        }
        function subT() {
          if (sec > 1)
            sec--;
          if (rest > 1)
            rest--;
        }
        function dur(v) {
          return v.formatDuration();
        }
        var charM = Character[max],
        charR = Character[regen],
        charC = Character[current],
        charD = Character[date],
        perH,
        sec,
        f,
        one,
        toGo,
        rest,
        pc;
        this.startTicker = function () {
          f = setInterval(startT, 1000);
        };
        this.stopTicker = function () {
          clearInterval(f);
        };
        reT();
      }
    }, {
      init: function (e) {
        var t = (new west.gui.Checkbox(TWSlang.enable_timelefters, '', function (t) {
            TWS.Settings.set('enableTimelefters', t);
            if (t)
              e.on();
            else
              e.off();
          })).setSelected(TWS.Settings.get('enableTimelefters'), true);
        return t.getMainDiv();
      }
    }, '#tws_tlContainer { width: 50px; top: 144px; position: relative; }\n' + '#tws_tlContainer p { font-size: 9px; position: relative; cursor: help; left: 4px; color: #FFF; }\n' + '#tws_tlHp { top: 2px; }\n' + '#tws_tlEnergy { top: 5px; }');
  TWS.Wir = mod({
      type: mod.MOD,
      version: 1.4,
      name: TWSlang.wir
    }, {
      methodEdited: null,
      init: function () {
        setTimeout(function () {
          if (TWS.Settings.get('enableWir'))
            TWS.Wir.on();
        }, 3000);
      },
      on: function () {
        if (!this.methodEdited)
          this.editInventoryLoad();
        this.addCSS();
        Inventory.size = 99999;
        Inventory.sizeSearch = 99999;
      },
      bigInv: function () {
        if (Inventory.width > 304)
          return true;
        return false;
      },
      addCSS: function (s) {
        if (TWS.Settings.get('enableWir') || s == 1) {
          var t = s || parseInt(TWS.Settings.get('wirSize'));
          if (this.bigInv())
            t *= 2;
          switch (t) {
          case 6:
            t = [
              36, 40, 2, 2, 15, 264, 'auto', -5, 42,
            ];
            break;
          case 5:
            t = [
              42, 48, 3, 3, 18, 264, 'auto', -5, 30,
            ];
            break;
          case 4:
            t = [
              53, 60, 3, 4, 23, 264, 'auto', -5, 20,
            ];
            break;
          case 12:
            t = [
              37, 41, 2, 2, 15, 692, 'auto', 0, 128,
            ];
            break;
          case 10:
            t = [
              45, 51, 3, 3, 18, 694, 'auto', 0, 91,
            ];
            break;
          case 8:
            t = [
              53, 60, 3, 4, 23, 692, 'auto', 0, 66,
            ];
            break;
          case 2:
            t = [
              53, 60, 3, 4, 23, 692, 'hidden', 0, 66,
            ];
            break;
          default:
            t = [
              53, 60, 3, 4, 23, 264, 'hidden', 5, 20,
            ];
            break;
          }
          var n = '#bag .item.item_inventory .tw_item.item_inventory_img { width: ' + t[0] + 'px; height: ' + t[0] + 'px; margin-left: ' + t[2] + 'px !important; margin-top: ' + t[3] + 'px !important; }\n' +
            '#bag .item.item_inventory { width: ' + t[1] + 'px !important; height: ' + t[1] + 'px !important; background-size: contain !important; }\n' +
            '#bag .count { min-width: ' + t[4] + 'px !important; }\n' +
            '#bag > .pinned > .item { background-size: auto !important; }\n' +
            '#bag { width: ' + t[5] + 'px !important; overflow-y: ' + t[6] + '; margin-left: ' + t[7] + 'px;}';
          $('head').append($('<style type="text/css">' + n + '</style>'));
          Inventory.latestSize = t[8];
        }
      },
      editInventoryLoad: function () {
        if (this.methodEdited)
          return;
        Inventory.tws_firstLoad = Inventory.firstLoad;
        Inventory.firstLoad = function () {
          Inventory.tws_firstLoad.apply(this, arguments);
          $('#bag', Inventory.DOM).off('mousewheel');
          if (TWS.Settings.get('enableWirExt')) {
            var button2 = $('<div class="tw2gui_window_buttons_closeall" title="<b>' + TWSlang.ext + '</b&gt"></div>').click(function () {
                Inventory.dockedWindow && Inventory.dockedWindow.destroy();
                Inventory.window.destroy();
              });
            $(".tw2gui_window_buttons", Inventory.window.divMain).append(button2);
          }
        };
        Inventory.tws_setCategoryActive = Inventory.setCategoryActive;
        Inventory.setCategoryActive = function (category) {
          Inventory.tws_setCategoryActive.apply(this, arguments);
          var bigInv = TWS.Wir.bigInv(),
          heig = bigInv ? 366 : 305,
          margb = bigInv ? -20 : 0;
          if (category == "set" || category == "custom") {
            heig = bigInv ? 332 : 257;
            margb = bigInv ? 16 : 50;
          }
          document.getElementById("bag").style = "height:" + heig + "px!important;margin-bottom:" + margb + "px;";
        };
        this.methodEdited = true;
      },
      off: function () {
        this.methodEdited = null;
        Inventory.firstLoad = Inventory.tws_firstLoad;
        Inventory.setCategoryActive = Inventory.tws_setCategoryActive;
        Inventory.size = this.bigInv() ? 66 : 20;
        Inventory.sizeSearch = this.bigInv() ? 55 : 16;
        this.addCSS(1);
      }
    }, {
      init: function () {
        var t = $('<div></div>').append((new west.gui.Checkbox(s(TWSlang.wir_enabler, 'WIR'), '', function (f) {
                TWS.Settings.set('enableWir', f);
                if (f)
                  TWS.Wir.on();
                else
                  TWS.Wir.off();
              })).setSelected(TWS.Settings.get('enableWir'), true).setId('tws_wir_enabler').setTitle('<b>' + TWSlang.wir + '</b><i>' + TWSlang.wir_enabler_title).getMainDiv()).append((new west.gui.Checkbox(TWSlang.ext_enabler, '', function (g) {
                TWS.Settings.set('enableWirExt', g);
              })).setSelected(TWS.Settings.get('enableWirExt'), true).setId('tws_wir_ext_enabler').setTitle(TWSlang.ext_enabler_title).getMainDiv()).append($('<p>' + TWSlang.wir_on_one_line + ':</p>').css({
              'float': 'left',
              clear: 'left'
            })).append((new west.gui.Combobox('wir_sizer')).addItem(4, s('%1 ' + TWSlang.wir_on_line, 4)).addItem(5, s('%1 ' + TWSlang.wir_on_line, 5)).addItem(6, s('%1 ' + TWSlang.wir_on_line, 6)).select(TWS.Settings.get('wirSize')).addListener(function (h) {
              TWS.Settings.set('wirSize', h);
              TWS.Wir.addCSS(h);
            }).getMainDiv());
        return t;
      }
    },
      '#wir_sizer { float: left; clear: left; }');
  TWS.ExtTB = mod({
      type: mod.PATCH,
      version: 1.3,
      name: 'ExtTB'
    }, {
      selectBox: null,
      button: null,
      items: null,
      enabled: null,
      init: function () {
        var that = this;
        this.addItems();
        this.selectBox = new west.gui.Selectbox().setWidth(100).addListener(this.listener);
        for (var t in this.items)
          this.selectBox.addItem(t, this.items[t][0], this.items[t][1]);
        this.selectBox.divWrap.remove();
        this.selectBox.getMainDiv().hide();
        var val = setInterval(function () {
            if ($('.button.city').length > 0) {
              clearInterval(val);
              if (TWS.Settings.get('enableMenuTop')) {
                document.getElementById('ui_bottombar').style.zIndex = 20;
                document.getElementById('ui_menubar').style.zIndex = 20;
              } else
                document.getElementById('ui_menubar').style.zIndex = 16;
              that.selectBox.show();
              $('div.tw2gui_modal_fixed').remove();
              that.button = $('.button.city').append(that.selectBox.getMainDiv());
              if (TWS.Settings.get('enableTownButton'))
                that.on();
            }
          }, 2000);
      },
      editCityButton: function (t, n, r) {
        if (r === undefined)
          r = TWS.ExtTB;
        if (!n.town_id) {
          r.off();
          $('.city.dock-image').off('click').on('click', function () {
            west.window.Blackboard.toggleOpen();
          });
        } else {
          $('.city.dock-image').off('click').on('click', function () {
            TownWindow.toggleOpen(n.x, n.y);
            r.selectBox.getMainDiv().hide();
          });
        }
        r.button.off('click');
      },
      addItems: function () {
        var e = Character.homeTown,
        n = {};
        n.bank = [
          TWSlang.bank,
          TWSlang.open + TWSlang.bank,
          function () {
            BankWindow.open(e.town_id);
          }
        ];
        n.saloon = [
          TWSlang.saloon,
          TWSlang.open + TWSlang.saloon,
          function () {
            SaloonWindow.open(e.town_id);
          }
        ];
        n.sleep = [
          TWSlang.sleep,
          TWSlang.sleep_in_hotel,
          function () {
            TWS.ExtTB.sleep(e.town_id);
          }
        ];
        n.forum = [
          TWSlang.forum,
          TWSlang.open + TWSlang.forum,
          function () {
            ForumWindow.open();
          }
        ];
        n.market = [
          TWSlang.market,
          TWSlang.open + TWSlang.market,
          function () {
            Ajax.remoteCallMode('town', 'get_town', {
              x: e.x,
              y: e.y
            }, function (t) {
              if (t.error)
                return (new UserMessage(t.error)).show();
              MarketWindow.open(e.town_id, t.allBuildings.market.stage);
            });
          }
        ];
        n.pray = [
          TWSlang.pray,
          TWSlang.pray_in_church,
          function () {
            ChurchWindow.start(e.town_id);
          }
        ];
        n.sheriff = [
          TWSlang.sheriff,
          TWSlang.open + TWSlang.sheriff,
          function () {
            SheriffWindow.open(e.town_id);
          }
        ];
        n.hall = [
          TWSlang.cityhall,
          TWSlang.open + TWSlang.cityhall,
          function () {
            CityhallWindow.open(e.town_id);
          }
        ];
        this.items = n;
      },
      listener: function (e) {
        TWS.ExtTB.items[e][2]();
      },
      sleep: function (e) {
        var t;
        Ajax.remoteCallMode('building_hotel', 'get_data', {
          town_id: e
        }, function (n) {
          if (n.hotel_level != 0 && !n.error) {
            switch (n.hotel_level) {
            case 5:
              t = 'luxurious_apartment';
              break;
            case 4:
              t = 'apartment';
              break;
            case 3:
              t = 'hotel_room';
              break;
            case 2:
              t = 'bedroom';
              break;
            case 1:
              t = 'cubby';
              break;
            }
          } else {
            (new UserMessage(TWSlang.dont_have_hotel, 'error')).show();
            return;
          }
          TaskQueue.add(new TaskSleep(e, t));
        });
      },
      show: function () {
        TWS.ExtTB.selectBox.getMainDiv().show();
        var e = TWS.ExtTB.button.offset();
        TWS.ExtTB.selectBox.setPosition(e.left + 26, e.top + 5);
      },
      hide: function () {
        TWS.ExtTB.selectBox.getMainDiv().hide({
          duration: 100,
          always: true
        });
      },
      on: function () {
        var e = this;
        EventHandler.listen('char_home_town_changed', this.editCityButton, 'TWSExt');
        EventHandler.listen('character_level_up', function () {
          e.editCityButton(null, Character.homeTown, e);
        }, 'TWSExt');
        this.button.on('mouseenter', this.show);
        this.button.on('mouseleave', this.hide);
        this.editCityButton(null, Character.homeTown, this);
      },
      off: function () {
        EventHandler.unlistenByContext('char_home_town_changed', 'TWSExt');
        EventHandler.unlistenByContext('character_level_up', 'TWSExt');
        this.button.off('mouseenter', this.show);
        this.button.off('mouseleave', this.hide);
      },
      toggleM: function (on) {
        if (on) {
          document.getElementById('ui_bottombar').style.zIndex = 20;
          document.getElementById('ui_menubar').style.zIndex = 20;
        } else {
          document.getElementById('ui_bottombar').style.zIndex = 15;
          document.getElementById('ui_menubar').style.zIndex = 16;
        }
      },
    }, {
      init: function () {
        var t = $('<div/>').append(new west.gui.Checkbox(TWSlang.enable_town_button, '', function (e) {
              TWS.Settings.set('enableTownButton', e);
              if (e)
                TWS.ExtTB.on();
              else
                TWS.ExtTB.off();
            }).setSelected(TWS.Settings.get('enableTownButton'), true).setTitle(TWSlang.enable_town_title).getMainDiv()).append(new west.gui.Checkbox(TWSlang.enable_menutop, '', function (g) {
              TWS.Settings.set('enableMenuTop', g);
              TWS.ExtTB.toggleM(g);
            }).setSelected(TWS.Settings.get('enableMenuTop'), true).getMainDiv());
        return t;
      }
    },
      '.city.button .tw2gui_selectbox { position: fixed; }\n' + '.city.button .arrow.bottom { width: 24px !important; height: 10px !important; background-position: -23px 14px !important; top: auto !important; background-image: url(https://www.the-west.ru/images/tw2gui/selectbox_arrows.png?4) !important; }');
  TWS.DuelSafer = mod({
      type: mod.TAB,
      version: 1.5,
      name: TWSlang.DuelSafer_found,
      tid: 'ds'
    }, {
      init: function () {
        this.Friends.init();
        SaloonWindow.tws_startDuel = SaloonWindow.startDuel;
        SaloonWindow.startDuel = function (playerId, allianceId, a, p, v) {
          TWS.DuelSafer.args = arguments;
          var duel = function () {
            SaloonWindow.tws_startDuel.apply(SaloonWindow, TWS.DuelSafer.args);
          };
          if (!a) {
            var s = TWS.DuelSafer.Friends.get(),
            o = TWS.DuelSafer;
            if (s.alliances.hasOwnProperty(allianceId))
              o.showWarningMessage('alliance', allianceId);
            else if (s.players.hasOwnProperty(playerId))
              o.showWarningMessage('player', playerId);
            else if (TWS.Settings.get('safeFriends') && Chat.Friendslist.isFriend('client_' + playerId))
              o.showWarningMessage('player', 'friendlist');
            else if (!$.isEmptyObject(s.towns)) {
              Ajax.remoteCallMode('profile', 'init', {
                playerId: playerId
              }, function (e) {
                if (!e.hasTown)
                  return new UserMessage(TWSlang.DuelSafer_no_town);
                var xy = e.town.town_x + '_' + e.town.town_y;
                if (s.towns.hasOwnProperty(xy))
                  o.showWarningMessage('town', xy);
                else
                  duel();
              });
            } else
              duel();
          } else
            duel();
        };
        setTimeout(function () {
          if (window.TW_Calc && TW_Calc.DuelBar && TW_Calc.DuelBar.startDuel)
            TW_Calc.DuelBar.startDuel = SaloonWindow.startDuel;
        }, 3000);
      },
      showWarningMessage: function (type, id) {
        var i,
        o = TWS.DuelSafer.Friends.get();
        i = '<div>' + TWSlang.DuelSafer_friend_text + '</br></br>' + this.Friends.types[type] + ':' + '<b style=\'color:green;\'> ' + (id == 'friendlist' ? TWSlang.friendlist : o[type + 's'][id]) + '</b></div>';
        (new west.gui.Dialog(TWSlang.DuelSafer_friend, i, 'question')).addButton('yes', function () {
          SaloonWindow.tws_startDuel.apply(SaloonWindow, TWS.DuelSafer.args);
        }).addButton('no').show();
      },
      Friends: {
        data: null,
        name: 'tws_duelsafer',
        types: {
          alliance: TWSlang.DuelSafer_from_alliance,
          town: TWSlang.DuelSafer_from_town,
          player: TWSlang.DuelSafer_from_player,
        },
        init: function () {
          this.data = $.extend({
              players: {},
              towns: {},
              alliances: {}
            }, JSON.parse(localStorage.getItem(this.name)));
        },
        update: function () {
          localStorage.setItem(this.name, JSON.stringify(this.data));
        },
        add: function (e, t, n) {
          if (!this.types[e])
            return;
          this.data[e + 's'][n] = t;
          this.update();
        },
        'delete': function (e, t) {
          return delete this.data[e + 's'][t];
        },
        get: function (e) {
          if (e === undefined)
            return this.data;
          if (!this.types[e])
            return;
          return this.data[e + 's'];
        },
        clear: function () {
          this.data = {
            players: {},
            towns: {},
            alliances: {}
          };
          this.update();
        }
      },
      getId: function (e, t, n) {
        var r,
        i;
        if (e == 'player')
          Ajax.remoteCallMode("profile", "init", {
            name: t,
          }, function (resp) {
            if (resp.error)
              return n(null);
            n(resp.playerid);
          });
        else
          Ajax.remoteCall('settings', 'get_parsed_text', {
            text: '[' + e + ']' + t + '[/' + e + ']'
          }, function (t) {
            var s = t.parsed_text;
            if (s.match(/Window.open\(/) === null)
              return n(null);
            if (e == 'town') {
              i = s.match(/Window.open\((\d+).(\d+)\)/);
              r = i[1] + '_' + i[2];
            } else if (e == 'alliance')
              r = s.match(/Window.open\((\d+)\)/)[1];
            n(r);
          });
      },
      add: function (type, n, r) {
        var i = this,
        s;
        if (!this.Friends.types[type])
          return;
        this.getId(type, n, function (o) {
          if (o === null)
            return $.isFunction(r) && r(null);
          if (isDefined(i.Friends.get()[type + 's'][o]))
            return $.isFunction(r) && r(false);
          i.Friends.add(type, n, o);
          s = {
            id: o
          };
          s[type] = n;
          if ($.isFunction(r))
            r(s);
        });
      },
      'delete': function () {
        this.Friends.delete.apply(this.Friends, arguments);
        this.Friends.update();
      }
    }, {
      init: function (t) {
        var n = this,
        r = $('<div id="tws_ds_help" class="tws_help_icon" title="' + TWSlang.help_icon + '"></div>'),
        friendsBox = (new west.gui.Checkbox(TWSlang.addfriends, '', function (e) {
            TWS.Settings.set('safeFriends', e);
          })).setSelected(TWS.Settings.get('safeFriends'), true).setTitle(TWSlang.addfriends).setId('tws_ds_friendsBox').getMainDiv();
        this.towns = new this.container('tws_ds_town', 'town', {
            open_title: TWSlang.open_town,
            add_new: TWSlang.DuelSafer_input_town,
            delete_title: TWSlang.delete_town,
            not_found: TWSlang.DuelSafer_not_found_town,
          }, function (e) {
            var t = e.split('_');
            TownWindow.open(t[0], t[1]);
          });
        this.alliances = new this.container('tws_ds_alliance', 'alliance', {
            open_title: TWSlang.open_ally,
            add_new: TWSlang.DuelSafer_input_alliance,
            delete_title: TWSlang.delete_ally,
            not_found: TWSlang.DuelSafer_not_found_ally,
          }, function (e) {
            AllianceWindow.open(e);
          });
        this.players = new this.container('tws_ds_player', 'player', {
            open_title: TWSlang.open_player,
            add_new: TWSlang.DuelSafer_input_player,
            delete_title: TWSlang.delete_player,
            not_found: TWSlang.DuelSafer_not_found_player,
          }, function (e) {
            PlayerProfileWindow.open(+e);
          });
        $.each(t.Friends.get('town'), function (e, t) {
          n.towns.addItem(e, t);
        });
        $.each(t.Friends.get('alliance'), function (e, t) {
          n.alliances.addItem(e, t);
        });
        $.each(t.Friends.get('player'), function (e, t) {
          n.players.addItem(e, t);
        });
        this.DOM.append(this.towns.DOM, this.alliances.DOM, this.players.DOM, r, friendsBox);
      },
      container: function (t, n, r, i) {
        function f(e) {
          TWS.DuelSafer.add(n, e, function (t) {
            if (t === null)
              new UserMessage(r.not_found).show();
            else if (t === false)
              new UserMessage(TWSlang.DuelSafer_already_have).show();
            else {
              o.addItem(t.id, e);
              u.setValue('');
            }
          });
        }
        function l(t, s) {
          var a = $('<span class="tws_ds_friend"></span>').append($('<strong title="' + r.open_title + '">' + s + '</strong>').click(function () {
                i(t);
              })).append($('<a class="tws_ds_delete" title="' + r.delete_title + '"></a>').click(function () {
                TWS.DuelSafer.delete(n, t);
                o.deleteItem(t);
              }));
          return a;
        }
        var s = {},
        o = this,
        u = new west.gui.Textfield('tws_ds_townfield'),
        a = new west.gui.Button(TWSlang.add, function () {
            f(u.getValue());
          });
        u.addListener(function (e) {
          f(e);
        });
        this.List = $('<div id="tws_ds_towns" class="tws_block"></div>');
        this.DOM = $('<div id="' + t + '"></div>').append('<p>' + r.add_new + '</p>', u.getMainDiv(), a.getMainDiv(), this.List);
        this.addItem = function (e, t) {
          var n = l(e, t);
          s[e] = n;
          this.List.append(n);
        };
        this.deleteItem = function (e) {
          if (s[e])
            s[e].remove();
        };
      }
    }, '#tws_ds { padding: 10px 5px 0 5px; }\n' +
      '#tws_ds p { font-weight: bold; margin-left: 5px; }\n' +
      '#tws_ds .tw2gui_button { float: right; margin: -7px 3px 0 0; } \n' +
      '#tws_ds_player .tw2gui_button { float: none; position: absolute; margin-left: 20px; } \n' +
      '#tws_ds .tw2gui_textfield_wrapper input { width: 180px; }\n' +
      '#tws_ds .tws_block { min-height: 112px; margin-top: 4px; padding: 4px; }\n' +
      '#tws_ds_help { left: 49%; top: 110px; }\n' +
      '#tws_ds_friendsBox { position: relative; left: 54%; top: 15px; }\n' +
      '#tws_ds_town { float: left; width: 47%; }\n' +
      '#tws_ds_alliance { float: right; width: 47%; }\n' +
      '#tws_ds_player { position: absolute; width: 98%; top: 189px}\n' +
      '.tws_ds_friend { padding: 3px; float: left; margin: 0px 3px 3px 0px; background: rgba(163, 163, 163, 0.60); border: 1px solid #000000; -moz-border-radius: 3px; -webkit-border-radius: 3px; -khtml-border-radius: 3px; -o-border-radius: 3px; border-radius: 3px; }\n' +
      '.tws_ds_friend strong { cursor: pointer; }\n' +
      '.tws_ds_friend strong:hover { color: white; text-shadow: 0 0 2px #000; }\n' +
      '.tws_ds_delete { border-radius: 5px; border: 1px solid #000; line-height: 0px; display: inline-block; padding: 4px 0 4px 0; font-size: 15px; color: rgb(150,0,0); margin-left: 5px; } \n' +
      '.tws_ds_delete:hover { color: rgb(200,0,0); }\n' +
      '.tws_ds_delete:before { content: \'×\'; }');
  (TWS.Updater = function () {
    if (!window.scriptRequest) {
      scriptRequest = true;
      $.getScript(TWS.updateUrl);
    }
    var intVal = setInterval(function () {
        if (window.scriptUp) {
          scriptUp.c('TWS', TWS.version, TWS.name, TWS.updateAd, TWS.website, TWS.lang);
          clearInterval(intVal);
        }
      }, 2000);
  })();
});
