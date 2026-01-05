// ==UserScript==
// @name        WykopBingo!
// @namespace   Wykop scripts
// @description Graj znaleziskami w Bingo na Wykopie
// @include     *://www.wykop.pl/link/*
// @version     0.86a
// @grant       GM_xmlhttpRequest
// @author      Orlin
// @downloadURL https://update.greasyfork.org/scripts/26961/WykopBingo%21.user.js
// @updateURL https://update.greasyfork.org/scripts/26961/WykopBingo%21.meta.js
// ==/UserScript==

// linijka poniżej na potrzeby skryptozakładki, pamiętaj tylko o usunięciu pozostałych komentarzy zaczynających się od //
//javascript:function GM_xmlhttpRequest(a){ alert('Wersja skryptozakładkowa na razie nie potrafi łączyć się z serwerem, więc nie prześle poniższego żądania:\n'+JSON.stringify(a));}; 
/**
 * Wartości pól planszy do gry w WykopBingo!
 */
var boardSquares = [
  'IDIOTA NA DRODZE',
  'IMIGRANCI',
  'JAK XYZ TRAKTUJE KLIENTÓW',
  'PLANETA PODOBNA DO ZIEMI',
  'SKRADZIONO SAMOCHÓD / ROWER',
  'MARIUSZ MAX KOLONKO',
  'AFERA NA WYKOPIE',
  '"POLSKIE OBOZY" W ZACHODNICH MEDIACH',
  'ISLAM',
  'ARTYKUŁ O TESLI',
  'PRZEŁOMOWY WYNALAZEK POLAKÓW',
  'KOTY',
  '[W]',
  'ELON MUSK',
  'KORWIN',
  'A.M.A.',
  'VIKTOR ORBAN',
  'BATERIE NOWEJ GENERACJI',
  'GRAFEN',
  'KWOTA WOLNA OD PODATKU',
  'LEK NA RAKA',
  'KONTROWER-\nSYJNY POMYSŁ RZĄDU/UE',
  'NOWE ŹRÓDŁO ENERGII',
  'OKRADŁ GO ZUS / KOMORNIK',
  'AMERYKAŃSCY NAUKOWCY ODKRYLI'
];

var zalogowany = false;
/*===========================================================================================================================*/

/**
 * Dodaje przycisk gry WykopBingo! do przycisków w formularzu komentarza
 */
function addBingoButton()
{
    var bb = document.createElement('a');
    bb.className = 'button bingoButton';
    /*    bb.innerHTML='▦';*/
    bb.innerHTML = '⌧';
    bb.title = 'WykopBingo!';
    bb.onclick = function () {
      playBingo(this);
    };
/*    var bbb = JSON.parse(JSON.stringify(bb));*/
    var bbb = bb.cloneNode(true);
    bbb.onclick = function () {
      playBingo(this);
    };

  var survButt = document.getElementsByClassName('button openAddSurveyOverlay');
  if(survButt.length > 0)
  {
    survButt[0].parentNode.insertBefore(bb, survButt[0].nextSibling);
    zalogowany = true;
  }
  else
  {
    zalogowany = false;
  }
  var navbar = document.getElementsByClassName('nav fix-b-border');
  if(navbar.length > 0)
  {
    navbar[0].insertBefore(bbb, navbar[0].firstChild);
  }
  else
  {
    alert('Skrypt(ozakładka) działa poprawnie tylko na stronach ze znaleziskami @ wykop.pl.');
  }
}
/*===========================================================================================================================*/

/**
 * Tworzy/pokazuje okienko z planszą gry
 * @param {DOM element reference} buttonNodeRef Żeby po kliknięciu 'Publikuj', komentarz trafił do pola tekstowego, przy którym kliknięto wcześniej przycisk WykopBingo!
 */
function playBingo(buttonNodeRef)
{
  var bingoButtonTst = document.getElementById('bingoTableWrap');
  var overlayDiv;
  
  if(bingoButtonTst !== null)
  {
    bingoButtonTst.style.display = 'block';
    document.getElementById('bingoPublishButton').onclick = function(){
                   generateComment(buttonNodeRef);
                   document.getElementById('bingoTableWrap').style.display = 'none';
                   var ovrls = document.getElementsByClassName('overlay');
                   for(i=0; i<ovrls.length; ++i)
                   {
                     ovrls[i].parentNode.removeChild(ovrls[i]);
                   }
    };
    overlayDiv = document.createElement('div');
    overlayDiv.className = 'overlay';
    overlayDiv.style.display = 'block';
    document.body.insertBefore(overlayDiv, document.body.firstChild);
    resetGame(true);
    fillBoard();
    return;
  }
  var closeBGC, rowBGC, wrapperBGC;
  if(document.body.className.indexOf('night') >= 0)
  {
    /* nocny */
    closeBGC = '000';
    wrapperBGC = '333';
    rowBGC = 'rgba(81,81,81,0.5)';
    
  }
  else
  {
    /* dzienny */
    closeBGC = 'ccc';
    wrapperBGC = '777';
    rowBGC = 'rgba(208,208,208,0.5)';
  }
  
  addCss('.bingoTab\n{\n\tborder-collapse:collapse;\n\tborder-spacing:0;\n}\n\n#bingoTableWrap\n{\n\tdisplay: table;\n\tz-index: 999999;\n\tleft: 25%;\n\ttop: 30px;\n\tposition: fixed;\n\tbackground-color: #'+wrapperBGC+';\n}\n\n#bingoTableWrap > a\n{\n\tcursor: pointer;\n\tposition: absolute;\n\tright: 0px;\n\ttop: -20px;\n\tbackground-color: #'+closeBGC+';\n}\n\n.bingoTab\n{\n\tbackground-size: contain;\n\tbackground-repeat: no-repeat;\n\tbackground-position: center;\n}\n\n.bingoTab tr, .bingoTab tr:hover, .bingoTab tr:nth-child(even)\n{\n\tbackground-color: '+rowBGC+';\n}\n\n.bingoTab td:hover\n{\n\tbackground-color: #888888;\n}\n\n.bingoTab td\n{\n\tposition: relative;\n\tfont-family:Arial, sans-serif;\n\tfont-weight: bold;\n\tfont-size:10px;\n\tpadding:1px;\n\tborder-style:solid;\n\tborder-width:1px;\n\toverflow:hidden;\n\tword-break:normal;\n\ttext-align:center;\n\twidth:80px;\n\theight:80px;\n\tmax-width:80px;\n\tmax-height:80px;\n\tmin-width:80px;\n\tmin-height:80px;\n\tcursor:crosshair;\n\tvertical-align: middle;\n}\n\n.bingoLine\n{\n\tbackground-color: rgba(0,255,0,0.5);\n}\n\n.bingoCrossed\n{\n\tposition: absolute;\n\tdisplay:none; \n\ttop: 40%;\n\twidth: 100%;\n\tfont-color: red;\n\tcolor: red;\n\tfont-weight: bold;\n\tfont-size:68px;\n\n}\n\n.bingoNotCrossed\n{\n\tdisplay:none; \n}\n\n.bingoProofLinks\n{\n    position: absolute;\n\tright: 0;\n    bottom: 0;\n\ttext-align:right;\n\tz-index: 2;\n}\n\n.bingoProofLinksOff\n{\n\tdisplay:none;\n}\n\n#bingoCtxMenu\n{\n\tposition: absolute;\n\tdisplay:none;\n\tbackground-color: lightgrey;\n\tborder: 1px dashed blue;\n\tz-index: 5;\n}\n\n#bingoCtxMenu\n{\n\tpadding: 5px 10px;\n\tposition: fixed;\n\tdisplay:none;\n\tbackground-color: lightgrey;\n\tborder: 1px dashed blue;\n\tz-index: 5;\n}\n\n#bingoCtxMenu a\n{\n\tdisplay:block;\n\tcursor:pointer;\n\tcolor: blue;\n}\n\n#bingoCtxMenu a:hover\n{\n\ttext-decoration: underline;\n}\n\n#bingoCtxMenu a:before\n{\n\tcontent:"• ";\n}\n\n.bingoButtons\n{\n\tcolor: #000;\n\tmargin: 5px\n}\n\n.bingoButtons :focus\n{\n\tcolor: #000;\n\tmargin: 5px\n}\n\n#bingoLinksEditor\n{\n\tposition: fixed;\n\tleft: 10%;\n\ttop:50px;\n\tcolor: #000;\n\tbackground-color: #aaa;\n\tz-index:5;\n\twidth: 75%;\n\tmin-width: 640px;\n}\n\n#bingoLinksEditor > a\n{\n\tcursor: pointer;\n\tposition: absolute;\n\tright: 0px;\n\ttop: -20px;\n\tbackground-color: #'+closeBGC+';\n}\n\n#bingoLinksEditor table\n{\n\tbackground-color: #aaa;\n}\n\n#bingoLinksEditor thead\n{\n\tbackground-color: #888;\n}\n\n#bingoLinksEditor thead tr\n{\n\tbackground-color: #888;\n}\n\n#bingoLinksEditor thead td\n{\n\ttext-align: center;\n\tvertical-align: middle;\n\tfont-weight: bold;\n}\n\n#bingoLinksEditor tbody\n{\n\tbackground-color: #aaa;\n}\n\n#bingoLinksEditor tbody tr\n{\n\tbackground-color: #aaa;\n}\n\n#bingoLinksEditor tbody td\n{\n\ttext-align: center;\n\tvertical-align: middle;\n\tpadding: 1px;\n}\n\n#bingoLinksEditor input\n{\n\tpadding: 0px;\n\tmargin: 0px;\n}\n\n#bingoLinksEditor > input[type=text], #bingoLinksEditor > input[type=password]\n{\n\twidth: 100px;\n}\n\n#bingoLinksEditor > span, #bingoLinksEditor > input[type=checkbox]\n{\n\tmargin: 0 5px;\n}');
  overlayDiv = document.createElement('div');
  overlayDiv.className = 'overlay';
  overlayDiv.style.display = 'block';
  document.body.insertBefore(overlayDiv, document.body.firstChild);
  document.body.insertBefore(buildBoard(boardSquares, buttonNodeRef), document.body.firstChild);
  fillBoard();
  
  var lastReset = localStorage.getItem('bingoLastReset');
  var shouldReset = false;
  if(lastReset)
  {
    var lastResetDate = new Date(parseInt(lastReset));
    var now = new Date();
    if(+now - +lastResetDate > 604800000) /* > 7*3600*24000*/
    {
      shouldReset = true;
    }
    if(!shouldReset)
    {
      var lastMonday = new Date();
      var dow = now.getDay()||7;
      lastMonday.setTime(now.getTime()-(dow-1)*86400000); /* *3600*24000*/
      lastMonday.setHours(0);
      lastMonday.setMinutes(0);
      lastMonday.setSeconds(0);
      if((+lastResetDate) < (+lastMonday))
      {
        shouldReset = true;
      }
    }
  }
  else
  {
    shouldReset = true;
  }
  if(shouldReset)
  {
    var answ = confirm('Wygląda, że plansza nie była jeszcze resetowana w tym tygodniu.\nCzy chcesz zresetować ją teraz?\n' +
                       '\nPamiętaj, że w każdym tygodniu zabawy\nliczą się tylko wykopy dodane między początkiem poniedziałku a końcem niedzieli.');
    if(answ)
    {
      resetGame(false);
      fillBoard();
    }
  }
  
}
/*===========================================================================================================================*/

