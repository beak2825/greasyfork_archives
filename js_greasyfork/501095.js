// ==UserScript==
// @name         10fastfingers hack
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Simulate typing and auto correct
// @license      MIT
// @author       kyzsuki
// @match        https://10fastfingers.com/typing-test/*
// @match        https://typingtop.com/**/typing-test
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501095/10fastfingers%20hack.user.js
// @updateURL https://update.greasyfork.org/scripts/501095/10fastfingers%20hack.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var word_idx = 0;
  var letter_idx = 0;
  var interval_per_word = 250;
  var maxTypoCount = Math.floor(Math.random() * (16 - 7 + 1)) + 7;
  var currentTypoCount = 0;

  var typingInterval;
  var word;

  var isTyping = false;

  function typing() {
    var interval_per_letter = Math.floor(Math.random() * (130 - 110 + 1)) + 110;

    if (countdown <= 0) {
      clearTimeout(typingInterval);
      isTyping = false;
      // word_idx = 0;
      return;
    }

    if (word_idx < words.length) {
      word = words[word_idx];
      if (letter_idx < word.length) {
        var letter = word[letter_idx];
        if (Math.random() < 0.1 && currentTypoCount < maxTypoCount) {
          letter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
          currentTypoCount++;
        }
        $("#inputfield").val($("#inputfield").val() + letter);
        letter_idx++;
        typingInterval = setTimeout(typing, interval_per_letter);
      } else {
        var keyup = jQuery.Event("keyup");
        keyup.which = 32;
        $("#inputfield").trigger(keyup);
        word_idx++;
        letter_idx = 0;
        if (word_idx < words.length) {
          typingInterval = setTimeout(typing, interval_per_word);
        }
      }
    }
  }

  function autoCorrect() {
    if (word_idx < words.length) {
      word = words[word_idx];
      if (letter_idx < word.length) {
        var letter = word[letter_idx];
        if (Math.random() < 0.1 && currentTypoCount < maxTypoCount) {
          letter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
          currentTypoCount++;
        }
        $("#inputfield").val($("#inputfield").val() + letter);
        letter_idx++;
      } else {
        var keyup = jQuery.Event("keyup");
        keyup.which = 32;
        $("#inputfield").trigger(keyup);
        word_idx++;
        letter_idx = 0;
      }
    }
  }

  $(document).on("keydown", function (event) {
    event.preventDefault();
    if (!isTyping) {
      isTyping = true;
      autoCorrect();
      isTyping = false;
    }
  });

  document.addEventListener("keydown", function (e) {
    if (isTyping) {
      e.preventDefault();
    }
  });

  $("#inputfield").on("focus mouseover", function (e) {
    if (isTyping) {
      e.preventDefault();
    }
  });

  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.code === "KeyZ") {
      isTyping = true;
      typingInterval = setTimeout(typing, interval_per_word);
    }
  });
})();
