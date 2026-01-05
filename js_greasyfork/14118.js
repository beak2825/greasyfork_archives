// ==UserScript==
// @name         CTFtime writeup column
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Insert a new column of writeup to table at archive page.
// @author       Bu4275
// @match        https://ctftime.org/event/list/past
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14118/CTFtime%20writeup%20column.user.js
// @updateURL https://update.greasyfork.org/scripts/14118/CTFtime%20writeup%20column.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

var s = '';
var div = document.getElementsByClassName('container')[1];
var table = div.getElementsByClassName('table table-striped')[0];

// Insert a column
var cell1 = table.rows[0].insertCell(1);
cell1.innerHTML = "<th>writeup</th>";

var str ='';

for(var i=1;i<table.rows.length;i++){
    var tr = table.rows[i];
    var td = tr.getElementsByTagName('td')[0]
    var url = td.getElementsByTagName('a')[0].getAttribute('href') + "/tasks/";
    
    // Insert a column
    var cell1 = table.rows[i].insertCell(1);
    cell1.innerHTML = "<a href=" +url + "> writeup </a>";
    
    //str = str  + url + "\t" +  td.innerText.toString()+'\n';
}


//console.log(str);
