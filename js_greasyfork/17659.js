// ==UserScript==
// @name         7 Cups - Contrast
// @namespace    http://tampermonkey.net/
// @description  High contrast timestamps in chats, etc.
// @locale       en
// @author       RarelyCharlie
// @website      http://www.7cups.com/@RarelyCharlie
// @license      Open Software License version 3.0
// @match        https://www.7cups.com/*er/connect/conversation.php?c=*
// @match        https://www.7cups.com/forum/*
// @match        https://www.7cups.com/*er/
// @run-at       document-body
// @grant        GM_addStyle
// @version      1.3
// @downloadURL https://update.greasyfork.org/scripts/17659/7%20Cups%20-%20Contrast.user.js
// @updateURL https://update.greasyfork.org/scripts/17659/7%20Cups%20-%20Contrast.meta.js
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
            var s = ts.contrast; // my settings
            if (s && typeof(s) == 'string') s = [s, 'darkslategray', 'linen']; // convert old data
            if (!s) {
                s = ['navy', 'white', 'dodgerblue']; // defaults
                ts.contrast = s;
                localStorage.setItem('rc_tweaksettings', JSON.stringify(ts));
                }
            document.getElementById('tweaksettings').innerHTML +=
              '<h3 id="contrast">Contrast</h3>' +
              '<p>High-contrast color for various pale gray elements</p>' +
              '<table style="border-collapse: separate; border-spacing: 1ex; margin-left: -1ex;"><tbody>' +
              '<tr><td>Color:</td><td><input id="contrast-text-0" type="text" value="' + s[0] + '" size="18" oninput="rc_contrast_set(this)">' +
              '<input type="color" id="contrast-picker-0" onchange="rc_contrast_set(this)" value="#000000" style="height: 1.65em;">' +
              '&nbsp;<span id="contrast-sample-0">Sample text</span></td></tr>' +
              '<tr><td colspan="2" style="padding-top: 1ex;">My chat text</td></tr>' +
              '<tr><td>Text:</td><td><input id="contrast-text-1" type="text" value="' + s[1] + '" size="18" oninput="rc_contrast_set(this)">' +
              '<input type="color" id="contrast-picker-1" onchange="rc_contrast_set(this)" value="#000000" style="height: 1.65em;">' +
              '&nbsp;<span id="contrast-sample-1" style="padding: 6px 12px; border-radius: 7px 7px 0 7px; position: relative; top: 5px;">Sample chat text</span></td></tr>' +
              '<tr><td>Background:&nbsp;</td><td><input id="contrast-text-2" type="text" value="' + s[2] + '" size="18" oninput="rc_contrast_set(this)">' +
              '<input type="color" id="contrast-picker-2" onchange="rc_contrast_set(this)" value="#000000" style="height: 1.65em;">' +
              '</td></tr>' +
              '</tbody></table>';
            setTimeout(function () {for (var i = 0; i <=2; ++i) rc_contrast_set(document.getElementById('contrast-text-' + i));}, 0);
            });
        rc_contrast_set = function (inp) {
            var row = inp.id.slice(-1), v = inp.value;
            var ts = JSON.parse(localStorage.getItem('rc_tweaksettings'));
            if (typeof(ts.contrast) == 'string') ts.contrast = [ts.contrast, 'white', 'dodgerblue']; // convert old data
            ts.contrast[row] = v;
            localStorage.setItem('rc_tweaksettings', JSON.stringify(ts));
            if (!v) v = ['#c2c5cf', 'white', 'dodgerblue'][row];
            var s, rgb;
            if (row < 2) {
                s = document.getElementById('contrast-sample-' + row);
                s.style.color = v;
                rgb = getComputedStyle(s).color.match(/(\d+)/g);
                }
            else {
                s = document.getElementById('contrast-sample-1');
                s.style.backgroundColor = v;
                rgb = getComputedStyle(s).backgroundColor.match(/(\d+)/g);
                }
            rgb = "#" + ("0" + parseInt(rgb[0],10).toString(16)).slice(-2) + ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2],10).toString(16)).slice(-2);
            var p = document.getElementById('contrast-picker-' + row);
            if (p != inp) p.value = rgb;
            p = document.getElementById('contrast-text-' + row);
            if (p != inp) p.value = inp.value;
            };
        return;
    }

    var ts = JSON.parse(localStorage.getItem('rc_tweaksettings'));
    if (!ts) ts = {};
    s = ts.contrast;
    if (s && typeof(s) == 'string') s = [s, 'white', 'dodgerblue']; // upgrade old data
    if (!s) {
        s = ['navy', 'white', 'dodgerblue']; // my defaults
        ts.contrast = s;
        localStorage.setItem('rc_tweaksettings', JSON.stringify(ts));
        }
    var css = '';
    if (s[0]) css += '.details, .replyLink a, .voteUp.disabled {color: ' + s[0] + ' !important;} ' +
      '.voteUp.disabled>.fa-arrow-up::before {opacity: .2 !important;} ' +
      '#actionButtons img {background-color: ' + s[0] + '; border-radius: 14px; opacity: .67;} ';
    if (s[1]) css += '.chatBox .meWrap {color: ' + s[1] + ';} ';
    if (s[2]) css += '.chatBox .meWrap {background-color: ' + s[2] + ';} ';
    GM_addStyle(css);
})();