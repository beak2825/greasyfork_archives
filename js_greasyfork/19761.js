// ==UserScript==
// @name        Jz Warlight
// @namespace   https://greasyfork.org/en/users/44200-jz
// @version     1.4.4
// @grant       none
// @match https://www.warlight.net/*
// @match https://www.warzone.com/*
// @description Warzone/Warlight script that allows note-taking in games. It also includes statistics-like features for Warzone Idle.
// @license GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/19761/Jz%20Warlight.user.js
// @updateURL https://update.greasyfork.org/scripts/19761/Jz%20Warlight.meta.js
// ==/UserScript==

var idlePermanent = {};
var idleObject = {}
var artifacts_list = [];
var scannedSpan;
var idleSelected = null;
var idleObjectArchive = null;
var artifact_rarity = "Owned";
var loadedLevel = false;

// Change the below to true to show some potentially
// confusing and less user-friendly features
var showDevelopmentFeatures = false;
var drafts = [];
main();

function main() {
    try{
        setupSettings();

        //var filter_setting = localStorage.getItem('setting_extra_filters');
        //if(pageIsDashboard()) {
        //    if(filter_setting == 'true') {
        //        //$("#MyGamesFilter").append('<option value="0">Games that are active</option>');
        //        $("#MyGamesFilter").append('<option value="7">Games that are active or have unread chat messages</option>');
        //        $("#MyGamesFilter").append('<option value="3">Weird Filter (Non-Archived Games)</option>');
        //    }
        //}
        if(pageIsTournaments()) {
            var muli_setting = localStorage.getItem('setting_enhance_muli');
            if(muli_setting == 'true') {
                // Add filters for tournaments, to expand the functionality Muli provided
                var filter = $('<select id="tournamentFilter" title="After updating the tournament data using Muli\'s script, pick a filter." style="float: right;margin: 0 10px;"/>');
                filter.append($('<option value="showAll">Show all</option>'));
                filter.append($('<option value="showGamesLeft">Tournaments with games left</option>'));
                filter.append($('<option value="showInProgress">Tournaments with games in progress</option>'));
                filter.append($('<option value="showNotEliminated">Tournaments that I am not eliminated from</option>'));
                filter.append($('<option value="showAlmostDone">Tournaments that are almost done</option>'));
                filter.append($('<option value="showCoin">Coin Tournaments</option>'));
                filter.on("change", function () {
                    var selected = $( this ).val();

                    var tds = $("td .tournamentData");
                    for(var i = 0; i < tds.length; i++) {
                        var td = tds[i];
                        var parentTr = $(td).parent('tr');
                        if(selected == "showAll") {
                            parentTr.show();
                        } else if(selected == "showGamesLeft") {
                            if(td.innerHTML.indexOf('<font color="#858585">Games left:</font> None  <br>') > 0) {
                                parentTr.hide();
                            } else {
                                parentTr.show();
                            }
                        } else if(selected == "showInProgress") {
                            if(td.innerHTML.indexOf('<font color="#858585">Playing:</font> 0  <br>') > 0) {
                                parentTr.hide();
                            } else if(td.innerHTML.indexOf('<font color="#858585">Playing:</font>') > 0) {
                                parentTr.show();
                            } else {
                                parentTr.hide();
                            }
                        } else if(selected == "showNotEliminated") {
                            // Show round robins, tournaments with games in progress, and tournaments with games left
                            if(parentTr.html().indexOf('Round robin tournament') >= 0) {
                                parentTr.show();
                            } else if(td.innerHTML.indexOf('<font color="#858585">Playing:</font>') > 0
                                      && td.innerHTML.indexOf('<font color="#858585">Playing:</font> 0  <br>') == -1) {
                                parentTr.show();
                            } else if(td.innerHTML.indexOf('<font color="#858585">Games left:</font> None  <br>') == -1) {
                                parentTr.show();
                            } else {
                                parentTr.hide();
                            }
                        }  else if(selected == "showAlmostDone") {
                            if(td.innerHTML.indexOf('Almost done') > 0) {
                                parentTr.show();
                            } else {
                                parentTr.hide();
                            }
                        } else if(selected == "showCoin") {
                            if(parentTr.html().indexOf('SmallCoins.png') != -1) {
                                parentTr.show();
                            } else {
                                parentTr.hide();
                            }
                        }
                    }
                });
                $("#MyTournamentsTable h2").after(filter);
            }
        }
        if(pageIsPastTournaments()) {
            if(filter_setting == 'true') {
                //$("#Filter").append('<option value="4">Actionable</option>');
                $("#Filter").append('<option value="5">Tournaments with unread chat</option>');
                //$("#Filter").append('<option value="6">Actionable or unread chat</option>');
                //$("#Filter").append('<option value="8">Not Complete that I joined</option>');
            }
        }
        if(pageIsGame()) {
           var note_setting = localStorage.getItem('setting_enable_notes');
            if(note_setting == 'true') {
               setupNotes();
            }
        }
		// Reimplement Alt tagging
                    /*// Tag alts (alts retrieved from the library)
                    for(var main_count = 0; main_count < mains.length; main_count++) {
                        var main = mains[main_count];
                        for(var alt_count = 0; alt_count < main.alts.length; alt_count++) {
                            var alt = main.alts[alt_count];
                            if(poster_id == alt) {
                                var username = poster_cell.html();
                                poster_cell.html(username + " (" + main.name + ")");
                            }
                        }
                    }*/

        if(pageIsClanWars()) {
            setupClanWarsFeatures();
        }

        if(pageIsIdle()) {
            var idle_setting = localStorage.getItem('setting_idle_features');
            if(idle_setting == 'true') {
                setupIdleFeatures();
            }
        }
    } catch(err) {
        console.log(err);
    }
}

function setupSettings() {
    $("#AccountDropDown").parent().find("div .dropdown-divider").before('<div class="dropdown-item" id="jz-userscript-menu" style="cursor:pointer" data-toggle="modal" data-target="#settingsdialog">Jz\'s Userscript</div>');

    var modalhtml = ''
    modalhtml += '<div class="modal" tabindex="-1" role="dialog" id="settingsdialog">'
    modalhtml += '  <div class="modal-dialog" role="document" style="max-height:95%;overflow-y:auto;">'
    modalhtml += '    <div class="modal-content">'
    modalhtml += '      <div class="modal-header" style="color:#b3b081;background-color:#330000;height:40px">'
    modalhtml += '        <h5 class="modal-title">Settings (Automatically Saved)</h5>'
    modalhtml += '        <button type="button" class="close" data-dismiss="modal" aria-label="Close">'
    modalhtml += '          <span aria-hidden="true" style="color:#b3b081">&times;</span>'
    modalhtml += '        </button>'
    modalhtml += '      </div>'
    modalhtml += '      <div class="modal-body" id="settingsbody" style="color:#b3b081;background-color:#171717">'
    modalhtml += '      </div>'
    modalhtml += '      <div class="modal-body" id="idlebody" style="color:#b3b081;background-color:#171717">'
    modalhtml += '      </div>'
    modalhtml += '    </div>'
    modalhtml += '  </div>'
    modalhtml += '</div>'
    var settings_modal=$(modalhtml)
    $('body').append(settings_modal)

    var settings_body = $("#settingsbody")
    addSetting(settings_body, "Enable Note Taking", "setting_enable_notes", "true", "Allow note taking in games");
    //addSetting(settings_body, "Add extra filters", "setting_extra_filters", "true", "Add extra filters to the dashboard and past tournaments pages");
    addSetting(settings_body, "Add features to enhance Muli's userscript", "setting_enhance_muli", "true", "If muli's script is installed, add features to enhance it.");
    addSetting(settings_body, "Enable Idle Features \(In Development\)", "setting_idle_features", "true", "Enable idle screen scanning and calculations. These features provide approximations only.");
    //addSetting(settings_body, "Enable Special Features (fun feature)", "setting_extra_features", "false", "Enable future april fools features");
    //addSetting(settings_body, "Allow Audio Features (fun feature)", "setting_audio_features", "false", "Enable potential april fools features that use audio");
    refreshIdleLevels();
}

function addSetting(settings_dialog, label, id, default_val, title) {

    var setting_header = $('<label for="setting_' + id + '" title="' + title + '">' + label + '</label>');
    var setting = $('<input type="checkbox" id="setting_' + id + '"/>');
    settings_dialog.append(setting);
    settings_dialog.append(setting_header);
    settings_dialog.append($('<br/>'));
    var stored_value = localStorage.getItem(id);
    if(stored_value == null) {
        stored_value = default_val;
        localStorage.setItem(id, default_val);
    }
    if(stored_value == 'true') {
        setting.prop('checked', true);
    }
    setting.on('change', function() {
        if(setting.prop('checked')) {
            localStorage.setItem(id, 'true');
        } else {
            localStorage.setItem(id, 'false');
        }
    });
}

function refreshIdleLevels() {
    var idle_body = $("#idlebody");
    idle_body.empty();
    idle_body.append($('<div style="font-weight:bold">Archived Idle Levels:</div>'));
    idleObjectArchive = getIdleObjectArchiveFromStorage();
    if(idleObjectArchive.length == 0) {
        idle_body.append($('<div>None</div>'))
    }
    for(var i = 0; i < idleObjectArchive.length; i++) {
        var idleObj = idleObjectArchive[i];
        var idle_level_div = $('<div></div>');
        var idleobj_display = $('<div><span id="json_title"></span><br/><textarea id="IdleJSONOutput" rows="10" cols="50"/></div>');
        idleobj_display.hide()
        idle_level_div.append(idleobj_display);

        var view_button = $('<button type="button" class="btn btn-primary" id="View' + i + '" aria-label="View ' + idleObj.level + '">JSON</button>');
        view_button.attr('title','View JSON for "' + idleObj.level + '"');
        view_button.on('click', function() {
            var level = this.title.substring(this.title.indexOf("\"") + 1);
            level = level.substring(0, level.indexOf("\""));
            viewIdleObjectFromArchive(level);
        });
        idle_level_div.append(view_button);
        idle_level_div.append($('<span>&nbsp;</span>'));

        // Load the stats into the window if we're on the idle page
        if(pageIsIdle()) {
            var load_button = $('<button type="button" class="btn btn-primary" id="Load' + i + '" aria-label="Load ' + idleObj.level + ' into the stats window.">Load</button>');
            load_button.attr('title','Load "' + idleObj.level + '" into the stats window.');
            load_button.on('click', function() {
                archiveIdleObject(idleObject);
                var level = this.title.substring(this.title.indexOf("\"") + 1);
                level = level.substring(0, level.indexOf("\""));
                idleObject = getArchivedIdleObject(level);
                outputResults(idleObject);
                loadedLevel = true;
                scannedSpan.text("Scanning Paused. Stats for " + level + '. Press Scan to resume scanning current level.');
            });
            idle_level_div.append(load_button);
            idle_level_div.append($('<span>&nbsp;</span>'));
        }

        var remove_button = $('<button type="button" class="btn btn-primary" id="Remove' + i + '" aria-label="Remove">Remove</button>');
        remove_button.attr('title',idleObj.level);
        remove_button.on('click', function() {
            removeIdleObjectFromArchive(this.title);
        });
        idle_level_div.append(remove_button);
        idle_level_div.append($('<span>&nbsp;' + idleObj.level + '</span>'))
        idle_body.append(idle_level_div);
    }
}

function insertCss( code ) {
    var style = document.createElement('style');
    style.type = 'text/css'

    if (style.styleSheet) {
        // IE
        style.styleSheet.cssText = code;
    } else {
        // Other browsers
        style.innerHTML = code;
    }

    document.getElementsByTagName("head")[0].appendChild( style );
}

// **************** Notes ****************

