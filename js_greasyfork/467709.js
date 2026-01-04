// ==UserScript==
// @name        Akeneo codes
// @namespace   https://github.com/BackMarket/akenator-userscript
// @description Add codes to Akeneo tables
// @version     7
// @grant       none
// @match       https://*.cloud.akeneo.com/*
// @downloadURL https://update.greasyfork.org/scripts/467709/Akeneo%20codes.user.js
// @updateURL https://update.greasyfork.org/scripts/467709/Akeneo%20codes.meta.js
// ==/UserScript==

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function observeNodeForEver(node, callback) {
    const observer = new MutationObserver((mutations) => {
        callback(mutations)
    });
    observer.observe(node, { childList: true });
    return observer
}

function addAiCodesToList(nodeList, nodeFilter = node => !node.getAttribute("role")) {
    return nodeList
        .filter(nodeFilter)
        .forEach(aiAttributeListItem => {
            const code = aiAttributeListItem.querySelector("span")?.getAttribute("value");
            if (code && !aiAttributeListItem.alreadyWithCode) {
                const newSpan = document.createElement("span");
                newSpan.append(code);
                newSpan.style.float = "right";
                newSpan.style["margin-left"] = "20px";
                aiAttributeListItem.append(newSpan);
                aiAttributeListItem.alreadyWithCode = true;
            }
        }
    );
}


console.info("[akenator] Starting userscript Akeneo codes");

function addCodes(){
    waitForElm("#input-overlay-root").then((listAncestor) => {
        /**
         * Page layout:
         *  <div id="input-overlay-root">                  # listAncestor
         *    <div width="460" class="sc-hAcGzb lbaaym">
         *      <div class="sc-kHxTfl kecPwl">             # listRoot
         *        <div class="sc-eicpiI jUbUwm">           # Individual items 
         *        ...
         *      </div>
         *    </div>
         *  </div>
         */
        const listRoot = [...listAncestor.childNodes].filter(node => node.hasChildNodes())[0].querySelector("div")
        addAiCodesToList([...listRoot.childNodes])
        observeNodeForEver(listRoot, () => {
            addAiCodesToList([...listRoot.childNodes])
        });
    });
    
    waitForElm(".AknIconButton--edit,[data-attribute],.AknColumnConfigurator").then((elm) => {
        console.debug("[akenator] Table action buttons are available");
        document.querySelectorAll("table.AknGrid tbody tr:not(.group)").forEach(row => {
            console.debug("[akenator] Table row found");
            let code = null;
            const editButton = row.querySelector("a.AknIconButton--edit");
            if(editButton){ // List of Akeneo top level elements page
                code = editButton.href.split("/")[6];
            }else {
                const attritbuteActionButton = row.querySelector("[data-attribute]");
                if(attritbuteActionButton){ // List of attributes of a family
                    code = attritbuteActionButton.dataset.attribute;
                }
            }
            if(code){
                let labelCell = row.querySelector("td:not(.select-row-cell)"); // Assume first column is label
                if(!labelCell.alreadyWithCode){
                    console.info(`[akenator] Adding code ${code}`);
                    labelCell.append(document.createElement("br"));
                    labelCell.append(code);
                    labelCell.alreadyWithCode = true;
                }
            }
            // Check for "add attributes" drop down selector
            document.querySelectorAll(".select2-result-label-attribute").forEach(addAttributeLine => {
                console.debug("[akenator] Drop down line found");
                const addAttributeCode = addAttributeLine.querySelector("[data-code]").dataset.code;
                const addAttributeLabel = addAttributeLine.querySelector(".attribute-label");
                if(!addAttributeLabel.alreadyWithCode){
                    console.info(`[akenator] Adding code ${code} to add attribute`);
                    addAttributeLabel.append(` (${addAttributeCode})`);
                    addAttributeLabel.alreadyWithCode = true;
                }
            });
        });
        document.querySelectorAll(".filters-column label").forEach(labelCell => {
            const code = labelCell.querySelector("input").id;
            if(!labelCell.alreadyWithCode){
                console.debug(`[akenator] Adding code ${code} to filter`);
                labelCell.append(document.createElement("br"));
                labelCell.append(code);
                labelCell.alreadyWithCode = true;
                labelCell.style.lineHeight = "25px"
            }
        });
        document.querySelectorAll(".AknColumnConfigurator-column li").forEach(configListItem => {
            const code = configListItem["dataset"]["value"];
            if(code && !configListItem.alreadyWithCode){
                console.debug(`[akenator] Adding code ${code} to config item`);
                configListItem.querySelector("div").append(` [${code}]`);
                configListItem.alreadyWithCode = true;
            }
            const attributeCode = configListItem["dataset"]["attributeCode"];
            if(attributeCode && !configListItem.alreadyWithCode){
                console.debug(`[akenator] Adding attribute code ${attributeCode} to config item`);
                configListItem.querySelector("div").append(` [${attributeCode}]`);
                configListItem.alreadyWithCode = true;
            }
        });
        window.setTimeout(addCodes, 1000);
    });
}

addCodes();
