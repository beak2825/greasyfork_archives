// ==UserScript==
// @name         nzbs.org queue fix for SABnzbd v2.x
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  make nzbs.org queue page compatible with SABnzbd v2.x API
// @author       Me
// @match        https://nzbs.org/queue
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/376636/nzbsorg%20queue%20fix%20for%20SABnzbd%20v2x.user.js
// @updateURL https://update.greasyfork.org/scripts/376636/nzbsorg%20queue%20fix%20for%20SABnzbd%20v2x.meta.js
// ==/UserScript==

(function() {
    'use strict';

function getQueue()
{
	var sabQueue = $("#sab_queue");

	$.ajax({
		url: CLIENTURL + '&apikey=' + CLIENTAUTH + '&mode=qstatus',
		dataType: "jsonp",
		jsonp: "jsoncallback",
		timeout: 5000,
		success: function(data, status){
			if (data.status == false) {
				sabQueue.html('<p><img id="loading" src="https://nzbs.org//templates/default/images/icons/warning.png"> <b>Error fetching queue: ' + data.error + '</b></p>');
			} else {
				sabQueue.html('');

				var statuslink = '';
				if (data.status.toLowerCase() == 'paused') {
					statuslink = $('<a href="#" title="Resume Queue">' + data.status + '</a>').click(function() { resumeQueue(); });
				} else {
					statuslink = $('<a href="#" title="Pause Queue">' + data.status + '</a>').click(function() { pauseQueue(); });
				}

				$('<p>').append(
				    '<b>Download speed:</b> ' + data.speed + 'B/s - ',
				    '<b>Queued:</b> ' + Math.round(data.mbleft) + 'MB / ' + Math.round(data.mb) + 'MB - ',
				    '<b>Status:</b> ',
				    statuslink
				).appendTo(sabQueue);

				if (data.slots.length > 0)
				{
					var str = '<table class="data highlight"><tr><th></th><th>Name</th><th style="width:80px;">size</th><th style="width:80px;">left</th><th style="width:50px;">%</th><th>time left</th></tr>';
					$.each(data.slots, function(i,item){
						str += '<tr><td style="text-align:right;">'+(i+1)+'</td><td>'+item.filename+'</td><td style="text-align:right;">'+Math.round(item.mb)+' MB</td><td class="right">'+Math.round(item.mbleft)+' MB</td><td class="right">'+Math.round(item.mbleft/item.mb*100)+'%</td><td style="text-align:right;">'+item.timeleft+'</td></tr>';
					});
					str += '</table>';
				}
				else
				{
					var str = '<p>The queue is currently empty.</p>';
				}

				sabQueue.append(str);
				setTimeout("getQueue()", 5000);
		    }
		},
		error: function(XHR, textStatus, errorThrown){
			sabQueue.html('<p><img id="loading" src="https://nzbs.org//templates/default/images/icons/warning.png"> <b>Error fetching queue: ' + textStatus + '</b></p>');
		}
	});
}

function embedFunction(s) {
    document.body.appendChild(document.createElement('script')).innerHTML=s.toString().replace(/([\s\S]*?return;){2}([\s\S]*)}/,'$2');
}

embedFunction(getQueue);

})();