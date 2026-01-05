// ==UserScript==
// @name         Imperia Online Attack Extensions
// @namespace    imperia_attack
// @version      1.17
// @description  try to take over the world!
// @author       ChoMPi
// @match        http://*.imperiaonline.org/imperia/game_v6/game/village.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/16266/Imperia%20Online%20Attack%20Extensions.user.js
// @updateURL https://update.greasyfork.org/scripts/16266/Imperia%20Online%20Attack%20Extensions.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var interval;
var defaultIntervalTime = 60000; // Time in milliseconds
var intervalTime;
var unitErrorMargin = 0.05; // 5%
var lang = "en";

String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(find, 'g'), replace);
};

function tolang(key)
{
    var strings = {
        "en": {
            "title": "My mission queue",
            "paused": "Paused",
            "import": "Import",
            "export": "Export",
            "settings": "Settings",
            "destination": "Destionation",
            "missiontype": "Mission Type",
            "distance": "Distance",
            "traveltime": "Travel Time",
            "armyunits": "Army Units",
            "totaltime": "Total time",
            "startqueue": "Start Queue",
            "pausequeue": "Pause Queue",
            "delete": "Delete",
            "deleteall": "Delete All",
            "playerinfo": "Player information",
            "capital": "Capital",
            "fortresssiege": "Fortress Siege",
            "queuefortsiege": "Queue Fortress Siege",
            "fieldbattle": "Field Battle",
            "queuefieldbattle": "Queue Field Battle",
            "noattacks": "There are no attacks in the queue.",
            "inqueue": "In Queue",
            "totaluserarmy": "Full Army",
            "unitnames": {
                "P1": "Light Spearmen",
                "P2": "Heavy Spearmen",
                "P3": "Phalanx",
                "S1": "Light Archers",
                "S2": "Heavy Archers",
                "S3": "Elite Archers",
                "M1": "Light Swordsmen",
                "M2": "Heavy Swordsmen",
                "M3": "Guardians",
                "K1": "Light Cavalry",
                "K2": "Heavy Cavalry",
                "K3": "Paladins",
                "CT": "Supply Wagons",
                "C1": "Battering Rams",
                "C2": "Catapults",
                "C3": "Trebuchets",
                "C4": "Ballistae",
            },
        },
        "bg": {
            "title": "Атаки в изчакване",
            "paused": "Паузирано",
            "import": "Импортиране",
            "export": "Експортиране",
            "settings": "Настройки",
            "destination": "Дестинация",
            "missiontype": "Вид на мисията",
            "distance": "Разстояние",
            "traveltime": "Време за пътуване",
            "armyunits": "Военни единици",
            "totaltime": "Общо време",
            "startqueue": "Старт",
            "pausequeue": "Пауза",
            "delete": "Изтрий",
            "deleteall": "Изтрий Всички",
            "playerinfo": "Информация за играча",
            "capital": "Столица",
            "fortresssiege": "Крепостна обсада",
            "queuefortsiege": "Изчакване Крепостна обсада",
            "fieldbattle": "Полева битка",
            "queuefieldbattle": "Изчакване Полева битка",
            "noattacks": "Няма атаки в изчакване.",
            "inqueue": "Във Изчакване",
            "totaluserarmy": "Покажи пълна войска",
            "unitnames": {
                "P1": "Леки копиеносци",
                "P2": "Тежки копиеносци",
                "P3": "Фаланги",
                "S1": "Леки стрелци",
                "S2": "Тежки стрелци",
                "S3": "Елитни стрелци",
                "M1": "Леки мечоносци",
                "M2": "Тежки мечоносци",
                "M3": "Гвардейци",
                "K1": "Лека конница",
                "K2": "Тежка конница",
                "K3": "Паладини",
                "CT": "Товарни колички",
                "C1": "Тарани",
                "C2": "Катапулти",
                "C3": "Требушети",
                "C4": "Балисти",
            },
        },
    };
    
    return strings[lang][key];
}

function GetNextQueueID()
{
    var id = GM_getValue('attackqueueid' + uid + REALM, 1);
    GM_setValue('attackqueueid' + uid + REALM, parseInt(id) + 1);
    return parseInt(id);
}

function QueueAttack(obj)
{
    obj.id = GetNextQueueID();

    GetAttackTime(obj, function(travelTime)
    {
        var list = GetQueueList();
        obj.travelTime = travelTime;
        list.push(obj);
        GM_setValue('attackqueue' + uid + REALM, JSON.stringify(list));
        UpdateQueueNotification();
    });
}

function DequeueAttack(id)
{
    var list = GetQueueList();
    
    if (list.length > 0) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                list.splice(i, 1);
            }
        }
        
        GM_setValue('attackqueue' + uid + REALM, JSON.stringify(list));
    }
    
    UpdateQueueNotification();
    
    if (container.isOpen({saveName:"queued-attacks"})) {
        OpenQueuedAttacks();
    }
}

function ClearAttackQueue()
{
    GM_setValue('attackqueue' + uid + REALM, JSON.stringify([]));
    UpdateQueueNotification();
    if (container.isOpen({saveName:"queued-attacks"})) {
        OpenQueuedAttacks();
    }
}

function GetQueueList()
{
    var list = GM_getValue('attackqueue' + uid + REALM, null);
    if (list === null)
        return [];
    return JSON.parse(list);
}

