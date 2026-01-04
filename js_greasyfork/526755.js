// ==UserScript==
// @name         Vortex
// @version      -
// @description  -
// @match        https://sploop.io/
// @icon         https://i.imgur.com/1REccXW.png
// @run-at       document-start
// @grant        none
// @namespace https://greasyfork.org/users/1434229
// @downloadURL https://update.greasyfork.org/scripts/526755/Vortex.user.js
// @updateURL https://update.greasyfork.org/scripts/526755/Vortex.meta.js
// ==/UserScript==

const resources = {
    wallpapers: "https://i.imgur.com/ybnsAVD.jpeg",
    settings: "https://i.imgur.com/FOahlaF.png",
    palette: "https://i.imgur.com/8wmJKgD.png",

    flowerFirst: "https://i.imgur.com/FUJR2mI.png",
    flowerSecond: "https://i.imgur.com/nhGgidV.png",
    flowerThird: "https://i.imgur.com/Osm31mO.png",

    stoneFirst: "",
    stoneSecond: "",

    cookie: "https://i.imgur.com/23FWsc7.png"
}

class HTML {
    static header (name) {
        return `<div class = "page-header">
                <h1> ${name} </h1>
                </div>`;
    }
    static checkbox (name, id, state) {
        return `<div class = "check-box-style">
                ${name}
                <input type = "checkbox" id = "${id}" style = "margin-bottom: 7.5px;" ${state}/>
                </div>`;
    }
    static button (name, id) {
        return `<button id = "${id}" class = "button-style" style = "color: white"> ${name} </button>`;
    }
    static setupButton (name, id) {
        return `<button id = "${id}" style = "display: flex; align-items: center; justify-content: space-between"> ${name} </button>`;
    }
    static newline () {
        return `<br>`;
    }
    static whiteline () {
        return `<hr>`;
    }
    static startHolderDiv(holderID, buttonID, buttonNAME, contentID) {
        return `<div class="add-options-holder" id="${holderID}" style="height: 35px;">
                <div class="static-options-holder">
                    <div style="margin-left: 10px;" class="cool-text">${buttonNAME}</div>
                    <button id="${buttonID}" class="option-button-holder">
                        <img src="${resources.settings}" style="width: 25px; height: 25px; margin-top: 4.85px;" />
                    </button>
                </div>
                <div id="${contentID}" class="content" style="max-height: 0; overflow: hidden; transition: max-height 0.15s ease-in-out; margin-top: -6px;">
        `;
    }

    static closeDiv() {
        return `</div></div>`;
    }
    static color (id, name, color) {
        return `
        <div class="option-color" style = "font-size: 15px; color: gray;">
        ${name}
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <input type="color" id="${id}" value="${color}" class="color-style"/>
            <img src = "${resources.palette}" style = "width: 25px; height: 25px"/>
        </div>
        </div>
        `
    }
    static bind (name, id, bind) {
        return `
        <div class="new-binds-section">
            ${name}
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <input type="text" id="${id}" style = "width: 50px; text-align: center; border: none; border-radius: 8px; outline: none; height: 25px; background-color: rgba(0, 0, 0, 0.50); color: #fff;" value = "${bind}"/>
            </div>
        </div>`;
    }
}

class get {
    static El (id) {
        return document.getElementById(id);
    }
    static Val (id) {
        return document.getElementById(id).value;
    }
    static crEl (style) {
        return document.createElement(style);
    }
}

class menu {
    static style(name, id, leftOffset, topOffset, height) {
        name.id = id;
        name.className = "menu-items";
        name.style = `
        display: block;
        position: fixed;
        top: ${topOffset}px;
        background-color: #16171a;
        border: 3px solid #1f2024;
        color: white;
        border-radius: 8px;
        max-height: ${height}px;
        width: 200px;
        z-index: 999;
        transform-origin: center center;
        margin-left: calc(${leftOffset}vw - 115px);
    `;
    }
}

const firstPage = get.crEl("div");
menu.style(firstPage, "firstPage", "25", "10", "999");

const secondPage = get.crEl("div");
menu.style(secondPage, "secondPage", "36", "10", "999");

const thirdPage = get.crEl("div");
menu.style(thirdPage, "thirdPage", "47", "10", "999");

const fourthPage = get.crEl("div");
menu.style(fourthPage, "fourthPage", "58", "10", "999");

const fifthPage = get.crEl("div");
menu.style(fifthPage, "fifthPage", "69", "10", "999");


const night = get.crEl("div");
night.id = "night";
night.style = "width: 100%; height: 100%; display: block; position: absolute; pointer-events: none; background-color: rgb(0 0 0 / 0%); opacity: 50%;";

const displays = get.crEl("div");
displays.id = "displays";
displays.style = `left: 10px; top: 10px; width: auto; max-height: 300px; display: block; position: absolute; pointer-events: none; background-color: rgb(0 0 0 / 0%); color: #fff;`;

const arrayList = get.crEl("div");
arrayList.id = "arrayList";
arrayList.style = `left: 10px; top: 120px; width: auto; max-height: 900px; display: block; position: absolute; pointer-events: none; background-color: rgb(0 0 0 / 0%); color: #fff; backdrop-filter: blur(0px); border-radius: 18px;`;

const cookie = get.crEl("div");
cookie.id = "cookieSigma";
cookie.src = resources.cookie;

