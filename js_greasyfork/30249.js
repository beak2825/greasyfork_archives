// ==UserScript==
// @name         Banh bím VTV go
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Ngắn quá :3
// @include      /.*vtvgo.vn.*/
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/30249/Banh%20b%C3%ADm%20VTV%20go.user.js
// @updateURL https://update.greasyfork.org/scripts/30249/Banh%20b%C3%ADm%20VTV%20go.meta.js
// ==/UserScript==

$('head').append('<style>#player-live-streaming,.col-md-3.box-prochannel.no-padding-right{width:100%!important}</style>');