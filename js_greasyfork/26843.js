// ==UserScript==
// @name        Kotonoha Context Concatenator
// @namespace   rfindley
// @description Joins the 3 result columns of Kotonoha search results.
// @version     1.0.0
// @include     http://www.kotonoha.gr.jp/shonagon/search_result
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @copyright   2017+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26843/Kotonoha%20Context%20Concatenator.user.js
// @updateURL https://update.greasyfork.org/scripts/26843/Kotonoha%20Context%20Concatenator.meta.js
// ==/UserScript==

window.kotonoha = {};

(function(gobj) {

    //-------------------------------------------------------------------
    // Startup. Runs at document 'load' event.
    //-------------------------------------------------------------------
    function startup() {
        var arr = $('td.cell01,td.cell02,td.cell03');
        $('th.cell03').after('<th class="sample cell04">文脈</th>');
        for (var idx = 0; idx < arr.length; idx += 3) {
            arr.eq(idx+2).after('<td class="cell04">' + arr.eq(idx).text() + arr.eq(idx+1).text() + arr.eq(idx+2).text() + '</td>');
        }
        $('.cell01,.cell02,.cell03').hide();
    }

        // Run startup() after window.onload event.
    if (document.readyState === 'complete')
        startup();
    else
        window.addEventListener("load", startup, false);

})(window.kotonoha);