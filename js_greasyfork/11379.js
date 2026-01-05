// ==UserScript==
// @name The-West Sweets
// @namespace TWSweets
// @author Tom Robert (Shelimov/Slygoxx)
// @description Cool features!
// @include https://*.the-west.*/game.php*
// @exclude https://classic.the-west.net*
// @version 1.3.3
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/11379/The-West%20Sweets.user.js
// @updateURL https://update.greasyfork.org/scripts/11379/The-West%20Sweets.meta.js
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
    version: '1.3.3',
    name: 'TW Sweets',
    author: 'Tom Robert (Shelimov/Slygoxx)',
    minGame: '2.06',
    maxGame: Game.version.toString(),
    url: '//tomrobert.safe-ws.de/',
    website: 'https://the-west-scripts.github.io/The-West-Sweets/',
    Images: function (img, file) {
      return this.url + img + (file ? '.jpg' : '.png');
    },
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
        craft: 'Craft',
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
        craft: 'Herstellen',
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
        craft: 'Elaborar',
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
        craft: 'Produção',
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
        craft: 'Fabriquer',
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
        craft: 'Produci',
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
        craft: 'Wytwórz',
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
        craft: 'Gyártás',
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
        craft: 'Vyrábět',
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
        craft: 'Výroba',
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
        enable_menutop: 'Κρατήστε τη γραμμή scripts και τη γραμμή μενού πάντα στην κορυφή',
        to_last_page: 'Go to last page of the topic',
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
        craft: 'Σύνθεση',
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
      var lgs = TWS.langs,
      lg = [localStorage.getItem('scriptsLang'), Game.locale.substr(0, 2)];
      TWS.lang = lgs[lg[0]] ? lg[0] : lgs[lg[1]] ? lg[1] : 'en';
      TWSlang = lgs[TWS.lang];
    },
    Settings: function () {
      var n = 'tws_settings',
      t = JSON.parse(localStorage.getItem(n)) || {};
      t = $.extend({
        beeperSound: 1,
        enableBeeper: true,
        enableLastPage: true,
        riverColor: 'default',
        enableKOTime: true,
        enableAchievTrack: true,
        enableCraftWin: false,
        enableSelectableText: true,
        enableTownButton: true,
        enableMenuTop: true,
        enableTimelefters: true,
        enableWir: false,
        enableWirExt: false,
        safeFriends: false,
        wirSize: 5
      }, t);
      return {
        get: function (e) {
          return t[e] === undefined ? null : t[e];
        },
        set: function (e, r) {
          if (t[e] === undefined)
            return false;
          t[e] = r;
          localStorage.setItem(n, JSON.stringify(t));
          new UserMessage(TWSlang.saved, 'success').show();
          return true;
        },
        reg: function (e, r) {
          if (t[e])
            return;
          t[e] = r;
          localStorage.setItem(n, JSON.stringify(t));
        }
      };
    }
    (),
  };
  TWS.updateLang();
  var fmfb = function () {
    var fms = [['de', 'deutsches Forum'], ['net', 'English forum'], ['pl', 'forum polski'], ['es', 'foro español'], ['ru', 'Русский форум'], ['fr', 'forum français'], ['it', 'forum italiano'], ['net', 'beta forum', 'beta.']],
    add = '<h1>' + TWSlang.contact + '</h1><ul style="margin-left:15px;line-height:18px;"><li>Send a message to <a target=\'_blank\' href="//www.the-west.de/?ref=west_invite_linkrl&player_id=647936&world_id=13&hash=7dda">Tom Robert on German world Arizona</a></li><li>Message me on one of these The West Forum:<br>';
    for (var l of fms)
      add += '/ <a target=\'_blank\' href="https://forum.' + (l[2] || '') + 'the-west.' + l[0] + '/index.php?conversations/add&to=Tom Robert">' + l[1] + '</a> ' + (l[0] == 'es' ? '<br>' : '');
    return add + '/<br>I will get an e-mail when you sent me the message <img src="images/chat/emoticons/smile.png"></li></ul>';
  };
  TheWestApi.register('TWS', TWS.name, TWS.minGame, TWS.maxGame, TWS.author, TWS.website).setGui('<br><i>Language: </i>' + TWSlang.language + '<br><br>' + TWSlang.ApiGui + '<br><br><i>' + TWS.name + ' v' + TWS.version + '</i><br><br>' + fmfb());
  TWS.GUIControl = new function () {
    var t = {},
    n = [],
    r,
    s,
    i = false;
    function o() {
      r.getContentPane().innerHTML = '';
      r.fireEvent(TWE('WINDOW_DESTROY'), window);
      $(r.divMain).remove();
      i = false;
      s = null;
    }
    function iWin(tid) {
      if (!t[tid])
        tid = 'general';
      if (tid == s && i) {
        return;
      }
      if (s)
        t[s].onLeave(r);
      s = tid;
      $.each(t, function (e, g) {
        var cont = g.content;
        if (e == tid) {
          r.setSize.apply(r, g.size);
          r.setTitle((g.tabName || g.name) + g.version);
          g.onOpen(r);
          cont.fadeIn('fast');
          return;
        }
        cont.hide();
      });
      r.activateTab(tid);
    }
    function a() {
      r = wman.open('tws', TWS.name, 'noreload').setMiniTitle('TWS');
      r.destroy = o;
      i = true;
      $.each(t, function (e, h) {
        r.addTab(h.name, e, function () {
          iWin(e);
        });
        r.appendToContentPane(h.content);
      });
      for (var num = 0, b = n.length; num < b; num++) {
        var f = n[num];
        if (f[2])
          $(f[2], t[f[0]].content).append(f[1]);
        else
          t[f[0]].content.append(f[1]);
      }
    }
    this.open = function (t) {
      var win = $('.tws');
      if (win.length) {
        if (win.is(':hidden'))
          wman.reopen('tws');
        iWin(t);
        return;
      }
      a();
      iWin(t);
    };
    this.addTab = function (tab) {
      var r = tab.tid || tab.name.toLowerCase().replace(/ /g, ''),
      tb = t[r] = {};
      tb.content = $('<div>').append(tab.content);
      tb.onOpen = typeof tab.onOpen === "function" ? tab.onOpen : function () {};
      tb.onLeave = typeof tab.onLeave === "function" ? tab.onLeave : function () {};
      tb.size = tab.size || [748, 471];
      tb.name = tab.name;
      tb.tabName = tab.tabName || tab.name;
      tb.version = tab.version && ' v' + tab.version || '';
      if (tab.menu_shortcut !== false)
        this.Rightside.regTab(tb.name, r);
    };
    this.addTo = function (id, txt, j) {
      if (arguments.length < 2 || !t[id])
        return;
      n.push([id, typeof txt == 'string' ? $(txt) : txt, j]);
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
        right: 30,
        top: 3
      });
      $el.append($selectBox);
      $selectBox.hide();
    }
    function o() {
      $el.on('mouseover', function () {
        $el.css('background-position', '-25px 0');
        $selectBox.show();
      });
      $el.on('mouseleave', function () {
        $el.css('background-position', '0 0');
        $selectBox.hide();
      });
    }
    var t = $('#ui_menubar'),
    n = $('<div class="ui_menucontainer"><div id="tws_menu_icon" class="menulink"></div><div class="menucontainer_bottom"></div></div>'),
    $el = $('#tws_menu_icon', n),
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
      var i = $('<div id="tws_' + n + '">').click(r),
      s = $('<div class="ui_menucontainer"><div class="menucontainer_bottom"></div></div>');
      t.append(s.append(i));
    };
  }
  ();
  TWS.GUIControl.Style = new function () {
    var e = document.getElementsByTagName('head')[0],
    t = document.createElement('style'),
    n = '#tws_menu_icon { width: 25px; height: 25px; background: url(' + TWS.Images('sweetsMenu') + '); background-position: 0 0;  }\n' + '#tws_menu_icon .tw2gui_selectbox .arrow { width: 12px; height: 22px; background-position: -12px 0px; background-image: url(images/tw2gui/selectbox_arrows.png); right: -10px; left: auto; top: auto; }\n';
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
      if (i)
        TWS.GUIControl.Style.append(i);
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
        var control = v.control ? 'control' : v.init ? 'init' : ''; //old deluxejobs
        if (control) {
          var e = v[control](this);
          if (typeof e == 'object')
            v.DOM = e;
        }
      }
      switch (t.type) {
      case n.TAB:
        v.DOM = $('<div id="tws_' + (t.tid ? t.tid : t.name.toLowerCase().replace(/ /g, '')) + '">');
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
    tabName: TWS.name,
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
    control: function () {
      this.scrollpane = new west.gui.Scrollpane(null, true);
      this.main_block.append('<p>' + TWSlang.chooseLang + ':</p>').append(this.getLangBar());
      this.scrollpane.appendContent(this.main_block).appendContent(this.modifications);
      return $(this.scrollpane.getMainDiv()).attr('id', 'tws_general');
    },
    getLangBar: function () {
      var langBox = new west.gui.Combobox();
      $.each(TWS.langs, function (a, b) {
        langBox.addItem(a, b.language);
      });
      langBox.select(TWS.lang).addListener(function (e) {
        if (e != TWS.lang) {
          localStorage.setItem('scriptsLang', e);
          TWS.updateLang();
          if (confirm(TWSlang.need_reload))
            location.reload(true);
        }
      });
      return langBox.getMainDiv();
    }
  }, '#tws_general { width: 100%; height: 355px; margin-top: 10px;}\n' + '#tws_general .tw2gui_scrollpane_clipper_contentpane { height: 390px; }\n' + '#tws_general .tws_block { width: 45%; float: left; }\n' + '#tws_general .tw2gui_checkbox { float: left; clear: left; margin-bottom: 5px; }\n' + '#tws_general .tws_block:nth-child(even) { float: right; }\n' + '#tws_copyright { position:absolute; bottom: 0px; right:5px; font-size:10px; }\n' + '.tws_block { margin: 5px; border: 1px solid #000000; -moz-border-radius: 10px; -webkit-border-radius: 10px; -khtml-border-radius: 10px; -o-border-radius: 10px; border-radius: 10px; background: rgba(175, 146, 94, 0.5); padding: 10px; }\n' + '.tws_block hr { color: #000; background-color: #000; border: 0px none; height: 1px; box-shadow: 0px 1px 1px rgba(255, 255, 255, 0.6); margin: 5px 0px 5px 0px; }\n' + '.tws_help_icon { background: url(images/tw2gui/iconset.png); width: 16px; height: 16px; position: absolute; background-position: -67px -64px; cursor: help; }\n' + '#tws_all .tw2gui_checkbox { float: left; clear: left; margin-top: 5px; }');
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
        $('iframe[src=\'forum.php\']').on('load', function () {
          var content = $(this).contents();
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
      control: function (t) {
        return new west.gui.Checkbox(TWSlang.enable_select, '', function (e) {
          TWS.Settings.set('enableSelectableText', e);
          if (e)
            t.on();
          else
            t.off();
        }).setSelected(TWS.Settings.get('enableSelectableText'), 1).getMainDiv();
      }
    }),
    FLPage: mod({
      name: 'Forum Last Page',
      version: 1.3,
      type: mod.PATCH
    }, {
      init: function () {
        if (TWS.Settings.get('enableLastPage'))
          this.on();
      },
      handler: function (d) {
        var t = $(this).contents();
        if (t.find("#thread_overview").length && !t.find('.twdb_lastpost').length) {
          t.find('.row').each(function (t) {
            var n = $(this),
            i = Math.floor(n.find('.cell_4').html() / 10),
            r = n.find('.lastreply'),
            s = n.find('.cell_1 a').attr('onclick').match(/\d+/);
            r.append('<img src="' + TWS.Images('lastpost') + '" class="twdb_lastpost" style="cursor:pointer;position:absolute;margin-left:5px;" title="' + TWSlang.to_last_page + '" onclick="Forum.openThread(' + s + ', ' + i + ')"></img>');
          });
        } else if (d.data++ < 10) //try 10 more times
          setTimeout(TWS.Patches.FLPage.handler.bind(this), 100, {
            data: d.data
          });
      },
      on: function () {
        var that = this;
        ForumWindow.open_tws = ForumWindow.open_tws || ForumWindow.open;
        ForumWindow.open = function () {
          ForumWindow.open_tws.apply(this, arguments);
          $("iframe[src='forum.php']").on('load', 0, that.handler);
        };
      },
      off: function () {
        ForumWindow.open = ForumWindow.open_tws;
      }
    }, {
      init: function () {
        return (new west.gui.Checkbox(TWSlang.enable_lastpage, '', function (e) {
            TWS.Settings.set('enableLastPage', e);
            if (e)
              TWS.Patches.FLPage.on();
            else
              TWS.Patches.FLPage.off();
          })).setSelected(TWS.Settings.get('enableLastPage'), true).getMainDiv();
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
      AudioController.play_tws = AudioController.play_tws || AudioController.play;
      AudioController.play = function (sN) {
        if (sN == 'newmsg')
          return;
        AudioController.play_tws.apply(this, arguments);
      };
    },
    off: function () {
      EventHandler.unlistenByContext('chat_tell_received', this);
      AudioController.play = AudioController.play_tws;
    },
    sounds: [0, 'bum', 'chime', 'coin', 'coin2', 'icq', 'qip', 'tinkle', 'trumpet', 'vk', ],
    updateSound: function () {
      var gS = TWS.Settings.get('beeperSound');
      if (this.sounds[gS])
        this.currSound = TWS.url + this.sounds[gS] + '.mp3';
      else if (gS)
        this.currSound = gS;
      else
        this.currSound = 'sounds/newmsg.mp3';
    },
    play: function () {
      new Audio(this.currSound).play();
    },
  }, {
    control: function (t) {
      var div = $('<div>'),
      beCo = new west.gui.Combobox('tws_beeper_changesound').addItem(0, TWSlang.default_sound).addItem(1, 'Bum').addItem(2, 'Chime').addItem(3, 'Coin').addItem(4, 'Coin 2').addItem(5, 'ICQ').addItem(6, 'QIP').addItem(7, 'Tinkle').addItem(8, 'Trumpet').addItem(9, 'VK').addItem(10, TWSlang.beeper_sound + '...').select(typeof TWS.Settings.get('beeperSound') == 'string' ? 10 : TWS.Settings.get('beeperSound')).addListener(function (v) {
        var tone = TWS.Settings.get('beeperSound');
        if (v == 10) {
          var exm = 'https://             .mp3',
          inp = prompt(TWSlang.beeper_sound + ':', exm);
          if (!inp && inp != exm) {
            beCo.select(tone);
            return;
          }
          v = inp;
        }
        if (v != tone) {
          TWS.Settings.set('beeperSound', v);
          t.updateSound();
        }
      }),
      beBo = new west.gui.Checkbox(TWSlang.enable_beeper, '', function (e) {
        TWS.Settings.set('enableBeeper', e);
        if (e)
          t.on();
        else
          t.off();
      }).setSelected(TWS.Settings.get('enableBeeper'), 1).setTitle(TWSlang.enable_beeper_title).getMainDiv(),
      beBu = new west.gui.Button(TWSlang.listen, function () {
        if (TWS.Settings.get('enableBeeper'))
          t.play();
      }).getMainDiv();
      div.append(beBo, beCo.getMainDiv(), $(beBu).css('float', 'right'));
      return div;
    }
  }, '#tws_beeper { width: 36px; height: 145px; position: fixed; left: 50%; z-index: 15; bottom: 15px; margin-left: -320px; }' + '#tws_beeper_changesound { float: left; clear: left; }');
  TWS.Timelefters = mod({
    type: mod.PATCH,
    version: 2.1
  }, {
    $charContainer: $('#ui_character_container'),
    $tlContainer: $('<div id="tws_tlContainer">'),
    init: function () {
      var pop1 = new MousePopup(),
      pop2 = new MousePopup(),
      el1 = $('<p id="tws_tlHp">').addMousePopup(pop1),
      el2 = $('<p id="tws_tlEnergy">').addMousePopup(pop2);
      this.$tlContainer.append(el1).append(el2);
      new this.TimeLefter('maxHealth', 'healthRegen', 'health', 'healthDate', function (time, perH, next, pc) {
        pop1.setXHTML(s(TWSlang.HealthTL_to + ': <b>%1</b><br>' + TWSlang.Reg_perH + ': <b>%2</b><br>' + TWSlang.HealthNext + ': <b>%3</b><br>' + TWSlang.Reg_missing + ': <b>%4%</b>', time, perH, next, pc));
        el1.html(time);
      }).startTicker();
      new this.TimeLefter('maxEnergy', 'energyRegen', 'energy', 'energyDate', function (time, perH, next, pc) {
        pop2.setXHTML(s(TWSlang.EnergyTL_to + ': <b>%1</b><br>' + TWSlang.Reg_perH + ': <b>%2</b><br>' + TWSlang.EnergyNext + ': <b>%3</b><br>' + TWSlang.Reg_missing + ': <b>%4%</b>', time, perH, next, pc));
        el2.html(time);
      }).startTicker();
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
      control: function (t) {
        var div = new west.gui.Checkbox(TWSlang.enable_timelefters, '', function (v) {
          TWS.Settings.set('enableTimelefters', v);
          if (v)
            t.on();
          else
            t.off();
        }).setSelected(TWS.Settings.get('enableTimelefters'), 1);
        return div.getMainDiv();
      }
    }, '#tws_tlContainer { width: 50px; top: 144px; position: relative; }\n' + '#tws_tlContainer p { font-size: 9px; position: relative; cursor: help; left: 4px; color: #FFF; }\n' + '#tws_tlHp { top: 2px; }\n' + '#tws_tlEnergy { top: 5px; }');
  TWS.Wir = mod({
    type: mod.MOD,
    version: 1.5,
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
      Inventory.size_tws = 99999;
      Inventory.sizeSearch_tws = 99999;
      Object.defineProperties(Inventory, {
        size: {
          get() {
            return Inventory.size_tws;
          }
        },
        sizeSearch: {
          get() {
            return Inventory.sizeSearch_tws;
          }
        },
        latestSize: {
          get() {
            return Inventory.latestSize_tws;
          }
        },
      });
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
            40, 42, 1, 1, 15, 268, 'auto', -6, 42,
          ];
          break;
        case 5:
          t = [
            46, 49, 2, 2, 18, 268, 'auto', -6, 30,
          ];
          break;
        case 4:
          t = [
            53, 60, 3, 4, 23, 268, 'auto', -6, 20,
          ];
          break;
        case 12:
          t = [
            37, 41, 2, 2, 15, 694, 'auto', 0, 128,
          ];
          break;
        case 10:
          t = [
            46, 49, 2, 2, 18, 694, 'auto', 0, 91,
          ];
          break;
        case 8:
          t = [
            50, 58, 2, 3, 23, 694, 'auto', 0, 66,
          ];
          break;
        case 2:
          t = [
            53, 60, 3, 4, 23, 694, 'hidden', 0, 66,
          ];
          break;
        default:
          t = [
            53, 60, 3, 4, 23, 268, 'hidden', 5, 20,
          ];
          break;
        }
        var n = '#bag .item.item_inventory .tw_item.item_inventory_img { width: ' + t[0] + 'px; height: ' + t[0] + 'px; margin-left: ' + t[2] + 'px !important; margin-top: ' + t[3] + 'px !important; }\n' +
          '#bag .item.item_inventory { width: ' + t[1] + 'px !important; height: ' + t[1] + 'px !important; background-size: contain !important; }\n' +
          '#bag .count { min-width: ' + t[4] + 'px !important; }\n' +
          '#bag > .pinned > .item { background-size: auto !important; }\n' +
          '#bag { width: ' + t[5] + 'px !important; overflow-y: ' + t[6] + '; margin-left: ' + t[7] + 'px; scrollbar-width: thin}';
        $('head').append($('<style type="text/css">' + n + '</style>'));
        Inventory.latestSize_tws = t[8];
      }
    },
    editInventoryLoad: function () {
      if (this.methodEdited)
        return;
      Inventory.firstLoad_tws = Inventory.firstLoad;
      Inventory.firstLoad = function () {
        Inventory.firstLoad_tws.apply(this, arguments);
        $('#bag', Inventory.DOM).off('mousewheel');
        if (TWS.Settings.get('enableWirExt')) {
          var button2 = $('<div class="tw2gui_window_buttons_closeall" title="<b>' + TWSlang.ext + '</b&gt"></div>').click(function () {
            Inventory.dockedWindow && Inventory.dockedWindow.destroy();
            Inventory.window.destroy();
          });
          $(".tw2gui_window_buttons", Inventory.window.divMain).append(button2);
        }
      };
      Inventory.setCategoryActive_tws = Inventory.setCategoryActive;
      Inventory.setCategoryActive = function (category) {
        Inventory.setCategoryActive_tws.apply(this, arguments);
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
      Inventory.firstLoad = Inventory.firstLoad_tws;
      Inventory.setCategoryActive = Inventory.setCategoryActive_tws;
      Inventory.size_tws = this.bigInv() ? 66 : 20;
      Inventory.sizeSearch_tws = this.bigInv() ? 55 : 16;
      this.addCSS(1);
    }
  }, {
    control: function (t) {
      var div = $('<div>').append(new west.gui.Checkbox(s(TWSlang.wir_enabler, 'WIR'), '', function (f) {
            TWS.Settings.set('enableWir', f);
            if (f)
              t.on();
            else
              t.off();
          }).setSelected(TWS.Settings.get('enableWir'), 1).setTitle('<b>' + TWSlang.wir + '</b><i>' + TWSlang.wir_enabler_title).getMainDiv()).append((new west.gui.Checkbox(TWSlang.ext_enabler, '', function (g) {
              TWS.Settings.set('enableWirExt', g);
            })).setSelected(TWS.Settings.get('enableWirExt'), 1).setTitle(TWSlang.ext_enabler_title).getMainDiv()).append($('<p>' + TWSlang.wir_on_one_line + ':</p>').css({
            'float': 'left',
            clear: 'left'
          })).append(new west.gui.Combobox('wir_sizer').addItem(4, s('%1 ' + TWSlang.wir_on_line, 4)).addItem(5, s('%1 ' + TWSlang.wir_on_line, 5)).addItem(6, s('%1 ' + TWSlang.wir_on_line, 6)).select(TWS.Settings.get('wirSize')).addListener(function (h) {
            if (h != TWS.Settings.get('wirSize')) {
              TWS.Settings.set('wirSize', h);
              t.addCSS(h);
            }
          }).getMainDiv());
      return div;
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
              return new UserMessage(t.error).show();
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
        if (n.hotel_level > 0 && !n.error) {
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
          new UserMessage(TWSlang.dont_have_hotel, 'error').show();
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
    control: function (t) {
      var div = $('<div>').append(new west.gui.Checkbox(TWSlang.enable_town_button, '', function (e) {
            TWS.Settings.set('enableTownButton', e);
            if (e)
              t.on();
            else
              t.off();
          }).setSelected(TWS.Settings.get('enableTownButton'), 1).setTitle(TWSlang.enable_town_title).getMainDiv()).append(new west.gui.Checkbox(TWSlang.enable_menutop, '', function (g) {
            TWS.Settings.set('enableMenuTop', g);
            t.toggleM(g);
          }).setSelected(TWS.Settings.get('enableMenuTop'), 1).getMainDiv());
      return div;
    }
  },
      '.city.button .tw2gui_selectbox { position: fixed; }\n' + '.city.button .arrow.bottom { width: 24px !important; height: 10px !important; background-position: -23px 14px !important; top: auto !important; background-image: url(images/tw2gui/selectbox_arrows.png) !important; }');
  TWS.SlySuite = mod({
    name: 'Script Suite',
    version: '1.8.1',
    type: mod.MOD
  }, {
    init: function () {
      var MHi = GameMap.Helper.imgPath;
      MHi.lookForModification_tws = MHi.lookForModification;
      MHi.lookForModification = function (path, d) {
        var rC = TWS.Settings.get('riverColor');
        $('#river_hide_css').remove();
        if (/river|deco_egg_05|quests_fluss/.test(path) && !['default', 'norivers'].includes(rC)) {
          if (rC == 'blue')
            return '/' + path;
          else
            return rC + '/' + path;
        } else if (rC == 'norivers') {
          var hidingrivers = document.createElement('style');
          hidingrivers.setAttribute('id', 'river_hide_css');
          hidingrivers.textContent = '.image[style*="river"]{display:none;}';
          document.body.appendChild(hidingrivers);
          return MHi.lookForModification_tws(path, d);
        } else
          return MHi.lookForModification_tws(path, d);
      };
      if (TWS.Settings.get('riverColor') != 'default')
        this.setRiver();
      this.KOTimer = {
        timeleft: 0,
        aliveAgain: 0,
        protectedUntil: 0,
        lastDied: Character.lastDied,
        firstrun: function () {
          this.started = 1;
          if ($('.game_notification_area').length > 0)
            $('.game_notification_area').append('<div style="position:relative;display:block;width:59px;height:59px;cursor:pointer;" class="brown" id="knockouttimer"><div id="timer"></div></div>');
          else {
            setTimeout(this.firstrun.bind(this), 3000);
            return console.log('KOTimer: Couldn\'t find the notification area, trying again soon...');
          }
          $('#knockouttimer').attr({
            'title': "Ready to duel<br>Protected until: 12/2/2015 23:50:12"
          });
          $('#knockouttimer #timer').css({
            'position': 'absolute',
            'bottom': '0px',
            'left': '0px',
            'right': '0px',
            'color': 'white',
            'text-align': 'center',
            'font-size': '11px',
            'height': '30px',
            'line-height': '30px'
          });
          this.getTimes();
          this.update(this);
        },
        getTimes: function () {
          var unix = Math.round(new Date().getTime() / 1000),
          duelString = '',
          protectionString = '';
          this.aliveAgain = Character.getMandatoryDuelProtection();
          this.protectedUntil = Character.getDuelProtection();
          var serverDateAlive = get_server_date_string(false, this.aliveAgain * 1000, true).split(' '),
          serverDateProtection = get_server_date_string(false, this.protectedUntil * 1000, true).split(' ');
          serverDateAlive = serverDateAlive[1] + ' ' + serverDateAlive[0];
          serverDateProtection = serverDateProtection[1] + ' ' + serverDateProtection[0];
          if (this.aliveAgain < unix) {
            duelString = "Ready to duel";
            if ($('#knockouttimer').hasClass('brown'))
              $('#knockouttimer').removeClass('brown hasMousePopup').addClass('green');
          } else {
            duelString = "Can duel again at: " + serverDateAlive;
            if ($('#knockouttimer').hasClass('green'))
              $('#knockouttimer').removeClass('green hasMousePopup').addClass('brown');
          }
          protectionString = "Protected until: " + serverDateProtection;
          $('#knockouttimer').attr({
            'title': duelString + "<br>" + protectionString
          });
        },
        doUpdate: function () {
          setTimeout(this.update.bind(this), 1000);
        },
        update: function () {
          if (!this.aliveAgain) {
            $('#knockouttimer').hide();
            return this.doUpdate();
          }
          var unix = Math.round(new Date().getTime() / 1000);
          if (this.protectedUntil != Character.getDuelProtection())
            this.getTimes();
          if (this.protectedUntil < unix) {
            $('#knockouttimer').hide();
            return this.doUpdate();
          } else
            $('#knockouttimer').show();
          var time;
          if (this.aliveAgain < unix) {
            time = this.protectedUntil;
            $('#knockouttimer').removeClass('brown').addClass('green');
          } else {
            time = this.aliveAgain;
            $('#knockouttimer').removeClass('green').addClass('brown');
          }
          var difference = time - unix,
          hours = Math.floor(difference / 60 / 60);
          difference -= hours * 60 * 60;
          var minutes = Math.floor(difference / 60);
          difference -= minutes * 60;
          var seconds = difference;
          if (seconds < 0)
            seconds = 0;
          $('#knockouttimer #timer').html(("0" + hours).slice(-2) + ':' + ("0" + minutes).slice(-2) + ':' + ("0" + seconds).slice(-2));
          this.doUpdate();
        },
      };
      if (TWS.Settings.get('enableKOTime'))
        this.on('KO');
      this.Achiev = {
        achvList: JSON.parse(localStorage.getItem('SlySuite_Achievements')) || {},
        allFolders: [],
        lastUpdate: new Date(0),
        nextFolderCheck: false,
        start: function () {
          this.started = 1;
          $(function () {
            Ajax.remoteCall('achievement', '', {
              playerid: Character.playerId
            }, function (r) {
              if (r.error)
                return new MessageError(r.msg).show();
              for (var f in r.menu) {
                if (!('id' in r.menu[f]))
                  continue;
                if (r.menu[f].id == 'overall' || r.menu[f].id == 'heroics')
                  continue;
                TWS.SlySuite.Achiev.allFolders.push(r.menu[f].id);
                for (var sub in r.menu[f].sub)
                  if ('id' in r.menu[f].sub[sub])
                    TWS.SlySuite.Achiev.allFolders.push(r.menu[f].sub[sub].id);
              }
              TWS.SlySuite.Achiev.createWindow();
              TWS.SlySuite.Achiev.editTracker();
              TWS.SlySuite.Achiev.updateAchievements();
            });
          });
          this.createButton();
        },
        createWindow: function () {
          if (!GameMap.width) {
            setTimeout(this.createWindow.bind(this), 3000);
            return;
          }
          this.scrolling = new west.gui.Scrollpane(null).appendContent('<div class="achievement_tracker_container">');
          this.window = wman.open('tws_achievTrack', null, 'chat questtracker noclose nofocus nocloseall dontminimize')
            .setSize(350, 170)
            .setMinSize(320, 140)
            .addEventListener(TWE('WINDOW_MINIMIZE'), this.minimize, this)
            .addEventListener(TWE('WINDOW_RELOAD'), this.manualUpdate, this)
            .setResizeable(true)
            .appendToContentPane($('<div id="ui_achievementtracker">').append(this.scrolling.getMainDiv()));
          this.window.addTab('<div class="tw2gui-iconset" title="Achievement Tracker" style="float:left;"></div>&nbsp;Achievement Tracker', 'achievTrack', function () {});
          this.window.dontCloseAll = true;
          $(this.window.getMainDiv()).css({
            left: GameMap.width - 425,
            top: 400
          });
          $('#windows .tw2gui_window.questtracker .tw2gui_window_tabbar_tabs').attr({
            'style': 'left: 2px !important'
          });
        },
        createButton: function () {
          var icon = $('<div class="menulink" title="Open Achievement Tracker" style="background:url(' + TWS.Images('sweetsAchiev', 1) + ');background-position:0px 0px">').on('mouseleave', function () {
            $(this).css('background-position', '0px 0px');
          }).on('mouseenter', function () {
            $(this).css('background-position', '-25px 0px');
          }).click(function () {
            TWS.SlySuite.Achiev.openWindow();
          });
          $('#tws_menu_icon').after($('<div id="Achievementtracker_button" style="display:none;">').append(icon));
        },
        minimize: function () {
          $(this.window.divMain).hide();
          $('#Achievementtracker_button').show();
          wman.minimizedIds[this.window.id] = this.window;
        },
        openWindow: function () {
          $(this.window.divMain).show();
          $('#Achievementtracker_button').hide();
        },
        editTracker: function () {
          Character.trackAchievement_tws = Character.trackAchievement_tws || Character.trackAchievement;
          Character.trackAchievement = function (a, b) {
            TWS.SlySuite.Achiev.trackAchievement(a, b);
          };
        },
        trackAchievement: function (progress, update) {
          if (!TWS.Settings.get('enableAchievTrack'))
            return Character.trackAchievement_tws(progress, update);
          var params = progress.split('-');
          // achievement done, track next one in group
          if (!update || params[2]) {
            var achvId = (params[2]) ? params[2] : params[0];
            this.setAchievement(achvId);
          } else
            this.setAchievement(params[1]);
        },
        setAchievement: function (achi) {
          if (achi in this.achvList) {
            delete this.achvList[achi];
            this.removeFromTracker(achi);
          } else {
            this.openWindow();
            this.achvList[achi] = {};
            this.getAchievementData(achi);
            this.descriptionNeeded.push(parseInt(achi));
            if (!this.nextFolderCheck)
              this.getFolderInfo(this.allFolders.slice());
          }
        },
        manualUpdate: function () {
          if (this.lastUpdate.getTime() < new Date().getTime() - 60000) {
            this.window.showLoader();
            clearTimeout(this.nextUpdate);
            this.updateAchievements();
            this.lastUpdate = new Date();
            this.window.hideLoader();
          } else {
            secleft = 60 - Math.floor((new Date().getTime() - this.lastUpdate.getTime()) / 1000);
            new MessageError("Updated too recently, try again in " + secleft + "s").show();
          }
        },
        updateTracker: function (achi) {
          if (this.achvList[achi].current >= this.achvList[achi].required) {
            this.setAchievement(achi);
            return;
          }
          if (!('isTime' in this.achvList[achi]))
            this.achvList[achi].isTime = false;
          if ($('#ui_achievementtracker #achievementtracker_' + achi).length) {
            $('#ui_achievementtracker #achievementtracker_' + achi + ' .achievement_current').html(this.achvList[achi].isTime ? this.tcalc(this.achvList[achi].current) : this.achvList[achi].current);
            $('#ui_achievementtracker #achievementtracker_' + achi + ' .achievement_required').html(this.achvList[achi].isTime ? this.tcalc(this.achvList[achi].required) : this.achvList[achi].required);
            $('#ui_achievementtracker #achievementtracker_' + achi + ' .achievement_percentage').html(Math.floor(this.achvList[achi].current / this.achvList[achi].required * 100));
            $('#ui_achievementtracker #achievementtracker_' + achi + ' .quest_requirement').attr('title', ('description' in this.achvList[achi] ? this.achvList[achi].description : ''));
          } else {
            $('#ui_achievementtracker .achievement_tracker_container').append('<div class="selectable" id="achievementtracker_' + achi + '">' +
              '<div class="quest-list title">' + this.achvList[achi].title +
              '<span class="quest-list remove" title="Remove achievement from tracker"></span></div>' +
              '<ul class="requirement_container"><li class="quest_requirement" ' + ('description' in this.achvList[achi] ? 'title="' + this.achvList[achi].description + '"=' : '') + '>- <span class="achievement_current">' + (this.achvList[achi].isTime ? this.tcalc(this.achvList[achi].current) : this.achvList[achi].current) +
              '</span> / <span class="achievement_required">' + (this.achvList[achi].isTime ? this.tcalc(this.achvList[achi].required) : this.achvList[achi].required) + '</span> (<span class="achievement_percentage">' +
              (Math.floor(this.achvList[achi].current / this.achvList[achi].required * 100)) + '</span>%)</li></ul></div>');
            $('#ui_achievementtracker #achievementtracker_' + achi + ' .quest-list.remove').click(function () {
              TWS.SlySuite.Achiev.setAchievement(achi);
            });
          }
          localStorage.setItem('SlySuite_Achievements', JSON.stringify(this.achvList));
        },
        getAchievementData: function (achi) {
          Ajax.remoteCall('achievement', 'track', {
            achvid: achi
          }, function (resp) {
            if (resp.error)
              return new MessageError(resp.msg).show();
            $.extend(TWS.SlySuite.Achiev.achvList[achi], {
              title: resp.title,
              current: resp.current,
              required: resp.required
            });
            TWS.SlySuite.Achiev.updateTracker(achi);
            Ajax.remoteCall('achievement', 'untrack');
          });
        },
        removeFromTracker: function (achi) {
          $('#ui_achievementtracker #achievementtracker_' + achi).remove();
          if (!Object.keys(this.achvList).length)
            this.minimize();
          TWS.Settings.set('achvList', this.achvList);
        },
        updateAchievements: function () {
          this.descriptionNeeded = [];
          if (!Object.keys(this.achvList).length)
            this.minimize();
          for (var a in this.achvList) {
            this.getAchievementData(a);
            if (!('folder' in this.achvList[a]))
              this.descriptionNeeded.push(parseInt(a));
          }
          this.nextUpdate = setTimeout(this.updateAchievements.bind(this), 10 * 60 * 1000);
          if (this.descriptionNeeded.length)
            this.getFolderInfo(this.allFolders.slice());
        },
        getFolderInfo: function (arr) {
          if (!arr.length || !TWS.SlySuite.Achiev.descriptionNeeded.length) {
            this.nextFolderCheck = false;
            return;
          }
          Ajax.remoteCall('achievement', 'get_list', {
            folder: arr[0],
            playerid: Character.playerId
          }, function (json) {
            for (var achieve in json.achievements.progress) {
              currentId = json.achievements.progress[achieve].id;
              if ($.inArray(currentId, TWS.SlySuite.Achiev.descriptionNeeded) != -1) {
                TWS.SlySuite.Achiev.descriptionNeeded.splice(TWS.SlySuite.Achiev.descriptionNeeded.indexOf(currentId), 1);
                TWS.SlySuite.Achiev.achvList[currentId].description = json.achievements.progress[achieve].desc;
                TWS.SlySuite.Achiev.achvList[currentId].folder = arr[0];
                if (json.achievements.progress[achieve].meta[0].match('^js:')) {
                  var parts = json.achievements.progress[achieve].meta[0].split(":");
                  var func = eval(parts[1]);
                  if (func instanceof west.gui.Progressbar) {
                    parts[4] ? TWS.SlySuite.Achiev.achvList[currentId].isTime = true : TWS.SlySuite.Achiev.achvList[currentId].isTime = false;
                  }
                }
                TWS.SlySuite.Achiev.updateTracker(currentId);
              }
            }
            arr.splice(0, 1);
            TWS.SlySuite.Achiev.nextFolderCheck = setTimeout(TWS.SlySuite.Achiev.getFolderInfo, 2000, arr);
          });
        },
        tcalc: function (val) {
          var h,
          m,
          s;
          m = s = "00";
          h = Math.floor(val / 3600);
          if ((val % 3600) !== 0) {
            var c = val - (h * 3600);
            if ((c % 60) !== 0)
              s = c % 60;
          }
          return (h <= 0 ? "" : h + ":") + m + ":" + s;
        }
      };
      if (TWS.Settings.get('enableAchievTrack'))
        this.on('Achv');
      this.CraftingWindow = {
        currentlySelected: false,
        knownRecipes: [],
        start: function () {
          this.started = 1;
          Crafting.addRecipe = this.addRecipe;
          Crafting.updateResources = this.updateResources;
          var cW = '.character-crafting';
          $('body').append('<style>#crafting_recipe_list { height:250px; top:43px;position:relative}' +
            cW + ' .recipe_title { background:none; cursor:pointer}' +
            cW + ' .recipe_title_inner { width:auto;margin-top:2px;}' +
            '.easy { background:none; color:rgb(40,40,40);}' +
            '.easy .recipe_title:hover { background:rgba(55, 55, 55, 0.75); color:white;}' +
            '.easy.selected .recipe_title { background:rgba(55, 55, 55, 0.75); color:white;}' +
            '.middle { background:none; color:rgb(0, 179, 3);}' +
            '.middle .recipe_title:hover { background:rgba(0, 118, 6, 0.75); color:white;}' +
            '.middle.selected .recipe_title { background:rgba(0, 118, 6, 0.75); color:white;}' +
            '.hard { background:none; color:rgb(255, 88, 0);}' +
            '.hard .recipe_title:hover { background:rgba(221, 92, 0, 0.75); color:white;}' +
            '.hard.selected .recipe_title { background:rgba(221, 92, 0, 0.75); color:white;}' +
            cW + ' .recipe_name {width:auto;color:inherit;margin-top:0px;}' +
            cW + ' .recipe_collapse {color:inherit;font-size:inherit;}' +
            '.not_available .recipe_collapse {visibility:hidden;}' +
            cW + ' .recipe_craft {color:rgb(236, 25, 25);}' +
            '#crafting_requirements_display { position: relative; top: 43px; left: 61px;}' +
            '#crafting_requirements_display #craftbuttons {position:absolute; left:2px; bottom:-19px;}' +
            '#crafting_requirements_display #craftbuttons #minbutton {cursor:pointer;margin-left:5px;display:inline-block;background: url("/images/tw2gui/plusminus/minus_button.png");width: 12px;height: 12px;}' +
            '#crafting_requirements_display #craftbuttons #plusbutton {cursor:pointer;display:inline-block;background: url("/images/tw2gui/plusminus/plus_button.png");width: 12px;height: 12px;}' +
            '#crafting_requirements_display #craftbuttons > span {vertical-align:middle;}</style>');
        },
        selectRecipe: function (id) {
          $('#recipe' + this.currentlySelected + '.selected').removeClass('selected');
          $('.recipe_content').hide();
          $('#recipe' + id).addClass('selected');
          $('#recipe_content_' + id).show();
          this.currentlySelected = id;
          if (this.craftCount(id) > 0)
            $('#crafting_requirements_display #craftbuttons').show();
          else
            $('#crafting_requirements_display #craftbuttons').hide();
          $('#crafting_requirements_display #craftbuttons #craft_amount').val(1);
          $('#crafting_requirements_display #craftbuttons #craft_amount').trigger('change');
        },
        craftCount: function (id) {
          if (!id)
            return 0;
          var canCraft = 10000;
          for (var i in Crafting.recipes[id].resources) {
            if (!Crafting.recipes[id].resources.hasOwnProperty((i)))
              continue;
            var resourceItem = ItemManager.get(Crafting.recipes[id].resources[i].item),
            amountRequired = Crafting.recipes[id].resources[i].count,
            bag_count = Bag.getItemCount(resourceItem.item_id);
            canCraft = Math.min(Math.floor(bag_count / amountRequired), canCraft);
          }
          return canCraft;
        },
        updateResources: function () {
          for (var k in Crafting.recipes) {
            var mats_available = true,
            resourceItem,
            amountRequired;
            for (var i in Crafting.recipes[k].resources) {
              if (!Crafting.recipes[k].resources.hasOwnProperty((i)))
                continue;
              resourceItem = ItemManager.get(Crafting.recipes[k].resources[i].item);
              amountRequired = Crafting.recipes[k].resources[i].count;
              var bag_count = Bag.getItemCount(resourceItem.item_id);
              TWS.SlySuite.CraftingWindow.updateCount(k);
              if (bag_count < amountRequired)
                mats_available = false;
              window.CharacterWindow.window.$('#resources_' + k + '_' + resourceItem.item_id).html(
                new tw2widget.CraftingItem(resourceItem)
                .setRequired(bag_count, amountRequired)
                .getMainDiv());
            }
            window.CharacterWindow.window.$('#recipe_craft_' + Crafting.recipes[k].item_id).empty();
            if (Crafting.recipes[k].last_craft) {
              $('#recipe_craft_' + Crafting.recipes[k].item_id).append("<span cursor:default;'>" + Crafting.recipes[k].last_craft.formatDurationBuffWay() + "</span>");
            }
            if (mats_available)
              CharacterWindow.window.$('#recipe' + Crafting.recipes[k].item_id).removeClass("not_available");
            else
              CharacterWindow.window.$('#recipe' + Crafting.recipes[k].item_id).addClass("not_available");
          }
          if (TWS.SlySuite.CraftingWindow.craftCount(TWS.SlySuite.CraftingWindow.currentlySelected) > 0)
            $('#crafting_requirements_display #craftbuttons').show();
          else
            $('#crafting_requirements_display #craftbuttons').hide();
        },
        updateCount: function (id) {
          $('#recipe_count_' + id).html('[' + this.craftCount(id) + ']');
          $('#crafting_requirements_display #craftbuttons #craft_amount').trigger('change');
        },
        updateCraftAmount(action) {
          $('#crafting_requirements_display #craftbuttons #minbutton').css('opacity', '1');
          $('#crafting_requirements_display #craftbuttons #plusbutton').css('opacity', '1');
          if (action == 'plus') {
            $('#crafting_requirements_display #craftbuttons #craft_amount').val(parseInt($('#crafting_requirements_display #craftbuttons #craft_amount').val()) + 1);
            $('#crafting_requirements_display #craftbuttons #craft_amount').trigger('change');
          } else if (action == 'min') {
            $('#crafting_requirements_display #craftbuttons #craft_amount').val(parseInt($('#crafting_requirements_display #craftbuttons #craft_amount').val()) - 1);
            $('#crafting_requirements_display #craftbuttons #craft_amount').trigger('change');
          } else if (action == 'textbox') {
            if ($('#crafting_requirements_display #craftbuttons #craft_amount').val() >= this.craftCount(this.currentlySelected)) {
              $('#crafting_requirements_display #craftbuttons #plusbutton').css('opacity', '0.3');
              $('#crafting_requirements_display #craftbuttons #craft_amount').val(this.craftCount(this.currentlySelected));
            }
            if ($('#crafting_requirements_display #craftbuttons #craft_amount').val() <= 1) {
              $('#crafting_requirements_display #craftbuttons #minbutton').css('opacity', '0.3');
              $('#crafting_requirements_display #craftbuttons #craft_amount').val(1);
            }
          }
        },
        addRecipe: function (recipe) {
          if ($('#crafting_requirements_display').length < 1) {
            $('.character-crafting.crafting').append($("<div id='crafting_requirements_display' ><div id='craftbuttons'></div>"));
            $('#crafting_requirements_display #craftbuttons').append(new west.gui.Button(TWSlang.craft, function () {
                TWS.SlySuite.CraftingWindow.craftItem(TWS.SlySuite.CraftingWindow.currentlySelected);
              }).setMinWidth(150).getMainDiv());
            var textbox = new west.gui.Textfield('craft_amount').setSize(4).setValue(1).getMainDiv();
            $('#crafting_requirements_display #craftbuttons').append("<span id='minbutton'>", textbox, "<span id='plusbutton'>");
            //EventHandler.listen('inventory_changed',function(){});
            $('#crafting_requirements_display #craftbuttons #craft_amount').on('change', function () {
              TWS.SlySuite.CraftingWindow.updateCraftAmount('textbox');
            });
            $('#crafting_requirements_display #craftbuttons #minbutton').click(function () {
              TWS.SlySuite.CraftingWindow.updateCraftAmount('min');
            });
            $('#crafting_requirements_display #craftbuttons #plusbutton').click(function () {
              TWS.SlySuite.CraftingWindow.updateCraftAmount('plus');
            });
          }
          var time_last_craft = recipe.last_craft;
          recipe = ItemManager.get(recipe.item_id);
          Crafting.recipes[recipe.item_id] = recipe;
          Crafting.recipes[recipe.item_id].last_craft = time_last_craft;
          if (CharacterWindow.window && CharacterWindow.window.$('#crafting_recipe_list').length) {
            var recipe_div = $("<div class='" + Crafting.getRecipeColor(recipe) + "' id='recipe" + recipe.item_id + "' onclick='TWS.SlySuite.CraftingWindow.selectRecipe(" + recipe.item_id + ");'></div>"),
            recipe_title_inner_div = $("<div class='recipe_title_inner'>"),
            recipe_title_div = $("<div id='recipe_title_" + recipe.item_id + "' class='recipe_title'></div>"),
            recipe_collapse_div = $("<div id='recipe_count_" + recipe.item_id + "' class='recipe_collapse'></div>"),
            recipe_difficult_div = $("<div id='recipe_difficult_" + recipe.item_id + "' class='recipe_difficult " + Crafting.getRecipeColor(recipe) + "' title='" + Crafting.description.escapeHTML() + "'></div>"),
            recipe_name_div = $("<div id='recipe_name" + recipe.item_id + "' class='recipe_name shorten'>" + recipe.name + "</div>"),
            recipe_craft_div = $("<div id='recipe_craft_" + recipe.item_id + "' class='recipe_craft'></div>"),
            recipe_content_div = $("<div id='recipe_content_" + recipe.item_id + "' class='recipe_content'></div>").hide(),
            recipe_craftitem_div = $("<div id='recipe_craftitem_" + recipe.item_id + "' class='recipe_craftitem'></div>"),
            recipe_resources_content_div = $("<div id='recipe_resources_content_" + recipe.item_id + "' class='recipe_resources'></div>");
            TWS.SlySuite.CraftingWindow.knownRecipes[recipe.item_id] = recipe;
            recipe_title_inner_div.append(recipe_collapse_div, recipe_name_div);
            recipe_title_div.append(recipe_title_inner_div, recipe_craft_div).appendTo(recipe_div);
            var craftitem = $("<div id='craftitem_" + recipe.item_id + "' style='float:none;'>").append((new tw2widget.CraftingItem(ItemManager.get(recipe.craftitem))).getMainDiv());
            craftitem.appendTo(recipe_craftitem_div);
            var available = true,
            resourceItem,
            canCraft = 1000000;
            for (var i in recipe.resources) {
              if (!recipe.resources.hasOwnProperty(i))
                continue;
              resourceItem = ItemManager.get(recipe.resources[i].item);
              var resource = $("<div id='resources_" + recipe.item_id + "_" + resourceItem.item_id + "'></div>");
              var bag_count = Bag.getItemCount(resourceItem.item_id);
              canCraft = Math.min(Math.floor(bag_count / recipe.resources[i].count), canCraft);
              recipe_resources_content_div.append(resource.append(
                  new tw2widget.CraftingItem(resourceItem)
                  .setRequired(bag_count, recipe.resources[i].count)
                  .getMainDiv()));
              var hasItem = Bag.getItemByItemId(resourceItem.item_id);
              if (!hasItem || hasItem.getCount() < recipe.resources[i].count)
                available = false;
            }
            recipe_collapse_div.html('[' + canCraft + ']');
            if (!available)
              recipe_div.addClass("not_available");
            else if (time_last_craft)
              recipe_craft_div.append("<span style='cursor:default;'>" + time_last_craft.formatDurationBuffWay() + "</span>");
            recipe_content_div.append(recipe_craftitem_div, recipe_resources_content_div, $("<br>")).appendTo($('#crafting_requirements_display'));
            $('#crafting_recipe_list .tw2gui_scrollpane_clipper_contentpane').prepend(recipe_div);
            TWS.SlySuite.CraftingWindow.selectRecipe(recipe.item_id);
          }
        },
        craftItem: function (recipe_id) {
          Ajax.remoteCall('crafting', 'start_craft', {
            recipe_id: recipe_id,
            amount: $('#crafting_requirements_display #craftbuttons #craft_amount').val()
          }, function (resp) {
            if (resp.error)
              return new MessageError(resp.msg).show();
            var data = resp.msg;
            CharacterWindow.progressCrafting.setValue(data.profession_skill);
            Character.setProfessionSkill(data.profession_skill);
            CharacterWindow.window.$('#recipe' + recipe_id)
            .removeClass('middle hard easy')
            .addClass(Crafting.getRecipeColor(ItemManager.get(recipe_id)));
            EventHandler.signal("inventory_changed");
            Character.updateDailyTask('crafts', data.count);
            return new MessageSuccess(data.msg).show();
          });
        },
      };
      if (TWS.Settings.get('enableCraftWin'))
        this.on('Craft');
    },
    on: function (o) {
      switch (o) {
      case 'KO':
        if (!this.KOTimer.started)
          this.KOTimer.firstrun();
        break;
      case 'Achv':
        if (!this.Achiev.started)
          this.Achiev.start();
        break;
      case 'Craft':
        if (!this.CraftingWindow.started)
          this.CraftingWindow.start();
        break;
      }
    },
    off: function (o) {
      switch (o) {
      case 'KO':
        break;
      case 'Achv':
        break;
      case 'Craft':
        break;
      }
    },
    setRiver: function () {
      GameMap.Helper.imgPath.clearCache();
      GameMap.refresh(true);
    },
  }, {
    control: function (t) {
      var riverColors = {
        'default': 'Default',
        blue: 'Blue',
        halloween: 'Red',
        paddy: 'Green',
        valentine: 'Pink',
        norivers: 'Hide Rivers'
      },
      riverBox = new west.gui.Combobox();
      $.each(riverColors, function (a, b) {
        riverBox.addItem(a, b);
      });
      riverBox.select(TWS.Settings.get('riverColor')).addListener(function (e) {
        if (e != TWS.Settings.get('riverColor')) {
          TWS.Settings.set('riverColor', e);
          t.setRiver();
        }
      });
      var div = $('<div>').append('Choose river color: ', riverBox.getMainDiv()).append(new west.gui.Checkbox('Knockout Timer', '', function (f) {
            TWS.Settings.set('enableKOTime', f);
            if (f)
              t.on('KO');
            else
              t.off('KO');
          }).setSelected(TWS.Settings.get('enableKOTime'), 1).getMainDiv()).append(new west.gui.Checkbox('Achievement tracker', '', function (g) {
            TWS.Settings.set('enableAchievTrack', g);
            if (g)
              t.on('Achv');
            else
              t.off('Achv');
          }).setSelected(TWS.Settings.get('enableAchievTrack'), 1).getMainDiv()).append(new west.gui.Checkbox('Improved crafting window', '', function (h) {
            TWS.Settings.set('enableCraftWin', h);
            if (h)
              t.on('Craft');
            else
              t.off('Craft');
          }).setSelected(TWS.Settings.get('enableCraftWin'), 1).getMainDiv());
      return div;
    }
  }, '#knockouttimer.green {background-image: url(' + TWS.Images('knockout_green') + ');} #knockouttimer.brown {background-image: url(' + TWS.Images('knockout') + ');}' +
      '#ui_achievementtracker .quest-list.title {margin-left:5px;color: #DBA901;font-weight: bold;display:inline-block;zoom:1;}\n' +
      '#ui_achievementtracker .selectable:hover .quest-list.remove {display:inline-block;zoom:1;cursor:pointer;}\n' +
      '#ui_achievementtracker .quest-list.remove {background: url(images/chat/windowicons.png) no-repeat -120px 0px;width: 12px; height: 12px; margin-left:5px;margin-bottom:-2px;}\n' +
      'div#ui_achievementtracker { width: 100%; height: 100%; display:block;}\n' +
      '.tws_achievTrack.questtracker {box-shadow:none!important;}\n');
  TWS.DuelSafer = mod({
    type: mod.TAB,
    version: 1.5,
    name: TWSlang.DuelSafer_found,
    tid: 'ds'
  }, {
    init: function () {
      this.Friends.init();
      SaloonWindow.startDuel_tws = SaloonWindow.startDuel;
      SaloonWindow.startDuel = function (playerId, allianceId, a, p, v) {
        TWS.DuelSafer.args = arguments;
        var duel = function () {
          SaloonWindow.startDuel_tws.apply(SaloonWindow, TWS.DuelSafer.args);
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
    },
    showWarningMessage: function (type, id) {
      var i,
      o = TWS.DuelSafer.Friends.get();
      i = '<div>' + TWSlang.DuelSafer_friend_text + '<br><br>' + this.Friends.types[type] + ':' + '<b style=\'color:green;\'> ' + (id == 'friendlist' ? TWSlang.friendlist : o[type + 's'][id]) + '</b></div>';
      new west.gui.Dialog(TWSlang.DuelSafer_friend, i, 'question').addButton('yes', function () {
        SaloonWindow.startDuel_tws.apply(SaloonWindow, TWS.DuelSafer.args);
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
          return typeof r === "function" && r(null);
        if (isDefined(i.Friends.get()[type + 's'][o]))
          return typeof r === "function" && r(false);
        i.Friends.add(type, n, o);
        s = {
          id: o
        };
        s[type] = n;
        if (typeof r === "function")
          r(s);
      });
    },
    'delete': function () {
      this.Friends.delete.apply(this.Friends, arguments);
      this.Friends.update();
    }
  }, {
    control: function (t) {
      var n = this,
      r = $('<div id="tws_ds_help" class="tws_help_icon" title="' + TWSlang.help_icon + '">'),
      friendsBox = new west.gui.Checkbox(TWSlang.addfriends, '', function (e) {
        TWS.Settings.set('safeFriends', e);
      }).setSelected(TWS.Settings.get('safeFriends'), 1).setTitle(TWSlang.addfriends).setId('tws_ds_friendsBox').getMainDiv();
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
        var a = $('<span class="tws_ds_friend">').append($('<strong title="' + r.open_title + '">' + s + '</strong>').click(function () {
              i(t);
            })).append($('<a class="tws_ds_delete" title="' + r.delete_title + '">').click(function () {
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
      this.List = $('<div id="tws_ds_towns" class="tws_block">');
      this.DOM = $('<div id="' + t + '">').append('<p>' + r.add_new + '</p>', u.getMainDiv(), a.getMainDiv(), this.List);
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
  setTimeout(function () {
    if (window.SlySuite)
      new west.gui.Dialog('TW Sweets', '<span><b>TW Script Suite</b> is already included in <b>TW Sweets</b>.<br><br>Please remove "The West Script Suite" from Grease-/Tampermonkey:<br><br><img src="//imgur.com/tGIkeM7.png"><br><br><img src="//imgur.com/so3OyYC.png"></span>', 'warning').setDraggable(1).addButton('ok').show();
  }, 1e4);
  (TWS.Updater = function () {
    if (!window.scriptRequest) {
      scriptRequest = true;
      $.getScript(TWS.url + 'sUp.js');
    }
    var intVal = setInterval(function () {
      if (window.scriptUp) {
        scriptUp.c('TWS', TWS.version, TWS.name, TWS.lang);
        clearInterval(intVal);
      }
    }, 2000);
  })();
});
