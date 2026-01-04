// ==UserScript==
// @name         SimpleMMO Frog
// @namespace    https://gist.github.com/hackerfrog
// @version      0.0.1
// @copyright    2021-2021, hackerfrog
// @description  SimpleAddon for SimpleMMO, Highlight inventory item already exist in your collectables.
// @author       HackerFrog
// @match        https://web.simple-mmo.com/*
// @match        http://web.simple-mmo.com/*
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/429275/SimpleMMO%20Frog.user.js
// @updateURL https://update.greasyfork.org/scripts/429275/SimpleMMO%20Frog.meta.js
// ==/UserScript==

var pointer = {
    'colGrid' : 'body > div.h-screen > div.flex > main > div.web-app-container > div > div:nth-child(3) > ul',
    'itemList' : 'body > div.h-screen > div.flex > main > div.web-app-container > div > div.mt-8 > div > div > table > tbody'
};

(function loop() {
    highlightCol()
    var body = document.querySelector('body')
    var hfBtn = document.createElement('div')
    hfBtn.classList.add('dark:text-white', 'dark:bg-indigo-600', 'dark:hover:bg-indigo-700', 'fixed', 'bottom-0', 'mb-8', 'mr-8', 'inline-flex', 'items-center', 'px-3', 'py-2', 'border', 'border-gray-300', 'shadow-sm', 'text-sm', 'text-gray-700',
                        'leading-4', 'font-medium', 'rounded-md', 'bg-indigo-600', 'hover:bg-indigo-700')
    hfBtn.setAttribute('style', 'right:116px;')
    hfBtn.innerHTML = 'Scan'
    hfBtn.addEventListener('click', function(event) {
        try {
            var colGrid = document.querySelector(pointer.colGrid)
            for (var i = 0; i < colGrid.children.length; i++) {
                try {
                    var name = colGrid.children[i].querySelector('div > div > div').innerHTML
                    var value = colGrid.children[i].querySelector('div > div > div:nth-child(3)').innerHTML
                    GM_setValue(name, value)
                } catch(err) {
                    console.log('Unable to find details of item')
                }
            }
            console.log('Page Scanned')
        } catch (err) {
            console.log('Not a valid page to scan')
        }
    })
    body.appendChild(hfBtn)
})();

function highlightCol() {
    var list = GM_listValues()
    //console.log(list)
    try {
        var table = document.querySelector(pointer.itemList)
        for(var i = 0; i < table.children.length; i++) {
            var item_name = table.children[i].querySelector('td:nth-child(1) > div > div.ml-4 > div > span:nth-child(2)').innerHTML
            if(list.includes(item_name)) {
                table.children[i].setAttribute('style', 'background:rgba(4, 170, 109, 0.1) !important')
            } else {
                //table.children[i].setAttribute('style', 'background:rgba(255, 255, 204, 0.1) !important')
            }
        }
    } catch(err) {
        console.log('Not a Inventory page')
    }
}