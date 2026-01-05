// ==UserScript==
// @name           szam
// @author         not exist
// @version        1.1
// @namespace      Tc95
// @include        http://users.itk.ppke.hu/~horbe/TCExam/public/code/tce_ip_results.php
// @description    Kiír egy számot
// @downloadURL https://update.greasyfork.org/scripts/24936/szam.user.js
// @updateURL https://update.greasyfork.org/scripts/24936/szam.meta.js
// ==/UserScript==

function inIframe(){
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

(function() {
    if(inIframe()){
        var eredmeny="";
        var table=document.getElementsByClassName("userselect")[1];
        var aktRow = table.rows.length - 2;
        var tr = table.getElementsByTagName("tr")[aktRow];
        if(tr == null){
            eredmeny="I";
        }
        else if(tr.getElementsByTagName("td")[3] == null){
            eredmeny="-";
        }
        else{
            eredmeny = tr.getElementsByTagName("td")[3].innerHTML;
            eredmeny = eredmeny.split("\n\t\t\t").join("");
            eredmeny=eredmeny.substr(0,eredmeny.indexOf("/"));
        }
        document.getElementsByTagName("html")[0].innerHTML="<span style='-moz-user-select: none;margin:0;padding:0;color:#ababab;font-size:9px;position:fixed;bottom:0;left:0;'>" + eredmeny + "</span>";
    }
})();