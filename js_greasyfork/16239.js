// ==UserScript==
// @name         Imperia Online Espionage Extensions
// @namespace    imperia_espionage
// @version      1.2
// @description  try to take over the world!
// @author       ChoMPi
// @match        http://*.imperiaonline.org/imperia/game_v6/game/village.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/16239/Imperia%20Online%20Espionage%20Extensions.user.js
// @updateURL https://update.greasyfork.org/scripts/16239/Imperia%20Online%20Espionage%20Extensions.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

function GetSpyRowID(element)
{
    return $(element).next().attr('id').replace('hidden-tr-', '');
}

function GetSpyNotes()
{
    if (typeof localStorage.imperia_spy_notes != 'undefined') {
        GM_setValue('imperia_spy_notes', localStorage.imperia_spy_notes);
        delete localStorage.imperia_spy_notes;
    }
    
    var notes = GM_getValue('imperia_spy_notes', null);
    
    if (notes == null)
        return {};
    
    return JSON.parse(notes);
}

function GetSpyNote(id)
{
    var notes = GetSpyNotes();
    if (typeof notes[id] != 'undefined') {
        return notes[id];
    }
    return '';
}

function SaveSpyNote(id, note)
{
    var notes = GetSpyNotes();
    notes[id] = note;
    GM_setValue('imperia_spy_notes', JSON.stringify(notes));
}

function OnWindowEspionage()
{
    var opCenter = $('#operation-center .spy-wrapper');
    var dataGrid = $('.data-grid', opCenter);
    
    ProcessEspionageData(dataGrid);
}

function LoadEspionageData(data, appendTo)
{
    var content = $(data).find('#messageboxEspionageTabs').get(1);
    content = $(content).html();
    content = $('<div></div>').html(content.replace("<![CDATA[S", "").replace("]]>", ""));
    var dataGrid = content.find('.data-grid');
    $('tr', dataGrid).first().remove();
    
    ProcessEspionageData(dataGrid);
    
    dataGrid.find('tr').each(function(i, e)
    {
        appendTo.append($(e));
    });
}

function ProcessEspionageData(dataGrid)
{
    if (dataGrid.length > 0)
    {
        dataGrid.find('tr.stripe').each(function(i, e)
        {
            var id = GetSpyRowID(e);
            var noteText = GetSpyNote(id);
            
            var lastAttack = GetLastAttackString(id);
            if (lastAttack != '')
            {
                var attackField = $('<div style="font-size:12px; padding-top:3px; color: #632626;">Last attack order: ' + lastAttack + ' ago</div>');
                $('td:eq(1)', e).append(attackField);
            }
            
            var noteField = $('<div style="font-size:12px; padding-top:3px; color: #675E49; ' + (noteText == '' ? 'display:none;' : '') + '">' + noteText + '</div>');
            $('td:eq(1)', e).append(noteField);

            var form = $('<form onSubmit="return false;" style="display:none;"><textarea rows="2" cols="40"></textarea><br><input class="button" type="submit" value="Save" /></form>');
            $('td:eq(1)', e).append(form);
            
            var button = $('<a href="javascript:void(0);" id="' + id + '" class="button icons rename-bookmark" title="Set Note"><span></span></a>');
            $('td.actions div', e).append(button);
            
            form.submit(function()
            {
                SaveSpyNote(id, $('textarea', form).val());
                noteField.html($('textarea', form).val());
                form.fadeOut('fast', function()
                {
                    if (noteField.html() != '')
                        noteField.fadeIn('fast');
                });
                return false;
            });
            
            button.click(function()
            {
                if (form.is(':visible')) {
                    form.fadeOut('fast', function() {
                        if (noteField.html() != '') {
                            noteField.fadeIn('fast');
                        }
                    });
                } else {
                    $('textarea', form).val(GetSpyNote(id));
                    noteField.fadeOut('fast', function() {
                        form.fadeIn('fast');
                    });
                }
            });
        });
    }
}

function GetLastAttacks()
{
    if (typeof localStorage.imperia_last_attacks != 'undefined') {
        GM_setValue('imperia_last_attacks', localStorage.imperia_last_attacks);
        delete localStorage.imperia_last_attacks;
    }
    
    var attacks = GM_getValue('imperia_last_attacks', null);
    
    if (attacks == null)
        return {};
    
    return JSON.parse(attacks);
}

function GetLastAttack(id)
{
    var attacks = GetLastAttacks();
    if (typeof attacks[id] != 'undefined') {
        return parseInt(attacks[id]);
    }
    return 0;
}

function GetLastAttackString(id)
{
    var attackTime = GetLastAttack(id);
    if (attackTime > 0) {
        return timeSince(attackTime);
    }
    return '';
}

function SaveLastAttack(id, time)
{
    var attacks = GetLastAttacks();
    attacks[id] = time;
    GM_setValue('imperia_last_attacks', JSON.stringify(attacks));
}

