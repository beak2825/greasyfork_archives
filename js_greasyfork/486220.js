
// ==UserScript==
// @name         GC - Quick Garden Link
// @author       dani
// @namespace    https://greasyfork.org/users/748951
// @version      1.0
// @description  make gardening easier by adding emojis for each directly above the pick button 
// @match        https://www.grundos.cafe/guilds/guild/*


// @downloadURL https://update.greasyfork.org/scripts/486220/GC%20-%20Quick%20Garden%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/486220/GC%20-%20Quick%20Garden%20Link.meta.js
// ==/UserScript==
    let Button = document.getElementsByClassName('center');
    let newButton = document.createElement('div');
    newButton.className = 'newButton';
    Button[0].append(newButton);
    newButton.innerHTML ="<center><br>" +
        "<a href='https://www.grundos.cafe/guilds/guild/7ccdd6c8-164c-4159-9821-280070f6263c/garden/'>🐺</a>" +
        "<a href='https://www.grundos.cafe/guilds/guild/0ef63bc1-065b-4cb9-84ee-7e6f39ea3da5/garden/'>🍓</a>" +
        "<a href='https://www.grundos.cafe/guilds/guild/c8a4fd80-a8f0-4af2-a285-30817f4dc5d5/garden/'>🍃</a>" +
        "<a href='https://www.grundos.cafe/guilds/guild/8942ee6b-b823-46e6-b845-51647a2bcf87/garden/'><img src='https://i.imgur.com/mWMI1e1.png' height='16px'></a>" +
        "<a href='https://www.grundos.cafe/guilds/guild/383b713d-cfe6-4086-b54a-89f596cbe9c9/garden/'>✨</a>" +
        "<a href='https://www.grundos.cafe/guilds/guild/919e74f2-f58b-4bcd-8b6b-7a2e15169f24/garden/'>☕</a>"
