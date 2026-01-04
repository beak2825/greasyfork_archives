// ==UserScript==
// @name		    UD Better Name Colorer
// @author			Bradley Sattem (a.k.a. Aichon)
// @namespace		http://aichon.com
// @version			1.2.1
// @description		Modifies the colors of character names from the defaults
// @match			http://urbandead.com/*
// @match			http://www.urbandead.com/*
// @grant       	none
// @downloadURL https://update.greasyfork.org/scripts/432670/UD%20Better%20Name%20Colorer.user.js
// @updateURL https://update.greasyfork.org/scripts/432670/UD%20Better%20Name%20Colorer.meta.js
// ==/UserScript==

/* Urban Dead Button Remover
 *
 * Copyright (C) 2016 Bradley Sattem
 * Last Modified: 2016-07-26
 *
 * Tested under: Chrome 51 on Windows
 *
 * Contact: [my first name [DOT] my last name]@gmail.com (check the Copyright info for my name)
 *
 * Changes:
 *   1.2.1 - Fixing bug with colors not applying to some pages.
 *   1.2   - Adding auto-updating. Optimizations. Making it easier to edit.
 *   1.1   - Tweaks and changes so it plays nice with Barrista
 *   1.0   - Initial public release
 *
 */

//////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// DEFINE YOUR CSS RULES IN HERE /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function addRules(css)
{
    css.push("a.barricade {color: #232 ! important;}");
    css.push("a.barricade:hover, a.barristaButton:hover {text-decoration: none ! important;}");
    css.push("a.barristaCharName:hover {text-decoration: underline ! important;}");
    css.push("a {color: #ded ! important;}");
    css.push("a:hover {text-decoration: underline ! important;}");
    css.push("table.c a {color: #000 ! important;}");
    css.push("table.c td.sb a {color: #ded ! important;}");
    css.push(".con1 {color: #c6c6c6 ! important; font-weight: normal ! important;}");	// gray
    css.push(".con2 {color: #eca1a3 ! important; font-weight: normal ! important;}");	// red
    css.push(".con3 {color: #f4ca79 ! important; font-weight: normal ! important;}");	// orange
    css.push(".con4 {color: #fef38b ! important; font-weight: normal ! important;}");	// yellow
    css.push(".con5 {color: #b4de88 ! important; font-weight: normal ! important;}");	// green
    css.push(".con6 {color: #a6bafa ! important; font-weight: normal ! important;}");	// blue
    css.push(".con7 {color: #caa6ea ! important; font-weight: normal ! important;}");	// purple
    css.push(".con8 {color: #303030 ! important; font-weight: normal ! important;}");	// black
    css.push(".con9 {color: #ffffff ! important; font-weight: normal ! important;}");	// white
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////// DO NOT EDIT BELOW THIS LINE //////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////

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

// Adds the rules we'll be using
var cssRulesToAdd = [];
addRules(cssRulesToAdd);

// Write the new CSS rules to the document
writeRules(cssRulesToAdd);