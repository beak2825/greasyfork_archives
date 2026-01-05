// ==UserScript==
// @name        IRCTC AUTO
// @namespace   ANAND KUMAR
// @include     https://www.irctc.co.in/*
// @version     4
// @description navoday2@gmail.com Login Page
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17064/IRCTC%20AUTO.user.js
// @updateURL https://update.greasyfork.org/scripts/17064/IRCTC%20AUTO.meta.js
// ==/UserScript==
if(document.URL.match('eticketing/logout') || document.URL.match('eticketing/error')){window.location.assign("https://www.irctc.co.in/eticketing/loginHome.jsf");}
   if(document.getElementById('loginbutton')){
     // document.getElementsByClassName('grid_16 g_box')[0].style="display: none";
     // document.getElementsByClassName('grid_16 g_box')[0].innerHTML='<img style="border: medium none; height: 70px;" id="cimage" src="captchaImage">';
      document.getElementsByClassName('grid_8 pull_8')[0].style="display: none";
          document.getElementsByClassName('grid_8 push_8')[0].style="display: none";
          document.getElementById('loginbutton').addEventListener('click', function(){
           setCookie("loginid",document.getElementsByClassName('loginUserId')[0].value, 30);
           setCookie("loginpass",document.getElementsByClassName('loginPassword')[0].value, 30);
            document.getElementById('cno').click();});
           document.getElementsByClassName('loginUserId')[0].value = getCookie("loginid");
           document.getElementsByClassName('loginPassword')[0].value = getCookie("loginpass");
           if(document.getElementById("cimage")){document.getElementById("cimage").style.height="70px";
           document.getElementsByName("j_captcha")[0].style="FONT:bold 25px arial; width:4em;color:#FF0000;";}
           function clock(){
            DateArr = new Array();
            date = new Date();
            rnr = date.getTime();
            DateArr['hours'] = date.getHours();
            DateArr['minutes'] = date.getMinutes().toString();
            DateArr['seconds'] = date.getSeconds().toString();
             var la=document.getElementsByName("j_captcha")[0].value; 
             var lat=la.length;
            if(la){var up = la.toUpperCase();document.getElementsByName("j_captcha")[0].value=up;}
              document.getElementsByClassName('grid_16 omega g_box')[0].style="FONT:bold 25px arial; width:13em;color:blue;";
            document.getElementsByClassName('grid_16 omega g_box')[0].innerHTML ="CurrentTime:"+date.toLocaleTimeString();
             if(lat<1){document.getElementsByName("j_captcha")[0].focus();}
            if((lat>=5 && DateArr['minutes'] !=59) || (lat>=5 && DateArr['minutes'] ==59 &&  DateArr['seconds'] ==45 )){document.getElementById('loginbutton').click(); return false;}
             window.setTimeout(clock, 10);}
             clock();
              }
 if(document.getElementById('quickbookTab:content')){
var qr=getCookie("cty");
             $(document).ready(function(){
             var qu = document.getElementsByName('quota');
              for (var i = 0; i < qu.length; i++) {
              pg=qu[i].value;
               switch (pg) {
                case qr:
                var elements = document.getElementsByName('quota');
               elements[i].click(checked = true);
             break;
              }}});
             DateArr = new Array();
            date1 = new Date();
             var n = date1.getTime();
            DateArr['hours'] = date1.getHours();
            DateArr['minutes'] = date1.getMinutes().toString();
            var con =getCookie("con");
              }
            var as = document.getElementById('bluemenu');
            as.style="border:2px solid blue;width:auto;height:auto;overflow:auto";
            as.innerHTML = '<table id="pn"><td><input type="button" name="cno" id="cno"size="5" maxlength="5"><td><input type="button"name="cfor"id="cfor"size="5" maxlength="5"><td><input type="button"name="cto"id="cto"size="5" maxlength="5"><td><input type="button"name="cdt"id="cd"size="10" maxlength="10"><td><input type="button"name="cls"id="cls"size="2" maxlength="2"><td><select class="txtfld" name="cty"><option value="GN">General</option><option value="PT">Premium</option><option value="HP">Handicap</option><option value="LD">Ladies</option><option value="CK">Tatkal</option></select><td><input type="button"name="qut3"id="qut3"value="Book"><td\>Auto<td><select class="txtfld" name="con"><option value="Y">Yes</option><option value="N">No</option><option value="PY">Pay</option></select><td><td\>Bording<td><input type="text" id="B" class="txtfld" size="4" maxlength="4" style= align:center;width:3em;color:#FF0000;" name="B"><td\>CardNo.<td><input type="text" id="VN" class="txtfld" size="16" maxlength="16" style= color:#0000ff;align:left;width:10em;" name="VN"><td/>MM<td><input type="text" id="VM" class="txtfld" size="2" maxlength="2" style= align:left;width:2em;" name="VM"><td\>YYYY<td><input type="text" id="VY" class="txtfld" size="4" maxlength="4" style=color:#0000ff; align:left;width:4em;" name="VY"><td\>CCV<td><input type="text" id="CCV" class="txtfld" size="3" maxlength="3" style=color:#0000ff; align:left;width:2em;" name="CCV"><td/>Name<td><input type="text" id="VA" class="txtfld" size="20" maxlength="20" style=color:#0000ff; align:left;width:8em;" name="VA"><tr><table id="pn0"><td> 1 </td><td><input type="text" id="Passemger0" class="txtfld" size="15" maxlength="16"name="addPassengerForm:psdetail:0:psgnName"></td><td><input type="text" class="txtfld" size="1" maxlength="3" name="addPassengerForm:psdetail:0:psgnAge"> </td>  <td>  <select class="txtfld" name="addPassengerForm:psdetail:0:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option> </select> </td> <td> 2 </td><td><input type="text" id="Passemger1" class="txtfld" size="15" maxlength="16"name="addPassengerForm:psdetail:1:psgnName"></td><td><input type="text" Class="txtfld" size="1" maxlength="3" name="addPassengerForm:psdetail:1:psgnAge"> </td>  <td>  <select class="txtfld" name="addPassengerForm:psdetail:1:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option> </select><td> 3 </td><td><input type="text" id="Passemger2" class="txtfld" size="15" maxlength="16"name="addPassengerForm:psdetail:2:psgnName"></td><td><input type="text" class="txtfld" size="1" maxlength="3" name="addPassengerForm:psdetail:2:psgnAge"> </td> <td> <select class="txtfld" name="addPassengerForm:psdetail:2:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option> </select> </td>  <td > 4 </td><td><input type="text" id="Passemger3" class="txtfld" size="15" maxlength="16"name="addPassengerForm:psdetail:3:psgnName"></td><td><input type="text" class="txtfld" size="1" maxlength="3" name="addPassengerForm:psdetail:3:psgnAge"> </td>  <td>  <select class="txtfld" name="addPassengerForm:psdetail:3:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option> </select> </td> <td >Mobile<td><input type="text" id="mobileNo" class="txtfld" style="width:6em" maxlength="10"name="addPassengerForm:mobileNo"><td><select id="bank" name="bank" class="labeltxt" size="1" style="width:8em">	<option value="21">HDFC Visa/Master Card</option><option value="1">SBI NetBanking</option><option value="3">SBI ATM</option><option value="9">PNB ATM</option><option value="34">PNB NetBanking</option><option value="36">HDFC NetBanking</option><option value="21">HDFC Visa/Master Card</option><option value="57">HDFC ATM Card</option><option value="44">ICICI Bank</option><option value="50">Central Bank of India</option><option value="48">Bank of India</option><option value="52">IDBI Bank</option></select><td> <select id="bt" name="bt" class="labeltxt" size="1" style="width:8em"> <option value="CREDIT_CARD">Payment Gateway / Credit Card</option><option value="NETBANKING">Net Banking</option><option value="DEBIT_CARD">Debit Card</option> </select></td></table>';
           document.getElementById("cno").addEventListener('click', function () {
           setCookie("M",document.getElementsByName('addPassengerForm:mobileNo')[0].value, 30);
           setCookie("B",document.getElementsByName('B')[0].value, 30);
           setCookie("P0",document.getElementsByName('addPassengerForm:psdetail:0:psgnName')[0].value, 30);
           setCookie("A0",document.getElementsByName('addPassengerForm:psdetail:0:psgnAge')[0].value, 30);
           setCookie("S0",document.getElementsByName('addPassengerForm:psdetail:0:psgnGender')[0].value, 30);
           setCookie("P1",document.getElementsByName('addPassengerForm:psdetail:1:psgnName')[0].value, 30);
           setCookie("A1",document.getElementsByName('addPassengerForm:psdetail:1:psgnAge')[0].value, 30);
           setCookie("S1",document.getElementsByName('addPassengerForm:psdetail:1:psgnGender')[0].value, 30);
           setCookie("P2",document.getElementsByName('addPassengerForm:psdetail:2:psgnName')[0].value, 30);
           setCookie("A2",document.getElementsByName('addPassengerForm:psdetail:2:psgnAge')[0].value, 30);
           setCookie("S2",document.getElementsByName('addPassengerForm:psdetail:2:psgnGender')[0].value, 30);
           setCookie("P3",document.getElementsByName('addPassengerForm:psdetail:3:psgnName')[0].value, 30);
           setCookie("A3",document.getElementsByName('addPassengerForm:psdetail:3:psgnAge')[0].value, 30);
           setCookie("S3",document.getElementsByName('addPassengerForm:psdetail:3:psgnGender')[0].value, 30);
           setCookie("bank",document.getElementById('bank').value, 30);
           setCookie("bt",document.getElementById('bt').value, 30);
              setCookie("VN",document.getElementById('VN').value, 30);
              setCookie("VM",document.getElementById('VM').value, 30);
              setCookie("VY",document.getElementById('VY').value, 30);
              setCookie("CCV",document.getElementById('CCV').value, 30);
              setCookie("VA",document.getElementById('VA').value, 30);
            setCookie("cty",document.getElementsByName('cty')[0].value,30);
            setCookie("con",document.getElementsByName('con')[0].value,30);
            setCookie("da",document.getElementsByName('cdt')[0].value,30);
            setCookie("train",document.getElementsByName('cno')[0].value,30);
            setCookie("form1",document.getElementById('jpform:fromStation').value,30);
            setCookie("to1",document.getElementById('jpform:toStation').value,30);
            setCookie("da",document.getElementById('jpform:journeyDateInputDate').value,30);});
