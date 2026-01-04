// ==UserScript==
// @name         Previo Redmine IssueNotes
// @namespace    thetomcz.previo.redmine.issuenotes
// @description  -
// @version      0.4
// @icon        https://www.previo.cz/icons/share/128x128/favicon.ico
// @author       Tomáš Hejl <tomas.hejl@previo.info>
// @match        https://redmine.previo.info/*issues?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492249/Previo%20Redmine%20IssueNotes.user.js
// @updateURL https://update.greasyfork.org/scripts/492249/Previo%20Redmine%20IssueNotes.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var IssueNotes = {

        hidden : {
            ftr : false,
            blo : false,
        },

        run : function () {
            $("tr.issue").each(function () {
                IssueNotes.processRow($(this));
            });
            IssueNotes.appendStyles();
        },

        appendStyles : function () {
            let head = $("head");
            head.append("<style>" +
                        ".in_savedNote{font-size: 80%}" +
                        ".in_origStatus.hasNote{font-size: 70%; margin-right: 1em}" +
                        "</style>");
        },


        processRow : function (row) {
            let issueNr = row.find("td.id").text(),
                statusCell = row.find("td.status"),
                savedNote = IssueNotes.getSavedNote(issueNr);

            statusCell.html('<span class="in_origStatus" id="in_origStatus' + issueNr + '">' +
                            statusCell.html() +
                            '</span>' +
                            '<span class="in_savedNote" id="in_savedNote' + issueNr + '"></span>');

            IssueNotes.renderNote(issueNr, savedNote);
            IssueNotes.addIcon(issueNr, statusCell);

            if (statusCell.text().indexOf('Blocked') > -1) { // not just status blocked, but also manually filled block
                row.addClass('greyRow');
            }

            if (row.text().indexOf('BP') > -1 || row.text().indexOf('Big Picture') > -1) {
                row.addClass('bigPicture');
            }
        },

        addIcon : function (issueNr, statusCell) {
            statusCell.append('<a class="icon icon-edit" id="editIN' + issueNr + '"></a>');
            $("#editIN" + issueNr).click(function () {
                IssueNotes.clickIcon(issueNr, statusCell);
                return false;
            });
        },

        clickIcon : function (issueNr, statusCell) {
            let note = prompt("Enter note", IssueNotes.getSavedNote(issueNr));
            localStorage.setItem('IN' + issueNr, note);
            IssueNotes.renderNote(issueNr, note);
        },

        renderNote : function (issueNr, savedNote) {
            let origStatus = $("#in_origStatus" + issueNr);
            savedNote ? origStatus.addClass("hasNote") : origStatus.removeClass("hasNote");
            $("#in_savedNote" + issueNr).text(savedNote);
        },

        getSavedNote : function (issueNr) {
            return localStorage.getItem('IN' + issueNr) || '';
        },
    }

    IssueNotes.run();

})();