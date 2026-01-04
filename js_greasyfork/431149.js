// ==UserScript==
// @name         ZCalcRunningTime
// @namespace    AaronLong
// @version      1.0
// @description  CalcOnGoingTime on SNOW
// @author       AaronLong
// @match        https://sap.service-now.com/*
// @match        https://test.itsm.services.sap/*
// @match        https://itsm.services.sap/*
// @icon         https://www.google.com/s2/favicons?domain=services.sap
// @downloadURL https://update.greasyfork.org/scripts/431149/ZCalcRunningTime.user.js
// @updateURL https://update.greasyfork.org/scripts/431149/ZCalcRunningTime.meta.js
// ==/UserScript==

 (function() {
     'use strict';
 
 function addButton(text, onclickAtt,clickFuncContent,cssObj) {
     cssObj = cssObj || {fontWeight: '600', fontSize: '14px', backgroundColor: '#0078D7', color: 'white', border: 'none', padding: '10px 20px', };
     let div = document.createElement('div');
     let button = document.createElement('button'), btnStyle = button.style	; 
     let click_att = document.createAttribute("onclick");       // Create a "class" attribute
     click_att.value = onclickAtt;
     button.setAttributeNode(click_att);                      
     button.innerHTML = text;
     Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key]);
     let scriptlet = document.createElement('Script');
     let src_code = document.createTextNode(clickFuncContent);
     scriptlet.appendChild(src_code);
     document.body.appendChild(div).appendChild(button);
     document.body.appendChild(scriptlet);
     return button;
 }
var getCurrentTimeGapIn_D_H_M='function getCurrentTimeGapIn_D_H_M(fdatetime){ splitDTime = fdatetime.split(" "); spDate = splitDTime[0].split("-"); oYear = spDate[0]; oMonth = spDate[1]-1; oDay = spDate[2]; spTime = splitDTime[1].split(":"); oHour = spTime[0]; oMinute = spTime[1]; oSecond = spTime[2]; var dueDTime = new Date(oYear, oMonth, oDay, oHour, oMinute, oSecond); var currMills = new Date().valueOf(); minsGap = Math.round((currMills-dueDTime.valueOf())/1000/60); daysGapInt = Math.floor(minsGap/(60*24)); hoursGapInt = Math.floor(minsGap%(60*24)/60); minsGapInt = Math.floor((minsGap%(60*24))%60); gap_D_H_M = daysGapInt +" day(s)"+hoursGapInt+" hr(s)"+minsGapInt+" Mins Ago"; console.log(gap_D_H_M); return gap_D_H_M; } ';
var setUpdateTime ="function setUpdateTime(col_idx){var caseTab = document.getElementById('sn_customerservice_case_table');	var tbl=caseTab.getElementsByTagName('tbody')[0];	var trs=tbl.getElementsByTagName('tr');	for(j =0; j<trs.length; j++){	/*alert(trs[j].innerHTML);console.log(trs[j].innerHTML);*/ console.log(trs[j].getElementsByTagName('td').length);	txtValue = trs[j].getElementsByTagName('td')[col_idx].innerHTML; console.log('txtValue='+txtValue);		if(txtValue.length>=19){trs[j].getElementsByTagName('td')[col_idx].innerHTML=txtValue.substr(0,19)+\"<br><font style='background-color:#ee7a14;padding: 0px;font-weight: bold;'>\"+getCurrentTimeGapIn_D_H_M(txtValue.substr(0,19));}	}	return;}";
var updateTimeBTN = addButton('ZCalcRunningTime','setUpdateTime(30)',getCurrentTimeGapIn_D_H_M+setUpdateTime,); 
 })();