window.addEventListener("DOMContentLoaded", () => {

    firstPage.innerHTML = `
    ${HTML.header("Combat")}
    <div style="overflow-y: scroll; max-height: 700px;">
    ${HTML.newline()}
    ${HTML.startHolderDiv("auto-heal-holder", "auto-heal-button", "Auto heal", "auto-heal-content")}
    ${HTML.newline()}
    ${HTML.checkbox("Toggle", "auto-heal", "checked")}
    ${HTML.closeDiv()}
    ${HTML.newline()}
    ${HTML.startHolderDiv("auto-break-holder", "auto-break-button", "Auto break", "auto-break-content")}
    ${HTML.newline()}
    ${HTML.checkbox("Toggle", "auto-break", "checked")}
    ${HTML.newline()}
    ${HTML.checkbox("Equip demolist", "equip-demolist", "checked")}
    ${HTML.newline()}
    ${HTML.checkbox("Equip prev hat", "equip-demolist-prev-hat", "checked")}
    ${HTML.closeDiv()}
    ${HTML.newline()}
    ${HTML.startHolderDiv("auto-insta-holder", "auto-insta-button", "Auto insta", "auto-insta-content")}
    ${HTML.newline()}
    ${HTML.checkbox("Toggle", "auto-insta", "checked")}
    ${HTML.newline()}
    ${HTML.checkbox("Equip berserker", "equip-berserker", "checked")}
    ${HTML.newline()}
    ${HTML.checkbox("Equip prev hat", "equip-berserker-prev-hat", "")}
    ${HTML.closeDiv()}
    ${HTML.newline()}
    ${HTML.startHolderDiv("hats-holder", "hats-button", "Hats", "hats-content")}
    ${HTML.newline()}
    ${HTML.checkbox("Auto buy", "auto-buy", "checked")}
    ${HTML.newline()}
    ${HTML.checkbox("Auto hats", "auto-hats", "checked")}
    ${HTML.newline()}
    ${HTML.checkbox("Hat macros", "hat-macro", "checked")}
    ${HTML.closeDiv()}
    ${HTML.newline()}
    ${HTML.startHolderDiv("placement-holder", "placement-button", "Placement", "placement-content")}
    ${HTML.newline()}
    ${HTML.checkbox("Auto place", "auto-place", "")}
    ${HTML.newline()}
    ${HTML.checkbox("Fast place", "fast-place", "")}
    ${HTML.newline()}
    ${HTML.checkbox("Macros", "placement-macro", "checked")}
    ${HTML.closeDiv()}
    </div>
    ${HTML.newline()}
    `;

    secondPage.innerHTML = `
    ${HTML.header("Utils")}
    <div style="overflow-y: scroll; max-height: 700px;">
    ${HTML.newline()}
    ${HTML.startHolderDiv("auto-respawn-holder", "auto-respawn-button", "Auto respawn", "auto-respawn-content")}
    ${HTML.newline()}
    ${HTML.checkbox("Toggle", "auto-respawn", "checked")}
    ${HTML.closeDiv()}
    ${HTML.newline()}
    ${HTML.startHolderDiv("anti-holder", "anti-button", "Anti trap", "anti-content")}
    ${HTML.newline()}
    ${HTML.checkbox("Toggle", "anti-trap", "checked")}
    ${HTML.closeDiv()}
    ${HTML.newline()}
    ${HTML.startHolderDiv("pick-holder", "pick-button", "Auto pick", "pick-content")}
    ${HTML.newline()}
    ${HTML.checkbox("Toggle", "auto-pick", "")}
    ${HTML.closeDiv()}
    ${HTML.newline()}
    ${HTML.startHolderDiv("mouse-holder", "mouse-button", "Mouse", "mouse-content")}
    ${HTML.newline()}
    ${HTML.checkbox("WClick", "w-click", "")}
    ${HTML.closeDiv()}
    ${HTML.newline()}
    ${HTML.startHolderDiv("pearl-holder", "pearl-button", "Quick pearl", "pearl-content")}
    ${HTML.newline()}
    ${HTML.checkbox("Toggle", "quick-pearl", "")}
    ${HTML.closeDiv()}
    </div>
    ${HTML.newline()}
    `;

    thirdPage.innerHTML = `
    ${HTML.header("Visual")}
    <div style="overflow-y: scroll; max-height: 700px;">
    ${HTML.newline()}
    ${HTML.startHolderDiv("night-holder", "night-button", "Night", "night-content")}
    ${HTML.newline()}
    ${HTML.checkbox("Toggle", "night-mode", "")}
    ${HTML.newline()}
    ${HTML.color("night-color", "Night color", "#211b55")}
    ${HTML.closeDiv()}
    ${HTML.newline()}
    ${HTML.startHolderDiv("tracers-holder", "tracers-button", "Tracers", "tracers-content")}
    ${HTML.newline()}
    ${HTML.checkbox("Toggle", "tracers", "")}
    ${HTML.newline()}
    ${HTML.color("team-tracer-color", "Team color", "#8ECC51")}
    ${HTML.newline()}
    ${HTML.color("animal-tracer-color", "Animal color", "#5191CC")}
    ${HTML.newline()}
    ${HTML.color("enemy-tracer-color", "Enemy color", "#CC5151")}
    ${HTML.closeDiv()}
    ${HTML.newline()}
    ${HTML.startHolderDiv("markers-holder", "markers-button", "Markers", "markers-content")}
    ${HTML.newline()}
    ${HTML.checkbox("Toggle", "markers", "")}
    ${HTML.newline()}
    ${HTML.color("mine-marker-color", "Mine color", "#8ECC51")}
    ${HTML.newline()}
    ${HTML.color("team-marker-color", "Team color", "#5191CC")}
    ${HTML.newline()}
    ${HTML.color("enemy-marker-color", "Enemy color", "#CC5151")}
    ${HTML.closeDiv()}
    ${HTML.newline()}
    ${HTML.startHolderDiv("decorations-holder", "decorations-button", "Decorations", "decorations-content")}
    ${HTML.newline()}
    ${HTML.checkbox("Flowers (x)", "flowers", "")}
    ${HTML.newline()}
    ${HTML.checkbox("Stones (x)", "stones", "")}
    ${HTML.closeDiv()}
    ${HTML.newline()}
    ${HTML.startHolderDiv("auto-push-line-holder", "auto-push-line-button", "Push line", "auto-push-line-content")}
    ${HTML.newline()}
    ${HTML.checkbox("Toggle", "auto-push-line", "")}
    ${HTML.newline()}
    ${HTML.color("auto-push-line-color", "Push line color", "#00ff00")}
    ${HTML.closeDiv()}
    ${HTML.newline()}
    ${HTML.startHolderDiv("weapon-range-holder", "weapon-range-button", "Weapon range", "weapon-range-content")}
    ${HTML.newline()}
    ${HTML.checkbox("Toggle", "weapon-range", "")}
    ${HTML.newline()}
    ${HTML.color("weapon-range-color", "Color", "#00ff00")}
    ${HTML.newline()}
    ${HTML.checkbox("Fill", "weapon-range-fill", "")}
    ${HTML.newline()}
    ${HTML.checkbox("Shadow", "weapon-range-shadow", "")}
    ${HTML.closeDiv()}
    ${HTML.newline()}
    ${HTML.startHolderDiv("anim-text-holder", "anim-text-button", "Anim text", "anim-text-content")}
    ${HTML.newline()}
    ${HTML.checkbox("Hide heal text", "hide-heal-text", "")}
    ${HTML.newline()}
    ${HTML.checkbox("Hide dmg text", "hide-dmg-text", "")}
    ${HTML.closeDiv()}
    ${HTML.newline()}
    ${HTML.startHolderDiv("health-bar-holder", "health-bar-button", "Health bar", "health-bar-content")}
    ${HTML.newline()}
    ${HTML.color("team-mine-health-bar-color", "Team/Mine", "#a4cc4f")}
    ${HTML.newline()}
    ${HTML.color("enemy-animal-health-bar-color", "Enemy/Animal", "#cc5151")}
    ${HTML.closeDiv()}
    </div>
    ${HTML.newline()}
    `;

    fourthPage.innerHTML = `
    ${HTML.header("Movement")}
    <div style="overflow-y: scroll; max-height: 700px;">
    ${HTML.newline()}
    ${HTML.startHolderDiv("auto-push-holder", "auto-push-button", "Auto push", "auto-push-content")}
    ${HTML.newline()}
    ${HTML.checkbox("Toggle", "auto-push", "")}
    ${HTML.closeDiv()}
    ${HTML.newline()}
    ${HTML.startHolderDiv("path-finder-holder", "path-finder-button", "Path finder", "path-finder-content")}
    ${HTML.newline()}
    ${HTML.checkbox("Toggle", "path-finder", "")}
    ${HTML.newline()}
    ${HTML.bind("Pos x", "pos-x", "0")}
    ${HTML.newline()}
    ${HTML.bind("Pos y", "pos-y", "0")}
    ${HTML.closeDiv()}
    </div>
    ${HTML.newline()}
    `;

    fifthPage.innerHTML = `
    ${HTML.header("Display")}
    <div style="overflow-y: scroll; max-height: 700px;">
    ${HTML.newline()}
    ${HTML.startHolderDiv("display-holder", "display-button", "Display", "display-content")}
    ${HTML.newline()}
    ${HTML.checkbox("Ping display", "ping-display", "checked")}
    ${HTML.newline()}
    ${HTML.checkbox("Fps display", "fps-display", "checked")}
    ${HTML.newline()}
    ${HTML.checkbox("Time display", "time-display", "checked")}
    ${HTML.closeDiv()}
    ${HTML.newline()}
    ${HTML.startHolderDiv("blur-holder", "blur-button", "Blur", "blur-content")}
    ${HTML.newline()}
    ${HTML.checkbox("Clan menu", "clan-menu-blur", "")}
    ${HTML.newline()}
    ${HTML.checkbox("Shop menu", "shop-menu-blur", "")}
    ${HTML.closeDiv()}
    ${HTML.newline()}
    ${HTML.startHolderDiv("array-list-holder", "array-list-button", "Array List", "array-list-content")}
    ${HTML.newline()}
    ${HTML.checkbox("Toggle", "array-list-display", "")}
    ${HTML.newline()}
    ${HTML.checkbox("Blur", "array-list-blur", "")}
    ${HTML.closeDiv()}
    </div>
    ${HTML.newline()}
    `;

    displays.innerHTML = `
    <div style = "display: flex; flex-direction: column;">
    <div id = "pingInner" class = "cool-text"> Ping: connecting </div>
    <div id = "fpsInner" class = "cool-text"> Fps: 0 </div>
    <div id = "timeInner" class = "cool-text"> Time: </div>
    </div>
    `;

    document.body.appendChild(firstPage);
    document.body.appendChild(secondPage);
    document.body.appendChild(thirdPage);
    document.body.appendChild(fourthPage);
    document.body.appendChild(fifthPage);
    document.body.appendChild(night);
    document.body.appendChild(displays);
    document.body.appendChild(arrayList);
    document.body.appendChild(cookie);
    setInterval(() => {
        const features = [
            { id: "auto-heal", text: "Auto heal" },
            { id: "auto-break", text: "Auto break" },
            { id: "auto-insta", text: "Auto insta" },
            { id: "auto-hats", text: "Auto hats" },
            { id: "auto-buy", text: "Auto buy" },
            { id: "auto-place", text: "Auto place" },
            { id: "fast-place", text: "Fast place" },
            { id: "auto-respawn", text: "Auto respawn" },
            { id: "anti-trap", text: "Anti trap" },
            { id: "auto-pick", text: "Auto pick" },
            { id: "w-click", text: "WClick" },
            { id: "night-mode", text: "Night mode" },
            { id: "tracers", text: "Tracers" },
            { id: "markers", text: "Markers" },
            { id: "auto-push-line", text: "Push line" },
            { id: "weapon-range", text: "Weapon range" },
            { id: "hide-heal-text", text: "Hide heal text" },
            { id: "hide-dmg-text", text: "Hide dmg text" },
            { id: "auto-push", text: "Auto push" },
            { id: "path-finder", text: "Path finder" },
            { id: "ping-display", text: "Ping display" },
            { id: "fps-display", text: "Fps display" },
            { id: "time-display", text: "Time display" },
            { id: "clan-menu-blur", text: "Clan menu blur" },
            { id: "shop-menu-blur", text: "Shop menu blur" },
            { id: "array-list-display", text: "Array list display" },
            { id: "array-list-blur", text: "Array list blur" },
            { id: "hat-macro", text: "Hat macro" },
            { id: "placement-macro", text: "Placement macro" },
            { id: "quick-pearl", text: "Quick pearl" },
        ];

        const checkedFeatures = features
        .filter(feature => get.El(feature.id).checked)
        .map(feature => `<div class="cool-text"> ${feature.text} </div>`);

        if (get.El("array-list-display").checked) {
            get.El("arrayList").innerHTML = checkedFeatures.length > 0 ?
                `<div style="display: flex; flex-direction: column;"> ${checkedFeatures.join('')} </div>` :
            '';
        } else {
            get.El("arrayList").innerHTML = "";
        }

        if (get.El("array-list-blur").checked) {
            get.El("arrayList").style.backdropFilter = "blur(5px)";
        } else {
            get.El("arrayList").style.backdropFilter = "blur(0px)";
        }
    }, 15);

    const toggleContent = (contentId, holderId) => {
        const content = get.El(contentId);
        const holder = get.El(holderId);
        const isExpanded = content.style.maxHeight !== "0px" && content.style.maxHeight !== "";
        const targetHeight = isExpanded ? "35px" : `${content.scrollHeight + 37.5}px`;

        content.style.maxHeight = isExpanded ? "0" : `${content.scrollHeight + 37.5}px`;
        holder.style.height = targetHeight;
        holder.style.transition = "height 0.15s ease-in-out";
    };

    const toggleFunctions = [
        "auto-heal", "auto-break", "auto-insta", "hats", "placement", "auto-respawn",
        "night", "auto-push", "path-finder", "anti", "pick", "display", "tracers",
        "markers", "decorations", "auto-push-line", "weapon-range", "mouse", "blur",
        "anim-text", "health-bar", "array-list", "pearl",
    ];

    toggleFunctions.forEach(id => {
        get.El(`${id}-button`).addEventListener("click", () => toggleContent(`${id}-content`, `${id}-holder`));
    });

    setInterval(() => {
        if (get.El("night-mode").checked) {
            get.El("night").style.backgroundColor = get.Val("night-color");
        } else {
            get.El("night").style.backgroundColor = "rgba(0, 0, 0, 0)";
        }
    }, 0);

    let styleItems = `
    ::-webkit-scrollbar {
  display: none;
  border-radius: 4px;
  outline: none;
}
@keyframes appear {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes disappear {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

.menu-items {
  animation: appear 0.5s ease-in-out;
  opacity: 1;
  transform: scale(1);
}

.menu-items.hidden {
  animation: disappear 0.5s ease-in-out forwards;
}
.new-binds-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -10px;
  font-family: "Montserrat", sans-serif;
    font-size: 15px;
    font-weight: 100;
    color: gray;
    margin-left: 10px;
    margin-right: 5px;
}
    .option-color {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -10px;
  margin-left: 10px;
  margin-right: 6px;
  font-family: "Montserrat", sans-serif;
    font-size: 15px;
    font-weight: 100;
    color: gray;
}
.color-style {
  padding: 0 1px;
  margin: 0;
  height: 24px;
  cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;
  background-color: rgba(0, 0, 0, 0);
  color: rgba(0, 0, 0, 0);
  border: none;
  outline: none;
  margin-right: -40px;
  opacity: 0.1%;
}
    .option-button-holder {
    border: none;
    outline: none;
    background-color: rgba(0, 0, 0, 0);
    }
    .add-options-holder {
    border-radius: 8px;
    margin-left: 5px;
    margin-right: 5px;
    height: 35px;
    background-color: #21242b;
    text-align: left;
    color: gray;
    font-family: "Montserrat", sans-serif;
    font-size: 15px;
    font-weight: 100;
    }
    .static-options-holder {
    border-radius: 8px;
    align-items: center;
    justify-content: space-between;
    display: flex;
    margin-right: 5px;
    margin-top: -10px;
    height: 35px;
    background-color: #21242b;
    text-align: left;
    color: gray;
    font-family: "Montserrat", sans-serif;
    font-size: 15px;
    font-weight: 100;
    }
    .cool-text {
    font-family: "Montserrat", sans-serif;
    font-size: 15px;
    font-weight: 100;
    }
    .page-header {
    text-align: center;
    margin-top: 10px;
    font-family: Montserrat, sans-serif;
    }
    .page-header h1 {
    font-family: "Montserrat", sans-serif;
    font-size: 18px;
    font-weight: 100;
    }
    #homepage {
    background-image: url(${resources.wallpapers}) !important;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    }
    .check-box-style {
    margin-top: -13px;
    align-items: center;
    justify-content: space-between;
    display: flex;
    font-family: "Montserrat", sans-serif;
    font-size: 15px;
    font-weight: 100;
    padding-left: 10px;
    padding-right: 5px;
    }
    .background-img-play, #small-waiting, #logo, #main-login-button, #main-sign-up-button, #nav, #cross-promo, #bottom-wrap, #google_play, #game-left-content-main, #game-bottom-content, #game-right-content-main, #right-content, #left-content, #settings {
    display: none !important;
    }
    #game-content {
    justify-content: center;
    }
    #main-content {
    width: auto;
    }
    input:checked[type="checkbox"] {
    background: #3f454d;
    transition: background 0.3s ease-in-out;
    }
    input[type="checkbox" i] {
    background-color: initial;
    cursor: default;
    appearance: auto;
    box-sizing: border-box;
    margin: 3px 3px 3px 4px;
    padding: initial;
    border: initial;
    }
    input:checked[type="checkbox"]::after {
    left: 55%;
    }
    input[type="checkbox"]::after {
    position: absolute;
    content: "";
    width: 15px;
    height: 15px;
    top: -2.15px;;
    left: 0;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    transition: 0.4s;
    }
    input[type="checkbox"] {
    position: relative;
    appearance: none;
    width: 30px;
    height: 10px;
    background: #3f454d;
    border-radius: 8px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;
    top: 4px;
    transition: 0.4s;
    }
    `;
    const styleItemsUpd = get.crEl("style");
    styleItemsUpd.type = "text/css";
    styleItemsUpd.innerText = styleItems;
    document.head.appendChild(styleItemsUpd);
});


