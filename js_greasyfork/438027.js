// ==UserScript==
// @name         XMEN
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  asdf asdfsafds 
// @author       You
// @include        /^https:\/\/xmen\.intra\.[k][e]\.com\/.*/
// @license none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438027/XMEN.user.js
// @updateURL https://update.greasyfork.org/scripts/438027/XMEN.meta.js
// ==/UserScript==

let match = /port=(\d+)&db=(\w+)/.exec(location);
let port = match[1];
let name = match[2];

const div = document.createElement('div');
div.innerHTML = `
<div id='test'>
<input type="hidden" id="myDbPort" value="${port}">
<input type="hidden" id="myDbName" value="${name}">
</div>`;
document.body.appendChild(div);

var process = function (a) {
    let port = document.getElementById("myDbPort").value
    let name = document.getElementById("myDbName").value
    document.querySelectorAll('input[placeholder="例如：6001"]').forEach(e => {
        e.value = port;
        e.dispatchEvent(new Event('input', { bubbles: true }));
    })
    document.querySelectorAll('input[placeholder="请填写库名"]').forEach(e => {
        e.value = name;
        e.dispatchEvent(new Event('input', { bubbles: true }));
    })
    let $table = document.querySelector('table.el-table__body');
    if ($table) {
        // $table.style = '-webkit-user-select: text !important;user-select: text !important;'
    }
};

/* Define the observer for watching over inserted elements */
var insertedObserver = new MutationObserver(function (mutations) {
    // mutations.forEach(function (m) {
    // var inserted = [].slice.call(m.addedNodes);
    // while (inserted.length > 0) {
    //     var elem = inserted.shift();
    //     [].slice.call(elem.children || []).forEach(function (el) {
    //         inserted.push(el);
    //     });
    //     process(elem);
    // }
    // });
    process()
});
/* Define the observer for watching over
 * modified attributes of anchor elements */
var modifiedObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
        if ((m.type === 'attributes')) {
            process(m.target);
        }
    });
});

/* Start observing */
insertedObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
});
// modifiedObserver.observe(document.documentElement, {
//     attributes: true,
//     substree: true
// });

