// ==UserScript==
// @name         Swift Client for bloxd.io ( updated )
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Arthur ( the nerd who is the head dev of the game ) has disabled all user scripts and extentions because people were using it to hack other people's accounts and i got a few script dms on discord too ( it mostly happens via discord ) so if you use this you're going to get a 24 hour ban
// @author       Swift,Blueify and two other nerds
// @match        https://bloxd.io/
// @icon         https://cdn.discordapp.com/icons/1164634915330072609/6918102e1281bfeb58b66687c2520ab0.webp?size=240
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481996/Swift%20Client%20for%20bloxdio%20%28%20updated%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/481996/Swift%20Client%20for%20bloxdio%20%28%20updated%20%29.meta.js
// ==/UserScript==

setInterval(function() {
    'use strict';
    document.title = "Swift Client";
    const maintext = document.querySelector('.Title.FullyFancyText');
    maintext.style.fontFamily = "Reglisse-Fill, serif";
        maintext.style.textShadow = "none";
    maintext.style.webkitTextStroke = "none";

        document.querySelector('.Title.FullyFancyText').textContent = "Swift Client";
    let background = document.getElementsByClassName("Background");
    background[0].src = "https://i.imgur.com/Vg1T5ap.png";
    let names = document.getElementsByClassName("AvailableGameText");
    let imgs = document.getElementsByClassName("AvailableGameImg")
    let imgedits = document.getElementsByClassName("AvailableGame");
(function() {
    'use strict';
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap';
    fontLink.rel = 'stylesheet';

})

// Crosshair
    setInterval(function() {
    const crosshair = document.querySelector(".CrossHair");
    if (crosshair) {
        crosshair.textContent = "⨀";
        crosshair.style.width = "30px";
        crosshair.style.height = "30px";
    }
}, 1000);

document.querySelectorAll('.AvailableGame').forEach(item => {
    item.style.border = "none";
})


    names[0].textContent = "Survival";
    names[0].style.textShadow = "none";
    imgs[0].src = "https://i.imgur.com/G9bUnQO.png";
    names[1].textContent = "Peaceful";
    names[1].style.textShadow = "none";
    imgs[1].src = "https://i.imgur.com/xC9jltf.png";
    names[2].textContent = "Creative";
    names[2].style.textShadow = "none";
    imgs[2].src = "https://i.imgur.com/BQEsCog.png";
    names[3].textContent = "Bedwars Squads";
    names[3].style.textShadow = "none";
    imgs[3].src = "https://i.imgur.com/TaF7UmB.png";
    names[4].textContent = "Bedwars Duos";
    names[4].style.textShadow = "none";
    imgs[4].src = "https://i.imgur.com/QqM1WwQ.png";
    names[5].textContent = "Skywars";
    names[5].style.textShadow = "none";
    imgs[5].src = "https://i.imgur.com/1EvgKmL.png";
    names[6].textContent = "Oneblock";
    names[6].style.textShadow = "none";
    imgs[6].src = "https://i.imgur.com/aXstUVN.png";
    names[7].textContent = "greenville";
    names[7].style.textShadow = "none";
    imgs[7].src = "https://i.imgur.com/YQsbnFc.png";
    names[8].textContent = "Lego Fortnite";
    names[8].style.textShadow = "none";
    imgs[8].src = "https://i.imgur.com/heFKXJ6.png";
    names[9].textContent = "Eviltower";
    names[9].style.textShadow = "none";
    imgs[9].src = "https://i.imgur.com/Gpm1cvW.png";
    names[10].textContent = "Doodlecube";
    names[10].style.textShadow = "none";
    imgs[10].src = "https://i.imgur.com/hjUAKVI.png";
    names[11].textContent = "BloxdHop";
    names[11].style.textShadow = "none";
    imgs[11].src = "https://i.imgur.com/MPRY80l.png";
    names[12].textContent = "Hide & Seek";
    names[12].style.textShadow = "none";
    imgs[12].src = "https://i.imgur.com/UXVWqA5.png";
    names[14].textContent = "Plots(superflat)";
    imgs[14].src = "https://i.imgur.com/mMwt42i.png";
    names[14].style.textShadow = "none";
    names[16].textContent = "Worlds";
    imgs[16].src = "https://i.imgur.com/TWCWlyP.png";
    names[16].style.textShadow = "none";

        imgedits[0].style.border = "none";
imgedits[0].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[1].style.border = "none";
    imgedits[1].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[2].style.border = "none";
    imgedits[2].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[3].style.border = "none";
    imgedits[3].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[4].style.border = "none";
    imgedits[4].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[5].style.border = "none";
    imgedits[5].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[6].style.border = "none";
    imgedits[6].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[7].style.border = "none";
    imgedits[7].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[8].style.border = "none";
    imgedits[8].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[9].style.border = "none";
    imgedits[9].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[10].style.border = "none";
    imgedits[10].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[11].style.border = "none";
    imgedits[11].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[12].style.border = "none";
    imgedits[12].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[13].style.border = "none";
    imgedits[13].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
       imgedits[14].style.border = "none";
    imgedits[14].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
           imgedits[15].style.border = "none";
    imgedits[15].style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";

},100);

