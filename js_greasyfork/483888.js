// ==UserScript==
// @name         toonio drawbot ex v 1.5
// @namespace    toonio.ru
// @version      1.5
// @author       kkersia
// @description  legaly (no lol) and safe!
// @match        toonio.ru*
// @include      toonio.ru
// @grant        none
// @license 	 MIT
// @icon https://i.ytimg.com/an_webp/Tt-6Q5ri2H4/mqdefault_6s.webp?du=3000&sqp=CObQ26wG&rs=AOn4CLBjdAmXvG4W9spteJi00cZs8M4lwg
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/483888/toonio%20drawbot%20ex%20v%2015.user.js
// @updateURL https://update.greasyfork.org/scripts/483888/toonio%20drawbot%20ex%20v%2015.meta.js
// ==/UserScript==
 

var redirectUrls = [
  'https://toonio.ru/last',
  'https://toonio.ru/last/scribble',
  'https://toonio.ru/draw',
  'https://toonio.ru/',
  'https://toonio.ru/top/today'
];

var pressCoordinates = [565, 321]; 
var heartBrokenElement = 'far fa-heart-broken'; 
var comClassElement = '.com'; 
var textToWrite = 'vс3м p0кa я yx0жy на mуlтat0r! :( :cry:'; 
var submitElement = 'submit'; 

function isRedirectPage(url) {
  return redirectUrls.includes(url);
}

function pressCoordinates(coordinates) {
  var x = coordinates[0];
  var y = coordinates[1];
  var pressEvent = new MouseEvent('mousedown', {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y
  });
  document.elementFromPoint(x, y).dispatchEvent(pressEvent);
}

function writeTextToElement(element, text) {
  var input = document.createElement('input');
  input.value = text;
  element.appendChild(input);
  input.focus();
  input.select();
}

function handleComClassClick() {
  var submitElement = document.querySelector(submitElement);
  if (submitElement) {
    submitElement.dispatchEvent(new MouseEvent('click'));
  }
}

for (var i = 0; i < redirectUrls.length; i++) {
  browser.webNavigation.onCreatedNavigationEntry.addListener(
    function(details) {
      if (isRedirectPage(details.url)) {
        pressCoordinates(pressCoordinates);
        var heartBrokenElement = document.querySelector(heartBrokenElement);
        if (heartBrokenElement) {
          heartBrokenElement.dispatchEvent(new MouseEvent('click'));
        }
        writeTextToElement(document.querySelector(comClassElement), textToWrite);
        document.querySelector(comClassElement).addEventListener('click', handleComClassClick);
      }
    },
    { url: redirectUrls[i] },
    { url: redirectUrls[i] }
  );
}