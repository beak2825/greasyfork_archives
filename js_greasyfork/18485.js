// ==UserScript==
// @name        PLAN anand
// @namespace   ANAND KUMAR
// @include     https://www.irctc.co.in/*
// @version     2.6
// @description NAVODAY COMPUTER 9794115696
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18485/PLAN%20anand.user.js
// @updateURL https://update.greasyfork.org/scripts/18485/PLAN%20anand.meta.js
// ==/UserScript==
 if(document.getElementById('quickbookTab:content')){
var qr=getCookie("cty");
             $(document).ready(function(){
             var qu = document.getElementsByName('quota');
              for (var i = 0; i < qu.length; i++) {
              pg=qu[i].value
               switch (pg) {
                case qr:
                var elements = document.getElementsByName('quota');
               elements[i].click(checked = true);
             break;
              }}});
             DateArr = new Array(),
            date1 = new Date();
             var n = date1.getTime();
             var rn= n+60000;
            DateArr['hours'] = date1.getHours();
            DateArr['minutes'] = date1.getMinutes().toString();
            var as = document.getElementById('bluemenu');
            as.style="border:2px solid blue;width:auto;height:auto;overflow:auto"
            as.innerHTML = '<table id="pn"><td><input type="text" name="cno" id="cno"size="5" maxlength="5"><td><input type="text"name="cfor"id="cfor"size="5" maxlength="5"><td><input type="text"name="cto"id="cto"size="5" maxlength="5"><td><input type="text"name="cdt"id="cd"size="10" maxlength="10"><td><input type="text"name="cls"id="cls"size="2" maxlength="2"><td><select class="txtfld" name="cty"><option value="GN">General</option><option value="PT">Premium</option><option value="HP">Handicap</option><option value="LD">Ladies</option><option value="CK">Tatkal</option></select><td><input type="button"name="qut3"id="qut3"value="Book"><td><select class="txtfld" name="con"><option value="Y">Yes</option><option value="N">No</option><option value="PY">Pay</option></select><td></td></table>'
            document.getElementById("jpform:jpsubmit").addEventListener('click', function () {
            setCookie("form1",document.getElementById('jpform:fromStation').value,1);
            setCookie("to1",document.getElementById('jpform:toStation').value,1);
            setCookie("da",document.getElementById('jpform:journeyDateInputDate').value,1);
            setCookie("cty",document.getElementsByName('cty')[0].value,1);
            setCookie("con",document.getElementsByName('con')[0].value,1);});
             
            document.getElementById('jpform:flexiDateId').checked="checked";
            document.getElementsByName('cfor')[0].value =getCookie("from");
            document.getElementsByName('cto')[0].value =getCookie("to");
            document.getElementsByName('cls')[0].value=getCookie("cls");
            document.getElementsByName('cty')[0].value=getCookie("cty")
            document.getElementsByName('cdt')[0].value =getCookie("da");
            document.getElementById('jpform:fromStation').value=getCookie("form1");
            document.getElementById('jpform:toStation').value=getCookie("to1");
            document.getElementById('jpform:journeyDateInputDate').value=getCookie("da");
            document.getElementsByName('con')[0].value=getCookie("con")
            var con =getCookie("con");
            if (document.getElementById('contentformid1')&& (con=="Y"||con=="PY") )//&& DateArr['minutes'] >= 50
            { document.getElementById('jpform:jpsubmit').click();}
            if(getCookie("cty")){var cty=getCookie("cty")}
             train=getCookie("train"); cls=getCookie("cls");da=getCookie("da");from=getCookie("from");to=getCookie("to");
            trainid ="cllink-"+train+"-"+cls
             dq=document.querySelector('[id^=\''+trainid+'\']');
             document.getElementById('oyo_hotels_add').style="display: none;"
             document.getElementById('bbc_widget').style="font-size: 20px; font-weight: bold; font-style: normal; font-variant: normal; color: red; text-align: center"
         
    function book(){
            if(getCookie("cty")){var cty=getCookie("cty");
              if (document.getElementById('refid1') && document.getElementById('avlAndFareForm:quota').value !=cty) {
                  setCookie("cty",document.getElementById('avlAndFareForm:quota').value,1)}}
             if(getCookie("from") != document.getElementById('avlAndFareForm:fromStation').value && document.getElementById('avlAndFareForm:fromStation').value !="" || getCookie("to") != document.getElementById('avlAndFareForm:toStation').value && document.getElementById('avlAndFareForm:toStation').value !="" || getCookie("train") != document.getElementById('avlAndFareForm:trainNumber').value && document.getElementById('avlAndFareForm:trainNumber').value !="" || getCookie("cls")!=document.getElementById('avlAndFareForm:journeyClass').value && document.getElementById('avlAndFareForm:journeyClass').value!="")
             { setCookie("cls",document.getElementById('avlAndFareForm:journeyClass').value, 1);
             setCookie("train",document.getElementById('avlAndFareForm:trainNumber').value, 1);             
             setCookie("from",document.getElementById('avlAndFareForm:fromStation').value,1)            
             setCookie("to",document.getElementById('avlAndFareForm:toStation').value,1)}
             document.getElementsByName('cls')[0].value=getCookie("cls");
             document.getElementsByName('cno')[0].value =getCookie("train");
             document.getElementsByName('cfor')[0].value =getCookie("from");
             document.getElementsByName('cto')[0].value =getCookie("to");
             document.getElementsByName('cdt')[0].value =getCookie("da");
             from=getCookie("from");to=getCookie("to");
             document.getElementById('qut3').addEventListener('click', function () {cty=getCookie("cty"); jpBook(this, train, from, to, da, cls, cty, 1,false);return false });
            if (document.getElementById('refid1')) {var bid = train+"-"+cls+"-"+cty+"-0"};
             if (document.getElementById('avlAndFareForm:cc').value == "false" && DateArr['minutes'] <= 49  && dq && (con=="Y"||con=="PY"))
             {dq.click();} else {if(document.getElementById('c1')){if (document.getElementById(bid) && (con=="Y"||con=="PY")){ document.getElementById('qut3').click(); return false }
            else { if ((DateArr['minutes'] <= 0) && (con=="Y"||con=="PY")){ document.getElementById('jpform:jpsubmit').click(); return false }}}
             }}
function clock(){ 
            rn=n+60000
            DateArr = new Array();
            date = new Date();
            rnr = date.getTime();
            DateArr['hours'] = date.getHours();
            DateArr['minutes'] = date.getMinutes().toString();
            DateArr['seconds'] = date.getSeconds().toString();
            document.getElementById('bbc_widget').innerHTML ="CurrentTime:"+date.toLocaleTimeString()+":---------:RunTime :"+ date1.toLocaleTimeString();
            if(rn<=rnr && DateArr['minutes'] != 59 && DateArr['minutes'] != 0){document.getElementById('jpform:jpsubmit').click(); return false}
             book();
             window.setTimeout(clock, 1000);
             }
           clock();}