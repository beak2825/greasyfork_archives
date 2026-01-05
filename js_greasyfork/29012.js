// ==UserScript==
// @name PASSPORT
// @namespace PASSPORT APP
// @match https://portal1.passportindia.gov.in/*
// @grant none
// @version 0.0.1.20180306105911
// @description CASH
// @downloadURL https://update.greasyfork.org/scripts/29012/PASSPORT.user.js
// @updateURL https://update.greasyfork.org/scripts/29012/PASSPORT.meta.js
// ==/UserScript==
//if(document.getElementById("showSlotsByLocation_Next_key")){document.getElementById("showSlotsByLocation_Next_key").click();}
var pas=document.getElementsByClassName('Footer_Right_BRD')[3]
pas.innerHTML ='<html><body><iframe src="https://www.timeanddate.com/worldclock/fullscreen.html?n=176" height="200" width="250"></iframe></body><script type="text/javascript"></script></html>'
document.getElementById('pfcLocation').value='51';
function clock(){
            DateArr = new Array();
            date = new Date();
            rnr = date.getTime();
            DateArr['hours'] = date.getHours();
            DateArr['minutes'] = date.getMinutes().toString();
            DateArr['seconds'] = date.getSeconds().toString();
             var lap=document.getElementsByName("test123")[0].value; 
             var latp=lap.length;
            document.getElementById("showSlotsByLocation_Next_key").value=latp+'Next>>'+DateArr['hours']+':'+DateArr['minutes']+':'+DateArr['seconds'];
            if(document.getElementById("showSlotsByLocation_Next_key") && DateArr['minutes'] !=59 && DateArr['minutes'] !=4 && DateArr['seconds'] <=0 ){document.getElementById("showSlotsByLocation_Next_key").click(); return false;} 
             window.setTimeout(clock, 100);
             }
           clock();//DateArr['hours'] == 17 && 