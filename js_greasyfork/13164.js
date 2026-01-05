// ==UserScript==
// @name        PASSENGER
// @namespace   ANAND KUMAR
// @description PASS FILL
// @include     https://www.irctc.co.in/eticketing/*
// @version     2.8
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13164/PASSENGER.user.js
// @updateURL https://update.greasyfork.org/scripts/13164/PASSENGER.meta.js
// ==/UserScript==   
document.getElementById("addPassengerForm:childInfoTable").innerHTML ='<html><body><table><tbody><tr></td></td><td>Auto : </td><td><select id="con" name="con" class="labeltxt" size="1" style="width:10em">	<option value="Y">Yes</option>	<option value="N">No</option>	<option value="PY">Pay</option></select></td><td>Select Bank</td><td><select id="bank" name="bank" class="labeltxt" size="1" style="width:10em">	<option value="-1">Select Bank</option><option value="1">SBI NetBanking</option><option value="3">SBI ATM</option><option value="9">PNB ATM</option><option value="34">PNB NetBanking</option><option value="36">HDFC NetBanking</option><option value="21">HDFC Visa/Master Card</option><option value="57">HDFC ATM Card</option><option value="44">ICICI Bank</option><option value="50">Central Bank of India</option><option value="48">Bank of India</option><option value="52">IDBI Bank</option></select></td><td>Banking</td><td> <select id="bt" name="bt" class="labeltxt" size="1" style="width:10em"><option value="NETBANKING">Net Banking</option> <option value="CREDIT_CARD">Payment Gateway / Credit Card</option><option value="DEBIT_CARD">Debit Card</option> </select></td></tr></tbody></table></body></html>';
function pass(){if(getCookie("B")!="") {document.getElementById("addPassengerForm:boardingStation").value=getCookie("B");} 
  
document.getElementById(ap).value=getCookie("P0");
document.getElementById("addPassengerForm:psdetail:0:psgnAge").value=getCookie("A0");
document.getElementById("addPassengerForm:psdetail:0:psgnGender").value= getCookie("S0");
document.getElementById("addPassengerForm:psdetail:0:berthChoice").value= getCookie("B0");
if(document.getElementById("addPassengerForm:mobileNo")){
document.getElementById("addPassengerForm:mobileNo").value= getCookie("M");}  

document.getElementById(ap1).value=getCookie("P1");
document.getElementById("addPassengerForm:psdetail:1:psgnAge").value=getCookie("A1");
document.getElementById("addPassengerForm:psdetail:1:psgnGender").value=getCookie("S1");
document.getElementById("addPassengerForm:psdetail:1:berthChoice").value= getCookie("B1");
                
document.getElementById(ap2).value=getCookie("P2");
document.getElementById("addPassengerForm:psdetail:2:psgnAge").value=getCookie("A2");
document.getElementById("addPassengerForm:psdetail:2:psgnGender").value=getCookie("S2");
document.getElementById("addPassengerForm:psdetail:2:berthChoice").value= getCookie("B2");

document.getElementById(ap3).value=getCookie("P3");
document.getElementById("addPassengerForm:psdetail:3:psgnAge").value=getCookie("A3");
document.getElementById("addPassengerForm:psdetail:3:psgnGender").value=getCookie("S3");
document.getElementById("addPassengerForm:psdetail:3:berthChoice").value= getCookie("B3");
if(document.getElementById("addPassengerForm:psdetail:4:psgnAge")){
document.getElementById(ap4).value=getCookie("P4");
document.getElementById("addPassengerForm:psdetail:4:psgnAge").value=getCookie("A4");
document.getElementById("addPassengerForm:psdetail:4:psgnGender").value=getCookie("S4");
document.getElementById("addPassengerForm:psdetail:4:berthChoice").value= getCookie("B4");
                
document.getElementById(ap5).value=getCookie("P5");
document.getElementById("addPassengerForm:psdetail:5:psgnAge").value=getCookie("A5");
document.getElementById("addPassengerForm:psdetail:5:psgnGender").value=getCookie("S5");
document.getElementById("addPassengerForm:psdetail:5:berthChoice").value= getCookie("B5");}
document.getElementsByName('con')[0].value=getCookie("con");
document.getElementsByName('bank')[0].value=getCookie("bank");
document.getElementsByName('bt')[0].value=getCookie("bt");
document.getElementById("bkg_captcha").style.height="80px";
                
document.getElementById('validate').addEventListener('click', function () {fset();});
if(document.getElementById("addPassengerForm:autoUpgrade")){document.getElementById("addPassengerForm:autoUpgrade").checked = true;}  
window.scrollTo(0,550);
document.getElementById('coachCondNote').innerHTML ='<input type="button"name="next"id="next"value="NEXT">'
document.getElementById('next').addEventListener('click', function () {$("#addPassengerForm\\:jpProceedBooking").click();return false});
document.getElementById('next').addEventListener('click', function () {fset();});
document.getElementById("j_captcha").focus();
if(document.getElementById("addPassengerForm:onlyConfirmBerths")){document.getElementById("addPassengerForm:onlyConfirmBerths").checked = true;}
date2 = new Date();
date1 = new Date();
 var n = date1.getTime();
 var t =n+21000;
 date1.setTime(t);
var sn = date1.getUTCSeconds();
 clock();
}
$( window ).load(function() {
var x = document.activeElement.id;
var xx=x.length;
      var xxx = x.slice(28, 40);
      ap="addPassengerForm:psdetail:0:"+xxx;
      ap1="addPassengerForm:psdetail:1:"+xxx;
      ap2="addPassengerForm:psdetail:2:"+xxx;
      ap3="addPassengerForm:psdetail:3:"+xxx;
      ap4="addPassengerForm:psdetail:4:"+xxx;
      ap5="addPassengerForm:psdetail:5:"+xxx;
      pass();});