function ImportQueueList(text)
{
    var json;
    
    try {
        json = JSON.parse(text);
    }
    catch (err) {
        alert('Import failed! Error: ' + err);
        return;
    }
    
    // Corrections
    for (var i = 0; i < json.length; i++) {
        if (typeof json[i].attackType == 'undefined') {
            json[i].attackType = "1";
        }
    }
    
    GM_setValue('attackqueue' + uid + REALM, JSON.stringify(json));
    UpdateQueueNotification();
    OpenQueuedAttacks();
}

function GetQueuePauseState()
{
    var state = GM_getValue('attackqueuestate' + uid + REALM, '1');
    return (state == '1');
}

function SetQueuePauseState(state)
{
    GM_setValue('attackqueuestate' + uid + REALM, (state ? '1' : '0'));
    
    if (state) {
        $('#attackqueue-paused').show();
    } else {
        $('#attackqueue-paused').hide();
        Update();
    }
}

function QueueSetInterval(interval)
{
    intervalTime = parseInt(interval);
    Update();
    GM_setValue('attackqueueinterval' + uid + REALM, intervalTime);
}

function QueueLoadInterval()
{
    var interval = GM_getValue('attackqueueinterval' + uid + REALM, defaultIntervalTime);
    intervalTime = parseInt(interval);
}

function SaveUnitInput(key, value)
{
    var inputs = GM_getValue('unitinputs' + uid + REALM, null);
    
    if (inputs === null) {
        inputs = {};
    } else {
        inputs = JSON.parse(inputs);
    }
    
    inputs[key] = value;
    
    GM_setValue('unitinputs' + uid + REALM, JSON.stringify(inputs));
}

function GetUnitInput(key)
{
    var inputs = GM_getValue('unitinputs' + uid + REALM, null);
    
    if (inputs === null) {
        return 0;
    }
    
    inputs = JSON.parse(inputs);
    
    if (typeof inputs[key] == 'undefined') {
        return 0;
    }
    
    return inputs[key];
}

function pad(d)
{
    return (d < 10) ? '0' + d.toString() : d.toString();
}

function StringToSeconds(timeStr)
{
    if (timeStr.indexOf(':') == -1) {
        return 0;
    }
    
    var timeArr = timeStr.split(':');
    var hours = parseInt(timeArr[0]);
    var minutes = parseInt(timeArr[1]);
    var seconds = parseInt(timeArr[2]);
    
    return (seconds + (minutes * 60) + (hours * 60 * 60));
}

function SecondsToString(totalSeconds)
{
    var newhours = Math.floor(totalSeconds / 3600);
    var newminutes = Math.floor((totalSeconds / 60) % 60);
    var newseconds = totalSeconds % 60;
    
    return pad(newhours) + ':' + pad(newminutes) + ':' + pad(newseconds);
}

function DoubleTimeString(timeStr)
{
    var totalSeconds = (StringToSeconds(timeStr) * 2);
    return SecondsToString(totalSeconds);
}

function GetTotalTime(queueList)
{
    if (queueList.length == 0) {
        return '00:00:00';
    }
    
    var totalSeconds = 0;
    
    for (var i = 0; i < queueList.length; i++) {
        if (typeof queueList[i].travelTime != 'undefined') {
            totalSeconds += StringToSeconds(queueList[i].travelTime);
        }
    }
    
    return SecondsToString(totalSeconds);
}

function GetAttackTime(attackData, callback)
{
    if (attackData.dName.toLowerCase().indexOf('worldboss') > -1) {
        callback('01:00:00');
        return;
    }
    
    var armyString = "<xjxobj></xjxobj>";
    
    if (attackData.army.length > 0) {
        var armyStrings = [];
        for (var i = 0; i < attackData.army.length; i++) {
            armyStrings.push("<e><k>" + attackData.army[i].name.replace('army[', '').replace(']', '') + "</k><v>S" + attackData.army[i].value + "</v></e>");
        }
        armyString = "<xjxobj>" + armyStrings.join("") + "</xjxobj>";
    }
    
    var sendData = "<xjxobj><e><k>generalId</k><v>S" + attackData.generalId + "</v></e><e><k>army</k><v>" + armyString + "</v></e><e><k>dUserId</k><v>S" + attackData.dUserId + "</v></e><e><k>dProvinceId</k><v>S" + attackData.dProvinceId + "</v></e><e><k>attackType</k><v>S" + attackData.attackType + "</v></e><e><k>dName</k><v>S" + attackData.dName + "</v></e><e><k>formation</k><v>S" + attackData.formation + "</v></e><e><k>vexok</k><v>Btrue</v></e></xjxobj>";

    $.post(location.protocol + "//" + location.host + "/imperia/game_v6/game/xajax_loader.php", {
        xjxfun: "viewAttackInfo",
        xjxr: Date.now(),
        xjxargs: ["SOperationCenter", sendData],
    },
    function(data) {
        var e1 = $(data).find("#attackInfoBox").get(0);
        var html = $(e1).html().replace("<![CDATA[S", "").replace("]]>", "");
        var div = $('<div></div>').html(html);
        var table = div.find('.table-army-info').get(0);
        var tr = $(table).find('tr').get(1);
        var td = $(tr).find('.info-values').get(1);
        
        callback(DoubleTimeString($(td).text()));
    }, "xml");
}

