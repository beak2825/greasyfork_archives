// ==UserScript==
// @name        Github.com - Extra header links
// @namespace   r-a-y/github/watching/homepage
// @description Adds "Stars" and "Watching" links, as well as your user profile link, to the header alongside the existing "Pull Requests", "Issues" and "Gist" links.
// @match       https://github.com/*
// @version     1.2.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3139/Githubcom%20-%20Extra%20header%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/3139/Githubcom%20-%20Extra%20header%20links.meta.js
// ==/UserScript==

var nav, watchingLink, starLink, user, userLink;

nav = document.querySelector('header nav');

watchingLink = document.createElement('a');
watchingLink.href = '/watching';
watchingLink.setAttribute( 'class', 'mr-lg-3' );
watchingLink.innerHTML = 'Watching';

starLink = document.createElement('a');
starLink.href = '/stars';
starLink.setAttribute( 'class', 'mr-lg-3' );
starLink.innerHTML = 'Stars';

user = document.querySelector('.header-nav-current-user .css-truncate-target').textContent;

userLink = document.createElement('a');
userLink.href = '/' + user;
userLink.setAttribute( 'class', 'mr-lg-3' );
userLink.innerHTML = user;

nav.appendChild( starLink );
nav.appendChild( watchingLink );
nav.appendChild( userLink );