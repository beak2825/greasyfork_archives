// ==UserScript==
// @name          trello-width
// @namespace     trello-width
// @version       0.1
// @description   270 -> 500px board width style for trello.com
// @include       *trello.com/*
// @author        Kuzyara
// @downloadURL https://update.greasyfork.org/scripts/10767/trello-width.user.js
// @updateURL https://update.greasyfork.org/scripts/10767/trello-width.meta.js
// ==/UserScript==
// vim: set nowrap ft= : 


function SetTrelloWidth(w) {
 	var _px = w.toString()+'px';
	$('.list').css('max-width', 'none');
	$('.list').css('width', _px);
	$('.list').css('flex-basis', _px);
	$('.list-card').css('max-width', 'none');
}

(function() {

    setInterval((function() {
        //alert(1);
        SetTrelloWidth(500);
        return _results;
    }), 500);

}).call(this);