function ExecuteAttack(attackData)
{
    var armyString = "<xjxobj></xjxobj>";
    
    if (attackData.army.length > 0) {
        var armyStrings = [];
        for (var i = 0; i < attackData.army.length; i++) {
            armyStrings.push("<e><k>" + attackData.army[i].name.replace('army[', '').replace(']', '') + "</k><v>S" + attackData.army[i].value + "</v></e>");
        }
        armyString = "<xjxobj>" + armyStrings.join("") + "</xjxobj>";
    } else {
        console.log('No army selected for queued attack.');
        return;
    }
    
    var sendData = "<xjxobj><e><k>generalId</k><v>S" + attackData.generalId + "</v></e><e><k>army</k><v>" + armyString + "</v></e><e><k>dUserId</k><v>S" + attackData.dUserId + "</v></e><e><k>dProvinceId</k><v>S" + attackData.dProvinceId + "</v></e><e><k>attackType</k><v>S" + attackData.attackType + "</v></e><e><k>dName</k><v>S" + attackData.dName + "</v></e><e><k>formation</k><v>S" + attackData.formation + "</v></e><e><k>vexok</k><v>Btrue</v></e></xjxobj>";

    $.post(location.protocol + "//" + location.host + "/imperia/game_v6/game/xajax_loader.php", {
        xjxfun: "doAttack",
        xjxr: Date.now(),
        xjxargs: ["SOperationCenter", sendData],
    },
    function(data) {
        refreshUI('Refresh');
    }, "xml");
    
    DequeueAttack(attackData.id);
}

function UpdateQueueNotification()
{
    var queueList = GetQueueList();
    $('#widget-attackqueue').find('#count').html(queueList.length);
}

function GetFormDataValue(formData, key)
{
    for (var i = 0; i < formData.length; i++) {
        if (formData[i].name == key) {
            return formData[i].value;
        }
    }
    
    return null;
}

function GetAvailableArmy(callback)
{
    // Check for army
    $.post(location.protocol + "//" + location.host + "/imperia/game_v6/game/xajax_loader.php", {
        xjxfun: "viewOperationCenter",
        xjxr: Date.now(),
        xjxargs: ["Soperation-center", "<xjxobj><e><k>tab</k><v>Sattack</v></e><e><k>subTab</k><v>SloadAttack</v></e><e><k>vexok</k><v>Btrue</v></e></xjxobj>"],
    },
    function(data) {
        var e1 = $(data).find("#messageboxArmyAttacks").get(0);
        var html = $(e1).html().replace("<![CDATA[S", "").replace("]]>", "");
        html = $(html);
        var form = html.find("#sendAttackForm");
        var formData = form.serializeArray();
        
        var army = [];
        
        for (var i = 0; i < formData.length; i++) {
            if (formData[i].name.indexOf('army') > -1) {
                var keySearch = /army\[(.*)\]/;
                var results = formData[i].name.match(keySearch);
                
                if (results.length > 0) {
                    var maxUnits = $('#max_' + results[1], html).val();
                    formData[i].value = parseInt(maxUnits);
                    army.push(formData[i]);
                }
            }
        }
        
        callback(army);
    }, "xml");
}

function GetAvailableGenerals(callback)
{
    // Check for general
    $.post(location.protocol + "//" + location.host + "/imperia/game_v6/game/xajax_loader.php", {
        xjxfun: "viewAssignGeneral",
        xjxr: Date.now(),
        xjxargs: ["Smodal", "<xjxobj><e><k>assignmentType</k><v>N1</v></e><e><k>vexok</k><v>Btrue</v></e></xjxobj>"],
    },
    function(data) {
        var e2 = $(data).find("#messageboxmodal").get(0);
        var html = $(e2).html();
        
        var search = /personId\=\"(\d+)\"/g;
        var results = html.match(search);
        
        var generals = [];
        
        if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                var searchId = /personId\=\"(\d+)\"/;
                var results2 = results[i].match(searchId);
                if (results2.length > 0) {
                    generals.push(results2[1]);
                }
            }
        }
        
        callback(generals); 
    }, "xml");
}

function GetUnitsFromArmyArray(armyArray, key)
{
    for (var i = 0; i < armyArray.length; i++) {
        if (armyArray[i].name == key) {
            return armyArray[i].value;
        }
    }
    
    return 0;
}

function IsArmyAvailable(army, availableArmy)
{
    for (var i = 0; i < army.length; i++) {
        var requestedUnits = army[i].value;
        var availableUnits = GetUnitsFromArmyArray(availableArmy, army[i].name);

        // Check if we dont have the units required
        if (availableUnits < requestedUnits) {
            return false;
        }
    }
    
    return true;
}

function IsGeneralAvailable(general, availableGenerals)
{
    if (availableGenerals.indexOf(general) == -1) {
        return false;
    }
    
    return true;
}

function DeductArmyUnits(attackData, availableArmy)
{
    for (var i = 0; i < attackData.army.length; i++) {
        for (var i2 = 0; i2 < availableArmy.length; i2++) {
            if (availableArmy[i2].name == attackData.army[i].name) {
                availableArmy[i2].value = availableArmy[i2].value - attackData.army[i].value;
            }
        }
    }
    
    return availableArmy;
}

function ReduceArmyUnits(army, reduction)
{
    for (var i = 0; i < army.length; i++) {
        army[i].value = army[i].value - Math.floor(army[i].value * reduction);
    }
    
    return army;
}

