// ==UserScript==
// @name         T REX HACKS
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       MIKTHATGUY
// @match        https://elgoog.im/t-rex/
// @grant        idk

// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


  console.log(`%c
 ▄▄▄▄      ▓██   ██▓             ███▄ ▄███▓    ██▓    ██ ▄█▀   ▄▄▄█████▓    ██░ ██     ▄▄▄         ▄▄▄█████▓     ▄████     █    ██    ▓██   ██▓
▓█████▄     ▒██  ██▒            ▓██▒▀█▀ ██▒   ▓██▒    ██▄█▒    ▓  ██▒ ▓▒   ▓██░ ██▒   ▒████▄       ▓  ██▒ ▓▒    ██▒ ▀█▒    ██  ▓██▒    ▒██  ██▒
▒██▒ ▄██     ▒██ ██░            ▓██    ▓██░   ▒██▒   ▓███▄░    ▒ ▓██░ ▒░   ▒██▀▀██░   ▒██  ▀█▄     ▒ ▓██░ ▒░   ▒██░▄▄▄░   ▓██  ▒██░     ▒██ ██░
▒██░█▀       ░ ▐██▓░            ▒██    ▒██    ░██░   ▓██ █▄    ░ ▓██▓ ░    ░▓█ ░██    ░██▄▄▄▄██    ░ ▓██▓ ░    ░▓█  ██▓   ▓▓█  ░██░     ░ ▐██▓░
░▓█  ▀█▓     ░ ██▒▓░            ▒██▒   ░██▒   ░██░   ▒██▒ █▄     ▒██▒ ░    ░▓█▒░██▓    ▓█   ▓██▒     ▒██▒ ░    ░▒▓███▀▒   ▒▒█████▓      ░ ██▒▓░
░▒▓███▀▒      ██▒▒▒             ░ ▒░   ░  ░   ░▓     ▒ ▒▒ ▓▒     ▒ ░░       ▒ ░░▒░▒    ▒▒   ▓▒█░     ▒ ░░       ░▒   ▒    ░▒▓▒ ▒ ▒       ██▒▒▒
▒░▒   ░     ▓██ ░▒░             ░  ░      ░    ▒ ░   ░ ░▒ ▒░       ░        ▒ ░▒░ ░     ▒   ▒▒ ░       ░         ░   ░    ░░▒░ ░ ░     ▓██ ░▒░
 ░    ░     ▒ ▒ ░░              ░      ░       ▒ ░   ░ ░░ ░      ░          ░  ░░ ░     ░   ▒        ░         ░ ░   ░     ░░░ ░ ░     ▒ ▒ ░░
 ░          ░ ░                        ░       ░     ░  ░                   ░  ░  ░         ░  ░                     ░       ░         ░ ░
      ░     ░ ░                                                                                                                        ░ ░     `, 'color: red; font-size: 10px;');
  console.log(`%c

  ▄████   ▄████
 ██▒ ▀█▒ ██▒ ▀█▒
▒██░▄▄▄░▒██░▄▄▄░
░▓█  ██▓░▓█  ██▓
░▒▓███▀▒░▒▓███▀▒
 ░▒   ▒  ░▒   ▒
  ░   ░   ░   ░
░ ░   ░ ░ ░   ░
      ░       ░


`, 'color: red; font-size: 10px;');
  var ded = prompt("speed","how much?")
  console.log("speed set to " + ded);
  Runner.instance_.gameOver = function(){};
  Runner.instance_.setSpeed(ded);


})();