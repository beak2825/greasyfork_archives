// ==UserScript==
// @name			WaniKani Item Marker
// @description		Tool to mark and track individual radicals/kanji/vocabulary
// @namespace		irx.wanikani.marker
// @include			https://www.wanikani.com/*
// @version			4.0
// @copyright		2017, Ingo Radax
// @license			MIT; http://opensource.org/licenses/MIT
// @grant			none
// @run-at			document-start
// @downloadURL https://update.greasyfork.org/scripts/18582/WaniKani%20Item%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/18582/WaniKani%20Item%20Marker.meta.js
// ==/UserScript==

var WaniKani = (function() {
	var local_storage_prefix = 'wk_toolkit_';
	
	var api_key = null;
	
	var radical_data = null;
	var kanji_data = null;
	var vocabulary_data = null;

	var radicals_with_image = [];
	
	function log(msg) {
		console.log(msg);
	}
	
	function is_on_wanikani() {
		return (window.location.host == 'www.wanikani.com');
	}
	
	function is_on_dashboard() {
		return is_on_wanikani() && ((window.location.pathname == '/dashboard') || (window.location.pathname == '/'));
	}
	
	function is_on_review_session_page() {
		return is_on_wanikani() && (window.location.pathname == '/review/session');
	}
	
	function is_on_review_page() {
		return is_on_wanikani() && (window.location.pathname == '/review');
	}
	
	function is_on_lesson_session_page() {
		return is_on_wanikani() && (window.location.pathname == '/lesson/session');
	}
	
	function is_on_lesson_page() {
		return is_on_wanikani() && (window.location.pathname == '/lesson');
	}
	
	function is_on_lattice_radicals_meaning() {
		return is_on_wanikani() && (window.location.pathname == '/lattice/radicals/meaning');
	}
	
	function is_on_lattice_radicals_progress() {
		return is_on_wanikani() && (window.location.pathname == '/lattice/radicals/progress');
	}
	
	function is_on_lattice_kanji_combined() {
		return is_on_wanikani() && (window.location.pathname == '/lattice/kanji/combined');
	}
	
	function is_on_lattice_kanji_meaning() {
		return is_on_wanikani() && (window.location.pathname == '/lattice/kanji/meaning');
	}
	
	function is_on_lattice_kanji_reading() {
		return is_on_wanikani() && (window.location.pathname == '/lattice/kanji/reading');
	}
	
	function is_on_lattice_kanji_progress() {
		return is_on_wanikani() && (window.location.pathname == '/lattice/kanji/status');
	}
	
	function is_on_lattice_vocabulary_combined() {
		return is_on_wanikani() && (window.location.pathname == '/lattice/vocabulary/combined');
	}
	
	function is_on_lattice_vocabulary_meaning() {
		return is_on_wanikani() && (window.location.pathname == '/lattice/vocabulary/meaning');
	}
	
	function is_on_lattice_vocabulary_reading() {
		return is_on_wanikani() && (window.location.pathname == '/lattice/vocabulary/reading');
	}
	
	function is_on_lattice_vocabulary_progress() {
		return is_on_wanikani() && (window.location.pathname == '/lattice/vocabulary/status');
	}
	
	//-------------------------------------------------------------------
	// Try to parse the url and detect if it belongs to a single item.
	// e.g.	'https://www.wanikani.com/level/1/radicals/construction'
	//		will be parsed as 'radicals' and 'construction'
	//-------------------------------------------------------------------
	function parse_item_url(url) {
		if ((url == null) || (url == undefined)) {
			return null;
		}
		if (url.indexOf('/lattice/') > -1) {
			return null;
		}
		
		url = decodeURI(url);
		var parsed = /.*\/(radicals|kanji|vocabulary)\/(.+)/.exec(url);
		if (parsed) {
			return {type:parsed[1], name:parsed[2]};
		}
		else {
			return null;
		}
	}
	
	function reset_radical_data(resetLocalStorage) {
		radical_data = null;
		if (resetLocalStorage) {
			localStorage.removeItem(local_storage_prefix + 'api_user_radicals');
			localStorage.removeItem(local_storage_prefix + 'api_user_radicals_fetch_time');
		}
	}
	
	function reset_kanji_data(resetLocalStorage) {
		kanji_data = null;
		if (resetLocalStorage) {
			localStorage.removeItem(local_storage_prefix + 'api_user_kanji');
			localStorage.removeItem(local_storage_prefix + 'api_user_kanji_fetch_time');
		}
	}
	
	function reset_vocabulary_data(resetLocalStorage) {
		vocabulary_data = null;
		if (resetLocalStorage) {
			localStorage.removeItem(local_storage_prefix + 'api_user_vocabulary');
			localStorage.removeItem(local_storage_prefix + 'api_user_vocabulary_fetch_time');
		}
	}
	
	function clear_local_storage() {
		localStorage.removeItem(local_storage_prefix + 'last_review_time');
		localStorage.removeItem(local_storage_prefix + 'next_review_time');
		localStorage.removeItem(local_storage_prefix + 'last_unlock_time');
		localStorage.removeItem(local_storage_prefix + 'api_key');
		localStorage.removeItem(local_storage_prefix + 'api_user_radicals');
		localStorage.removeItem(local_storage_prefix + 'api_user_radicals_fetch_time');
		localStorage.removeItem(local_storage_prefix + 'api_user_kanji');
		localStorage.removeItem(local_storage_prefix + 'api_user_kanji_fetch_time');
		localStorage.removeItem(local_storage_prefix + 'api_user_vocabulary');
		localStorage.removeItem(local_storage_prefix + 'api_user_vocabulary_fetch_time');
	}
		
	function track_times() {
		if (is_on_review_session_page()) {
			localStorage.setItem(local_storage_prefix + 'last_review_time', now());
			
			var lastUnlockTime = new Date($('.recent-unlocks time:nth(0)').attr('datetime'))/1000;
			localStorage.setItem(local_storage_prefix + 'last_unlock_time', now());
		}
		
		if (is_on_dashboard()) {
			var next_review = Number($('.review-status .timeago').attr('datetime'));
			// Workaround for "WaniKani Real Times" script, which deletes the element we were looking for above.
			if (isNaN(next_review)) {
				next_review = Number($('.review-status time1').attr('datetime'));
				// Conditional divide-by-1000, in case someone fixed this error in Real Times script.
				if (next_review > 10000000000) next_review /= 1000;
			}
			localStorage.setItem(local_storage_prefix + 'next_review_time', next_review);
		}
	}
	
	function get_last_review_time() {
		return Number(localStorage.getItem(local_storage_prefix + 'last_review_time') || 0);
	}
	
	function get_next_review_time() {
		return Number(localStorage.getItem(local_storage_prefix + 'next_review_time') || 0);
	}
	
	function get_last_unlock_time() {
		return Number(localStorage.getItem(local_storage_prefix + 'last_unlock_time') || 0);
	}

	function now() {
		return Math.floor(new Date() / 1000);
	}
	
	function ajax_retry(url, retries, timeout) {
		retries = retries || 2;
		timeout = timeout || 3000;
		function action(resolve, reject) {
			$.ajax({
				url: url,
				timeout: timeout
			})
			.done(function(data, status){
				if (status === 'success')
					resolve(data);
				else
					reject();
			})
			.fail(function(xhr, status, error){
				if (status === 'error' && --retries > 0)
					action(resolve, reject);
				else
					reject();
			});
		}
		return new Promise(action);
	}

	function query_page_radicals_with_images() {
		return new Promise(function(resolve, reject) {
			ajax_retry('/lattice/radicals/meaning').then(function(page) {
				
				if (typeof page !== 'string') {return reject();}
				
				page = $(page);
				
				radicals_with_image = [];
				
				page.find('li').each(function(i, item) {
					var attr = $(this).attr('id');
					if (attr && attr.startsWith('radical-')) {
						var radicalChar = $(this).text();
						
						var href = $(this).find('a').attr('href');
						var parsedHref = WaniKani.parse_item_url(href);
						
						var image = $(this).find('img');
						var imageSrc = '';
						if (image.length > 0) {
							imageSrc = image.attr('src');
						}
						
						radicals_with_image.push({ name: parsedHref.name, character: radicalChar, image: imageSrc });
					}
				});
				
				resolve();

			},function(result) {
				reject(new Error('Failed to query page!'));
			});
		});
	}
	
	function get_radicals_with_image() {
		return radicals_with_image;
	}
	
	function get_api_key() {
		return new Promise(function(resolve, reject) {
			api_key = localStorage.getItem(local_storage_prefix + 'api_key');
			if (typeof api_key === 'string' && api_key.length == 32) {
				log("Already having API key");
				return resolve();	
			}
			
			log("Loading API key");
			
			ajax_retry('/account').then(function(page) {
				
				log("Loading API key ... SUCCESS");
				
				// --[ SUCCESS ]----------------------
				// Make sure what we got is a web page.
				if (typeof page !== 'string') {return reject();}

				// Extract the user name.
				page = $(page);
				
				// Extract the API key.
				api_key = page.find('#api-button').parent().find('input').attr('value');
				if (typeof api_key !== 'string' || api_key.length !== 32)  {return reject();}

				localStorage.setItem(local_storage_prefix + 'api_key', api_key);
				resolve();

			},function(result) {
				
				log("Loading API key ... ERROR");
				
				// --[ FAIL ]-------------------------
				reject(new Error('Failed to fetch API key!'));
				
			});
		});
	}
	
	function call_api_user_radicals() {
		return new Promise(function(resolve, reject) {
			log("Calling API: User radicals");
			$.getJSON('/api/user/' + api_key + '/radicals/', function(json){
				if (json.error && json.error.code === 'user_not_found') {
					log("Calling API: User radicals ... ERROR")
					reset_radical_data(true);
					location.reload();
					reject();
					return;
				}

				log("Calling API: User radicals ... SUCCESS");
				
				localStorage.setItem(local_storage_prefix + 'api_user_radicals', JSON.stringify(json));
				localStorage.setItem(local_storage_prefix + 'api_user_radicals_fetch_time', now());
				
				radical_data = json;
				
				resolve();
			});
		});
	}
	
	function call_api_user_kanji() {
		return new Promise(function(resolve, reject) {
			log("Calling API: User kanji");
			$.getJSON('/api/user/' + api_key + '/kanji/', function(json){
				if (json.error && json.error.code === 'user_not_found') {
					log("Calling API: User kanji ... ERROR")
					reset_kanji_data(true);
					location.reload();
					reject();
					return;
				}

				log("Calling API: User kanji ... SUCCESS");
				
				localStorage.setItem(local_storage_prefix + 'api_user_kanji', JSON.stringify(json));
				localStorage.setItem(local_storage_prefix + 'api_user_kanji_fetch_time', now());
				
				kanji_data = json;
				
				resolve();
			});
		});
	}
	
	function call_api_user_vocabulary() {
		return new Promise(function(resolve, reject) {
			log("Calling API: User vocabulary");
			$.getJSON('/api/user/' + api_key + '/vocabulary/', function(json){
				if (json.error && json.error.code === 'user_not_found') {
					log("Calling API: User vocabulary ... ERROR")
					reset_vocabulary_data(true);
					location.reload();
					reject();
					return;
				}

				log("Calling API: User vocabulary ... SUCCESS");
				
				localStorage.setItem(local_storage_prefix + 'api_user_vocabulary', JSON.stringify(json));
				localStorage.setItem(local_storage_prefix + 'api_user_vocabulary_fetch_time', now());
				
				vocabulary_data = json;
				
				resolve();
			});
		});
	}
	
	function get_last_fetch_time_api_user_radicals() {
		return Number(localStorage.getItem(local_storage_prefix + 'api_user_radicals_fetch_time'));
	}
	
	function get_last_fetch_time_api_user_kanji() {
		return Number(localStorage.getItem(local_storage_prefix + 'api_user_kanji_fetch_time'));
	}
	
	function get_last_fetch_time_api_user_vocabulary() {
		return Number(localStorage.getItem(local_storage_prefix + 'api_user_vocabulary_fetch_time'));
	}
	
	function load_radical_data() {
        var next_review_time = get_next_review_time();
		var last_review_time = get_last_review_time();
		var last_unlock_time = get_last_unlock_time();
		var last_fetch_time = get_last_fetch_time_api_user_radicals();
        if ((last_fetch_time <= last_unlock_time) ||
			(last_fetch_time <= last_review_time) ||
			((next_review_time < now()) && (last_fetch_time <= (now() - 3600)))) {
			log("Clearing previous fetched radical data");
			radical_data = null;
			localStorage.removeItem(local_storage_prefix + 'api_user_radicals');
			localStorage.removeItem(local_storage_prefix + 'api_user_radicals_fetch_time');
		}
		
		if (radical_data == null) {
			var stringified = localStorage.getItem(local_storage_prefix + 'api_user_radicals');
			if (stringified != null) {
				log("Radical data loaded from local storage");
				radical_data = JSON.parse(stringified);
			}
		}
		
		if (radical_data != null) {
			log("Radical data already loaded");
			return Promise.resolve();
		}
		
		return new Promise(function(resolve, reject) {
			get_api_key()
				.then(call_api_user_radicals)
				.then(function() {
					resolve();
				});
		});
	}
	
	function load_kanji_data() {
        var next_review_time = get_next_review_time();
		var last_review_time = get_last_review_time();
		var last_unlock_time = get_last_unlock_time();
		var last_fetch_time = get_last_fetch_time_api_user_kanji();
        if ((last_fetch_time <= last_unlock_time) ||
			(last_fetch_time <= last_review_time) ||
			((next_review_time < now()) && (last_fetch_time <= (now() - 3600)))) {
			log("Clearing previous fetched kanji data");
			kanji_data = null;
			localStorage.removeItem(local_storage_prefix + 'api_user_kanji');
			localStorage.removeItem(local_storage_prefix + 'api_user_kanji_fetch_time');
		}
		
		if (kanji_data == null) {
			var stringified = localStorage.getItem(local_storage_prefix + 'api_user_kanji');
			if (stringified != null) {
				log("Kanji data loaded from local storage");
				kanji_data = JSON.parse(stringified);
			}
		}
		
		if (kanji_data != null) {
			log("Kanji data already loaded");
			return Promise.resolve();
		}
		
		return new Promise(function(resolve, reject) {
			get_api_key()
				.then(call_api_user_kanji)
				.then(function() {
					resolve();
				});
		});
	}
	
	function load_vocabulary_data() {
        var next_review_time = get_next_review_time();
		var last_review_time = get_last_review_time();
		var last_unlock_time = get_last_unlock_time();
		var last_fetch_time = get_last_fetch_time_api_user_vocabulary();
        if ((last_fetch_time <= last_unlock_time) ||
			(last_fetch_time <= last_review_time) ||
			((next_review_time < now()) && (last_fetch_time <= (now() - 3600)))) {
			log("Clearing previous fetched vocabulary data");
			vocabulary_data = null;
			localStorage.removeItem(local_storage_prefix + 'api_user_vocabulary');
			localStorage.removeItem(local_storage_prefix + 'api_user_vocabulary_fetch_time');
		}
		
		if (vocabulary_data == null) {
			var stringified = localStorage.getItem(local_storage_prefix + 'api_user_vocabulary');
			if (stringified != null) {
				log("Vocabulary data loaded from local storage");
				vocabulary_data = JSON.parse(stringified);
			}
		}
		
		if (vocabulary_data != null) {
			log("Vocabulary data already loaded");
			return Promise.resolve();
		}
		
		return new Promise(function(resolve, reject) {
			get_api_key()
				.then(call_api_user_vocabulary)
				.then(function() {
					resolve();
				});
		});
	}
	
	function get_radical_data() {
		return radical_data;
	}
	
	function get_kanji_data() {
		return kanji_data;
	}
	
	function get_vocabulary_data() {
		return vocabulary_data;
	}
	
	function find_radical(meaning) {
		if (radical_data ==  null) {
			return null;
		}
		
		var numRadicals = radical_data.requested_information.length;
		for (var i = 0; i < numRadicals; i++) {
			if (radical_data.requested_information[i].meaning == meaning) {
				return radical_data.requested_information[i];
			}
		}
		
		return null;
	}
	
	function find_kanji(character) {
		if (kanji_data ==  null) {
			return null;
		}
		
		var numKanji = kanji_data.requested_information.length;
		for (var i = 0; i < numKanji; i++) {
			if (kanji_data.requested_information[i].character == character) {
				return kanji_data.requested_information[i];
			}
		}
		
		return null;
	}
	
	function find_vocabulary(character) {
		if (vocabulary_data ==  null) {
			return null;
		}
		
		var numVocabulary = vocabulary_data.requested_information.general.length;
		for (var i = 0; i < numVocabulary; i++) {
			if (vocabulary_data.requested_information.general[i].character == character) {
				return vocabulary_data.requested_information.general[i];
			}
		}
		
		return null;
	}
	
	function find_item(type, name) {
		if (type == 'radicals') {
			return find_radical(name);
		}
		else if(type == 'kanji') {
			return find_kanji(name);
		}
		else if(type == 'vocabulary') {
			return find_vocabulary(name);
		}
		else {
			return null;
		}
	}
	
	return {
		is_on_wanikani: is_on_wanikani,
		is_on_dashboard: is_on_dashboard,
		is_on_review_session_page: is_on_review_session_page,
		is_on_review_page: is_on_review_page,
		is_on_lesson_session_page: is_on_lesson_session_page,
		is_on_lesson_page: is_on_lesson_page,
		is_on_lattice_radicals_meaning: is_on_lattice_radicals_meaning,
		is_on_lattice_radicals_progress: is_on_lattice_radicals_progress,
		is_on_lattice_kanji_combined: is_on_lattice_kanji_combined,
		is_on_lattice_kanji_meaning: is_on_lattice_kanji_meaning,
		is_on_lattice_kanji_reading: is_on_lattice_kanji_reading,
		is_on_lattice_kanji_progress: is_on_lattice_kanji_progress,
		is_on_lattice_vocabulary_combined: is_on_lattice_vocabulary_combined,
		is_on_lattice_vocabulary_meaning: is_on_lattice_vocabulary_meaning,
		is_on_lattice_vocabulary_reading: is_on_lattice_vocabulary_reading,
		is_on_lattice_vocabulary_progress: is_on_lattice_vocabulary_progress,
		query_page_radicals_with_images: query_page_radicals_with_images,
		get_radicals_with_image: get_radicals_with_image,
		parse_item_url: parse_item_url,
		reset_radical_data: reset_radical_data,
		reset_kanji_data: reset_kanji_data,
		reset_vocabulary_data: reset_vocabulary_data,
		clear_local_storage: clear_local_storage,
		track_times: track_times,
		get_last_review_time: get_last_review_time,
		get_next_review_time: get_next_review_time,
		load_radical_data: load_radical_data,
		get_radical_data: get_radical_data,
		find_radical: find_radical,
		load_kanji_data: load_kanji_data,
		get_kanji_data: get_kanji_data,
		find_kanji: find_kanji,
		load_vocabulary_data: load_vocabulary_data,
		get_vocabulary_data: get_vocabulary_data,
		find_vocabulary: find_vocabulary,
		find_item: find_item,
	};
})();

