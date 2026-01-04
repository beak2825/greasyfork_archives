// ==UserScript==
// @name        traxtech Post
// @namespace   Traxtech_Tracking
// @include     https://ttsm2.traxtech.com/*
// @require     http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant       none
// @version     3.4.1
// @author      EK
// @description TraxtechTrackingV1.1
// @downloadURL https://update.greasyfork.org/scripts/426297/traxtech%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/426297/traxtech%20Post.meta.js
// ==/UserScript==
$(function(){
  var id = setInterval(function(){
    if($("input[name=invoiceNum]").length>0 && $("#btnbeforesave").length == 0){
        appendButton();
    }
  }, 1000);  
});
  function appendButton(){
    if($(".buttonalign:first").length > 0 && $("input[name=invoiceNum]").length>0){
      $(".buttonalign").hide();
      var btnPostBeforeSave='<button id="btnbeforesave" class="buttonalign" style="background-color: red; padding: 0;" type="submit">Post</button>';
      var txtNote='<input type="text" id="txtNote" value="" style="width:200px;" placeholder="Note"/>';
      var lstPRIORITY='<select id="lstPRIORITY" style="width:100px;"><option value="Normal">Normal</option><option value="Urgent">Urgent</option></select>';
      var lstSTATUS='<select id="lstSTATUS" style="width:100px;"><option value="ACCEPTED">Accept</option><option value="REJECT">Reject</option></select>';
      $(".buttonalign:first").before(btnPostBeforeSave);
      $("#btnbeforesave").before(lstSTATUS);
      $("#lstSTATUS").before(lstPRIORITY);
      $("#lstPRIORITY").before(txtNote);
      $("#txtNote").before('<span id="lblResult" style="color:red;margin-left:30px;"></span>');
  $("#btnbeforesave").click(function(){
  var file =$(".pdfTitleFont:first").text().trim().replace("FILE NAME :","");
  var inv=document.getElementsByName("invoiceNum")[0].value;
  $("#lblResult").text("");
    var shipment = new Object();
    shipment.FILE_NAME=csr(file);
    shipment.INVOICE_NUM=csr(inv); 
    shipment.NOTES=csr($("#txtNote").val());
    shipment.PRIORITY=csr($("#lstPRIORITY").val());
    shipment.STATUS=csr($("#lstSTATUS").val());
    shipment.USER_NAME= window.localStorage.getItem("loggedinusername");
    var jsonShipment=JSON.stringify(shipment);
    var tracejson=cs(jsonShipment);
      $.ajax({
          type: "POST",
          contentType: "application/x-www-form-urlencoded",
          url: "https://traxscanning.securecloudinformation.com/WexNetTracking.asmx/SingleShipment",
          data: 'data=' + tracejson,
          dataType: 'json',
          success: function(result) {
            $("#lblResult").text("Data successfully logged in System.");
              console.log("log current shipment succeed: " + result);
            $(".buttonalign").show();
          },
          error: function(result, status) {
            $("#lblResult").text("Failed to log data in System.");
              console.log("log current shipment failed: " + status);
          }
      });
      $(".mask").hide();
 }) ;
     }

  }
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