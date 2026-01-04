// ==UserScript==
// @name         coolrom.com.au - DwnLnk
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Put Download Link - with out wait
// @author       Arista323
// @match        https://coolrom.com.au/roms/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421065/coolromcomau%20-%20DwnLnk.user.js
// @updateURL https://update.greasyfork.org/scripts/421065/coolromcomau%20-%20DwnLnk.meta.js
// ==/UserScript==

(function() {
'use strict';

try{
document.getElementsByName("show")[0].click();
document.getElementsByName("USA")[0].click();
}
catch(err){}

var lnk1=document.getElementsByClassName("download_link")[2];
var ref1=lnk1.href;
var pos1=ref1.search("id=")+3;
var id1=ref1.substring(pos1);
var lnk2="https://coolrom.com.au/dlpop.php?id="+id1;
var lnk3="https://kylog.000webhostapp.com/test/coolrom1.php?id="+id1;
//lnk1.innerHTML="<iframe src='"+lnk2+"'>Link</a>";
lnk1.innerHTML="<iframe src='"+lnk3+"'>Link</a>";
document.getElementById("recommended").scrollIntoView();

})();