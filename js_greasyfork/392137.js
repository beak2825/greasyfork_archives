// ==UserScript==
// @name         TFS Customize
// @namespace    https://wenzel-metromec.ch/
// @version      0.6
// @description  Highlights Task Tags and other minor UI changes
// @author       RBi
// @match        https://*.tfspreview.com/*/_backlogs/taskboard*
// @match        http://*/tfs/*/_backlogs/taskboard*
// @match        http://*/tfs2/*/_backlogs/taskboard*
// @match        https://*.tfspreview.com/*/_backlogs/TaskBoard*
// @match        http://*/tfs/*/_backlogs/TaskBoard*
// @match        http://*/tfs2/*/_backlogs/TaskBoard*
// @match        http://*/tfs/*/_backlogs/board/*
// @match        http://*/tfs2/*/_backlogs/board/*
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392137/TFS%20Customize.user.js
// @updateURL https://update.greasyfork.org/scripts/392137/TFS%20Customize.meta.js
// ==/UserScript==
window.jQuery331 = $.noConflict(true);
(function() {
    'use strict';
    var qtLinkingInProgress = false;

    $( document ).ready(function() {
        $(".right-hub-content").bind("DOMSubtreeModified", function() {
          var tag = $('.tag-box:contains("BLOCKED")');
          tag.css('background-color','red');
          tag.css('color','white');
          tag.css('font-weight','bold');

          if (!qtLinkingInProgress) {
            qtLinkingInProgress = true;
            $('.clickable-title').each(function(){
              if(!$(this).hasClass('id-title-container') && (this.previousElementSibling == null || !$(this.previousElementSibling).hasClass('qt-link'))) {
                var qtMatch = this.innerHTML.match(/(QT-(\d{4,}))/);
                if(qtMatch) {
                  var qtName = qtMatch[1];
                  var qtNum = qtMatch[2];
                  $('<a class="qt-link" href="https://tracker.wenzel-metromec.ch/cm/Intranet/View/topic_detail.asp?record='+qtNum+'&FormID=2" target="_blank">[&uarr;]&nbsp;</a>').insertBefore(this);
                }
              }
            });
            qtLinkingInProgress = false;
          }
        });

        document.styleSheets[0].insertRule(`
          .no-split .toolbar.hub-pivot-toolbar {
            width: 400px;
            margin: auto;
            position: absolute;
            top: 0px;
            left: 50%;
            margin-left: -200px;
          }
        `, 0);

        document.styleSheets[0].insertRule(`
          .no-split .hub-pivot-content {
            top: 34px !important;
          }
        `, 0);

        document.styleSheets[0].insertRule(`
          .taskboard-cell[axis="taskboard-table-body_s0"] .id-title-container {
            margin: 0px 6px 0px 22px;
          }
        `, 0);

        document.styleSheets[0].insertRule(`
          .taskboard-cell[axis="taskboard-table-body_s0"] .tbTile:hover .id-title-container {
            margin: 4px 6px 6px 6px;
          }
        `, 0);

        document.styleSheets[0].insertRule(`
          .taskboard-cell[axis="taskboard-table-body_s0"] .field-container.assignedTo.onTileEditDiv.non-combo-behavior img {
            position: absolute;
            top: 5px;
            left: 0px;
            width: 20px;
            height: 20px;
          }
        `, 0);

        document.styleSheets[0].insertRule(`
          .taskboard-cell[axis="taskboard-table-body_s0"] .tbTile:hover .field-container.assignedTo.onTileEditDiv.non-combo-behavior img {
            position: inherit;
            width:28px;
            height:28px;
          }
        `, 0);

        document.styleSheets[0].insertRule(`
          .tbTile {
            position: relative;
          }
        `, 0);

        document.styleSheets[0].insertRule(`
          .taskboard-cell[axis="taskboard-table-body_s0"] .field-container.assignedTo.onTileEditDiv.non-combo-behavior span {
            display: none;
          }
        `, 0);

        document.styleSheets[0].insertRule(`
          .taskboard-cell[axis="taskboard-table-body_s0"] .tbTile:hover .field-container.assignedTo.onTileEditDiv.non-combo-behavior span {
            display: block;
          }
        `, 0);

        document.styleSheets[0].insertRule(`
          .taskboard-cell[axis="taskboard-table-body_s0"] .container.witExtra {
            height: 0px;
            margin: 0px;
          }
        `, 0);

        document.styleSheets[0].insertRule(`
          .taskboard-cell[axis="taskboard-table-body_s0"] .tbTile:hover .container.witExtra {
            margin-left: 7px;
            margin-right: 9px;
            margin-bottom: 9px;
            height: 28px;
          }
        `, 0);

        document.styleSheets[0].insertRule(`
          .taskboard-cell[axis="taskboard-table-body_s0"] .field-container.onTileEditDiv.non-combo-behavior.ellipsis.effort.witRemainingWork {
            position: absolute;
            bottom: 1px;
            right: 1px;
          }
        `, 0);

        document.styleSheets[0].insertRule(`
          .taskboard-cell[axis="taskboard-table-body_s0"] .tbTile:hover .field-container.onTileEditDiv.non-combo-behavior.ellipsis.effort.witRemainingWork {
            position: inherit;
          }
        `, 0);
    });
})();