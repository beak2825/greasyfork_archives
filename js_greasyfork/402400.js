// ==UserScript==
// @version        20240206
// @name          OdysseyLogisticsShipmentTracking
// @namespace     odysseylogistics_shipment_tracking
// @author	      tgsmonitor@163.com
// @description    odysseylogistics_shipment_tracking
// @include        https://run.odysseylogistics.com/visibility/shipment/AllShipments.jsp*
// @include        https://run.odysseylogistics.com/visibility/shipment/TrackingInfo.jsp*
// @encoding       utf-8
// @grant          unsafeWindow
// grant          GM_openInTab
// @license BPTS LLC
// @downloadURL https://update.greasyfork.org/scripts/402400/OdysseyLogisticsShipmentTracking.user.js
// @updateURL https://update.greasyfork.org/scripts/402400/OdysseyLogisticsShipmentTracking.meta.js
// ==/UserScript==
//
var lastworkdate = new Date();
var weekday=lastworkdate.getDay();
var expiresDate=new Date().getTime() + (480 * 60 * 1000); // cookie will exprird after 8 hours

        $(window).load(function () {
          $("body").css("background-color","rgb(233, 250, 255)");
          $("#logoContainer").after('<span style="float:right;height:36px;padding:4px;">Last Workday:<input style="color: red;font-size: 18px;height: 20px;" type="text" value="" id="txtLastworkday"/>&nbsp;&nbsp;<input style="height: 20px;background-color:darkgreen;color:#fff;" type="button" value="Save Last Workday" id="savelastworkday" /></span>');

           if($.cookie('lastworkday'))
              {
                  lastworkdate=new Date($.cookie('lastworkday'));
                $("#txtLastworkday").val(lastworkdate.toLocaleString())
              }
              else{
                //alert(weekday);
                  if(weekday==1){
                     lastworkdate=new Date(new Date().getTime() - (1000 * 60 * 60 * 73));
                     }
                  else{
                     lastworkdate = new Date(new Date().getTime() - (1000 * 60 * 60 * 25));
                  }
                  $.cookie("lastworkday",lastworkdate, {
                    path : '/',//cookie的作用域
                    expires : expiresDate
                  });
                $("#txtLastworkday").val(lastworkdate.toLocaleString())
              }

          if(_currentPage=="/visibility/shipment/TrackingInfo.jsp"){
            if  ($("#add_button").length>0)
            {
              var Bolnum=$.trim($("#dsRow_ShipmentDetailsDataSet_0").find("td:eq(2)>span>a.toolTipLink").text());
              if($.cookie("added")!=Bolnum){
                  $.cookie("added", Bolnum);
                  TrackManager.createTrackMsg('addCommonStatus', '/ShipmentDetailsAction.do', '');//auto open the add popup window

                var timer = setInterval(function () {
                  if ($("#trackMsgUI").length==1 && $("#trackMsgUI").is(':visible')) {
                      clearInterval(timer);
                      setTrackMsg();
                  }
                }, 1000);

              }
              else{
                execTabAction('allShipments');
              }
            }
          }
          else if(_currentPage=="/visibility/shipment/AllShipments.jsp"){
            $("#ShipmentDataSet_columns ").find("td:eq(3)").css("min-width","150px");
            $("#ShipmentDataSet_innerTable tr").find("td:gt(10)").hide();
            $("#ShipmentDataSet_innerTable tr").find("td:gt(14)").show();
            $("#ShipmentDataSet_innerTable tr").find("td:eq(18)").hide();


            $("table.OLTMultiTabTable").after('<div style="position: absolute;top: 125px;right: 50px;"><p><input type="button" value="Search Shipments" style="float:left;width:50%;height:20px;background-color:darkblue;color:#fff;" id="btnSearch" /> <input type="button" value="Highlight Matched" style="float:left;width:50%;height: 20px;background-color:darkgreen;color:#fff;" id="btnMatch" /></p><textarea rows="100" cols="30" id="txtjson" style="font-size:16px;color:black;background-color:#ccc;line-height:22px;"></textarea></div>');

            if(!$("#txtjson").val()){
                var lastJson=window.localStorage.getItem("txtjsonval");
                if(lastJson){
                   $("#txtjson").val(lastJson);
                  highlightMatched();
                }
            }
            else{
              highlightMatched();
            }
             $("#refNo").keydown(function (event) {
                        if (event.keyCode == 13) {
                            SearchShipment();
                        }
                    });
            $("#txtjson").keydown(function (event) {
                        //if (event.ctrlKey && (event.keyCode == 86)) { //CTRL+V
                            //event.returnValue = false;
                            if($("#txtjson").val()){
                              window.localStorage.setItem("txtjsonval",$("#txtjson").val());
                              highlightMatched();
                            }
                            //return false;
                        //}
                    });
          }
           $("#btnMatch").click(function(){
             if($("#txtjson").val()){
                 window.localStorage.setItem("txtjsonval",$("#txtjson").val());
                 highlightMatched();
              }
           });
          $("#btnSearch").click(function(){
             if($("#txtjson").val()){
                 window.localStorage.setItem("txtjsonval",$("#txtjson").val());
                 searchShipments();
              }
           });
          $("#savelastworkday").click(function(){
            if($("#txtLastworkday").val()){

              var dateval=new Date($("#txtLastworkday").val());
               $.cookie("lastworkday",dateval, {
                 path : '/',//cookie的作用域
                 expires : expiresDate
               });
               alert("Saved, last workday = "+$.cookie("lastworkday"));
            }
          });


        });
