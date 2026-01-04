// ==UserScript==
// @name         ChatGPT+ Filters
// @namespace    ChatGPTAgree
// @version      1
// @description  Adds the new ChatGPT+ mini floating toggle helper menu for non-ChatGPT+ users to get better and clearer answers.
// @author       hacker09
// @match        https://chat.openai.com/chat*
// @icon         https://chat.openai.com/favicon-32x32.png
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482177/ChatGPT%2B%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/482177/ChatGPT%2B%20Filters.meta.js
// ==/UserScript==

 (function() {
  'use strict';
  //https://twitter.com/rowancheung/status/1641122918011748380

  https://codepen.io/alvarotrigo/pen/vYRVbzK

  document.querySelectorAll("form")[0][1].click() // send on chatgpt
/*
  <ul>
      <label for="collapse"></label>
      <li>Pls Continue</li>
      <li>Clarify</li>
      <li>Exemplify</li>
      <li>Expand</li>
      <li>Explain</li>
      <li>Rewrite</li>
      <li>Shorten</li>
 </ul>
*/


`ul{
  //padding:0;
  width:103px;
  box-shadow:0 0 3px black,
             0 0 0 5px black;
  border-radius:5px;
}
ul li{
  height:20px;
  background: black;
  padding:5px;
  color:white;
}
ul li:hover{
  background: grey;
}
label:before{
  background:grey;
  content:"K";
}
label{
  display:absolute;
  background:grey;
  color:white;
  cursor:pointer;
}`

})(); 