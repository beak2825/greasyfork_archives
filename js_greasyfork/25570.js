// ==UserScript==
// @name         Kuracyja na zawsze zabanowany
// @namespace    KuracyjaToDebil
// @version      0.3
// @description  Gdy Kuracyja zabanowany, to cieplutko na sercu się robi.
// @author       Ditoski
// @include      http://www.wykop.pl/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/25570/Kuracyja%20na%20zawsze%20zabanowany.user.js
// @updateURL https://update.greasyfork.org/scripts/25570/Kuracyja%20na%20zawsze%20zabanowany.meta.js
// ==/UserScript==
/*global $, jQuery*/

(function() {
    'use strict';
    
    function addBanInfo () {
    	var annotation = document.createElement('div');
    	annotation.className = 'annotation type-light-alert space';

    	var i = document.createElement('i');
    	i.className = 'fa fa-info-circle';

    	var p = document.createElement('p');
    	p.innerText = 'Użytkowni zabanowany permanentie';

    	var p2 = document.createElement('p');
    	p2.innerText = 'za spierdolenie umysłowe i pisanie o sobie na wikipedii My Little Pony.';

    	annotation.appendChild(i);
    	annotation.appendChild(p);
    	annotation.appendChild(p2);

    	$('.grid-main').find('.rbl-block').first().append(annotation);
    }

	if (/(\/[Kk]uracyja\/?)/g.test(window.location.pathname)) {
		addBanInfo();
		removeRank();
		setDescription();
	}

	function removeRank() {
		$('.rank-number').remove();
	}

	function setPlatin () {
		$('span:contains(Kuracyja)').addClass('color-1001');
        $('a.showProfileSummary:contains(Kuracyja)').addClass('color-1001');
        $('.voters-list').find('a:contains(Kuracyja)').addClass('color-1001');
	}
    
    function setDescription () {
        $('.grid-full').find('.text').text('Człowiek zakochany w MLP, uznany homoseksualista, o czym pisał na stworzonej przez siebie stronie na fandomowskiej wiki MLP');
    }

	$(document).bind("ajaxComplete", function () {
		$('h3.ellipsis').find('a:contains(Kuracyja)').addClass('color-1001');
		$('.voters-list').find('a:contains(Kuracyja)').addClass('color-1001');
	});

    setPlatin();
})();