//Ad Blocker
document.getElementsByClassName('partnersAndCredits SmallTextLight')[0].remove();
document.getElementsByClassName('SmallTextLight')[0].remove();
document.getElementsByClassName('AdContainer')[0].remove();

(function() {
    'use strict';
    const fontLink = document.createElement('link');
    fontLink.href = 'https://db.onlinewebfonts.com/c/68c9057f4e4dc415b2648f88526aeea7?family=Reglisse-Fill';
    fontLink.rel = 'stylesheet';

    const text = document.createElement('div');
    text.style.position = "fixed";
    text.style.color = "#fff";
    text.textContent = "Swift Network";
    text.style.top = "85%";
    text.style.left = "50%";;
    text.style.zIndex = "10000";
    text.style.fontWeight = "bold";
    text.style.borderRadius = "25px";
    text.style.fontSize = "18px";
    text.style.height = "6vh";
    text.style.display = "flex";
    text.style.paddingTop = "0.1rem";
    text.style.justifyContent = "center";
    text.style.width = "10vw";
    text.style.height = "5vh";
    text.style.transform = "translateX(-50%)";
    text.style.textAlign = "center";
    text.style.lineHeight = "50px";
    text.onclick = "opener()"
text.style.boxShadow = "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px";
text.style.backgroundColor = "rgba(0,0,0,.4";
text.style.cursor = "pointer";

    document.head.appendChild(fontLink);
    document.body.appendChild(text);
})();

// Hotbar
(function() {
    'use strict';

    setInterval(function() {
        const hotbarslots = document.querySelectorAll(".item");
        const selectedslot = document.querySelectorAll(".SelectedItem");
        if (hotbarslots) {
            hotbarslots.forEach(function(hotbar) {
                hotbar.style.borderRadius = "8px";
                hotbar.style.borderColor = "#303a5900";
                hotbar.style.backgroundColor = "#D13D2E";
                hotbar.style.boxShadow = "inset -2px -2px 10px 0px rgb(133, 0, 0), inset 0.3px 0.3px 5px 0px rgb(255, 255, 255)"
                hotbar.style.outline = "transparent"
            });
        }
        if (selectedslot) {
            selectedslot.forEach(function(slot) {
                slot.style.backgroundColor = "#c9991c";
                slot.style.boxShadow = "inset -2px -2px 10px 0px rgb(210, 183, 45), inset 0.3px 0.3px 5px 0px rgb(255, 255, 255)";
                slot.style.borderColor = "#b88c1a";
                slot.style.outline = "transparent";
            });
        }
    }, 1);
})();