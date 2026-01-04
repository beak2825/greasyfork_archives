// ==UserScript==
// @name         search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  恢复门户查询
// @author       You
// @match        https://portal.pku.edu.cn/portal2017/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pku.edu.cn
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/json2html/2.1.0/json2html.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463867/search.user.js
// @updateURL https://update.greasyfork.org/scripts/463867/search.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */


(function() {
    'use strict';

    var sousuo1 = document.createElement('input');
    var sousuo2 = document.createElement('input');
    var sousuo3 = document.createElement('input');
    var sousuo4 = document.createElement('input');
    var sousuo5 = document.createElement('button');
    var sousuo6 = document.createElement('p');
    var sousuo7 = document.createElement('table');
    var b = document.getElementsByClassName("ng-scope") ;
    sousuo5.innerHTML='搜索';
    sousuo5.id='oppo';
    sousuo6.id='output';
    sousuo7.id='lastresult';

    document.body.append(sousuo1);
    document.body.append(sousuo2);
    document.body.append(sousuo3);
    document.body.append(sousuo4);
    document.body.append(sousuo5);
    document.body.append(sousuo6);
    document.body.append(sousuo7);


function jsonToHtml(data,k){

       var row = "";
       var tbody = '';
       for (var i = 0; i < k; i++){
           row = "";
           for (var j in data[i]){
               row += "<td>" + data[i][j] + "</td>";
           }
            row = "<tr>" + row + "</tr>";
            tbody += row;
}

        return tbody;
    }


    const button = document.getElementById('oppo');
	  let name;
	  let nameabbr;
	  let depart;
	  let kind;
             let template = {'<>':'div','html':'${deptName} ${nativePlace} ${personName} ${personType} ${sex} ${speciality} ${userIdentity}'};



	  button.onclick = function() {
	name = sousuo1.value;
	  nameabbr = sousuo2.value;
	  depart = sousuo3.value;
	  kind = sousuo4.value;
      fetch('https://portal.pku.edu.cn/portal2017/publicquery/personquery/query.do?deptId='+ depart +'&name='+ name +'&nameAbbr='+ nameabbr +'&personType='+ kind, {mode: 'cors'},{
  credentials: 'include'
})
  .then(response => response.json())
  .then(data => {console.log(data); document.getElementById('output').innerHTML = data.msg + JSON.stringify(data.results); document.getElementById('lastresult').innerHTML =jsonToHtml(data.rows,data.results) });
     }






})();