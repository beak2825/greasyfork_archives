// ==UserScript==
// @name         Simplify QuickStatements Import Buttons
// @namespace    https://greasyfork.org/users/21515
// @version      0.2.0
// @description  Simplify the import buttons of QuickStatements into one button
// @author       CennoxX
// @contact      cesar.bernard@gmx.de
// @homepage     https://github.com/CennoxX/userscripts
// @supportURL   https://github.com/CennoxX/userscripts/issues/new?title=[Simplify%20QuickStatements%20Import%20Buttons]%20
// @match        https://quickstatements.toolforge.org/*
// @icon         https://quickstatements.toolforge.org/favicon.ico
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/434547/Simplify%20QuickStatements%20Import%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/434547/Simplify%20QuickStatements%20Import%20Buttons.meta.js
// ==/UserScript==
/* jshint esversion: 8 */
/* eslint curly: "off" */
var buttonClicks = 0;
setInterval(()=>{
    var button_v1 = document.querySelector(".btn[tt=dialog_import_v1]");
    var button_csv = document.querySelector(".btn[tt=dialog_import_csv]");
    var button_all = document.querySelector("button:nth-child(3)");
    if (button_v1 && button_csv && !button_all){
        document.addEventListener("keydown", function (e) {
            if (e.ctrlKey && (event.keyCode == 10 || event.keyCode == 13)){
                button_csv.click();
                button_v1.click();
            }
        }, false);
        button_all = button_v1.cloneNode();
        button_all.attributes.removeNamedItem("tt");
        button_all.innerHTML = "Anweisungen importieren";
        button_all.onmousedown = function(){
            button_csv.click();
            button_v1.click();
        };
        button_v1.parentNode.append(button_all);
        button_v1.style.display = "none";
        button_csv.style.display = "none";
        unsafeWindow.alert = function (str) {
            if (str == "No valid commands found"){
                setTimeout(()=>{
                    buttonClicks++;
                    if (buttonClicks % 2 == 0 && document.querySelector("textarea")){
                        alert("No valid commands found");
                    }
                }, 100);
            }
        };
    }
},100);
