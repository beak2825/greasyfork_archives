// ==UserScript==
// @name         Waze Editor Progress Tracking
// @namespace    http://tampermonkey.net/
// @version      2018.07.05.00
// @description  Add editor progress features to profile page
// @author       willdanneriv
// @include      https://www.waze.com/*user/editor*
// @include      https://beta.waze.com/*user/editor*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/370119/Waze%20Editor%20Progress%20Tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/370119/Waze%20Editor%20Progress%20Tracking.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function bootstrap(tries) {
        tries = tries || 1;

        if (W &&
            W.EditorProfile && $) {
            init();
        } else if (tries < 1000) {
            console.log(tries);
            setTimeout(function () {bootstrap(tries++);}, 200);
        }
    }

    bootstrap();

    async function init(){
        // Add editor's statistics.
        var mile2=3000;
        var mile3=25000;
        var edits = W.EditorProfile.data.edits
        var editActivity = W.EditorProfile.data.editingActivity;
        var rank = W.EditorProfile.data.rank+1;
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        var count = 0;
        var edits7,edits14,edits21,edits28 = 0;
        var editAverageDaily,editAverage7,editAverage14,editAverage21,editAverage28 = 0;
        var edits28to21,edits21to14,edits14to7,edits7to0 = 0
        var edits7poc,edits14poc,edits21poc,edits28poc = 0;
        var appMiles = false;

        var editingdays = editActivity.forEach(function(x) {if(x !== 0) count++; });
        edits7 = editActivity.slice(Math.max(editActivity.length - 7, 0)).reduce(reducer);
        edits14 = editActivity.slice(Math.max(editActivity.length - 14, 0)).reduce(reducer);
        edits21 = editActivity.slice(Math.max(editActivity.length - 21, 0)).reduce(reducer);
        edits28 = editActivity.slice(Math.max(editActivity.length - 28, 0)).reduce(reducer);
        edits28to21 = edits - edits28;
        edits21to14 = edits - edits21;
        edits14to7 = edits - edits14;
        edits7to0 = edits - edits7;
        edits7poc = Math.abs(((edits7to0/edits-1)*100)).toFixed(2);
        edits14poc = Math.abs(((edits14to7/edits7to0-1)*100)).toFixed(2);
        edits21poc = Math.abs(((edits21to14/edits14to7-1)*100)).toFixed(2);
        edits28poc = Math.abs(((edits28to21/edits21to14-1)*100)).toFixed(2);
        editAverage7 = Math.round(edits7/7);
        editAverage14 = Math.round(edits14/14);
        editAverage21 = Math.round(edits21/21);
        editAverage28 = Math.round(edits21/28);
        editAverageDaily = Math.round(editActivity.reduce(reducer)/count);

        switch(rank){
         case 1:
              if (((mile2-edits)/editAverage7) < 7 || (((mile2-edits)/mile2)*100 <= 50)) {
                  appMiles = true;}
              break;
         case 2:
              if (((mile3-edits)/editAverage7) < 30 || (((mile3-edits)/mile3)*100 <= 20)) {
                  appMiles = true;}
              break;
        }

        var editorProgressHtml = '<div class="editor-progress-list">'
                               + '<div class="editor-progress-content">'
                               + '<div class="editor-progress-item">'
                               + '<div class="editor-progress__name"><h4>Average Edits per Day</h4></div><div class="editor-progress__count">'+editAverageDaily+'</div>'
                               + '</div></div>'
                               + '<div class="editor-progress-content">'
                               + '<h4>Past 7 days</h4>'
                               + '<div class="editor-progress-item">'
                               + '<div class="editor-progress__name">Total Edits</div><div class="editor-progress__count">'+edits7to0+ ' ('+edits7+', '+ edits7poc + '%)</div>'
                               + '<div class="editor-progress__name">Average Edits/Day</div><div class="editor-progress__count">'+editAverage7+'</div>'
                               + '</div></div>'
                               + '<div class="editor-progress-content">'
                               + '<h4>Past 14 days</h4>'
                               + '<div class="editor-progress-item">'
                               + '<div class="editor-progress__name">Total Edits</div><div class="editor-progress__count">'+edits14to7+' ('+(edits14-edits7)+', '+ edits14poc + '%)</div>'
                               + '<div class="editor-progress__name">Average Edits/Day</div><div class="editor-progress__count">'+editAverage14+'</div>'
                               + '</div></div>'
                               + '<div class="editor-progress-content">'
                               + '<h4>Past 21 days</h4>'
                               + '<div class="editor-progress-item">'
                               + '<div class="editor-progress__name">Total Edits</div><div class="editor-progress__count">'+edits21to14+' ('+(edits21-edits14)+', '+ edits21poc + '%)</div>'
                               + '<div class="editor-progress__name">Average Edits/Day</div><div class="editor-progress__count">'+editAverage21+'</div>'
                               + '</div></div>'
                               + '<div class="editor-progress-content">'
                               + '<h4>Past 28 days</h4>'
                               + '<div class="editor-progress-item">'
                               + '<div class="editor-progress__name">Total Edits</div><div class="editor-progress__count">'+edits28to21+' ('+(edits28-edits21)+', '+ edits28poc + '%)</div>'
                               + '<div class="editor-progress__name">Average Edits/Day</div><div class="editor-progress__count">'+editAverage28+'</div>'
                               + '</div></div>'
                               + '</div>'

        //logging to console
        console.log("Editing days: " + count);
        console.log("Average Edits per Day: " + Math.round(editActivity.reduce(reducer)/editingdays) + " per day");
        console.log("Edits Total (7 days): " + edits7to0 + " ("+ edits7poc +"%)");
        console.log("Edits Total (14 days): " + edits14to7 + " ("+ edits14poc +"%)");
        console.log("Edits Total (21 days): " + edits21to14 + " ("+ edits21poc +"%)");
        console.log("Edit rate 7 days: " + editAverage7 + " per day");
        console.log("Edit rate 14 days: " + editAverage14 + " per day");
        console.log("Edit rate 21 days: " + editAverage21 + " per day");
        console.log("Edit rate 28 days: " + editAverage28 + " per day");
        console.log(appMiles);
        console.log($('#transaction-header-time')[0]);
        $('#editing-activity').append('<div id="editor-progress"></div>');
        $('#editor-progress').append('<div><h3>Editor Progress Tracking</h3>');
        if(appMiles){
            $('#editor-progress > div').append('<div id="milestone"><h4>Editor Approaching Milestone!!</h4></div>');
            $('#milestone').css("color","red");
        }
        $('#editor-progress').append(editorProgressHtml+'</div>');
        $('#editing-progress').css({"display":"inline-block","width":"275px","margin-bottom":"50px"});
        $('#editing-progress h3').css({"margin-bottom":"30px"});
        $('#editor-progress-list').css({"width":"1100px","margin":"30px auto 0 auto"});
        $('#editor-progress-item').css({"display":"inline-block","width":"275px","margin-bottom":"50px","float":"left","width":"30%"});
    };
})();