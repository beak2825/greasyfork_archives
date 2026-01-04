// ==UserScript==
// @name         Zendesk Reporter Details to Clipboard
// @namespace    http://phishme.com
// @version      3.5
// @description  Formatted Copy-able Report Details for Zendesk
// @author       Matthew Thurber
// @match        https://*.managedphishme.com/reports/*
// @match        https://*.managedphishme.com/clusters/*
// @match        https://10.150.124.110/clusters/*
// @match        https://10.150.124.110/reports/*
// @grant        GM_xmlhttpRequest
// @require      https://greasyfork.org/scripts/32530-clipboard-js/code/clipboard%20js.js?version=213380
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/32531/Zendesk%20Reporter%20Details%20to%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/32531/Zendesk%20Reporter%20Details%20to%20Clipboard.meta.js
// ==/UserScript==




window.onerror = function() {
    return true;
};


String.prototype.replaceArray = function(find, replace) {
  var replaceString = this;
  var regex; 
  for (var i = 0; i < find.length; i++) {
    regex = new RegExp(find[i], "g");
    replaceString = replaceString.replace(regex, replace[i]);
  }
  return replaceString;
};



if (document.location.toString().includes("10.150.124.110")) {
    var managedtriageurl = "https://10.150.124.110/";
} else {
    var cust = document.location.toString().split("https://")[1].split(".")[0];
    var managedtriageurl = "https://" + cust + ".managedphishme.com/";
}


var reporters = "";
var urls = "";
var received;
var reported;
var details;
var loopcount = 0;
var reportcount = 0;
var find = ["Today ", "Yesterday ", "Mon ", "Tue ", "Wed ", "Thu ", "Fri ", "Sat ", "Sun "];
var replace = ["", "", "", "", "", "", "", "", "" ];

function get_data(reportId) {
    urls += managedtriageurl + "reports/" + reportId + ", ";

    urlslist = urls.substring(0, urls.length - 2);

    GM_xmlhttpRequest({
        method: "GET",
        url: managedtriageurl + "reports/" + reportId,
        headers: {
            "Accept": "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.8",
            "Connection": "keep-alive",
            'If-None-Match': 'W/"bb5c93509c193c7345bb5e2a43f74c33',
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest"
        },
        onload: function(response) {
            var responsedata = response.responseText;

            reporters += responsedata.split("Email:")[1].split('\\">')[1].split("<\\/a>")[0] + ", ";
            receivedfull = responsedata.split(">Received:")[1].split('\\">')[1].split("<\\")[0];
            reportedfull = responsedata.split(">Reported:")[1].split('\\">')[1].split("<\\")[0];
            receivedtrim = receivedfull.replaceArray(find, replace);
            reportedtrim = reportedfull.replaceArray(find, replace);
            from = responsedata.split(">From:")[1].split('<td>\\n          ')[1].split("\\n ")[0];
            subject = responsedata.split(">Subject:")[1].split('<td>')[1].split("<\\/td>")[0];
            messageid = responsedata.split(/Message-ID:[\s\n\r]/)[1].split('&lt;')[1].split("&gt;")[0];
 if (cust == "ccf01"){
        header = "&#13;&#13;" + responsedata.split('id=\\"headers\\">')[1].split('class=\\"list-group-item\\">')[1].split("<\\/pre>")[0];
         }
        else{
            header = "";
        }


            var uniquereporters = [];

            var reportersarray = reporters.split(", ");


            $.each(reportersarray, function(i, el) {
                if ($.inArray(el, uniquereporters) === -1) uniquereporters.push(el);
            });


            uniquereporterslist = uniquereporters.toString();

            uniquereporterslist = uniquereporterslist.substring(0, uniquereporterslist.length - 1);
            if (uniquereporterslist[uniquereporterslist.length - 1] == ",") {
                uniquereporterslist = uniquereporterslist.substring(0, uniquereporterslist.length - 1);
            }
            uniquereporterslist = uniquereporterslist.replace(/,(\S)/g, ", $1");;


            details = "Reported by : " + uniquereporterslist + "&#13;Received time : " + receivedtrim + "&#13;Report time : " + reportedtrim + "&#13;Threat source : " + from + "&#13;Email Subject : " + subject + "&#13;Triage URL : " + urlslist + "&#13;Message ID : " + messageid + "&#13;???? ???????-?? ???? ?????????? ? ?????? ????? ???? ??? ????????.  ?? ???? ??? ????????? ??? ?????? ???? ??? ???? ???? ?? ???? ??? ???? ?? ??????? ??????.  ??????? ????????????? ?? ??? ????? ?????????????? ?? ???????? ?? ???????? ??? ?????? ???? ???? ??????? ??? ??????? ???? ????? ???? ??????." + header;

            $("#bar").html(details);


            loopcount += 1;

            if (loopcount >= reportcount) {
                $("#bar").show();
                $("#copybutton").show();
                $("#loadingcluster").hide();
            }




        }
    });

}




