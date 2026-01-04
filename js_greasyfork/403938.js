// ==UserScript==
// @name         Renewal URL Generator
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  Adds a button to service autopilot to automatically generate renewal URLs
// @author       Tyler
// @match        https://my.serviceautopilot.com/ClientView.aspx?*
// @require http://code.jquery.com/jquery-latest.js
// @require https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @downloadURL https://update.greasyfork.org/scripts/403938/Renewal%20URL%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/403938/Renewal%20URL%20Generator.meta.js
// ==/UserScript==

(function() {
    var $ = window.jQuery;
    'use strict';
    $(document).arrive("#edSaveBtn", function() {
        function dateConvert(inputdate) {
            if (inputdate) {
                var dateParts = inputdate.toDateString().split(" ");
                if (dateParts[2] == "15") {
                    dateParts[2] = "Late ";
                } else {
                    dateParts[2] = "";
                }
                return dateParts[2] + dateParts[1] + " " + dateParts[3]
            } else {
                return ""
            }
        }
        function addMonths(date, months) {
            var d = date.getDate();
            date.setMonth(date.getMonth() + +months);
            if (date.getDate() != d) {
                date.setDate(0);
            }
            return date;
        }
        $("#editorOverlayDomId").append("Enter New Price: <input id='priceInput' type='text' width='5' /><br><button id='URLGeneration' type='button'>Generate Renewal URL</button><br><button id='genericGeneration' type='button'>Generate Quarterly Generic URL</button>");
        $("#priceInput").click(function(){$("#priceInput").focus()})

        $('#URLGeneration').click(function() {
            $("#edSaveBtn").remove();
            var input = $("#priceInput").val();
            var URL = [];
            var dates = [];
            var i=0
            while ($("#edDetailDate"+i).text()) {
                dates.push(new Date($("#edDetailDate"+i).text()))
                i++
            }
            dates.sort((a, b) => a - b)
            var urlString;
            var Wadd1 = encodeURIComponent($("#lblPropertyAddress").text());
            var Wcity = encodeURIComponent($("#lblPropertyCityStateZip").text().split(',')[0]);
            var Wstate = encodeURIComponent($("#lblPropertyCityStateZip").text().split(',')[1].substring(0,3));
            var Wzip = encodeURIComponent($("#lblPropertyCityStateZip").text().split(',')[1].substring(3));
            var Badd1 = encodeURIComponent($("#lblBillingAddress").text());
            var Bcity, Bstate, Bzip
            if ($("#lblBillingCityStateZip").text()) {
                Bcity = encodeURIComponent($("#lblBillingCityStateZip").text().split(',')[0]);
                Bstate = encodeURIComponent($("#lblBillingCityStateZip").text().split(',')[1].substring(0,3));
                Bzip = encodeURIComponent($("#lblBillingCityStateZip").text().split(',')[1].substring(3));
            } else {
                Bcity = encodeURIComponent($("#lblBillingAddress2").text().split(',')[0]);
                Bstate = encodeURIComponent($("#lblBillingAddress2").text().split(',')[1].substring(0,3));
                Bzip = encodeURIComponent($("#lblBillingAddress2").text().split(',')[1].substring(3));
            }
            var Pphone = encodeURIComponent($("#lblPhone1").text().slice(0, -3));
            var Pcell = encodeURIComponent($("#lblPhone2").text().slice(0, -3));
            var Phome = encodeURIComponent($("#lblPhone3").text().slice(0, -3));
            var Pother = encodeURIComponent($("#lblPhone4").text().slice(0, -3));
            var Pemail = encodeURIComponent($("#contactEmailLink").text());
            var cd1 = dateConvert(dates[0]);
            var cd2 = dateConvert(dates[1]);
            var cd3 = dateConvert(dates[2]);
            var cd4 = dateConvert(dates[3]);
            var cd5 = dateConvert(dates[4]);
            var cd6 = dateConvert(dates[5]);
            var cd7 = dateConvert(dates[6]);
            var cd8 = dateConvert(dates[7]);
            var cd9 = dateConvert(dates[8]);
            var cd10 = dateConvert(dates[9]);
            var cd11 = dateConvert(dates[10]);
            var cd12 = dateConvert(dates[11]);
            var freq = $("[id^=edDetailDate]").length-2;
            var pptcp = parseFloat((input-10)*freq).toFixed(2);
            var ppsave = parseFloat(10*freq).toFixed(2);
            var nppfpr = parseFloat(input-5).toFixed(2);
            var nppmip = parseFloat(input).toFixed(2);

            if ($("#lblCompany").text() == "AEROTECH ST. LOUIS") {
                urlString = "https://thegutterexperts.com/renewal/stl/?"
            }
            else if ($("#lblCompany").text() == "AEROTECH METRO DC") {
                urlString = "https://thegutterexperts.com/renewal/mdc/?"
            }
            else alert("error, unable to determine area")

            URL.push(
                urlString,
                "Wadd1=",Wadd1,"&",
                "Wcity=",Wcity,"&",
                "Wstate=",Wstate,"&",
                "Wzip=",Wzip,"&",
                "BAdd1=",Badd1,"&",
                "Bcity=",Bcity,"&",
                "Bstate=",Bstate,"&",
                "Bzip=",Bzip,"&",
                "Pphone=",Pphone,"&",
                "Pcell=",Pcell,"&",
                "Phome=",Phome,"&",
                "Pother=",Pother,"&",
                "Pemail=",Pemail,"&",
                "cd1=",cd1,"&",
                "cd2=",cd2,"&",
                "cd3=",cd3,"&",
                "cd4=",cd4,"&",
                "cd5=",cd5,"&",
                "cd6=",cd6,"&",
                "cd7=",cd7,"&",
                "cd8=",cd8,"&",
                "cd9=",cd9,"&",
                "cd10=",cd10,"&",
                "cd11=",cd11,"&",
                "cd12=",cd12,"&",
                "pptcp=",pptcp,"&",
                "ppsave=",ppsave,"&",
                "nppfpr=",nppfpr,"&",
                "nppmip=",nppmip,"&",
            );
            navigator.clipboard.writeText(URL.join(""))
            alert("Renewal URL Copied to Clipboard MAKE SURE YOU HAVE SELECTED CORRECT DATES!");
        });

        $('#genericGeneration').click(function() {
            var input = $("#priceInput").val();
            var Bcity, Bstate, Bzip
            if ($("#lblBillingCityStateZip").text()) {
                Bcity = encodeURIComponent($("#lblBillingCityStateZip").text().split(',')[0]);
                Bstate = encodeURIComponent($("#lblBillingCityStateZip").text().split(',')[1].substring(0,3));
                Bzip = encodeURIComponent($("#lblBillingCityStateZip").text().split(',')[1].substring(3));
            } else {
                Bcity = encodeURIComponent($("#lblBillingAddress2").text().split(',')[0]);
                Bstate = encodeURIComponent($("#lblBillingAddress2").text().split(',')[1].substring(0,3));
                Bzip = encodeURIComponent($("#lblBillingAddress2").text().split(',')[1].substring(3));
            }
            var today = new Date();
            var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0);
            var cd1 = addMonths(new Date(), 0)
            var cd2 = addMonths(new Date(), 3)
            var cd3 = addMonths(new Date(), 6)
            var cd4 = addMonths(new Date(), 9)
            var freq = 4
            var pptcp = parseFloat((input-10)*4).toFixed(2);
            var ppsave = parseFloat(10*4).toFixed(2);
            var nppfpr = parseFloat(input-5).toFixed(2);
            var nppmip = parseFloat(input).toFixed(2);
            var urlString
            //if five days from today is past the end of the month, add 1 to each month
            if (today.getDate()+5 > lastDayOfMonth.getDate()) {
                cd1 = addMonths(cd1, 1)
                cd2 = addMonths(cd2, 1)
                cd3 = addMonths(cd3, 1)
                cd4 = addMonths(cd4, 1)
            }
            if ($("#lblCompany").text() == "AEROTECH ST. LOUIS") {
                urlString = "https://thegutterexperts.com/renewal/stl/?"
            }
            else if ($("#lblCompany").text() == "AEROTECH METRO DC") {
                urlString = "https://thegutterexperts.com/renewal/mdc/?"
            }
            else alert("error, unable to determine area")
            var URL = [];
            URL.push(
                urlString,
                "Wadd1=",encodeURIComponent($("#lblPropertyAddress").text()),"&",
                "Wcity=",encodeURIComponent($("#lblPropertyCityStateZip").text().split(',')[0]),"&",
                "Wstate=",encodeURIComponent($("#lblPropertyCityStateZip").text().split(',')[1].substring(0,3)),"&",
                "Wzip=",encodeURIComponent($("#lblPropertyCityStateZip").text().split(',')[1].substring(3)),"&",
                "BAdd1=",encodeURIComponent($("#lblBillingAddress").text()),"&",
                "Bcity=",Bcity,"&",
                "Bstate=",Bstate,"&",
                "Bzip=",Bzip,"&",
                "Pphone=",encodeURIComponent($("#lblPhone1").text().slice(0, -3)),"&",
                "Pcell=",encodeURIComponent($("#lblPhone2").text().slice(0, -3)),"&",
                "Phome=",encodeURIComponent($("#lblPhone3").text().slice(0, -3)),"&",
                "Pother=",encodeURIComponent($("#lblPhone4").text().slice(0, -3)),"&",
                "Pemail=",encodeURIComponent($("#contactEmailLink").text()),"&",
                "cd1=",cd1.toLocaleString('en-US', { year: 'numeric', month: 'long'}),"&",
                "cd2=",cd2.toLocaleString('en-US', { year: 'numeric', month: 'long'}),"&",
                "cd3=",cd3.toLocaleString('en-US', { year: 'numeric', month: 'long'}),"&",
                "cd4=",cd4.toLocaleString('en-US', { year: 'numeric', month: 'long'}),"&",
                "pptcp=",pptcp,"&",
                "ppsave=",ppsave,"&",
                "nppfpr=",nppfpr,"&",
                "nppmip=",nppmip,"&",
            );
            navigator.clipboard.writeText(URL.join(""))
            alert("Renewal URL Copied to Clipboard.");
        })
        $('#MailJetInfo').click(function() {
            var i=1
            while ($('#lblCustomField'+i).text().length) {
                switch($('#lblCustomField'+i).text().trim()) {
                    case "MailJet Renewal Information":
                        var mjRI = $('#lblCustomData'+i).text();
                        break;
                    case "MailJet Renewal Date Changes":
                        var mjDC = $('#lblCustomData'+i).text();
                        break;
                    case "MailJet Renewal Prepayment Amount":
                        var mjPP = $('#lblCustomData'+i).text();
                        break;
                    case "MailJet Renewal Autocharge Amount":
                        var mjAC = $('#lblCustomData'+i).text();
                        break;
                    case "MailJet Renewal Payment Method":
                        var mjPM = $('#lblCustomData'+i).text();
                        break;
                    case "MailJet Renewal Extra Information":
                        var mjEI = $('#lblCustomData'+i).text();
                        break;
                }
                i++
            }
            $('#editorOverlayDomId').append("<div id='MJInfoDiv' style='margin-top: 10%;'></div>")
            $('#MJInfoDiv').append("<p>"+mjRI.substring(mjRI.lastIndexOf("Recommended Service Months"),mjRI.lastIndexOf("PREPAY")).replace(/undefined/g,"")+"</p>")
            $('#MJInfoDiv').append("<p>"+mjRI.substring(mjRI.lastIndexOf("PREPAY"),mjRI.lastIndexOf("AUTOCHARGE"))+"<br>"+mjRI.substring(mjRI.lastIndexOf("AUTOCHARGE"),mjRI.lastIndexOf("INVOICE"))+"<br>"+mjRI.substring(mjRI.lastIndexOf("INVOICE"),mjRI.length)+"</p>")
            $('#MJInfoDiv').append("<p>Requested Date Changes: "+mjDC+"</p>");
            $('#MJInfoDiv').append("<p>Selected Payment Method: "+mjPM.split(" ")[0]+"</p>");
            if (mjPM.split(" ")[0] == "PREPAY") {
                $('#MJInfoDiv').append("<p>Prepay Amount: "+mjPP+"</p>");
            }
            else if (mjPM.split(" ")[0]=="AUTOCHARGE")
            {
                $('#MJInfoDiv').append("<p>Autocharge Amount: "+mjAC+"</p>");
            }
            $('#MJInfoDiv').append("<p>Other Information: "+mjEI+"</p>");
        })
    });
}
)
()