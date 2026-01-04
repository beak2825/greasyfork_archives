// ==UserScript==
// @name IRCTC DATA 19
// @namespace irctc
// @grant none
// @include     https://www.irctc.co.in/*
// @description contect me butter knowedge
// @version 5
// @downloadURL https://update.greasyfork.org/scripts/377151/IRCTC%20DATA%2019.user.js
// @updateURL https://update.greasyfork.org/scripts/377151/IRCTC%20DATA%2019.meta.js
// ==/UserScript==
var ldata=0;
var usn=0; var psw=0; var arun=0; var logn=0; var pass=0; var frm=0; var too=0; var trn=0; var dat=0; var cls=0; var qto=0; var bod=0;
var na1=0; var ag1=0; var sx1=0; var brt0=0;
var na2=0; var ag2=0; var sx2=0; var brt0=1;
var na3=0; var ag3=0; var sx3=0; var brt0=2;
var na4=0; var ag4=0; var sx4=0; var brt0=3;
var mo=0; var pt=0; var bk=0; var pn=0; var aubo;
setInterval(dologin(), 100);

function dologin() {
  if(!document.getElementById("buddha") || arun==0){
   var newItem = document.createElement("LI");
   var list = document.getElementById("divMain");
    list.insertBefore(newItem, list.childNodes[0]);
 newItem.innerHTML ='<body><form method="get" id="navo" style="border: thin solid #3333FF"><div id="add" align="center"><input type="text"style="color:#1a75ff;" maxlength="10"size="25" name="sf" id="sf"placeholder="seat+fare" align="center" ><input type="button" id="ars" value="Auto" name="ars"><input type="text"style="color:#ff0000;" maxlength="15" name="usn" id="usn"placeholder="USER NAME" ><input type="text" style="color:#ff0000;" maxlength="15" name="psw" id="psw" placeholder="PASSWORD" ><input type="text" id="em" name="em" size="30" maxlength="30"style="color:#0000ff;align:left;width:15em;"placeholder="E-Mail Id"></td><td><input type="text" id="qdob" name="qdob" size="10" maxlength="8" style= "color:#0000ff;align:left;width:8em;"placeholder="Date Of Birth"></td><td><input type="text" id="qmo" name="qmo" size="12" maxlength="10" style= "color:#0000ff;align:left;align:left; width:8em;"placeholder="Id Mobile No."><select id="ba" name="ba" size="1" style="width:8em"><option value="credit_21">HDFC Visa/Master Card</option><option value="credit_1">SBI NetBanking</option><option value="credit_3">SBI Debit Card with PIN</option><option value="credit_9">PNB Debit Card with PIN</option><option value="credit_34">PNB NetBanking</option><option value="credit_36">HDFC NetBanking</option><option value="credit_57">HDFC Debit Card with PIN</option><option value="credit_44">ICICI Bank</option><option value="credit_50">Central Bank of India</option><option value="credit_48">Bank of India</option><option value="52">IDBI Bank</option><option value="75">SBI BUDDY</option></select></td><td><select id="bt" name="bt" size="1" style="width:8em"> <option value="Payment Gateway / Credit Card / Debit Card">Payment Gateway / Credit Card</option><option value="Netbanking">Net Banking</option><option value="Debit Card with PIN">Debit Card with PIN</option><option value="Wallets / Cash Card">Wallets / Cash Card</option></select><input type="button" value="Save_Login" id="logi" name="logi"></td><br><input type="number"style="color:#ff0000;" maxlength="4" size="3" name="tfare" id="tfare"placeholder="Fare" ><input type="number"style="color:#ff0000;" maxlength="4" size="3" name="tseat" id="tseat"placeholder="seat" ><input type="text"style="color:#ff0000;" maxlength="25" name="jpf" id="jpf"placeholder="From_Station" ><input type="text" style="color:#ff0000;" maxlength="25" name="jpto" id="jpto" placeholder="To_Station" ><input type="text" name="tn" id="tn" placeholder="Train no" size="5" maxlength="5" style="color:#ff0000;"><input type="text" maxlength="10" size="10" placeholder="DD-MM-YYYY" id="d" name="d" style="color:#ff0000;"><select id="cl" name="cl" style="color:#ff0000;"><option value="SL">Sleeper</option><option value="3A">3AC</option><option value="2A">2AC</option><option value="1A">1AC</option><option value="2S">2Seating</option><option value="CC">Chair Car</option><input type="text"style="color:#ff0000;" maxlength="25"size="5" name="b" id="b"placeholder="Bording" ><select id="qt" name="qt"><option value="TATKAL">Tatkal</option><option value="PREMIUM">Premium</option><option value="GENERAL">General</option><option value="LOWER">LOWER</option><option value="LADIES">Ladies</option></select><input type="gernal" name="pn" id="pn" placeholder="P.NO." size="2" maxlength="2" style="color:#ff0000;"><input  type="text" id="p0"placeholder="1 passenger" size="15" maxlength="16"name="p0"><input type="text" id="ag0" placeholder="age"size="2" maxlength="3" name="addPassengerForm:psdetail:0:psgnAge"><select id="as0" name="addPassengerForm:psdetail:0:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option></select><select id="brt0" name="addPassengerForm:psdetail:0:berthChoice"> <option value="  ">No Preference</option><option value="LB">LOWER</option><option value="MB">MIDDLE</option><option value="UB">UPPER</option><option value="SL">SIDE LOWER</option><option value="SU">SIDE UPPER</option><option value="WS">WINDOW SIDE</option></select><input type="text" id="p1"placeholder="2 passenger" size="15" maxlength="16"name="p1"><input type="text" id="ag1" placeholder="age"size="2" maxlength="3" name="addPassengerForm:psdetail:1:psgnAge"><select id="as1" name="addPassengerForm:psdetail:1:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option></select><select id="brt1" name="addPassengerForm:psdetail:1:berthChoice"> <option value="  ">No Preference</option><option value="LB">LOWER</option><option value="MB">MIDDLE</option><option value="UB">UPPER</option><option value="SL">SIDE LOWER</option><option value="SU">SIDE UPPER</option><option value="WS">WINDOW SIDE</option></select><input type="text" id="p2" placeholder="3 passenger" size="15" maxlength="16" name="addPassengerForm:psdetail:2:psgnName"><input type="text" id="ag2" placeholder="age"size="2" maxlength="3" name="addPassengerForm:psdetail:2:psgnAge"><select id="as2" name="addPassengerForm:psdetail:2:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option></select><select id="brt2" name="addPassengerForm:psdetail:2:berthChoice"> <option value="  ">No Preference</option><option value="LB">LOWER</option><option value="MB">MIDDLE</option><option value="UB">UPPER</option><option value="SL">SIDE LOWER</option><option value="SU">SIDE UPPER</option><option value="WS">WINDOW SIDE</option></select><input type="text" id="p3" placeholder="4 passenger" size="15" maxlength="16" name="addPassengerForm:psdetail:3:psgnName"><input type="text" id="ag3" placeholder="age"size="2" maxlength="3" name="addPassengerForm:psdetail:3:psgnAge"><select id="as3" name="addPassengerForm:psdetail:3:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option></select><select id="brt3" name="addPassengerForm:psdetail:3:berthChoice"> <option value="">No Preference</option><option value="LB">LOWER</option><option value="MB">MIDDLE</option><option value="UB">UPPER</option><option value="SL">SIDE LOWER</option><option value="SU">SIDE UPPER</option><option value="WS">WINDOW SIDE</option></select><input type="text" id="mobileNo" placeholder="Mobile No"style="width:6em" maxlength="10"name="addPassengerForm:mobileNo"></td><input  type="submit" id="save"  value="Save"name="save"onclick="return false"><input type="button" value="Load_Value" id="ld" name="ld"></td><br><br></div></form></body>';
  }
  document.getElementById("ars").value="Auto"+localStorage.au_bo;
  if(aubo==1 || aubo==0){localStorage.au_bo=aubo;}
  arun=1;
}
document.getElementById("save").addEventListener('click', function (){sa_data();lo_data();});
function sa_data(){
  usn = document.getElementById('usn').value;
  psw = document.getElementById('psw').value;
  frm = document.getElementById('jpf').value;
  too = document.getElementById('jpto').value;
  trn = document.getElementById('tn').value;
  dat = document.getElementById('d').value;
  cls = document.getElementById('cl').value;
  qto = document.getElementById('qt').value;
  na1 = document.getElementById('p0').value;
  ag1 = document.getElementById('ag0').value;
  sx1 = document.getElementById('as0').value;
  brt1 = document.getElementById('brt0').value;
  na2 = document.getElementById('p1').value;
  ag2 = document.getElementById('ag1').value;
  sx2 = document.getElementById('as1').value;
  brt2 = document.getElementById('brt1').value;
  na3 = document.getElementById('p2').value;
  ag3 = document.getElementById('ag2').value;
  sx3 = document.getElementById('as2').value;
  brt3 = document.getElementById('brt2').value;
  na4 = document.getElementById('p3').value;
  ag4 = document.getElementById('ag3').value;
  sx4 = document.getElementById('as3').value;
  brt4 = document.getElementById('brt3').value;
  mo = document.getElementById('mobileNo').value;
  pt = document.getElementById('ba').value;
  bk = document.getElementById('bt').value;
  pn = document.getElementById('pn').value;
  far = document.getElementById('tfare').value;
  set = document.getElementById('tseat').value;
  
  logdata1=localStorage.getItem(usn);
  log_data = logdata1.split('~');log_data = logdata1.split('~');
    if(log_data != null){      
  document.getElementById('usn').value=log_data[0];
  psw = document.getElementById('psw').value=log_data[1];
  pt = document.getElementById('ba').value=log_data[2];
  bk = document.getElementById('bt').value=log_data[3]; 
  eml = document.getElementById('em').value=log_data[4];
  dobl = document.getElementById('qdob').value=log_data[5];
  mol = document.getElementById('qmo').value=log_data[6];
    }  
 var sav=usn+"~ ~"+frm+"~"+too+"~"+trn+"~"+dat+"~"+cls+"~"+qto+"~"+na1+"~"+ag1+"~"+sx1+"~"+brt1+"~"+na2+"~"+ag2+"~"+sx2+"~"+brt2+"~"+na3+"~"+ag3+"~"+sx3+"~"+brt3+"~"+na4+"~"+ag4+"~"+sx4+"~"+brt4+"~"+mo+"~"+far+"~"+set+"~"+pn+"~ ~ ~";//2
  localStorage.pdata=sav;
  localStorage.setItem(na1, sav);
  ldata=sav; 
  l_data = ldata.split('~');
  var logdata=usn+"~"+psw+"~"+pt+"~"+bk+"~"+eml+"~"+dobl+"~"+mol;
  localStorage.user=logdata; 
  localStorage.setItem(usn, logdata); 
  logdata1=logdata;//1
  log_data = logdata1.split('~');
}
document.getElementById("logi").addEventListener('click', function (){
  usn = document.getElementById('usn').value;
  psw = document.getElementById('psw').value;
  pt = document.getElementById('ba').value;
  bk = document.getElementById('bt').value; 
  eml = document.getElementById('em').value;
  dobl = document.getElementById('qdob').value;
  mol = document.getElementById('qmo').value;
  var logdata=usn+"~"+psw+"~"+pt+"~"+bk+"~"+eml+"~"+dobl+"~"+mol;
  localStorage.user=logdata; 
  localStorage.setItem(usn, logdata);});

