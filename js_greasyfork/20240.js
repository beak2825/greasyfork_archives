// ==UserScript==
// @name        out to out
// @namespace   suvidha
// @description transport
// @include     https://www.biharcommercialtax.gov.in/bweb/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20240/out%20to%20out.user.js
// @updateURL https://update.greasyfork.org/scripts/20240/out%20to%20out.meta.js
// ==/UserScript==
if(document.getElementById('strTrckOwnrName')){
var mn = prompt("मालिक का नाम","");
document.getElementById('strTrckOwnrName').value=mn;
var mp = prompt("मालिक का पता","");
document.getElementById('strTrckOwnrAddress').value=mp;
document.getElementById('strTrckOwnrSTNo').value="2354323";
document.getElementById('strTrckOwnrPanNo').value="AAAAA2222A";
document.getElementById('strTrckOwnrEmail').value="AAAA@AA.AA";
document.getElementById('strTrckOwnrPhoneNo').value="9498979973";
  var vn = prompt("गाड़ी नंबर","");
document.getElementById('strVehicleNo').value=vn;
  var ve = prompt("इंजन नंबर","");
document.getElementById('vehicleEngNo').value=ve;
  var vci = prompt("चेचिस नंबर","");
document.getElementById('vehicleChasesNo').value=vci;
  var dr = prompt("ड्राईवर का नाम","");
document.getElementById('strDrvrName').value=dr;
  var dln = prompt("ड्राईवर लाइसेंस नंबर","");
document.getElementById('strLicNo').value=dln;
   var dph = prompt("ड्राईवर फोन नंबर","");
document.getElementById('drvPhoneNo').value=dph;
   var cen = prompt("प्राप्त करने वाले का नाम","");
  document.getElementById('consigneeName').value=cen;
   var cea = prompt("प्राप्त करने वाले का पता","");
  document.getElementById('consigneeAddress').value=cea;
   var cev = prompt("प्राप्त करने वाले का वैट नंबर","");
  document.getElementById('consigneeVAT').value=cev;
   document.getElementById('consigneeCST').value="NILL";
  document.getElementById('consigneePhoneNo').value=" 9955221144";
   var pd = prompt("माल आने का स्थान ","");
  document.getElementById('strPlaceDispatch').value=pd;
  var sn = prompt("भेजने वाले का नाम","");
  document.getElementById('strName').value=sn;
   var sea = prompt("भेजने वाले का पता","");
  document.getElementById('strAddress').value=sea;
   var sev = prompt("भेजने वाले का वैट नंबर","");
  document.getElementById('strVATTIN').value=sev;
  document.getElementById('strCSTTIN').value="NILL";
  document.getElementById('strPhoneNo').value=" 9411562356";
   var dc = prompt("माल जाने का स्थान ","");
  document.getElementById('strDestination').value=dc;
}