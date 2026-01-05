// ==UserScript==
// @name         7 Cups - User status colors
// @namespace    http://tampermonkey.net/
// @description  Tweaks and animates the user status colors
// @locale       en
// @author       RarelyCharlie
// @website      http://www.7cups.com/@RarelyCharlie
// @license      Open Software License version 3.0
// @match        https://www.7cups.com/*
// @match        http://www.7cups.com/*
// @run-at       document-start
// @grant        none
// @version      2.2
// @downloadURL https://update.greasyfork.org/scripts/17962/7%20Cups%20-%20User%20status%20colors.user.js
// @updateURL https://update.greasyfork.org/scripts/17962/7%20Cups%20-%20User%20status%20colors.meta.js
// ==/UserScript==

(function() {
	if (parent != window) return;

	var rc_addStyle = function (css) {
		var s = document.head.appendChild(document.createElement('STYLE'));
		s.setAttribute('type', 'text/css');
		s.textContent = css;
		};

    if (localStorage && location.hash == '#tweaksettings') {
        document.title = 'Tweak Settings | 7 Cups';

        addEventListener('load', function () {
            if (!document.getElementById('tweakheader')) { // need infrastructure...
                rc_addStyle('body>* {display: none;} body {font-size: 12px; padding: 12px 40px;} ' +
				  '#tweakheader {display: block;} ' +
				  'h3, button {margin: 1.5em 0 0 0;} p {margin: .5em 0 0 0;} ' +
				  'h3 {font-size: 20px;}' +
                  'input {font-family: monospace; margin-right: 1ex;} td {vertical-align: middle;}' +
				  'input[type=color] {font-size: 120%; width: 36px; margin: 0 1ex; padding: 2px;}');
                document.body.innerHTML = '<div id="tweakheader"><h2>7 Cups Tweak Settings</h2><div id="tweaksettings"></div><button onclick="location = \'/\'">Close</button></div>';
                }
            var ts = JSON.parse(localStorage.getItem('rc_tweaksettings'));
            if (!ts) ts = {};
            s = ts.userstatus;
            if (!s) {
                s = ['springgreen', 'orange', 'slategray', false]; // defaults
                ts.userstatus = s;
                localStorage.setItem('rc_tweaksettings', JSON.stringify(ts));
                }
            document.getElementById('tweaksettings').innerHTML +=
              '<h3 id="userstatus">User status</h3>' +
              '<p>Custom colors for user status indicators</p>' +
              '<table style="border-collapse: separate; border-spacing: 1ex; margin-left: -1ex;"><tbody>' +
              '<tr><td>Online:</td><td><input id="userstatus-text-0" type="text" value="' + s[0] + '" size="18" oninput="rc_userstatus_set(this)"/>' +
                '<input type="color" id="userstatus-picker-0" onchange="rc_userstatus_set(this)" value="#000000" style="height: 1.65em;">' +
                ' Sample:<span id="userstatus-sample-0">&nbsp;&#9679;</span></td></tr>' +
              '<tr><td>Busy:</td><td><input id="userstatus-text-1" type="text" value="' + s[1] + '" size="18" oninput="rc_userstatus_set(this)"/>' +
                '<input type="color" id="userstatus-picker-1" onchange="rc_userstatus_set(this)" value="#000000" style="height: 1.65em;">' +
                ' Sample:<span id="userstatus-sample-1">&nbsp;&#9679;</span></td></tr>' +
              '<tr><td>Offline:</td><td><input id="userstatus-text-2" type="text" value="' + s[2] + '" size="18" oninput="rc_userstatus_set(this)"/>' +
                '<input type="color" id="userstatus-picker-2" onchange="rc_userstatus_set(this)" value="#000000" style="height: 1.65em;">' +
                ' Sample:<span id="userstatus-sample-2">&nbsp;&#9679;</span></td></tr>' +
              '</tbody></table>' +
              '<p><label for="userstatus-moving-3"><input type="checkbox" id="userstatus-moving-3" ' +
              (s[3]? ' checked="true"' : '') +
              'onchange="rc_userstatus_set(this)"/>Move indicator depending on status</label></p>';
            setTimeout(function () {for (var i = 0; i <= 2; ++i) rc_userstatus_set(document.getElementById('userstatus-text-' + i));}, 0);
        });
        rc_userstatus_set = function (inp) {
            var ts = JSON.parse(localStorage.getItem('rc_tweaksettings'));
            var us = ts.userstatus;
            var n = inp.id.slice(-1);
            if (n == 3) us[n] = inp.checked;
            else us[n] = inp.value;
            ts.userstatus = us;
            localStorage.setItem('rc_tweaksettings', JSON.stringify(ts));
            var s = document.getElementById('userstatus-sample-' + n);
            s.style.color = inp.value;
            var rgb = getComputedStyle(s).color.match(/(\d+)/g);
            rgb = "#" + ("0" + parseInt(rgb[0],10).toString(16)).slice(-2) + ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2],10).toString(16)).slice(-2);
            var p = document.getElementById('userstatus-picker-' + n);
            if (p != inp) p.value = rgb;
            p = document.getElementById('userstatus-text-' + n);
            if (p != inp) p.value = inp.value;
            };
		if (typeof(unsafeWindow) == 'object') unsafeWindow.rc_userstatus_set = rc_userstatus_set;
        return;
		}

    var ts = JSON.parse(localStorage.getItem('rc_tweaksettings'));
    if (!ts) ts = {};
    var us = ts.userstatus;
    if (!us) {
        us = ['springgreen', 'orange', 'slategray', false]; // defaults
        ts.userstatus = us;
        localStorage.setItem('rc_tweaksettings', JSON.stringify(ts));
        }
    var css = '.statusBlock.userOnline {background-color: ' + us[0] + ';} ' +
      '.statusMark.userOnline {color: ' + us[0] + ';} ' +
      '.statusBlock.userBusy {background-color: ' + us[1] + ';} ' +
      '.statusMark.userBusy {color: ' + us[1] + ';} ' +
      '.statusBlock.userOffline {background-color: ' + us[2] + ';} ' +
      '.statusMark.userOffline {color: ' + us[2] + ';}';
    if (us[3]) css += '.statusBlock.userOnline {bottom: 19px;}' +
        '.hidden-md-up .statusBlock.userOnline {top: 0 !important;}' +
      '.statusBlock.userBusy {bottom: 9px; right: -6px;}' +
        '.hidden-md-up .statusBlock.userOffline {bottom: 0; top: 90% !important;}' +
      '.myStatus.statusBlock.userOnline {bottom: 26px;}' +
      '.myStatus.statusBlock.userBusy {bottom: 13px; right: -6px;}' +
      '.myStatus.statusBlock {transition: bottom .5s, right .5s, background-color .5s;}' +
        '.hidden-md-up .myStatus.statusBlock {right: 0; transition: top .5s;}';
	rc_addStyle(css);
})();