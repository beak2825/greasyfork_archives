// ==UserScript==
// @name         CSS rules utilities
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  functions allowing to get the CSS rules applied to an element
// @author       CoStiC
// @match        *://*/*
// @grant        none
// ==/UserScript==

function findCssRules(el) {
    var sheets = document.styleSheets, ret = [];
    el.matches = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector;
    for (var i in sheets) {
        var rules = sheets[i].rules || sheets[i].cssRules;
        for (var r in rules) {
            if (el.matches(rules[r].selectorText)) {
                ret.push(rules[r].cssText);
            }
        }
    }
    return ret;
}

function modCssRules(el, newRule, frDoc) {
    if (!frDoc || (frDoc === window)) frDoc = window.document;
    let elHover = "",
        sheets = frDoc.styleSheets;

    if (el !== null) {
        el.matches = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector;
        for (let sheet of sheets) {
            var rules = sheet.rules || sheet.cssRules;
            for (let rule of rules) {
                if (rule.type === 1) {
                    if (el.matches(rule.selectorText)) {

                        for (let newProp in newRule.cssNormal) {
                            rule.style[newProp] = newRule.cssNormal[newProp];
                        }

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
    }

    if (elHover !== "") {
        let newHoverStyle = document.createElement('style'),
            hoverRule = document.createTextNode(elHover);
        newHoverStyle.appendChild(hoverRule);
        document.head.appendChild(newHoverStyle)
        //sheets[sheets.length - 1].insertRule(elHover);
    };
}