// ==UserScript==
// @name         BlobMod JS
// @namespace    http://tampermonkey.net/
// @version      2024-01-25
// @description  Sigmally mod
// @author       Imix
// @license MIT
// @match        https://sigmally.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sigmally.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487977/BlobMod%20JS.user.js
// @updateURL https://update.greasyfork.org/scripts/487977/BlobMod%20JS.meta.js
// ==/UserScript==

(function() {
    'use strict';


    let overlay = document.createElement("div")
    overlay.id = "overlay"
    overlay.style.position = "fixed"
    overlay.style.display = "block"
    overlay.style.width = "100%"
    overlay.style.height = "100%"
    overlay.style.top = "0"
    overlay.style.left = "0"
    overlay.style.right = "0"
    overlay.style.bottom = "0"
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"
    overlay.style.zIndex = "10000"

    let oMain = document.createElement("div")
    oMain.id = "overlay-main"
    oMain.style.position = "fixed"
    oMain.style.display = "block"
    oMain.style.width = "400px"
    oMain.style.height = "220px"
    oMain.style.top = "0"
    oMain.style.left = "0"
    oMain.style.right = "0"
    oMain.style.bottom = "0"
    oMain.style.backgroundColor = "white"
    oMain.style.zIndex = "10002"
    oMain.style.margin = "auto"
    oMain.style.borderRadius = "20px"

    let oTitle = document.createElement("h1")
    oTitle.id = "overlay-title"
    oTitle.innerHTML = "Welcome to BlobMod!"
    oTitle.style.marginLeft = "55px"
    oTitle.style.marginTop = "35px"
    oTitle.style.fontSize = "28px"

    let oUpdates = document.createElement("h1")
    oUpdates.id = "overlay-title"
    oUpdates.innerHTML = " • No recent updates to view"
    oUpdates.style.marginLeft = "100px"
    oUpdates.style.marginTop = "25px"
    oUpdates.style.fontSize = "15px"

    let oStart = document.createElement("button")
    oStart.innerHTML = "Dismiss"
    oStart.style.marginLeft = "100px"
    oStart.style.marginTop = "25px"
    oStart.style.fontSize = "15px"
    oStart.style.borderRadius = "15px"
    oStart.style.width = "200px"
    oStart.style.height = "30px"

    oStart.classList.add("blobmod-buttons-reverse")


    //document.body.append(overlay)
    overlay.append(oMain)
    oMain.append(oTitle)
    oMain.append(oUpdates)
    oMain.append(oStart)


    oStart.addEventListener("click", function() {
        overlay.style.transitionSpeed = "500ms"
        overlay.style.visibility = "hidden"
        overlay.style.opacity = "0"
        overlay.style.scale = "1.2"
        overlay.style.transition = "visibility 0s 0.3s, opacity 0.3s linear, scale 0.5s ease-in-out"
    })



    var link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = 'https://www.google.com/s2/favicons?sz=64&domain=sigmally.com';



    //keybinds

    let keybinds = {
        fastfeed: "q",
        doublesplit: "e",
        triplesplit: "r",
        sendteam: "f",
        autorespawn: "h"
    };

    let keybindsActive = {
        fastfeed: false,
        doublesplit: false,
        triplesplit: false,
        sendteam: false,
        autorespawn: false
    };

    //elements

    let playBtn = document.getElementById('play-btn')
    let sioBtn = document.getElementById('signOutBtn')
    let spectateBtn = document.getElementById('spectate-btn')
    let siiBtn = document.getElementById('signInBtn')
    let continueBtn = document.getElementById('continue_button')

    let discordLink = document.getElementById('discord_link')

    let selectors = document.getElementsByClassName('form-group__row')

    //popups or other

    let shopPopup = document.getElementById('shop-popup')
    let adsPopup = document.getElementsByClassName('text-block')
    let bottomAdPopup = document.getElementById('ad_bottom')
    let otherPopup = document.getElementById('div-gpt-ad-1622841396282-0')

    let adLeft = document.getElementsByClassName('ad-block-left')
    let adRight = document.getElementsByClassName('ad-block-right')

    //

    playBtn.style.borderRadius = '10px';
    playBtn.style.marginTop = "0px"
    playBtn.style.marginBottom = "0px"
    playBtn.style.width = "250px"
    sioBtn.style.borderRadius = '10px';
    sioBtn.style.marginTop = "7px"
    siiBtn.style.borderRadius = '-8px';
    continueBtn.style.borderRadius = '10px';
    spectateBtn.style.borderRadius = '10px';
    spectateBtn.style.marginTop = "0px"
    spectateBtn.querySelector("img").style.borderRadius = '10px';
    spectateBtn.querySelector("img").src = 'https://i.imgur.com/I0Vuaha.png';

    playBtn.classList.add("blobmod-buttons")
    sioBtn.classList.add("blobmod-buttons")
    continueBtn.classList.add("blobmod-buttons")
    siiBtn.classList.add("blobmod-buttons")
    spectateBtn.classList.add("blobmod-buttons")

    function hideElement(e) {
        e.style.display = "none"
    }

    function showElement(e) {
        e.style.display = "initial"
    }

    hideElement(otherPopup);
    hideElement(discordLink);
    //hideElement(chooseLang);

    //setInterval(function() {
        //if (autoRespawn) {
            //document.getElementById('play-btn').dispatchEvent(new Event('click'))
            //document.getElementById('continue_button').dispatchEvent(new Event('click'))
        //}
    //}, 1)

    setInterval(mainLoop, 1);
    function mainLoop() {
        hideElement(bottomAdPopup);
        hideElement(shopPopup);
        for (let i = 0; i < adsPopup.length; i++) {
            hideElement(adsPopup[i])
        }
        for (let i = 0; i < adLeft.length; i++) {
            hideElement(adLeft[i])
        }
        for (let i = 0; i < adRight.length; i++) {
            hideElement(adRight[i])
        }
        let lvlProgressFull = document.getElementsByClassName("new-meter")
        lvlProgressFull[0].style.border = "2px solid rgba(194, 194, 194, 0.8)"
        lvlProgressFull[0].querySelector("span").style.backgroundColor = "rgba(194, 194, 194, 0.8)"

        bmSettingsOverlay.getElementById("settings-sect-buttons__selected").style.backgroundColor = "rgba(255, 255, 255, 0.5)"
    }

    let imixProfile = document.createElement("div")
    imixProfile.id = "imix-profile";
    imixProfile.style.backgroundColor = "white";
    imixProfile.style.width = "300px"
    imixProfile.style.height = "110px"
    imixProfile.style.borderRadius = "15px"

    let imixProfileIn = document.createElement("div")
    imixProfileIn.id = "imix-profile___inner";

    let imixProfileHeader = document.createElement("div")
    imixProfileHeader.id = "imix-profile_h"
    imixProfileHeader.style.display = "inline"
    imixProfileHeader.style.height = "110px"
    imixProfileHeader.style.width = "300px"

    imixProfileHeader.style.float = "left"

    let imixProfileH_logo = document.createElement("div")
    imixProfileH_logo.id = "imix-profileH_logo"
    imixProfileH_logo.classList.add("imix-pH_logo")
    imixProfileH_logo.style.border = "0px solid gray"
    imixProfileH_logo.style.borderRadius = "40px"
    imixProfileH_logo.style.width = "70px"
    imixProfileH_logo.style.height = "70px"
    imixProfileH_logo.style.marginTop = "20px"
    imixProfileH_logo.style.marginLeft = "20px"
    imixProfileH_logo.style.boxShadow = "0 0px 8px 0 rgba(236, 236, 236, 0.2)"
    imixProfileH_logo.style.transitionDuration = "200ms"
    imixProfileH_logo.style.cursor = "pointer"


    imixProfileH_logo.addEventListener("mouseover", function() {
        imixProfileH_logo.style.boxShadow = "0 0px 15px 0 rgba(236, 236, 236, 0.3)"
    });

    imixProfileH_logo.addEventListener("click", function() {
        window.open("https://www.youtube.com/channel/UCZMd2PW0rYXtuQAkz-sysgg");
    });

    imixProfileH_logo.addEventListener("mouseout", function() {
        imixProfileH_logo.style.boxShadow = "0 0px 8px 0 rgba(236, 236, 236, 0.2)"
    });


    let imixProfileH_logo_src = new Image()
    imixProfileH_logo_src.src = "https://i.imgur.com/d7Zot4O.png"
    imixProfileH_logo_src.classList.add("imix-pH_logo")
    imixProfileH_logo_src.style.width = "70px";
    imixProfileH_logo_src.style.height = "70px";
    imixProfileH_logo_src.style.borderRadius = "40px"

    let imixProfileH_textTop = document.createElement("p")
    imixProfileH_textTop.id = "imix-profileH_text-top"
    imixProfileH_textTop.innerHTML = "Made by 12Imix34"
    imixProfileH_textTop.style.color = "white"
    imixProfileH_textTop.style.width = "200px"
    imixProfileH_textTop.style.height = "40px"
    imixProfileH_textTop.style.marginTop = "auto"
    imixProfileH_textTop.style.textAlign = "center"
    imixProfileH_textTop.style.fontFamily = "system-ui"
    imixProfileH_textTop.style.fontWeight = "50px"
    imixProfileH_textTop.style.fontSize = "20px"



    document.getElementById('right-menu').append(imixProfile)
    imixProfile.append(imixProfileIn)
    imixProfileIn.append(imixProfileHeader)

    let imixProfileH_logo_container = document.createElement("div");
    imixProfileH_logo_container.style.display = "flex";
    imixProfileH_logo_container.style.alignItems = "center";

    imixProfileH_logo_container.append(imixProfileH_logo);
    imixProfileH_logo.append(imixProfileH_logo_src);
    imixProfileH_logo_container.append(imixProfileH_textTop);

    imixProfileHeader.append(imixProfileH_logo_container);

    let titleClass = document.getElementById("title").closest(".menu__title");
    titleClass.style.display = "flex";
    titleClass.style.alignItems = "center";
    let bmSettings = document.createElement('button');
    bmSettings.style.border = "0px"
    bmSettings.style.height = "30px"
    bmSettings.style.width = "30px"
    bmSettings.style.borderRadius = "10px"
    bmSettings.style.marginLeft = "16px"
    bmSettings.classList.add("blobmod-buttons")
    let bmSettingsImg = document.createElement('img');
    bmSettingsImg.src = "https://cdn-icons-png.flaticon.com/512/15/15185.png"
    bmSettingsImg.style.height = "18px"
    bmSettingsImg.style.width = "18px"
    bmSettingsImg.style.margin = "auto"

    titleClass.append(bmSettings)
    bmSettings.append(bmSettingsImg)


    bmSettings.addEventListener('click', function(e) {
        showElement(bmSettingsOverlay)
        for (let i = 0; i < document.getElementsByClassName("settings-sect-buttons").length; i++) {
            document.getElementsByClassName("settings-sect-buttons")[i].style.height = "13%"
            document.getElementsByClassName("settings-sect-buttons")[i].style.width = "100%"
            document.getElementsByClassName("settings-sect-buttons")[i].style.fontSize = "15px"
            document.getElementsByClassName("settings-sect-buttons")[i].style.backgroundColor = "rgba(46, 46, 46, 1)"
            document.getElementsByClassName("settings-sect-buttons")[i].style.border = "0px"
            document.getElementsByClassName("settings-sect-buttons")[i].addEventListener('mouseenter', function() {
                document.getElementsByClassName("settings-sect-buttons")[i].style.backgroundColor = "rgba(255, 255, 255, 0.2)"
            })
            document.getElementsByClassName("settings-sect-buttons")[i].addEventListener('mouseout', function() {
                document.getElementsByClassName("settings-sect-buttons")[i].style.backgroundColor = "rgba(0, 0, 0, 0)"
            })
        }
    })








    let bmSettingsOverlay = document.createElement("div")
    bmSettingsOverlay.id = "bmS-overlay"
    bmSettingsOverlay.style.position = "fixed"
    bmSettingsOverlay.style.display = "block"
    bmSettingsOverlay.style.width = "100%"
    bmSettingsOverlay.style.height = "100%"
    bmSettingsOverlay.style.top = "0"
    bmSettingsOverlay.style.left = "0"
    bmSettingsOverlay.style.right = "0"
    bmSettingsOverlay.style.bottom = "0"
    bmSettingsOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"
    bmSettingsOverlay.style.zIndex = "10000"

    let bmSettingsMain = document.createElement("div")
    bmSettingsMain.id = "bmS-main"
    bmSettingsMain.style.position = "fixed"
    bmSettingsMain.style.display = "block"
    bmSettingsMain.style.width = "400px"
    bmSettingsMain.style.height = "600px"
    bmSettingsMain.style.top = "0"
    bmSettingsMain.style.left = "0"
    bmSettingsMain.style.right = "0"
    bmSettingsMain.style.bottom = "0"
    bmSettingsMain.style.zIndex = "10002"
    bmSettingsMain.style.margin = "auto"
    bmSettingsMain.style.borderRadius = "20px"
    bmSettingsMain.classList.add('menu-blocks')

    let bmSettingsHeader = document.createElement('div')
    bmSettingsHeader.id = 'bmS-header'
    bmSettingsHeader.style.height = "110px"
    bmSettingsHeader.style.width = "100%"

    let bmSettingsContainer = document.createElement('div')
    bmSettingsContainer.style.height = "490px"
    bmSettingsContainer.style.width = "100%"
    bmSettingsContainer.style.margin = "auto"
    bmSettingsContainer.style.padding = "20px"

    let bmSettingsSettingsCheckboxTemplate = document.createElement('input');
    bmSettingsSettingsCheckboxTemplate.type = "checkbox";
    bmSettingsSettingsCheckboxTemplate.style.height = "15px"
    bmSettingsSettingsCheckboxTemplate.style.width = "15px"
    bmSettingsSettingsCheckboxTemplate.style.border = "0px"
    bmSettingsSettingsCheckboxTemplate.style.transitionDuration = "100ms"


    let autoRespawn;
    let bmSettingsSettingsCheckbox_AUTORESPAWN = bmSettingsSettingsCheckboxTemplate.cloneNode(true)





    let bmSettingsHeaderDivider = document.createElement('div')
    bmSettingsHeaderDivider.style.height = "2px"
    bmSettingsHeaderDivider.style.width = "90%"
    bmSettingsHeaderDivider.style.backgroundColor = "white"
    bmSettingsHeaderDivider.style.margin = "auto"


    let bmSettingsTitle = document.createElement("h1")
    bmSettingsTitle.id = "bmS-title"
    bmSettingsTitle.style.marginTop = "0px"
    bmSettingsTitle.style.margin = "auto"
    bmSettingsTitle.style.textAlign = "center"
    bmSettingsTitle.innerHTML = "BlobMod Settings"
    bmSettingsTitle.style.padding = "30px"
    bmSettingsTitle.style.fontSize = "28px"


    document.body.append(bmSettingsOverlay)
    hideElement(bmSettingsOverlay)
    bmSettingsOverlay.append(bmSettingsMain)
    bmSettingsMain.append(bmSettingsHeader)
    bmSettingsHeader.append(bmSettingsTitle)
    bmSettingsHeader.append(bmSettingsHeaderDivider)

    bmSettingsMain.append(bmSettingsContainer)
    //bmSettingsContainer.append(bmSettingsSettingsCheckbox_AUTORESPAWN)











    let titleText = document.getElementById("title")
    titleText.innerHTML = "Sigmally (BlobMod)"
    titleText.style.color = "white"
    titleText.style.fontSize = "25px"

    let nickname = document.getElementById("nick")
    nickname.style.borderRadius = "10px"
    nickname.maxLength = "10000"
    nickname.style.width = "185px"
    let gameServer = document.getElementById("gamemode")
    gameServer.style.borderRadius = "10px"


    let nameGen = document.createElement("div")
    nameGen.id = "namegen"
    nameGen.style.width = "185px"
    nameGen.style.height = "33px"


    let nameGenSelect = document.createElement("input")
    nameGenSelect.id = "namegen-select"
    nameGenSelect.style.borderRadius = "10px"
    nameGenSelect.maxLength = "10000"
    nameGenSelect.style.width = "147px"
    nameGenSelect.style.height = "33px"
    nameGenSelect.style.outline = "none"
    nameGenSelect.style.padding = "12px"
    nameGenSelect.readOnly = "true"

    let nameGenStart = document.createElement("button")
    nameGenStart.id = "namegen-start"
    nameGenStart.style.borderRadius = "10px"
    nameGenStart.style.marginLeft = "5px"
    nameGenStart.style.width = "33px"
    nameGenStart.style.height = "33px"
    nameGenStart.style.outline = "none"
    nameGenStart.style.border = "0px"
    let nameGenStartImg = document.createElement("img")
    nameGenStartImg.src = "https://cdn-icons-png.flaticon.com/512/32/32339.png"
    nameGenStartImg.style.width = "18px"
    nameGenStartImg.style.height = "18px"
    nameGenStartImg.style.margin = "auto"
    nameGenStartImg.style.verticalAlign = "center"



    nameGenStart.addEventListener('click', function() {

        nameGenSelect.value = generateName()
    })


    function generateName() {
        let val = '';
        let length = Math.round(Math.random() * 4) + 4

        for (let i = 0; i < length; i++) {
            let font;
            let fontNumber = Math.round(Math.random() * 3) + 1
            switch (fontNumber) {
                case 1:
                    font = font1list;
                    break;
                case 2:
                    font = font2list;
                    break;
                case 3:
                    font = font3list;
                    break;
                case 4:
                    font = font4list;
                    break;
                default:
                    font = font1list;
            }
            let letter = Math.round(Math.random() * 24) + 1
            //console.log(fontNumber + ", " + letter + ", " + font[letter])
            val = val + encodeURIComponent(font[letter])
        }
        return decodeURIComponent(val);
    }


    //let font1 = "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫"
    let font1 = "₳฿₵ĐɆ₣₲ⱧłJ₭Ⱡ₥₦Ø₱QⱤ₴₮ɄV₩ӾɎⱫ"
    //let font3 = "𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟"
    let font2 = "ᗩᗷᑕᗪᗴᖴǤᕼIᒎᛕᒪᗰᑎᗝᑭɊᖇᔕ丅ᑌᐯᗯ᙭Ƴ乙"
    let font3 = "卂乃匚ᗪ乇千Ꮆ卄丨ﾌҜㄥ爪几ㄖ卩Ҩ尺丂ㄒㄩᐯ山乂ㄚ乙"
    let font4 = "αႦƈԃҽϝɠԋιʝƙʅɱɳσρϙɾʂƚυʋɯxყȥ"

    //let font1list = font1.split('')
    let font1list = font1.split('')
    //let font3list = font3.split('')
    let font2list = font2.split('')
    let font3list = font3.split('')
    let font4list = font4.split('')



    nickname.classList.add("blobmod-buttons")
    gameServer.classList.add("blobmod-buttons")
    nameGenSelect.classList.add("blobmod-buttons")
    nameGenStart.classList.add("blobmod-buttons")

    let updates = document.getElementById("updates-button")
    updates.style.color = "white"
    updates.classList.add("blobmod-textButtons")

    let clansSettings = document.getElementById("clans_and_settings")
    clansSettings.style.color = "white"
    clansSettings.classList.add("blobmod-textButtons")

    let settings = clansSettings.querySelectorAll('button')[1]
    settings.querySelector("svg").querySelector("path").style.fill = "white"
    settings.classList.add("blobmod-textButtons")


    let menu = document.getElementById("menu")
    //menu.querySelector('div').querySelectorAll('div')[4].querySelector('div').querySelectorAll('div')[1].querySelectorAll('div')[0].append(gameServer)
    menu.querySelector('div').querySelectorAll('div')[4].querySelector('div').querySelectorAll('div')[1].insertBefore(gameServer, siiBtn)
    menu.querySelector('div').querySelectorAll('div')[4].querySelector('div').querySelectorAll('div')[1].querySelectorAll('div')[0].querySelector('div').querySelectorAll('div')[9].append(nameGen)
    nameGen.append(nameGenSelect)
    nameGen.append(nameGenStart)
    nameGenStart.append(nameGenStartImg)
    gameServer.style.marginTop = "7px"
    //menu.style.height = "370px"
    let leftMenu = document.getElementById("left-menu")
    let topUsers = document.getElementsByClassName("top-users__inner")[0]
    let deathMenu = document.getElementsByClassName("menu--stats-mode")[0]
    deathMenu.style.borderRadius = "15px"
    deathMenu.style.height = "235px"
    deathMenu.querySelector('div').querySelector('div').querySelector('h1').style.color = "white"
    let deathMenuTexts = deathMenu.querySelector('div').querySelectorAll('div')[1].querySelectorAll('span')
    for (let i = 0; i < deathMenuTexts.length; i++) {
        deathMenuTexts[i].style.color = "white"
    }
    hideElement(deathMenu.getElementsByClassName("stats-btn__row")[0])


    let adBlock = document.getElementsByClassName("ad-block")[0]
    hideElement(adBlock)
    deathMenu.classList.add("menu-blocks")
    menu.classList.add("menu-blocks")
    leftMenu.classList.add("menu-blocks")
    topUsers.classList.add("menu-blocks")
    imixProfile.classList.add("menu-blocks")

    let chooseLang = menu.getElementsByClassName("ch-lang")
    for (let i = 0; i < chooseLang.length; i++) {
        chooseLang[i].style.display = "none"
    }


    let profileHeader = document.getElementsByClassName("profile-header")[0]
    profileHeader.getElementsByClassName("profile-name")[0].style.color = "white"
    profileHeader.classList.add("menu-blocks")
    let xpBoosts = profileHeader.querySelectorAll("div")[3].querySelector('button')
    xpBoosts.style.backgroundColor = "rgba(46, 46, 46, 1)"

    let profheaderDivs = profileHeader.querySelectorAll('div')
    for (let i = 0; i < profheaderDivs.length; i++) {
        profheaderDivs[i].style.color = "white"
    }

    topUsers.style.color = "white"


    let settingsMenuContainer = document.getElementById("cm_modal__settings").querySelector("div")
    let settingsMenu = settingsMenuContainer.querySelector("div")
    settingsMenu.classList.add("menu-blocks")
    let settingsMenuExit = document.getElementById("cm_modal__settings").querySelector("div").querySelector("div").querySelector("button").querySelector("svg").querySelector("path")
    settingsMenuExit.style.stroke = "#ffffff"



    function keypress(key, keycode) {
        const keyDownEvent = new KeyboardEvent("keydown", { key: key, code: keycode });
        const keyUpEvent = new KeyboardEvent("keyup", { key: key, code: keycode });

        window.dispatchEvent(keyDownEvent);
        window.dispatchEvent(keyUpEvent);
    }

    document.addEventListener('keydown', function(e) {
        const key = e.key.toLowerCase();
        for (const property in keybinds) {
            if (key == keybinds[property]) {
                if (keybindsActive[property] == false) {
                    keybindsActive[property] = true
                    if (property == "fastfeed") {
                        fastFeed(keybindsActive, property)
                    }
                    else if (property == "doublesplit") {
                        keypress(" ", "Space");
                        keypress(" ", "Space");
                    }
                    else if (property == "triplesplit") {
                        keypress(" ", "Space");
                        keypress(" ", "Space");
                        keypress(" ", "Space");
                    }
                    else if (property == "sendteam") {
                        document.getElementById("chat_textbox").value = "team"
                        keypress("Enter", "Enter");
                        keypress("Enter", "Enter");
                    }
                    else if (property == "autorespawn") {
                        autoRespawn = !autoRespawn;
                        console.log(autoRespawn)
                    }
                }
            }
        }
    });

    function fastFeed(values, property) {
        const intervalId = setInterval(() => {
            if (values[property] == true) { keypress("w", "KeyW"); } else { clearInterval(intervalId); }
        }, 10);
    }

    document.addEventListener('keyup', function(e) {
        const key = e.key.toLowerCase();
        for (const property in keybinds) {
            if (key == keybinds[property]) {
                keybindsActive[property] = false
                console.log(keybindsActive)
            }
        }
    });

    function getIndexByName(obj, key) {
        const keys = Object.keys(obj);
        return keys.indexOf(key);
    }


    let freeChestsBtn = document.getElementById("free-chest-button")
    freeChestsBtn.style.borderRadius = '10px';
    freeChestsBtn.classList.add("blobmod-buttons")

    let collectBtn = document.getElementById("collect-button")
    collectBtn.style.borderRadius = '10px';
    collectBtn.style.boxShadow = "0 0px 5px 0 rgba(0, 0, 0, 0.5)"
    collectBtn.style.backgroundColor = "white"
    collectBtn.style.color = "black"
    collectBtn.style.border = "0px"

    let shopBtn = document.getElementById("shop-button")
    shopBtn.style.borderRadius = '10px';
    shopBtn.classList.add("blobmod-buttons")

    let sigmaBtn = document.getElementById("sigma-button")
    sigmaBtn.style.borderRadius = '10px';
    sigmaBtn.classList.add("blobmod-buttons")


    //


    let menuBlocks = document.getElementsByClassName("menu-blocks")
    for (let i = 0; i < menuBlocks.length; i++) {
        menuBlocks[i].style.backgroundColor = "rgba(46, 46, 46, 1)"
        menuBlocks[i].style.color = "white"
    }

    let blobmodBtns = document.getElementsByClassName("blobmod-buttons")
    for (let i = 0; i < blobmodBtns.length; i++) {
        blobmodBtns[i].style.boxShadow = "0 0px 5px 0 rgba(0, 0, 0, 0.5)"
        blobmodBtns[i].style.verticalAlign = "middle"
        blobmodBtns[i].style.backgroundColor = "white"
        blobmodBtns[i].style.color = "black"
        blobmodBtns[i].style.border = "0px"
        blobmodBtns[i].addEventListener("mouseover", function() {
            blobmodBtns[i].style.boxShadow = "0 0px 10px 0 rgba(255, 255, 255, 0.2)"
            blobmodBtns[i].style.transitionDuration = "150ms"
        });
        blobmodBtns[i].addEventListener("mouseout", function() {
            blobmodBtns[i].style.boxShadow = "0 0px 5px 0 rgba(0, 0, 0, 0.5)"
            blobmodBtns[i].style.transitionDuration = "150ms"
        });
    }

    let blobmodBtnsRev = document.getElementsByClassName("blobmod-buttons-reverse")
    for (let i = 0; i < blobmodBtnsRev.length; i++) {
        blobmodBtnsRev[i].style.boxShadow = "0 0px 5px 0 rgba(0, 0, 0, 0.5)"
        blobmodBtnsRev[i].style.verticalAlign = "middle"
        blobmodBtnsRev[i].style.backgroundColor = "rgba(46, 46, 46, 1)"
        blobmodBtnsRev[i].style.color = "white"
        blobmodBtnsRev[i].style.border = "0px"
        blobmodBtnsRev[i].addEventListener("mouseover", function() {
            blobmodBtnsRev[i].style.boxShadow = "0 0px 10px 0 rgba(0, 0, 0, 0.8)"
            blobmodBtnsRev[i].style.transitionDuration = "150ms"
        });
        blobmodBtnsRev[i].addEventListener("mouseout", function() {
            blobmodBtnsRev[i].style.boxShadow = "0 0px 5px 0 rgba(0, 0, 0, 0.5)"
            blobmodBtnsRev[i].style.transitionDuration = "150ms"
        });
    }
})();