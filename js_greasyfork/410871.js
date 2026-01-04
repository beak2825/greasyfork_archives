// ==UserScript==
// @name         Evergreen theme for flomo
// @version      1.1.2
// @author       zwithz
// @description  Flomo 第三方主题插件
// @match        https://flomo.app/*
// @namespace https://greasyfork.org/users/685325
// @downloadURL https://update.greasyfork.org/scripts/410871/Evergreen%20theme%20for%20flomo.user.js
// @updateURL https://update.greasyfork.org/scripts/410871/Evergreen%20theme%20for%20flomo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const url='https://gist.githubusercontent.com/zwithz/cbde0915b2675781675d89bcfd517f46/raw/';
    fetch(url).then(rsp=>rsp.text()).then(csstxt=>{
        let s = document.createElement('style');
        s.setAttribute('type', 'text/css');
        s.appendChild(document.createTextNode(csstxt));
        document.querySelector('head').appendChild(s);
        console.log('Inserted flomo evergreen theme, enjoy :\)');
    })

    function hideByClassName(className) {
        const target = document.getElementsByClassName(className)[0];
        target.style.display = target.style.display === "none" ? "" : "none";
    }

    function focusMode() {
        hideByClassName('el-aside');
        hideByClassName('input-box');
    }

    // Hide left sidebar and bottom input box
    let parentNode = document.querySelectorAll('div.topbar')[0];
    const siblingNode = document.querySelectorAll('div.search')[0];
    let focusModeButton = document.createElement('input');
    focusModeButton.setAttribute('type', 'button');
    focusModeButton.setAttribute('id', 'hide-sidebar');
    focusModeButton.setAttribute('value', '👨‍💻 ');
    focusModeButton.setAttribute('padding', '5px');
    focusModeButton.onclick = focusMode;
    parentNode.insertBefore(focusModeButton, siblingNode);
})();