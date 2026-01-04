// ==UserScript==
// @name         Unreal Engine documentation automatically expands the table of contents.
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Unreal Engine documentation automatically expands the table of contents.aa
// @author       You
// @match        https://docs.unrealengine.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unrealengine.com
// @grant        none
// @license   MIT
// @downloadURL https://update.greasyfork.org/scripts/468410/Unreal%20Engine%20documentation%20automatically%20expands%20the%20table%20of%20contents.user.js
// @updateURL https://update.greasyfork.org/scripts/468410/Unreal%20Engine%20documentation%20automatically%20expands%20the%20table%20of%20contents.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const intervalId = setInterval(() => {
        const element = document.getElementById('NavPanelList');
        if (element) {
            Array.from(document.getElementsByTagName('ul')).forEach(x=>x.removeAttribute('style'))
            clearInterval(intervalId);
        } else {
            console.log('waiting NavPanelList');
        }
    }, 1000);

})();