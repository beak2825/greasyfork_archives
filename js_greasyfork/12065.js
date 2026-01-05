// ==UserScript==
// @name         PHP Documentation Columnify & Other Improvements
// @version      2.0
// @description  View the PHP document front page in a multi-column layout and some other small improvements.
// @author       Shakil Shahadat
// @match        https://www.php.net/manual/*/
// @match        https://www.php.net/manual/*/index.php
// @namespace    https://greasyfork.org/en/users/6404-shakil
// @downloadURL https://update.greasyfork.org/scripts/12065/PHP%20Documentation%20Columnify%20%20Other%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/12065/PHP%20Documentation%20Columnify%20%20Other%20Improvements.meta.js
// ==/UserScript==

'use strict';

// Multi-column layout
document.querySelector( '.chunklist' ).style.WebkitColumnCount = 5;
document.querySelector( '.chunklist' ).style.MozColumnCount = 5;
document.querySelector( '.chunklist' ).style.ColumnCount = 5;

document.querySelector( '.chunklist' ).style.WebkitColumnRuleStyle = 'dotted';
document.querySelector( '.chunklist' ).style.MozColumnRuleStyle = 'dotted';
document.querySelector( '.chunklist' ).style.ColumnRuleStyle = 'dotted';

document.querySelector( '.chunklist' ).style.WebkitColumnRuleWidth = '1px';
document.querySelector( '.chunklist' ).style.MozColumnRuleWidth = '1px';
document.querySelector( '.chunklist' ).style.ColumnRuleWidth = '1px';

// Hide unnecessary segments
for ( let e of [ '.headsup', '.page-tools', '.info', '.contribute', '#usernotes', 'footer' ] )
{
	document.querySelector( e ).style.display = 'none';
}

// Keep the header where it should be
document.querySelector( 'nav' ).style.position = 'absolute';

// Widen the layout
document.querySelector( '#layout' ).style.width = '100%';

// Add target="_blank" to all anchor tags, v 2.1
for ( let x of document.links ) x.setAttribute( 'target', '_blank' );
