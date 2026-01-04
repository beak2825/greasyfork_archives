// ==UserScript==
// @name         [ROBLOX] Password To Text
// @namespace    https://wellidontknowwhattoputherellol.com
// @version      1.4
// @description  this will remove the °°°° aka this https://cdn.discordapp.com/attachments/1035588336678604802/1085826633782542336/image.png and it will show your password if you want to login to an other browser without hard time
// @author       TheRealKr4sk
// @match        https://www.roblox.com/login
// @icon         https://i.pinimg.com/originals/eb/06/7b/eb067b4bfbb01e2e73209f45afa42f1a.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461935/%5BROBLOX%5D%20Password%20To%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/461935/%5BROBLOX%5D%20Password%20To%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';
const passwordThing = document.querySelector('input[type="password"]'); // check for password that means it will check if the type is a password
passwordThing.type = 'text'; // if the type is a password it will make it as a text

})();