function RemoveGeneral(attackData, availableGenerals)
{
    var index = availableGenerals.indexOf(attackData.generalId);
    
    if (index > -1) {
        availableGenerals.splice(index, 1);
    }
    
    return availableGenerals;
}

function Update()
{
    clearTimeout(interval);
    interval = setTimeout(Update, intervalTime);
    
    if (GetQueuePauseState()) {
        return;
    }
    
    var queueList = GetQueueList();
    
    if (queueList.length > 0) {
        GetAvailableArmy(function(availableArmy)
        {
            GetAvailableGenerals(function(availableGenerals)
            {
                var runAttacks = [];
                
                for (var i = 0; i < queueList.length; i++) {
                    // Check if the general is available
                    if (queueList[i].generalId == "" || IsGeneralAvailable(queueList[i].generalId, availableGenerals))
                    {
                        var isAvailable = false;
                        
                        // Check if we have the required army units
                        if (IsArmyAvailable(queueList[i].army, availableArmy))
                        {
                            isAvailable = true;
                        }
                        else
                        {
                            // Reduce the army units by the error margin and check again
                            var reducedArmy = ReduceArmyUnits(JSON.parse(JSON.stringify(queueList[i].army)), unitErrorMargin);
                            
                            if (IsArmyAvailable(reducedArmy, availableArmy))
                            {
                                isAvailable = true;
                                queueList[i].army = reducedArmy;
                            }
                        }
                        
                        if (isAvailable)
                        {
                            runAttacks.push(queueList[i]);
                            availableArmy = DeductArmyUnits(queueList[i], availableArmy);
                            availableGenerals = RemoveGeneral(queueList[i], availableGenerals);
                        }
                    }
                }
                
                for (var i2 = 0; i2 < runAttacks.length; i2++) {
                    // Execute the attack
                    ExecuteAttack(runAttacks[i2]);
                }
            });
        });
    } else {
        SetQueuePauseState(true);
        UpdateQueueNotification();
    }
}

function GetQueuedAttackUnitsTooltip(attackData)
{
    var html = '<table id="tooltip-qa' + attackData.id + '" class="ui-hide"><tbody>';
    
    html += '<tr><td colspan="2">' + attackData.generalCard + '</td></tr>';
    
    for (var i = 0; i < attackData.army.length; i++) {
        var key = attackData.army[i].name.replace('army[' , '').replace(']' , '');
        html += '<tr><td>' + tolang('unitnames')[key] + '</td><td class="numeral">' + attackData.army[i].value + '</td></tr>';
    }
    
    html += '</tbody></table>';
    
    return html;
}

