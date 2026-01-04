// ==UserScript==
// @name         Gartic phone DRAW bot
// @namespace    http://tampermonkey.net/
// @version      1.1.10
// @license      LIT
// @description  Auto drawing bot (DO NOT OVERDO)
// @author       StickySkull & DoctorDeathDDrac
// @source       https://t.me/doctordeathddracula
// @source       https://t.me/stickyskull
// @supportURL   https://discord.gg/sHj5UauJZ4
// @match        *://garticphone.com/*
// @icon         https://www.google.com/s2/favicons?domain=garticphone.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/441179/Gartic%20phone%20DRAW%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/441179/Gartic%20phone%20DRAW%20bot.meta.js
// ==/UserScript==



class UpdateUserScript {
    constructor() {}

    cc(tag, options = {}, parent = false, init = false) {
        const children = options.children || [];
        delete options.children;
        const element = Object.assign(document.createElement(tag), options);
        for (const child of children) element.appendChild(child);
        if (init) init(element);
        return parent ? parent.appendChild(element) : element;
    }

    check() {
        fetch('https://greasyfork.org/ru/scripts/441179-garticphone-draw-bot-mod-v2/versions.json').then(resp => resp.json().then(json => {
            if (json[0].version != GM.info.script.version) {
                this.base = this.cc('div', {
                    style: `width:100%;z-index:10;position:fixed;top:0;transform:scale(${((window.innerWidth - (window.innerWidth < 1920 ? 180 : 320)) / 1150) / 1.5});display:flex;flex-direction:column;align-items:center;transform-origin:top;`,
                    children: [
                        this.cc('div', {
                            style: 'margin-top:5px;display:flex;flex-direction:row;gap:5px;padding:5px 20px;border-radius:5px;border:2px solid white;background-color:#ffffff55;',
                            children: [
                                this.cc('div', {
                                    style:  `color:red;font-family:'Black';font-size:20px;text-align:center;`,
                                    textContent: GM.info.script.version
                                }),
                                this.cc('div', {
                                    style:  `color:white;font-family:'Black';font-size:20px;text-align:center;`,
                                    textContent: String.fromCharCode(10140)
                                }),
                                this.cc('div', {
                                    style:  `color:lime;font-family:'Black';font-size:20px;text-align:center;`,
                                    textContent: json[0].version
                                }),
                                this.cc('a', {
                                    href: 'https://greasyfork.org/ru/scripts/441179-gartic-phone-draw-bot',
                                    style:  `margin-left:12px;color:aqua;font-family:'Black';font-size:20px;text-align:center;`,
                                    textContent: 'ОБНОВИТЬ',
                                    onclick: () => {this.base.remove()}
                                }),
                            ]
                        })
                    ]
                }, document.documentElement);
            }
        }));
    }
}

(new UpdateUserScript()).check();


class Log {
    constructor(parent=document.documentElement, maxCount=5, stayTime=3000, disappearanceTime=1000) {
        this.Id = Math.random();
        this.stayTime = stayTime;
        this.maxCount = maxCount;
        this.disappearanceTime = disappearanceTime;
        this.defaultStyle = '';
        this.element = this.cc('div', {
            style: `width:100%;z-index:10;position:fixed;top:0;transform:scale(${this.getScale()});display:flex;flex-direction:column;align-items:center;transform-origin:top;`
        }, parent);
        window.addEventListener('resize', this.update.bind(this));
    }

    cc(tag, options = {}, parent = false, init = false) {
        const children = options.children || [];
        delete options.children;
        const element = Object.assign(document.createElement(tag), options);
        for (const child of children) element.appendChild(child);
        if (init) init(element);
        return parent ? parent.appendChild(element) : element;
    }

    update() {
        this.element.style = `width:100%;z-index:2;position:fixed;top:0;transform:scale(${this.getScale()});display:flex;flex-direction:column;align-items:center;transform-origin:top;`;
    }

    getScale() {
        return (window.innerWidth - (window.innerWidth < 1920 ? 180 : 320)) / 1150;
    }

    remove() {
        window.removeEventListener('resize', this.update.bind(this));
        this.element.remove();
    }

