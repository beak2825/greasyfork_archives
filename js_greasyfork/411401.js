// ==UserScript==
// @name         Attack Online Highlighter
// @namespace    tcnicn.atkonline
// @version      1.2.0
// @author       Tcnicn
// @description  Highlights online Players.
// @match        https://www.torn.com/loader.php*
// @require      https://greasyfork.org/scripts/390917-dkk-torn-utilities/code/DKK%20Torn%20Utilities.js?version=744690
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/411401/Attack%20Online%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/411401/Attack%20Online%20Highlighter.meta.js
// ==/UserScript==


/* --------------------
CODE - EDIT ON OWN RISK
-------------------- */
initScript("attackOnline", "Attack Online Highlighter", "AOE", true);
setDebug(false);

function start() {
    if (hasSearchTag("sid", "attack")) {
        var target = hasSearchTag("user2ID");
        debug("target", target);
        if (!target) return

        observeMutations(document, ".coreWrap___2yej4", false, (mut, obs) => {
            var container = $(".playerArea___3T2uG")[1];
            if (!container) return
            obs.disconnect();

            var box = document.createElement("div");
            box.style.cssText = "background: white;height: 40px;width: 50%;position: absolute;z-index: 10;display: flex;align-items: center;padding-left: 15px;border: 1px solid black;"
            box.innerText = "Loading Online Status";

            container.appendChild(box);

            var expName = $(".user-name")[1].innerText;

            check(target, expName, (ok, status, name) => {
                if(ok) {
                    box.innerText = name + " is " + status;
                } else {
                    box.innerText = status;
                }
                switch (status) {
                    case "Online":
                        box.style.background = "limegreen"
                        break;
                    case "Idle":
                        box.style.background = "yellow";
                        break;
                    case "Offline":
                        box.style.background = "gray";
                        break;
                }
            })
        }, { childList: true, subtree: true });


    }
    debug("skipped")
}


function check(id, expName, callback) {
    setTimeout(function(){
        sendAPIRequest("user", id, "profile").then(function(oData) {
            debug("response", oData);
            if (!oData){
                debug("oData is not found")
                return callback(false, "ERROR API (UNKNOWN)");
            }
            if (!oData.last_action) {
                debug("api returned error")
                return callback(false, "ERROR API (" + oData.error.code + ")");
            }
            debug("Loaded information from the api!");

            var status = oData.last_action.status;
            var name = oData.name;

            debug(`Found status ${status} for player ${name}.`)

            if (expName !== name) {
                debug(`Name mismatch: expected ${expName} got ${name}.`)
                return callback(false, "Name mismatch");
            }

            callback(true, status, name);
        });
    }, 1000);
}

function hasSearchTag(tag, value) {
    var params = new URL(window.location.href).searchParams;

    return !value ? params.get(tag) : params.get(tag) == value;
}

start();
