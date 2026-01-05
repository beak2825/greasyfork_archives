// ==UserScript==
// @name           osu! Profile Detail
// @description    Show some API stats in profile page
// @author         JebwizOscar
// @icon           http://osu.ppy.sh/favicon.ico
// @include        http://osu.ppy.sh/u/*
// @include        https://osu.ppy.sh/u/*
// @grant          GM_xmlhttpRequest
// @grant          GM_openInTab
// @grant          GM_setValue
// @grant          GM_getValue
// @version        1.6.0.0059
// @namespace      https://greasyfork.org/users/3079
// @downloadURL https://update.greasyfork.org/scripts/2851/osu%21%20Profile%20Detail.user.js
// @updateURL https://update.greasyfork.org/scripts/2851/osu%21%20Profile%20Detail.meta.js
// ==/UserScript==
var ver = 59;
var code = document.documentElement.innerHTML;
var udt = code.match("var localUserId = ([0-9]+)");
var prefix = document.location.protocol + "//osupd.og.gs/";

function main() {
    qstr = "sv=" + ver + udstr;
    var a, b;
    a = document.getElementsByTagName("head")[0];
    b = document.createElement("style");
    b.type = "text/css";
    b.innerHTML = ".unexpanded { display:none; }";
    a.appendChild(b);
    GM_xmlhttpRequest({
        method: "GET",
        url: prefix + "pf_det.php?" + qstr + "&u=" + uid + "&m=" + e,
        headers: {
            Referer: location.href
        },
        onload: function(a) {
            var c, b = a.responseText;
            $(".beatmapListing").append(b);
            $("body").append('<script> var sv=' + ver + '; </script>');
            GM_xmlhttpRequest({
                method: "GET",
                url: prefix + "pf_det.js",
                headers: {
                    Referer: location.href
                },
                onload: function(a) {
                    var b = a.responseText;
                    $("body").append('<script>' + b + '</script>');
                }
            });
        }
    });
}

if (code.match("var userId = ([0-9]+)")){
    var uid = code.match("var userId = ([0-9]+)")[1];
    var e = code.match("var activeGameMode = ([0-9])")[1];
    if (null !== udt) {
        ud = udt[1];
        udstr = "&ud=" + ud;
    } else {
        ud = "0";
        udstr = "";
    }
    main();
}