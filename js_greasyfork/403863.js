// ==UserScript==
// @name        Punctuation color
// @description https://www.reddit.com/r/userscripts/comments/gnoji7/request_punctuation_color/
// @author      Livadas
// @include	    *
// @require     http://code.jquery.com/jquery-latest.js
// @run-at      document-idle
// @version     2020-05-27
// @namespace https://greasyfork.org/users/237051
// @downloadURL https://update.greasyfork.org/scripts/403863/Punctuation%20color.user.js
// @updateURL https://update.greasyfork.org/scripts/403863/Punctuation%20color.meta.js
// ==/UserScript==

(function() {

  function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  }

  addGlobalStyle(".highlightComa {color:red!important; background-color:white;}");
  addGlobalStyle(".highlightMdash {color:blue!important; background-color:white;}");
  addGlobalStyle(".highlightNdash {color:blue!important; background-color:white;}");
  addGlobalStyle(".highlightDoubleQuotes {color:green!important; background-color:white;}");

  var docText = $('body')[0].innerHTML;

  var modifiedText = docText.replace(/—/gi, "<span class='highlightMdash'>&mdash;</span>");

  modifiedText = modifiedText.replace(/―/gi, "<span class='highlightMdash'>&horbar;</span>");
  modifiedText = modifiedText.replace(/,/gi, "<span class='highlightComa'>,</span>");
  modifiedText = modifiedText.replace(/‒/gi, "<span class='highlightNdash'>&ndash;</span>");
  modifiedText = modifiedText.replace(/–/gi, "<span class='highlightNdash'>&#8210;</span>");
  modifiedText = modifiedText.replace(/“/gi, "<span class='highlightDoubleQuotes'>“</span>");
  modifiedText = modifiedText.replace(/”/gi, "<span class='highlightDoubleQuotes'>”</span>");

  $('body').html(modifiedText);

})();
