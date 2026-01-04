// ==UserScript==
// @name         addQALink
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  try to take over the world!
// @author       You
// @match        http://matchlandserver.milamit.cz/*
// @match        http://bakeacakeserver.milamit.cz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373654/addQALink.user.js
// @updateURL https://update.greasyfork.org/scripts/373654/addQALink.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.querySelector("#site-name>a") != null){
        if (document.querySelector("#site-name>a").innerHTML == "Django administration" && /admin\/login/.exec(document.location.href) == null){

            var QAElem = document.createElement("h1");
            QAElem.id = "QA";
            var QAElem_a = document.createElement("a");
            if (/matchland/.exec(document.location.href) != null){
                if (/milamit.cz\/matchland-qa\//.exec(document.location.href) != null){
                    QAElem_a.setAttribute("href", "/matchland/admin");
                    QAElem_a.innerHTML = "Go to Prod";
                }
                else{
                    QAElem_a.setAttribute("href", "/matchland-qa/admin");
                    QAElem_a.innerHTML = "Go to QA";
                }
            }
            else {
                if (/milamit.cz\/bakeacake-qa\//.exec(document.location.href) != null){
                    QAElem_a.setAttribute("href", "/bakeacake/admin");
                    QAElem_a.innerHTML = "Go to Prod";
                }
                else{
                    QAElem_a.setAttribute("href", "/bakeacake-qa/admin");
                    QAElem_a.innerHTML = "Go to QA";
                }
            }

            QAElem.append(QAElem_a);
            document.querySelector("#branding").append(QAElem);

            document.querySelectorAll("#branding>h1").forEach(function(elem){
                elem.setAttribute("style", "display:inline-block;");
            });
            var styleElem = document.createElement("style");
            styleElem.innerHTML = "#QA>a:hover {color:white!important;}";
            document.querySelector("head").append(styleElem);
        }
    }
})();