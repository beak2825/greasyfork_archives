// ==UserScript==
// @name         Insane Scripts (FLOWGAME UI EDITED)
// @namespace    https://discord.gg/rhUS8XANQJ
// @version      4
// @description  Created by Firetruck and Net Grabber/Arimas
// @author       Created by Firetruck and Net Grabber/Arimas
// @match        http://flowgame.io/
// @match        www.flowgame.io
// @match        http://flowy.gg/
// @match        wwww.flowy.gg
// @match        https://flowy.gg/
// @match        http://62.68.75.115:90/
// @icon         https://media.discordapp.net/attachments/962045593214156800/962069515112443904/FLOWKING.png
// @license      N/A
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488833/Insane%20Scripts%20%28FLOWGAME%20UI%20EDITED%29.user.js
// @updateURL https://update.greasyfork.org/scripts/488833/Insane%20Scripts%20%28FLOWGAME%20UI%20EDITED%29.meta.js
// ==/UserScript==


Swal.fire(
  'Version 4\n',
  'Added commands say /help to see the commands\n\n customizable UI check the code to change up the ui color ',
  'success'
);

// thanks for FireTruck helping with this peice of code down below

// in here just insert the color codes that you want , for each element use https://htmlcolorcodes.com to help you

var accbackgroundcolor = 'yellow' // this is the background behind your user
var accnamecolor = 'black' // color of the text for your account
var accborder = '#bdbd00' // the border of the background for your account name

var leaderboardwordscolor = '#fff' // the color of the text on the leaderboard
var leaderboardbordercolor = '#AAFF00' // the border color of the leaderboard its currently set as green
var leaderboardbackground = 'black' // background of the leader board

var minimapbackground = 'black' // minimap background color
var minimapbordercolor = '#AAFF00' // minimap map border color

// the message bar is located at the top of the screen
var messagebarwordscolor = '#000' // message bar color of the text
var messagebarbordercolor = 'white' // border color of the message bar
var messagebarbackground = '#AAFF00' // background color of the message bar

var buttonbordercolor = '#AAFF00' // all the buttons in the game borde color
var buttonwordscolor = '#FFD700' // all the buttons in the game text color

var buttonhoverbackgroundcolor = '#AAFF00' // when you hover your mouse on a button it will the show the buttton color you put down there
var buttonhoverwordscolor = 'black' // when you hover your mouse on a button it will show the text color you put down there

var rightmenuborder = '#333333' // the menu border color
var rightmenubackground = '#212121' // the menu background color

var leftmenuborder = '#333333' // the menu border color
var leftmenubackground = '#212121' // the menu background color

var bottommenuborder = '#333333' // the menu border color
var bottommenubackground = '#212121' // the menu background color

var statstextcolor = 'white' // the text color of the stats
var statsbackgroundcolor = 'black' // background color of the stats
var statsbordercolor = '#AAFF00' // border color of the stats

const textselectionwordscolor = 'black' // text color of when you highlight a piece of text
const textselectionbackgroundcolor = '#AAFF00' // background color of the highlight

// end of css pick

