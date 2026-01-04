// ==UserScript==
// @name         Bonk mobile controls
// @version      1.0.0
// @author       Salama
// @description  Allows you to play bonk on your phone
// @match        https://bonk.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/824888
// @downloadURL https://update.greasyfork.org/scripts/433862/Bonk%20mobile%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/433862/Bonk%20mobile%20controls.meta.js
// ==/UserScript==



const createGrid = (width, height) => {
    let grid = {};
    grid.root = document.createElement('div');
    grid.root.style.height = `${height}px`;
    grid.root.style.width = `${width}px`;
    grid.root.style.display = "grid";
    grid.root.style.position = "absolute";
    grid.root.style.left = 0;
    grid.root.style.top = 0;
    grid.root.style.gridGap = "4px";
    grid.root.style.opacity = 0.3;
    grid.root.style.backgroundColor = "white";
    grid.root.style.visibility = "hidden";
    grid.root.style.borderRadius = "50px";
    for(let dir of ["ul", "up", "ur", "left", "center", "right", "dl", "down", "dr"]) {
        grid[dir] = document.createElement('div');
        grid[dir].style.backgroundColor = 0;
        if(dir.match(/[ud][lr]/)) {
            grid[dir].style[`border${dir[0] === 'u' ? 'Top' : 'Bottom'}${dir[1] === 'l' ? 'Left' : 'Right'}Radius`] = "50px";
        }
        grid.root.appendChild(grid[dir]);
    }
    grid.ur.style.gridColumnEnd = 4;
    return grid;
}

const createAbilityGrid = () => {
    let grid = {};
    grid.root = document.createElement('div');
    grid.root.style.height = "100%";
    grid.root.style.width = "175px";
    grid.root.style.position = "absolute";
    grid.root.style.left = 0;
    grid.root.style.top = 0;
    grid.root.style.display = "grid";
    grid.root.style.gridGap = "5px";
    grid.root.style.opacity = 0.3;
    grid.root.style.visibility = "hidden";
    for(let ability of ["special", "heavy", "both"]) {
        grid[ability] = document.createElement('div');
        grid[ability].style.backgroundColor = "black";
        grid.root.appendChild(grid[ability]);
    }
    grid.both.style.gridRow = "1/3";
    grid.both.style.gridColumn = 2;
    return grid;
}

const createChatButton = (width, height) => {
    let chatButton = document.createElement('div');
    chatButton.onclick = () => {
        if(document.getElementById('newbonklobby').style.display !== 'none') {
            document.getElementById('newbonklobby_chat_lowerinstruction').style.visibility = "hidden";
            document.getElementById('newbonklobby_chat_input').focus();
        }
        else if(document.getElementById('gamerenderer').style.visibility !== 'hidden') {
            document.getElementById('ingamechatinputtext').className = 'ingamechatinputtextbg';
            document.getElementById('ingamechatbox').style.visibility = 'inherit';
            document.getElementById('ingamechatinputtext').focus();
            document.keyboardHandler.unlockKeyboard();
        }
    }
    chatButton.style.position = "absolute";
    chatButton.style.right = 0;
    chatButton.style.bottom = 0;
    chatButton.style.width = `${width}px`;
    chatButton.style.height = `${height}px`;
    chatButton.style.backgroundColor = "black";
    chatButton.style.opacity = 0.3;
    chatButton.style.textAlign = "center";
    chatButton.innerHTML = "<h1>[CHAT]</h1>";
    chatButton.style.visibility = "hidden";
    return chatButton;
}

const createSettings = () => {
    const createDropdownSetting = (label, options) => {
        let setting = {}
        setting.value = "dynamic";
        setting.element = document.createElement('div');
        setting.element.appendChild(document.createElement('span'));
        setting.element.children[0].fontFamily = "futurept_b1";
        setting.element.children[0].innerHTML = label;
        setting.element.appendChild(document.createElement('select'));
        for(let option of options) {
            let elem = document.createElement('option');
            elem.value = options.indexOf(option)+1;
            elem.innerHTML = option;
            setting.element.children[1].appendChild(elem);
        }
        setting.element.children[1].style.marginLeft = "8px";
        setting.element.children[1].onchange = e => {
            setting.value = options[e.target.value-1];
        }
        return setting;
    }
    let settings = {}
    settings.root = document.createElement('div');
    settings.root.id = 'redefineControls_table';
    settings.controllerType = createDropdownSetting("Controller type", ["dynamic", "static"]);
    settings.root.appendChild(settings.controllerType.element);
    return settings;
}