(function() {



    if (document.location.toString().includes("reports")) {



        var receivedfull = $("div.summary-details table tbody tr:nth-of-type(1) td:nth-of-type(2) time").html();
        var reportedfull = $("div.summary-details table tbody tr:nth-of-type(2) td:nth-of-type(2) time").html();
        var receivedtrim = receivedfull.replaceArray(find, replace);
        var reportedtrim = reportedfull.replaceArray(find, replace);
        var to = $("div.summary-well table tbody tr:nth-of-type(1) td:nth-of-type(2)").html().split(">")[1].split("<")[0];
        var from = $("div.summary-details table tbody tr:nth-of-type(6) td:nth-of-type(2)").html().split("<div")[0].replace(/\s/g, '');
        var subject = $("div.summary-details table tbody tr:nth-of-type(5) td:nth-of-type(2)").html();
        var messageid = $(".inbox-message .list-group-item").html().split(/Message-ID:[\s\n\r]+\&lt;/)[1].split("&gt;")[0];
         if (cust == "ccf01"){
        var header = "&#13;&#13;" + $("#headers pre.list-group-item").html();
         }
        else{
            var header = "";
        }




    } else {



        $("#reports").after("<img id='loadingcluster' src='http://gis.nacse.org/wrfish/img/spinner.gif' width='80px' height='80px' style='display:none'>");

        $("#reports").after('<pre width="1px" height="1px" style="height:1px;width:1px;display:none;" id="bar" >' + "" + '</pre ><button class="copy-button" data-clipboard-action="copy" data-clipboard-target="#bar" style="display:none;" id="copybutton">Copy Cluster Ticket Details</button><button id="loadclip">Load Cluster Details</button>');

        $("#loadclip").click(function() {
            $(this).slideUp();

            $("#loadingcluster").show();
            $(".reports-table tbody tr ").each(function() {
                if ($(this).data("report-id") !== undefined) {
                    reportcount += 1;
                    get_data($(this).data("report-id"));
                }
            });
        });




    }




    var details = "Reported by : " + to + "&#13;Received time : " + receivedtrim + "&#13;Report time : " + reportedtrim + "&#13;Threat source : " + from + "&#13;Email Subject : " + subject + "&#13;Triage URL : " + document.location.toString() + "&#13;Message ID : " + messageid + "&#13;???? ???????-?? ???? ?????????? ? ?????? ????? ???? ??? ????????.  ?? ???? ??? ????????? ??? ?????? ???? ??? ???? ???? ?? ???? ??? ???? ?? ??????? ??????.  ??????? ????????????? ?? ??? ????? ?????????????? ?? ???????? ?? ???????? ??? ?????? ???? ???? ??????? ??? ??????? ???? ????? ???? ??????."+header;




    $(".col-md-5:first .summary-well").after('<pre width="1px" height="1px" style="height:1px;width:1px;" id="bar">' + details + '</pre ><button class="copy-button" data-clipboard-action="copy" data-clipboard-target="#bar" >Copy Ticket Details</button>');

    var clipboard = new Clipboard('.copy-button');


})();