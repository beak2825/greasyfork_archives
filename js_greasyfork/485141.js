// ==UserScript==
// @name         Brune RemodV3 BETA
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  CUSTOM HEALTH, ANIMATED hotbar, ANIMATED skybox, ANIMATED cursur, ANIMATED chat box and more soon to COME!
// @author       Brune, ChatGPT, Blueify and NexusClient
// @match        https://bloxd.io/
// @icon         https://i.imgur.com/xXCBWbO.png
// @grant        GM_addStyle
// @liecense     Assassinated if Used without perms
// @downloadURL https://update.greasyfork.org/scripts/485141/Brune%20RemodV3%20BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/485141/Brune%20RemodV3%20BETA.meta.js
// ==/UserScript==
//@Liecense = "https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1"
//Brune Bloxd.io Remodification © 2023 by BruneGaming is licensed under CC BY-NC-SA 4.0

// Draggable Keystrokes (partly Blueify Code)
(function() {
    'use strict';

    let keystrokescontainer;
    keystrokescontainer = document.createElement("div");
    keystrokescontainer.style.zIndex = "10000";
    keystrokescontainer.style.width = "300px";
    keystrokescontainer.style.height = "170px";
    keystrokescontainer.style.transform = "translate(-50%, -50%)";
    keystrokescontainer.style.backgroundColor = "transparent"; // Remove the black background
    keystrokescontainer.style.top = "50%";
    keystrokescontainer.style.position = "fixed";
    keystrokescontainer.style.left = "50%";
    keystrokescontainer.style.opacity = "70%";
    document.body.appendChild(keystrokescontainer);

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    keystrokescontainer.addEventListener('mousedown', function(event) {
        if (event.target.nodeName !== 'INPUT') {
            isDragging = true;
            offsetX = event.clientX;
            offsetY = event.clientY;
        }
    });

    document.addEventListener('mousemove', function(event) {
        if (isDragging) {
            const left = event.clientX;
            const top = event.clientY;

            keystrokescontainer.style.left = left + "px";
            keystrokescontainer.style.top = top + "px";
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });




    // Function to create a keystroke element with common styles (this is me and ChatGPT!)
    function createKeystrokeElement(text, top, left, width, height) {
        let keystroke = document.createElement('div');
        keystroke.style.position = "fixed";
        keystroke.style.color = "#ffffff";
        keystroke.textContent = text;
        keystroke.style.top = top;
        keystroke.style.left = left;
        keystroke.style.transform = "translate(-50%, -50%)"; // Same thing as center
        keystroke.style.zIndex = "10000";
        keystroke.style.fontWeight = "bold";
        keystroke.style.borderRadius = "10px";
        keystroke.style.backgroundColor = "#66ccff";
        keystroke.style.fontSize = "20px";    // How big the Keystroke Letters are. Change the number for the size.
        keystroke.style.height = height;
        keystroke.style.width = width;
        keystroke.style.textAlign = "center";   // This centres it when it starts and then u can drag to ur place
        keystroke.style.lineHeight = height;

        return keystroke;
    }

    let wkey = createKeystrokeElement("W", "5px", "50%", "50px", "50px");   // W = Text inside the Keystroke, 5px = the hight it is from the vertical centre line, 50% is middle of page, 50px, 50px are length and width
    let skey = createKeystrokeElement("S", "60px", "50%", "50px", "50px");
    let akey = createKeystrokeElement("A", "60px", "31.5%", "50px", "50px");
    let dkey = createKeystrokeElement("D", "60px", "68.5%", "50px", "50px");

    let spaceKey = createKeystrokeElement("SPACE", "115px", "50%", "160px", "50px");
    let shiftKey = createKeystrokeElement("Shift", "115px", "9%", "75px", "50px");
    let lmb = createKeystrokeElement("LMB", "60px", "91%", "75px", "50px");
    let rmb = createKeystrokeElement("RMB", "115px", "91%", "75px", "50px");

    let ckey = createKeystrokeElement("C", "60px", "9%", "75px", "50px");




    // Add the elements to the body and the clientMainMenu
    keystrokescontainer.appendChild(wkey);
    keystrokescontainer.appendChild(skey);
    keystrokescontainer.appendChild(akey);
    keystrokescontainer.appendChild(dkey);
    keystrokescontainer.appendChild(shiftKey);
    keystrokescontainer.appendChild(spaceKey);
    keystrokescontainer.appendChild(lmb);
    keystrokescontainer.appendChild(rmb);
    keystrokescontainer.appendChild(ckey);   // these links all of these to the main module so they can be seen


    document.addEventListener('keydown', function(event) {  // this part of the code checks if you click the button
        if (event.key === 'w' || event.key === 'W') {  // || means "or"
            wkey.style.backgroundColor = "#3366ff";
        }
        if (event.key === 's' || event.key === 'S') {
            skey.style.backgroundColor = "#3366ff";
        }
        if (event.key === 'a' || event.key === 'A') {
            akey.style.backgroundColor = "#3366ff";
        }
        if (event.key === 'd' || event.key === 'D') {
            dkey.style.backgroundColor = "#3366ff";
        }
        if (event.key === 'c' || event.key === 'C') {
            ckey.style.backgroundColor = "#3366ff";
        }
        if (event.key === ' ') { // Check for Space Bar key
            spaceKey.style.backgroundColor = "#3366ff";
        }
        if (event.key === 'Shift') {
            shiftKey.style.backgroundColor = "#3366ff";
        }
    });

    document.addEventListener('keyup', function(eventa) {
        if (eventa.key === 'w' || eventa.key === 'W') {
            wkey.style.backgroundColor = "#66ccff";
        }
        if (eventa.key === 's' || eventa.key === 'S') {
            skey.style.backgroundColor = "#66ccff";
        }
        if (eventa.key === 'a' || eventa.key === 'A') {
            akey.style.backgroundColor = "#66ccff";
        }
        if (eventa.key === 'd' || eventa.key === 'D') {
            dkey.style.backgroundColor = "#66ccff";
        }
        if (eventa.key === 'c' || eventa.key === 'C') {
            ckey.style.backgroundColor = "#66ccff";
        }
        if (eventa.key === ' ') { // Check for Space Bar key
            spaceKey.style.backgroundColor = "#66ccff";
        }
        if (eventa.key === 'Shift') {
            shiftKey.style.backgroundColor = "#66ccff";
        }
    });

    document.addEventListener('mousedown', function(event) {
        if (event.button === 0) {
            lmb.style.backgroundColor = "#3366ff"; //if u want the change the color when it is clicked do it here
        }
        if (event.button === 2) {
            rmb.style.backgroundColor = "#3366ff";
        }
    });

    document.addEventListener('mouseup', function(event) { //if u want to change how it is when its not clicked, changed the backgroundColor
        if (event.button === 0) {
            lmb.style.backgroundColor = "#66ccff";
        }
        if (event.button === 2) {
            rmb.style.backgroundColor = "#66ccff";
        }
    });
})();



setInterval(function() {
    'use strict';
    document.icon = "https://i.imgur.com/xXCBWbO.png" // Background Image
    document.title = "Brune.io"; // Website Title
    const maintext = document.querySelector('.Title.FullyFancyText'); //font
    maintext.style.fontFamily = "Reglisse-Fill, serif";
        maintext.style.textShadow = "none";
    maintext.style.webkitTextStroke = "none";

        document.querySelector('.Title.FullyFancyText').textContent = "⚔Brune⚔"; //bloxd.io text is here... i change it to brune u can change to anything else
    let background = document.getElementsByClassName("Background");
    background[0].src = "https://i.imgur.com/1jkeEFi.png";
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
        crosshair.textContent = "⌖";  //crosshair
        crosshair.style.width = "30px";
        crosshair.style.height = "30px";
    }
}, 1000);


