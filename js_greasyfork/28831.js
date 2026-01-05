// ==UserScript==
// @name        Symulator Michua Biauka 2137
// @namespace   http://wykop.pl/ludzie/polaq
// @author 		polaq
// @description Śmieszkowy skrypt dla wykopowiczów.
// @include		http://*.wykop.pl/*
// @include		https://*.wykop.pl/*
// @exclude 	https://wykop.pl/link/*
// @version     1.0
// @run-at 		document-end
// @downloadURL https://update.greasyfork.org/scripts/28831/Symulator%20Michua%20Biauka%202137.user.js
// @updateURL https://update.greasyfork.org/scripts/28831/Symulator%20Michua%20Biauka%202137.meta.js
// ==/UserScript==


(function() {
    var html = "<li id='xdmenu'><a role='button' tabindex='0' id='modmenu' class='affect hide'><i class='fa fa-eye'></i> mod <i class='fa fa-caret-down'></i></a> </li>";
    function inject(){
        $( "ul.responsive-menu:not(.admined)" ).addClass("admined").append( html );
        $("a#modmenu").click(function(){
            $(this).parentsUntil("div.wblock").find("a.showProfileSummary > b").addClass("color-1001");
        });
        console.log("ADMIN");
    }
    $("a.affect.ajax").click(()=>{ inject(); });
    inject();
    inj = setInterval(inject, 2000);
})();