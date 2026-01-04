// ==UserScript==
// @name         Thunder Client for Bloxd.io
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  this is cool! Get Custom HealthBar And More!!!
// @author       DragoIce
// @match        https://bloxd.io/
// @icon         https://th.bing.com/th/id/OIP.EjZwhg9eyxvphEiqEPNdRwHaFf?rs=1&pid=ImgDetMain
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484184/Thunder%20Client%20for%20Bloxdio.user.js
// @updateURL https://update.greasyfork.org/scripts/484184/Thunder%20Client%20for%20Bloxdio.meta.js
// ==/UserScript==

setInterval(function() {
    'use strict';

    function name () {
        // document.getElementsByClassName("PlayerNameInfoNameClickable")[0].innerHTML="BloxdMaster_"
    }
    var health1 = document.getElementsByClassName("BottomScreenStatBar");
    health1[0].style.backgroundColor = "rgba(24,29,204,0.6)";
    document.title = "❄️⚡Bloxd.io⚡❄️";
    health1[0].style.boxShadow = "0 0.4px rgb(68,9,125)";
    var health2 = document.getElementsByClassName("BottomScreenStatBarBackground");
    health2[0].style.backgroundColor = "rgba(50,222,244,0.8)";
    var background = document.getElementsByClassName("Background");
    document.title = "Bloxd.io";
    const maintext = document.querySelector('.Title.FullyFancyText');
    background[0].src = "https://th.bing.com/th/id/OIP.7Hq_kCF_t6P0hZtLaJRgPQHaEK?rs=1&pid=ImgDetMain";
    // maintext.style.fontFamily = "Reglisse-Fill, serif";
    // maintext.style.webkitTextStroke = "none";
    document.querySelector('.Title.FullyFancyText').textContent = "Bloxd.io";
    let names = document.getElementsByClassName("AvailableGameText");
    let imgs = document.getElementsByClassName("AvailableGameImg")
    let imgedits = document.getElementsByClassName("AvailableGame");
    (function() {
        'use strict';
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap';
        fontLink.rel = 'stylesheet';

    })

    document.querySelectorAll('.AvailableGame').forEach(item => {
        item.style.border = "none";
    })
    names[0].textContent = "Survival";
    names[0].style.textShadow = "none";
    // imgs[0].src = "https://i.imgur.com/G9bUnQO.png";
    names[1].textContent = "Peaceful";
    names[1].style.textShadow = "none";
    // imgs[1].src = "https://i.imgur.com/xC9jltf.png";
    names[2].textContent = "Creative";
    names[2].style.textShadow = "none";
    // imgs[2].src = "https://i.imgur.com/BQEsCog.png";
    names[3].textContent = "Bedwars Squads";
    names[3].style.textShadow = "none";
    //  imgs[3].src = "https://i.imgur.com/TaF7UmB.png";
    names[4].textContent = "Bedwars Duos";
    names[4].style.textShadow = "none";
    //  imgs[4].src = "https://i.imgur.com/QqM1WwQ.png";
    names[5].textContent = "Skywars";
    names[5].style.textShadow = "none";
    //  imgs[5].src = "https://i.imgur.com/1EvgKmL.png";
    names[6].textContent = "OneBlock";
    names[6].style.textShadow = "none";
    //    imgs[6].src = "https://i.imgur.com/aXstUVN.png";
    names[7].textContent = "GreenVille";
    names[7].style.textShadow = "none";
    //  imgs[7].src = "https://i.imgur.com/YQsbnFc.png";
    names[8].textContent = "Cube Warfare";
    names[8].style.textShadow = "none";
    //  imgs[8].src = "https://i.imgur.com/heFKXJ6.png";
    names[9].textContent = "EvilTower";
    names[9].style.textShadow = "none";
    //  imgs[9].src = "https://i.imgur.com/Gpm1cvW.png";
    names[10].textContent = "DoodleCube";
    names[10].style.textShadow = "none";
    // imgs[10].src = "https://i.imgur.com/hjUAKVI.png";
    names[11].textContent = "BloxdHop";
    names[11].style.textShadow = "none";
    //  imgs[11].src = "https://i.imgur.com/MPRY80l.png";
    names[12].textContent = "Hide & Seek";
    names[12].style.textShadow = "none";
    //  imgs[12].src = "https://i.imgur.com/UXVWqA5.png";
    names[14].textContent = "Plots";
    // imgs[14].src = "https://i.imgur.com/mMwt42i.png";
    names[14].style.textShadow = "none";
    names[16].textContent = "Worlds";
    // imgs[16].src = "https://i.imgur.com/TWCWlyP.png";
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

// Hotbar

(function() {
    'use strict';

    setInterval(function() {
        const hotbarslots = document.querySelectorAll(".item");
        const selectedslot = document.querySelectorAll(".SelectedItem");
        if (hotbarslots) {
            hotbarslots.forEach(function(hotbar) {
                hotbar.style.borderColor = "rgb(0,0,46)";
                hotbar.style.borderRadius = "5px";
                hotbar.style.backgroundColor = "rgb(35,33,112)";
                hotbar.style.outline = "transparent"
            });
        }
        if (selectedslot) {
            selectedslot.forEach(function(slot) {
                slot.style.backgroundColor = "rgb(35,43,150)";
                slot.style.borderColor = "rgb(0,0,46)";
                slot.style.outline = "transparent";
            });
        }
    }, 1);
})();