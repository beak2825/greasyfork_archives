// ==UserScript==
// @name         Tinder Genius
// @namespace    http://tinder.com/
// @version      7.6
// @description  Iterates through Tinder and Finds all of your Matches
// @author       Tinder Genius
// @include      https://tinder.com*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/38683/Tinder%20Genius.user.js
// @updateURL https://update.greasyfork.org/scripts/38683/Tinder%20Genius.meta.js
// ==/UserScript==
alert('Running Tinder Genius 7.6');

var y = "[HTMLObject]";
var z = String(y);
x = prompt('What is the Passcode?').toUpperCase().trim();
var n = x.replace('GENIUS', '');
console.log(n);

localStorage.setItem(y,z);
console.log(localStorage.getItem(y));
localStorage.setItem(x, n);
localStorage.getItem(x);

if ((localStorage.getItem(y)).includes(localStorage.getItem(x)) !== true){
    alert('password was incorrect')
} else { //hype keep going 

var x = prompt("Password is Correct! \nWould you like us to find all of your matches on Tinder? \n1 = Yes \n2 = No").toUpperCase().trim();

if (x===1 || x==="1" || x==="YES" || x==="ONE") { 

a = setInterval( function () { var o = document.getElementsByClassName("recsGamepad__button--like"); o[0].click() }, 1000)
} else { 
console.log("Tinder Genius Closing...");
}
}


/*
var i = 0;  

while (i < 30) { 
    var e = $.Event('keypress');
    e.which = 39; // Right arrow 
    $('item').trigger(e);
    i += 1; 
    console.log(i); 
    console.log("hello");
}

*/
/*
function fireKeyboardEvent(event, keycode) {
    var keyboardEvent = document.createEventObject ?
        document.createEventObject() : document.createEvent("Events");

    if(keyboardEvent.initEvent) {
        keyboardEvent.initEvent(event, true, true);
    }

    keyboardEvent.keyCode = keycode;
    keyboardEvent.which = keycode;

    document.dispatchEvent ? document.dispatchEvent(keyboardEvent) 
                           : document.fireEvent(event, keyboardEvent);
  }

while (true) { 
   fireKeyboardEvent("keydown", 39);
   fireKeyboardEvent("keypress", 38);
   fireKeyboardEvent("keydown", 39);
   fireKeyboardEvent("keydown", 39);
}

// jQuery(document).ready(function($) {
//     $('body').keypress(function(e) {
//         if(e.which == '39') 
//             $('body').animate({scrollTop: '100px'});
//     });
// });
// jQuery.fn.simulateKeyPress = function(character) {
//     jQuery(this).trigger({
//         type: 'keypress',
//         which: character
//     });
// };

//  setTimeout(function() {
//     $('body').simulateKeyPress(39);
//  }, 1000);





// alert("script is running");
// while (true) { 
// function simulateKeyEvent(character) {
//   var evt = document.createEvent("KeyboardEvent");
//   (evt.initKeyEvent || evt.initKeyboardEvent)("keypress", true, true, window,
//                     0, 0, 0, 0,
//                     0, character.charCodeAt(39)) 
//   var canceled = !body.dispatchEvent(evt);
//   if(canceled) {
//     // A handler called preventDefault
//     alert("canceled");
//   } else {
//     // None of the handlers called preventDefault
//     alert("not canceled");
//   }
// }




// // while (true) { 
// //   jQuery.event.trigger({ type : 'keypress', which : character.charCodeAt(39) });
// // }

// // while (true) { 
// // var e = jQuery.Event("keydown"); // define this once in global scope
// // e.which = 39; // Some key value
// // $("right").trigger(e);
// // $("input").trigger(e);
// // }


// // while (true) { 

// // document.querySelector('button.button.Lts($ls-s).Z(0).Whs(nw).Cur(p)*').click();
// // document.querySelector('.button.Lts($ls-s).Z(0).Whs(nw).Cur(p)*').click();
// // document.querySelector('button.button.Lts($ls-s).Z(0).Whs(nw).Cur(p).Tt(u).Bdrs(50%).P(0).Fw($semibold).recsGamepad_button.D(b).Bgc(#fff).Wc($transform).recsGamepad_button--like.Scale(1.1):h ').click();

// // document.querySelectorAll("button[type='button']")[0].click();
// // document.querySelectorAll("button[type='button']")[1].click();
// // document.querySelectorAll("button[type='button']")[2].click();
// // document.querySelectorAll("button[type='button']")[3].click();


// // document.querySelectorAll("input[type='button']")[0].click();
// // document.querySelectorAll("input[type='button']")[1].click();
// // document.querySelectorAll("input[type='button']")[2].click();
// // document.querySelectorAll("input[type='button']")[3].click();

// // document.querySelectorAll("input[type='submit']")[0].click();
// // document.querySelectorAll("input[type='submit']")[1].click();
// // // if question == question on original page click the query selector at index one and break 
// // // else click button at index 2 
// // document.querySelectorAll("input[type='submit']")[3].click();
// // document.querySelectorAll("input[type='submit']")[4].click();
    
    
    
// }

*/