const modifyMenus = (settings) => {
    document.getElementById('redefineControls_table').remove();
    document.getElementById('settingsContainer').insertBefore(settings.root, document.getElementById('settings_heading_general'));
    document.getElementById('settings_cancelButton').style.bottom = "0px";
    document.getElementById('settings_saveButton').style.bottom = "0px";
    document.getElementsByClassName('settings_fps_container')[0].style.top = "242px";
    document.getElementById('settings_graphicsquality_container').style.top = "227px";
    document.getElementById('settings_heading_performance').style.top = "200px";
    document.getElementsByClassName('settings_profanity_container')[0].style.top = "227px";
    document.getElementById('settings_heading_general').style.top = "200px";

    document.getElementById('newbonklobby_chatbox').style.width = "50%";
    document.getElementById('newbonklobby_settingsbox').style.width = "46%";
    document.getElementById('newbonklobby_startbutton').style.bottom = "calc(1% + 2px)";
    document.getElementById('newbonklobby_modebutton').style.bottom = "calc(1% + 35px)";
    document.getElementById('newbonklobby_teamsbutton').style.bottom = "calc(1% + 68px)";
    document.getElementById('newbonklobby_editorbutton').style.bottom = "calc(1% + 112px)";
    document.getElementById('newbonklobby_readybutton').style.bottom = "calc(1% + 2px)";
    document.getElementById('newbonklobby_mapbutton').style.bottom = "calc(1% + 35px)";
    document.getElementById('newbonklobby_roundslabel').style.top = "calc(1% + 34px)";
    document.getElementById('newbonklobby_roundsinput').style.top = "calc(1% + 55px)";
    document.getElementById('newbonklobby_linkbutton').style.bottom = "calc(1% + 194px)";
    document.getElementById('newbonklobby_linkbutton').style.right = "1%";

}

