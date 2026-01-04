// ==UserScript==
// @name         HERO Task Button Fix
// @namespace    https://gist.github.com/finlayacourt/b6d4bedb754bb375acb420d33942f6f1
// @version      1.1
// @description  Add Mark as Done buttons to set-tasks page
// @author       finlayacourt
// @match        http://hero.highgateschool.org.uk/set-tasks
// @downloadURL https://update.greasyfork.org/scripts/37141/HERO%20Task%20Button%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/37141/HERO%20Task%20Button%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add mark as done buttons to each task
    $(".ff-messages li").each(function() {
        // Get taskID
        var taskID = $(this).attr("data-ff-id");
        $(this).children().append(
            $('<button></button>')
                .addClass('update-task-button ff_module-button ff_module-button--primary-compact')
                .css({float: 'right', color: 'pink'})
                .text('Mark As Done')
        );
    });

    // Mark task with ID taskID as done
    $('.update-task-button').click(function() {
        var taskID = $(this).parent().parent().attr("data-ff-id");
        var taskDataURL = "_api/1.0/tasks/" + taskID + "/responses";

        // Request student and teacher data
        $.getJSON(taskDataURL, function(returnedJson) {
            var a = returnedJson.responses.responses[0],
                b = a.events[0].description,
                studentGuid = a.recipient.guid,
                teacherGuid = b.author,
                taskDate = b.sent;

            // Request server to mark task as done
            $.ajax({
                url: taskDataURL,
                method: "POST",
                data: {
                    data: JSON.stringify({
                        recipient: {
                            type: "user",
                            guid: studentGuid
                        },
                        event: {
                            type: 'mark-as-done',
                            sent: taskDate,
                            author: teacherGuid
                        }
                    })
                }
            });
        });

        $('.update-task-button').remove();
    });
})();