// ==UserScript==
// @name         Pt View New Panel
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Makes stuff happen
// @author       You
// @include        **
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396804/Pt%20View%20New%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/396804/Pt%20View%20New%20Panel.meta.js
// ==/UserScript==
function execute(){
var min=document.getElementsByName("PttMinutes")[0];
var hr=document.getElementsByName("PttHours")[0];
var action=document.getElementById("Action");
min.style.cssText="visibility:hidden";
hr.style.cssText="visibility:hidden";
action.style.cssText="position:absolute;top:131px;left:46px;";
// Create body
var divbody=document.createElement("div");
divbody.id="bd1"
divbody.style.cssText="line-height:170%;white-space:pre-wrap;border-radius:3px;border-style:solid;border-color:#01768b;border-width:1px;position:relative;left:0px;top:-645px;width:364px;height:160px;background:white;color:black"
document.getElementById("ticketdetailscontainer").appendChild(divbody);
divbody.appendChild(hr);
divbody.appendChild(min);

var tool= document.createElement("div");
tool.style.cssText="line-height:23px;border-width:1px;border-style:solid;border-color:black;position:absolute;width:310px;height:20px;left:30px;top:6px;background:#01768b;color:white;font-weight:bold;font-size:17px;font-family:Sans-Serif;white-space:pre-wrap;border-radius:3px";
tool.innerText=" Affected by a Tool Error"
divbody.appendChild(tool);
divbody.appendChild(action);
var doubt= document.createElement("div");
doubt.style.cssText="line-height: 23px;border-width:1px;border-style:solid;border-color:black;position:absolute;width:310px;height:20px;left:30px;top:33px;background:#01768b;color:white;font-weight:bold;font-size:17px;font-family:Sans-Serif;white-space:pre-wrap;border-radius:3px";
doubt.innerText=" A Doubt ticket was raised"
divbody.appendChild(doubt);
var notap= document.createElement("div");
notap.style.cssText="line-height: 23px;border-width:1px;border-style:solid;border-color:black;position:absolute;width:310px;height:20px;left:30px;top:60px;background:#01768b;color:white;font-weight:bold;font-size:17px;font-family:Sans-Serif;white-space:pre-wrap;border-radius:3px";
notap.innerText=" No issues"
divbody.appendChild(notap);

//time and status
var time=document.createElement("div");
time.style.cssText="position:absolute;top:96px;left:2px;height:20px;width:40px";
time.innerText="Time:"
divbody.appendChild(time);

var stats=document.createElement("div");
stats.style.cssText="position:absolute;top:126px;left:2px;height:20px;width:40px";
stats.innerText="Status:"
divbody.appendChild(stats);

//Update button
var button=document.createElement("input");
button.value="Update";
button.type="submit"
button.style.cssText="position:absolute;top:129px;left:302px;border-radius:4px;background:#01768b;color:white";
divbody.appendChild(button);


//Doubt Button
var doubtb=document.createElement("input");
doubtb.id="submit-doubt";
doubtb.value="Open Doubt";
doubtb.type="button";
doubtb.style.cssText="background:#01768b;border-radius:4px;position:absolute;top:96px;left:273px;color:white";
divbody.appendChild(doubtb);

//Create checkboxes
var c1=document.createElement("input");
c1.type="checkbox";
c1.style.cssText="width:20px;position:absolute;height:20px;left:2px;top:4px"
c1.checked=false;
divbody.appendChild(c1);
var c2=document.createElement("input");
c2.type="checkbox";
c2.style.cssText="width:20px;position:absolute;height:20px;left:2px;top:32px"
c2.checked=false;
divbody.appendChild(c2);
var c3=document.createElement("input");
c3.type="checkbox";
c3.style.cssText="width:20px;position:absolute;height:20px;left:2px;top:58px"
c3.checked=false;
divbody.appendChild(c3);

//Checkbox functions
c1.onclick=function(){if (c1.checked == true){
document.getElementById("PrtRank").value="45";
min.style.cssText="position:absolute;top:100px;left:93px;visibility:visible";
hr.style.cssText="position:absolute;top:100px;left:46px;visibility:visible";
c2.disabled=true;c3.disabled=true}
else
{document.getElementById("PrtRank").value="0";
min.style.cssText="visibility:hidden";
min.value="";
hr.style.cssText="visibility:hidden";
hr.value="";
c2.disabled=false;c3.disabled=false};};

c2.onclick=function(){if (c2.checked == true){
document.getElementById("PrtRank").value="32";
min.style.cssText="position:absolute;top:100px;left:93px;visibility:visible";
hr.style.cssText="position:absolute;top:100px;left:46px;visibility:visible";
c1.disabled=true;c3.disabled=true}
else
{document.getElementById("PrtRank").value="0";
min.style.cssText="visibility:hidden";
min.value="";
hr.style.cssText="visibility:hidden";
hr.value="";
c1.disabled=false;c3.disabled=false}};

c3.onclick=function(){if (c3.checked == true){
min.style.cssText="position:absolute;top:100px;left:93px;visibility:visible";
hr.style.cssText="position:absolute;top:100px;left:46px;visibility:visible";
c1.disabled=true;c2.disabled=true}
else
{min.style.cssText="visibility:hidden";
min.value="";
hr.style.cssText="visibility:hidden";
hr.value="";
c1.disabled=false;c2.disabled=false}};

//create Tooltip
var tooltip1= document.createElement("div");
tooltip1.innerText="Click one of the checkboxes to unlock Time Log and complete the ticket"
divbody.appendChild(tooltip1);
var tooltip= document.createElement("div");
tooltip1.appendChild(tooltip);
tooltip1.style.visibility="hidden";
tooltip.style.visibility="hidden";
//Tooltip action
function hidetip(){
tooltip1.style.visibility="hidden";
tooltip.style.visibility="hidden";};
function showtip(){
tooltip1.style.cssText="opacity:0.7;text-align:center;white-space:pre-wrap;position:absolute;top:-60px;left:1px;border-radius:4px;height:50px;width:300px;background:black;color:white";
tooltip.style.cssText="opacity:0.9;position:absolute;top:50px;left:35px;margin-left:-8px;width:0;height:0;border-top:8px solid black;border-right:8px solid transparent;border-left:8px solid transparent";};
c1.onmouseover=showtip;
c2.onmouseover=showtip;
c3.onmouseover=showtip;
c1.onmouseout=hidetip;
c2.onmouseout=hidetip;
c3.onmouseout=hidetip;

//Clean Page//Hide elements
var container=document.getElementById("ticketdetailscontainer");
var table=container.querySelectorAll("table")[1];
table.querySelectorAll("td")[0].style.display="none";
table.querySelectorAll("td")[1].style.display="none";
table.querySelectorAll("td")[20].style.display="none";
table.querySelectorAll("td")[21].style.display="none";
table.querySelectorAll("td")[22].style.display="none";
table.querySelectorAll("td")[23].style.display="none";
table.querySelectorAll("td")[24].style.display="none";
table.querySelectorAll("td")[25].style.display="none";
table.querySelectorAll("td")[26].style.display="none";
table.querySelectorAll("td")[27].style.display="none";
table.querySelectorAll("td")[28].style.display="none";
table.querySelectorAll("td")[29].style.display="none";
table.querySelectorAll("td")[34].style.display="none";
table.querySelectorAll("td")[35].style.display="none";
table.querySelectorAll("td")[36].style.display="none";
table.querySelectorAll("td")[37].style.display="none";
table.querySelectorAll("td")[38].style.visibility="hidden";
table.querySelectorAll("td")[39].style.visibility="hidden";
table.style.cssText="position:absolute;left:940px;top:400px";
table.style.cssText="position:relative;top:170px";
document.getElementsByClassName("button-emphasized")[0].style.display="none";
document.getElementsByClassName("button-emphasized")[1].style.display="none";
};
var category=document.getElementById("js-category").value
if (category=="1851"){execute()}//class updates
else if
(category=="1857"){execute()}//collection updates
else if
(category=="1859"){execute()}//create new sku
else if
(category=="1852"){execute()}//description
else if
(category=="2210"){execute()}//emergency takedown
else if
(category=="1855"){execute()}//kits
else if
(category=="1856"){execute()}//manufacturer updates
else if
(category=="1870"){execute()}//media
else if
(category=="1860"){execute()}//option joins and sku setup
else if
(category=="1864"){execute()}//other
else if
(category=="1866"){execute()}//related items
else if
(category=="1854"){execute()}//status fulfillment critical
else if
(category=="1853"){execute()}//update schema