function OpenQueuedAttacks()
{
    var queueList = GetQueueList();
    var totalTime = GetTotalTime(queueList);
    
    container.open({saveName:'queued-attacks', title:tolang('title')});

    var cont = $('#queued-attacks .window-content');
    cont.html('<span class="window-decor-left"></span>' +
              '<span class="window-decor-right"></span>' +
              '<div class="window-wide queued-attacks-main">' +
                  '<div class="content">' +
                      '<div id="all-queued-attacks-list-id" class="queued-attacks">' +
                          '<h3>' + tolang('title') + ' <span id="current-queue-state"' + (GetQueuePauseState() ? '' : ' style="display:none;"') + '>- <span style="color:#5F1D1D;">' + tolang('paused') + '</span></span>' +
                              '<div class="fright tright" style="margin-bottom:15px;margin-right:20px;">' +
                                  '<div class="centered-block fright queue-operations" style="width: 500px;">' +
                                      '<button class="button small" type="button" id="queue-settings-btn">' + tolang('settings') + '</button>' +
                                      '<button class="button small" type="button" id="import-queue">' + tolang('import') + '</button>' +
                                      '<button class="button small" type="button" id="export-queue">' + tolang('export') + '</button>' +
                                  '</div>' +
                              '</div>' +            
                          '</h3>' +
                          '<table class="data-grid middle">' +
                              '<tbody>' +
                                  '<tr>' +
                                      '<th title="' + tolang('destination') + '"><div class="table-header-icons from-to"></div></th>' +
                                      '<th title="' + tolang('missiontype') + '"><div class="table-header-icons type-mission"></div></th>' +
                                      '<th title="' + tolang('distance') + '"><span class="icon-op icon-distance"></span></th>' +
                                      '<th title="' + tolang('traveltime') + '" class="th-time"><div class="table-header-icons timer"></div></th>' +
                                      '<th title="' + tolang('armyunits') + '"><div class="table-header-icons army"></div></th>' +
                                      '<th><div class="table-header-icons actions"></div></th>' +
                                  '</tr>' +
                              '</tbody>' +
                          '</table>' +
                          '<div class="th-header clear cutting-panel">' +
                              '<div class="fleft tleft" style="margin-bottom:20px;">' +
                                  '<div class="centered-block fleft queue-time" style="width: 200px;">' +
                                      '' + tolang('totaltime') + ': ' + totalTime +
                                  '</div>' +
                              '</div>' +
                              '<div class="fright tright" style="margin-bottom:20px;">' +
                                  '<div class="centered-block fright queue-operations" style="width: 500px;">' +
                                      '<button class="button icons refresh" type="button" id="refresh-queue" style="margin:0;top:-1px;"><span></span></button>' +
                                      '<button class="button small" type="button" id="start-queue"' + (GetQueuePauseState() ? '' : ' style="display:none;"') + '>' + tolang('startqueue') + '</button>' +
                                      '<button class="button small" type="button" id="pause-queue"' + (GetQueuePauseState() ? ' style="display:none;"' : '') + '>' + tolang('pausequeue') + '</button>' +
                                      '<button class="button small" type="button" id="clear-queue">' + tolang('deleteall') + '</button>' +
                                  '</div>' +
                              '</div>' +
                          '</div>' +
                      '</div>' +
                 '</div>' +
             '</div>');
    
    var dataTable = $('.data-grid tbody', cont);
    
    if (queueList.length > 0) {
        for (var i = 0; i < queueList.length; i++) {
            var attackData = queueList[i];
            var name = "";
            
            if (attackData.isPlayer) {
                name = '<a class="username" href="javascript:void(xajax_viewGameProfiles(container.open({saveName: \'profiles\', title: \'' + tolang('playerinfo') + '\'}), { tab: 1, \'userId\': ' + attackData.dUserId + ' }))">' + attackData.dName + '</a>';
            } else {
                name = attackData.realName;
            }
            
            var tr = $('<tr class="queued-attack">' +
                           '<td><span class="ui-ib"><span class="ui-ib"><span class="prov-pict holding1" title="' + tolang('capital') + '"></span></span></span><span class="arrow-divider"></span>' + name + '</td>' +
                           '<td>' + (attackData.attackType == "1" ? tolang('fortresssiege') : tolang('fieldbattle')) + '</td>' +
                           '<td class="numeral" style="text-align:center;">' + attackData.distance + '</td>' +
                           '<td class="numeral" style="text-align:center;">' + attackData.travelTime + '</td>' +
                           '<td class="numeral tooltip-arrow" content="#tooltip-qa' + attackData.id + '" position="left;center" style="text-align:center;">' + attackData.armyTotal + GetQueuedAttackUnitsTooltip(attackData) + '</td>' +
                           '<td class="tcenter"><div class="centered-block visual-loading fnone"><button class="button icons red delete" type="button" title="' + tolang('delete') + '" name="delete" data-id="' + attackData.id + '"><span></span></button></div></td>' +
                       '</tr>');
            dataTable.append(tr);
        }
    }
    else
    {
        dataTable.append('<tr><td class="tcenter" colspan="6">' + tolang('noattacks') + '</td></tr>');
    }
    
    container.position();
    
    $('#queued-attacks').on('click', 'button.delete', function() {
        var id = $(this).attr('data-id');
        if (typeof id != 'undefined') {
            DequeueAttack(parseInt(id));
        }
    });
    
    $('button#refresh-queue', cont).click(function(){
        Update();
    });
    $('button#clear-queue', cont).click(function(){
        ClearAttackQueue();
    });
    $('button#start-queue', cont).click(function(){
        SetQueuePauseState(false);
        $('button#pause-queue', cont).show();
        $(this).hide();
        $('#current-queue-state', cont).hide();
    });
    $('button#pause-queue', cont).click(function(){
        SetQueuePauseState(true);
        $('button#start-queue', cont).show();
        $(this).hide();
        $('#current-queue-state', cont).show();
    });
    $('button#export-queue', cont).click(function() {
        container.open({saveName:'export-queued-attacks', title:tolang('export')});
        $('#export-queued-attacks .window-content').html(
            '<div class="window-tight export-queued-attacks-main">' +
                '<div class="content">' +
                    '<textarea rows="10" style="width:480px;overflow-y:scroll;">' + JSON.stringify(GetQueueList()) + '</textarea>' +
                '</div>' +
            '</div>');
        container.position();
    });
    $('button#import-queue', cont).click(function() {
        container.open({saveName:'import-queued-attacks', title:tolang('import')});
        $('#import-queued-attacks .window-content').html(
            '<div class="window-tight import-queued-attacks-main">' +
                '<div class="content">' +
                    '<textarea rows="10" style="width:480px;overflow-y:scroll;" id="queue-json"></textarea>' +
                    '<div class="th-header clear cutting-panel">' +
                        '<div class="fright tright" style="margin-bottom:20px;">' +
                            '<div class="centered-block fright queue-operations" style="width: 500px;">' +
                                '<button class="button small" type="button" id="import-queue-run">' + tolang('import') + '</button>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>');
        $('#import-queued-attacks #import-queue-run').click(function() {
            var textarea = $('#import-queued-attacks #queue-json');
            ImportQueueList(textarea.val());
            container.close({saveName: 'import-queued-attacks', flow: true, closedWith: 'click'});
        });
        container.position();
    });
    $('button#queue-settings-btn', cont).click(function() {
        OpenSettings();
    });
    
    ui.constructor();
}

function OpenSettings()
{
    container.open({saveName:'queue-settings', title:tolang('settings')});

    var cont = $('#queue-settings .window-content');
    
    cont.html('<span class="window-decor-left"></span>' +
              '<span class="window-decor-right"></span>' +
              '<div class="window-tight queue-settings-main">' +
                  '<div class="content">' +
                      '<div class="th-header clear cutting-panel">' +
                          '<div class="fleft tleft" style="margin-bottom:20px;">' +
                              '<div class="centered-block fleft queue-time" style="width: 200px;">' +
                                  'Update interval: ' +
                              '</div>' +
                          '</div>' +
                          '<div class="fright tright" style="margin-bottom:20px;">' +
                             '<div class="centered-block fright queue-operations" style="width: 300px;">' +
                                 '<div id="update-interval-slider-wrap"><div id="update-interval-slider"></div></div>' +
                                 '<div id="update-interval-preview" style="text-align:center;">1 min</div>' +
                             '</div>' +
                         '</div>' +
                     '</div>' +
                 '</div>' +
             '</div>');
    
    $('#update-interval-slider', cont).slider({
        min: 1,
        max: 60,
        change: function(event, ui) {
            $('#update-interval-preview', cont).html(ui.value + ' minute');
            QueueSetInterval(ui.value * 60000);
        },
        slide: function(event, ui) {
            $('#update-interval-preview', cont).html(ui.value + ' minute');
        }
    });
    $('#update-interval-slider', cont).slider('value', (intervalTime / 60000));
    
    container.position();
    ui.constructor();
}

