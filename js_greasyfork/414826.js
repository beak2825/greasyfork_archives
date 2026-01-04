// ==UserScript==
// @name         ShowPass
// @namespace    bitst0rm
// @version      0.0.10
// @description  Show password as plain text in password fields
// @author       bitst0rm
// @license      GPLv3
// @icon         https://github.com/bitst0rm-pub/ShowPass/raw/master/logo.png
// @include      *
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/414826/ShowPass.user.js
// @updateURL https://update.greasyfork.org/scripts/414826/ShowPass.meta.js
// ==/UserScript==

(function(win) {
    'use strict';

    if (typeof GM_getValue === 'undefined' ||
        typeof GM_setValue === 'undefined' ||
        typeof GM_registerMenuCommand === 'undefined') {
        alert('You\'ve been warned 3 times that this script\n' +
            'does not support webshit aka Greasemonkey!\n' +
            'Get Tampermonkey and you will be happy.\n' +
            'Do not do this again.');
        return;
    }

    var MOUSEOVER = 'idMouseOver';
    var DBLCLICK = 'idDblClick';
    var FOCUS = 'idFocus';
    var CTRL = 'idCtrl';
    var BOLD = 'idBold';
    var PREVIEW = 'idPreview';
    var PROGRESS = 'idProgress';
    var HEIGHT = 'idHeight';
    var COLOR = 'idColor';
    var EXCLSHOW = 'idExclShow';
    var EXCLSTRENGTH = 'idExclStrength';
    var DISTANCE = 'idDistance';
    var UID = 'showpass-' + Math.random().toString(36).slice(8);
    var RANDOM = null;

    var config = {};
    config[MOUSEOVER] = true;
    config[DBLCLICK] = false;
    config[FOCUS] = false;
    config[CTRL] = false;
    config[BOLD] = true;
    config[PROGRESS] = true;
    config[HEIGHT] = '6';
    config[COLOR] = '#ff0000';
    config[EXCLSHOW] = '^login\\.example\\.com\n^(.+?\\.)?example\\.net';
    config[EXCLSTRENGTH] = '^(.+?\\.)?dropbox\\.com';
    config[DISTANCE] = '^accounts\\.google\\.com#2\n^(.+?\\.)?(gmx\\.(net|at)|web\\.de)#1';
    for (var k in config) {
        if (GM_getValue(k) === undefined) {
            GM_setValue(k, config[k]);
        }
    }

    var html = '<!DOCTYPE html>' +
        '<html lang="en">' +
        '<head>' +
        '<title>ShowPass Option</title>' +
        '<meta charset="utf-8">' +
        '<meta name="viewport" content="width=device-width">' +
        '<style>' +
        'body{font-family:Arial,Helvetica,sans-serif;text-align:center;}' +
        'table{margin-right:auto;margin-left:auto;padding:1em;text-align:left;background-color:#f8f8f8;border:solid 1px #bebebe;border-radius:1em;}' +
        'td{padding:.5em;}' +
        'input,textarea,select{margin-left:0px;padding:4px;border-radius:3px;border:1px solid #9aa4b1;}' +
        'input[type="color"]{padding:1px 2px;}' +
        'textarea{min-width:20em;height:6em;}' +
        'label{margin:0 .4em;}' +
        '#' + HEIGHT + '{margin-left: .4em;}' +
        '.badge{background-color:#adebeb;border:1px solid #009999;border-radius:5px;padding:1px 6px;box-shadow:1px 1px 2px rgba(0,0,0,0.3);}' +
        '#msg{font-size:1.2em;font-weight:bold;margin:1em;transition:opacity .5s ease 1s;opacity:0;color:#669900;}' +
        '#msg.show{transition:none;opacity:1;}' +
        '</style>' +
        '</head>' +
        '<body>' +
        '<h1>ShowPass Option</h1>' +
        '<table><tr><td>Show password mode:</td>' +
        '<td><select id="menu">' +
        '<option id="' + MOUSEOVER + '"' + (GM_getValue(MOUSEOVER) ? ' selected' : '') + '>Mouse Over</option>' +
        '<option id="' + DBLCLICK + '"' + (GM_getValue(DBLCLICK) ? ' selected' : '') + '>Double Click</option>' +
        '<option id="' + FOCUS + '"' + (GM_getValue(FOCUS) ? ' selected' : '') + '>On Focus</option>' +
        '<option id="' + CTRL + '"' + (GM_getValue(CTRL) ? ' selected' : '') + '>Press CTRL Key</option>' +
        '</select></td></tr>' +
        '<tr><td>Password style:</td>' +
        '<td><input type="checkbox" id="' + BOLD + '"' + (GM_getValue(BOLD) ? ' checked' : '') + '>' +
        '<label for="' + BOLD + '">Bold</label>' +
        '<input type="color" value="' + GM_getValue(COLOR) + '" id="' + COLOR + '">' +
        '<label for="' + COLOR + '">Color</label></td></tr>' +
        '<tr><td>Show password strength:</td>' +
        '<td><input type="checkbox" id="' + PROGRESS + '"' + (GM_getValue(PROGRESS) ? ' checked' : '') + '>' +
        '<input type="number" id="' + HEIGHT + '" min="4" max="30" value="' + GM_getValue(HEIGHT) + '">' +
        '<label for="' + HEIGHT + '">px Height</label></td></tr>' +
        '<tr><td>Preview password:</td>' +
        '<td><input type="password" id="' + PREVIEW + '" placeholder="Enter password"></td></tr>' +
        '<tr><td>Exclude showing password:<br><i>(RegExp on hostnames)</i></td>' +
        '<td><textarea id="' + EXCLSHOW + '">' + GM_getValue(EXCLSHOW) + '</textarea></td></tr>' +
        '<tr><td>Exclude showing strength bar:<br><i>(RegExp on hostnames)</i></td>' +
        '<td><textarea id="' + EXCLSTRENGTH + '">' + GM_getValue(EXCLSTRENGTH) + '</textarea></td></tr>' +
        '<tr><td><span class="badge">Fine-turning</span> Distance between<br>strength bar and pw input field:<br><i>(RegExp hostname#nDistance)</i></td>' +
        '<td><textarea id="' + DISTANCE + '">' + GM_getValue(DISTANCE) + '</textarea></td></tr></table>' +
        '<div id="msg">Saved!</div>' +
        '</body>' +
        '</html>';

    var css = '.progress-bar-' + UID + '{-webkit-appearance:none;-moz-appearance:none;appearance:none;height:' + GM_getValue(HEIGHT) + 'px;border:1px solid #b2b2b2;border-radius:1em;background-color:#efefef;}' +
        '.progress-bar-' + UID + '::-webkit-progress-bar{border-radius:1em;background-color:#efefef;}' +
        '.progress-bar-' + UID + '::-webkit-progress-value{-webkit-transition:width 0.5s ease;transition:width 0.5s ease;border-radius:1em 0 0 1em;}' +
        '.progress-bar-' + UID + '[value="1"]::-webkit-progress-value{background-color:#dc3545;}' +
        '.progress-bar-' + UID + '[value="2"]::-webkit-progress-value{background-color:#ffc107;}' +
        '.progress-bar-' + UID + '[value="3"]::-webkit-progress-value{background-color:#1178f7;}' +
        '.progress-bar-' + UID + '[value="4"]::-webkit-progress-value{background-color:#17a2b8;}' +
        '.progress-bar-' + UID + '[value="5"]::-webkit-progress-value{border-radius:1em;background-color:#28a745;}' +
        '.progress-bar-' + UID + '::-moz-progress-bar{-moz-transition:width 0.5s ease;border-radius:1em 0 0 1em;}' +
        '.progress-bar-' + UID + '[value="1"]::-moz-progress-bar{background-color:#dc3545;}' +
        '.progress-bar-' + UID + '[value="2"]::-moz-progress-bar{background-color:#ffc107;}' +
        '.progress-bar-' + UID + '[value="3"]::-moz-progress-bar{background-color:#1178f7;}' +
        '.progress-bar-' + UID + '[value="4"]::-moz-progress-bar{background-color:#17a2b8;}' +
        '.progress-bar-' + UID + '[value="5"]::-moz-progress-bar{border-radius:1em;background-color:#28a745;}' +
        '#br-' + UID + '{display:block;content:"";margin:0px;line-height:0px;}';

    function blacklist(type, host) {
        var txt = GM_getValue(type);
        var lines = txt.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var re = new RegExp(line);
            if (line && re.test(host)) return true;
        }
        return false;
    }

    function strength(pw) {
        return (/.{8,}/.test(pw) * ( /* at least 8 characters */
                /.{12,}/.test(pw) + /* bonus if longer */
                /[a-z]/.test(pw) + /* a lower letter */
                /[A-Z]/.test(pw) + /* a upper letter */
                /\d/.test(pw) + /* a digit */
                /[^A-Za-z0-9]/.test(pw))) - /* a special character */
            /(.)\1{2,}/.test(pw); /* a same char 3 times or more */
    }

    function distance(input, host) {
        var txt = GM_getValue(DISTANCE);
        var lines = txt.split('\n');
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            var p = line.split('#');
            var hostname = p[0];
            var level = Number(p[1]);
            if (isNaN(level) || level < 1) {
                console.warn('[ShowPass] Distance must be of type number and greater than 0: ', line);
                continue;
            }
            var re = new RegExp(hostname);
            if (hostname && re.test(host)) {
                var a = null;
                var b = null;
                var c = 0;
                var current = input;
                while (current.parentNode) {
                    if (c === level + 1) break;
                    b = current;
                    current = current.parentNode;
                    a = current;
                    c++;
                }
                if (a.constructor.name !== 'HTMLDocument') {
                    return [a, b];
                } else {
                    console.error('[ShowPass] Distance out of the scope: ', line);
                    return false;
                }
            }
        }
        return false;
    }

    function progress(input, host) {
        RANDOM = Math.random().toString(36).slice(2);
        input.style.setProperty('margin-bottom', '0px', 'important');
        var inputWidth = input.offsetWidth;

        var div = document.createElement('div');
        div.id = 'progress-wrapper-' + RANDOM;
        div.style.margin = '0px';
        div.style.padding = '0px';
        div.style.boxSizing = 'border-box';

        var br = document.createElement('br');
        br.id = 'br-' + UID;

        var pgr = document.createElement('progress');
        pgr.id = 'progress-' + RANDOM;
        pgr.className = 'progress-bar-' + UID;
        pgr.value = 0;
        pgr.max = 5;
        pgr.style.width = inputWidth + 'px';
        pgr.style.margin = '2px 0px 0px 0px';
        pgr.style.padding = '0px';
        pgr.style.verticalAlign = 'top';

        var arr = distance(input, host);
        if (arr) {
            arr[0].insertBefore(div, arr[1].nextSibling);
        } else {
            input.parentNode.insertBefore(div, input.nextSibling);
            div.appendChild(input);
            div.appendChild(br);
        }
        div.appendChild(pgr);

        input.addEventListener('keyup', function() {
            pgr.value = strength(input.value);
        });

        return pgr;
    }

    function update(input, host) {
        var pgr = progress(input, host);
        var c = 0;
        var check = setInterval(function() {
            if (c === 20) clearInterval(check);
            pgr.style.width = input.offsetWidth + 'px';
            c++;
        }, 100);
    }

    function cfg() {
        var display = true;
        document.body.parentElement.innerHTML = html;
        GM_addStyle(css);
        var pgrbox = document.getElementById(PROGRESS);
        var hight = document.getElementById(HEIGHT);
        hight.disabled = (pgrbox.checked ? false : true);

        document.body.addEventListener('change', function(e) {
            var t = e.target;
            GM_setValue(t.id, (t.type === 'checkbox' ? t.checked : t.value));
            if (t.id === 'menu') {
                for (var i = 0; i < t.length; i++) {
                    var option = t.options[i];
                    GM_setValue(option.id, option.selected);
                }
            }

            var pgr = document.getElementById('progress-' + RANDOM);

            if (t.id === PROGRESS) {
                if (!pgr) {
                    var input = document.getElementById(PREVIEW);
                    pgr = progress(input);
                    display = false;
                }
                if (!display) {
                    pgr.style.display = 'block';
                    hight.disabled = false;
                } else {
                    pgr.style.display = 'none';
                    hight.disabled = true;
                }
                display = !display;
            }

            if (t.id === HEIGHT) pgr.style.height = t.value + 'px';

            var elem = document.getElementById('msg');
            elem.classList.add('show');
            setTimeout(function() {
                elem.classList.remove('show');
            }, 100);
        });
    }

    function setCaretToEnd(e) {
        setTimeout((function() {
            var t = e.target;
            var l = t.value.length;
            t.setSelectionRange(l, l);
        }), 0);
    }

    function show(e) {
        var t = e.target;
        t.type = 'text';
        t.style.setProperty('caret-color', 'black', 'important');
        t.style.setProperty('color', GM_getValue(COLOR), 'important');
        t.style.setProperty('font-weight', GM_getValue(BOLD) ? 'bold' : '', 'important');
        setCaretToEnd(e);
    }

    function hide(e) {
        var t = e.target;
        t.type = 'password';
        t.style.caretColor = '';
        t.style.color = '';
        t.style.fontWeight = '';
    }

    function showPass(node, host) {
        var isHide = true;
        var _toggle = function(e) {
            if (e.keyCode === 17) {
                if (isHide) {
                    show(e);
                } else {
                    hide(e);
                }
                isHide = !isHide;
            }
        };
        var _hide = function(e) {
            hide(e);
            isHide = true;
        };

        var inputs = node.querySelectorAll('input[type=password]');
        if (!inputs.length) return;

        for (var j = 0; j < inputs.length; j++) {
            var input = inputs[j];
            if (input.ariaHidden && input.ariaHidden === 'true' || input.hidden ||
                input.style.visibility && input.style.visibility === 'hidden' ||
                input.style.display && input.style.display === 'none') continue;
            if (!input.ready) {
                input.ready = true;
                if (GM_getValue(MOUSEOVER)) {
                    input.addEventListener('mouseover', show, false);
                    input.addEventListener('mouseout', hide, false);
                }
                if (GM_getValue(DBLCLICK)) {
                    input.addEventListener('dblclick', show, false);
                    input.addEventListener('blur', hide, false);
                }
                if (GM_getValue(FOCUS)) {
                    input.addEventListener('focus', show, false);
                    input.addEventListener('blur', hide, false);
                }
                if (GM_getValue(CTRL)) {
                    input.addEventListener('keyup', _toggle, false);
                    input.addEventListener('blur', _hide, false);
                }
                if (GM_getValue(PROGRESS)) {
                    if (blacklist(EXCLSTRENGTH, host)) continue;
                    update(input, host);
                }
            }
        }
    }

    win.addEventListener('resize', function() {
        var bars = document.getElementsByClassName('progress-bar-' + UID);
        for (var i = 0; i < bars.length; i++) {
            var bar = bars[i];
            var input = bar.parentNode.querySelector('input[type="password"]');
            bar.style.width = input.offsetWidth + 'px';
        }
    });

    function domWatcher() {
        var queue = [];
        var ignoreTags = ['br', 'head', 'link', 'meta', 'script', 'style'];

        var Watch = win.MutationObserver || win.WebKitMutationObserver;
        var observer = new Watch(function(mutations) {
            if (!queue.length) requestAnimationFrame(process);
            queue.push(mutations);
        });
        var container = document.documentElement || document.body;
        observer.observe(container, {
            childList: true,
            subtree: true
        });

        function process() {
            for (var i = 0; i < queue.length; i++) {
                var mutations = queue[i];
                for (var j = 0; j < mutations.length; j++) {
                    var mutation = mutations[j];
                    if (mutation.type === 'childList') {
                        var addedNodes = mutation.addedNodes;
                        for (var n = 0; n < addedNodes.length; n++) {
                            var node = addedNodes[n];
                            if (node.nodeType !== 1) continue;
                            if (ignoreTags.indexOf(node.localName) !== -1) continue;
                            if (node.parentElement === null) continue;
                            if (node.nodeName === 'IFRAME') {
                                goFrame(node);
                            } else {
                                goPage(node);
                            }
                        }
                    }
                }
            }
            queue.length = 0;
        }
    }

    function goFrame(node) {
        var frame = node.contentDocument || node.contentWindow.document;
        if (blacklist(EXCLSHOW, frame.location.hostname)) return;
        showPass(frame.body, frame.location.hostname);
    }

    function goPage(node) {
        showPass(node, win.location.hostname);
    }

    function init() {
        GM_registerMenuCommand('Configure', cfg, 'C');
        if (blacklist(EXCLSHOW, win.location.hostname)) return;

        if (GM_getValue(PROGRESS)) GM_addStyle(css);
        goPage(document.body);

        var nodes = document.querySelectorAll('iframe');
        for (var i = 0; i < nodes.length; i++) {
            goFrame(nodes[i]);
        }

        domWatcher();
    }

    init();
})(this);
