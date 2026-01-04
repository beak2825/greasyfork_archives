// ==UserScript==
// @name        irctc new
// @namespace   buddhacsc
// @include     https://www.irctc.co.in/*
// @version     14
// @description autoirctc 
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/34833/irctc%20new.user.js
// @updateURL https://update.greasyfork.org/scripts/34833/irctc%20new.meta.js
// ==/UserScript==
var x = document.querySelectorAll(".adds");
    var i;
    for (i = 0; i < x.length; i++) {
        x[i].style.visibility = "hidden"; 
    }
if(document.URL.match('eticketing/logout') || document.URL.match('eticketing/error') || document.URL.match('eticketing/limit')){window.location.assign("https://www.irctc.co.in/eticketing/loginHome.jsf");}
   var as = document.getElementById('bluemenu');
            as.style="border:2px solid blue;width:100;height:auto;overflow:auto";
            as.innerHTML = '<body><form method="get" id="buddha" style="border: thin solid #3333FF"><div id="add" align="center"><input type="text"style="color:#ff0000;" maxlength="25" name="jpf" id="jpf"placeholder="From_Station" disabled><input type="text" style="color:#ff0000;" maxlength="25" name="jpto" id="jpto" placeholder="To_Station" disabled><input type="text" name="tn" id="tn" placeholder="Train no" size="5" maxlength="5" style="color:#ff0000;"><input type="hidden"name="f"id="f"placeholder="GKP"size="5" maxlength="5"><input type="hidden"name="t"id="t" placeholder="NDLS"size="5" maxlength="5"><input type="text" maxlength="10" size="10" placeholder="DD-MM-YYYY" id="d" name="d" style="color:#ff0000;" disabled><select id="cl" name="cl" style="color:#ff0000;"><option value="SL">Sleeper</option><option value="3A">3AC</option><option value="2A">2AC</option><option value="1A">1AC</option><option value="2S">2Seating</option><option value="CC">Chair Car</option><input type="text" id="b" name="b" size="4" maxlength="4" style= "align:center;width:4em;color:#ff0000;"><input  type="text" id="p0"placeholder="1 passenger" size="15" maxlength="16"name="p0"><input type="text" id="ag0" placeholder="age"size="2" maxlength="3" name="addPassengerForm:psdetail:0:psgnAge"><select id="as0" name="addPassengerForm:psdetail:0:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option></select><input type="text" id="p1"placeholder="2 passenger" size="15" maxlength="16"name="p1"><input type="text" id="ag1" placeholder="age"size="2" maxlength="3" name="addPassengerForm:psdetail:1:psgnAge"><select id="as1" name="addPassengerForm:psdetail:1:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option></select><input type="text" id="p2" placeholder="3 passenger" size="15" maxlength="16" name="addPassengerForm:psdetail:2:psgnName"><input type="text" id="ag2" placeholder="age"size="2" maxlength="3" name="addPassengerForm:psdetail:2:psgnAge"><select id="as2" name="addPassengerForm:psdetail:2:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option></select><input type="text" id="p3" placeholder="4 passenger" size="15" maxlength="16" name="addPassengerForm:psdetail:3:psgnName"><input type="text" id="ag3" placeholder="age"size="2" maxlength="3" name="addPassengerForm:psdetail:3:psgnAge"><select id="as3" name="addPassengerForm:psdetail:3:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option></select><input type="text" id="mobileNo" placeholder="Mobile No"style="width:6em" maxlength="10"name="addPassengerForm:mobileNo"><select id="qt" name="qt"><option value="GN">General</option><option value="PT">Premium</option><option value="HP">Handicap</option><option value="LD">Ladies</option><option value="TQ">Tatkal</option></select></td><td><select id="pay" style="color:#ff0000;" name="pay"><option value="py">PayOn</option><option value="pn">PayOff</option></select><select id="ba" name="ba" size="1" style="width:8em"><option value="21">HDFC Visa/Master Card</option><option value="1">SBI NetBanking</option><option value="3">SBI ATM</option><option value="9">PNB ATM</option><option value="34">PNB NetBanking</option><option value="36">HDFC NetBanking</option><option value="57">HDFC ATM Card</option><option value="44">ICICI Bank</option><option value="50">Central Bank of India</option><option value="48">Bank of India</option><option value="52">IDBI Bank</option><option value="75">SBI BUDDY</option><option value="">IRCTC</option></select></td><td><select id="bt" name="bt" size="1" style="width:8em"> <option value="CREDIT_CARD">Payment Gateway / Credit Card</option><option value="NETBANKING">Net Banking</option><option value="DEBIT_CARD">Debit Card</option><option value="CASH_CARD">CASH CARD</option><option value="E_WALLET">E WALLET</option> </select>Availability Pay<input type="number" name="avl" id="avl" placeholder="Availability" size="5" maxlength="5" style="color:red;">Total Fare<input type="number" name="amo" id="amo" placeholder="Total Fare" size="5" maxlength="5" style="color:red;"><td>Name<input type="text" id="va" name="va" size="20" maxlength="20"style="color:#0000ff;align:left;width:5em;"></td><td>Card No.<input type="text" id="vn" name="vn" size="16" maxlength="16" style= "color:#0000ff;align:left;width:5em;"></td><td>MM<input type="text" id="vm" name="vm" size="2" maxlength="2" style= "align:left; width:2em;"></td><td>YYYY<input type="text" id="vy" name="vy" size="4" maxlength="4" style="color:#0000ff; align:left;width:4em;"></td><td>CCV<input type="text" id="ccv" name="ccv" size="3" maxlength="3" style= "color:#0000ff; align:left;width:2em;"><input  type="submit" id="save"  value="save"name="save"onclick="return false"><input type="button" value="Reset" id="clr" name="clr"></td><input type="button" id="ars" value="Auto Start" name="ars"><input type="button" id="stp" value="Auto Stop" name="stp"><input type="button" id="ctm" name="ctm"></div></form></body>';
        if(document.getElementById('loginbutton')){localStorage.c=0;
     document.getElementsByClassName('grid_12 alpha')[0].innerHTML = '<body><form method="get" id="buddha" style="border: thin solid #3333FF"><div id="add" align="center">Fill From:<input type="text"maxlength="25"style="color:#311ee1;" name="jpform:from" id="jpform:fromStation"placeholder="From_Station">Fill To:<input type="text" maxlength="25" style="color:#311ee1;" name="jpform:to" id="jpform:toStation" placeholder="To_Station"></div></form></body>'
     document.getElementById('jpform:fromStation').value=localStorage.fo;
       document.getElementById('jpform:toStation').value=localStorage.to;
    // document.getElementsByClassName('grid_8 pull_8')[0].style="display: none";
    // document.getElementsByClassName('grid_8 push_8')[0].style="display: none";
   var od= localStorage.d; 
    var d = od.slice(0,2);
    var m = od.slice(3,5);
    var y = od.slice(6,10);
    var dt = new Date();
    var dd = dt.getDate();
    var mm = dt.getMonth();
    var yyyy = dt.getFullYear();
    var mm = mm+1;
if(dd<=9){dd="0"+dd;}
if(mm<=9){mm="0"+mm;}
var cd=dd+"-"+mm+"-"+yyyy;
var dr = Date.UTC(y, m, d);
var dt = Date.UTC(yyyy, mm, dd);
if(dr<dt){localStorage.d =cd;}
     document.getElementById('loginbutton').addEventListener('click', function(){
     localStorage.log = document.getElementsByClassName('loginUserId')[0].value;
     localStorage.pas = document.getElementsByClassName('loginPassword')[0].value;
     localStorage.fo= document.getElementById('jpf').value= document.getElementById('jpform:fromStation').value;
     localStorage.to= document.getElementById('jpto').value= document.getElementById('jpform:toStation').value;
     document.getElementById('save').click();});
      if(localStorage.log !==undefined){
           document.getElementsByClassName('loginUserId')[0].value = localStorage.log;
           document.getElementsByClassName('loginPassword')[0].value = localStorage.pas;}
           if(document.getElementById("cimage")){document.getElementById("cimage").style.height="70px";
           document.getElementsByName("j_captcha")[0].style="FONT:bold 25px arial; width:4em;color:#FF0000;";}
           localStorage.r=0
           function clock(){
            DateArr = new Array();
            date = new Date();
            rnr = date.getTime();
            DateArr['hours'] = date.getHours();
            DateArr['minutes'] = date.getMinutes().toString();
            DateArr['seconds'] = date.getSeconds().toString();
             var la=document.getElementsByName("j_captcha")[0].value; 
             var lat=la.length;
            if(la){document.getElementsByName("j_captcha")[0].value=la.toUpperCase();}
              document.getElementById("ctm").style="FONT:bold 15px arial; width:13em;color:red;";
            document.getElementById("ctm").value ="CurrentTime:"+date.toLocaleTimeString();
            if(lat<1){if(localStorage.r<16){document.getElementsByName("j_captcha")[0].focus();localStorage.r=Number(localStorage.r)+1;}}
            if(lat>=5){document.getElementById('loginbutton').click(); return false;}
             //if(localStorage.r>=15 ){window.location.assign("https://www.irctc.co.in/eticketing/loginHome.jsf");return false}
             window.setTimeout(clock, 1000);}
             clock();
              }
 if(document.getElementById('quickbookTab:content')){
var qr=localStorage.qt;
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
              }
            //var as = document.getElementById('bluemenu');
           // as.style="border:2px solid blue;width:100;height:auto;overflow:auto";
           // as.innerHTML = '<body><form method="get" id="buddha" style="border: thin solid #3333FF"><div id="add" align="center"><input type="text"style="color:#ff0000;" maxlength="25" name="jpf" id="jpf"placeholder="From_Station" disabled><input type="text" style="color:#ff0000;" maxlength="25" name="jpto" id="jpto" placeholder="To_Station" disabled><input type="text" name="tn" id="tn" placeholder="Train no" size="5" maxlength="5" style="color:#ff0000;"><input type="hidden"name="f"id="f"placeholder="GKP"size="5" maxlength="5"><input type="hidden"name="t"id="t" placeholder="NDLS"size="5" maxlength="5"><input type="text" maxlength="10" size="10" placeholder="DD-MM-YYYY" id="d" name="d" style="color:#ff0000;" disabled><select id="cl" name="cl" style="color:#ff0000;"><option value="SL">Sleeper</option><option value="3A">3AC</option><option value="2A">2AC</option><option value="1A">1AC</option><option value="2S">2Seating</option><option value="CC">Chair Car</option><input type="text" id="b" name="b" size="4" maxlength="4" style= "align:center;width:4em;color:#ff0000;"><input  type="text" id="p0"placeholder="1 passenger" size="15" maxlength="16"name="p0"><input type="text" id="ag0" placeholder="age"size="2" maxlength="3" name="addPassengerForm:psdetail:0:psgnAge"><select id="as0" name="addPassengerForm:psdetail:0:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option></select><input type="text" id="p1"placeholder="2 passenger" size="15" maxlength="16"name="p1"><input type="text" id="ag1" placeholder="age"size="2" maxlength="3" name="addPassengerForm:psdetail:1:psgnAge"><select id="as1" name="addPassengerForm:psdetail:1:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option></select><input type="text" id="p2" placeholder="3 passenger" size="15" maxlength="16" name="addPassengerForm:psdetail:2:psgnName"><input type="text" id="ag2" placeholder="age"size="2" maxlength="3" name="addPassengerForm:psdetail:2:psgnAge"><select id="as2" name="addPassengerForm:psdetail:2:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option></select><input type="text" id="p3" placeholder="4 passenger" size="15" maxlength="16" name="addPassengerForm:psdetail:3:psgnName"><input type="text" id="ag3" placeholder="age"size="2" maxlength="3" name="addPassengerForm:psdetail:3:psgnAge"><select id="as3" name="addPassengerForm:psdetail:3:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option></select><input type="text" id="mobileNo" placeholder="Mobile No"style="width:6em" maxlength="10"name="addPassengerForm:mobileNo"><select id="qt" name="qt"><option value="GN">General</option><option value="PT">Premium</option><option value="HP">Handicap</option><option value="LD">Ladies</option><option value="TQ">Tatkal</option></select></td><td><select id="pay" style="color:#ff0000;" name="pay"><option value="py">PayOn</option><option value="pn">PayOff</option></select><select id="ba" name="ba" size="1" style="width:8em"><option value="21">HDFC Visa/Master Card</option><option value="1">SBI NetBanking</option><option value="3">SBI ATM</option><option value="9">PNB ATM</option><option value="34">PNB NetBanking</option><option value="36">HDFC NetBanking</option><option value="57">HDFC ATM Card</option><option value="44">ICICI Bank</option><option value="50">Central Bank of India</option><option value="48">Bank of India</option><option value="52">IDBI Bank</option><option value="75">SBI BUDDY</option></select></td><td><select id="bt" name="bt" size="1" style="width:8em"> <option value="CREDIT_CARD">Payment Gateway / Credit Card</option><option value="NETBANKING">Net Banking</option><option value="DEBIT_CARD">Debit Card</option><option value="CASH_CARD">CASH CARD</option> </select>Availability Pay<input type="number" name="avl" id="avl" placeholder="Availability" size="5" maxlength="5" style="color:red;">Total Fare<input type="number" name="amo" id="amo" placeholder="Total Fare" size="5" maxlength="5" style="color:red;"><td>Name<input type="text" id="va" name="va" size="20" maxlength="20"style="color:#0000ff;align:left;width:5em;"></td><td>Card No.<input type="text" id="vn" name="vn" size="16" maxlength="16" style= "color:#0000ff;align:left;width:5em;"></td><td>MM<input type="text" id="vm" name="vm" size="2" maxlength="2" style= "align:left; width:2em;"></td><td>YYYY<input type="text" id="vy" name="vy" size="4" maxlength="4" style="color:#0000ff; align:left;width:4em;"></td><td>CCV<input type="text" id="ccv" name="ccv" size="3" maxlength="3" style= "color:#0000ff; align:left;width:2em;"><input  type="submit" id="save"  value="save"name="save"onclick="return false"><input type="button" value="Reset" id="clr" name="clr"></td><input type="button" id="ars" value="Auto Start" name="ars"><input type="button" id="stp" value="Auto Stop" name="stp"><input type="button" id="ctm" name="ctm"></div></form></body>';
           document.getElementById("ars").addEventListener('click', function (){localStorage.ars="yes";}); 
            document.getElementById("stp").addEventListener('click', function (){localStorage.ars="no";}); 
            document.getElementById('clr').addEventListener('click', function(){localStorage.removeItem('fo');localStorage.removeItem('p0');});
            document.getElementById('ctm').addEventListener('click', function(){ localStorage.pay ="pn";});
           document.getElementById("save").addEventListener('click', function (){
            localStorage.fo= document.getElementById('jpf').value= document.getElementById('jpform:fromStation').value;
            localStorage.to= document.getElementById('jpto').value= document.getElementById('jpform:toStation').value;
            localStorage.d = document.getElementById('d').value = document.getElementById('jpform:journeyDateInputDate').value;
            });
            document.getElementById("save").addEventListener('click', function (){
            localStorage.tn= document.getElementsByName('tn')[0].value;
            localStorage.cl= document.getElementsByName('cl')[0].value;
            bd=document.getElementById('b').value;
            localStorage.b = bd.toUpperCase();            
            ps0=document.getElementById('p0').value;
            localStorage.p0 =ps0.toUpperCase();
            localStorage.ag0 = document.getElementById('ag0').value;
            localStorage.as0 = document.getElementById('as0').value;
            ps1=document.getElementById('p1').value;
            localStorage.p1 = ps1.toUpperCase();
            localStorage.ag1 = document.getElementById('ag1').value;
            localStorage.as1 = document.getElementById('as1').value;
            ps2=document.getElementById('p2').value;
            localStorage.p2 = ps2.toUpperCase();
            localStorage.ag2 = document.getElementById('ag2').value;
            localStorage.as2 = document.getElementById('as2').value;
             ps3= document.getElementById('p3').value;
            localStorage.p3 =ps3.toUpperCase();
            localStorage.ag3 = document.getElementById('ag3').value;
            localStorage.as3 = document.getElementById('as3').value;
            localStorage.mo = document.getElementById('mobileNo').value;
            localStorage.qt = document.getElementById('qt').value;
            localStorage.pay = document.getElementById('pay').value;
            localStorage.avl= document.getElementsByName('avl')[0].value;
            localStorage.amo= document.getElementsByName('amo')[0].value;
            localStorage.vn = document.getElementById('vn').value;
            localStorage.vm = document.getElementById('vm').value;
            localStorage.vy = document.getElementById('vy').value;
            localStorage.ccv = document.getElementById('ccv').value;
            localStorage.va = document.getElementById('va').value;
            localStorage.ba = document.getElementById('ba').value;
            localStorage.bt = document.getElementById('bt').value;
                       });
 if(localStorage.fo !==undefined && localStorage.p0 !==undefined) {
               document.getElementById('tn').value = localStorage.tn;
               document.getElementById('jpf').value=localStorage.fo;
               document.getElementById('jpto').value=localStorage.to;
               document.getElementById('d').value = localStorage.d;
               document.getElementById('f').value = localStorage.f;
               document.getElementById('t').value = localStorage.t;
                document.getElementById('cl').value = localStorage.cl;
                document.getElementById('b').value = localStorage.b;
                document.getElementById('p0').value = localStorage.p0;
                document.getElementById('ag0').value = localStorage.ag0;
                document.getElementById('as0').value = localStorage.as0;
                document.getElementById('p1').value = localStorage.p1;
                document.getElementById('ag1').value = localStorage.ag1;
                document.getElementById('as1').value = localStorage.as1;
                document.getElementById('p2').value = localStorage.p2;
                document.getElementById('ag2').value = localStorage.ag2;
                document.getElementById('as2').value = localStorage.as2;
                document.getElementById('p3').value = localStorage.p3;
                document.getElementById('ag3').value = localStorage.ag3;
                document.getElementById('as3').value = localStorage.as3;
                document.getElementById('mobileNo').value = localStorage.mo;
                document.getElementById('qt').value = localStorage.qt;
                document.getElementById('pay').value=localStorage.pay;
                document.getElementById('avl').value = localStorage.avl;
                document.getElementById('amo').value = localStorage.amo;}
                document.getElementById('vn').value=localStorage.vn;
                document.getElementById('vm').value=localStorage.vm;
                document.getElementById('vy').value=localStorage.vy;
                document.getElementById('ccv').value= localStorage.ccv;
                document.getElementById('va').value=localStorage.va;
                document.getElementById('ba').value= localStorage.ba;
                document.getElementById('bt').value=localStorage.bt;
               
             if(document.getElementById('quickbookTab:content') && localStorage.fo !==undefined && localStorage.to !==undefined){
            document.getElementById('jpform:fromStation').value=localStorage.fo;
            document.getElementById('jpform:toStation').value=localStorage.to;
            document.getElementById('d').value= document.getElementById('jpform:journeyDateInputDate').value= localStorage.d;
            document.getElementById('pay').value="py";
            localStorage.x=25;
            localStorage.Y=1;
            document.getElementById('jpform:flexiDateId').checked="checked";
            document.getElementById('jpform:jpsubmit').addEventListener('click', function(){document.getElementById('save').click();});
           if (document.getElementById('contentformid1') && localStorage.ars=="yes" ){ document.getElementById('jpform:jpsubmit').click();}//&& localStorage.auto !=="na"
           if(localStorage.qt){var qt=localStorage.qt;}
             tn=localStorage.tn; cl=localStorage.cl;d=localStorage.d;f=localStorage.f;t=localStorage.t;
            tnid ="cllink-"+tn+"-"+cl;
             dq=document.querySelector('[id^=\''+tnid+'\']');
             if(dq){ dq.style="font-size: 25px; font-weight: bold; font-style: normal; font-variant: normal; color: red; text-align: center";}
             document.getElementById("ctm").style="font-size: 12px; font-weight: bold; font-style: normal; font-variant: normal; color: red; text-align: center";
            
       function book(){
            if(document.getElementById('refid1') && localStorage.qt){
              if (document.getElementById('refid1') && document.getElementById('avlAndFareForm:quota').value !=localStorage.qt) {localStorage.qt=document.getElementById('avlAndFareForm:quota').value;document.getElementById('qt').value = localStorage.qt;}}
             if(localStorage.f != document.getElementById('avlAndFareForm:fromStation').value && document.getElementById('avlAndFareForm:fromStation').value !="" || localStorage.t != document.getElementById('avlAndFareForm:toStation').value && document.getElementById('avlAndFareForm:toStation').value !="" || localStorage.tn != document.getElementById('avlAndFareForm:trainNumber').value && document.getElementById('avlAndFareForm:trainNumber').value !="" || localStorage.cl!=document.getElementById('avlAndFareForm:journeyClass').value && document.getElementById('avlAndFareForm:journeyClass').value!="")
             { localStorage.cl=document.getElementById('cl').value=document.getElementById('avlAndFareForm:journeyClass').value;
             localStorage.tn=document.getElementById('tn').value=document.getElementById('avlAndFareForm:trainNumber').value;
             localStorage.f=document.getElementById('f').value=document.getElementById('avlAndFareForm:fromStation').value;
             localStorage.t=document.getElementById('t').value=document.getElementById('avlAndFareForm:toStation').value;
             localStorage.d =document.getElementById('d').value= document.getElementById('jpform:journeyDateInputDate').value;}
             //f=localStorage.f; t=localStorage.t;
             //document.getElementById('qut3').addEventListener('click', function () {jpBook(this, tn, f, t, d, cl, qt, 1,false);return false ;});
            if (document.getElementById('refid1')) {var bid = tn+"-"+cl+"-"+qt+"-0";}
            if(document.getElementById(bid)){var se=document.querySelector('[id^=\''+bid+'\']');var con=se.href; var con1 = con.split(",",8); var con2 = con1.slice(7,8);}                                                  
             if (rb<=rnr && document.getElementById('avlAndFareForm:cc').value == "false" && dq && localStorage.ars=="yes" && DateArr['minutes'] <= 56)
             {dq.click();} else {if(document.getElementById('c1')){if (document.getElementById(bid) && localStorage.ars=="yes" && con2=="1"){se.click(); return false;}
            else { if (DateArr['minutes'] <= 0 && localStorage.ars=="yes"){ document.getElementById('jpform:jpsubmit').click(); return false;}}}
             }}
function clock(){
            rn=n+120000;
            rb=n+1000
            DateArr = new Array();
            date = new Date();
            rnr = date.getTime();
            DateArr['hours'] = date.getHours();
            DateArr['minutes'] = date.getMinutes().toString();
            DateArr['seconds'] = date.getSeconds().toString();
            //hideTbisPopup();
            document.getElementById("ctm").value ="CurrentTime:"+date.toLocaleTimeString()+":-:RunTime :"+ date1.toLocaleTimeString();
             //if(rn<=rnr && DateArr['minutes'] != 59 && DateArr['minutes'] != 0 || DateArr['minutes'] == 59 && DateArr['seconds'] ==40 ){var re=document.getElementsByClassName("right-boarder")[0];re.querySelectorAll("a")[0].click(); return false;} 
             book();
             window.setTimeout(clock, 1000);
             }
           clock();}
