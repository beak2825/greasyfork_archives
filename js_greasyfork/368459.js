// ==UserScript==
// @name        Github.com - Extra header links - modified
// @namespace   "zhouhao/github/header"
// @description Adds extra links in github header
// @include     https://github.com/*
// @version     2.1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/368459/Githubcom%20-%20Extra%20header%20links%20-%20modified.user.js
// @updateURL https://update.greasyfork.org/scripts/368459/Githubcom%20-%20Extra%20header%20links%20-%20modified.meta.js
// ==/UserScript==

const nav = document.querySelectorAll('nav.d-flex')[0];
const className = 'js-selected-navigation-item Header-link mt-md-n3 mb-md-n3 py-2 py-md-3 mr-0 mr-md-3 border-top border-md-top-0 border-white-fade-15';

const createItem = (link, text) => {
    const myLink = document.createElement('a');
    myLink.href = '/' + link;
    myLink.setAttribute( 'class', className );
    myLink.innerHTML = text;
    nav.appendChild( myLink );
};

createItem('stars','Stars');
createItem('topics','Topics');

let user = document.querySelector('meta[name="user-login"]').content
createItem(user,user);