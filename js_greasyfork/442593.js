// ==UserScript==
// @name         Universal r/PlaceUkraine template
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Слава Україні! Героям Слава!
// @author       Mapko (mdgk#8833) for r/PlaceUkraine. Also thanks to @amadare.
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442593/Universal%20rPlaceUkraine%20template.user.js
// @updateURL https://update.greasyfork.org/scripts/442593/Universal%20rPlaceUkraine%20template.meta.js
// ==/UserScript==

var canvas;
var ui;
var overlay;
var ver = "1.3";
var checkbox;

var select_projects =

"<option selected>FINAL CANVAS</option>"+  // 0
"<option disabled>Zelensky Final</option>"+  // 1
"<option disabled>Glory To Ukraine</option>"+ // 2
"<option disabled>Cossack</option>"+ // 3
"<option disabled>Comeback Alive</option>"+ // 4
"<option disabled>Church</option>" + // 5
"<option disabled>Church 2</option>" + // 6
"<option disabled>Ghost of Kyiv</option>"+ // 7
"<option disabled>Sunglasses</option>"+ // 8
"<option disabled>Mriya</option>"+ // 9
"<option disabled>Stalker</option>"+ // 10
"<option>* Custom</option>"; // default

var custom_template;


if (window.top !== window.self) {
    window.addEventListener('load', () => {Main()});
}

function Main(){
    canvas = document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0].getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0]
    ui = document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0];

    ui.appendChild(UI());
    canvas.appendChild(Overlay());
}

function UI(){
    const u = document.createElement("div");
    u.style = "position: fixed; color:black; width: 215px;  opacity: 0.89; background: white; padding: 20px; border-radius:50px; left: 45vw; top: 7vh; box-shadow: 0px 0px 8px 0px rgb(0 0 0 / 40%);";

    const flag = document.createElement("img");
    flag.src = "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/google/313/flag-ukraine_1f1fa-1f1e6.png";
    flag.width = 15;
    flag.style="margin-right: 5px;"

    const title = document.createElement("b");
    title.innerText = "r/PlaceUkraine v."+ver;
    title.style="margin-bottom:10px;"


    const select = document.createElement("select");
    select.id = "project_selector";
    select.innerHTML = select_projects;
    select.addEventListener("change", selectChange, false);
    select.style = "background: white; color: black; height:35px; width:215px; border-radius: 5px; margin-bottom: 12px;";

    const custom = document.createElement("input");
    custom.id = "custom_template";
    custom.type = "text";
    custom.placeholder = "link to png (2000x2000)";
    custom.addEventListener("change", customChange, false);
    custom.style = "background: white; color: black; height:35px; width:208px; border-radius: 5px; display: none;";

    const toggle = createCheckbox();

    const opacity = document.createElement("input");
    opacity.id = "opacity_input";
    opacity.type = "range";
    opacity.value = 0.55;
    opacity.step = 0.01;
    opacity.min = 0;
    opacity.max = 1;
    opacity.style = "width:215px; color:black; background:white; border-radius: 5px;";
    opacity.addEventListener("change", opacityChange, false);

    const br = document.createElement("br");

    const victory = document.createElement("h4");
    victory.innerHTML = "Thanks to all Friends of Ukraine!"

    u.append(victory);
    u.append(flag);
    u.append(title);
    u.append(select);
    u.append(custom);
    u.append(opacity);
    u.append(toggle);
    console.log(u);
    return u;
}

function createCheckbox() {
    const div = document.createElement("div");

    const label = document.createElement("label");
    label.setAttribute("for", "toggle");
    label.innerText = "Visible [Spacebar]";

    checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "toggle";
    checkbox.id = "toggle";
    checkbox.onchange = toggleChange;
    checkbox.checked = true;

    div.append(label);
    div.append(checkbox);

    return div;
}

function Overlay(){
    overlay = document.createElement("img");
    overlay.src = "https://rplace.space/combined/1649112362.png"; // default
    overlay.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: 2000px;height: 2000px; opacity: 1";
    return overlay;
}

function opacityChange(evt){
    overlay.style.opacity = evt.currentTarget.value;
}

function customChange(evt){
    custom_template = evt.currentTarget.value;
    overlay.src = custom_template;
}

function toggleChange(evt) {
    setVisible(overlay, evt.target.checked);
}

function setVisible(el, visible) {
    if (visible) {
        el.style.removeProperty( 'display' );
    } else {
        el.style.display = "none";
    }
}

function selectChange(evt){
    const value = evt.currentTarget.selectedIndex;
    let customVisible = false;

    switch (value) {
        case 0:
            overlay.src = "https://rplace.space/combined/1649112362.png"; // Final map
            break;
        case 1:
            overlay.src = "https://i.imgur.com/OKlqxMP.png"; // Zelensky (with glasses)
            break;
        case 2:
            overlay.src = "https://i.imgur.com/mn6yvh1.png"; // Glory to Ukraine
            break;
        case 3:
            overlay.src = "https://i.imgur.com/azc5CN0.png"; // Cossack
            break;
        case 4:
            overlay.src = "https://i.imgur.com/Hqb0tno.png"; // comebackalive.in.ua
            break;
        case 5:
            overlay.src = "https://i.imgur.com/73m45A6.png"; // Church
            break;
        case 6:
            overlay.src = "https://i.imgur.com/oMXIWFN.png"; // Church 2
            break;
        case 7:
            overlay.src = "https://i.imgur.com/IuJrQQK.png"; // Ghost of Kyiv v2
            break;
        case 8:
            overlay.src = "https://i.imgur.com/TOGQtwt.png"; // Sunglasses
            break;
        case 9:
            overlay.src = "https://i.imgur.com/oIqb87s.png"; // Mriya
            break;
        case 10:
            overlay.src = "https://i.imgur.com/tyFB749.png"; // Mriya
            break;
        default:
            if (custom_template) {
                overlay.src = custom_template;
            }
            customVisible = true;
            break;
    }
    setVisible(ui.querySelector("#custom_template"), customVisible);
    overlay.style.opacity = ui.querySelector("#opacity_input").value;



    console.log(overlay);
}


document.addEventListener("keydown", event => {
    if(event.code == 'Space'){
        checkbox.checked = !checkbox.checked;
        setVisible(overlay, checkbox.checked);
    }
});