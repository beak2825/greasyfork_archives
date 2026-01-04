// ==UserScript==
// @name txti.es solarized light
// @namespace https://greasyfork.org/users/3759
// @version 1.01
// @description A theme based on Ethan Schoonover's Solarized colorscheme.
// @grant GM_addStyle
// @run-at document-start
// @match *://*.txti.es/*
// @downloadURL https://update.greasyfork.org/scripts/396915/txties%20solarized%20light.user.js
// @updateURL https://update.greasyfork.org/scripts/396915/txties%20solarized%20light.meta.js
// ==/UserScript==

(function() {
let css = ` 

  body {
  background: #EEE8D5;
  color: #002B36;
  }
  
  a {
  color: #6C71C4; 
  }
  
  a:visited {
  color: #D33682;
  }
  
  a:hover, a:focus {
  color: #DC322F;
  }  
  
  div {
  background: #839496 !important;
  color: #FDF6E3;
  }
  
  div a {
  color: #002B36 !important;
  }  
  
  pre {
  background: #93A1A1;
  padding: 2px;
  }
  
  hr {
  color: #002B36;
  }
  
  textarea {
  background: #FDF6E3;
  color: #002B36;
  border-top: 1px solid #93A1A1;
  border-left: 1px solid #93A1A1;
  border-right: 1px solid #657B83;
  border-bottom: 1px solid #657B83;
  }
  
  input.text-input {
  background: #FDF6E3;
  color: #002B36;
  border-top: 1px solid #93A1A1;
  border-left: 1px solid #93A1A1;
  border-right: 1px solid #657B83;
  border-bottom: 1px solid #657B83;
  }
  
  fieldset {  
  border-top: 1px solid #93A1A1;
  border-left: 1px solid #93A1A1;
  border-right: 1px solid #657B83;
  border-bottom: 1px solid #657B83;  
  }
  
  input#submit, input#increase_form_level {
  background: #EEE8D5;
  border-top: 1px solid #93A1A1;
  border-left: 1px solid #93A1A1;
  border-right: 1px solid #657B83;
  border-bottom: 1px solid #657B83;
  padding: 3px 5px 3px 5px;
  border-radius: 10px;
  box-shadow: inset 0 10px 5px #FDF6E3;
  }
  
  input#submit:active, input#increase_form_level:active {
  background: #EEE8D5;
  box-shadow: none;
  }  
  
  label.important {
  background: none;
  color: #DC322F;
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
