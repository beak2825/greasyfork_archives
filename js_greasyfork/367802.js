// ==UserScript==
// @name         device_id/username receiver
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  try to take over the world!
// @author       You
// @match        http://matchlandserver.milamit.cz/matchland*/admin/matchlandios/messagetoplayer/add/?_to_field=id&_popup=1*
// @match        http://bakeacakeserver.milamit.cz/bakeacake*/admin/bakeacakeios/messagetoplayer/add/?_to_field=id&_popup=1*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367802/device_idusername%20receiver.user.js
// @updateURL https://update.greasyfork.org/scripts/367802/device_idusername%20receiver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ///
    //
    //
    //
    if (document.location.href.match(/&username=/) != null && document.location.href.match(/&username=/)[0] == "&username="){
        document.getElementById("id_username").value = /&username=([\w\d\-]+)(?=[&]|$)/gm.exec(document.location.href)[1];
        document.getElementById("id_device_id").value = /&username=([\w\d\-]+)(?=[&]|$)/gm.exec(document.location.href)[1];
        document.getElementById("id_body").focus();
    }
    else{
        document.getElementById("id_username").value = /deviceid=([^\&]+)/.exec(document.location.href)[1];
        document.getElementById("id_device_id").value = /deviceid=([^\&]+)/.exec(document.location.href)[1];
        document.getElementById("id_body").focus();
    }
})();