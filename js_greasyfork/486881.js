// ==UserScript==
// @name         Jira Demo
// @namespace    http://tampermonkey.net/
// @version      2024-02-12
// @description  Jira demo
// @author       @chenwentao5
// @match        http://jira.it.chehejia.com/browse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chehejia.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/486881/Jira%20Demo.user.js
// @updateURL https://update.greasyfork.org/scripts/486881/Jira%20Demo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var obj = {};
    //var array = [{"type" : "requirement"}, {"type" : "fault"}];
    var array = [{"type" : "requirement"}];
    obj.types = array;
    obj.question = document.querySelector("#summary-val").textContent;
    GM_xmlhttpRequest ({
        method:     "POST",
        url:        "http://tool-hub-dev.inner.chj.cloud/get_jira",
        data:       JSON.stringify(obj),
        headers:    {
            "Content-Type": "application/json",
            "traceId": "test",
            "region-account": "test"
        },
        onload:     function (response) {
            var objects = JSON.parse(response.response)["data"]["objects"];
            var requirements = objects["requirement"];
            var faults = objects["fault"];
            var demoDiv = document.createElement("div");
            demoDiv.setAttribute("style", "border: 2px solid black");
            var requirementDiv = document.createElement("div");
            requirementDiv.setAttribute("style", "margin-bottom:20px");
            var requirementP = document.createElement("p");
            requirementP.innerHTML = "相关需求:";
            requirementP.setAttribute("style", "font-weight: bold; margin: 0 auto");
            requirementDiv.append(requirementP);
            for (let i in requirements) {
                let item = requirements[i];
                let id = item["id"];
                if (id == document.querySelector("#key-val").rel) {
                    continue;
                }
                let data = item["data"];
                let key = data["key"];
                let a = document.createElement("a");
                a.href = "http://jira.it.chehejia.com/browse/" + key;
                a.target = '_blank';
                a.innerHTML = key + ": " + data["summary"];
                let p = document.createElement("p");
                p.setAttribute("style", "margin: 0 auto");
                p.appendChild(a);
                requirementDiv.append(p);
                if (requirementDiv.childElementCount == 6) {
                    break;
                }
            }
            demoDiv.append(requirementDiv);
            var faultDiv = document.createElement("div");
            var faultP = document.createElement("p");
            faultP.innerHTML = "相关缺陷:";
            faultP.setAttribute("style", "font-weight: bold; margin: 0 auto");
            faultDiv.append(faultP);
            for (let i in faults) {
                let item = faults[i];
                let id = item["id"];
                if (id == document.querySelector("#key-val").rel) {
                    continue;
                }
                let data = item["data"];
                let key = data["key"];
                let a = document.createElement("a");
                a.href = "http://jira.it.chehejia.com/browse/" + key;
                a.target = '_blank';
                a.innerHTML = key + ": " + data["summary"];
                let p = document.createElement("p");
                p.setAttribute("style", "margin: 0 auto");
                p.appendChild(a);
                faultDiv.append(p);
                if (faultDiv.childElementCount == 6) {
                    break;
                }
            }
            //demoDiv.append(faultDiv);
            $("#viewissuesidebar").get()[0].appendChild(demoDiv);
        }
    });
})();