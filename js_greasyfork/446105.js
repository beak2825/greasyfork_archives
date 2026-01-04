// ==UserScript==
// @name         PP-Client
// @name:ru      PP-Client
// @description  Pixel Place Client
// @description:ru  Pixel Place Клиент
// @version      1.6.2.1
// @author       0vC4
// @namespace    https://greasyfork.org/users/670183
// @match        https://pixelplace.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelplace.io
// @license      MIT
// @grant        none
// @run-at       document-start
// @require      https://greasyfork.org/scripts/445776-ppab/code/PPAB.js?version=1056000
// @require      https://greasyfork.org/scripts/438620-workertimer/code/WorkerTimer.js?version=1009025
// @require      https://greasyfork.org/scripts/438408-cwss/code/CWSS.js?version=1042744
// @require      https://greasyfork.org/scripts/444949-ppconf/code/PPConf.js?version=1050254
// @require      https://greasyfork.org/scripts/443803-ppml/code/PPML.js?version=1050258
// @require      https://greasyfork.org/scripts/443894-ppil/code/PPIL.js?version=1050256
// @require      https://greasyfork.org/scripts/443807-ppt/code/PPT.js?version=1050374
// @require      https://greasyfork.org/scripts/443844-ppcc/code/PPCC.js?version=1050358
// @require      https://greasyfork.org/scripts/443907-pppc/code/PPPC.js?version=1050383
// @downloadURL https://update.greasyfork.org/scripts/446105/PP-Client.user.js
// @updateURL https://update.greasyfork.org/scripts/446105/PP-Client.meta.js
// ==/UserScript==
Object.defineProperty(window.console, 'log', {configurable:false,enumerable:true,writable:false,value:console.log});
Object.defineProperty(window, 'setInterval', {configurable:false,enumerable:true,writable:false,value:WorkerTimer.setInterval});
Object.defineProperty(window, 'clearInterval', {configurable:false,enumerable:true,writable:false,value:WorkerTimer.clearInterval});
Object.defineProperty(window, 'setTimeout', {configurable:false,enumerable:true,writable:false,value:WorkerTimer.setTimeout});
Object.defineProperty(window, 'clearTimeout', {configurable:false,enumerable:true,writable:false,value:WorkerTimer.clearTimeout});
setInterval(() => {
    const _18 = document.querySelector('[data-id="alert"]');
    if (!_18 || _18.style.display != 'flex') return;
    document.querySelector('.nsfw-continue').click();
});
(() => {
    const PPAClient = window.PPAClient || {modules:{}};
    window.PPAClient = PPAClient;
    PPAClient.CWSS = CWSS;

    const {ImageLoader, Tools} = PPAClient.modules;
    const config = PPAClient.config;

    config.timer = WorkerTimer;
    config.packetSpeed = 45;
    config.subscribe(...Object.values(PPClient.modules).map(({config}) => config).filter(Boolean));
    PPClient.modules.Compiler.compile();

    Object.defineProperty(PPClient, 'ignore', {enumerable:true,configurable:true,get(){
        let b = !PPClient.ws.ignore;
        PPClient.sockets.map(ws=>ws.ignore = b);
        return b;
    },set(v){
        PPClient.sockets.map(ws=>ws.ignore = v);
        return v;
    }});

    PPClient.order = new Proxy({}, {
        get(_, type) {
            PPClient.config.order = type;
            return Tools.order[type]
            .finish(queue => {
                PPClient.pos = 0;
                PPClient.queue = queue;
                console.log('order finished');
            })
            .center([PPClient.map.width/2, PPClient.map.height/2])
            .silent(PPClient.config.silent)
            .start(PPClient.queue);
        }
    });
    
    PPClient.mode = mode => {
        if (mode == 'none') {
            PPClient.onclick = () => true;
            return true;
        }
 
        if (mode == 'rainbow_hole_v2') {
            PPClient.onclick = (x,y,pixel) => {
                const {width, height} = PPClient.map;
                const {palette, zero} = Tools.args;
 
                let clr = 0;
                let perc = null;

                Tools.shader
                .tick((x,y,p) => {
                    const dx = (x/4-width/8)**2;
                    const dy = (y-height/2)**2;
                    const dist = (dx+dy)**.75;
 
                    const percent = 1000*dist/(height/2)>>0;
                    if (percent != perc) {
                        perc = percent;
                        clr = perc%palette.length;
                        while (palette[clr] == zero) {
                            clr++;
                            if (clr > palette.length-1) clr = 0;
                        }
                    }
 
                    PPClient.set(x, y, clr);
                })
                .finish((taskId) => {
                    console.log('shader finished');
                    Tools.order[config.order]
                    .finish(queue => {
                        PPClient.pos = 0;
                        PPClient.queue = queue;
                        console.log('order finished');
                    })
                    .silent(PPClient.config.silent)
                    .center([width/2, height/2])
                    .start(PPClient.queue);
                })
                .start(PPClient.map);

                return false;
            };
            return true;
        }
 
        if (mode == 'rainbow_hole') {
            PPClient.onclick = (x,y,pixel) => {
                const {width, height} = PPClient.map;
                const {palette, zero} = Tools.args;
 
                let clr = 0;
                let perc = null;

                Tools.shader
                .tick((x,y,p) => {
                    const dist = ((x-width/2)**2+(y-height/2)**2)**0.5;
                    const percent = 1000*dist/(height/2)>>0;
                    if (percent != perc) {
                        perc = percent;
                        clr = perc%palette.length;
                        while (palette[clr] == zero) {
                            clr++;
                            if (clr > palette.length-1) clr = 0;
                        }
                    }
                    PPClient.set(x, y, clr);
                })
                .finish((taskId) => {
                    console.log('shader finished');
                    Tools.order[config.order]
                    .finish(queue => {
                        PPClient.pos = 0;
                        PPClient.queue = queue;
                        console.log('order finished');
                    })
                    .silent(PPClient.config.silent)
                    .center([width/2, height/2])
                    .start(PPClient.queue);
                })
                .start(PPClient.map);

                return false;
            };
            return true;
        }
 
        if (mode == 'border_rainbow') {
            PPClient.onclick = (x,y,pixel) => {
                const areaSize = 5;
                const has = areaSize>>1;
                const padding = 2;
                const {width, height, pixels} = PPClient.map;

                Tools.shader
                .tick((x,y,p) => {
                    if (x < areaSize || x > width-1-areaSize || y < areaSize || y > height-1-areaSize) return;
 
                    let start = (x-has)+(y-has)*width;
                    let area = [];
                    for (let i = 0; i < areaSize; i++) {
                        const offset = start+i*width;
                        area.push(...pixels.slice(offset, offset+areaSize));
                    }
 
                    if (area.find(p => p === 255)) {
                        PPClient.set(x, y, Tools.wheel);
                        return;
                    }
 
 
 
                    const size = areaSize+padding*2;
                    const hs = has+padding;
 
                    if (x < size || x > width-1-size || y < size || y > height-1-size) return;
 
                    start = (x-hs)+(y-hs)*width;
                    area = [];
                    for (let i = 0; i < size; i++) {
                        const offset = start+i*width;
                        area.push(...pixels.slice(offset, offset+size));
                    }
 
                    if (area.find(p => p === 255)) {
                        PPClient.set(x, y, 5);
                        return;
                    }
 
                    PPClient.set(x, y, 5);
                })
                .finish((taskId) => {
                    console.log('shader finished');
                    Tools.order[config.order]
                    .finish(queue => {
                        PPClient.pos = 0;
                        PPClient.queue = queue;
                        console.log('order finished');
                    })
                    .silent(PPClient.config.silent)
                    .center([width/2, height/2])
                    .start(PPClient.queue);
                })
                .start(PPClient.map);

                return false;
            };
            return true;
        }

        if (mode == 'image') {
            PPClient.onclick = (x,y,pixel) => {
                ImageLoader.loadImage
                .finish(([pixels, w, h]) => {
                    if (config.order == 'fromCenter') x -= w/2>>0;
                    if (config.order == 'fromCenter') y -= h/2>>0;

                    Tools.image
                    .tick((x,y,p) => {
                        if (!(x>=0&&y>=0&&x<PPClient.map.width&&y<PPClient.map.height)) return;
                        PPClient.set(x, y, p);
                    })
                    .finish((taskId) => {
                        console.log('image finished');
                        Tools.order[config.order]
                        .finish(queue => {
                            PPClient.pos = 0;
                            PPClient.queue = queue;
                            console.log('order finished');
                        })
                        .silent(PPClient.config.silent)
                        .center([x+w/2, y+h/2])
                        .start(PPClient.queue);
                    })
                    .start(pixels, x,y,w,h);
                }).start();

                return false;
            };
            return true;
        }
    };

    PPClient.lock = true;
    PPClient.mode('image');
})();
// 0vC4#7152 aka Palette