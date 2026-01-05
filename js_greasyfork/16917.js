// ==UserScript==
// @name TheWest-Notifier
// @namespace TWNotifier_M77
// @author Meuchelfix77 (updated by Tom Robert)
// @description Plays a notification sound, when specified events are triggered in the browser game The West!
// @include https://*.the-west.*/game.php*
// @exclude https://classic.the-west.net*
// @version 1.023
// @icon http://twm.pf-control.de/TWNotifier/favicon.ico
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/16917/TheWest-Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/16917/TheWest-Notifier.meta.js
// ==/UserScript==
(function (fn) {
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.textContent = '(' + fn.toString() + ')();';
  (document.head || document.body || document.documentElement).appendChild(script);
  script.parentNode.removeChild(script);
})(function () {
  TWN = {
    version: '1.023',
    name: 'TheWest-Notifier',
    author: 'Meuchelfix77 (updated by Tom Robert)',
    website: 'https://greasyfork.org/scripts/16917',
    LANGUAGE: (localStorage.getItem('scriptsLang') || Game.locale.substr(0, 2)),
    init: function () {
      switch (TWN.LANGUAGE) {
      default:
        TWN.lang = {
          translator: 'Meuchelfix77',
          notifications: 'Notifications',
          confirmationTitle: 'Confirmation',
          confirmation: 'Are you sure to remove this notification?',
          types: {
            messages: 'Messages',
            reports: 'Reports',
            townforum: 'Townforum',
            friends: 'Friends',
            wayFinished: 'Way finished',
            noQueue: 'Empty job queue',
            newItem: 'New item',
            nickInChat: 'Nickname in chat',
          },
          sounds: {
            bum: 'Bum',
            chime: 'Chime',
            coin: 'Coin',
            coin2: 'Coin 2',
            icq: 'ICQ',
            qip: 'QIP',
            tinkle: 'Tinkle',
            trumpet: 'Trumpet',
            vk: 'VK',
            custom: 'Custom',
          },
          event: 'Event',
          info: 'Information',
          remove: 'Remove this notification',
          listen: 'Listen to this sound',
          sound: 'Sound',
          soundFile: 'Sound file',
          soundInfo: 'Warning! Not all files can be played in your browser.',
          desc: {
            messages: 'Telegram received:',
            reports: 'Report received of type:',
            townforum: 'New forum post in:',
            friends: 'Friend(s) online:',
            wayFinished: 'Way finished:',
            noQueue: 'Empty job queue:',
            newItem: 'New item in inventory:',
            nickInChat: 'Nickname typed in chat:',
          },
          reportTypes: {
            all: 'All',
            work: 'Work',
            duels: 'Duels',
            achvmnt: 'Achievements',
            fort: 'Fort battles',
            other: 'Other',
          },
          add: 'Add notification',
          wayFinishedInfo: 'Triggers when you have finished your way and reached your destination.',
          reportInfo: '<b>Warning!</b> This will cause problems with the blinking messages button on the bottom screen.<br>Selecting <i>All</i> will solve these problems.',
          noQueueInfo: 'Triggers when there are no more job assignments in you job queue.',
          messagesInfo: 'Triggers when you receive a telegram.',
          friendListInfo: 'Seperate multiple friends with a semicolon (;)',
          townforumInfo: 'Triggers when somebody writes a post in the forum<span id="selectedForum"></span>.',
          newItemInfo: 'Triggers when you find, buy or get a new item.',
          nickInChatInfo: 'Triggers when your name was typed in the chat. Seperate more nicks with a semicolon (;)',
          install: 'Install',
          cancel: 'Cancel',
          update: 'Update',
          updateAvailable: 'A new version of the script is available',
        };
        break;
      case ('de'):
        TWN.lang = {
          translator: 'Meuchelfix77',
          notifications: 'Benachrichtigungen',
          confirmationTitle: 'Bestätigung',
          confirmation: 'Willst du diese Benachrichtigung wirklich löschen?',
          types: {
            messages: 'Telegramme',
            reports: 'Berichte',
            townforum: 'Stadtforum',
            friends: 'Freunde',
            wayFinished: 'Weg beendet',
            noQueue: 'Keine Arbeitsaufträge',
            newItem: 'Neues Item',
            nickInChat: 'Spielername im Chat',
          },
          sounds: {
            bum: 'Bum',
            chime: 'Glockenspiel',
            coin: 'Münze',
            coin2: 'Münze 2',
            icq: 'ICQ',
            qip: 'QIP',
            tinkle: 'Glitzer',
            trumpet: 'Trompete',
            vk: 'VK',
            custom: 'Eigene',
          },
          event: 'Ereignis',
          remove: 'Diese Benachrichtigung löschen',
          listen: 'Anhören',
          sound: 'Ton',
          soundFile: 'Audio-Datei',
          soundInfo: 'Achtung! Nicht alle Dateien werden von deinem Browser unterstützt.',
          desc: {
            messages: 'Telegramm erhalten:',
            reports: 'Bericht erhalten vom Typ:',
            townforum: 'Neuer Foren-Beitrag in:',
            friends: 'Freund(e) online:',
            wayFinished: 'Weg beendet:',
            noQueue: 'Keine weiteren Aufträge:',
            newItem: 'Neues Item im Inventar:',
            nickInChat: 'Name im Chat erwähnt:',
          },
          reportTypes: {
            all: 'Alle',
            work: 'Arbeiten',
            duels: 'Duelle',
            achvmnt: 'Erfolge',
            fort: 'Fortkämpfe',
            other: 'Sonstige',
          },
          add: 'Benachrichtigung hinzufügen',
          wayFinishedInfo: 'Wird ausgelöst, wenn du dein Ziel erreicht hast.',
          reportInfo: '<b>Achtung!</b> Diese Einstellung verursacht ein Problem mit der blinkenden Nachrichten-Schaltfläche am unteren Bildrand.<br>Die Option <i>Alle</i> behebt dieses Problem.',
          noQueueInfo: 'Wird ausgelöst, wenn du keine Arbeiten mehr in der Warteschlange hast.',
          messagesInfo: 'Wird ausgelöst, wenn du ein Telegramm erhälst.',
          friendListInfo: 'Trenne mehrere Freunde mit einem Semikolon (;)',
          townforumInfo: 'Wird ausgelöst, wenn jemand einen Beitrag im Stadtforum<span id="selectedForum"></span> verfasst.',
          newItemInfo: 'Wird ausgelöst wenn du ein neues Item findest oder kaufst.',
          nickInChatInfo: 'Wird ausgelöst wenn dein Name im Chat steht. Trenne weitere Nicks mit einem Semikolon (;)',
          install: 'Installieren',
          cancel: 'Abbrechen',
        };
        break;
      case ('pl'):
        TWN.lang = {
          translator: 'Darius II',
          notifications: 'Powiadomienia',
          confirmationTitle: 'Potwierdzenie',
          confirmation: 'Chcesz usunąć to powiadomienie?',
          types: {
            messages: 'Wiadomości',
            reports: 'Raporty',
            townforum: 'Forum',
            friends: 'Znajomi',
            wayFinished: 'Dotarcie do celu',
            noQueue: 'Brak zadań',
            newItem: 'New item',
            nickInChat: 'Nickname in chat',
          },
          sounds: {
            bum: 'Bum',
            chime: 'Kurant',
            coin: 'Kucie',
            coin2: 'Kucie 2',
            icq: 'ICQ',
            qip: 'QIP',
            tinkle: 'Dzwonek',
            trumpet: 'Trąbka',
            vk: 'VK',
            custom: 'Własny',
          },
          event: 'Zdarzenie',
          remove: 'Usuń zdarzenie',
          listen: 'Odsłuchaj',
          sound: 'Dźwięk',
          soundFile: 'Plik dźwięku',
          soundInfo: 'Uwaga! Nie wszystkie typy plików dźwiękowych mogą być odtwarzane w przeglądarce.',
          desc: {
            messages: 'Otrzymano wiadomość:',
            reports: 'Typ raportu:',
            townforum: 'Nowy wpis w:',
            friends: 'Pojawił się znajomy/a :',
            wayFinished: 'Ośiągnięto cel:',
            noQueue: 'Brak zadań:',
            newItem: 'New item in inventory:',
            nickInChat: 'Nickname typed in chat:',
          },
          reportTypes: {
            all: 'Wszystkie',
            work: 'Praca',
            duels: 'Pojedynki',
            achvmnt: 'Osiągnięcia',
            fort: 'Fortowe',
            other: 'Pozostałe',
          },
          add: 'Dodaj powiadomienie',
          wayFinishedInfo: 'Odtworzy dźwięk kiedy dotrzesz na wyznaczoną pozycję.',
          reportInfo: '<b>Uwaga!</b> Ten wybór powoduje problemy z migotaniem przycisku "wiadomości/raporty", wybrór <i>Wszystkie</i> rozwiąże ten problem.',
          noQueueInfo: 'Odtworzy dźwięk, kiedy zostaną wykonane wszystkie zadania.',
          messagesInfo: 'Odtworzy dźwięk, kiedy otrzymasz telegram.',
          friendListInfo: 'Oddziel znajomych średnikiem (;)',
          townforumInfo: 'Odtworzy dźwięk, kiedy ktoś napisze wiadomośc na forum w zakładce: <span id="selectedForum"></span>.',
          newItemInfo: 'Triggers when you find, buy or get a new item.',
          nickInChatInfo: 'Triggers when your name was typed in the chat. Seperate more nicks with a semicolon (;)',
          install: 'Zainstaluj',
          cancel: 'Anuluj',
        };
        break;
      case ('pt'):
        TWN.lang = {
          translator: 'jccwest',
          notifications: 'Notificações',
          confirmationTitle: 'confirmação',
          confirmation: 'Tem certeza que deseja remover esta notificação?',
          types: {
            messages: 'Mensagens',
            reports: 'Relatórios',
            townforum: 'Fórum da cidade',
            friends: 'Amigos',
            wayFinished: 'Chegou ao destino',
            noQueue: 'Sem trabalhos',
            newItem: 'Novo item no inventário',
            nickInChat: 'Nickname in chat',
          },
          sounds: {
            bum: 'Bum',
            chime: 'Chime',
            coin: 'Coin',
            coin2: 'Coin 2',
            icq: 'ICQ',
            qip: 'QIP',
            tinkle: 'Tinkle',
            trumpet: 'Trompete',
            vk: 'VK',
            custom: 'Custom',
          },
          event: 'Evento',
          info: 'Informação',
          remove: 'Remover esta notificação',
          listen: 'reproduzir o som',
          sound: 'Som',
          soundFile: 'arquivo de som',
          soundInfo: 'Aviso! Nem todos os arquivos podem ser reproduzidos no seu navegador.',
          desc: {
            messages: 'Telegrama recebido:',
            reports: 'Relatório recebeu do tipo:',
            townforum: 'Novo post no fórum:',
            friends: 'Amigo(s) on-line:',
            wayFinished: 'Chegou ao destino:',
            noQueue: 'Sem trabalhos:',
            newItem: 'Novo item no inventário:',
            nickInChat: 'Nickname typed in chat:',
          },
          reportTypes: {
            all: 'Todos',
            work: 'Trabalho',
            duels: 'Duelos',
            achvmnt: 'Conquistas',
            fort: 'Batalhas no forte',
            other: 'Outro',
          },
          add: 'Adicionar notificação',
          wayFinishedInfo: 'Avisa quando tiver terminado o meu caminho e a chegada ao destino.',
          reportInfo: '<b>Aviso!</b> Isto irá causar problemas com o botão piscando mensagens na tela inferior seleção <i>Todos</i> vai resolver estes problemas.',
          noQueueInfo: 'Avisa quando não há mais trabalhos atribuídos.',
          messagesInfo: 'Avisa quando recebe um telegrama.',
          friendListInfo: 'Separe vários amigos com um ponto e vírgula (;)',
          townforumInfo: 'Avisa quando alguém escreve um post no fórum <span id="selectedForum"></span>.',
          newItemInfo: 'Avisa quando encontra,ou compra um novo item.',
          nickInChatInfo: 'Triggers when your name was typed in the chat. Seperate more nicks with a semicolon (;)',
          install: 'Instalar',
          cancel: 'Cancelar',
        };
        break;
      case ('el'):
        TWN.lang = {
          translator: 'Timemod Herkumo',
          notifications: 'Ειδοποιήσεις',
          confirmationTitle: 'Επιβεβαίωση',
          confirmation: 'Είστε βέβαιοι ότι θέλετε να καταργήσετε αυτήν την ειδοποίηση;',
          types: {
            messages: 'Μυνήματα',
            reports: 'Αναφορές',
            townforum: 'Φόρουμ πόλης',
            friends: 'Φιλοι',
            wayFinished: 'Τέλος προορισμού',
            noQueue: 'Κενή ουρά εργασίας',
            newItem: 'Νέο αντικείμενο',
            nickInChat: 'Ψευδώνυμο στην συνομιλία',
          },
          sounds: {
            bum: 'Bum',
            chime: 'Κουδούνι',
            coin: 'Νόμισμα',
            coin2: 'Νόμισμα 2',
            icq: 'ICQ',
            qip: 'QIP',
            tinkle: 'Λάμψη',
            trumpet: 'Τρομπέτα',
            vk: 'VK',
            custom: 'Προσαρμοσμένο',
          },
          event: 'Εκδήλωση',
          info: 'Πληροφορίες',
          remove: 'Κατάργηση αυτής της ειδοποίησης',
          listen: 'Ακούστε αυτόν τον ήχο',
          sound: 'Ήχοι',
          soundFile: 'Αρχείο ήχου',
          soundInfo: '<b>Προειδοποίηση!</b><br>Δεν είναι δυνατή η αναπαραγωγή όλων των αρχείων στο πρόγραμμα περιήγησής σας.',
          desc: {
            messages: 'Λάβατε νέο τηλεγάφημα:',
            reports: 'Λάβατε νέα αναφορά:',
            townforum: 'Νέο θέμα στο Φόρουμ:',
            friends: 'Συνδεδεμένος φίλος:',
            wayFinished: 'Προορισμός:',
            noQueue: 'Κενή ουρά εργασίας:',
            newItem: 'Νέο αντικείμενο:',
            nickInChat: 'Ψευδόνυμο στο τσατ:',
          },
          reportTypes: {
            all: 'Όλα',
            work: 'Εργασίες',
            duels: 'Μονομαχίες',
            achvmnt: 'Επιτεύγματα',
            fort: 'Μάχες Οχυρού',
            other: 'Άλλο',
          },
          add: 'Προσθήκη ειδοποίησης',
          wayFinishedInfo: 'Ενεργοποιείται όταν φτάσετε στον προορισμό σας.',
          reportInfo: '<b>Προειδοποίηση!</b><br>Αυτό θα προκαλέσει προβλήματα με την αναλαμπή του κουμπιού μηνυμάτων στην κάτω μπάρα μενού.<br>Η επιλογή <i>"Όλα"</i> θα λύσει αυτά τα προβλήματα.',
          noQueueInfo: 'Ενεργοποιείται όταν δεν υπάρχουν εργασίες στην ουρά εργασίας.',
          messagesInfo: 'Ενεργοποιείται όταν λαμβάνετε ένα τηλεγράφημα.',
          friendListInfo: 'Ξεχωρίστε πολλούς φίλους με ένα ερωτηματικό (;)',
          townforumInfo: 'Ενεργοποιείται όταν κάποιος γράφει μια ανάρτηση στο φόρουμ .',
          newItemInfo: 'Ενεργοποιείται όταν βρίσκετε, αγοράζετε ή λαμβάνετε ένα νέο αντικείμενο.',
          nickInChatInfo: 'Ενεργοποιείται όταν αναφέρεται το όνομά σας στη συζήτηση. Seperate more nicks with a semicolon (;)',
          install: 'Εγκατάσταση',
          cancel: 'Ματαίωση',
        };
        break;
      } // Init all modules of TWNotifier

      TWN.initStyleSheet();
      TWN.settings.init();
      TWN.notifications.init();
    },
    roomsListening: [
    ],
    // init the global stylesheet
    initStyleSheet: function () {
      var css = $('<style id="TWNotifierStyles"></style>');
      $(document.head || document.body || document.documentElement).append(css);
    },
    // add global CSS information
    addStyle: function (css) {
      var styles = $('#TWNotifierStyles');
      styles.html(styles.html() + '\n' + css);
    },
    // returns a value from our storage
    get: function (key, val) {
      return (localStorage.getItem('TWNotifier_' + key) || val);
    },
    // sets a value pair in our storage
    set: function (key, val) {
      localStorage.setItem('TWNotifier_' + key, val);
    },
    // removes a key-value pair from our storage
    remove: function (key) {
      localStorage.removeItem('TWNotifier_' + key);
    },
    showMessage: function (text, icon) {
      new UserMessage(text, icon).show();
    },
    // append the specified function
    appendFunction: function (oldFn, newFn, _thisOld, _thisNew) {
      var fn = parent,
      i = 1; // start for finding the function to replace
      // every loop we get one step deeper/closer to our function to replace/append to
      while (fn[oldFn[i - 1]][oldFn[i]]) {
        fn = fn[oldFn[i - 1]];
        i++;
      }
      var tmpFn = fn[oldFn[i - 1]]; // avoid recursion
      fn[oldFn[i - 1]] = function () {
        newFn.apply(_thisNew, arguments); // and afterwards our new
        return tmpFn.apply(this, arguments); // call the old function;
      };
    }
  };
  TWN.images = {
    right_menu: 'data:image/png;base64,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',
    right_menu_hover: 'data:image/png;base64,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',
    sound: 'data:image/png;base64,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',
    remove: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAcCAYAAAB75n/uAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAMPSURBVHja7FVNaFxVFP7uzJ15781rMy6CUkNJ0ygi1W40i4BCgmKF0k1FxEXFpeDCZUEFKZKCLnSZlRuz8GfhQgISxa1SkbQF0xICFYUSDZ1kOjPv595z7j0uJplMJplxmupKP3jv3Xu/8853zjvn3qfeeu2ZK7Ozs7i+fMViF6rnec/YupuVZ2ZmRDvna8WihveSHWCn7nHeATsfFbUWbclt6FIAdr51CEd9BSy5uKgDaENuU5dDMLsGAOk1lPaa7E4HovNpjaWRUhAqneW0EYSx5Ja3dq3UwTVQf1MT2Q0kM2yDMBbdSkwtqowgy6nWE4zavisAqjJ57stuNru1+Mo+/yKdDNPMqiCMoY3lrFQOYcil3ZYA4LcjGj11fum9dy6CmAEAJa1xaQ5f3Fn56ky/ZFqpLUVxVXSjZZpRXFXNxDS6Izgx9eoP3S9cmvtgn5PRU+eXdsa//vTZdDfXaOVBFFehk9zmYTyCRivvZPDkzOtXP5p7e+iev7ayhk+BH5e/++T0zlozNUeiI1XoZsvklfgBbNbTPfugnjBq9TqMIVhrkVuD3BCsJWRZjjTLkKQp0iQFMQEANjaTjo+7zTyvxFWlDbHT5QCZYdct8P6HH+ONCy9h+edrIC9g50CWYcjCWIYlhvcekxMTWF1b2969KXWaICcuB7HS7UFlD7kwf3n8wpvv/vboIydRa1mcfvwkmhlj8Zvv8fz00/j9j02srt7E8bExhFGEX26sYGH+8nh3gN6LFHVJtLHsykGEZmL2ZEC2refYgYnA7OC9h3MM53bGDiICsoQ7Wwn3nhZh5Si0Jed1KUCSWd/NOubhKqzUQNtCP4LYDucfAA+w7SvAw2YAgOgQGTDRkO4VmOlfzEDhcDXwvl1zL+0DSUTgvUf7MBGI+E4NdmwPgu5HFAtt7WennoDxgC8QXnzhOdQbTURRhInJx+AdIwgCKKUGNsFTIgKl1HovOXv25du31/9EoaCgtv8SSqnOJSJ4+KEH8e3Xn48d4PuYiAwWuE8cE5H+Nfin8L/Af0DgrwEAWMmrNSQDjVcAAAAASUVORK5CYII=',
    listen: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAARCAYAAADdRIy+AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAATLSURBVHjabNTbb1MFAAbw75ye09Nz2q5dt17W7tbuonNuMBzb2Mhgg8GEcQk6zEIwBo2LBucLWaIhM2AkmvhiYiJoNAIPE0RRUCAaQHCwQdmVrcuQrbtQ1nbrveecrrfjAwmJke8P+D18+fIRhw/3wOl0guM4WK2FoGkasZgAgITX6yH6+vq6Ozo6vrdYzB6fz4f1ja3Q6TIQE/zs0VO+a6KsgP2iK2u1UkHBH0mBwjMilyuwvLyEeCI14PP5a7q7u38F4Cl/oRJvHXgXl/+4ApohxKWoqS7E5uOrC/6z77SRe8UVGcj/Y3J4PB46EAz1t7Zuq6mtrYNGo+HVKiWOn/gaNJVG7/VIZ/6LjYqe1/jn6PB93J3Xtf8+EGnjFNITUJKkp9ji4qI6EAzd6+jYV9e2/WVwnAICH5FtbG7BmtVFOPZt36E7gc3HT15V/11XXfZgY8FIj285gJH5jG+cjwSQgiDA51tGMBjE9PSMJZFIDnV2dlY2NzWCokgkk0kY9Nnxli1bMexwoWVt1qWKHJ9o/wfVJ2/q2zet4T5W8zfgiipMjvlUK5mbm3d+1+49A+vqG/qtVpujq+tgcW1NNQDA7fZi1jkdb25aHxF1Oz797GKWo6S4wNFWNr4rEVnEDQdOxekiFKrnTnu9IgIC207t3fvqbovFDEkCvF4vGEaOyckpLPv8CIcjCIWCKU1GqeSPKWseBjVl311PflhvUx7T2e3BgLBT65eKzAWGv0475pz7l4WyanJmxhmcevAQExMOjI6Ooe/WABYWXKAoCrkWMzgugx0cHIo+zw68kq92YWiWOvI4ooNe4b0YiaTgiXL16XRyisUSxCSRR+Xl50kmkwnxlRWwrAIGgwFKJQeSfDIAiyUHt2/3KxemRwMaIguhiJ4SUypwTHp6RQyDj2mzpDQhyLCCNMBR7sXHRDqVhCAIEEUBRqPhKQYAIAhUlBfx2ZbSDK+dgM7Ap7RsDHwsbY2nJSiZRCBGSlxCokASEKne3jNavcGIWCyGJa8XllwzamtqYLNZoVar4Vtyi+XlpaqpcMXPc34SLQ3po2ZNGI+DzE5ltgzZXPjWEmRl4YQKNJGcp0w55ps0Lc9RKBSSXC4vCYXCRG/vDygtLUVJSQn8gZAs4A8SL2VKIzZ9IP/t7dlHf/xpsXkhasusKk7EjfJHrsvuxCcpWTa0dGCQioZDG2acM2AYBiZTTvmqVZVXQ+GIcWR4ELNzc0hJhPy3S3+q69ZdPvTRvqZD4+NTpWf7dRdYrRUbKuVvMCkXHrjVr5uKNNAro+dIgiRB03IwjALJZHJi0jFepVJyszt27IZOlwU+GkWUF5kz585iXVUhrt1x7RqZVysbKhQjb26Rei/emPvAR6whCrMEb1UJc4l80jsBAKAoGViWWxwbHa5yuRYcTU2bUFBohUqlTA0P2XHn3gQOH9z2+XrL8HsHNjMNd+1DtivjpmNGcz6qbGJnnon77zlIkgSCIJCpzQy6Hs1Xj40NT8bjcUSjPBuLxfF+VxdSybS0f6vpS7fzltB9Ymk6pVqL+uLQ+Z2Nhl/4mPTs+0pLEjQajSgKfLWMJI709PREDAY9eF7A5NRD1NQ3gI8GOaP2vl1Hu9iu9rI9apZFPL6CfwcAFv8pW2JrAdUAAAAASUVORK5CYII=',
    add: 'data:image/png;base64,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',
    info: 'data:image/png;base64,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',
  };
  TWN.sounds = [
    'bum', 'chime', 'coin', 'coin2', 'icq', 'qip', 'tinkle', 'trumpet', 'vk',
  ];
  TWN.notifications = {
    list: {
      length: 0
    },
    init: function () {
      // Load notifications
      this.list.length = TWN.get('notificationCount', 0);
      for (var i = 0; i < this.list.length; i++) {
        var data = TWN.get('notification_' + i, '');
        if (data == '') {
          this.remove(i);
          i = 0;
          continue;
        }
        data = JSON.parse(data);
        this.list[i] = data;
      }
      // append TW-functions with TWNotifier-functionality
      // friend online
      TWN.appendFunction([
          'west', 'notification', 'ToastOnlineNotification', 'prototype', 'init'
        ], function (name) {
        var sound = '';
        for (var i = 0; i < this.list.length; i++) {
          if (this.list[i].event == 'friends') {
            if (this.list[i].info == '*')
              sound = this.list[i].sound;
            else if (this.list[i].info.split(';').includes(name)) {
              sound = this.list[i].sound;
              break;
            }
          }
        }
        TWN.notifications.playSound(sound);
      }, west.notification.ToastOnlineNotification.prototype._super.prototype, this);
      // new report
      TWN.appendFunction(['Character', 'setToRead'], function (type, status) {
        if (status == false)
          return;
        // TOWNFORUM
        if (type == 'townforum') {
          var notifications = {
            length: 0
          };
          var custom = 0; // 0 = no notification,   1 = only all;   2 = custom notification
          for (var notification in TWN.notifications.list) {
            if (TWN.notifications.list[notification].event == 'townforum') {
              notifications[notifications.length] = TWN.notifications.list[notification].info;
              notifications.length++;
              if (TWN.notifications.list[notification].info == '*' && custom == 0)
                custom = 1;
              else
                custom = 2;
            }
          } // No notifications for forum

          if (custom == 0 || notifications.length == 0)
            return;
          // no custom notifications
          if (custom == 1) {
            TWN.notifications.playSound(TWN.notifications.list[TWN.notifications.getIndex('townforum', '*')].sound);
            return;
          } // custom notifications

          $.ajax('forum.php', {
            complete: function (data) {
              var DOM = $.parseHTML(data.responseText);
              var forumList = $('#forum_list', DOM);
              forumList.children().each(function (i, el) {
                if ($(el).hasClass('background')) {
                  var index = TWN.notifications.getIndex('townforum', $(el).find('span').text());
                  if (index != -1) {
                    TWN.notifications.playSound(TWN.notifications.list[index].sound);
                    return false;
                  }
                }
              });
            }
          });
          return;
        }
        // MESSAGES
        if (type == 'messages') {
          var index = TWN.notifications.getIndex('messages');
          if (index != -1)
            TWN.notifications.playSound(TWN.notifications.list[index].sound);
          return;
        }
        // REPORTS
        if (type == 'reports') {
          // If no report types are specified, just play the sound for 'all reports', if specified (no requests)
          var allSound = 'data:audio/ogg;base64,;';
          for (var noti in TWN.notifications.list) {
            if (TWN.notifications.list[noti].event == 'reports') {
              if (TWN.notifications.list[noti].info != 'all') {
                allSound = '';
                break;
              } else
                allSound = TWN.notifications.list[noti].sound;
            }
          }
          if (allSound != '') {
            TWN.notifications.playSound(allSound);
            return;
          }
          // Send requests to check if there are new reports for the specified report types
          Ajax.remoteCall('reports', 'get_reports', {
            page: 0,
            folder: 'all'
          }, function (json) {
            if (json.error != false || !json.reports[0])
              return;
            var report_id = json.reports[0].report_id; // latest report
            // create counter
            var sounds = {},
            counter = (TWN.notifications.getIndex('reports', 'all') == -1 ? -6 : 0);
            for (type in TWN.lang.reportTypes) {
              var index = TWN.notifications.getIndex('reports', type);
              if (index != -1) {
                sounds[type] = TWN.notifications.list[index].sound;
                counter++;
              } else
                sounds[type] = '';
            }
            var gen = function (type, report) {
              return function (json) {
                if (json.error != false || !json.reports[0] || sounds[type] == '')
                  return;
                if (json.reports[0].report_id == report) {
                  counter = 0;
                  TWN.notifications.playSound(sounds[type]);
                } else {
                  counter--;
                  if (counter == 0)
                    TWN.notifications.playSound(sounds.all);
                }
              };
            };
            for (type in sounds)
              Ajax.remoteCall('reports', 'get_reports', {
                page: 0,
                folder: type
              }, gen(type, report_id));
          });
          return;
        }
      }, Character, this);
      // way finished
      TWN.appendFunction(['OnGoingWayFinishedEntry'], function () {
        for (var i = 0; i < this.list.length; i++) {
          if (this.list[i].event == 'wayFinished') {
            this.playSound(this.list[i].sound);
            break;
          }
        }
      }, OnGoingEntry, TWN.notifications);
      OnGoingWayFinishedEntry.prototype = new OnGoingEntry;
      // empty job queue
      EventHandler.listen('taskqueue-updated', function () {
        if (TaskQueueUi.isEmpty) {
          var index = TWN.notifications.getIndex('noQueue');
          if (index != -1)
            TWN.notifications.playSound(TWN.notifications.list[index].sound);
        }
      });
      // new item in inventory
      TWN.appendFunction(['WestUi',
          'showInventoryChanged'], function (type, item_id, count) {
        if (type == 'add') {
          var index = TWN.notifications.getIndex('newItem');
          if (index != -1)
            TWN.notifications.playSound(TWN.notifications.list[index].sound);
        }
      }, WestUi);
      // nickname in chat
      TWN.addListeners = function () {
        var roomChanged = function (room, type, data) {
          var index = TWN.notifications.getIndex('nickInChat');
          if (index != -1 && type == 'NewMessage') {
            var div = $(data[0]);
            var cText = div.find('.chat_text').html().toLowerCase();
            var nli = TWN.notifications.list[index];
            var nList = [Character.name];
            if (nli.info != '*')
              nList.push(...nli.info.split(';'));
            for (var n of nList)
              if (cText.includes(n.toLowerCase())) {
                TWN.notifications.playSound(nli.sound);
                break;
              }
          }
        };
        var rooms = Chat.Resource.Manager.getRooms();
        for (var r in rooms) {
          var room = Chat.Resource.Manager.getRoom(r);
          if (TWN.roomsListening.indexOf(room.id) == -1) {
            TWN.roomsListening.push(room.id);
            room.addListener(roomChanged);
          }
        }
      };
      if (EventHandler.hasOwnProperty('add')) {
        EventHandler.add('chat_room_added', function (room) {
          TWN.addListeners();
        });
      } else {
        EventHandler.listen('chat_room_added', function (room) {
          TWN.addListeners();
        });
      }
    },
    // Add notification
    add: function (event, info, sound) {
      TWN.set('notification_' + this.list.length, JSON.stringify({
          event: event,
          info: info,
          sound: sound
        }));
      this.list[this.list.length++] = {
        event: event,
        info: info,
        sound: sound
      };
      TWN.set('notificationCount', this.list.length);
    },
    // Remove specified notification
    remove: function (id) {
      for (var i = id; i < this.list.length; i++) {
        TWN.set('notification_' + i, TWN.get('notification_' + (i + 1), ''));
        this.list[i] = this.list[i + 1];
      }
      TWN.remove('notification_' + (--this.list.length));
      this.list[this.list.length] = {};
      TWN.set('notificationCount', this.list.length);
    },
    getIndex: function (event, info) {
      for (var i = 0; i < this.list.length; i++)
        if (this.list[i].event == event && (this.list[i].info == info || info == undefined))
          return i;
      return -1;
    },
    // Play the specified sound
    playSound: function (src) {
      if (src && $('#ui-loader').css('display') == 'none') {
        var audio = TWN.sounds.includes(src) ? 'https://tomrobert.safe-ws.de/' + src + '.mp3' : src;
        new Audio(audio).play();
      }
    }
  };
  TWN.settings = {
    gui: {
      window: {},
      comboboxes: {}
    },
    table: null,
    townforumTopics: {
      length: 0
    },
    init: function () {
      var rightBar = $('.ui_menucontainer');
      var optionEl = $('<div id="TWNotifierSettingsBtn" onclick="TWN.settings.open ();" title="' + TWN.name + '"></div>');
      if (rightBar && rightBar[1]) {
        rightBar = $(rightBar[1]);
        rightBar.css('max-height', (rightBar.children('div').length * 30 - 2) + 'px');
        rightBar.append(optionEl);
      }
      TWN.addStyle('#TWNotifierSettingsBtn { width:32px; height:41px; margin:-8px -16px 0 -7px; cursor:pointer; background:url(' + TWN.images.right_menu + '); }' +
        '#TWNotifierSettingsBtn:hover { background:url(' + TWN.images.right_menu_hover + '); }' +
        '.TWNotifier-event-col { min-width:175px; font-weight:bold; }' +
        '.TWNotifier-sound-col, .TWNotifier-remove-col { float:right; }' +
        '.TWNotifier-sound-col { margin-right:-2px; }' +
        '.TWNotifier-sound-col img, .TWNotifier-remove-col img { margin-top:-3px; cursor:pointer; }' +
        '.tbody .TWNotifier-event-col, .tbody .TWNotifier-info-col { margin-left:4px; }' +
        '.TWNotifierButton { background:rgba(29,28,28,0.5); border:1px solid #646464; border-radius:2px; box-shadow:0 0 1px 1px #000; display:inline-block; margin-left:8px; padding:1px 2px; }' +
        '.TWNotifierSettings #TWNotifierSettings { padding:4px 0 0 4px; border-top:1px solid rgba(0,0,0,0.77); margin:2px -2px; }' +
        '.TWNotifierSettings #reportWarning { margin:5px 5px 0 0; padding:5px 5px; display:none; border:1px solid #C33; }' +
        '.TWNotifierSettings .tfoot { padding:0 !important; height:6px; }' +
        '.TWNotifierSettings #settingInfo { margin:5px 5px 0 0; padding:5px 5px; text-align:center; border:1px solid #000; background:rgba(0,0,0,0.32); }' +
        '.TWNotifierSettings #settingInfo img { margin:0 16px; vertical-align:middle; }' +
        '.TWNotifierSettings #selectedForum { font-style:italic; }');
    },
    open: function () {
      this.gui.window = wman.open('TWNotifierSettings', TWN.name, 'noreload').setMiniTitle(TWN.name);
      TWN.settings.gui.window.showLoader();
      // Create table
      this.table = new west.gui.Table(false);
      this.table.addColumn('TWNotifier-event-col').addColumn('TWNotifier-info-col').addColumn('TWNotifier-remove-col').addColumn('TWNotifier-sound-col');
      this.table.appendToCell('head', 'TWNotifier-event-col', TWN.lang.event).appendToCell('head', 'TWNotifier-info-col', TWN.lang.info).appendToCell('head', 'TWNotifier-remove-col', '&nbsp;').appendToCell('head', 'TWNotifier-sound-col', '&nbsp;');
      this.table.setScrollbar();
      // Fill table
      TWN.settings.refreshTable();
      TWN.settings.gui.window.appendToContentPane(this.table.getMainDiv());
      // Create settings
      var settings = $('<div id="TWNotifierSettings"></div>');
      var dropdown = new west.gui.Combobox('TWNotifierNotificationType').setWidth(130).addListener(function () {
          TWN.settings.changeSettings(dropdown.getValue());
        });
      for (var type in TWN.lang.types)
        dropdown.addItem(type, TWN.lang.types[type]);
      // TODO: Correct width (depending on other elements)
      var soundName = new west.gui.Textfield('TWNotifierSoundName').setWidth(165).setPlaceholder('https://             .mp3');
      var soundBox = new west.gui.Combobox('TWNotifierSoundBox').setWidth(130);
      for (var sound of TWN.sounds)
        soundBox.addItem(sound, TWN.lang.sounds[sound]);
      soundBox.addItem('custom', TWN.lang.sounds.custom).addListener(function () {
        if (soundBox.getValue() == 'custom')
          soundName.getMainDiv().css('display', 'inline-block');
        else
          soundName.getMainDiv().css('display', 'none');
      });
      var testSound = $('<div class="TWNotifierButton" title="' + TWN.lang.listen + '"><img src="' + TWN.images.listen + '" style="cursor:pointer;"></div>').click(function () {
          if (soundBox.getValue() != 'custom')
            TWN.notifications.playSound(soundBox.getValue());
          else
            TWN.notifications.playSound(soundName.getValue());
        });
      var addButton = $('<div class="TWNotifierButton" title="' + TWN.lang.add + '"><img src="' + TWN.images.add + '" style="cursor:pointer;"></div>').click(function () {
          var event = dropdown.getValue();
          var info = TWN.settings.getInfo(event);
          var sound = soundBox.getValue();
          if (sound == 'custom')
            sound = soundName.getValue();
          TWN.notifications.add(event, info, sound);
          TWN.settings.refreshTable();
        });
      TWN.settings.gui.window.appendToContentPane($('<span>' + TWN.lang.event + ': </span>')).appendToContentPane(dropdown.getMainDiv()).appendToContentPane($('<span style="margin-left:8px;">' + TWN.lang.sound + ': </span>'));
      TWN.settings.gui.window.appendToContentPane(soundBox.getMainDiv()).appendToContentPane(soundName.getMainDiv().css({
          'display': 'none',
          'margin-top': '1px'
        })).appendToContentPane(testSound).appendToContentPane(addButton).appendToContentPane(settings);
      TWN.settings.changeSettings();
      TWN.settings.gui.window.hideLoader();
    },
    removeConfirmation: function (id) {
      var dialog = new west.gui.Dialog(TWN.lang.confirmationTitle, TWN.lang.confirmation);
      dialog.addButton('yes', function () {
        TWN.notifications.remove(id);
        $('.TWNotifierSettings .row_' + id).remove();
        TWN.settings.refreshTable();
      }).addButton('no', function () {
        dialog.hide();
      }).show();
    },
    refreshTable: function () {
      this.table.clearBody();
      for (var i = 0; i < TWN.notifications.list.length; i++) {
        var inl = TWN.notifications.list[i];
        var sound = inl.sound;
        this.table.appendRow(null, '');
        this.table.appendToCell(-1, 'TWNotifier-event-col', TWN.lang.desc[inl.event] || inl.event);
        this.table.appendToCell(-1, 'TWNotifier-info-col', TWN.settings.getDescription(inl));
        this.table.appendToCell(-1, 'TWNotifier-remove-col', $('<img src="' + TWN.images.remove + '" onclick="TWN.settings.removeConfirmation (' + i + ');" title="' + TWN.lang.remove + '">'));
        this.table.appendToCell(-1, 'TWNotifier-sound-col', $('<img src="' + TWN.images.sound + '" onclick="TWN.notifications.playSound(\'' + sound + '\');" title="' + TWN.lang.listen + '">'));
      }
    },
    changeSettings: function (val) {
      var settings = $('#TWNotifierSettings').html('');
      switch (val) {
      case ('friends'):
        settings.append($('<label for="friendsName" style="cursor:pointer;">' + TWN.lang.types.friends + ':</label>'), new west.gui.Textfield('friendsName').getMainDiv(), this.infoBox(val));
        break;
      case ('wayFinished'):
        settings.append(this.infoBox(val));
        break;
      case ('noQueue'):
        settings.append(this.infoBox(val));
        break;
      case ('townforum'):
        var dropdown = new west.gui.Combobox('TWNotifierTownforumTopic');
        $.ajax('forum.php', {
          complete: function (data) {
            var DOM = $.parseHTML(data.responseText);
            $('#forum_list', DOM).children('div').each(function (i, el) {
              if ($(el).find('span').text() == '')
                return;
              TWN.settings.townforumTopics[TWN.settings.townforumTopics.length] = $(el).find('span').text();
              TWN.settings.townforumTopics.length++;
            });
            dropdown.addListener(function () {
              $('#selectedForum').html((dropdown.getValue() != '*' ? ' ' + dropdown.getValue() : ''));
            });
            dropdown.addItem('*', TWN.lang.reportTypes.all);
            for (var i = 0; i < TWN.settings.townforumTopics.length; i++)
              dropdown.addItem(TWN.settings.townforumTopics[i], TWN.settings.townforumTopics[i]);
            TWN.settings.gui.comboboxes.townforumTopics = dropdown;
            settings.append($('<span>' + TWN.lang.types.townforum + ': </span>'), dropdown.getMainDiv(), TWN.settings.infoBox(val));
          }
        });
        break;
      case ('reports'):
        var dropdown = new west.gui.Combobox('TWNotifierReportType');
        var types = [
          'all',
          'work',
          'duels',
          'achvmnt',
          'fort',
          'other'
        ];
        for (var i = 0; i < types.length; i++)
          dropdown.addItem(types[i], TWN.lang.reportTypes[types[i]]);
        dropdown.addListener(function (selected) {
          if (selected != 'all')
            $('#reportWarning').css('display', 'block');
          else
            $('#reportWarning').css('display', 'none');
        });
        settings.append($('<span>' + TWN.lang.types.reports + ': </span>'), dropdown.getMainDiv(), $('<div id="reportWarning">' + TWN.lang.reportInfo + '</div>'));
        TWN.settings.gui.comboboxes.reportTypes = dropdown;
        break;
      case ('newItem'):
        settings.append(this.infoBox(val));
        break;
      case ('nickInChat'):
        settings.append($('<label for="TWNnicks" style="cursor:pointer;">' + TWN.lang.types.nickInChat + ':</label>'), new west.gui.Textfield('TWNnicks').getMainDiv(), this.infoBox(val));
        break;
        //case ('messages'):
      default:
        settings.append(this.infoBox('messages'));
        break;
      }
    },
    infoBox: function (text) {
      return $('<div id="settingInfo"><img src="' + TWN.images.info + '"> ' + TWN.lang[text + 'Info'] + ' <img src="' + TWN.images.info + '"></div>');
    },
    getInfo: function (i) {
      switch (i) {
      case ('reports'):
        return TWN.settings.gui.comboboxes.reportTypes.getValue() || 'all';
      case ('townforum'):
        return TWN.settings.gui.comboboxes.townforumTopics.getValue() || '*';
      case ('friends'):
        var fTF = $('#friendsName').val();
        return fTF ? fTF.replace(/;\s+/g, ';').replace(/;$/g, '') : '*';
      case ('nickInChat'):
        var nTF = $('#TWNnicks').val();
        return nTF ? nTF.replace(/;\s+/g, ';').replace(/;$/g, '') : '*';
      default:
        return '';
      }
    },
    getDescription: function (e) {
      var info = e.info;
      switch (e.event) {
      case ('reports'):
        return TWN.lang.reportTypes[info] || info;
      case ('townforum'):
        if (info == '*')
          return TWN.lang.reportTypes.all;
        return info;
      case ('friends'):
        if (info == '*')
          return TWN.lang.reportTypes.all;
        var res = '';
        info = info.split(';');
        for (var i = 0; i < info.length; i++) {
          if (i != 0 && info[i] != '')
            res += ', ';
          res += '<a href="javascript:PlayerProfileWindow.open (encodeURIComponent (\'' + info[i].replace(/'/g, '\\\'') + '\') );">' + info[i] + '</a>';
        }
        return res;
      case ('nickInChat'):
        var res = Character.name;
        if (info == '*')
          return res;
        info = info.split(';');
        for (var nick of info)
          res += ', ' + nick;
        return res;
      default:
        return TWN.lang[e.event + 'Info'];
      }
    },
  };
  TWN.init();
});