if(getCookie("P0")) {
            document.getElementsByName('cno')[0].value =getCookie("train");
            document.getElementsByName('cfor')[0].value =getCookie("from");
            document.getElementsByName('cto')[0].value =getCookie("to");
            document.getElementsByName('cls')[0].value=getCookie("cls");
            document.getElementsByName('cty')[0].value=getCookie("cty");
            document.getElementsByName('cdt')[0].value =getCookie("da");
            document.getElementsByName('addPassengerForm:mobileNo')[0].value = getCookie("M");
            document.getElementsByName('B')[0].value = getCookie("B");
            document.getElementsByName('addPassengerForm:psdetail:0:psgnName')[0].value = getCookie("P0");
           document.getElementsByName('addPassengerForm:psdetail:0:psgnAge')[0].value = getCookie("A0");
           document.getElementsByName('addPassengerForm:psdetail:0:psgnGender')[0].value = getCookie("S0");
           document.getElementsByName('addPassengerForm:psdetail:1:psgnName')[0].value = getCookie("P1");
           document.getElementsByName('addPassengerForm:psdetail:1:psgnAge')[0].value = getCookie("A1");
           document.getElementsByName('addPassengerForm:psdetail:1:psgnGender')[0].value = getCookie("S1");
           document.getElementsByName('addPassengerForm:psdetail:2:psgnName')[0].value = getCookie("P2");
           document.getElementsByName('addPassengerForm:psdetail:2:psgnAge')[0].value = getCookie("A2");
           document.getElementsByName('addPassengerForm:psdetail:2:psgnGender')[0].value = getCookie("S2");
           document.getElementsByName('addPassengerForm:psdetail:3:psgnName')[0].value = getCookie("P3");
           document.getElementsByName('addPassengerForm:psdetail:3:psgnAge')[0].value = getCookie("A3");
           document.getElementsByName('addPassengerForm:psdetail:3:psgnGender')[0].value = getCookie("S3");
           document.getElementsByName('bank')[0].value=getCookie("bank");
             document.getElementsByName('bt')[0].value=getCookie("bt");
            document.getElementsByName('con')[0].value=getCookie("con");
            document.getElementsByName('VN')[0].value=getCookie("VN");
            document.getElementsByName('VM')[0].value=getCookie("VM");
            document.getElementsByName('VY')[0].value=getCookie("VY");
            document.getElementsByName('CCV')[0].value=getCookie("CCV");
            document.getElementsByName('VA')[0].value=getCookie("VA");
            }
            if(document.getElementById('quickbookTab:content')){
            document.getElementById('jpform:fromStation').value=getCookie("form1");
            document.getElementById('jpform:toStation').value=getCookie("to1");
            document.getElementById('jpform:journeyDateInputDate').value=getCookie("da");
            if(getCookie("cty")=="GN"){document.getElementById('jpform:flexiDateId').checked="checked";}
            document.getElementById('jpform:jpsubmit').addEventListener('click', function(){document.getElementById('cno').click();});
            var con =getCookie("con");
            if (document.getElementById('contentformid1'))//&& (con=="Y"||con=="PY") )//&& DateArr['minutes'] >= 50
            { document.getElementById('jpform:jpsubmit').click();}
            if(getCookie("cty")){var cty=getCookie("cty");}
             train=getCookie("train"); cls=getCookie("cls");da=getCookie("da");from=getCookie("from");to=getCookie("to");
            trainid ="cllink-"+train+"-"+cls;
             dq=document.querySelector('[id^=\''+trainid+'\']');
             if(dq){ dq.style="font-size: 25px; font-weight: bold; font-style: normal; font-variant: normal; color: red; text-align: center";}
             document.getElementById('oyo_hotels_add').style="display: none;";
             document.getElementById('bbc_widget').style="font-size: 20px; font-weight: bold; font-style: normal; font-variant: normal; color: blue; text-align: center";
         function book(){
            if(getCookie("cty")){var cty=getCookie("cty");
              if (document.getElementById('refid1') && document.getElementById('avlAndFareForm:quota').value !=cty) {
                  setCookie("cty",document.getElementById('avlAndFareForm:quota').value,30);document.getElementsByName('cty')[0].value=getCookie("cty");}}
             if(getCookie("from") != document.getElementById('avlAndFareForm:fromStation').value && document.getElementById('avlAndFareForm:fromStation').value !="" || getCookie("to") != document.getElementById('avlAndFareForm:toStation').value && document.getElementById('avlAndFareForm:toStation').value !="" || getCookie("train") != document.getElementById('avlAndFareForm:trainNumber').value && document.getElementById('avlAndFareForm:trainNumber').value !="" || getCookie("cls")!=document.getElementById('avlAndFareForm:journeyClass').value && document.getElementById('avlAndFareForm:journeyClass').value!="")
             { setCookie("cls",document.getElementById('avlAndFareForm:journeyClass').value, 30);
             setCookie("train",document.getElementById('avlAndFareForm:trainNumber').value, 30);
             setCookie("from",document.getElementById('avlAndFareForm:fromStation').value,30);
             setCookie("to",document.getElementById('avlAndFareForm:toStation').value,30);}
             document.getElementsByName('cls')[0].value=getCookie("cls");
             document.getElementsByName('cno')[0].value =getCookie("train");
             document.getElementsByName('cfor')[0].value =getCookie("from");
             document.getElementsByName('cto')[0].value =getCookie("to");
             document.getElementsByName('cdt')[0].value =getCookie("da");
             from=getCookie("from");to=getCookie("to");
             document.getElementById('qut3').addEventListener('click', function () {cty=getCookie("cty"); jpBook(this, train, from, to, da, cls, cty, 1,false);return false ;});
            if (document.getElementById('refid1')) {var bid = train+"-"+cls+"-"+cty+"-0";}
             if (document.getElementById('avlAndFareForm:cc').value == "false" && dq && (con=="Y"||con=="PY") && DateArr['minutes'] <= 54)
             {dq.click();} else {if(document.getElementById('c1')){if (document.getElementById(bid) && (con=="Y"||con=="PY")){ document.getElementById('qut3').click(); return false;}
            else { if ((DateArr['minutes'] <= 0) && (con=="Y"||con=="PY")){ document.getElementById('jpform:jpsubmit').click(); return false;}}}
             }}
function clock(){
            rn=n+180000;
            DateArr = new Array();
            date = new Date();
            rnr = date.getTime();
            DateArr['hours'] = date.getHours();
            DateArr['minutes'] = date.getMinutes().toString();
            DateArr['seconds'] = date.getSeconds().toString();
            document.getElementById('bbc_widget').innerHTML ="CurrentTime:"+date.toLocaleTimeString()+":---------:RunTime :"+ date1.toLocaleTimeString();
            if(rn<=rnr && DateArr['minutes'] != 59 && DateArr['minutes'] != 0 || DateArr['minutes'] == 59 && DateArr['seconds'] ==50 ){document.getElementById('jpform:jpsubmit').click(); return false;}
             book();
             window.setTimeout(clock, 1000);
             }
           clock();}
