// ==UserScript==
// @name         Jira: Display times on sub-tasks
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Display times on sub-tasks on mouseover. For any JIRA issue page. Please set a "User Match" filter to make it run on your JIRA instance only: "https://<your-JIRA-domain>/browse/*"
// @author       https://github.com/davidzapper
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23024/Jira%3A%20Display%20times%20on%20sub-tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/23024/Jira%3A%20Display%20times%20on%20sub-tasks.meta.js
// ==/UserScript==

(function() {
    function addTimes() {
        //console.log('adding times');
        
        $('#issuetable .progress>table table table tr.tt_graph td').each(function(){
            if ($(this).css('background-color')!='rgba(0, 0, 0, 0)') {
                if (!$(this).hasClass('timePop')) {
                    var timeStr = $(this).find('img').attr('title');
                    if (timeStr) {
                        timeStr = timeStr.replace('Original Estimate - ','');
                        timeStr = timeStr.replace('Remaining Estimate - ','');
                        timeStr = timeStr.replace('Time Spent - ','');
                        timeStr = timeStr.replace('Not Specified','');
                        timeStr = timeStr.replace(' days','d');
                        timeStr = timeStr.replace(' day','d');
                        timeStr = timeStr.replace(' hours','h');
                        timeStr = timeStr.replace(' hour','h');
                        timeStr = timeStr.replace(' minutes','m');
                        timeStr = timeStr.replace(' minute','m');
                        timeStr = timeStr.replace(' seconds','s');
                        timeStr = timeStr.replace(' second','s');
                        timeStr = timeStr.replace(',','');
                        $(this).prepend('<p style="position:absolute;color:black;font-size:12px;display:none;background-color:rgba(255,255,255,0.5)">'+timeStr+'</p>');
                        $(this).addClass('timePop');
                    }
                }
            }
        });
    }
    
    $(document).ready(function(){
        JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED, function() {
            updateHandlers();
        });
    });
    function updateHandlers(){
        //console.log('updateHandlers');
        $('#issuetable').mouseenter(function(){
            addTimes();
            $('.timePop p').show();
            $('.timePop').css('height','12px');
        });
        $('#issuetable').mouseleave(function(){
            $('.timePop p').hide();
            $('.timePop').css('height','6px');
        });
    }
})();