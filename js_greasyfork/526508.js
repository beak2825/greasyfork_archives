// ==UserScript==
// @name         schalttafel-urn-collector
// @namespace    http://tampermonkey.net/
// @version      2025-02-17-1
// @description  collect urns from clicks in Schalttafel
// @author       virtel.martin@dpa.com
// @match        https://schalttafel3.dpa-newslab.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dpa-newslab.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526508/schalttafel-urn-collector.user.js
// @updateURL https://update.greasyfork.org/scripts/526508/schalttafel-urn-collector.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Configurable CSS selector (modify as needed)
    const CSS_SELECTOR = '[data-urn]'; // Example: All text elements

    // Create UI elements
    const details = document.createElement('details');
    details.style.position = 'fixed';
    details.style.top = '10px';
    details.style.right = '10px';
    details.style.width = '300px';
    details.style.zIndex = '9999';
    details.style.background = 'white';
    details.style.border = '1px solid #ccc';
    details.style.padding = '5px';
    details.style.fontSize = '10px';


    const summary = document.createElement('summary');
    summary.textContent = '🛒 0 … click on teasers to collect urns here';
    summary.style.opacity = 0.8;
    summary.style.cursor = 'ns-resize';

    const textarea = document.createElement('textarea');
    textarea.style.width = '100%';
    textarea.style.height = '200px';
    textarea.style.resize = 'none';
    textarea.style.fontFamily = 'monospace';
    textarea.style.fontSize = '10px';
    textarea.style.border = '1px solid #ccc';
    textarea.style.padding = '5px';
    textarea.style.boxSizing = 'border-box';
    textarea.style.opacity=1;

    const hint = document.createElement('div');
    hint.innerHTML='<i>Textbox content above can be pasted directly into a spreadsheet.</i>'

    const tags = document.createElement('div');
    tags.style.fontWeight = 'bold';
    tags.style.color = 'lightgrey';
    tags.innerText=''

    details.appendChild(summary);
    details.appendChild(textarea);
    details.appendChild(hint);
    details.appendChild(tags);

    document.body.appendChild(details);
    // Store collected texts---
    const collectedTexts = new Set();
    let lastClicked;

    function selectTarget(target, tags_attr, toggle) {
            let urn = target.getAttribute("data-urn");
            let headline = target.querySelector('.headline')?.innerText;
            tags.innerHTML = `<h5>${urn.split(":")[4]}</h5><p>${tags_attr}</p>`;
            let text = `+\t${headline}\t${urn}`;
            let click_action = '';
            let return_value = 0;
            if (text) {
            if (!collectedTexts.has(text)) {
                collectedTexts.add(text);
                textarea.value += (textarea.value ? '\n' : '') + text;
                textarea.value = textarea.value.replace('\n\n','\n');
                textarea.scrollTop = textarea.scrollHeight;
                click_action='✅';
                return_value = 1;
            } else { if (toggle) {
                collectedTexts.delete(text);
                textarea.value = textarea.value.replace(text,'');
                textarea.value = textarea.value.replace('\n\n','\n');
                click_action='❌';
                return_value=-1;
              } }
              summary.innerText=`🛒 ${collectedTexts.size} ${click_action} ${headline.substr(0,35)}…${urn.split(":")[4].substr(12,)}`;
            }
        return return_value;
    };

function findNodesUntilSelectorMatch(node, urn) {
    let result = [node.querySelector('[data-urn]')];

    function checkAndCollect(sibling, getSibling) {
        while (sibling) {
            let pushedTarget = sibling.querySelector('[data-urn]');
            if (pushedTarget) {
               result.push(pushedTarget);
               if (pushedTarget.getAttribute('data-urn') == urn) {
                return true; // Stop searching when match is found
               }
               sibling = getSibling(sibling);
            } else {
                return false;
            }
        }
        return false;
    }

    // First, search upwards
    if (!checkAndCollect(node.previousElementSibling, (s) => s.previousElementSibling)) {
        // If not found upwards, reset result and search downwards
        result = [node.querySelector('[data-urn]')]; // Reset result to only include the original node
        checkAndCollect(node.nextElementSibling, (s) => s.nextElementSibling);
    }
    return result;
};

    function setStyle(selector,p,v) {
    document.querySelectorAll(selector).forEach(element => {
        element.style[p] = v;
    });
}


    document.addEventListener('click', (event) => {
        let target = event.target.closest(CSS_SELECTOR);
        let tags_container = event.target.closest("[data-tags]");
        let tags_attr = '';
        if (tags_container !== null) {
            tags_attr = tags_container.getAttribute("data-tags");
        } else {
            tags_attr = '';
        }
        if (target) {
            if (event.shiftKey) {
               let enclosing = target.closest('[data-is="item"]').parentElement;
               let selectable = findNodesUntilSelectorMatch(enclosing,lastClicked);
               if (selectable.length > 0) {
                  let total = 0;
                  selectable.forEach(function(e) {
                      total += selectTarget(e,'',false);
                  });
                  setTimeout( function() {
                         summary.innerText=`${selectable.length} urns selected, ${total} added`;
                  }, 500);
                  lastClicked = target.getAttribute("data-urn");
               }
            } else {
              selectTarget(target, tags_attr, true);
              lastClicked = target.getAttribute("data-urn");
            }
            setStyle('[data-urn]','border-left','0');
            textarea.value.match(/urn:[^\n]+/g).forEach(function(e) {
                console.log(e);
                setStyle(`[data-urn="${e}"]`, 'border-left', '3px dotted red');
            });

        }
    }, true);
})();