var UI = (function() {
	function addStyle(aCss) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (head) {
			style = document.createElement('style');
			style.setAttribute('type', 'text/css');
			style.textContent = aCss;
			head.appendChild(style);
			return style;
		}
		return null;
	}
	
	function initCss() {
		var css =
			'#item_marker {' +
			'  display:none;' +
			'}' +
			'#item_marker h3 {' +
			'  height: 24px;' +
	        '  margin-top: 10px;' +
			'  margin-bottom: 0px;' +
			'  padding: 5px 20px;' +
			'  border-radius: 5px 5px 0 0;' +
	        '  background-color: seagreen;' +
	        '  color: white;' +
	        '  text-shadow: none;' +
			'}' +
			'#item_marker section {' +
			'  background-color: lightgrey;' +
			'}' +
			'#item_marker table {' +
			'}' +
			'#item_marker td {' +
			'  padding: 2px 8px;' +
			'}' + 
			'#item_marker .close_button {' +
			'  float: right;' +
			'  height: 24px;' +
			'}'
			;
		
		addStyle(css);
	}
	
	function buildIdAttr(id) {
		if (id && id != '')
			return 'id="' + id + '"';
		return '';
	}
	
	function addOnChangeListener(id, listener) {
		$('#' + id).off('change');
		$('#' + id).on('change', listener);
	}
	
	function addOnClickListener(id, listener) {
		$('#' + id).off('click');
		$('#' + id).on('click', listener);
	}
	
	function buildWindow(id, title) {
		var html =
			'<div ' + buildIdAttr(id) + ' class="container">' +
				'<div class="row">' +
					'<div class="span12" >' +
						'<section id="' + id + '_body">' +
							'<h3>' +
								title +
								'<button class="close_button" " ' + buildIdAttr(id + '_close_btn') + '>Close</button>' +
							'</h3>' +
						'</section>' +
					'</div>' +
				'</div>' +
			'</div>'
			;
		return html;
	}
	
	function buildTable(id) {
		var html = 
			'<table ' + buildIdAttr(id) + '>' +
				'<tbody ' + buildIdAttr(id + '_body') + '>' +
				'</tbody>' +
			'</table>';
		return html;
	}
	
	function buildTableRow(id, column1, column2) {
		var html =
			'<tr' + buildIdAttr(id) + '>' +
				'<td>' + column1 + '</td>' +
				'<td>' + column2 + '</td>' +
			'</tr>';
		return html;
	}
	
	function buildSelection(id, tooltip) {
		var html =
			'<select ' + buildIdAttr(id) + ' class="input" name="' + id + '" title="' + tooltip + '" />';
		return html;
	}
	
	function addSelectionOption(selectId, value, label, selected) {
		$('#' + selectId).append(
				'<option value="' + value + '" ' + (selected ? 'selected' : '') + '>' +
					label +
				'</option>');
	}
	
	function buildCheckBox(id, checked) {
		var html =
			'<input ' + buildIdAttr(id) + ' type="checkbox" ' + (checked ? 'checked' : '') + '>';
		return html;
	}
	
	return {
		initCss: initCss,
		buildWindow: buildWindow,
		buildTable: buildTable,
		buildTableRow: buildTableRow,
		buildCheckBox: buildCheckBox,
		buildSelection: buildSelection,
		addSelectionOption: addSelectionOption,
		addOnChangeListener: addOnChangeListener,
		addOnClickListener: addOnClickListener,
	};
})();

