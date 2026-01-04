// ==UserScript==
// @name         CzMod
// @namespace    http://tampermonkey.net/
// @version      0.1.5.1
// @description  CzMod by Cursed with Many Features! (Outdated, laggy)
// @author       Cursed
// @match        *sigmally.com/
// @icon         https://i.ibb.co/stMSFvd/Cz-Mod-Logo.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459962/CzMod.user.js
// @updateURL https://update.greasyfork.org/scripts/459962/CzMod.meta.js
// ==/UserScript==

(function(){
    'use strict'
    let link = document.querySelector("link[rel*='icon']") || document.createElement("link");
    link.type = "image/x-icon";
    link.rel = "shortcut icon";
    link.href = "https://i.ibb.co/zS3Qty7/sigLogo.png";
    document.getElementsByTagName("head")[0].appendChild(link);

    //check version
    let ModVersion = "0.1.5";

    fetch("https://raw.githubusercontent.com/Sigmally/CzMod/main/version.txt")
        .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error, status = " + response.status);
        }
        return response.text();
    })
        .then(version => {
        version = version.trim();
        if (version !== ModVersion) {
            console.log("New version available: ", version, " please update the mod.");
            let update = document.createElement('div');
            update.style = 'z-index: 99999; position: absolute; top: -5%; left: 50%; transform: translate(-50%, -50%); display: flex; justify-content: center; align-items: center; flex-direction: column; background: #333; color: #ddd; padding: 10px 15px; border-radius: 15px; transition: .3s;';
            update.innerHTML = `<span style="text-align: center;">New CzMod Version available, please update.</span> <div>
            <button class="ub">update</button>
            <button class="ub">close</button></div>
            `;
            let ub = update.querySelectorAll('.ub');
            if(ub){
                for (let i = 0; i < ub.length; i++) {
                    ub[i].style = 'background: #222; padding: 5px 10px; border-radius: 10px; border: none; margin: 10px 5px 0 5px;';
                }
            }
            setTimeout(()=>{
                update.style.top = '5%';
            },500)

            ub[0].addEventListener('click', () => {
                window.open('https://greasyfork.org/scripts/459962-czmod/', '_blank');
                update.style.top = '-5%';
                setTimeout(()=> {
                    update.remove();
                },300)
            })
            ub[1].addEventListener('click', () => {
                update.style.top = '-5%';
                setTimeout(()=> {
                    update.remove();
                },300)
            })

            document.body.appendChild(update)
        } else {
            console.log("No update for CzMod available");
        }
    })
        .catch(error => {
        console.error("Error retrieving version information:", error);
    });

    //Style
    fetch("https://raw.githubusercontent.com/Sigmally/CzMod/main/CzStyle.css")
        .then((response) => response.text())
        .then((cssText) => {
        const styleElement = document.createElement("style");
        styleElement.type = "text/css";
        styleElement.appendChild(document.createTextNode(cssText));
        document.head.appendChild(styleElement);
    })
        .catch((error) => {
        console.error("Failed to load CSS: ", error);
    });

    setTimeout(() => {
        let CzSettings = localStorage.getItem("CzSettings");

        if (!CzSettings) {
            CzSettings = {
                keybindings: {
                    macros: "q",
                    ds: "f",
                    ts: "t",
                    qs: "r",
                    tm: "v",
                    r: "x",
                },
                oldMacros: false,
            };
        } else {
            CzSettings = JSON.parse(CzSettings);
        }

        if (localStorage.getItem("reloaded") === "success") {
            setTimeout(() => {
                RespawnedMessage();
                let playBtn = document.getElementById("play-btn");
                setTimeout(() => {
                    playBtn.click();
                }, 500);
            }, 1000);
            localStorage.removeItem("reloaded");
        }

        let modMenu = document.createElement("div");
        modMenu.classList.add("modMenuOverlay");
        modMenu.innerHTML = `
    <button class="button open-btn" id="open">Open</button>
    `;

        let menu = document.createElement("div");
        menu.style = "display: none; opacity: 0;";
        menu.id = "Modmenu";
        menu.innerHTML = `
  <div class="border-div"></div>
<div class="top-menu">
                <img src="https://i.ibb.co/stMSFvd/Cz-Mod-Logo.png" class="Logo" draggable="false">
                <button class="button close-btn" id="closeMenuBtn">X</button>
                <h1 class="title">Cz Mod</h1>
            </div>
            <div class="Modmenu__inner">
                <div class="options">
                    <button id="KeyBindingsButton" class="OptionsButton">Key Bindings</button>
                    <button id="reduceLagsButton" class="OptionsButton">Reduce lags</button>
                    <button id="StylishNameButton" class="OptionsButton">Stylish Name</button>
                    <button id="funOptionsButton" class="OptionsButton">Fun options</button> <!--Rainbow background, change ingame background color, bot....-->
                    <button id="othersButton" class="OptionsButton">Other options</button> <!--Youtube, discord, credits...-->
                </div>
                <hr style="width: 95%; color: #BDBDBD;">
                <div class="MenuOptions">
                    <div class="ChangeOpacity">
                        <label class="MO_label">Mod Menu Opacity:</label>
                        <input type="range" min="15" max="100" value="100" id="menuOpacity" class="slider">
                        <label class="MO_label">button Opacity:</label>
                        <input type="range" min="15" max="100" value="100" id="buttonOpacity" class="slider">
                    </div>
                    <div class="ChangeMenuColor">
                        <div class="centerItem">
                            <span style="text-align: center; margin-top: 2px;">Sigmally Menu Theme:</span>
                            <div class="DarkWhiteTheme">
                                <button class="night" id="nightBtn"></button>
                                <button class="light" id="lightBtn"></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ExtraBtns">
                    <p>-Cz Mod by Cursed-</p>
                    <button class="SocialMedia-Btn" id="socialMediaButton">Social Media</button>
                    <button class="Info-Btn" id="infoButton">Info</button>
                </div>
                <div class="Option-tab" id="keybinds-tab">
                    <button class="backBtn" id="KBTBACK-button"><img src="https://i.ibb.co/1sJxQXn/backIcon.png"><span>back</span></button>
                    <h2>Key Bindings</h2>
                    <div class="keybindings__inner">
                            <div class="KeyBindingsOption">
                                <span class="span__description">Enable Keybindings</span>
                                <div class="checkbox-wrapper-8">
                                    <input class="tgl tgl-skewed" id="enableKeyBindings" type="checkbox" checked />
                                    <label class="tgl-btn" data-tg-off="OFF" data-tg-on="ON" for="enableKeyBindings"></label>
                                </div>
                            </div>
                            <div class="KeyBindingsOption">
                                <span class="span__description">no feed delay</span>
                                <div class="checkbox-wrapper-8">
                                    <input class="tgl tgl-skewed" id="oldMacros" type="checkbox" checked />
                                    <label class="tgl-btn" data-tg-off="OFF" data-tg-on="ON" for="oldMacros"></label>
                                </div>
                            </div>
                            <div class="KeyBindingsOption">
                                <span class="span__description">Macros / fast feed</span>
                                <div style="display:flex; justify-content: center; align-items: center;">
                                   <input type="text" class="keybinding" value="${CzSettings.keybindings.macros}" id="fastFeedInput" maxlength="1" onfocus="this.select()">
                                   <button class="install-Bot-Btn" onclick="window.open('https://www.youtube.com/watch?v=J8dJ8jZ4Cx0', '_blank')" style="width: 100px; margin-left: 5px">AHK macros</button>
                                </div>
                            </div>
                            <div class="KeyBindingsOption">
                                <span class="span__description">double split</span>
                                <input type="text" class="keybinding" value="${CzSettings.keybindings.ds}" id="doubleSplit" maxlength="1" onfocus="this.select()">
                            </div>
                            <div class="KeyBindingsOption">
                                <span class="span__description">triple split</span>
                                <input type="text" class="keybinding" value="${CzSettings.keybindings.ts}" maxlength="1" onfocus="this.select()" id="tripleSplit">
                            </div>
                            <div class="KeyBindingsOption">
                                <span class="span__description">quad split</span>
                                <input type="text" class="keybinding" value="${CzSettings.keybindings.qs}" maxlength="1" onfocus="this.select()" id="quadSplit">
                            </div>
                            <div class="KeyBindingsOption">
                                <span class="span__description">open / close menu</span>
                                <input type="text" class="keybinding" value="${CzSettings.keybindings.tm}" maxlength="1" onfocus="this.select()" id="toggleMenuKB">
                            </div>
                            <div class="KeyBindingsOption">
                                <span class="span__description">simple Respawn</span>
                                <input type="text" class="keybinding" value="${CzSettings.keybindings.r}" maxlength="1" onfocus="this.select()" id="respawnKB">
                            </div>
                    </div>
                </div>
                <div class="Option-tab" id="reduceLags-tab">
                    <button class="backBtn" id="RLTBACK-button"><img src="https://i.ibb.co/1sJxQXn/backIcon.png"><span>back</span></button>
                    <h2>reduce lags</h2>
                    <div class="RLT__inner">
                        <div class="reduceLagsOption">
                            <span class="span__description">Turn off all Skins</span>
                            <div class="checkbox-wrapper-8">
                               <input class="tgl tgl-skewed" id="showSkins" type="checkbox" />
                               <label class="tgl-btn" data-tg-off="OFF" data-tg-on="ON" for="showSkins"></label>
                            </div>
                        </div>
                        <div class="reduceLagsOption">
                            <span class="span__description">Turn off all Names</span>
                            <div class="checkbox-wrapper-8">
                               <input class="tgl tgl-skewed" id="showNames" type="checkbox" />
                               <label class="tgl-btn" data-tg-off="OFF" data-tg-on="ON" for="showNames"></label>
                            </div>
                        </div>
                        <div class="reduceLagsOption">
                            <span class="span__description">Hide irrelevant menus</span>
                            <div class="checkbox-wrapper-8">
                               <input class="tgl tgl-skewed" id="HideRightAndLeftMenusBtn" type="checkbox" />
                               <label class="tgl-btn" data-tg-off="OFF" data-tg-on="ON" for="HideRightAndLeftMenusBtn"></label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="Option-tab" id="stylishName-tab">
                    <button class="backBtn" id="SNTBACK-button"><img src="https://i.ibb.co/1sJxQXn/backIcon.png"><span>back</span></button>
                    <h2>Stylish name</h2>
                    <div class="SNT__inner">
                        <span style="margin-top: 30px;">Stylish Name Websites:</span>
                        <div class="spanText">
                            <a href="https://www.stylishnamemaker.com" target="_blank" class="Btn"><input type="button" value="Stylishnamemaker" class="divBtn"/></a>
                            <a href="https://nickfinder.com" target="_blank" class="Btn"><input type="button" value="Nickfinder" class="divBtn"/></a>
                        </div>
                        <div class="FunOption" style="margin-top: 10px">
                          <span class="span__description">confirm delete name</span>
                          <div class="checkbox-wrapper-8">
                             <input class="tgl tgl-skewed" id="confirmActive" type="checkbox" checked />
                             <label class="tgl-btn" data-tg-off="OFF" data-tg-on="ON" for="confirmActive"></label>
                          </div>
                        </div>
                        <span class="spanText">Saved Names:</span>
                        <div class="savedNames-container">
                           <div class="saveNamesInputs">
                               <input placeholder="Name" id="saveNameI">
                               <button class="install-Bot-Btn" id="saveNameB" style="background: #222; margin-left: 10px;">Add</button>
                           </div>
                           <div id="savedNames"></div>
                        </div>
                    </div>
                </div>
                <div class="Option-tab" id="funOptions-tab">
                    <button class="backBtn" id="FOTBACK-button"><img src="https://i.ibb.co/1sJxQXn/backIcon.png"><span>back</span></button>
                    <h2>fun Options</h2>
                    <div class="FOT__inner">
                        <div class="FunOption">
                            <span class="span__description">rainbow menu background</span>
                            <div class="checkbox-wrapper-8">
                               <input class="tgl tgl-skewed" id="rainbowMenu" type="checkbox" />
                               <label class="tgl-btn" data-tg-off="OFF" data-tg-on="ON" for="rainbowMenu"></label>
                            </div>
                        </div>
                        <div class="FunOption">
                            <span class="span__description">flashing background (game)</span>
                            <div class="checkbox-wrapper-8">
                               <input class="tgl tgl-skewed" id="flashBGCB" type="checkbox" />
                               <label class="tgl-btn" data-tg-off="OFF" data-tg-on="ON" for="flashBGCB"></label>
                            </div>
                        </div>
                        <div class="FunOption">
                            <span class="span__description">fake unlock random coin skin</span>
                            <input type="button" class="install-Bot-Btn" id="randomSkin" value="random Skin">
                        </div>
                        <div class="FunOption">
                            <span class="span__description">Custom skin</span>
                           <div class="SkinOption" style="text-align: center; display:flex;justify-content:center;align-items:center; flex-direction:column;">
                            <div style="margin: 5px; 0px">
                               <input placeholder="image URL" id="skinURL" class="inputSkinText">
                               <button class="install-Bot-Btn" style="width: 75px" id="chooseURL">Choose</button>
                            </div>
                            <div style="margin: 5px; 0px">
                               <label for="skinFile" id="skinFileLabel" style="font-weight: 500; cursor: pointer;">Choose Skin image</label>
                               <input type="file" id="skinFile" style="display: none;">
                            </div>
                           </div>
                        </div>
                    </div>
                </div>
                <div class="Option-tab scrollable" id="otherOptions-tab">
                    <button class="backBtn" id="OOTBACK-button"><img src="https://i.ibb.co/1sJxQXn/backIcon.png"><span>back</span></button>
                    <h2>other Options</h2>
                    <div class="scrollDiv">
                        <div class="OOT__inner">
                            <div class="otherOption">
                                <span class="span__description">Feedback / Suggestion</span>
                                <div class="FeedbackDandG">
                                    <input class="btn-Choose" type="button" value="Gmail" onclick="window.open('https://mail.google.com/mail/u/0/?view=cm&fs=1&to=czmod.czrsd@gmail.com&su=Feedback%20or%20Suggestion%20for%20CzMod', '_blank')">
                                    <input class="btn-Choose" type="button" value="Discord" onclick="window.open('https://discord.gg/gHmhpCaPfP', '_blank')">
                                </div>
                            </div>
                            <div class="otherOption">
                                <span class="span__description">Custom main Menu Colors</span>
                                <div class="Colors">
                                    <div class="alignCenter">
                                        <span>Menu:</span>
                                        <input type="color" value="#ffffff" class="changeColor" id="ColorPicker1">
                                    </div>
                                    <div class="alignCenter">
                                        <span>text:</span>
                                        <input type="color" value="#ffffff" class="changeColor" id="ColorPicker2">
                                    </div>
                                </div>
                            </div>
                            <div class="otherOption">
                                <span class="span__description">Sigmally Bot (temporary)</span>
                                <button class="install-Bot-Btn" style="font-size: 18px;" id="install-bot">install</button>
                            </div>
                            <div class="otherOption">
                                <span class="span__description">Hide Open Button</span>
                                <button class="install-Bot-Btn" style="font-size: 18px;" id="HideOpenBtn">Hide</button>
                            </div>
                            <div class="otherOption autoRespawn">
                                <span class="span__description">Auto Respawn</span>
                                <div class="alignCenter">
                                    <div class="checkbox-wrapper-8 alignCenter">
                                       <input class="tgl tgl-skewed" id="autoRespawn" type="checkbox" />
                                       <label class="tgl-btn" data-tg-off="OFF" data-tg-on="ON" for="autoRespawn"></label>
                                    </div>
                                    <input type="number" id="ARspeed" class="numberInput" value="1000" placeholder="Speed(ms)">
                                </div>
                            </div>
                            <div class="otherOption">
                                <span class="span__description">Delete Skin</span>
                                <div class="alignCenter">
                                    <input type="text" class="inputSkinText" placeholder="Skin Id" id="skinIdInput">
                                    <input type="text" class="inputSkinText" placeholder="category(Free, Premium, Level)" id="skinCategoryInput">
                                    <input type="button" class="install-Bot-Btn" id="DelSkinBtn" value="Delete">
                                </div>
                            </div>
                            <div class="otherOption">
                                <span class="span__description">Skin Ids</span>
                                <button class="install-Bot-Btn" style="font-size: 18px;" id="skinsButton">Skins</button>
                            </div>
                            <div class="otherOption">
                                <span class="span__description">Remove Ads</span>
                                <div class="checkbox-wrapper-8">
                                   <input class="tgl tgl-skewed" id="removeAdsCb" type="checkbox" checked />
                                   <label class="tgl-btn" data-tg-off="OFF" data-tg-on="ON" for="removeAdsCb"></label>
                                </div>
                            </div>
                            <div class="otherOption">
                                <span class="span__description">Long nickname</span>
                                <div class="checkbox-wrapper-8 alignCenter">
                                   <input class="tgl tgl-skewed" id="longNickname" type="checkbox" checked/>
                                   <label class="tgl-btn" data-tg-off="OFF" data-tg-on="ON" for="longNickname"></label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="Option-tab" id="SocialMedia-tab">
                    <button class="backBtn" id="SMTBACK-button"><img src="https://i.ibb.co/1sJxQXn/backIcon.png"><span>back</span></button>
                    <h2>Social Media</h2>
                    <div class="OOT__inner">
                        <div class="otherOption">
                            <span class="span__description">Youtube</span>
                            <div class="YoutubeChannels">
                                <input class="btn-Choose" type="button" value="Cursed" onclick="window.open('https://www.youtube.com/@cursed9645', '_blank')">
                                <input class="btn-Choose" type="button" value="Sigmally Mods" onclick="window.open('https://www.youtube.com/@sigmallymod', '_blank')">
                            </div>
                        </div>
                        <div class="otherOption">
                            <span class="span__description">Discord | cursd#0126</span>
                            <div class="Discord">
                                <input class="btn-Choose" type="button" value="Join Server" onclick="window.open('https://discord.gg/gHmhpCaPfP', '_blank')">
                            </div>
                        </div>
                        <div class="otherOption">
                            <span class="span__description">GitHub</span>
                            <div class="Discord">
                                <input class="btn-Choose" type="button" value="view" onclick="window.open('https://github.com/Sigmally', '_blank')">
                            </div>
                        </div>
                        <span class="span__description" style="margin-top: 50px;">Cz Mod</span>
                    </div>
                </div>
                <div class="Option-tab" id="Info-tab">
                    <button class="backBtn" id="ITB-button"><img src="https://i.ibb.co/1sJxQXn/backIcon.png"><span>back</span></button>
                    <h2>Info about Cz Mod</h2>
                    <div class="OOT__inner">
                        <div class="otherOption">
                            <span class="span__description">Version: 0.1.3 [BETA]</span>
                        </div>
                        <div class="otherOption">
                            <span class="span__description"><a onclick="alert('Youtube video come out soon!')" style="text-decoration: none; color: #7878cf; cursor: pointer;">how to use CzMod</a></span>
                        </div>
                        <div class="otherOption">
                            <span class="span__description">Creator: Cursed</span>
                        </div>
                        <div class="otherOption">
                            <span class="span__description">Published Beta: 01/02/2023</span>
                        </div>
                        <div class="otherOption">
                            <input class="btn-Choose" type="button" value="change log" onclick="window.open('https://github.com/Sigmally/CzMod/blob/main/Change_log', '_blank')">
                        </div>
                        <div class="otherOption">
                            <span class="span__description" style="text-align: center;">Credits: Ultra, Ringzer0; Insperation from Ringzer0's sigmally Mod</span>
                        </div>
                    </div>
                </div>
                <div class="Option-tab" id="skins-tab">
                    <button class="backBtn" id="STBACK-button"><img src="https://i.ibb.co/1sJxQXn/backIcon.png"><span>back</span></button>
                    <h2>Skins</h2>
                    <div class="scrollDiv">
                        <div class="OOT__inner">
                            <div id="skin-sections">
                                <div class="skin-section" id="free-skins">
                                    <span>coming soon</span>
                                </div>
                                <div class="skin-section" id="premium-skins"></div>
                                <div class="skin-section" id="level-skins"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    `;
        modMenu.appendChild(menu);
        document.body.prepend(modMenu);

        window.CzTimeouts = [];
        const amount = 10;

        let macro_input = document.getElementById("fastFeedInput");
        macro_input.addEventListener("input", () => {
            CzSettings.keybindings.macros = macro_input.value;
            localStorage.setItem("CzSettings", JSON.stringify(CzSettings));
        });

        let doubleSplit = document.getElementById("doubleSplit");
        doubleSplit.addEventListener("input", () => {
            CzSettings.keybindings.ds = doubleSplit.value;
            localStorage.setItem("CzSettings", JSON.stringify(CzSettings));
        });
        let tripleSplit = document.getElementById("tripleSplit");
        tripleSplit.addEventListener("input", () => {
            CzSettings.keybindings.ts = tripleSplit.value;
            localStorage.setItem("CzSettings", JSON.stringify(CzSettings));
        });
        let quadSplit = document.getElementById("quadSplit");
        quadSplit.addEventListener("input", () => {
            CzSettings.keybindings.qs = quadSplit.value;
            localStorage.setItem("CzSettings", JSON.stringify(CzSettings));
        });
        let tglm = document.getElementById("toggleMenuKB");
        tglm.addEventListener("input", () => {
            CzSettings.keybindings.tm = tglm.value;
            localStorage.setItem("CzSettings", JSON.stringify(CzSettings));
        });
        let resp = document.getElementById("respawnKB");
        resp.addEventListener("input", () => {
            CzSettings.keybindings.r = resp.value;
            localStorage.setItem("CzSettings", JSON.stringify(CzSettings));
        });

        let oldMacro = document.getElementById('oldMacros');
        oldMacro.addEventListener('change', () => {
            CzSettings.oldMacros = oldMacro.checked;
            localStorage.setItem('CzSettings', JSON.stringify(CzSettings));
        });

        let CzMacros;
        let i_s = false;

        const feed = {
            key: "w",
            keyCode: 32,
            which: 32,
            bubbles: true,
        };

        const split = {
            keyCode: 32,
            code: "Space",
            cancelable: true,
            composed: true,
            isTrusted: true,
            which: 32,
        };

        window.addEventListener("keyup", (e) => {
            if (e.key === CzSettings.keybindings.macros) {
                if (i_s) {
                    i_s = false;
                    clearInterval(CzMacros);
                }
            }
        });

        window.addEventListener("keydown", (e) => {
            let e_dcb = document.getElementById("enableKeyBindings");
            let en = true;
            let inputs = document.querySelectorAll("input");
            inputs.forEach((input) => {
                input.addEventListener("input", () => {
                    en = false;
                });
            });
            if (!en || document.activeElement.nodeName === "INPUT") {
                return;
            }
            if (e_dcb) {
                if (e_dcb.checked) {
                    en = true;
                    if (e.key === CzSettings.keybindings.tm) {
                        toggleMenu();
                    }
                    if (e.key === CzSettings.keybindings.r) {
                        location.reload();
                        localStorage.setItem("reloaded", "success");
                    }
                    if (e.key === CzSettings.keybindings.macros) {
                        if(oldMacros == false){
                            if (!i_s) {
                                i_s = true;
                                CzMacros = setInterval(function() {
                                    let event = new KeyboardEvent("keydown", feed);
                                    document.dispatchEvent(event);
                                    event = new KeyboardEvent("keyup", feed);
                                    document.dispatchEvent(event);
                                }, 70);
                            }
                        } else{
                            window.dispatchEvent(new KeyboardEvent('keydown', feed));
                            window.dispatchEvent(new KeyboardEvent('keyup', feed));
                            window.dispatchEvent(new KeyboardEvent('keydown', feed));
                            window.dispatchEvent(new KeyboardEvent('keyup', feed));
                            window.dispatchEvent(new KeyboardEvent('keydown', feed));
                            window.dispatchEvent(new KeyboardEvent('keyup', feed));
                            window.dispatchEvent(new KeyboardEvent('keydown', feed));
                            window.dispatchEvent(new KeyboardEvent('keyup', feed));
                            window.dispatchEvent(new KeyboardEvent('keydown', feed));
                            window.dispatchEvent(new KeyboardEvent('keyup', feed));
                            for (var i = 0; i < amount; ++i) {
                                CzTimeouts.push(setTimeout(function() {
                                    window.dispatchEvent(new KeyboardEvent('keydown', feed));
                                    window.dispatchEvent(new KeyboardEvent('keyup', feed));
                                    window.dispatchEvent(new KeyboardEvent('keydown', feed));
                                    window.dispatchEvent(new KeyboardEvent('keyup', feed));
                                    window.dispatchEvent(new KeyboardEvent('keydown', feed));
                                    window.dispatchEvent(new KeyboardEvent('keyup', feed));
                                }, i ));
                            }

                            return;
                        }
                    }

                    if (e.key == CzSettings.keybindings.ds) {
                        window.dispatchEvent(new KeyboardEvent("keydown", split));
                        window.dispatchEvent(new KeyboardEvent("keyup", split));
                        window.dispatchEvent(new KeyboardEvent("keydown", split));
                        window.dispatchEvent(new KeyboardEvent("keyup", split));
                        return;
                    }

                    if (e.key == CzSettings.keybindings.ts) {
                        window.dispatchEvent(new KeyboardEvent("keydown", split));
                        window.dispatchEvent(new KeyboardEvent("keyup", split));
                        window.dispatchEvent(new KeyboardEvent("keydown", split));
                        window.dispatchEvent(new KeyboardEvent("keyup", split));
                        window.dispatchEvent(new KeyboardEvent("keydown", split));
                        window.dispatchEvent(new KeyboardEvent("keyup", split));
                        return;
                    }

                    if (e.key == CzSettings.keybindings.qs) {
                        window.dispatchEvent(new KeyboardEvent("keydown", split));
                        window.dispatchEvent(new KeyboardEvent("keyup", split));
                        window.dispatchEvent(new KeyboardEvent("keydown", split));
                        window.dispatchEvent(new KeyboardEvent("keyup", split));
                        window.dispatchEvent(new KeyboardEvent("keydown", split));
                        window.dispatchEvent(new KeyboardEvent("keyup", split));
                        window.dispatchEvent(new KeyboardEvent("keydown", split));
                        window.dispatchEvent(new KeyboardEvent("keyup", split));
                        return;
                    }
                }
            }
        });

        let DelSkinBtn = document.getElementById("DelSkinBtn");
        DelSkinBtn.addEventListener("click", () => {
            let skinIdInput = document.getElementById("skinIdInput").value;
            let skinCategoryInput = document.getElementById("skinCategoryInput").value;
            unsafeWindow.delSkin(skinIdInput, skinCategoryInput);
        });

        let savedNames = [];
        let confirmActive = document.getElementById("confirmActive");

        let savedNamesOutput = document.getElementById("savedNames");
        let saveNameBtn = document.getElementById("saveNameB");
        let saveNameInput = document.getElementById("saveNameI");

        saveNameBtn.addEventListener("click", () => {
            if (saveNameInput.value == "") {
                console.log("empty name");
            } else {
                setTimeout(() => {
                    saveNameInput.value = "";
                }, 10);
                let nameDiv = document.createElement("div");
                nameDiv.classList.add("NameDiv");

                let name = document.createElement("label");
                name.classList.add("NameLabel");
                name.innerText = saveNameInput.value;

                let delName = document.createElement("button");
                delName.innerText = "X";
                delName.classList.add("delName");

                name.addEventListener("click", () => {
                    navigator.clipboard.writeText(name.innerText).then(
                        () => {
                            console.log("Copied to clipboard: " + name.innerText);
                        },
                        () => {
                            console.error("Could not copy to clipboard.");
                        }
                    );
                });

                delName.addEventListener("click", () => {
                    if (confirmActive.checked) {
                        if (
                            confirm(
                                "Are you sure you want to delete the name '" +
                                name.innerText +
                                "'?"
                            )
                        ) {
                            console.log("deleted name: " + name.innerText);
                            nameDiv.remove();

                            let index = savedNames.indexOf(name.innerText);
                            if (index > -1) {
                                savedNames.splice(index, 1);
                                localStorage.setItem("savedNames", JSON.stringify(savedNames));
                            }
                        }
                    } else {
                        console.log("deleted name: " + name.innerText);
                        nameDiv.remove();

                        let index = savedNames.indexOf(name.innerText);
                        if (index > -1) {
                            savedNames.splice(index, 1);
                            localStorage.setItem("savedNames", JSON.stringify(savedNames));
                        }
                    }
                });

                nameDiv.appendChild(name);
                nameDiv.appendChild(delName);
                savedNamesOutput.appendChild(nameDiv);

                savedNames.push(saveNameInput.value);
                localStorage.setItem("savedNames", JSON.stringify(savedNames));
            }
        });

        if (localStorage.getItem("savedNames")) {
            savedNames = JSON.parse(localStorage.getItem("savedNames"));
            savedNames.forEach((name) => {
                let nameDiv = document.createElement("div");
                nameDiv.classList.add("NameDiv");

                let nameLabel = document.createElement("label");
                nameLabel.classList.add("NameLabel");
                nameLabel.innerText = name;

                let delName = document.createElement("button");
                delName.innerText = "X";
                delName.classList.add("delName");

                nameLabel.addEventListener("click", () => {
                    navigator.clipboard.writeText(nameLabel.innerText).then(
                        () => {
                            console.log("Copied to clipboard: " + nameLabel.innerText);
                        },
                        () => {
                            console.error("Could not copy to clipboard.");
                        }
                    );
                });

                delName.addEventListener("click", () => {
                    if (confirmActive.checked) {
                        if (
                            confirm(
                                "Are you sure you want to delete the name '" +
                                nameLabel.innerText +
                                "'?"
                            )
                        ) {
                            console.log("deleted name: " + nameLabel.innerText);
                            nameDiv.remove();
                            savedNames = savedNames.filter((n) => n !== nameLabel.innerText);
                            localStorage.setItem("savedNames", JSON.stringify(savedNames));
                        }
                    } else {
                        console.log("deleted name: " + nameLabel.innerText);
                        nameDiv.remove();
                        savedNames = savedNames.filter((n) => n !== nameLabel.innerText);
                        localStorage.setItem("savedNames", JSON.stringify(savedNames));
                    }
                });

                nameDiv.appendChild(nameLabel);
                nameDiv.appendChild(delName);
                savedNamesOutput.appendChild(nameDiv);
            });
        }

        let intervalId = null;

        function AutoRespawn() {
            document.getElementById("continue_button").click();
            document.getElementById("play-btn").click();
            unsafeWindow.hideDeathScreenx;
        }
        let speed = document.getElementById("ARspeed");
        let ARcb = document.getElementById("autoRespawn");
        ARcb.onchange = function() {
            if (this.checked) {
                let delay = speed.value;
                intervalId = setInterval(AutoRespawn, delay);
            } else {
                clearInterval(intervalId);
                intervalId = null;
            }
        };

        let signOutBtn = document.getElementById("signOutBtn");
        let signInBtn = document.getElementById("signInBtn");
        signOutBtn.style.transition = ".3s";

        function RespawnedMessage() {
            let messageSpan = "Respawned";
            const messageDiv = document.createElement("div");
            messageDiv.style = "display: flex; opacity: 0;";
            setTimeout(() => {
                messageDiv.style =
                    "display: flex; opacity: 1; transition: .3s; top: 0px;";
            }, 50);
            messageDiv.classList.add("comingSoonDiv");
            messageDiv.innerHTML = `
        <div class="CSD">
            <span class="ComingSoonSpan" style="color: #fff;">${messageSpan}</span>
        </div>
    `;
            setTimeout(function() {
                messageDiv.style = "opacity: 0; transition: .3s; top: 20px;";
                setTimeout(function() {
                    messageDiv.style.display = "none";
                }, 300);
            }, 2000);
            document.body.appendChild(messageDiv);
        }

        let open = document.getElementById("open");
        let isOpen = false;
        open.addEventListener("click", () => {
            toggleMenu();
            if (isOpen) {
                open.innerHTML = "Open";
                isOpen = false;
            } else {
                open.innerHTML = "Close";
                isOpen = true;
            }
        });

        let closeMenuBtn = document.getElementById("closeMenuBtn");
        closeMenuBtn.addEventListener("click", () => {
            smoothClose();
            if (menu) {
                if (isOpen) {
                    open.innerHTML = "Close";
                    isOpen = true;
                } else {
                    open.innerHTML = "Open";
                    isOpen = false;
                }
            }
        });

        function toggleMenu() {
            let modMenuOverlay = document.querySelector(".modMenuOverlay");
            let menu = document.getElementById("Modmenu");
            let open = document.getElementById("open");
            if (menu) {
                if (isOpen) {
                    smoothClose();
                    modMenuOverlay.style.pointerEvents = "none";
                    open.innerHTML = "Open";
                } else {
                    smoothOpen();
                    modMenuOverlay.style.pointerEvents = "auto";
                    open.innerHTML = "Close";
                }
            }
        }

        function smoothOpen() {
            let menu = document.getElementById("Modmenu");
            if (menu) {
                menu.style.display = "flex";
                setTimeout(function() {
                    menu.style = "opacity: 1; transition: .3s;";
                    isOpen = true;
                }, 1);
            }
        }

        function smoothClose() {
            let keybindingInputs = document.querySelector(".keybinding");
            keybindingInputs.value;

            let menu = document.getElementById("Modmenu");
            let modMenuOverlay = document.querySelector(".modMenuOverlay");
            modMenuOverlay.style.pointerEvents = "none";
            if (menu) {
                menu.style = "opacity: 0; transition: .3s;";
                setTimeout(function() {
                    let open = document.getElementById("open");
                    open.innerHTML = "Open";
                    menu.style.display = "none";
                    isOpen = false;
                }, 200);
            }
        }

        let MenuopctBtn = document.getElementById("menuOpacity");
        if (MenuopctBtn) {
            MenuopctBtn.oninput = function() {
                menuOpacityChange(this.value / 100, this);
            };
        }
        let ButtonopctBtn = document.getElementById("buttonOpacity");
        if (ButtonopctBtn) {
            ButtonopctBtn.oninput = function() {
                ButtonOpacityChange(this.value / 100, this);
            };
        }

        let installBotBtn = document.getElementById("install-bot");
        installBotBtn.addEventListener("click", () => {
            window.open(
                "https://greasyfork.org/scripts/459040-czbot-sigmally-bot",
                "_blank"
            );
        });

        function menuOpacityChange(val, elem) {
            let menu = document.getElementById("Modmenu");
            if (menu) {
                menu.style.opacity = val;
            }
        }

        function ButtonOpacityChange(val, elem) {
            let Btn = document.getElementById("open");
            Btn.style.opacity = val;
        }

        let hide = false;
        let HideRightAndLeftMenusBtn = document.getElementById(
            "HideRightAndLeftMenusBtn"
        );
        HideRightAndLeftMenusBtn.addEventListener("click", () => {
            let rightMenu = document.getElementById("right-menu");
            let leftMenu = document.getElementById("left-menu");
            let rightMenuQS = document.querySelector(".right-menu");
            let links = document.getElementById("menu-links");
            let bottom_ad = document.getElementById("ad_bottom");

            if (!hide) {
                rightMenu.style.opacity = 0;
                leftMenu.style.opacity = 0;
                rightMenuQS.style.opacity = 0;
                links.style.opacity = 0;
                bottom_ad.style.opacity = 0;
                rightMenu.style.pointerEvents = "none";
                leftMenu.style.pointerEvents = "none";
                hide = true;
            } else {
                rightMenu.style.opacity = "1";
                leftMenu.style.opacity = "1";
                rightMenuQS.style.opacity = "1";
                links.style.opacity = "1";
                rightMenu.style.pointerEvents = "auto";
                leftMenu.style.pointerEvents = "auto";
                hide = false;
            }
        });

        let showNamesCB = document.getElementById("showNames");
        let showNames = true;
        showNamesCB.addEventListener("click", () => {
            if (!showNames) {
                unsafeWindow.settings.showNames = true;
                showNames = true;
            } else {
                unsafeWindow.settings.showNames = false;
                showNames = false;
            }
        });
        let showSkinsCB = document.getElementById("showSkins");
        let showSkins = true;
        showSkinsCB.addEventListener("click", () => {
            if (showSkins == true) {
                unsafeWindow.settings.showSkins = false;
                showSkins = false;
            } else {
                unsafeWindow.settings.showSkins = true;
                showSkins = true;
            }
        });

        let menuColorPicker = document.getElementById("ColorPicker1");
        let textColorPicker = document.getElementById("ColorPicker2");

        menuColorPicker.oninput = () => {
            let menu = document.getElementById("menu");
            let rightMenu = document.querySelector(".top-users__inner");
            let leftMenu = document.getElementById("left-menu");
            let linksMenu = document.querySelector(".menu-links");
            let deathScreen = document.querySelector(".menu--stats-mode");

            menu.style.backgroundColor = menuColorPicker.value;
            rightMenu.style.backgroundColor = menuColorPicker.value;
            leftMenu.style.backgroundColor = menuColorPicker.value;
            linksMenu.style.backgroundColor = menuColorPicker.value;
            deathScreen.style.backgroundColor = menuColorPicker.value;
        };

        textColorPicker.oninput = () => {
            let bodyInner = document.querySelector(".body__inner");
            if (bodyInner) {
                let elements = bodyInner.querySelectorAll("label, span, td, h1, th, h3");
                elements.forEach((element) => {
                    element.style.color = textColorPicker.value;
                });
            }
        };

        let RLT = document.getElementById("reduceLags-tab");
        let SNT = document.getElementById("stylishName-tab");
        let FOT = document.getElementById("funOptions-tab");
        let OOT = document.getElementById("otherOptions-tab");
        let SMT = document.getElementById("SocialMedia-tab");
        let IT = document.getElementById("Info-tab");
        let ST = document.getElementById("skins-tab");
        let KBT = document.getElementById("keybinds-tab");

        let buttons = document.querySelectorAll("button");

        buttons.forEach(function(button) {
            button.addEventListener("click", function() {
                let id = button.getAttribute("id");
                if (id === "KeyBindingsButton") {
                    KBT.style = "display: block; opacity: 0;";
                    setTimeout(function() {
                        KBT.style = "display: block; opacity: 1; transition: .3s;";
                    }, 100);
                } else if (id === "reduceLagsButton") {
                    RLT.style = "display: block; opacity: 0;";
                    setTimeout(function() {
                        RLT.style = "display: block; opacity: 1; transition: .3s;";
                    }, 100);
                } else if (id === "StylishNameButton") {
                    SNT.style = "display: block; opacity: 0;";
                    setTimeout(function() {
                        SNT.style = "display: block; opacity: 1; transition: .3s;";
                    }, 100);
                } else if (id === "funOptionsButton") {
                    FOT.style = "display: block; opacity: 0;";
                    setTimeout(function() {
                        FOT.style = "display: block; opacity: 1; transition: .3s;";
                    }, 100);
                } else if (id === "othersButton") {
                    OOT.style = "display: block; opacity: 0;";
                    setTimeout(function() {
                        OOT.style = "display: block; opacity: 1; transition: .3s;";
                    }, 100);
                } else if (id === "socialMediaButton") {
                    SMT.style = "display: block; opacity: 0;";
                    setTimeout(function() {
                        SMT.style = "display: block; opacity: 1; transition: .3s;";
                    }, 100);
                } else if (id === "infoButton") {
                    IT.style = "display: block; opacity: 0;";
                    setTimeout(function() {
                        IT.style = "display: block; opacity: 1; transition: .3s;";
                    }, 100);
                } else if (id === "skinsButton") {
                    ST.style = "display: block; opacity: 0;";
                    setTimeout(function() {
                        ST.style = "display: block; opacity: 1; transition: .3s;";
                    }, 100);
                } else if (id === "KBTBACK-button") {
                    KBT.style = "display: block; opacity: 0; transition: .3s;";
                    setTimeout(function() {
                        KBT.style = "display: none; opacity: 0;";
                    }, 100);
                } else if (id === "RLTBACK-button") {
                    RLT.style = "display: block; opacity: 0; transition: .3s;";
                    setTimeout(function() {
                        RLT.style = "display: none; opacity: 0;";
                    }, 100);
                } else if (id === "SNTBACK-button") {
                    SNT.style = "display: block; opacity: 0; transition: .3s;";
                    setTimeout(function() {
                        SNT.style = "display: none; opacity: 0;";
                    }, 100);
                } else if (id === "FOTBACK-button") {
                    FOT.style = "display: block; opacity: 0; transition: .3s;";
                    setTimeout(function() {
                        FOT.style = "display: none; opacity: 0;";
                    }, 100);
                } else if (id === "OOTBACK-button") {
                    OOT.style = "display: block; opacity: 0; transition: .3s;";
                    setTimeout(function() {
                        OOT.style = "display: none; opacity: 0;";
                    }, 100);
                } else if (id === "SMTBACK-button") {
                    SMT.style = "display: block; opacity: 0; transition: .3s;";
                    setTimeout(function() {
                        SMT.style = "display: none; opacity: 0;";
                    }, 100);
                } else if (id === "ITB-button") {
                    IT.style = "display: block; opacity: 0; transition: .3s;";
                    setTimeout(function() {
                        IT.style = "display: none; opacity: 0;";
                    }, 100);
                } else if (id === "STBACK-button") {
                    ST.style = "display: block; opacity: 0; transition: .3s;";
                    setTimeout(function() {
                        ST.style = "display: none; opacity: 0;";
                    }, 100);
                }
            });
        });
        const skinLinks = {
            premium: [
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Art.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Bile.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Boo.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Brandywine.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Captain.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Cara.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Carlton.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Derek.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Fungus.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/George.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Gesner.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Jack.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Josh.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Maya.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Michael.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Needleman.png",
                //level skin: Peep
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Peep.png",
                //
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Peterson.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Smitty.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Spike.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Squibbles.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Sulley.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Terri.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Valentine.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Waternoose.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Worthington.png",
                "https://raw.githubusercontent.com/Sigmally/CzMod/main/SigmallySkins/Yeti.png",
            ],
        };
        let randomSkin = document.getElementById("randomSkin");
        randomSkin.addEventListener("click", () => {
            let skin = document.getElementById("js-skin-select-icon");
            let randomIndex = Math.floor(Math.random() * skinLinks.premium.length);
            let randomImageLink = skinLinks.premium[randomIndex];
            skin.style = `background-image: url("${randomImageLink}");`;
        });

        const skinFileInput = document.getElementById("skinFile");
        const skinSelectIcon = document.getElementById("js-skin-select-icon");
        let skinFileLabel = document.getElementById("skinFileLabel");

        skinFileInput.addEventListener("change", () => {
            const file = skinFileInput.files[0];
            const allowedTypes = ["image/png", "image/jpeg", "image/gif"];

            if (!allowedTypes.includes(file.type)) {
                alert("Only PNG and JPG are allowed");
                return;
            }

            const reader = new FileReader();

            reader.addEventListener("load", () => {
                skinSelectIcon.style.backgroundImage = `url(${reader.result})`;
                skinFileLabel.innerText = "Change Skin";
            });

            reader.readAsDataURL(file);
        });

        const skinURL = document.getElementById("skinURL");
        const chooseURL = document.getElementById("chooseURL");
        chooseURL.addEventListener("click", () => {
            const imageUrl = skinURL.value;
            const image = new Image();
            image.src = imageUrl;
            image.addEventListener("load", () => {
                skinSelectIcon.style.backgroundImage = `url(${imageUrl})`;
            });
            image.addEventListener("error", () => {
                alert("Invalid URL. Please enter a valid URL.");
            });
        });

        let rainbowMenuBtn = document.getElementById("rainbowMenu");
        rainbowMenuBtn.onclick = checkStatus;
        let enableRainbowBackground = false;

        function checkStatus() {
            if (enableRainbowBackground == false) {
                changeBackground();
            } else if (enableRainbowBackground == true) {
                noBackground();
            }
        }

        function changeBackground() {
            enableRainbowBackground = true;
            let menu = document.getElementById("menu");
            let rightMenu = document.querySelector(".top-users__inner");
            let leftMenu = document.getElementById("left-menu");
            let linksMenu = document.querySelector(".menu-links");
            let deathScreen = document.querySelector(".menu--stats-mode");

            menu.style.background =
                "linear-gradient(120deg, red, orange, yellow, green, blue, indigo, violet)";
            menu.style.backgroundSize = "1000% 400%";
            menu.style.backgroundPosition = "0% 0%";

            rightMenu.style.background =
                "linear-gradient(120deg, red, orange, yellow, green, blue, indigo, violet)";
            rightMenu.style.backgroundSize = "1000% 400%";
            rightMenu.style.backgroundPosition = "0% 0%";
            rightMenu.style.borderRadius = "15px";

            leftMenu.style.background =
                "linear-gradient(120deg, red, orange, yellow, green, blue, indigo, violet)";
            leftMenu.style.backgroundSize = "1000% 400%";
            leftMenu.style.backgroundPosition = "0% 0%";

            linksMenu.style.background =
                "linear-gradient(120deg, red, orange, yellow, green, blue, indigo, violet)";
            linksMenu.style.backgroundSize = "1000% 400%";
            linksMenu.style.backgroundPosition = "0% 0%";

            deathScreen.style.background =
                "linear-gradient(120deg, red, orange, yellow, green, blue, indigo, violet)";
            deathScreen.style.backgroundSize = "1000% 400%";
            deathScreen.style.backgroundPosition = "0% 0%";

            const keyframeAnimation = `
                @keyframes rainbow {
                  0% {
                    background-position: 0% 50%;
                  }
                  50% {
                    background-position: 100% 50%;
                  }
                  100% {
                    background-position: 0% 50%;
                  }
               }
            `;
            const styleSheet = document.styleSheets[0];
            styleSheet.insertRule(keyframeAnimation, styleSheet.cssRules.length);

            menu.style.animation = "rainbow 5s ease infinite";
            rightMenu.style.animation = "rainbow 5s ease infinite";
            leftMenu.style.animation = "rainbow 5s ease infinite";
            linksMenu.style.animation = "rainbow 5s ease infinite";
            deathScreen.style.animation = "rainbow 5s ease infinite";
        }

        function noBackground() {
            enableRainbowBackground = false;
            let menu = document.getElementById("menu");
            let rightMenu = document.querySelector(".top-users__inner");
            let leftMenu = document.getElementById("left-menu");
            let linksMenu = document.querySelector(".menu-links");
            let deathScreen = document.querySelector(".menu--stats-mode");
            menu.style.background = "";
            menu.style.backgroundSize = "100%";
            menu.style.backgroundPosition = "";

            rightMenu.style.background = "";
            rightMenu.style.backgroundSize = "100%";
            rightMenu.style.backgroundPosition = "";

            leftMenu.style.background = "";
            leftMenu.style.backgroundSize = "100%";
            leftMenu.style.backgroundPosition = "";

            linksMenu.style.background = "";
            linksMenu.style.backgroundSize = "100%";
            linksMenu.style.backgroundPosition = "";

            deathScreen.style.background = "";
            deathScreen.style.backgroundSize = "100%";
            deathScreen.style.backgroundPosition = "";
        }

        function darkModeMenu() {
            let menu = document.getElementById("menu");
            let rightMenu = document.querySelector(".top-users__inner");
            let leftMenu = document.getElementById("left-menu");
            let linksMenu = document.querySelector(".menu-links");
            let deathScreen = document.querySelector(".menu--stats-mode");

            menu.style.backgroundColor = "#333";
            menu.style.color = "#D5D5D5";

            rightMenu.style.backgroundColor = "#333";
            rightMenu.style.color = "#D5D5D5";

            leftMenu.style.backgroundColor = "#333";
            leftMenu.style.color = "#D5D5D5";

            linksMenu.style.backgroundColor = "#333";
            linksMenu.style.color = "#D5D5D5";

            deathScreen.style.backgroundColor = "#333";
            deathScreen.style.color = "#D5D5D5";
        }

        function lightModeMenu() {
            let menu = document.getElementById("menu");
            let rightMenu = document.querySelector(".top-users__inner");
            let leftMenu = document.getElementById("left-menu");
            let linksMenu = document.querySelector(".menu-links");
            let deathScreen = document.querySelector(".menu--stats-mode");
            let body = document.querySelector("body");
            body.style.color = "#fff";

            menu.style.backgroundColor = "#fff";

            rightMenu.style.backgroundColor = "#fff";
            rightMenu.style.Color = "#000";

            leftMenu.style.backgroundColor = "#fff";

            linksMenu.style.backgroundColor = "#fff";

            deathScreen.style.backgroundColor = "#fff";
        }

        let nb = document.getElementById("nightBtn");
        let lb = document.getElementById("lightBtn");

        nb.onclick = () => {
            darkMode();
            let bodyInner = document.querySelector(".body__inner");
            if (bodyInner) {
                let elements = bodyInner.querySelectorAll("label, span, td, h1, th, h3");
                let SkinsTxt = document.getElementById("js-skin-select-icon-text");
                elements.forEach((element) => {
                    element.style.color = "#fff";
                    SkinsTxt.style.color = "#fff";
                });
            }
        };
        lb.onclick = () => {
            lightMode();
            let bodyInner = document.querySelector(".body__inner");
            if (bodyInner) {
                let elements = bodyInner.querySelectorAll("label, span, td, h1, th, h3");
                let SkinsTxt = document.getElementById("js-skin-select-icon-text");
                elements.forEach((element) => {
                    element.style.color = "#333";
                    SkinsTxt.style.color = "#333";
                });
            }
        };

        function lightMode() {
            let menu = document.getElementById("menu");
            let rightMenu = document.querySelector(".top-users__inner");
            let leftMenu = document.getElementById("left-menu");
            let linksMenu = document.querySelector(".menu-links");
            let deathScreen = document.querySelector(".menu--stats-mode");
            menu.style.backgroundColor = "#fff";
            rightMenu.style.backgroundColor = "#fff";
            leftMenu.style.backgroundColor = "#fff";
            linksMenu.style.backgroundColor = "#fff";
            deathScreen.style.backgroundColor = "#fff";

            let nb = document.getElementById("nightBtn");
            let lb = document.getElementById("lightBtn");

            lb.style.border = "2px solid #2b39ff";
            nb.style.border = "2px solid #222";
        }

        function darkMode() {
            let menu = document.getElementById("menu");
            let rightMenu = document.querySelector(".top-users__inner");
            let leftMenu = document.getElementById("left-menu");
            let linksMenu = document.querySelector(".menu-links");
            let deathScreen = document.querySelector(".menu--stats-mode");
            menu.style.backgroundColor = "#222";
            rightMenu.style.backgroundColor = "#222";
            leftMenu.style.backgroundColor = "#222";
            linksMenu.style.backgroundColor = "#222";
            deathScreen.style.backgroundColor = "#222";

            let nb = document.getElementById("nightBtn");
            let lb = document.getElementById("lightBtn");

            nb.style.border = "2px solid #2b39ff";
            lb.style.border = "2px solid #222";
        }
        let darkthemeCheckbox = document.getElementById("darkTheme");
        let FlashBGcb = document.getElementById("flashBGCB");
        let flashingBg;
        FlashBGcb.addEventListener("click", () => {
            if (FlashBGcb.checked) {
                flashingBg = setInterval(function() {
                    darkthemeCheckbox.click();
                }, 100);
            } else {
                clearInterval(flashingBg);
            }
        });

        let longNickname = document.getElementById("longNickname");
        let nick = document.getElementById("nick");
        nick.maxLength = 50;
        longNickname.addEventListener("click", () => {
            let nick = document.getElementById("nick");
            if (longNickname.checked) {
                nick.maxLength = 50;
            } else {
                nick.maxLength = 15;
            }
        });

        let HideOpenBtn = document.getElementById("HideOpenBtn");
        let openBtn = document.getElementById("open");

        if (openBtn) {
            HideOpenBtn.addEventListener("click", () => {
                if (openBtn.style.display !== "none") {
                    openBtn.style.display = "none";
                    HideOpenBtn.innerHTML = "Show";
                } else {
                    openBtn.style.display = "flex";
                    HideOpenBtn.innerHTML = "Hide";
                }
            });
        }

        let ads = document.querySelectorAll(
            "#text-block, #left_ad_block, #ad_bottom, .ad-block-left, .ad-block-right, .ad-block__inner"
        );
        ads.forEach((ad) => {
            ad.classList.add("hidden");
        });

        let removeAds = document.getElementById("removeAdsCb");
        removeAds.addEventListener("click", () => {
            let ads = document.querySelectorAll(
                "#text-block, #left_ad_block, #ad_bottom, .ad-block-left, .ad-block-right, .ad-block__inner"
            );
            if (removeAds.checked) {
                ads.forEach((ad) => {
                    ad.classList.add("hidden");
                });
            } else {
                ads.forEach((ad) => {
                    ad.classList.remove("hidden");
                });
            }
        });

        let plusBtn = document.querySelector(".plus");
        plusBtn.addEventListener("click", () => {
            alert("this option is currently unavailable, Sigmally will add it soon!");
        });
    }, 500);
})();