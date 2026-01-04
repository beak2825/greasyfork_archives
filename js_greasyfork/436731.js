// ==UserScript==
// @name         no answer
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.1
// @description  hide code editor at leetcode-cn
// @compatible   chrome Latest
// @author       You
// @run-at       document-start
// @include      *://leetcode-cn.com*
// @icon         https://www.google.com/s2/favicons?domain=x
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/436731/no%20answer.user.js
// @updateURL https://update.greasyfork.org/scripts/436731/no%20answer.meta.js
// ==/UserScript==

setInterval(function(){

    setInterval(function(){

        $('.css-1gcn2k5-RightContainer.e1aolq221').remove();

        $('img').each(function(i,o){o.remove();})
    });

}, 1000);