document.querySelectorAll('.AvailableGame').forEach(item => {
    item.style.border = "none";
})




    // hotbar styles... change the colours by the first 3 values, 4th value is transparency
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


// links / copyright
(function() {
    'use strict';
    const fontLink = document.createElement('link');
    fontLink.href = 'youtube.com/@brunegaming';
    fontLink.rel = 'stylesheet';

    const text = document.createElement('div');
    text.style.position = "fixed";
    text.style.color = "#fff";
    text.textContent = "@BruneGaming";
    text.style.top = "1%";
    text.style.left = "50%";;
    text.style.zIndex = "10000";
    text.style.fontWeight = "bold";
    text.style.borderRadius = "25px";
    text.style.fontSize = "15px";
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
text.style.boxShadow = "rgba(0, 0, 0, 0) 0px 54px 55px, rgba(0, 0, 0, 0) 0px -12px 30px, rgba(0, 0, 0, 0) 0px 4px 6px, rgba(0, 0, 0, 0) 0px 12px 13px, rgba(0, 0, 0, 0) 0px -3px 5px";
text.style.backgroundColor = "rgba(0,0,0,0";
text.style.cursor = "pointer";

    document.head.appendChild(fontLink);
    document.body.appendChild(text);
})();

// Hotbar animation
(function() {
    'use strict';

    setInterval(function() {
        const hotbarslots = document.querySelectorAll(".item");
        const selectedslot = document.querySelectorAll(".SelectedItem");
        if (hotbarslots) {
            hotbarslots.forEach(function(hotbar) {
                hotbar.style.borderRadius = "8px";
                hotbar.style.borderColor = "#303a5900";
                hotbar.style.animation = "colorSwitch 10s infinite"; // Add animation
                hotbar.style.outline = "transparent";
            });
        }
        if (selectedslot) {
            selectedslot.forEach(function(slot) {
                slot.style.animation = "colorSwitch 10s infinite"; // Add animation
                slot.style.borderColor = "#b88c1a";
                slot.style.outline = "transparent";
            });
        }
    }, 1);
})();

