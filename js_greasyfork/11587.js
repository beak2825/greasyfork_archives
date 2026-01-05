// ==UserScript==
// @name TWeaker
// @namespace TomRobert
// @author Vbyec (updated by Tom Robert)
// @description Some little tweaks for The-West
// @include http*://*.the-west.*/game.php*
// @version 0.1.13
//
// @history 0.1.13 correction in German translation
// @history 0.1.12 items search fixed and improved
// @history 0.1.11 Fix for the west version 2.21, add update function
// @history 0.1.10 Add Polish (TeeNOmore127)
// @history 0.1.9  Fix for the west beta
// @history 0.1.8  Add German (Tom Robert), remove Kick-o-matic autoload
// @history 0.1.7  Add Spanish (pepe100)
// @history	0.1.6  Add Items controls and search
// @history	0.1.5  Add English
// @history	0.1.4  Add Kick-o-matic autoload
// @nocompat Chrome
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/11587/TWeaker.user.js
// @updateURL https://update.greasyfork.org/scripts/11587/TWeaker.meta.js
// ==/UserScript==
(function (fn) {
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn + ')();';
  document.body.appendChild(script);
  document.body.removeChild(script);
}) (function () {
  Tweaker = {
    version: '0.1.13',
    name: 'Tweaker',
    author: 'Vbyec (updated by Tom Robert)',
    minGame: '2.08',
    maxGame: Game.version.toString(),
    website: 'https://greasyfork.org/scripts/7530',
    updateUrl: 'https://raw.githack.com/TomRobert/tw/master/sU.js',
  };
  langs = {
    ru_RU: {
      language: 'Russian (ру́сский)',
      ApiGui: '<b>How to use:</b><br><u>Ctrl+click:</u> Copy <i>*nickname*</i> to active chat.<br><u>Shift+click:</u> Copy "<i>*nickname* change with</i>" to active chat.<br><u>Backspace+click:</u> Open private chat with current player.<br>Automatically add some information (total dmg, last hit) to players description in fortbattle.<br>Write "<i>/items</i>" into chat to check out new items.<br>Write "<i>/items.s name</i>" into chat to find items by name.<br>Write "<i>/items.add</i>" into chat to update local DB.',
      contact: 'контакт',
      searched: 'Number of items found which include this part in their name: ',
      noNew: 'No new items',
      added: 'Items added to local storage: ',
      noAdd: 'No new item to add to local storage',
      TotalDamage: 'Урона за бой',
      LastHit: 'Последний выстрел',
      KillShot: 'Скальп',
      ChangeWith: 'смена с',
      UserMessage: 'Похоже появились новые шмотки.',
      itemsShorthelp: 'Первичная настрока локального хранилища вещей.',
      itemsHelp: 'Первичная настрока локального хранилища вещей, если хранилище уже существует- проверка на появление новых вещей.',
      itemssShorthelp: 'Поиск по названию предмета.',
      itemssHelp: 'Поиск по части названия предмета. Регистронезависимый.',
      itemssUsage: 'часть названия',
      itemsaddShorthelp: 'Добавить новые предметы в локальную базу.',
      itemsaddHelp: 'Добавить все новые предметы в локальную базу, чтобы они не показывали при.',
      update: 'обновление',
      updateAvailable: 'Доступно обновление скрипта',
    },
    en_US: {
      language: 'None (English)',
      ApiGui: '<b>How to use:</b><br><u>Ctrl+click:</u> Copy <i>*nickname*</i> to active chat.<br><u>Shift+click:</u> Copy "<i>*nickname* change with</i>" to active chat.<br><u>Backspace+click:</u> Open private chat with current player.<br>Automatically add some information (total dmg, last hit) to players description in fortbattle.<br>Write "<i>/items</i>" into chat to check out new items.<br>Write "<i>/items.s name</i>" into chat to find items by name.<br>Write "<i>/items.add</i>" into chat to update local DB.',
      contact: 'Contact',
      searched: 'Number of items found which include this part in their name: ',
      noNew: 'No new items',
      added: 'Items added to local storage: ',
      noAdd: 'No new item to add to local storage',
      TotalDamage: 'Total damage',
      LastHit: 'Last hit',
      KillShot: 'Kill shot',
      ChangeWith: 'change with',
      UserMessage: 'New items found.',
      itemsShorthelp: 'Check out new items.',
      itemsHelp: 'Shows the items, which were last added to the game. But you have to set up first a local storage of actual items to detect new items.',
      itemssShorthelp: 'Find items by name.',
      itemssHelp: 'Type in anything to search for items, where that part is included.',
      itemssUsage: 'parte name',
      itemsaddShorthelp: 'Update local DB.',
      itemsaddHelp: 'Add new items to the local storage, which aren\'t registrated yet.',
      update: 'Update',
      updateAvailable: 'A new version of the script is available',
    },
    es_ES: {
      language: 'Spanish (Español)',
      ApiGui: '<b>Uso:</b><br><u>Ctrl+click:</u> Copia <i>*nombre_jugador*</i> en el chat activo.<br><u>Shift+click:</u> Copia el texto "<i>*nombre_jugador* cambia con</i>" en el chat activo.<br><u>Backspace+click:</u> Abre chat privado con el jugador actual.<br>Automáticamente añade la siguiente información (daño total, último tiro) en la descripción de los jugadores en batallas de fuertes, simplemente marcando con el puntero del ratón el jugador en el fuerte.<br>Escribe "<i>/items</i>" en el chat para ver nuevos artículos.<br>Escribe "<i>/items.s nombre</i>" en el chat para encontrar artículos por nombre.<br>Escribe "<i>/items.add</i>" en el chat para actualizar la Base de Datos local.',
      contact: 'Contacto',
      searched: 'Número de objetos encontrados que incluyen esta parte en su nombre: ',
      noNew: 'No hay nuevos objetos',
      added: 'Objetos añadidos al almacenamiento local: ',
      noAdd: 'No hay nuevos objetos para añadir al almacenamiento local',
      TotalDamage: 'Daño Total',
      LastHit: 'Último tiro',
      KillShot: 'Desmayo',
      ChangeWith: 'cambiar con',
      UserMessage: 'Nuevos objetos encontrados.',
      itemsShorthelp: 'Echa un vistazo a los nuevos objetos.',
      itemsHelp: 'Muestra los objetos, que fueron añadidos últimamente al juego. Pero primero hay que crear un almacenamiento local de los objetos reales para detectar los nuevos objetos.',
      itemssShorthelp: 'Encontrar objetos por su nombre.',
      itemssHelp: 'Escribe cualquier cosa para buscar objetos, donde se incluya esa parte.',
      itemssUsage: 'parte del nombre',
      itemsaddShorthelp: 'Actualizar la Base de Datos local.',
      itemsaddHelp: 'Agregar nuevos objetos a la base de datos local, que no hayan sido registrados todavía.',
      update: 'Actualización',
      updateAvailable: 'Una nueva versión del script está disponible',
    },
    de_DE: {
      language: 'German (Deutsch)',
      ApiGui: '<b>Funktionen:</b><br><u>Ctrl+Klick:</u> Kopiert <i>*nickname*</i> in den aktiven Chat.<br><u>Shift+Klick:</u> Kopiert "<i>*nickname* tausche mit</i>" in den aktiven Chat.<br><u>Löschtaste+Klick:</u> Öffnet privaten Chat mit dem angeklickten Spieler.<br>Fügt automatisch zusätzliche Informationen (Gesamter Schaden, letzter Treffer) zur Spielerbeschreibung im Fortkampf hinzu.<br>Tippe "<i>/items</i>" in den Chat um neue Items zu finden.<br>Tippe "<i>/items.s Kürzel</i>" in den Chat um Items mit dem Kürzel zu finden.<br>Tippe "<i>/items.add</i>" in den Chat um neue Items dem lokalen Speicher hinzuzufügen.',
      contact: 'Kontakt',
      searched: 'Anzahl gefundene Items mit diesem Kürzel im Namen: ',
      noNew: 'Keine neuen Items',
      added: 'Anzahl Items zum lokalen Speicher hinzugefügt: ',
      noAdd: 'Keine neuen Items für Hinzufügen zum lokalen Speicher',
      TotalDamage: 'Gesamter Schaden',
      LastHit: 'Letzter Treffer',
      KillShot: 'Todesschuss',
      ChangeWith: 'tausche mit',
      UserMessage: 'Neue Items gefunden.',
      itemsShorthelp: 'Neue Items anschauen.',
      itemsHelp: 'Zeige Items, welche neu zum Spiel hinzugefügt wurden und noch nicht in deinem lokalen Speicher sind.',
      itemssShorthelp: 'Finde Items mit Kürzel.',
      itemssHelp: 'Durch Eingabe von Wortbruchstücken werden alle Items angezeigt, welche dazu gefunden werden.',
      itemssUsage: 'Wortfetzen',
      itemsaddShorthelp: 'Lokalen Speicher aktualisieren.',
      itemsaddHelp: 'Ungespeicherte Items werden dem lokalen Speicher hinzugefügt.',
      update: 'Update',
      updateAvailable: 'Für das Script ist eine neue Version erhältlich',
    },
    pl_PL: {
      language: 'Polish (Polski)',
      ApiGui: '<b>Jak używać:</b><br><u>Ctrl+click:</u> Skopiuj <i>*nickname*</i> do aktywnego czatu.<br><u>Shift+click:</u> Skopiuj "<i>*nickname* rotacja z</i>" do aktywnego czatu.<br><u>Backspace+click:</u> Otwórz czat prywatny z obecnym graczem.<br>Automatycznie dodaje kilka informacji (Całkowite obrażenia, ostatni strzał) do opisu graczy na bitwie.<br>Napisz "<i>/items</i>" na czacie, aby sprawdzić nowe przedmioty.<br>Napisz "<i>/items.s name</i>" na czacie, by znaleźć przedmiot po nazwie.<br>Napisz "<i>/items.add</i>" na czacie,by zaktualizować bazę danych.',
      contact: 'Kontakt',
      searched: 'Number of items found which include this part in their name: ',
      noNew: 'No new items',
      added: 'Items added to local storage: ',
      noAdd: 'No new item to add to local storage',
      TotalDamage: 'Łączne Obrażenia',
      LastHit: 'Ostatni strzał',
      KillShot: 'Zabójstwo!',
      ChangeWith: 'Rotacja z',
      UserMessage: 'Nowe przedmioty znalezione.',
      itemsShorthelp: 'Zobacz nowe przedmioty.',
      itemsHelp: 'Pokaż przedmioty, które ostatnio zostały dodane.',
      itemssShorthelp: 'Szukaj przedmiotów po nazwie.',
      itemssHelp: 'Wpisz cokolwiek, aby znaleźć przedmiot, w których część została uwzględniona.',
      itemssUsage: 'Część nazwy',
      itemsaddShorthelp: 'Zaktualizuj lokalną Baze Danych.',
      itemsaddHelp: 'Dodaj nowe przedmioty do lokalnej pamięci, które nie zostały zarejestrowane.',
      update: 'Aktualizacja',
      updateAvailable: 'Nowa wersja skryptu jest dostępna',
    },
  };
  TWlang = langs.hasOwnProperty(Game.locale) ? langs[Game.locale] : langs.es_ES;
  var TweakerAPI = TheWestApi.register('TWeaker', Tweaker.name, Tweaker.minGame, Tweaker.maxGame, Tweaker.author, Tweaker.website);
  TweakerAPI.setGui('<br><i>Idioma detectado: </i>' + TWlang.language + '<br><br>Algunos pequeños ajustes para The West.<br>Activa comandos en las batallas de fuertes (forma sencilla de copiar el nombre de los jugadores).<br><br>' + TWlang.ApiGui + '<br><br><i>' + Tweaker.name + ' v' + Tweaker.version +
  '</i>'); /*<br><br><br><b>' + TWlang.contact + ':</b><ul style="margin-left:15px;"><li>Envía un mensaje a <a target=\'_blanck\' href="http://om.the-west.de/west/de/player/?ref=west_invite_linkrl&player_id=647936&world_id=13&hash=7dda">Tom Robert en alemán Mundo Arizona</a></li>'+
  '<li>Contacta conmigo en <a target=\'_blanck\' href="https://greasyfork.org/forum/messages/add/Tom Robert">Greasy Fork</a></li>'+
  '<li>Mándame un mensaje en cualquiera de estos foros de The West<br>/ <a target=\'_blanck\' href="http://forum.the-west.de/private.php?do=newpm&u=24502">deutsches Forum</a> / '+
  '<a target=\'_blanck\' href="http://forum.the-west.net/private.php?do=newpm&u=37219">foro inglés</a> / <a target=\'_blanck\' href="http://forum.the-west.pl/private.php?do=newpm&u=32083">forum polski</a> / '+
  '<a target=\'_blanck\' href="http://forum.the-west.es/private.php?do=newpm&u=13770">foro español</a> /<br>/ <a target=\'_blanck\' href="http://forum.the-west.ru/private.php?do=newpm&u=27430">России форум</a> / '+
  '<a target=\'_blanck\' href="http://forum.the-west.fr/private.php?do=newpm&u=17783">foro francés</a> / <a target=\'_blanck\' href="http://forum.the-west.it/private.php?do=newpm&u=14287">forum italiano</a> / '+
  '<a target=\'_blanck\' href="http://forum.beta.the-west.net/private.php?do=newpm&u=4072">foro beta</a> /<br>Yo obtendré un correo cuando me envíes el mensaje <img src="../images/chat/emoticons/smile.png"></li></ul>*/
  // local DataBase of items.
  window.Items = {
    room: '',
    add_item: function (id, name) {
      localStorage.setItem('tweak_' + id, name);
      return true;
    },
    get_name: function (id) {
      return localStorage.getItem('tweak_' + id);
    },
    search: function (query) {
      localStorage.getItem('tweakItems_count') ? '' : Items.init();
      var counter = 0;
      for (var key in localStorage) {
        if (typeof key === 'string' && key.indexOf('tweak_') === 0) {
          var index = key.split('_') [1];
          if (Items.get_name(index).toLowerCase().indexOf(query.toLowerCase()) >= 0) {
            Items.show_in_chat('item=' + index + ' : ' + '[item=' + index + ']');
            counter = counter + 1;
          }
        }
      }
      Items.show_in_chat('"' + query + '" ---> ' + TWlang.searched + counter);
    },
    check: function () {
      var count = 0;
      for (var i = 0; i < 300000; i++) {
        var item = ItemManager.getByBaseId(i);
        if (item !== undefined) {
          count++;
        }
      }
      var prev_count = localStorage.getItem('tweakItems_count') === null ? 0 : localStorage.getItem('tweakItems_count');
      if (prev_count < count) {
        new UserMessage(TWlang.UserMessage, UserMessage.TYPE_SUCCESS).show();
        Items.show_new();
      } 
      else {
        Items.show_in_chat(TWlang.noNew);
      }
    },
    show_new: function () {
      for (var i = 0; i < 300000; i++) {
        var item = ItemManager.getByBaseId(i);
        if (item !== undefined && Items.get_name(item.item_id) === null) {
          Items.show_in_chat('item=' + item.item_id + ' : ' + '[item=' + item.item_id + ']');
        }
      }
    },
    init: function () {
      if (localStorage.getItem('tweakItems_count') === null) {
        Items.add_all();
      } 
      else {
        Items.check();
      }
    },
    add_all: function () {
      var count = 0;
      for (var i = 0; i < 300000; i++) {
        var item = ItemManager.getByBaseId(i);
        if (item !== undefined && Items.get_name(item.item_id) === null) {
          Items.add_item(item.item_id, item.name);
          count++;
        }
      }
      if (count > 0) {
        var prev_count = localStorage.getItem('tweakItems_count') === null ? 0 : localStorage.getItem('tweakItems_count');
        localStorage.setItem('tweakItems_count', parseInt(prev_count) + count);
        Items.show_in_chat(TWlang.added + count);
      } 
      else {
        Items.show_in_chat(TWlang.noAdd);
      }
    },
    show_in_chat: function (text) {
      Items.room.addMessage(Game.TextHandler.parse(text) + '<br/>');
    }
  };
  Chat.Operations['^/items$'] = {
    cmd: 'items',
    shorthelp: TWlang.itemsShorthelp,
    help: TWlang.itemsHelp,
    usage: '/items',
    func: function (room, msg) {
      Items.room = room;
      Items.init();
    }
  };
  Chat.Operations['^/items.s (.+)$'] = {
    cmd: 'items.s',
    shorthelp: TWlang.itemssShorthelp,
    help: TWlang.itemssHelp,
    usage: '/items.s ' + TWlang.itemssUsage,
    func: function (room, msg, search) {
      Items.room = room;
      Items.search(search[1]);
    }
  };
  Chat.Operations['^/items.add$'] = {
    cmd: 'items.add',
    shorthelp: TWlang.itemsaddShorthelp,
    help: TWlang.itemsaddHelp,
    usage: '/items.add',
    func: function (room, msg) {
      Items.room = room;
      Items.add_all();
    }
  };
  FortBattleWindow.showBattleOrigin = FortBattleWindow.showBattle;
  FortBattleWindow.showBattle = function (response) {
    FortBattle.cacheAll(response);
    FortBattleWindow.showBattleOrigin.call(this, response);
  };
  // Add players on fort to localStorage
  //rewrite by while
  //@todo get fort position
  FortBattle.cacheAll = function (resp) {
    Ajax.remoteCallMode('players', 'get_data', {
      x: Character.position.x,
      y: Character.position.y,
      page: 0
    }, function (data) {
      data.players.forEach(function (player) {
        if (!localStorage.hasOwnProperty('PlayerId_' + player.player_id)) {
          localStorage.setItem('PlayerId_' + player.player_id, player.name);
        }
      });
      var count = data.pages;
      for (var i = 1; i < count; i++) {
        Ajax.remoteCallMode('players', 'get_data', {
          x: Character.position.x,
          y: Character.position.y,
          page: i
        }, function (data) {
          data.players.forEach(function (player) {
            if (!localStorage.hasOwnProperty('PlayerId_' + player.player_id)) {
              localStorage.setItem('PlayerId_' + player.player_id, player.name);
            }
          });
        });
      }
    });
  };
  // Show advance information about player
  FortBattle.getCharDataSheetOrigin = FortBattle.getCharDataSheet;
  FortBattle.getCharDataSheet = function (data) {
    return FortBattle.getCharDataSheetOrigin(data) + '<br/><div class=\'total_damage\'>' + TWlang.TotalDamage + ':<strong>%totalDmg%</strong> </div>' +
    '<div class=\'last_damage\'>' + TWlang.LastHit + ': <strong>%lastDmg%</strong></div>';
  };
  FortBattle.flashShowCharacterInfoOrigin = FortBattle.flashShowCharacterInfo;
  FortBattle.flashShowCharacterInfo = function (fortId, playerId, healthNow, healthMax, totalDmg, lastDmg, shotat, bonusdata, resp) {
    //Kill shot
    lastDmg = lastDmg < 15000 ? lastDmg : TWlang.KillShot;
    FortBattle.flashShowCharacterInfoOrigin(fortId, playerId, healthNow, healthMax, totalDmg, lastDmg, shotat, bonusdata);
    FortBattle.flashShowCharacterInfoEl(playerId);
  };
  FortBattle.flashShowCharacterInfoEl = function (playerId) {
    if (parseInt(Chat.MyId.split('_') [1]) === playerId)
    return;
    setTimeout(function () {
      document.onkeyup = null;
    }, 2500);
    document.onkeyup = function (e) {
      e = e || window.event;
      e.preventDefault();
      var active_chat_input = $('input.message:visible');
      var keyCode = e.keyCode ? e.keyCode : e.charCode;
      var nick = localStorage.getItem('PlayerId_' + playerId);
      switch (keyCode) {
        case 16:
          /* shift */
          if (!nick)
          return;
          active_chat_input.val(active_chat_input.val() + '*' + nick + '* ' + TWlang.ChangeWith + '  ');
          break;
        case 17:
          /* ctrl */
          if (!nick)
          return;
          active_chat_input.val(active_chat_input.val() + '*' + nick + '* ');
          active_chat_input.focus();
          break;
        case 8:
          /* backspace */
          var client = Chat.Resource.Manager.getClient('client_' + playerId);
          var room = Chat.Resource.Manager.acquireRoom(client);
          if (room)
          room.openClick();
          break;
        default:
          break;
      }
      document.onkeyup = null;
      /*smth*/
    };
  };
  EventHandler.listen('chat_init', function () {
    for (var room in Chat.Resource.Manager.getRooms()) {
      if (room.indexOf('room_town') === 0) {
        $('<p style=\'left: 50%; position: absolute; top: 44px; margin-left: -305px; color: white; font-weight: bolder; font-size: 18px;\'>' + Chat.Resource.Manager.getRooms() [room].topic + '</p>').appendTo('#ui_topbar');
      }
    }
  });
  Tweaker.Updater = function () {
    $.getScript(Tweaker.updateUrl, function () {
      if (scriptUpdate.Tweaker > Tweaker.version) {
        var updateMessage = new west.gui.Dialog(TWlang.update + ': ' + Tweaker.name, TWlang.updateAvailable + ': v' + scriptUpdate.Tweaker, west.gui.Dialog.SYS_WARNING).addButton(TWlang.update, function () {
          updateMessage.hide();
          location.href = Tweaker.website + '/code.user.js';
        }).addButton('cancel').show();
      }
    });
  };
  Tweaker.Updater();
});