function clock(){
           var sn =date1.getUTCSeconds();
            date = new Date();
            DateArr = new Array();
            DateArr.hours = date.getHours();
            DateArr.minutes = date.getMinutes().toString();
            DateArr.seconds = date.getSeconds().toString();
           if((DateArr.hours ==10 && DateArr.minutes =='0' && sn<35) || (DateArr.hours ==11 && DateArr.minutes =='0' && sn<35)){sn=36;}
            //document.getElementById('addPassengerForm:bookingCond').innerHTML ="Time :"+ date2.toLocaleTimeString();
            document.getElementById('bookingCondNote').innerHTML ="TIME:"+date.toLocaleTimeString()+'::'+sn+'::'+date1.getSeconds().toString()+'::'+date2.getSeconds().toString();
            document.getElementById('bookingCondNote').style='font-size: 20px; color:#ff0000;';
           var snt=DateArr.seconds
           if(sn==snt && document.getElementById("j_captcha").value!=""){$("#addPassengerForm\\:jpProceedBooking").click();return false}
            window.setTimeout(clock, 1000);
             }
  function fset(){
           setCookie("con",document.getElementById('con').value, 1);
           setCookie("bank",document.getElementById('bank').value, 1);
           setCookie("bt",document.getElementById('bt').value, 1);           
           //setCookie("B",document.getElementById('addPassengerForm:boardingStation').value, 1);
           setCookie("P0",document.getElementById(ap).value, 1);
           setCookie("A0",document.getElementsByName('addPassengerForm:psdetail:0:psgnAge')[0].value, 1);
           setCookie("S0",document.getElementsByName('addPassengerForm:psdetail:0:psgnGender')[0].value, 1);
           setCookie("B0",document.getElementsByName('addPassengerForm:psdetail:0:berthChoice')[0].value, 1);
           setCookie("P1",document.getElementById(ap1).value, 1);
           setCookie("A1",document.getElementsByName('addPassengerForm:psdetail:1:psgnAge')[0].value, 1);
           setCookie("S1",document.getElementsByName('addPassengerForm:psdetail:1:psgnGender')[0].value, 1);
           setCookie("B1",document.getElementsByName('addPassengerForm:psdetail:1:berthChoice')[0].value, 1);
           setCookie("P2",document.getElementById(ap2).value, 1);
           setCookie("A2",document.getElementsByName('addPassengerForm:psdetail:2:psgnAge')[0].value, 1);
           setCookie("S2",document.getElementsByName('addPassengerForm:psdetail:2:psgnGender')[0].value, 1);
           setCookie("B2",document.getElementsByName('addPassengerForm:psdetail:2:berthChoice')[0].value, 1);
           setCookie("P3",document.getElementById(ap3).value, 1);
           setCookie("A3",document.getElementsByName('addPassengerForm:psdetail:3:psgnAge')[0].value, 1);
           setCookie("S3",document.getElementsByName('addPassengerForm:psdetail:3:psgnGender')[0].value, 1);
           setCookie("B3",document.getElementsByName('addPassengerForm:psdetail:3:berthChoice')[0].value, 1);
           setCookie("P4",document.getElementById(ap4).value, 1);
           setCookie("A4",document.getElementsByName('addPassengerForm:psdetail:4:psgnAge')[0].value, 1);
           setCookie("S4",document.getElementsByName('addPassengerForm:psdetail:4:psgnGender')[0].value, 1);
           setCookie("B4",document.getElementsByName('addPassengerForm:psdetail:4:berthChoice')[0].value, 1);
           setCookie("P5",document.getElementById(ap5).value, 1);
           setCookie("A5",document.getElementsByName('addPassengerForm:psdetail:5:psgnAge')[0].value, 1);
           setCookie("S5",document.getElementsByName('addPassengerForm:psdetail:5:psgnGender')[0].value, 1);
           setCookie("B5",document.getElementsByName('addPassengerForm:psdetail:5:berthChoice')[0].value, 1);
           setCookie("M",document.getElementsByName('addPassengerForm:mobileNo')[0].value, 1);
           }