function pass(){if(getCookie("B")!=="") {document.getElementById("addPassengerForm:boardingStation").value=getCookie("B");}
dq0 = document.querySelector('input[size=\'16\'][id^=\'addPassengerForm:psdetail:0:\']');
    if (dq0) dq0.value = document.getElementById('Passemger0').value;
document.getElementById("addPassengerForm:psdetail:0:psgnAge").value=getCookie("A0");
document.getElementById("addPassengerForm:psdetail:0:psgnGender").value= getCookie("S0");
                if(getCookie("A0")){
document.getElementById("addPassengerForm:psdetail:0:berthChoice").value= "LB";}
 dq1 = document.querySelector('input[size=\'16\'][id^=\'addPassengerForm:psdetail:1:\']');
    if (dq1) dq1.value = document.getElementById('Passemger1').value;
document.getElementById("addPassengerForm:psdetail:1:psgnAge").value=getCookie("A1");
document.getElementById("addPassengerForm:psdetail:1:psgnGender").value=getCookie("S1");
                if(getCookie("A1")){
document.getElementById("addPassengerForm:psdetail:1:berthChoice").value="MB";}
dq2 = document.querySelector('input[size=\'16\'][id^=\'addPassengerForm:psdetail:2:\']');
    if (dq2) dq2.value = document.getElementById('Passemger2').value;
document.getElementById("addPassengerForm:psdetail:2:psgnAge").value=getCookie("A2");
document.getElementById("addPassengerForm:psdetail:2:psgnGender").value=getCookie("S2");
                if(getCookie("A2")){
document.getElementById("addPassengerForm:psdetail:2:berthChoice").value= "UB";}
dq3 = document.querySelector('input[size=\'16\'][id^=\'addPassengerForm:psdetail:3:\']');
    if (dq3) dq3.value = document.getElementById('Passemger3').value;
document.getElementById("addPassengerForm:psdetail:3:psgnAge").value=getCookie("A3");
document.getElementById("addPassengerForm:psdetail:3:psgnGender").value=getCookie("S3");
                if(getCookie("A3")){
document.getElementById("addPassengerForm:psdetail:3:berthChoice").value="LB";}
 document.getElementById("addPassengerForm:childInfoTable").innerHTML =""
 document.getElementById("addPassengerForm:mobileNo").value= getCookie("M");
if(document.getElementById("addPassengerForm:onlyConfirmBerths")){document.getElementById("addPassengerForm:onlyConfirmBerths").checked = true;}
document.getElementById('validate').addEventListener('click', function () {document.getElementById('cno').click();});
if(document.getElementById("addPassengerForm:autoUpgrade")){document.getElementById("addPassengerForm:autoUpgrade").checked = true;}
window.scrollTo(0,550);
document.getElementById('coachCondNote').innerHTML ='<input type="button"name="next"id="next"value="NEXT">';
document.getElementById('next').addEventListener('click', function () {$("#addPassengerForm\\:jpProceedBooking").click();return false;});
document.getElementById('next').addEventListener('click', function () {document.getElementById('cno').click();});
if(document.getElementById("bkg_captcha")){
document.getElementById("bkg_captcha").style.height="80px";
document.getElementById("j_captcha").style="FONT:bold 36px arial; width:5em;color:#FF0000;";
document.getElementById("j_captcha").focus();}
da = document.querySelector('[id^=\'r\'][src^=\'rimage\']');
    if (da) da.style.height="80px";
date2 = new Date();
clock();
}
if(document.getElementById("addPassengerForm:mobileNo")){var x=25;xi=0;pass();}
function clock(){
           var sni =date2.getUTCSeconds();
           var sn=sni+23 
            date = new Date();
            DateArr = new Array();
            DateArr.hours = date.getHours();
            DateArr.minutes = date.getMinutes().toString();
            DateArr.seconds = date.getSeconds().toString();
           if((DateArr.hours ==10 || DateArr.hours ==11) && DateArr.minutes ==0 && xi==0 && sn<35){ri=35-sn;xi=1;x=ri+25;}
            document.getElementById('addPassengerForm:bookingCond').innerHTML ="Time :"+ date.toLocaleTimeString();
            document.getElementById('bookingCondNote').innerHTML =x;
            document.getElementById('bookingCondNote').style='font-size: 30px; color:blue;';
            document.getElementById('addPassengerForm:bookingCond').style='font-size: 20px; color:red;';
            if(document.getElementById("j_captcha")){
          var a=document.getElementsByName("j_captcha")[0].value; 
           var at=a.length;
           if(a){var upa = a.toUpperCase();document.getElementsByName("j_captcha")[0].value=upa;}
          if(x==0 && at>=5){document.getElementById('cno').click();$("#addPassengerForm\\:jpProceedBooking").click();return false;}}
            if(x>=1){x-=1;}
            window.setTimeout(clock, 1000);
             }
