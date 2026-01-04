// ==UserScript==
// @name         TEST Uber Memsource project creation tweak
// @version      0.8
// @description  Facilitate templated entry of Memsource project names
// @author       TB
// @match        https://cloud.memsource.com/web/project/create*
// @grant        none
// @namespace https://greasyfork.org/users/166154
// @downloadURL https://update.greasyfork.org/scripts/368592/TEST%20Uber%20Memsource%20project%20creation%20tweak.user.js
// @updateURL https://update.greasyfork.org/scripts/368592/TEST%20Uber%20Memsource%20project%20creation%20tweak.meta.js
// ==/UserScript==

var workflows = [
    {"Type":"None", "Tooltip": "", "URGs": []},
    {"Type":"TR Only", "Tooltip": "", "URGs": ["URG6","URG12","URG24"]},
    {"Type":"DTR", "Tooltip": "", "URGs": ["URG24"]},
    {"Type":"TR", "Tooltip": "", "URGs": ["URG6","URG12","URG24"], "Type2":"RV", "URGs2": ["URG24"]},
];

var urgent_types = [
    {"Type": "URG6"},
    {"Type":"URG12"},
    {"Type":"URG24"}
];

var checkboxes = [
    {"Type":"Transcreation", "Tooltip": ""},
    {"Type":"DTP", "Tooltip": "DTP tooltip"},
    {"Type":"L10nFix", "Tooltip": "L10nFix tooltip"},
];

var namefield = $('.create > table > tbody > tr:nth-child(2)');
$(namefield).append('<td id="td_workflows">Special workflows:</td><td></td><td id="td_checkboxes">Task flags:</td> <td></td><td id="td_phab">Phab#:</td> ');

workflows.forEach(function(element) {
    var tooltipHTML = "";
    if(element.Tooltip) tooltipHTML = ' data-tooltip="' + element.Tooltip + '"';
    var id = sanitize_id_name(element.Type);
    if(element.Type == "DTR") var urgNone = true;
    else var urgNone = false;

    $('#td_workflows').append('<div class="radio_container"><input type="radio" id="'+ id +'" name="workflow" display-name="'+ element.Type +'" class="uber_input uber_workflows"><label for="' + id + '"'+ tooltipHTML +'>' + element.Type + '</label></div>');
    if(element.Type != "None") {
        $('#' + id).parent().append(get_urgent_dropdown(id,urgNone,element.URGs));
    }
    if(element.Type2) {
        $('#' + id).parent().append('&nbsp;+&nbsp;<label for="' + id + '"'+ tooltipHTML +'>' + element.Type2 + '</label>' + get_urgent_dropdown(sanitize_id_name(element.Type2),null,element.URGs2));
    }
});

checkboxes.forEach(function(element) {
    var tooltipHTML = "";
    if(element.Tooltip) tooltipHTML = ' data-tooltip="' + element.Tooltip + '"';
    $('#td_checkboxes').append('<div class="checkbox_container"><input type="checkbox" id="'+ element.Type.replace(/\s/g,"") +'" class="uber_input uber_checkbox" name="'+ element.Type +'"><label for="' + element.Type + '"'+ tooltipHTML +'>' + element.Type + '</label></div>');
});

$('#td_phab').append('<input type="text" class="uber_input" id="phab" style="max-width: 100px" />');

$(document).on("click keyup change", ".uber_input, .urgent_types", event => {
    var checkbox_text = "";
    var phab_text = "";
    var space_delimit = "";
    var workflow = "";
    var current_name = strip_name($("#name").val());
    var selected_workflow = $('.uber_workflows:checked').attr('display-name');
    var selected_workflow_id = $('.uber_workflows:checked').attr('id');

    if(selected_workflow && selected_workflow != "None") {
        $('label[for=' + selected_workflow_id +']').each(function(key,label) {
            workflow += "[" + $(label).text() + "][" +  $(label).next().val() + "]";
        });
    }

    workflow = workflow.replace(/\s?\[Non-URG\]\s?/g,""); // workaround for DTR

    $('.uber_checkbox').each(function(key,value) {
        var id = $(value).attr('name');
        if($('#' + id.replace(/\s/g,"")).prop('checked')) {
            checkbox_text += "[" + id + "]";
        }
    });

    if($('#phab').val().length) phab_text = "[Phab#" + $('#phab').val() + "]";
    if(workflow || checkbox_text || phab_text) space_delimit = " ";
    var new_text = workflow + checkbox_text + phab_text + space_delimit + current_name ;
    $("#name").val(new_text);
});

function get_urgent_dropdown(field,none,acceptedTypes) {
    var html = '&nbsp;&nbsp;<select class="urgent_types" id="urgent' + field + '" style="width: 85px; height: 1.5em">';
    if(none) html += '<option value="Non-URG">Non-URG</option>'; // Workaround for DTR
    urgent_types.forEach(function(urgent) {
        if(!acceptedTypes || acceptedTypes.includes(urgent.Type)) {
            html += '<option value="' + urgent.Type + '">' + urgent.Type + '</option>';
        }
    });

    html += "</select>";
    return html
}

function sanitize_id_name(id) {
    return (id.replace(/\s/g,"").toLowerCase());
}

function replace_from_array(array,string) {
    array.forEach(function(element) {
        //var regex = new RegExp("\\[" + element.Type + "[^\\]]*\\]\\s?","g");
        var regex = new RegExp("\\[" + element.Type + "[^\\]]*\\]\\s?","g");
        string = string.replace(regex,"");
        if(element.hasOwnProperty("Type2")) {
            string = string.replace(new RegExp("\\[" + element.Type2 + "[^\\]]*\\]\\s?","g"),"");
        }
    });
    return string;
}

function strip_name(name) {
    var stripped = name;
    stripped = replace_from_array(workflows,stripped);
    stripped = replace_from_array(checkboxes,stripped);
    stripped = replace_from_array(urgent_types,stripped);
    stripped = stripped.replace(/\[Phab#[^\]]+\]\s?/,"");
    return stripped;
}