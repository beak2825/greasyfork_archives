// ==UserScript==
// @name         click a link always open a new tab
// @description  click a link always open a new tabs
// @icon         https://img1.baidu.com/it/u=1412332306,99938487&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500
// @license	     MIT
// @version      0.0.1
// @author       lee mathew
// @run-at       document-end
// @include      http*://*
// @namespace https://greasyfork.org/users/1090699
// @downloadURL https://update.greasyfork.org/scripts/467871/click%20a%20link%20always%20open%20a%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/467871/click%20a%20link%20always%20open%20a%20new%20tab.meta.js
// ==/UserScript==


(function() {
    let elements = document.querySelectorAll("a")
    elements.forEach(item=>{
        item.target = '_blank'
    })
})();