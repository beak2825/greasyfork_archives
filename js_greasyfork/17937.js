// ==UserScript==
// @name         7 Cups - Exit button
// @namespace    http://tampermonkey.net/
// @description  Emergency exit button
// @locale       en
// @author       RarelyCharlie
// @website      http://www.7cups.com/@RarelyCharlie
// @license      Open Software License version 3.0
// @match        https://www.7cups.com/*
// @match        http://www.7cups.com/*
// @run-at       document-body
// @grant        GM_addStyle
// @version      1.0
// @downloadURL https://update.greasyfork.org/scripts/17937/7%20Cups%20-%20Exit%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/17937/7%20Cups%20-%20Exit%20button.meta.js
// ==/UserScript==

(function() {
        if (localStorage && location.hash == '#tweaksettings') {
        document.title = 'Tweak Settings | 7 Cups';
        addEventListener('load', function () {
            if (!document.getElementById('tweakheader')) { // need infrastructure...
                GM_addStyle('body>* {display: none;} body {padding: 4em;} #tweakheader {display: block;} h3, button {margin: 1.5em 0 0 0;} p {margin: .5em 0 0 0;} ' +
                  'input {font-family: monospace; margin-right: 1ex;} #contrast-sample {font-weight: bold;} td {vertical-align: middle;}');
                document.body.innerHTML = '<div id="tweakheader"><h2>7 Cups Tweak Settings</h2><div id="tweaksettings"></div><button onclick="location = \'/\'">Close</button></div>';
                }
            var ts = JSON.parse(localStorage.getItem('rc_tweaksettings'));
            if (!ts) ts = {};
            var s = ts.exit; // my settings
            if (!s) {
                s = {url: 'http://google.com', wait: 'wait'}; // defaults
                ts.exit = s;
                localStorage.setItem('rc_tweaksettings', JSON.stringify(ts));
                }
            document.getElementById('tweaksettings').innerHTML +=
              '<h3 id="exit">Exit button</h3>' +
              '<p>Emergency exit button</p>' +
              '<table style="border-collapse: separate; border-spacing: 1ex; margin-left: -1ex;"><tbody>' +
              '<tr><td>Blank screen:</td><td>' +
                '<label for="exit-wait-0" style="margin-right: 2em;"><input name="exit-wait" id="exit-wait-0" type="radio" value="wait"' + (s.wait == 'wait'? ' checked="true"' : '') +
                ' onchange="rc_exit_set(this)">&quot;Loading...&quot;</label>' +
                '<label for="exit-wait-1"><input name="exit-wait" id="exit-wait-1" type="radio" value="none"' + (s.wait == 'none'? ' checked="true"' : '') +
                ' onchange="rc_exit_set(this)">' +
                'None</label>' +
                '</td></tr>' +
              '<tr><td>Go to:</td><td><input id="exit-url" type="text" value="' + s.url + '" size="30" oninput="rc_exit_set(this)"></td></tr>' +
              '</tbody></table>';
            });
        rc_exit_set = function (inp) {
            var ts = JSON.parse(localStorage.getItem('rc_tweaksettings'));
            if (inp.getAttribute('name') == 'exit-wait') ts.exit.wait = inp.value;
            else ts.exit.url = inp.value;
            localStorage.setItem('rc_tweaksettings', JSON.stringify(ts));
            };
        return;
    }

    rc_tbic = function () { // The Boss Is Coming...
        GM_addStyle('body * {display: none;}');
        var ts = JSON.parse(localStorage.getItem('rc_tweaksettings'));
        if (!ts) ts = {};
        if (!ts.exit) ts.exit = {url: 'http://google.com', wait: 'wait'};
        if (ts.exit.wait == 'wait') {
            var p = document.createElement('p');
            p.setAttribute('style', 'display: block !important; position: fixed; top: 1em; left: 1em;');
            p.appendChild(document.createTextNode('Loading. Please wait...'));
            document.body.appendChild(p);
            }
        if (ts.exit.url) location.replace(ts.exit.url);
        };

    GM_addStyle('#rc_exit {font-size: 13px; letter-spacing: 1px; padding: 4px 6px 2px 6px; position: fixed; top: 76px; right: 6px; ' +
      'color: #0f9; text-shadow: 0 0 2px #4fd; font-weight: bold; border-radius: 6px; box-shadow: 1px 1px 4px #999;' +
      ' background-color: #0bd; background: linear-gradient(#0bd, #0ac);} ');
    var b = document.createElement('button');
    b.id = 'rc_exit';
    b.setAttribute('onclick', 'rc_tbic()');
    b.setAttribute('title', 'Emergency exit');
    b.appendChild(document.createTextNode('EXIT'));
    document.body.appendChild(b);
})();