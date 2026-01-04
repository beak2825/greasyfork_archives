// ==UserScript==
// @name             WME Edition Helper
// @name:es          WME Ayudante de edición
// @description      Monitor editions count and shows a timer for next suggested save action
// @description:es   Monitorea el contador de ediciones y muestra un temporizador para la siguiente acción de guardado sugerida

// @author           EdwardNavarro
// @namespace        https://greasyfork.org/en/users/670818-edward-navarro
// @version          2022.11.22.01
// @license          GNU GPLv3

// @include          /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @exclude          https://www.waze.com/user/*
// @exclude          https://www.waze.com/*/user/*
// @require          https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @icon             https://www.edwardnavarro.com/cdn/wme/wme_eh_icon_32x32.svg
// @connect          www.waze.com
// @grant            GM_xmlhttpRequest
// @grant            GM_addElement

// @contributionURL  https://github.com/WazeDev/Thank-The-Authors
// @downloadURL https://update.greasyfork.org/scripts/434355/WME%20Edition%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/434355/WME%20Edition%20Helper.meta.js
// ==/UserScript==

/* global W */
/* global toastr */
/* global $ */

/**
* ===============================================
*  This script is based on the following scripts:
*  - "Waze Edit Count Monitor" (by MapOMatic)
*  - "Waze Edit & UR Count Monitor" (by Crotalo)
* ===============================================
*/