function setupNotes() {
    // Create the minimized notes
    var modalhtml = ''
    modalhtml += '<div class="panel" tabindex="-1" id="notesdialogmini">'
    modalhtml += '  <div class="modal-dialog" role="document" style="border: 2px solid;border-radius: 5px;max-width:100px;position:fixed;bottom:0px;right:0px;margin:0px;padding:0px">'
    modalhtml += '    <div class="modal-content" style="color:#b3b081">'
    modalhtml += '      <div class="modal-header" id="notesheadermini" style="border:0px;color:#b3b081;background-color:#330000;padding:5px;height:15px">'
    modalhtml += '        <span aria-hidden="true" id="notesopen" style="cursor:pointer;font-size:x-small">Notes</span>'
    modalhtml += '      </div>'
    modalhtml += '    </div>'
    modalhtml += '  </div>'
    modalhtml += '</div>'
    var notes_modal2=$(modalhtml)
    $('body').append(notes_modal2)

    // Create the popup for the notes
    modalhtml = ''
    modalhtml += '<div class="panel" tabindex="-1" id="notesdialog">'
    modalhtml += '  <div class="modal-dialog" role="document" style="max-width:340px;position:fixed;bottom:0px;right:0px;margin:0px">'
    modalhtml += '    <div class="modal-content">'
    modalhtml += '      <div class="modal-header" id="notesheader" style="color:#b3b081;background-color:#330000;height:35px">'
    modalhtml += '        <h5 class="modal-title">Notes</h5>'
    modalhtml += '        <button type="button" class="close" id="notesminimize" aria-label="Minimize">'
    modalhtml += '          <span aria-hidden="true" style="color:#b3b081">-</span>'
    modalhtml += '        </button>'
    modalhtml += '      </div>'
    modalhtml += '      <div class="modal-body" id="notesbody" style="color:#b3b081;background-color:#171717">'
    modalhtml += '          <textarea id="GameNotes" rows="4" cols="30"/>'
    modalhtml += '      </div>'
    modalhtml += '    </div>'
    modalhtml += '  </div>'
    modalhtml += '</div>'
    var notes_modal=$(modalhtml)
    notes_modal.hide();
    $('body').append(notes_modal)

    // Add the notes header to the Multi-Player Menu
    var notesHeader = $('<div class="dropdown-item" id="NotesHeader" style="cursor:pointer">Notes</div>');
    $("#CreateGameLink").after(notesHeader);

    // Setup note display events
    notesHeader.on('click', function() {
        notes_modal.show();
        notes_modal2.hide();
    });

    var notes_minimize=$("#notesminimize")
    notes_minimize.on('click', function() {
        notes_modal.hide();
        notes_modal2.show();
    });

    var notes_open=$("#notesopen")
    notes_open.on('click', function() {
        notes_modal.show();
        notes_modal2.hide();
    });

    // Parse the gameid
    var gameid = getGameID();

    // Create the events
    // Save the note automatically
    var gameNotes = $("#GameNotes")
    gameNotes.on('change', function() {
        saveNote(gameNotes, gameid);
    });

    // Populate the notes field and set the background color for the notes
    var notes = getNotesFromStorage();
    var note = notes[gameid];
    if(note != null && note.value != null && note.value.length > 0) {
        gameNotes.val(note.value);
        notes_modal.show();

        // Resaving it updates the timestamp
        saveNote(gameNotes, gameid);
    }
    colorNotesHeader(gameNotes);
}

function getGameID() {
    var gameid = location.href.substring(location.href.indexOf('GameID=') + 7)
    if(gameid.indexOf('&') > 0) {
        gameid = gameid.substring(0, gameid.indexOf('&'));
    }
    return gameid;
}

function getNotesFromStorage() {
    var notesString = localStorage.getItem("notes");
    if(notesString != null) {
        return JSON.parse(notesString);
    } else {
        return {};
    }
}

