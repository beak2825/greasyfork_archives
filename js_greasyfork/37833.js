// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://stntrading.eu/modcp/editprice*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37833/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/37833/New%20Userscript.meta.js
// ==/UserScript==

var table = document.getElementsByTagName('tr');
var output = '{\n"array": [\n';
for(i=1; i<table.length-1; i++){
    var cell = table[i].getElementsByTagName('td');
    output += '{"title": "'+ cell[0].innerHTML + '",\n"sellPrice": "' + cell[2].innerHTML + '",\n"buyPrice": "' + cell[1].innerHTML + '"},\n';
}
output = output.substring(0, output.length - 2);
output += '\n]}';
console.log(output);