// ==UserScript==
// @name             WME Edition Counter and Helper
// @name:es          WME Contador de Ediciones y Ayudante
// @description      It counts the edits and suggests a time for the next save.
// @description:es   Cuentas las ediciones y sugiere un tiempo para el próximo guardado.

// @author           Rodrigo_Reina
// @namespace        https://greasyfork.org/en/users/1192362-rodrigo-reina
// @version          2023.10.11.03
// @license          GNU GPLv3
// @icon             data:image/png;base64,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
// @contributionURL  https://ko-fi.com/wme_rodrigo_reina

// @include          /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @exclude          https://www.waze.com/user/*
// @exclude          https://www.waze.com/*/user/*
// @require          https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require          https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @connect          www.waze.com
// @connect          greasyfork.org
// @grant            GM_xmlhttpRequest
// @grant            GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/477217/WME%20Edition%20Counter%20and%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/477217/WME%20Edition%20Counter%20and%20Helper.meta.js
// ==/UserScript==

/* global W */
/* global toastr */
/* global WazeWrap */

/**
* ===============================================
*  This script is based on the following scripts:
*  - "Waze Edit Count Monitor" (by MapOMatic)
*  - "Waze WME Edition Helper" (by EdwardNavarro)
* ===============================================
*/

// TODO: 
// - Supporting languages

