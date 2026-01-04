// ==UserScript==
// @name txti.es pastel
// @namespace https://greasyfork.org/users/3759
// @version 1.01
// @description A cute pastel theme!
// @grant GM_addStyle
// @run-at document-start
// @match *://*.txti.es/*
// @downloadURL https://update.greasyfork.org/scripts/396918/txties%20pastel.user.js
// @updateURL https://update.greasyfork.org/scripts/396918/txties%20pastel.meta.js
// ==/UserScript==

(function() {
let css = ` 

  body {
  background: #F7E9F2;
  color: #4F0636;
  }
  
  a {
  color: #093556; 
  }
  
  a:visited {
  color: #350956;
  }
  
  a:hover, a:focus {
  color: #561B09;
  }  
  
  div {
  background: #F8F7D2 !important;
  color: #4F0636;
  border-radius: 20px;
  }
  
  div a {
  color: #093556 !important;
  }  
  
  pre {
  background: #F8F7D2;
  padding: 5px;
  border-radius: 20px;
  }
  
  hr {
  color: #F7E9F2;
  }
  
  textarea {
  background: #D5FAFD;
  color: #10466E;
  border-top: 1px solid #DAD6FF;
  border-left: 1px solid #DAD6FF;
  border-right: 1px solid #C9C6E8;
  border-bottom: 1px solid #C9C6E8;
  border-radius: 20px;
  }
  
  fieldset {  
  background: #D3FFE7;
  border-top: 1px solid #DDF0E6;
  border-left: 1px solid #DDF0E6;
  border-right: 1px solid #CBDFD5;
  border-bottom: 1px solid #CBDFD5;
  border-radius: 20px;
  }
  
  fieldset input.text-input, fieldset textarea {
  background: #EEFFF8;
  color: #147042;
  border-top: 1px solid #DDF0E6;
  border-left: 1px solid #DDF0E6;
  border-right: 1px solid #CBDFD5;
  border-bottom: 1px solid #CBDFD5;
  border-radius: 20px;
  }
  
  input#submit, input#increase_form_level, input#delete-submit {
  background: #FFFC41;
  color: #504F0A;
  border-top: 1px solid #B5B30D;
  border-left: 1px solid #B5B30D;
  border-right: 1px solid #B5B30D;
  border-bottom: 1px solid #B5B30D;
  padding: 3px 5px 3px 5px;
  border-radius: 10px;
  box-shadow: inset 0 10px 5px #FFFEB4;
  }
  
  input#submit:active, input#increase_form_level:active, input#delete-submit:active {
  background: #F7E9F2;
  box-shadow: none;
  }  
  
  label.important {
  background: none;
  color: #CAF2A7;
  }
  
  ul, ol {
  background: #EFDAFF;
  border-radius: 20px;
  padding: 5px 5px 5px 35px !important;
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