var styles = `

@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap');


body {
 font-family: 'Ubuntu', sans-serif;
 }

#leaderboard {
    transform-origin: right top;
    position: fixed;
    right: 1rem;
    top: 1rem;
    width: 13rem;
    padding: 1rem;
    color: ${leaderboardwordscolor};
    border-radius: 0.3rem;
    background-color: ${leaderboardbackground};
    border: 2px solid ${leaderboardbordercolor};
}

#mini-map {
    transform-origin: right bottom;
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    border: 2px solid ${minimapbordercolor};
    background: ${minimapbackground};
    border-radius: 0.3rem;
}


::selection {
  color: ${textselectionwordscolor};
  background: ${textselectionbackgroundcolor};
  border-radius: 2px;
}

#statistics span {
 color: ${statstextcolor};
 border: 2px solid ${statsbordercolor};
 background: ${statsbackgroundcolor};
}

#top-message-bar {
    display: inline-block;
    padding: 0.5rem 1.5rem;
    background-color: ${messagebarbackground};
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
    border: 2px solid ${messagebarbordercolor};
    color: ${messagebarwordscolor};
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
    cursor: pointer;
    user-select: none;
    pointer-events: initial;
}


#menu #discord-banner img {
 border-radius: 7px;
}

#menu #account-name {
    background-color: ${accbackgroundcolor};
    border-radius: 3px;
    border: 4px solid ${accborder};
    color: ${accnamecolor};
  }

#menu .mid-right {
  border: 2.5px solid ${rightmenuborder};
  background: ${rightmenubackground};
  border-radius: 7px;
 }

 #menu .mid-left {
  border: 2.5px solid ${leftmenuborder};
  background: ${leftmenubackground};
  border-radius: 7px;
}

   .menu-container {
    border: 2.5px solid ${bottommenuborder};
    background: ${bottommenubackground};
    border-radius: 7px;
}

#swal2-title {
 font-size: 16px;
}




.button {
    transition: all .10s ease-in-out;
    border: 1px solid ${buttonbordercolor};
    border-radius: 3px;
    padding: 0.5rem 1rem;
    box-shadow: 0 0.25rem 1rem rgb(55 255 45 / 20%);
    text-transform: uppercase;
    color: ${buttonwordscolor};
    -webkit-transition-duration: .3s;
    transition-duration: .3s;

}

.button:hover {
  background: ${buttonhoverbackgroundcolor};
  color: ${buttonhoverwordscolor};
}

#menu .cell-preview .body {
 transition: all .5s ease-in-out;
 border: 2px solid grey;

}

#menu .cell-preview .body:hover {
 border: 2px solid #000;

}




`;
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
var styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
window.addEventListener('chatCommand', function (event) {
    if (event.command === '/help') {
        swal.fire('COMMANDS \n\n /iq (shows your iq) \n /bank (money in your bank) \n /debt (how much debt you are in) \n /hack (hack a user ) \n /nitro (A nitro code samira samira gifted you )\n /freecoins (check if you won!) \n /date (the proper date) \n /update check for a update');
        event.preventDefault();
    }
});

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

let playeriq =  Math.floor(Math.random() * 101); // iq command

  window.addEventListener('chatCommand', function (event) {
    if (event.command === '/iq') {
        swal.fire(`You have a iq of : ${playeriq} (refresh to check your iq again) `);
        event.preventDefault();
    }
});

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

let money =  Math.floor(Math.random() * 1000000000000001); // money in bank

  window.addEventListener('chatCommand', function (event) {
    if (event.command === '/bank') {
        swal.fire(`you have  ${money}$  in your bank account do /debt to check if your in debt `);
        event.preventDefault();
    }
});

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

let debt =  Math.floor(Math.random() * 5462); // money in bank

  window.addEventListener('chatCommand', function (event) {
    if (event.command === '/debt') {
        swal.fire(`you're  ${debt}$ in debt sad :( (pay it off before you go to prison)`);
        event.preventDefault();
    }
});
// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
let password =  Math.floor(Math.random() * 7632888);

window.addEventListener('chatCommand', function (event) {
    if (event.command === '/hack') {
        let user = prompt("Enter the user you want to hack ");
         if(user!=null) {
          swal.fire(`Completed hack, ${user}'s password is ${password} GG :D`)
          }
        event.preventDefault();
    }
});

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
let discordCode = Math.random().toString(36).substr(2, 8);

  window.addEventListener('chatCommand', function (event) {
    if (event.command === '/nitro') {
        swal.fire(`:O here's your nitro code samira told to give you : discord.gift/${discordCode} quickly claim it before it expires `);
        event.preventDefault();
    }
});

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

let visitor =  Math.floor(Math.random() * 3462); // money in bank

  window.addEventListener('chatCommand', function (event) {
    if (event.command === '/freecoins') {
        swal.fire(`You're the number ${visitor} person to visit this website and won 100 million coins watch this video by samira on how to claim it! https://www.youtube.com/watch?v=xvFZjo5PgG0`);
        event.preventDefault();
    }
});

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

let today = new Date();
let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();


  window.addEventListener('chatCommand', function (event) {
    if (event.command === '/date') {
        swal.fire(` it's ${today}, and the short date is: ${date} `);
        event.preventDefault();
    }
});

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
 let message = "Next update will be commands that are like mircale script like /solo but they will be in the chat not a notifaction :) ( 40% sure )"

window.addEventListener('chatCommand', function (event) {
    if (event.command === '/check') {
        swal.fire(`${message}`);
        event.preventDefault();
    }
});

// -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//