// Add a style for the animation change these or add more keyframes for more colors or smoother aniamtion
GM_addStyle(`
    @keyframes colorSwitch {
        0% {
            background-color: white;
        }
        25% {
            background-color: lightpurple; /* Add the actual color code for light purple */
        }
        50% {
            background-color: orange;
        }
        75% {
            background-color: purple;
        }
        100% {
            background-color: white;
        }
    }
`);

// Change cursor style to something unique - go away chatgpt :( but thx too lol
GM_addStyle(`
    body {
        cursor: url('your-cool-cursor-image.png'), auto;
    }
`);

//Ad Blocker
document.getElementsByClassName('partnersAndCredits SmallTextLight')[0].remove();
document.getElementsByClassName('SmallTextLight')[0].remove();
document.getElementsByClassName('AdContainer')[0].remove();







//HEALTH BAR
var health1 = document.getElementsByClassName("BottomScreenStatBar");
    health1[0].style.backgroundColor = "rgba(97, 218, 251, 0.5)";
health1[0].style.boxShadow = "0 0.4px rgb(68,9,125)";
    var health2 = document.getElementsByClassName("BottomScreenStatBarBackground");
    health2[0].style.backgroundColor = "rgba(97, 218, 251, 1)";


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




(function() {
    'use strict';

    const infoDisplay = document.createElement('div')

    infoDisplay.style.position = 'absolute'
    infoDisplay.style.left = '0px'
    infoDisplay.style.bottom = '10em'
    infoDisplay.style.whiteSpace = 'pre'
    infoDisplay.style.padding = '5px'
    infoDisplay.style.background = '#00000088'
    infoDisplay.style.zIndex = '999'

    window.addEventListener('load', () => document.querySelector('.WholeAppWrapper').appendChild(infoDisplay))

    let isRunning = ''
    let isCrouching = ''
    let isKeepingRunning = false
    let isKeepingCrouching = false

    function updateInfoDisplay() {
        infoDisplay.textContent = `Running: ${isRunning || 'no'}${isKeepingRunning ? '(x)' : ''}\nCrouching: ${isCrouching || 'no'}${isKeepingCrouching ? '(v)': ''}`
    }

    const shiftKeyData = {
        key: 'Shift',
        code: 'ShiftLeft',
        keyCode: 16,
        which: 16,
        shiftKey: true,
        ControlKey: false,
        altKey: false,
        metaKey: false,
        repeat: false,
        bubbles: true,
        cancelable: true
    }

    const zKeyData = {
        key: 'z',
        code: 'KeyZ',
        keyCode: 90,
        which: 90,
        shiftKey: false,
        ControlKey: false,
        altKey: false,
        metaKey: false,
        repeat: false,
        bubbles: true,
        cancelable: true
    }

    const shiftDown = new KeyboardEvent('keydown', shiftKeyData)

    const shiftUp = new KeyboardEvent('keyup', shiftKeyData)

    const zDown = new KeyboardEvent('keydown', zKeyData)

    const zUp = new KeyboardEvent('keyup', zKeyData)

    document.addEventListener('keyup', e => {
        if (e.code === 'KeyX') {
            if (isRunning === '') {
                isRunning = 'Shift'
                isKeepingRunning = true
                document.dispatchEvent(shiftDown)
            } else if (isRunning === 'Shift') {
                isRunning = ''
                isKeepingRunning = false
                document.dispatchEvent(shiftUp)
            }
        } else if (e.code === 'KeyV') {
            if (isCrouching === '') {
                isCrouching = 'z'
                isKeepingCrouching = true
                document.dispatchEvent(zDown)
            } else if (isCrouching === 'z') {
                isCrouching = ''
                isKeepingCrouching = false
                document.dispatchEvent(zUp)
            }
        } else if (e.code === 'ShiftLeft' && isRunning === 'Shift') {
            if (isKeepingRunning) {
                e.stopImmediatePropagation()
                return
            }
            isRunning = ''
        } else if (e.key === 'Control' && isCrouching === 'Control') {
            isCrouching = ''
        } else if (e.code === 'KeyZ' && isCrouching === 'z') {
            if (isKeepingCrouching) {
                e.stopImmediatePropagation()
                return
            }
            isCrouching = ''
        } else if (e.code === 'KeyC' && isCrouching === 'c') {
            isCrouching = ''
        }
        updateInfoDisplay()
    })

    document.addEventListener('keydown', e => {
        if (e.code === 'ShiftLeft' && isRunning === '') {
            isRunning = 'Shift'
        } else if (e.key === 'Control' && isCrouching === '') {
            isCrouching = 'Control'
        } else if (e.code === 'KeyZ' && isCrouching === '') {
            isCrouching = 'z'
        } else if (e.code === 'KeyC' && isCrouching === '') {
            isCrouching = 'c'
        }
        updateInfoDisplay()
    })

    setInterval(() => {
        if (isKeepingRunning && !isKeepingCrouching) {
            document.dispatchEvent(shiftDown)
        }
        if (isKeepingCrouching && !isKeepingRunning) {
            document.dispatchEvent(zDown)
        }
    }, 100)

    updateInfoDisplay()
})();


