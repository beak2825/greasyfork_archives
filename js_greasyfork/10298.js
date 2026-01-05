// ==UserScript==
// @name         URO Presets
// @namespace    http://wiki.waze.com/User:Biuick84
// @version      0.1
// @description  Store predefined configurations for URO+ - also requires URComment
// @author       Fábio Cardoso (biuick84)
// @match        https://editor-beta.waze.com/*editor/*
// @match        https://www.waze.com/*editor/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10298/URO%20Presets.user.js
// @updateURL https://update.greasyfork.org/scripts/10298/URO%20Presets.meta.js
// ==/UserScript==

function UROPresets_refresh()
{
    if (document.getElementById('UROPresetsList') !== null)
    {
        var element = document.getElementById('UROPresetsList');
        element.parentNode.removeChild(element);
    }
    var presetsList ='<div id=\'UROPresetsList\' style=\'width:100%\'><hr />Custom Presets (URO Presets)<br />';
    
    for (var i=0; i <= localStorage.length; i++)
    {
        if ((localStorage.key(i) !== null) && (localStorage.key(i).length >= 11) && (localStorage.key(i).substr(0,11) == 'UROPresets_'))
            presetsList += '<label  id=\'' + localStorage.key(i) + '\'>' + localStorage.key(i).substr(11,localStorage.key(i).length-11) + '</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<label id=\'d' + localStorage.key(i) + '\'>(x)</label><br />';
    }
    presetsList += '</div>';
    $("#sidepanel-URComments-URO-Presets").append(presetsList);

    for (var i=0; i <= localStorage.length; i++)
    {
        if ((localStorage.key(i) !== null) && (localStorage.key(i).length >= 11) && (localStorage.key(i).substr(0,11) == 'UROPresets_'))
        {
            $('#' + localStorage.key(i)).click({param1 : localStorage.key(i)},function(event)
                                               {
                                                   var presetName = event.data.param1;
                                                   document.getElementById('_txtSettings').value = localStorage.getItem(presetName);
                                                   $('#_btnTextToSettings').click();
                                               });
            
            $('#d' + localStorage.key(i)).click({param1 : localStorage.key(i)},function(event)
                                               {
                                                   var presetName = event.data.param1;
                                                   if (confirm('Are you sure you want to delete the Preset: ' + presetName.substr(11,presetName.length-11) + '?'))
                                                   {
                                                       localStorage.removeItem(presetName);
                                                       UROPresets_refresh();
                                                   }
                                               });
        }
    }
}

function UROPresets_bootstrap()
{
    UROPresets_refresh();
    $("#sidepanel-URComments-URO-Presets").prepend('<button id="UROPresets_save">Save current URO+ settings</button><br />');
    $('#UROPresets_save').click(function()
                                {
                                    var presetName = prompt('Choose a name for this preset','My Preset').replace(" ","_");
                                    if (presetName !== null)
                                    {
                                        $('#_btnSettingsToText').click();
                                        var exists = 0;
                                        for (var i=0; i <= localStorage.length; i++)
                                        {
                                            if (localStorage.key(i) == 'UROPresets_' + presetName)
                                            {
                                                exists = 1;
                                                break;
                                            }
                                        }
                                        if (exists != 1)
                                            localStorage.setItem('UROPresets_' + presetName,document.getElementById('_txtSettings').value);
                                        else if (confirm('Preset already exists. Overwrite?')===true)
                                            localStorage.setItem('UROPresets_' + presetName,document.getElementById('_txtSettings').value);
                                        UROPresets_refresh();
                                    }
                                });
}

setTimeout(UROPresets_bootstrap,3000);