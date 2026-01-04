// ==UserScript==
// @name         UI MASTER+
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  A Bloxd.io custom client.press u to use.
// @author       my_name_chinese(original) stm_cl(modify)
// @match        http://staging.bloxd.io/
// @match        https://bloxd.io/
// @icon         https://s3.bmp.ovh/imgs/2024/04/20/826b7c2c971bdf10.png
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/493019/UI%20MASTER%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/493019/UI%20MASTER%2B.meta.js
// ==/UserScript==
(function() { //chat
    'use strict';
    function Chat() {
        const chatMessages = document.querySelectorAll('.ChatMessages');
        const chatInput = document.querySelector('.ChatInput');

        const messageStyles = {
            color: '#fff',
            padding: '10px',
            borderRadius: '15px 0 15px 15px',
            borderTopLeftRadius: '15px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)'
        };

        const inputStyles = {
            color: '#fff',
            padding: '10px',
            borderRadius: '5px 0 5px 5px',
            borderTopLeftRadius: '5px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1), 0 0 20px rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(5px)'
        };

        if (chatMessages.length > 0) {
            chatMessages.forEach((chatMessage) => {
                Object.assign(chatMessage.style, messageStyles);
            });
        }

        if (chatInput) {
            Object.assign(chatInput.style, inputStyles);
        }
    }

    setInterval(Chat, 730)
})();
(function () { //CPS COUNT
    var cpsButton = document.createElement('div');
    cpsButton.style.position = 'fixed';
    cpsButton.style.top = '10px';
    cpsButton.style.right = '10px';
    cpsButton.style.backgroundColor = 'black';
    cpsButton.style.color = 'white';
    cpsButton.style.padding = '5px';
    cpsButton.style.fontFamily = 'Arial';
    cpsButton.style.fontSize = '14px';
    cpsButton.style.zIndex = '9999';
    cpsButton.textContent = '';

    var cpsLabel = document.createElement('span');
    cpsLabel.textContent = 'LMB CPS: ';
    var cpsValue = document.createElement('span');
    cpsValue.textContent = '0';

    cpsButton.appendChild(cpsLabel);
    cpsButton.appendChild(cpsValue);
    document.body.appendChild(cpsButton);

    cpsButton.addEventListener('click', function () {
        resetClickCount();
    });

    var clickTimes = [];

    document.addEventListener('mousedown', function (event) {
        if (event.button === 0) {
            countClick();
        }
    });

    function countClick() {
        var currentTime = new Date().getTime();
        clickTimes.push(currentTime);
        updateCPS();
    }

    function updateCPS() {
        var currentTime = new Date().getTime();
        var oneSecondAgo = currentTime - 1000;
        var count = 0;

        for (var i = clickTimes.length - 1; i >= 0; i--) {
            if (clickTimes[i] >= oneSecondAgo) {
                count++;
            } else {
                break;
            }
        }

        cpsValue.textContent = count;
    }

    function resetClickCount() {
        clickTimes = [];
        updateCPS();
    }
})();

// Create a div for right-click CPS
var rmbCPSButton = document.createElement('div');
rmbCPSButton.style.position = 'fixed';
rmbCPSButton.style.top = '50px'; // Position it below the LMB CPS
rmbCPSButton.style.right = '10px';
rmbCPSButton.style.backgroundColor = 'black';
rmbCPSButton.style.color = 'white';
rmbCPSButton.style.padding = '5px';
rmbCPSButton.style.fontFamily = 'Arial';
rmbCPSButton.style.fontSize = '14px';
rmbCPSButton.style.zIndex = '9999';
rmbCPSButton.textContent = '';

var rmbCPSLabel = document.createElement('span');
rmbCPSLabel.textContent = 'RMB CPS: ';
var rmbCPSValue = document.createElement('span');
rmbCPSValue.textContent = '0';

rmbCPSButton.appendChild(rmbCPSLabel);
rmbCPSButton.appendChild(rmbCPSValue);
document.body.appendChild(rmbCPSButton);