function FormatFormData(formData)
{
    var obj = {};
    obj.army = [];
    obj.armyTotal = 0;
    
    for (var i = 0; i < formData.length; i++) {
        var e = formData[i];
        
        if (e.name == "generalId") {
            obj.generalId = e.value;
        }
        else if (e.name == "dUserId") {
            obj.dUserId = e.value;
        }
        else if (e.name == "dProvinceId") {
            obj.dProvinceId = e.value;
        }
        else if (e.name == "dName") {
            obj.dName = e.value;
        }
        else if (e.name == "formation") {
            obj.formation = e.value;
        }
        else if (e.name == "attackType") {
            obj.attackType = e.value;
        }
        else if (e.name.indexOf('army') > -1 && e.value != '') {
            e.value = parseInt(e.value);
            obj.army.push(e);
            obj.armyTotal += e.value;
        }
    }
    
    return obj;
}

function CreateSlider()
{
    var table = $('.oc-attack .choose-army');
    
    if (table.find('#army-slider-wrap').length > 0)
        return;
    
    var inputs = $('.unit-input', table);
    var selectAll = $('#select-all-army', table);
    
    inputs.each(function(i, e)
    {
        var a = $(e).children('a');
        
        if (typeof a.attr('id') == 'undefined')
            return;
        
        var key = a.attr('id').replace('current_max_army_', '');
        var max = $('#max_' + key).val();
        
        if (max == '0')
            return;
        
        $(e).attr('data-key', key);
        $(e).attr('data-max', max);
        $(e).addClass('hasUnits');
    });

    var pctText = $('<div style="text-align:center;padding-top:6px;">0%</div>');
    var sliderWrap = $('<div id="army-slider-wrap"></div>');
    var slider = $('<div id="army-slider"></div>');
    sliderWrap.append(slider);
    selectAll.parent().parent().append(sliderWrap);
    slider.slider({
        min: 0,
        max: 100,
        change: function( event, ui ) {
            inputs.each(function(i, e)
            {
                if (!$(e).hasClass('hasUnits'))
                    return;

                var key = $(e).attr('data-key');
                var max = $(e).attr('data-max');
                var value = Math.floor(parseInt(max) * (ui.value / 100));

                $('#army_' + key).val(value);
                $('#army_' + key).trigger('keyup');
                pctText.html(ui.value + '%');
            });
            
            calcArmyCapacity();
        },
        slide: function( event, ui ) {
            pctText.html(ui.value + '%');
        }
    });
    sliderWrap.after(pctText);
}

function QueueAttackButtonClick()
{
    var form = $('#sendAttackForm');
    
    if (typeof form != 'undefined' && form.length > 0)
    {
        var formData = form.serializeArray();
        var obj = FormatFormData(formData);

        if ($('#refreshInfo').length > 0) {
            var distance = $('#refreshInfo').parent().find('.info-values').get(1);
            obj.distance = $(distance).text();
        } else {
            obj.distance = "";
        }

        var table = $('.table-army-attack').find('tr').get(0);

        if ($(table).find('.search-wrapper').length > 0) 
        {
            obj.isPlayer = true;
        } 
        else 
        {
            var td = $(table).find('td').get(0);
            td = $(td).clone();
            td.find('h4').remove();
            td.find('input').remove();

            obj.isPlayer = false;
            obj.realName = td.text().trim();
        }

        var generalCard = $('#attack-general').clone();
        generalCard.find('a.change').remove();
        generalCard.find('a').prop('href', null);
        obj.generalCard = generalCard.html().replaceAll('\n', '').replace(/\s{2,}/g, ' ');

        QueueAttack(obj);
    }
}

function CreateQueueAttackButton()
{
    if ($('.oc-attack').find('.button[name="sendAttack"]').length > 0 && $('.oc-attack').find('.queueAttack').length == 0)
    {
        var qButton;
        var dName = $('#sendAttackForm #dName');
        
        if (typeof dName == 'undefined' || dName.text().indexOf('Nomad') == -1)
        {
            qButton = $('<button class="button queueAttack" type="button" onclick="return false;" style="opacity:1;">' + tolang('queuefortsiege') + '</button>');
            qButton.click(function() {
                $('#attackType').val('1');
                QueueAttackButtonClick();
            });
        }
        else if (dName.text().indexOf('Nomad') > -1)
        {
            qButton = $('<button class="button queueAttack" type="button" onclick="return false;" style="opacity:1;">' + tolang('queuefieldbattle') + '</button>');
            qButton.click(function() {
                $('#attackType').val('2');
                QueueAttackButtonClick();
            });
        }
        
        var qButtonCont = $('<div class="centered-block visual-loading fnone"></div>');
        $('.oc-attack .button[name="sendAttack"]').parent().parent().append(qButtonCont);
        qButtonCont.append(qButton);
    }
}

