// ==UserScript==
// @name 自动化显示密码
// @description  加入快捷键操作
// @namespace https://www.vpsoffers.net/plugins/auto-show-password.html
// @homepageURL https://www.vpsoffers.net/plugins/auto-show-password.html
// @version 0.5
// @include *
// @license *
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      AGPLv3
// @author lcldh/ChatGPT
// @match *://*/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/489545/%E8%87%AA%E5%8A%A8%E5%8C%96%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/489545/%E8%87%AA%E5%8A%A8%E5%8C%96%E6%98%BE%E7%A4%BA%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function() {
'use strict';

// Replacement function
function replacePasswords() {
var inputs = document.getElementsByTagName("input");

for (var i = 0; i < inputs.length; i++) {
var input = inputs[i];

if (input.type.toLowerCase() === "password") {
try {
input.type = "text";
} catch (e) {
var newInput, attributes;

newInput = document.createElement("input");
attributes = input.attributes;

for (var j = 0; j < attributes.length; j++) {
var attribute, name, value;

attribute = attributes[j];
name = attribute.nodeName;
value = attribute.nodeValue;

if ("type" !== name.toLowerCase() && "height" !== name && "width" !== name && !!value) {
newInput[name] = value;
}
}

input.parentNode.replaceChild(newInput, input);
}
}
}
}

// Select the node that will be observed for mutations
const targetNode = document.body;

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
for(let mutation of mutationsList) {
if (mutation.type === 'childList') {
setTimeout(replacePasswords, 500);
}
}
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);

// Execute the replacement once after the page is loaded
window.addEventListener('DOMContentLoaded', () => {
setTimeout(replacePasswords, 500);
});
})();
