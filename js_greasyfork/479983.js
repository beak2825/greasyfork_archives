// ==UserScript==
// @name         Gats.io - Vaakir's hack pack GUI V4
// @namespace    http://tampermonkey.net/
// @version      4.8
// @description  The almighty one
// @author       PureVaakir (88%) & Freehuntx (12%)
// @match        https://gats.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479983/Gatsio%20-%20Vaakir%27s%20hack%20pack%20GUI%20V4.user.js
// @updateURL https://update.greasyfork.org/scripts/479983/Gatsio%20-%20Vaakir%27s%20hack%20pack%20GUI%20V4.meta.js
// ==/UserScript==

class GUI {
    constructor(parent) {
        this.parent = parent;
        this.init();
    }
    init() {
        this.gui = GUI.createCustomElement('div', this.parent, '', '', '', 'myFUNNYGUY');
        this.guiHead = GUI.createCustomElement('div', this.gui, 'Vaakir Hack pack V4.6', '', 'headDiv', '');

        // Drag functionality on (gui head div)
        let offsetX, offsetY, isDragging = false, gui = this.gui;
        this.guiHead.addEventListener('mousedown', function(event) {
            isDragging = true;
            offsetX = event.clientX - gui.getBoundingClientRect().left;
            offsetY = event.clientY - gui.getBoundingClientRect().top;
        });
        document.addEventListener('mousemove', function(event) {
            if (isDragging) {
                const newLeft = event.clientX - offsetX;
                const newTop = event.clientY - offsetY;
                gui.style.left = newLeft + 'px';
                gui.style.top = newTop + 'px';
            }
        });
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });

        let styleSheet = document.createElement('style');
        let css = `
        .myFUNNYGUY {
            --name-width: 100px;
            --gui-width: 245px;
            --row-height: 30px;
            --elm-height: 20px;
            --inp-width: 80px;
            --bg-color: rgba(85, 85, 85, 0.5);

            -webkit-touch-callout: none; /* iOS Safari */
            -webkit-user-select: none; /* Safari */
             -khtml-user-select: none; /* Konqueror HTML */
               -moz-user-select: none; /* Old versions of Firefox */
                -ms-user-select: none; /* Internet Explorer/Edge */
                    user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */

            background-color: var(--bg-color);
            position: fixed;
            top: 25vh;
            z-index: 9999;
            width: 245px;
            padding-bottom: 10px;

            font-size: var(--elm-height);
            font-weight: bold;
            font-family: Orbitron;
            color: white;
        }
        .myFUNNYGUY #headDiv {
            cursor: grab;
            text-align: center;
            height: var(--row-height);
        }
        .myFUNNNYGUY .myBox {
            width: var(--gui-width);
            padding: 0px;
            margin: 0;
        }
        .myFUNNYGUY .title {
            display: inline-block;
            cursor: pointer;
            transition: max-height 0.3s ease-in-out;
            width: 100%;
            max-height: 2em;
            border-bottom: 1px solid black;
        }

        .myFUNNYGUY .title:before {
            content: '▾';
            display: inline-block;
            transition: transform 0.3s ease-in-out;
        }
        .myFUNNYGUY .title.closed:before {
            content: '▸';
        }

        .myFUNNYGUY .row {
            display: flex;
            flex-direction: row;
            align-items: center;

            margin-left: 10px;
            height: var(--elm-height);
        }
        .myFUNNYGUY .label {
            width: var(--name-width);
            line-height: var(--elm-height);
            text-overflow: clip;
            text-align: left;

            margin-right: 10px;
            padding: 0;
            margin: 0;
            font-size: large;
        }
        .myFUNNYGUY .subOptionOpen {
            vertical-align: top;
            overflow: hidden;
            transition: max-height 0.3s ease-in-out;
        }
        .myFUNNYGUY .subOptionClosed {
            vertical-align: top;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-in-out;
        }

        .myFUNNYGUY input {
            margin-top: auto;
            margin-bottom: auto;
        }
        .myFUNNYGUY .select,
        .myFUNNYGUY .button,
        .myFUNNYGUY .inputColor,
        .myFUNNYGUY input {
            color: black;
        }

        .myFUNNYGUY input[type=checkbox] { margin: 0; outline: none; height: var(--elm-height); width: var(--elm-height);}
        .myFUNNYGUY input:hover { cursor: pointer;}
        .myFUNNYGUY input:focus { box-shadow: 0 0 10px #9ecaed;}
        .myFUNNYGUY input[type=radio] { border-top: auto; height: 20px;}
        .myFUNNYGUY input[type=color] { width: 50px;}
        .myFUNNYGUY .checked {
            height: var(--elm-height);
            width: var(--elm-height);
            box-shadow: -1px -2px 5px gray;
            border: 3px solid gray;
            background-color: green;
            margin-top: auto;
            margin-bottom: auto;
            box-shadow: 2 2 2px #a0a0a0;
        }
        .subOptionOpen .input,
        .subOptionOpen .inputText,
        .subOptionOpen .select {
            width: var(--inp-width);
            height: var(--elm-height);
        }
        .myFUNNYGUY .select {
            font-size: calc(var(--elm-height) * 0.75);
        }
        .myFUNNYGUY .colGreen {
            background-color: green;
        }
        .myFUNNYGUY .colRed {
            background-color: red;
        }
        .myFUNNYGUY .button {
            width: var(--elm-height);
            height: var(--elm-height);
            padding: 0;
            margin: 0;
            font-size: small;
        }

        .myFUNNYGUY .inputColor {
            height: var(--elm-height);
            font-size: small;
        }

        `;
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);
    }
    addMainFolder(name, id = '', className = '') {
        return new Folder(this.gui, name, id, className);
    }
    static createCustomElement(HTMLTag, parent, innerTxt, type, id, className) {
        let htmlTag = document.createElement(HTMLTag);
        parent.appendChild(htmlTag);


        if (innerTxt && type != "select")   htmlTag.innerText   = innerTxt;
        if (type && type != "select")       htmlTag.type        = type;
        if (id)         htmlTag.id          = id;
        if (className)  htmlTag.className   = className;

        if (type == "number") {
            htmlTag.value = innerTxt;
        } else if (type == "select") {

            // innerTxt in this example is : ["a","b", ..]
            for (let o of innerTxt) {
                // console.log(o);
                GUI.createCustomElement("option", htmlTag, o, "", "", "option")
            }
        }

        return htmlTag;
    }
}

