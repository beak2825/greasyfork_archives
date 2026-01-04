// ==UserScript==
// @name         Archive of Our Own: Dark Mode
// @version      0.11
// @description  A dark mode for users without an account.
// @match        https://archiveofourown.org/*
// @match        http://archiveofourown.org/*
// @author       Felix G. "Automalix"
// @namespace    https://greasyfork.org/en/users/322117
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/388318/Archive%20of%20Our%20Own%3A%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/388318/Archive%20of%20Our%20Own%3A%20Dark%20Mode.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {return}
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style)}

addGlobalStyle('body, .listbox > .heading, .listbox .heading a:visited, .filters .expander {color:#EEE} a, a:link, a:visited:hover {color:#EEEEEE} a:visited {color:#DDDDDD}'
               +'a.tag {color:#EFEFEF} #modal {border:10px solid #000; background:#222} li.relationships a {background:#000}'
               +'#symbols-key, .account.module, .work {background-color:#222 !important;}'
               +'#header {background:#101010} #footer{border:none} #new_work_search, #outer, #main {background:#101010}'
               +'.wrapper {box-shadow: 1px 1px 5px #202020;} .work.meta.group {background: #121212; border:1px solid #111}'
               +'fieldset, .listbox, fieldset fieldset.listbox {background-color:#222; box-shadow: inset 1px 0 5px #202020; border: 2px solid #000000}'
               +'.listbox .index {background:#333; box-shadow:inset 1px 1px 3px #222}'
               +'.actions a, .actions a:link, .action, .action:link, .actions input, input[type="submit"], button, .current, .actions label{background-image:none; background:#666;'
               +'color:#FFF; border:none} #site_search {background:#000} form.verbose legend, .verbose form legend {background:#121212; border:2px solid #000; box-shadow:none}'
               +'#admin-banner {display:none}');
