// ==UserScript==
// @name           redmine_tweaks
// @namespace      https://greasyfork.org/de/users/157797-lual
// @match          http*://*.redmine.tiss.tuwien.ac.at/*
// @version        1.2
// @description	   better style for redmine / please update the match url to fit to your redmine instance
// @author         lual
// @grant GM_addStyle
// @grant GM_getResourceURL
// @icon           https://icons.duckduckgo.com/ip2/www.redmine.org.ico
// @downloadURL https://update.greasyfork.org/scripts/34718/redmine_tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/34718/redmine_tweaks.meta.js
// ==/UserScript==
// @licence        CC-BY-NC-SA-4.0
// changes:        2011-03-17 initial
//                 2017-11-01 publish on greasyfork
//                 2020-09-29 kommentare optisch besser voneinander abtrennen
//                 2020-10-16 update auf redmine 4.1.1
//                 2022-11-10 convert deprecated @include to @match
//                 2023-06-01 make textareas bigger / add script icon / add licence / publish
//                 2023-06-01 add event listener / cleanup / remove unused util-code
//                 2024-12-06 make visited links green
/////////////////////////////////////////////////////////////////////////////////////////////////////////
var Util = {
  log: function () {
    var args = [].slice.call(arguments);
    args.unshift('%c' + SCRIPT_NAME + ':', 'font-weight: bold;color: purple;');
    console.log.apply(console, args);
  }
};

var SCRIPT_NAME = 'redmine_tweaks';

Util.log('started');

/////////////////////////////////////////////////////////////////////////////////////////////////////////
//schoen farbig wird der code mit <pre><code class="ruby">der code</code></pre>
//  aber die zeilennummer sind stoerend....
// GM_addStyle(".syntaxhl .line-numbers {visibility: hidden;}");

//private tasks in der uebersicht als solche markieren...
GM_addStyle("div.journal.private-notes .wiki:before {content: 'PRIVAT';    background-clip: border-box;    background-color: #DD2222;    background-image: none;    background-origin: padding-box;    background-position: 0 0;    background-repeat: repeat;    background-size: auto auto;    border-bottom-left-radius: 2px;    border-bottom-right-radius: 2px;    border-top-left-radius: 2px;    border-top-right-radius: 2px; color: #FFFFFF;  font-size: 60%;    font-weight: bold;    margin-right: 2px;   padding-bottom: 0px;    padding-left: 2px;    padding-right: 2px;    padding-top: 2px;    position: relative;    text-transform: uppercase;}");

//kommentare optisch besser voneinander abtrennen...
GM_addStyle(".journal.has-notes { padding-top: 10px; border-top-width: 2px;border-top-color: ##3d454c; border-top-style: solid;}");
GM_addStyle("#history { border-bottom-width: 2px;border-bottom-style: solid; border-bottom-color: ##3d454c;}");
GM_addStyle(" a:visited, a:visited * { color: #469e34 !important; }");

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// make textareas bigger
document.addEventListener(
  "DOMNodeInserted",
  (event) => {
    var textareas = document.querySelectorAll('textarea#issue_description, textarea#issue_notes, textarea.wiki-edit');

    for (const ta of textareas) {
      var rows_used = parseInt(ta.value.split(/\r\n|\r|\n/).length);
      var rows_shall = parseInt(Math.max(ta.rows, rows_used+10, 30));
      if (rows_shall > ta.rows) {
        Util.log('textarea#', ta.id, ' rows: ', ta.rows, ' -> ', rows_shall);
        ta.rows = rows_shall;
      }
    }
  },
  false
);