// This function is injected into the page to allow it to run in the page's context.
function wmeEH_Injected() {
    'use strict';

    const addonVersion = '2021.10.28.03';

    let _toastr_settings = {
        timeBeforeSaving: 70,
        remindAtEditCount: 30,
        warnAtEditCount: 45,
        wasReminded: false,
        wasWarned: false
    };

    let debugLevel = 0;
    let userName = '';
    let lastTodayEditCount = 0;
    let lastYesterdayEditCount = 0;
    let lastDayBeforeEditCount = 0;
    let savesWithoutIncrease = 0;
    let showURs, showMPs;
    let totalSeconds = 0;
    let button_container, button_content_wrap, button_item_container, button_item_icon, button_item_link, button_item_content, progress_bar_wrap, progress_bar_fill, saved_timer, timer_interval;
    let tooltipText = '<b>Ediciones Diarias</b><br><small>(Clic para ver el perfil)<small>';

    // load default addon settings
    if (!localStorage.WMEEditionHelperScript) {
        let options = [null,_toastr_settings.timeBeforeSaving,_toastr_settings.remindAtEditCount,_toastr_settings.warnAtEditCount,false,false];
        localStorage.WMEEditionHelperScript = JSON.stringify(options);
    }

    function log(message, level, prefix = 'LOG', bgColor = 'darkslategrey', textColor = 'white') {
        if (message && level <= debugLevel) {
            console.log('%c%s%s', `background:${bgColor};color:${textColor};padding:5px 10px;`, `[${prefix}] WME Edition Helper >>`, message);
        }
    }

    function checkEditCount() {
        window.postMessage(JSON.stringify(['wmeEHGetCounts',userName]),'*');
        _toastr_settings.wasReminded = false;
        _toastr_settings.wasWarned = false;
        toastr.remove();
    }

    function getChangedObjectCount() {
        let count = W.changesLogController._changesLogViewModel.attributes.actionsCount;
        return count;
    }

    function pad(val) {
        let valString = val + "";
        if (valString.length < 2) {
            return "0" + valString;
        } else {
            return valString;
        }
    }

    function setTime() {
        ++totalSeconds;
        let hours = parseInt(totalSeconds / 60 / 60) % 60;
        $('#saved-timer').html(`${(hours > 0) ? `${hours}:` : ''}${pad(parseInt(totalSeconds / 60) % 60)}:${pad(totalSeconds % 60)}`);
    }

    function runTimer() {
        timer_interval = setInterval(setTime, 1000);
    }

    function updateEditCount(todayEditCount = 0, yesterdayEditCount = 0, dayBeforeEditCount = 0, noIncrement) {
        let textColor;
        let bgColor;
        let tooltipTextColor;

        // Add the counter div if it doesn't exist.
        if ($('#eh-button').length === 0) {
            button_container = $('<div>', { id: 'eh-button' });
            button_content_wrap = $('<div>', { class: 'toolbar-button toolbar-button-with-icon' });
            button_item_link = $('<a>', { href: 'https://www.waze.com/user/editor/' + userName.toLowerCase(), target: '_blank', style:'text-decoration: none;', 'data-original-title': tooltipText });
            button_item_container = $('<div>', { class: 'item-container' });
            button_item_icon = $('<div>', { class: 'toolbar-icon-eh w-icon w-icon-pencil' });
            button_item_content = $('<div>', { style: 'margin:5px 0 0 5px; line-height: 1;' });

            progress_bar_wrap = $('<div>', { style: 'width: 100%; height: 5px; background-color: #d7dadc; border:1px #fff solid; box-sizing: content-box;' });
            progress_bar_fill = $('<div>', { class: 'progress', style: 'width: 0%; height: 5px; animation-fill-mode: both; animation-name: progressBar; animation-duration:' + _toastr_settings.timeBeforeSaving + 's; animation-timing-function: ease-in-out;' });

            saved_timer = $('<div>', { id: 'saved-timer', style: 'font-size:8px; line-height:1; text-align:right; color:darkgray;' });

            button_container.append(button_content_wrap);
            button_content_wrap.append(button_item_link);
            button_item_link.append(button_item_container);
            button_item_container.append(button_item_icon);
            button_item_container.append(button_item_content);

            button_item_content.append(progress_bar_wrap);
            button_item_content.append(saved_timer);
            progress_bar_wrap.append(progress_bar_fill);

            $('#edit-buttons').prepend(button_container);

            button_item_link.tooltip({
                placement: 'auto top',
                delay: { show: 100, hide: 100 },
                html: true,
                template: '<div class="tooltip" role="tooltip" style="opacity:0.95"><div class="tooltip-arrow"></div><div class="my-tooltip-header" style="display:block;"><b></b></div><div class="my-tooltip-body tooltip-inner" style="display:block;"></div></div>'
            });
        }

        log(`EDIT COUNTS -> Today: ${todayEditCount}, Yesterday: ${yesterdayEditCount}, Day before: ${dayBeforeEditCount}`, 1, 'INFO', 'purple');

        if (lastTodayEditCount !== todayEditCount) {
            savesWithoutIncrease = 0;
        } else {
            if (!noIncrement) savesWithoutIncrease += 1;
        }

        switch (savesWithoutIncrease) {
            case 0:
            case 1:
                textColor = '#354148';
                bgColor = '';
                tooltipTextColor = 'white';
                break;
            case 2:
                textColor = '#354148';
                bgColor = 'yellow';
                tooltipTextColor = 'black';
                break;
            default:
                textColor = 'white';
                bgColor = 'red';
                tooltipTextColor = 'white';
        }

        button_container.css('background-color', bgColor);
        button_item_icon.css('color', textColor);
        button_item_content.css('color', textColor).html(`Ediciones: ${todayEditCount}`);
        button_item_content.append(progress_bar_wrap);
        button_item_content.append(saved_timer);

        let dayBeforeEditCountText = `<hr style="border:0 none; border-bottom:1px #999 solid; margin:5px 0;"/><div class="days-group"><div class="day-1"><h3>Hoy</h3><span>${todayEditCount}</span></div><div class="day-2"><h3>Ayer</h3><span>${yesterdayEditCount}</span></div><div class="day-3"><h3>Antier</h3><span>${dayBeforeEditCount}</span></div></div>`;
        let warningText = (savesWithoutIncrease > 0) ? `<div style="font-size:13px;border-radius:5px;padding:5px;margin-top:5px;color:${tooltipTextColor};background-color:${bgColor};"><b>${savesWithoutIncrease}</b> salvadas/guardadas consecutivas sin incremento en el contador.<br><span style="font-weight:bold;font-size:16px;">¿Estás estrangulado?<br>🤔👀<span></div>` : '';
        button_item_link.attr('data-original-title', tooltipText + dayBeforeEditCountText + warningText);

        lastTodayEditCount = todayEditCount;
        lastYesterdayEditCount = yesterdayEditCount;
        lastDayBeforeEditCount = dayBeforeEditCount;
        totalSeconds = 0;

        clearTimeout(timer_interval);
        runTimer();
    }

    function receiveMessage(event) {
        let msg;

        try {
            msg = JSON.parse(event.data);
        } catch (err) {
            // Do nothing
        }

        if (msg && msg[0] === 'wmeEHUpdateUi') {
            let todayEditCount = msg[1][0];
            let yesterdayEditCount = msg[1][1];
            let dayBeforeEditCount = msg[1][2];
            updateEditCount(todayEditCount, yesterdayEditCount, dayBeforeEditCount);
        }
    }

    function checkChangedObjectCount() {
        let objectEditCount = getChangedObjectCount();

        if (objectEditCount >= _toastr_settings.warnAtEditCount && !_toastr_settings.wasWarned) {
            toastr.remove();
            toastr.error('<span style="font-size:16px;">Has editado al menos <b>' + _toastr_settings.warnAtEditCount + '</b> objetos.</span><br><br> Deberías considerar guardar pronto. Si obtienes un error al guardar, necesitarás deshacer algunos cambios/acciones e intentar nuevamente.', 'Edition Helper:', {timeOut: 25000});
            _toastr_settings.wasWarned = true;
            //log('WARMED', 0, 'ALERT', 'tomato')
        } else if (objectEditCount >= _toastr_settings.remindAtEditCount && !_toastr_settings.wasReminded) {
            toastr.remove();
            toastr.warning('<span style="font-size:16px;">Has editado al menos <b>' + _toastr_settings.remindAtEditCount + '</b> objetos.</span><br><br> Deberías considerar guardar pronto.', 'Edition Helper:', {timeOut: 15000});
            _toastr_settings.wasReminded = true;
            //log('REMINDED', 0, 'ALERT', 'orange')
        } else if (objectEditCount < _toastr_settings.remindAtEditCount) {
            _toastr_settings.wasWarned = false;
            _toastr_settings.wasReminded = false;
            toastr.remove();
            //log('REMOVED', 0, 'ALERT', 'sienna')
        }
    }

    function errorHandler(callback) {
        try {
            callback();
        } catch (e) {
            console.error('%c%s%s', 'background:darkred;color:white;padding:5px 10px;', '[ERROR] WME Edition Helper >>', e);
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
        _toastr_settings.timeBeforeSaving = getId('_ehSavingWaitTime').value;
        _toastr_settings.remindAtEditCount = getId('_ehRememberAfter').value;
        _toastr_settings.warnAtEditCount = getId('_ehAlertAfter').value;
        showURs = getId('_ehShowURs').checked;
        showMPs = getId('_ehShowMPs').checked;

        $('.progress').css('animation-duration', `${getId('_ehSavingWaitTime').value}s`);
    }

    function init() {
        userName = W.loginManager.user.userName;
        window.addEventListener('message', receiveMessage);

        // restore saved settings
        if (localStorage.WMEEditionHelperScript) {
            let options = JSON.parse(localStorage.WMEEditionHelperScript);

            _toastr_settings.timeBeforeSaving = options[1];
            _toastr_settings.remindAtEditCount = options[2];
            _toastr_settings.warnAtEditCount = options[3];
            showURs = options[4];
            showMPs = options[5];
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

        // add styleshets and styles to head section
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
              + '#edit-buttons #eh-button { display:flex; } '
              + '.toolbar .toolbar-icon-eh { color: #484848; font-size: 24px; margin: 8px 0; position: relative; text-align: center; width: 24px; } '
              + '.progress { background-color: red; animation-fill-mode:both; } '
              + '@keyframes progressBar { 0% { width: 0; } 99% { background-color: red; } 100% { width: 100%; background-color: green; } } '
              + '.days-group { width:100%; display:flex; justify-content:space-between; align-item:center; } '
              + '.days-group div { width:30%; padding:5px; background-color:darkgray; color:white; display:flex; flex-direction:column; align-item:center; border-radius:5px; } '
              + '.days-group div h3 { font-size:12px; font-weight:bold; line-height:1; margin:5px 0; } '
              + '.days-group div span { font-size:14px; font-weight:bold; } '
              + '.days-group .day-1 { background-color:darkcyan; } '
              + '.days-group .day-2 { background-color:darkgreen; } '
              + '.days-group .day-3 { background-color:darkolivegreen; } '
              + '</style>')
        );

        // add js libraries and register events
        $.getScript('https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js', function() {
            toastr.options = {
                target:'#map',
                showDuration: 300,
                hideDuration: 1000,
                timeOut: 10000,
                extendedTimeOut: 1000,
                positionClass: 'toast-top-right',
                closeOnHover: false,
                closeButton: true,
                newestOnTop: true,
                progressBar: true,
                showEasing: 'swing',
                hideEasing: 'linear',
                showMethod: 'fadeIn',
                hideMethod: 'fadeOut',
            };

            W.model.actionManager.events.register('afterclearactions', null, () => errorHandler(checkEditCount));
            W.model.actionManager.events.register('afteraction', null, () => errorHandler(checkChangedObjectCount));
            W.model.actionManager.events.register('afterundoaction', null, () => errorHandler(checkChangedObjectCount));

            // Update the edit count first time.
            checkEditCount();
            toastr.success("Edition Helper Inicializado!");
            log('Initialized!', 0, 'SUCCESS', 'green');
        });

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
        section.innerHTML = '<h4><span class="fa fa-pencil" title="Edition Helper"></span> Edition Helper</h4><div style="margin:5px 0 10px 0;"><b>Configuración</b></div>'
            + '<label for="_ehSavingWaitTime">Tiempo de espera para guardar</label><br>'
            + '<input type="number" min="1" max="3600" size="4" id="_ehSavingWaitTime" style="margin: 0 0 20px 0" /> segundos'
            + '<br>'
            + '<label for="_ehRememberAfter">Recomendar guardar despues de</label><br>'
            + '<input type="number" min="1" max="5000" size="4" id="_ehRememberAfter" style="margin: 0 0 20px 0" /> cambios'
            + '<br>'
            + '<label for="_ehAlertAfter">Alertar guardar despues de</label><br>'
            + '<input type="number" min="1" max="5000" size="4" id="_ehAlertAfter" style="margin: 0 0 20px 0" /> cambios'
            + '<br>'
            + '<label><input type="checkbox" id="_ehShowURs" /> Mostrar UR\'s gestionadas</label><br>'
            + '<label><input type="checkbox" id="_ehShowMPs" /> Mostrar MP\'s gestionadas</label><br>'
        ;
        addon.appendChild(section);

        // Addon legal and credits
        addon.innerHTML += '<hr style="border:0 none; border-bottom:1px #ccc solid;">'
            + '<small><b><a href="https://greasyfork.org/en/scripts/434355-wme-edition-helper" target="_blank"><u>'
            + 'WME Edition Helper</u></a></b> &nbsp; v' + addonVersion + '</small>';

        // Add tab button and panel content
        let newtab = document.createElement('li');
        newtab.innerHTML = '<a href="#sidepanel-edition-helper" data-toggle="tab"><span class="fa fa-pencil" title="Edition Helper"></span> EH</a>';
        navTabs.appendChild(newtab);

        addon.id = "sidepanel-edition-helper";
        addon.className = "tab-pane";
        tabContent.appendChild(addon);

        getId('_ehSavingWaitTime').onchange = updateAddonSettings;
        getId('_ehRememberAfter').onchange = updateAddonSettings;
        getId('_ehAlertAfter').onchange = updateAddonSettings;
        getId('_ehShowURs').onclick = updateAddonSettings;
        getId('_ehShowMPs').onclick = updateAddonSettings;

        // restore saved settings
        if (localStorage.WMEEditionHelperScript) {
            let options = JSON.parse(localStorage.WMEEditionHelperScript);

            getId('_ehSavingWaitTime').value = options[1];
            getId('_ehRememberAfter').value = options[2];
            getId('_ehAlertAfter').value = options[3];
            getId('_ehShowURs').checked = options[4];
            getId('_ehShowMPs').checked = options[5];
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
                options[4] = getId('_ehShowURs').checked;
                options[5] = getId('_ehShowMPs').checked;

                localStorage.WMEEditionHelperScript = JSON.stringify(options);
            }
        }
        window.addEventListener("beforeunload", saveEditionHelperOptions, false);
    }

    function bootstrap() {
        if (W &&
            W.loginManager &&
            W.loginManager.events &&
            W.loginManager.events.register &&
            W.map &&
            W.loginManager.user) {
            log('Initializing...', 0);
            init();
        } else {
            log('Bootstrap failed. Trying again...', 0, 'ERROR', 'darkred');
            window.setTimeout(function () {
                bootstrap();
            }, 1000);
        }
    }

    bootstrap();
}


