// ==UserScript==
// @name         Xpath Locator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Capture and test Xpath locators
// @author       Maged Ahmed
// @include      *
// @grant        none
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457916/Xpath%20Locator.user.js
// @updateURL https://update.greasyfork.org/scripts/457916/Xpath%20Locator.meta.js
// ==/UserScript==
let highlightElementCount = 0;
let currentElement;
let highlightInterval;
let elements = [];
let elementIndex = 0;
const MENU = `
<br/>
<br/>
<fieldset>
    <legend>Find by xpath:</legend>
    <p><label>
        <textarea id="xpValue" placeholder="xpath: //*" rows="10" maxlength="9999"></textarea>
    </label></p>
    <p>
        <button id="xpElementFind" class="xpMenuBtn"><i class="fa fa-search"></i></button>
        <button id="xpElementPrev" class="xpMenuBtn"><i class="fa fa-arrow-left"></i></button>
        <button id="xpElementNext" class="xpMenuBtn"><i class="fa fa-arrow-right"></i></button>
        <button id="xpElementClear" class="xpMenuBtn"><i class="fa fa-close"></i></button>
        <button id="xpElementCopy" class="xpMenuBtn"><i class="fa fa-copy"></i></button>
        <span id="xpElementsCount"></span>
    </p>
</fieldset>
<fieldset>
    <legend>Capture xpath:</legend>
    <p>
        <label for="xpId">Add id</label>
        <input id="xpId" type="checkbox" checked="checked"/>
    </p>
    <p>
        <label for="xpName">Add name</label>
        <input id="xpName" type="checkbox" checked="checked"/>
    </p>
    <p>
        <label for="xpClass">Add class</label>
        <input id="xpClass" type="checkbox"/>
    </p>
    <p>
        <label for="xpType">Add type</label>
        <input id="xpType" type="checkbox"/>
    </p>
    <p><label for="xpText">Add text</label>
        <input id="xpText" type="checkbox"/>
    </p>
    <p>
        <label for="xpIndex">Add index</label>
        <input id="xpIndex" type="checkbox"/>
    </p>
    <p>
        <label for="xpLength">Xpath Length</label>
        <input type="number" id="xpLength" value="1" min="1" max="100">
    </p>
    <p>
        <button id="xpCapture"><i class="fa fa-location-arrow"></i> Capture</button>
        <button id="xpUpdate"><i class="fa fa-refresh"></i> Update</button>
    </p>
</fieldset>
<fieldset class="xpElementData">
    <legend>Element Properties</legend>
    <table>
    <col style="width:50px">
  <tr>
    <td>Tag</td>
    <td><div id="xpElementTag" style="max-height:100px; overflow:scroll"></div></td>
  </tr>
  <tr>
    <td>Id</td>
    <td><div id="xpElementId" style="max-height:100px; overflow:scroll"></div></td>
  </tr>
  <tr>
    <td>Name</td>
    <td><div id="xpElementName"  style="max-height:100px; overflow:scroll"></div></td>
  </tr>
  <tr>
    <td>Class</td>
    <td><div id="xpElementClass"  style="max-height:100px; overflow:scroll"></div></td>
  </tr>
  <tr>
    <td>Type</td>
    <td><div id="xpElementType"  style="max-height:100px; overflow:scroll"></div></td>
  </tr>
  <tr>
    <td>Text</td>
    <td><div id="xpElementText"  style="max-height:100px; overflow:scroll"></div></td>
  </tr>
  <tr>
    <td>Xpath</td>
    <td><div id="xpElementXpath"  style="max-height:100px; overflow:scroll"></div></td>
  </tr>
</table>
</fieldset>
`;
const SCRIPT_CSS = `
.selectedElement {
    color: lime !important;
                background-color: yellow !important;
                outline-offset: -2px !important;
    outline: 4px solid lime !important;
}
.capturedElement {
    color: aqua !important;
                background-color: yellow !important;
                outline-offset: -2px !important;
    outline: 4px solid aqua !important;
}
.xpMenu p,
.xpMenu label,
.xpMenu button,
.xpMenu a,
.xpMenu fieldset,
.xpMenu div,
.xpMenu span,
.xpMenuLink a {
                font: 16px arial, sans-serif;
                margin: 0;
    padding: .5 1em;
    min-height: 1;
    border: 1px solid transparent;
    box-shadow: none;
    outline: none;
                color: white;
}
.xpMenuLink a:hover {
    text-decoration: none;
                left: 0;
                color: white;
}
.xpMenuLink a {
                position: fixed;
                left: -100px;
                transition: 0.3s;
                padding: 5px;
                width: 100px;
                text-decoration: none;
                color: CornflowerBlue;
                border-radius: 0 20px 20px 0;
                z-index: 999999;
                top: 0px ;
                background-color: CornflowerBlue;
                white-space: nowrap;
                box-sizing: initial;
}
a.xpMenuLinkOpened{
                left: 0;
                color: white;
}
.xpMenu {
                height: 100%;
                width: 0;
                position: fixed;
                top: 0;
                left: 0;
                background-color: CornflowerBlue;
                overflow-x: hidden;
                transition: 0.5s;
                z-index: 999998;
}
.xpMenu a {
                text-decoration: none;
                font-size: 25px;
                color: black;
                display: block;
                transition: 0.3s;
}
.xpMenu a:hover {
    text-decoration: none;
                color: white;
}
.xpMenu .xpMenuClosebtn {
                color: DIMGRAY;
                position: absolute;
                top: 0;
                right: 25px;
                font-size: 36px;
                margin-left: 50px;
                cursor: pointer;
}
.xpMenu button {
                font-size: 14px !important;
                appearance: button !important;
                cursor: pointer !important;
                background-color: lightblue !important;
}
.xpMenu .xpMenuBtn {
                color: white !important;
                background-color: CornflowerBlue !important;
                border: 2px solid #6495ED !important;
                border-radius: 10px !important;
}
.xpMenu textarea {
                width: 100%;
                box-sizing: border-box;
                resize: vertical ;
                color: black;
}
.xpMenu fieldset {
                display: block;
                margin-inline-start: 2px;
                margin-inline-end: 2px;
                padding-block-start: 0.35em;
                padding-inline-start: 0.75em;
                padding-inline-end: 0.75em;
                padding-block-end: 0.625em;
                min-inline-size: min-content;
                border-width: 2px;
                border-style: groove;
                border-color: threedface;
                border-image: initial;
}
.xpMenu table {
  font: 14px arial, sans-serif;
  width: 100%;
  height: 100%;
  table-layout:fixed;
}
.xpMenu td div {
  font: 14px arial, sans-serif;
}
.xpMenu td {
  text-align: left;
  border: 1px solid white;
  word-wrap: break-word;
  white-space: pre-wrap;
}
`;
function openNav() {
    // const currentPosition = window.scrollY;
    // window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    // setTimeout(() => { window.scrollTo(0,currentPosition); }, Math.floor(document.body.scrollHeight/25));
    document.getElementById("xpMenuLinkOpen").classList.add("xpMenuLinkOpened");
    document.getElementById("xpMenu").style.width = "300px";
    document.body.style.marginLeft = "300px";
    document.querySelectorAll('*').forEach(function(node) {
        if (window.getComputedStyle(node, null).getPropertyValue('position') === 'fixed' &&
            window.getComputedStyle(node, null).getPropertyValue('left') === "0px" &&
            (node.id !== 'xpMenuLinkOpen' && node.id !== 'xpMenu')) {
            node.style.marginLeft = "300px";
        }
    });
}
function closeNav() {
    document.getElementById("xpMenuLinkOpen").classList.remove("xpMenuLinkOpened");
    document.getElementById("xpMenu").style.width = "0";
    document.body.style.marginLeft = "0";
    document.querySelectorAll('*').forEach(function(node) {
        if (window.getComputedStyle(node, null).getPropertyValue('position') === 'fixed') {
            node.style.marginLeft = "0";
        }
    });
    clearAll();
}
function getElementsByXpath(path) {
    const result = document.evaluate(path, document, null, XPathResult.ANY_TYPE, null);
    let node, nodes = [];
    while ((node = result.iterateNext())) {
        nodes.push(node);
    }
    return nodes;
}
function unHighlightElement() {
    if (currentElement instanceof HTMLElement) {
        clearInterval(highlightInterval);
        currentElement.classList.remove("capturedElement");
        currentElement.classList.remove("selectedElement");
        highlightInterval = null;
    }
}
function highlightElement() {
    currentElement.classList.toggle("selectedElement");
    highlightElementCount++;
    if (highlightElementCount === 5) {
        clearInterval(highlightInterval);
        highlightElementCount = 0;
        highlightInterval = null;
    }
}
function findElements() {
    clearElements();
    unsetCapture();
    const xpath = document.getElementById("xpValue").value;
    elements = getElementsByXpath(xpath);
    elementIndex = 0;
    selectElement()
}
function nextElement() {
    if (elementIndex < elements.length - 1) {
        elementIndex++;
        selectElement()
    }
}
function prevElement() {
    if (elementIndex > 0) {
        elementIndex--;
        selectElement()
    }
}
function selectElement() {
    unHighlightElement();
    if (elements.length > 0 && (currentElement = elements[elementIndex]) && currentElement instanceof HTMLElement) {
        currentElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
        });
        document.getElementById("xpElementsCount").textContent = "[" + (elementIndex + 1) + " / " + elements.length + "]";
        displayElementInfo();
        highlightInterval = setInterval(function() {
            highlightElement();
        }, 100);
    } else {
        document.getElementById("xpElementsCount").textContent = '';
    }
}
function displayElementInfo() {
    document.getElementById("xpElementTag").textContent = currentElement.tagName;
    document.getElementById("xpElementId").textContent = currentElement.id;
    document.getElementById("xpElementName").textContent = currentElement.name;
    document.getElementById("xpElementClass").textContent = currentElement.className;
    document.getElementById("xpElementType").textContent = currentElement.type;
    document.getElementById("xpElementText").textContent = currentElement.textContent;
    document.getElementById("xpElementXpath").textContent = getXPath(currentElement, true, true, true, false, false, true, 5);
}
function clearElements() {
    unHighlightElement();
    document.getElementById("xpElementsCount").textContent = '';
    elements = [];
    elementIndex = 0;
}
function clearAll() {
    document.getElementById("xpValue").value = '';
    clearElements();
    unsetCapture();
}
function unsetCapture() {
    unHighlightElement();
    document.onmousemove = null;
    document.oncontextmenu = null;
}
function captureElement() {
    if (currentElement) {
        const xpId = document.getElementById("xpId").checked;
        const xpName = document.getElementById("xpName").checked;
        const xpClass = document.getElementById("xpClass").checked;
        const xpType = document.getElementById("xpType").checked;
        const xpText = document.getElementById("xpText").checked;
        const xpIndex = document.getElementById("xpIndex").checked;
        const xpLength = document.getElementById("xpLength").value;
        document.getElementById("xpValue").value = getXPath(currentElement, xpId, xpName, xpClass, xpType, xpText, xpIndex, xpLength);
        findElements();
    }
}
function setCapture() {
    clearElements();
    unsetCapture();
    document.onmousemove = function(event) {
        if (currentElement) {
            currentElement.classList.remove("capturedElement");
        }
        const target = event.target;
        target.classList.add("capturedElement");
        currentElement = target;
    };
    document.oncontextmenu = function() {
        unsetCapture();
        captureElement();
        return false
    };
}
function copyXpath() {
    document.getElementById("xpValue").select();
    document.execCommand("copy");
}
function getXPath(element, getId, getName, getClass, getType, getText, getIndex, maxCount) {
    let uiElementText;
    let xpath = '';
    let count = 0;
    while (element) {
        let pathIndex = "";
        if (getIndex) {
            try {
                let index = 0;
                for (let sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
                    if (sibling.nodeType === Node.DOCUMENT_TYPE_NODE) {
                        continue;
                    }
                    if (sibling.nodeName === element.nodeName) {
                        ++index;
                    }
                }
                pathIndex = (index ? "[" + (index + 1) + "]" : "[1]");
            } catch (err) {
                continue;
            }
        }
        let nodeXpath = '';
        try {
            if (element.id && getId) {
                nodeXpath += '@id=\"' + element.id + '\"';
            }
        } catch (err) {
        }
        try {
            if (element.name && getName) {
                if (nodeXpath !== '') {
                    nodeXpath += ' and ';
                }
                nodeXpath += '@name=\"' + element.name + '\"';
            }
        } catch (err) {
        }
        try {
            if (element.hasAttribute("type") && typeof element.type !== 'undefined' && getType) {
                if (nodeXpath !== '') {
                    nodeXpath += ' and ';
                }
                nodeXpath += '@type=\"' + element.type + '\"';
            }
        } catch (err) {
        }
        try {
            if (element.className && nodeXpath === '' && getClass) {
                if (nodeXpath !== '') {
                    nodeXpath += ' and ';
                }
                nodeXpath += '@class=\"' + element.className + '\"';
            }
        } catch (err) {
        }
        try {
            if (element.textContent && element.textContent.length < 50 && element.textContent === element.innerHTML && getText) {
                uiElementText = element.textContent;
                try {
                    uiElementText = uiElementText.trim();
                } catch (err) {
                    uiElementText = uiElementText.replace(/^\s+|\s+$/g, '');
                }
                if (nodeXpath !== '') {
                    nodeXpath += ' and ';
                }
                if (element.textContent === uiElementText && element.textContent.length > 0) {
                    nodeXpath += 'text()=\"' + element.textContent + '\"';
                } else {
                    nodeXpath += 'normalize-space() = \"' + uiElementText + '\"';
                }
            } else if (element.text && element.text.length < 50 && element.text === element.innerHTML && getText) {
                uiElementText = element.text;
                try {
                    uiElementText = uiElementText.trim();
                } catch (err) {
                    uiElementText = uiElementText.replace(/^\s+|\s+$/g, '');
                }
                if (uiElementText.length > 0) {
                    if (nodeXpath !== '') {
                        nodeXpath += ' and ';
                    }
                    if (element.text === uiElementText) {
                        nodeXpath += 'contains(text(),\'' + uiElementText + '\')';
                    } else {
                        nodeXpath += 'contains(normalize-space(),\'' + uiElementText + '\')';
                    }
                }
            } else if (element.innerText && element.innerText.length < 50 && element.innerText === element.innerHTML && getText) {
                uiElementText = element.innerText;
                try {
                    uiElementText = uiElementText.trim();
                } catch (err) {
                    uiElementText = uiElementText.replace(/^\s+|\s+$/g, '');
                }
                if (uiElementText.length > 0) {
                    if (nodeXpath !== '') {
                        nodeXpath += ' and ';
                    }
                    if (element.innerText === uiElementText) {
                        nodeXpath += 'contains(text(),\'' + uiElementText + '\')';
                    } else {
                        nodeXpath += 'contains(normalize-space(),\'' + uiElementText + '\')';
                    }
                }
            } else if (element.nodeName.toLocaleLowerCase() === "a" || count === 0) {
                uiElementText = element.textContent;
                try {
                    uiElementText = uiElementText.trim().substring(0, 20);
                    uiElementText = uiElementText.replace("'", "') and contains (.,'");
                } catch (err) {
                    uiElementText = uiElementText.replace(/^\s+|\s+$/g, '');
                    uiElementText = uiElementText.replace("'", "') and contains (.,'");
                }
                if (uiElementText.length > 0) {
                    if (nodeXpath !== '') {
                        nodeXpath += ' and ';
                    }
                    if (element.textContent === uiElementText) {
                        nodeXpath += 'contains(normalize-space(),\'' + uiElementText + '\')';
                    } else {
                        nodeXpath += 'contains(.,\'' + uiElementText + '\')';
                    }
                }
            }
        } catch (err) {
        }
        /** Getting the Element's Tag Name
         **/
        const currentElementTagName = element.nodeName.toLocaleLowerCase();
        /** Building Xpath for the current Element Node
         **/
        if (nodeXpath === '') {
            xpath = '/' + currentElementTagName + pathIndex + xpath;
        } else {
            xpath = '/' + currentElementTagName + pathIndex + '[' + nodeXpath + ']' + xpath;
        }
        /** Switching focus to parent node
         **/
        element = element.parentElement;
        /** Incrementing the element counter and breaking the loop in case we reach the maximum number of elements defined by the user
         **/
        count++;
        if (count >= maxCount) {
            break;
        }
    }
    window.captured = null;
    return '/' + xpath;
}
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
document.head.appendChild(link);
const s = document.createElement('style');
s.innerHTML = SCRIPT_CSS;
document.head.appendChild(s);
const xpMenuDiv = document.createElement("div");
xpMenuDiv.id = "xpMenuLink";
xpMenuDiv.className = "xpMenuLink";
document.body.appendChild(xpMenuDiv);
const xpMenuLink = document.createElement("a");
xpMenuLink.id = "xpMenuLinkOpen";
xpMenuLink.innerHTML = "Xpath Locator";
xpMenuLink.onclick = openNav;
xpMenuDiv.appendChild(xpMenuLink);
const xpMenu = document.createElement("div");
xpMenu.className = "xpMenu";
xpMenu.id = "xpMenu";
xpMenu.innerHTML = MENU;
document.body.appendChild(xpMenu);
const xpCloseMenu = document.createElement("div");
xpCloseMenu.id = "xpMenuClosebtn";
xpCloseMenu.className = "xpMenuClosebtn";
xpCloseMenu.innerHTML = "&times;";
xpCloseMenu.onclick = closeNav;
xpCloseMenu.href = "#";
xpMenu.appendChild(xpCloseMenu);
document.getElementById("xpElementFind").onclick = findElements;
document.getElementById("xpElementNext").onclick = nextElement;
document.getElementById("xpElementPrev").onclick = prevElement;
document.getElementById("xpElementClear").onclick = clearAll;
document.getElementById("xpCapture").onclick = setCapture;
document.getElementById("xpUpdate").onclick = captureElement;
document.getElementById("xpElementCopy").onclick = copyXpath;