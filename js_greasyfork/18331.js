// ==UserScript==
// @name        LOGIN anand
// @namespace   ANAND KUMAR
// @include     https://www.irctc.co.in/*
// @version     3
// @description CONTECT 9794115696
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18331/LOGIN%20anand.user.js
// @updateURL https://update.greasyfork.org/scripts/18331/LOGIN%20anand.meta.js
// ==/UserScript==
function login() {
      var ss=document.getElementsByClassName('grid_16 g_box')[0]//.style="display: none";
        document.getElementsByClassName('grid_16 omega g_box')[0].style="display: none";
       ss.style="border:4px solid red;width:380px;height:290px;float: right;overflow:auto"
       ss.innerHTML = '<html><body><table id="anand" style="height: 100%;width:100%;"><tbody><td><div class="boxHead"><div class="logheading">Navoday Computer Salemgarh<br> &nbsp; <table id="favJourney:favJourneyPanel" class="labeltxt"><tbody></tr><td >Mobile</td> <td><input type="text" id="addPassengerForm:mobileNo" class="txtfld" style="width:8em" maxlength="10"name="addPassengerForm:mobileNo"></td><td>Train: </td><td><input id="favJourney:trnNumber" type="text" name="favJourney:trnNumber" maxlength="5" style="width:8em" /></td><tr><td>From : </td><td><input id="jpform:fromStation" type="text" name="favJourney:fromStation" maxlength="25" style="width:8em" /></td><td>To </td><td><input id="jpform:toStation" type="text" name="favJourney:toStation" maxlength="25" style="width:8em" /></td></tr><td>Bo Point</td> <td><input type="text" id="B" class="txtfld" size="4" maxlength="4" style="FONT: bold 14px arial; align:center;width:3em;color:#FF0000;" name="B"><tr/><td>Class : </td><td><select id="favJourney:classFav" name="favJourney:classFav" class="labeltxt" size="1" style="width:8em">	<option value="blank">Select Class</option><option value="1A">FIRST AC (1A)</option><option value="EC">EXECUTIVE CLASS (EC)</option><option value="2A">SECOND AC (2A)</option><option value="FC">FIRST CLASS (FC)</option>	<option value="3A">THIRD AC (3A)</option><option value="3E">THIRD AC ECONOMY (3E)</option>	<option value="CC">CHAIR CAR (CC)</option><option value="SL">SLEEPER CLASS (SL)</option><option value="2S">SECOND SITTING (2S)</option></select></td></td><td>Quota : </td><td><select id="favJourney:quotaFav" name="favJourney:quotaFav" class="labeltxt" size="1" style="width:8em">	<option value="">Select Quota</option>	<option value="GN">GENERAL</option>	<option value="PT">PREMIUM TATKAL</option><option value="PH">PHYSICALLY HANDICAP</option><option value="LD">LADIES</option><option value="CK">TATKAL</option></select></td></tr><tr><td class="labeltxt" nowrap="nowrap" width="35%">Journey Date:</td><td><span id="jpform:journeyDate"><input class="rf-cal-inp " id="jpform:journeyDateInputDate" name="jpform:journeyDateInputDate" style="width:8em"type="text" /></td></td><td>Auto : </td><td><select id="con" name="con" class="labeltxt" size="1" style="width:8em">	<option value="Y">Yes</option>	<option value="N">No</option>	<option value="PY">Pay</option></select></td></tr><tr><td>Select Bank</td><td><select id="bank" name="bank" class="labeltxt" size="1" style="width:8em">	<option value="-1">Select Bank</option><option value="1">SBI NetBanking</option><option value="3">SBI ATM</option><option value="9">PNB ATM</option><option value="34">PNB NetBanking</option><option value="36">HDFC NetBanking</option><option value="21">HDFC Visa/Master Card</option><option value="57">HDFC ATM Card</option><option value="44">ICICI Bank</option><option value="50">Central Bank of India</option><option value="48">Bank of India</option><option value="52">IDBI Bank</option></select></td><td>Banking</td><td> <select id="bt" name="bt" class="labeltxt" size="1" style="width:8em"><option value="NETBANKING">Net Banking</option> <option value="CREDIT_CARD">Payment Gateway / Credit Card</option><option value="DEBIT_CARD">Debit Card</option> </select></td></tr></tbody></table><table id="pass7" class="labeltxt" style="width:50%;"><tbody><td class="t1" >Sr</td><td class="t1" >Name</td><td class="t1">Age</td><td class="t1" >Sex</td><td class="t1">Berth</td>  </tr><td class="t2"> 1 </td><td class="t2"><input type="text" id="Passemger0" class="txtfld" size="15" maxlength="16"name="addPassengerForm:psdetail:0:psgnName"></td><td class="t2"><input type="text" class="txtfld" size="1" maxlength="3" name="addPassengerForm:psdetail:0:psgnAge"> </td>  <td class="t2">  <select class="txtfld" name="addPassengerForm:psdetail:0:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option> </select> </td>  <td class="t2">  <select class="txtfld" name="addPassengerForm:psdetail:0:berthChoice"><option selected="" value="">No Preference</option><option value="LB">LOWER</option><option value="MB">MIDDLE</option><option value="UB">UPPER</option><option value="SL">SIDE LOWER</option> <option value="SU">SIDE UPPER</option> <option value="WS">WINDOW SIDE</option></select></td></tr><td class="t3"> 2 </td><td class="t3"><input type="text" id="Passemger1" class="txtfld" size="15" maxlength="16"name="addPassengerForm:psdetail:1:psgnName"></td><td class="t3"><input type="text" Class="txtfld" size="1" maxlength="3" name="addPassengerForm:psdetail:1:psgnAge"> </td>  <td class="t3">  <select class="txtfld" name="addPassengerForm:psdetail:1:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option> </select> </td>  <td class="t3">  <select class="txtfld" name="addPassengerForm:psdetail:1:berthChoice"><option selected="" value="">No Preference</option><option value="LB">LOWER</option><option value="MB">MIDDLE</option><option value="UB">UPPER</option><option value="SL">SIDE LOWER</option> <option value="SU">SIDE UPPER</option><option value="WS">WINDOW SIDE</option></select></td></tr></tr><td class="t4"> 3 </td><td class="t4"><input type="text" id="Passemger2" class="txtfld" size="15" maxlength="16"name="addPassengerForm:psdetail:2:psgnName"></td><td class="t4"><input type="text" class="txtfld" size="1" maxlength="3" name="addPassengerForm:psdetail:2:psgnAge"> </td> <td class="t4"> <select class="txtfld" name="addPassengerForm:psdetail:2:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option> </select> </td>  <td class="t4">  <select class="txtfld" name="addPassengerForm:psdetail:2:berthChoice"><option selected="" value="">No Preference</option><option value="LB">LOWER</option><option value="MB">MIDDLE</option><option value="UB">UPPER</option><option value="SL">SIDE LOWER</option> <option value="SU">SIDE UPPER</option> <option value="WS">WINDOW SIDE</option></select></td> </tr></tr><td class="t5"> 4 </td><td class="t5"><input type="text" id="Passemger3" class="txtfld" size="15" maxlength="16"name="addPassengerForm:psdetail:3:psgnName"></td><td class="t5"><input type="text" class="txtfld" size="1" maxlength="3" name="addPassengerForm:psdetail:3:psgnAge"> </td>  <td class="t5">  <select class="txtfld" name="addPassengerForm:psdetail:3:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option> </select> </td>  <td class="t5">  <select class="txtfld" name="addPassengerForm:psdetail:3:berthChoice"><option selected="" value="">No Preference</option><option value="LB">LOWER</option><option value="MB">MIDDLE</option><option value="UB">UPPER</option><option value="SL">SIDE LOWER</option> <option value="SU">SIDE UPPER</option> <option value="WS">WINDOW SIDE</option></select></td> </tr></tr><td class="t6"> 5 </td><td class="t6"><input type="text" id="Passemger3" class="txtfld" size="15" maxlength="16"name="addPassengerForm:psdetail:4:psgnName"></td><td class="t6"><input type="text" class="txtfld" size="1" maxlength="3" name="addPassengerForm:psdetail:4:psgnAge"> </td>  <td class="t6">  <select class="txtfld" name="addPassengerForm:psdetail:4:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option> </select> </td>  <td class="t6">  <select class="txtfld" name="addPassengerForm:psdetail:4:berthChoice"><option selected="" value="">No Preference</option><option value="LB">LOWER</option><option value="MB">MIDDLE</option><option value="UB">UPPER</option><option value="SL">SIDE LOWER</option> <option value="SU">SIDE UPPER</option> <option value="WS">WINDOW SIDE</option></select></td> </tr></tr><td class="t7"> 6 </td><td class="t7"><input type="text" id="Passemger3" class="txtfld" size="15" maxlength="16"name="addPassengerForm:psdetail:5:psgnName"></td><td class="t7"><input type="text" class="txtfld" size="1" maxlength="3" name="addPassengerForm:psdetail:5:psgnAge"> </td>  <td class="t7">  <select class="txtfld" name="addPassengerForm:psdetail:5:psgnGender"><option value="">Select</option><option value="M">Male</option><option value="F">Female</option> </select> </td>  <td class="t7">  <select class="txtfld" name="addPassengerForm:psdetail:5:berthChoice"><option selected="" value="">No Preference</option><option value="LB">LOWER</option><option value="MB">MIDDLE</option><option value="UB">UPPER</option><option value="SL">SIDE LOWER</option> <option value="SU">SIDE UPPER</option> <option value="WS">WINDOW SIDE</option></select></td></tbody>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="hidden" name="D1" id="D1" value="Display"><input type="button" name="C1" id="C1" value="Delete"><input type="button" name="S1" id="S1" value="Save"></table></body></html>';         
          document.getElementsByClassName('grid_8 pull_8')[0].style="display: none";
          document.getElementsByClassName('grid_8 push_8')[0].style="display: none";
          document.getElementById('loginbutton').addEventListener('click', function(){document.getElementById('S1').click();});
          document.getElementById('S1').addEventListener('click', function(){
           setCookie("loginid",document.getElementsByClassName('loginUserId')[0].value, 1);
           setCookie("loginpass",document.getElementsByClassName('loginPassword')[0].value, 1);
           setCookie("M",document.getElementsByName('addPassengerForm:mobileNo')[0].value, 1);
           setCookie("B",document.getElementsByName('B')[0].value, 1);
           setCookie("P0",document.getElementsByName('addPassengerForm:psdetail:0:psgnName')[0].value, 1);
           setCookie("A0",document.getElementsByName('addPassengerForm:psdetail:0:psgnAge')[0].value, 1);
           setCookie("S0",document.getElementsByName('addPassengerForm:psdetail:0:psgnGender')[0].value, 1);
           setCookie("B0",document.getElementsByName('addPassengerForm:psdetail:0:berthChoice')[0].value, 1);
           setCookie("P1",document.getElementsByName('addPassengerForm:psdetail:1:psgnName')[0].value, 1);
           setCookie("A1",document.getElementsByName('addPassengerForm:psdetail:1:psgnAge')[0].value, 1);
           setCookie("S1",document.getElementsByName('addPassengerForm:psdetail:1:psgnGender')[0].value, 1);
           setCookie("B1",document.getElementsByName('addPassengerForm:psdetail:1:berthChoice')[0].value, 1);
           setCookie("P2",document.getElementsByName('addPassengerForm:psdetail:2:psgnName')[0].value, 1);
           setCookie("A2",document.getElementsByName('addPassengerForm:psdetail:2:psgnAge')[0].value, 1);
           setCookie("S2",document.getElementsByName('addPassengerForm:psdetail:2:psgnGender')[0].value, 1);
           setCookie("B2",document.getElementsByName('addPassengerForm:psdetail:2:berthChoice')[0].value, 1);
           setCookie("P3",document.getElementsByName('addPassengerForm:psdetail:3:psgnName')[0].value, 1);
           setCookie("A3",document.getElementsByName('addPassengerForm:psdetail:3:psgnAge')[0].value, 1);
           setCookie("S3",document.getElementsByName('addPassengerForm:psdetail:3:psgnGender')[0].value, 1);
           setCookie("B3",document.getElementsByName('addPassengerForm:psdetail:3:berthChoice')[0].value, 1);
           setCookie("P4",document.getElementsByName('addPassengerForm:psdetail:4:psgnName')[0].value, 1);
           setCookie("A4",document.getElementsByName('addPassengerForm:psdetail:4:psgnAge')[0].value, 1);
           setCookie("S4",document.getElementsByName('addPassengerForm:psdetail:4:psgnGender')[0].value, 1);
           setCookie("B4",document.getElementsByName('addPassengerForm:psdetail:4:berthChoice')[0].value, 1);
           setCookie("P5",document.getElementsByName('addPassengerForm:psdetail:5:psgnName')[0].value, 1);
           setCookie("A5",document.getElementsByName('addPassengerForm:psdetail:5:psgnAge')[0].value, 1);
           setCookie("S5",document.getElementsByName('addPassengerForm:psdetail:5:psgnGender')[0].value, 1);
           setCookie("B5",document.getElementsByName('addPassengerForm:psdetail:5:berthChoice')[0].value, 1);
           setCookie("train",document.getElementById('favJourney:trnNumber').value, 1);
           setCookie("form1",document.getElementById('jpform:fromStation').value, 1);
           setCookie("to1",document.getElementById('jpform:toStation').value, 1);
           setCookie("cls",document.getElementById('favJourney:classFav').value, 1);
           setCookie("cty",document.getElementById('favJourney:quotaFav').value, 1);
           setCookie("da",document.getElementById('jpform:journeyDateInputDate').value, 1);
           setCookie("con",document.getElementById('con').value, 1);
           setCookie("bank",document.getElementById('bank').value, 1);
             setCookie("bt",document.getElementById('bt').value, 1);
           });
           document.getElementById('C1').addEventListener('click', function(){
           setCookie("P0",document.getElementsByName('addPassengerForm:psdetail:0:psgnName')[0].value, -1);
           setCookie("A0",document.getElementsByName('addPassengerForm:psdetail:0:psgnAge')[0].value, -1);
           setCookie("S0",document.getElementsByName('addPassengerForm:psdetail:0:psgnGender')[0].value, -1);
           setCookie("B0",document.getElementsByName('addPassengerForm:psdetail:0:berthChoice')[0].value, -1);
           setCookie("P1",document.getElementsByName('addPassengerForm:psdetail:1:psgnName')[0].value, -1);
           setCookie("A1",document.getElementsByName('addPassengerForm:psdetail:1:psgnAge')[0].value, -1);
           setCookie("S1",document.getElementsByName('addPassengerForm:psdetail:1:psgnGender')[0].value, -1);
           setCookie("B1",document.getElementsByName('addPassengerForm:psdetail:1:berthChoice')[0].value, -1);
           setCookie("P2",document.getElementsByName('addPassengerForm:psdetail:2:psgnName')[0].value, -1);
           setCookie("A2",document.getElementsByName('addPassengerForm:psdetail:2:psgnAge')[0].value, -1);
           setCookie("S2",document.getElementsByName('addPassengerForm:psdetail:2:psgnGender')[0].value, -1);
           setCookie("B2",document.getElementsByName('addPassengerForm:psdetail:2:berthChoice')[0].value, -1);
           setCookie("P3",document.getElementsByName('addPassengerForm:psdetail:3:psgnName')[0].value, -1);
           setCookie("A3",document.getElementsByName('addPassengerForm:psdetail:3:psgnAge')[0].value, -1);
           setCookie("S3",document.getElementsByName('addPassengerForm:psdetail:3:psgnGender')[0].value, -1);
           setCookie("B3",document.getElementsByName('addPassengerForm:psdetail:3:berthChoice')[0].value, -1);
           setCookie("P4",document.getElementsByName('addPassengerForm:psdetail:4:psgnName')[0].value, -1);
           setCookie("A4",document.getElementsByName('addPassengerForm:psdetail:4:psgnAge')[0].value, -1);
           setCookie("S4",document.getElementsByName('addPassengerForm:psdetail:4:psgnGender')[0].value, -1);
           setCookie("B4",document.getElementsByName('addPassengerForm:psdetail:4:berthChoice')[0].value, -1);
           setCookie("P5",document.getElementsByName('addPassengerForm:psdetail:5:psgnName')[0].value, -1);
           setCookie("A5",document.getElementsByName('addPassengerForm:psdetail:5:psgnAge')[0].value, -1);
           setCookie("S5",document.getElementsByName('addPassengerForm:psdetail:5:psgnGender')[0].value, -1);
           setCookie("B5",document.getElementsByName('addPassengerForm:psdetail:5:berthChoice')[0].value, -1);
             login();
           });
           document.getElementById('D1').addEventListener('click', function(){if(getCookie("P0")){
           document.getElementsByName('addPassengerForm:mobileNo')[0].value = getCookie("M");
           document.getElementsByName('B')[0].value = getCookie("B");
           document.getElementsByName('addPassengerForm:psdetail:0:psgnName')[0].value = getCookie("P0");
           document.getElementsByName('addPassengerForm:psdetail:0:psgnAge')[0].value = getCookie("A0");
           document.getElementsByName('addPassengerForm:psdetail:0:psgnGender')[0].value = getCookie("S0");
           document.getElementsByName('addPassengerForm:psdetail:0:berthChoice')[0].value = getCookie("B0");
           document.getElementsByName('addPassengerForm:psdetail:1:psgnName')[0].value = getCookie("P1");
           document.getElementsByName('addPassengerForm:psdetail:1:psgnAge')[0].value = getCookie("A1");
           document.getElementsByName('addPassengerForm:psdetail:1:psgnGender')[0].value = getCookie("S1");
           document.getElementsByName('addPassengerForm:psdetail:1:berthChoice')[0].value = getCookie("B1");
           document.getElementsByName('addPassengerForm:psdetail:2:psgnName')[0].value = getCookie("P2");
           document.getElementsByName('addPassengerForm:psdetail:2:psgnAge')[0].value = getCookie("A2");
           document.getElementsByName('addPassengerForm:psdetail:2:psgnGender')[0].value = getCookie("S2");
           document.getElementsByName('addPassengerForm:psdetail:2:berthChoice')[0].value = getCookie("B2");
           document.getElementsByName('addPassengerForm:psdetail:3:psgnName')[0].value = getCookie("P3");
           document.getElementsByName('addPassengerForm:psdetail:3:psgnAge')[0].value = getCookie("A3");
           document.getElementsByName('addPassengerForm:psdetail:3:psgnGender')[0].value = getCookie("S3");
           document.getElementsByName('addPassengerForm:psdetail:3:berthChoice')[0].value = getCookie("B3");
           document.getElementsByName('addPassengerForm:psdetail:4:psgnName')[0].value = getCookie("P4");
           document.getElementsByName('addPassengerForm:psdetail:4:psgnAge')[0].value = getCookie("A4");
           document.getElementsByName('addPassengerForm:psdetail:4:psgnGender')[0].value = getCookie("S4");
           document.getElementsByName('addPassengerForm:psdetail:4:berthChoice')[0].value = getCookie("B4");
           document.getElementsByName('addPassengerForm:psdetail:5:psgnName')[0].value = getCookie("P5");
           document.getElementsByName('addPassengerForm:psdetail:5:psgnAge')[0].value = getCookie("A5");
           document.getElementsByName('addPassengerForm:psdetail:5:psgnGender')[0].value = getCookie("S5");
           document.getElementsByName('addPassengerForm:psdetail:5:berthChoice')[0].value = getCookie("B5");
           document.getElementById('favJourney:trnNumber').value=getCookie("train");
           document.getElementById('jpform:fromStation').value=getCookie("form1");
           document.getElementById('jpform:toStation').value=getCookie("to1");
           document.getElementById('favJourney:classFav').value=getCookie("cls");
           document.getElementById('favJourney:quotaFav').value=getCookie("cty");
           document.getElementById('jpform:journeyDateInputDate').value=getCookie("da");
           document.getElementsByName('con')[0].value=getCookie("con");
           document.getElementsByName('bank')[0].value=getCookie("bank");
             document.getElementsByName('bt')[0].value=getCookie("bt");
             document.getElementById("cimage").style.height="70px";
             document.getElementsByName("j_captcha")[0].style="FONT:bold 25px arial; width:4em;color:#FF0000;"
             var mo = getCookie("M"); var mob=mo.length;if(mob!=10){
              document.getElementsByName("addPassengerForm:mobileNo")[0].style="color:#FF0000;"
             document.getElementsByName('addPassengerForm:mobileNo')[0].value ="7398767611"}
           }});
           document.getElementById('D1').click();
            if(getCookie("loginid")){
            document.getElementsByClassName('loginUserId')[0].value = getCookie("loginid");
            document.getElementsByClassName('loginPassword')[0].value = getCookie("loginpass");
            document.getElementsByClassName('loginCaptcha')[0].focus();
             }}
             if(document.URL.match('eticketing/logout')){window.location.assign("https://www.irctc.co.in/eticketing/loginHome.jsf")}
             if(document.getElementsByClassName('loginUserId'))login();