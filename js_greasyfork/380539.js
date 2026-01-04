// ==UserScript==
// @name        5ch_chikan2
// @namespace   https://catherine.v0cyc1pp.com/5ch_chikan2.user.js
// @include     http://*.5ch.net/*
// @include     https://*.5ch.net/*
// @author      greg10
// @run-at      document-end
// @license     GPL 3.0
// @version     2.0
// @grant       none
// @description ５ちゃんねるの文字列を変換する。
// @downloadURL https://update.greasyfork.org/scripts/380539/5ch_chikan2.user.js
// @updateURL https://update.greasyfork.org/scripts/380539/5ch_chikan2.meta.js
// ==/UserScript==
console.log("5ch_chikan2 start");

//================================
// Configurations
//   - 変換文字列を指定してください。
var g_list = [
    ["/変換前の文字列/", "変換後の文字列"],
    ["/ブス/", "bs"],
];
//================================



// 置換
function chikan() {
    document.querySelectorAll("span,dd,.message,.name").forEach(function(elem) {
        var str = elem.innerHTML;
        //console.log("str="+str);
        if (str == null || str == undefined) {
            str = "";
        }
        for (var i = 0; i < g_list.length; ++i) {
            var pair = g_list[i];

            var mae = pair[0];
            var ato = pair[1];

            //console.log("mae="+mae);
            //console.log("ato="+ato);

            //var obj = new RegExp( mae, "i");
            var index = str.search(eval(mae));
            if (index != -1) {
                var result = str.replace(eval(mae), ato);
                elem.innerHTML = result;
            }
        }
    });
}

function main() {
    chikan();
}


main();