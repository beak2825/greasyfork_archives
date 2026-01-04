// ==UserScript==
// @name         ZCalcTime4GPS
// @namespace    AaronLong
// @version      2.4
// @description  Calc Time relevant to Global Partner Support on SNOW
// @author       AaronLong
// @match       https://test.itsm.services.sap/now/workspace/*
// @match       https://sapexttest.service-now.com/now/workspace/*
// @match       https://sap.service-now.com/now/workspace/*
// @match       https://itsm.services.sap/now/workspace/*
// @match       https://itsm.services.sap/now/cwf/*
// @icon         https://www.google.com/s2/favicons?domain=services.sap
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/431222/ZCalcTime4GPS.user.js
// @updateURL https://update.greasyfork.org/scripts/431222/ZCalcTime4GPS.meta.js
// ==/UserScript==

 (function() {
     'use strict';
 
 function addButton(text, onclickAtt,clickFuncContent,cssObj) {
     cssObj = cssObj || {fontWeight: '600', fontSize: '14px', backgroundColor: '#0078D7', color: 'white', border: 'none', padding: '10px 20px', position:'relative', left:'50px' };
     let div = document.createElement('div');
     let button = document.createElement('button'), btnStyle = button.style	; 
     let click_att = document.createAttribute("onclick");       // Create an "onclick" attribute
     click_att.value = onclickAtt;
     button.setAttributeNode(click_att);  
     let id_att = document.createAttribute("id");       // Create an "id" attribute
     id_att.value = text;
     button.setAttributeNode(id_att);  
     button.innerHTML = text;
     Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key]);
     let scriptlet = document.createElement('Script');
     let type_att = document.createAttribute("type");       // Create an "type" attribute
     type_att.value="text/javascript";
     scriptlet.setAttributeNode(type_att);
     let src_code = document.createTextNode(clickFuncContent);
     scriptlet.appendChild(src_code);
     //console.log(scriptlet);
     document.body.appendChild(scriptlet);
     document.body.appendChild(div).appendChild(button);
     return button;
 }
var getCurrentTimeGapDays='function getCurrentTimeGapDays(fdatetime) { splitDTime = fdatetime.split(" "); spDate = splitDTime[0].split("-"); oYear = spDate[0]; oMonth = spDate[1] - 1; oDay = spDate[2]; spTime = splitDTime[1].split(":"); oHour = spTime[0]; oMinute = spTime[1]; oSecond = spTime[2]; var dueDTime = new Date(oYear, oMonth, oDay, oHour, oMinute, oSecond); var currMills = new Date().valueOf(); minsGap = Math.round((currMills - dueDTime.valueOf()) / 1000 / 60); daysGap = (Math.round(minsGap / (60 * 24))).toFixed(0); return daysGap+" Day(s) Ago"; } ';
var calcTime='function calcTime(th_col_idx, new_td_col_idx) { var thead_tr_ele = document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-primary-content > sn-ux-content-option:nth-child(3) > sn-workspace-list-module").shadowRoot.querySelector("div > div.list-wrapper > now-record-list-connected").shadowRoot.querySelector("div > now-record-list").shadowRoot.querySelector("div > div.sn-list-grid-container > div > div > now-grid").shadowRoot.querySelector("div > table > thead > tr"); th_ele = thead_tr_ele.getElementsByTagName("th")[th_col_idx]; if(th_ele.getAttribute("colspan") ==2) { return; } th_ele.setAttribute("colspan",2); var tbl = document.querySelector("body > sn-workspace-layout > sn-workspace-main > sn-workspace-primary-content > sn-ux-content-option:nth-child(3) > sn-workspace-list-module").shadowRoot.querySelector("div > div.list-wrapper > now-record-list-connected").shadowRoot.querySelector("div > now-record-list").shadowRoot.querySelector("div > div.sn-list-grid-container > div > div > now-grid").shadowRoot.querySelector("div > table > tbody"); var trs = tbl.getElementsByTagName("tr"); add_idx = new_td_col_idx + 1; /*console.log("trs.length=" + trs.length);*/  for (j = 0; j < trs.length; j++) { txtValue = trs[j].querySelector("td:nth-child("+(new_td_col_idx+1)+") > div > div > div > span").innerHTML; /*console.log("tr="+j+" td="+new_td_col_idx+" :txtValue=" + txtValue);*/ if (txtValue.length >= 19) { trs[j].getElementsByTagName("td")[new_td_col_idx].innerHTML = txtValue.substr(0, 19); add_col = trs[j].insertCell(add_idx); add_col.innerHTML = "<font style=\'background-color:#ee7a14;padding: 0px;font-weight: bold;\'>" + getCurrentTimeGapDays(txtValue.substr(0, 19)) + "</font> "; } else { trs[j].getElementsByTagName("td")[new_td_col_idx].innerHTML = txtValue; add_col = trs[j].insertCell(add_idx); } } return; } ';
var calcTimeColumns ='function calcTimeColumns(col_idx_array) {for (var i = 0; i < col_idx_array.length; i++) { calcTime(col_idx_array[i], col_idx_array[i] + i); } return; } ';
var updateTimeBTN = addButton("ZCalcGPSTime","calcTimeColumns([3,4,5,6])",getCurrentTimeGapDays+'\n'+calcTime+'\n'+calcTimeColumns,);
 })();
 