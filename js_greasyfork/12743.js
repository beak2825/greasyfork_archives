// ==UserScript==
// @name        HWM_Def_Notifier
// @namespace   Рианти
// @description Система уведомлений о защитах
// @include     http://www.heroeswm.ru/*
// @version     1
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_openInTab
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/12743/HWM_Def_Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/12743/HWM_Def_Notifier.meta.js
// ==/UserScript==

// <b><center><font color="red">Вы уже в заявке, ожидайте начала битвы!</font></center></b>
try {
    var _notificationSound = 'http://hwm.mcdir.ru/sounds/and-a-happy-new-year-sms.mp3';

    var _updateInterval = 1000 * 60 * 1;
    var _defPage = 'http://www.heroeswm.ru/mapwars.php';
    var _defaultSettingRows = 2;
    var _defaultSettingRows2 = 4;
    var _defaultSettings = '{"dn_timeUntilDef0":"15","dn_playersEnrolled0":"0","dn_totalRows0":"0","dn_percLost0":"0","dn_uncloosed0":"0","dn_timeUntilDef1":"5","dn_playersEnrolled1":"0","dn_totalRows1":"0","dn_percLost1":"0","dn_uncloosed1":"0","dn_notify_interval":"600000","dn_rule_modifier":"false","dn_sound_alert":"true"}';
    var _defaultSettings2 = '{"dn_timeUntilDef0":"5","dn_playersEnrolled0":"6","dn_totalRows0":"0","dn_percLost0":"0","dn_uncloosed0":"0","dn_timeUntilDef1":"2","dn_playersEnrolled1":"0","dn_totalRows1":"0","dn_percLost1":"0","dn_uncloosed1":"1","dn_timeUntilDef2":"10","dn_playersEnrolled2":"12","dn_totalRows2":"7","dn_percLost2":"0","dn_uncloosed2":"0","dn_timeUntilDef3":"15","dn_playersEnrolled3":"0","dn_totalRows3":"0","dn_percLost3":"45","dn_uncloosed3":"0","dn_notify_interval":"600000","dn_rule_modifier":"true","dn_sound_alert":"true"}';
    var _tabId = Math.random().toString();
    var _curCharID = document.querySelector('param[name="FlashVars"]').value.split('|')[3]; // will throw error if run on wrong page, thats ok.
    var _gmVars = {
        settingRows: 'dn_settingRows',
        timeSinceLastNotify: 'dn_timeSinceLastNotify',
        timeSinceLastUpdate: 'dn_timeSinceLastUpdate',
        lastActiveTab: 'dn_lastActiveTab',
        notifyCommand: 'dn_notifyCommand',
        bkSign: 'dn_bkSign_' + _curCharID
    }

    var _bkSign = GM_getValue(_gmVars.bkSign, 'null');
    if (_bkSign == 'null') _bkSign = prompt('Вас приветствует мастер настройки скрипта уведомления о защитах!\n\nВведите номер и название своего клана. Сначала номер, через пробел название.\nБудьте внимательны, если введете неправильно, скрипт придется переустанавливать.\n\nПравильный ввод выглядит так:', '823 Ginger Tail');
    if (_bkSign) GM_setValue(_gmVars.bkSign, _bkSign);
    else {
        alert ('Настройка не завершена :(');
        throw {message: 'HWM_Def_notifier: setup failed'};
    }

    // Последующий сегмент кода отвечает за то, чтоб уведомления исходили только из последней активной вкладки, а не случайной.
    if (document.visibilityState == "visible") updateAsActiveTab();

    document.addEventListener("visibilitychange", function(){
        if (document.visibilityState == "visible") updateAsActiveTab();
    });
    
    checkForNotifyCommand();
    
} catch (e) { console.log (e) }

function updateAsActiveTab(){
    GM_setValue(_gmVars.lastActiveTab, _tabId);
}