function GetTotalUserArmy(callback)
{
    // Check for general
    $.post(location.protocol + "//" + location.host + "/imperia/game_v6/game/xajax_loader.php", {
        xjxfun: "viewSimulatorTotalUserArmy",
        xjxr: Date.now(),
        xjxargs: ["Sarmy-top", "<xjxobj><e><k>side</k><v>Stop</v></e><e><k>simulatorType</k><v>N1</v></e><e><k>vexok</k><v>Btrue</v></e></xjxobj>"],
    },
    function(data) {
        var e2 = $(data).find("#army-top-1").get(0);
        var content = $('<div>' + $(e2).html() + '</div>');
        
        var army = [];
        var holders = content.find('.simulator-unit-holder');
        
        for (var i = 0; i < holders.length; i++) {
            var holder = $(holders.get(i));
            var a = $('a.unit', holder);
            
            var search = /\{\'unitId\'\:\'(.*)\'\}/;
            var results = a.attr('href').match(search);
        
            if (results.length > 0) {
                army.push({ name: results[1], value: $(holder.find('input').get(0)).val() });
            }
        }
        
        callback(army); 
    }, "xml");
}

function LoadAndHookUnitInputs()
{
    setTimeout(function() {
        var form = $('#sendAttackForm');

        if (typeof form != 'undefined' && form.length > 0)
        {
            form.find('input.unit-input').each(function(i, e) {
                var id = $(e).prop('id');
                $(e).val(GetUnitInput(id));
                $(e).on('keyup', function() {
                    SaveUnitInput($(this).prop('id'), $(this).val());
                });
                $(e).trigger('keyup');
                $(e).parent().find('a').click(function() {
                    $(e).trigger('keyup');
                });
            });
            
            $('#select-all-army', form).on('click', function() {
                form.find('input.unit-input').each(function(i, e) {
                    $(e).trigger('keyup');
                });
            });
            $('#deselect-all-army', form).on('click', function() {
                form.find('input.unit-input').each(function(i, e) {
                    $(e).trigger('keyup');
                });
            });
        }
        
        var e12 = $('#ExcludeGarrisonArmy').parent().parent().parent();
        
        if ($('input#TotalUserArmy', e12).length == 0)
        {
            var totalCont = $('<label for="TotalUserArmy"><div class="checkbox-wrap ui-ib"><input class="checkbox ui-pass" id="TotalUserArmy" type="checkbox"></div>' + tolang('totaluserarmy') + '</label>');
            e12.append(totalCont);

            $('input', totalCont).on('change', function(e) {
                if ($(this).is(':checked')) {
                    GetTotalUserArmy(function(army) {
                        for (var i = 0; i < army.length; i++) {
                            var input = $('input#army_' + army[i].name, form);

                            if (typeof input.attr('disabled') == 'undefined') {
                                var unitInput = $('.unit-input[data-key="' + army[i].name + '"]', form);
                                unitInput.attr('data-orig-max', unitInput.attr('data-max'));
                                unitInput.attr('data-max', army[i].value);
                            } else {
                                if (army[i].value.length > 0) {
                                    input.attr('disabled', null);
                                    input.parent().parent().removeClass('disabled');
                                    input.parent().addClass('hasUnits');
                                    input.parent().attr('data-key', army[i].name);
                                    input.parent().attr('data-orig-max', '0');
                                    input.parent().attr('data-max', army[i].value);
                                    $('#current_max_army_' + army[i].name, form).attr('onclick', "if(!$(this).hasClass('deactive')) {$('#army_" + army[i].name + "').val($('#max_" + army[i].name + "').val()); calcArmyCapacity();}");
                                }
                            }

                            $('#max_' + army[i].name, form).val(army[i].value);
                            $('#current_max_army_' + army[i].name, form).html(army[i].value);
                        }
                    });
                } else {
                    form.find('input.unit-input').each(function(i, e) {
                        var key = $(e).parent().attr('data-key');
                        var orig = $(e).parent().attr('data-orig-max');

                        $(e).parent().attr('data-max', orig);
                        $('#max_' + key, form).val(orig);

                        if (orig == '0') {
                            $(e).attr('disabled', 'disabled');
                            $(e).val('0');
                            $(e).parent().parent().addClass('disabled');
                            $(e).parent().removeClass('hasUnits');
                            $(e).parent().find('a').html('0');
                            $(e).parent().find('a').attr('onclick', null);
                        } else {
                            $(e).val(orig);
                            $(e).parent().find('a').html(orig);
                        }
                    });
                }
            });
        }
    }, 200);
}

function OnWindowAttack()
{
    CreateSlider();
    CreateQueueAttackButton();
    LoadAndHookUnitInputs();
}

function IsPlayerInQueue(userid)
{
    var queueList = GetQueueList();
    
    if (queueList.length > 0) {
        for (var i = 0; i < queueList.length; i++) {
            if (parseInt(queueList[i].dUserId) == parseInt(userid)) {
                return true;
            }
        }
    }
    
    return false;
}

function IsProvinceInQueue(userid, provinceid)
{
    var queueList = GetQueueList();
    
    if (queueList.length > 0) {
        for (var i = 0; i < queueList.length; i++) {
            if (parseInt(queueList[i].dUserId) == parseInt(userid) && parseInt(queueList[i].dProvinceId) == parseInt(provinceid)) {
                return true;
            }
        }
    }
    
    return false;
}

function OnWindowEspionage()
{
    var opCenter = $('#operation-center .spy-wrapper');
    var dataGrid = $('.data-grid', opCenter);
    
    if (dataGrid.length > 0)
    {
        dataGrid.find('tr.stripe').each(function(i, e)
        {
            if (!$(e).hasClass('processed'))
            {
                var idstring = $(e).next().attr('id').replace('hidden-tr-', '');
                var idarr = idstring.split('-');
                var userid = idarr[0];
                var secondid = idarr[1];
                var isNpc = /^\d+$/.test(secondid);
                
                if (!isNpc && IsPlayerInQueue(userid))
                {
                    var note = $('<div style="font-size:12px; padding-top:3px; color: #632626;">' + tolang('inqueue') + '</div>');
                    $('td:eq(1)', e).append(note);
                }
                else if (isNpc && IsProvinceInQueue(userid, secondid))
                {
                    var note = $('<div style="font-size:12px; padding-top:3px; color: #632626;">' + tolang('inqueue') + '</div>');
                    $('td:eq(1)', e).append(note);
                }
                
                $(e).addClass('processed');
            }
        });
    }
}

function Init()
{
    hookFunction(container, 'onLoad', function(arg1)
    {
        if (typeof arg1 != 'undefined')
        {
            if (arg1 == 'operation-center' || arg1 == 'OperationCenter')
            {
                var opc = $('#operation-center');
                var attackTab = $('.tab-attack', opc);
                var esTab = $('.tab-espionage', opc);

                if (attackTab.hasClass('active'))
                {
                    OnWindowAttack();
                }
                else if (esTab.hasClass('active'))
                {
                    OnWindowEspionage();
                }
            }
            else if (arg1 == 'EspionageTabs')
            {
                OnWindowEspionage();
            }
        }
    });
    
    if (document.documentElement.lang == "bg") {
        lang = "bg";
    }
    
    $('<style type="text/css">' +
      '#army-slider-wrap, #update-interval-slider-wrap {position:relative;z-index:1;height:6px;margin:0px 10px;padding:7px 14px 7px 16px;border-radius:15px;border:1px solid rgba(120,108,86,0.8);box-shadow:inset 0px 0px 6px rgba(0,0,0,0.2),1px 1px 1px rgba(255,237,196,0.25);background:#A69674;background:linear-gradient(to bottom, rgba(119,108,86,0.2) 0%, rgba(119,108,86,0.2) 100%)}' +
      '#army-slider, #update-interval-slider {}' +
      '#army-slider a, #update-interval-slider a {top:-13px;width:36px;margin-left:-18px;height:36px;outline:none;background:url("http://ihcdn3.ioimg.org/iov6live/gui/custom-ui-sprite.png?v=724") no-repeat -2px -60px}' +
      '#army-slider a:hover, #update-interval-slider a:hover {background-position:-2px -96px}' +
      '#widget-attackqueue { top:140px;right:51px;width:250px;height:0; }' +
      '.ui-attackqueue a { background-position:0px -329px;position:relative;float:right;width:44px;height:28px;margin-right:9px; }' +
      '.ui-attackqueue a .m-time { position:absolute;display:inline-block;left:2px;bottom:-12px;width:38px;padding:1px 0px;color:#fff;font-size:12px;text-align:center;background:rgba(0,0,0,0.5);border-radius:0 0 3px 3px; }' +
      '.ui-attackqueue a:hover .m-time { box-shadow:0 0 2px #FFF; }' +
      '#queued-attacks .queue-operations button { margin-left: 8px; }' +
      '</style>').appendTo("head");

    var notifyCont = $('<div id="widget-attackqueue" class="ui"><div class="ui-attackqueue"></div></div>');
    var notifyButton = $('<a class="ui-icon" href="javascript:void(0)" title="' + tolang('title') + '">' +
                         '<span id="count" class="m-time">0</span>' +
                         '<img id="attackqueue-paused" style="width:20px; height:20px; margin-top: -4px; margin-left: 28px; display: none;" src="data:image/png;base64,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" />' +
                         '</a>');
    $('.ui-attackqueue', notifyCont).append(notifyButton);
    $('#imperia').append(notifyCont);
    
    if (GetQueuePauseState()) {
        $('#attackqueue-paused').show();
    }
    
    UpdateQueueNotification();
    
    notifyButton.click(function() {
        OpenQueuedAttacks();
    });
    
    /*document.dispatchEvent(new CustomEvent('addCommand', {
        detail: {
            command: "/queueinterval",
            capture: true,
            callback: QueueSetInterval,
        }
    }));*/
    
    QueueLoadInterval();
    interval = setTimeout(Update, intervalTime);
}

function InitCheck()
{
    if (typeof io.showUI != 'undefined')
    {
        hookFunction(io, 'showUI', function() {
            Init();
        });
    }
    else
    {
        setTimeout(InitCheck, 500);
    }
}

function hookFunction(object, functionName, callback) {
    (function(originalFunction) {
        object[functionName] = function () {
            var returnValue = originalFunction.apply(this, arguments);

            callback.apply(this, arguments);

            return returnValue;
        };
    }(object[functionName]));
}

$(document).ready(function()
{
    InitCheck();
});