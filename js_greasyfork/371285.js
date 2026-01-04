// ==UserScript==
// @name         Mturk Group IDs
// @description  Adds group ID to mturk hit frames
// @author       DCI
// @namespace    https://www.redpandanetwork.org
// @version      1.4
// @include      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/371285/Mturk%20Group%20IDs.user.js
// @updateURL https://update.greasyfork.org/scripts/371285/Mturk%20Group%20IDs.meta.js
// ==/UserScript==

if (~window.location.toString().indexOf("worker.mturk.com/projects/")){
    window.addEventListener("message", function(e){
        if (e.data == "I'm here!"){
            let iframe = document.getElementsByTagName("iframe")[0];
            let groupId = location.toString().split("projects/")[1].split("/")[0];
            iframe.contentWindow.postMessage("&groupId=" + groupId, "*");
        }
    });
}
if ((window.location != window.parent.location) && (!~window.location.toString().indexOf("externalSubmit"))){
    if (!~window.location.toString().indexOf("&groupId=")){
        window.addEventListener("message", function(e){
            if (~e.data.indexOf("&groupId=")){
                location.replace(location + e.data);
            }
        });
    }
    window.parent.postMessage("I'm here!", '*');
}