(function () {
    // This is meant to run inside the iframe that bonk uses
    if (!window.location.toString().includes("gameframe-release")) return;

    document.controls = [];
    var firstFS = true;
    var controller = null;
    var abilityControllerID = null;
    var grid = createGrid(200, 200);
    var abilityGrid = createAbilityGrid();
    var chatButton = createChatButton(150, grid.root.style.height.slice(0, -2)/3/2);
    var settings = createSettings();
    const TOLERANCE = grid.root.style.width.slice(0, -2)/3/2; // width / grid rows / 2
    document.body.style.overflow = "hidden";
    document.body.appendChild(grid.root);
    document.body.appendChild(abilityGrid.root);
    document.body.appendChild(chatButton);
    document.onclick = () => { if(!document.fullscreen) document.documentElement.requestFullscreen(); };
    parent.onresize = () => {
        if(document.fullscreen) {
            document.getElementById("bonkiocontainer").style.height = `${document.documentElement.scrollHeight}px`;
            document.getElementById("bonkiocontainer").style.width = `${document.documentElement.scrollHeight*1.46-8*1.46}px`;
            abilityGrid.root.style.visibility = "visible";
            chatButton.style.visibility = "visible";
            if(firstFS) {
                modifyMenus(settings);
                firstFS = false;
            }
        }
        else {
            abilityGrid.root.style.visibility = "hidden";
            chatButton.style.visibility = "hidden";
        }
    }
    document.documentElement.ontouchstart = e => {
        if(document.controls.length === 0 || !document.fullscreen) return;
        for(let touch of e.changedTouches) {
            if(
                touch.clientX > document.documentElement.scrollWidth/2 &&
                touch.clientX < document.documentElement.scrollWidth - grid.root.style.width.slice(0, -2)/2/3 &&
                touch.clientY > grid.root.style.height.slice(0, -2)/2/3 &&
                touch.clientY < document.documentElement.scrollHeight - grid.root.style.height.slice(0, -2)/2/3)
            {
                if(controller === null) {
                    controller = {id: touch.identifier, x: touch.clientX, y: touch.clientY};
                    grid.root.style.left = touch.clientX - grid.root.style.width.slice(0, -2) / 2;
                    grid.root.style.top = touch.clientY - grid.root.style.height.slice(0, -2) / 2;
                    grid.root.style.visibility = "visible";
                }
                else if(controller.id === null) {
                    controller.id = touch.identifier;
                }
            }
            if(abilityControllerID === null && touch.clientX <= abilityGrid.root.style.width.slice(0, -2)) {
                abilityControllerID = touch.identifier;
            }
        }
        document.documentElement.ontouchmove(e);
    }
    document.ontouchend = e => {
        for(let touch of e.changedTouches) {
            if(controller !== null && touch.identifier === controller.id) {
                if(document.controls.length !== 0) {
                    document.controls[0].release();
                    document.controls[6].release();
                    document.controls[3].release();
                    document.controls[9].release();
                }
                if(settings.controllerType.value === "dynamic") {
                    grid.root.style.visibility = "hidden";
                    controller = null;
                }
                else if(settings.controllerType.value === "static") {
                    controller.id = null;
                }
                for(let g of grid.root.children) {
                    g.style.backgroundColor = 0;
                }
            }
            else if(touch.identifier === abilityControllerID) {
                abilityControllerID = null;
                for(let ability of abilityGrid.root.children) {
                    ability.style.backgroundColor = 0;
                }
                document.controls[12].release();
                document.controls[15].release();
            }
        }
    }

    document.documentElement.ontouchmove = e => {
        if(document.controls.length === 0 || !document.fullscreen) return;
        for(let touch of e.changedTouches) {
            if(controller !== null && touch.identifier === controller.id) {
                try {
                    for(let g of grid.root.children) {
                        g.style.backgroundColor = 0;
                    }
                    let center = false;
                    if(controller.x - touch.clientX < -TOLERANCE) { //RIGHT
                        document.controls[6].press();
                        document.controls[0].release();
                        grid.right.style.backgroundColor = "white";

                    }
                    else if(controller.x - touch.clientX > TOLERANCE) { //LEFT
                        document.controls[0].press();
                        document.controls[6].release();
                        grid.left.style.backgroundColor = "white";
                    }
                    else {
                        document.controls[0].release();
                        document.controls[6].release();
                        center = true;
                    }
                    if(controller.y - touch.clientY > TOLERANCE) { //UP
                        document.controls[3].press();
                        document.controls[9].release();
                        grid.up.style.backgroundColor = "white";
                        if(controller.x - touch.clientX < -TOLERANCE) grid.ur.style.backgroundColor = "white";
                        else if(controller.x - touch.clientX > TOLERANCE) grid.ul.style.backgroundColor = "white";
                    }
                    else if(controller.y - touch.clientY < -TOLERANCE) { //DOWN
                        document.controls[9].press();
                        document.controls[3].release();
                        grid.down.style.backgroundColor = "white";
                        if(controller.x - touch.clientX < -TOLERANCE) grid.dr.style.backgroundColor = "white";
                        else if(controller.x - touch.clientX > TOLERANCE) grid.dl.style.backgroundColor = "white";
                    }
                    else {
                        document.controls[3].release();
                        document.controls[9].release();
                        if(center) grid.center.style.backgroundColor = "white";
                    }
                } catch {}
            }
            else if(touch.clientX <= abilityGrid.root.style.width.slice(0, -2)) {
                for(let ability of abilityGrid.root.children) {
                    ability.style.backgroundColor = 0;
                }
                if(touch.clientX <= abilityGrid.root.style.width.slice(0, -2)/2) {
                   if(touch.clientY >= document.documentElement.scrollHeight/2) {
                       document.controls[12].press();
                       document.controls[15].release();
                       abilityGrid.heavy.style.backgroundColor = "white";
                   }
                    else if(touch.clientY <= document.documentElement.scrollHeight/2) {
                        document.controls[15].press();
                        document.controls[12].release();
                        abilityGrid.special.style.backgroundColor = "white";
                    }
                    else {
                        document.controls[12].release();
                        document.controls[15].release();
                    }
                }
                else {
                    document.controls[12].press();
                    document.controls[15].press();
                    abilityGrid.both.style.backgroundColor = "white";
                }
            }
            break;
        }
    }

    const head = document.getElementsByTagName("head")[0];

    // This part is made by Salama, and is taken from the Firefox extension
    const KEY_PUBLIC = `document.controls[document.controls.length]=t1q[9];D1q[25][t1q[6][101]](t1q[9][t1q[6][366]][t1q[6][316]](t1q[9]));`;
    const KEY_PUBLIC_REMOVE = `this[D1q[8][392]]=function(){document.controls=[];`

    // When requirejs tries to add alpha2s to <head> we will intercept it, and patch it using regexps by Salama.
    head.allow = "fullscreen";
    head.appendChild = new Proxy(head.appendChild, {
        apply: async (target, thisArg, args) => {
            if (args[0] && args[0].src.includes("alpha2s.js")) {
                console.log("[VTOL] Fetching alpha2s.js...")
                let str = await fetch(args[0].src).then(res => res.text())
                str = str.replace(/D1q\[25\]\[t1q\[6\]\[101\]\]\(t1q\[9\]\[t1q\[6\]\[366\]\]\[t1q\[6\]\[316\]\]\(t1q\[9\]\)\);/, KEY_PUBLIC);
                str = str.replace(/this\[D1q\[8\]\[392\]\]=function\(\)\{/, KEY_PUBLIC_REMOVE);
                str = str.replace(/b13\[73\]\[b13\[4\]\[1669\]\]=function\(\)\{/, "b13[73][b13[4][1669]]=function(){if(document.fullscreen){return;}");
                str = str.replace(/V2E\[30\]=new Z0\(\);/, "V2E[30]=new Z0();document.keyboardHandler=V2E[30];");
                // Remove the src attribute so it doesn't try to load the original script
                args[0].removeAttribute("src");
                // Add the new script to the <script>'s contents
                args[0].textContent = str;

                console.log("[VTOL] Patched alpha2s.js")
            }
            return target.apply(thisArg, args);
        }
    });
})();