function checkForNotifyCommand(){
    var temp;
    if ((temp = GM_getValue(_gmVars.notifyCommand, '0')) != '0'){
        if (GM_getValue(_gmVars.lastActiveTab, _tabId) == _tabId){
            GM_setValue(_gmVars.notifyCommand, '0');
            notify(temp);
        } else {
            setTimeout(function(){
                var temp;
                if ((temp = GM_getValue(_gmVars.notifyCommand, '0')) != '0'){
                    GM_setValue(_gmVars.notifyCommand, '0');
                    notify(temp);
                }
            }, 2000);
        }
    }

    setTimeout(checkForNotifyCommand, 1000);
}

function sendNotifyCommand(message){
    GM_setValue(_gmVars.notifyCommand, message);
}
// Конец сегмента. Отслылка уведомлений происходит только посредством вызова функции sendNotifyCommand.

function findActiveDefs(doc){
    var regexp = /<font color=(?:"red"|red)><b>([\d:]*)<\/b><\/font>(.*?)<br><\/td><\/tr>/g;
    var regexp2 = /\d\)/g;
    var page = doc.querySelector('body').innerHTML;
    var match, activeDefs = [];
    var time, playersEnrolled;
    var res, count, unclosed;
    while (match = regexp.exec(page)){
        if (match[2].indexOf(_bkSign) == -1) continue;
        time = match[1];
        playersEnrolled = match[2].split('pl_info').length - 1;
        activeDefs.push({time : time, playersEnrolled : playersEnrolled});
    }
    for(var i = 0; i < activeDefs.length; i++){
        count = 0;
        while(res = regexp2.exec(doc.querySelectorAll('td.wb:nth-child(3)')[i].innerHTML)) count++;
        activeDefs[i].totalRows = count;
        try {
            activeDefs[i].curPercLost = parseInt(document.querySelectorAll('td.wb:nth-child(2)')[i].innerHTML.match(/Захвачен врагом на (\d+)/)[1]);
        } catch (e) {
            activeDefs[i].curPercLost = 0;
        }
        unclosed = 0;
        if ( activeDefs[i].playersEnrolled % 3 > 0 || Math.ceil((activeDefs[i].totalRows * 3 - activeDefs[i].playersEnrolled) / 3) < document.querySelectorAll('td.wb:nth-child(2)')[i].innerHTML.split('[Вступить]').length - 1) unclosed = 1;
        activeDefs[i].unclosed = unclosed;
    }

    var temp = activeDefs.reduce(function(o, v, i) { o[i] = v; return o; }, {});

    return activeDefs;
}

function getCurServerTime(doc){
    var regexp = /([\d:]+), \d+ online&nbsp;/;
    var page = doc.querySelector('body').innerHTML;
    var time = page.match(regexp)[1];
    return time;
}

function minutesDifference(time1, time2){
    var t1 = time1.split(':'), t2 = time2.split(':');
    if(parseInt(t1[0]) == 0) t1[0] = '24'; if(parseInt(t2[0]) == 0) t2[0] = '24';
    var difMin = 60 * (parseInt(t2[0]) - parseInt(t1[0])) + parseInt(t2[1]) - parseInt(t1[1]);
    //console.log('minutesDifference', difMin);
    return difMin;
}

function requestPage (url, onloadHandler){
    console.log('loading: ', url);
    try{
        GM_xmlhttpRequest({
            overrideMimeType: 'text/plain; charset=windows-1251',
            synchronous: false,
            url: url,
            method: "GET",
            onload: function(response){
                onloadHandler(new DOMParser().parseFromString(response.responseText, 'text/html').documentElement);
            },
            onerror: function(){ requestPage (url, onloadHandler) },
            ontimeout: function(){ requestPage (url, onloadHandler) },
            timeout: 5000
        });
    } catch (e) {
        console.log(e);
    }
}

