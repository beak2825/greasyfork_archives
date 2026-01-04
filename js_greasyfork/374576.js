// ==UserScript==
// @name         AntyCezary
// @version      0.0.3
// @description  AntyCezary - ukrywa wpisy dotyczące Cezarego Gutowskiego
// @author       WhoDidThatToYou
// @match        *://www.wykop.pl/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/227148
// @downloadURL https://update.greasyfork.org/scripts/374576/AntyCezary.user.js
// @updateURL https://update.greasyfork.org/scripts/374576/AntyCezary.meta.js
// ==/UserScript==

function replace() {
  var entries = document.querySelectorAll('div[data-type="entry"] div.text > p:not(.changed)');

  for (var i = 0; i < entries.length; i++) {
    entries[i].classList.add('changed');
    var modified = entries[i].textContent.toLowerCase();
    if (modified.includes('#f1') && (modified.includes('cugowski') || modified.includes('gutowski') || modified.includes('cezar'))) {
      var alert = '<span style="color: red; font-weight: bold;">Ten wpis moze zawierać treści o Cezarym Gutowskim. Czytasz na własną odpowiedzialność!</span>';
      var currentHTML = entries[i].innerHTML;
      var hiddenEntryContent = '<span class="text-expanded dnone">' + currentHTML + '</span>';
      entries[i].innerHTML = '<p>' + alert + hiddenEntryContent + ' <a class="show-more" style="background-color: #ff00003d; color: red">Pokaż wpis</a></p>'
    }
  }
}

XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(value) {
    this.addEventListener("progress", function(e){
      if (e.target.responseURL.includes('www.wykop.pl/ajax2/tag/f1/next/entry')) {
        setTimeout(function() {
          replace();
        }, 1000);
      }
    }, false);
    this.realSend(value);
};

replace();
