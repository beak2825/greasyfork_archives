// ==UserScript==
// @name         Harem / Hentai Heroes automatic Harem money
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  AutoSalary in the harem for hentaiheroes.com and haremheroes.com (not test yet on haremheroes.com) give me some feedback !
// @author       Feitan
// @match        https://www.hentaiheroes.com/harem.html
// @grant        none
// @include      https://nutaku.haremheroes.com/harem.html

// This script will automatically recolt salary from your girls when you enter in your harem
// This script is very light, the goal is reassure the users about there privacy, this script can be understand by everybody because there are only 3
// Lines of code.

// Note that the script will only work on secure connexion (httpS), it can be change by removing the s or change it by * example :
// KEEP IN MIND THAT I WOULD NOT RECOMMAND YOU TO CHANGE THE SECURITY OF THE CONNEXION
// https://www.hentaiheroes.com/harem.html ==> http*://www.hentaiheroes.com/harem.html at line 7 or
// https://nutaku.haremheroes.com/harem.html ==> http*://nutaku.haremheroes.com/harem.html at line 9

// The script tested only on Chrome with Tampermonkey, give me your feedback if you use Firefox and Greasemonkey or other combinations !
// Support can be done both in french and english

// @downloadURL https://update.greasyfork.org/scripts/38433/Harem%20%20Hentai%20Heroes%20automatic%20Harem%20money.user.js
// @updateURL https://update.greasyfork.org/scripts/38433/Harem%20%20Hentai%20Heroes%20automatic%20Harem%20money.meta.js
// ==/UserScript==
(function() {
    'use strict';

var buttons = document.getElementsByClassName('blue_text_button');

  for(var i = 0; i <= buttons.length; i++)
        buttons[i].click();


})();