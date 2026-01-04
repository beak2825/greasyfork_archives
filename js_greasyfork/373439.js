// ==UserScript==
// @name         Link Deleted Snatch/Seed PM to Log
// @namespace    https://greasyfork.org/en/scripts/373439-link-deleted-snatch-seed-pm-to-log
// @version      1.0
// @description  On Deleted Snatch/Seed PM pages, links the torrent ID to a log search, and links the uploader and staff usernames to user-searches.
// @author       newstarshipsmell
// @include      /https://redacted\.ch/inbox\.php\?action=viewconv&id=\d+/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373439/Link%20Deleted%20SnatchSeed%20PM%20to%20Log.user.js
// @updateURL https://update.greasyfork.org/scripts/373439/Link%20Deleted%20SnatchSeed%20PM%20to%20Log.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var pmTitle = document.querySelector('h2').textContent;
	var pmSender = document.querySelector('div.inbox_message > div.head > div > strong').textContent;
	if (!/^Deleted Snatch\/Seed: .+/.test(pmTitle) || pmSender !== 'System') return;

	var pmBody = document.querySelector('div.body');
	var pmBodyMessage = pmBody.lastChild;
	var pmBodyText = pmBodyMessage.textContent;
	pmBody.removeChild(pmBodyMessage);
	console.log("pmBodyText: " + pmBodyText);
	var message1 = document.createTextNode('Log Message: Torrent ');
	pmBody.appendChild(message1);
	pmBodyText = pmBodyText.replace(/Log Message: Torrent /, '');
	var torrentID = pmBodyText.split(' ')[0];
	pmBodyText = pmBodyText.replace(torrentID + ' ', '');
	var message2 = document.createElement('a');
	message2.href = 'https://redacted.ch/log.php?search=' + torrentID;
	message2.target = '_blank';
	var message2a = document.createTextNode(torrentID);
	message2.appendChild(message2a);
	pmBody.appendChild(message2);
	var torrentTitleSize = pmBodyText.split(' uploaded by ')[0];
	pmBodyText = pmBodyText.replace(torrentTitleSize + ' uploaded by ', '');
	torrentTitleSize = ' ' + torrentTitleSize;
	var message3 = document.createTextNode(torrentTitleSize + ' uploaded by ');
	pmBody.appendChild(message3);
	var uploader = pmBodyText.split(' was deleted by ')[0];
	pmBodyText = pmBodyText.replace(uploader + ' was deleted by ', '');
	var message4 = document.createElement('a');
	message4.href = 'https://redacted.ch/user.php?action=search&search=' + uploader;
	message4.target = '_blank';
	var message4a = document.createTextNode(uploader);
	message4.appendChild(message4a);
	pmBody.appendChild(message4);
	var message5 = document.createTextNode(' was deleted by ');
	pmBody.appendChild(message5);
	var moderator = pmBodyText.split(' for the reason: ')[0];
	pmBodyText = pmBodyText.replace(moderator, '');
	var message6 = document.createElement('a');
	message6.href = 'https://redacted.ch/user.php?action=search&search=' + moderator;
	message6.target = '_blank';
	var message6a = document.createTextNode(moderator);
	message6.appendChild(message6a);
	pmBody.appendChild(message6);
	var message7 = document.createTextNode(pmBodyText);
	pmBody.appendChild(message7);
})();