// ==UserScript==
// @name         知乎/csdn外链转跳
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  知乎/csdn 转跳
// @author       白水
// @match        https://link.zhihu.com/?target=*
// @match        https://link.csdn.net/?target=*
// @run-at       document-start
// @icon         https://www.zhihu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419796/%E7%9F%A5%E4%B9%8Ecsdn%E5%A4%96%E9%93%BE%E8%BD%AC%E8%B7%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/419796/%E7%9F%A5%E4%B9%8Ecsdn%E5%A4%96%E9%93%BE%E8%BD%AC%E8%B7%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //多行缓慢解法
    /*

    var getUrl = window.location.href;
    //var res = str.split("https://translate.google.com/?tl=en#auto/en/");
    //if (window.location.host = "link.zhihu.com"){
    //window.location.href = str.replace("https://link.zhihu.com/?target=http%3A","http:");
    //}
    //@note: 开坑; csdn跳转
    //https://opensource.com/article/19/3/favorite-terminal-emulators
    //https://link.csdn.net/?target=https%3A%2F%2Fopensource.com%2Farticle%2F19%2F3%2Ffavorite-terminal-emulators
    var res = getUrl.split("?target=");
    var str = res[1];
    str = str.replaceAll("%3A",":");
    str = str.replaceAll("%2F","/");

    */

    window.location.href = (window.location.href.split("?target=")[1].replace("%3A",":")).replaceAll("%2F","/");

    //采用字典法
    /*
    var replacements = {
        "my" : "his",
        "is" : "was",
        "can": "could"
    };
    replacements.my
    replacements = [
    {"my" : "his"},
    {"is" : "was"},
    {"can": "could"}
    ];
    replacements[0]//{my: "his"};
    var regex = new RegExp(properties(replacements).map(RegExp.escape).join("|"), "g");
    str = str.replace(regex, function($0) { return replacements[$0]; });

    window.location.href = str
    */
})();