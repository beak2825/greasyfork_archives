// ==UserScript==
// @name         Reddit Comment Jumper
// @namespace    https://github.com/noahcristino
// @version      1.0
// @description  Jumps to top level reddit comments!
// @author       Noah Cristino
// @match        https://www.reddit.com/r/*/comments/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/386694/Reddit%20Comment%20Jumper.user.js
// @updateURL https://update.greasyfork.org/scripts/386694/Reddit%20Comment%20Jumper.meta.js
// ==/UserScript==
(function() {
    var elms = [];

    function jump(h) {
        var url = location.href; //Save down the URL without hash.
        location.href = "#" + h; //Go to the target element.
        history.replaceState(null, null, url); //Don't like hashes. Changing it back.
    }
    $("<style type='text/css'> .ffloat{z-index:101;position:fixed;width:60px;height:60px;bottom:40px;right:40px;color:#FFF;border-radius:50px;text-align:center;box-shadow: 2px 2px 3px #999;background: url(https://i.imgur.com/Big0dFQ.png) 0 0 no-repeat;background-size:cover;} </style>").appendTo("head");
    $("body").append('<a href="#" class="ffloat"></a>');
    $(".commentarea > .sitetable.nestedlisting > div[data-type='comment']").each(function() {
        elms.push(this.id);
    });
    var current = 0;
    $(".ffloat").attr("href", "#" + elms[current]);
    $(".ffloat").click(function() {
        current = current + 1;
        $(".ffloat").attr("href", "#" + elms[current]);
    });
})();