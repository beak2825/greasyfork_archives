// ==UserScript==
// @name txti.es solarized dark
// @namespace https://greasyfork.org/users/3759
// @version 1.01
// @description A theme based on Ethan Schoonover's Solarized colorscheme.
// @grant GM_addStyle
// @run-at document-start
// @match *://*.txti.es/*
// @downloadURL https://update.greasyfork.org/scripts/396917/txties%20solarized%20dark.user.js
// @updateURL https://update.greasyfork.org/scripts/396917/txties%20solarized%20dark.meta.js
// ==/UserScript==

(function() {
let css = ` 

  body {
  background: #002B36;
  color: #FDF6E3;
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
  background: #073642;
  padding: 2px;
  }
  
  hr {
  color: #002B36;
  }
  
  textarea {
  background: #073642;
  color: #FDF6E3;
  border-top: 1px solid #657B83;
  border-left: 1px solid #657B83;
  border-right: 1px solid #586E75;
  border-bottom: 1px solid #586E75;
  }
  
  input.text-input {
  background: #073642;
  color: #FDF6E3;
  border-top: 1px solid #657B83;
  border-left: 1px solid #657B83;
  border-right: 1px solid #586E75;
  border-bottom: 1px solid #586E75;
  }
  
  fieldset {  
  border-top: 1px solid #657B83;
  border-left: 1px solid #657B83;
  border-right: 1px solid #586E75;
  border-bottom: 1px solid #586E75;
  }
  
  input#submit, input#increase_form_level {
  background: #073642;
  color: #FDF6E3;
  border-top: 1px solid #657B83;
  border-left: 1px solid #657B83;
  border-right: 1px solid #586E75;
  border-bottom: 1px solid #586E75;
  padding: 3px 5px 3px 5px;
  border-radius: 10px;
  box-shadow: inset 0 10px 5px #586E75;
  }
  
  input#submit:active, input#increase_form_level:active {
  background: #002B36;
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
