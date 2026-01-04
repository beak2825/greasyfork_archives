// ==UserScript==
// @name         Phabricator Annoyance Remover
// @description  Task view description and task edit description font is set to Courier New. The edit description height is auto adjusted to content. All comment entries that aren't true comments are removed from view.
// @namespace    https://github.com/llagerlof/
// @author       2018, Lawrence Lagerlof (https://github.com/llagerlof)
// @license      MIT
// @include      /https?:\/\/.*\/maniphest\/task\/edit\//
// @include      /https?:\/\/.*\/T[0-9]+(?:#([0-9]+))?$/
// @require      https://cdnjs.cloudflare.com/ajax/libs/autosize.js/4.0.2/autosize.min.js
// @version      1.3

// @downloadURL https://update.greasyfork.org/scripts/371499/Phabricator%20Annoyance%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/371499/Phabricator%20Annoyance%20Remover.meta.js
// ==/UserScript==

var textArea = document.querySelectorAll("textarea.remarkup-assist-textarea")[0];
if (textArea != null) {
  textArea.setAttribute('style', 'font-family: Courier New, Courier, Consolas');
  autosize(textArea);
}

var task = document.getElementsByClassName('phabricator-remarkup')[0];
if (task != null) {
  task.setAttribute('style', 'font-family: Courier New, Courier, Consolas');
}

var divs = document.querySelectorAll('div.phui-timeline-shell, div.phui-timeline-spacer');
for(i=0; i<divs.length; i++) {
  var isMinor = divs[i].querySelectorAll('div.phui-timeline-minor-event').length > 0;
  var isSpacer = divs[i].classList.contains('phui-timeline-spacer');
  if (isMinor || isSpacer) {
    divs[i].style.display = 'none';
  } else {
    divs[i].style.paddingBottom = '20px';
  }
}
