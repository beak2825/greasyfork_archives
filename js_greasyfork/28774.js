// ==UserScript==
// @name        WordPress.org Plugins Enhancements
// @description Enhancements to the wordpress.org plugins repository after the 2017 redesign.
// @namespace   r-a-y/wporg/svn
// @include     https://wordpress.org/plugins/*
// @version     1.0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28774/WordPressorg%20Plugins%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/28774/WordPressorg%20Plugins%20Enhancements.meta.js
// ==/UserScript==

var a = document.createElement('a'),
    sections = document.querySelectorAll('.section'),
    readMore = document.querySelectorAll('.section-toggle'),
    i = 0;

// Set up link for SVN repo.
a.setAttribute('href','https://plugins.svn.wordpress.org/' + wporgLocaleBanner.currentPlugin);
a.innerHTML = 'SVN repository';

// Add link to "Interested in Development?" section.
document.querySelector('.plugin-development').appendChild( a );

// Show all hidden content.
for( i; i < sections.length;i++ ) {
	sections[i].classList.remove('read-more');
}

// Remove all "Read More" links.
i = 0;
for( i; i < readMore.length;i++ ) {
	readMore[i].style.display = 'none';
}