function passfill(){
  if(localStorage.b !=="") {document.getElementById("addPassengerForm:boardingStation").value=localStorage.b;}
dq0 = document.querySelector('input[size=\'16\'][id^=\'addPassengerForm:psdetail:0:\']');
    if (dq0) dq0.value = document.getElementById('p0').value;
                if(localStorage.ag0){
document.getElementById("addPassengerForm:psdetail:0:psgnAge").value=localStorage.ag0;
sg0 = document.querySelector('[id^=\'addPassengerForm:psdetail:0:psgnG\']');
    if (sg0) sg0.value = localStorage.as0;                
document.getElementById("addPassengerForm:psdetail:0:berthChoice").value= "LB";}
 dq1 = document.querySelector('input[size=\'16\'][id^=\'addPassengerForm:psdetail:1:\']');
    if (dq1) dq1.value = document.getElementById('p1').value;
                if(localStorage.ag1){
document.getElementById("addPassengerForm:psdetail:1:psgnAge").value=localStorage.ag1;
sg1 = document.querySelector('[id^=\'addPassengerForm:psdetail:1:psgnG\']');
    if (sg1) sg1.value = localStorage.as1;                
document.getElementById("addPassengerForm:psdetail:1:berthChoice").value="MB";}
dq2 = document.querySelector('input[size=\'16\'][id^=\'addPassengerForm:psdetail:2:\']');
    if (dq2) dq2.value = document.getElementById('p2').value;
      if(localStorage.ag2){          
document.getElementById("addPassengerForm:psdetail:2:psgnAge").value=localStorage.ag2;
sg2 = document.querySelector('[id^=\'addPassengerForm:psdetail:2:psgnG\']');
    if (sg2) sg2.value = localStorage.as2;                
document.getElementById("addPassengerForm:psdetail:2:berthChoice").value= "UB";}
dq3 = document.querySelector('input[size=\'16\'][id^=\'addPassengerForm:psdetail:3:\']');
    if (dq3) dq3.value = document.getElementById('p3').value;
        if(localStorage.ag3){        
document.getElementById("addPassengerForm:psdetail:3:psgnAge").value=localStorage.ag3;
sg3 = document.querySelector('[id^=\'addPassengerForm:psdetail:3:psgnG\']');
    if (sg3) sg3.value = localStorage.as3;                
document.getElementById("addPassengerForm:psdetail:3:berthChoice").value="LB";}}
function pass(){
 document.getElementById("addPassengerForm:childInfoTable").innerHTML ="";
 document.getElementById("addPassengerForm:mobileNo").value= localStorage.mo;
 //document.getElementById('addPassengerForm:travelInsurance:1').click(checked=true);
if(document.getElementById("addPassengerForm:onlyConfirmBerths")){document.getElementById("addPassengerForm:onlyConfirmBerths").checked = true;}
document.getElementById('validate').addEventListener('click', function () {document.getElementById('cno').click();});
if(document.getElementById("addPassengerForm:autoUpgrade")){document.getElementById("addPassengerForm:autoUpgrade").checked = true;}
window.scrollTo(0,550);
//document.getElementById('coachCondNote').innerHTML ='<input type="button"name="next"id="next"value="NEXT">';
//document.getElementById('next').addEventListener('click', function () {$("#addPassengerForm\\:jpProceedBooking").click();return false;});
if(document.getElementById("bkg_captcha")){
document.getElementById("bkg_captcha").style.height="80px";
document.getElementById("j_captcha").style="FONT:bold 36px arial; width:5em;color:#FF0000;";
document.getElementById("j_captcha").focus();}
da = document.querySelector('[id^=\'r\'][src^=\'rimage\']');
    if (da) da.style.height="80px";
date2 = new Date();
clock();
}
if(document.getElementById("addPassengerForm:mobileNo")){pass();}
localStorage.r=0
function clock(){
            date = new Date();
            DateArr = new Array();
            DateArr.hours = date.getHours();
            DateArr.minutes = date.getMinutes().toString();
            DateArr.seconds = date.getSeconds().toString();
            document.getElementById('gsterror').innerHTML =localStorage.x+": :Time ::"+ date.toLocaleTimeString();
           // document.getElementById('bookingCondNote').innerHTML =localStorage.x;
           // document.getElementById('bookingCondNote').style='font-size: 30px; color:blue;
            document.getElementById('gsterror').style='font-size: 20px; color:red;';
            if(document.getElementById("j_captcha")){
          var a=document.getElementsByName("j_captcha")[0].value;
           var at=a.length;
           if(at<1){if(localStorage.r<4){document.getElementsByName("j_captcha")[0].focus();localStorage.r=Number(localStorage.r)+1;}}   
           if(a){document.getElementsByName("j_captcha")[0].value=a.toUpperCase();}
          if(at>=5 && localStorage.x<=3){$("#addPassengerForm\\:jpProceedBooking").click();return false;}//document.getElementById('validate').click();}
            }
            if((localStorage.x==15 || localStorage.x==0) && localStorage.ars=="yes" ){passfill();}
            if(localStorage.x>=1){localStorage.x=Number(localStorage.x)-1;}            
            window.setTimeout(clock, 1000);
             }
