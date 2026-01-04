// ==UserScript==
// @name     Hide successful pipeline steps
// @version  7
// @grant       GM.setValue
// @grant       GM.getValue
// @match https://jenkins-itest.spirenteng.com/jenkins*/job/*/flowGraphTable/
// @match https://ci.eclipse.org/*/job/*/flowGraphTable/
// @namespace basilevs
// @description Hide successful pipeline steps in Jenkins to allow effortless navigation to interesting failures.
// @downloadURL https://update.greasyfork.org/scripts/421694/Hide%20successful%20pipeline%20steps.user.js
// @updateURL https://update.greasyfork.org/scripts/421694/Hide%20successful%20pipeline%20steps.meta.js
// ==/UserScript==


function log() {
  console.log(...arguments);
}

function getParents(elem) {
  var parents = [];
  while(elem.parentNode && elem.parentNode.nodeName.toLowerCase() != 'body') {
    elem = elem.parentNode;
    parents.push(elem);
  }
  return parents;
}

function getPadding(row) {
  let result = row.padding;
  if (result) {
    return result;
  }
  const td = document.evaluate('td[1]', row, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE).snapshotItem(0);
  let text =  window.getComputedStyle(td, null).getPropertyValue('padding-left');
  return row.padding = parseFloat(text);
}

function scan() {	
  const toHide = new Set();
  const rows = document.evaluate('//div[@id="nodeGraph"]/table/tbody/tr', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
  const path = [];
  
  let i = 0;
  while (row = rows.snapshotItem(i++)) {
    let newPadding = getPadding(row);
    while (path.length) {
	    let oldPadding = path.length == 0 ? 0 : getPadding(path.at(-1));
      if (oldPadding >= newPadding) {
        path.pop();
      } else {
        break;
      }
    }
    path.push(row);
    
    let success = document.evaluate('td/div/span[contains(@class, "icon-blue ")]', row, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE).snapshotLength > 0;
    success |= document.evaluate('td/div/span[text() = "Success"]', row, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE).snapshotLength > 0; // Jenkins 2.492
    log({path, success});
    if (success) {
      toHide.add(row);
    } else {
      path.forEach(parent => toHide.delete(parent));                              
		}
  }
  
	toHide.forEach(element => {
    element.classList.add('success');
  });
}

const observer = new MutationObserver(() => {
  scan();
});

observer.observe(document.querySelector("#main-panel"), {
  subtree: false,
  childList: true,
});

scan();

const sheetElement = document.createElement('style');
document.head.appendChild(sheetElement);
const sheet = sheetElement.sheet;
sheet.insertRule(`tr.success {display: none }`);

document.getElementById('side-panel').innerHTML += '<label><input type="checkbox" id="showSuccessfullSteps">Show succesull steps</input></label><br>';
const checkbox = document.getElementById('showSuccessfullSteps');


function showSteps(doShow) {
  console.log('doShow', doShow);
  sheet.disabled = doShow;
  GM.setValue("show_success", doShow);
}

checkbox.addEventListener('click', () => showSteps(checkbox.checked));
GM.getValue("show_success").then((value) => {
  checkbox.checked = value;
	showSteps(checkbox.checked);
});
