// ==UserScript==
// @name         TTG Upload Template Manager
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  save & load upload templates
// @author       You
// @match        https://totheglory.im/upload.php*
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/411348/TTG%20Upload%20Template%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/411348/TTG%20Upload%20Template%20Manager.meta.js
// ==/UserScript==

function takeSnapshot() {
    return {
        "name": unsafeWindow.document.querySelector('#upload tbody input[name="name"]').value,
        "subtitle": unsafeWindow.document.querySelector('#upload tbody input[name="subtitle"]').value,
        "highlight": unsafeWindow.document.querySelector('#upload tbody input[name="highlight"]').value,
        "descr": unsafeWindow.document.querySelector('#upload tbody textarea[name="descr"]').value,
        "type": unsafeWindow.document.querySelector('#upload tbody select[name="type"]').value,
        "anonymity": unsafeWindow.document.querySelector('#upload tbody select[name="anonymity"]').value,
        "nodistr": unsafeWindow.document.querySelector('#upload tbody select[name="nodistr"]').value,
        "imdb_c": unsafeWindow.document.querySelector('#upload tbody input[name="imdb_c"]').value
    };
}

function applySnapshot(snapshot) {
    unsafeWindow.document.querySelector('#upload tbody input[name="name"]').value = snapshot.name;
    unsafeWindow.document.querySelector('#upload tbody input[name="subtitle"]').value = snapshot.subtitle;
    unsafeWindow.document.querySelector('#upload tbody input[name="highlight"]').value = snapshot.highlight;
    unsafeWindow.document.querySelector('#upload tbody textarea[name="descr"]').value = snapshot.descr;
    unsafeWindow.document.querySelector('#upload tbody select[name="type"]').value = snapshot.type;
    unsafeWindow.document.querySelector('#upload tbody select[name="anonymity"]').value = snapshot.anonymity;
    unsafeWindow.document.querySelector('#upload tbody select[name="nodistr"]').value = snapshot.nodistr;
    unsafeWindow.document.querySelector('#upload tbody input[name="imdb_c"]').value = snapshot.imdb_c;
}

function loadSnapshot(snapshotName, snapshots) {
    applySnapshot(snapshots[snapshotName]);
    console.log("snaphost for " + snapshotName + " was loaded");
}

function saveSnapshot(snapshotName, snapshots) {
    snapshots[snapshotName] = takeSnapshot();
    console.log("snapshot was saved to " + snapshotName);
    return snapshots;
}

function deleteSnapshot(snapshotName, snapshots) {
    delete snapshots[snapshotName];
    console.log("snaphost for " + snapshotName + " was deleted");
    return snapshots;
}

function createSnapshot(snapshotName, snapshots) {
    if (snapshots.hasOwnProperty(snapshotName)) {
        throw new Error("snaphost for " + snapshotName + " already exists");
    }
    snapshots[snapshotName] = takeSnapshot();
    console.log("snaphost for " + snapshotName + " was created");
    return snapshots;
}

function drawTemplateMenu(snapshots, loadCallback, saveCallback, deleteCallback, createCallback) {
    let uploadTable = unsafeWindow.document.querySelector("#upload tbody");
    let templateRow = uploadTable.insertRow(0);
    let headingColumn = templateRow.insertCell();
    headingColumn.classList.add("heading");
    headingColumn.setAttribute("valign", "top");
    headingColumn.setAttribute("align", "right");
    headingColumn.appendChild(unsafeWindow.document.createTextNode("Templates"));
    let bodyColumn = templateRow.insertCell();
    let templateList = unsafeWindow.document.createElement("ul");
    const drawTemplateEntry = snapshotName => {
        let template = unsafeWindow.document.createElement("li");
        let templateName = unsafeWindow.document.createElement("a");
        templateName.addEventListener("click", event => loadCallback(snapshotName));
        templateName.text = snapshotName;
        template.appendChild(templateName);
        template.appendChild(unsafeWindow.document.createTextNode(" ["));
        let templateSaveAction = unsafeWindow.document.createElement("a");
        templateSaveAction.addEventListener("click", event => saveCallback(snapshotName));
        templateSaveAction.text = "Save";
        template.appendChild(templateSaveAction);
        template.appendChild(unsafeWindow.document.createTextNode(" or "));
        let templateRemoveAction = unsafeWindow.document.createElement("a");
        templateRemoveAction.addEventListener("click", event => {
            deleteCallback(snapshotName);
            template.remove();
        });
        templateRemoveAction.text = "Remove";
        template.appendChild(templateRemoveAction);
        template.appendChild(unsafeWindow.document.createTextNode("]"));
        templateList.insertAdjacentElement("afterbegin", template);
    };
    for (let snapshotName in snapshots) {
        drawTemplateEntry(snapshotName);
    }
    let templateCreator = unsafeWindow.document.createElement("li");
    let templateName = unsafeWindow.document.createElement("input");
    templateName.setAttribute("type", "text");
    templateName.setAttribute("placeholder", "Template Name");
    templateCreator.appendChild(templateName);
    templateCreator.appendChild(unsafeWindow.document.createTextNode(" ["));
    let templateNewAction = unsafeWindow.document.createElement("a");
    templateNewAction.addEventListener("click", event => {
        if (/^\s*$/.test(templateName.value)) {
            console.log("\"" + templateName.value + "\" is illegal for a template name");
            return;
        }
        createCallback(templateName.value);
        drawTemplateEntry(templateName.value);
        templateName.value = "";
    });
    templateNewAction.text = "Add";
    templateCreator.appendChild(templateNewAction);
    templateCreator.appendChild(unsafeWindow.document.createTextNode("]"));
    templateList.appendChild(templateCreator);
    bodyColumn.appendChild(templateList);
}

(function() {
    'use strict';

    let snapshots = JSON.parse(GM_getValue("ttguploadsnapshots", "{}"));
    let loadCallback = snapshotName => loadSnapshot(snapshotName, snapshots);
    let saveCallback = snapshotName => GM_setValue("ttguploadsnapshots", JSON.stringify(snapshots = saveSnapshot(snapshotName, snapshots)));
    let deleteCallback = snapshotName => GM_setValue("ttguploadsnapshots", JSON.stringify(snapshots = deleteSnapshot(snapshotName, snapshots)));
    let createCallback = snapshotName => GM_setValue("ttguploadsnapshots", JSON.stringify(snapshots = createSnapshot(snapshotName, snapshots)));
    drawTemplateMenu(snapshots, loadCallback, saveCallback, deleteCallback, createCallback);
})();