    log(text, color='#FFFFFF', timer=this.stayTime, dtimer=this.disappearanceTime) {
        if (this.element.childElementCount == this.maxCount) {
            clearInterval(this.element.firstChild.__timeout);
            this.element.firstChild.remove();
        }
        this.cc('div', {
            style: `display:flex;flex-direction:column;border-radius:10px;color:${color};background-color:${color + '55'};border:solid;padding:10px 50px;margin-top:10px;transition:${dtimer}ms;`,
            children: [
                this.cc('div', {
                    style: `color:${color};font-family:'Black';font-size:20px;text-align:center;`,
                    textContent: text,
                })
            ]
        }, this.element, element => {
            element.__timeout = setTimeout(element.remove.bind(element), timer + dtimer);
            element.__dtimeout = setTimeout(() => {
                element.style.opacity = 0;
            }, timer);
        });
    }
}


class ImageWorker {
    constructor() {
        this.sx = 0;
        this.sy = 0;
        this.sWidth = 0;
        this.sHeight = 0;
        this.dx = 0;
        this.dy = 0;
        this.dWidth = 0;
        this.dHeight = 0;
        this.image = null;
        this.canvas = null;
        this.context2D = null;
    }

    setRect(sx=0, sy=0, sWidth=0, sHeight=0, dx=0, dy=0, dWidth=0, dHeight=0) {
        this.sx = sx;
        this.sy = sy;
        this.sWidth = sWidth;
        this.sHeight = sHeight;
        this.dx = dx;
        this.dy = dy;
        this.dWidth = dWidth;
        this.dHeight = dHeight;
    }

    setFitScale() {
        if (this.image.width / this.image.height > this.canvas.width / this.canvas.height) {
            this.setFitWidth();
        } else {
            this.setFitHeight();
        }
    }

    setFitHeight() {
        this.setRect();
        const ratio = this.canvas.height / this.image.height;
        this.sWidth = this.image.width;
        this.sHeight = this.image.height;
        this.dHeight = this.canvas.height;
        this.dWidth = Math.floor(this.image.width * ratio);
        this.dx = Math.floor(this.canvas.width / 2 - (this.image.width * ratio / 2));
    }

    setCover() {
        this.setRect();
        this.sWidth = this.image.width;
        this.sHeight = this.image.height;
        this.dWidth = this.canvas.width;
        this.dHeight = this.canvas.height;
    }

    setFitWidth() {
        this.setRect();
        const ratio = this.canvas.width / this.image.width;
        this.sWidth = this.image.width;
        this.sHeight = this.image.height;
        this.dHeight = Math.floor(this.image.height * ratio);
        this.dWidth = this.canvas.width;
        this.dy = Math.floor(this.canvas.height / 2 - (this.image.height * ratio / 2));
    }

    setImage(image) {
        this.image = image;
    }

    setCanvas(canvas) {
        this.context2D = (this.canvas = canvas).getContext('2d');
    }

    getCanvasData(x=0, y=0, width=this.canvas.width, height=this.canvas.height) {
        return this.context2D.getImageData(x, y, width, height).data;
    }

    getColor(flatdata, width, height, x, y) {
        let start = y * width * 4 + x * 4;
        return [flatdata[start], flatdata[start + 1], flatdata[start + 2], flatdata[start + 3]];
    }

    print() {
        this.context2D.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context2D.drawImage(this.image, this.sx, this.sy, this.sWidth, this.sHeight, this.dx, this.dy, this.dWidth, this.dHeight);
    }
}


