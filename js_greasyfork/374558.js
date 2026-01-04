// ==UserScript==
// @name           tes
// @namespace      tes
// @version        0.3
// @description    testis
// @include        http://*
// @include        https://*
// @run-at document-idle
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js 
// @grant        window.close

// @downloadURL https://update.greasyfork.org/scripts/374558/tes.user.js
// @updateURL https://update.greasyfork.org/scripts/374558/tes.meta.js
// ==/UserScript==
if(window.location.href.indexOf("mirrored.to/files") > -1) {
setTimeout(function(){ document.getElementsByTagName("td")[9].getElementsByTagName("button")[0].click(); }, 3000);
setTimeout(function(){ window.close(); }, 6000);
}
else if(window.location.href.indexOf("uptobox") > -1) {
$("a:contains('download')")[0].click();
setTimeout(function(){ window.close(); }, 4000);
}
else if(window.location.href.indexOf("indonesian/") > -1) {
document.getElementById('downloadButton').click();
setTimeout(function(){ window.close(); }, 4000);
}
else if(window.location.href.indexOf("kurogaze.top/") > -1) {
$("a:contains('Zippy')").attr("target", "_blank")[1].click();
$("a:contains('Zippy')").attr("target", "_blank")[2].click();
$("a:contains('Zippy')").attr("target", "_blank")[3].click();
setTimeout(function(){ window.close(); }, 4000);
}
else if(window.location.href.indexOf("zippyshare") > -1) {
 setTimeout(function(){ document.getElementById('dlbutton').click(); }, 3000);
setTimeout(function(){ window.close(); }, 7000);
}
