// ==UserScript==
// @name         Better GreasyFork Code Reader + JS Beautifier
// @namespace    BetterGreasyCodeReader
// @version      18
// @description  Show the Codes page of any script on GreasyFork With all code lines background in white and beautify them if you want. With this script, you can also Beautify your UserScripts before publishing them.
// @author       hacker09
// @include      https://greasyfork.org/*/script_versions/new
// @include      https://greasyfork.org/*/scripts/*/versions/new
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://greasyfork.org/&size=64
// @exclude      https://greasyfork.org/*/script_versions/new?language=css
// @include      /^https:\/\/greasyfork\.org\/(?:[^\/]+\/)scripts\/(?:[^\/]+\/)code/
// @require      https://update.greasyfork.org/scripts/483495/js-beautify.js
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418889/Better%20GreasyFork%20Code%20Reader%20%2B%20JS%20Beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/418889/Better%20GreasyFork%20Code%20Reader%20%2B%20JS%20Beautifier.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const JS_Beautifier_Options = { //Beginning of the "Your Selected Options (JSON):" Content
    "indent_size": "2",
    "indent_char": " ",
    "max_preserve_newlines": "5",
    "preserve_newlines": true,
    "keep_array_indentation": false,
    "break_chained_methods": false,
    "indent_scripts": "normal",
    "brace_style": "collapse",
    "space_before_conditional": true,
    "unescape_strings": false,
    "jslint_happy": false,
    "end_with_newline": false,
    "wrap_line_length": "0",
    "indent_inner_html": false,
    "comma_first": false,
    "e4x": false,
    "indent_empty_lines": false
  }; //End of the "Your Selected Options (JSON):" Content

  var LiCurrentISCode; //Makes the variable global
  //******************************************************************************************************************************************************************
  if (location.href.match(/^https:\/\/greasyfork\.org\/(?:[^\/]+\/)scripts\/(?:[^\/]+\/)code/)) //If the user is reading a code page
  { //Starts the if condition
    LiCurrentISCode = true; //Set the variable as true
    window.onload = (function() { //Starts the setTimeout function
      if (LiCurrentISCode) { //Run only on the Code page
        const Lines = document.querySelectorAll("pre.linenums.prettyprinted li"); //Create a variable to hold the total Code Lines
        for (var i = Lines.length; i--;) { //Starts the for condition
          Lines[i].setAttribute("style", "background: none;box-shadow: -1px 1px 2px rgba(255, 211, 0, 0.2);"); //Remove the grey line background and add a zebbra line effect
        } //Finishes the for condition
      } //Finishes the if condition
    }); //Finishes the setTimeout function
  } //Finishes the if condition
  //******************************************************************************************************************************************************************
  document.querySelector("#script-feedback-suggestion") !== null ? document.querySelector("#script-feedback-suggestion").insertAdjacentHTML('beforeend', "<input type='checkbox' class='Beautify'><label>Beautify JS Codes</label>") : document.querySelector("label.checkbox-label").insertAdjacentHTML('afterEnd', "<input type='checkbox' class='Beautify'><label>Beautify JS Codes</label>"); //Add the input check box on the page
  var CodeBackup, CodeTextElement, SourceEditorCheck, IsNewScriptPage; //Makes these variables global

  if (LiCurrentISCode !== true) { //If the li element doesn't exist
    LiCurrentISCode = false; //Set the variable as false
  } //Finishes the if condition

  if (location.href.match('versions/new') !== null) { //Run only on the Post new script page

    document.querySelector("#enable-source-editor-code").onclick = function() { //When the checkbox is clicked
      if (document.querySelector("#enable-source-editor-code").checked === true) { //If the SourceEditor is enabled
        document.querySelector("input.Beautify").disabled = true; //Disable the Beautifier button
      } //Finishes the if condition
      else { //Starts the else condition
        document.querySelector("input.Beautify").disabled = false; //Enable the Beautifier button
      } //Finishes the else condition
    }; //Finishes the onclick listener

    SourceEditorCheck = document.querySelector("#enable-source-editor-code").checked === false; //Define the SourceEditorCheck variable as false
    CodeTextElement = document.querySelector("#script_version_code").value; //Store the CodeTextElement to a variable
    IsNewScriptPage = true; //Set the variable as true
  } //Finishes the if condition

  document.querySelector("input.Beautify").onclick = function() { //When the checkbox is clicked
    if (LiCurrentISCode) { //Run only on the Code page
      CodeTextElement = document.querySelector("ol.linenums").innerText; //Store the CodeTextElement to a variable
      SourceEditorCheck = true; //Define the SourceEditorCheck variable as true
    } //Finishes the if condition

    if (IsNewScriptPage) { //Run only on the Post new script page
      SourceEditorCheck = document.querySelector("#enable-source-editor-code").checked === false; //Define the SourceEditorCheck variable as false
      CodeTextElement = document.querySelector("#script_version_code").value; //Store the CodeTextElement to a variable
    } //Finishes the if condition

    if (document.querySelector("input.Beautify").checked && SourceEditorCheck) { //Check if the Beautify checkbox is being checked and the syntax-highlighting source editor checkbox isn't checked
      CodeBackup = CodeTextElement; //Backup the actual script codes
      const BeautifiedCodes = js_beautify(CodeTextElement, JS_Beautifier_Options); //Add the beautified codes to a variable
      LiCurrentISCode !== true ? document.querySelector("#script_version_code").value = BeautifiedCodes : document.querySelector("ol.linenums").innerText = BeautifiedCodes; //Replaces the UnBeautified codes with the Beautified Codes
    } else { //Starts the else condition
      LiCurrentISCode !== true ? document.querySelector("#script_version_code").value = CodeBackup : document.querySelector("ol.linenums").innerText = CodeBackup; //If the checkbox is being unchecked, return the old UnBeautified Codes
    } //Finishes the else condition
  }; //Finishes the onclick listener
})();