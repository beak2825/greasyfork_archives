// ==UserScript==
// @name         Highrise Enhancements
// @namespace    http://tampermonkey.net/
// @version      0.63d
// @description  try to take over the world!
// @author       You
// @require      https://code.jquery.com/jquery-latest.min.js
// @require      https://apis.google.com/js/api.js
// @match        https://*.highrisehq.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/26136/Highrise%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/26136/Highrise%20Enhancements.meta.js
// ==/UserScript==


GM_addStyle('.date-container {background: #f0f6f9; color: #554444 !important; white-space: nowrap; border: 1px solid #ddd; border-radius: 2px; black !important; padding: 2px 4px;}');
GM_addStyle('.comment-tracking {color: #777 !important; padding: 1px !important} .comment-tracking:hover {background: #666 !important; color: white !important}');
GM_addStyle('#linked-companies-div {width: 90%; margin: 0 auto;}');
GM_addStyle('#linked-companies-div select {width: 90%; margin: 0; }');
GM_addStyle('#linked-companies-div button {float: right; padding: 5px 10px; background: #5086a0; border-radius: 4px; border: solid 1px #317ea5; font-size: 13px; text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25); color: white;}');

var products = ['pt', 'puretane', 'bf', 'bfb', 'bf-blend', 'blueflame', 'blue flame', 'nuggy', 's5'];
var company = '';
var comments_length = 0;
var dates_length = 0;
var biz_tag_marker = '@';

var orderBlock = document.createElement('div');
orderBlock.style.cssText = 'margin: 9px 0;';
var orderLineLabel = document.createElement('div');
orderLineLabel.style.cssText += 'font-size: 11px; color: #777;';
orderLineLabel.className = 'label';
var orderLineDiv = document.createElement('div');
orderBlock.appendChild(orderLineLabel);
orderBlock.appendChild(orderLineDiv);

var notesBlock = document.createElement('div');
notesBlock.style.cssText = 'margin: 9px 0;';
var notesLabel = document.createElement('div');
notesLabel.style.cssText += 'font-size: 11px; color: #777;';
notesLabel.className = 'label';
var notesDiv = document.createElement('div');
var noteOne = document.createElement('div');
var noteTwo = document.createElement('div');
notesBlock.appendChild(notesLabel);
notesBlock.appendChild(notesDiv);

var matched = [];

(function() {
    'use strict';
    
    var url = window.location.href;
    if (url.toLowerCase().indexOf('iframe') < 0) {
        window.load = start();
    }
})();

