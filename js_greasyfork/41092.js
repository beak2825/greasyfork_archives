// ==UserScript==

// @name            Scavenge
// @author          Jonas
// @version         1.0
// @description     Scavenging made easy
// @include         https://nl*.tribalwars.nl/game.php?*screen=place&mode=scavenge*
// @grant 			none
// @namespace https://greasyfork.org/users/182152
// @downloadURL https://update.greasyfork.org/scripts/41092/Scavenge.user.js
// @updateURL https://update.greasyfork.org/scripts/41092/Scavenge.meta.js
// ==/UserScript==

$(document).ready(function(){
    // opgeslagen settings ophalen of indien niets gevonden wordt leeg object aanmaken
    var scavengeSettings = JSON.parse(localStorage.getItem("scavengeSettings")) || {};
    // Indien geen settings gevonden/ misse versie -> default settings instellen
    if(scavengeSettings === null || scavengeSettings.version !== "1.0") {
        scavengeSettings.version = "1.0";
        scavengeSettings.duration = 3;
        scavengeSettings.off = true;
        scavengeSettings.lc = false;
        scavengeSettings.marcher = false;
        scavengeSettings.def = false;
        scavengeSettings.heavy = false;
        scavengeSettings.hotkey = 'i';
        scavengeSettings.hotkeyCode = 73;
        scavengeSettings.hotkeyEnabled = true;
    }
    var settingsView = document.createElement('div');
    settingsView.id = 'settingsScavenge';
    settingsView.style.cssText = "background-color:#ecd6ad;border:1px solid #7d510f;z-index:99;padding:7px;width:300px;height:auto;border-radius:7px;display:none;font-size:12px;font-weight: normal";
    settingsView.innerHTML += '<div><h1 style ="text-align: left; font-size: small" >Scavenge settings</h1></div>';
    settingsView.innerHTML += '<div align = "left"><label style="font-size: 13px">duration: </label><input id = "scavengeDurationText" type="text" size="5" placeholder="hours"> <label>hours</label></div>';
    settingsView.innerHTML += '<div><input id = "offScavengeCheckbox" type = "checkbox"><label for="offScavengeCheckbox">Send off scavenge</label> <img src="https://dsnl.innogamescdn.com/8.123/36786/graphic/unit/unit_axe.png"> </div>';
    settingsView.innerHTML += '<div id = "divExtraOffSettings" style="display: none; margin-left: 20px"><div><input id = "offLcScavengeCheckbox" type = "checkbox"> <label for="offLcScavengeCheckbox">Use lc</label> <img src="https://dsnl.innogamescdn.com/8.123/36786/graphic/unit/unit_light.png"</div><div><input id = "offMarcherScavengeCheckbox" type = "checkbox"> <label for="offMarcherScavengeCheckbox">Use marchers </label><img src="https://dsnl.innogamescdn.com/8.123/36786/graphic/unit/unit_marcher.png"></div></div>';
    settingsView.innerHTML += '<div><input id = "defScavengeCheckbox" type = "checkbox"> <label for="defScavengeCheckbox">Send def scavenge</label> <img src="https://dsnl.innogamescdn.com/8.123/36786/graphic/unit/unit_sword.png"> </div>';
    settingsView.innerHTML += '<div id = "divExtraDefSettings" style="display: none; margin-left: 20px"><input id = "defHeavyScavengeCheckbox" type = "checkbox"> <label for="defHeavyScavengeCheckbox">Use zc </label><img src="https://dsnl.innogamescdn.com/8.123/36786/graphic/unit/unit_heavy.png"></div>';
    settingsView.innerHTML += '<div align = "left"><label style="font-size: 13px">hotkey: </label><input id = "scavengeHotkey" type="text" size="7" maxlength="1" placeholder="hotkey"></div>';
    settingsView.innerHTML += '<div  align="right"><a id="scavengeSettingsSave" href="#">Save</a></div>';
    $('h3').append('<div style="font-size: small"><a id="scavengeSettingsShow" href = "#">Scavenge settings</a></div>',settingsView);

    //instellingen tonen
    $("#scavengeSettingsShow").click(function () {
        scavengeSettings.hotkeyEnabled = false;
        $('#scavengeSettingsShow').hide();
        $('#settingsScavenge').show();
        scavengeSettings.duration !== 3 ? $('#scavengeDurationText').val(scavengeSettings.duration) : $('#scavengeDurationText').val("");
        $('#scavengeHotkey').val(scavengeSettings.hotkey).blur();
        if (scavengeSettings.off){
            $('#offScavengeCheckbox').prop('checked',true);
            $('#divExtraOffSettings').show();
        } else {
            $('#offScavengeCheckbox').prop('checked',false);
        }
        if(scavengeSettings.def){
            $('#defScavengeCheckbox').prop('checked',true);
            $('#divExtraDefSettings').show();
        } else {
            $('#defScavengeCheckbox').prop('checked',false);
        }
        $('#offLcScavengeCheckbox').prop('checked',scavengeSettings.lc);
        $('#offMarcherScavengeCheckbox').prop('checked', scavengeSettings.marcher);
        $('#defHeavyScavengeCheckbox').prop('checked',scavengeSettings.heavy);
        //extra off opties tonen
        $('#offScavengeCheckbox').change(function(){
            if($('#offScavengeCheckbox').prop('checked') === true) {
                $('#divExtraOffSettings').show();
            } else {
                $('#divExtraOffSettings').hide();
                $('#offLcScavengeCheckbox').prop('checked',false);
                $('#offMarcherScavengeCheckbox').prop('checked',false);
            }
        });
        //extra def opties tonen
        $('#defScavengeCheckbox').change(function(){
            if($('#defScavengeCheckbox').prop('checked') === true) {
                $('#divExtraDefSettings').show();
            } else {
                $('#divExtraDefSettings').hide();
                $('#defHeavyScavengeCheckbox').prop('checked',false);
            }
        });
        //hotkey instellen
        $('#scavengeHotkey').on('keyup', function (e) {
            $(this).val(e.originalEvent.key);
            scavengeSettings.hotkeyCode = e.keyCode;
        });
    });
    //instellingen opslaan -> localstorage
    $("#scavengeSettingsSave").click(function(){
        $('#settingsScavenge').hide();
        $('#scavengeSettingsShow').show();
        scavengeSettings.duration = $('#scavengeDurationText').val();
        scavengeSettings.off = $('#offScavengeCheckbox').prop('checked');
        scavengeSettings.lc = $('#offLcScavengeCheckbox').prop('checked');
        scavengeSettings.marcher = $('#offMarcherScavengeCheckbox').prop('checked');
        scavengeSettings.def = $('#defScavengeCheckbox').prop('checked');
        scavengeSettings.heavy = $('#defHeavyScavengeCheckbox').prop('checked');
        scavengeSettings.hotkey = $('#scavengeHotkey').val();
        scavengeSettings.hotkeyEnabled = true;
        localStorage.setItem("scavengeSettings", JSON.stringify(scavengeSettings));
        location.reload();
    });

    //Indien hotkey ingeduwd wordt rooftocht uitvoeren
    $(document).keydown(function(keyPressed){
        if(keyPressed.keyCode === scavengeSettings.hotkeyCode && scavengeSettings.hotkeyEnabled) {
            $content = $('#scavenge_screen');
            var $scavengeButtons = $content.find('.btn-default.free_send_button').not('.btn-disabled');
            var units = {'spear': {'haul': 25, 'enabled': scavengeSettings.def, 'type': 'def', 'amount': 0, 'population': 1}, 'sword': {'haul': 15, 'enabled': scavengeSettings.def, 'type': 'def', 'amount': 0, 'population': 1}, 'axe':{'haul': 10, 'enabled': scavengeSettings.off, 'type': 'off', 'amount': 0, 'population': 1}, 'archer': {'haul': 10, 'enabled': scavengeSettings.def, 'type': 'def', 'amount': 0, 'population': 1}, 'light':{'haul': 80, 'enabled': scavengeSettings.lc, 'type': 'off', 'amount': 0, 'population': 4}, 'marcher':{'haul': 50, 'enabled': scavengeSettings.marcher, 'type': 'off', 'amount': 0, 'population': 5}, 'heavy':{'haul': 50, 'enabled': scavengeSettings.heavy, 'type': 'def', 'amount': 0, 'population': 6}};
            var possibleHaul = 0;
            var totalPop = 0;
            var def = 0;
            var off = 0;
            for (var unit in units) {
                if (units[unit].enabled){
                    var amount = parseInt($content.find('.units-entry-all[data-unit="' + unit + '"]').text().match(/\d+/));
                    if(isNaN(amount)) amount = 0;
                    totalPop += amount*units[unit].population;
                    possibleHaul += amount*units[unit].haul;
                    units[unit].amount = amount;
                    if(units[unit].type === 'off') {
                        off += amount*units[unit].haul;
                    } else {
                        def += amount*units[unit].haul;
                    }
                }
            }
            if(!scavengeSettings.off && !scavengeSettings.def){
                //niets doen
                void(0);
            }
            else if($scavengeButtons.length > 0 && possibleHaul > 0 && totalPop > 10){
                var lootFactors = {'Flegmatische  Fielt': 0.1, 'Bescheiden Bandieten': 0.25, 'Slimme Speurders': 0.5, 'Reuze Rovers': 0.75};
                var totalLoot = Math.pow(Math.pow((scavengeSettings.duration*5270.708505)-1800,20/9)/100,1/2);
                var scavengeTitle = $scavengeButtons.last().closest('.scavenge-option').find('.title').text().trim();
                var scavengeLoot = Math.round(totalLoot/lootFactors[scavengeTitle]);
                var scavengeType = (off > def)? 'off' : 'def';
                var sendUnits = {};
                var unitsToSend = {'spear': 0, 'sword': 0, 'axe': 0, 'archer': 0, 'light': 0, 'marcher': 0, 'heavy': 0};
                for(var unit in units){
                    if(units[unit].amount > 0 && units[unit].type == scavengeType && units[unit].enabled){
                        sendUnits[unit] = 0;
                    }
                }
                //Berekenen hoeveel eenheden verstuurd meoten worden
                var sendReady = false;
                var seperateLootPerUnit = scavengeLoot/Object.keys(sendUnits).length;
                while(!sendReady && Object.keys(sendUnits).length > 0){
                    for (var key in sendUnits){
                        if(units[key].amount*units[key].haul > seperateLootPerUnit){
                            unitsToSend[key] = Math.round(seperateLootPerUnit/units[key].haul);
                            sendReady = true;
                        } else {
                            unitsToSend[key] = units[key].amount;
                            scavengeLoot -= unitsToSend[key]*units[key].haul;
                            delete sendUnits[key];
                            seperateLootPerUnit = scavengeLoot/Object.keys(sendUnits).length;
                            sendReady = false;
                            break;
                        }
                    }
                }
                //eenheden invullen
                for(var unit in unitsToSend){
                    if (unitsToSend[unit] !== 0){
                        var $unitInputText = $('.unitsInput[name="' + unit + '"]');
                        $unitInputText.val(unitsToSend[unit]).trigger('change');
                    }
                }
                //rooftocht verzenden
                $scavengeButtons.last().click();
            } else{
                //change village
                $('.arrowRight, .groupRight').click();
            }
        }
    });
});