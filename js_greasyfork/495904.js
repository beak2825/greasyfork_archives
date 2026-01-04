// ==UserScript==
// @name         Previo Redmine Spent Time
// @namespace    thetomcz.previo.redmine.spenttime
// @version      0.1
// @description  .
// @author       TheTomCZ
// @icon        https://www.previo.cz/icons/share/128x128/favicon.ico
// @match        https://redmine.previo.info/time_entries*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495904/Previo%20Redmine%20Spent%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/495904/Previo%20Redmine%20Spent%20Time.meta.js
// ==/UserScript==

(function () {

    var PrevioSpentTime = {
        issuesDate: null,
        issueNrs: [],

        run: function(){
            PrevioSpentTime.lastEntry();
            PrevioSpentTime.todayIssues();
        },

        lastEntry: function(){
            let raw = $($(".created_on")[1]).text();
            let entryDate = new Date(raw.substr(6,4), raw.substr(3,2) - 1, raw.substr(0,2), raw.substr(11,2), raw.substr(14,2), 0);
            let diff = Math.floor(((new Date()) - entryDate)/1000);
            let hours = Math.floor(diff/60/60);
            diff = diff - 60*60*hours;
            let minutes = Math.floor(diff/60);
            diff = diff - 60*minutes;
            let seconds = diff;

            $(".query-totals").prepend("<span style='margin-right:4em'>"+hours.toString().padStart(2, '0')+':'+minutes.toString().padStart(2, '0')+" since last entry</span>");
        },

        todayIssues: function(){
            $("head").append("<style>input.selector{border: 0 none; text-family: inherit; width: 40em; margin: -3px 0 0; height: auto}input.selector:focus{outline: none!important}</style>");
            $("tr.time-entry").each(function(){
                let date = $(this).find(".spent_on").text();
                if(date != PrevioSpentTime.issuesDate){
                    if(PrevioSpentTime.issuesDate){
                        PrevioSpentTime.outputIssues();
                    }
                    PrevioSpentTime.issuesDate = date;
                }
                let issue = $(this).find(".issue .issue").text();
                let issueParts = issue.split("#");
                let issueNr = "#"+issueParts[1];
                PrevioSpentTime.issueNrs[issueNr] = issueNr;

            });
        },

        outputIssues: function(){
            let opener = $("tr.group.open .name:contains('"+PrevioSpentTime.issuesDate+"')");
            let cell = opener.closest('td');
            let issueText = Object.keys(PrevioSpentTime.issueNrs).join(', ');
            console.log(PrevioSpentTime.issueNrs);
            cell.append("Today's issues: <input class='selector' value='"+issueText+"' />");
            PrevioSpentTime.issueNrs = [];
        },

    };

    PrevioSpentTime.run();
})();