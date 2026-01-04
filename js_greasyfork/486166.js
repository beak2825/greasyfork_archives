// ==UserScript==
// @name         Klanowicze online
// @author       Reskiezis
// @description  Dodatek do gry Margonem
// @version      2.0.2
// @match        *://*.margonem.pl/
// @match        *://*.margonem.com/
// @run-at       document-idle
// @grant        none
// @namespace    https://greasyfork.org/users/233329
// @downloadURL https://update.greasyfork.org/scripts/486166/Klanowicze%20online.user.js
// @updateURL https://update.greasyfork.org/scripts/486166/Klanowicze%20online.meta.js
// ==/UserScript==

/*
  - - -
  KLANOWICZE ONLINE
  AUTORSTWA RESKIEZISA aka PERSKIEGO KOTA
  WERSJA DLA NOWEGO I STAREGO INTERFEJSU
  - - -

  - - - - - - -
  GARMORY ZNOWU POPSULO DODATEK?
  POPROS SWOJEGO DODATKOPISARZA O NAPRAWE!

  Garmory czesto cos zmienia, ale dzieki temu mozna przewidziec co sie zepsulo.
  1. Najczestszy problem - zmiana struktury listy krotek (zlaczonych tablic zawierajacych id gracza, imie itd...)
     PATRZ linia 105
  2. Nowa automatycznie wykonywana funkcja po wywolaniu _g('clan&a=members') lub zmiana w nazewnictwie funkcji/elementow UI, ktore sa wykorzystywane do ominiecia automatycznego wywolania tej funkcji
     PATRZ metody ApplicationSI.prototype.fetchMembers lub ApplicationNI.prototype.fetchMembers
  3. Zmiana nazwy wlasciwosci w obiekcie zwracanym przez _g('clan&a=members').
     (kiedys wlasciwosc members nazywala sie members2)

  Otworzenie konsoli w Chrome - CTRL+SHIFT+J
*/

