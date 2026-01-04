// ==UserScript==
// @name         CrowdestorSM250
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Couple of improvements for Crowdestor SM
// @author       Juanvi
// @match        https://crowdestor.com/*/clients/secondary_market
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/412538/CrowdestorSM250.user.js
// @updateURL https://update.greasyfork.org/scripts/412538/CrowdestorSM250.meta.js
// ==/UserScript==

(function() {
    'use strict';
var hoy = new Date();
 $("#secondary-market-list").DataTable({
        "destroy": true,
        bFilter: false,
        "bLengthChange": false,
        responsive: true,
        "processing": true,
        "bProcessing": true,
        "serverSide": true,
        "pageLength": 250,
        "order": [[0, "desc"]],
        "columnDefs": [
            {
                "targets": 5,
                "className": "text-right"
            }
        ],
        "ajax": {
            url: "secondary_market/get_investments_for_secondary_market",
            type: "GET"
        },
        "language": {
            "emptyTable":     app_objects.dt_emptytable,
            "info":           app_objects.dt_showing + " _START_ " + app_objects.dt_to + " _END_ " + app_objects.dt_of + " _TOTAL_ " + app_objects.dt_entries,
            "infoEmpty":       + " 0  " + app_objects.dt_to + " 0 " + app_objects.dt_of + " 0 " + app_objects.dt_entries,
            "infoFiltered":   "(" + app_objects.dt_filtered_from + " _MAX_ " + app_objects.dt_total_entries + ")",
            "infoPostFix":    "",
            "thousands":      ",",
            "lengthMenu":     "Show _MENU_ entries",
            'loadingRecords': '&nbsp;',
            'processing': '<div class="dt-spinner"><svg class="spinner" viewBox="0 0 50 50">\n' +
                '  <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>\n' +
                '</svg></div>',
            "search":         app_objects.dt_search,
            "zeroRecords":    app_objects.dt_no_records_found,
            "paginate": {
                "first":      app_objects.dt_first,
                "last":       app_objects.dt_last,
                "next":       app_objects.dt_next,
                "previous":   app_objects.dt_previous
            },
        },
        "drawCallback": function( settings ) {
            $(".transactions--repayment").modaal({
                type: "ajax"
            });

            $('[data-tooltip]').foundation();
            $('.sticky').foundation('_calc', true);
            repinta();
        },
        "initComplete": function(settings, json) {}
    });

function repinta(){
    unsafeWindow.rows = $("#secondary-market-list > tbody > tr");
    for (var k=0; k<rows.length; k++){
        var fecha_caja=rows[k].getElementsByClassName("transactions--subinfo-more transactions--repayment has-tip")[0];
        var id=fecha_caja.href.split("/").slice(-1);
        $(rows[k].getElementsByClassName("transactions--subinfo")[0]).after("<div class='transactions--subinfo'> <a href=javascript:miupdate('"+id+"',"+k+"); class='transactions--subinfo-more has-tip'>Update</a></div>");
        rows[k].getElementsByClassName("transactions--subinfo")[2].childNodes[0].nodeValue="";
        var fecha_str=fecha_caja.innerText;
        var fecha=new Date(fecha_str.substring(0,4),fecha_str.substring(5,7)-1,fecha_str.substring(8,10),23,59,59);
        //if (hoy>fecha) rows[k].getElementsByClassName("transactions--name")[0].innerText="Retrasado";
        if (hoy>fecha) $(fecha_caja).after("<div class='bolita'/>");
    }
    $(".transactions--info")[0].style.width="384px";
    $(".bolita").css({"background":"tomato","border-radius":"50%","margin-left":"6px","margin-right":"6px","width":"12px","height":"12px","display":"inline-block"});
    $("#secondary-market-list_next").after(" Page... <input id='goto' type='text' width='60px'><a href=javascript:$('#secondary-market-list').dataTable().fnPageChange($('#goto').val()-1);> GO</a>");
    $('#goto').css({'width':'50px','display':'inline'});

}
unsafeWindow.miupdate = function (id,k){
    $.ajax({
        url: "dashboard/getDetailedMyInvestmentsAjax/" + id,
        cache: false,
        dataType: 'json',
        type: "GET",
        success: function (response) {
            const data = response;
            var updatesData;
            if (data.updates.length === 0) {
                updatesData="There are no updates at this moment.";
            }
            $.each(data.updates, function(i, item) {
                updatesData = `<div class='activity'><b>${item.date}</b><br><p>${item.text}</p></div> </div>`
            });
            $(rows[k].getElementsByClassName("transactions--info")).after(updatesData);

        },
        error: function (xhr) {
        },
    });
}
})();