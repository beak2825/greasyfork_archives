// ==UserScript==
// @name        Sticke Budde
// @namespace   s4s4s4s4s4s4s4s4s4s
// @include     https://boards.4chan.org/*/thread/*
// @email       doctorworsethanhitler@gmail.com
// @description Adds a sticky buddy to stickied threads on 4chan
// @author      Doctor Worse Than Hitler
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20494/Sticke%20Budde.user.js
// @updateURL https://update.greasyfork.org/scripts/20494/Sticke%20Budde.meta.js
// ==/UserScript==

// returns true iff the thread is a sticky
function isSticky() {
  return (document.getElementsByClassName("stickyIcon").length > 0);
}

// for random ints
function randomInt(min,max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// used to determine which sticke buddy image to use.
var stickyStates = {
    HAPPY : 0,
    SAD : 1,
    COMFY : 2,
    ANGRY: 3
};

// prob a neater way to do this but im lazy so fug it
stickyStates.length = Object.keys(stickyStates).length

//links to stickebudde images
var stickyImages = [
  "https://i.imgur.com/ckZnXu4.gif",
  "https://i.imgur.com/dplRjoS.gif",
  "https://i.imgur.com/8SMoOIY.gif",
  "https://i.imgur.com/1iZ2TWx.gif"
];

var stickyPhrases = [
  // happy
  ["good thread. mods pls sticky.",
  "GOOD STICKY! GREAT STICKY! I'M STICKY FOR STICKY@",
  "This is the best sticky. Post in it and make it better.",
  "I FUGGING LOVE THIS STICKY!",
  ],
  //sad
  ["taking my stickies without any memes or dankess for a week.",
   "this is literally the worst sticky.",
   "kill me. pls.",
   "hello darkness my old friend. when will this bland sticky end?"],
  //comfy
  ["this is nice sticky.",
   "this thread is very comfy.",
   "swaglord sure knows how to pick a sticky",
   "i am in love with this thread"],
  //angry
  ["can u believe they fugging stickied this?",
   "i bet swaglord made this thread and stickied it himself.",
   "i'd rather push sticky pins in my eyes than read this thread",
   "i hate this sticky. mods = figs"]
];

if(isSticky()) {
  var buddy = document.createElement("div");

  // determine phrase/type
  var ran1 = randomInt(0,stickyStates.length);
  var ran2 = randomInt(0,stickyPhrases[ran1].length);

  var img = document.createElement('img');
  img.id='stickeBuddy';
  img.src=stickyImages[ran1];
  img.style.position='fixed';
  img.style.right='0px';
  img.style.bottom='0px';
  img.style.zIndex='1000';

  var bubble = document.createElement('div');
  bubble.id='bubble';
  bubble.style.backgroundColor="#eee";
  bubble.style.borderRadius="6px";
  bubble.style.border="2px solid black"
  bubble.style.position='fixed';
  bubble.style.right='155px';
  bubble.style.bottom='66px';
  bubble.style.zIndex='1000';
  bubble.style.maxWidth="156px";
  bubble.style.padding = "6px"


  bubble.innerHTML += stickyPhrases[ran1][ran2];


  document.body.appendChild(img);
  document.body.appendChild(bubble);
}