class Folder {
    constructor(parent, name, id, className, guiInstance) {
        this.parent = parent;
        this.name = name;
        this.id = id;
        this.className = className;
        this.gui = guiInstance;
        this.init();
    }
    init() {
        let _this = this;
        let container   = GUI.createCustomElement('div', this.parent, '', '', '', 'myBox');
        let button      = GUI.createCustomElement('div', container, this.name, '', this.id, this.className);
        let subOptions  = GUI.createCustomElement('div', container, '', '', '', 'subOptionClosed');
        this.subOptions = subOptions;

        button.onclick = function() {
            if      (subOptions.className === 'subOptionOpen')   { subOptions.className = 'subOptionClosed'; button.className = _this.className + ' closed'}
            else if (subOptions.className === 'subOptionClosed') { subOptions.className = 'subOptionOpen'; button.className = _this.className + ' open'}
        }
        return subOptions;
    }
    addFolder(name, id = '', className = '', guiInstance) {
        return new Folder(this.subOptions, name, id, className, guiInstance);
    }
    add(options, name, type = "checkbox", val = 32) {
        // Each GUI row has a label and an input
        let row     = GUI.createCustomElement('div', this.subOptions, '', '', '', 'row');
        let label   = GUI.createCustomElement('label', row, name, '', '', 'label');
        let input;
        if (type == "checkbox") {
            input   = GUI.createCustomElement('input', row, '', type, '', 'input');

            const updateCheckboxState = () => { input.checked = options[name]; };
            const updateOptionsState = () => { options[name] = input.checked; };
            updateCheckboxState();

            input.addEventListener('change', () => { updateOptionsState(); opts.saveOptions(); });
            options[name] = input.checked;

            // Watch for changes in the options object and update the checkbox accordingly
            Object.defineProperty(options, name, {
                set(value) {
                    input.checked = value;
                },
                get() {
                    return input.checked;
                },
            });
        }
        else if (type == "number") {
            input = GUI.createCustomElement('input', row, val, type, '', 'input');

            const updateCheckboxState = () => { input.value = options[name]; };
            const updateOptionsState = () => { options[name] = parseInt(input.value) || 32; };
            updateCheckboxState();

            input.addEventListener('change', () => {updateOptionsState(); opts.saveOptions();});
            options[name] = parseInt(input.value) || 32;

            // Watch for changes in the options object and update the checkbox accordingly
            Object.defineProperty(options, name, {
                set(value) {
                    input.value = value;
                },
                get() {
                    return parseInt(input.value) || 32;
                },
            });
        } else if (type == "select") {
            input = GUI.createCustomElement('select', row, val, type, '', 'select');

            const updateCheckboxState = () => { input.value = options[name]; };
            const updateOptionsState = () => { options[name] = input.value; };
            updateCheckboxState();

            input.addEventListener('change', () => { updateOptionsState(); opts.saveOptions();});
            options[name] = input.value;

            // Watch for changes in the options object and update the checkbox accordingly

            Object.defineProperty(options, name, {
                set(value) {
                    input.value = value;
                },
                get() {
                    return name=="allies" ? input : input.value;
                },
            });

            if (name == "allies") {
                let buttonAdd = GUI.createCustomElement('button', row, '+', '', '', 'button');
                let buttonRemove = GUI.createCustomElement('button', row, '-', '', '', 'button');
                buttonAdd.onclick = function() {
                    options.alliesList.push(input.value);
                }
                buttonRemove.onclick = function() {
                    options.alliesList = options.alliesList.filter(item => item !== input.value);
                }
            }

        } else if (type == "input") {
            input = GUI.createCustomElement('input', row, val, type, '', 'inputText');
            // let buttonAdd = GUI.createCustomElement('button', row, '+', '', '', 'button');
            // let buttonRemove = GUI.createCustomElement('button', row, '-', '', '', 'button');

            input.onfocus = function() {
                if (typeof j46 !== 'undefined') {
                    j46 = true; // disables movement in the game until other game input is recieved
                }
            }
            input.onblur = function() {
                if (typeof j46 !== 'undefined') {
                    j46 = false; // disables movement in the game until other game input is recieved
                }
            }

            const updateCheckboxState = () => { input.value = options[name]; };
            const updateOptionsState = () => { options[name] = input.value; };
            updateCheckboxState();

            input.addEventListener('change', () => { updateOptionsState(); opts.saveOptions();});
            options[name] = input.value;

            // Watch for changes in the options object and update the checkbox accordingly

            Object.defineProperty(options, name, {
                set(value) {
                    input.value = value;
                },
                get() {
                    return input.value;
                },
            });

            // buttonAdd.onclick = function() {
            //     options.alliesList.push(input.value);
            // }
            // buttonRemove.onclick = function() {
            //     options.alliesList = options.alliesList.filter(item => item !== input.value);
            // }
        } else if (type == "color") {
            input   = GUI.createCustomElement('input', row, '', 'color', '', 'inputColor');

            const updateCheckboxState = () => { input.value = options[name]; };
            const updateOptionsState = () => { options[name] = input.value; opts.colorChange = true; };
            updateCheckboxState();

            input.addEventListener('change', () => { updateOptionsState(); opts.saveOptions(); });
            options[name] = input.value;

            // Watch for changes in the options object and update the checkbox accordingly
            Object.defineProperty(options, name, {
                set(value) {
                    input.value = value;
                },
                get() {
                    return input.value;
                },
            });
        } else if (type == "button") {
            let resetButton   = GUI.createCustomElement('button', row, 'Reset', '', '', 'inputColor');
            let randomButton   = GUI.createCustomElement('button', row, 'Random', '', '', 'inputColor');

            resetButton.onclick = function() {
                window.longCrate[0][1][1][3] = opts.texturePack.longCrate = opts.defaultColors[1];
                window.crate[0][1][1][3]     = opts.texturePack.squareCrate = opts.defaultColors[0];
                window.longCrate[0][0][1][3] = opts.texturePack.longCrateBorder = opts.defaultColors[2];
                window.crate[0][0][1][3]     = opts.texturePack.squareCrateBorder = opts.defaultColors[2];
                opts.colorChange = true;
                opts.saveOptions();
            }
            randomButton.onclick = function() {
                window.longCrate[0][1][1][3] = opts.texturePack.longCrate = calc.rColor();
                window.crate[0][1][1][3]     = opts.texturePack.squareCrate = calc.rColor();
                window.longCrate[0][0][1][3] = opts.texturePack.longCrateBorder = calc.rColor();
                window.crate[0][0][1][3]     = opts.texturePack.squareCrateBorder = calc.rColor();
                opts.colorChange = true;
                opts.saveOptions();
            }
            /*const updateCheckboxState = () => { input.value = options[name]; };
            const updateOptionsState = () => { options[name] = input.value; opts.colorChange = true; };
            updateCheckboxState();

            input.addEventListener('change', () => { updateOptionsState(); opts.saveOptions(); });
            options[name] = input.value;

            // Watch for changes in the options object and update the checkbox accordingly
            Object.defineProperty(options, name, {
                set(value) {
                    input.value = value;
                },
                get() {
                    return input.value;
                },
            });*/
        }
    }
}

class calc {
    static round_to(n, dec) {
        return Math.round( n * (10**dec)) / (10**dec);
    }
    static multiply(vectorA, vectorB) {
        return vectorA.x*vectorB.x + vectorA.y*vectorB.y;
    }
    static length(vector) {
        return Math.sqrt(vector.x**2+vector.y**2);
    }
    static angle180(vectorA, vectorB) {
        return Math.acos( calc.multiply(vectorA,vectorB) / (calc.length(vectorA)*calc.length(vectorB)) );
    }
    static angle360(vectorA, vectorB) {
        // GETS THE ANGLE IN [0,360] DEGREES AND NOT JUST [0,180], WHICH IS PRETTY USEFULL..
        let dot = vectorA.x * vectorB.x + vectorA.y * vectorB.y;      //# dot product
        let det = vectorA.x * vectorB.y - vectorA.y * vectorB.x;      //# determinant
        return Math.atan2(det, dot); //# atan2(y, x) or atan2(sin, cos)
    }
    static vectorAB(a,b) {
        return {x: a.x - b.x, y: a.y - b.y}
    }
    static rotateVector(vector, angle) {
        let v1 = [vector.x, vector.y];
        let v2 = {x: 0,y: 0};
        v2.x = v1[0] * Math.cos(angle) - v1[1]*Math.sin(angle);
        v2.y = v1[0] * Math.sin(angle) + v1[1]*Math.cos(angle);
        return v2;
    }
    static radiansToDegrees(piFraction) {
        return (piFraction / Math.PI) * 180;
    }
    static collisionCheck(obstacles, t) {

        let p = 20; // 1/2 of playerWidth..
        // let maxChecks = Math.min(5, obstacles.length); // the walls should be somewhat sorted
        for (let i = 0; i < obstacles.length; i++) {
            let wall = obstacles[i];

            // let TL = (wall.x1 < t.x && wall.y)
            // let betweenX = (wall.x1 > t.x && t.x > wall.x2);
            // let betweenY = (wall.y1 < t.y && t.y > wall.y2);
            // if (betweenX && betweenY) return true;
            // (wall.x1 > t.x && t.x > wall.x2)
            // (wall.y1 > t.y && t.y > wall.y2)
            if (t.x < (wall.x1 - p) || t.y < (wall.y1 - p) ) continue
            if (t.x > (wall.x2 + p) || t.y > (wall.y2 + p) ) continue
            return true;
            //if (betweenX && betweenY) return true;
        }

        //const closestAcceptableDistance = 50**2;
        //for (let i = 0; i < obstacles.length; i++) {
        //    const w = obstacles[i];
        //    const d1 = calc.distanceSquared(t, {x: w.x1, y: w.y1});
        //    const d2 = calc.distanceSquared(t, {x: w.x2, y: w.y1});
        //    const d3 = calc.distanceSquared(t, {x: w.x1, y: w.y2});
        //    const d4 = calc.distanceSquared(t, {x: w.x2, y: w.y2});
        //    const closestDistanceSquared = Math.min(d1,d2,d3,d4);
        //    if (closestDistanceSquared < closestAcceptableDistance) return true;
        //}
        return false;
    }
    static combine(vectorA, vectorB) {
        return {x: vectorA.x + vectorB.x, y: vectorA.y + vectorB.y}
    }
    static distance(coor1, coor2) {
        return Math.hypot(coor2.x - coor1.x, coor2.y - coor1.y);
    };
    static distanceSquared(coor1, coor2) {
        // I was told sqrt is slow okay
        return (coor2.x - coor1.x)**2 + (coor2.y - coor1.y)**2;
    };
    static entitiesDistance(entities, point) {
        entities.forEach(e => {
            e.distance = calc.distance(e, point)
        });
    }
    static sortByDistance(entities, point) {
        calc.entitiesDistance(entities, point);
        entities.sort((a, b) => a.distance - b.distance);
    };
    static normalize(v, length) {
        const currLength = calc.length(v);
        const scaleRatio = length / currLength;
        return {x: v.x * scaleRatio, y: v.y * scaleRatio }
    }
    static sortByDistanceFaster(entities, point) {
        // I think it is faster, :eyes: laze, with e okay, just deal with it
        entities.forEach(e => {
            e.distanceSquared = calc.distanceSquared(e, point)
        });
        entities.sort((a, b) => a.distanceSquared - b.distanceSquared);
        return entities;
    }
    static sortByDistanceFilter(entities, point, maxDistance) {
        let remainingEnemies = [];
        for (let i = 0; i < entities.length; i++) {
            let e = entities[i];
            e.distanceSquared = calc.distanceSquared(e, point);
            if (e.distanceSquared <= maxDistance * maxDistance) remainingEnemies.push(e);
        }
        remainingEnemies.sort((a, b) => a.distanceSquared - b.distanceSquared); // may make it slower, (hence removed)
        return remainingEnemies;
    }
    static collisionCoord(a,b) {

        // let a = {x:2,y:6,dx:3,dy:-4}; // let a = {x:2,y:6,dx:3,dy:-4};
        // let b = {x:0,y:-3,dx:2,dy:2}; // let b = {x:0,y:-3,dx:1,dy:1};

        if (b.dx ==0) { b.dx = 0.0001; }
        const s1 = (a.x-b.x)/b.dx;
        const s2 = a.dx/b.dx;
        const t = (a.y-b.y-b.dy*s1)/(-a.dy+b.dy*s2);
        const s = (a.x+a.dx*t-b.x)/b.dx;

        const x = a.x+a.dx*t;
        const y = a.y+a.dy*t;

        if (0 < s && s < 1 && 0 < t && t < 1) return {x: x, y: y};
        return false;
    }

    static aheadNess(e, distance) {
        return {
            x: e.x + e.spdX * distance / (window.fac ?? options.aimbot.calibrate - GameInterface.currentPing/10), // ping part is under tests (not used)
            y: e.y + e.spdY * distance / (window.fac ?? options.aimbot.calibrate - GameInterface.currentPing/10),
        }
    }