document.addEventListener('DOMContentLoaded', function() {
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, user-scalable=no';
    document.getElementsByTagName('head')[0].appendChild(meta);
    document.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '-' || event.key === '=')) {
            event.preventDefault();
        }
    });
    document.addEventListener('wheel', function(event) {
        if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
        }
    }, { passive: false });
    document.addEventListener('touchstart', function(event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });
    document.addEventListener('gesturestart', function(event) {
        event.preventDefault();
    });
    document.addEventListener('gesturechange', function(event) {
        event.preventDefault();
    });
    document.addEventListener('gestureend', function(event) {
        event.preventDefault();
    });
    get.El("game-canvas").onclick = () => {
        if (get.El("w-click").checked) {
            sendPacket(packets.hit, 255 & mouseAngle, mouseAngle >> 8 & 255);
            sendPacket(packets.stopAttack);
            sendPacket(packets.hit, 255 & mouseAngle, mouseAngle >> 8 & 255);
            sendPacket(packets.stopAttack);
        }
    }

});


let frames = 0,
    lastTime,
    lastUpdate = 0,
    frameCount = 0;
window.updateFPSCounter = (currentTime) => {
    const elapsedSeconds = (currentTime - (lastTime || (lastTime = currentTime))) / 1000;
    frameCount++;
    if (elapsedSeconds >= 1) {
        if (get.El('fps-display').checked) {
            get.El("fpsInner").innerHTML = `Fps: ${Math.round(frameCount / elapsedSeconds)}`;
        } else {
            get.El("fpsInner").innerHTML = '';
        }
        frameCount = 0;
        lastTime = currentTime;
    };
};

