// ==UserScript==
// @name         hybrid earnings
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  groups earnings in hybrid transfer page
// @author       pyro
// @match        https://www.gethybrid.io/workers/payments
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387170/hybrid%20earnings.user.js
// @updateURL https://update.greasyfork.org/scripts/387170/hybrid%20earnings.meta.js
// ==/UserScript==

(function() {
        'use strict';
        let workTable = [];
        $('tr:gt(0)').each( (k,v) =>  workTable[k] = {
            title: $(v).find("td:first").text(),
            pay: Number($(v).find("td:first").next().text().replace('$',''))
        });

        let results = [], runningCount = [];
        workTable.forEach(function(el) {
           if (!results.includes(el.title)) {
               results.push(el.title);
               runningCount[el.title] = {
                   count: 1,
                   pay: el.pay
               };
           }
           else {
               runningCount[el.title].count++;
               runningCount[el.title].pay = Math.round((runningCount[el.title].pay + el.pay) * 100) / 100;
           }
        });

        let dollas = 0;
        for (let x in runningCount) {
            dollas += runningCount[x].pay;
            runningCount[x].pay = '$' + runningCount[x].pay.toFixed(2);
        }
        dollas = '$' + (Math.round((dollas) * 100) / 100).toFixed(2);

        let myHTML = '<h5><table class="table table-striped data-table dt-responsive"><thead><tr><th>Project</th><th>Tasks Completed</th><th>Earnings</th></tr>';
        for (let x in runningCount) {
            myHTML += '<tr><td>' + x + '</td><td>' + runningCount[x].count + '</td><td>' + runningCount[x].pay + '</td></tr>';
        }
        myHTML += '<tfoot><tr><th>Total</th><th></th><th>' + dollas + '</th></tfoot></table></h5>';
        $('h2:contains("Recent tasks")').append(myHTML);
})();