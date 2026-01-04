// ==UserScript==
// @name     Kevin's Magic Alexa History
// @version  1
// @include https://developer.amazon.com/alexa/console/ask/test/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @description Enables terminal-style history on the Alexa dev console
// @namespace https://greasyfork.org/users/576975
// @downloadURL https://update.greasyfork.org/scripts/404507/Kevin%27s%20Magic%20Alexa%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/404507/Kevin%27s%20Magic%20Alexa%20History.meta.js
// ==/UserScript==

$(document).ready(() => {
	var speakHistory = [];
  var historyPosition = 0;

	var inputBox = $('.askt-utterance__input')

  inputBox.on('keydown', (e) => {
    var code = e.key;
    var val = e.target.value;

    if (code === "Enter") {
      historyPosition = 0;
      speakHistory.push(val);
    }
    if (code === "ArrowUp") {
      if (historyPosition === 0 && val && val.trim() != speakHistory[speakHistory.length - 1].trim()) speakHistory.push(val);
      if (historyPosition < speakHistory.length) historyPosition ++;
      $(e.target).val(speakHistory[speakHistory.length - historyPosition]);
    }
    if (code === "ArrowDown") {
      if (historyPosition > 0) historyPosition --;
      else return $(e.target).val("");
      $(e.target).val(speakHistory[speakHistory.length - historyPosition]);
			$(inputBox).trigger({type: 'keypress', which: 13, keyCode: 13});
    }
  });
});