function saveNotesToStorage(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function saveNote(gameNotes, gameid) {
    var notes = getNotesFromStorage();
    var note = notes[gameid];
    if(note == null) {
        note = {};
    }
    note.date = new Date();
    note.value = gameNotes.val();
    notes[gameid] = note;
    if(note.value == null || note.value.length == 0) {
        delete notes[gameid];
    }
    saveNotesToStorage(notes);
    colorNotesHeader(gameNotes);
}

function colorNotesHeader(gameNotes) {
    var notesHeader = $("#NotesHeader")
    var miniNotesHeader = $("#notesheadermini")
    miniNotesHeader.css('font-style','normal');
    var color = "";
    if(gameNotes.val() != null && gameNotes.val().length > 0) {
        color = '#FFAA00';
        miniNotesHeader.css('font-style','italic');
    }
    notesHeader.css('color',color);
}

// **************** Clan Wars Features ****************
function setupClanWarsFeatures() {
    var modalhtml = ''
    modalhtml = ''
    modalhtml += '<div class="panel" tabindex="-1" id="cwdialog">'
    modalhtml += '  <div class="modal-dialog" role="document" style="max-width:600px;position:fixed;bottom:0px;right:0px;margin:0px">'
    modalhtml += '    <div class="modal-content">'
    modalhtml += '      <div class="modal-header" id="cwheader" style="color:#b3b081;background-color:#330000;height:35px">'
    modalhtml += '        <h5 class="modal-title">Clan War Games (Copy/Paste to Spreadsheet)</h5>'
    modalhtml += '        <button type="button" class="close" id="cwclose" aria-label="Minimize">'
    modalhtml += '          <span aria-hidden="true" style="color:#b3b081">x</span>'
    modalhtml += '        </button>'
    modalhtml += '      </div>'
    modalhtml += '      <div class="modal-body" id="cwbody" style="color:#b3b081;background-color:#171717">'
    modalhtml += '          <textarea id="cw_output" rows="10" cols="100"/>'
    modalhtml += '      </div>'
    modalhtml += '    </div>'
    modalhtml += '  </div>'
    modalhtml += '</div>'

    var cw_modal=$(modalhtml)
    cw_modal.hide();
    $('body').append(cw_modal)


    var cw_close=$("#cwclose")
    cw_close.on('click', function() {
        cw_modal.hide();
    });

    $(document).keydown(function(e){
        // Letter "s"
        if(e.keyCode == 83){
            scanClanWarsGames();
        }
    });
}

function scanClanWarsGames() {
    var games = [];
    $('*[id*=ujs_row]').each(function() {
        var element = $(this);
        var id = element.attr("id");
        var outcome = "?";
        var link = null;
        element.find("a").each(function() {
            var tmp_link =  $(this).attr("href");
            if(tmp_link.indexOf("GameID") != -1) {
                link = tmp_link;
            }
        });
        var test = null;
        var template = null;
        var territory = null;
        var players = null;
        if(element.html().indexOf("UIButton-198225.png") > 0) {
            outcome = "w";
        } else if(element.html().indexOf("UIButton-9A2929.png") > 0) {
            outcome = "l";
        }

        var index = 0;
        element.find(".ujsText").each(function() {
            if(index == 0) {
                test = this.textContent;
            }
            if(index == 1) {
                template = this.textContent
            }
            if(index == 2) {
                territory = this.textContent
            }
            if(index == 3) {
                players = this.textContent.replace("Game with ","").replace("Free win by ","")
            }
            index++;
        });
        if(index == 4 && test == "V") {
            var game = {
                "id":id,
                "link":link,
                "outcome":outcome,
                "template":template,
                "territory":territory,
                "players":players
            }
            games.push(game)
        }
    });
    if(games.length > 0) {
        var output = ''
        for(var i = games.length - 1; i >= 0; i--) {
            output += games[i].template + '\t'
            output += games[i].territory + '\t'
            var players = games[i].players.split(",");
            var player1 = players[0];
            var player2 = "";
            if(players.length == 2) {
                player2 = players[1];
            }
            output += player1 + '\t'
            output += player2 + '\t'
            output += games[i].outcome
            output += '\n'
        }
        $("#cw_output").val(output);
        $("#cwdialog").show();
    }

}

// **************** Idle Features ****************

function setupIdleFeatures() {
    insertCss(".artifact_insane { color:#FFFF00; }")
    insertCss(".artifact_legendary { color:#FFC200; }")
    insertCss(".artifact_epic { color:rgb\(255, 0, 237\); }")
    insertCss(".artifact_rare { color:rgb\(108, 115, 209\); }")
    insertCss(".artifact_uncommon { color: rgb\(25, 130, 37\); }")
    insertCss(".artifact_common { color:rgb\(255, 255, 255\); }")
    insertCss(".artifact_poor { color:rgb\(186, 186, 188\); }")

    insertCss(".jz_table td { padding: 5px}")
    var modalhtml = ''

    // Instructions Modal
    modalhtml = ''
    modalhtml += '<div class="panel" tabindex="-1" id="instructionsdialog">'
    modalhtml += '  <div class="modal-dialog" role="document" style="max-width:40%;position:absolute;top:10%;left:30%;margin:0px">'
    modalhtml += '    <div class="modal-content">'
    modalhtml += '      <div class="modal-header" id="instructionsheader" style="color:#b3b081;background-color:#330000;height:35px">'
    modalhtml += '        <h5 class="modal-title">Instructions (Jz\'s Userscript)</h5>'
    modalhtml += '        <button type="button" class="close" id="instructionsminimize" aria-label="Close">'
    modalhtml += '          <span aria-hidden="true" style="color:#b3b081">x</span>'
    modalhtml += '        </button>'
    modalhtml += '      </div>'
    modalhtml += '      <div class="modal-body" id="instructionsbody" style="color:#b3b081;background-color:#171717;font-size:80%">'
    modalhtml += '          <span>This script is in development. It is recommended that you verify the results.<br/><br/>'
    modalhtml += '          This feature allows you to construct additional statistics for recipes, armies, and money.'
    modalhtml += '          Certain features may be restricted if the Statistics advancement is not sufficiently upgraded.'
    modalhtml += '          The script works by reading the values displayed on the screen. '
    modalhtml += '          Because the values displayed are rounded, the resulting calculations are only estimates.'
    modalhtml += '          The most recent scan results for each level are saved to local storage. '
    modalhtml += '          Go to the userscript settings (under your username) to remove old level scan data if the local storage becomes too full.'
    modalhtml += '          <br/><br/>Follow these instructions (in any order) to make data available to the script:'
    modalhtml += '          <br/>Step 1: Go to the crafters, click "Change Recipe" to bring up the recipes, then press "s".'
    modalhtml += '          <br/>Step 2: (Statistics 1) Open the "Money Stats" pop-up (top right), then press "s".'
    modalhtml += '          <br/>Step 3: (Statistics 1) Open the "Army Stats" pop-up (top right), then press "s".'
    modalhtml += '          <br/>Step 4: (Statistics 2) On the "Army Camps" tab, open the Modifiers pop-up, then press "s".'
    modalhtml += '          <br/>Step 5: On the "Advancements" tab, open the Artifacts pop-up, then press "s".'
    modalhtml += '          <br/>Once everything is scanned, you can select the statistics you wish to view.'
    modalhtml += '          <br/><br/>It is very important to keep scans up to date in order to ensure correct results.'
    modalhtml += '          Repeat the above steps after swapping artifacts, unlocking techs, unlocking recipes, upgrading camps, claiming clan war rewards, or for any other change.'
    modalhtml += '          </span>'
    modalhtml += '      </div>'
    modalhtml += '    </div>'
    modalhtml += '  </div>'
    modalhtml += '</div>'
    var instructions_modal=$(modalhtml)
    instructions_modal.hide();
    $('body').append(instructions_modal);

    var instructions_minimize=$("#instructionsminimize")
    instructions_minimize.on('click', function() {
        instructions_modal.hide();
    });

    // Create the minimized idle button
    modalhtml = ''
    modalhtml += '<div class="panel" tabindex="-1" id="notesdialogmini">'
    modalhtml += '  <div class="modal-dialog" role="document" style="border: 2px solid;border-radius: 5px;max-width:100px;position:fixed;bottom:0px;left:0px;margin:0px;padding:0px">'
    modalhtml += '    <div class="modal-content" style="color:#b3b081">'
    modalhtml += '      <div class="modal-header" id="idleheadermini" style="border:0px;color:#b3b081;background-color:#330000;padding:5px;height:15px">'
    modalhtml += '        <span aria-hidden="false" id="idlemenuopen" style="cursor:pointer;font-size:x-small">Idle Menu</span>'
    modalhtml += '      </div>'
    modalhtml += '    </div>'
    modalhtml += '  </div>'
    modalhtml += '</div>'
    var idle_modal2=$(modalhtml)
    idle_modal2.hide();
    $('body').append(idle_modal2)
    var max_height = $(window).height() - 290;
    // Create the popup for Idle
    modalhtml = ''
    modalhtml += '<div class="panel" tabindex="-1" id="idledialog">'
    modalhtml += '  <div class="modal-dialog" role="document" style="min-width:300px;max-width:25%;position:fixed;bottom:0px;left:0px;margin:0px">'
    modalhtml += '    <div class="modal-content">'
    modalhtml += '      <div class="modal-header" id="idleheader" style="color:#b3b081;background-color:#330000;height:35px">'
    modalhtml += '        <h5 class="modal-title">Beta! Idle Stats (Jz\'s Userscript)</h5>'
    modalhtml += '        <button type="button" class="btn-link" title="Instructions" id="idleinstructionbutton" aria-label="Instructions">'
    modalhtml += '          <span aria-hidden="true" style="color:#b3b081">?</span>'
    modalhtml += '        </button>'
    modalhtml += '        <button type="button" class="close" title="Minimize" id="idleminimize" aria-label="Minimize">'
    modalhtml += '          <span aria-hidden="true" style="color:#b3b081">-</span>'
    modalhtml += '        </button>'
    modalhtml += '      </div>'
    modalhtml += '      <div class="modal-body" id="idlebody" style="color:#b3b081;background-color:#171717">'
    modalhtml += '          <span id="scanned">Click "Scan" or press "s" to scan. <br/><br/>Items to open and scan: Modifiers, Money Stats (pop-up), Army Stats (pop-up), Crafter Recipes (Change Recipe)</span><br/>'
    modalhtml += '          <hr style="border-top:3px dashed bbb"/>'
    modalhtml += '          <div id="IdleOutput" style="font-size:80%;max-height:' + max_height+ 'px;overflow-y:auto;"></div><br/>'
    modalhtml += '          <button type="button" id="idlescanbutton" aria-label="Scan">'
    modalhtml += '            <span style="color:#000000">Scan</span>'
    modalhtml += '          </button>'
    modalhtml += '          <button type="button" id="idlerecipesbutton" aria-label="Recipes">'
    modalhtml += '            <span style="color:#000000">Recipes</span>'
    modalhtml += '          </button>'
    modalhtml += '          <button type="button" id="idlepercentsbutton" aria-label="Percentages">'
    modalhtml += '            <span style="color:#000000">Income</span>'
    modalhtml += '          </button>'
    modalhtml += '          <button type="button" id="idleartifactbutton" aria-label="Artifact">'
    modalhtml += '            <span style="color:#000000">Artifact</span>'
    modalhtml += '          </button>'
    modalhtml += '          <button type="button" id="idleotherbutton" aria-label="Other">'
    modalhtml += '            <span style="color:#000000">Other</span>'
    modalhtml += '          </button>'
    modalhtml += '      </div>'
    modalhtml += '    </div>'
    modalhtml += '  </div>'
    modalhtml += '</div>'

    var idle_modal=$(modalhtml)
    idle_modal.show();
    $('body').append(idle_modal)

    var instructions_open=$("#idleinstructionbutton")
    instructions_open.on('click', function() {
        instructions_modal.show();
    });

    var idle_minimize=$("#idleminimize")
    idle_minimize.on('click', function() {
        idle_modal.hide();
        idle_modal2.show();
    });

    var idle_open=$("#idlemenuopen")
    idle_open.on('click', function() {
        idle_modal.show();
        idle_modal2.hide();
    });

    var idle_scan_click=$("#idlescanbutton")
    idle_scan_click.on('click', function() {
        scanIdle();
    });

    var idle_recipes_click=$("#idlerecipesbutton")
    idle_recipes_click.on('click', function() {
        idleSelected = "recipes";
        if(!loadedLevel) {
            scanIdle();
        } else {
            outputResults(idleObject);
        }
    });

    var idle_percents_click=$("#idlepercentsbutton")
    idle_percents_click.on('click', function() {
        idleSelected = "percents";
        if(!loadedLevel) {
            scanIdle();
        } else {
            outputResults(idleObject);
        }
    });

    var idle_artifact_click=$("#idleartifactbutton")
    idle_artifact_click.on('click', function() {
        idleSelected = "artifact";
        if(!loadedLevel) {
            scanIdle();
        } else {
            outputResults(idleObject);
        }
    });

    var idle_other_click=$("#idleotherbutton")
    idle_other_click.on('click', function() {
        idleSelected = "other";
        if(!loadedLevel) {
            scanIdle();
        } else {
            outputResults(idleObject);
        }
    });

    scannedSpan = $("#scanned");

    $(document).keydown(function(e){
        //CTRL + V keydown combo
        //if(e.ctrlKey && e.keyCode == 86){
        if(e.keyCode == 83){
            scanIdle();
        }
    });

    var idleObject_tmp = getIdleObjectFromStorage();
    if(idleObject_tmp != null) {
        idleObject = idleObject_tmp;
        if(idleObject.scan_times == null) {
            idleObject.scan_times = createScanTimes();
            saveIdleObjectToStorage(idleObject);
        }
        var output = 'Retrieved level "' + idleObject.level + '" from storage.'
        var idleOut = $("#IdleOutput");
        idleOut.html(output);
    }
    setIdlePermanentFromStorage();

    // Remove this in the future
    // Update permanent upgrades to new format
    if(idleObject.artifacts && idleObject.artifacts.length > 0) {
        if(idlePermanent.artifacts == null) {
            idlePermanent.artifacts = idleObject.artifacts;
            idlePermanent.scan_times.artifacts = idleObject.scan_times.artifacts;
            saveIdlePermanentToStorage();
        }
        delete idleObject.artifacts;
        delete idleObject.scan_times.artifacts;
        saveIdleObjectToStorage(idleObject);
    }
    setupArtifactsLookup()
}

function setupArtifactsLookup() {
    artifacts_list = [];
    // Passives
    artifacts_list.push({"name":"Alloy Values","value":[0.035],"type":"+"});
    artifacts_list.push({"name":"Army Camp Boost","value":[0.05],"type":"+"});
    artifacts_list.push({"name":"Army Cache Boost","value":[0.01],"type":"+"});
    artifacts_list.push({"name":"Army Camp Discount","value":[0.0075],"type":"x"});
    artifacts_list.push({"name":"Bonus Money Boost","value":[0.05],"type":"+"});
    artifacts_list.push({"name":"Cache Boost","value":[0.004],"type":"+"});
    artifacts_list.push({"name":"Craft Double","value":[0.0075],"type":"+"});
    artifacts_list.push({"name":"Draft Boost","value":[0.02],"type":"+"});
    artifacts_list.push({"name":"Efficient Crafters","value":[0.005],"type":"x"});
    artifacts_list.push({"name":"Efficient Smelters","value":[0.005],"type":"x"});
    artifacts_list.push({"name":"Hospital Boost","value":[0.01],"type":"+"});
    artifacts_list.push({"name":"Hospital Discount","value":[0.0075],"type":"x"});
    artifacts_list.push({"name":"Idle Time","value":[10.00],"type":"+"});
    artifacts_list.push({"name":"Item Values","value":[0.02],"type":"+"});
    artifacts_list.push({"name":"Mercenary Discount","value":[0.01],"type":"x"});
    artifacts_list.push({"name":"Mine Boost","value":[0.0175],"type":"+"});
    artifacts_list.push({"name":"Mine Discount","value":[0.0125],"type":"x"});
    artifacts_list.push({"name":"Money Cache Boost","value":[0.02],"type":"+"});
    artifacts_list.push({"name":"Ore Values","value":[0.045],"type":"+"});
    artifacts_list.push({"name":"Resource Cache Boost","value":[0.05],"type":"+"});
    artifacts_list.push({"name":"Smelt Double","value":[0.0075],"type":"+"});
    artifacts_list.push({"name":"Speedy Crafters","value":[0.05,0.1,0.15,0.25,0.35,0.50,0.65],"type":"x"});
    artifacts_list.push({"name":"Speedy Smelters","value":[0.05,0.1,0.15,0.25,0.35,0.50,0.65],"type":"x"});
    artifacts_list.push({"name":"Tech Discount","value":[0.0075],"type":"x"});
    artifacts_list.push({"name":"Territory Money Boost","value":[0.125],"type":"+"});

    // Actives
    artifacts_list.push({"name":"Army Cache","value":[0.10]});
    artifacts_list.push({"name":"Damage Territory","value":[0.015]});
    artifacts_list.push({"name":"Discount Army Camp","value":[0.03]});
    artifacts_list.push({"name":"Discount Hospital","value":[0.03]});
    artifacts_list.push({"name":"Discount Mine","value":[0.03]});
    artifacts_list.push({"name":"Field Hospital","value":[0.015]});
    artifacts_list.push({"name":"Fog Buster","value":[2.00]});
    artifacts_list.push({"name":"Inspire Mercenaries","value":[0.015]});
    artifacts_list.push({"name":"Market Raid","value":[0.075]});
    artifacts_list.push({"name":"Money Cache","value":[0.15]});
    artifacts_list.push({"name":"Quadruple Strike","value":[0.06]});
    artifacts_list.push({"name":"Resource Cache","value":[0.15]});
    artifacts_list.push({"name":"Supercharge Army Camp","value":[7.50]});
    artifacts_list.push({"name":"Supercharge Mine","value":[7.50]});
    artifacts_list.push({"name":"Time Warp","value":[7.50]});
    artifacts_list.push({"name":"Triple Strike","value":[0.05]});
}

// **************** Idle Information Scan ****************

function scanIdle() {
    loadedLevel = false;
    scannedSpan.text("Scanned: Tabs");
    var idleOut = $("#IdleOutput");
    idleOut.html("");

    idleObject = scanMain(idleObject);
    idleObject.scan_times.tabs = (new Date()).getTime();
    scanArmiesTab(idleObject);
    scanMinesTab(idleObject);
    scanOresTab(idleObject);
    scanItemsAlloysTab(idleObject);
    scanRecipesTab(idleObject);
    scanTechTab(idleObject);
    scanPowersTab(idleObject);
    scanAdvancementsTab(idleObject);
    scanOther(idleObject);

    saveIdleObjectToStorage(idleObject);
    saveIdlePermanentToStorage();
	outputResults(idleObject);
}

function scanMain(idleObject) {
    //<div class="ujsInner ujsTextInner" id="ujs_ArmiesLabel_2_tmp"
    //style="width: 190px; height: 30px; color: rgb(186, 186, 187); text-shadow: rgb(0, 0, 0) -1px -1px 0px, rgb(0, 0, 0) 1px -1px 0px, rgb(0, 0, 0) -1px 1px 0px, rgb(0, 0, 0)
    //1px 1px 0px; text-align: right; justify-content: flex-end; align-items: center; font-size: 17.4px; line-height: 17.4px; white-space: pre; padding: 0px 0px 0.582124px;
    //font-weight: bold; overflow: visible;">₳2.37B (56K/sec)</div>
    var level = "";
    $('*[id*=ujs_GameNameLabel_]').each(function() {
        var element = this;
        level = element.textContent;
    });

    if(level != idleObject.level) {
        archiveIdleObject(idleObject);
        var output = 'Archived level ' + idleObject.level + '.'
        idleObject = getArchivedIdleObject(level);
        if(idleObject == null) {
            idleObject = getNewIdleObject();
            idleObject.level = level;
        } else {
            output += ' Retrieved level ' + idleObject.level + ' from storage.'
        }
        var idleOut = $("#IdleOutput");
        idleOut.html(output);

        saveIdleObjectToStorage(idleObject);
    }

    // Set the armies per second from the top right
    idleObject.armies_ps = null;
    $('*[id*=ujs_ArmiesLabel]').each(function() {
        var element = this;
        if(idleObject.armies_ps == null) {
            var label = element.textContent;
            var startIndex = label.indexOf("(") + 1;
            var endIndex = label.indexOf("/sec");
            if(startIndex > 0 && endIndex > startIndex) {
                idleObject.armies_ps = parseIdleNumber(label.substring(startIndex, endIndex));
            }
        }
    });

    // Set the money per second from the top right
    idleObject.money_ps = null;
    $('*[id*=ujs_MoneyLabel]').each(function() {
        var element = this;
        if(idleObject.money_ps == null) {
            var label = element.textContent;
            var startIndex = label.indexOf("(") + 1;
            var endIndex = label.indexOf("/sec");
            if(startIndex > 0 && endIndex > startIndex) {
                idleObject.money_ps = parseIdleNumber(label.substring(startIndex, endIndex));
            }
        }
    });

    // Get the more detailed armies per second if the stats are open
    $('*[id*=ujs_ArmiesHoverDialog]').each(function() {
        var hoverdialog = $(this);
        var armyhover = [];
        hoverdialog.find('*[id*=ujs_Row]').each(function() {
            var hoverrow = $(this);
            var splithover = hoverrow.text().split(":");
            if(splithover.length == 2) {
                var name = splithover[0];
                var value = parseIdleNumber(splithover[1].substring(1));
                if(splithover[1].indexOf("day") != -1
                       || splithover[1].indexOf("hour") != -1
                       || splithover[1].indexOf("minute") != -1) {
                    value = parseIdleTimeString(splithover[1])
                }
                armyhover.push({"name": name, "value": value})
            }
        });
        if(idleSelected == null) {
            idleSelected = "percents";
        }
        if(showDevelopmentFeatures && idleObject.armyhover != null
               && idleObject.armyhover.length >= 7
               && armyhover.length >= 7) {
            var drafted1 = idleObject.armyhover[6].value;
            var drafted2 = armyhover[6].value;
            // Current armies minus drafts
            //var earned = armyhover[2].value-armyhover[6].value;
            //sigfigmult =
            //earned = Math.Round(earned/sigfigmult)*sigfigmult
            // Last Scanned earned
            var earned = idleObject.armyhover[2].value;
            var income = idleObject.armyhover[1].value;

            var drafted = drafted2-drafted1;
            if(drafted > 0) {
                var draft = {
                    "aps":income,
                    "tot":earned,
                    "dft":drafted,
                    "dftd":drafted1
                }
                drafts.push(draft)
            }
        }
        idleObject.armyhover = armyhover;
        scannedSpan.text(scannedSpan.text() + ", " + "Army Hover");
        idleObject.scan_times.army_hover = (new Date()).getTime();
    });

    // Get the more detailed money per second if the stats are open
    $('*[id*=ujs_MoneyHoverDialog]').each(function() {
        var hoverdialog = $(this);
        var moneyhover = [];
        hoverdialog.find('*[id*=ujs_Row]').each(function() {
            var hoverrow = $(this);
            var splithover = hoverrow.text().split(":");
            if(splithover.length == 2) {
                var name = splithover[0];
                var value = parseIdleNumber(splithover[1].substring(1));
                if(isNaN(value)) {
                    value = parseIdleTimeString(splithover[1])
                }
                moneyhover.push({"name": name, "value": value})
            }
        });
        if(idleSelected == null) {
            idleSelected = "percents";
        }
        idleObject.moneyhover = moneyhover;
        scannedSpan.text(scannedSpan.text() + ", " + "Money Hover");
        idleObject.scan_times.money_hover = (new Date()).getTime();
    });

    // Overwrite if there is a more accurate version from the stats hovers
    if(idleObject.armyhover != null && idleObject.armyhover.length > 1) {
        var aps1 = idleObject.armyhover[1].value;
        var aps2 = idleObject.armies_ps;
        if(aps2 == null) {
            idleObject.armies_ps = aps1;
        } else if(aps1*.99 <= aps2 && aps2*.99 <= aps1) {
            // If equal, use the hover scan
            idleObject.armies_ps = aps1;
        }
    }
    if(idleObject.moneyhover != null && idleObject.moneyhover.length > 1) {
        var mps1 = idleObject.moneyhover[1].value;
        var mps2 = idleObject.money_ps;
        if(mps2 == null) {
            idleObject.money_ps = mps1;
        } else if(mps1*.99 <= mps2 && mps2*.99 <= mps1) {
            // If equal, use the hover scan
            idleObject.money_ps = mps1;
        }
    }

    return idleObject;
}

function scanArmiesTab(idleObject) {
    var camps = [];
    $('*[id*=ujs_WziTabBodyArmyCampRow]').each(function() {
        var camp = $(this);
        var name = "";
        var level = -1;
        var armies_per_s = 0;
        var cost = 0;
        camp.find('*[id*=ujs_NameLabel]').each(function() {
            var element = $(this);
            name = element.text();
        });
        camp.find('*[id*=ujs_LevelLabel]').each(function() {
            var element = $(this);
            var levelstr = element.text();
            level = parseInt(levelstr.substring(1));
        });
        //id="ujs_ArmiesPerSecondLabel_2_tmp"
        camp.find('*[id*=ujs_ArmiesPerSecondLabel]').each(function() {
            var element = $(this);
            var aps_str = element.text().substring(1);
            aps_str = aps_str.substring(0, aps_str.indexOf(" / "));
            armies_per_s = parseIdleNumber(aps_str);
        });
        camps.push({
            "name": name,
            "level": level,
            "armies_per_s": armies_per_s,
            "cost": cost
        })
    });
    if(camps.length > 0) {
        idleObject.camps = camps;
    }

    // Get Hospitals
    var hospitals = [];
    $('*[id*=ujs_WziTabBodyHospitalRow]').each(function() {
        var element = $(this);
        var level = getTextValueForIdContaining("ujs_LevelLabel", element);
        var upgrade = getTextValueForIdContaining("ujs_UpgradeBtn", element, true);
        var effect = getTextValueForIdContaining("ujs_EffectLabel", element);
        var slider = getTextValueForIdContaining("ujs_ProgressLabel", element);

        var l = parseIdleNumber(level.replace("L","").trim())

        var upgrade_cost = -1;
        var upgrade_trunc = upgrade.substring(upgrade.indexOf("￦") + 1)
        // This had a value in it, get the cost
        if(upgrade_trunc != upgrade) {
            upgrade_cost = parseIdleNumber(upgrade_trunc);
        }

        var effects = effect.replace("Saves ","");
        var split = effects.split("/");
        var saves1 = parseIdleNumber(split[0].trim().substring(1));
        var saves2 = parseIdleNumber(split[1].trim().substring(1));

        var hospital = {
            "l":l,
            "c":upgrade_cost,
            "s1":saves1,
            "s2":saves2
        }
        hospitals.push(hospital)
    });
    if(hospitals.length > 0) {
       idleObject.hospitals = hospitals;
    }

    // Get Mercenaries
    var mercs = [];
    var mercs_cost = 0.0;
    var mercs_sum = 0.0;
    $('*[id*=ujs_WziTabBodyMercenaryCampRow]').each(function() {
        var element = $(this);
        var split = element.text().split(" ");
        var num = 0;
        var price = 0;
        for(var i = 0; i < split.length; i++) {
            if(split[i].indexOf("₳") != -1) {
                num = parseIdleNumber(split[i].substring(split[i].indexOf("₳")+1));
            }
            if(split[i].indexOf("￦") != -1) {
                price = parseIdleNumber(split[i].substring(split[i].indexOf("￦")+1));
            }
        }
        mercs.push({"available":num,"price":price,"total":num*price});
        mercs_cost += num*price;
        mercs_sum += num;
    });
    if(mercs.length > 0) {
        idleObject.mercenaries = mercs;
        idleObject.mercenaries_sum = mercs_sum;
        idleObject.mercenaries_cost = mercs_cost;
    }

    // Get Modifiers
    $('*[id*=ujs_ModifierBreakdownDialog]').each(function() {
        var modifier_dialog = $(this)
        var modifiers = [];
        scannedSpan.text(scannedSpan.text() + ", Modifiers");
        idleObject.scan_times.modifiers = (new Date()).getTime();
        modifier_dialog.find("*[id*=ujs_main]").each(function() {
            var mod = $(this);
            var texts = [];
            mod.find(".ujsTextInner").each(function() {
                texts.push(this.textContent);
            });
            if(texts.length > 1) {
                var modifier = {
                    "name":null,
                    "value":null,
                    "det":[]
                }
                modifier.name = texts[0];
                modifier.value = texts[1];
                for(var i = 2; i < texts.length-1; i+=2) {
                    var detail = {
                        "name":texts[i],
                        "value":texts[i+1]
                    }
                    modifier.det.push(detail);
                }
                if(texts.length%2 == 1) {
                    modifier.note = texts[texts.length - 1];
                }
                modifiers.push(modifier);
            }
        });
        idleObject.modifiers = modifiers;
    });
}

function scanMinesTab(idleObject) {

}

function scanOresTab(idleObject) {

}

function scanItemsAlloysTab(idleObject) {
    var items_alloys = [];
    var modified = false;
    $('*[id*=WziTabBodyResourceRow]').each(function() {
        var element = $(this);
        var name = "";
        var qty = "";
        var pricestr = "";
        var price = -1;
        var id = "";

        element.find("*[id*=NameLabel]").each(function() {
            name = this.textContent;
        });
        element.find("*[id*=QuantityLabel]").each(function() {
            qty = this.textContent;
        });
        element.find("*[id*=SellsForLabel]").each(function() {
            pricestr = this.textContent.substring(1);
            price = parseIdleNumber(pricestr);
        });


        var ids = getIngredientIDs(element);
        if(ids.length > 0 ) {
           id = ids[0];
        }
        var item_alloy = {
            "name": name,
            "qty": qty,
            "pricestr": pricestr,
            "price": price,
            "id" : id
        }
        items_alloys.push(item_alloy);
    });
    if(items_alloys.length > 0) {
        idleObject.items_alloys = items_alloys;
        modified = true;
    }

    var market_items = [];
    var market_costs = [];
    $('*[id*=MarketRow]').each(function() {
        var element = $(this);
        var ingredients = element.find("*[id*=ujs_ResourcesContainer]");
        var result = element.find("*[id*=ujs_MakingContainer]");
        var ing_ids = [];
        var ingcosts = [];
        ingredients.each(function() {
            var ing = $(this);
            ing_ids = ing_ids.concat(getIngredientIDs(ing));
            ingcosts = ingcosts.concat(getIngredientQtys(ing));
        });

        market_items = market_items.concat(ing_ids);
        market_costs = market_costs.concat(ingcosts);
    });
    var market = [];
    if(market_items.length > 0 && market_items.length == market_costs.length) {
        for(var i = 0; i < market_costs.length; i++) {
            var name = market_items[i];
            var coststr = market_costs[i];
            var cost = parseIdleNumber(coststr.substring(coststr.indexOf("￦")+1));
            market.push({
                "name":name,
                "coststr":coststr,
                "cost":cost
            })
        }
        idleObject.market_resource_ids = market_items;
        idleObject.market_resources = market;
        modified = true;
    }
    return modified;
}

function scanRecipesTab(idleObject) {

    // Get Number of crafters
    $('*[id*=ujs_CraftersContainer]').each(function() {
        var cftr = $(this);
        var cftrs = cftr.find('*[id*=ujs_WziTabBodySmelterOrCrafterRow]')
        idleObject.num_cftr = cftrs.length;
    });
    // Get Recipes
    var recipes = [];
    $('*[id*=RecipeRow]').each(function() {
        var element = $(this);
        var ingredients = element.find("*[id*=ujs_ResourcesContainer]");
        var result = element.find("*[id*=ujs_MakingContainer]");
        var ing_ids = [];
        var ing_qtys = [];
        ingredients.each(function() {
            var ing = $(this);
            ing_ids = ing_ids.concat(getIngredientIDs(ing));
            ing_qtys = ing_qtys.concat(getIngredientQtys(ing));
        });

        for(var i = 0; i < ing_qtys.length; i++) {
            var qty = ing_qtys[i];
            qty = qty.substring(qty.indexOf("/")+1);
            ing_qtys[i] = qty;
        }
        var makes = "";
        result.each(function() {
            var text_node = $(this).find("*[id*=ujs_Text_]");
            if(text_node != null && text_node.length > 0) {
                makes = text_node[0].textContent;
                if(makes.indexOf("(") != -1) {
                    makes = makes.substring(0, makes.indexOf("(") -1);
                }
            }
        });

        var recipe_id = makes;
        var ids = getIngredientIDs(result);
        if(ids.length != 0) {
            recipe_id = ids[0];
        }

		var time = "";
        element.find("*[id*=DurationLabel]").each(function() {
            time = this.textContent;
        });
        var time_in_s = parseIdleTimeString(time);
        //var value = getItemAlloySellValueById(idleObject, recipe_id);
        var recipe = {
            "name" : makes,
            "id" : recipe_id,
            "ing_ids" : ing_ids,
            "ing_qtys" : ing_qtys,
            "time" : time,
            "time_in_s" : time_in_s
        }
        recipes.push(recipe);
    });
    if(recipes.length > 0) {
        if(idleSelected == null) {
            idleSelected = "recipes";
        }
        if(recipes[0].ing_ids[0].indexOf("Rock-") != -1) {
            //This makes an alloy
            idleObject.recipes_smelter = recipes;
            scannedSpan.text(scannedSpan.text() + ", Smelter Recipes");
            idleObject.scan_times.recipe_smelter = (new Date()).getTime();
        } else {
            idleObject.recipes = recipes;
            scannedSpan.text(scannedSpan.text() + ", Crafter Recipes");
            idleObject.scan_times.recipe_crafter = (new Date()).getTime();
        }
    }

}

function scanTechTab(idleObject) {
    var techs = [];
    var camps = 0;
    var draft = 0;
    var crafter_speed = 0;
    var smelter_speed = 0;
    var mines = 0;
	$('*[id*=ujs_techtree]').each(function() {
        var element = $(this);
        var icon = null;
        element.find('*[id*=ujs_Icon]').each(function() {
            var html = $(this).html();
            var icon_tmp = getIcon(html);
            if(icon_tmp != null) {
                icon = icon_tmp;
            }
        });

        var border = null;
        element.find('*[id*=ujs_Border]').each(function() {
            var html = $(this).html();
            var icon_tmp = getIcon(html);
            if(icon_tmp != null) {
                border = icon_tmp;
            }
        });
        if(border != null && icon != null) {
            if(border.indexOf("FFFF00") != -1) {
                // Unlocked
                if(icon.indexOf("CampingTent") != -1) {
                    camps++;
                } else if(icon.indexOf("DropWeapon") != -1) {
                    draft++;
                } else if(icon.indexOf("Crafting") != -1) {
                    crafter_speed++;
                } else if(icon.indexOf("PulleyHook") != -1) {
                    smelter_speed++;
                } else if(icon.indexOf("MineTruck") != -1) {
                    mines++;
                } else {
                    var ignore = [
                    "DropWeapon",
                    "MoneyStack",
                    "ClaymoreExplosive",
                    "Profit",
                    "Doubled",
                    "SwordBrandish",
                    "Minerals",
                    "Hospital",
                    "GemPendant",
                    "Cash",
                    "Campfire",
                    "Banknote",
                    ]
                    if(ignore.indexOf(icon) == -1) {
                        console.log("Did not store tech: " + icon)
                    }
                }
            }
        }
    });
    techs = {
        "camp":camps,
        "draft":draft,
        "cr_speed":crafter_speed,
        "sm_speed":smelter_speed,
        "mine":mines
    }

    idleObject.techs = techs;
}

function scanPowersTab(idleObject) {

}

function scanAdvancementsTab(idleObject) {
    var artifacts_equipped = [];
	var artifacts = [];
	$('*[id*=ArtifactCard]').each(function() {
        var element = $(this);

        var name = "";
        element.find('*[id*=ujs_Name]').each(function() {
            name = this.textContent;
        });

        var rarity = "";
        element.find('*[id*=ujs_Rarity]').each(function() {
            rarity = this.textContent;
        });

        if(name.length != 0 && rarity.length != 0) {
            if(artifacts_equipped.length < 3) {
                artifacts_equipped.push({"n":name,"r":rarity})
            } else {
                if (artifacts.length == 0 && artifacts_equipped[0].n != name) {
                    artifacts.push(artifacts_equipped[0]);
                    artifacts.push(artifacts_equipped[1]);
                    artifacts.push(artifacts_equipped[2]);
                }
                artifacts.push({"n":name,"r":rarity})
            }
        }

    });
    if(artifacts_equipped.length == 3) {
        idleObject.artifacts_equipped = artifacts_equipped;
        idlePermanent.artifacts_equipped = artifacts_equipped;
    }
    if(artifacts.length > 0) {
        idlePermanent.artifacts = artifacts;
        scannedSpan.text(scannedSpan.text() + ", Artifacts");
        idlePermanent.scan_times.artifacts = (new Date()).getTime();
    }

    // Scan the advancements
    var advancements = [];
	$('*[id*=ujs_WziTabBodyAPRow]').each(function() {
        var row = $(this);
        var name = getTextValueForIdContaining("ujs_NameLabel", row)
        var value = getTextValueForIdContaining("ujs_CurrentValueIfUnlockedLabel", row)
        if(name != null && value != null) {
            value = value.replace("Current value: ","");
            var adv = {"n":name,"v":value}
            advancements.push(adv);
        }
    });
    if(advancements.length > 0) {
        idlePermanent.advancements = advancements;
        idlePermanent.scan_times.advancements = (new Date()).getTime();
    }

    // Scan the stats pop up window (Statistics 4)
    $('*[id*=ujs_CurrentLevelStatsContainer]').each(function() {
        var level_stats = $(this);
        level_stats.find(".ujsText").each(function() {
            var text = this.textContent;
            var split = text.split(":");
            if(split[0].indexOf("bonuses you own") != -1) {
                var value = parseIdleNumber(split[1].trim());
                var mod = getModifierBreakdown(idleObject, "Money from Bonuses");
                var arti_mod = getEquippedArtifactModifier(idleObject, "Bonus Money Boost");
                // Save the base value
                idleObject.bonusMoney = value/(mod.mod_no_a + arti_mod);
            }
        });
    });

}

function scanOther(idleObject) {
    idleObject.last_terr = null;
    var territory_name = null;
    $('*[id*=ujs_MainLabel]').each(function() {
        var label = $(this).text();
        if(label.indexOf("Territory") != -1) {
            territory_name = label.substring(label.indexOf(":") + 2);
        }
    });
	$('*[id*=ujs_DetailsLabel]').each(function() {
	    var element = $(this)
        if(idleObject.last_terr == null || idleObject.last_terr.c == 0) {
            var value = element.text();
            var lines = value.split('\n');
            var cost = 0;
            var hospitals = 0;
            for(var i = 0; i < lines.length; i++) {
                if(lines[i].indexOf("armies to conquer") != -1) {
                    cost = parseIdleNumber(lines[i].substring(1,lines[i].indexOf(" armies to conquer")))
                }
                if(lines[i].indexOf("will retain") != -1) {
                    hospitals = parseIdleNumber(lines[i].substring(
                        lines[i].indexOf("₳")+1,
                        lines[i].indexOf("(")-1
                    ))
                }
            }
            if(cost != 0 && territory_name != null) {
                idleObject.last_terr = {
                    "c":cost,
                    "h":hospitals,
                    "n":territory_name
                }
            }
        }
    });
}

function getTextValueForIdContaining(id, parent, skip_hidden) {
    var results = null;
    if(parent) {
        results = parent.find('*[id*=' + id + ']')
    } else {
        results = $('*[id*=' + id + ']');
    }
    var result = null;
    results.each(function() {
        if(skip_hidden == true && this.style.display == 'none') {
            // Ignore
        } else {
            if(this.textContent == "") {
                if(result == null) {
                    result = this.textContent;
                }
            } else {
                result = this.textContent
            }
        }
    });
    return result;
}

function getIcon(html) {
    var start = html.indexOf("https://warzonecdn.com/ujs/Resources/") + 37;
    var end = html.indexOf(".png");
    if(start >= 37 && end != -1 && end > start) {
        return html.substring(start,end);
    }
    return null;
}

function getIngredientIDs(parent) {
    var names = [];
    var stop = false;
    parent.children().each(function () {
        var child = $(this);
        var id = child.attr('id');
        if(id != null && id.indexOf("ujs_ResourceIcon_") != -1) {
            stop = true;
            var ing = $(this)
            var resource_icon = getIcon(ing.html());
            names.push(resource_icon);
        }
        if(!stop){
            names = names.concat(getIngredientIDs(child));
        }
    });
    return names;
}

function getIngredientQtys(parent) {
    var qtys = [];
    var stop = false;
    parent.children().each(function () {
        var child = $(this);
        var id = child.attr('id');
        if(id != null && id.indexOf("ujs_Text_") != -1) {
            stop = true;
            var ing = this
            qtys.push(ing.textContent);
        }
        if(!stop){
            qtys = qtys.concat(getIngredientQtys(child));
        }
    });
    return qtys;
}

function parseIdleNumber(coststr) {
    if(coststr.indexOf("P") != -1) {
        return parseFloat(coststr.substring(0,coststr.indexOf("P"))) * 1.0E15;
    } else if(coststr.indexOf("T") != -1) {
        return parseFloat(coststr.substring(0,coststr.indexOf("T"))) * 1.0E12;
    } else if(coststr.indexOf("B") != -1) {
        return parseFloat(coststr.substring(0,coststr.indexOf("B"))) * 1.0E9;
    } else if(coststr.indexOf("M") != -1) {
        return parseFloat(coststr.substring(0,coststr.indexOf("M"))) * 1.0E6;
    } else if(coststr.indexOf("K") != -1) {
        return parseFloat(coststr.substring(0,coststr.indexOf("K"))) * 1.0E3;
    } else {
        return parseFloat(coststr);
    }
    return -1.0
}

function parseIdleTimeString(timestr) {
    timestr = timestr.toLowerCase();
    var timesplit = timestr.split(" ");
    var val_in_s = 0;
    for(var i = 0; i < timesplit.length; i+=2) {
       var value = timesplit[i]
       if(value.indexOf("ago") != -1) {
			i--;
			continue;
       }
       var unit = timesplit[i+1]
       if(unit.indexOf("day") != -1) {
           val_in_s += parseInt(value)*60*60*24;
       } else if(unit.indexOf("hour") != -1) {
           val_in_s += parseInt(value)*60*60;
       } else if(unit.indexOf("minute") != -1) {
           val_in_s += parseInt(value)*60;
       } else if(unit.indexOf("second") != -1) {
           val_in_s += parseInt(value);
       }
    }
    return val_in_s;
}

// **************** Idle Output ****************

function outputResults(idleObject) {
    if(idleSelected == "percents") {
        outputPercents(idleObject);
    } else if(idleSelected == "recipes") {
        outputRecipes(idleObject);
    } else if(idleSelected == "artifact") {
        outputArtifacts(idleObject);
    } else if(idleSelected == "other") {
        outputOther(idleObject);
    }
}

function outputPercents(idleObject) {
    idleSelected = "percents";
    var moneyhover = idleObject.moneyhover;
    var armyhover = idleObject.armyhover;
    var idx = 0;
    var successful = false;
    var output = ''

    if(moneyhover != null) {
        output += '<table>'
        output += '<thead><th align="left">Money Category Name</th><th>% of All</th></thead>'
        for(idx = 2; idx < moneyhover.length; idx++) {
            var percentage = Math.round(moneyhover[idx].value/moneyhover[2].value*10000)/100;
            output += '<tr>'
            output += '<td>' + moneyhover[idx].name + '</td>'
            output += '<td>' + percentage + '%</td>'
            output += '</tr>'
            successful = true;
        }
        output += '</table>'
        var mps = getMoneyPerSecond();
        if(mps > 0) {
            output += 'Income: ' + formatOutputMoney(mps*3600,'/hour')
            output += '<br/>'
        }
        output += '<span style="font-style: italic">(Last Scanned: ' + getDateString(idleObject.scan_times.money_hover) + ')</span>'
    } else {
        output += 'Hover over the money information on the top right and click s'
    }

    output += '<br/><br/>'

    if(armyhover != null && armyhover.length >= 2) {
        var total2 = armyhover[2].value;
        if(armyhover.length >= 9) {
            total2 += armyhover[7].value + armyhover[8].value;
        }
        output += '<table>'
        output += '<thead><th>Army Category Name</th><th>% of Earned</th><th>% of All</th></thead>'
        for(idx = 2; idx < armyhover.length; idx++) {
            if(armyhover[idx].name.indexOf("Started") == 0) {
                break;
            }

            var percentage1 = Math.round(armyhover[idx].value/armyhover[2].value*10000)/100;
            var percentage2 = Math.round(armyhover[idx].value/total2*10000)/100;

            output += '<tr><td>'
            if(armyhover[idx].name.toLowerCase().indexOf("joint strike") != -1
               || armyhover[idx].name.toLowerCase().indexOf("hospitals") != -1) {
                output += '*'
            }
            output += armyhover[idx].name + '</td>'
            output += '<td>' + percentage1 + '%</td>'
            output += '<td>' + percentage2 + '%</td>'
            output += '</tr>'
            successful = true;
        }
        output += '</table>'
        var aps = getArmiesPerSecond();
        if(aps > 0) {
            output += 'Income: ' + formatOutputArmies(aps*3600,'/hour')
            output += '<br/>'
        }
        output += '<span style="font-style: italic">(Last Scanned: ' + getDateString(idleObject.scan_times.army_hover) + ')</span>'
    } else {
        output += 'Hover over the army information on the top right and click s'
    }
    var idleOut = $("#IdleOutput");
    if(successful) {
        idleOut.html(output);
    } else {
        idleOut.html("Hover information not found. Hover over the top right army or income information and press s while the window is open to scan it.");
    }
}

function outputRecipes(idleObject) {
    idleSelected = "recipes";
    var recipes = idleObject.recipes;
    var output = '<header>Estimated Profit Per Second for various scenarios. Hover over the headers for more details.</header>'

    output += 'As of version 5.15, these calculations are outdated. The best recipe profitability can be found by unlocking Statistics 3.<br/>'
    var item_values_modifier = idleObject.item_values;
    if(item_values_modifier == null) {
        item_values_modifier = 100;
        idleObject.item_values = item_values_modifier;
    }
    var cd_modifier = idleObject.craft_double;
    if(cd_modifier == null) {
        cd_modifier = 10;
        idleObject.craft_double = cd_modifier;
    }
    if(showDevelopmentFeatures) {
        var item_values_text = '<label for="item_values_input">Item Values Boost (Percentage):</label><input name="item_values_input" id="item_values_input" value="' + idleObject.item_values + '"/>'
        output += '<br/>' + item_values_text

        var craft_double_text = '<label for="craft_double_input">Craft Double Modifier (Percentage):</label><input name="craft_double_input" id="craft_double_input" value="' + idleObject.craft_double + '"/>'
        output += '<br/>' + craft_double_text
    }

    output += '<table class="sortable jz_table"><thead>'
    output += '<th title="Crafter Recipe Name">Recipe</th>'
    output += '<th title="Profit per second if ingredients are purchased from the market.">Market</th>'
    output += '<th title="Profit per second if ingredients are purchased from the market + ' + idleObject.craft_double + '% craft double.">Market<br/>w/Craft<br/>Double<br/>Tech</th>'
    if(showDevelopmentFeatures) {
        output += '<th title="Profit per second if ingredients are purchased from the market with a ' + idleObject.item_values + '% modifier to item sell values.">' + idleObject.item_values + '%</th>'
        output += '<th title="Profit per second if ingredients are purchased from the market with a ' + idleObject.item_values + '% modifier to item sell values and '
        output += idleObject.craft_double + '% craft double..">' + idleObject.item_values + '%<br/>w/' + idleObject.craft_double + '%<br/>Craft<br/>Double</th>'
        output += '<th title="Profit per second including time to craft item ingredients. Alloys are purchased from the market when possible.">Item Ingredient<br/>Adjusted</th>'
    }
    output += '</thead>'
    var successful = false;
    var best_market_val = 0;
    var best_market_name = "";
    for(var recipe_idx = 0; recipe_idx < recipes.length; recipe_idx++) {
        var recipe = recipes[recipe_idx];
        var calcs = getRecipeCalculations(idleObject, recipe);
        if(calcs == null) {
            continue;
        }
        if(calcs.m_pps > best_market_val) {
            best_market_val = calcs.m_pps;
            best_market_name = recipe.name;
        }
        var found = false;
        var positive = false;

        var row = '<tr><td>' + recipe.name + '</td>'
        if(calcs.m_pps == -1) {
            row += '<td>N/A</td>'
            row += '<td>N/A</td>'
            if(showDevelopmentFeatures) {
                row += '<td>N/A</td>'
                row += '<td>N/A</td>'
            }
        } else {
            found = true;
            var val1 = calcs.m_pps;
            row += '<td>' + formatOutputNumber(val1) + '</td>'
            var sell_value = getItemAlloySellValueById(idleObject, recipe.id);
            var craft_double = sell_value*.1/recipe.time_in_s;
            var val2 = calcs.m_pps + craft_double;
            row += '<td>' + formatOutputNumber(val2) + '</td>'
            if(showDevelopmentFeatures) {
                var boosted_sell_value = calcs.base*(idleObject.item_values/100+1);
                var itemval = ((boosted_sell_value-calcs.m_i_cost)/recipe.time_in_s)
                row += '<td>' + formatOutputNumber(itemval) + '</td>'
                if(itemval > 0) {
                    positive = true;
                }

                var boosted_craft_double = boosted_sell_value*idleObject.craft_double*.01/recipe.time_in_s
                var itemval_boosted = itemval + boosted_craft_double
                row += '<td>' + formatOutputNumber(itemval_boosted) + '</td>'

                if(itemval_boosted > 0) {
                    positive = true;
                }
            }
            if(val1 > 0 || val2 > 0) {
                positive = true;
            }
        }
        if(showDevelopmentFeatures) {
            if(recipe.missing_alloy != false && calcs.craft_pps && calcs.craft_pps != -1) {
                row += '<td title="' + calcs.craft_desc + '">' + formatOutputNumber(calcs.craft_pps) + '</td>'
                if(calcs.craft_pps > 0) {
                    positive = true;
                }
            } else if(calcs.craft_desc != null && calcs.craft_desc == "Missing") {
                row += '<td title="Missing Ingredient\(s\)">???</td>'
                found = true;
            } else {
                row += '<td>N/A</td></tr>'
            }
        }

        if(positive || (found && recipes.length < 20)){
            output += row;
            successful = true;
        }
    }

    idleObject.best_r_m_v = best_market_val;
    idleObject.best_r_m_n = best_market_name;

    output += '</table>'

    output += '<span style="font-style: italic">(Last Scanned: ' + getDateString(idleObject.scan_times.recipe_crafter) + ')</span>'
    var idleOut = $("#IdleOutput");
    if(successful) {
        idleOut.html(output);
        if(showDevelopmentFeatures) {
            $("#item_values_input").change(function() {
                idleObject.item_values = this.value;
                outputRecipes(idleObject)
            });
        }
        $("#craft_double_input").change(function() {
            idleObject.craft_double = this.value;
            outputRecipes(idleObject)
        });
    } else {
        idleOut.html('Go to your crafters and scan the Change Recipe popup to display additional recipe calculations. Only recipes that have items as ingredients or that can be crafted from market purchases will be shown here.');
    }

}

function outputArtifacts(idleObject) {
    idleSelected = "artifact";

    var select_box = '<select name="artifact_rarity" id="artifact_rarity">'
    select_box += '<option value="Owned">Owned</option>'
    select_box += '<option value="Insane">Insane</option>'
    select_box += '<option value="Legendary">Legendary</option>'
    select_box += '<option value="Epic">Epic</option>'
    select_box += '<option value="Rare">Rare</option>'
    select_box += '<option value="Uncommon">Uncommon</option>'
    select_box += '<option value="Common">Common</option>'
    select_box += '<option value="Poor">Poor</option>'
    select_box += '</select><br/>'

    var output = getArtifactRecommendations(idleObject);

    var idleOut = $("#IdleOutput");
    idleOut.html(select_box + output);

    var rarity_select = $("#artifact_rarity");
    rarity_select.val(artifact_rarity);
    rarity_select.change(function() {
        artifact_rarity = this.value;
        outputArtifacts(idleObject)
    });
}

function outputOther(idleObject) {
    idleSelected = "other";
    var output = 'Estimated cost to buy all mercenaries: '
    output += formatOutputMoney(idleObject.mercenaries_cost)
    output += '<br/>Estimated mercenaries left to buy: '
    output += formatOutputArmies(idleObject.mercenaries_sum)

    var draftinfo = ''
    var aps = getArmiesPerSecond();
    var modifier = getModifierBreakdown(idleObject,"Draft Size Increased");
    var draft_mod = 1;
    if(modifier != null) {
        draft_mod = modifier.mod_no_a;
    } else {
        // Try to construct the modifier
        var tech_mod = 0;
        if(idleObject.techs != null
           && idleObject.techs.draft != null
           && idleObject.techs.draft > 1) {
            tech_mod = (idleObject.techs - 1)*.2
        }
        var ap_mod = 0;
        for(var i=0;i<idlePermanent.advancements;i++) {
            if(idlePermanent.advancements[i].n == "Increased Draft Sizes") {
                ap_mod = parseIdleNumber(idlePermanent.advancements[i].v.replace("%",""))/100
            }
        }
        draft_mod += tech_mod + ap_mod;
    }


    var arti_mod = getEquippedArtifactModifier(idleObject, "Draft Boost");
    draft_mod += arti_mod;

    if(arti_mod != null && arti_mod != null && aps != null && aps != -1) {
        var fixed_draft = (90*(draft_mod)*aps);
        // Max Draft: 3690 * Army Income Per Second * (1 + Modifiers)
        // Fixed Draft: 90 * Army Income Per Second * (1 + Modifiers)
        // Sliding Draft Percentage: 15%
        draftinfo = '<br/><br/><span>Drafts consist of two pieces, a fixed portion and a sliding (variable) portion.'
        draftinfo += ' These numbers are added together to determine the value of each draft.'
        draftinfo += ' The total gained from the sliding portions can be up to 15% of the total armies earned.'
        draftinfo += ' There is no maximum for the fixed portion total.</span>'
        draftinfo += '<br/><span title="1 + Modifiers">Draft Multiplier: ' + draft_mod + '</span>'
        draftinfo += '<br/><span title="Scanned Armies Per Second">Armies Per Second: '
        draftinfo += formatOutputArmies(aps) + '</span>'
        draftinfo += '<br/><span title="90 x Armies Per Second x Multiplier">Fixed Draft Portion: '
        draftinfo += formatOutputArmies(fixed_draft) + '</span>'
        draftinfo += '<br/><span title="Fixed Draft/.85 + 360 x Armies Per Second x .15/.85">Min Draft: '
        draftinfo += formatOutputArmies(fixed_draft*1/.85+360*aps*.15/.85) + '</span>'
        draftinfo += '<br/><span title="3690 x Armies Per Second x Multiplier">Max Draft: '
        draftinfo += formatOutputArmies(3690*(draft_mod)*aps) + '</span>'

        var earned = idleObject.armyhover[2].value;
        var sliding = -1;
        for(var a = 0; a < idleObject.armyhover.length; a++) {
            if(idleObject.armyhover[a].name.toLowerCase().indexOf("sliding") != -1) {
                sliding = idleObject.armyhover[a].value;
            }
        }
        if(sliding >= 0) {
            draftinfo += '<br/><span title="Total Armies Earned * 15% - Sliding Drafts">Sliding Draft Pool Remaining: '
            draftinfo += formatOutputArmies(earned * .15 - sliding) + '</span>'
        }
    }
    output += draftinfo


    /*var num_territories = idleObject.terr_left;
    if(num_territories == null) {
        num_territories = 100;
        idleObject.terr_left = num_territories;
    }
    var terr_text = '<label for="terr_left">Territories Left To Apply Hospital Upgrade To:</label><input name="terr_left" id="terr_left" value="' + num_territories + '"/>'
    output += '<br/>' + terr_text + '</br>'*/

    // Get Hospitals
    var best_hospital = null;
    var best_cost = -1;
    var best_location = -1;
    for(var h_count = 0; h_count < idleObject.hospitals.length; h_count++) {
        var hospital = idleObject.hospitals[h_count];
        var upgrade_cost = hospital.c;
        var cost_per_army = getHospitalUpgradeEffectiveness(hospital);
        if(cost_per_army != null ) {
            if(best_cost == -1 || cost_per_army < best_cost) {
                best_hospital = hospital;
                best_cost = cost_per_army;
                best_location = h_count + 1;
            }
        }
    }

    if(best_hospital != null) {
        output += '<br/><br/>Most Efficient Hospital Upgrade: #' + best_location
        output += '<span title="To compare the value of upgrading this hospital to buying mercenaries, divide the first number by the number of territories that this hospital is expected to affect">'
        output += '<br/>Upgrade Value: ~' + formatOutputNumber(best_cost,2) + ' ￦/₳ for ' + formatOutputMoney(best_hospital.c)
        output += '</span>'
    }

    if(showDevelopmentFeatures && drafts.length > 0) {
        output += "<br/><br/>Last Few Drafts:";
        output += "<table><thead><td>Armies/sec</td><td>Total Earned</td><td>Draft</td><td>Drafted</td><td>Multiplier</td></thead>"
        var start = 0;
        if(drafts.length > 8) {
            start = drafts.length - 8;
        }
        for(var d_count = start; d_count < drafts.length; d_count++) {
            output += '<tr><td>' + formatOutputNumber(drafts[d_count].aps,2,true)+ '</td><td>'
                + formatOutputNumber(drafts[d_count].tot,2,true) + '</td><td>'
                + formatOutputNumber(drafts[d_count].dft,2,true) + '</td><td>'
                + formatOutputNumber(drafts[d_count].dftd,2,true) + '</td><td>'
                + formatOutputNumber(drafts[d_count].dft/drafts[d_count].aps,1,true) + '</td></tr>';
        }
        output += "</table>";
    }
    var idleOut = $("#IdleOutput");
    idleOut.html(output);


    /*$("#terr_left").change(function() {
        idleObject.terr_left = this.value;
        outputOther(idleObject)
    });*/

}

function getHospitalUpgradeEffectiveness(hospital) {
    var upgrade_cost = hospital.c;
    var saves2 = hospital.s2;
    var level = hospital.l;

    if(upgrade_cost != -1) {
        // y = (ax^2 + bx + c) * base
        var a = 0.3;
        var b = 0.0;
        var c = 0.7;
        var x = level;
        var x2 = x + 1.0;
        var y_old = a*x*x + b*x + c;
        var y_new = a*x2*x2 + b*x2 + c;
        var base = saves2/y_old
        // This is what we need to multiply the base by
        var upgrade_diff = y_new - y_old;

        var cost_per_army = upgrade_cost / (upgrade_diff * base)
        return cost_per_army;
    }
    return null;
}

function getArtifactRecommendations(idleObject) {
    var armies_per_second = getArmiesPerSecond(idleObject);
    //if(idleObject.modifiers == null || idleObject.modifiers.length == 0 || armies_per_second == null) {
    if(armies_per_second == null) {
        return 'Scan the Modifiers \(Statistics 2\), Change Recipe \(crafter\), and Armies Per Second pop-ups to compare artifact effects.'
    }
    if(artifact_rarity == "Owned" && idlePermanent.artifacts.length == 0) {
        return 'Scan your artifacts to see personalized artifact results'
    }

    var army_camp_boost_bonus = 0.0;
    var output = ''

    // Set the rarity for the comparisons;
    output += '<header style="font-weight:bold">' + artifact_rarity + ' Artifact Comparison \(selected artifacts\)</header>'
    var mod_breakdown = getModifierBreakdown(idleObject, "Army Camp Production");
    // Get the artifact boost at the test rarity
    var test_art_boost = findArtifactValue("Army Camp Boost", artifact_rarity);
    if(mod_breakdown != null && test_art_boost.v > 0) {

        // Get the adjusted percent boost that the test rarity will provide
        var art_bonus_percent = (test_art_boost.v)/(mod_breakdown.mod_no_a)*100;
        var mod_w_artifact = mod_breakdown.mod_no_a + test_art_boost.v;
        var arti_mod_acb = getEquippedArtifactModifier(idleObject, "Army Camp Boost");
        army_camp_boost_bonus = armies_per_second / (mod_breakdown.mod_no_a + arti_mod_acb) * test_art_boost.v;
        output += '<br/>' + colorArtifactText(test_art_boost.r) + ' Army Camp Boost: '
        output += formatOutputArmies(army_camp_boost_bonus,'/sec') + ', '
        output += formatOutputNumber(art_bonus_percent,2) + '% increase'
    }

    var speedy_c_test = findArtifactValue("Speedy Crafters", artifact_rarity);
    var c_double = findArtifactValue("Craft Double", artifact_rarity);
    if(speedy_c_test.v > 0) {
        var sc_breakdown = getModifierBreakdown(idleObject, "Crafter Speed");
        var best = findBestMarketRecipe(idleObject, true);
        var pps = best.value;
        var craft_double_w_speedy = best.calcs.m_pps_cd_arti;

        var craft_time_w_speedy = best.time;
        // The value for speedy crafters is easier to calculate if we assume it's equipped.
        if(sc_breakdown.artifact != speedy_c_test.v) {
            // Adjust the craft time as if speedy crafters were equipped
            var time_multiplier = (1-speedy_c_test.v)/(1-sc_breakdown.artifact);
            craft_time_w_speedy = best.time * time_multiplier;
            pps = pps / time_multiplier;
            craft_double_w_speedy = craft_double_w_speedy / time_multiplier;
        }

        var multiplier = speedy_c_test.v;
        //var craft_double_w_speedy = best.sell/craft_time_w_speedy*c_double.v;

        var name = best.name;
        if(name != null && name.length > 0 && best.value > 0) {
            output += '<br/><span title="Purchase ingredients for ' + name + ' from the market and craft for profit.'
            output += ' This shows the value added by equipping the Speedy Crafters artifact.'
            output += ' The calculation assumes that the ' + best.calcs.rarity_iv + ' Item Values artifact is equipped'
            output += ' and includes a craft double modifier of ' + best.calcs.mod_cd + '.">'
            output += colorArtifactText(speedy_c_test.r) + ' Speedy Crafters: '
            output += '+' + formatOutputMoney(pps*multiplier)
            output += ' x ' + idleObject.num_cftr + ' crafter(s) = '
            output += '+' + formatOutputMoney(pps*multiplier*idleObject.num_cftr,'/sec')
            output += ' for ' + name + '</span>'
            output += '<br/><span title="Purchase ingredients for ' + name + ' from the market and craft for profit.'
            output += ' This shows the value added by equipping the Craft Double artifact.'
            output += ' The calculation assumes that the ' + best.calcs.rarity_iv + ' Item Values and ' + speedy_c_test.r + ' Speedy Crafters artifacts are equipped.">'
            output += colorArtifactText(best.calcs.rarity_cd) + ' Craft Double \(if Speedy Crafters equipped\): '
            output += '+' + formatOutputMoney(craft_double_w_speedy)
            output += ' x ' + idleObject.num_cftr + ' = '
            output += '+' + formatOutputMoney(craft_double_w_speedy*idleObject.num_cftr, '/sec')
            output += ' for ' + name + '</span>'
        }
    }

    if(showDevelopmentFeatures) {
        var mps = getMoneyPerSecond();
        var art_bmb = findArtifactValue("Bonus Money Boost", artifact_rarity);
        var art_tmb = findArtifactValue("Territory Money Boost", artifact_rarity);
        if(idleObject.bonusMoney != null && mps != null && mps > 0) {
            if(art_bmb != null && art_bmb.r != null) {
                var bmb_val = idleObject.bonusMoney * art_bmb.v;
                output += '<br/>' + colorArtifactText(art_bmb.r) + ' Bonus Money Boost: '
                output += '+' + formatOutputMoney(bmb_val, '/sec')
            }
            if(art_tmb != null && art_tmb.r != null) {
                // Get the actual bonus money boost
                var mfb_mod = getModifierBreakdown(idleObject, "Money from Bonuses");
                var arti_mod = getEquippedArtifactModifier(idleObject, "Bonus Money Boost");
                var bonusMoney = idleObject.bonusMoney * (mfb_mod.mod_no_a + arti_mod);

                // Calculate the territory money boost
                var terr_money = mps - bonusMoney;
                var mft_mod = getModifierBreakdown(idleObject, "Money from Territories");
                var arti_mft_mod = getEquippedArtifactModifier(idleObject, "Territory Money Boost");
                var terr_money_base = terr_money/(mft_mod.mod_no_a + arti_mft_mod);

                var tmb_val = terr_money_base * art_tmb.v;
                output += '<br/>' + colorArtifactText(art_tmb.r) + ' Territory Money Boost: '
                output += '+' + formatOutputMoney(tmb_val, '/sec')
            }
        }
    }

    var cooldown = 16*60*60;
    var cooldown_rate_adj = getModifierBreakdown(idleObject, "Artifact Cooldown Speed");
    if(cooldown_rate_adj != null) {
        cooldown *= cooldown_rate_adj.mod;
    }

    output += '<br/><br/><header style="font-weight:bold">Activated Artifacts (for ' + formatOutputNumber(cooldown/60/60) + ' hour cooldown)</header>'

    var supercharge_army = findArtifactValue("Supercharge Army Camp", artifact_rarity);
    var best_camp = 0;
    for(var i = 0; i < idleObject.camps.length; i++) {
        if(idleObject.camps[i].armies_per_s > best_camp) {
            best_camp = idleObject.camps[i].armies_per_s;
        }
    }
    if(supercharge_army != null && supercharge_army.r != null && best_camp > 0) {
        output += colorArtifactText(supercharge_army.r) + ' Supercharge Army Camp for best camp: '
        output += '+' + formatOutputArmies(best_camp*19*supercharge_army.v/cooldown*60, '/sec')
    }

    var q_strike = findArtifactValue("Quadruple Strike", artifact_rarity);
    var t_strike = findArtifactValue("Triple Strike", artifact_rarity);
    var field = findArtifactValue("Field Hospital", artifact_rarity);
    var joint_strike = getModifierBreakdown(idleObject, "Joint Strike");
    if(joint_strike != null) {
        var armies_per_cooldown = army_camp_boost_bonus * cooldown;
        var js_adjusted = armies_per_cooldown / joint_strike.mod;

        var hover = 'These are calculated based on the current values for army camps and assume only one level is being played at once. '
        hover += 'Because army camps will increase over the 16 hour cooldown period, it is recommended to use these activated artifacts only '
        hover += 'when the territory capture costs greatly exceed the values displayed here. Hospital retention varies by territory. Check '
        hover += 'to see how many armies will be retained by hospitals. Next, add that to the territory cost to get the actual territory cost '
        hover += 'that would match the current armies per second from camps over the cooldown period.'

        output += '<br/><br/><span id="artifacts_activated_capture" title="' + hover + '">'
        output += '<header style="text-decoration:underline">Territory size to match the current effect of '
        output += colorArtifactText(test_art_boost.r) + ' Army Camp Boost over the cooldown period (mouse over for more info):</header>'

        if(q_strike.v > 0) {
            if(q_strike.v > 1) {
                q_strike.v = 1;
            }
            if(q_strike != -1) {
                var q_adjusted = js_adjusted / q_strike.v;
                output += colorArtifactText(q_strike.r) + ' Quadruple Strike: ';
                output += formatOutputArmies(q_adjusted) + ' + retained by hospitals'
            }
        }

        if(t_strike.v > 0) {
            if(t_strike.v > 1) {
                t_strike.v = 1;
            }
            if(t_strike != -1) {
                var t_adjusted = js_adjusted / t_strike.v;
                output += '<br/>' + colorArtifactText(t_strike.r) + ' Triple Strike: '
                output += formatOutputArmies(t_adjusted) + ' + retained by hospitals'
            }
        }

        if(field.v > 0) {
            var f_adjusted = js_adjusted / field.v;
            output += '<br/>' + colorArtifactText(field.r) + ' Field Hospital: '
            output += formatOutputArmies(f_adjusted) + ' + retained by hospitals'
        }
        output += '</span>'

        if(idleObject.last_terr != null) {
            output += '<br/><span title="Artifact Effects for the selected territory, converted to armies per second over the cooldown period. '
            output += 'To obtain the amount saved, subtract armies saved from Hospitals and Joint Strike from the territory cost, then multiply the result by the artifact effect.">'
            var cost_to_take = (idleObject.last_terr.c - idleObject.last_terr.h);
            var q_saves = cost_to_take * joint_strike.mod * q_strike.v;
            var t_saves = cost_to_take * joint_strike.mod * t_strike.v;
            output += '<br/>Artifact effects for the territory ' + idleObject.last_terr.n + ':'
            output += '<br/>' + colorArtifactText(q_strike.r) + ' Quadruple Strike: Saves '
            output += formatOutputArmies(q_saves)
            output += ' (' + formatOutputArmies(q_saves/cooldown) + '/sec)'
            output += '<br/>' + colorArtifactText(t_strike.r) + ' Triple Strike: Saves '
            output += formatOutputArmies(t_saves)
            output += ' (' + formatOutputArmies(t_saves/cooldown) + '/sec)'
        } else {
            output += '<br/><br/>Select an unfogged territory on the map and press "s" to see how many armies would be saved by selected active artifacts for that territory.';
        }
    }

    output += '<br/>'
    output += '<br/><span style="font-style: italic">(Artifacts Last Scanned: ' + getDateString(idlePermanent.scan_times.artifacts) + ')</span>'
    output += '<br/><span style="font-style: italic">(Crafter Recipes Last Scanned: ' + getDateString(idleObject.scan_times.recipe_crafter) + ')</span>'
    output += '<br/><span style="font-style: italic">(Modifiers Last Scanned: ' + getDateString(idleObject.scan_times.modifiers) + ')</span>'
    output += '<br/><span style="font-style: italic">(Army Stats Last Scanned: ' + getDateString(idleObject.scan_times.army_hover) + ')</span>'
    return output;
}

function colorArtifactText(rarity) {
    if(rarity == null) {
        return '<span>Not Found</span>'
    }
    var color = "#000";
    switch(rarity){
        case "Insane":
            color = "#FF0";
            break;
        case "Legendary":
            color = "#F80";
            break;
        case "Epic":
            color = "rgb(255, 0, 237)";
            break;
        case "Uncommon":
            color = "#080";
            break;
        case "Common":
            color = "#FFF";
            break;
        case "Poor":
            color = "#888";
            break;
    }
    return '<span class="artifact_' + rarity.toLowerCase() + '">' + rarity + '</span>'
}

function getBestOwnedArtifact(name, owned) {
    var rarities = ["Poor","Common","Uncommon","Rare","Epic","Legendary","Insane"];

    var rarity_idx = -1;
    for(var r = 0; r < owned.length; r++) {
        if(owned[r].n == name) {
            var rarity_idx_tmp = rarities.indexOf(owned[r].r);
            if(rarity_idx_tmp > rarity_idx) {
                rarity_idx = rarity_idx_tmp;
            }
        }
    }

    if(rarity_idx == -1) {
        return null;
    }
    return rarities[rarity_idx];
}

function findArtifactValue(name, rarity_in, backup_rarity) {
    var rarities = ["Poor","Common","Uncommon","Rare","Epic","Legendary","Insane"];

    var rarity = rarity_in;
    if(rarity_in == "Owned") {
        var owned = idlePermanent.artifacts;
        rarity = getBestOwnedArtifact(name, owned);
    }
    var rarity_idx = rarities.indexOf(rarity);
    if(rarity_idx == -1) {
        return {
            "n":name,
            "r":null,
            "v":0
        };
    }
    var value = -1;
    for (var i = 0; i < artifacts_list.length; i++) {
        if(artifacts_list[i].name == name) {
            if(artifacts_list[i].value.length > rarity_idx) {
                value = artifacts_list[i].value[rarity_idx];
                return {
                    "n":name,
                    "r":rarity,
                    "v":value,
                    "t":artifacts_list[i].type
                };
            } else {
                value = artifacts_list[i].value[0] * Math.pow(2,rarity_idx);
                return {
                    "n":name,
                    "r":rarity,
                    "v":value,
                    "t":artifacts_list[i].type
                };
            }
        }
    }
    return {
        "n":name,
        "r":rarity,
        "v":value
    };
}

function formatOutputMoney(number, tag) {
    var value = formatOutputNumber(number);
    if(tag != null) {
        value += tag;
    }
    return '<span style="color: #BDAB27">￦' + value + '</span>'
}

function formatOutputArmies(number, tag) {
    var value = formatOutputNumber(number);
    if(tag != null) {
        value += tag;
    }
    return '<span style="color: #3DB8FF">₳' + value + '</span>'
}

function formatOutputNumber(number, places, show_all) {
    if(!places) {
        places = 4
    }
    var multiplier = Math.pow(10,places);
    if(show_all) {
        return new Intl.NumberFormat().format(Math.round( number * multiplier) / multiplier);
    }
    if(Math.abs(number) >= 1.0E15) {
        return Math.round( number / 1.0E15 * multiplier) / multiplier + "P";
    } else if(Math.abs(number) >= 1.0E12) {
        return Math.round( number / 1.0E12 * multiplier) / multiplier + "T";
    } else if(Math.abs(number) >= 1.0E9) {
        return Math.round( number / 1.0E9 * multiplier) / multiplier + "B";
    } else if(Math.abs(number) >= 1.0E6) {
        return Math.round( number / 1.0E6 * multiplier) / multiplier + "M";
    } else if(Math.abs(number) >= 1.0E3) {
        return Math.round( number / 1.0E3 * multiplier) / multiplier + "K";
    }
    return new Intl.NumberFormat().format(Math.round( number * multiplier) / multiplier);
}

function getDateString(input) {
    if(input == "Never") {
        return "Never";
    }
    var datestring = (new Date(input)).toString();
    if(datestring.indexOf(" GMT") != -1) {
        datestring = datestring.substring(0, datestring.indexOf(" GMT"));
    }
    return datestring;
}

function findBestMarketRecipe(idleObject, artifact_adjust) {
    var best_market_val = 0;
    var best_market_name = "";
    var best_market_sell_value = 0.0;
    var best_market_time = 0.0;
    var best_calcs = null;
    for(var recipe_idx = 0; recipe_idx < idleObject.recipes.length; recipe_idx++) {
        var recipe = idleObject.recipes[recipe_idx];
        var calcs = getRecipeCalculations(idleObject, recipe);
        if(calcs == null) {
            continue;
        }
        var pps = calcs.m_pps;

        if(artifact_adjust) {
            // Include the contribution from craft double techs and the item values artifact
            pps = calcs.m_pps_iv + calcs.m_pps_cd;
        }

        if(pps > best_market_val) {
            best_market_val = pps;
            best_market_name = recipe.name;
            best_market_sell_value = getItemAlloySellValueById(idleObject, recipe.id);
            if(artifact_adjust) {
                best_market_sell_value = calcs.modified;
            }
            best_market_time = recipe.time_in_s;
            best_calcs = calcs;
        }
    }
    return {"name":best_market_name,"value":best_market_val,"sell":best_market_sell_value,"time":best_market_time,"calcs":best_calcs}
}

function getArmiesPerSecond() {
    if(idleObject.armies_ps != null && idleObject.armies_ps > 0) {
        return idleObject.armies_ps;
    }
    return null;
}

function getMoneyPerSecond() {
    if(idleObject.money_ps != null && idleObject.money_ps > 0) {
        return idleObject.money_ps;
    }
    return null;
}

function getModifierBreakdown(idleObject, name) {
    var modifier = findModifier(idleObject, name);
    if(modifier != null) {
        var modNumberNoArtifact = 1.0;
        var type = null;
        var artifact_val = 0.0;
        for(var i = 0; i < modifier.det.length; i++) {
            var detail = modifier.det[i];
            var numVal = 0;
            if(detail.value.indexOf("%") != -1) {
                numVal = parseIdleNumber(detail.value.substring(1,detail.value.indexOf("%")))/100;
            } else {
                numVal = parseIdleNumber(detail.value.substring(1));
            }

            if(detail.value.indexOf("+") == 0) {
                type = "+";
            } else if(detail.value.indexOf("x") == 0) {
                type = "x";
            }
            if(detail.name.indexOf("Artifact") == -1) {
                if(type == "+") {
                    modNumberNoArtifact += numVal;
                } else if(type == "x") {
                    modNumberNoArtifact *= (1-numVal);
                }
            } else {
                artifact_val = numVal;
            }
        }
        var mod = modNumberNoArtifact;
        if(type == "+") {
            mod += artifact_val;
        } else if(type == "x") {
            mod *= (1-artifact_val);
        }
        return {"mod":mod,"type":type,"mod_no_a":modNumberNoArtifact,"artifact":artifact_val}
    }
    return {"mod":1.0,"type":"?","mod_no_a":1.0,"artifact":0.0}
}

function findModifier(idleObject, name) {
    var list = idleObject.modifiers;
    for (var i = 0; i < list.length; i++) {
        var modifier = list[i];
        if(modifier.name == name) {
            return modifier;
        }
    }
    return null;
}

// Gets the modifier from an equipped artifact
function getEquippedArtifactModifier(idleObject, name) {
    var arti_mod = 0;
    if(idleObject.artifacts_equipped != null) {
        for(var a_count = 0; a_count < idleObject.artifacts_equipped.length; a_count++) {
            var arti = idleObject.artifacts_equipped[a_count];
            if(arti.n == name) {
                arti_mod = findArtifactValue(arti.n, arti.r).v
            }
        }
    }
    return arti_mod;
}

// Add the effect of the artifact if it wasn't equipped
/*function getBestArtifactModifier(mod, name, rarity) {
    if(mod.mod != mod.mod_no_a) {
        // Artifact was equipped
        return mod.mod;
    }
    if(rarity == null) {
        rarity = "Owned";
    }
    var artifact = findArtifactValue(name, rarity);
    if(artifact == null && artifact.v == null) {
        return mod.mod;
    }
    var type = mod.type;
    if(type == null) {
        type = artifact.t;
    }
    if(type == null) {
        type = "+";
    }
    if(type == "+") {
        return mod.mod_no_a + artifact.v;
    } else if (type == "x") {
        return mod.mod_no_a * (1-artifact.v);
    }
}*/

function getRecipeCalculations(idleObject, recipe) {
    var ing_ids = recipe.ing_ids;
    var ing_qtys = recipe.ing_qtys;
    var ing_market_cost_sum = 0.0;
    var ing_sell_value_sum = 0.0;
	var ing_cost_sum = 0.0;
	var ing_time_sum = 0.0;
    var ing_cost_time_success = true;
    var craft_desc = "";
    var hasItemIngredient = false;
    for(var i = 0; i < ing_ids.length; i++) {
        var ing_id = ing_ids[i];
        var num = ing_qtys[i];
        var ing_qty = parseIdleNumber(num);

		// Find the cost to buy this ingredient from the market
		var market_cost = -1;
		var idx = idleObject.market_resource_ids.indexOf(ing_id);
		if(idx != -1 && ing_market_cost_sum >= 0) {
			var ing_cost = idleObject.market_resources[idx].cost;
			if(ing_cost != -1 && ing_qty != -1) {
				market_cost = ing_cost*ing_qty;
				// Add the value to the sum
				ing_market_cost_sum += market_cost;
			}
		} else {
            ing_market_cost_sum = -1;
        }

		// Find the sell value for this ingredient
		var ing_sell_value = getItemAlloySellValueById(idleObject, ing_id)*ing_qty;
		if(ing_sell_value_sum >= 0 && ing_sell_value > 0) {
			// Add the value to the sum
			ing_sell_value_sum += ing_sell_value;
		}

        if(ing_id.indexOf("MetalBar") == -1) {
            hasItemIngredient = true;
        }
        // Create the complicated calculation
		var childRecipe = getRecipe(ing_id);
		if(childRecipe != null) {
			// Item Ingredient, Make it
			hasItemIngredient = true;
            var childcalcs = getRecipeCalculations(idleObject, childRecipe);

            if(craft_desc.length != 0) {
                craft_desc += " + ";
            }
            // Buy ingredients for ingredient
			var child_ing_cost = childcalcs.m_i_cost;
			if(child_ing_cost != -1) {
                craft_desc += child_ing_cost + " spent on ingredients for " + childRecipe.name + " *" + ing_qty;
				ing_cost_sum += child_ing_cost*ing_qty;
			} else {
                // Can't buy ingredients, use sell value of the item.
				recipe.missing_alloy = true;
                var childValue = getItemAlloySellValueById(idleObject, childRecipe.id);
                craft_desc += childValue + " to sell " + childRecipe.name + "*" + ing_qty;
				ing_cost_sum += childValue*ing_qty;
                // Skip it
                ing_cost_time_success = false;
			}

			if(childRecipe.time_in_s != -1) {
				ing_time_sum += childRecipe.time_in_s*ing_qty;
			}
		} else {
            if(craft_desc.length != 0) {
                craft_desc += " + ";
            }
			// Alloy Ingredient, Purchase it
			if(market_cost != -1) {
                craft_desc += market_cost + " purchased";
				ing_cost_sum += market_cost;
			} else if(ing_sell_value > 0) {
                // If it can't be purchased, smelt it.
                // Add the value to the sum
                craft_desc += ing_sell_value + " smelted";
                ing_cost_sum += ing_sell_value;
            } else {
                ing_cost_time_success = false;
            }
		}
    }

    var market_profit = -1;
    var market_profit_per_s = -1;
    var market_profit_per_s_iv = -1;
    var market_profit_per_s_adj = -1;
    var market_profit_per_s_cd = -1;
    var market_profit_per_s_cd_artifact = -1;
    var value = getItemAlloySellValueById(idleObject, recipe.id);
    var base = -1;
    var modified = -1;
    var best_iv = findArtifactValue("Item Values", artifact_rarity);
    var mod_iv = getModifierBreakdown(idleObject, "Item Sell Values");
    var arti_mod = getEquippedArtifactModifier(idleObject, "Item Values");
    var best_cd = findArtifactValue("Craft Double", artifact_rarity);
    var mod_cd = getModifierBreakdown(idleObject, "Chance of Crafting Double");
    var mod_cd_no_a = Math.round((1 - mod_cd.mod_no_a)*10000)/10000;
    if(ing_market_cost_sum != -1 && value != -1) {
        base = value/(mod_iv.mod_no_a + arti_mod);

        market_profit = value - ing_market_cost_sum;
        market_profit_per_s = market_profit / recipe.time_in_s;

        if(best_iv != null && best_iv.v != null) {
            modified = base * (mod_iv.mod_no_a + best_iv.v);
            var market_profit_iv = modified - ing_market_cost_sum
            market_profit_per_s_iv = market_profit_iv / recipe.time_in_s

            var market_profit_from_cd = modified * mod_cd_no_a;
            market_profit_per_s_cd = market_profit_from_cd / recipe.time_in_s

            var cd_artifact_value = 1-(1-mod_cd_no_a)*(1-best_cd.v)-mod_cd_no_a
            market_profit_per_s_cd_artifact = modified * cd_artifact_value / recipe.time_in_s

            market_profit_per_s_adj = market_profit_per_s_iv + market_profit_per_s_cd;
        }
    }

	var craft_pps = -1;
	if(hasItemIngredient) {
        if(ing_cost_time_success) {
            var total_time = ing_time_sum + recipe.time_in_s;
            craft_desc = "\(" + value + " - \(" + craft_desc + "\)\)/" + total_time;
            var profit = value - ing_cost_sum;
            craft_pps = profit/total_time
        } else {
            craft_desc = "Missing";
        }
	}

    var calc = {
        "base": base,
        "modified":modified,
        "i_value": ing_sell_value_sum,
        "m_i_cost": ing_market_cost_sum,
        "m_profit": market_profit,
        "m_pps": market_profit_per_s,
        "m_pps_iv": market_profit_per_s_iv,
        "m_pps_cd": market_profit_per_s_cd,
        "m_pps_cd_arti": market_profit_per_s_cd_artifact,
        "rarity_cd": best_cd.r,
        "rarity_iv": best_iv.r,
        "mod_cd": mod_cd_no_a,
        "m_pps_adj": market_profit_per_s_adj,
		"i_craft_t": ing_time_sum,
		"i_craft_c": ing_cost_sum,
		"craft_pps": craft_pps,
		"craft_desc": craft_desc
    }
    return calc;
}

function getItemAlloySellValueById(idleObject, item) {
    var items_alloys = idleObject.items_alloys;
    for(var i = 0; i < items_alloys.length; i++) {
        var item_alloy = items_alloys[i];
        if(item_alloy.id == item) {
            return item_alloy.price;
        }
    }
    return -1;
}

function getRecipe(id) {
    var recipes = idleObject.recipes;
    for(var r_count = 0; r_count <recipes.length; r_count++) {
        var recipe = recipes[r_count];
        if(recipe.id == id) {
            return recipe;
        }
    }
    return null;
}

// **************** Save/Load Idle Data ****************
function setIdlePermanentFromStorage() {
    var jsonString = localStorage.getItem("idlePermanent");
    if(jsonString != null) {
        idlePermanent = JSON.parse(jsonString);
    } else {
        idlePermanent = getNewIdlePermanent();
        saveIdlePermanentToStorage();
    }
}

function getNewIdlePermanent() {
    var scan_times = {
        "artifacts":"Never",
        "advancements":"Never"};

    var idlePermanent = {
        "artifacts":[],
        "advancements":[],
        "scan_times":scan_times
    }
    return idlePermanent;
}

function saveIdlePermanentToStorage() {
    localStorage.setItem("idlePermanent", JSON.stringify(idlePermanent));
}


function getIdleObjectFromStorage() {
    var jsonString = localStorage.getItem("idleObject");
    if(jsonString != null) {
        return JSON.parse(jsonString);
    } else {
        return getNewIdleObject();
    }
}

function getNewIdleObject() {
    var idleObject = {
        "level":null,
        "camps":[],
        "hospitals":[],
        "mercenaries":[],
        "modifiers":[],
        "mines":[],
        "ores":[],
        "items_alloys":[],
        "market_resource_ids":[],
        "market_resources":[],
        "recipes":[],
        "techs":[],
        "powers":[],
        "scan_times":createScanTimes()
    }
    return idleObject;
}

function createScanTimes() {
    var scan_times = {
        "tabs":"Never",
        "army_hover":"Never",
        "money_hover":"Never",
        "modifiers":"Never",
        "recipe_crafter":"Never",
        "recipe_smelter":"Never"};
    return scan_times;
}

function saveIdleObjectToStorage(jsonObject) {
    localStorage.setItem("idleObject", JSON.stringify(jsonObject));
}

function removeIdleObjectFromArchive(level) {
    var archive = getIdleObjectArchiveFromStorage();
    for(var i = 0; i < archive.length; i++) {
        if(archive[i].level == level) {
            archive.splice(i,1);
            i--;
        }
    }
    saveIdleObjectArchiveToStorage(archive);
}

function viewIdleObjectFromArchive(level) {
    var archive = getIdleObjectArchiveFromStorage();
    for(var i = 0; i < archive.length; i++) {
        if(archive[i].level == level) {
            var idleString = JSON.stringify(archive[i], null, 2);
            var displayBoxName = $("#json_title").text("JSON for " + archive[i].level);
            var displayBox = $("#IdleJSONOutput");
            displayBox.val(idleString);
            displayBox.parent().show();
        }
    }
}

function archiveIdleObject(idleObject) {
    if(idleObject.level == null || idleObject.level.length == 0) {
        console.log("Error Archiving: Idle Object Empty");
        return;
    }
    var archive = getIdleObjectArchiveFromStorage();
    for(var i = 0; i < archive.length; i++) {
        if(archive[i].level == idleObject.level) {
            archive[i] = idleObject;
            saveIdleObjectArchiveToStorage(archive);
            return;
        }
    }
    archive.push(idleObject);
    saveIdleObjectArchiveToStorage(archive);
}

function getArchivedIdleObject(level) {
    var archive = getIdleObjectArchiveFromStorage();
    for(var i = 0; i < archive.length; i++) {
        if(archive[i].level == level) {
            return archive[i];
        }
    }
    return null;
}

function getIdleObjectArchiveFromStorage() {
    var jsonString = localStorage.getItem("idleObjectArchive");
    if(jsonString != null) {
        return JSON.parse(jsonString);
    }
    return [];
}

function saveIdleObjectArchiveToStorage(jsonObject) {
    localStorage.setItem("idleObjectArchive", JSON.stringify(jsonObject));
    // Refresh the settings when the archive changes
    refreshIdleLevels();
}

// **************** Detect Page ****************

function pageIsDashboard() {
    return location.href.match(/.*warzone[.]com\/MultiPlayer\/#?$/i);
}

function pageIsIdle() {
    return location.href.match(/.*warzone[.]com\/Idle\/.*$/i);
}

function pageIsClanWars() {
    return location.href.match(/.*warzone[.]com\/Clans\/War/i);
}

function pageIsTournaments() {
    return location.href.match(/.*warzone[.]com\/MultiPlayer\/Tournaments\/$/i);
}

function pageIsPastTournaments() {
    return location.href.match(/.*warzone[.]com\/MultiPlayer\/Tournaments\/Past/i);
}

function pageIsGame() {
    return location.href.match(/.*warzone[.]com\/MultiPlayer\?GameID=/i);
}

function pageIsForum() {
    return location.href.match(/.*warzone[.]com\/Forum/i);
}