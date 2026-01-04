// ==UserScript==
// @name         GitLab Jira Issue Extractor
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  GitLab Jira Issue Exactor: You can extract jira issues in GitLab after you enable the plugin "jira-issue-tracker".
// @author       tanglei.me
// @match        *://*/*
// @require      http://code.jquery.com/jquery-latest.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/381693/GitLab%20Jira%20Issue%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/381693/GitLab%20Jira%20Issue%20Extractor.meta.js
// ==/UserScript==

// Please replace your gitlab url to @match

var hasExact = false;

String.prototype.format = function () {
  var args = arguments;
  return this.replace(/\{(\d+)\}/g, function (m, n) { return args[n]; });
};


function getTitle(issueId, url) {
    var details = GM_xmlhttpRequest({
        method:"GET",
        url:url,
        onload: function (res) {
            var text = res.responseText;
            var dom = $(text);
            var nodeId = "JIRA-ISSUE-" + issueId;

            if (dom.length < 124) {
                console.log("May be not logined in, url: " + url);
                console.log(dom);
                $("#"+nodeId).append(", Please Login in Jira");
            }
            var titleNode = dom[124];
            var titleText = "";
            if (titleNode && titleNode.nodeName == 'TITLE') {
                titleText = titleNode.innerText;
            } else { // if not the 124th one
                for (var i = 0; i < dom.length; i++) {
                    var node = dom[i];
                    if (node.nodeName == 'TITLE') {
                        titleText = node.innerText;
                        break;
                    }
                }
            }
            //console.log("issueId:" + issueId +  ", title: " + titleText);
            var title = titleText.trim();
            var end = titleText.lastIndexOf('-');
            if (end > 0) {
                title = titleText.substring(0, end).trim();
            }
            $("#"+nodeId).append(", " + title);
        }
    });
}


(function() {
    'use strict';

    var btn = '';
    var mrClass = '.merge-request-details > .detail-page-description';
    var diffClass = '.commits-compare-btn';

    var resultBtnDom = ".not.exist.class";
    if ($(mrClass).length > 0) {
        resultBtnDom = $(mrClass);
        btn = '<div style="display:block"><button id="extractBtn" class="btn btn-success" style="margin-left:0px;">Extract Issues</button></div><hr/>';
    } else if ($(diffClass).length > 0) {
        resultBtnDom = $(diffClass).parent();
        btn = '<div style="display:block"><button id="extractBtn" class="btn btn-success" style="margin-left:20px;">Extract Issues</button></div><hr/>';
    } else {
        return;
    }
    var resultDiv = '<ul id="jira-issue-extractor-result"></ul>'

    resultBtnDom.append(btn + resultDiv);

    $('#extractBtn').click(function() {
        if (hasExact === true) return;
        var issues = new Map();
        $('.commit-content > [data-external-issue]').map(function() {
            var link = $(this).attr('href');
            var issueId = this.text;
            issues.set(issueId, {'link': link, 'issue_id': issueId});
        });

        var uniqueItems = [];
        issues.forEach(function(obj) {
            getTitle(obj.issue_id, obj.link);

            uniqueItems += '<li><a href="{0}" id="JIRA-ISSUE-{1}">{0}</a></li>'.format(obj.link, obj.issue_id);
        });
        uniqueItems += "<hr/>"
        console.log("uniqueItems:" + uniqueItems);
        // $('textarea').val(uniqueItems);
        if (hasExact === false) {
            $('#jira-issue-extractor-result').append(uniqueItems);
            hasExact = true;
            $('#extractBtn').prop('disabled', true);
        }
    });


})();