// ==UserScript==
// @name         PokeLegends UI
// @namespace    pokecrap
// @version      1.9
// @description  Pokemon Party UI
// @author       Ripster
// @match        https://www.pokemonlegends.com/explore*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/28723/PokeLegends%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/28723/PokeLegends%20UI.meta.js
// ==/UserScript==

(function() {
    var prevInBattle = bInBattle;
    var lastLine;

    unsafeWindow.pokeTeam = {slot1: {}, slot2: {}, slot3: {}, slot4: {}, slot5: {}, slot6: {}};

    function editSkills(e) {
        var slot = $(this).parents('.pokemon').attr('id');
        var link = unsafeWindow.pokeTeam[slot].link;
        var name = unsafeWindow.pokeTeam[slot].name;
        e.preventDefault();
        $.get(link, function (data) {
            data = $(data);
            var dropdown = data.find('.mws-datatable td select');
            var skills = dropdown[0].innerHTML;
            var skillDiv = $('#pokeSkills');
            skillDiv.children().remove();
            skillDiv.append(
                '<div class="mws-panel-header">'+
                '<span class="mws-i-24 i-table-1">'+name+"'s Moves</span>"+
                '</div>'+
                '<div class="mws-panel-body clearfix">'+
                '<form id="pokeSkillForm">'+
                '<select class="poke-select" id="pokeAtk1" name="atk1">'+skills +'</select>'+
                '<select class="poke-select" id="pokeAtk2" name="atk2">'+skills +'</select>'+
                '<select class="poke-select" id="pokeAtk3" name="atk3">'+skills +'</select>'+
                '<select class="poke-select" id="pokeAtk4" name="atk4">'+skills +'</select>'+
                '<input id="skillSubmit" type="text" name="updateSkills" class="mws-button green" value="Save Attack Order">'+
                '<button type="button" id="skillCancel" class="mws-button red">Cancel</button>'+
                '</form>'+
                '</div>'
            );
            skillDiv.find('#pokeAtk2 option[value='+dropdown[1].value+']').prop('selected', true).change();
            skillDiv.find('#pokeAtk3 option[value='+dropdown[2].value+']').prop('selected', true).change();
            skillDiv.find('#pokeAtk4 option[value='+dropdown[3].value+']').prop('selected', true).change();
            $('#skillCancel').click(function (ev) {
                ev.preventDefault();
                skillDiv.addClass('hidden');
                skillDiv.children().remove();
            });
            var pokeSkillForm = $('#pokeSkillForm');
            pokeSkillForm.submit(function (event) { event.preventDefault(); });
            $('#skillSubmit').click(function () {
                $('#pokeSkills').addClass('hidden');
                $.ajax({
                    type: 'POST',
                    url: link+'&action=SkillUpdated',
                    data: pokeSkillForm.serialize()
                });
            });
            skillDiv.removeClass('hidden');
            $('.poke-select').chosen();
        });
    }

    function hideTooltips() {
        $('#party-info > div').addClass('hidden');
    }

    function removePokemon(slot) {
        /* Slot must be in the format of slotX */
        $('#' + slot).children().remove();
        $('#'+slot).append('<div class="empty-slot" ondrop="pokeUI.dropPoke(event)" ondragover="pokeUI.allowPokeDrop(event)"></div>');
        $('#'+slot+'info').children().remove();
        unsafeWindow.pokeTeam[slot] = {};
    }

    function addPokemon(slot, pokemon) {
        var slotInfo = $('#'+slot+'info');
        /* Slot must be in the format of slotX */
        // Add pokemon to party
        $('#'+slot).children().remove();
        $('#'+slot).append(
            '<div class="pokemon-name">' + pokemon.display_name + '</div>'+
            '<div>'+
            '<div class="poke-edit hidden">'+
            '<a href="#" class="mws-i-24 i-pencil-edit"></a>'+
            '</div>'+
            '<a href="' + pokemon.link + '" ondragstart="pokeUI.dragPoke(event)" draggable="true" target="_blank">'+
            '<img src="'+ pokemon.img + '" ondrop="pokeUI.dropPoke(event)" ondragover="pokeUI.allowPokeDrop(event)">'+
            '</a>'+
            '</div>'+
            '<div id="poke-lvl">' + 'Lv.' + pokemon.level + '</div>'+
            '<div id="hp-bar" class="mws-progressbar-exp ui-progressbar ui-widget ui-wdiget-content ui-corner-all" role="progressbar">'+
            '<div class="ui-progressbar-value ui-widget-header ui-corner-all" style="width: ' + Math.min(pokemon.hp_pcnt, 100) + '%;">'+
            '<div id="pokemon-hp" class="progress-text">' + pokemon.hp_pcnt + '%</div>'+
            '</div>'+
            '</div>'+
            '<div id="exp-bar" class="mws-progressbar-exp ui-progressbar ui-widget ui-wdiget-content ui-corner-all" role="progressbar">'+
            '<div class="ui-progressbar-value ui-widget-header ui-corner-all" style="width: ' + Math.min(pokemon.exp_pcnt, 100) + '%;">'+
            '<div id="pokemon-hp" class="progress-text">' + pokemon.exp_pcnt + '%</div>'+
            '</div>'+
            '</div>'
        );

        // Fill info div
        slotInfo.children().remove();
        slotInfo.append();
        slotInfo.append(
            '<table>'+
            '<thead>'+
            '<tr><th colspan="3">'+
            (function () {
                if (pokemon.nickname) {
                    return '<div class="poke-centered">' + pokemon.nickname +' (' + pokemon.name + ')</div>';
                } else {
                    return '<div class="poke-centered">' + pokemon.name + '</div>';
                }
            })() +
            '</th></tr>'+
            '<tr><th>Level</th><th>HP</th><th>Exp</th></tr>'+
            '</thead>'+
            '<tbody><tr>'+
            '<td>'+ pokemon.level + '</td>'+
            '<td>' + pokemon.hp + '/' + pokemon.max_hp + '</td>'+
            '<td>' + pokemon.exp + '/' + pokemon.max_exp + '</td>'+
            '</tr></tbody>'+
            '</table>'
        );
        slotInfo.append(
            '<table>'+
            '<thead>'+
            '<tr><th colspan="6">Effort Values</th></tr>'+
            '<tr><th>HP</th><th>Atk</th><th>Def</th><th>Spd</th><th>Spcl Atk</th><th>Spcl Def</th></tr>'+
            '<tbody><tr>'+
            '<td>' + pokemon.ev.hp + '</td>'+
            '<td>' + pokemon.ev.attack + '</td>'+
            '<td>' + pokemon.ev.defence + '</td>'+
            '<td>' + pokemon.ev.speed + '</td>'+
            '<td>' + pokemon.ev.spcl_atk + '</td>'+
            '<td>' + pokemon.ev.spcl_def + '</td>'+
            '</tr></tbody>'+
            '</thead>'+
            '</table>'
        );
        slotInfo.append(
            '<table>'+
            '<thead>'+
            '<tr><th colspan="6">Individual Values</th></tr>'+
            '<tr><th>HP</th><th>Atk</th><th>Def</th><th>Spd</th><th>Spcl Atk</th><th>Spcl Def</th></tr>'+
            '<tbody><tr>'+
            '<td>' + pokemon.iv.hp + '</td>'+
            '<td>' + pokemon.iv.attack + '</td>'+
            '<td>' + pokemon.iv.defence + '</td>'+
            '<td>' + pokemon.iv.speed + '</td>'+
            '<td>' + pokemon.iv.spcl_atk + '</td>'+
            '<td>' + pokemon.iv.spcl_def + '</td>'+
            '</tr></tbody>'+
            '</thead>'+
            '</table>'
        );
        unsafeWindow.pokeTeam[slot] = pokemon;
        slotInfo.addClass('hidden');
        $('#'+slot+' .i-pencil-edit').click(pokeUI.editSkills);
    }

    function loadPokemon(link, img, slot) {
        var pokemon = {};

        // Get pokemon page
        $.get(link.attr('href'), function (data) {
            var dataObj = $(data);

            // Get exp percent
            var re = /expbar"\)\.innerText\s=\s(.+)\s\+\s"\/"\s\+\s(.*);/;
            var expBar = re.exec(data);
            pokemon.exp_pcnt = Math.round(parseInt(expBar[1])/parseInt(expBar[2])*100);
            pokemon.exp = expBar[1];
            pokemon.max_exp = expBar[2];

            // Get monster id and image source
            pokemon.mid = link.attr('href').split('?mid=')[1];
            pokemon.img = img.attr('src');
            pokemon.link = link.attr('href');

            // Find details table
            var details = dataObj.find('.container > .mws-panel.grid_6 > .mws-panel-body > .mws-panel-content > table td');

            // Iterate over columns
            $(details).each(function (idx, obj) {
                var txt = $(obj).text().trim() || $(obj).find('input').attr('value');
                // Skip blank lines
                if (txt) {
                    // Parse data, this is ugly but there isn't any specific classes or id's in the table
                    if (txt.includes('Name: ')) {
                        var name = txt.split('Name: ')[1].split(' (');
                        if (name.length > 1) {
                            pokemon.nickname = name[0];
                            pokemon.name = name[1].slice(0, -1);
                        } else {
                            pokemon.nickname = false;
                            pokemon.name = name[0];
                        }
                        pokemon.display_name = pokemon.nickname || pokemon.name;
                    } else if (txt.includes('Level: ')) {
                        pokemon.level = txt.split('Level: ')[1];
                    } else if (txt.includes('Health: ')) {
                        var hp = txt.split('Health: ')[1].split(' / ');
                        pokemon.hp = parseInt(hp[0]);
                        pokemon.max_hp = parseInt(hp[1]);
                        pokemon.hp_pcnt = Math.round(pokemon.hp / pokemon.max_hp * 100);
                    }
                }
                // HP   Attack  Defence     Speed   Special Attack  Special Defence
                var cells = dataObj.find('.mws-datatable td');
                pokemon.iv = {
                    hp: cells[4].innerHTML,
                    attack: cells[5].innerHTML,
                    defence: cells[6].innerHTML,
                    speed: cells[7].innerHTML,
                    spcl_atk: cells[8].innerHTML,
                    spcl_def: cells[9].innerHTML
                };
                pokemon.ev = {
                    hp: cells[10].innerHTML,
                    attack: cells[11].innerHTML,
                    defence: cells[12].innerHTML,
                    speed: cells[13].innerHTML,
                    spcl_atk: cells[14].innerHTML,
                    spcl_def: cells[15].innerHTML
                };
                addPokemon(slot, pokemon);
            });
        });
    }

    function loadParty() {
        $.ajax(
            {
                url: '/team',
                cache: true,
                success: function (data) {
                    // Empty slots
                    var emptySlots = $(data).find('.full-box > .box-empty');
                    // Clear empty slots
                    $.each(emptySlots, function (idx, obj) {
                        var slot = 'slot' + parseInt($(obj).attr('data-spot'));
                        removePokemon(slot);
                    });

                    // Full slots
                    var team = $(data).find('.full-box > .box');
                    // Get pokemon data
                    $.each(team, function (idx, obj) {
                        var slot = 'slot' + parseInt($(obj).attr('data-spot'));
                        var img = $(obj).find('img');
                        var link = $(obj).find('a');
                        loadPokemon(link, img, slot);
                    });
                }
            });
    }

    function moveToPC(slot, callback) {
        $.get(
            '/xml/team.xml.php',
            {
                userTeam: slot,
                userMonsters: 0,
                rand: (Math.random() * 1000000)
            },
            callback
        );
    }

    function moveFromPC(slot, mid, callback) {
        $.get(
            '/xml/team.xml.php',
            {
                userTeam: slot,
                userMonsters: mid,
                rand: (Math.random() * 1000000)
            },
            callback
        );
    }

    function hoverEnterSlot () {
        var slot = $(this);
        var infoSlot = $('#' + slot.attr('id') + 'info');
        var edit = slot.find('.poke-edit');
        var pos = slot.position();
        var height = slot.outerHeight();
        var viewport = (pos.left + infoSlot.width()) - $(window).width();

        edit.removeClass('hidden');
        infoSlot.removeClass('hidden');
        infoSlot.css('top', pos.top + height + 'px');
        if (viewport > 0) {
            infoSlot.css('left', (pos.left - viewport) + 'px');
        } else {
            infoSlot.css('left', pos.left + 'px');
        }
    }

    function hoverExitSlot () {
        var slot = $(this);
        var edit = slot.find('.poke-edit');
        var infoSlot = $('#' + slot.attr('id') + 'info');
        infoSlot.addClass('hidden');
        edit.addClass('hidden');
    }

    unsafeWindow.pokeUI = {};

    unsafeWindow.pokeUI.allowPokeDrop = function (ev) {
        ev.preventDefault();
    };

    unsafeWindow.pokeUI.dragPoke = function (ev) {
        ev.dataTransfer.setData("text", $(ev.target).parents('.pokemon')[0].id);
        hideTooltips();
    };

    unsafeWindow.pokeUI.dropPoke = function (ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData('text');
        var moveFromSlot = $(document.getElementById(data)).attr('id').split('slot')[1];
        var moveToSlot = $(ev.target).parents('div.pokemon').attr('id').split('slot')[1];
        var midFrom = unsafeWindow.pokeTeam['slot'+moveFromSlot].mid || false;
        var midTo = unsafeWindow.pokeTeam['slot'+moveToSlot].mid || false;

        // Ignore drop on same slot
        if (moveFromSlot !== moveToSlot) {
            // Put the pokemon you want to move into the PC box
            moveToPC(moveFromSlot, function() {
                // If the slot you're trying to move a pokemon into is not empty
                if (midTo) {
                    // Put that pokemon into the PC box
                    moveToPC(moveToSlot, function () {
                        // Move your pokemon from the PC back into your party
                        moveFromPC(moveToSlot, midFrom, function () {
                            moveFromPC(moveFromSlot, midTo, loadParty);
                        });
                    });
                } else {
                    // Move your pokemon from the PC into your target slot
                    moveFromPC(moveToSlot, midFrom, loadParty);
                }
            });
        }
    };

    unsafeWindow.pokeUI.editSkills = editSkills;

    // Build div html
    var partyDiv = '<div id="party">';
    var infoDiv = '<div id="party-info">';
    for (var i = 1; i < 7; i++) {
        var slot = 'slot' + i;
        var slotInfo = slot + 'info';
        partyDiv += '<div class="pokemon" id="' + slot + '"><div class="empty-slot" ondrop="pokeUI.dropPoke(event)" ondragover="pokeUI.allowPokeDrop(event)"></div></div>';
        infoDiv += '<div id="' + slotInfo + '" class="hidden info-slot"></div>';
    }
    partyDiv += '</div>';
    infoDiv += '</div>';

    // Insert divs
    $('#divPm').before(partyDiv);
    $('#party').after(infoDiv);
    $('.container').append('<div class="mws-panel hidden" id="pokeSkills"></div>');
    setTimeout(function () {
        var loc_dg = $('#location_data_grid');
        if (loc_dg.length > 0) {
            loc_dg.insertAfter('#party');
            var body = $('#location_data_grid > div.mws-panel-body');
            $('#location_data_grid > div.mws-panel-header > span').hover(function () {
                if ($(window).width() <= 860) {
                    body.attr('style', 'display: block !important');
                }
            }, function () {
                if ($(window).width() <= 860) {
                    body.hide();
                }
            });
        }
    }, 1000);

    // Add onhover events
    $('.pokemon').hover(hoverEnterSlot, hoverExitSlot);

    // Initially load party
    loadParty();

    // Update after battle
    setInterval(function () {
        if (prevInBattle === true && bInBattle === false) {
            loadParty();
        }
        prevInBattle = bInBattle;
    }, 1000);

    // Update after healing
    setInterval(function () {
        if (activeScript.length > 0) {
            var scriptData = activeScript[0].args;
            if (lastLine !== scriptData) {
                if (scriptData == 'Your Pokemon are fighting fit.' || scriptData === '...And done. Your Pokemon are good to go!') {
                    loadParty();
                }
                lastLine = scriptData;
            }
        }
    }, 10);
})();
