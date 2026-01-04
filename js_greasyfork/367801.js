// ==UserScript==
// @name         device_id emitter / username emitter (stage [2])
// @namespace    http://tampermonkey.net/
// @version      0.5.3.1
// @description  try to take over the world!
// @author       You
// @match        http://matchlandserver.milamit.cz/matchland*/admin/matchlandios/helpdeskmessage/*
// @match        http://bakeacakeserver.milamit.cz/bakeacake*/admin/bakeacakeios/helpdeskmessage/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367801/device_id%20emitter%20%20username%20emitter%20%28stage%20%5B2%5D%29.user.js
// @updateURL https://update.greasyfork.org/scripts/367801/device_id%20emitter%20%20username%20emitter%20%28stage%20%5B2%5D%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll("h1").forEach(
        function(o){
            if (o.innerHTML.match(/Change help desk message/)) {
                var idUsername = document.getElementById("id_username").value;
                if (idUsername == "noname"){
                    idUsername = /from (.+)/gm.exec(document.getElementById("id_subj").value)[1]
                }
                else{
                    idUsername = document.getElementById("id_username").value;
                }
                var i = /([\d|.]+)([\w]*)(?=\n ExtendedVersion)/gm.exec(document.getElementById("id_body").value)[1];
                if ( parseInt(i[0]) >= 1 && parseInt(i[1]) >= 3 ) {

                    var newHref = document.getElementById("add_id_reply").getAttribute("href") + "&username=" + idUsername;
                    document.getElementById("add_id_reply").setAttribute("href", newHref);
                }
                else {
                    if (document.getElementById("add_id_reply") != undefined){
                        var newHref1 = document.getElementById("add_id_reply").getAttribute("href") + "&deviceid=" + idUsername;
                        document.getElementById("add_id_reply").setAttribute("href", newHref1);
                    }
                }

                var newHrefChange = document.getElementById("change_id_reply")+ "&changeMess";
                document.getElementById("change_id_reply").setAttribute("href", newHrefChange);
            }
        });

})();