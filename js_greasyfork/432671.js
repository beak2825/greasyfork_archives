// ==UserScript==
// @name		    UD Block Wrap
// @author			Bradley Sattem (a.k.a. Aichon)
// @namespace		http://aichon.com
// @version			1.0
// @description		Wraps the names of blocks that stretch wide in Chrome
// @include			http://urbandead.com/map.cgi*
// @include			http://www.urbandead.com/map.cgi*
// @exclude			http://urbandead.com/map.cgi?logout
// @exclude			http://www.urbandead.com/map.cgi?logout
// @grant       	none
// @downloadURL https://update.greasyfork.org/scripts/432671/UD%20Block%20Wrap.user.js
// @updateURL https://update.greasyfork.org/scripts/432671/UD%20Block%20Wrap.meta.js
// ==/UserScript==

/* Urban Dead Block Wrap
 *
 * Copyright (C) 2016 Bradley Sattem
 * Last Modified: 2016-07-26
 *
 * Tested under: Chrome 51 on Windows
 *
 * Contact: [my first name [DOT] my last name]@gmail.com (check the Copyright info for my name)
 *
 * Changes:
 *   v1.0   - Initial public release
 *
 */

// Replaces carriage returns and newlines in the block names with spaces
function fixName(block)
{
    block.value = replaceSubstring(block.value, "\r", " ");
    block.value = replaceSubstring(block.value, "\n", " ");
}

// Replaces the found text in a source string with replacement text
function replaceSubstring(source, find, replace)
{
    return source.split(find).join(replace);
}

// Grabs the DOM nodes for the 9 blocks in the minimap
function getBlocks()
{
    // NOTE: We're using // before "input" because the current block is not part of a form, but the other 8 blocks are
    return document.evaluate("//td[@class='cp']/table[@class='c']/tbody/tr/td//input[@type='submit']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
}

// Writes the specified CSS rules to the page
function writeRules(css)
{
    var results = document.evaluate("//head", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    if (results.snapshotLength == 1)
    {
        // Create a new style element to contain our rules and add it to the head
        var head = results.snapshotItem(0);
        var style = document.createElement('style');
        style.type = 'text/css';
        head.appendChild(style);

        if (style.sheet && style.sheet.insertRule)
        {
            // Loop through our rules and add each to the style element
            for (var i = 0; i < css.length; i++)
                style.sheet.insertRule(css[i], 0);
        }
    }
}

var blocks = getBlocks();
for( i = 0; i < blocks.snapshotLength; i++ )
{
    fixName(blocks.snapshotItem(i));
}

var cssRulesToAdd = [];
cssRulesToAdd.push("input {white-space: normal ! important;");
writeRules(cssRulesToAdd);