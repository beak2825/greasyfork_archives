// ==UserScript==
// @name         Zeitbuchungs Summenbilder
// @namespace    http://kanojo.de/
// @version      2026-01-12
// @description  Sum the blocks and a daily total
// @author       Dario Ernst
// @match        https://zeiterfassung.haufe.group/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=haufe.group
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492141/Zeitbuchungs%20Summenbilder.user.js
// @updateURL https://update.greasyfork.org/scripts/492141/Zeitbuchungs%20Summenbilder.meta.js
// ==/UserScript==

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function getElementsByXPath(xpath, parent)
{
    let results = [];
    let query = document.evaluate(xpath, parent || document,
                                  null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    while ( (node = query.iterateNext()) ) {
        results.push(node);
    }
    return results;
}


function CalculateAndAppendTimes(titleElementId) {
    const elm = document.getElementById("__xmlview0--idEventsTable-tblBody");
    if(!elm) return;
    //console.log("Have table element to calculate times");
    const timeElements = getElementsByXPath('//tbody//tr/td[4]//span', elm);
    //console.log("got timeElements", timeElements);

    var times = [];
    for(const timeElement of timeElements) {
        //console.log("pushing", timeElement.innerText);
        times.push(timeElement.innerText);
    }
    if(times.length%2 != 0) {
        const now = new Date();
        times.push(now.toLocaleTimeString());
    }

    //console.log("got times", times);


    let elem = document.getElementById("FunkyScriptTimeDisplayThingy");
    if(!elem) {
        //console.log("setting elem id...");
        elem = getElementsByXPath('//span[text()="Zeitereignisse"]')[0];
        elem.id = "FunkyScriptTimeDisplayThingy";
    }

    let total = 0;
    elem.innerHTML = "Worked so far ... ";
    var subtract_breaks = 0;
    for(var i=0; i<times.length; i=i+2) {
        const diff = Date.parse("2020-01-01T"+times[i+1]) - Date.parse("2020-01-01T"+times[i]);
        var subtract_text = "";
        //console.log("from", times[i], "to", times[i+1], "is diff", diff);
        total += diff;
        let ss = Math.floor(diff / 1000) % 60;
        let mm = Math.floor(diff / 1000 / 60) % 60;
        let hh = Math.floor(diff / 1000 / 60 / 60);
        if(hh >= 6 && hh <9) {
            subtract_breaks = subtract_breaks + 30;
            subtract_text = " (-30m☕️)";
        } else if(hh>=9) {
            subtract_breaks = subtract_breaks + 45;
            subtract_text = " (-45m☕️)";

        }
        //console.log("diff format", hh+":"+mm);
        //console.log("in element", timeElements[i]);
        if(i>0) elem.innerHTML += " + ";
        elem.innerHTML += " "+hh+"h"+mm+"m"+ss+"s"+subtract_text;
    }
    total = total - subtract_breaks*60*1000;
    let ss = Math.floor(total / 1000) % 60;
    let mm = Math.floor(total / 1000 / 60) % 60;
    let hh = Math.floor(total / 1000 / 60 / 60);
    elem.innerHTML += " = <b>"+hh+"h"+mm+"m"+ss+"s</b> (incl. "+subtract_breaks+"min breaks)";
};

(function() {
    'use strict';

    const observer = new MutationObserver(mutations => {
        for(let mut of mutations) if(mut.target.id=="__title3-inner" || mut.target.id=="__title2-inner" || mut.target.id=="FunkyScriptTimeDisplayThingy") return;

        /* for(let mut of mutations) console.log("my target id", mut.target.id);
        for(let mut of mutations) if(mut.target.id=="sap-ui-destroyed-SAMLDialog-footer") window.location.reload(); */

        CalculateAndAppendTimes();
        console.log("calc'ed");
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    setInterval(CalculateAndAppendTimes, 2500);

})();