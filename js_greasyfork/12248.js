// ==UserScript==
// @name	upvoat comments
// @description	auto-upvoat all new comments made by a specific user
// @namespace	https://voat.co
// @include	https://voat.co/user/*/comments
// @version	1.1
// @grant	GM_xmlhttpRequest
// @grant	GM_setValue
// @grant	GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/12248/upvoat%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/12248/upvoat%20comments.meta.js
// ==/UserScript==

var interval = 10; // in minutes

if (document.getElementById('container') != null)
{
	document.getElementById('container')
		.getElementsByTagName('div')[0]
		.getElementsByTagName('div')[0].innerHTML += ' <span id="upVoatButton"></span><span id="upVoatStatus"></span>';

	if (GM_getValue('voatOn') == 1)
	{
		document.getElementById('upVoatButton').innerHTML = '<button id="upVoatStart" type="button">Stop UpVoating</button>';
		document.getElementById('upVoatStart').addEventListener('click', upVoatStop, false);
		upVoatStart(null);
	}
	else
	{
		document.getElementById('upVoatButton').innerHTML = '<button id="upVoatStart" type="button">Start UpVoating</button>';
		document.getElementById('upVoatStart').addEventListener('click', upVoatStart, false);
	}
}

function upVoatStart(e)
{
	GM_setValue('voatOn', 1);

	document.getElementById('upVoatButton').innerHTML = '<button id="upVoatStart" type="button">Stop UpVoating</button>';
	document.getElementById('upVoatStart').addEventListener('click', upVoatStop, false);

	upVoatAll();
	window.setTimeout(function () { location.reload(); }, interval * 60 * 1000);
}

function upVoatStop(e)
{
	GM_setValue('voatOn', 0);

	document.getElementById('upVoatButton').innerHTML = '<button id="upVoatStart" type="button">Start UpVoating</button>';
	document.getElementById('upVoatStart').addEventListener('click', upVoatStart, false);
	document.getElementById('upVoatStatus').innerHTML = '';
}

function upVoatAll()
{	
	document.getElementById('upVoatStatus').innerHTML = ' upvoating...';

	var i = 0;
	var l = 0;
	var t = 0;

	var links = document.getElementsByTagName("a");

	for (i = 0; i < links.length; i++) {
		l = links[i];
		if (t < 10 && l.href && l.innerHTML == 'permalink') {
			l.setAttribute('style', 'color:blue;');
			t++;
		}
	}

	t = 0;
	for (i = 0; i < links.length; i++) {
		l = links[i];
		if (t < 10 && l.href && l.innerHTML == 'permalink') {
			var commentNumber = l.href.split(/[\/]+/).pop();
			upVoatComment(commentNumber, l);
			t++;
		}
	}

	document.getElementById('upVoatStatus').innerHTML = ' upvoated!' +
		' (at ' + (new Date()).getHours() + ':' + (new Date()).getMinutes() + ')';
}

function upVoatComment(n, l)
{
	// Sending this request *toggles* the upvoats.
	// So if we already upvoated the comment, it will remove the upvoat.
	// To avoid that we downvoat the comment before upvoating it again.
	GM_xmlhttpRequest({
		method: 'POST',
		url: 'https://voat.co/votecomment/' + n + '/-1',
		synchronous: true,
		timeout: 5000,
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		ontimeout: function(r) { l.setAttribute('style', 'color:red;'); },
		onerror: function(r) { l.setAttribute('style', 'color:red;'); },
		onload: function(r) {
			GM_xmlhttpRequest({
				method: 'POST',
				url: 'https://voat.co/votecomment/' + n + '/1',
				synchronous: true,
				timeout: 5000,
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				ontimeout: function(r) { l.setAttribute('style', 'color:red;'); },
				onerror: function(r) { l.setAttribute('style', 'color:red;'); },
				onload: function(r) { l.setAttribute('style', 'color:green;'); }
			});
		}
	});
}
