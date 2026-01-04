// ==UserScript==
// @name         LinkedInNoPromoted
// @namespace    http://wimgodden.be/
// @version      1.16
// @description  Removes promoted and suggested posts on LinkedIn
// @author       Wim Godden <wim@cu.be>
// @match        https://linkedin.com/*
// @match        https://www.linkedin.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/386859/LinkedInNoPromoted.user.js
// @updateURL https://update.greasyfork.org/scripts/386859/LinkedInNoPromoted.meta.js
// ==/UserScript==



function removeSponsored() {
    $("div div div span.update-components-header__text-view div span span:contains('Suggested')").parent().parent().parent().parent().parent().parent().hide();
    $("div.ember-view a div span div span span.ember-view span:contains('Promoted')").parent().parent().parent().parent().parent().parent().parent().parent().hide()
    $("span:contains('Promoted')").parent().parent().parent().parent().parent().parent().remove();
    $("span:contains('Expert answers on')").parent().parent().parent().parent().parent().parent().remove();
    $("span.update-components-header__text-view:contains('Suggested')").parent().parent().parent().parent().parent().parent().remove();
    setTimeout(function() {
        removeSponsored();
    }, 1000); //Two seconds will elapse and Code will execute.
}

function removeSponsoredTimer($) {
    setTimeout(function() {
        removeSponsored();
    }, 1000); //Two seconds will elapse and Code will execute.
}

if (typeof jQuery === "function") {
    $(function() {
        removeSponsoredTimer (jQuery);
    });
}
else {
    add_jQuery (removeSponsoredTimer, "1.7.2");
}

function add_jQuery (callbackFn, jqVersion) {
    var jqVersion   = jqVersion || "1.7.2";
    var D           = document;
    var targ        = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    var scriptNode  = D.createElement ('script');
    scriptNode.src  = 'http://ajax.googleapis.com/ajax/libs/jquery/'
                    + jqVersion
                    + '/jquery.min.js'
                    ;
    scriptNode.addEventListener ("load", function () {
        var scriptNode          = D.createElement ("script");
        scriptNode.textContent  =
            'var gm_jQuery  = jQuery.noConflict (true);\n'
            + '(' + callbackFn.toString () + ')(gm_jQuery);'
        ;
        targ.appendChild (scriptNode);
    }, false);
    targ.appendChild (scriptNode);
}
