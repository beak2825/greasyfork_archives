// ==UserScript==
// @name txti.es night mode
// @namespace https://greasyfork.org/users/3759
// @version 1.01
// @description A light-on-dark theme.
// @grant GM_addStyle
// @run-at document-start
// @match *://*.txti.es/*
// @downloadURL https://update.greasyfork.org/scripts/396913/txties%20night%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/396913/txties%20night%20mode.meta.js
// ==/UserScript==

(function() {
let css = ` 

  body {
  background: #000;
  color: #ccc;
  }
  
  a {
  color: #A8C5F3; 
  }
  
  a:visited {
  color: #E5A8F3;
  }
  
  a:hover, a:focus {
  color: #F3A8A8;
  }  
  
  div {
  background: #FF002D !important;
  color: #fff;
  }
  
  div a {
  color: #000 !important;
  }  
  
  pre {
  background: #333;
  padding: 2px;
  }
  
  textarea {
  background: #222;
  color: #ccc;
  }
  
  input.text-input {
  background: #222;
  color: #ccc;
  }
  
  input#submit, input#increase_form_level {
  background: #000;
  color: #fff;
  }
  
  label.important {
  background: #f00;
  color: #fff;
  padding: 1px 5px 1px 5px;
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
