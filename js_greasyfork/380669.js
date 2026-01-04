// ==UserScript==
        // @version        20190321
        // @name           WEXNET All Shipments
        // @namespace     WEXNET_ALL_SHIPMENTS
        // @author	      fengguan.ld@gmail.com
        // @description    WEXNET All Shipments(total guranteed shipments)
        // @include       https://wexnet.wwex.com/pls/apex/f?p=104:342:*
        // @encoding       utf-8
        // @grant          unsafeWindow
        // @icon https://wexnet.wwex.com/i/wexnet/w2k15/favicon.ico
        // grant          GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/380669/WEXNET%20All%20Shipments.user.js
// @updateURL https://update.greasyfork.org/scripts/380669/WEXNET%20All%20Shipments.meta.js
        // ==/UserScript==
        //
        $(window).load(function () {
            var ShipmentArray = new Array();
            var timer0 = setInterval(function () {
                if (!document.getElementById("txtData")) {
                    PostShipments($("#apexir_SAVED_REPORTS").val());
                    console.log("Already posted all the listed shipments by timer.")
                }
                else {
                    console.log("Data being monitored, no need to sync to TT.")
                }
            }, 2000);

            PostShipments($("#apexir_SAVED_REPORTS").val());
        });
        function RunAfterLoaded() {
            var timer = setInterval(function () {
                if (!$("#apexir_LOADER").is(':visible')) {
                    clearInterval(timer);
                    PostShipments($("#apexir_SAVED_REPORTS").val());
                }
            }, 1000);
        }

        function cs(str) {
            var s = "";
            if (str == "" || str == null) {
                return "";
            }

            s = str.replace(/&/g, "^and^");
            s = s.replace(/\'/g, "^");
            s = s.replace(/\"/g, "^^");
            return s;
        }
        function PostShipments(val) {
            //4. TOTAL GUARANTEED SHIPMENTS=28470463502193900614
            //5. TOTAL GUARANTEED SHIPMENTS- DET = 36785398606136366791
            ////2. 2. DAILY TRACKING REPORTS = 30157937704933417084
            if (val == "28470463502193900614" || val == "36785398606136366791" || "30157937704933417084") {

                var txtData = '<span style="display:none;">Shipments Data:<input type="text" id="txtData" value="" style="width:700px;"/><span>';
                if (!document.getElementById("txtData")) {
                    $("#apexir_DATA_PANEL").prepend(txtData);
                }

                var regCombinedID = /(?<=_COMPANYID:)\d+,\d+,\d+/;
                var ShipmentList = new Array();
                $("#5660121065705389 tr.even,#5660121065705389 tr.odd").each(function (i, xtr) {
                    var editlink = $(xtr).find('td[headers="FREIGHTID"] a:first').attr("href");
                    var combinedID = editlink.match(regCombinedID)[0];
                    var IDs = combinedID.split(",");
                    var P271_FREIGHTID = IDs[0];
                    var P271_CALLED_FROM = IDs[1];
                    var P271_COMPANYID = IDs[2];

                    var shipment = new Object();
                    shipment.P271_FREIGHTID = P271_FREIGHTID;
                    shipment.P271_CALLED_FROM = P271_CALLED_FROM;
                    shipment.P271_COMPANYID = P271_COMPANYID;

                    shipment.STATE = cs($(xtr).find('td[headers="PRONBR"]').text());
                    shipment.COMPANY = cs($(xtr).find('td[headers="COMPANYNAME"] a:first').text());
                    shipment.CARRIER = cs($(xtr).find('td[headers="CARRIER"]').text());

                    shipment.PRO_NUM = cs($(xtr).find('td[headers="PRONBR"]').text());
                    shipment.BOL_NUM = cs($(xtr).find('td[headers="BOLNBR"]').text());
                    shipment.CONSIGNEE = cs($(xtr).find('td[headers="CONSIGNEE"]').text());
                    shipment.RECIEVER_ADDRESS =cs($(xtr).find('td[headers="To Address"]').text());
                    shipment.SHIP_DATE = cs($(xtr).find('td[headers="Ship Date"]').text());
                    shipment.ESTIMATED_DELIVERY = cs($(xtr).find('td[headers="EST_DELIVERY_DT"]').text());
                    shipment.TERMINAL_INFO = cs($(xtr).find('td[headers="TERMINALINFO"] a:first').attr("id"));
                    //shipment.MARKET_NAME = cs($(xtr).find("td:eq(11)").text());
                    shipment.MODIFIED = cs($(xtr).find('td[headers="MODIFIED"]').text());
                    shipment.USER_FIELD5 =  cs($(xtr).find('td[headers="USER_FIELD5"]').text());
                    shipment.USER_FIELD4 =  cs($(xtr).find('td[headers="USER_FIELD4"]').text());
                    shipment.TYPE = cs($("#apexir_SAVED_REPORTS option:selected").text());
                    shipment.USER_FIELD5_STAMP =  cs($(xtr).find('td[headers="USER_FIELD5_STAMP"]').text());
                    shipment.USER_FIELD1 =  cs($(xtr).find('td[headers="USER_FIELD1"]').text());
   shipment.USER_FIELD2 =  cs($(xtr).find('td[headers="USER_FIELD2"]').text());
   shipment.USER_FIELD3 =  cs($(xtr).find('td[headers="USER_FIELD3"]').text());
                    shipment.UF4_HAS_EXC =  cs($(xtr).find('td[headers="UF4_HAS_EXC"]').text());
                    ShipmentList.push(shipment);
                });

                var shipments_json = JSON.stringify(ShipmentList);
                $("#txtData").val(shipments_json).select();
                if (shipments_json) {
                    $.ajax({
                        type: "POST",
                        contentType: "application/x-www-form-urlencoded",
                        //url: "https://www.telamon.cn/WWETrackTrace/WexNetTracking.asmx/AllShipments",
                        url: "https://wwett.securecloudinformation.com/WexNetTracking.asmx/AllShipments",
                        data: 'data=' + shipments_json,
                        dataType: 'text',
                        success: function (result) {
                            console.log("Shipments post result: " + result);
                        },
                        error: function (result, status) {
                            console.log("POST result: " + result +"; Status:"+status); 
                        }
                    });
                }

            }
        }