// ==UserScript==
// @name        macKeyIconToName
// @namespace   leizingyiu
// @match       *://*.*/*
// @grant       none
// @version     0.1
// @author      leizingyiu
// @description replace mac key icon to name
// @license     GNU AGPLv3 
// @downloadURL https://update.greasyfork.org/scripts/492900/macKeyIconToName.user.js
// @updateURL https://update.greasyfork.org/scripts/492900/macKeyIconToName.meta.js
// ==/UserScript==


const dict = {
    "⇧": "shift",
    "⌘": "cmd",
    "⌃": "ctrl",
    "⌥": "opt"
};

function replaceText(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        Object.entries(dict).forEach(([k, v]) => {
            let reg = new RegExp(k, 'g');
            node.nodeValue = node.nodeValue.replace(reg, v);
        });
    } else {
        node.childNodes.forEach(childNode => replaceText(childNode));
    }
}

window.onload=()=>{
  setTimeout(()=>{replaceText(document.body);},1000);
}


// const dict = {
//     "⇧": "shift",
//     "⌘": "cmd",
//     "⌃": "ctrl",
//     "⌥": "opt"
// };

// function replaceText(node) {
//     if (node.nodeType === Node.TEXT_NODE) {
//         Object.entries(dict).forEach(([k, v]) => {
//             let reg = new RegExp(k, 'g');
//             node.nodeValue = node.nodeValue.replace(reg, v);
//         });
//     }
// }

// window.onload=()=>{
//   setTimeout(()=>{replaceText(document.body);},2000);
// }

// const observer = new MutationObserver(mutationsList => {
//     mutationsList.forEach(mutation => {
//         mutation.addedNodes.forEach(addedNode => {
//             replaceText(addedNode);
//         });
//         mutation.target.childNodes.forEach(childNode => {
//             replaceText(childNode);
//         });
//     });
// });

// observer.observe(document.body, { childList: true, subtree: true });


