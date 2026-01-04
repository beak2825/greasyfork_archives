// ==UserScript==
// @name         LinearB metrics comparison
// @author       Rolandas Valantinas
// @description  Add metrics WW is striving for
// @include      *app.linearb.io/performance*
// @namespace    https://greasyfork.org/users/157178
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @supportURL   https://github.com/rolandas-valantinas/gists/issues
// @version      1.6
// @downloadURL https://update.greasyfork.org/scripts/432204/LinearB%20metrics%20comparison.user.js
// @updateURL https://update.greasyfork.org/scripts/432204/LinearB%20metrics%20comparison.meta.js
// ==/UserScript==

(function () {
    var metricsButton = `<input type="button" id="add-ww-metrics" value="Add WW Metrics">`;
    var intervalButton = setInterval(addButton, 2000);
    var attempts = 0;

    function appendData(title, value) {
        $("p[data-cy='"+title+"']").append(value);
    };

    function addMetrics() {
        console.log('add addMetrics');

        appendData('coding-time-graph-value', ' / <24h');
        appendData('pickup-time-graph-value', ' / <12h');
        appendData('review-time-graph-value', ' / <4h');
        appendData('prs-opened-graph-value', ' / >2 per day');
        appendData('pr-size-graph-value', ' / <500');
        appendData('review-depth-graph-value', ' / 2-4');
        appendData('new-code-graph-value', ' / >70%');
        appendData('refactor-graph-value', ' / <25%');
        appendData('rework-graph-value', ' / <5%');

        appendData('cycle-time-graph-value', ' / <2 days');
        appendData('deploy-frequency-graph-value', ' / >1 per day');
        appendData('deploy-time-graph-value', ' / <6h');
        appendData('mttr-graph-value', ' / <4h');
    }


    function addButton() {
        console.log('add button');
        attempts++;
        var toolbar = $("div[data-cy='Dashboard-data-cy']");
        console.log(toolbar);

        if (toolbar.length > 0) {
            toolbar.append(metricsButton);
            $('#add-ww-metrics').click(addMetrics);
            attempts = 10;
            console.log('button added');
        }

        if (attempts > 5) {
            clearInterval(intervalButton);
        }
    }
})();
