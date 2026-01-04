// ==UserScript==
// @name         Black Moves First
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author       You
// @match        https://lichess.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405219/Black%20Moves%20First.user.js
// @updateURL https://update.greasyfork.org/scripts/405219/Black%20Moves%20First.meta.js
// ==/UserScript==
const pieces = ['rook', 'knight', 'bishop', 'queen', 'king', 'pawn'];


(function() {
    'use strict';
    if (window.location.host !== 'lichess.org') return;

    let wRules = [], bRules = [];
    for (let p of pieces) wRules.push(['piece.white.' + p, ['background-image', getComputedStyle(document.querySelector('piece.black.' + p)).backgroundImage + '!important']]);
    for (let p of pieces) bRules.push(['piece.black.' + p, ['background-image', getComputedStyle(document.querySelector('piece.white.' + p)).backgroundImage + '!important']]);
    addStylesheetRules(wRules);
    addStylesheetRules(bRules);
})();

/**
 * @returns 'white' | 'black'
 */
function getOriginalColour () {
    const str = document.body.innerHTML.match(/LichessRound.boot\((.*?)\)/)[1];
    const data = JSON.parse(str);
    return data.data.player.color;
}

function addStylesheetRules (rules) {
  var styleEl = document.createElement('style');

  // Append <style> element to <head>
  document.head.appendChild(styleEl);

  // Grab style element's sheet
  var styleSheet = styleEl.sheet;

  for (var i = 0; i < rules.length; i++) {
    var j = 1,
        rule = rules[i],
        selector = rule[0],
        propStr = '';
    // If the second argument of a rule is an array of arrays, correct our variables.
    if (Array.isArray(rule[1][0])) {
      rule = rule[1];
      j = 0;
    }

    for (var pl = rule.length; j < pl; j++) {
      var prop = rule[j];
      propStr += prop[0] + ': ' + prop[1] + (prop[2] ? ' !important' : '') + ';\n';
    }

    // Insert CSS Rule
    styleSheet.insertRule(selector + '{' + propStr + '}', styleSheet.cssRules.length);
  }
}


function addcss(css){
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    if (s.styleSheet) { // IE
        s.styleSheet.cssText = css;
    } else {                // the world
        s.appendChild(document.createTextNode(css));
    }
    head.appendChild(s);
 }