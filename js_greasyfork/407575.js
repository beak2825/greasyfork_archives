// ==UserScript==
// @name        haj Script
// @author       Tehapollo
// @version      1.1
// @include      *https://repairpal.com/*
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    http://tampermonkey.net/
// @description  testing things
// @downloadURL https://update.greasyfork.org/scripts/407575/haj%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/407575/haj%20Script.meta.js
// ==/UserScript==

(function(doesstuff){
  $(`[class="columns small-12 xlarge-8 left-columns"]`).before(`<div style="background-color: red;">` +
  `<label style="color: black; margin-left:10px; font-weight: bold;">Keyword/Phrase Swapper</label>`+
  `<span style="margin-left: 12px;cursor:help" title="Click button swap words">&#10068;</span>` +
  `<input id="Test" value="Convert1 "type="button" ></input>` +
  `</label>` +
 `<input id="Test2" value="Convert2 "type="button" ></input>` +
  `</label>` +
`<label style="color: black; right; margin-right: 10px;">Text Here 2: ` +
  `<input type="text" name="Texthere" id="Texthere" value="" placeholder="Put your sentence here!"></input>` +
  `</label>` +
`<label style="color: black; right; margin-right: 10px;">Text Here: ` +
  `<input type="text" name="Texthere2" id="Texthere2" value="" placeholder="Put your sentence here!"></input>` +
  `</label>` +

  `</div>`)
 $("input#Test").click(function() {
            var sentence = $(`[id="Texthere"]`).val()
            var edited = sentence.replace(/estimated/g, 'usually').replace(/parts are priced between/g, 'parts range from')
            var dummy = $('<input>').val(edited).appendTo('body').select()
            document.execCommand('copy')

 });
$("input#Test2").click(function() {
            var sentence2 = $(`[id="Texthere2"]`).val()
            var edited = sentence2.replace(/estimated/g, 'usually').replace(/parts are priced between/g, 'parts range from')
            var dummy = $('<input>').val(edited).appendTo('body').select()
            document.execCommand('copy')

 });
})();