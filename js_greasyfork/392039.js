// ==UserScript==
// @version        20191101
// @name          ALC Shipment Audit Page
// @namespace     ALCAudit
// @author	      tgsmonitor@163.com
// @description    ALC-Shipment-Audit-Page
// @include        http://tms.alclogistics.com/pls/apex/f?p=*::NO::P23_TENDER_ID,P23_SHIPMENT_CONTROL_NUMBER,P23_CUSTOMER_ID,P23_PAGEID,P23_ERROR:*
// @include        https://tms.alclogistics.com/apex/f?p=*NO::P23_TENDER_ID,P23_SHIPMENT_CONTROL_NUMBER,P23_CUSTOMER_ID,P23_PAGEID,P23_ERROR:*
// @encoding       utf-8
// @grant          unsafeWindow
// grant          GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/392039/ALC%20Shipment%20Audit%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/392039/ALC%20Shipment%20Audit%20Page.meta.js
// ==/UserScript==
// 

        $(window).load(function () {
           var lblResult='<label id="lblResult"></label>';
           $("#t20tablist").append(lblResult);  

           var ShipID = $("#P23_SHIPMENT_CONTROL_NUMBER").val();
            //var regVal = new RegExp('(?<=>)\S+(?=</string>)'); 
               $.ajax({
                   type: "POST",
                   contentType: "application/x-www-form-urlencoded",
                   url: "https://alclogistics.securecloudinformation.com/AuditShipment.asmx/GetData",
                   data: 'data=' + ShipID,
                    xhrFields: {  
                          'Access-Control-Allow-Origin': '*'
                      }, 
                    dataType: 'text',
                  success: function (result) {                    
                       console.log("result:"+result);
                       if (result != "" && result!=null) {                           
                           //var innerVal = result.match(regVal);                           
                           if (result != "" && result!=null) {
                               var arrVal = result.split("|");
                               if (arrVal.length == 2) {
                                   var PRO_NUM = arrVal[0];
                                   var DLV_ACTUALDATE = arrVal[1];
                                   if (PRO_NUM != "" && PRO_NUM!="-") {
                                       $("#P23_FBPRO").after("<p>" + $("#P23_FBPRO").val() + "</p>")
                                       $("#P23_FBPRO").val(PRO_NUM).css({ "background-color": "lightyellow", "font-size": "20px", "color": "red", "font-weight": "bold" });
                                       //$("#lblResult").text("Track&Trace Pro#=" + PRO_NUM);
                                   }
                                   if (DLV_ACTUALDATE != "1/1/0001" && DLV_ACTUALDATE != "-" && DLV_ACTUALDATE!="") {
                                       $("#P23_DLV_DATE").after("<p>" + $("#P23_DLV_DATE").val() + "</p>")
                                      $("#P23_DLV_DATE").val(DLV_ACTUALDATE).css({ "background-color": "lightyellow", "font-size": "20px", "color": "red", "font-weight": "bold" });
                                       //$("#lblResult").text($("#lblResult").text());
                                   }
                                      $("#lblResult").html('Track&Trace Pro#= <b style="color:red">' + PRO_NUM + '</b>; Track&Trace Delivery Date=<b style="color: red">' + DLV_ACTUALDATE + "</b>.");
                               }
                               else {
                                   alert("Failed to read data from ALC Track&Trace system, please enter Pro# and Delivery Date by manually.");
                               }
                           }                          
                       }                       
                      
                    },
                    error: function(result, status) {
                        alert("Error: Failed to read data from ALC Track&Trace system, please enter Pro# and Delivery Date by manually." +result);
                    }
               });
        });
        function cs(str) {
            var s = "";
            if (str.length == 0) return "";
            s = str.replace(/&/g, "^and^");
            s = s.replace(/\'/g, "^");
            s = s.replace(/\"/g, "^^");
            return s;
        }
        function getQueryVariable(variable) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                if (pair[0] == variable) { return pair[1]; }
            }
            return (false);
        }