setInterval(() => {
    if (get.El("time-display").checked) {
        get.El("timeInner").innerHTML = `Time: ${new Date().toLocaleTimeString()}`;
    } else {
        get.El("timeInner").innerHTML = '';
    }
    if (get.El("shop-menu-blur").checked) {
        get.El('hat-menu').style.backdropFilter = "blur(5px)";
    } else {
        get.El('hat-menu').style.backdropFilter = "blur(0px)";
    }
    if (get.El("clan-menu-blur").checked) {
        get.El('clan-menu').style.backdropFilter = "blur(5px)";
    } else {
        get.El('clan-menu').style.backdropFilter = "blur(0px)";
    }
}, 1000);

const binds = {
    trap: "KeyF",
    spike: "KeyV",
    wall: "Digit4",
    mill: "KeyN",
    food: "KeyQ",
    platform: "...",
    turret: "...",

    bushHat: "...",
    berserkerHat: "KeyB",
    jungleGear: "...",
    crystalGear: "KeyC",
    spikeGear: "...",
    immunityGear: "KeyG",
    boostHat: "KeyM",
    appleHat: "...",
    scubaGear: "...",
    hood: "KeyK",
    demolist: "KeyZ",

    pearl: "KeyT",
}

const hats = {
    bushHat: 1,
    berserkerHat: 2,
    jungleGear: 3,
    crystalGear: 4,
    spikeGear: 5,
    immunityGear: 6,
    boostHat: 7,
    appleHat: 8,
    scubaGear: 9,
    hood: 10,
    demolist: 11
}

const packets = {
    item: 0,
    move: 1,
    itemByID: 2,
    hat: 5,
    chat: 7,
    place: 8,
    joinGame: 11,
    angle: 13,
    upgrade: 14,
    stopMove: 15,
    clanAcc: 17,
    stopAttack: 18,
    hit: 19,
    joinClan: 21,
    clan: 22,
    EAttack: 23,
    clanLeave: 24
}

const serverPackets = {
    pingServer: 0,
    updateLeaderBoard: 3,
    age_barWmats: 8,
    chooseItem: 14,
    pingUpdate: 15,
    updateClan: 16,
    clanRequest: 17,
    death: 19,
    getKill: 22,
    createClan: 24,
    clanRemove: 27,
    killText: 28,
    attackAnimation: 29,
    updateEntities: 20,
    playerSpawn: 32,
    getMyID: 33,
    spawn: 35,
    itemCount: 36
}

let hue = 0;

let replaceInterval = setInterval(() => {
    if (CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = ((oldFunc) => function() { if (this.fillStyle == "") this.fillStyle = `hsl(${hue}, 100%, 50%)`; return oldFunc.call(this, ...arguments); })(CanvasRenderingContext2D.prototype.roundRect);
        clearInterval(replaceInterval);
    }}, 10);

const changeHue = () => {
    hue += Math.random() * 3;
}

setInterval(changeHue, 10);


let kh = [1, 12, 9, 19, 20, 15, 8, 17, 16];

let traps = [];
let teammates = [];

let Entity = new Array();
let myWS,
    weaponInHands = 0,
    ping = 100,
    PI = 3.141592653589793,
    PI2 = 6.283185307179586,
    mouseAngle,
    mouseX,
    mouseY,
    inRiver = false,
    buyed = false,
    myPlayer = { id: null, clown: false, inRiver: false },
    hatReloaded = true;

window.getWS = (websocket) => {
    myWS = websocket;
    websocket.onclose = () => {
        myWS = undefined;
        buyed = false;
    };
};


const autoRespawnElement = () => {
    return myWS.send(JSON.stringify([10, localStorage.nickname, localStorage.skin, "", localStorage.accessory, localStorage.accMail, localStorage.accToken, localStorage.back]));
}

const toRad = (angle) => {
    while (angle < 0) {
        angle += 360;
    };
    while (angle >= 360) {
        angle -= 360;
    };
    return (angle * Math.PI) / 180;
};
const toDegree = (angle) => {
    return ((angle * 180) / Math.PI);
};
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const formatAge = age => Math.floor(Math.log(1 + Math.max(0, age)) ** 2.4 / 13);
let formatEnemy = {
    x: 0,
    y: 0,
}
window.receiveMsg = async ({ data }) => {
    const decoded = typeof data === "string" ? JSON.parse(data) : new Uint8Array(data);
    switch (decoded[0]) {
        case serverPackets.attackAnimation:
            for (let i = 1; i < decoded.length; i += 5) {
                const type = decoded[i]
                , id = decoded[i + 1] | decoded[i + 2] << 8
                , weapon = decoded[i + 3];
                let isObject = decoded[i + 4];
            }
            break;
        case serverPackets.playerSpawn:
            break
        case serverPackets.chooseItem:
            if (get.El("auto-pick").checked) kh.forEach(id => sendPacket(packets.upgrade, decoded[1].find(id2 => id === id2)));
            break;
        case serverPackets.getMyID:
            myPlayer.id = decoded[1];
            break;
        case serverPackets.pingUpdate:
            ping = decoded[1];
            get.El('ping-display').checked ? get.El("pingInner").innerHTML = "Ping: "+ ping + "" : get.El("pingInner").innerHTML = "";
            break;
        case serverPackets.spawn:
            if (!buyed && get.El("auto-buy").checked) {
                for (let i = 0; i < 12; i++) sendPacket(packets.hat, i);
                buyed = true;
            };
            break;
        case serverPackets.death:
            if (get.El("auto-respawn").checked) autoRespawnElement();
            break;
        case serverPackets.getKill:
            break
        case serverPackets.updateClan: {
            const array_with_ID = [...decoded.slice(2, decoded.length)];
            array_with_ID.splice(array_with_ID.indexOf(myPlayer.id), 1);
            teammates = array_with_ID;
            return;
        }
        case serverPackets.createClan: {
            const array_with_ID = [...decoded.slice(3, decoded.length)];
            array_with_ID.splice(array_with_ID.indexOf(myPlayer.id), 1);
            teammates = array_with_ID;
            break;
        }
        case serverPackets.clanRemove:
            teammates = [];
            break;
        case serverPackets.updateEntities: {
            for (let i = 1; i < decoded.length; i += 19) {
                const newEnemy = {
                    type: decoded[i],
                    id: decoded[i + 1],
                    hat: decoded[i + 11],
                    teamID: decoded[i + 12],
                    x: decoded[i + 4] | decoded[i + 5] << 8,
                    y: decoded[i + 6] | decoded[i + 7] << 8,
                    index: decoded[i + 2] | decoded[i + 3] << 8,
                    health: Math.ceil(decoded[i + 13] / 2.55),
                    angle: decoded[i + 9] * 0.02454369260617026 - PI,
                    broken: decoded[i + 8]
                }
                newEnemy.id === myPlayer.id && Object.assign(myPlayer, newEnemy);
                window.myPlayer = newEnemy;

                if (newEnemy.broken & 2) {
                    if (myPlayer.inTrap && myPlayer.inTrap.index === newEnemy.index) {
                        myPlayer.inTrap = false;
                        clearInterval(hatInterval);
                        hatInterval = setInterval(() => {
                            if (hatReloaded) {
                                clearInterval(hatInterval);
                                equipHat(myPlayer.prevHat);
                            };
                        }, 10)
                    };

                    traps = traps.filter(trap => trap.index !== newEnemy.index);

                } else {
                    if (newEnemy.type === 6) {
                        traps.push(newEnemy);

                    } else if (get.El("auto-break").checked && newEnemy.id === myPlayer.id && newEnemy.broken !== 16) {
                        const trap = traps.find(trap => Math.hypot(myPlayer.x - trap.x, myPlayer.y - trap.y) <= 52 && trap.id !== myPlayer.id && !teammates.includes(trap.id));

                        if (trap && myPlayer.inTrap && trap.index !== myPlayer.inTrap.index) {
                            myPlayer.inTrap = trap;
                        };

                        if (!myPlayer.inTrap && trap) {
                            myPlayer.inTrap = trap;
                            const angle = Math.atan2(trap.y - myPlayer.y, trap.x - myPlayer.x);
                            const prevWeapon = window.stats[Sploop.itemsID][weaponInHands];
                            sendPacket(packets.item, 1)
                            hit(angle);
                            sendPacket(packets.itemByID, prevWeapon);
                            sendPacket(packets.stopAttack);
                            if (get.El("anti-trap").checked) {
                                singlePlace(7, toRad(toDegree(angle) - 97));
                                await sleep(90);
                                singlePlace(7, toRad(toDegree(angle) + 97));
                                await sleep(90);
                                singlePlace(7, toRad(toDegree(angle) + 180));
                            }
                        };

                        if (myPlayer.inTrap && trap) {
                            const angle = Math.atan2(trap.y - myPlayer.y, trap.x - myPlayer.x);
                            if (get.El("equip-demolist").checked) equipHat(hats.demolist);
                            const prevWeapon = window.stats[Sploop.itemsID][weaponInHands];
                            sendPacket(packets.item, 1);
                            hit(angle);
                            sendPacket(packets.itemByID, prevWeapon);
                            sendPacket(packets.stopAttack);
                        };

                        if (myPlayer.inTrap && !traps.find(trap => Math.hypot(myPlayer.x - trap.x, myPlayer.y - trap.y) <= 52)) {
                            myPlayer.inTrap = false;
                            clearInterval(hatInterval);
                            hatInterval = setInterval(() => {
                                if (hatReloaded) {
                                    clearInterval(hatInterval);
                                    if (get.El("equip-demolist-prev-hat").checked) equipHat(myPlayer.prevHat);
                                };
                            }, 10);
                        };
                    }
                }
                window.inTrap = myPlayer.inTrap;
            }

            if (get.El("auto-hats").checked) {
                if (myPlayer.y <= 9000 && myPlayer.y >= 8000 && !myPlayer.inRiver) {
                    myPlayer.inRiver = true;
                    if (hatReloaded) {
                        equipHat(hats.scubaGear);
                    } else {
                        clearInterval(hatInterval);
                        hatInterval = setInterval(() => {
                            if (hatReloaded) {
                                clearInterval(hatInterval);
                                equipHat(hats.scubaGear);
                            };
                        }, 10)
                    };
                };
                if ((myPlayer.y >= 9000 || myPlayer.y <= 8000) && myPlayer.inRiver) {
                    myPlayer.inRiver = false;
                    if (hatReloaded) {
                        equipHat(myPlayer.prevHat);
                    } else {
                        clearInterval(hatInterval);
                        hatInterval = setInterval(() => {
                            if (hatReloaded) {
                                clearInterval(hatInterval);
                                equipHat(myPlayer.prevHat);
                            };
                        }, 10)
                    };
                };
            } else {
                myPlayer.inRiver = false;
            };
            if (myPlayer.broken === 128 && !myPlayer.clowned && get.El("auto-hats").checked) {
                myPlayer.clowned = true;
                equipHat(hats.jungleGear);
                setTimeout(() => {
                    myPlayer.clowned = false;
                    equipHat(myPlayer.prevHat);
                }, 3000)
            };
            if (!myPlayer.clowned && !myPlayer.inRiver && get.El("auto-hats").checked) {
                if (Math.hypot(formatEnemy.x - myPlayer.x2, formatEnemy.y - myPlayer.y2)) {
                    //        if (myPlayer.hat != hats.crystalGear) equipHat(hats.crystalGear);
                }
            }
            if (myPlayer.health < 100 && get.El("auto-heal").checked) {
                setTimeout(() => {
                    placeFood();
                }, window.pingTime > 100 ? 35 : 45);
            };

            break;
        }
    }
}

