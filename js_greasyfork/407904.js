// ==UserScript==
// @name         SourceTree Clone for GitHub
// @namespace    https://sanin.dev
// @version      0.3
// @description  Add a "Clone with SourceTree" button to GitHub, if you're into that sort of thing
// @author       Cory Sanin
// @match        *://github.com/*
// @grant        none
// @icon         https://www.sourcetreeapp.com/assets/img/favicons/sourcetree/android-chrome-192x192.png
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/407904/SourceTree%20Clone%20for%20GitHub.user.js
// @updateURL https://update.greasyfork.org/scripts/407904/SourceTree%20Clone%20for%20GitHub.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var clonemenu = document.querySelector('.get-repo-modal ul');
    if(clonemenu){
        var li = document.createElement('li');
        li.classList.add('Box-row', 'Box-row--hover-gray', 'p-0', 'rounded-0', 'mt-0');
        var btn = document.createElement('a');
        btn.classList.add('d-flex', 'flex-items-center', 'text-gray-dark', 'text-bold', 'no-underline', 'p-3');
        btn.innerHTML = '<svg class="octicon octicon-desktop-download mr-3" width="16" height="16" version="1.1" viewBox="0 0 16 16"><path d="M13.1,5.1C13.1,2.3,10.8,0,8,0S2.9,2.3,2.9,5.1c0,2.5,1.8,4.6,4.1,5V16h2v-5.9C11.4,9.7,13.1,7.6,13.1,5.1z M8,8.2c-1.7,0-3.1-1.4-3.1-3.1S6.3,2,8,2s3.1,1.4,3.1,3.1S9.7,8.2,8,8.2z"></path></svg>'
            + 'Clone In SourceTree';
        btn.tabIndex = 0;
        btn.href = `sourcetree://cloneRepo/${document.querySelector('.get-repo-modal .ssh-clone-options > div input').value}`
        li.appendChild(btn);
        clonemenu.insertBefore(li, clonemenu.childNodes[0]);
    }
})();