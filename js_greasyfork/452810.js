// ==UserScript==
// @name         Jira tasks
// @namespace    dedeman
// @version      1.0
// @description  Contorizare task-uri testate
// @icon         https://i.dedeman.ro/dedereact/design/images/small-logo.svg
// @author       Dragos
// @match        https://icoldo.atlassian.net/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/452810/Jira%20tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/452810/Jira%20tasks.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';
    if (location.href.includes('/tickets/new')) GM_addStyle('#followers_field {width: 100%;}');
    var waitForEl = function(selector, callback) {
        if (jQuery(selector).length) {
            callback();
        } else {
            setTimeout(function() {
                waitForEl(selector, callback);
            }, 1000);
        }
    };
    setTimeout(function() {
        waitForEl('#activity-content', function() {
            console.log( "ready!" );
            var reported = $('li.is-readonly.fields-item:nth-of-type(2) > .tf-notEditable.fields-item-value > div > span').text() || '';
            var date_reported = $('li.is-readonly.fields-item:nth-of-type(1) > .tf-notEditable.fields-item-value > div > span').text().replace(/-/g,'/').split(' ')[0] || '';
            var year_reported = new Date(date_reported).getFullYear() || 0;
            var current_year = new Date().getFullYear();
            if (reported.includes('Nechita') && year_reported == current_year) make_request(current_year, "created");
            var targetNode = $('.u-cf.clear-both.pa-0')[0];
            var config = { attributes: false, childList: true, subtree: false };
            var callback = function(mutationsList, observer) {
                console.log('change');
                if ($('.js-modalTrigger.fw-6.mr-s.ml-3.fs-s:contains("Nechita")').length) make_request(current_year, "comment");
            };
            var observer = new MutationObserver(callback);
            observer.observe(targetNode, config);
        });
    }, 5000);
    function make_request(year, type) {
        var ticket = $('h1[data-testid="issue.views.issue-base.foundation.summary.heading"]').text() || 0;
        if (ticket) {
            var ticket_number = $('a[data-testid="issue.views.issue-base.foundation.breadcrumbs.current-issue.item"]').text();
            GM_xmlhttpRequest({
                method: "PATCH",
                url: `https://jira-9648c-default-rtdb.europe-west1.firebasedatabase.app/${year}/${type}/.json`,
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({
                    [ticket_number]:ticket
                }),
                onload: function(xhr) {
                    if (xhr.status != 200) alert('Status '+xhr.status+' - '+xhr.statusText);
                }
            });
        }
    }
    $(document).on('mousedown', 'button[data-testid="comment-save-button"]', function(e) {
        if (e.which === 1) {
            var year = new Date().getFullYear();
            make_request(year, 'comment');
            GM_xmlhttpRequest({
                method: "PATCH",
                url: `https://jira-9648c-default-rtdb.europe-west1.firebasedatabase.app/comment_counter/${year}/.json`,
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({"dedeman": { ".sv": {"increment": 1 }}}),
                onload: function(xhr) {
                    if (xhr.status == 200) {
                        var raspuns = JSON.parse(xhr.responseText);
                        console.log('comment number incremented: ' + raspuns.dedeman);
                    }
                }
            });
        }
    });
})();