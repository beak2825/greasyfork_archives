// ==UserScript==
// @name         Beginner Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Small script for begginers
// @author       qwd
// @match        https://agarpowers.xyz/
// @icon         https://www.shutterstock.com/shutterstock/photos/426657190/display_1500/stock-vector-beginner-stamp-426657190.jpg
// @grant        none
// @license      qwd
// @downloadURL https://update.greasyfork.org/scripts/474410/Beginner%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/474410/Beginner%20Script.meta.js
// ==/UserScript==

function beginner() {
    var panel = document.getElementById("main-panel");
    var overlay = document.getElementById("overlays");
    const infoIcon = document.createElement('span');
    infoIcon.className = 'info-icon';
    infoIcon.textContent = 'ℹ️';
    panel.appendChild(infoIcon);
    infoIcon.style.color="white"; infoIcon.style.fontSize="25px"; infoIcon.style.border="2px solid white"; infoIcon.style.borderRadius="100px"; infoIcon.style.padding="5px";
    let pageCount = 1;
    // Infobox
    var box = document.createElement("div");
    box.style.border="2px solid white"; box.style.borderRadius="7px"; box.style.width="300px"; box.style.height="auto"; box.style.marginLeft="40%"; box.style.zIndex="+202";
    box.style.position="absolute"; box.style.backgroundColor="black"; box.style.color="white";
    var exit = document.createElement("div");
    exit.innerHTML = "Exit";
    exit.style.color="red"; exit.style.fontSize="10px"; exit.style.fontWeight="600"; exit.style.float="right"; exit.style.margin="15px"; exit.style.cursor="pointer";

    box.appendChild(exit);
    var headline = document.createElement("div"); headline.style.fontWeight="900"; headline.style.fontSize="20px"; headline.style.color="white"; headline.innerHTML="Information:";
    box.appendChild(headline);

    var Infotext1 = document.createElement("p"); Infotext1.style.color="white"; Infotext1.style.padding="10px";
    Infotext1.innerHTML = `
    Power Introduction:<br><br>
    - Use pellets to gain mass<br>
    - Use virus to make the enemy explode<br>
    - Use merge to become 1 Cell<br>
    - Use speed to become faster<br>
    - Use antifreeze to become immune to frost<br>
    - Use antimerge to stop the opponent from merging<br>
    - Use shield to become immune to viruses<br>
    - Use portal to destroy opponent shield and teleport random on map<br>
    - Use push to push the enemies away (Select your Cell)<br>
    - Use freeze-virus to throw a frost-virus at the enemy<br>
    - Use block to get some coins
    `;

    var Infotext2 = document.createElement("p"); Infotext2.style.color="white"; Infotext2.style.padding="10px"; Infotext2.style.display="none";
    Infotext2.innerHTML = `
    Common Powerup Combinations:<br><br>
    - Virus + Antimerge<br>
    - Freeze-Virus + Antimerge<br>
    - Portal + Virus<br>
    - Portal + Virus + Antimerge<br>
    - Push + Pellets<br><br>

    Server:<br><br>
    - Instant: <br>
    + Max Cells 64<br>
    + Mana: 200 (300 maxed Mana)<br>
    + Fast XP Gaining<br>
    + Room 1 (r1) <br>
    + Room 2 (r2) = Get a lot of Coins <br><br>

    - Classic: <br>
    + Max Cells 64 <br>
    + Mana: 300 (400 maxed Mana)<br>
    + Fast coin collecting<br>
    + Mana used up faster
    `;
    var Infotext3 = document.createElement('p');Infotext3.style.color="white"; Infotext3.style.padding="10px"; Infotext3.style.display="none";
    Infotext3.innerHTML = `
    How to get to room 2?<br><br>
    - Wait until an almost indestructible portal appears in room 1<br>
    - Place coin blocks (Block) on the portal<br>
    - Now feed the blocks (Selffeed or use push powerup)<br>
    - Do this until the portal sucks in everything around it and turns golden<br>
    - Go in now (It will despawn in like 10 seconds)<br>
    - If you arrived room 2 you have to feed the golden virus and it will drop coins<br>
    - When the golden virus sucks you in you have to spam push powerup to get more coins
    `;
    var nextBtn = document.createElement("button");
    nextBtn.innerHTML='Next'; nextBtn.style.border="2px solid lime"; nextBtn.style.backgroundColor="black"; nextBtn.style.color="lime"; nextBtn.style.marginLeft="10%"; nextBtn.style.cursor="pointer";
    var backBtn = document.createElement("button");
    backBtn.innerHTML='Back'; backBtn.style.border="2px solid red"; backBtn.style.backgroundColor="black"; backBtn.style.color="red"; backBtn.style.marginLeft="10%"; backBtn.style.cursor="pointer";
    nextBtn.addEventListener('click', function() {
        pageCount++;
        if (pageCount === 1) {Infotext2.style.display="none"; Infotext3.style.display="none"; Infotext1.style.display="block";}
        if (pageCount === 2) {Infotext1.style.display="none"; Infotext3.style.display="none"; Infotext2.style.display="block";}
        if (pageCount === 3) {Infotext1.style.display="none"; Infotext2.style.display="none"; Infotext3.style.display="block";}
    });
    backBtn.addEventListener('click', function () {
        pageCount--;
        if (pageCount === 1) {Infotext2.style.display="none"; Infotext3.style.display="none"; Infotext1.style.display="block";}
        if (pageCount === 2) {Infotext1.style.display="none"; Infotext3.style.display="none"; Infotext2.style.display="block";}
        if (pageCount === 3) {Infotext1.style.display="none"; Infotext2.style.display="none"; Infotext3.style.display="block";}
    });
    exit.addEventListener('click', function () {box.style.display="none"; pageCount = 1});
    // Listener
    infoIcon.addEventListener('click', function () {
        box.style.display="block";
        pageCount = 1;
    });
    box.style.display="none";
    box.appendChild(Infotext1);
    box.appendChild(Infotext2);
    box.appendChild(Infotext3);
    box.appendChild(backBtn);
    box.appendChild(nextBtn);
    overlay.appendChild(box);
}
setTimeout(beginner, 200);