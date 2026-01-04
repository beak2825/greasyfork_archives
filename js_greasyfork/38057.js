// ==UserScript==
// @name         QM buttons
// @namespace    http://tampermonkey.net/
// @version      0.7.8
// @description  Help QM triagers
// @author       TB
// @match        https://gloc-qm.appspot.com/issues/*
 // @grant       GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/38057/QM%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/38057/QM%20buttons.meta.js
// ==/UserScript==

function submitOoSForm() {
    var userid = 451996471;
    var authorid = 1538645063;
    var titleid = 726378350;
    var urlid = 2139207462;

    var author = $('div.info > div:nth-child(1)').text().trim().replace("Reporter: ","");
    var url = window.location.href;
    var user = $('div.userbar > span.name').text().trim();
    var title = encodeURI($("h1").contents().filter(function(){ return this.nodeType == 3; }).text().trim());

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://docs.google.com/forms/d/1nXWLNNc7DCGjOQN55Osq7OKc9nb1PkyxFIoNtmb4cVU/formResponse?submit=Submit&entry." + userid + "="+ user + "&entry." + authorid + "=" + author + "&entry." + titleid + "=" + title + "&entry." + urlid + "=" + url,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(response) {
            console.log(response);
        }
    });

}


function CloseQueryObsolete(message,submit,reassign) {
    var author = $('div.info > div:nth-child(1)').text().trim().replace("Reporter: ","");
    var url = window.location.href;
    var user = $('div.userbar > span.name').text().trim();
    var title = $("h1").contents().filter(function(){ return this.nodeType == 3; }).text().trim();

    $('#id_answer').val(message);
    $("label:contains('Obsolete')").click();
    $('#id_assignee').append('<option value="12651" selected="selected">004-pmgr_0001@004vendor.com</option>');
    $('#create').click();

    if(submit) submitOoSForm();
    return true;
}

function CloseQuery(message,reassign) {
    var author = $('div.info > div:nth-child(1)').text().trim().replace("Reporter: ","");
    var url = window.location.href;
    var user = $('div.userbar > span.name').text().trim();
    var title = $("h1").contents().filter(function(){ return this.nodeType == 3; }).text().trim();

    if(message) $('#id_answer').val(message);
    if(reassign) $('#id_assignee').append('<option value="23455" selected="selected">004-pmgr_0012@004vendor.com</option>');
    else {
        $('#id_assignee').append('<option value="12651" selected="selected">004-pmgr_0001@004vendor.com</option>');
        $("label:contains('Obsolete')").click();
    }
    $('#create').click();

    return true;
}

var html = "";
html += '<div><input type="checkbox" id="reviewer_commented"><label for="reviewer_commented" style="display:inline-block">Reviewer commented (applies to Overdue)</label></div>';
html += '<button type="button" id="button_overdue" title="To be used when query is past deadline too long. Closes and assings to pmgr_0001.">Overdue</button>&nbsp;';
html += '<button type="button" id="button_pid_missing" title="To be used when project number is missing in the query. Enters a standard message, closes and assings to pmgr_0001.">Project no. missing</button>&nbsp;';
html += '<button type="button" id="button_subject" title="To be used when issue does not match segment. Enters a standard message, closes and assings to pmgr_0001.">Subject-segment mismatch</button>&nbsp;';
html += '<button type="button" id="button_oos" title="To be used when query is out of scope. Enters a standard message, closes, assings to pmgr_0001 and logs the query in a sheet of OoS queries.">Out of scope</button>&nbsp;';
html += '<button type="button" id="button_solved" title="To be used when solving a query. User enters message, button then closes query and assigns to pmgr_0001" disabled>Solved</button>&nbsp;';
html += '<button type="button" id="button_reassign" title="To be used when query should be sent to Google. User can enter a message and change priority. Button then assigns the query to pmgr_0012.">To be reassigned</button>&nbsp;';
html += '<button type="button" id="button_target" style="margin-top: 5px;" title="To be used when query was submitted as target but should really be source. Only fills in the templated answer.">Not target</button>&nbsp;';
html += '<button type="button" id="button_pmgr_0001" style="margin-top: 5px;" title="This button changes the assignee to pmgr_0001. This might be useful when marking query as a duplicate. As opposed to the Solved button, this one doesn’t mark the query as Obsolete.">Assignee to pmgr_0001</button>&nbsp;';
html += '<button type="button" id="button_duplicate" style="margin-top: 5px;" title="This button enters a predefined message for duplicate queries. You still need to paste the Buganizer ID into the appropriate field and close the query manually.">Duplicate</button>&nbsp;';
html += '<button type="button" id="button_screenshot" style="margin-top: 5px;" title="Enters an automessage asking for explanation on what is unclear.">Screenshots</button>&nbsp;';
html += '<button type="button" id="button_not_source" style="margin-top: 5px;" title="Enters an automessage that a query was submitted as source and should actually be target.">Not Source</button>&nbsp;';


