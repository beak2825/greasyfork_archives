// ==UserScript==
// @name txti.es grey
// @namespace https://greasyfork.org/users/3759
// @version 1.01
// @description A low-contrast grey theme.
// @grant GM_addStyle
// @run-at document-start
// @match *://*.txti.es/*
// @downloadURL https://update.greasyfork.org/scripts/396912/txties%20grey.user.js
// @updateURL https://update.greasyfork.org/scripts/396912/txties%20grey.meta.js
// ==/UserScript==

(function() {
let css = ` 

  body {
  background: #aaa;
  color: #000;
  }
  
  a {
  color: #005; 
  }
  
  a:visited {
  color: #505;
  }
  
  a:hover, a:focus {
  color: #500;
  }  
  
  div {
  background: #888 !important;
  }
  
  pre {
  background: #ccc;
  padding: 2px;
  }
  
  hr {
  color: #222;
  }
  
  textarea {
  background: #ccc;
  }
  
  input.text-input {
  background: #ddd;
  color: #222;
  }
  
  label.important {
  background: #000;
  color: #eee;
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
