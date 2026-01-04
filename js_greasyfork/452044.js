// ==UserScript==
// @name         CSC Flip Checker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  This script reminds reviewers to flip the ticket to CSC where necessary
// @author       Kanan Ibrahimov (ibrkanan@amazon.com)
// @match        https://argus.aka.amazon.com/
// @icon
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452044/CSC%20Flip%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/452044/CSC%20Flip%20Checker.meta.js
// ==/UserScript==
'use strict';

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
        return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('#csc-text {padding: 7px; background-color: rgba(255, 82, 82, 1); color: white; font-size:15px; animation: pulse 1500ms infinite;} @keyframes pulse {0% {box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7);}100% {box-shadow: 0 0 0 10px rgba(255, 82, 82, 0);}}');


window.addEventListener('load', () => {

    var divCheckingInterval = setInterval(function() {

        if (document.querySelector("#modalLoader").style.display != "none") {

            if (document.querySelector("#dtResources") === null) {

                if (document.querySelector(".summary-text").style.display != "none") {


                    setTimeout(function() {
                    document.querySelector('.md-tab:nth-child(3)').click();
                    }, 500);
                    setTimeout(function() {
                        document.querySelector('.md-tab:nth-child(1)').click();
                    }, 700);


                    const arr = ["explosive", "toxic", "health_hazard", "corrosive", "irritant", "flammable", "ah222a", "ah227b", "ah229a", "ah314c", "ah318c", "ah417", "auh006", "auh019", "auh032", "auh070", "c01", "c04", "c07", "c10", "c13", "c16", "euh014", "euh029", "euh044", "euh070", "euh201a", "euh204", "euh207", "euh208b", "euh208e", "euh208h", "euh208k", "euh208n", "euh208q", "euh208t", "euh209a", "h200", "h203", "h206", "h220", "h223", "h226", "h229", "h232", "h242", "h252", "h270", "h280", "h300", "h303", "h310", "h313", "h316", "h319", "h331", "h334", "h340", "h350i", "h360d", "h360fd", "h361f", "h370", "h373", "h402", "h412", "seh200", "seh224", "seh240", "seh260", "seh280", "seh304", "seh318", "seh350", "seh372", "seh420", "wgk3", "ah223a", "ah227c", "ah314a", "ah318a", "ah415", "ah500", "auh014", "auh029", "auh044", "auh071", "c02", "c05", "c08", "c11", "c14", "euh001", "euh018", "euh031", "euh059", "euh071", "euh202", "euh205", "euh208", "euh208c", "euh208f", "euh208i", "euh208l", "euh208o", "euh208r", "euh208x", "euh210", "h201", "h204", "h207", "h221", "h224", "h227", "h230", "h240", "h250", "h260", "h271", "h281", "h301", "h304", "h311", "h314", "h317", "h320", "h332", "h335", "h341", "h351", "h360df", "h361", "h361fd", "h371", "h400", "h410", "h413", "seh220", "seh228", "seh250", "seh270", "seh290", "seh314", "seh334", "seh360", "seh400", "wgk1", "ngk", "ah227a", "ah227d", "ah314b", "ah318b", "ah416", "auh001", "auh018", "auh031", "auh066", "c00", "c03", "c06", "c09", "c12", "c15", "euh006", "euh019", "euh032", "euh066", "euh201", "euh203", "euh206", "euh208a", "euh208d", "euh208g", "euh208j", "euh208m", "euh208p", "euh208s", "euh209", "euh401", "h202", "h205", "h208", "h222", "h225", "h228", "h231", "h241", "h251", "h261", "h272", "h290", "h302", "h305", "h312", "h315", "h318", "h330", "h333", "h336", "h350", "h360", "h360f", "h361d", "h362", "h372", "h401", "h411", "h420", "seh222", "seh229", "seh251", "seh271", "seh300", "seh317", "seh340", "seh370", "seh410", "wgk2"];
                    let resultArr = [];
                    let temp = document.getElementsByClassName("ng-scope");
                    for (let i = 0; i < arr.length; i++) {
                        const arrElement = arr[i];
                        checkElement(arrElement);
                    }

                    function checkElement(arrElement) {
                        for (let i = 0; i < temp.length; i++) {
                            if (temp[i].textContent.includes(`${arrElement}`)) {
                                if (document.querySelector("#dtQuickCodesUp").style.display != "none") {
                                if (document.querySelector("#csc-text") === null) {
                                document.querySelector('.summary-text').innerHTML += '<p id="csc-text"> Flip to CSC </p>'
                                }
                               }
                                return;
                            }
                        }
                    }




                }
            }
        }


    });



})();