function notifyRules(timeUntil, playersEnrolled, totalRows, percLost, unclosed){
    //console.log('notifyRules', timeUntil, playersEnrolled, totalRows, percLost, unclosed);
    for (var i = 0; i < parseInt(GM_getValue(_gmVars.settingRows, _defaultSettingRows)); i++)
        if ( notifyCase(i, timeUntil, playersEnrolled, totalRows, percLost, unclosed) )
            return true;
    return false;
}

function notifyCase(id, timeUntil, playersEnrolled, totalRows, percLost, unclosed){
    var playersEnrolledReq = parseInt(_settings.getSetting('dn_playersEnrolled' + id));
    if (_settings.getSetting('dn_rule_modifier') == 'true') playersEnrolledReq = Math.max(0, playersEnrolledReq - 3 * Math.floor(percLost / 15));

    if(timeUntil > parseInt(_settings.getSetting('dn_timeUntilDef' + id))) return false;
    if(totalRows * 3 - playersEnrolled <= playersEnrolledReq) return false;
    if(parseInt(_settings.getSetting('dn_totalRows' + id)) != 0 && parseInt(_settings.getSetting('dn_totalRows' + id)) != totalRows) return false;
    if(parseInt(_settings.getSetting('dn_percLost' + id)) > percLost) return false;
    if(parseInt(_settings.getSetting('dn_uncloosed' + id)) == 1 && unclosed == 1) return false;
    return true;
}

function notify(message){
    //console.log(_settings.getSetting('dn_sound_alert'));
    if (_settings.getSetting('dn_sound_alert')) new Audio(_notificationSound).play();
    setTimeout(function(){
        alert(message);
        if(document.location.href.indexOf(_defPage) == -1) GM_openInTab(_defPage);
    }, 100);
}

function main(){
    if (parseInt(_settings.getSetting('dn_notify_interval')) == 0) return;
    if (parseInt(GM_getValue(_gmVars.timeSinceLastNotify, '0')) < new Date().getTime() - parseInt(_settings.getSetting('dn_notify_interval')) && parseInt(GM_getValue(_gmVars.timeSinceLastUpdate, '0')) < new Date().getTime() - _updateInterval){
        requestPage(_defPage, function(doc){
            try{
                //console.log(doc);
                var sTime = getCurServerTime(doc);
                //console.log('time:',sTime );
                var defs = findActiveDefs(doc);
                //console.log('defs:',defs );
                for (var i = 0; i < defs.length; i++){
                    if (notifyRules(minutesDifference(sTime, defs[i].time), defs[i].playersEnrolled, defs[i].totalRows, defs[i].curPercLost, defs[i].unclosed)){
                        var message = 'Уведомление: защита в ' + defs[i].time;
                        GM_setValue(_gmVars.timeSinceLastNotify, new Date().getTime());
                        sendNotifyCommand(message);
                        break;
                    }
                }
                GM_setValue(_gmVars.timeSinceLastUpdate, new Date().getTime());
            } catch (e) {
                console.log(e);
            }
        });
        GM_setValue(_gmVars.timeSinceLastUpdate, new Date().getTime());
    }
    setTimeout(main, Math.max(parseInt(GM_getValue(_gmVars.timeSinceLastUpdate, '0')) - new Date().getTime() + (1 + 0.1 * Math.random()) * _updateInterval, parseInt(GM_getValue(_gmVars.timeSinceLastNotify, '0')) - new Date().getTime() + (1 + 0.1 * Math.random()) * parseInt(_settings.getSetting('dn_notify_interval'))));
    //console.log('checking in: ', Math.max(parseInt(GM_getValue(_gmVars.timeSinceLastUpdate, '0')) - new Date().getTime() + (1 + 0.01 * Math.random()) * _updateInterval, parseInt(GM_getValue(_gmVars.timeSinceLastNotify, '0')) - new Date().getTime() + (1 + 0.01 * Math.random()) * parseInt(_settings.getSetting('dn_notify_interval'))));
}

