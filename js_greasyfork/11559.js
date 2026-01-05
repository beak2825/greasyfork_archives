// ==UserScript==
// @name        UnMod_Bombi
// @namespace   http://mega.szajb.us/juenizer/unmod/
// @description Advanced Bloodwars MODIFICATIONS
// @include     http://r*.bloodwars.interia.pl/*
// @include     http://r*.bloodwars.net/*
// @include 		http://r*.bloodwars.pl/*
// @include     http://beta.bloodwars.net/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_addStyle
// @version 201703150
// @downloadURL https://update.greasyfork.org/scripts/11559/UnMod_Bombi.user.js
// @updateURL https://update.greasyfork.org/scripts/11559/UnMod_Bombi.meta.js
// ==/UserScript==
var UM_VER = '201703150';
// made by juen @ cdlabel . info
// zapraszam: http://nakoz.org, http://szajb.us, http://cdlabel.info
// 
var conowego = 'Co nowego?\n\n\
201704210: podmienione nazwy z PLN i pieniedzy na Lgo i money dla zagranicznych serwerów, dodatkowo dodalem wrzucanie zaru automatyczne\n\
201703150: zmieniony serwer na szybszy i stabilny dla linkow shoutboxa, bugfix dla czyszczenia i widoku zk bez klanu\n\
201703060: fix podsumowania pln (Viena)\n\
201702020: podsumowanie pln w wyprawach (by Viena)\n\
201702010: mod do raportu karawan od Czapka, usuniecie domyslnych ignorow troli, maxowanie zwinki nad spostem \n\
';
var hajs;
function UNMOD() {
  if (document.getElementsByClassName('komunikat').length) {
    if (document.getElementsByTagName('body') [0].innerHTML.search('anking') > 0) {
      setTimeout(function () {
        location.reload()
      }, 3000);
      return;
    }
  }
  var a = location.search;
  var id = location.host.split('.') [0];
  if (location.host.split('.') [2] == 'net') {
    id = id + 'en';
  }
  var css = document.createElement('style');
  css.type = 'text/css';
  css.innerHTML = '.blink {      animation: blink 1s steps(5, start) infinite;      -webkit-animation: blink 1s steps(5, start) infinite;    }    @keyframes blink {      to {        visibility: hidden;      }    }    @-webkit-keyframes blink {      to {        visibility: hidden;      }    }';
  document.body.appendChild(css);
  function notification(msg) {
    if (GM_getValue(id + 'UM_OP_notify', true)) {
      if (!('Notification' in window)) {
        return;
      } 
      else if (Notification.permission === 'granted') {
        var notification = new Notification('UnMod (' + id + '):', {
          body: msg
        });
      } 
      else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
          if (!('permission' in Notification)) {
            Notification.permission = permission;
          }
          if (permission === 'granted') {
            var notification = new Notification('UnMod (' + id + '):', {
              body: msg
            });
          }
        });
      }
    }
  }
  var scriptCode = new Array(); // this is where we are going to build our new script
  scriptCode.push('var conowego = "' + conowego.split('\n').join('^') + '";');
  scriptCode.push('function notification(msg) {');
  if (GM_getValue(id + 'UM_OP_notify', true)) {
    scriptCode.push('if (!(\'Notification\' in window)) {      return;  }  else if (Notification.permission === \'granted\') {    var notification = new Notification(\'UnMod (' + id + '):\', {body: msg});  }  else {    Notification.requestPermission(function (permission) {      if(!(\'permission\' in Notification)) {        Notification.permission = permission;      }      if (permission === \'granted\') {        var notification = new Notification(\'UnMod (' + id + '):\', {body: msg});      }});  }');
  }
  scriptCode.push('}');
  var script = document.createElement('script'); // create the script element
  script.innerHTML = scriptCode.join('\n'); // add the script code to it
  scriptCode.length = 0; // recover the memory we used to build the script
  document.getElementsByTagName('head') [0].appendChild(script);
  function addevent_rem2(item_id) {
    document.getElementById('uz_' + item_id).addEventListener('click', function () {
      GM_deleteValue(id + 'UM_UZ_' + item_id);
      window.location.reload();
    }, false);
  }
  function addevent_add(item_id, item_name) {
    document.getElementById('UM_UZ_' + item_id).addEventListener('click', function () {
      GM_setValue(id + 'UM_UZ_' + item_id, item_name);
      window.location.reload();
    }, false);
  }
  function addevent_rem(item_id, item_name) {
    document.getElementById('UM_UZ_' + item_id).addEventListener('click', function () {
      GM_deleteValue(id + 'UM_UZ_' + item_id);
      window.location.reload();
    }, false);
  }
  var scriptCode = new Array(); // this is where we are going to build our new script
  scriptCode.push('function onSboxRead(type,msg){');
  scriptCode.push('var msghtml= document.createElement(\'span\'); msghtml.innerHTML= msg; ');
  scriptCode.push('li = msghtml.getElementsByTagName("LI"); for (t = 0; t < li.length; t++) {\ttest = li[t].getElementsByTagName("a")[0].href;\tuid = test.substring(test.indexOf("&")+5,test.indexOf("&")+10);\ttrole = "' + GM_getValue(id + 'UM_trole', '') + '"; trole=trole.split(" ");\tfor (x = 0; x<trole.length;x++) if (uid==parseInt(trole[x])) li[t].style.display="none";}');
  scriptCode.push('$$(\'sbox_\'+type+\'_container\').innerHTML += msghtml.innerHTML;');
  scriptCode.push('scrollSbox(type);');
  scriptCode.push('return true;\t');
  scriptCode.push('}');
  var script = document.createElement('script'); // create the script element
  script.innerHTML = scriptCode.join('\n'); // add the script code to it
  scriptCode.length = 0; // recover the memory we used to build the script
  document.getElementsByTagName('head') [0].appendChild(script);
  if (a == '?a=settings') {
    div = document.getElementsByClassName('hr720') [0];
    opcje = '<br /><br /><span style="color: #fff; text-shadow: 0px -1px 4px white, 0px -2px 10px yellow, 0px -10px 20px #ff8000, 0px -18px 40px red; font: 28px \'BlackJackRegular\'";><b>UnMod</b> ver: ' + UM_VER + ' - <i>simply made by JUEN/gg:1008732</i></span><br><b>Autor robi to za FRAJER, ale powaznie ucieszy sie obdarowaniem kodem premium jako wyraz wdziecznosci ;)</b><BR>';
    opcje += '<iframe scrolling=no src="http://mega.szajb.us/juenizer/unmod/ver.php?ver=' + UM_VER + '" width="90%" style="margin-top: 3px; box-shadow: 10px 10px 5px #888888; border-radius: 20px; " frameborder=0 \t height="33"></iframe><BR><BR>';
    opcje += '<center><table width="90%" style="text-align: left; margin-top: 5px; font-family: \'Lucida Grande\', \'Lucida Sans Unicode\', Helvetica, Arial;">';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_unmodon', true)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_unmodon"> unmod aktywny (można go wyłączyć dla tego konkretnego serwera)</td></tr>';
          /* czapka */
    opcje += '<tr><td><input type="checkbox"';
		if (GM_getValue(id + 'UM_OP_questItemListOn', true)) opcje += ' checked="checked"';
		opcje += ' id="UM_OP_questItemListOn"> pokazywanie tylko podsumowania z wypraw/karawan (by Czapka)</td></tr>';
		opcje += '<tr><td><input type="checkbox"';    
    if (GM_getValue(id + 'UM_OP_noexp', false)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_noexp"> zaznaczaj rezygnacje z doswiadczenia przy exp</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_ark15', false)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_ark15"> załączaj grozę</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
	if(GM_getValue(id + 'UM_OP_ark11', false)) opcje += ' checked="checked"';
	opcje += ' id="UM_OP_ark11"> wrzucaj zar</td></tr>';
	opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_ark6', false)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_ark6"> maxuj zwinke</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_ark13', false)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_ark13"> maxuj sposta</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_ark3', false)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_ark3"> maxuj sile</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_ark7', false)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_ark7"> maxuj cisze krwi</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_ark8', false)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_ark8"> maxuj wyssanie mocy</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_ark5', false)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_ark5"> maxuj krew zycia</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_ark14', false)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_ark14"> maxuj tchnienie</td></tr>';

    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_ark1',  false)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_ark1"> maxuj adonisa</td></tr>';

    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_ark2', false)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_ark2"> maxuj kaligule</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_ark9', false)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_ark9"> maxuj majestat</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_notify', true)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_notify"> wykorzystuj okno notyfikacji jeśli to możliwe</td></tr>';
    opcje += '<tr><td>';
    opcje += 'automatycznie wybierz jednoraz ';
    opcje += '<select id="UM_OP_jednoraz1">';
    opcje += '<option value="0" data-tier="0" >Brak</option>';
    opcje += '<option value="1" data-tier="1" >Krew wilka</option>';
    opcje += '<option value="2" data-tier="1" >Jabłko żelaznego drzewa</option>';
    opcje += '<option value="3" data-tier="1" >Płetwa rekina</option>';
    opcje += '<option value="4" data-tier="1" >Eliksir zmysłów</option>';
    opcje += '<option value="5" data-tier="1" >Święcona woda</option>';
    opcje += '<option value="6" data-tier="1" >Łza feniksa</option>';
    opcje += '<option value="7" data-tier="1" >Magiczna pieczęć</option>';
    opcje += '<option value="8" data-tier="1" >Serce nietoperza</option>';
    opcje += '<option value="9" data-tier="1" >Kwiat lotosu</option>';
    opcje += '<option value="10" data-tier="1" >Jad Wielkopchły</option>';
    opcje += '<option value="11" data-tier="1" >Serum oświecenia</option>';
    opcje += '<option value="12" data-tier="1" >Wywar z czarnego kota</option>';
    opcje += '<option value="13" data-tier="1" >Węgiel</option>';
    opcje += '<option value="14" data-tier="1" >Sierść kreta</option>';
    opcje += '<option value="15" data-tier="1" >Saletra</option>';
    opcje += '<option value="46" data-tier="1" >Sok z żuka</option>';
    opcje += '<option disabled="disabled" value=""> </option>';
    opcje += '<option value="16" data-tier="2" >Esencja młodości</option>';
    opcje += '<option value="17" data-tier="2" >Paznokieć trolla</option>';
    opcje += '<option value="18" data-tier="2" >Wilcza jagoda</option>';
    opcje += '<option value="19" data-tier="2" >Oko kota</option>';
    opcje += '<option value="20" data-tier="2" >Absynt</option>';
    opcje += '<option value="21" data-tier="2" >Łuski salamandry</option>';
    opcje += '<option value="22" data-tier="2" >Woda źródlana</option>';
    opcje += '<option value="23" data-tier="2" >Kość męczennika</option>';
    opcje += '<option value="24" data-tier="2" >Napój miłosny</option>';
    opcje += '<option value="25" data-tier="2" >Jad skorpiona</option>';
    opcje += '<option value="26" data-tier="2" >Korzeń mandragory</option>';
    opcje += '<option value="27" data-tier="2" >Gwiezdny pył</option>';
    opcje += '<option value="28" data-tier="2" >Fiolka kwasu</option>';
    opcje += '<option value="29" data-tier="2" >Siarka</option>';
    opcje += '<option value="30" data-tier="2" >Czarny diament</option>';
    opcje += '<option value="47" data-tier="2" >Oko topielca</option>';
    opcje += '<option disabled="disabled" value=""> </option>';
    opcje += '<option value="31" data-tier="3" >Boska łza</option>';
    opcje += '<option value="32" data-tier="3" >Ząb ghula</option>';
    opcje += '<option value="33" data-tier="3" >Wywar z koralowca</option>';
    opcje += '<option value="34" data-tier="3" >Serce proroka</option>';
    opcje += '<option value="35" data-tier="3" >Pazur bazyliszka</option>';
    opcje += '<option value="36" data-tier="3" >Łuski demona</option>';
    opcje += '<option value="37" data-tier="3" >Skrzydła chrząszcza</option>';
    opcje += '<option value="38" data-tier="3" >Maska gargulca</option>';
    opcje += '<option value="39" data-tier="3" >Sok z modliszki</option>';
    opcje += '<option value="40" data-tier="3" >Oddech smoka</option>';
    opcje += '<option value="41" data-tier="3" >Ząb wiedźmy</option>';
    opcje += '<option value="42" data-tier="3" >Grimoire</option>';
    opcje += '<option value="43" data-tier="3" >Czarna żółć</option>';
    opcje += '<option value="44" data-tier="3" >Palec kowala</option>';
    opcje += '<option value="45" data-tier="3" >Kwiat bzu</option>';
    opcje += '<option value="48" data-tier="3" >Ogień z serca ziemi</option>';
    opcje += '</select>';
    opcje += '</td></tr>';
    opcje += '<tr><td>';
    opcje += 'automatycznie wybierz jednoraz (jesli nie stac na powyzszy) ';
    opcje += '<select id="UM_OP_jednoraz2">';
    opcje += '<option value="0" data-tier="0" >Brak</option>';
    opcje += '<option value="1" data-tier="1" >Krew wilka</option>';
    opcje += '<option value="2" data-tier="1" >Jabłko żelaznego drzewa</option>';
    opcje += '<option value="3" data-tier="1" >Płetwa rekina</option>';
    opcje += '<option value="4" data-tier="1" >Eliksir zmysłów</option>';
    opcje += '<option value="5" data-tier="1" >Święcona woda</option>';
    opcje += '<option value="6" data-tier="1" >Łza feniksa</option>';
    opcje += '<option value="7" data-tier="1" >Magiczna pieczęć</option>';
    opcje += '<option value="8" data-tier="1" >Serce nietoperza</option>';
    opcje += '<option value="9" data-tier="1" >Kwiat lotosu</option>';
    opcje += '<option value="10" data-tier="1" >Jad Wielkopchły</option>';
    opcje += '<option value="11" data-tier="1" >Serum oświecenia</option>';
    opcje += '<option value="12" data-tier="1" >Wywar z czarnego kota</option>';
    opcje += '<option value="13" data-tier="1" >Węgiel</option>';
    opcje += '<option value="14" data-tier="1" >Sierść kreta</option>';
    opcje += '<option value="15" data-tier="1" >Saletra</option>';
    opcje += '<option value="46" data-tier="1" >Sok z żuka</option>';
    opcje += '<option disabled="disabled" value=""> </option>';
    opcje += '<option value="16" data-tier="2" >Esencja młodości</option>';
    opcje += '<option value="17" data-tier="2" >Paznokieć trolla</option>';
    opcje += '<option value="18" data-tier="2" >Wilcza jagoda</option>';
    opcje += '<option value="19" data-tier="2" >Oko kota</option>';
    opcje += '<option value="20" data-tier="2" >Absynt</option>';
    opcje += '<option value="21" data-tier="2" >Łuski salamandry</option>';
    opcje += '<option value="22" data-tier="2" >Woda źródlana</option>';
    opcje += '<option value="23" data-tier="2" >Kość męczennika</option>';
    opcje += '<option value="24" data-tier="2" >Napój miłosny</option>';
    opcje += '<option value="25" data-tier="2" >Jad skorpiona</option>';
    opcje += '<option value="26" data-tier="2" >Korzeń mandragory</option>';
    opcje += '<option value="27" data-tier="2" >Gwiezdny pył</option>';
    opcje += '<option value="28" data-tier="2" >Fiolka kwasu</option>';
    opcje += '<option value="29" data-tier="2" >Siarka</option>';
    opcje += '<option value="30" data-tier="2" >Czarny diament</option>';
    opcje += '<option value="47" data-tier="2" >Oko topielca</option>';
    opcje += '<option disabled="disabled" value=""> </option>';
    opcje += '<option value="31" data-tier="3" >Boska łza</option>';
    opcje += '<option value="32" data-tier="3" >Ząb ghula</option>';
    opcje += '<option value="33" data-tier="3" >Wywar z koralowca</option>';
    opcje += '<option value="34" data-tier="3" >Serce proroka</option>';
    opcje += '<option value="35" data-tier="3" >Pazur bazyliszka</option>';
    opcje += '<option value="36" data-tier="3" >Łuski demona</option>';
    opcje += '<option value="37" data-tier="3" >Skrzydła chrząszcza</option>';
    opcje += '<option value="38" data-tier="3" >Maska gargulca</option>';
    opcje += '<option value="39" data-tier="3" >Sok z modliszki</option>';
    opcje += '<option value="40" data-tier="3" >Oddech smoka</option>';
    opcje += '<option value="41" data-tier="3" >Ząb wiedźmy</option>';
    opcje += '<option value="42" data-tier="3" >Grimoire</option>';
    opcje += '<option value="43" data-tier="3" >Czarna żółć</option>';
    opcje += '<option value="44" data-tier="3" >Palec kowala</option>';
    opcje += '<option value="45" data-tier="3" >Kwiat bzu</option>';
    opcje += '<option value="48" data-tier="3" >Ogień z serca ziemi</option>';
    opcje += '</select>';
    opcje += '</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_epickie', true)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_epickie"> podświetlaj epickie przedmioty w zbrojowni <input type="text" id="UM_kolorepik" value="' + GM_getValue(id + 'UM_kolorepik', 'blue') + '"></td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_legendarne', true)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_legendarne"> podświetlaj legendarne przedmioty w zbrojowni <input type="text" id="UM_kolorlegenda" value="' + GM_getValue(id + 'UM_kolorlegenda', 'green') + '"></td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_mysort', true)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_mysort"> sortuj stronę rankingu, na której się znajduję wg. dostępności ataku</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    
    
    
    if (GM_getValue(id + 'UM_OP_shop1', true)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_shop1"> wyświetlaj od razu informacje o właściwościach jednorazów</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_ukryj', true)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_ukryj"> ukrywaj publiczny opis klanu, w którym się znajdujesz</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_ukryj2', true)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_ukryj2"> ukrywaj prywatny opis klanu, w którym się znajdujesz</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_youtube', true)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_youtube"> zamieniaj linki youtube w shoutboxie na playera oraz wyswietlaj obrazki</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_mysort1', true)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_mysort1"> sortuj pierwszą stronę rankingu wg. dostępności ataku</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_mysort2', true)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_mysort2"> sortuj drugą stronę rankingu wg. dostępności ataku</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_mysort3', false)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_mysort3"> sortuj wszystkie strony rankingu</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_taximax', true)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_taximax"> auto taxi max <select id="UM_OP_taxilev">';
    for (i = 1; i <= 5; i++) {
      if (GM_getValue(id + 'UM_OP_taxilev', 5) == i) {
        opcje += '<option selected value' + i + '>' + i + '</option>';
      } else {
        opcje += '<option value' + i + '>' + i + '</option>';
      }
    }
    opcje += '</select></td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_fastzk', true)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_fastzk"> szybkie klikanie przedmiotów w zbrojowni</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_wyparch', true)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_wyparch"> anonimowe zbieranie statystyk z wypraw - <a target="_new" href="http://mega.szajb.us/juenizer/unmod/">http://mega.szajb.us/juenizer/unmod/</a></td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_shoutboxclan', false)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_shoutboxclan"> automatycznie otwieraj okno chatu klanowego & przeźroczystość</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_linkluck', true)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_linkluck"> pokazuj odnośnik do zapisów na lucka w menu bw</td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_donesound', false)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_donesound"> odgrywaj dźwięk po zakończonej wyprawie/ataku/szpiegowaniu <input type="text" id="UM_urlsound" value="' + GM_getValue(id + 'UM_urlsound', 'http://soundimpress.pl/audio/download/103/soundimpress.pl_click_sfx_synth_a01.mp3') + '"></td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_clansound', true)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_clansound"> odgrywaj dźwięk nowej wiadomości na sb klanowym <input type="text" id="UM_urlclansound" value="' + GM_getValue(id + 'UM_urlclansound', 'http://www.sounds4email.com/wav/hex4.mp3') + '"></td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_globalsound', true)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_globalsound"> odgrywaj dźwięk nowej wiadomości na sb globalnym <input type="text" id="UM_urlglobalsound" value="' + GM_getValue(id + 'UM_urlglobalsound', 'http://www.sounds4email.com/wav/hex4.mp3') + '"></td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_zkkrew', true)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_zkkrew"> wyszczególniaj przedmioty do krwi w zbrojowni</td></tr>';
    opcje += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    opcje += '(po kliknięciu CZYŚĆ obok SPRZEDAJ) czyszczenie najniższej półki do (PLN): <input type="text" id="UM_zkclean" value="' + GM_getValue(id + 'UM_zkclean', '2000') + '"></td></tr>';
    opcje += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    opcje += 'BLOKUJ TROLI NA SB (podaj id, lub parę oddzielając spacjami): <input type="text" id="UM_trole" value="' + GM_getValue(id + 'UM_trole', '') + '"></td></tr>';
    
    
    opcje += '<tr><td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    opcje += 'DEBUG (zostaw puste do prawidlowego dzialania!): <input type="text" id="UM_pass" value="' + GM_getValue(id + 'UM_pass', '') + '"></td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_spiszk', true)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_spiszk"> numer zbrojowni klanowej wygenerowany przez http://zk.nakoz.org: <input type="text" id="UM_zk" value="' + GM_getValue(id + 'UM_zk', '') + '"></td></tr>';
    opcje += '<tr><td><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_alarm', false)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_alarm"> alarm o godzinie: ';
    opcje += '<select id="UM_OP_alarm_h"><option value="12">12</option><option value="13">13</option><option value="14">14</option><option value="15">15</option><option value="16">16</option><option value="17">17</option><option value="18">18</option><option value="19">19</option><option value="20">20</option><option value="21">21</option><option value="22">22</option><option value="23">23</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option><option value="11">11</option></select>';
    opcje += '&nbsp;:&nbsp;<select id="UM_OP_alarm_m">';
    for (i = 0; i < 60; i++) {
      if (i < 10) i2 = '0' + i;
       else i2 = i;
      opcje += '<option value="' + i + '">' + i2 + '</option>';
    }
    opcje += '</select> (by alarm się uruchomił musisz mieć zostawioną otwartą stronę z bw)';
    opcje += '</td></tr>';
    opcje += '<tr><td style="text-align: left;">';
    opcje += '<tr><td><br><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_polki', false)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_polki"> ';
    opcje += 'własne nazwy półek: <br><br>';
    opcje += '10:<input type="text" style="width: 100px;" id="UM_OP_polka10" value="' + GM_getValue(id + 'UM_OP_polka10', 'Półka 10') + '">';
    opcje += '&nbsp;9: <input type="text" style="width: 100px;" id="UM_OP_polka9" value="' + GM_getValue(id + 'UM_OP_polka9', 'Półka 9') + '">';
    opcje += '&nbsp;8: <input type="text" style="width: 100px;" id="UM_OP_polka8" value="' + GM_getValue(id + 'UM_OP_polka8', 'Półka 8') + '">';
    opcje += '&nbsp;7: <input type="text" style="width: 100px;" id="UM_OP_polka7" value="' + GM_getValue(id + 'UM_OP_polka7', 'Półka 7') + '">';
    opcje += '&nbsp;6: <input type="text" style="width: 100px;" id="UM_OP_polka6" value="' + GM_getValue(id + 'UM_OP_polka6', 'Półka 6') + '">';
    opcje += '<br>&nbsp;5: <input type="text" style="width: 100px;" id="UM_OP_polka5" value="' + GM_getValue(id + 'UM_OP_polka5', 'Półka 5') + '">';
    opcje += '&nbsp;4: <input type="text" style="width: 100px;" id="UM_OP_polka4" value="' + GM_getValue(id + 'UM_OP_polka4', 'Półka 4') + '">';
    opcje += '&nbsp;3: <input type="text" style="width: 100px;" id="UM_OP_polka3" value="' + GM_getValue(id + 'UM_OP_polka3', 'Półka 3') + '">';
    opcje += '&nbsp;2: <input type="text" style="width: 100px;" id="UM_OP_polka2" value="' + GM_getValue(id + 'UM_OP_polka2', 'Półka 2') + '">';
    opcje += '&nbsp;1: <input type="text" style="width: 100px;" id="UM_OP_polka1" value="' + GM_getValue(id + 'UM_OP_polka1', 'Półka 1') + '">';
    opcje += '</td></tr>';
    opcje += '<tr><td style="text-align: left;">';
    opcje += '<tr><td><BR><input type="checkbox"';
    if (GM_getValue(id + 'UM_OP_skroty', true)) opcje += ' checked="checked"';
    opcje += ' id="UM_OP_skroty"> skróty klawiszowe - klawisz ALT oraz liczba:<br><br>';
    opcje += '&nbsp;1: <input type="text" style="width: 100px;" id="UM_OP_key_1" value="' + GM_getValue(id + 'UM_OP_key_1', 'msg') + '">';
    opcje += '&nbsp;2: <input type="text" style="width: 100px;" id="UM_OP_key_2" value="' + GM_getValue(id + 'UM_OP_key_2', 'aliance') + '">';
    opcje += '&nbsp;3: <input type="text" style="width: 100px;" id="UM_OP_key_3" value="' + GM_getValue(id + 'UM_OP_key_3', 'equip') + '">';
    opcje += '&nbsp;4: <input type="text" style="width: 100px;" id="UM_OP_key_4" value="' + GM_getValue(id + 'UM_OP_key_4', 'ambush') + '">';
    opcje += '&nbsp;5: <input type="text" style="width: 100px;" id="UM_OP_key_5" value="' + GM_getValue(id + 'UM_OP_key_5', 'quest') + '">';
    opcje += '<br>&nbsp;6: <input type="text" style="width: 100px;" id="UM_OP_key_6" value="' + GM_getValue(id + 'UM_OP_key_6', 'cevent') + '">';
    opcje += '&nbsp;7: <input type="text" style="width: 100px;" id="UM_OP_key_7" value="' + GM_getValue(id + 'UM_OP_key_7', 'swr') + '">';
    opcje += '&nbsp;8: <input type="text" style="width: 100px;" id="UM_OP_key_8" value="' + GM_getValue(id + 'UM_OP_key_8', 'rank') + '">';
    opcje += '&nbsp;9: <input type="text" style="width: 100px;" id="UM_OP_key_9" value="' + GM_getValue(id + 'UM_OP_key_9', 'townview') + '">';
    opcje += '&nbsp;0: <input type="text" style="width: 100px;" id="UM_OP_key_0" value="' + GM_getValue(id + 'UM_OP_key_0', 'auction') + '">';
    opcje += '</td></tr>';
    opcje += '<tr><td style=""><BR><b><center>Polecam!</center><BR><span style="">';
    opcje += '- pomysły i dyskusje o unmod: <a target="_new" href="http://forum.bloodwars.interia.pl/thread.php?threadid=1187656">http://forum.bloodwars.interia.pl/thread.php?threadid=1187656</a><br>';
    opcje += '- szybka zbrojownia dla całego klanu: <a target="_new" href="http://forum.bloodwars.interia.pl/thread.php?threadid=841787">http://forum.bloodwars.interia.pl/thread.php?threadid=841787</a><br>';
    opcje += '- generator sygnatur bw on-line: <a target="_new" href="http://forum.bloodwars.interia.pl/thread.php?threadid=949855">http://forum.bloodwars.interia.pl/thread.php?threadid=949855</a><br>';
    opcje += '- odstresuj się dobrym dropem: <a target="_new" href="http://forum.bloodwars.interia.pl/thread.php?threadid=926110">http://forum.bloodwars.interia.pl/thread.php?threadid=926110</a><br>';
    opcje += '- automatyczny ranking r12: <a target="_new" href="http://forum.bloodwars.interia.pl/thread.php?threadid=1068988">http://forum.bloodwars.interia.pl/thread.php?threadid=1068988</a><br>';
    opcje += '- wyciągnij spis budynków: <a target="_new" href="http://mega.szajb.us/juen/budynki.php">http://mega.szajb.us/juen/budynki.php</a>';
    opcje += '</span></td></tr>';
    opcje += '</table></center><BR><BR>';
    div.innerHTML += opcje;
    var scriptCode = new Array();
    if (GM_getValue(id + 'UM_OP_jednoraz1', 0)) {
      scriptCode.push('document.getElementById("UM_OP_jednoraz1").value=' + GM_getValue(id + 'UM_OP_jednoraz1', 0));
    }
    if (GM_getValue(id + 'UM_OP_jednoraz2', 0)) {
      scriptCode.push('document.getElementById("UM_OP_jednoraz2").value=' + GM_getValue(id + 'UM_OP_jednoraz2', 0));
    }
    var script = document.createElement('script');
    script.innerHTML = scriptCode.join('\n');
    scriptCode.length = 0;
    document.getElementsByTagName('head') [0].appendChild(script);
    wyb = GM_getValue(id + 'UM_OP_alarm_h', 0);
    if (parseInt(wyb) >= 12) wyb -= 12;
     else wyb = parseInt(wyb) + 12;
    document.getElementById('UM_OP_alarm_h').options[wyb].selected = true;
    wyb = GM_getValue(id + 'UM_OP_alarm_m', 0);
    document.getElementById('UM_OP_alarm_m').options[wyb].selected = true;
    document.getElementById('content-mid').style.minHeight = '2000px';
    document.getElementById('UM_OP_noexp').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_noexp', this.checked);
    }, false);
    document.getElementById('UM_OP_ark15').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_ark15', this.checked);
    }, false);
    document.getElementById('UM_OP_ark14').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_ark14', this.checked);
    }, false);
    document.getElementById('UM_OP_ark6').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_ark6', this.checked);
    }, false);
    document.getElementById('UM_OP_ark13').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_ark13', this.checked);
    }, false);
    document.getElementById('UM_OP_ark3').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_ark3', this.checked);
    }, false);
    document.getElementById('UM_OP_ark5').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_ark5', this.checked);
    }, false);
    document.getElementById('UM_OP_ark7').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_ark7', this.checked);
    }, false);
    document.getElementById('UM_OP_ark8').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_ark8', this.checked);
    }, false);
    document.getElementById('UM_OP_ark9').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_ark9', this.checked);
    }, false);
    document.getElementById('UM_OP_ark2').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_ark2', this.checked);
    }, false);
    document.getElementById('UM_OP_ark1').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_ark1', this.checked);
    }, false);
    document.getElementById('UM_OP_epickie').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_epickie', this.checked);
    }, false);
    document.getElementById('UM_OP_legendarne').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_legendarne', this.checked);
    }, false);
    document.getElementById('UM_OP_youtube').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_youtube', this.checked);
    }, false);
    document.getElementById('UM_OP_shoutboxclan').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_shoutboxclan', this.checked);
    }, false);
    document.getElementById('UM_OP_donesound').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_donesound', this.checked);
    }, false);
    document.getElementById('UM_OP_clansound').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_clansound', this.checked);
    }, false);
    document.getElementById('UM_OP_globalsound').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_globalsound', this.checked);
    }, false);
    document.getElementById('UM_OP_unmodon').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_unmodon', this.checked);
    }, false);
              /* czapka */
		document.getElementById('UM_OP_questItemListOn').addEventListener('click', function () {
		  GM_setValue(id + 'UM_OP_questItemListOn', this.checked);
		}, false);

    document.getElementById('UM_OP_shop1').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_shop1', this.checked);
    }, false);
    document.getElementById('UM_OP_ukryj').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_ukryj', this.checked);
    }, false);
    document.getElementById('UM_OP_ukryj2').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_ukryj2', this.checked);
    }, false);
    document.getElementById('UM_OP_zkkrew').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_zkkrew', this.checked);
    }, false);
    document.getElementById('UM_OP_notify').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_notify', this.checked);
    }, false);
    document.getElementById('UM_OP_mysort').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_mysort', this.checked);
    }, false);
    document.getElementById('UM_OP_mysort1').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_mysort1', this.checked);
    }, false);
    document.getElementById('UM_OP_mysort2').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_mysort2', this.checked);
    }, false);
    document.getElementById('UM_OP_mysort3').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_mysort3', this.checked);
    }, false);
    document.getElementById('UM_OP_taximax').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_taximax', this.checked);
    }, false);
    document.getElementById('UM_OP_fastzk').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_fastzk', this.checked);
    }, false);
    document.getElementById('UM_OP_alarm').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_alarm', this.checked);
    }, false);
    document.getElementById('UM_OP_alarm_h').addEventListener('change', function () {
      GM_setValue(id + 'UM_OP_alarm_h', this.value);
    }, false);
    document.getElementById('UM_OP_alarm_m').addEventListener('change', function () {
      GM_setValue(id + 'UM_OP_alarm_m', this.value);
    }, false);
    document.getElementById('UM_OP_jednoraz1').addEventListener('change', function () {
      GM_setValue(id + 'UM_OP_jednoraz1tier', this.options[this.selectedIndex].getAttribute('data-tier'));
      GM_setValue(id + 'UM_OP_jednoraz1', this.value);
    }, false);
    document.getElementById('UM_OP_jednoraz2').addEventListener('change', function () {
      GM_setValue(id + 'UM_OP_jednoraz2tier', this.options[this.selectedIndex].getAttribute('data-tier'));
      GM_setValue(id + 'UM_OP_jednoraz2', this.value);
    }, false);
    document.getElementById('UM_OP_polki').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_polki', this.checked);
    }, false);
    document.getElementById('UM_OP_skroty').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_skroty', this.checked);
    }, false);
    document.getElementById('UM_OP_wyparch').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_wyparch', this.checked);
    }, false);
    document.getElementById('UM_OP_spiszk').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_spiszk', this.checked);
    }, false);
    document.getElementById('UM_OP_linkluck').addEventListener('click', function () {
      GM_setValue(id + 'UM_OP_linkluck', this.checked);
    }, false);
    document.getElementById('UM_OP_taxilev').addEventListener('change', function () {
      GM_setValue(id + 'UM_OP_taxilev', this.value);
    }, false);
    document.getElementById('UM_OP_key_0').addEventListener('change', function () {
      GM_setValue(id + 'UM_OP_key_0', this.value);
    }, false);
    document.getElementById('UM_OP_key_1').addEventListener('change', function () {
      GM_setValue(id + 'UM_OP_key_1', this.value);
    }, false);
    document.getElementById('UM_OP_key_2').addEventListener('change', function () {
      GM_setValue(id + 'UM_OP_key_2', this.value);
    }, false);
    document.getElementById('UM_OP_key_3').addEventListener('change', function () {
      GM_setValue(id + 'UM_OP_key_3', this.value);
    }, false);
    document.getElementById('UM_OP_key_4').addEventListener('change', function () {
      GM_setValue(id + 'UM_OP_key_4', this.value);
    }, false);
    document.getElementById('UM_OP_key_5').addEventListener('change', function () {
      GM_setValue(id + 'UM_OP_key_5', this.value);
    }, false);
    document.getElementById('UM_OP_key_6').addEventListener('change', function () {
      GM_setValue(id + 'UM_OP_key_6', this.value);
    }, false);
    document.getElementById('UM_OP_key_7').addEventListener('change', function () {
      GM_setValue(id + 'UM_OP_key_7', this.value);
    }, false);
    document.getElementById('UM_OP_key_8').addEventListener('change', function () {
      GM_setValue(id + 'UM_OP_key_8', this.value);
    }, false);
    document.getElementById('UM_OP_key_9').addEventListener('change', function () {
      GM_setValue(id + 'UM_OP_key_9', this.value);
    }, false);
    document.getElementById('UM_OP_key_0').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_OP_key_0', this.value);
    }, false);
    document.getElementById('UM_OP_key_1').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_OP_key_1', this.value);
    }, false);
    document.getElementById('UM_OP_key_2').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_OP_key_2', this.value);
    }, false);
    document.getElementById('UM_OP_key_3').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_OP_key_3', this.value);
    }, false);
    document.getElementById('UM_OP_key_4').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_OP_key_4', this.value);
    }, false);
    document.getElementById('UM_OP_key_5').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_OP_key_5', this.value);
    }, false);
    document.getElementById('UM_OP_key_6').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_OP_key_6', this.value);
    }, false);
    document.getElementById('UM_OP_key_7').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_OP_key_7', this.value);
    }, false);
    document.getElementById('UM_OP_key_8').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_OP_key_8', this.value);
    }, false);
    document.getElementById('UM_OP_key_9').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_OP_key_9', this.value);
    }, false);
    document.getElementById('UM_OP_polka1').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_OP_polka1', this.value);
    }, false);
    document.getElementById('UM_OP_polka2').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_OP_polka2', this.value);
    }, false);
    document.getElementById('UM_OP_polka3').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_OP_polka3', this.value);
    }, false);
    document.getElementById('UM_OP_polka4').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_OP_polka4', this.value);
    }, false);
    document.getElementById('UM_OP_polka5').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_OP_polka5', this.value);
    }, false);
    document.getElementById('UM_OP_polka6').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_OP_polka6', this.value);
    }, false);
    document.getElementById('UM_OP_polka7').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_OP_polka7', this.value);
    }, false);
    document.getElementById('UM_OP_polka8').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_OP_polka8', this.value);
    }, false);
    document.getElementById('UM_OP_polka9').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_OP_polka9', this.value);
    }, false);
    document.getElementById('UM_OP_polka10').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_OP_polka10', this.value);
    }, false);
    document.getElementById('UM_urlsound').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_urlsound', this.value);
    }, false);
    document.getElementById('UM_urlsound').addEventListener('change', function () {
      GM_setValue(id + 'UM_urlsound', this.value);
    }, false);
    document.getElementById('UM_urlclansound').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_urlclansound', this.value);
    }, false);
    document.getElementById('UM_urlclansound').addEventListener('change', function () {
      GM_setValue(id + 'UM_urlclansound', this.value);
    }, false);
    document.getElementById('UM_urlglobalsound').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_urlglobalsound', this.value);
    }, false);
    document.getElementById('UM_urlglobalsound').addEventListener('change', function () {
      GM_setValue(id + 'UM_urlglobalsound', this.value);
    }, false);
    document.getElementById('UM_kolorepik').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_kolorepik', this.value);
    }, false);
    document.getElementById('UM_kolorlegenda').addEventListener('change', function () {
      GM_setValue(id + 'UM_kolorlegenda', this.value);
    }, false);
    document.getElementById('UM_zkclean').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_zkclean', this.value);
    }, false);
    document.getElementById('UM_trole').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_trole', this.value);
    }, false);
    document.getElementById('UM_pass').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_pass', this.value);
    }, false);
    document.getElementById('UM_zk').addEventListener('keyup', function () {
      GM_setValue(id + 'UM_zk', this.value);
    }, false);
    document.getElementById('UM_zk').addEventListener('change', function () {
      GM_setValue(id + 'UM_zk', this.value);
    }, false);
  }
  if (GM_getValue(id + 'UM_OP_unmodon', true)) {
    if (a.search('&unmod=true') != - 1) {
      function removeByClassName(id) {
        e = document.getElementsByClassName(id);
        if (e.length) {
          for (i = e.length - 1; i >= 0; i--) {
            var o = (elem = document.getElementsByClassName(id) [i]).parentNode.removeChild(elem);
          }
        }
      }
      function removeById(id) {
        return (elem = document.getElementById(id)).parentNode.removeChild(elem);
      }
      removeByClassName('itemstacked1');
      removeByClassName('itemstacked2');
      removeByClassName('hr620');
      removeByClassName('logo');
      removeByClassName('menu');
      removeByClassName('gameStats');
      removeByClassName('version');
      removeByClassName('top');
      removeByClassName('time-effects');
      removeById('sbox_icons_clan');
      removeById('sbox_icons_global');
      removeById('interiaFooter');
      removeByClassName('remark');
      removeByClassName('hr720');
      removeByClassName('copyright');
      removeByClassName('top-options');
      removeByClassName('content-bottom');
      e = document.getElementsByTagName('a');
      if (e.length) {
        for (i = 0; i < e.length; i++) {
          e[i].href = e[i].href + '&unmod=true';
        }
      }
      e = document.getElementsByClassName('main') [0];
      //		e.style.width="330px"
      e.getElementsByTagName('div') [0].style.width = '100%';
      e = document.getElementsByClassName('textarea');
      if (e.length) {
        e[0].style.width = '200px';
        e[0].style.height = '100px';
      }
      e = document.getElementById('topic');
      if (e) {
        e.style.width = '200px';
        e = document.getElementsByTagName('form') [0];
        e.action = e.action + '&unmod=true'
      }
      e = document.getElementById('content-mid');
      e.style.width = '320px';
      e.style.height = '100%';
      
      

    if (a.search('townshop') == - 1) {
      
      e.innerHTML = '<center><a href=\'?a=msg&unmod=true\'><button id=\'inboxreload\' style=\'margin-top:5px;\'>PRZEŁADUJ SKRZYNKĘ</button></a></center><BR/>' + e.innerHTML;
    } else {
       var o = (elem = document.getElementsByTagName('FIELDSET')[0]).parentNode.removeChild(elem);
       var o = (elem = document.getElementsByTagName('FIELDSET')[1]).parentNode.removeChild(elem);
       var o = (elem = document.getElementsByTagName('FIELDSET')[1]).parentNode.removeChild(elem);
       var o = (elem = document.getElementsByTagName('FIELDSET')[1]).parentNode.removeChild(elem);
       var o = (elem = document.getElementsByTagName('FIELDSET')[1]).parentNode.removeChild(elem);
       var o = (elem = document.getElementsByTagName('FIELDSET')[1]).parentNode.removeChild(elem);
       var o = (elem = document.getElementsByTagName('FIELDSET')[1]).parentNode.removeChild(elem);
       var o = (elem = document.getElementsByTagName('FIELDSET')[1]).parentNode.removeChild(elem);
       var o = (elem = document.getElementsByTagName('FIELDSET')[1]).parentNode.removeChild(elem);
       var o = (elem = document.getElementsByTagName('FIELDSET')[1]).parentNode.removeChild(elem);
       var o = (elem = document.getElementsByTagName('FIELDSET')[1]).parentNode.removeChild(elem);
       var o = (elem = document.getElementsByTagName('FIELDSET')[1]).parentNode.removeChild(elem);
    }
      
      GM_addStyle('                                         div.content-mid {                                       padding-left: 30px !important;    padding-right: 0px !important;    padding-top: 40px;    position: relative;    z-index: 1;}'
      );
      e = document.getElementsByClassName('content') [0];
      e.style.width = '320px';
      e.style.top = '-30px';
      e.style.left = '-30px';
      e = document.getElementsByClassName('msg-content');
      if (e.length) {
        e[0].style.width = '90%';
      }
      document.getElementsByTagName('body') [0].innerHTML = document.getElementsByTagName('body') [0].innerHTML.replace(/do=delall/g, 'do=dellall&unmod=true').replace('Data wysłania', 'Data')
      itemS = document.getElementsByClassName('item-link');
      for (i = 0; i < itemS.length; i++) {
        if (GM_getValue(id + 'UM_OP_legendarne', true)) {
          itemS[i].innerHTML = itemS[i].innerHTML.replace('Legendarny', '<span style="text-shadow: 2px 2px 2px black;color: ' + GM_getValue(id + 'UM_kolorlegenda', 'green') + '";>Legendarny');
          itemS[i].innerHTML = itemS[i].innerHTML.replace('Legendarna', '<span style="text-shadow: 2px 2px 2px black;color: ' + GM_getValue(id + 'UM_kolorlegenda', 'green') + '";>Legendarna');
          itemS[i].innerHTML = itemS[i].innerHTML.replace('Legendarne', '<span style="text-shadow: 2px 2px 2px black;color: ' + GM_getValue(id + 'UM_kolorlegenda', 'green') + '";>Legendarne');
        }
        if (GM_getValue(id + 'UM_OP_epickie', true)) {
          itemS[i].innerHTML = itemS[i].innerHTML.replace('Epickie', '<span style="text-shadow: 2px 2px 2px black;color: ' + GM_getValue(id + 'UM_kolorepik', 'blue') + '";>Epickie');
          itemS[i].innerHTML = itemS[i].innerHTML.replace('Epicki', '<span style="text-shadow: 2px 2px 2px black;color: ' + GM_getValue(id + 'UM_kolorepik', 'blue') + '";>Epicki');
          itemS[i].innerHTML = itemS[i].innerHTML.replace('Epicka', '<span style="text-shadow: 2px 2px 2px black;color: ' + GM_getValue(id + 'UM_kolorepik', 'blue') + '";>Epicka');
        }
      }
      
      
    if (a.search('msg&do=view') != - 1) {
      unsafeWindow.scrollTo(0,document.body.scrollHeight);
      
    }
    } else {
      
      		
            /* czapka */
            var isQuest = function() {
                var msgContent = document.getElementsByClassName('msg-content msg-quest');
              if (msgContent.length == 0) { return false; }
                msgContent = msgContent[0];
                return msgContent.innerText.search("Próba") > -1 || msgContent.innerText.search("Test") > -1 || msgContent.innerText.search("Sprawdzian") > -1;
            }
            
		if (GM_getValue(id + 'UM_OP_questItemListOn', true) && a.search('msg&do=view') != - 1 && isQuest()) {
				var itemsCol = document.getElementsByClassName('item-link item-caption');
  if(itemsCol.length) {
        
        var itemsArr = [].slice.call( itemsCol );
				
				/* sortowanie */
				var sorted = [];
				var epic = [];
				var legdsk = [];
				var legdbr = [];
				var leg = [];
				var dsk = [];
				var dbr = [];
				var nrm = [];
                var rubbish = 0;
				for(var i = 0; i < itemsArr.length; i++) {
          
          
                    var rubbishRegexp = /.*\>([0-9\s]+) PLN.*/g;
                    var match = rubbishRegexp.exec(itemsArr[i].getAttribute('onclick'));
                    if (match !== null){
                        rubbish += Number(match[1].replace(" ", ""));
                    }
          
					if (itemsArr[i].innerText.search("Epick") > -1) { epic.push(itemsArr[i]); }
					else if (itemsArr[i].innerText.search("Legendarn") > -1) {
                        if      (itemsArr[i].innerText.search("Dosk") > -1) { legdsk.push(itemsArr[i]); }
                        else if (itemsArr[i].innerText.search("Dobr") > -1) { legdbr.push(itemsArr[i]); }
                        else                                                { leg.push(itemsArr[i]); }
                    } else {
                        if      (itemsArr[i].innerText.search("Dosk") > -1)      { dsk.push(itemsArr[i]); }
                        else if (itemsArr[i].innerText.search("Dobr") > -1)      { dbr.push(itemsArr[i]); }
                        else                                                     { nrm.push(itemsArr[i]); }
                    }
				}
				sorted = sorted.concat(epic).concat(legdsk).concat(legdbr).concat(leg).concat(dsk).concat(dbr).concat(nrm);

                
                if(sorted.length == 0) {
                    msgContent.innerHTML = "<div class=\"enabled\" style=\"margin: 8px;\">Nic nie weszło :(</div>";
                } else {
                    var msgContent = document.getElementsByClassName('msg-content msg-quest')[0];

                    ps = msgContent.getElementsByTagName("p");
                    var exp = 0;
                    var blood = 0;
                    for(var i = 0; i < ps.length; i++) {
                        if(ps[i].innerText.search("Zdoby") > -1) {
                            exp += parseInt(ps[i].getElementsByTagName("b")[0].innerText);
                            blood += parseInt(ps[i].getElementsByTagName("b")[1].innerText);
                        }
                    }
                    
                    msgContent.innerHTML = "<div class=\"enabled\" style=\"margin: 8px;\">W trakcie wypraw(y) zyskano: <b>" + exp.toString() + "</b> pkt. doświadczenia.</div>";
                    msgContent.innerHTML += "<div class=\"enabled\" style=\"margin: 8px;\">W trakcie wypraw(y) zyskano: <b>" + blood.toString() + "</b> l krwi.</div>";
                    if (rubbish > 0){
                        msgContent.innerHTML += "<div class=\"enabled\" style=\"margin: 8px;\">W trakcie wypraw(y) znaleziono przedmioty o wartości: <b>" + rubbish.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + "</b> Lgo</div><br>";
                    }                  
                    msgContent.innerHTML += "<div class=\"enabled\" style=\"margin: 8px;\">W trakcie wypraw(y) znaleziono przedmiot(y):</div>";
                    var node = document.createElement("br");
                    msgContent.appendChild(node);
                    for (var i = sorted.length-1; i >=0 ; i--) {
                        msgContent.appendChild(sorted[i]);

                        var node = document.createElement("br");
                        msgContent.appendChild(node);
                    }
                }
			}
    }
    
      if (a.search('&eqset=') != - 1) {
        if (document.getElementsByTagName('body') [0].innerHTML.search('Operacja nie została wykonana, ponieważ został użyty nieprawidłowy link lub użyto funkcji') != - 1) {
          notification('EQ zostało zmienione!');
          z = window.location + '';
          z = z.replace('akey=', 'akey=' + unsafeWindow.accessKey + '&old=');
          window.location = z;
        }
      }      // mod notki everywhere

      x = document.createElement('span');
      x.id = 'x';
      x.style.display = 'none';
      y = document.createElement('span');
      y.id = 'y';
      y.style.display = 'none';
      document.getElementsByTagName('body') [0].appendChild(x);
      document.getElementsByTagName('body') [0].appendChild(y);
      chmurka = document.createElement('div');
      chmurka.id = 'chmurka';
      chmurka.style.display = 'none';
      chmurka.style.x = '300px';
      chmurka.style.zIndex = '30000';
      chmurka.style.position = 'fixed';
      chmurka.style.borderColor = 'white';
      chmurka.style.borderWidth = '2px';
      chmurka.style.borderStyle = 'solid';
      chmurka.style.padding = '4px';
      chmurka.style.backgroundColor = 'black';
      document.getElementsByTagName('body') [0].appendChild(chmurka);
      var scriptCode = new Array();
      scriptCode.push('\tfunction getMouseXY(e) {');
      scriptCode.push('\t\tdocument.getElementById(\'x\').innerHTML=e.clientX;');
      scriptCode.push('\t\tdocument.getElementById(\'y\').innerHTML=e.clientY+10;');
      scriptCode.push('\t}');
      scriptCode.push('\tdocument.onmousemove = getMouseXY;');
      var script = document.createElement('script');
      script.innerHTML = scriptCode.join('\n');
      scriptCode.length = 0;
      document.getElementsByTagName('head') [0].appendChild(script);
      //mod zapisy na lucka
      menu = document.getElementsByClassName('menu');
      if (menu.length > 11) {
        menu = menu[12];
        if (GM_getValue(id + 'UM_OP_linkluck', true)) menu.innerHTML += '<li class="menu"><a target=_new href="http://www.lil-it.net/bw/" class="menulink">Zapisy ZK</a>';
        if (GM_getValue(id + 'UM_OP_spiszk', true)) {
          menu.innerHTML += '<li class="menu"><a target=_new href="http://zk.nakoz.org/' + GM_getValue(id + 'UM_zk', '61672692') + '" class="menulink">Spis zbrojowni</li>';
        }
      }
      test = document.getElementsByClassName('menulink');
      for (t = 0; t < test.length; t++) {
        if (test[t].innerHTML == 'Live Chat') {
          test[t].href = 'http://webchat.quakenet.org/?channels=bloodwars';
          break;
        }
      }
      if (a == '?a=talizman') {
        cl = document.getElementsByClassName('equip') [0];
        div = cl.getElementsByTagName('div');
        for (x = 0; x < 10; x++) {
          nr = x + 1;
          d = div[x * 2].innerHTML;
          if (d.length > 150) {
            nazwa = d.substring(d.indexOf('CAPTION,') + 9);
            nazwa = nazwa.substring(0, nazwa.indexOf('CAPTION') - 2);
            GM_setValue(id + 'OP_talizman' + nr, nazwa);
          } else {
            GM_setValue(id + 'OP_talizman' + nr, false);
          }
        }
      }
      if (a == '?a=equip') {
        cl = document.getElementsByClassName('equip') [0];
        div = cl.getElementsByTagName('div');
        z = 20;
        if (div.length < 40) {
          z = 10;
        }
        for (x = 0; x < z; x++) {
          nr = x + 1;
          n = 0;
          if (x > 9) {
            n = 1;
          }
          d = div[n + 1 + x * 2].innerHTML;
          if (d.length > 150) {
            nazwa = d.substring(d.indexOf('CAPTION,') + 9);
            nazwa = nazwa.substring(0, nazwa.indexOf('CAPTION') - 2);
            GM_setValue(id + 'OP_equip' + nr, nazwa);
          } else {
            GM_setValue(id + 'OP_equip' + nr, false);
          }
        }
      }
      if (a.substring(0, 8) == '?a=equip') {
        oddaj = document.getElementsByName('armoryPutIn') [0];
if (oddaj) {
        oddaj.style.width = '70%';
        oddaj.style.float = 'left';
        div = document.createElement('div');
        div.id = 'oddajzk';
        div.innerHTML = '<div style="margin: 8px 0px 8px 0px;"><input class="button" type="button" onclick="invertSelect(box[10]); document.getElementsByName(\'armoryPutIn\')[0].click();" value="ODDAJ ZK"  style="float: right; width: 28%;"></div><br style="clear: both;"/>';
        if (oddaj.nextSibling) {
          oddaj.parentNode.insertBefore(div, oddaj.nextSibling);
        } 
        else {
          oddaj.parentNode.appendChild(div);
        }        //		invertSelect(box[10]);
}
		//mod unlimited zk 
        /*
	tid=new Array();
	tidn=0;
	var unlimited="<center><b>NIESKOŃCZONA PÓŁKA :-)</b></center><BR>";


var keys = cloneInto(GM_listValues(), window);
for (var val=0; val < keys.length; val++) {

if (typeof keys[val] !== "undefined")	if (keys[val].search(id+"UM_UZ_")!=-1) {
	
		temp_id = keys[val].replace(id+"UM_UZ_",'');
		 			unlimited+='<div class="item"><table cellspacing="0"><tr><td class="itemdesc itemshop even"><div id="back_'+temp_id+'" align="left" onclick="clk_stock(event, '+temp_id+');"><div align="center"><span class="item-link">'+GM_getValue(keys[val])+'</span></div><table cellspacing="0" cellpadding="0" style="width: 100%; border: 0px;"><tr><td width="18%"><input class="checkbox" type="checkbox" id="itemid_'+temp_id+'" name="itemid['+temp_id+']" onclick="onCheckBoxSelect(this, '+temp_id+', 63900, \''+GM_getValue(keys[val])+'\', $$(\'back_'+temp_id+'\'));" /></td><td width="70%"></td><td></td></tr></table></div></td><td align="right" width="18%"><a href="#" id="uz_'+temp_id+'" style="color:red; font-weight: bold;">-UNL.ZBR</a><br><BR><a class="enabled" href="?eq='+temp_id+'&amp;a=equip">EKWIPUJ</a></td></tr></table></div><script type="text/javascript">box[3]['+temp_id+'] = $$(\'itemid_'+temp_id+'\');</script></div>';

		 			tid[tidn++]=temp_id;
		}
	}

	
	if (tidn>0) {
	var sp1 = document.createElement("div");
	sp1.innerHTML = unlimited;
	var tu = document.getElementsByClassName('stashhdr')[0];
	var parentDiv = tu.parentNode;
	parentDiv.insertBefore(sp1, tu);
	
	for (x in tid) 
		addevent_rem2(tid[x]);
	}
	


	items = document.getElementsByClassName('enabled');
	for (x in items) {
		var it = items[x];
		if (it.href) {
		it = it.href.toString();
			var pos = it.search("equip&eq=");
			if (pos != -1) {
				item_id = it.substring(pos+9,it.length);
							
				test = GM_getValue(id+'UM_UZ_'+item_id, "0");
				var sp1 = document.createElement("a");
				sp1.style.cursor="pointer";
				sp1.style.fontWeight="bold";
				var parentDiv = items[x].parentNode;
				sp1.id='UM_UZ_'+item_id;
				
				div = document.getElementById('back_'+item_id);
				span = div.getElementsByTagName('SPAN')[0];
				item_name = span.innerHTML.replace(' *','');
				if (test=="0") {		
					sp1.innerHTML='+UNL.ZBR<br><br>';		 
					sp1.style.color="green";				
					parentDiv.insertBefore(sp1, items[x]);
					addevent_add(item_id,item_name);
				} else {
					sp1.innerHTML='-UNL.ZBR<br><br>';		 
					sp1.style.color="red";
					parentDiv.insertBefore(sp1, items[x]);
					addevent_rem(item_id,item_name);
				}
			}
		}
	}
*/

        if (GM_getValue(id + 'UM_OP_polki', false)) {
          // mod wlasne nazwy polek
          sel = document.getElementById('newTab');
          options = sel.getElementsByTagName('option');
          options[0].innerHTML = GM_getValue(id + 'UM_OP_polka10', '10');
          options[1].innerHTML = GM_getValue(id + 'UM_OP_polka9', '9');
          options[2].innerHTML = GM_getValue(id + 'UM_OP_polka8', '8');
          options[3].innerHTML = GM_getValue(id + 'UM_OP_polka7', '7');
          options[4].innerHTML = GM_getValue(id + 'UM_OP_polka6', '6');
          options[5].innerHTML = GM_getValue(id + 'UM_OP_polka5', '5');
          options[6].innerHTML = GM_getValue(id + 'UM_OP_polka4', '4');
          options[7].innerHTML = GM_getValue(id + 'UM_OP_polka3', '3');
          options[8].innerHTML = GM_getValue(id + 'UM_OP_polka2', '2');
          options[9].innerHTML = GM_getValue(id + 'UM_OP_polka1', '1');
          el = document.getElementsByClassName('itemTab');
          for (l = 0; l < el.length; l++) {
            el[l].innerHTML = el[l].innerHTML.replace('Półka 10', GM_getValue(id + 'UM_OP_polka10', 'Półka 10'));
            el[l].innerHTML = el[l].innerHTML.replace('Półka 9', GM_getValue(id + 'UM_OP_polka9', 'Półka 9'));
            el[l].innerHTML = el[l].innerHTML.replace('Półka 8', GM_getValue(id + 'UM_OP_polka8', 'Półka 8'));
            el[l].innerHTML = el[l].innerHTML.replace('Półka 7', GM_getValue(id + 'UM_OP_polka7', 'Półka 7'));
            el[l].innerHTML = el[l].innerHTML.replace('Półka 6', GM_getValue(id + 'UM_OP_polka6', 'Półka 6'));
            el[l].innerHTML = el[l].innerHTML.replace('Półka 5', GM_getValue(id + 'UM_OP_polka5', 'Półka 5'));
            el[l].innerHTML = el[l].innerHTML.replace('Półka 4', GM_getValue(id + 'UM_OP_polka4', 'Półka 4'));
            el[l].innerHTML = el[l].innerHTML.replace('Półka 3', GM_getValue(id + 'UM_OP_polka3', 'Półka 3'));
            el[l].innerHTML = el[l].innerHTML.replace('Półka 2', GM_getValue(id + 'UM_OP_polka2', 'Półka 2'));
            el[l].innerHTML = el[l].innerHTML.replace('Półka 1', GM_getValue(id + 'UM_OP_polka1', 'Półka 1'));
            el[l].innerHTML = el[l].innerHTML.replace('Shelf 10', GM_getValue(id + 'UM_OP_polka10', 'Shelf 10'));
            el[l].innerHTML = el[l].innerHTML.replace('Shelf 9', GM_getValue(id + 'UM_OP_polka9', 'Shelf 9'));
            el[l].innerHTML = el[l].innerHTML.replace('Shelf 8', GM_getValue(id + 'UM_OP_polka8', 'Shelf 8'));
            el[l].innerHTML = el[l].innerHTML.replace('Shelf 7', GM_getValue(id + 'UM_OP_polka7', 'Shelf 7'));
            el[l].innerHTML = el[l].innerHTML.replace('Shelf 6', GM_getValue(id + 'UM_OP_polka6', 'Shelf 6'));
            el[l].innerHTML = el[l].innerHTML.replace('Shelf 5', GM_getValue(id + 'UM_OP_polka5', 'Shelf 5'));
            el[l].innerHTML = el[l].innerHTML.replace('Shelf 4', GM_getValue(id + 'UM_OP_polka4', 'Shelf 4'));
            el[l].innerHTML = el[l].innerHTML.replace('Shelf 3', GM_getValue(id + 'UM_OP_polka3', 'Shelf 3'));
            el[l].innerHTML = el[l].innerHTML.replace('Shelf 2', GM_getValue(id + 'UM_OP_polka2', 'Shelf 2'));
            el[l].innerHTML = el[l].innerHTML.replace('Shelf 1', GM_getValue(id + 'UM_OP_polka1', 'Shelf 1'));
            el[l].innerHTML = el[l].innerHTML.replace('Shelf 10', GM_getValue(id + 'UM_OP_polka10', 'Étagère 10'));
            el[l].innerHTML = el[l].innerHTML.replace('Shelf 9', GM_getValue(id + 'UM_OP_polka9', 'Étagère 9'));
            el[l].innerHTML = el[l].innerHTML.replace('Shelf 8', GM_getValue(id + 'UM_OP_polka8', 'Étagère 8'));
            el[l].innerHTML = el[l].innerHTML.replace('Shelf 7', GM_getValue(id + 'UM_OP_polka7', 'Étagère 7'));
            el[l].innerHTML = el[l].innerHTML.replace('Shelf 6', GM_getValue(id + 'UM_OP_polka6', 'Étagère 6'));
            el[l].innerHTML = el[l].innerHTML.replace('Shelf 5', GM_getValue(id + 'UM_OP_polka5', 'Étagère 5'));
            el[l].innerHTML = el[l].innerHTML.replace('Shelf 4', GM_getValue(id + 'UM_OP_polka4', 'Étagère 4'));
            el[l].innerHTML = el[l].innerHTML.replace('Shelf 3', GM_getValue(id + 'UM_OP_polka3', 'Étagère 3'));
            el[l].innerHTML = el[l].innerHTML.replace('Shelf 2', GM_getValue(id + 'UM_OP_polka2', 'Étagère 2'));
            el[l].innerHTML = el[l].innerHTML.replace('Shelf 1', GM_getValue(id + 'UM_OP_polka1', 'Étagère 1'));
          }
        }
        if (GM_getValue(id + 'UM_OP_fastzk', true)) {
          // mod fast zk
          unsafeWindow.clk_stock = function (event, stock) {
          }
          unsafeWindow.clk_zk = function (event, stock) {
          }
          unsafeWindow.clk_equip = function (event, stock) {
          }
          var itemS = document.getElementsByClassName('item');
          for (var i = 0; i < itemS.length; i++) {
            ta = itemS[i].getElementsByTagName('table');
            krew = false;
            if (GM_getValue(id + 'UM_OP_zkkrew', true)) if (ta[0].innerHTML.search('Tward') > 0 || ta[0].innerHTML.search('Zwierzęc') > 0 || ta[0].innerHTML.search('Gwiezdn') > 0 || ta[0].innerHTML.search('Niedźwie') > 0 || ta[0].innerHTML.search('Szamań') > 0 || ta[0].innerHTML.search('Kościan') > 0 || ta[0].innerHTML.search('Elastyczn') > 0 || ta[0].innerHTML.search('Amulet Krwi') > 0 || ta[0].innerHTML.search('Naszyjnik Krwi') > 0 || ta[0].innerHTML.search('Łańcuch Krwi') > 0 || ta[0].innerHTML.search('Apaszka Krwi') > 0 || ta[0].innerHTML.search('Pierścień Krwi') > 0 || ta[0].innerHTML.search('Sygnet Krwi') > 0 || ta[0].innerHTML.search('Bransoleta Krwi') > 0 || ta[0].innerHTML.search('Krawat Krwi') > 0) {
              ta[0].style.backgroundColor = '#aa0000';
              if (GM_getValue(id + 'UM_OP_zkkrew', true)) if (itemS[i].innerHTML.search('Posiadacz') != - 1) {
                if (ta[0].innerHTML.search('class="me"') > itemS[i].innerHTML.search('Posiadacz')) {
                  document.getElementsByClassName('hr720') [0].innerHTML = '<b style=\'color: orange;font-size:1.4em;text-shadow: 1px 1px 1px black;text-shadow: -1px -1px 1px black;\'>PAMIĘTAJ O ODDANIU KRWI DO ZK ;)</b>';
                  document.getElementsByClassName('hr720') [0].style.height = '50px';
                } else {
                  document.getElementsByClassName('hr720') [0].innerHTML = '<b style=\'color: orange;font-size:1.4em;text-shadow: 1px 1px 1px black;text-shadow: -1px -1px 1px black;\'>* * * UWAGA! KREW Z ZK W UŻYCIU! (' + itemS[i].getElementsByTagName('div') [2].getElementsByTagName('a') [1].innerHTML + ') * * *</b>';
                  document.getElementsByClassName('hr720') [0].style.height = '50px';
                }
              }
              if (itemS[i].innerHTML.search('Właściciel') != - 1) krew = true;
            }
            if (ta[0].innerHTML.search('class="me"') > 0) {
              ta[0].style.border = 'solid #00aa00 3px';
              if (!krew) {
                ta[0].style.backgroundColor = '#00aa00';
              }
            }
            if (krew == true) {
              ta[0].addEventListener('mousedown', function () {
                var itemS = document.getElementsByClassName('item');
                for (var i = 0; i < itemS.length; i++) {
                  var ta = itemS[i].getElementsByTagName('table');
                  if (ta[0].style.backgroundColor == 'rgb(170, 0, 0)' && ta[0].innerHTML.search('Właściciel') != - 1) {
                    ta[0].getElementsByClassName('checkbox') [0].click();
                  }
                }
              }, false);
            }
            if (!krew) ta[0].addEventListener('mousedown', function () {
              this.getElementsByClassName('checkbox') [0].click();
            }, false);
            itemS[i].getElementsByTagName('td') [1].width = '13%';
          }
          var itemS = document.getElementsByClassName('checkbox');
          for (var i = 0; i < itemS.length; i++) itemS[i].style.display = 'none';
        }        // mod clean-zk

        polka = document.getElementById('hc_c0');
        if (document.getElementById('hc_c0')) {
          input = polka.getElementsByTagName('input') [0];
          input.value = 'ODWRÓĆ';
          input.style.width = '90px';
          nowy = document.createElement('INPUT');
          nowy.type = 'button';
          nowy.value = 'CZYŚĆ';
          nowy.className = 'button';
          nowy.style.width = '90px';
          nowy.style.marginLeft = '10px';
          nowy.id = 'nowy';
          if (input.nextSibling) input.parentNode.insertBefore(nowy, input.nextSibling);
           else input.parentNode.appendChild(nowy);
          document.getElementById('nowy').addEventListener('click', function () {
            polka = document.getElementById('hc_c0');
            itemS = polka.getElementsByClassName('item');
            for (i = 0; i < itemS.length; i++) {
              itemLink = itemS[i].getElementsByTagName('TD') [2].innerHTML;
              itemLink = itemLink.replace(/&lt;/gi, '<');
              itemLink = itemLink.replace(/&gt;/gi, '>');
              itemLink = itemLink.replace('Lgo', '');
              koszt = (itemLink.substring((itemLink.search('<b>') + 9), itemLink.search('</b>')).replace(/ /gi, ''));
              if (parseInt(koszt) < GM_getValue(id + 'UM_zkclean', '2000') && parseInt(koszt) > 49) {
                sellItem = itemS[i].getElementsByTagName('TD') [1].getElementsByTagName('INPUT') [0];
                sellItem.click();
              }
            }
            document.getElementsByClassName('sellButton') [1].click();
          }, false);
        }
      }
      if (a.substring(0, 9) == '?a=ambush') {
        if (document.getElementById('atkTimeLeft')) {
          czas = Math.floor(Date.now() / 1000);
          var przeliczone = 0;
          var p = document.getElementById('atkTimeLeft').innerText.split(':');
          przeliczone = parseInt(p[2]) + parseInt(p[1] * 60) + parseInt(p[0] * 60 * 60);
          czas += przeliczone;
          GM_setValue(id + 'UM_atak', czas);
          kto = document.getElementsByClassName('players') [0].innerHTML;
          GM_setValue(id + 'UM_atakkto', kto);
          var mid = '?a=msg&do=view&mid=' + document.getElementsByTagName('body') [0].innerHTML.substring(9 + document.getElementsByTagName('body') [0].innerHTML.indexOf('addMsgId'), document.getElementsByTagName('body') [0].innerHTML.indexOf(')', document.getElementsByTagName('body') [0].innerHTML.indexOf('addMsgId'))) + '&type=1';
          //			mid = unsafeWindow.refLinks.atkTime.substring(unsafeWindow.refLinks.atkTime.indexOf("?"),unsafeWindow.refLinks.atkTime.indexOf(">")-1);			
          GM_setValue(id + 'UM_mid', mid);
        } else {
          if (document.getElementsByClassName('error')) {
          } else {
            GM_setValue(id + 'UM_atak', 0);
          }
        }
        if (GM_getValue(id + 'UM_OP_taximax', true)) {
          if (typeof unsafeWindow.taxiClickMax == 'function') {
            i = GM_getValue(id + 'UM_OP_taxilev', 5);
            for (x = 0; x < i; x++) {
              //				unsafeWindow.taxiClickMax(); 
              unsafeWindow.taxiAddLvl();
            }
          }
          code = 'taxiLvl=0;updateTaxi();';
          i = GM_getValue(id + 'UM_OP_taxilev', 5);
          for (x = 0; x < i; x++) {
            code += 'taxiAddLvl();';
          }
          scriptCode.push('function recalcInput(){correctFields(hisStrefa, hisSektor, hisKwadrat);\tvar pos = countPos(hisStrefa.value, hisSektor.value, myStrefa, mySektor);\tvar newTotalTime = countTotalTime(pos, taxiLvl);\tupdateForm(newTotalTime);' + code + '}');
          var script = document.createElement('script');
          script.innerHTML = scriptCode.join('\n');
          scriptCode.length = 0;
          document.getElementsByTagName('head') [0].appendChild(script);
        }
      }
      test = GM_getValue(id + 'UM_atak', 0);
      if (test > 0) {
        if (test - Math.floor(Date.now() / 1000) > 0) {
          setTimeout(function () {
            if (GM_getValue(id + 'UM_atak', 0)) {
              notification('Atak zakończony');
              GM_setValue(id + 'UM_atak', 0);
            }
          }, (test - Math.floor(Date.now() / 1000)) * 1000);
        } else {
          GM_setValue(id + 'UM_atak', 0);
        }
      }
      if (a == '?a=swr') {
        table = document.getElementsByTagName('table') [4];
        if (table.innerHTML.length < 500) table = document.getElementsByTagName('table') [5];
        if (table) {
          kw = false;
          tr = table.getElementsByTagName('tr');
          for (i = 1; i < tr.length; i++) {
            td = tr[i].getElementsByTagName('td') [0];
            sum = tr[i].getElementsByTagName('td') [3];
            if (!sum) {
              continue;
            }
            akt = parseInt(sum.getElementsByTagName('SPAN') [sum.getElementsByTagName('SPAN').length - 1].innerHTML);
            sum = sum.innerHTML.substring(sum.innerHTML.length - 20, sum.innerHTML.length).replace(/ /g, '').replace('/', '');
            if (sum - akt) {
              tr[i].getElementsByTagName('td') [3].innerHTML += ' (<span class="lnk">' + (sum - akt) + '</span>)';
              tr[i].getElementsByTagName('td') [3].style.width = '100px';
            }            //if (td.innerHTML.length<135 && td.innerHTML.length>100 || td.innerHTML.length==410 || td.innerHTML.length==250 || td.innerHTML.length==247 || td.innerHTML.length==249 || td.innerHTML.length==145) {
            //t = td.getElementsByTagName('input');

            if (td.innerHTML.length > 100) {
              kw = true;
              break;
            }            //}

          }
          if (kw) {
            czas = tr[i].getElementsByClassName('itemstacked1');
            if (czas.length) {
              czas = tr[i].getElementsByClassName('itemstacked1') [0].innerHTML;
              var rok = czas.split('-') [0].replace(/ /g, '');
              var miesiac = czas.split('-') [1];
              var dzien = czas.split('-') [2].split(' ') [0];
              var godzina = czas.split(':') [0].substring(czas.split(':') [0].length - 2, czas.split(':') [0].length);
              var minuty = czas.split(':') [1];
              var sekundy = czas.split(':') [2].substring(0, 2);
              pozniej = new Date(rok, miesiac - 1, dzien, godzina, minuty, sekundy);
            } else {
              c = tr[i].getElementsByTagName('td') [5].getElementsByTagName('div') [0].innerHTML;
              go = c.split(':') [0];
              mi = c.split(':') [1];
              se = c.split(':') [2];
              mi++;
              mi--;
              se++;
              se--;
              go++;
              go--;
              pozniej = new Date();
              pozniej.setTime(unsafeWindow.serverTime * 1000); //pozniej.getTime()+unsafeWindow.timeDiff*1000);
              if (go > 0) pozniej.setHours(pozniej.getHours() + go);
              if (mi > 0) pozniej.setMinutes(pozniej.getMinutes() + mi);
              if (se > 0) pozniej.setSeconds(pozniej.getSeconds() + se);
              rok = pozniej.getFullYear();
              miesiac = pozniej.getMonth() + 1;
              dzien = pozniej.getDate();
              godzina = pozniej.getHours();
              minuty = pozniej.getMinutes();
              sekundy = pozniej.getSeconds();
            }
            var teraz = new Date();
            teraz.setTime(unsafeWindow.serverTime * 1000); //teraz.getTime()+unsafeWindow.timeDiff*1000);
            GM_setValue(id + 'UM_krok', rok);
            GM_setValue(id + 'UM_kmiesiac', miesiac);
            GM_setValue(id + 'UM_kdzien', dzien);
            GM_setValue(id + 'UM_kgodzina', godzina);
            GM_setValue(id + 'UM_kminuty', minuty);
            GM_setValue(id + 'UM_ksekundy', sekundy);
            var roznica = pozniej.getTime() - teraz.getTime();
            var i = setInterval(function () {
              roznica -= 1000;
              if (roznica <= 0) {
                document.title = id.replace('r', 'R') + ' - FINISH!';
                roznica = 0;
              } else {
                time = roznica;
                var days = Math.floor(time / 86400000);
                var hours = Math.floor((time - (86400000 * days)) / 3600000);
                if (hours < 10) hours = '0' + hours;
                var minutes = Math.floor((time - (86400000 * days) - (3600000 * hours)) / 60000);
                if (minutes < 10) minutes = '0' + minutes;
                var seconds = (time - (86400000 * days) - (3600000 * hours) - (60000 * minutes)) / 1000;
                seconds = Math.floor(seconds);
                if (seconds < 10) seconds = '0' + seconds;
                document.title = id.replace('r', 'R') + ' - ' + hours + ':' + minutes + ':' + seconds;
              }
            }, 1000);
          } else {
            GM_setValue(id + 'UM_krok', - 1);
            GM_setValue(id + 'UM_kmiesiac', 0);
            GM_setValue(id + 'UM_kdzien', 0);
            GM_setValue(id + 'UM_kgodzina', 0);
            GM_setValue(id + 'UM_kminuty', 0);
            GM_setValue(id + 'UM_ksekundy', 0);
          }
        }
      }
      if (a.substring(0, 11) == '?a=townshop' && GM_getValue(id + 'UM_OP_shop1', true)) {
        sklep = document.getElementsByClassName('item-link');
        for (i = sklep.length - 1; i > sklep.length - 46; i--) {
          txt = String(sklep[i].onclick);
          txt = txt.substring(txt.search('<table'), txt.search('</table') + 8);
          sklep[i].innerHTML += txt.replace(/\\/g, '').replace(/Przedmiot jednorazowego użytku/g, '').replace('<br>', '');
        }
      }
      if (a.substring(0, 11) == '?a=townshop' && GM_getValue(id + 'UM_buy_junk', false)) {
        GM_setValue(id + 'UM_buy_junk', false);
        document.getElementsByClassName('button') [0].click();
        document.getElementsByClassName('equip') [0].getElementsByClassName('enabled') [0].click();
      }
      if (a == '?a=arena') {
        table = document.getElementsByTagName('table') [4];
        tr = table.getElementsByTagName('tr');
        for (i = 1; i < tr.length; i++) {
          sum = tr[i].getElementsByTagName('td') [2];
          akt = parseInt(sum.getElementsByTagName('SPAN') [sum.getElementsByTagName('SPAN').length - 1].innerHTML);
          sum = parseInt(sum.innerHTML.substring(sum.innerHTML.length - 7, sum.innerHTML.length));
          if (sum - akt) {
            tr[i].getElementsByTagName('td') [2].innerHTML += ' (<span class="lnk">' + (sum - akt) + '</span>)';
            tr[i].getElementsByTagName('td') [2].style.width = '100px';
          }
        }
      }
      function wczytaj_ewo(set) {
        if (GM_getValue(id + 'OP_ewo_' + set, false)) {
          data = GM_getValue(id + 'OP_ewo_' + set).split('|');
          unsafeWindow.evoController.resetAllEvo();
          document.getElementById('wczytaj_ewo_1').style.backgroundImage = 'url(http://r12.bloodwars.interia.pl/gfx/item_set.gif)';
          document.getElementById('wczytaj_ewo_2').style.backgroundImage = 'url(http://r12.bloodwars.interia.pl/gfx/item_set.gif)';
          document.getElementById('wczytaj_ewo_3').style.backgroundImage = 'url(http://r12.bloodwars.interia.pl/gfx/item_set.gif)';
          document.getElementById('wczytaj_ewo_4').style.backgroundImage = 'url(http://r12.bloodwars.interia.pl/gfx/item_set.gif)';
          document.getElementById('wczytaj_ewo_5').style.backgroundImage = 'url(http://r12.bloodwars.interia.pl/gfx/item_set.gif)';
          document.getElementById('wczytaj_ewo_6').style.backgroundImage = 'url(http://r12.bloodwars.interia.pl/gfx/item_set.gif)';
          document.getElementById('wczytaj_ewo_7').style.backgroundImage = 'url(http://r12.bloodwars.interia.pl/gfx/item_set.gif)';
          document.getElementById('wczytaj_ewo_8').style.backgroundImage = 'url(http://r12.bloodwars.interia.pl/gfx/item_set.gif)';
          document.getElementById('wczytaj_ewo_9').style.backgroundImage = 'url(http://r12.bloodwars.interia.pl/gfx/item_set.gif)';
          document.getElementById('wczytaj_ewo_10').style.backgroundImage = 'url(http://r12.bloodwars.interia.pl/gfx/item_set.gif)';
          document.getElementById('wczytaj_ewo_' + set).style.backgroundImage = 'url(http://r12.bloodwars.interia.pl/gfx/item_set_active.jpg)';
          for (x in data) {
            poz = data[x].split(':') [0];
            ewo = data[x].split(':') [1];
            if (ewo) {
              for (aa = 0; aa < ewo; aa++) {
                unsafeWindow.evoController.addEvoPt(poz);
              }
            }
          }
        }
      }
      function zapisz_ewo(set) {
        if (confirm('Czy na pewno zapisać zestaw EWO?')) {
          data = '';
          for (i = 1; i < 25; i++) {
            if (document.getElementById('dispEvo_' + i)) {
              data += i + ':' + document.getElementById('dispEvo_' + i).innerHTML + '|';
            } else {
              data += i + ':0|'
            }
          }
          data = data.substring(0, data.length - 1);
          GM_setValue(id + 'OP_ewo_' + set, data);
          document.getElementById('zapisz_ewo_' + set).style.backgroundImage = 'url(http://r12.bloodwars.interia.pl/gfx/item_set_active.jpg)';
          alert('Zapisano!');
        }
      }
      if (a == '?a=newarena&cat=2' || a == '?a=cevent&do=sacrifice' || a == '?a=ambush&opt=atk' || a == '?a=cevent' || a == '?a=swr' || a == '?a=swr&do=new' || a == '?a=swr&do=current' || a == '?a=cevent&do=new' || a == '?a=cevent&do=current' || a == '?a=newarena&cat=2&do=new' || a == '?a=newarena&cat=1' || a == '?a=newarena&cat=3' || a == '?a=cevent&do=new&chtier=2' || a == '?a=cevent&do=new&chtier=1') {
        oj = 5;
        if (a == '?a=cevent&do=current') {
          oj = 2;
        }
        if (a == '?a=cevent' || a == '?a=swr&do=new' || a == '?a=newarena&cat=2&do=new' || a == '?a=newarena&cat=1' || a == '?a=newarena&cat=3' || a == '?a=cevent&do=sacrifice' || a == '?a=newarena&cat=2') {
          oj = 1; // ? ostatni
        }
        if (a == '?a=swr&do=current' || a == '?a=ambush&opt=atk') {
          oj = 2; // ?
        }
        if (a == '?a=swr') {
          oj = 2; // ?
        }
        if (a == '?a=cevent') {
          oj = 2; // ?
        }
        dom = document.getElementsByClassName('equip') [oj];
        if (dom) {
          wczytaj = 'Wczytaj:<br/>';
          wczytaj += '<div id=\'wczytaj_ewo_1\' style=\'cursor: ' + (!GM_getValue(id + 'OP_ewo_1', false) ? 'normal' : 'pointer') + '; background: url(http://r12.bloodwars.interia.pl/gfx/item_set.gif) no-repeat; position: relative; width: 50px; height: 30px; margin: 3px 5px; float: left;\'><div><b style=\'font-size: 20px; \'>1</b></div></div>';
          wczytaj += '<div id=\'wczytaj_ewo_2\' style=\'cursor: ' + (!GM_getValue(id + 'OP_ewo_2', false) ? 'normal' : 'pointer') + '; background: url(http://r12.bloodwars.interia.pl/gfx/item_set.gif) no-repeat; position: relative; width: 50px; height: 30px; margin: 3px 5px; float: left;\'><div><b style=\'font-size: 20px; \'>2</b></div></div>';
          wczytaj += '<div id=\'wczytaj_ewo_3\' style=\'cursor: ' + (!GM_getValue(id + 'OP_ewo_3', false) ? 'normal' : 'pointer') + '; background: url(http://r12.bloodwars.interia.pl/gfx/item_set.gif) no-repeat; position: relative; width: 50px; height: 30px; margin: 3px 5px; float: left;\'><div><b style=\'font-size: 20px; \'>3</b></div></div>';
          wczytaj += '<div id=\'wczytaj_ewo_4\' style=\'cursor: ' + (!GM_getValue(id + 'OP_ewo_4', false) ? 'normal' : 'pointer') + '; background: url(http://r12.bloodwars.interia.pl/gfx/item_set.gif) no-repeat; position: relative; width: 50px; height: 30px; margin: 3px 5px; float: left;\'><div><b style=\'font-size: 20px; \'>4</b></div></div>';
          wczytaj += '<div id=\'wczytaj_ewo_5\' style=\'cursor: ' + (!GM_getValue(id + 'OP_ewo_5', false) ? 'normal' : 'pointer') + '; background: url(http://r12.bloodwars.interia.pl/gfx/item_set.gif) no-repeat; position: relative; width: 50px; height: 30px; margin: 3px 5px; float: left;\'><div><b style=\'font-size: 20px; \'>5</b></div></div>';
          wczytaj += '<div id=\'wczytaj_ewo_6\' style=\'cursor: ' + (!GM_getValue(id + 'OP_ewo_6', false) ? 'normal' : 'pointer') + '; background: url(http://r12.bloodwars.interia.pl/gfx/item_set.gif) no-repeat; position: relative; width: 50px; height: 30px; margin: 3px 5px; float: left;\'><div><b style=\'font-size: 20px; \'>6</b></div></div>';
          wczytaj += '<div id=\'wczytaj_ewo_7\' style=\'cursor: ' + (!GM_getValue(id + 'OP_ewo_7', false) ? 'normal' : 'pointer') + '; background: url(http://r12.bloodwars.interia.pl/gfx/item_set.gif) no-repeat; position: relative; width: 50px; height: 30px; margin: 3px 5px; float: left;\'><div><b style=\'font-size: 20px; \'>7</b></div></div>';
          wczytaj += '<div id=\'wczytaj_ewo_8\' style=\'cursor: ' + (!GM_getValue(id + 'OP_ewo_8', false) ? 'normal' : 'pointer') + '; background: url(http://r12.bloodwars.interia.pl/gfx/item_set.gif) no-repeat; position: relative; width: 50px; height: 30px; margin: 3px 5px; float: left;\'><div><b style=\'font-size: 20px; \'>8</b></div></div>';
          wczytaj += '<div id=\'wczytaj_ewo_9\' style=\'cursor: ' + (!GM_getValue(id + 'OP_ewo_9', false) ? 'normal' : 'pointer') + '; background: url(http://r12.bloodwars.interia.pl/gfx/item_set.gif) no-repeat; position: relative; width: 50px; height: 30px; margin: 3px 5px; float: left;\'><div><b style=\'font-size: 20px; \'>9</b></div></div>';
          wczytaj += '<div id=\'wczytaj_ewo_10\' style=\'cursor: ' + (!GM_getValue(id + 'OP_ewo_10', false) ? 'normal' : 'pointer') + '; background: url(http://r12.bloodwars.interia.pl/gfx/item_set.gif) no-repeat; position: relative; width: 50px; height: 30px; margin: 3px 5px; float: left;\'><div><b style=\'font-size: 20px; \'>10</b></div></div>';
          wczytaj += '<br style=\'clear:both;\'/><hr>';
          dom.innerHTML = wczytaj + dom.innerHTML;
          dom.innerHTML += '<hr>Zapisz:<br/>';
          dom.innerHTML += '<div id=\'zapisz_ewo_1\' style=\'cursor: pointer; background: url(http://r12.bloodwars.interia.pl/gfx/item_set' + (!GM_getValue(id + 'OP_ewo_1', false) ? '.gif' : '_active.jpg') + ') no-repeat; position: relative; width: 50px; height: 30px; margin: 3px 5px; float: left;\'><div><b style=\'font-size: 20px; \'>1</b></div></div>';
          dom.innerHTML += '<div id=\'zapisz_ewo_2\' style=\'cursor: pointer; background: url(http://r12.bloodwars.interia.pl/gfx/item_set' + (!GM_getValue(id + 'OP_ewo_2', false) ? '.gif' : '_active.jpg') + ') no-repeat; position: relative; width: 50px; height: 30px; margin: 3px 5px; float: left;\'><div><b style=\'font-size: 20px; \'>2</b></div></div>';
          dom.innerHTML += '<div id=\'zapisz_ewo_3\' style=\'cursor: pointer; background: url(http://r12.bloodwars.interia.pl/gfx/item_set' + (!GM_getValue(id + 'OP_ewo_3', false) ? '.gif' : '_active.jpg') + ') no-repeat; position: relative; width: 50px; height: 30px; margin: 3px 5px; float: left;\'><div><b style=\'font-size: 20px; \'>3</b></div></div>';
          dom.innerHTML += '<div id=\'zapisz_ewo_4\' style=\'cursor: pointer; background: url(http://r12.bloodwars.interia.pl/gfx/item_set' + (!GM_getValue(id + 'OP_ewo_4', false) ? '.gif' : '_active.jpg') + ') no-repeat; position: relative; width: 50px; height: 30px; margin: 3px 5px; float: left;\'><div><b style=\'font-size: 20px; \'>4</b></div></div>';
          dom.innerHTML += '<div id=\'zapisz_ewo_5\' style=\'cursor: pointer; background: url(http://r12.bloodwars.interia.pl/gfx/item_set' + (!GM_getValue(id + 'OP_ewo_5', false) ? '.gif' : '_active.jpg') + ') no-repeat; position: relative; width: 50px; height: 30px; margin: 3px 5px; float: left;\'><div><b style=\'font-size: 20px; \'>5</b></div></div>';
          dom.innerHTML += '<div id=\'zapisz_ewo_6\' style=\'cursor: pointer; background: url(http://r12.bloodwars.interia.pl/gfx/item_set' + (!GM_getValue(id + 'OP_ewo_6', false) ? '.gif' : '_active.jpg') + ') no-repeat; position: relative; width: 50px; height: 30px; margin: 3px 5px; float: left;\'><div><b style=\'font-size: 20px; \'>6</b></div></div>';
          dom.innerHTML += '<div id=\'zapisz_ewo_7\' style=\'cursor: pointer; background: url(http://r12.bloodwars.interia.pl/gfx/item_set' + (!GM_getValue(id + 'OP_ewo_7', false) ? '.gif' : '_active.jpg') + ') no-repeat; position: relative; width: 50px; height: 30px; margin: 3px 5px; float: left;\'><div><b style=\'font-size: 20px; \'>7</b></div></div>';
          dom.innerHTML += '<div id=\'zapisz_ewo_8\' style=\'cursor: pointer; background: url(http://r12.bloodwars.interia.pl/gfx/item_set' + (!GM_getValue(id + 'OP_ewo_8', false) ? '.gif' : '_active.jpg') + ') no-repeat; position: relative; width: 50px; height: 30px; margin: 3px 5px; float: left;\'><div><b style=\'font-size: 20px; \'>8</b></div></div>';
          5
          dom.innerHTML += '<div id=\'zapisz_ewo_9\' style=\'cursor: pointer; background: url(http://r12.bloodwars.interia.pl/gfx/item_set' + (!GM_getValue(id + 'OP_ewo_9', false) ? '.gif' : '_active.jpg') + ') no-repeat; position: relative; width: 50px; height: 30px; margin: 3px 5px; float: left;\'><div><b style=\'font-size: 20px; \'>9</b></div></div>';
          dom.innerHTML += '<div id=\'zapisz_ewo_10\' style=\'cursor: pointer; background: url(http://r12.bloodwars.interia.pl/gfx/item_set' + (!GM_getValue(id + 'OP_ewo_10', false) ? '.gif' : '_active.jpg') + ') no-repeat; position: relative; width: 50px; height: 30px; margin: 3px 5px; float: left;\'><div><b style=\'font-size: 20px; \'>10</b></div></div>';
          document.getElementById('zapisz_ewo_1').addEventListener('click', function () {
            zapisz_ewo(1)
          }, false);
          document.getElementById('zapisz_ewo_2').addEventListener('click', function () {
            zapisz_ewo(2)
          }, false);
          document.getElementById('zapisz_ewo_3').addEventListener('click', function () {
            zapisz_ewo(3)
          }, false);
          document.getElementById('zapisz_ewo_4').addEventListener('click', function () {
            zapisz_ewo(4)
          }, false);
          document.getElementById('zapisz_ewo_5').addEventListener('click', function () {
            zapisz_ewo(5)
          }, false);
          document.getElementById('zapisz_ewo_6').addEventListener('click', function () {
            zapisz_ewo(6)
          }, false);
          document.getElementById('zapisz_ewo_7').addEventListener('click', function () {
            zapisz_ewo(7)
          }, false);
          document.getElementById('zapisz_ewo_8').addEventListener('click', function () {
            zapisz_ewo(8)
          }, false);
          document.getElementById('zapisz_ewo_9').addEventListener('click', function () {
            zapisz_ewo(9)
          }, false);
          document.getElementById('zapisz_ewo_10').addEventListener('click', function () {
            zapisz_ewo(10)
          }, false);
          document.getElementById('wczytaj_ewo_1').addEventListener('click', function () {
            wczytaj_ewo(1)
          }, false);
          document.getElementById('wczytaj_ewo_2').addEventListener('click', function () {
            wczytaj_ewo(2)
          }, false);
          document.getElementById('wczytaj_ewo_3').addEventListener('click', function () {
            wczytaj_ewo(3)
          }, false);
          document.getElementById('wczytaj_ewo_4').addEventListener('click', function () {
            wczytaj_ewo(4)
          }, false);
          document.getElementById('wczytaj_ewo_5').addEventListener('click', function () {
            wczytaj_ewo(5)
          }, false);
          document.getElementById('wczytaj_ewo_6').addEventListener('click', function () {
            wczytaj_ewo(6)
          }, false);
          document.getElementById('wczytaj_ewo_7').addEventListener('click', function () {
            wczytaj_ewo(7)
          }, false);
          document.getElementById('wczytaj_ewo_8').addEventListener('click', function () {
            wczytaj_ewo(8)
          }, false);
          document.getElementById('wczytaj_ewo_9').addEventListener('click', function () {
            wczytaj_ewo(9)
          }, false);
          document.getElementById('wczytaj_ewo_10').addEventListener('click', function () {
            wczytaj_ewo(10)
          }, false);
          if (a != '?a=ambush&opt=atk') {
            for (i = 1; i <= 10; i++) {
              if (GM_getValue(id + 'OP_ewo_' + i, false)) {
                wczytaj_ewo(i);
                break;
              }
            }
          }
        }
      }
      if (a == '?a=cevent' || a == '?a=cevent&do=current') {
        table = document.getElementsByTagName('table') [4];
        exp = false;
        tr = table.getElementsByTagName('tr');
        for (i = 1; i < tr.length; i++) {
          td = tr[i].getElementsByTagName('td') [0];
          sum = tr[i].getElementsByTagName('td') [3];
          if (!sum) {
            continue;
          }
          akt = parseInt(sum.getElementsByTagName('SPAN') [sum.getElementsByTagName('SPAN').length - 1].innerHTML);
          sum = sum.innerHTML.substring(sum.innerHTML.length - 20, sum.innerHTML.length).replace(/ /g, '').replace('/', '');
          if (sum - akt) {
            tr[i].getElementsByTagName('td') [3].innerHTML += ' (<span class="lnk">' + (sum - akt) + '</span>)';
            tr[i].getElementsByTagName('td') [3].style.width = '100px';
          }          //			if ((td.innerHTML.length<135 && td.innerHTML.length>100) || td.innerHTML.length==250 || td.innerHTML.length==413 || td.innerHTML.length==414 || td.innerHTML.length==249 || td.innerHTML.length== 145) {

          if (td.innerHTML.length > 100) {
            //				t = td.getElementsByTagName('input');
            //				if (t.length==0) {
            exp = true;
            break;
            //				}
          }
        }
        if (exp) {
          czas = tr[i].getElementsByClassName('itemstacked1');
          if (czas.length) {
            czas = tr[i].getElementsByClassName('itemstacked1') [0].innerHTML;
            var rok = czas.split('-') [0].replace(/ /g, '');
            var miesiac = czas.split('-') [1];
            var dzien = czas.split('-') [2].split(' ') [0];
            var godzina = czas.split(':') [0].substring(czas.split(':') [0].length - 2, czas.split(':') [0].length);
            var minuty = czas.split(':') [1];
            var sekundy = czas.split(':') [2].substring(0, 2);
            pozniej = new Date(rok, miesiac - 1, dzien, godzina, minuty, sekundy);
          } else {
            c = tr[i].getElementsByTagName('td') [5].getElementsByTagName('div') [0].innerHTML;
            go = c.split(':') [0];
            mi = c.split(':') [1];
            se = c.split(':') [2];
            go++;
            go--;
            mi++;
            mi--;
            se++;
            se--;
            pozniej = new Date();
            pozniej.setTime(unsafeWindow.serverTime * 1000); //pozniej.getTime()+unsafeWindow.timeDiff*1000);
            if (go > 0) pozniej.setHours(pozniej.getHours() + go);
            if (mi > 0) pozniej.setMinutes(pozniej.getMinutes() + mi);
            if (se > 0) pozniej.setSeconds(pozniej.getSeconds() + se);
            rok = pozniej.getFullYear();
            miesiac = pozniej.getMonth() + 1;
            dzien = pozniej.getDate();
            godzina = pozniej.getHours();
            minuty = pozniej.getMinutes();
            sekundy = pozniej.getSeconds();
          }
          var teraz = new Date();
          teraz.setTime(unsafeWindow.serverTime * 1000);
          GM_setValue(id + 'UM_erok', rok);
          GM_setValue(id + 'UM_emiesiac', miesiac);
          GM_setValue(id + 'UM_edzien', dzien);
          GM_setValue(id + 'UM_egodzina', godzina);
          GM_setValue(id + 'UM_eminuty', minuty);
          GM_setValue(id + 'UM_esekundy', sekundy);
          var roznica = pozniej.getTime() - teraz.getTime();
          var i = setInterval(function () {
            roznica -= 1000;
            if (roznica <= 0) {
              document.title = id.replace('r', 'R') + ' - FINISH!';
              roznica = 0;
            } else {
              time = roznica;
              var days = Math.floor(time / 86400000);
              var hours = Math.floor((time - (86400000 * days)) / 3600000);
              if (hours < 10) hours = '0' + hours;
              var minutes = Math.floor((time - (86400000 * days) - (3600000 * hours)) / 60000);
              if (minutes < 10) minutes = '0' + minutes;
              var seconds = (time - (86400000 * days) - (3600000 * hours) - (60000 * minutes)) / 1000;
              seconds = Math.floor(seconds);
              if (seconds < 10) seconds = '0' + seconds;
              document.title = id.replace('r', 'R') + ' - ' + hours + ':' + minutes + ':' + seconds;
            }
          }, 1000);
        } else {
          GM_setValue(id + 'UM_erok', - 1);
          GM_setValue(id + 'UM_emiesiac', 0);
          GM_setValue(id + 'UM_edzien', 0);
          GM_setValue(id + 'UM_egodzina', 0);
          GM_setValue(id + 'UM_eminuty', 0);
          GM_setValue(id + 'UM_esekundy', 0);
        }
      }
      if (a == '?a=aliance') {
        if (GM_getValue(id + 'UM_OP_ukryj', true)) {
          opis = document.getElementsByClassName('clan-desc');
          if (opis.length) {
            opis = opis[0];
            opis.innerHTML = '<center><a id="UM_OP_ukryj" href="javascript:">UKRYWANIE OPISU PUBLICZNEGO AKTYWNE, KLIKNIJ BY WYŁĄCZYĆ TĄ OPCJE!</a></center>';
            document.getElementById('UM_OP_ukryj').addEventListener('click', function () {
              GM_setValue(id + 'UM_OP_ukryj', false);
              location.reload();
            }, false);
          }
        } else {
          opis = document.getElementsByClassName('clan-desc');
          if (opis.length) {
            opis = opis[0];
            opis.innerHTML = '<center><a id="UM_OP_ukryj" href="javascript:">(kliknij aby ukryć opis)</a></center>' + opis.innerHTML;
            document.getElementById('UM_OP_ukryj').addEventListener('click', function () {
              GM_setValue(id + 'UM_OP_ukryj', true);
              location.reload();
            }, false);
          }
        }
        if (GM_getValue(id + 'UM_OP_ukryj2', true)) {
          opis = document.getElementsByClassName('clan-desc');
          if (opis.length) {
            opis = opis[1];
            opis.innerHTML = '<center><a id="UM_OP_ukryj2" href="javascript:">UKRYWANIE OPISU PRYWATNEGO AKTYWNE, KLIKNIJ BY WYŁĄCZYĆ TĄ OPCJE!</a></center>';
            document.getElementById('UM_OP_ukryj2').addEventListener('click', function () {
              GM_setValue(id + 'UM_OP_ukryj2', false);
              location.reload();
            }, false);
          }
        } else {
          opis = document.getElementsByClassName('clan-desc');
          if (opis.length) {
            opis = opis[1];
            opis.innerHTML = '<center><a id="UM_OP_ukryj2" href="javascript:">(kliknij aby ukryć opis)</a></center>' + opis.innerHTML;
            document.getElementById('UM_OP_ukryj2').addEventListener('click', function () {
              GM_setValue(id + 'UM_OP_ukryj2', true);
              location.reload();
            }, false);
          }
        }
      }
      if (a == '?a=training&do=evo') {
        // mod zliczanie kosztu ewolucji
        suma = 0;
        koszty = [
          ['Skrzydła',
          150,
          300 + 150,
          450 + 300 + 150,
          600 + 300 + 450 + 150],
          [
            'Pancerz',
            150,
            300 + 150,
            450 + 300 + 150,
            600 + 450 + 300 + 150
          ],
          [
            'Kły//Pazury//Kolce',
            150,
            300 + 150,
            450 + 300 + 150,
            600 + 300 + 450 + 150
          ],
          [
            'Gruczoły jadowe',
            150,
            300 + 150,
            450 + 300 + 150,
            600 + 450 + 300 + 150
          ],
          [
            'Wzmocnione ścięgna',
            150,
            300 + 150,
            450 + 300 + 150,
            600 + 450 + 300 + 150
          ],
          [
            'Dodatkowa komora',
            150,
            300 + 150,
            450 + 300 + 150,
            600 + 450 + 300 + 150
          ],
          [
            'Krew demona',
            150,
            300 + 150,
            450 + 300 + 150,
            600 + 450 + 300 + 150
          ],
          [
            'Mutacje DNA',
            150,
            300 + 150,
            450 + 300 + 150,
            600 + 300 + 450 + 150
          ],
          [
            'Oświecony',
            150,
            300 + 150,
            450 + 300 + 150,
            600 + 450 + 300 + 150
          ],
          [
            'Szósty zmysł',
            150,
            300 + 150,
            450 + 300 + 150,
            600 + 450 + 300 + 150
          ],
          [
            'Absorpcja',
            150,
            300 + 150,
            450 + 300 + 150,
            600 + 450 + 300 + 150
          ],
          [
            'Harmonijny rozwój',
            150,
            300 + 150,
            450 + 300 + 150,
            600 + 450 + 300 + 150
          ],
          [
            'Skażenie Maną',
            250,
            1000 + 250,
            2000 + 1000 + 250,
            4000 + 2000 + 100 + 250
          ],
          [
            'Pamięć przodków',
            300,
            600 + 300,
            900 + 600 + 300,
            1200 + 900 + 600 + 300
          ],
          [
            'Potęga',
            300,
            750 + 300,
            2000 + 750 + 300,
            5000 + 2000 + 750 + 300
          ],
          [
            'Lekkość bytu',
            150,
            450,
            900,
            1500
          ],
          [
            'Piromancja',
            250,
            1250,
            3250,
            7250
          ],
          [
            'Więź z Gają',
            250,
            1250,
            3250,
            7250
          ],
          [
            'Hydromancja',
            250,
            1250,
            3250,
            7250
          ],
          [
            'Forma astralna',
            250,
            1250,
            3250,
            7250
          ],
          [
            'Piętno demona',
            250,
            1250,
            3250,
            7250
          ]
        ];
        ewo = document.getElementsByClassName('training-evo-title');
        for (var i = 0; i < ewo.length; i++) {
          czs = ewo[i].innerHTML;
          for (var i2 = 0; i2 < koszty.length; i2++) {
            if (czs.search(koszty[i2][0]) > - 1) {
              if (czs.search('poziom ') > - 1) {
                lvl = parseInt(czs.substr(czs.search('poziom ') + 7, 1));
                suma += koszty[i2][lvl];
              }
            }
          }
        }
        t = 0;
        suma2 = '';
        suma = suma + '';
        for (i = suma.length - 1; i >= 0; i--) {
          suma2 = suma[i] + suma2;
          t++;
          if (t == 3) {
            t = 0;
            suma2 = ' ' + suma2;
          }
        }
        version = document.getElementById('content-mid');
        ver2 = document.createElement('SPAN');
        ver2.innerHTML = '<br><center>W SUMIE W TRENINGU: &nbsp;&nbsp;&nbsp;<b>' + suma2 + '</b></center>';
        version.appendChild(ver2, version.firstChild);
        div = document.getElementById('training_evo').getElementsByTagName('DIV');
        for (x in div) {
          test = div[x].getElementsByClassName('training-evo-frame');
          if (test.length > 0) {
            test = div[x].getElementsByClassName('error');
            if (test.length > 1) {
              div[x].style.opacity = '0.7';
            } else if (test.length > 0) {
              div[x].style.opacity = '0.25';
            }
          }
        }
      }
      function aukcjeLicz(xi) {
        roznica -= 1000;
        if (roznica <= 0) {
          roznica = 0;
          GM_setValue(id + 'UM_arok', - 1);
          GM_setValue(id + 'UM_amiesiac', 0);
          GM_setValue(id + 'UM_adzien', 0);
          GM_setValue(id + 'UM_agodzina', 0);
          GM_setValue(id + 'UM_aminuty', 0);
          GM_setValue(id + 'UM_asekundy', 0);
        } else {
          time = roznica;
          var days = Math.floor(time / 86400000);
          var hours = Math.floor((time - (86400000 * days)) / 3600000);
          if (hours < 10) hours = '0' + hours;
          var minutes = Math.floor((time - (86400000 * days) - (3600000 * hours)) / 60000);
          if (minutes < 10) minutes = '0' + minutes;
          var seconds = (time - (86400000 * days) - (3600000 * hours) - (60000 * minutes)) / 1000;
          seconds = Math.floor(seconds);
          if (seconds < 10) seconds = '0' + seconds;
          document.getElementById('aukcjaLicznik' + xi).innerHTML = hours + ':' + minutes + ':' + seconds;
          document.title = id.replace('r', 'R') + ' - ' + hours + ':' + minutes + ':' + seconds;
        }
      }
      if (a == '?a=auction' || a.substring(0, 21) == '?a=auction&do=watched') {
        test = document.getElementsByClassName('tblheader') [document.getElementsByClassName('tblheader').length - 1];
        test.getElementsByTagName('td') [4].style.width = '';
        aukcja = false;
        test = document.getElementsByTagName('TR');
        GM_setValue(id + 'UM_arok', - 1);
        GM_setValue(id + 'UM_amiesiac', 0);
        GM_setValue(id + 'UM_adzien', 0);
        GM_setValue(id + 'UM_agodzina', 0);
        GM_setValue(id + 'UM_aminuty', 0);
        GM_setValue(id + 'UM_asekundy', 0);
        for (xi in test) {
          if (xi == test.length - 1) {
            break;
          }
          if (test[xi].hasAttribute('id') == true) {
            if (test[xi].id.substr(0, 3) == 'au_') {
              tst = test[xi].getElementsByTagName('TD');
              if (tst[4].className == 'error') continue;
              czas = tst[4].innerHTML.replace('<br>', ' ');
              var rok = czas.split('-') [0].replace(/ /g, '');
              var miesiac = czas.split('-') [1];
              var dzien = czas.split('-') [2].split(' ') [0];
              var godzina = czas.split(':') [0].substring(czas.split(':') [0].length - 2, czas.split(':') [0].length);
              var minuty = czas.split(':') [1];
              var sekundy = czas.split(':') [2].substring(0, 2);
              pozniej = new Date(rok, miesiac - 1, dzien, godzina, minuty, sekundy);
              tst[4].innerHTML = tst[4].innerHTML.replace('<br>', ' ') + '<br>' + '<span id="aukcjaLicznik' + xi + '">&nbsp;</span>';
              var teraz = new Date();
              teraz.setTime(unsafeWindow.serverTime * 1000); //teraz.getTime()+unsafeWindow.timeDiff*1000);
              var roznica = pozniej.getTime() - teraz.getTime();
              GM_setValue(id + 'UM_arok', rok);
              GM_setValue(id + 'UM_amiesiac', miesiac);
              GM_setValue(id + 'UM_adzien', dzien);
              GM_setValue(id + 'UM_agodzina', godzina);
              GM_setValue(id + 'UM_aminuty', minuty);
              GM_setValue(id + 'UM_asekundy', sekundy);
              var i = setInterval(function () {
                aukcjeLicz(xi);
              }, 1000);
              break;
            }
          }
        }
      }
      if (a.substring(0, 22) == '?a=auction&do=itemlist' || a.substring(0, 8) == '?a=equip' || document.getElementsByClassName('msg-quest').length) {
        itemS = document.getElementsByClassName('item-link');
        for (i = 0; i < itemS.length; i++) {
          if (GM_getValue(id + 'UM_OP_legendarne', true)) {
            itemS[i].innerHTML = itemS[i].innerHTML.replace('Legendarny', '<span style="text-shadow: 2px 2px 2px black;color: ' + GM_getValue(id + 'UM_kolorlegenda', 'green') + '";>Legendarny');
            itemS[i].innerHTML = itemS[i].innerHTML.replace('Legendarna', '<span style="text-shadow: 2px 2px 2px black;color: ' + GM_getValue(id + 'UM_kolorlegenda', 'green') + '";>Legendarna');
            itemS[i].innerHTML = itemS[i].innerHTML.replace('Legendarne', '<span style="text-shadow: 2px 2px 2px black;color: ' + GM_getValue(id + 'UM_kolorlegenda', 'green') + '";>Legendarne');
          }
          if (GM_getValue(id + 'UM_OP_epickie', true)) {
            itemS[i].innerHTML = itemS[i].innerHTML.replace('Epickie', '<span style="text-shadow: 2px 2px 2px black;color: ' + GM_getValue(id + 'UM_kolorepik', 'blue') + '";>Epickie');
            itemS[i].innerHTML = itemS[i].innerHTML.replace('Epicki', '<span style="text-shadow: 2px 2px 2px black;color: ' + GM_getValue(id + 'UM_kolorepik', 'blue') + '";>Epicki');
            itemS[i].innerHTML = itemS[i].innerHTML.replace('Epicka', '<span style="text-shadow: 2px 2px 2px black;color: ' + GM_getValue(id + 'UM_kolorepik', 'blue') + '";>Epicka');
          }
        }
      }
      if ((a.substring(0, 7) == '?a=rank' && GM_getValue(id + 'UM_OP_mysort3', false)) || (a == '?a=rank' && GM_getValue(id + 'UM_OP_mysort', true)) || (a == '?a=rank&page=1' && GM_getValue(id + 'UM_OP_mysort1', true)) || (a == '?a=rank&page=2' && GM_getValue(id + 'UM_OP_mysort2', true))) {
        // mod sort rank
        table = document.getElementsByClassName('rank') [0];
        poz = table.getElementsByTagName('tr');
        nowe = new Array();
        for (x = 1; x < poz.length; x++) {
          nowe[x - 1] = new Array(10);
          td = poz[x].getElementsByTagName('td');
          yes = td[4].getElementsByTagName('img') [0].alt;
          if (yes < 0 || yes > 8) yes = 9;
          nowe[x - 1][0] = yes;
          nowe[x - 1][9] = td[0].innerHTML;
          nowe[x - 1][1] = td[0].innerHTML;
          if (nowe[x - 1][1].length < 3) nowe[x - 1][1] = '0' + nowe[x - 1][1]
          if (nowe[x - 1][1].length < 4) nowe[x - 1][1] = '0' + nowe[x - 1][1]
          nowe[x - 1][2] = td[1].innerHTML;
          nowe[x - 1][3] = td[2].innerHTML;
          if (td[3].innerHTML == 'M') nowe[x - 1][4] = '<span style="color: #006BAD;">' + td[3].innerHTML + '</span>';
           else nowe[x - 1][4] = '<span style="color: #AD00A5;">' + td[3].innerHTML + '</span>';
          nowe[x - 1][5] = td[4].innerHTML;
          nowe[x - 1][6] = td[5].innerHTML;
          nowe[x - 1][7] = td[6].innerHTML;
          nowe[x - 1][8] = td[7].innerHTML;
        }
        nowe.sort();
        table.innerHTML = '<tr class="tblheader"><td width="60">MIEJSCE</td><td width="160">NICK</td><td width="120">RASA</td><td width="50">SEX</td><td><img src="http://r12.bloodwars.interia.pl/gfx/msg3.gif" alt="NAPADNIJ"></td><td width="80">ADRES</td><td width="90">KLAN</td><td width="70">PUNKTY</td></tr>';
        for (x = 0; x < nowe.length; x++) {
          if (x % 2 == 0) even = 'even';
           else even = '';
          uid = nowe[x][2].substring(nowe[x][2].search('uid=') + 4, nowe[x][2].search('">'));
          teraz = new Date();
          teraz.setTime(unsafeWindow.serverTime * 1000); //teraz.getTime()+unsafeWindow.timeDiff*1000);
          teraz = teraz.getDate() + '/' + (teraz.getMonth() + 1) + '/' + teraz.getFullYear();
          testa = GM_getValue(id + 'UM_1_' + uid, 'A:B').split(':') [1];
          testb = GM_getValue(id + 'UM_2_' + uid, 'A:B').split(':') [1];
          atakowany = '';
          if (testa == testb && testb == teraz) atakowany = 'style="filter: alpha(opacity=10); opacity: .1;"';
           else if (testa == teraz || testb == teraz && testa != testb) atakowany = 'style="filter: alpha(opacity=65); opacity: .65;"';
          table.innerHTML += '<tr class="' + even + '" onmouseover="this.className=\'selectedItem\';" onmouseout="this.className=\'' + even + '\';" align="center"><td class="townview" style="text-align: center;">' + nowe[x][9] + '</td><td>' + nowe[x][2] + '</td><td>' + nowe[x][3] + '</td><td>' + nowe[x][4] + '</td><td ' + atakowany + '>' + nowe[x][5] + '</td><td>' + nowe[x][6] + '</td><td>' + nowe[x][7] + '</td><td>' + nowe[x][8] + '</td></tr>';
        }
      }
      if (a.substring(0, 7) == '?a=rank') {
        window.addEventListener('keydown', function (e) {
          var KeyID = (window.event) ? event.keyCode : e.keyCode;
          if (a.search('page=') > 0) {
            page = a.substring(a.search('page=') + 5, a.length);
            page = parseInt(page);
            if (page == 0) page = 1;
          } else page = 1;
          if (e.altKey) switch (KeyID) {
            case 37:
              if (page > 1) page--;
              window.location = '?a=rank&page=' + page;
              break;
            case 39:
              page++;
              window.location = '?a=rank&page=' + page;
              break;
          }
        },
        true);
      }
      function zaznaczacz(txt, check) {
        tr = document.getElementsByTagName('TR');
        for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName('TD');
          if (td.length == 4) if (td[3].innerHTML.length == 19) if (td[1].innerHTML.search(txt) > 0) td[0].getElementsByTagName('input') [0].checked = check;
        }
      }
      function zaznaczacz_res(check) {
        tr = document.getElementsByTagName('TR');
        for (i = 0; i < tr.length; i++) {
          td = tr[i].getElementsByTagName('TD');
          if (td.length == 4) if (td[3].innerHTML.length == 19) if (td[1].innerHTML.search('zasadzkę') < 1 && td[1].innerHTML.search('Arena - ') < 1 && td[1].innerHTML.search(' ofertę handlową') < 1 && td[1].innerHTML.search('Wygrana licytacja!') < 1 && td[1].innerHTML.search('Twoja aukcja została') < 1 && td[1].innerHTML.search('Twoja oferta została') < 1 && td[1].innerHTML.search('Raport z wyprawy.') < 1 && td[1].innerHTML.search('Raport z ekspedycji - ') < 1 && td[1].innerHTML.search('Król Wzgórza - ') < 1 && td[1].innerHTML.search('Oblężenie na ') < 1 && td[1].innerHTML.search('Walka na Arenie ') < 1) td[0].getElementsByTagName('input') [0].checked = check;
        }
      }
      if ('?a=msg' == a.substring(0, 6) || '?mid=' == a.substring(0, 5)) {
        rlc = document.getElementsByClassName('rlc');
        rlc2 = document.getElementsByClassName('rlc');
        if (rlc.length) {
          for (zmiana = 0; zmiana < rlc2.length; zmiana++) {
            var stan = new Array();
            var wyprowadzonych = new Array();
            var kolor = new Array();
            var unik = new Array();
            var kryty = new Array();
            var otrzymane = new Array();
            var uniknione = new Array();
            s = - 1;
            rlc = rlc2[zmiana];
            walka = rlc.getElementsByClassName('atkHit');
            for (i = 0; i < walka.length; i++) {
              kto = walka[i].getElementsByTagName('B') [0].innerHTML;
              if (s == - 1) {
                s = 0;
              } else {
                for (s = 0; s < stan.length; s++) {
                  if (stan[s] == kto) break;
                }
              }
              stan[s] = kto;
              if (walka[i].innerHTML.search('Żar Krwi') < 1) {
                if (wyprowadzonych[s] == undefined) wyprowadzonych[s] = 1;
                 else wyprowadzonych[s]++;
                if (unik[s] == undefined) unik[s] = 0;
                if (walka[i].innerHTML.search(' zostaje zranion') > 0) {
                  komu = walka[i].getElementsByTagName('b') [walka[i].getElementsByTagName('b').length - 2].innerHTML;
                  for (d = 0; d < stan.length; d++) {
                    if (stan[d] == komu) break;
                  }
                  stan[d] = komu;
                  kolor[d] = 'defHit';
                  if (wyprowadzonych[d] == undefined) wyprowadzonych[d] = 0;
                  if (kryty[d] == undefined) kryty[d] = 0;
                  if (unik[d] == undefined) unik[d] = 0;
                  if (otrzymane[d] == undefined) otrzymane[d] = 0;
                  otrzymane[d]++;
                } else
                if (walka[i].innerHTML.search(' trafi') > 0 && walka[i].innerHTML.search('luzję') == - 1) {
                  unik[s]++;
                  komu = walka[i].getElementsByTagName('b') [walka[i].getElementsByTagName('b').length - 1].innerHTML;
                  for (d = 0; d < stan.length; d++) {
                    if (stan[d] == komu) break;
                  }
                  stan[d] = komu;
                  kolor[d] = 'defHit';
                  if (wyprowadzonych[d] == undefined) wyprowadzonych[d] = 0;
                  if (kryty[d] == undefined) kryty[d] = 0;
                  if (unik[d] == undefined) unik[d] = 0;
                  if (uniknione[d] == undefined) uniknione[d] = 0;
                  uniknione[d]++;
                }
                if (kryty[s] == undefined) kryty[s] = 0;
                if (walka[i].innerHTML.search('cios krytyczny') > 0) kryty[s]++;
              }
              kolor[s] = 'atkHit';
            }
            walka = rlc.getElementsByClassName('defHit');
            for (i = 0; i < walka.length; i++) {
              kto = walka[i].getElementsByTagName('B') [0].innerHTML;
              if (s == - 1) {
                s = 0;
              } else {
                for (s = 0; s < stan.length; s++) {
                  if (stan[s] == kto) break;
                }
              }
              stan[s] = kto;
              if (walka[i].innerHTML.search('Żar Krwi') < 1) {
                if (wyprowadzonych[s] == undefined) wyprowadzonych[s] = 1;
                 else wyprowadzonych[s]++;
                if (unik[s] == undefined) unik[s] = 0;
                if (walka[i].innerHTML.search(' zostaje zranion') > 0) {
                  komu = walka[i].getElementsByTagName('b') [walka[i].getElementsByTagName('b').length - 2].innerHTML;
                  for (d = 0; d < stan.length; d++) {
                    if (stan[d] == komu) break;
                  }
                  stan[d] = komu;
                  kolor[d] = 'atkHit';
                  if (wyprowadzonych[d] == undefined) wyprowadzonych[d] = 0;
                  if (kryty[d] == undefined) kryty[d] = 0;
                  if (unik[d] == undefined) unik[d] = 0;
                  if (otrzymane[d] == undefined) otrzymane[d] = 0;
                  otrzymane[d]++;
                } else
                if (walka[i].innerHTML.search(' trafi') > 0 && walka[i].innerHTML.search('luzję') == - 1) {
                  unik[s]++;
                  komu = walka[i].getElementsByTagName('b') [walka[i].getElementsByTagName('b').length - 1].innerHTML;
                  for (d = 0; d < stan.length; d++) {
                    if (stan[d] == komu) break;
                  }
                  stan[d] = komu;
                  kolor[d] = 'atkHit';
                  if (wyprowadzonych[d] == undefined) wyprowadzonych[d] = 0;
                  if (kryty[d] == undefined) kryty[d] = 0;
                  if (unik[d] == undefined) unik[d] = 0;
                  if (uniknione[d] == undefined) uniknione[d] = 0;
                  uniknione[d]++;
                }
                if (kryty[s] == undefined) kryty[s] = 0;
                if (walka[i].innerHTML.search('cios krytyczny') > 0) kryty[s]++;
              }
              kolor[s] = 'defHit';
            }
            sum = document.getElementsByClassName('ambsummary');
            if (!sum.length) {
              sum = document.getElementsByClassName('result') [document.getElementsByClassName('result').length - 1];
              raport = '<br><table border="0" style="border-collapse: collapse; background: black; text-align: center;" width="100%"><tr>';
            } else {
              raport = '<br><table border="0" style="border-collapse: collapse; text-align: center;" width="95%"><tr>';
              sum = sum[zmiana];
            }
            for (i = 0; i < stan.length; i++) {
              if (i % 3 == 0) raport += '</tr><tr>';
              niceOne = '';
              niceKryty = true;
              niceIlosc = true;
              for (x = 0; x < stan.length; x++) {
                if (x != i) {
                  if (kryty[x] > kryty[i]) niceKryty = false;
                  if (wyprowadzonych[x] > wyprowadzonych[i]) niceIlosc = false;
                }
              }
              if (niceKryty || niceIlosc) niceOne = 'border: 2px white dotted;';
              raport += '<td style="' + niceOne + ' padding: 6px; text-align: center;"><b class="' + kolor[i] + '">' + stan[i] + '</b><BR>';
              raport += 'Trafione: <b>' + (parseInt(wyprowadzonych[i]) - parseInt(unik[i])) + '</b> / <b>' + wyprowadzonych[i] + '</b> ';
              if ((wyprowadzonych[i] - unik[i]) / wyprowadzonych[i] * 100) raport += '(' + (((wyprowadzonych[i] - unik[i]) / wyprowadzonych[i] * 100).toFixed(2)) + '%)';
              raport += '<br>Krytycznych: <b>' + kryty[i] + '</b> ';
              if (kryty[i]) raport += '(' + (((kryty[i]) / (wyprowadzonych[i] - unik[i]) * 100).toFixed(2)) + '%)';
              if (uniknione[i] == undefined) uniknione[i] = 0;
              if (otrzymane[i] == undefined) otrzymane[i] = 0;
              raport += '<br>Otrzymane: <b>' + otrzymane[i] + '</b> / <b>' + (otrzymane[i] + uniknione[i]) + '</b>';
              if (otrzymane[i] / (otrzymane[i] + uniknione[i]) * 100) raport += ' (' + (otrzymane[i] / (otrzymane[i] + uniknione[i]) * 100).toFixed(2) + '%)';
              raport += '</td>';
            }
            sum.innerHTML += raport + '</tr></table>';
          }
        }
      }
      if ('?a=msg' == a.substring(0, 6) || '?mid=' == a.substring(0, 5)) {
        add = document.getElementsByClassName('top-options') [0];
        add2 = document.createElement('SPAN');
        add2.innerHTML = '<br><br><center>ZAZNACZ: <input type="checkbox" id="zaz_wyp"> WYPRAWY <input type="checkbox" id="zaz_ata"> ATAKI <input type="checkbox" id="zaz_exp"> EXPY-OBLEGI <input type="checkbox" id="zaz_han"> HANDEL <input type="checkbox" id="zaz_res"> POZOSTAŁE</center>';
        add.appendChild(add2);
        document.getElementById('zaz_han').addEventListener('click', function () {
          zaznaczacz(' ofertę handlową', this.checked);
          zaznaczacz('Wygrana licytacja!', this.checked);
          zaznaczacz('Twoja aukcja została', this.checked);
          zaznaczacz('Twoja oferta została', this.checked);
        }, false);
        document.getElementById('zaz_ata').addEventListener('click', function () {
          zaznaczacz('zasadzkę', this.checked);
        }, false);
        document.getElementById('zaz_res').addEventListener('click', function () {
          zaznaczacz_res(this.checked);
        }, false);
        document.getElementById('zaz_wyp').addEventListener('click', function () {
          zaznaczacz('Raport z wyprawy.', this.checked);
        }, false);
        document.getElementById('zaz_exp').addEventListener('click', function () {
          zaznaczacz('Raport z ekspedycji - ', this.checked);
          zaznaczacz('Arena - ', this.checked);
          zaznaczacz('Król Wzgórza - ', this.checked);
          zaznaczacz('Oblężenie na ', this.checked);
          zaznaczacz('Walka na Arenie ', this.checked);
        }, false);
      }
      if ('?a=rank' == a.substring(0, 7)) {
        stats = document.getElementsByClassName('stats-player') [0].innerHTML;
        stats = stats.replace(/&lt;/gi, '<');
        stats = stats.replace(/&gt;/gi, '>');
        pts = (stats.substring((stats.search('<strong>') + 8), stats.search('</strong>')).replace(/ /gi, '')) / 1000;
        lev = Math.floor(Math.log(0.0011 * (pts * 1000 + 999)) / Math.log(1.1));
        table = document.getElementsByClassName('rank') [0];
        poz = table.getElementsByTagName('tr');
        t_lev = Math.ceil(lev / 100 * 84.5);
        for (x = 1; x < poz.length; x++) {
          td = poz[x].getElementsByTagName('td');
          e_pts = td[7].innerHTML;
          e_lev = Math.floor(Math.log(0.0011 * (e_pts * 1000 + 999)) / Math.log(1.1));
          if (e_lev >= t_lev) td[1].getElementsByTagName('b') [0].innerHTML += ' <span style="color: gray; float: right;">E</span>';
          taga = td[1].getElementsByTagName('a') [0];
          taga.onmouseover = function () {
            document.getElementById('chmurka').style.display = '';
            document.getElementById('chmurka').style.left = parseInt(document.getElementById('x').innerHTML) + 'px';
            document.getElementById('chmurka').style.top = parseInt(document.getElementById('y').innerHTML) + 10 + 'px';
            document.getElementById('chmurka').innerHTML = 'NOTATKI: ' + this.innerHTML + '<br/><br/>' + GM_getValue(id + 'UM_notka' + this.id.substring(1), 'brak (dodaj w profilu gracza)').replace(/\n/g, '<br />');
          }
          taga.onmouseout = function () {
            document.getElementById('chmurka').style.display = 'none';
          }
        }
      }
      if (a.substring(0, 11) == '?a=auction&' && a.search('&t=69') > 0) {
        if (a.search('addfav=') > 0)
        table = document.getElementsByTagName('TABLE') [6];
         else
        table = document.getElementsByTagName('TABLE') [5];
        if (document.getElementsByTagName('TABLE') [3].innerHTML.search('Twoja oferta zo') > 0) {
          table = document.getElementsByTagName('TABLE') [6];
        }
        tr = table.getElementsByTagName('TR');
        for (i = 1; i < tr.length; i++) {
          td = tr[i].getElementsByTagName('TD');
          sztuk = td[1].innerHTML.substring(td[1].innerHTML.search(':') + 1).replace('</span>', '');
          oferta = td[3].innerHTML.replace(' ', '').replace(' ', '');
          bid = td[6].innerHTML.substring(td[6].innerHTML.search('showBidForm') + 12);
          bid = bid.substr(0, bid.search(';') - 1);
          if (td[2].innerHTML == '0')
          td[1].innerHTML += ' (' + unsafeWindow.auData[parseInt(bid)].minPrize + ' - ' + (Math.round(unsafeWindow.auData[parseInt(bid)].minPrize / sztuk)) + '/szt)';
           else
          td[1].innerHTML += ' (' + unsafeWindow.auData[parseInt(bid)].minPrize + ')';
          if (parseInt(oferta) > 0) {
            td[3].innerHTML += ' - ' + (Math.round(oferta / sztuk)) + '/szt';
            td[6].innerHTML = td[6].innerHTML.replace(/LICYTUJ/g, 'LICYTUJ <b>' + (Math.round(oferta / sztuk * 1.05)) + '</b>/szt');
          }
        }
      }
      if (a.substring(0, 11) == '?a=townview') {
        var scriptCode = new Array();
        scriptCode.push('function showSector(str, sec) {');
        scriptCode.push('\tif (str < 1) str = 1;');
        scriptCode.push('\tif (str > 5) str = 5;');
        scriptCode.push('\tvar maxSectors = getMaxSectors(str);');
        scriptCode.push('\tif (sec < 1) sec = maxSectors;');
        scriptCode.push('\tif (sec > maxSectors) sec = 1;');
        scriptCode.push('\tif (str == strefa && sec == sektor) return false;');
        scriptCode.push('\tstrefa = str;');
        scriptCode.push('\tsektor = sec;');
        //		scriptCode.push('	document.getElementById(\'please_wait\').style.visibility = \'visible\';');
        //	scriptCode.push('	for (x = 1; x <= 5; x++) document.getElementById(\'btn_\'+x).disabled = true;');
        //scriptCode.push('	getFile(\'_ajaxTownView.php?strefa=\'+strefa+\'&sektor=\'+sektor);');
        scriptCode.push('lockButtons();getSectorData(strefa, sektor);');
        scriptCode.push('\tsetTimeout(function () { stats = document.getElementsByClassName(\'stats-player\')[0].innerHTML;');
        scriptCode.push('\tstats = stats.replace(/&lt;/gi,"<");');
        scriptCode.push('\tstats = stats.replace(/&gt;/gi,">");');
        scriptCode.push('\tpts = (stats.substring((stats.search(\'<strong>\')+8),stats.search(\'</strong>\')).replace(/ /gi,"")) / 1000;');
        scriptCode.push('\tlev = Math.floor(Math.log(0.0011*(pts*1000+999))/Math.log(1.1));');
        scriptCode.push('\tt_lev = Math.ceil(lev / 100 * 84.5);');
        scriptCode.push('\ts = document.getElementsByClassName(\'panel-cell\')[0].innerHTML;');
        scriptCode.push('\taj = parseInt(s.split(\'/\')[0])+1;');
        scriptCode.push('\tns = ((parseInt((s.split(\'/\')[1]-1)*12))+parseInt(s.split(\'/\')[2]));');
        scriptCode.push('\ttr = document.getElementsByTagName(\'tr\');');
        scriptCode.push('\tfor (i=0; i<tr.length; i++) {');
        scriptCode.push('\t\tif (tr[i].style.height=="16px") {');
        scriptCode.push('\t\t\ttd = tr[i].getElementsByTagName(\'td\');');
        scriptCode.push('\t\t\tif (td[3].getElementsByTagName(\'b\').length) {');
        scriptCode.push('\t\t\t\te_pts = td[3].getElementsByTagName(\'b\')[0].innerHTML;');
        scriptCode.push('\t\t\t\te_lev = Math.floor(Math.log(0.0011*(e_pts*1000+999))/Math.log(1.1));');
        scriptCode.push('\t\t\t\tif (e_lev>=t_lev) td[1].innerHTML+=\' <span style="color: gray; float: right;">E</span>\';');
        scriptCode.push('\t\t\t\tif (s.split(\'/\')[0]!=5) if (td[8].innerHTML.length==27) td[8].innerHTML=\'<a href="?a=townview&amp;strefa=\'+aj+\'&amp;sektor=\'+ns+\'">\'+aj+\'/\'+ns+\'</a>\';');
        scriptCode.push('\t\t\t}');
        scriptCode.push('\t\t}');
        scriptCode.push('\t} },1000);');
        scriptCode.push('}');
        var script = document.createElement('script');
        script.innerHTML = scriptCode.join('\n');
        scriptCode.length = 0;
        document.getElementsByTagName('head') [0].appendChild(script);
        stats = document.getElementsByClassName('stats-player') [0].innerHTML;
        stats = stats.replace(/&lt;/gi, '<');
        stats = stats.replace(/&gt;/gi, '>');
        pts = (stats.substring((stats.search('<strong>') + 8), stats.search('</strong>')).replace(/ /gi, '')) / 1000;
        lev = Math.floor(Math.log(0.0011 * (pts * 1000 + 999)) / Math.log(1.1));
        t_lev = Math.ceil(lev / 100 * 84.5);
        s = document.getElementsByClassName('panel-cell') [0].innerHTML;
        aj = parseInt(s.split('/') [0]) + 1;
        ns = ((parseInt((s.split('/') [1] - 1) * 12)) + parseInt(s.split('/') [2]));
        tr = document.getElementsByTagName('tr');
        for (i = 0; i < tr.length; i++) {
          if (tr[i].style.height == '16px') {
            td = tr[i].getElementsByTagName('td');
            if (td[3].getElementsByTagName('b').length) {
              e_pts = td[3].getElementsByTagName('b') [0].innerHTML;
              e_lev = Math.floor(Math.log(0.0011 * (e_pts * 1000 + 999)) / Math.log(1.1));
              if (e_lev >= t_lev) td[1].innerHTML += ' <span style="color: gray; float: right;">E</span>';
              if (s.split('/') [0] != 5) {
                if (td[8].innerHTML.length < 59) td[8].innerHTML = '<a href="?a=townview&amp;strefa=' + aj + '&amp;sektor=' + ns + '">' + aj + '/' + ns + '</a>';
              }
              taga = td[1].getElementsByTagName('a');
              if (taga.length) {
                taga = taga[0];
                taga.onmouseover = function () {
                  document.getElementById('chmurka').style.display = '';
                  document.getElementById('chmurka').style.left = parseInt(document.getElementById('x').innerHTML) + 'px';
                  document.getElementById('chmurka').style.top = parseInt(document.getElementById('y').innerHTML) + 10 + 'px';
                  document.getElementById('chmurka').innerHTML = 'NOTATKI: ' + this.innerHTML + '<br/><br/>' + GM_getValue(id + 'UM_notka' + this.id.substring(1), 'brak (dodaj w profilu gracza)');
                }
                taga.onmouseout = function () {
                  document.getElementById('chmurka').style.display = 'none';
                }
              }
            }
          }
        }
      }
      if ('?a=build' == a.substring(0, 8)) {
        bld = document.getElementsByClassName('bldprogress');
        if (bld.length) {
          GM_setValue(id + 'UM_bld', true);
          script = bld[0].getElementsByTagName('SCRIPT') [0];
          //			bldtime = script.innerHTML.substring(script.innerHTML.search('timeFields.bld_action = ')+24,script.innerHTML.search(';'));
          var bldtime = 0;
          var p = document.getElementById('bld_action').innerText.split(':');
          b = 0;
          if (p[0].length > 5) {
            b = 24 * 60 * 60 * p[0].split(' ') [0];
            p[0] = p[0].split(' ') [2];
          }
          bldtime = parseInt(p[2]) + parseInt(p[1] * 60) + parseInt(p[0] * 60 * 60) + b;
          var pozniej = new Date();
          pozniej.setTime(unsafeWindow.serverTime * 1000); //pozniej.getTime()+unsafeWindow.timeDiff*1000);
          pozniej.setSeconds(pozniej.getSeconds() + parseInt(bldtime));
          rok = pozniej.getFullYear();
          miesiac = pozniej.getMonth() + 1;
          dzien = pozniej.getDate();
          godzina = pozniej.getHours();
          minuty = pozniej.getMinutes();
          sekundy = pozniej.getSeconds();
          GM_setValue(id + 'UM_brok', rok);
          GM_setValue(id + 'UM_bmiesiac', miesiac);
          GM_setValue(id + 'UM_bdzien', dzien);
          GM_setValue(id + 'UM_bgodzina', godzina);
          GM_setValue(id + 'UM_bminuty', minuty);
          GM_setValue(id + 'UM_bsekundy', sekundy);
          pozniej = new Date();
          pozniej.setTime((unsafeWindow.serverTime + bldtime) * 1000); //pozniej.getTime()+unsafeWindow.timeDiff*1000);
          bld[0].innerHTML += '<br>Data ukończenia: <span class="bldtimeleft">' + pozniej + '</span>';
        } else {
          GM_setValue(id + 'UM_brok', - 1);
          GM_setValue(id + 'UM_bmiesiac', 0);
          GM_setValue(id + 'UM_bdzien', 0);
          GM_setValue(id + 'UM_bgodzina', 0);
          GM_setValue(id + 'UM_bminuty', 0);
          GM_setValue(id + 'UM_bsekundy', 0);
          GM_setValue(id + 'UM_bld', false);
        }
      }
      if ('t' != a[a.length - 1] && '?a=profile&uid=' == a.substring(0, 15)) {
        divs = document.getElementsByTagName('div');
        user = a.substring(15);
        i = 29;
        if (divs[i].innerHTML.length < 400) i++;
        divs[i].innerHTML += '<fieldset class="profile" style="text-align: center; height: 150px;"><legend class="profile">NOTATKI</legend><textarea id="UM_notka' + user + '" style="width: 100%; height: 96%;">' + GM_getValue(id + 'UM_notka' + user, '') + '</textarea></fieldset>';
        teraz = new Date();
        teraz.setTime(unsafeWindow.serverTime * 1000); //teraz.getTime()+unsafeWindow.timeDiff*1000);
        teraz = teraz.getDate() + '/' + (teraz.getMonth() + 1) + '/' + teraz.getFullYear();
        testa = GM_getValue(id + 'UM_1_' + user, 'A:B').split(':') [1];
        testb = GM_getValue(id + 'UM_2_' + user, 'C:D').split(':') [1];
        if (testa == testb && testb == teraz) document.getElementsByTagName('BODY') [0].innerHTML = document.getElementsByTagName('BODY') [0].innerHTML.replace('NAPADNIJ', '<s>NAPADNIJ</s>');
         else if (testa == teraz || testb == teraz && testa != testb) document.getElementsByTagName('BODY') [0].innerHTML = document.getElementsByTagName('BODY') [0].innerHTML.replace('NAPADNIJ', 'NAPADNIJ 2GI RAZ');
        document.getElementById('UM_notka' + user).addEventListener('keyup', function () {
          GM_setValue(id + 'UM_notka' + user, this.value);
        }, false);
      }
      if (a == '?a=training' || a == '?a=training&do=stats') {
        // mod zliczanie kosztu trenu
        suma = 0;
        for (var i = 1; i <= document.getElementById('stat_str').innerHTML; i++) suma += Math.ceil(10 * Math.pow(1.2, i - 1));
        for (var i = 1; i <= document.getElementById('stat_dex').innerHTML; i++) suma += Math.ceil(10 * Math.pow(1.2, i - 1));
        for (var i = 1; i <= document.getElementById('stat_def').innerHTML; i++) suma += Math.ceil(10 * Math.pow(1.2, i - 1));
        for (var i = 1; i <= document.getElementById('stat_lok').innerHTML; i++) suma += Math.ceil(10 * Math.pow(1.2, i - 1));
        for (var i = 1; i <= document.getElementById('stat_chr').innerHTML; i++) suma += Math.ceil(10 * Math.pow(1.2, i - 1));
        for (var i = 1; i <= document.getElementById('stat_rep').innerHTML; i++) suma += Math.ceil(10 * Math.pow(1.2, i - 1));
        for (var i = 1; i <= document.getElementById('stat_per').innerHTML; i++) suma += Math.ceil(10 * Math.pow(1.2, i - 1));
        for (var i = 1; i <= document.getElementById('stat_int').innerHTML; i++) suma += Math.ceil(10 * Math.pow(1.2, i - 1));
        for (var i = 1; i <= document.getElementById('stat_wis').innerHTML; i++) suma += Math.ceil(10 * Math.pow(1.2, i - 1));
        t = 0;
        suma2 = '';
        suma = suma + '';
        for (i = suma.length - 1; i >= 0; i--) {
          suma2 = suma[i] + suma2;
          t++;
          if (t == 3) {
            t = 0;
            suma2 = ' ' + suma2;
          }
        }
        version = document.getElementById('content-mid');
        ver2 = document.createElement('SPAN');
        ver2.innerHTML = '<br><center>W SUMIE W TRENINGU: &nbsp;&nbsp;&nbsp;<b>' + suma2 + '</b></center>';
        version.appendChild(ver2, version.firstChild);
      }
      if (GM_getValue(id + 'UM_OP_donesound', false)) {
        //	unsafeWindow.refLinks.spy_0 += '<audio src="'+GM_getValue(id+'UM_urlsound','http://mega.szajb.us/juenizer/unmod/sound.mp3')+'" autoplay=true></audio>';
        //	unsafeWindow.refLinks.spy_1 += '<audio src="'+GM_getValue(id+'UM_urlsound','http://mega.szajb.us/juenizer/unmod/sound.mp3')+'" autoplay=true></audio>';
        //	unsafeWindow.refLinks.spy_2 += '<audio src="'+GM_getValue(id+'UM_urlsound','http://mega.szajb.us/juenizer/unmod/sound.mp3')+'" autoplay=true></audio>';
        //	unsafeWindow.refLinks.spy_3 += '<audio src="'+GM_getValue(id+'UM_urlsound','http://mega.szajb.us/juenizer/unmod/sound.mp3')+'" autoplay=true></audio>';
        //	unsafeWindow.refLinks.spy_4 += '<audio src="'+GM_getValue(id+'UM_urlsound','http://mega.szajb.us/juenizer/unmod/sound.mp3')+'" autoplay=true></audio>';
        //	unsafeWindow.refLinks.spy_5 += '<audio src="'+GM_getValue(id+'UM_urlsound','http://mega.szajb.us/juenizer/unmod/sound.mp3')+'" autoplay=true></audio>';
        //	unsafeWindow.refLinks.quest_timeleft+='<audio src="'+GM_getValue(id+'UM_urlsound','http://mega.szajb.us/juenizer/unmod/sound.mp3')+'" autoplay=true></audio>';
        //	unsafeWindow.refLinks.atkTime+='<audio src="'+GM_getValue(id+'UM_urlsound','http://mega.szajb.us/juenizer/unmod/sound.mp3')+'" autoplay=true ></audio>';
      }
      var scriptCode = new Array(); // this is where we are going to build our new script
      scriptCode.push('function sboxRefreshMsgIcon(type) {');
      if (GM_getValue(id + 'UM_OP_clansound', true)) {
        scriptCode.push('if (sboxNewMsg[type] == true) { if (type==\'clan\') { notification(\'Nowa wiadomość na kanale KLANOWYM\'); if (document.getElementById(\'audioid\')) { elem = document.getElementById(\'audioid\'); elem.parentNode.removeChild(elem); }; document.body.appendChild( document.createElement( \'div\')); document.body.lastChild.innerHTML = \'<audio id="audioid" src="' + GM_getValue(id + 'UM_urlclansound', 'http://www.sounds4email.com/wav/hex4.mp3') + '" autoplay=true></audio>\' } };');
      }
      if (GM_getValue(id + 'UM_OP_globalsound', true)) {
        scriptCode.push('if (sboxNewMsg[type] == true) { if (type==\'global\') { notification(\'Nowa wiadomość na kanale GLOBALNYM\'); if (document.getElementById(\'audioid\')) { elem = document.getElementById(\'audioid\'); elem.parentNode.removeChild(elem); }; document.body.appendChild( document.createElement( \'div\')); document.body.lastChild.innerHTML = \'<audio id="audioid" src="' + GM_getValue(id + 'UM_urlglobalsound', 'http://www.sounds4email.com/wav/hex4.mp3') + '" autoplay=true></audio>\' } };');
      }
      scriptCode.push('$$(\'sbox_msg_\'+type+\'_img\').src = \'gfx/sbox_msg\'+ ((sboxNewMsg[type] == true) ? \'_new\' : \'\') + \'.png\'; }');
      var script = document.createElement('script'); // create the script element
      script.innerHTML = scriptCode.join('\n'); // add the script code to it
      scriptCode.length = 0; // recover the memory we used to build the script
      document.getElementsByTagName('head') [0].appendChild(script);
      if (GM_getValue(id + 'UM_OP_shoutboxclan', false)) {
        // mod shoutboxa
        document.getElementById('sbox_icons_clan').click();
        document.getElementById('sbox_msg_clan').style.opacity = '0.85';
        document.getElementById('sbox_msg_global').style.opacity = '0.85';
      }      // mod czas exp i kw wszedzie

      krok = GM_getValue(id + 'UM_krok', - 1);
      k = false;
      var n_kw = false;
      var teraz = new Date();
      teraz.setTime(unsafeWindow.serverTime * 1000); //teraz.getTime()+unsafeWindow.timeDiff*1000);
      if (krok != - 1) {
        pozniejk = new Date(GM_getValue(id + 'UM_krok', 0), GM_getValue(id + 'UM_kmiesiac', 0) - 1, GM_getValue(id + 'UM_kdzien', 0), GM_getValue(id + 'UM_kgodzina', 0), GM_getValue(id + 'UM_kminuty', 0), GM_getValue(id + 'UM_ksekundy', 0));
        var roznicak = pozniejk.getTime() - teraz.getTime();
        if (roznicak > 0) {
          k = true;
          var i2 = setInterval(function () {
            roznicak -= 1000;
            if (roznicak <= 0) {
              if (!n_kw) {
                n_kw = true;
                notification('KW dobiegło końca');
              }
              document.getElementById('kw').innerHTML = 'FINISH!';
              roznicak = 0;
              clearInterval(i2);
            } else {
              timek = roznicak;
              var days = Math.floor(timek / 86400000);
              var hours = Math.floor((timek - (86400000 * days)) / 3600000);
              if (hours < 10) hours = '0' + hours;
              var minutes = Math.floor((timek - (86400000 * days) - (3600000 * hours)) / 60000);
              if (minutes < 10) minutes = '0' + minutes;
              var seconds = (timek - (86400000 * days) - (3600000 * hours) - (60000 * minutes)) / 1000;
              seconds = Math.floor(seconds);
              if (seconds < 10) seconds = '0' + seconds;
              document.getElementById('kw').innerHTML = hours + ':' + minutes + ':' + seconds;
            }
          }, 1000);
        }
      }
      erok = GM_getValue(id + 'UM_erok', - 1);
      e = false;
      var n_exp = false;
      if (erok != - 1) {
        poznieje = new Date(GM_getValue(id + 'UM_erok', 0), GM_getValue(id + 'UM_emiesiac', 0) - 1, GM_getValue(id + 'UM_edzien', 0), GM_getValue(id + 'UM_egodzina', 0), GM_getValue(id + 'UM_eminuty', 0), GM_getValue(id + 'UM_esekundy', 0));
        var roznicae = poznieje.getTime() - teraz.getTime();
        if (roznicae > 0) {
          e = true;
          var i = setInterval(function () {
            roznicae -= 1000;
            if (roznicae <= 0) {
              if (!n_exp) {
                n_exp = true;
                notification('Expedycja dobiegła końca');
              }
              document.getElementById('exp').innerHTML = 'FINISH!';
              roznicae = 0;
              clearInterval(i);
            } else {
              timee = roznicae;
              var days = Math.floor(timee / 86400000);
              var hours = Math.floor((timee - (86400000 * days)) / 3600000);
              if (hours < 10) hours = '0' + hours;
              var minutes = Math.floor((timee - (86400000 * days) - (3600000 * hours)) / 60000);
              if (minutes < 10) minutes = '0' + minutes;
              var seconds = (timee - (86400000 * days) - (3600000 * hours) - (60000 * minutes)) / 1000;
              seconds = Math.floor(seconds);
              if (seconds < 10) seconds = '0' + seconds;
              document.getElementById('exp').innerHTML = hours + ':' + minutes + ':' + seconds;
            }
          }, 1000);
        }
      }
      brok = GM_getValue(id + 'UM_brok', - 1);
      b = false;
      var n_bud = false
      if (brok != - 1) {
        poznieje = new Date(GM_getValue(id + 'UM_brok', 0), GM_getValue(id + 'UM_bmiesiac', 0) - 1, GM_getValue(id + 'UM_bdzien', 0), GM_getValue(id + 'UM_bgodzina', 0), GM_getValue(id + 'UM_bminuty', 0), GM_getValue(id + 'UM_bsekundy', 0));
        var roznicab = poznieje.getTime() - teraz.getTime();
        if (roznicab > 0) {
          b = true;
          var i3 = setInterval(function () {
            roznicab -= 1000;
            if (roznicab <= 0) {
              if (!n_bud) {
                n_bud = true;
                notification('Budowa budynku dobiegła końca');
              }
              document.getElementById('unmodbld').innerHTML = 'FINISH!';
              roznicab = 0;
              clearInterval(i3);
            } else {
              timeb = roznicab;
              var days = Math.floor(timeb / 86400000);
              var hours = Math.floor((timeb - (86400000 * days)) / 3600000);
              if (hours < 10) hours = '0' + hours;
              var minutes = Math.floor((timeb - (86400000 * days) - (3600000 * hours)) / 60000);
              if (minutes < 10) minutes = '0' + minutes;
              var seconds = (timeb - (86400000 * days) - (3600000 * hours) - (60000 * minutes)) / 1000;
              seconds = Math.floor(seconds);
              if (seconds < 10) seconds = '0' + seconds;
              if (days) document.getElementById('unmodbld').innerHTML = days + 'd ' + hours + ':' + minutes + ':' + seconds;
               else document.getElementById('unmodbld').innerHTML = hours + ':' + minutes + ':' + seconds;
            }
          }, 1000);
        }
      }
      arok = GM_getValue(id + 'UM_arok', - 1);
      au = false;
      var n_auk = false;
      if (arok != - 1) {
        poznieje = new Date(GM_getValue(id + 'UM_arok', 0), GM_getValue(id + 'UM_amiesiac', 0) - 1, GM_getValue(id + 'UM_adzien', 0), GM_getValue(id + 'UM_agodzina', 0), GM_getValue(id + 'UM_aminuty', 0), GM_getValue(id + 'UM_asekundy', 0));
        var roznicaa = poznieje.getTime() - teraz.getTime();
        if (roznicaa > 0) {
          au = true;
          var i4 = setInterval(function () {
            roznicaa -= 1000;
            if (roznicaa <= 0) {
              if (!n_auk) {
                n_auk = true;
                notification('Obserwowana aukcja prawdopodobnie dobiegła końca');
              }
              document.getElementById('unmodauk').innerHTML = 'FINISH?';
              roznicaa = 0;
              clearInterval(i4);
            } else {
              timea = roznicaa;
              przypomnienie = timea / 1000;
              if (przypomnienie == 3 * 60) {
                notification('Uwaga: prawdopodobny koniec aukcji za 3 minuty!');
              } else
              if (przypomnienie == 2 * 60) {
                notification('Uwaga: prawdopodobny koniec aukcji za 2 minuty!');
              } else
              if (przypomnienie == 1 * 60) {
                notification('Uwaga: prawdopodobny koniec aukcji za 1 minute!');
              }
              var days = Math.floor(timea / 86400000);
              var hours = Math.floor((timea - (86400000 * days)) / 3600000);
              if (hours < 10) hours = '0' + hours;
              var minutes = Math.floor((timea - (86400000 * days) - (3600000 * hours)) / 60000);
              if (minutes < 10) minutes = '0' + minutes;
              var seconds = (timea - (86400000 * days) - (3600000 * hours) - (60000 * minutes)) / 1000;
              seconds = Math.floor(seconds);
              if (seconds < 10) seconds = '0' + seconds;
              if (days) document.getElementById('unmodauk').innerHTML = days + 'd ' + hours + ':' + minutes + ':' + seconds;
               else document.getElementById('unmodauk').innerHTML = hours + ':' + minutes + ':' + seconds;
            }
          }, 1000);
        }
      }
      div = document.getElementsByClassName('remark') [0];
      div.innerHTML += '&nbsp;';
      if (e) div.innerHTML += '<a href="?a=cevent"><span style="color: red;">&nbsp;EXP:</span> <span  class="enabled" id="exp">00:00:00</span></a>&nbsp;&nbsp;';
      if (k) div.innerHTML += '<a href="?a=swr"><span style="color: red;">KW:</span> <span  class="enabled" id="kw">00:00:00</span></a>&nbsp;&nbsp;';
      if (b) div.innerHTML += '<a href="?a=build"><span style="color: red;">BUDOWA:</span> <span  class="enabled" id="unmodbld">00:00:00</span></a>&nbsp;&nbsp;';
      if (au) div.innerHTML += '<a href="?a=auction"><span style="color: red;">AUKCJA:</span> <span class="enabled" id="unmodauk">00:00:00</span></a>&nbsp;&nbsp;';
      if (GM_getValue(id + 'UM_OP_alarm', false)) {
        i0 = '';
        if (GM_getValue(id + 'UM_OP_alarm_h', 0) < 10) i0 = '0';
        i1 = '';
        if (GM_getValue(id + 'UM_OP_alarm_m', 0) < 10) i1 = '0';
        div.innerHTML += '<span id="alarm" style="color: red;">ALARM: ' + i0 + GM_getValue(id + 'UM_OP_alarm_h', 0) + ':' + i1 + GM_getValue(id + 'UM_OP_alarm_m', 0) + '</span>';
        setInterval(function () {
          if (GM_getValue(id + 'UM_OP_alarm', false)) {
            teraz = new Date();
            teraz.setTime(unsafeWindow.serverTime * 1000); //teraz.getTime()+unsafeWindow.timeDiff*1000);
            h = teraz.getHours();
            m = teraz.getMinutes();
            if (parseInt(h) == GM_getValue(id + 'UM_OP_alarm_h', 0) && GM_getValue(id + 'UM_OP_alarm_m', 0) == parseInt(m)) {
              GM_setValue(id + 'UM_OP_alarm_on', true);
              GM_setValue(id + 'UM_OP_alarm', false);
            }
          }
        }, 1000);
      }
      if (a == '?a=training&do=evo') {
      }
      if (a == '?a=tasks') {
        function juenOpis(text, text2) {
          document.getElementsByTagName('BODY') [0].innerHTML = document.getElementsByTagName('BODY') [0].innerHTML.replace(text, '<span class="lnk" onmouseover="return overlib(\'' + text2 + '\',HAUTO,WIDTH,500,CAPTIONFONTCLASS,\'action-caption\',TEXTFONTCLASS,\'overlibText overlibExtended\',VAUTO,CAPTION,\'OPIS ZADANIA\');" onmouseout="nd();">' + text + '</span>');
        }        // s2 (opisy zbieral Prime Lust - https://docs.google.com/document/d/1eMFHEc0ieY_254Qsjs-90peIv2olOjEYpvsVYC1wQSU/edit?pli=1	

        juenOpis('Zdobądź poziom 80.', 'W wypadku gdy mamy poziom wyższy, wystarczy wbić jeszcze jeden by zaliczyło zadanie.');
        juenOpis('Udowodnij swój zmysł do biznesu. Wybuduj Cmentarz oraz Bank Krwi.', 'Gdy mamy wybudowany, wystarczy podnieść o 1 poziom by zaliczyło zadanie.');
        juenOpis('Zdobądź serca i umysły tłumu. Osiągnij 50 pkt. charyzmy.', 'Gdy mamy już wymaganą wartość cechy, wystarczy podnieść o 1, bądź awansować o 1 poziom,  by zaliczyło zadanie.');
        juenOpis('Zakon Świętego Benedykta wysłał przeciwko Tobie skrytobójcę. Znajdź go w Okolicach Miasta.', 'Na przeciwnika trafiamy na bliskiej wyprawie, dosyć łatwe to zaliczenia.');
        juenOpis('Zostań władcą ciemnych zaułków Miasta. Osiągnij 55 pkt. wpływów.', 'Gdy mamy już wymaganą wartość cechy, wystarczy podnieść o 1.');
        juenOpis('Twój kwadrat został najechany przez paladynów z Zakonu Świętego Benedykta. Przygotuj się na ostateczną bitwę między Światłem i Ciemnością...', 'Zadanie oblężeniowe - NIE wbijamy arkan gdyż przeciwnicy mają wyssanie mocy na poziomie +10.');
        juenOpis('Wielki Mistrz Zakonu uszedł z życiem z poprzedniej batalii. Znajdziesz go gdzieś na zakazanym pustkowiu. Udaj się tam i ofiaruj mu szansę spotkania z jego bogiem...', 'Pielgrzymka - mocny pajac do ubicia, 10% że na niego trafimy.');
        juenOpis('Zostań Władcą Miasta. Tu i teraz.', 'Należy awansować do pierwszej strefy.');
        juenOpis('Pan Ciemności wymaga, aby w jego Katedrze nigdy nie brakowało krwi. Jako członek Wewnętrznego Kręgu jesteś zobowiązany do złożenia ofiary. Zgromadź 800 000 litrów krwi, po czym złóż ofiarę 10% tej wartości.', 'Zbieramy zasoby, klikamy link, zadanie wykonane.');
        juenOpis('Pan Ciemności wymaga, aby w jego Katedrze nigdy nie brakowało krwi. Jako członek Wewnętrznego Kręgu jesteś zobowiązana do złożenia ofiary. Zgromadź 800 000 litrów krwi, po czym złóż ofiarę 10% tej wartości.', 'Zbieramy zasoby, klikamy link, zadanie wykonane.');
        juenOpis('Prawdziwe doświadczenie można zdobyć tylko przemierzając niebezpieczne szlaki. Wykonaj co najmniej 15 udanych pielgrzymek w nieznane.', 'Wykonujemy 15 udanych pielgrzymek będąc na 2s. Licznik jest podany przy zadaniu. ');
        juenOpis('Dotarły do Ciebie plotki o dziwnej anomalii, znajdującej się gdzieś na pustkowiach. Znajdź i wyjaśnij tajemnicze zjawisko.', 'Pielgrzymka, gdzie wynik jest średnią testu inteligencji i wiedzy.');
        juenOpis('Twoi ludzie donieśli, że przy rabusiu zabitym w okolicach miasta znaleziono list. Z listu wynika, że twoja prawnuczka Anhala więziona jest na Polach Lęgowych. Zorganizuj ekspedycję ratunkową.', 'Zakładamy Ekspedycję na Lokację zwaną Pola Lęgowe (losowa lokacja) gdzie ubić mamy Gargulce. Podobnie jak z Duchem jest 10% ze na nie trafimy');
        juenOpis('Całe miasto patrzy na członków Rady. Daj znak swej wielkości i zapewnij krew dla swoich poddanych. Rozbuduj Szpital na poziom 7 oraz Rzeźnie na poziom 22.', 'Gdy oba mamy wybudowane, wystarczy podnieść z nich o 1 poziom by zaliczyło zadanie.');
        juenOpis('Sława to nie wszystko, wampiry podążą tylko za kimś naprawdę potężnym. Zdobądź 84 poziom.', 'W wypadku gdy mamy poziom wyższy, wystarczy wbić jeszcze jeden by zaliczyło zadanie.');
        // s3 (opisy zbieral Prime Lust - https://docs.google.com/document/d/1eMFHEc0ieY_254Qsjs-90peIv2olOjEYpvsVYC1wQSU/edit?pli=1
        juenOpis('Wykonaj wszystkie Pielgrzymki w Nieznane.', 'W przypadku, gdy są już wykonane, wystarczy zaliczyć dowolną by zaliczyło zadanie.');
        juenOpis('W nieznanych zakątkach pustkowia Wilczy Król zbiera stada, by się z Tobą rozprawić. Zakradnij się do jego siedliska i skróć jego męki. Legendy głoszą, że zabić go można tylko srebrną kulą...', 'Na Wilczego Króla idziemy na pielgrzymkę. Bunkier + mocna broń palna polecane.');
        juenOpis('Zdobądź poziom 50.', 'W wypadku gdy mamy poziom wyższy, wystarczy wbić jeszcze jeden by zaliczyło zadanie.');
        juenOpis('Wybuduj wszystkie budynki z trzeciej strefy.', 'Gdy mamy wybudowane, wystarczy podnieść dowolny by zaliczyło zadanie.');
        juenOpis('Od dawna wiadomo, że najlepszą obroną jest atak. Rozbuduj Sklep z Bronią do 5 poziomu.', 'Gdy mamy wybudowany, wystarczy podnieść o 1 poziom by zaliczyło zadanie.');
        juenOpis('Ostatnio przeciwnicy zawsze są o krok przed Tobą. Rozbuduj Dziennik Lokalny do 4 poziomu, by skutecznie przeciwdziałać wrogim szpiegom.', 'Gdy mamy wybudowany, wystarczy podnieść o 1 poziom by zaliczyło zadanie.');
        juenOpis('Twoi agenci odkryli kryjówkę wrogiej szajki szpiegowskiej. Zajmują jedną z kamienic w Twoim kwadracie. Zorganizuj oblężenie i wybij ich jak robaki.', 'Zadanie oblężeniowe - obojętnie którą opcję wybieramy je zakładając.');
        juenOpis('Od samego początku byłeś pewny, że ten czas kiedyś nastanie... Dostań się do Rady, awansując do Drugiej Strefy!', 'Ze strefy 3 należy udać się do strefy 2.');
        juenOpis('Od samego początku byłaś pewna, że ten czas kiedyś nastanie... Dostań się do Rady, awansując do Drugiej Strefy!', 'Ze strefy 3 należy udać się do strefy 2.');
        juenOpis('Obowiązkiem każdego wampira wysokiej rangi jest dostarczenie ludzi do posługi w Katedrze. Zbierz 500 000 ludzi i oddaj Katedrze w ofierze 10% z nich.', 'Zbieramy ludzi, klikamy w link, zadanie wykonane :)');
        juenOpis('Minęło już wiele dni, odkąd Twój syn wyruszył na wyprawę w nieznane, a Ty nadal nie otrzymałeś od niego żadnych wieści. Pełen niepokoju postanawiasz udać się na poszukiwania.', 'Pielgrzymka ze testem gdzie wynik procentowy jest średnią wiedzy i inteligencjii, mamy 10% szans że trafimy na ten test.');
        juenOpis('Minęło już wiele dni, odkąd Twój syn wyruszył na wyprawę w nieznane, a Ty nadal nie otrzymałaś od niego żadnych wieści. Pełna niepokoju postanawiasz udać się na poszukiwania.', 'Pielgrzymka ze testem gdzie wynik procentowy jest średnią wiedzy i inteligencjii, mamy 10% szans że trafimy na ten test.');
        juenOpis('Wpływy, władza, splendor... aby to wszystko utrzymać, potrzebujesz pieniędzy. Aby pokryć swoje zwiększone wydatki, musisz zwiększyć swoje dochody. Rozbuduj dom publiczny na poziom 14.', 'Gdy mamy wybudowany, wystarczy podnieść o 1 poziom by zaliczyło zadanie.');
        juenOpis('Twoja pozycja, sława i bogactwo sprawiły, że jesteś uważany za jednego z bardziej wpływowych wampirów w mieście. Jeden z członków Rady poprosił Ciebie o pomoc w zniszczeniu szajki mutantów pustoszących szlaki handlowe do miasta.', 'Daleka wyprawa - należy zgładzić mutanta (Czy trafi się herszt, czy jeden z popleczników to loteria. Dużo sposta/zwinki + ogrom dmg zalecane), 10% że trafimy na przeciwnika.');
        juenOpis('Twoja pozycja, sława i bogactwo sprawiły, że jesteś uważana za jednego z bardziej wpływowych wampirów w mieście. Jeden z członków Rady poprosił Ciebie o pomoc w zniszczeniu szajki mutantów pustoszących szlaki handlowe do miasta.', 'Daleka wyprawa - należy zgładzić mutanta (Czy trafi się herszt, czy jeden z popleczników to loteria. Dużo sposta/zwinki + ogrom dmg zalecane), 10% że trafimy na przeciwnika.');
        juenOpis('Dokonaj heroicznego czynu. Tylko to przyciągnie pod Twój sztandar potężne wampiry.', 'Należy zaliczyć dowolną pielgrzymkę.');
        // s4 (opisy zbieral Prime Lust - https://docs.google.com/document/d/1eMFHEc0ieY_254Qsjs-90peIv2olOjEYpvsVYC1wQSU/edit?pli=1	
        juenOpis('Jest kilka sposobów zdobywania reputacji w świecie umarlaków. Jednym z nich jest posiadanie potężnych artefaktów. Ukończ łącznie 4 Pielgrzymki w Nieznane.', 'Zaliczyć 4 pielgi. W wypadku gdy mamy już zaliczone więcej, a dopiero odblokowaliśmy zadanie wystarczy zaliczyć dowolną pielgrzymkę');
        juenOpis('Masz pieniądze i wiesz jak je zdobywać. Teraz musisz zyskać reputację wśród Trzody. Podnieś poziom Pośredniaka do 15 poziomu.', 'Gdy zadanie nie jest zaliczone, wystarczy podnieść o 1 poziom pośredniak.');
        juenOpis('Przywódca okolicznego stada wilkołaków poprzysiągł Ci zemstę za zniszczenie watahy w Twoim kwadracie. Najlepiej zrobisz, znajdując jego kryjówkę gdzieś Daleko od Miasta i kończąc jego mizerną egzystencję.', 'Należy zgładzić przeciwnika na Dalekiej Wyprawie.');
        juenOpis('Ludzie w Twoim kwadracie zaczęli zapadać na dziwną chorobę. Twoi szpiedzy sugerują, byś szukał odpowiedzi w Okolicach Miasta.', 'Walka z Ghullami - ze zwględu na wysoką odporność zaleca się ponad 50zwinki oraz broń biała, min 6 ataków. ');
        juenOpis('Ludzie w Twoim kwadracie zaczęli zapadać na dziwną chorobę. Twoi szpiedzy sugerują, byś szukała odpowiedzi w Okolicach Miasta.', 'Walka z Ghullami - ze zwględu na wysoką odporność zaleca się ponad 50zwinki oraz broń biała, min 6 ataków. ');
        juenOpis('Zdobądź poziom 35.', 'W wypadku gdy mamy poziom wyższy, wystarczy wbić jeszcze jeden by zaliczyło zadanie.');
        juenOpis('Gdy byłeś na wyprawie, wampir-uzurpator zajął Twoją siedzibę. Odbij ją wraz z członkami klanu.', 'Zadanie oblężeniowe - obojętnie którą opcję wybieramy je zakładając.');
        juenOpis('Gdy byłaś na wyprawie, wampir-uzurpator zajął Twoją siedzibę. Odbij ją wraz z członkami klanu.', 'Zadanie oblężeniowe - obojętnie którą opcję wybieramy je zakładając.');
        juenOpis('Wybuduj wszystkie budynki ze strefy czwartej.', 'Gdy mamy wybudowane, wystarczy podnieść dowolny by zaliczyło zadanie.');
        juenOpis('Władza!! Awansuj do strefy Trzeciej. I zasiądź w Wewnętrznym Kręgu.', 'Ze strefy 4 należy udać się do strefy 3.');
        juenOpis('Jak nakazuje wampirza tradycja, każdy nowo mianowany Inkwizytor wyprawia wystawną ucztę, na którą zaprasza wszystkich mieszkańców miasta. Wampir twojej rangi musi wykazać się bogactwem i hojnością. Zgromadź na swoim koncie 5 000 000 PLN i złóż ofiarę w wysokości 10% tej sumy.', 'Zbieramy kasę, klikamy w link i zalicza zadanie.');
        juenOpis('Twoi zwiadowcy poinformowali Cię o dziwnych zjawiskach zachodzących na Wielkim Stepie. Sugerują, żebyś zbadał sytuację zanim będzie za późno.', 'Expedycja na Wielki Step (lokacja Hydry) - mamy 10% na trafienie na Ducha (minimum 140zwinki 70 sposta 8000HP)');
        juenOpis('Twoi zwiadowcy poinformowali Cię o dziwnych zjawiskach zachodzących na Wielkim Stepie. Sugerują, żebyś zbadała sytuację zanim będzie za późno.', 'Expedycja na Wielki Step (lokacja Hydry) - mamy 10% na trafienie na Ducha (minimum 140zwinki 70 sposta 8000HP)');
        juenOpis('Ważne osobistości mają zawsze wielu wrogów, dlatego przydaje się dodatkowa ochrona. Rozbuduj Posterunek Policji na 18 poziom i Schronisko na 14 poziom.', 'Gdy mamy wybudowane, wystarczy podnieść dowolny by zaliczyło zadanie.');
        juenOpis('Kolejne zmasakrowane ciała, ludzie okrutnie pozbawieni wnętrzności, korpusy bez głów. Co się dzieje? Wyślij szpiegów do swojego kwadratu i sprawdź kto za tym stoi.', 'Należy przeszpiegować skutecznie swój kwadrat (dowolna opcja, szansa na udane szpiegowanie i tak wynosi JEDEN procent), powtarzać do skutku.');
        juenOpis('Informacje uzyskane od młodego człowieka prowadzą do karczmy na przedmieściach miasta. Wraz z grupą innych wampirów sprawdźcie, co tam się dzieje.', 'Oblężenie na Miecz Inkwizycji - liczba przeciwników to 26-28 (mocna ekipa białasów 180 zwinki i palniaków 110 sposta).');
        juenOpis('Gdy obudziłeś się wieczorem, na biurku znalazłeś dziwny list. Poznaczony śladami krwi, zawierał w sobie tylko słowa: "Ratuj", "Uwięziona" i "Daleko". Pisane w pośpiechu, w różnych miejscach pergaminu. Cóż to może oznaczać?', 'Należy wykonać udaną daleką (10% szans ze trafimy na ten test), gdzie testem jest średnia Zwinności i Intela.');
        juenOpis('Gdy obudziłaś się wieczorem, na biurku znalazłeś dziwny list. Poznaczony śladami krwi, zawierał w sobie tylko słowa: "Ratuj", "Uwięziona" i "Daleko". Pisane w pośpiechu, w różnych miejscach pergaminu. Cóż to może oznaczać?', 'Należy wykonać udaną daleką (10% szans ze trafimy na ten test), gdzie testem jest średnia Zwinności i Intela.');
        juenOpis('Wykaż się męstwem. Tylko to przyciągnie pod Twój sztandar wytrawnych łowców.', 'Wykonaj daleką wyprawę');
        // s5 
        juenOpis('Twój stan majątkowy budzi nasz niepokój, Akolito. Masz za zadanie rozbudować Dom Publiczny do 3 poziomu.', 'Jeśli nie spełniasz wymagań, może warto jest skorzystać z opcji burzenia?');
        juenOpis('Krew jest źródłem naszej siły. Dokonaj rozbudowy Rzeźni do 5 poziomu. ', 'Należy wybudować rzeźnie na piąty poziom, jeśli mamy już taki osiągniety wystarczy wybudować poziom wyżej.');
        juenOpis('Zdobądź 10 poziom.', 'Osiągnij 10 poziom swojej postaci. Wystarczy wykonywać ataki oraz wyprawy.');
        juenOpis('Groźny mutant przedostał się ze strefy zewnętrznej, trzeba go znaleźć i powstrzymać zanim wyrządzi więcej szkód. Na jego trop możesz wpaść, przeszukując Okolice Miasta.', 'Masz szanse na trafienie tego przeciwnika na bliskich wyprawach.');
        juenOpis('Zbadaj dokładnie Okolice Miasta. ', 'Wykonaj (pozytywnie) wszystkie wyprawy bliskie,');
        juenOpis('Każdy szanujący się wampir powinien posiadać kolekcję artefaktów. Ukończ wszystkie Dalekie Wyprawy. ', 'Każdy szanujący się wampir powinien posiadać kolekcję artefaktów. Ukończ wszystkie Dalekie Wyprawy.');
        juenOpis('Tylko najlepsi z najlepszych są warci tego zadania i tylko oni posiadają przedmioty Mocy. Odbądź udaną Pielgrzymkę w Nieznane. ', 'Wykonaj jedną udaną Pielgrzymkę w nieznane ');
        juenOpis('W naszym kwadracie grasuje wataha wilkołaków. Trzeba je zabić, atakując je we własnej kryjówce. ', 'Załóż oblężenie na swój kwadrat [urząd zasadzkę --> przygotuj oblężenie]. Warto jest zabrać ze sobą klanowiczy.');
        juenOpis('Pieniądze i handel bronią to czynniki, które pozwolą Ci przetrwać. Osiągnij stabilizację, rozbudowując Dom Publiczny na 10 poziom oraz stawiając Stary Rynek.', 'Wybuduj Dom publiczny na poziom 10 oraz postaw budynek Stary Rynek. Jeśli już masz te budynki, wystarczy podnieść jeden z nich o poziom ');
        juenOpis('Urodziłeś się po to, by awansować. Udowodnij to, awansując do IV strefy.', 'Załóż oblężenie na kwadrat w IV strefie. Zajmując terytorium wykonasz to zadanie.');
        juenOpis('Urodziłaś się po to, by awansować. Udowodnij to, awansując do IV strefy.', 'Załóż oblężenie na kwadrat w IV strefie. Zajmując terytorium wykonasz to zadanie.');
        juenOpis('Rozszerz swoje wpływy w świecie mroku zdobywając wasala (możesz tego dokonać korzystając z linka ref. w Sali Tronowej). ', 'Zaproś przyjaciela do gry używając linku referencyjnego z Sali Tronowej.');
        // moria/necro mix (+s1)
        juenOpis('Pieniądze i handel bronią to czynniki, które pozwolą Ci przetrwać. Osiągnij stabilizację, rozbudowując Dom Publiczny na 8 poziom oraz Postój Taxi na 2 poziom.', 'Wybuduj Dom publiczny na poziom 8 oraz Postój Taxi na poziom 2. Jeśli już masz te budynki, wystarczy podnieść jeden z nich o poziom');
        juenOpis('Prestiż wśród wampirów to nie tylko bogactwo i władza. Tylko wielki wojownik wzbudza prawdziwy respekt.', 'Wygraj 15 walk pod rząd urządzając zasadzkę. Walki w obronie się nie liczą.');
        juenOpis('Pomimo ostrzeżeń doradców, wyprawiasz się czasami na samotne spacery w okolice miasta. Przypominają Ci czasy, kiedy byłeś młodym wampirem, który przybył do miasta marząc o sławie i władzy.', 'Należy pokonać assasyna na bliskiej wyprawie');
        juenOpis('Pomimo ostrzeżeń doradców, wyprawiasz się czasami na samotne spacery w okolice miasta. Przypominają Ci czasy, kiedy byłaś młodym wampirem, który przybył do miasta marząc o sławie i władzy.', 'Należy pokonać assasyna na bliskiej wyprawie');
        juenOpis('Zdobądź 89 poziom.', 'Zdobądź 89 poziom.');
        juenOpis('Wszystkie zagadkowe historie nagle stały się jasne. U wrót miasta stanęła armia potężnych magów, mających przed sobą tylko jeden cel - doszczętne zniszczenie miasta i "wyzwolenie" ludzi od gnębiących ich wampirów. Czas, by wszystkie wampiry zjednoczyły się w walce przeciwko wspólnemu wrogowi.', 'Oblężenie na własny kwadrat przeciw Bractwu Chaosu.');
      }
      if (a == '?a=profile') {
        ref = document.getElementsByClassName('content-mid') [0].getElementsByTagName('A') [1].innerHTML;
        num = ref.substring(ref.search('uid=') + 4);
        div = document.getElementsByClassName('profile') [0];
        div.innerHTML += '<BR>Sygnaturka <a href="http://zk.nakoz.org/' + num + id + 'p1.png">http://zk.nakoz.org/' + num + id + 'p1.png</a>:<br><img width="328" src="http://zk.nakoz.org/' + num + id + 'p1.png">';
      }
      if (a == '?a=quest') {
        if (document.getElementById('quest_timeleft')) {
          czas = Math.floor(Date.now() / 1000);
          var mid = '?a=msg&do=view&mid=' + document.getElementsByTagName('body') [0].innerHTML.substring(9 + document.getElementsByTagName('body') [0].innerHTML.indexOf('addMsgId'), document.getElementsByTagName('body') [0].innerHTML.indexOf(')', document.getElementsByTagName('body') [0].innerHTML.indexOf('addMsgId'))) + '&type=1';
          var przeliczone = 0;
          var p = document.getElementById('quest_timeleft').innerText.split(':');
          przeliczone = parseInt(p[2]) + parseInt(p[1] * 60) + parseInt(p[0] * 60 * 60);
          czas += przeliczone;
          GM_setValue(id + 'UM_wyprawa', czas);
          GM_setValue(id + 'UM_mid', mid);
        } else {
          GM_setValue(id + 'UM_wyprawa', 0);
        }        //	version = document.getElementById('content-mid');
        //		ver2 = document.createElement('SPAN');
        //		ver2.innerHTML='<br><center><iframe scrolling=no src="http://mega.szajb.us/juenizer/unmod/ver.php?mini=yes&ver='+UM_VER+'" width="240" style="margin-top: -20px;" frameborder=0 height="28"></iframe></center>';
        //	version.insertBefore(ver2,version.firstChild);

      }
      test = GM_getValue(id + 'UM_wyprawa', 0);
      if (test > 0) {
        if (test - Math.floor(Date.now() / 1000) > 0) {
          setTimeout(function () {
            if (GM_getValue(id + 'UM_wyprawa', 0)) {
              notification('Wyprawa zakończona');
              GM_setValue(id + 'UM_wyprawa', 0);
            }
          }, (test - Math.floor(Date.now() / 1000)) * 1000);
        } else {
          GM_setValue(id + 'UM_wyprawa', 0);
        }
      }
      if (a == '?a=ambush') {
        test = document.getElementsByClassName('players');
        if (test.length) {
          uid = test[0].href.substr(test[0].href.search('uid=') + 4);
          sid = 6;
          for (sid = 6; sid < document.getElementsByTagName('script').length; sid++) {
            if (document.getElementsByTagName('script') [sid].innerHTML.search('\'atkTimeLeft\', ') != - 1) break;
          }
          if (sid !== document.getElementsByTagName('script').length) {
            if (document.getElementsByTagName('script') [sid].innerHTML.search('\'atkTimeLeft\', ') != - 1) {
              suid = document.getElementsByTagName('table');
              for (i = 0; i < suid.length; i++) {
                if (suid[i].innerHTML.search('VS.') > 0) {
                  pl = suid[i].getElementsByClassName('players') [0].href;
                  uid = pl.substr(pl.search('uid=') + 4);
                }
              }
              var mid = '?a=msg&do=view&mid=' + document.getElementsByTagName('body') [0].innerHTML.substring(9 + document.getElementsByTagName('body') [0].innerHTML.indexOf('addMsgId'), document.getElementsByTagName('body') [0].innerHTML.indexOf(')', document.getElementsByTagName('body') [0].innerHTML.indexOf('addMsgId'))) + '&type=1';
              //				mid = document.getElementsByTagName('script')[sid].innerHTML.substr(document.getElementsByTagName('script')[sid].innerHTML.search('a=msg&do=view&mid=')+18);
              //			mid = mid.substr(0,mid.search('"'));
              teraz = new Date();
              teraz.setTime(unsafeWindow.serverTime * 1000); //teraz.getTime()+unsafeWindow.timeDiff*1000);
              teraz = teraz.getDate() + '/' + (teraz.getMonth() + 1) + '/' + teraz.getFullYear();
              if (GM_getValue(id + 'UM_1_' + uid, 'A:B') != mid + ':' + teraz && GM_getValue(id + 'UM_2_' + uid, 'A:B') != mid + ':' + teraz) {
                GM_setValue(id + 'UM_2_' + uid, GM_getValue(id + 'UM_1_' + uid, 'A:B'));
                GM_setValue(id + 'UM_1_' + uid, mid + ':' + teraz);
              }
            }
          }
        }
      }      /*
	if ("?a=msg&do=view&mid="==a.substring(0,19) && GM_getValue(id+'UM_OP_wyparch',true)) {
		mid = a.replace('?a=msg&do=view&mid=','').replace('&type=1','');
		c = document.getElementById('content-mid');
		if (c.innerHTML.search("msg-content msg-quest")>0) {
			divs = c.getElementsByTagName('DIV');
			for (i=0; i<divs.length; i++) {
				if (divs[i].style.marginTop=="10px") {
					//raport z wyprawy
					link = divs[i].getElementsByTagName('A')[0].innerHTML;
					key = link.substring(link.search('key=')+4);
					c.innerHTML+='<iframe width=100% frameborder="0" height="28" scrolling="no" src="http://mega.szajb.us/juenizer/unmod/staty_wypraw.php?id='+id+'&key='+key+'&mid='+mid+'"></iframe>';
				}
			}
		}
	}
	*/
      // dupa, pozdrawiam czytaczy kodów ;)
      // dodatkowe funkcje do debugowania unmoda! wylacznie na haslo

      if (GM_getValue(id + 'UM_pass', '').length >= 7) {
        encrypted = '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';
        var decrypted = CryptoJS.AES.decrypt(encrypted, GM_getValue(id + 'UM_pass', '')).toString(CryptoJS.enc.Utf8);
        eval(decrypted);
        encrypted = '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';
        var decrypted = CryptoJS.AES.decrypt(encrypted, GM_getValue(id + 'UM_pass', '')).toString(CryptoJS.enc.Utf8).replace('alert(1)', '');
        eval(decrypted);
        encrypted = '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';
        var decrypted = CryptoJS.AES.decrypt(encrypted, GM_getValue(id + 'UM_pass', '')).toString(CryptoJS.enc.Utf8);
        eval(decrypted);
      }
      setInterval(function () {
        if (GM_getValue(id + 'UM_OP_alarm_on', false)) {
          if (document.getElementById('alm')) {
          } else {
            d = document.getElementById('content-mid');
            span = document.createElement('SPAN');
            span.id = 'alm';
            span.innerHTML = '<center style="font-size: 20px; font-weight: bold;"><a class="active" id="_alarm" href="javascript:">ALARM (kliknij by wyłączyć)</a><embed src="' + GM_getValue(id + 'UM_urlsound', 'http://mega.szajb.us/juenizer/unmod/sound.mp3') + '" hidden=true autostart=true loop=true></center><br>';
            d.insertBefore(span, d.firstChild);
            document.getElementById('_alarm').addEventListener('click', function () {
              GM_setValue(id + 'UM_OP_alarm_on', false);
              document.getElementById('alm').innerHTML = '';
              document.getElementById('alm').style.display = 'none';
            }, false);
          }
        } else {
          if (document.getElementById('alm')) {
            document.getElementById('alm').innerHTML = '';
            document.getElementById('alm').style.display = 'none';
          }
        }
      }, 2000);
      window.addEventListener('keydown', function (e) {
        var KeyID = (window.event) ? event.keyCode : e.keyCode;
        if (e.altKey) switch (KeyID) {
          case 48:
            window.location = '?a=' + GM_getValue(id + 'UM_OP_key_0', 'auction');
            break;
          case 49:
            window.location = '?a=' + GM_getValue(id + 'UM_OP_key_1', 'msg');
            break;
          case 50:
            window.location = '?a=' + GM_getValue(id + 'UM_OP_key_2', 'aliance');
            break;
          case 51:
            3
            window.location = '?a=' + GM_getValue(id + 'UM_OP_key_3', 'equip');
            break;
          case 52:
            window.location = '?a=' + GM_getValue(id + 'UM_OP_key_4', 'ambush');
            break;
          case 53:
            window.location = '?a=' + GM_getValue(id + 'UM_OP_key_5', 'quest');
            break;
          case 54:
            window.location = '?a=' + GM_getValue(id + 'UM_OP_key_6', 'cevent');
            break;
          case 55:
            window.location = '?a=' + GM_getValue(id + 'UM_OP_key_7', 'swr');
            break;
          case 56:
            window.location = '?a=' + GM_getValue(id + 'UM_OP_key_8', 'rank');
            break;
          case 57:
            window.location = '?a=' + GM_getValue(id + 'UM_OP_key_9', 'townview');
            break;
        }
      },
      true);
        var i = setInterval(function () {
          //document.getElementById('sbox_global_container').innerHTML = document.getElementById('sbox_global_container').innerHTML.replace(/&nbsp;<img src="gfx\/sbox_arrow.png" alt=" -> ">/g,":<BR>");
          sb = document.getElementById('sbox_global_container');
          a = sb.getElementsByTagName('a');
          for (i = 0; i < a.length; i++) {
            if ((a[i].href.substring(a[i].href.length - 4, a[i].href.length) == '.jpg' || a[i].href.substring(a[i].href.length - 4, a[i].href.length) == '.png' || a[i].href.substring(a[i].href.length - 4, a[i].href.length) == '.gif') && a[i].id != 'done') {
              a[i].id = 'done';
              iframe = document.createElement('IMG');
              iframe.width = '265';
              iframe.src = a[i].href;
              a[i].appendChild(iframe);
              unsafeWindow.scrollSbox('global');
            }
            if (a[i].href.substring(0, 23) == 'https://www.youtube.com' && a[i].id != 'done' && GM_getValue(id + 'UM_OP_youtube', true)) {
              a[i].id = 'done';
              iframe = document.createElement('IFRAME');
              iframe.width = '265';
              iframe.height = '199';
              iframe.frameBorder = '0';
              iframe.allowfullscreen = true;
              iframe.src = 'http://www.youtube.com/embed/' + a[i].href.substring(a[i].href.search('v=') + 2, a[i].href.search('v=') + 2 + 11);
              a[i].appendChild(iframe);
              unsafeWindow.scrollSbox('global');
            }
            if (a[i].href.search('bloodwars.interia.pl/showmsg') != -1 && a[i].href.search('mid=') != -1 && a[i].href.search('key=') != -1 && a[i].id != 'done') {
              a[i].id = 'done';
              iframe = document.createElement('IFRAME');
              iframe.width = '100%';
              iframe.height = '14';
              iframe.frameBorder = '0';
              iframe.allowfullscreen = true;
              iframe.scrolling = 'no';
              
              rid = a[i].href.substring(7,a[i].href.search('.bloodwars'));
              key = a[i].href.substring(a[i].href.search('key=')+4,a[i].href.search('key=')+20);
              mid = a[i].href.substring(a[i].href.search('mid=')+4,a[i].href.search('mid=')+20);
              mid = mid.substring(0,mid.search("&"));
              a[i].innerHTML='';
              iframe.src = "http://zk.nakoz.org/unmod/reader.php?id="+rid+"&key="+key+"&mid="+mid;
              a[i].appendChild(iframe);
              unsafeWindow.scrollSbox('global');
            }
          }
          sb = document.getElementById('sbox_clan_container');
          a = sb.getElementsByTagName('a');
          for (i = 0; i < a.length; i++) {
            if ((a[i].href.substring(a[i].href.length - 4, a[i].href.length) == '.jpg' || a[i].href.substring(a[i].href.length - 4, a[i].href.length) == '.png' || a[i].href.substring(a[i].href.length - 4, a[i].href.length) == '.gif') && a[i].id != 'done') {
              a[i].id = 'done';
              iframe = document.createElement('IMG');
              iframe.width = '265';
              iframe.src = a[i].href;
              a[i].appendChild(iframe);
              unsafeWindow.scrollSbox('clan');
            }
            if (a[i].href.substring(0, 23) == 'https://www.youtube.com' && a[i].id != 'done' && GM_getValue(id + 'UM_OP_youtube', true)) {
              a[i].id = 'done';
              iframe = document.createElement('IFRAME');
              iframe.width = '265';
              iframe.height = '199';
              iframe.frameBorder = '0';
              iframe.allowfullscreen = true;
              iframe.src = 'http://www.youtube.com/embed/' + a[i].href.substring(a[i].href.search('v=') + 2, a[i].href.search('v=') + 2 + 11);
              a[i].appendChild(iframe);
              unsafeWindow.scrollSbox('clan');
            }
            if (a[i].href.search('bloodwars.interia.pl/showmsg') != -1 && a[i].href.search('mid=') != -1 && a[i].href.search('key=') != -1 && a[i].id != 'done') {
              a[i].id = 'done';
              iframe = document.createElement('IFRAME');
              iframe.width = '100%';
              iframe.height = '14';
              iframe.frameBorder = '0';
              iframe.allowfullscreen = true;
              iframe.scrolling = 'no';
              
              rid = a[i].href.substring(7,a[i].href.search('.bloodwars'));
              key = a[i].href.substring(a[i].href.search('key=')+4,a[i].href.search('key=')+20);
              mid = a[i].href.substring(a[i].href.search('mid=')+4,a[i].href.search('mid=')+20);
              mid = mid.substring(0,mid.search("&"));
              a[i].innerHTML='';
              iframe.src = "http://zk.nakoz.org/unmod/reader.php?id="+rid+"&key="+key+"&mid="+mid;
              a[i].appendChild(iframe);
              unsafeWindow.scrollSbox('clan');
            }
          }
        }, 1000);
      //}
      div = '';
      inbox = false;
      jednorazy = false;
      div += '<div id="quick_tools4" onclick="jednorazyswitch" style="width: 40px; float: right; height: 20px; border: 1px solid gray; text-align: center; padding: 2px 10px; margin: 2px; cursor: pointer; position: relative; font-size: 14px;">1x</div>';
      div += '<div id="quick_tools3" onclick="inboxswitch" style="width: 40px; float: right; height: 20px; border: 1px solid gray; text-align: center; padding: 2px 10px; margin: 2px; cursor: pointer; position: relative;"><img style="position: absolute; height: 31px; top: -4px; left: 15px;" src="gfx/sbox_msg.png"></div>';
      div += '<div id="quick_tools" style="width: 40px; float: right; height: 20px; border: 1px solid gray; padding: 2px 10px; margin: 2px; cursor: pointer;"><select style="width: 44px; height: 20px; font-size: 8px;" name="toolbar" onchange="document.location.href=\'?a=equip&amp;akey=' + unsafeWindow.accessKey + '&amp;eqset=\'+this.value;"><option value="0">ZB</option>';
      for (x = 1; x <= 20; x++) {
        if (GM_getValue(id + 'OP_equip' + x, false)) {
          div += '<option style="font-size:12px;padding: 4px;" value="' + x + '">' + x + ': ' + GM_getValue(id + 'OP_equip' + x, false) + '</option>';
        }
      }
      div += '</select></div>';
      div += '<div id="quick_tools2" style="width: 40px; height: 20px; float: right; border: 1px solid gray; padding: 2px 10px; margin: 2px; cursor: pointer;"><select style="height: 20px; width: 44px; font-size: 8px;" name="toolbar2" onchange="document.location.href=\'?a=talizman&amp;do=main&amp;akey=' + unsafeWindow.accessKey + '&amp;equipSet=\'+this.value;"><option value="0">TA</option>';
      for (x = 1; x <= 10; x++) {
        if (GM_getValue(id + 'OP_talizman' + x, false)) {
          div += '<option style="font-size:12px;padding: 4px;" value="' + x + '">' + x + ': ' + GM_getValue(id + 'OP_talizman' + x, false) + '</option>';
        }
      }
      div += '</select></div>';
      divs = document.getElementById('sbox');
      divs.style.width = '400px';
      document.getElementById("sbox_global_input").style.width = '89%';
      document.getElementById("sbox_clan_input").style.width = '89%';
      document.getElementById("sbox_msg_global_i").style.marginTop = '-30px';
      document.getElementById("sbox_msg_clan_i").style.marginTop = '-30px';
      document.getElementById("sbox_msg_clan").style.width = '390px';
      document.getElementById("sbox_msg_global").style.width = '390px';
      document.getElementById("sbox_msg_clan").style.marginLeft = '4px';
      document.getElementById("sbox_msg_global").style.marginLeft = '4px';
      document.getElementById("sbox_clan_container").style.width = '100%';
      document.getElementById("sbox_global_container").style.width = '100%';
      divs.innerHTML += div;
      document.getElementById('quick_tools3').addEventListener('click', function () {
        if (inbox) {
          inbox = false;
          var z = (elem = document.getElementById('inboxmod')).parentNode.removeChild(elem);
        } else {
          if (jednorazy) {
            jednorazy = false;
           var z = (elem = document.getElementById('jednorazymod')).parentNode.removeChild(elem);            
          }
          inbox = true;
          iframe = document.createElement('IFRAME');
          iframe.style.width = '340px';
          iframe.id = 'inboxmod';
          iframe.style.height = '500px';
          iframe.frameBorder = 'true';
          iframe.style.backgroundColor = 'black';
          iframe.style.position = 'fixed';
          iframe.style.bottom = '38px';
          iframe.style.zIndex = '10000';
          iframe.style.right = '7px';
          iframe.allowfullscreen = true;
          iframe.src = '?a=msg&unmod=true';
          document.getElementsByTagName('body') [0].appendChild(iframe);
        }
      }, false);
      
      
      document.getElementById('quick_tools4').addEventListener('click', function () {
        if (jednorazy) {
          jednorazy = false;
          var z = (elem = document.getElementById('jednorazymod')).parentNode.removeChild(elem);
        } else {
          if (inbox) {
            inbox = false;
           var z = (elem = document.getElementById('inboxmod')).parentNode.removeChild(elem);            
          }
          jednorazy = true;
          iframe = document.createElement('IFRAME');
          iframe.style.width = '340px';
          iframe.id = 'jednorazymod';
          iframe.style.height = '500px';
          iframe.frameBorder = 'true';
          iframe.style.backgroundColor = 'black';
          iframe.style.position = 'fixed';
          iframe.style.bottom = '38px';
          iframe.style.zIndex = '10000';
          iframe.style.right = '7px';
          iframe.allowfullscreen = true;
          iframe.src = '?a=townshop&unmod=true';
          document.getElementsByTagName('body') [0].appendChild(iframe);
        }
      }, false);
      
      if (a.search('a=ambush&opt=atk') > 0) {
        b = document.getElementsByTagName('body') [0].innerHTML;
        if (b.search('Pozostało ataków: <b>') > 0) {
          GM_setValue(id + 'UM_pa', pozostalo_atakow = b.substring(b.search('Pozostało ataków: <b>') + 21, b.search('Pozostało ataków: <b>') + 23).replace('<', ''));
        }
      }
      if (a.search('a=quest') > 0) {
        b = document.getElementsByTagName('body') [0].innerHTML;
        if (b.search('Pozostało wypraw: <b>') > 0) {
          GM_setValue(id + 'UM_pw', pozostalo_wypraw = b.substring(b.search('Pozostało wypraw: <b>') + 21, b.search('Pozostało wypraw: <b>') + 23).replace('<', ''));
        }
      }
      if (a.search('eqset=') > 0) {
        q = a.substring(a.search('eqset=') + 6, a.search('eqset=') + 8).replace('&', '').replace('a', '');
        GM_setValue(id + 'UM_q', q);
      }
      document.body.appendChild(document.createElement('div'));
      przyp = '';
      var data = new Date();
      dzien = data.getDay();
      if (dzien == 0 || dzien == 1 || dzien == 4) {
        przyp = 'DZIŚ ARENY!<BR/><br/>Pozostało:<br/><b><div id="przyparen"></div></b><br/>';
      }
      document.body.lastChild.innerHTML = '<div style="position: fixed;left:2px;top:2px;">' + przyp + '</b><table border=0><tr><td><small>A:</small></td><td><small>' + GM_getValue(id + 'UM_pa', '?') + '</small></td></tr><tr><td><small>W:</small></td><td><small>' + GM_getValue(id + 'UM_pw', '?') + '</small></td></tr><tr><td><small>Q:</small></td><td><small>' + GM_getValue(id + 'UM_q', '?') + '</small></td></tr></table></div>';
      if (dzien == 0 || dzien == 1 || dzien == 4) {
        data2 = new Date();
        data2.setHours(21);
        data2.setMinutes(10);
        data2.setSeconds(0);
        if (data > data2) {
          document.getElementById('przyparen').innerHTML = 'KONIEC!';
        } else {
          unsafeWindow.gameTimers.registerTimer('przyparen', Math.floor((data2 - data) / 1000));
        }
      }
      if (GM_getValue('about', true)) {
        alert('Dziękuje za wybranie UnModa! Udanych dropów!\n~juen');
        notification('Dzięki temu obszarowi powiadomień będziesz na bieżąco z grą nawet nie mając przeglądarki na wierzchu! :)');
        GM_setValue('about', false);
      }
      wyprawalubatak = '';
      test = GM_getValue(id + 'UM_atak', 0);
      czas = 0;
      if (test > 0) {
        czas = test - Math.floor(Date.now() / 1000);
        tresc = 'ataku';
      }
      test = GM_getValue(id + 'UM_wyprawa', 0);
      if (test > 0) {
        czas = test - Math.floor(Date.now() / 1000);
        tresc = 'wyprawy';
      }
      if (czas > 0) {
        wyprawalubatak = '<a href="' + GM_getValue(id + 'UM_mid') + '"><div title=\'czas do końca ' + tresc + '\'  style="z-index: 1000; position: fixed; box-shadow: 2px 2px 4px black; line-height: 150%; right: 34px; top: 4px; border-radius: 100px;  font-size: 8px; color: yellow; font-weight: bold; padding: 6px; border-color: black; min-height: 15px; min-width: 15px; background-color: rgba(' + (tresc == 'wyprawy' ? '0,255,100' : '255,0,100') + ',0.8); text-align: center;" id="atakwyprawaint">' + czas + '</div></a>';
        var si = setInterval(function () {
          val = document.getElementById('atakwyprawaint').innerHTML;
          if (val > 0) {
            val--;
            document.getElementById('atakwyprawaint').innerHTML = val;
            if (val < 2) {
              document.getElementById('atakwyprawaint').className = 'blink'
            }
          } else if (val == 0) {
            val--;
            if (GM_getValue(id + 'UM_OP_donesound', false)) {
              document.body.appendChild(document.createElement('div'));
              document.body.lastChild.innerHTML = '<audio src="' + GM_getValue(id + 'UM_urlsound', 'http://mega.szajb.us/juenizer/unmod/sound.mp3') + '" autoplay=true></audio>';
            }
            clearInterval(si);
          }
        }, 1000);
      }
      document.body.appendChild(document.createElement('div')); document.body.lastChild.innerHTML = wyprawalubatak + '<div onclick="alert(conowego.split(\'^\').join(\'\\n\'))" style="z-index: 1000; position: fixed; line-height: 150%; cursor: pointer; box-shadow: 2px 2px 4px black; right: 4px; top: 4px; border-radius: 20px; width: 15px; height: 15px; font-size: 8px; color: black; font-weight: bold; padding: 6px; border-color: black; background-color: rgba(255,255,255,0.8); text-align: center;">?</div>';
      e = document.getElementsByClassName('stats-cash') [0].getElementsByClassName('panel-cell') [0].innerHTML.split('\n') [2].replace(/ /g, '').replace('Lgo', '').replace('<br>', '').replace(/\t/g, '').replace(/<(?:.|\n)*?>/gm, '');
      add = document.getElementsByClassName('stats-cash') [0].getElementsByClassName('panel-cell') [0].innerHTML;
      add = add.substring(add.indexOf('+') + 1).replace(/ /g, '').replace('Lgo/h', '').replace(/<(?:.|\n)*?>/gm, '');
      add = Math.floor(add / 900);
      if (e >= 19999) {
        e = document.getElementsByClassName('stats-cash') [0].getElementsByClassName('panel-cell') [0];
        e.innerHTML = '<a href=\'#\' id=\'buyjunk\'>' + e.innerHTML + '</a>';
        document.getElementById('buyjunk').addEventListener('click', function () {
          GM_setValue(id + 'UM_buy_junk', true);
          window.location = '?a=townshop';
        });
      }
      setInterval(function () {
        e = document.getElementsByClassName('stats-cash') [0].getElementsByClassName('panel-cell') [0].innerHTML;
        hajs = parseInt(e.substring(e.indexOf('Money') + 21, e.indexOf(' Lgo')).replace(/ /g, '').replace('<br><spanstyle="font-size:10px;">', ''));
        hajs2 = hajs + add;
        hajs2 = hajs2.toFixed(0).replace(/./g, function (c, i, a) {
          return i && c !== '.' && ((a.length - i) % 3 === 0) ? ' ' + c : c;
        });
        txt = e.substring(0, e.indexOf('Money') + 21) + '<br><span style="font-size:10px;">' + hajs2 + e.substring(e.indexOf(' Lgo'));
        if (hajs > 19999) {
          if (!document.getElementById('buyjunk')) {
            txt = '<a href=\'#\' id=\'buyjunk\'>' + txt + '</a>';
          }
          document.getElementsByClassName('stats-cash') [0].getElementsByClassName('panel-cell') [0].innerHTML = txt;
          document.getElementById('buyjunk').addEventListener('click', function () {
            GM_setValue(id + 'UM_buy_junk', true);
            window.location = '?a=townshop';
          });
        } else {
          document.getElementsByClassName('stats-cash') [0].getElementsByClassName('panel-cell') [0].innerHTML = txt;
        }
      }, 4000);
      if (GM_getValue('about__' + UM_VER.replace('.', '_'), true)) {
        alert(conowego);
        GM_setValue('about__' + UM_VER.replace('.', '_'), false);
      }
    }
    b = document.getElementsByClassName('time-effects') [0].getElementsByTagName('img');
    if (b.length) {
      b[0].addEventListener('click', function () {
        window.location = '?a=newarena&cat=4&t=silver';
      });
    }
    e = document.getElementsByClassName('stats-cash') [0].getElementsByClassName('panel-cell') [0].innerHTML;
    pln = parseInt(e.substring(e.indexOf('Money') + 21, e.indexOf(' Lgo')).replace(/ /g, '').replace('<br><spanstyle="font-size:10px;">', ''));
    ark = document.getElementById('ark_15');
    if (ark && GM_getValue(id + 'UM_OP_ark15', false)) {
      ark.click();
    }
	if (ark && GM_getValue(id + 'UM_OP_ark11', false)) {
      ark.click();
    }
    ark = document.getElementById('ark_6');
    if (ark && GM_getValue(id + 'UM_OP_ark6', false)) {
      unsafeWindow.clickMax(6);
    }
    ark = document.getElementById('ark_13');
    if (ark && GM_getValue(id + 'UM_OP_ark13', false)) {
      unsafeWindow.clickMax(13);
    }
    ark = document.getElementById('ark_3');
    if (ark && GM_getValue(id + 'UM_OP_ark3', false)) {
      unsafeWindow.clickMax(3);
    }
    ark = document.getElementById('ark_5');
    if (ark && GM_getValue(id + 'UM_OP_ark5', false)) {
      unsafeWindow.clickMax(5);
    }
    ark = document.getElementById('ark_7');
    if (ark && GM_getValue(id + 'UM_OP_ark7', false)) {
      unsafeWindow.clickMax(7);
    }
    ark = document.getElementById('ark_8');
    if (ark && GM_getValue(id + 'UM_OP_ark8', false)) {
      unsafeWindow.clickMax(8);
    }
    ark = document.getElementById('ark_14');
    if (ark && GM_getValue(id + 'UM_OP_ark14', false)) {
      unsafeWindow.clickMax(14);
    }
    ark = document.getElementById('ark_1');
    if (ark && GM_getValue(id + 'UM_OP_ark1', false)) {
      unsafeWindow.clickMax(1);
    }
    ark = document.getElementById('ark_2');
    if (ark && GM_getValue(id + 'UM_OP_ark2', false)) {
      unsafeWindow.clickMax(2);
    }
    ark = document.getElementById('ark_9');
    if (ark && GM_getValue(id + 'UM_OP_ark9', false)) {
      unsafeWindow.clickMax(9);
    }
    ark = document.getElementById('noExpOption');
    if (ark && GM_getValue(id + 'UM_OP_noexp', false)) {
      //notification("Zaznaczono rezygnacje z doswiadczenia!");
      ark.click();
    }
    onetime = document.getElementById('onetime');
    if (onetime && a.search('a=quest') == -1) {
      if (GM_getValue(id + 'UM_OP_jednoraz1', 0) > 0) {
        raz = GM_getValue(id + 'UM_OP_jednoraz1', 0);
        razt = GM_getValue(id + 'UM_OP_jednoraz1tier', 0);
        if (razt == 3) {
          koszt = 45000;
        } else if (razt == 2) {
          koszt = 22500;
        } else {
          koszt = 5000;
        }
        if (koszt > pln) {
          raz = GM_getValue(id + 'UM_OP_jednoraz2', 0);
          razt = GM_getValue(id + 'UM_OP_jednoraz2tier', 0);
          if (razt == 3) {
            koszt = 45000;
          } else if (razt == 2) {
            koszt = 22500;
          } else {
            koszt = 5000;
          }
          if (raz > 0) {
            if (koszt <= pln) {
              notification('Ustawiono zapasowy jednoraz');
              var scriptCode = new Array();
              scriptCode.push('document.getElementById("onetime").value=' + GM_getValue(id + 'UM_OP_jednoraz2', 0));
              var script = document.createElement('script');
              script.innerHTML = scriptCode.join('\n');
              scriptCode.length = 0;
              document.getElementsByTagName('head') [0].appendChild(script);
            } else {
              notification('Nie stac Cie na zaden jednoraz');
            }
          } else {
            notification('Nie stac Cie na jednoraz');
          }
        } else {
     //     notification('Ustawiono glowny jednoraz');
          var scriptCode = new Array();
          scriptCode.push('document.getElementById("onetime").value=' + GM_getValue(id + 'UM_OP_jednoraz1', 0));
          var script = document.createElement('script');
          script.innerHTML = scriptCode.join('\n');
          scriptCode.length = 0;
          document.getElementsByTagName('head') [0].appendChild(script);
        }
      }
    }
    
    
      GM_addStyle('#sbox_msg_global li {margin-top: 1px;padding-bottom: 5px !important; border-bottom: #000 dashed 0px;}');
      GM_addStyle('#sbox_msg_global img {display: block; opacity: 0; height: 2px;}');
      GM_addStyle('#sbox_msg_global span:nth-of-type(2) {margin-left: -4px;}');
      GM_addStyle('#sbox_msg_clan span:nth-of-type(2) {margin-left: -4px;}');
      GM_addStyle('#sbox_msg_clan li {margin-top: 1px;padding-bottom: 5px !important; border-bottom: #000 dashed 0px;}');
      GM_addStyle('#sbox_msg_clan img {display: block; opacity: 0; height: 2px;}');
    
    
    if (GM_getValue(id+'UM_trole','')=="60 52858 37931") {
      GM_setValue(id+'UM_trole','');
    }
  } //unmodon

}
UNMOD();