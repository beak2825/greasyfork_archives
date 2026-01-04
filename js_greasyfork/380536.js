// ==UserScript==
// @name        5ch_nanashi_auto2
// @namespace   https://catherine.v0cyc1pp.com/5ch_nanashi_auto2.user.js
// @include     http://*.5ch.net/*
// @include     https://*.5ch.net/*
// @author      greg10
// @run-at      document-idle
// @license     GPL 3.0
// @version     2.0
// @grant       none
// @description ５ちゃんねるのデフォルトの名前を自動入力する。
// @downloadURL https://update.greasyfork.org/scripts/380536/5ch_nanashi_auto2.user.js
// @updateURL https://update.greasyfork.org/scripts/380536/5ch_nanashi_auto2.meta.js
// ==/UserScript==
console.log("5ch_nanashi_auto2 start");

function main() {
    var str = document.location + "";
    //console.log("str=" + str);

    document.querySelectorAll("input[name='FROM']").forEach(function(elem) {
        elem.style.borderColor = "red";

        var classname = elem.className;
        //console.log("classname=" + classname);


        // 板のHTMLでは、クッキーが反映されて名前が自動入力されるので、ここでは処理不要
        // https://matsuri.5ch.net/morningcoffee/
        // スレッドのHTML（classname === "formelem maxwidth"）ではクッキーが反映されないので、ここで設定する。
        // https://matsuri.5ch.net/test/read.cgi/morningcoffee/1550444800/l50
        if (classname === "formelem maxwidth") {
            if (str.indexOf("morningcoffee") != -1) {
                elem.value = "名無し募集中。。。";
            } else if (str.indexOf("livejupiter") != -1) {
                elem.value = "風吹けば名無し";
            } else if (str.indexOf("kitchen") != -1) {
                elem.value = "北風 #vZp6OYj3";
            } else {}
        }

    });

}

main();


var observer = new MutationObserver(function(mutations) {
    observer.disconnect();
    main();
    observer.observe(document, config);
});

var config = {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: false
};

observer.observe(document, config);