$('#id_answer').parent().prepend(html);
$('#id_answer').parent().css("overflow-wrap", "break-word");
if($('.answer_info > em > span:contains("002vendor.com")').length || $('.answer_info > em > span:contains("014vendor.com")').length) {
    $('#reviewer_commented').prop('checked',true);
}

$(document).on('click','#button_overdue', e => {
    var extra = "";
    if($('#reviewer_commented').prop('checked')) {
        extra = "\n\n@Reviewers: If you feel you want to escalate to Google, please do so.";
    }

    CloseQueryObsolete("Hello, closing this query as the due date has passed and this query is not relevant anymore. If this is a persistent issue across multiple projects, please submit a new query next time this appears. Thanks!" + extra);
});

$(document).on('click','#button_pid_missing', e => {
    CloseQueryObsolete("Hello, please submit a new query with the corresponding project number as this query lacks one. Thanks!");
});

$(document).on('click','#button_subject', e => {
    CloseQueryObsolete("Hello, the subject line you entered does not match the source segment. Please submit a new query. Thanks!");
});

$(document).on('click','#button_oos', e => {
    CloseQueryObsolete("Hello, under Google's new rules, this query falls under the Out of Scope category and will be closed now. Thanks!",true);
});

$(document).on('click','#button_solved', e => {
    CloseQuery();
});

$(document).on('click','#button_reassign', e => {
    CloseQuery(null,true);
});

$(document).on('click','#button_target', e => {
    $('#id_answer').val("Hello, based on the nature of the question, this should be a source query. I'm changing the category accordingly. Please watch out for submitting queries correctly! Thanks.");
});

$(document).on('click','#button_pmgr_0001', e => {
    $('#id_assignee').append('<option value="12651" selected="selected">004-pmgr_0001@004vendor.com</option>');
});

$(document).on('click','#button_duplicate', e => {
    $('#id_answer').val('Hello, this query is duplicate to the one specified in the top-right field: "Status: Duplicate of." Please watch out for submitting duplicate queries!');
    document.querySelector("#id_duplicate_of_id").click();
    document.querySelector("#id_duplicate_of_id").focus();
    document.querySelector("#id_duplicate_of_id").select();
});

$(document).on('change input keyup','#id_answer', e => {
    if($('#id_answer').val().length) $('#button_solved').attr('disabled',false);
    else $('#button_solved').attr('disabled',true);
});

$(document).on('click','#button_screenshot', e => {
    $('#id_answer').val("Hello, please specify what is unclear here or what you do not understand so we can try and help you. Asking simply for screenshot without reasoning why it's needed is not a valid query. Thanks!");
});

$(document).on('click','#button_not_source', e => {
    $('#id_answer').val("Hello, based on the nature of the question, this should be a target query. I'm changing the category accordingly. Please watch out for submitting queries correctly! Thanks.");
});
