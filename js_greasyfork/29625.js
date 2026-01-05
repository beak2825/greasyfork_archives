// ==UserScript==
// @description    Replaces some math text in Canvas from Angel
// @name           Angel to Canvas Quiz Filter
// @version        0.2.1
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant    GM_addStyle
// @run-at document-idle
// @include        https://psu.instructure.com/courses/*
// @namespace https://greasyfork.org/users/10310

// @downloadURL https://update.greasyfork.org/scripts/29625/Angel%20to%20Canvas%20Quiz%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/29625/Angel%20to%20Canvas%20Quiz%20Filter.meta.js
// ==/UserScript==

/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox.
*/



var buttonAnchor1 = $("#show_question_details");
//-- Add our button.
buttonAnchor1.parent().after(
    '<br><a href="#" id="HTMLscript"><font size=3><strong>[Click to run Angel to Canvas math script: remove \\displaystyle, \\( & \\)]</strong></font></a>' );
//-- Activate the button.
$("#HTMLscript").click(function(){
    var textnodes, node, s;
    textnodes = document.evaluate("//body//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < textnodes.snapshotLength; i++){

       node = textnodes.snapshotItem(i);
        s = node.data;


        // Remove /displaystyle, /( and /)
        s = s.replace(/\\\(/g, " ");
        s = s.replace(/\\\)/g, " ");
        s = s.replace(/\\displaystyle/g, " ");

/*        ///////////////////////////
        // Format in-equation text(xyzq rstlne)
        var reTxt = /\btext\([\w\s]+\)/g;
        s = s.replace(reTxt, function(match) {
            // return formatting with parenthetical text minus parentheses
            return "\\text{" + match.match(/\((\w|\s)+/gi)[0].replace(/\(/, "") + "}"; });
*/

        // Remove specific span and br tags
        //s = s.replace(/<span style="color: #000000;">/g, " ");
        //s = s.replace(/<br \/>\s*<br \/> <\/span>/g, " ");



        node.data = s;
   }} );  // end of button



var buttonAnchor2 = $("#show_question_details");
//-- Add our button.
buttonAnchor2.parent().after(
    '<br><a href="#" id="HTMLscript"><font size=3><strong>[Click to switch / to \\. (Use only if converting <em>imported</em> Angel equations, not pasted from Angel.)]</strong></font></a>' );
//-- Activate the button.
$("#HTMLscript").click(function(){
    var textnodes, node, s;
    textnodes = document.evaluate("//body//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < textnodes.snapshotLength; i++){

       node = textnodes.snapshotItem(i);
        s = node.data;



        // Replace / with \
        s = s.replace(/<\//g, "<HTMLENDTAG");        // Mask HTML
        s = s.replace(/\//g, "\\");
        s = s.replace(/<HTMLENDTAG/g, "</");        // Unmask HTML




        node.data = s;
   }} );  // end of button



var buttonAnchor3 = $("#show_question_details");
//-- Add our button.
buttonAnchor3.parent().after(
    '<br><a href="#" id="HTMLscript"><font size=3><strong>[Click to run Angel to Canvas Multiple Fill-in-the-Blank script A: replace <i>[l1]</i> with <i>____</i>]</strong></font></a>' );
//-- Activate the button.
$("#HTMLscript").click(function(){
    var textnodes, node, s;
    textnodes = document.evaluate("//body//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < textnodes.snapshotLength; i++){

       node = textnodes.snapshotItem(i);
        s = node.data;


        // Replace [l1]
        s = s.replace(/\[l1\]/g, " ____ ");




        node.data = s;
   }} );  // end of button



var buttonAnchor3 = $("#show_question_details");
//-- Add our button.
buttonAnchor3.parent().after(
    '<br><a href="#" id="HTMLscript"><font size=3><strong>[Click to run Angel to Canvas Multiple Fill-in-the-Blank script B: replace <i>_123_</i> with <i>[l123]</i>]</strong></font></a>' );
//-- Activate the button.
$("#HTMLscript").click(function(){
    var textnodes, node, s;
    textnodes = document.evaluate("//body//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < textnodes.snapshotLength; i++){

       node = textnodes.snapshotItem(i);
        s = node.data;



        var reInt = /\d\d?\d?/gi;

        // Format _###_ as [###]
        var reBlank = /\_\d\d?\d?\_/g;
        s = s.replace(reBlank, function(match) {
           // return formatting with the number
           return "[l" + match.match(reInt)[0] + "]";
        });



        node.data = s;
   }} );  // end of button



/*
var buttonAnchor1 = $("#show_question_details");
//-- Add our button.
buttonAnchor1.parent ().after (
    '<br><a href="#" id="scriptButton#"><font size=2><strong>[Click to run script]</strong></font></a> ' );
//-- Activate the button.
$("#scriptButton#").click(function(){
    var textnodes, node, s;
    textnodes = document.evaluate( "//body//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < textnodes.snapshotLength; i++){

       node = textnodes.snapshotItem(i);
       s = node.data;


       node.data = s;
   }} );  // end of button
*/



/*
var buttonAnchor1 = $("#show_question_details");
//-- Add our button.
buttonAnchor1.parent ().after (
    '<br><a href="#" id="scriptButton#"><font size=2><strong>[Click to run script]</strong></font></a> ' );
//-- Activate the button.
$("#scriptButton#").click(function(){
    var textnodes, node, s;
    textnodes = document.evaluate( "//body//text()", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < textnodes.snapshotLength; i++){

       node = textnodes.snapshotItem(i);
       s = node.data;


       node.data = s;
   }} );  // end of button
*/




//GM_log("The Master script is running!");
//alert("The Master script is running!");