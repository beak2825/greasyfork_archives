// ==UserScript==
// @name             mBank: fixed page title instead of "Wróć na mBank.pl"
// @name:pl          mBank: stały tytuł strony zamiast "Wróć na mBank.pl"
// @description      mBank sets the title of all unfocused tabs (so, ones you would like to know which one is which to distinguish them), to "Wróć na mBank.pl". This makes it not do that.
// @description:pl   mBank zmienia tytuł nieaktywnychh kart (czyli tych do których chcesz wrócić wiedząc co jest co) na "Wróć na mBank.pl". To sprawia że przestaje.
// @namespace        https://nabijaczleweli.xyz
// @version          3
// @author           наб
// @match            https://*.mbank.pl/*
// @match            https://mbank.pl/*
// @grant            none
// @license          0BSD
// @downloadURL https://update.greasyfork.org/scripts/494380/mBank%3A%20fixed%20page%20title%20instead%20of%20%22Wr%C3%B3%C4%87%20na%20mBankpl%22.user.js
// @updateURL https://update.greasyfork.org/scripts/494380/mBank%3A%20fixed%20page%20title%20instead%20of%20%22Wr%C3%B3%C4%87%20na%20mBankpl%22.meta.js
// ==/UserScript==

(() => {
  document.addEventListener("blur", function(ev) {
    var title = document.title;
    setTimeout(function() {
      document.title = title;
    }, 10);
  }, true);
})();