function OnDoAttack(requestData, response)
{
    var id;
    var userid = requestData.match(/<e><k>dUserId<\/k><v>S(\d+)<\/v><\/e>/)[1];
    var provinceid = requestData.match(/<e><k>dProvinceId<\/k><v>S(\d+)<\/v><\/e>/);
    var name = requestData.match(/<e><k>dName<\/k><v>S([\_\-\.a-zA-Z0-9]*)<\/v><\/e>/)[1];

    if (provinceid == null) {
        return;
    }
    
    // Check if it's NPC or player
    if (name == '' || name.substring(0, 3) == 'NPC') {
        id = userid + '-' + provinceid[1];
    } else {
        id = userid + '-' + name;
    }
    
    // Check the response for error
    if (response.match(/\<cmd cmd\=\"as\" id\=\"errorContainerOperationCenter\" prop\=\"innerHTML\"\>/)) {
        return;
    }
    
    SaveLastAttack(id, new Date().getTime());
}

function OnSpyReport(id)
{
    var wind = $('#spy-report-' + id);
    var simulatorLinks = $('.icon-simulator').parent().find('a');
    
    simulatorLinks.each(function(i, e) {
        // javascript:void(xajax_viewOperationCenter(container.open({saveName:'operation-center', title:'Command Center'}), {tab: 'simulators', subTab: 2, side: 'bottom', simulatorType: 1, spyReportId: 510619}))
        //$(e).attr('href', "javascript:void(0)");
        $(e).click(function() {
            container.open({saveName:'simulation-' + id, title:'Simulators'});
            
            $.post(location.protocol + "//" + location.host + "/imperia/game_v6/game/xajax_loader.php", {
                xjxfun: "viewOperationCenter",
                xjxr: Date.now(),
                xjxargs: ["Soperation-center", "<xjxobj><e><k>tab</k><v>Ssimulators</v></e><e><k>subTab</k><v>N2</v></e><e><k>side</k><v>Sbottom</v></e><e><k>simulatorType</k><v>N1</v></e><e><k>spyReportId</k><v>N" + id + "</v></e><e><k>vexok</k><v>Btrue</v></e></xjxobj>"],
            },
            function(data) {
                var cont = $('#messageboxsimulation-' + id);
                var content = $(data).find('xjx').find('cmd').get(2);
                var contentHTML = $(content).html();
                contentHTML = contentHTML.replace("<![CDATA[S", "").replace("]]>", "");
                
                cont.html(contentHTML);
            },
            "xml");
        });
    });
}

function addXMLRequestCallback(callback)
{
    if (typeof XMLHttpRequest.newCallbacks == 'undefined')
    {
        XMLHttpRequest.newCallbacks = [callback];
    }
    else
    {
        XMLHttpRequest.newCallbacks.push(callback);
        return;
    }
    
    XMLHttpRequest.oldSend = XMLHttpRequest.prototype.send;
    // override the native send()
    XMLHttpRequest.prototype.send = function()
    {      
        var self = this;
        this.addEventListener("readystatechange", function()
        {
            if (self.readyState == 4 && self.status == 200) {
                for (var i = 0; i < XMLHttpRequest.newCallbacks.length; i++)
                {
                    XMLHttpRequest.newCallbacks[i](self);
                }
            }
        }, false);
        this.requestData = (arguments.length > 0) ? decodeURIComponent(arguments[0]) : null;
        // call the native send()
        XMLHttpRequest.oldSend.apply(this, arguments);
    }
}

function timeSince(date)
{
    var seconds = Math.floor((new Date() - date) / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(seconds / 3600);
    var days = Math.floor(seconds / 86400);
    var months = Math.floor(seconds / 2592000);
    var years = Math.floor(seconds / 31536000);

    if (seconds < 60) {
        return Math.floor(seconds) + " seconds";
    }
    else if (minutes < 60) {
        return minutes + ' minute' + (minutes > 1 ? 's' : '');
    }
    else if (hours < 24) {
        return hours + ' hour' + (hours > 1 ? 's' : '');
    }
    else if (days < 30) {
        return days + ' day' + (days > 1 ? 's' : '');
    }
    else if (months < 12) {
        return months + ' month' + (months > 1 ? 's' : '');
    }
    else {
        return years + ' year' + (years > 1 ? 's' : '');
    }
}

function Init()
{
    addXMLRequestCallback(function(xhr) {
        if (xhr.requestData != null) {
            // Check for the espionage window
            if (xhr.requestData.indexOf('xjxfun=viewOperationCenter') > -1 && xhr.requestData.indexOf('dontprocess=1') == -1) {
                if (xhr.response.indexOf('tab-espionage active') > -1) {
                    OnWindowEspionage();
                }
            }
            // Check for attack
            if (xhr.requestData.indexOf('xjxfun=doAttack') > -1) {
                if (xhr.requestData != null) {
                    OnDoAttack(xhr.requestData, xhr.response);
                }
            }
            // Check for spy
            if (xhr.requestData.indexOf('xjxfun=doSpy') > -1) {
                var patt = new RegExp(/<e><k>spy_mission_id<\/k><v>N(\d+)<\/v><\/e>/g);
                var id = patt.exec(xhr.requestData);
                if (typeof id[1] != 'undefined') {
                    //OnSpyReport(parseInt(id[1]));
                }
            }
        }
    });
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
    InitCheck();
});