function returnList(){
   execTabAction('allShipments');
}

function SearchShipment(){
    var refNo=$("#refNo").val();
    //console.log("refNo="+refNo);
    $("#FilterDescriptorUserLike").val("refNo = '"+refNo+"'");
    $("#refNo").val(refNo);
    $("#value_1_hidden").next("[name=value_1]").val(refNo);
    SimpleShipmentDataSet.checkFilterActionShipmentDataSet('ShipmentDataSetFilterFormSimple', 'setSimple');
}

function setTrackMsg(){
  var Bolnum=$.trim($("#dsRow_ShipmentDetailsDataSet_0").find("td:eq(2)>span>a.toolTipLink").text());
  if($.cookie("submitted")!=Bolnum){
     $.cookie("submitted", Bolnum);
     //step 1: set Message-------------------------
              $("#code").val("ME"); //step 1
              $("#totalWeightUnit").val("lb"); //step 1: there is only one option: lb
              //step 2: set Date of Occurrence--------------


              var sYear=lastworkdate.getFullYear();
              var sMonth=lastworkdate.getMonth() + 1;
              var sDate=lastworkdate.getDate(); //always enter yersterday for odyssey
              sMonth=sMonth < 10 ? '0' + sMonth : '' + sMonth;
              sDate=sDate < 10 ? '0' + sDate : '' + sDate;
              var sFormatedDate = sMonth+"/"+sDate+"/"+sYear;

			        document.getElementById("fake_dateForm.month_month").value =sMonth;
			        document.getElementById("dateForm.month_month").value =lastworkdate.getMonth();
			        document.getElementById("dateForm.day_day").value =sDate;
			        document.getElementById("dateForm.year_year").value =sYear;
              //step 2: set Comments-------------------------
              $("textarea[name=comment]").text("Requested tracking from carrier on "+sFormatedDate+", no response. ");//step 3

              //SUBMIT
              TrackManager.submitTrackMsg(false, false, false, true);
              setTimeout("returnList()", 1000);

     }
}
function searchShipments(){
  var arrBOL = new Array();
  if($("#txtjson").val()){
			var arrLines = $("#txtjson").val().split('\n');
			for(i=0;i<arrLines.length;i++){
				var line = arrLines[i];
				var cols = line.split('\t');
				if(cols.length==2){
					var scac=cols[0];
					var bolno=cols[1];
          if (scac!="" && bolno!=""){
             arrBOL.push(bolno);
          }
				}
			}
    var refNo = arrBOL.join(',');
    $("#FilterDescriptorUserLike").val("refNo in '"+refNo+"'");
    $("#refNo").val(refNo);
    $("#value_1_hidden").next("[name=value_1]").val(refNo);
    checkFilterActionShipmentDataSet('ShipmentDataSetFilterForm', 'setSimple');
    SimpleShipmentDataSet.checkFilterActionShipmentDataSet('ShipmentDataSetFilterFormSimple', 'setSimple');
    $("#totalPackagesForm\\.value").val();
		}
}
function highlightMatched(){

  $("#ShipmentDataSet_innerTable tr.nnDatasetRow").each(function(index,tr){
    $(tr).removeClass("changedField").css({"height":"24px"});;
	  $(tr).find("td:eq(3)>span:first>a:first").each(function(ia,alink){
      $(alink).css({"font-size":"16px"});//link BOL number
	    $(alink).parent().parent().next().find("a.toolTipLink").css({"font-size":"16px","color":"#000 !important","background-color":"#ccc"}).parent().css("background-color","#000");; //link status
      if($(alink).attr("title")){
        $(alink).text($(alink).attr("title"));
      }
    });

		var lineSCAC = $.trim($(tr).find("td:eq(1)").text());
		var lineBOL = $.trim($(tr).find("td:eq(3)").text());

    var deliveryDate =new Date($(tr).find("td:eq(16)").text()).getTime();
    var thedaybefore =new Date().getTime() - (1000 * 60 * 60 * 48);

    // 比较日期大小
    if (deliveryDate < thedaybefore) {
       $(tr).find("td:eq(16) span").append('<span style="margin-left:4px;background-color:#880000;color:#FFF;font-weight:bold;">48h +</span>');
    }

		if($("#txtjson").val()){
			var arrLines = $("#txtjson").val().split('\n');
			for(i=0;i<arrLines.length;i++){
				var line = arrLines[i];
				var cols = line.split('\t');
				if(cols.length==2){
					var scac=cols[0];
					var bolno=cols[1];
          if (scac!="" && bolno!=""){
             if(lineSCAC==scac && lineBOL==bolno){
						  $(tr).addClass("changedField");
					}
          }

				}
			}
		}

});
}

