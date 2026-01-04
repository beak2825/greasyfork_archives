// ==UserScript==
// @name         parici Sopra Steria DEV
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://parici.soprasteria.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395519/parici%20Sopra%20Steria%20DEV.user.js
// @updateURL https://update.greasyfork.org/scripts/395519/parici%20Sopra%20Steria%20DEV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const modCssElements = {
        "selectors": ["[class*='Bandeau']"],
        "rule":{cssNormal:{background:"none"}}
    }

    for (var i = 0; i < top.frames.length; i++) {
        let fr = top.frames[i],
            frWin = top.frames[i].window,
            frDoc = top.frames[i].document,
            frBod = frDoc.body;
        console.log(fr.name);
        if ((frBod) && (frBod.innerText.length > 0)) {
            modCssRules(modCssElements.selectors[0],modCssElements.rule,frDoc);
        }
    }

    let cells = document.querySelectorAll(".cellulePlanning");
    cells.forEach(cell => {
        if((!cell.classList.contains('libelleMoisAncien')) && (!cell.classList.contains('celluleApres'))) {
            let cellDate = cell.id.split("-")[0];
            let yearNum = "", monthNum = "", dayNum = "";
            for (let i = 0; i < cellDate.length; i++) {
                if (i <= 3) {
                    yearNum += cellDate[i]
                } else if(i >= 6) {
                    dayNum += cellDate[i]
                } else {
                    monthNum += cellDate[i]
                }
            }
            monthNum = parseInt(monthNum) - 1;
            let date = new Date(yearNum,monthNum,dayNum),
                shortDay = new Intl.DateTimeFormat('fr-FR', {weekday: "short"}).format(date),
                longDay = new Intl.DateTimeFormat('fr-FR', {weekday: "long"}).format(date)
            cell.classList.add('cellDay', longDay);
            let dayDiv = document.createElement('DIV'),
                content = document.createElement('DIV');
            content.classList.add('cellContent');
            content.appendChild(cell.childNodes[0]);
            dayDiv.classList.add('dayName');
            dayDiv.innerText = shortDay;
            cell.appendChild(dayDiv);
            cell.appendChild(content);
        }
    })
})();

function waitForKeyElements(
selectorTxt, /* Required: The selector string that specifies the desired element(s). */
 actionFunction, /* Required: The code to run when elements are found. It is passed a jNode to the matched element. */
 bWaitOnce /* Optional: If false, will continue to scan for new elements even after the first match is found. */
) {
    var targetNodes, btargetsFound;
    targetNodes = document.querySelectorAll(selectorTxt);

    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they are new.*/
        targetNodes.forEach(function (element) {
            var alreadyFound = element.dataset.found == 'alreadyFound' ? 'alreadyFound' : false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound = actionFunction(element);
                if (cancelFound) btargetsFound = false;
                else element.dataset.found = 'alreadyFound';
            }
        });
    } else {
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
    var timeControl = controlObj[controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval(timeControl);
        delete controlObj[controlKey];
    } else {
        //--- Set a timer, if needed.
        if (!timeControl) {
            timeControl = setInterval(function () {
                waitForKeyElements(selectorTxt,
                                   actionFunction,
                                   bWaitOnce
                                  );
            },
                                      300
                                     );
            controlObj[controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}

function modCssRules(el, newRule, doc) {
    var elHover = "";
    var sheets = doc.styleSheets;
    if (el !== null) {
        el.matches = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector;
        for (var sheet in sheets) {
            var rules = sheets[sheet].rules || sheets[sheet].cssRules;
            for (var rule in rules) {
                if ( (rules[rule].selectorText) && (el.matches(rules[rule].selectorText)) ) {

                    for (let prop in newRule.cssNormal) { rules[rule].style[prop] = newRule.cssNormal[prop] }
                    if (typeof newRule.cssHover !== 'undefined') {
                        var rul = "";
                        for (let propHover in newRule.cssHover) {
                            rul += `${propHover}:${newRule.cssHover[propHover]} !important;`;
                        };
                        elHover = `${rules[rule].selectorText}:hover{${rul}}`;
                    }
                } else {};
            }
        }
    }

    if (elHover !== "") {
        let newHoverStyle = document.createElement('style'),
            hoverRule = document.createTextNode(elHover);
        newHoverStyle.appendChild(hoverRule);
        document.head.appendChild(newHoverStyle)
        //sheets[sheets.length - 1].insertRule(elHover);
    };
}