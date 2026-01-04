// ==UserScript==
// @name        Remove EEECS GitLab system broadcast banners
// @description Removes the system broadcast messages from the new EEECS GitLab instance, since they're not needed after login.
// @include     https://gitlab2.eeecs.qub.ac.uk/*
// @version     1.0.0
// @namespace https://greasyfork.org/users/398562
// @downloadURL https://update.greasyfork.org/scripts/392508/Remove%20EEECS%20GitLab%20system%20broadcast%20banners.user.js
// @updateURL https://update.greasyfork.org/scripts/392508/Remove%20EEECS%20GitLab%20system%20broadcast%20banners.meta.js
// ==/UserScript==

let removeFunction = (list) => {
    for (let i = list.length; --i>=0;) {
        list[i].parentNode.removeChild(list[i]);
    }
};

let p = document.getElementsByClassName('header-message');
removeFunction(p);

let q = document.getElementsByClassName('footer-message');
removeFunction(q);

document.documentElement.classList = [];
