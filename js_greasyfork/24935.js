// ==UserScript==
// @name           ablak
// @author         not exist
// @version        1.2
// @namespace      Tc94
// @include        http://users.itk.ppke.hu/~horbe/TCExam/*
// @description    Kirak egy kockát
// @downloadURL https://update.greasyfork.org/scripts/24935/ablak.user.js
// @updateURL https://update.greasyfork.org/scripts/24935/ablak.meta.js
// ==/UserScript==

function eredmeny(het){
    var eredmeny = document.getElementsByClassName("userselect")[1].getElementsByTagName("tr")[het-1].getElementsByTagName("td")[3].innerHTML;
    eredmeny = eredmeny.split("\n\t\t\t").join("");
    eredmeny = eredmeny.split("(  ").join("\n");
    eredmeny = eredmeny.split(")").join("");
    return eredmeny;
}

(function() {
    var body = document.getElementsByTagName("html")[0].innerHTML;
    body = body.split("<body").join("<iframe id='plifr' style='display:none;user-select:none;-moz-user-select: none;border:0;width:75px;height:25px;position:fixed;bottom:0;left:50%;' src='http://users.itk.ppke.hu/~horbe/TCExam/public/code/tce_ip_results.php'></iframe><body");
    document.getElementsByTagName("html")[0].innerHTML=body;
    
    var readyStateCheckInterval = setInterval(function() {
        var iframe = document.getElementById('plifr');
        var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        if (iframeDoc.readyState  == "complete") {
            clearInterval(readyStateCheckInterval);
            setTimeout(function() {
                document.getElementById('plifr').style.display = "";
            }, 100);
        }
    }, 10);
})();