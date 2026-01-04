// ==UserScript==
// @name         GitHub PR File Filter
// @namespace    btilford
// @author       btilford
// @version      0.1
// @license      MIT
// @description  Hide and mark files as viewed using regex pattern.
// @match        https://github.com/*/*/pull/*/files*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/419465/GitHub%20PR%20File%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/419465/GitHub%20PR%20File%20Filter.meta.js
// ==/UserScript==

(function githubPrFilter() {
    'use strict';
    console.debug('Loading PR file filter');
    function selectFiles(pattern) {
        const regex = new RegExp(pattern);
        const files = [...window.document.querySelectorAll('.file')];
        console.debug('Filtering %d files in PR with pattern %s', files.length, regex);
        return files.filter(_ => {
            const link = _.querySelector('.link-gray-dark');
            return regex.test(link.title) || regex.test(link.innerText);
        });
    }

    const container = unsafeWindow.document.createElement('div');
    container.className = 'select-menu-list';
    container.style = 'width: 280px; margin-bottom: 8px;';

    const pattern = unsafeWindow.document.createElement('input');
    pattern.name = 'filter-pattern';
    pattern.placeholder = 'regex';
    pattern.title = 'File matching regex';
    pattern.className = 'form-control form-control subnav-search-input input-contrast';
    pattern.style = 'margin: 8px 4px; width: 270px;';

    container.appendChild(pattern);


    const btnClasses = 'js-reviewed-toggle ml-2 mr-1 px-2 py-1 rounded-1 f6 text-normal border js-reviewed-file bg-blue-2 border-blue-light';
    const hide = unsafeWindow.document.createElement('button');
    hide.style = 'color: rgb(201, 209, 217);';
    hide.innerHTML = '<label>hide</label>';
    hide.className = btnClasses;
    hide.onclick = () => {
        const ptn = pattern.value;
        const files = selectFiles(ptn);
        console.debug('hiding %d files matching pattern %s', files.length, ptn);
        files.forEach(_ => {
            const open = _.querySelector('.open .file-info button.btn-octicon');
            if(open) {
                open.click();
            }
        });
    }
    container.appendChild(hide);

    const viewed = unsafeWindow.document.createElement('button');
    viewed.style = 'color: rgb(201, 209, 217);';
    viewed.innerHTML = '<label>viewed</label>';
    viewed.className = btnClasses;
    viewed.onclick = () => {
        const ptn = pattern.value;
        const files = selectFiles(ptn);
        console.debug('hiding %d files matching pattern %s', files.length, ptn);
        files.forEach(_ => {
            const unchecked = _.querySelector('.file-actions input.js-reviewed-checkbox:not(:checked)[type=checkbox]');
            if(unchecked) {
                //unchecked.checked = true;
                unchecked.click();
            }
        });
    }
    container.appendChild(viewed);

    const parent = unsafeWindow.document.querySelector('.diffbar-item.details-overlay.select-menu.js-file-filter .select-menu-modal .select-menu-header');
    console.log('Inserting regex filter on %o', parent);
    parent.insertAdjacentElement('afterend', container);

    // Your code here...
})();