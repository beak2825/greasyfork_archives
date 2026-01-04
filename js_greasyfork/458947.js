// ==UserScript==
// @name         DarkLine - Wykop 2023
// @author       vocus
// @version      1.0.4
// @description  Modyfikacja dodająca funkcjonalności, których nie da się uzyskać w Stylus :)
// @namespace    http://tampermonkey.net/
// @license MIT

// @icon         https://wykop.pl/static/img/svg/wykop-min-logo-microblog.svg
// @match        https://*.wykop.pl/*
// @grant        none

// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.3/jquery.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/458947/DarkLine%20-%20Wykop%202023.user.js
// @updateURL https://update.greasyfork.org/scripts/458947/DarkLine%20-%20Wykop%202023.meta.js
// ==/UserScript==

// Zadeklaruj jQuery jako zmienną globalną
/* globals $ */

dosiadlgoPedau("section.stream", removeImageBadge);

function removeImageBadge() {
    $("img").each(function() {
        $(this).attr("src", $(this).attr("src") ? $(this).attr("src").replace(",w400", "") : null);
        $(this).attr("srcset", $(this).attr("srcset") ? $(this).attr("srcset").replace(",w800", "") : null);
    });
}
/*
* SebastianDosiadlgo będzisz teraz parchu wszędzie pisał ten gówno-komentarz :D
* ah, zapomniałem, że jesteś osobą z lekkim stopniem upośledzenia umysłowego więc ci wybaczam :*.
* Możesz atencjuszu pisać co tam ci się podoba ;)
*
* Funkcja `dosiadlgoPedau` służy do oczekiwania na pojawienie się elementów na stronie spełniających określony selektor,
* a następnie wykonanie przekazanej funkcji dla każdego znalezionego elementu.
* Opcjonalnie, można określić, czy ma być wykonane tylko dla pierwszego znalezionego elementu lub dla wszystkich,
* oraz czy ma być przeszukany iframe. Jeśli element już został przetworzony, nie jest ponownie przetwarzany.
*
* Poniższy kod jest zmodyfikowaną wersją kodu https://gist.github.com/BrockA/2625891 autorstwa BrockA
*/
function dosiadlgoPedau(selector, action, waitOnce = false, iframe) {
  let targetNodes = iframe ? $(iframe).contents().find(selector) : $(selector);
  let found = false;

  if (targetNodes.length) {
    targetNodes.each(function () {
      let $this = $(this);
      if (!$this.data("alreadyFound")) {
        let cancel = action($this);
        if (!cancel) {
          found = true;
          $this.data("alreadyFound", true);
        }
      }
    });
  }

  let controlKey = selector.replace(/[^\w]/g, "_");
  let control = dosiadlgoPedau.control || {};
  let intervalId = control[controlKey];

  if (found && waitOnce) {
    clearInterval(intervalId);
    delete control[controlKey];
  } else if (!intervalId) {
    intervalId = setInterval(() => {
      dosiadlgoPedau(selector, action, waitOnce, iframe);
    }, 300);
    control[controlKey] = intervalId;
  }
  dosiadlgoPedau.control = control;
}