// ==UserScript==
// @name         Quick and dirty job counter
// @namespace    mobiusevalon.tibbius.com
// @version      0.3
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @include      /^https{0,1}:\/\/work\.crowdsurfwork\.com\/reports\/work_data\/worker.*$/
// @author       Mobius Evalon
// @description  Quick solution for counting the number of jobs completed in the worker history table
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13268/Quick%20and%20dirty%20job%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/13268/Quick%20and%20dirty%20job%20counter.meta.js
// ==/UserScript==
$.noConflict(true);

$(document).ready(function() {
    if(!$("#job_count").length) $("#date_filter").after(
        $('<span/>')
        .css("margin-left","10px")
        .attr("id","job_count")
        .click(function() {
            var $empty = $("td.dataTables_empty").parent();
            $(this).text("Job count: "+$(".tab-pane:visible tbody tr").not($empty).length+" (Click to refresh)");
        })
    );
    $("#job_count").click();
});