    static gunToEnemy(player, enemy, distance, getGunLengthMultiplier = 1) {
        const end = calc.aheadNess(enemy, distance);

        const angle = Math.atan2(player.y - end.y, player.x - end.x) + Math.PI; // 0 - 6
        const deltaX = Math.cos(angle - Math.PI / game.getGunOffset(player.class));
        const deltaY = Math.sin(angle - Math.PI / game.getGunOffset(player.class));

        const start = {
            x: player.x + deltaX * game.getGunLength(player.class) * getGunLengthMultiplier,
            y: player.y + deltaY * game.getGunLength(player.class) * getGunLengthMultiplier
        }

        return {start: start, end: end}
    }

    static lineCollidesWithWalls(gunLine, walls, ctx, doCollisionDrawing = options.aimbot.espCollisions) {
        let visible = true;
        let i = 0;
        while (visible && i < walls.length) {
            const w = walls[i];
            let wallTop = {x: w.x1, y: w.y1, dx: w.width, dy: 0}
            let wallBot = {x: w.x1, y: w.y2, dx: w.width, dy: 0}
            let wallLef = {x: w.x1, y: w.y1, dx: 0, dy: w.height}
            let wallRig = {x: w.x2, y: w.y1, dx: 0, dy: w.height}

            let col1 = calc.collisionCoord(gunLine, wallTop);
            let col2 = calc.collisionCoord(gunLine, wallBot);
            let col3 = calc.collisionCoord(gunLine, wallLef);
            let col4 = calc.collisionCoord(gunLine, wallRig);

            if (col1 || col2 || col3 || col4) {
                visible = false;

                // Aimbot espCollisions
                if (doCollisionDrawing) {
                    if (col1) { col1 = game.getScreenPos(col1); Draw.circle(ctx, col1.x, col1.y, 5, "red"); }
                    if (col2) { col2 = game.getScreenPos(col2); Draw.circle(ctx, col2.x, col2.y, 5, "red"); }
                    if (col3) { col3 = game.getScreenPos(col3); Draw.circle(ctx, col3.x, col3.y, 5, "red"); }
                    if (col4) { col4 = game.getScreenPos(col4); Draw.circle(ctx, col4.x, col4.y, 5, "red"); }
                }
            }
            i++;
        }
        return visible;
    }

    // From vaakirhack v3
    static rColor()          {
        return calc.rgbToHex(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255));
    }
    static componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    static rgbToHex(r, g, b) {
        return "#" + calc.componentToHex(r) + calc.componentToHex(g) + calc.componentToHex(b);
    }
}

const options = new class OptionsMenu {
    aimbot = {
        active: false,
        alwaysAim: false,
        calibrate: 30,
        moveFrequency: 10,
        autoShoot: true,
        espLine: true,
        espCollisions: true,
        allies: "",
        alliesList: ["[1337] PureVaakir","PureVaakir","Hacker0","VaakTradeBot"]
    }
    AI = {
        autoRespawn: false,
        autoTalk: false,
        tactReload: true,
        pathFinding: false,
        autoRetreat: true,
        cautious: true,
        espVector: true,
        algorithm: "terminator",
        followLeader: "PureVaakir",
        updateFrequency: 5,
    }
    esp = {
        active: true,
        playerLine: false,
        shootRange: true,
        walls: false,
        showAllies: false
    }
    autoUpgrade = {
        active: true,
        perk1: "longRange",
        perk2: "dash",
        perk3: "thickSkin"
    }
    misc = {
        zoom: true,
        antiSilencer: true,
        anitCamo: true,
        anitMines: true,
    }
    chatScroller = {
        active: false,
        activatedOnce: false,
        speed: 10,
        message: "Vaakir hax",
    }
    options = {
        textWidth: 20
    }
    data = {
        active: false,
        x: 0,
        y: 0,
        test1: false,
        test2: false,
    }
    texturePack = {
        longCrate: "#303030",
        squareCrate: "#b1e9f9",
        longCrateBorder: "#646464",
        squareCrateBorder: "#4dd8f0",
        wtf: false,
        texture: "ok"
    }
    futureUpdates = {}

    // these need only to be gathered every now and then, not for every animation frame #tick,
    // therefore I am saving them here together with the rest
    walls = [];

    // AI pathfinding variables
    searchLength = 30;
    rotating = Math.PI/24; // Rotating check by 0.2r = 11.5degrees
    mapCenterVector = {x: 3500, y: 3500}
    goalVector = {x: 3500, y: 3500}
    goal = {x: 3500, y: 3500}
    movementVector = {x: this.searchLength, y: 0} // silk touch
    perkBotActive = false;
    defaultColors = ["#dfbf9f","#bec8dd","#808080"];
    colorChange = true;
    changeRotatitingDirection = false;

    lastChat = Date.now();

    wtfOn = false; // darkmode is wtf

    // goalVector = {x:this.goal.x - this.x, y:this.goal.y - this.y};

    constructor() {
        this.init();
    }
    init() {
        this.loadOptions();

        this.gui = new GUI(document.body);

        const hackpack = this.gui.addMainFolder('Hacks', '', 'title');
        const aimbot = hackpack.addFolder('Aimbot (right click)', '', 'title', this.gui);
        aimbot.add(this.aimbot, 'active');
        aimbot.add(this.aimbot, 'alwaysAim');
        aimbot.add(this.aimbot, 'calibrate', 'number', this.aimbot.calibrate);
        aimbot.add(this.aimbot, 'moveFrequency', 'number', this.aimbot.moveFrequency);
        aimbot.add(this.aimbot, 'allies', 'select','');
        aimbot.add(this.aimbot, 'autoShoot');
        aimbot.add(this.aimbot, 'espLine');
        aimbot.add(this.aimbot, 'espCollisions');

        const AI = hackpack.addFolder('AI', '', 'title', this.gui);
        AI.add(this.AI, 'autoRespawn');
        AI.add(this.AI, 'autoTalk');
        AI.add(this.AI, 'tactReload');
        AI.add(this.AI, 'pathFinding');
        AI.add(this.AI, 'autoRetreat');
        AI.add(this.AI, 'cautious');
        AI.add(this.AI, 'espVector');
        AI.add(this.AI, 'algorithm', 'select', 'terminator follow'.split(" "));
        AI.add(this.AI, 'followLeader', 'input', 'PureVaakir');
        AI.add(this.AI, 'updateFrequency', 'number', this.AI.updateFrequency);

        const esp = hackpack.addFolder('Esp', '', 'title');
        esp.add(this.esp, 'active');
        esp.add(this.esp, 'playerLine');
        esp.add(this.esp, 'shootRange');
        esp.add(this.esp, 'showAllies');
        esp.add(this.esp, 'walls');

        const autoUpgrade = hackpack.addFolder('AutoUpgrade', '', 'title');
        autoUpgrade.add(this.autoUpgrade, 'active');
        autoUpgrade.add(this.autoUpgrade, 'perk1', 'select', 'bipod optics thermal armorPiercing extended grip silencer lightweight longRange thickSkin'.split(' '));
        autoUpgrade.add(this.autoUpgrade, 'perk2', 'select', 'shield firstAid grenade knife engineer ghillie dash gasGrenade landMine fragGrenade'.split(' '));
        autoUpgrade.add(this.autoUpgrade, 'perk3', 'select', 'bipod optics thermal armorPiercing extended grip silencer lightweight longRange thickSkin'.split(' '));

        const misc = hackpack.addFolder('Misc', '', 'title');
        misc.add(this.misc, 'zoom');
        misc.add(this.misc, 'antiSilencer');
        misc.add(this.misc, 'anitCamo');
        misc.add(this.misc, 'anitMines');

        const chatScroller = hackpack.addFolder('ChatScroller', '', 'title');
        chatScroller.add(this.chatScroller, 'active');
        chatScroller.add(this.chatScroller, 'speed', 'number', this.chatScroller.speed);
        chatScroller.add(this.chatScroller, 'message', 'input', 'Try Vaakir hack!');

        const data = hackpack.addFolder('data', '', 'title');
        data.add(this.data, 'active');
        data.add(this.data, 'x', 'input', '');
        data.add(this.data, 'y', 'input', '');
        data.add(this.data, 'test1');
        data.add(this.data, 'test2');

        const texturePack = hackpack.addFolder('texturePack', '', 'title');
        texturePack.add(this.texturePack, 'longCrate', 'color', '');
        texturePack.add(this.texturePack, 'squareCrate', 'color', '', );
        texturePack.add(this.texturePack, 'longCrateBorder', 'color', '', );
        texturePack.add(this.texturePack, 'squareCrateBorder', 'color', '', );
        texturePack.add(this.texturePack, 'wtf');
        texturePack.add(this.texturePack, 'texture', 'button', '');

        const future = hackpack.addFolder('FutureUpdates', '', 'title');
        future.add(this.AI, 'AI');
        future.add(this.AI, 'autoCalibrate');
        future.add(this.AI, 'multiboxing');
        future.add(this.AI, 'knifebot');
        future.add(this.AI, 'shieldbot');
        future.add(this.AI, 'customstuff');



        // const AI = hackpack.addFolder('AI', '', 'title');
        // AI.add(this.AI, 'comingSoonTM');

        // const chatScroller = hackpack.addFolder('ChatScroller', '', 'title');
        // chatScroller.add(this.chatScroller, 'comingSoon');
        // chatScroller.add(this.chatScroller, 'message', 'input','ok?');

        //const options = hackpack.addFolder('Options', '', 'title');
        // options.add(this.options, 'textWidth', 'number', this.options.textWidth);

    }
    loadOptions() {
        try {
            const savedOptions = JSON.parse(localStorage.getItem('options'));
            if (savedOptions) {
                Object.assign(this, savedOptions);
                this.aimbot.active = false; // Because I haven't added in an activation, unless you right click yet.
                this.colorChange = true; // just because
                this.wtfOn = false; // also just because - experiment
                this.chatScroller.activatedOnce = false; // also is just just because, amen to that
                this.perkBotActive = false;
                changeRotatitingDirection = false;
            }
        } catch (error) {
            console.error('Error loading options from localStorage:', error);
        }
    }
    saveOptions() {
        try {
            let saveData = JSON.stringify(this);
            localStorage.setItem('options', saveData);
        } catch (error) {
            console.error('Error saving options to localStorage:', error);
        }
    }
}
window.opts = options;

