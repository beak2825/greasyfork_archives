// ==UserScript==
// @name         Ping Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Barracuda10
// @match        https://tools.ipip.net/ping.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404259/Ping%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/404259/Ping%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function filter(){
        var deleteIp = document.getElementById('filter_host').value;
        var table = document.getElementById('pdata').getElementsByTagName('tbody')[0];
        var rows = table.getElementsByTagName('tr');
        for(var rowsIndex = 0;rowsIndex < rows.length;rowsIndex++){
            var ip = rows[rowsIndex].getElementsByTagName('td')[1].getElementsByTagName('a')[0].innerHTML;
            if(deleteIp == ip){
                rows[rowsIndex].remove();
                rowsIndex--;
            }
        }
    }
    var insert = document.getElementsByClassName('row')[0];
    insert.appendChild(document.createElement('div'));
    insert.getElementsByTagName('div')[3].style='position:fixed;top:200px;left:0px;background-color: #eeeeee;opacity:0.5;transition:0.4s';
    insert.getElementsByTagName('div')[3].onmouseover = function(){this.style.opacity = '1'};
    insert.getElementsByTagName('div')[3].onmouseleave = function(){setTimeout(function(){insert.getElementsByTagName('div')[3].style.opacity = '0.5'},1500)};
    insert.getElementsByTagName('div')[3].innerHTML = '<button type="button" id="remove" class="btn" onclick="filter()" style="float:left">Remove</button><input type="text" class="form-control" style="width:200px;float:left;margin-left:4px" id="filter_host">'
})();