// Code that is NOT injected into the page.
// Note that jQuery may or may not be available, so don't rely on it in this part of the script.
(function(){
    'use strict';

    function getEditorProfileFromSource(source) {
        let match = source.match(/gon.data=({.*?});gon.env=/i);
        return JSON.parse(match[1]);
    }

    function getEditCountFromProfile(profile) {
        let editingActivity = profile.editingActivity;
        return editingActivity[editingActivity.length-1];
    }

    function getEditCountByTypeFromProfile(profile, type) {
        let edits = profile.editsByType.find(edits => edits.key === type);
        return edits ? edits.value : -1;
    }

    function getEditCountByDayFromProfile(profile, day) {
        let editingActivity = profile.editingActivity;
        return editingActivity[editingActivity.length-day];
    }

    // Handle messages from the page.
    function receiveMessage(event) {
        let msg;

        try {
            msg = JSON.parse(event.data);
        }
        catch (err) {
            // Ignore errors
        }

        if (msg && msg[0] === 'wmeEHGetCounts') {
            let userName = msg[1];
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://www.waze.com/user/editor/${userName}`,
                onload: function(res) {
                    let profile = getEditorProfileFromSource(res.responseText);
                    window.postMessage(JSON.stringify(['wmeEHUpdateUi',[getEditCountFromProfile(profile), getEditCountByDayFromProfile(profile,2), getEditCountByDayFromProfile(profile,3)]]),'*');
                }
            });
        }
    }

    let wmeEH_Injected_script = GM_addElement('script', {
        textContent: "" + wmeEH_Injected.toString() + " \n wmeEH_Injected();"
    });

    // Listen for events coming from the page script.
    window.addEventListener('message', receiveMessage);
})();