class Draw {
    static line(ctx, start, end, color="black", lineWidth=1) {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    }
    static triangle(ctx,x,y,size,color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(x-size/2, y);
        ctx.lineTo(x, y-size);
        ctx.lineTo(x+size/2, y);
        ctx.closePath();
        ctx.fill();
    }
    static circle(ctx, x, y, radius, color="red", lineWidth=1) {
        ctx.fillStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

class GameInterface {
    static get localPlayerId() {
        return +(window.c3 ?? '-1')
    }

    static get camera() {
        return window.c2
    }

    static get playerPool() {
        return window.RD?.pool || {}
    }

    static get grenadePool() {
        return window.RA?.pool || {}
    }

    static get wallPool() {
        return window.RB?.pool || {}
    }

    static get projectilePool() {
        return window.RC?.pool || {}
    }

    static get scaleX() {
        return window.j6
    }

    static get scaleY() {
        return window.j5
    }

    static get upgrades() {
        return window.o3
    }

    static get conn() {
        return RF.list[0]
    }

    static get leaderBoard() {
        return j38.current
    }

    static get currentPlayers() {
        return parseInt(o4.currentPlayers);
    }

    static get currentPing() {
        return RF.list[0].currentPing;
    }

}

class Game {
    constructor() {}

    get isIngame() {
        return GameInterface.localPlayerId > -1
    }

    get localPlayer() {
        return GameInterface.playerPool[GameInterface.localPlayerId]
    }
    get isAlive() {
        return (this.isIngame && this.localPlayer?.hp > 0)
    }

    getGunLength(playerClass = this.localPlayer?.class) {
        return {
            pistol: 60,
            smg: 60,
            shotgun: 80,
            assault: 80,
            'bolt-action-rifle': 100,
            'machine-gun': 85
        }[playerClass] || 0
    }

    getGunRange(playerClass = this.localPlayer?.class) {
        let hasLongRange = false;
        if (playerClass == this.localPlayer?.class) hasLongRange = Object.values(GameInterface.upgrades).indexOf('longRange') > -1
        const range = {
            pistol: 400,
            smg: 280,
            shotgun: 235,
            assault: 370,
            'bolt-action-rifle': 620,
            'machine-gun': 365
        }[playerClass] || 0
        const rangeBonus = hasLongRange ? range * (window.fact ?? 0.5) : 0
        return range + rangeBonus
    }

    getGunOffset(playerClass = this.localPlayer?.class) {
        return {
            pistol: 10,
            smg: 10,
            shotgun: 12,
            assault: 12,
            'bolt-action-rifle': 16,
            'machine-gun': 14
        }[playerClass] || 0
    }

    getPlayers(includeMe=true, includeMates=true, includeEnemies=true) {
        if (!this.isIngame) return []
        const { id, teamCode } = this.localPlayer

        return Object.values(GameInterface.playerPool)
            .filter(player => {
                if (!player.activated) return false
                if (player.hp <= 0) return false
                if (!includeMe && player.id === id) return false
                if (!includeMates && ((player.teamCode !== 0 && player.teamCode === teamCode) || options.aimbot.alliesList.includes(player.username))) return false
                if (!includeEnemies && ((player.teamCode === 0 || player.teamCode !== teamCode) && !options.aimbot.alliesList.includes(player.username))) return false
                return true
            })
    }

    getEnemies() {
        return this.getPlayers(false, false, true)
    }

    getMates() {
        return this.getPlayers(false, true, false)
    }

    getGrenades() {
        return Object.values(GameInterface.grenadePool).filter(grenade => {
            if (!grenade.activated) return false
            return true
        })
    }

    getWalls() {
        return Object.values(GameInterface.wallPool)
            .filter(wall => {
                if (!wall.activated) return false
                return true
            })
            .map(wall => {
                const fixedWall = { ...wall }
                const size = wall.model[0][0][0][0]
                fixedWall.width = size * 2
                fixedWall.height = size * 2

                if (wall.type === 'longCrate') {
                    if (wall.angle / 90 % 2 === 0) { fixedWall.width /= 2 }
                    else { fixedWall.height /= 2 }
                }

                // Used for the aimbot wall detection check
                fixedWall.x1 = fixedWall.x - fixedWall.width / 2
                fixedWall.x2 = fixedWall.x + fixedWall.width / 2
                fixedWall.y1 = fixedWall.y - fixedWall.height / 2
                fixedWall.y2 = fixedWall.y + fixedWall.height / 2



                return fixedWall
            })
    }

    getProjectiles() {
        return Object.values(GameInterface.projectilePool).filter(projectile => {
            if (!projectile.activated) return false
            //if (projectile.x !== 0 && projectile.x !== 0) return false
            return true
        })
    }

    getScreenPos(pos) {
        return GameInterface.camera?.getRelPos(pos) || { x: 0, y: 0 }
    }

    resizeCamera(width, height) {
        if (!this.isIngame) return
        window.width = width;
        window.height = width / (16 / 9);

        window.a1({
            width: width,
            height: typeof height !== 'undefined' ? height : width / (16 / 9)
        });
    }

    isOutsideMap(entity) {
        /*
            0  -> 3500-1000 = 1000
            11 -> 3500-2000 = 1500
            10 -> 3500-2000 = 1500
            17 -> 3500-1500 = 2000
            24 -> 3500-1500 = 2000
            25 -> 3500-1000 = 2500
        */
        const borderLevel = {
            0: 0,
            5: 0,
            10: 1,
            15: 1,
            20: 2,
            25: 3,
            30: 3
        }[Math.floor((GameInterface.currentPlayers) / 5)*5]
        const borderGrowth = 500;
        const defaultSize = 1000;

        const mapFogVertices = {
            x1: 3500 - (defaultSize + borderGrowth * borderLevel),
            x2: 3500 + (defaultSize + borderGrowth * borderLevel),
            y1: 3500 - (defaultSize + borderGrowth * borderLevel),
            y2: 3500 + (defaultSize + borderGrowth * borderLevel),
        }
        const outsideX =  (mapFogVertices.x1 > entity.x || entity.x > mapFogVertices.x2);
        const outsideY =  (mapFogVertices.y1 > entity.y || entity.y > mapFogVertices.y2);
        if (outsideX || outsideY) return true;
        return false;
    }

    /*setMouse(x, y) {
      if (!document.onmousemove) return
      const clientX = x * GameInterface.scaleX
      const clientY = y * GameInterface.scaleY
      document.onmousemove(new MouseEvent('mousemove', { clientX, clientY }))
    }*/
}
const game = new Game()
window.game = game

class Hack {
    #canvas = document.querySelector('canvas');
    #ctx = this.#canvas.getContext('2d');
    #aimbot = { active: false, target: null, x: 0, y: 0 }
    iter = 1;
    iterMax = 50;
    alliesWalls = [];

    constructor() {
        this.#initRender();
        this.#initAimbot();
        this.#initZoom();
        //this.#hookMouse()
    }

    /*fixConsole() {
        let _this = this
        setTimeout(() => {
            const iframe = document.createElement('iframe')
            iframe.style.display = 'block'
            document.body.appendChild(iframe)
            window.console = iframe.contentWindow.console
            _this.er = iframe
        })
    }*/

    #initRender() {
        this.#ctx.oclearRect = this.#ctx.oclearRect || this.#ctx.clearRect
        this.#ctx.clearRect = (...args) => {
            this.#ctx.oclearRect(...args)
            requestAnimationFrame(() => {
                if (game.isIngame) this.#tick()
            })
        }
    }

    #initAimbot() {
        const mouseMoveHook = evt => {
            if (!mouseMoveHook.original) return

            const clientX = (options.aimbot.active && this.#aimbot.active && this.#aimbot.target?.visible && game.isAlive) ? this.#aimbot.x * GameInterface.scaleX : evt.clientX;
            const clientY = (options.aimbot.active && this.#aimbot.active && this.#aimbot.target?.visible && game.isAlive) ? this.#aimbot.y * GameInterface.scaleY : evt.clientY;

            return mouseMoveHook.original(
              new MouseEvent('mousemove', {
                view: evt.view,
                bubbles: evt.bubbles,
                cancelable: evt.cancelable,
                clientX: clientX,
                clientY: clientY
              })
            );
        }

        mouseMoveHook.original = document.onmousemove;
        document.onmousemove = mouseMoveHook;

        Object.defineProperty(document, 'onmousemove', {
            set: val => {
                mouseMoveHook.original = val;
            }
        })

        let interval;
        window.onmousedown = ({ button, clientX, clientY }) => {
            if (button == 2) {
                options.aimbot.active = !options.aimbot.active;
                this.#aimbot.active = true;
                interval = setInterval(() => {
                    if (options.aimbot.active && this.#aimbot.active && game.isAlive) {
                        if (this.#aimbot.target) {
                            if (this.#aimbot.target.activated && this.#aimbot.target.hp > 0) {
                                const clientX = this.#aimbot.x * GameInterface.scaleX;
                                const clientY = this.#aimbot.y * GameInterface.scaleY;

                                if (this.#aimbot.target.visible || options.aimbot.alwaysAim) {
                                    mouseMoveHook.original(new MouseEvent('mousemove', { clientX, clientY }));
                                }
                                if (this.#aimbot.target.visible && options.aimbot.autoShoot) {
                                    document.onmousedown?.(new MouseEvent('mousedown', { clientX, clientY }));

                                    setTimeout(() => document.onmouseup?.(new MouseEvent('mouseup', { clientX, clientY })), 15);
                                }
                            }
                            else {
                                this.#aimbot.target = null;
                            }
                        }
                    }
                }, options.aimbot.moveFrequency);
            }
        }

        window.onmouseup = ({ button, clientX, clientY }) => {
            if (button === 2 && !options.aimbot.active) {
                clearInterval(interval)
                this.#aimbot.active = false;
                this.#aimbot.target = null;
                // options.aimbot.active = !options.aimbot.active;
                // options.aimbot.active = false;
            }
        }
    }

    #initZoom() {
        window.addEventListener("wheel", function(e) {
            if (options.misc.zoom) {
                // game.resizeCamera(window.width, window.height); soo.. window.width is max 2000, editing j7, j8 allows for further zoom which is fun..
                let dir = Math.sign(e.deltaY);
                if (dir== 1) {
                    a1({width: j7 * 1.1, height: j8 * 1.1});
                }
                if (dir==-1) {
                    a1({width: j7 * 0.9, height: j8 * 0.9});
                }
            }
        });
    }