function start() {
    settingsMenu();
    settingsButton();
    
    if (GM_getValue('Highlight_overdue_tasks')) {
        highlightOverdue();
    }
    
	timestamp_opt = GM_getValue('Show_full_timestamp');
	tracking_opt = GM_getValue('Link_tracking_numbers');
	var feed = document.getElementById('recordings');
	if (feed !== null) {
		commentMods(timestamp_opt, tracking_opt);
	}
	else if (window.location.href.indexOf('notes') > -1) {
		var content = document.getElementsByClassName('text-content')[0];
		linkTracking(content);
	}
    
    if (GM_getValue('Show_recent_order_and_notes_in_tasks')) {
		var wait_for_popup = setInterval(popupScanner, 200);
    }
    
    if (GM_getValue('Auto_share_tasks')) {
        taskcheckbox();
    }
	
	if (GM_getValue('Pagination')) {
		if (window.location.href.indexOf('parties?') > -1) {
			pagination();
		}
	}
	if (GM_getValue('Show_linked_locations')) {
		if (location.href.indexOf('companies/') > -1) {
			get_all_locations();
		}
	}
	//get_hours();
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function get_hours() {
	gapi.load('auth2', init);
	var user = gapi.auth2.getAuthInstance().currentUser.get();
	var oauthToken = user.getAuthResponse().access_token;
	var xhr = new XMLHttpRequest();
	xhr.open('GET',
			 'https://people.googleapis.com/v1/people/me/connections' +
			 '?access_token=' + encodeURIComponent(oauthToken.access_token));
	xhr.send();
}

function codeAddress() {
    var address = 'Eugene, OR';
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == 'OK') {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

function get_all_locations() {
	var current_id = location.href.split('/companies/')[1];
	var links = {};
	current_id = current_id.split('-')[0];
	$.get('/companies/' + current_id + '.xml', function(companyXml) {
		var tag, text, id, name;
		var tags = {};
		var companyJson = xmlToJson(companyXml);
		var tagsJson = companyJson.company.tags.tag;
		console.log(tagsJson);
		if (tagsJson.length === undefined) {
			text = tagsJson.name['#text'];
			id = tagsJson.id['#text'];
			if (text.substring(0, 1) === (biz_tag_marker)) {
				tags[text] = id;
			}
		}
		else {
			for (tag in tagsJson) {
				if (tagsJson.hasOwnProperty(tag)) {
					text = tagsJson[tag].name['#text'];
					id = tagsJson[tag].id['#text'];
					if (text.substring(0, 1) === (biz_tag_marker)) {
						tags[text] = id;
					}
				}
			}
		}
		for (tag in tags) {
			console.log(tag);
			$.get('/companies.xml?tag_id=' + tags[tag], function(relCompanyXml) {
				var companiesJson = xmlToJson(relCompanyXml).companies.company;
				console.log(companiesJson);
				for (company in companiesJson) {
					if (companiesJson.hasOwnProperty(company)) {
						name = companiesJson[company].name['#text'];
						id = companiesJson[company].id['#text'];
						var url = name.replace(/[^a-z0-9]/gi, '-');
						url = url.replace(/-{2,}/g, '-');
						url = 'https://wodc.highrisehq.com/companies/' + id + '-' + url;
						links[name] = url;
					}
				}
			}).then(function() {
				var len = Object.keys(links).length;
				if (len > 1) {
					var location_text = 'location';
					if (len > 2) location_text += 's';
					var linksDiv, linksSelect;
					if (document.getElementById('linked-companies-div') === null) {
						linksDiv = document.createElement('div');
						linksDiv.innerHTML = '<h3><span id="loc_num">' + (len - 1) + '</span> other tagged ' + location_text + ':</h3>';
						linksDiv.setAttribute('id', 'linked-companies-div');
						linksSelect = document.createElement('select');
						linksSelect.setAttribute('id', 'linked-companies-select');
						linksDiv.appendChild(linksSelect);
						var goButton = document.createElement('button');
						goButton.innerHTML = 'Go';
						goButton.addEventListener('click', function() {
							location.href = document.getElementById('linked-companies-select').value;
						});
						linksDiv.appendChild(goButton);
						var content = document.getElementsByClassName('content')[0];
						content.insertBefore(linksDiv, content.getElementsByClassName('display switches')[0]);
					}
					else {
						linksDiv = document.getElementById('linked-companies-div');
						linksSelect = document.getElementById('linked-companies-select');							
					}
					linksSelect.innerHTML = '';
					document.getElementById('loc_num').innerHTML = (Object.keys(links).length - 1);
					for (var link in links) {
						if (links.hasOwnProperty(link)) {
							if (links[link].toLowerCase() !== location.href.toLowerCase()) {
								var option = document.createElement('option');
								option.innerHTML = link;
								option.value = links[link];
								linksSelect.appendChild(option);
							}
						}
					}
				}
			});
		}
	});
}

function pagination() {
	var div = document.createElement('div');
	var column = document.getElementById('page_main_column');
	var h3 = document.createElement('h3');
	h3.innerHTML = 'Jump to page:';
	div.appendChild(h3);
	var content = column.getElementsByClassName('party_selection')[0];
	var url = window.location.href;
	var par = url.split('n=')[1];
	var link = url.split('&n=')[0];
	var currnum = (parseInt(par.split('&')[0]) / 50) + 1;
	par = par.split('&')[1];
	
	var select = document.createElement('select');
	div.appendChild(select);
	select.style.cssText = 'width: 78%';
	var num;
	if (url.indexOf('https://wodc.highrisehq.com/parties') > -1) {
		num = parseInt(document.getElementsByClassName('count total')[0].innerHTML.replace(/,/g, ''));
	}
	
	var pagecount = Math.ceil(num / 50);
	for (var i = 0; i < pagecount; i++) {
		var option = document.createElement('option');
		option.innerHTML = i + 1;
		option.value = link + '&n=' + (i * 50) + '&' + par;
		select.appendChild(option);
	}
	
	content.insertBefore(div, content.firstChild);
	
	var button = document.createElement('button');
	button.innerHTML = 'Go';
	button.style.cssText = 'width: 18%; margin-left: 4%;';
	button.className = 'main-button';
	div.appendChild(button);
	select.options[currnum - 1].selected = true;

	button.addEventListener('click', function() {
		window.location.href = select.value;
	});
}

function settingsMenu() {
    var options = {
		'Auto share tasks': 'Make sure checkbox "Let everyone see this task" is checked and hidden', 
		'Highlight overdue tasks': 'Highlight overdue text next to tasks link', 
		'Show full timestamp': 'Show the time and date on notes', 
		'Show recent order and notes in tasks': 'Show most recent order and last 2 notes in tasks popup window',
		'Show linked locations': 'Show links to other locations for this business',
		'Pagination': 'Show "jump to page #" option on search pages',
		'Load hours': 'Automatically find store hours on customer pages',
	    'Link tracking numbers': 'Clickable tracking numbers'
	};
    
    var page_cover = document.createElement('div');
    document.body.appendChild(page_cover);
    page_cover.setAttribute('id', 'page_cover');
    page_cover.style.cssText = 'display: none; position: fixed; top: 0px; left: 0px; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1000;';

    var settings_div = document.createElement('div');
    document.body.appendChild(settings_div);
    settings_div.setAttribute('id', 'settings_div');
    settings_div.style.cssText = 'padding: 50px; width: 600px; left: 50%; margin-left: -17.5%; display: none; position: fixed; background: white; border-radius: 20px; text-align: center; z-index: 1001;';

    var ul = document.createElement('ul');
    settings_div.appendChild(ul);

    page_cover.addEventListener('click', function() {
        page_cover.style.display = 'none';
        settings_div.style.display = 'none';
    });
	
    for (var key in options) {
		if (options.hasOwnProperty(key)) {
			var liButton = document.createElement('li');
			var liDesc = document.createElement('li');
			var button = document.createElement('button');
			button.innerHTML = key;
			ul.appendChild(liButton);
			ul.appendChild(liDesc);
			liButton.appendChild(button);
			liDesc.innerHTML = options[key];
			liDesc.style.cssText = 'margin-bottom: 20px;';
			button.style.cssText = 'border: none !important; margin: 5px 0; border-radius: 5px; color: white;';

			var gm_var = key.replace(/ /g, '_');
			if (GM_getValue(gm_var) === undefined) {
				GM_setValue(gm_var, true);
			}

			if (GM_getValue(gm_var) === true) {
				button.style.backgroundColor = '#378622';
			}
			else {
				button.style.backgroundColor = '#bd4b4b';
			}

			button.addEventListener('click', function() {
				gm_var = this.innerHTML.replace(/ /g, '_');
				GM_setValue(gm_var, !GM_getValue(gm_var));

				if (GM_getValue(gm_var) === true) {
					this.style.backgroundColor = '#378622';
				}
				else {
					this.style.backgroundColor = '#bd4b4b';
				}
			});
		}
    }
	
	var update = document.createElement('a');
	update.innerHTML = 'Update';
	update.href = 'https://greasyfork.org/scripts/26136-highrise-enhancements/code/Highrise%20Enhancements.user.js';
	update.style.cssText = 'display: block; margin-top: 50px; font-size: 2em; font-weight: bold; text-decoration: none; color: gray;';
	settings_div.appendChild(update);
}

function settingsButton() {
    var menu = document.getElementsByClassName('global_links')[0];
    var li = document.createElement('li');
    menu.appendChild(li);
    var button = document.createElement('button');
    li.appendChild(button);
    
    button.style.cssText = 'border: none; color: #56778b; font-size: 12px;';
    
    button.innerHTML = 'Super Secret';
    button.addEventListener('mouseover', function() {
        button.style.color = 'black';
    });
    
    button.addEventListener('mouseout', function() {
        button.style.color = '#56778b';
    });
    
    button.addEventListener('click', settingsPopup);
}

function taskcheckbox() {
    var taskcheckbox = [];
    taskcheckbox.push(document.getElementById('public_checkbox_task_main'));
    if (document.getElementById('public_checkbox_task_page') !== null) {
        taskcheckbox.push(document.getElementById('public_checkbox_task_page'));
    }
    
    for (var i = 0; i < taskcheckbox.length; i++) {
        taskcheckbox[i].checked = 'checked';
        taskcheckbox[i].parentNode.style.display = 'none';

        var task = document.createElement('div');
        taskcheckbox[i].parentNode.parentNode.insertBefore(task, taskcheckbox[i].parentNode);

        if (taskcheckbox[i].checked) {
            task.innerHTML = '<i>Everyone can see this task</i>';
        }
        else {
            task.innerHTML = '<b>TASK HIDDEN</i>';
        }
        task.style.cssText = 'font-size: 15px !important;';
    }
}


function settingsPopup() {
    var page_cover = document.getElementById('page_cover');
    var settings_div = document.getElementById('settings_div');
    page_cover.style.display = 'block';
    settings_div.style.display = 'block';
}


function highlightOverdue() {
    var span = document.getElementsByTagName('span');
    var len = span.length;
	var overdue;
    
    for (var i = 0; i < len; i++) {
        if (span[i].innerHTML.indexOf('overdue') > -1) {
            var num = span[i].innerHTML.split('overdue')[0];
            num = num.split(' ');
            num = num[num.length - 2];
            var text = num + ' ' + 'overdue';
            span[i].innerHTML = span[i].innerHTML.replace(text, '<div id="highlightoverdue">' + text + '</div>');
        }
    }
    
	try {
		overdue = document.getElementById('highlightoverdue');
		overdue.style.cssText = 'color: red; display: inline-block; font-weight: bold;';
	} catch (e) {
		
	}
}

function commentMods(timestamp, track) {
	var debug = document.createElement('div');
	document.body.insertBefore(debug, document.body.firstChild);
	debug.style.cssText = 'position: fixed; top:100px; left: 0px;';
	var tracking_line, tracking_number, splits, i, j, pattern, match, link;
    var timer = setInterval(function() {
        var feed = document.getElementById('recordings');
        var dates = feed.getElementsByClassName('date-container');
		var contents = feed.getElementsByClassName('text-content');
        var dates_len = dates.length;
		var con_len = contents.length;
        var split, date, hour, min_sec, ampm, i;
		
		if (timestamp) {
			dates_length = dates_len;
			for (i = 0; i < dates_len; i++) {
				if (dates[i].innerHTML.indexOf(' - ') === -1) {
					split = dates[i].getAttribute('data-timestamp').split(' ');
					hour = parseInt(split[1].split(':')[0]);
					min_sec = split[1].split(':');
					min_sec = min_sec[1] + ':' + min_sec[2];

					if (hour >= 8) {
						hour -= 7;
					}
					else {
						hour += 17;
					}

					if (hour > 12) {
						hour -= 12;
						ampm = 'PM';
					}
					else if (hour == 12) {
						ampm = 'PM';
					}
					else {
						ampm = 'AM';
					}

					if (hour < 10) {
						hour = '0' + hour.toString();
					}
					dates[i].innerHTML = fixDate(split[0]) + ' - ' + hour + ':' + min_sec + ' ' + ampm;
				}
			}
		}
		
		if (track) {
			if (comments_length !== con_len) {
				comments_length = con_len;
				for (i = 0; i < con_len; i++) {
					contents[i].innerHTML = linkTracking(contents[i].innerHTML);
				}
			}
		}
    }, 50);
}

function linkTracking(content) {
	var pattern, match, link;
	pattern = /\d{3}-\d{6}-\S/; //YRC
	try{
		match = content.match(pattern).toString();
		console.log(match[0]);

		if (matched.indexOf(match) == -1) {
			matched.push(match);
			link = '<a class="comment-tracking" href="https://my.yrc.com/tools/#/track/shipments?endDate=&referenceNumber=<TRACKING>&referenceNumberType=PRO&startDate=2014-02-24">' + match + '</a>';
			link = link.replace('<TRACKING>', match);
			content = content.replace(match, link);
		}
	}
	catch (e) {}
	pattern = /1Z19169V\d{10}/; //UPS
	try{
		match = pattern.exec(content).toString();
	}
	catch (e) {}
	if (matched.indexOf(match) == -1) {
		matched.push(match);
		link = '<a class="comment-tracking" href="https://wwwapps.ups.com/WebTracking/processRequest?HTMLVersion=5.0&Requester=NES&AgreeToTermsAndConditions=yes&loc=en_US&tracknum=<TRACKING>">' + match + '</a>';
		link = link.replace('<TRACKING>', match);
		content = content.replace(match, link);
	}
	pattern = /\d{22}/; //USPS
	try{
		match = pattern.exec(content).toString();
	}
	catch (e) {}
	if (matched.indexOf(match) == -1) {
		matched.push(match);
		link = '<a class="comment-tracking" href="https://tools.usps.com/go/TrackConfirmAction.action?tLabels=<TRACKING>">' + match + '</a>';
		link = link.replace('<TRACKING>', match);
		content = content.replace(match, link);
	}
	return content;
}

function popupScanner() {
    var company_name = '';
    var popup = document.getElementById('quick_show_window');
	var preview = popup.getElementsByClassName('preview')[0];
    
    var inner;
    
    if (popup.style.display !== 'none') {
		if (popup.getElementsByTagName('a').length > 0) {
			var link = popup.getElementsByTagName('img')[0].parentNode.href;

			company_name = popup.getElementsByTagName('h1')[0].innerHTML;
			if (company !== company_name) {
				var company_id = link.split('companies/')[1];
				company_id = company_id.split('-')[0];
				orderLineDiv.innerHTML = '<i>Loading notes...</i>';
				notesDiv.innerHTML = '';
				preview.appendChild(orderBlock);
				preview.appendChild(notesBlock);
				orderLineLabel.innerHTML = 'Most recent order:';
				notesLabel.innerHTML = 'Most recent notes:';
				company = company_name;
				get_notes(company_id);
			}
		}
    }
    else {
        company = '';
    }
}

function get_notes(company_id) {
	var last_order, last_notes = [], note_ids = [];
	$.get('/companies/' + company_id + '/notes.xml', function(data) {
		var json = xmlToJson(data);
		var notes = json.notes.note;
		for (var note in notes) {
			if (notes[note].body !== undefined) {
				if (last_notes.length < 2) {
					last_notes.push(note);
				}
				if (last_order === undefined) {
					for (var product in products) {
						if (last_order === undefined) {
							if (notes[note].body['#text'].indexOf(product) > -1) {
								if (notes[note].attachments !== undefined) {
									last_order = notes[note];
								}
							}
						}
					}
				}
			}
		}
		if (last_order !== undefined) {
			var order_date = fixDate(last_order['created-at']['#text']);
			var note_text = last_order.body['#text'].toLowerCase();
			var order_type = '???';
			
			if (note_text.indexOf('sample') > -1) {
				order_type = 'Sample';
			}
			else if (note_text.indexOf('$') > -1) {
				order_type = 'Order';
			}
			orderLineDiv.innerHTML = order_type + ' sent on ' + order_date;
		}
		else {
			orderLineDiv.innerHTML = 'No shipments found';
		}
		for (note in last_notes) {
			if (last_notes.hasOwnProperty(note)) {
				var date = fixDate(notes[note]['created-at']['#text']);
				var body = notes[note].body['#text'];
				var note_container = document.createElement('div');
				var note_id = 'note_cont_' + note;
				note_container.setAttribute('id', note_id);
				notesDiv.appendChild(note_container);
				finish_call(date, body, note_id, notes[note]);
			}
		}
	});
}

function finish_call(date, body, note_id, note) {
	$.ajax({
		url: '/users/' + note['author-id']['#text'] + '.xml',
		success: function(data) {
			var json = xmlToJson(data);
			var author = json.user.name['#text'];
			var note_container = document.getElementById(note_id);
			note_container.innerHTML = '<font color="#777">' + Array(61).join('-') + '</font><font color="#777">' + author + ' - ' + date + '</font><br>' + body;
		}
	});
}

function fixDate(date) {
	date = date.split('T')[0];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = date.split('-')[0];
    var month = months[parseInt(date.split('-')[1]) - 1];
    var day = date.split('-')[2].substring(0, 2);
    
    return month + ' ' + day + ', ' + year;
}

function xmlToJson(xml) {
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
}