;(function(){
  'use strict';

  // czy gracz gra na Nowym Interfejsie?
  var isNewInterface = typeof window.Engine !== 'undefined' && typeof window.Engine.hero !== 'undefined'

  /*
    \/ \/ \/
    SEKCJA UI START
    Wyjatek: metody renderMembers i setBattleInfo sa wykorzystywane z poziomu klasy Application
  */
  var STORAGE_KEY = 'klanowicze_online'

  // Enum - przyjmuje jedna z dwoch wartosci
  // SizeEnum.NORMAL albo SizeEnum.COMPRESSED
  var SizeEnum = {
    NORMAL: 0,
    COMPRESSED: 1
  }

  function Popup(events){
    /*
      Metody z klasy Application obslugujace zdarzenia.
      events: {
        startFetchingInIntervals(),
        stopFetchingInIntervals(),
        addToGroup(),
        sendMessageTo()
      }
    */
    this.events = events

    // stan UI komponentu
    this.state = {
      hidden: false,
      top: 10,
      left: 10,
      size: SizeEnum.NORMAL
    }

    // zaladuj poprzedni stan UI komponentu z dysku, o ile istnieje
    this.loadStateFromDisk()

    // elementy HTML
    this.kobox = null
    this.title = null
    this.expandButton = null
    this.membersTable = null
    this.hideButton = null

    // stworz strukture, przypisz elementy html do obiektu i nasluchuj zdarzenia
    this.build()

    // upewnij sie, ze okienko jest widoczne w przegladarce
    this.noOverflow()

    // dopasuj wyglad w zaleznosci od this.state.size
    this.implementStateSize()
  }

  Popup.prototype.renderMembers = function(members){
    this.title.removeAttribute('data-battleinfo')

    var tbody = document.createElement('tbody')

    var includesHero = false
    var count = 0
    var MEMBERS_TUPLE_LENGTH = 10

    /*
      tablica members to ciag zlaczonych tablic (krotek) typu:
      [ id, nick, lvl, prof, map, x, y, ?, loggedTimeAgo, icon ]
      rozmar jednej takiej tablicy przechowywany jest w stalej MEMBERS_TUPLE_LENGTH

      > > > UWAGA! < < <
      PRAWDOPODOBNIE COS SIE KIEDYS ZMIENI W STRUKTURZE TEJ TABLICY
      PRZY TESTOWANIU WARTO JA WYPISAC Z console.log(members)

      Zmiany w przeszlosci:
      - dodano 10 element, czyli sciezke do wygladu postaci (icon)
      - loggedTimeAgo (9 element) przechowywal wartosc 'online' gdy gracz byl zalogowany
    */

    for(var j = 0; j <= members.length; j += MEMBERS_TUPLE_LENGTH){
      // jezeli dany gracz jest zalogowany to loggedTimeAgo (dziewiaty element krotki) jest rowny zero
      if(members[j+8] !== 0)
        continue

      count++

      // nie pokazuj wlasnej postaci na liscie zalogowanych klanowiczow
      var nick = members[j+1]
      if(isNewInterface ? nick === window.Engine.hero.d.nick : nick === hero.nick){
        includesHero = true
        continue
      }

      var id = members[j]
      var lvl = members[j+2]
      var prof = members[j+3]
      var map = members[j+4]
      var x = members[j+5]
      var y = members[j+6]

      var row = tbody.insertRow()
      row.classList.add('ko-row')

      var addToGroupCell = row.insertCell()
      addToGroupCell.textContent = '+'
      if(isNewInterface) addToGroupCell.dataset.tip = 'Dodaj do grupy'
      else addToGroupCell.setAttribute('tip', 'Dodaj do grupy')
      addToGroupCell.classList.add('ko-add-to-group-cell')
      addToGroupCell.addEventListener('click', this.events.addToGroup.bind(this, id))

      var nickCell = row.insertCell()
      nickCell.textContent = `${nick} (${lvl}${prof})`
      nickCell.classList.add('ko-nick-cell')
      nickCell.addEventListener('click', this.events.sendMessageTo.bind(this, nick))

      var locationTip = `${map} (${x},${y})`
      if(this.state.size == SizeEnum.COMPRESSED){
        if(isNewInterface) nickCell.dataset.tip = locationTip
        else  nickCell.setAttribute('tip', locationTip)
      } else {
        var mapCell = row.insertCell()
        mapCell.textContent = map
        mapCell.classList.add('ko-map-cell')
        if(isNewInterface) mapCell.dataset.tip = locationTip
        else mapCell.setAttribute('tip', locationTip)
      }
    }

    if(!includesHero)
      count++

    if(this.state.size == SizeEnum.COMPRESSED)
      this.title.textContent = `Online: ${count}`
    else
      this.title.textContent = `Klanowicze online: ${count}`

    var titleTipText = count === 1
      ? 'Jesteś tylko ty'
      : `${count} klanowiczów (łącznie z tobą)`

    if(isNewInterface) this.title.dataset.tip = titleTipText
    else this.title.setAttribute('tip', titleTipText)

    if(this.membersTable.tBodies.length === 0){
      this.membersTable.appendChild(tbody)
      return
    }

    this.membersTable.replaceChild(tbody, this.membersTable.tBodies[0])
  }

  Popup.prototype.setBattleInfo = function(){
    this.title.textContent = this.state.size === SizeEnum.COMPRESSED
      ? 'Walka'
      : 'Gracz uczestniczy w walce'

    if(isNewInterface) this.title.dataset.tip = 'Dodatek aktywuje się po zakończeniu walki'
    else this.title.setAttribute('tip', 'Dodatek aktywuje się po zakończeniu walki')

    this.title.setAttribute('data-battleinfo', '1')
  }

  Popup.prototype.handleHideButtonClick = function(){
    var newHidden = !this.state.hidden
    this.state.hidden = newHidden
    this.membersTable.hidden = this.state.hidden
    this.saveStateToDisk()
    if(this.state.hidden){
      this.hideButton.textContent = 'Rozwiń'
      this.events.stopFetchingInIntervals()
    } else {
      this.hideButton.textContent = 'Zwiń'
      this.events.startFetchingInIntervals()
    }
  }

  Popup.prototype.implementStateSize = function(){
    // aktualizacja klasy
    if(this.state.size === SizeEnum.COMPRESSED){
      this.kobox.classList.add('compressed')
    } else {
      this.kobox.classList.remove('compressed')
    }

    // aktualizacja tekstu
    if(this.title.getAttribute('data-battleinfo')){
      // wyswietlono wczesniej informacje o walce, nie zmieniaj
      this.setBattleInfo()
    } else {
      var lastOnline = this.title.textContent.split(': ')[1]
      if(lastOnline === undefined)
        lastOnline = '-'

      if(this.state.size === SizeEnum.COMPRESSED){
        this.title.textContent = `Online: ${lastOnline}`
      } else {
        this.title.textContent = `Klanowicze online: ${lastOnline}`
      }
    }
  }

  Popup.prototype.handleExpandButtonClick = function(){
    var nextSize = (this.state.size + 1) % 2
    this.state.size = nextSize
    this.saveStateToDisk()
    this.implementStateSize()
  }

  Popup.prototype.loadStateFromDisk = function(){
    try {
      var state = JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      )

      if(state.areMembersHidden !== undefined || state.wasMembersHidden !== undefined)
        throw 'Stary sposób zapisu'

      if(state.hidden !== undefined && state.top !== undefined && state.left !== undefined && state.size !== undefined)
        this.state = state
    } catch(error) {
      console.log('Klanowicze online: błędna konfiguracja, reset. Powód:', error)
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  Popup.prototype.saveStateToDisk = function(){
    // funkcja w setTimeout tworzy nowy this
    var self = this

    // nie zatrzymuj petli zdarzen
    setTimeout(function(){
      localStorage.setItem(STORAGE_KEY, JSON.stringify(self.state))
    }, 0)
  }

  // ogranicz pozycje okna do widzialnej czesci ekranu
  Popup.prototype.noOverflow = function(){
    var { top, left, width } = this.kobox.getBoundingClientRect()

    var oneThird = Math.ceil(1/3*width)

    if(top < 0)
      this.kobox.style.top = `0px`
    else if(top > window.innerHeight - 18)
      this.kobox.style.top = `${window.innerHeight - 18}px`

    if(left < 0 - oneThird*2)
      this.kobox.style.left = `${0 - oneThird*2}px`
    else if(left > window.innerWidth - oneThird)
      this.kobox.style.left = `${window.innerWidth - oneThird}px`

    // zapisz zmiany
    if(this.state.top !== top || this.state.left !== left){
      this.state.top = top
      this.state.left = left
      this.saveStateToDisk()
    }
  }

  Popup.prototype.build = function(){
    // struktura HTML
    $(document.body).append(`
      <div id="kobox">
        <div class="header">
          <span ctip="t_npc"></span>
          <img class="expand" tip="Zmień wielkość" ctip="t_npc" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTE5IDEyaC0ydjNoLTN2Mmg1di01ek03IDloM1Y3SDV2NWgyVjl6bTE0LTZIM2MtMS4xIDAtMiAuOS0yIDJ2MTRjMCAxLjEuOSAyIDIgMmgxOGMxLjEgMCAyLS45IDItMlY1YzAtMS4xLS45LTItMi0yem0wIDE2SDNWNWgxOFYxOXoiLz48L3N2Zz4=">
        </div>
        <table></table>
        <div class="hide">Zwiń</div>
        <div class="corner1"></div>
        <div class="corner2"></div>
      </div>
    `);

    // przypisz elementy do obiektu
    this.kobox = document.querySelector('#kobox')
    this.title = this.kobox.querySelector('.header span')
    this.expandButton = this.kobox.querySelector('.header img')
    this.membersTable = this.kobox.querySelector('table')
    this.hideButton = this.kobox.querySelector('.hide')

    // zaktualizuj wyglad
    this.kobox.style.left = `${this.state.left}px`
    this.kobox.style.top = `${this.state.top}px`
    this.hideButton.textContent = this.state.hidden
      ? 'Rozwiń'
      : 'Zwiń'
    this.membersTable.hidden = this.state.hidden

    if(isNewInterface) this.expandButton.dataset.tip = "Zmień wielkość"
    else this.expandButton.setAttribute('tip', 'Zmień wielkość')

    // obsluz zdarzenia
    this.hideButton.addEventListener('click', this.handleHideButtonClick.bind(this))
    this.expandButton.addEventListener('click', this.handleExpandButtonClick.bind(this))

    var self = this
    // przeciaganie okienka
    $(this.kobox).draggable({
      cancel: 'table, .hide, .expand',
      start: function(){
        if(!isNewInterface) g.lock.add('ko')
      },
      stop: function(){
        if(!isNewInterface) g.lock.remove('ko')
        self.noOverflow()
      }
    })

    // style
    var stylesheet = document.createElement('style')
    stylesheet.appendChild(document.createTextNode(`
      #kobox {
        font-family: Helvetica;
        box-sizing: border-box;
        position: absolute !important;
        border: 2px #800080 solid;
        border-radius: 10px;
        color: #eeeeee;
        background: rgb(1 1 1 / 70%);
        z-index: 500;
        font-size: 14px;
        width: 12em;
      }

      #kobox.compressed {
        width: 8em;
      }

      @media (min-width: 1500px) {
        #kobox {
          font-size: 16px;
        }
      }

      @media (min-width: 1700px) {
        #kobox {
          font-size: 17px;
          width: 16em;
        }
        #kobox.compressed {
          width: 10em;
        }
      }

      #kobox > .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 3px;
        font-size: 1em;
        text-align: center;
        font-weight: bold;
        border-bottom: 1px solid #800080;
        z-index: 1;
      }

      #kobox > .header {
        cursor: move;
        cursor: -webkit-grab;
        cursor:    -moz-grab;
        cursor:         grab;
      }
      #kobox > .header:active {
        cursor: -webkit-grabbing;
        cursor:    -moz-grabbing;
        cursor:         grabbing;
      }

      #kobox > .header > span {
        pointer-events: none;
      }

      #kobox > .header > .expand {
        height: 1em;
        cursor: pointer;
        opacity: 0.7;
      }
      #kobox > .header > .expand:hover {
        opacity: 0.9;
      }

      #kobox > table {
        font-size: 0.7em;
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
      }

      #kobox > .hide {
        font-size: 0.8em;
        margin: 1px;
        text-align: center;
        cursor: pointer;
        border-top: 1px solid #800080;
        z-index: 1;
        user-select: none;
      }

      #kobox > .corner1, .corner2 {
        position: absolute;
        width: 35px;
        height: 23px;
        z-index: -1;
      }
      #kobox > .corner1 {
        background: url(img/tip-cor.png) no-repeat 0px 0px;
        top: -6px;
        left: -6px;
      }
      #kobox > .corner2 {
        background: url(img/tip-cor.png) no-repeat -35px 0px;
        bottom: -6px;
        right: -6px;
      }

      #kobox > table > tbody > .ko-row {
        border: solid;
        border-width: 1px 0;
        border-color: #5d5006;
        height: 1.6em;
      }
      #kobox > table > tbody > .ko-row:hover {
        background: #520652;
      }
      #kobox > table > tbody > .ko-row:first-child {
        border-top: none;
      }
      #kobox > table > tbody > .ko-row:last-child {
        border-bottom: none;
      }

      #kobox > table > tbody > .ko-row > .ko-add-to-group-cell, .ko-nick-cell {
        cursor: pointer;
        user-select: none;
      }
      #kobox > table > tbody > .ko-row > .ko-add-to-group-cell:hover, .ko-nick-cell:hover {
        color: #eaeb74;
      }

      #kobox > table > tbody > .ko-row > .ko-add-to-group-cell {
        text-align: center;
        width: 12px;
      }

      #kobox > table > tbody > .ko-row > .ko-map-cell {
        text-align: right;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `))
    document.body.appendChild(stylesheet)
  }
  /*
    SEKCJA UI KONIEC
    /\ /\ /\
  */

  /*
    \/ \/ \/
    KLASA APPLICATION
  */
  // pomocnicza funkcja do deklaracji metod abstrakcyjnych (ktore musza zostac nadpisane przez dzieci)
  var abstractMethod = function(){
    throw new Error('Klanowicze online: wywolanie metody abstrakcyjnej')
  }

  function Application(){
    // konstruktor

    this.interval = null

    this.popup = new Popup({
      startFetchingInIntervals: this.startFetchingInIntervals.bind(this),
      stopFetchingInIntervals: this.stopFetchingInIntervals.bind(this),
      addToGroup: this.addToGroup.bind(this),
      sendMessageTo: this.sendMessageTo.bind(this)
    })

    if(!this.popup.hidden)
      this.startFetchingInIntervals()
  }
  // metody:
  Application.prototype.startFetchingInIntervals = function(){
    this.fetchMembers()
    this.interval = setInterval(this.fetchMembers.bind(this), 10000)
  }
  Application.prototype.stopFetchingInIntervals = function(){
    if(this.interval !== null){
      clearInterval(this.interval)
      this.interval = null
    }
  }
  // metody abstrakcyjne (musza byc nadpisane przez dzieci):
  Application.prototype.fetchMembers = abstractMethod
  Application.prototype.addToGroup = abstractMethod
  Application.prototype.sendMessageTo = abstractMethod
  Application.prototype.checkIfIsInBattle = abstractMethod

  /*
    \/ \/ \/
    DZIECI KLASY APPLICATION (z nadpisanymi metodami pod Nowy Interfejs i Stary Interfejs)
  */

  // Stary Interfejs
  function ApplicationSI(){
    var self = this

    // ostatnia pobrana lista klanowiczow
    var lastFetchedMembers = null

    // gracz otworzyl okno z klanowiczami
    var isOpenedMembersWindow = false
    document.querySelector('#clanmenu span[name="Klanowicze"]').parentElement.addEventListener('click', () => {
      isOpenedMembersWindow = true
    })

    var parseInput = window.parseInput
    window.parseInput = function(d, callback, xhr){
      if(d.w && (d.w.toString().startsWith('Zapytanie odrzucone') || d.w.toString().startsWith('Odrzucono stare zapytanie')))
        delete d.w

      if(!d.members2 && !d.members)
        return parseInput(d, callback, xhr)

      if(isOpenedMembersWindow){
        // gracz otworzyl okno z klanowiczami
        isOpenedMembersWindow = false
      } else {
        // lista klanowiczow przechwycona przez dodatek
        if(d.members) lastFetchedMembers = d.members.slice()
        delete d.members2
        delete d.members
      }

      return parseInput(d, callback, xhr)
    }

    this.fetchMembers = function(){
      // pierwsze zaladowanie strony - wyswietl info o walce
      if(self.checkIfIsInBattle() && lastFetchedMembers === null){
        self.popup.setBattleInfo()
      }

      _g('clan&a=members', function(){
        if(lastFetchedMembers)
          self.popup.renderMembers(lastFetchedMembers)
      })
    }

    this.checkIfIsInBattle = function(){
      return Boolean(g.battle)
    }

    this.addToGroup = function(id){
      window._g(`party&a=inv&id=${id}`)
    }

    this.sendMessageTo = function(nick){
      window.chatTo(nick)
    }

    Application.call(this)
  }

  // Nowy Interfejs
  function ApplicationNI(){
    var self = this

    // jesli gracz nie ma klanu to wyjdz
    if(!window.Engine.hero.d.clan)
      return

    const NO_CHAT_INPUT_WARN = 'Klanowicze online: chatInputElement ma wartosc null - potrzebny jest nowy selektor okienka tekstowego chatu.\nSkontaktuj sie z dodatkopisarzem.'

    var chatInputElement = document.querySelector('.chat-tpl input')
    if(chatInputElement === null){
      console.warn(NO_CHAT_INPUT_WARN);
    }

    var fetchedMembersBefore = false

    this.fetchMembers = function(){
      if(self.checkIfIsInBattle() && !fetchedMembersBefore){
        self.popup.setBattleInfo()
      }

      // nie przeszkadzaj gdy gracz zmienia postac lub pisze wiadomosc
      if(Engine.logOff || document.activeElement === chatInputElement)
        return

      var clan = Engine.clan ? { ...Engine.clan } : Engine.clan
      if(!clan)
        Engine.clan = {
          updateMembers(){}
        }

      _g(`clan&a=members`, function({ members }){
        Engine.clan = clan

        if(members){
          self.popup.renderMembers(members)

          if(!fetchedMembersBefore)
            fetchedMembersBefore = true
        }
      })
    }

    this.checkIfIsInBattle = function(){
      return window.Engine.battle && window.Engine.battle.show
    }

    this.addToGroup = function(id){
      window._g(`party&a=inv&id=${id}`)
    }

    this.sendMessageTo = function(nick){
      var chatInput = document.querySelector('.chat-tpl .input-wrapper input')
      if(chatInput === null){
        console.warn(NO_CHAT_INPUT_WARN)
      } else {
        chatInput.value = `@${nick.replace(/ /g, '_')} `
        chatInput.focus()
      }
    }

    Application.call(this)
  }

  // dziedziczenie (NIE RUSZAJ TEGO)
  ApplicationSI.prototype = Object.create(Application.prototype);
  ApplicationSI.prototype.constructor = ApplicationSI
  ApplicationNI.prototype = Object.create(Application.prototype);
  ApplicationNI.prototype.constructor = ApplicationNI

  // funkcja pomocnicza, ktora czeka az funkcja "check" zwroci prawde i wtedy wywola funkcje "then"
  var waitFor = function(check, then){
    if(!check())
      setTimeout(waitFor, 1000, check, then)
    else
      then()
  }

  if(isNewInterface){
    waitFor(function(){
      // czekaj na pelne zaladowanie gry
      return window.Engine && window.Engine.allInit
    }, function(){
       new ApplicationNI()
    })
  } else {
    waitFor(function(){
      // czasem zdarzy sie, ze TamperMonkey wykona sie przed skryptem Margonem i zmienna g jest niezainicjowana - czekaj na zaladowanie
      return window.g !== undefined
    }, function(){
      window.g.loadQueue.push({ fun: function(){
        new ApplicationSI()
      } })
    })
  }
})();