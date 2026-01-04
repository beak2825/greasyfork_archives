// ==UserScript==
// @name        AO3: [Wrangling] Tag Comments Button + Iconify
// @namespace   adustyspectacle
// @description Adds a comment buttons plus optional iconify
// @include     http://*archiveofourown.org/tags/*/wrangle*
// @include     https://*archiveofourown.org/tags/*/wrangle*
// @include     http://*archiveofourown.org/tag_wranglings*
// @include     https://*archiveofourown.org/tag_wranglings*
// @version     1.3.2
// @versions    1.3.2 - updated include urls to work with ao3's https switch
// @history     1.3.1 - realigned the comment button's wonky margins.
// @history     1.3 - added option to choose between using icons or text.
// @history     1.2.1 - added title text.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30563/AO3%3A%20%5BWrangling%5D%20Tag%20Comments%20Button%20%2B%20Iconify.user.js
// @updateURL https://update.greasyfork.org/scripts/30563/AO3%3A%20%5BWrangling%5D%20Tag%20Comments%20Button%20%2B%20Iconify.meta.js
// ==/UserScript==


/*----- OPTION -------*/

// Default is true. Use false if you want it to be text instead.
var ICONIFY = true;

/*-------------------*/


// This section here is to load FontAwesome so the icons will properly render
if (ICONIFY) {
  var font_awesome_icons = document.createElement('script');
  font_awesome_icons.setAttribute('src', 'https://use.fontawesome.com/ed555db3cc.js');
  document.getElementsByTagName('head')[0].appendChild(font_awesome_icons);

  var fa_icons_css = document.createElement('style');
  fa_icons_css.setAttribute('type', 'text/css');
  fa_icons_css.innerHTML = "tbody td ul.actions { font-family: FontAwesome, sans-serif; } tbody td .actions input[type='checkbox'] { margin: auto auto auto 0.5em; vertical-align: -0.35em; }";
  document.getElementsByTagName('head')[0].appendChild(fa_icons_css);
}

// function to make my life easier lol
function insertAfter(el, referenceNode) {
  referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

// This section checks whether there's a remove button in the page (the unwrangled and mass bins don't have them)
var btn_count = document.querySelector('table tbody ul.actions').children.length;

if (btn_count == 3) {
  var tag_edit_btns = document.querySelectorAll('table tbody ul.actions li:nth-child(1)');
  var tag_wrangle_btns = document.querySelectorAll('table tbody ul.actions li:nth-child(2)');
  var tag_works_btns = document.querySelectorAll('table tbody ul.actions li:nth-child(3)');
} else if (btn_count == 4 ) {
  var tag_remove_btns = document.querySelectorAll('table tbody ul.actions li:nth-child(1)');
  var tag_edit_btns = document.querySelectorAll('table tbody ul.actions li:nth-child(2)');
  var tag_wrangle_btns = document.querySelectorAll('table tbody ul.actions li:nth-child(3)');
  var tag_works_btns = document.querySelectorAll('table tbody ul.actions li:nth-child(4)');
}

// And this is where the whole thing happens
for (i = 0; i < tag_edit_btns.length; i++) {
  if (btn_count == 4) {
    var tag_remove_checkbox = tag_remove_btns[i].querySelector('input');
    
    if (ICONIFY) {
      tag_remove_btns[i].querySelector('label').innerHTML = '&#xf00d;';
      tag_remove_btns[i].querySelector('label').appendChild(tag_remove_checkbox);
    }

    tag_remove_btns[i].setAttribute('title', 'Remove');
    tag_remove_btns[i].querySelector('input').setAttribute('style', 'margin: auto auto auto 0.5em; vertical-align: -0.35em');
  }
  
  var comment_btn = tag_edit_btns[i].cloneNode(true);
  var comment_link = comment_btn.querySelector('a');
  var comment_link_href = comment_link.getAttribute('href').slice(0,-4) +'comments';

  if (ICONIFY) {
    comment_link.innerHTML = '&#xf086;';
    tag_edit_btns[i].querySelector('a').innerHTML = '&#xf044;';
    tag_wrangle_btns[i].querySelector('a').innerHTML = '&#xf00b;';
    tag_works_btns[i].querySelector('a').innerHTML = '&#xf02d;';
  } else {
    comment_link.innerHTML = 'Comments';
  }
  
  comment_link.setAttribute('href', comment_link_href);
  
  comment_btn.setAttribute('title', 'Comments');
  comment_btn.setAttribute('style', 'margin-left: 0.25em'); // comment button's margins are weird so blargh
  tag_edit_btns[i].setAttribute('title', 'Edit');
  tag_wrangle_btns[i].setAttribute('title', 'Wrangle');
  tag_works_btns[i].setAttribute('title', 'Works');
  
  insertAfter(comment_btn, tag_edit_btns[i]);
}
