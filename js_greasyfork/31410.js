// ==UserScript==
// @name         Gota.io Features by Donut + Linesplit
// @namespace    https://www.youtube.com/channel/UCIpCflcKEN9YgaO9qDahpRg
// @version      1.7.12
// @description  Linesplit up, down, left and right • Diagonal linesplit with just one key • Hotkeys to show/hide skins, names, mass, food, chat, minimap, score panel, party panel and leaderboard • Auto respawn in Team Scrimmage • Leave a scrimmage match before it ends • You can change the keys as you wish
// @match        *://gota.io/web*
// @author       Donut
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/31410/Gotaio%20Features%20by%20Donut%20%2B%20Linesplit.user.js
// @updateURL https://update.greasyfork.org/scripts/31410/Gotaio%20Features%20by%20Donut%20%2B%20Linesplit.meta.js
// ==/UserScript==

(function(){
    if (window.top != window.self) return;

    if (!('code' in KeyboardEvent.prototype)) {
        return alert("Sorry, your browser is incompatible with Gota.io Features by Donut. You're recommended to install the newest version of Google Chrome or Mozilla Firefox browsers.");
    }

    function validateVersion(v) {
        return !!v && !v.split('.').some(function(part) {
            return !/^\d+$/.test(part);
        });
    }

    function compareVersions(v1, v2) {
        var v1parts = v1.split('.').map(Number);
        var v2parts = v2.split('.').map(Number);

        while (v1parts.length < v2parts.length) v1parts.push(0);
        while (v2parts.length < v1parts.length) v2parts.push(0);

        for (var i = 0; i < v1parts.length; ++i) {
            if (v1parts[i] > v2parts[i]) return 1;
            else if (v1parts[i] < v2parts[i]) return -1;
        }
        return 0;
    }

    var importantUpdates = ['1.5.3', '1.6', '1.6.3', '1.7.0', '1.7.7'];
    importantUpdates.sort(compareVersions);

    var version = '1.7.12', storageVersion = localStorage['donut-version'];
    var storageVersionValid = validateVersion(storageVersion);
    var notify = !storageVersionValid || compareVersions(importantUpdates[importantUpdates.length - 1], storageVersion) == 1;
    if (!notify) localStorage['donut-version'] = version;

    var styles = {
        '.g-recaptcha, .grecaptcha-badge': {
            'display': 'none !important'
        },
        '.bottom-btn': {
            'height': '32px'
        },
        '.donut-features-table': {
            'margin': 'auto',
            'width': 'max-content',
            'border-collapse': 'collapse'
        },
        '.donut-features-table td:nth-child(1)': {
            'text-align': 'left'
        },
        '.donut-features-table th, .donut-features-table td': {
            'position': 'relative',
            'padding': '2px 8px'
        },
        '.donut-features-table input[type="text"]': {
            'box-sizing': 'border-box',
            'width': '104px',
            'height': '22px',
            'text-align': 'center'
        },
        '.donut-features-table select': {
            'position': 'absolute',
            'top': '2px',
            'bottom': '2px',
            'left': '8px',
            'box-sizing': 'border-box',
            'padding': '0',
            'width': '104px',
            'height': '22px',
            'font-size': '0',
            'background': 'transparent',
            'border': 'none',
            'outline': '0'
        },
        '.donut-features-table option': {
            'font-size': '13.3333px'
        },
        '.donut-features-div': {
            'margin': 'auto',
            'padding-top': '4px',
            'width': 'max-content'
        },
        '.donut-checkbox': {
            'position': 'relative',
            'top': '1px',
            'margin': '0 5px'
        },
        '.donut-channel-link': {
            'box-sizing': 'border-box',
            'display': 'block',
            'margin': '3px auto 0',
            'padding': '4px 8px 4px 5.5px',
            'width': '85px',
            'height': '24px',
            'color': '#fefefe',
            'font-family': 'Arial, Helvetica, sans-serif',
            'font-size': '12px',
            'line-height': 'normal',
            'text-align': 'center',
            'text-decoration': 'none',
            'background-color': '#e62117',
            'border': 'solid 1px transparent',
            'border-radius': '2px',
            'white-space': 'nowrap',
            'vertical-align': 'middle',
            'box-shadow': '0 1px 0 rgba(0,0,0,0.05)'
        },
        '.donut-channel-link::before': {
            'content': '""',
            'position': 'relative',
            'top': '-1px',
            'display': 'inline-block',
            'margin-right': '6px',
            'width': '16px',
            'height': '12px',
            'background': 'no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl-Nn88d.png) -721px -88px',
            'background-size': 'auto',
            'vertical-align': 'middle'
        },
        '.donut-channel-link>span': {
            'display': 'inline-block',
            '-moz-box-sizing': 'border-box',
            'box-sizing': 'border-box'
        },
        '.donut-channel-link:hover': {
            'background-color': '#cc181e'
        },
        '.donut-channel-link:active': {
            'background-color': '#b31217'
        }
    };

    if (notify) {
        styles['.donut-features-btn::before'] = {
            'content': '"!"',
            'position': 'absolute',
            'top': '-4px',
            'right': '-4px',
            'width': '15px',
            'height': '15px',
            'color': 'white',
            'font-family': 'Open Sans',
            'font-size': '12px',
            'text-align': 'center',
            'line-height': '15px',
            'background-color': 'red',
            'border-radius': '50%',
            'overflow': 'hidden',
            '-webkit-user-select': 'none',
            '-moz-user-select': 'none',
            '-ms-user-select': 'none',
            'user-select': 'none',
        };
    }

    function insertRule(selector) {
        var rule = selector + '{';
        for (var property in styles[selector]) rule += property + ':' + styles[selector][property] + ';';
        rule += '}';
        stylesheet.insertRule(rule, stylesheet.cssRules.length);
    }

    var style = document.createElement('style');
    document.head.appendChild(style);
    var stylesheet = style.sheet;
    for (var selector in styles) insertRule(selector);

    var gota = {
        main: document.getElementById('main'),
        left: document.getElementsByClassName('main-bottom-left')[0],
        right: document.getElementsByClassName('main-bottom-right')[0],
        stats: document.getElementsByClassName('main-bottom-stats')[0],
        btnPlay: document.getElementById('btn-play'),
        btnSpec: document.getElementById('btn-spec'),
        scorePanel: document.getElementById('score-panel'),
        partyPanel: document.getElementById('party-panel'),
        leaderboardPanel: document.getElementById('leaderboard-panel'),
        extraPanel: document.getElementById('extra-panel'),
        chatPanel: document.getElementById('chat-panel'),
        chatInput: document.getElementById('chat-input'),
        mainScrimmage: document.getElementById('main-scrimmage'),
        scrimmageModeSelect: document.getElementById('scrimmage-mode-select'),
        btnQueue: document.getElementById('btn-queue'),
        scrimmageBtnLeave: document.getElementById('scrimmage-btn-leave'),
        btnLeaveMatch: document.getElementById('btn-leave-match'),
        playerCells: document.getElementById('playerCells'),
        scoreMouse: document.getElementById('score-mouse'),
        sShowSkins: document.getElementById('sShowSkins'),
        sShowNames: document.getElementById('sShowNames'),
        cShowMass: document.getElementById('cShowMass'),
        cHideFood: document.getElementById('cHideFood'),
        cHideChat: document.getElementById('cHideChat'),
        cHideMinimap: document.getElementById('cHideMinimap'),
        cAutoDecline: document.getElementById('cAutoDecline'),
        cAutoRespawn: document.getElementById('cAutoRespawn')
    };

    gota.stats.style.width = '140px';
    gota.stats.style.height = '143px';

    var leftButton = document.createElement('button');
    leftButton.className = 'gota-btn bottom-btn';
    leftButton.style.margin = '0 3px';
    leftButton.style.float = 'none';
    leftButton.style.setProperty('border-radius', '10px 3px 3px 10px', 'important');

    var rightButton = leftButton.cloneNode();
    rightButton.style.setProperty('border-radius', '3px 10px 10px 3px', 'important');

    var btn = rightButton.cloneNode();
    btn.className += ' donut-features-btn';
    btn.style.position = 'relative';
    btn.style.boxSizing = 'border-box';
    btn.style.margin = '5px 0';
    btn.style.setProperty('border-radius', '3px 10px 10px 3px', 'important');
    btn.style.whiteSpace = 'nowrap';
    btn.style.overflow = 'visible';
    btn.style.float = 'left';
    btn.innerText = 'Features by Donut';
    btn.addEventListener('click', function() {
        blackout.style.opacity = '0';
        blackout.style.display = 'block';
        resize();
        blackout.style.opacity = '1';
        if (notify) {
            localStorage['donut-version'] = version;
            stylesheet.insertRule('.donut-features-btn::before{content:none;}', stylesheet.cssRules.length);
        }
    });
    gota.right.appendChild(btn);

    var blackout = document.createElement('div');
    blackout.className = 'donut-blackout';
    blackout.style.position = 'fixed';
    blackout.style.top = '0';
    blackout.style.right = '0';
    blackout.style.bottom = '0';
    blackout.style.left = '0';
    blackout.style.display = 'none';
    blackout.style.background = 'rgba(0,0,0,.5)';
    blackout.style.overflow = 'auto';
    blackout.style.zIndex = '100';
    document.body.appendChild(blackout);

    var win = document.createElement('div');
    win.style.position = 'relative';
    win.style.left = '50%';
    win.style.padding = '15px';
    win.style.width = 'max-content';
    win.style.color = 'white';
    win.style.fontFamily = 'Arial, Helvetica, sans-serif';
    win.style.fontSize = '16px';
    win.style.lineHeight = '22px';
    win.style.textAlign = 'center';
    win.style.backgroundColor = '#363636';
    win.style.borderRadius = '10px';
    win.innerHTML = `<table class='donut-features-table'><tbody><tr><th>Feature</th><th>Default</th><th>Custom key</th></tr>
<tr><td>Show/hide skins</td><td>K</td><td><input type="text" spellcheck="false" data-donut-feature="skins"></td></tr>
<tr><td>Show/hide names</td><td>N</td><td><input type="text" spellcheck="false" data-donut-feature="names"></td></tr>
<tr><td>Show/hide mass</td><td>M</td><td><input type="text" spellcheck="false" data-donut-feature="mass"></td></tr>
<tr><td>Show/hide food</td><td>F</td><td><input type="text" spellcheck="false" data-donut-feature="food"></td></tr>
<tr><td>Show/hide chat</td><td>H</td><td><input type="text" spellcheck="false" data-donut-feature="chat"></td></tr>
<tr><td colspan="2">Triple split (8x)</td><td><input type="text" spellcheck="false" data-donut-feature="tripleSplit"></td></tr>
<tr><td colspan="2">Hexa split (64x)</td><td><input type="text" spellcheck="false" data-donut-feature="hexaSplit"></td></tr>
<tr><td colspan="2">Show/hide minimap</td><td><input type="text" spellcheck="false" data-donut-feature="minimap"></td></tr>
<tr><td colspan="2">Show/hide score panel</td><td><input type="text" spellcheck="false" data-donut-feature="scorePanel"></td></tr>
<tr><td colspan="2">Show/hide party panel</td><td><input type="text" spellcheck="false" data-donut-feature="partyPanel"></td></tr>
<tr><td colspan="2">Show/hide leaderboard</td><td><input type="text" spellcheck="false" data-donut-feature="leaderboard"></td></tr>
<tr><td colspan="2" style="padding-right:32px;">Toggle <em>Decline party invites</em></td><td><input type="text" spellcheck="false" data-donut-feature="autoDecline"></td></tr>
<tr><td colspan="2">Toggle <em>Auto respawn</em></td><td><input type="text" spellcheck="false" data-donut-feature="autoRespawn"></td></tr>
<tr><th colspan="3">Linesplit</th></tr>
<tr><td>Freeze in the middle</td><td>S</td><td><input type="text" spellcheck="false" data-donut-feature="freeze"></td></tr>
<tr><td colspan="2">Freeze to linesplit up</td><td><input type="text" spellcheck="false" data-donut-feature="freezeUp"></td></tr>
<tr><td colspan="2">Freeze to linesplit down</td><td><input type="text" spellcheck="false" data-donut-feature="freezeDown"></td></tr>
<tr><td colspan="2"><div style="display:inline-block;text-decoration:underline dotted;cursor:help;" title="Horizontal linesplits are not guaranteed to work. Use at your own risk!">Freeze to linesplit left</div></td><td><input type="text" spellcheck="false" data-donut-feature="freezeLeft"></td></tr>
<tr><td colspan="2"><div style="display:inline-block;text-decoration:underline dotted;cursor:help;" title="Horizontal linesplits are not guaranteed to work. Use at your own risk!">Freeze to linesplit right</div></td><td><input type="text" spellcheck="false" data-donut-feature="freezeRight"></td></tr>
<tr><td colspan="2">Diagonal linesplit (8x)</td><td><input type="text" spellcheck="false" data-donut-feature="linesplit"></td></tr>
<tr><td colspan="2">Freeze mode</td><td><input type="text" spellcheck="false" readonly><select id="donut-freezeMode" data-donut-feature="freezeMode"><option value="hold">Hold down</option><option value="toggle">Toggle</option></select></td></tr>
<tr><th colspan="3">Team Scrimmage</th></tr>
<tr><td>Leave a match</td><td>L</td><td><input type="text" spellcheck="false" data-donut-feature="leave"></td></tr>
<tr><td colspan="2">Queue</td><td><input type="text" spellcheck="false" data-donut-feature="queue"></td></tr>
<tr><td colspan="2">Default gamemode</td><td><input type="text" spellcheck="false" readonly><select id="donut-scrimmageMode" data-donut-feature="scrimmageMode"><option value="0">Team 2v2</option><option value="1">Team 2v2 [MegaSplit]</option><option value="2">Team 2v2 [Extreme]</option><option value="3">Duel 1v1</option></select></td></tr></tbody></table>
<div class="donut-features-div">You should only use the <em>Leave a match</em> hotkey<br>when playing with random teammates.</div>
<div class="donut-features-div">If you want to disable a hotkey, type Delete.</div>
<div class="donut-features-div"><label><input type="checkbox" class="donut-checkbox" id="donut-hideScorePanel" data-donut-feature="hideScorePanel">Hide Score Panel</label><br>
<label><input type="checkbox" class="donut-checkbox" id="donut-hidePartyPanel" data-donut-feature="hidePartyPanel">Hide Party Panel</label><br>
<label><input type="checkbox" class="donut-checkbox" id="donut-hideLeaderboard" data-donut-feature="hideLeaderboard">Hide Leaderboard</label><br>
<label><input type="checkbox" class="donut-checkbox" id="donut-scrimmageAutoRespawn" data-donut-feature="scrimmageAutoRespawn">Scrimmage Auto Respawn</label><br>
<label><input type="checkbox" class="donut-checkbox" id="donut-startWithScrimmage" data-donut-feature="startWithScrimmage">Join Scrimmage as I open the game</label><br>
<label><input type="checkbox" class="donut-checkbox" id="donut-leaveExperimental" data-donut-feature="leaveExperimental">Use my <em>Leave a match</em> hotkey to leave<br>my team in the other gamemodes</label></div>
<div class="donut-features-div">You can support the developer by checking out<br>his YouTube channel:</div>
<a href="https://www.youtube.com/channel/UCIpCflcKEN9YgaO9qDahpRg" target="_blank" class="donut-channel-link"><span>YouTube</span></a>`;
    if (storageVersionValid && notify) {
        if (compareVersions(storageVersion, '1.7.0') < 0) win.innerHTML = `<div class="donut-features-div" style="padding:0 0 4px 0;font:italic 18px 'Open Sans';">Check out the new linesplit features below!</div>` + win.innerHTML;
        else if (compareVersions(storageVersion, '1.7.7') < 0) {
            win.innerHTML = `<div style="padding-bottom:12px;border-bottom:1px solid #b3b3b3;margin-bottom:12px;font-family:'Segoe UI', 'Open Sans', sans-serif;">
<div class="donut-features-div" style="padding:0 0 4px 0;">You can now select <strong>Team 2v2 [Extreme]</strong><br>as your default scrimmage gamemode.</div>
<div class="donut-features-div" style="padding:0 0 4px 0;">Your freeze mode (see Linesplit section below)<br>now applies to the <strong>Freeze Mouse</strong> keybind<br>you can set in Gota's Options menu.</div>
</div>` + win.innerHTML;
        }
    }
    blackout.appendChild(win);

    function resize() {
        if (blackout.style.display == 'block') {
            if (window.innerHeight < win.offsetHeight + 20) {
                win.style.top = '0';
                win.style.margin = '10px';
                win.style.transform = 'translate(-50%, 0%)';
            } else {
                win.style.top = '50%';
                win.style.margin = '0';
                win.style.transform = 'translate(-50%, -50%)';
            }
        }
    }
    window.addEventListener('resize', resize);

    function close() {
        blackout.style.display = 'none';
        win.style.display = 'block';
        reportWin.style.display = 'none';
    }

    document.addEventListener('click', function(e) {
        if (blackout.style.display == 'block'
            && e.target != win && !win.contains(e.target)
            && e.target != reportWin && !reportWin.contains(e.target)
        ) close();
    }, true);

    var footer = document.createElement('div');
    footer.style.marginTop = '12px';
    win.appendChild(footer);

    var done = leftButton.cloneNode();
    done.style.setProperty('border-radius', '10px 3px 3px 10px', 'important');
    done.innerText = 'Done';
    done.addEventListener('click', function() {
        blackout.style.display = 'none';
    });
    footer.appendChild(done);

    var reportBtn = rightButton.cloneNode();
    reportBtn.style.setProperty('border-radius', '3px 10px 10px 3px', 'important');
    reportBtn.innerText = 'Report bug';
    reportBtn.addEventListener('click', function() {
        win.style.display = 'none';
        reportWin.style.display = 'block';
    });
    footer.appendChild(reportBtn);

    var reportWin = win.cloneNode();
    reportWin.style.top = '50%';
    reportWin.style.display = 'none';
    reportWin.style.margin = '0';
    reportWin.style.width = '500px';
    reportWin.style.transform = 'translate(-50%, -50%)';
    reportWin.style.fontFamily = '"Segoe UI", "Open Sans", Arial, Helvetica, sans-serif';
    reportWin.innerHTML = `<p style="margin:0.12em 0 0.72em;">You will be redirected to a channel in Gota's official Discord server where you can report issues and bugs you come across in the game, including those caused by use of Gota.io Features by Donut.</p>
<p style="margin:0.72em 0 0;font-size:18px;font-weight:bold;">Please include the following sentence in your report:</p><pre style="margin-top:0.1em;user-select:text;">I am using Features by Donut version ${version}.</pre>`;
    blackout.appendChild(reportWin);

    var reportFooter = footer.cloneNode();
    reportWin.appendChild(reportFooter);

    var reportGoBack = leftButton.cloneNode();
    reportGoBack.innerText = 'Go Back';
    reportGoBack.addEventListener('click', function() {
        reportWin.style.display = 'none';
        win.style.display = 'block';
    });
    reportFooter.appendChild(reportGoBack);

    var reportContinue = rightButton.cloneNode();
    reportContinue.innerText = 'Continue';
    reportContinue.addEventListener('click', function() {
        window.open('https://discord.gg/QJknuQF', '_blank');
    });
    reportFooter.appendChild(reportContinue);

    var processedKeyCodes = {
        Escape: 'Esc',
        Minus: '-',
        Equal: '=',
        BracketLeft: '[',
        BracketRight: ']',
        Control: 'Ctrl',
        Semicolon: ';',
        Quote: "'",
        Backquote: '`',
        Backslash: '\\',
        Comma: ',',
        Period: '.',
        Slash: '/',
        NumpadMultiply: 'Numpad *',
        CapsLock: 'Caps Lock',
        ScrollLock: 'Scroll Lock',
        Numpad7: 'Numpad 7',
        Numpad8: 'Numpad 8',
        Numpad9: 'Numpad 9',
        NumpadSubtract: 'Numpad -',
        Numpad4: 'Numpad 4',
        Numpad5: 'Numpad 5',
        Numpad6: 'Numpad 6',
        NumpadAdd: 'Numpad +',
        Numpad1: 'Numpad 1',
        Numpad2: 'Numpad 2',
        Numpad3: 'Numpad 3',
        Numpad0: 'Numpad 0',
        NumpadDecimal: 'Numpad .',
        NumpadEqual: 'Numpad =',
        NumpadEnter: 'Enter',
        NumpadDivide: 'Numpad /',
        NumLock: 'Num Lock',
        ArrowUp: 'Arrow Up',
        PageUp: 'Page Up',
        ArrowLeft: 'Arrow Left',
        ArrowRight: 'Arrow Right',
        ArrowDown: 'Arrow Down',
        PageDown: 'Page Down',
        Meta: 'Win / \u2318',
        OS: 'Win / \u2318'
    };

    function processKeyCode(code) {
        if (code.indexOf('Arrow') && code.indexOf('Bracket')) code = code.replace(/Key|Digit|Left|Right/, '');
        if (code in processedKeyCodes) return processedKeyCodes[code];
        return code;
    }

    var defaultKeys = {
        skins: 'K',
        names: 'N',
        mass: 'M',
        food: 'F',
        chat: 'H',
        tripleSplit: null,
        hexaSplit: null,
        minimap: null,
        scorePanel: null,
        partyPanel: null,
        leaderboard: null,
        autoDecline: null,
        autoRespawn: null,
        freeze: 'S',
        freezeUp: null,
        freezeDown: null,
        freezeLeft: null,
        freezeRight: null,
        linesplit: null,
        leave: 'L',
        queue: null
    };

    var inputs = document.querySelectorAll('.donut-features-table input[type="text"][data-donut-feature]'), errorKeys = 'Gota.io Features by Donut: An error occurred. We had to reset your custom keys.';
    function fillInputs(keys) {
        for (var i = 0; i < inputs.length; i++) {
            var feature = inputs[i].dataset.donutFeature, key = keys[feature];
            if (typeof key == 'undefined' && feature in defaultKeys) {
                key = keys[feature] = defaultKeys[feature];
                localStorage['donut-keys'] = JSON.stringify(keys);
            }
            if (key === null) continue;
            inputs[i].value = key;
        }
    }

    function tryLocalStorage(index, defaultObj, func, error) {
        var obj; index = 'donut-' + index;
        try {
            if (!localStorage[index]) throw null;
            obj = JSON.parse(localStorage[index]);
            if (func) func(obj);
        } catch (e) {
            obj = JSON.parse(JSON.stringify(defaultObj));
            if (e && error) console.error(error);
            localStorage[index] = JSON.stringify(obj);
            if (func) func(obj);
        }
        return obj;
    }

    var keys = tryLocalStorage('keys', defaultKeys, fillInputs, errorKeys);

    function handleInputKeydown(e) {
        e.preventDefault();
        e.stopPropagation();
        var feature = this.dataset.donutFeature, code = processKeyCode(e.code);
        if (code && code != keys[feature] && code != 'Unidentified') {
            if (code == 'Delete') {
                this.value = '';
                keys[feature] = null;
            } else {
                for (var k in keys) {
                    if (keys[k] == code) {
                        keys[k] = null;
                        for (var l = 0; l < inputs.length; l++) {
                            if (inputs[l].dataset.donutFeature == k) {
                                inputs[l].value = '';
                                break;
                            }
                        }
                    }
                }
                this.value = keys[feature] = code;
            }
            localStorage['donut-keys'] = JSON.stringify(keys);
            this.blur();
        }
    }

    for (var j = 0; j < inputs.length; j++) {
        inputs[j].addEventListener('keydown', handleInputKeydown);
    }

    function selectOption(select) {
        var index = select.selectedIndex;
        select.selectedIndex = (index + (index == 1) + 1) % select.options.length;
        $(select).change();
    }

    function triggerCheckbox(checkbox) {
        $(checkbox).prop('checked', !$(checkbox).prop('checked')).change();
    }

    function triggerDonutCheckbox(checkbox) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change'));
    }

    function fadeOutMain() {
        if (gota.main.style.display == 'block') window.onkeydown({keyCode: 27, which: 27});
    }

    var alertWin = win.cloneNode();
    alertWin.style.top = '10px';
    alertWin.style.display = 'none';
    alertWin.style.lineHeight = '20px';
    alertWin.style.backgroundColor = 'rgba(42,42,42,.9)';
    alertWin.style.boxShadow = '0 2px 3px rgba(0,0,0,.25)';
    alertWin.style.transform = 'translate(-50%, 0%)';
    alertWin.style.zIndex = '3';
    document.body.appendChild(alertWin);

    var alertFadeOutTimer = 0;
    function Alert(html, timeout) {
        alertWin.innerHTML = html;
        $(alertWin).fadeIn(500);
        if (alertFadeOutTimer) clearTimeout(alertFadeOutTimer);
        alertFadeOutTimer = setTimeout(function() {
            $(alertWin).fadeOut(500);
            alertFadeOutTimer = 0;
        }, timeout);
    }

    var freezeKeys = {
        freeze: {
            id: 1,
            x: 0.5,
            y: 0.5
        },
        freezeUp: {
            id: 2,
            x: 0.5,
            y: 0
        },
        freezeDown: {
            id: 3,
            x: 0.5,
            y: 1
        },
        freezeLeft: {
            id: 4,
            x: 0,
            y: 0.5
        },
        freezeRight: {
            id: 5,
            x: 1,
            y: 0.5
        }
    };

    function findFreezeKey(code) {
        var found = Object.keys(freezeKeys).find(function(val) {
            return code == keys[val];
        });
        return found ? freezeKeys[found] : undefined;
    }

    var x = 0, y = 0, originalMousemove, freezeState = 0, freezeKeyDown = false;
    setTimeout(function delay() {
        if (window.onmousemove) {
            originalMousemove = window.onmousemove;
            window.onmousemove = function(e) {
                x = e.clientX; y = e.clientY;
                if (freezeState == 0) originalMousemove(e);
            };
        } else {
            setTimeout(delay, 200);
        }
    }, 200);

    function split(times = 1) {
        for (var i = 0; i < times; i++) {
            $(window).trigger($.Event('keydown', {keyCode: 32, which: 32}));
        }
    }

    function isModifier(e, code) {
        return (
            (code == 'Alt' && !e.ctrlKey && !e.metaKey && !e.shiftKey)
            || (code == 'Ctrl' && !e.altKey && !e.metaKey && !e.shiftKey)
            || (code == 'Win / \u2318' && !e.altKey && !e.ctrlKey && !e.shiftKey)
            || (code == 'Shift' && !e.altKey && !e.ctrlKey && !e.metaKey)
       );
    }

    window.addEventListener('keydown', function(e) {
        if (e.code == undefined) return;
        var code = processKeyCode(e.code), modifier = isModifier(e, code);
        if (modifier || !e.altKey && !e.ctrlKey && !e.metaKey) {
            if (!modifier) {
                var key = e.which || e.keyCode || 0;
                if (key == 13 && document.activeElement && document.activeElement.id == 'name-box') team2v2();
                else if (key == 27) {
                    if (!firstEscape) firstEscape = true;
                    if (alertWin.offsetHeight) $(alertWin).fadeOut(500);
                }
            }
            if ((modifier || !e.shiftKey) && document.activeElement.tagName != 'INPUT' && document.activeElement.tagName != 'TEXTAREA') {
                switch (code) {
                    case keys.skins:
                        selectOption(gota.sShowSkins);
                        break;
                    case keys.names:
                        selectOption(gota.sShowNames);
                        break;
                    case keys.mass:
                        triggerCheckbox(gota.cShowMass);
                        break;
                    case keys.food:
                        triggerCheckbox(gota.cHideFood);
                        break;
                    case keys.chat:
                        triggerCheckbox(gota.cHideChat);
                        break;
                    case keys.tripleSplit:
                        split(3);
                        break;
                    case keys.hexaSplit:
                        split(6);
                        break;
                    case keys.minimap:
                        triggerCheckbox(gota.cHideMinimap);
                        break;
                    case keys.scorePanel:
                        triggerDonutCheckbox(checkboxes.hideScorePanel);
                        break;
                    case keys.partyPanel:
                        triggerDonutCheckbox(checkboxes.hidePartyPanel);
                        break;
                    case keys.leaderboard:
                        triggerDonutCheckbox(checkboxes.hideLeaderboard);
                        break;
                    case keys.autoDecline:
                        triggerCheckbox(gota.cAutoDecline);
                        Alert('Auto Decline Party Invites: <strong>' + (gota.cAutoDecline.checked ? 'On' : 'Off') + '</strong>', 2500);
                        break;
                    case keys.autoRespawn:
                        var checkbox = done2v2 ? checkboxes.scrimmageAutoRespawn : gota.cAutoRespawn;
                        if (done2v2) triggerDonutCheckbox(checkbox);
                        else triggerCheckbox(checkbox);
                        Alert('Auto Respawn' + (done2v2 ? ' in Team Scrimmage' : '') + ': <strong>' + (checkbox.checked ? 'On' : 'Off') + '</strong>', 2500);
                        break;
                    case keys.linesplit:
                        split(3);
                        if (gota.main.style.display == 'none') {
                            gota.main.style.visibility = 'hidden';
                            gota.main.style.display = 'block';
                            setTimeout(function() {
                                gota.main.style.display = 'none';
                                gota.main.style.visibility = 'visible';
                            }, 1050);
                        }
                        break;
                    case keys.queue:
                        if (gota.scrimmageBtnLeave.style.display == 'block') $(gota.btnLeaveMatch).click();
                        else if (gota.mainScrimmage.style.display == 'block') $(gota.btnQueue).click();
                        fadeOutMain();
                        break;
                    case keys.leave:
                        if (switches.leaveExperimental || scrimmage) {
                            var hidden = gota.chatPanel.style.display == 'none';
                            if (hidden) {
                                gota.chatPanel.style.opacity = '0';
                                gota.chatPanel.style.display = 'block';
                            }
                            $(gota.chatInput).val('/leave').focus().trigger($.Event('keyup', {keyCode: 13, which: 13})).blur();
                            scrimmage = false;
                            if (hidden) {
                                gota.chatPanel.style.display = 'none';
                                gota.chatPanel.style.opacity = '1';
                            }
                            fadeOutMain();
                        }
                        break;
                    default:
                        if (originalMousemove) {
                            var freezeKey = findFreezeKey(code);
                            if (freezeKey) {
                                if (freezeState != freezeKey.id) {
                                    freezeState = freezeKey.id;
                                    freezeKeyDown = true;
                                    originalMousemove({
                                        clientX: window.innerWidth / 2,
                                        clientY: window.innerHeight / 2
                                    });
                                    setTimeout(function() {
                                        originalMousemove({
                                            clientX: window.innerWidth * freezeKey.x,
                                            clientY: window.innerHeight * freezeKey.y
                                        });
                                    }, 100);
                                } else if (options.freezeMode == 'toggle' && !freezeKeyDown) {
                                    freezeState = 0;
                                    originalMousemove({clientX: x, clientY: y});
                                }
                            }
                        }
                }
            }
        }
    });

    window.addEventListener('keyup', function(e) {
        if (e.code == undefined) return;
        var code = processKeyCode(e.code);
        if ((isModifier(e, code) || !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) && document.activeElement.tagName != 'INPUT' && document.activeElement.tagName != 'TEXTAREA') {
            if (originalMousemove) {
                if (options.freezeMode == 'hold') {
                    var freezeKey = findFreezeKey(code);
                    if (freezeKey && freezeState == freezeKey.id) {
                        freezeState = 0;
                        originalMousemove({clientX: x, clientY: y});
                    }
                } else {
                    freezeKeyDown = false;
                }
            }
        }
    });

    function isMouseFrozen() {
        return gota.scoreMouse.style.display == 'block';
    }

    var originalKeydown;
    setTimeout(function delay() {
        if (window.onkeydown) {
            originalKeydown = window.onkeydown;
            window.onkeydown = function(e) {
                try {
                    if (options.freezeMode == 'toggle' || !isMouseFrozen() || e.which != JSON.parse(localStorage.keybinds).kFreezeMouse) {
                        originalKeydown(e);
                    }
                } catch (err) {
                    originalKeydown(e);
                }
            };

            window.addEventListener('keyup', function(e) {
                 if (options.freezeMode == 'hold' && isMouseFrozen() && e.which == JSON.parse(localStorage.keybinds).kFreezeMouse) {
                     originalKeydown(e);
                 }
            });
        } else {
            setTimeout(delay, 200);
        }
    }, 200);

    var defaultSwitches = {
        hideScorePanel: false,
        hidePartyPanel: false,
        hideLeaderboard: false,
        scrimmageAutoRespawn: true,
        startWithScrimmage: false,
        leaveExperimental: false
    };

    var checkboxes = {};
    for (var feature in defaultSwitches) {
        checkboxes[feature] = document.getElementById('donut-' + feature);
    }

    var errorSwitches = 'Gota.io Features by Donut: An error occurred. We had to reset your settings.';
    function fillCheckboxes(switches) {
        for (var feature in checkboxes) {
            var Switch = switches[feature];
            if (typeof Switch == 'undefined') {
                Switch = switches[feature] = defaultSwitches[feature];
                localStorage['donut-switches'] = JSON.stringify(switches);
            }
            if (typeof Switch == 'boolean') checkboxes[feature].checked = Switch;
            else throw errorSwitches;
        }
    }

    var switches = tryLocalStorage('switches', defaultSwitches, fillCheckboxes, errorSwitches);

    var anchorObd = document.querySelector('.options-table>thead:nth-of-type(6)'), obd = anchorObd.cloneNode(true);
    obd.firstElementChild.firstElementChild.textContent = 'Options by Donut';
    anchorObd.parentNode.insertBefore(obd, anchorObd);

    var tbody = document.createElement('tbody');
    anchorObd.parentNode.insertBefore(tbody, anchorObd);

    function duplicateCheckbox(feature, text) {
        var td = document.createElement('td');
        td.colSpan = '4';
        td.style.position = 'relative';
        td.style.paddingRight = '22px';
        td.style.whiteSpace = 'normal';
        td.innerHTML = text;

        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox-options';
        checkbox.dataset.donutFeature = feature;
        checkbox.style.position = 'absolute';
        checkbox.style.top = '1px';
        checkbox.style.right = '1px';
        td.appendChild(checkbox);

        var tr = document.createElement('tr');
        tr.appendChild(td);
        tbody.appendChild(tr);

        checkbox.checked = switches[feature];
        return checkbox;
    }

    var duplicates = {};
    for (feature in defaultSwitches) {
        var bro = checkboxes[feature], text = bro.parentNode.innerText;
        if (feature == 'leaveExperimental') text = 'Use my <em>Leave a match</em> hotkey to leave my team in the other gamemodes';
        duplicates[feature] = duplicateCheckbox(feature, text);
    }

    function handleCheckboxChange(e) {
        var feature = this.dataset.donutFeature;
        switches[feature] = this.checked;
        localStorage['donut-switches'] = JSON.stringify(switches);
        checkboxes[feature].checked = duplicates[feature].checked = this.checked;
        switch (feature) {
            case 'hideScorePanel':
                if (this.checked) hideScorePanel();
                else {
                    gota.partyPanel.style.position = 'relative';
                    gota.partyPanel.style.top = '10px';
                    gota.scorePanel.style.opacity = '1';
                }
                break;
            case 'hidePartyPanel':
                visibility(gota.partyPanel, !this.checked);
                break;
            case 'hideLeaderboard':
                visibility(gota.leaderboardPanel, !this.checked);
                visibility(gota.extraPanel, !this.checked);
                break;
            case 'scrimmageAutoRespawn':
                if (this.checked && scrimmage) scrimRespawn();
        }
    }

    for (feature in checkboxes) {
        checkboxes[feature].addEventListener('change', handleCheckboxChange);
        duplicates[feature].addEventListener('change', handleCheckboxChange);
    }

    function hideScorePanel() {
        gota.scorePanel.style.opacity = '0';
        gota.partyPanel.style.position = 'absolute';
        gota.partyPanel.style.top = '0';
    }
    if (switches.hideScorePanel) hideScorePanel();

    function visibility(element, visible) {
        element.style.visibility = visible ? 'visible' : 'hidden';
    }
    if (switches.hideLeaderboard) {
        visibility(gota.leaderboardPanel, false);
        visibility(gota.extraPanel, false);
    }
    if (switches.hidePartyPanel) visibility(gota.partyPanel, false);

    var info = tryLocalStorage('info', {
        scrimmageModeAdjusted: storageVersionValid && compareVersions(storageVersion, '1.7.11') < 0 ? 0 : 1
    });

    function adjustScrimmageMode() {
        info.scrimmageModeAdjusted++;
        localStorage['donut-info'] = JSON.stringify(info);
    }

    var defaultOptions = {
        freezeMode: 'hold',
        scrimmageMode: '2'
    };

    var selects = [document.getElementById('donut-freezeMode'), document.getElementById('donut-scrimmageMode')];
    function fillSelects(options) {
        for (var i = 0; i < selects.length; i++) {
            var feature = selects[i].dataset.donutFeature, option = options[feature];
            var scrimmageModeAdjustRequired = feature == 'scrimmageMode' && info.scrimmageModeAdjusted === 0;
            if (scrimmageModeAdjustRequired) {
                info.scrimmageModeAdjusted++;
                localStorage['donut-info'] = JSON.stringify(info);
            }
            if (typeof option == 'undefined' && feature in defaultOptions) {
                scrimmageModeAdjustRequired = false;
                option = options[feature] = defaultOptions[feature];
                localStorage['donut-options'] = JSON.stringify(options);
            }
            if (scrimmageModeAdjustRequired && storageVersionValid && compareVersions(storageVersion, '1.7.11') < 0 && +option > 0) {
                option = options[feature] = +option - 1 + '';
                localStorage['donut-options'] = JSON.stringify(options);
            }
            var el = selects[i].querySelector('option[value="' + option + '"]');
            if (el) {
                selects[i].selectedIndex = el.index;
                selects[i].previousElementSibling.value = el.textContent;
            } else throw null;
        }
    }

    var options = tryLocalStorage('options', defaultOptions, fillSelects);

    for (var l = 0; l < selects.length; l++) {
        selects[l].addEventListener('change', function(e) {
            var feature = this.dataset.donutFeature;
            options[feature] = this.options[this.selectedIndex].value;
            localStorage['donut-options'] = JSON.stringify(options);
            this.previousElementSibling.value = this.options[this.selectedIndex].textContent;
        });
    }

    var scrimmage = false, respawnCheckInterval = 0, respawnTimer = 0;
    gota.btnQueue.addEventListener('click', function() {
        scrimmage = true;
        if (switches.scrimmageAutoRespawn) scrimRespawn();
    });

    function scrimmageFalse() {
        scrimmage = false;
        if (respawnTimer) {
            clearTimeout(respawnTimer);
            respawnTimer = respawnCheckInterval = 0;
        }
    }
    gota.btnLeaveMatch.addEventListener('click', scrimmageFalse);

    function scrimRespawn() {
        var cells = gota.playerCells, cellsNum = parseInt(cells.innerText, 10);
        if (respawnCheckInterval) clearInterval(respawnCheckInterval);
        respawnCheckInterval = setInterval(function() {
            if (switches.scrimmageAutoRespawn && scrimmage) {
                var temp = parseInt(cells.innerText, 10);
                if (temp != cellsNum) {
                    cellsNum = temp;
                    if (cellsNum === 0) {
                        if (gota.mainScrimmage.style.display == 'none') {
                            respawnTimer = setTimeout(function() {
                                if (switches.scrimmageAutoRespawn && scrimmage) {
                                    $(gota.btnPlay).click();
                                    respawnTimer = 0;
                                    scrimRespawn();
                                }
                            }, 10000);
                        }
                        clearInterval(respawnCheckInterval);
                        respawnCheckInterval = 0;
                    }
                }
            } else {
                clearInterval(respawnCheckInterval);
                respawnCheckInterval = 0;
            }
        }, 500);
    }

    var firstEscape = false;
    function startScrimmage() {
        var region = document.getElementsByClassName('server-active')[0].getAttribute('region');
            var id = region == 'eu' ? 's_Beta' : region == 'na' ? 's_Jet' : 's_Citrus';
            var interval = setInterval(function() {
                if (document.getElementsByClassName('server-selected').length) {
                    clearInterval(interval);
                    var server = document.getElementById(id);
                    if (!server) return;
                    $(server).click();
                    $(gota.btnPlay).click();
                    setTimeout(function() {
                        if (!firstEscape && !done2v2) Alert('It looks like the server is not responding.<br>You may want to press <strong>Esc</strong> to go back to the game menu.', 20000);
                    }, 5000);
                }
            }, 250);
    }
    if (switches.startWithScrimmage) startScrimmage();

    var scrimmageModeSet = false;
    function isTeamScrimmage() {
        var server = document.getElementsByClassName('server-selected')[0];
        return server && server.lastElementChild.textContent == 'Scrimmage';
    }

    var done2v2 = false, checkigTean2v2 = false;
    function team2v2() {
        if (!checkigTean2v2) {
            if (!isTeamScrimmage()) {
                scrimmageFalse();
                done2v2 = false;
            } else if (!done2v2) {
                checkigTean2v2 = true;
                var interval = setInterval(function() {
                    if (gota.mainScrimmage.style.display == 'block') {
                        if (!scrimmageModeSet) {
                            $(gota.scrimmageModeSelect).val(options.scrimmageMode).change();
                            scrimmageModeSet = true;
                        }
                        clearTimeout(timeout);
                        clearInterval(interval);
                        done2v2 = true;
                        checkigTean2v2 = false;
                        if (switches.startWithScrimmage && alertWin.offsetHeight) alertWin.style.display = 'none';
                    }
                }, 100), timeout = setTimeout(function() {
                    clearInterval(interval);
                    checkigTean2v2 = false;
                }, 25000);
            }
        }
    }

    gota.btnPlay.addEventListener('click', team2v2);
    gota.btnSpec.addEventListener('click', team2v2);
})();