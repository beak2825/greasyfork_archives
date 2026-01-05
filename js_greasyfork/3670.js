// ==UserScript==
// @name egov4you citizen ID generator
// @namespace Mike Ontry
// @description Generate a list of citizen IDs from egov4you
// @version 0.1
// @include http://www.egov4you.info/citizens/overview/page:*
// @namespace https://greasyfork.org/users/3941
// @downloadURL https://update.greasyfork.org/scripts/3670/egov4you%20citizen%20ID%20generator.user.js
// @updateURL https://update.greasyfork.org/scripts/3670/egov4you%20citizen%20ID%20generator.meta.js
// ==/UserScript==
 
var links = document.getElementsByTagName("a");
var info = document.getElementsByClassName("ePageInfo");
var p;
var ids = [];
var i;
var content = "<br /><br />Citizen ID List from this page<br />";
function getIds(){
    var page = document.URL.split(":");
    var lastpage = parseInt(page[2])-1;
    var nextpage = parseInt(page[2])+1;
    for (i = 0; i < links.length; ++i) {
        if (links[i].href.search("/citizen/overview/") == 24) {
            p = links[i].href.split("/")
            ids.push(p[5]);
        }
    }
   
    for (i = 0; i < ids.length; ++i) {
        if(i != ids.length-1){
            content += ids[i]+', ';
        }else{
            content += ids[i];
        }
    }
   
    if (lastpage == 0) {
        lastpage = 1;
    }
   
    info[0].innerHTML = info[0].innerHTML + content+'<br /><a href="http://www.egov4you.info/citizens/overview/page:'+lastpage+'" class="buttonLink">Previous Page</a>&nbsp;&nbsp;<a href="http://www.egov4you.info/citizens/overview/page:'+nextpage+'" class="buttonLink">Next Page</a>';
}
 
getIds();