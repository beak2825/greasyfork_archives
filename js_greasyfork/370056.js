// ==UserScript==
// @name         NotebookAutoViewer
// @namespace    https://greasyfork.org/scripts/370056/
// @version      0.1.2
// @description  Auto view ipython notebook file in github with nbviewer
// @author       Yixian Du
// @match        https://*.github.com/*.ipynb
// @license      The MIT License (MIT); http://opensource.org/licenses/MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370056/NotebookAutoViewer.user.js
// @updateURL https://update.greasyfork.org/scripts/370056/NotebookAutoViewer.meta.js
// ==/UserScript==

var view = function() {
    'use strict';

    if (location.pathname.endsWith('.ipynb')){
        location.assign('https://nbviewer.jupyter.org/github' + location.pathname);
    }
};

function create_view_button() {
    var viewer = document.createElement('span');
    viewer.innerText = 'View';
    viewer.style.color = 'red';
    viewer.addEventListener('click', view, false );
    var path = document.getElementsByClassName('final-path')[0];
    path.parentElement.appendChild(viewer);
};

create_view_button();

