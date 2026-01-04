// ==UserScript==
// @name         OTM sql
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  OTM SQL
// @author       You
// @match        https://otmgtm-test-vertivotm.otmgtm.us-phoenix-1.ocs.oraclecloud.com/GC3/glog.webserver.sql.SqlServlet*
// @match        https://otmgtm-vertivotm.otmgtm.us-phoenix-1.ocs.oraclecloud.com/GC3/glog.webserver.sql.SqlServlet*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/429402/OTM%20sql.user.js
// @updateURL https://update.greasyfork.org/scripts/429402/OTM%20sql.meta.js
// ==/UserScript==

GM_addStyle(
    '.body2{overflow: scroll}' +
    '.body2 > form > .bodyDataFooterCont .buttonCont{position: fixed; top:0; left: 0}' +
    '#beautify{position: fixed; top:0; left: 60px}' +
    '.bodyHeaderCont{display: none !important}' +
    '#sql{width: 1000px; height: 100%; padding: 5px !important; font-family: monospace;resize: none;}' +
    'frame{border: 1px solid red}' +
    'form #bodyDataContDiv{height: unset!important}' +
    'form .bodySectCont, .bodySectInCont, .bodySectInCont >tbody, .fieldCont, .fieldCont>table{height: 95%!important}' +
    '#bodyDataContDiv > #bodyDataDiv > .bodySectCont > table{white-space:pre}'+
    '.gridBodyCell{font-family: monospace!important}' +
    '.body2 > #bodyDataContDiv > #bodyDataDiv > .bodySectCont:first-child {position: fixed; left: 150px; bottom: 5px}'
);

(function() {
    'use strict';

    window.onload = function(){
        if(!!document.querySelector("form input[name='count@PRF']")){
            document.querySelector("form input[name='count@PRF']").value = 100;
        }
        if(!!document.execute){
            document.execute.elements.count.value = 100;
        }
        if(!!document.querySelector('#trackTime')){
            document.querySelector('#trackTime').checked = true;
        }
        if(!!document.querySelector('#trackTime')){
            document.querySelector('#trackTime').value = true;
        }
        var sqlBox = document.getElementById('sql');
        if(!!sqlBox){

            var sourceNode = document.querySelector('.body2 > form > .bodyDataFooterCont .buttonCont > button');
            sourceNode.onclick = function(){
                if(!!sqlBox.value){
                    document.execute.submit();
                }
            };
            var clonedNode = sourceNode.cloneNode(true);
            clonedNode.setAttribute("id", "clear");
            clonedNode.innerText = "Clear";
            clonedNode.onclick = function(){
                sqlBox.value = '';
            };
            var clonedNode1 = sourceNode.cloneNode(true);
            clonedNode1.setAttribute("id", "searchTable");
            clonedNode1.innerText = "Table";
            clonedNode1.onclick = function(){
                sqlBox.value = 'select REPLACE(TABLE_NAME, \'_T\', \'\')\nfrom all_tables\nwhere owner = \'GLOGOWNER\' and table_name like \'%%\'';
                sqlBox.focus();
                sqlBox.setSelectionRange(sqlBox.value.length - 2, sqlBox.value.length - 2);
            };
            var clonedNode2 = sourceNode.cloneNode(true);
            clonedNode2.setAttribute("id", "transactionTable");
            clonedNode2.innerText = "Transaction";
            clonedNode2.onclick = function(){
                var date = new Date();
                date.setHours(date.getHours() - 8);
                sqlBox.value = 'select element_name, status, count(0), count(distinct i_transmission_no) cnt, listagg(distinct i_transmission_no, \',\') within group(order by i_transmission_no) i_transmission_no\n' +
                    'from i_transaction\n'+
                    'where insert_date >= to_date(\''+
                    date.getFullYear() + '-' + (date.getMonth() <= 9 ? '0' : '') + (date.getMonth() + 1) + '-' + (date.getDate() <= 9 ? '0' : '') + date.getDate() + ' ' +
                    (date.getHours() <= 9 ? '0' : '') + date.getHours() + ':' + (date.getMinutes() <= 9 ? '0' : '') + date.getMinutes() +'\', \'YYYY-MM-DD HH24:MI\')\n'+
                    '-- and element_name = \'\'\n'+
                    'and element_name != \'TransmissionHeader\'\n'+
                    'group by element_name, status\n'+
                    'order by element_name, status';
                sqlBox.focus();
                sqlBox.setSelectionRange(sqlBox.value.length - 2, sqlBox.value.length - 2);
            };
            sourceNode.parentNode.appendChild(clonedNode);
            sourceNode.parentNode.appendChild(clonedNode1);
            sourceNode.parentNode.appendChild(clonedNode2);
            sqlBox.addEventListener('input',function (e) {
                var sqlStr = sqlBox.value;
                if(sqlStr.substring(sqlBox.selectionStart - 5, sqlBox.selectionStart) == 'sall '){
                    var pos = sqlBox.selectionStart + 10;
                    sqlBox.value = sqlStr.substring(0, sqlBox.selectionStart - 5) + 'select * \nfrom ' + sqlStr.substring(sqlBox.selectionStart);
                    sqlBox.setSelectionRange(pos, pos);
                }
            });
            sqlBox.addEventListener('keydown',function (e) {
                if(e.key == 'Tab'){
                    e.preventDefault();
                    var indent = '    ';
                    var start = this.selectionStart;
                    var end = this.selectionEnd;
                    var selected = window.getSelection().toString();
                    selected = indent + selected.replace(/\n/g,'\n'+indent);
                    this.value = this.value.substring(0,start) + selected + this.value.substring(end);
                    this.setSelectionRange(start+indent.length,start+selected.length);
                }else if(e.key == 'Enter' & e.altKey & !!this.value){
                    e.preventDefault();
                    document.execute.submit();
                }
            });
        }
    };
})();