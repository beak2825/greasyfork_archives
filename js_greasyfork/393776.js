// ==UserScript==
// @name         Assistant Demo
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description
// @author       Marian Danilencu
// @include        *admin.wayfair.com/v/part_data/manage_part_numbers*
// @grant        none
// @grant        GM_addStyle
// @description demo
// @downloadURL https://update.greasyfork.org/scripts/393776/Assistant%20Demo.user.js
// @updateURL https://update.greasyfork.org/scripts/393776/Assistant%20Demo.meta.js
// ==/UserScript==
//Checkboxex******************************************************************
var cbox=document.createElement("input");
cbox.type="button";
var cbox1=document.createElement("input");
cbox1.type="button";
var cbox2=document.createElement("input");
cbox2.type="button";
var cbox3=document.createElement("input");
cbox3.type="button";
var cbox4=document.createElement("input");
cbox4.type="button";
var cbox5=document.createElement("input");
cbox5.type="button";
var cbox6=document.createElement("input");
cbox6.type="button";
var cbox7=document.createElement("input");
cbox7.type="button";
// Steps*********************************

var s=document.createTextNode("p");
var s1=document.createElement("p");
var s2=document.createElement("p");
var s3=document.createElement("p");
var s4=document.createElement("p");
var s5=document.createElement("p");
var s6=document.createElement("p");
var s7=document.createElement("p");
var s8=document.createElement("p");
var s9=document.createElement("p");
var s10=document.createElement("p");
var s11=document.createElement("p");

//Instructions text
s.innerHTML="     Missing jjid's\n";
s1.innerHTML = "     Multiple RefProdId's associated to one ManuProdId\n";
s2.innerHTML = "     I can't find the Existing Part numbers in CQB\n";
s3.innerHTML = "     Author says refprodid's are wrong but they look fine and correctly associated\n";
s4.innerHTML = "     My error wasn't fixed or isn't listed \n";
s5.innerHTML = "     step6\n";

//Tips text
s6.innerHTML = "    -step7\n";
s7.innerHTML = "    -step8\n";
s8.innerHTML = "    -step9\n";
s9.innerHTML = "    -step10\n";
s10.innerHTML = "    -step11\n";
s11.innerHTML = "    -step12\n";




