// ==UserScript==
// @name         No Caps
// @namespace    https://greasyfork.org/en/scripts/22856-no-caps
// @version      1.0
// @description  Makes stuff with all caps lowercase
// @author       abbott
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/22856/No%20Caps.user.js
// @updateURL https://update.greasyfork.org/scripts/22856/No%20Caps.meta.js
// ==/UserScript==

window.onload = function() {
  var elements = document.body.getElementsByTagName('*');

  for (var i = 0, element;  element = elements[i]; i++) {
    var text = '';
    element.innerHTML.split(/(<.+?>)/).forEach(function(s) {
      text += s.charAt(0) === '<' ? s : noCaps(s);
    });

    element.innerHTML = text;
  }
};

// enforces proper capitalization, lowercases words with all caps
function noCaps(s) {
  return s.split(' ').map(function(word) {
    var caps = 0;

    for (var i = 0, char; char = word.charAt(i); i++) {
      if (char !== char.toLowerCase()) {
        caps++;
      }
    }

    if (caps === (word.length - nonAlpha(word))) {
      return word.toLowerCase();  
    }
    
    return word;
  }).join(' ');
}

function nonAlpha(s) {
  var count = 0;

  for (var i = 0, char; char = s.charAt(i); i++) {
    count += (char.toUpperCase() === char.toLowerCase()) ? 1 : 0; // non letters would return the same result
  }

  return count;
}
