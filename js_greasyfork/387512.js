// ==UserScript==
// @name         Clear Time Punches
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://my.serviceautopilot.com/TimesheetEdit.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387512/Clear%20Time%20Punches.user.js
// @updateURL https://update.greasyfork.org/scripts/387512/Clear%20Time%20Punches.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $('.cpHeaderWide').html("<div class='float_left'><div class='float_left' style='padding: 2px 8px 0 6px'><img src='/images/down-arrow.png' alt=''></div><div class='float_left padding-right-6px'><p class='SmallButton'><a href='javascript:_timesheetEdit.ShowAddEntryEditor()'>Add</a></p></div><p class='SmallButton'><a href='javascript:_exportScheduledWorkDialog.showExportScheduledWorkDialog(_timesheetEdit.ExportTimesheet, _timesheetEdit.TargetDate, _timesheetEdit.TargetDate);'>Export</a></p><p class='SmallButton' id='clearAll'><a>Clear</a></p></div>")
    $('#clearAll').click(function() {
        $("[guid]").each(function(i, obj) {
            $.post("https://my.serviceautopilot.com/WebServices/TimesheetListWs.asmx/DeleteTimesheetEntry", { WorkdayJobID: $(this).attr('guid')} );
            location.reload();
        });
    });
})();