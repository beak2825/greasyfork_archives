// ==UserScript==
// @name         SourceTree Clone for GitLab
// @namespace    https://sanin.dev
// @version      0.5
// @description  Add a "Clone with SourceTree" button to GitLab, if you're into that sort of thing
// @author       Cory Sanin
// @match        *://gitlab.com/*
// @grant        none
// @icon         https://www.sourcetreeapp.com/assets/img/favicons/sourcetree/android-chrome-192x192.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/407857/SourceTree%20Clone%20for%20GitLab.user.js
// @updateURL https://update.greasyfork.org/scripts/407857/SourceTree%20Clone%20for%20GitLab.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var clonemenu = document.querySelector('ul.clone-options-dropdown');
    if(clonemenu){
        var openWithOptions = document.getElementsByClassName('open-with-link')[0].parentNode;
        var div = document.createElement('div');
        div.classList.add('gl-new-dropdown-item-text-wrapper');
        var a = document.createElement('a');
        a.classList.add('dropdown-item', 'open-with-link');
        a.href = `sourcetree://cloneRepo/${document.getElementById('ssh_project_clone').value}`
        div.appendChild(document.createTextNode('Clone In SourceTree'));
        a.appendChild(div);
        openWithOptions.appendChild(a);
    }
})();