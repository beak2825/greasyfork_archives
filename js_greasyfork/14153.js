// ==UserScript==
// @name         RWMFM
// @version      1
// @author       Komoszek
// @match        http://www.wykop.pl/*
// @grant        none
// @description  RWMFM v.2
// @namespace https://greasyfork.org/users/11957
// @downloadURL https://update.greasyfork.org/scripts/14153/RWMFM.user.js
// @updateURL https://update.greasyfork.org/scripts/14153/RWMFM.meta.js
// ==/UserScript==

(function (){
    document.getElementsByClassName("clearfix")[2].innerHTML= "<li><style>#rwm > img{margin-top:3px;height:24px;width:30px; }#rwm:hover > img{-webkit-filter: opacity(0.86)}</style><a href=\"http://www.rwmfm.pl/sluchaj.html\" target=\"_blank\" id=\"rwm\" title=\"Słuchaj radia\"><img src=\"http://i.imgur.com/OpArfsi.png\"  alt=\"Słuchaj radia\"></a></li>" + document.getElementsByClassName("clearfix")[2].innerHTML

mouseOverIcon();
     
function mouseOverIcon(){
$("#rwm").bind('mouseenter mouseleave',function(a) {

            $(this).unbind('mouseenter mouseleave');
        main();
        setTimeout(mouseOverIcon,15000)
});
}

function main() {
    var jsonp_url = 'http://analitykrynkusteam.x25.pl/radio.php';
            $.getJSON(jsonp_url, function(data) {
           document.getElementById("rwm").title= 'Aktualny utwór: ' + data.song + '\n';
                document.getElementById("rwm").title+= 'Prezenter: ' + data.prezenter + '\n';
                document.getElementById("rwm").title+= 'Audycja: ' + data.audycja;
            });
}
})();