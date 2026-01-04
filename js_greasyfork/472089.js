// ==UserScript==
// @name         Customizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  customize the Agarpowers Layout!
// @author       qwd
// @match        https://agarpowers.xyz/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agarpowers.xyz
// @grant        none
// @license      qwd
// @downloadURL https://update.greasyfork.org/scripts/472089/Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/472089/Customizer.meta.js
// ==/UserScript==

function customizer() {
    var choosepanel = document.getElementById("choose-panel");choosepanel.style.display = "flex";
    var mainpanel = document.querySelector('#main-panel');
    
    var btf = document.createElement("div");
    btf.style.display = "block"; btf.style.marginBottom="20px"; btf.style.color="white";
    btf.innerHTML = `
  <h4 style="color: aqua">Customizer</h4>
<table>
  <tr>
    <td>Boxes:</td>
    <td><input id="boxInput" type="color"></td>
    <td>Thickness:</td>
    <td><input id="thicknessBoxInput" type="range" value="" min="1" max="10"></td>
  </tr>
  <tr>
    <td>Ingame Boxes:</td>
    <td><input id="inboxInput" type="color"></td>
  </tr>
  <tr>
    <td>Level:</td>
    <td><input id="lvlInput" type="color"></td>
    <td>LevelBorder:</td>
    <td><input id="lvlborderInput" type="color"></td>
  </tr>
  <tr>
    <td>Levelbar: From:</td>
    <td><input id="levelbarFromInput" type="color"></td>
    <td>To:</td>
    <td><input id="levelbarToInput" type="color"></td>
  </tr>
  <tr>
    <td>Leveltext:</td>
    <td><input id="leveltext" type="color">
  </tr>
  <tr>
    <td>Manabar:</td>
    <td><input id="manaInput" type="color"></td>
  </tr>
  <tr>
      <td>Rainbowbar:</td>
    <td><input id="rainbowBar" type="checkbox"></td>
  </tr>
  <tr>
    <td>RainbowScroll: </td>
    <td><input id="rainbowScroll" type="checkbox"></td>
  </tr>
  <tr>
    <td>Buttons</td>
    <td><input id="buttonsInput" type="color"></td>
  </tr>
  <tr>
    <td>Chat Scroll: </td>
    <td><input id="chatScroll" type="color"></td>
  </tr>
</table>

`;

    mainpanel.appendChild(btf);
    var customizer = document.createElement("div");
    customizer.setAttribute("id", "cBeautifier");
    customizer.setAttribute("class", "chooseBtn");
    customizer.setAttribute("role", "button");
    customizer.innerHTML = 'Customizer';
    customizer.style.borderTopRightRadius = "10px";
    customizer.style.borderBottomRightRadius = "10px";

    var settingCol = document.getElementById("setting-col");
    var settings = document.getElementById("settings");
    var controls = document.getElementById("controls");
    var servers = document.getElementById("servers");
    var csettings = document.getElementById("cSettings"); csettings.addEventListener('click', function () {btf.style.display="none";});
    var ccontrols = document.getElementById("cControls"); ccontrols.addEventListener('click', function () {btf.style.display="none";});
    var cservers = document.getElementById("cServers"); cservers.addEventListener('click', function () {btf.style.display="none";});
    cservers.style.borderRadius = "0px";
    var levelcircle = document.querySelector('.level-circle');
    var level = document.getElementById("level");
    var inXPBarText = document.querySelector('#ingame-xp-bar');
    var outXPBarText = document.getElementById("xp-bar");
    var innerManaBar = document.querySelector('#innerManaBar');
    var accpanel = document.getElementById("acc-panel");
    var pwpanel = document.getElementById("powerup-display");
    var ingameXPBar = document.getElementById("ingame-xp-bar");
    // Boxes Change
    var boxesInput = document.getElementById("boxInput");
    var storedBoxColor = localStorage.getItem("boxColor");
    var borderColor = storedBoxColor || "black";
    boxesInput.value = borderColor;
    mainpanel.style.border = "2px solid " + borderColor;
    accpanel.style.border = "2px solid " + borderColor;
    pwpanel.style.borderTop = "2px solid " + borderColor;
    pwpanel.style.borderRight = "2px solid " + borderColor;
    pwpanel.style.borderLeft = "2px solid "+ borderColor;
    boxesInput.addEventListener("input", function() {
        var boxesInputValue = boxesInput.value;
        borderColor = boxesInputValue || "black";
        mainpanel.style.border = "2px solid " + borderColor;
        accpanel.style.border = "2px solid " + borderColor;
        pwpanel.style.borderTop = "2px solid " + borderColor;
        pwpanel.style.borderRight = "2px solid " + borderColor;
        pwpanel.style.borderLeft = "2px solid "+ borderColor;
        localStorage.setItem("boxColor", borderColor);
    });
    var thicknessBoxInput = document.getElementById("thicknessBoxInput");
    var storedBoxThickness = localStorage.getItem("boxThickness");
    var boxesThickness = storedBoxThickness || "black";
    mainpanel.style.border = boxesThickness + "px solid " + borderColor;
    accpanel.style.border = boxesThickness + "px solid " + borderColor;
    pwpanel.style.borderTop = boxesThickness + "px solid " + borderColor;
    pwpanel.style.borderRight = boxesThickness + "px solid " + borderColor;
    pwpanel.style.borderLeft = boxesThickness + "px solid " + borderColor;
    thicknessBoxInput.addEventListener("input", function() {
        var tboxesInputValue = thicknessBoxInput.value;
        boxesThickness = tboxesInputValue || "1";
        mainpanel.style.border = boxesThickness + "px solid " + borderColor;
        accpanel.style.border = boxesThickness + "px solid " + borderColor;
        pwpanel.style.borderTop = boxesThickness + "px solid " + borderColor;
        pwpanel.style.borderRight = boxesThickness + "px solid " + borderColor;
        pwpanel.style.borderLeft = boxesThickness + "px solid " + borderColor;
        localStorage.setItem("boxThickness", boxesThickness);
    });
    var inboxInput = document.getElementById("inboxInput");
    var ingStats = document.getElementById("ingame-stats-container");
    var storedboxborderColor = localStorage.getItem("boxborderColor");
    var boxborderColor = storedboxborderColor || "black";
    inboxInput.value = boxborderColor;
    ingStats.style.border="2px solid " + boxborderColor
    inboxInput.addEventListener("input", function() {
        var boxborderInputValue = inboxInput.value;
        boxborderColor = boxborderInputValue || "black";
        ingStats.style.border="2px solid " + boxborderColor
        localStorage.setItem("boxborderColor", boxborderColor);
    });
    // Level Change
    var lvlInput = document.getElementById("lvlInput");
    var storedlvlColor = localStorage.getItem("lvlColor");
    var lvlColor = storedlvlColor || "black";
    lvlInput.value = lvlColor;
    levelcircle.style.backgroundColor = lvlColor;
    level.style.backgroundColor = lvlColor;
    lvlInput.addEventListener("input", function() {
        var lvlInputValue = lvlInput.value;
        lvlColor = lvlInputValue || "black";
        levelcircle.style.backgroundColor = lvlColor;
        level.style.backgroundColor = lvlColor;
        localStorage.setItem("lvlColor", lvlColor);
    });

    var lvlborderInput = document.getElementById("lvlborderInput");
    var storedlvlborderColor = localStorage.getItem("lvlborderColor");
    var lvlborderColor = storedlvlborderColor || "black";
    lvlborderInput.value = lvlborderColor;
    levelcircle.style.border = "10px ridge" + lvlborderColor;
    lvlborderInput.addEventListener("input", function() {
        var lvlborderInputValue = lvlborderInput.value;
        lvlborderColor = lvlborderInputValue || "black";
        levelcircle.style.border = "10px ridge" + lvlborderColor;
        localStorage.setItem("lvlborderColor", lvlborderColor);
    });
    var leveltextIn = document.getElementById("level-number");
    var leveltextOut = document.getElementById("level");
    var leveltextInput = document.getElementById("leveltext");
    var storedlvltextColor = localStorage.getItem("lvltextColor");
    var lvltextColor = storedlvltextColor || "black";
    leveltextInput.value = lvltextColor;
    leveltextIn.style.color= lvltextColor;
    leveltextOut.style.color= lvltextColor;
    leveltextInput.addEventListener("input", function() {
        var lvltextInputValue = leveltextInput.value;
        lvltextColor = lvltextInputValue || "black";
        leveltextIn.style.color= lvltextColor;
        leveltextOut.style.color= lvltextColor;
        localStorage.setItem("lvltextColor", lvltextColor);
    });

    var manaInput = document.getElementById("manaInput");
    var storedmanaColor = localStorage.getItem("manaColor");
    var manaColor = storedmanaColor || "black";
    manaInput.value = manaColor;
    manaColorChange()
    manaInput.addEventListener("input", function() {
        var manaInputValue = manaInput.value;
        manaColor = manaInputValue || "black";
        manaColorChange()
        localStorage.setItem("manaColor", manaColor);
    });
    function manaColorChange() {
        innerManaBar.style.backgroundColor = manaColor;
    } setInterval(manaColorChange, 1);
    // RainbowBar
    var rainbowInput = document.getElementById("rainbowBar");
    let hue = 0;
    let direction = 1;
    let animationId;
    function animateRainbow() {
        hue += direction;
        if (hue >= 360) {
            hue = 0;
        }
        innerManaBar.style.background = `linear-gradient(to right, hsl(${hue}, 100%, 50%), hsl(${hue + 60}, 100%, 50%))`;
        animationId = requestAnimationFrame(animateRainbow);
    }


    rainbowInput.addEventListener('change', () => {
        if (rainbowInput.checked) {
            animateRainbow();
        } else {
            innerManaBar.style.background="none";
            setInterval(manaColorChange, 1);
            cancelAnimationFrame(animationId);
        }
    });

    var chatScrollInput = document.getElementById("chatScroll");
    var storedchatColor = localStorage.getItem("chatColor");
    var chatColor = storedchatColor || "black";
    chatScrollInput.value = chatColor;
    var styleCode = `#chat-msgs {
  scrollbar-color: ${chatColor} ${chatColor};
  scrollbar-width: thin;
}`;
    var styleElement2 = document.getElementById('chat-msgs-style');
    styleElement2 = document.createElement('style');
    styleElement2.id = 'chat-msgs-style';
    document.body.appendChild(styleElement2);
    styleElement2.innerHTML = styleCode;

    chatScrollInput.addEventListener("input", function() {
        var chatInputValue = chatScrollInput.value;
        chatColor = chatInputValue || "black";

        var styleCode = `#chat-msgs {
    scrollbar-color: ${chatColor} ${chatColor};
    scrollbar-width: thin;
  }`;
        var styleElement2 = document.getElementById('chat-msgs-style');
        styleElement2 = document.createElement('style');
        styleElement2.id = 'chat-msgs-style';
        document.body.appendChild(styleElement2);
        styleElement2.innerHTML = styleCode;

        localStorage.setItem("chatColor", chatColor);
    });


    let hue2 = 0;
    let direction2 = 1;
    let animationId2;

    function animateRainbowScroll() {
        hue2 += direction2;
        if (hue2 >= 360) {
            hue2 = 0;
        }
        var styleCode = `#chat-msgs {
    scrollbar-color: hsl(${hue2}, 100%, 50%) hsla(${hue2 + 60}, 100%, 50%, 0.7);
  }`;

        var styleElement = document.getElementById('chat-msgs-style');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'chat-msgs-style';
            document.body.appendChild(styleElement);
        }
        styleElement.innerHTML = styleCode;
        animationId2 = requestAnimationFrame(animateRainbowScroll);
    }
    var rainbowScrollInput = document.getElementById("rainbowScroll");
    rainbowScrollInput.addEventListener('change', () => {
        if (rainbowScrollInput.checked) {
            animateRainbowScroll();
            console.log("an");
        } else {
            cancelAnimationFrame(animationId2);
            console.log("aus");
        }
    });
    var xpBoxIn = document.querySelector(".xp-container");
    var xpBoxOut = document.getElementById("xp");
    // Levelbar
    var levelbarFromInput = document.getElementById("levelbarFromInput");
    var storedlevelbarFromColor = localStorage.getItem("levelbarFromColor");
    var levelbarFromColor = storedlevelbarFromColor || "black";
    levelbarFromInput.value = levelbarFromColor;
    levelbarFromInput.addEventListener("input", function() {
        var levelbarFromInputValue = levelbarFromInput.value;
        levelbarFromColor = levelbarFromInputValue || "black";
        outXPBarText.style.backgroundImage = "linear-gradient(to right, " + levelbarFromColor + ", " + levelbarToColor + ")";
        inXPBarText.style.backgroundImage = "linear-gradient(to right, " + levelbarFromColor + ", " + levelbarToColor + ")";
        xpBoxOut.style.borderTop= "2px solid " + levelbarFromColor;
        xpBoxOut.style.borderBottom= "2px solid " + levelbarFromColor;
        xpBoxOut.style.borderRight= "2px solid " + levelbarFromColor;
        xpBoxIn.style.borderTop= "5px solid " + levelbarFromColor;
        xpBoxIn.style.borderBottom= "5px solid " + levelbarFromColor;
        xpBoxIn.style.borderRight= "5px solid " + levelbarFromColor;
        localStorage.setItem("levelbarFromColor", levelbarFromColor);
    });
    var levelbarToInput = document.getElementById("levelbarToInput");
    var storedlevelbarToColor = localStorage.getItem("levelbarToColor");
    var levelbarToColor = storedlevelbarToColor || "black";
    levelbarToInput.value = levelbarToColor;
    levelbarToInput.addEventListener("input", function() {
        var levelbarToInputValue = levelbarToInput.value;
        levelbarToColor = levelbarToInputValue || "black";
        outXPBarText.style.backgroundImage = "linear-gradient(to right, " + levelbarFromColor + ", " + levelbarToColor + ")";
        inXPBarText.style.backgroundImage = "linear-gradient(to right, " + levelbarFromColor + ", " + levelbarToColor + ")";
        localStorage.setItem("levelbarToColor", levelbarToColor);
    });
    outXPBarText.style.backgroundImage = "linear-gradient(to right, " + levelbarFromColor + ", " + levelbarToColor + ")";
    inXPBarText.style.backgroundImage = "linear-gradient(to right, " + levelbarFromColor + ", " + levelbarToColor + ")";
        xpBoxOut.style.borderTop= "2px solid " + levelbarFromColor;
        xpBoxOut.style.borderBottom= "2px solid " + levelbarFromColor;
        xpBoxOut.style.borderRight= "2px solid " + levelbarFromColor;
        xpBoxIn.style.borderTop= "5px solid " + levelbarFromColor;
        xpBoxIn.style.borderBottom= "5px solid " + levelbarFromColor;
        xpBoxIn.style.borderRight= "5px solid " + levelbarFromColor;
    // Buttons
    var playBtn = document.getElementById("play-btn");
    var specBtn = document.getElementById("spectate-btn");
    var highlightedBtns = document.querySelector(".chooseBtn highlighted");
    var buttonsInput = document.getElementById("buttonsInput");
    var storedBtnsColor = localStorage.getItem("BtnsColor");
    var BtnsColor = storedBtnsColor || "black";
    buttonsInput.value = BtnsColor;
    playBtn.style.backgroundColor = BtnsColor;
    specBtn.style.backgroundColor = BtnsColor;
    buttonsInput.addEventListener("input", function() {
        var BtnsInputValue = buttonsInput.value;
        BtnsColor = BtnsInputValue || "black";
        playBtn.style.backgroundColor = BtnsColor;
        specBtn.style.backgroundColor = BtnsColor;
        localStorage.setItem("BtnsColor", BtnsColor);
    });

    // Customizer Listener
    customizer.addEventListener('click', function () {

        settings.style.display = "none";
        csettings.setAttribute("class", "chooseBtn");
        servers.style.display = "none";
        cservers.setAttribute("class", "chooseBtn");
        controls.style.display = "none";
        ccontrols.setAttribute("class", "chooseBtn");
        customizer.setAttribute("class", "chooseBtn highlighted");
        btf.style.display = "block"; btf.style.marginBottom="20px";

    });


choosepanel.appendChild(customizer);
    var fl = document.querySelectorAll(".fl"); fl.forEach(function(element) {element.remove();});
    var fr = document.querySelectorAll(".fr"); fr.forEach(function(element) {element.remove();});
    var clickEvent = new Event('click');
    customizer.dispatchEvent(clickEvent);
     var chatmsgs = document.getElementById("chat-msgs");
    var welcome = document.createElement("div");
    welcome.style.color="lime"; welcome.style.fontWeight="900"; welcome.style.marginLeft="1%";
    welcome.innerHTML = '⸻ Customizer active ⸻';
    chatmsgs.appendChild(welcome);
}
customizer();


