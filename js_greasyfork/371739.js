// ==UserScript==
// @name         Hiyobi Customize
// @version      0.1
// @description  Background - Black / Fit Horizontal - Original Image
// @author       pL
// @match        https://hiyobi.me/reader/*
// @grant        none
// @namespace https://greasyfork.org/users/64556
// @downloadURL https://update.greasyfork.org/scripts/371739/Hiyobi%20Customize.user.js
// @updateURL https://update.greasyfork.org/scripts/371739/Hiyobi%20Customize.meta.js
// ==/UserScript==

(function() {
    document.body.style.background = "black";

     var scriptCode = new Array();

    // here's the build of the new script, one line at a time
    scriptCode.push('function fitHorizontal(){');
    scriptCode.push('    $("#comicscroll").removeClass();');
    scriptCode.push('    $("#comicImages").removeClass();');
    scriptCode.push('    $("#fitVertical").show();');
    scriptCode.push('    $("#fitHorizontal").hide();');
    scriptCode.push('    $("#comicImages").focusWithoutScrolling();');
    scriptCode.push('    $("body").scrollTop(0);');
    scriptCode.push('}');

    // now, we put the script in a new script element in the DOM
    var script = document.createElement('script');
    script.innerHTML = scriptCode.join('\n');
    scriptCode.length = 0;

    // this is sort of hard to read, because it's doing 2 things:
    // 1. finds the first <head> tag on the page
    // 2. adds the new script just before the </head> tag
    document.getElementsByTagName('head')[0].appendChild(script);
})();