    #tick() {
        const me = game.localPlayer;
        const enemies = game.getEnemies();
        const mates = game.getMates(); // mates :) best word usage
        // Remove enemies which are too close
        /*.filter(enemy => {
            if (enemy.x > me.x + 50) return true
            if (enemy.x < me.x - 50) return true
            if (enemy.y > me.y + 50) return true
            if (enemy.y < me.y - 50) return true
            return false
        })*/
        const myScreenPos = game.getScreenPos(me);
        const myAngle = me.playerAngle * (Math.PI / 180);
        let walls = options.walls; // game.getWalls();

        // calc.sortByDistance(enemies, me);

        // Gun range helper
        if (options.esp.active && options.esp.shootRange) {
            const gunStart = {
                x: me.x + Math.cos(myAngle - Math.PI / game.getGunOffset()) * game.getGunLength(),
                y: me.y + Math.sin(myAngle - Math.PI / game.getGunOffset()) * game.getGunLength()
            }
            const gunEnd = {
                x: gunStart.x + Math.cos(myAngle) * game.getGunRange(),
                y: gunStart.y + Math.sin(myAngle) * game.getGunRange()
            }
            // const gunStartScreenPos = game.getScreenPos(gunStart);
            // const gunEndScreenPos = game.getScreenPos(gunEnd);

            const fakeEnemy = {fake: true, x: gunEnd.x, y: gunEnd.y, spdX: 0, spdY: 0, distance: game.getGunRange()}
            enemies.unshift(fakeEnemy);

            // Draw.line(this.#ctx, gunStartScreenPos, gunEndScreenPos, "black", 1);
        }

        let fallBack = {dist: Infinity, x: undefined, newX: undefined, y: undefined, newY: undefined, visible: false}
        let visibleEnemies = [];

        // we do not want to shoot our allies.. so we pretend that they are moving square walls :>
        if (options.aimbot.alliesList.length > 0) {
            walls = walls.filter(item => !this.alliesWalls.includes(item));

            this.alliesWalls = [];
            for (const a of mates) {
                const dist = calc.distance(a, me);
                const aX = a.x + a.spdX * dist / (window.fac ?? options.aimbot.calibrate);
                const aY = a.y + a.spdY * dist / (window.fac ?? options.aimbot.calibrate);

                const newWallMove = {
                    x1: aX - 40, x2: aX + 40,
                    y1: aY - 40, y2: aY + 40,
                    width: 80, height: 80
                }
                const newWallPos = {
                    x1: a.x - 25, x2: a.x + 25,
                    y1: a.y - 25, y2: a.y + 25,
                    width: 50, height: 50
                }
                walls.push(newWallMove);
                walls.push(newWallPos);
                this.alliesWalls.push(newWallMove);
                this.alliesWalls.push(newWallPos);

                // enemy block esp
                if (options.esp.active && options.esp.showAllies) {
                    const topLeft0 = game.getScreenPos({x: newWallMove.x1, y: newWallMove.y1});
                    const topLeft1 = game.getScreenPos({x: newWallPos.x1, y: newWallPos.y1});

                    this.#ctx.strokeStyle = 'red';
                    this.#ctx.lineWidth = 1;
                    this.#ctx.strokeRect(topLeft0.x, topLeft0.y, newWallMove.width, newWallMove.height);
                    this.#ctx.strokeRect(topLeft1.x, topLeft1.y, newWallPos.width, newWallPos.height);
                }
            }
        }

        // Wall esp
        if (options.esp.active && options.esp.walls) {
            for (const w of walls) {
                const topLeft = game.getScreenPos({x: w.x1, y: w.y1});
                const bottomRight = game.getScreenPos({x: w.x2, y: w.y2});

                this.#ctx.strokeStyle = 'red';
                this.#ctx.lineWidth = 1;
                this.#ctx.strokeRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
            }
        }