//Help Button**************************
var x = document.createElement("IFRAME");
var action = document.createElement("button");
action.innerHTML="Need Help❓";
action.style.cssText="color:white;background-color:#023e62;border-radius:6px;width:95px;height:40px;position:absolute;top:60px;left:12px"
var interval=setInterval(function(){
setTimeout(function(){action.style.cssText="color:white;background-color:#023e62;border-radius:6px;transition:top 0.4s,height 0.2s;width:95px;height:20px;position:absolute;top:45px;left:12px";setTimeout(function(){action.style.cssText="color:white;background-color:#023e62;border-radius:6px;transition:top 0.2s,height 0.2s;width:95px;height:40px;position:absolute;top:60px;left:12px"},300)},300);
},2000)
document.body.appendChild(action);
action.onclick=function(){
clearInterval(interval);
//main Panel*******************************************************************
var mousePosition;
var offset = [0,0];
var isDown = false;
var view = document.getElementById("body");
var div = document.createElement("div");
div.style.cssText = "position:absolute;left:8px;top:180px;width:600px;height:201px;background:AliceBlue;color:black;border-color:#023e62;border-width:1px;border-style:solid;border-radius:10px";
document.body.appendChild(div);
div.addEventListener('mousedown', function(e) {isDown = true;offset = [div.offsetLeft - e.clientX,div.offsetTop - e.clientY];}, true);
document.addEventListener('mouseup', function() {isDown = false;}, true);
document.addEventListener('mousemove', function(event) {event.preventDefault();
if (isDown) {mousePosition = {x : event.clientX,y : event.clientY};div.style.left = (mousePosition.x + offset[0]) + 'px';div.style.top = (mousePosition.y + offset[1]) + 'px';}}, true);



//Functions**************************************************
var fixerror=function(){
div6.style.cssText="font-weight: bold;font-size:12px;transition:height 0.1s,width 0.2s;border-radius:4px;position:absolute;white-space:pre-wrap;left:190px;top:27px;width:385px;height:150px;background:white;color:black;border-color:#023e62;border-width:1px;border-style:solid;display:block"
div6.innerHTML="";
setTimeout(function() {
div6.innerHTML=[s.innerHTML+s1.innerHTML+s2.innerHTML+s3.innerHTML+s4.innerHTML];
cbox.style.cssText="border-right-width:0px;padding:0px;margin:0;width:0;height:0;border-top:7px solid transparent;border-left: 12px solid #023e62;border-bottom:7px solid transparent;background-color:white;position:absolute;display:block;left:2px;top:4px;";
div6.appendChild(cbox);
cbox.onclick= missingjjid;
cbox1.style.cssText="border-right-width:0px;padding:0px;margin:0;width:0;height:0;border-top:7px solid transparent;border-left: 12px solid #023e62;border-bottom:7px solid transparent;background-color:white;position:absolute;display:block;left:2px;top:28px";
div6.appendChild(cbox1);
cbox2.style.cssText="border-right-width:0px;padding:0px;margin:0;width:0;height:0;border-top:7px solid transparent;border-left: 12px solid #023e62;border-bottom:7px solid transparent;background-color:white;position:absolute;display:block;left:2px;top:51px";
div6.appendChild(cbox2);
cbox3.style.cssText="border-right-width:0px;padding:0px;margin:0;width:0;height:0;border-top:7px solid transparent;border-left: 12px solid #023e62;border-bottom:7px solid transparent;background-color:white;position:absolute;display:block;left:2px;top:77px";
div6.appendChild(cbox3);
cbox5.style.cssText="border-right-width:0px;padding:0px;margin:0;width:0;height:0;border-top:7px solid transparent;border-left: 12px solid #023e62;border-bottom:7px solid transparent;background-color:white;position:absolute;display:block;left:2px;top:124px";
div6.appendChild(cbox5);
}, 100);};


var missingjjid=function(){
div6.innerHTML="";
setTimeout(function() {
div6.style.cssText="overflow:auto;line-height:1.4;font-weight:600;font-size:14px;transition:height 0.1s,width 0.1s;border-radius:4px;position:absolute;white-space:pre-wrap;left:190px;top:27px;width:390px;height:160px;background:white;color:black;border-color:#023e62;border-width:1px;border-style:solid;display:block"
div6.innerHTML="If Part Updater returns an error report via email saying that you are missing jjid's you need to add the jjids from the error report to your template. Just follow these steps:\n\n1. (in excel)Select the text in the first error cell up to the first bracket([) and copy it \n2. Select the entire column that contains the errors and press Ctrl+F\n3. Go to Find & Replace, paste the text in the Find field and click Replace All\n4. Put ] in the replace field and click Replace All again\n5. Done. Now just add the new jjid's and their part numbers to your template and re-upload in Part Updater";
;}, 100);
;};


// Panel Header***************************************************************
var div2 = document.createElement("div2");
div2.innerHTML="    HI,THIS IS YOUR PERSONAL TRAINER";
div2.style.cssText = "white-space:pre-wrap;position:absolute;border-radius:10px 10px 0px 0px;left:-1px;top:-3px;width:600px;height:26px;background-color:#023e62;color:white;border-width:1px;border-style:solid;border-color:#023e62";
div.appendChild(div2);
// Options********************************************************************
var div3 = document.createElement("div3");
div3.innerHTML=" Instructions";
div3.style.cssText = "white-space:pre-wrap;border-radius:3px;border-style:solid;border-color:023e62;border-width:1px;position:absolute;left:4px;top:49px;width:140px;height:23px;background:white;color:black";
div.appendChild(div3);


var div4 = document.createElement("div4");
div4.innerHTML=" Fix Errors";
div4.style.cssText = "white-space:pre-wrap;border-radius:3px;border-style:solid;border-color:023e62;border-width:1px;position:absolute;left:4px;top:79px;width:140px;height:23px;background:white;color:black";


div.appendChild(div4);

var div5 = document.createElement("div5");
div5.innerHTML=" Tips & Tricks";
div5.style.cssText = "white-space:pre-wrap;border-radius:3px;border-style:solid;border-color:023e62;border-width:1px;position:absolute;left:4px;top:109px;width:140px;height:23px;background:white;color:black";
div.appendChild(div5);



//Info display content*********************************************************
var div6 = document.createElement("div6");
div6.style.cssText="border-radius:4px;position:absolute;white-space:pre-wrap;left:270px;top:27px;width:325px;height:170px;background:white;color:black;border-color:#023e62;border-width:1px;border-style:solid;display:none"

div.appendChild(div6)

var link = document.createElement('a');
link.style.cssText = "position:absolute;left:38px;top:56px;background-color:white;display:none";

//Buttons*********************************************************************


//Instructions button*********************************************************
var button2 = document.createElement("button");
button2.innerHTML = "➦";
button2.style.cssText = "padding-top:3px;color:#023e62;border-radius:3px;position:absolute;left:150px;top:50px;border-style:solid;border-color:black;border-width:1px;background:#ff9f0e";
div.appendChild(button2);
button2.onclick= function(){
div6.innerHTML="";
setTimeout(function() {
div6.style.cssText="transition:height 0.1s,width 0.1s;border-radius:4px;position:absolute;white-space:pre-wrap;left:190px;top:27px;width:325px;height:100px;background:white;color:black;border-color:#023e62;border-width:1px;border-style:solid;display:block"
div6.innerHTML="-step1\n-step2\n-step3\n-go to                 to continue";
link.style.display="block";
link.textContent = 'w3school';
link.href = 'https://www.w3schools.com/colors/colors_groups.asp'
div6.appendChild(link);}, 100);
;};

//Fix errors button*********************************************************
var button3 = document.createElement("button");
button3.innerHTML = "➦";
button3.style.cssText = "color:#023e62;border-radius:3px;position:absolute;left:150px;top:80px;border-style:solid;border-color:black;border-width:1px;background:#ff9f0e";
div.appendChild(button3);

button3.onclick= fixerror;

//Tips& Tricks button
var button4 = document.createElement("button");
button4.innerHTML = "➦";
button4.style.cssText = "color:#023e62;border-radius:3px;position:absolute;left:150px;top:110px;border-style:solid;border-color:black;border-width:1px;background-color:#ff9f0e";

div.appendChild(button4);
button4.onclick= function(){
div6.innerHTML="";


setTimeout(function() {div6.innerHTML="-step1\n-step2\n-step3\n-step4\n-step5"
div6.style.cssText="transition:height 0.1s,width 0.2s;border-radius:4px;position:absolute;white-space:pre-wrap;left:190px;top:27px;width:385px;height:170px;background:white;color:black;border-color:#023e62;border-width:1px;border-style:solid;display:block"
x.setAttribute("src", "https://delimiters.co");
x.style.cssText="border-radius:4px;position:absolute;width:250px;height:160px;left:120px;top:3px";
div6.appendChild(x);
 ;}, 100);


};

//close window button**********************************************************
var button = document.createElement("button");
button.innerHTML = "❎";
button.style.cssText = "border-style:none;border-radius:100px;position:absolute;left:570px;top:1px;background:#023e62;";
div2.appendChild(button);
button.addEventListener ("click", function() {
  div.style.display = "none";
});
}
//if (checkBox.checked == true){
//    text.style.display = "block";
// } else {
//    text.style.display = "none";
// }

