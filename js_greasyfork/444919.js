// ==UserScript==
// @name         Sparql to QuickStatements
// @namespace    https://greasyfork.org/users/21515
// @version      0.1.1
// @description  Copy commands from Sparql to QuickStatements
// @author       CennoxX
// @homepage     https://github.com/CennoxX/userscripts
// @supportURL   https://github.com/CennoxX/userscripts/issues/new?title=[Sparql%20to%20QuickStatements]%20
// @match        https://query.wikidata.org/
// @match        https://quickstatements.toolforge.org/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikidata.org
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444919/Sparql%20to%20QuickStatements.user.js
// @updateURL https://update.greasyfork.org/scripts/444919/Sparql%20to%20QuickStatements.meta.js
// ==/UserScript==
/* jshint esversion: 10 */
/* eslint quotes: ["warn", "double", {"avoidEscape": true}] */
/* eslint curly: "off" */

(function() {
    "use strict";
    if (location.host == "query.wikidata.org") {
        GM_setValue("qsLastTimeOpened",0);
        var oldResponse = "";
        var mainLoop = setInterval(function(){
            var response = document.getElementById("response-summary").innerText;
            if (response && oldResponse != response){
                oldResponse = response;
                console.clear();
                if (!document.getElementById("qs-run")){
                    addQSButton();
                }
            }
        }, 500);

        function addQSButton(){
            var navbar = document.getElementsByClassName("navbar navbar-default result")[0].getElementsByClassName("nav navbar-nav navbar-right")[0];
            var liNode = document.createElement("li");
            liNode.innerHTML = '<a id="qs-run" class="btn" data-toggle="modal" title="Copy to QuickStatements"><span class="fa fa-rocket"></span><span> QuickStatements</span></a>';
            navbar.appendChild(liNode);
            liNode.addEventListener("click", function() {startQuickStatements();});
        }

        function startQuickStatements(){
            var commands = document.querySelector(".fixed-table-body tbody").innerText;
            GM_setValue("quickstatements",commands);
            document.querySelector("#qs-run>span").style.color="#14866d";
            var qsLastTimeOpened = GM_getValue("qsLastTimeOpened");
            var oneSecondbefore = new Date().getTime() - 1000;
            if (oneSecondbefore > qsLastTimeOpened){
                window.open("https://quickstatements.toolforge.org/#/batch", "_blank").focus();
            }
        }

    } else if (location.host == "quickstatements.toolforge.org"){
        var quickstatements = "";
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("input", false, true);
        var checkForChanges = setInterval(function() {
            var quickForm = document.querySelector("textarea.form-control");
            if (quickForm){
                GM_setValue("qsLastTimeOpened", new Date().getTime());
            }
            if (quickstatements) {
                if (!quickForm.innerHTML.includes(quickstatements)){
                    quickForm.innerHTML += quickstatements + "\n";
                    quickForm.innerHTML = quickForm.innerHTML.replace("||\n","||");
                    quickForm.dispatchEvent(evt);
                }
                GM_setValue("quickstatements","");
                quickstatements = "";
            }else{
                quickstatements = GM_getValue("quickstatements");
            }
        }, 250);
    }
})();