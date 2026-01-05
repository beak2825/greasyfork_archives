// ==UserScript==
// @name         Keep Scrambling
// @namespace    https://greasyfork.org/en/scripts/22128-keep-scrambling
// @version      1.0
// @description  scrambles all the text on a page on a 1 second interval
// @author       abbott
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/22128/Keep%20Scrambling.user.js
// @updateURL https://update.greasyfork.org/scripts/22128/Keep%20Scrambling.meta.js
// ==/UserScript==

window.onload = function() {
   var elements = document.body.getElementsByTagName('*');

   setInterval(function() {
    for (var i = 0; i < elements.length; i++) {
      var text = '';
      elements[i].innerHTML.split(/(<.+?>)/).forEach(function(s) {
        text += s.charAt(0) === '<' ? s : scramble(s);
      });

      elements[i].innerHTML = text;
    }
  }, 1000);
};

function scramble(s) { // scrambles middle letters 
  if (s.includes('&nbsp;')) { // ignores nbsp messes up the scramble a bunch
    return s;
  }

  return s.split(' ').map(function(word) {
    if (word.length > 3) {
      var chars = word.split('');

      for (var i = 1; i < chars.length - 1; i++) {
        var j = Math.floor(Math.random() * (i - 1) + 1);
        var temp = chars[i];
        chars[i] = chars[j];
        chars[j] = temp;
      }

      return chars.join('');
    }

    return word;
  }).join(' ');
}
