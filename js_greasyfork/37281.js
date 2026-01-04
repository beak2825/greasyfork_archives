// ==UserScript==
// @name Wochenansicht in HQ-Reportings
// @description  Button um die aktuelle Woche in HQ-Reportings anzeigen
// @namespace Borkee
// @version 0.7.6
// @include https://querformat.hqlabs.de/*
// @require http://code.jquery.com/jquery-3.2.1.min.js
// @icon http://borkee.de/borkeesignee2.png
// @downloadURL https://update.greasyfork.org/scripts/37281/Wochenansicht%20in%20HQ-Reportings.user.js
// @updateURL https://update.greasyfork.org/scripts/37281/Wochenansicht%20in%20HQ-Reportings.meta.js
// ==/UserScript==

$(document).ready(function() {
    setTimeout(function() {
        console.log("ADD WEEKVIEW TO HQ -- by Borkee");
        var main  = $('.button_container'),
            refreshButton = $('#m_ascx_mod_myReportings_ascx_rbtRefreshBarchart',main),
            weekButton = "<div id='weekButton' class='RadButton RadButton_PMS_Standard rbButton rbRounded rbIconButton' style='display:inline-block;line-height: 23px;'>Aktuelle Woche</div>",
            start = $('#m_ascx_mod_myReportings_ascx_rdpFrom_dateInput'),
            end   = $('#m_ascx_mod_myReportings_ascx_rdpTo_dateInput');
            
        function showThisWeek() {

            var curr = new Date(),
                first = curr.getDate() - curr.getDay();
                
            first = first + 1;
            var last = first + 6;
            
            var event = new Date();

            var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            
            console.log(event.toLocaleDateString('de-DE', options));

            var monday = new Date(curr.setDate(first));
            var sunday = new Date(curr.setDate(last));
            monday = monday.toLocaleDateString("de-DE",options);
            sunday = sunday.toLocaleDateString("de-DE",options);
                
            console.log(monday);
            console.log(sunday);

            start.val(monday);
            end.val(sunday);
						
			//var mondayConv = monday.replace(/\./g,"-");
			//var sundayConv = sunday.replace(/\./g,"-");
			var mondayConv = monday.split(".");
			mondayConv.reverse();
			mondayConv.join();
			mondayConv.replace(/\./g,"-");
			
			var sundayConv = sunday.split(".");
			sundayConv.reverse();
			sundayConv.join();
			sundayConv.replace(/\./g,"-");
            
            var hiddenStart = $('#m_ascx_mod_myReportings_ascx_rdpFrom_dateInput_ClientState');
			var hiddenEnd = $('#m_ascx_mod_myReportings_ascx_rdpTo_dateInput_ClientState');
			
			console.log(hiddenStart);
			console.log(hiddenEnd);
			
			hiddenStart.val('{"enabled":true,"emptyMessage":"","validationText":"'+mondayConv+'-00-00-00","valueAsString":"'+mondayConv+'-00-00-00","minDateStr":"1980-01-01-00-00-00","maxDateStr":"2099-12-31-00-00-00","lastSetTextBoxValue":"'+monday+'"}');
            hiddenEnd.val('{"enabled":true,"emptyMessage":"","validationText":"'+sundayConv+'-00-00-00","valueAsString":"'+sundayConv+'-00-00-00","minDateStr":"1980-01-01-00-00-00","maxDateStr":"2099-12-31-00-00-00","lastSetTextBoxValue":"'+sunday+'"}');
            
            


        }
        
        // add button
        $(weekButton).insertBefore(refreshButton);
        
        $('#weekButton').on('click',function() {
            showThisWeek();
        });

    },2000);
});