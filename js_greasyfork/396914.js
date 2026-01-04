// ==UserScript==
// @name txti.es olive
// @namespace https://greasyfork.org/users/3759
// @version 1.01
// @description An olive green theme.
// @grant GM_addStyle
// @run-at document-start
// @match *://*.txti.es/*
// @downloadURL https://update.greasyfork.org/scripts/396914/txties%20olive.user.js
// @updateURL https://update.greasyfork.org/scripts/396914/txties%20olive.meta.js
// ==/UserScript==

(function() {
let css = ` 

  body {
  background: #536941;
  color: #EFFACD;
  }
  
  a {
  color: #142704; 
  }
  
  a:visited {
  color: #000000;
  }
  
  a:hover, a:focus {
  color: #CAF2A7;
  }  
  
  div {
  background: #2C4920 !important;
  color: #EFFACD;
  }
  
  div a {
  color: #CAF2A7 !important;
  }  
  
  pre {
  background: #3E4837;
  padding: 2px;
  }
  
  hr {
  color: #536941;
  }
  
  textarea {
  background: #3E4837;
  color: #EFFACD;
  border-top: 1px solid #646D60;
  border-left: 1px solid #646D60;
  border-right: 1px solid #353933;
  border-bottom: 1px solid #353933;
  }
  
  input.text-input {
  background: #3E4837;
  color: #EFFACD;
  border-top: 1px solid #646D60;
  border-left: 1px solid #646D60;
  border-right: 1px solid #353933;
  border-bottom: 1px solid #353933;
  }
  
  fieldset {  
  border-top: 1px solid #646D60;
  border-left: 1px solid #646D60;
  border-right: 1px solid #353933;
  border-bottom: 1px solid #353933;
  }
  
  input#submit, input#increase_form_level, input#delete-submit {
  background: #3E4837;
  color: #EFFACD;
  border-top: 1px solid #646D60;
  border-left: 1px solid #646D60;
  border-right: 1px solid #353933;
  border-bottom: 1px solid #353933;
  padding: 3px 5px 3px 5px;
  border-radius: 10px;
  box-shadow: inset 0 10px 5px #353933;
  }
  
  input#submit:active, input#increase_form_level:active, input#delete-submit:active {
  background: #536941;
  box-shadow: none;
  }  
  
  label.important {
  background: none;
  color: #CAF2A7;
  }

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