//fullscreen mode
(function() {
    'use strict';

    setInterval(function() {
        var elementToDelete = document.querySelector('.ForceRotateBackground.FullyFancyText');
        if (elementToDelete) {
            elementToDelete.remove();
        }
    }, 100);
})();

// Animated Chat
(function() {
    'use strict';

    // Add CSS for animated rainbow background for chat messages
    GM_addStyle(`
        @keyframes rainbowBackground {
            0% { background-color: red; }
            16.7% { background-color: orange; }
            33.3% { background-color: yellow; }
            50% { background-color: green; }
            66.7% { background-color: blue; }
            83.3% { background-color: indigo; }
            100% { background-color: violet; }
        }

        .ChatMessages {
            animation: rainbowBackground 10s linear infinite;
        }
    `);

    // Add CSS for animated cursor colors
    GM_addStyle(`
        @keyframes colorSwap {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }

        body {
            animation: colorSwap 10s linear infinite;
        }
    `);

    // Add CSS for animated skybox
    GM_addStyle(`
        @keyframes skyboxAnimation {
            0% { background-position: 0 0; }
            100% { background-position: 100% 100%; }
        }

        body {
            animation: skyboxAnimation 30s linear infinite alternate;
            background-image: url('https://example.com/skybox-image.jpg'); /* Replace with your skybox image URL */
        }
    `);
})();


//CREDIT: BLUEIFY, NEXUSCLIENT, CHATGPT, ME (BUG FIXING LOL), AND YOU GUYS :)))))))))))))))))))))))))))))))))))))))000