document.getElementById("ld").addEventListener('click', function (){usn =document.getElementById('usn').value;logdata1=localStorage.getItem(usn);log_data = logdata1.split('~');
  na1 = document.getElementById('p0').value;ldata=localStorage.getItem(na1);l_data = ldata.split('~');lo_data();sa_data();});
document.getElementById("ars").addEventListener('click', function (){if(aubo!=0){aubo=0;localStorage.au_bo=aubo;document.getElementById("ars").value="Auto"+aubo;return false;};if(aubo!=1){aubo=1;localStorage.au_bo=aubo;document.getElementById("ars").value="Auto"+aubo;return false;};});
   ldata=localStorage.pdata;
    l_data = ldata.split('~');
logdata1=localStorage.user;
log_data = logdata1.split('~');
  function lo_data(){
    document.getElementById('jpf').value=l_data[2];
  document.getElementById('jpto').value=l_data[3];
  document.getElementById('tn').value=l_data[4];
  document.getElementById('d').value=l_data[5];
  document.getElementById('cl').value=l_data[6];
  document.getElementById('qt').value=l_data[7];
  document.getElementById('p0').value=l_data[8];
  document.getElementById('ag0').value=l_data[9];
  document.getElementById('as0').value=l_data[10];
  document.getElementById('brt0').value=l_data[11];
  document.getElementById('p1').value=l_data[12];
  document.getElementById('ag1').value=l_data[13];
  document.getElementById('as1').value=l_data[14];
  document.getElementById('brt1').value=l_data[15];
  document.getElementById('p2').value=l_data[16];
  document.getElementById('ag2').value=l_data[17];
  document.getElementById('as2').value=l_data[18];
  document.getElementById('brt2').value=l_data[19];
  document.getElementById('p3').value=l_data[20];
  document.getElementById('ag3').value=l_data[21];
  document.getElementById('as3').value=l_data[22];
  document.getElementById('brt3').value=l_data[23];
  document.getElementById('mobileNo').value=l_data[24];
  document.getElementById('tfare').value=l_data[25];
  document.getElementById('tseat').value=l_data[26];
  document.getElementById('pn').value=l_data[27];
  document.getElementById('usn').value=log_data[0];
  document.getElementById('psw').value=log_data[1];
  document.getElementById('ba').value=log_data[2];
  document.getElementById('bt').value=log_data[3]; 
  document.getElementById('em').value=log_data[4];
  document.getElementById('qdob').value=log_data[5];
  document.getElementById('qmo').value=log_data[6];
  document.getElementById('sf').value=localStorage.seat+localStorage.fare;
					};
lo_data();