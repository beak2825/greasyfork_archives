// ==UserScript==
// @name         Jerryrigged r/JHU template
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  A tool originally for Pixel warriors of Ukraine. Слава Україні! Героям Слава!
// @author       Adapted from Mapko (mdgk#8833) for r/PlaceUkraine. Also thanks to @amadare.
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442681/Jerryrigged%20rJHU%20template.user.js
// @updateURL https://update.greasyfork.org/scripts/442681/Jerryrigged%20rJHU%20template.meta.js
// ==/UserScript==

var canvas;
var ui;
var overlay;

var select_projects =
"<option>JHU Emblem</option>"+  // 0
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
    title.innerText = "r/JHU";
    title.style="margin-bottom:10px;"


    const select = document.createElement("select");
    select.id = "project_selector";
    select.innerHTML = select_projects;
    select.addEventListener("change", selectChange, false);
    select.style = "background: white; color: black; height:35px; width:215px; border-radius: 5px; margin-bottom: 12px;";

    const custom = document.createElement("input");
    custom.id = "custom_template";
    custom.type = "text";
    custom.placeholder = "https://yourcustomlink/to.png (2000x1000)";
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
    label.innerText = "Visible";

    const checkbox = document.createElement("input");
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
    overlay.src = "https://i.imgur.com/MpxJLKn.png"; // first in list
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
            overlay.src = "https://i.imgur.com/MpxJLKn.png";
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