// ==UserScript==
// @name         OpenAir Timesheet Filler
// @namespace    https://greasyfork.org/en/users/814-bunta
// @version      2.4
// @description  Insert default time entries to Open Air timesheet
// @author       Bunta
// @match        https://www.openair.com/timesheet.pl*
// @match        datacom-group-limited.app.openair.com/timesheet.pl*
// @match        datacom-group-limited.app.netsuitesuiteprojectspro.com/timesheet.pl*
// @license      http://creativecommons.org/licenses/by-nc-sa/3.0/us/
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/389317/OpenAir%20Timesheet%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/389317/OpenAir%20Timesheet%20Filler.meta.js
// ==/UserScript==

// Add new buttons after timesheet page loads
(async function() {
    function initSettings(count, defaultEnabled) {
        let settings = {
            'taskcount':
            {
                'label': 'Number of Static Tasks to Fill',
                'section': ['Task Settings', 'Change the values here and click save to update the below options'], // Appears above the field
                'type': 'select',
                'title': 'Change amount and click save to update the options below', // Tooltip displayed on hover over
                'options': ['0','1','2','3','4','5','6','7','8','9','10'],
                'save': false // Don't save this fields value, use save event.
            },
            'defaultEnabled':
            {
                'label': 'Enable Default Task',
                'type': 'select',
                'title': 'Enables/disables a default task to fill up to 7.5 hours', // Tooltip displayed on hover over
                //'default': true,
                'options': ['Yes','No'],
                'save': false // Don't save this fields value, use save event.
            }
        }
        for (let i=1; i <= 10; i++) {
            if (i>count) {
                settings[i+'Project'] = { 'type': 'hidden' };
                settings[i+'Task'] = { 'type': 'hidden' };
                settings[i+'Timetype'] = { 'type': 'hidden' };
                settings[i+'Duration'] = { 'type': 'hidden' };
                settings[i+'Comment'] = { 'type': 'hidden' };
            } else {
                settings[i+'Project'] = {
                    'label': 'Project', // Appears next to field
                    'section': 'Task '+i, // Appears above the field
                    'type': 'text', // Makes this setting a text field
                    'title': 'Project code. Find from option values in selection box code', // Tooltip displayed on hover over
                    'default': '1420:29014' // DATACOM INTERNAL : K27260 NZ SHARED SERVICE - CORPORATE NZ : Corp Group Strategy & Architecture
                }
                settings[i+'Task'] = {
                    'label': 'Task',
                    'type': 'text',
                    'title': 'Task code. Find from the option values in selection box code once Project has been selected',
                    'default': '599681' // 1: Internal BAU [Internal]
                }
                settings[i+'Timetype'] = {
                    'label': 'Time type',
                    'type': 'text',
                    'title': '15 = NZ Ordinary Hours, 59 = AU Ordinary Pay',
                    'default': '15'
                }
                settings[i+'Duration'] = {
                    'label': 'Duration',
                    'type': 'text',
                    'title': 'Duration of entry. Use a single number for the same value each day or comma seperated numbers for 5 daily values. 0 values will skip entry for that day',
                    'default': '0.5'
                }
                settings[i+'Comment'] = {
                    'label': 'Comment',
                    'type': 'text',
                    'title': 'Comment to use for added time entries',
                    'default': 'Architect Stuff'
                }
            }
        }
        if (defaultEnabled == 'Yes') {
            settings['Project'] = {
                'label': 'Project', // Appears next to field
                'section': ['Default Task','This task will fill in the remaining hours of each day to make up 7.5 hours'], // Appears above the field
                'type': 'text', // Makes this setting a text field
                'title': 'Project code. Find from option values in selection box code', // Tooltip displayed on hover over
                'default': '1420:29014' // DATACOM INTERNAL : K27260 NZ SHARED SERVICE - CORPORATE NZ : Corp Group Strategy & Architecture
            }
            settings['Task'] = {
                'label': 'Task',
                'type': 'text',
                'title': 'Task code. Find from the option values in selection box code once Project has been selected',
                'default': '599681' // 1: Internal BAU [Internal]
            }
            settings['Timetype'] = {
                'label': 'Time type',
                'type': 'text',
                'title': '15 = NZ Ordinary Hours, 59 = AU Ordinary Pay',
                'default': '15'
            }
            settings['Comment'] = {
                'label': 'Comment',
                'type': 'text',
                'title': 'Comment to use for added time entries',
                'default': 'Architect Stuff'
            }
        } else {
            settings['Project'] = { 'type': 'hidden' };
            settings['Task'] = { 'type': 'hidden' };
            settings['Timetype'] = { 'type': 'hidden' };
            settings['Comment'] = { 'type': 'hidden' };
        }
        return settings;
    }

    function initGM(taskCount, defaultEnabled) {
        let settings = initSettings(taskCount, defaultEnabled);
        GM_config.init({
            'id': 'OAConfig', // The id used for this instance of GM_config
            'title': 'OpenAir Timesheet Filler Settings', // Panel Title
            'fields': settings,
            'events': {
                'init': function()
                {
                    // You must manually set an unsaved value
                    GM_config.fields['taskcount'].value = taskCount;
                    GM_config.fields['defaultEnabled'].value = defaultEnabled;
                },
                'save': function(values) {
                    let changed = false;
                    for (let id in values) {
                        if (id == 'taskcount' && values[id] != taskCount) {
                            taskCount = Number(values[id]);
                            GM_config.fields['taskcount'].value = taskCount;
                            changed = true;

                            // Save the value for next time
                            GM_config.setValue('taskcount', taskCount);
                        }
                        if (id == 'defaultEnabled' && values[id] != defaultEnabled) {
                            defaultEnabled = values[id];
                            GM_config.fields['defaultEnabled'].value = defaultEnabled;
                            changed = true;

                            // Save the value for next time
                            GM_config.setValue('defaultEnabled', defaultEnabled);
                        }
                    }

                    if (changed) {
                        // Re-initialize GM_config for the task amount change
                        settings = initSettings(taskCount, defaultEnabled);
                        GM_config.init({ 'id': this.id, 'title': this.title, 'fields': settings });

                        // Refresh the config panel for the new task amount
                        GM_config.close();
                        GM_config.open();
                    }
                }
            }
        });
        return GM_config
    }

    let taskCount = await GM.getValue('taskcount', 0);
    let defaultEnabled = await GM.getValue('defaultEnabled', 'Yes');
    let gms = initGM(taskCount, defaultEnabled);

    var loadCheck = setInterval(pollVisibility, 100);
    setTimeout(function(){clearInterval(loadCheck);},10000);

    function pollVisibility() {
        if ($("button#save_grid_submit").is(":visible")) {
            addButtons();
            clearInterval(loadCheck);
        }
    }

    function addButtons() {
        // add fill static button
        var elem1 = document.createElement("input");
        elem1.id = 'timesheet_fillstaticbutton';
        elem1.className = 'btn-oa';
        elem1.value = 'Fill Static';
        elem1.type = 'button';
        elem1.addEventListener('click', fillStaticData, false);
        $("input#timesheet_savebutton").after(elem1);
        //$("td.nav_item_options").after(elem);

        // add fill default button
        var elem2 = document.createElement("input");
        elem2.id = 'timesheet_filldefaultbutton';
        elem2.className = 'btn-oa';
        elem2.value = 'Fill Default';
        elem2.type = 'button';
        elem2.addEventListener('click', fillDefaultData, false);
        elem1.after(elem2);

        // add fill both button
        var elem3 = document.createElement("input");
        elem3.id = 'timesheet_fillbothbutton';
        elem3.className = 'btn-oa';
        elem3.value = 'Fill Both';
        elem3.type = 'button';
        elem3.addEventListener('click', fillBothData, false);
        elem2.after(elem3);

        // add config button
        var elem4 = document.createElement("input");
        elem4.id = 'timesheet_settingsbutton';
        elem4.className = 'btn-oa';
        elem4.value = 'Fill Settings';
        elem4.type = 'button';
        elem4.addEventListener('click', openConfig, false);
        elem3.after(elem4);
    }

    function openConfig() {
        gms.open();
    }

    function fillBothData() {
        fillStaticData();
        fillDefaultData();
    }

    function fillStaticData() {
        if (gms.get('taskcount') > 0) {
            for (let taskId = 1; taskId <= gms.get('taskcount'); taskId++) {
                // Get index of next empty row
                let rowId = Number($("tr.gridDataEmptyRow").attr("data-row-index"))+1;

                // Set project & task for selected row
                $("select#ts_c1_r"+rowId).val(gms.get(taskId+'Project')).trigger("change");
                $("select#ts_c2_r"+rowId).val(gms.get(taskId+'Task')).trigger("change");
                $("select#ts_c3_r"+rowId).val(gms.get(taskId+'Timetype')).trigger("change");

                let durVals = []
                let dur = gms.get(taskId+'Duration');
                if (gms.get(taskId+'Duration').indexOf(',') > 0) {
                    durVals = dur.split(',');
                } else {
                    durVals = [dur,dur,dur,dur,dur];
                }

                for (let i = 4; i <= 8; i++) {
                    // Skip disabled cells for month end timesheets
                    if ($("input#ts_c"+i+"_r"+rowId+"[disabled]").length) { continue; }
                    // Skip holidays
                    if ($("th.timesheetFixedColumn"+(11-i)+".timesheetDayHeaderCell div.scheduleException i.sprites.warning_orange").length) { continue; }
                    // Skip where duration is 0
                    if (!(durVals[i-4]>0)) { continue; }

                    // TODO: Set duration per day
                    // Set time and comment for enabled days
                    $("input#ts_c"+i+"_r"+rowId).val(durVals[i-4]).trigger("change");
                    $("a#ts_notes_c"+i+"_r"+rowId).trigger("click");
                    $("textarea#tm_notes").val(gms.get(taskId+'Comment')).trigger("change");
                    $("button.dialogOkButton").trigger("click");
                }
            }
        }
    }

    function fillDefaultData() {
        // fill in default values if enabled
        if (gms.get('defaultEnabled') == 'Yes') {
            // Get index of next empty row
            let rowId = Number($("tr.gridDataEmptyRow").attr("data-row-index"))+1;

            // Set project & task for selected row
            $("select#ts_c1_r"+rowId).val(gms.get('Project')).trigger("change");
            $("select#ts_c2_r"+rowId).val(gms.get('Task')).trigger("change");
            $("select#ts_c3_r"+rowId).val(gms.get('Timetype')).trigger("change");

            for (let i = 4; i <= 8; i++) {
                // Skip disabled cells for month end timesheets
                if ($("input#ts_c"+i+"_r"+rowId+"[disabled]").length) { continue; }
                // Skip holidays
                if ($("th.timesheetFixedColumn"+(11-i)+".timesheetDayHeaderCell div.scheduleException i.sprites.warning_orange").length) { continue; }

                // Check for existing time and calculate difference
                let timeAdd = 7.5 - Number($("tfoot td:nth-child("+(i-1)+")").text());

                if (timeAdd > 0) {
                    // Set time and comment for enabled days
                    $("input#ts_c"+i+"_r"+rowId).val(String(timeAdd)).trigger("change");
                    $("a#ts_notes_c"+i+"_r"+rowId).trigger("click");
                    $("textarea#tm_notes").val(gms.get('Comment')).trigger("change");
                    $("button.dialogOkButton").trigger("click");
                }
            }
        }
    };

})();