if(document.getElementById('jpBook:jpBack')){
   bn=localStorage.ba;
 bty=localStorage.bt;
$(document).ready(function(){
  checkSearchType(bty);
var qu = document.getElementsByName(bty);
  for (var i = 0; i < qu.length; i++) {
  pg=qu[i].value;
  switch (pg) {
    case bn:
    var elements = document.getElementsByName(bty);
    elements[i].click(checked = true);
   document.getElementById('CREDIT_CARD').addEventListener('click', function () {
   document.getElementById('CREDIT_CARD').click();
   document.getElementById('card_no_id').value=localStorage.vn;
   document.getElementById('card_expiry_mon_id').value=localStorage.vm;
   document.getElementById('card_expiry_year_id').value=localStorage.vy;
   document.getElementById('cvv_no_id').value=localStorage.ccv;
   document.getElementById('card_name_id').value=localStorage.va;
   document.getElementById("cimage").style.height="80px";
   document.getElementsByName("j_captcha")[0].style="FONT:bold 30px arial; width:5em;color:#FF0000;";
   document.getElementById("captcha_txt").focus(); 
   //window.scrollTo(0,650);
   payle();
     document.getElementsByClassName('footer')[0].style="display: none";
   //document.getElementsByClassName('Tenders PmtBlock')[0].style="display: none";
   document.getElementsByClassName('paymentMsgBox')[0].style="display:none";
   });
   if(bty=="CREDIT_CARD"){document.getElementById('CREDIT_CARD').click();
        } else {
          var aval=document.getElementsByClassName("BotBlockMid")[0];
          var aval1=aval.querySelectorAll("td")[2].innerHTML;
          var aval2 = aval1.slice(10,14);
          sessionStorage.aval=aval2
          var fare=document.getElementsByClassName("BotBlockMid")[1];
          var fare1=fare.querySelectorAll("span")[3].innerHTML;
          var fare2 = fare1.slice(9,18);
          sessionStorage.fare=fare2
          var av =Number(localStorage.avl); var av1 =Number(sessionStorage.aval);
        if(av<av1 && localStorage.pay=="py" && (localStorage.qt =="TQ" || localStorage.qt =="GN")){localStorage.pay = "pn";document.getElementById("jpBook:makePmntModeId1").click(); }
          var fe =Number(localStorage.amo); var fe1 =Number(sessionStorage.fare);
        if(fe1<fe && localStorage.pay=="py" && (localStorage.qt =="PT")){localStorage.pay = "pn";document.getElementById("jpBook:makePmntModeId1").click(); }
        if(localStorage.pay=="pn" && confirm("Seat:"+av1+"=====Fare:"+fe1)){document.getElementById("jpBook:makePmntModeId1").click();}}
      break;}}});}
function payle(){
         DateArr = new Array();
            date = new Date();
            rnr = date.getTime();
            DateArr['hours'] = date.getHours();
            DateArr['minutes'] = date.getMinutes().toString();
            DateArr['seconds'] = date.getSeconds().toString();
           var pla=document.getElementsByName("j_captcha")[0].value;
             var plat=pla.length;
           if(pla){document.getElementsByName("j_captcha")[0].value= pla.toUpperCase();}
            if(plat>=5  && localStorage.Y>=1  && localStorage.pay=="py"){
             document.getElementById("jpBook:makePmntModeId1").click(); return false;}
             if(plat>=5  && localStorage.Y>=1){localStorage.Y=Number(localStorage.Y)+1;}
             if(plat<1 ){window.scrollTo(0,650);}
             window.setTimeout(payle, 1000);
}