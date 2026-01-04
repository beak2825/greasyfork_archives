// ==UserScript==
// @name        AutoLinker
// @namespace   tea.pm
// @include     *
// @grant       none
// @version     1.1.4
// @author      cljnnn
// @run-at      document-idle
// @description 自动将页面所有文本转换为链接
// @description_en translate url in text to link
// @downloadURL https://update.greasyfork.org/scripts/416978/AutoLinker.user.js
// @updateURL https://update.greasyfork.org/scripts/416978/AutoLinker.meta.js
// ==/UserScript==
String.prototype.isEmpty = function () {
    return (this.length === 0 || !this.trim());
};

const reUrl = new RegExp(String.raw`\b(\w+://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])`);

function fixURL(node) {
    value = node.nodeValue;
    //console.log("updating link... ", node.nodeType, value);
    newValue = value.replace(reUrl, '<a target="_blank" href="$1">$1</a>');
    var replacementNode = document.createElement('span');
    replacementNode.innerHTML = newValue;
    node.parentNode.insertBefore(replacementNode, node);
    node.parentNode.removeChild(node);
}
function shouldIgnoreNode(node) {
    if (!node) return true;
    let name = node.nodeName;
    return (name == "SCRIPT" || name == "NOSCRIPT" || name == "STYLE" || name == "A" || name == "INPUT" || name == "TEXTAREA");
}
function traverse(node) {
    if (!node) return;
    if (shouldIgnoreNode(node)) return;
    if (node.nodeType == Node.TEXT_NODE) {
        let value = node.nodeValue;
        if (value && value != "") {
            if (value.match(reUrl)) {
                fixURL(node)
            }
        }
    }
    if (node.nodeType == Node.ELEMENT_NODE) {
        for (let child of node.childNodes) {
            traverse(child);
        }
    }
}

function action(changes, observer) {
    for (let mutation of changes) {
        if (mutation.type !== 'childList') {
            continue;
        }
        if (shouldIgnoreNode(mutation.target)) continue;
        for (let node of mutation.addedNodes) {
            traverse(node);
        }
    }
}

var observer = new MutationObserver(action);
observer.observe(document, { childList: true, subtree: true });
traverse(document.body);