function addInterface(){
    GM_addStyle('#settingsInner tr{position: relative; left: 6px;} .copyright td{text-align: right;font: 12px "Times New Roman",Times,serif;color: #000;}');
    if (navigator.userAgent.toLowerCase().indexOf('chrome') == -1) GM_addStyle('#settingsInner {border-collapse: collapse;}');
    else GM_addStyle('#settingsInner td {top: 21px!important; right: 0px!important;}');
    var table = document.querySelector('td[align="center"][width="50%"]').parentElement.parentElement;
    var tr = document.createElement('tr');
    tr.innerHTML = '<td></td><td align="middle"><span id="dn_settingBoxControl" style="cursor:pointer; color:blue;">Настройки уведомлений</span></td><td></td>';
    table.appendChild(tr);
    document.getElementById('dn_settingBoxControl').onclick = function(){
        var els = document.getElementsByClassName('dn_settingBox');
        for(var i = 0; i < els.length; i++){
            if(els[i].style.display == 'none') els[i].style.display = '';
            else els[i].style.display = 'none';
        }
        if(els[0].style.display != 'none'){ // Вкл/выкл таймер обновления страницы (взаимодействие со скриптом на странице)
            setTimeout("clearTimeout(Timer)", 0);
        } else {
            setTimeout("Timer=setTimeout('Refresh()', 1000);", 0);
        }
    }
    drawSettingsBox();
}

function drawSettingsBox(drawAgain){
    var table = document.querySelector('td[align="center"][width="50%"]').parentElement.parentElement;
    var t;
    if(t = document.getElementsByClassName('dn_settingBox')[0]) table.removeChild(t);

    var tr = document.createElement('tr');
    tr.className = 'dn_settingBox';
    if (!drawAgain) tr.style.display = 'none';
    var row = settingsRow();
    var inputRows = '<tr align="center"><td colspan="9"><i>Уведомлять если</i></td></tr>' + row;
    for (var i = 1; i < parseInt(GM_getValue(_gmVars.settingRows, _defaultSettingRows)); i++) inputRows += '<tr align="center"><td colspan="9"><i>или</i></td></tr>' + row;
    tr.innerHTML = '<td colspan="3"><form id="dn_settingsForm"><table id="settingsInner" align="center" style="border-width: 1px 1px 1px;border-style: solid solid solid;border-color: #000;width: 85%;">' + inputRows + '<tr style="padding-bottom: 7px;"><td colspan="6" align="left"><input type="button" id="dn_addRule" value="Добавить условие"> <input type="button" id="dn_reduceRule" value="Убрать условие"> <select class="dn_defaults" align="center"><option value="0">Готовые настройки</option><option value="1">Для активного защитника</option><option value="2">Для страхующего дефы</option></select></td><td colspan="3" align="right">Частота уведомлений: <select id="dn_notify_interval"></select></td></tr><tr><td colspan="7" align="left"><input type="checkbox" id="dn_rule_modifier" name="dn_rule_modifier"> <label for="dn_rule_modifier">Уменьшать требования к заполненности на 3 места за каждые 15% потерянного контроля</label></td><td colspan="2" align="right"><input type="checkbox" id="dn_sound_alert" name="dn_sound_alert" checked> <label for="dn_sound_alert">Звук уведомления</label></td></tr><tr class="copyright" style="border-top: 1px solid rgb(0, 0, 0); border-right: medium hidden; border-left: medium hidden; border-bottom: medium hidden;"><td style="position: relative; top: 1px; right: 6px; border-bottom: 0px none;" colspan="10" align="right">2015, © <a href="http://www.heroeswm.ru/pl_info.php?id=712329" target="_blank">Рианти</a></td></tr></table></form></td>';
    table.appendChild(tr);
    fetchValuesToSettings();
    document.getElementById('dn_addRule').onclick = addRow;
    document.getElementById('dn_reduceRule').onclick = reduceRow;
    document.querySelector('select[class="dn_defaults"]').onchange = setDefaults;
}