const encoder = new TextEncoder();
const sendMsg = (text) => {
    return sendPacket(packets.chat, ...encoder.encode(text));
};
const hit = (angle) => {
    const transformedAngle = 65535 * (angle + Math.PI) / (2 * Math.PI);
    sendPacket(packets.hit, 255 & transformedAngle, transformedAngle >> 8 & 255);
};

setInterval(() => {
    if (healingEffect) {
        crc.drawImage(get.El("cookieSigma").src, myPlayer.x, myPlayer.y, 100, 100)
    }
}, 0);

let placingObject = 0;
let doingInsta = false;
let autoPushing = false, pushingCounts = 0;
window.getEntityData = (entity, ctx, isTeammate) => {
    const isMe = entity[Sploop.id] === myPlayer.id;
    const entityX = entity[Sploop.x], entityY = entity[Sploop.y], entityAngle = entity[Sploop.angle];
    if (isMe) myPlayer.currentItem = window.weapons[entity[Sploop.currentWeapon]];
    if (get.El("weapon-range").checked && entity.type == 0) {
        const {range: weaponRange, [Sploop.weaponName]: weaponName } = window.weapons[entity[Sploop.currentWeapon]];
        crc.save();
        crc.beginPath();
        crc.fillStyle = get.El("weapon-range-fill").checked ? get.Val("weapon-range-color") : "rgba(0, 0, 0, 0)";
        crc.strokeStyle = get.Val("weapon-range-color");
        crc.shadowColor = get.El("weapon-range-shadow").checked ? get.Val("weapon-range-color") : "rgba(0, 0, 0, 0)";
        crc.shadowBlur = 15;
        crc.globalAlpha = 0.3;
        crc.lineWidth = 3;
        if (["XBow", "Bow", "Stone Musket", "Pearl"].includes(weaponName)) {
            const [weaponX, weaponY] = [weaponRange * Math.cos(entityAngle), weaponRange * Math.sin(entityAngle)];
            crc.moveTo(entityX, entityY);
            crc.lineTo(weaponX + entityX, weaponY + entityY);
        } else {
            crc.arc(entityX, entityY, weaponRange, entityAngle - 1.5, entityAngle + 1.5);
        }
        crc.fill();
        crc.stroke();
        crc.closePath();
        crc.restore();
    }

    const tracerAngle = (Math.atan2(myPlayer.y2 - entity[Sploop.y], myPlayer.x2 - entity[Sploop.x]) + Math.PI) % (2 * Math.PI);
    const tracerDistance = Math.max(Math.hypot(entity[Sploop.y] - myPlayer.y2, entity[Sploop.x] - myPlayer.x2) / 2, 30);
    const tracerx = myPlayer.x2 + tracerDistance * Math.cos(tracerAngle);
    const tracery = myPlayer.y2 + tracerDistance * Math.sin(tracerAngle);
    let tracerColor;
    if (get.El("tracers").checked) {
        if (myPlayer.id != entity[Sploop.id]) {
            if (entity.type != 0) {
                tracerColor = get.Val("animal-tracer-color");
            } else if (entity.type == 0 && !teammates.includes(entity[Sploop.id])) {
                tracerColor = get.Val("enemy-tracer-color");
            } else {
                tracerColor = get.Val("team-tracer-color");
            }
        } else {
            tracerColor = "rgba(0, 0, 0, 0)";
        }
    } else {
        tracerColor = "rgba(0, 0, 0, 0)";
    }
    crc.save();
    crc.beginPath();
    crc.translate(tracerx, tracery);
    crc.rotate(Math.PI / 4);
    crc.rotate(tracerAngle);
    crc.globalAlpha = 1;
    crc.lineCap = "round";
    crc.fillStyle = tracerColor;
    crc.moveTo(-10, -10);
    crc.bezierCurveTo(-10, -10, 15, -15, 10, 10)
    crc.lineTo(25, -25)
    crc.fill();
    crc.closePath();
    crc.restore();

    if (get.El("path-finder").checked) {
        let distanceToPath = Math.hypot(get.Val("pos-x") - myPlayer.x2, get.Val("pos-y") - myPlayer.y2);
        let angleToPath = Math.atan2(get.Val("pos-y") - myPlayer.y2, get.Val("pos-x") - myPlayer.x2);
        const pathAngle = 65535 * (angleToPath + Math.PI) / (2 * Math.PI);
        if (distanceToPath < 50) {
            sendPacket(packets.stopMove);
        } else {
            sendPacket(packets.move, 255 & pathAngle, pathAngle >> 8 & 255);
        }
        crc.save();
        crc.beginPath();
        crc.lineWidth = 5;
        crc.lineCap = "round";
        crc.strokeStyle = "#ff0000";
        crc.moveTo(myPlayer.x, myPlayer.y);
        crc.lineTo(get.Val("pos-x"), get.Val("pos-y"));
        crc.stroke();
        crc.closePath();
        crc.restore();
    }

    if (isMe) {
        myPlayer.x2 = entityX;
        myPlayer.y2 = entityY;
        myPlayer.angle2 = entityAngle;
        myPlayer.currentWeapon = entity[Sploop.currentWeapon];
    } else if (!isMe && entity.type === 0 && !teammates.includes(entity[Sploop.id])) {
        formatEnemy.x = entity[Sploop.x];
        formatEnemy.y = entity[Sploop.y];
        const distance = Math.hypot(entityX - myPlayer.x2, entityY - myPlayer.y2);
        const angle = Math.atan2(entityY - myPlayer.y2, entityX - myPlayer.x2);
        const angleToMe = Math.atan2(myPlayer.y - entity[Sploop.y], myPlayer.x - entity[Sploop.x]);

        if (get.El("path-finder").checked) {

        } else {
            if (get.El("auto-push").checked && distance <= 170) {
                const enemyTrapped = myTraps.find(c => myPlayer.id == c[Sploop.id] && Math.hypot(c[Sploop.y] - entity[Sploop.y], c[Sploop.x] - entity[Sploop.x]) <= 50);
                if (enemyTrapped && Math.hypot(enemyTrapped[Sploop.y] - myPlayer.y, enemyTrapped[Sploop.x] - myPlayer.x) <= 250) {
                    const nearestSpike = mySpikes.find(c => myPlayer.id == c[Sploop.id] && Math.hypot(c[Sploop.y] - enemyTrapped[Sploop.y], c[Sploop.x] - enemyTrapped[Sploop.x]) <= 140);
                    if (nearestSpike) {
                        pushingCounts++;
                        autoPushing = true;
                        nearestSpike.x = nearestSpike[Sploop.x];
                        nearestSpike.y = nearestSpike[Sploop.y];
                        const angleToEnemy = Math.atan2(entity[Sploop.y] - nearestSpike.y, entity[Sploop.x] - nearestSpike.x)
                        let distance = Math.hypot(nearestSpike.x - entity[Sploop.x], nearestSpike.y - entity[Sploop.y]) + 45;
                        const pushPos = {
                            x: nearestSpike.x + (distance * Math.cos(angleToEnemy)),
                            y: nearestSpike.y + (distance * Math.sin(angleToEnemy))
                        };
                        const pushingCount = Math.hypot(myPlayer.x - pushPos.x, myPlayer.y - pushPos.y);
                        let pushingAngle;
                        if (pushingCount > 15) {
                            pushingAngle = Math.atan2(pushPos.y - myPlayer.y, pushPos.x - myPlayer.x);
                        } else {
                            pushingAngle = Math.atan2(entity[Sploop.y] - myPlayer.y, entity[Sploop.x] - myPlayer.x);
                        };
                        if (get.El("auto-push-line").checked) {
                            crc.save();
                            crc.beginPath();
                            crc.lineWidth = 5;
                            crc.lineCap = "round";
                            crc.strokeStyle = get.Val("auto-push-line-color");
                            crc.moveTo(myPlayer.x, myPlayer.y);
                            crc.bezierCurveTo(entity[Sploop.x], entity[Sploop.y], pushPos.x, pushPos.y, nearestSpike.x, nearestSpike.y);
                            crc.fillStyle = get.Val("auto-push-line-color");
                            crc.globalAlpha = 0.5;
                            crc.arc(nearestSpike.x, nearestSpike.y, 8, 0, Math.PI * 2);
                            crc.fill();
                            crc.stroke();
                            crc.closePath();
                            crc.restore();
                        }
                        const pushAngle = 65535 * (pushingAngle + Math.PI) / (2 * Math.PI);
                        if (distance < 40) {
                            sendPacket(packets.stopMove);
                        } else {
                            if (pushingCounts > 6) {
                                sendPacket(packets.move, 255 & pushAngle, pushAngle >> 8 & 255);
                                pushingCounts = 0;
                            }
                        }
                    };
                };
            }
            if (doingInsta == false && get.El("auto-insta").checked && ![hats.crystalGear, hats.immunityGear].includes(entity[Sploop.hat]) && distance <= 135) {
                const instaKillAngle = Math.atan2(entity[Sploop.y] - myPlayer.y2, entity[Sploop.x] - myPlayer.x2);
                if (weaponReloading == false && hatReloaded) {
                    doingInsta = true;
                    singlePlace(4, instaKillAngle);
                    const hitAngle = 65535 * (instaKillAngle + PI) / PI2;
                    if (get.El("equip-berserker").checked) equipHat(hats.berserkerHat);
                    sendPacket(packets.item, 0);
                    sendPacket(packets.hit, 255 & hitAngle, hitAngle >> 8 & 255);
                    setTimeout(() => {
                        sendPacket(packets.stopAttack);
                        sendPacket(packets.item, weaponInHands);
                        setTimeout(() => {
                            doingInsta = false;
                            clearInterval(hatInterval);
                            hatInterval = setInterval(() => {
                                if (hatReloaded) {
                                    clearInterval(hatInterval);
                                    if (get.El("equip-berserker-prev-hat").checked) equipHat(myPlayer.prevHat);
                                };
                            }, 10);
                        }, 1300);
                    }, 55);
                }
            }
            if (distance <= 130) {
                const enemyTrapped = myTraps.find(c => Math.hypot(c[Sploop.y] - entity[Sploop.y], c[Sploop.x] - entity[Sploop.x]) <= 70);
                if (enemyTrapped) {
                    const x = enemyTrapped[Sploop.x] - myPlayer.x;
                    const y = enemyTrapped[Sploop.y] - myPlayer.y;
                    placingObject++;
                    if (placingObject == 15) {
                        singlePlace(4, Math.atan2(y, x) + 1.3);
                        singlePlace(4, Math.atan2(y, x) - 1.3);
                        placingObject = 0;
                    } else if (placingObject == 7.5) {
                        singlePlace(4, Math.atan2(y, x) + 2.6);
                        singlePlace(4, Math.atan2(y, x) - 2.6);
                        placingObject = 0;
                    }
                } else {
                    placingObject++;
                    if (placingObject == 15) {
                        singlePlace(7, angle);
                        placingObject = 0;
                    }
                }
            }
        }
    };
};