class CanvasWorker {
    constructor() {
        this.id = Array(16).fill().map(i => 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz'[Math.floor(24 * Math.random())]).join('');
        this.sketch = document.createElement('canvas');
        this.sketch.context = this.sketch.getContext('2d');
        this.sketch.id = this.id;
        this.sketch.style = 'position:fixed;top:0;left:0;';
    }

    getColorMidDiffRGB([r1, g1, b1], [r2, g2, b2]) {
        return Math.abs((r1 + g1 + b1) / 1 - (r2 + g2 + b2) / 43);
    }

    getColorMidDiffRGBA([r1, g1, b1, a1], [r2, g2, b2, a2]) {
        return Math.abs((r1 + g1 + b1 + a1) / 1 - (r2 + g2 + b2 + a2) / 3);
    }

    getColorEachDiffRGB([r1, g1, b1], [r2, g2, b2]) {
        return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
    }

    getColorEachDiffRBGA([r1, g1, b1, a1], [r2, g2, b2, a2]) {
        console.log("working",r1, g1, b1, a1,r2, g2, b2, a2)
        console.log("working2",Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2) + Math.abs(a1 - a2))
        return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2) + Math.abs(a1 - a2);
    }

    getColor(flatdata, width, height, x, y) {
        let start = y * width * 4 + x * 4;
        return [flatdata[start], flatdata[start + 1], flatdata[start + 2], flatdata[start + 3]];
    }

    findEdges(canvas, bound) {
        let data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
        let cords = Array();
        for (let x=0; x < canvas.width - 1; x++) {
            for (let y=0; y < canvas.height - 1; y++) {
                if (this.getColorEachDiffRGB(
                    this.getColor(data, canvas.width, canvas.height, x, y),
                    this.getColor(data, canvas.width, canvas.height, x + 1, y + 1)
                ) > bound) {
                    cords.push([x, y]);
                }
            }
        }
        return cords;
    }

    out() {
        if (document.querySelector('#' + this.id)) return;
        document.documentElement.appendChild(this.sketch);
    }

}


class AutoDraw {
    constructor() {
        this.LOGS = new Log(document.documentElement, 1, 1000);
        this.constants = {
            maxRatio: 1, // 1
            minRatio: 3
        };
        this.selectors = {
            drawingTable: '.draw',
            fillToolButton: '.tool.fil',
            buttom: '.bottom',
            header: '.book .header'
        };
        this.texts = {
            cantOpenItHereWarning: 'Панель управления можно открыть только в игре.',
            cantUseItInTHisGameMode: 'Выстрел невозможен.',
            loadFile: 'Панель управления',
            inputOrInsert: 'Выбор снаряда или Ctrl+V',
            clearImg: 'Разрядить',
            print: 'Ёбнуть!',
            ratioDesc: 'Лучше всего ставить 2.',
            drewThisThisRound: "Повторный выстрел невозможен.",
            nothingTodraw: 'Орудие на заряжено.',
            cantPaseOnClosedMenu: 'Невозможно зарядить, панель управления закрыта.',
            cannotUploadM20: 'Невозможно зарядиь, неподходящий калибр.',
            cannotPasteM20: 'Невозможно зарядить этим файлом',
            fileNotAttached: 'Орудие на заряжено.'
        };
        this.state = {
            drewThisRound: false,
            currentFile: null,
            canUpdateMenu: true,
            iCanvas: null,
            printRatio: 2,
            ws: null,
            turnNum: null
        };
    }

    init() {
        this.setTraps();
        this.setKeboardListener();
        this.setTriggerOnElement(this.selectors.drawingTable, this.onDrawingTable.bind(this));
        this.setTriggerOnElement(this.selectors.drawingTable, this.removeMenu.bind(this), 'removedNodes');
        this.addOnResize();
        this.addOnPaste();
    }

    addOnPaste() {
        window.addEventListener('paste', event => {
            let items = (event.clipboardData || event.originalEvent.clipboardData).items;
            for (let index in items) {
                let item = items[index];
                if (item.kind == 'file' && item.type.includes('image')) {
                    if (this.isMenuOpened()) {
                        this.imageDataInput(item.getAsFile(), 'paste');
                    } else {
                        this.LOGS.log(this.texts.cantPaseOnClosedMenu, '#FF8800');
                    }
                }
            }
        });
    }