function settingsRow(){
    function Setting(header, inputType, inputClass){ this.header = header; this.inputType = inputType; this.inputClass = inputClass; };
    var settings = [
        new Setting('Времени до боя меньше', 'select', 'dn_timeUntilDef'),
        new Setting('Свободных мест больше', 'select', 'dn_playersEnrolled'),
        new Setting('Всего дорожек', 'select', 'dn_totalRows'),
        new Setting('Слито процентов', 'select', 'dn_percLost'),
        new Setting('Незакрытые заявки', 'select', 'dn_uncloosed')
    ]
    var output = '<tr>';
    for (var i = 0; i < settings.length; i++){
        output += '<td align="center">' + settings[i].header + '</td><td style="width: 2%;"> </td>';
    }
    output += '</tr><tr>';
    for (i = 0; i < settings.length; i++){
        if (settings[i].inputType != 'select') output += '<td align="center"><input type="' + settings[i].inputType + '" class="' +  settings[i].inputClass + '"></td>';
        else output += '<td align="center"><select class="' +  settings[i].inputClass + '"></td>';
        if (i != settings.length - 1) output += '<td style="width: 2%;"> </td>';
    }
    return output + '</tr><tr><td colspan="9"><hr></td></tr>';
}

function reduceRow(){
    var curRows = parseInt(GM_getValue(_gmVars.settingRows, _defaultSettingRows));
    if (curRows > 1) curRows--;
    GM_setValue(_gmVars.settingRows, curRows);
    drawSettingsBox(1);
    _settings.importAgain();
}

function addRow(){
    var curRows = parseInt(GM_getValue(_gmVars.settingRows, _defaultSettingRows));
    if (curRows < 10) curRows++;
    GM_setValue(_gmVars.settingRows, curRows);
    drawSettingsBox(1);
    _settings.importAgain();
}

function setDefaults(e){
    var selectedDefauls = e.target.value;
    var rows, settings;
    if (selectedDefauls == '0') return;
    else if (selectedDefauls == '1'){
        rows = _defaultSettingRows;
        settings = _defaultSettings;
    } else {
        rows = _defaultSettingRows2;
        settings = _defaultSettings2;
    }
    GM_setValue(_gmVars.settingRows, rows);
    GM_setValue('dn_settings', settings);
    drawSettingsBox(1);
    _settings = new ScriptSettings('dn_settings', 'dn_settingsForm');
    setTimeout( function (){ GM_setValue('dn_settings', settings) }, 300); // Затычка бага, найти баг в будущем.
}

function fetchValuesToSettings(){
    for(var i = 0; i < document.getElementsByClassName('dn_timeUntilDef').length; i++){
        var el = document.getElementsByClassName('dn_timeUntilDef')[i];
        el.id = el.className + i;
        for (var j = 1; j <= 15; j++){
            var newEl = document.createElement('option');
            newEl.value = j;
            newEl.innerHTML = j + ' мин.';
            el.appendChild(newEl);
        }
        var el = document.getElementsByClassName('dn_playersEnrolled')[i];
        el.id = el.className + i;
        for (var j = 0; j <= 20; j++){
            var newEl = document.createElement('option');
            newEl.value = j;
            newEl.innerHTML = j;
            el.appendChild(newEl);
        }
        var el = document.getElementsByClassName('dn_totalRows')[i];
        el.id = el.className + i;
        var newEl = document.createElement('option');
        newEl.value = 0;
        newEl.innerHTML = 'Неважно';
        el.appendChild(newEl);
        for (var j = 3; j <= 6; j++){
            if (j == 6) j++
            var newEl = document.createElement('option');
            newEl.value = j;
            newEl.innerHTML = j;
            el.appendChild(newEl);
        }
        var el = document.getElementsByClassName('dn_percLost')[i];
        el.id = el.className + i;
        for (var j = 0; j <= 50; j += 15){
            var newEl = document.createElement('option');
            newEl.value = j;
            if(j == 0) newEl.innerHTML = 'Неважно';
            else newEl.innerHTML = 'больше ' + j + '%';
            el.appendChild(newEl);
        }
        var el = document.getElementsByClassName('dn_uncloosed')[i];
        el.id = el.className + i;
        var newEl = document.createElement('option');
        newEl.value = 0; newEl.innerHTML = 'Неважно';
        el.appendChild(newEl);
        var newEl = document.createElement('option');
        newEl.value = 1; newEl.innerHTML = 'Да';
        el.appendChild(newEl);
    }
    var el = document.getElementById('dn_notify_interval');
    for (var j = 0; j <= 15; j++){
        var newEl = document.createElement('option');
        newEl.value = j * 1000 * 60;
        if(j == 0) newEl.innerHTML = 'Не уведомлять';
        else newEl.innerHTML = j + ' мин';
        el.appendChild(newEl);
    }
}