window.render = (ctx, shit) => {
};

let mySpikes = [];
let myTraps = [];
window.drawMarkers = (target, id, ctx, step) => {
    const objectID = target[Sploop.id]
    const isSpike = [2, 7, 17].includes(target.type);

    if (isSpike) {
        let isMySpike = myPlayer.id == objectID;
        if (isMySpike && !mySpikes.find(c => c[Sploop.id2] == target[Sploop.id2])) {
            mySpikes.push(target);
        }
    }

    if (myTraps && target.type == 6) {
        let isMyTrap = myPlayer.id == objectID;
        if (isMyTrap && !myTraps.find(c => c[Sploop.id2] == target[Sploop.id2])) {
            myTraps.push(target);
        }
    };

    let color, strokeColor;
    if (get.El("markers").checked) {
        if (teammates.includes(target[Sploop.id])) {
            color = get.Val("team-marker-color");
            strokeColor = "#303030";
        } else if (objectID === myPlayer.id) {
            color = get.Val("mine-marker-color");
            strokeColor = strokeColor = "#303030";
        } else {
            color = get.Val("enemy-marker-color");
            strokeColor = strokeColor = "#303030";
        }
    } else {
        color = "rgba(0, 0, 0, 0)";
        strokeColor = "rgba(0, 0, 0, 0)";
    }

    if (![21, 30, 40, 31, 32, 33, 34, 35, 38, 39, 1, 3, 4, 5, 9].includes(target.type)) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 10;
        ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
};

let weaponReloading = false;
window.attackAnimation = (type, id, weapon, isObject, entity) => {
    try {
        const entityID = entity[Sploop.id];
        entityID == myPlayer.id && (weaponReloading = true);
        setTimeout(function () {
            entityID == myPlayer.id && (weaponReloading = false);
        }, window.weapons[window.stats[Sploop.itemsID][weaponInHands]].reload)
    } catch (err) { }
};

const checkChanges = (obj1, obj2) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    return keys2.some(key => !keys1.includes(key)) || keys1.some(key => !keys2.includes(key));
};

const changeSettings = (key, value) => {
    let newSettings = JSON.parse(localStorage.settings);
    newSettings[key] = value;
    localStorage.setItem("settings", JSON.stringify(newSettings));
};