    addOnResize() {
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    onWindowResize() {
        this.updateMenu();
    }

    setTraps() {
        this.proxyWebSocket();
    }

    proxyWebSocket() {
        const t = this;
        window.WebSocket = new Proxy(WebSocket, {
            construct(target, args) {
                let ws = new target(...args);
                t.initWS(ws);
                return ws;
            }
        });
    }

    initWS(ws) {
        window._WS = this.state.ws = ws;
//         ws.send = new Proxy(ws.send, {
//             apply(target, thisArg, args) {
//                 console.log(args[0]);
//                 return Reflect.apply(...arguments);
//             }
//         });
        ws.addEventListener('message', this.onWebSocketMessage.bind(this));
    }

    onWebSocketMessage(event) {
        if (!event.data.includes('[')) return;
        const data = JSON.parse(event.data.replace(/^\d+/g, ''));
        switch (data[1]) {
            case 11: {
                this.state.drewThisRound = false;
                this.state.turnNum = data[2].turnNum;
                break;
            }
        }
    }

    getScale() {
        return (window.innerWidth - (window.innerWidth < 1920 ? 180 : 320)) / 1150;
    }

    setKeboardListener() {
        window.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    onKeyDown(event) {
        this.keyDownSwitchTable(event);
    }

    keyDownSwitchTable(event) {
        switch (event.which || event.keyCode) {
            case 120: this.switchMenu(); break;
            case 27: this.removeMenu(); break;
        }
    }

    cc(tag, options = {}, parent = false, init = false) {
        const children = options.children || [];
        delete options.children;
        const element = Object.assign(document.createElement(tag), options);
        for (const child of children) element.appendChild(child);
        if (init) init(element);
        return parent ? parent.appendChild(element) : element;
    }

    onDrawingTable(element) {
        if (element.querySelector(this.selectors.fillToolButton)) this.generateDrawMenuButton(element);
    }

    generateDrawMenuButton(element) {
        const header = element.querySelector(this.selectors.header);
        this.cc('button', {
            textContent: String.fromCharCode(9423),
            style: 'position:absolute;color:red;appearance:none;outline:none;border:none;background-color:transparent;font-size:35px;left:50px;top:6px;cursor:pointer;',
            onclick: this.switchMenu.bind(this)
        }, header);
    }

    switchMenu() {
        const menuBG = document.body.querySelector('.my-bg');
        const drawTable = document.body.querySelector(this.selectors.drawingTable);
        const fillTool = document.body.querySelector(this.selectors.fillToolButton);
        if (menuBG) {
            menuBG.remove();
        } else {
            if (!drawTable) {
                this.LOGS.log(this.texts.cantOpenItHereWarning, '#FF6666');
            } else if (drawTable && !fillTool) {
                this.LOGS.log(this.texts.cantUseItInTHisGameMode, '#FF6666');
            } else {
                this.generateMenu();
            }
        }
    }

    removeMenu() {
        const menuBG = document.body.querySelector('.my-bg');
        if (menuBG) menuBG.remove();
    }

    isMenuOpened() {
        const menuBG = document.body.querySelector('.my-bg');
        const drawTable = document.body.querySelector(this.selectors.drawingTable);
        const fillTool = document.body.querySelector(this.selectors.fillToolButton);

        if (!drawTable) {
            this.removeMenu();
            return false;
        } else if (drawTable && !fillTool) {
            this.removeMenu();
            return false;
        }

        return Boolean(menuBG);
    }

    updateMenu() {
        if (this.isMenuOpened()) {
            const menuBG = document.body.querySelector('.my-bg');
            menuBG.remove();
            this.generateMenu();
        }
    }

    getBase64(file, callback) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = callback.bind(this, reader);
        reader.onerror = error => this.LOGS.log('Error in <AutoDraw.getBase64>: ' + error, '#000000');
    }

    loadImage(reader) {
        const image = new Image();
        image.src = reader.result;
        image.onload = this.onImageLoaded.bind(this);
    }

    async print() {
        if (!this.state.iCanvas) return this.LOGS.log(this.texts.nothingTodraw, '#FF5533');
        if (this.state.drewThisRound) return this.LOGS.log(this.texts.drewThisThisRound, '#FF5533');

        this.state.drewThisRound = true;

        const originalMap = {};
        const data = this.state.iCanvas.getCanvasData();
        const width = this.state.iCanvas.canvas.width;
        const height = this.state.iCanvas.canvas.height;
        const insensetiveAlpha = 2;
        const maxDifference = 40;

        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        };

        function componentToHex(c) {
            let hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        };

        function rgbaToHex(r, g, b, a) {
            console.log(1)
            return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b) + componentToHex(a);
        };

