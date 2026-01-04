// ==UserScript==
// @name         Filmweb - want to see on Netflix
// @version      1.0
// @description  Dodaje informacje czy film jest na Netflixie z widoku listy "Chce zobaczyc"
// @author       Sarpens
// @match        https://www.filmweb.pl/user/<tu wstaw login>/wantToSee*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @namespace https://greasyfork.org/users/172583
// @downloadURL https://update.greasyfork.org/scripts/390291/Filmweb%20-%20want%20to%20see%20on%20Netflix.user.js
// @updateURL https://update.greasyfork.org/scripts/390291/Filmweb%20-%20want%20to%20see%20on%20Netflix.meta.js
// ==/UserScript==

//THE BEER-WARE LICENSE (Revision 42):
//Mozesz w dowolny sposob korzystac ze skryptu, przerabiac go i modyfikowac.
//Jezeli sie spotkamy, a uznasz, ze skrypt Ci sie przydal to postaw mi piwo.

jQuery(document).ready(function($){
  //find all films available on netflix
  var films_on_netflix = document.getElementsByClassName('advertButton advertButton--netflix ');
  //add banners to each film
  var i = 0;
  for(i = 0; i < films_on_netflix.length; i++){
    var banner = document.createElement("div");
    banner.innerHTML = "<br><a href='" + films_on_netflix[i].firstChild + "'>Oglądaj na&nbsp;&nbsp;<span id='menuNetflixIcon'></span></a>";
    films_on_netflix[i].parentElement.parentElement.firstChild.appendChild(banner);
  }
});