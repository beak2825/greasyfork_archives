// ==UserScript==
// @name         Previo Redmine IssueColors
// @namespace    thetomcz.previo.redmine.issuecolors
// @version      0.5.2
// @icon        https://www.previo.cz/icons/share/128x128/favicon.ico
// @match        https://redmine.previo.info/*issues?*
// @author       Tomáš Hejl <tomas.hejl@previo.info>
// @grant        none
// @description Redmine colors - per statuses, trackers
// @downloadURL https://update.greasyfork.org/scripts/492247/Previo%20Redmine%20IssueColors.user.js
// @updateURL https://update.greasyfork.org/scripts/492247/Previo%20Redmine%20IssueColors.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var IssueColors = {

        run : function () {
            $("tr.issue").each(function () {
                IssueColors.processRow($(this));
            });

            IssueColors.appendStyles();
        },

        processRow : function (row) {
            if (row.find("td.status").text().indexOf('Blocked') > -1) { // not just status blocked, but also manually filled block
                row.addClass('greyRow');
            }

            if (row.text().indexOf('BP') > -1 || row.text().indexOf('Big Picture') > -1) {
                row.addClass('bigPicture');
            }

            if (row.find('.fixed_version').text().indexOf('RELEASE') > -1) {
                row.addClass('inRelease');
            }

            if (row.text().indexOf('doNext') > -1) {
                row.addClass('doNext');
            }
        },


        appendStyles : function () {
            // tracker 1=bug, 6=feature, 12=techdebt, 11=support
            // status 1=new, 6=inProg, 29=blocked, 27=cr, 16=fb
            let head = $("head");
            head.append("<style>" +
                        ".bigPicture td {background: gold}" +
                        ".inRelease td{background: #ff3200a3; color: black} .inRelease td a{color:black}" +
                        ".doNext td {background: #b700ff7a}" +
                        ".greyRow td, .greyRow th{background: #ddd; color: rgba(160,00,00,0.4);border-bottom:1px solid; border-color:#ccc!important} " +
                        ".greyRow .status{color: grey}" +
                        ".status-16 .status{font-weight:bold;background:orange;color:black}" + // feedback
                        ".status-6 .status{font-weight:bold;background:green;color:white}" + // in progress
                        ".group.open .name {font-weight: normal!important}" +
                        ".tracker-1 .tracker{background:black;color:red;}" + // bug
                        ".tracker-1.greyRow .tracker{background:darkgrey;}" +
                        ".tracker-6 .tracker{color: green}" + // feature
                        ".tracker-12 .tracker{background: #FF850099;color:#333}" + // techdebt
                        ".tracker-11 .tracker{color: blue;background:#ffff0033}" + // support
                        ".pointMe{cursor: pointer;}" +
                        "</style>");
        },

    }

    IssueColors.run();

})();