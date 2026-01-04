// ==UserScript==
// @name               Pedantle pre-solver
// @version            0.09
// @license            LGPLv3
// @description        Pedantle: input common words
// @author             fylb
// @match              https://pedantle.certitudes.org/
// @grant              none
// @namespace https://greasyfork.org/fr/users/67768-fylb
// @icon               https://static.certitudes.org/images/cemantix-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/476891/Pedantle%20pre-solver.user.js
// @updateURL https://update.greasyfork.org/scripts/476891/Pedantle%20pre-solver.meta.js
// ==/UserScript==
  
 
window.addEventListener('load', function() {
let i = document.getElementsByName("searchTerm")[0];
let button = document.getElementById("guess-btn");
  let words = "but where what that which and or so neither not there beacause between he it they by for in of the a other country same than type with without be have may finish say call power century country region north south east west time science gender family france history world more less big little high under over ocean like 1 2 3 4 nom january february march april may june july august september october november december bord dead man politic its his europe asia america european africa this these start begin end after before father son war battle different whole lot find animal small eat green white black species human live some common name previous next to as from but can such know use at".split(' ');
 
  function inputWord(word) {
    console.log("Trying word "+word);
    i.value = word;
    button.click();
  }
 
 
  function wait() {
    if (button.disabled) {
      setTimeout(wait, 20);
    } else {
      unstack();
    }
  }
 
  function unstack() {
    if (words.length != 0) {
      let word = words.pop();
      inputWord(word);
      wait();
    }
  }
  setTimeout(unstack, 500);
}, false);


var script = document.createElement("script");
script.setAttribute('type','text/javascript');
script.text='function Error() { return ["", "", "", "", ""]};';
document.body.appendChild(script);