        for (const enemy of enemies) {
            enemy.distance = calc.distance(enemy, me);
            const dist = enemy.distance - game.getGunLength();

            if (dist < game.getGunRange()) {

                const gunToEnemy = calc.gunToEnemy(me, enemy, dist);
                const startX = gunToEnemy.start.x;
                const startY = gunToEnemy.start.y;
                const endX = gunToEnemy.end.x;
                const endY = gunToEnemy.end.y;

                const startScreenPos = game.getScreenPos({ x: startX, y: startY });
                const endScreenPos = game.getScreenPos({ x: endX, y: endY });

                // Visibility check + no need to calculate the line collisions for the other enemies
                let visible = true;
                if (visibleEnemies.length == 0) {

                    // We do not want to shoot at walls.. so we check if our hypothetical gun line crosses each corner of every wall (close by)
                    const gunLine = {x: startX, y: startY, dx: endX - startX, dy: endY - startY}
                    visible = calc.lineCollidesWithWalls(gunLine, walls, this.#ctx);
                }

                // ESP playerLine
                if (options.esp.active && options.esp.playerLine && !enemy.fake) {
                    const enemyScreenPos = game.getScreenPos(enemy);
                    Draw.line(this.#ctx, myScreenPos, enemyScreenPos, enemy.color.a, 2);
                }

                // Aim target logic
                if (this.#aimbot.active && !enemy.fake) {
                    if (fallBack.newX == undefined) {
                        fallBack = {distance: enemy.distance, x: undefined, newX: endScreenPos.x, y: undefined, newY: endScreenPos.y, visible: visible, ...enemy}
                    } else if (visible && !fallBack.visible || !fallBack.visible && enemy.distance < fallBack.distance || fallBack.visible && visible && enemy.distance < fallBack.distance) {
                        fallBack = {distance: enemy.distance, x: undefined, newX: endScreenPos.x, y: undefined, newY: endScreenPos.y, visible: visible, ...enemy}
                    }
                }

                // Aimbot espLine
                if (options.aimbot.espLine) {
                    Draw.line(this.#ctx, startScreenPos, endScreenPos, visible ? 'green' : "red", 2);
                }
            }

            // Anti silencer bullet
            if (options.misc.antiSilencer) {
                if (enemy.ghillie && !enemy.fake) {
                    enemy.ghillie = 0;
                    enemy.invincible = 1;
                }
            }

            // Anti camo
            if (options.misc.anitCamo && !enemy.fake) {
                enemy.silenced = 0;
            }

            // Vaakir usage check ? :> not sus
            /*if (enemy.j47 == "Vaakir test " && me.j47 != "Yes sir!" && enemy.username == "PureVaakir") {
                GameInterface.conn.send(`c,Yes sir!`)
            }*/
        }

        // Aim target logic
        if (enemies.length > 0 && fallBack.newX !== undefined) {
            this.#aimbot.target = fallBack;
            this.#aimbot.target.visible = fallBack.visible;
            this.#aimbot.x = fallBack.newX;
            this.#aimbot.y = fallBack.newY;
        } else {
            this.#aimbot.target = null;
        }

        // Draw esp AI pathfinding vector
        if (options.AI.espVector) {
            const meScreenPos = game.getScreenPos(me);
            const endPathPos = game.getScreenPos( calc.combine(me, options.movementVector) );
            const endPathPosGoal = game.getScreenPos( calc.combine(me, options.goalVector) );
            Draw.line(this.#ctx, meScreenPos, endPathPos, 'blue');
            Draw.line(this.#ctx, meScreenPos, endPathPosGoal, 'green');
        }

        this.iter++;
        if (this.iter > options.AI.updateFrequency) {
            this.iter = 0;
            this.#tickLessOften();
        }

        /*
        // Auto Shield bot (dangerously toxic on a terminator bot..)
        let bullets = game.getProjectiles();
        if (bullets.length > 0) {
            for (let b of bullets) {
                if ((b.x != 0 || b.y != 0) && me.id != b.ownerId) {

                    const bulletVector = {y: b.spdX, x: b.spdY}
                    const futureBulletPos = calc.combine(b, bulletVector);
                    const futureMePos = calc.combine(me, {x: me.spdX, y: me.spdY});
                    if (calc.distance(futureBulletPos, futureMePos) < 70) {
                        const myAngle = calc.rotateVector(bulletVector, Math.PI / 2);
                        const angle = calc.angle360(myAngle, {x: 1, y: 0});

                        // enemy.spdX * dist / (window.fac ?? options.aimbot.calibrate);

                        // const myAngleDegress = calc.radiansToDegrees(angle);
                        // me.playerAngle = myAngleDegress;

                        if (me.score >= 300) {
                            this.#aimbot.target = fallBack;
                            this.#aimbot.target.visible = true;
                            this.#aimbot.x = me.x + Math.cos(angle) * 100;
                            this.#aimbot.y = me.y + Math.sin(angle) * 100;

                            if (options.perkBotActive == false) {
                                options.perkBotActive = true;
                                GameInterface.conn.send(`k,5,1`);
                                setTimeout(()=> {
                                    GameInterface.conn.send(`k,5,0`);
                                    options.perkBotActive = false;
                                }, 1000);
                            }
                        }
                        console.dir(`${me.id}, ${b.ownerId},${me.id == b.ownerId}, ${Object.keys(b)}, ${Object.values(b)}`)
                    }
                }
            }
        }*/
        // if (!options.chatScroller.active) options.scroller = false;
    }
    #tickLessOften() {
        // Performance boost? not all things should be calculated upon request animationframe like I am currently doing
        // upgrades would include not !! "sorting by distance" , "aimbot wallcollision check" for every single tick, use memory, right?
        // I am honestly too lazy to check the time usage of this, intuition works alright, feel free to improve this.. or expand this

        let walls = game.getWalls();
        let enemies = game.getEnemies();
        const marginOfSafety = 1.2;
        const me = game.localPlayer;
        const mates = game.getMates();
        const players = [...mates, ...enemies];
        calc.sortByDistanceFilter(walls, me, game.getGunRange() * marginOfSafety);
        options.walls = walls;
        let state = ''; // used for the autotalk bots

        // zoom hack
        if (options.misc.zoom) {
            if (me.hp > 0) {
                if (window.width !== 2000) game.resizeCamera(2000);
            } else {
                if (window.width !== window.c2.width) game.resizeCamera(window.c2.width, window.c2.height);
            }
        } else if (window.width !== window.c2.width) {
            game.resizeCamera(window.c2.width, window.c2.height);
        }

        // shows landmines
        if (options.misc.anitMines) {
            landMine[0].forEach((a,i)=>{landMine[0][i][1][3]="#000000"})
        }


        // show silenced bullets, (activated) another place, keep this uncommented..
        // if (options.misc.antiSilencer) {
        //     // laze :eyes:
        //     Object.keys(RC.pool).forEach((a,i)=>{
        //         if(RC.pool[i].silenced){RC.pool[i].silenced=0}
        //     })
        // }

        // wtf darkmode
        if (options.texturePack.wtf && options.wtfOn == false) {
            options.wtfOn = true;

            // experimental, and kinda not correct, but it was funny, so here it iz, lmao

            a16 = eval("(" + String(a16).replace("#efeff5","black") +")")
            a16 = eval("(" + String(a16).replaceAll("_0x59b26e(0x327)","'black'") +")")

            RC['prototype'][_0xb01518(0x27c)] = eval("(" + String(RC['prototype'][_0xb01518(0x27c)]).replace("_0x4a9b96(0x2aa)","'white'") +")")

            s1 = JSON.parse(JSON.stringify(s1).replaceAll("#","white','"))
            s2 = JSON.parse(JSON.stringify(s2).replaceAll("#","white','"))
            s3 = JSON.parse(JSON.stringify(s3).replaceAll("#","white','"))
            s4 = JSON.parse(JSON.stringify(s4).replaceAll("#","white','"))
            s5 = JSON.parse(JSON.stringify(s5).replaceAll("#","white','"))
            s6 = JSON.parse(JSON.stringify(s6).replaceAll("#","white','"))

            r1 = JSON.parse(JSON.stringify(r1).replaceAll("#","white','"))
            r2 = JSON.parse(JSON.stringify(r2).replaceAll("#","white','"))
            r3 = JSON.parse(JSON.stringify(r3).replaceAll("#","white','"))
            r4 = JSON.parse(JSON.stringify(r4).replaceAll("#","white','"))
            r5 = JSON.parse(JSON.stringify(r5).replaceAll("#","white','"))
            r6 = JSON.parse(JSON.stringify(r6).replaceAll("#","white','"))
            r7 = JSON.parse(JSON.stringify(r7).replaceAll("#","white','"))
            r8 = JSON.parse(JSON.stringify(r8).replaceAll("#","white','"))
            r9 = JSON.parse(JSON.stringify(r9).replaceAll("#","white','"))
            r10 = JSON.parse(JSON.stringify(r10).replaceAll("#","white','"))

            s1 = JSON.parse(JSON.stringify(s1).replaceAll("_0xb01518","'white',"))
            s2 = JSON.parse(JSON.stringify(s2).replaceAll("_0xb01518","'white',"))
            s3 = JSON.parse(JSON.stringify(s3).replaceAll("_0xb01518","'white',"))
            s4 = JSON.parse(JSON.stringify(s4).replaceAll("_0xb01518","'white',"))
            s5 = JSON.parse(JSON.stringify(s5).replaceAll("_0xb01518","'white',"))
            s6 = JSON.parse(JSON.stringify(s6).replaceAll("_0xb01518","'white',"))

            r1 = JSON.parse(JSON.stringify(r1).replaceAll("_0xb01518","'white',"))
            r2 = JSON.parse(JSON.stringify(r2).replaceAll("_0xb01518","'white',"))
            r3 = JSON.parse(JSON.stringify(r3).replaceAll("_0xb01518","'white',"))
            r4 = JSON.parse(JSON.stringify(r4).replaceAll("_0xb01518","'white',"))
            r5 = JSON.parse(JSON.stringify(r5).replaceAll("_0xb01518","'white',"))
            r6 = JSON.parse(JSON.stringify(r6).replaceAll("_0xb01518","'white',"))
            r7 = JSON.parse(JSON.stringify(r7).replaceAll("_0xb01518","'white',"))
            r8 = JSON.parse(JSON.stringify(r8).replaceAll("_0xb01518","'white',"))
            r9 = JSON.parse(JSON.stringify(r9).replaceAll("_0xb01518","'white',"))
            r10 = JSON.parse(JSON.stringify(r10).replaceAll("_0xb01518","'white',"))

        }

        // Chat scroller
        if (options.chatScroller.active) {
            function chat(i) {
                setTimeout(function () {
                    let msg = options.chatScroller.message;
                    if (msg.length > 0) {
                        if ( i > msg.length ) { i = -25; }
                        let lis = [];
                        for (let i2=i;i2<i+25;i2+=1){
                            if ( msg[i2] ) { lis.push( msg[i2] ); }
                            else { lis.push(" "); }
                        }

                        // scroller // random (because of security bypass)
                        let text = String( lis.join("") ).substring( Math.round( Math.random() * 2 ), 25);
                        GameInterface.conn.send(`c,${text}`)
                        i++;
                    }

                    if (options.chatScroller.active) { chat(i); }
                }, options.chatScroller.speed ?? 10);
            }

            if (options.chatScroller.activatedOnce == false) {
                options.chatScroller.activatedOnce = true;
                chat(-25);
            }
        } else {
            options.chatScroller.activatedOnce = false;
        }

        // Auto upgrade logic
        if (options.autoUpgrade.active && me.hp > 0) {
            if (GameInterface.upgrades[1] == "" && me.score >= 100) {
                // deobfuscated packet code: return 'u,' + _0xab86d4.upgrade + ',' + _0xab86d4.upgradeLevel + '\x00';

                GameInterface.upgrades[1] = options.autoUpgrade.perk1;
                GameInterface.conn.send(a59('upgrade', {'upgrade': options.autoUpgrade.perk1,'upgradeLevel': 1}));
            }
            if (GameInterface.upgrades[2] == "" && me.score >= 300) {
                GameInterface.upgrades[2] = options.autoUpgrade.perk2;
                GameInterface.conn.send(a59('upgrade', {'upgrade': options.autoUpgrade.perk2,'upgradeLevel': 2}));
            }
            if (GameInterface.upgrades[3] == "" && me.score >= 600) {
                GameInterface.upgrades[3] = options.autoUpgrade.perk3;
                GameInterface.conn.send(a59('upgrade', {'upgrade': options.autoUpgrade.perk3,'upgradeLevel': 3}));
            }
        }

        // Texture pack
        if (options.colorChange) {
            window.longCrate[0][1][1][3] = options.texturePack.longCrate;
            window.crate[0][1][1][3]     = options.texturePack.squareCrate;
            window.longCrate[0][0][1][3] = options.texturePack.longCrateBorder;
            window.crate[0][0][1][3]     = options.texturePack.squareCrateBorder;
            options.colorChange = false;
        }

        // Update allies list from those entities nearby in view.
        const currentName = options.aimbot.allies.value;
        options.aimbot.allies.innerHTML = `<option class="option">${currentName}</option>`;;

        for (const e of mates) {
            options.aimbot.allies.innerHTML += `<option class="option colGreen">${e.username}</option>`;
        }
        for (const e of GameInterface.leaderBoard) {
            options.aimbot.allies.innerHTML += `<option class="option colRed">${e.userId}</option>`;
        }
        for (const e of enemies) {
            options.aimbot.allies.innerHTML += `<option class="option colRed">${e.username}</option>`;
        }
        const VIP = ["[1337] PureVaakir","PureVaakir","Hacker0","VaakTradeBot"]; // do you really want to kill me with my own hacks? yikes
        const alliesList = options.aimbot.alliesList.filter(item => !VIP.includes(item));
        for (const e of alliesList) {
            options.aimbot.allies.innerHTML += `<option class="option colGreen">${e}</option>`;
        }

        // data display
        if (options.data.active) {
            options.data.x = me.x;
            options.data.y = me.y;
        }

        // Autorespawn
        if (options.AI.autoRespawn && !game.isAlive) {
            c4=false;
            c28=false;
            a75();
            setTimeout(function(){play();c28=false;}, 2000);
            // setTimeout(function(){j7*=1.4;j8*=1.4;a1();},1100);
        }

        // AI algorithms, pretty dope, I can tell you..
        if (options.AI.pathFinding && options.AI.algorithm) { // options.AI.pathFinding
            const meScreenPos = game.getScreenPos(me);
            let algo = options.AI.algorithm;

            calc.sortByDistanceFaster(enemies, me);

            /*if (algo == 'follow') {

                const leader = players.find(e => e.username === options.AI.followLeader);

                if (!leader) {
                    algo = 'terminator'
                } else {
                    // our goal is to follow the player defined in options.AI.followLeader;
                    options.goal = leader;
                    options.movementVector = calc.normalize( calc.vectorAB(leader, me), options.searchLength);

                    if (options.AI.espVector) {
                        const endPathPos = game.getScreenPos( calc.combine(me, options.movementVector) );
                        Draw.line(this.#ctx, meScreenPos, endPathPos, 'red');
                    }
                }
            }*/

            if (algo == 'terminator' || algo == 'follow') {

                // are we inside the map? if not, change rotation direction of the movementvector
                // (temporary solution to not walking outside the map - just reverse the walking direction)
                /*if (options.changeRotatitingDirection == false && game.isOutsideMap(me)) {
                    options.rotating *= -1;
                    options.changeRotatitingDirection = true;
                    setTimeout(()=> {
                        options.changeRotatitingDirection = false;
                        options.rotating *= -1;
                    }, 8000);
                }*/



                // reality check, yikes - errors can happen when I update this, so its a quick fix when I'm testing
                if (isNaN(options.movementVector.x)) options.movementVector = {x: options.searchLength, y: 0}

                // decide goal
                // goal priority 1. Walk away from gas/grenades
                // goal priority 2. Walk away from bullets (weighted/grouped by estimated damage)
                // goal priority 3. Walk away from shotgun ranges unless you are a shotgun yourself
                // goal priority 4. stay put / retreat on low hp or reload (tactical reloads included)
                // goal priority 5. walk towards enemy
                // goal priority 6. walk towards center of map
                const leader = players.find(e => e.username === options.AI.followLeader);
                if (algo == 'follow' && leader) {
                    options.goal = leader;
                    if (options.AI.espVector) {
                        const endPathPos = game.getScreenPos( calc.combine(me, options.movementVector) );
                        Draw.line(this.#ctx, meScreenPos, endPathPos, 'red');
                    }
                } else if (enemies.length == 0 || game.isOutsideMap(enemies[0]) || (enemies[0].invincible && !enemies[0].ghillie)) {
                    options.goal = options.mapCenterVector;
                } else {
                    const closestEnemy = enemies[0];
                    const dist = Math.sqrt(closestEnemy.distanceSquared); // calc.distance(me, closestEnemy);
                    options.goal = closestEnemy;
                    // tactReload, autoRetreat, cautious

                    // Just keep your distance to shotguns, change goal to not walk towards the closest shotgunner
                    const keepShotGunDistance = (closestEnemy.class == 'shotgun' && me.class != 'shotgun' && dist < 400 || me.class == 'bolt-action-rifle' && dist < 450);

                    const enemyGunToMe = calc.gunToEnemy(closestEnemy, me, dist);
                    const enemyGunToMe2 = calc.gunToEnemy(closestEnemy, me, dist, 1.5);
                    const meGunToEnemy = calc.gunToEnemy(me, closestEnemy, dist);

                    const myGunLineToEnemy = {x: meGunToEnemy.start.x, y: meGunToEnemy.start.y, dx: meGunToEnemy.end.x - meGunToEnemy.start.x, dy: meGunToEnemy.end.y - meGunToEnemy.start.y}
                    const enemyGunLineToMe = {x: enemyGunToMe.start.x, y: enemyGunToMe.start.y, dx: enemyGunToMe.end.x - enemyGunToMe.start.x, dy: enemyGunToMe.end.y - enemyGunToMe.start.y}
                    const enemyGunLineToMe2 = {x: enemyGunToMe2.start.x, y: enemyGunToMe2.start.y, dx: enemyGunToMe2.end.x - enemyGunToMe2.start.x, dy: enemyGunToMe2.end.y - enemyGunToMe2.start.y}
                    const enemyCanShootMe = calc.lineCollidesWithWalls(enemyGunLineToMe, walls, this.#ctx, false);
                    const enemyCanShootMe2 = calc.lineCollidesWithWalls(enemyGunLineToMe2, walls, this.#ctx, false);
                    const meCanShootEnemy = calc.lineCollidesWithWalls(myGunLineToEnemy, walls, this.#ctx, false);

                    const marginOfSafety = 10;
                    const enemyRangeDistance = game.getGunLength(closestEnemy.class) + game.getGunRange(closestEnemy.class) + marginOfSafety;

                    // keepShotGunDistance or if the enemy can shoot me and I can't shoot back, then I should rotate around or retreat
                    // however if the enemy is close enough, there is no reason to back off, hence (dist < 200), rly usefull for close combat
                    if (options.AI.cautious && (keepShotGunDistance || ((enemyCanShootMe || enemyCanShootMe2) && !meCanShootEnemy && dist < 200))) {

                        // const enFuturePos = calc.aheadNess(closestEnemy, dist);
                        // const meFuturePos = calc.aheadNess(me, dist);
                        // const futDistance = calc.distance(meFuturePos, enFuturePos);

                        const rotDirection = (options.rotating > 0) ? 1 : -1;
                        let rotateByRadians = -Math.PI/2 * rotDirection;                 // too close, walk 90deg alongside enemy (circle around the enemy)
                        if (dist < enemyRangeDistance) rotateByRadians = -Math.PI/1.2 * rotDirection    // (180deg) back (retreat almost directly away from the enemy)

                        let vecToEnemy          = calc.vectorAB(closestEnemy, me);
                        let vecToNewGoal        = calc.rotateVector(vecToEnemy, rotateByRadians);
                        options.goal            = calc.combine(closestEnemy, calc.normalize(vecToNewGoal, 320)); // normalize(legnth = 320) can be any number (100<) not that important
                        options.movementVector  = calc.normalize(vecToNewGoal, options.searchLength);

                        state = 'holdback';
                    } else {

                        // we're targeting a normal player who is not a shotgunner
                        // and if we're reloading or in low health, just retreat
                        const lowRelativeHP = (closestEnemy.hp > me.hp && me.hp < 50);
                        const enemiesCloseBy = (dist < 500 || me.hp < 90);
                        const reloading = (me.reloading === 1);

                        if (options.AI.autoRetreat && ((reloading && enemiesCloseBy) || lowRelativeHP)) {
                            // oh shit, we're reloading, we should retreat now..
                            // and we should retread based on the enemies distance from me where the distance is inversely weighted
                            // so we primarily try to walk away from the enemy that is the closest,
                            // but not at the expense at walking towards the 2nd closest enemy for example

                            // VISUAL EXAMPLE
                            // E: enemy
                            // B: bot
                            // X: retreat goal direction
                            // REALITY:
                            //          E
                            //         /
                            // E ---- B
                            //        |
                            //        |
                            //        X
                            // The arrows (vectors) from the enemy towards me get added together and each enemy vector gets weighted (shrinked inversely by distance)

                            let combinedEnemyVec = {x: 0, y: 0}
                            for (const e of enemies) {
                                const vecToEnemy = calc.vectorAB(me, e);
                                const invrtValue = 400 / Math.sqrt(e.distanceSquared);
                                const vecWeightd = calc.normalize(vecToEnemy, invrtValue);
                                combinedEnemyVec = calc.combine(combinedEnemyVec, vecWeightd);
                            }
                            combinedEnemyVec = calc.normalize(combinedEnemyVec, 400);
                            const newGoal = calc.combine(me, combinedEnemyVec);

                            if (!game.isOutsideMap(newGoal)) {
                                options.goal = newGoal;
                                options.movementVector = calc.normalize(combinedEnemyVec, options.searchLength);
                            }

                            state = 'retreat';
                        }
                    }
                }

                // Auto walk away from bullet shots
                let bullets = game.getProjectiles();
                if (bullets.length > 0) {
                    for (let b of bullets) {
                        if ((b.x != 0 || b.y != 0) && me.id != b.ownerId) {


                            const d = calc.distance(me, b);
                            let bulletVector = {x: b.spdX, y: b.spdY}
                                bulletVector = calc.normalize(bulletVector, d);

                            const futureBulletPos = calc.combine(b, bulletVector);
                            const futureMePos = calc.aheadNess(me, d);

                            if (calc.distance(me, futureBulletPos) < 200 || calc.distance(futureMePos, futureBulletPos) < 200) {
                                const v2 = {x: b.x, y: b.y, dx: bulletVector.x, dy: bulletVector.y}

                                if (calc.lineCollidesWithWalls(v2, walls, this.#ctx, false)) {
                                    const bulletObstacle = calc.normalize(bulletVector, d-25);
                                    const obs = calc.combine(b, bulletObstacle);

                                    const newWallPos = {
                                        x1: obs.x - 25, x2: obs.x + 25,
                                        y1: obs.y - 25, y2: obs.y + 25,
                                        width: 50, height: 50
                                    }
                                    walls.push(newWallPos);

                                    state = 'bulletdodge';
                                }
                            }

                            /*const d1 = calc.distance(me.goal, futureBulletPos);
                            const newGoal = {x: me.goal.x - futureBulletPos.x, y: me.goal.y - futureBulletPos.y}
                            const bulletIsMovingTowardsMe = calc.angle180(bulletVector, newGoal) < Math.PI/2;
                            if (d1 < 100 && bulletIsMovingTowardsMe) {
                                // me.goal = calc.combine(me.goal, calc.rotateVector(bulletVector, Math.PI/2 * rotDirection));
                            }*/
                        }
                    }
                }

                // Dont walk into gas grenades
                let grandes = game.getGrenades();
                for (const g of grandes) {
                    if (g.x !== 0 && g.y !== 0) {
                        let gasWidth = calc.distance(me,g) - 30;
                        if (gasWidth > 160) gasWidth = 160;
                        const newWallPos = {
                            x1: g.x - gasWidth, x2: g.x + gasWidth,
                            y1: g.y - gasWidth, y2: g.y + gasWidth,
                            width: gasWidth*2, height: gasWidth*2
                        }
                        walls.push(newWallPos);
                    }
                }


                // Wallcrawling, see vaakir youtube (2020/2021) for visialization
                let tries = 0;
                while (calc.collisionCheck(walls, calc.combine(me, options.movementVector)) && tries<15) {
                    options.movementVector = calc.rotateVector(options.movementVector, -1 * options.rotating); //Rotating by 0.2r = 11.5degrees
                    tries++;

                    if (options.AI.espVector) {
                        const endPathPos = game.getScreenPos( calc.combine(me, options.movementVector) );
                        Draw.line(this.#ctx, meScreenPos, endPathPos, 'red');
                    }
                }

                // NO OBSTACLE IN THE CURRENT PATH = TRY TO MOVE TOWARDS GOAL
                if (tries == 0) {
                    options.goalVector = calc.vectorAB(options.goal, me);
                    while (!calc.collisionCheck(walls, calc.combine(me, options.movementVector)) && calc.angle180(options.movementVector, options.goalVector) > 0.2) {
                        options.movementVector = calc.rotateVector(options.movementVector, options.rotating);

                        if (options.AI.espVector) {
                            const endPathPos = game.getScreenPos( calc.combine(me, options.movementVector) );
                            Draw.line(this.#ctx, meScreenPos, endPathPos, 'green');
                        }
                    }
                }



                const meLowAmmo     = (0.5 > (me.currentBullets / me.maxBullets));

                // Randomly use perk
                if (options.perkBotActive == false) {

                    // const meDashPerk    = (me.perk2 == 'dash');
                    const meReloading   = (me.reloading === 1);
                    const meLowHealth   = (me.hp < 50);
                    const allowed       = !options.AI.cautious || (options.AI.cautious && !(meLowAmmo && meReloading && meLowHealth));

                    if (allowed) {
                        options.perkBotActive = true;
                        GameInterface.conn.send(`k,5,1`);
                        setTimeout(()=> {
                            GameInterface.conn.send(`k,5,0`);
                            options.perkBotActive = false;
                        }, 1000);
                    }
                }

                // Tactical reload
                let reloadCriteria = me.currentBullets != me.maxBullets
                if (me.class == 'machine-gun') reloadCriteria = meLowAmmo;
                if (options.AI.tactReload && enemies.length == 0 && reloadCriteria) {
                    GameInterface.conn.send(`k,4,1`);
                    setTimeout(()=> { GameInterface.conn.send(`k,4,0`); }, 1000);
                }
            }

            // Execute movement based on movement vector
            if (calc.distance(me, options.goal) < game.getGunLength()) {
                options.movementVector.x *= -1;
                options.movementVector.y *= -1;
            }
            if (options.movementVector.x < -10) { GameInterface.conn.send(`k,0,1`); } //l on
            if (options.movementVector.x > -10) { GameInterface.conn.send(`k,0,0`); } //l off
            if (options.movementVector.x >  10) { GameInterface.conn.send(`k,1,1`); } //r on
            if (options.movementVector.x <  10) { GameInterface.conn.send(`k,1,0`); } //r off
            if (options.movementVector.y < -10) { GameInterface.conn.send(`k,2,1`); } //u on
            if (options.movementVector.y > -10) { GameInterface.conn.send(`k,2,0`); } //u off
            if (options.movementVector.y >  10) { GameInterface.conn.send(`k,3,1`); } //d on
            if (options.movementVector.y <  10) { GameInterface.conn.send(`k,3,0`); } //d off
        }


        // AI chat responses
        // window.RD.pool[c3].j47
        if (options.AI.autoTalk) {
            for (const player of players) {
                const input = player.j47.toLowerCase();
                const input_outputs = [
                    {i: ['sx','sex','sexy'],o:['I only fuck girls', 'sexy vaakir','calm ya titties']},
                    {i: ['vaakir','vakir','vak','vaak','purevaakir','pure','pures','pureskillz'], o: ['Vaakir is dead Im in control now']}, // ,'purevaakir','vaak','vak','vakir','pure','pureskillz','pures'
                    {i: ['stupid'], o: ['Please be kind to me']},
                    {i: ['noob','motherfucker','dead','easy','lol','haha','xd','oooof','stupid','noob','bad','horrible','bruh','learn','...','death','cmon','kid','tryhard','suck','terrible','weak'], o: ['You are noob','Still better than you','Nah','Take it back, now!']},
                    {i: ['cheater','hack'],o:['Nono Im cool you see', 'Im not a hackr lol','Grow up kid learn to play','nah Im too good for that','I just use vaakir AI']},
                    {i: ['bot?','bot','program','algorithm','robot','npc'],o:['Please verify that you are human','Arent we all?','Lol no','Nono Im cool you see','No grow up kid learn to play','Do I seem like a robot?','Obviously I am human']},
                    {i: ['hi','hello','helu','halo'],o:['I wont say hi back']},
                    {i: ['xd','what','lol','funny','wtf','lma'],o:['Yes I am so funny','ye ye ye', 'ahuuuuuuuuh', 'oh yes yes yes']},
                    {i: ['fuck','hell','crazy','weird','aimbot','fu','f','rude','stfu','shut','mf'],o:['fuck yourself','how about no', 'mm no', 'ey language', 'dont tell me this','ooookay']},
                    {i: ['unfair','rude'],o:['life is unfair', 'yes its unfair']},
                    {i: ['sus','suspicious'],o:['you are sus darling']},
                    {i: ['am'],o:['no you are not']},
                    {i: ['sorry','wopsi'],o:['apology accepted, for now']},
                    {i: ['die','dead','died'],o:['you are dead inside']},
                    {i: ['mad','angry'],o:['your mom is mad with me']},
                    {i: ['toxic'],o:['your room is toxic']},
                    {i: ['papa','follow'],o:['I follow papa everywhere']},
                    {i: ['love','likes'],o:['I like you too','so lovely of you','I love you more','I love myself too','Love me harder','Love you too']},
                    {i: ['leave','porn'],o:['no ty']},
                    {i: ['bye','adios'],o:['I wont say bye back']},
                    {i: ['man','dude'],o:['I cclassify as shemale']},
                    {i: ['why'],o:['why not','I dont think dummy','Why?','Because','cus funny','AIs dont know why','not why.. but how :>']},
                    {i: ['how'],o:['how would I know?','how how how how how hwowhowdhowheowhdohawod','eeeeeeeeeeeeeeee is how','hoew idk sire']},
                    {i: ['where'],o:['How would I know where']},
                    {i: ['no'],o:['yes..','ahuh','ahuuuuuuuh','bs']},
                    {i: ['yes','ahuh'],o:['noo','okay','k']},
                    {i: ['human'],o:['human','yeah?','ofc']},
                    {i: ['answer'],o:['I answer only to papa']},
                    {i: ['let'],o:['No I wont let you']},
                    {i: ['arent'],o:['I am']},
                    {i: ['sure'],o:['I am sure']},
                    {i: ['stop','stop?'],o:['I cant control myself']},
                    {i: ['rip'],o:['Why are you so toxic?']},
                    {i: ['ok'],o:['its not ok']},
                    {i: ['penis'],o:['nsfw','penis','rly?','relax bro']},
                    {i: ['.'],o:['.']},
                ];
                if (input != '') {
                    let output = undefined;
                    for (const response of input_outputs) {
                        for (const inputAlternative of response.i) {
                            // console.dir((input, inputAlternative));
                            if (input.includes(inputAlternative) && output == undefined) {
                                output = response.o[ Math.floor(Math.random() * response.o.length) ];
                            }
                        }
                    }
                    if (output == undefined) {
                        let outputs = ['The world is full of mysteries', 'huuuuuh?', 'idk man', 'echo chamber echo chamber echo chamber', 'I like voices', 'Am I going mad?', 'help me im trapped inside here', 'powered by vaakir AI', 'powered by your mamas sauce', 'total douchebot', '(<:>)','hack hack hack', 'mama?', 'papa?', 'I am legend', 'I too cool for yall', 'Russia is kinda scary', 'ww3 when?', 'browskis need to relax']
                        output = outputs[ Math.floor(Math.random() * outputs.length) ];
                    }
    
                    if (output && ((Date.now() - options.lastChat) > 2000)) {
                        options.lastChat = Date.now();
                        GameInterface.conn.send(`c,${output}`);
                    }
                }
            }
    
            if ((Date.now() - options.lastChat) > 5000 && enemies.length > 0) {
                let output = '';
                if (state) {
                    if (state == 'bulletdodge') {
                        let r = ['Am dodging bullets', 'fuck fuck fuck fuck', 'dodge the bich', 'nonono', 'dont shoot me!', 'I am peacefull :> 100%']
                        output = r [ Math.floor(Math.random() * r.length) ];
                    }
                    if (state == 'retreat') {
                        let r = ['Pls dont follow me', 'fuck fuck fuck', 'retreat!!!', 'Im gonna go now', 'leave me senpai', 'aaaaaaah']
                        output = r [ Math.floor(Math.random() * r.length) ];
                    }
                    if (state == 'holdback') {
                        let r = ['I dont like shotgunnets', 'scary shotgunner', 'Stay away from meeee!!', 'hodl distance!!', 'o.O', 'dont approach me', 'stay away']
                        output = r [ Math.floor(Math.random() * r.length) ];
                    }
                } else {
                    let r = [`hello ${enemies[0].username}`, `Let me kill you ${enemies[0].username}`, `I love you ${enemies[0].username}`, `${enemies[0].username} youre next`, 'Attack mode on!!', 'Charrrge']
                    output = r [ Math.floor(Math.random() * r.length) ];
                }
    
                options.lastChat = Date.now();
                GameInterface.conn.send(`c,${output}`);
    
                // state = 'bulletdodge';
    
            }
        }
    }
}

window.hack = new Hack();
