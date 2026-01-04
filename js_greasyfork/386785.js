// ==UserScript==
// @name         Kokuros Utilities Mod (Status :✔️:)
// @description  Krunker.io Mod
// @version      1.0.3
// @author       Kokuro Hacks ✔️
// @include      /^(https?:\/\/)?(www\.)?(.+)krunker\.io(|\/|\/\?.+)$/
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/313143
// @downloadURL https://update.greasyfork.org/scripts/386785/Kokuros%20Utilities%20Mod%20%28Status%20%3A%E2%9C%94%EF%B8%8F%3A%29.user.js
// @updateURL https://update.greasyfork.org/scripts/386785/Kokuros%20Utilities%20Mod%20%28Status%20%3A%E2%9C%94%EF%B8%8F%3A%29.meta.js
// ==/UserScript==

class Utilities {
    constructor() {
        this.findingNew = false;
        this.deaths = 0;
        this.lastSent = 0;
        this.settings = null;
        this.onLoad();
        this.hexToRGB = hex => hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,
            (m, r, g, b) => '#' + r + r + g + g + b + b)
            .substring(1).match(/.{2}/g)
            .map(x => parseInt(x, 16));
    }

    createSettings() {
        inviteButton.insertAdjacentHTML("afterend", '\n<div class="button small" onmouseenter="playTick()" onclick="showWindow(window.windows.length-1);">Join</div>');
        subLogoButtons.insertAdjacentHTML("beforeend", '<div class="button small" onmouseenter="playTick()" onclick="showWindow(window.windows.length);">Kokuros Utilities</div>');
        const selectStyle = `border: none; background: #eee; padding: 4px; float: right; margin-left: 10px;`;
        const textInputStyle = `border: none; background: #eee; padding: 6px; padding-bottom: 6px; float: right;`;
        this.settings = {
            showLeaderboard: {
                name: "Show Leaderboard",
                pre: "<div class='setHed'><center>Subscribe to Krunker News</center></div><div class='setHed'>Render</div><hr>",
                val: true,
                html: _ => {
                    return `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("showLeaderboard", this.checked)' ${this.settings.showLeaderboard.val ? "checked" : ""}><span class='slider'></span></label>`;
                },
                set: val => {
                    leaderDisplay.style.display = val ? "block" : "none";
                }
            },
            autoFindNew: {
                name: "New Lobby Finder",
                pre: "<br><div class='setHed'>Features</div><hr>",
                val: false,
                html: _ => {
                    return `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("autoFindNew", this.checked)' ${this.settings.autoFindNew.val ? "checked" : ""}><span class='slider'></span></label>`;
                }
            },
            matchEndMessage: {
                name: "Match End Message",
                val: '',
                html: _ => {
                    return `<input type='text' id='matchEndMessage' placeholder='Match End Message' name='text' style='${textInputStyle}' value='${this.settings.matchEndMessage.val}' oninput='window.utilities.setSetting("matchEndMessage", this.value)' style='float:right;margin-top:5px'/>`
                }
            },
            deathCounter: {
                name: "Death Counter",
                val: false,
                html: _ => {
                    return `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("deathCounter", this.checked)' ${this.settings.deathCounter.val ? "checked" : ""}><span class='slider'></span></label>`;
                },
                set: val => {
                    document.getElementById('deathCounter').style.display = val ? "inline-block" : "none";
                }
            },
            forceChallenge: {
                name: "Force Challenge Mode",
                val: false,
                html: _ => {
                    return `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("forceChallenge", this.checked)' ${this.settings.forceChallenge.val ? "checked" : ""}><span class='slider'></span></label>`;
                },
                set: val => {
                    if (val && !challButton.lastElementChild.firstChild.checked) challButton.lastElementChild.firstChild.click();
                }
            },
            autoMod: {
                name: "Auto Load Mod",
                val: '',
                html: _ => {
                    return `<input type='text' id='autoMod' placeholder='Mod URL' name='text' style='${textInputStyle}' value='${this.settings.autoMod.val}' oninput='window.utilities.setSetting("autoMod", this.value)' style='float:right;margin-top:5px'/>`
                },
                set: val => {
                    if (val.length > 1) loadModPack(val, true);
                }
            },
            customCrosshair: {
                name: "Display",
                pre: "<br><div class='setHed'>Crosshair</div><hr>",
                val: 0,
                html: _ => {
                    return `<select style='${selectStyle}' onchange="window.utilities.setSetting('customCrosshair', this.value)">
                    <option value="0"${this.settings.customCrosshair.val == 0 ? " selected" : ""}>Normal</option>
                    <option value="1"${this.settings.customCrosshair.val == 1 ? " selected" : ""}>Custom</option>
                    <option value="2"${this.settings.customCrosshair.val == 2 ? " selected" : ""}>Custom & Normal</option>
                    </select>`
                },
                set: val => {
                    let options = ['customCrosshairShape', 'customCrosshairAlwaysShow', 'customCrosshairShadow', 'customCrosshairColor', 'customCrosshairLength', 'customCrosshairThickness'];
                    for (let opt of options) {
                        this.settings[opt].hide = val == 0;
                        let doc = document.getElementById(opt + '_div');
                        if (doc) doc.style.display = val == 0 ? 'none' : 'block';
                    }
                    this.settings.customCrosshairShape.set(this.settings.customCrosshairShape.val);
                }
            },
            customCrosshairShape: {
                name: "Style",
                val: 0,
                hide: true,
                html: _ => {
                    return `<select style='${selectStyle}' onchange="window.utilities.setSetting('customCrosshairShape', this.value)">
                    <option value="0"${this.settings.customCrosshairShape.val == 0 ? " selected" : ""}>Cross</option>
                    <option value="1"${this.settings.customCrosshairShape.val == 1 ? " selected" : ""}>Hollow Circle</option>
                    <option value="2"${this.settings.customCrosshairShape.val == 2 ? " selected" : ""}>Solid Circle</option>
                    <option value="3"${this.settings.customCrosshairShape.val == 3 ? " selected" : ""}>Image</option>
                    <option value="4"${this.settings.customCrosshairShape.val == 4 ? " selected" : ""}>Hollow Square</option>
                    <option value="5"${this.settings.customCrosshairShape.val == 5 ? " selected" : ""}>Solid Square</option>
                    </select>`
                },
                set: val => {
                    this.settings.customCrosshairImage.hide = this.settings.customCrosshair.val == 0 ? true: !(val == 3);
                    this.settings.customCrosshairShadow.hide = this.settings.customCrosshair.val == 0 ? true: val == 3;
                    let doc = document.getElementById('customCrosshairImage_div');
                    if (doc) doc.style.display = this.settings.customCrosshairImage.hide ? 'none' : 'block';
                    doc = document.getElementById('customCrosshairShadow_div');
                    if (doc) doc.style.display = this.settings.customCrosshairShadow.hide ? 'none' : 'block';
                }
            },
            customCrosshairImage: {
                name: "Image",
                val: '',
                hide: true,
                html: _ => {
                    return `<input type='url' id='customCrosshairImage' placeholder='Crosshair Image URL' name='text' style='${textInputStyle}' value='${this.settings.customCrosshairImage.val}' oninput='window.utilities.setSetting("customCrosshairImage", this.value)' style='float:right;margin-top:5px'/>`
                }
            },
            customCrosshairAlwaysShow: {
                name: "Always Show",
                val: false,
                hide: true,
                html: _ => {
                    return `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("customCrosshairAlwaysShow", this.checked)' ${this.settings.customCrosshairAlwaysShow.val ? "checked" : ""}><span class='slider'></span></label>`;
                }
            },
            customCrosshairShadow: {
                name: "Shadow",
                val: '#000000',
                hide: true,
                html: _ => {
                    return `<input type='color' id='crosshairShadow' name='color' value='${this.settings.customCrosshairShadow.val}' oninput='window.utilities.setSetting("customCrosshairShadow", this.value)' style='float:right;margin-top:5px'/>`
                }
            },
            customCrosshairColor: {
                name: "Color",
                val: "#ffffff",
                hide: true,
                html: _ => {
                    return `<input type='color' id='crosshairColor' name='color' value='${this.settings.customCrosshairColor.val}' oninput='window.utilities.setSetting("customCrosshairColor", this.value)' style='float:right;margin-top:5px'/>`
                }
            },
            customCrosshairLength: {
                name: "Length",
                val: 16,
                hide: true,
                html: _ => {
                    return `<span class='sliderVal' id='slid_utilities_customCrosshairLength'>${this.settings.customCrosshairLength.val}</span><div class='slidecontainer'><input type='range' min='2' max='50' step='2' value='${this.settings.customCrosshairLength.val}' class='sliderM' oninput="window.utilities.setSetting('customCrosshairLength', this.value)"></div>`
                }
            },
            customCrosshairThickness: {
                name: "Thiccness lol (i like memes xD)",
                val: 2,
                hide: true,
                html: _ => {
                    return `<span class='sliderVal' id='slid_utilities_customCrosshairThickness'>${this.settings.customCrosshairThickness.val}</span><div class='slidecontainer'><input type='range' min='2' max='20' step='2' value='${this.settings.customCrosshairThickness.val}' class='sliderM' oninput="window.utilities.setSetting('customCrosshairThickness', this.value)"></div>`
                }
            },
            customADSDot: {
                name: "ADSDot Image",
                pre: "<br><div class='setHed'>Customization</div><hr>",
                val: '',
                html: _ => {
                    return `<input type='url' id='customADSDot' placeholder='ADSDot URL' name='url' style='${textInputStyle}' value='${this.settings.customADSDot.val}' oninput='window.utilities.setSetting("customADSDot", this.value)' style='float:right;margin-top:5px'/>`
                }
            },
            customScope: {
                name: "Scope Image",
                val: '',
                html: _ => {
                    return `<input type='url' id='customScope' placeholder='Scope Image URL' name='url' style='${textInputStyle}' value='${this.settings.customScope.val}' oninput='window.utilities.setSetting("customScope", this.value)' style='float:right;margin-top:5px'/>`
                },
                set: val => {
                    recticleImg.src = val.length > 1 ? val : location.origin + '/textures/recticle.png';
                }
            },
            customScopeHideBoxes: {
                name: "Hide Black Boxes",
                val: false,
                html: _ => {
                    return `<label class='switch'><input type='checkbox' onclick='window.utilities.setSetting("customScopeHideBoxes", this.checked)' ${this.settings.customScopeHideBoxes.val ? "checked" : ""}><span class='slider'></span></label>`;
                },
                set: val => {
                    [...document.querySelectorAll('.black')].forEach(el => el.style.display = val ? "none" : "block");
                }
            },
            customAmmo: {
                name: "Ammo Icon",
                val: '',
                html: _ => {
                    return `<input type='url' id='customAmmo' placeholder='Ammo Icon URL' name='url' style='${textInputStyle}' value='${this.settings.customAmmo.val}' oninput='window.utilities.setSetting("customAmmo", this.value)' style='float:right;margin-top:5px'/>`
                },
                set: val => {
                    ammoIcon.src = val.length > 1 ? val : location.origin + '/textures/ammo_0.png';
                }
            },
            customFlashOverlay: {
                name: "Muzzle Flash Image",
                val: '',
                html: _ => {
                    return `<input type='url' id='customFlashOverlay' placeholder='Muzzle Flash URL' name='url' style='${textInputStyle}' value='${this.settings.customFlashOverlay.val}' oninput='window.utilities.setSetting("customFlashOverlay", this.value)' style='float:right;margin-top:5px'/>`
                },
                set: val => {
                    flashOverlay.src = val.length > 1 ? val : location.origin + '/img/muzflash.png';
                }
            },
            customKills: {
                name: "Kill Icon",
                val: '',
                html: _ => {
                    return `<input type='url' id='customKills' placeholder='Kill Icon URL' name='url' style='${textInputStyle}' value='${this.settings.customKills.val}' oninput='window.utilities.setSetting("customKills", this.value)' style='float:right;margin-top:5px'/>`
                },
                set: val => {
                    killsIcon.src = val.length > 1 ? val : location.origin + '/img/skull.png';
                }
            },
            customDeaths: {
                name: "Death Icon",
                val: '',
                html: _ => {
                    return `<input type='url' id='customDeaths' placeholder='Death Icon URL' name='url' style='${textInputStyle}' value='${this.settings.customDeaths.val}' oninput='window.utilities.setSetting("customDeaths", this.value)' style='float:right;margin-top:5px'/>`
                },
                set: val => {
                    deathIcon.src = val.length > 1 ? val : 'https://i.imgur.com/wTEFQRS.png';
                }
            },
            customBlood: {
                name: "Death Overlay",
                val: '',
                html: _ => {
                    return `<input type='url' id='customBlood' placeholder='Death Overlay URL' name='url' style='${textInputStyle}' value='${this.settings.customBlood.val}' oninput='window.utilities.setSetting("customBlood", this.value)' style='float:right;margin-top:5px'/>`
                },
                set: val => {
                    bloodDisplay.src = val.length > 1 ? val : location.origin + '/img/blood.png';
                }
            },
            customTimer: {
                name: "Timer Icon",
                val: '',
                html: _ => {
                    return `<input type='url' id='customTimer' placeholder='Timer Icon URL' name='url' style='${textInputStyle}' value='${this.settings.customTimer.val}' oninput='window.utilities.setSetting("customTimer", this.value)' style='float:right;margin-top:5px'/>`
                },
                set: val => {
                    timerIcon.src = val.length > 1 ? val : location.origin + '/img/timer.png';
                }
            }
        };
        window.windows.push({
            header: "Join",
            gen: _ => {
                return `<input id='gameURL' type='text' placeholder='Enter Game URL/Code' class='accountInput' style='margin-top:0' value=''></input>
                <div class='accountButton' onclick='window.utilities.joinGame()', style='width:100%'>Join</div>`;
            }
        });
        window.windows.push({
            header: "Kokuro Utilities",
            gen: _ => {
                var tmpHTML = "";
                for (var key in window.utilities.settings) {
                    if (window.utilities.settings[key].noShow) continue;
                    if (window.utilities.settings[key].pre) tmpHTML += window.utilities.settings[key].pre;
                    tmpHTML += "<div class='settName' id='" + key + "_div' style='display:" + (window.utilities.settings[key].hide ? 'none' : 'block') +"'>" + window.utilities.settings[key].name +
                        " " + window.utilities.settings[key].html() + "</div>";
                }
                tmpHTML += "<br><a onclick='window.utilities.resetSettings()' class='menuLink'>Reset Settings</a>";
                return tmpHTML;
            }
        });
        this.setupSettings();
    }

    setupSettings() {
        for (const key in this.settings) {
            var tmpVal = getSavedVal(`kro_set_utilities_${key}`);
            this.settings[key].val = (tmpVal!== null)?tmpVal:this.settings[key].val;
            if (this.settings[key].val == "false") this.settings[key].val = false;
            if (this.settings[key].set) this.settings[key].set(this.settings[key].val, true);
        }
    }
    
    joinGame() {
        let code = gameURL.value || '';
        if (code.match(/^(https?:\/\/)?(www\.)?(.+)krunker\.io(|\/|\/\?(server|party|game)=.+)$/)) {
            location = code;
        } else if (code.match(/^([A-Z]+):(\w+)$/)) {
            location = location.origin + "/?game=" + code;
        }
    }

    createDeathCounter() {
        let deathCounter = document.createElement('div');
        deathCounter.id = 'deathCounter';
        deathCounter.style.cssText = `margin-left: 10px;
            margin-top: 20px;
            background-color: rgba(0, 0, 0, 0.2);
            padding: 10px;
            display: inline-block;
            font-size: 26px;
            padding-right: 20px;
            padding-left: 14px;
            display: none`;

        let deathIcon = document.createElement('img');
        deathIcon.id = 'deathIcon';
        deathIcon.src = 'https://i.imgur.com/wTEFQRS.png';
        deathIcon.style.cssText = `width: 38px;
            height: 38px;
            padding-right: 10px;
            image-rendering: pixelated;
            image-rendering: -moz-crisp-edges;
            image-rendering: crisp-edges;`;
        deathCounter.appendChild(deathIcon); 

        let deathsVal = document.createElement('span');
        deathsVal.id = 'deathsVal';
        deathsVal.style.color = 'rgba(255, 255, 255, 0.7)';
        deathsVal.innerHTML = '0';
        deathCounter.appendChild(deathsVal);      

        topRight.appendChild(deathCounter);
    }
    
    createCrosshair() {
        let div = document.createElement('div');
        div.id = 'custCross';
        div.style.display = 'none';

        let crossS = document.createElement('div');
        crossS.id = 'crossS';
        crossS.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: none;`;
        div.appendChild(crossS);

        let crossH = document.createElement('div');
        crossH.id = 'crossH';
        crossH.style.cssText = crossS.style.cssText;
        div.appendChild(crossH); 

        let crossV = document.createElement('div');
        crossV.id = 'crossV';
        crossV.style.cssText = crossS.style.cssText;
        div.appendChild(crossV);
            
        let crossCirc = document.createElement('div');
        crossCirc.id = 'crossCirc';
        crossCirc.style.cssText = crossS.style.cssText;
        div.appendChild(crossCirc); 
            
        let crossImg = document.createElement('div');
        crossImg.id = 'crossImg';
        crossImg.style.cssText = `  
            position: fixed;
            top: 0;
            left: 0;
            margin: auto;
            width: 100%;
            height: 100%;
            background-repeat: no-repeat;
            background-position: center;
            display: none`;
        div.appendChild(crossImg); 

        inGameUI.appendChild(div); 
    }
    
    updateCrosshair() {
        if (this.settings.customCrosshair.val == 0 || !this.settings.customCrosshairAlwaysShow.val && (aimDot.style.opacity != "0" || aimRecticle.style.opacity != "0")) return custCross.style.display = 'none';
        custCross.style.display = 'block';
        
        let shadow = this.hexToRGB(this.settings.customCrosshairShadow.val);
        let thickness = parseInt(this.settings.customCrosshairThickness.val);
        let length = parseInt(this.settings.customCrosshairLength.val);
        let color = this.settings.customCrosshairColor.val;
        let shape = parseInt(this.settings.customCrosshairShape.val);

        if (shape == 0) { // CROSS
            crossV.style.display = 'block';
            crossH.style.display = 'block';
            crossS.style.display = 'block';
            crossCirc.style.display = 'none';
            crossImg.style.display = 'none';

            crossV.style.height = `${length * 2}px`;
            crossV.style.width = `${thickness}px`;
            crossV.style.backgroundColor = `${color}`;

            crossH.style.height = `${thickness}px`;
            crossH.style.width = `${length * 2}px`;
            crossH.style.backgroundColor = `${color}`;
            crossH.style.boxShadow = `0px 0px 5px 1px rgba(${shadow.join(',')},0.75)`;

            crossS.style.height = `${length * 2}px`;
            crossS.style.width = `${thickness}px`;
            crossS.style.backgroundColor = `${color}`;
            crossS.style.boxShadow = `0px 0px 5px 1px rgba(${shadow.join(',')},0.75)`;
                
        } else if (shape == 3) { // IMAGE
        
            crossV.style.display = 'none';
            crossH.style.display = 'none';
            crossS.style.display = 'none';
            crossCirc.style.display = 'none';
            crossImg.style.display = 'block';

            if (crossImg.style.backgroundImage != this.settings.customCrosshairImage.val) {
                crossImg.style.backgroundImage = `url(${this.settings.customCrosshairImage.val})`;
            }
            
        } else { // HOLLOW CIRCLE | FILLED CIRCLE
        
            crossV.style.display = 'none';
            crossH.style.display = 'none';
            crossS.style.display = 'none';
            crossCirc.style.display = 'block';
            crossImg.style.display = 'none';

            crossCirc.style.height = `${length * 2}px`;
            crossCirc.style.width = `${length * 2}px`;
            crossCirc.style.backgroundColor = shape == 2 || shape == 5 ? `${color}` : ``;
            crossCirc.style.border = shape == 2 || shape == 5 ? `` : `${thickness}px solid ${color}`;
            crossCirc.style.boxShadow = `0px 0px 5px 1px rgba(${shadow.join(',')},0.75)`;
            crossCirc.style.borderRadius = shape > 3 ? '':'50%';

        }
        
    }

    createObservers() {
        this.newObserver(crosshair, 'style', (target) => {
            if (this.settings.customCrosshair.val == 0) return;
            crosshair.style.opacity = this.crosshairOpacity(crosshair.style.opacity);
        }, false);
        
        this.newObserver(aimDot, 'src', (target) => {
            if (this.settings.customADSDot.val.length > 1) {
                if (this.settings.customADSDot.val != target.src) {
                    target.src = this.settings.customADSDot.val;
                }
            }
        });
        
        this.newObserver(killCardHolder, 'style', () => {
            this.deaths++;
            deathsVal.innerHTML = this.deaths; 
        });

        this.newObserver(victorySub, 'src', () => {
            this.deaths = 0;
            deathsVal.innerHTML = this.deaths;
            
            if (this.settings.matchEndMessage.val.length) {
                if (Date.now() - this.lastSent > 20) {
                    this.sendMessage(this.settings.matchEndMessage.val);
                    this.lastSent = Date.now();
                }
            }
        });
        
        this.newObserver(instructionHolder, 'style', (target) => {
            if (this.settings.autoFindNew.val) {
                if (target.innerText.includes('Try seeking a new game') &&
                    !target.innerText.includes('Subscribe to Krunker News')) {
                        location = document.location.origin;
                    }
            }
        });
    }
    
    newObserver(elm, check, callback, onshow = true) {
        return new MutationObserver((mutationsList, observer) => {
            if (check == 'src' || onshow && mutationsList[0].target.style.display == 'block' || !onshow) {
                callback(mutationsList[0].target);
            }
        }).observe(elm, check == 'childList' ? {childList: true} : {attributes: true, attributeFilter: [check]});
    }
    
    sendMessage(msg) {
        chatInput.value = msg;
        chatInput.focus()
        window.pressButton(13);
        chatInput.blur();
    }

    createWatermark() {
        const el = document.createElement("div");
        el.id = "watermark";
        el.style.position = "absolute";
        el.style.color = "rgba(50,205,50, 0.3)";
        el.style.bottom = "0";
        el.style.left = "20px";
        el.style.fontSize = "6pt";
        el.innerHTML = "Subscribe to Krunker News";
        gameUI.appendChild(el);
    }

    crosshairOpacity(val) {
        return parseInt(this.settings.customCrosshair.val) == 1 ? 0 : val;
    }

    render() {
        this.updateCrosshair();
        window.requestAnimationFrame(_ => this.render());
    }

    resetSettings() {
        if (confirm("Are you sure you want to reset all your utilties settings? This will also refresh the page")) {
            Object.keys(localStorage).filter(x=>x.includes("kro_set_utilities_")).forEach(x => localStorage.removeItem(x));
            location.reload();
        }
    }

    setSetting(t, e) {
        this.settings[t].val = e;
        saveVal(`kro_set_utilities_${t}`, e);
        if (document.getElementById(`slid_utilities_${t}`)) document.getElementById(`slid_utilities_${t}`).innerHTML = e;
        if (this.settings[t].set) this.settings[t].set(e);
    }

    keyDown(event) {
        if (document.activeElement.tagName == "INPUT") return;
        switch(event.key){
            case '`':
                if (event.ctrlKey || event.shiftKey) return;
                document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
                document.exitPointerLock();
                window.showWindow(window.windows.length);
                break;
        }
    }

    onLoad() {
        this.createCrosshair();
        this.createWatermark();
        this.createDeathCounter();;
        this.createSettings();
        this.createObservers();
        window.addEventListener("keydown", event => this.keyDown(event));
        window.requestAnimationFrame(_ => this.render());
    }
}

document.addEventListener('DOMContentLoaded', _ => {
    window.utilities = new Utilities();
}, false);