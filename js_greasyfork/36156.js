// ==UserScript==
// @name        OddsPortal - Injector 3
// @namespace   Cunt
// @description Cunt
// @include     http://*.oddsportal.*/*
// @include     https://*.oddsportal.*/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/36156/OddsPortal%20-%20Injector%203.user.js
// @updateURL https://update.greasyfork.org/scripts/36156/OddsPortal%20-%20Injector%203.meta.js
// ==/UserScript==

function addGlobalJS(js) {
    var head, script;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = js;
    head.appendChild(script);
}

function addScriptSource(link) {
    var head, script;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    script = document.createElement('script');
    script.src = link;
    head.appendChild(script);
}

addScriptSource("https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js");

addGlobalJS("var gmStatus = 0;var gmTimer;function gmGrabber() {	gmStatus = 1;	var names = [];	var links = []; var dates = [];	/*Check if page exists*/	var valid = true;	if ($('h1:eq(0)').length) {		if ($('h1:eq(0)').text() == 'Page not found') {			valid = false;		}	}	if ($('div.cms:eq(0)').length) {		if ($('div.cms:eq(0)').text() == 'No data available') {			valid = false;		}	}	if (valid == false) {		$.post('http://localhost/oddsportal/check.php', { a:8 }, function(data) {				gmTimer = setTimeout(gmTodo,1000);			gmStatus = 2;		}, 'json');		return;	}	/*Get Links from page*/	var date_eq = -1;	var match_eq = -1;	$('tr').each(function(i) {			var class_check = $(this).attr('class');		if ((typeof class_check !== 'undefined') && (class_check == 'center nob-border')) {			date_eq++;		}		if ((typeof class_check !== 'undefined') && ((class_check == 'odd deactivate') || (class_check == ' deactivate'))) {			match_eq++;			/*Get Match Info*/			dates.push($('span.datet:eq('+ date_eq +')').text());			names.push($('td.name.table-participant:eq('+ match_eq +')').text());			var curr_link = $('td.name.table-participant:eq('+ match_eq +')').html();			curr_link = curr_link.split('\"');			links.push(curr_link[1]);		}	});	if ((date_eq == -1) && (match_eq == -1)) {		gmTimer = setTimeout(gmGrabber, 1000);		gmStatus = 3;		return;	}	names = names.join('|');		links = links.join('|');		dates = dates.join('|');	$.post('http://localhost/oddsportal/check.php', { a:7,n:names,l:links,d:dates }, function(data) {			gmTimer = setTimeout(gmTodo,1000);		gmStatus = 2;	}, 'json');}function gmAntiFreeze() {	switch(gmStatus) {		case 0:		if (gmType == 0) {			gmGrabber();		} else if (gmType == 1) {			gmTodo();		}		break;		case 2:		clearTimeout(gmTimer);		gmTimer = setTimeout(gmTodo,1000);		break;		case 3:		clearTimeout(gmTimer);		gmTimer = setTimeout(gmGrabber,1000);		break;	}}");

addGlobalJS("function gmTodo() { gmStatus = 1;	$.post('http://localhost/oddsportal/check.php', { a:6 }, function(data) { gmStatus = 0; 		window.location.assign(data.link);	}, 'json');}");

document.addEventListener ("readystatechange", FireWhenReady, true);

function FireWhenReady () {
    this.fired  = this.fired || false;

    if (    document.readyState != "uninitialized" &&
          document.readyState != "loading" &&
          ! this.fired
    ) {
        this.fired = true;

        document.body.onload  = function () {
          if ((window.location.href != 'http://www.oddsportal.com/') && (window.location.href != 'https://www.oddsportal.com/')) {
            gmGrabber();
            addGlobalJS("var gmType=0;");
          } else {
            gmTodo();
            addGlobalJS("var gmType=1;");
          }
          setInterval(gmAntiFreeze,5000);
        };
    }
}