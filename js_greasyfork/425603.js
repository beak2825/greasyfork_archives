// ==UserScript==
// @version        20191127
// @name          Odyssey Logistics Shipment Tracking_jessica
// @namespace     odysseylogistics_shipment_tracking_jessica
// @author	      tgsmonitor@163.com
// @description    odysseylogistics_shipment_tracking_jessica
// @include        https://run.odysseylogistics.com/visibility/shipment/AllShipments.jsp*
// @include        https://run.odysseylogistics.com/visibility/shipment/TrackingInfo.jsp*
// @encoding       utf-8
// @grant          unsafeWindow
// grant          GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/425603/Odyssey%20Logistics%20Shipment%20Tracking_jessica.user.js
// @updateURL https://update.greasyfork.org/scripts/425603/Odyssey%20Logistics%20Shipment%20Tracking_jessica.meta.js
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
                     lastworkdate=new Date(new Date().getTime() - (1000 * 60 * 60 * 72)); 
                     }
                  else{
                     lastworkdate = new Date(new Date().getTime() - (1000 * 60 * 60 * 24)); 
                  } 
                  $.cookie("lastworkday",lastworkdate, {
                    path : '/',//cookie的作用域
                    expires : expiresDate
                  });
                $("#txtLastworkday").val(lastworkdate.toLocaleString())
              }
          
          if(_currentPage=="/visibility/shipment/TrackingInfo.jsp"){            
            if($("#add_button").length>0)
            {
              var Bolnum=$.trim($("#dsRow_ShipmentDetailsDataSet_0").find("a.toolTipLink:first").text());//$.trim($("#dsRow_ShipmentDetailsDataSet_0").find("td:eq(0)>span>a.toolTipLink").text());              
              //if($.cookie("added")!=Bolnum){}
               $.cookie("added", Bolnum);  
                  TrackManager.createTrackMsg('addCommonStatus', '/ShipmentDetailsAction.do', '');//auto open the add popup window
                
                  var timer = setInterval(function () {
                  if ($("#trackMsgUI").length==1 && $("#trackMsgUI").is(':visible')) {
                      clearInterval(timer);
                      setTrackMsg();                   
                  }
                }, 1000); 
              

//else if($("#dsRow_ShipmentDetailsDataSet_0_Action").length>0 || $("input[name=shipmentID]").val()!="" || $("#docId").val()!=""){ //0427 does not work
//   var docid="";
//   if($("#docId").val()){
//      docid=$("#docId").val();
//    }
//    else if($("input[name=shipmentID]").val()){
//      docid=$("input[name=shipmentID]").val();
//    }
//    if(docid!=""){
//      invokeShipmentDetails(docid,'tracking');              
//    } 
//    else{
//      //$("#dsRow_ShipmentDetailsDataSet_0_Action").val("tracking").change();
//    }
//}
//else{                
//  //execTabAction('allShipments');
//}    
            }
          }
          else if(_currentPage=="/visibility/shipment/AllShipments.jsp"){
            $("#ShipmentDataSet_columns ").find("td:eq(3)").css("min-width","150px");
            $("#ShipmentDataSet_innerTable tr").find("td:gt(10)").hide();
            
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
   
  var Bolnum=$.trim($("#dsRow_ShipmentDetailsDataSet_0").find("a.toolTipLink:first").text());
  //if($.cookie("submitted")!=Bolnum){
     $.cookie("submitted", Bolnum);  
     //step 1: set Message-------------------------
              $("#code").val("ME"); //step 1
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
              //$("textarea[name=comment]").text("Requested tracking from carrier on "+sFormatedDate+", no response. ");//step 3
              
              //SUBMIT
              //TrackManager.submitTrackMsg(false, false, true, true); 
              //setTimeout("returnList()", 1000);
              
     //}
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
		}  
}
function highlightMatched(){
  
  $("#ShipmentDataSet_innerTable tr.nnDatasetRow").each(function(index,tr){
    $(tr).removeClass("changedField").css({"height":"24px"});
	  $(tr).removeClass("changedField").css({"height":"24px"});
	 $(tr).find("td:eq(0)>input[type=checkbox]").each(function(ia,domBolno){
	    //$(domBolno).css({"font-size":"16px","color":"#000 !important","background-color":"#CCC"}).parent().css("background-color","#CCC"); // of BOL number
     
    
      if($(domBolno).attr("addinfo")){
        var status=$(domBolno).attr("addinfo");       
        var tooltipLink = $(domBolno).parent().parent().find("td:eq(3)");//"a.toolTipLink:first"
        var curtext = $(tooltipLink).text();
        //$(domBolno).append("<b>"+status+"</b>");//text($(domBolno).attr("title"));
        $(tooltipLink).text("("+status+")"+curtext).css("width","280px");
      }
    });		
    
		var lineSCAC = $.trim($(tr).find("td:eq(2)").text());
		var lineBOL = $.trim($(tr).find("td:eq(1)").text());		
		if($("#txtjson").val()){
			var arrLines = $("#txtjson").val().split('\n');
			for(i=0;i<arrLines.length;i++){
				var line = arrLines[i];
				var cols = line.split('\t');
				if(cols.length==2){
					var scac=cols[0];
					var bolno=cols[1];			
          if (scac!="" && bolno!=""){
             console.log("lineSCAC="+lineSCAC+", lineBOL="+lineBOL);
             if(lineSCAC==scac && lineBOL==bolno){
						  $(tr).addClass("changedField");
					}	 
          }
									
				}
			}  
		}		
					
});
  
}

         