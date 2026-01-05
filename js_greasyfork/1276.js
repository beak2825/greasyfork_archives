// ==UserScript==
// @name        Oznaceni placeneho odkazu v kolotoci
// @namespace   monnef.tk
// @include     http://www.lupa.cz/*
// @include     http://www.digizone.cz/*
// @include     http://www.root.cz/*
// @include     http://www.mesec.cz/*
// @include     http://www.podnikatel.cz/*
// @include     http://www.vitalia.cz/*
// @include     http://www.topdrive.cz/*
// @include     http://www.slunecnice.cz/*
// @version     6
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @description Tento skript zprůhlední placené články z DigiZone. Po najetí myši jsou zviditelněny.
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/1276/Oznaceni%20placeneho%20odkazu%20v%20kolotoci.user.js
// @updateURL https://update.greasyfork.org/scripts/1276/Oznaceni%20placeneho%20odkazu%20v%20kolotoci.meta.js
// ==/UserScript==

// mam male zkusenosti s JavaScriptem a jQuery,
// takze pokud odhalite chyby nebo vykonostni nedostatky,
// prosim napiste mi :)

// author of some code is root user Riff

function addStyle(style) {
    style = style instanceof Array ? style.join('\n') : style;
    $("head").append($('<style type="text/css">' + style + '</style>'));
}

function consolePrint(a){
    console.log("[OPO] " + a);
}

function log(a) {
    if (debug) {
        if (a.indexOf("\n") > -1) a.split("\n").forEach(log);
        else consolePrint(a);
    }
}

// Tries to fix links because sometimes URLs are invalid (according to STD 66).
// They occasionally contains two fragments (#).
function fixLink(link) {
    return link.replace(/#.*$/, "");

    // Old
    // Simple solution - just remove "#utm_medium=kolotoc"
    return link.replace("#utm_medium=kolotoc", "");
}

function markCarouselLink(link){
    link.parent().addClass(carouselClass);
}

function createCreatedByNotice() {
    var sigId = "carouselPaidArticlesHider";
    var sigElem = $("<div id='" + sigId + "' class='" + carouselClass + "'>Skript pro poloskrytí odkazů na placené články v kolotoči vám napsal <a href='http://monnef.tk'>moen</a>.</div>");
    sigElem.css("text-align", "right").css("font-size", "90%").css("margin-right", "8px");

    var footer = $("#promo-footerPromo");
    footer.append($("<div></div>").css("clear", "both"));
    footer.append(sigElem);
}
// ------------------------------------------------------------------------------------------------

if(typeof GM_xmlhttpRequest !== 'function'){
    consolePrint("Critical error, don't have access to GM_xmlhttpRequest.");
    return;
}

log("started");

var carouselClass = "adfix247119247221242456";
var carouselAnimLen = "0.5";


addStyle([
    '.' + carouselClass + ' {',
    '    -webkit-transition: opacity ' + carouselAnimLen + 's;',
    '    -moz-transition: opacity ' + carouselAnimLen + 's;',
    '    -ms-transition: opacity ' + carouselAnimLen + 's;',
    '    transition: opacity ' + carouselAnimLen + 's;',
    '    opacity: 0.05;',
    '}',
    '.' + carouselClass + ':hover {',
    '    opacity: 1;',
    '}'
]);

var debug = false;
var simulateAllPaid = false;

this.$ = this.jQuery = jQuery.noConflict(true);

$(".promo .promo__item").each(function() {
  console.log("x");
  if (debug) $(this).css("border", "dotted 1px green");
    var link = $("a.link-img", this);
    if (debug) link.css("border", "solid 1px red");
    log("sending request:\n" + link.html() + "\n" + link.prop('href'));
    var url = fixLink(link.prop('href'));
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function(data) {
            log("got response for: " + link.html());
            if (data.responseText.indexOf("paymentRequest") >= 0 || (debug && simulateAllPaid)) {
                log("MATCH, marking");
                markCarouselLink(link);
            } else {
                log("no match")
                if (debug) {
                    var a = $("h3 a", link.parent());
                    a.html("[fine] " + a.html());
                }
            }
        }
    });
});

createCreatedByNotice();
