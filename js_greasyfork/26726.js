// ==UserScript==
// @name        allow_select
// @namespace   http://catherine.v0cyc1pp.com/allow_select.user.js
// @include     http://www.tbc-sendai.co.jp/*
// @include     http://konbinipan.com/*
// @author      greg10
// @license     GPL 3.0
// @run-at      document-end
// @version     1.4
// @require     http://code.jquery.com/jquery-3.1.1.min.js
// @grant       none
// @description 選択を許可する.
// @downloadURL https://update.greasyfork.org/scripts/26726/allow_select.user.js
// @updateURL https://update.greasyfork.org/scripts/26726/allow_select.meta.js
// ==/UserScript==


$('*').css('-webkit-user-select', 'text');
$('*').css('-webkit-touch-callout', 'default');

function handler(e){
	e.stopPropagation();
}

addEventListener('onreadystatechange', handler, true);
addEventListener('select', handler, true);
addEventListener('selectstart', handler, true);
addEventListener('selectionchange', handler, true);
addEventListener('copy', handler, true);
addEventListener('cut', handler, true);
addEventListener('contextmenu', handler, true);
addEventListener('message', handler, true);
addEventListener('mousedown', handler, true);
addEventListener('mouseup', handler, true);
addEventListener('keydown', handler, true);
addEventListener('keyup', handler, true);
addEventListener('dragstart', handler, true);