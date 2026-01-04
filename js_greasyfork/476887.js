// ==UserScript==
// @name               Pedantix pre-solver
// @version            0.10
// @license            LGPLv3
// @description        Pedantix: input common words
// @author             fylb
// @match              https://pedantix.certitudes.org/
// @grant              none
// @namespace https://greasyfork.org/fr/users/67768-fylb
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @icon               https://static.certitudes.org/images/cemantix-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/476887/Pedantix%20pre-solver.user.js
// @updateURL https://update.greasyfork.org/scripts/476887/Pedantix%20pre-solver.meta.js
// ==/UserScript==


window.addEventListener('load', function() {
let i = document.getElementsByName("searchTerm")[0];
let button = document.getElementById("guess-btn");
let words = "dont entre par lui tout autre type où même le la les du de des d un une à aux au mais ou et donc or ni car pour en dans sans qui que qu ainsi aussi être avoir faire dire appeler pouvoir siècle pas ne ni pays région nord sud ouest siècle temps science genre espèce famille france histoire monde plus moins grand petit haut bas sur sous océan avec comme 1 2 3 4 nom janvier février mars avril mai juin juillet août septembre octobre novembre décembre né mort homme femme politique sa son se europe asie amérique européen américain afrique ce cet cela il elle début fin plusieurs après avant père fils guerre bataille".split(' ');

function inputWord(word) {
  console.log("Trying word "+word);
  i.value = word;
  $("#guess-btn").click();
}


function wait() {
  if (button.disabled) {
    setTimeout(wait, 10);
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

