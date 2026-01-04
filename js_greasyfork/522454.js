// ==UserScript==
// @name        syntax-highlighting
// @description Add syntax highlight to code blocks on the REAPER forum
// @namespace   https://cfillion.ca
// @version     1.0.3
// @author      cfillion
// @license     GPL-3.0-or-later
// @include     https://forum.cockos.com/showthread.php*
// @include     https://forum.cockos.com/showpost.php*
// @include     https://forum.cockos.com/editpost.php*
// @include     https://forum.cockos.com/newreply.php*
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.3/highlight.min.js
// @downloadURL https://update.greasyfork.org/scripts/522454/syntax-highlighting.user.js
// @updateURL https://update.greasyfork.org/scripts/522454/syntax-highlighting.meta.js
// ==/UserScript==

// highlight.js v11 removed auto-merging of html (removes links) 

var theme = document.createElement('link');
theme.rel = 'stylesheet';
theme.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.3/styles/sunburst.min.css';
document.body.appendChild(theme);

var style = document.createElement('style');
style.textContent = `
  pre.alt2 a:link, pre.alt2 a:visited { color: white; }
  pre.alt2 font { color: inherit; }
`;
document.body.appendChild(style);

hljs.configure({
  tabReplace: '\x20'.repeat(2),
  languages: ['lua', 'cpp'],
});

document.querySelectorAll('pre.alt2').forEach(hljs.highlightBlock);