(function main() {
    'use strict';

    const SCRIPT_NAME = 'WME Edition Counter and Helper';
    const SCRIPT_VERSION = '2023.10.11.03';
    const DOWNLOAD_URL = 'https://greasyfork.org/scripts/40313-waze-edit-count-monitor/code/Waze%20Edit%20Count%20Monitor.user.js';

    function wmeECHInjected() {
        const TOOLTIP_TEXT = '<b>Ediciones Diarias</b><br><small>(Clic para ver el perfil)<small>';
        const TOASTR_URL = 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js';
        const VERSION = '2023.10.11.03';
        const DEBUG_LEVEL = 0;
        let _toastrSettings  = {
            timeBeforeSaving: 70,
            remindAtEditCount: 30,
            warnAtEditCount: 30,
            wasReminded: false,
            wasWarned: false
        };

        let _userName = '';
        let _lastTodayEditCount = 0;
        let _lastYesterdayEditCount = 0;
        let _lastDayBeforeEditCount = 0;
        let _savesWithoutIncrease = 0;
        let _totalSeconds = 0;
        let _timerInterval;

        let _buttonContainer,
            _buttonContentWrap,
            _buttonItemContainer,
            _buttonItemLink,
            _buttonItemContent,
            _progressBarWrap,
            _progressBarFill,
            _savedTimer;
        
        if (!localStorage.WMEEditionHelperScript) {
            let options = [null,_toastrSettings .timeBeforeSaving,_toastrSettings .remindAtEditCount,_toastrSettings .warnAtEditCount,false,false];
            localStorage.WMEEditionHelperScript = JSON.stringify(options);
        }

        function log(message, level, prefix = 'LOG', bgColor = 'darkslategrey', textColor = 'white') {
            if (message && level <= DEBUG_LEVEL) {
                console.log('%c%s%s', `background:${bgColor};color:${textColor};padding:5px 10px;`, `[${prefix}] WME Edition Counter And Helper >>`, message);
            }
        }

        function checkCounters() {
            window.postMessage(JSON.stringify(['wme_echGetCounts', _userName]), '*');
            _toastrSettings.wasReminded = false;
            _toastrSettings.wasWarned = false;
            toastr.remove();
        }

        function getChangedObjectCount() {
            let _count = 0;
            try{
                _count = parseInt($('#save-button > div.counter').text());
            }
            catch(err){
                // Do Nothing
            }
            return _count;
        }

        function updateEditCount(todayEditCount = 0, noIncrement) {
            let _textColor;
            let _bgColor;
            let _tooltipTextColor;
            
            if ($('#wme_ech').length === 0) {
                _buttonContainer = $('<div>', { id: 'wme_ech', style: 'border-radius: 15px;'});
                _buttonContentWrap = $('<div>', { class: 'toolbar-button' });
                _buttonItemLink = $('<a>', { href: 'https://www.waze.com/user/editor/' + _userName, target: '_blank', style:'text-decoration: none;', 'data-original-title': TOOLTIP_TEXT });
                _buttonItemContainer = $('<div>', { class: 'item-container' });
                _buttonItemContent = $('<div>', { style: 'margin: 7px; line-height: 1;' });

                _progressBarWrap = $('<div>', { style: 'width: 100%; height: 5px; background-color: #d7dadc;border: 1px solid #fff; box-sizing: border-box;' });
                _progressBarFill = $('<div>', { class: 'progress', style: 'width: 0%; height: 5px; animation-fill-mode: both; animation-name: progressBar; animation-duration:' + _toastrSettings.timeBeforeSaving + 's; animation-timing-function: linear;' });

                _savedTimer = $('<div>', { id: 'saved-timer', style: 'font-size:8px; line-height:1; text-align:right; color:darkgray;' });

                _buttonContainer.append(_buttonContentWrap);
                _buttonContentWrap.append(_buttonItemLink);
                _buttonItemLink.append(_buttonItemContainer);
                _buttonItemContainer.append(_buttonItemContent);

                _buttonItemContent.append(_progressBarWrap);
                _buttonItemContent.append(_savedTimer);
                _progressBarWrap.append(_progressBarFill);

                $('#toolbar > div > div.secondary-toolbar > div:nth-child(1)').after(_buttonContainer);

                _buttonItemLink.tooltip({
                    placement: 'auto top',
                    delay: { show: 100, hide: 100 },
                    html: true,
                    template: '<div class="tooltip" role="tooltip" style="opacity:0.95"><div class="tooltip-arrow"></div><div class="my-tooltip-header" style="display:block;"><b></b></div><div class="my-tooltip-body tooltip-inner" style="display:block;"></div></div>'
                });
            }

            if (_lastTodayEditCount !== todayEditCount) {
                _savesWithoutIncrease = 0;
            } else {
                if (!noIncrement) _savesWithoutIncrease += 1;
            }
            
            switch (_savesWithoutIncrease) {
                case 0:
                case 1:
                    _textColor = '#354148';
                    _bgColor = '';
                    _tooltipTextColor = 'white';
                    break;
                case 2:
                    _textColor = '#354148';
                    _bgColor = 'yellow';
                    _tooltipTextColor = 'black';
                    break;
                default:
                    _textColor = 'white';
                    _bgColor = 'red';
                    _tooltipTextColor = 'white';
            }

            _buttonContainer.css('background-color', _bgColor);
            _buttonItemContent.css('color', _textColor).html(`Ediciones: ${todayEditCount}`);
            _buttonItemContent.append(_progressBarWrap);
            _buttonItemContent.append(_savedTimer);

            let _daysCounterText = `<hr style="border:0 none; border-bottom:1px #999 solid; margin:5px 0;"/><div class="days-group"><div class="day-1"><h3>Hoy</h3><span>${todayEditCount}</span></div><div class="day-2"><h3>Ayer</h3><span>${_lastYesterdayEditCount}</span></div><div class="day-3"><h3>Antier</h3><span>${_lastDayBeforeEditCount}</span></div></div>`;
            let _warningText = (_savesWithoutIncrease > 0) ? `<div style="font-size:13px;border-radius:5px;padding:5px;margin-top:5px;color:${_tooltipTextColor};background-color:${_bgColor};"><b>${_savesWithoutIncrease}</b> salvadas/guardadas consecutivas sin incremento en el contador.<br><span style="font-weight:bold;font-size:16px;">¿Estás estrangulado?<span></div>` : '';
            _buttonItemLink.attr('data-original-title', TOOLTIP_TEXT + _daysCounterText + _warningText);

            _lastTodayEditCount = todayEditCount;
            _totalSeconds = 0;

            clearTimeout(_timerInterval);
            runTimer();
        }

        function runTimer(){
            _timerInterval = setInterval(setTime, 1000);
        }

        function setTime(){
            ++_totalSeconds;
            const hours = parseInt(_totalSeconds / 3600) % 24;
            const minutes = parseInt(_totalSeconds / 60) % 60;
            const seconds = _totalSeconds % 60;
            const timeString = `${(hours > 0) ? `${pad(hours)}:` : ''}${pad(minutes)}:${pad(seconds)}`;
            $('#saved-timer').html(timeString);
        }

        function pad(val) {
            const valString = val + '';
            return (valString.length < 2) ? '0' + valString : valString;
        }

        function receiveMessage(event) {
            let _msg;
            try {
                _msg = JSON.parse(event.data);
            } catch (err) {
                // Do nothing
            }

            if (_msg && _msg[0] === 'wme_echUpdateCounts') {
                const todayEditCount = _msg[1][0];
                const yesterdayEditCount = _msg[1][1];
                const dayBeforeEditCount = _msg[1][2];
                _lastYesterdayEditCount = yesterdayEditCount;
                _lastDayBeforeEditCount = dayBeforeEditCount;
                updateEditCount(todayEditCount);
            }
        }

        function errorHandler(callback) {
            try {
                callback();
            } catch (e) {
                console.error('%c%s%s', 'background:darkred;color:white;padding:5px 10px;', '[ERROR] WME Edition Counter And Helper >>', e);
            }
        }

        function checkChangedObjectCount() {
            let objectEditCount = getChangedObjectCount();
            
            if (objectEditCount >= _toastrSettings.warnAtEditCount && !_toastrSettings.wasWarned) {
                toastr.remove();
                toastr.error('<span style="font-size:16px;">Has editado al menos <b>' + _toastrSettings.warnAtEditCount + '</b> objetos.</span><br><br> Deberías considerar guardar pronto. Si obtienes un error al guardar, necesitarás deshacer algunos cambios/acciones e intentar nuevamente.', 'WME Edition Counter And Helper:', {timeOut: 25000});
                _toastrSettings.wasWarned = true;
                //log('WARMED', 0, 'ALERT', 'tomato')
            } else if (objectEditCount >= _toastrSettings.remindAtEditCount && !_toastrSettings.wasReminded) {
                toastr.remove();
                toastr.warning('<span style="font-size:16px;">Has editado al menos <b>' + _toastrSettings.remindAtEditCount + '</b> objetos.</span><br><br> Deberías considerar guardar pronto.', 'WME Edition Counter And Helper:', {timeOut: 15000});
                _toastrSettings.wasReminded = true;
                //log('REMINDED', 0, 'ALERT', 'orange')
            } else if (objectEditCount < _toastrSettings.remindAtEditCount) {
                _toastrSettings.wasWarned = false;
                _toastrSettings.wasReminded = false;
                toastr.remove();
                //log('REMOVED', 0, 'ALERT', 'sienna')
            }
        }

        /* helper functions */
        function getElementsByClassName(classname, node) {
            if(!node) node = document.getElementsByTagName("body")[0];
            let a = [];
            let re = new RegExp('\\b' + classname + '\\b');
            let els = node.getElementsByTagName("*");
            for (let i=0, j=els.length; i<j; i++) {
                if (re.test(els[i].className)) a.push(els[i]);
            }
            return a;
        }

        function getId(node) {
            return document.getElementById(node);
        }

        function updateAddonSettings(event) {
            _toastrSettings.timeBeforeSaving = getId('_ehSavingWaitTime').value;
            _toastrSettings.remindAtEditCount = getId('_ehRememberAfter').value;
            _toastrSettings.warnAtEditCount = getId('_ehAlertAfter').value;

            $('.progress').css('animation-duration', `${getId('_ehSavingWaitTime').value}s`);
        }

        async function init() {
            _userName = W.loginManager.user.getUsername();

            window.addEventListener('message', receiveMessage);

            // restore saved settings
            if (localStorage.WMEEditionHelperScript) {
                let options = JSON.parse(localStorage.WMEEditionHelperScript);

                _toastrSettings.timeBeforeSaving = options[1];
                _toastrSettings.remindAtEditCount = options[2];
                _toastrSettings.warnAtEditCount = options[3];
            }

            // check if sidebar is hidden
            let sidebar = getId('sidebar');
            if (sidebar.style.display == 'none') {
                log("Not logged in yet - will initialise at login", 0, 'WARN', 'orange');
                W.loginManager.events.register("login", null, init);
                return;
            }

            // check that user-info section is defined
            let userTabs = getId('user-info');
            if (userTabs === null) {
                log("Editor not initialised yet - trying again in a bit...", 0, 'WARN', 'orange');
                setTimeout(init, 789);
                return;
            }

            $('head').append(
                $('<link/>', {
                    rel: 'stylesheet',
                    type: 'text/css',
                    href: 'https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.css'
                }),
                $('<style type="text/css">'
                  + '#toast-container {position: absolute;} '
                  + '#toast-container > div {opacity: 0.95;} '
                  + '.toast-top-center {top: 30px;} '
                  + '#wme_ech { display:flex; } '
                  + '.toolbar .toolbar-icon-eh { color: #484848; font-size: 24px; margin: 8px 0; position: relative; text-align: center; width: 24px; } '
                  + '.progress { background-color: red; animation-fill-mode:both; } '
                  + '@keyframes progressBar { 0% { width: 0; } 99% { background-color: red; } 100% { width: 100%; background-color: green; } } '
                  + '.days-group { width:100%; display:flex; justify-content:space-between; align-item:center; } '
                  + '.days-group div { width:30%; padding:5px; background-color:darkgray; color:white; display:flex; flex-direction:column; align-item:center; border-radius:5px; } '
                  + '.days-group div h3 { font-size:12px; font-weight:bold; line-height:1; margin:5px 0; } '
                  + '.days-group div span { font-size:14px; font-weight:bold; } '
                  + '.days-group .day-1 { background-color:#22577a; } '
                  + '.days-group .day-2 { background-color:#38a3a5; } '
                  + '.days-group .day-3 { background-color:#57cc99; } '
                  + '</style>')
            );
            await $.getScript(TOASTR_URL);

            toastr.options = {
                target: '#map',
                timeOut: 9999999999,
                positionClass: 'toast-top-right',
                closeOnHover: false,
                closeDuration: 0,
                showDuration: 0,
                closeButton: true
            };

            W.model.actionManager.events.register('afterclearactions', null, () => errorHandler(checkCounters));
            W.model.actionManager.events.register('afteraction', null, () => errorHandler(checkChangedObjectCount));
            W.model.actionManager.events.register('afterundoaction', null, () => errorHandler(checkChangedObjectCount));
        
            checkCounters();
            toastr.success('Inicializado!', 'WME Edition Counter And Helper', {timeOut: 1500});
            log('Initialized!', 0, 'SUCCESS', 'green');
            //toastr.warning('<span style="font-size:16px;">Has editado al menos <b>' + _toastrSettings.remindAtEditCount + '</b> objetos.</span><br><br> Deberías considerar guardar pronto.', 'WME Edition Counter And Helper:', {timeOut: 1000});
            
            // add new box to left of the map
            let navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
            let tabContent = getElementsByClassName('tab-content', userTabs)[0];
            let addon = document.createElement('section');
            addon.id = "edition-helper-addon";

            // advanced options
            let section = document.createElement('p');
            section.style.paddingTop = "0px";
            section.className = 'checkbox';
            section.id = 'advancedOptions';
            section.innerHTML = '<h4><span class="fa fa-pencil" title="WME Edition Counter And Helper"></span> WME Edition Counter And Helper</h4><div style="margin:5px 0 10px 0;"><b>Configuración</b></div>'
                + '<label for="_ehSavingWaitTime">Tiempo de espera para guardar</label><br>'
                + '<input type="number" min="1" max="3600" size="4" id="_ehSavingWaitTime" style="margin: 0 0 20px 0" /> segundos'
                + '<br>'
                + '<label for="_ehRememberAfter">Recomendar guardar despues de</label><br>'
                + '<input type="number" min="1" max="5000" size="4" id="_ehRememberAfter" style="margin: 0 0 20px 0" /> cambios'
                + '<br>'
                + '<label for="_ehAlertAfter">Alertar guardar despues de</label><br>'
                + '<input type="number" min="1" max="5000" size="4" id="_ehAlertAfter" style="margin: 0 0 20px 0" /> cambios'
            ;
            addon.appendChild(section);

            // Addon legal and credits
            addon.innerHTML += '<hr style="border:0 none; border-bottom:1px #ccc solid;">'
                + '<small><b><a href="https://greasyfork.org/en/scripts/434355-wme-edition-helper" target="_blank"><u>'
                + 'WME Edition Counter And Helper</u></a></b> &nbsp; v' + VERSION + '</small>';

            // Add tab button and panel content
            let newtab = document.createElement('li');
            newtab.innerHTML = '<a href="#sidepanel-edition-helper" data-toggle="tab"><span class="fa fa-pencil" title="WME Edition Counter And Helper"></span> WME ECH</a>';
            navTabs.appendChild(newtab);

            addon.id = "sidepanel-edition-helper";
            addon.className = "tab-pane";
            tabContent.appendChild(addon);

            getId('_ehSavingWaitTime').onchange = updateAddonSettings;
            getId('_ehRememberAfter').onchange = updateAddonSettings;
            getId('_ehAlertAfter').onchange = updateAddonSettings;

            // restore saved settings
            if (localStorage.WMEEditionHelperScript) {
                let options = JSON.parse(localStorage.WMEEditionHelperScript);

                getId('_ehSavingWaitTime').value = options[1];
                getId('_ehRememberAfter').value = options[2];
                getId('_ehAlertAfter').value = options[3];
            }

            // overload the WME exit function
            const saveEditionHelperOptions = function() {
                if (localStorage) {
                    let options = [];

                    // preserve previous options which may get lost after logout
                    if (localStorage.WMEEditionHelperScript) {
                        options = JSON.parse(localStorage.WMEEditionHelperScript);
                    }

                    options[1] = getId('_ehSavingWaitTime').value;
                    options[2] = getId('_ehRememberAfter').value;
                    options[3] = getId('_ehAlertAfter').value;

                    localStorage.WMEEditionHelperScript = JSON.stringify(options);
                }
            }

            window.addEventListener("beforeunload", saveEditionHelperOptions, false);
        }

        function bootstrap() {
            if (W && W.loginManager && W.loginManager.events && W.loginManager.events.register && W.map && W.loginManager.user) {
                log('Initializing...');
                init();
            } else {
                log('Bootstrap failed. Trying again...');
                setTimeout(bootstrap, 1000);
            }
        }

        bootstrap();
    }

    function getEditCountFromProfile(profile) {
        const { editingActivity } = profile;
        return editingActivity[editingActivity.length - 1];
    }

    function getEditCountByDayFromProfile(profile, day) {
        const { editingActivity } = profile;
        return editingActivity[editingActivity.length-day];
    }

    function receivePageMessage(event) {
        let _msg;
        try {
            _msg = JSON.parse(event.data);
        } catch (err) {
            // Do Nothing
        }

        if (_msg && _msg[0] === 'wme_echGetCounts') {
            const userName = _msg[1];
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://www.waze.com/Descartes/app/UserProfile/Profile?username=${userName}`,
                onload: res => {
                    const profile = JSON.parse(res.responseText);
                    window.postMessage(JSON.stringify(['wme_echUpdateCounts', [
                        getEditCountFromProfile(profile),
                        getEditCountByDayFromProfile(profile, 2),
                        getEditCountByDayFromProfile(profile, 3)
                    ]]), '*');
                }
            });
        }
    }

    function waitForWazeWrap() {
        return new Promise(resolve => {
            function loopCheck(tries = 0) {
                if (WazeWrap.Ready) {
                    resolve();
                } else if (tries < 1000) {
                    setTimeout(loopCheck, 200, ++tries);
                }
            }
            loopCheck();
        });
    }

    function injectScript() {
        GM_addElement('script', {
            textContent: `${wmeECHInjected.toString()} \nwmeECHInjected();`
        });

        window.addEventListener('message', receivePageMessage);
    }

    async function loadScriptUpdateMonitor() {
        let updateMonitor;
        await waitForWazeWrap();
        try {
            updateMonitor = new WazeWrap.Alerts.ScriptUpdateMonitor(SCRIPT_NAME, SCRIPT_VERSION, DOWNLOAD_URL, GM_xmlhttpRequest);
            updateMonitor.start();
        } catch (ex) {
            console.error(`${SCRIPT_NAME}:`, ex);
        }
    }

    function startFunction() {
        injectScript();
        loadScriptUpdateMonitor();
    }

    startFunction();
})();