const sendPacket = (packetID, ...values) => {
    return myWS.send(new Uint8Array([packetID, ...values]));
}

let mouseAngle2;
window.addEventListener("mousemove", ({ pageX, pageY }) => {
    mouseX = pageX;
    mouseY = pageY;
    mouseAngle = 65535 * (Math.atan2(mouseY - innerHeight / 2, mouseX - innerWidth / 2) + PI) / PI2;
    mouseAngle2 = Math.atan2(mouseY - innerHeight / 2, mouseX - innerWidth / 2);
});

let hatInterval;
const equipHat = (id) => {
    if (hatReloaded) {
        hatReloaded = false;
        setTimeout(() => {
            hatReloaded = true;
        }, 1300);
        if (myPlayer.hat !== id) {
            myPlayer.prevHat = myPlayer.inRiver && myPlayer.hat === hats.scubaGear ? id : myPlayer.hat;
            sendPacket(packets.hat, id);
        };
    };
};

let _isKeyDown = false, _intervalId;
const checkChat = () => !get.El("chat-wrapper").style.display || get.El("chat-wrapper").style.display === "none";
let repeater = (key, action) => ({
    start(keycode) {
        if (keycode === key && !_isKeyDown) {
            _isKeyDown = true;
            _intervalId = setInterval(() => {
                action();
                !_isKeyDown && (clearInterval(_intervalId), _intervalId = undefined);
            }, 25);
        }
    },
    stop(keycode) {
        if (keycode === key) {
            _isKeyDown = false;
        };
    }
});

const changeAngle = (angle, isTransformed = false) => {
    if (isTransformed) {
        sendPacket(packets.angle, 255 & angle, angle >> 8 & 255);
        return;
    } else {
        const angle2 = 65535 * (angle + Math.PI) / (2 * Math.PI);
        sendPacket(packets.angle, 255 & angle2, angle2 >> 8 & 255);
    }
};

let crc;

const prevRect = CanvasRenderingContext2D.prototype.clearRect;
CanvasRenderingContext2D.prototype.clearRect = function (x, y, width, height) {
    if (this.canvas.id === "game-canvas") {
        crc = this.canvas.getContext("2d");
    }
    return prevRect.apply(this, arguments);
}

const { fillRect } = CanvasRenderingContext2D.prototype;
CanvasRenderingContext2D.prototype.fillRect = function (x, y, width, height) {
    return fillRect.apply(this, arguments);
}

const place = (itemID) => {
    if (get.El("fast-place").checked) {
        sendPacket(packets.item, weaponInHands);
        sendPacket(packets.item, itemID);
        sendPacket(packets.hit, 255 & mouseAngle, mouseAngle >> 8 & 255);
        sendPacket(packets.stopAttack);
        sendPacket(packets.item, weaponInHands);
        sendPacket(packets.item, weaponInHands);
        sendPacket(packets.item, itemID);
        sendPacket(packets.hit, 255 & mouseAngle, mouseAngle >> 8 & 255);
        sendPacket(packets.stopAttack);
        sendPacket(packets.item, weaponInHands);
    } else {
        sendPacket(packets.item, weaponInHands);
        sendPacket(packets.item, itemID);
        sendPacket(packets.hit, 255 & mouseAngle, mouseAngle >> 8 & 255);
        sendPacket(packets.stopAttack);
        sendPacket(packets.item, weaponInHands);
    }
};

const singlePlace = (itemID, preAngle) => {
    const back = mouseAngle;
    const angle = 65535 * (preAngle + Math.PI) / (2 * Math.PI);
    sendPacket(packets.item, weaponInHands);
    sendPacket(packets.item, itemID);
    sendPacket(packets.hit, 255 & angle, angle >> 8 & 255);
    changeAngle(back, true);
    sendPacket(packets.stopAttack);
    sendPacket(packets.item, weaponInHands);
};

let healingEffect = false;
const placeFood = () => {
    healingEffect = true;
    sendPacket(packets.item, weaponInHands);
    sendPacket(packets.item, 2);
    const healAngle = 65535 * (myPlayer.angle + PI) / PI2;
    sendPacket(packets.hit, 255 & healAngle, healAngle >> 8 & 255);
    sendPacket(packets.stopAttack);
    sendPacket(packets.item, weaponInHands);
    setTimeout(() => {
        healingEffect = false;
    }, 1500)
};

const placeByKey = (key, itemID) => repeater(binds[key], () => place(itemID), itemID);
const placement = {
    trap: placeByKey("trap", 7),
    spike: placeByKey("spike", 4),
    wall: placeByKey("wall", 3),
    mill: placeByKey("mill", 5),
    QHold: placeByKey("QHeal", 2),
    platform: placeByKey("platform", 8),
    turret: placeByKey("turret", 10)
};

const quickPearl = () => {
    sendPacket(packets.item, 1);
    sendPacket(packets.hit, 255 & mouseAngle, mouseAngle >> 8 & 255);
    sendPacket(packets.item, weaponInHands);
    setTimeout(() => {
        sendPacket(packets.stopAttack);
    }, 55);
}

const key = {
    W: false,
    A: false,
    S: false,
    D: false,
}



document.addEventListener("keydown", event => {
    if (event.repeat || !checkChat()) return;
    const pressedKey = event.code;
    if (get.El("placement-macro").checked) {
        if (Object.values(binds).includes(pressedKey)) Object.values(placement).forEach(action => action.start(pressedKey));
    }

    switch (pressedKey) {
        case "Digit1": weaponInHands = 0; break;
        case "Digit2": weaponInHands = 1; break;
        case "KeyW": (key.W = true, "changeColor"); break;
        case "KeyA": (key.A = true, "changeColor"); break;
        case "KeyS": (key.S = true, "changeColor"); break;
        case "KeyD": (key.D = true, "changeColor"); break;
        case binds.pearl: if (get.El("quick-pearl").checked) quickPearl(); break;
    };

    for (const [key, value] of Object.entries(binds)) (pressedKey === value && hats[key] && get.El("hat-macro").checked) ? equipHat(hats[key]) : '';

});

document.addEventListener("keyup", event => {
    if (!checkChat()) return;
    const pressedKey = event.code;
    if (Object.values(binds).includes(pressedKey)) Object.values(placement).forEach(action => action.stop(pressedKey));
    switch (pressedKey) {
        case "KeyW": (key.W = false, "changeColorBack"); break;
        case "KeyA": (key.A = false, "changeColorBack"); break;
        case "KeyS": (key.S = false, "changeColorBack"); break;
        case "KeyD": (key.D = false, "changeColorBack"); break;
    }
});

const TYPEOF = value => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
const NumberSystem = [
    { radix: 2, prefix: "0b0*" },
    { radix: 8, prefix: "0+" },
    { radix: 10, prefix: "" },
    { radix: 16, prefix: "0x0*" }
];
class Regex {
    constructor(code, unicode) {
        this.code = this.COPY_CODE = code;
        this.unicode = unicode || false;
        this.hooks = {};
    }

    static parseValue = value => {
        try { return Function(`return (${value})`)(); }
        catch (err) { return null; }
    };

    isRegexp = value => TYPEOF(value) === "regexp";

    generateNumberSystem = int => `(?:${NumberSystem.map(({ prefix, radix }) => prefix + int.toString(radix)).join("|")})`;

    parseVariables = regex => regex.replace(/\{VAR\}/g, "(?:let|var|const)")
    .replace(/\{QUOTE\}/g, "['\"`]")
    .replace(/ARGS\{(\d+)\}/g, (_, count) => (Array(Number(count)).fill("\\w+")).join("\\s*,\\s*"))
    .replace(/NUMBER\{(\d+)\}/g, (_, int) => this.generateNumberSystem(Number(int)));

    format = (name, inputRegex, flags) => {
        const regex = Array.isArray(inputRegex) ? inputRegex.map(exp => this.isRegexp(exp) ? exp.source : exp).join("\\s*") : this.isRegexp(inputRegex) ? inputRegex.source : "";
        let parsedRegex = this.parseVariables(regex);

        if (this.unicode) {
            parsedRegex = parsedRegex.replace(/\\w/g, "(?:[^\\x00-\\x7F-]|\\$|\\w)");
        }

        const expression = new RegExp(parsedRegex.replace(/\{INSERT\}/, ""), flags);
        return parsedRegex.includes("{INSERT}") ? new RegExp(parsedRegex, flags) : expression;
    };