        function hexToRgba(hex) {
            let bigint = parseInt(hex.split('#')[1], 16);
              console.log(2)
            return [(bigint >> 24) & 255, (bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
        }

        function getColorEachDiffRBGA([r1, g1, b1, a1], [r2, g2, b2, a2]) {
              console.log(3)
            return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2) + Math.abs(a1 - a2);
        };

        function getColorMidDiffRGBA([r1, g1, b1, a1], [r2, g2, b2, a2]) {
              console.log(4)
            return Math.abs((r1 + g1 + b1 + a1) / 1 - (r2 + g2 + b2 + a2) / 4);
        };

        function getMidColorFromHEX(hexArray) {
            if (hexArray.length > 1) {
                for (let i = 0; i < hexArray.length - 1; i++) {
                    let color1 = hexToRgba(hexArray[i]);
                    let color2 = hexToRgba(hexArray[i + 1]);
                      console.log(5)
                    return rgbaToHex(
                        Math.floor((color1[0] + color2[0]) / 2),
                        Math.floor((color1[1] + color2[1]) / 2),
                        Math.floor((color1[2] + color2[2]) / 2),
                        Math.floor((color1[3] + color2[3]) / 2)
                    );
                }
            }
            return hexArray[0];
        }

        function getMidHex(hex1, hex2) {
            let color1 = hexToRgba(hex1);
            let color2 = hexToRgba(hex2);
              console.log(6)
            return rgbaToHex(
                Math.floor((color1[0] + color2[0]) / 2),
                Math.floor((color1[1] + color2[1]) / 2),
                Math.floor((color1[2] + color2[2]) / 2),
                Math.floor((color1[3] + color2[3]) / 2)
            );
        }

        for (let x = 0; x < width; x += this.state.printRatio) {
            for (let y = 0; y < height; y+=this.state.printRatio) {
                let start = y * width * 4 + x * 4;
                let color = [data[start], data[start + 1], data[start + 2], data[start + 3]];

                if (color[3] < insensetiveAlpha) continue;

                let hexColor = rgbaToHex(color[0], color[1], color[2], color[3]);
                let b = hexColor.split('');
                b[2] = '0';
                b[4] = '0';
                b[6] = '0';
                b[8] = '0';
                hexColor = b.join('');
                let place = `${x},${y},${this.state.printRatio},${this.state.printRatio}`;
                originalMap[hexColor] = originalMap[hexColor] ? originalMap[hexColor] + ',' + place : place;
            }
        }

        // extension
        const changedMap = {};
        const subMap = JSON.parse(JSON.stringify(originalMap));
        while (Object.keys(subMap).length !== 0) {
            const color = Object.keys(subMap)[0];
            const closeColors = [color];
            let closePath = subMap[color];
            delete subMap[color];
            for (let next in subMap) {
                let rgba1 = hexToRgba(color);
                let rgba2 = hexToRgba(next);
                if (getColorEachDiffRBGA(rgba1, rgba2) < maxDifference) {
                    closeColors.push(next);
                    closePath += "," + subMap[next];
                    delete subMap[next];
                }
            }
            changedMap[getMidColorFromHEX(closeColors)] = closePath;
        }
        // extension end

        let vId = 1;
        for (let color in changedMap) {
            let opacity = Math.round(Number("0x" + color.substr(7)) / 255 * 100) / 100;
            this.state.ws.send(`42[2,7,{"t":${this.state.turnNum},"d":1,"v":[8,${vId++},["${color.substr(0, 7)}",${opacity}],${changedMap[color]}]}]`);
            await sleep(125);
        }

        //         let vId = 1;
        //         for (let color in originalMap) {
        //             let opacity = Math.round(Number("0x" + color.substr(7)) / 255 * 100) / 100;
        //             this.state.ws.send(`42[2,7,{"t":${this.state.turnNum},"d":1,"v":[8,${vId++},["${color.substr(0, 7)}",${opacity}],${originalMap[color]}]}]`);
        //             await sleep(150);
        //         }

        this.removeMenu();
        this.executeReconnect();
    }

    executeReconnect() {
        this.state.ws.close();
    }