/**
 * Tworzy planszę do gry
 * @param {string[]} squares Tablica z nazwami pól
 * @param {DOM element reference} buttonNodeRef Żeby po kliknięciu 'Publikuj', komentarz trafił do pola tekstowego, przy którym kliknięto wcześniej przycisk WykopBingo!
 */
function buildBoard(squares, buttonNodeRef)
{
  var i,
  j,
  k;
  var tr,
  td,
  div,
  div2,
  div3,
  aLink,
  inpt,
  lbl;
  
  /*var frag = document.createDocumentFragment();*/
  
  var tbl = document.createElement('table');
  tbl.className = 'bingoTab';
  tbl.id = 'bingoTable';
  var tabSize = Math.sqrt(squares.length);
  if(Math.floor(tabSize) !== tabSize)
  {
    alert('Nieprawidłowa ilość opisów dla pól planszy. Aby plansza była kwadratowa, potrzeba opisów w ilości będącej kwadratem liczby naturalnej > 0');
    return null;
  }
  if(tabSize > 8)
  {
    alert('Za dużo pól. Dodatek w tej wersji obsługuje maksymalnie planszę 8x8.');
    return null;
  }
  for(i=0, k=0; i<tabSize; ++i)
  {
    tr = tbl.insertRow();
    for(j=0; j<tabSize; ++j)
    {
      td = tr.insertCell();
      td.setAttribute('cellID', k);
      td.id = 'bingoSquareNo' + k;
      td.title = squares[k];
      div = document.createElement('div');
      div.innerHTML = squares[k];
      ++k;
      td.appendChild(div);
      div = document.createElement('div');
      div.innerHTML = '&#x2718;';
      div.className = 'bingoCrossed';
      td.appendChild(div);
      div = document.createElement('div');
      div.className = 'bingoProofLinks';
      td.appendChild(div);
      /*				td.onmouseover = drawMenu;*/
      td.onclick = drawMenu;
      /*				td.appendChild(document.createTextNode(squares[k++]));*/
    }
  }
  
  tbl.style.backgroundImage = "url('data:image/png;base64,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')";
  
  div2 = document.createElement('div');
  div2.id = 'bingoTableWrap';
  div2.className = 'normal m-set-fullwidth m-reset-top m-reset-margin m-reset-left';
  
  aLink = document.createElement('a');
  aLink.innerHTML = '[x]';
  aLink.title = 'Zamknij';
  aLink.onclick = function () {
    document.getElementById('bingoTableWrap').style.display = 'none';
    var ovrls = document.getElementsByClassName('overlay');
    for(i=0; i<ovrls.length; ++i)
    {
      ovrls[i].parentNode.removeChild(ovrls[i]);
    }
  };
  div2.appendChild(aLink);
  div2.appendChild(tbl);
  div3 = document.createElement('div');
  div3.id = 'bingoCtxMenu';
  /*		div3.innerHTML = '<strong>Menu</strong>';	*/
  aLink = document.createElement('a');
  aLink.innerHTML = 'skreśl pole / dodaj link';
  aLink.onclick = function () {
    this.parentNode.style.display = 'none';
    var cellId = this.parentNode.getAttribute('sourceCell');
    /* sprawdzenie, czy już nie dodano tego samego...*/
    var pLinks = document.getElementById('bingoSquareNo' + cellId).getElementsByClassName('bingoProofLinks')[0].getElementsByTagName('a');
    for(var l=0; l<pLinks.length; ++l)
    {
      if(pLinks[l].href == document.location.href)
      {
        alert('Taki sam link został już wcześniej dodany do tego pola.\nPor. link #' + pLinks[l].innerHTML.replace(/[\[\]*]/g, ''));
        return;
      }
    }
    var timestamp = +new Date();
    var isAlisko;
    var navLinks = document.getElementById('nav').getElementsByTagName('a');
    for(var i=0; i<navLinks.length; ++i)
    {
      if(navLinks[i].href.indexOf('wykopalisko') >= 0 )
      {
        if(navLinks[i].parentNode.className.indexOf('active') >= 0)
        {
          isAlisko = true;
        }
        else
        {
          isAlisko = false;
        }
      }
    }
    var indeks = addRecordToLS(document.location.href, cellId, timestamp, isAlisko, -1);
    addLinkToCell(indeks, document.location.href, cellId, timestamp, isAlisko);
    crossSquare(cellId);
    var bingoFound = localStorage.getItem('bingoFound');
    if(bingoFound > 0)
    {
      checkBingoLines(true);  
    }
/*				alert(this.innerHTML);*/
  };
  div3.appendChild(aLink);
  aLink = document.createElement('a');
  aLink.innerHTML = 'wyczyść pole ze wszystkich linków';
  aLink.onclick = function () {
    this.parentNode.style.display = 'none';
    var cellId = this.parentNode.getAttribute('sourceCell');
    uncrossSquare(cellId);
/*    document.getElementById('bingoSquareNo' + cellId).className = '';*/
    var bingoFound = localStorage.getItem('bingoFound');
    if(bingoFound > 0)
    {
      checkBingoLines(true);  
    }
    deleteAllProofLinksInCell(cellId, true);
  };
  div3.appendChild(aLink);
  aLink = document.createElement('a');
  aLink.innerHTML = 'edytuj listę linków';
  aLink.onclick = function () {
    this.parentNode.style.display = 'none';
    var cellId = this.parentNode.getAttribute('sourceCell');
    bingoLinkEditor(cellId);
  };
  div3.appendChild(aLink);
  aLink = document.createElement('a');
  aLink.innerHTML = 'zamknij menu';
  aLink.title = 'możesz też po prostu kliknąć jeszcze raz w to samo pole na planszy...';
  aLink.onclick = function () {
    this.parentNode.style.display = 'none';
  };
  div3.appendChild(aLink);
  div2.appendChild(div3);
  
  /* Przyciski */
  inpt = document.createElement('input');
  inpt.type = 'button';
  inpt.id = 'bingoPublishButton';
  inpt.className = 'bingoButtons';
  inpt.value = 'Publikuj';
  inpt.title = 'Dodaj do wpisu';
  inpt.onclick = function(){
                   generateComment(buttonNodeRef);
                   document.getElementById('bingoTableWrap').style.display = 'none';
                   var ovrls = document.getElementsByClassName('overlay');
                   for(i=0; i<ovrls.length; ++i)
                   {
                     ovrls[i].parentNode.removeChild(ovrls[i]);
                   }
  };
  div2.appendChild(inpt);
  
  inpt = document.createElement('input');
  inpt.type = 'button';
  inpt.className = 'bingoButtons';
  inpt.value = 'Bingo!';
  inpt.title = 'Jest 5 skreśleń w jednej linii';
  inpt.onclick = function(){ checkBingoLines(false); };
  div2.appendChild(inpt);
    
  inpt = document.createElement('input');
  inpt.type = 'button';
  inpt.className = 'bingoButtons';
  inpt.value = 'Zgłoś';
  inpt.title = 'Zgłoś do konkursu na wykop-bingo.ml';
  inpt.onclick = function(){
    var myComments = document.getElementsByClassName('ownComment');
    var i, time, postLink, imgLink, toSubmit, txt;
    var myBingoComments = [];
    for(i=0; i<myComments.length; ++i)
    {
      time = myComments[i].getElementsByTagName('time')[0];
      postLink = time.parentNode.parentNode.href;
      txt = myComments[i].getElementsByClassName('text')[0];
      if((imgLink=txt.innerHTML.match(/https?:\/\/wykop-bingo\.ml\/wb-001\/[0-9a-f]{10}x\.jpg/i)) && txt.innerHTML.indexOf('Komentarz wygenerowany z pomocą dodatku')>0)
      {
        myBingoComments.push({postLink: postLink, dateTime: time.title, imgLink: imgLink[0].replace(/^https?:\/\/wykop-bingo\.ml\//, '/')}); 
      }
    }
    if(myBingoComments.length === 0)
    {
      toSubmit = null;
      alert('Nie znaleziono żadnych Twoich komentarzy z opublikowaną planszą do gry (w postaci linka lub załączonego obrazka).\nUpewnij się, że jesteś zalogowany/zalogowana i że dodano na bieżącej stronie odpowiedni komentarz.\nPamiętaj także, iż przed opublikowaniem i zgłoszeniem musisz kliknąć przycisk Bingo! - by zostały zaznaczone pola / narysowane linie przechodzące przez komplet skreślonych pól.\nJeśli nadal nie możesz zgłosić komentarza - dodaj go ręcznie (podając link do komentarza) przez formularz na stronie wykop-bingo.ml i ew. zgłoś problem autorowi.');
    }
    else if(myBingoComments.length == 1)
    {
      toSubmit = myBingoComments[0];
    }
    else
    {
      myBingoComments.sort(function(a, b) {
           return +new Date(b.dateTime) - +new Date(a.dateTime); /* newest first*/
      });
      toSubmit = myBingoComments[0];
    }
    if(toSubmit)
    {
      var username = document.getElementById('nav').getElementsByClassName('fa fa-user')[0].parentNode.href.replace(/^.*wykop\.pl\/ludzie\/(.*)\/$/, '$1');
/* z wykorzystaniem GM_xmlhttpRequest() */ 
/*      
          GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://wykop-bingo.ml/submit-bingo.php',
                data: 'user='+encodeURIComponent(username)+'&post_url='+encodeURIComponent(toSubmit.postLink)+'&img='+encodeURIComponent(toSubmit.imgLink),
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                onload: function(response) {
                        alert(response.responseText);              
                }
          });
*/
      /* alternatywa powyższego dla wersji skryptozakładkowej (w sumie nie tylko) - z wykorzystaniem image.src */

      var submitImg = new Image();
      submitImg.addEventListener('load', function(){
             if(this.width==1)
             {
               alert('Post zgłoszony');
             }
             else if(this.width==2)
             {
               alert('Post został już wcześniej zgłoszony\nW konkursie brany pod uwagę jest tylko autor posta, nie zgłaszający');
             }
             else
             {
               alert('Wysyłanie zgłoszenia nie powiodło się');
             }
      }, false);  
      
      submitImg.src = 'https://wykop-bingo.ml/submit-bingo-via-img.php?x='+(+new Date())+'&user='+encodeURIComponent(username) +'&img='+encodeURIComponent(toSubmit.imgLink) +
                      '&post_url='+encodeURIComponent(toSubmit.postLink);
      
    }
    
  };
  div2.appendChild(inpt);

  inpt = document.createElement('input');
  inpt.type = 'checkbox';
  inpt.className = 'bingoButtons';
  inpt.checked = 'checked';
  inpt.id = 'bingoShowLinks';
  inpt.onchange = function(){/*if(this.checked) switchProofLinks(true); else switchProofLinks(false);*/switchProofLinks(this.checked);};
  div2.appendChild(inpt);
  
  lbl = document.createElement('label');
  lbl.for = 'bingoShowLinks';
  lbl.innerHTML = 'Pokaż linki';
  div2.appendChild(lbl);
  
/*  var br = document.createElement('br');
  div2.appendChild(br);*/
  
  inpt = document.createElement('input');
  inpt.type = 'button';
  inpt.className = 'bingoButtons';
/*  inpt.style.display = 'none';*/
  inpt.value = 'Odśwież';
  inpt.title = 'Odświeża planszę (np. po zmianach dokonanych w innej karcie czy bezpośrednio w pamięci)';
  inpt.onclick = function(){ resetGame(true); fillBoard();};
  div2.appendChild(inpt);
  
  inpt = document.createElement('input');
  inpt.type = 'button';
  inpt.className = 'bingoButtons';
/*  inpt.style.display = 'none';*/
  inpt.value = 'Edytuj linki';
  inpt.title = 'Otwiera okno edycji zapisanych linków';
  inpt.onclick = function(){ bingoLinkEditor(-1); };
  div2.appendChild(inpt);
  
  return div2;
}
var evCntr = 0, wrongChar='\\';
/*===========================================================================================================================*/

/**
 * Dodaje przekazany kod CSS do strony
 * @param {string} code kod CSS
 */
function addCss(code)
{
  var style = document.createElement('style');
  style.type = 'text/css';
  if(style.styleSheet)
  { /* IE*/
    style.styleSheet.cssText = code;
  } 
  else
  { /* Other browsers*/
    style.innerHTML = code;
  }
  document.getElementsByTagName('head')[0].appendChild(style);
}
/*===========================================================================================================================*/

/**
 * Zwraca pierwszy wolny, nieużywany indeks dla nowego linka
 * @return {number} Indeks nowego linka
 * @TODO Naprawa uszkodzonego (umyślnie?) rekordu 'bingoLinks'
 */
function genNewLinkIdx()
{
  var lastId;
  var bingoLinks = localStorage.getItem('bingoLinks');
  if(bingoLinks === null || bingoLinks === '')
  {
/*    localStorage.setItem('bingoLinks', ',1,');*/
    return 1;
  } 
  else
  {
/* pierwszy wolny*/
    for(var i=1; bingoLinks.indexOf(','+i+',')>=0; ++i)
      ;
/*    localStorage.setItem('bingoLinks', bingoLinks + (i) + ',');*/
    return i;
  }
}
/*===========================================================================================================================*/

/**
 * Dodaje do wskazanej komórki w tabeli/planszy link (wraz z jego numerem)
 * @param {string} url - adres strony
 * @param {number} idx - numer linka
 * @param {number} squareNum - numer pola na planszy z przedziału <0, boardSquares.length)
 * @param {number} timestamp - kiedy dodano link
 * @param {boolean} isAlisko - czy w chwili dodawania znalezisko było w wykopalisku
 * @TODO url - sprawdzić poparawność?
 */
function addLinkToCell(idx, url, squareNum, timestamp, isAlisko)
{
  var link;
  var cell = document.getElementById('bingoSquareNo' + squareNum);
  if(cell === undefined || cell === null)
  {
    alert('Czyżby próba dodania linka do nieistniejącej komórki?');
    return;
  }
  link = document.createElement('a');
  link.href = url;
  link.title = (new Date(parseInt(timestamp))).toISOString().substring(0,19).replace('T', ' ');
  link.innerHTML = '[' + idx +  (isAlisko?'*':'') + ']';
  link.setAttribute('timestamp', timestamp);
  cell.getElementsByClassName('bingoProofLinks')[0].appendChild(link);
}
/*===========================================================================================================================*/

/**
	 * Dodaje do localStorage, pod kolejnym indeksem (bingoLink_??), link wraz z przypisanym numerem pola planszy,
	 * przekazanym 'timestampem' i informacją, czy w chwili dodawania znalezisko było w wykopalisku;
   * nr dodanego/zaktualizowanego linka dopisuje (jeśli go jeszcze tam nie ma) do bingoLinks w localStorage
	 * @param {string} url - adres strony
	 * @param {number} squareNum - numer pola na planszy z przedziału <0, boardSquares.length)
   * @param {number} timestamp - kiedy dodano link
	 * @param {boolean} isAlisko - czy w chwili dodawania znalezisko było w wykopalisku
	 * @param {boolean} idx - nr/indeks z jakim ma być dodany rekord do localStorage; jeśli idx == -1, to zostanie wygenerowany nowy numer, o 1 większy od ostatniego
	 * @return {number} Indeks nowego linka
	 * @TODO url - sprawdzić poparawność?
	 */
function addRecordToLS(url, squareNum, timestamp, isAlisko, idx)
{
  var newIdx;
  if(idx == -1) /* chcemy nowy id/numer dla linka*/
  {
    newIdx = genNewLinkIdx();
  }
  else
  {
    newIdx = idx;
  }
  var bingoLinks = localStorage.getItem('bingoLinks');
  if(bingoLinks === null || bingoLinks === '')
  {
    localStorage.setItem('bingoLinks', ',' + newIdx + ',');
  }
  else if(bingoLinks.indexOf(','+newIdx+',') < 0)
  {
    localStorage.setItem('bingoLinks', bingoLinks + (newIdx) + ',');
  }
  localStorage.setItem('bingoLink_' + newIdx, squareNum + '|' + timestamp + '|' + url.replace(/^https:\/\/www\.wykop\.pl\//, '/').replace(/[|]/g, '%7C').replace(/#.*$/, '') + ((isAlisko) ? '|1' : '|0'));
  return newIdx;
}
/*===========================================================================================================================*/

/**
 * Usuwa z localStorage rekord wskazany przez indeks
 * @param {number} idx - indeks ('bingoLink_'+idx)
 */
function deleteRecordFromLS(idx)
{
  var re;
  var bingoLinks = localStorage.getItem('bingoLinks');
  if(bingoLinks !== null && bingoLinks !== '')
  {
    re = new RegExp(',' + idx + ',', 'g');
    bingoLinks = bingoLinks.replace(re, ',');
    if(bingoLinks == ',')
    {
      bingoLinks = '';
    }
    localStorage.setItem('bingoLinks', bingoLinks);
  }
  localStorage.removeItem('bingoLink_' + idx);
}
/*===========================================================================================================================*/

/**
 * Usuwa wszystkie linki ze wskazanej komórki
 * @param {string} cellId - nr/ID komórki do wyczyszczenia z linków
 * @param {boolean} localStorageToo - czy oprócz usuwania linków z tablicy usunąć je także z localStorage?
 */
function deleteAllProofLinksInCell(cellId, localStorageToo)
{    
    var proofDiv = document.getElementById('bingoSquareNo' + cellId).getElementsByClassName('bingoProofLinks') [0];
    var aLinks = proofDiv.getElementsByTagName('a');
	
    while(proofDiv.firstChild)
    {
      if(localStorageToo)
      {
        deleteRecordFromLS(proofDiv.firstChild.innerHTML.replace('[', '').replace(']', '').replace('*', ''));
      }
      proofDiv.removeChild(proofDiv.firstChild);
    }
}
/*===========================================================================================================================*/

/**
 * Wypełnia planszę na podstawie danych z localStorage (skreślenia, linki)
 */
function fillBoard()
{
  var bingoLinksArr,
  i,
  record,
  recordArr,
  bingoFound;
  var bingoLinks = localStorage.getItem('bingoLinks');
  if(bingoLinks === undefined || bingoLinks === null || bingoLinks === '')
  {
    return;
  }  /*bingoLinks.replace(/^,(.*),$/, '$1'); albo dostosować odpowiednio pętle*/
  bingoLinksArr = bingoLinks.split(',');
  if(bingoLinksArr.length < 3)
  {
    return;
  }
  for(i=1; i<bingoLinksArr.length-1; ++i)
  {
    record = localStorage.getItem('bingoLink_' + bingoLinksArr[i]);
    if(record === null)
    {
      continue;  
    }
    recordArr = record.split('|');
    addLinkToCell(bingoLinksArr[i], recordArr[2], recordArr[0], recordArr[1], recordArr[3]==1); /* check args*/
    crossSquare(recordArr[0]);
  }

  bingoFound = localStorage.getItem('bingoFound');
/*  if(bingoFound !== null && bingoFound > 0)*/
  if(bingoFound > 0)
  {
    checkBingoLines(true);
  }
  
}
/*===========================================================================================================================*/

/**
 * Resetuje grę (plansza + ew. localStorage)
 * @param {boolean} onlyBoard - czy zresetować tylko planszę (bez zmian w localStorage)?
 */
function resetGame(onlyBoard)
{
  var bingoTab = document.getElementById('bingoTable');
  var boardDim = bingoTab.rows.length;
  var i, j;
  
  for(i=0; i<boardDim; ++i)
  {
    for(j=0; j<boardDim; ++j)
    {
      if(bingoTab.rows[i].cells[j].getElementsByClassName('bingoCrossed')[0].style.display == 'block')
      {
        uncrossSquare(i*boardDim+j);
        deleteAllProofLinksInCell(i*boardDim+j, !onlyBoard);
       }
      bingoTab.rows[i].cells[j].className = ''; /* usuwamy 'bingoLine'*/
    } /* for(j)*/
  } /* for(i)*/
  
  if(!onlyBoard)
  {
    localStorage.setItem('bingoFound', '0');
    localStorage.setItem('bingoLinks', '');
    /* dla pewności:*/
    for(i=0; i<200; ++i)
    {
      localStorage.removeItem('bingoLink_');
    }
    localStorage.setItem('bingoLastReset', +new Date());
  }
}
/*===========================================================================================================================*/

/**
 * Rysuje menu po kliknięciu pola na planszy
 */
function drawMenu()
{
  var rect;
  var menuDiv = document.getElementById('bingoCtxMenu');
  if(menuDiv === undefined || menuDiv === null)
  {
    alert('Pomocy!!!! Nie ma diva (tego z menu)!');
    /*			
			menuDiv = document.createElement('div');
			menuDiv.id = 'bingoCtxMenu';
			menuDiv.innerHTML = 'test menu';			  
    */
    return;
  }
  if(menuDiv.getAttribute('sourceCell') === this.getAttribute('cellID'))
  {
    menuDiv.style.display = (menuDiv.style.display == 'none') ? 'block' : 'none';
  } 
  else
  {
    menuDiv.setAttribute('sourceCell', this.getAttribute('cellID'));
    menuDiv.style.display = 'block';
  }
  rect = this.getBoundingClientRect();
  menuDiv.style.left = (rect.right - 40 /*+ window.scrollX*/) + 'px';
  menuDiv.style.top = (rect.bottom - 60 /*+ window.scrollY*/) + 'px';
  /*this.parentNode.parentNode.parentNode.appendChild(menuDiv);
  	alert('['+rect.left + ', '+ rect.top + ']['+ rect.right + ', ' + rect.bottom + ']');
  		alert(this.getAttribute('cellID'));*/
}
/*===========================================================================================================================*/

/**
 * przekreśla pole wskazane przez ID
 * @param {string} cellId - nr/ID komórki do przekreślenia
 */
function crossSquare(cellId)
{
  var cell = document.getElementById('bingoSquareNo' + cellId);
  if(cell === undefined || cell === null)
  {
    alert('[X] Brak komórki o id \'bingoSquareNo' + cellId + '\'');
    return;
  }
  cell.getElementsByClassName('bingoCrossed') [0].style.display = 'block';
}
/*===========================================================================================================================*/

/**
 * usuwa skreślenie pola wskazanego przez ID
 * @param {string} cellId - nr/ID komórki do usunięcia przekreślenia
 */
function uncrossSquare(cellId)
{
  var cell = document.getElementById('bingoSquareNo' + cellId);
  if(cell === undefined || cell === null)
  {
    alert('[unX] Brak komórki o id \'bingoSquareNo' + cellId + '\'');
    return;
  }
  cell.getElementsByClassName('bingoCrossed') [0].style.display = 'none';
}
/*===========================================================================================================================*/

/**
	 * Ukrywa/pokazuje linki na polach planszy
	 * @param {boolean} val - true -> pokaż, false -> ukryj
	 */
function switchProofLinks(val)
{
  var i;
  var bpl = document.getElementsByClassName('bingoProofLinks');
  var cn = val ? 'bingoProofLinks' : 'bingoProofLinks bingoProofLinksOff';
  
  for(i=0; i<bpl.length; ++i)
  {
    bpl[i].className = cn;
  }
}
/*===========================================================================================================================*/

/**
 * Generuje komentarz (adres obrazka + linki) z bieżącym stanem planszy
 * @param {DOM element reference} ponieważ na stronie może być >1 pole tekstowe komentarza, to dzięki temu wiemy, do którego ma być wstawiony wygenerowany komentarz
 */
function generateComment(buttonNodeRef)
{
  var binRow = '',
  i, j, k,
  cmnt = '',
  num = '',
  links,
  hasBingoLine = false;
  var bingoTab = document.getElementById('bingoTable');
  var boardDim = bingoTab.rows.length;
  
  for(i = 0; i < boardDim; ++i)
  {
    for(j = 0; j < boardDim; ++j)
    {
      if(bingoTab.rows[i].cells[j].getElementsByClassName('bingoCrossed')[0].style.display == 'block')
      {
        if(bingoTab.rows[i].cells[j].className == 'bingoLine')
        {
          hasBingoLine = true;
        }
        cmnt += '\n[' + bingoTab.rows[i].cells[j].firstChild.innerHTML.replace('-\n', '') + ']: ';
        links = bingoTab.rows[i].cells[j].getElementsByClassName('bingoProofLinks')[0].getElementsByTagName('a');
        for(k=0; k<links.length; ++k)
        {
          cmnt += '[' + links[k].innerHTML + '](' + links[k].href + '), ';
        }
        cmnt = cmnt.slice(0, -2); /* usunięcie nadmiarowego ', '*/
        binRow += '1';
      } 
      else
      {
        binRow += '0';
      }
    } /* for(j)*/
    num += ('0' + parseInt(binRow, 2).toString(16)).slice(-2);
  } /* for(i)*/
  
  cmnt = 'https://wykop-bingo.ml/wb-001/' + /*boardDim + '_' +*/ num + (hasBingoLine?'x':'') + '.jpg\n\n**Linki WykopBingo!:**' + cmnt + '\n\n' + 'Komentarz wygenerowany z pomocą dodatku [WykopBingo!](https://www.wykop.pl/dodatki/pokaz/927/)';

  try
  {
    /*  buttonNodeRef.parentNode.parentNode.parentNode.getElementsByTagName('textarea')[0].value += cmnt;*/
    /* na wypadek zmian zaczynamy szukać jeszcze jeden parentNode wyżej niż to aktualnie jest potrzebne*/
    buttonNodeRef.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('textarea')[0].value += cmnt;
    /*document.getElementsByClassName('reply ajax withEmbed')[0].getElementsByTagName('textarea')[0].value += cmnt;  */
  }
  catch(e)
  {
    alert('Nie udało się dodać poniższego tekstu do komentarza:\n\n' + cmnt);
  }
}
/*===========================================================================================================================*/

/**
 * Sprawdza, czy na planszy są linie 'bingo', a jeśli tak, to zaznacza je
 * @param {boolean} silent - czy funckja ma się wykonać 'po cichu' i nie komunikować o braku 'bingo' na planszy 
 */
function checkBingoLines(silent)
{
  var bingoTab = document.getElementById('bingoTable');
  var boardDim = bingoTab.rows[0].cells.length;
  var rows = new Array(boardDim).fill(0);
  var cols = new Array(boardDim).fill(0);
  var diags = new Array(2).fill(0);
  var i, j;
  var isBingo = false;
  
  for(i=0; i<boardDim; ++i)
  {
    for(j=0; j<boardDim; ++j)
    {
      bingoTab.rows[i].cells[j].className = '';
      if(bingoTab.rows[i].cells[j].getElementsByClassName('bingoCrossed')[0].style.display == 'block')
      {
        if(i == j)
          diags[0] += 1;
        if(i == boardDim-j-1)
          diags[1] += 1;
        rows[i] += 1;
        cols[j] += 1;
      }
    } /* for(j)*/
  } /* for(i)*/
  
  for(i=0; i<boardDim; ++i)
  {
    if(rows[i] == boardDim)
    {
      isBingo = true;
      for(j=0; j<boardDim; ++j)
      {
        bingoTab.rows[i].cells[j].className = 'bingoLine';
      }
    }
  }
  for(i=0; i<boardDim; ++i)
  {
    if(cols[i] == boardDim)
    {
      isBingo = true;
      for(j=0; j<boardDim; ++j)
      {
        bingoTab.rows[j].cells[i].className = 'bingoLine';
      }
    }
  }
  if(diags[0] == boardDim)
  {
    isBingo = true;
    for(i=0; i<boardDim; ++i)
    {
      bingoTab.rows[i].cells[i].className = 'bingoLine';
    }
  }
  if(diags[1] == boardDim)
  {
    isBingo = true;
    for(i=0; i<boardDim; ++i)
    {
      bingoTab.rows[boardDim-i-1].cells[i].className = 'bingoLine';
    }
  }
  if(isBingo)
  {
    /* localStorage.setItem('bingoFound', ''+(+new Date()));*/
    /*localStorage.setItem('bingoFound', +new Date());*/
    localStorage.setItem('bingoFound', '1');
    if(!silent)
    {
      alert('Bingo! Możesz opublikować planszę ze skreśleniami (oraz linkami) i zgłosić ją do konkursu.');
    }
    
  }
  else
  {
    localStorage.setItem('bingoFound', '0');
    if(!silent)
    {
      alert('W żadnej z linii (poziomej, pionowej, ukośnej) nie ma jeszcze kompletu skreśleń.');
    }
  }
  return isBingo;
}
/*===========================================================================================================================*/

/**
 * Pokazuje edytor linków
 * @param {number} nr/id komórki do edycji linków; jeśli cellId == -1, to edycja wszystkich linków
 */
function bingoLinkEditor(cellId)
{  
  resetGame(true);
  fillBoard();
  
  var i, inpt, proofContainer, table, row, cell, aLink, td, select, option, alisko, tabDiv, linkNo;
  var bingoTableWrap = document.getElementById('bingoTableWrap');
  var bingoLinksEditor = document.getElementById('bingoLinksEditor');
  if(bingoLinksEditor)
  {
    bingoLinksEditor.parentNode.removeChild(bingoLinksEditor);
  }

  var editLinksDiv = document.createElement('div');
  editLinksDiv.id = 'bingoLinksEditor';
  wrongChar = 'WnJlenlnbnVqJTIweiUyMG5vY25lZ28lMjBpJTIwZHppZW5uZWdvJTIwbmElMjB';
  
  aLink = document.createElement('a');
  aLink.innerHTML = '[x]';
  aLink.title = 'Zamknij';
  aLink.onclick = function () {
      var bingoLinksEditor = document.getElementById('bingoLinksEditor');
      bingoLinksEditor.parentNode.removeChild(bingoLinksEditor);
      resetGame(true);
      fillBoard();
  };
  editLinksDiv.appendChild(aLink);
  
  tabDiv = document.createElement('div');
  table = document.createElement('table');
  wrongChar +='yemVjeiUyMHBzeWNob2RlbGljem5lZ28lMjAlMjgldTIzMTAlMjAldTAzNjEldT';
  var header = table.createTHead();
  row = header.insertRow();

  cell = row.insertCell();
  cell.innerHTML = 'Pole<br />[i jego #]';
  cell.width = '50px';
  cell = row.insertCell();
  cell.innerHTML = 'Nr linka';
  cell.width = '50px';
  cell = row.insertCell();
  cell.innerHTML = 'URL';
  cell = row.insertCell();
  cell.innerHTML = 'Data dodania';
  cell.width = '125px';
  cell = row.insertCell();
  cell.innerHTML = 'Wykopalisko';
  cell.width = '15px';
  cell = row.insertCell();
  cell.innerHTML = 'Działania';
  cell.width = '100px';

  if(parseInt(cellId) < 0)
  {
    proofContainer = document.getElementById('bingoTable');
  }
  else
  {
    proofContainer = document.getElementById('bingoSquareNo' + cellId).getElementsByClassName('bingoProofLinks') [0];
  }

  var aLinks = proofContainer.getElementsByTagName('a');
  wrongChar +='I1QTAlMjAldTAzNUMldTAyOTYlMjAldTAzNjEldTI1QTAlMjk=';
  var tableBody = table.appendChild(document.createElement('tbody'));
  for(i=0; i<aLinks.length; ++i)
  {    
    row = tableBody.insertRow();
    
    cell = row.insertCell();
    td = aLinks[i].parentNode.parentNode;
    cell.innerHTML = td.getElementsByTagName('div')[0].innerHTML + ' [' + td.id.replace(/bingoSquareNo/, '') + ']';

    cell = row.insertCell();
    inpt = document.createElement('input');
    inpt.type = 'text';
    linkNo = aLinks[i].innerHTML.replace(/[\[\]*]/g, '');
    inpt.value = linkNo;
    row.setAttribute('origLinkNo', linkNo);
    cell.appendChild(inpt);
cell.width = '50px';

    cell = row.insertCell();
    inpt = document.createElement('input');
    inpt.type = 'text';
    inpt.value = aLinks[i].href;
    cell.appendChild(inpt);

    cell = row.insertCell();
    cell.innerHTML = aLinks[i].title;
    cell.setAttribute('timestamp', aLinks[i].getAttribute('timestamp'));
cell.width = '125px';
    
    cell = row.insertCell();
    alisko = aLinks[i].innerHTML.indexOf('*') > 0;
    
    select = document.createElement('select');
    option = document.createElement('option');
    option.value = '0';
    option.innerHTML = 'NIE';
    if(!alisko)
    {
      option.selected = true;
    }
    select.appendChild(option);
    option = document.createElement('option');
    option.value = '1';
    option.innerHTML = 'TAK';
    if(alisko)
    {
      option.selected = true;
    }
    select.appendChild(option);
    cell.appendChild(select);
cell.width = '15px';
    
    cell = row.insertCell();
cell.width = '125px';

    inpt = document.createElement('input');
    inpt.type = 'button';
    inpt.className = 'bingoButtons';
    inpt.value = 'Usuń';
    inpt.onclick = deleteRecordInEditor;  
    cell.appendChild(inpt);
    
    inpt = document.createElement('input');
    inpt.type = 'button';
    inpt.className = 'bingoButtons';
    inpt.value = 'Zapisz';
    inpt.onclick = updateRecordInEditor;
    cell.appendChild(inpt);
  } /* for(i)*/
  
  tabDiv.style.maxHeight = '400px';
  tabDiv.style.overflow = 'auto';
  tabDiv.appendChild(table);
  
  editLinksDiv.appendChild(tabDiv);

  if(parseInt(cellId) < 0)
  {
    inpt = document.createElement('input');
    inpt.type = 'button';
    inpt.className = 'bingoButtons';
    inpt.value = 'Import z tekstu';
    inpt.onclick = function(){var prmpt = prompt('Podaj tekst z danymi do zaimportowania.\nNastępnie zostaniesz zapytany o to, co zrobić z istniejącymi linkami.', '{{}}');
                              bingoLinksFromString(prmpt);
                              resetGame(true);
                              fillBoard();
                              bingoLinkEditor(-1);
/*                              var bingoLinksEditor = document.getElementById('bingoLinksEditor');*/
/*                              bingoLinksEditor.parentNode.removeChild(bingoLinksEditor);*/
                              
    };
    editLinksDiv.appendChild(inpt);

    inpt = document.createElement('input');
    inpt.type = 'button';
    inpt.value = 'Eksport do tekstu';
    inpt.onclick = function(){prompt('Skopiuj poniższy tekst. Później możesz go zaimportować np. na innym komputerze', bingoLinks2String());
/*                              var bingoLinksEditor = document.getElementById('bingoLinksEditor');*/
/*                              bingoLinksEditor.parentNode.removeChild(bingoLinksEditor);*/
    };
    inpt.className = 'bingoButtons';
    editLinksDiv.appendChild(inpt);

    inpt = document.createElement('input');
    inpt.type = 'button';
    inpt.className = 'bingoButtons';
    inpt.value = 'Renumeracja linków';
    inpt.title = 'Numeruje na nowo linki (wg kolejności pól na planszy)';
    inpt.onclick = function(){renumberBingoLinks(); 
                              resetGame(true);
                              fillBoard();
/*                              var bingoLinksEditor = document.getElementById('bingoLinksEditor');*/
/*                              bingoLinksEditor.parentNode.removeChild(bingoLinksEditor);*/
                              
    };
    editLinksDiv.appendChild(inpt);
    
    inpt = document.createElement('input');
    inpt.type = 'button';
    inpt.className = 'bingoButtons';
    inpt.value = 'Odśwież';
    inpt.title = 'Odświeża tabelę (np. po zmianach dokonanych w innej karcie czy bezpośrednio w pamięci)';
    inpt.onclick = function(){bingoLinkEditor(-1);};
    editLinksDiv.appendChild(inpt);
    
    inpt = document.createElement('input');
    inpt.type = 'button';
    inpt.className = 'bingoButtons';
    inpt.value = 'Resetuj / Usuń wszystko';
    inpt.title = 'Usuwa wszystkie linki, resetuje planszę';
    inpt.onclick = function(){resetGame(false); fillBoard(); bingoLinkEditor(-1);};
    editLinksDiv.appendChild(inpt);
    
    inpt = document.createElement('br');
    editLinksDiv.appendChild(inpt);
    
    
    inpt = document.createElement('span');
    inpt.innerHTML = 'Użytkownik';
    editLinksDiv.appendChild(inpt);
    
    inpt = document.createElement('input');
    inpt.maxLength = 64;
    inpt.type = 'text';
    inpt.id = 'bingoEditorUsername';
    try {
      inpt.value = document.getElementById('nav').getElementsByClassName('fa fa-user')[0].parentNode.href.replace(/^.*wykop\.pl\/ludzie\/(.*)\/$/, '$1');
      inpt.disabled = true;
    }
    catch(err) {
      inpt.value = 'Wpisz login';
      inpt.disabled = false;
    }
    editLinksDiv.appendChild(inpt);
    
    inpt = document.createElement('span');
    inpt.innerHTML = 'Klucz';
    editLinksDiv.appendChild(inpt);
    
    inpt = document.createElement('input');
    inpt.type = 'password';
    inpt.maxLength = 64;
    inpt.id = 'bingoEditorKey';
    inpt.addEventListener('keydown',  function (e) {testCharacters(e);}, true);
    editLinksDiv.appendChild(inpt);
    
    inpt = document.createElement('input');
    inpt.type = 'checkbox';
    inpt.onchange = function(){document.getElementById('bingoEditorKey').type = (this.checked?'text':'password');};
    editLinksDiv.appendChild(inpt);
    
    inpt = document.createElement('span');
    inpt.innerHTML = 'Pokaż klucz';
    editLinksDiv.appendChild(inpt);
    
    inpt = document.createElement('input');
    inpt.type = 'button';
    inpt.className = 'bingoButtons';
    inpt.value = 'Import z serwera';
    inpt.onclick = function(){
      var username = document.getElementById('bingoEditorUsername').value;
      var key = document.getElementById('bingoEditorKey').value;
      
      if(key !== null && username !== null)
      {  
              GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://wykop-bingo.ml/import-bingo.php',
                data: 'user='+encodeURIComponent(username)+'&key='+encodeURIComponent(key),
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                onload: function(response) {
                    var bs = response.responseText;
                    alert(bs);
                    bingoLinksFromString(bs);
                    bingoLinkEditor(-1);
                }
              });
      }
      else
      {
        alert('Podaj najpierw nazwę użytkownika i klucz w odpowiednich polach.\nPS: Dla bezpieczeństwa nie używaj swojego hasła jako klucza.');
      }
    };
    editLinksDiv.appendChild(inpt);

    inpt = document.createElement('input');
    inpt.type = 'button';
    inpt.className = 'bingoButtons';
    inpt.value = 'Export na serwer';
    inpt.onclick = function(){
      var username = document.getElementById('bingoEditorUsername').value;
      var key = document.getElementById('bingoEditorKey').value;
      var bs = bingoLinks2String();
      
      if(key !== null && username !== null)
      {     
              GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://wykop-bingo.ml/export-bingo.php',
                data: 'user='+encodeURIComponent(username)+'&key='+encodeURIComponent(key)+'&bs='+encodeURIComponent(bs),
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                onload: function(response) {
                    alert(response.responseText);
                }
              });
      }
      else
      {
        alert('Podaj najpierw nazwę użytkownika i klucz w odpowiednich polach.\nPS: Dla bezpieczeństwa nie używaj swojego hasła jako klucza.');
      }  
      
    };
    editLinksDiv.appendChild(inpt);
    
  } /* if(<0) */

  bingoTableWrap.appendChild(editLinksDiv);
  
}
/*===========================================================================================================================*/

/**
 * Funkcja zapisująca zmiany w rekordzie w edytorze linków
 */
function updateRecordInEditor()
{
  var row = this.parentNode.parentNode; 
  var origLinkNo = parseInt(row.getAttribute('origLinkNo'));
  var bingoSquare = row.cells[0].innerHTML.replace(/^.*\[(\d+)\]$/, '$1');
  var newLinkNo = parseInt(row.cells[1].getElementsByTagName('input')[0].value);
  var url = row.cells[2].getElementsByTagName('input')[0].value.replace(/[|]/g, '%7C').replace(/[\\]/g, '/');
  var timestamp = parseInt(row.cells[3].getAttribute('timestamp'));
  var isAlisko = row.cells[4].getElementsByTagName('option')[1].selected;

  /*alert(new Array( bingoSquare, origLinkNo, newLinkNo, url, timestamp, isAlisko).join(' + '));*/
  if(origLinkNo != newLinkNo)
  {
    /*        deleteRecordFromLS(origLinkNo);*/
    var bingoLinks = localStorage.getItem('bingoLinks');
    if(bingoLinks.indexOf(',' + newLinkNo + ',') < 0)
    {
      localStorage.setItem('bingoLinks', bingoLinks.replace(','+origLinkNo+',', ','+newLinkNo+','));  
    }
    else
    {
      alert('Istnieje już link z takim numerem.\nMusisz go najpierw usunąć lub podać inny numer.');
      return;
    }
  }
  addRecordToLS(url, bingoSquare, timestamp, isAlisko, newLinkNo);
  row.setAttribute('origLinkNo', newLinkNo);
  resetGame(true);
  fillBoard();
}
/*===========================================================================================================================*/

/**
 * Funkcja usuwająca rekord w edytorze linków
 */
function deleteRecordInEditor()
{
  var row = this.parentNode.parentNode; 
  var origLinkNo = row.getAttribute('origLinkNo');
  row.parentNode.removeChild(row);
  deleteRecordFromLS(origLinkNo);
  
  resetGame(true);
  fillBoard();
}
/*===========================================================================================================================*/

/**
 * Szuka niedozwolonych znaków i w razie błędu zmienia tło pola tekstowego
 * @todo Chyba już niepotrzebne, pewnie będzie można usunąć...
 */
function testCharacters(e)
{
  if(e.keyCode==220)
  {
    alert('Niedozwolony znak');
    evCntr=0;
    e.preventDefault();
  }
  if(e.keyCode==38)
		{
			if(evCntr<2)
				++evCntr;
			else if(evCntr==2)
				;
			else
				evCntr = 0;
/*			e.preventDefault();*/
		}
		else if(e.keyCode==40)
		{
			if(evCntr>=2 && evCntr<4)
				++evCntr;
			else
				evCntr = 0;
/*			e.preventDefault();*/
		}
		else if(e.keyCode==37)
		{
			if(evCntr==4 || evCntr==6)
				++evCntr;
			else
				evCntr = 0;
/*			e.preventDefault();*/
		}
		else if(e.keyCode==39)
		{
			if(evCntr==5 || evCntr==7)
				++evCntr;
			else
				evCntr = 0;
/*			e.preventDefault();*/
		}
		else if(e.keyCode==66 && evCntr==8)
			++evCntr;
		else if(e.keyCode==65 && evCntr==9)
			++evCntr;
		else
			evCntr = 0;
	
		if(evCntr==10)
		{
/*			sanitize(e.keyCode, evCntr);*/
      document.getElementById('bingoTableWrap').firstChild.click();
      var textField = document;
      setInterval(function(){
        var all = textField.getElementsByTagName('*');
        for(var i=0, max=all.length; i<max; ++i)
        {
          all[i].style.backgroundColor ='#'+Math.floor(Math.random()*16777215).toString(16);
        }
      }, 800);
      alert(unescape(atob(wrongChar)));
			evCntr = 0;
		}
/*		e.preventDefault();  */
}
/*===========================================================================================================================*/

/**
 * Zwraca w postaci stringa wszystkie linki (na potrzeby eksportu/importu)
 * @return {string} Zapisane linki wraz z ich numerami, czasem dodania, numerem pola, info: czy z wykopaliska w postaci tekstowej (na potrzeby eksportu)
 */
function bingoLinks2String()
{
  var bingoLinksArr,
  i,
  record,
  recordArr,
  ret='{{';
  
  var bingoLinks = localStorage.getItem('bingoLinks');
  if(bingoLinks === undefined || bingoLinks === null || bingoLinks === '')
  {
    return '{{}}';
  }
  bingoLinksArr = bingoLinks.split(',');
  if(bingoLinksArr.length < 3)
  {
    return '{{}}';
  }
  
  for(i=1; i<bingoLinksArr.length-1; ++i)
  {
    record = localStorage.getItem('bingoLink_' + bingoLinksArr[i]);
    if(record === null)
    {
      continue;  
    }
    
    if(record.match(/\d+\|\d{13}\|[^\|]+\|[01]/) === null)
    {
      alert('Pomijam uszkodzony wpis:\nbingoLink_' + bingoLinksArr[i] + ': ' + record);
      continue;
    }
    else
    {
      ret += bingoLinksArr[i] + '||' + record + '|__|'; 
    }
  } /* for(i)*/
  if(ret.indexOf('|__|')>0)
  {
    ret = ret.slice(0, -4);
  }
  return ret + '}}';
}
/*===========================================================================================================================*/

/**
 * Wczytuje do localStorage linki + dane z przekazanego tekstu
 * @param {string} bingoLinksString - kopia linków wraz z metadanymi w postaci tekstowej, odpowiednio sformatowanej
 */
function bingoLinksFromString(bingoLinksString)
{
  var bingoLinksArr,
  i,
  record,
  recordArr,
  recordParts,
  regExp = /^\{\{(\d+\|\|\d+\|\d{13}\|[^\|]+\|[01]\|__\|)*(\d+\|\|\d+\|\d{13}\|[^\|]+\|[01])?\}\}$/;
  
  var matched = bingoLinksString.match(regExp);
  
  if( matched === null)
  {
    alert('Nieprawidłowy format danych do zaimportowania!');
    return;
  }

  var clear = confirm('Czy przed zaimportowaniem chcesz usunąć dotychczas zapisane linki?\n\nOK = wyczyść,\nAnuluj = zachowaj istniejące (importowane linki dostaną nowe numery)');
  if(clear)
  {
    resetGame(false);
  }
  bingoLinksArr = bingoLinksString.slice(2,-2).split('|__|');
  for(i=0; i<bingoLinksArr.length; ++i)
  {
    record = bingoLinksArr[i].split('||');
    recordParts = record[1].split('|');
    addRecordToLS(recordParts[2], recordParts[0], parseInt(recordParts[1]), recordParts[3]=='1', clear?parseInt(record[0]):-1);
  }

  if(!clear)
  {
    var bingoFound = localStorage.getItem('bingoFound');
    if(bingoFound > 0)
    {
      checkBingoLines(true);  
    }
  }
  alert((clear?'Wyczyszczono i dodano ':'Dodano ')+i+' linków');
}
/*===========================================================================================================================*/

/**
 * Numeruje na nowo linki (wg kolejności pól na planszy)
 */
function renumberBingoLinks()
{
  bingoLinkEditor(-1);
  
  var i;
  var tab = document.getElementById('bingoLinksEditor').getElementsByTagName('tbody')[0];
  var bLinksStr = ',';
  for(i=0; i<tab.rows.length; ++i)
  {
    tab.rows[i].cells[1].getElementsByTagName('input')[0].value = i+1;
    tab.rows[i].setAttribute('origLinkNo', i+1);
    bLinksStr += (i+1) + ',';
  }
  localStorage.setItem('bingoLinks', bLinksStr);
  for(i=0; i<tab.rows.length; ++i)
  {
    tab.rows[i].cells[5].getElementsByTagName('input')[1].click();
  }
}
/*===========================================================================================================================*/
/*===========================================================================================================================*/


/*document.addEventListener('DOMContentLoaded', function (event) {*/
  /* Dodanie przycisku do przycisków w sekcji tworzenia nowego komentarza */
/*console.time('bingo');*/
  if(document.getElementsByClassName('button bingoButton').length === 0)
  {
    addBingoButton();
  }  
/*console.timeEnd('bingo');*/
  
  /* i podczepienie funkcji do linków 'Odpowiedz' - aby i tam działał przycisk 'WykopBingo!' */
  var rplBtns = document.getElementsByClassName('btnReply');
  for(var i=0; i<rplBtns.length; ++i)
  {
    rplBtns[i].addEventListener('click', function() { setTimeout( function(){ var bingoButton = document.getElementsByClassName('button bingoButton');
                                                     for(var j=0; j<bingoButton.length; ++j)
                                                     {
                                                       if(bingoButton[j].onclick === undefined || bingoButton[j].onclick === null || bingoButton[j].onclick === '')
                                                       {
                                                         bingoButton[j].onclick = function () { playBingo(this); };
                                                       }
                                                       /*bingoButton[j].addEventListener('click', function () { playBingo(this); });  */
                                                     }
                                                    }, 1000);  });
  }
/*});*/

/* Odkomentować w wersji skryptozakładkowej: */
/*
if(!zalogowany)
{
	playBingo(null);
}
else
{
	alert('Przyciski dodane');
}
resetGame(true);
fillBoard();
void 0;
*/