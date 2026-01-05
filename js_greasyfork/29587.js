// ==UserScript==
// @id              baseutils-plugin
// @name            IITC plugin: Base Utils plugin
// @category        Tweaks
// @version         0.8.5
// @description     Provides some common base utils that might be reused by other plugins
// @include         https://www.ingress.com/intel*
// @include         https://ingress.com/intel*
// @match           https://www.ingress.com/intel*
// @match           https://ingress.com/intel*
// @grant           none
// @namespace https://greasyfork.org/users/122356
// @downloadURL https://update.greasyfork.org/scripts/29587/IITC%20plugin%3A%20Base%20Utils%20plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/29587/IITC%20plugin%3A%20Base%20Utils%20plugin.meta.js
// ==/UserScript==


/*
Enlightened ONLY. Don't share to untrusted operators.
DON'T UPLOAD IT TO ANY REPOSITORY

@AlfonsoML

0.1 20160409
Provides a public "shareText"and "copyToClipboard" method to copy any text to the clipboard
Icons: shareIcon, copyIcon

0.2
Improved Slack integration

0.3
Fixed copy to clipboard if it's the only option

0.4
Avoid crashing other plugins if they are run before this one

0.5
Save/read a text file

0.6
Parameter to tell that data is markdown

0.7
Merged toTelegram

0.7.1
Tweaks. Works on mobile

0.8
Avoid sending TG messages when using back button on IITCm.
Use native share on IITCm
Tweaks

0.8.1
Short title for each share option

0.8.2
Save huge files

0.8.3
Enable https://ingress.com/intel

0.8.4
Provide an option to load the permalink without forcing a refresh

0.8.5
Use currentColor for SVG

Usage instructions to send to Telegram:
1. Add @Urlrobot to the Telegram group that you want to hook to IITC
2. Use the /url command to get the URL to receive messages
3. In IITC, use any of the share options provided by other plugins and select the Telegram option
4. Put the url in the Group field and add any additional message that you want to send
5. Click OK
6. Magic!
Google doc https://docs.google.com/document/d/1TR7n7NsCHP_p2wz3P0bAiNwlsaaHY7MnWq7Y-VacSZ4/

*/

/* globals $, GM_info, dialog, android */

