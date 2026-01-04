// ==UserScript==
// @name irctc form
// @namespace form data load
// @grant none
// @include     https://www.irctc.co.in/*
// @description contect me butter knowedge
// @version 4
// @downloadURL https://update.greasyfork.org/scripts/396051/irctc%20form.user.js
// @updateURL https://update.greasyfork.org/scripts/396051/irctc%20form.meta.js
// ==/UserScript==

var all;var pass;var logi;var pd; var fi=0;
var ffill = setInterval(dologin, 1000);
function dologin() {
  if(!document.getElementById("irctc")){
    document.getElementsByClassName('textheading')[0].style.display = "none";
  var addform = document.createElement("form");
    addform.id="irctc";addform.style="border: thin solid #3333FF;text-align:center; background: rgb(0, 255, 204);outline: dotted red;font-size: 12px;";
   var list = document.getElementById("divMain");
 // document.querySelectorAll('body>app-root>app-home>div>app-header>div>div>div>nav').innerHTML ="anand kumar";
    list.insertBefore(addform, list.childNodes[0]);
addform.innerHTML ='<body><form> <fieldset id="addmain"><tr><td style="padding: 1px" valign="top"><table cellpadding="1px" cellspacing="0px" style=" margin:11px; border-radius:1px; border:1px solid #0e72bb; background-color:#f5f5f5; font-family:Arial; float:left;"> <tbody><tr><td colspan="4" align="left" style="background-color: #3665C2; color: #FFFFFF; font-family: Verdana; font-weight: bold; padding: 1px; font-size: 13px;">Plan Details</td></tr><tr><td><input type="text" id="frm" size="18" maxlength="20" placeholder="Form" disabled=""></td><td><input type="text" id="to" size="18" maxlength="20" placeholder="To" disabled=""></td></tr><tr><td><input type="text" id="dat" size="18" maxlength="10" placeholder="Date" disabled=""></td><td><input type="text" id="train" size="18" maxlength="6" placeholder="Train No"></td></tr><tr><td><select id="class"  style="color:#ff0000;width:11em;"><option value="SL">Sleeper</option><option value="3A">THIRD AC</option><option value="2A">SECOND AC</option><option value="1A">FIST AC</option><option value="2S">SECOND---Seat</option><option value="CC">Chair Car</option></select></td><td><select id="quta" style="color:#ff0000;width:11em;"><option value="TATKAL">Tatkal</option><option value="PREMIUM">Premium</option><option value="GENERAL">General</option><option value="SS">Siner--- Citizen</option></select></td></tr><tr><td colspan="2">Seat-<input style="color:#ff0000;" maxlength="4" size="5" id="tseat" placeholder="seat" type="text">Fare-<input style="color:#ff0000;" maxlength="4" size="5" id="tfare" placeholder="Fare" type="text">Auto<input type="checkbox" id="auto" value="0"><input type="button" value="Get Plan" id="rest" onclick="return false"></td></tr><tr><td colspan="2"><input type="text" id="loginid" size="10" maxlength="8" style="color:#0000ff;align:left;" placeholder="login_id"><input type="password" id="l_pass" size="10" maxlength="8" style="color:#0000ff;align:left;" placeholder="log_password"><input type="text" id="qmo" size="12" maxlength="10" style="color:#0000ff;align:left;align:left;" placeholder="Id Mobile No."></td></tr><tr><td><input type="text" id="qdob" size="18" maxlength="8" style="color:#0000ff;align:left;" placeholder="Date Of Birth"></td><td><input type="text" id="mail" size="18" maxlength="30" style="color:#0000ff;align:left;" placeholder="E-Mail Id"></td></tr><td colspan="2"><input type="button" value="" id="sf" disabled="" style="width:15em"><input type="button" value="Ad_sav" id="add" style="width:5em"></td></tbody></table></td><td style="padding: 5px" valign="top"></td></tr><tr><td style="padding: 1px" valign="top"><table cellpadding="1px" cellspacing="0px" style=" margin:11px; border-radius:1px; border:1px solid #0e72bb; background-color:#f5f5f5; font-family:Arial; float:left;"><tbody><tr><td id="psd" colspan="4" align="left" style="background-color: #3665C2; color: #FFFFFF; font-family: Verdana; font-weight: bold; padding: 1px; font-size: 13px;">Passenger Details</td></tr><tr class="highlight"><tr id="p" style="visibility: visible;"><th>Name</th><th>Age</th><th>Gender</th><th>Birth</th></tr> <tr id="p0" style="visibility: visible;"> <td><input type="text" id="pn1" maxlength="16" placeholder="Name" size="20"></td> <td><input type="text" id="ag1" placeholder="Age" size="2" maxlength="3"></td> <td><select id="gender1"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option></select></td> <td><select id="birth1"> <option value="">No Preference</option><option value="LB">LOWER</option><option value="MB">MIDDLE</option><option value="UB">UPPER</option><option value="SL">SIDE LOWER</option><option value="SU">SIDE UPPER</option><option value="WS">WINDOW SIDE</option></select></td> </tr> <tr id="p1" style="visibility: hidden;"> <td><input type="text" id="pn2" maxlength="16" placeholder="Name" size="20"></td> <td><input type="text" id="ag2" placeholder="Age" size="2" maxlength="3"></td> <td><select id="gender2"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option></select></td> <td><select id="birth2"> <option value="">No Preference</option><option value="LB">LOWER</option><option value="MB">MIDDLE</option><option value="UB">UPPER</option><option value="SL">SIDE LOWER</option><option value="SU">SIDE UPPER</option><option value="WS">WINDOW SIDE</option></select></td> </tr> <tr id="p2" style="visibility: hidden;"> <td><input type="text" id="pn3" maxlength="16" placeholder="Name" size="20"></td> <td><input type="text" id="ag3" placeholder="Age" size="2" maxlength="3"></td>    <td><select id="gender3"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option></select></td>    <td><select id="birth3"> <option value="">No Preference</option><option value="LB">LOWER</option><option value="MB">MIDDLE</option><option value="UB">UPPER</option><option value="SL">SIDE LOWER</option><option value="SU">SIDE UPPER</option><option value="WS">WINDOW SIDE</option></select></td>  </tr>   <tr id="p3" style="visibility: hidden;">    <td><input type="text" id="pn4" maxlength="16" placeholder="Name" size="20"></td>   <td><input type="text" id="ag4" placeholder="Age" size="2" maxlength="3"></td>    <td><select id="gender4"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option></select></td>    <td><select id="birth4"> <option value="">No Preference</option><option value="LB">LOWER</option><option value="MB">MIDDLE</option><option value="UB">UPPER</option><option value="SL">SIDE LOWER</option><option value="SU">SIDE UPPER</option><option value="WS">WINDOW SIDE</option></select></td>  </tr>  <tr>   <td>Pass. Quantity<select id="pcou"><option value="1">01</option><option value="2">02</option><option value="3">03</option><option value="4">04</option></select></td><td colspan="2"><input type="text" id="mobi" size="14" maxlength="10" placeholder="Mobile"></td><td><input type="button" value="New From" id="new" onclick="return false"></td></tr>   <tr><td colspan="1" ><select id="paytyp" size="1" style="width:10em" disabled="" ><option value="">Payment Gateway Type</option><option value="IRCTC eWallet">IRCTC eWallet</option><option value="IRCTC iPay (Credit Card/Debit Card/UPI)">IRCTC iPay</option><option value="Payment Gateway / Credit Card / Debit Card">Payment Gateway / Credit Card</option><option value="Netbanking">Net Banking</option><option value="Debit Card with PIN">Debit Card with PIN</option><option value="Multiple Payment Service">Multiple Payment Service</option><option value="Wallets / Cash Card">Wallets / Cash Card</option><option value="BHIM/ UPI/ USSD">BHIM/ UPI/ USSD</option></select></td><td colspan="2"><select id="bank" size="1" style="width:8em"><option value="">Select Bank</option><option value="credit_1">SBI NetBanking</option><option value="credit_36">HDFC NetBanking</option><option value="credit_21">HDFC Visa Card with OTP</option><option value="credit_57">HDFC Debit Card with PIN</option><option value="credit_3">SBI Debit Card with PIN</option><option value="credit_9">PNB Debit Card with PIN</option><option value="IRCTC eWallet">IRCTC eWallet</option><option value="credit_113">IRCTC iPAY(Credit/Debit)</option><option value="credit_78">Paytm Multi Service</option><option value="credit_98">PayU Multi Service</option><option value="credit_105">RozarPay Multi Service</option><option value="credit_116">PhonePe Multi Service</option><option value="credit_71">Paytm Wallet</option><option value="credit_93">Airtel Money</option><option value="credit_34">PNB NetBanking</option><option value="credit_50">Central Bank of India</option><option value="credit_44">ICICI Bank</option></select></td><td><input type="submit" value="Save From" id="save" onclick="return false"></td></tr></tbody></table></td><td style="padding: 5px" valign="top"></td></tr><table style=" margin:11px; border-radius:1px; border:1px solid #0e72bb; background-color:#f5f5f5; font-family:Arial; float:left;" cellspacing="0px" cellpadding="1px"><tbody><tr><td id="post" colspan="4" style="background-color: #3665C2; color: #FFFFFF; font-family: Verdana; font-weight: bold; padding: 1px; font-size: 13px;" align="left">Post ofice</td></tr><tr class="highlight"></tr><tr id="pi" style="visibility: visible;"></tr><tr><td colspan="2"><input type="text" size="14" maxlength="20" id="pos1" placeholder="Place destination"></td></tr><tr><td colspan="2"><input size="14" id="pos2" placeholder="PinCode" maxlength="6" type="Number"></td></tr><tr><td colspan="2"><input type="text" size="14" maxlength="20" id="post3" placeholder="City"></td></tr><tr><td colspan="2"><input type="text" size="14" maxlength="20" id="post4" placeholder="postoffice"></td></tr></tbody></table></fieldset></form></body><br>'; 
  }
var abst=localStorage.seat+localStorage.fare;
if(localStorage.au_bo==0 && !document.getElementById('auto').checked){document.getElementById('auto').checked = true;}
  


document.getElementById("rest").addEventListener('click', function (){
 var gfr= document.querySelector("#origin input");
  var gfr1=document.getElementById('frm');
  if (gfr.value != "" && gfr != null ){gfr1.value=gfr.value;}
  var gto= document.querySelector("#destination input");
  var gto1=document.getElementById('to');
  if (gto.value != "" && gto != null ){gto1.value=gto.value;}
  var gda= document.querySelector("p-calendar input");
  var gda1=document.getElementById('dat')
  if (gda.value != "" && gda != null ){gda1.value=gda.value;}
  fi=0;
});
document.getElementById("auto").addEventListener('click', function (){ if (document.getElementById('auto').checked == true){localStorage.au_bo=0;}if (document.getElementById('auto').checked == false){localStorage.au_bo=1;}});
document.getElementById("save").addEventListener('click', function (){
 all=document.getElementById('pn1').value +"&"+document.getElementById('ag1').value+"&"+document.getElementById('gender1').value+"&"+document.getElementById('birth1').value+"&"+
     document.getElementById('pn2').value +"&"+document.getElementById('ag2').value+"&"+document.getElementById('gender2').value+"&"+document.getElementById('birth2').value+"&"+
     document.getElementById('pn3').value +"&"+document.getElementById('ag3').value+"&"+document.getElementById('gender3').value+"&"+document.getElementById('birth3').value+"&"+
     document.getElementById('pn4').value +"&"+document.getElementById('ag4').value+"&"+document.getElementById('gender4').value+"&"+document.getElementById('birth4').value+"&"+
     document.getElementById('pcou').value +"&"+document.getElementById('mobi').value+"&"+document.getElementById('paytyp').value+"&"+document.getElementById('bank').value+"&"+
     document.getElementById('frm').value +"&"+document.getElementById('to').value +"&"+document.getElementById('dat').value +"&"+document.getElementById('train').value +"&"+
     document.getElementById('class').value+"&"+document.getElementById('quta').value+"&"+document.getElementById('tfare').value+"&"+document.getElementById('tseat').value+"&"+
     document.getElementById('loginid').value+"&"+document.getElementById('l_pass').value+"&"+document.getElementById('qmo').value+"&"+document.getElementById('qdob').value+"&"+
     document.getElementById('mail').value+"&"+document.getElementById('pos1').value+"&"+document.getElementById('pos2').value+"&"+document.getElementById('post3').value+"&"+document.getElementById('post4').value;
  localStorage.fill_Passenger=all; pd=all.split('&'); localStorage.setItem(pd[0], all); logi=pd[28]+"&"+pd[29]+"&"+pd[30]+"&"+pd[31]+"&"+pd[32]; localStorage.fill_Login=logi;
  var loid=document.getElementById('loginid').value;  localStorage.setItem(loid, logi);  var bnkr=pd[18]+"&"+pd[19];  localStorage.fill_bank=bnkr;  fi=0;
});  
var all1 = localStorage.getItem("fill_Passenger"); all=all1.split('&');
var al1 = localStorage.getItem("fill_Login"); al=al1.split('&');
var alb1 = localStorage.getItem("fill_bank"); alb=alb1.split('&');

passhd();
document.getElementById("new").addEventListener('click', function (){
      document.getElementById('pn1').value="";document.getElementById('ag1').value="";document.getElementById('gender1').value="";document.getElementById('birth1').value="  ";
     document.getElementById('pn2').value="";document.getElementById('ag2').value="";document.getElementById('gender2').value="";document.getElementById('birth2').value="  ";
     document.getElementById('pn3').value="";document.getElementById('ag3').value="";document.getElementById('gender3').value="";document.getElementById('birth3').value="  ";
     document.getElementById('pn4').value="";document.getElementById('ag4').value="";document.getElementById('gender4').value="";document.getElementById('birth4').value="  ";
     document.getElementById('pcou').value ="1";document.getElementById('mobi').value=""; document.getElementById('frm').value="";document.getElementById('to').value="";
    document.getElementById('dat').value="";document.getElementById('train').value="";document.getElementById('class').value="SL";document.getElementById('quta').value="TATKAL"; fi="1";
});

function show(){
     document.getElementById('pn1').value=all[0];document.getElementById('ag1').value=all[1];document.getElementById('gender1').value=all[2];document.getElementById('birth1').value=all[3];
     document.getElementById('pn2').value=all[4];document.getElementById('ag2').value=all[5];document.getElementById('gender2').value=all[6];document.getElementById('birth2').value=all[7];
     document.getElementById('pn3').value=all[8];document.getElementById('ag3').value=all[9];document.getElementById('gender3').value=all[10];document.getElementById('birth3').value=all[11];
     document.getElementById('pn4').value=all[12];document.getElementById('ag4').value=all[13];document.getElementById('gender4').value=all[14];document.getElementById('birth4').value=all[15];
     document.getElementById('pcou').value =all[16];document.getElementById('mobi').value=all[17];document.getElementById('paytyp').value=alb[0];document.getElementById('bank').value=alb[1];
     document.getElementById('frm').value=all[20];document.getElementById('to').value=all[21];document.getElementById('dat').value=all[22];document.getElementById('train').value=all[23];
     document.getElementById('class').value=all[24];document.getElementById('quta').value=all[25];document.getElementById('tfare').value=all[26];document.getElementById('tseat').value=all[27];
     document.getElementById('pos1').value=all[33];document.getElementById('pos2').value=all[34];document.getElementById('post3').value=all[35];document.getElementById('post4').value=all[36];
     document.getElementById('loginid').value=al[0];document.getElementById('l_pass').value=al[1];document.getElementById('qmo').value=al[2];document.getElementById('qdob').value=al[3];document.getElementById('mail').value=al[4];
     document.getElementById('sf').value=abst;     
     }
if(document.getElementById('pn1').value =="" && fi=="0"){show();}
 var gbank=document.getElementById('bank').value;
 var gpay=document.getElementById('paytyp').value;
  if(document.getElementById('paytyp').value !== "Netbanking" && (gbank =="credit_1" || gbank =="credit_22" || gbank =="credit_28" || gbank =="credit_29" || gbank =="credit_34" || gbank =="credit_35" || gbank =="credit_36" || gbank =="credit_44" || gbank =="credit_48" || gbank =="credit_50" || gbank =="credit_43" )){
   document.getElementById('paytyp').value="Netbanking";document.getElementById('save').click(); 
  }
  else
    if(document.getElementById('paytyp').value !== "Debit Card with PIN" && (gbank =="credit_3" || gbank =="credit_9" || gbank =="credit_57")){
      document.getElementById('paytyp').value="Debit Card with PIN";document.getElementById('save').click();
    }else 
      if(document.getElementById('paytyp').value !== "Multiple Payment Service" && (gbank =="credit_78" || gbank =="credit_98" || gbank =="credit_105" || gbank =="credit_116")){
      document.getElementById('paytyp').value="Multiple Payment Service";document.getElementById('save').click();
    }else
              if(document.getElementById('paytyp').value !== "BHIM/ UPI/ USSD" && (gbank =="credit_96" || gbank =="credit_97" || gbank =="credit_117") ){
      document.getElementById('paytyp').value="BHIM/ UPI/ USSD";document.getElementById('save').click();
    } else 
      if(document.getElementById('paytyp').value !== "Wallets / Cash Card" && (gbank =="credit_68" || gbank =="credit_71" || gbank =="credit_79" || gbank =="credit_93" || gbank =="credit_102")){
      document.getElementById('paytyp').value="Wallets / Cash Card";document.getElementById('save').click();
    }else
              if(document.getElementById('paytyp').value !== "IRCTC eWallet" && gbank =="IRCTC eWallet"){
      document.getElementById('paytyp').value="IRCTC eWallet";document.getElementById('save').click();
    }else
              if(document.getElementById('paytyp').value !== "Payment Gateway / Credit Card / Debit Card" && gbank =="credit_21"){
      document.getElementById('paytyp').value="Payment Gateway / Credit Card / Debit Card";document.getElementById('save').click();
    }else
              if(document.getElementById('paytyp').value !== "IRCTC iPay (Credit Card/Debit Card/UPI)" && gbank =="credit_113"){
      document.getElementById('paytyp').value="IRCTC iPay (Credit Card/Debit Card/UPI)";document.getElementById('save').click();
    }
}
function passhd(){
  var pc=document.getElementById('pcou').value;
  if(pc != i || pc == 4)
	{
		for (i=0;i<pc;i++)
		{
          var psh="p"+i
        var pdis= document.getElementById(psh);
          pdis.style.visibility = "visible";
			
			}
      
    }else{for (i=pc;i<4;i++)
		{
          var psh="p"+i
        var pdis= document.getElementById(psh);
          pdis.style.visibility = "hidden";
			
			}}
}
