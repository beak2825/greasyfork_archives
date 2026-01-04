// ==UserScript==
// @name        Automatyczne logowanie USOS
// @description Skrypt wpisujący login oraz hasło na stronie logowania w przypadku wygaśnięcia sesji
// @license     Mozilla Public License 2.0
// @namespace   Violentmonkey Scripts
// @match       https://*.usos*.*.edu.pl/*
// @match       https://cas.*.edu.pl/*
// @match       https://login.*.edu.pl/*
// @version     1.3
// @author      Janek
// @description 2.10.2022, 14:56:57
// @require     https://code.jquery.com/jquery-3.6.1.min.js
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/452382/Automatyczne%20logowanie%20USOS.user.js
// @updateURL https://update.greasyfork.org/scripts/452382/Automatyczne%20logowanie%20USOS.meta.js
// ==/UserScript==

// Konfiguracja loginu i hasła
GM_config.init(
{
  'id': 'credentials', // Identyfikator instancji GM_config
  'title': 'Poświadczenia logowania',
  'fields': // Pola
  {
    'username': // Nazwa użytkownika
    {
      'label': 'Nazwa użytkownika',
      'type': 'text',
      'default': 'użytkownik'
    },
    'password': // Nazwa użytkownika
    {
      'label': 'Hasło użytkownika',
      'type': 'text',
      'default': 'hasło'
    }
  }
});

GM_registerMenuCommand("Ustaw poświadczenia USOS", (event) => GM_config.open());

// Strona USOS
if ($('usos-layout').length > 0) {

  // Link logowania pojawił się na stronie dostępnej tylko po zalogowaniu
  let link_logowania = $("a:contains('Zaloguj się')");

  // Link logowania dostępny jest tylko na pasku nawigacyjnym
  if (link_logowania.length == 0) {
    link_logowania = $($('cas-bar').get(0).shadowRoot).find('a:contains("zaloguj się")');
  }

  // Jeżeli link istnieje i kieruje do serwisu autoryzacyjnego, to użytkownik nie jest zalogowany, więc naciskamy link
  if (link_logowania.length > 0 && link_logowania.get(0).attributes.href.value.indexOf("logowaniecas") > -1) {
    link_logowania.get(0).click();
  }
  return true;
}

// Serwis autoryzacyjny
if (window.location.hostname.indexOf("cas") > -1 || window.location.hostname.indexOf("login") > -1) {

  // Zapobieganie logowaniu na strony innych uniwersytetów
  let domena_uniwersytetu = GM_getValue("credentials.domain", window.location.hostname);

  if (window.location.hostname != domena_uniwersytetu) {
    alert("Ostatnim razem logowano się na innej domenie, więc tym razem nie będzie podejmowana próba automatycznego logowania.");
    return true;
  }

  // Zapobieganie wielokrotnym zapytoniom w przypadku błędnego hasła
  let obecna_próba = new Date();
  let ostatnia_próba = new Date(GM_getValue("timer.lastlogin", 0))
  let różnica = obecna_próba - ostatnia_próba

  // 1 minuta przed następną próbą logowania
  if (((różnica) / 1000) < 60) {
    alert("Ostatnia próba automatycznego logowania się nie powiodła, więc następna nie będzie podejmowana przez następną minutę.")
    return true;
  }

  let pole_nazwy_użytkownika = $('input[id="username"]');
  let pole_hasła_użytkownika = $('input[id="password"]');

  pole_nazwy_użytkownika.val(GM_config.get('username'));
  pole_hasła_użytkownika.val(GM_config.get('password'));

  GM_setValue("timer.lastlogin", obecna_próba.toString())
  GM_setValue("credentials.domain", domena_uniwersytetu);

  $('input[type="submit"]').click()
}