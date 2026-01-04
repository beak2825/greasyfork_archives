// ==UserScript==
// @name         Debug events tagCo
// @namespace    http://seenaptic.com/
// @version      0.5.1
// @description  Debug TC events
// @author       BAMF Consulting
// @match        *://*/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/374403/Debug%20events%20tagCo.user.js
// @updateURL https://update.greasyfork.org/scripts/374403/Debug%20events%20tagCo.meta.js
// ==/UserScript==

function overrideTcEvents(){
    if(typeof window.overrideFuncs == "undefined"){
        window.overrideFuncs = [];
    }
    let tc_events = Object.getOwnPropertyNames(window).filter(function (p) {
                    return typeof window[p] === 'function';
                }).filter(function (p) {
                    return p.match(/tc_events_[0-9]+/)
                });
    for (let i = 0; i < tc_events.length; i++) {
        let func_name = tc_events[i];
        if(typeof window.overrideFuncs[func_name] == 'undefined') {
            console.log('%c overriding '+func_name,"background-color:#005555; color: #ffffff");
            window.overrideFuncs[func_name] = window[func_name];
            window[func_name] = function (tc_elt, tc_id_event, tc_array_events) {
                console.log("%c------ TC EVENT ------","color:#FF4444;background-color:#000000;");
                console.log('%c ' + func_name, 'background-color:#eb0149; color: #ffffff');
                console.log(tc_id_event, JSON.parse(JSON.stringify(tc_array_events)));
                return window.overrideFuncs[func_name](tc_elt, tc_id_event, tc_array_events);
            }
        }
        window.clearInterval(window.orinterval);
    }
}

window.orinterval = window.setInterval(overrideTcEvents,100);
window.setTimeout(function(){window.clearInterval(window.orinterval);},5000);
