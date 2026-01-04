// ==UserScript==
// @name         Sketchtoy for VLOG
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adapt sketchtoy for my YouTube VLOG
// @author       LapaMauve
// @match        https://sketchtoy.com/*
// @grant        none
// @run-at document-start
//
// @downloadURL https://update.greasyfork.org/scripts/369053/Sketchtoy%20for%20VLOG.user.js
// @updateURL https://update.greasyfork.org/scripts/369053/Sketchtoy%20for%20VLOG.meta.js
// ==/UserScript==

console.log ("Hijack sketchtoy");

var nameToAdd = 'https://rawgit.com/LapaMauve/sketchtoy/master/sketchtoy.min.js?' + Math.floor (Math.random () * 10000);

var changed = 0; // script need to be edited with

window.addEventListener('beforescriptexecute', function(e) {

    ///for external script:
	var src = e.target.src;
    console.log (src);
	if (src.search('sketch.min.js') !== -1) {
                changed++;
		e.preventDefault();
		e.stopPropagation();
		addJS_Node (null, nameToAdd);
	}
});

function addJS_Node (text, s_URL, funcToRun) {
    var D                                   = document;
    var scriptNode                          = D.createElement ('script');
    scriptNode.type                         = "text/javascript";
    if (text)       scriptNode.textContent  = text;
    if (s_URL)      scriptNode.src          = s_URL;
    if (funcToRun)  scriptNode.textContent  = '(' + funcToRun.toString() + ')()';

    var targ    = D.getElementsByTagName('body')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}
addJS_Node (null, nameToAdd);
window.addEventListener('beforescriptexecute',
  function(event)
  {
    var originalScript = event.target;

    // debug output of full qualified script url
    console.log('script detected:', originalScript.src);

    // script ends with 'originalscript.js' ?
    // you can test as well: '<full qualified url>' === originalScript.src
    if('sketch.min.js'.search(originalScript.src) !== -1)
    {
      var replacementScript = document.createElement('script');
      replacementScript.src = nameToAdd;

      originalScript.parentNode.replaceChild(replacementScript, originalScript);

      // prevent execution of the original script
      event.preventDefault();
    }
  }
);