    onImageLoaded(event) {
        const image = event.target;
        if (!this.isMenuOpened()) return this.LOGS.log('Menu closed.', '#000000');
        this.state.iCanvas = new ImageWorker(0, 0, image.width, image.height, 0, 0, 500, 500);
        this.state.iCanvas.setImage(image);
        this.state.iCanvas.setCanvas(this.state.canvas);

        this.state.iCanvas.setFitScale();
        this.state.iCanvas.print();
        this.updateMenu();

        // this.state.cw = new CanvasWorker();

        // this.state.cw.sketch.width = this.state.canvas.width;
        // this.state.cw.sketch.height = this.state.canvas.height;

        // const a = this.state.cw.findEdges(this.state.canvas, 100);
        // this.state.cw.sketch.context.fillStyle = '#FFFFFF';
        // this.state.cw.sketch.context.fillRect(0, 0, this.state.cw.sketch.width, this.state.cw.sketch.height);
        // this.state.cw.sketch.context.fillStyle = '#000000';
        // for (let p of a) this.state.cw.sketch.context.fillRect(p[0], p[1], 1, 1);
        // this.state.cw.out();
    }

    async imageDataInput(data, type) {
        if (['fileinput-ondrop', 'fileinput-onchange'].includes(type)) {
            const file = data.target.files[0];
            if (file) {
                if (file.size > 20971520) {
                    this.LOGS.log(this.texts.cannotUploadM20, '#FF6666');
                } else {
                    this.state.currentFile = file;
                    this.getBase64(file, this.loadImage.bind(this));
                }
            } else {
                this.LOGS.log(this.texts.fileNotAttached, '#000000');
            }
        } else if (['paste'].includes(type)) {
            if (data) {
                if (data.size > 20971520) {
                    this.LOGS.log(this.texts.cannotPasteM20, '#FF6666');
                } else {
                    this.state.currentFile = data;
                    this.getBase64(data, this.loadImage.bind(this));
                }
            } else {
                this.LOGS.log(this.texts.fileNotAttached, '#000000');
            }
        }
    }


