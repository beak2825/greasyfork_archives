// ==UserScript==
// @name         TFS+
// @description  RTL Support in TFS
// @version      2.0
// @match       http://tfs-app:8080/tfs*
// @match       https://azure-devops/*
// @author       Shay Cohen
// @grant        none
// @namespace https://greasyfork.org/users/313606
// @downloadURL https://update.greasyfork.org/scripts/404588/TFS%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/404588/TFS%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Can't use this because tfs has iframes in inner text-editors, and the outer "head" doesn't apply
    //$head.append(('<style>.tfsScriptRtl { direction: rtl !important; text-align: right; }</style>'));

	// You should leave the one you want, and comment out the other one
    var rtlRgx = new RegExp("[\u0590-\u05ff]"); // any Hebrew
    //var rtlRgx = new RegExp("^[^a-zA-Z]*[\u0590-\u05ff]"); // Hebrew before any English

    var checkOne = function(e, txt) {
        if(rtlRgx.test(txt)) {
            if(!e.fixedByScript) {
                e.fixedByScript = true;
                e.prevDir = e.dir;
                e.dir = "rtl";
                var $e = $(e);
                e.prevAlign = $e.css("text-align");
				if(e.prevAlign == "left")
					$e.css("text-align", "right");
            }
        } else {
			if(e.fixedByScript) {
				e.fixedByScript = false;
				e.dir = e.prevDir;
				if(e.prevAlign == "left")
					$(e).css("text-align", e.prevAlign);
			}
        }
    };

    var checkAll = function() {
        $("body *:not(:has(*))").each(function(i, e) {
            checkOne(e, e.innerText);
        });
        $("body input[type='text']").each(function(i, e) {
            checkOne(e, e.value);
        });
    };

    setInterval(checkAll, 500);
})();