// ==UserScript==
// @name         Livret Helper
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Improves T2MasterPrint experience to its best. !It does not change serverside code!
// @author       Valentin
// @match        http://10.1.74.156:900/liste_cr_dcm*
// @grant        none
// @license		 GNU
// @downloadURL https://update.greasyfork.org/scripts/451405/Livret%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/451405/Livret%20Helper.meta.js
// ==/UserScript==

var $ = window.jQuery;

//once HTML finished the load
$(document).ready( function() {
	console.log('Livret Helper : initializing...');

	//lazy solution to get lines to print by given name string
	function getLines(name) {
		var lines = $('#dcmTable tr');
		var linesToPrint = [];

		for (var i = 2; i < lines.length; i++) {
			if (name == lines.eq(i).find('td').eq(2).html()) {
				linesToPrint.push(lines.eq(i));
			}
		}

		return linesToPrint;
	}

	//select lines to print. Click or not to click on, that is the action
	function selectLinesToPrint(linesToPrint) {
		linesToPrint.sort(sortLines);

		for (var i = 0; i < linesToPrint.length; i++) {
			//already selected ? Double click this bitch to retrieve sorted order
			if (linesToPrint[i].hasClass('selected'))
				linesToPrint[i].find('.dt-checkboxes').eq(0).click();

			linesToPrint[i].find('.dt-checkboxes').eq(0).click();
		}
	}

	//extract date object from given string
	function toDate(date) {
		date = date.split(new RegExp('[\\/| |\\:]','gi'));

		return new Date(date[0],date[1],date[2],date[3],date[4],date[5]).getTime();
	}

	//first "planche récap", then other lines on date
	function sortLines(lineA, lineB) {
		if (lineA.find('td').eq(4).html().match(new RegExp('_VIA_','g')))
			return -1;

		return toDate(lineA.find('.date').eq(0).html()) - toDate(lineB.find('.date').eq(0).html());
	}
	
	function handleSelect(jthis, type, e) {
		var name = jthis.find('td').eq(2).html();
		var alreadySelected = jthis.hasClass('selected'); //if already selected, then ignore (unselection mechanics)

		console.log(type + ', ' + ctrlKeydown + ' : ' + name);

		//no coords ? Not fired by a mouse click, then fired by the script. Ignore.
		if (e.screenY == 0) return;

		//need a delay to let the legacy script to run, then override it
		setTimeout( function(){
			if ('dblclick' !== type)
				if (!alreadySelected) return;
			
			selectLinesToPrint(getLines(name));
		}, 200);
	}

	//handle the ctrl + click on lines to fire script function
	var ctrlKeydown = false;
	function setImageClickListener() {
		//ctrl key down or not down, that is the question
		$(document).keydown(function(e) {
			if ('17' == e.which) ctrlKeydown = true;
		});
		$(document).keyup(function(e) {
			if ('17' == e.which) ctrlKeydown = false;
		});

		//ctrl
		$(document).on('click' ,'tr.odd, tr.even', function(e) {
			if (!ctrlKeydown) return;

			handleSelect($(this), 'click', e);
		});
		
		//dblclick
		$(document).on('dblclick' ,'tr.odd, tr.even', function(e) {
			handleSelect($(this), 'dblclick', e);
		});
	}

	//modalité storing and handling
	function getModalite() {
		return $('#dcmTable tr').eq(1).find('th').eq(4).find('input').val();
	}

	function setModalite(modalite) {
		$('#dcmTable tr').eq(1).find('th').eq(4).find('input').val(modalite);
		$('#dcmTable tr').eq(1).find('th').eq(4).find('input').change(); //triggering legacy script
	}

	function initializeModalite() {
		var storedModalite = localStorage.getItem('livret_helper_modalite');

		console.log('storedModalite : ' + storedModalite);

		if (null == storedModalite) return;

		console.log('setting from storedModalite');

		setTimeout( function(){
			setModalite(storedModalite);
		}, 500);//lazy handling
	}

	function setModaliteListener() {
		$(document).on('keydown', function(e) { //keyup untriggered due to legacy script conflict
			localStorage.setItem('livret_helper_modalite', getModalite());
		});
	}
	function forceDisplayedAll() {
		setTimeout( function(){
			$('#dcmTable_length select').val(-1);
			$('#dcmTable_length select').change();
		}, 500);//lazy handling
	}

	//starting sequence
	setImageClickListener();
	initializeModalite();
	setModaliteListener();
	forceDisplayedAll();

	console.log('Livret Helper running...');
});