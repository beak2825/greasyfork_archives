// ==UserScript==
// @name         NUSMods Export Planner
// @namespace    http://tampermonkey.net/
// @version      2025-06-03
// @description  Export and import NUS mods' course planner
// @author       Someone
// @match        https://nusmods.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nusmods.com
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528270/NUSMods%20Export%20Planner.user.js
// @updateURL https://update.greasyfork.org/scripts/528270/NUSMods%20Export%20Planner.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var plannerFunctions = window.plannerFunctions = {};

    plannerFunctions.importPlanner = function () {
        if (confirm("Are you sure to overwrite the existing planner with new data?")) {
            var i0 = document.createElement('input');
            var f0;
            i0.type = 'file';
            i0.onchange = e => {
                f0 = e.target.files[0];
                try {
                    var reader = new FileReader();
                    reader.readAsText(f0,'UTF-8');
                    reader.onload = readerEvent => {
                        var content = readerEvent.target.result;
                        localStorage.setItem("persist:planner", content);
                        window.location.reload();
                    }
                } catch (error) {
                    console.error(error);
                    alert(error);
                }
            }
            i0.click();
        }
    }

    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }

    plannerFunctions.exportPlanner = function () {
        var plannerObj = localStorage.getItem("persist:planner");
        download(plannerObj, 'planner.json', 'text/json');
    }

    plannerFunctions.exportPlannerCSV = function () {
        var secModsList = JSON.parse(JSON.parse(localStorage.getItem("persist:moduleBank")).moduleList);
        var allModsList = JSON.parse(JSON.parse(localStorage.getItem("persist:moduleBank")).modules);
        const semList = [null, "Sem 1", "Sem 2", "Special Term I", "Special Term II", "Exemptions"];
        var plannerObj = localStorage.getItem("persist:planner");
        plannerObj = JSON.parse(plannerObj);
        Object.keys(plannerObj).forEach((i) => {plannerObj[i] = JSON.parse(plannerObj[i])});
        var moduleBank = JSON.parse(JSON.parse(localStorage.getItem("persist:moduleBank")).modules);
        var modsList = [];
        Object.keys(plannerObj.modules).forEach((i) => {
            modsList.push(plannerObj.modules[i]);
        });
        modsList.sort((a,b) => {
            if (a.year != b.year) return (a.year < b.year) ? -1 : 1;
            if (a.semester && b.semester && a.semester != b.semester) return (a.semester < b.semester) ? -1 : 1;
            if (a.index != b.index) return (a.index < b.index) ? -1 : 1;
            return 0;
        });
        var csv = 'Year,Semester,Code,Title,Units,Available in,SU\n';
        for (let i = 0; i < modsList.length; i++) {
            csv += (modsList[i].year == "-1" ? "Exempted" : modsList[i].year) + ',';
            var code = modsList[i].moduleCode;
            csv += (semList[modsList[i].semester] ? semList[modsList[i].semester] : "") + ',';
            csv += modsList[i].moduleCode + ',';
            csv += allModsList[code].title + ',';
            csv += allModsList[code].moduleCredit.toString() + ',';
            for (let j = 0; j < secModsList.length; j++) {
                if (secModsList[j].moduleCode == code) {
                   var tempSemList = secModsList[j].semesters;
                   for (let k = 0; k < tempSemList.length; k++) if (typeof tempSemList[k] !== 'string' && !(tempSemList[k] instanceof String)) tempSemList[k] = semList[tempSemList[k]];
                   csv += tempSemList.join(' / ') + ',';
                   break;
                }
            }
            csv += allModsList[code].attributes && allModsList[code].attributes.su ? "Y" : "N";
            csv += '\n';
        }
        download(csv, 'planner.csv', 'text/csv');
    }

    plannerFunctions.clearPlanner = function () {
        if (confirm("Are you ABSOLUTELY SURE that you want to remove all existing data from the planner?")) {
            localStorage.removeItem("persist:planner");
            window.location.reload();
        }
    }

    // https://stackoverflow.com/a/61511955
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

    async function initPlanner() {
        if (document.location.href.startsWith("https://nusmods.com/planner")) {
            console.log('Export planner loading');
            let c = document.createElement("ul");
            c.classList += 'R2Qt7mz2 list-unstyled';
            c.innerHTML = '<li><button type="button" class="btn btn-block btn-outline-primary" onclick="plannerFunctions.exportPlanner();">Export to JSON</button></li><li><button type="button" class="btn btn-block btn-outline-primary" onclick="plannerFunctions.exportPlannerCSV();">Export to CSV</button></li><li><button onclick="plannerFunctions.importPlanner();" class="btn btn-block btn-outline-primary">Import JSON</button></li><li> <button onclick="plannerFunctions.clearPlanner();" class="btn btn-block btn-outline-primary" type="button">Clear Planner</button></li>';
            const h = await waitForElm('header');
            h.after(c);
        }
    }

    // https://stackoverflow.com/a/46428962
    const observeUrlChange = () => {
        let oldHref = document.location.href;
        const body = document.querySelector('body');
        const observer = new MutationObserver(mutations => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                initPlanner();
            }
        });
        observer.observe(body, { childList: true, subtree: true });
    };

    window.onload = observeUrlChange;
    initPlanner();
})();