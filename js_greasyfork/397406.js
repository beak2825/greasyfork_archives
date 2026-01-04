// ==UserScript==
// @name         Linkify gitlab
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Adds links to reports in gitlab pipeline views. See https://greasyfork.org/de/scripts/397406-linkify-gitlab
// @author       Simon Stratmann
// @match        https://gitlab.ppi.int/*/jobs/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397406/Linkify%20gitlab.user.js
// @updateURL https://update.greasyfork.org/scripts/397406/Linkify%20gitlab.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $(document).ready(function () {

        function addLink(text, url) {
            $("div.block:nth-child(2)").append('<a href="' + url + '" style="color:rgb(27,105,182); text-decoration: underline">'+text+'</a><br/>');
        }

        var linkAdded = false;

        var observer = new MutationObserver(function () {
            if (linkAdded) {
                observer.disconnect();
                return;
            }
            var spanWithUrl = $("span:contains('tph-reports')");
            if (spanWithUrl === null || spanWithUrl.length === 0) {
                return;
            }
            spanWithUrl = spanWithUrl[0];
            var reportMatches = spanWithUrl.textContent.match(/http:\/\/tph-reports\S*/);
            if (reportMatches == null || reportMatches.length == 0) {
                return;
            }

            var url = reportMatches[0];
            console.log(url);
            var buildBlock = $("div.block:nth-child(2)");
            $("div.block:nth-child(2)").append('<p class="build-detail-row"><span class="font-weight-bold">Report links:</span><br/>');
            linkAdded = true;
            observer.disconnect();
            addLink("Build reports", url);
            addLink("Build reports ZIP", url.replace("ppi.int", "ppi.int/zip"));
            if (url.indexOf("integration-test") > -1 || url.indexOf("qa-test") > -1) {
                addLink("Test report", url + '/html_report');
            }
            if (url.indexOf("ip-offline-acceptance-test") > -1) {
                addLink("Interface messages", url + '/test-results/ip-testtool/interfaceMessages.html');
                addLink("Offline test report", url + '/test-results/ip-testtool/testsReport.html');
                addLink("Maven log", url + '/test-results/ip-testtool/IP_OFFLINE-maven.log');
                addLink("JobServer log", url + '/container/jobserver/logs/ph-job-server.log');
            }
            if (url.indexOf("holiday-acceptance-test") > -1 || url.indexOf("cutoff-acceptance-test") > -1) {
                addLink("Server test results", url + '/test-results/server-test/htmlReports/');
                addLink("GUI test results", url + '/test-results/gui-test/htmlReports/');
                addLink("GUI logs", url + '/container/gui/logs/');
                addLink("JobServer log", url + '/container/jobserver/logs/ph-job-server.log');
            }
            if (url.indexOf("-gui-acceptance-test") > -1) {
                addLink("GUI test results", url + '/test-results/instant-gui-test/htmlReports/');
                addLink("GUI logs", url + '/container/gui/logs/');
                addLink("Maven log", url + '/container/instant-gui-test/logs/k8out.log');
                addLink("JobServer log", url + '/container/jobserver/logs/ph-job-server.log');
            }


            $("div.block:nth-child(2)").append('</p>');
        });

        observer.observe(document, {childList: true, attributes: true, subtree: true, attributeFilter: ['class']});

    });
})();