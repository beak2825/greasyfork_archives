// ==UserScript==
// @name         pbbBan - Schwarzkopf_Henkal
// @namespace    http://49.234.17.22:8205/
// @version      0.0.4
// @description  Forbid posts!
// @author       Schwarzkopf_Henkal
// @match        https://pbb.akioi.ml/
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/424327/pbbBan%20-%20Schwarzkopf_Henkal.user.js
// @updateURL https://update.greasyfork.org/scripts/424327/pbbBan%20-%20Schwarzkopf_Henkal.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var oldfmtFeed=fmtFeed;
    var fbd_uid=new Set([72468]);
    var fbd_rid=new Set(["trashbin"])
    fmtFeed=(feed,hasId)=>{
        if(fbd_uid.has(feed.user.uid)&&fbd_rid.has(feed.roomId)){
            console.log(feed);
            return;
        }
        return oldfmtFeed(feed,hasId);
    }
})();