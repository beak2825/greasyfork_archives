// ==UserScript==
// @name         Imperia Online Simulator
// @namespace    io_sim
// @version      1.1
// @description  try to take over the world!
// @author       ChoMPi
// @match        http://*.imperiaonline.org/imperia/game_v6/game/village.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16908/Imperia%20Online%20Simulator.user.js
// @updateURL https://update.greasyfork.org/scripts/16908/Imperia%20Online%20Simulator.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var newContTop;
var newContBot;

function CloneGenerals()
{
    if (newContTop != null) {
        newContTop.html('');
        newContTop.append($('#simulator-generals-top .simulator-general-holder').clone());
    }
    if (newContBot != null) {
        newContBot.html('');
        newContBot.append($('#simulator-generals-bottom .simulator-general-holder').clone());
    }
}

function OnSimulator()
{
    newContTop = $('<div></div>');
    $('#simulator-army-top').after(newContTop);
    
    newContBot = $('<div></div>');
    $('#simulator-army-bottom').after(newContBot);
    
    CloneGenerals();
    
    $('.table-header-icons.army').parent().click(function() {
        CloneGenerals();
    });
    $('.table-header-icons.settings').parent().click(function() {
        newContTop.html('');
        newContBot.html('');
    });
    $('.table-header-icons.generals').parent().click(function() {
        newContTop.html('');
        newContBot.html('');
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

function Init()
{
    hookFunction(container, 'onLoad', function(arg1)
    {
        if (typeof arg1 != 'undefined')
        {
            if (arg1 == 'operation-center' || arg1 == 'OperationCenter')
            {
                var opc = $('#operation-center');
                var simulatorsTab = $('.tab-simulators', opc);

                if (simulatorsTab.hasClass('active'))
                {
                    OnSimulator();
                }
            }
            else if (arg1 == 'simulator-generals-top' || arg1 == 'simulator-generals-bottom') {
                CloneGenerals();
            }
        }
    });
}

$(document).ready(function()
{
    function InitCheck()
    {
        if (typeof container != 'undefined')
        {
            Init();
        }
        else
        {
            setTimeout(InitCheck, 500);
        }
    }
    InitCheck();
});