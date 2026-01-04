// ==UserScript==
// @name         OzBargain [Live Action] Change title on new items
// @namespace    PAEz
// @version      0.11
// @description  Change title on new items so that when the page is Pinned the tab will get that little glow notification
// @author       PAEz
// @match        https://www.ozbargain.com.au/live
// @grant       GM_addStyle
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/411319/OzBargain%20%5BLive%20Action%5D%20Change%20title%20on%20new%20items.user.js
// @updateURL https://update.greasyfork.org/scripts/411319/OzBargain%20%5BLive%20Action%5D%20Change%20title%20on%20new%20items.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
#livebody tr.unseen {
    background:#ddd;
}
`);

    var count = 0;

    // Set the name of the hidden property and the change event for visibility
    var hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }

    function handleVisibilityChange() {
        if (!document[hidden]) {

            var list=Array.from(document.querySelectorAll("#livebody tr.type-deal.unseen"));
            list.forEach(item => item.classList.remove('unseen'));

            list=Array.from(document.querySelectorAll("#livebody tr:not(.type-ad)"));
            list.length=count;
            list.forEach(item => item.classList.add('unseen'));

            count = 0;
            document.title = 'Live Action - OzBargain';
        }
    }

    document.addEventListener(visibilityChange, handleVisibilityChange, false);

    OzB.live.handleResponseOriginal=OzB.live.handleResponse;

    OzB.live.handleResponse =
        function (data) {
        if (data.records.length && document[hidden]) {
            data.records.forEach((item) => {if(item.type!="Ad") count++});
            if (count) document.title = `Live Action (${count}) - OzBargain`;
        }
        OzB.live.handleResponseOriginal(data);
    }
})();