// Event listeners for right-click
var rmbClickTimes = [];

document.addEventListener('mousedown', function (event) {
    if (event.button === 2) { // Check for right mouse button
        countRightClick(); // Function to track right-clicks
    }
});

function countRightClick() {
    var currentTime = new Date().getTime();
    rmbClickTimes.push(currentTime);
    updateRightClickCPS();
}

function updateRightClickCPS() {
    var currentTime = new Date().getTime();
    var oneSecondAgo = currentTime - 1000;
    var count = 0;

    for (var i = rmbClickTimes.length - 1; i >= 0; i--) {
        if (rmbClickTimes[i] >= oneSecondAgo) {
            count++;
        } else {
            break;
        }
    }

    rmbCPSValue.textContent = count;
}

(function() { //UI MASTER
    'use strict';

    let bindpresscolor = "#3366ff";
    let bindunpresscolor = "#66ccff";
    // Define Main Menu
    let clientMainMenu;
    clientMainMenu = document.createElement("div");
    clientMainMenu.textContent = "UI MASTER";
    clientMainMenu.style.position = "fixed";
    clientMainMenu.style.color = "#1B4F72";
    clientMainMenu.style.textShadow = "3px 3px 4px white";
    clientMainMenu.style.top = "50%";
    clientMainMenu.style.left = "50%";
    clientMainMenu.style.transform = "translate(-50%, -50%)";
    clientMainMenu.style.zIndex = "10000";
    clientMainMenu.style.borderRadius = "10px";
    clientMainMenu.style.backgroundImage = "url(https://s3.bmp.ovh/imgs/2024/04/20/826b7c2c971bdf10.png)";
    clientMainMenu.style.backgroundRepeat = "no-repeat";
    clientMainMenu.style.backgroundSize = "cover";
    clientMainMenu.style.backgroundPosition = "center";
    clientMainMenu.style.boxShadow = "0px 0px 20px rgba(0, 0, 0, 0.5)";
    clientMainMenu.style.fontSize = "24px";
    clientMainMenu.style.height = "600px";
    clientMainMenu.style.width = "500px";
    clientMainMenu.style.textAlign = "center";
    clientMainMenu.style.lineHeight = "50px";
    clientMainMenu.style.visibility = "hidden";
    clientMainMenu.style.opacity = "99%";
    clientMainMenu.style.userSelect = "none";


    let bindMainMenu;
    bindMainMenu = document.createElement("div");
    bindMainMenu.style.position = "fixed";
    bindMainMenu.style.backgroundcolor = "#2E86C1"
    bindMainMenu.style.opacity = '0.1';
    bindMainMenu.style.color = "#1B4F72";
    bindMainMenu.style.textShadow = "3px 3px 4px white";
    bindMainMenu.style.top = "90%";
    bindMainMenu.style.left = "10%";
    bindMainMenu.style.transform = "translate(-50%, -50%)";
    bindMainMenu.style.zIndex = "10000";
    bindMainMenu.style.borderRadius = "10px";
    bindMainMenu.style.backgroundRepeat = "no-repeat";
    bindMainMenu.style.backgroundSize = "cover";
    bindMainMenu.style.backgroundPosition = "center";
    bindMainMenu.style.fontSize = "24px";
    bindMainMenu.style.height = "300px";
    bindMainMenu.style.width = "400px";
    bindMainMenu.style.textAlign = "center";
    bindMainMenu.style.lineHeight = "50px";
    bindMainMenu.style.visibility = "hidden";
    bindMainMenu.style.opacity = "99%";
    bindMainMenu.style.userSelect = "none";


    // Define Button Elements
    let wkey;
    wkey = document.createElement('div');
    wkey.style.position = "relative";
    wkey.style.color = "#ffffff";
    wkey.textContent = "W";
    wkey.style.top = "-5px";
    wkey.style.left = "160px";
    wkey.style.zIndex = "10000";
    wkey.style.fontWeight = "bold";
    wkey.style.borderRadius = "10px";
    wkey.style.backgroundColor = bindunpresscolor;
    wkey.style.fontSize = "24px";
    wkey.style.height = "50px";
    wkey.style.width = "50px";
    wkey.style.textAlign = "center";
    wkey.style.lineHeight = "50px";
    wkey.style.filter = "blur(1px)";
    bindMainMenu.appendChild(wkey);


    let skey;
    skey = document.createElement('div');
    skey.style.position = "relative";
    skey.style.color = "#ffffff";
    skey.textContent = "S";
    skey.style.top = "0px";
    skey.style.left = "50%";
    skey.style.transform = "translateX(-50%)";
    skey.style.zIndex = "10000";
    skey.style.fontWeight = "bold";
    skey.style.borderRadius = "10px";
    skey.style.backgroundColor = bindunpresscolor;
    skey.style.fontSize = "24px";
    skey.style.height = "50px";
    skey.style.width = "50px";
    skey.style.textAlign = "center";
    skey.style.lineHeight = "50px";
    skey.style.filter = "blur(1px)";
    bindMainMenu.appendChild(skey);

    let akey;
    akey = document.createElement('div');
    akey.style.position = "relative";
    akey.style.color = "#ffffff";
    akey.textContent = "A";
    akey.style.top = "-50px";
    akey.style.left = "140px";
    akey.style.transform = "translateX(-50%)";
    akey.style.zIndex = "10000";
    akey.style.fontWeight = "bold";
    akey.style.borderRadius = "10px";
    akey.style.backgroundColor = bindunpresscolor;
    akey.style.fontSize = "24px";
    akey.style.height = "50px";
    akey.style.width = "50px";
    akey.style.textAlign = "center";
    akey.style.lineHeight = "50px";
    akey.style.filter = "blur(1px)";
    bindMainMenu.appendChild(akey);

    let dkey;
    dkey = document.createElement('div');
    dkey.style.position = "relative";
    dkey.style.color = "#ffffff";
    dkey.textContent = "D";
    dkey.style.top = "-100px";
    dkey.style.left = "260px";
    dkey.style.transform = "translateX(-50%)";
    dkey.style.zIndex = "10000";
    dkey.style.fontWeight = "bold";
    dkey.style.borderRadius = "10px";
    dkey.style.backgroundColor = bindunpresscolor;
    dkey.style.fontSize = "24px";
    dkey.style.height = "50px";
    dkey.style.width = "50px";
    dkey.style.textAlign = "center";
    dkey.style.lineHeight = "50px";
    dkey.style.filter = "blur(1px)";
    bindMainMenu.appendChild(dkey);

    let lmb;
    lmb = document.createElement('div');
    lmb.style.position = "relative";
    lmb.style.color = "#ffffff";
    lmb.textContent = "LMB";
    lmb.style.top = "-90px";
    lmb.style.left = "140px";
    lmb.style.transform = "translateX(-50%)";
    lmb.style.zIndex = "10000";
    lmb.style.fontWeight = "bold";
    lmb.style.borderRadius = "10px";
    lmb.style.backgroundColor = bindunpresscolor;
    lmb.style.fontSize = "18px";
    lmb.style.height = "50px";
    lmb.style.width = "100px";
    lmb.style.textAlign = "center";
    lmb.style.lineHeight = "50px";
    lmb.style.filter = "blur(1px)";
    bindMainMenu.appendChild(lmb);

    let rmb;
    rmb = document.createElement('div');
    rmb.style.position = "relative";
    rmb.style.color = "#ffffff";
    rmb.textContent = "RMB";
    rmb.style.top = "-140px";
    rmb.style.left = "260px";
    rmb.style.transform = "translateX(-50%)";
    rmb.style.zIndex = "10000";
    rmb.style.fontWeight = "bold";
    rmb.style.borderRadius = "10px";
    rmb.style.backgroundColor = bindunpresscolor;
    rmb.style.fontSize = "18px";
    rmb.style.height = "50px";
    rmb.style.width = "100px";
    rmb.style.textAlign = "center";
    rmb.style.lineHeight = "50px";
    rmb.style.filter = "blur(1px)";
    bindMainMenu.appendChild(rmb);

    let space;
    space = document.createElement('div');
    space.style.position = "relative";
    space.style.color = "#ffffff";
    space.textContent = "SPACE";
    space.style.top = "-125px";
    space.style.left = "200px";
    space.style.transform = "translateX(-50%)";
    space.style.zIndex = "10000";
    space.style.fontWeight = "bold";
    space.style.borderRadius = "10px";
    space.style.backgroundColor = bindunpresscolor;
    space.style.fontSize = "18px";
    space.style.height = "50px";
    space.style.width = "220px";
    space.style.textAlign = "center";
    space.style.lineHeight = "50px";
    space.style.filter = "blur(1px)";
    bindMainMenu.appendChild(space);

    let shift;
    shift = document.createElement('div');
    shift.style.position = "relative";
    shift.style.color = "#ffffff";
    shift.textContent = "SHIFT";
    shift.style.top = "-240px";
    shift.style.left = "50px";
    shift.style.transform = "translateX(-50%)";
    shift.style.zIndex = "10000";
    shift.style.fontWeight = "bold";
    shift.style.borderRadius = "10px";
    shift.style.backgroundColor = bindunpresscolor;
    shift.style.fontSize = "18px";
    shift.style.height = "100px";
    shift.style.width = "50px";
    shift.style.textAlign = "center";
    shift.style.lineHeight = "100px";
    shift.style.filter = "blur(1px)";
    bindMainMenu.appendChild(shift);

    let caps;
    caps = document.createElement('div');
    caps.style.position = "relative";
    caps.style.color = "#ffffff";
    caps.textContent = "C";
    caps.style.top = "-340px";
    caps.style.left = "350px";
    caps.style.transform = "translateX(-50%)";
    caps.style.zIndex = "10000";
    caps.style.fontWeight = "bold";
    caps.style.borderRadius = "10px";
    caps.style.backgroundColor = bindunpresscolor;
    caps.style.fontSize = "18px";
    caps.style.height = "100px";
    caps.style.width = "50px";
    caps.style.textAlign = "center";
    caps.style.lineHeight = "100px";
    caps.style.filter = "blur(1px)";
    bindMainMenu.appendChild(caps);

    // Add the elements to the body and the clientMainMenu
    document.body.appendChild(bindMainMenu);
    document.body.appendChild(clientMainMenu);

    // Add Event Listeners for the Keybinds

    document.addEventListener('keydown', function(event) {
        if (event.key === 'w') {
            wkey.style.backgroundColor = bindpresscolor;
        }
        if (event.key === 's') {
            skey.style.backgroundColor = bindpresscolor;
        }
        if (event.key === 'a') {
            akey.style.backgroundColor = bindpresscolor;
        }
        if (event.key === 'd') {
            dkey.style.backgroundColor = bindpresscolor;
        }
        if (event.key === ' ') {
            space.style.backgroundColor = bindpresscolor;
        }
        if (event.key === 'Shift') {
            shift.style.backgroundColor = bindpresscolor;
        }
        if (event.key === 'c') {
            caps.style.backgroundColor = bindpresscolor;
        }
    });

    document.addEventListener('keyup', function(event) {
        if (event.key === 'w') {
            wkey.style.backgroundColor = bindunpresscolor;
        }
        if (event.key === 's') {
            skey.style.backgroundColor = bindunpresscolor;
        }
        if (event.key === 'a') {
            akey.style.backgroundColor = bindunpresscolor;
        }
        if (event.key === 'd') {
            dkey.style.backgroundColor = bindunpresscolor;
        }
        if (event.key === ' ') {
            space.style.backgroundColor = bindunpresscolor;
        }
        if (event.key === 'Shift') {
            shift.style.backgroundColor = bindunpresscolor;
        }
        if (event.key === 'c') {
            caps.style.backgroundColor = bindunpresscolor;
        }
    });

    document.addEventListener('mousedown', function(event) {
        if (event.button === 0) {
            lmb.style.backgroundColor = bindpresscolor;
        }
        if (event.button === 2) {
            rmb.style.backgroundColor = bindpresscolor;
        }
    });

    document.addEventListener('mouseup', function(event) {
        if (event.button === 0) {
            lmb.style.backgroundColor = bindunpresscolor;
        }
        if (event.button === 2) {
            rmb.style.backgroundColor = bindunpresscolor;
        }
    });

    // Define Main Menu dragging

    let mainisDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    clientMainMenu.addEventListener('mousedown', function(event) {
        if (event.target.nodeName !== 'INPUT') {
            mainisDragging = true;
            offsetX = event.clientX;
            offsetY = event.clientY;
        }
    });

    document.addEventListener('mousemove', function(event) {
        if (mainisDragging) {
            const left = event.clientX;
            const top = event.clientY;

            clientMainMenu.style.left = left + "px";
            clientMainMenu.style.top = top + "px";
        }
    });

    document.addEventListener('mouseup', function() {
        mainisDragging = false;
    });

    let bindisDragging = false;
    let offsetX1 = 0;
    let offsetY1 = 0;

    bindMainMenu.addEventListener('mousedown', function(event) {
        if (event.target.nodeName !== 'INPUT') {
            bindisDragging = true;
            offsetX = event.clientX;
            offsetY = event.clientY;
        }
    });

    document.addEventListener('mousemove', function(event) {
        if (bindisDragging) {
            const left = event.clientX;
            const top = event.clientY;

            bindMainMenu.style.left = left + "px";
            bindMainMenu.style.top = top + "px";
        }
    });

    document.addEventListener('mouseup', function() {
        bindisDragging = false;
    });
    document.addEventListener('keydown', function(event) {
        if (event.key === 'U' || event.key === 'u') {
            clientMainMenu.style.visibility = clientMainMenu.style.visibility === "hidden" ? "visible" : "hidden";
        }
    });

    // Define imputs and main menu text

    let clientheader
    clientheader = document.createElement("div");
    clientheader.textContent = "Made By my_name_chinese";
    clientheader.style.position = "absolute";
    clientheader.style.top = "20px";
    clientheader.style.left = "50%";
    clientheader.style.transform = "translateX(-50%)";
    clientheader.style.fontSize = "15px";
    clientMainMenu.appendChild(clientheader);

    // Create the button element
    const bilibutton = document.createElement("div");
    bilibutton.style.position = "absolute";
    bilibutton.style.top = "60px";
    bilibutton.style.left = "50%";
    bilibutton.style.transform = "translateX(-50%)";
    bilibutton.style.cursor = "pointer";
    bilibutton.style.backgroundColor = "#66ccff";
    bilibutton.style.backgroundImage = "linear-gradient(to bottom, #2E86C1, #AED6F1)";
    bilibutton.style.color = "#1B4F72";
    bilibutton.style.borderRadius = "10px";
    bilibutton.style.height = "40px";
    bilibutton.style.padding = "8px";
    bilibutton.addEventListener("click", function() {
        window.location.href = "https://space.bilibili.com/3546388900088449?spm_id_from=333.1007.0.0";
    });

    // Create the text element
    const bilibuttonText = document.createElement("div");
    bilibuttonText.textContent = "my_name_bilibili_acc";
    bilibuttonText.style.fontSize = "20px";
    bilibuttonText.style.textAlign = "center";
    bilibuttonText.style.top = "50%";
    bilibuttonText.style.transform = "translateY(-25%)";

    // Append the text element to the button element
    bilibutton.appendChild(bilibuttonText);

    // Append the button element to the desired parent element
    clientMainMenu.appendChild(bilibutton);


    let clientsettingstext;
    clientsettingstext = document.createElement("div");
    clientsettingstext.textContent = "- Client Settings -";
    clientsettingstext.style.position = "absolute";
    clientsettingstext.style.color = "#1B4F72"
    clientsettingstext.style.top = "120px";
    clientsettingstext.style.left = "50%";
    clientsettingstext.style.transform = "translateX(-50%)";
    clientsettingstext.style.fontSize = "20px";
    clientMainMenu.appendChild(clientsettingstext);

    let clientsettingsinput
    clientsettingsinput = document.createElement("input");
    clientsettingsinput.type = "text";
    clientsettingsinput.placeholder = "Client Background URL";
    clientsettingsinput.style.backgroundColor = '#AED6F1';
    clientsettingsinput.style.border = '3px double #1B4F72';
    clientsettingsinput.style.position = "absolute";
    clientsettingsinput.style.top = "160px";
    clientsettingsinput.style.left = "50%";
    clientsettingsinput.style.transform = "translateX(-50%)";
    clientMainMenu.appendChild(clientsettingsinput);

    clientsettingsinput.addEventListener('input', function() {
        clientMainMenu.style.backgroundImage = `url(${clientsettingsinput.value})`;
    });

    clientsettingsinput.addEventListener('mousedown', function(event) {
        event.stopPropagation();
    });

    let hotbarsettingstext;
    hotbarsettingstext = document.createElement("div");
    hotbarsettingstext.textContent = "- HotBar Settings -";
    hotbarsettingstext.style.position = "absolute";
    hotbarsettingstext.style.top = "220px";
    hotbarsettingstext.style.left = "50%";
    hotbarsettingstext.style.transform = "translateX(-50%)";
    hotbarsettingstext.style.fontSize = "20px";
    clientMainMenu.appendChild(hotbarsettingstext);

    let hotbarmaincolorinput
    hotbarmaincolorinput = document.createElement("input");
    hotbarmaincolorinput.type = "color";
    hotbarmaincolorinput.value = "#3d4b79"
    hotbarmaincolorinput.style.top = "250px";
    hotbarmaincolorinput.style.marginTop = "15px";
    hotbarmaincolorinput.style.position = "absolute";
    hotbarmaincolorinput.style.left = "44%";
    hotbarmaincolorinput.style.opacity = 1;
    hotbarmaincolorinput.style.transform = "translateX(-50%)";
    clientMainMenu.appendChild(hotbarmaincolorinput);

    hotbarmaincolorinput.addEventListener("input", function() {
        const color = hotbarmaincolorinput.value;
        hotbarmaincolorinput.value = color;
        const hotbars = document.querySelectorAll(".item");
        hotbars.forEach(function(hotbar) {
            hotbar.style.backgroundColor = color;
        });
    });

    let hotbarbordercolorinput;
    hotbarbordercolorinput = document.createElement("input");
    hotbarbordercolorinput.type = "color";
    hotbarbordercolorinput.style.top = "250px";
    hotbarbordercolorinput.value = "#303a59";
    hotbarbordercolorinput.style.marginTop = "15px";
    hotbarbordercolorinput.style.position = "absolute";
    hotbarbordercolorinput.style.left = "56%";
    hotbarbordercolorinput.style.transform = "translateX(-50%)";
    hotbarbordercolorinput.style.opacity = 1;
    clientMainMenu.appendChild(hotbarbordercolorinput);

    hotbarbordercolorinput.addEventListener("input", function() {
        const color = hotbarbordercolorinput.value;
        hotbarbordercolorinput.value = color;
        const hotbars = document.querySelectorAll(".item");

        hotbars.forEach(function(hotbar) {
            hotbar.style.borderColor = color;
        });
    });

    let hotbarborderradiusinput;
    hotbarborderradiusinput = document.createElement("input");
    hotbarborderradiusinput.type = "range";
    hotbarborderradiusinput.style.top = "280px";
    hotbarborderradiusinput.style.marginTop = "10px";
    hotbarborderradiusinput.style.position = "absolute";
    hotbarborderradiusinput.value = "20";
    hotbarborderradiusinput.style.left = "50%";
    hotbarborderradiusinput.min = "0";
    hotbarborderradiusinput.max = "30";
    hotbarborderradiusinput.style.transform = "translateX(-50%)";
    clientMainMenu.appendChild(hotbarborderradiusinput);

    hotbarborderradiusinput.addEventListener("input", function() {
        const hotbarrounding = hotbarborderradiusinput.value;
        const hotbars = document.querySelectorAll(".item");

        hotbars.forEach(function(hotbar) {
            hotbar.style.borderRadius = hotbarrounding + "px";
        });
    });

    let crosshairsettingstext
    crosshairsettingstext = document.createElement("div");
    crosshairsettingstext.textContent = "- Crosshair Settings -";
    crosshairsettingstext.style.position = "absolute";
    crosshairsettingstext.style.top = "320px";
    crosshairsettingstext.style.left = "50%";
    crosshairsettingstext.style.transform = "translateX(-50%)";
    crosshairsettingstext.style.fontSize = "20px";
    clientMainMenu.appendChild(crosshairsettingstext);

    let crosshairsettingsinput;
    crosshairsettingsinput = document.createElement("input");
    crosshairsettingsinput.type = "text";
    crosshairsettingsinput.placeholder = "Crosshair URL";
    crosshairsettingsinput.style.backgroundColor = '#AED6F1';
    crosshairsettingsinput.style.border = '3px double #1B4F72';
    crosshairsettingsinput.style.position = "absolute";
    crosshairsettingsinput.style.top = "360px";
    crosshairsettingsinput.value = "https://s3.bmp.ovh/imgs/2024/04/14/7f04eab3528d86ab.png";
    crosshairsettingsinput.style.left = "50%";
    crosshairsettingsinput.style.transform = "translateX(-50%)";
    clientMainMenu.appendChild(crosshairsettingsinput);

    let crosshairurl;
    crosshairurl = `url(${crosshairsettingsinput.value})`;
    crosshairsettingsinput.addEventListener('input', function() {
        crosshairurl = `url(${crosshairsettingsinput.value})`;
    });

    crosshairsettingsinput.addEventListener('mousedown', function(event) {
        event.stopPropagation();
    });

    let keybindsettingstext;
    keybindsettingstext = document.createElement("div");
    keybindsettingstext.textContent = "- Keybind Settings -";
    keybindsettingstext.style.position = "absolute";
    keybindsettingstext.style.top = "420px";
    keybindsettingstext.style.left = "50%";
    keybindsettingstext.style.transform = "translateX(-50%)";
    keybindsettingstext.style.fontSize = "20px";
    clientMainMenu.appendChild(keybindsettingstext);

    let keybindsettingbotton;
    keybindsettingbotton = document.createElement("div");
    keybindsettingbotton.textContent = "- Keybind Settings -";
    keybindsettingbotton.style.position = "absolute";
    keybindsettingbotton.style.top = "420px";
    keybindsettingbotton.style.left = "50%";
    keybindsettingbotton.style.transform = "translateX(-50%)";
    keybindsettingbotton.style.fontSize = "20px";
    clientMainMenu.appendChild(keybindsettingbotton);

    // Create the button element
    const bindbutton = document.createElement("div");
    bindbutton.style.position = "absolute";
    bindbutton.style.top = "470px";
    bindbutton.style.fontSize = "20px";
    bindbutton.style.left = "50%";
    bindbutton.style.transform = "translateX(-50%)";
    bindbutton.style.cursor = "pointer";
    bindbutton.style.borderRadius = "10px";
    bindbutton.style.backgroundColor = "#AED6F1";
    bindbutton.style.color = "#1B4F72";
    bindbutton.style.borderRadius = "10px";
    bindbutton.style.height = "40px";
    bindbutton.style.padding = "8px";
    bindbutton.innerHTML = 'keybind:ON'; // 初始文本为"ON"
    var isOn = true; // 初始状态为true
    bindMainMenu.style.visibility = 'visible';
    bindbutton.addEventListener("click", function() {
        isOn = !isOn; // 切换状态
        bindbutton.innerHTML = isOn ? 'keybind:ON' : 'keybind:OFF'; // 根据状态设置按钮文本

        // 根据状态显示或隐藏元素
        bindMainMenu.style.visibility = isOn ? 'visible' : 'hidden';
    });

    // Append the button element to the desired parent element
    clientMainMenu.appendChild(bindbutton);

    let bindbgcolorinput
    bindbgcolorinput = document.createElement("input");
    bindbgcolorinput.type = "color";
    bindbgcolorinput.value = bindunpresscolor;
    bindbgcolorinput.style.top = "520px";
    bindbgcolorinput.style.marginTop = "15px";
    bindbgcolorinput.style.position = "absolute";
    bindbgcolorinput.style.left = "44%";
    bindbgcolorinput.style.transform = "translateX(-50%)";
    clientMainMenu.appendChild(bindbgcolorinput);

    bindbgcolorinput.addEventListener("input", function() {
        const bindcolor = bindbgcolorinput.value;
        bindunpresscolor = bindcolor;
        wkey.style.backgroundColor = bindunpresscolor;
        skey.style.backgroundColor = bindunpresscolor;
        akey.style.backgroundColor = bindunpresscolor;
        dkey.style.backgroundColor = bindunpresscolor;
        rmb.style.backgroundColor = bindunpresscolor;
        lmb.style.backgroundColor = bindunpresscolor;
        space.style.backgroundColor = bindunpresscolor;
        shift.style.backgroundColor = bindunpresscolor;
        caps.style.backgroundColor = bindunpresscolor;
    });

    let bindpresscolorinput;
    bindpresscolorinput = document.createElement("input");
    bindpresscolorinput.type = "color";
    bindpresscolorinput.style.top = "520px";
    bindpresscolorinput.value = bindpresscolor;
    bindpresscolorinput.style.marginTop = "15px";
    bindpresscolorinput.style.position = "absolute";
    bindpresscolorinput.style.left = "56%";
    bindpresscolorinput.style.transform = "translateX(-50%)";
    clientMainMenu.appendChild(bindpresscolorinput);

    bindpresscolorinput.addEventListener("input", function() {
        const bindprcolor = bindpresscolorinput.value;
        bindpresscolor = bindprcolor;
    });

    let bindtextcolorinput;
    bindtextcolorinput = document.createElement("input");
    bindtextcolorinput.type = "color";
    bindtextcolorinput.style.top = "550px";
    bindtextcolorinput.value = "#ffffff";
    bindtextcolorinput.style.marginTop = "15px";
    bindtextcolorinput.style.position = "absolute";
    bindtextcolorinput.style.left = "50%";
    bindtextcolorinput.style.transform = "translateX(-50%)";
    clientMainMenu.appendChild(bindtextcolorinput);

    bindtextcolorinput.addEventListener("input", function() {
        const bindtextcolor = bindtextcolorinput.value;
        bindMainMenu.style.textShadow = "3px 3px 4px" + bindtextcolor;
        wkey.style.color = bindtextcolor;
        skey.style.color = bindtextcolor;
        akey.style.color = bindtextcolor;
        dkey.style.color = bindtextcolor;
        rmb.style.color = bindtextcolor;
        lmb.style.color = bindtextcolor;
        space.style.color = bindtextcolor;
        shift.style.color = bindtextcolor;
        caps.style.color = bindtextcolor;
    });


    setInterval(function() {
        const color1 = hotbarmaincolorinput.value;
        const color2 = hotbarbordercolorinput.value
        const hotbarrounding = hotbarborderradiusinput.value;
        const hotbars = document.querySelectorAll(".item");
        hotbars.forEach(function(hotbar) {
            hotbar.style.borderRadius = hotbarrounding + "px";
            hotbar.style.borderColor = color2;
            hotbar.style.backgroundColor = color1;
        });
        const crosshair = document.querySelector(".CrossHair");
        if (crosshair) {
            crosshair.textContent = "";
            crosshair.style.backgroundImage = crosshairurl; // Use the crosshairurl variable here
            crosshair.style.backgroundRepeat = "no-repeat";
            crosshair.style.backgroundSize = "contain";
            crosshair.style.width = "30px";
            crosshair.style.height = "30px";
        }
    }, 1000);

})();