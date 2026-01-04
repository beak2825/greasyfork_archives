// ==UserScript==
// @name         GC - Nerd Link
// @author       dani
// @namespace    https://greasyfork.org/users/748951
// @version      1.0
// @description  Adds a button link to ~Nerd on current neoschool course page
// @match        https://www.grundos.cafe/neoschool/course/
// @downloadURL https://update.greasyfork.org/scripts/486221/GC%20-%20Nerd%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/486221/GC%20-%20Nerd%20Link.meta.js
// ==/UserScript==
    let Button = document.getElementsByClassName('teacher');
    let newButton = document.createElement('div');
    newButton.className = 'newButton';
    Button[0].append(newButton);
    newButton.innerHTML ="<br><a href='https://www.grundos.cafe/~Nerd/'><img src='https://imgur.com/TWb1iRT.gif'></a>"