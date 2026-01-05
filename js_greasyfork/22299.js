// ==UserScript==
// @name         Tab Helper
// @version      0.02
// @description  Puts text with tabs in code tags
// @author       Ineluctable
// @include      http*://chathe.net*
// @grant        none
// @namespace    https://greasyfork.org/users/9318
// @downloadURL https://update.greasyfork.org/scripts/22299/Tab%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/22299/Tab%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var replaceArray = [
        ['\t', '»']
        ];
    var m=document.getElementById('m');
    m.addEventListener("keydown", hook.bind(undefined, m), false);

    function hook(m, event)
    {
        if(event.which == 10 || event.which == 13)
        {
            for(var i=0; i<replaceArray.length; i++)
            {
                var s = replaceArray[i];

                if (m.value.indexOf('\t') !== -1) {
                    if (m.value.indexOf("[code]") === -1) {
                        m.value = "[code]" + m.value + "[/code]";
                    }
                }
            }
        }
    }
})();