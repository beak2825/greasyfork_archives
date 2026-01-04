// ==UserScript==
// @name         MyFirstUserScript_Aaron
// @namespace    AaronLong
// @version      1.5
// @description  testing SNOW
// @author       AaronLong
// @match        https://sap.service-now.com/*
// @match        https://test.itsm.services.sap/*
// @match        https://itsm.services.sap/*
// @icon         https://www.google.com/s2/favicons?domain=services.sap
// @downloadURL https://update.greasyfork.org/scripts/431095/MyFirstUserScript_Aaron.user.js
// @updateURL https://update.greasyfork.org/scripts/431095/MyFirstUserScript_Aaron.meta.js
// ==/UserScript==

 (function() {
     'use strict';
 
 function addButton(text, onclickAtt,clickFuncContent,cssObj) {
     cssObj = cssObj || {fontWeight: '600', fontSize: '14px', backgroundColor: '#00cccc', color: 'white', border: 'none', padding: '10px 20px', };
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
 
var onclick_testFunction ="function onclick_testFunction(){alert('Testing click!!!');return false;}";
var setUpdateTime ="function setUpdateTime(col_idx){var caseTab = document.getElementById('sn_customerservice_case_table');	var tbl=caseTab.getElementsByTagName('tbody')[0];	var trs=tbl.getElementsByTagName('tr');	for(j =1; j<trs.length; j++){	/*alert(trs[j].innerHTML);console.log(trs[j].innerHTML);*/ console.log(trs[j].getElementsByTagName('td').length);	txtValue = trs[j].getElementsByTagName('td')[col_idx].innerHTML; console.log('txtValue='+txtValue);		if(txtValue.length>=19){trs[j].getElementsByTagName('td')[col_idx].innerHTML=txtValue.substr(0,19);}	}	return;}";
var calBtn = addButton('CalcProcessingTime','onclick_testFunction()',onclick_testFunction,);
var updateTimeBTN = addButton('UpdateTime','setUpdateTime(30)',setUpdateTime,); 
 })();