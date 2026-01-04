// ==UserScript==
// @name            Chessable Analysis Translator
// @description     Redirects analysis from Chessable to Lichess
// @version         1.2
// @include         https://www.chessable.com/analysis/*
// @run-at          document-start
// @namespace https://greasyfork.org/users/766994
// @downloadURL https://update.greasyfork.org/scripts/425750/Chessable%20Analysis%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/425750/Chessable%20Analysis%20Translator.meta.js
// ==/UserScript==


const fen = window.location.pathname.slice(14, -1).replace(/U/g,"/").replace(/%20/g,"_");
const color = window.location.search.replace("o", "color")
const url = "https://lichess.org/analysis/" + fen + color;

window.location.replace(url);


