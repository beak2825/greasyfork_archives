// ==UserScript==
// @name         MyBot
// @description  MyBot Fixed PPCLIENTT
// @version      1.8.5
// @author       SamaelWired
// @namespace    https://greasyfork.org/users/976572
// @match        https://pixelplace.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelplace.io
// @license      MIT
// @grant        none
// @run-at       document-start
// @require      https://greasyfork.org/scripts/479121-mybot/code/MyBot.js?version=1275783
// @require      https://greasyfork.org/scripts/438620-workertimer/code/WorkerTimer.js?version=1009025
// @require      https://greasyfork.org/scripts/479125-mybot-cwss/code/MyBot%20CWSS.js?version=1275822
// @require      https://update.greasyfork.org/scripts/479127/1512711/MyBot%20NewColors.js
// @require      https://greasyfork.org/scripts/479128-mybot-maploader/code/MyBot%20MapLoader.js?version=1275793
// @require      https://greasyfork.org/scripts/479129-mybot-imageloader/code/MyBot%20ImageLoader.js?version=1275794
// @require      https://greasyfork.org/scripts/479130-mybot-tools/code/MyBot%20Tools.js?version=1275795
// @require      https://greasyfork.org/scripts/479131-mybot-compiler/code/MyBot%20Compiler.js?version=1275798
// @require      https://greasyfork.org/scripts/479132-mybot-parallel-connections/code/MyBot%20Parallel%20Connections.js?version=1275800
// @downloadURL https://update.greasyfork.org/scripts/479134/MyBot.user.js
// @updateURL https://update.greasyfork.org/scripts/479134/MyBot.meta.js
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
    const MyBot = window.MyBot || {modules:{}};
    window.MyBot = MyBot;
    MyBot.CWSS = CWSS;

    const {ImageLoader, Tools} = MyBot.modules;
    const config = MyBot.config;

    config.timer = WorkerTimer;
    config.packetSpeed = 45;
    config.subscribe(...Object.values(MyBot.modules).map(({config}) => config).filter(Boolean));
    MyBot.modules.Compiler.compile();

    Object.defineProperty(MyBot, 'ignore', {enumerable:true,configurable:true,get(){
        let b = !MyBot.ws.ignore;
        MyBot.sockets.map(ws=>ws.ignore = b);
        return b;
    },set(v){
        MyBot.sockets.map(ws=>ws.ignore = v);
        return v;
    }});

    MyBot.order = new Proxy({}, {
        get(_, type) {
            MyBot.config.order = type;
            return Tools.order[type]
            .finish(queue => {
                MyBot.pos = 0;
                MyBot.queue = queue;
                console.log('order finished');
            })
            .center([MyBot.map.width/2, MyBot.map.height/2])
            .silent(MyBot.config.silent)
            .start(MyBot.queue);
        }
    });

    MyBot.mode = mode => {
        if (mode == 'none') {
            MyBot.onclick = () => true;
            return true;
        }

        if (mode == 'rainbow_hole_v2') {
            MyBot.onclick = (x,y,pixel) => {
                const {width, height} = MyBot.map;
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

                    MyBot.set(x, y, clr);
                })
                .finish((taskId) => {
                    console.log('shader finished');
                    Tools.order[config.order]
                    .finish(queue => {
                        MyBot.pos = 0;
                        MyBot.queue = queue;
                        console.log('order finished');
                    })
                    .silent(MyBot.config.silent)
                    .center([width/2, height/2])
                    .start(MyBot.queue);
                })
                .start(MyBot.map);

                return false;
            };
            return true;
        }

        if (mode == 'rainbow_hole') {
            MyBot.onclick = (x,y,pixel) => {
                const {width, height} = MyBot.map;
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
                    MyBot.set(x, y, clr);
                })
                .finish((taskId) => {
                    console.log('shader finished');
                    Tools.order[config.order]
                    .finish(queue => {
                        MyBot.pos = 0;
                        MyBot.queue = queue;
                        console.log('order finished');
                    })
                    .silent(MyBot.config.silent)
                    .center([width/2, height/2])
                    .start(MyBot.queue);
                })
                .start(MyBot.map);

                return false;
            };
            return true;
        }

        if (mode == 'border_rainbow') {
            MyBot.onclick = (x,y,pixel) => {
                const areaSize = 5;
                const has = areaSize>>1;
                const padding = 2;
                const {width, height, pixels} = MyBot.map;

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
                        MyBot.set(x, y, Tools.wheel);
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
                        MyBot.set(x, y, 5);
                        return;
                    }

                    MyBot.set(x, y, 5);
                })
                .finish((taskId) => {
                    console.log('shader finished');
                    Tools.order[config.order]
                    .finish(queue => {
                        MyBot.pos = 0;
                        MyBot.queue = queue;
                        console.log('order finished');
                    })
                    .silent(MyBot.config.silent)
                    .center([width/2, height/2])
                    .start(MyBot.queue);
                })
                .start(MyBot.map);

                return false;
            };
            return true;
        }

        if (mode == 'image') {
            MyBot.onclick = (x,y,pixel) => {
                ImageLoader.loadImage
                .finish(([pixels, w, h]) => {
                    if (config.order == 'fromCenter') x -= w/2>>0;
                    if (config.order == 'fromCenter') y -= h/2>>0;

                    Tools.image
                    .tick((x,y,p) => {
                        if (!(x>=0&&y>=0&&x<MyBot.map.width&&y<MyBot.map.height)) return;
                        MyBot.set(x, y, p);
                    })
                    .finish((taskId) => {
                        console.log('image finished');
                        Tools.order[config.order]
                        .finish(queue => {
                            MyBot.pos = 0;
                            MyBot.queue = queue;
                            console.log('order finished');
                        })
                        .silent(MyBot.config.silent)
                        .center([x+w/2, y+h/2])
                        .start(MyBot.queue);
                    })
                    .start(pixels, x,y,w,h);
                }).start();

                return false;
            };
            return true;
        }
    };

    MyBot.lock = true;
    MyBot.mode('image');
})();