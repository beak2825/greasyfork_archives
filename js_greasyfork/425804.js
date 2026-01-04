// ==UserScript==
// @name            Gerrit checkbox resolved is always unchecked
// @description     Never automatically check "resolved", even on Done or Ack.
// @include         https://gerrit.example.com/c/*
// @version         1
// @run-at          document-start
// @namespace https://greasyfork.org/users/767392
// @downloadURL https://update.greasyfork.org/scripts/425804/Gerrit%20checkbox%20resolved%20is%20always%20unchecked.user.js
// @updateURL https://update.greasyfork.org/scripts/425804/Gerrit%20checkbox%20resolved%20is%20always%20unchecked.meta.js
// ==/UserScript==


function patchScript() {
    text = this.responseText
    text = text.replace(/n.unresolved=i/g, "n.unresolved=true");
  
    var newScript = document.createElement('script');
    newScript.type = "text/javascript";
    newScript.textContent = text;
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(newScript);
}

window.addEventListener('beforescriptexecute',
  function(event)
  {
    var originalScript = event.target;

    if(/\/gr-app\.js$/.test(originalScript.src)) 
    { 
      var replacementScript = document.createElement('script');
      console.log('Greasemonkey is patching:', originalScript.src);

      originalScript.parentNode.replaceChild(replacementScript, originalScript);

      // prevent execution of the original script
      event.preventDefault();
      
      // load script and patch
      var oReq = new XMLHttpRequest();
      oReq.addEventListener("load", patchScript);
      oReq.open("GET", originalScript.src);
      oReq.send();
    }
  }
);