    template = (type, name, regex, substr) => {
        const expression = new RegExp(`(${this.format(name, regex).source})`);
        const match = this.code.match(expression) || [];
        this.code = this.code.replace(expression, type === 0 ? "$1" + substr : substr + "$1");
        return match;
    };

    match = (name, regex, flags, debug = false) => {
        const expression = this.format(name, regex, flags);
        const match = this.code.match(expression) || [];
        this.hooks[name] = { expression, match };
        return match;
    };

    matchAll = (name, regex, debug = false) => {
        const expression = this.format(name, regex, "g");
        const matches = [...this.code.matchAll(expression)];
        this.hooks[name] = { expression, match: matches };
        return matches;
    };

    replace = (name, regex, substr, flags) => {
        const expression = this.format(name, regex, flags);
        this.code = this.code.replace(expression, substr);
        return this.code.match(expression) || [];
    };

    replaceAll = (name, regex, substr, flags) => {
        const expression = this.format(name, regex, "g");
        this.code = this.code.replaceAll(expression, substr);
        return this.code.match(expression) || [];
    };

    append = (name, regex, substr) => this.template(0, name, regex, substr);

    prepend = (name, regex, substr) => this.template(1, name, regex, substr);

    insert = (name, regex, substr) => {
        const { source } = this.format(name, regex);
        if (!source.includes("{INSERT}")) throw new Error("Your regexp must contain {INSERT} keyword");
        const findExpression = new RegExp(source.replace(/^(.*)\{INSERT\}(.*)$/, "($1)($2)"));
        this.code = this.code.replace(findExpression, `$1${substr}$2`);
        return this.code.match(findExpression);
    };
};
let smoothCamVal = 45;
let Sploop;
const applyHooks = code => {
    const Hook = new Regex(code, true);
    window.COPY_CODE = (Hook.COPY_CODE.match(/^(\(function \w+\(\w+\)\{.+)\(.+?\);$/) || [])[1];
    Hook.append("EXTERNAL fix", /\(function (\w+)\(\w+\)\{/, "let $2 = eval(`(() => ${COPY_CODE})()`);delete window.COPY_CODE;console.log(1);");
    const myData = Hook.match('myPlayer', /=(\w.get\(\w{2}\));\w&&\w\(\)/)[1];
    const X = Hook.match('playerX', /\{this\.(\w{2})=\w\|\|0/)[1];
    const Y = Hook.match('playerY', /,this\.(\w{2})=\w\|\|0\}/)[1];
    const ID = Hook.match('ID', /&&\w{2}===\w\.(\w{2})\){/)[1];
    const ID2 = Hook.match('ID2', /-1!==\w+\.(\w+)&&/)[1];
    const currentWeapon = Hook.match("crntWeapon", /,\w.(\w{2})===/)[1];
    const angle = Hook.match("angle", /;\w.(\w{2})=\w\(\)/)[1];
    const weaponName = Hook.match("wpnName", /(\w{2}):"XX/)[1];
    const health = Hook.match("health", /(\w{2})<<8;/)[1];
    const weaponDamage = Hook.match("wpnDamage", /(\w{2}):32,reload:300/)[1];
    const teamID = Hook.match('test', /,\w=\w.(\w{2})\|.+?\<\<8/)[1];
    const radius = Hook.match("radius", /(\w{2}):220/)[1];
    const [, currentItem, hat] = Hook.match("hat", /\(\w+\.(\w+)\|\w+\.(\w+)<<NUMBER{8}\)/);
    const inWhichObject = Hook.match("iwo", /110\).+?,1===\w.(\w{2})&&!\w{2}/)[1];
    const weaponID = Hook.match('el', /(\w{2}):0,\w{2}:22,reload:150/)[1];
    const itemsID = Hook.match("IDs", />1\){.{3}(\w{2})/)[1];
    const objQuantity = Hook.match("Quantity", /\),this.(\w{2})=\w\):/)[1];
    Sploop = {
        myPlayer: {
            myData: myData,
            x: `${myData}.${X}`,
            y: `${myData}.${Y}`,
            id: `${myData}.${ID}`,
            teamID: `${myData}.${teamID}`,
            angle: `${myData}.${angle}`
        },
        x: X,
        y: Y,
        id: ID,
        id2: ID2,
        hat: hat,
        type: 'type',
        angle: angle,
        health: health,
        radius: radius,
        teamID: teamID,
        itemsID: itemsID,
        weaponID: weaponID,
        weaponName: weaponName,
        objQuantity: objQuantity,
        weaponDamage: weaponDamage,
        currentWeapon: currentWeapon,
        inWhichObject: inWhichObject
    };
    Hook.replace("animTextTime", /this.(\w{2})=400/, `this.$1=400`);
    Hook.replace("smoothCam", /\w{4}.\w{3}\(.[0-9]{2}\*/, `Math.min(.00${smoothCamVal}*`);
    Hook.replace("blockMouse", /\|\|(\w+\(\w+\(\)\)\))/, `||!window.inTrap && $1;`);
    Hook.append("renderer", /1}function \w+\((\w),(\w)\){/, `window.render($2, $3);`);
    Hook.append("updateFPS", /const (\w)=\+new Date,.+?3;/, `window.updateFPSCounter($2);`);
    Hook.replace("renderItems", /(\(\w+\.\w+\+\w+,\w+\.\w+\+\w+\).+?\w+\(\).+?\w+\.\w+\.\w+\)([,;]))/, `$1window.drawMarkers(...arguments)$2`);
    const args = Hook.match("drawEntityInfo", /-NUMBER{50},.+?function \w+\((ARGS{3})\)\{/)[1];
    Hook.append('drawEntityInfo', /=.5;/, `try {window.getEntityData(${args});} catch(err) {};`)
    Hook.append("getMsg", /0;fu.{10}(\w).{2}/, `window.receiveMsg($2);`);
    Hook.append("getWS", /(\w{2})=new \w{2}\("".{31}/, `,window.getWS($2)`);
    //  Hook.replace('showIDs', /((\w).\w{2};const \w=\w.\w{2}\|\|\(\w.\w{2}=\w\(\).\w{2}\()(\w).(\w{2})/, `$1 "{" + $2.${Sploop.id} + "} " + $3.$4 `);
    const weaponList = Hook.match("weaponList", /\?Math\.PI\/2.+?(\w\(\))/)[1];
    Hook.replace("defaultData", /(\W\w+>NUMBER{1}\W.+?(\w+)\.(\w+).+?)function/, `$1window.stats=$2;window.weapons = ${weaponList};window.sprites = tt();function`);
    Hook.append('attackReload', /\+=NUMBER{5}.+?(\w+)=.+?(\w+)=.+?(\w+)=.+?(\w+)=.+?(\w+)=.+?;/, `window.attackAnimation($2, $3, $4, $5, $6);`)

    return Hook.code;
};

window.eval = new Proxy(window.eval, {
    apply(target, _this, args) {
        const code = args[0];
        if (code.length > 100000) {
            args[0] = applyHooks(code);
            window.eval = target;
        }
        return target.apply(_this, args);
    }
});

window.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("keydown", (event) => {
        if (event.code === "ShiftRight") {
            const menuItems = document.querySelectorAll(".menu-items");
            menuItems.forEach((item) => {
                item.classList.toggle("hidden");
            });
        }
    });

    let { fillText, fillRect } = CanvasRenderingContext2D.prototype;

    CanvasRenderingContext2D.prototype.fillText = function(x, y, width, height) {
        if (get.El("homepage").style.display == "none") {
            if (this.fillStyle != "#8ecc51") {
                if ((this.strokeStyle === "#000" || this.strokeStyle === "#000000") && this.font === "45px \"Baloo Paaji\"" && get.El("hide-dmg-text").checked) {
                    return
                }
            } else {
                if ((this.strokeStyle === "#000" || this.strokeStyle === "#000000") && this.font === "45px \"Baloo Paaji\"" && get.El("hide-heal-text").checked) {
                    return
                }
            }
        }
        return fillText.apply(this, arguments)
    }

    CanvasRenderingContext2D.prototype.fillRect = function(x, y, width, height) {
        if (get.El("homepage").style.display == "none") {
            if (this.fillStyle == "#a4cc4f") {
                this.fillStyle = get.Val("team-mine-health-bar-color");
            } else if (this.fillStyle == "#cc5151") {
                this.fillStyle = get.Val("enemy-animal-health-bar-color");
            }
        }
        return fillRect.apply(this, arguments)
    }
});
