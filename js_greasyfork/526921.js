// ==UserScript==
// @name         I Love You
// @namespace    es.jessjon.valentines2025
// @version      2025-02-18.2
// @description  I love Ivy Lane
// @author       Jessica Jones
// @match        https://www.kittycats.ws/*
// @match        https://kittycats.ws/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kittycats.ws
// @grant        GM_addStyle
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/526921/I%20Love%20You.user.js
// @updateURL https://update.greasyfork.org/scripts/526921/I%20Love%20You.meta.js
// ==/UserScript==

var en = true;

GM_addStyle(".heart { position:absolute; width:60px; height:60px; background-color:red; clip-path:path('M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'); opacity:1.0; animation:fadeOut 1s forwards; }");

GM_addStyle(".text1, .text2 { position:absolute; width:300px; height:30px; font-family:verdana,tahoma,arial; font-size:20px; animation:fadeOut 2s forwards; }");

GM_addStyle(".text1 { color:magenta; }");
GM_addStyle(".text2 { color: red; }");

GM_addStyle("@keyframes fadeOut { to { opacity:0; transform:translateY(-50px) scale(0); } }");

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function hearts(e) {
  if (!en) return;
  en = false;
  const heart = document.createElement('div');
  heart.style.left = (e.clientX - 10) + 'px';
  heart.style.top = (e.clientY - 10) + 'px';
  if (randomInt(0,100) > 90) {
      heart.style.backgroundColor = 'none';
      var pick = randomInt(0,2);
      switch(pick) {
          case 0:
              heart.classList.add('text1');
              heart.innerText = '❤ Jessica loves Ivy ❤';
              break;
          case 1:
              //heart.classList.add('text2');
              heart.innerText = '💜 Happy Valentine\'s Day 💜';
              //break;
          case 2:
              heart.classList.add('text2');
              heart.innerText = 'You are my person';
              break;
      }
  } else {
    var r = randomInt(192, 255);
    var g = randomInt(0, 64);
    var b = randomInt(0, 128);
    var scale = randomInt(100,300) / 100;
    var rot = randomInt(-30,30);
    heart.classList.add('heart');
    heart.style.backgroundColor = "rgb("+r+","+g+","+b+")";
    heart.style.transform = "scale("+scale+") rotate("+rot+"deg)";
  }
  document.body.appendChild(heart);
  setTimeout(function() { en = true; }, 50)

  // Remove heart after animation
  heart.addEventListener('animationend', function() {
    heart.remove();
  });
}

document.addEventListener('mousemove', hearts);

setTimeout(function() {
    document.removeEventListener('mousemove', hearts);
}, 5000);