if(document.getElementById('jpBook:jpBack')){
   bn=getCookie("bank");
 bty=getCookie("bt");
$(document).ready(function(){
  checkSearchType(bty);
var qu = document.getElementsByName(bty);
  for (var i = 0; i < qu.length; i++) {
  pg=qu[i].value;
  switch (pg) {
    case bn:
    var elements = document.getElementsByName(bty);
    elements[i].click(checked = true);
     if(bty=="CREDIT_CARD"){
   document.getElementById('CREDIT_CARD').click();
   document.getElementById('card_no_id').value=getCookie("VN");
   document.getElementById('card_expiry_mon_id').value=getCookie("VM");
   document.getElementById('card_expiry_year_id').value=getCookie("VY");
   document.getElementById('cvv_no_id').value=getCookie("CCV");
   document.getElementById('card_name_id').value=getCookie("VA");
  document.getElementById("cimage").style.height="80px";
  document.getElementsByName("j_captcha")[0].style="FONT:bold 30px arial; width:5em;color:#FF0000;";  
   document.getElementById("captcha_txt").focus();
       window.scrollTo(0,650);
   document.getElementsByClassName('paymentMsgBox')[0].style="display:none";
     payle();
     } else {var con =getCookie("con");
        if(con=="PY" || confirm("Countinus..."))document.getElementById("jpBook:makePmntModeId1").click();
     }
    break;
  }}});
 }
function payle(){
         DateArr = new Array();
            date = new Date();
            rnr = date.getTime();
            DateArr['hours'] = date.getHours();
            DateArr['minutes'] = date.getMinutes().toString();
            DateArr['seconds'] = date.getSeconds().toString();
           var pla=document.getElementsByName("j_captcha")[0].value; 
             var plat=pla.length;
           if(pla){var upa = pla.toUpperCase();document.getElementsByName("j_captcha")[0].value=upa;}
            if(plat>=5 && DateArr['minutes'] <=5 && (DateArr['hours'] ==10 || DateArr['hours'] ==11)){
             document.getElementById("jpBook:makePmntModeId1").click(); return false;}
             window.setTimeout(payle, 10);}