(function(gobj) {
	var data = {
		lists: [
			{
				name: 'A',
				items:[],
				settings: {
					markedItemsBorderColor: 'black',
					toggleMarksWithLinks: false,
					showReviewWarning: false,
					addDelayBeforeAnswerIsPossible: false,
				}
			},
			{
				name: 'B',
				items:[],
				settings: {
					markedItemsBorderColor: 'red',
					toggleMarksWithLinks: false,
					showReviewWarning: false,
					addDelayBeforeAnswerIsPossible: false,
				}
			},
			{
				name: 'C',
				items:[],
				settings: {
					markedItemsBorderColor: 'orange',
					toggleMarksWithLinks: false,
					showReviewWarning: false,
					addDelayBeforeAnswerIsPossible: false,
				}
			},
			{
				name: 'D',
				items:[],
				settings: {
					markedItemsBorderColor: 'yellow',
					toggleMarksWithLinks: false,
					showReviewWarning: false,
					addDelayBeforeAnswerIsPossible: false,
				}
			},
			{
				name: 'E',
				items:[],
				settings: {
					markedItemsBorderColor: 'cyan',
					toggleMarksWithLinks: false,
					showReviewWarning: false,
					addDelayBeforeAnswerIsPossible: false,
				}
			}
		],
		settings: {
			unmarkedItemsBorderColor: 'no_border',
		}};
	
	var dataVersion = 2;
	
	var settingsWindowAdded = false;
	var dropDownMenuExtended = false;
	
	var availableBorderColors = [
	                     		{ value: 'no_border', label: 'No border' },
	                     		{ value: 'black', label: 'Black' },
	                     		{ value: 'darkgrey', label: 'Dark Grey' },
	                     		{ value: 'lightgrey', label: 'Light Grey' },
	                     		{ value: 'white', label: 'White' },
	                     		{ value: 'red', label: 'Red' },
	                     		{ value: 'orange', label: 'Orange' },
	                     		{ value: 'yellow', label: 'Yellow' },
	                     		{ value: 'green', label: 'Green' },
	                     		{ value: 'blue', label: 'Blue' },
	                     		{ value: 'indigo', label: 'Indigo' },
	                     		{ value: 'violet', label: 'Violet' },
	                     		{ value: 'cyan', label: 'Cyan' }
	                     		];
	
	var localStoragePrefix = 'ItemMarker_';
	
	var pageUpdateIsLocked = false;
	
	var lastSeenItem = 0;
	var lastSeenQuestionType = '';
	
	//-------------------------------------------------------------------
	// Main function
	//-------------------------------------------------------------------
	function main() {
		console.log('START - WaniKani Item Marker');
		
		loadData();
		
		WaniKani.track_times();
		
		extendDropDownMenu();
		
		updatePage();
		
		console.log('END - WaniKani Item Marker');
	}
	window.addEventListener('load', main, false);
	//window.addEventListener('focus', main, false);
	
	function extendDropDownMenu() {
		if (dropDownMenuExtended) {
			return;
		}
		
	    $('<li><a href="#item_marker">Item Marker</a></li>')
	    	.insertBefore($('.account .dropdown-menu .nav-header:eq(1)'))
	    	.on('click', toggleSettingsWindow);
	    
	    dropDownMenuExtended = true;
	}
	
	function buildSettingsWindow() {
		UI.initCss();
		
		var html;
		
		html = UI.buildWindow('item_marker', 'Item Marker');
		$(html).insertAfter($('.navbar'));
		
		html = UI.buildTable('item_marker_settings');
		console.log(html);
		$('#item_marker_body').append(html);
		
		html = UI.buildTableRow(
				'',
				'<b>General settings</b>',
				'');
		$('#item_marker_settings_body').append(html);
			
		html = UI.buildTableRow(
				'',
				'Border color for unmarked items',
				UI.buildSelection(
						'border_color_unmarked_items',
						'Select the border color for unmarked items'));
		$('#item_marker_settings_body').append(html);
		
		for (var i = 0; i < availableBorderColors.length; i++) {
			UI.addSelectionOption('border_color_unmarked_items',
					availableBorderColors[i].value,
					availableBorderColors[i].label,
					availableBorderColors[i].value == data.settings.unmarkedItemsBorderColor);
		}
		
		UI.addOnChangeListener('border_color_unmarked_items',
				function()
				{
					loadData();
					data.settings.unmarkedItemsBorderColor = $('#border_color_unmarked_items' + listIndex).val();
					saveData();
					updateLinks();
				});
		
		$(data.lists).each(function(listIndex, list) {
			html = UI.buildTableRow(
				'',
				'<b>Settings of List ' + list.name + '</b>',
				'');
			$('#item_marker_settings_body').append(html);
			
			html = UI.buildTableRow(
					'',
					'Border color for marked items',
					UI.buildSelection(
							'border_color_marked_items' + listIndex,
							'Select the border color for marked items'));
			$('#item_marker_settings_body').append(html);
			
			for (var i = 0; i < availableBorderColors.length; i++) {
				UI.addSelectionOption('border_color_marked_items' + listIndex,
						availableBorderColors[i].value,
						availableBorderColors[i].label,
						availableBorderColors[i].value == list.settings.markedItemsBorderColor);
			}
			
			html = UI.buildTableRow(
					'',
					'Use links to mark/unmark items',
					UI.buildCheckBox(
							'use_links_to_toggle_items' + listIndex,
							list.settings.toggleMarksWithLinks));
			$('#item_marker_settings_body').append(html);
			
			html = UI.buildTableRow(
					'',
					'Show warning during reviews',
					UI.buildCheckBox(
							'show_review_warning' + listIndex,
							list.settings.showReviewWarning));
			$('#item_marker_settings_body').append(html);
			
			html = UI.buildTableRow(
					'',
					'Add 30 second delay before review answer is possible',
					UI.buildCheckBox(
							'add_delay_before_answer_is_possible' + listIndex,
							list.settings.addDelayBeforeAnswerIsPossible));
			$('#item_marker_settings_body').append(html);
			
			UI.addOnChangeListener('border_color_marked_items' + listIndex,
					function()
					{
						loadData();
						data.lists[listIndex].settings.markedItemsBorderColor = $('#border_color_marked_items' + listIndex).val();
						saveData();
						updateLinks();
					});
			UI.addOnChangeListener('use_links_to_toggle_items' + listIndex,
					function()
					{
						loadData();
						data.lists[listIndex].settings.toggleMarksWithLinks = $('#use_links_to_toggle_items' + listIndex).is(':checked');
						saveData();
						updateLinks();
					});
			UI.addOnChangeListener('show_review_warning' + listIndex,
					function()
					{
						loadData();
						data.lists[listIndex].settings.showReviewWarning = $('#show_review_warning' + listIndex).is(':checked');
						saveData();
					});
			UI.addOnChangeListener('add_delay_before_answer_is_possible' + listIndex,
					function()
					{
						loadData();
						data.lists[listIndex].settings.addDelayBeforeAnswerIsPossible = $('#add_delay_before_answer_is_possible' + listIndex).is(':checked');
						saveData();
					});
			UI.addOnClickListener('item_marker_close_btn',
					function(e)
					{
						toggleSettingsWindow(e);
					});
		});
		
		settingsWindowAdded = true;
	}

    function toggleSettingsWindow(e) {
        if (e !== undefined) e.preventDefault();

        // Add the manager if not already.
        if (!settingsWindowAdded) buildSettingsWindow();

        $('#item_marker').slideToggle();
        $('html, body').animate({scrollTop: 0}, 800);
    }
	
	//-------------------------------------------------------------------
	// Update the current page and add the item marker features
	//-------------------------------------------------------------------
	function updatePage() {
		if (pageUpdateIsLocked) {
			return;
		}
		
		if (WaniKani.is_on_dashboard()) {
			updateDashboardPage();
		}
		else if (WaniKani.is_on_review_page() || WaniKani.is_on_lesson_page()) {
			updateReviewAndLessonPage();
		}
		else if (WaniKani.is_on_review_session_page()) {
			updateReviewSessionPage();
		}
		else {
			var location = decodeURI(window.location);
			var parsedUrl = WaniKani.parse_item_url(location);
			if (parsedUrl) {
				updateItemPage(parsedUrl.type, parsedUrl.name);
			}
		}
		
		updateLinks();
	}
	
	function updateLinks() {
		$('a').each(function(i, item) {
			var href = $(this).attr('href');
			
			updateLinkFunction(href, $(this));
			updateItemBorder(href, $(this));
		});
		
		$('ul.alt-character-list a').each(function(i, item) {
			var href = $(this).attr('href');
			
			var parsedUrl = WaniKani.parse_item_url(href);
			if (parsedUrl) {
				$(this).css('box-shadow', '');
				
				updateItemBorder(href, $(this).parent('li'));
			}
		});
		
		
		$(data.lists).each(function(listIndex, list) {
			$('#marked_items_list' + listIndex + ' a').each(function(i, item) {
				var href = $(this).attr('href');
				
				var parsedUrl = WaniKani.parse_item_url(href);
				if (parsedUrl) {
					$(this).css('box-shadow', '');
					
					updateItemBorder(href, $(this).children('span:nth(0)'));
				}
			});
		});
	}
	
	function updateLinkFunction(url, htmlElem) {
		var parsedUrl = WaniKani.parse_item_url(url);
		if (parsedUrl) {
			htmlElem.off('click');
			$(data.lists).each(function(listIndex, list) {
				if (list.settings.toggleMarksWithLinks) {
					htmlElem.on('click',
						function(e)
						{
							e.preventDefault();
							toggleItemByUri(listIndex, url);
						});
				}
			});
		}
	}
	
	function updateItemBorder(url, htmlElem) {
		var parsedUrl = WaniKani.parse_item_url(url);
		if (parsedUrl) {
			var marked = false;
			var boxShadow = '';
			
			var shadowWidth = 2;
			$(data.lists).each(function(listIndex, list) {
				var item_index = indexOf(listIndex, parsedUrl.type, parsedUrl.name);
				if (item_index !== -1) {
					marked = true;
					
					if (list.settings.markedItemsBorderColor != 'no_border') {
						if (boxShadow == '') {
							boxShadow = 'inset 0 0 0 ' + shadowWidth + 'px ' + list.settings.markedItemsBorderColor;
						}
						else {
							boxShadow = boxShadow + ', inset 0 0 0 ' + shadowWidth + 'px ' + list.settings.markedItemsBorderColor;
						}
						shadowWidth = shadowWidth + 2;
					}
				}
			});
			
			if (marked) {
				htmlElem.css('box-shadow', boxShadow);
			}
			else {
				if (data.settings.unmarkedItemsBorderColor != 'no_border') {
					htmlElem.css('box-shadow', 'inset 0 0 0 2px ' + data.settings.unmarkedItemsBorderColor);
				}
				else {
					htmlElem.css('box-shadow', '');
				}
			}
		}
	}
	
	//-------------------------------------------------------------------
	// Load item marker data from local storage
	//-------------------------------------------------------------------
	function loadData() {
		var storedData = localStorage.getItem(localStoragePrefix + 'markedItems_v' + data.version);
		if (storedData != null) {
			console.log('Read current version ' + data.version);
			storedData = JSON.parse(storedData);
			data = storedData;
			return;
		}
		
		storedData = localStorage.getItem(localStoragePrefix + 'markedItems'); // v1
		if (storedData != null) {
			console.log('Read old version 1');
			
			storedData = JSON.parse(storedData);
			data.lists[0].items = storedData.items;
			
			var storedSettings = localStorage.getItem(localStoragePrefix + 'settings');
			if (storedSettings) {
				storedSettings = JSON.parse(storedSettings);
				data.lists[0].settings = storedSettings;
			}
			
			return;
		}
	}

	//-------------------------------------------------------------------
	// Save item marker data to local storage
	//-------------------------------------------------------------------
	function saveData() {
		localStorage.setItem(localStoragePrefix + 'markedItems_v' + data.version, JSON.stringify(data));
	}

	//-------------------------------------------------------------------
	// Return the index of the given item in the list
	// returns -1 if item isn't in list
	//-------------------------------------------------------------------
	function indexOf(listIndex, type, name) {
		return data.lists[listIndex].items.findIndex(function(item) { return (item.type == type) && (item.name == name); });
	}

	//-------------------------------------------------------------------
	// Remove all marks
	//-------------------------------------------------------------------
	function unmarkAllItems(listIndex) {
		loadData();
		data.lists[listIndex].items = [];
		saveData();
		updatePage();
	}

	//-------------------------------------------------------------------
	// Force refresh of page and data
	//-------------------------------------------------------------------
	function forceRefresh() {
		WaniKani.reset_radical_data(true);
		
		$(data.lists).each(function(listIndex, list) {
			for (var i = 0; i < list.items.length; i++) {
				if (list.items[i].type == 'radicals') {
					list.items[i].radical_character = null;
					list.items[i].radical_image = null;
				}
			}
		});
		
		updatePage();
	}
	
	//-------------------------------------------------------------------
	// Unmark a single item
	//-------------------------------------------------------------------
	function unmarkItem(listIndex, type, name) {
		loadData();
		var index = indexOf(listIndex, type, name);
		if (index > -1) {
			data.lists[listIndex].items.splice(index, 1);
			saveData();
		}
		
		updatePage();
	}
	
	function toggleItemByUri(listIndex, uri) {
		var parsedUrl = WaniKani.parse_item_url(uri);
		if (parsedUrl) {
			var index = indexOf(listIndex, parsedUrl.type, parsedUrl.name);
			if (index > -1) {
				unmarkItem(listIndex, parsedUrl.type, parsedUrl.name);
			}
			else {
				markItem(listIndex, parsedUrl.type, parsedUrl.name);
			}
		}
	}

	//-------------------------------------------------------------------
	// Sort the list of marked items
	//-------------------------------------------------------------------
	function sortItems(listIndex) {
		loadData();
		
		data.lists[listIndex].items.sort(
			function(a, b) {
				if (a.type == 'radicals') {
					if (b.type != 'radicals') {
						return -1;
					}
				}
				else if (a.type == 'kanji') {
					if (b.type == 'radicals') {
						return 1;
					}
					else if (b.type == 'vocabulary') {
						return -1;
					}
				}
				else {
					if (b.type != 'vocabulary') {
						return 1;
					}
				}
				
				return a.name.localeCompare(b.name);
			});
			
		saveData();
		updatePage();
	}
	
	//-------------------------------------------------------------------
	// Mark a single item
	//-------------------------------------------------------------------
	function markItem(listIndex, type, name) {
		loadData();
		
		var index = indexOf(listIndex, type, name);
		if (index === -1) {
			data.lists[listIndex].items.push({type: type, name: name, radical_character: null, radical_image: null});
			saveData();
		}
		
		updatePage();
	}
	
	//-------------------------------------------------------------------
	// Copy all items from the source to the target list
	// aka marks them all in the target list
	//-------------------------------------------------------------------
	function copyAll(sourceListIndex, targetListIndex) {
		loadData();
		
		pageUpdateIsLocked = true;
		
		for (var i = 0; i < data.lists[sourceListIndex].items.length; i++) {
			var item = data.lists[sourceListIndex].items[i];
			
			markItem(targetListIndex, item.type, item.name);
		}
		
		pageUpdateIsLocked = false;
		
		updatePage();
	}

	//-------------------------------------------------------------------
	// Callback if the currentItem changes
	//-------------------------------------------------------------------
	function onCurrentItemChanged() {
		updatePage();
	}
	
	//-------------------------------------------------------------------
	// Extends the review session page
	// - Adds buttons to mark/unmark the current item
	//-------------------------------------------------------------------
	function updateReviewSessionPage() {
		$.jStorage.stopListening('currentItem', onCurrentItemChanged);
		$.jStorage.listenKeyChange('currentItem', onCurrentItemChanged);
		
		var currentItem = $.jStorage.get('currentItem');
		
		var name;
		var type;
		
		if (currentItem.hasOwnProperty('rad')) {
			type = 'radicals';
			name = currentItem.en[0].toLowerCase().replace(/\s/g, "-");
		}
		else if (currentItem.hasOwnProperty('kan')) {
			type = 'kanji';
			name = currentItem.kan;
		}
		else if (currentItem.hasOwnProperty('voc')) {
			type = 'vocabulary';
			name = currentItem.voc;
		}
		else {
			return;
		}
		
		//console.log('updateReviewSessionPage - type: ' + type);
		//console.log('updateReviewSessionPage - name: ' + name);
		
		var showReviewWarning = false;
		var addDelayBeforeAnswerIsPossible = false;
	
		$(data.lists).each(function(listIndex, list) {
			$('#option-mark' + listIndex).remove();
			$('#option-unmark' + listIndex).remove();
			
			var item_index = indexOf(listIndex, type, name);
			if (item_index === -1) {
				$('#additional-content ul').append('<li id="option-mark' + listIndex + '"><span title="Mark on list ' + list.name + '">Mark ' + list.name + '</span></li>');
				$('#option-mark' + listIndex).on('click', function() { markItem(listIndex, type, name); });
			}
			else {
				$('#additional-content ul').append('<li id="option-unmark' + listIndex + '"><span title="Unmark from list ' + list.name + '">Unmark ' + list.name + '</span></li>');
				$('#option-unmark' + listIndex).on('click', function() { unmarkItem(listIndex, type, name); });				
				
				if (list.settings.showReviewWarning) {
					showReviewWarning = true;
				}

				if (list.settings.addDelayBeforeAnswerIsPossible) {
					addDelayBeforeAnswerIsPossible = true;
				}
			}
		});
		
		$('#warning1').remove();
		$('#warning2').remove();
		if (showReviewWarning) {
			$('#character').append('<span id="warning1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;!!!</span>');
			$('#character').prepend('<span id="warning2">!!!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
		}

		var currentQuestionType = $('#question-type').attr('class');
		
		$('#reviewWarning').remove();
		if ((currentItem.id != lastSeenItem) || (currentQuestionType != lastSeenQuestionType)) {
			if (addDelayBeforeAnswerIsPossible) {
				$('#answer-form').prepend('<span id="reviewWarning">&nbsp;<br />Beware, it\'s a marked item! Think for a moment about your answer.<br />&nbsp;</span>');
				$('#answer-form form').hide();
				
				setTimeout(function updateReviewSessionPage() {
						$('#answer-form form').show();
						$('#answer-form input').focus();
						$('#reviewWarning').remove();
					}, 30000);
			}
			else {
				$('#answer-form form').show();
				$('#answer-form input').focus();
			}
		}
		
		calculateDynamicWidthForReviewPage();
		
		lastSeenItem = currentItem.id;
		lastSeenQuestionType = currentQuestionType;
	}
	
	//-------------------------------------------------------------------
	// Updates the dynamic with for the review page
	//-------------------------------------------------------------------
	function calculateDynamicWidthForReviewPage(){
		var liCount = $('#additional-content ul').children().size();
		var percentage = 100 / liCount;
		percentage -= 0.1;
		var cssDynamicWidth = 
			'#additional-content ul li {' +
			'    width: ' + percentage + '% !important' +
			'} ';

		addStyle(cssDynamicWidth);
	}
	
	//-------------------------------------------------------------------
	// Adds a css to the page
	//-------------------------------------------------------------------
	function addStyle(aCss) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (head) {
			style = document.createElement('style');
			style.setAttribute('type', 'text/css');
			style.textContent = aCss;
			head.appendChild(style);
			return style;
		}
		return null;
	}
	
	//-------------------------------------------------------------------
	// Extends the review and lesson page
	// - Adds a black/white border around marked/unmarked items displayed on the page
	//-------------------------------------------------------------------
	function updateReviewAndLessonPage() {
		var query = $('div.active li');
		
		if (query.length == 0) { // Page not completly loaded yet
		  setTimeout(updatePage, 1000);
		  return;
		}
		
		updateLinks();
	}
	
	//-------------------------------------------------------------------
	// Extends the dashboard
	// - Adds a 'marked items' section
	// - Adds common buttons and marked items list to section
	//-------------------------------------------------------------------
	function updateDashboardPage() {
		var query = $('section.progression');
		if (query.length != 1) {
			return;
		}
		
		$('#marked_items').remove();
		
		$('section.progression').after('<section id="marked_items" />');
		
		$(data.lists).each(function(listIndex, list) {
			$('#marked_items').append('<h2>Marked items - List ' + list.name + '</h2>');
			$('#marked_items').append('<p id="marked_items_buttons' + listIndex + '" />');
		
			addCommonButtons(listIndex);
			addMarkedItemsList(listIndex);
		});
	}
	
	//-------------------------------------------------------------------
	// Extends the an item page
	// - Adds a 'marked items' section
	// - Adds common buttons and marked items list to section
	// - Adds buttons to mark/unmark the current item
	//-------------------------------------------------------------------
	function updateItemPage(type, name) {
		var query = $('section#information');
		if (query.length != 1) {
			return;
		}
		
		$('#marked_items').remove();
		
		$('section#information').after('<section id="marked_items" />');
		
		$(data.lists).each(function(listIndex, list) {
			$('#marked_items').append('<h2>Marked items - List ' + list.name + '</h2>');
			$('#marked_items').append('<p id="marked_items_buttons' + listIndex + '" />');

			var index = indexOf(listIndex, type, name);
			if (index === -1) {
				var button = $('<button>Mark "' + name + '"</button>');
				button.on('click', function() { markItem(listIndex, type, name); });
				$('#marked_items_buttons' + listIndex).append(button)
			}
			else {
				var button = $('<button>Unmark "' + name + '"</button>');
				button.on('click', function() { unmarkItem(listIndex, type, name); });
				$('#marked_items_buttons' + listIndex).append(button)
			}

			addCommonButtons(listIndex);
			addMarkedItemsList(listIndex);
		});
	}

	//-------------------------------------------------------------------
	// Adds common buttons that are used on multiple locations
	//-------------------------------------------------------------------
	function addCommonButtons(listIndex) {
		if (data.lists[listIndex].items.length > 0) {
			var button = $('<button>Unmark all</button>');
			button.on('click', function() { unmarkAllItems(listIndex); });
			$('#marked_items_buttons' + listIndex).append(button)
		}
		
		if (data.lists[listIndex].items.length > 0) {
			$(data.lists).each(function(otherListIndex, otherList) {
				if (otherListIndex != listIndex) {
					var button = $('<button>Copy all to List ' + otherList.name + '</button>');
					button.on('click', function() { copyAll(listIndex, otherListIndex); });
					$('#marked_items_buttons' + listIndex).append(button)
				}
			});
		}
		
		if (data.lists[listIndex].items.length > 0) {
			var button = $('<button>Sort</button>');
			button.on('click', function() { sortItems(listIndex); });
			$('#marked_items_buttons' + listIndex).append(button)
		}
		
		{
			var button = $('<button>Force refresh</button>');
			button.on('click', function() { forceRefresh(); });
			$('#marked_items_buttons' + listIndex).append(button)
		}
	}
	
	 function buildItemList(listIndex) {
		detect_radical_characters();
		
		for (var i = 0; i < data.lists[listIndex].items.length; i++) {
			var item = data.lists[listIndex].items[i];
			
			var typeForClass = item.type;
			if (typeForClass == 'radicals')
				typeForClass = 'radical';
			
			var itemText = item.name;
			
			if (item.type == 'radicals') {
				if (item.radical_image && item.radical_image != '') {
					itemText = '<img src="' + item.radical_image + '"/>';
				}
				else if (item.radical_character != '') {
					itemText = item.radical_character;
				}
				else {
					itemText = '<i class="radical-' + item.name + '"></i>';
				}
			}
			
			$('#marked_items_list' + listIndex).append(
				'<a href="/' + item.type + '/' + item.name + '">' +
				'	<span class="' + typeForClass + '-icon" lang="ja">' +
				'		<span style="display: inline-block; margin-top: 0.1em;" class="japanese-font-styling-correction">' +
							itemText +
				'		</span>' +
				'	</span>' +
				'</a>');
		}
		
		updateLinks();
	};
	
	//-------------------------------------------------------------------
	// Adds the list of marked items to the current page
	//-------------------------------------------------------------------
	function addMarkedItemsList(listIndex) {
		$('#marked_items').append('<span id="marked_items_list' + listIndex + '" />')
	 
		if (data.lists[listIndex].items.length == 0) {
			$('#marked_items_list' + listIndex).append('<p>No marked items</p>');
		}
		else {
			WaniKani.query_page_radicals_with_images().then(function() { buildItemList(listIndex); });
		}
	}
	
	//-------------------------------------------------------------------
	// Uses the radical info to determine if a radical uses a character
	// or an image.
	//-------------------------------------------------------------------
	function detect_radical_characters() {
		
		var radicals_with_images = WaniKani.get_radicals_with_image();
		
		$(data.lists).each(function(listIndex, list) {
			$(list.items).each(function(itemIndex, item) {
				if ((item.type == 'radicals') && (item.radical_character == null)) {
					var radical_character = null;
					
					var foundRadical = radicals_with_images.find(function(radical_with_image) {
						return radical_with_image.name == item.name;
					});
					
					if (!foundRadical) {
						return;
					}
					
					console.log('detect_radical_characters: ' + item.name + ' -> ' + foundRadical.character + ' / ' + foundRadical.image);
					
					list.items[itemIndex].radical_character = foundRadical.character;
					list.items[itemIndex].radical_image = foundRadical.image;
				}
			});
		});
		
		saveData();
	}

}());