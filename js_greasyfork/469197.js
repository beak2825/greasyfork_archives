// ==UserScript==
// @name        Tab Autocomplete for AMQ
// @namespace   Violentmonkey Scripts
// @match       https://animemusicquiz.com/
// @grant       none
// @license     MIT
// @version     1.0
// @author      -
// @description 4/18/2022, 10:05:25 PM
// @downloadURL https://update.greasyfork.org/scripts/469197/Tab%20Autocomplete%20for%20AMQ.user.js
// @updateURL https://update.greasyfork.org/scripts/469197/Tab%20Autocomplete%20for%20AMQ.meta.js
// ==/UserScript==
 
let answer_input = document.querySelector("#qpAnswerInput");
let selection = null;
 
function KeyCheck(e) {
  if(e.code === "Tab") {
    if(e.shiftKey) {
      // Go previous
      
      let autocomplete_list = document.querySelectorAll("#qpAnswerInputContainer > div.awesomplete > ul > li");
      
      if(autocomplete_list.length === 0) return;
      
      if(selection != null) {
        autocomplete_list[selection % autocomplete_list.length].style.background = ''
        autocomplete_list[selection % autocomplete_list.length].style.color = ''
      }
      
      if(selection == null || selection == 0) {
        selection = autocomplete_list.length - 1;
      } else {
        selection -= 1;
      }
      
      autocomplete_list[selection % autocomplete_list.length].parentNode.scrollTop = autocomplete_list[selection % autocomplete_list.length].offsetTop
      autocomplete_list[selection % autocomplete_list.length].style.background = 'hsl(200, 40%, 80%)'
      autocomplete_list[selection % autocomplete_list.length].style.color = 'black'
      
      answer_input.value = autocomplete_list[selection % autocomplete_list.length].textContent;
    } else {
      // Go next
      
      let autocomplete_list = document.querySelectorAll("#qpAnswerInputContainer > div.awesomplete > ul > li");
      
      if(autocomplete_list.length === 0) return;
      
      if(selection != null) {
        autocomplete_list[selection % autocomplete_list.length].style.background = ''
        autocomplete_list[selection % autocomplete_list.length].style.color = ''
      }
      
      if(selection == null || selection == autocomplete_list.length - 1) {
        selection = 0;
      } else {
        selection += 1;
      }
      
      autocomplete_list[selection % autocomplete_list.length].parentNode.scrollTop = autocomplete_list[selection % autocomplete_list.length].offsetTop
      autocomplete_list[selection % autocomplete_list.length].style.background = 'hsl(200, 40%, 80%)'
      autocomplete_list[selection % autocomplete_list.length].style.color = 'black'
      
      answer_input.value = autocomplete_list[selection % autocomplete_list.length].textContent;
    }
  }
}
 
window.addEventListener('keydown', KeyCheck, true);
answer_input.addEventListener("input", () => { selection = null } )