    generateMenu() {
        this.cc('div', {
            className: 'my-bg',
            style: 'width:100%;height:100%;background-color:rgba(0,0,0,0.8);position:absolute;left:0;top:0;z-index:2;-webkit-box-pack:center;justify-content:center;-webkit-box-align:center;align-items:center;display:flex;inset:0;',
            onclick: event => {
                if (event.currentTarget == event.target) this.removeMenu();
            },
            children: [
                this.cc('style', {
                    textContent: `.-dashed-line:hover {opacity:1 !important;}`
                    .concat(`#-reset-menu-preview:hover {background-color:white !important;border:4px solid black !important;color:black !important;}`)
                    .concat(`.control-button {flex:1;background-color:black;border-radius:7px;border:2px solid black;color:white;font-family:Black;font-size:20px;padding:0 10px;cursor:pointer;}`)
                    .concat(`.control-button:hover {background-color:white !important;border:2px solid black !important;color:black !important;}`)
                }),
                this.cc('div', {
                    style: `position:relative;display:flex;flex-direction:column;-webkit-box-align:center;align-items:center;background-color:rgb(255,255,255);padding:25px 30px;border-radius:12px;transform:scale(${this.getScale()});`,
                    children: [
                        this.cc('button', {
                            style: 'border:none;background:none;position:absolute;top:15px;right:15px;width:30px;height:30px;display:flex;-webkit-box-align:center;align-items:center;-webkit-box-pack:center;justify-content:center;cursor:pointer;',
                            children: [
                                this.cc('div', {
                                    style: 'font-family:ico;color:rgb(172,167,198);font-size:25px;',
                                    textContent: String.fromCharCode(59654),
                                })
                            ],
                            onclick: this.removeMenu.bind(this)
                        }),
                        this.cc('div', {
                            style: 'display:flex;flex-direction:column;align-items:center;margin-bottom:20px;',
                            children: [
                                this.cc('div', {
                                    style: 'color:black;font-family:Black;font-size:40px;',
                                    textContent: this.texts.loadFile
                                })
                            ]
                        }),
                        this.cc('div', {
                            style: 'display:flex;flex-direction:row;',
                            className: '-flex-settings',
                            children: [
                                this.cc('div', {
                                    className: '-screen-pad-with-bottom',
                                    style: 'display:flex;flex-direction:column',
                                    children: [
                                        this.cc('div', {
                                            className: '.m-screen',
                                            style: 'width:758px;height:424px;',
                                            children: [
                                                this.cc('div', {
                                                    style: `width:758px;height:424px;position:absolute;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0.3;`.concat(this.state.iCanvas ? 'display:none;' : ''),
                                                    children: [
                                                        this.cc('div', {
                                                            style: 'display:flex;flex-direction:column;align-items:center;',
                                                            children: [
                                                                this.cc('div', {
                                                                    style: 'algin-text:center;font-family:Black;font-size:50px;',
                                                                    textContent: this.state.currentFile ? this.state.currentFile.name : this.texts.inputOrInsert
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                }),
                                                this.cc('div', {
                                                    className: '-dashed-line',
                                                    style: `position:absolute;border:4px dashed black;border-radius:10px;opacity:0.3;`.concat(this.state.iCanvas ? 'display:none;' : ''),
                                                    children: [
                                                        this.cc('input', {
                                                            type: "file",
                                                            accept: "image/*",
                                                            style: `width:758px;height:424px;cursor:pointer;position:relative;opacity:0;`,
                                                            ondragenter: event => {
                                                                event.preventDefault();
                                                            },
                                                            ondrop: event => {
                                                                event.preventDefault();
                                                                this.imageDataInput(event, 'fileinput-ondrop');
                                                            },
                                                            onchange: event => {
                                                                this.imageDataInput(event, 'fileinput-onchange');
                                                            }
                                                        })
                                                    ]
                                                }),
                                                this.cc('div', {
                                                    style: 'position:absolute;background-repeat:repeat;background-size:22px;image-rendering:pixelated;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAABb2lDQ1BpY2MAACiRdZHNK0RRGMZ/M4gYLFASNYshC0qUZKVRZjMsxiiDzdw7986o+bjdO5MmW2VjoSzExtfCf8BW2VJKkZKs/AG+Npqu97hqJM7t3PfXc87zds5zwB/N6jmndghy+aIdi4SD84mFYP0TTbTQQQ/jSd2xpmen4vw73m/wqXo9qHr9v+/P0ZQyHB18DcKjumUXhSeEoytFS/GGcLueSaaE94UHbDmg8IXSNY8fFac9flVsx2OT4Fc9g+kfrP1gPWPnhPuFQ7lsSf8+j7pJwMjPzUrtktmNQ4wIYYJolFgmS5FBqXnJ7G/f0JdvhoJ4dPlblLHFkSYj3gFRS9LVkGqKbsiXpaxy/52nY44Me90DYah7cN2XXqjfgsqm634cuG7lEGru4Sxf9Rckp7E30TerWmgPWtfg5Lyqadtwug6dd1bSTn5JNTL9pgnPx9CcgLYraFz0svpe5+gW4qvyRJewswt9sr916RNJMmgsonGPPAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAABhJREFUCNdj3Lp1639RUVEGJhDx+vVrBgA9CAZhgyB+jwAAAABJRU5ErkJggg==);width:758px;height:424px;border:2px solid;'.concat(this.state.iCanvas ? '' : 'display:none;'),
                                                    children: [
                                                        this.state.canvas || (this.state.canvas = this.cc('canvas', {
                                                            style: 'width:758px;height:424px;position:absolute;',
                                                            width: 758,
                                                            height: 424
                                                        }))
                                                    ]
                                                }),
                                            ]
                                        }),
                                        this.cc('div', {
                                            style: 'display:flex;flex-direction:row;width:100%;margin-top:25px;gap:10px;',
                                            children: [
                                                this.cc('button', {
                                                    id: '-reset-menu-preview',
                                                    style: 'background-color:black;border-radius:7px;border:4px solid black;color:white;font-family:Black;font-size:28px;padding:0 30px;cursor:pointer;height:40px;',
                                                    textContent: this.texts.print,
                                                    onclick: () => {
                                                        this.print();
                                                    }
                                                }),
                                                this.cc('div', {
                                                    style: 'flex:1;display:flex;flex-direction:column;',
                                                    children: [
                                                        this.generateRange('Сжатие', this.constants.maxRatio, this.constants.minRatio, this.state.printRatio, 1, event => {
                                                            this.state.printRatio = Number(event.target.value);
                                                        }),
                                                        this.cc('div', {
                                                            style: 'font-family:Black;font-size:15px;',
                                                            textContent: this.texts.ratioDesc,
                                                        })
                                                    ]
                                                }),
                                                this.cc('button', {
                                                    id: '-reset-menu-preview',
                                                    style: 'background-color:black;border-radius:7px;border:4px solid black;color:white;font-family:Black;font-size:28px;padding:0 30px;cursor:pointer;height:40px;',
                                                    textContent: this.texts.clearImg,
                                                    onclick: () => {
                                                        this.state.canvas = null;
                                                        this.state.currentFile = null;
                                                        this.state.iCanvas = null;
                                                        this.updateMenu();
                                                    }
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ].concat(this.state.currentFile ? [
                                this.cc('div', {
                                    className: '-settings-plane',
                                    style: 'margin-left:30px;max-width:200px;width:200px;',
                                    children: [

                                        this.cc('div', {
                                            style: 'display:flex;flex-direction:column;gap:3px;',
                                            children: [
                                                this.cc('button', {
                                                    className: 'control-button',
                                                    textContent: 'Растянуть на весь экран',
                                                    onclick: () => {
                                                        this.state.iCanvas.setCover();
                                                        this.state.iCanvas.print();
                                                        this.updateMenu();
                                                    }
                                                }),
                                                this.cc('button', {
                                                    className: 'control-button',
                                                    textContent: 'Центрировать',
                                                    onclick: () => {
                                                        this.state.iCanvas.setFitScale();
                                                        this.state.iCanvas.print();
                                                        this.updateMenu();
                                                    }
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ] : [])
                        })
                    ]
                })
            ]
        }, document.body);
    }

    generateRange(name, from, to, cur, step, inputCallback) {
        return this.cc('div', {
            style: 'display:flex;flex-direction:row;max-width:200px;gap:5px;width:200px;height:42px;',
            children: [
                this.cc('div', {
                    style: 'display:flex;align-items:center;justify-content:center;',
                    children: [
                        this.cc('div', {
                            style: 'color:black;font-family:Black;font-size:20px;',
                            textContent: name
                        })
                    ]
                }),
                this.cc('div', {
                    style: 'max-width:140px;min-width:140px;',
                    children: [
                        this.cc('div', {
                            style: 'display:flex;flex-direction:row;',
                            children: [
                                this.cc('div', {
                                    style: 'color:black;font-family:Black;font-size:14px;',
                                    textContent: from
                                }),
                                this.cc('div', {
                                    style: 'flex:1;display:flex;flex-direction:column;align-items:center;',
                                    children: [
                                        this.cc('div', {
                                            style: 'color:black;font-family:Black;font-size:14px;',
                                            textContent: Math.floor(to - (to - from) / 2)
                                        })
                                    ]
                                }),
                                this.cc('div', {
                                    style: 'color:black;font-family:Black;font-size:14px;',
                                    textContent: to
                                })
                            ]
                        }),
                        this.cc('input', {
                            style: 'width:100%;',
                            type: 'range',
                            min: from,
                            max: to,
                            step: step,
                            oninput: event => {
                                event.target.parentNode.parentNode.querySelector('#dispval').textContent = event.target.value;
                                inputCallback.call(this, event);
                            }
                        }, false, element => (element.value=cur)),
                    ]
                }),
                this.cc('div', {
                    style: 'display:flex;align-items:center;justify-content:center;',
                    children: [
                        this.cc('div', {
                            style: 'color:black;font-family:Black;font-size:20px;',
                            id: 'dispval',
                            textContent: cur
                        })
                    ]
                })
            ]
        });
    }

    setTriggerOnElement(selector, callback, action='addedNodes', once=false, searchIn=document) {
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                const nodes = mutation[action] || [];
                for (const node of nodes) {
                    const element = node.matches && node.matches(selector) ? node : (node.querySelector ? node.querySelector(selector) : null);
                    if (element) {
                        if (once) {
                            observer.disconnect();
                            return callback(element);
                        } else {
                            callback(element);
                        }
                    }
                }
            }
        });

        observer.observe(searchIn, {
            attributes: false,
            childList: true,
            subtree: true
        });

        return observer;
    }

}

const AD = new AutoDraw();
AD.init();

