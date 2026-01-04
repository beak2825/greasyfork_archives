// ==UserScript==
// @name         JIRA Cloud Quick Add Sub-Tasks
// @namespace    *.atlassian.net
// @version      0.3
// @description  Quickly add subtasks to a JIRA Task
// @match        https://*.atlassian.net/browse/*
// @grant        none
//
// @author			Tim <timsayshey@gmail.com>
//
// @license         GPLv3 - http://www.gnu.org/licenses/gpl-3.0.txt
// @copyright       Copyright (C) 2018, by Tim <timsayshey@gmail.com>
// @Locale          en_US
// @downloadURL https://update.greasyfork.org/scripts/38399/JIRA%20Cloud%20Quick%20Add%20Sub-Tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/38399/JIRA%20Cloud%20Quick%20Add%20Sub-Tasks.meta.js
// ==/UserScript==

/**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

function main() {
    $("body").append(
        "<link rel='stylesheet prefetch' href='https://versatilitywerks.github.io/jAlert/dist/jAlert.css'>"+
        "<script src='https://versatilitywerks.github.io/jAlert/dist/jAlert.min.js'></script>"
    );

    $("body").append('<a href="javascript:void(0)" id="addSubtasks" style="position:absolute;right:0;top:0;z-index:9999; background:white; display:block; padding:5px; margin:15px; border-radius:3px; border:1px solid #bbb">Bulk Subtasks (Open subtask modal first)</a>');

    $(document).on("click","#addSubtasks",function(e) {
        $.jAlert({
            'id': 'myAlert',
            'content':
                 '<h4>Add Sub Tasks</h4> Enter a list of new subtasks. On each line, separate the title from the description with a dollar sign ($) as seen in the placeholder below.<br><b style="color:red">New sub task modal must be open otherwise this won\'t work!</b>'+
                 '<textarea id="subtaskList" style="height:300px;width:100%" class="required" name="msg" placeholder="My new task $ My new task description\nAnother new-task $ Another new task description\nYet another new task $ Yet another new task description"></textarea>'+
                 '<a href="#" id="saveSubtasks" class="aui-button">Submit</a>',
            'autofocus':'textarea',
            'size':'md'
        });
    });

    $(document).on("click","#saveSubtasks",function(e) {
        var lines = $('#subtaskList').val().split('\n');
        console.log(lines);
        $.each(lines, function(){
            var details = this.split("$");
            console.log(details);
            $.post("/secure/QuickCreateIssue.jspa?decorator=none", {
                pid: $(".aui-avatar-project").attr("id"),
                issuetype: 5,
                parentIssueId: $("input[name=parentIssueId]").val(),
                atl_token: $("input[name=atl_token]").val(),
                formToken: $("input[name=formToken]").val(),
                priority: 3,
                summary: details[0],
                description: details[1],
                assignee: "-1",
                "dnd-dropzone": "",
                duedate: "",
                fieldsToRetain: "project"
            },
            function(data, status){
                alert("Data: " + data + "\nStatus: " + status);
            });
        });

    });
}

// Execute the main function
main();