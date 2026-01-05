/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 Paweł Golonko
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// ==UserScript==
// @name         JIRA: Copy standup report
// @description  Copy your standup report as markdown. 
// @version      1.0
// @author       greenek
// @copyright    2016, Paweł Golonko (http://greenek.com)
// @license      MIT; https://opensource.org/licenses/MIT
// @match        http://*/*?selectedItem=com.spartez.jira.plugins.scrum-standup-for-jira:scrum-standups-panel
// @require      https://cdnjs.cloudflare.com/ajax/libs/to-markdown/3.0.1/to-markdown.min.js
// @grant        GM_setClipboard
// @run-at       document-end
// @namespace https://greasyfork.org/users/58270
// @downloadURL https://update.greasyfork.org/scripts/21929/JIRA%3A%20Copy%20standup%20report.user.js
// @updateURL https://update.greasyfork.org/scripts/21929/JIRA%3A%20Copy%20standup%20report.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Declare copy icon
    var iconCopy = document.createElement('a');
    iconCopy.href = '#';
    iconCopy.classList.add('icon', 'icon-copy', 'scrum-standup-dialog');
    iconCopy.style.backgroundImage = 'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjxzdmcgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDQ4IDQ4IiB3aWR0aD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEyIDM0aDZsNC04di0xMmgtMTJ2MTJoNnptMTYgMGg2bDQtOHYtMTJoLTEydjEyaDZ6IiBmaWxsPSIjNzA3MDcwIi8+PHBhdGggZD0iTTAgMGg0OHY0OGgtNDh6IiBmaWxsPSJub25lIi8+PC9zdmc+)';
    iconCopy.style.backgroundPosition = '50% 50%';
    iconCopy.style.backgroundSize = '150%';

    var markdownOpts = {
        converters: [
            {
                filter: 'a',
                replacement: function(innerHTML) {
                    return '`' + innerHTML + '`';
                }
            }
        ]
    };

    // Wait while reports are loading
    function waitForReports() {
        var reports = document.getElementsByClassName('scrum-standup-item-container');

        if (reports.length) {
            populateReports(reports);
        } else {
            window.setTimeout(waitForReports, 500);
        }
    }

    // Copy report to markdown
    function copyReport(id) {
        var report = document.getElementById(id + '_standup-block');
        var item = report.getElementsByClassName('scrum-standup-item');
        var fields;
        var content = [];
        var messageFn;
        var messageOpts = {
            insert: 'prepend',
            fadeout: true
        };

        if (item.length && item[0].childElementCount) {
            fields = item[0].children;

            for (var i = 0; i < fields.length; ++i) {
                var field = fields[i];
                var status = field.classList[0].replace('field-', '');
                var body = field.getElementsByClassName('scrum-standup-item-field-value');

                if (!status.length || !body.length) {
                    continue;
                }

                content.push('*' + status.toUpperCase() + ':*\n' + toMarkdown(body[0].innerHTML, markdownOpts));
            }
        }

        if (content.length) {
            GM_setClipboard(content.join('\n\n'), 'text');   
            messageFn = 'success';
            messageOpts.body = 'Report has been copied!';
        } else {
            messageFn = 'error';
            messageOpts.body = 'Report is empty!';
        }
        
        AJS.messages[messageFn]('#' + report.id, messageOpts);
    }

    // Append icon to reports containers
    function populateReports(reports) {
        for (var i = 0; i < reports.length; ++i) {
            var report = reports[i];
            var id = report.getAttribute('standupid');
            var links = report.getElementsByClassName('action-links');
            var icon;

            if (links.constructor.name !== 'HTMLCollection') {
                continue;
            }

            icon = iconCopy.cloneNode();
            icon.id = 'copy_standup_' + id;
            icon.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                copyReport(this.id.replace('copy_standup_', ''));
            });
            links[0].prepend(icon);
        }
    }

    waitForReports();
})();