function wrapper(plugin_info) {
	'use strict';

	// ensure plugin framework is there, even if iitc is not yet loaded
	if (typeof window.plugin !== 'function') window.plugin = function() {};

	// use own namespace for plugin
	Object.defineProperty(window.plugin, 'baseUtils', { value: function() {} });

	var thisPlugin = window.plugin.baseUtils;

	thisPlugin.plugin_info = plugin_info.script;

	var defaultTelegramSettings = {
		groups: [],
		lastGroup : ''
	};

	var settingsTelegram = defaultTelegramSettings;

	var Key_TelegramSettings = 'plugin-totelegram-settings';

	/**
	 * Array of available options to share text.
	 * Other plugins can add their own options by pushing an object with the following properties
	 * {string} icon - HTML (svg or img element with base64 data) to show in the share pane.
	 * {string} title - Description of share method
	 * {Function} callback - Method that will be called when the user selects this option. Signature: function( {string} text, {string} title )
	 *	- text: text to share
	 *  - title: description of the shared text
	 * Example
	 * 	window.plugin.baseUtils.shareOptions.push( { icon: thisPlugin.copyIcon, title: 'Copy to Clipboard', callback: thisPlugin.copyToClipboard } );
	 */
	thisPlugin.shareOptions = [];

	/**
	 * Plugin setup
	 */
	thisPlugin.setup = function() {
		// Hide with CSS side panes
		$('<style>').prop('type', 'text/css').html(
			'#baseutils-notification {' +
			'	background: rgba(255,255,255,0.9);' +
			'	border: 1px solid rgba(0,0,0,.25);' +
			'	box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);' +
			'	color: #333;' +
			'	display: none;' +
			'	font-size: 180%;' +
			'	left: 50%;' +
			'	padding: 3px 6px 2px;' +
			'	pointer-events: none;' +
			'	position: absolute;' +
			'	top: 10px;' +
			'	transform: translateX(-50%);' +
			'	user-select: none;' +
			'	z-index: 10000;' +
			'}' +
			'.iitc-pane {' +
			'	background-color:rgba(8, 48, 78, 0.9);' +
			'	border: 1px solid #20A8B1;' +
			'	color: #eee;' +
			'	font-size: 95%;' +
			'	padding: 4px;' +
			'}' +
			'.iitc-textarea {' +
			'	background-color: rgba(0, 0, 0, 0.3);' +
			'	border: 0;' +
			'	color: #ffce00;' +
			'	font-family: inherit;' +
			'	font-size: inherit;' +
			'}' +
			'.baseutils-targetselection {' +
			'	position: absolute;' +
			'	z-index: 10000;' +
			'}' +
			'.baseutils-targetselection a {' +
			'	display: block;' +
			'	margin: 10px 5px 10px 0;' +
			'}' +
			'.baseutils-popup {' +
			'	display: block;' +
			'	margin: 3px 5px 2px 0;' +
			'}' +
			'.baseutils-popup {' +
			'	color:#eee;' +
			'}' +
			'.baseutils-popup a{' +
			'	color:#ffce00;' +
			'}' +
			'.svg-icon {' +
			'	fill: currentColor;' +
			'	height:16px;' +
			'	margin-left: 5px;' +
			'	stroke:none;' +
			'	vertical-align:text-bottom;' +
			'	width:16px;' +
			'}').appendTo('head');

		$('body').append($('<div id="baseutils-notification"></div>'));

		$('#toolbox').append(' <a onclick="window.plugin.baseUtils.showTelegramOptions(); return false;" class="hide-ui-toggle">Telegram</a>');

		// Load settings
		var obj = localStorage[ Key_TelegramSettings ];
		if (obj) {
			settingsTelegram = $.extend({}, defaultTelegramSettings, JSON.parse(obj));
		}

		// Would it be better to place this in slackIntel?
		var slack = window.plugin.slackintel;
		if (slack) {
			thisPlugin.shareOptions.push( { icon: thisPlugin.slackIcon, title: 'Send to Slack', shortTitle: 'Slack', callback: thisPlugin.sendToSlack } );
		}
	};

	/**
	 * Generic "Share" icon
	 */
	thisPlugin.shareIcon = '<svg class="svg-icon share-icon" viewBox="0 0 24 24" ><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>';

	/**
	 * Icon "Copy to Clipboard"
	 */
	thisPlugin.copyIcon = '<svg class="svg-icon copy-icon" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>';

	/**
	 * Icon "Share to Telegram"
	 */
	thisPlugin.telegramIcon = '<svg class="svg-icon telegram-icon" viewBox="0 0 1000 1000"><path d="M500 10C229.4 10 10 229.4 10 500s219.4 490 490 490 490-219.4 490-490S770.6 10 500 10zm240.8 335.9l-80.4 378.8c-5.5 27-21.8 33.3-44.4 20.9L493.5 655l-58.8 57.2c-6.9 6.7-12.3 12.3-24.5 12.3-15.9 0-13.2-5.9-18.6-21.1l-41.7-137-121.2-37.7c-26.2-8-26.4-26 5.9-38.9l472-182.2c21.6-9.7 42.4 5.2 34.2 38.3z"/></svg>';

	/**
	 * Slack Icon.
	 * Would it be better to place this in slackIntel?
	 */
	thisPlugin.slackIcon = '<svg class="svg-icon slack-icon" viewBox="1 25 147 146"><g><path d="M13.997	102.93c-5.494.042-10.148-3.232-11.864-8.342-.066-.198-.123-.39-.178-.583-1.87-6.544 1.756-13.39 8.255-15.582L114.45 43.5c1.267-.363 2.543-.548 3.807-.556 5.64-.044 10.422 3.302 12.18 8.52l.156.504c1.95 6.816-2.895 12.9-8.7 14.85-.004.003-1.06.36-103.662 35.39-1.38.472-2.81.71-4.23.722zm17.375 51.265c-5.537.04-10.207-3.188-11.903-8.225-.07-.192-.13-.385-.18-.58-1.9-6.62 1.72-13.54 8.24-15.734l104.25-35.243c1.34-.45 2.73-.68 4.13-.693 5.55-.042 10.43 3.35 12.15 8.444l.16.53c1.01 3.52.41 7.478-1.59 10.6-1.49 2.323-6.2 4.367-6.2 4.367L35.8 153.44c-1.458.487-2.945.744-4.428.757v-.002z"/><path d="M118.148 154.418c-5.56.043-10.483-3.465-12.255-8.723l-34.79-103.34-.174-.58c-1.89-6.59 1.74-13.464 8.23-15.654 1.3-.43 2.64-.66 3.99-.67 2.01-.01 3.952.44 5.784 1.35 3.062 1.528 5.353 4.15 6.45 7.39l34.785 103.33.1.337c1.954 6.84-1.663 13.72-8.16 15.91-1.287.43-2.627.654-3.98.666zm-51.713 17.406c-5.56.043-10.487-3.465-12.26-8.73L19.395 59.758l-.18-.575c-1.88-6.588 1.735-13.463 8.23-15.655 1.295-.43 2.634-.657 3.985-.668 5.56-.044 10.485 3.463 12.257 8.723l34.782 103.34c.06.18.12.38.17.57 1.88 6.592-1.73 13.47-8.24 15.663-1.3.43-2.63.656-3.98.667z"/></g></svg>';

	/**
	 * Icon "Android" (for native share drawer)
	 */
	thisPlugin.androidIcon = '<svg class="svg-icon slack-icon" viewBox="0 0 24 24"><path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/></svg>';

	/**
	 * Save to file Icon.
	 */
	thisPlugin.saveFileIcon = '<svg  class="svg-icon save-icon" viewBox="0 0 24 24"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>';

	/**
	 * Read from file Icon.
	 */
	thisPlugin.readFileIcon = '<svg class="svg-icon read-icon" viewBox="0 0 24 24"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>';

	/**
	 * Delete Icon (bin).
	 */
	thisPlugin.deleteIcon = '<svg class="svg-icon delete-icon" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>';

	/*
	 * Link Icon
	 */
	thisPlugin.linkIcon = '<svg class="svg-icon link-icon" viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>';

	/**
	 * Returns the HTML of an icon to share whatever text you want
	 * If the only method available is copy to clipboard then the Copy to Clipboard icon will be used, otherwise a generic Share icon
	 */
	thisPlugin.getIcon = function() {
		if (!thisPlugin.shareOptions.length)
			return '';

		if (thisPlugin.shareOptions.length == 1)
			return thisPlugin.shareOptions[ 0 ].icon;

		return thisPlugin.shareIcon;
	};

	/**
	 * Shares a text (copies it to the clipboard)
	 * @param {string} text - The text that is being shared
	 * @param {string} title - Description of what's being shared
	 * @param {DOMevent} event - The click event that called this method (to position the pane)
	 * @param {object} options - Object to pass to the sender method (eg: Markdown is being used for the formatting, disable link preview)
	 */
	thisPlugin.shareText = function(text, title, event, options) {
		/*
		// On Android use directly the native system
		// This prevents sharing formatted text. not sure about the best solution
		if (typeof android !== 'undefined' && android && android.shareString) {
			android.shareString(text);
			return;
		}
		*/
		// clone array of options
		var currentOptions = thisPlugin.shareOptions.slice();
		thisPlugin.addLinkOptions( text, currentOptions );

		// If there's only one option, use it.
		if (currentOptions.length == 1) {
			currentOptions[0].callback(text, title, options);
			return;
		}

		var div = document.createElement('div');
		div.className = 'baseutils-targetselection iitc-pane';

		setTimeout(function() {
			$('body').one('click', function() {
				div.parentNode.removeChild( div );
			});
		}, 50);

		for (var i = 0; i < currentOptions.length ; i++ ) {
			div.appendChild( generateOption( currentOptions[ i ], text, title, options) );
		}

		div.style.left = event.clientX + 'px';
		div.style.top = event.clientY + 'px';
		document.body.appendChild( div );
	};

	/**
	 * Internal function to generate the options in the share pane
	 */
	function generateOption( data, text, title, options ) {
		var link = document.createElement('a');
		link.innerHTML = data.icon + ' ' + data.title;
		link.addEventListener('click', function( e ) {
			data.callback(text, title, options);
			e.preventDefault();
		}, false);
		return link;
	}

	/**
	 * Copies a text to the clipboard
	 * @param {string} text - The text that is being shared
	 * @param {string} title - Description of what's being shared
	 */
	thisPlugin.copyToClipboard = function(text, title) {
		var textArea = document.createElement('textarea');

		// Place in top-left corner of screen regardless of scroll position.
		textArea.style.position = 'fixed';
		textArea.style.top = 0;
		textArea.style.left = 0;

		textArea.style.width = '1em';
		textArea.style.height = '1em';

		textArea.style.padding = 0;
		textArea.style.border = 0;
		textArea.style.outline = 'none';
		textArea.style.boxShadow = 'none';
		textArea.style.background = 'transparent';

		textArea.value = text;

		document.body.appendChild(textArea);

		textArea.select();

		try {
			var ok = document.execCommand('copy');
			if (ok) {
				thisPlugin.showNotification( (title ? title : 'Text') + ' copied to the clipboard');
			} else {
				alert( 'Failed to copy:\r\n' + text );
			}
		} catch (err) {
			console.log('document.execCommand("copy") failed', err);  // eslint-disable-line no-console
		}

		document.body.removeChild(textArea);
	};

	/**
	 * If the shared text is the permalink link, then add an option to load it.
	 */
	thisPlugin.addLinkOptions = function(text, options) {
		// if it's not a single line with a link, get out
		if (!/^https?:\/\/.*$/.test( text ))
			return;

		options.push( {
			icon: thisPlugin.linkIcon,
			shortTitle: 'Load',
			title: 'Load link',
			callback: function( text, title) {
				document.location.href = text;
			}
		} );
	};

	// Get the name of the Telegram groups
	thisPlugin.getTelegramGroups = function() {
		return settingsTelegram.groups.map( function( group ) {
			return '<option value="' + group.name + '"/>';
		}).join('');
	};

	//
	function checkValidTelegramUrl() {
		// The ssl certificate has expired in https://jonibc.duckdns.org/ so warn the users that they must approve first the connection in a new tab.

		var url = 'https://jonibc.duckdns.org/';
		var jqxhr = $.ajax( {
			url: url,
			error: function( jqXHR, textStatus, errorThrown ) {
				console.log(arguments)
				alert( "error " + textStatus );
			},
		success: function() {
			console.log(arguments)
			alert( "success" );
		}
		});
	}

	// Init the send to telegram, show dialog to select the group and additional text
	thisPlugin.sendToTelegram = function(text, title, options) {
		//checkValidTelegramUrl()
		//	return;

		var div = document.createElement('div');

		div.innerHTML = helpTelegramLink();

		var form = document.createElement('form');
		div.appendChild(form);
		form.style.marginTop = '10px';
		var p = document.createElement('p');
		p.appendChild(document.createTextNode( 'Select the group:' ));
		form.appendChild(p);
		var iTarget = document.createElement('input');
		iTarget.type = 'search';
		iTarget.setAttribute('list', 'send2telegram-groups');
		iTarget.value = settingsTelegram.lastGroup;
		p.appendChild(iTarget);

		// HTML5 autocomplete
		var dataList = document.createElement('datalist');
		dataList.id = 'send2telegram-groups';

		dataList.innerHTML = thisPlugin.getTelegramGroups();
		form.appendChild(dataList);

		p = document.createElement('p');
		p.appendChild(document.createTextNode( 'Additional message to send?' ));
		form.appendChild(p);
		var iMessage = document.createElement('textarea');
		iMessage.className = 'iitc-textarea';
		iMessage.style.width = '100%';
		iMessage.style.height = '4em';
		p.appendChild(iMessage);

		var id = 'totelegram-send';
		dialog({
			id: id,
			html: div,
			width: '300px',
			title: 'Send to Telegram: ' + title,
			buttons: {
				'OK': function() {
					$(this).dialog('close');

					if (options && options.markdownText)
						text = options.markdownText;

					var target = iTarget.value,
						msg = iMessage.value + '\r\n' + text;
					if (target) {
						thisPlugin.sendTelegramMessage(target, msg, options);
					}
				}
			}
		});
	};

	// Actual function to send the message to Telegram
	thisPlugin.sendTelegramMessage = function(target, message, options) {
		var isNew;
		var url;
		var group = settingsTelegram.groups.find( function( element ) {
			return element.name == target || element.url == target;
		});
		if (group) {
			url = group.url;
		} else {
			var index = target.indexOf('&msg');
			if (index > 0) {
				url = target.substr(0, index);
			} else {
				url = target;
			}
			isNew = true;
		}

		var idx = url.indexOf('?');
		var data = {};
		if (!isNew && group.id) {
			data.id = group.id;
		} else {
			if (idx > 0) {
				var query = url.substr(idx + 1);
				data = getQueryStringParameters(query);
				url = url.substr(0, idx);
			}
		}
		data.msg = message;
		// compat for slackintel
		if (options === true )
			data.format = 'Markdown';

		if (options && (options.markdown || options.markdownText) )
			data.format = 'Markdown';

		if (options && options.disablePreview )
			data.disablePreview = 'true';

		$.ajax({
			type: 'POST',
			url: url,
			data: data
		}).done(function(json) {
			var respObj = JSON.parse(json);
			if (respObj && respObj.ok) {
				thisPlugin.showNotification('Message sent to Telegram');
				if (isNew) {
					if (respObj.result && respObj.result.chat) {
						if (respObj.result.chat.title) {
							target = respObj.result.chat.title;
						} else {
							if (respObj.result.chat.username) {
								target = respObj.result.chat.username;
							}
						}
					}
					thisPlugin.addTelegramGroup(url, target, data.id);
					window.setTimeout(thisPlugin.showTelegramOptions, 100);
				}
				settingsTelegram.lastGroup = target;
				localStorage[Key_TelegramSettings] = JSON.stringify(settingsTelegram);
			} else {
				thisPlugin.showNotification('Error sending the message!');
				console.error('Telegram send failed', respObj); // eslint-disable-line no-console
			}
		}).fail(function() {
			console.log(arguments); // eslint-disable-line no-console
			thisPlugin.showNotification('Error sending the message!');
		});

	};

	// Parses an url to return an object with the query string parameters as its properties
	// http://stackoverflow.com/a/3855394/250294
	function getQueryStringParameters(query) {
		var a = query.split('&');
		var b = {};
		for (var i = 0; i < a.length; ++i) {
			var p = a[i].split('=', 2);
			if (p.length == 1)
				b[p[0]] = '';
			else
				b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
		}
		return b;
	}

	thisPlugin.addTelegramGroup = function(url, name, id) {
		settingsTelegram.groups.push({
			name: name,
			url: url,
			id: id
		});
		localStorage[Key_TelegramSettings] = JSON.stringify(settingsTelegram);
	};

	function helpTelegramLink() {
		return '<a href="https://docs.google.com/document/d/1TR7n7NsCHP_p2wz3P0bAiNwlsaaHY7MnWq7Y-VacSZ4/"' +
			' target="_blank" style="position: absolute; top: 5px; right: 5px; font-size: 150%">' +
			'?</a>';
	}

	thisPlugin.removeTelegramGroupRow = function(obj) {
		if (!window.confirm('Are you sure that you want to remove this Telegram group?'))
			return;

		var $button = $(obj);
		var $row = $button.closest('tr');
		$row[0].style.display = 'none';
		$row.find('.telegram-name').val('');
	};

	thisPlugin.showTelegramOptions = function() {
		var html = [];

		html.push(helpTelegramLink());
		var groups = settingsTelegram.groups;
		if (groups.length) {
			html.push('<table class="telegram-settings-table">' +
				'<thead><tr><th>Group name</th><th></th></tr></thead>');

			for (var i = 0; i < groups.length ; i++) {
				var group = groups[ i ];
				html.push('<tr><td>');
				html.push('<input type="text" id="telegram-' + i + '-name" value="' + group.name + '" class="telegram-name" style="width: 250px">');
				html.push('</td><td>');
				html.push('<a title="Remove" class="telegram-remove" onclick="window.plugin.baseUtils.removeTelegramGroupRow(this)">' + thisPlugin.deleteIcon + '</a>');
				html.push('</td></tr>');
			}

			html.push('</table>');
		} else {
			html.push('<p>The are no Telegram groups.</p>');
		}
		/*
		html.push('<div id="telegram-buttons">');
		html.push('<a>Add group</a>');
		html.push('</div>');
		*/

		dialog({
			html: html.join(''),
			id: 'telegram-settings',
			dialogClass: 'ui-dialog-telegram-settings',
			title: 'Telegram groups',
			width: 350,
			close: function() {
				var newGroups = [];
				for (var j = 0; j < settingsTelegram.groups.length; j++) {
					var newTitle = $('#telegram-' + j + '-name').val();
					// If its name has been cleared, remove the group
					if (newTitle) {
						var group = settingsTelegram.groups[ j ];
						group.name = newTitle;
						newGroups.push(group);
					}
				}
				settingsTelegram.groups = newGroups;
				localStorage[ Key_TelegramSettings ] = JSON.stringify(settingsTelegram);

				$(this).dialog('destroy').remove();
			}
		});
	};

	/**
	 * Share to Slack
	 * Currently the window.plugin.slackintel.sendMessage doesn't handle properly new lines.
	 * Would it be better to place this in slackIntel?
	 */
	thisPlugin.sendToSlack = function(text, title) {
		var div = document.createElement('div');

		var form = document.createElement('form');
		div.appendChild(form);
		form.style.marginTop = '10px';
		var p = document.createElement('p');
		p.appendChild(document.createTextNode( 'To which channel or agent?' ));
		form.appendChild(p);
		var target = document.createElement('input');
		target.type = 'search';
		target.setAttribute('list', 'send2slack-history');
		p.appendChild(target);

		// HTML5 autocomplete
		var dataList = document.createElement('datalist');
		dataList.id = 'send2slack-history';

		var options = window.plugin.slackintel.fullList.map( function( name ) {
			return '<option value="' + name + '"/>';
		});

		dataList.innerHTML = options.join('');
		form.appendChild(dataList);

		p = document.createElement('p');
		p.appendChild(document.createTextNode( 'Additional message to send?' ));
		form.appendChild(p);
		var message = document.createElement('textarea');
		message.className = 'iitc-textarea';
		message.style.width = '100%';
		message.style.height = '4em';
		p.appendChild(message);

		var id = 'baseutils-send2slack';
		dialog({
			id: id,
			html: div,
			width: '300px',
			title: 'Send to Slack: ' + title,
			close: function() {
				var dest = target.value,
					msg = message.value;
				if (dest) {
					msg = msg + '\n' + text;
					// convert markdown links to slack flavour
					// msg = convertLinksForSlack(msg);

					//msg = msg.replace(/\\/g, '\\\\');
					//msg = encodeURIComponent( msg );
					window.plugin.slackintel.sendMessage(msg, dest);
				}
			}
		});
	};

	function convertLinksForSlack(text) {
		var re = /\[(.*?)\]\((.*?)\)/g;

		return text.replace(re, function($0, $1, $2) {
			return '<' + $2 + '|' + $1 + '>';
		});
	}

	// On IITCm use the native share
	thisPlugin.sendToAndroid = function(text, title, options) {
		android.shareString(text);
	};

	/**
	 * Shows a transient notification in the page (autodismissed after 3 seconds)
	 * @param {string} text - The text to show
	 */
	thisPlugin.showNotification = function( msg ) {
		$('#baseutils-notification').text( msg )
			.fadeIn(400).delay(3000).fadeOut(400);
	};

	/**
	 * Saves a file to disk with the provided text
	 * @param {string} text - The text to save
	 * @param {string} filename - Proposed filename
	 */
	thisPlugin.saveToFile = function(text, filename) {
		if (typeof text != 'string') {
			text = JSON.stringify( text );
		}

		// http://stackoverflow.com/a/18197341/250294
		var element = document.createElement('a');
		// fails with large amounts of data
		//element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));

		// http://stackoverflow.com/questions/13405129/javascript-create-and-save-file
		var file = new Blob([ text ], { type: 'text/plain' });
		element.setAttribute('href', URL.createObjectURL(file));

		element.setAttribute('download', filename);

		element.style.display = 'none';
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	};

	/**
	 * Prompts the user to select a file and then reads its contents and calls the callback function with those contents
	 * @param {Function} callback - Function that will be called when the file is read.
	 * Callback signature: function( {string} contents ) {}
	 */
	thisPlugin.readFromFile = function(callback) {
		var input = document.createElement('input');
		input.type = 'file';
		input.className = 'baseutils-filepicker';
		document.body.appendChild(input);

		input.addEventListener('change', function(ev) {
			var reader = new FileReader();
			reader.onload = function() {
				callback( reader.result );
			};
			reader.readAsText(input.files[ 0 ]);
			document.body.removeChild(input);
		}, false);

		input.click();
	};

	//
	/**
	 * Prevent enumeration of a property in an object
	 * @param {Object} object - The object that you want to modify
	 * @param {string} property - The name of the property that you want to hide from enumeration
	 */
	thisPlugin.hide = function(object, property) {
		var tmp = object[ property ];
		delete object[ property ];
		Object.defineProperty(object, property, { value: tmp, writable:true });
	};


	// Push right now the Copy to Clipboard and Telegram options

	// On Android include the native system
	if (typeof android !== 'undefined' && android && android.shareString) {
		thisPlugin.shareOptions.push( {
			icon: thisPlugin.androidIcon,
			shortTitle: 'Android',
			title: 'Share with Android',
			callback: thisPlugin.sendToAndroid
		} );
	} else {
		// copy to clipboard is already included in native share system
		thisPlugin.shareOptions.push( {
			icon: thisPlugin.copyIcon,
			shortTitle: 'Copy',
			title: 'Copy to Clipboard',
			callback: thisPlugin.copyToClipboard
		} );
	}

	// If we send using our code on Android we can use markdown, otherwise it's plain text
	thisPlugin.shareOptions.push( {
		icon: thisPlugin.telegramIcon,
		shortTitle: 'Telegram',
		title: 'Send to Telegram',
		callback: thisPlugin.sendToTelegram
	} );

	// workaround for slackintel compatibility as it used ToTelegram directly :-(
	if (!window.plugin.ToTelegram) {
		window.plugin.ToTelegram = {
			sendToTelegram: thisPlugin.sendToTelegram
		};
	}

	var setup = thisPlugin.setup;

// PLUGIN END //////////////////////////////////////////////////////////

	setup.info = plugin_info; //add the script info data to the function as a property
	if (!window.bootPlugins) window.bootPlugins = [];
	window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
	if (window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('(' + wrapper + ')(' + JSON.stringify(info) + ');'));
(document.body || document.head || document.documentElement).appendChild(script);
