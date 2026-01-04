// ==UserScript==
// @name         SquadStatsJSBlackyfy
// @namespace    SquadStatsJSBlackyfymadv1
// @license      MIT
// @version      1.1
// @description  Nothing.. just inverts some colors
// @author       JetDave
// @match        https://panel.makeadifference-mad.com/*
// @icon         https://www.google.com/s2/favicons?domain=makeadifference-mad.com
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/435969/SquadStatsJSBlackyfy.user.js
// @updateURL https://update.greasyfork.org/scripts/435969/SquadStatsJSBlackyfy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //$(".bg-gradient-neutral").first().css("filter","invert(0.9)")
    console.log($("img"));
    let tgContainer = getElementByXPath("/html/body/div[2]/div[2]");

    $("body").css("background","#212529");
    $("nav").css("filter","invert(0.92)");
    $(".navbar-toggler-icon").css("filter","invert(1)");
    $(getElementByXPath('//*[@id="navbar-main"]/div/a[2]')).css("filter","invert(1)");

    $(tgContainer).first().css("filter","invert(0.92)")
    setInterval(function(){
        $(".bg-gradient-neutral").find("img").css("filter","invert(1)")
        $("nav").find("img").css("filter","invert(1)")
    },100);

    console.log($("img"));

    function getElementByXPath(path) {
    return (new XPathEvaluator())
        .evaluate(path, document.documentElement, null,
                        XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        .singleNodeValue;
}
})();