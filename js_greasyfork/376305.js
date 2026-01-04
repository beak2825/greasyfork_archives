// ==UserScript==
// @version        20181230
// @name          WEXNET Edit Shipment
// @namespace     WWEFreight
// @author	      fengguan.ld@gmail.com
// @description    WWE Track and Trace
// @include        https://wexnet.wwex.com/pls/apex/f?p=*NO:*P271_FREIGHTID*P271_CALLED_FROM*P271_COMPANYID*
// @encoding       utf-8
// @grant          unsafeWindow
// grant          GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/376305/WEXNET%20Edit%20Shipment.user.js
// @updateURL https://update.greasyfork.org/scripts/376305/WEXNET%20Edit%20Shipment.meta.js
// ==/UserScript==
// 

$(window).load(function()
{ 
  //BindReminders();
var btnLogBeforeSave='<a href="javascript:void(0);" class="t20Button" id="logbeforesave" style="display: inline;color:red !important;padding: 0 60px;">Log Before Save</a>';
var txtLog='Trace Data:<input type="text" id="txtLog" value="" style="width:700px;display:none;"/>';
$(".t20RegionHeader:first").append('<span id="lblResult" style="color:red;margin-left:30px;"></span>');
$("#B4693812645036355,#B14761222143533147").hide();
$("#B4693812645036355").before(btnLogBeforeSave);
$("#B4693812645036355").parent().parent().parent().append(txtLog);
  $("#logbeforesave").click(function(){    
     $("#lblResult").text("");
    var shipment = new Object();
    shipment.P271_FREIGHTID=csr($("#P271_FREIGHTID").val());
    shipment.PRONBR=csr($("#P271_PRONBR").val());
    shipment.BOLNBR=csr($("#P271_BOLNBR2").text());
    shipment.CARRIER=csr($("#P271_CARRIER").val());
    shipment.STATE=csr($("#P271_STATE").val());
    shipment.SHIP_DATE=csr($("#P271_DUE").val());
    shipment.EST_DELIVERY_DT=csr($("#P271_EST_DELIVERY_DT").val());
    shipment.USER_FIELD4=csr($("#P271_USER_FIELD4").val());
    shipment.USER_FIELD5=csr($("#P271_USER_FIELD5").val());
    shipment.COMMENTS=csr($("#P271_COMMENTS").val());
    var jsonShipment=JSON.stringify(shipment);
        console.log("jsonShipment:"+jsonShipment);
    var tracejson=cs(jsonShipment);
    console.log("tracejson:"+tracejson);
    $.ajax({
          type: "POST",
          contentType: "application/x-www-form-urlencoded",
          url: "https://wwett.securecloudinformation.com/WexNetTracking.asmx/SingleShipment",
          data: 'data=' + tracejson,
          dataType: 'text',
          success: function(result) {
            $("#lblResult").text("Data successfully logged in T&T System.");
              console.log("log current shipment succeed: " + result);
          },
          error: function(result, status) {
            $("#lblResult").text("Failed to log data in T&T System.");
              console.log("log current shipment failed: " + status);
          }
      });
    //console.log(tracejson);
    //var jsonobj=JSON.parse(tracejson);
    //console.log("PRONBR:"+jsonobj.PRONBR);
    //console.log("USER_FIELD5:"+jsonobj.USER_FIELD5);
    $("#txtLog").val(tracejson).select();
    if($("#txtLog").val()!=""){
      $("#B4693812645036355,#B14761222143533147").show();
      //$("#logbeforesave").hide();
    }
  });
$("#btnAddReminder").click(function(){
  var reminder=$("#ddlReminderTime").val();
  var date = new Date();
  var min=date.getMinutes();
  var time=date.setMinutes(min+parseInt(reminder));
  var ReminderTime=new Date(time).Format("yyyy-MM-dd hh:mm:ss");
  var FREIGHTID=$("#P271_FREIGHTID").val();
  var PRONBR=$("#P271_PRONBR").val();
  var USER=$("#app-user").text().trim();
  $.ajax({
          type: "POST",
          contentType: "application/x-www-form-urlencoded",
          url: "https://wwett.securecloudinformation.com/WexNetTracking.asmx/AddReminder",
          data: {"id":FREIGHTID,"pro":PRONBR,"user":USER,"reminder":ReminderTime},  
          dataType: 'text',
          success: function(result) {
              //alert("success: " + result);
          },
          error: function(result, status) {
              //alert("error: " + status);
          }
      });
 }) ;
  
});
 
 function cs(str) 
 { 
   var s = ""; 
   if (str!="") {
     s = str.replace(/&/g, "^and^"); 
     s = s.replace(/\'/g, "^"); 
    
   }
   return s; 
 }
 function csr(str) 
 { 
   return str!=""?str.replace(/\"/g, ""):""; 
 }
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
                function BindReminders() {
                  var code = '<table class="t20Region t20ReportRegion" id="tbMyReminders" border="0" cellpadding="0" cellspacing="0" summary="" aria-live="polite">';
                  code += '<thead><tr><th colspan="3" class="t20RegionHeader">My Reminders</th></tr></thead>';
                  code += '<tbody>';
                  code += '<tr>';
                  code += '<td>Remind this freight after:</td>';
                  code += '<td>';
                  code += '<select id="ddlReminderTime">';
                  code += '<option value="5">5 mins</option>';
                  code += '<option value="30">30 mins</option>';
                  code += '<option value="60">1 hour</option>';
                  code += '<option value="120">2 hour</option>';
                  code += '<option value="240">4 hour</option>';
                  code += '</select>';
                  code += '</td>';
                  code += '<td class="t20ButtonHolder">';
                  code += '<a class="t20Button" id="btnAddReminder">Add</a>';
                  code += '</td>';
                  code += '</tr>';
                  code += '<tr>';
                  code += '<td class="t20RegionBody" colspan="3">';
                  code += '<div id="divReminders">';
                  code += '<table cellpadding="0" border="0" cellspacing="0" summary="" class="t20Report">';
                  code += '<tbody>';
                  code += '<tr>';
                  code += '<td>';
                  code += '<table cellpadding="0" border="0" cellspacing="0" summary="" class="t20Report t20Standard" id="tbReminderList">';
                  code += '<thead>';
                  code += '<tr>';
                  code += '<th class="t20ReportHeader">Pro#</th>';
                  code += '<th class="t20ReportHeader" align="left">Due Time</th>';
                  code += '<th class="t20ReportHeader" align="left"></th>';
                  code += '</tr>';
                  code += '</thead>';
                  code += '<tbody>';
                  var USER=$("#app-user").text().trim();
  $.ajax({
          type: "POST",
          contentType: "application/x-www-form-urlencoded",
          url: "https://wwett.securecloudinformation.com/WexNetTracking.asmx/getReminders",
          data:'data=' + USER,  
          dataType: 'text',
          success: function(result) {
                  if (result.length > 0) {
                     //$.each(result, function (i, item) {
                      // code += '<tr class="highlight-row"><td class="t20data">'+item["NAME"]+'</td><td class="t20data">'+item["DUE_TIME"]+'</td><td class="t20data"><a class="t20Button" href="javascript:void(0);" onclick="javascript:ClickReminder('+item["ID"]+','+item["FREIGHTID"]+');">View</a></td></tr>';
                     //});
                     alert(result);
                  }
          } 
      });                 
                  code += '</tbody>';
                  code += '</table><div class="t20CVS"></div>';
                  code += '</td>';
                  code += '</tr>';
                  code += '</tbody>';
                  code += '</table>';
                  code += '</div>';
                  code += '</td>';
                  code += '</tr>';
                  code += '</tbody>';
                  code += '</table>';
                 $("#R14760627102533146").before(code);
                }
  function ClickReminder(ID,FREIGHTID){
      $.ajax({
          type: "POST",
          contentType: "application/x-www-form-urlencoded",
          url: "https://wwett.securecloudinformation.com/WexNetTracking.asmx/RemoveReminder",
          data:'data=' + ID,  
          dataType: 'text',
          success: function(result) {
              var url = window.location.href; 
              window.open(url);    
          }
      });      
  }