function ScriptSettings(settingsKey, formId){
    function save(){
        GM_setValue(_settingsKey, JSON.stringify(_settings));
    }

    function load(){
        var stringSettings = GM_getValue(_settingsKey);
        if (!stringSettings) importFromDocument();
        else _settings = JSON.parse(stringSettings);
    }

    function apply(){
        try{
            var element;
            for(var setting in _settings){
                element = document.getElementById(setting);
                if(element.type == 'checkbox') element.checked = _settings[setting];
                else if (element.type == 'radio') element.selected = _settings[setting];
                else element.value = _settings[setting];
            }
            document.getElementById(_formId).onchange = function(){_self.changed()};
        } catch (e) {
            try{
                document.getElementById(_formId).onchange = function(){_self.changed()};
            } catch (ee){
                // Page without settings
            }
        }
    }

    function importFromDocument(){
        try{
            var element, value, formElements = document.getElementById(_formId).elements;
            for(var i = 0; i < formElements.length; i++){
                element = formElements[i];
                if(element.id != null && element.id != '' && element.type != 'button') {
                    if (element.type == 'checkbox') value = element.checked;
                    else if (element.type == 'radio') value = element.selected;
                    else value = element.value;
                    _settings[element.id] = value;
                }
            }
        } catch ( e ) {
            // not set on page
            _settings = JSON.parse(_defaultSettings);
        }
        save();
    }

    function enableGMvars() {
        if (!this.GM_getValue || typeof this.GM_getValue != 'function') {
            if (typeof(Storage) === "undefined") console.log( 'Local storage must be enabled to use scriptSettings.' );
            else {
                this.GM_getValue = function (key, def) { return localStorage[key] || def; }
                this.GM_setValue = function (key, value) { return localStorage[key] = value; }
                this.GM_deleteValue = function (key) { return delete localStorage[key]; }
            }
        }
    }

    this.changed = function(){
        var element, value;
        for(var setting in _settings){
            element = document.getElementById(setting);
            if(element.type == 'checkbox') value = element.checked;
            else if (element.type == 'radio') value = element.selected;
            else value = element.value;
            _settings[setting] = this.validateValue(element.type, element.id, value);
            if(element.type == 'checkbox') element.checked = _settings[setting];
            else if (element.type == 'radio') element.selected = _settings[setting];
            else element.value = _settings[setting];
        }
        save(); this.onchange();
    }

    this.importAgain = function(){
        apply(); this.forget(); _settings = {}; load();
    }

    this.validateValue = function(elementType, elementId, elementValue){return elementValue};

    this.onchange = function(){};

    this.getSetting = function(setting){
        if(_settings[setting] != null) return _settings[setting];
        throw {message: 'undefined setting requested: ' + setting};
    }

    this.forget = function(){
        GM_deleteValue(_settingsKey);
    }

    var _self = this;
    var _settings = {};
    var _settingsKey = settingsKey;
    var _formId = formId;

    enableGMvars();
    load(); apply();
}

try{
    if (document.location.href.indexOf('mapwars.php') != -1){
        addInterface();
    }
    var _settings = new ScriptSettings('dn_settings', 'dn_settingsForm');
    main();
} catch (e) {
    console.log(e);
}