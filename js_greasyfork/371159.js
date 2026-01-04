// ==UserScript==
// @name         Jira RapidBoard Resizer
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  resize Jira RadpidBoard
// @author       chengsiyuan@360.cn
// @include      /jira.*/secure/RapidBoard.jspa*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371159/Jira%20RapidBoard%20Resizer.user.js
// @updateURL https://update.greasyfork.org/scripts/371159/Jira%20RapidBoard%20Resizer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    const version = 1;
    function installMissedSplitbar() {
        var dragBar = document.getElementById("ghx-detail-head");
        var detailView = document.getElementById("ghx-detail-view");
        var headerGroup = document.getElementById("ghx-column-header-group");
        var controlGroup = document.getElementById("ghx-detail-head");
        var tmpElem = document.createElement('div');
        tmpElem.innerHTML = '<span style="display: block;" id="js-sizer2" class="ghx-sizer ui-resizable-handle ui-resizable-w" data-tooltip="Resize Detail View" original-title=""><span class="ghx-icon ghx-icon-sizer"></span></span>';
        var dragElem = tmpElem.childNodes[0];
        controlGroup.insertBefore(dragElem, controlGroup.childNodes[0]);
        var currentVersion = localStorage.getItem('version');
        if (currentVersion == version) {
            var detailViewWidth = localStorage.getItem('detailViewWidth');
            var headerGroupWidth = localStorage.getItem('headerGroupWidth');
            detailView.style.width = detailViewWidth;
            headerGroup.style.width = headerGroupWidth;
        }
        dragBar.addEventListener("mousedown", startJiraDrag, false);
        var stateMouseDown = false; var mouseStartX = 0;
        var jiraStartWidth, jiraHeaderWidth; var currentStylesheet;
        function startJiraDrag(ev) {
            if (currentStylesheet) {
                document.body.removeChild(currentStylesheet);
            }
            stateMouseDown = true;
            mouseStartX = ev.pageX;
            jiraStartWidth = detailView.clientWidth;
            jiraHeaderWidth = headerGroup.clientWidth;
            document.addEventListener("mousemove", continueJiraDrag, false);
            document.addEventListener("mouseup", endJiraDrag, false);
        }
        function continueJiraDrag(ev) {
            var pX = ev.pageX;
            detailView.style.width = (jiraStartWidth + mouseStartX - pX) + "px";
            headerGroup.style.width = (jiraHeaderWidth - mouseStartX + pX) + "px";
        }
        function endJiraDrag() {
            localStorage.setItem('detailViewWidth', detailView.style.width);
            localStorage.setItem('headerGroupWidth', headerGroup.style.width);
            localStorage.setItem('version', version);
            document.removeEventListener("mousemove", continueJiraDrag, false);
            document.removeEventListener("mouseup", endJiraDrag, false);
        }
    }
    window.addEventListener("load", function () {
        var detailView = document.getElementById("ghx-detail-view");
        var config = { attributes: true, childList: true, subtree: true };
        var observer = new MutationObserver(function () {
            if (document.getElementById('js-sizer2')) return;
            var controlGroup = document.getElementById("ghx-detail-head");
            if (controlGroup === null) return;
            installMissedSplitbar();
        });
        observer.observe(detailView, config);
    }, false);
})();